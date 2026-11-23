// ============================================================================
// CCNA NETWORK ACADEMY — PERSONAL LEARNING WORKSPACE (PART 9 SPECIFICATION)
// Hệ thống Học tập Cá nhân hóa Chuyên sâu (Kết hợp Notion + Hypothes.is + Readwise + Anki)
// Bao gồm:
// A. Text Highlighting System (4 màu: Yellow, Green, Blue, Pink + W3C TextQuoteSelector)
// B. Contextual Note System (Ghi chú gắn với đoạn văn hoặc độc lập, Pin, Search, Jump)
// C. My Notes — Centralized Note & Highlight Management + Markdown/Print Export
// D. Quick Note & Floating Note Panel (Trạng thái Saving / Saved / Error, Offline Queue)
// E. Network Knowledge Flashcards (Tạo từ Highlight/Note, Sửa/Xóa, Spaced Repetition)
// F. Multi-User Data Isolation (Cô lập dữ liệu hoàn toàn theo tài khoản đăng nhập)
// ============================================================================

(function () {
  "use strict";

  const HIGHLIGHT_COLORS = {
    yellow: {
      id: "yellow",
      label_vi: "Khái niệm quan trọng (Important)",
      label_en: "Important concepts",
      short_vi: "Quan trọng",
      hex: "#fef08a",
      border: "#eab308"
    },
    green: {
      id: "green",
      label_vi: "Đã hiểu / Trọng tâm (Understood / Key)",
      label_en: "Understood / Key knowledge",
      short_vi: "Đã hiểu",
      hex: "#bbf7d0",
      border: "#16a34a"
    },
    blue: {
      id: "blue",
      label_vi: "Định nghĩa kỹ thuật (Technical definition)",
      label_en: "Technical definitions",
      short_vi: "Định nghĩa",
      hex: "#bae6fd",
      border: "#0284c7"
    },
    pink: {
      id: "pink",
      label_vi: "Cần ôn tập lại (Need to review)",
      label_en: "Need to review",
      short_vi: "Cần ôn lại",
      hex: "#fbcfe8",
      border: "#db2777"
    }
  };

  // Current user workspace state
  let currentUserId = "default_user";
  let workspaceDB = {
    version: 2,
    userId: "default_user",
    highlights: [], // Array of TextHighlight entities
    notes: [],      // Array of UserNote entities
    bookmarks: [],  // Array of LessonBookmark entities
    flashcards: [], // Array of custom Flashcard entities
    updatedAt: 0
  };

  let lastUndoAction = null; // { type, restoreFn, description }
  let activeHighlightId = null;

  // --------------------------------------------------------------------------
  // 1. MULTI-USER ISOLATION & STORAGE SCHEMA (PART 9.G)
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

  function getWorkspaceStorageKey(uid) {
    return `ccna_workspace_v2_${uid || getActiveUserId()}`;
  }

  function loadWorkspaceForCurrentUser() {
    currentUserId = getActiveUserId();
    const storageKey = getWorkspaceStorageKey(currentUserId);
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        workspaceDB = {
          version: 2,
          userId: currentUserId,
          highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
          notes: Array.isArray(parsed.notes) ? parsed.notes : [],
          bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [],
          flashcards: Array.isArray(parsed.flashcards) ? parsed.flashcards : [],
          updatedAt: parsed.updatedAt || Date.now()
        };
      } else {
        workspaceDB = {
          version: 2,
          userId: currentUserId,
          highlights: [],
          notes: [],
          bookmarks: [],
          flashcards: [],
          updatedAt: Date.now()
        };
        // Migrate legacy single-user notes & highlights if this is the main authenticated user
        migrateLegacyNotesAndHighlights();
      }
    } catch (e) {
      console.warn("Workspace load warning:", e);
    }
    syncWorkspaceBackToLegacyGlobals();
    return workspaceDB;
  }

  function migrateLegacyNotesAndHighlights() {
    let migrated = false;
    try {
      // 1. Migrate legacy studyHighlights object { "module-1": [{ id, text, color, createdAt }] }
      if (typeof studyHighlights === "object" && studyHighlights !== null) {
        Object.keys(studyHighlights).forEach((lessonKey) => {
          const arr = studyHighlights[lessonKey];
          if (Array.isArray(arr)) {
            arr.forEach((oldHl) => {
              if (oldHl && oldHl.text) {
                const exists = workspaceDB.highlights.some((h) => h.id === oldHl.id || (h.lessonKey === lessonKey && h.exactText === oldHl.text));
                if (!exists) {
                  workspaceDB.highlights.push({
                    id: oldHl.id || ("hl_" + Math.random().toString(36).substring(2, 10)),
                    userId: currentUserId,
                    lessonKey: lessonKey,
                    moduleId: extractModuleIdFromKey(lessonKey),
                    lessonTitle: resolveLessonTitleFromKey(lessonKey),
                    color: HIGHLIGHT_COLORS[oldHl.color] ? oldHl.color : "yellow",
                    exactText: oldHl.text,
                    prefix: oldHl.prefix || "",
                    suffix: oldHl.suffix || "",
                    blockId: oldHl.blockId || "",
                    startOffset: oldHl.startOffset || 0,
                    noteId: oldHl.noteId || null,
                    createdAt: oldHl.createdAt || Date.now(),
                    updatedAt: oldHl.updatedAt || oldHl.createdAt || Date.now()
                  });
                  migrated = true;
                }
              }
            });
          }
        });
      }

      // 2. Migrate legacy studyNotes object { "module-1": { key, title, content, tag, updatedAt } }
      if (typeof studyNotes === "object" && studyNotes !== null) {
        Object.keys(studyNotes).forEach((lessonKey) => {
          const oldNote = studyNotes[lessonKey];
          if (oldNote && (oldNote.content || oldNote.title)) {
            const exists = workspaceDB.notes.some((n) => n.id === oldNote.id || (n.lessonKey === lessonKey && n.content === oldNote.content));
            if (!exists) {
              workspaceDB.notes.push({
                id: oldNote.id || ("note_" + Math.random().toString(36).substring(2, 10)),
                userId: currentUserId,
                lessonKey: lessonKey,
                moduleId: oldNote.moduleId || extractModuleIdFromKey(lessonKey),
                lessonTitle: oldNote.lessonTitle || resolveLessonTitleFromKey(lessonKey),
                highlightId: null,
                quoteText: "",
                title: oldNote.title || resolveLessonTitleFromKey(lessonKey),
                content: oldNote.content || "",
                tag: oldNote.tag || "exam",
                isPinned: !!oldNote.isPinned,
                createdAt: oldNote.createdAt || oldNote.updatedAt || Date.now(),
                updatedAt: oldNote.updatedAt || Date.now()
              });
              migrated = true;
            }
          }
        });
      }
    } catch (e) {
      console.warn("Legacy migration warning:", e);
    }

    if (migrated) {
      saveWorkspaceDB(true);
    }
  }

  function saveWorkspaceDB(silent = false) {
    workspaceDB.updatedAt = Date.now();
    const storageKey = getWorkspaceStorageKey(currentUserId);
    try {
      setFloatingSaveIndicator("saving");
      localStorage.setItem(storageKey, JSON.stringify(workspaceDB));
      syncWorkspaceBackToLegacyGlobals();
      setTimeout(() => setFloatingSaveIndicator("saved"), 220);
      if (!silent && typeof triggerAutoSync === "function") {
        triggerAutoSync();
      }
    } catch (e) {
      setFloatingSaveIndicator("error");
      showWorkspaceToast("Lỗi lưu trữ dữ liệu cục bộ: " + e.message, "error");
    }
  }

  // Keep legacy studyNotes & studyHighlights in sync so existing Cloud Sync & badges work seamlessly
  function syncWorkspaceBackToLegacyGlobals() {
    try {
      if (typeof studyHighlights !== "undefined") {
        const groupedHl = {};
        workspaceDB.highlights.forEach((h) => {
          if (!groupedHl[h.lessonKey]) groupedHl[h.lessonKey] = [];
          groupedHl[h.lessonKey].push({
            id: h.id,
            text: h.exactText,
            color: h.color,
            prefix: h.prefix,
            suffix: h.suffix,
            blockId: h.blockId,
            startOffset: h.startOffset,
            noteId: h.noteId,
            createdAt: h.createdAt,
            updatedAt: h.updatedAt
          });
        });
        studyHighlights = groupedHl;
        if (currentUserId === "default_user" || currentUserId.startsWith("user_04e7ca8d")) {
          localStorage.setItem("ccna_study_highlights", JSON.stringify(studyHighlights));
        }
      }
      if (typeof updateNotesCountBadges === "function") {
        updateNotesCountBadges();
      }
    } catch (e) {}
  }

  function extractModuleIdFromKey(key) {
    if (!key) return 1;
    const m = String(key).match(/module-(\d+)/);
    if (m) return Number(m[1]);
    const l = String(key).match(/lab-(\d+)/);
    if (l && typeof PACKET_TRACER_LABS !== "undefined") {
      const foundLab = PACKET_TRACER_LABS.find((x) => x.id === Number(l[1]));
      if (foundLab) return foundLab.moduleId;
    }
    return typeof activeModuleId !== "undefined" ? activeModuleId : 1;
  }

  function resolveLessonTitleFromKey(key) {
    if (!key) return "Bài học CCNA";
    if (key.startsWith("module-")) {
      const id = Number(key.replace("module-", ""));
      const mod = typeof modulesData !== "undefined" ? modulesData.find((m) => m.id === id) : null;
      return mod ? `Học phần ${mod.id}: ${mod.title_vi || mod.title}` : `Học phần ${id}`;
    }
    if (key.startsWith("lab-")) {
      const id = Number(key.replace("lab-", ""));
      const lab = typeof PACKET_TRACER_LABS !== "undefined" ? PACKET_TRACER_LABS.find((l) => l.id === id) : null;
      return lab ? `${lab.title_vi}` : `Bài Lab ${id}`;
    }
    if (key.startsWith("mastery-")) {
      const id = Number(key.replace("mastery-", ""));
      const m = typeof CCNA_EXAM_MASTERY !== "undefined" ? CCNA_EXAM_MASTERY.find((x) => x.id === id) : null;
      return m ? `${m.title_vi}` : `Chuyên đề ${id}`;
    }
    return key;
  }

  // --------------------------------------------------------------------------
  // 2. ROBUST ANNOTATION ANCHORING ENGINE (W3C TextQuoteSelector + Block Offset)
  // --------------------------------------------------------------------------
  function isSelectionInsideForbiddenZone(node) {
    if (!node) return true;
    const el = node.nodeType === 3 ? node.parentElement : node;
    if (!el) return true;
    // Must be inside #module-detail reading content
    if (!el.closest("#module-detail")) return true;
    // Forbidden zones per Part 9.A.5: CLI commands, code blocks, inputs, buttons, nav, calculators, SVGs
    if (
      el.closest("pre") ||
      el.closest(".cli-block") ||
      el.closest(".ai-cli-terminal") ||
      el.closest("svg") ||
      el.closest("button") ||
      el.closest("input") ||
      el.closest("textarea") ||
      el.closest("select") ||
      el.closest(".lesson-study-actions") ||
      el.closest(".quick-jump-bar") ||
      el.closest(".lesson-control-bar") ||
      el.closest(".calc-grid") ||
      el.closest(".module-footer-nav") ||
      el.closest(".workspace-view-container")
    ) {
      return true;
    }
    return false;
  }

  function findClosestAnnotatableBlock(node) {
    const el = node.nodeType === 3 ? node.parentElement : node;
    if (!el) return document.getElementById("module-detail");
    return (
      el.closest("p, li, td, .glossary-card, .mastery-section-box, .example-line, .analogy-text, .pt-lab-objective, .pt-verify-box, .section-block") ||
      document.getElementById("module-detail")
    );
  }

  function computeBlockIdentifier(blockEl) {
    const root = document.getElementById("module-detail");
    if (!root || !blockEl || blockEl === root) return "root";
    if (blockEl.id) return `#${blockEl.id}`;
    const secBlock = blockEl.closest(".section-block");
    const secId = secBlock && secBlock.id ? secBlock.id : "sec";
    const tag = blockEl.tagName.toLowerCase();
    const allSameTag = Array.from((secBlock || root).querySelectorAll(tag));
    const idx = allSameTag.indexOf(blockEl);
    return `${secId}::${tag}[${idx}]`;
  }

  function captureTextQuoteSelector(range) {
    const exactText = range.toString().trim();
    const blockEl = findClosestAnnotatableBlock(range.commonAncestorContainer);
    const blockId = computeBlockIdentifier(blockEl);
    const fullBlockText = blockEl ? blockEl.textContent : "";

    // Calculate approximate character offset & prefix/suffix (32 chars each) inside block
    let startOffset = 0;
    try {
      const preRange = document.createRange();
      preRange.selectNodeContents(blockEl);
      preRange.setEnd(range.startContainer, range.startOffset);
      startOffset = preRange.toString().length;
    } catch {
      startOffset = Math.max(0, fullBlockText.indexOf(exactText));
    }

    const prefixStart = Math.max(0, startOffset - 32);
    const prefix = fullBlockText.substring(prefixStart, startOffset);
    const suffix = fullBlockText.substring(startOffset + exactText.length, startOffset + exactText.length + 32);

    return {
      exactText,
      prefix,
      suffix,
      blockId,
      startOffset
    };
  }

  // Safely highlight a DOM Range across multiple text nodes without breaking HTML tags
  function wrapRangeInHighlightMarks(range, hlObj) {
    if (!range || range.collapsed) return [];
    const root = range.commonAncestorContainer;
    const textNodes = [];

    if (root.nodeType === 3) {
      if (!isSelectionInsideForbiddenZone(root)) {
        textNodes.push({
          node: root,
          start: range.startOffset,
          end: range.endOffset
        });
      }
    } else {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
          if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          if (isSelectionInsideForbiddenZone(n)) return NodeFilter.FILTER_REJECT;
          if (!range.intersectsNode(n)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      let n;
      while ((n = walker.nextNode())) {
        const start = n === range.startContainer ? range.startOffset : 0;
        const end = n === range.endContainer ? range.endOffset : n.nodeValue.length;
        if (end > start) {
          textNodes.push({ node: n, start, end });
        }
      }
    }

    const createdMarks = [];
    textNodes.forEach(({ node, start, end }) => {
      const text = node.nodeValue;
      const before = text.substring(0, start);
      const mid = text.substring(start, end);
      const after = text.substring(end);
      if (!mid) return;

      // Avoid double-wrapping identical mark
      if (node.parentElement && node.parentElement.tagName === "MARK" && node.parentElement.dataset.hlId === hlObj.id) {
        return;
      }

      const mark = document.createElement("mark");
      mark.className = `ccna-hl-${hlObj.color}${hlObj.noteId ? " has-attached-note" : ""}`;
      mark.dataset.hlId = hlObj.id;
      mark.dataset.color = hlObj.color;
      mark.textContent = mid;
      mark.tabIndex = 0;

      attachHighlightClickInteraction(mark, hlObj.id);

      const frag = document.createDocumentFragment();
      if (before) frag.appendChild(document.createTextNode(before));
      frag.appendChild(mark);
      if (after) frag.appendChild(document.createTextNode(after));

      if (node.parentNode) {
        node.parentNode.replaceChild(frag, node);
        createdMarks.push(mark);
      }
    });

    return createdMarks;
  }

  // Restore all saved highlights for a lesson using W3C TextQuoteSelector + Prefix/Suffix fallback
  function restoreHighlightsForLesson(lessonKey) {
    const container = document.getElementById("module-detail");
    if (!container || !lessonKey) return;

    // First remove existing highlight marks to avoid duplicates on re-render
    container.querySelectorAll("mark[data-hl-id]").forEach((m) => {
      const parent = m.parentNode;
      if (parent) {
        m.replaceWith(...m.childNodes);
        parent.normalize();
      }
    });

    const lessonHighlights = workspaceDB.highlights.filter(
      (h) => h.lessonKey === lessonKey && h.userId === currentUserId
    );
    if (lessonHighlights.length === 0) return;

    lessonHighlights.forEach((hl) => {
      const searchStr = (hl.exactText || "").trim();
      if (searchStr.length < 2) return;

      // Build flattening map of text nodes inside container (excluding forbidden zones)
      const range = locateTextQuoteInContainer(container, hl);
      if (range) {
        wrapRangeInHighlightMarks(range, hl);
      }
    });
  }

  function locateTextQuoteInContainer(container, hl) {
    const exact = (hl.exactText || "").trim();
    if (!exact) return null;

    // Collect all valid text nodes and their global char offsets
    const textNodes = [];
    let fullText = "";
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue) return NodeFilter.FILTER_REJECT;
        if (isSelectionInsideForbiddenZone(n)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let node;
    while ((node = walker.nextNode())) {
      const start = fullText.length;
      fullText += node.nodeValue;
      textNodes.push({
        node,
        start,
        end: fullText.length
      });
    }

    // Find all occurrences of exactText
    const candidates = [];
    let pos = fullText.indexOf(exact);
    while (pos !== -1) {
      candidates.push(pos);
      pos = fullText.indexOf(exact, pos + 1);
    }

    // Fallback: if exact text has normalized whitespace differences after a lesson content update
    let matchStart = -1;
    let matchLen = exact.length;

    if (candidates.length === 1) {
      matchStart = candidates[0];
    } else if (candidates.length > 1) {
      // Disambiguate using prefix, suffix, and startOffset
      let bestScore = -1;
      candidates.forEach((cPos) => {
        let score = 0;
        if (hl.prefix) {
          const actualPrefix = fullText.substring(Math.max(0, cPos - hl.prefix.length), cPos);
          if (actualPrefix === hl.prefix) score += 10;
          else if (actualPrefix.endsWith(hl.prefix.slice(-10))) score += 5;
        }
        if (hl.suffix) {
          const actualSuffix = fullText.substring(cPos + exact.length, cPos + exact.length + hl.suffix.length);
          if (actualSuffix === hl.suffix) score += 10;
          else if (actualSuffix.startsWith(hl.suffix.slice(0, 10))) score += 5;
        }
        if (typeof hl.startOffset === "number") {
          const dist = Math.abs(cPos - hl.startOffset);
          score += Math.max(0, 5 - dist / 200);
        }
        if (score > bestScore) {
          bestScore = score;
          matchStart = cPos;
        }
      });
    } else {
      // Normalized whitespace fuzzy search when lesson content was slightly edited
      const escaped = exact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
      try {
        const rx = new RegExp(escaped);
        const m = rx.exec(fullText);
        if (m) {
          matchStart = m.index;
          matchLen = m[0].length;
        }
      } catch {}
    }

    if (matchStart === -1) return null;
    const matchEnd = matchStart + matchLen;

    // Map [matchStart, matchEnd] back to DOM Range
    let startNode = null;
    let startOffset = 0;
    let endNode = null;
    let endOffset = 0;

    for (let i = 0; i < textNodes.length; i++) {
      const seg = textNodes[i];
      if (!startNode && matchStart >= seg.start && matchStart < seg.end) {
        startNode = seg.node;
        startOffset = matchStart - seg.start;
      }
      if (matchEnd > seg.start && matchEnd <= seg.end) {
        endNode = seg.node;
        endOffset = matchEnd - seg.start;
        break;
      }
    }

    if (startNode && endNode) {
      try {
        const range = document.createRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        return range;
      } catch {
        return null;
      }
    }
    return null;
  }

  // --------------------------------------------------------------------------
  // 3. HIGHLIGHT CREATION, COLOR CHANGE, DELETION & POPOVER
  // --------------------------------------------------------------------------
  function createHighlightFromSelection(color = "yellow", openNoteAfter = false, openFlashcardAfter = false) {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return null;

    const range = sel.getRangeAt(0).cloneRange();
    if (isSelectionInsideForbiddenZone(range.startContainer) || isSelectionInsideForbiddenZone(range.endContainer)) {
      showWorkspaceToast("Không thể tô sáng bên trong vùng mã lệnh CLI hoặc thanh công cụ.", "warning");
      return null;
    }

    const selector = captureTextQuoteSelector(range);
    if (!selector.exactText || selector.exactText.length < 2) return null;

    const lessonKey = typeof getCurrentLessonNoteKey === "function" ? getCurrentLessonNoteKey() : `module-${activeModuleId}`;
    const lessonTitle = typeof getCurrentLessonTitle === "function" ? getCurrentLessonTitle() : resolveLessonTitleFromKey(lessonKey);
    const modId = extractModuleIdFromKey(lessonKey);

    // Check if an identical highlight already exists on this lesson
    let existingHl = workspaceDB.highlights.find(
      (h) => h.lessonKey === lessonKey && h.exactText === selector.exactText && Math.abs((h.startOffset || 0) - selector.startOffset) < 35
    );

    if (existingHl) {
      existingHl.color = color;
      existingHl.updatedAt = Date.now();
      saveWorkspaceDB();
      restoreHighlightsForLesson(lessonKey);
    } else {
      existingHl = {
        id: "hl_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36).slice(-4),
        userId: currentUserId,
        lessonKey,
        moduleId: modId,
        lessonTitle,
        color: HIGHLIGHT_COLORS[color] ? color : "yellow",
        exactText: selector.exactText,
        prefix: selector.prefix,
        suffix: selector.suffix,
        blockId: selector.blockId,
        startOffset: selector.startOffset,
        noteId: null,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      workspaceDB.highlights.push(existingHl);
      wrapRangeInHighlightMarks(range, existingHl);
      saveWorkspaceDB();
    }

    const createdId = existingHl.id;
    lastUndoAction = {
      type: "create_highlight",
      description: "Đã lưu Highlight",
      restoreFn: () => deleteHighlightById(createdId, true)
    };

    sel.removeAllRanges();
    hideSelectionToolbar();

    if (openNoteAfter) {
      openContextualNotePopover(existingHl.id);
    } else if (openFlashcardAfter) {
      openFlashcardCreatorFromText(existingHl.exactText, existingHl.id, lessonKey);
    } else {
      showWorkspaceToast(`Đã lưu Highlight (${HIGHLIGHT_COLORS[color]?.short_vi || color})`, "success", true);
    }

    return existingHl;
  }

  function changeHighlightColor(hlId, newColor) {
    const hl = workspaceDB.highlights.find((h) => h.id === hlId);
    if (!hl || !HIGHLIGHT_COLORS[newColor]) return;
    hl.color = newColor;
    hl.updatedAt = Date.now();
    saveWorkspaceDB();

    document.querySelectorAll(`mark[data-hl-id="${hlId}"]`).forEach((m) => {
      m.className = `ccna-hl-${newColor}${hl.noteId ? " has-attached-note" : ""}`;
      m.dataset.color = newColor;
    });

    showWorkspaceToast(`Đã đổi màu Highlight sang ${HIGHLIGHT_COLORS[newColor].short_vi}`, "success");
  }

  function deleteHighlightById(hlId, isUndo = false) {
    const idx = workspaceDB.highlights.findIndex((h) => h.id === hlId);
    if (idx === -1) return;
    const removed = workspaceDB.highlights[idx];
    workspaceDB.highlights.splice(idx, 1);

    // Unlink any attached contextual note (keep the note safely with its quoteText)
    workspaceDB.notes.forEach((n) => {
      if (n.highlightId === hlId) {
        n.highlightId = null;
      }
    });

    saveWorkspaceDB();

    document.querySelectorAll(`mark[data-hl-id="${hlId}"]`).forEach((m) => {
      const p = m.parentNode;
      m.replaceWith(...m.childNodes);
      if (p) p.normalize();
    });

    closeHighlightActionPopover();

    if (!isUndo) {
      lastUndoAction = {
        type: "delete_highlight",
        description: "Đã xóa Highlight",
        restoreFn: () => {
          workspaceDB.highlights.push(removed);
          saveWorkspaceDB();
          restoreHighlightsForLesson(removed.lessonKey);
        }
      };
      showWorkspaceToast("Đã xóa Highlight", "info", true);
    }
  }

  function attachHighlightClickInteraction(markEl, hlId) {
    markEl.addEventListener("click", (e) => {
      e.stopPropagation();
      openHighlightActionPopover(markEl, hlId);
    });
  }

  // --------------------------------------------------------------------------
  // 4. INTERACTIVE HIGHLIGHT POPOVER & CONTEXTUAL NOTE EDITOR (PART 9.A & 9.B)
  // --------------------------------------------------------------------------
  function ensureWorkspaceModalsDom() {
    if (document.getElementById("hl-action-popover")) return;

    const domHtml = `
      <!-- Popover when user clicks an existing Highlight in Lesson -->
      <div class="hl-action-popover" id="hl-action-popover" role="dialog" aria-label="Tùy chọn Highlight" hidden>
        <div class="hl-popover-header">
          <div class="hl-color-switcher">
            <button type="button" class="hl-swatch yellow" data-hl-color="yellow" title="Vàng: Khái niệm quan trọng"></button>
            <button type="button" class="hl-swatch green" data-hl-color="green" title="Xanh lá: Đã hiểu / Trọng tâm"></button>
            <button type="button" class="hl-swatch blue" data-hl-color="blue" title="Xanh dương: Định nghĩa kỹ thuật"></button>
            <button type="button" class="hl-swatch pink" data-hl-color="pink" title="Hồng: Cần ôn tập lại"></button>
          </div>
          <div class="hl-popover-actions">
            <button type="button" class="hl-act-btn" id="hl-pop-to-flashcard-btn" title="Tạo thẻ Flashcard từ đoạn này">🗂️ Tạo Flashcard</button>
            <button type="button" class="hl-act-btn danger" id="hl-pop-delete-btn" title="Xóa Highlight">🗑️ Xóa</button>
            <button type="button" class="hl-act-close" id="hl-pop-close-btn" title="Đóng">✕</button>
          </div>
        </div>
        <div class="hl-popover-quote" id="hl-popover-quote"></div>
        <div class="hl-popover-note-area">
          <textarea id="hl-popover-note-input" class="hl-popover-textarea" rows="3" placeholder="Thêm ghi chú cá nhân cho đoạn văn bản này..."></textarea>
          <div class="hl-popover-footer">
            <label class="hl-pin-checkbox">
              <input type="checkbox" id="hl-popover-pin-check" />
              <span>📌 Ghim ghi chú quan trọng</span>
            </label>
            <button type="button" class="hl-save-note-btn" id="hl-popover-save-note-btn">Lưu ghi chú</button>
          </div>
        </div>
      </div>

      <!-- Custom Flashcard Creator & Editor Modal (Part 9.E) -->
      <div class="fc-creator-modal" id="fc-creator-modal" role="dialog" aria-modal="true" aria-label="Tạo & Chỉnh sửa Flashcard" hidden>
        <div class="fc-creator-backdrop" id="fc-creator-backdrop"></div>
        <div class="fc-creator-card">
          <header class="fc-creator-header">
            <h3>🗂️ Tạo / Chỉnh Sửa Network Flashcard</h3>
            <button type="button" class="fc-creator-close" id="fc-creator-close-btn">✕</button>
          </header>
          <div class="fc-creator-body">
            <input type="hidden" id="fc-edit-id" value="" />
            <input type="hidden" id="fc-source-hl-id" value="" />
            <div class="fc-field">
              <label for="fc-front-input"><strong>Mặt trước (Front — Câu hỏi / Thuật ngữ / Tình huống):</strong></label>
              <textarea id="fc-front-input" class="fc-textarea" rows="3" placeholder="VD: What is a Broadcast Domain? (Hoặc: Khi nào xảy ra lỗi Native VLAN Mismatch?)"></textarea>
            </div>
            <div class="fc-field">
              <label for="fc-back-input"><strong>Mặt sau (Back — Định nghĩa / Câu lệnh CLI / Giải thích):</strong></label>
              <textarea id="fc-back-input" class="fc-textarea" rows="4" placeholder="VD: A logical network area in which broadcast frames can reach all devices within that domain."></textarea>
            </div>
            <div class="fc-field-row">
              <div class="fc-field">
                <label for="fc-module-select"><strong>Phân loại Học phần:</strong></label>
                <select id="fc-module-select" class="fc-select"></select>
              </div>
              <div class="fc-field">
                <label for="fc-mastery-select"><strong>Mức độ hiểu bài (Spaced Repetition):</strong></label>
                <select id="fc-mastery-select" class="fc-select">
                  <option value="new">🆕 Mới tạo (New)</option>
                  <option value="learning">🔄 Đang học / Cần ôn lại (Hard / Review)</option>
                  <option value="good">👍 Đã nắm cơ bản (Good)</option>
                  <option value="mastered">⭐ Đã thuộc lòng (Easy / Mastered)</option>
                </select>
              </div>
            </div>
          </div>
          <footer class="fc-creator-footer">
            <button type="button" class="ai-btn-secondary" id="fc-creator-cancel-btn">Hủy</button>
            <button type="button" class="ai-btn-primary" id="fc-creator-save-btn">Lưu Flashcard</button>
          </footer>
        </div>
      </div>

      <!-- Subtle Workspace Toast Notification with Undo -->
      <div class="workspace-toast" id="workspace-toast" role="status" aria-live="polite" hidden>
        <span class="ws-toast-text" id="ws-toast-text">Đã lưu</span>
        <button type="button" class="ws-toast-undo" id="ws-toast-undo-btn" hidden>Hoàn tác (Undo)</button>
      </div>
    `;

    const wrap = document.createElement("div");
    wrap.innerHTML = domHtml;
    document.body.appendChild(wrap);

    bindWorkspacePopoverAndModalEvents();
  }

  function openHighlightActionPopover(markEl, hlId) {
    ensureWorkspaceModalsDom();
    const popover = document.getElementById("hl-action-popover");
    const hl = workspaceDB.highlights.find((h) => h.id === hlId);
    if (!popover || !hl) return;

    activeHighlightId = hlId;

    // Highlight active color swatch
    popover.querySelectorAll(".hl-swatch").forEach((sw) => {
      sw.classList.toggle("active", sw.dataset.hlColor === hl.color);
    });

    const quoteEl = document.getElementById("hl-popover-quote");
    if (quoteEl) {
      const q = hl.exactText.length > 160 ? hl.exactText.substring(0, 160) + "..." : hl.exactText;
      quoteEl.textContent = `"${q}"`;
    }

    const linkedNote = workspaceDB.notes.find((n) => n.highlightId === hlId || (hl.noteId && n.id === hl.noteId));
    const noteInput = document.getElementById("hl-popover-note-input");
    const pinCheck = document.getElementById("hl-popover-pin-check");

    if (noteInput) noteInput.value = linkedNote ? linkedNote.content : "";
    if (pinCheck) pinCheck.checked = linkedNote ? !!linkedNote.isPinned : false;

    popover.hidden = false;

    // Position near markEl without covering the text being read
    const rect = markEl.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const popWidth = 340;
    const leftPos = Math.min(window.innerWidth - popWidth - 16, Math.max(12, rect.left + scrollX));
    const topPos = rect.bottom + scrollY + 10;

    popover.style.left = `${leftPos}px`;
    popover.style.top = `${topPos}px`;
  }

  function openContextualNotePopover(hlId) {
    const markEl = document.querySelector(`mark[data-hl-id="${hlId}"]`);
    if (markEl) {
      openHighlightActionPopover(markEl, hlId);
      const noteInput = document.getElementById("hl-popover-note-input");
      if (noteInput) setTimeout(() => noteInput.focus(), 40);
    }
  }

  function closeHighlightActionPopover() {
    const popover = document.getElementById("hl-action-popover");
    if (popover) popover.hidden = true;
    activeHighlightId = null;
  }

  function saveNoteFromHighlightPopover() {
    if (!activeHighlightId) return;
    const hl = workspaceDB.highlights.find((h) => h.id === activeHighlightId);
    if (!hl) return;

    const noteInput = document.getElementById("hl-popover-note-input");
    const pinCheck = document.getElementById("hl-popover-pin-check");
    const content = noteInput ? noteInput.value.trim() : "";
    const isPinned = pinCheck ? pinCheck.checked : false;

    let note = workspaceDB.notes.find((n) => n.highlightId === hl.id || (hl.noteId && n.id === hl.noteId));

    if (!content) {
      if (note) {
        workspaceDB.notes = workspaceDB.notes.filter((n) => n.id !== note.id);
        hl.noteId = null;
        document.querySelectorAll(`mark[data-hl-id="${hl.id}"]`).forEach((m) => m.classList.remove("has-attached-note"));
        saveWorkspaceDB();
        showWorkspaceToast("Đã xóa ghi chú khỏi đoạn Highlight", "info");
      }
      closeHighlightActionPopover();
      return;
    }

    if (note) {
      note.content = content;
      note.isPinned = isPinned;
      note.updatedAt = Date.now();
    } else {
      note = {
        id: "note_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36).slice(-4),
        userId: currentUserId,
        lessonKey: hl.lessonKey,
        moduleId: hl.moduleId,
        lessonTitle: hl.lessonTitle || resolveLessonTitleFromKey(hl.lessonKey),
        highlightId: hl.id,
        quoteText: hl.exactText,
        title: hl.exactText.length > 56 ? hl.exactText.substring(0, 56) + "..." : hl.exactText,
        content,
        tag: "exam",
        isPinned,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      workspaceDB.notes.push(note);
      hl.noteId = note.id;
    }

    document.querySelectorAll(`mark[data-hl-id="${hl.id}"]`).forEach((m) => m.classList.add("has-attached-note"));
    saveWorkspaceDB();
    if (typeof renderAllNotesList === "function") renderAllNotesList();
    renderFloatingQuickNotesList();
    closeHighlightActionPopover();
    showWorkspaceToast("Đã lưu ghi chú gắn với đoạn văn bản!", "success");
  }

  // --------------------------------------------------------------------------
  // 5. FLASHCARD CREATOR FROM HIGHLIGHT / NOTE (PART 9.E)
  // --------------------------------------------------------------------------
  function populateFlashcardModuleSelect(selectedModId) {
    const sel = document.getElementById("fc-module-select");
    if (!sel) return;
    const mods = typeof modulesData !== "undefined" && modulesData.length > 0 ? modulesData : [];
    sel.innerHTML = mods
      .map((m) => `<option value="${m.id}" ${m.id === selectedModId ? "selected" : ""}>Học phần ${m.id}: ${escapeHtml(m.title_vi || m.title)}</option>`)
      .join("");
  }

  function openFlashcardCreatorFromText(quoteText = "", sourceHlId = "", lessonKey = "") {
    ensureWorkspaceModalsDom();
    const modal = document.getElementById("fc-creator-modal");
    if (!modal) return;

    const modId = extractModuleIdFromKey(lessonKey || (typeof getCurrentLessonNoteKey === "function" ? getCurrentLessonNoteKey() : "module-1"));
    populateFlashcardModuleSelect(modId);

    document.getElementById("fc-edit-id").value = "";
    document.getElementById("fc-source-hl-id").value = sourceHlId || "";

    const frontEl = document.getElementById("fc-front-input");
    const backEl = document.getElementById("fc-back-input");

    // Smart auto-split if quote contains a colon or dash definition
    const colonIdx = quoteText.indexOf(":");
    if (colonIdx > 3 && colonIdx < 90) {
      frontEl.value = `Khái niệm / Cơ chế của: ${quoteText.substring(0, colonIdx).trim()}?`;
      backEl.value = quoteText.substring(colonIdx + 1).trim();
    } else {
      frontEl.value = quoteText ? `Giải thích ý nghĩa kỹ thuật của:\n"${quoteText.substring(0, 90)}${quoteText.length > 90 ? "..." : ""}"` : "";
      backEl.value = quoteText || "";
    }

    document.getElementById("fc-mastery-select").value = "new";
    closeHighlightActionPopover();
    hideSelectionToolbar();
    modal.hidden = false;
    setTimeout(() => frontEl.focus(), 40);
  }

  function openFlashcardEditorById(fcId) {
    ensureWorkspaceModalsDom();
    const fc = workspaceDB.flashcards.find((f) => f.id === fcId);
    if (!fc) return;
    const modal = document.getElementById("fc-creator-modal");
    populateFlashcardModuleSelect(fc.moduleId || 1);

    document.getElementById("fc-edit-id").value = fc.id;
    document.getElementById("fc-source-hl-id").value = fc.sourceHighlightId || "";
    document.getElementById("fc-front-input").value = fc.front || "";
    document.getElementById("fc-back-input").value = fc.back || "";
    document.getElementById("fc-mastery-select").value = fc.masteryLevel || "new";

    modal.hidden = false;
  }

  function saveCustomFlashcardFromModal() {
    const editId = document.getElementById("fc-edit-id").value;
    const sourceHlId = document.getElementById("fc-source-hl-id").value;
    const front = document.getElementById("fc-front-input").value.trim();
    const back = document.getElementById("fc-back-input").value.trim();
    const modId = Number(document.getElementById("fc-module-select").value) || 1;
    const masteryLevel = document.getElementById("fc-mastery-select").value || "new";

    if (!front || !back) {
      showWorkspaceToast("Vui lòng nhập đầy đủ cả Mặt trước (Front) và Mặt sau (Back).", "warning");
      return;
    }

    if (editId) {
      const existing = workspaceDB.flashcards.find((f) => f.id === editId);
      if (existing) {
        existing.front = front;
        existing.back = back;
        existing.moduleId = modId;
        existing.masteryLevel = masteryLevel;
        existing.updatedAt = Date.now();
      }
    } else {
      workspaceDB.flashcards.push({
        id: "fc_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36).slice(-4),
        userId: currentUserId,
        lessonKey: `module-${modId}`,
        moduleId: modId,
        sourceHighlightId: sourceHlId || null,
        front,
        back,
        category: "custom",
        masteryLevel,
        nextReviewAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }

    saveWorkspaceDB();
    document.getElementById("fc-creator-modal").hidden = true;
    showWorkspaceToast("Đã lưu thẻ Flashcard vào bộ ôn tập cá nhân!", "success");

    // Re-render workspace view if currently on My Notes / Workspace page
    if (typeof window.currentAcademySection !== "undefined" && window.currentAcademySection === "workspace") {
      renderMyNotesCentralPage();
    }
  }

  // --------------------------------------------------------------------------
  // 6. LESSON BOOKMARK SYSTEM (PART 9.C & 9.G)
  // --------------------------------------------------------------------------
  function isCurrentLessonBookmarked() {
    const key = typeof getCurrentLessonNoteKey === "function" ? getCurrentLessonNoteKey() : `module-${activeModuleId}`;
    return workspaceDB.bookmarks.some((b) => b.lessonKey === key && b.userId === currentUserId);
  }

  function toggleCurrentLessonBookmark() {
    const key = typeof getCurrentLessonNoteKey === "function" ? getCurrentLessonNoteKey() : `module-${activeModuleId}`;
    const title = typeof getCurrentLessonTitle === "function" ? getCurrentLessonTitle() : resolveLessonTitleFromKey(key);
    const idx = workspaceDB.bookmarks.findIndex((b) => b.lessonKey === key && b.userId === currentUserId);

    if (idx !== -1) {
      workspaceDB.bookmarks.splice(idx, 1);
      saveWorkspaceDB();
      showWorkspaceToast("Đã bỏ lưu dấu trang (Bookmark) bài học này", "info");
    } else {
      workspaceDB.bookmarks.push({
        id: "bm_" + Math.random().toString(36).substring(2, 9),
        userId: currentUserId,
        lessonKey: key,
        title,
        mode: typeof currentMode !== "undefined" ? currentMode : "modules",
        moduleId: typeof activeModuleId !== "undefined" ? activeModuleId : 1,
        labId: typeof activeLabId !== "undefined" ? activeLabId : 0,
        masteryId: typeof activeMasteryId !== "undefined" ? activeMasteryId : 0,
        createdAt: Date.now()
      });
      saveWorkspaceDB();
      showWorkspaceToast("Đã đánh dấu Bookmark bài học vào My Notes!", "success");
    }
    updateLessonBookmarkButtonUI();
  }

  function updateLessonBookmarkButtonUI() {
    const bookmarked = isCurrentLessonBookmarked();
    document.querySelectorAll(".lesson-bookmark-toggle-btn").forEach((btn) => {
      btn.classList.toggle("active", bookmarked);
      btn.innerHTML = bookmarked ? "🔖 Đã lưu Bookmark" : "🔖 Lưu Bookmark";
    });
  }

  // --------------------------------------------------------------------------
  // 7. FLOATING QUICK NOTE PANEL & TOAST / STATUS (PART 9.D & 9.F)
  // --------------------------------------------------------------------------
  let toastTimeout = null;
  function showWorkspaceToast(message, type = "success", showUndo = false) {
    ensureWorkspaceModalsDom();
    const toast = document.getElementById("workspace-toast");
    const textEl = document.getElementById("ws-toast-text");
    const undoBtn = document.getElementById("ws-toast-undo-btn");
    if (!toast || !textEl) return;

    toast.className = `workspace-toast ${type}`;
    textEl.textContent = message;
    if (undoBtn) {
      undoBtn.hidden = !(showUndo && lastUndoAction);
    }
    toast.hidden = false;

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.hidden = true;
    }, 3600);
  }

  function setFloatingSaveIndicator(state) {
    const statusText = document.getElementById("note-save-status-text");
    const badge = document.getElementById("cloud-sync-status-badge");
    const badgeText = document.getElementById("cloud-sync-status-text");

    if (state === "saving") {
      if (statusText) statusText.innerHTML = "⏳ <strong>Saving...</strong> (Đang tự động lưu)";
      if (badge) badge.className = "cloud-sync-status-badge syncing";
      if (badgeText) badgeText.textContent = "Saving...";
    } else if (state === "error") {
      if (statusText) statusText.innerHTML = "⚠️ <strong>Error:</strong> Chưa lưu được, vui lòng kiểm tra bộ nhớ!";
      if (badge) badge.className = "cloud-sync-status-badge error";
      if (badgeText) badgeText.textContent = "Save Error";
    } else {
      const timeStr = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      if (statusText) statusText.innerHTML = `✓ <strong>Saved</strong> (${timeStr})`;
      if (badge) badge.className = "cloud-sync-status-badge synced";
      if (badgeText) badgeText.textContent = "Saved";
    }
  }

  function renderFloatingQuickNotesList() {
    const key = typeof getCurrentLessonNoteKey === "function" ? getCurrentLessonNoteKey() : `module-${activeModuleId}`;
    let listContainer = document.getElementById("current-lesson-contextual-notes-list");
    if (!listContainer) {
      const panelCurrent = document.getElementById("panel-current");
      if (panelCurrent) {
        listContainer = document.createElement("div");
        listContainer.id = "current-lesson-contextual-notes-list";
        listContainer.className = "contextual-notes-sublist";
        panelCurrent.appendChild(listContainer);
      }
    }
    if (!listContainer) return;

    const lessonNotes = workspaceDB.notes
      .filter((n) => n.lessonKey === key && n.userId === currentUserId)
      .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || (b.updatedAt || 0) - (a.updatedAt || 0));

    const lessonHighlights = workspaceDB.highlights
      .filter((h) => h.lessonKey === key && h.userId === currentUserId);

    let html = `
      <div class="ctx-sublist-header">
        <strong>📌 Ghi chú &amp; Highlight trong bài này (${lessonNotes.length} ghi chú • ${lessonHighlights.length} highlight)</strong>
        <button type="button" class="ctx-open-full-ws-btn" id="ctx-open-full-ws-btn">Mở trang My Notes &rarr;</button>
      </div>
    `;

    if (lessonNotes.length === 0 && lessonHighlights.length === 0) {
      html += `<p class="ctx-empty-hint">💡 Mẹo: Bôi đen bất kỳ đoạn văn bản nào trong bài học để Tô màu Highlight (4 màu), gắn Ghi chú ngữ cảnh hoặc tạo thẻ Flashcard!</p>`;
    } else {
      lessonNotes.forEach((n) => {
        html += `
          <div class="ctx-note-chip ${n.isPinned ? "pinned" : ""}">
            <div class="ctx-chip-top">
              <span>${n.isPinned ? "📌 " : ""}<strong>${escapeHtml(n.title || "Ghi chú")}</strong></span>
              <div class="ctx-chip-btns">
                <button type="button" class="ctx-mini-btn" data-act="pin" data-id="${n.id}" title="Ghim / Bỏ ghim">${n.isPinned ? "Bỏ ghim" : "Ghim"}</button>
                <button type="button" class="ctx-mini-btn" data-act="fc" data-id="${n.id}" title="Chuyển thành Flashcard">🗂️ Flashcard</button>
                <button type="button" class="ctx-mini-btn danger" data-act="del" data-id="${n.id}" title="Xóa">✕</button>
              </div>
            </div>
            ${n.quoteText ? `<blockquote class="ctx-chip-quote">"${escapeHtml(n.quoteText)}"</blockquote>` : ""}
            <div class="ctx-chip-body">${escapeHtml(n.content)}</div>
          </div>
        `;
      });
    }

    listContainer.innerHTML = html;

    const openWsBtn = document.getElementById("ctx-open-full-ws-btn");
    if (openWsBtn) {
      openWsBtn.addEventListener("click", () => {
        if (typeof closeNotesModal === "function") closeNotesModal();
        if (typeof window.navigateToAcademySection === "function") {
          window.navigateToAcademySection("workspace");
        }
      });
    }

    listContainer.querySelectorAll(".ctx-mini-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const act = btn.dataset.act;
        const targetNote = workspaceDB.notes.find((x) => x.id === id);
        if (!targetNote) return;

        if (act === "pin") {
          targetNote.isPinned = !targetNote.isPinned;
          targetNote.updatedAt = Date.now();
          saveWorkspaceDB();
          renderFloatingQuickNotesList();
        } else if (act === "fc") {
          openFlashcardCreatorFromText(`${targetNote.title}: ${targetNote.content}`, targetNote.highlightId || "", targetNote.lessonKey);
        } else if (act === "del") {
          workspaceDB.notes = workspaceDB.notes.filter((x) => x.id !== id);
          saveWorkspaceDB();
          renderFloatingQuickNotesList();
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 8. MY NOTES — CENTRALIZED NOTE & HIGHLIGHT MANAGEMENT PAGE (PART 9.C)
  // --------------------------------------------------------------------------
  let wsActiveTab = "all-notes"; // "all-notes" | "highlights" | "pinned" | "bookmarks" | "flashcards"
  let wsFilterModule = "all";
  let wsFilterColor = "all";
  let wsFilterSort = "newest";
  let wsSearchQuery = "";

  function renderMyNotesCentralPage() {
    const container = document.getElementById("module-detail");
    if (!container) return;

    const myNotes = workspaceDB.notes.filter((n) => n.userId === currentUserId);
    const myHighlights = workspaceDB.highlights.filter((h) => h.userId === currentUserId);
    const myPinned = myNotes.filter((n) => n.isPinned);
    const myBookmarks = workspaceDB.bookmarks.filter((b) => b.userId === currentUserId);
    const myFlashcards = workspaceDB.flashcards.filter((f) => f.userId === currentUserId);

    const mods = typeof modulesData !== "undefined" ? modulesData : [];
    const moduleOptionsHtml = [
      `<option value="all">Tất cả Học phần &amp; Bài Lab</option>`,
      ...mods.map((m) => `<option value="${m.id}" ${String(wsFilterModule) === String(m.id) ? "selected" : ""}>Học phần ${m.id}: ${escapeHtml(m.title_vi || m.title)}</option>`)
    ].join("");

    // Filter & sort items
    const q = wsSearchQuery.trim().toLowerCase();

    const filteredNotes = myNotes
      .filter((n) => {
        if (wsActiveTab === "pinned" && !n.isPinned) return false;
        if (wsFilterModule !== "all" && String(n.moduleId) !== String(wsFilterModule)) return false;
        if (q) {
          const inTitle = (n.title || "").toLowerCase().includes(q);
          const inContent = (n.content || "").toLowerCase().includes(q);
          const inQuote = (n.quoteText || "").toLowerCase().includes(q);
          const inLesson = (n.lessonTitle || "").toLowerCase().includes(q);
          if (!inTitle && !inContent && !inQuote && !inLesson) return false;
        }
        return true;
      })
      .sort((a, b) => wsFilterSort === "oldest" ? (a.updatedAt - b.updatedAt) : (b.updatedAt - a.updatedAt));

    const filteredHighlights = myHighlights
      .filter((h) => {
        if (wsFilterModule !== "all" && String(h.moduleId) !== String(wsFilterModule)) return false;
        if (wsFilterColor !== "all" && h.color !== wsFilterColor) return false;
        if (q) {
          const inText = (h.exactText || "").toLowerCase().includes(q);
          const inLesson = (h.lessonTitle || "").toLowerCase().includes(q);
          if (!inText && !inLesson) return false;
        }
        return true;
      })
      .sort((a, b) => wsFilterSort === "oldest" ? (a.createdAt - b.createdAt) : (b.createdAt - a.createdAt));

    const filteredFlashcards = myFlashcards
      .filter((f) => {
        if (wsFilterModule !== "all" && String(f.moduleId) !== String(wsFilterModule)) return false;
        if (q) {
          if (!(f.front || "").toLowerCase().includes(q) && !(f.back || "").toLowerCase().includes(q)) return false;
        }
        return true;
      });

    let tabBodyHtml = "";

    if (wsActiveTab === "all-notes" || wsActiveTab === "pinned") {
      if (filteredNotes.length === 0) {
        tabBodyHtml = `
          <div class="ws-empty-card">
            <div class="ws-empty-icon">📝</div>
            <h4>Chưa có ghi chú nào trong danh mục này</h4>
            <p>Bạn có thể bấm nút <strong>"+ Tạo ghi chú độc lập"</strong> ở góc trên, hoặc bôi đen bất kỳ đoạn văn bản nào khi đang đọc bài học để gắn ghi chú trực tiếp vào đoạn đó.</p>
          </div>
        `;
      } else {
        tabBodyHtml = `<div class="ws-cards-grid">` + filteredNotes.map((n) => {
          const d = new Date(n.updatedAt || n.createdAt || Date.now());
          const timeStr = `${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} ${d.toLocaleDateString("vi-VN")}`;
          return `
            <article class="ws-note-card ${n.isPinned ? "is-pinned" : ""}">
              <div class="ws-card-meta">
                <span class="ws-lesson-pill">${escapeHtml(n.lessonTitle || resolveLessonTitleFromKey(n.lessonKey))}</span>
                <span class="ws-time-label">${escapeHtml(timeStr)}</span>
              </div>
              <h4 class="ws-note-title">${n.isPinned ? "📌 " : ""}${escapeHtml(n.title || "Ghi chú bài học")}</h4>
              ${n.quoteText ? `<blockquote class="ws-quote-box">"${escapeHtml(n.quoteText)}"</blockquote>` : ""}
              <div class="ws-note-content" id="ws-note-view-${n.id}">${formatRichText(n.content)}</div>
              <div class="ws-card-footer">
                <button type="button" class="ws-btn primary ws-jump-lesson-btn" data-key="${escapeHtml(n.lessonKey)}" data-hl="${escapeHtml(n.highlightId || "")}">
                  🚀 Đi tới vị trí bài học
                </button>
                <button type="button" class="ws-btn ws-pin-note-btn" data-id="${n.id}">
                  ${n.isPinned ? "📌 Bỏ ghim" : "📌 Ghim"}
                </button>
                <button type="button" class="ws-btn ws-edit-note-inline-btn" data-id="${n.id}">
                  ✏️ Sửa
                </button>
                <button type="button" class="ws-btn ws-note-to-fc-btn" data-id="${n.id}">
                  🗂️ Tạo Flashcard
                </button>
                <button type="button" class="ws-btn danger ws-del-note-btn" data-id="${n.id}">
                  🗑️ Xóa
                </button>
              </div>
            </article>
          `;
        }).join("") + `</div>`;
      }
    } else if (wsActiveTab === "highlights") {
      if (filteredHighlights.length === 0) {
        tabBodyHtml = `
          <div class="ws-empty-card">
            <div class="ws-empty-icon">🖍️</div>
            <h4>Chưa có đoạn văn bản Highlight nào khớp bộ lọc</h4>
            <p>Khi đọc bất kỳ Học phần hoặc Bài Lab nào, hãy dùng chuột bôi đen đoạn kiến thức quan trọng để chọn 1 trong 4 màu Highlight (Yellow, Green, Blue, Pink).</p>
          </div>
        `;
      } else {
        tabBodyHtml = `<div class="ws-cards-grid">` + filteredHighlights.map((h) => {
          const cInfo = HIGHLIGHT_COLORS[h.color] || HIGHLIGHT_COLORS.yellow;
          const d = new Date(h.updatedAt || h.createdAt || Date.now());
          const timeStr = `${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} ${d.toLocaleDateString("vi-VN")}`;
          const attachedNote = myNotes.find((n) => n.highlightId === h.id || (h.noteId && n.id === h.noteId));
          return `
            <article class="ws-hl-card color-${h.color}">
              <div class="ws-card-meta">
                <span class="ws-lesson-pill">${escapeHtml(h.lessonTitle || resolveLessonTitleFromKey(h.lessonKey))}</span>
                <span class="ws-color-badge ${h.color}">${escapeHtml(cInfo.label_vi)}</span>
                <span class="ws-time-label">${escapeHtml(timeStr)}</span>
              </div>
              <blockquote class="ws-hl-exact-text">
                <mark class="ccna-hl-${h.color}">"${escapeHtml(h.exactText)}"</mark>
              </blockquote>
              ${attachedNote ? `<div class="ws-attached-note-preview"><strong>📝 Ghi chú đính kèm:</strong> ${formatRichText(attachedNote.content)}</div>` : ""}
              <div class="ws-card-footer">
                <button type="button" class="ws-btn primary ws-jump-lesson-btn" data-key="${escapeHtml(h.lessonKey)}" data-hl="${escapeHtml(h.id)}">
                  🚀 Mở bài học &amp; Cuộn tới đoạn này
                </button>
                <div class="ws-inline-color-dots">
                  <button type="button" class="hl-swatch yellow ${h.color === "yellow" ? "active" : ""}" data-chg-hl="${h.id}" data-c="yellow" title="Đổi sang Vàng"></button>
                  <button type="button" class="hl-swatch green ${h.color === "green" ? "active" : ""}" data-chg-hl="${h.id}" data-c="green" title="Đổi sang Xanh lá"></button>
                  <button type="button" class="hl-swatch blue ${h.color === "blue" ? "active" : ""}" data-chg-hl="${h.id}" data-c="blue" title="Đổi sang Xanh dương"></button>
                  <button type="button" class="hl-swatch pink ${h.color === "pink" ? "active" : ""}" data-chg-hl="${h.id}" data-c="pink" title="Đổi sang Hồng"></button>
                </div>
                <button type="button" class="ws-btn ws-hl-to-fc-btn" data-id="${h.id}">
                  🗂️ Tạo Flashcard
                </button>
                <button type="button" class="ws-btn danger ws-del-hl-btn" data-id="${h.id}">
                  🗑️ Xóa
                </button>
              </div>
            </article>
          `;
        }).join("") + `</div>`;
      }
    } else if (wsActiveTab === "bookmarks") {
      if (myBookmarks.length === 0) {
        tabBodyHtml = `
          <div class="ws-empty-card">
            <div class="ws-empty-icon">🔖</div>
            <h4>Chưa có bài học nào được đánh dấu Bookmark</h4>
            <p>Bấm nút <strong>"🔖 Lưu Bookmark"</strong> ở đầu mỗi bài học hoặc bài Lab để lưu vào danh sách đọc nhanh tại đây.</p>
          </div>
        `;
      } else {
        tabBodyHtml = `<div class="ws-cards-grid">` + myBookmarks.map((b) => `
          <article class="ws-note-card">
            <div class="ws-card-meta">
              <span class="ws-lesson-pill">BOOKMARKED LESSON</span>
              <span class="ws-time-label">${new Date(b.createdAt).toLocaleDateString("vi-VN")}</span>
            </div>
            <h4 class="ws-note-title">🔖 ${escapeHtml(b.title)}</h4>
            <div class="ws-card-footer">
              <button type="button" class="ws-btn primary ws-jump-lesson-btn" data-key="${escapeHtml(b.lessonKey)}">
                🚀 Mở bài học ngay
              </button>
              <button type="button" class="ws-btn danger ws-del-bm-btn" data-id="${b.id}">
                🗑️ Bỏ dấu trang
              </button>
            </div>
          </article>
        `).join("") + `</div>`;
      }
    } else if (wsActiveTab === "flashcards") {
      const masteryLabels = {
        new: "🆕 Mới tạo",
        learning: "🔄 Cần ôn tập (Hard)",
        good: "👍 Đã nắm cơ bản (Good)",
        mastered: "⭐ Đã thuộc lòng (Easy)"
      };
      tabBodyHtml = `
        <div class="ws-fc-toolbar">
          <div>
            <strong>Bộ Thẻ Ghi Nhớ Cá Nhân (Custom Network Flashcards): ${filteredFlashcards.length} thẻ</strong>
            <p style="font-size:0.84rem;color:var(--text-muted);">Bạn có thể tạo thẻ mới từ các đoạn Highlight hoặc tự soạn câu hỏi Front / Back để ôn tập theo phương pháp Spaced Repetition.</p>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button type="button" class="ws-btn primary" id="ws-create-manual-fc-btn">+ Tạo Flashcard mới</button>
            <button type="button" class="ws-btn" id="ws-practice-all-fc-btn">🎯 Mở phòng luyện 400+ Flashcards</button>
          </div>
        </div>
      `;
      if (filteredFlashcards.length === 0) {
        tabBodyHtml += `
          <div class="ws-empty-card">
            <div class="ws-empty-icon">🗂️</div>
            <h4>Bạn chưa tạo thẻ Flashcard cá nhân nào</h4>
            <p>Bấm nút <strong>"+ Tạo Flashcard mới"</strong> hoặc chọn một đoạn Highlight trong bài học rồi bấm <strong>"🗂️ Tạo Flashcard"</strong>.</p>
          </div>
        `;
      } else {
        tabBodyHtml += `<div class="ws-cards-grid">` + filteredFlashcards.map((fc) => `
          <article class="ws-note-card">
            <div class="ws-card-meta">
              <span class="ws-lesson-pill">Học phần ${fc.moduleId || 1}</span>
              <span class="ws-mastery-pill ${fc.masteryLevel || "new"}">${masteryLabels[fc.masteryLevel] || masteryLabels.new}</span>
            </div>
            <div class="ws-fc-box front">
              <span class="fc-side-tag">FRONT</span>
              <div>${formatRichText(fc.front)}</div>
            </div>
            <div class="ws-fc-box back">
              <span class="fc-side-tag">BACK</span>
              <div>${formatRichText(fc.back)}</div>
            </div>
            <div class="ws-card-footer">
              <select class="ws-fc-rate-select" data-fc-id="${fc.id}" title="Đánh dấu mức độ hiểu bài">
                <option value="new" ${fc.masteryLevel === "new" ? "selected" : ""}>🆕 Mới (New)</option>
                <option value="learning" ${fc.masteryLevel === "learning" ? "selected" : ""}>🔄 Cần ôn lại (Hard)</option>
                <option value="good" ${fc.masteryLevel === "good" ? "selected" : ""}>👍 Khá (Good)</option>
                <option value="mastered" ${fc.masteryLevel === "mastered" ? "selected" : ""}>⭐ Đã thuộc (Easy)</option>
              </select>
              <button type="button" class="ws-btn ws-edit-fc-btn" data-id="${fc.id}">✏️ Sửa Front/Back</button>
              <button type="button" class="ws-btn danger ws-del-fc-btn" data-id="${fc.id}">🗑️ Xóa</button>
            </div>
          </article>
        `).join("") + `</div>`;
      }
    }

    container.innerHTML = `
      <div class="workspace-view-container">
        <header class="module-header">
          <div class="module-kicker">PERSONAL LEARNING WORKSPACE • NOTION + HYPOTHES.IS + READWISE + ANKI</div>
          <h2 class="module-heading">My Notes, Highlights &amp; Personal Knowledge Flashcards</h2>
          <div class="module-heading-sub">
            Không gian lưu trữ, đánh dấu highlight 4 màu, ghi chú theo ngữ cảnh và ôn tập thẻ nhớ cá nhân hóa. Toàn bộ dữ liệu được cô lập an toàn theo tài khoản (<code>${escapeHtml(currentUserId)}</code>) và đồng bộ tự động.
          </div>
          <div class="lesson-study-actions" style="margin-top:1rem;">
            <button type="button" class="lesson-complete-toggle-btn completed" id="ws-add-standalone-note-btn">
              + Tạo ghi chú độc lập mới
            </button>
            <button type="button" class="lesson-note-trigger-btn" id="ws-add-manual-fc-top-btn">
              🗂️ + Tạo Flashcard mới
            </button>
            <button type="button" class="lesson-note-trigger-btn" id="ws-export-md-btn">
              📄 Xuất Notes ra Markdown (.md)
            </button>
            <button type="button" class="lesson-note-trigger-btn" id="ws-export-pdf-btn">
              🖨️ Xuất / In PDF
            </button>
          </div>
        </header>

        <!-- Standalone Note Quick Creator (Hidden by default) -->
        <div class="ws-standalone-creator" id="ws-standalone-creator" hidden>
          <h4>📝 Tạo Ghi Chú Độc Lập Mới</h4>
          <div class="ws-creator-grid">
            <input type="text" id="ws-new-note-title" class="calc-input" placeholder="Tiêu đề ghi chú (VD: Tổng hợp 6 điều kiện lên OSPF Neighbor)..." />
            <select id="ws-new-note-mod" class="calc-input">${moduleOptionsHtml}</select>
          </div>
          <textarea id="ws-new-note-content" class="fc-textarea" rows="4" style="margin-top:0.65rem;" placeholder="Nhập nội dung ghi chú kỹ thuật của bạn..."></textarea>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.65rem;">
            <label style="display:flex;align-items:center;gap:0.4rem;font-size:0.86rem;cursor:pointer;">
              <input type="checkbox" id="ws-new-note-pin" />
              <span>📌 Ghim vào Pinned Notes</span>
            </label>
            <div style="display:flex;gap:0.5rem;">
              <button type="button" class="ws-btn" id="ws-cancel-new-note-btn">Hủy</button>
              <button type="button" class="ws-btn primary" id="ws-save-new-note-btn">Lưu ghi chú</button>
            </div>
          </div>
        </div>

        <!-- 5 Workspace Navigation Tabs -->
        <div class="ws-tabs-bar" role="tablist">
          <button type="button" class="ws-tab-btn ${wsActiveTab === "all-notes" ? "active" : ""}" data-ws-tab="all-notes">
            📝 All Notes <span class="ws-count">${myNotes.length}</span>
          </button>
          <button type="button" class="ws-tab-btn ${wsActiveTab === "highlights" ? "active" : ""}" data-ws-tab="highlights">
            🖍️ Highlighted Content <span class="ws-count">${myHighlights.length}</span>
          </button>
          <button type="button" class="ws-tab-btn ${wsActiveTab === "pinned" ? "active" : ""}" data-ws-tab="pinned">
            📌 Pinned Notes <span class="ws-count">${myPinned.length}</span>
          </button>
          <button type="button" class="ws-tab-btn ${wsActiveTab === "bookmarks" ? "active" : ""}" data-ws-tab="bookmarks">
            🔖 Bookmarked Lessons <span class="ws-count">${myBookmarks.length}</span>
          </button>
          <button type="button" class="ws-tab-btn ${wsActiveTab === "flashcards" ? "active" : ""}" data-ws-tab="flashcards">
            🗂️ Custom Flashcards <span class="ws-count">${myFlashcards.length}</span>
          </button>
        </div>

        <!-- Multi-Dimensional Filter & Search Bar -->
        <div class="ws-filter-bar">
          <input type="search" id="ws-search-input" class="ws-search-input" value="${escapeHtml(wsSearchQuery)}" placeholder="🔍 Tìm kiếm trong nội dung ghi chú hoặc văn bản gốc được highlight..." />
          <select id="ws-filter-mod-select" class="ws-filter-select" aria-label="Lọc theo Học phần">
            ${moduleOptionsHtml}
          </select>
          <select id="ws-filter-color-select" class="ws-filter-select" aria-label="Lọc theo màu Highlight">
            <option value="all" ${wsFilterColor === "all" ? "selected" : ""}>🎨 Tất cả màu Highlight</option>
            <option value="yellow" ${wsFilterColor === "yellow" ? "selected" : ""}>🟡 Yellow (Important concepts)</option>
            <option value="green" ${wsFilterColor === "green" ? "selected" : ""}>🟢 Green (Understood / Key)</option>
            <option value="blue" ${wsFilterColor === "blue" ? "selected" : ""}>🔵 Blue (Technical definitions)</option>
            <option value="pink" ${wsFilterColor === "pink" ? "selected" : ""}>🩷 Pink (Need to review)</option>
          </select>
          <select id="ws-filter-sort-select" class="ws-filter-select" aria-label="Sắp xếp theo thời gian">
            <option value="newest" ${wsFilterSort === "newest" ? "selected" : ""}>🕒 Mới cập nhật nhất</option>
            <option value="oldest" ${wsFilterSort === "oldest" ? "selected" : ""}>🕒 Cũ nhất trước</option>
          </select>
        </div>

        <!-- Dynamic Tab Body -->
        <div class="ws-body-area">
          ${tabBodyHtml}
        </div>
      </div>
    `;

    attachMyNotesCentralEvents(container);
  }

  function attachMyNotesCentralEvents(container) {
    // Tabs
    container.querySelectorAll(".ws-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        wsActiveTab = btn.dataset.wsTab;
        renderMyNotesCentralPage();
      });
    });

    // Filters
    const searchInput = document.getElementById("ws-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        wsSearchQuery = e.target.value;
        renderMyNotesCentralPage();
        const newInput = document.getElementById("ws-search-input");
        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(wsSearchQuery.length, wsSearchQuery.length);
        }
      });
    }

    const modSelect = document.getElementById("ws-filter-mod-select");
    if (modSelect) {
      modSelect.addEventListener("change", (e) => {
        wsFilterModule = e.target.value;
        renderMyNotesCentralPage();
      });
    }

    const colorSelect = document.getElementById("ws-filter-color-select");
    if (colorSelect) {
      colorSelect.addEventListener("change", (e) => {
        wsFilterColor = e.target.value;
        renderMyNotesCentralPage();
      });
    }

    const sortSelect = document.getElementById("ws-filter-sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        wsFilterSort = e.target.value;
        renderMyNotesCentralPage();
      });
    }

    // Standalone note creator
    const addNoteBtn = document.getElementById("ws-add-standalone-note-btn");
    const creatorBox = document.getElementById("ws-standalone-creator");
    if (addNoteBtn && creatorBox) {
      addNoteBtn.addEventListener("click", () => {
        creatorBox.hidden = !creatorBox.hidden;
        if (!creatorBox.hidden) document.getElementById("ws-new-note-title")?.focus();
      });
    }
    document.getElementById("ws-cancel-new-note-btn")?.addEventListener("click", () => {
      if (creatorBox) creatorBox.hidden = true;
    });
    document.getElementById("ws-save-new-note-btn")?.addEventListener("click", () => {
      const title = document.getElementById("ws-new-note-title")?.value.trim() || "";
      const content = document.getElementById("ws-new-note-content")?.value.trim() || "";
      const modVal = document.getElementById("ws-new-note-mod")?.value;
      const modId = modVal && modVal !== "all" ? Number(modVal) : 1;
      const isPinned = !!document.getElementById("ws-new-note-pin")?.checked;

      if (!content) {
        showWorkspaceToast("Vui lòng nhập nội dung ghi chú.", "warning");
        return;
      }

      const lessonKey = `module-${modId}`;
      workspaceDB.notes.push({
        id: "note_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36).slice(-4),
        userId: currentUserId,
        lessonKey,
        moduleId: modId,
        lessonTitle: resolveLessonTitleFromKey(lessonKey),
        highlightId: null,
        quoteText: "",
        title: title || resolveLessonTitleFromKey(lessonKey),
        content,
        tag: "exam",
        isPinned,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      saveWorkspaceDB();
      wsActiveTab = "all-notes";
      renderMyNotesCentralPage();
      showWorkspaceToast("Đã tạo ghi chú độc lập thành công!", "success");
    });

    // Export Markdown & Print PDF
    document.getElementById("ws-export-md-btn")?.addEventListener("click", exportWorkspaceToMarkdown);
    document.getElementById("ws-export-pdf-btn")?.addEventListener("click", () => window.print());
    document.getElementById("ws-add-manual-fc-top-btn")?.addEventListener("click", () => openFlashcardCreatorFromText("", "", "module-1"));
    document.getElementById("ws-create-manual-fc-btn")?.addEventListener("click", () => openFlashcardCreatorFromText("", "", "module-1"));
    document.getElementById("ws-practice-all-fc-btn")?.addEventListener("click", () => {
      if (typeof openFlashcardsModal === "function") openFlashcardsModal("all");
    });

    // Jump to Lesson & Scroll to Highlight
    container.querySelectorAll(".ws-jump-lesson-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.key || "module-1";
        const hlId = btn.dataset.hl || "";
        navigateToLessonAndHighlight(key, hlId);
      });
    });

    // Pin / Unpin Note
    container.querySelectorAll(".ws-pin-note-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const note = workspaceDB.notes.find((n) => n.id === btn.dataset.id);
        if (note) {
          note.isPinned = !note.isPinned;
          note.updatedAt = Date.now();
          saveWorkspaceDB();
          renderMyNotesCentralPage();
        }
      });
    });

    // Inline Edit Note
    container.querySelectorAll(".ws-edit-note-inline-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const note = workspaceDB.notes.find((n) => n.id === btn.dataset.id);
        const viewEl = document.getElementById(`ws-note-view-${btn.dataset.id}`);
        if (!note || !viewEl) return;

        viewEl.innerHTML = `
          <textarea class="fc-textarea" id="ws-inline-ta-${note.id}" rows="3">${escapeHtml(note.content)}</textarea>
          <div style="display:flex;gap:0.4rem;margin-top:0.4rem;justify-content:flex-end;">
            <button type="button" class="ws-btn primary" id="ws-inline-save-${note.id}">Lưu thay đổi</button>
          </div>
        `;
        document.getElementById(`ws-inline-save-${note.id}`)?.addEventListener("click", () => {
          const val = document.getElementById(`ws-inline-ta-${note.id}`)?.value.trim();
          if (val) {
            note.content = val;
            note.updatedAt = Date.now();
            saveWorkspaceDB();
            renderMyNotesCentralPage();
            showWorkspaceToast("Đã cập nhật nội dung ghi chú!", "success");
          }
        });
      });
    });

    // Convert Note / Highlight to Flashcard
    container.querySelectorAll(".ws-note-to-fc-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const n = workspaceDB.notes.find((x) => x.id === btn.dataset.id);
        if (n) openFlashcardCreatorFromText(`${n.title}: ${n.content}`, n.highlightId || "", n.lessonKey);
      });
    });
    container.querySelectorAll(".ws-hl-to-fc-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const h = workspaceDB.highlights.find((x) => x.id === btn.dataset.id);
        if (h) openFlashcardCreatorFromText(h.exactText, h.id, h.lessonKey);
      });
    });

    // Delete Note / Highlight / Bookmark / Flashcard
    container.querySelectorAll(".ws-del-note-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        workspaceDB.notes = workspaceDB.notes.filter((n) => n.id !== btn.dataset.id);
        saveWorkspaceDB();
        renderMyNotesCentralPage();
        showWorkspaceToast("Đã xóa ghi chú", "info");
      });
    });
    container.querySelectorAll(".ws-del-hl-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        deleteHighlightById(btn.dataset.id);
        renderMyNotesCentralPage();
      });
    });
    container.querySelectorAll("[data-chg-hl]").forEach((sw) => {
      sw.addEventListener("click", () => {
        changeHighlightColor(sw.dataset.chgHl, sw.dataset.c);
        renderMyNotesCentralPage();
      });
    });
    container.querySelectorAll(".ws-del-bm-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        workspaceDB.bookmarks = workspaceDB.bookmarks.filter((b) => b.id !== btn.dataset.id);
        saveWorkspaceDB();
        renderMyNotesCentralPage();
      });
    });
    container.querySelectorAll(".ws-edit-fc-btn").forEach((btn) => {
      btn.addEventListener("click", () => openFlashcardEditorById(btn.dataset.id));
    });
    container.querySelectorAll(".ws-del-fc-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        workspaceDB.flashcards = workspaceDB.flashcards.filter((f) => f.id !== btn.dataset.id);
        saveWorkspaceDB();
        renderMyNotesCentralPage();
        showWorkspaceToast("Đã xóa thẻ Flashcard", "info");
      });
    });
    container.querySelectorAll(".ws-fc-rate-select").forEach((sel) => {
      sel.addEventListener("change", (e) => {
        const fc = workspaceDB.flashcards.find((f) => f.id === sel.dataset.fcId);
        if (fc) {
          fc.masteryLevel = e.target.value;
          fc.updatedAt = Date.now();
          saveWorkspaceDB();
          renderMyNotesCentralPage();
        }
      });
    });
  }

  function navigateToLessonAndHighlight(lessonKey, hlId = "") {
    if (lessonKey.startsWith("lab-")) {
      const id = Number(lessonKey.replace("lab-", ""));
      if (typeof window.navigateToAcademySection === "function") {
        window.navigateToAcademySection("labs", id);
      } else {
        setActiveModeTab("labs");
        renderLabsView(id);
      }
    } else if (lessonKey.startsWith("mastery-")) {
      const id = Number(lessonKey.replace("mastery-", ""));
      if (typeof window.navigateToAcademySection === "function") {
        window.navigateToAcademySection("projects", id);
      } else {
        setActiveModeTab("mastery");
        renderMasteryView(id);
      }
    } else {
      const id = Number(lessonKey.replace("module-", "")) || 1;
      if (typeof window.navigateToAcademySection === "function") {
        window.navigateToAcademySection("modules", id);
      } else {
        setActiveModeTab("modules");
        selectModule(id);
      }
    }

    setTimeout(() => {
      if (hlId) {
        const markEl = document.querySelector(`mark[data-hl-id="${hlId}"]`);
        if (markEl) {
          const sec = markEl.closest(".section-block");
          if (sec && sec.classList.contains("is-collapsed")) sec.classList.remove("is-collapsed");
          markEl.scrollIntoView({ behavior: "smooth", block: "center" });
          markEl.classList.add("hl-pulse-focus");
          setTimeout(() => markEl.classList.remove("hl-pulse-focus"), 2400);
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 150);
  }

  function exportWorkspaceToMarkdown() {
    const myNotes = workspaceDB.notes.filter((n) => n.userId === currentUserId);
    const myHighlights = workspaceDB.highlights.filter((h) => h.userId === currentUserId);

    let md = `# SỔ TAY HỌC TẬP & HIGHLIGHT — CCNA NETWORK ACADEMY\n`;
    md += `- **Tài khoản:** ${currentUserId}\n`;
    md += `- **Ngày xuất:** ${new Date().toLocaleString("vi-VN")}\n`;
    md += `- **Tổng số Ghi chú:** ${myNotes.length} | **Tổng số Highlight:** ${myHighlights.length}\n\n---\n\n`;

    md += `## PHẦN 1: GHI CHÚ HỌC TẬP (NOTES)\n\n`;
    if (myNotes.length === 0) {
      md += `_Chưa có ghi chú nào._\n\n`;
    } else {
      myNotes.forEach((n, idx) => {
        md += `### ${idx + 1}. ${n.isPinned ? "[PINNED] " : ""}${n.title || "Ghi chú"}\n`;
        md += `- **Bài học:** ${n.lessonTitle || n.lessonKey}\n`;
        if (n.quoteText) md += `> "${n.quoteText}"\n\n`;
        md += `${n.content}\n\n`;
      });
    }

    md += `---\n\n## PHẦN 2: CÁC ĐOẠN ĐÁNH DẤU (HIGHLIGHTS)\n\n`;
    if (myHighlights.length === 0) {
      md += `_Chưa có đoạn highlight nào._\n\n`;
    } else {
      myHighlights.forEach((h, idx) => {
        const cLabel = HIGHLIGHT_COLORS[h.color]?.label_vi || h.color;
        md += `${idx + 1}. **[${cLabel}]** (${h.lessonTitle || h.lessonKey}):\n`;
        md += `   > "${h.exactText}"\n\n`;
      });
    }

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CCNA_Academy_Notes_${currentUserId}_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showWorkspaceToast("Đã tải xuống file Markdown (.md) thành công!", "success");
  }

  // --------------------------------------------------------------------------
  // 9. BIND GLOBAL SELECTION TOOLBAR & POPOVER EVENTS
  // --------------------------------------------------------------------------
  function hideSelectionToolbar() {
    const tooltip = document.getElementById("selection-tooltip");
    if (tooltip) tooltip.hidden = true;
  }

  function bindWorkspacePopoverAndModalEvents() {
    const popover = document.getElementById("hl-action-popover");
    if (popover) {
      popover.querySelectorAll(".hl-swatch").forEach((sw) => {
        sw.addEventListener("click", () => {
          if (activeHighlightId) {
            changeHighlightColor(activeHighlightId, sw.dataset.hlColor);
            popover.querySelectorAll(".hl-swatch").forEach((s) => s.classList.toggle("active", s === sw));
          }
        });
      });

      document.getElementById("hl-pop-delete-btn")?.addEventListener("click", () => {
        if (activeHighlightId) deleteHighlightById(activeHighlightId);
      });

      document.getElementById("hl-pop-close-btn")?.addEventListener("click", closeHighlightActionPopover);
      document.getElementById("hl-popover-save-note-btn")?.addEventListener("click", saveNoteFromHighlightPopover);
      document.getElementById("hl-pop-to-flashcard-btn")?.addEventListener("click", () => {
        const hl = workspaceDB.highlights.find((h) => h.id === activeHighlightId);
        if (hl) openFlashcardCreatorFromText(hl.exactText, hl.id, hl.lessonKey);
      });
    }

    // Flashcard Creator modal
    const fcModal = document.getElementById("fc-creator-modal");
    document.getElementById("fc-creator-close-btn")?.addEventListener("click", () => {
      if (fcModal) fcModal.hidden = true;
    });
    document.getElementById("fc-creator-cancel-btn")?.addEventListener("click", () => {
      if (fcModal) fcModal.hidden = true;
    });
    document.getElementById("fc-creator-backdrop")?.addEventListener("click", () => {
      if (fcModal) fcModal.hidden = true;
    });
    document.getElementById("fc-creator-save-btn")?.addEventListener("click", saveCustomFlashcardFromModal);

    // Toast Undo button
    document.getElementById("ws-toast-undo-btn")?.addEventListener("click", () => {
      if (lastUndoAction && typeof lastUndoAction.restoreFn === "function") {
        lastUndoAction.restoreFn();
        lastUndoAction = null;
        document.getElementById("workspace-toast").hidden = true;
        showWorkspaceToast("Đã hoàn tác thao tác vừa rồi!", "info");
      }
    });

    // Close popover when clicking outside
    document.addEventListener("mousedown", (e) => {
      if (popover && !popover.hidden && !popover.contains(e.target) && !e.target.closest("mark[data-hl-id]")) {
        closeHighlightActionPopover();
      }
    });
  }

  function upgradeSelectionToolbar() {
    ensureWorkspaceModalsDom();
    const tooltip = document.getElementById("selection-tooltip");
    if (!tooltip) return;

    // Replace tooltip buttons with the rich 4-color + Contextual Note + Flashcard toolbar
    tooltip.innerHTML = `
      <button type="button" class="sel-btn highlight-yellow" data-ws-color="yellow" title="Yellow: Khái niệm quan trọng">🟡</button>
      <button type="button" class="sel-btn highlight-green" data-ws-color="green" title="Green: Đã hiểu / Trọng tâm">🟢</button>
      <button type="button" class="sel-btn highlight-blue" data-ws-color="blue" title="Blue: Định nghĩa kỹ thuật">🔵</button>
      <button type="button" class="sel-btn highlight-pink" data-ws-color="pink" title="Pink: Cần ôn tập lại">🩷</button>
      <span class="sel-divider"></span>
      <button type="button" class="sel-btn add-to-note" id="ws-sel-add-ctx-note-btn" title="Tô sáng &amp; Gắn ghi chú trực tiếp vào đoạn này">
        📝 <span>+ Ghi chú</span>
      </button>
      <button type="button" class="sel-btn add-to-note" id="ws-sel-create-fc-btn" title="Tạo thẻ Flashcard từ đoạn bôi đen">
        🗂️ <span>+ Flashcard</span>
      </button>
    `;

    tooltip.querySelectorAll("[data-ws-color]").forEach((btn) => {
      btn.addEventListener("mousedown", (e) => e.preventDefault()); // Keep text selection alive
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        createHighlightFromSelection(btn.dataset.wsColor, false, false);
      });
    });

    const addCtxNoteBtn = document.getElementById("ws-sel-add-ctx-note-btn");
    if (addCtxNoteBtn) {
      addCtxNoteBtn.addEventListener("mousedown", (e) => e.preventDefault());
      addCtxNoteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        createHighlightFromSelection("yellow", true, false);
      });
    }

    const createFcBtn = document.getElementById("ws-sel-create-fc-btn");
    if (createFcBtn) {
      createFcBtn.addEventListener("mousedown", (e) => e.preventDefault());
      createFcBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        createHighlightFromSelection("blue", false, true);
      });
    }
  }

  // Expose workspace API globally
  window.CCNA_WORKSPACE = {
    HIGHLIGHT_COLORS,
    loadWorkspaceForCurrentUser,
    saveWorkspaceDB,
    restoreHighlightsForLesson,
    createHighlightFromSelection,
    changeHighlightColor,
    deleteHighlightById,
    renderMyNotesCentralPage,
    renderFloatingQuickNotesList,
    toggleCurrentLessonBookmark,
    isCurrentLessonBookmarked,
    updateLessonBookmarkButtonUI,
    openFlashcardCreatorFromText,
    upgradeSelectionToolbar,
    getWorkspaceDB: () => workspaceDB
  };
})();
