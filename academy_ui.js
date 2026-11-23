// ============================================================================
// CCNA NETWORK ACADEMY — ENTERPRISE UI/UX & ACADEMY CONTROLLER (PARTS 3, 4, 5, 6)
// Điều phối toàn bộ:
// - 11-Section Primary Navigation (Dashboard, Learning Roadmap, Fundamentals,
//   CCNA Modules, Practical Labs, Real-world Projects, Troubleshooting,
//   Network Glossary, Practice & Quiz, My Notes & Progress, Settings)
// - Chuẩn hóa 10-Section Lesson Page + Right Table of Contents (Scrollspy)
// - Chuẩn hóa 10-Section Lab Page (A -> J) + 3-Tier Lab Filter (Beginner/Intermediate/Advanced)
// - Multi-User Workspace & Recently Studied History Tracking
// ============================================================================

(function () {
  "use strict";

  window.currentAcademySection = "modules";
  let activeLabTierFilter = "ALL"; // "ALL" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  let recentlyStudied = [];
  let isApplyingHashRoute = false;

  function getActiveAcademyUserId() {
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

  function getRecentStorageKey() {
    return `ccna_recently_studied_${getActiveAcademyUserId()}`;
  }

  function loadRecentlyStudiedForCurrentUser() {
    const uid = getActiveAcademyUserId();
    try {
      const raw = localStorage.getItem(getRecentStorageKey());
      if (raw) {
        recentlyStudied = JSON.parse(raw);
      } else if (uid === "default_user" || uid === "admin" || uid.startsWith("user_04e7ca8d")) {
        recentlyStudied = JSON.parse(localStorage.getItem("ccna_recently_studied") || "[]");
      } else {
        recentlyStudied = [];
      }
      if (!Array.isArray(recentlyStudied)) recentlyStudied = [];
    } catch {
      recentlyStudied = [];
    }
    return recentlyStudied;
  }
  loadRecentlyStudiedForCurrentUser();

  function recordRecentlyStudied(type, id, title, badge) {
    loadRecentlyStudiedForCurrentUser();
    const key = `${type}-${id}`;
    recentlyStudied = recentlyStudied.filter((item) => item.key !== key);
    recentlyStudied.unshift({
      key,
      type,
      id,
      title,
      badge: badge || type.toUpperCase(),
      timestamp: Date.now()
    });
    recentlyStudied = recentlyStudied.slice(0, 8);
    try {
      localStorage.setItem(getRecentStorageKey(), JSON.stringify(recentlyStudied));
    } catch {}
  }

  function updateRouteHash(sectionName, itemId = null) {
    if (isApplyingHashRoute) return;
    try {
      const currentHash = window.location.hash || "";
      if (currentHash.includes("sync=") || currentHash.includes("sync-data=")) return;
      const newHash = itemId !== null && itemId !== undefined
        ? `#${sectionName}/${itemId}`
        : `#${sectionName}`;
      if (currentHash !== newHash) {
        history.replaceState(null, "", newHash);
      }
    } catch {}
  }

  function restoreRouteFromUrlHash() {
    const rawHash = (window.location.hash || "").replace(/^#/, "").trim();
    if (!rawHash || rawHash.includes("sync=") || rawHash.includes("sync-data=")) return false;

    const parts = rawHash.split("/");
    const sec = parts[0];
    const idVal = parts[1] !== undefined ? Number(parts[1]) : null;
    const validSections = new Set([
      "dashboard", "roadmap", "fundamentals", "modules", "labs",
      "projects", "troubleshooting", "glossary", "practice", "workspace", "settings"
    ]);
    if (!validSections.has(sec)) return false;

    isApplyingHashRoute = true;
    try {
      navigateToAcademySection(sec, !isNaN(idVal) ? idVal : null);
    } finally {
      isApplyingHashRoute = false;
    }
    return true;
  }

  // --------------------------------------------------------------------------
  // 1. UPGRADE LESSON VIEW TO STRICT 10-PART PEDAGOGICAL STRUCTURE (PART 3)
  // --------------------------------------------------------------------------
  const originalSelectModule = window.selectModule;

  window.selectModule = function (id) {
    if (typeof originalSelectModule === "function") {
      originalSelectModule(id);
    }

    const mod = (typeof modulesData !== "undefined" && modulesData.find((m) => m.id === id)) || null;
    if (!mod) return;

    const enrich = (typeof MODULE_STANDARD_10_ENRICHMENT !== "undefined" && MODULE_STANDARD_10_ENRICHMENT[id]) || null;
    const isEn = typeof currentLang !== "undefined" && currentLang === "en";

    recordRecentlyStudied(
      "module",
      mod.id,
      `Học phần ${mod.id}: ${mod.title_vi || mod.title}`,
      enrich ? enrich.examTag : `LEVEL 1–8 • MODULE ${mod.id}`
    );

    // Add Bookmark button into .lesson-study-actions if not present
    const actionsBar = document.querySelector("#module-detail .lesson-study-actions");
    if (actionsBar && !document.getElementById("lesson-bookmark-btn")) {
      const bmBtn = document.createElement("button");
      bmBtn.type = "button";
      bmBtn.id = "lesson-bookmark-btn";
      bmBtn.className = "lesson-note-trigger-btn lesson-bookmark-toggle-btn";
      bmBtn.addEventListener("click", () => {
        if (window.CCNA_WORKSPACE) window.CCNA_WORKSPACE.toggleCurrentLessonBookmark();
      });
      actionsBar.insertBefore(bmBtn, actionsBar.children[1] || null);
      if (window.CCNA_WORKSPACE) window.CCNA_WORKSPACE.updateLessonBookmarkButtonUI();
    }

    // Inject Part 3 Standardized Callouts & Sections:
    // 1. Learning Objectives & 2. Real-World Enterprise Scenario at the top of the lesson
    if (enrich && !document.getElementById("sec-block-std-objectives")) {
      const controlBar = document.querySelector("#module-detail .lesson-control-bar");
      if (controlBar) {
        const objectivesListHtml = (enrich.objectives_vi || [])
          .map((obj) => `<li>${formatRichText(obj)}</li>`)
          .join("");

        const prereqText = id === 1
          ? "Không yêu cầu kiến thức mạng trước đó (Bắt đầu từ con số 0). Lưu ý: Các mục thiết bị ngoại vi văn phòng (Máy in Port 9100, Scan SMB, Switch đa hãng Web GUI) trong bài này là phần giới thiệu bức tranh thực tế (Track B) — bạn sẽ học sâu từng giao thức ở các học phần tiếp theo."
          : `Đã hoàn thành **Học phần ${id - 1}** (Thuộc **Level ${enrich.level}** trong Lộ trình 8 Cấp độ).`;

        const relatedLabsForMod = (typeof PACKET_TRACER_LABS !== "undefined" ? PACKET_TRACER_LABS : []).filter((l) => l.moduleId === id);
        const relatedLabsChips = relatedLabsForMod.length > 0
          ? relatedLabsForMod
              .map((l) => `<button type="button" class="rm-lab-chip" data-lesson-jump-lab="${l.id}">🧪 Lab ${String(l.id).padStart(2, "0")}: ${escapeHtml(l.title_vi.replace(/^Lab \d+:\s*/, ""))}</button>`)
              .join("")
          : `<span style="font-size:0.84rem;color:var(--text-muted);">Xem các bài Lab tổng hợp tại mục 5. Practical Labs.</span>`;

        const topStandardHtml = `
          <!-- 1. LEARNING OBJECTIVES, PREREQUISITES, TRACK BADGE & 2. REAL-WORLD SCENARIO (Part 3 Standard) -->
          <section class="section-block std-objectives-block" id="sec-block-std-objectives">
            <div class="section-header-wrap" data-target="heading-std-objectives" role="button" tabindex="0">
              <h3 class="section-title" id="heading-std-objectives">
                <span>1. Learning Objectives, Prerequisites &amp; 2. Real-World Enterprise Scenario (${escapeHtml(enrich.examTag)})</span>
              </h3>
              <div class="section-meta-actions">
                <span class="pt-badge">TRACK A: CCNA 200-301 v1.1</span>
                <span class="pt-badge">LEVEL ${enrich.level}</span>
              </div>
            </div>
            <div class="section-content-body">
              <div class="rm-meta-bar" style="margin-bottom:0.85rem;">
                <span><strong>🔗 Kiến thức tiên quyết (Prerequisites):</strong> ${formatRichText(prereqText)}</span>
              </div>
              <div class="callout-box important">
                <div class="callout-title">🎯 1. Mục tiêu học tập (Learning Objectives — Sau bài học này bạn sẽ làm được gì?)</div>
                <ul class="std-objectives-list">${objectivesListHtml}</ul>
              </div>
              <div class="callout-box example" style="margin-top:0.95rem;">
                <div class="callout-title">🏢 2. Tình huống doanh nghiệp thực tế (Real-World Enterprise Scenario)</div>
                <div class="callout-body">${formatRichText(enrich.scenario_vi)}</div>
              </div>
              <div style="margin-top:0.95rem;">
                <strong style="font-size:0.86rem;color:#15803d;display:block;margin-bottom:0.45rem;">🧪 Bài Lab thực hành Packet Tracer gắn trực tiếp với Học phần ${id}:</strong>
                <div class="rm-labs-grid">${relatedLabsChips}</div>
              </div>
            </div>
          </section>
        `;
        controlBar.insertAdjacentHTML("afterend", topStandardHtml);
        document.querySelectorAll("[data-lesson-jump-lab]").forEach((btn) => {
          btn.addEventListener("click", () => {
            navigateToAcademySection("labs", Number(btn.dataset.lessonJumpLab));
          });
        });
      }

      // Inject 7. Verification & 8. Troubleshooting right after CLI Commands section
      const cmdBlock = document.getElementById("sec-block-heading-commands") || document.getElementById("sec-block-heading-example");
      if (cmdBlock && !document.getElementById("sec-block-std-verify-troubleshoot")) {
        const verRowsHtml = (enrich.verification_vi || [])
          .map(
            (v) => `
            <div class="std-verify-card">
              <div class="std-verify-cmd"><code>${escapeHtml(v.cmd)}</code></div>
              <div class="std-verify-meta"><strong>Mục đích kiểm tra:</strong> ${formatRichText(v.purpose)}</div>
              <div class="std-verify-ok">✅ <strong>Output đúng mong đợi:</strong> ${formatRichText(v.expectedOutput)}</div>
              <div class="std-verify-bad">⚠️ <strong>Dấu hiệu cấu hình sai:</strong> ${formatRichText(v.wrongSign)}</div>
            </div>
          `
          )
          .join("");

        const tsRowsHtml = (enrich.troubleshooting_vi || [])
          .map(
            (t) => `
            <div class="std-ts-card">
              <div class="std-ts-issue">🚨 <strong>${formatRichText(t.issue)}</strong></div>
              <div class="std-ts-cause">🔍 <strong>Nguyên nhân gốc rễ (Root Cause):</strong> ${formatRichText(t.cause)}</div>
              <div class="std-ts-fix">🛠️ <strong>Cách xử lý &amp; Khắc phục chuẩn Cisco:</strong> ${formatRichText(t.fix)}</div>
            </div>
          `
          )
          .join("");

        const verifyTsHtml = `
          <section class="section-block" id="sec-block-std-verify-troubleshoot">
            <div class="section-header-wrap" data-target="heading-std-verify" role="button" tabindex="0">
              <h3 class="section-title" id="heading-std-verify">
                <span>${isEn ? "7. Verification & 8. Troubleshooting Guide" : "Phần 7B & 8B: Kiểm tra nghiệm thu (Verification) & Xử lý sự cố thường gặp (Troubleshooting)"}</span>
              </h3>
            </div>
            <div class="section-content-body">
              <div class="callout-box note">
                <div class="callout-title">🔎 Hướng dẫn Kiểm tra Cấu hình (Verification Output Analysis)</div>
                <div class="std-verify-grid">${verRowsHtml}</div>
              </div>
              <div class="callout-box warning" style="margin-top:1rem;">
                <div class="callout-title">🛠️ Các lỗi thường gặp, Nguyên nhân &amp; Cách xử lý (Troubleshooting Scenarios)</div>
                <div class="std-ts-grid">${tsRowsHtml}</div>
              </div>
            </div>
          </section>
        `;
        cmdBlock.insertAdjacentHTML("afterend", verifyTsHtml);
      }
    }

    // Restore workspace highlights & build Right TOC
    if (window.CCNA_WORKSPACE) {
      window.CCNA_WORKSPACE.restoreHighlightsForLesson(`module-${id}`);
      window.CCNA_WORKSPACE.renderFloatingQuickNotesList();
    }
    if (typeof loadCurrentNoteIntoEditor === "function") {
      loadCurrentNoteIntoEditor();
    }
    updateRouteHash(window.currentAcademySection === "fundamentals" ? "fundamentals" : "modules", id);
    buildRightTableOfContents();
  };

  // --------------------------------------------------------------------------
  // 2. UPGRADE LABS VIEW TO STRICT 10-PART ENGINEERING SPECIFICATION (PART 4 & 5)
  // --------------------------------------------------------------------------
  window.renderSinglePacketTracerLabCard = function (lab) {
    const isEn = typeof currentLang !== "undefined" && currentLang === "en";
    const std = typeof buildLabStandard10Data === "function" ? buildLabStandard10Data(lab) : null;
    const tierInfo = std ? std.tierInfo : { tier: "BEGINNER", tierLabel_vi: lab.level, duration_vi: "30 phút", color: "beginner" };

    const svgDiagram =
      typeof renderPacketTracerTopologySvg === "function"
        ? `<div class="svg-diagram-wrapper">${renderPacketTracerTopologySvg(lab)}</div>`
        : "";

    // D. IP Addressing Table
    let ipTableHtml = "";
    if (lab.ipTable && lab.ipTable.length > 0) {
      const rowsHtml = lab.ipTable
        .map((r) => `<tr>${r.map((c) => `<td>${formatRichText(c)}</td>`).join("")}</tr>`)
        .join("");
      ipTableHtml = `
        <div class="table-responsive">
          <table class="tech-table">
            <thead>
              <tr>
                <th>Thiết bị (Device)</th>
                <th>Cổng giao tiếp (Interface)</th>
                <th>Địa chỉ IP (IP Address)</th>
                <th>Subnet Mask / Prefix</th>
                <th>Default Gateway / Ghi chú</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      `;
    }

    // E. Connection Guide Table
    let connectionGuideHtml = "";
    if (std && std.connectionRows && std.connectionRows.length > 0) {
      const connRows = std.connectionRows
        .map(
          (c) => `
          <tr>
            <td><strong>#${c.step}</strong></td>
            <td><strong>${escapeHtml(c.devA)}</strong></td>
            <td><code class="inline-code">${escapeHtml(c.portA)}</code></td>
            <td><span class="cable-type-pill">${escapeHtml(c.cable)}</span></td>
            <td><strong>${escapeHtml(c.devB)}</strong></td>
            <td><code class="inline-code">${escapeHtml(c.portB)}</code></td>
            <td>${formatRichText(c.note)}</td>
          </tr>
        `
        )
        .join("");
      connectionGuideHtml = `
        <div class="table-responsive">
          <table class="tech-table">
            <thead>
              <tr>
                <th>TT</th>
                <th>Thiết bị A</th>
                <th>Cổng A</th>
                <th>Loại cáp chọn trên Packet Tracer</th>
                <th>Thiết bị B</th>
                <th>Cổng B</th>
                <th>Lý do kỹ thuật &amp; Kiểm tra đèn</th>
              </tr>
            </thead>
            <tbody>${connRows}</tbody>
          </table>
        </div>
      `;
    }

    // F. Step-by-step Configuration & Line-by-line CLI Explanation
    const stepsList = isEn && lab.steps_en && lab.steps_en.length > 0 ? lab.steps_en : (lab.steps_vi || []);
    const stepsHtml = stepsList
      .map((s, idx) => `<li class="pt-step-item" data-lab-id="${lab.id}" data-step-idx="${idx}" title="Click để chọn bước này làm ngữ cảnh cho Trợ lý AI Lab">${formatRichText(s)}</li>`)
      .join("");

    const rawCliText = (lab.cli_commands || [])
      .map((l) => {
        const m = l.match(/^(.+?\s)(#\s.*)$/);
        return m ? m[1].trimEnd() : l;
      })
      .join("\n");

    const cliExplainRows = std && std.cliExplanations
      ? std.cliExplanations
          .map(
            (item) => `
            <tr>
              <td><span class="pt-badge" style="font-size:0.7rem;">${escapeHtml(item.mode || "Cisco IOS CLI")}</span></td>
              <td><code class="inline-code">${escapeHtml(item.cmd)}</code></td>
              <td>${formatRichText(item.explain)}</td>
            </tr>
          `
          )
          .join("")
      : "";

    const beginnerFaqHtml = std && std.beginnerWalkthrough
      ? `
        <details class="lab-cli-explain-details" style="margin-bottom:0.85rem;background:var(--bg-job);border-color:var(--border-job);" open>
          <summary style="color:var(--accent-dark);font-size:0.9rem;">🧭 Cẩm Nang Cầm Tay Chỉ Việc Cho Người Mới Bắt Đầu (Click vào đâu? Chọn cáp gì? Gõ lệnh ở đâu?)</summary>
          <div class="std-verify-grid" style="margin-top:0.65rem;">
            ${std.beginnerWalkthrough
              .map(
                (bw) => `
                <div class="std-verify-card">
                  <div style="font-weight:700;color:var(--text-primary);margin-bottom:0.4rem;font-size:0.9rem;">❓ ${formatRichText(bw.q)}</div>
                  <div class="walkthrough-answer-body">${formatRichText(bw.a)}</div>
                </div>
              `
              )
              .join("")}
          </div>
        </details>
      `
      : "";

    const cliHtml =
      lab.cli_commands && lab.cli_commands.length > 0
        ? `
        <div class="lab-cli-section">
          <div class="lab-cli-toolbar">
            <strong>💻 Tập lệnh Cisco IOS CLI đầy đủ (Bao gồm enable, configure terminal, interface, no shutdown):</strong>
            <button type="button" class="copy-btn lab-copy-cli-btn" data-cli="${escapeHtml(rawCliText)}">📋 Sao chép lệnh CLI</button>
          </div>
          <pre class="cli-block"><code>${formatCliCommands(lab.cli_commands)}</code></pre>
          <details class="lab-cli-explain-details" open>
            <summary>📖 Giải thích chi tiết Chế độ CLI (Mode), Ý nghĩa từng câu lệnh và Tại sao phải gõ lệnh này</summary>
            <div class="table-responsive" style="margin-top:0.55rem;">
              <table class="tech-table">
                <thead>
                  <tr>
                    <th style="width:24%;">Chế độ nhập lệnh (CLI Mode)</th>
                    <th style="width:34%;">Câu lệnh Cisco IOS CLI</th>
                    <th>Tại sao cần nhập lệnh này &amp; Tác động kỹ thuật</th>
                  </tr>
                </thead>
                <tbody>${cliExplainRows}</tbody>
              </table>
            </div>
          </details>
        </div>
      `
        : "";

    // G. Verification Checklist with Sample Expected Output
    const verifyCardsHtml = std && std.verificationCommands
      ? std.verificationCommands
          .map(
            (v) => `
            <div class="std-verify-card">
              <div class="std-verify-cmd">Lệnh kiểm tra: <code>${escapeHtml(v.cmd)}</code></div>
              <div class="std-verify-ok">✅ <strong>Giải thích Output đúng:</strong> ${formatRichText(v.goodOutput)}</div>
              ${
                v.sampleCliOutput
                  ? `<div style="margin:0.45rem 0;">
                      <span style="font-size:0.76rem;font-weight:700;color:var(--text-muted);display:block;margin-bottom:0.2rem;">🖥️ Expected Output Mẫu Trên Màn Hình CLI Khi Cấu Hình Đúng:</span>
                      <pre class="cli-block" style="padding:0.6rem 0.85rem;font-size:0.78rem;margin:0;"><code>${escapeHtml(v.sampleCliOutput)}</code></pre>
                    </div>`
                  : ""
              }
              <div class="std-verify-bad">⚠️ <strong>Nếu kết quả khác (Dấu hiệu sai &amp; Cách xử lý):</strong> ${formatRichText(v.badSign)}</div>
            </div>
          `
          )
          .join("")
      : "";

    // H. Troubleshooting Scenarios
    const tsCardsHtml = std && std.troubleshootingCases
      ? std.troubleshootingCases
          .map(
            (tc) => `
            <div class="std-ts-card">
              <div class="std-ts-issue">🚨 <strong>${formatRichText(tc.title)}</strong></div>
              <ol class="lab-ts-6steps">
                <li><strong>1. Nhận biết dấu hiệu (Symptom):</strong> ${formatRichText(tc.symptom)}</li>
                <li><strong>2. Xác định nguyên nhân (Root Cause):</strong> ${formatRichText(tc.cause)}</li>
                <li><strong>3. Lệnh kiểm tra chẩn đoán:</strong> <code class="inline-code">${escapeHtml(tc.checkCmd)}</code></li>
                <li><strong>4. Phân tích kết quả Output:</strong> ${formatRichText(tc.analysis)}</li>
                <li><strong>5. Lệnh khắc phục (Fix):</strong> <code class="inline-code">${escapeHtml(tc.fixCmd)}</code></li>
                <li><strong>6. Kiểm tra lại (Re-verify):</strong> ${formatRichText(tc.reverify)}</li>
              </ol>
            </div>
          `
          )
          .join("")
      : "";

    // J. Real-world Extension
    const extItemsHtml = std && std.extension_vi
      ? std.extension_vi.map((ext) => `<li>${formatRichText(ext)}</li>`).join("")
      : "";

    const title = isEn ? (lab.title_en || lab.title_vi.replace(/^Lab \d+:\s*/, "")) : lab.title_vi;
    const objective = isEn ? (lab.objective_en || lab.objective_vi) : lab.objective_vi;
    const verify = isEn ? (lab.verify_en || lab.verify_vi) : lab.verify_vi;

    return `
      <article class="pt-lab-card" id="pt-lab-${lab.id}" data-tier="${tierInfo.tier}">
        <div class="pt-lab-header">
          <div class="pt-lab-badges">
            <span class="pt-badge">BÀI LAB ${String(lab.id).padStart(2, "0")} / 35</span>
            <span class="pt-badge pt-tier-badge ${tierInfo.color}">${escapeHtml(tierInfo.tierLabel_vi)}</span>
            <span class="pt-badge">⏱️ ${escapeHtml(tierInfo.duration_vi)}</span>
            ${
              std && std.hasPktFile
                ? `<a href="${escapeHtml(std.pktFileUrl)}" download class="pt-badge" style="background:#dcfce7;color:#15803d;border:1px solid #86efac;text-decoration:none;" title="Tải file mô phỏng Cisco Packet Tracer (.pkt) của bài Lab này">📥 Tải file lab01.pkt</a>`
                : `<span class="pt-badge" title="Học viên tự dựng sơ đồ trên Cisco Packet Tracer 8.2+ theo Bảng E và nạp CLI theo Mục F">🖥️ Packet Tracer 8.2+ (Manual Build)</span>`
            }
            <button type="button" class="pt-badge pt-link-mod-btn" data-jump-mod="${lab.moduleId}" title="Mở bài lý thuyết liên quan">
              📘 Lý thuyết: Học phần ${lab.moduleId} &rarr;
            </button>
          </div>
          <h4 class="pt-lab-title">${escapeHtml(title)}</h4>
        </div>

        <div class="pt-lab-body">
          <!-- A. LAB OVERVIEW -->
          <div class="lab-std-section" id="lab-${lab.id}-sec-a">
            <h5 class="lab-std-heading">A. Lab Overview (Tổng quan bài thực hành)</h5>
            <div class="lab-overview-meta-grid">
              <div><strong>🎯 Mục tiêu:</strong> ${formatRichText(objective)}</div>
              <div><strong>📊 Độ khó:</strong> ${escapeHtml(tierInfo.tierLabel_vi)} (${escapeHtml(lab.level)})</div>
              <div><strong>📚 Kiến thức tiên quyết:</strong> ${std ? formatRichText(std.prerequisites_vi) : ""}</div>
              <div><strong>🧰 Công cụ &amp; Thời gian dự kiến:</strong> ${std ? escapeHtml(std.tools_vi) : "Cisco Packet Tracer"} • Khoảng ${escapeHtml(tierInfo.duration_vi)}</div>
              <div style="grid-column: 1 / -1;"><strong>🔬 Trạng thái kiểm chứng mô phỏng (Packet Tracer Compatibility):</strong> ${std ? formatRichText(std.ptCompatibilityNote_vi) : ""}</div>
            </div>
          </div>

          <!-- B. BUSINESS SCENARIO -->
          <div class="lab-std-section" id="lab-${lab.id}-sec-b">
            <h5 class="lab-std-heading">B. Business Scenario (Tình huống triển khai thực tế tại doanh nghiệp)</h5>
            <div class="callout-box example">
              <div class="callout-body">${std ? formatRichText(std.scenario_vi) : formatRichText(objective)}</div>
            </div>
          </div>

          <!-- C. NETWORK TOPOLOGY -->
          <div class="lab-std-section" id="lab-${lab.id}-sec-c">
            <h5 class="lab-std-heading">C. Network Topology (Sơ đồ mạng trực quan &amp; Trạng thái cổng)</h5>
            ${svgDiagram}
          </div>

          <!-- D. IP ADDRESSING TABLE -->
          <div class="lab-std-section" id="lab-${lab.id}-sec-d">
            <h5 class="lab-std-heading">D. IP Addressing Table (Bảng quy hoạch địa chỉ IP &amp; Gateway)</h5>
            ${ipTableHtml}
          </div>

          <!-- E. CONNECTION GUIDE -->
          <div class="lab-std-section" id="lab-${lab.id}-sec-e">
            <h5 class="lab-std-heading">E. Connection Guide (Hướng dẫn chọn thiết bị, Click chuột &amp; Đấu nối cáp từng cổng A &harr; B)</h5>
            ${beginnerFaqHtml}
            ${connectionGuideHtml}
          </div>

          <!-- F. STEP-BY-STEP CONFIGURATION -->
          <div class="lab-std-section" id="lab-${lab.id}-sec-f">
            <h5 class="lab-std-heading">F. Step-by-Step Configuration (Hướng dẫn thao tác &amp; Giải thích lệnh CLI)</h5>
            <ul class="pt-steps-list">${stepsHtml}</ul>
            <div style="margin-top:0.85rem;">${cliHtml}</div>
          </div>

          <!-- G. VERIFICATION -->
          <div class="lab-std-section" id="lab-${lab.id}-sec-g">
            <h5 class="lab-std-heading">G. Verification (Các lệnh kiểm tra &amp; Phân tích Output đúng / sai)</h5>
            <div class="std-verify-grid">${verifyCardsHtml}</div>
          </div>

          <!-- H. TROUBLESHOOTING SCENARIOS -->
          <div class="lab-std-section" id="lab-${lab.id}-sec-h">
            <h5 class="lab-std-heading">H. Troubleshooting Scenarios (Chẩn đoán &amp; Xử lý sự cố thực tế)</h5>
            <div class="std-ts-grid">${tsCardsHtml}</div>
          </div>

          <!-- I. EXPECTED RESULT -->
          <div class="lab-std-section" id="lab-${lab.id}-sec-i">
            <h5 class="lab-std-heading">I. Expected Result (Tiêu chí nghiệm thu kết quả đầu ra)</h5>
            <div class="pt-verify-box">
              <strong>✅ Điều kiện hoàn thành 100% bài Lab:</strong> ${formatRichText(verify)}
            </div>
          </div>

          <!-- J. REAL-WORLD EXTENSION -->
          <div class="lab-std-section" id="lab-${lab.id}-sec-j">
            <h5 class="lab-std-heading">J. Real-World Enterprise Extension (Mở rộng nâng cao theo môi trường doanh nghiệp)</h5>
            <div class="callout-box note">
              <ul class="std-objectives-list">${extItemsHtml}</ul>
            </div>
          </div>
        </div>
      </article>
    `;
  };

  // Enhance renderLabsView to include 3-Tier Filter Bar (Beginner / Intermediate / Advanced) & Copy CLI handlers
  const originalRenderLabsView = window.renderLabsView;
  window.renderLabsView = function (labId) {
    if (typeof originalRenderLabsView === "function") {
      originalRenderLabsView(labId);
    }

    if (labId > 0) {
      const allLabs = typeof PACKET_TRACER_LABS !== "undefined" ? PACKET_TRACER_LABS : [];
      const lab = allLabs.find((l) => l.id === labId);
      if (lab) {
        recordRecentlyStudied("lab", lab.id, lab.title_vi, `LAB ${String(lab.id).padStart(2, "0")} • ${lab.level}`);
      }
    }

    // Add Bookmark button into lab study actions
    const actionsBar = document.querySelector("#module-detail .lesson-study-actions");
    if (actionsBar && !document.getElementById("lab-bookmark-btn") && labId > 0) {
      const bmBtn = document.createElement("button");
      bmBtn.type = "button";
      bmBtn.id = "lab-bookmark-btn";
      bmBtn.className = "lesson-note-trigger-btn lesson-bookmark-toggle-btn";
      bmBtn.addEventListener("click", () => {
        if (window.CCNA_WORKSPACE) window.CCNA_WORKSPACE.toggleCurrentLessonBookmark();
      });
      actionsBar.insertBefore(bmBtn, actionsBar.children[1] || null);
      if (window.CCNA_WORKSPACE) window.CCNA_WORKSPACE.updateLessonBookmarkButtonUI();
    }

    // Inject 3-Level Tier Filter Bar when viewing all 35 Labs (Part 5 requirement)
    const wrapper = document.querySelector("#module-detail .pt-labs-wrapper");
    if (wrapper && labId === 0 && !document.getElementById("lab-tier-filter-bar")) {
      const filterBarHtml = `
        <div class="lab-tier-filter-bar" id="lab-tier-filter-bar">
          <span class="tier-filter-label">Lọc theo cấp độ Lab (Part 5):</span>
          <button type="button" class="tier-filter-btn ${activeLabTierFilter === "ALL" ? "active" : ""}" data-tier-filter="ALL">Tất cả (35 Labs)</button>
          <button type="button" class="tier-filter-btn beginner ${activeLabTierFilter === "BEGINNER" ? "active" : ""}" data-tier-filter="BEGINNER">🟢 BEGINNER (11 Labs Cơ bản)</button>
          <button type="button" class="tier-filter-btn intermediate ${activeLabTierFilter === "INTERMEDIATE" ? "active" : ""}" data-tier-filter="INTERMEDIATE">🔵 INTERMEDIATE (16 Labs Trung cấp)</button>
          <button type="button" class="tier-filter-btn advanced ${activeLabTierFilter === "ADVANCED" ? "active" : ""}" data-tier-filter="ADVANCED">🟣 ADVANCED / REAL-WORLD (8 Labs Doanh nghiệp)</button>
        </div>
      `;
      wrapper.insertAdjacentHTML("beforebegin", filterBarHtml);

      document.querySelectorAll("[data-tier-filter]").forEach((btn) => {
        btn.addEventListener("click", () => {
          activeLabTierFilter = btn.dataset.tierFilter;
          document.querySelectorAll("[data-tier-filter]").forEach((b) => b.classList.toggle("active", b === btn));
          document.querySelectorAll("#module-detail .pt-lab-card").forEach((card) => {
            if (activeLabTierFilter === "ALL" || card.dataset.tier === activeLabTierFilter) {
              card.style.display = "";
            } else {
              card.style.display = "none";
            }
          });
        });
      });
    }

    // Bind Copy CLI & Jump to Related Theory Module buttons inside lab cards
    document.querySelectorAll(".lab-copy-cli-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const text = btn.dataset.cli || "";
        try {
          await navigator.clipboard.writeText(text);
          const orig = btn.textContent;
          btn.textContent = "✓ Đã sao chép CLI!";
          setTimeout(() => (btn.textContent = orig), 1600);
        } catch {}
      });
    });

    document.querySelectorAll("[data-jump-mod]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const modId = Number(btn.dataset.jumpMod) || 1;
        navigateToAcademySection("modules", modId);
      });
    });

    if (window.CCNA_WORKSPACE) {
      window.CCNA_WORKSPACE.restoreHighlightsForLesson(labId > 0 ? `lab-${labId}` : "labs-general");
      window.CCNA_WORKSPACE.renderFloatingQuickNotesList();
    }
    if (typeof loadCurrentNoteIntoEditor === "function") {
      loadCurrentNoteIntoEditor();
    }
    updateRouteHash("labs", labId);
    buildRightTableOfContents();
  };

  // --------------------------------------------------------------------------
  // 3. RIGHT SIDEBAR: STICKY TABLE OF CONTENTS WITH SCROLLSPY (PART 6)
  // --------------------------------------------------------------------------
  function buildRightTableOfContents() {
    const tocContainer = document.getElementById("right-toc-content");
    const tocSidebar = document.getElementById("right-toc-sidebar");
    const detailEl = document.getElementById("module-detail");
    if (!tocContainer || !tocSidebar || !detailEl) return;

    const headings = Array.from(
      detailEl.querySelectorAll("h3.section-title, h4.pt-lab-title, h5.lab-std-heading, h3.mastery-title")
    ).filter((h) => h.offsetParent !== null);

    if (headings.length < 2) {
      tocSidebar.classList.add("is-empty");
      tocContainer.innerHTML = "";
      return;
    }

    tocSidebar.classList.remove("is-empty");

    // Compute estimated reading time & check active lesson Notes / Highlights
    const wordCount = (detailEl.innerText || "").trim().split(/\s+/).filter(Boolean).length;
    const estMinutes = Math.max(1, Math.round(wordCount / 210));
    const currentKey = typeof getCurrentLessonNoteKey === "function" ? getCurrentLessonNoteKey() : "";
    const wsDB = window.CCNA_WORKSPACE && typeof window.CCNA_WORKSPACE.getWorkspaceDB === "function"
      ? window.CCNA_WORKSPACE.getWorkspaceDB()
      : { notes: [], highlights: [] };
    const lessonNotes = (wsDB.notes || []).filter((n) => !n.deletedAt && n.lessonKey === currentKey);
    const lessonHighlights = (wsDB.highlights || []).filter((h) => !h.deletedAt && h.lessonKey === currentKey);

    const itemsHtml = headings
      .slice(0, 18)
      .map((h, idx) => {
        if (!h.id) {
          h.id = `toc-target-${idx}`;
        }
        const rawText = h.textContent.trim();
        const shortText = rawText.length > 44 ? rawText.substring(0, 44) + "..." : rawText;
        const isSub = h.tagName === "H5";
        const parentSection = h.closest("section, article");
        const hasHlInSec = parentSection ? !!parentSection.querySelector("mark.ws-highlight-mark, mark.user-highlight") : false;
        const hasNoteInSec = idx === 0 && lessonNotes.length > 0;
        const badges = `${hasNoteInSec ? `<span class="toc-status-icon" title="Có ${lessonNotes.length} ghi chú">📝</span>` : ""}${hasHlInSec ? `<span class="toc-status-icon" title="Có đoạn đã Highlight">🖍️</span>` : ""}`;
        return `
          <li>
            <a href="#${h.id}" class="right-toc-link ${isSub ? "sub-level" : ""}" data-toc-target="${h.id}">
              <span>${escapeHtml(shortText)}</span>${badges}
            </a>
          </li>
        `;
      })
      .join("");

    tocContainer.innerHTML = `
      <div class="right-toc-header">📑 MỤC LỤC TRANG (ON THIS PAGE)</div>
      <div class="right-toc-meta">
        <span>⏱️ ~${estMinutes} phút đọc</span>
        <span>📝 ${lessonNotes.length} • 🖍️ ${lessonHighlights.length}</span>
      </div>
      <ul class="right-toc-list">${itemsHtml}</ul>
      <div class="right-toc-quick-tools">
        <button type="button" class="right-toc-tool-btn" id="toc-open-notes-btn">📝 Mở Sổ tay Ghi chú (Alt+N)</button>
        <button type="button" class="right-toc-tool-btn" id="toc-open-ai-btn">🤖 Hỏi Trợ lý AI Cisco (Alt+A)</button>
        <button type="button" class="right-toc-tool-btn" id="toc-open-cmd-btn">🔍 Tìm toàn hệ thống (Ctrl+K)</button>
      </div>
    `;

    tocContainer.querySelectorAll(".right-toc-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.dataset.tocTarget;
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const parentBlock = targetEl.closest(".section-block");
          if (parentBlock && parentBlock.classList.contains("is-collapsed")) {
            parentBlock.classList.remove("is-collapsed");
          }
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    document.getElementById("toc-open-notes-btn")?.addEventListener("click", () => {
      if (typeof openNotesModal === "function") openNotesModal("current");
    });
    document.getElementById("toc-open-ai-btn")?.addEventListener("click", () => {
      if (typeof window.openAiTutorModal === "function") window.openAiTutorModal();
    });
    document.getElementById("toc-open-cmd-btn")?.addEventListener("click", () => {
      if (typeof window.openCommandPalette === "function") window.openCommandPalette("");
    });
  }

  // Scrollspy highlighter for Right TOC
  window.addEventListener(
    "scroll",
    () => {
      const links = document.querySelectorAll(".right-toc-link");
      if (links.length === 0) return;
      let activeId = null;
      const scrollPos = window.scrollY + 130;

      links.forEach((link) => {
        const target = document.getElementById(link.dataset.tocTarget);
        if (target && target.offsetTop <= scrollPos) {
          activeId = link.dataset.tocTarget;
        }
      });

      links.forEach((link) => {
        link.classList.toggle("active", link.dataset.tocTarget === activeId);
      });
    },
    { passive: true }
  );

  // --------------------------------------------------------------------------
  // 4. DEDICATED PAGES FOR 11-SECTION MAIN NAVIGATION (PART 6)
  // --------------------------------------------------------------------------

  // Page 1: DASHBOARD (Learning Progress, Current Path, Continue Learning, Skills, Labs)
  function renderDashboardPage() {
    const container = document.getElementById("module-detail");
    if (!container) return;

    const totalMods = (typeof modulesData !== "undefined" && modulesData.length) || 17;
    const totalLabs = (typeof PACKET_TRACER_LABS !== "undefined" && PACKET_TRACER_LABS.length) || 35;
    const totalMastery = (typeof CCNA_EXAM_MASTERY !== "undefined" && CCNA_EXAM_MASTERY.length) || 10;

    let doneMods = 0;
    let doneLabs = 0;
    let doneMastery = 0;
    for (let i = 1; i <= totalMods; i++) if (completedItems["module-" + i]) doneMods++;
    for (let i = 1; i <= totalLabs; i++) if (completedItems["lab-" + i]) doneLabs++;
    for (let i = 1; i <= totalMastery; i++) if (completedItems["mastery-" + i]) doneMastery++;

    const totalAll = totalMods + totalLabs + totalMastery;
    const doneAll = doneMods + doneLabs + doneMastery;
    const overallPct = Math.round((doneAll / totalAll) * 100);

    // Find next uncompleted module & lab for "Continue Learning"
    let nextModId = 1;
    for (let i = 1; i <= totalMods; i++) {
      if (!completedItems["module-" + i]) {
        nextModId = i;
        break;
      }
    }
    const nextMod = (typeof modulesData !== "undefined" && modulesData.find((m) => m.id === nextModId)) || { id: 1, title_vi: "Mạng Máy Tính Ngày Nay" };

    let nextLabId = 1;
    for (let i = 1; i <= totalLabs; i++) {
      if (!completedItems["lab-" + i]) {
        nextLabId = i;
        break;
      }
    }
    const nextLab = (typeof PACKET_TRACER_LABS !== "undefined" && PACKET_TRACER_LABS.find((l) => l.id === nextLabId)) || { id: 1, title_vi: "Lab 01: Làm Quen Cisco Packet Tracer" };

    const wsDB = window.CCNA_WORKSPACE ? window.CCNA_WORKSPACE.getWorkspaceDB() : { notes: [], highlights: [], flashcards: [] };

    // Calculate progress per 8 Levels
    const roadmap = window.CCNA_ACADEMY_ROADMAP || [];
    const levelCardsHtml = roadmap
      .map((lv) => {
        const lvItems = [
          ...(lv.moduleIds || []).map((id) => `module-${id}`),
          ...(lv.masteryIds || []).map((id) => `mastery-${id}`),
          ...(lv.labIds || []).map((id) => `lab-${id}`)
        ];
        const lvDone = lvItems.filter((k) => completedItems[k]).length;
        const lvPct = lvItems.length > 0 ? Math.round((lvDone / lvItems.length) * 100) : 0;
        return `
          <div class="dash-level-row">
            <div class="dash-level-info">
              <span class="pt-badge">${escapeHtml(lv.code)}</span>
              <strong>${escapeHtml(lv.title_vi)}</strong>
            </div>
            <div class="dash-level-bar-wrap">
              <div class="dash-level-bar"><div class="dash-level-fill" style="width:${lvPct}%"></div></div>
              <span class="dash-level-pct">${lvDone}/${lvItems.length} (${lvPct}%)</span>
            </div>
          </div>
        `;
      })
      .join("");

    const recentHtml =
      recentlyStudied.length > 0
        ? recentlyStudied
            .slice(0, 4)
            .map(
              (r) => `
              <div class="dash-rec-item" data-rec-type="${escapeHtml(r.type)}" data-rec-id="${r.id}">
                <span class="pt-badge">${escapeHtml(r.badge)}</span>
                <strong>${escapeHtml(r.title)}</strong>
              </div>
            `
            )
            .join("")
        : `<p style="font-size:0.86rem;color:var(--text-muted);">Hãy chọn một bài học hoặc bài Lab để bắt đầu lưu lịch sử học tập.</p>`;

    container.innerHTML = `
      <div class="academy-dashboard">
        <header class="module-header">
          <div class="module-kicker">CCNA NETWORK ACADEMY • ENTERPRISE LEARNING DASHBOARD</div>
          <h2 class="module-heading">Trung Tâm Điều Khiển &amp; Theo Dõi Tiến Độ Học Tập CCNA 200-301</h2>
          <div class="module-heading-sub">
            Học từ nền tảng con số 0 đến thi đỗ chứng chỉ quốc tế Cisco CCNA 200-301, thực hành thành thạo 35 bài Lab Cisco Packet Tracer và làm chủ kỹ năng triển khai, vận hành, xử lý sự cố mạng doanh nghiệp.
          </div>
        </header>

        <!-- Top KPI Stats Grid -->
        <div class="dash-kpi-grid">
          <div class="dash-kpi-card accent">
            <div class="kpi-label">TIẾN ĐỘ TỔNG THỂ (OVERALL PROGRESS)</div>
            <div class="kpi-value">${overallPct}%</div>
            <div class="kpi-sub">Đã hoàn thành ${doneAll} / ${totalAll} nội dung học &amp; Lab</div>
            <div class="dash-level-bar" style="margin-top:0.5rem;"><div class="dash-level-fill" style="width:${overallPct}%"></div></div>
          </div>
          <div class="dash-kpi-card">
            <div class="kpi-label">LÝ THUYẾT &amp; CHUYÊN ĐỀ (MODULES)</div>
            <div class="kpi-value">${doneMods + doneMastery} / ${totalMods + totalMastery}</div>
            <div class="kpi-sub">${doneMods}/17 Học phần • ${doneMastery}/10 Chuyên đề</div>
          </div>
          <div class="dash-kpi-card">
            <div class="kpi-label">THỰC HÀNH PACKET TRACER (LABS)</div>
            <div class="kpi-value">${doneLabs} / ${totalLabs}</div>
            <div class="kpi-sub">Beginner • Intermediate • Advanced</div>
          </div>
          <div class="dash-kpi-card">
            <div class="kpi-label">PERSONAL WORKSPACE</div>
            <div class="kpi-value">${wsDB.notes.length} Notes</div>
            <div class="kpi-sub">${wsDB.highlights.length} Highlights • ${wsDB.flashcards.length} Custom Cards</div>
          </div>
        </div>

        <!-- SM-2 Spaced Repetition Daily Reminder Banner -->
        <div class="dash-sm2-banner">
          <div>
            <strong>🃏 Lịch ôn tập Anki SM-2 hôm nay:</strong>
            <span>Hôm nay bạn có <strong>${typeof window.getDueFlashcardsCount === "function" ? window.getDueFlashcardsCount() : 15}</strong> thẻ Flashcard đến hạn cần ôn tập để ghi nhớ dài hạn.</span>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button type="button" class="ws-btn primary" id="dash-sm2-review-btn">🔥 Ôn tập thẻ đến hạn (SM-2)</button>
            <button type="button" class="ws-btn" id="dash-open-ios-btn">💻 Cisco IOS CLI Simulator</button>
            <button type="button" class="ws-btn" id="dash-open-subnet-btn">🧮 Subnet &amp; VLSM Architect</button>
          </div>
        </div>

        <!-- 6-Domain CCNA 200-301 Mastery Radar & Smart Weak-Spot Drill -->
        <section class="section-block" id="dash-sec-radar">
          <div class="section-header-wrap">
            <h3 class="section-title" id="heading-dash-radar"><span>🎯 Phân tích 6 Domain CCNA 200-301 &amp; Radar Điểm Yếu</span></h3>
            <button type="button" class="ws-btn primary" id="dash-weak-drill-btn">🩺 Luyện tập khắc phục điểm yếu (Weak-Spot Drill)</button>
          </div>
          <div class="section-content">
            ${typeof window.renderSixDomainRadarSvg === "function" ? window.renderSixDomainRadarSvg() : ""}
          </div>
        </section>

        <!-- Continue Learning & Upcoming Lab Split -->
        <div class="dash-dual-grid">
          <div class="dash-action-card">
            <span class="pt-badge">📘 CONTINUE LEARNING (BÀI HỌC TIẾP THEO)</span>
            <h3 class="dash-card-title">Học phần ${nextMod.id}: ${escapeHtml(nextMod.title_vi || nextMod.title)}</h3>
            <p class="dash-card-desc">${formatRichText((nextMod.overview_vi || "").substring(0, 175))}...</p>
            <div class="dash-card-btns">
              <button type="button" class="ws-btn primary" id="dash-continue-mod-btn" data-id="${nextMod.id}">🚀 Học tiếp Học phần ${nextMod.id}</button>
              <button type="button" class="ws-btn" id="dash-open-roadmap-btn">🗺️ Xem Lộ trình 8 Level</button>
            </div>
          </div>

          <div class="dash-action-card">
            <span class="pt-badge">🧪 UPCOMING HANDS-ON LAB (BÀI LAB ĐỀ XUẤT)</span>
            <h3 class="dash-card-title">${escapeHtml(nextLab.title_vi)}</h3>
            <p class="dash-card-desc">${formatRichText((nextLab.objective_vi || "").substring(0, 175))}...</p>
            <div class="dash-card-btns">
              <button type="button" class="ws-btn primary" id="dash-continue-lab-btn" data-id="${nextLab.id}">🛠️ Thực hành Bài Lab ${nextLab.id}</button>
              <button type="button" class="ws-btn" id="dash-open-exam-btn">🎯 Vào Phòng Thi Thử CCNA</button>
            </div>
          </div>
        </div>

        <!-- 8-Level Learning Path Progress & Skills Overview -->
        <section class="section-block" id="dash-sec-levels">
          <div class="section-header-wrap">
            <h3 class="section-title" id="heading-dash-levels"><span>📊 Tiến độ theo 8 Cấp độ Kỹ sư Mạng (Current Learning Path &amp; Skills Overview)</span></h3>
          </div>
          <div class="section-content-body">
            <div class="dash-levels-list">${levelCardsHtml}</div>
          </div>
        </section>

        <!-- Recently Studied & Quick Access -->
        <section class="section-block" id="dash-sec-recent">
          <div class="section-header-wrap">
            <h3 class="section-title" id="heading-dash-recent"><span>🕒 Đã học gần đây (Recently Studied) &amp; Truy cập nhanh</span></h3>
          </div>
          <div class="section-content-body">
            <div class="dash-recent-grid">${recentHtml}</div>
          </div>
        </section>
      </div>
    `;

    document.getElementById("dash-continue-mod-btn")?.addEventListener("click", (e) => {
      navigateToAcademySection("modules", Number(e.currentTarget.dataset.id));
    });
    document.getElementById("dash-open-roadmap-btn")?.addEventListener("click", () => {
      navigateToAcademySection("roadmap");
    });
    document.getElementById("dash-continue-lab-btn")?.addEventListener("click", (e) => {
      navigateToAcademySection("labs", Number(e.currentTarget.dataset.id));
    });
    document.getElementById("dash-open-exam-btn")?.addEventListener("click", () => {
      if (typeof window.openMockExam === "function") window.openMockExam(30);
    });
    document.getElementById("dash-sm2-review-btn")?.addEventListener("click", () => {
      if (typeof window.openFlashcardsModal === "function") window.openFlashcardsModal("due");
    });
    document.getElementById("dash-open-ios-btn")?.addEventListener("click", () => {
      if (typeof window.openStandaloneIosTerminal === "function") window.openStandaloneIosTerminal(0);
    });
    document.getElementById("dash-open-subnet-btn")?.addEventListener("click", () => {
      if (typeof window.openSubnetToolkitModal === "function") window.openSubnetToolkitModal("cidr");
    });
    document.getElementById("dash-weak-drill-btn")?.addEventListener("click", () => {
      if (typeof window.startWeakSpotDrill === "function") window.startWeakSpotDrill();
    });
    container.querySelectorAll("[data-rec-type]").forEach((el) => {
      el.addEventListener("click", () => {
        const t = el.dataset.recType;
        const id = Number(el.dataset.recId);
        if (t === "lab") navigateToAcademySection("labs", id);
        else if (t === "mastery") navigateToAcademySection("projects", id);
        else navigateToAcademySection("modules", id);
      });
    });

    buildRightTableOfContents();
  }

  // Page 2: LEARNING ROADMAP (8 Levels from Beginner to Real-World Engineer - Part 2)
  function renderRoadmapPage() {
    const container = document.getElementById("module-detail");
    if (!container) return;

    const roadmap = window.CCNA_ACADEMY_ROADMAP || [];
    const allLabs = typeof PACKET_TRACER_LABS !== "undefined" ? PACKET_TRACER_LABS : [];
    const allMastery = typeof CCNA_EXAM_MASTERY !== "undefined" ? CCNA_EXAM_MASTERY : [];

    const levelsHtml = roadmap
      .map((lv) => {
        const topicsHtml = (lv.topics || [])
          .map((t) => {
            const scopeBadge = t.examCore
              ? `<span class="rm-scope-pill core" title="Kiến thức bắt buộc trong kỳ thi CCNA 200-301">CCNA Exam Core</span>`
              : `<span class="rm-scope-pill ext" title="Kiến thức mở rộng phục vụ công việc thực tế">Real-World Job Ext</span>`;
            const targetAttr = t.moduleId
              ? `data-rm-mod="${t.moduleId}"`
              : `data-rm-mastery="${t.masteryId || 1}"`;
            return `
              <button type="button" class="rm-topic-chip" ${targetAttr}>
                <span class="rm-topic-name">${escapeHtml(t.name)}</span>
                ${scopeBadge}
              </button>
            `;
          })
          .join("");

        const labsHtml = (lv.labIds || [])
          .map((lid) => {
            const lab = allLabs.find((l) => l.id === lid);
            if (!lab) return "";
            const isDone = !!completedItems[`lab-${lid}`];
            return `
              <button type="button" class="rm-lab-chip ${isDone ? "done" : ""}" data-rm-lab="${lid}">
                🧪 ${isDone ? "✓ " : ""}Lab ${String(lid).padStart(2, "0")}: ${escapeHtml(lab.title_vi.replace(/^Lab \d+:\s*/, ""))}
              </button>
            `;
          })
          .join("");

        const outcomesHtml = (lv.outcomes_vi || [])
          .map((o) => `<li>${escapeHtml(o)}</li>`)
          .join("");

        return `
          <section class="section-block roadmap-level-card" id="roadmap-level-${lv.level}">
            <div class="section-header-wrap">
              <h3 class="section-title" id="heading-rm-lv-${lv.level}">
                <span>${escapeHtml(lv.code)}: ${escapeHtml(lv.title_vi)}</span>
              </h3>
              <div class="section-meta-actions">
                <span class="pt-badge">${escapeHtml(lv.badge)}</span>
              </div>
            </div>
            <div class="section-content-body">
              <div class="rm-meta-bar">
                <span><strong>📌 Phạm vi đề thi:</strong> ${escapeHtml(lv.examScope)}</span>
                <span><strong>🔗 Kiến thức cần có trước:</strong> ${escapeHtml(lv.prerequisites_vi)}</span>
              </div>
              <p class="overview-text" style="margin-top:0.6rem;">${escapeHtml(lv.summary_vi)}</p>

              <div class="callout-box note" style="margin-top:0.85rem;">
                <div class="callout-title">🎯 Chuẩn đầu ra sau khi hoàn thành ${escapeHtml(lv.code)}:</div>
                <ul class="std-objectives-list">${outcomesHtml}</ul>
              </div>

              <div style="margin-top:1rem;">
                <strong style="font-size:0.9rem;color:var(--accent-dark);display:block;margin-bottom:0.5rem;">
                  📘 Các chủ đề lý thuyết &amp; Chuyên đề trong ${escapeHtml(lv.code)} (Bấm vào từng chủ đề để học ngay):
                </strong>
                <div class="rm-topics-grid">${topicsHtml}</div>
              </div>

              ${
                labsHtml
                  ? `<div style="margin-top:1rem;">
                      <strong style="font-size:0.9rem;color:#15803d;display:block;margin-bottom:0.5rem;">
                        🧪 Các bài Lab thực hành Cisco Packet Tracer thuộc ${escapeHtml(lv.code)}:
                      </strong>
                      <div class="rm-labs-grid">${labsHtml}</div>
                    </div>`
                  : ""
              }
            </div>
          </section>
        `;
      })
      .join("");

    container.innerHTML = `
      <div class="academy-roadmap-view">
        <header class="module-header">
          <div class="module-kicker">SYSTEMATIC 8-LEVEL LEARNING PATH • TRACK A (CCNA 200-301 v1.1) &amp; TRACK B (REAL-WORLD ENGINEER)</div>
          <h2 class="module-heading">Lộ Trình Học Tập Có Hệ Thống Từ Con Số 0 Đến Kỹ Sư Mạng Doanh Nghiệp (8 Levels)</h2>
          <div class="module-heading-sub">
            Hệ thống phân tách rõ ràng 2 luồng kiến thức bổ trợ nhau:
            <br/>• <strong>TRACK A — CCNA 200-301 Official Exam Blueprint (v1.1 — 6 Domains):</strong> 1.0 Network Fundamentals (20%), 2.0 Network Access (20%), 3.0 IP Connectivity (25%), 4.0 IP Services (10%), 5.0 Security Fundamentals (15%), 6.0 Automation &amp; Programmability (10%) — Gắn nhãn <span class="rm-scope-pill core">CCNA Exam Core</span>.
            <br/>• <strong>TRACK B — Real-World Enterprise Network Engineer:</strong> Thiết kế mạng phân cấp 3 lớp, quy hoạch IP/VLAN, lắp đặt tủ Rack &amp; Patch Panel, quản trị thiết bị đa hãng (HPE Aruba Web GUI, MikroTik, DrayTek, FortiGate), thiết bị ngoại vi văn phòng (Máy in Port 9100, Scan SMB 445, POS, VoIP, RMM) &amp; Change Management — Gắn nhãn <span class="rm-scope-pill ext">Real-World Job Ext</span>.
          </div>
        </header>
        ${levelsHtml}
      </div>
    `;

    container.querySelectorAll("[data-rm-mod]").forEach((btn) => {
      btn.addEventListener("click", () => navigateToAcademySection("modules", Number(btn.dataset.rmMod)));
    });
    container.querySelectorAll("[data-rm-mastery]").forEach((btn) => {
      btn.addEventListener("click", () => navigateToAcademySection("projects", Number(btn.dataset.rmMastery)));
    });
    container.querySelectorAll("[data-rm-lab]").forEach((btn) => {
      btn.addEventListener("click", () => navigateToAcademySection("labs", Number(btn.dataset.rmLab)));
    });

    buildRightTableOfContents();
  }

  // Page 7: TROUBLESHOOTING CENTER (Structured Diagnostic Playbooks & Fault Scenarios)
  function renderTroubleshootingCenterPage() {
    const container = document.getElementById("module-detail");
    if (!container) return;

    const enrichMap = window.MODULE_STANDARD_10_ENRICHMENT || {};
    let allScenariosHtml = "";

    Object.keys(enrichMap).forEach((modId) => {
      const item = enrichMap[modId];
      const mod = (typeof modulesData !== "undefined" && modulesData.find((m) => m.id === Number(modId))) || null;
      const modName = mod ? `Học phần ${mod.id}: ${mod.title_vi || mod.title}` : `Học phần ${modId}`;

      const tsCards = (item.troubleshooting_vi || [])
        .map(
          (t) => `
          <div class="std-ts-card">
            <div class="std-ts-issue">🚨 <strong>${formatRichText(t.issue)}</strong></div>
            <div class="std-ts-cause">🔍 <strong>Nguyên nhân gốc rễ:</strong> ${formatRichText(t.cause)}</div>
            <div class="std-ts-fix">🛠️ <strong>Quy trình khắc phục:</strong> ${formatRichText(t.fix)}</div>
          </div>
        `
        )
        .join("");

      allScenariosHtml += `
        <section class="section-block" id="ts-center-mod-${modId}">
          <div class="section-header-wrap">
            <h3 class="section-title" id="heading-ts-mod-${modId}"><span>🛠️ ${escapeHtml(modName)}</span></h3>
            <div class="section-meta-actions">
              <button type="button" class="copy-btn" data-ts-jump-mod="${modId}">Mở bài học &rarr;</button>
            </div>
          </div>
          <div class="section-content-body">
            <div class="std-ts-grid">${tsCards}</div>
          </div>
        </section>
      `;
    });

    container.innerHTML = `
      <div class="troubleshooting-center-view">
        <header class="module-header">
          <div class="module-kicker">ENTERPRISE NETWORK TROUBLESHOOTING PLAYBOOK</div>
          <h2 class="module-heading">Trung Tâm Chẩn Đoán &amp; Xử Lý Sự Cố Mạng Doanh Nghiệp (Tầng 1 &rarr; Tầng 7)</h2>
          <div class="module-heading-sub">
            Tổng hợp toàn bộ kịch bản bắt bệnh thực tế từ lỗi cáp vật lý, Duplex mismatch, VLAN/Trunking, Native VLAN mismatch, STP Loop, Port Security err-disabled, DHCP APIPA, Static/OSPF Routing đến ACL và NAT.
          </div>
          <div class="lesson-study-actions" style="margin-top:0.9rem;">
            <button type="button" class="lesson-ai-trigger-btn" id="ts-open-ai-vision-btn">
              🤖 Gửi ảnh chụp Packet Tracer cho AI Soi lỗi ngay
            </button>
            <button type="button" class="lesson-note-trigger-btn" id="ts-open-cli-cs-btn">
              💻 Mở Sổ tay 120+ Lệnh show &amp; debug
            </button>
          </div>
        </header>
        ${allScenariosHtml}
      </div>
    `;

    document.getElementById("ts-open-ai-vision-btn")?.addEventListener("click", () => {
      if (typeof window.openAiTutorModal === "function") window.openAiTutorModal();
    });
    document.getElementById("ts-open-cli-cs-btn")?.addEventListener("click", () => {
      if (typeof window.openCheatSheet === "function") window.openCheatSheet("commands");
    });
    container.querySelectorAll("[data-ts-jump-mod]").forEach((btn) => {
      btn.addEventListener("click", () => navigateToAcademySection("modules", Number(btn.dataset.tsJumpMod)));
    });

    buildRightTableOfContents();
  }

  // Page 8: NETWORK GLOSSARY & CLI DICTIONARY
  function renderGlossaryPage() {
    const container = document.getElementById("module-detail");
    if (!container) return;

    const glossaryObj = typeof MODULE_DEEP_GLOSSARY !== "undefined" ? MODULE_DEEP_GLOSSARY : {};
    let totalTerms = 0;
    let sectionsHtml = "";

    Object.keys(glossaryObj).forEach((modId) => {
      const list = glossaryObj[modId] || [];
      totalTerms += list.length;
      const mod = (typeof modulesData !== "undefined" && modulesData.find((m) => m.id === Number(modId))) || null;
      const modTitle = mod ? `Học phần ${mod.id}: ${mod.title_vi || mod.title}` : `Học phần ${modId}`;

      const cards = list
        .map(
          (g) => `
          <div class="glossary-card" data-gl-term="${escapeHtml((g.term + " " + g.simple_vi).toLowerCase())}">
            <div class="glossary-term">
              <span class="pt-badge">M${modId}</span>
              <span>${escapeHtml(g.term)}</span>
            </div>
            <div class="glossary-simple"><strong>Định nghĩa:</strong> ${formatRichText(g.simple_vi)}</div>
            <div class="glossary-detail"><strong>Bản chất kỹ thuật:</strong> ${formatRichText(g.detail_vi)}</div>
            <div class="glossary-example"><strong>Ứng dụng thực tế &amp; Thi CCNA:</strong> ${formatRichText(g.example_vi)}</div>
          </div>
        `
        )
        .join("");

      sectionsHtml += `
        <section class="section-block gl-mod-section" id="gl-sec-${modId}">
          <div class="section-header-wrap">
            <h3 class="section-title" id="heading-gl-${modId}"><span>📖 ${escapeHtml(modTitle)} (${list.length} thuật ngữ)</span></h3>
          </div>
          <div class="section-content-body">
            <div class="glossary-grid">${cards}</div>
          </div>
        </section>
      `;
    });

    container.innerHTML = `
      <div class="academy-glossary-view">
        <header class="module-header">
          <div class="module-kicker">ENCYCLOPEDIA &amp; CISCO CLI REFERENCE</div>
          <h2 class="module-heading">Bách Khoa Toàn Thư Thuật Ngữ Mạng (${totalTerms}+ Thuật Ngữ Chuyên Sâu)</h2>
          <div class="module-heading-sub">
            Tra cứu tức thì định nghĩa, cơ chế hoạt động và ví dụ thực tế của toàn bộ thuật ngữ CCNA 200-301.
          </div>
          <div class="ws-filter-bar" style="margin-top:1rem;">
            <input type="search" id="gl-page-search-input" class="ws-search-input" placeholder="🔍 Nhập thuật ngữ cần tra cứu (VD: VLAN, OSPF, Encapsulation, SLAAC, PortFast, NAT, CAPWAP)..." />
            <button type="button" class="ws-btn primary" id="gl-open-cli-modal-btn">💻 Mở Bảng Tra Cứu 120+ Lệnh CLI &amp; Bảng Công Thức</button>
          </div>
        </header>
        ${sectionsHtml}
      </div>
    `;

    const searchEl = document.getElementById("gl-page-search-input");
    if (searchEl) {
      searchEl.addEventListener("input", (e) => {
        const q = e.target.value.trim().toLowerCase();
        container.querySelectorAll(".glossary-card").forEach((card) => {
          const match = !q || (card.dataset.glTerm || "").includes(q);
          card.style.display = match ? "" : "none";
        });
      });
    }

    document.getElementById("gl-open-cli-modal-btn")?.addEventListener("click", () => {
      if (typeof window.openCheatSheet === "function") window.openCheatSheet("commands");
    });

    buildRightTableOfContents();
  }

  // Page 9: PRACTICE & QUIZ CENTER (Mock Exam, Flashcards, Subnetting & Binary Calculators)
  function renderPracticeAndQuizPage() {
    const container = document.getElementById("module-detail");
    if (!container) return;

    container.innerHTML = `
      <div class="academy-practice-view">
        <header class="module-header">
          <div class="module-kicker">CCNA 200-301 EXAM PREPARATION &amp; INTERACTIVE LAB TOOLS</div>
          <h2 class="module-heading">Trung Tâm Luyện Tập Trắc Nghiệm, Phòng Thi Thử Pearson VUE &amp; Công Cụ Chia Subnet</h2>
          <div class="module-heading-sub">
            Kiểm tra năng lực theo chuẩn đề thi quốc tế Cisco CCNA 200-301, rèn luyện phản xạ tính nhẩm chia mạng con VLSM và ôn tập qua hệ thống hơn 400 thẻ Flashcards.
          </div>
        </header>

        <div class="dash-dual-grid">
          <div class="dash-action-card">
            <span class="pt-badge">🏆 PEARSON VUE SIMULATOR</span>
            <h3 class="dash-card-title">Phòng Thi Thử Quốc Tế CCNA 200-301 (Có Bấm Giờ)</h3>
            <p class="dash-card-desc">Mô phỏng môi trường thi thật với đồng hồ đếm ngược 40 phút, gắn cờ câu hỏi, phân tích tỷ lệ điểm theo 6 Domains và giải thích chi tiết từng đáp án.</p>
            <div class="dash-card-btns">
              <button type="button" class="ws-btn primary" id="prac-start-exam-30-btn">🚀 Bắt đầu đề thi 30 Câu (40 phút)</button>
            </div>
          </div>

          <div class="dash-action-card">
            <span class="pt-badge">🗂️ ACTIVE RECALL &amp; SPACED REPETITION</span>
            <h3 class="dash-card-title">Thẻ Ghi Nhớ Network Flashcards (400+ Thẻ)</h3>
            <p class="dash-card-desc">Ôn tập nhanh các câu lệnh Cisco IOS CLI, câu hỏi bẫy đề thi, thuật ngữ cốt lõi và các thẻ Flashcard do chính bạn tự tạo từ Highlight.</p>
            <div class="dash-card-btns">
              <button type="button" class="ws-btn primary" id="prac-open-fc-deck-btn">🗂️ Mở Bộ Thẻ Ôn Tập Toàn Khóa</button>
              <button type="button" class="ws-btn" id="prac-open-custom-fc-btn">+ Tạo Thẻ Flashcard Cá Nhân</button>
            </div>
          </div>
        </div>

        ${typeof buildInteractiveCalculator === "function" ? buildInteractiveCalculator(11) : ""}
        ${typeof buildInteractiveCalculator === "function" ? buildInteractiveCalculator(5) : ""}
      </div>
    `;

    if (typeof attachCalculatorEvents === "function") {
      attachCalculatorEvents(11);
      attachCalculatorEvents(5);
    }

    document.getElementById("prac-start-exam-30-btn")?.addEventListener("click", () => {
      if (typeof window.openMockExam === "function") window.openMockExam(30);
    });
    document.getElementById("prac-open-fc-deck-btn")?.addEventListener("click", () => {
      if (typeof openFlashcardsModal === "function") openFlashcardsModal("all");
    });
    document.getElementById("prac-open-custom-fc-btn")?.addEventListener("click", () => {
      if (window.CCNA_WORKSPACE) window.CCNA_WORKSPACE.openFlashcardCreatorFromText("", "", "module-1");
    });

    buildRightTableOfContents();
  }

  // Page 11: SETTINGS & MULTI-USER WORKSPACE SWITCHER
  function renderSettingsPage() {
    const container = document.getElementById("module-detail");
    if (!container) return;

    const currentUid = sessionStorage.getItem("ccna_active_username") || localStorage.getItem("ccna_active_username") || "admin";

    container.innerHTML = `
      <div class="academy-settings-view">
        <header class="module-header">
          <div class="module-kicker">PLATFORM CONFIGURATION &amp; DATA MANAGEMENT</div>
          <h2 class="module-heading">Cài Đặt Hệ Thống, Giao Diện, Ngôn Ngữ &amp; Cô Lập Dữ Liệu Người Dùng</h2>
          <div class="module-heading-sub">
            Tùy chỉnh chế độ hiển thị (Light / Sepia / Dark), kích thước phông chữ, ngôn ngữ học tập (Tiếng Việt / English / Song ngữ), chuyển đổi hồ sơ người dùng (Multi-User Isolation) và sao lưu dữ liệu.
          </div>
        </header>

        <section class="section-block" id="set-sec-display">
          <div class="section-header-wrap"><h3 class="section-title" id="heading-set-display"><span>🎨 1. Giao diện &amp; Trải nghiệm Đọc (Theme, Font Size &amp; Language)</span></h3></div>
          <div class="section-content-body">
            <div class="ws-filter-bar">
              <button type="button" class="ws-btn" data-set-theme="light">☀️ Giao diện Sáng (Daylight)</button>
              <button type="button" class="ws-btn" data-set-theme="sepia">📜 Giao diện Dịu mắt (Warm Sepia)</button>
              <button type="button" class="ws-btn" data-set-theme="dark">🌙 Giao diện Tối (Dark Slate)</button>
              <button type="button" class="ws-btn" data-set-lang="vi">🇻🇳 Tiếng Việt</button>
              <button type="button" class="ws-btn" data-set-lang="en">🇬🇧 English</button>
              <button type="button" class="ws-btn" data-set-lang="both">🇻🇳+🇬🇧 Song ngữ (VI + EN)</button>
            </div>
          </div>
        </section>

        <section class="section-block" id="set-sec-user">
          <div class="section-header-wrap"><h3 class="section-title" id="heading-set-user"><span>👤 2. Hồ sơ Học viên &amp; Cô lập dữ liệu (Multi-User Data Isolation)</span></h3></div>
          <div class="section-content-body">
            <p class="overview-text">Mỗi tài khoản học viên có một không gian lưu trữ Ghi chú, Highlight, Bookmark và Flashcard hoàn toàn độc lập. Hai người dùng khác nhau trên cùng thiết bị sẽ không thể truy cập hoặc nhìn thấy ghi chú của nhau.</p>
            <div class="ws-filter-bar" style="margin-top:0.8rem;">
              <span><strong>Hồ sơ đang kích hoạt:</strong> <code class="inline-code">${escapeHtml(currentUid)}</code></span>
              <input type="text" id="set-switch-user-input" class="ws-search-input" placeholder="Nhập tên hồ sơ học viên khác (VD: student_01, engineer_b)..." />
              <button type="button" class="ws-btn primary" id="set-switch-user-btn">🔄 Chuyển đổi Hồ sơ Học viên</button>
            </div>
          </div>
        </section>

        <section class="section-block" id="set-sec-backup">
          <div class="section-header-wrap"><h3 class="section-title" id="heading-set-backup"><span>💾 3. Sao lưu, Khôi phục &amp; Cấu hình Trợ lý AI Gemini</span></h3></div>
          <div class="section-content-body">
            <div class="ws-filter-bar">
              <button type="button" class="ws-btn primary" id="set-export-json-btn">💾 Tải file Sao lưu Toàn bộ (.json)</button>
              <button type="button" class="ws-btn" id="set-open-sync-panel-btn">☁️ Mở Cấu hình Đồng bộ Đám mây</button>
              <button type="button" class="ws-btn" id="set-open-ai-config-btn">🤖 Cài đặt Google Gemini API Key</button>
            </div>
          </div>
        </section>
      </div>
    `;

    container.querySelectorAll("[data-set-theme]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (typeof applyTheme === "function") applyTheme(btn.dataset.setTheme);
      });
    });
    container.querySelectorAll("[data-set-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentLang = btn.dataset.setLang;
        const langSelect = document.getElementById("lang-select");
        if (langSelect) langSelect.value = currentLang;
        renderSettingsPage();
      });
    });

    document.getElementById("set-switch-user-btn")?.addEventListener("click", () => {
      const newUid = document.getElementById("set-switch-user-input")?.value.trim();
      if (!newUid) return;
      sessionStorage.setItem("ccna_active_username", newUid);
      localStorage.setItem("ccna_active_username", newUid);
      if (window.CCNA_WORKSPACE) {
        window.CCNA_WORKSPACE.loadWorkspaceForCurrentUser();
      }
      if (typeof loadCompletedItemsForActiveUser === "function") {
        loadCompletedItemsForActiveUser();
      }
      if (typeof initSyncKey === "function") {
        initSyncKey();
      }
      loadRecentlyStudiedForCurrentUser();
      if (typeof updateProgressSummary === "function") updateProgressSummary();
      if (typeof filterAndRenderSidebar === "function") filterAndRenderSidebar();
      if (typeof updateNotesCountBadges === "function") updateNotesCountBadges();
      if (window.AI_NETWORK_TUTOR && typeof window.AI_NETWORK_TUTOR.loadUserConversations === "function") {
        window.AI_NETWORK_TUTOR.loadUserConversations();
      }
      renderSettingsPage();
    });

    document.getElementById("set-export-json-btn")?.addEventListener("click", () => {
      if (typeof exportNotesJson === "function") exportNotesJson();
    });
    document.getElementById("set-open-sync-panel-btn")?.addEventListener("click", () => {
      if (typeof openNotesModal === "function") openNotesModal("sync");
    });
    document.getElementById("set-open-ai-config-btn")?.addEventListener("click", () => {
      const settingsModal = document.getElementById("ai-settings-modal");
      if (settingsModal) settingsModal.hidden = false;
      else if (typeof window.openAiTutorModal === "function") window.openAiTutorModal();
    });

    buildRightTableOfContents();
  }

  // --------------------------------------------------------------------------
  // 5. UNIFIED 11-SECTION NAVIGATION ROUTER
  // --------------------------------------------------------------------------
  function navigateToAcademySection(sectionName, targetId = null) {
    window.currentAcademySection = sectionName;

    // Update active state on 11 primary nav buttons
    document.querySelectorAll("#academy-primary-nav .acad-nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.nav === sectionName);
    });

    const breadcrumb = document.getElementById("topbar-breadcrumb");

    if (sectionName === "dashboard") {
      if (breadcrumb) breadcrumb.textContent = "1. Dashboard Tổng quan";
      updateRouteHash("dashboard");
      renderDashboardPage();
    } else if (sectionName === "roadmap") {
      if (breadcrumb) breadcrumb.textContent = "2. Learning Roadmap (8 Levels)";
      updateRouteHash("roadmap");
      renderRoadmapPage();
    } else if (sectionName === "fundamentals") {
      currentMode = "modules";
      if (tabModulesBtn) tabModulesBtn.classList.add("active");
      if (tabLabsBtn) tabLabsBtn.classList.remove("active");
      if (tabMasteryBtn) tabMasteryBtn.classList.remove("active");
      // Filter sidebar to Level 1 & Level 3 foundational modules (1, 2, 3, 4, 5, 6)
      const fundMods = (modulesData || []).filter((m) => [1, 2, 3, 4, 5, 6].includes(m.id));
      renderSidebar(fundMods);
      selectModule(targetId || 1);
      if (breadcrumb) breadcrumb.textContent = "3. Networking Fundamentals";
      updateRouteHash("fundamentals", targetId || 1);
    } else if (sectionName === "modules") {
      currentMode = "modules";
      if (tabModulesBtn) tabModulesBtn.classList.add("active");
      if (tabLabsBtn) tabLabsBtn.classList.remove("active");
      if (tabMasteryBtn) tabMasteryBtn.classList.remove("active");
      filterAndRenderSidebar();
      selectModule(targetId || activeModuleId || 1);
      updateRouteHash("modules", targetId || activeModuleId || 1);
    } else if (sectionName === "labs") {
      currentMode = "labs";
      if (tabModulesBtn) tabModulesBtn.classList.remove("active");
      if (tabLabsBtn) tabLabsBtn.classList.add("active");
      if (tabMasteryBtn) tabMasteryBtn.classList.remove("active");
      activeLabId = targetId !== null ? targetId : 0;
      filterAndRenderSidebar();
      renderLabsView(activeLabId);
      updateRouteHash("labs", activeLabId);
    } else if (sectionName === "projects") {
      currentMode = "mastery";
      if (tabModulesBtn) tabModulesBtn.classList.remove("active");
      if (tabLabsBtn) tabLabsBtn.classList.remove("active");
      if (tabMasteryBtn) tabMasteryBtn.classList.add("active");
      activeMasteryId = targetId !== null ? targetId : 0;
      filterAndRenderSidebar();
      renderMasteryView(activeMasteryId);
      updateRouteHash("projects", activeMasteryId);
      buildRightTableOfContents();
    } else if (sectionName === "troubleshooting") {
      if (breadcrumb) breadcrumb.textContent = "7. Troubleshooting Playbook";
      updateRouteHash("troubleshooting");
      renderTroubleshootingCenterPage();
    } else if (sectionName === "glossary") {
      if (breadcrumb) breadcrumb.textContent = "8. Network Glossary & CLI";
      updateRouteHash("glossary");
      renderGlossaryPage();
    } else if (sectionName === "practice") {
      if (breadcrumb) breadcrumb.textContent = "9. Practice, Calculators & Mock Exam";
      updateRouteHash("practice");
      renderPracticeAndQuizPage();
    } else if (sectionName === "workspace") {
      if (breadcrumb) breadcrumb.textContent = "10. My Notes, Highlights & Flashcards";
      updateRouteHash("workspace");
      if (window.CCNA_WORKSPACE) {
        window.CCNA_WORKSPACE.renderMyNotesCentralPage();
      }
      buildRightTableOfContents();
    } else if (sectionName === "settings") {
      if (breadcrumb) breadcrumb.textContent = "11. Settings & User Profile";
      updateRouteHash("settings");
      renderSettingsPage();
    }

    if (typeof closeMobileSidebar === "function") closeMobileSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  window.navigateToAcademySection = navigateToAcademySection;

  // Bind login form to capture username for multi-user workspace isolation
  function hookAuthForMultiUserWorkspace() {
    const loginForm = document.getElementById("login-form");
    const loginUser = document.getElementById("login-username");
    if (loginForm && loginUser) {
      loginForm.addEventListener("submit", () => {
        const u = loginUser.value.trim();
        if (u) {
          sessionStorage.setItem("ccna_active_username", u);
          localStorage.setItem("ccna_active_username", u);
          setTimeout(() => {
            if (window.CCNA_WORKSPACE) window.CCNA_WORKSPACE.loadWorkspaceForCurrentUser();
          }, 100);
        }
      });
    }
  }

  // Initialize Academy UI after DOM & App load
  document.addEventListener("DOMContentLoaded", () => {
    hookAuthForMultiUserWorkspace();

    if (window.CCNA_WORKSPACE) {
      window.CCNA_WORKSPACE.loadWorkspaceForCurrentUser();
      window.CCNA_WORKSPACE.upgradeSelectionToolbar();
    }

    // Bind 11 Primary Nav buttons
    document.querySelectorAll("#academy-primary-nav .acad-nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        navigateToAcademySection(btn.dataset.nav);
      });
    });

    // Bind Compact Menu Expand/Collapse Toggle in Left Sidebar
    const menuMoreBtn = document.getElementById("sidebar-menu-more-btn");
    const primaryNavEl = document.getElementById("academy-primary-nav");
    if (menuMoreBtn && primaryNavEl) {
      menuMoreBtn.addEventListener("click", () => {
        const isCompact = primaryNavEl.classList.toggle("is-compact");
        menuMoreBtn.setAttribute("aria-expanded", String(!isCompact));
        menuMoreBtn.classList.toggle("active", !isCompact);
      });
    }

    // Keep 3 mode-tabs synchronized with 11-item primary nav
    document.getElementById("tab-modules-btn")?.addEventListener("click", () => {
      document.querySelectorAll("#academy-primary-nav .acad-nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.nav === "modules"));
    });
    document.getElementById("tab-labs-btn")?.addEventListener("click", () => {
      document.querySelectorAll("#academy-primary-nav .acad-nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.nav === "labs"));
    });
    document.getElementById("tab-mastery-btn")?.addEventListener("click", () => {
      document.querySelectorAll("#academy-primary-nav .acad-nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.nav === "projects"));
    });

    // Brand Home Link opens Dashboard
    const homeLink = document.getElementById("brand-home-link");
    if (homeLink) {
      homeLink.addEventListener("click", (e) => {
        e.preventDefault();
        navigateToAcademySection("dashboard");
      });
    }

    // Initial Route Restore, TOC & Workspace restore after initial module renders
    setTimeout(() => {
      restoreRouteFromUrlHash();
      if (window.CCNA_WORKSPACE) {
        const key = typeof getCurrentLessonNoteKey === "function"
          ? getCurrentLessonNoteKey()
          : `module-${typeof activeModuleId !== "undefined" ? activeModuleId : 1}`;
        window.CCNA_WORKSPACE.restoreHighlightsForLesson(key);
        window.CCNA_WORKSPACE.renderFloatingQuickNotesList();
      }
      buildRightTableOfContents();
    }, 350);

    window.addEventListener("hashchange", () => {
      restoreRouteFromUrlHash();
    });
  });
})();
