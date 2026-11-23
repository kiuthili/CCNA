// ============================================================================
// CCNA NETWORK ACADEMY — GLOBAL COMMAND PALETTE (Ctrl+K / Cmd+K) & SHORTCUTS (?)
// Omni-Search across 7 live data sources (< 15ms fuzzy & diacritic-insensitive):
//   1. 17 Theory Modules (Title, Concepts, Comparison Tables)
//   2. 35 Packet Tracer Labs (Title, Protocols, IP Table, CLI)
//   3. 10 Exam Mastery & Real-World Domains
//   4. 120+ Cisco IOS CLI Cheat Sheet Commands
//   5. Deep Technical Glossary (MODULE_DEEP_GLOSSARY)
//   6. Personal Notes & Highlights (CCNA_WORKSPACE)
//   7. Quick Actions (Mock Exam, Subnet/VLSM Architect, IOS Terminal, Theme, AI)
// ============================================================================

(function () {
  "use strict";

  let paletteIndex = [];
  let indexBuiltAt = 0;
  let filteredItems = [];
  let selectedIdx = 0;
  let isPaletteOpen = false;
  let isShortcutsOpen = false;
  let activeCategoryFilter = "all";

  function normalizeText(str) {
    return String(str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  }

  function escHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildOmniSearchIndex(force = false) {
    const now = Date.now();
    if (!force && paletteIndex.length > 0 && now - indexBuiltAt < 8000) {
      return paletteIndex;
    }

    const items = [];
    const isEn = typeof currentLang !== "undefined" && currentLang === "en";

    // 7. Quick Actions (always top priority when empty query or action keyword)
    const quickActions = [
      {
        id: "act-exam",
        category: "action",
        badge: "⚡ ACTION",
        icon: "🎯",
        title: isEn ? "Start CCNA 200-301 Mock Exam" : "Mở Phòng Thi Thử CCNA 200-301",
        subtitle: "Pearson VUE Simulator • 6 Domains • Chấm điểm 300-1000",
        keywords: "thi thu mock exam pearson vue quiz test",
        run: () => typeof startMockExam === "function" && startMockExam(30)
      },
      {
        id: "act-weak-drill",
        category: "action",
        badge: "⚡ ACTION",
        icon: "🩺",
        title: isEn ? "Smart Weak-Spot Drill" : "Luyện Tập Khắc Phục Điểm Yếu (Weak-Spot Drill)",
        subtitle: "Tự động lọc câu làm sai & Domain điểm thấp nhất",
        keywords: "diem yeu weak spot drill on tap luyen thi",
        run: () => typeof window.startWeakSpotDrill === "function" && window.startWeakSpotDrill()
      },
      {
        id: "act-subnet",
        category: "action",
        badge: "⚡ TOOL",
        icon: "🧮",
        title: isEn ? "Visual Subnet & VLSM Architect" : "Máy Tính Quy Hoạch IP, Subnetting & VLSM Trực Quan",
        subtitle: "32-bit Binary Visualizer • Magic Number • Wildcard Mask • VLSM Planner",
        keywords: "subnet vlsm cidr wildcard ip binary calculator chia mang",
        run: () => typeof window.openSubnetToolkitModal === "function" && window.openSubnetToolkitModal()
      },
      {
        id: "act-ios-cli",
        category: "action",
        badge: "⚡ TOOL",
        icon: "💻",
        title: isEn ? "Interactive Cisco IOS CLI Terminal Simulator" : "Mở Trình Giả Lập Dòng Lệnh Cisco IOS CLI",
        subtitle: "Tab Auto-complete • ? Context Help • Show Run / VLAN / OSPF",
        keywords: "cisco ios cli terminal simulator router switch console",
        run: () => typeof window.openStandaloneIosTerminal === "function" && window.openStandaloneIosTerminal()
      },
      {
        id: "act-ai",
        category: "action",
        badge: "⚡ AI",
        icon: "🤖",
        title: isEn ? "Open AI Network Tutor (Streaming)" : "Mở Trợ Lý AI Cisco (Hỏi đáp & Soi lỗi Lab)",
        subtitle: "Real-Time Streaming • Vision 2.0 • Alt+A",
        keywords: "ai tutor tro ly cisco gemini chat vision",
        run: () => typeof window.openAiTutorModal === "function" && window.openAiTutorModal()
      },
      {
        id: "act-flashcards",
        category: "action",
        badge: "⚡ SRS",
        icon: "🃏",
        title: isEn ? "SM-2 Spaced Repetition Flashcards" : "Ôn Tập Flashcards Thông Minh (Anki SM-2)",
        subtitle: "Again / Hard / Good / Easy • Lịch ôn tập tự động",
        keywords: "flashcard anki sm2 spaced repetition the nho on tap",
        run: () => typeof window.openFlashcardsModal === "function" && window.openFlashcardsModal("all")
      },
      {
        id: "act-theme-light",
        category: "action",
        badge: "🎨 THEME",
        icon: "☀️",
        title: isEn ? "Switch Theme: Light (Daylight)" : "Đổi giao diện: Sáng (Daylight)",
        subtitle: "Nền sáng tối ưu đọc ban ngày",
        keywords: "theme light sang giao dien mau",
        run: () => typeof applyTheme === "function" && applyTheme("light")
      },
      {
        id: "act-theme-sepia",
        category: "action",
        badge: "🎨 THEME",
        icon: "📖",
        title: isEn ? "Switch Theme: Eye-Care Sepia" : "Đổi giao diện: Dịu mắt (Sepia)",
        subtitle: "Tông giấy ấm bảo vệ mắt khi học lâu",
        keywords: "theme sepia diu mat giao dien mau",
        run: () => typeof applyTheme === "function" && applyTheme("sepia")
      },
      {
        id: "act-theme-dark",
        category: "action",
        badge: "🎨 THEME",
        icon: "🌙",
        title: isEn ? "Switch Theme: Dark Engineer" : "Đổi giao diện: Tối (Dark Slate)",
        subtitle: "Chế độ ban đêm cho kỹ sư mạng",
        keywords: "theme dark toi ban dem giao dien mau",
        run: () => typeof applyTheme === "function" && applyTheme("dark")
      },
      {
        id: "act-cheatsheet",
        category: "action",
        badge: "⚡ TOOL",
        icon: "⌨️",
        title: isEn ? "Cisco IOS CLI Pocket Guide" : "Sổ Tay Tra Cứu 120+ Lệnh Cisco IOS & Bảng Công Thức",
        subtitle: "AD, Port dịch vụ, Syslog, Multicast",
        keywords: "cheat sheet lenh cli ad port syslog multicast",
        run: () => typeof openCheatSheetModal === "function" && openCheatSheetModal("commands")
      },
      {
        id: "act-shortcuts",
        category: "action",
        badge: "⌨️ HELP",
        icon: "❓",
        title: isEn ? "Keyboard Shortcuts Reference (?)" : "Bảng Tổng Hợp Phím Tắt Toàn Hệ Thống (?)",
        subtitle: "Ctrl+K, Ctrl+B, Alt+N, Alt+A, Space, ?",
        keywords: "phim tat keyboard shortcuts help",
        run: () => openShortcutsModal()
      }
    ];
    quickActions.forEach((a) => items.push({ ...a, searchBlob: normalizeText(`${a.title} ${a.subtitle} ${a.keywords}`) }));

    // 1. 17 Theory Modules
    if (typeof modulesData !== "undefined" && Array.isArray(modulesData)) {
      modulesData.forEach((m) => {
        const conceptsText = (m.keyConcepts_vi || []).map((c) => `${c.term || ""} ${c.desc || ""}`).join(" ");
        const tableText = m.comparisonTable ? `${m.comparisonTable.title_vi || ""} ${(m.comparisonTable.rows || []).flat().join(" ")}` : "";
        items.push({
          id: `mod-${m.id}`,
          category: "module",
          badge: `HỌC PHẦN ${String(m.id).padStart(2, "0")}`,
          icon: "📘",
          title: isEn ? `Module ${m.id}: ${m.title}` : `Học phần ${m.id}: ${m.title_vi || m.title}`,
          subtitle: (m.overview_vi || m.overview || "").substring(0, 110),
          searchBlob: normalizeText(`module ${m.id} hoc phan ${m.id} ${m.title} ${m.title_vi} ${m.overview_vi} ${conceptsText} ${tableText}`),
          run: () => {
            if (typeof setActiveModeTab === "function") setActiveModeTab("modules");
            if (typeof selectModule === "function") selectModule(m.id);
            flashElement("#module-detail .module-header");
          }
        });
      });
    }

    // 2. 35 Packet Tracer Labs
    if (typeof PACKET_TRACER_LABS !== "undefined" && Array.isArray(PACKET_TRACER_LABS)) {
      PACKET_TRACER_LABS.forEach((lab) => {
        const ipBlob = (lab.ipTable || []).flat().join(" ");
        const cliBlob = (lab.cli_commands || []).join(" ");
        items.push({
          id: `lab-${lab.id}`,
          category: "lab",
          badge: `LAB ${String(lab.id).padStart(2, "0")} • ${lab.level || ""}`,
          icon: "🧪",
          title: isEn ? (lab.title_en || lab.title_vi) : lab.title_vi,
          subtitle: (lab.objective_vi || "").substring(0, 110),
          searchBlob: normalizeText(`lab ${lab.id} ${lab.title_vi} ${lab.title_en || ""} ${lab.objective_vi} ${ipBlob} ${cliBlob}`),
          run: () => {
            if (typeof setActiveModeTab === "function") setActiveModeTab("labs");
            if (typeof activeLabId !== "undefined") activeLabId = lab.id;
            if (typeof renderLabsView === "function") renderLabsView(lab.id);
            if (typeof filterAndRenderSidebar === "function") filterAndRenderSidebar();
            flashElement(`#pt-lab-${lab.id}`);
          }
        });
      });
    }

    // 3. 10 Exam Mastery Domains
    if (typeof CCNA_EXAM_MASTERY !== "undefined" && Array.isArray(CCNA_EXAM_MASTERY)) {
      CCNA_EXAM_MASTERY.forEach((dom) => {
        items.push({
          id: `mastery-${dom.id}`,
          category: "mastery",
          badge: `CHUYÊN ĐỀ ${String(dom.id).padStart(2, "0")}`,
          icon: "🏢",
          title: dom.title_vi || dom.title || `Chuyên đề ${dom.id}`,
          subtitle: (dom.subtitle_vi || dom.examWeight || "").substring(0, 110),
          searchBlob: normalizeText(`chuyen de ${dom.id} mastery ${dom.id} ${dom.title_vi} ${dom.subtitle_vi} ${dom.examWeight || ""}`),
          run: () => {
            if (typeof setActiveModeTab === "function") setActiveModeTab("mastery");
            if (typeof activeMasteryId !== "undefined") activeMasteryId = dom.id;
            if (typeof renderMasteryView === "function") renderMasteryView(dom.id);
            if (typeof filterAndRenderSidebar === "function") filterAndRenderSidebar();
            flashElement("#module-detail .module-header");
          }
        });
      });
    }

    // 4. 120+ Cisco IOS CLI Cheat Sheet Commands
    if (typeof CCNA_CLI_CHEATSHEET !== "undefined" && Array.isArray(CCNA_CLI_CHEATSHEET)) {
      CCNA_CLI_CHEATSHEET.forEach((cat) => {
        (cat.commands || []).forEach((c, idx) => {
          items.push({
            id: `cli-${cat.category}-${idx}`,
            category: "cli",
            badge: `IOS CLI • ${cat.category}`,
            icon: "⌨️",
            title: c.cmd,
            subtitle: c.desc_vi || c.desc || "",
            searchBlob: normalizeText(`${c.cmd} ${c.desc_vi || ""} ${c.desc || ""} ${cat.category}`),
            run: () => {
              if (typeof openCheatSheetModal === "function") {
                openCheatSheetModal("commands");
                setTimeout(() => {
                  const inp = document.getElementById("cs-main-search-input");
                  if (inp) {
                    inp.value = c.cmd.split(" ")[0];
                    inp.dispatchEvent(new Event("input", { bubbles: true }));
                  }
                }, 80);
              }
            }
          });
        });
      });
    }

    // 5. Deep Technical Glossary
    if (typeof MODULE_DEEP_GLOSSARY !== "undefined" && MODULE_DEEP_GLOSSARY) {
      Object.keys(MODULE_DEEP_GLOSSARY).forEach((modKey) => {
        const list = MODULE_DEEP_GLOSSARY[modKey];
        if (!Array.isArray(list)) return;
        list.forEach((g, idx) => {
          items.push({
            id: `gloss-${modKey}-${idx}`,
            category: "glossary",
            badge: `THUẬT NGỮ • M${modKey}`,
            icon: "📖",
            title: g.term || g.en || "",
            subtitle: (g.vi || g.meaning || g.detail || "").substring(0, 110),
            searchBlob: normalizeText(`${g.term || ""} ${g.en || ""} ${g.vi || ""} ${g.meaning || ""} ${g.detail || ""}`),
            run: () => {
              const modNum = parseInt(modKey, 10);
              if (!isNaN(modNum) && typeof selectModule === "function") {
                if (typeof setActiveModeTab === "function") setActiveModeTab("modules");
                selectModule(modNum);
                setTimeout(() => flashElement("#sec-glossary"), 150);
              }
            }
          });
        });
      });
    }

    // 6. Personal Notes & Highlights (workspaceDB)
    if (window.CCNA_WORKSPACE && typeof window.CCNA_WORKSPACE.getWorkspaceDB === "function") {
      const db = window.CCNA_WORKSPACE.getWorkspaceDB();
      (db.notes || []).filter((n) => !n.deletedAt).forEach((n) => {
        items.push({
          id: `note-${n.id}`,
          category: "workspace",
          badge: "📝 GHI CHÚ",
          icon: "📝",
          title: n.title || n.lessonTitle || "Ghi chú cá nhân",
          subtitle: (n.content || "").substring(0, 110),
          searchBlob: normalizeText(`${n.title || ""} ${n.lessonTitle || ""} ${n.content || ""} ${(n.tags || []).join(" ")}`),
          run: () => {
            if (window.CCNA_WORKSPACE && typeof window.CCNA_WORKSPACE.navigateToLessonAndHighlight === "function") {
              window.CCNA_WORKSPACE.navigateToLessonAndHighlight(n.lessonKey || "module-1", n.highlightId || "");
            } else if (typeof openNotesModal === "function") {
              openNotesModal("all");
            }
          }
        });
      });

      (db.highlights || []).filter((h) => !h.deletedAt).forEach((h) => {
        items.push({
          id: `hl-${h.id}`,
          category: "workspace",
          badge: "🖍️ HIGHLIGHT",
          icon: "🖍️",
          title: (h.quote || h.text || "").substring(0, 80),
          subtitle: `Bài học: ${h.lessonTitle || h.lessonKey || ""}`,
          searchBlob: normalizeText(`${h.quote || h.text || ""} ${h.lessonTitle || ""} ${h.lessonKey || ""}`),
          run: () => {
            if (window.CCNA_WORKSPACE && typeof window.CCNA_WORKSPACE.navigateToLessonAndHighlight === "function") {
              window.CCNA_WORKSPACE.navigateToLessonAndHighlight(h.lessonKey || "module-1", h.id);
            }
          }
        });
      });
    }

    paletteIndex = items;
    indexBuiltAt = now;
    return paletteIndex;
  }

  function flashElement(selector) {
    setTimeout(() => {
      const el = document.querySelector(selector);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("cmd-jump-highlight");
      setTimeout(() => el.classList.remove("cmd-jump-highlight"), 2000);
    }, 120);
  }

  function scoreMatch(item, queryNorm, tokens) {
    if (!queryNorm) {
      return item.category === "action" ? 100 : item.category === "module" ? 60 : 30;
    }
    const titleNorm = normalizeText(item.title);
    let score = 0;

    if (titleNorm === queryNorm) score += 200;
    else if (titleNorm.startsWith(queryNorm)) score += 140;
    else if (titleNorm.includes(queryNorm)) score += 100;
    else if (item.searchBlob.includes(queryNorm)) score += 65;

    let allTokensMatched = true;
    for (const tok of tokens) {
      if (titleNorm.includes(tok)) score += 35;
      else if (item.searchBlob.includes(tok)) score += 15;
      else {
        allTokensMatched = false;
        break;
      }
    }

    if (!allTokensMatched && score < 65) return 0;
    if (item.category === "action") score += 15;
    if (item.category === "workspace") score += 10;
    return score;
  }

  function runSearch(queryStr) {
    const t0 = performance.now();
    const all = buildOmniSearchIndex();
    const queryNorm = normalizeText(queryStr).trim();
    const tokens = queryNorm ? queryNorm.split(/\s+/).filter(Boolean) : [];

    const scored = [];
    for (let i = 0; i < all.length; i++) {
      const it = all[i];
      if (activeCategoryFilter !== "all" && it.category !== activeCategoryFilter) continue;
      const sc = scoreMatch(it, queryNorm, tokens);
      if (sc > 0) scored.push({ item: it, score: sc });
    }

    scored.sort((a, b) => b.score - a.score);
    filteredItems = scored.slice(0, 40).map((s) => s.item);
    selectedIdx = 0;

    const elapsed = (performance.now() - t0).toFixed(1);
    renderPaletteResults(elapsed, queryStr);
  }

  function ensurePaletteDom() {
    if (document.getElementById("cmd-palette-modal")) return;

    const paletteHtml = `
      <div class="cmd-palette-modal" id="cmd-palette-modal" role="dialog" aria-modal="true" aria-label="Tìm kiếm toàn hệ thống Command Palette" hidden>
        <div class="cmd-palette-backdrop" id="cmd-palette-backdrop"></div>
        <div class="cmd-palette-box">
          <div class="cmd-palette-input-row">
            <svg class="cmd-search-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" id="cmd-palette-input" class="cmd-palette-input" placeholder="Tìm 17 Học phần, 35 Lab, 120+ lệnh CLI, Thuật ngữ, Ghi chú hoặc Hành động..." autocomplete="off" />
            <kbd class="cmd-kbd">ESC</kbd>
          </div>
          <div class="cmd-palette-filters" id="cmd-palette-filters">
            <button type="button" class="cmd-filter-pill active" data-cat="all">Tất cả (7 nguồn)</button>
            <button type="button" class="cmd-filter-pill" data-cat="module">📘 Học phần</button>
            <button type="button" class="cmd-filter-pill" data-cat="lab">🧪 35 Lab</button>
            <button type="button" class="cmd-filter-pill" data-cat="mastery">🏢 Chuyên đề</button>
            <button type="button" class="cmd-filter-pill" data-cat="cli">⌨️ CLI</button>
            <button type="button" class="cmd-filter-pill" data-cat="glossary">📖 Thuật ngữ</button>
            <button type="button" class="cmd-filter-pill" data-cat="workspace">📝 Ghi chú</button>
            <button type="button" class="cmd-filter-pill" data-cat="action">⚡ Công cụ</button>
          </div>
          <div class="cmd-palette-results" id="cmd-palette-results" role="listbox"></div>
          <footer class="cmd-palette-footer">
            <div class="cmd-footer-hints">
              <span><kbd>↑</kbd><kbd>↓</kbd> Di chuyển</span>
              <span><kbd>Enter</kbd> Mở ngay</span>
              <span><kbd>?</kbd> Phím tắt</span>
            </div>
            <span class="cmd-perf-badge" id="cmd-perf-badge">Ready</span>
          </footer>
        </div>
      </div>

      <div class="shortcuts-modal" id="shortcuts-modal" role="dialog" aria-modal="true" aria-label="Bảng phím tắt hệ thống" hidden>
        <div class="cmd-palette-backdrop" id="shortcuts-backdrop"></div>
        <div class="shortcuts-box">
          <header class="shortcuts-header">
            <h3>⌨️ Bảng Phím Tắt Hệ Thống (Keyboard Shortcuts)</h3>
            <button type="button" class="shortcuts-close-btn" id="shortcuts-close-btn" aria-label="Đóng">✕</button>
          </header>
          <div class="shortcuts-grid">
            <div class="shortcut-row"><span>Mở Omni-Search Command Palette</span><span><kbd>Ctrl</kbd> + <kbd>K</kbd></span></div>
            <div class="shortcut-row"><span>Thu gọn / Mở rộng thanh mục lục trái</span><span><kbd>Ctrl</kbd> + <kbd>B</kbd></span></div>
            <div class="shortcut-row"><span>Mở / Đóng Sổ tay Ghi chú</span><span><kbd>Alt</kbd> + <kbd>N</kbd></span></div>
            <div class="shortcut-row"><span>Mở Trợ lý AI Cisco (Streaming)</span><span><kbd>Alt</kbd> + <kbd>A</kbd></span></div>
            <div class="shortcut-row"><span>Mở Máy tính Subnet &amp; VLSM</span><span><kbd>Alt</kbd> + <kbd>S</kbd></span></div>
            <div class="shortcut-row"><span>Mở Trình giả lập Cisco IOS CLI</span><span><kbd>Alt</kbd> + <kbd>T</kbd></span></div>
            <div class="shortcut-row"><span>Lật thẻ Flashcard (khi đang mở)</span><span><kbd>Space</kbd></span></div>
            <div class="shortcut-row"><span>Đánh giá SM-2 (Again / Hard / Good / Easy)</span><span><kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd></span></div>
            <div class="shortcut-row"><span>Đóng hộp thoại đang mở</span><span><kbd>Esc</kbd></span></div>
            <div class="shortcut-row"><span>Mở bảng phím tắt này</span><span><kbd>?</kbd></span></div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", paletteHtml);

    const inputEl = document.getElementById("cmd-palette-input");
    const backdropEl = document.getElementById("cmd-palette-backdrop");
    const filtersEl = document.getElementById("cmd-palette-filters");

    if (backdropEl) backdropEl.addEventListener("click", closeCommandPalette);
    if (inputEl) {
      inputEl.addEventListener("input", () => runSearch(inputEl.value));
      inputEl.addEventListener("keydown", handlePaletteKeydown);
    }

    if (filtersEl) {
      filtersEl.addEventListener("click", (e) => {
        const btn = e.target.closest(".cmd-filter-pill");
        if (!btn) return;
        activeCategoryFilter = btn.dataset.cat || "all";
        filtersEl.querySelectorAll(".cmd-filter-pill").forEach((b) => b.classList.toggle("active", b === btn));
        runSearch(inputEl ? inputEl.value : "");
        if (inputEl) inputEl.focus();
      });
    }

    document.getElementById("shortcuts-backdrop")?.addEventListener("click", closeShortcutsModal);
    document.getElementById("shortcuts-close-btn")?.addEventListener("click", closeShortcutsModal);
  }

  function renderPaletteResults(elapsedMs, queryStr) {
    const listEl = document.getElementById("cmd-palette-results");
    const perfEl = document.getElementById("cmd-perf-badge");
    if (!listEl) return;

    if (perfEl) {
      perfEl.textContent = `${filteredItems.length} kết quả • ${elapsedMs} ms`;
    }

    if (filteredItems.length === 0) {
      listEl.innerHTML = `<div class="cmd-empty-state">Không tìm thấy kết quả cho "<strong>${escHtml(queryStr)}</strong>". Thử từ khóa khác như <code>ospf</code>, <code>vlan</code>, <code>subnet</code>, <code>lab 10</code>...</div>`;
      return;
    }

    listEl.innerHTML = filteredItems
      .map(
        (it, idx) => `
        <div class="cmd-result-item ${idx === selectedIdx ? "active" : ""}" data-idx="${idx}" role="option" aria-selected="${idx === selectedIdx}">
          <span class="cmd-item-icon">${it.icon}</span>
          <div class="cmd-item-main">
            <div class="cmd-item-title">${escHtml(it.title)}</div>
            <div class="cmd-item-sub">${escHtml(it.subtitle)}</div>
          </div>
          <span class="cmd-item-badge cat-${it.category}">${escHtml(it.badge)}</span>
        </div>
      `
      )
      .join("");

    listEl.querySelectorAll(".cmd-result-item").forEach((row) => {
      row.addEventListener("click", () => {
        const idx = parseInt(row.dataset.idx, 10);
        executeItem(idx);
      });
      row.addEventListener("mouseenter", () => {
        selectedIdx = parseInt(row.dataset.idx, 10);
        updateActiveHighlight();
      });
    });
  }

  function updateActiveHighlight() {
    const rows = document.querySelectorAll("#cmd-palette-results .cmd-result-item");
    rows.forEach((r, i) => {
      const isActive = i === selectedIdx;
      r.classList.toggle("active", isActive);
      r.setAttribute("aria-selected", isActive ? "true" : "false");
      if (isActive) r.scrollIntoView({ block: "nearest" });
    });
  }

  function executeItem(idx) {
    const it = filteredItems[idx];
    if (!it) return;
    closeCommandPalette();
    try {
      if (typeof it.run === "function") it.run();
    } catch (err) {
      console.error("Command palette action error:", err);
    }
  }

  function handlePaletteKeydown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredItems.length > 0) {
        selectedIdx = (selectedIdx + 1) % filteredItems.length;
        updateActiveHighlight();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredItems.length > 0) {
        selectedIdx = (selectedIdx - 1 + filteredItems.length) % filteredItems.length;
        updateActiveHighlight();
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      executeItem(selectedIdx);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeCommandPalette();
    }
  }

  function openCommandPalette(initialQuery = "") {
    ensurePaletteDom();
    buildOmniSearchIndex(true);
    const modal = document.getElementById("cmd-palette-modal");
    const input = document.getElementById("cmd-palette-input");
    if (!modal) return;
    modal.hidden = false;
    isPaletteOpen = true;
    activeCategoryFilter = "all";
    document.querySelectorAll("#cmd-palette-filters .cmd-filter-pill").forEach((b) => {
      b.classList.toggle("active", b.dataset.cat === "all");
    });
    if (input) {
      input.value = initialQuery;
      setTimeout(() => input.focus(), 20);
    }
    runSearch(initialQuery);
  }

  function closeCommandPalette() {
    const modal = document.getElementById("cmd-palette-modal");
    if (modal) modal.hidden = true;
    isPaletteOpen = false;
  }

  function openShortcutsModal() {
    ensurePaletteDom();
    const modal = document.getElementById("shortcuts-modal");
    if (modal) {
      modal.hidden = false;
      isShortcutsOpen = true;
    }
  }

  function closeShortcutsModal() {
    const modal = document.getElementById("shortcuts-modal");
    if (modal) {
      modal.hidden = true;
      isShortcutsOpen = false;
    }
  }

  function bindGlobalKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      const tag = (e.target && e.target.tagName) || "";
      const isTyping = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target && e.target.isContentEditable);

      if (isCtrlOrMeta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isPaletteOpen) closeCommandPalette();
        else openCommandPalette("");
        return;
      }

      if (e.key === "Escape") {
        if (isPaletteOpen) closeCommandPalette();
        if (isShortcutsOpen) closeShortcutsModal();
        return;
      }

      if (e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (typeof window.openSubnetToolkitModal === "function") window.openSubnetToolkitModal();
        return;
      }

      if (e.altKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        if (typeof window.openStandaloneIosTerminal === "function") window.openStandaloneIosTerminal();
        return;
      }

      if (!isTyping && !isCtrlOrMeta && !e.altKey && e.key === "?") {
        e.preventDefault();
        if (isShortcutsOpen) closeShortcutsModal();
        else openShortcutsModal();
      }
    });
  }

  function initCommandPalette() {
    ensurePaletteDom();
    bindGlobalKeyboardShortcuts();
    const triggerBtn = document.getElementById("open-cmd-palette-btn");
    if (triggerBtn) {
      triggerBtn.addEventListener("click", () => openCommandPalette(""));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCommandPalette);
  } else {
    initCommandPalette();
  }

  window.openCommandPalette = openCommandPalette;
  window.closeCommandPalette = closeCommandPalette;
  window.openShortcutsModal = openShortcutsModal;
  window.closeShortcutsModal = closeShortcutsModal;
})();
