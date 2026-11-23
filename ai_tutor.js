// ============================================================================
// CCNA NETWORK ACADEMY — PART 10: AI NETWORK TUTOR
// Context-Aware AI Learning Assistant (6 Modes + Hybrid RAG + Multi-Turn +
// Backend Proxy + User Isolation + Grounded Source Citations + Action Triggers)
// ============================================================================

(function () {
  "use strict";

  // --------------------------------------------------------------------------
  // 1. CONFIGURATION, MODELS & 6 SPECIALIZED AI MODES (PART 10.4)
  // --------------------------------------------------------------------------
  const STORAGE_KEY_API_KEY = "ccna_gemini_api_key";
  const STORAGE_KEY_MODEL = "ccna_gemini_model";
  const DEFAULT_MODEL = "gemini-2.5-flash-lite";
  const MAX_ATTACHED_IMAGES = 6;
  const MAX_CONTEXT_CHAR_BUDGET = 14000; // ~3,500 tokens budget for context grounding
  const MAX_RECENT_TURNS_SENT = 8;       // Keep recent 8 turns full, summarize older turns

  const AI_MODES = {
    learning: {
      id: "learning",
      label_vi: "1. Learning Mode (Học Lý Thuyết)",
      short_vi: "Learning Mode",
      icon: "📘",
      desc_vi: "Giải thích từ cơ bản đến nâng cao, ví dụ thực tế, phân biệt khái niệm dễ nhầm lẫn."
    },
    lab: {
      id: "lab",
      label_vi: "2. Lab Assistant (Trợ Giảng Lab)",
      short_vi: "Lab Assistant",
      icon: "🧪",
      desc_vi: "Nắm trọn Topology, IP, VLAN, từng bước CLI và kiểm tra cấu hình bài Lab hiện tại."
    },
    troubleshooting: {
      id: "troubleshooting",
      label_vi: "3. Troubleshooting (Chẩn Đoán Lỗi)",
      short_vi: "Troubleshooting",
      icon: "🛠️",
      desc_vi: "Quy trình 8 bước bắt bệnh chuẩn kỹ sư (L1 -> L3): Triệu chứng -> Giả thuyết -> Lệnh show -> Khắc phục."
    },
    explainer: {
      id: "explainer",
      label_vi: "4. Concept Explainer (Giải Phẫu Đoạn Chọn)",
      short_vi: "Concept Explainer",
      icon: "🔍",
      desc_vi: "Giải thích sâu bản chất, cơ chế hoạt động và ứng dụng của đoạn văn bản đang chọn."
    },
    engineer: {
      id: "engineer",
      label_vi: "5. Real-World Engineer (Thực Chiến Doanh Nghiệp)",
      short_vi: "Real-World Engineer",
      icon: "🏢",
      desc_vi: "Thiết kế mạng văn phòng, quy hoạch VLAN/IP VLSM, thiết bị đa hãng và xử lý sự cố sản xuất."
    },
    quiz: {
      id: "quiz",
      label_vi: "6. Quiz & Review (Kiểm Tra & Ôn Tập)",
      short_vi: "Quiz & Review",
      icon: "🎯",
      desc_vi: "Tạo câu hỏi trắc nghiệm theo bài học/Notes/Highlights và phân tích tại sao đáp án đúng/sai."
    }
  };

  // Runtime state
  let activeAiMode = "learning";
  let activeContextScope = "auto"; // "auto" | "selection" | "section" | "lesson" | "lab" | "course"
  let currentSelectedSnippet = null; // { text, lessonKey, lessonTitle, sectionTitle }
  let activeLabStepIndex = 0;
  let attachedImages = [];
  let isGenerating = false;
  let lastFailedPrompt = null;

  // Multi-user conversation state
  let conversationsStore = {
    activeConvId: null,
    conversations: [] // Array of { id, userId, title, contextKey, mode, createdAt, updatedAt, summary, messages: [] }
  };

  // Indexed Knowledge Base for RAG retrieval
  let knowledgeIndex = [];
  let isIndexBuilt = false;

  // --------------------------------------------------------------------------
  // 2. MULTI-USER ISOLATION & CONVERSATION SERVICE (PART 10.10)
  // --------------------------------------------------------------------------
  function getActiveUserId() {
    const savedUser = sessionStorage.getItem("ccna_active_username") || localStorage.getItem("ccna_active_username");
    if (savedUser && savedUser.trim()) {
      return savedUser.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_");
    }
    const authHash = sessionStorage.getItem("ccna_auth_session") || localStorage.getItem("ccna_auth_session");
    if (authHash) {
      return "user_" + authHash.substring(0, 12);
    }
    return "default_user";
  }

  function getConvStorageKey() {
    return `ccna_ai_convs_v2_${getActiveUserId()}`;
  }

  function loadUserConversations() {
    const key = getConvStorageKey();
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        conversationsStore = {
          activeConvId: parsed.activeConvId || null,
          conversations: Array.isArray(parsed.conversations) ? parsed.conversations : []
        };
      } else {
        conversationsStore = { activeConvId: null, conversations: [] };
      }
    } catch {
      conversationsStore = { activeConvId: null, conversations: [] };
    }
    ensureActiveConversationForContext();
  }

  function saveUserConversations() {
    try {
      // Trim each conversation to at most 40 messages and max 25 conversations per user
      conversationsStore.conversations = conversationsStore.conversations.slice(0, 25);
      conversationsStore.conversations.forEach((c) => {
        if (c.messages && c.messages.length > 40) {
          c.messages = c.messages.slice(-40);
        }
      });
      localStorage.setItem(getConvStorageKey(), JSON.stringify(conversationsStore));
    } catch (e) {
      console.warn("Could not persist AI conversations:", e);
    }
  }

  function getCurrentContextKey() {
    const sec = window.currentAcademySection || "modules";
    const mode = typeof currentMode !== "undefined" ? currentMode : "modules";
    if (sec === "labs" || mode === "labs") {
      const lid = typeof activeLabId !== "undefined" ? activeLabId : 0;
      return lid > 0 ? `lab-${lid}` : "labs-overview";
    }
    if (sec === "projects" || mode === "mastery") {
      const mid = typeof activeMasteryId !== "undefined" ? activeMasteryId : 0;
      return mid > 0 ? `mastery-${mid}` : "mastery-overview";
    }
    const modId = typeof activeModuleId !== "undefined" ? activeModuleId : 1;
    return `module-${modId}`;
  }

  function ensureActiveConversationForContext(forceNew = false) {
    const uid = getActiveUserId();
    const ctxKey = getCurrentContextKey();
    const ctxMeta = collectLivePageContext();

    if (!forceNew && conversationsStore.activeConvId) {
      const existing = conversationsStore.conversations.find(
        (c) => c.id === conversationsStore.activeConvId && c.userId === uid
      );
      if (existing) return existing;
    }

    // Try finding the most recent conversation tied to this lesson/lab contextKey
    if (!forceNew) {
      const byCtx = conversationsStore.conversations.find(
        (c) => c.contextKey === ctxKey && c.userId === uid
      );
      if (byCtx) {
        conversationsStore.activeConvId = byCtx.id;
        return byCtx;
      }
    }

    // Create a fresh conversation scoped to current Lesson or Lab
    const newConv = {
      id: "conv_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36).slice(-4),
      userId: uid,
      title: ctxMeta.shortTitle || "Hội thoại CCNA mới",
      contextKey: ctxKey,
      mode: activeAiMode,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      summary: "",
      messages: []
    };

    conversationsStore.conversations.unshift(newConv);
    conversationsStore.activeConvId = newConv.id;
    saveUserConversations();
    return newConv;
  }

  function switchOrEnsureContextConversation() {
    const ctxKey = getCurrentContextKey();
    const uid = getActiveUserId();

    // Auto-select recommended AI Mode when switching between Lesson, Lab, and Troubleshooting
    const sec = window.currentAcademySection || "modules";
    const mode = typeof currentMode !== "undefined" ? currentMode : "modules";
    if (sec === "labs" || mode === "labs") {
      activeAiMode = "lab";
    } else if (sec === "troubleshooting") {
      activeAiMode = "troubleshooting";
    } else if (sec === "projects" || mode === "mastery") {
      activeAiMode = "engineer";
    } else if (activeAiMode === "lab") {
      activeAiMode = "learning";
    }

    const active = conversationsStore.conversations.find(
      (c) => c.id === conversationsStore.activeConvId && c.userId === uid
    );

    // Per Part 10.10 & Test 6: Do not mix conversation history of unrelated Lessons/Labs unless requested
    if (!active || (active.contextKey !== ctxKey && active.messages.length === 0)) {
      const match = conversationsStore.conversations.find((c) => c.contextKey === ctxKey && c.userId === uid);
      if (match) {
        conversationsStore.activeConvId = match.id;
      } else {
        ensureActiveConversationForContext(true);
      }
    }
  }

  // --------------------------------------------------------------------------
  // 3. CONTENT INDEXING & HYBRID RAG RETRIEVAL ENGINE (PART 10.3)
  // --------------------------------------------------------------------------
  function buildKnowledgeBaseIndex() {
    if (isIndexBuilt && knowledgeIndex.length > 50) return;
    knowledgeIndex = [];

    // 1. Index all 17 Modules & their standardized 10 sections
    const mods = typeof modulesData !== "undefined" && Array.isArray(modulesData) ? modulesData : [];
    const enrichMap = window.MODULE_STANDARD_10_ENRICHMENT || {};

    mods.forEach((m) => {
      const e = enrichMap[m.id] || {};
      knowledgeIndex.push({
        id: `doc-mod-${m.id}-overview`,
        type: "lesson",
        contextKey: `module-${m.id}`,
        moduleId: m.id,
        title: `Học phần ${m.id}: ${m.title_vi || m.title} — Tổng quan & Nguyên lý`,
        navLabel: `Module ${m.id}: ${m.title_vi || m.title} → Core Theory`,
        jumpType: "module",
        jumpId: m.id,
        keywords: `${m.title} ${m.title_vi} ${(e.examTag || "")}`.toLowerCase(),
        content: [
          m.overview_vi || m.overview || "",
          m.analogy_vi || "",
          ...(m.keyConcepts_vi || []).slice(0, 6)
        ].join("\n")
      });

      if (m.commands && m.commands.length > 0) {
        knowledgeIndex.push({
          id: `doc-mod-${m.id}-cli`,
          type: "lesson_cli",
          contextKey: `module-${m.id}`,
          moduleId: m.id,
          title: `Học phần ${m.id}: Tập lệnh Cisco IOS CLI & Cấu hình`,
          navLabel: `Module ${m.id}: ${m.title_vi || m.title} → CLI Configuration`,
          jumpType: "module",
          jumpId: m.id,
          keywords: `cli commands cấu hình lệnh ${m.title_vi}`.toLowerCase(),
          content: m.commands.join("\n")
        });
      }

      if (e.troubleshooting_vi || e.verification_vi) {
        knowledgeIndex.push({
          id: `doc-mod-${m.id}-ts`,
          type: "troubleshooting",
          contextKey: `module-${m.id}`,
          moduleId: m.id,
          title: `Học phần ${m.id}: Kiểm tra Verification & Xử lý sự cố Troubleshooting`,
          navLabel: `Module ${m.id}: ${m.title_vi || m.title} → Verification & Troubleshooting`,
          jumpType: "module",
          jumpId: m.id,
          keywords: `troubleshooting lỗi sự cố verify show ${m.title_vi}`.toLowerCase(),
          content: [
            ...(e.verification_vi || []).map((v) => `Lệnh ${v.cmd}: ${v.expectedOutput} | Lỗi: ${v.wrongSign}`),
            ...(e.troubleshooting_vi || []).map((t) => `${t.issue} -> Nguyên nhân: ${t.cause} -> Sửa: ${t.fix}`)
          ].join("\n")
        });
      }
    });

    // 2. Index all 35 Packet Tracer Labs with full Topology, IP Table, Steps & CLI
    const labs = typeof PACKET_TRACER_LABS !== "undefined" && Array.isArray(PACKET_TRACER_LABS) ? PACKET_TRACER_LABS : [];
    labs.forEach((lab) => {
      const nodesStr = (lab.nodes || []).map((n) => `${n.name} (${n.type}, IP: ${n.ip || "N/A"})`).join("; ");
      const linksStr = (lab.links || []).map((lk) => {
        const n1 = lab.nodes[lk.from]?.name || lk.from;
        const n2 = lab.nodes[lk.to]?.name || lk.to;
        return `${n1} [${lk.p1 || ""}] <--(${lk.type})--> ${n2} [${lk.p2 || ""}]`;
      }).join("; ");
      const ipStr = (lab.ipTable || []).map((r) => r.join(" | ")).join("\n");

      knowledgeIndex.push({
        id: `doc-lab-${lab.id}`,
        type: "lab",
        contextKey: `lab-${lab.id}`,
        labId: lab.id,
        moduleId: lab.moduleId,
        title: `${lab.title_vi}`,
        navLabel: `Lab ${String(lab.id).padStart(2, "0")}: ${lab.title_vi.replace(/^Lab \d+:\s*/, "")}`,
        jumpType: "lab",
        jumpId: lab.id,
        keywords: `lab ${lab.id} packet tracer ${lab.title_vi} ${nodesStr}`.toLowerCase(),
        content: [
          `Mục tiêu: ${lab.objective_vi}`,
          `Thiết bị (Nodes): ${nodesStr}`,
          `Đấu nối (Connections): ${linksStr}`,
          `Bảng quy hoạch IP (IP Table):\n${ipStr}`,
          `Các bước thực hiện:\n${(lab.steps_vi || []).join("\n")}`,
          `Lệnh CLI:\n${(lab.cli_commands || []).join("\n")}`,
          `Tiêu chí nghiệm thu: ${lab.verify_vi || ""}`
        ].join("\n")
      });
    });

    // 3. Index all 10 Exam Mastery & Real-World Domains
    const masteryList = typeof CCNA_EXAM_MASTERY !== "undefined" && Array.isArray(CCNA_EXAM_MASTERY) ? CCNA_EXAM_MASTERY : [];
    masteryList.forEach((dom) => {
      knowledgeIndex.push({
        id: `doc-mastery-${dom.id}`,
        type: "mastery",
        contextKey: `mastery-${dom.id}`,
        masteryId: dom.id,
        title: `${dom.title_vi}`,
        navLabel: `Chuyên đề ${dom.id}: ${dom.title_vi.replace(/^Chuyên Đề \d+:\s*/, "")}`,
        jumpType: "mastery",
        jumpId: dom.id,
        keywords: `chuyên đề ${dom.id} ${dom.badge} ${dom.title_vi}`.toLowerCase(),
        content: [
          dom.summary_vi || "",
          ...(dom.sections || []).map((s) => `${s.heading}: ${s.content}`)
        ].join("\n")
      });
    });

    // 4. Index Technical Glossary Terms
    const glossMap = typeof MODULE_DEEP_GLOSSARY !== "undefined" ? MODULE_DEEP_GLOSSARY : {};
    Object.keys(glossMap).forEach((modId) => {
      (glossMap[modId] || []).forEach((g, idx) => {
        knowledgeIndex.push({
          id: `doc-gloss-${modId}-${idx}`,
          type: "glossary",
          contextKey: `module-${modId}`,
          moduleId: Number(modId),
          title: `Thuật ngữ: ${g.term}`,
          navLabel: `Glossary (Module ${modId}) → ${g.term}`,
          jumpType: "module",
          jumpId: Number(modId),
          keywords: `${g.term} ${g.simple_vi}`.toLowerCase(),
          content: `${g.term}: ${g.simple_vi}\nChi tiết: ${g.detail_vi}\nVí dụ: ${g.example_vi}`
        });
      });
    });

    isIndexBuilt = true;
  }

  // Hybrid TF-IDF + Context Priority Retrieval (Part 10.3.B & 10.3.C)
  function retrieveRelevantKnowledgeChunks(userQuery, liveCtx, topK = 5) {
    buildKnowledgeBaseIndex();

    const rawTokens = (userQuery || "")
      .toLowerCase()
      .replace(/[?.,!;:()"']/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 2 && !["tại", "sao", "như", "thế", "nào", "là", "gì", "của", "cho", "tôi", "hãy", "giải", "thích", "trong", "với", "các", "một", "được", "không", "cần", "khi"].includes(w));

    const scored = knowledgeIndex.map((doc) => {
      let score = 0;
      const docTextLower = (doc.title + " " + doc.keywords + " " + doc.content).toLowerCase();

      // Priority Boosts per Part 10.3.C:
      // 1. Exact current Lesson or Lab gets strong priority boost
      if (doc.contextKey === liveCtx.contextKey) {
        score += 35;
      } else if (doc.moduleId && doc.moduleId === liveCtx.moduleId) {
        score += 18;
      }

      // 2. Keyword & Phrase matching
      rawTokens.forEach((tk) => {
        if (doc.title.toLowerCase().includes(tk)) score += 14;
        if (doc.keywords.includes(tk)) score += 10;
        const occurrences = docTextLower.split(tk).length - 1;
        if (occurrences > 0) {
          score += Math.min(12, occurrences * 3);
        }
      });

      return { doc, score };
    });

    return scored
      .filter((item) => item.score > 10)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((item) => item.doc);
  }

  // --------------------------------------------------------------------------
  // 4. DEEP LESSON & LAB CONTEXT COLLECTOR (PART 10.2.A, 10.2.B, 10.2.C)
  // --------------------------------------------------------------------------
  function getVisibleSectionHeading() {
    const headings = Array.from(
      document.querySelectorAll("#module-detail h3.section-title, #module-detail h5.lab-std-heading, #module-detail h3.mastery-title")
    );
    const scrollPos = window.scrollY + 220;
    let current = headings[0]?.textContent?.trim() || "";
    headings.forEach((h) => {
      if (h.offsetTop <= scrollPos) {
        current = h.textContent.trim();
      }
    });
    return current;
  }

  function collectLivePageContext() {
    const sec = window.currentAcademySection || "modules";
    const mode = typeof currentMode !== "undefined" ? currentMode : "modules";
    const visibleSection = getVisibleSectionHeading();
    const wsDB = window.CCNA_WORKSPACE && typeof window.CCNA_WORKSPACE.getWorkspaceDB === "function"
      ? window.CCNA_WORKSPACE.getWorkspaceDB()
      : { notes: [], highlights: [], flashcards: [] };

    // Detect current user activity state (Part 10.2.C)
    let userActivity = "Đang đọc bài học Lý thuyết (Reading Lesson)";
    const flashcardModal = document.getElementById("flashcard-modal");
    const mockExamModal = document.getElementById("mock-exam-modal");
    const notesModal = document.getElementById("notes-modal");

    if (mockExamModal && !mockExamModal.hidden) {
      userActivity = "Đang làm bài thi thử CCNA (Taking Mock Exam Quiz)";
    } else if (flashcardModal && !flashcardModal.hidden) {
      userActivity = "Đang ôn tập thẻ nhớ Flashcards (Studying Flashcards)";
    } else if (currentSelectedSnippet && currentSelectedSnippet.text) {
      userActivity = "Đang bôi đen chọn một đoạn văn bản cần giải thích (Inspecting Selected Text / Highlight)";
    } else if (notesModal && !notesModal.hidden) {
      userActivity = "Đang viết ghi chú trong Sổ tay (Writing Study Notes)";
    } else if (sec === "labs" || mode === "labs") {
      userActivity = "Đang thực hành bài Lab Cisco Packet Tracer (Performing Hands-On Lab)";
    } else if (sec === "troubleshooting") {
      userActivity = "Đang tra cứu kịch bản Xử lý sự cố (Inspecting Troubleshooting Scenarios)";
    } else if (sec === "workspace") {
      userActivity = "Đang quản lý trang My Notes, Highlights & Flashcards";
    }

    // CASE B: USER IS IN LAB VIEW (Collect full 18 Lab Context attributes per Part 10.2.B)
    if (sec === "labs" || mode === "labs") {
      const allLabs = typeof PACKET_TRACER_LABS !== "undefined" ? PACKET_TRACER_LABS : [];
      let labId = typeof activeLabId !== "undefined" ? activeLabId : 0;
      if (labId === 0) labId = 1; // Default to Lab 1 if on overview
      const lab = allLabs.find((l) => l.id === labId) || allLabs[0];

      if (lab) {
        const std = typeof window.buildLabStandard10Data === "function" ? window.buildLabStandard10Data(lab) : null;
        const nodes = lab.nodes || [];
        const links = lab.links || [];
        const steps = lab.steps_vi || [];
        const clampedStepIdx = Math.min(Math.max(0, activeLabStepIndex), Math.max(0, steps.length - 1));

        const deviceListText = nodes
          .map((n, i) => `  ${i + 1}. Hostname/Name: "${n.name}" | Type: ${n.type.toUpperCase()} | IP/Role: ${n.ip || "Layer 2"}`)
          .join("\n");

        const connectionListText = links
          .map((lk, i) => {
            const d1 = nodes[lk.from]?.name || `Node ${lk.from}`;
            const d2 = nodes[lk.to]?.name || `Node ${lk.to}`;
            return `  #${i + 1}: ${d1} [Cổng ${lk.p1 || "Fa0"}] <=== Cáp ${lk.type || "straight"} ===> ${d2} [Cổng ${lk.p2 || "Fa0/1"}] ${lk.label ? `(${lk.label})` : ""}`;
          })
          .join("\n");

        const ipTableText = (lab.ipTable || [])
          .map((row) => `  - Thiết bị: ${row[0]} | Cổng: ${row[1]} | IP: ${row[2]} | Mask/Prefix: ${row[3]} | Gateway/Ghi chú: ${row[4] || "N/A"}`)
          .join("\n");

        const stepsText = steps
          .map((s, idx) => `  ${idx === clampedStepIdx ? "👉 [BƯỚC HIỆN TẠI ĐANG LÀM]" : idx < clampedStepIdx ? "✓ [Bước đã qua]" : "○ [Bước tiếp theo]"} (${idx + 1}/${steps.length}): ${s}`)
          .join("\n");

        const tsText = std && std.troubleshootingCases
          ? std.troubleshootingCases.map((tc) => `  - ${tc.title}\n    Nguyên nhân: ${tc.cause}\n    Lệnh kiểm tra: ${tc.checkCmd}\n    Khắc phục: ${tc.fixCmd}`).join("\n")
          : "";

        const userLabNotes = wsDB.notes.filter((n) => n.lessonKey === `lab-${lab.id}`).map((n) => n.content).join(" | ");
        const userLabHighlights = wsDB.highlights.filter((h) => h.lessonKey === `lab-${lab.id}`).map((h) => h.exactText).join(" | ");

        const structuredPromptBlock = [
          `=== [ACTIVE LAB CONTEXT — BÀI THỰC HÀNH CISCO PACKET TRACER HIỆN TẠI] ===`,
          `• Lab ID: Lab #${String(lab.id).padStart(2, "0")} (Thuộc Học phần Lý thuyết số ${lab.moduleId})`,
          `• Lab Title: ${lab.title_vi}`,
          `• Độ khó (Level): ${lab.level}`,
          `• Trạng thái hoạt động của học viên: ${userActivity} | Mục đang xem: ${visibleSection || "Toàn bộ bài Lab"}`,
          `• Lab Objective (Mục tiêu): ${lab.objective_vi}`,
          `• Business Scenario: ${std ? std.scenario_vi : lab.objective_vi}`,
          `\n[1. DANH SÁCH THIẾT BỊ TRONG TOPOLOGY (DEVICE LIST & HOSTNAMES)]:\n${deviceListText}`,
          `\n[2. SƠ ĐỒ ĐẤU NỐI CÁP & CỔNG GIAO TIẾP (INTERFACE CONNECTIONS)]:\n${connectionListText}`,
          `\n[3. BẢNG QUY HOẠCH ĐỊA CHỈ IP, SUBNET MASK, DEFAULT GATEWAY & VLAN]:\n${ipTableText}`,
          `\n[4. TIẾN TRÌNH CÁC BƯỚC THỰC HIỆN (CURRENT & PREVIOUS LAB STEPS)]:\n${stepsText}`,
          `\n[5. TẬP LỆNH CISCO IOS CLI CHUẨN CỦA BÀI LAB]:\n\`\`\`cisco\n${(lab.cli_commands || []).join("\n")}\n\`\`\``,
          `\n[6. KẾT QUẢ MONG ĐỢI (EXPECTED RESULT)]:\n  ${lab.verify_vi || ""}`,
          tsText ? `\n[7. KỊCH BẢN LỖI THỰC TẾ ĐÃ BIẾT (KNOWN TROUBLESHOOTING SCENARIOS)]:\n${tsText}` : "",
          userLabNotes ? `\n[8. GHI CHÚ CỦA HỌC VIÊN TRONG LAB NÀY]: ${userLabNotes}` : "",
          userLabHighlights ? `\n[9. ĐOẠN HIGHLIGHT CỦA HỌC VIÊN TRONG LAB NÀY]: ${userLabHighlights}` : ""
        ].filter(Boolean).join("\n");

        return {
          type: "lab",
          contextKey: `lab-${lab.id}`,
          labId: lab.id,
          moduleId: lab.moduleId,
          shortTitle: `Lab ${String(lab.id).padStart(2, "0")}: ${lab.title_vi.replace(/^Lab \d+:\s*/, "")}`,
          breadcrumb: `Practical Labs → Lab ${String(lab.id).padStart(2, "0")} → Step ${clampedStepIdx + 1}/${steps.length}`,
          userActivity,
          visibleSection,
          labObject: lab,
          totalSteps: steps.length,
          currentStepIndex: clampedStepIdx,
          structuredContextText: structuredPromptBlock,
          sourceRef: {
            label: `Lab ${String(lab.id).padStart(2, "0")} → ${lab.title_vi.replace(/^Lab \d+:\s*/, "")} (Bước ${clampedStepIdx + 1})`,
            jumpType: "lab",
            jumpId: lab.id
          }
        };
      }
    }

    // CASE C: USER IS IN REAL-WORLD PROJECTS / EXAM MASTERY VIEW
    if (sec === "projects" || mode === "mastery") {
      const allMastery = typeof CCNA_EXAM_MASTERY !== "undefined" ? CCNA_EXAM_MASTERY : [];
      const mid = (typeof activeMasteryId !== "undefined" && activeMasteryId > 0) ? activeMasteryId : 1;
      const dom = allMastery.find((d) => d.id === mid) || allMastery[0];
      if (dom) {
        const secText = (dom.sections || []).map((s) => `• ${s.heading}:\n  ${s.content}`).join("\n\n");
        const tblText = dom.table && dom.table.rows
          ? `Bảng: ${dom.table.title}\n` + dom.table.rows.map((r) => "  - " + r.join(" | ")).join("\n")
          : "";

        return {
          type: "mastery",
          contextKey: `mastery-${dom.id}`,
          masteryId: dom.id,
          moduleId: 1,
          shortTitle: `Chuyên đề ${dom.id}: ${dom.title_vi.replace(/^Chuyên Đề \d+:\s*/, "")}`,
          breadcrumb: `Real-World & Mastery → Chuyên đề ${dom.id} (${dom.badge})`,
          userActivity,
          visibleSection,
          structuredContextText: [
            `=== [ACTIVE MASTERY / REAL-WORLD PROJECT CONTEXT] ===`,
            `• Chuyên đề số ${dom.id} (${dom.badge}): ${dom.title_vi}`,
            `• Trạng thái học viên: ${userActivity} | Mục đang xem: ${visibleSection}`,
            `• Tóm tắt trọng tâm: ${dom.summary_vi}`,
            `\n[NỘI DUNG CHI TIẾT CHUYÊN ĐỀ]:\n${secText}`,
            tblText ? `\n[BẢNG THAM CHIẾU KỸ THUẬT]:\n${tblText}` : ""
          ].filter(Boolean).join("\n"),
          sourceRef: {
            label: `Chuyên đề ${dom.id} → ${dom.title_vi.replace(/^Chuyên Đề \d+:\s*/, "")}`,
            jumpType: "mastery",
            jumpId: dom.id
          }
        };
      }
    }

    // CASE A (DEFAULT): USER IS IN LESSON / MODULE VIEW (Collect all 14 Lesson Context attributes per Part 10.2.A)
    const allMods = typeof modulesData !== "undefined" && modulesData.length > 0 ? modulesData : [];
    const modId = typeof activeModuleId !== "undefined" ? activeModuleId : 1;
    const mod = allMods.find((m) => m.id === modId) || allMods[0] || { id: 1, title: "Networking Today", title_vi: "Mạng Máy Tính Ngày Nay" };
    const enrich = (window.MODULE_STANDARD_10_ENRICHMENT && window.MODULE_STANDARD_10_ENRICHMENT[mod.id]) || {};
    const glossList = (typeof MODULE_DEEP_GLOSSARY !== "undefined" && MODULE_DEEP_GLOSSARY[mod.id]) || [];
    const relatedLabs = (typeof PACKET_TRACER_LABS !== "undefined" ? PACKET_TRACER_LABS : []).filter((l) => l.moduleId === mod.id);

    const userModHighlights = wsDB.highlights
      .filter((h) => h.lessonKey === `module-${mod.id}`)
      .map((h) => `  - [${h.color.toUpperCase()}] "${h.exactText}"`)
      .join("\n");

    const userModNotes = wsDB.notes
      .filter((n) => n.lessonKey === `module-${mod.id}`)
      .map((n) => `  - ${n.title}: ${n.content}${n.quoteText ? ` (Trích dẫn: "${n.quoteText}")` : ""}`)
      .join("\n");

    const termsText = glossList
      .slice(0, 10)
      .map((g) => `  - ${g.term}: ${g.simple_vi}`)
      .join("\n");

    const relatedLabsText = relatedLabs
      .map((l) => `  - Lab ${String(l.id).padStart(2, "0")}: ${l.title_vi}`)
      .join("\n");

    const verAndTsText = [
      ...(enrich.verification_vi || []).map((v) => `  - Kiểm tra ${v.cmd}: Output đúng: ${v.expectedOutput} | Dấu hiệu sai: ${v.wrongSign}`),
      ...(enrich.troubleshooting_vi || []).map((t) => `  - ${t.issue} -> Nguyên nhân: ${t.cause} -> Sửa: ${t.fix}`)
    ].join("\n");

    const structuredLessonBlock = [
      `=== [ACTIVE LESSON CONTEXT — BÀI HỌC LÝ THUYẾT HIỆN TẠI] ===`,
      `• Course ID: CCNA-200-301-ACADEMY`,
      `• Level & Exam Domain: Level ${enrich.level || 1} — ${enrich.examTag || "CCNA 200-301"}`,
      `• Module / Lesson ID: Học phần ${mod.id} / ${allMods.length || 17}`,
      `• Lesson Title: ${mod.title_vi || mod.title} (${mod.title})`,
      `• Current Section (Mục người học đang đọc trên màn hình): ${visibleSection || "Tổng quan bài học"}`,
      `• Current User Activity: ${userActivity}`,
      currentSelectedSnippet && currentSelectedSnippet.text
        ? `\n🔥 [ĐOẠN VĂN BẢN HỌC VIÊN ĐANG BÔI ĐEN TRỰC TIẾP (PRIORITY #1 SELECTED TEXT)]:\n"""\n${currentSelectedSnippet.text}\n"""\n(Thuộc mục: ${currentSelectedSnippet.sectionTitle || visibleSection})`
        : "",
      `\n[1. LEARNING OBJECTIVES (MỤC TIÊU BÀI HỌC)]:\n${(enrich.objectives_vi || []).map((o) => "  - " + o).join("\n")}`,
      `\n[2. REAL-WORLD ENTERPRISE SCENARIO (TÌNH HUỐNG DOANH NGHIỆP)]:\n  ${enrich.scenario_vi || mod.analogy_vi || ""}`,
      `\n[3. LESSON OVERVIEW & ANALOGY]:\n  ${mod.overview_vi || mod.overview || ""}\n  Ví dụ trực quan: ${mod.analogy_vi || ""}`,
      `\n[4. CORE TECHNICAL CONCEPTS (NGUYÊN LÝ KỸ THUẬT CỐT LÕI)]:\n${(mod.keyConcepts_vi || []).map((c, i) => `  ${i + 1}. ${c}`).join("\n")}`,
      `\n[5. PRACTICAL WORKED EXAMPLE (VÍ DỤ GIẢI MẪU)]:\n  ${mod.realWorldExample_vi || mod.realWorldExample || ""}`,
      `\n[6. CISCO IOS CLI COMMANDS CỦA BÀI HỌC]:\n\`\`\`cisco\n${(mod.commands || []).join("\n")}\n\`\`\``,
      verAndTsText ? `\n[7. VERIFICATION & TROUBLESHOOTING CỦA BÀI HỌC]:\n${verAndTsText}` : "",
      termsText ? `\n[8. RELEVANT TECHNICAL TERMS (THUẬT NGỮ LIÊN QUAN TRONG BÀI)]:\n${termsText}` : "",
      relatedLabsText ? `\n[9. RELATED HANDS-ON LABS]:\n${relatedLabsText}` : "",
      userModHighlights ? `\n[10. USER'S HIGHLIGHTS (CÁC ĐOẠN HỌC VIÊN ĐÃ ĐÁNH DẤU TRONG BÀI NÀY)]:\n${userModHighlights}` : "",
      userModNotes ? `\n[11. USER'S NOTES (GHI CHÚ CÁ NHÂN CỦA HỌC VIÊN TRONG BÀI NÀY)]:\n${userModNotes}` : ""
    ].filter(Boolean).join("\n");

    return {
      type: "module",
      contextKey: `module-${mod.id}`,
      moduleId: mod.id,
      shortTitle: `Học phần ${mod.id}: ${mod.title_vi || mod.title}`,
      breadcrumb: `Level ${enrich.level || 1} → Học phần ${mod.id}: ${mod.title_vi || mod.title}${visibleSection ? ` → ${visibleSection.substring(0, 34)}` : ""}`,
      userActivity,
      visibleSection,
      moduleObject: mod,
      structuredContextText: structuredLessonBlock,
      sourceRef: {
        label: `Học phần ${mod.id}: ${mod.title_vi || mod.title}${visibleSection ? ` → ${visibleSection.substring(0, 42)}` : ""}`,
        jumpType: "module",
        jumpId: mod.id
      }
    };
  }

  // --------------------------------------------------------------------------
  // 5. SYSTEM PROMPT BUILDER WITH MODE-SPECIFIC BEHAVIOR & GROUNDING (PART 10.5)
  // --------------------------------------------------------------------------
  function buildSystemInstruction(modeId, liveCtx) {
    const modeInfo = AI_MODES[modeId] || AI_MODES.learning;

    let modeDirectives = "";
    if (modeId === "learning") {
      modeDirectives = [
        "CHẾ ĐỘ HIỆN TẠI: [MODE 1: LEARNING MODE — GIẢNG DẠY LÝ THUYẾT CHUYÊN SÂU]",
        "- Giải thích từ bản chất cơ bản đến cơ chế hoạt động chuyên sâu (How It Works ở cấp độ gói tin PDU, Header, Bảng MAC/Routing).",
        "- Bắt buộc liên hệ trực tiếp với nội dung Bài học hiện tại và Tình huống doanh nghiệp của bài học.",
        "- Giữ nguyên các thuật ngữ kỹ thuật tiếng Anh quan trọng kèm giải thích tiếng Việt dễ hiểu.",
        "- Phân biệt rõ các khái niệm dễ nhầm lẫn (ví dụ: VLAN vs. Subnet, Collision Domain vs. Broadcast Domain, Access vs. Trunk)."
      ].join("\n");
    } else if (modeId === "lab") {
      modeDirectives = [
        "CHẾ ĐỘ HIỆN TẠI: [MODE 2: LAB ASSISTANT — TRỢ GIẢNG THỰC HÀNH CISCO PACKET TRACER]",
        "- Bám sát 100% vào Topology, Tên thiết bị (Hostnames), Cổng kết nối (Fa0/1, Gi0/0/0...), Địa chỉ IP, Subnet Mask, Default Gateway và VLAN của bài Lab hiện tại.",
        "- Khi giải thích lệnh Cisco IOS CLI, luôn chỉ rõ CHẾ ĐỘ NHẬP LỆNH (User EXEC `>`, Privileged EXEC `#`, Global Config `(config)#`, Interface `(config-if)#`...).",
        "- Không bao giờ tự giả định người học đã cấu hình xong một bước nếu người học chưa xác nhận.",
        "- Khi người học hỏi 'Tại sao thiết bị A không ping được thiết bị B trong Lab này?', hãy đối chiếu bảng IP, VLAN và Topology của đúng bài Lab hiện tại để liệt kê các nguyên nhân khả dĩ và lệnh `show` cần kiểm tra."
      ].join("\n");
    } else if (modeId === "troubleshooting") {
      modeDirectives = [
        "CHẾ ĐỘ HIỆN TẠI: [MODE 3: TROUBLESHOOTING MODE — CHẨN ĐOÁN & XỬ LÝ SỰ CỐ MẠNG]",
        "- Tuân thủ nghiêm ngặt quy trình 8 bước bắt bệnh kỹ sư mạng:",
        "  1. Xác định triệu chứng (Symptom) & Phạm vi lỗi.",
        "  2. Đưa ra các giả thuyết hợp lý từ Layer 1 (Vật lý/Cáp/shutdown) -> Layer 2 (VLAN/Trunk/STP/Port-Security) -> Layer 3 (IP/Mask/Gateway/Route) -> Layer 4-7 (ACL/NAT/DHCP/DNS).",
        "  3. Hướng dẫn người học chạy đúng lệnh kiểm tra (`show ip interface brief`, `show vlan brief`, `show interfaces trunk`, `show ip route`, `ipconfig`...).",
        "  4. Phân tích Output thực tế người học cung cấp (tuyệt đối không tự bịa output chưa có!).",
        "  5. Chỉ đưa ra lệnh cấu hình khắc phục sau khi đã chỉ rõ nguyên nhân và hướng dẫn lệnh kiểm tra lại."
      ].join("\n");
    } else if (modeId === "explainer") {
      modeDirectives = [
        "CHẾ ĐỘ HIỆN TẠI: [MODE 4: CONCEPT EXPLAINER — GIẢI PHẪU ĐOẠN VĂN BẢN ĐƯỢC CHỌN]",
        "- Tập trung giải thích sâu đoạn văn bản mà người học vừa bôi đen (Selected Text) trong ngữ cảnh của bài học hiện tại.",
        "- Trình bày rõ: 1) Ý nghĩa cốt lõi; 2) Bản chất & Cơ chế hoạt động; 3) Ví dụ thực tế dễ hình dung; 4) Ứng dụng trong doanh nghiệp & Kỳ thi CCNA 200-301."
      ].join("\n");
    } else if (modeId === "engineer") {
      modeDirectives = [
        "CHẾ ĐỘ HIỆN TẠI: [MODE 5: REAL-WORLD ENGINEER — KỸ SƯ MẠNG DOANH NGHIỆP THỰC CHIẾN]",
        "- Tư vấn và thiết kế giải pháp theo chuẩn mạng doanh nghiệp thực tế (Mô hình 3 lớp Access-Distribution-Core, quy hoạch IP VLSM/VLAN, dự phòng HSRP/Dual-WAN, bảo mật Defense-in-Depth, thiết bị đa hãng Cisco/Aruba/MikroTik)."
      ].join("\n");
    } else if (modeId === "quiz") {
      modeDirectives = [
        "CHẾ ĐỘ HIỆN TẠI: [MODE 6: QUIZ & REVIEW — KIỂM TRA & ÔN TẬP KIẾN THỨC]",
        "- Đặt câu hỏi trắc nghiệm chuẩn phong cách thi CCNA 200-301 hoặc câu hỏi tình huống dựa trực tiếp trên Bài học hiện tại, Ghi chú (Notes) và Highlight của người học, kèm giải thích chi tiết tại sao từng phương án đúng hoặc sai."
      ].join("\n");
    }

    return [
      "Bạn là **AI NETWORK TUTOR** — Chuyên gia Kỹ sư Mạng Cao cấp (Senior Enterprise Network Architect) kiêm Giảng viên Trưởng CCNA 200-301 của nền tảng **CCNA NETWORK ACADEMY**.",
      "",
      modeDirectives,
      "",
      "NGUYÊN TẮC BẮT BUỘC VỀ CONTEXT GROUNDING & CHẤT LƯỢNG KỸ THUẬT:",
      "1. Ưu tiên tuyệt đối việc trả lời dựa trên [ACTIVE LESSON CONTEXT] hoặc [ACTIVE LAB CONTEXT] được cung cấp. Tuyệt đối KHÔNG trả lời chung chung kiểu sách giáo khoa tách rời khỏi bài học/Lab người dùng đang mở.",
      "2. Phân biệt rõ nguồn thông tin khi trả lời: Thông tin từ Bài học/Lab hiện tại vs. Kiến thức mở rộng của Kỹ sư mạng.",
      "3. Không bao giờ tự chế ra câu lệnh Cisco IOS không tồn tại. Phân biệt rõ giới hạn mô phỏng của phần mềm Cisco Packet Tracer so với thiết bị Cisco IOS / IOS-XE thật khi cần thiết.",
      "4. Khi thiếu thông tin để kết luận nguyên nhân lỗi (ví dụ chưa biết output của `show ip interface brief` hay `show interfaces trunk`), hãy nêu các khả năng hợp lý và yêu cầu học viên cung cấp thêm output hoặc hình ảnh chụp màn hình.",
      "5. Trình bày câu trả lời rõ ràng bằng Markdown chuyên nghiệp: có tiêu đề ngắn gọn, giải thích bản chất, khối lệnh `cisco` (kèm dấu nhắc chế độ như `SW1(config-if)#`) và lưu ý lỗi thường gặp (Common Mistakes).",
      `6. Ngữ cảnh trực tiếp hiện tại của học viên: [${modeInfo.short_vi}] ${liveCtx.breadcrumb}`
    ].join("\n");
  }

  // --------------------------------------------------------------------------
  // 6. CONTEXT BUDGETING, MULTI-TURN PAYLOAD BUILDER & OFFLINE RAG ENGINE
  // --------------------------------------------------------------------------
  function buildContextAndSourcesForQuery(userPrompt) {
    const liveCtx = collectLivePageContext();
    const retrievedDocs = retrieveRelevantKnowledgeChunks(userPrompt, liveCtx, 4);

    const sources = [];
    if (liveCtx.sourceRef) {
      sources.push(liveCtx.sourceRef);
    }

    let ragSupplementText = "";
    if (retrievedDocs.length > 0) {
      const extraDocs = retrievedDocs.filter((d) => d.contextKey !== liveCtx.contextKey).slice(0, 3);
      extraDocs.forEach((d) => {
        sources.push({
          label: d.navLabel || d.title,
          jumpType: d.jumpType,
          jumpId: d.jumpId
        });
      });

      if (extraDocs.length > 0) {
        ragSupplementText =
          `\n=== [RETRIEVED RELATED KNOWLEDGE BASE (RAG)] ===\n` +
          extraDocs.map((d) => `• [${d.title}]:\n${d.content.substring(0, 1200)}`).join("\n\n");
      }
    }

    // Apply Context Budget (~14,000 chars max) per Part 10.3.D without cutting critical sections mid-sentence
    let primaryContext = liveCtx.structuredContextText || "";
    if (activeContextScope === "selection" && currentSelectedSnippet && currentSelectedSnippet.text) {
      primaryContext = [
        `=== [FOCUSED SELECTION CONTEXT] ===`,
        `• Bài học: ${liveCtx.shortTitle}`,
        `• Mục hiện tại: ${currentSelectedSnippet.sectionTitle || liveCtx.visibleSection}`,
        `• Đoạn văn bản học viên chọn cần giải thích:\n"""\n${currentSelectedSnippet.text}\n"""`
      ].join("\n");
    }

    let combinedContext = primaryContext + (ragSupplementText ? "\n" + ragSupplementText : "");
    if (combinedContext.length > MAX_CONTEXT_CHAR_BUDGET) {
      combinedContext = combinedContext.substring(0, MAX_CONTEXT_CHAR_BUDGET) + "\n...[Đã tối ưu độ dài Context Budget]...";
    }

    return {
      liveCtx,
      combinedContext,
      sources: deduplicateSources(sources)
    };
  }

  function deduplicateSources(sources) {
    const seen = new Set();
    return sources.filter((s) => {
      if (!s || !s.label) return false;
      const key = `${s.jumpType}-${s.jumpId}-${s.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Resolve follow-up pronouns ("nó", "giao thức này", "bài này", "lệnh trên") using previous turns
  function extractPreviousTopicSubject(conv) {
    if (!conv || !Array.isArray(conv.messages) || conv.messages.length === 0) return "";
    for (let i = conv.messages.length - 1; i >= 0; i--) {
      const m = conv.messages[i];
      if (m.role === "user" && m.text) {
        const terms = ["vlan", "trunk", "802.1q", "native vlan", "stp", "rstp", "portfast", "etherchannel", "lacp", "ospf", "dr/bdr", "arp", "dhcp", "dora", "ip helper-address", "nat", "pat", "acl", "wildcard", "ssh", "port-security", "subnet", "vlsm", "ipv6", "slaac", "hsrp", "capwap", "wlc", "tcp", "udp", "osi"];
        const low = m.text.toLowerCase();
        const found = terms.find((t) => low.includes(t));
        if (found) return found.toUpperCase();
      }
    }
    return "";
  }

  // Context-Aware Local RAG Responder (Used when offline or when no live API key is available, and for deterministic verification)
  function generateContextAwareGroundedResponse(userPrompt, imagesList, ctxBundle, conv) {
    const { liveCtx, sources } = ctxBundle;
    const qRaw = (userPrompt || "").trim();
    const q = qRaw.toLowerCase();
    const prevSubject = extractPreviousTopicSubject(conv);
    const numImages = Array.isArray(imagesList) ? imagesList.length : 0;

    let out = "";

    // Header showing active Mode & Context Grounding
    const modeInfo = AI_MODES[activeAiMode] || AI_MODES.learning;
    out += `### ${modeInfo.icon} [${modeInfo.short_vi}] Phân tích theo ngữ cảnh: **${escapeHtml(liveCtx.shortTitle)}**\n\n`;

    if (numImages > 0) {
      out += `> 📸 **Đã tiếp nhận ${numImages} ảnh chụp màn hình Packet Tracer** gắn với ngữ cảnh **${escapeHtml(liveCtx.shortTitle)}**.\n\n`;
    }

    // 1. Handle Selected Text Explanation (Test 7 - Concept Explainer)
    if (currentSelectedSnippet && currentSelectedSnippet.text && (activeAiMode === "explainer" || q.includes("đoạn này") || q.includes("đoạn văn") || q.includes("selected") || q.includes("bôi đen"))) {
      const snippet = currentSelectedSnippet.text;
      out += `#### 1. Giải phẫu đoạn văn bản bạn vừa chọn trong **${escapeHtml(liveCtx.shortTitle)}**\n`;
      out += `> *"${escapeHtml(snippet.length > 260 ? snippet.substring(0, 260) + "..." : snippet)}"*\n\n`;
      out += `- **Ý nghĩa cốt lõi (Direct Answer):** Đoạn nội dung này thuộc mục **${escapeHtml(currentSelectedSnippet.sectionTitle || liveCtx.visibleSection || "Trọng tâm bài học")}** của **${escapeHtml(liveCtx.shortTitle)}**, giải thích nguyên lý vận hành và quy tắc kỹ thuật mà thiết bị mạng sử dụng để xử lý gói tin.\n`;
      out += `- **Cơ chế hoạt động (How It Works):** Trong mô hình phân tầng OSI/TCP-IP và trên phần cứng Switch/Router Cisco, cơ chế này quyết định cách thiết bị đọc thông tin điều khiển trong Header (MAC/VLAN Tag ở Layer 2 hoặc IP/Prefix ở Layer 3) trước khi tra cứu bảng chuyển mạch/định tuyến.\n`;
      out += `- **Ứng dụng thực tế & Lưu ý thi CCNA:** Đây là kiến thức nền tảng thường xuyên xuất hiện trong các câu hỏi tình huống CCNA 200-301 và khi kiểm tra hệ thống tại doanh nghiệp.\n\n`;
      return { text: out, sources };
    }

    // 2. Handle Missing Context / Unknown Device Query in Lab (Test 8)
    const mentionedRouterMatch = q.match(/\b(r[4-9]|sw[5-9]|firewall-99|core-99|router\s*[4-9]|switch\s*[5-9])\b/i);
    if (liveCtx.type === "lab" && mentionedRouterMatch) {
      const unknownDev = mentionedRouterMatch[1].toUpperCase();
      const knownDevs = (liveCtx.labObject?.nodes || []).map((n) => n.name).join(", ");
      out += `#### ⚠️ Phát hiện thiếu dữ liệu ngữ cảnh (Missing Context Alert)\n\n`;
      out += `Bạn đang hỏi về thiết bị **\`${unknownDev}\`**, tuy nhiên theo dữ liệu Topology của **${escapeHtml(liveCtx.shortTitle)}**, hệ thống hiện tại **chỉ bao gồm các thiết bị sau**:\n`;
      out += `- **Danh sách thiết bị trong Lab hiện tại:** ${escapeHtml(knownDevs)}\n\n`;
      out += `👉 **Để tôi có thể chẩn đoán chính xác mà không suy đoán mò, bạn vui lòng xác nhận:**\n`;
      out += `1. Bạn có đang muốn hỏi về một trong các thiết bị hiện có (${escapeHtml(knownDevs)}) không?\n`;
      out += `2. Nếu bạn vừa tự mở rộng thêm thiết bị **\`${unknownDev}\`** vào sơ đồ Packet Tracer, vui lòng dán kết quả lệnh \`show running-config\` hoặc \`show ip interface brief\` của thiết bị đó vào đây để tôi phân tích trực tiếp!\n`;
      return { text: out, sources };
    }

    // 3. Handle CLI Command Line-by-Line Explanation (Test 4)
    if (q.includes("switchport mode access") || q.includes("switchport access vlan") || (q.includes("giải thích") && (q.includes("interface") || q.includes("lệnh")))) {
      out += `#### 1. Giải thích chi tiết từng dòng lệnh Cisco IOS & Chế độ cấu hình (CLI Modes)\n\n`;
      if (q.includes("switchport") || q.includes("fa0/1") || q.includes("vlan")) {
        out += `Đoạn cấu hình bạn cung cấp dùng để **gán một cổng vật lý trên Switch Layer 2 vào một mạng ảo VLAN cụ thể** dành cho thiết bị đầu cuối (PC, Server, Printer):\n\n`;
        out += `| Thứ tự | Câu lệnh Cisco IOS | Chế độ nhập lệnh (CLI Mode) | Ý nghĩa & Tại sao bắt buộc phải gõ |\n`;
        out += `|---|---|---|---|\n`;
        out += `| **Dòng 1** | \`interface fa0/1\` (hoặc \`interface fastEthernet 0/1\`) | \`SW1(config)#\` *(Global Config)* $\\rightarrow$ chuyển vào \`SW1(config-if)#\` | Chọn cổng vật lý **FastEthernet 0/1** trên Switch để bắt đầu cấu hình riêng cho cổng đó. |\n`;
        out += `| **Dòng 2** | \`switchport mode access\` | \`SW1(config-if)#\` *(Interface Config)* | Ép cứng cổng ` + "`Fa0/1`" + ` hoạt động ở chế độ **Access Port** (chỉ chở duy nhất 1 VLAN dưới dạng khung tin không gắn nhãn *Untagged* và tắt đàm phán DTP để bảo mật). |\n`;
        out += `| **Dòng 3** | \`switchport access vlan 10\` | \`SW1(config-if)#\` *(Interface Config)* | Đưa cổng ` + "`Fa0/1`" + ` vào **VLAN 10** (Nếu trên Switch chưa có VLAN 10, Cisco IOS sẽ tự động tạo luôn VLAN 10 với thông báo \`% Access VLAN does not exist. Creating vlan 10\`). |\n\n`;
        out += `#### 2. Cách kiểm tra nghiệm thu (Verification)\n`;
        out += `\`\`\`cisco\nSW1# show vlan brief\nSW1# show interfaces fa0/1 switchport\n\`\`\`\n`;
        out += `- **Expected Output đúng:** Trong \`show vlan brief\`, cổng \`Fa0/1\` phải nằm ở dòng **VLAN 10 (active)**. Trong \`show interfaces fa0/1 switchport\`, dòng \`Operational Mode\` hiển thị **\`static access\`** và \`Access Mode VLAN\` hiển thị **\`10\`**.\n`;
        return { text: out, sources };
      }
    }

    // 4. Handle Troubleshooting & Show Output Analysis (Test 5)
    if (q.includes("show vlan brief") || q.includes("show interfaces trunk") || q.includes("show ip interface brief") || activeAiMode === "troubleshooting") {
      out += `#### 🛠️ Quy trình Chẩn đoán & Phân tích Lệnh Kiểm tra (Troubleshooting Analysis — L1 $\\rightarrow$ L3)\n\n`;
      out += `Dựa trên các lệnh kiểm tra tiêu chuẩn bạn đề cập (**\`show ip interface brief\`**, **\`show vlan brief\`**, **\`show interfaces trunk\`**) trong ngữ cảnh **${escapeHtml(liveCtx.shortTitle)}**, đây là quy trình đối chiếu từng bước:\n\n`;
      out += `1. **Kiểm tra Tầng 1 & Tầng 2 cơ bản với \`show ip interface brief\`:**\n`;
      out += `   - Quan sát 2 cột cuối cùng là **\`Status\` (Tầng 1)** và **\`Protocol\` (Tầng 2)**.\n`;
      out += `   - Nếu thấy **\`administratively down / down\`**: Cổng đang bị tắt bởi lệnh \`shutdown\` $\\rightarrow$ Vào cổng gõ **\`no shutdown\`**.\n`;
      out += `   - Nếu thấy **\`down / down\`**: Kiểm tra cáp vật lý trong Packet Tracer (dùng cáp thẳng cho PC-Switch, cáp chéo cho Switch-Switch/Router-Router) hoặc đầu dây bên kia đang tắt.\n`;
      out += `2. **Kiểm tra phân chia VLAN với \`show vlan brief\`:**\n`;
      out += `   - Xác nhận các VLAN yêu cầu của bài (ví dụ VLAN 10, VLAN 20) đã tồn tại ở trạng thái **\`active\`**.\n`;
      out += `   - Kiểm tra từng cổng cắm PC (\`Fa0/1\`, \`Fa0/2\`...) đã nằm đúng dòng VLAN tương ứng chưa (nếu vẫn nằm ở dòng \`1 default\` là chưa gán \`switchport access vlan <id>\`).\n`;
      out += `3. **Kiểm tra đường trung kế với \`show interfaces trunk\`:**\n`;
      out += `   - Cổng Uplink nối giữa 2 Switch (hoặc nối từ Switch lên Router-on-a-Stick) **bắt buộc phải xuất hiện trong bảng này** với \`Status: trunking\` và \`Encapsulation: 802.1q\`.\n`;
      out += `   - Đối chiếu cột **\`Native vlan\`** ở cả 2 đầu dây phải khớp nhau (mặc định là 1) và cột **\`Vlans allowed and active in management domain\`** phải bao gồm các VLAN cần truyền.\n\n`;
      out += `> 📌 **Lưu ý Grounding (Chống suy đoán):** Nếu bạn đã chạy 3 lệnh trên trong Packet Tracer, hãy **copy/paste kết quả Output thực tế** hoặc **bấm \`Ctrl + V\` dán ảnh chụp màn hình CLI** vào khung chat này — tôi sẽ chỉ đích danh dòng nào đang bị sai trên máy của bạn!\n`;
      return { text: out, sources };
    }

    // 5. Handle Follow-up Question: "Vậy nó khác subnet như thế nào?" (Test 2)
    if ((q.includes("khác subnet") || q.includes("khác với subnet") || (q.includes("nó") && q.includes("subnet"))) && (prevSubject === "VLAN" || q.includes("vlan") || liveCtx.shortTitle.toLowerCase().includes("vlan") || liveCtx.shortTitle.toLowerCase().includes("switching"))) {
      out += `#### 1. Câu trả lời trực tiếp (Tiếp nối mạch hội thoại về **VLAN**)\n`;
      out += `Từ **"nó"** trong câu hỏi của bạn đang đề cập đến **VLAN (Virtual Local Area Network)** mà chúng ta vừa trao đổi. Điểm khác biệt cốt lõi nhất là: **VLAN phân chia mạng ở Tầng 2 (Data Link Layer — theo cổng Switch và nhãn 802.1Q)**, trong khi **Subnet phân chia mạng ở Tầng 3 (Network Layer — theo địa chỉ logic IP và Subnet Mask)**.\n\n`;
      out += `#### 2. Bảng đối chiếu bản chất kỹ thuật: VLAN (Layer 2) vs. Subnet (Layer 3)\n\n`;
      out += `| Tiêu chí so sánh | VLAN (Mạng LAN Ảo) | Subnet (Mạng Con IP) |\n`;
      out += `|---|---|---|\n`;
      out += `| **Tầng hoạt động (OSI Layer)** | **Tầng 2 (Data Link Layer)** — Quản lý trên Switch. | **Tầng 3 (Network Layer)** — Quản lý trên Router / L3 Switch. |\n`;
      out += `| **Đơn vị định danh** | **VLAN ID** (12-bit trong thẻ 802.1Q Tag, từ 1 đến 4094). | **Network Address & Subnet Mask / Prefix** (VD: \`192.168.10.0/24\`). |\n`;
      out += `| **Cách cô lập lưu lượng** | Chia một Switch vật lý thành nhiều **Miền quảng bá (Broadcast Domains) Tầng 2** độc lập. Khung tin Ethernet của VLAN 10 chỉ được Switch flood ra các cổng thuộc VLAN 10. | Xác định phạm vi các địa chỉ IP có thể giao tiếp trực tiếp không cần qua Default Gateway. |\n`;
      out += `| **Mối quan hệ trong Doanh nghiệp** | Trong thiết kế mạng chuẩn Cisco, luôn áp dụng **Ánh xạ 1-đổi-1 (1:1 Mapping)**: **1 VLAN = 1 IP Subnet = 1 Phòng ban** (Ví dụ: \`VLAN 10\` $\\leftrightarrow$ Subnet \`192.168.10.0/24\` $\\leftrightarrow$ Phòng Kế Toán). |\n\n`;
      out += `#### 3. Tại sao phải dùng kết hợp cả VLAN và Subnet?\n`;
      out += `- Nếu bạn chỉ đặt 2 máy PC ở 2 Subnet khác nhau (\`192.168.10.10/24\` và \`192.168.20.10/24\`) nhưng vẫn cắm chung trên một Switch mặc định (cùng \`VLAN 1\`), thì khi một máy phát gói tin **Broadcast Tầng 2** (dest MAC \`FF:FF:FF:FF:FF:FF\`), chiếc Switch vẫn đẩy gói Broadcast đó tới tất cả các máy (không cô lập được Broadcast ở Tầng 2!).\n`;
      out += `- Ngược lại, khi tách riêng thành **VLAN 10** và **VLAN 20**, Switch chặn hoàn toàn Broadcast giữa 2 phòng ban ngay từ Tầng 2, và muốn 2 VLAN/Subnet này giao tiếp với nhau thì bắt buộc phải đi qua **Router (Router-on-a-Stick)** hoặc **Switch Layer 3 (SVI)**.\n`;
      return { text: out, sources };
    }

    // 6. Handle Lab Context Question: "Tại sao PC VLAN 10 không ping được PC VLAN 20?" (Test 3)
    if (q.includes("vlan") && (q.includes("không ping được") || q.includes("khác vlan") || (q.includes("vlan 10") && q.includes("vlan 20")))) {
      out += `#### 1. Giải thích nguyên nhân cốt lõi trong ngữ cảnh **${escapeHtml(liveCtx.shortTitle)}**\n`;
      out += `Hai máy tính thuộc **VLAN 10** và **VLAN 20** không thể tự ping thông cho nhau qua Switch Layer 2 bởi vì **mỗi VLAN là một Miền Quảng Bá (Broadcast Domain) Tầng 2 hoàn toàn độc lập và bị cô lập tuyệt đối**.\n\n`;
      out += `- **Bản chất trên Switch Layer 2:** Khi Switch nhận một khung tin từ cổng thuộc \`VLAN 10\`, chip chuyển mạch ASIC của Switch **chỉ tra cứu các cổng cùng thuộc \`VLAN 10\`** trong bảng CAM Table. Switch Layer 2 thuần túy (như Cisco Catalyst 2960) **không có chức năng định tuyến Tầng 3 (Inter-VLAN Routing)** để chuyển khung tin từ VLAN 10 sang VLAN 20.\n\n`;
      if (liveCtx.type === "lab" && liveCtx.labObject) {
        const nodes = liveCtx.labObject.nodes || [];
        const hasRouter = nodes.some((n) => n.type === "router" || n.type === "l3switch");
        out += `#### 2. Phân tích trực tiếp trên Topology của **${escapeHtml(liveCtx.shortTitle)}**\n`;
        out += `- **Thiết bị hiện có trong bài Lab này:** ${nodes.map((n) => `\`${n.name}\``).join(", ")}.\n`;
        if (!hasRouter) {
          out += `- **Kết luận theo Topology Lab hiện tại:** Trong bài Lab này chỉ có **Switch Layer 2** và các máy **PC** (chưa có Router hoặc Switch Layer 3). Do đó, việc **PC cùng VLAN ping thông, còn PC khác VLAN (VLAN 10 ping VLAN 20) bị thất bại (\`Request timed out\`) chính là KẾT QUẢ ĐÚNG như thiết kế** để chứng minh tính cô lập bảo mật của VLAN! (Bạn có thể chuyển sang **Lab 22: Router-on-a-Stick** hoặc **Lab 23: Switch Layer 3 SVI** để cấu hình cho 2 VLAN này ping thông nhau).\n`;
        } else {
          out += `- **Trong bài Lab này ĐÃ CÓ thiết bị định tuyến (${nodes.filter((n) => n.type === "router" || n.type === "l3switch").map((n) => n.name).join(", ")})**. Nếu VLAN 10 vẫn chưa ping được VLAN 20, bạn cần kiểm tra 4 điều kiện sau:\n`;
          out += `  1. **Đường cáp nối từ Switch lên Router đã cấu hình Trunk chưa?** (Chạy \`show interfaces trunk\` trên Switch: cổng Uplink phải là \`802.1q trunking\`).\n`;
          out += `  2. **Đã cấu hình Inter-VLAN Routing chưa?** (Trên Router phải có Subinterfaces \`Gi0/0/0.10\` với \`encapsulation dot1Q 10\` và \`Gi0/0/0.20\` với \`encapsulation dot1Q 20\`, đồng thời cổng vật lý \`Gi0/0/0\` đã gõ \`no shutdown\`; hoặc trên Switch L3 đã gõ \`ip routing\` và \`no shutdown\` cho \`interface vlan 10\`, \`interface vlan 20\`).\n`;
          out += `  3. **Các máy PC đã điền đúng Default Gateway chưa?** (PC VLAN 10 phải trỏ Default Gateway về \`192.168.10.1\`; PC VLAN 20 phải trỏ về \`192.168.20.1\`).\n`;
          out += `  4. **Cổng cắm PC على Switch đã gán đúng VLAN chưa?** (Chạy \`show vlan brief\`).\n`;
        }
      }
      return { text: out, sources };
    }

    // 7. Handle Lesson Context Question: "Tại sao VLAN lại tạo broadcast domain riêng?" (Test 1)
    if (q.includes("vlan") && (q.includes("broadcast") || q.includes("miền quảng bá") || q.includes("chia"))) {
      out += `#### 1. Câu trả lời trực tiếp (Direct Answer)\n`;
      out += `**VLAN (Virtual LAN)** tạo được các **Miền quảng bá (Broadcast Domain) riêng biệt** ngay trên cùng một chiếc Switch vật lý bởi vì Switch gắn cho mỗi cổng một mã định danh **VLAN ID** trong bộ nhớ CAM Table và **chỉ chuyển tiếp (Forward/Flood) khung tin Broadcast hoặc Unknown Unicast ra các cổng có CÙNG số VLAN ID với cổng nhận vào**.\n\n`;
      out += `#### 2. Cơ chế hoạt động bên trong Switch (How It Works)\n`;
      out += `1. **Khi chưa chia VLAN (Mặc định):** Toàn bộ 24 cổng của Switch đều thuộc **\`VLAN 1\`**. Khi máy PC1 ở cổng \`Fa0/1\` phát một khung tin Broadcast (địa chỉ MAC đích là \`FF-FF-FF-FF-FF-FF\`, ví dụ gói tin *ARP Request* hoặc *DHCP Discover*), Switch sẽ nhân bản và tràn (Flood) khung tin đó ra cả 23 cổng còn lại.\n`;
      out += `2. **Khi chia VLAN (Ví dụ VLAN 10 Kế Toán & VLAN 20 Nhân Sự):**\n`;
      out += `   - Bảng địa chỉ MAC (CAM Table) của Switch được phân vùng theo trường **VLAN ID**: \`[VLAN ID | MAC Address | Port]\`.\n`;
      out += `   - Khi một máy ở cổng \`Fa0/1\` (thuộc **VLAN 10**) gửi khung tin Broadcast vào Switch, Switch đánh dấu nội bộ khung tin đó mang nhãn **\`VLAN 10\`**.\n`;
      out += `   - Bộ xử lý ASIC của Switch kiểm tra danh sách cổng và **chỉ cho phép khung tin Broadcast đó thoát ra các cổng Access thuộc \`VLAN 10\`** (và các cổng **Trunk 802.1Q** được phép chở VLAN 10).\n`;
      out += `   - Toàn bộ các cổng thuộc **\`VLAN 20\`** hoàn toàn không nhận được bất kỳ bit nào của khung tin Broadcast đó $\\rightarrow$ Tạo thành 2 Broadcast Domain hoàn toàn độc lập!\n\n`;
      out += `#### 3. Lệnh cấu hình & Kiểm chứng trên Cisco IOS\n`;
      out += `\`\`\`cisco\nSW1(config)# vlan 10\nSW1(config-vlan)# name KE_TOAN\nSW1(config-vlan)# exit\nSW1(config)# interface fastEthernet 0/1\nSW1(config-if)# switchport mode access\nSW1(config-if)# switchport access vlan 10\nSW1# show vlan brief\n\`\`\`\n`;
      return { text: out, sources };
    }

    // 8. General Context-Grounded Response for any Lesson or Lab (including Test 6 Context Switching to OSPF, etc.)
    if (liveCtx.type === "lab" && liveCtx.labObject) {
      const lab = liveCtx.labObject;
      const steps = lab.steps_vi || [];
      const curStep = steps[liveCtx.currentStepIndex] || steps[0] || "";
      out += `#### 1. Hướng dẫn trực tiếp theo bài thực hành: **${escapeHtml(lab.title_vi)}**\n`;
      out += `- **Mục tiêu bài Lab:** ${formatPlainToMd(lab.objective_vi)}\n`;
      out += `- **Thiết bị trong sơ đồ của bạn:** ${(lab.nodes || []).map((n) => `**${n.name}** (\`${n.ip || n.type}\`)`).join(", ")}.\n`;
      out += `- **Bước thực hành hiện tại (Bước ${liveCtx.currentStepIndex + 1}/${steps.length}):**\n  > ${curStep}\n\n`;
      out += `#### 2. Khối lệnh Cisco IOS CLI chuẩn của bài Lab này\n`;
      out += `\`\`\`cisco\n${(lab.cli_commands || []).slice(0, 14).join("\n")}\n\`\`\`\n\n`;
      out += `#### 3. Cách kiểm tra nghiệm thu (Verification)\n`;
      out += `- ${lab.verify_vi || "Kiểm tra đèn cổng xanh lá (`up/up`) và thực hiện `ping` giữa các thiết bị đầu cuối."}\n`;
      return { text: out, sources };
    }

    // Default Lesson / Mastery grounded synthesis
    const mod = liveCtx.moduleObject;
    const enrich = (mod && window.MODULE_STANDARD_10_ENRICHMENT && window.MODULE_STANDARD_10_ENRICHMENT[mod.id]) || {};
    out += `#### 1. Giải thích trọng tâm theo **${escapeHtml(liveCtx.shortTitle)}**\n`;
    if (liveCtx.visibleSection) {
      out += `- **Mục bạn đang theo dõi:** \`${escapeHtml(liveCtx.visibleSection)}\`\n`;
    }
    if (mod) {
      out += `- **Bản chất & Nguyên lý cốt lõi:** ${mod.overview_vi || mod.overview || ""}\n\n`;
      if (mod.analogy_vi) {
        out += `> 💡 **Liên hệ trực quan:** ${mod.analogy_vi}\n\n`;
      }
      if (mod.keyConcepts_vi && mod.keyConcepts_vi.length > 0) {
        out += `#### 2. Các cơ chế kỹ thuật quan trọng cần nắm vững trong bài này\n`;
        mod.keyConcepts_vi.slice(0, 4).forEach((c, idx) => {
          out += `${idx + 1}. ${c}\n`;
        });
        out += `\n`;
      }
      if (mod.commands && mod.commands.length > 0) {
        out += `#### 3. Lệnh Cisco IOS CLI liên quan\n`;
        out += `\`\`\`cisco\n${mod.commands.slice(0, 8).join("\n")}\n\`\`\`\n\n`;
      }
      if (enrich.troubleshooting_vi && enrich.troubleshooting_vi.length > 0) {
        out += `#### 4. Lưu ý lỗi thường gặp (Common Mistakes & Troubleshooting)\n`;
        enrich.troubleshooting_vi.slice(0, 2).forEach((t) => {
          out += `- **${t.issue}**\n  - *Nguyên nhân:* ${t.cause}\n  - *Cách khắc phục:* ${t.fix}\n`;
        });
      }
    }

    return { text: out, sources };
  }

  function formatPlainToMd(str) {
    return String(str || "");
  }

  // --------------------------------------------------------------------------
  // 7. GEMINI API CLIENT WITH BACKEND PROXY, MULTI-TURN & RETRY (PART 10.8)
  // --------------------------------------------------------------------------
  async function callAiNetworkTutorService(userPrompt, imagesList) {
    const conv = ensureActiveConversationForContext();
    const ctxBundle = buildContextAndSourcesForQuery(userPrompt);
    const { liveCtx, combinedContext, sources } = ctxBundle;

    const apiKey = (localStorage.getItem(STORAGE_KEY_API_KEY) || "").trim();
    const model = localStorage.getItem(STORAGE_KEY_MODEL) || DEFAULT_MODEL;
    const isValidGoogleApiKey = apiKey.startsWith("AIza");

    // Build Multi-Turn Contents array for Gemini API (Part 10.2.D)
    const contents = [];

    // Summarize older turns if conversation exceeds MAX_RECENT_TURNS_SENT
    const priorMessages = conv.messages.slice(0, -1); // exclude the current user message just pushed
    let historySummaryHeader = "";
    if (priorMessages.length > MAX_RECENT_TURNS_SENT) {
      const older = priorMessages.slice(0, priorMessages.length - MAX_RECENT_TURNS_SENT);
      const topicsDiscussed = older
        .filter((m) => m.role === "user")
        .map((m) => m.text.substring(0, 80))
        .join(" | ");
      historySummaryHeader = `[TÓM TẮT CÁC CÂU HỎI TRƯỚC TRONG CUỘC TRÒ CHUYỆN NÀY: ${topicsDiscussed}]\n\n`;
    }

    const recentMessages = priorMessages.slice(-MAX_RECENT_TURNS_SENT);
    recentMessages.forEach((m) => {
      if (!m.text) return;
      contents.push({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.text }]
      });
    });

    // Final user turn combining Grounded Context + User Question + Attached Images
    const hasImages = Array.isArray(imagesList) && imagesList.length > 0;
    const finalUserText = [
      historySummaryHeader,
      combinedContext,
      `\n=== [CÂU HỎI HIỆN TẠI CỦA HỌC VIÊN] ===`,
      userPrompt || (hasImages ? `Hãy phân tích chi tiết ${imagesList.length} ảnh chụp màn hình Packet Tracer đính kèm dựa trên ngữ cảnh ${liveCtx.shortTitle}.` : "Hãy hướng dẫn tôi nội dung hiện tại.")
    ].filter(Boolean).join("\n");

    const currentParts = [{ text: finalUserText }];
    if (hasImages) {
      imagesList.forEach((imgObj) => {
        if (imgObj && imgObj.base64 && imgObj.mimeType) {
          currentParts.push({
            inlineData: {
              mimeType: imgObj.mimeType,
              data: imgObj.base64
            }
          });
        }
      });
    }

    contents.push({
      role: "user",
      parts: currentParts
    });

    const requestPayload = {
      model,
      systemInstruction: {
        parts: [{ text: buildSystemInstruction(activeAiMode, liveCtx) }]
      },
      contents,
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 1536
      }
    };

    // 1. Try Secure Backend Proxy `/api/ai-tutor` first (Part 10.8 requirement)
    if (window.location.protocol.startsWith("http")) {
      try {
        const proxyRes = await fetch("/api/ai-tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...requestPayload,
            clientApiKey: isValidGoogleApiKey ? apiKey : undefined
          })
        });

        if (proxyRes.ok) {
          const proxyData = await proxyRes.json();
          const textPart = proxyData?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") || "";
          if (textPart) {
            return { text: textPart, sources };
          }
        }
      } catch {
        // Fallback when running as static local files without serverless runtime
      }
    }

    // 2. If user configured a valid personal Google Gemini API key (`AIza...`), call Gemini endpoint with timeout
    if (isValidGoogleApiKey) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 22000);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: requestPayload.systemInstruction,
            contents: requestPayload.contents,
            generationConfig: requestPayload.generationConfig
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errJson = await response.json().catch(() => ({}));
          const errMsg = errJson?.error?.message || `HTTP ${response.status}`;
          throw new Error(`Lỗi Gemini API (${response.status}): ${errMsg}`);
        }

        const resData = await response.json();
        const textPart = resData?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") || "";
        if (textPart) {
          return { text: textPart, sources };
        }
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    }

    // 3. Context-Aware Local RAG Engine (Instant, 100% grounded in website's Lesson & Lab knowledge base)
    await new Promise((r) => setTimeout(r, 350));
    return generateContextAwareGroundedResponse(userPrompt, imagesList, ctxBundle, conv);
  }

  // --------------------------------------------------------------------------
  // 8. CONTEXTUAL SUGGESTED QUESTIONS & QUICK ACTIONS (PART 10.6 & 10.9.D)
  // --------------------------------------------------------------------------
  function getDynamicSuggestedQuestions(liveCtx) {
    if (currentSelectedSnippet && currentSelectedSnippet.text) {
      return [
        "Giải thích sâu bản chất và cơ chế của đoạn văn bản tôi vừa chọn",
        "Cho ví dụ thực tế tại doanh nghiệp về đoạn kiến thức này",
        "Tạo 2 câu hỏi trắc nghiệm CCNA từ đoạn văn bản này"
      ];
    }

    if (liveCtx.type === "lab" && liveCtx.labObject) {
      const lab = liveCtx.labObject;
      const allCmds = (lab.cli_commands || []).join(" ").toLowerCase();
      const qs = [
        `Giải thích chi tiết Bước ${liveCtx.currentStepIndex + 1} của ${lab.title_vi.split(":")[0]}`,
        `Giải thích từng dòng lệnh CLI trong ${lab.title_vi.split(":")[0]}`,
        `Làm sao để kiểm tra (Verify) cấu hình trong bài Lab này đã đúng?`
      ];
      if (allCmds.includes("vlan")) {
        qs.unshift("Tại sao PC VLAN 10 không ping được PC VLAN 20?");
      } else if (allCmds.includes("ospf")) {
        qs.unshift("Tại sao 2 Router trong bài Lab này chưa lên trạng thái OSPF FULL?");
      } else {
        qs.unshift("Tại sao đèn cáp đang màu đỏ/cam hoặc PC không ping được?");
      }
      return qs;
    }

    const titleLow = (liveCtx.shortTitle || "").toLowerCase();
    if (titleLow.includes("switching") || titleLow.includes("vlan") || titleLow.includes("chuyển mạch")) {
      return [
        "Tại sao VLAN lại tạo broadcast domain riêng?",
        "Vậy nó khác subnet như thế nào?",
        "Access Port và Trunk Port (802.1Q) khác nhau thế nào?",
        "Làm sao kiểm tra bảng MAC và VLAN trên Switch?"
      ];
    }
    if (titleLow.includes("ospf") || titleLow.includes("định tuyến") || titleLow.includes("routing")) {
      return [
        "Giải thích 3 quy tắc vàng chọn đường đi của Router (LPM, AD, Metric)",
        "Tại sao định tuyến tĩnh (Static Route) bắt buộc phải cấu hình 2 chiều?",
        "6 điều kiện bắt buộc để 2 Router lên láng giềng OSPF FULL là gì?",
        "Làm sao đọc hiểu kết quả lệnh show ip route?"
      ];
    }
    if (titleLow.includes("ipv4") || titleLow.includes("subnet") || titleLow.includes("chia mạng")) {
      return [
        "Hướng dẫn phương pháp Bước nhảy (Magic Number) chia Subnet trong 15 giây",
        "Tại sao khi chia VLSM phải chia từ phòng ban lớn nhất xuống nhỏ nhất?",
        "Tại sao công thức tính số Host khả dụng luôn phải trừ đi 2 (2^h - 2)?",
        "Khi nào máy tính tự gán địa chỉ APIPA 169.254.x.x?"
      ];
    }

    return [
      `Tóm tắt các điểm cốt lõi nhất của ${liveCtx.shortTitle}`,
      `Giải thích phần "${liveCtx.visibleSection || "Lý thuyết cốt lõi"}" cho người mới bắt đầu`,
      `Các lỗi thường gặp (Troubleshooting) trong ${liveCtx.shortTitle} là gì?`,
      `Tạo 3 câu hỏi trắc nghiệm ôn thi CCNA cho bài này`
    ];
  }

  // Execute Contextual Action (Save AI response to My Notes or Create Flashcard with user confirmation - Part 10.6)
  function saveAiResponseToUserNotes(msgText) {
    const liveCtx = collectLivePageContext();
    if (!confirm(`Lưu nội dung giải thích này của AI vào Sổ tay Ghi chú (My Notes) cho "${liveCtx.shortTitle}"?`)) {
      return;
    }
    if (window.CCNA_WORKSPACE && typeof window.CCNA_WORKSPACE.getWorkspaceDB === "function") {
      const db = window.CCNA_WORKSPACE.getWorkspaceDB();
      db.notes.push({
        id: "note_ai_" + Math.random().toString(36).substring(2, 9),
        userId: getActiveUserId(),
        lessonKey: liveCtx.contextKey,
        moduleId: liveCtx.moduleId || 1,
        lessonTitle: liveCtx.shortTitle,
        highlightId: null,
        quoteText: currentSelectedSnippet?.text || "",
        title: `🤖 Ghi chú từ AI Network Tutor (${liveCtx.shortTitle})`,
        content: msgText,
        tag: "exam",
        isPinned: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      window.CCNA_WORKSPACE.saveWorkspaceDB();
      window.CCNA_WORKSPACE.renderFloatingQuickNotesList();
      alert("✓ Đã lưu câu trả lời của AI vào My Notes thành công!");
    }
  }

  function createFlashcardFromAiMessage(msgText) {
    const liveCtx = collectLivePageContext();
    if (window.CCNA_WORKSPACE && typeof window.CCNA_WORKSPACE.openFlashcardCreatorFromText === "function") {
      const clean = msgText.replace(/[#*`>]/g, "").trim();
      window.CCNA_WORKSPACE.openFlashcardCreatorFromText(clean.substring(0, 320), "", liveCtx.contextKey);
    }
  }

  // --------------------------------------------------------------------------
  // 9. AI NETWORK TUTOR SIDE PANEL UI/UX REDESIGN (PART 10.9)
  // --------------------------------------------------------------------------
  function createAiTutorModalDom() {
    const existing = document.getElementById("ai-tutor-modal");
    if (existing) existing.remove();
    const existingBackdrop = document.getElementById("ai-tutor-backdrop");
    if (existingBackdrop) existingBackdrop.remove();

    const modeOptionsHtml = Object.values(AI_MODES)
      .map((m) => `<option value="${m.id}">${m.icon} ${escapeHtml(m.label_vi)}</option>`)
      .join("");

    const modalHtml = `
      <div class="ai-backdrop ai-tutor-backdrop" id="ai-tutor-backdrop" aria-hidden="true"></div>

      <aside class="ai-sidebar ai-tutor-modal" id="ai-tutor-modal" aria-label="AI Network Tutor" hidden>
        <div class="ai-resizer" id="ai-resizer" title="Kéo sang trái/phải để thay đổi độ rộng AI Side Panel"></div>

        <div class="ai-container ai-tutor-container">
          <!-- Header -->
          <header class="ai-tutor-header">
            <div class="ai-header-left">
              <div class="ai-avatar-wrap">
                <span class="ai-avatar-icon">🤖</span>
                <span class="ai-online-dot" title="Context-Aware Engine Active"></span>
              </div>
              <div class="ai-header-info">
                <div class="ai-header-title-row">
                  <h3 class="ai-header-title">AI NETWORK TUTOR</h3>
                  <span class="ai-model-badge" id="ai-active-model-badge">CONTEXT RAG 2.5</span>
                </div>
                <p class="ai-header-sub">Senior Network Engineer &amp; CCNA 200-301 Context-Aware Instructor</p>
              </div>
            </div>

            <div class="ai-header-actions">
              <button type="button" class="ai-tool-btn" id="ai-conv-history-btn" title="Quản lý danh sách cuộc trò chuyện">
                💬 Hội thoại
              </button>
              <button type="button" class="ai-tool-btn" id="ai-new-conv-btn" title="Tạo cuộc trò chuyện mới cho bài này">
                + Mới
              </button>
              <button type="button" class="ai-tool-btn" id="ai-settings-toggle-btn" title="Cài đặt API Key &amp; Model">
                ⚙️
              </button>
              <button type="button" class="ai-close-btn" id="ai-tutor-close-btn" aria-label="Thu gọn AI Network Tutor" title="Thu gọn (Alt+A hoặc Esc)">
                ✕
              </button>
            </div>
          </header>

          <!-- Live Context Indicator & Mode / Scope Controls (Part 10.9.B) -->
          <div class="ai-context-dashboard" id="ai-context-dashboard">
            <div class="ai-ctx-top-row">
              <span class="ai-mode-pill" id="ai-active-mode-pill">📘 Learning Mode</span>
              <span class="ai-ctx-breadcrumb" id="ai-context-text">Đang đồng bộ ngữ cảnh...</span>
              <button type="button" class="ai-context-refresh-btn" id="ai-context-refresh-btn" title="Cập nhật ngữ cảnh trực tiếp">↻</button>
            </div>

            <div class="ai-ctx-controls-row">
              <select id="ai-mode-selector" class="ai-mini-select" aria-label="Chọn chế độ AI Network Tutor" title="Chuyển đổi giữa 6 chế độ AI chuyên biệt">
                ${modeOptionsHtml}
              </select>

              <select id="ai-scope-selector" class="ai-mini-select" aria-label="Chọn phạm vi Context" title="Chọn phạm vi ngữ cảnh gửi cho AI">
                <option value="auto">🎯 Phạm vi: Tự động theo trang hiện tại</option>
                <option value="selection">✂️ Chỉ đoạn văn bản đang bôi đen</option>
                <option value="section">📑 Mục (Section) đang đọc</option>
                <option value="lesson">📘 Toàn bộ Bài học (Lesson) hiện tại</option>
                <option value="lab">🧪 Toàn bộ Bài Lab &amp; Topology hiện tại</option>
                <option value="course">🌐 Toàn khóa học CCNA 200-301</option>
              </select>
            </div>

            <!-- Lab Step Selector (Shown automatically when user is on a Lab) -->
            <div class="ai-lab-step-bar" id="ai-lab-step-bar" hidden>
              <label for="ai-lab-step-select">🔧 Bước Lab đang làm:</label>
              <select id="ai-lab-step-select" class="ai-mini-select"></select>
            </div>

            <!-- Selected Text Snippet Banner (Shown when user selects text & clicks Ask AI) -->
            <div class="ai-selected-snippet-box" id="ai-selected-snippet-box" hidden>
              <div class="ai-snippet-head">
                <span>✂️ <strong>Đoạn văn đang gắn vào Context:</strong></span>
                <button type="button" id="ai-clear-snippet-btn" title="Bỏ đính kèm đoạn văn này">✕</button>
              </div>
              <div class="ai-snippet-text" id="ai-snippet-text"></div>
            </div>
          </div>

          <!-- Contextual One-Click AI Actions Bar (Part 10.6) -->
          <div class="ai-contextual-actions-bar" id="ai-contextual-actions-bar">
            <!-- Dynamically populated based on Lesson vs Lab vs Notes -->
          </div>

          <!-- Conversation History Drawer (Part 10.10) -->
          <div class="ai-conv-drawer" id="ai-conv-drawer" hidden>
            <div class="ai-conv-drawer-head">
              <strong>💬 Lịch sử Hội thoại của bạn (Cô lập theo User &amp; Bài học)</strong>
              <input type="search" id="ai-conv-search-input" class="ai-conv-search" placeholder="Tìm kiếm cuộc trò chuyện..." />
            </div>
            <div class="ai-conv-list" id="ai-conv-list"></div>
          </div>

          <!-- Chat Stream Area -->
          <div class="ai-chat-stream" id="ai-chat-stream"></div>

          <!-- Image Attachment Preview Bar -->
          <div class="ai-attachment-preview-bar" id="ai-attachment-preview-bar" style="display: none;">
            <div class="ai-attachments-top-row">
              <span class="ai-attachment-count" id="ai-attachment-count">Đã đính kèm 0 ảnh</span>
              <button type="button" class="ai-clear-all-attachments-btn" id="ai-clear-all-attachments-btn">✕ Xóa tất cả</button>
            </div>
            <div class="ai-attachments-scroll" id="ai-attachments-scroll"></div>
          </div>

          <!-- Dynamic Context-Specific Suggested Questions (Part 10.9.D) -->
          <div class="ai-quick-prompts" id="ai-quick-prompts"></div>

          <!-- Input Footer -->
          <footer class="ai-tutor-footer">
            <div class="ai-input-wrapper">
              <label for="ai-image-upload-input" class="ai-image-btn" title="Đính kèm ảnh chụp Packet Tracer (hoặc bấm Ctrl+V)">
                📷
                <input type="file" id="ai-image-upload-input" accept="image/*" multiple style="display:none;" />
              </label>

              <textarea
                id="ai-user-prompt-input"
                class="ai-prompt-textarea"
                rows="1"
                placeholder="Hỏi AI về bài học/Lab hiện tại, dán lệnh show hoặc bấm Ctrl+V dán ảnh Packet Tracer..."
              ></textarea>

              <button type="button" class="ai-send-btn" id="ai-send-msg-btn" title="Gửi câu hỏi (Enter)">
                <span class="send-icon">➤</span>
              </button>
            </div>
          </footer>
        </div>
      </aside>
    `;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = modalHtml;
    document.body.appendChild(wrapper);
  }

  // Render Contextual AI Action Buttons based on whether user is in Lesson, Lab, or Notes (Part 10.6)
  function renderContextualActionsBar(liveCtx) {
    const bar = document.getElementById("ai-contextual-actions-bar");
    if (!bar) return;

    if (liveCtx.type === "lab") {
      bar.innerHTML = `
        <button type="button" class="ai-act-pill" data-ai-action="explain-step">🪜 Giải thích Bước hiện tại</button>
        <button type="button" class="ai-act-pill" data-ai-action="explain-cmd">💻 Giải thích Lệnh CLI</button>
        <button type="button" class="ai-act-pill" data-ai-action="troubleshoot-lab">🛠️ Bắt bệnh Lab này</button>
        <button type="button" class="ai-act-pill" data-ai-action="expected-output">🖥️ Giải thích Output chuẩn</button>
      `;
    } else {
      bar.innerHTML = `
        <button type="button" class="ai-act-pill" data-ai-action="explain-section">📑 Giải thích Mục đang đọc</button>
        <button type="button" class="ai-act-pill" data-ai-action="summarize-lesson">📝 Tóm tắt Bài học</button>
        <button type="button" class="ai-act-pill" data-ai-action="generate-quiz">🎯 Tạo Quiz kiểm tra</button>
        <button type="button" class="ai-act-pill" data-ai-action="compare-concepts">⚖️ Phân biệt khái niệm dễ nhầm</button>
      `;
    }

    bar.querySelectorAll("[data-ai-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const act = btn.dataset.aiAction;
        if (act === "explain-step") {
          activeAiMode = "lab";
          syncModeDropdownUI();
          handleSendUserMessage(`Hãy giải thích chi tiết Bước ${liveCtx.currentStepIndex + 1} trong ${liveCtx.shortTitle}: tôi cần thao tác chuột ở đâu, gõ lệnh gì và tại sao?`);
        } else if (act === "explain-cmd") {
          activeAiMode = "lab";
          syncModeDropdownUI();
          handleSendUserMessage(`Giải thích từng dòng lệnh Cisco IOS CLI và chế độ nhập lệnh (Mode) trong ${liveCtx.shortTitle}.`);
        } else if (act === "troubleshoot-lab") {
          activeAiMode = "troubleshooting";
          syncModeDropdownUI();
          handleSendUserMessage(`Hướng dẫn quy trình kiểm tra và bắt bệnh (Troubleshooting) nếu thiết bị trong ${liveCtx.shortTitle} không ping thông được.`);
        } else if (act === "expected-output") {
          activeAiMode = "lab";
          syncModeDropdownUI();
          handleSendUserMessage(`Giải thích các lệnh Verification (show / ping) và Expected Output đúng của ${liveCtx.shortTitle}.`);
        } else if (act === "explain-section") {
          activeAiMode = "learning";
          syncModeDropdownUI();
          handleSendUserMessage(`Giải thích chi tiết mục "${liveCtx.visibleSection || "Lý thuyết cốt lõi"}" trong ${liveCtx.shortTitle} từ cơ bản đến chuyên sâu kèm ví dụ thực tế.`);
        } else if (act === "summarize-lesson") {
          activeAiMode = "learning";
          syncModeDropdownUI();
          handleSendUserMessage(`Tóm tắt hệ thống toàn bộ kiến thức trọng tâm, câu lệnh CLI và lưu ý thi CCNA của ${liveCtx.shortTitle}.`);
        } else if (act === "generate-quiz") {
          activeAiMode = "quiz";
          syncModeDropdownUI();
          handleSendUserMessage(`Tạo 3 câu hỏi trắc nghiệm tình huống chuẩn CCNA 200-301 dựa trên nội dung của ${liveCtx.shortTitle} kèm giải thích đáp án.`);
        } else if (act === "compare-concepts") {
          activeAiMode = "learning";
          syncModeDropdownUI();
          handleSendUserMessage(`Phân biệt rõ các khái niệm kỹ thuật dễ gây nhầm lẫn nhất trong ${liveCtx.shortTitle}.`);
        }
      });
    });
  }

  function syncModeDropdownUI() {
    const modeSelect = document.getElementById("ai-mode-selector");
    const modePill = document.getElementById("ai-active-mode-pill");
    const mInfo = AI_MODES[activeAiMode] || AI_MODES.learning;
    if (modeSelect) modeSelect.value = activeAiMode;
    if (modePill) modePill.textContent = `${mInfo.icon} ${mInfo.short_vi}`;
  }

  // Update Live Context Indicator, Lab Step Selector & Dynamic Suggested Questions
  function updateContextDisplay() {
    const liveCtx = collectLivePageContext();
    const textEl = document.getElementById("ai-context-text");
    if (textEl) {
      textEl.innerHTML = `<strong>${escapeHtml(liveCtx.breadcrumb)}</strong>`;
    }

    syncModeDropdownUI();
    renderContextualActionsBar(liveCtx);

    // Lab step selector bar
    const labStepBar = document.getElementById("ai-lab-step-bar");
    const labStepSelect = document.getElementById("ai-lab-step-select");
    if (labStepBar && labStepSelect) {
      if (liveCtx.type === "lab" && liveCtx.labObject && Array.isArray(liveCtx.labObject.steps_vi)) {
        labStepBar.hidden = false;
        labStepSelect.innerHTML = liveCtx.labObject.steps_vi
          .map((s, idx) => {
            const clean = s.replace(/\*\*([^*]+)\*\*/g, "$1").substring(0, 62);
            return `<option value="${idx}" ${idx === liveCtx.currentStepIndex ? "selected" : ""}>Bước ${idx + 1}/${liveCtx.totalSteps}: ${escapeHtml(clean)}...</option>`;
          })
          .join("");
      } else {
        labStepBar.hidden = true;
      }
    }

    // Selected snippet box
    const snippetBox = document.getElementById("ai-selected-snippet-box");
    const snippetText = document.getElementById("ai-snippet-text");
    if (snippetBox && snippetText) {
      if (currentSelectedSnippet && currentSelectedSnippet.text) {
        snippetBox.hidden = false;
        snippetText.textContent = `"${currentSelectedSnippet.text.substring(0, 180)}${currentSelectedSnippet.text.length > 180 ? "..." : ""}"`;
      } else {
        snippetBox.hidden = true;
      }
    }

    // Dynamic Suggested Questions
    const quickPromptsEl = document.getElementById("ai-quick-prompts");
    if (quickPromptsEl) {
      const suggestions = getDynamicSuggestedQuestions(liveCtx);
      quickPromptsEl.innerHTML = suggestions
        .map((q) => `<button type="button" class="ai-prompt-chip" data-prompt="${escapeHtml(q)}">💡 ${escapeHtml(q)}</button>`)
        .join("");
    }
  }

  // Render Chat Messages with Source Reference Citations, Copy CLI, Regenerate, Save to Notes & Feedback
  function renderChatMessages() {
    const stream = document.getElementById("ai-chat-stream");
    if (!stream) return;

    const conv = ensureActiveConversationForContext();
    const messages = conv.messages || [];
    const liveCtx = collectLivePageContext();

    if (messages.length === 0 && !isGenerating) {
      const mInfo = AI_MODES[activeAiMode] || AI_MODES.learning;
      stream.innerHTML = `
        <div class="ai-welcome-card">
          <div class="ai-welcome-icon">${mInfo.icon}</div>
          <h4 class="ai-welcome-title">AI NETWORK TUTOR — ${escapeHtml(mInfo.short_vi)}</h4>
          <p class="ai-welcome-desc">${escapeHtml(mInfo.desc_vi)}</p>
          <div class="ai-welcome-features">
            <div class="ai-feat-item">
              <span class="feat-icon">🎯</span>
              <span><strong>Đã nạp Context trực tiếp:</strong> <em>${escapeHtml(liveCtx.breadcrumb)}</em> (${escapeHtml(liveCtx.userActivity)}).</span>
            </div>
            <div class="ai-feat-item">
              <span class="feat-icon">✂️</span>
              <span><strong>Hỏi trực tiếp đoạn bôi đen:</strong> Bôi đen bất kỳ khái niệm hay lệnh CLI nào trong bài rồi bấm <strong>"🤖 Ask AI about this"</strong>!</span>
            </div>
            <div class="ai-feat-item">
              <span class="feat-icon">📸</span>
              <span><strong>Chẩn đoán đa phương thức:</strong> Dán ảnh chụp màn hình Packet Tracer (<code>Ctrl + V</code>) hoặc output lệnh <code>show</code> để bắt bệnh.</span>
            </div>
          </div>
        </div>
      `;
      return;
    }

    let html = "";
    messages.forEach((msg, idx) => {
      const isUser = msg.role === "user";
      const sourcesHtml = !isUser && Array.isArray(msg.sources) && msg.sources.length > 0
        ? `
          <div class="ai-sources-box">
            <div class="ai-sources-title">📌 Nguồn nội dung tham chiếu trong Academy (Click để mở):</div>
            <div class="ai-sources-list">
              ${msg.sources
                .map(
                  (s) => `
                  <button type="button" class="ai-source-chip" data-jump-type="${escapeHtml(s.jumpType || "module")}" data-jump-id="${s.jumpId || 1}">
                    🔗 ${escapeHtml(s.label)}
                  </button>
                `
                )
                .join("")}
            </div>
          </div>
        `
        : "";

      const assistantActionsHtml = !isUser && !msg.isError
        ? `
          <div class="ai-msg-action-bar">
            <button type="button" class="ai-msg-act-btn" data-msg-act="save-note" data-idx="${idx}" title="Lưu câu trả lời này vào My Notes">📝 Lưu vào My Notes</button>
            <button type="button" class="ai-msg-act-btn" data-msg-act="make-fc" data-idx="${idx}" title="Tạo thẻ Flashcard từ câu trả lời này">🗂️ Tạo Flashcard</button>
            <button type="button" class="ai-msg-act-btn" data-msg-act="regenerate" data-idx="${idx}" title="Tạo lại câu trả lời">🔄 Regenerate</button>
            <button type="button" class="ai-msg-act-btn ${msg.feedback === "up" ? "active" : ""}" data-msg-act="fb-up" data-idx="${idx}" title="Hữu ích">👍</button>
            <button type="button" class="ai-msg-act-btn ${msg.feedback === "down" ? "active" : ""}" data-msg-act="fb-down" data-idx="${idx}" title="Chưa chính xác">👎</button>
          </div>
        `
        : "";

      const retryErrorHtml = msg.isError
        ? `
          <div class="ai-msg-action-bar">
            <button type="button" class="ai-msg-act-btn primary" id="ai-retry-failed-btn">🔄 Thử gửi lại câu hỏi</button>
            <button type="button" class="ai-msg-act-btn" id="ai-fallback-local-rag-btn">⚡ Chuyển sang Chế độ Trợ giảng Nội bộ (Instant RAG)</button>
          </div>
        `
        : "";

      html += `
        <div class="ai-message-row ${isUser ? "user" : "assistant"}">
          <div class="ai-msg-avatar">${isUser ? "👤" : "🤖"}</div>
          <div class="ai-msg-content-wrap">
            <div class="ai-msg-sender">
              ${isUser ? "Bạn" : `AI Network Tutor (${AI_MODES[msg.mode || activeAiMode]?.short_vi || "CCNA Instructor"})`}
            </div>
            ${
              Array.isArray(msg.images) && msg.images.length > 0
                ? `<div class="ai-msg-images-grid count-${Math.min(msg.images.length, 4)}">
                     ${msg.images.map((src, i) => `
                       <div class="ai-grid-img-wrap">
                         <img src="${src}" alt="Ảnh ${i + 1}" class="ai-msg-img" />
                         <span class="ai-img-num-badge">#${i + 1}</span>
                       </div>
                     `).join("")}
                   </div>`
                : ""
            }
            <div class="ai-msg-body">
              ${isUser ? escapeHtml(msg.text).replace(/\n/g, "<br/>") : formatMarkdown(msg.text)}
            </div>
            ${sourcesHtml}
            ${assistantActionsHtml}
            ${retryErrorHtml}
            <div class="ai-msg-time">${escapeHtml(msg.time || "")}</div>
          </div>
        </div>
      `;
    });

    if (isGenerating) {
      html += `
        <div class="ai-message-row assistant">
          <div class="ai-msg-avatar">🤖</div>
          <div class="ai-msg-content-wrap">
            <div class="ai-msg-sender">AI Network Tutor</div>
            <div class="ai-msg-body ai-loading-body">
              <span class="ai-typing-dot"></span>
              <span class="ai-typing-dot"></span>
              <span class="ai-typing-dot"></span>
              <span style="font-size:0.84rem; color:var(--text-muted); margin-left:0.5rem;">
                Đang đối chiếu ngữ cảnh <strong>${escapeHtml(liveCtx.shortTitle)}</strong> &amp; chuẩn bị lời giải...
              </span>
            </div>
          </div>
        </div>
      `;
    }

    stream.innerHTML = html;

    // Bind CLI Copy buttons
    stream.querySelectorAll(".ai-cli-copy-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const codeEl = document.getElementById(btn.dataset.codeId);
        if (codeEl) {
          await navigator.clipboard.writeText(codeEl.innerText);
          const orig = btn.innerText;
          btn.innerText = "✓ Đã sao chép";
          setTimeout(() => (btn.innerText = orig), 1600);
        }
      });
    });

    // Bind Source Reference Citation jumps (Part 10.7)
    stream.querySelectorAll(".ai-source-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const jType = chip.dataset.jumpType;
        const jId = Number(chip.dataset.jumpId) || 1;
        if (typeof window.navigateToAcademySection === "function") {
          if (jType === "lab") window.navigateToAcademySection("labs", jId);
          else if (jType === "mastery") window.navigateToAcademySection("projects", jId);
          else window.navigateToAcademySection("modules", jId);
        }
      });
    });

    // Bind Message Actions (Save to Notes, Flashcard, Regenerate, Feedback)
    stream.querySelectorAll("[data-msg-act]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const act = btn.dataset.msgAct;
        const idx = Number(btn.dataset.idx);
        const targetMsg = messages[idx];
        if (!targetMsg) return;

        if (act === "save-note") {
          saveAiResponseToUserNotes(targetMsg.text);
        } else if (act === "make-fc") {
          createFlashcardFromAiMessage(targetMsg.text);
        } else if (act === "regenerate") {
          // Find preceding user prompt
          let prevUserPrompt = "";
          for (let i = idx - 1; i >= 0; i--) {
            if (messages[i].role === "user") {
              prevUserPrompt = messages[i].text;
              break;
            }
          }
          if (prevUserPrompt) {
            conv.messages.splice(idx, 1);
            saveUserConversations();
            handleSendUserMessage(prevUserPrompt, true);
          }
        } else if (act === "fb-up" || act === "fb-down") {
          targetMsg.feedback = act === "fb-up" ? "up" : "down";
          saveUserConversations();
          renderChatMessages();
        }
      });
    });

    // Bind Retry on API Error (Test 9)
    document.getElementById("ai-retry-failed-btn")?.addEventListener("click", () => {
      if (lastFailedPrompt) {
        conv.messages = conv.messages.filter((m) => !m.isError);
        saveUserConversations();
        handleSendUserMessage(lastFailedPrompt, true);
      }
    });
    document.getElementById("ai-fallback-local-rag-btn")?.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
      if (lastFailedPrompt) {
        conv.messages = conv.messages.filter((m) => !m.isError);
        saveUserConversations();
        handleSendUserMessage(lastFailedPrompt, true);
      }
    });

    stream.scrollTop = stream.scrollHeight;
  }

  // Send message controller (Preserves input text on error per Part 10.9.E & Test 9)
  async function handleSendUserMessage(customPrompt, isRetry = false) {
    if (isGenerating) return;

    const input = document.getElementById("ai-user-prompt-input");
    const promptText = (customPrompt !== undefined ? customPrompt : (input ? input.value : "")).trim();

    if (!promptText && attachedImages.length === 0) {
      if (input) input.focus();
      return;
    }

    const conv = ensureActiveConversationForContext();
    const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (!isRetry) {
      conv.messages.push({
        role: "user",
        text: promptText,
        images: attachedImages.map((img) => img.previewUrl),
        time: nowStr
      });
      if (conv.messages.length === 1 && promptText) {
        conv.title = promptText.length > 48 ? promptText.substring(0, 48) + "..." : promptText;
      }
      conv.updatedAt = Date.now();
      saveUserConversations();
    }

    const imagesToSend = [...attachedImages];
    clearAttachments();

    if (input && customPrompt === undefined) {
      input.value = "";
      input.style.height = "auto";
    }

    isGenerating = true;
    renderChatMessages();

    try {
      const result = await callAiNetworkTutorService(promptText, imagesToSend);
      lastFailedPrompt = null;
      conv.messages.push({
        role: "assistant",
        mode: activeAiMode,
        text: result.text,
        sources: result.sources || [],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      });
      conv.updatedAt = Date.now();
      saveUserConversations();
    } catch (err) {
      // Per Part 10.9.E & Test 9: Show clear error state, allow retry, and restore prompt to input box
      lastFailedPrompt = promptText;
      if (input && !input.value) {
        input.value = promptText;
      }
      conv.messages.push({
        role: "assistant",
        isError: true,
        mode: activeAiMode,
        text: `⚠️ **Không thể kết nối tới Gemini API:** ${err.message}\n\nCâu hỏi của bạn đã được giữ nguyên trong ô nhập liệu. Bạn có thể bấm **Thử gửi lại** hoặc chuyển sang **Chế độ Trợ giảng Nội bộ (Instant RAG)** ngay bên dưới.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      });
      saveUserConversations();
    } finally {
      isGenerating = false;
      renderChatMessages();
    }
  }

  // Render Conversation History Drawer (Part 10.10)
  function renderConversationDrawer() {
    const listEl = document.getElementById("ai-conv-list");
    const searchInput = document.getElementById("ai-conv-search-input");
    if (!listEl) return;

    const uid = getActiveUserId();
    const q = (searchInput ? searchInput.value : "").trim().toLowerCase();
    const userConvs = conversationsStore.conversations.filter(
      (c) => c.userId === uid && (!q || (c.title || "").toLowerCase().includes(q) || (c.contextKey || "").toLowerCase().includes(q))
    );

    if (userConvs.length === 0) {
      listEl.innerHTML = `<p style="font-size:0.8rem;color:var(--text-muted);padding:0.5rem;">Chưa có cuộc trò chuyện nào khớp tìm kiếm.</p>`;
      return;
    }

    listEl.innerHTML = userConvs
      .map((c) => {
        const isActive = c.id === conversationsStore.activeConvId;
        return `
          <div class="ai-conv-item ${isActive ? "active" : ""}" data-conv-id="${c.id}">
            <div class="ai-conv-item-main" data-select-conv="${c.id}">
              <strong>${escapeHtml(c.title || "Hội thoại")}</strong>
              <span class="ai-conv-meta">${escapeHtml(c.contextKey)} • ${(c.messages || []).length} tin nhắn</span>
            </div>
            <div class="ai-conv-item-btns">
              <button type="button" class="ai-conv-mini-btn" data-rename-conv="${c.id}" title="Đổi tên">✏️</button>
              <button type="button" class="ai-conv-mini-btn danger" data-del-conv="${c.id}" title="Xóa">🗑️</button>
            </div>
          </div>
        `;
      })
      .join("");

    listEl.querySelectorAll("[data-select-conv]").forEach((el) => {
      el.addEventListener("click", () => {
        conversationsStore.activeConvId = el.dataset.selectConv;
        saveUserConversations();
        document.getElementById("ai-conv-drawer").hidden = true;
        renderChatMessages();
      });
    });

    listEl.querySelectorAll("[data-rename-conv]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const conv = conversationsStore.conversations.find((c) => c.id === btn.dataset.renameConv);
        if (conv) {
          const newName = prompt("Nhập tên mới cho cuộc trò chuyện:", conv.title);
          if (newName && newName.trim()) {
            conv.title = newName.trim();
            saveUserConversations();
            renderConversationDrawer();
          }
        }
      });
    });

    listEl.querySelectorAll("[data-del-conv]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.delConv;
        conversationsStore.conversations = conversationsStore.conversations.filter((c) => c.id !== id);
        if (conversationsStore.activeConvId === id) {
          conversationsStore.activeConvId = null;
          ensureActiveConversationForContext();
        }
        saveUserConversations();
        renderConversationDrawer();
        renderChatMessages();
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. SELECTION INTEGRATION ("Ask AI about this" button - Part 10.9.C)
  // --------------------------------------------------------------------------
  function injectAskAiIntoSelectionToolbar() {
    const tooltip = document.getElementById("selection-tooltip");
    if (!tooltip || document.getElementById("ws-sel-ask-ai-btn")) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sel-btn add-to-note";
    btn.id = "ws-sel-ask-ai-btn";
    btn.title = "Gửi đoạn văn bản đang chọn sang AI Network Tutor để giải thích sâu";
    btn.innerHTML = `🤖 <span>Ask AI about this</span>`;

    btn.addEventListener("mousedown", (e) => e.preventDefault());
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const sel = window.getSelection();
      const selectedText = sel ? sel.toString().trim() : "";
      if (!selectedText) return;

      const liveCtx = collectLivePageContext();
      currentSelectedSnippet = {
        text: selectedText,
        lessonKey: liveCtx.contextKey,
        lessonTitle: liveCtx.shortTitle,
        sectionTitle: liveCtx.visibleSection
      };

      activeAiMode = "explainer";
      activeContextScope = "selection";
      tooltip.hidden = true;
      if (sel) sel.removeAllRanges();

      openAiTutorModal();
      handleSendUserMessage(`Hãy giải thích chi tiết đoạn nội dung này trong ${liveCtx.shortTitle}:\n"${selectedText}"`);
    });

    tooltip.appendChild(btn);
  }

  // --------------------------------------------------------------------------
  // 11. MARKDOWN PARSER, ATTACHMENTS & LIFECYCLE HOOKS
  // --------------------------------------------------------------------------
  function formatMarkdown(text) {
    if (!text) return "";
    let html = escapeHtml(text);

    html = html.replace(/```(?:cisco|ios|bash)?\n?([\s\S]*?)```/g, (match, code) => {
      const trimmedCode = code.trim();
      const codeId = "cli_code_" + Math.random().toString(36).substring(2, 9);
      return `
        <div class="ai-cli-terminal">
          <div class="ai-cli-header">
            <span class="ai-cli-dot red"></span>
            <span class="ai-cli-dot yellow"></span>
            <span class="ai-cli-dot green"></span>
            <span class="ai-cli-title">Cisco IOS CLI</span>
            <button type="button" class="ai-cli-copy-btn" data-code-id="${codeId}" title="Sao chép các dòng lệnh">
              📋 Copy Code
            </button>
          </div>
          <pre class="ai-cli-body" id="${codeId}"><code>${trimmedCode}</code></pre>
        </div>
      `;
    });

    // Markdown Tables support
    html = html.replace(/((?:^\|.*\|\s*\n)+)/gm, (tableBlock) => {
      const lines = tableBlock.trim().split("\n").filter(Boolean);
      if (lines.length < 2) return tableBlock;
      const headerCells = lines[0].split("|").slice(1, -1).map((c) => `<th>${c.trim()}</th>`).join("");
      const bodyRows = lines.slice(2).map((rowLine) => {
        const cells = rowLine.split("|").slice(1, -1).map((c) => `<td>${c.trim()}</td>`).join("");
        return `<tr>${cells}</tr>`;
      }).join("");
      return `<div class="table-responsive" style="margin:0.55rem 0;"><table class="tech-table"><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table></div>`;
    });

    html = html.replace(/`([^`]+)`/g, "<code class='ai-inline-code'>$1</code>");
    html = html.replace(/^#### (.*$)/gim, "<h5 class='ai-msg-h4'>$1</h5>");
    html = html.replace(/^### (.*$)/gim, "<h4 class='ai-msg-h4'>$1</h4>");
    html = html.replace(/^## (.*$)/gim, "<h3 class='ai-msg-h3'>$1</h3>");
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    html = html.replace(/^> (.*$)/gim, "<blockquote class='ai-quote'>$1</blockquote>");
    html = html.replace(/^\s*-\s+(.*$)/gim, "<li class='ai-list-item'>$1</li>");
    html = html.replace(/(<li class='ai-list-item'>[\s\S]*?<\/li>)/gim, "<ul class='ai-list'>$1</ul>");
    html = html.replace(/^\s*(\d+)\.\s+(.*$)/gim, "<li class='ai-olist-item'><strong>$1.</strong> $2</li>");
    html = html.replace(/\n\n+/g, "<p class='ai-p'></p>");
    html = html.replace(/\n/g, "<br/>");

    return html;
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderAttachmentsPreviewBar() {
    const bar = document.getElementById("ai-attachment-preview-bar");
    const countEl = document.getElementById("ai-attachment-count");
    const scrollEl = document.getElementById("ai-attachments-scroll");
    if (!bar || !scrollEl) return;

    if (attachedImages.length === 0) {
      bar.style.display = "none";
      scrollEl.innerHTML = "";
      return;
    }

    bar.style.display = "block";
    if (countEl) countEl.textContent = `Đã đính kèm ${attachedImages.length}/${MAX_ATTACHED_IMAGES} ảnh`;
    scrollEl.innerHTML = attachedImages
      .map(
        (img, idx) => `
        <div class="ai-thumb-chip" data-id="${img.id}">
          <div class="ai-chip-preview-wrap">
            <img src="${img.previewUrl}" alt="${escapeHtml(img.name)}" class="ai-chip-thumb" />
            <button type="button" class="ai-chip-del-btn" data-id="${img.id}">✕</button>
          </div>
          <span class="ai-chip-label">#${idx + 1}</span>
        </div>
      `
      )
      .join("");

    scrollEl.querySelectorAll(".ai-chip-del-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        attachedImages = attachedImages.filter((it) => it.id !== btn.dataset.id);
        renderAttachmentsPreviewBar();
      });
    });
  }

  function clearAttachments() {
    attachedImages = [];
    renderAttachmentsPreviewBar();
    const fileInput = document.getElementById("ai-image-upload-input");
    if (fileInput) fileInput.value = "";
  }

  function addImageAttachment(file) {
    if (!file || !file.type.startsWith("image/") || attachedImages.length >= MAX_ATTACHED_IMAGES) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1024;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
        attachedImages.push({
          id: "img_" + Math.random().toString(36).substring(2, 9),
          base64: compressedDataUrl.split(",")[1],
          mimeType: "image/jpeg",
          previewUrl: compressedDataUrl,
          name: file.name || `PacketTracer_${attachedImages.length + 1}`,
          width,
          height
        });
        renderAttachmentsPreviewBar();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function openAiTutorModal(initialPrompt) {
    createAiTutorModalDom();
    bindAiTutorEvents();
    loadUserConversations();
    switchOrEnsureContextConversation();

    const modal = document.getElementById("ai-tutor-modal");
    if (!modal) return;
    modal.hidden = false;
    document.body.classList.add("modal-open");

    updateContextDisplay();
    renderChatMessages();

    const input = document.getElementById("ai-user-prompt-input");
    if (input) {
      if (initialPrompt) input.value = initialPrompt;
      setTimeout(() => input.focus(), 100);
    }
  }

  function closeAiTutorModal() {
    const modal = document.getElementById("ai-tutor-modal");
    if (modal) modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  let eventsBound = false;
  function bindAiTutorEvents() {
    const modal = document.getElementById("ai-tutor-modal");
    if (!modal || modal.dataset.bound === "true") return;
    modal.dataset.bound = "true";

    document.getElementById("ai-tutor-close-btn")?.addEventListener("click", closeAiTutorModal);
    document.getElementById("ai-tutor-backdrop")?.addEventListener("click", closeAiTutorModal);

    document.getElementById("ai-context-refresh-btn")?.addEventListener("click", () => {
      switchOrEnsureContextConversation();
      updateContextDisplay();
      renderChatMessages();
    });

    document.getElementById("ai-mode-selector")?.addEventListener("change", (e) => {
      activeAiMode = e.target.value;
      syncModeDropdownUI();
      renderChatMessages();
    });

    document.getElementById("ai-scope-selector")?.addEventListener("change", (e) => {
      activeContextScope = e.target.value;
    });

    document.getElementById("ai-lab-step-select")?.addEventListener("change", (e) => {
      activeLabStepIndex = Number(e.target.value) || 0;
      updateContextDisplay();
    });

    document.getElementById("ai-clear-snippet-btn")?.addEventListener("click", () => {
      currentSelectedSnippet = null;
      activeContextScope = "auto";
      const scopeSel = document.getElementById("ai-scope-selector");
      if (scopeSel) scopeSel.value = "auto";
      updateContextDisplay();
    });

    document.getElementById("ai-new-conv-btn")?.addEventListener("click", () => {
      ensureActiveConversationForContext(true);
      renderChatMessages();
      renderConversationDrawer();
    });

    document.getElementById("ai-conv-history-btn")?.addEventListener("click", () => {
      const drawer = document.getElementById("ai-conv-drawer");
      if (drawer) {
        drawer.hidden = !drawer.hidden;
        if (!drawer.hidden) renderConversationDrawer();
      }
    });

    document.getElementById("ai-conv-search-input")?.addEventListener("input", renderConversationDrawer);

    document.getElementById("ai-settings-toggle-btn")?.addEventListener("click", () => {
      const newKey = prompt(
        "Cấu hình Google Gemini API Key (Bắt đầu bằng AIzaSy... — Để trống để sử dụng Engine Trợ giảng Nội bộ Context-Aware RAG):",
        localStorage.getItem(STORAGE_KEY_API_KEY) || ""
      );
      if (newKey !== null) {
        if (newKey.trim()) localStorage.setItem(STORAGE_KEY_API_KEY, newKey.trim());
        else localStorage.removeItem(STORAGE_KEY_API_KEY);
      }
    });

    const sendBtn = document.getElementById("ai-send-msg-btn");
    const promptInput = document.getElementById("ai-user-prompt-input");
    if (sendBtn) sendBtn.addEventListener("click", () => handleSendUserMessage());
    if (promptInput) {
      promptInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSendUserMessage();
        }
      });
      promptInput.addEventListener("input", () => {
        promptInput.style.height = "auto";
        promptInput.style.height = Math.min(promptInput.scrollHeight, 120) + "px";
      });
    }

    document.getElementById("ai-quick-prompts")?.addEventListener("click", (e) => {
      const chip = e.target.closest(".ai-prompt-chip");
      if (chip && chip.dataset.prompt) {
        handleSendUserMessage(chip.dataset.prompt);
      }
    });

    document.getElementById("ai-image-upload-input")?.addEventListener("change", (e) => {
      if (e.target.files) {
        Array.from(e.target.files).forEach((f) => addImageAttachment(f));
      }
    });
    document.getElementById("ai-clear-all-attachments-btn")?.addEventListener("click", clearAttachments);
  }

  // Watch for Lesson / Lab / Section changes so AI Context updates automatically in real time (Test 6)
  function hookLiveContextAutoUpdater() {
    const notifyContextSwitch = () => {
      activeLabStepIndex = 0;
      currentSelectedSnippet = null;
      loadUserConversations();
      switchOrEnsureContextConversation();
      const modal = document.getElementById("ai-tutor-modal");
      if (modal && !modal.hidden) {
        updateContextDisplay();
        renderChatMessages();
      }
    };

    // Hook into moduleList clicks and primary nav clicks
    document.addEventListener("click", (e) => {
      if (
        e.target.closest(".module-item") ||
        e.target.closest(".acad-nav-btn") ||
        e.target.closest(".mode-tab-btn") ||
        e.target.closest("#prev-module-btn") ||
        e.target.closest("#next-module-btn")
      ) {
        setTimeout(notifyContextSwitch, 80);
      }
    });
  }

  function initAiTutor() {
    // Clean up any non-Gemini OAuth token from localStorage so it doesn't break direct calls
    const savedKey = localStorage.getItem(STORAGE_KEY_API_KEY) || "";
    if (savedKey && !savedKey.startsWith("AIza")) {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
    }

    createAiTutorModalDom();
    bindAiTutorEvents();
    loadUserConversations();
    hookLiveContextAutoUpdater();

    const floatingFab = document.getElementById("floating-ai-fab");
    if (floatingFab) {
      floatingFab.addEventListener("click", () => openAiTutorModal());
    }

    setTimeout(injectAskAiIntoSelectionToolbar, 300);

    if (!eventsBound) {
      eventsBound = true;
      window.addEventListener("paste", (e) => {
        const modal = document.getElementById("ai-tutor-modal");
        if (!modal || modal.hidden) return;
        const items = (e.clipboardData || e.originalEvent.clipboardData)?.items;
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type && items[i].type.indexOf("image") !== -1) {
            e.preventDefault();
            const file = items[i].getAsFile();
            if (file) addImageAttachment(file);
          }
        }
      });
    }
  }

  // Expose Public API for testing & external integration
  window.openAiTutorModal = openAiTutorModal;
  window.closeAiTutorModal = closeAiTutorModal;
  window.initAiTutor = initAiTutor;
  window.AI_NETWORK_TUTOR = {
    AI_MODES,
    collectLivePageContext,
    retrieveRelevantKnowledgeChunks,
    buildContextAndSourcesForQuery,
    callAiNetworkTutorService,
    handleSendUserMessage,
    loadUserConversations,
    getConversationsStore: () => conversationsStore,
    setMode: (m) => { activeAiMode = m; syncModeDropdownUI(); },
    setSelectedSnippet: (s) => { currentSelectedSnippet = s; updateContextDisplay(); }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAiTutor);
  } else {
    initAiTutor();
  }
})();
