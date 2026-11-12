// CCNA 200-301 Toàn Diện — 17 Học Phần Chi Tiết, 10 Chuyên Đề Thi & Đi Làm, 35 Bài Lab Cisco Packet Tracer
let modulesData = [];
let activeModuleId = 1;
let activeLabId = 0; // 0 = show all 35 labs, 1..35 = show specific lab
let activeMasteryId = 0; // 0 = show all 10 mastery domains, 1..10 = show specific domain
let currentLang = "vi"; // "vi" | "en" | "both"
let currentMode = "modules"; // "modules" | "labs" | "mastery"

// State Management for Study Tools, Themes, Sidebar, Progress & Notes
let completedItems = {};
try {
  completedItems = JSON.parse(localStorage.getItem("ccna_completed_items") || "{}");
} catch {
  completedItems = {};
}

let studyNotes = {};
try {
  studyNotes = JSON.parse(localStorage.getItem("ccna_study_notes") || "{}");
} catch {
  studyNotes = {};
}

let cloudSyncKey = localStorage.getItem("ccna_cloud_sync_key") || "";
if (!cloudSyncKey) {
  cloudSyncKey = "ccna-" + Math.random().toString(36).substring(2, 8) + Date.now().toString(36).slice(-4);
  localStorage.setItem("ccna_cloud_sync_key", cloudSyncKey);
}
let currentTheme = localStorage.getItem("ccna_theme") || "light";
let currentFontSize = parseFloat(localStorage.getItem("ccna_font_size") || "16.5");
let isSidebarCollapsed = localStorage.getItem("ccna_sidebar_collapsed") === "true";

// DOM Elements
const moduleListEl = document.getElementById("module-list");
const moduleDetailEl = document.getElementById("module-detail");
const searchInputEl = document.getElementById("module-search");
const searchClearBtn = document.getElementById("search-clear-btn");
const appTitleEl = document.getElementById("app-title");
const langButtons = document.querySelectorAll(".lang-btn");
const tabModulesBtn = document.getElementById("tab-modules-btn");
const tabLabsBtn = document.getElementById("tab-labs-btn");
const tabMasteryBtn = document.getElementById("tab-mastery-btn");

// Topbar & Layout DOM Elements
const appTopbar = document.getElementById("app-topbar");
const topbarBreadcrumb = document.getElementById("topbar-breadcrumb");
const sidebarToggleBtn = document.getElementById("sidebar-toggle-btn");
const sidebarCollapseBtn = document.getElementById("sidebar-collapse-btn");
const floatingExpandBtn = document.getElementById("floating-expand-btn");
const studyProgressPill = document.getElementById("study-progress-pill");
const progressPillText = document.getElementById("progress-pill-text");
const progressMiniFill = document.getElementById("progress-mini-fill");
const readingProgressBar = document.getElementById("reading-progress-bar");
const themeSwitchBtn = document.getElementById("theme-switch-btn");
const themeIcon = document.getElementById("theme-icon");
const fontDecreaseBtn = document.getElementById("font-decrease-btn");
const fontResetBtn = document.getElementById("font-reset-btn");
const fontIncreaseBtn = document.getElementById("font-increase-btn");
const brandHomeLink = document.getElementById("brand-home-link");

// Notes Modal & FAB Elements
const openNotesBtn = document.getElementById("open-notes-btn");
const floatingNoteFab = document.getElementById("floating-note-fab");
const notesCountBadge = document.getElementById("notes-count-badge");
const fabNoteBadge = document.getElementById("fab-note-badge");
const notesModal = document.getElementById("notes-modal");
const notesBackdrop = document.getElementById("notes-backdrop");
const notesCloseBtn = document.getElementById("notes-close-btn");
const cloudSyncStatusBadge = document.getElementById("cloud-sync-status-badge");
const cloudSyncStatusText = document.getElementById("cloud-sync-status-text");

// Note Tabs & Panels
const noteTabCurrentBtn = document.getElementById("note-tab-current-btn");
const noteTabAllBtn = document.getElementById("note-tab-all-btn");
const noteTabSyncBtn = document.getElementById("note-tab-sync-btn");
const notesTabCounter = document.getElementById("notes-tab-counter");
const panelCurrent = document.getElementById("panel-current");
const panelAll = document.getElementById("panel-all");
const panelSync = document.getElementById("panel-sync");

// Note Editor Elements
const noteLessonTitle = document.getElementById("note-lesson-title");
const noteTitleInput = document.getElementById("note-title-input");
const noteContentInput = document.getElementById("note-content-input");
const noteSaveStatusText = document.getElementById("note-save-status-text");
const noteSaveTimestamp = document.getElementById("note-save-timestamp");
const noteDeleteCurrentBtn = document.getElementById("note-delete-current-btn");
const noteSaveManualBtn = document.getElementById("note-save-manual-btn");
const noteTagPills = document.querySelectorAll(".note-tag-pill");
let activeNoteTag = "exam";

// Formatting Toolbar Elements
const toolBoldBtn = document.getElementById("tool-bold-btn");
const toolItalicBtn = document.getElementById("tool-italic-btn");
const toolCodeBtn = document.getElementById("tool-code-btn");
const toolListBtn = document.getElementById("tool-list-btn");
const toolInsertCliBtn = document.getElementById("tool-insert-cli-btn");

// All Notes List Elements
const allNotesSearchInput = document.getElementById("all-notes-search-input");
const allNotesList = document.getElementById("all-notes-list");
const allNotesTotalLabel = document.getElementById("all-notes-total-label");

// Cloud Sync Elements
const cloudSyncKeyDisplay = document.getElementById("cloud-sync-key-display");
const syncCopyKeyBtn = document.getElementById("sync-copy-key-btn");
const syncNowBtn = document.getElementById("sync-now-btn");
const syncCopyLinkBtn = document.getElementById("sync-copy-link-btn");
const cloudSyncKeyInput = document.getElementById("cloud-sync-key-input");
const syncConnectKeyBtn = document.getElementById("sync-connect-key-btn");
const syncQrCodeImg = document.getElementById("sync-qr-code-img");
const backupExportBtn = document.getElementById("backup-export-btn");
const backupImportFile = document.getElementById("backup-import-file");

// Debounce timer for auto-save and auto-sync
let noteSaveDebounceTimer = null;
let cloudSyncDebounceTimer = null;

// ============================================================
// Secure Access Gateway (SHA-256 Auth & Anti-Scraping Shield)
// ============================================================
const AUTH_HASH_TARGET = "04e7ca8de21d616b80eaa340a06f7ffceb6a3ca22425cbf813b0fb09a4a7f783";
const AUTH_SALT = "ccna_auth_v1_2026";

async function hashCredentials(username, password) {
  const raw = `${username.trim().toLowerCase()}:${password}::${AUTH_SALT}`;
  const enc = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", enc.encode(raw));
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function checkCurrentAuth() {
  const s = sessionStorage.getItem("ccna_auth_session");
  const l = localStorage.getItem("ccna_auth_session");
  return (s === AUTH_HASH_TARGET || l === AUTH_HASH_TARGET);
}

function initSecurityAndAuth() {
  const loginOverlay = document.getElementById("login-overlay");
  const loginForm = document.getElementById("login-form");
  const loginUser = document.getElementById("login-username");
  const loginPass = document.getElementById("login-password");
  const loginPwdToggle = document.getElementById("login-pwd-toggle");
  const loginRemember = document.getElementById("login-remember");
  const loginErrorMsg = document.getElementById("login-error-msg");
  const topbarLogoutBtn = document.getElementById("topbar-logout-btn");

  if (checkCurrentAuth()) {
    document.body.classList.remove("not-authenticated");
    if (loginOverlay) loginOverlay.style.display = "none";
  } else {
    document.body.classList.add("not-authenticated");
    if (loginOverlay) loginOverlay.style.display = "flex";
  }

  if (loginPwdToggle && loginPass) {
    loginPwdToggle.addEventListener("click", () => {
      const isPwd = loginPass.type === "password";
      loginPass.type = isPwd ? "text" : "password";
      loginPwdToggle.textContent = isPwd ? "🙈" : "👁️";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const u = loginUser ? loginUser.value : "";
      const p = loginPass ? loginPass.value : "";

      if (!u || !p) {
        if (loginErrorMsg) {
          loginErrorMsg.textContent = currentLang === "en"
            ? "Please enter username and password."
            : "Vui lòng nhập tài khoản và mật khẩu.";
          loginErrorMsg.hidden = false;
        }
        return;
      }

      try {
        const computed = await hashCredentials(u, p);
        if (computed === AUTH_HASH_TARGET) {
          sessionStorage.setItem("ccna_auth_session", AUTH_HASH_TARGET);
          if (loginRemember && loginRemember.checked) {
            localStorage.setItem("ccna_auth_session", AUTH_HASH_TARGET);
          } else {
            localStorage.removeItem("ccna_auth_session");
          }
          if (loginErrorMsg) loginErrorMsg.hidden = true;
          document.body.classList.remove("not-authenticated");
          if (loginOverlay) {
            loginOverlay.style.opacity = "0";
            setTimeout(() => {
              loginOverlay.style.display = "none";
              loginOverlay.style.opacity = "1";
            }, 250);
          }
        } else {
          if (loginErrorMsg) {
            loginErrorMsg.textContent = currentLang === "en"
              ? "Invalid username or password."
              : "Tài khoản hoặc mật khẩu không đúng.";
            loginErrorMsg.hidden = false;
          }
          if (loginPass) {
            loginPass.value = "";
            loginPass.focus();
          }
        }
      } catch (err) {
        if (loginErrorMsg) {
          loginErrorMsg.textContent = "Lỗi xác thực hệ thống: " + err.message;
          loginErrorMsg.hidden = false;
        }
      }
    });
  }

  if (topbarLogoutBtn) {
    topbarLogoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("ccna_auth_session");
      localStorage.removeItem("ccna_auth_session");
      document.body.classList.add("not-authenticated");
      if (loginOverlay) {
        loginOverlay.style.display = "flex";
        loginOverlay.style.opacity = "1";
      }
      if (loginPass) loginPass.value = "";
      if (loginErrorMsg) loginErrorMsg.hidden = true;
      if (loginUser) loginUser.focus();
    });
  }

  // Anti-scraping safeguards
  try {
    if (window.top !== window.self) {
      window.top.location = window.self.location;
    }
  } catch (e) {}

  document.addEventListener("contextmenu", (e) => {
    const tag = e.target.tagName;
    if (tag !== "INPUT" && tag !== "TEXTAREA") {
      e.preventDefault();
    }
  });

  document.addEventListener("keydown", (e) => {
    const isCtrlOrMeta = e.ctrlKey || e.metaKey;
    if (isCtrlOrMeta) {
      const k = e.key.toLowerCase();
      if (k === "s" || k === "u" || k === "p") {
        e.preventDefault();
      }
    }
  });
}

async function initApp() {
  initSecurityAndAuth();
  applyTheme(currentTheme);
  applyFontSize(currentFontSize);
  applySidebarCollapsedState(isSidebarCollapsed);

  initSyncKey();
  checkUrlForSyncParam();

  try {
    const response = await fetch("ccna_data.json?v=20261111_v8");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    modulesData = await response.json();
    renderAll();
  } catch (error) {
    if (typeof FALLBACK_CCNA_DATA !== "undefined" && Array.isArray(FALLBACK_CCNA_DATA)) {
      modulesData = FALLBACK_CCNA_DATA;
      renderAll();
      return;
    }
    moduleDetailEl.innerHTML = `
      <div class="section-block">
        <h2 class="section-title">Không thể tải dữ liệu</h2>
        <p class="overview-text">${escapeHtml(error.message)}</p>
      </div>
    `;
  }

  // Initial cloud sync pull in background if key is present
  if (cloudSyncKey) {
    pullNotesFromCloud(cloudSyncKey, true);
  }

  initNotesSystem();
  initNotesResizer();
  initZenMode();
  initTextSelectionHighlighter();
  initFlashcardsSystem();
  updateProgressSummary();
  updateNotesCountBadges();
}

function renderAll() {
  document.documentElement.lang = currentLang === "en" ? "en" : "vi";
  updateHeaderLabels();
  filterAndRenderSidebar();
  updateProgressSummary();
  updateTopbarBreadcrumb();

  if (currentMode === "labs") {
    renderLabsView(activeLabId);
  } else if (currentMode === "mastery") {
    renderMasteryView(activeMasteryId);
  } else if (modulesData.length > 0) {
    selectModule(activeModuleId);
  }
}

function updateHeaderLabels() {
  const isEn = currentLang === "en";
  if (isEn) {
    if (appTitleEl) appTitleEl.textContent = "CCNA 200-301 Curriculum";
    if (searchInputEl) searchInputEl.placeholder = "Filter lessons, CLI, labs...";
    if (tabModulesBtn) tabModulesBtn.innerHTML = `<span class="tab-label">Modules</span><span class="tab-pill">17</span>`;
    if (tabLabsBtn) tabLabsBtn.innerHTML = `<span class="tab-label">Labs</span><span class="tab-pill">35</span>`;
    if (tabMasteryBtn) tabMasteryBtn.innerHTML = `<span class="tab-label">Mastery</span><span class="tab-pill">10</span>`;
  } else {
    if (appTitleEl) appTitleEl.textContent = "Chương trình CCNA 200-301";
    if (searchInputEl) searchInputEl.placeholder = "Lọc bài học, lệnh CLI, từ khóa...";
    if (tabModulesBtn) tabModulesBtn.innerHTML = `<span class="tab-label">Lý thuyết</span><span class="tab-pill">17</span>`;
    if (tabLabsBtn) tabLabsBtn.innerHTML = `<span class="tab-label">Bài Lab</span><span class="tab-pill">35</span>`;
    if (tabMasteryBtn) tabMasteryBtn.innerHTML = `<span class="tab-label">Chuyên đề</span><span class="tab-pill">10</span>`;
  }

  const notesBtnText = document.querySelector("#open-notes-btn .btn-text");
  if (notesBtnText) notesBtnText.textContent = isEn ? "Notes" : "Ghi chú";
  const flashcardBtnText = document.querySelector("#open-flashcards-btn .btn-text");
  if (flashcardBtnText) flashcardBtnText.textContent = isEn ? "Flashcards" : "Flashcard";
  const zenBtnText = document.querySelector("#zen-mode-btn .btn-text");
  if (zenBtnText) zenBtnText.textContent = isEn ? "Zen Mode" : "Tập trung";

  // Flashcard modal controls translation
  const flashcardBadge = document.getElementById("flashcard-badge-label");
  if (flashcardBadge) flashcardBadge.textContent = isEn ? "FLASHCARD STUDY DECK" : "FLASHCARDS ÔN TẬP";
  const shuffleLabel = document.getElementById("flashcard-shuffle-label");
  if (shuffleLabel) shuffleLabel.textContent = isEn ? "Shuffle" : "Trộn thẻ";

  const scopeSelect = document.getElementById("flashcard-scope-select");
  if (scopeSelect) {
    const curVal = scopeSelect.value;
    scopeSelect.innerHTML = isEn
      ? `<option value="current">Current Module</option><option value="all">All 17 CCNA Modules (400+ Cards)</option>`
      : `<option value="current">Bài học hiện tại</option><option value="all">Toàn bộ 17 Học phần CCNA (400+ Thẻ)</option>`;
    scopeSelect.value = curVal || "current";
  }

  const catSelect = document.getElementById("flashcard-category-select");
  if (catSelect) {
    const curVal = catSelect.value;
    catSelect.innerHTML = isEn
      ? `<option value="all">All Card Types</option><option value="cli">Cisco IOS CLI Commands</option><option value="quiz">CCNA Exam Quizzes</option><option value="concepts">Concepts &amp; Glossary</option><option value="skills">Field Skills &amp; Issues</option>`
      : `<option value="all">Tất cả dạng thẻ</option><option value="cli">Lệnh Cisco IOS CLI</option><option value="quiz">Trắc nghiệm thi CCNA</option><option value="concepts">Khái niệm &amp; Thuật ngữ</option><option value="skills">Thực chiến &amp; Sự cố</option>`;
    catSelect.value = curVal || "all";
  }

  const prevBtn = document.getElementById("flashcard-prev-btn");
  if (prevBtn) prevBtn.textContent = isEn ? "← Previous" : "← Thẻ trước";
  const flipBtn = document.getElementById("flashcard-flip-btn");
  if (flipBtn) flipBtn.textContent = isEn ? "Flip (Space)" : "Lật thẻ (Space)";
  const nextBtn = document.getElementById("flashcard-next-btn");
  if (nextBtn) nextBtn.textContent = isEn ? "Next →" : "Thẻ tiếp →";
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatRichText(str) {
  let html = escapeHtml(str);
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return html;
}

function formatCliCommands(commands) {
  return commands
    .map((line) => {
      const commentMatch = line.match(/^(.+?\s)(#\s.*)$/);
      if (commentMatch) {
        if (currentLang === "en") {
          return `<span class="cli-cmd">${escapeHtml(commentMatch[1].trimEnd())}</span>`;
        }
        return `<span class="cli-cmd">${escapeHtml(commentMatch[1])}</span><span class="cli-comment">${escapeHtml(commentMatch[2])}</span>`;
      }
      return `<span class="cli-cmd">${escapeHtml(line)}</span>`;
    })
    .join("\n");
}

// Build a single Cisco Packet Tracer Lab HTML Card
function renderSinglePacketTracerLabCard(lab) {
  const isEn = currentLang === "en";
  const svgDiagram =
    typeof renderPacketTracerTopologySvg === "function"
      ? `<div class="svg-diagram-wrapper">${renderPacketTracerTopologySvg(lab)}</div>`
      : "";

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
              <th>${isEn ? "Device" : "Thiết bị (Device)"}</th>
              <th>${isEn ? "Interface" : "Cổng nối (Interface)"}</th>
              <th>${isEn ? "IP Address" : "Địa chỉ IP (IP Address)"}</th>
              <th>${isEn ? "Subnet Mask / Prefix" : "Subnet Mask / Prefix"}</th>
              <th>${isEn ? "Default Gateway / Notes" : "Gateway / Ghi chú"}</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `;
  }

  const stepsList = isEn && lab.steps_en && lab.steps_en.length > 0 ? lab.steps_en : (lab.steps_vi || []);
  const stepsHtml = stepsList
    .map((s) => `<li class="pt-step-item">${formatRichText(s)}</li>`)
    .join("");

  const cliHtml =
    lab.cli_commands && lab.cli_commands.length > 0
      ? `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.45rem;">
          <strong style="font-size:0.88rem;color:#0f172a;">${isEn ? "Configuration &amp; Verification Commands (CLI):" : "Tập lệnh cấu hình &amp; Kiểm tra (CLI):"}</strong>
        </div>
        <pre class="cli-block"><code>${formatCliCommands(lab.cli_commands)}</code></pre>
      </div>
    `
      : "";

  const title = isEn ? (lab.title_en || lab.title_vi.replace(/^Lab \d+:\s*/, "")) : lab.title_vi;
  const objective = isEn ? (lab.objective_en || lab.objective_vi) : lab.objective_vi;
  const verify = isEn ? (lab.verify_en || lab.verify_vi) : lab.verify_vi;

  return `
    <article class="pt-lab-card" id="pt-lab-${lab.id}">
      <div class="pt-lab-header">
        <div class="pt-lab-badges">
          <span class="pt-badge">${isEn ? `LAB ${String(lab.id).padStart(2, "0")} / 35` : `BÀI LAB ${String(lab.id).padStart(2, "0")} / 35`}</span>
          <span class="pt-badge">${isEn ? `MODULE ${lab.moduleId}` : `HỌC PHẦN ${lab.moduleId}`}</span>
          <span class="pt-badge pt-badge-level">${escapeHtml(lab.level)}</span>
        </div>
        <h4 class="pt-lab-title">${escapeHtml(title)}</h4>
      </div>
      <div class="pt-lab-body">
        <div class="pt-lab-objective">
          <strong>${isEn ? "Hands-On Objective:" : "Mục tiêu bài thực hành:"}</strong> ${formatRichText(objective)}
        </div>
        ${svgDiagram}
        ${ipTableHtml}
        <div>
          <strong style="display:block;margin-bottom:0.55rem;font-size:0.92rem;color:#0369a1;">
            ${isEn ? "Step-by-Step Hands-On Instructions:" : "Hướng dẫn thực hành trên Cisco Packet Tracer:"}
          </strong>
          <ul class="pt-steps-list">${stepsHtml}</ul>
        </div>
        ${cliHtml}
        <div class="pt-verify-box">
          <strong>${isEn ? "Acceptance &amp; Verification Criteria:" : "Tiêu chí nghiệm thu hoàn thành:"}</strong> ${formatRichText(verify)}
        </div>
      </div>
    </article>
  `;
}

// Render Sidebar for 17 Modules, 10 Exam/Job Mastery Domains, or 35 Packet Tracer Labs
function renderSidebar(items) {
  moduleListEl.innerHTML = "";

  const checkSvg = `
    <span class="module-check-icon" title="Đã hoàn thành">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6 9 17l-5-5"/>
      </svg>
    </span>
  `;

  if (currentMode === "mastery") {
    const isEn = currentLang === "en";
    const allLi = document.createElement("li");
    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = `module-item${activeMasteryId === 0 ? " active" : ""}`;
    allBtn.innerHTML = `
      <span class="module-num">ALL</span>
      <span class="module-name">
        ${isEn ? "All 10 Exam Mastery Topics" : "Toàn bộ 10 Chuyên đề tổng hợp"}
        <span class="module-name-sub">${isEn ? "CCNA v1.1 &amp; v2.0 Exam &amp; Production" : "Chuẩn đề thi v1.1 &amp; v2.0 và Thực tế"}</span>
      </span>
    `;
    allBtn.addEventListener("click", () => {
      activeMasteryId = 0;
      filterAndRenderSidebar();
      renderMasteryView(0);
      closeMobileSidebar();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    allLi.appendChild(allBtn);
    moduleListEl.appendChild(allLi);

    items.forEach((m) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      const isCompleted = !!completedItems["mastery-" + m.id];
      btn.className = `module-item${m.id === activeMasteryId ? " active" : ""}${isCompleted ? " completed" : ""}`;
      btn.innerHTML = `
        <span class="module-num">${String(m.id).padStart(2, "0")}</span>
        <span class="module-name">
          ${escapeHtml(isEn ? (m.title_en || m.title_vi) : m.title_vi)}
          <span class="module-name-sub">${escapeHtml(m.badge)}</span>
        </span>
        ${isCompleted ? checkSvg : ""}
      `;
      btn.addEventListener("click", () => {
        activeMasteryId = m.id;
        filterAndRenderSidebar();
        renderMasteryView(m.id);
        closeMobileSidebar();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      li.appendChild(btn);
      moduleListEl.appendChild(li);
    });
    return;
  }

  if (currentMode === "labs") {
    const isEn = currentLang === "en";
    // Top button: View All 35 Labs
    const allLi = document.createElement("li");
    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = `module-item${activeLabId === 0 ? " active" : ""}`;
    allBtn.innerHTML = `
      <span class="module-num">ALL</span>
      <span class="module-name">
        ${isEn ? "All 35 Cisco Hands-On Labs" : "Tất cả 35 bài thực hành Lab"}
        <span class="module-name-sub">Cisco Packet Tracer (Lab 01 &rarr; Lab 35)</span>
      </span>
    `;
    allBtn.addEventListener("click", () => {
      activeLabId = 0;
      filterAndRenderSidebar();
      renderLabsView(0);
      closeMobileSidebar();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    allLi.appendChild(allBtn);
    moduleListEl.appendChild(allLi);

    items.forEach((lab) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      const isCompleted = !!completedItems["lab-" + lab.id];
      btn.className = `module-item${lab.id === activeLabId ? " active" : ""}${isCompleted ? " completed" : ""}`;
      const labTitle = isEn ? (lab.title_en || lab.title_vi.replace(/^Lab \d+:\s*/, "")) : lab.title_vi.replace(/^Lab \d+:\s*/, "");
      btn.innerHTML = `
        <span class="module-num">${String(lab.id).padStart(2, "0")}</span>
        <span class="module-name">
          ${escapeHtml(labTitle)}
          <span class="module-name-sub">${isEn ? `Module ${lab.moduleId}` : `Học phần ${lab.moduleId}`} • ${escapeHtml(lab.level)}</span>
        </span>
        ${isCompleted ? checkSvg : ""}
      `;
      btn.addEventListener("click", () => {
        activeLabId = lab.id;
        filterAndRenderSidebar();
        renderLabsView(lab.id);
        closeMobileSidebar();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      li.appendChild(btn);
      moduleListEl.appendChild(li);
    });
    return;
  }

  if (items.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.className = "no-results";
    emptyLi.textContent =
      currentLang === "en" ? "No matching modules found." : "Không tìm thấy học phần phù hợp.";
    moduleListEl.appendChild(emptyLi);
    return;
  }

  items.forEach((mod) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    const isCompleted = !!completedItems["module-" + mod.id];
    btn.className = `module-item${mod.id === activeModuleId ? " active" : ""}${isCompleted ? " completed" : ""}`;
    btn.dataset.id = mod.id;

    const numSpan = document.createElement("span");
    numSpan.className = "module-num";
    numSpan.textContent = String(mod.id).padStart(2, "0");

    const titleWrap = document.createElement("span");
    titleWrap.className = "module-name";

    if (currentLang === "en") {
      titleWrap.textContent = mod.title;
    } else if (currentLang === "vi") {
      titleWrap.textContent = mod.title_vi || mod.title;
    } else {
      titleWrap.innerHTML = `${escapeHtml(mod.title_vi || mod.title)}<span class="module-name-sub">${escapeHtml(mod.title)}</span>`;
    }

    btn.appendChild(numSpan);
    btn.appendChild(titleWrap);
    if (isCompleted) {
      btn.insertAdjacentHTML("beforeend", checkSvg);
    }

    btn.addEventListener("click", () => {
      selectModule(mod.id);
      closeMobileSidebar();
    });

    li.appendChild(btn);
    moduleListEl.appendChild(li);
  });
}

// Render dedicated 35 Packet Tracer Labs View
function renderLabsView(labId) {
  const allLabs = typeof PACKET_TRACER_LABS !== "undefined" ? PACKET_TRACER_LABS : [];
  const labsToShow = labId === 0 ? allLabs : allLabs.filter((l) => l.id === labId);

  const cardsHtml = labsToShow.map((lab) => renderSinglePacketTracerLabCard(lab)).join("");

  const isLabCompleted = labId > 0 && !!completedItems["lab-" + labId];
  const studyActionsHtml = `
    <div class="lesson-study-actions">
      ${
        labId > 0
          ? `<button type="button" class="lesson-complete-toggle-btn ${isLabCompleted ? "completed" : ""}" id="lab-complete-btn" data-key="lab-${labId}">
              ${isLabCompleted ? "✓ Đã làm xong bài Lab này" : "○ Đánh dấu đã làm xong bài Lab"}
            </button>`
          : ""
      }
      <button type="button" class="lesson-note-trigger-btn" id="lab-quick-note-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
        ${labId > 0 ? "Ghi chú bài Lab này" : "Mở sổ tay ghi chú"}
      </button>
    </div>
  `;

  moduleDetailEl.innerHTML = `
    <header class="module-header">
      <div class="module-kicker">THỰC HÀNH MẠNG CISCO PACKET TRACER • 35 BÀI LAB TOÀN DIỆN</div>
      <h2 class="module-heading">
        ${
          labId === 0
            ? "35 Bài Lab Thực Hành Cisco Packet Tracer (Kèm sơ đồ &amp; Hướng dẫn CLI)"
            : escapeHtml(labsToShow[0]?.title_vi || "")
        }
      </h2>
      <div class="module-heading-sub">
        Mỗi bài Lab đều có Sơ đồ đấu nối trực quan chuẩn Packet Tracer, Bảng quy hoạch địa chỉ IP, Hướng dẫn từng bước thao tác chuột và Giải thích từng dòng lệnh CLI.
      </div>
      ${studyActionsHtml}
    </header>
    <div class="pt-labs-wrapper">
      ${cardsHtml}
    </div>
  `;

  const isEn = currentLang === "en";
  document.title = labId > 0 && labsToShow[0]
    ? (isEn ? `Lab ${labId}: ${labsToShow[0].title_en || labsToShow[0].title_vi.replace(/^Lab \d+:\s*/, "")} — CCNA Learning` : `${labsToShow[0].title_vi} — CCNA Learning`)
    : (isEn ? "35 Packet Tracer Labs — CCNA Learning" : "35 Bài thực hành Lab — CCNA Learning");

  updateTopbarBreadcrumb();

  const labCompleteBtn = document.getElementById("lab-complete-btn");
  if (labCompleteBtn && labId > 0) {
    labCompleteBtn.addEventListener("click", () => toggleItemCompleted(`lab-${labId}`));
  }
  const labQuickNoteBtn = document.getElementById("lab-quick-note-btn");
  if (labQuickNoteBtn) {
    labQuickNoteBtn.addEventListener("click", () => openNotesModal("current"));
  }
}

// Render 6 CCNA 200-301 Exam Mastery & Real-World Job Readiness Domains
function renderMasteryView(masteryId) {
  const allMastery = typeof CCNA_EXAM_MASTERY !== "undefined" ? CCNA_EXAM_MASTERY : [];
  const itemsToShow = masteryId === 0 ? allMastery : allMastery.filter((m) => m.id === masteryId);

  const cardsHtml = itemsToShow
    .map((m) => {
      const svgHtml = m.svg ? `<div class="svg-diagram-wrapper">${m.svg}</div>` : "";
      const photosHtml =
        m.photos && m.photos.length > 0
          ? `
          <div class="real-photos-grid">
            ${m.photos
              .map(
                (p) => `
              <figure class="photo-card" data-fullsrc="${escapeHtml(p.url)}" data-title="${escapeHtml(p.title_vi)}" data-desc="${escapeHtml(p.desc_vi)}">
                <div class="photo-img-wrap">
                  <img src="${escapeHtml(p.url)}" alt="${escapeHtml(p.title_vi)}" loading="lazy" />
                  <span class="photo-zoom-hint">🔍 Bấm phóng to cận cảnh</span>
                </div>
                <figcaption class="photo-caption">
                  <strong>📸 ${escapeHtml(p.title_vi)}</strong>
                  <span>${escapeHtml(p.desc_vi)}</span>
                </figcaption>
              </figure>
            `
              )
              .join("")}
          </div>
        `
          : "";
      const sectionsHtml = (m.sections || [])
        .map(
          (sec) => `
          <div class="mastery-section-box">
            <h4 class="mastery-section-heading">${formatRichText(sec.heading)}</h4>
            <div class="mastery-section-content">${formatRichText(sec.content)}</div>
          </div>
        `
        )
        .join("");

      let tableHtml = "";
      if (m.table && m.table.rows) {
        const headers = m.table.headers.map((h) => `<th>${formatRichText(h)}</th>`).join("");
        const rows = m.table.rows
          .map((r) => `<tr>${r.map((c) => `<td>${formatRichText(c)}</td>`).join("")}</tr>`)
          .join("");
        tableHtml = `
          <div>
            <strong style="display:block;margin-bottom:0.55rem;font-size:0.96rem;color:#78350f;">
              📊 ${escapeHtml(m.table.title)}
            </strong>
            <div class="table-responsive">
              <table class="tech-table">
                <thead><tr>${headers}</tr></thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
          </div>
        `;
      }

      return `
        <article class="mastery-card" id="mastery-domain-${m.id}">
          <div class="mastery-header">
            <span class="mastery-badge">${escapeHtml(m.badge)}</span>
            <h3 class="mastery-title">${escapeHtml(m.title_vi)}</h3>
          </div>
          <div class="mastery-body">
            <div class="mastery-summary">
              <strong>Trọng tâm thi CCNA &amp; Đi làm:</strong> ${formatRichText(m.summary_vi)}
            </div>
            ${photosHtml}
            ${svgHtml}
            ${sectionsHtml}
            ${tableHtml}
          </div>
        </article>
      `;
    })
    .join("");

  const isEn = currentLang === "en";
  document.title = masteryId > 0 && itemsToShow[0]
    ? (isEn ? `Mastery ${masteryId}: ${itemsToShow[0].title_en || itemsToShow[0].title_vi} — CCNA Learning` : `Chuyên đề ${masteryId}: ${itemsToShow[0].title_vi} — CCNA Learning`)
    : (isEn ? "10 CCNA Exam Mastery Topics — CCNA Learning" : "10 Chuyên đề CCNA — CCNA Learning");

  const isMasteryCompleted = masteryId > 0 && !!completedItems["mastery-" + masteryId];
  const masteryActionsHtml = `
    <div class="lesson-study-actions">
      ${
        masteryId > 0
          ? `<button type="button" class="lesson-complete-toggle-btn ${isMasteryCompleted ? "completed" : ""}" id="mastery-complete-btn" data-key="mastery-${masteryId}">
              ${isMasteryCompleted ? "✓ Đã học xong chuyên đề này" : "○ Đánh dấu đã học xong chuyên đề"}
            </button>`
          : ""
      }
      <button type="button" class="lesson-note-trigger-btn" id="mastery-quick-note-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
        ${masteryId > 0 ? "Ghi chú chuyên đề này" : "Mở sổ tay ghi chú"}
      </button>
    </div>
  `;

  moduleDetailEl.innerHTML = `
    <header class="module-header">
      <div class="module-kicker">HOÀN THIỆN 100% KHUNG ĐỀ THI QUỐC TẾ CISCO CCNA 200-301 • THIẾT BỊ ĐA HÃNG • NGOẠI VI &amp; ĐI LÀM</div>
      <h2 class="module-heading">
        ${
          masteryId === 0
            ? "10 Chuyên Đề Thi CCNA 200-301 (v1.1 & v2.0), Thiết Bị Đa Hãng &amp; Phỏng Vấn Đi Làm"
            : escapeHtml(itemsToShow[0]?.title_vi || "")
        }
      </h2>
      <div class="module-heading-sub">
        Bao trọn toàn bộ kiến thức CCNA 2 (SRWE), CCNA 3 (ENSA) và các công nghệ thực chiến mới nhất: AI Tạo Sinh / Agentic AI, Terraform IaC, Root Guard / Loop Guard, Giải phẫu đa góc độ cổng vật lý, Switch HPE Aruba quản trị Web GUI / Cloud, Router cân bằng tải Multi-WAN DrayTek/MikroTik, cùng toàn bộ hệ sinh thái thiết bị ngoại vi văn phòng (Máy in cảm ứng LCD &amp; EWS, Máy scan mạng SMB, Máy in bill nhiệt POS 9100, IP Phone PoE passthrough, Quản trị từ xa máy tính nhân viên RMM/RDP/RustDesk/Wake-on-LAN).
      </div>
      ${masteryActionsHtml}
    </header>
    <div>
      ${cardsHtml}
    </div>
  `;
  updateTopbarBreadcrumb();
  attachPhotoLightboxEvents();

  const masteryCompleteBtn = document.getElementById("mastery-complete-btn");
  if (masteryCompleteBtn && masteryId > 0) {
    masteryCompleteBtn.addEventListener("click", () => toggleItemCompleted(`mastery-${masteryId}`));
  }
  const masteryQuickNoteBtn = document.getElementById("mastery-quick-note-btn");
  if (masteryQuickNoteBtn) {
    masteryQuickNoteBtn.addEventListener("click", () => openNotesModal("current"));
  }
}

// Build interactive Subnet / Binary Calculator for Modules 5 & 11
function buildInteractiveCalculator(modId) {
  if (modId === 5) {
    const isEn = currentLang === "en";
    return wrapSectionBlock(
      "heading-calc-bin",
      `<span>${isEn ? "Interactive Binary - Decimal - Hexadecimal Converter" : "Công cụ thực hành quy đổi Nhị phân - Thập phân - Thập lục phân"}</span>`,
      `<div class="calc-grid">
        <div class="calc-input-group">
          <label for="bin-dec-input">${isEn ? "Enter Decimal (0 - 255) or IPv4 Address:" : "Nhập số Thập phân (0 - 255) hoặc địa chỉ IPv4:"}</label>
          <input type="text" id="bin-dec-input" class="calc-input" value="192.168.10.150" />
        </div>
      </div>
      <div class="calc-result-box" id="bin-calc-output"></div>`
    );
  }
  if (modId === 11) {
    const isEn = currentLang === "en";
    return wrapSectionBlock(
      "heading-calc-sub",
      `<span>${isEn ? "Interactive IPv4 Subnetting & VLSM Calculator" : "Máy tính chia mạng con IPv4 (Subnetting & VLSM) thực hành"}</span>`,
      `<div class="calc-grid">
        <div class="calc-input-group">
          <label for="sub-ip-input">${isEn ? "IPv4 Address:" : "Địa chỉ IPv4:"}</label>
          <input type="text" id="sub-ip-input" class="calc-input" value="192.168.10.150" />
        </div>
        <div class="calc-input-group">
          <label for="sub-cidr-input">${isEn ? "Prefix Length (/8 to /30):" : "Độ dài Prefix (/8 đến /30):"}</label>
          <input type="number" id="sub-cidr-input" class="calc-input" min="8" max="30" value="26" />
        </div>
      </div>
      <div class="calc-result-box" id="sub-calc-output"></div>`
    );
  }
  return "";
}

function attachCalculatorEvents(modId) {
  if (modId === 5) {
    const input = document.getElementById("bin-dec-input");
    const output = document.getElementById("bin-calc-output");
    if (!input || !output) return;
    const updateBin = () => {
      const val = input.value.trim();
      const parts = val.split(".").map((p) => parseInt(p.trim(), 10));
      if (parts.length > 0 && parts.every((n) => !isNaN(n) && n >= 0 && n <= 255)) {
        const binStr = parts.map((n) => n.toString(2).padStart(8, "0")).join(" . ");
        const hexStr = parts.map((n) => "0x" + n.toString(16).toUpperCase().padStart(2, "0")).join("  ");
        output.innerHTML =
          `<div>• <strong>Hệ Thập phân:</strong> ${parts.join(".")}</div>` +
          `<div>• <strong>Hệ Nhị phân 8-bit:</strong> <span style="color:#4ade80">${binStr}</span></div>` +
          `<div>• <strong>Hệ Thập lục phân (Hex):</strong> <span style="color:#fbbf24">${hexStr}</span></div>`;
      } else {
        output.textContent = "Vui lòng nhập số từ 0-255 hoặc địa chỉ IPv4 hợp lệ (VD: 192.168.1.1)";
      }
    };
    input.addEventListener("input", updateBin);
    updateBin();
  }

  if (modId === 11) {
    const ipInput = document.getElementById("sub-ip-input");
    const cidrInput = document.getElementById("sub-cidr-input");
    const output = document.getElementById("sub-calc-output");
    if (!ipInput || !cidrInput || !output) return;

    const updateSub = () => {
      const parts = ipInput.value.trim().split(".").map((x) => parseInt(x, 10));
      const cidr = parseInt(cidrInput.value, 10);
      if (parts.length !== 4 || parts.some((n) => isNaN(n) || n < 0 || n > 255) || isNaN(cidr) || cidr < 8 || cidr > 30) {
        output.textContent = "Vui lòng nhập địa chỉ IPv4 hợp lệ và Prefix từ /8 đến /30.";
        return;
      }
      const ipInt = ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
      const maskInt = (0xffffffff << (32 - cidr)) >>> 0;
      const netInt = (ipInt & maskInt) >>> 0;
      const bcastInt = (netInt | (~maskInt >>> 0)) >>> 0;
      const firstHost = (netInt + 1) >>> 0;
      const lastHost = (bcastInt - 1) >>> 0;
      const hostBits = 32 - cidr;
      const usableHosts = Math.pow(2, hostBits) - 2;

      const toIp = (num) =>
        `${(num >>> 24) & 255}.${(num >>> 16) & 255}.${(num >>> 8) & 255}.${num & 255}`;

      output.innerHTML =
        `<div>• <strong>Mặt nạ mạng Subnet Mask (/${cidr}):</strong> <span style="color:#38bdf8">${toIp(maskInt)}</span> (Còn ${hostBits} bit phần Host)</div>` +
        `<div>• <strong>Địa chỉ Mạng (Network ID):</strong> <span style="color:#4ade80">${toIp(netInt)}/${cidr}</span></div>` +
        `<div>• <strong>Dải IP gán được cho máy trạm:</strong> <span style="color:#fbbf24">${toIp(firstHost)}  ---&gt;  ${toIp(lastHost)}</span> (${usableHosts.toLocaleString()} máy tính)</div>` +
        `<div>• <strong>Địa chỉ Quảng bá (Broadcast):</strong> <span style="color:#f472b6">${toIp(bcastInt)}</span></div>`;
    };
    ipInput.addEventListener("input", updateSub);
    cidrInput.addEventListener("input", updateSub);
    updateSub();
  }
}

// Helper to wrap each section with collapsible header & clean card layout
function wrapSectionBlock(id, titleHtml, bodyHtml, rightActionHtml = "") {
  return `
    <section class="section-block" id="sec-block-${id}">
      <div class="section-header-wrap" data-target="${id}" role="button" tabindex="0" title="Bấm để thu gọn hoặc mở rộng phần này">
        <h3 class="section-title" id="${id}">
          ${titleHtml}
        </h3>
        <div class="section-meta-actions">
          ${rightActionHtml}
          <span class="section-toggle-icon" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </div>
      </div>
      <div class="section-content-body">
        ${bodyHtml}
      </div>
    </section>
  `;
}

// Select and display a module in the main content area without page reload
function selectModule(id) {
  const mod = modulesData.find((item) => item.id === id);
  if (!mod) return;

  activeModuleId = id;

  const buttons = moduleListEl.querySelectorAll(".module-item");
  buttons.forEach((btn) => {
    btn.classList.toggle("active", Number(btn.dataset.id) === id);
  });

  const mainTitle = currentLang === "en" ? mod.title : mod.title_vi || mod.title;
  const subTitle = currentLang === "both" ? mod.title : "";
  const isEn = currentLang === "en";
  const kickerText = isEn
    ? `CCNA 1 v7.0 (200-301) • MODULE ${mod.id} OF ${modulesData.length}`
    : `GIÁO TRÌNH CCNA 1 v7.0 • HỌC PHẦN ${mod.id} / ${modulesData.length}`;

  // 1. Beginner Guide (From Zero) + Real-Life Analogy
  let beginnerSectionHtml = "";
  const bgList = isEn
    ? (mod.beginnerGuide_en && mod.beginnerGuide_en.length > 0 ? mod.beginnerGuide_en : mod.beginnerGuide_vi || [])
    : (mod.beginnerGuide_vi || []);
  const bgListSecondary = mod.beginnerGuide_en || [];

  const analogyHtml = mod.analogy_vi
    ? `
      <div class="analogy-box">
        <div class="analogy-title">💡 ${isEn ? "Real-World Metaphor & Intuitive Analogy" : "Ví dụ liên hệ thực tế đời thường cho người mới"}</div>
        <div class="analogy-text">${formatRichText(mod.analogy_vi)}</div>
      </div>
    `
    : "";

  if (bgList.length > 0 || analogyHtml) {
    const bgItemsHtml = bgList
      .map((item, idx) => {
        const enSub =
          currentLang === "both" && bgListSecondary[idx]
            ? `<div class="concept-en-sub">🇬🇧 ${formatRichText(bgListSecondary[idx])}</div>`
            : "";
        return `<li class="beginner-item">${formatRichText(item)}${enSub}</li>`;
      })
      .join("");

    beginnerSectionHtml = wrapSectionBlock(
      "heading-beginner",
      `<span>${isEn ? "Part 1: Absolute Beginner Practical Guide & Foundations" : "Phần 1: Nền tảng nhập môn căn bản cho người mới bắt đầu"}</span>`,
      `<ul class="beginner-list">${bgItemsHtml}</ul>${analogyHtml}`
    );
  }

  // 2. Real Hardware Photos Gallery (Multi-Angle & Close-up Ports) + Visual Architecture Diagrams
  const visualData = typeof MODULE_VISUALS !== "undefined" ? MODULE_VISUALS[mod.id] : null;
  let visualSectionHtml = "";
  if (visualData) {
    const portAnatomySvgHtml = typeof renderMultiAnglePortAnatomySvg === "function"
      ? `<div class="svg-diagram-wrapper">${renderMultiAnglePortAnatomySvg(mod.id)}</div>`
      : "";

    const hardwareSvgHtml = visualData.hardwareSvg
      ? `<div class="svg-diagram-wrapper">${visualData.hardwareSvg}</div>`
      : "";

    const svgDiagramHtml = visualData.svg
      ? `<div class="svg-diagram-wrapper">${visualData.svg}</div>`
      : "";

    const photosHtml =
      visualData.photos && visualData.photos.length > 0
        ? `
        <div class="real-photos-grid">
          ${visualData.photos
            .map((p) => {
              const pTitle = isEn
                ? p.title_en || p.title_vi
                : p.title_vi;
              const pDesc = isEn
                ? p.desc_en || p.desc_vi
                : p.desc_vi;
              const pEnSub =
                currentLang === "both" && p.title_en
                  ? `<div class="concept-en-sub">🇬🇧 <strong>${escapeHtml(p.title_en)}:</strong> ${escapeHtml(p.desc_en || "")}</div>`
                  : "";
              return `
                <figure class="photo-card" data-fullsrc="${escapeHtml(p.url)}" data-title="${escapeHtml(pTitle)}" data-desc="${escapeHtml(pDesc)}">
                  <div class="photo-img-wrap">
                    <img src="${escapeHtml(p.url)}" alt="${escapeHtml(pTitle)}" loading="lazy" />
                    <span class="photo-zoom-hint">${isEn ? "Click to enlarge" : "Phóng to ảnh"}</span>
                  </div>
                  <figcaption class="photo-caption">
                    <strong>${escapeHtml(pTitle)}</strong>
                    <span>${escapeHtml(pDesc)}</span>
                    ${pEnSub}
                  </figcaption>
                </figure>
              `;
            })
            .join("")}
        </div>
      `
        : "";

    visualSectionHtml = wrapSectionBlock(
      "heading-visual",
      `<span>${
        isEn
          ? `Part 2: Hardware Photos, Ports & Architecture Diagrams (${(visualData.photos || []).length} Photos)`
          : `Phần 2: Hình ảnh thực tế thiết bị & Cổng kết nối (${(visualData.photos || []).length} ảnh minh họa)`
      }</span>`,
      `<div class="visual-container">${photosHtml}${portAnatomySvgHtml}${svgDiagramHtml}${hardwareSvgHtml}</div>`
    );
  }

  // 3. Overview & Core Technical Concepts
  let overviewHtml = "";
  if (currentLang === "vi") {
    overviewHtml = `<p class="overview-text">${formatRichText(mod.overview_vi || mod.overview)}</p>`;
  } else if (isEn) {
    overviewHtml = `<p class="overview-text">${formatRichText(mod.overview || mod.overview_vi)}</p>`;
  } else {
    overviewHtml = `
      <p class="overview-text">🇻🇳 ${formatRichText(mod.overview_vi || mod.overview)}</p>
      <p class="overview-text overview-text-en">🇬🇧 ${formatRichText(mod.overview)}</p>
    `;
  }

  const primaryConcepts = isEn
    ? (mod.keyConcepts && mod.keyConcepts.length > 0 ? mod.keyConcepts : mod.keyConcepts_vi || [])
    : (mod.keyConcepts_vi || mod.keyConcepts || []);
  const secondaryConcepts = mod.keyConcepts || [];

  const conceptsHtml = primaryConcepts
    .map((concept, idx) => {
      const enSub =
        currentLang === "both" && secondaryConcepts[idx]
          ? `<div class="concept-en-sub">🇬🇧 ${formatRichText(secondaryConcepts[idx])}</div>`
          : "";
      return `
        <li class="concept-item">
          <span class="concept-badge">${idx + 1}</span>
          <div>${formatRichText(concept)}${enSub}</div>
        </li>
      `;
    })
    .join("");

  const overviewSectionHtml = wrapSectionBlock(
    "heading-overview",
    `<span>${
      isEn
        ? `Part 3: Core Theory & Key Technical Concepts (${primaryConcepts.length})`
        : `Phần 3: Lý thuyết cốt lõi & Nguyên lý kỹ thuật (${primaryConcepts.length} nội dung trọng tâm)`
    }</span>`,
    `${overviewHtml}<ul class="concepts-list" style="margin-top: 1.2rem;">${conceptsHtml}</ul>`
  );

  // 4. Deep Glossary & Encyclopedia Breakdown (Term-by-Term Explanation)
  const glossaryEntries =
    typeof MODULE_DEEP_GLOSSARY !== "undefined" && MODULE_DEEP_GLOSSARY[mod.id]
      ? MODULE_DEEP_GLOSSARY[mod.id]
      : [];
  let glossarySectionHtml = "";
  if (glossaryEntries.length > 0) {
    const cardsHtml = glossaryEntries
      .map(
        (g, idx) => `
        <div class="glossary-card">
          <div class="glossary-term">
            <span class="pt-badge">${isEn ? `TERM ${idx + 1}` : `MỤC ${idx + 1}`}</span>
            <span>${escapeHtml(g.term)}</span>
          </div>
          <div class="glossary-simple">
            <strong>${isEn ? "Core Definition:" : "Khái niệm căn bản:"}</strong> ${formatRichText(g.simple_vi)}
          </div>
          <div class="glossary-detail">
            <strong>${isEn ? "Technical Deep Dive & Architecture:" : "Phân tích chuyên sâu & Nguyên lý:"}</strong> ${formatRichText(g.detail_vi)}
          </div>
          <div class="glossary-example">
            <strong>${isEn ? "CCNA Exam & Real-World Note:" : "Ứng dụng & Lưu ý thi CCNA:"}</strong> ${formatRichText(g.example_vi)}
          </div>
        </div>
      `
      )
      .join("");

    glossarySectionHtml = wrapSectionBlock(
      "heading-glossary",
      `<span>${
        isEn
          ? `Part 4: Key Technical Glossary & In-Depth Terminology (${glossaryEntries.length} Terms)`
          : `Phần 4: Giải thích thuật ngữ & Khái niệm chuyên sâu (${glossaryEntries.length} chủ đề)`
      }</span>`,
      `<div class="glossary-grid">${cardsHtml}</div>`
    );
  }

  // 5. Advanced Expansion Topics
  let advancedSectionHtml = "";
  const advList = isEn
    ? (mod.advancedTopics_en && mod.advancedTopics_en.length > 0 ? mod.advancedTopics_en : mod.advancedTopics_vi || [])
    : (mod.advancedTopics_vi || []);
  const advListSecondary = mod.advancedTopics_en || [];

  if (advList.length > 0) {
    const advItemsHtml = advList
      .map((item, idx) => {
        const enSub =
          currentLang === "both" && advListSecondary[idx]
            ? `<div class="concept-en-sub">🇬🇧 ${formatRichText(advListSecondary[idx])}</div>`
            : "";
        return `<li class="advanced-item">${formatRichText(item)}${enSub}</li>`;
      })
      .join("");

    advancedSectionHtml = wrapSectionBlock(
      "heading-advanced",
      `<span>${
        isEn
          ? `Part 5: Advanced Deep Dive (${advList.length} Topics)`
          : `Phần 5: Kiến thức mở rộng & Cơ chế chuyên sâu (${advList.length} chủ đề)`
      }</span>`,
      `<ul class="advanced-list">${advItemsHtml}</ul>`
    );
  }

  // 6. Technical Comparison Table
  let tableSectionHtml = "";
  const compData = (isEn && typeof CCNA_COMPARISON_TABLES_EN !== "undefined" && CCNA_COMPARISON_TABLES_EN[mod.id])
    ? CCNA_COMPARISON_TABLES_EN[mod.id]
    : mod.comparisonTable;

  if (compData && compData.rows) {
    const defaultEnHeaders = ["Technology / Standard", "Technical Specification", "Actual Bandwidth / Speed", "Enterprise & Exam Use-Case"];
    const headers = isEn
      ? (compData.headers_en || compData.headers_vi || defaultEnHeaders)
      : (compData.headers_vi || defaultEnHeaders);
    const headersHtml = headers
      .map((h) => `<th>${formatRichText(h)}</th>`)
      .join("");
    const rowsHtml = compData.rows
      .map(
        (row) =>
          `<tr>${row.map((cell) => `<td>${formatRichText(cell)}</td>`).join("")}</tr>`
      )
      .join("");

    const tblTitle = isEn
      ? (compData.title_en || compData.title_vi || "Technical Comparison & Reference Table")
      : (compData.title_vi || "Bảng So Sánh Kỹ Thuật");

    tableSectionHtml = wrapSectionBlock(
      "heading-table",
      `<span>${isEn ? `Part 6: ${escapeHtml(tblTitle)}` : `Phần 6: ${escapeHtml(tblTitle)}`}</span>`,
      `<div class="table-responsive">
        <table class="tech-table">
          <thead><tr>${headersHtml}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>`
    );
  }

  // 7. Real-World Network Engineer Job Skills
  let jobSkillsHtml = "";
  const jobList = isEn
    ? ((typeof CCNA_JOB_SKILLS_EN !== "undefined" && CCNA_JOB_SKILLS_EN[mod.id]) || (mod.jobSkills_en && mod.jobSkills_en.length > 0 ? mod.jobSkills_en : mod.jobSkills_vi || []))
    : (mod.jobSkills_vi || []);
  if (jobList.length > 0) {
    const itemsHtml = jobList
      .map((skill) => `<li class="job-skill-item">${formatRichText(skill)}</li>`)
      .join("");
    jobSkillsHtml = wrapSectionBlock(
      "heading-job",
      `<span>${isEn ? "Part 7: Real-World Network Engineer Field Experience & Practices" : "Phần 7: Kinh nghiệm thực chiến khi đi làm kỹ sư mạng"}</span>`,
      `<ul class="job-skills-list">${itemsHtml}</ul>`
    );
  }

  // 8. Step-by-step Worked Example
  const rawExample = isEn
    ? mod.realWorldExample || mod.realWorldExample_vi
    : mod.realWorldExample_vi || mod.realWorldExample;
  let exampleSectionHtml = "";
  if (rawExample) {
    const exampleLines = rawExample
      .split("\n")
      .map((line) => `<div class="example-line">${formatRichText(line)}</div>`)
      .join("");
    const enExampleLines =
      currentLang === "both" && mod.realWorldExample
        ? `<div class="concept-en-sub" style="margin-top:0.85rem;padding-top:0.85rem;"><strong>🇬🇧 English Walkthrough:</strong><br/>${mod.realWorldExample
            .split("\n")
            .map((l) => formatRichText(l))
            .join("<br/>")}</div>`
        : "";

    exampleSectionHtml = wrapSectionBlock(
      "heading-example",
      `<span>${
        isEn
          ? "Part 8: Practical Example & Step-by-Step Walkthrough"
          : "Phần 8: Ví dụ minh họa thực tế & Lời giải chi tiết"
      }</span>`,
      `<div class="example-box">
        ${exampleLines}
        ${enExampleLines}
      </div>`
    );
  }

  const calcSectionHtml = buildInteractiveCalculator(mod.id);

  // 9. Cisco Packet Tracer Hands-On Labs for this Module
  const moduleLabs =
    typeof PACKET_TRACER_LABS !== "undefined"
      ? PACKET_TRACER_LABS.filter((l) => l.moduleId === mod.id)
      : [];
  let moduleLabsHtml = "";
  if (moduleLabs.length > 0) {
    const labCards = moduleLabs.map((l) => renderSinglePacketTracerLabCard(l)).join("");
    moduleLabsHtml = wrapSectionBlock(
      "heading-pt-labs",
      `<span>${isEn ? `Part 9: Cisco Packet Tracer Hands-On Labs (${moduleLabs.length} Labs)` : `Phần 9: Bài thực hành Cisco Packet Tracer (${moduleLabs.length} bài Lab)`}</span>`,
      `<div class="pt-labs-wrapper">${labCards}</div>`,
      `<button type="button" class="copy-btn" id="view-all-30-labs-btn" style="pointer-events: auto;">${isEn ? "View all 35 Labs &rarr;" : "Xem tất cả 35 Lab &rarr;"}</button>`
    );
  }

  // 10. Interactive CCNA 200-301 Exam Quiz
  let quizSectionHtml = "";
  const activeQuizList = (isEn && typeof CCNA_QUIZ_EN !== "undefined" && CCNA_QUIZ_EN[mod.id])
    ? CCNA_QUIZ_EN[mod.id]
    : (mod.quiz && mod.quiz.length > 0 ? mod.quiz : []);

  if (activeQuizList && activeQuizList.length > 0) {
    const quizCardsHtml = activeQuizList
      .map((q, qIdx) => {
        const qText = isEn ? (q.question_en || q.question_vi) : q.question_vi;
        const opts = isEn ? (q.options_en || q.options_vi) : q.options_vi;
        const expText = isEn ? (q.explanation_en || q.explanation_vi) : q.explanation_vi;
        const optsHtml = opts
          .map(
            (opt, oIdx) => `
            <button type="button" class="quiz-opt-btn" data-qidx="${qIdx}" data-oidx="${oIdx}" data-ans="${q.answerIndex}">
              ${formatRichText(opt)}
            </button>
          `
          )
          .join("");
        return `
          <div class="quiz-card" id="quiz-card-${qIdx}">
            <div class="quiz-question">${formatRichText(qText)}</div>
            <div class="quiz-options">${optsHtml}</div>
            <div class="quiz-explanation" id="quiz-exp-${qIdx}">
              <strong>${isEn ? "Detailed Explanation:" : "Giải thích chi tiết:"}</strong> ${formatRichText(expText)}
            </div>
          </div>
        `;
      })
      .join("");

    quizSectionHtml = wrapSectionBlock(
      "heading-quiz",
      `<span>${isEn ? `Part 11: CCNA Practice Exam Quiz (${activeQuizList.length} Questions)` : `Phần 11: Câu hỏi trắc nghiệm ôn thi CCNA (${activeQuizList.length} câu)`}</span>`,
      `<div class="quiz-container">${quizCardsHtml}</div>`
    );
  }

  let commandsSectionHtml = "";
  if (mod.commands && mod.commands.length > 0) {
    commandsSectionHtml = wrapSectionBlock(
      "heading-commands",
      `<span>${
        isEn
          ? "Part 10: Cisco IOS CLI Commands & Reference"
          : "Phần 10: Tập lệnh thực hành Cisco IOS CLI & Tra cứu"
      }</span>`,
      `<pre class="cli-block"><code id="cli-code">${formatCliCommands(mod.commands)}</code></pre>`,
      `<button type="button" class="copy-btn" id="copy-cli-btn" style="pointer-events: auto;">${
        isEn ? "Copy Commands" : "Sao chép lệnh"
      }</button>`
    );
  }

  const commandsText = (mod.commands || []).join("\n");
  const prevId = id > 1 ? id - 1 : null;
  const nextId = id < modulesData.length ? id + 1 : null;

  // Dynamic SEO Title update
  document.title = isEn
    ? `Module ${mod.id}: ${mainTitle} — CCNA Learning`
    : `Học phần ${mod.id}: ${mainTitle} — CCNA Learning`;
  closeMobileSidebar();

  // Estimate reading time & word count
  const fullTextSample = [
    mod.overview_vi || mod.overview || "",
    (mod.keyConcepts_vi || []).join(" "),
    (mod.beginnerGuide_vi || []).join(" "),
    (mod.advancedTopics_vi || []).join(" "),
    (mod.jobSkills_vi || []).join(" "),
    mod.realWorldExample_vi || "",
    (mod.commands || []).join(" ")
  ].join(" ");
  const wordCount = fullTextSample.trim().split(/\s+/).filter(Boolean).length;
  const readingTimeMinutes = Math.max(3, Math.ceil(wordCount / 180));

  const quickJumpItems = [];
  if (beginnerSectionHtml) quickJumpItems.push({ id: "heading-beginner", label: isEn ? "Beginner Guide" : "Nhập môn" });
  if (visualSectionHtml) quickJumpItems.push({ id: "heading-visual", label: isEn ? "Hardware & Ports" : "Ảnh thiết bị & Cổng" });
  quickJumpItems.push({ id: "heading-overview", label: isEn ? "Core Theory" : "Lý thuyết cốt lõi" });
  if (glossarySectionHtml) quickJumpItems.push({ id: "heading-glossary", label: isEn ? "Glossary" : "Thuật ngữ" });
  if (advancedSectionHtml) quickJumpItems.push({ id: "heading-advanced", label: isEn ? "Advanced Dive" : "Kiến thức mở rộng" });
  if (tableSectionHtml) quickJumpItems.push({ id: "heading-table", label: isEn ? "Comparison Table" : "Bảng so sánh" });
  if (jobSkillsHtml) quickJumpItems.push({ id: "heading-job", label: isEn ? "Field Skills" : "Kinh nghiệm thực tế" });
  if (exampleSectionHtml) quickJumpItems.push({ id: "heading-example", label: isEn ? "Worked Example" : "Ví dụ giải mẫu" });
  if (calcSectionHtml) quickJumpItems.push({ id: mod.id === 5 ? "heading-calc-bin" : "heading-calc-sub", label: isEn ? "Calculator" : "Công cụ tính" });
  if (moduleLabsHtml) quickJumpItems.push({ id: "heading-pt-labs", label: isEn ? "Packet Tracer Labs" : "Bài Lab" });
  if (commandsSectionHtml) quickJumpItems.push({ id: "heading-commands", label: isEn ? "CLI Commands" : "Lệnh CLI" });
  if (quizSectionHtml) quickJumpItems.push({ id: "heading-quiz", label: isEn ? "Exam Quiz" : "Trắc nghiệm ôn thi" });

  const quickJumpHtml = quickJumpItems.length > 0
    ? `
      <nav class="quick-jump-bar" aria-label="${isEn ? "Lesson table of contents" : "Mục lục bài học"}">
        <span class="quick-jump-label">${isEn ? "Quick Navigation:" : "Mục lục nhanh:"}</span>
        <div class="quick-jump-links">
          ${quickJumpItems.map((item) => `<a href="#${item.id}" class="quick-jump-pill">${escapeHtml(item.label)}</a>`).join("")}
        </div>
      </nav>
    `
    : "";

  const lessonControlBarHtml = `
    <div class="lesson-control-bar">
      <div class="lesson-stats">
        <span class="lesson-stat-item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          ${isEn 
            ? `Estimated Reading Time: ~<strong>${readingTimeMinutes} mins</strong> (${wordCount.toLocaleString()} words)`
            : `Thời gian đọc: ~<strong>${readingTimeMinutes} phút</strong> (${wordCount.toLocaleString()} từ)`
          }
        </span>
      </div>
      <div class="lesson-expand-controls">
        <button type="button" class="lesson-expand-btn" id="collapse-all-sections-btn" title="${isEn ? "Collapse all sections for quick overview" : "Thu gọn tất cả để nhìn tổng quát"}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="4 14 12 6 20 14"/>
            <polyline points="4 20 12 12 20 20"/>
          </svg>
          ${isEn ? "Collapse All" : "Thu gọn tất cả"}
        </button>
        <button type="button" class="lesson-expand-btn" id="expand-all-sections-btn" title="${isEn ? "Expand all section contents" : "Mở rộng tất cả nội dung"}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="4 6 12 14 20 6"/>
            <polyline points="4 12 12 20 20 12"/>
          </svg>
          ${isEn ? "Expand All" : "Mở rộng tất cả"}
        </button>
      </div>
    </div>
  `;

  const isCompleted = !!completedItems["module-" + mod.id];
  const completeBtnText = isCompleted
    ? (isEn ? "✓ Completed this module" : "✓ Đã học xong học phần này")
    : (isEn ? "○ Mark as completed" : "○ Đánh dấu đã học xong");

  const studyActionsHtml = `
    <div class="lesson-study-actions">
      <button type="button" class="lesson-complete-toggle-btn ${isCompleted ? "completed" : ""}" id="lesson-complete-btn" data-key="module-${mod.id}">
        ${completeBtnText}
      </button>
      <button type="button" class="lesson-note-trigger-btn" id="lesson-note-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
        ${isEn ? "Module Notes" : "Ghi chú học phần"}
      </button>
      <button type="button" class="lesson-flashcards-trigger-btn" id="module-flashcards-btn" title="${isEn ? "Study flashcards for this module" : "Luyện thẻ ghi nhớ nhanh cho học phần này"}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <path d="M7 7h10M7 12h10M7 17h6"/>
        </svg>
        ${isEn ? "Module Flashcards" : "Flashcards bài này"}
      </button>
    </div>
  `;

  moduleDetailEl.innerHTML = `
    <header class="module-header">
      <div class="module-kicker">${escapeHtml(kickerText)}</div>
      <h2 class="module-heading">${escapeHtml(mainTitle)}</h2>
      ${subTitle ? `<div class="module-heading-sub">${escapeHtml(subTitle)}</div>` : ""}
      ${studyActionsHtml}
    </header>

    ${quickJumpHtml}

    ${lessonControlBarHtml}

    ${beginnerSectionHtml}

    ${visualSectionHtml}

    ${overviewSectionHtml}

    ${glossarySectionHtml}

    ${advancedSectionHtml}

    ${tableSectionHtml}

    ${jobSkillsHtml}

    ${exampleSectionHtml}

    ${calcSectionHtml}

    ${moduleLabsHtml}

    ${commandsSectionHtml}

    ${quizSectionHtml}

    <div class="module-footer-nav">
      <button type="button" class="nav-btn" id="prev-module-btn" ${!prevId ? "disabled" : ""}>
        &larr; ${isEn ? "Previous Module" : "Học phần trước"}
      </button>
      <button type="button" class="lesson-complete-toggle-btn ${isCompleted ? "completed" : ""}" id="footer-lesson-complete-btn" data-key="module-${mod.id}">
        ${isCompleted ? (isEn ? "✓ Completed this module" : "✓ Đã hoàn thành học phần này") : (isEn ? "○ Mark as completed" : "○ Đánh dấu đã học xong")}
      </button>
      <button type="button" class="nav-btn" id="next-module-btn" ${!nextId ? "disabled" : ""}>
        ${isEn ? "Next Module" : "Học phần tiếp theo"} &rarr;
      </button>
    </div>
  `;

  updateTopbarBreadcrumb();
  attachSectionCollapseEvents();

  const lessonCompleteBtn = document.getElementById("lesson-complete-btn");
  if (lessonCompleteBtn) {
    lessonCompleteBtn.addEventListener("click", () => toggleItemCompleted(`module-${mod.id}`));
  }
  const footerLessonCompleteBtn = document.getElementById("footer-lesson-complete-btn");
  if (footerLessonCompleteBtn) {
    footerLessonCompleteBtn.addEventListener("click", () => toggleItemCompleted(`module-${mod.id}`));
  }
  const lessonNoteBtn = document.getElementById("lesson-note-btn");
  if (lessonNoteBtn) {
    lessonNoteBtn.addEventListener("click", () => openNotesModal("current"));
  }
  const moduleFlashcardsBtn = document.getElementById("module-flashcards-btn");
  if (moduleFlashcardsBtn) {
    moduleFlashcardsBtn.addEventListener("click", () => openFlashcardsModal(mod.id));
  }

  attachCalculatorEvents(mod.id);
  attachPhotoLightboxEvents();

  const viewAllLabsBtn = document.getElementById("view-all-30-labs-btn");
  if (viewAllLabsBtn) {
    viewAllLabsBtn.addEventListener("click", () => {
      currentMode = "labs";
      activeLabId = 0;
      if (tabModulesBtn) tabModulesBtn.classList.remove("active");
      if (tabMasteryBtn) tabMasteryBtn.classList.remove("active");
      if (tabLabsBtn) tabLabsBtn.classList.add("active");
      renderAll();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const quizButtons = moduleDetailEl.querySelectorAll(".quiz-opt-btn");
  quizButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const qIdx = btn.dataset.qidx;
      const selectedIdx = Number(btn.dataset.oidx);
      const ansIdx = Number(btn.dataset.ans);
      const cardEl = document.getElementById(`quiz-card-${qIdx}`);
      const expEl = document.getElementById(`quiz-exp-${qIdx}`);

      const siblingBtns = cardEl.querySelectorAll(".quiz-opt-btn");
      siblingBtns.forEach((b, idx) => {
        b.classList.remove("correct", "wrong");
        if (idx === ansIdx) {
          b.classList.add("correct");
        } else if (idx === selectedIdx && selectedIdx !== ansIdx) {
          b.classList.add("wrong");
        }
      });

      if (expEl) {
        expEl.classList.add("visible");
      }
    });
  });

  const copyBtn = document.getElementById("copy-cli-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(commandsText);
        copyBtn.textContent = currentLang === "en" ? "Copied!" : "Đã sao chép!";
        setTimeout(() => {
          copyBtn.textContent = currentLang === "en" ? "Copy Commands" : "Sao chép lệnh";
        }, 1500);
      } catch {
        copyBtn.textContent = "Error";
      }
    });
  }

  const prevBtn = document.getElementById("prev-module-btn");
  const nextBtn = document.getElementById("next-module-btn");

  if (prevBtn && prevId) {
    prevBtn.addEventListener("click", () => {
      selectModule(prevId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (nextBtn && nextId) {
    nextBtn.addEventListener("click", () => {
      selectModule(nextId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function filterAndRenderSidebar() {
  const query = searchInputEl.value.trim().toLowerCase();

  if (currentMode === "mastery") {
    const allMastery = typeof CCNA_EXAM_MASTERY !== "undefined" ? CCNA_EXAM_MASTERY : [];
    if (!query) {
      renderSidebar(allMastery);
      return;
    }
    const filteredMastery = allMastery.filter(
      (m) =>
        m.title_vi.toLowerCase().includes(query) ||
        m.summary_vi.toLowerCase().includes(query) ||
        m.badge.toLowerCase().includes(query)
    );
    renderSidebar(filteredMastery);
    return;
  }

  if (currentMode === "labs") {
    const allLabs = typeof PACKET_TRACER_LABS !== "undefined" ? PACKET_TRACER_LABS : [];
    if (!query) {
      renderSidebar(allLabs);
      return;
    }
    const filteredLabs = allLabs.filter(
      (lab) =>
        lab.title_vi.toLowerCase().includes(query) ||
        lab.objective_vi.toLowerCase().includes(query) ||
        `lab ${lab.id}`.includes(query) ||
        String(lab.id) === query
    );
    renderSidebar(filteredLabs);
    return;
  }

  if (!query) {
    renderSidebar(modulesData);
    return;
  }

  const filtered = modulesData.filter(
    (mod) =>
      mod.title.toLowerCase().includes(query) ||
      (mod.title_vi && mod.title_vi.toLowerCase().includes(query)) ||
      `module ${mod.id}`.includes(query) ||
      String(mod.id) === query
  );
  renderSidebar(filtered);
}

// Mode switcher tabs (17 Modules vs 35 Packet Tracer Labs vs 6 Exam/Job Mastery Domains)
function setActiveModeTab(mode) {
  currentMode = mode;
  if (tabModulesBtn) tabModulesBtn.classList.toggle("active", mode === "modules");
  if (tabLabsBtn) tabLabsBtn.classList.toggle("active", mode === "labs");
  if (tabMasteryBtn) tabMasteryBtn.classList.toggle("active", mode === "mastery");
  renderAll();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

if (tabModulesBtn) {
  tabModulesBtn.addEventListener("click", () => setActiveModeTab("modules"));
}
if (tabLabsBtn) {
  tabLabsBtn.addEventListener("click", () => setActiveModeTab("labs"));
}
if (tabMasteryBtn) {
  tabMasteryBtn.addEventListener("click", () => setActiveModeTab("mastery"));
}

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang;
    langButtons.forEach((b) => b.classList.toggle("active", b.dataset.lang === currentLang));
    renderAll();
  });
});

searchInputEl.addEventListener("input", () => {
  if (searchClearBtn) {
    searchClearBtn.style.display = searchInputEl.value ? "block" : "none";
  }
  filterAndRenderSidebar();
});

if (searchClearBtn) {
  searchClearBtn.addEventListener("click", () => {
    searchInputEl.value = "";
    searchClearBtn.style.display = "none";
    filterAndRenderSidebar();
    searchInputEl.focus();
  });
}

// ============================================================
// Study Completion Tracking System
// ============================================================
function isItemCompleted(key) {
  return !!completedItems[key];
}

function toggleItemCompleted(key) {
  if (completedItems[key]) {
    delete completedItems[key];
  } else {
    completedItems[key] = true;
  }
  localStorage.setItem("ccna_completed_items", JSON.stringify(completedItems));
  updateProgressSummary();
  filterAndRenderSidebar();
  updateLessonCompletionButtons();
  triggerAutoSync();
}

function updateLessonCompletionButtons() {
  const currentKey = getCurrentLessonNoteKey();
  const isDone = isItemCompleted(currentKey);
  const isEn = currentLang === "en";
  const btns = document.querySelectorAll(".lesson-complete-toggle-btn");
  btns.forEach((btn) => {
    btn.classList.toggle("completed", isDone);
    btn.innerHTML = isDone
      ? (isEn ? "✓ Completed this module" : "✓ Đã học xong học phần này")
      : (isEn ? "○ Mark as completed" : "○ Đánh dấu đã học xong");
  });
}

function updateProgressSummary() {
  const isEn = currentLang === "en";
  const totalModules = (modulesData && modulesData.length) || 17;
  let completedModulesCount = 0;
  for (let i = 1; i <= totalModules; i++) {
    if (completedItems["module-" + i]) completedModulesCount++;
  }
  const pct = Math.round((completedModulesCount / totalModules) * 100);
  if (progressPillText) {
    progressPillText.textContent = isEn
      ? `${completedModulesCount}/${totalModules} completed (${pct}%)`
      : `${completedModulesCount}/${totalModules} bài (${pct}%)`;
  }
  if (progressMiniFill) {
    progressMiniFill.style.width = `${pct}%`;
  }
}

// ============================================================
// Topbar Breadcrumb & Reading Progress Indicator
// ============================================================
function updateTopbarBreadcrumb() {
  if (!topbarBreadcrumb) return;
  const isEn = currentLang === "en";
  if (currentMode === "modules") {
    const mod = modulesData.find((m) => m.id === activeModuleId);
    if (mod) {
      const title = isEn ? mod.title : (mod.title_vi || mod.title);
      topbarBreadcrumb.textContent = isEn
        ? `Module ${String(mod.id).padStart(2, "0")}: ${title}`
        : `Học phần ${String(mod.id).padStart(2, "0")}: ${title}`;
    }
  } else if (currentMode === "labs") {
    const allLabs = typeof PACKET_TRACER_LABS !== "undefined" ? PACKET_TRACER_LABS : [];
    const lab = allLabs.find((l) => l.id === activeLabId);
    topbarBreadcrumb.textContent = lab
      ? (isEn
          ? `Lab ${String(lab.id).padStart(2, "0")}: ${lab.title_en || lab.title_vi.replace(/^Lab \d+:\s*/, "")}`
          : `Bài Lab ${String(lab.id).padStart(2, "0")}: ${lab.title_vi.replace(/^Lab \d+:\s*/, "")}`)
      : (isEn ? "35 Cisco Packet Tracer Hands-On Labs" : "35 Bài thực hành Lab Packet Tracer");
  } else if (currentMode === "mastery") {
    const allMastery = typeof CCNA_EXAM_MASTERY !== "undefined" ? CCNA_EXAM_MASTERY : [];
    const m = allMastery.find((item) => item.id === activeMasteryId);
    topbarBreadcrumb.textContent = m
      ? (isEn
          ? `Mastery ${String(m.id).padStart(2, "0")}: ${m.title_en || m.title_vi}`
          : `Chuyên đề ${String(m.id).padStart(2, "0")}: ${m.title_vi}`)
      : (isEn ? "10 CCNA Exam Mastery Topics" : "10 Chuyên đề tổng hợp CCNA");
  }
}

function updateReadingProgressBar() {
  if (!readingProgressBar) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  readingProgressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
}

window.addEventListener("scroll", updateReadingProgressBar, { passive: true });

// ============================================================
// Collapsible Sidebar Functions
// ============================================================
function applySidebarCollapsedState(collapsed) {
  isSidebarCollapsed = collapsed;
  document.body.classList.toggle("sidebar-collapsed", collapsed);
  localStorage.setItem("ccna_sidebar_collapsed", collapsed ? "true" : "false");
}

function toggleSidebar() {
  if (window.innerWidth <= 980) {
    if (appSidebarEl && appSidebarEl.classList.contains("open")) {
      closeMobileSidebar();
    } else {
      openMobileSidebar();
    }
  } else {
    applySidebarCollapsedState(!isSidebarCollapsed);
  }
}

if (sidebarToggleBtn) sidebarToggleBtn.addEventListener("click", toggleSidebar);
if (sidebarCollapseBtn) sidebarCollapseBtn.addEventListener("click", () => applySidebarCollapsedState(true));
if (floatingExpandBtn) floatingExpandBtn.addEventListener("click", () => applySidebarCollapsedState(false));

// ============================================================
// Theme & Font Size Controls
// ============================================================
function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("ccna_theme", theme);
  if (themeIcon) {
    if (theme === "dark") themeIcon.textContent = "🌙";
    else if (theme === "sepia") themeIcon.textContent = "📜";
    else themeIcon.textContent = "☀️";
  }
}

function cycleTheme() {
  if (currentTheme === "light") applyTheme("sepia");
  else if (currentTheme === "sepia") applyTheme("dark");
  else applyTheme("light");
}

if (themeSwitchBtn) themeSwitchBtn.addEventListener("click", cycleTheme);

function applyFontSize(size) {
  currentFontSize = Math.min(20, Math.max(14, size));
  document.documentElement.style.setProperty("--app-font-size", `${currentFontSize}px`);
  localStorage.setItem("ccna_font_size", String(currentFontSize));
}

if (fontDecreaseBtn) fontDecreaseBtn.addEventListener("click", () => applyFontSize(currentFontSize - 1));
if (fontResetBtn) fontResetBtn.addEventListener("click", () => applyFontSize(16.5));
if (fontIncreaseBtn) fontIncreaseBtn.addEventListener("click", () => applyFontSize(currentFontSize + 1));

if (brandHomeLink) {
  brandHomeLink.addEventListener("click", (e) => {
    e.preventDefault();
    currentMode = "modules";
    activeModuleId = 1;
    setActiveModeTab("modules");
    selectModule(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ============================================================
// Smart Notes System (Local Cache + Multi-Device Cloud Sync)
// ============================================================
function getCurrentLessonNoteKey() {
  if (currentMode === "labs") {
    return activeLabId > 0 ? `lab-${activeLabId}` : "labs-general";
  }
  if (currentMode === "mastery") {
    return activeMasteryId > 0 ? `mastery-${activeMasteryId}` : "mastery-general";
  }
  return `module-${activeModuleId}`;
}

function getCurrentLessonTitle() {
  if (currentMode === "labs") {
    const allLabs = typeof PACKET_TRACER_LABS !== "undefined" ? PACKET_TRACER_LABS : [];
    const lab = allLabs.find((l) => l.id === activeLabId);
    return lab ? `Bài Lab ${lab.id}: ${lab.title_vi}` : "35 Bài Lab Packet Tracer";
  }
  if (currentMode === "mastery") {
    const allMastery = typeof CCNA_EXAM_MASTERY !== "undefined" ? CCNA_EXAM_MASTERY : [];
    const m = allMastery.find((item) => item.id === activeMasteryId);
    return m ? `Chuyên Đề ${m.id}: ${m.title_vi}` : "10 Chuyên Đề Thi CCNA v2.0";
  }
  const mod = modulesData.find((m) => m.id === activeModuleId);
  return mod ? `Học phần ${mod.id}: ${mod.title_vi || mod.title}` : "Học phần CCNA";
}

function updateNotesCountBadges() {
  const count = Object.keys(studyNotes).length;
  if (notesCountBadge) {
    notesCountBadge.textContent = count;
    notesCountBadge.style.display = count > 0 ? "inline-block" : "none";
  }
  if (fabNoteBadge) {
    fabNoteBadge.textContent = count;
    fabNoteBadge.style.display = count > 0 ? "inline-block" : "none";
  }
  if (notesTabCounter) {
    notesTabCounter.textContent = `(${count})`;
  }
}

let currentNotesActivePanel = "current";

function openNotesModal(targetPanel = "current") {
  if (!notesModal) return;
  const isAlreadyOpen = !notesModal.hidden;
  if (isAlreadyOpen && currentNotesActivePanel === targetPanel) {
    closeNotesModal();
    return;
  }
  notesModal.hidden = false;
  document.body.classList.add("notes-sidebar-open");
  switchNotesPanel(targetPanel);
  loadCurrentNoteIntoEditor();
  renderAllNotesList();
  updateCloudSyncTabUI();
}

function closeNotesModal() {
  if (!notesModal) return;
  notesModal.hidden = true;
  document.body.classList.remove("notes-sidebar-open");
}

function switchNotesPanel(panelName) {
  currentNotesActivePanel = panelName;
  const panels = { current: panelCurrent, all: panelAll, sync: panelSync };
  const buttons = { current: noteTabCurrentBtn, all: noteTabAllBtn, sync: noteTabSyncBtn };

  Object.keys(panels).forEach((k) => {
    if (panels[k]) panels[k].classList.toggle("active", k === panelName);
    if (buttons[k]) buttons[k].classList.toggle("active", k === panelName);
  });
}

function loadCurrentNoteIntoEditor() {
  const key = getCurrentLessonNoteKey();
  const title = getCurrentLessonTitle();
  if (noteLessonTitle) noteLessonTitle.textContent = title;

  const existing = studyNotes[key];
  if (existing) {
    if (noteTitleInput) noteTitleInput.value = existing.title || "";
    if (noteContentInput) noteContentInput.value = existing.content || "";
    activeNoteTag = existing.tag || "exam";
    if (noteSaveTimestamp && existing.updatedAt) {
      const date = new Date(existing.updatedAt);
      noteSaveTimestamp.textContent = `(Lần lưu cuối: ${date.toLocaleTimeString("vi-VN")} ${date.toLocaleDateString("vi-VN")})`;
    }
  } else {
    if (noteTitleInput) noteTitleInput.value = "";
    if (noteContentInput) noteContentInput.value = "";
    activeNoteTag = "exam";
    if (noteSaveTimestamp) noteSaveTimestamp.textContent = "";
  }

  noteTagPills.forEach((p) => {
    p.classList.toggle("active", p.dataset.tag === activeNoteTag);
  });

  if (noteSaveStatusText) {
    noteSaveStatusText.textContent = "Tự động lưu & đẩy đám mây";
  }
}

function saveCurrentNote(isManual = false) {
  const key = getCurrentLessonNoteKey();
  const title = noteTitleInput ? noteTitleInput.value.trim() : "";
  const content = noteContentInput ? noteContentInput.value.trim() : "";

  if (!title && !content) {
    if (studyNotes[key]) {
      delete studyNotes[key];
      localStorage.setItem("ccna_study_notes", JSON.stringify(studyNotes));
      updateNotesCountBadges();
      renderAllNotesList();
      triggerAutoSync();
    }
    return;
  }

  studyNotes[key] = {
    key: key,
    title: title || getCurrentLessonTitle(),
    content: content,
    tag: activeNoteTag,
    lessonTitle: getCurrentLessonTitle(),
    lessonMode: currentMode,
    moduleId: activeModuleId,
    labId: activeLabId,
    masteryId: activeMasteryId,
    updatedAt: Date.now()
  };

  localStorage.setItem("ccna_study_notes", JSON.stringify(studyNotes));
  updateNotesCountBadges();

  if (noteSaveStatusText) {
    noteSaveStatusText.textContent = "Đang đồng bộ đám mây...";
  }
  if (noteSaveTimestamp) {
    const d = new Date();
    noteSaveTimestamp.textContent = `(${d.toLocaleTimeString("vi-VN")})`;
  }

  renderAllNotesList();
  triggerAutoSync();
}

function deleteCurrentNote() {
  const key = getCurrentLessonNoteKey();
  if (studyNotes[key]) {
    if (confirm("Bạn có chắc chắn muốn xóa ghi chú của bài học này không?")) {
      delete studyNotes[key];
      localStorage.setItem("ccna_study_notes", JSON.stringify(studyNotes));
      loadCurrentNoteIntoEditor();
      renderAllNotesList();
      updateNotesCountBadges();
      triggerAutoSync();
    }
  } else {
    if (noteTitleInput) noteTitleInput.value = "";
    if (noteContentInput) noteContentInput.value = "";
  }
}

function insertTextIntoNote(before, after = "") {
  if (!noteContentInput) return;
  const start = noteContentInput.selectionStart;
  const end = noteContentInput.selectionEnd;
  const text = noteContentInput.value;
  const selected = text.substring(start, end);
  const replacement = before + selected + after;
  noteContentInput.value = text.substring(0, start) + replacement + text.substring(end);
  noteContentInput.focus();
  noteContentInput.setSelectionRange(start + before.length, end + before.length);
  saveCurrentNote();
}

function renderAllNotesList() {
  if (!allNotesList) return;
  const query = allNotesSearchInput ? allNotesSearchInput.value.trim().toLowerCase() : "";
  const allKeys = Object.keys(studyNotes);

  if (allNotesTotalLabel) {
    allNotesTotalLabel.textContent = `Tổng cộng: ${allKeys.length} ghi chú`;
  }

  if (allKeys.length === 0) {
    allNotesList.innerHTML = `
      <div class="notes-empty-state">
        <span class="empty-icon">📝</span>
        <p>Bạn chưa có ghi chú nào. Hãy mở một học phần, chuyên đề hoặc bài Lab và ghi lại các mẹo, câu lệnh trọng tâm nhé!</p>
      </div>
    `;
    return;
  }

  const tagLabels = {
    exam: "⭐ Trọng tâm thi",
    tip: "💡 Mẹo ghi nhớ",
    cli: "💻 Lệnh CLI",
    trap: "⚠️ Bẫy đề thi",
    job: "💼 Đi làm thực tế"
  };

  const filtered = allKeys
    .map((k) => studyNotes[k])
    .filter((note) => {
      if (!query) return true;
      return (
        (note.title && note.title.toLowerCase().includes(query)) ||
        (note.content && note.content.toLowerCase().includes(query)) ||
        (note.lessonTitle && note.lessonTitle.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  if (filtered.length === 0) {
    allNotesList.innerHTML = `<p class="no-results">Không tìm thấy ghi chú nào khớp với từ khóa tìm kiếm.</p>`;
    return;
  }

  allNotesList.innerHTML = filtered
    .map((note) => {
      const d = note.updatedAt ? new Date(note.updatedAt) : new Date();
      const dateStr = `${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} ${d.toLocaleDateString("vi-VN")}`;
      const tagText = tagLabels[note.tag] || "⭐ Trọng tâm";
      return `
        <div class="note-card-item" data-key="${escapeHtml(note.key)}">
          <div class="note-card-top">
            <div class="note-card-badges">
              <span class="note-badge-lesson">${escapeHtml(note.lessonTitle || "Bài học")}</span>
              <span class="note-badge-tag">${escapeHtml(tagText)}</span>
            </div>
            <span class="note-card-time">${escapeHtml(dateStr)}</span>
          </div>
          <h4 class="note-card-title">${escapeHtml(note.title || "Ghi chú")}</h4>
          <p class="note-card-snippet">${escapeHtml(note.content || "")}</p>
          <div class="note-card-actions">
            <button type="button" class="note-card-btn jump-btn" data-key="${escapeHtml(note.key)}" data-mode="${escapeHtml(note.lessonMode || "modules")}" data-mod="${note.moduleId || 1}" data-lab="${note.labId || 0}" data-mastery="${note.masteryId || 0}">
              🚀 Mở bài học
            </button>
            <button type="button" class="note-card-btn edit-btn" data-key="${escapeHtml(note.key)}" data-mode="${escapeHtml(note.lessonMode || "modules")}" data-mod="${note.moduleId || 1}" data-lab="${note.labId || 0}" data-mastery="${note.masteryId || 0}">
              ✏️ Sửa
            </button>
            <button type="button" class="note-card-btn danger delete-btn" data-key="${escapeHtml(note.key)}">
              🗑️ Xóa
            </button>
          </div>
        </div>
      `;
    })
    .join("");

  allNotesList.querySelectorAll(".jump-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode || "modules";
      setActiveModeTab(mode);
      if (mode === "modules") selectModule(Number(btn.dataset.mod));
      else if (mode === "labs") renderLabsView(Number(btn.dataset.lab));
      else if (mode === "mastery") renderMasteryView(Number(btn.dataset.mastery));
      closeNotesModal();
    });
  });

  allNotesList.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode || "modules";
      setActiveModeTab(mode);
      if (mode === "modules") selectModule(Number(btn.dataset.mod));
      else if (mode === "labs") renderLabsView(Number(btn.dataset.lab));
      else if (mode === "mastery") renderMasteryView(Number(btn.dataset.mastery));
      switchNotesPanel("current");
      loadCurrentNoteIntoEditor();
    });
  });

  allNotesList.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const k = btn.dataset.key;
      if (confirm("Bạn có chắc chắn muốn xóa ghi chú này?")) {
        delete studyNotes[k];
        localStorage.setItem("ccna_study_notes", JSON.stringify(studyNotes));
        updateNotesCountBadges();
        renderAllNotesList();
        loadCurrentNoteIntoEditor();
        triggerAutoSync();
      }
    });
  });
}

function updateCloudSyncTabUI() {
  if (cloudSyncKeyDisplay) {
    cloudSyncKeyDisplay.value = cloudSyncKey;
  }
  updateQrCode();
}

function initSyncKey() {
  if (!cloudSyncKey) {
    cloudSyncKey = "ccna-" + Math.random().toString(36).substring(2, 8) + Date.now().toString(36).slice(-4);
    localStorage.setItem("ccna_cloud_sync_key", cloudSyncKey);
  }
  if (cloudSyncKeyDisplay) {
    cloudSyncKeyDisplay.value = cloudSyncKey;
  }
  updateQrCode();
}

function checkUrlForSyncParam() {
  try {
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(window.location.search);
    let keyFromUrl = urlParams.get("sync");
    if (!keyFromUrl && hash.includes("sync=")) {
      const match = hash.match(/sync=([^&]+)/);
      if (match) keyFromUrl = decodeURIComponent(match[1]);
    }
    if (keyFromUrl && keyFromUrl !== cloudSyncKey) {
      cloudSyncKey = keyFromUrl;
      localStorage.setItem("ccna_cloud_sync_key", cloudSyncKey);
      if (cloudSyncKeyDisplay) cloudSyncKeyDisplay.value = cloudSyncKey;
      pullNotesFromCloud(cloudSyncKey);
    }
  } catch {}
}

function updateQrCode() {
  if (!syncQrCodeImg || !cloudSyncKey) return;
  const shareUrl = `${window.location.origin}${window.location.pathname}#sync=${encodeURIComponent(cloudSyncKey)}`;
  syncQrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(shareUrl)}`;
}

function triggerAutoSync() {
  if (cloudSyncDebounceTimer) clearTimeout(cloudSyncDebounceTimer);
  cloudSyncDebounceTimer = setTimeout(() => {
    pushNotesToCloud();
  }, 700);
}

async function pushNotesToCloud() {
  if (!cloudSyncKey) return;
  setCloudSyncStatus("syncing", "Đang đồng bộ...");

  const payload = {
    name: "ccna-study-notes",
    data: {
      syncKey: cloudSyncKey,
      notes: studyNotes,
      completedItems: completedItems,
      updatedAt: Date.now()
    }
  };

  try {
    let success = false;
    try {
      const apiRes = await fetch(`/api/sync?key=${encodeURIComponent(cloudSyncKey)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (apiRes.ok) success = true;
    } catch {}

    if (!success) {
      const directUrl = `https://api.restful-api.dev/objects/${encodeURIComponent(cloudSyncKey)}`;
      let res = await fetch(directUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        await fetch("https://api.restful-api.dev/objects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
    }

    setCloudSyncStatus("synced", "Đã đồng bộ");
    if (noteSaveStatusText) {
      noteSaveStatusText.textContent = "Đã lưu & đồng bộ cloud";
    }
  } catch {
    setCloudSyncStatus("synced", "Đã lưu (Cục bộ)");
    if (noteSaveStatusText) {
      noteSaveStatusText.textContent = "Đã lưu (Cục bộ)";
    }
  }
}

async function pullNotesFromCloud(key, silent = false) {
  if (!key) return;
  if (!silent) setCloudSyncStatus("syncing", "Đang tải về...");

  try {
    let cloudData = null;
    try {
      const apiRes = await fetch(`/api/sync?key=${encodeURIComponent(key)}`);
      if (apiRes.ok) {
        const json = await apiRes.json();
        cloudData = json.data || json;
      }
    } catch {}

    if (!cloudData) {
      const directRes = await fetch(`https://api.restful-api.dev/objects/${encodeURIComponent(key)}`);
      if (directRes.ok) {
        const json = await directRes.json();
        cloudData = json.data || json;
      }
    }

    if (cloudData && cloudData.notes) {
      Object.keys(cloudData.notes).forEach((k) => {
        if (!studyNotes[k] || (cloudData.notes[k].updatedAt || 0) > (studyNotes[k].updatedAt || 0)) {
          studyNotes[k] = cloudData.notes[k];
        }
      });
      if (cloudData.completedItems) {
        completedItems = { ...completedItems, ...cloudData.completedItems };
        localStorage.setItem("ccna_completed_items", JSON.stringify(completedItems));
      }
      localStorage.setItem("ccna_study_notes", JSON.stringify(studyNotes));
      updateNotesCountBadges();
      loadCurrentNoteIntoEditor();
      renderAllNotesList();
      updateProgressSummary();
      filterAndRenderSidebar();
      setCloudSyncStatus("synced", "Đã đồng bộ đám mây");
      if (!silent) {
        alert("Đã kết nối và đồng bộ toàn bộ ghi chú từ đám mây thành công!");
      }
    } else {
      if (!silent) alert("Không tìm thấy dữ liệu ghi chú trên đám mây với mã này.");
      setCloudSyncStatus("synced", "Chưa có dữ liệu mây");
    }
  } catch {
    if (!silent) alert("Không thể kết nối đến máy chủ đồng bộ. Vui lòng kiểm tra lại kết nối mạng.");
    setCloudSyncStatus("synced", "Đã lưu (Cục bộ)");
  }
}

function setCloudSyncStatus(status, text) {
  if (cloudSyncStatusBadge) {
    cloudSyncStatusBadge.className = `cloud-sync-status-badge ${status}`;
  }
  if (cloudSyncStatusText) {
    cloudSyncStatusText.textContent = text;
  }
}

function exportNotesJson() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
    syncKey: cloudSyncKey,
    notes: studyNotes,
    completedItems: completedItems,
    exportedAt: new Date().toISOString()
  }, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", `ccna_study_notes_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
}

function importNotesJson(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed.notes) {
        studyNotes = { ...studyNotes, ...parsed.notes };
        localStorage.setItem("ccna_study_notes", JSON.stringify(studyNotes));
      }
      if (parsed.completedItems) {
        completedItems = { ...completedItems, ...parsed.completedItems };
        localStorage.setItem("ccna_completed_items", JSON.stringify(completedItems));
      }
      if (parsed.syncKey) {
        cloudSyncKey = parsed.syncKey;
        localStorage.setItem("ccna_cloud_sync_key", cloudSyncKey);
        if (cloudSyncKeyDisplay) cloudSyncKeyDisplay.value = cloudSyncKey;
      }
      updateNotesCountBadges();
      loadCurrentNoteIntoEditor();
      renderAllNotesList();
      updateProgressSummary();
      filterAndRenderSidebar();
      triggerAutoSync();
      alert("Đã nhập dữ liệu ghi chú thành công!");
    } catch {
      alert("File sao lưu không hợp lệ.");
    }
  };
  reader.readAsText(file);
}

function initNotesSystem() {
  if (noteTabCurrentBtn) noteTabCurrentBtn.addEventListener("click", () => switchNotesPanel("current"));
  if (noteTabAllBtn) noteTabAllBtn.addEventListener("click", () => switchNotesPanel("all"));
  if (noteTabSyncBtn) noteTabSyncBtn.addEventListener("click", () => switchNotesPanel("sync"));

  if (openNotesBtn) openNotesBtn.addEventListener("click", () => openNotesModal("current"));
  if (floatingNoteFab) floatingNoteFab.addEventListener("click", () => openNotesModal("current"));
  if (notesCloseBtn) notesCloseBtn.addEventListener("click", closeNotesModal);
  if (notesBackdrop) notesBackdrop.addEventListener("click", closeNotesModal);

  const onNoteInputChange = () => {
    if (noteSaveStatusText) noteSaveStatusText.textContent = "Đang lưu...";
    if (noteSaveDebounceTimer) clearTimeout(noteSaveDebounceTimer);
    noteSaveDebounceTimer = setTimeout(() => {
      saveCurrentNote();
    }, 350);
  };

  if (noteTitleInput) noteTitleInput.addEventListener("input", onNoteInputChange);
  if (noteContentInput) noteContentInput.addEventListener("input", onNoteInputChange);

  if (noteSaveManualBtn) noteSaveManualBtn.addEventListener("click", () => saveCurrentNote(true));
  if (noteDeleteCurrentBtn) noteDeleteCurrentBtn.addEventListener("click", deleteCurrentNote);

  noteTagPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      noteTagPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      activeNoteTag = pill.dataset.tag;
      saveCurrentNote();
    });
  });

  if (toolBoldBtn) toolBoldBtn.addEventListener("click", () => insertTextIntoNote("**", "**"));
  if (toolItalicBtn) toolItalicBtn.addEventListener("click", () => insertTextIntoNote("*", "*"));
  if (toolCodeBtn) toolCodeBtn.addEventListener("click", () => insertTextIntoNote("`", "`"));
  if (toolListBtn) toolListBtn.addEventListener("click", () => insertTextIntoNote("\n• "));
  if (toolInsertCliBtn) {
    toolInsertCliBtn.addEventListener("click", () => {
      const mod = modulesData.find((m) => m.id === activeModuleId);
      if (mod && mod.commands && mod.commands.length > 0) {
        const cmdBlock = `\n\`\`\`cisco\n${mod.commands.slice(0, 5).join("\n")}\n\`\`\`\n`;
        insertTextIntoNote(cmdBlock);
      }
    });
  }

  if (allNotesSearchInput) {
    allNotesSearchInput.addEventListener("input", renderAllNotesList);
  }

  if (syncCopyKeyBtn) {
    syncCopyKeyBtn.addEventListener("click", async () => {
      if (!cloudSyncKey) return;
      await navigator.clipboard.writeText(cloudSyncKey);
      syncCopyKeyBtn.textContent = "✓ Đã sao chép";
      setTimeout(() => (syncCopyKeyBtn.textContent = "📋 Sao chép"), 1800);
    });
  }

  if (syncNowBtn) {
    syncNowBtn.addEventListener("click", () => pushNotesToCloud());
  }

  if (syncCopyLinkBtn) {
    syncCopyLinkBtn.addEventListener("click", async () => {
      const shareUrl = `${window.location.origin}${window.location.pathname}#sync=${encodeURIComponent(cloudSyncKey)}`;
      await navigator.clipboard.writeText(shareUrl);
      syncCopyLinkBtn.textContent = "✓ Đã sao chép link!";
      setTimeout(() => (syncCopyLinkBtn.textContent = "🔗 Sao chép link mở trên điện thoại"), 1800);
    });
  }

  if (syncConnectKeyBtn) {
    syncConnectKeyBtn.addEventListener("click", () => {
      const key = cloudSyncKeyInput ? cloudSyncKeyInput.value.trim() : "";
      if (!key) {
        alert("Vui lòng nhập mã đồng bộ.");
        return;
      }
      cloudSyncKey = key;
      localStorage.setItem("ccna_cloud_sync_key", cloudSyncKey);
      if (cloudSyncKeyDisplay) cloudSyncKeyDisplay.value = cloudSyncKey;
      pullNotesFromCloud(key);
      updateQrCode();
    });
  }

  if (backupExportBtn) backupExportBtn.addEventListener("click", exportNotesJson);
  if (backupImportFile) {
    backupImportFile.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        importNotesJson(e.target.files[0]);
      }
    });
  }
}

// --------------------------------------------------------------------------
// Collapsible Sections & Lesson Focus Controls
// --------------------------------------------------------------------------
function attachSectionCollapseEvents() {
  const headerWraps = document.querySelectorAll(".section-header-wrap");
  headerWraps.forEach((header) => {
    header.addEventListener("click", (e) => {
      // Don't toggle if clicking an interactive element inside actions (e.g. copy or view lab button)
      if (e.target.closest("button") || e.target.closest("a") || e.target.closest("input")) {
        return;
      }
      const sectionBlock = header.closest(".section-block");
      if (sectionBlock) {
        sectionBlock.classList.toggle("is-collapsed");
      }
    });

    header.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const sectionBlock = header.closest(".section-block");
        if (sectionBlock) {
          sectionBlock.classList.toggle("is-collapsed");
        }
      }
    });
  });

  const collapseAllBtn = document.getElementById("collapse-all-sections-btn");
  if (collapseAllBtn) {
    collapseAllBtn.addEventListener("click", () => {
      const blocks = document.querySelectorAll("#module-detail .section-block");
      blocks.forEach((b) => b.classList.add("is-collapsed"));
    });
  }

  const expandAllBtn = document.getElementById("expand-all-sections-btn");
  if (expandAllBtn) {
    expandAllBtn.addEventListener("click", () => {
      const blocks = document.querySelectorAll("#module-detail .section-block");
      blocks.forEach((b) => b.classList.remove("is-collapsed"));
    });
  }

  // Quick jump pill smooth scroll & uncollapse target if collapsed
  const quickJumpLinks = document.querySelectorAll(".quick-jump-pill");
  quickJumpLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href");
      const targetId = href ? href.replace("#", "") : null;
      if (!targetId) return;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const parentBlock = targetEl.closest(".section-block");
        if (parentBlock && parentBlock.classList.contains("is-collapsed")) {
          parentBlock.classList.remove("is-collapsed");
        }
      }
    });
  });
}

// --------------------------------------------------------------------------
// Draggable Notes Sidebar Resizer
// --------------------------------------------------------------------------
function initNotesResizer() {
  const resizer = document.getElementById("notes-resizer");
  if (!resizer) return;

  const savedWidth = localStorage.getItem("ccna_notes_sidebar_width");
  if (savedWidth) {
    document.documentElement.style.setProperty("--notes-sidebar-width", savedWidth);
  }

  let isResizing = false;

  const startResize = (e) => {
    if (window.innerWidth <= 1024) return; // Only enable drag on desktop
    isResizing = true;
    resizer.classList.add("is-resizing");
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    e.preventDefault();
  };

  const doResize = (clientX) => {
    if (!isResizing) return;
    const calculatedWidth = window.innerWidth - clientX;
    const clampedWidth = Math.min(Math.max(calculatedWidth, 320), Math.min(window.innerWidth * 0.75, 880));
    document.documentElement.style.setProperty("--notes-sidebar-width", `${clampedWidth}px`);
  };

  const stopResize = () => {
    if (!isResizing) return;
    isResizing = false;
    resizer.classList.remove("is-resizing");
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    const currentWidth = getComputedStyle(document.documentElement).getPropertyValue("--notes-sidebar-width");
    if (currentWidth) {
      localStorage.setItem("ccna_notes_sidebar_width", currentWidth.trim());
    }
  };

  resizer.addEventListener("mousedown", startResize);
  window.addEventListener("mousemove", (e) => doResize(e.clientX));
  window.addEventListener("mouseup", stopResize);

  // Touch support for tablets/stylus
  resizer.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches[0]) startResize(e);
  }, { passive: false });
  window.addEventListener("touchmove", (e) => {
    if (isResizing && e.touches && e.touches[0]) doResize(e.touches[0].clientX);
  });
  window.addEventListener("touchend", stopResize);
}

// --------------------------------------------------------------------------
// Zen / Focus Mode
// --------------------------------------------------------------------------
function initZenMode() {
  const zenBtn = document.getElementById("zen-mode-btn");
  if (!zenBtn) return;

  const savedZen = localStorage.getItem("ccna_zen_mode") === "true";
  if (savedZen) {
    document.body.classList.add("zen-mode");
    zenBtn.classList.add("active");
  }

  zenBtn.addEventListener("click", () => {
    const isZen = document.body.classList.toggle("zen-mode");
    zenBtn.classList.toggle("active", isZen);
    localStorage.setItem("ccna_zen_mode", isZen ? "true" : "false");
  });
}

// --------------------------------------------------------------------------
// Text Selection Floating Toolbar (Highlight & Quick Quote into Note)
// --------------------------------------------------------------------------
function initTextSelectionHighlighter() {
  const tooltip = document.getElementById("selection-tooltip");
  const addToNoteBtn = document.getElementById("sel-add-to-note-btn");
  if (!tooltip) return;

  let currentSelectedText = "";
  let currentSelectionRange = null;

  const handleSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      tooltip.hidden = true;
      currentSelectedText = "";
      currentSelectionRange = null;
      return;
    }

    const text = sel.toString().trim();
    if (text.length < 3) {
      tooltip.hidden = true;
      currentSelectedText = "";
      currentSelectionRange = null;
      return;
    }

    // Check if selection is within #module-detail
    const anchorNode = sel.anchorNode;
    if (!anchorNode) return;
    const container = anchorNode.nodeType === 3 ? anchorNode.parentElement : anchorNode;
    if (!container || !container.closest("#module-detail")) {
      tooltip.hidden = true;
      return;
    }

    currentSelectedText = text;
    currentSelectionRange = sel.getRangeAt(0).cloneRange();

    const rect = currentSelectionRange.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    tooltip.style.left = `${Math.max(10, rect.left + scrollX + (rect.width / 2) - 110)}px`;
    tooltip.style.top = `${Math.max(10, rect.top + scrollY - 45)}px`;
    tooltip.hidden = false;
  };

  document.addEventListener("mouseup", (e) => {
    if (tooltip.contains(e.target)) return;
    setTimeout(handleSelection, 25);
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "Shift" || e.key.startsWith("Arrow")) {
      setTimeout(handleSelection, 25);
    }
  });

  document.addEventListener("mousedown", (e) => {
    if (tooltip && !tooltip.contains(e.target)) {
      tooltip.hidden = true;
    }
  });

  // Color Highlight Buttons
  const colorBtns = tooltip.querySelectorAll(".sel-btn[data-color]");
  colorBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const color = btn.dataset.color;
      if (!currentSelectionRange) return;

      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(currentSelectionRange);

      if (color === "none") {
        // Strip mark elements within selection
        const contents = currentSelectionRange.extractContents();
        const walker = document.createTreeWalker(contents, NodeFilter.SHOW_ELEMENT);
        const marksToRemove = [];
        let node;
        while ((node = walker.nextNode())) {
          if (node.tagName === "MARK") marksToRemove.push(node);
        }
        marksToRemove.forEach((m) => {
          m.replaceWith(...m.childNodes);
        });
        currentSelectionRange.insertNode(contents);
      } else {
        const mark = document.createElement("mark");
        mark.className = `ccna-hl-${color}`;
        try {
          currentSelectionRange.surroundContents(mark);
        } catch {
          const contents = currentSelectionRange.extractContents();
          mark.appendChild(contents);
          currentSelectionRange.insertNode(mark);
        }
      }

      sel.removeAllRanges();
      tooltip.hidden = true;
    });
  });

  // Quote into Note
  if (addToNoteBtn) {
    addToNoteBtn.addEventListener("click", () => {
      if (!currentSelectedText) return;
      const quoteBlock = `\n> ${currentSelectedText.replace(/\n+/g, "\n> ")}\n\n`;
      insertTextIntoNote(quoteBlock);
      openNotesModal("current");
      tooltip.hidden = true;
      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
    });
  }
}

// --------------------------------------------------------------------------
// Interactive Flashcards Study Deck System (Multi-Category, Multi-Module, Bilingual)
// --------------------------------------------------------------------------
let flashcardDeck = [];
let currentFlashcardIndex = 0;
let isFlashcardFlipped = false;
let flashcardCurrentScope = "current";
let flashcardCurrentCategory = "all";

function buildFlashcardDeck(targetModId = null, targetCategory = "all") {
  const isEn = currentLang === "en";
  const deck = [];
  const useAllModules = targetModId === "all" || (targetModId === null && flashcardCurrentScope === "all");
  const modulesToScan = useAllModules
    ? (modulesData.length > 0 ? modulesData : [])
    : (modulesData.filter((m) => m.id === (typeof targetModId === "number" ? targetModId : activeModuleId)));

  modulesToScan.forEach((m) => {
    // 1. Cisco IOS CLI Commands
    if ((targetCategory === "all" || targetCategory === "cli") && m.commands && Array.isArray(m.commands)) {
      m.commands.forEach((cmdLine) => {
        if (!cmdLine || typeof cmdLine !== "string") return;
        const commentMatch = cmdLine.match(/^(.+?\s)(#\s.*)$/);
        const cmdOnly = commentMatch ? commentMatch[1].trim() : cmdLine.trim();
        const commentOnly = commentMatch ? commentMatch[2].replace(/^#\s*/, "").trim() : "";
        if (!cmdOnly) return;

        const frontHtml = isEn
          ? `What is the syntax and purpose of this Cisco IOS command?<br/><div style="margin-top:0.8rem;"><code class="inline-code" style="font-size:1.05rem;">${escapeHtml(cmdOnly)}</code></div>`
          : `Cú pháp &amp; Ý nghĩa của câu lệnh Cisco IOS này là gì?<br/><div style="margin-top:0.8rem;"><code class="inline-code" style="font-size:1.05rem;">${escapeHtml(cmdOnly)}</code></div>`;
        
        const backHtml = isEn
          ? `<strong>Cisco Command:</strong> <code class="inline-code">${escapeHtml(cmdOnly)}</code><br/><br/>${commentOnly ? `<strong>Function / Usage:</strong> ${escapeHtml(commentOnly)}<br/><br/>` : ""}<strong>Module:</strong> Module ${m.id} (${escapeHtml(m.title || "")})`
          : `<strong>Câu lệnh Cisco:</strong> <code class="inline-code">${escapeHtml(cmdOnly)}</code><br/><br/>${commentOnly ? `<strong>Mục đích &amp; Ý nghĩa:</strong> ${escapeHtml(commentOnly)}<br/><br/>` : ""}<strong>Thuộc bài học:</strong> Học phần ${m.id} (${escapeHtml(m.title_vi || m.title)})`;

        deck.push({
          modId: m.id,
          category: "cli",
          type: isEn ? "Cisco IOS CLI" : "Lệnh Cisco IOS",
          front: frontHtml,
          back: backHtml
        });
      });
    }

    // 2. CCNA Exam Practice Quizzes
    const modQuizList = (isEn && typeof CCNA_QUIZ_EN !== "undefined" && CCNA_QUIZ_EN[m.id])
      ? CCNA_QUIZ_EN[m.id]
      : (m.quiz && Array.isArray(m.quiz) ? m.quiz : []);

    if ((targetCategory === "all" || targetCategory === "quiz") && modQuizList.length > 0) {
      modQuizList.forEach((q, qIdx) => {
        const qText = isEn ? (q.question_en || q.question_vi) : q.question_vi;
        const opts = isEn ? (q.options_en || q.options_vi) : q.options_vi;
        const exp = isEn ? (q.explanation_en || q.explanation_vi) : q.explanation_vi;
        const correctOpt = opts && opts[q.answerIndex] ? opts[q.answerIndex] : "";

        deck.push({
          modId: m.id,
          category: "quiz",
          type: isEn ? "Exam Quiz" : "Trắc nghiệm ôn thi",
          front: `<strong>${isEn ? `Question ${qIdx + 1}:` : `Câu hỏi ${qIdx + 1}:`}</strong><br/><br/>${formatRichText(qText)}`,
          back: `<strong>${isEn ? "Correct Answer:" : "Đáp án đúng:"}</strong> <span style="color:#22c55e;">${escapeHtml(correctOpt)}</span><br/><br/><strong>${isEn ? "Detailed Explanation:" : "Giải thích chi tiết:"}</strong><br/>${formatRichText(exp)}`
        });
      });
    }

    // 3. Technical Glossary & Deep Terms
    if ((targetCategory === "all" || targetCategory === "concepts") && typeof MODULE_DEEP_GLOSSARY !== "undefined" && MODULE_DEEP_GLOSSARY[m.id]) {
      MODULE_DEEP_GLOSSARY[m.id].forEach((g) => {
        deck.push({
          modId: m.id,
          category: "concepts",
          type: isEn ? "Glossary Term" : "Thuật ngữ",
          front: `<strong>${escapeHtml(g.term)}</strong><br/><br/><span style="font-size:0.85rem;color:var(--text-muted);">${isEn ? "What is the technical definition and core mechanism?" : "Khái niệm kỹ thuật và cơ chế hoạt động là gì?"}</span>`,
          back: `<strong>${isEn ? "Core Definition:" : "Khái niệm căn bản:"}</strong> ${escapeHtml(g.simple_vi)}<br/><br/><strong>${isEn ? "Mechanism & Deep Dive:" : "Phân tích chuyên sâu:"}</strong> ${escapeHtml(g.detail_vi)}<br/><br/><strong>${isEn ? "Exam Note:" : "Lưu ý thi CCNA:"}</strong> ${escapeHtml(g.example_vi)}`
        });
      });
    }

    // 4. Core Concepts & Foundations
    if (targetCategory === "all" || targetCategory === "concepts") {
      const concepts = isEn
        ? (m.keyConcepts && m.keyConcepts.length > 0 ? m.keyConcepts : m.keyConcepts_vi || [])
        : (m.keyConcepts_vi || m.keyConcepts || []);

      concepts.forEach((c, idx) => {
        const parts = c.split(":");
        if (parts.length > 1) {
          deck.push({
            modId: m.id,
            category: "concepts",
            type: isEn ? "Core Concept" : "Khái niệm cốt lõi",
            front: `<strong>${escapeHtml(parts[0].trim())}</strong><br/><br/><span style="font-size:0.85rem;color:var(--text-muted);">${isEn ? "Explain the principle and mechanism:" : "Giải thích nguyên lý và cơ chế kỹ thuật:"}</span>`,
            back: formatRichText(parts.slice(1).join(":").trim())
          });
        } else {
          deck.push({
            modId: m.id,
            category: "concepts",
            type: isEn ? "Key Takeaway" : "Điểm mấu chốt",
            front: isEn ? `Module ${m.id} — Technical Principle ${idx + 1}` : `Học phần ${m.id} — Điểm mấu chốt ${idx + 1}`,
            back: formatRichText(c)
          });
        }
      });

      // Also Beginner Guides
      const bgList = isEn ? (m.beginnerGuide_en || m.beginnerGuide_vi || []) : (m.beginnerGuide_vi || []);
      bgList.forEach((b) => {
        const colonIdx = b.indexOf(":");
        if (colonIdx > 0 && colonIdx < 80) {
          deck.push({
            modId: m.id,
            category: "concepts",
            type: isEn ? "Beginner Foundation" : "Nhập môn căn bản",
            front: `<strong>${formatRichText(b.slice(0, colonIdx))}</strong>`,
            back: formatRichText(b.slice(colonIdx + 1).trim())
          });
        }
      });
    }

    // 5. Job Skills & Real-World Troubleshooting
    const modSkillsList = isEn
      ? ((typeof CCNA_JOB_SKILLS_EN !== "undefined" && CCNA_JOB_SKILLS_EN[m.id]) || (m.jobSkills_en && m.jobSkills_en.length > 0 ? m.jobSkills_en : m.jobSkills_vi || []))
      : (m.jobSkills_vi || []);

    if ((targetCategory === "all" || targetCategory === "skills") && Array.isArray(modSkillsList)) {
      modSkillsList.forEach((skill) => {
        const colonIdx = skill.indexOf(":");
        if (colonIdx > 0 && colonIdx < 100) {
          deck.push({
            modId: m.id,
            category: "skills",
            type: isEn ? "Field Skill" : "Kỹ năng thực chiến",
            front: `<strong>${formatRichText(skill.slice(0, colonIdx))}</strong><br/><br/><span style="font-size:0.85rem;color:var(--text-muted);">${isEn ? "How does a network engineer solve this in production?" : "Kỹ sư mạng xử lý tình huống này trong thực tế như thế nào?"}</span>`,
            back: formatRichText(skill.slice(colonIdx + 1).trim())
          });
        } else {
          deck.push({
            modId: m.id,
            category: "skills",
            type: isEn ? "Field Skill" : "Kỹ năng thực chiến",
            front: isEn ? `Production Engineering Case (Module ${m.id})` : `Kinh nghiệm đi làm thực tế (Bài ${m.id})`,
            back: formatRichText(skill)
          });
        }
      });
    }
  });

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function renderCurrentFlashcard() {
  const isEn = currentLang === "en";
  const counterEl = document.getElementById("flashcard-counter");
  const cardTextEl = document.getElementById("flashcard-card-text");
  const hintPillEl = document.getElementById("flashcard-hint-pill");
  const flipperEl = document.getElementById("flashcard-flipper");
  const prevBtn = document.getElementById("flashcard-prev-btn");
  const nextBtn = document.getElementById("flashcard-next-btn");

  if (!cardTextEl || flashcardDeck.length === 0) {
    if (cardTextEl) cardTextEl.innerHTML = isEn ? "No flashcards match this filter criteria." : "Không có thẻ ghi nhớ nào phù hợp với bộ lọc đã chọn.";
    if (counterEl) counterEl.textContent = "0 / 0";
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
    return;
  }

  const card = flashcardDeck[currentFlashcardIndex];
  if (counterEl) counterEl.textContent = `${currentFlashcardIndex + 1} / ${flashcardDeck.length}`;

  if (prevBtn) prevBtn.disabled = currentFlashcardIndex === 0;
  if (nextBtn) nextBtn.disabled = currentFlashcardIndex === flashcardDeck.length - 1;

  if (isFlashcardFlipped) {
    if (flipperEl) flipperEl.classList.add("is-flipped");
    if (hintPillEl) hintPillEl.textContent = isEn
      ? `Answer & Explanation [${card.type} — Module ${card.modId}]`
      : `Đáp án & Giải thích [${card.type} — Bài ${card.modId}]`;
    cardTextEl.innerHTML = card.back;
  } else {
    if (flipperEl) flipperEl.classList.remove("is-flipped");
    if (hintPillEl) hintPillEl.textContent = isEn
      ? `Question / Prompt [${card.type} — Module ${card.modId}] (Click or press Space to reveal)`
      : `Câu hỏi / Khái niệm [${card.type} — Bài ${card.modId}] (Bấm để lật)`;
    cardTextEl.innerHTML = card.front;
  }
}

function reloadFlashcardDeck() {
  const scopeSelect = document.getElementById("flashcard-scope-select");
  const catSelect = document.getElementById("flashcard-category-select");

  if (scopeSelect) flashcardCurrentScope = scopeSelect.value;
  if (catSelect) flashcardCurrentCategory = catSelect.value;

  const targetId = flashcardCurrentScope === "all" ? "all" : activeModuleId;
  flashcardDeck = buildFlashcardDeck(targetId, flashcardCurrentCategory);
  currentFlashcardIndex = 0;
  isFlashcardFlipped = false;
  renderCurrentFlashcard();
}

function openFlashcardsModal(targetModId = null) {
  const modal = document.getElementById("flashcard-modal");
  if (!modal) return;

  const scopeSelect = document.getElementById("flashcard-scope-select");
  if (scopeSelect) {
    if (targetModId === "all") {
      scopeSelect.value = "all";
      flashcardCurrentScope = "all";
    } else {
      scopeSelect.value = "current";
      flashcardCurrentScope = "current";
    }
  }

  reloadFlashcardDeck();
  modal.hidden = false;
}

function closeFlashcardsModal() {
  const modal = document.getElementById("flashcard-modal");
  if (modal) modal.hidden = true;
}

function initFlashcardsSystem() {
  const openTopbarBtn = document.getElementById("open-flashcards-btn");
  const closeBtn = document.getElementById("flashcard-close-btn");
  const backdrop = document.getElementById("flashcard-backdrop");
  const flipTrigger = document.getElementById("flashcard-flip-trigger");
  const flipBtn = document.getElementById("flashcard-flip-btn");
  const prevBtn = document.getElementById("flashcard-prev-btn");
  const nextBtn = document.getElementById("flashcard-next-btn");
  const shuffleBtn = document.getElementById("flashcard-shuffle-btn");
  const scopeSelect = document.getElementById("flashcard-scope-select");
  const catSelect = document.getElementById("flashcard-category-select");

  if (openTopbarBtn) {
    openTopbarBtn.addEventListener("click", () => openFlashcardsModal("all"));
  }
  if (closeBtn) closeBtn.addEventListener("click", closeFlashcardsModal);
  if (backdrop) backdrop.addEventListener("click", closeFlashcardsModal);

  if (scopeSelect) {
    scopeSelect.addEventListener("change", reloadFlashcardDeck);
  }
  if (catSelect) {
    catSelect.addEventListener("change", reloadFlashcardDeck);
  }
  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", () => {
      // Re-shuffle deck
      for (let i = flashcardDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcardDeck[i], flashcardDeck[j]] = [flashcardDeck[j], flashcardDeck[i]];
      }
      currentFlashcardIndex = 0;
      isFlashcardFlipped = false;
      renderCurrentFlashcard();
    });
  }

  const toggleFlip = () => {
    isFlashcardFlipped = !isFlashcardFlipped;
    renderCurrentFlashcard();
  };

  if (flipTrigger) flipTrigger.addEventListener("click", toggleFlip);
  if (flipBtn) {
    flipBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFlip();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentFlashcardIndex > 0) {
        currentFlashcardIndex--;
        isFlashcardFlipped = false;
        renderCurrentFlashcard();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentFlashcardIndex < flashcardDeck.length - 1) {
        currentFlashcardIndex++;
        isFlashcardFlipped = false;
        renderCurrentFlashcard();
      }
    });
  }

  window.addEventListener("keydown", (e) => {
    const modal = document.getElementById("flashcard-modal");
    if (!modal || modal.hidden) return;

    if (e.key === "Escape") {
      closeFlashcardsModal();
    } else if (e.key === " " && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA" && e.target.tagName !== "SELECT") {
      e.preventDefault();
      toggleFlip();
    } else if (e.key === "ArrowLeft") {
      if (currentFlashcardIndex > 0) {
        currentFlashcardIndex--;
        isFlashcardFlipped = false;
        renderCurrentFlashcard();
      }
    } else if (e.key === "ArrowRight") {
      if (currentFlashcardIndex < flashcardDeck.length - 1) {
        currentFlashcardIndex++;
        isFlashcardFlipped = false;
        renderCurrentFlashcard();
      }
    }
  });
}

// Responsive Mobile Sidebar Drawer & Photo Lightbox & Back-to-Top Logic
const appSidebarEl = document.getElementById("app-sidebar");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const sidebarCloseBtn = document.getElementById("sidebar-close-btn");
const sidebarBackdrop = document.getElementById("sidebar-backdrop");
const backToTopBtn = document.getElementById("back-to-top-btn");
const lightboxModal = document.getElementById("lightbox-modal");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxCloseBtn = document.getElementById("lightbox-close-btn");

function openMobileSidebar() {
  if (appSidebarEl) appSidebarEl.classList.add("open");
  if (sidebarBackdrop) sidebarBackdrop.classList.add("visible");
  if (mobileMenuBtn) mobileMenuBtn.setAttribute("aria-expanded", "true");
}

function closeMobileSidebar() {
  if (appSidebarEl) appSidebarEl.classList.remove("open");
  if (sidebarBackdrop) sidebarBackdrop.classList.remove("visible");
  if (mobileMenuBtn) mobileMenuBtn.setAttribute("aria-expanded", "false");
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", openMobileSidebar);
if (sidebarCloseBtn) sidebarCloseBtn.addEventListener("click", closeMobileSidebar);
if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", closeMobileSidebar);

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function attachPhotoLightboxEvents() {
  const cards = moduleDetailEl.querySelectorAll(".photo-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const src = card.dataset.fullsrc;
      const title = card.dataset.title || "";
      const desc = card.dataset.desc || "";
      if (lightboxModal && lightboxImg && lightboxCaption && src) {
        lightboxImg.src = src;
        lightboxImg.alt = title;
        lightboxCaption.innerHTML = `<strong>📸 ${escapeHtml(title)}</strong><div style="margin-top:0.35rem;">${escapeHtml(desc)}</div>`;
        lightboxModal.hidden = false;
      }
    });
  });
}

if (lightboxCloseBtn && lightboxModal) {
  lightboxCloseBtn.addEventListener("click", () => {
    lightboxModal.hidden = true;
  });
  lightboxModal.addEventListener("click", (e) => {
    if (e.target === lightboxModal) lightboxModal.hidden = true;
  });
}

// Global Keyboard Shortcuts (Ctrl+B: Sidebar, Alt+N: Notes, Esc: Modals)
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && (e.key === "b" || e.key === "B")) {
    e.preventDefault();
    toggleSidebar();
    return;
  }
  if (e.altKey && (e.key === "n" || e.key === "N")) {
    e.preventDefault();
    if (notesModal && !notesModal.hidden) {
      closeNotesModal();
    } else {
      openNotesModal("current");
    }
    return;
  }
  if (e.key === "Escape") {
    if (notesModal && !notesModal.hidden) {
      closeNotesModal();
      return;
    }
    if (lightboxModal && !lightboxModal.hidden) {
      lightboxModal.hidden = true;
      return;
    }
  }
});

document.addEventListener("DOMContentLoaded", initApp);

// Fallback dataset for direct file:// opening
const FALLBACK_CCNA_DATA = [
    {
        "id":  1,
        "title":  "Networking Today",
        "title_vi":  "Mạng Máy Tính Ngày Nay",
        "overview":  "Module 1 introduces the fundamental architecture of modern computer networks. Every network consists of three core building blocks: End Devices (hosts such as PCs, servers, IP phones, smartphones), Intermediary Devices (switches, routers, wireless access points, firewalls that forward traffic), and Network Media (copper cables, fiber-optic cables, and wireless radio waves). Modern enterprise networks are converged—carrying data, voice, and video over the same infrastructure—and must satisfy four foundational architecture requirements: Fault Tolerance, Scalability, Quality of Service (QoS), and Security.",
        "overview_vi":  "Module 1 giới thiệu nền tảng cốt lõi của mạng máy tính hiện đại. Hãy hình dung mạng máy tính giống như hệ thống giao thông quốc gia: Thiết bị đầu cuối (End Devices như PC, điện thoại, Server) là các ngôi nhà và nhà máy gửi/nhận hàng hóa; Phương tiện truyền dẫn (Network Media như cáp đồng, cáp quang, sóng Wi-Fi) là những con đường; còn Thiết bị trung gian (Intermediary Devices như Switch, Router, Firewall) chính là các vòng xoay, ngã tư có đèn tín hiệu và trạm kiểm soát giúp định hướng gói tin đi đúng đích. Mạng hiện đại là \u0027mạng hội tụ\u0027 (Converged Network) — truyền cả dữ liệu web, giọng nói (VoIP) và video trên cùng một hạ tầng cáp duy nhất, đòi hỏi 4 yếu tố sống còn: Khả năng chịu lỗi (Fault Tolerance), Khả năng mở rộng (Scalability), Chất lượng dịch vụ (QoS) và Bảo mật (Security).",
        "analogy_vi":  "Hãy tưởng tượng bạn gửi một kiện hàng từ TP.HCM ra Hà Nội: Bạn và người nhận là End Devices (Hosts). Con đường nhựa, đường sắt hay đường hàng không là Network Media (Cáp đồng, Cáp quang, Sóng vô tuyến). Các bưu cục phân loại hàng hóa theo mã vùng chính là Switch và Router (Intermediary Devices).",
        "keyConcepts":  [
                            "End Devices (Hosts): Devices that originate or receive data messages on the network (PCs, Laptops, File/Web Servers, Network Printers, VoIP Phones, Security Cameras). Each host is uniquely identified by a physical MAC address and a logical IP address.",
                            "Intermediary Devices: Connect end devices and form the network backbone. Switches connect hosts within a Local Area Network (LAN); Routers interconnect different networks (LAN to WAN/Internet); Firewalls filter unauthorized traffic; Wireless Access Points (WAPs) bridge wireless clients to the wired LAN.",
                            "Three Types of Network Media: 1) Copper cables (UTP/STP/Coaxial) transmit data as electrical voltage pulses (cheap, easy to install, max 100m for Ethernet); 2) Fiber-optic cables transmit data as pulses of light through glass fibers (immune to electromagnetic interference, ultra-high speed, spans kilometers); 3) Wireless transmits electromagnetic radio waves (RF/microwave) through free space.",
                            "Physical vs. Logical Topology Diagrams: Physical topology shows where devices and cables are physically installed (room numbers, rack numbers, cable runs). Logical topology shows how data flows across the network (interface names like Gi0/0, IPv4/IPv6 subnets, VLAN IDs).",
                            "Network Sizes (PAN, LAN, MAN, WAN): LAN (Local Area Network) covers a single home, office, or campus at high speeds under single ownership. WAN (Wide Area Network) connects geographically separated LANs over leased telecom lines at slower speeds.",
                            "Four Characteristics of Reliable Networks: 1) Fault Tolerance (redundant links so if one cable/router fails, traffic automatically reroutes), 2) Scalability (adding new users without rebuilding the network), 3) Quality of Service - QoS (giving priority queue to real-time voice/video over background file downloads), 4) Security (protecting Confidentiality, Integrity, and Availability - CIA Triad).",
                            "Cloud Computing \u0026 Modern Trends: BYOD (Bring Your Own Device), Cloud types (Public, Private, Hybrid, Community), Smart Home IoT, and Powerline/Wireless Broadband (DSL, Cable, Fiber FTTH, Cellular 4G/5G, Satellite)."
                        ],
        "keyConcepts_vi":  [
                               "Thiết bị đầu cuối (End Devices / Hosts): Là nơi khởi nguồn hoặc đích đến cuối cùng của dữ liệu (PC, Laptop, Server, Điện thoại IP, Camera an ninh, máy in mạng). Mỗi Host có địa chỉ vật lý MAC (gắn cứng trên card mạng NIC) và địa chỉ logic IP.",
                               "Thiết bị trung gian (Intermediary Devices): Nối các thiết bị đầu cuối lại với nhau. Switch kết nối các máy tính trong cùng mạng nội bộ (LAN); Router kết nối các mạng khác nhau (nối LAN ra Internet); Firewall kiểm soát an ninh; Access Point phát sóng Wi-Fi. Chúng làm nhiệm vụ tái tạo tín hiệu, lưu thông tin đường đi và thông báo lỗi.",
                               "3 Loại Môi trường truyền dẫn (Network Media): 1) Cáp đồng (Copper - UTP/STP/Đồng trục): truyền xung điện, giá rẻ, dễ bấm cáp nhưng bị giới hạn 100 mét và dễ nhiễu điện từ; 2) Cáp quang (Fiber-Optic): truyền xung ánh sáng qua sợi thủy tinh, không bị nhiễu điện từ, đi xa hàng chục km; 3) Không dây (Wireless): truyền sóng điện từ (Wi-Fi, Bluetooth, 4G/5G).",
                               "Sơ đồ Vật lý (Physical Topology) vs. Sơ đồ Logic (Logical Topology): Sơ đồ vật lý vẽ vị trí thực tế (đặt ở phòng nào, tủ Rack số mấy, đi dây qua trần nào). Sơ đồ Logic vẽ cách dữ liệu di chuyển (đặt IP bao nhiêu, cắm cổng GigabitEthernet0/1 nào, thuộc VLAN mấy).",
                               "Phân loại quy mô mạng (LAN vs. WAN): LAN (Local Area Network) là mạng cục bộ trong 1 phòng, 1 tòa nhà hoặc trường học do chính bạn quản lý, tốc độ rất cao (1–10 Gbps). WAN (Wide Area Network) nối các mạng LAN ở cách xa nhau (TP.HCM – Hà Nội – Quốc tế) thuê qua nhà mạng ISP (Viettel, VNPT, FPT).",
                               "4 Tiêu chuẩn của một Mạng Đáng Tin Cậy (Reliable Network): 1) Fault Tolerance (Chịu lỗi: luôn có đường dây/Router dự phòng, đứt 1 nhánh vẫn chạy tốt); 2) Scalability (Mở rộng: thêm 100 nhân viên mới không làm sập mạng cũ); 3) QoS - Quality of Service (Ưu tiên băng thông cho cuộc gọi Voice/Zoom không bị giật lag khi có người đang tải file nặng); 4) Security (Bảo mật theo tam giác CIA: Bí mật - Toàn vẹn - Sẵn sàng).",
                               "Hệ Sinh Thái Thiết Bị Ngoại Vi & Văn Phòng Đa Dạng Thực Tế (Vượt ra khỏi khuôn mẫu lý thuyết): 1) Máy in mạng đa chức năng (MFP): Có màn hình LCD cảm ứng hiển thị IP tĩnh, Embedded Web Server (EWS) quản lý mực và sổ địa chỉ qua HTTPS, in qua cổng Standard TCP/IP Port RAW 9100 (tuyệt đối không dùng WSD Port để tránh lỗi báo Offline ảo); 2) Máy Scan mạng: Tự động đẩy file scan về thư mục máy tính nhân viên qua giao thức SMB (TCP 445) hoặc gửi Email qua SMTP TLS; 3) Máy in bill nhiệt quầy thu ngân / nhà bếp (POS Printer): Dùng cổng LAN RAW TCP Port 9100, mẹo tắt nguồn đè nút FEED rồi bật nguồn để in phiếu Self-Test xem IP, có cổng RJ-11 giật két đựng tiền; 4) Điện thoại bàn IP Phone (VoIP): Màn hình LCD xem IP, mặt đế có 2 cổng mạng RJ-45 (cổng PoE SW nối Switch vừa cấp điện vừa nhận Voice VLAN 150 QoS DSCP 46, cổng PC nối tiếp ra máy tính nhân viên nhận Data VLAN), quản lý SIP qua Web GUI.",
                               "Thiết Bị Mạng Đa Hãng Thực Tế & Quản Trị Web GUI / Cloud: 1) Switch không chỉ có Cisco CLI: Văn phòng hiện đại dùng rất nhiều Switch HPE Aruba (Instant On 1930/1960, ArubaOS-CX), Ubiquiti UniFi, MikroTik, Ruijie Reyee quản trị bằng Web GUI (HTTPS) và Cloud di động cực kỳ trực quan, dùng ma trận Untagged 'U' (cổng cắm PC) và Tagged 'T' (cổng Trunk nối Switch/AP); 2) Router cân bằng tải Multi-WAN doanh nghiệp (DrayTek Vigor, MikroTik RouterOS Winbox/WebFig, pfSense/OPNsense) hỗ trợ cắm 2-4 đường mạng cáp quang ISP (Viettel + VNPT) gộp băng thông và tự động chuyển hướng dự phòng khi đứt cáp.",
                               "Quản Trị, Hỗ Trợ Máy Tính Từ Xa & Thiết Bị An Ninh Văn Phòng: 1) Điều khiển từ xa: Microsoft Remote Desktop (RDP TCP Port 3389 qua VPN), Remote Support (AnyDesk, TeamViewer, RustDesk Self-hosted bảo mật); 2) Nền tảng quản lý tập trung RMM (NinjaOne, ManageEngine, Action1): Cài Agent ngầm theo dõi CPU/RAM, tự vá lỗi Windows Patch Management, chạy lệnh PowerShell từ xa mà không làm chiếm chuột hay gián đoạn nhân viên; 3) Wake-on-LAN (WoL): Gửi gói tin Magic Packet (UDP 7/9) bật nguồn máy tính từ xa lúc nửa đêm để quét virus/backup; 4) Thiết bị an ninh phụ trợ: Camera an ninh IP PoE (RTSP 554/ONVIF), Máy chấm công khuôn mặt / vân tay (TCP/UDP 4370), và Bộ lưu điện thông minh UPS (Card mạng NMC, SNMP tự động shutdown server khi mất điện lưới)."
                           ],
        "realWorldExample":  "Scenario: In a small company office, an employee on PC1 (192.168.1.10) joins a Zoom video call while downloading a 2GB PDF file.\n1. PC1 converts voice/video and file requests into Ethernet frames over a Cat6 Copper UTP cable to Switch S1.\n2. Switch S1 forwards the frames to Router R1 (Default Gateway 192.168.1.1).\n3. Router R1 applies QoS (Quality of Service): it places Zoom UDP voice/video packets into the High-Priority Low-Latency Queue and puts the 2GB PDF download into the Standard Best-Effort Queue so the video call never freezes.\n4. Router R1 sends the packets over Dual Redundant Fiber WAN links (ISP-A and ISP-B). When a construction crew accidentally cuts ISP-A\u0027s fiber cable, Router R1 automatically switches all traffic to ISP-B within milliseconds (Fault Tolerance).",
        "realWorldExample_vi":  "Tình huống thực tế tại văn phòng: Nhân viên ngồi tại máy PC1 (IP: 192.168.1.10) vừa họp video Zoom với khách hàng, vừa tải một file thiết kế nặng 5GB từ Google Drive.\n• Bước 1 (End Device -\u003e Media -\u003e Switch): Card mạng của PC1 biến dữ liệu thành xung điện chạy qua dây cáp đồng mạng RJ45 (dài 15m) đến cắm vào cổng Fa0/1 của Switch S1 đặt tại tủ mạng tầng 2.\n• Bước 2 (QoS - Chất lượng dịch vụ): Khi gói tin đi tới Router R1 (IP: 192.168.1.1), Router nhận diện gói tin âm thanh/hình ảnh Zoom cần độ trễ cực thấp nên cho đi vào \u0027Làn đường ưu tiên VIP\u0027, còn file tải 5GB cho đi vào làn thường — nhờ vậy cuộc họp Zoom mượt mà không bị vỡ tiếng.\n• Bước 3 (Fault Tolerance - Chịu lỗi): Công ty thuê 2 đường cáp quang từ 2 nhà mạng khác nhau. Khi xe múc làm đứt cáp của nhà mạng A ngoài đường, Router R1 tự động đẩy toàn bộ lưu lượng sang đường cáp quang dự phòng của nhà mạng B chỉ trong 0.5 giây mà cuộc họp không hề bị ngắt!",
        "diagramType":  "topology-overview",
        "commands":  [
                         "C:\\\u003e ipconfig                     # Xem nhanh IPv4, Subnet Mask và Default Gateway trên máy tính Windows",
                         "C:\\\u003e ipconfig /all                # Xem chi tiết địa chỉ vật lý MAC (Physical Address), DHCP Server và DNS Server",
                         "C:\\\u003e ping 192.168.1.1             # Kiểm tra kết nối từ máy tính đến Router (Default Gateway)",
                         "C:\\\u003e tracert 8.8.8.8              # Truy vết từng trạm Router trung gian từ máy bạn ra ngoài Internet",
                         "Công thức thực tế: Goodput (Tốc độ thực nhận của ứng dụng) \u003c Throughput (Thông lượng thực đo) \u003c= Bandwidth (Băng thông lý thuyết tối đa)"
                     ],
        "comparisonTable":  {
                                "title_vi":  "Bảng So Sánh Các Kiến Trúc Mạng \u0026 Đường Truyền WAN Doanh Nghiệp (Chuẩn Thi CCNA)",
                                "headers_vi":  [
                                                   "Tiêu chí / Công nghệ",
                                                   "Đặc điểm Kỹ thuật",
                                                   "Tốc độ Thực tế",
                                                   "Ứng dụng Điển hình (Đi làm \u0026 Đi thi)"
                                               ],
                                "rows":  [
                                             [
                                                 "LAN (Local Area Network)",
                                                 "Mạng nội bộ phạm vi hẹp (1 tòa nhà/Campus), do 1 tổ chức tự sở hữu thiết bị (Switch, Cáp UTP/Quang).",
                                                 "100 Mbps – 100 Gbps",
                                                 "Mạng văn phòng công ty, trường học, bệnh viện, Data Center nội bộ."
                                             ],
                                             [
                                                 "WAN (Wide Area Network)",
                                                 "Nối các mạng LAN ở cách xa địa lý qua hạ tầng thuê từ nhà mạng ISP (MPLS, Metro Ethernet, Leased Line).",
                                                 "10 Mbps – 100 Gbps",
                                                 "Kết nối Hội sở chính (HQ) tại TP.HCM với các Chi nhánh Hà Nội, Đà Nẵng."
                                             ],
                                             [
                                                 "SOHO (Small Office / Home Office)",
                                                 "Mạng văn phòng nhỏ (1–10 người), dùng thiết bị tích hợp All-in-One (Router + Switch 4 cổng + Access Point).",
                                                 "100 Mbps – 1 Gbps",
                                                 "Quán cafe, shop bán lẻ, nhân viên làm việc từ xa (Teleworker)."
                                             ],
                                             [
                                                 "FTTH / Metro Ethernet (Quang)",
                                                 "Cáp quang kéo tận nơi (GPON cho hộ gia đình/SMB, hoặc AON/Metro-E điểm-nối-điểm cho doanh nghiệp).",
                                                 "300 Mbps – 10 Gbps (Đối xứng)",
                                                 "Đường truyền Internet chính \u0026 đường truyền thuê riêng  (Leased Line) cho công ty."
                                             ],
                                             [
                                                 "DSL vs. Cable Broadband",
                                                 "DSL truyền qua dây đồng điện thoại cũ (RJ-11); Cable truyền qua cáp đồng trục truyền hình cáp (HFC).",
                                                 "10 Mbps – 500 Mbps (Bất đối xứng)",
                                                 "Câu hỏi thi CCNA rất hay hỏi: DSL dùng dây điện thoại, Cable dùng cáp đồng trục TV."
                                             ],
                                             [
                                                 "Cellular (4G LTE / 5G) \u0026 Satellite",
                                                 "4G/5G dùng sóng di động; Vệ tinh (Starlink/VSAT) dùng cho vùng sâu vùng xa nhưng độ trễ (Latency) rất cao (~600ms).",
                                                 "50 Mbps – 1 Gbps",
                                                 "Đường truyền dự phòng (Backup WAN Failover) cho Router chi nhánh/ATM ngân hàng."
                                             ]
                                         ]
                            },
        "jobSkills_vi":  [
                             "Kinh nghiệm Đi Làm 1 — Thiết kế Mạng Phân Cấp 3 Lớp (Cisco 3-Tier Hierarchical Model): Trong thực tế doanh nghiệp, không ai nối hàng chục Switch thành một chuỗi dài (Daisy-chain). Bạn phải thiết kế theo 3 lớp chuẩn của Cisco: 1) **Access Layer** (Lớp truy cập: nơi cắm PC, IP Phone, Camera, bật Port-Security và PoE); 2) **Distribution Layer** (Lớp phân phối: dùng Switch Layer 3 gom các Switch Access lại, định tuyến giữa các VLAN, đặt ACL lọc bảo mật); 3) **Core Layer** (Lớp lõi: chuyển mạch tốc độ cực cao 10G/40G kết nối ra Router biên và Data Center). Với công ty vừa và nhỏ, lớp Distribution và Core được gộp lại gọi là **Collapsed Core (2-Tier)**.",
                             "Kinh nghiệm Đi Làm 2 — Cấu hình Dual-WAN Failover (Chịu lỗi thực tế): Khi đi làm, sếp sẽ yêu cầu: \u0027Làm sao đứt cáp Viettel thì mạng công ty tự nhảy sang VNPT không bị rớt cuộc họp?\u0027. Giải pháp thực tế trên Router Cisco là cấu hình **IP SLA + Object Tracking + Floating Static Route** (Đường chính có AD = 1, đường phụ có AD = 5; Router tự động ping kiểm tra định kỳ 5 giây/lần, hễ mất ping đường chính là tự kích hoạt đường phụ ngay lập tức).",
                             "Kinh nghiệm Đi Làm 3 — Phân biệt Băng thông Quốc tế và Băng thông Trong nước: Khi thuê gói mạng 500 Mbps giá rẻ (FTTH GPON), đó là băng thông trong nước; băng thông đi quốc tế chỉ cam kết tối thiểu 2–5 Mbps. Với doanh nghiệp cần họp quốc tế ổn định 24/7, kỹ sư mạng phải tư vấn thuê kênh **DIA / Leased Line (Kênh thuê riêng có cam kết CIR 1:1)**.",
                             "Kinh nghiệm Đi Làm 4 — Quản trị Switch & Router Đa Hãng Thực Tế (HPE Aruba, MikroTik, DrayTek, UniFi): Ngoài Cisco CLI, phần lớn công ty vừa và nhỏ (SMB) dùng Switch HPE Aruba (Instant On / CX) quản lý bằng Web GUI trực quan, Router cân bằng tải DrayTek Vigor / MikroTik RouterOS (Winbox/WebFig) quay số PPPoE gộp 2-3 đường mạng ISP Viettel/VNPT/FPT. Hãy nhớ quy tắc ma trận Web GUI: Cổng cắm PC chọn `Untagged (U)`; Cổng cắm Trunk nối Switch/AP chọn `Tagged (T)`.",
                             "Kinh nghiệm Đi Làm 5 — Triển khai Thiết Bị Ngoại Vi Văn Phòng (Máy in LCD, Máy Scan SMB, Máy in Bill POS, IP Phone): 1) Máy in có màn hình cảm ứng: đặt Static IP ngay trên màn hình LCD, cài qua Standard TCP/IP Port RAW 9100 trên Windows (tránh dùng cổng WSD để không bị offline ảo); 2) Máy scan mạng: tạo User trong Address Book trên Web GUI đẩy file thẳng về `\\\\IP-May-Tinh\\ThuMuc` qua SMBv2/v3; 3) Máy in bill nhiệt POS: tắt nguồn đè nút FEED rồi bật nguồn để in phiếu Self-Test xem IP, cắm jack RJ-11 giật két tiền; 4) Điện thoại IP Phone: cắm 1 sợi dây Switch PoE vào cổng SW (nhận Voice VLAN 150), rồi nối cổng PC sang máy tính nhân viên (nhận Data VLAN 10 untagged) tiết kiệm 50% cổng Switch!",
                             "Kinh nghiệm Đi Làm 6 — Hỗ trợ & Quản lý Máy Tính Nhân Viên Từ Xa (Remote Helpdesk / RMM / WoL): Sử dụng Microsoft RDP (Port 3389 qua VPN), Remote Control (RustDesk Self-hosted bảo mật, AnyDesk), phần mềm quản lý tập trung RMM (NinjaOne, Action1) để chạy ngầm PowerShell và cập nhật Windows Patch không chiếm màn hình nhân viên; và dùng Wake-on-LAN (WoL Magic Packet UDP 7/9) bật máy tính nhân viên từ xa lúc nửa đêm để bảo trì."
                         ],
        "quiz":  [
                     {
                         "question_vi":  "Câu 1 (Đề thi CCNA): Một công ty muốn đảm bảo rằng khi nhân viên thực hiện cuộc gọi thoại VoIP và họp video trực tuyến, âm thanh không bị giật cục ngay cả khi có nhiều người đang tải file dung lượng lớn. Đặc tính nào của kiến trúc mạng giải quyết trực tiếp yêu cầu này?",
                         "options_vi":  [
                                            "A. Fault Tolerance (Khả năng chịu lỗi)",
                                            "B. Scalability (Khả năng mở rộng)",
                                            "C. Quality of Service - QoS (Chất lượng dịch vụ)",
                                            "D. Confidentiality (Tính bí mật)"
                                        ],
                         "answerIndex":  2,
                         "explanation_vi":  "Đáp án đúng là C (QoS - Quality of Service). QoS phân loại lưu lượng và đưa các gói tin nhạy cảm với độ trễ (như Voice và Video trực tuyến) vào hàng đợi ưu tiên (Priority Queue) để được Router/Switch chuyển đi trước các gói tin tải file thông thường."
                     },
                     {
                         "question_vi":  "Câu 2 (Đề thi CCNA): Sơ đồ mạng nào cho kỹ sư mạng biết chính xác thiết bị Switch S1 đang được lắp đặt tại Tủ Rack số 2 ở Phòng Server Tầng 3 và đi dây qua hộp kỹ thuật nào?",
                         "options_vi":  [
                                            "A. Logical Topology (Sơ đồ Logic)",
                                            "B. Physical Topology (Sơ đồ Vật lý)",
                                            "C. IP Routing Table (Bảng định tuyến IP)",
                                            "D. ARP Cache Table (Bảng bộ nhớ đệm ARP)"
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B (Physical Topology). Sơ đồ Vật lý mô tả vị trí lắp đặt thực tế (phòng ốc, tủ rack, đường cáp vật lý), trong khi Sơ đồ Logic (Logical Topology) mô tả cách dữ liệu luân chuyển, quy hoạch địa chỉ IP, VLAN và tên cổng giao tiếp."
                     },
                     {
                         "question_vi":  "Câu 3 (Đề thi CCNA): Tại sao mạng chuyển mạch gói (Packet-Switched Network) như Internet hiện đại lại có khả năng chịu lỗi (Fault Tolerance) vượt trội so với mạng chuyển mạch kênh (Circuit-Switched) truyền thống?",
                         "options_vi":  [
                                            "A. Vì nó khóa cố định một đường dây vật lý duy nhất cho mỗi cuộc gọi.",
                                            "B. Vì thông điệp được chia thành nhiều gói tin nhỏ (Packets), mỗi gói có thể tự động tìm đường đi khác nhau để tới đích nếu một nhánh cáp bị đứt.",
                                            "C. Vì nó không cần sử dụng thiết bị Router.",
                                            "D. Vì mọi gói tin đều được phát Broadcast ra toàn cầu."
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B. Trong mạng chuyển mạch gói (Packet-Switched), dữ liệu được chia thành các gói tin độc lập; nếu một đường truyền hoặc Router trên đường đi gặp sự cố, các gói tin tiếp theo sẽ tự động được định tuyến vòng qua đường dự phòng khác mà không làm đứt phiên giao tiếp."
                     }
                 ],
        "beginnerGuide_vi":  [
                                 "1. Mạng máy tính (Computer Network) thực chất là gì? Nếu bạn có 1 chiếc máy tính đứng cô độc, bạn muốn chép 1 bộ phim sang máy tính của bạn bè thì phải cắm USB chép qua lại. Khi ta nối 2 hay nhiều máy tính lại với nhau bằng dây cáp (hoặc sóng Wi-Fi) để chúng tự truyền dữ liệu, dùng chung máy in và cùng truy cập Internet — đó chính là Mạng máy tính!",
                                 "2. Phân biệt 3 thành phần vật lý trong mọi mạng (Nhìn thấy tận mắt ngoài đời): • **Thiết bị đầu cuối (End Devices / Hosts)**: Là thiết bị mà con người trực tiếp sử dụng (Máy tính bàn PC, Laptop, Điện thoại, Máy in mạng, Camera an ninh, Máy chủ Server). • **Thiết bị trung gian (Intermediary Devices)**: Là những chiếc hộp nhiều cổng nằm trong tủ mạng giúp nối các máy tính lại với nhau, gồm **Switch (Bộ chuyển mạch)** dùng để nối các máy trong cùng 1 phòng/tòa nhà, và **Router (Bộ định tuyến)** dùng để nối mạng phòng bạn ra ngoài Internet. • **Môi trường truyền dẫn (Network Media)**: Là sợi dây cáp đồng (cáp mạng RJ-45), sợi cáp quang bằng thủy tinh, hoặc sóng Wi-Fi nối giữa các thiết bị.",
                                 "3. Tại sao ở nhà bạn chỉ thấy 1 cục \u0027Modem Wi-Fi\u0027 duy nhất mà không thấy Switch, Router rời? Vì ở gia đình (mạng SOHO - Small Office/Home Office), nhà sản xuất đã nhét cả 3 thiết bị (Router + Switch 4 cổng LAN + Cục phát Wi-Fi Access Point) vào chung trong 1 chiếc hộp nhựa nhỏ gọn! Nhưng ở công ty có hàng trăm nhân viên, chiếc hộp nhỏ đó chịu không nổi nên bắt buộc phải tách riêng thành **Switch chuyên dụng (24–48 cổng)**, **Router doanh nghiệp** và **Tường lửa (Firewall)** riêng biệt.",
                                 "4. Phân biệt tốc độ mạng cho người mới (Bit vs. Byte — Tại sao lắp mạng 100 Mbps mà tải file chỉ được 12.5 MB/s?): Trong ngành mạng, tốc độ đường truyền luôn đo bằng **bps (bits per second - số bit trên giây, chữ \u0027b\u0027 viết thường)**, ví dụ gói cước 100 Mbps (Megabits/giây) hoặc 1 Gbps (Gigabits/giây). Trong khi đó, dung lượng file trên Windows lại đo bằng **Byte (chữ \u0027B\u0027 viết hoa)**, mà **1 Byte = 8 bits**. Do đó, đường truyền 100 Mbps khi tải file thực tế tối đa sẽ đạt 100 / 8 = 12.5 MB/giây!",
                                 "5. Phân biệt rõ mạng LAN và mạng WAN bằng mắt thường: • **Mạng LAN (Mạng cục bộ)**: Toàn bộ dây cáp mạng và Switch trong nhà bạn, trong văn phòng hoặc trường học do chính bạn mua và sở hữu, tốc độ rất cao (1000 Mbps - 10 Gbps) và hoàn toàn miễn phí thuê bao nội bộ. • **Mạng WAN (Mạng diện rộng)**: Khi bạn muốn nối mạng LAN ở TP.HCM với mạng LAN ở Hà Nội, bạn không thể tự đào đường kéo dây hàng ngàn km mà phải thuê đường cáp quang của nhà mạng viễn thông (ISP như Viettel, VNPT, FPT) — đường nối xa đó chính là mạng WAN."
                             ],
        "beginnerGuide_en":  [
                                 "1. What is a Computer Network? A standalone computer requires a USB drive to share files with another PC. When two or more devices are connected via cables or Wi-Fi to share files, printers, and Internet access automatically, you have a Computer Network.",
                                 "2. The 3 Physical Building Blocks: • **End Devices (Hosts)**: Devices people use directly (PCs, Laptops, Smartphones, Network Printers, IP Cameras, Servers). • **Intermediary Devices**: Hardware boxes in wiring closets that connect hosts together—specifically **Switches** (connecting devices within the same local room/building) and **Routers** (connecting your local network out to the Internet). • **Network Media**: The physical path carrying signals—Copper cables (RJ-45), Fiber-optic glass cables, or Wireless radio waves.",
                                 "3. Why does a home network only have one \u0027Wi-Fi Router\u0027 box? Home/SOHO routers combine three devices into one plastic box: a Router + a 4-port Switch + a Wireless Access Point. In enterprise networks with hundreds of users, these roles are separated into dedicated 24/48-port rackmount Switches, enterprise Routers, and Hardware Firewalls."
                             ],
        "advancedTopics_vi":  [
                                  "Mở rộng Nâng cao 1 — Mạng Chuyển Mạch Kênh (Circuit-Switched) vs. Mạng Chuyển Mạch Gói (Packet-Switched): Mạng điện thoại bàn cổ điển dùng *Chuyển mạch kênh* (thiết lập 1 đường dây vật lý cố định dành riêng cho 2 người nói chuyện — nếu đứt dây đó là mất liên lạc ngay). Ngược lại, mạng Internet hiện đại dùng *Chuyển mạch gói (Packet-Switched)*: một bức ảnh hay bộ phim được cắt nhỏ thành hàng ngàn **Gói tin (Packets)** đánh số thứ tự; mỗi gói tin tự tìm đường đi ngắn nhất qua các Router, nếu nhánh cáp A bị đứt thì các gói tin tự động rẽ sang nhánh cáp B rồi ghép lại ở máy đích!",
                                  "Mở rộng Nâng cao 2 — Tam giác Bảo mật CIA (Confidentiality - Integrity - Availability): Mọi hệ thống an ninh mạng từ cơ bản đến cao cấp đều xoay quanh 3 trụ cột này: 1) **Confidentiality (Tính Bí mật)**: Mã hóa dữ liệu để kẻ nghe lén bắt được gói tin cũng không đọc được nội dung; 2) **Integrity (Tính Toàn vẹn)**: Dùng thuật toán băm (Hash) để đảm bảo chuyển khoản 1 triệu đồng không bị sửa thành 100 triệu đồng trên đường truyền; 3) **Availability (Tính Sẵn sàng)**: Đảm bảo máy chủ và đường truyền luôn sống 24/7 nhờ nguồn điện dự phòng UPS, đường cáp kép và chống tấn công DDoS.",
                                  "Mở rộng Nâng cao 3 — Kiến trúc Mạng Doanh Nghiệp 3 Lớp của Cisco (Access - Distribution - Core): Khi mạng lớn lên hàng ngàn máy tính, kỹ sư mạng chia hệ thống Switch/Router thành 3 tầng rõ rệt: **Tầng Access** (cắm trực tiếp máy tính nhân viên, cấp nguồn PoE cho điện thoại IP/Wi-Fi), **Tầng Distribution** (gom các Switch tầng Access lại, thực hiện định tuyến giữa các phòng ban và lọc bảo mật ACL), và **Tầng Core** (trục xương sống tốc độ 10Gbps–100Gbps chuyển tải dữ liệu siêu tốc giữa các tòa nhà và ra trung tâm dữ liệu Data Center).",
                                  "Mở rộng Nâng cao 4 — Mạng Định Nghĩa Bằng Phần Mềm (SDN - Software-Defined Networking) \u0026 Tự Động Hóa Mạng: Trong mạng truyền thống, kỹ sư phải đăng nhập CLI vào từng chiếc Switch/Router để gõ lệnh thủ công. Ở kiến trúc hiện đại (như **Cisco DNA Center / SD-Access**), phần \u0027Bộ não điều khiển\u0027 (**Control Plane**) được tách rời khỏi phần cứng chuyển mạch (**Data Plane**) và đưa lên một Máy chủ Điều khiển trung tâm (**SDN Controller**). Kỹ sư chỉ cần thiết lập chính sách trên giao diện tập trung, Controller sẽ tự động đẩy cấu hình xuống hàng ngàn thiết bị mạng qua giao thức API chỉ trong vài giây!"
                              ],
        "advancedTopics_en":  [
                                  "Advanced Expansion 1 — Circuit-Switched vs. Packet-Switched Networks: Legacy telephone networks used Circuit Switching (reserving a dedicated physical circuit per call). Modern IP networks use Packet Switching: data is broken into thousands of independent packets that dynamically route around failed links and reassemble at the destination.",
                                  "Advanced Expansion 2 — The CIA Security Triad: 1) **Confidentiality** (Encryption so only authorized parties read data), 2) **Integrity** (Cryptographic hashing so data cannot be altered in transit), and 3) **Availability** (Redundant hardware, failover links, and DDoS mitigation for 24/7 uptime).",
                                  "Advanced Expansion 3 — Cisco 3-Tier Hierarchical Campus Architecture: Enterprise networks scale using three layers: **Access Layer** (connects end hosts, PoE, Port Security), **Distribution Layer** (aggregates access switches, enforces ACL policies, routes between VLANs), and **Core Layer** (high-speed 10G/40G/100G backbone switching)."
                              ]
    },
    {
        "id":  2,
        "title":  "Basic Switch and End Device Configuration",
        "title_vi":  "Cấu Hình Cơ Bản Switch và Thiết Bị Đầu Cuối",
        "overview":  "Module 2 covers Cisco Internetwork Operating System (IOS) CLI navigation, configuration file management (RAM vs. NVRAM), and initial hardening of a Cisco Catalyst switch. Because enterprise switches ship without screens or keyboards, network engineers connect physically via a Rollover Console cable (RS-232/USB) using terminal emulation software (PuTTY, Tera Term) or remotely over the network via SSH using a Switch Virtual Interface (SVI). You learn how to move between User EXEC, Privileged EXEC, Global Configuration, Line Configuration, and Interface Configuration modes, secure console/VTY/privileged access, encrypt plaintext passwords, configure MOTD banners, and persist settings to NVRAM.",
        "overview_vi":  "Module 2 hướng dẫn cách làm chủ giao diện dòng lệnh Cisco IOS (CLI) và cấu hình bảo mật ban đầu cho thiết bị Switch mới khui hộp. Khác với PC gia đình, Switch và Router doanh nghiệp không có màn hình hay chuột — kỹ sư mạng phải cắm dây cáp Console (cổng RJ45/USB-Mini màu xanh ngọc) nối từ laptop vào Switch và mở phần mềm PuTTY để gõ lệnh. Bạn sẽ học cấu trúc phân tầng chế độ (Mode) của Cisco IOS, phân biệt bộ nhớ tạm RAM (`running-config`) và bộ nhớ lưu trữ vĩnh viễn NVRAM (`startup-config`), cách đặt tên thiết bị, đặt mật khẩu bảo vệ nhiều lớp, mã hóa mật khẩu chống nhìn trộm, tạo thông báo pháp lý (Banner MOTD) và gán địa chỉ IP ảo (SVI VLAN 1) để quản trị Switch từ xa.",
        "analogy_vi":  "Các chế độ (Modes) trong Cisco IOS giống như quyền hạn trong một tòa nhà ngân hàng: User EXEC (`Switch\u003e`) chỉ như sảnh khách chờ (chỉ xem được thông tin cơ bản); Privileged EXEC (`Switch#`) là phòng Giám sát (xem được toàn bộ cấu hình và khởi động lại máy); còn Global Configuration (`Switch(config)#`) là phòng Kỹ thuật Trung tâm (nơi bạn thực sự thay đổi cấu hình hệ thống).",
        "keyConcepts":  [
                            "Cisco IOS Hierarchical Modes: 1) User EXEC (`Switch\u003e`) — limited view-only commands; 2) Privileged EXEC (`Switch#`, entered via `enable`) — full monitoring, debug, and file saving; 3) Global Config (`Switch(config)#`, entered via `configure terminal`) — system-wide changes; 4) Sub-modes (`Switch(config-line)#` for Console/VTY ports, `Switch(config-if)#` for physical/VLAN interfaces).",
                            "Configuration Files in Memory: `running-config` is stored in volatile RAM—changes apply immediately, but vanish if power is lost. `startup-config` is stored in non-volatile NVRAM—retained across reboots. Always run `copy running-config startup-config` (`copy run start`) to save changes.",
                            "Securing Device Access (3 Checkpoints): 1) Console port (`line console 0` -\u003e `password` + `login`) protects against physical unauthorized cable connection; 2) Privileged EXEC (`enable secret \u003cpass\u003e`) hashes the password with MD5/scrypt; 3) Virtual Teletype lines (`line vty 0 15`) secure remote Telnet/SSH connections.",
                            "Password Encryption \u0026 Legal Banners: By default, `password` commands appear in cleartext in `show running-config`. Running `service password-encryption` obfuscates all plaintext passwords so onlookers cannot read them. `banner motd #...#` displays a legal notice before login warning that unauthorized access is prohibited.",
                            "Switch Virtual Interface (SVI): A Layer 2 switch forwards frames based on MAC addresses and does not need an IP address to switch traffic for PCs. However, assigning an IP address to logical `interface vlan 1` (and configuring `ip default-gateway`) allows the administrator to connect to the switch remotely via SSH/Telnet and ping it.",
                            "Disabling Unwanted DNS Lookups: Mistyping a command at the CLI causes IOS to broadcast a DNS query for that word, freezing the terminal for ~30 seconds. Configure `no ip domain-lookup` in global config mode to prevent this delay."
                        ],
        "keyConcepts_vi":  [
                               "Hệ thống phân cấp Mode trong Cisco IOS: 1) User EXEC (`Switch\u003e`) — chỉ xem cơ bản; gõ `enable` để vào 2) Privileged EXEC (`Switch#`) — xem toàn bộ cấu hình, chẩn đoán lỗi, lưu file; gõ `configure terminal` để vào 3) Global Configuration (`Switch(config)#`) — thay đổi cài đặt chung; từ đây đi vào các chế độ con như `Switch(config-line)#` (cấu hình cổng Console/VTY) hoặc `Switch(config-if)#` (cấu hình cổng mạng/VLAN).",
                               "Phân biệt RAM (`running-config`) và NVRAM (`startup-config`): Mọi lệnh bạn vừa gõ nằm trong `running-config` trên thanh RAM — có tác dụng ngay lập tức nhưng nếu cúp điện sẽ mất sạch! Muốn lưu vĩnh viễn khi khởi động lại, bắt buộc phải chép từ RAM sang bộ nhớ NVRAM bằng lệnh `copy running-config startup-config` (viết tắt: `copy run start` hoặc `wr`).",
                               "3 Lớp Khóa Bảo Vệ Thiết Bị Cisco: Lớp 1: Mật khẩu cổng Console (`line console 0`) chặn người lạ cắm dây trực tiếp vào máy. Lớp 2: Mật khẩu từ xa VTY (`line vty 0 15`) chặn truy cập qua mạng. Lớp 3: Mật khẩu đặc quyền `enable secret \u003cmật_khẩu\u003e` (được băm mã hóa một chiều cực mạnh) bảo vệ quyền quản trị cao nhất `Switch#`.",
                               "Mã hóa mật khẩu \u0026 Thông báo Banner MOTD: Mặc định các mật khẩu thường sẽ hiển thị rõ mồn một khi gõ `show running-config`. Lệnh `service password-encryption` sẽ mã hóa toàn bộ mật khẩu dạng chữ thường thành chuỗi ký tự ẩn (Type 7). Lệnh `banner motd #Cấm truy cập trái phép!#` hiện cảnh báo pháp lý ngay khi ai đó kết nối vào thiết bị.",
                               "Địa chỉ IP quản trị trên Switch (SVI - Switch Virtual Interface): Bản chất Switch hoạt động ở Tầng 2 (chỉ nhìn địa chỉ MAC) nên không cần IP vẫn chuyển mạch cho các máy tính bình thường. Tuy nhiên, ta đặt IP cho giao diện ảo `interface vlan 1` (kèm lệnh `no shutdown` và `ip default-gateway`) để kỹ sư có thể ngồi từ phòng làm việc điều khiển Switch từ xa qua mạng thay vì phải chạy xuống phòng Server cắm dây Console.",
                               "Tắt tra cứu DNS khi gõ sai lệnh (`no ip domain-lookup`): Trên Cisco IOS, nếu bạn gõ sai chính tả một lệnh, thiết bị sẽ tưởng đó là tên miền website và cố tìm DNS suốt 30 giây gây treo màn hình. Lệnh `no ip domain-lookup` giúp hủy bỏ ngay tình trạng treo khó chịu này.",
                               "Quản trị Switch Đa Hãng bằng Giao diện Web GUI & Đám Mây (HPE Aruba, UniFi, MikroTik WebFig): Không phải Switch nào cũng dùng CLI Cisco. Các dòng Switch doanh nghiệp hiện đại như HPE Aruba Instant On 1930/1960, Ubiquiti UniFi, MikroTik RouterOS/SwOS, Cisco Business (CBS) cho phép quản trị trực quan 100% bằng trình duyệt Web (`https://<IP-Switch>`) hoặc ứng dụng Cloud trên điện thoại: xem sơ đồ trực quan từng cổng, đo công suất tiêu thụ PoE theo thời gian thực, tạo VLAN và gán Untagged/Tagged chỉ bằng click chuột kéo thả.",
                               "Quy tắc Đặt IP Tĩnh Cố Định cho Thiết Bị Ngoại Vi Doanh Nghiệp (Máy In LCD, Máy Scan, POS, IP Phone): Máy tính người dùng có thể nhận IP động qua DHCP, nhưng toàn bộ thiết bị chia sẻ dùng chung (máy in đa năng màn hình LCD, máy scan SMB, máy in bill nhiệt quầy thu ngân cổng 9100, camera an ninh, máy chấm công vân tay) bắt buộc phải cấu hình Static IP nằm ngoài dải cấp DHCP (hoặc cấu hình DHCP Static Reservation theo địa chỉ MAC trên Router) để ngăn chặn hoàn toàn lỗi nhảy IP làm tê liệt hoạt động văn phòng."
                           ],
        "realWorldExample":  "Scenario: You unbox a brand-new Cisco Catalyst 2960 switch for Floor 1 (`SW-Floor1`).\n1. You plug a USB-to-RJ45 Console cable from your laptop into the switch\u0027s Console port and open PuTTY (9600 baud, 8 data bits, no parity, 1 stop bit).\n2. You enter `enable`, then `configure terminal`, set `hostname SW-Floor1`, disable DNS hang with `no ip domain-lookup`, set `enable secret C1sco@123`, secure `line console 0` and `line vty 0 15`, encrypt passwords with `service password-encryption`, and configure `interface vlan 1` with `192.168.1.2/24` and `no shutdown`.\n3. You configure PC1 with IP `192.168.1.10`, Subnet Mask `255.255.255.0`, and Default Gateway `192.168.1.1`, then verify connectivity by running `ping 192.168.1.2` from PC1.",
        "realWorldExample_vi":  "Ví dụ thực hành cấu hình từ A-Z cho 1 Switch mới khui thùng (SW-Tang1):\n• Bước 1: Cắm dây Console từ Laptop vào cổng Console mặt sau Switch, mở PuTTY chọn Serial (Speed: 9600) -\u003e Màn hình hiện `Switch\u003e`.\n• Bước 2: Gõ `enable` -\u003e chuyển sang `Switch#`. Gõ `configure terminal` -\u003e chuyển sang `Switch(config)#`.\n• Bước 3: Đặt tên `hostname SW-Tang1`, chống treo lệnh `no ip domain-lookup`, đặt mật khẩu quản trị `enable secret Admin@123`.\n• Bước 4: Khóa cổng Console (`line console 0` -\u003e `password con123` -\u003e `login`) và cổng điều khiển từ xa (`line vty 0 15` -\u003e `password vty123` -\u003e `login`), sau đó bật `service password-encryption`.\n• Bước 5: Đặt IP quản trị cho Switch tại `interface vlan 1`: gõ `ip address 192.168.1.2 255.255.255.0` và `no shutdown` (bật cổng lên), đặt `ip default-gateway 192.168.1.1`.\n• Bước 6: Bấm tổ hợp `Ctrl+Z` (hoặc gõ `end`) về lại `SW-Tang1#` rồi gõ `copy running-config startup-config` để lưu vào NVRAM. Bây giờ từ máy tính PC1 (192.168.1.10), bạn có thể `ping 192.168.1.2` thành công!",
        "diagramType":  "ios-modes",
        "commands":  [
                         "Switch\u003e enable                                       # Chuyển từ User EXEC sang Privileged EXEC mode",
                         "Switch# configure terminal                           # Vào Global Configuration mode (viết tắt: conf t)",
                         "Switch(config)# hostname S1                          # Đổi tên thiết bị thành S1",
                         "S1(config)# no ip domain-lookup                      # Tắt tự động phân giải DNS khi gõ sai lệnh tránh bị treo CLI",
                         "S1(config)# enable secret class                      # Đặt mật khẩu mã hóa MD5 bảo vệ chế độ Privileged EXEC",
                         "S1(config)# line console 0                           # Vào chế độ cấu hình cổng vật lý Console",
                         "S1(config-line)# password cisco                      # Đặt mật khẩu cho cổng Console",
                         "S1(config-line)# login                               # Bắt buộc hỏi mật khẩu khi cắm dây Console đăng nhập",
                         "S1(config-line)# exit                                # Thoát về Global Config mode",
                         "S1(config)# line vty 0 15                            # Vào cấu hình 16 đường kết nối ảo từ xa (Telnet/SSH)",
                         "S1(config-line)# password cisco                      # Đặt mật khẩu truy cập từ xa",
                         "S1(config-line)# login                               # Yêu cầu kiểm tra mật khẩu khi kết nối VTY",
                         "S1(config-line)# exit",
                         "S1(config)# service password-encryption              # Mã hóa toàn bộ mật khẩu plaintext trong file cấu hình",
                         "S1(config)# banner motd #Authorized Access Only!#    # Tạo thông báo cảnh báo pháp lý khi đăng nhập",
                         "S1(config)# interface vlan 1                         # Vào giao diện ảo quản trị SVI VLAN 1",
                         "S1(config-if)# ip address 192.168.1.2 255.255.255.0  # Gán địa chỉ IPv4 và Subnet Mask cho Switch",
                         "S1(config-if)# no shutdown                           # Mở cổng VLAN 1 (mặc định VLAN 1 đang bị tắt)",
                         "S1(config-if)# exit",
                         "S1(config)# ip default-gateway 192.168.1.1           # Khai báo cổng Router mặc định để quản lý Switch từ mạng khác",
                         "S1(config)# end                                      # Quay thẳng về Privileged EXEC mode (tương đương Ctrl+Z)",
                         "S1# copy running-config startup-config               # Lưu cấu hình từ RAM vào NVRAM (viết tắt: copy run start)",
                         "S1# show running-config                              # Xem toàn bộ cấu hình hiện hành đang chạy trong RAM"
                     ],
        "comparisonTable":  {
                                "title_vi":  "Bảng Giải Phẫu 4 Loại Bộ Nhớ Trong Thiết Bị Cisco \u0026 Phím Tắt CLI Thực Chiến",
                                "headers_vi":  [
                                                   "Thành phần Bộ nhớ / Phím tắt",
                                                   "Đặc tính Lưu trữ",
                                                   "Chứa nội dung gì?",
                                                   "Lệnh kiểm tra / Tác dụng thực tế"
                                               ],
                                "rows":  [
                                             [
                                                 "ROM (Read-Only Memory)",
                                                 "Không mất dữ liệu khi tắt nguồn (Non-volatile), gắn chết trên bo mạch chủ.",
                                                 "Chương trình tự kiểm tra phần cứng POST, trình mồi khởi động Bootstrap, và hệ điều hành thu nhỏ ROMMON.",
                                                 "Dùng để cứu hộ thiết bị khi quên mật khẩu hoặc mất hệ điều hành IOS trong Flash."
                                             ],
                                             [
                                                 "Flash Memory",
                                                 "Không mất dữ liệu khi tắt nguồn (Non-volatile), giống ổ cứng SSD/Thẻ nhớ.",
                                                 "Lưu trữ file hệ điều hành Cisco IOS (`.bin`), file cơ sở dữ liệu VLAN (`vlan.dat` trên Switch).",
                                                 "Kiểm tra bằng lệnh `show flash:` hoặc `dir flash:`."
                                             ],
                                             [
                                                 "NVRAM (Non-Volatile RAM)",
                                                 "Không mất dữ liệu khi tắt nguồn (Non-volatile).",
                                                 "Chứa file cấu hình khởi động **`startup-config`** và thanh ghi cấu hình (Configuration Register `0x2102`).",
                                                 "Kiểm tra bằng lệnh `show startup-config`. Xóa sạch bằng `erase startup-config`."
                                             ],
                                             [
                                                 "RAM (Random Access Memory)",
                                                 "MẤT SẠCH DỮ LIỆU khi tắt nguồn hoặc khởi động lại (Volatile).",
                                                 "Chứa hệ điều hành IOS đang chạy, file **`running-config`**, bảng định tuyến (`routing table`), bảng ARP và bảng MAC.",
                                                 "Kiểm tra bằng lệnh `show running-config`. Phải lưu sang NVRAM bằng `copy run start`."
                                             ],
                                             [
                                                 "Phím `Tab` \u0026 Dấu hỏi `?`",
                                                 "Trợ giúp thông minh trên CLI",
                                                 "`Tab` tự động điền nốt câu lệnh đang gõ dở; `?` liệt kê toàn bộ các lệnh hoặc tham số tiếp theo.",
                                                 "Gõ `sh?` để xem các lệnh bắt đầu bằng `sh`; gõ `show ip ?` để xem các tham số sau `show ip`."
                                             ],
                                             [
                                                 "`Ctrl+C` / `Ctrl+Z` / `Ctrl+Shift+6`",
                                                 "Tổ hợp phím cứu cánh",
                                                 "`Ctrl+Z` (hoặc `end`) thoát thẳng từ mọi mode con về `Switch#`; `Ctrl+Shift+6` hủy ngay lệnh `ping`/`traceroute` hoặc DNS đang bị treo!",
                                                 "Bắt buộc nhớ `Ctrl+Shift+6` khi đi làm để ngắt lệnh bị treo mà không cần tắt cửa sổ PuTTY."
                                             ]
                                         ]
                            },
        "jobSkills_vi":  [
                             "Kinh nghiệm Đi Làm 1 — Quy trình Phá Mật Khẩu (Password Recovery) khi nhận bàn giao thiết bị cũ không có mật khẩu: • **Trên Router Cisco**: Cắm dây Console, tắt nguồn bật lại và bấm tổ hợp `Ctrl + Break` trong 60 giây đầu để vào chế độ `rommon 1 \u003e`. Gõ `confreg 0x2142` (bảo Router phớt lờ file `startup-config` khi khởi động) -\u003e gõ `reset`. Khi máy vào thẳng được `Router\u003e`, gõ `enable` -\u003e `copy startup-config running-config` (giữ lại toàn bộ cấu hình cũ của công ty!) -\u003e vào `conf t` đặt lại `enable secret MậtKhẩuMới` -\u003e đổi lại thanh ghi `config-register 0x2102` -\u003e `copy run start`! • **Trên Switch Catalyst 2960**: Rút dây nguồn, giữ tay vào nút cứng **MODE** ở mặt trước đồng thời cắm nguồn lại cho đến khi đèn SYST nhấp nháy xanh -\u003e gõ `flash_init` -\u003e đổi tên file `rename flash:config.text flash:config.old` -\u003e `boot`!",
                             "Kinh nghiệm Đi Làm 2 — Cách xóa trắng một con Switch cũ để mang đi lắp chỗ khác (Factory Reset): Nhiều người mới đi làm chỉ gõ `erase startup-config` rồi `reload`, kết quả là các VLAN cũ vẫn còn nguyên! Trên Switch, thông tin VLAN không nằm trong NVRAM mà nằm trong file `vlan.dat` ở bộ nhớ Flash. Muốn xóa trắng 100% một chiếc Switch, bạn phải gõ đủ 3 lệnh: 1) `delete flash:vlan.dat`, 2) `erase startup-config`, 3) `reload`.",
                             "Kinh nghiệm Đi Làm 3 — Lệnh hẹn giờ tự khởi động lại cứu mạng khi cấu hình từ xa (`reload in 10`): Khi bạn đang ngồi ở TP.HCM SSH ra một con Router ở Hà Nội để sửa cấu hình nhạy cảm (như ACL hoặc IP cổng WAN), nếu lỡ gõ nhầm 1 dòng làm đứt kết nối SSH thì ai rút điện giúp bạn? Hãy gõ `Router# reload in 10` trước khi sửa! Nếu bạn bị văng mạng, đúng 10 phút sau Router sẽ tự khởi động lại bằng file `startup-config` cũ an toàn; còn nếu sửa xong xuôi ngon lành, bạn gõ `Router# reload cancel` rồi mới `copy run start`!"
                         ],
        "quiz":  [
                     {
                         "question_vi":  "Câu 1 (Đề thi CCNA): Quản trị viên vừa cấu hình xong địa chỉ IP và mật khẩu trên Switch S1. Tuy nhiên sau một sự cố mất điện đột ngột, Switch khởi động lại và mất sạch mọi cấu hình vừa làm. Nguyên nhân là gì?",
                         "options_vi":  [
                                            "A. Quản trị viên chưa gõ lệnh `no shutdown` trên cổng Console.",
                                            "B. Cấu hình đang nằm trong file `running-config` trên bộ nhớ RAM và chưa được chép sang `startup-config` trong NVRAM.",
                                            "C. Hệ điều hành Cisco IOS trong bộ nhớ ROM đã bị xóa.",
                                            "D. Quản trị viên chưa bật lệnh `service password-encryption`."
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B. Mọi lệnh vừa gõ chỉ được lưu vào `running-config` nằm trên RAM (bộ nhớ khả biến, mất dữ liệu khi mất điện). Để lưu vĩnh viễn qua các lần mất điện, bắt buộc phải chạy lệnh `copy running-config startup-config` để ghi vào NVRAM."
                     },
                     {
                         "question_vi":  "Câu 2 (Đề thi CCNA): Khi so sánh hai lệnh đặt mật khẩu `enable password cisco` và `enable secret class` trong chế độ Global Configuration, phát biểu nào sau đây là chính xác?",
                         "options_vi":  [
                                            "A. `enable password` mạnh hơn và ghi đè lên `enable secret`.",
                                            "B. `enable secret` tự động băm mã hóa mật khẩu bằng thuật toán mật mã mạnh (MD5/scrypt) và luôn được ưu tiên sử dụng nếu cả hai lệnh cùng được cấu hình.",
                                            "C. Cả hai lệnh đều lưu mật khẩu dưới dạng chữ rõ (plaintext) trong file cấu hình.",
                                            "D. `enable secret` chỉ dùng cho cổng Console, không dùng cho Privileged EXEC mode."
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B. `enable secret` mã hóa một chiều (Type 5 MD5 hoặc Type 8/9 scrypt/SHA-256) ngay lập tức mà không cần lệnh `service password-encryption`, và nếu cấu hình cả hai thì IOS sẽ luôn dùng `enable secret` để xác thực khi vào chế độ `Switch#`."
                     },
                     {
                         "question_vi":  "Câu 3 (Đề thi CCNA): Tại sao một thiết bị Switch Layer 2 lại cần được cấu hình địa chỉ IP trên giao diện ảo `interface vlan 1` và lệnh `ip default-gateway`?",
                         "options_vi":  [
                                            "A. Để các máy tính PC cắm vào Switch có thể giao tiếp với nhau trong cùng mạng LAN.",
                                            "B. Để Switch có thể định tuyến gói tin giữa các mạng WAN giống như Router.",
                                            "C. Để quản trị viên có thể kết nối điều khiển Switch từ xa (qua SSH/Telnet) hoặc kiểm tra kết nối tới Switch từ một mạng khác.",
                                            "D. Để mã hóa toàn bộ mật khẩu trên Switch."
                                        ],
                         "answerIndex":  2,
                         "explanation_vi":  "Đáp án đúng là C. Switch Layer 2 chuyển mạch khung tin cho các PC hoàn toàn bằng địa chỉ MAC nên không cần IP. Địa chỉ IP trên SVI (`interface vlan 1`) và `ip default-gateway` chỉ phục vụ cho chính bản thân chiếc Switch đó khi cần quản trị từ xa qua Telnet/SSH/SNMP."
                     }
                 ],
        "beginnerGuide_vi":  [
                                 "1. Tại sao thiết bị Switch/Router Cisco không có màn hình hay chuột như Windows? Thiết bị mạng doanh nghiệp được thiết kế để chạy bền bỉ suốt 5–10 năm không tắt trong tủ Rack. Việc bỏ giao diện đồ họa nặng nề giúp toàn bộ sức mạnh CPU/RAM tập trung 100% cho việc chuyển gói tin siêu tốc và không bị treo. Thay vào đó, kỹ sư mạng điều khiển chúng bằng các câu lệnh chữ cực nhẹ gọi là **CLI (Command-Line Interface - Giao diện dòng lệnh)**.",
                                 "2. Làm sao kết nối vào một chiếc Switch mới mua về khi nó chưa hề có địa chỉ IP? Bạn dùng một sợi dây cáp đặc biệt đi kèm trong thùng máy gọi là **Dây cáp Console (màu xanh ngọc)**. Một đầu cắm vào cổng USB của Laptop bạn, đầu kia cắm vào cổng ghi chữ **CONSOLE** trên Switch, rồi mở phần mềm miễn phí tên là **PuTTY** (chọn ô Serial, tốc độ chuẩn **9600**) là màn hình đen hiện chữ `Switch\u003e` để bạn bắt đầu gõ lệnh!",
                                 "3. Hiểu rõ tại sao lại có nhiều dấu nhắc lệnh (`\u003e`, `#`, `(config)#`) khác nhau? Để tránh việc kỹ sư vô tình gõ nhầm làm sập mạng công ty, Cisco chia quyền hạn thành từng nấc thang: • Dấu lớn hơn **`Switch\u003e` (User EXEC)**: Chỉ xem được vài thông tin cơ bản, không sửa phá được gì. • Dấu thăng **`Switch#` (Privileged EXEC - vào bằng lệnh `enable`)**: Xem được toàn bộ cấu hình (`show`), kiểm tra lỗi và lưu file. • Chữ **`Switch(config)#` (Global Config - vào bằng lệnh `configure terminal`)**: Nơi bạn thực sự thay đổi tên máy, đặt mật khẩu, chia mạng!",
                                 "4. Tại sao trên Cisco IOS có nhiều \u0027Chế độ\u0027 (Modes) khác nhau mà không gõ chung một chỗ? Giống như trên Windows có tài khoản Khách (Guest) và tài khoản Quản trị viên (Administrator) để tránh người không phận sự xóa nhầm file hệ thống, Cisco IOS chia thành 3 tầng bảo vệ: • Tầng 1 Switch\u003e (**Chế độ Người dùng - User EXEC**): Chỉ cho phép xem thông tin cơ bản nhất, không sửa đổi được gì. • Tầng 2 Switch# (**Chế độ Đặc quyền - Privileged EXEC**): Gõ enable để vào — cho phép xem toàn bộ cấu hình (show running-config), khởi động lại máy (\reload) và lưu cấu hình (copy run start). • Tầng 3 Switch(config)# (**Chế độ Cấu hình Toàn cục - Global Configuration**): Gõ configure terminal để vào — nơi thực sự thay đổi cài đặt của toàn thiết bị.",
                                 "5. Mẹo dùng phím tắt sinh tồn trên màn hình dòng lệnh CLI cho người mới: Khi mới gõ lệnh Cisco, bạn không cần nhớ từng chữ cái! • **Dấu hỏi chấm ?**: Quên lệnh tiếp theo là gì, chỉ cần gõ ? (ví dụ show ?), máy sẽ liệt kê toàn bộ các từ khóa hợp lệ ngay lập tức. • **Phím Tab**: Gõ vài chữ đầu như conf rồi bấm phím Tab, máy tự điền đầy đủ thành configure. • **Tổ hợp Ctrl + Shift + 6**: Nếu bạn gõ sai một từ (ví dụ gõ nhầm lệnh ping thành pign), máy sẽ đứng đơ khoảng 30 giây để tìm tên miền — bấm ngay Ctrl + Shift + 6 để cắt đứt quá trình chờ đó!"
                             ],
        "beginnerGuide_en":  [
                                 "1. Why don\u0027t enterprise Cisco Switches and Routers have monitors or mice? Enterprise network gear is built to run 24/7 for years inside server racks. Stripping away heavy graphical interfaces dedicates 100% of CPU and RAM to packet forwarding. Engineers manage them using a fast text interface called the **CLI (Command-Line Interface)**.",
                                 "2. How do you configure a brand-new Switch out of the box when it has no IP address? You use a **Console Cable (Rollover cable)** plugged from your laptop\u0027s USB/Serial port into the switch\u0027s **CONSOLE** port, and open a terminal emulator like **PuTTY** (Serial mode, **9600 baud**).",
                                 "3. Why are there different CLI prompts (`\u003e`, `#`, `(config)#`)? Cisco IOS uses hierarchical security modes: **`Switch\u003e` (User EXEC)** allows only basic monitoring; **`Switch#` (Privileged EXEC, entered via `enable`)** allows viewing full configs (`show`) and saving files; **`Switch(config)#` (Global Config, entered via `configure terminal`)** allows modifying device settings."
                             ],
        "advancedTopics_vi":  [
                                  "Mở rộng Nâng cao 1 — Quy trình Khởi động (Boot Sequence) của Switch/Router Cisco: Khi bạn cắm điện, thiết bị trải qua 4 bước tuần tự: 1) Chạy chương trình **POST (Power-On Self-Test)** trong chip **ROM** để kiểm tra RAM, CPU và các cổng mạng có hỏng phần cứng không; 2) Chạy trình mồi **Bootstrap** trong ROM để đi tìm hệ điều hành; 3) Tải và giải nén file hệ điều hành **Cisco IOS (`.bin`)** từ bộ nhớ **Flash** lên bộ nhớ **RAM**; 4) Tìm file cấu hình **`startup-config`** trong bộ nhớ **NVRAM** chép lên RAM thành **`running-config`** để áp dụng cấu hình (nếu NVRAM trống thì hiện câu hỏi *Would you like to enter the initial configuration dialog? [yes/no]:* — ta luôn chọn **`no`** để tự gõ lệnh tay!).",
                                  "Mở rộng Nâng cao 2 — Phân biệt các thuật toán Mã hóa Mật khẩu trong Cisco IOS (Type 0, Type 5, Type 7, Type 8, Type 9): Khi bạn xem `show running-config`, con số đứng ngay sau chữ `password` hoặc `secret` cho biết độ mạnh của mã hóa: • **Type 0**: Chữ rõ (Plaintext) chưa mã hóa; • **Type 7**: Mã hóa yếu bằng lệnh `service password-encryption` (dùng thuật toán Vigenère — chỉ chống người đứng cạnh nhìn trộm chứ copy lên web giải mã 1 giây là ra!); • **Type 5**: Băm một chiều MD5 (khi gõ `enable secret` — cực kỳ an toàn); • **Type 8 \u0026 Type 9**: Băm siêu mạnh chuẩn hiện đại SHA-256 và Scrypt (`enable algorithm-type scrypt secret`).",
                                  "Mở rộng Nâng cao 3 — Quản trị từ xa In-Band (Qua mạng SVI VLAN) vs. Out-of-Band (Qua cổng Console): **Out-of-Band** là cắm dây trực tiếp vào cổng Console (không cần mạng LAN hoạt động vẫn điều khiển được — dùng khi mới lắp đặt hoặc khi mạng bị sập). **In-Band** là điều khiển từ xa qua cáp mạng LAN bằng giao thức SSH/Telnet tới địa chỉ IP của giao diện ảo `interface vlan 1` (SVI) — đòi hỏi mạng phải thông suốt và Switch phải được khai báo `ip default-gateway` nếu người quản trị ngồi ở mạng khác.",
                                  "Mở rộng Nâng cao 4 — Cơ chế Khôi phục Mật khẩu (Password Recovery) qua Thanh ghi Cấu hình (Configuration Register): Điều gì xảy ra nếu quản trị viên cũ nghỉ việc mà không bàn giao mật khẩu enable secret? Nếu kẻ xấu tiếp cận được vật lý vào phòng Server, họ có thể cắm dây Console, tắt bật nguồn thiết bị và nhấn phím Break trong 60 giây đầu để vào chế độ cứu hộ **ROMMON**. Tại đây, đổi giá trị thanh ghi cấu hình thành confreg 0x2142 sẽ khiến thiết bị bỏ qua file startup-config trong NVRAM khi khởi động! Do đó, bảo mật vật lý phòng máy chủ (khóa tủ Rack, camera giám sát) quan trọng không kém việc đặt mật khẩu mạnh."
                              ],
        "advancedTopics_en":  [
                                  "Advanced Expansion 1 — The 4-Step Cisco IOS Boot Sequence: 1) **POST (Power-On Self-Test)** from ROM tests hardware; 2) **Bootstrap** loader in ROM locates the OS; 3) **Cisco IOS image (`.bin`)** loads from **Flash** into **RAM**; 4) **`startup-config`** loads from **NVRAM** into RAM as **`running-config`**.",
                                  "Advanced Expansion 2 — Cisco Password Types (Type 0, 5, 7, 8, 9): Type 0 is cleartext; Type 7 (`service password-encryption`) is a weak reversible cipher to prevent shoulder-surfing; Type 5 (`enable secret`) is a strong one-way MD5 hash; Types 8 and 9 use modern PBKDF2/SHA-256 and Scrypt hashing.",
                                  "Advanced Expansion 3 — Out-of-Band vs. In-Band Management: Out-of-Band uses a dedicated physical Console port (works even when the network is down). In-Band uses network traffic (SSH/Telnet) to connect to the switch\u0027s SVI (`interface vlan 1`) IP address."
                              ]
    },
    {
        "id":  3,
        "title":  "Protocols and Models",
        "title_vi":  "Giao Thức và Mô Hình Phân Tầng OSI \u0026 TCP/IP",
        "overview":  "Module 3 explains the rules (protocols) and reference architectures (OSI 7-Layer Model and TCP/IP 4-Layer Model) that allow hardware and software from different vendors to communicate seamlessly. Just as human conversation requires a common language, grammar, speed, and confirmation, network protocols define message encoding, formatting, encapsulation, size (segmentation), timing, and delivery options (unicast, multicast, broadcast). As application data travels down the stack on a sending host, each layer wraps it with a protocol header—a process called Encapsulation—creating specific Protocol Data Units (PDUs): Data -\u003e Segment -\u003e Packet -\u003e Frame -\u003e Bits.",
        "overview_vi":  "Module 3 giải thích tại sao một chiếc iPhone của Apple lại có thể tải trang web mượt mà từ một máy chủ chạy Linux đi qua thiết bị Router của Cisco: tất cả nhờ bộ quy tắc chuẩn hóa gọi là Giao thức (Protocols) và Mô hình phân tầng (Layered Models). Hai mô hình quan trọng nhất trong CCNA là mô hình lý thuyết 7 tầng OSI (Open Systems Interconnection) và mô hình thực tế 4 tầng TCP/IP. Khi bạn bấm gửi một tin nhắn, dữ liệu đi từ tầng trên cùng xuống tầng dưới cùng qua quá trình Đóng gói (Encapsulation): mỗi tầng sẽ bọc thêm một nhãn thông tin (Header) giống như bỏ thư vào phong bì, rồi bỏ phong bì vào thùng carton, dán mã vạch vận chuyển trước khi đưa lên xe tải.",
        "analogy_vi":  "Quá trình Đóng gói (Encapsulation) giống hệt gửi thư chuyển phát nhanh: 1) Nội dung bức thư bạn viết chính là Data (Tầng Application); 2) Bỏ vào phong bì ghi tên người gửi/người nhận ở phòng ban nào là Segment + Port (Tầng Transport); 3) Dán phiếu gửi ghi Địa chỉ nhà người gửi và người nhận từ TP.HCM đi Hà Nội là Packet + IP (Tầng Network); 4) Bỏ vào túi tải của xe tải chặng đầu tiên từ Nhà ra Bưu cục Quận là Frame + MAC (Tầng Data Link); 5) Bánh xe lăn trên mặt đường nhựa là Bits (Tầng Physical).",
        "keyConcepts":  [
                            "Three Message Delivery Options: 1) Unicast (1-to-1 delivery to a single destination host), 2) Multicast (1-to-many delivery to a specific subscribed group of hosts simultaneously), 3) Broadcast (1-to-all delivery to every host on the local network segment; heavily used in IPv4 ARP/DHCP, eliminated in IPv6).",
                            "OSI 7-Layer Reference Model (Top to Bottom): Layer 7 Application (HTTP, DNS, DHCP, FTP), Layer 6 Presentation (data formatting, compression, TLS encryption), Layer 5 Session (dialog control between applications), Layer 4 Transport (TCP/UDP, port numbers, segmentation), Layer 3 Network (IPv4/IPv6 logical addressing and routing), Layer 2 Data Link (Ethernet MAC addressing, switches, error detection via FCS), Layer 1 Physical (cables, connectors, hubs, electrical/optical bits).",
                            "TCP/IP 4-Layer Protocol Model: Maps directly to the OSI model: 1) Application Layer (combines OSI Layers 5, 6, 7), 2) Transport Layer (matches OSI Layer 4), 3) Internet Layer (matches OSI Layer 3), 4) Network Access Layer (combines OSI Layers 1 and 2).",
                            "Encapsulation \u0026 Protocol Data Units (PDUs): It is critical for CCNA exams to memorize the exact PDU name at each layer: Application = Data; Transport (L4) = Segment (TCP) or Datagram (UDP); Network (L3) = Packet; Data Link (L2) = Frame (adds both a Header and an FCS Trailer); Physical (L1) = Bits.",
                            "Segmentation \u0026 Multiplexing: Large files are chopped into smaller chunks (Segmentation) before transmission. Benefits: 1) Multiple different conversations can take turns sharing the same wire without blocking each other (Multiplexing), and 2) If one small chunk is corrupted, only that 1,500-byte segment needs to be resent instead of a whole 4GB movie.",
                            "Golden Rule of Layer 3 IP vs. Layer 2 MAC Addressing: End-to-End vs. Hop-by-Hop! The Source IP and Destination IP inside the Layer 3 Packet Header stay THE SAME from the original sender all the way to the final destination server (ignoring NAT). In contrast, the Source MAC and Destination MAC inside the Layer 2 Frame Header CHANGE at every single router hop!"
                        ],
        "keyConcepts_vi":  [
                               "3 Phương thức truyền thông điệp: 1) Unicast (Một - Một: gửi riêng cho đúng 1 máy nhận); 2) Multicast (Một - Một nhóm: gửi cùng lúc cho một nhóm máy đã đăng ký nhận, ví dụ xem truyền hình IPTV); 3) Broadcast (Một - Tất cả: la làng cho toàn bộ các máy trong cùng mạng LAN đều nghe thấy; dùng trong IPv4 nhưng đã bị khai tử trong IPv6 để tránh nghẽn mạng).",
                               "7 Tầng của Mô hình tham chiếu OSI (Từ tầng 7 xuống tầng 1): Tầng 7 Application (Giao tiếp với phần mềm người dùng: HTTP, DNS), Tầng 6 Presentation (Định dạng, nén và mã hóa dữ liệu: JPEG, MP4, SSL/TLS), Tầng 5 Session (Duy trì phiên làm việc), Tầng 4 Transport (Phân mảnh dữ liệu, kiểm soát lỗi TCP/UDP, đánh số cổng Port), Tầng 3 Network (Định tuyến đường đi tốt nhất qua địa chỉ logic IP), Tầng 2 Data Link (Truyền dữ liệu giữa 2 thiết bị kế cận qua địa chỉ vật lý MAC, kiểm tra lỗi FCS), Tầng 1 Physical (Dây cáp, đầu cắm, chuyển thành chuỗi bit 0 và 1).",
                               "4 Tầng của Mô hình thực tế TCP/IP: Gom gọn từ OSI để vận hành Internet: 1) Application (Gộp tầng 5 + 6 + 7 của OSI), 2) Transport (Tương ứng tầng 4 OSI), 3) Internet (Tương ứng tầng 3 OSI), 4) Network Access (Gộp tầng 1 + 2 của OSI).",
                               "Tên gọi Đơn vị dữ liệu (PDU) tại mỗi tầng — Bắt buộc thuộc lòng khi thi CCNA: Tầng 5–7 gọi là Data (Dữ liệu); Tầng 4 (Transport) gọi là Segment (với TCP) hoặc Datagram (với UDP); Tầng 3 (Network) gọi là Packet (Gói tin IP); Tầng 2 (Data Link) gọi là Frame (Khung tin — tầng duy nhất gắn cả phần đầu Header lẫn phần đuôi Trailer FCS); Tầng 1 (Physical) gọi là Bits (Chuỗi 0101).",
                               "Phân mảnh (Segmentation) và Ghép kênh (Multiplexing): Tại sao không gửi nguyên cục file 10GB đi một lần? Vì nếu làm vậy sẽ chiếm độc quyền đường cáp khiến người khác không gửi được gì, và nếu lỗi 1 bit phải gửi lại cả 10GB! Do đó Tầng 4 cắt nhỏ dữ liệu thành từng mảnh (Segmentation) để trộn lẫn nhiều cuộc hội thoại cùng đi qua 1 sợi cáp (Multiplexing), hỏng mảnh nào chỉ cần gửi lại đúng mảnh nhỏ đó.",
                               "Quy tắc Vàng về Địa chỉ IP (Tầng 3) và Địa chỉ MAC (Tầng 2): Khi gói tin đi qua nhiều trạm Router để tới đích ở mạng xa: Địa chỉ IP Nguồn và IP Đích (Tầng 3) GIỮ NGUYÊN từ đầu đến cuối hành trình; ngược lại, Địa chỉ MAC Nguồn và MAC Đích (Tầng 2) THAY ĐỔI Ở MỖI TRẠM ROUTER (mỗi khi qua 1 Router, lớp vỏ Frame cũ bị bóc bỏ và đóng lại vỏ Frame mới của chặng kế tiếp)!"
                           ],
        "realWorldExample":  "Scenario: PC1 (IP: `192.168.1.10`, MAC: `AA-AA`) requests a webpage from a remote Web Server (IP: `10.1.2.50`, MAC: `CC-CC`) through Router R1 (LAN MAC: `11-11`, WAN MAC: `22-22`).\n1. Application (L7): Browser creates an HTTP GET request (`Data`).\n2. Transport (L4): TCP encapsulates it into a `Segment` with Source Port `49152` and Destination Port `80` (HTTP).\n3. Network (L3): IP encapsulates it into a `Packet` with Source IP `192.168.1.10` and Destination IP `10.1.2.50`.\n4. Data Link (L2): Because `10.1.2.50` is on a remote network, PC1 sets the Frame\u0027s Source MAC to `AA-AA` and Destination MAC to Default Gateway R1\u0027s MAC (`11-11`).\n5. At Router R1: R1 strips off the L2 Frame (`AA-AA -\u003e 11-11`), reads Dest IP `10.1.2.50`, keeps Source/Dest IP unchanged, and wraps the packet in a brand-new L2 Frame with Source MAC `22-22` (R1 exit interface) and Destination MAC `CC-CC` (Web Server).",
        "realWorldExample_vi":  "Ví dụ minh họa chi tiết đường đi của gói tin từ Máy tính PC1 (`IP: 192.168.1.10`, `MAC: AA-AA`) truy cập Web Server ở mạng khác (`IP: 10.1.2.50`, `MAC: CC-CC`) đi qua Router R1 (Cổng trái `MAC: 11-11`, Cổng phải `MAC: 22-22`):\n• Bước 1 (Tại PC1 - Đóng gói từ tầng 7 xuống tầng 1):\n  - Tầng 7 (Application): Trình duyệt Chrome tạo yêu cầu tải trang web `HTTP GET` (PDU = Data).\n  - Tầng 4 (Transport): Đóng vào `Segment` TCP với Cổng nguồn `Src Port = 49152`, Cổng đích `Dst Port = 80` (cổng Web HTTP).\n  - Tầng 3 (Network): Đóng vào `Packet` IP với `Src IP = 192.168.1.10`, `Dst IP = 10.1.2.50`.\n  - Tầng 2 (Data Link): PC1 thấy `10.1.2.50` khác mạng với mình nên cần nhờ Router R1 chuyển giúp. Nó đóng vào `Frame` Ethernet với `Src MAC = AA-AA` (của PC1) và `Dst MAC = 11-11` (của cổng Router R1).\n• Bước 2 (Khi tới Router R1):\n  - Router R1 bóc bỏ vỏ Frame Tầng 2 cũ (`AA-AA -\u003e 11-11`), nhìn vào Tầng 3 thấy `Dst IP = 10.1.2.50`.\n  - Router R1 GIỮ NGUYÊN `Src IP = 192.168.1.10` và `Dst IP = 10.1.2.50`, nhưng đóng lại vỏ Frame Tầng 2 MỚI với `Src MAC = 22-22` (cổng ra của R1) và `Dst MAC = CC-CC` (của Web Server) rồi bắn tới Server!",
        "diagramType":  "osi-tcpip",
        "commands":  [
                         "Thứ tự Đóng gói (Encapsulation từ trên xuống): Data (L7-L5) -\u003e Segment (L4 TCP/UDP) -\u003e Packet (L3 IP) -\u003e Frame (L2 MAC + FCS) -\u003e Bits (L1)",
                         "Mẹo nhớ 7 tầng OSI từ Tầng 1 lên Tầng 7: Please (1-Physical) Do (2-Data Link) Not (3-Network) Throw (4-Transport) Sausage (5-Session) Pizza (6-Presentation) Away (7-Application)",
                         "Gửi trong cùng mạng LAN: Dst IP = Máy đích | Dst MAC = Địa chỉ MAC của chính Máy đích",
                         "Gửi sang mạng khác (Qua Router): Dst IP = Máy đích ở xa | Dst MAC = Địa chỉ MAC của cổng Default Gateway (Router nội bộ)"
                     ],
        "comparisonTable":  {
                                "title_vi":  "Bảng Tổng Hợp Chi Tiết 7 Tầng OSI, Đơn Vị PDU, Địa Chỉ \u0026 Thiết Bị Tương Ứng",
                                "headers_vi":  [
                                                   "Tầng OSI",
                                                   "Tầng TCP/IP",
                                                   "Đơn vị Dữ liệu (PDU)",
                                                   "Địa chỉ Định danh",
                                                   "Giao thức \u0026 Thiết bị Đặc trưng"
                                               ],
                                "rows":  [
                                             [
                                                 "7. Application",
                                                 "Application",
                                                 "Data (Dữ liệu)",
                                                 "Tên miền (FQDN), URL, Email",
                                                 "HTTP, HTTPS, DNS, DHCP, FTP, TFTP, SMTP, POP3, IMAP, SSH, Telnet, SNMP."
                                             ],
                                             [
                                                 "6. Presentation",
                                                 "Application",
                                                 "Data (Dữ liệu)",
                                                 "Định dạng File / Mã hóa",
                                                 "JPEG, PNG, GIF, MPEG, MP4, ASCII, UTF-8, Mã hóa TLS/SSL."
                                             ],
                                             [
                                                 "5. Session",
                                                 "Application",
                                                 "Data (Dữ liệu)",
                                                 "Session ID",
                                                 "Quản lý phiên hội thoại ứng dụng (NetBIOS, RPC, SQL Session)."
                                             ],
                                             [
                                                 "4. Transport",
                                                 "Transport",
                                                 "Segment (TCP) / Datagram (UDP)",
                                                 "Port Number (16-bit: 0–65535)",
                                                 "TCP (Hướng kết nối, tin cậy), UDP (Không kết nối, thời gian thực), Tường lửa L4."
                                             ],
                                             [
                                                 "3. Network",
                                                 "Internet",
                                                 "Packet (Gói tin)",
                                                 "Logical IP Address (IPv4 32-bit / IPv6 128-bit)",
                                                 "IPv4, IPv6, ICMP, OSPF, EIGRP, BGP, Thiết bị **Router** \u0026 **Switch Layer 3**."
                                             ],
                                             [
                                                 "2. Data Link",
                                                 "Network Access",
                                                 "Frame (Khung tin)",
                                                 "Physical MAC Address (48-bit / 12 số Hex)",
                                                 "Ethernet (802.3), Wi-Fi (802.11), PPP, ARP, VLAN, STP, Thiết bị **Switch Layer 2**, Card NIC."
                                             ],
                                             [
                                                 "1. Physical",
                                                 "Network Access",
                                                 "Bits (Chuỗi bit 0 và 1)",
                                                 "Không có địa chỉ (Chỉ có xung tín hiệu)",
                                                 "Cáp đồng UTP/STP, Đầu RJ-45, Cáp quang SMF/MMF, Sóng RF, Thiết bị **Hub**, **Repeater**, **Modem**."
                                             ]
                                         ]
                            },
        "jobSkills_vi":  [
                             "Kinh nghiệm Đi Làm 1 — Dùng phần mềm Wireshark để soi từng lớp Đóng gói (Encapsulation) ngoài đời thực: Khi đi làm gặp lỗi phần mềm không kết nối được Server, kỹ sư mạng sẽ bật **Wireshark** bắt gói tin trên card mạng. Cửa sổ giữa của Wireshark hiển thị đúng 5 dòng tương ứng 5 lớp đóng gói từ ngoài vào trong: 1) `Frame` (Thông tin vật lý Tầng 1), 2) `Ethernet II` (Chứa `Src MAC` và `Dst MAC` Tầng 2), 3) `Internet Protocol Version 4` (Chứa `Src IP` và `Dst IP` Tầng 3), 4) `Transmission Control Protocol` (Chứa `Src Port` và `Dst Port` Tầng 4), 5) `Hypertext Transfer Protocol` (Dữ liệu Tầng 7).",
                             "Kinh nghiệm Đi Làm 2 — Bẫy \u0027NAT làm đổi IP\u0027 trong thực tế vs. Lý thuyết phòng Lab: Trong bài thi CCNA cơ bản, quy tắc là: *\u0027Khi đi qua Router, MAC Nguồn/Đích luôn thay đổi ở mỗi chặng, còn IP Nguồn/Đích giữ nguyên từ đầu đến cuối\u0027*. Tuy nhiên khi đi làm thực tế, tại con Router biên nối ra nhà mạng ISP có bật tính năng **NAT (Network Address Translation)**, địa chỉ `Source IP Private` (ví dụ `192.168.1.10`) sẽ được dịch sang `Source IP Public` của công ty (ví dụ `113.161.72.5`) để đi ra ngoài Internet!",
                             "Kinh nghiệm Đi Làm 3 — Hiểu rõ Miền Đụng Độ (Collision Domain) và Miền Quảng Bá (Broadcast Domain): • **Hub (Tầng 1)**: Tất cả các cổng chung 1 Collision Domain và 1 Broadcast Domain. • **Switch (Tầng 2)**: Mỗi cổng của Switch là **1 Collision Domain riêng biệt** (nhờ Full-Duplex nên không còn đụng độ), nhưng tất cả các cổng cùng 1 VLAN vẫn nằm chung **1 Broadcast Domain** (1 máy phát Broadcast là cả Switch nghe thấy). • **Router (Tầng 3) hoặc chia VLAN**: Chặn đứng gói Broadcast — mỗi cổng của Router (hoặc mỗi VLAN) là **1 Broadcast Domain riêng biệt**!"
                         ],
        "quiz":  [
                     {
                         "question_vi":  "Câu 1 (Đề thi CCNA): Khi máy tính PC1 (192.168.1.10) gửi một gói tin đến máy chủ Web Server (172.16.50.100) đi qua 3 thiết bị Router trung gian, thông tin địa chỉ nào trong gói tin sẽ THAY ĐỔI tại mỗi trạm Router?",
                         "options_vi":  [
                                            "A. Địa chỉ IPv4 Nguồn và Địa chỉ IPv4 Đích",
                                            "A. Số hiệu cổng TCP Nguồn và Đích (Source \u0026 Destination Port)",
                                            "C. Địa chỉ vật lý MAC Nguồn và Địa chỉ MAC Đích trong khung tin Tầng 2 (Data Link Frame)",
                                            "D. Dữ liệu tầng Application (HTTP Payload)"
                                        ],
                         "answerIndex":  2,
                         "explanation_vi":  "Đáp án đúng là C. Địa chỉ IP Tầng 3 mang tính toàn trình (End-to-End) nên giữ nguyên từ máy gửi đến máy nhận cuối cùng. Ngược lại, địa chỉ MAC Tầng 2 chỉ có giá trị trên từng đoạn dây cục bộ (Hop-by-Hop): mỗi khi qua một Router, Router sẽ bóc bỏ khung Frame cũ và đóng lại khung Frame mới với Source MAC là cổng xuất của Router đó và Destination MAC là cổng của Router kế tiếp."
                     },
                     {
                         "question_vi":  "Câu 2 (Đề thi CCNA): Đơn vị dữ liệu giao thức (PDU) tại Tầng 4 (Transport Layer) khi sử dụng giao thức TCP và tại Tầng 2 (Data Link Layer) lần lượt được gọi là gì?",
                         "options_vi":  [
                                            "A. Packet và Frame",
                                            "B. Segment và Frame",
                                            "C. Data và Packet",
                                            "D. Frame và Bits"
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B. Thứ tự tên gọi PDU từ trên xuống: Tầng 5–7 là Data -\u003e Tầng 4 (Transport) là Segment (hoặc Datagram với UDP) -\u003e Tầng 3 (Network) là Packet -\u003e Tầng 2 (Data Link) là Frame -\u003e Tầng 1 (Physical) là Bits."
                     },
                     {
                         "question_vi":  "Câu 3 (Đề thi CCNA): Thiết bị nào sau đây có khả năng chia cắt Miền Quảng Bá (Broadcast Domain), không cho các gói tin Broadcast tràn từ mạng LAN này sang mạng LAN khác?",
                         "options_vi":  [
                                            "A. Hub",
                                            "B. Repeater",
                                            "C. Switch Layer 2 (khi tất cả các cổng cùng thuộc VLAN 1 mặc định)",
                                            "D. Router"
                                        ],
                         "answerIndex":  3,
                         "explanation_vi":  "Đáp án đúng là D (Router). Switch Layer 2 chỉ chia cắt Miền đụng độ (mỗi cổng là 1 Collision Domain) nhưng vẫn Flood gói tin Broadcast ra tất cả các cổng cùng VLAN. Chỉ có Router (Tầng 3) hoặc việc chia VLAN mới chặn và tách biệt các Broadcast Domain."
                     }
                 ],
        "beginnerGuide_vi":  [
                                 "1. Tại sao phải chia mạng thành 7 tầng (OSI) hay 4 tầng (TCP/IP) cho phức tạp? Hãy tưởng tượng việc sản xuất một chiếc ô tô: nếu bắt 1 công ty tự làm từ lốp cao su, kính chắn gió, động cơ cho tới phần mềm bản đồ thì không ai làm nổi! Chia mạng thành từng tầng độc lập giúp: Hãng làm dây cáp/card mạng chỉ cần lo Tầng 1–2, hệ điều hành Windows/Linux lo Tầng 3–4 (TCP/IP), còn lập trình viên viết web Chrome/Zalo chỉ cần lo Tầng 7 — miễn là các tầng giao tiếp đúng chuẩn với nhau!",
                                 "2. Hiểu rõ \u0027Giao thức (Protocol)\u0027 là gì? Giao thức đơn giản là **Bộ quy tắc ứng xử chung**. Giống như hai người nói chuyện điện thoại: phải thống nhất nói cùng một ngôn ngữ (Tiếng Việt), nói tốc độ vừa phải để người kia nghe kịp (Flow control), nói xong một câu hỏi \u0027Nghe rõ không?\u0027 (Acknowledgment). Trong mạng máy tính: Web dùng giao thức `HTTP/HTTPS`, gửi thư dùng `SMTP`, tìm địa chỉ IP dùng `DNS`.",
                                 "3. Đóng gói (Encapsulation) và Mở gói (De-encapsulation) diễn ra như thế nào? Khi máy tính A gửi một bức ảnh cho máy tính B: Dữ liệu đi từ Tầng 7 xuống Tầng 1, đi qua mỗi tầng lại được **bọc thêm một chiếc phong bì (Header)** ghi thông tin của tầng đó (gọi là **Encapsulation**). Khi tới máy tính B, dữ liệu đi ngược từ Tầng 1 lên Tầng 7, mỗi tầng lại **xé bỏ chiếc phong bì tương ứng** để kiểm tra rồi giao bức ảnh nguyên vẹn lên màn hình (gọi là **De-encapsulation**).",
                                 "4. Giải thích cực dễ hiểu từng tầng trong 7 tầng OSI từ trên xuống dưới (Chiều gửi dữ liệu): Hãy theo dõi một bức ảnh bạn gửi qua web: • **Tầng 7 (Ứng dụng - Application)**: Trình duyệt tạo yêu cầu gửi ảnh (HTTP). • **Tầng 6 (Trình diễn - Presentation)**: Định dạng bức ảnh thành chuẩn nén .JPG và mã hóa bảo mật SSL/TLS. • **Tầng 5 (Phiên - Session)**: Mở và duy trì phiên làm việc giữa máy bạn và máy chủ. • **Tầng 4 (Giao vận - Transport)**: Cắt bức ảnh lớn thành từng mảnh nhỏ (**Segment**), đánh số thứ tự 1, 2, 3... và ghi số cổng dịch vụ (Port 443). • **Tầng 3 (Mạng - Network)**: Bỏ mảnh đó vào phong bì (**Packet**), ghi Địa chỉ IP máy bạn (IP Nguồn) và Địa chỉ IP máy chủ (IP Đích). • **Tầng 2 (Liên kết dữ liệu - Data Link)**: Bọc thêm vỏ khung (**Frame**), ghi Địa chỉ MAC của máy bạn và MAC của Router gần nhất. • **Tầng 1 (Vật lý - Physical)**: Biến toàn bộ khung tin thành chuỗi bit \u000010101... rồi phát thành xung điện chạy trên dây cáp đồng!",
                                 "5. Phân biệt 3 kiểu gửi tin trong mạng (Unicast, Broadcast, Multicast): • **Unicast (Một - Một)**: Bạn nhắn tin riêng cho đúng 1 người bạn — chỉ máy tính có IP/MAC đích đó nhận và xử lý. • **Broadcast (Một - Tất cả)**: Giống như loa phóng thanh phường phát thông báo — gói tin gửi tới địa chỉ quảng bá sẽ bắt buộc **mọi máy tính trong cùng mạng LAN** phải dừng việc đang làm để lắng nghe (dùng nhiều sẽ gây nghẽn mạng). • **Multicast (Một - Một nhóm)**: Giống như kênh truyền hình cáp hoặc phòng livestream — chỉ những máy tính nào đăng ký tham gia nhóm mới nhận luồng dữ liệu đó, các máy khác không bị làm phiền."
                             ],
        "beginnerGuide_en":  [
                                 "1. Why split networking into 7 layers (OSI) or 4 layers (TCP/IP)? Modularity! Cable manufacturers only worry about Layer 1, switch chip makers focus on Layer 2, OS developers implement Layers 3–4 (TCP/IP), and web developers build at Layer 7. Changes at one layer (like switching from Wi-Fi to Fiber cable) never break the upper-layer browser application.",
                                 "2. What is a Protocol? A protocol is an agreed-upon set of rules governing communication format, timing, size, and error checking—such as HTTP for web browsing, SMTP for email, and IP for routing.",
                                 "3. Encapsulation vs. De-encapsulation: When sending data down the stack (Layer 7 -\u003e Layer 1), each layer wraps the data with its own control header (**Encapsulation**: Data -\u003e Segment -\u003e Packet -\u003e Frame -\u003e Bits). The receiving device strips each header off from bottom to top (**De-encapsulation**: Bits -\u003e Frame -\u003e Packet -\u003e Segment -\u003e Data)."
                             ],
        "advancedTopics_vi":  [
                                  "Mở rộng Nâng cao 1 — Phân tích chi tiết 5 thông tin địa chỉ nằm trong 1 khung tin hoàn chỉnh: Khi một gói tin chạy trên dây cáp mạng từ PC1 ra Internet, bên trong nó chứa đồng thời các lớp địa chỉ sau: • **Lớp ngoài cùng (Tầng 2 - Frame Header)**: Chứa `Destination MAC` (6B) và `Source MAC` (6B) — chỉ dùng để đi từ thiết bị này sang thiết bị kế tiếp trong cùng mạng LAN; • **Lớp thứ hai (Tầng 3 - IP Packet Header)**: Chứa `Source IP` và `Destination IP` — giữ nguyên suốt hành trình từ máy gửi đến máy chủ đích; • **Lớp thứ ba (Tầng 4 - TCP/UDP Segment Header)**: Chứa `Source Port` (ví dụ `50112`) và `Destination Port` (ví dụ `443` cho Web HTTPS) — giúp máy chủ đích biết giao dữ liệu cho phần mềm Web chứ không phải phần mềm Mail!",
                                  "Mở rộng Nâng cao 2 — Tại sao phải dùng cả Địa chỉ MAC (Tầng 2) LẪN Địa chỉ IP (Tầng 3)? Nhiều người mới học thắc mắc: \u0027Đã có địa chỉ MAC duy nhất cho từng máy rồi thì cần địa chỉ IP làm gì nữa?\u0027. Lý do: **Địa chỉ MAC là địa chỉ phẳng (Flat address)** gắn chết theo nhà sản xuất — giống như Số Căn Cước Công Dân (nhìn số CCCD bạn không thể biết người đó hiện đang đứng ở quận nào, tỉnh nào để gửi thư!). Ngược lại, **Địa chỉ IP là địa chỉ phân cấp (Hierarchical address)** giống như Địa chỉ bưu chính (Quốc gia -\u003e Tỉnh -\u003e Quận -\u003e Số nhà), giúp các Router trên toàn cầu định tuyến gói tin tới đúng khu vực địa lý chỉ trong vài mili-giây; khi gói tin đã về tới đúng phòng LAN cuối cùng rồi thì Switch mới dùng **Địa chỉ MAC** để trao tận tay cho đúng chiếc máy tính đó!",
                                  "Mở rộng Nâng cao 3 — Phân mảnh gói tin (IP Fragmentation) và Tham số MTU (Maximum Transmission Unit): Mỗi công nghệ mạng Tầng 2 có một giới hạn kích thước khung dữ liệu tối đa gọi là **MTU** (với Ethernet tiêu chuẩn là **1500 Bytes**). Nếu tầng trên đẩy xuống một gói tin IP lớn hơn 1500 Bytes (hoặc khi gói tin được bọc thêm lớp vỏ đường hầm VPN như GRE/IPsec làm phình kích thước), Router sẽ phải cắt nhỏ gói tin thành nhiều mảnh (**Fragmentation**) hoặc báo lỗi qua ICMP để máy nguồn tự thu nhỏ kích thước gói (**Path MTU Discovery - PMTUD**)."
                              ],
        "advancedTopics_en":  [
                                  "Advanced Expansion 1 — The 3 Pairs of Addresses Inside Every Frame: Every frame on the wire carries: 1) **Layer 2 MAC Addresses** (`Dst MAC` \u0026 `Src MAC`) for local hop-to-hop delivery; 2) **Layer 3 IP Addresses** (`Src IP` \u0026 `Dst IP`) for end-to-end global routing across networks; 3) **Layer 4 Port Numbers** (`Src Port` \u0026 `Dst Port`) to identify the specific application process.",
                                  "Advanced Expansion 2 — Why Do We Need BOTH MAC Addresses and IP Addresses? A MAC address is a **flat hardware identifier** (like a Social Security Number or Passport ID)—it tells you WHO the device is, but not WHERE it is located in the world, so global routers cannot aggregate billions of MAC addresses. An IP address is a **hierarchical logical address** (like a Postal Zip Code + Street Address) that tells routers WHERE the network is located; once the packet reaches the destination LAN, Layer 2 uses the MAC address to deliver the frame to the physical NIC."
                              ]
    },
    {
        "id":  4,
        "title":  "Physical Layer",
        "title_vi":  "Tầng Vật Lý và Hệ Thống Cáp Mạng",
        "overview":  "Module 4 focuses on OSI Layer 1 (Physical Layer), which takes the complete Frame from the Data Link Layer and converts it into binary signals—electrical voltage pulses on copper wires, light pulses on glass optical fibers, or radio waves in wireless environments. You learn how bandwidth, latency, throughput, and goodput are measured, how Unshielded Twisted Pair (UTP) cabling cancels electromagnetic interference and crosstalk without metal shielding, how to wire RJ-45 connectors using TIA/EIA-568A and 568B standards (Straight-Through vs. Crossover cables), and when to deploy Single-Mode vs. Multimode Fiber-Optic cabling.",
        "overview_vi":  "Module 4 đi sâu vào Tầng 1 OSI (Physical Layer) — nơi biến các khung dữ liệu (Frame) thành tín hiệu vật lý thực sự chạy trên đường truyền: xung điện trên cáp đồng, tia sáng trong lõi cáp quang, hoặc sóng vô tuyến Wi-Fi ngoài không gian. Tại đây, bạn sẽ hiểu rõ tại sao 8 sợi dây đồng nhỏ bên trong cáp mạng UTP lại phải xoắn đôi với nhau theo từng cặp màu, chuẩn bấm hạt mạng RJ-45 theo bảng màu T568A và T568B (khi nào bấm cáp thẳng Straight-through, khi nào bấm cáp chéo Crossover), sự khác biệt giữa cáp quang Single-mode (lõi nhỏ truyền tia Laser đi xa hàng chục km) và Multimode (lõi lớn truyền đèn LED trong tòa nhà), cũng như phân biệt Bandwidth (Băng thông quảng cáo) với Throughput và Goodput (Tốc độ tải thực tế).",
        "analogy_vi":  "Nếu Tầng 2–7 là quy tắc giao thông và cách đóng thùng hàng, thì Tầng 1 (Physical Layer) chính là mặt đường cao tốc và động cơ xe: Bandwidth (Băng thông) là độ rộng mặt đường 6 làn xe cho phép tối đa 1000 xe/phút; Throughput (Thông lượng) là số xe thực tế đi qua được lúc giờ cao điểm (chỉ còn 600 xe/phút); còn Goodput là khối lượng hàng hóa thực sự nằm trong thùng xe (trừ đi trọng lượng xác xe tức là phần Header bao bì của giao thức).",
        "keyConcepts":  [
                            "Bandwidth, Latency, Throughput, and Goodput: Bandwidth is the theoretical maximum capacity of a link (measured in Kbps, Mbps, Gbps). Latency is the delay time it takes for a bit to travel from source to destination. Throughput is the actual measured bit transfer rate over time (often limited by congestion or slowest link). Goodput = Throughput minus all protocol overhead (headers/trailers); it is the actual usable application data transfer rate.",
                            "Copper Cabling (UTP, STP, Coaxial): Unshielded Twisted Pair (UTP) is the standard LAN cable (Cat5e, Cat6, Cat6a) terminated with 8-pin RJ-45 (ISO 8877) connectors. UTP has no metallic foil shield; instead, it prevents EMI/RFI and Crosstalk using two clever physics techniques: 1) Cancellation (wires in each pair carry equal and opposite electrical currents, canceling magnetic fields) and 2) Varying Twist Rates (each of the 4 color pairs has a different number of twists per inch so pairs don\u0027t interfere with each other).",
                            "TIA/EIA-568A vs. 568B \u0026 Straight-Through vs. Crossover: T568A and T568B swap the Green pair (pins 1,2) and Orange pair (pins 3,6). Straight-Through Cable (both ends T568B or both T568A) connects UNLIKE devices (PC-to-Switch, Switch-to-Router). Crossover Cable (one end T568A, other end T568B) connects LIKE devices (Switch-to-Switch, PC-to-PC, Router-to-Router, and PC-to-Router since both use pins 1,2 to transmit). Modern switches use Auto-MDIX to auto-detect cable type.",
                            "Fiber-Optic Cabling (SMF vs. MMF): Transmits light pulses through pure glass core surrounded by cladding (which reflects light back into the core via Total Internal Reflection), buffer, Kevlar strengthening material, and outer jacket. Completely immune to EMI/RFI and lightning. Single-Mode Fiber (SMF, yellow jacket, 9-micron core) uses a single-path Laser for long distances up to 100 km. Multimode Fiber (MMF, orange/aqua jacket, 50/62.5-micron core) uses lower-cost LED light over multiple paths for LAN backbones up to 550 meters.",
                            "Wireless Media Standards (IEEE 802.11 / 802.15): Uses microwave/radio frequencies (2.4 GHz and 5 GHz/6 GHz). Challenges: Coverage area blocked by concrete/metal walls, interference from microwaves/cordless phones, shared half-duplex medium (only one station transmits at a time per channel), and security (anyone nearby can intercept radio waves without encryption)."
                        ],
        "keyConcepts_vi":  [
                               "Phân biệt 4 thông số tốc độ (Bandwidth, Latency, Throughput, Goodput): 1) Bandwidth (Băng thông): Dung lượng tối đa theo lý thuyết của sợi cáp (ví dụ cổng Gigabit = 1000 Mbps); 2) Latency (Độ trễ): Thời gian tín hiệu đi từ điểm A sang điểm B (tính bằng mili-giây ms); 3) Throughput (Thông lượng): Tốc độ truyền thực tế đo được tại một thời điểm (luôn bị giới hạn bởi mắt xích chậm nhất trên đường đi); 4) Goodput: Tốc độ dữ liệu hữu ích thực sự mà người dùng nhận được (Goodput = Throughput trừ đi dung lượng các nhãn Header của TCP/IP/Ethernet).",
                               "Cáp đồng xoắn đôi UTP chống nhiễu bằng cách nào khi không có vỏ bọc kim loại? Cáp UTP (Cat5e, Cat6) gồm 8 sợi đồng chia làm 4 cặp xoắn nhau, bấm đầu RJ-45. Để chống Nhiễu điện từ (EMI/RFI) và Nhiễu xuyên âm giữa các sợi dây bên cạnh (Crosstalk), UTP dùng 2 nguyên lý vật lý: 1) Tự triệt tiêu từ trường (Cancellation: 2 dây trong 1 cặp mang dòng điện ngược chiều nhau nên từ trường triệt tiêu nhau) và 2) Bước xoắn khác nhau (mỗi cặp màu Cam, Xanh lá, Xanh dương, Nâu có độ xoắn dày/thưa khác nhau).",
                               "Chuẩn bấm cáp T568A, T568B — Cáp Thẳng (Straight-through) và Cáp Chéo (Crossover): Chuẩn A và B chỉ khác nhau ở vị trí cặp màu Xanh lá và Cam (Chân 1-2 và Chân 3-6). Cáp Thẳng (2 đầu bấm giống hệt nhau, thường là B–B) dùng nối 2 thiết bị KHÁC LOẠI (PC nối Switch, Switch nối Router). Cáp Chéo (1 đầu chuẩn A, 1 đầu chuẩn B) dùng nối 2 thiết bị CÙNG LOẠI (Switch nối Switch, PC nối PC, Router nối Router, và đặc biệt PC nối thẳng vào Router vì cả hai đều phát ở chân 1-2, thu ở chân 3-6). Ngày nay tính năng `Auto-MDIX` giúp thiết bị tự nhận diện dù cắm cáp thẳng hay chéo.",
                               "Cáp Quang (Single-Mode vs. Multimode): Truyền dữ liệu bằng xung ánh sáng qua lõi thủy tinh siêu tinh khiết, hoàn toàn miễn nhiễm với sấm sét và nhiễu điện từ. Có 2 loại cần nhớ: 1) Single-Mode Fiber (SMF - vỏ màu Vàng): Lõi cực nhỏ (9 micromet), dùng nguồn phát tia Laser đi 1 tia thẳng duy nhất, truyền xa tới hàng chục – 100 km (nối các tỉnh/quốc gia). 2) Multimode Fiber (MMF - vỏ màu Cam hoặc Xanh ngọc): Lõi to hơn (50 hoặc 62.5 micromet), dùng đèn LED giá rẻ phát nhiều tia phản xạ, truyền trong nội bộ tòa nhà/trường học khoảng 500 mét.",
                               "Môi trường Không Dây (Wireless): Linh hoạt nhưng có 4 nhược điểm lớn: 1) Vùng phủ sóng phụ thuộc vật cản (tường bê tông, kính kim loại); 2) Dễ bị nhiễu sóng bởi lò vi sóng, thiết bị Bluetooth ở tần số 2.4GHz; 3) Bảo mật kém hơn cáp vật lý vì sóng phát ra không trung ai cũng bắt được nếu không mã hóa WPA2/WPA3; 4) Hoạt động ở chế độ Bán song công (Half-Duplex — tại 1 thời điểm chỉ 1 máy được phát, càng nhiều máy truy cập tốc độ càng giảm)."
                           ],
        "realWorldExample":  "Scenario: You are cabling a 3-floor office building.\n1. On Floor 1, you connect 24 employee PCs to a Cisco Switch (up to 45 meters away) using Cat6 UTP Straight-Through cables (T568B on both ends: White-Orange, Orange, White-Green, Blue, White-Blue, Green, White-Brown, Brown).\n2. You need to connect the Floor 1 Switch to the Main Core Switch in another building 400 meters away, running past high-voltage elevator motors. Copper UTP fails beyond 100 meters and suffers from elevator EMI, so you install Multimode Fiber-Optic (MMF) cabling with LC duplex connectors, achieving 10 Gbps with zero electromagnetic interference.",
        "realWorldExample_vi":  "Bài toán thực tế đi dây mạng cho tòa nhà công ty:\n• Tình huống 1 (Trong phòng làm việc): Bạn cần nối 20 máy tính PC vào Switch ở góc phòng (khoảng cách 25 mét). Vì PC và Switch là 2 thiết bị khác loại và khoảng cách \u003c 100m, bạn dùng cáp đồng UTP Cat6 bấm chuẩn Cáp Thẳng (2 đầu đều bấm chuẩn T568B: Trắng Cam - Cam - Trắng Xanh Lá - Xanh Dương - Trắng Xanh Dương - Xanh Lá - Trắng Nâu - Nâu).\n• Tình huống 2 (Nối 2 tòa nhà cách nhau 350 mét đi ngang qua trạm biến áp): Bạn KHÔNG THỂ dùng cáp đồng UTP vì vượt quá giới hạn 100 mét của Ethernet (tín hiệu điện sẽ suy hao mất sạch) và trạm biến áp sẽ gây nhiễu điện từ (EMI) cực nặng. Giải pháp chuẩn CCNA là kéo Cáp Quang Multimode (MMF, khoảng cách \u003c 550m) hoặc Single-mode (SMF) cắm module quang SFP vào cổng Gigabit trên 2 Switch — vừa đạt tốc độ 10 Gbps, vừa cách điện chống sét hoàn toàn!",
        "diagramType":  "rj45-pinout",
        "commands":  [
                         "Bảng màu chuẩn T568A (Chân 1 -\u003e 8): Trắng-XanhLá | XanhLá | Trắng-Cam | XanhDương | Trắng-XanhDương | Cam | Trắng-Nâu | Nâu",
                         "Bảng màu chuẩn T568B (Chân 1 -\u003e 8): Trắng-Cam | Cam | Trắng-XanhLá | XanhDương | Trắng-XanhDương | XanhLá | Trắng-Nâu | Nâu",
                         "Quy tắc bấm cáp (khi tắt Auto-MDIX): Khác nhóm thiết bị = Cáp Thẳng (A-A hoặc B-B) | Cùng nhóm thiết bị (PC-PC, Switch-Switch, Router-Router, PC-Router) = Cáp Chéo (A-B)",
                         "Switch# show interfaces fastethernet 0/1   # Kiểm tra trạng thái vật lý Tầng 1, tốc độ (Speed), chế độ Duplex và đếm lỗi cáp (CRC/Runts)",
                         "Switch(config-if)# mdix auto               # Bật tự động nhận diện cáp thẳng/chéo (yêu cầu speed auto và duplex auto)"
                     ],
        "comparisonTable":  {
                                "title_vi":  "Bảng Tiêu Chuẩn Cáp Đồng UTP \u0026 Cáp Quang IEEE 802.3 (Bắt Buộc Thuộc Khi Thi \u0026 Đi Làm)",
                                "headers_vi":  [
                                                   "Tên Chuẩn / Loại Cáp",
                                                   "Loại Môi Trường",
                                                   "Tốc Độ Tối Đa",
                                                   "Khoảng Cách Tối Đa \u0026 Ứng Dụng Thực Tế"
                                               ],
                                "rows":  [
                                             [
                                                 "Cat 5e UTP (1000BASE-T)",
                                                 "Cáp đồng xoắn đôi 4 cặp (Tần số 100 MHz)",
                                                 "1 Gbps",
                                                 "Tối đa **100 mét** (90m cáp âm tường + 10m dây nhảy Patch cord). Rất phổ biến cho PC/Camera."
                                             ],
                                             [
                                                 "Cat 6 UTP (10GBASE-T)",
                                                 "Cáp đồng xoắn đôi có lõi nhựa chữ thập chống nhiễu (250 MHz)",
                                                 "1 Gbps (100m) / 10 Gbps (55m)",
                                                 "Tối đa **100 mét** ở tốc độ 1 Gbps (hoặc **55 mét** ở tốc độ 10 Gbps). Chuẩn lắp đặt văn phòng hiện nay."
                                             ],
                                             [
                                                 "Cat 6A UTP / STP (10GBASE-T)",
                                                 "Cáp đồng chống nhiễu cao cấp (Tần số 500 MHz)",
                                                 "10 Gbps",
                                                 "Đạt trọn vẹn **100 mét ở tốc độ 10 Gbps**. Dùng cho Wi-Fi 6/7 Access Point và Server."
                                             ],
                                             [
                                                 "Multimode Fiber - MMF (OM3 / OM4 - 10GBASE-SR)",
                                                 "Cáp quang Đa mốt (Lõi lớn 50 µm, vỏ màu **Cam** hoặc **Xanh Ngọc Aqua**), dùng nguồn phát **LED / VCSEL**.",
                                                 "10 Gbps – 100 Gbps",
                                                 "Khoảng cách ngắn **300m – 550m**. Dùng nối trục đứng (Backbone) giữa các tầng trong cùng tòa nhà hoặc trong Data Center."
                                             ],
                                             [
                                                 "Single-Mode Fiber - SMF (OS1 / OS2 - 10GBASE-LR/ER)",
                                                 "Cáp quang Đơn mốt (Lõi siêu nhỏ 9 µm, vỏ màu **Vàng**), dùng nguồn phát **Tia Laser**.",
                                                 "10 Gbps – 400 Gbps+",
                                                 "Khoảng cách cực xa từ **10 km đến 100 km**. Dùng nối các tòa nhà khác nhau, nối liên tỉnh hoặc cáp quang biển."
                                             ],
                                             [
                                                 "Cáp Console (Rollover Cable)",
                                                 "Cáp dẹt màu xanh ngọc (Chân 1 nối chân 8, chân 2 nối chân 7... đảo ngược hoàn toàn 1–8 \u003c-\u003e 8–1).",
                                                 "9600 bps (Serial)",
                                                 "Chỉ dùng để cắm từ cổng COM/USB của Laptop vào cổng Console cấu hình thiết bị Cisco."
                                             ]
                                         ]
                            },
        "jobSkills_vi":  [
                             "Kinh nghiệm Đi Làm 1 — Tại sao cắm dây mạng dài 120 mét vẫn sáng đèn nhưng mạng rớt liên tục? Theo tiêu chuẩn IEEE 802.3, giới hạn vật lý của cáp đồng UTP là **100 mét** (do hiện tượng suy hao điện áp Attenuation và trễ tín hiệu). Khi kéo quá 100 mét, tín hiệu bị yếu đi làm gói tin lớn (1500 Bytes) bị lỗi CRC liên tục. Giải pháp khi đi làm: Nếu khoảng cách \u003e 100m, bắt buộc phải đặt thêm 1 Switch ở giữa để khuếch đại lại tín hiệu, hoặc chuyển sang kéo **Cáp Quang kèm bộ chuyển đổi Quang-Điện (Media Converter / Module SFP)**!",
                             "Kinh nghiệm Đi Làm 2 — Tại sao máy tính có card mạng 1 Gbps mà chỉ nhận tốc độ 100 Mbps? Hãy nhớ kỹ nguyên tắc vật lý: Mạng **FastEthernet (100 Mbps)** chỉ cần dùng **2 cặp dây (4 sợi ở chân 1, 2, 3, 6)** là chạy được; nhưng mạng **GigabitEthernet (1000 Mbps)** bắt buộc phải dùng đủ **cả 4 cặp dây (đủ cả 8 sợi từ chân 1 đến chân 8)**! Nếu kỹ thuật viên bấm hạt mạng RJ-45 bị lỏng hoặc đứt 1 sợi ở chân số 4, 5, 7 hoặc 8, đèn mạng vẫn sáng và máy vẫn vào mạng được nhưng tốc độ sẽ tự động tụt từ `1000 Mbps` xuống còn `100 Mbps`!",
                             "Kinh nghiệm Đi Làm 3 — Quy tắc đấu nối Module Quang SFP (TX và RX phải bắt chéo nhau): Khi cắm dây nhảy quang (Fiber Patch Cord) có 2 sợi vào 2 đầu Module SFP trên 2 Switch: Cổng phát ánh sáng (**TX - Transmit**) của Switch A bắt buộc phải cắm vào cổng thu ánh sáng (**RX - Receive**) của Switch B. Nếu cắm xong mà đèn cổng quang không sáng, thao tác đầu tiên của kỹ sư mạng là rút 2 đầu dây nhảy quang ở 1 phía ra và **đảo vị trí trái-phải (TX \u003c-\u003e RX)** cho nhau!"
                         ],
        "quiz":  [
                     {
                         "question_vi":  "Câu 1 (Đề thi CCNA): Kỹ sư mạng cần kéo một đường cáp kết nối hai Switch nằm ở hai tòa nhà cách nhau 400 mét, đi ngang qua khu vực máy phát điện công suất lớn có nhiều nhiễu điện từ (EMI). Loại cáp nào phù hợp nhất và tiết kiệm chi phí nhất?",
                         "options_vi":  [
                                            "A. Cáp đồng xoắn đôi UTP Cat 6",
                                            "B. Cáp đồng bọc kim loại STP Cat 6A",
                                            "C. Cáp quang Multimode (MMF) hoặc Single-mode (SMF)",
                                            "D. Cáp đồng trục Coaxial RG-6"
                                        ],
                         "answerIndex":  2,
                         "explanation_vi":  "Đáp án đúng là C (Cáp quang). Mọi loại cáp đồng Ethernet (kể cả UTP và STP Cat6A) đều bị giới hạn ở khoảng cách tối đa 100 mét. Với khoảng cách 400 mét và đi qua vùng nhiễu điện từ cao, cáp quang là lựa chọn duy nhất vì truyền bằng ánh sáng (miễn nhiễm 100% với EMI/RFI và truyền xa từ 500m đến hàng chục km)."
                     },
                     {
                         "question_vi":  "Câu 2 (Đề thi CCNA): Trong trường hợp tính năng Auto-MDIX bị tắt, bạn cần dùng loại cáp nào để nối trực tiếp từ cổng Ethernet của một máy tính PC vào cổng GigabitEthernet của một thiết bị Router?",
                         "options_vi":  [
                                            "A. Cáp Thẳng (Straight-through cable)",
                                            "B. Cáp Chéo (Crossover cable)",
                                            "C. Cáp Console (Rollover cable)",
                                            "D. Cáp Đồng trục (Coaxial cable)"
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B (Cáp Chéo - Crossover). Đây là câu hỏi bẫy kinh điển của CCNA! Trong chuẩn Ethernet, cả card mạng PC và cổng của Router đều thuộc cùng một nhóm thiết bị đầu cuối (DTE — phát ở chân 1,2 và thu ở chân 3,6), trong khi Switch/Hub thuộc nhóm DCE (thu ở chân 1,2 và phát ở chân 3,6). Do đó nối PC trực tiếp vào Router là nối 2 thiết bị CÙNG NHÓM chân tín hiệu nên phải dùng Cáp Chéo!"
                     },
                     {
                         "question_vi":  "Câu 3 (Đề thi CCNA): Nhờ cơ chế vật lý nào mà cáp đồng xoắn đôi không bọc kim loại (UTP) có thể hạn chế được hiện tượng nhiễu xuyên âm (Crosstalk) giữa các sợi dây bên trong vỏ cáp?",
                         "options_vi":  [
                                            "A. Bọc một lớp lưới đồng dày bên ngoài mỗi sợi dây.",
                                            "B. Sử dụng lõi thủy tinh phản xạ toàn phần.",
                                            "C. Xoắn các dây đồng thành từng cặp để từ trường tự triệt tiêu nhau (Cancellation) và thay đổi độ xoắn (số vòng xoắn trên mỗi mét) khác nhau giữa 4 cặp màu.",
                                            "D. Tăng điện áp truyền dẫn lên 220V."
                                        ],
                         "answerIndex":  2,
                         "explanation_vi":  "Đáp án đúng là C. Cáp UTP không có lớp vỏ kim loại chống nhiễu; nó chống nhiễu hoàn toàn nhờ hiệu ứng tự triệt tiêu từ trường của 2 dòng điện ngược chiều trên mỗi cặp dây xoắn (Cancellation) và việc thiết kế 4 cặp màu có bước xoắn dày/thưa khác nhau."
                     }
                 ],
        "beginnerGuide_vi":  [
                                 "1. Tầng Vật lý (Physical Layer - Tầng 1) làm nhiệm vụ gì dễ hiểu nhất? Sau khi máy tính đã đóng gói xong dữ liệu thành chuỗi hàng triệu con số nhị phân `0` và `1`, Tầng 1 chính là **Đôi bàn tay vật lý** biến các số `0` và `1` đó thành: • **Xung điện** (ví dụ `+5V` là số `1`, `0V` là số `0`) nếu đi qua dây cáp đồng; • **Ánh sáng nhấp nháy** (Đèn sáng = `1`, Đèn tắt = `0`) nếu đi qua sợi cáp quang; • **Sóng vô tuyến** nếu truyền qua Wi-Fi/4G/5G.",
                                 "2. Nhìn vào đầu dây cáp mạng cắm sau lưng máy tính (Hạt mạng RJ-45): Nếu bạn cầm đầu cáp mạng bằng nhựa trong suốt lên soi dưới ánh đèn, bạn sẽ thấy bên trong có **8 sợi dây đồng nhỏ xíu mang 8 màu sắc khác nhau** (chia làm 4 cặp xoắn vào nhau: Cam, Xanh lá, Xanh dương, Nâu) nối vào **8 chân đồng vàng óng (đánh số từ Chân 1 đến Chân 8)**. Việc sắp xếp thứ tự 8 màu dây này không được làm bừa mà phải tuân theo đúng 1 trong 2 bảng màu chuẩn quốc tế là **T568A** hoặc **T568B**!",
                                 "3. Khi nào dùng Cáp đồng (UTP), khi nào bắt buộc phải dùng Cáp quang (Fiber-Optic)? • **Trong cùng 1 phòng / 1 tầng lầu (\u003c 100 mét)**: Luôn dùng **Cáp đồng UTP (Cat5e/Cat6)** vì dây mềm dễ uốn, giá rẻ và cắm thẳng được vào cổng RJ-45 của PC/Switch. • **Khi nối 2 tòa nhà xa nhau (\u003e 100 mét) hoặc kéo cáp ngoài trời**: Bắt buộc phải dùng **Cáp quang** vì cáp đồng quá 100 mét điện áp sẽ bị suy hao mất sạch tín hiệu và rất dễ dẫn sét đánh cháy cả dàn Switch!",
                                 "4. Tại sao dây cáp mạng UTP phải xoắn từng cặp vào nhau với độ xoắn khác nhau? Khi dòng điện chạy qua một sợi dây đồng, nó sinh ra từ trường xung quanh và làm nhiễu sợi dây nằm sát bên cạnh (gọi là **Nhiễu xuyên âm - Crosstalk**). Các nhà khoa học phát hiện ra rằng nếu cho 2 sợi dây truyền tín hiệu ngược pha nhau và **xoắn chặt vào nhau theo hình xoắn ốc**, từ trường của sợi này sẽ tự động triệt tiêu từ trường của sợi kia! Hơn nữa, 4 cặp dây bên trong (Cam, Xanh lá, Xanh dương, Nâu) được xoắn với bước xoắn khác nhau để giữa các cặp cũng không gây nhiễu chéo sang nhau.",
                                 "5. Ba thông số đo chất lượng đường truyền mà người mới hay nhầm lẫn (Băng thông vs. Thông lượng vs. Dữ liệu thực): • **Bandwidth (Băng thông lý thuyết)**: Là độ rộng tối đa của con đường (ví dụ cổng mạng ghi 1000 Mbps giống như đường cao tốc cho phép chạy tối đa 120 km/h). • **Throughput (Thông lượng thực tế)**: Là lượng dữ liệu thực sự đi qua được tại một thời điểm (khi giờ cao điểm kẹt xe, tốc độ thực tế chỉ còn 600 Mbps). • **Goodput (Dữ liệu hữu ích thực nhận)**: Là lượng dữ liệu ứng dụng thực sự dùng được sau khi đã trừ đi toàn bộ phần vỏ bao bì (Headers của tầng 2, 3, 4) và các gói tin phải gửi lại do lỗi."
                             ],
        "beginnerGuide_en":  [
                                 "1. What does the Physical Layer (Layer 1) actually do? Layer 1 converts binary `1`s and `0`s into physical signals on the medium: **electrical voltage pulses** on copper cables, **pulses of light** inside glass optical fibers, or **radio waves (RF)** across wireless links.",
                                 "2. Inside an RJ-45 Ethernet Cable: Look through a clear RJ-45 connector and you will see **8 small copper wires arranged in 4 twisted color pairs** (Orange, Green, Blue, Brown) crimped onto 8 gold pins (Pins 1 to 8) following either the **T568A** or **T568B** wiring standard.",
                                 "3. When to use Copper UTP vs. Fiber-Optic Cable: Use **Copper UTP (Cat5e/Cat6)** for horizontal runs inside rooms/floors under **100 meters**. Use **Fiber-Optic cable** whenever the distance exceeds 100 meters, connects separate buildings (outdoor lightning immunity), or runs near heavy electrical machinery (EMI immunity)."
                             ],
        "advancedTopics_vi":  [
                                  "Mở rộng Nâng cao 1 — Kỹ thuật Mã hóa đường truyền (Line Encoding: Manchester vs. 4B/5B vs. PAM5): Trước khi phát bit `0` và `1` lên dây cáp, Tầng 1 phải dùng kỹ thuật **Encoding (Mã hóa tín hiệu)** để máy nhận không bị lệch nhịp đồng hồ khi gặp một chuỗi toàn số `00000000` dài: Mạng 10Mbps cũ dùng mã *Manchester*; mạng FastEthernet 100Mbps dùng mã *4B/5B + MLT-3* (cứ 4 bit dữ liệu đổi thành 5 bit tín hiệu); còn mạng Gigabit 1000BASE-T hiện đại dùng điều chế *4D-PAM5* truyền đồng thời cả 2 chiều trên cả 4 cặp dây đồng!",
                                  "Mở rộng Nâng cao 2 — Phân biệt các chuẩn Module Quang SFP / SFP+ / QSFP+ khi đi làm: Cáp quang không thể cắm thẳng vào cổng RJ-45 mà phải cắm thông qua một linh kiện nhỏ bằng ngón tay cái gọi là **Module Quang (SFP Transceiver)**: • **SFP** hỗ trợ tốc độ **1 Gbps**; • **SFP+** hỗ trợ tốc độ **10 Gbps**; • **QSFP+ / QSFP28** hỗ trợ tốc độ **40 Gbps / 100 Gbps** trong Data Center. Lưu ý: Nếu dùng cáp quang Multimode (vỏ cam/xanh) thì phải mua Module SFP chuẩn **SR (Short Range - bước sóng 850nm)**; nếu dùng cáp quang Single-mode (vỏ vàng) thì phải mua Module SFP chuẩn **LR/ER (Long Range - bước sóng 1310nm/1550nm)**!",
                                  "Mở rộng Nâng cao 3 — Công nghệ cấp nguồn qua cáp mạng PoE (Power over Ethernet - IEEE 802.3af/at/bt): Nhờ có 8 sợi dây đồng trong cáp UTP, Switch có hỗ trợ PoE có thể truyền cả dữ liệu mạng LẪN dòng điện một chiều 48V nuôi trực tiếp Điện thoại bàn IP, Camera an ninh và Bộ phát Wi-Fi gắn trên trần nhà mà không cần kéo dây điện 220V!",
                                  "Mở rộng Nâng cao 4 — Cấp nguồn qua cáp mạng Ethernet (PoE - Power over Ethernet chuẩn IEEE 802.3af/at/bt): Thay vì phải kéo thêm ổ cắm điện 220V lên trần nhà cho từng chiếc Camera an ninh và Bộ phát Wi-Fi, công nghệ **PoE** cho phép Switch truyền cả **dữ liệu mạng lẫn dòng điện một chiều (48V DC)** trên cùng một sợi cáp đồng UTP 8 lõi! Chuẩn **802.3af (PoE)** cấp tối đa 15.4W mỗi cổng, **802.3at (PoE+)** cấp 30W, và **802.3bt (UPoE)** cấp tới 60W–100W cho cả màn hình hội nghị truyền hình và đèn thông minh."
                              ],
        "advancedTopics_en":  [
                                  "Advanced Expansion 1 — Line Encoding (Manchester, 4B/5B, 4D-PAM5): Physical layer encoding inserts clock transitions into the bit stream so receiver and transmitter stay synchronized: 100BASE-TX uses 4B/5B encoding over 2 wire pairs (pins 1,2 and 3,6), while 1000BASE-T Gigabit Ethernet uses 4D-PAM5 across all 4 wire pairs simultaneously.",
                                  "Advanced Expansion 2 — Optical Transceivers (SFP vs. SFP+ \u0026 SR vs. LR): Fiber cables plug into hot-swappable transceivers: **SFP (1 Gbps)** or **SFP+ (10 Gbps)**. Match **1000BASE-SX / 10GBASE-SR (850nm LED/VCSEL)** with Multimode Fiber (MMF), and **1000BASE-LX / 10GBASE-LR (1310nm Laser)** with Single-Mode Fiber (SMF).",
                                  "Advanced Expansion 3 — Power over Ethernet (PoE — IEEE 802.3af/at/bt): PoE switches deliver 48V DC power alongside Ethernet data over standard Cat5e/Cat6 UTP cables to power IP Phones, Wireless APs, and PTZ Cameras without separate AC power outlets."
                              ]
    },
    {
        "id":  5,
        "title":  "Number Systems",
        "title_vi":  "Hệ Thống Đếm Nhị Phân và Thập Lục Phân",
        "overview":  "Module 5 builds the essential mathematical skill required for every network engineer: converting fluently between Decimal (Base 10), Binary (Base 2), and Hexadecimal (Base 16). Computers and routers process IPv4 addresses exclusively as 32 binary bits grouped into four 8-bit octets (`00000000` to `11111111`), while humans read them in dotted-decimal (`0` to `255`). Meanwhile, 48-bit MAC addresses and 128-bit IPv6 addresses are so long in binary that they are represented in Hexadecimal (`0–9` and `A–F`), where each single Hex digit maps cleanly to exactly 4 binary bits (a nibble).",
        "overview_vi":  "Module 5 trang bị kỹ năng tính toán cốt lõi nhất để làm bài tập chia mạng con (Subnetting) IPv4 và đọc địa chỉ IPv6/MAC: Chuyển đổi qua lại giữa Hệ Thập Phân (Cơ số 10), Hệ Nhị Phân (Cơ số 2) và Hệ Thập Lục Phân / Hệ Hex (Cơ số 16). Router và máy tính chỉ hiểu các bit `0` và `1` (Nhị phân), trong khi con người đọc IPv4 dưới dạng 4 cụm số thập phân cách nhau bởi dấu chấm (ví dụ `192.168.1.1`). Chỉ cần nắm vững \u0027Bảng thần thánh 8 bit\u0027 (`128 - 64 - 32 - 16 - 8 - 4 - 2 - 1`) cho IPv4 và \u0027Bảng 4 bit Nibble\u0027 (`8 - 4 - 2 - 1`) cho số Hex của IPv6/MAC, bạn có thể nhẩm bất kỳ địa chỉ nào trong vòng 10 giây mà không cần máy tính bỏ túi!",
        "analogy_vi":  "Hãy tưởng tượng bạn có 8 quả cân với trọng lượng lần lượt là: `128g, 64g, 32g, 16g, 8g, 4g, 2g, 1g`. Với đúng 8 quả cân này, bạn có thể cân được bất kỳ vật nào nặng từ `0g` đến `255g`! Quả cân nào bạn đặt lên đĩa cân thì ghi số `1`, quả cân nào không dùng thì ghi số `0` — đó chính xác là cách đổi Thập phân sang Nhị phân 8-bit!",
        "keyConcepts":  [
                            "32-Bit IPv4 Address \u0026 8-Bit Octets: An IPv4 address is 32 bits long, divided into 4 octets of 8 bits each. Because each octet has 8 binary positions ($2^7$ down to $2^0$), the minimum value is `00000000` (`0`) and the maximum value is `11111111` (`128+64+32+16+8+4+2+1 = 255`).",
                            "The 8-Bit Positional Value Chart: Memorize the 8 powers of 2 from left to right: `128 | 64 | 32 | 16 | 8 | 4 | 2 | 1`. To convert binary `11001010` to decimal, simply add the column values where there is a `1`: `128 + 64 + 8 + 2 = 202`.",
                            "Decimal to Binary (Subtraction Method): Start from the leftmost column (`128`). If your number is \u003e= the column value, write `1` and subtract that column value from your number; if your number is smaller, write `0` and move to the next column right.",
                            "Contiguous 1s Subnet Mask Values: Because subnet masks always have consecutive `1` bits from left to right, an octet in a subnet mask can ONLY be one of 9 numbers: `0, 128, 192, 224, 240, 248, 252, 254, 255`. Memorizing this sequence makes subnetting effortless.",
                            "Hexadecimal (Base 16) \u0026 The 4-Bit Nibble Rule: Hex uses 16 symbols: `0–9` for values 0 to 9, and `A=10, B=11, C=12, D=13, E=14, F=15`. Because $16 = 2^4$, **1 Hex digit always equals 4 binary bits** (a nibble, weighted `8 | 4 | 2 | 1`), and **2 Hex digits equal 1 Byte (8 bits)**. Never convert Hex -\u003e Decimal -\u003e Binary; always convert each Hex digit directly to 4 bits!"
                        ],
        "keyConcepts_vi":  [
                               "Cấu trúc 32-bit của IPv4 (4 Octet): Mỗi địa chỉ IPv4 dài 32 bit nhị phân, được chia thành 4 cụm gọi là 4 Octet (mỗi Octet = 8 bit = 1 Byte). Khi cả 8 bit đều tắt (`00000000`) thì giá trị bằng `0`; khi cả 8 bit đều bật (`11111111`) thì tổng bằng `128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255`. Đó là lý do không bao giờ có địa chỉ IPv4 nào vượt quá con số 255!",
                               "Cách đổi Nhị Phân -\u003e Thập Phân trong 3 giây: Kẻ bảng 8 cột giá trị từ trái qua phải: `128 | 64 | 32 | 16 | 8 | 4 | 2 | 1`. Đặt 8 bit nhị phân vào dưới tương ứng: cột nào có bit `1` thì cộng số ở cột đó lại, cột nào là `0` thì bỏ qua.",
                               "Cách đổi Thập Phân -\u003e Nhị Phân (Phương pháp trừ dần từ trái qua phải): Xét số thập phân cần đổi so với từng cột từ `128` giảm dần về `1`: nếu số đang có LỚN HƠN HOẶC BẰNG cột đó thì điền bit `1` rồi lấy số đang có trừ đi cột đó; nếu NHỎ HƠN thì điền bit `0` rồi xét tiếp cột bên phải.",
                               "Dãy 9 con số Vàng của Subnet Mask: Vì Subnet Mask luôn bật các bit `1` liên tiếp từ trái sang phải, một Octet của Subnet Mask chỉ có thể rơi vào các giá trị: `128` (1 bit 1), `192` (2 bit 1), `224` (3 bit 1), `240` (4 bit 1), `248` (5 bit 1), `252` (6 bit 1), `254` (7 bit 1), `255` (8 bit 1).",
                               "Hệ Thập Lục Phân (Hexadecimal - Cơ số 16) dùng cho IPv6 và MAC: Dùng các số từ `0–9` và 6 chữ cái `A=10, B=11, C=12, D=13, E=14, F=15`. Mẹo cực nhanh: **Cứ 1 ký tự Hex tương ứng chính xác 4 bit nhị phân** theo bảng nhỏ 4 cột `8 | 4 | 2 | 1`! Muốn đổi 1 Byte (8 bit) sang Hex, chỉ cần cắt đôi thành 2 cụm 4-bit (Nibble) rồi đổi từng cụm."
                           ],
        "realWorldExample":  "Worked Example 1 (Decimal `168` to 8-bit Binary):\n• Is 168 \u003e= 128? Yes -\u003e bit `1` (Remainder: 168 - 128 = 40)\n• Is 40 \u003e= 64? No -\u003e bit `0`\n• Is 40 \u003e= 32? Yes -\u003e bit `1` (Remainder: 40 - 32 = 8)\n• Is 8 \u003e= 16? No -\u003e bit `0`\n• Is 8 \u003e= 8? Yes -\u003e bit `1` (Remainder: 8 - 8 = 0)\n• Remaining columns (4, 2, 1): all `0` -\u003e Result: `10101000`.\n\nWorked Example 2 (Hex `A9` to Binary \u0026 Decimal):\n• Split into two 4-bit nibbles (`8-4-2-1`):\n  - `A` = 10 = `8 + 2` -\u003e `1010`\n  - `9` = 9 = `8 + 1` -\u003e `1001`\n• Combine: `10101001` in binary (which in decimal is `128 + 32 + 8 + 1 = 169`).",
        "realWorldExample_vi":  "Ví dụ giải chi tiết từng bước:\n1. Đổi số thập phân `168` (trong IP `192.168.1.1`) sang Nhị phân 8-bit:\n   So với bảng `128 | 64 | 32 | 16 | 8 | 4 | 2 | 1`:\n   • `168 \u003e= 128`? Đúng -\u003e ghi `1` (Dư: `168 - 128 = 40`)\n   • `40 \u003e= 64`? Sai -\u003e ghi `0`\n   • `40 \u003e= 32`? Đúng -\u003e ghi `1` (Dư: `40 - 32 = 8`)\n   • `8 \u003e= 16`? Sai -\u003e ghi `0`\n   • `8 \u003e= 8`? Đúng -\u003e ghi `1` (Dư: `8 - 8 = 0`)\n   • Đã hết số dư, 3 cột cuối (`4, 2, 1`) điền `0, 0, 0`.\n   =\u003e Kết quả: `168` = `10101000`.\n\n2. Đổi số Hex `D4` (trong địa chỉ MAC hoặc IPv6) sang Nhị phân:\n   Tách làm 2 chữ riêng biệt, mỗi chữ dùng bảng 4 cột `8 | 4 | 2 | 1`:\n   • Chữ `D` = 13 = `8 + 4 + 1` -\u003e `1101`\n   • Chữ `4` = 4 = `4` -\u003e `0100`\n   =\u003e Ghép lại: `0xD4` = `11010100` (Đổi ra thập phân = `128 + 64 + 16 + 4 = 212`).",
        "diagramType":  "binary-hex-table",
        "commands":  [
                         "Bảng 8-bit Nhị phân (1 Octet IPv4):  | 128 (2^7) | 64 (2^6) | 32 (2^5) | 16 (2^4) | 8 (2^3) | 4 (2^2) | 2 (2^1) | 1 (2^0) |",
                         "Bảng cộng dồn Subnet Mask cần thuộc: 10000000=128 | 11000000=192 | 11100000=224 | 11110000=240 | 11111000=248 | 11111100=252 | 11111110=254 | 11111111=255",
                         "Bảng 4-bit Nibble đổi số Hex (8-4-2-1): 0=0000 | 1=0001 | 2=0010 | 3=0011 | 4=0100 | 5=0101 | 6=0110 | 7=0111 | 8=1000 | 9=1001",
                         "Chữ cái Hex A -\u003e F (10 -\u003e 15):         A (10)=1010 | B (11)=1011 | C (12)=1100 | D (13)=1101 | E (14)=1110 | F (15)=1111",
                         "Ví dụ đầy đủ IPv4: 192.168.10.1 = 11000000 . 10101000 . 00001010 . 00000001"
                     ],
        "comparisonTable":  {
                                "title_vi":  "Bảng Quy Đổi Nhanh Thập Phân - Nhị Phân - Thập Lục Phân (Hex) \u0026 Subnet Mask",
                                "headers_vi":  [
                                                   "Số bit bật `1` liên tiếp",
                                                   "Dạng Nhị Phân (8-bit Octet)",
                                                   "Giá trị Thập Phân (Subnet Mask)",
                                                   "Giá trị Hệ Hex (0x)",
                                                   "Bước nhảy Mạng con (256 - Mask)"
                                               ],
                                "rows":  [
                                             [
                                                 "0 bit `1`",
                                                 "`0000 0000`",
                                                 "**0**",
                                                 "`0x00`",
                                                 "256"
                                             ],
                                             [
                                                 "1 bit `1`",
                                                 "`1000 0000`",
                                                 "**128**",
                                                 "`0x80`",
                                                 "128"
                                             ],
                                             [
                                                 "2 bit `1`",
                                                 "`1100 0000`",
                                                 "**192** (128+64)",
                                                 "`0xC0`",
                                                 "64"
                                             ],
                                             [
                                                 "3 bit `1`",
                                                 "`1110 0000`",
                                                 "**224** (192+32)",
                                                 "`0xE0`",
                                                 "32"
                                             ],
                                             [
                                                 "4 bit `1`",
                                                 "`1111 0000`",
                                                 "**240** (224+16)",
                                                 "`0xF0`",
                                                 "16"
                                             ],
                                             [
                                                 "5 bit `1`",
                                                 "`1111 1000`",
                                                 "**248** (240+8)",
                                                 "`0xF8`",
                                                 "8"
                                             ],
                                             [
                                                 "6 bit `1`",
                                                 "`1111 1100`",
                                                 "**252** (248+4)",
                                                 "`0xFC`",
                                                 "4"
                                             ],
                                             [
                                                 "7 bit `1`",
                                                 "`1111 1110`",
                                                 "**254** (252+2)",
                                                 "`0xFE`",
                                                 "2"
                                             ],
                                             [
                                                 "8 bit `1`",
                                                 "`1111 1111`",
                                                 "**255** (254+1)",
                                                 "`0xFF`",
                                                 "1"
                                             ]
                                         ]
                            },
        "jobSkills_vi":  [
                             "Kinh nghiệm Đi Làm 1 — Mẹo nhận biết số Chẵn / Lẻ trong Nhị phân chỉ trong 0.5 giây: Trong bảng 8 bit (`128 | 64 | 32 | 16 | 8 | 4 | 2 | 1`),7 con số đầu tiên đều là số chẵn, chỉ có duy nhất cột cuối cùng bên phải (`2^0 = 1`) là số lẻ! Do đó: **Hễ bit cuối cùng bên phải là `0` thì chắc chắn đó là SỐ CHẴN (như Địa chỉ Mạng Network ID); hễ bit cuối cùng bên phải là `1` thì chắc chắn đó là SỐ LẺ (như Địa chỉ Broadcast)!**",
                             "Kinh nghiệm Đi Làm 2 — Đọc mã OUI của địa chỉ MAC để tìm thiết bị lạ trong mạng công ty: Khi đi làm, bạn thấy một thiết bị lạ đang chiếm băng thông có địa chỉ MAC là `00:50:56:C0:00:08`. Chỉ cần nhìn 6 chữ số Hex đầu tiên (`00:50:56`), bạn tra cứu mã OUI sẽ biết ngay đây là một máy ảo **VMware** (hoặc `00:15:5D` là máy ảo **Hyper-V**, `BC:24:11` là **Proxmox**, `F0:18:98` là **Apple MacBook/iPhone**). Điều này giúp kỹ sư mạng truy tìm thiết bị trong tích tắc!",
                             "Kinh nghiệm Đi Làm 3 — Hiểu ý nghĩa con số `0x2102` và `0x2142` trong Thanh ghi Cấu hình (Configuration Register): Khi gõ `show version`, dòng cuối cùng luôn hiện `Configuration register is 0x2102`. Đây chính là số Hex 16-bit! Số `2` ở cuối (`0010`) bảo Router khởi động hệ điều hành IOS từ Flash, còn số `1` ở hàng thứ ba (`0x2142` -\u003e bit số 6 bằng `1`, giá trị `0x0040`) là cờ báo cho Router **bỏ qua không đọc file `startup-config` trong NVRAM** khi khôi phục mật khẩu!"
                         ],
        "quiz":  [
                     {
                         "question_vi":  "Câu 1 (Đề thi CCNA): Giá trị nhị phân 8-bit nào sau đây tương ứng với số thập phân `202` (ví dụ trong địa chỉ IP `202.168.1.1`)?",
                         "options_vi":  [
                                            "A. 11001010",
                                            "B. 11010010",
                                            "C. 10101100",
                                            "D. 11001100"
                                        ],
                         "answerIndex":  0,
                         "explanation_vi":  "Đáp án đúng là A (`11001010`). Áp vào bảng 8 bit (`128 | 64 | 32 | 16 | 8 | 4 | 2 | 1`): Ta có `128 + 64 = 192`. Lấy `202 - 192 = 10` (mà `10 = 8 + 2`). Vậy các cột bật bit `1` là 128, 64, 8, 2 -\u003e `11001010`."
                     },
                     {
                         "question_vi":  "Câu 2 (Đề thi CCNA): Hãy đổi cụm số Thập lục phân (Hexadecimal) `0x3F` sang hệ Nhị phân 8-bit và hệ Thập phân:",
                         "options_vi":  [
                                            "A. Nhị phân: `00111111` — Thập phân: `63`",
                                            "B. Nhị phân: `00111110` — Thập phân: `62`",
                                            "C. Nhị phân: `01111111` — Thập phân: `127`",
                                            "D. Nhị phân: `00111010` — Thập phân: `58`"
                                        ],
                         "answerIndex":  0,
                         "explanation_vi":  "Đáp án đúng là A. Tách `3F` thành 2 cụm 4-bit (8-4-2-1): Chữ số `3` = `2 + 1` = `0011`; Chữ cái `F` = `15` = `8 + 4 + 2 + 1` = `1111`. Ghép lại được `00111111` (bằng `32 + 16 + 8 + 4 + 2 + 1 = 63`)."
                     },
                     {
                         "question_vi":  "Câu 3 (Đề thi CCNA): Một địa chỉ IPv6 có độ dài 128 bit nhị phân thì khi viết dưới dạng Thập lục phân (Hexadecimal) sẽ bao gồm bao nhiêu ký tự số Hex?",
                         "options_vi":  [
                                            "A. 12 ký tự Hex",
                                            "B. 16 ký tự Hex",
                                            "C. 32 ký tự Hex (chia thành 8 cụm Hextet, mỗi cụm 4 ký tự Hex)",
                                            "D. 64 ký tự Hex"
                                        ],
                         "answerIndex":  2,
                         "explanation_vi":  "Đáp án đúng là C (32 ký tự Hex). Vì mỗi ký tự Hex đại diện cho chính xác 4 bit nhị phân, nên `128 bit / 4 = 32 ký tự Hex` (trong khi địa chỉ MAC 48 bit có `48 / 4 = 12 ký tự Hex`)."
                     }
                 ],
        "beginnerGuide_vi":  [
                                 "1. Tại sao học mạng máy tính lại phải học đổi số Nhị phân (Binary) và Thập lục phân (Hex)? Con người chúng ta có 10 ngón tay nên quen đếm hệ **Thập phân (Decimal: từ 0 đến 9)**. Nhưng bên trong chip của máy tính và Router chỉ có các bóng bán dẫn đóng/mở điện (Có điện = `1`, Không có điện = `0`), gọi là hệ **Nhị phân (Binary - Cơ số 2)**. Khi bạn gõ địa chỉ IP `192.168.1.1` vào máy tính, thực chất máy tính lập tức dịch nó thành 32 con số `0` và `1` là `11000000.10101000.00000001.00000001` để tính toán chia mạng!",
                                 "2. Cách hiểu \u0027Bảng 8 cột thần thánh\u0027 (`128 | 64 | 32 | 16 | 8 | 4 | 2 | 1`) cho người mới: Đừng học công thức lũy thừa phức tạp! Bạn chỉ cần nhớ con số bên phải bằng phân nửa con số bên trái (hoặc nhân đôi từ phải qua trái: `1 -\u003e 2 -\u003e 4 -\u003e 8 -\u003e 16 -\u003e 32 -\u003e 64 -\u003e 128`). Cứ mỗi cụm số trong địa chỉ IPv4 (gọi là 1 Octet) được tạo thành từ việc bật (`1`) hoặc tắt (`0`) 8 con số này!",
                                 "3. Hệ Thập lục phân (Hexadecimal - Cơ số 16) sinh ra để làm gì? Địa chỉ IPv6 dài tới **128 bit nhị phân**! Nếu bắt con người đọc một dãy 128 số `0` và `1` (`0010000000000001...`) thì chắc chắn sẽ hoa mắt gõ sai ngay. Vì vậy các nhà khoa học gom **cứ 4 bit nhị phân thành 1 chữ số Hex** (từ `0–9` và dùng thêm 6 chữ cái `A=10, B=11, C=12, D=13, E=14, F=15`) để rút ngắn 128 bit xuống chỉ còn 32 ký tự ngắn gọn!",
                                 "4. Tại sao địa chỉ IPv4 luôn chỉ có các con số từ 0 đến 255 mà không bao giờ có số 256 hay 300? Vì địa chỉ IPv4 dài 32 bit được chia đều thành 4 cụm, mỗi cụm chứa đúng **8 bit nhị phân** (gọi là 1 Octet). Khi cả 8 bit đều tắt (\u00000000000), giá trị nhỏ nhất là **0**. Khi cả 8 bit đều bật sáng (11111111), tổng giá trị của chúng là 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255! Do đó, một cụm 8-bit không bao giờ vượt quá con số 255.",
                                 "5. Bảng tra cứu nhanh 16 ký tự Thập lục phân (Hexadecimal) cho người mới: Hệ thập lục phân dùng 16 ký tự để biểu diễn giá trị từ 0 đến 15: Từ \u0000 đến 9 giữ nguyên như số đếm bình thường; từ 10 đến 15 được thay bằng 6 chữ cái đầu bảng chữ cái: **A = 10 (1010), B = 11 (1011), C = 12 (1100), D = 13 (1101), E = 14 (1110), F = 15 (1111)**. Nhờ vậy, cứ mỗi chữ số Hex tương đương chính xác 4 bit nhị phân!"
                             ],
        "beginnerGuide_en":  [
                                 "1. Why do network engineers need Binary (Base 2) and Hexadecimal (Base 16)? Humans use Decimal (Base 10: digits 0–9), but routers and switches process electrical ON/OFF states (**Binary `1` and `0`**). When you type IP `192.168.1.1`, the router processes it as 32 binary bits (`11000000.10101000.00000001.00000001`).",
                                 "2. The 8-Bit Chart (`128 | 64 | 32 | 16 | 8 | 4 | 2 | 1`): Simply double the value from right to left starting at 1. Any number from 0 to 255 can be made by turning these 8 columns ON (`1`) or OFF (`0`).",
                                 "3. Why Hexadecimal (Base 16)? A 48-bit MAC address or 128-bit IPv6 address is too long to read in binary. Grouping every **4 binary bits (a nibble)** into a single Hex character (`0–9` and `A–F` for 10–15) makes MAC and IPv6 addresses compact and human-readable."
                             ],
        "advancedTopics_vi":  [
                                  "Mở rộng Nâng cao 1 — Phép toán Logic `AND` (Bitwise ANDing) mà Router dùng để tìm Địa chỉ Mạng: Làm sao Router biết máy tính `192.168.10.130` với Subnet Mask `255.255.255.192` thuộc về mạng con nào? Router đặt 32 bit của IP nằm trên 32 bit của Subnet Mask rồi nhân từng cặp bit theo quy tắc: **Chỉ khi cả hai cùng là `1` thì kết quả mới bằng `1` (`1 AND 1 = 1`), còn lại bằng `0` hết (`1 AND 0 = 0`, `0 AND 0 = 0`)**. Ở Octet thứ 4: `130` (`10000010`) AND với `192` (`11000000`) cho ra `10000000` = **`128`** -\u003e Vậy máy tính này thuộc mạng con **`192.168.10.128/26`**!",
                                  "Mở rộng Nâng cao 2 — Ý nghĩa của Bit thứ 7 (U/L Bit) và Bit thứ 8 (I/G Bit) trong Byte đầu tiên của Địa chỉ MAC Hex: Trong 2 chữ số Hex đầu tiên của địa chỉ MAC: • **Bit thứ 8 (Least Significant Bit của Byte 1)** cho biết đây là gói tin **Unicast (`0`)** hay **Multicast/Broadcast (`1`)**; • **Bit thứ 7 (Universal/Local Bit)** cho biết địa chỉ MAC này là địa chỉ gốc toàn cầu do hãng sản xuất khắc lên card (`0`) hay địa chỉ quản trị cục bộ (`1`) — đây chính là lý do trong thuật toán **IPv6 EUI-64** ta phải đảo ngược bit thứ 7 này!",
                                  "Mở rộng Nâng cao 3 — Ý nghĩa của Bit thứ 7 (U/L Bit) và Bit thứ 8 (I/G Bit) trong Byte đầu tiên của Địa chỉ MAC \u0026 IPv6: Trong 48 bit của địa chỉ MAC, 8 bit đầu tiên ẩn chứa 2 cờ điều khiển cực kỳ quan trọng: • **Bit số 8 (I/G - Individual/Group)**: Nếu bằng \u0000 là địa chỉ **Unicast** (cá nhân 1 máy); nếu bằng 1 là địa chỉ **Multicast/Broadcast** (nhóm máy). • **Bit số 7 (U/L - Universal/Local)**: Nếu bằng \u0000 là địa chỉ gốc toàn cầu do nhà sản xuất khắc cứng (BIA); nếu bằng 1 là địa chỉ đã được quản trị viên thay đổi cục bộ bằng phần mềm (cũng chính là bit bị đảo khi tính toán địa chỉ IPv6 theo chuẩn EUI-64!)."
                              ],
        "advancedTopics_en":  [
                                  "Advanced Expansion 1 — Bitwise ANDing by Routers: To determine which network a host belongs to, a router performs a bitwise AND between the 32-bit IPv4 address and the 32-bit Subnet Mask (`1 AND 1 = 1`; all other combinations = `0`). For `192.168.10.130` (`10000010`) AND `255.255.255.192` (`11000000`), the result is `10000000` (`128`), yielding Network ID `192.168.10.128/26`.",
                                  "Advanced Expansion 2 — The I/G and U/L Bits in Hex MAC Addresses: In the first byte of a MAC address, the 8th bit (Individual/Group) is `0` for Unicast and `1` for Multicast/Broadcast, while the 7th bit (Universal/Local) is flipped during IPv6 EUI-64 interface ID generation."
                              ]
    },
    {
        "id":  6,
        "title":  "Data Link Layer",
        "title_vi":  "Tầng Liên Kết Dữ Liệu (Tầng 2)",
        "overview":  "Module 6 explores OSI Layer 2 (Data Link Layer), which sits directly between the hardware Physical Layer (Layer 1) and the software Network Layer (Layer 3). Its job is to encapsulate Layer 3 IPv4/IPv6 packets into Layer 2 Frames tailored to the specific physical medium of each hop (such as Ethernet on LAN cables, 802.11 on Wi-Fi, or PPP/HDLC on WAN links), regulate how devices share the medium (CSMA/CD vs. CSMA/CA, Half-Duplex vs. Full-Duplex), and detect transmission corruption using the Frame Check Sequence (FCS) trailer.",
        "overview_vi":  "Module 6 khám phá Tầng 2 OSI (Data Link Layer) — cầu nối trực tiếp giữa phần mềm định tuyến ở Tầng 3 (IP) và phần cứng truyền dẫn ở Tầng 1 (Cáp/Sóng). Nhiệm vụ của Tầng 2 là đóng gói gói tin IP vào một chiếc khung vận chuyển (Frame) phù hợp với loại đường truyền của từng chặng (Ethernet cho cáp mạng LAN, 802.11 cho sóng Wi-Fi), điều tiết xem thiết bị nào được phép phát tín hiệu lên đường truyền (tránh đụng độ dữ liệu với CSMA/CD và CSMA/CA, chế độ Half-Duplex và Full-Duplex), đồng thời kiểm tra xem dữ liệu có bị nhiễu hỏng trên đường đi hay không nhờ phần đuôi FCS (Frame Check Sequence).",
        "analogy_vi":  "Hãy hình dung Tầng 3 (Network Layer - IP) là Lộ trình tổng thể của bạn từ Nhà ở Quận 1 (TP.HCM) ra Hồ Gươm (Hà Nội), còn Tầng 2 (Data Link Layer - Frame) là Phương tiện vận chuyển ở từng chặng: Chặng 1 đi Taxi từ nhà ra sân bay Tân Sơn Nhất (Frame Ethernet LAN); Chặng 2 đi Máy bay từ TP.HCM ra sân bay Nội Bài (Frame WAN/Quang); Chặng 3 đi Xe buýt từ Nội Bài về Hồ Gươm (Frame Wi-Fi 802.11). Ở mỗi trạm trung chuyển (Router), bạn đổi phương tiện mới (thay Frame mới), nhưng tờ giấy ghi điểm xuất phát và đích đến cuối cùng (IP) trong túi bạn vẫn giữ nguyên!",
        "keyConcepts":  [
                            "Two IEEE Data Link Sublayers (LLC \u0026 MAC): 1) Logical Link Control (LLC, IEEE 802.2) is the upper sublayer implemented in software—it reads the protocol type (IPv4, IPv6, ARP) so Layer 2 knows which Layer 3 protocol to hand the packet to; 2) Media Access Control (MAC, IEEE 802.3/802.11) is the lower sublayer implemented on the NIC hardware—it handles physical MAC addressing, frame delimiting, FCS error checking, and media access.",
                            "Half-Duplex vs. Full-Duplex Communication: Half-Duplex acts like a walkie-talkie or a one-lane bridge—devices can transmit OR receive, but never both at the same time (used by Wi-Fi WLANs and legacy Ethernet hubs). Full-Duplex acts like a two-lane highway—both devices transmit and receive simultaneously with 100% efficiency and zero collisions (standard on all modern switched Ethernet links).",
                            "Contention-Based Access (CSMA/CD vs. CSMA/CA): On shared half-duplex media, multiple nodes compete to transmit. 1) CSMA/CD (Collision Detection, used on legacy half-duplex wired Ethernet): devices listen before sending; if two send at once, a collision occurs, both send a Jam signal, wait a random backoff time, and retry. 2) CSMA/CA (Collision Avoidance, used on IEEE 802.11 Wi-Fi): because wireless NICs cannot listen while transmitting to detect collisions, they announce how long they need the channel (RTS/CTS) to avoid collisions before sending.",
                            "Three Parts of Every Data Link Frame: 1) Header (Frame Start flag, Source \u0026 Destination physical address, Type/Length field), 2) Data Payload (the encapsulated Layer 3 IP Packet), and 3) Trailer (Frame Check Sequence / FCS using a Cyclic Redundancy Check - CRC mathematical hash to detect damaged frames and drop them).",
                            "LAN vs. WAN Topologies: Physical \u0026 Logical LAN topologies include Star (all hosts connect to a central switch), Extended Star, Bus, and Ring. WAN topologies include Point-to-Point (two routers directly linked), Hub-and-Spoke (central HQ router connected to branch offices), and Full Mesh (every site connected to every other site for maximum redundancy)."
                        ],
        "keyConcepts_vi":  [
                               "2 Tầng con của Data Link (LLC và MAC): IEEE chia Tầng 2 thành 2 nửa: 1) Tầng con LLC (Logical Link Control - IEEE 802.2) nằm ở phía trên (bằng phần mềm), đóng vai trò phiên dịch cho Tầng 3 để biết bên trong Frame đang chứa gói tin IPv4, IPv6 hay ARP; 2) Tầng con MAC (Media Access Control - IEEE 802.3/802.11) nằm ở phía dưới (gắn trên chip phần cứng card mạng NIC), chịu trách nhiệm đóng khung Frame, gắn địa chỉ MAC nguồn/đích, kiểm tra lỗi FCS và đặt dữ liệu lên dây cáp.",
                               "Truyền thông Bán song công (Half-Duplex) vs. Song công toàn phần (Full-Duplex): Half-Duplex giống như bộ đàm bảo vệ hoặc cầu 1 làn xe — khi người này đang nói (truyền) thì người kia chỉ được nghe (nhận), nếu nói cùng lúc sẽ gây Đụng độ (Collision) — dùng trong mạng Wi-Fi và thiết bị Hub cổ điển. Full-Duplex giống như điện thoại di động hoặc đường cao tốc 2 chiều riêng biệt — vừa truyền vừa nhận đồng thời 100% công suất và KHÔNG BAO GIỜ xảy ra đụng độ (dùng trên tất cả các cổng Switch hiện đại).",
                               "Cơ chế tránh đụng độ CSMA/CD (Cáp đồng Half-duplex) và CSMA/CA (Mạng Wi-Fi): 1) CSMA/CD (Collision Detection - Phát hiện đụng độ): Lắng nghe đường dây rảnh mới truyền; nếu 2 máy vô tình truyền cùng lúc gây xung đột điện áp, cả 2 lập tức dừng lại, phát tín hiệu Jam báo hiệu và đợi một khoảng thời gian ngẫu nhiên rồi mới gửi lại. 2) CSMA/CA (Collision Avoidance - Tránh đụng độ, dùng cho Wi-Fi 802.11): Vì card Wi-Fi không thể vừa phát sóng vừa nghe xem có đụng độ hay không, nó phải xin phép trước (gửi gói RTS/CTS báo \u0027Tôi sắp dùng kênh truyền trong 5ms\u0027) để các máy khác im lặng nhường đường.",
                               "Cấu trúc 3 phần của một Khung tin (Frame) Tầng 2: 1) Phần đầu (Header): Gồm Cờ báo bắt đầu Frame, Địa chỉ vật lý Đích và Nguồn (MAC), Trường Type cho biết giao thức Tầng 3 bên trong; 2) Phần thân (Data): Chính là Gói tin IP Tầng 3; 3) Phần đuôi (Trailer): Chứa mã kiểm tra lỗi FCS (Frame Check Sequence) dùng thuật toán băm CRC. Máy gửi tính ra một con số CRC đính vào đuôi; máy nhận tính lại nếu lệch số nghĩa là Frame bị nhiễu hỏng dọc đường và sẽ hủy bỏ ngay.",
                               "Các kiểu sơ đồ đấu nối mạng (Topologies): Trong mạng LAN hiện đại dùng hình Sao (Star - mọi máy cắm về 1 Switch trung tâm) hoặc Sao mở rộng (Extended Star). Trong mạng WAN dùng Điểm-nối-Điểm (Point-to-Point), Trung tâm - Chi nhánh (Hub-and-Spoke) hoặc Lưới toàn phần (Full Mesh - mọi chi nhánh đều nối chéo với nhau để chịu lỗi cao nhất)."
                           ],
        "realWorldExample":  "Scenario: Laptop A (connected via Wi-Fi 802.11 to a Home Router) sends a packet to a Web Server across a Fiber WAN.\n1. On the Wi-Fi link, Laptop A uses Half-Duplex and CSMA/CA to avoid colliding with a nearby smartphone, encapsulating the IP packet inside an IEEE 802.11 Wireless Frame.\n2. The Home Router receives the 802.11 frame, verifies the FCS CRC check, strips off the 802.11 Wi-Fi header/trailer, extracts the untouched IP packet, and re-encapsulates it inside an IEEE 802.3 Ethernet Frame (Full-Duplex) to send out its WAN port.",
        "realWorldExample_vi":  "Ví dụ thực tế sự biến đổi của Frame Tầng 2 qua các môi trường truyền dẫn khác nhau:\nBạn dùng điện thoại kết nối Wi-Fi ở quán cafe để gửi tin nhắn cho bạn bè:\n• Chặng 1 (Từ Điện thoại -\u003e Cục phát Wi-Fi): Vì truyền qua không khí ở chế độ Half-Duplex, điện thoại dùng cơ chế CSMA/CA (xin phép trước khi phát để không đụng sóng với khách khác trong quán) và bọc gói tin IP trong một khung **Frame 802.11 (Wi-Fi)**.\n• Chặng 2 (Từ Cục Wi-Fi -\u003e Switch/Router qua dây cáp mạng): Cục Wi-Fi tháo bỏ vỏ Frame 802.11 cũ, kiểm tra đuôi FCS thấy không lỗi, lấy nguyên gói tin IP bên trong rồi bọc lại bằng vỏ **Frame 802.3 (Ethernet)** truyền qua dây cáp đồng ở chế độ Full-Duplex (vừa truyền vừa nhận không sợ đụng độ).\n• Chặng 3 (Từ Router quán cafe -\u003e Nhà mạng ISP): Router lại tháo vỏ Frame Ethernet ra và bọc gói tin IP vào vỏ Frame quang PPPoE/WAN để đẩy ra Internet!",
        "diagramType":  "datalink-frame",
        "commands":  [
                         "Switch# show interfaces gigabitethernet 0/1  # Xem chế độ Full-duplex, tốc độ Speed, kiểu đóng gói ARPA và bộ đếm lỗi CRC/Collisions",
                         "Switch(config)# interface fastethernet 0/1",
                         "Switch(config-if)# duplex full               # Ép cứng chế độ truyền nhận song công toàn phần (hai đầu dây phải khớp nhau)",
                         "Switch(config-if)# speed 100                 # Ép cứng tốc độ cổng 100 Mbps",
                         "Switch(config-if)# duplex auto               # Đặt tự động thương lượng chế độ Duplex với thiết bị đầu bên kia",
                         "Switch(config-if)# speed auto                # Đặt tự động thương lượng tốc độ truyền"
                     ],
        "comparisonTable":  {
                                "title_vi":  "Bảng So Sánh Các Phương Pháp Điều Khiển Truy Cập Môi Trường Truyền (Media Access Control)",
                                "headers_vi":  [
                                                   "Phương pháp / Chế độ",
                                                   "Nguyên lý Hoạt động",
                                                   "Môi trường Sử dụng",
                                                   "Đặc điểm Kỹ thuật cần nhớ"
                                               ],
                                "rows":  [
                                             [
                                                 "Full-Duplex (Song công toàn phần)",
                                                 "Truyền (TX) và Nhận (RX) diễn ra đồng thời trên 2 cặp dây riêng biệt.",
                                                 "Cáp mạng cắm vào **Switch** hiện đại (Điểm-nối-Điểm).",
                                                 "Hiệu suất 200% (1Gbps TX + 1Gbps RX), **KHÔNG BAO GIỜ xảy ra đụng độ (Collision = 0)**, tắt bỏ CSMA/CD."
                                             ],
                                             [
                                                 "Half-Duplex (Bán song công)",
                                                 "Tại 1 thời điểm chỉ được Truyền HOẶC Nhận (giống bộ đàm).",
                                                 "Thiết bị **Hub** cổ điển và **Mạng không dây Wi-Fi (WLAN)**.",
                                                 "Chung miền đụng độ (Shared medium); nếu 2 máy phát cùng lúc sẽ gây nhiễu/đụng độ tín hiệu."
                                             ],
                                             [
                                                 "CSMA/CD (Collision Detection)",
                                                 "Nghe trước khi nói; nếu lỡ nói trùng gây đụng độ (Collision) thì phát tín hiệu **Jam** và chờ ngẫu nhiên rồi gửi lại.",
                                                 "Mạng cáp đồng Ethernet cổ điển chạy ở chế độ Half-Duplex (dùng Hub).",
                                                 "Phát hiện đụng độ sau khi nó đã xảy ra bằng cách đo sự tăng vọt điện áp trên dây đồng."
                                             ],
                                             [
                                                 "CSMA/CA (Collision Avoidance)",
                                                 "Nghe trước khi nói + Gửi bản tin xin phép (**RTS / CTS**) báo thời gian chiếm kênh để các máy khác chủ động nhường.",
                                                 "Mạng không dây **IEEE 802.11 Wi-Fi**.",
                                                 "Vì card Wi-Fi không thể vừa phát vừa thu để phát hiện đụng độ nên bắt buộc phải **Tránh đụng độ từ trước**."
                                             ],
                                             [
                                                 "Controlled Access (Token Passing)",
                                                 "Các thiết bị xếp hàng lần lượt truyền theo thẻ bài (Token) — ai cầm thẻ mới được nói.",
                                                 "Mạng cổ điển Token Ring (IEEE 802.5), FDDI.",
                                                 "Không có đụng độ nhưng tốc độ chậm khi mạng ít người dùng."
                                             ]
                                         ]
                            },
        "jobSkills_vi":  [
                             "Kinh nghiệm Đi Làm 1 — Căn bệnh kinh điển \u0027Duplex Mismatch\u0027 (Lệch chế độ Duplex giữa 2 thiết bị): Khi nối Switch với Router (hoặc nối 2 Switch), nếu 1 đầu bạn gõ lệnh ép cứng `duplex full` và `speed 100` (khi ép cứng thì tính năng tự động thương lượng Auto-negotiation sẽ bị tắt!), còn đầu bên kia bạn để mặc định `duplex auto`. Theo chuẩn IEEE 802.3u, thiết bị để `auto` khi không nhận được tín hiệu thương lượng từ phía bên kia sẽ tự động rơi về chế độ **`Half-Duplex`**! Hậu quả: Một bên chạy Full, một bên chạy Half — mạng vẫn ping thông nhưng copy file chậm như rùa bò và gõ `show interfaces` thấy báo hàng chục ngàn lỗi **`Late Collisions`** và **`CRC`**! Quy tắc đi làm: **Hoặc cả 2 đầu cùng để `auto`, hoặc cả 2 đầu cùng ép cứng `full` như nhau!**",
                             "Kinh nghiệm Đi Làm 2 — Ý nghĩa các chỉ số lỗi trong lệnh `show interfaces`: Khi kiểm tra cổng Switch/Router thấy mạng chập chờn, hãy nhìn vào 4 con số sau: • **`Runts`**: Các khung tin nhỏ hơn 64 Bytes do đụng độ tín hiệu (Collision); • **`Giants`**: Khung tin lớn hơn 1518 Bytes (hoặc do bật Jumbo Frame không đồng bộ); • **`CRC (Cyclic Redundancy Check)`**: Gói tin đến nơi nhưng tính lại mã băm FCS ở đuôi bị sai — 95% là do **dây cáp mạng bị chuột cắn, bấm hạt RJ-45 lỏng, cáp kéo quá 100m hoặc đi sát dây điện 3 pha gây nhiễu EMI**!",
                             "Kinh nghiệm Đi Làm 3 — Giá trị EtherType trong Header Tầng 2 cần thuộc khi đọc Wireshark: Trường `Type` (2 Bytes) nằm ngay sau Source MAC cho biết bên trong Frame chứa gì: **`0x0800` = IPv4**, **`0x86DD` = IPv6**, **`0x0806` = ARP**, và **`0x8100` = IEEE 802.1Q VLAN Tag** (khung tin đi trên đường Trunk có gắn thẻ VLAN)!"
                         ],
        "quiz":  [
                     {
                         "question_vi":  "Câu 1 (Đề thi CCNA): Tại sao các mạng không dây Wi-Fi (IEEE 802.11) phải sử dụng cơ chế CSMA/CA (Tránh đụng độ) thay vì CSMA/CD (Phát hiện đụng độ)?",
                         "options_vi":  [
                                            "A. Vì mạng Wi-Fi truyền dữ liệu ở chế độ Full-Duplex.",
                                            "B. Vì card mạng không dây (Wireless NIC) không thể vừa phát sóng công suất lớn vừa lắng nghe kênh truyền cùng một lúc để phát hiện đụng độ.",
                                            "C. Vì mạng Wi-Fi không sử dụng địa chỉ MAC.",
                                            "D. Vì CSMA/CA không cần kiểm tra lỗi FCS."
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B. Trên cáp đồng, card mạng dễ dàng đo được điện áp tăng vọt khi 2 tín hiệu đụng nhau (CSMA/CD). Nhưng trên môi trường sóng vô tuyến, công suất phát tại ăng-ten của chính máy gửi sẽ lấn át hoàn toàn tín hiệu thu, khiến nó không thể vừa phát vừa nghe để biết có đụng độ hay không — do đó phải dùng CSMA/CA để tránh đụng độ từ trước."
                     },
                     {
                         "question_vi":  "Câu 2 (Đề thi CCNA): Khi một gói tin IP đi từ PC1 qua Router R1, tiếp tục qua Router R2 rồi đến Server đích, điều gì xảy ra với phần Đuôi kiểm tra lỗi FCS (Frame Check Sequence) ở Tầng 2 tại mỗi trạm Router?",
                         "options_vi":  [
                                            "A. Giá trị FCS được giữ nguyên từ PC1 đến tận Server đích.",
                                            "B. Mỗi Router kiểm tra FCS của Frame nhận vào (nếu lỗi thì hủy), sau đó tháo bỏ Frame cũ và tính toán lại một mã FCS hoàn toàn mới cho Frame xuất ra ở chặng tiếp theo.",
                                            "C. Router không bao giờ kiểm tra trường FCS vì đó là việc của Tầng 4.",
                                            "D. FCS chỉ được thêm vào khi truyền qua mạng Wi-Fi."
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B. Ở mỗi trạm Router, khung tin Tầng 2 cũ bị bóc bỏ hoàn toàn sau khi kiểm tra CRC/FCS hợp lệ. Khi Router đóng gói lại vào khung tin Tầng 2 mới (với MAC Nguồn và MAC Đích mới của chặng kế tiếp), nội dung Header đã thay đổi nên Router bắt buộc phải tính toán và gắn một đuôi FCS mới."
                     },
                     {
                         "question_vi":  "Câu 3 (Đề thi CCNA): Trong mạng LAN hiện đại khi một máy tính PC kết nối trực tiếp vào một cổng của Switch Cisco ở chế độ Full-Duplex, điều nào sau đây là ĐÚNG?",
                         "options_vi":  [
                                            "A. Máy tính phải chờ nhận được thẻ bài (Token) mới được truyền.",
                                            "B. Máy tính và cổng Switch có thể vừa truyền vừa nhận dữ liệu đồng thời mà không bao giờ xảy ra đụng độ (Collision).",
                                            "C. Cơ chế CSMA/CD hoạt động liên tục để gửi tín hiệu Jam.",
                                            "D. Tốc độ truyền bị chia đôi cho tất cả các cổng trên Switch."
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B. Kết nối Điểm-nối-Điểm giữa PC và cổng Switch sử dụng các cặp dây đồng riêng biệt cho chiều phát (TX) và chiều thu (RX), cho phép hoạt động ở chế độ Full-Duplex không còn đụng độ (microsegmentation) và tắt hoàn toàn CSMA/CD."
                     }
                 ],
        "beginnerGuide_vi":  [
                                 "1. Tại sao đã có Tầng 3 (IP) và Tầng 1 (Dây cáp) rồi mà vẫn bắt buộc phải có Tầng 2 (Data Link Layer) đứng ở giữa? Vì thế giới có hàng chục loại môi trường truyền dẫn khác nhau: Cáp đồng Ethernet, Cáp quang, Sóng Wi-Fi, Sóng 4G/5G, Cáp vệ tinh... Nếu bắt giao thức IP (Tầng 3) phải tự biết cách điều khiển từng loại cáp và sóng đó thì IP sẽ quá nặng nề! Nhờ có **Tầng 2 (Data Link)** làm \u0027người phiên dịch và đóng thùng hàng riêng cho từng chặng\u0027, gói tin IP cứ giữ nguyên hình dạng mà đi xuyên qua mọi loại cáp và sóng một cách dễ dàng.",
                                 "2. Hiểu cực dễ về Half-Duplex (Bán song công) và Full-Duplex (Song công toàn phần): • **Half-Duplex**: Giống như một cây cầu hẹp chỉ có **1 làn xe duy nhất** — khi xe chiều đi đang chạy qua cầu thì xe chiều về bắt buộc phải đứng chờ; nếu cả hai cố tình lao lên cầu cùng lúc sẽ **Tông nhau (Đụng độ - Collision)**! Thiết bị **Hub** đời cũ và **Sóng Wi-Fi** chạy theo kiểu này. • **Full-Duplex**: Giống như cầu vượt hiện đại có **2 làn xe đi - về tách biệt hoàn toàn** — hai bên vừa gửi vừa nhận cùng lúc với tốc độ tối đa mà không bao giờ đụng nhau! Tất cả các cổng cắm dây mạng vào **Switch** ngày nay đều chạy Full-Duplex.",
                                 "3. Phần đuôi FCS (Frame Check Sequence) ở cuối mỗi khung tin Tầng 2 dùng để làm gì? Khi xung điện chạy qua dây cáp dài, nếu bị tia sét hoặc mô-tơ điện làm nhiễu biến mất vài bit, làm sao máy nhận biết được khung tin đã bị hỏng? Trước khi gửi đi, máy gửi dùng công thức toán học **CRC** tính ra một con số kiểm tra (dài 4 Bytes) đính vào đuôi Frame gọi là **FCS**. Khi máy nhận đón được Frame, nó tự tính lại con số CRC: nếu hai số khớp nhau 100% thì nhận, nếu lệch nhau dù chỉ 1 bit nghĩa là dữ liệu đã bị rách nát trên đường đi -\u003e Máy nhận vứt bỏ ngay khung tin lỗi đó!",
                                 "4. Sơ đồ mạng Vật lý (Physical Topology) và Sơ đồ mạng Luận lý (Logical Topology) ở Tầng 2 khác nhau thế nào? • **Cấu trúc Điểm-nối-Điểm (Point-to-Point)**: Nối trực tiếp 1 sợi cáp giữa 2 Router — không cần địa chỉ MAC phức tạp vì gửi đầu này chắc chắn chỉ có đầu kia nhận. • **Cấu trúc Hình Sao (Star Topology - Mạng LAN Ethernet)**: Về mặt vật lý, mọi máy tính đều cắm dây tập trung vào 1 chiếc Switch ở giữa như các cánh sao. • **Cấu trúc Đa truy cập (Multiaccess)**: Nhiều máy cùng chia sẻ một môi trường truyền dẫn (như sóng Wi-Fi), đòi hỏi phải có luật phân luồng để tránh 2 máy phát sóng đè lên nhau.",
                                 "5. Tại sao Khung tin (Frame) Tầng 2 là đơn vị duy nhất có cả Phần Đầu (Header) lẫn Phần Đuôi (Trailer)? Ở Tầng 4 (Segment) và Tầng 3 (Packet), dữ liệu chỉ được gắn thêm nhãn ở phía trước (Header). Riêng ở Tầng 2 (Data Link), trước khi phóng chuỗi bit ra dây cáp vật lý — nơi rất dễ bị sét đánh, chuột cắn hay nhiễu điện làm biến dạng bit \u0000 thành 1 — Card mạng phải gắn thêm **Phần Đuôi (Trailer - FCS 4 Bytes)** ở cuối cùng để máy nhận kiểm tra xem toàn bộ khung tin từ đầu đến cuối có bị hỏng hóc dọc đường hay không."
                             ],
        "beginnerGuide_en":  [
                                 "1. Why do we need Layer 2 (Data Link Layer) between Layer 3 (IP) and Layer 1 (Physical)? Because IP packets travel across many different physical technologies (Copper Ethernet, Wi-Fi, Fiber WAN, Cellular). Layer 2 adapts the Layer 3 IP packet into a media-specific **Frame** for each individual link hop.",
                                 "2. Half-Duplex vs. Full-Duplex Made Simple: **Half-Duplex** is like a one-lane bridge or walkie-talkie—only one side can transmit at a time, or a **Collision** occurs (used by legacy Hubs and Wi-Fi). **Full-Duplex** is like a two-lane highway—both devices transmit and receive simultaneously with zero collisions (used on all modern Switch ports).",
                                 "3. What is the FCS (Frame Check Sequence) Trailer? Before sending a frame, the sender calculates a 4-byte **CRC (Cyclic Redundancy Check)** mathematical hash and attaches it to the end of the frame (FCS). The receiver recalculates the CRC upon arrival; if it doesn\u0027t match, the frame was corrupted by cable noise and is immediately dropped."
                             ],
        "advancedTopics_vi":  [
                                  "Mở rộng Nâng cao 1 — Giải phẫu cơ chế RTS / CTS (Request to Send / Clear to Send) trong CSMA/CA của mạng Wi-Fi (Bài toán \u0027Hidden Node Problem\u0027): Trong văn phòng lớn có 1 cục phát Wi-Fi (AP) đặt ở giữa, Máy tính A ngồi ở góc trái và Máy tính B ngồi ở góc phải xa nhau đến mức A và B không nghe thấy sóng của nhau (gọi là *Nút ẩn - Hidden Node*), nhưng cả hai đều thấy cục AP. Nếu A và B cùng gửi dữ liệu về AP sẽ gây nhiễu hỏng ngay tại ăng-ten của AP! Cơ chế **CSMA/CA** giải quyết bằng cách: Máy A gửi gói tin nhỏ **RTS (Xin phép gửi)** lên AP -\u003e AP phát loa gói **CTS (Cho phép A gửi, yêu cầu mọi máy khác im lặng kèm bộ đếm thời gian NAV)** -\u003e Nhờ nghe thấy lệnh CTS từ AP, Máy B ở góc xa sẽ ngoan ngoãn chờ cho đến khi Máy A gửi xong và nhận được **ACK**!",
                                  "Mở rộng Nâng cao 2 — Các giao thức Tầng 2 ngoài Ethernet trên đường truyền WAN (PPP, HDLC, Frame Relay, MPLS): Trong mạng LAN ta dùng Ethernet (`802.3`) và Wi-Fi (`802.11`), nhưng trên các đường cáp nối WAN giữa các Router nhà mạng, Tầng 2 có thể dùng **HDLC (High-Level Data Link Control - mặc định trên cổng Serial của Cisco)**, **PPP (Point-to-Point Protocol - hỗ trợ xác thực mật khẩu PAP/CHAP)**, hoặc **MPLS (Multiprotocol Label Switching - chuyển mạch nhãn tốc độ cao cấp nhà mạng)**.",
                                  "Mở rộng Nâng cao 3 — Giao thức Đóng gói Đường truyền WAN (HDLC, PPP và MPLS): Không phải mọi đường cáp trên thế giới đều chạy chuẩn Ethernet! Trên các đường thuê bao WAN nối điểm-điểm, Tầng 2 có thể sử dụng giao thức **HDLC** (mặc định trên cổng Serial của Cisco) hoặc **PPP (Point-to-Point Protocol)** hỗ trợ xác thực mật khẩu CHAP/PAP và gom nhiều đường truyền vật lý thành một đường logic (**Multilink PPP**), hoặc công nghệ chuyển mạch nhãn **MPLS** tại lõi nhà mạng viễn thông."
                              ],
        "advancedTopics_en":  [
                                  "Advanced Expansion 1 — Solving the Wireless \u0027Hidden Node Problem\u0027 with CSMA/CA RTS/CTS: When two wireless laptops are on opposite sides of an Access Point (AP), they may not hear each other\u0027s radio signals. Using CSMA/CA, Laptop A sends a **Request to Send (RTS)** frame to the AP, and the AP broadcasts a **Clear to Send (CTS)** frame containing a Network Allocation Vector (NAV) timer that tells Laptop B to wait until Laptop A finishes transmitting.",
                                  "Advanced Expansion 2 — WAN Data Link Protocols (HDLC, PPP, MPLS): While LANs use IEEE 802.3 Ethernet and 802.11 WLAN frames, point-to-point serial and fiber WAN links encapsulate IP packets inside **Cisco HDLC**, **PPP (Point-to-Point Protocol with CHAP authentication)**, or **MPLS** headers."
                              ]
    },
    {
        "id":  7,
        "title":  "Ethernet Switching",
        "title_vi":  "Chuyển Mạch Ethernet và Bảng Địa Chỉ MAC",
        "overview":  "Module 7 examines how Ethernet (IEEE 802.3) operates at Layer 2 and how a Cisco Catalyst switch makes intelligent frame-forwarding decisions. Every Ethernet NIC has a globally unique 48-bit (6-byte / 12-hex-digit) MAC address burned into its ROM. Unlike legacy hubs that blindly repeat electrical signals out all ports, a Layer 2 switch builds a Content Addressable Memory (CAM) MAC Address Table by inspecting the **Source MAC** of incoming frames, and then forwards frames out specific ports by looking up the **Destination MAC** using either Store-and-Forward or Cut-Through switching.",
        "overview_vi":  "Module 7 giải mã chi tiết cách công nghệ mạng LAN phổ biến nhất thế giới — Ethernet (IEEE 802.3) — và thiết bị Switch Tầng 2 hoạt động bên trong. Mỗi chiếc card mạng trên thế giới khi xuất xưởng đều được khắc một địa chỉ vật lý MAC duy nhất dài 48-bit (12 chữ số Hex). Khác với thiết bị Hub cổ điển (nhận tín hiệu ở 1 cổng là nhân bản mù quáng ra tất cả các cổng gây nghẽn mạng), Switch thông minh hơn rất nhiều: nó tự động **Học (Learn)** địa chỉ **Source MAC** (MAC Nguồn) của máy gửi để ghi vào cuốn sổ tay bộ nhớ gọi là **Bảng MAC (MAC Address Table / CAM Table)**, sau đó nhìn vào **Destination MAC** (MAC Đích) để **Chuyển tiếp (Forward)** chính xác ra đúng cổng cần đến!",
        "analogy_vi":  "Hãy tưởng tượng Switch như một nhân viên trực tổng đài thông minh mới nhận việc ở tòa nhà 24 phòng (24 cổng Port): Ban đầu sổ danh bạ (Bảng MAC) của anh ta trắng trơn. Khi anh Nam ở Phòng số 1 gọi điện cho anh Bắc, nhân viên tổng đài lập tức ghi vào sổ: \u0027Ghi nhớ: Anh Nam đang ngồi ở Phòng 1\u0027 (Học qua Source MAC). Nhưng vì chưa biết anh Bắc ngồi phòng nào, anh ta đành phát loa hỏi tất cả các phòng trừ Phòng 1 (Flooding). Khi anh Bắc ở Phòng 5 lên tiếng trả lời, nhân viên lập tức ghi sổ: \u0027Anh Bắc ở Phòng 5\u0027. Từ giây phút đó trở đi, Nam và Bắc nói chuyện riêng tư trực tiếp giữa Phòng 1 và Phòng 5 mà không làm phiền bất kỳ phòng nào khác!",
        "keyConcepts":  [
                            "Ethernet II Frame Anatomy (64 to 1518 Bytes): 1) Preamble (7 bytes of `10101010`) + Start Frame Delimiter SFD (1 byte `10101011`) to synchronize clocks (not counted in frame size); 2) Destination MAC (6 bytes); 3) Source MAC (6 bytes); 4) Type/Length (2 bytes: `0x0800` = IPv4, `0x86DD` = IPv6, `0x0806` = ARP); 5) Data Payload (46 to 1500 bytes; padded with zeros if \u003c 46B); 6) FCS Trailer (4 bytes CRC). Any frame \u003c 64 bytes is a collision fragment (\u0027runt\u0027) and \u003e 1518 bytes is a \u0027giant\u0027—both are discarded.",
                            "48-Bit MAC Address Structure: Written as 12 Hex digits (`00-60-2F-3A-07-BC` or Cisco\u0027s dotted format `0060.2f3a.07bc`). First 24 bits (6 hex digits) = OUI (Organizationally Unique Identifier assigned by IEEE to the manufacturer like Intel, Cisco, Apple). Last 24 bits (6 hex digits) = Vendor-assigned serial number.",
                            "Unicast, Broadcast, and Multicast MAC Addresses: 1) Unicast MAC: unique address of one NIC; 2) Broadcast MAC: `FF-FF-FF-FF-FF-FF` (all 48 bits = `1`), flooded out all switch ports except the ingress port; 3) Multicast MAC: always starts with `01-00-5E` for IPv4 multicast, or `33-33-xx-xx-xx-xx` for IPv6 multicast.",
                            "The Two-Step Switch Logic (Learn \u0026 Forward): Step 1 — LEARN (Always uses SOURCE MAC): When a frame enters Port Fa0/1, the switch checks if the Source MAC is in its MAC table. If not, it adds `Source MAC -\u003e Fa0/1` and starts a 5-minute (300-second) aging timer. Step 2 — FORWARD (Always uses DESTINATION MAC): If Destination MAC is in the MAC table (Known Unicast), send ONLY out that single port. If Destination MAC is NOT in the table (Unknown Unicast) or is Broadcast (`FFFF.FFFF.FFFF`), FLOOD the frame out all active ports except the port it came in on.",
                            "Store-and-Forward vs. Cut-Through Switching: 1) Store-and-Forward (Used on all Cisco Catalyst switches): Receives the entire frame into memory buffer, calculates the CRC hash against the FCS trailer, drops damaged frames/runts, and supports QoS and speed conversion (e.g., 100Mbps port to 10Gbps port). 2) Cut-Through: Forwards the frame immediately after reading the first 6 bytes (Destination MAC) for ultra-low latency: Fast-Forward mode forwards immediately (even corrupt frames), while Fragment-Free mode waits for the first 64 bytes to filter out collision runts."
                        ],
        "keyConcepts_vi":  [
                               "Giải phẫu Khung tin Ethernet II (Kích thước chuẩn từ 64 Bytes đến 1518 Bytes): Gồm: Preamble + SFD (8 Bytes đồng bộ xung nhịp, không tính vào kích thước Frame) -\u003e **Destination MAC** (6 Bytes - đặt lên trước để Switch đọc ngay lập tức!) -\u003e **Source MAC** (6 Bytes) -\u003e **EtherType** (2 Bytes: `0x0800` là IPv4, `0x86DD` là IPv6, `0x0806` là ARP) -\u003e **Data** (46 đến 1500 Bytes; nếu gói IP nhỏ hơn 46 Bytes sẽ được chèn thêm số 0 cho đủ) -\u003e **FCS** (4 Bytes kiểm tra lỗi ở đuôi). Khung tin ngắn hơn 64 Bytes gọi là Runt (mảnh vỡ đụng độ), dài hơn 1518 Bytes gọi là Giant — cả hai đều bị Switch xóa bỏ.",
                               "Cấu trúc 48-bit (12 số Hex) của Địa chỉ MAC: Có thể viết dạng gạch ngang `00-60-2F-3A-07-BC`, hai chấm `00:60:2F:3A:07:BC`, hoặc chuẩn dấu chấm của Cisco `0060.2f3a.07bc`. 6 số Hex đầu (24 bit đầu) gọi là mã **OUI** (mã nhà sản xuất do IEEE cấp cho Apple, Dell, Intel, Cisco...); 6 số Hex sau (24 bit cuối) là số seri riêng của từng chiếc card mạng.",
                               "Nhận diện nhanh 3 loại địa chỉ MAC (Unicast, Broadcast, Multicast): 1) **Unicast MAC**: Địa chỉ của riêng 1 card mạng; 2) **Broadcast MAC**: Toàn bộ 12 chữ F (`FF-FF-FF-FF-FF-FF` tương ứng 48 bit `1`) — gửi cho toàn mạng LAN; 3) **Multicast MAC**: Bắt đầu bằng `01-00-5E-...` (nếu là nhóm Multicast IPv4) hoặc bắt đầu bằng `33-33-...` (nếu là nhóm Multicast IPv6).",
                               "Quy trình 2 Bước Xử Lý Khung Tin Của Switch (Cực kỳ quan trọng khi thi): • **Bước 1: HỌC (LEARN — Luôn nhìn vào SOURCE MAC)**: Khi 1 Frame đi vào cổng Fa0/1, Switch nhìn vào **MAC Nguồn** và ghi vào bảng MAC: `MAC Nguồn này nằm ở cổng Fa0/1` (lưu trong 300 giây = 5 phút). • **Bước 2: CHUYỂN TIẾP (FORWARD — Luôn nhìn vào DESTINATION MAC)**: Switch tra **MAC Đích** trong bảng MAC: Nếu CÓ trong bảng (Known Unicast) -\u003e chỉ đẩy ra đúng 1 cổng đó. Nếu CHƯA CÓ trong bảng (Unknown Unicast) hoặc là Broadcast (`FFFF.FFFF.FFFF`) -\u003e **Flood (Nhân bản)** đẩy ra tất cả các cổng đang mở TRỪ cổng vừa nhận vào!",
                               "2 Cơ chế Chuyển mạch của Switch (Store-and-Forward vs. Cut-Through): 1) **Store-and-Forward** (Mặc định trên Switch Cisco): Nhận trọn vẹn cả Frame từ đầu đến đuôi FCS, tính toán kiểm tra lỗi CRC — nếu Frame sạch không lỗi mới chuyển đi, nếu lỗi thì vứt bỏ ngay, đồng thời hỗ trợ QoS. 2) **Cut-Through**: Vừa đọc xong 6 Bytes đầu tiên (Destination MAC) là phóng Frame đi luôn không thèm đợi đọc hết đuôi FCS để giảm độ trễ tối đa (gồm 2 kiểu nhỏ: *Fast-Forward* phóng ngay lập tức, và *Fragment-Free* đợi đọc hết 64 Bytes đầu tiên để chắc chắn không phải mảnh vỡ Runt rồi mới phóng)."
                           ],
        "realWorldExample":  "Scenario: Switch S1 just booted up (MAC Table is completely empty). Four PCs are plugged in: PC-A (`00-0A` on Fa0/1), PC-B (`00-0B` on Fa0/2), PC-C (`00-0C` on Fa0/3), PC-D (`00-0D` on Fa0/4).\n1. PC-A sends a frame to PC-C (`Src MAC: 00-0A`, `Dst MAC: 00-0C`).\n2. S1 receives the frame on Fa0/1. LEARN: S1 records `00-0A -\u003e Port Fa0/1` in its MAC table.\n3. FORWARD: S1 looks up `00-0C` in its MAC table—not found (Unknown Unicast)! S1 floods the frame out Fa0/2, Fa0/3, and Fa0/4.\n4. PC-B and PC-D see the Destination MAC is `00-0C` (not theirs) and silently drop it. PC-C accepts it and replies (`Src MAC: 00-0C`, `Dst MAC: 00-0A`).\n5. S1 receives PC-C\u0027s reply on Fa0/3. LEARN: S1 records `00-0C -\u003e Port Fa0/3`. FORWARD: S1 looks up `00-0A`, finds `Fa0/1` in the table, and sends the frame ONLY out Fa0/1!",
        "realWorldExample_vi":  "Ví dụ mô phỏng từng giây hoạt động của Switch S1 khi mới bật nguồn (Bảng MAC đang trống rỗng):\nCó 3 máy cắm vào Switch: **PC1** (`MAC: AA`, cổng `Fa0/1`), **PC2** (`MAC: BB`, cổng `Fa0/2`), **PC3** (`MAC: CC`, cổng `Fa0/3`).\n• **Tình huống 1**: PC1 gửi 1 Frame cho PC3 (`Src MAC = AA`, `Dst MAC = CC`).\n  1. **Học (Learn)**: Frame chui vào cổng `Fa0/1`. Switch nhìn `Src MAC = AA` -\u003e Ghi ngay vào bảng MAC: `AA đang ở cổng Fa0/1`.\n  2. **Chuyển tiếp (Forward)**: Switch nhìn `Dst MAC = CC`, dò trong bảng MAC chưa thấy `CC` ở đâu cả (Unknown Unicast) -\u003e Switch **Flood** (phát tán) Frame này ra cả 2 cổng còn lại là `Fa0/2` và `Fa0/3`.\n  3. Máy PC2 nhận được nhưng thấy `Dst MAC = CC` không phải tên mình nên tự hủy. Máy PC3 nhận được và gửi Frame trả lời cho PC1 (`Src MAC = CC`, `Dst MAC = AA`).\n• **Tình huống 2**: Khi Frame trả lời của PC3 chui vào cổng `Fa0/3`:\n  1. **Học (Learn)**: Switch nhìn `Src MAC = CC` -\u003e Ghi thêm vào bảng MAC: `CC đang ở cổng Fa0/3`.\n  2. **Chuyển tiếp (Forward)**: Switch nhìn `Dst MAC = AA`, tra bảng thấy ngay `AA ở cổng Fa0/1` -\u003e Switch chuyển thẳng một mạch ra riêng cổng `Fa0/1` (PC2 hoàn toàn không bị làm phiền nữa!).",
        "diagramType":  "ethernet-switching",
        "commands":  [
                         "Switch# show mac address-table                       # Xem toàn bộ Bảng địa chỉ MAC (cả tĩnh và động) trên Switch",
                         "Switch# show mac address-table dynamic               # Chỉ xem các địa chỉ MAC mà Switch tự động học được (lưu 300 giây)",
                         "Switch# show mac address-table interface Fa0/1       # Kiểm tra xem máy cắm ở cổng Fa0/1 mang địa chỉ MAC nào",
                         "Switch# clear mac address-table dynamic              # Xóa sạch toàn bộ bảng MAC động để Switch học lại từ đầu",
                         "Switch# show interfaces fastethernet 0/1             # Xem địa chỉ MAC gốc (BIA) của cổng Switch và số lỗi Runts/Giants/CRC"
                     ],
        "comparisonTable":  {
                                "title_vi":  "Bảng So Sánh Các Địa Chỉ MAC Đặc Biệt \u0026 2 Cơ Chế Chuyển Mạch Của Switch (Store-and-Forward vs. Cut-Through)",
                                "headers_vi":  [
                                                   "Loại Địa Chỉ MAC / Cơ Chế",
                                                   "Giá Trị / Nguyên Lý Kỹ Thuật",
                                                   "Cách Switch Xử Lý Khi Nhận Được",
                                                   "Ứng Dụng Thực Tế \u0026 Đề Thi"
                                               ],
                                "rows":  [
                                             [
                                                 "Unicast MAC (Đã có trong bảng CAM)",
                                                 "Ví dụ: `00-60-2F-3A-07-BC` (6 số đầu OUI của hãng, 6 số cuối Serial).",
                                                 "Chuyển tiếp đích danh (**Filter \u0026 Forward**) ra đúng 1 cổng duy nhất trong bảng MAC.",
                                                 "Truyền dữ liệu riêng tư giữa 2 máy, các cổng khác không thể nghe lén."
                                             ],
                                             [
                                                 "Unknown Unicast MAC (Chưa có trong bảng)",
                                                 "Địa chỉ MAC hợp lệ của 1 máy nhưng máy đó chưa từng phát gói tin nào nên Switch chưa kịp học.",
                                                 "**Flood (Nhân bản)** đẩy ra tất cả các cổng đang hoạt động (trừ cổng nhận vào).",
                                                 "Xảy ra ở gói tin đầu tiên khi bảng MAC vừa khởi động hoặc sau 300 giây hết hạn."
                                             ],
                                             [
                                                 "Broadcast MAC",
                                                 "**`FF-FF-FF-FF-FF-FF`** (48 bit toàn số `1`).",
                                                 "**Flood (Nhân bản)** ra tất cả các cổng trong cùng VLAN (trừ cổng nhận vào).",
                                                 "Dùng cho gói tin **ARP Request** và **DHCP Discover / Request** trong IPv4."
                                             ],
                                             [
                                                 "IPv4 Multicast MAC",
                                                 "Luôn bắt đầu bằng **`01-00-5E-xx-xx-xx`**.",
                                                 "Flood ra các cổng (hoặc chỉ gửi tới các cổng đăng ký nếu bật **IGMP Snooping**).",
                                                 "Ánh xạ từ dải IP Multicast lớp D (`224.0.0.0` – `239.255.255.255`)."
                                             ],
                                             [
                                                 "IPv6 Multicast MAC",
                                                 "Luôn bắt đầu bằng **`33-33-xx-xx-xx-xx`**.",
                                                 "Chuyển tới nhóm máy đăng ký nhận IPv6 Multicast.",
                                                 "Dùng cho bản tin ICMPv6 Neighbor Discovery (`ff02::1`, `ff02::2`, Solicited-Node)."
                                             ],
                                             [
                                                 "Store-and-Forward Switching",
                                                 "Đọc trọn vẹn cả Frame -\u003e Tính CRC đối chiếu với đuôi FCS -\u003e Không lỗi mới chuyển đi.",
                                                 "Hủy bỏ ngay các Frame lỗi CRC, Runt (\u003c64B), Giant (\u003e1518B).",
                                                 "**Mặc định trên mọi Switch Cisco Catalyst**, bắt buộc khi dùng QoS hoặc nối cổng 100Mbps sang 1Gbps."
                                             ],
                                             [
                                                 "Cut-Through (Fast-Forward \u0026 Fragment-Free)",
                                                 "Fast-Forward: Đọc xong 6 Bytes Dest MAC là phóng đi ngay; Fragment-Free: Đọc xong **64 Bytes đầu** mới phóng.",
                                                 "Không kiểm tra đuôi FCS nên có thể chuyển tiếp cả Frame bị lỗi CRC (nhưng Fragment-Free lọc được mảnh vỡ Runt \u003c64B).",
                                                 "Dùng trong Switch Data Center tài chính cần độ trễ siêu thấp (micro-seconds)."
                                             ]
                                         ]
                            },
        "jobSkills_vi":  [
                             "Kinh nghiệm Đi Làm 1 — Thảm họa \u0027Vòng lặp Tầng 2\u0027 (Layer 2 Switching Loop / Broadcast Storm) và Giao thức STP: Khi đi làm, nếu một nhân viên vô tình cắm 2 đầu của cùng 1 sợi dây mạng vào 2 cổng trên Switch (hoặc nối 2 dây giữa 2 Switch mà tắt STP), điều gì sẽ xảy ra? Khi có 1 gói Broadcast (`FFFF.FFFF.FFFF`) đi vào, vì Switch KHÔNG có trường giảm `TTL` như Router, 2 Switch sẽ nhân bản và bắn gói Broadcast đó qua lại cho nhau với tốc độ ánh sáng tạo thành **Cơn bão Quảng bá (Broadcast Storm)**! Chỉ trong 3 giây: CPU của Switch vọt lên 100%, bảng MAC bị xáo trộn liên tục (MAC Flapping) và toàn bộ mạng công ty sập hoàn toàn! Để chống lại thảm họa này, mọi Switch Cisco đều bật sẵn giao thức **STP (Spanning Tree Protocol - IEEE 802.1D / Rapid PVST+)** để tự động khóa (Block) bớt cổng dư thừa và chỉ mở lại khi dây chính bị đứt!",
                             "Kinh nghiệm Đi Làm 2 — Phân chia VLAN (Virtual LAN) và Đường nối Trunk (`802.1Q`) trong doanh nghiệp: Không công ty nào để 200 máy tính của cả Phòng Kế Toán, Nhân Sự, Kỹ Thuật và Khách Wi-Fi nằm chung trong `VLAN 1` mặc định! Kỹ sư mạng sẽ cắt nhỏ chiếc Switch vật lý thành nhiều Switch ảo gọi là **VLAN** (`vlan 10` Kế Toán, `vlan 20` Kỹ Thuật): • Cổng cắm xuống máy tính PC đặt là **`switchport mode access`** (`switchport access vlan 10`). • Cổng nối giữa 2 Switch hoặc từ Switch lên Router đặt là **`switchport mode trunk`** — sử dụng chuẩn **IEEE 802.1Q** gắn thêm một chiếc nhãn **4 Bytes (VLAN Tag)** vào giữa Header Ethernet để chở nhiều VLAN đi qua 1 sợi cáp duy nhất!",
                             "Kinh nghiệm Đi Làm 3 — Chống cắm trộm thiết bị lạ bằng **Port Security**: Để ngăn nhân viên tự ý mang cục phát Wi-Fi ở nhà hoặc laptop cá nhân vào cắm dây mạng công ty (hoặc chống hacker dùng công cụ *macof* bắn hàng vạn địa chỉ MAC giả làm tràn bảng CAM để biến Switch thành Hub), kỹ sư cấu hình `switchport port-security` kèm `mac-address sticky`. Nếu có MAC lạ cắm vào, cổng sẽ tự động khóa cứng chuyển sang trạng thái **`err-disabled`** (tắt đèn cổng). Muốn mở lại cổng sau khi rút máy lạ ra, quản trị viên phải vào cổng đó gõ `shutdown` rồi gõ `no shutdown`!"
                         ],
        "quiz":  [
                     {
                         "question_vi":  "Câu 1 (Đề thi CCNA): Phương thức chuyển mạch nào trên Switch sẽ đợi nhận đủ 64 Bytes đầu tiên của khung tin (để đảm bảo khung tin không phải là mảnh vỡ đụng độ Runt) rồi mới lập tức chuyển tiếp đi mà không đợi kiểm tra phần đuôi FCS?",
                         "options_vi":  [
                                            "A. Store-and-Forward",
                                            "B. Fast-Forward (thuộc Cut-Through)",
                                            "C. Fragment-Free (thuộc Cut-Through)",
                                            "D. Auto-MDIX"
                                        ],
                         "answerIndex":  2,
                         "explanation_vi":  "Đáp án đúng là C (Fragment-Free). Trong nhóm Cut-Through có 2 chế độ: Fast-Forward chuyển ngay khi vừa đọc xong Destination MAC (độ trễ thấp nhất nhưng không lọc được lỗi nào), còn Fragment-Free kiểm tra đủ 64 Bytes đầu tiên vì hầu hết các lỗi đụng độ (Collision Runts) đều xảy ra trong 64 Bytes đầu này."
                     },
                     {
                         "question_vi":  "Câu 2 (Đề thi CCNA): Khi Switch S1 nhận được một khung tin Ethernet đi vào cổng Fa0/1 với Source MAC là `00-0A` và Destination MAC là `00-0B`. Hiện tại trong bảng MAC của Switch mới chỉ có duy nhất một dòng: `Fa0/3 -\u003e 00-0C`. Switch S1 sẽ xử lý như thế nào?",
                         "options_vi":  [
                                            "A. Hủy bỏ khung tin ngay lập tức vì không tìm thấy `00-0B` trong bảng MAC.",
                                            "B. Ghi nhận `00-0A` gắn với cổng `Fa0/1` vào bảng MAC, sau đó chuyển tiếp (Flood) khung tin ra tất cả các cổng đang hoạt động TRỪ cổng `Fa0/1`.",
                                            "C. Ghi nhận `00-0B` gắn với cổng `Fa0/1`, rồi chỉ gửi khung tin ra cổng `Fa0/3`.",
                                            "D. Gửi bản tin ARP Request để hỏi địa chỉ IP của `00-0B`."
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B. Quy tắc 2 bước bất di bất dịch của Switch: 1) Học (Learn) dựa trên Source MAC -\u003e ghi `00-0A` vào cổng nhận `Fa0/1`; 2) Chuyển tiếp (Forward) dựa trên Destination MAC -\u003e vì `00-0B` chưa có trong bảng MAC (Unknown Unicast), Switch sẽ Flood khung tin ra mọi cổng đang bật ngoại trừ cổng `Fa0/1` mà khung tin vừa đi vào."
                     },
                     {
                         "question_vi":  "Câu 3 (Đề thi CCNA): Địa chỉ MAC đích nào sau đây cho Switch biết đây là một khung tin IPv6 Multicast?",
                         "options_vi":  [
                                            "A. `FF-FF-FF-FF-FF-FF`",
                                            "B. `01-00-5E-00-00-05`",
                                            "C. `33-33-FF-12-34-56`",
                                            "D. `00-1B-63-84-45-E6`"
                                        ],
                         "answerIndex":  2,
                         "explanation_vi":  "Đáp án đúng là C (`33-33-...`). Hãy nhớ mẹo nhận diện nhanh: `FF-FF-FF-FF-FF-FF` là Broadcast; bắt đầu bằng `01-00-5E` là IPv4 Multicast; còn bắt đầu bằng `33-33` luôn luôn là IPv6 Multicast!"
                     }
                 ],
        "beginnerGuide_vi":  [
                                 "1. Thiết bị Switch (Bộ chuyển mạch) thực chất làm việc gì trong phòng làm việc của bạn? Khi bạn có 10 chiếc máy tính trong văn phòng, tất cả 10 dây cáp mạng từ 10 máy tính đều được gom về cắm vào các lỗ RJ-45 trên một chiếc hộp kim loại gọi là **Switch**. Nhiệm vụ của Switch là: Khi Máy số 1 muốn gửi tài liệu cho Máy số 5, Switch sẽ nhận diện và **chuyển gói tin đi thẳng từ Cổng số 1 sang Cổng số 5** mà không làm phiền 8 máy còn lại.",
                                 "2. \u0027Địa chỉ MAC (Media Access Control)\u0027 là gì mà Switch phải dùng đến nó? Hãy tưởng tượng mỗi chiếc card mạng (NIC) lắp trong máy tính hay điện thoại khi xuất xưởng đều được nhà sản xuất đóng một **Dấu vân tay / Số khung xe duy nhất trên toàn thế giới** gọi là **Địa chỉ MAC** (dài 12 ký tự chữ và số, ví dụ `00-60-2F-3A-07-BC`). Switch ở Tầng 2 hoàn toàn \u0027mù chữ\u0027 đối với Địa chỉ IP — mắt của Switch chỉ nhìn thấy duy nhất **Địa chỉ MAC**!",
                                 "3. Làm sao Switch biết máy tính nào đang cắm ở lỗ (cổng) số mấy? Switch có một cuốn sổ tay thông minh trong bộ nhớ RAM gọi là **Bảng địa chỉ MAC (MAC Address Table)**. Ban đầu cuốn sổ này trắng trơn: • Mỗi khi có một máy tính gửi dữ liệu đi vào cổng số 1, Switch nhìn vào **Địa chỉ MAC của người gửi (Source MAC)** và tự ghi vào sổ: *\u0027À, anh có MAC AA-AA đang ngồi ở Cổng số 1!\u0027* (Quá trình này gọi là **Học - Learn**). • Tiếp theo, Switch nhìn vào **Địa chỉ MAC của người nhận (Destination MAC)**: nếu đã có tên trong sổ thì chuyển thẳng tới cổng đó; nếu chưa có tên trong sổ thì Switch đành **phát loa hỏi tất cả các cổng còn lại (gọi là Flood)** cho đến khi người nhận lên tiếng trả lời!",
                                 "4. So sánh trực quan giữa thiết bị Hub cổ điển (Tầng 1) và Switch hiện đại (Tầng 2): • **Hub (Bộ tập trung Tầng 1)**: Hoàn toàn không hiểu địa chỉ MAC. Khi máy A gửi tin cho máy B, Hub nhân bản xung điện đó và bắn ra **tất cả các cổng còn lại** — mọi máy tính khác đều bị làm phiền, tốn băng thông, và nếu 2 máy gửi cùng lúc sẽ bị chạm mạch (**Collision**). • **Switch (Bộ chuyển mạch Tầng 2)**: Cực kỳ thông minh vì có bảng nhớ địa chỉ MAC (**MAC Address Table**). Khi máy A gửi cho máy B, Switch chỉ nối mạch riêng từ cổng A sang cổng B; cùng lúc đó máy C vẫn có thể gửi cho máy D ở tốc độ tối đa mà không hề đụng độ!",
                                 "5. Miền Đụng Độ (Collision Domain) và Miền Quảng Bá (Broadcast Domain) — Khái niệm hay hỏi nhất khi đi thi: • **Miền đụng độ (Collision Domain)**: Là khu vực mạng mà nếu 2 thiết bị phát tín hiệu cùng lúc sẽ va chạm nhau. Một chiếc Hub 24 cổng chỉ có **1 miền đụng độ duy nhất**. Ngược lại, một chiếc Switch 24 cổng chia nhỏ thành **24 miền đụng độ độc lập** (mỗi cổng là 1 miền riêng). • **Miền quảng bá (Broadcast Domain)**: Là phạm vi mà một gói tin Broadcast (FF:FF:FF:FF:FF:FF) có thể lan truyền tới. Lưu ý cực kỳ quan trọng: **Switch KHÔNG chặn được Broadcast** (cả 24 cổng Switch thuộc cùng 1 VLAN đều nằm chung 1 Broadcast Domain). Chỉ có **Router (Tầng 3)** hoặc chia **VLAN** mới cắt nhỏ được miền quảng bá!"
                             ],
        "beginnerGuide_en":  [
                                 "1. What does an Ethernet Switch actually do in your office? All Ethernet cables from office PCs plug into a multi-port box called a **Switch**. When PC1 sends a file to PC5, the Switch forwards that frame directly from Port 1 to Port 5 without disturbing the other computers.",
                                 "2. What is a MAC Address? Every Network Interface Card (NIC) has a globally unique hardware serial number burned into its chip at the factory called a **MAC Address** (12 hexadecimal characters, e.g., `00-60-2F-3A-07-BC`). A Layer 2 Switch only reads MAC addresses (it does not look at IP addresses to switch frames).",
                                 "3. How does a Switch learn which PC is on which port? It maintains a **MAC Address Table** in RAM: • **Step 1 (Learn from Source MAC)**: Whenever a frame enters Port 1, the switch records the sender\u0027s Source MAC address against Port 1. • **Step 2 (Forward by Destination MAC)**: If the Destination MAC is in the table, it sends the frame out that single port; if unknown (or Broadcast `FFFF.FFFF.FFFF`), it **Floods** the frame out all other ports."
                             ],
        "advancedTopics_vi":  [
                                  "Mở rộng Nâng cao 1 — Bộ nhớ CAM (Content Addressable Memory) vs. TCAM trong Switch Cisco: Tại sao một chiếc Switch có thể tra cứu bảng MAC gồm 8.000 địa chỉ để chuyển hàng triệu khung tin mỗi giây mà không bị trễ? Vì bảng MAC không lưu trên RAM thông thường (phải dò từng dòng từ trên xuống) mà lưu trên chip phần cứng **CAM (Content Addressable Memory)** — cho phép đưa địa chỉ MAC vào là trả ra số cổng Port ngay trong **1 chu kỳ xung nhịp duy nhất**! (Còn trên Switch Layer 3 có thêm bộ nhớ **TCAM** để tra cứu siêu tốc cho ACL và QoS).",
                                  "Mở rộng Nâng cao 2 — Giao thức chống lặp vòng STP (Spanning Tree Protocol - IEEE 802.1D / 802.1w RSTP): Trong mạng doanh nghiệp, để dự phòng đứt cáp, kỹ sư luôn cắm **2 sợi dây mạng song song** nối giữa 2 Switch. Nhưng nếu cả 2 sợi dây cùng hoạt động ở Tầng 2 sẽ tạo thành một vòng tròn khép kín (Loop) khiến các gói tin Broadcast (`FFFF.FFFF.FFFF`) chạy vòng tròn nhân bản vô tận làm treo cứng toàn bộ mạng trong vài giây! Giao thức **STP** tự động bầu chọn 1 Switch làm gốc (**Root Bridge**) và tự động **Khóa tạm thời (Blocking state)** 1 đầu dây phụ; khi nào dây chính bị đứt, STP mới tự động mở khóa dây phụ lên thay thế!",
                                  "Mở rộng Nâng cao 3 — Công nghệ Gộp băng thông nhiều dây cáp thành 1 đường lớn (**EtherChannel / LACP - IEEE 802.3ad**): Nếu bạn nối 4 sợi dây cáp Gigabit (1 Gbps) giữa 2 Switch mà muốn cả 4 sợi cùng truyền dữ liệu đạt tổng tốc độ **4 Gbps** mà không bị giao thức STP khóa mất 3 sợi thì làm thế nào? Bạn cấu hình **EtherChannel (Port-Channel)** sử dụng giao thức chuẩn quốc tế **LACP** (hoặc **PAgP** của Cisco) để bó 4 cổng vật lý thành **1 cổng logic duy nhất**!",
                                  "Mở rộng Nâng cao 4 — Gộp băng thông nhiều cổng vật lý bằng công nghệ EtherChannel (LACP / PAgP): Khi nối 2 chiếc Switch với nhau, nếu bạn cắm 2 sợi cáp để tăng gấp đôi tốc độ thì giao thức chống lặp **Spanning Tree (STP)** sẽ lập tức khóa 1 sợi lại để chống bão Broadcast! Để vừa dùng được cả 2–8 sợi cáp cùng lúc (tăng băng thông lên 2Gbps–8Gbps) vừa có dự phòng đứt cáp mà không bị STP khóa, kỹ sư sử dụng công nghệ **EtherChannel** (chuẩn quốc tế **IEEE 802.3ad LACP** hoặc chuẩn Cisco **PAgP**) để bó nhiều cổng vật lý thành một cổng logic duy nhất gọi là Port-channel."
                              ],
        "advancedTopics_en":  [
                                  "Advanced Expansion 1 — CAM vs. TCAM Hardware Tables: Switches store their MAC table in **CAM (Content Addressable Memory)** ASICs, which perform exact-match lookups in a single clock cycle for wire-speed forwarding (while **TCAM** handles ACLs, QoS, and routing prefixes).",
                                  "Advanced Expansion 2 — Spanning Tree Protocol (STP — IEEE 802.1D / Rapid PVST+): Redundant cables between switches create lethal Layer 2 Broadcast Storms because Ethernet frames have no TTL field. STP elects a **Root Bridge** and places redundant ports into a **Blocking (Alternate)** state, activating them automatically only if the primary link fails.",
                                  "Advanced Expansion 3 — Link Aggregation with EtherChannel (LACP — IEEE 802.3ad): To bundle 2 to 8 physical switch ports into a single high-bandwidth logical link (e.g., 4 x 1Gbps = 4Gbps) without STP blocking them, engineers configure an **EtherChannel (`interface port-channel`)** using LACP or PAgP."
                              ]
    },
    {
        "id":  8,
        "title":  "Network Layer",
        "title_vi":  "Tầng Mạng và Bảng Định Tuyến",
        "overview":  "Module 8 covers OSI Layer 3 (Network Layer), which enables end-to-end packet delivery across multiple interconnected networks. It examines the three core characteristics of IP (Connectionless, Best-Effort, Media Independent), compares the 20-byte IPv4 Packet Header with the streamlined 40-byte IPv6 Packet Header, explains how an end host decides whether a destination is on its local LAN or requires the Default Gateway, and details how a Cisco router reads its IP Routing Table (`show ip route`) using codes `C` (Connected), `L` (Local), `S` (Static), `O` (OSPF), and `S*` (Default Route).",
        "overview_vi":  "Module 8 đi vào trái tim của việc kết nối liên mạng: Tầng 3 OSI (Network Layer) và thiết bị Router. Nếu Tầng 2 (Switch) chỉ giúp các máy trong cùng 1 phòng nói chuyện với nhau, thì Tầng 3 (Giao thức IPv4 và IPv6) giúp gói tin đi xuyên qua hàng chục mạng khác nhau trên toàn cầu. Bạn sẽ nắm rõ 3 đặc tính cốt lõi của giao thức IP (Không kết nối trước, Nỗ lực tốt nhất nhưng không cam kết, Độc lập với môi trường cáp/sóng), so sánh cấu trúc nhãn IPv4 Header và IPv6 Header (tại sao IPv6 lại bỏ bớt các trường rườm rà để xử lý nhanh hơn), cách máy tính dùng Default Gateway để bước ra khỏi mạng LAN, và cách đọc hiểu **Bảng Định Tuyến (`show ip route`)** của Router thông qua các ký hiệu `C`, `L`, `S`, `O`, `D` và `S*`.",
        "analogy_vi":  "Giao thức IP ở Tầng 3 giống như dịch vụ Gửi Thư Thường qua Bưu điện: 1) **Connectionless (Không kết nối trước)**: Bạn cứ bỏ thư vào thùng thư mà không cần gọi điện báo trước cho người nhận; 2) **Best-Effort (Nỗ lực tốt nhất / Không đảm bảo)**: Bưu điện cố gắng hết sức để chuyển thư đi, nhưng nếu thất lạc thì IP không tự gửi lại (muốn có biên nhận ký tên và gửi bù khi mất thư thì phải nhờ anh TCP ở Tầng 4!); 3) **Media Independent (Độc lập phương tiện)**: Lá thư đó đi bằng xe máy, tàu hỏa hay máy bay đều được, miễn là kích thước kiện hàng không vượt quá giới hạn thùng xe (MTU - Maximum Transmission Unit).",
        "keyConcepts":  [
                            "Three Characteristics of IP (IPv4 \u0026 IPv6): 1) Connectionless (no handshake before sending packets; packets may take different paths and arrive out of order), 2) Best-Effort / Unreliable (IP has no mechanism to recover lost or corrupt packets—that job belongs to TCP at Layer 4), 3) Media Independent (IP packets travel over Copper Ethernet, Fiber, or Wi-Fi; Layer 3 only checks the link\u0027s MTU - Maximum Transmission Unit).",
                            "Key Fields in the IPv4 Packet Header (20 Bytes): Version (`4`), DiffServ/DSCP (used for QoS traffic prioritization), Time-to-Live / TTL (8-bit counter max 255; every router decrements TTL by 1 and drops the packet if TTL hits 0 to prevent infinite routing loops!), Protocol (`1`=ICMP, `6`=TCP, `17`=UDP), Header Checksum, Source IPv4 Address (32 bits), and Destination IPv4 Address (32 bits).",
                            "Why the IPv6 Packet Header (Fixed 40 Bytes) is Faster: Even though IPv6 addresses are 4x larger (128 bits vs. 32 bits), the IPv6 header has only 8 fields instead of IPv4\u0027s 12 fields! IPv6 removed the Header Checksum (since Layer 2 FCS and Layer 4 TCP/UDP already check errors) and removed router packet Fragmentation, allowing routers to forward IPv6 packets at much higher speeds. Note: IPv4\u0027s `TTL` is renamed `Hop Limit` in IPv6, and `Protocol` is renamed `Next Header`.",
                            "How a Host Makes Forwarding Decisions: Before sending a packet, a PC compares its own IP/Subnet Mask with the Destination IP: 1) **Loopback (`127.0.0.1` / `::1`)**: Sends to itself internally; 2) **Local Host (Same Subnet)**: Sends directly to the target host via the local switch; 3) **Remote Host (Different Subnet)**: Sends the frame to its configured **Default Gateway** (the local router interface IP).",
                            "Understanding `show ip route` Codes on a Cisco Router: When an interface is configured with an IP and `no shutdown`, the router automatically adds two entries: **`C` (Connected)** for the subnet (e.g., `192.168.10.0/24`) and **`L` (Local)** for the exact interface IP (`/32`). Remote networks are learned via **`S` (Static Route)** configured by an admin, **`O` (OSPF)** or **`D` (EIGRP)** dynamic routing protocols, or **`S*` (Gateway of Last Resort / Default Route `0.0.0.0/0`)** used when no specific route matches."
                        ],
        "keyConcepts_vi":  [
                               "3 Đặc tính bản chất của giao thức IP (Thi rất hay hỏi): 1) **Connectionless (Không hướng kết nối)**: Gửi gói tin đi ngay mà không cần bắt tay thiết lập đường truyền trước với máy nhận; 2) **Best-Effort (Nỗ lực tối đa nhưng không cam kết)**: IP không đánh số thứ tự gói tin và không báo nhận (ACK) — nếu rớt mạng mất gói tin, tầng IP mặc kệ, việc kiểm tra và xin gửi lại là nhiệm vụ của giao thức TCP ở Tầng 4; 3) **Media Independent (Độc lập với môi trường truyền)**: Gói tin IP đi qua cáp đồng, cáp quang hay Wi-Fi đều được.",
                               "Các trường quan trọng nhất trong IPv4 Header (20 Bytes): • **Version**: Số `4` (`0100`); • **DiffServ (DSCP)**: Đánh dấu độ ưu tiên QoS cho gói tin thoại/video; • **TTL (Time to Live)**: Thời gian sống của gói tin (đếm theo số trạm Router). Mỗi khi đi qua 1 Router, TTL bị trừ đi `1`. Nếu `TTL = 0`, Router lập tức hủy gói tin để chống lặp vòng vô tận (Routing Loop); • **Protocol**: Báo cho Tầng 4 biết bên trong là `6` (TCP), `17` (UDP) hay `1` (ICMP); • **Source IP \u0026 Destination IP** (32-bit).",
                               "Tại sao IPv6 Header (Cố định 40 Bytes) lại giúp Router chạy nhanh hơn IPv4? Dù địa chỉ IPv6 dài gấp 4 lần IPv4 (128-bit so với 32-bit), nhưng nhãn IPv6 Header lại cắt bỏ các trường rườm rà của IPv4: Bỏ luôn trường `Header Checksum` (để Router không mất công tính lại ở mỗi trạm vì Tầng 2 FCS và Tầng 4 đã kiểm tra lỗi rồi), bỏ các trường phân mảnh `Fragmentation` (Router IPv6 không cắt nhỏ gói tin dọc đường). Trong IPv6, trường `TTL` đổi tên thành **Hop Limit**, còn trường `Protocol` đổi tên thành **Next Header**.",
                               "Cách Máy Tính (Host) quyết định gửi gói tin đi đâu: Khi PC1 muốn gửi gói tin tới một IP đích, nó lấy IP của mình so với IP đích (qua phép toán AND với Subnet Mask): 1) Nếu là `127.0.0.1` (hoặc `::1`): Gửi cho chính mình để test card mạng; 2) Nếu **Cùng mạng LAN**: Gửi trực tiếp qua Switch tới máy đích; 3) Nếu **Khác mạng LAN**: Bắt buộc gửi tới **Default Gateway** (địa chỉ IP cổng Router nối với mạng LAN đó) để nhờ Router dẫn đường ra thế giới bên ngoài.",
                               "Cách đọc Bảng Định Tuyến (`show ip route`) của Router Cisco: Khi một gói tin đi vào Router, Router tra bảng định tuyến từ dòng có Subnet Mask chi tiết nhất (Longest Prefix Match): • **`C` (Connected)**: Mạng nối trực tiếp vào cổng của Router; • **`L` (Local `/32`)**: Chính địa chỉ IP gắn trên cổng của Router đó; • **`S` (Static)**: Đường đi tĩnh do quản trị viên tự gõ lệnh chỉ đường; • **`O` (OSPF) / `D` (EIGRP)**: Đường đi học tự động từ các Router hàng xóm; • **`S*` (`0.0.0.0/0` - Default Route)**: Tuyến đường mặc định cuối cùng (đẩy ra Internet) khi không khớp với bất kỳ mạng nội bộ nào. Nếu không có cả `S*`, gói tin sẽ bị hủy!"
                           ],
        "realWorldExample":  "Scenario: Interpreting `show ip route` on Router R1:\n```text\nGateway of last resort is 209.165.200.226 to network 0.0.0.0\nS*    0.0.0.0/0 [1/0] via 209.165.200.226\n      192.168.10.0/24 is variably subnetted, 2 subnets, 2 masks\nC        192.168.10.0/24 is directly connected, GigabitEthernet0/0/0\nL        192.168.10.1/32 is directly connected, GigabitEthernet0/0/0\nS     192.168.20.0/24 [1/0] via 10.1.1.2\n```\n• If a packet arrives for `192.168.10.55`, R1 matches the `C` route (`192.168.10.0/24`) and delivers it directly out `Gi0/0/0`.\n• If a packet arrives for `192.168.20.99`, R1 matches the `S` static route and forwards it to next-hop router `10.1.1.2`.\n• If a packet arrives for `8.8.8.8` (Google DNS), it doesn\u0027t match `192.168.10.0` or `192.168.20.0`, so R1 uses the default route `S* 0.0.0.0/0` and forwards it to ISP router `209.165.200.226`.",
        "realWorldExample_vi":  "Ví dụ thực tế cách đọc kết quả lệnh `show ip route` trên Router R1:\nGiả sử bảng định tuyến của R1 hiển thị:\n• `C  192.168.10.0/24 is directly connected, GigabitEthernet0/0/0`\n• `L  192.168.10.1/32 is directly connected, GigabitEthernet0/0/0`\n• `S  192.168.20.0/24 [1/0] via 10.1.1.2`\n• `S* 0.0.0.0/0 [1/0] via 203.113.1.1`\n\nCách Router R1 xử lý 3 gói tin đi vào:\n1. Gói tin số 1 muốn tới `192.168.10.50`: Khớp ngay dòng **`C` (Connected)** -\u003e R1 đẩy thẳng ra cổng `Gi0/0/0` xuống mạng LAN nội bộ.\n2. Gói tin số 2 muốn tới `192.168.20.88` (Phòng Kế toán ở chi nhánh 2): Khớp dòng **`S` (Static Route)** -\u003e R1 chuyển gói tin sang trạm Router kế tiếp có IP `10.1.1.2`.\n3. Gói tin số 3 muốn vào `facebook.com` (`157.240.1.35`): Không khớp dòng `C` cũng chẳng khớp dòng `S`, nhưng may mắn có dòng cứu cánh **`S* 0.0.0.0/0` (Default Route)** -\u003e R1 đẩy gói tin ra cổng nhà mạng ISP (`203.113.1.1`) để đi ra Internet!",
        "diagramType":  "ip-headers-routing",
        "commands":  [
                         "Router# show ip route                                            # Xem Bảng định tuyến IPv4 trên Router (Ký hiệu: C, L, S, O, D, S*)",
                         "Router# show ipv6 route                                          # Xem Bảng định tuyến IPv6 trên Router",
                         "Router(config)# ip route 192.168.20.0 255.255.255.0 10.1.1.2     # Cấu hình Static Route chỉ đường tới mạng 192.168.20.0/24 qua Next-Hop 10.1.1.2",
                         "Router(config)# ip route 0.0.0.0 0.0.0.0 203.113.1.1             # Cấu hình Default Route (S*) đẩy toàn bộ lưu lượng đi Internet",
                         "Switch(config)# ip default-gateway 192.168.10.1                  # Đặt Default Gateway cho Switch Layer 2 để quản trị từ mạng khác",
                         "C:\\\u003e netstat -r                                                  # Xem bảng định tuyến trên máy tính Windows (hoặc dùng lệnh: route print)"
                     ],
        "comparisonTable":  {
                                "title_vi":  "Bảng Độ Tin Cậy Của Tuyến Đường (Administrative Distance - AD) \u0026 So Sánh IPv4 vs IPv6 Header",
                                "headers_vi":  [
                                                   "Nguồn Định Tuyến / Thông Số",
                                                   "Ký Hiệu Trong `show ip route`",
                                                   "Giá Trị AD (Càng Nhỏ Càng Ưu Tiên!)",
                                                   "Giải Thích Thực Chiến \u0026 Bẫy Đề Thi"
                                               ],
                                "rows":  [
                                             [
                                                 "Directly Connected (Mạng nối trực tiếp)",
                                                 "**`C`** (Mạng) \u0026 **`L`** (IP cổng `/32`)",
                                                 "**0** (Đáng tin cậy tuyệt đối)",
                                                 "Tự động xuất hiện khi gán IP lên cổng Router và gõ `no shutdown`."
                                             ],
                                             [
                                                 "Static Route (Đường đi tĩnh)",
                                                 "**`S`** (hoặc **`S*`** cho Default Route)",
                                                 "**1**",
                                                 "Do kỹ sư tự gõ lệnh `ip route`. Muốn làm đường dự phòng (Floating Static Route) thì đặt AD lớn hơn giao thức động (ví dụ đặt AD = 150)."
                                             ],
                                             [
                                                 "External BGP (eBGP)",
                                                 "**`B`**",
                                                 "**20**",
                                                 "Giao thức định tuyến liên mạng giữa các nhà mạng ISP trên toàn cầu."
                                             ],
                                             [
                                                 "Internal EIGRP",
                                                 "**`D`** (Dual)",
                                                 "**90**",
                                                 "Giao thức định tuyến động nâng cao tốc độ hội tụ cực nhanh của Cisco."
                                             ],
                                             [
                                                 "OSPF (Open Shortest Path First)",
                                                 "**`O`**",
                                                 "**110**",
                                                 "Giao thức định tuyến động chuẩn quốc tế phổ biến nhất trong doanh nghiệp (dùng Metric là **Cost** dựa trên băng thông)."
                                             ],
                                             [
                                                 "RIP (Routing Information Protocol)",
                                                 "**`R`**",
                                                 "**120**",
                                                 "Giao thức định tuyến cổ điển đếm số trạm Router (Hop count, tối đa 15 hops)."
                                             ],
                                             [
                                                 "IPv4 Header vs. IPv6 Header",
                                                 "IPv4: **20–60 Bytes** (12 trường)",
                                                 "IPv6: **Cố định 40 Bytes** (8 trường)",
                                                 "IPv6 bỏ trường `Header Checksum` và `Fragmentation`, đổi tên `TTL` -\u003e **`Hop Limit`**, đổi `Protocol` -\u003e **`Next Header`**."
                                             ]
                                         ]
                            },
        "jobSkills_vi":  [
                             "Kinh nghiệm Đi Làm 1 — Quy tắc 3 Bước Chọn Đường Của Router (Longest Prefix Match -\u003e AD -\u003e Metric): Đây là câu hỏi chắc chắn xuất hiện trong đề thi CCNA và phỏng vấn! Khi Router nhận được gói tin cần tới `192.168.1.10` và trong bảng định tuyến có cả 3 đường: Đường 1 là `192.168.1.0/24` (học qua RIP có AD=120), Đường 2 là `192.168.1.0/26` (học qua OSPF có AD=110), Đường 3 là `192.168.0.0/16` (Static Route có AD=1). Router sẽ chọn đường nào? **Câu trả lời là Đường 2 (`/26`)!** Tại sao không chọn Static Route có AD=1? Vì quy tắc số 1 của Router luôn là **Longest Prefix Match (Khớp Subnet Mask dài nhất / chi tiết nhất trước)**: `/26` chi tiết hơn `/24` và `/16` nên thắng ngay lập tức! Chỉ khi nào có 2 đường **cùng độ dài `/24` y hệt nhau** thì Router mới xét đến **AD (Administrative Distance)** nhỏ hơn, và nếu cùng AD nữa mới xét đến **Metric** nhỏ hơn (nếu bằng nhau cả Metric thì cân bằng tải **ECMP - Equal Cost Multi-Path**).",
                             "Kinh nghiệm Đi Làm 2 — Cấu hình Đường Tĩnh Dự Phòng Tự Động (Floating Static Route): Khi công ty có 1 đường cáp nội bộ chạy OSPF (`AD = 110`) và 1 đường cáp dự phòng, làm sao để bình thường chạy đường OSPF, khi nào đứt cáp mới tự nhảy sang đường tĩnh? Rất đơn giản: Khi gõ lệnh Static Route, bạn thêm con số AD lớn hơn 110 ở cuối câu lệnh: `ip route 192.168.20.0 255.255.255.0 10.2.2.2 150`. Vì `150 \u003e 110`, đường tĩnh này sẽ \u0027nằm ẩn mình\u0027 không xuất hiện trong `show ip route` cho đến giây phút đường OSPF bị đứt!",
                             "Kinh nghiệm Đi Làm 3 — Lỗi kinh điển \u0027Quên đường về (Missing Return Route)\u0027: Nhiều bạn mới đi làm cấu hình Static Route trên Router A chỉ đường sang mạng của Router B rồi gõ `ping` nhưng toàn báo `. . . . .` (Timeout). Hãy nhớ: **`ping` là giao tiếp 2 chiều**! Gói tin đi từ A sang tới đích ở B rồi, nhưng **Router B chưa được cấu hình đường quay ngược về mạng của A** nên gói Echo Reply bị rớt ở chiều về!"
                         ],
        "quiz":  [
                     {
                         "question_vi":  "Câu 1 (Đề thi CCNA): Trong bảng định tuyến của Router R1 có 3 tuyến đường sau:\n1) `O 10.1.1.0/24 [110/20] via 192.168.1.2`\n2) `S 10.1.0.0/16 [1/0] via 192.168.1.3`\n3) `R 10.1.1.0/26 [120/2] via 192.168.1.4`\nKhi một gói tin có địa chỉ IP đích là `10.1.1.25` đi vào Router R1, R1 sẽ chuyển gói tin tới trạm kế tiếp (Next-hop) nào?",
                         "options_vi":  [
                                            "A. `192.168.1.3` (vì Static Route có chỉ số AD = 1 nhỏ nhất)",
                                            "B. `192.168.1.2` (vì OSPF nhanh hơn RIP)",
                                            "C. `192.168.1.4` (vì tuyến `/26` khớp với địa chỉ đích và có độ dài tiền tố Prefix dài nhất - Longest Prefix Match)",
                                            "D. Cân bằng tải qua cả 3 đường"
                                        ],
                         "answerIndex":  2,
                         "explanation_vi":  "Đáp án đúng là C (`192.168.1.4`). Địa chỉ `10.1.1.25` nằm trong dải `10.1.1.0/26` (`.0` đến `.63`). Khi chọn đường, Router LUÔN LUÔN ưu tiên quy tắc **Longest Prefix Match** (độ dài `/26 \u003e /24 \u003e /16`) trước tiên, bất chấp chỉ số AD là bao nhiêu! Chỉ khi có 2 đường cùng độ dài `/26` thì Router mới đem chỉ số AD ra so sánh."
                     },
                     {
                         "question_vi":  "Câu 2 (Đề thi CCNA): Trường nào trong gói tin IPv4 Header (và trường tương đương trong IPv6 Header) giúp ngăn chặn việc một gói tin bị lặp vòng vô tận giữa các Router khi có lỗi định tuyến?",
                         "options_vi":  [
                                            "A. DiffServ (DSCP) và Traffic Class",
                                            "B. Time to Live (TTL) trong IPv4 và Hop Limit trong IPv6",
                                            "C. Header Checksum và FCS",
                                            "D. Protocol và Next Header"
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B. Trường `TTL` (trong IPv4) và `Hop Limit` (trong IPv6) là bộ đếm số trạm đi qua: mỗi Router khi xử lý gói tin sẽ trừ giá trị này đi 1. Khi giá trị chạm `0`, Router lập tức hủy bỏ gói tin và gửi thông báo lỗi `ICMP Time Exceeded` về cho máy gửi."
                     },
                     {
                         "question_vi":  "Câu 3 (Đề thi CCNA): Trong kết quả của lệnh `show ip route`, hai con số nằm trong dấu ngoặc vuông `[110/50]` của dòng `O 192.168.20.0/24 [110/50] via 10.1.1.2` lần lượt có ý nghĩa là gì?",
                         "options_vi":  [
                                            "A. `[Số cổng Port / Băng thông Mbps]`",
                                            "B. `[Metric / Administrative Distance]`",
                                            "C. `[Administrative Distance (Độ tin cậy của giao thức) / Metric (Chi phí đường đi)]`",
                                            "D. `[Thời gian sống TTL / Kích thước gói tin MTU]`"
                                        ],
                         "answerIndex":  2,
                         "explanation_vi":  "Đáp án đúng là C. Trong ký hiệu `[X/Y]` của bảng định tuyến Cisco: số đứng trước `X` luôn là **Administrative Distance (AD)** (ví dụ `110` là của OSPF, `1` là của Static, `90` là của EIGRP), còn số đứng sau `Y` là **Metric** (chi phí tính toán độ dài đường đi của giao thức đó)."
                     }
                 ],
        "beginnerGuide_vi":  [
                                 "1. Tại sao đã có Switch nối các máy tính rồi lại phải mua thêm Router (Bộ định tuyến) ở Tầng 3? Hãy nhớ: **Switch chỉ nối được các máy tính trong cùng 1 phòng / cùng 1 mạng nội bộ (LAN)**. Nếu tất cả hàng tỷ máy tính trên thế giới đều cắm chung vào các Switch thì một máy tính ở Việt Nam phát gói tin hỏi (Broadcast) sẽ làm ngập lụt tới tận máy tính ở Mỹ! Do đó, thế giới mạng được chia thành hàng triệu khu phố nhỏ (gọi là các Mạng con / Subnet), và đứng ở cổng mỗi khu phố chính là một chiếc **Router** làm nhiệm vụ dẫn đường giữa các khu phố với nhau.",
                                 "2. \u0027Default Gateway (Cổng mặc định)\u0027 trên máy tính của bạn là cái gì? Khi bạn cài đặt IP cho máy tính (ví dụ IP máy bạn là `192.168.1.10`), luôn có một dòng bắt buộc phải điền là **Default Gateway: `192.168.1.1`**. Hãy hiểu cực kỳ đơn giản: **Default Gateway chính là cánh cửa ra vào duy nhất của căn phòng mạng LAN nhà bạn (đó chính là địa chỉ IP của chiếc Router)**! Hễ máy tính muốn gửi tin nhắn cho một người ở ngoài phòng (khác mạng LAN, ví dụ ra ngoài Internet), máy tính cứ việc ném gói tin đó ra cánh cửa **Default Gateway (`192.168.1.1`)**, phần việc tìm đường đi tiếp theo ngoài thế giới là do Router lo!",
                                 "3. Router dùng cái gì để biết đường đi khắp thế giới? Bên trong bộ nhớ RAM của mỗi chiếc Router có một tấm bản đồ giao thông gọi là **Bảng Định Tuyến (IP Routing Table — xem bằng lệnh `show ip route`)**. Khi gói tin đi vào Router, Router nhìn vào **Địa chỉ IP Đích (Destination IP)** ghi trên gói tin, rồi tra vào tấm bản đồ này để biết nên đẩy gói tin ra cổng bên trái hay cổng bên phải!",
                                 "4. Ba đặc tính cốt lõi của giao thức IP (IPv4 \u0026 IPv6) mà người mới cần nắm vững: • **1. Không kết nối (Connectionless)**: Giống như bỏ thư vào thùng bưu điện mà không cần gọi điện báo trước cho người nhận — IP cứ đóng gói xong là phóng đi ngay để đạt tốc độ nhanh nhất. • **2. Nỗ lực tối đa (Best Effort)**: Bản thân giao thức IP ở Tầng 3 không có cơ chế xin gửi lại nếu gói tin bị rớt (việc kiểm tra mất gói và xin gửi lại sẽ do đàn anh **TCP ở Tầng 4** đảm nhận!). • **3. Độc lập phương tiện truyền dẫn (Media Independent)**: Gói tin IP không quan tâm nó đang chạy trên dây cáp đồng, cáp quang hay sóng Wi-Fi — việc thích nghi với dây dẫn là nhiệm vụ của Tầng 2 và Tầng 1.",
                                 "5. Làm sao máy tính của bạn biết khi nào gửi trực tiếp trong phòng, khi nào phải gửi ra Default Gateway (Router)? Trước khi gửi bất kỳ gói tin nào, máy tính lấy **Địa chỉ IP của chính mình** đem so sánh (phép toán AND với Subnet Mask) với **Địa chỉ IP Đích**: • Nếu kết quả **CÙNG MẠNG**: Máy tính gửi thẳng qua Switch tới máy đích mà không cần làm phiền Router. • Nếu kết quả **KHÁC MẠNG**: Máy tính lập tức đóng gói tin gửi về địa chỉ **Default Gateway** (chính là cổng LAN của chiếc Router) để nhờ Router dẫn đường ra thế giới bên ngoài!"
                             ],
        "beginnerGuide_en":  [
                                 "1. Why do we need a Router (Layer 3) if we already have a Switch (Layer 2)? Switches only connect computers within the **same local network (LAN)**. Routers connect **different networks** together (LAN to LAN, or LAN to the Internet) and block local broadcast traffic from flooding the globe.",
                                 "2. What is the \u0027Default Gateway\u0027 configured on your PC? The **Default Gateway** is simply the IP address of the local **Router interface** connected to your LAN (e.g., `192.168.1.1`). Whenever your PC needs to talk to any IP address outside its own local subnet, it sends the packet to its Default Gateway.",
                                 "3. How does a Router know which way to send a packet? Every router maintains a road map in RAM called the **IP Routing Table (`show ip route`)**. It inspects the packet\u0027s **Destination IP address** and matches it against the routing table to pick the best exit interface and next-hop router."
                             ],
        "advancedTopics_vi":  [
                                  "Mở rộng Nâng cao 1 — Định tuyến Tĩnh (Static Routing) vs. Định tuyến Động (Dynamic Routing: OSPF, EIGRP, BGP): Làm sao tấm bản đồ `show ip route` của Router biết được đường tới các mạng ở xa? Có 2 cách: • **Cách 1 — Định tuyến Tĩnh (`ip route`)**: Kỹ sư mạng tự tay gõ lệnh chỉ đường cho Router (phù hợp mạng nhỏ, bảo mật cao, không tốn CPU nhưng nếu đứt cáp phải tự sửa bằng tay). • **Cách 2 — Định tuyến Động (`OSPF`, `EIGRP`, `BGP`)**: Các Router tự động trò chuyện với nhau để trao đổi bản đồ mạng; nếu một đường cáp bị đứt, các Router tự động tính toán lại đường đi mới (thuật toán Dijkstra SPF trong OSPF) chỉ trong 1 giây mà con người không cần đụng tay vào!",
                                  "Mở rộng Nâng cao 2 — Giải phẫu 3 thế hệ Cơ chế Chuyển tiếp Gói tin bên trong Router Cisco (Process Switching -\u003e Fast Switching -\u003e CEF): Trong đề thi CCNA nâng cao rất hay hỏi về **CEF (Cisco Express Forwarding)**: 1) *Process Switching (Chuyển mạch bằng CPU)*: Mọi gói tin đều bắt CPU tra bảng định tuyến từng dòng — rất chậm; 2) *Fast Switching*: Gói đầu tiên do CPU tra, các gói sau lưu vào bộ nhớ đệm (Route Cache); 3) **CEF (Cisco Express Forwarding — Mặc định trên mọi Router/Switch L3 Cisco hiện đại)**: Sao chép sẵn toàn bộ bảng định tuyến và bảng ARP xuống thẳng chip phần cứng ASIC thành 2 bảng **FIB (Forwarding Information Base)** và **Adjacency Table**, giúp Router phóng gói tin đi ngay ở tốc độ phần cứng mà không cần làm phiền CPU!",
                                  "Mở rộng Nâng cao 3 — Cân bằng tải đường đi chi phí bằng nhau (ECMP - Equal-Cost Multi-Path Routing): Điều gì xảy ra nếu trong bảng định tuyến của Router có **2 tuyến đường khác nhau cùng dẫn tới 1 mạng đích** với cùng độ ưu tiên (AD) và cùng chi phí (Metric)? Thay vì bỏ phí một đường, Router Cisco tự động kích hoạt cơ chế **ECMP (Load Balancing)**: chia đều các luồng gói tin chạy song song qua cả 2 đường truyền cùng lúc, giúp nhân đôi băng thông và tự động dồn sang đường còn lại ngay lập tức nếu 1 đường bị đứt!"
                              ],
        "advancedTopics_en":  [
                                  "Advanced Expansion 1 — Static Routing vs. Dynamic Routing Protocols (OSPF, EIGRP, BGP): **Static Routes (`S`)** are manually configured by an admin (zero bandwidth overhead, full control, used for stub networks and default routes). **Dynamic Routing Protocols (`O` OSPF, `D` EIGRP, `B` BGP)** automatically exchange topology updates between routers and dynamically reroute traffic around failed links.",
                                  "Advanced Expansion 2 — Cisco Express Forwarding (CEF — FIB \u0026 Adjacency Tables): Modern Cisco routers and Layer 3 switches use **CEF** in hardware ASICs rather than slow CPU Process Switching. CEF pre-computes the routing table into a **FIB (Forwarding Information Base)** and pre-computes Layer 2 next-hop MAC headers into an **Adjacency Table** for wire-speed packet forwarding."
                              ]
    },
    {
        "id":  9,
        "title":  "IPv4 Address Resolution",
        "title_vi":  "Phân Giải Địa Chỉ ARP và ICMPv6 ND",
        "overview":  "Module 9 explains the critical link between Layer 3 logical IP addresses and Layer 2 physical MAC addresses. To put a packet onto an Ethernet wire, a device MUST know both the Destination IP address and the Destination MAC address. When a device knows the target IPv4 address but does not know the corresponding MAC address, it uses the **Address Resolution Protocol (ARP)**: broadcasting an **ARP Request** to `FFFF.FFFF.FFFF` and receiving a unicast **ARP Reply**. In IPv6, broadcast ARP is replaced by **ICMPv6 Neighbor Discovery Protocol (NDP)** using Neighbor Solicitation (NS) and Neighbor Advertisement (NA) multicast/unicast messages.",
        "overview_vi":  "Module 9 giải quyết một câu hỏi kinh điển trong mạng máy tính: Khi máy tính của bạn đã biết địa chỉ IP của người nhận (ví dụ `192.168.1.50`), làm sao nó tìm ra được **Địa chỉ vật lý MAC** của máy đó để đóng vào khung Frame Tầng 2? Câu trả lời trong mạng IPv4 chính là giao thức **ARP (Address Resolution Protocol)**, còn trong mạng IPv6 là giao thức **ICMPv6 Neighbor Discovery (ND)**. Bạn sẽ hiểu rõ 2 trường hợp phân giải địa chỉ (khi đích ở cùng mạng LAN và khi đích ở khác mạng LAN), quy trình la làng **ARP Request (Broadcast)** và trả lời riêng **ARP Reply (Unicast)**, bảng bộ nhớ đệm ARP Cache (`arp -a`), nguy cơ tấn công giả mạo **ARP Spoofing / ARP Poisoning**, và cách IPv6 dùng Solicited-Node Multicast thay cho Broadcast.",
        "analogy_vi":  "Giao thức ARP giống hệt việc bạn bước vào một hội trường 100 người, cầm trên tay một bức thư ghi tên \u0027Nguyễn Văn B\u0027 (đó là địa chỉ IP), nhưng bạn không biết mặt anh B đang ngồi ở chiếc ghế số mấy (đó là địa chỉ MAC). Bạn liền cầm micro phát loa cho cả hội trường cùng nghe (**ARP Request - Broadcast**): *\u0027Ai tên là Nguyễn Văn B làm ơn cho tôi xin số ghế!\u0027*. Cả 100 người đều nghe thấy, 99 người im lặng bỏ qua, chỉ duy nhất anh B nhắn tin riêng lại cho bạn (**ARP Reply - Unicast**): *\u0027Tôi là B đây, tôi ngồi ghế số 15 (MAC: BB-BB)!\u0027*. Bạn liền ghi vào sổ tay (**ARP Cache**) để lần sau gửi thẳng cho ghế 15 mà không cần bắc loa hỏi lại nữa!",
        "keyConcepts":  [
                            "Case 1: Destination IP is on the SAME Local Network: When PC1 (`192.168.1.10/24`) wants to send to PC2 (`192.168.1.20/24`), PC1 checks its ARP table for `192.168.1.20`. If missing, PC1 sends an ARP Request looking for the MAC address of **PC2 (`192.168.1.20`)**.",
                            "Case 2: Destination IP is on a REMOTE Network (Exam Trap!): When PC1 (`192.168.1.10/24`) wants to send a packet to Google (`8.8.8.8`), PC1 NEVER sends an ARP Request for `8.8.8.8` (because ARP broadcasts cannot cross routers!). Instead, PC1 checks its ARP table for its **Default Gateway (`192.168.1.1`)** and sends an ARP Request for the Router\u0027s LAN interface MAC address!",
                            "ARP Request (Broadcast) vs. ARP Reply (Unicast): 1) **ARP Request**: Encapsulated in an Ethernet Frame with Destination MAC `FF-FF-FF-FF-FF-FF` (Broadcast). The switch floods it out every port in the VLAN. 2) **ARP Reply**: Only the single device whose IP matches the Target IPv4 address responds with an ARP Reply frame sent via **Unicast** directly back to the requester\u0027s MAC address.",
                            "ARP Cache Timers \u0026 Commands: Both the sender and receiver record the IP-to-MAC mapping in their RAM ARP Table (`arp -a` on Windows, `show ip arp` on Cisco IOS). Dynamic ARP entries expire automatically (15–45 seconds on modern Windows; 4 hours / 240 minutes on Cisco IOS routers) to keep the table fresh if a NIC is replaced.",
                            "ARP Spoofing / Poisoning Attack: Because ARP has no built-in authentication, a hacker on the LAN can send fake (gratuitous) ARP Replies claiming *\u0027I am 192.168.1.1 (Default Gateway), send all traffic to my MAC address!\u0027*—intercepting all victim traffic in a Man-in-the-Middle (MitM) attack. Defended on Cisco switches using **Dynamic ARP Inspection (DAI)**.",
                            "IPv6 Neighbor Discovery (ICMPv6 ND — NS \u0026 NA): IPv6 completely eliminates Broadcasts! Instead of ARP, IPv6 uses ICMPv6 **Neighbor Solicitation (NS)** sent to a targeted **Solicited-Node Multicast** address (`FF02::1:FFxx:xxxx`, where `xx:xxxx` are the last 24 bits / 6 hex digits of the target\u0027s IPv6 address), and the target replies with a unicast **Neighbor Advertisement (NA)** containing its MAC address."
                        ],
        "keyConcepts_vi":  [
                               "Trường hợp 1 — Máy đích ở CÙNG mạng LAN: Khi PC1 (`192.168.1.10/24`) muốn gửi dữ liệu cho PC2 (`192.168.1.20/24`), PC1 dò trong bảng ARP Cache của mình xem đã có địa chỉ MAC của `192.168.1.20` chưa. Nếu chưa có, PC1 sẽ phát gói tin ARP hỏi xin địa chỉ MAC của chính **PC2 (`192.168.1.20`)**.",
                               "Trường hợp 2 — Máy đích ở KHÁC mạng LAN (Bẫy kinh điển trong đề thi CCNA!): Khi PC1 (`192.168.1.10/24`) muốn truy cập máy chủ `8.8.8.8` ngoài Internet, PC1 **KHÔNG BAO GIỜ hỏi ARP địa chỉ MAC của `8.8.8.8`** (vì gói Broadcast không thể đi qua Router!). Thay vào đó, PC1 sẽ hỏi ARP để tìm **Địa chỉ MAC của cổng Default Gateway (`192.168.1.1` - Router nội bộ)** rồi gửi Frame tới cho Router!",
                               "So sánh gói ARP Request và ARP Reply: • **ARP Request (Câu hỏi)**: Được đóng trong Frame có Destination MAC là **`FF-FF-FF-FF-FF-FF` (Broadcast)** để Switch nhân bản tới mọi máy trong mạng LAN cùng nghe. • **ARP Reply (Câu trả lời)**: Chỉ duy nhất máy nào sở hữu IP đang được hỏi mới lên tiếng trả lời bằng một Frame **Unicast** gửi đích danh về địa chỉ MAC của máy vừa hỏi.",
                               "Bảng nhớ tạm ARP Cache: Sau khi nhận được ARP Reply, máy tính lưu cặp `IP \u003c-\u003e MAC` vào bộ nhớ RAM gọi là bảng ARP Cache để các gói tin tiếp theo gửi đi ngay lập tức. Các dòng học tự động (Dynamic) sẽ tự xóa sau một khoảng thời gian (trên Windows khoảng 15–45 giây nếu không liên lạc; trên Router Cisco là 4 tiếng = 240 phút).",
                               "Tấn công Giả mạo ARP (ARP Spoofing / ARP Poisoning): Vì giao thức ARP quá ngây thơ (ai nói gì cũng tin, không có xác thực), kẻ tấn công ngồi chung mạng LAN có thể gửi gói ARP Reply giả mạo lừa cả phòng rằng: *\u0027IP 192.168.1.1 của Router hiện đang mang địa chỉ MAC của máy Hacker!\u0027*. Khi đó mọi máy tính đều gửi dữ liệu qua máy Hacker trước khi ra Internet (Tấn công nghe lén Man-in-the-Middle). Cách chống trên Switch Cisco: bật tính năng **Dynamic ARP Inspection (DAI)**.",
                               "Phân giải địa chỉ trong IPv6 (ICMPv6 ND thay thế hoàn toàn ARP): IPv6 không dùng ARP và không dùng Broadcast! Thay vào đó, IPv6 dùng cặp bản tin của giao thức ICMPv6 Neighbor Discovery (ND): Máy gửi phát gói **Neighbor Solicitation (NS)** tới địa chỉ Multicast nhóm nhỏ (`FF02::1:FFxx:xxxx` - chỉ đánh thức đúng máy có 6 số Hex cuối trùng khớp), và máy đích trả lời lại bằng gói **Neighbor Advertisement (NA)** dạng Unicast chứa địa chỉ MAC."
                           ],
        "realWorldExample":  "Scenario: PC1 (`192.168.10.10`, MAC `AA-AA`) pings PC2 (`192.168.10.20`, MAC `BB-BB`) for the first time.\n1. PC1 wants to send an ICMP Echo Request, but its ARP table is empty—it puts the ICMP packet on hold.\n2. PC1 sends an **ARP Request** frame: `Src MAC: AA-AA`, `Dst MAC: FF-FF-FF-FF-FF-FF` (Broadcast), Payload: *\u0027Target IP: 192.168.10.20, Target MAC: 00-00-00-00-00-00\u0027*.\n3. Switch S1 learns `AA-AA` on Port 1 and floods the broadcast out all other ports.\n4. PC2 (`192.168.10.20`) receives the ARP Request, adds `192.168.10.10 \u003c-\u003e AA-AA` to its own ARP table, and sends back a unicast **ARP Reply**: `Src MAC: BB-BB`, `Dst MAC: AA-AA`.\n5. PC1 receives the ARP Reply, records `192.168.10.20 \u003c-\u003e BB-BB` in its ARP table, and immediately transmits the held ICMP ping frame to `Dst MAC: BB-BB`!",
        "realWorldExample_vi":  "Ví dụ thực tế giải thích tại sao khi bạn gõ `ping` lần đầu tiên trong Cisco Packet Tracer thường bị rớt nhịp đầu tiên (`.!!!!` - Request timed out 1 cái rồi mới Reply 4 cái):\n• Giả sử PC1 (`192.168.10.10`, `MAC: AA-AA`) gõ lệnh `ping 192.168.10.20` (PC2, `MAC: BB-BB`).\n• **Bước 1**: PC1 tạo gói tin Ping (ICMP), nhưng khi xuống Tầng 2 để đóng khung Frame thì phát hiện chưa biết MAC của `192.168.10.20` là gì! Nó đành tạm giữ (hoặc hủy) gói Ping đầu tiên lại để đi hỏi ARP trước.\n• **Bước 2 (ARP Request - Broadcast)**: PC1 bắn ra gói ARP Request với `Src MAC = AA-AA`, `Dst MAC = FF-FF-FF-FF-FF-FF`, nội dung: *\u0027Ai có IP 192.168.10.20 cho xin địa chỉ MAC?\u0027*. Switch nhận được liền Flood ra khắp các cổng.\n• **Bước 3 (ARP Reply - Unicast)**: Chỉ có PC2 khớp IP nên trả lời gói ARP Reply đi thẳng về PC1: `Src MAC = BB-BB`, `Dst MAC = AA-AA`.\n• **Bước 4**: PC1 ghi ngay `192.168.10.20 = BB-BB` vào bảng `arp -a` của mình, rồi từ gói Ping thứ 2 trở đi cứ thế đóng thẳng `Dst MAC = BB-BB` phóng vèo vèo thành công 100%!",
        "diagramType":  "arp-process",
        "commands":  [
                         "C:\\\u003e arp -a                                # Xem bảng bộ nhớ đệm ARP Cache (ánh xạ IPv4 \u003c-\u003e MAC) trên máy tính Windows",
                         "C:\\\u003e arp -d *                              # Xóa sạch bảng ARP Cache trên Windows (cần mở CMD quyền Administrator)",
                         "Router# show ip arp                        # Xem bảng ARP trên Router hoặc Switch Cisco",
                         "Router# clear ip arp                       # Xóa làm mới bảng ARP trên Router Cisco",
                         "Router# show ipv6 neighbors                # Xem bảng Neighbor Discovery (ánh xạ IPv6 \u003c-\u003e MAC) thay thế cho ARP trong IPv6"
                     ],
        "comparisonTable":  {
                                "title_vi":  "Bảng So Sánh Toàn Diện Cơ Chế Phân Giải Địa Chỉ Giữa IPv4 (ARP) Và IPv6 (ICMPv6 ND)",
                                "headers_vi":  [
                                                   "Tiêu chí So sánh",
                                                   "Mạng IPv4 (Giao thức ARP)",
                                                   "Mạng IPv6 (Giao thức ICMPv6 Neighbor Discovery - NDP)"
                                               ],
                                "rows":  [
                                             [
                                                 "Bản tin Hỏi (Tìm MAC)",
                                                 "**ARP Request**",
                                                 "**ICMPv6 Neighbor Solicitation (NS)** (Type 135)"
                                             ],
                                             [
                                                 "Kiểu gửi Bản tin Hỏi",
                                                 "**Broadcast (`FF-FF-FF-FF-FF-FF`)** — Làm phiền tất cả mọi máy trong mạng LAN!",
                                                 "**Solicited-Node Multicast (`FF02::1:FFxx:xxxx` / MAC `33-33-FF-xx-xx-xx`)** — Chỉ đánh thức đúng máy có 6 số Hex cuối trùng khớp!"
                                             ],
                                             [
                                                 "Bản tin Trả lời (Cung cấp MAC)",
                                                 "**ARP Reply** (Unicast)",
                                                 "**ICMPv6 Neighbor Advertisement (NA)** (Type 136 - Unicast)"
                                             ],
                                             [
                                                 "Kiểm tra trùng IP (DAD)",
                                                 "Gratuitous ARP",
                                                 "Dùng chính bản tin **Neighbor Solicitation (NS)** tự hỏi IP của mình trước khi chính thức sử dụng."
                                             ],
                                             [
                                                 "Lệnh xem bảng ánh xạ trên Router",
                                                 "`Router# show ip arp`",
                                                 "`Router# show ipv6 neighbors`"
                                             ],
                                             [
                                                 "Lỗ hổng Bảo mật \u0026 Cách chống",
                                                 "Tấn công **ARP Spoofing / Poisoning** -\u003e Chống bằng **Dynamic ARP Inspection (DAI)** + **DHCP Snooping**.",
                                                 "Tấn công RA Spoofing / ND Spoofing -\u003e Chống bằng **IPv6 RA Guard** \u0026 **ND Inspection**."
                                             ]
                                         ]
                            },
        "jobSkills_vi":  [
                             "Kinh nghiệm Đi Làm 1 — Bộ đôi lá chắn chống ARP Spoofing trong mạng Doanh nghiệp (DHCP Snooping + Dynamic ARP Inspection): Trong thực tế, nếu chỉ bật Port-Security là chưa đủ để chặn hacker chạy phần mềm *Cain \u0026 Abel* hay *Ettercap* giả mạo ARP của Router. Kỹ sư mạng chuyên nghiệp cấu hình 2 lớp bảo vệ trên Switch: 1) Bật **`ip dhcp snooping`** (chỉ đánh dấu cổng cắm lên DHCP Server/Router là `ip dhcp snooping trust`, các cổng cắm xuống nhân viên là `untrusted` để Switch tự động ghi lại sổ danh bạ *DHCP Snooping Binding Database* xem máy nào được cấp IP nào); 2) Bật **`ip arp inspection vlan 10`** (Switch sẽ đối chiếu mọi gói ARP Reply với cuốn sổ DHCP Snooping — hễ máy nhân viên nào dám khai man IP của Router là Switch cắt đứt gói ARP giả đó ngay lập tức!).",
                             "Kinh nghiệm Đi Làm 2 — Bắt bệnh \u0027Xung đột Địa chỉ IP (IP Address Conflict)\u0027 bằng bảng ARP: Khi một nhân viên tự ý đặt IP tĩnh trùng với IP của sếp hoặc trùng với IP của Router (`192.168.1.1`) làm cả phòng rớt mạng chập chờn, làm sao tìm ra thủ phạm đang ngồi ở bàn nào? Bạn vào Switch gõ `show ip arp 192.168.1.1` để lấy được **Địa chỉ MAC của máy đặt trùng IP**, sau đó gõ tiếp `show mac address-table address \u003cMAC_đó\u003e` -\u003e Switch sẽ chỉ đích danh thủ phạm đang cắm ở cổng số mấy (ví dụ `Fa0/15`), bạn chỉ việc gõ `shutdown` cổng đó là xong!"
                         ],
        "quiz":  [
                     {
                         "question_vi":  "Câu 1 (Đề thi CCNA): Máy tính PC1 (`192.168.10.15/24`, Default Gateway `192.168.10.1`) cần gửi một gói tin đến máy chủ File Server có địa chỉ IP `192.168.20.100/24`. Bảng ARP Cache của PC1 hiện đang trống. PC1 sẽ gửi bản tin ARP Request để hỏi xin địa chỉ MAC của thiết bị nào?",
                         "options_vi":  [
                                            "A. Địa chỉ MAC của Switch S1",
                                            "B. Địa chỉ MAC của máy chủ File Server (`192.168.20.100`)",
                                            "C. Địa chỉ MAC của cổng Default Gateway (`192.168.10.1`)",
                                            "D. Không cần gửi ARP Request mà đóng gói gửi đi luôn"
                                        ],
                         "answerIndex":  2,
                         "explanation_vi":  "Đáp án đúng là C (`192.168.10.1`). Vì `192.168.20.100` nằm ở mạng khác với PC1 (`192.168.10.0/24`), PC1 biết rằng nó phải gửi khung tin tới Router nội bộ (Default Gateway) để nhờ định tuyến đi. Do đó PC1 sẽ phát ARP Request hỏi xin địa chỉ MAC của Default Gateway `192.168.10.1`, đóng vào Destination MAC của Frame (trong khi Destination IP ở Tầng 3 vẫn là `192.168.20.100`)."
                     },
                     {
                         "question_vi":  "Câu 2 (Đề thi CCNA): Trong mạng IPv6, khi một máy tính cần tìm địa chỉ vật lý MAC tương ứng với địa chỉ IPv6 của một máy khác trong cùng mạng LAN, nó sẽ sử dụng cơ chế nào?",
                         "options_vi":  [
                                            "A. Phát gói tin ARP Request dạng Broadcast tới `FFFF.FFFF.FFFF`.",
                                            "B. Gửi bản tin ICMPv6 Neighbor Solicitation (NS) tới địa chỉ Solicited-Node Multicast của máy đích.",
                                            "C. Hỏi máy chủ DNS để lấy bản ghi AAAA.",
                                            "D. Gửi bản tin DHCPv6 Discover."
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B. IPv6 đã loại bỏ hoàn toàn giao thức ARP và loại bỏ luôn kiểu truyền Broadcast. Thay vào đó, IPv6 sử dụng cặp bản tin ICMPv6 Neighbor Solicitation (NS - gửi tới địa chỉ Solicited-Node Multicast `FF02::1:FFxx:xxxx`) và nhận phản hồi qua Neighbor Advertisement (NA - gửi dạng Unicast)."
                     },
                     {
                         "question_vi":  "Câu 3 (Đề thi CCNA): Địa chỉ MAC đích nào được ghi trong phần Header Tầng 2 của một khung tin **ARP Request** và của một khung tin **ARP Reply**?",
                         "options_vi":  [
                                            "A. ARP Request dùng Unicast MAC; ARP Reply dùng Broadcast MAC `FF-FF-FF-FF-FF-FF`.",
                                            "B. Cả ARP Request và ARP Reply đều dùng Broadcast MAC `FF-FF-FF-FF-FF-FF`.",
                                            "C. ARP Request dùng Broadcast MAC `FF-FF-FF-FF-FF-FF`; còn ARP Reply dùng Unicast MAC của chính máy vừa hỏi.",
                                            "D. ARP Request dùng Multicast MAC `01-00-5E-00-00-01`."
                                        ],
                         "answerIndex":  2,
                         "explanation_vi":  "Đáp án đúng là C. Lúc đi hỏi (ARP Request) vì chưa biết MAC của đối phương nên phải gửi Broadcast (`FF-FF-FF-FF-FF-FF`) cho cả mạng LAN cùng nghe; nhưng lúc trả lời (ARP Reply), máy đích đã biết rõ MAC của người hỏi nên chỉ gửi Unicast trả lời riêng cho người hỏi."
                     }
                 ],
        "beginnerGuide_vi":  [
                                 "1. Tại sao máy tính đã biết Địa chỉ IP của người nhận rồi mà vẫn chưa gửi được dữ liệu đi ngay? Hãy nhớ quy tắc ở Module 3 và Module 7: Để đặt được dữ liệu lên sợi dây cáp mạng LAN đi qua chiếc Switch, bắt buộc phải đóng dữ liệu vào chiếc khung **Frame Tầng 2**, mà trên nhãn của Frame Tầng 2 bắt buộc phải ghi đầy đủ cả **Source MAC** và **Destination MAC**! Khổ nỗi, khi bạn gõ `ping 192.168.1.20`, máy tính của bạn mới chỉ biết con số **IP (`192.168.1.20`)** chứ hoàn toàn chưa biết chiếc máy đó mang **Địa chỉ MAC** là gì!",
                                 "2. Giao thức ARP (Address Resolution Protocol) giúp tìm Địa chỉ MAC như thế nào? Cực kỳ đơn giản qua 2 bước giống như hỏi thăm trong lớp học: • **Bước 1 (Hỏi cả phòng — ARP Request dạng Broadcast `FF-FF-FF-FF-FF-FF`)**: Máy bạn hét to lên cho toàn bộ các máy trong phòng LAN cùng nghe: *\u0027Này cả phòng ơi, ai đang giữ địa chỉ IP `192.168.1.20` thì cho tôi xin Địa chỉ MAC với!\u0027*. • **Bước 2 (Trả lời riêng — ARP Reply dạng Unicast)**: Tất cả các máy khác thấy không phải IP của mình thì im lặng, chỉ duy nhất máy `192.168.1.20` trả lời riêng lại cho máy bạn: *\u0027Tôi là `192.168.1.20` đây, địa chỉ MAC của tôi là `BB-BB-BB` nhé!\u0027*.",
                                 "3. Điều gì xảy ra nếu địa chỉ IP bạn muốn gửi tới nằm ở ngoài Internet (ví dụ `8.8.8.8` của Google)? Đây là điều người mới học hay nhầm nhất! Máy tính của bạn rất thông minh: nó nhìn `8.8.8.8` là biết ngay anh này ở ngoài Internet (khác mạng LAN với mình), có hét Broadcast khản cổ trong phòng LAN cũng không tới được Google! Vì vậy, máy tính sẽ dùng ARP để hỏi xin **Địa chỉ MAC của chiếc Router nội bộ (Default Gateway `192.168.1.1`)**, rồi giao gói tin cho Router chuyển đi tiếp!",
                                 "4. Chuyện gì xảy ra với Địa chỉ IP và Địa chỉ MAC khi gói tin đi qua nhiều Router trên Internet? Đây là câu hỏi kinh điển nhất của CCNA! Hãy nhớ quy tắc bất di bất dịch: • **Địa chỉ IP Nguồn và IP Đích (Tầng 3)**: **GIỮ NGUYÊN KHÔNG ĐỔI** từ lúc rời máy bạn cho đến tận máy chủ Google (trừ khi qua NAT biên). • **Địa chỉ MAC Nguồn và MAC Đích (Tầng 2)**: **THAY ĐỔI Ở MỖI TRẠM ROUTER (MỖI HOP)**! Tại mỗi chặng, MAC Nguồn luôn đổi thành MAC của cổng vừa gửi đi, còn MAC Đích luôn đổi thành MAC của trạm kế tiếp.",
                                 "5. Làm sao để tự tay xem bảng ARP trên máy tính Windows của bạn ngay lúc này? Bạn có thể mở cửa sổ **Command Prompt (cmd)** trên máy tính đang dùng và gõ lệnh \u0007rp -a. Bạn sẽ thấy ngay một danh sách gồm 2 cột: Cột bên trái là **Địa chỉ IPv4** của bộ phát Wi-Fi / Router nhà bạn (ví dụ 192.168.1.1), và cột ở giữa chính là **Địa chỉ vật lý MAC (12 số Hex)** mà máy tính của bạn vừa học được nhờ giao thức ARP!"
                             ],
        "beginnerGuide_en":  [
                                 "1. Why can\u0027t a PC send a packet over Ethernet using only an IP address? Because Ethernet switches operate at Layer 2 and only read **MAC addresses**! Before a PC can put an IPv4 packet onto the wire, it must wrap it in an Ethernet Frame containing a valid **Destination MAC address**.",
                                 "2. How ARP (Address Resolution Protocol) Works in 2 Steps: • **Step 1 (ARP Request — Broadcast `FF-FF-FF-FF-FF-FF`)**: The sender shouts to every device on the LAN: *\u0027Who has IP `192.168.1.20`? Tell me your MAC address!\u0027* • **Step 2 (ARP Reply — Unicast)**: Only the device owning `192.168.1.20` replies directly to the sender: *\u0027I am `192.168.1.20`, and my MAC address is `BB-BB-BB`!\u0027*",
                                 "3. What if the Destination IP is on a different network (like `8.8.8.8`)? Your PC NEVER broadcasts an ARP Request for `8.8.8.8`! Instead, it uses ARP to resolve the MAC address of its **Default Gateway (local router `192.168.1.1`)** and sends the frame to the router."
                             ],
        "advancedTopics_vi":  [
                                  "Mở rộng Nâng cao 1 — Công thức tính Địa chỉ Solicited-Node Multicast (`FF02::1:FFxx:xxxx`) trong IPv6 Neighbor Discovery: Trong IPv6 không còn Broadcast nên không dùng ARP. Khi máy A muốn tìm MAC của máy B có địa chỉ IPv6 là `2001:db8:acad:1::aa11:2233`, thay vì làm phiền cả 1.000 máy trong phòng như ARP Request, máy A lấy tiền tố cố định **`FF02::1:FF`** ghép với **6 chữ số Hex cuối cùng** của IPv6 máy B (`11:2233`) tạo thành địa chỉ Multicast đích **`FF02::1:FF11:2233`** (ánh xạ xuống MAC Tầng 2 là **`33-33-FF-11-22-33`**). Kết quả: Chỉ duy nhất card mạng của máy B lắng nghe nhóm đó nên 999 máy còn lại trong phòng không hề bị ngắt quãng CPU!",
                                  "Mở rộng Nâng cao 2 — Gratuitous ARP (GARP) dùng để làm gì trong thực tế? **Gratuitous ARP** là gói tin ARP mà một thiết bị tự phát Broadcast ngay khi nó vừa bật card mạng lên (với cả Source IP và Target IP đều là chính IP của nó!). Nó có 2 tác dụng lớn: 1) **Phát hiện trùng IP (IP Conflict Detection)**: Nếu có máy nào trả lời lại nghĩa là đã có người xài trùng IP đó rồi -\u003e Windows hiện bảng cảnh báo vàng *IP Address Conflict*; 2) **Cập nhật bảng MAC/ARP khi chuyển đổi dự phòng (HSRP/VRRP Failover)** giữa 2 Router!",
                                  "Mở rộng Nâng cao 3 — Proxy ARP và cơ chế chuyển mạch siêu tốc CEF (Cisco Express Forwarding): • **Proxy ARP**: Khi một máy trạm cấu hình sai Subnet Mask và tưởng rằng máy đích ở khác mạng nằm ngay trong LAN của mình, Router có thể đứng ra \u0027đóng thế\u0027 trả lời địa chỉ MAC của chính Router để cứu gói tin đó. • **CEF (Cisco Express Forwarding)**: Để không phải tra cứu bảng định tuyến và bảng ARP bằng phần mềm cho từng gói tin, Router Cisco kết hợp sẵn Bảng định tuyến (FIB) và Bảng ARP (Adjacency Table) ngay trong chip phần cứng ASIC, giúp chuyển tiếp hàng triệu gói tin mỗi giây!"
                              ],
        "advancedTopics_en":  [
                                  "Advanced Expansion 1 — How IPv6 Solicited-Node Multicast (`FF02::1:FFxx:xxxx`) Works: Instead of broadcasting to every host on the LAN like IPv4 ARP, IPv6 Neighbor Solicitation (NS) targets `FF02::1:FF` + the **last 24 bits (6 hex digits)** of the target\u0027s IPv6 address (mapped to Ethernet multicast MAC `33-33-FF-xx-xx-xx`), so other hosts on the LAN don\u0027t even have to process the interrupt.",
                                  "Advanced Expansion 2 — Gratuitous ARP (GARP): When a host or router interface comes up, it broadcasts an unprompted Gratuitous ARP asking for its own IP address to detect **duplicate IP conflicts** and update switches/hosts during HSRP/VRRP gateway failover."
                              ]
    },
    {
        "id":  10,
        "title":  "Basic Router Configuration",
        "title_vi":  "Cấu Hình Cơ Bản Thiết Bị Định Tuyến Router",
        "overview":  "Module 10 covers configuring a Cisco IOS Router from scratch to interconnect multiple LANs and WANs. While basic device hardening commands (hostname, passwords, banners, saving config) match those of a switch, configuring router interfaces has crucial differences: each router interface belongs to a **separate IP subnet** (each interface is its own broadcast domain), router interfaces are **administratively down (`shutdown`) by default**, and dual-stack routers require `ipv6 unicast-routing` to forward IPv6 packets. You also learn how to diagnose Layer 1 vs. Layer 2 interface states using `show ip interface brief`.",
        "overview_vi":  "Module 10 hướng dẫn cấu hình hoàn chỉnh một thiết bị Router Cisco từ lúc mới khởi động để kết nối các mạng LAN lại với nhau. Phần đặt tên, mật khẩu và lưu cấu hình trên Router giống hệt như trên Switch (Module 2), nhưng khi cấu hình các cổng mạng vật lý (như `GigabitEthernet 0/0/0`, `0/0/1`) trên Router thì có **3 sự khác biệt sống còn** so với Switch: 1) Mỗi cổng của Router là một mạng IP độc lập (không bao giờ được đặt 2 cổng của cùng 1 Router thuộc cùng 1 dải mạng con!); 2) Mặc định tất cả các cổng của Router đều bị **Tắt (`administratively down`)** — bắt buộc phải gõ lệnh `no shutdown` đèn cổng mới chuyển sang màu xanh lá; 3) Muốn Router định tuyến được gói tin IPv6, bắt buộc phải bật lệnh toàn cục `ipv6 unicast-routing`.",
        "analogy_vi":  "Nếu Switch là chiếc cầu nối các bàn làm việc trong cùng 1 phòng ban (mặc định cắm dây vào cổng Switch là đèn sáng chạy ngay), thì Router giống như Trạm Hải Quan Biên Giới nối giữa các quốc gia (các mạng con khác nhau): Mặc định mọi cửa khẩu trên Router đều đóng chặt cửa (`shutdown`), kỹ sư mạng phải đến từng cửa khẩu cấp biển số địa chỉ (`ip address` / `ipv6 address`) rồi ra lệnh mở cửa (`no shutdown`) thì dòng xe cộ giữa các mạng mới lưu thông được!",
        "keyConcepts":  [
                            "Switch Ports vs. Router Interfaces (Crucial Differences): 1) Switch ports are Layer 2 (no IP address assigned to physical ports) and are enabled (`no shutdown`) out of the box; 2) Router interfaces are Layer 3 routed ports—every active router interface requires its own IP address/mask on a unique subnet and is disabled (`shutdown`) by default until you run `no shutdown`.",
                            "Configuring Dual-Stack (IPv4 + IPv6) on a Router Interface: On each interface (e.g., `interface g0/0/0`), add a human-readable `description`, assign an IPv4 address (`ip address 192.168.10.1 255.255.255.0`), assign an IPv6 Global Unicast Address (`ipv6 address 2001:db8:acad:10::1/64`), configure a clean Link-Local Address (`ipv6 address fe80::1 link-local`), and activate the port with `no shutdown`.",
                            "Enabling IPv6 Routing (`ipv6 unicast-routing`): By default, a Cisco router forwards IPv4 packets automatically, but acts only as an IPv6 host! You MUST enter `ipv6 unicast-routing` in Global Configuration mode so the router forwards IPv6 packets between interfaces and sends ICMPv6 Router Advertisements (RAs).",
                            "Decoding `show ip interface brief` (`Status` vs. `Protocol` Columns): • **`Status` = Layer 1 (Physical)**: `administratively down` means someone forgot to type `no shutdown`; `down` means no cable is plugged in, bad cable, or the device on the other end is powered off; `up` means physical signal is detected. • **`Protocol` = Layer 2 (Data Link)**: `up` means Layer 2 keepalives/encapsulation match. An interface is only working when it shows **`Status: up` and `Protocol: up` (`up/up`)**!",
                            "Loopback Interfaces (`interface loopback 0`): A virtual software-only interface inside the router. As long as the router is powered on, a Loopback interface automatically stays `up/up` without needing any physical cable—used for simulating extra LAN networks in labs, device management, and OSPF Router IDs."
                        ],
        "keyConcepts_vi":  [
                               "3 Điểm khác biệt cốt lõi giữa Cổng Switch và Cổng Router: 1) Cổng vật lý của Switch chạy ở Tầng 2 (không gắn IP trực tiếp lên cổng `Fa0/1`) và mặc định **Mở sẵn (`up`)** khi cắm cáp; 2) Cổng của Router (`Gi0/0/0`, `Gi0/0/1`) chạy ở Tầng 3 — mỗi cổng bắt buộc phải gắn một địa chỉ IP thuộc một mạng con (Subnet) riêng biệt (nếu gắn 2 cổng trùng mạng nhau, Router sẽ báo lỗi `Overlaps with GigabitEthernet...`); 3) Mặc định mọi cổng vật lý của Router đều **Đóng (`administratively down`)**, phải gõ `no shutdown` mới chạy.",
                               "Cấu hình chạy song song IPv4 và IPv6 (Dual-Stack) trên cổng Router: Khi vào cổng `interface gigabitethernet 0/0/0`, quy trình chuẩn gồm 5 dòng: 1) Ghi chú cổng nối đi đâu (`description Link to LAN Phong Ke Toan`); 2) Gắn IPv4 (`ip address 192.168.10.1 255.255.255.0`); 3) Gắn IPv6 toàn cầu (`ipv6 address 2001:db8:acad:10::1/64`); 4) Gắn IPv6 nội bộ Link-Local cho dễ nhớ (`ipv6 address fe80::1 link-local`); 5) Mở cổng (`no shutdown`).",
                               "Lệnh bắt buộc cho IPv6 (`ipv6 unicast-routing`): Mặc định Router Cisco tự động định tuyến IPv4 ngay khi mở cổng, nhưng tính năng định tuyến IPv6 lại bị tắt! Bạn bắt buộc phải gõ lệnh `ipv6 unicast-routing` ở chế độ `Router(config)#` thì Router mới chịu chuyển tiếp gói tin IPv6 giữa các mạng.",
                               "Cách bắt bệnh mạng qua 2 cột `Status` và `Protocol` trong lệnh `show ip interface brief`: • Cột **`Status` đại diện cho Tầng 1 (Vật lý)**: Nếu hiện `administratively down` là do bạn quên gõ lệnh `no shutdown`; nếu hiện `down` là do tuột dây cáp, đứt cáp, bấm sai cáp thẳng/chéo hoặc thiết bị đầu bên kia chưa bật nguồn. • Cột **`Protocol` đại diện cho Tầng 2 (Data Link)**: Nếu `Status: up` mà `Protocol: down` là do lệch chuẩn đóng gói hoặc lỗi tốc độ/Duplex. Cổng chỉ hoạt động bình thường khi cả 2 cột cùng hiện **`up / up`**!",
                               "Giao diện ảo Loopback (`interface loopback 0`): Là cổng mạng ảo tạo bằng phần mềm bên trong Router, không cần cắm dây cáp thật mà trạng thái luôn luôn là `up/up` ngay khi tạo. Rất hay dùng trong phòng Lab để giả lập thêm các mạng LAN hoặc làm địa chỉ định danh cố định (Router-ID) cho giao thức OSPF."
                           ],
        "realWorldExample":  "Scenario: Router R1 connects two departments: Engineering LAN (`192.168.10.0/24` on `Gi0/0/0`) and Sales LAN (`192.168.20.0/24` on `Gi0/0/1`).\n1. You configure `Gi0/0/0` with IP `192.168.10.1 255.255.255.0` and `no shutdown` — this IP becomes the **Default Gateway** for all Engineering PCs.\n2. You configure `Gi0/0/1` with IP `192.168.20.1 255.255.255.0` and `no shutdown` — this IP becomes the **Default Gateway** for all Sales PCs.\n3. As soon as both ports are `up/up`, R1 automatically puts both `C 192.168.10.0/24` and `C 192.168.20.0/24` into its routing table and immediately routes traffic between Engineering (`192.168.10.10`) and Sales (`192.168.20.10`)!",
        "realWorldExample_vi":  "Ví dụ thực tế nối 2 phòng ban khác mạng nhau qua 1 chiếc Router R1:\nCông ty có Phòng Kỹ Thuật (Mạng `192.168.10.0/24`) cắm vào cổng `Gi0/0/0` của Router R1, và Phòng Kinh Doanh (Mạng `192.168.20.0/24`) cắm vào cổng `Gi0/0/1` của Router R1.\n• **Bước 1**: Vào cổng `Gi0/0/0` đặt IP `192.168.10.1 255.255.255.0` rồi gõ `no shutdown`. Địa chỉ `192.168.10.1` này chính là **Default Gateway** khai báo trên tất cả máy tính Phòng Kỹ Thuật.\n• **Bước 2**: Vào cổng `Gi0/0/1` đặt IP `192.168.20.1 255.255.255.0` rồi gõ `no shutdown`. Địa chỉ `192.168.20.1` này chính là **Default Gateway** khai báo trên tất cả máy tính Phòng Kinh Doanh.\n• **Bước 3**: Gõ `show ip interface brief` kiểm tra thấy cả 2 cổng đều hiện `Status: up` và `Protocol: up`. Ngay lập tức, máy tính Phòng Kỹ Thuật (`192.168.10.10`) có thể `ping 192.168.20.10` sang Phòng Kinh Doanh thông suốt nhờ Router R1 đứng giữa bắc cầu!",
        "diagramType":  "router-config",
        "commands":  [
                         "Router\u003e enable",
                         "Router# configure terminal",
                         "Router(config)# hostname R1",
                         "R1(config)# enable secret class",
                         "R1(config)# service password-encryption",
                         "R1(config)# ipv6 unicast-routing                           # Bật tính năng định tuyến gói tin IPv6 trên Router",
                         "R1(config)# interface gigabitethernet 0/0/0                # Vào cổng vật lý Gi0/0/0 nối xuống mạng LAN 10",
                         "R1(config-if)# description Connected to Engineering LAN-10 # Ghi chú mô tả cổng để dễ quản lý",
                         "R1(config-if)# ip address 192.168.10.1 255.255.255.0       # Gán IPv4 (đóng vai trò Default Gateway cho LAN 10)",
                         "R1(config-if)# ipv6 address 2001:db8:acad:10::1/64         # Gán IPv6 Global Unicast Address",
                         "R1(config-if)# ipv6 address fe80::1 link-local             # Gán IPv6 Link-Local Address làm Gateway IPv6",
                         "R1(config-if)# no shutdown                                 # Mở cổng (bật đèn cổng từ đỏ sang xanh lá)",
                         "R1(config-if)# exit",
                         "R1(config)# interface loopback 0                           # Tạo cổng ảo Loopback 0 để kiểm thử",
                         "R1(config-if)# ip address 10.0.0.1 255.255.255.255",
                         "R1(config-if)# end",
                         "R1# copy running-config startup-config                     # Lưu cấu hình vào NVRAM",
                         "R1# show ip interface brief                                # Kiểm tra nhanh IP và trạng thái Status/Protocol (up/up)",
                         "R1# show ipv6 interface brief                              # Kiểm tra nhanh các địa chỉ IPv6 trên từng cổng"
                     ],
        "comparisonTable":  {
                                "title_vi":  "Bảng Chẩn Đoán Trạng Thái Cổng Router Qua Lệnh `show ip interface brief`",
                                "headers_vi":  [
                                                   "Cột `Status` (Tầng 1 Vật Lý)",
                                                   "Cột `Protocol` (Tầng 2 Data Link)",
                                                   "Ý Nghĩa Trạng Thái",
                                                   "Nguyên Nhân Thực Tế \u0026 Cách Khắc Phục"
                                               ],
                                "rows":  [
                                             [
                                                 "**`up`**",
                                                 "**`up`**",
                                                 "**Hoạt động hoàn hảo (Operational)**",
                                                 "Cả tín hiệu vật lý Tầng 1 và giao thức đóng gói Tầng 2 đều thông suốt."
                                             ],
                                             [
                                                 "**`administratively down`**",
                                                 "**`down`**",
                                                 "Bị tắt bởi người quản trị",
                                                 "Cổng đang bị khóa bởi lệnh `shutdown` (mặc định trên Router). **Cách sửa**: Vào cổng gõ **`no shutdown`**."
                                             ],
                                             [
                                                 "**`down`**",
                                                 "**`down`**",
                                                 "Lỗi mất tín hiệu Vật lý (Tầng 1)",
                                                 "Chưa cắm dây cáp, dây cáp bị đứt, bấm sai chuẩn cáp thẳng/chéo, hoặc thiết bị ở đầu dây bên kia đang tắt nguồn / `shutdown`."
                                             ],
                                             [
                                                 "**`up`**",
                                                 "**`down`**",
                                                 "Tầng 1 có điện/ánh sáng, nhưng Tầng 2 không nói chuyện được",
                                                 "Lệch chuẩn đóng gói Tầng 2 giữa 2 đầu (ví dụ 1 đầu để PPP, 1 đầu để HDLC trên cổng Serial), sai tốc độ xung nhịp Clock rate, hoặc lỗi mất gói Keepalive."
                                             ]
                                         ]
                            },
        "jobSkills_vi":  [
                             "Kinh nghiệm Đi Làm 1 — Cấu hình Định tuyến Giữa các VLAN bằng 1 Cổng Router duy nhất (**Router-on-a-Stick / Inter-VLAN Routing**): Khi đi làm ở công ty có 5 phòng ban (5 VLAN: `VLAN 10, 20, 30, 40, 50`) nhưng con Router chỉ có đúng 2 cổng vật lý, làm sao làm Default Gateway cho cả 5 VLAN mà không cần mua 5 sợi dây cáp? Kỹ sư mạng dùng kỹ thuật **Router-on-a-Stick**: Chỉ nối **1 sợi cáp Trunk** từ Switch lên cổng `Gi0/0/0` của Router. Trên cổng `Gi0/0/0` của Router không đặt IP mà chỉ gõ `no shutdown`, sau đó chia cổng vật lý đó thành 5 **Cổng con ảo (Sub-interfaces)**: • `interface g0/0/0.10` -\u003e gõ `encapsulation dot1Q 10` -\u003e `ip address 192.168.10.1 255.255.255.0` • `interface g0/0/0.20` -\u003e gõ `encapsulation dot1Q 20` -\u003e `ip address 192.168.20.1 255.255.255.0`!",
                             "Kinh nghiệm Đi Làm 2 — Lệnh cứu mạng `do` khi đang đứng ở chế độ Config: Khi đang ở sâu trong `R1(config-if)#` mà muốn kiểm tra nhanh IP bằng lệnh `show ip interface brief` hoặc `ping`, bạn không cần gõ `exit` thoát ra ngoài! Chỉ cần thêm từ khóa **`do`** vào đằng trước bất kỳ lệnh kiểm tra nào: **`R1(config-if)# do show ip interface brief`** hoặc **`R1(config-if)# do copy run start`**!"
                         ],
        "quiz":  [
                     {
                         "question_vi":  "Câu 1 (Đề thi CCNA): Khi kỹ sư mạng gõ lệnh `show ip interface brief` trên Router R1, cổng `GigabitEthernet0/0/1` hiển thị trạng thái `Status: administratively down` và `Protocol: down`. Nguyên nhân chính xác là gì?",
                         "options_vi":  [
                                            "A. Dây cáp mạng cắm vào cổng Gi0/0/1 bị đứt.",
                                            "B. Thiết bị Switch ở đầu bên kia của sợi cáp đang bị mất điện.",
                                            "C. Cổng Gi0/0/1 đang bị tắt về mặt cấu hình (chưa được gõ lệnh `no shutdown`).",
                                            "D. Cổng Gi0/0/1 bị đặt trùng địa chỉ IP với một cổng khác."
                                        ],
                         "answerIndex":  2,
                         "explanation_vi":  "Đáp án đúng là C. Cụm từ `administratively down` luôn luôn có nghĩa là cổng đó đang có lệnh `shutdown` trong cấu hình (trạng thái mặc định của mọi cổng Router Cisco). Chỉ cần vào `interface g0/0/1` và gõ `no shutdown` (nếu đã cắm cáp hợp lệ), cổng sẽ chuyển sang `up / up`."
                     },
                     {
                         "question_vi":  "Câu 2 (Đề thi CCNA): Điều gì sẽ xảy ra nếu bạn cố tình cấu hình cổng `Gi0/0/0` của Router R1 với địa chỉ IP `192.168.1.1 255.255.255.0` và cổng `Gi0/0/1` của cùng Router R1 đó với địa chỉ IP `192.168.1.2 255.255.255.0`?",
                         "options_vi":  [
                                            "A. Hai cổng sẽ tự động gộp băng thông lại với nhau.",
                                            "B. Hệ điều hành Cisco IOS sẽ từ chối và báo lỗi `192.168.1.0 overlaps with GigabitEthernet0/0/0` vì mỗi cổng trên Router bắt buộc phải thuộc một mạng con (Subnet) khác nhau.",
                                            "C. Router sẽ hoạt động giống như một chiếc Switch Layer 2.",
                                            "D. Cổng Gi0/0/0 sẽ tự động bị xóa IP."
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B. Chức năng của Router là định tuyến giữa các mạng KHÁC NHAU. Nếu hai cổng trên cùng một Router thuộc cùng một mạng con (`192.168.1.0/24`), bảng định tuyến sẽ không biết đẩy gói tin đi cổng nào, do đó Cisco IOS chặn ngay và báo lỗi `Overlaps with...`."
                     },
                     {
                         "question_vi":  "Câu 3 (Đề thi CCNA): Ngoài việc gán địa chỉ IPv6 và mở cổng bằng `no shutdown`, câu lệnh toàn cục nào BẮT BUỘC phải được gõ trên Router Cisco để nó có thể định tuyến các gói tin IPv6 giữa các mạng và phát bản tin Router Advertisement (RA)?",
                         "options_vi":  [
                                            "A. `Router(config)# ip routing`",
                                            "B. `Router(config)# ipv6 unicast-routing`",
                                            "C. `Router(config)# service ipv6-enable`",
                                            "D. `Router(config-if)# ipv6 enable`"
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B (`ipv6 unicast-routing`). Mặc định trên Cisco IOS, tính năng định tuyến IPv4 được bật sẵn, nhưng định tuyến IPv6 lại bị tắt; do đó phải gõ lệnh `ipv6 unicast-routing` ở chế độ Global Configuration."
                     }
                 ],
        "beginnerGuide_vi":  [
                                 "1. Hình dung thực tế một chiếc Router Cisco ngoài đời khác gì với chiếc Switch? • **Switch** có rất nhiều cổng (24 hoặc 48 cổng RJ-45 xếp sát nhau) để cắm máy tính trong cùng 1 mạng LAN. • **Router** chỉ có **rất ít cổng** (thường chỉ có 2 đến 4 cổng GigabitEthernet ký hiệu là `Gi0/0/0`, `Gi0/0/1`... cộng thêm khe cắm mở rộng cáp quang/WAN), bởi vì **mỗi cổng của Router đại diện cho cả một mạng LAN hoặc một đường truyền WAN riêng biệt**!",
                                 "2. Tại sao cắm dây mạng từ Switch lên Router trong phần mềm Cisco Packet Tracer (hoặc ngoài đời) thấy đèn cổng vẫn đỏ lòm không sáng? Đừng hoảng! Trên Switch thì các cổng mặc định được bật sẵn, nhưng **trên Router thì tất cả các cổng mặc định đều bị khóa tắt (`shutdown`) vì lý do an ninh**! Bạn phải vào từng cổng của Router, gắn cho nó một địa chỉ IP (`ip address 192.168.10.1 255.255.255.0`) rồi gõ câu thần chú mở cửa **`no shutdown`** thì đèn mới chuyển sang màu xanh lá!",
                                 "3. Tại sao địa chỉ IP gắn trên cổng của Router (`192.168.10.1`) lại quan trọng đến vậy? Bởi vì địa chỉ IP của cổng Router nối xuống phòng ban nào chính là địa chỉ **Default Gateway** mà tất cả các máy tính PC và Switch trong phòng ban đó phải khai báo để đi ra ngoài!",
                                 "4. Tại sao cổng của Switch cắm dây vào là đèn sáng xanh ngay, còn cổng của Router cắm dây vào đèn vẫn tắt tối om? • Trên **Switch**: Các cổng mạng mặc định được mở sẵn (\no shutdown) để nhân viên cắm máy tính vào là dùng được ngay. • Trên **Router**: Mỗi cổng là một cánh cửa biên giới nối sang một mạng hoàn toàn khác. Để đảm bảo an toàn và tránh định tuyến nhầm khi chưa cấu hình xong, Cisco thiết kế mọi cổng Router mặc định ở trạng thái **Khóa quản trị (\u0007dministratively down)**. Kỹ sư bắt buộc phải vào cổng đó gõ lệnh \no shutdown thì đèn vật lý mới bật sáng xanh!",
                                 "5. Tác dụng của Giao diện Ảo Loopback (interface loopback 0) trên Router là gì? Ngoài các cổng cắm dây vật lý (như Gi0/0/0), kỹ sư mạng thường tạo thêm các cổng ảo bằng phần mềm gọi là **Loopback**. Cổng vật lý có thể bị tắt (down) nếu tuột dây cáp, nhưng **cổng Loopback là cổng phần mềm nên luôn luôn sống (up/up) 100%** chừng nào Router còn bật điện! Vì vậy, địa chỉ IP của cổng Loopback thường được dùng làm địa chỉ định danh cố định (Router ID trong OSPF) hoặc dùng để kiểm tra kết nối quản trị từ xa."
                             ],
        "beginnerGuide_en":  [
                                 "1. How does a physical Cisco Router look different from a Switch? A Switch has 24 or 48 ports to connect many PCs in one LAN. A Router has only a few routed ports (e.g., `Gi0/0/0`, `Gi0/0/1`), because **each port on a Router connects an entire separate network/subnet**!",
                                 "2. Why are the link lights red when you first plug a cable into a Router? Unlike switch ports (which are active by default), **all router interfaces are `shutdown` (administratively down) by default**! You must configure an IP address on the interface and type **`no shutdown`** to turn the port green.",
                                 "3. Why is the Router\u0027s LAN interface IP so important? Because the IP address configured on the router\u0027s LAN port (e.g., `192.168.10.1`) IS the **Default Gateway** address that you must configure on every PC and Layer 2 Switch in that LAN!"
                             ],
        "advancedTopics_vi":  [
                                  "Mở rộng Nâng cao 1 — Định tuyến giữa các VLAN bằng kỹ thuật \u0027Router-on-a-Stick\u0027 (Cấu hình Sub-interfaces `g0/0/0.10`): Khi công ty chia Switch thành nhiều VLAN (ví dụ `VLAN 10` Kế toán và `VLAN 20` Nhân sự), hai VLAN này bị cô lập hoàn toàn ở Tầng 2. Muốn chúng gửi file cho nhau được thì phải đi qua Router ở Tầng 3. Thay vì tốn 2 sợi cáp cắm vào 2 cổng của Router, kỹ sư chỉ cắm **1 sợi cáp Trunk duy nhất** lên cổng `Gi0/0/0` của Router, rồi dùng lệnh tạo cổng con ảo: `interface g0/0/0.10` (`encapsulation dot1Q 10`, IP `192.168.10.1/24`) và `interface g0/0/0.20` (`encapsulation dot1Q 20`, IP `192.168.20.1/24`)!",
                                  "Mở rộng Nâng cao 2 — Giao thức Dự phòng Cổng Mặc Định HSRP (Hot Standby Router Protocol): Nếu cả công ty 500 máy tính đều trỏ Default Gateway về duy nhất 1 con Router R1 (`192.168.10.1`), lỡ R1 bị cháy nguồn thì cả công ty mất mạng! Trong thực tế doanh nghiệp, kỹ sư đặt **2 con Router R1 (`.2`) và R2 (`.3`)** chạy giao thức **HSRP** cùng tạo ra một **IP Gateway Ảo chung là `192.168.10.1`**: Bình thường R1 làm *Active* chuyển gói tin, R2 làm *Standby* đứng trực; hễ R1 tắt thở là R2 tự động nhảy lên giữ IP ảo `192.168.10.1` trong tích tắc mà 500 máy tính không hề hay biết!",
                                  "Mở rộng Nâng cao 3 — Giao thức Dự phòng Cổng Mặc Định (FHRP - HSRP / VRRP): Trong mạng doanh nghiệp, mọi máy tính đều trỏ Default Gateway về địa chỉ IP của Router R1 (ví dụ 192.168.1.1). Nhưng nếu chiếc Router R1 bị cháy nguồn thì cả công ty mất Internet dù có sẵn chiếc Router R2 dự phòng bên cạnh! Để giải quyết, kỹ sư cấu hình giao thức **HSRP (Hot Standby Router Protocol)** của Cisco: cả 2 Router R1 và R2 cùng chia sẻ một **Địa chỉ IP Ảo (Virtual IP .1.1)**. Nếu R1 chết, R2 lập tức tiếp quản địa chỉ .1.1 trong chưa đầy 1 giây mà không cần sửa cài đặt trên bất kỳ máy tính nào!"
                              ],
        "advancedTopics_en":  [
                                  "Advanced Expansion 1 — Inter-VLAN Routing via \u0027Router-on-a-Stick\u0027 (802.1Q Sub-interfaces): Instead of using a separate physical router port for every VLAN, engineers run a single 802.1Q Trunk link to `Gi0/0/0` and create logical sub-interfaces (`interface g0/0/0.10` with `encapsulation dot1Q 10`, `interface g0/0/0.20` with `encapsulation dot1Q 20`).",
                                  "Advanced Expansion 2 — First Hop Redundancy Protocol (HSRP — Hot Standby Router Protocol): To prevent the Default Gateway router from being a single point of failure, two routers share a **Virtual IP and Virtual MAC address** using Cisco HSRP (`standby 1 ip 192.168.10.1`). If the Active router fails, the Standby router takes over seamlessly."
                              ]
    },
    {
        "id":  11,
        "title":  "IPv4 Addressing",
        "title_vi":  "Địa Chỉ IPv4 và Chia Mạng Con (Subnetting \u0026 VLSM)",
        "overview":  "Module 11 is one of the most important exam topics in CCNA: IPv4 Addressing and Subnetting (both Fixed-Length Subnet Masking and Variable-Length Subnet Masking / VLSM). Every 32-bit IPv4 address consists of a **Network Portion** (identified by `1`s in the Subnet Mask) and a **Host Portion** (identified by `0`s in the Subnet Mask). You will master Public vs. Private RFC 1918 addresses, Special-Use addresses (Loopback `127.0.0.1`, APIPA `169.254.x.x`), Classful A/B/C ranges, the Magic Number (Block Size) method for instant subnet calculation, and how to design VLSM schemes from largest to smallest subnet without wasting IPs.",
        "overview_vi":  "Module 11 là chuyên đề trọng tâm nhất trong mọi kỳ thi CCNA và phỏng vấn Kỹ sư mạng: **Địa chỉ IPv4 và Kỹ thuật Chia Mạng Con (Subnetting \u0026 VLSM)**. Một địa chỉ IPv4 dài 32-bit luôn gồm 2 phần: **Phần Mạng (Network Portion)** ứng với các bit `1` của Subnet Mask, và **Phần Máy Trạm (Host Portion)** ứng với các bit `0` của Subnet Mask. Tại đây bạn sẽ nắm trọn vẹn: Dải IP Private (RFC 1918) và IP Public, các địa chỉ đặc biệt (`127.0.0.1`, `169.254.x.x`), các lớp địa chỉ A/B/C, và đặc biệt là **Phương pháp Bước nhảy (Magic Number / Block Size)** giúp bạn giải bất kỳ bài toán chia Subnet hay VLSM nào chỉ trong 15 giây!",
        "analogy_vi":  "Chia mạng con (Subnetting) giống như việc bạn được giao quản lý một tòa chung cư lớn có 256 căn hộ (Mạng `/24` từ `.0` đến `.255`). Nếu để cả 256 hộ dùng chung 1 sảnh thang máy và 1 loa thông báo (1 Broadcast Domain duy nhất) thì sẽ cực kỳ ồn ào, hỗn loạn và mất an ninh. Thay vì vậy, bạn mượn thêm vài bit để ngăn tòa nhà thành 4 tầng riêng biệt (chia thành 4 mạng con `/26`, mỗi tầng 64 căn hộ):Ở mỗi tầng đều phải dành riêng căn đầu tiên làm **Biển tên tầng (Network Address)** và căn cuối cùng làm **Loa phát thanh chung của tầng (Broadcast Address)**, các căn ở giữa mới được phát cho cư dân ở (**Usable Host IP** — đó là lý do công thức tính số máy luôn phải **trừ đi 2**: $2^h - 2$)!",
        "keyConcepts":  [
                            "Three Addresses in Every Subnet (Network, Usable Hosts, Broadcast): 1) **Network Address** (All host bits = `0`, ALWAYS an even number): identifies the subnet itself; cannot be assigned to a PC. 2) **First Usable Host** = Network Address `+ 1`. 3) **Broadcast Address** (All host bits = `1`, ALWAYS an odd number, equal to Next Subnet `- 1`): sends to all hosts in that subnet; cannot be assigned to a PC. 4) **Last Usable Host** = Broadcast Address `- 1`.",
                            "RFC 1918 Private IPv4 Ranges (Free for Internal LANs, Require NAT for Internet): Must memorize for CCNA: • **Class A Private**: `10.0.0.0/8` (`10.0.0.0` to `10.255.255.255`); • **Class B Private**: `172.16.0.0/12` (`172.16.0.0` to `172.31.255.255`); • **Class C Private**: `192.168.0.0/16` (`192.168.0.0` to `192.168.255.255`).",
                            "Special IPv4 Addresses: • **Loopback (`127.0.0.0/8`, commonly `127.0.0.1`)**: Redirects traffic back inside the local host to test if TCP/IP is working. • **Link-Local / APIPA (`169.254.0.0/16`)**: Automatically self-assigned by Windows when a DHCP client cannot reach any DHCP server! If you see `169.254.x.x` on a PC, DHCP has failed.",
                            "Two Core Subnetting Formulas: When you borrow $n$ bits from the host portion and leave $h$ host bits remaining: • **Number of Subnets Created = $2^n$** • **Number of Usable Hosts per Subnet = $2^h - 2$** (subtracting 1 for the Network ID and 1 for the Broadcast address).",
                            "The \u0027Magic Number\u0027 (Block Size) Fast Method: In the octet where the subnet mask is not 255 or 0, **Block Size = $256 - \\text{Subnet Mask Value}$** (or simply the positional value of the last `1` bit in the mask). Subnets always increment by this exact Block Size starting from `0`!",
                            "VLSM (Variable-Length Subnet Masking — Subnetting a Subnet): Traditional subnetting makes every subnet the exact same size, wasting IPs (e.g., giving a 2-router WAN link a `/24` wastes 252 IPs!). VLSM solves this by sorting departments from **LARGEST host requirement down to SMALLEST** (always allocate `/30` = 2 usable hosts last for point-to-point router WAN links)."
                        ],
        "keyConcepts_vi":  [
                               "3 Loại địa chỉ bắt buộc phải xác định trong mọi Mạng con (Subnet): 1) **Địa chỉ Mạng (Network Address)**: Khi toàn bộ các bit phần Host bằng `0` (luôn là số chẵn) — dùng làm tên đại diện cho mạng đó, **tuyệt đối không được gán cho PC hay Router**; 2) **Địa chỉ Quảng bá (Broadcast Address)**: Khi toàn bộ các bit phần Host bằng `1` (luôn là số lẻ, bằng Địa chỉ mạng kế tiếp trừ đi `1`) — dùng để gửi cho tất cả máy trong mạng con đó, **cũng không được gán cho PC**; 3) **Dải IP gán được cho thiết bị (Usable Hosts)**: Nằm từ `(Địa chỉ Mạng + 1)` đến `(Địa chỉ Broadcast - 1)`.",
                               "3 Dải Địa chỉ IP Private (RFC 1918 — Bắt buộc thuộc lòng): Dùng miễn phí trong mạng LAN nội bộ, không định tuyến trực tiếp trên Internet (khi ra Internet sẽ được Router biên dịch sang IP Public qua công nghệ NAT): • **10.0.0.0/8** (`10.0.0.0` -\u003e `10.255.255.255`); • **172.16.0.0/12** (`172.16.0.0` -\u003e `172.31.255.255`); • **192.168.0.0/16** (`192.168.0.0` -\u003e `192.168.255.255`).",
                               "Các dải IPv4 đặc biệt hay gặp khi sửa lỗi mạng: • **Loopback (`127.0.0.0/8`, hay dùng `127.0.0.1`)**: Địa chỉ tự vòng lại chính mình để kiểm tra phần mềm TCP/IP trên máy. • **APIPA / Link-Local (`169.254.0.0/16`)**: Khi máy tính để chế độ nhận IP động (DHCP) nhưng bị đứt cáp hoặc máy chủ DHCP bị sập, Windows sẽ tự động gán đại một IP `169.254.x.x` — hễ thấy IP `169.254...` là biết ngay lỗi không xin được DHCP!",
                               "2 Công thức Vàng khi Chia Mạng Con (Subnetting): Giả sử bạn mượn thêm $n$ bit từ phần Host để chia mạng con, và số bit còn lại của phần Host là $h$ bit: • **Số mạng con tạo được = $2^n$** • **Số IP dùng được cho máy trạm trên mỗi mạng con = $2^h - 2$** (Trừ đi 2 địa chỉ đầu/cuối là Network ID và Broadcast). • **Bước nhảy (Block Size) = $256 - \\text{Giá trị Octet lẻ của Subnet Mask}$** (hoặc bằng chính giá trị cột của bit `1` cuối cùng).",
                               "Chia mạng con có độ dài thay đổi (VLSM — Variable Length Subnet Mask): Nếu chia đều (FLSM), một đường nối trực tiếp giữa 2 Router chỉ cần đúng **2 địa chỉ IP** nhưng lại phải cấp cả một mạng lớn sẽ gây lãng phí cực kỳ nghiêm trọng. Với **VLSM** (chia nhỏ tiếp một mạng con đã chia), quy tắc bất di bất dịch là: **Luôn chia cho phòng ban có SỐ LƯỢNG MÁY LỚN NHẤT TRƯỚC, rồi giảm dần xuống nhỏ nhất** (đường nối 2 Router Point-to-Point luôn chia cuối cùng với chuẩn `/30` có đúng $2^2 - 2 = 2$ IP sử dụng!)."
                           ],
        "realWorldExample":  "Step-by-Step Subnetting \u0026 VLSM Worked Example:\n**Problem**: You have `192.168.1.0/24`. Find the subnet details for host `192.168.1.150/26`, and then design VLSM for: Sales (50 hosts), IT (20 hosts), and Router WAN Link (2 hosts).\n\n**Part A: Analyzing `192.168.1.150/26`**:\n1. `/26` means 26 `1` bits: `255.255.255.192` (2 bits borrowed in the 4th octet: `n=2`, remaining host bits `h = 32 - 26 = 6`).\n2. Subnets = $2^2 = 4$ subnets. Usable hosts per subnet = $2^6 - 2 = 64 - 2 = 62$ hosts.\n3. Block Size (Magic Number) = $256 - 192 = 64$. The 4 subnets start at: `.0`, `.64`, `.128`, `.192`.\n4. Where does `.150` fall? Between `.128` and `.192`! Therefore:\n   - **Network Address**: `192.168.1.128/26`\n   - **First Usable Host**: `192.168.1.129`\n   - **Last Usable Host**: `192.168.1.190`\n   - **Broadcast Address**: `192.168.1.191` (1 less than next subnet `.192`).\n\n**Part B: VLSM Allocation from `192.168.1.0/24` (Largest to Smallest)**:\n• **1. Sales (Needs 50 hosts)**: $2^6 - 2 = 62 \\ge 50 \\rightarrow h=6 \\rightarrow$ Prefix **`/26`** (Block 64): `192.168.1.0/26` (Hosts `.1`–`.62`, Broadcast `.63`).\n• **2. IT (Needs 20 hosts)**: Start at `.64`. $2^5 - 2 = 30 \\ge 20 \\rightarrow h=5 \\rightarrow$ Prefix **`/27`** (Block 32): `192.168.1.64/27` (Hosts `.65`–`.94`, Broadcast `.95`).\n• **3. WAN Link (Needs 2 hosts)**: Start at `.96`. $2^2 - 2 = 2 \\ge 2 \\rightarrow h=2 \\rightarrow$ Prefix **`/30`** (Block 4): `192.168.1.96/30` (Hosts `.97`–`.98`, Broadcast `.99`).",
        "realWorldExample_vi":  "Bài tập mẫu Giải Chi Tiết Từng Bước (Dạng bài chắc chắn gặp khi thi CCNA):\n**Đề bài**: Cho mạng gốc `192.168.1.0/24`. Hãy thiết kế chia mạng VLSM cho 3 nhu cầu: **Phòng Kinh Doanh (cần 50 máy)**, **Phòng IT (cần 20 máy)**, và **Đường nối WAN giữa 2 Router R1-R2 (cần 2 IP)**.\n\n**Lời giải từng bước (Nguyên tắc vàng: Chia từ LỚN NHẤT xuống NHỎ NHẤT)**:\n1. **Phòng Kinh Doanh (Cần 50 IP)**:\n   - Tìm số bit Host $h$ sao cho $2^h - 2 \\ge 50 \\Rightarrow 2^6 - 2 = 62 \\ge 50 \\Rightarrow$ Cần giữ lại **$h = 6$ bit Host**.\n   - Prefix mới = $32 - 6 = $ **`/26`** (Subnet Mask: `255.255.255.192`). Bước nhảy = $2^6 = 64$.\n   - **Mạng Kinh Doanh**: **`192.168.1.0/26`** | IP dùng được: **`.1` đến `.62`** | Broadcast: **`.63`**.\n\n2. **Phòng IT (Cần 20 IP — Bắt đầu lấy tiếp từ `.64`)**:\n   - Tìm $h$ sao cho $2^h - 2 \\ge 20 \\Rightarrow 2^5 - 2 = 30 \\ge 20 \\Rightarrow$ Cần giữ lại **$h = 5$ bit Host**.\n   - Prefix mới = $32 - 5 = $ **`/27`** (Subnet Mask: `255.255.255.224`). Bước nhảy = $2^5 = 32$.\n   - **Mạng Phòng IT**: **`192.168.1.64/27`** | IP dùng được: **`.65` đến `.94`** | Broadcast: **`.95`**.\n\n3. **Đường nối WAN R1-R2 (Cần 2 IP — Bắt đầu lấy tiếp từ `.96`)**:\n   - Tìm $h$ sao cho $2^h - 2 \\ge 2 \\Rightarrow 2^2 - 2 = 2 \\ge 2 \\Rightarrow$ Cần giữ lại **$h = 2$ bit Host**.\n   - Prefix mới = $32 - 2 = $ **`/30`** (Subnet Mask: `255.255.255.252`). Bước nhảy = $2^2 = 4$.\n   - **Mạng WAN R1-R2**: **`192.168.1.96/30`** | IP dùng được: **`.97` (gán cho R1) và `.98` (gán cho R2)** | Broadcast: **`.99`**.\n   *(Từ `.100` đến `.255` vẫn còn dư nguyên vẹn để dành mở rộng cho tương lai!)*",
        "diagramType":  "ipv4-subnetting",
        "commands":  [
                         "Công thức chia Subnet: Số mạng con = 2^n (n = số bit mượn) | Số IP khả dụng mỗi mạng = (2^h) - 2 (h = số bit 0 còn lại)",
                         "Bảng tra nhanh Subnet Mask Octet thứ 4 (/24 -\u003e /30):",
                         "  /24 = .0   (Bước nhảy 256 | 254 hosts)  |  /25 = .128 (Bước nhảy 128 | 126 hosts)",
                         "  /26 = .192 (Bước nhảy 64  | 62 hosts)   |  /27 = .224 (Bước nhảy 32  | 30 hosts)",
                         "  /28 = .240 (Bước nhảy 16  | 14 hosts)   |  /29 = .248 (Bước nhảy 8   | 6 hosts)",
                         "  /30 = .252 (Bước nhảy 4   | 2 hosts - Chuẩn vàng cho kết nối Point-to-Point giữa 2 Router)"
                     ],
        "comparisonTable":  {
                                "title_vi":  "Bảng Tra Cứu Tổng Hợp Chia Mạng Con IPv4 (CIDR `/16` Đến `/32`) Cho Đi Thi \u0026 Đi Làm",
                                "headers_vi":  [
                                                   "Prefix CIDR",
                                                   "Subnet Mask Đầy Đủ",
                                                   "Bước Nhảy (Block Size)",
                                                   "Số IP Khả Dụng ($2^h - 2$)",
                                                   "Ứng Dụng Thực Tế Chuẩn Doanh Nghiệp"
                                               ],
                                "rows":  [
                                             [
                                                 "**`/24`**",
                                                 "`255.255.255.0`",
                                                 "256 (Octet 4)",
                                                 "**254 hosts** ($2^8 - 2$)",
                                                 "Mạng LAN tiêu chuẩn cho 1 tầng lầu hoặc 1 VLAN văn phòng (100–200 nhân viên)."
                                             ],
                                             [
                                                 "**`/25`**",
                                                 "`255.255.255.128`",
                                                 "128 (`.0`, `.128`)",
                                                 "**126 hosts** ($2^7 - 2$)",
                                                 "Phòng ban quy mô lớn (60–120 nhân viên)."
                                             ],
                                             [
                                                 "**`/26`**",
                                                 "`255.255.255.192`",
                                                 "64 (`.0`, `.64`, `.128`, `.192`)",
                                                 "**62 hosts** ($2^6 - 2$)",
                                                 "Phòng ban quy mô vừa (30–60 nhân viên)."
                                             ],
                                             [
                                                 "**`/27`**",
                                                 "`255.255.255.224`",
                                                 "32 (`.0`, `.32`, `.64`, `.96`...)",
                                                 "**30 hosts** ($2^5 - 2$)",
                                                 "Phòng ban nhỏ (15–30 máy) hoặc VLAN Camera an ninh / Máy in."
                                             ],
                                             [
                                                 "**`/28`**",
                                                 "`255.255.255.240`",
                                                 "16 (`.0`, `.16`, `.32`, `.48`...)",
                                                 "**14 hosts** ($2^4 - 2$)",
                                                 "Vùng DMZ chứa cụm máy chủ Web/Mail hoặc phòng họp nhỏ."
                                             ],
                                             [
                                                 "**`/29`**",
                                                 "`255.255.255.248`",
                                                 "8 (`.0`, `.8`, `.16`, `.24`...)",
                                                 "**6 hosts** ($2^3 - 2$)",
                                                 "Đường kết nối WAN có chạy giao thức dự phòng HSRP/VRRP (cần 3–5 IP)."
                                             ],
                                             [
                                                 "**`/30`**",
                                                 "`255.255.255.252`",
                                                 "4 (`.0`, `.4`, `.8`, `.12`...)",
                                                 "**2 hosts** ($2^2 - 2$)",
                                                 "**Chuẩn vàng cho kết nối Điểm-nối-Điểm (Point-to-Point)** giữa 2 Router (tiết kiệm IP tối đa)."
                                             ],
                                             [
                                                 "**`/32`**",
                                                 "`255.255.255.255`",
                                                 "1 (Chỉ đúng 1 IP)",
                                                 "**1 host duy nhất**",
                                                 "Dùng cho cổng ảo **Loopback** trên Router và Host Route (`L` trong bảng định tuyến)."
                                             ]
                                         ]
                            },
        "jobSkills_vi":  [
                             "Kinh nghiệm Đi Làm 1 — Cấu hình Máy Chủ Cấp IP Động (DHCPv4 Server) Ngay Trên Router Cisco: Trong văn phòng chi nhánh nhỏ không có máy chủ Windows Server riêng, kỹ sư mạng cấu hình chính con Router Cisco làm máy chủ DHCP cấp IP cho toàn bộ nhân viên chỉ với 4 câu lệnh cực kỳ thực tế: 1) Giữ lại các IP đầu dành riêng cho Router/Switch/Server không đem cấp phát: `R1(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.9`; 2) Tạo bể cấp IP: `R1(config)# ip dhcp pool LAN_KE_TOAN`; 3) Khai báo dải mạng: `R1(dhcp-config)# network 192.168.10.0 255.255.255.0`; 4) Khai báo Default Gateway và DNS cho máy trạm: `default-router 192.168.10.1` và `dns-server 8.8.8.8`!",
                             "Kinh nghiệm Đi Làm 2 — Lệnh cứu cánh `ip helper-address` (DHCP Relay Agent) khi máy chủ DHCP nằm ở mạng khác: Như bạn đã học, gói tin xin IP `DHCP Discover` là gói **Broadcast (`255.255.255.255`)** nên khi chạm vào Router sẽ bị Router chặn lại ngay! Vậy nếu công ty có 10 VLAN mà chỉ đặt 1 máy chủ DHCP tập trung tại Phòng Server (`192.168.99.10`), làm sao các phòng ban khác xin được IP? Kỹ sư mạng chỉ cần vào cổng Gateway của từng phòng ban trên Router và gõ: **`R1(config-if)# ip helper-address 192.168.99.10`** -\u003e Router sẽ tự động đón gói Broadcast DHCP và biến nó thành gói **Unicast** chuyển thẳng tới máy chủ DHCP `192.168.99.10`!",
                             "Kinh nghiệm Đi Làm 3 — Dịch địa chỉ IP Private ra Internet bằng NAT Overload (PAT): Vì 3 dải IP Private (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) bị các Router ngoài Internet chặn không cho đi, trên Router biên nối ra nhà mạng ISP bạn phải cấu hình **PAT (Port Address Translation / NAT Overload)** để cho hàng trăm máy tính nội bộ dùng chung **1 địa chỉ IP Public duy nhất** đi ra Internet bằng cách phân biệt qua số hiệu Port!"
                         ],
        "quiz":  [
                     {
                         "question_vi":  "Câu 1 (Đề thi CCNA): Máy tính PC1 có địa chỉ IP là `172.16.10.65/26`. Hãy xác định **Địa chỉ Mạng (Network Address)** và **Địa chỉ Quảng bá (Broadcast Address)** của mạng con chứa máy tính PC1 này:",
                         "options_vi":  [
                                            "A. Network: `172.16.10.0` — Broadcast: `172.16.10.127`",
                                            "B. Network: `172.16.10.64` — Broadcast: `172.16.10.127`",
                                            "C. Network: `172.16.10.64` — Broadcast: `172.16.10.95`",
                                            "D. Network: `172.16.10.32` — Broadcast: `172.16.10.95`"
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B. Với `/26`, số bit Host còn lại là $h = 32 - 26 = 6$ bit $\\Rightarrow$ Bước nhảy (Block Size) ở Octet thứ 4 là $2^6 = 64$. Các mạng con lần lượt bắt đầu tại: `.0`, `.64`, `.128`, `.192`. Vì PC1 là `.65` (nằm trong khoảng từ `.64` đến trước `.128`), nên Địa chỉ Mạng là **`172.16.10.64`**, Địa chỉ Broadcast là **`172.16.10.127`** (bằng mạng kế tiếp `.128` trừ đi 1), và chính PC1 (`.65`) là địa chỉ IP khả dụng đầu tiên trong mạng đó!"
                     },
                     {
                         "question_vi":  "Câu 2 (Đề thi CCNA): Một kỹ sư mạng cần cấu hình địa chỉ IPv4 cho kết nối WAN Điểm-nối-Điểm (Point-to-Point) giữa hai thiết bị Router R1 và R2 sao cho tiết kiệm địa chỉ IP nhất mà vẫn đảm bảo chuẩn VLSM. Subnet Mask (hoặc Prefix) nào nên được chọn?",
                         "options_vi":  [
                                            "A. `/24` (`255.255.255.0`)",
                                            "B. `/28` (`255.255.255.240`)",
                                            "C. `/29` (`255.255.255.248`)",
                                            "D. `/30` (`255.255.255.252`)"
                                        ],
                         "answerIndex":  3,
                         "explanation_vi":  "Đáp án đúng là D (`/30` hay `255.255.255.252`). Với `/30`, số bit Host là $h = 32 - 30 = 2$ bit $\\Rightarrow$ Số IP khả dụng là $2^2 - 2 = 4 - 2 = 2$ IP — vừa khít 1 IP cho đầu Router R1 và 1 IP cho đầu Router R2 mà không lãng phí một địa chỉ nào!"
                     },
                     {
                         "question_vi":  "Câu 3 (Đề thi CCNA): Khi một nhân viên gõ lệnh `ipconfig` trên máy tính Windows và thấy máy đang nhận địa chỉ IPv4 là `169.254.45.120` với Subnet Mask `255.255.0.0`, kỹ sư mạng có thể kết luận ngay điều gì?",
                         "options_vi":  [
                                            "A. Máy tính đã kết nối Internet thành công qua địa chỉ IP Public.",
                                            "B. Máy tính đang được cấu hình để nhận IP động (DHCP) nhưng không thể liên lạc được với bất kỳ máy chủ DHCP nào nên Windows tự sinh ra địa chỉ APIPA.",
                                            "C. Card mạng của máy tính đã bị cháy hoàn toàn.",
                                            "D. Máy tính đang sử dụng địa chỉ Loopback."
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B. Dải địa chỉ `169.254.0.0/16` là địa chỉ Link-Local của IPv4 (trên Windows gọi là **APIPA - Automatic Private IP Addressing**). Khi máy trạm bật DHCP gửi gói `DHCP Discover` nhiều lần mà không nhận được `DHCP Offer` (do đứt cáp, gán sai VLAN, quên `ip helper-address`, hoặc sập DHCP Server), nó sẽ tự gắn đại một IP `169.254.x.x`."
                     }
                 ],
        "beginnerGuide_vi":  [
                                 "1. Giải thích \u0027Địa chỉ IPv4\u0027 và \u0027Subnet Mask\u0027 cho người mới bắt đầu từ con số 0: Hãy nhìn vào một địa chỉ IPv4 kèm Subnet Mask quen thuộc: • **IP: `192.168.1.10`** • **Subnet Mask: `255.255.255.0` (viết gọn là `/24`)**. Tại sao lúc nào điền IP cũng phải điền kèm Subnet Mask ở ngay dòng dưới? Bởi vì trong con số `192.168.1.10` có chứa 2 phần ghép chung với nhau: **Tên Đường Phố (Network ID)** và **Số Nhà (Host ID)**. Chiếc **Subnet Mask** chính là cây thước kẻ giúp máy tính biết cắt ở dấu chấm nào: Chỗ nào của Subnet Mask là số **`255`** (toàn bit `1`) thì phần IP tương ứng bên trên là **Tên Đường Phố (`192.168.1`)**; chỗ nào của Subnet Mask là số **`0`** thì phần IP bên trên là **Số Nhà của từng máy (`.10`)**! Hai máy tính muốn ở chung một mạng LAN thì bắt buộc phải có **cùng Tên Đường Phố (`192.168.1`)** và khác Số Nhà (`.10`, `.11`, `.12`...).",
                                 "2. Tại sao trong một dải mạng `/24` có từ `.0` đến `.255` (tổng cộng 256 số) mà chỉ gán được cho tối đa **254 máy tính**? Bởi vì ở bất kỳ mạng nào (dù lớn hay nhỏ), **Con số đầu tiên (`.0`)** luôn bị khóa lại để làm **Tên gọi của cả con phố (Network Address)**, và **Con số cuối cùng (`.255`)** luôn bị khóa lại làm **Loa phát thanh chung cho cả phố (Broadcast Address)**! Do đó chỉ còn các số ở giữa từ **`.1` đến `.254` (254 số)** là được phép gán cho máy tính và Router!",
                                 "3. \u0027Chia mạng con (Subnetting)\u0027 thực chất là làm việc gì? Giả sử công ty bạn được cấp 1 mạng lớn `/24` (có 254 số nhà từ `.1` đến `.254`), nhưng công ty có 4 phòng ban riêng biệt (Kinh doanh, Kế toán, Nhân sự, IT). Bạn không thể nhét tất cả vào chung 1 mạng được mà phải **cắt chiếc bánh 256 số đó thành nhiều miếng nhỏ hơn** (ví dụ cắt làm 4 khúc: khúc 1 từ `.0 -\u003e .63`, khúc 2 từ `.64 -\u003e .127`, khúc 3 từ `.128 -\u003e .191`, khúc 4 từ `.192 -\u003e .255`) — mỗi khúc nhỏ đó chính là một **Mạng con (Subnet)**!",
                                 "4. Bốn bước nhẩm chia mạng con (Subnetting) trong 10 giây không cần giấy nháp: Giả sử đề bài cho địa chỉ 192.168.1.150/26 và hỏi máy này thuộc mạng nào, dải IP dùng được từ đâu đến đâu? • **Bước 1 (Tìm số bit Host còn lại h)**: Lấy tổng 32 bit trừ đi /26 được h = 32 - 26 = 6 bit. • **Bước 2 (Tìm Bước nhảy - Block Size)**: Tính 2^h = 2^6 = 64. Nghĩa là các mạng con sẽ nhảy cách đều nhau 64 đơn vị: .0, .64, .128, .192. • **Bước 3 (Xác định Mạng chứa số .150)**: Số 150 nằm lọt giữa 128 và 192, vậy Địa chỉ Mạng (Network ID) là **192.168.1.128/26**, và Địa chỉ Quảng bá (Broadcast - số cuối cùng trước mạng kế tiếp) là **192.168.1.191**! • **Bước 4 (Dải IP gán được cho máy tính)**: Lấy từ Network + 1 đến Broadcast - 1, tức là từ **.129 đến .190** (tổng cộng 64 - 2 = 62 máy tính).",
                                 "5. Phân biệt 3 địa chỉ IPv4 đặc biệt mà người mới không bao giờ được gán cho máy tính: • **127.0.0.1 (Địa chỉ Loopback)**: Địa chỉ tự chỉ vào chính bản thân máy tính mình. Gõ ping 127.0.0.1 dùng để kiểm tra xem phần mềm TCP/IP trên Windows có hoạt động tốt không (dù rút dây mạng ra vẫn ping thông!). • **169.254.x.x (Địa chỉ APIPA)**: Khi máy tính để chế độ nhận IP tự động (DHCP) nhưng bị đứt dây tới máy chủ DHCP, Windows tự sinh ra địa chỉ 169.254.x.x — nhìn thấy dải số này nghĩa là máy tính **đang lỗi không xin được IP và mất kết nối Internet**! • **\u0000.0.0.0**: Đại diện cho \u0027mọi mạng\u0027 (Default Route trên Router) hoặc trạng thái máy trạm chưa có địa chỉ IP."
                             ],
        "beginnerGuide_en":  [
                                 "1. Explaining IPv4 Address and Subnet Mask from Scratch: Every IPv4 address (like `192.168.1.10`) has two parts: the **Street Name (Network Portion)** and the **House Number (Host Portion)**. The **Subnet Mask (`255.255.255.0` or `/24`)** tells the computer where the Street Name ends and where the House Number begins: `255`s lock in the Network (`192.168.1`), while `0` marks the Host (`.10`).",
                                 "2. Why do we always subtract 2 ($2^h - 2$) when calculating usable hosts? In every subnet, the **very first address** (all host bits = `0`) is reserved as the **Network ID**, and the **very last address** (all host bits = `1`) is reserved as the **Broadcast Address**. Only the addresses in between can be assigned to devices!",
                                 "3. What is Subnetting? Taking one large network block (like `192.168.1.0/24` with 256 addresses) and borrowing bits from the host portion to slice it into smaller, separate network blocks (e.g., four `/26` subnets of 64 addresses each) for different departments or VLANs."
                             ],
        "advancedTopics_vi":  [
                                  "Mở rộng Nâng cao 1 — Phương pháp Nhẩm Nhanh Bất Kỳ Bài Tập Chia Subnet Nào Trong 10 Giây (Không cần đổi ra Nhị phân!): Khi đề thi hỏi: *\u0027Máy tính có IP `192.168.5.140/27` thuộc mạng con nào, IP đầu, IP cuối và Broadcast là bao nhiêu?\u0027*, bạn chỉ cần làm 3 bước nhẩm: • **Bước 1 (Tìm số bit Host $h$)**: Lấy $32 - 27 = $ **`5` bit Host**. • **Bước 2 (Tìm Bước nhảy / Kích thước mỗi mạng con)**: Tính $2^5 = $ **`32`** (Mỗi mạng con rộng đúng 32 số, bắt đầu từ `0` cộng thêm `32` liên tiếp: `.0`, `.32`, `.64`, `.96`, **`.128`**, **`.160`**...). • **Bước 3 (Xác định vị trí số `.140`)**: Số `140` nằm lọt giữa **`.128`** và **`.160`**! Vậy kết luận ngay: **Địa chỉ Mạng = `.128`**, **Địa chỉ Broadcast = `.159`** (lấy mạng kế tiếp `.160` trừ 1), và **Dải IP gán cho máy = `.129` đến `.158`**!",
                                  "Mở rộng Nâng cao 2 — Kỹ thuật Gộp Mạng (Route Summarization / Supernetting) trên Router: Ngược lại với việc chia nhỏ mạng (Subnetting), khi một Router ở Trụ sở chính nối tới Chi nhánh có 4 mạng con liên tiếp (`192.168.0.0/24`, `192.168.1.0/24`, `192.168.2.0/24`, `192.168.3.0/24`), thay vì phải khai báo 4 dòng trong bảng định tuyến, kỹ sư mạng **gộp cả 4 mạng `/24` đó lại thành 1 dòng duy nhất là `192.168.0.0/22` (Subnet Mask `255.255.252.0`)** giúp bảng định tuyến cực kỳ gọn nhẹ và tăng tốc độ xử lý!",
                                  "Mở rộng Nâng cao 3 — Thiết kế Địa chỉ IP phân cấp để Tóm tắt tuyến đường (Route Summarization / Supernetting): Khi quy hoạch mạng cho tập đoàn có 100 chi nhánh, kỹ sư không cấp phát các dải Subnet ngẫu nhiên mà gom các dải mạng liên tiếp nhau cho từng khu vực địa lý (ví dụ Khu vực Miền Nam dùng từ 10.1.0.0/24 đến 10.1.7.0/24). Nhờ vậy, Router trục chính chỉ cần lưu **1 dòng định tuyến tóm tắt duy nhất là 10.1.0.0/21** thay vì phải gánh 8 dòng riêng lẻ — giúp bảng định tuyến gọn nhẹ, tiết kiệm RAM và mạng ổn định hơn."
                              ],
        "advancedTopics_en":  [
                                  "Advanced Expansion 1 — The 10-Second Mental Subnetting Trick (No Binary Required!): Given `192.168.5.140/27`: 1) Remaining host bits $h = 32 - 27 = 5$; 2) Block Size = $2^5 = 32$ (subnets start at `0, 32, 64, 96, 128, 160...`); 3) Since `140` falls between `128` and `160`, the **Network ID is `.128`**, the **Broadcast is `.159`** (`160 - 1`), and **Usable Hosts are `.129` to `.158`**!",
                                  "Advanced Expansion 2 — Route Summarization (Supernetting): The opposite of subnetting—combining multiple contiguous networks (such as `192.168.0.0/24` through `192.168.3.0/24`) into a single summary route (`192.168.0.0/22`, mask `255.255.252.0`) to shrink routing tables and improve stability."
                              ]
    },
    {
        "id":  12,
        "title":  "IPv6 Addressing",
        "title_vi":  "Địa Chỉ IPv6 và Cấp Phát Tự Động",
        "overview":  "Module 12 covers IPv6 (128-bit hexadecimal addressing), engineered by the IETF to solve IPv4 exhaustion and eliminate the need for NAT. Written as eight 16-bit hexadecimal **hextets** separated by colons (`2001:0db8:0000:1111:0000:0000:0000:0200`), IPv6 addresses are compressed using two strict rules (Omitting Leading Zeros and the Double Colon `::`). You will master the critical difference between a **Global Unicast Address (GUA, `2000::/3`)** and a **Link-Local Address (LLA, `fe80::/10`)**, multicast groups (`ff02::1`, `ff02::2`), and the three ways hosts obtain IPv6 addresses automatically via ICMPv6 Router Advertisements (SLAAC, Stateless DHCPv6, and Stateful DHCPv6).",
        "overview_vi":  "Module 12 làm chủ thế hệ địa chỉ mạng mới nhất: **IPv6 (dài 128-bit, gấp 4 lần chiều dài IPv4)** cung cấp tới $3.4 \\times 10^{38}$ địa chỉ — đủ để gắn IP riêng cho từng hạt cát trên Trái Đất mà không cần dùng kỹ thuật NAT nữa! Địa chỉ IPv6 được viết bằng hệ Hex (0–9, a–f) chia thành **8 cụm (gọi là 8 Hextet)** cách nhau bởi dấu hai chấm `:`. Bạn sẽ học **2 Quy tắc rút gọn địa chỉ IPv6**, phân biệt 2 loại địa chỉ quan trọng nhất trên mỗi thiết bị là **GUA (`2000::/3` - tương đương IP Public)** và **LLA (`fe80::/10` - địa chỉ bắt buộc tự sinh trong nội bộ từng đoạn dây LAN)**, cùng 3 phương pháp tự động cấp IPv6 không cần cấu hình tay (**SLAAC**, **Stateless DHCPv6**, và **Stateful DHCPv6**).",
        "analogy_vi":  "Trên mỗi card mạng chạy IPv6 luôn có ít nhất 2 địa chỉ cùng tồn tại song song giống như một người có 2 tên gọi: 1) **Link-Local Address (`fe80::...` - LLA)** giống như tên gọi ở nhà (\u0027Bé Tư\u0027) — tự động có ngay khi bật máy, chỉ dùng để nói chuyện với bố mẹ anh chị trong cùng 1 ngôi nhà (cùng 1 mạng LAN, Router không bao giờ chuyển tên này ra ngoài); và 2) **Global Unicast Address (`2001:...` - GUA)** giống như Số Căn Cước Công Dân / Hộ Chiếu Quốc Tế — dùng để đi giao dịch khắp thế giới Internet!",
        "keyConcepts":  [
                            "Anatomy of a 128-Bit IPv6 Address (8 Hextets): Divided into 8 groups of 4 Hex digits (`xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx`). Each Hex digit = 4 bits, so each Hextet = $4 \\times 4 = 16$ bits ($16 \\times 8 = 128$ bits total).",
                            "Two Strict Rules for Compressing IPv6 Addresses: • **Rule 1 (Omit Leading Zeros)**: Remove any leading `0`s at the front of each hextet (`0db8` -\u003e `db8`, `00ab` -\u003e `ab`, `0000` -\u003e `0`). Never remove trailing zeros (`0200` becomes `200`, NOT `2`!). • **Rule 2 (Double Colon `::`)**: Replace ONE contiguous sequence of all-zero hextets (`:0:0:0:`) with a double colon `::`. **CRITICAL**: You can only use `::` **ONCE** per address, otherwise the router cannot tell how many hextets were compressed!",
                            "Global Unicast Address (GUA — `2000::/3`, starts with `2` or `3`): Globally unique and routable on the IPv6 Internet (like a Public IPv4 address). Standard `/64` structure: **48-bit Global Routing Prefix** (assigned by ISP) + **16-bit Subnet ID** (gives your company $2^{16} = 65,536$ subnets!) + **64-bit Interface ID** (host portion).",
                            "Link-Local Address (LLA — `fe80::/10`, starts with `fe80:`): **Mandatory** on every IPv6-enabled interface (created automatically even without a router or DHCP server). Used only on the local link (routers NEVER forward packets with a Link-Local source or destination), and serves as the **Default Gateway address** for hosts on the LAN!",
                            "Special IPv6 Addresses: • **Loopback**: `::1/128` (127 zeros followed by a 1; equivalent to IPv4 `127.0.0.1`); • **Unspecified Address**: `::/128` (all 128 zeros; equivalent to `0.0.0.0`); • **Unique Local (ULA)**: `fc00::/7` (`fd00::/8`, similar to RFC 1918 private IPs); • **Multicast (`ff00::/8`)**: `ff02::1` = All IPv6 nodes on the link; `ff02::2` = All IPv6 routers on the link.",
                            "Three Dynamic IPv6 Address Assignment Methods (Controlled by ICMPv6 Router Advertisement Flags): When a PC boots, it sends an ICMPv6 **Router Solicitation (RS)** to `ff02::2` asking for network info, and the Router replies with a **Router Advertisement (RA)** to `ff02::1`: 1) **SLAAC Only** (Default: `A=1, O=0, M=0`): PC takes the `/64` prefix from the router\u0027s RA and generates its own 64-bit Interface ID (via random privacy ID or EUI-64 MAC conversion); 2) **SLAAC + Stateless DHCPv6** (`A=1, O=1, M=0`): PC still builds its own IP from the RA, but contacts a DHCPv6 server for extra info like DNS servers; 3) **Stateful DHCPv6** (`A=0, M=1`): PC ignores the RA prefix for addressing and gets its full IPv6 address + DNS leased from a Stateful DHCPv6 server (just like IPv4 DHCP)."
                        ],
        "keyConcepts_vi":  [
                               "Cấu trúc 128-bit của IPv6 (8 cụm Hextet): Mỗi địa chỉ IPv6 gồm 32 chữ số Hex chia thành **8 cụm (8 Hextet)** cách nhau bởi dấu hai chấm `:`. Mỗi cụm có 4 chữ số Hex = $4 \\times 4 = 16$ bit ($16 \\text{ bit} \\times 8 \\text{ cụm} = 128 \\text{ bit}$). Trong IPv6 không dùng Subnet Mask kiểu `255.255...` nữa mà chỉ dùng độ dài tiền tố **Prefix Length** (chuẩn cho mọi mạng LAN là **`/64`**).",
                               "2 Quy tắc Rút gọn Địa chỉ IPv6 (Bắt buộc nắm vững): • **Quy tắc 1 (Bỏ các số 0 đứng đầu mỗi cụm)**: Các số `0` ở phía bên trái của mỗi Hextet được phép lược bỏ (`0db8` viết thành `db8`; `0000` viết thành `0`). Tuyệt đối KHÔNG được bỏ số 0 ở đuôi bên phải (`0200` chỉ được rút thành `200`, nếu rút thành `2` là sai hoàn toàn!). • **Quy tắc 2 (Dấu hai chấm kép `::`)**: Một dãy các cụm toàn số `0` đứng liền nhau (`:0:0:0:`) được phép thay thế bằng một dấu `::`. **LƯU Ý SỐNG CÒN**: Dấu `::` chỉ được phép dùng **ĐÚNG 1 LẦN DUY NHẤT** trong một địa chỉ IPv6 (nếu dùng 2 lần máy tính sẽ không biết bên nào ẩn mấy cụm số 0)!",
                               "2 Loại Địa chỉ IPv6 Unicast quan trọng nhất (GUA vs. LLA): • **GUA (Global Unicast Address — `2000::/3`, luôn bắt đầu bằng số `2` hoặc `3`, ví dụ `2001:db8:...`)**: Là địa chỉ định tuyến toàn cầu trên Internet (tương đương IP Public). Cấu trúc chuẩn gồm: 48-bit Global Routing Prefix + 16-bit Subnet ID (để chia mạng con) + 64-bit Interface ID (phần Host). • **LLA (Link-Local Address — `fe80::/10`, luôn bắt đầu bằng `fe80:...`)**: Bắt buộc có mặt trên mọi cổng IPv6 (Windows/Router tự động tạo ngay khi bật máy). Chỉ có giá trị trong nội bộ 1 mạng LAN (Router không bao giờ chuyển gói tin LLA đi sang mạng khác) và được máy tính dùng làm địa chỉ **Default Gateway**!",
                               "Các địa chỉ IPv6 đặc biệt cần nhớ: • **Loopback (Tự ping chính mình)**: `::1/128` (tương đương `127.0.0.1` của IPv4); • **Địa chỉ chưa xác định (Unspecified)**: `::/128` (tương đương `0.0.0.0`); • **Multicast mọi thiết bị trong LAN**: `ff02::1` (thay thế cho Broadcast của IPv4); • **Multicast chỉ gửi cho các Router trong LAN**: `ff02::2`.",
                               "3 Cách nhận IPv6 Tự động qua bản tin RS / RA (SLAAC vs. DHCPv6): Trong IPv6, máy tính không cần máy chủ DHCP vẫn tự có IP đi Internet được! Khi bật máy, PC gửi bản tin **RS (Router Solicitation)** vào nhóm `ff02::2` hỏi *\u0027Có Router nào ở đây không?\u0027*, Router trả lời bằng bản tin **RA (Router Advertisement)** chứa phần mạng `/64`: 1) **SLAAC (Stateless Address Autoconfiguration — Mặc định)**: PC lấy 64-bit đầu của Router ghép với 64-bit cuối do nó tự chế ra (ngẫu nhiên hoặc biến đổi từ địa chỉ MAC theo chuẩn **EUI-64**: chèn `FFFE` vào giữa MAC rồi đảo bit thứ 7) để thành địa chỉ IPv6 hoàn chỉnh! 2) **Stateless DHCPv6**: PC vẫn tự tạo IP bằng SLAAC, nhưng hỏi thêm DHCPv6 Server để xin địa chỉ DNS. 3) **Stateful DHCPv6**: Giống hệt DHCP của IPv4 — mọi thứ từ IP cho đến DNS đều do máy chủ DHCPv6 cấp và quản lý."
                           ],
        "realWorldExample":  "Worked Example 1: Compressing `2001:0db8:0000:1111:0000:0000:0000:0200`\n• Step 1 (Rule 1 — Remove leading zeros in each hextet):\n  `2001 : db8 : 0 : 1111 : 0 : 0 : 0 : 200`\n• Step 2 (Rule 2 — Replace the longest contiguous string of `:0:0:0:` with `::`):\n  `2001:db8:0:1111::200` (Notice the single `0` in the 3rd hextet remains `0` because `::` can only be used once!).\n\nWorked Example 2: EUI-64 Interface ID from MAC `00-60-2F-3A-07-BC`:\n1. Split MAC in half: `0060:2F` and `3A:07BC`.\n2. Insert `FFFE` in the middle: `0060:2FFF:FE3A:07BC`.\n3. Convert first byte `00` to binary `00000000`, flip the 7th bit (`00000010` = `02` hex) -\u003e Result: `0260:2fff:fe3a:07bc`.",
        "realWorldExample_vi":  "Ví dụ giải bài tập Rút gọn địa chỉ IPv6 \u0026 Tạo địa chỉ EUI-64:\n**Bài 1: Rút gọn địa chỉ IPv6 sau**: `2001:0db8:0000:1111:0000:0000:0000:0200`\n• **Bước 1 (Áp dụng Quy tắc 1 — Xóa các số 0 đứng đầu mỗi cụm)**:\n  `2001 : db8 : 0 : 1111 : 0 : 0 : 0 : 200` *(Chú ý: `0200` chỉ xóa số `0` đầu thành `200`, giữ nguyên 2 số `00` ở đuôi!)_.\n• **Bước 2 (Áp dụng Quy tắc 2 — Thay chuỗi `:0:0:0:` dài nhất bằng dấu `::`)**:\n  Kết quả chuẩn: **`2001:db8:0:1111::200`** *(Cụm số `0` ở vị trí thứ 3 bắt buộc phải viết là `:0:` vì dấu `::` đã dùng ở phía sau rồi!)_.\n\n**Bài 2: Tính 64-bit cuối theo chuẩn EUI-64 từ địa chỉ MAC `00-60-2F-3A-07-BC`**:\n• **Bước 1**: Bổ đôi địa chỉ MAC làm 2 nửa (mỗi nửa 6 số Hex): `00-60-2F` và `3A-07-BC`.\n• **Bước 2**: Nhét cụm chữ **`FFFE`** vào chính giữa: `0060 : 2FFF : FE3A : 07BC`.\n• **Bước 3**: Đổi 2 số đầu tiên (`00`) ra 8 bit nhị phân là `0000 0000`, lật ngược **bit thứ 7** từ trái sang (`0` thành `1`) ta được `0000 0010` = **`02`**.\n=\u003e Kết quả 64-bit Interface ID: **`0260:2fff:fe3a:07bc`** (Ghép vào `fe80::` ta được địa chỉ Link-Local `fe80::260:2fff:fe3a:07bc`).",
        "diagramType":  "ipv6-anatomy",
        "commands":  [
                         "Quy tắc Rút gọn IPv6: 2001:0db8:0000:1111:0000:0000:0000:0200  ---\u003e  2001:db8:0:1111::200",
                         "Các nhóm Multicast IPv6: ff02::1 (Tất cả thiết bị trong LAN) | ff02::2 (Tất cả Router trong LAN)",
                         "R1(config)# ipv6 unicast-routing                         # Bắt buộc bật để Router định tuyến IPv6 và gửi bản tin RA",
                         "R1(config)# interface gigabitethernet 0/0/0",
                         "R1(config-if)# ipv6 address 2001:db8:acad:1::1/64        # Cấu hình địa chỉ IPv6 Global Unicast (GUA)",
                         "R1(config-if)# ipv6 address fe80::1 link-local           # Đặt địa chỉ Link-Local ngắn gọn dễ nhớ cho cổng Router",
                         "R1(config-if)# no shutdown",
                         "R1# show ipv6 interface brief                            # Kiểm tra nhanh cả địa chỉ LLA (fe80::) và GUA (2001::)",
                         "R1# show ipv6 interface gigabitethernet 0/0/0            # Xem chi tiết các nhóm Multicast (ff02::1, ff02::2) mà cổng đã tham gia"
                     ],
        "comparisonTable":  {
                                "title_vi":  "Bảng Phân Loại Toàn Bộ Các Dải Địa Chỉ IPv6 \u0026 3 Phương Pháp Cấp Phát Động (RA Flags)",
                                "headers_vi":  [
                                                   "Loại Địa Chỉ IPv6 / Phương Pháp",
                                                   "Tiền Tố Nhận Diện (Prefix)",
                                                   "Đặc Điểm Kỹ Thuật \u0026 Phạm Vi Định Tuyến",
                                                   "Tương Đương Bên IPv4"
                                               ],
                                "rows":  [
                                             [
                                                 "Global Unicast Address (GUA)",
                                                 "**`2000::/3`** (Bắt đầu bằng `2000:` đến `3fff:`, hay gặp `2001:db8::`)",
                                                 "Định tuyến toàn cầu trên Internet. Cấu trúc chuẩn `/64`: 48-bit Global Prefix + 16-bit Subnet ID + 64-bit Interface ID.",
                                                 "Public IPv4 Address"
                                             ],
                                             [
                                                 "Link-Local Address (LLA)",
                                                 "**`fe80::/10`** (Thực tế dùng `fe80::/64`)",
                                                 "**Bắt buộc có trên mọi cổng IPv6**. Tự động tạo ngay khi bật máy. **KHÔNG BAO GIỜ đi qua Router**, dùng làm **Default Gateway** cho PC.",
                                                 "APIPA `169.254.0.0/16` (nhưng trong IPv6 là cốt lõi bắt buộc)"
                                             ],
                                             [
                                                 "Unique Local Address (ULA)",
                                                 "**`fc00::/7`** (Thực tế dùng **`fd00::/8`**)",
                                                 "Dùng nội bộ trong doanh nghiệp qua nhiều chi nhánh, không định tuyến ra Internet công cộng.",
                                                 "Private IPv4 (RFC 1918: `10.x`, `172.16.x`, `192.168.x`)"
                                             ],
                                             [
                                                 "Multicast Address",
                                                 "**`ff00::/8`** (`ff02::1` = Mọi máy; `ff02::2` = Mọi Router)",
                                                 "Gửi từ 1 điểm đến 1 nhóm thiết bị đăng ký. **Thay thế hoàn toàn Broadcast trong IPv6**.",
                                                 "Multicast `224.0.0.0/4` + Broadcast"
                                             ],
                                             [
                                                 "Loopback \u0026 Unspecified",
                                                 "**`::1/128`** (Loopback) \u0026 **`::/128`** (Unspecified / Default Route `::/0`)",
                                                 "`::1` dùng tự ping kiểm tra TCP/IP stack; `::/0` dùng làm Default Static Route trong IPv6.",
                                                 "`127.0.0.1` và `0.0.0.0/0`"
                                             ],
                                             [
                                                 "1. SLAAC Only (Mặc định)",
                                                 "Cờ RA: **`A=1, O=0, M=0`**",
                                                 "PC lấy Prefix `/64` và Gateway từ bản tin RA của Router, tự sinh 64-bit cuối (ngẫu nhiên hoặc EUI-64). Không cần DHCPv6 Server.",
                                                 "Không có bên IPv4 (Tính năng đột phá của IPv6)"
                                             ],
                                             [
                                                 "2. SLAAC + Stateless DHCPv6",
                                                 "Cờ RA: **`A=1, O=1, M=0`** (`O` = Other)",
                                                 "PC vẫn tự tạo IP bằng SLAAC từ Router, nhưng hỏi thêm máy chủ DHCPv6 để lấy địa chỉ **DNS Server** và Domain name.",
                                                 "Kết hợp tự sinh IP + hỏi DNS"
                                             ],
                                             [
                                                 "3. Stateful DHCPv6",
                                                 "Cờ RA: **`A=0, M=1`** (`M` = Managed)",
                                                 "PC không tự tạo IP từ RA mà xin toàn bộ địa chỉ IPv6 + DNS từ máy chủ **Stateful DHCPv6** (Server quản lý danh sách cấp phát).",
                                                 "Giống hệt DHCP truyền thống của IPv4"
                                             ]
                                         ]
                            },
        "jobSkills_vi":  [
                             "Kinh nghiệm Đi Làm 1 — Tại sao gõ `ipconfig` trên Windows 10/11 thấy địa chỉ IPv6 không có chữ `FFFE` ở giữa như công thức EUI-64 trong sách? Trước đây theo chuẩn EUI-64, máy tính lấy địa chỉ vật lý MAC 48-bit của card mạng chèn `FFFE` vào giữa để tạo ra 64-bit cuối của IPv6. Tuy nhiên việc này làm lộ địa chỉ phần cứng MAC của laptop bạn cho mọi trang web trên thế giới theo dõi! Vì lý do bảo mật quyền riêng tư (RFC 4941 Privacy Extensions), từ Windows Vista/7/10/11 trở đi, hệ điều hành mặc định **sinh ngẫu nhiên 64-bit cuối (Random 64-bit Interface ID)**, trong khi các cổng trên Router Cisco vẫn dùng chuẩn EUI-64 khi bạn gõ lệnh `ipv6 address 2001:db8:acad:1::/64 eui-64`!",
                             "Kinh nghiệm Đi Làm 2 — Bẫy cấu hình Static Route với địa chỉ Link-Local (`fe80::`): Khi cấu hình đường định tuyến tĩnh IPv6 (`ipv6 route`), nếu bạn dùng địa chỉ Global Unicast (`2001:db8:...`) làm trạm kế tiếp (Next-hop) thì chỉ cần gõ IP là đủ. Nhưng nếu bạn dùng địa chỉ **Link-Local (`fe80::2`)** làm Next-hop, vì mọi cổng trên Router đều có chung dải `fe80::`, Router sẽ không biết đẩy ra cổng nào! Bạn **bắt buộc phải ghi kèm cả Tên Cổng Xuất (Exit Interface)** trước địa chỉ `fe80::`: `R1(config)# ipv6 route 2001:db8:acad:2::/64 gigabitethernet 0/0/1 fe80::2`!"
                         ],
        "quiz":  [
                     {
                         "question_vi":  "Câu 1 (Đề thi CCNA): Cách viết rút gọn nào sau đây là CHÍNH XÁC NHẤT cho địa chỉ IPv6: `2001:0db8:0000:0000:0ab0:0000:0000:0100`?",
                         "options_vi":  [
                                            "A. `2001:db8::ab0::100`",
                                            "B. `2001:db8::ab:0:0:1`",
                                            "C. `2001:db8::ab0:0:0:100` (hoặc `2001:db8:0:0:ab0::100`)",
                                            "D. `2001:0db8:0:0:ab0:0:0:1`"
                                        ],
                         "answerIndex":  2,
                         "explanation_vi":  "Đáp án đúng là C. Có 2 cái bẫy cực lớn ở đây: 1) Dấu hai chấm kép `::` chỉ được dùng **ĐÚNG 1 LẦN DUY NHẤT** (nên đáp án A sai vì dùng `::` 2 lần); 2) Chỉ được bỏ các số `0` đứng ĐẦU mỗi cụm, tuyệt đối không được bỏ số `0` ở ĐUÔI (`0ab0` rút thành `ab0`, `0100` rút thành `100` chứ không được rút thành `ab` và `1` như đáp án B và D!)."
                     },
                     {
                         "question_vi":  "Câu 2 (Đề thi CCNA): Loại địa chỉ IPv6 nào BẮT BUỘC phải tồn tại trên mọi giao diện mạng có bật IPv6, được dùng làm địa chỉ Default Gateway cho các máy trạm trong mạng LAN, và không bao giờ được Router định tuyến ra khỏi mạng cục bộ?",
                         "options_vi":  [
                                            "A. Global Unicast Address (`2000::/3`)",
                                            "B. Link-Local Address (`fe80::/10`)",
                                            "C. Unique Local Address (`fc00::/7`)",
                                            "D. Anycast Address"
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B (Link-Local Address — bắt đầu bằng `fe80:`). Mọi thiết bị IPv6 đều tự động tạo địa chỉ Link-Local trên từng cổng để giao tiếp trong nội bộ đoạn dây mạng đó (gửi bản tin RS/RA, NS/NA, gói tin giao thức định tuyến OSPF/EIGRP và làm địa chỉ Default Gateway)."
                     },
                     {
                         "question_vi":  "Câu 3 (Đề thi CCNA): Khi một máy tính PC mới khởi động trong mạng IPv6 và muốn nhanh chóng xin thông tin tiền tố mạng `/64` từ Router mà không muốn chờ bản tin định kỳ, máy tính sẽ gửi bản tin nào và gửi tới địa chỉ đích nào?",
                         "options_vi":  [
                                            "A. Gửi bản tin Router Advertisement (RA) tới `ff02::1` (All-nodes multicast).",
                                            "B. Gửi bản tin Router Solicitation (RS) tới `ff02::2` (All-routers multicast).",
                                            "C. Gửi bản tin DHCPv4 Discover tới `255.255.255.255`.",
                                            "D. Gửi bản tin ARP Request tới `ff02::1`."
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B. Hãy nhớ cặp bản tin: Máy trạm đi hỏi Router thì gửi **RS (Router Solicitation)** tới nhóm tất cả các Router **`ff02::2`**; sau đó Router trả lời cho các máy trạm bằng bản tin **RA (Router Advertisement)** gửi tới nhóm tất cả các thiết bị **`ff02::1`**."
                     }
                 ],
        "beginnerGuide_vi":  [
                                 "1. Tại sao thế giới đang dùng IPv4 quen thuộc lại phải chuyển sang IPv6 dài ngoằng? Bởi vì địa chỉ IPv4 chỉ có 32-bit nên tạo ra được tối đa khoảng **4,3 tỷ địa chỉ** — trong khi ngày nay thế giới có hơn 8 tỷ người, mỗi người có điện thoại, laptop, đồng hồ thông minh, tivi, camera... khiến **kho địa chỉ IPv4 đã cạn kiệt hoàn toàn**! Thế hệ **IPv6** nâng chiều dài lên **128-bit**, tạo ra số lượng địa chỉ khổng lồ ($340$ tỷ tỷ tỷ tỷ địa chỉ) dùng hàng ngàn năm nữa không bao giờ hết!",
                                 "2. Đừng sợ độ dài của IPv6 — Cách đọc hiểu cấu trúc 8 cụm (8 Hextet) cực kỳ đơn giản: Một địa chỉ IPv6 đầy đủ gồm **8 cụm số Hex** cách nhau bởi dấu hai chấm, ví dụ: `2001 : 0db8 : acad : 0001 : 0000 : 0000 : 0000 : 0010 / 64`. Bạn chỉ cần cắt đôi nó ra làm 2 nửa bằng nhau (4 cụm đầu và 4 cụm cuối): • **4 cụm đầu tiên (64 bit đầu)**: Chính là **Phần Mạng (Network Prefix)**; • **4 cụm cuối cùng (64 bit cuối)**: Chính là **Phần Máy Trạm (Interface ID / Host)**! Trong IPv6, hầu như mọi mạng LAN đều có độ dài chuẩn là **`/64`** nên bạn không phải đau đầu tính số lẻ như IPv4 nữa!",
                                 "3. Hiểu rõ tại sao trên máy tính chạy IPv6 lúc nào cũng hiện ra 2 địa chỉ IPv6 cùng lúc (`fe80::...` và `2001:...`): • Địa chỉ thứ nhất luôn bắt đầu bằng chữ **`fe80:` (gọi là Link-Local Address - LLA)**: Máy tính tự động tạo ra địa chỉ này ngay khi bật nguồn (dù chưa cắm vào Router!) để dùng nói chuyện nội bộ với các máy và Router trong cùng phòng LAN. • Địa chỉ thứ hai bắt đầu bằng số **`2` hoặc `3` (ví dụ `2001:...` hoặc `2402:...` của Viettel/VNPT — gọi là Global Unicast Address - GUA)**: Là địa chỉ chính thức để đi ra ngoài Internet toàn cầu!",
                                 "4. Tại sao IPv6 dài tới 128 bit nhưng nhìn thực tế lại khá gọn nhờ 2 quy tắc rút gọn? Một địa chỉ IPv6 đầy đủ gồm 8 cụm (Hextet), mỗi cụm 4 chữ số Hex, ví dụ: 2001:0db8:0000:0000:0000:0000:0000:0200. Để con người dễ đọc, có 2 luật rút gọn: • **Luật 1 (Bỏ các số 0 đứng đầu mỗi cụm)**: \u0000db8 viết thành db8, \u0000200 viết thành 200, \u0000000 viết thành \u0000 (không được xóa trắng cụm đó mà phải để lại ít nhất 1 số \u0000). • **Luật 2 (Nén chuỗi cụm số 0 liên tiếp bằng dấu hai chấm kép ::)**: Toàn bộ chuỗi :0000:0000:0000:0000:0000: được thu gọn thành ::, cho ra kết quả ngắn gọn: **2001:db8::200**! *(Lưu ý: Dấu :: chỉ được phép dùng **tối đa 1 lần duy nhất** trong một địa chỉ).* ",
                                 "5. Tại sao trong mạng IPv6 không còn khái niệm Broadcast (Quảng bá làm phiền cả mạng) nữa? Trong IPv4, các gói tin Broadcast (như ARP hay DHCP) bắt buộc mọi máy tính trong mạng LAN phải dừng việc để đọc, gây giảm hiệu năng khi mạng lớn. Lên tới IPv6, các kỹ sư đã **khai tử hoàn toàn Broadcast** và thay thế bằng **Multicast (bắt đầu bằng FF00::/8)**: Chỉ những nhóm thiết bị có liên quan (ví dụ nhóm tất cả Router FF02::2 hoặc nhóm Solicited-Node FF02::1:FFxx:xxxx) mới lắng nghe gói tin đó!"
                             ],
        "beginnerGuide_en":  [
                                 "1. Why did the world need IPv6? 32-bit IPv4 only provides ~4.3 billion addresses, which ran out due to smartphones, cloud servers, and IoT devices. **128-bit IPv6** provides $3.4 \\times 10^{38}$ addresses—eliminating address exhaustion and the need for NAT.",
                                 "2. Reading an IPv6 `/64` Address Easily: An IPv6 address has **8 groups (Hextets)** separated by colons (`2001:0db8:acad:0001:0000:0000:0000:0010/64`). Simply split it in half: the **first 4 hextets (64 bits)** are the **Network Prefix**, and the **last 4 hextets (64 bits)** are the **Host Interface ID**!",
                                 "3. Why does every IPv6 interface have two addresses (`fe80:...` and `2001:...`)? **1) Link-Local (`fe80::/10`)** is automatically created on every interface for local LAN communication and Default Gateway addressing (never routed outside the LAN). **2) Global Unicast (`2000::/3`)** is your public Internet-routable IPv6 address."
                             ],
        "advancedTopics_vi":  [
                                  "Mở rộng Nâng cao 1 — Thực hành Chia Mạng Con (Subnetting) trong IPv6 ở Cụm thứ 4 (16-bit Subnet ID): Chia mạng con trong IPv6 dễ hơn IPv4 gấp 10 lần! Nhà mạng ISP cấp cho công ty bạn tiền tố 48-bit là `2001:db8:acad::/48`. Cụm thứ 4 (16-bit từ bit 49 đến bit 64) dành riêng cho bạn đánh số thứ tự phòng ban theo hệ Hex từ `0000` đến `ffff` (tạo được tới **65.536 mạng con `/64`**!): • Mạng LAN Phòng 1: `2001:db8:acad:1::/64`; • Mạng LAN Phòng 2: `2001:db8:acad:2::/64` ... • Mạng LAN Phòng 10: `2001:db8:acad:a::/64`; • Mạng LAN Phòng 16: `2001:db8:acad:10::/64`!",
                                  "Mở rộng Nâng cao 2 — Phân tích 3 Cờ điều khiển (`A flag`, `O flag`, `M flag`) bên trong bản tin ICMPv6 Router Advertisement (RA): Khi Router gửi bản tin RA xuống mạng LAN, bên trong RA có 3 công tắc (bit cờ) chỉ đạo cho các máy tính PC biết phải lấy IP bằng cách nào: • **`A = 1, O = 0, M = 0` (Mặc định - SLAAC Only)**: Cờ `A` (Autonomous) bật bảo PC *\u0027Cứ lấy `/64` của tôi mà tự tạo IP, không cần tìm DHCPv6 Server\u0027*. • **`A = 1, O = 1, M = 0` (Stateless DHCPv6)**: Cờ `O` (Other-config) bật bằng lệnh `ipv6 nd other-config-flag` bảo PC *\u0027Tự tạo IP bằng SLAAC đi, nhưng hãy chạy sang hỏi DHCPv6 Server để lấy địa chỉ DNS nhé!\u0027*. • **`A = 0, M = 1` (Stateful DHCPv6)**: Cờ `M` (Managed-config) bật bằng lệnh `ipv6 nd managed-config-flag` bảo PC *\u0027Không được tự tạo IP mà phải xin toàn bộ IP và DNS từ máy chủ Stateful DHCPv6!\u0027*.",
                                  "Mở rộng Nâng cao 3 — Cơ chế Chống giả mạo IPv6 Router Advertisement (RA Guard - Chuẩn bảo mật First-Hop IPv6): Sự tiện lợi của cơ chế SLAAC trong IPv6 cũng tạo ra một lỗ hổng lớn: Nếu một kẻ tấn công trong mạng LAN bật tính năng phát gói tin **ICMPv6 Router Advertisement (RA) giả mạo** từ laptop của hắn, toàn bộ máy tính trong phòng sẽ tưởng laptop của hacker là Default Gateway và gửi mọi dữ liệu qua đó (Tấn công Man-in-the-Middle)! Trên Switch doanh nghiệp, kỹ sư phải bật tính năng **IPv6 RA Guard** để khóa chặt, chỉ cho phép cổng cắm vào Router thật mới được phát gói tin RA."
                              ],
        "advancedTopics_en":  [
                                  "Advanced Expansion 1 — How IPv6 Subnetting Works in the 4th Hextet (16-bit Subnet ID): An ISP assigns your organization a `/48` Global Routing Prefix (`2001:db8:acad::/48`). You simply increment the **4th hextet** in hexadecimal from `0000` to `ffff` to create **65,536 `/64` subnets**: Subnet 1 = `2001:db8:acad:1::/64`, Subnet 2 = `2001:db8:acad:2::/64`, Subnet 10 = `2001:db8:acad:a::/64`!",
                                  "Advanced Expansion 2 — Controlling SLAAC vs. DHCPv6 with ICMPv6 RA Flags (`A`, `O`, `M`): Inside the Router Advertisement (RA): **`A=1, O=0, M=0`** = SLAAC only; **`A=1, O=1, M=0`** (`ipv6 nd other-config-flag`) = Stateless DHCPv6 (IP from SLAAC, DNS from DHCPv6); **`A=0, M=1`** (`ipv6 nd managed-config-flag`) = Stateful DHCPv6 (IP and DNS leased from DHCPv6 server)."
                              ]
    },
    {
        "id":  13,
        "title":  "ICMP",
        "title_vi":  "Giao Thức Kiểm Tra Kết Nối ICMP (Ping \u0026 Traceroute)",
        "overview":  "Module 13 explores the Internet Control Message Protocol for IPv4 (ICMPv4) and IPv6 (ICMPv6). Because IP itself is a best-effort protocol with no built-in error reporting, ICMP serves as the Layer 3 diagnostic messenger that notifies the sender when a destination is unreachable or a packet\u0027s TTL/Hop Limit expires. Every network engineer uses two ICMP-based tools daily—**`ping`** and **`traceroute` (`tracert`)**—to test end-to-end reachability, measure Round-Trip Time (RTT), and pinpoint exactly which router along a path is dropping packets.",
        "overview_vi":  "Module 13 giải thích cơ chế hoạt động đằng sau 2 câu lệnh quen thuộc nhất của mọi kỹ sư mạng: **`ping`** và **`tracert` (`traceroute`)** — tất cả đều chạy trên nền giao thức **ICMP (Internet Control Message Protocol)** ở Tầng 3. Vì bản thân giao thức IP chỉ biết đẩy gói tin đi mà không có chức năng báo lỗi khi tắc đường, ICMP đóng vai trò là \u0027người đưa thư báo tin\u0027: báo cho máy gửi biết máy đích có còn sống hay không (Echo Request / Echo Reply), báo lý do tại sao gói tin không tới được đích (Destination Unreachable), báo gói tin đã hết hạn sống TTL (Time Exceeded), và trong IPv6 thì ICMPv6 còn kiêm luôn nhiệm vụ của ARP và cấp IP tự động (RS, RA, NS, NA).",
        "analogy_vi":  "Hãy tưởng tượng **`ping`** giống như hệ thống sóng âm Sonar của tàu ngầm: Tàu ngầm phát ra một tiếng \u0027Ping!\u0027 (**ICMP Echo Request**) vào lòng đại dương và bấm đồng hồ chờ tiếng vọng dội ngược trở lại (**ICMP Echo Reply**) để biết mục tiêu có ở đó không và cách bao xa (thời gian phản hồi ms). Còn **`tracert` (Traceroute)** giống như việc bạn thả những chú chim bồ câu đưa thư có giới hạn sức bay: Con thứ 1 chỉ bay được đúng **1 trạm (`TTL = 1`)** là hết sức, trạm Router số 1 liền gửi giấy báo về cho bạn biết tên của Trạm 1; Con thứ 2 bay được **2 trạm (`TTL = 2`)** rồi hết sức ở Trạm 2, Trạm 2 lại gửi giấy báo tên của nó về... Cứ thế bạn vẽ ra được toàn bộ bản đồ từng trạm Router từ nhà bạn đến tận máy chủ Google!",
        "keyConcepts":  [
                            "Three Core Types of ICMPv4 \u0026 ICMPv6 Messages: 1) **Host Reachability**: `Echo Request` (IPv4 Type 8 / IPv6 Type 128) and `Echo Reply` (IPv4 Type 0 / IPv6 Type 129) used by `ping`. 2) **Destination Unreachable**: notifies the sender why a packet could not be delivered. 3) **Time Exceeded**: sent by a router when a packet\u0027s `TTL` (IPv4) or `Hop Limit` (IPv6) reaches `0`.",
                            "ICMPv4 vs. ICMPv6 Destination Unreachable Codes (Exam Favorites!): • **ICMPv4 Codes**: `0` = Net Unreachable (router has no route in its routing table), `1` = Host Unreachable (router is connected to the subnet, but host didn\u0027t reply to ARP), `2` = Protocol Unreachable, `3` = Port Unreachable. • **ICMPv6 Codes**: `0` = No route to destination, `1` = Communication with destination administratively prohibited (blocked by a Firewall or ACL!), `3` = Address unreachable, `4` = Port unreachable.",
                            "ICMPv6 Neighbor Discovery (NDP) — 4 Extra Messages in IPv6: In IPv6, ICMPv6 is much more powerful than ICMPv4! It adds 4 messages: 1) **RS (Router Solicitation)** \u0026 2) **RA (Router Advertisement)** between hosts and routers for SLAAC dynamic addressing; 3) **NS (Neighbor Solicitation)** \u0026 4) **NA (Neighbor Advertisement)** between hosts for MAC address resolution (replacing ARP) and **DAD (Duplicate Address Detection)** to check that no other machine is using the same IPv6 address.",
                            "How `ping` Works \u0026 The 3-Step Troubleshooting Order: 1) `ping 127.0.0.1` (or `ping ::1`): Tests the local host\u0027s internal TCP/IP stack even if no cable is plugged in. 2) `ping \u003cDefault Gateway IP\u003e`: Verifies local NIC, cable, switch, and local router interface. 3) `ping \u003cRemote Host IP\u003e`: Verifies end-to-end routing across networks.",
                            "How `traceroute` / `tracert` Cleverly Uses TTL \u0026 Time Exceeded: To discover every router along a path, `tracert` sends the first probe with **`TTL = 1`**. Router 1 decrements TTL to `0`, drops the packet, and sends back an **ICMP Time Exceeded** message (revealing Router 1\u0027s IP!). Next, `tracert` sends a probe with **`TTL = 2`** (revealing Router 2\u0027s IP), then `TTL = 3`, and so on until the final destination replies with an Echo Reply (Windows `tracert`) or ICMP Port Unreachable (Cisco IOS/Linux `traceroute` using UDP)."
                        ],
        "keyConcepts_vi":  [
                               "3 Nhóm thông điệp chính của ICMP (Cả IPv4 và IPv6): 1) **Kiểm tra máy đích còn sống không (Host Reachability)**: Gửi gói hỏi `Echo Request` (IPv4 Type 8 / IPv6 Type 128) và nhận gói trả lời `Echo Reply` (IPv4 Type 0 / IPv6 Type 129) — chính là lệnh `ping`. 2) **Báo không đến được đích (Destination Unreachable)**: Báo rõ lý do tại sao gói tin bị chặn hoặc cụt đường. 3) **Báo hết thời gian sống (Time Exceeded)**: Khi trường `TTL` (IPv4) hoặc `Hop Limit` (IPv6) bị trừ về bằng `0`, Router sẽ hủy gói tin và gửi thư báo Time Exceeded về cho máy gửi.",
                               "Các mã lỗi Destination Unreachable hay hỏi thi nhất: • **Trong ICMPv4**: Mã `0` = *Net Unreachable* (Router không có đường đi tới mạng đó trong bảng định tuyến); Mã `1` = *Host Unreachable* (Gói tin đã tới được Router nối với mạng LAN đích, nhưng gọi ARP không thấy máy PC đích trả lời — do máy đích tắt nguồn hoặc đặt sai IP); Mã `2` = *Protocol Unreachable*; Mã `3` = *Port Unreachable* (Dịch vụ chưa bật). • **Trong ICMPv6**: Mã `0` = *No route*; Mã `1` = *Administratively prohibited* (Bị chặn bởi Tường lửa Firewall hoặc danh sách cấm ACL!); Mã `3` = *Address unreachable*; Mã `4` = *Port unreachable*.",
                               "4 Bản tin đặc quyền chỉ có ở ICMPv6 (Giao thức NDP): Trong mạng IPv6, ICMPv6 gánh luôn việc của cả DHCP và ARP nhờ 4 bản tin: • **RS (Router Solicitation)** \u0026 **RA (Router Advertisement)**: Máy trạm hỏi xin thông tin mạng và Router phát quảng bá thông số mạng `/64` (dùng cấp IP tự động SLAAC); • **NS (Neighbor Solicitation)** \u0026 **NA (Neighbor Advertisement)**: Dùng để tìm địa chỉ MAC (thay thế hoàn toàn cho ARP) và dùng để **Kiểm tra trùng địa chỉ IP (DAD - Duplicate Address Detection)** trước khi nhận IP mới.",
                               "Quy trình 3 Bước Chẩn đoán mạng chuẩn bằng lệnh `ping`: Khi một máy tính báo mất mạng, hãy gõ `ping` theo thứ tự từ gần ra xa: 1) `ping 127.0.0.1` (hoặc `ping ::1`): Kiểm tra phần mềm TCP/IP trên chính máy đó còn tốt không; 2) `ping 192.168.1.1` (IP của Default Gateway): Kiểm tra dây cáp mạng, Switch và cổng Router nội bộ; 3) `ping 8.8.8.8` (IP ngoài mạng từ xa): Kiểm tra đường định tuyến ra Internet.",
                               "Nguyên lý hoạt động cực thông minh của lệnh `tracert` / `traceroute`: Làm sao máy bạn biết được trên đường tới Google phải đi qua những Router nào? `tracert` cố tình gắn **`TTL = 1`** vào gói tin đầu tiên -\u003e Vừa chạm vào Router số 1, TTL bị trừ đi 1 về `0`, Router 1 buộc phải hủy gói tin và gửi biên bản **ICMP Time Exceeded** về cho bạn (nhờ tờ biên bản này bạn biết được IP của Router 1!). Tiếp theo máy bạn gửi gói thứ hai với **`TTL = 2`** để lấy IP của Router 2, rồi **`TTL = 3`** lấy IP của Router 3... cho đến khi chạm tới đích cuối cùng!"
                           ],
        "realWorldExample":  "Scenario: Reading Cisco IOS `ping` symbols vs. Windows `tracert`:\n• On a Cisco Router, when you run `Router# ping 192.168.30.10`, it sends 5 ICMP probes:\n  - `.!!!!` -\u003e The first packet timed out (`.`) while waiting for ARP resolution, and the next 4 succeeded (`!`).\n  - `U.U.U` -\u003e `U` means an intermediary router returned an **ICMP Destination Unreachable** message (either missing a route in `show ip route`, or blocked by an ACL)!",
        "realWorldExample_vi":  "Ví dụ thực tế giải mã các ký hiệu khi gõ `ping` trên Router Cisco:\nKhi bạn ngồi trên Router gõ `R1# ping 192.168.20.10`, màn hình không hiện chữ `Reply from...` như Windows mà hiện 5 ký tự viết tắt cho 5 gói tin:\n• **`!!!!!` (5 dấu chấm than)**: Thành công mỹ mãn 100% (5/5 gói nhận được Echo Reply).\n• **`.!!!!` (1 dấu chấm và 4 dấu chấm than)**: Gói đầu tiên bị quá giờ (`.`) do Router phải chờ hỏi địa chỉ MAC qua giao thức ARP, 4 gói sau đã có ARP nên thông suốt (`!`).\n• **`.....` (5 dấu chấm)**: Rớt mạng hoàn toàn 0% (Request timed out — gói tin đi không về, hoặc máy đích bật tường lửa chặn ICMP, hoặc thiếu đường về Return Route).\n• **`U.U.U` (Chữ U xen kẽ dấu chấm)**: Chữ **`U` (Unreachable)** báo hiệu có một Router trên đường đi gửi trả về bản tin **ICMP Destination Unreachable** — nhìn thấy chữ `U` là biết ngay Router trên đường đi chưa được cấu hình đường định tuyến (`show ip route`) tới mạng đích hoặc đang có ACL chặn!",
        "diagramType":  "icmp-traceroute",
        "commands":  [
                         "C:\\\u003e ping 127.0.0.1                        # Bước 1: Kiểm tra chồng giao thức TCP/IP nội bộ trên chính máy tính (Loopback)",
                         "C:\\\u003e ping ::1                              # Bước 1 (IPv6): Kiểm tra chồng giao thức IPv6 nội bộ trên máy tính",
                         "C:\\\u003e ping 192.168.1.1                      # Bước 2: Kiểm tra kết nối LAN từ máy tính tới Default Gateway (Router nội bộ)",
                         "Router# ping 192.168.20.10                 # Ping từ Router Cisco: \u0027!\u0027 = Thành công | \u0027.\u0027 = Hết giờ (Timeout) | \u0027U\u0027 = Unreachable (Thiếu route/ACL chặn)",
                         "Router# traceroute 10.1.1.10               # Truy vết từng trạm Router trên đường đi từ thiết bị Cisco IOS",
                         "C:\\\u003e tracert 8.8.8.8                       # Truy vết từng trạm Router từ máy tính Windows ra Internet (nhờ tăng dần TTL = 1, 2, 3...)"
                     ],
        "comparisonTable":  {
                                "title_vi":  "Bảng Mã Lỗi ICMPv4 \u0026 ICMPv6 (Destination Unreachable, Time Exceeded \u0026 NDP) Chuẩn Đề Thi CCNA",
                                "headers_vi":  [
                                                   "Tên Thông Điệp / Mã Lỗi",
                                                   "Mã Trong ICMPv4",
                                                   "Mã Trong ICMPv6",
                                                   "Nguyên Nhân Thực Tế Khi Gặp Lỗi Này"
                                               ],
                                "rows":  [
                                             [
                                                 "Echo Request / Echo Reply (`ping`)",
                                                 "Type **8** (Request) / Type **0** (Reply)",
                                                 "Type **128** (Request) / Type **129** (Reply)",
                                                 "Kiểm tra máy đích có hoạt động và thông đường Tầng 3 hay không."
                                             ],
                                             [
                                                 "Net / No Route Unreachable",
                                                 "Type 3, **Code 0** (*Net Unreachable*)",
                                                 "Type 1, **Code 0** (*No route to destination*)",
                                                 "Router nhận được gói tin nhưng **trong bảng định tuyến (`show ip route`) không có đường đi** tới mạng đích và không có Default Route."
                                             ],
                                             [
                                                 "Host / Address Unreachable",
                                                 "Type 3, **Code 1** (*Host Unreachable*)",
                                                 "Type 1, **Code 3** (*Address unreachable*)",
                                                 "Gói tin đã tới được Router nối trực tiếp với mạng LAN đích, nhưng **Router gọi ARP / NS không thấy máy đích trả lời** (máy đích tắt nguồn hoặc sai IP)."
                                             ],
                                             [
                                                 "Administratively Prohibited (Firewall/ACL)",
                                                 "Type 3, Code 9 / 10 / 13",
                                                 "Type 1, **Code 1** (*Administratively prohibited*)",
                                                 "Gói tin bị **chặn bởi danh sách kiểm soát truy cập (ACL)** trên Router hoặc bị Tường lửa (Firewall) chặn!"
                                             ],
                                             [
                                                 "Port / Protocol Unreachable",
                                                 "Type 3, **Code 2** (Protocol) / **Code 3** (Port)",
                                                 "Type 1, **Code 4** (*Port unreachable*)",
                                                 "Máy đích vẫn sống nhưng **chưa bật dịch vụ (Port)** mà máy gửi yêu cầu (dùng để kết thúc lệnh `traceroute` bằng UDP trên Cisco IOS)."
                                             ],
                                             [
                                                 "Time Exceeded (Hết hạn TTL / Hop Limit)",
                                                 "Type **11**, Code 0 (`TTL = 0`)",
                                                 "Type **3**, Code 0 (`Hop Limit = 0`)",
                                                 "Gói tin bị lặp vòng (Routing Loop) giữa các Router hoặc đang chạy lệnh **`tracert` / `traceroute`**."
                                             ]
                                         ]
                            },
        "jobSkills_vi":  [
                             "Kinh nghiệm Đi Làm 1 — Kỹ thuật `Extended Ping` (Ping mở rộng chọn nguồn IP) trên Router Cisco: Khi đi làm, giả sử từ Router R1 bạn gõ `ping 192.168.20.10` (máy chủ ở chi nhánh 2) thấy báo thành công `!!!!!`, nhưng nhân viên ngồi ở mạng LAN của R1 (`192.168.10.0/24`) lại kêu không vào được máy chủ đó! Tại sao? Vì khi bạn gõ `ping` bình thường trên R1, Router sẽ lấy **IP của cổng WAN nối với R2** làm `Source IP` (nên R2 biết đường trả về), nhưng R2 lại **thiếu đường định tuyến quay về mạng LAN `192.168.10.0/24`**! Để đứng trên Router R1 mà giả lập chính xác gói tin xuất phát từ mạng LAN `192.168.10.1`, kỹ sư mạng gõ: **`R1# ping 192.168.20.10 source 192.168.10.1`** (hoặc gõ `ping` rồi bấm Enter để vào chế độ *Extended Ping*)!",
                             "Kinh nghiệm Đi Làm 2 — Sự khác biệt giữa `tracert` trên Windows và `traceroute` trên Cisco IOS / Linux: Trên máy tính **Windows**, lệnh `tracert` gửi các gói tin **ICMP Echo Request** (tăng dần TTL = 1, 2, 3...). Nhưng trên **Router Cisco và Linux**, lệnh `traceroute` mặc định lại gửi các gói tin **UDP tới cổng ngẫu nhiên cực cao (`Port 33434` trở lên)**! Khi chạm tới máy chủ đích cuối cùng, vì không có phần mềm nào mở cổng UDP 33434 cả, máy chủ đích sẽ trả về bản tin **`ICMP Port Unreachable`** — nhờ đó Router Cisco biết đã chạm tới đích cuối cùng!",
                             "Kinh nghiệm Đi Làm 3 — Tại sao Ping vào máy tính đồng nghiệp báo `Request timed out` dù 2 máy vẫn copy file bình thường? Trên Windows 10/11 và Windows Server, khi bạn chọn cấu hình mạng là *Public Network*, **Tường lửa Windows Defender Firewall mặc định chặn gói tin `ICMP Echo Request` (chặn Ping)** để tránh bị hacker quét mạng! Do đó nếu thấy máy đồng nghiệp vẫn vào mạng bình thường hoặc bảng `arp -a` vẫn hiện địa chỉ MAC của máy đó mà `ping` không trả lời, nguyên nhân 100% là do **Windows Firewall trên máy đích đang chặn ICMP**!"
                         ],
        "quiz":  [
                     {
                         "question_vi":  "Câu 1 (Đề thi CCNA): Khi kỹ sư mạng thực hiện lệnh `ping 10.2.2.50` từ Router R1 và nhận được kết quả trên màn hình là `U.U.U`, ký tự `U` này cho biết điều gì đang xảy ra?",
                         "options_vi":  [
                                            "A. Kết nối thành công 100% (Up).",
                                            "B. Một Router trên đường đi đã trả về thông điệp **ICMP Destination Unreachable** (do không có tuyến đường tới mạng `10.2.2.0` trong bảng định tuyến hoặc bị chặn bởi ACL).",
                                            "C. Cổng mạng trên Router R1 đang bị tắt (`shutdown`).",
                                            "D. Đang sử dụng giao thức UDP."
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B. Trên Cisco IOS: Dấu chấm than `!` là nhận được Echo Reply thành công; dấu chấm `.` là hết thời gian chờ (Timeout); còn chữ `U` (Unreachable) có nghĩa là một Router dọc đường đã gửi trả về bản tin **ICMP Destination Unreachable** báo không thể chuyển tiếp gói tin."
                     },
                     {
                         "question_vi":  "Câu 2 (Đề thi CCNA): Tiện ích `tracert` (hoặc `traceroute`) sử dụng trường nào trong IP Header và thông điệp ICMP nào trả về từ các Router trung gian để xác định danh sách từng trạm Router trên đường đi tới đích?",
                         "options_vi":  [
                                            "A. Trường DSCP và thông điệp ICMP Echo Reply.",
                                            "B. Tăng dần trường **TTL (Time to Live / Hop Limit)** từ `1, 2, 3...` và lắng nghe thông điệp **ICMP Time Exceeded** trả về từ mỗi Router khi TTL giảm về `0`.",
                                            "C. Trường Source Port và bản tin ARP Reply.",
                                            "D. Bản tin ICMPv6 Router Solicitation."
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B. `traceroute` đặt `TTL=1` ở lượt đầu để buộc Router thứ 1 trừ TTL về `0` và gửi trả lại biên bản lỗi `ICMP Time Exceeded` (nhờ Source IP của biên bản này mà biết được IP của Router 1), sau đó tăng lên `TTL=2` cho Router 2, `TTL=3` cho Router 3..."
                     },
                     {
                         "question_vi":  "Câu 3 (Đề thi CCNA): Bản tin nào của giao thức ICMPv6 được một thiết bị sử dụng để kiểm tra xem địa chỉ IPv6 mà nó vừa tự tạo ra (hoặc vừa được gán) đã có thiết bị nào khác trong cùng mạng LAN sử dụng hay chưa (quy trình **DAD - Duplicate Address Detection**)?",
                         "options_vi":  [
                                            "A. ICMPv6 Router Solicitation (RS)",
                                            "B. ICMPv6 Neighbor Solicitation (NS)",
                                            "C. ICMPv6 Echo Request",
                                            "D. ICMPv6 Time Exceeded"
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B (Neighbor Solicitation - NS). Trước khi chính thức sử dụng một địa chỉ IPv6 Unicast mới, thiết bị sẽ gửi một bản tin **NS** hỏi chính địa chỉ IPv6 của mình (gọi là DAD): nếu không có ai trả lời bản tin NA nghĩa là địa chỉ đó duy nhất và an toàn để dùng!"
                     }
                 ],
        "beginnerGuide_vi":  [
                                 "1. Tại sao khi mạng bị lỗi, việc đầu tiên mọi người làm đều là mở màn hình đen CMD lên và gõ lệnh `ping`? Hãy tưởng tượng bạn gọi điện cho bạn bè mà không biết điện thoại của họ còn pin hay đã tắt máy: Lệnh **`ping`** sẽ gửi đi 4 gói tin nhỏ xíu tên là **ICMP Echo Request** (giống như gõ cửa hỏi *\u0027Bạn ơi có ở nhà không?\u0027*). Nếu máy tính bên kia còn sống và đường dây thông suốt, nó sẽ lập tức gửi trả về 4 gói tin **ICMP Echo Reply** (*\u0027Tôi đang ở nhà đây, thời gian đi-về mất 5 mili-giây!\u0027*). Chỉ cần nhìn kết quả `ping`, bạn biết ngay đường mạng có thông hay không!",
                                 "2. Nếu `ping` tới một trang web ở xa bị báo lỗi đứt mạng, làm sao biết nó bị đứt ở đoạn dây trong phòng bạn, đứt ở Router công ty hay đứt ngoài cáp quang biển của nhà mạng? Đó là lúc bạn dùng câu lệnh thứ hai: **`tracert`** (trên Windows) hoặc **`traceroute`** (trên Router Cisco)! Lệnh này sẽ liệt kê ra **từng trạm Router một (Trạm 1 -\u003e Trạm 2 -\u003e Trạm 3...)** mà gói tin đi qua. Hễ tới trạm số mấy mà bắt đầu hiện toàn dấu sao `* * * Request timed out` thì chính xác là đường mạng đang bị đứt hoặc bị chặn ngay sau trạm đó!",
                                 "3. Tại sao lại có con số `127.0.0.1` (Loopback) kỳ lạ — tự `ping` chính mình để làm gì? Địa chỉ `127.0.0.1` (hoặc `::1` trong IPv6) là địa chỉ chỉ vào chính bản thân chiếc máy tính bạn đang ngồi. Khi bạn gõ `ping 127.0.0.1`, gói tin không hề đi ra dây cáp mạng mà tự vòng lại bên trong hệ điều hành Windows để kiểm tra xem phần mềm mạng (TCP/IP) và driver card mạng của máy bạn có bị lỗi phần mềm hay không!",
                                 "4. Trình tự 4 bước Ping chuẩn mực để tự bắt bệnh khi máy tính mất mạng: Khi ngồi trước một máy tính không vào được mạng, hãy mở cmd và gõ ping theo đúng 4 nấc thang từ gần ra xa: • **Nấc 1 (ping 127.0.0.1)**: Kiểm tra bộ giao thức TCP/IP ngay trong máy mình. • **Nấc 2 (ping \u003cIP của máy cùng phòng\u003e)**: Kiểm tra dây cáp mạng và Switch nội bộ (Tầng 1 \u0026 Tầng 2). • **Nấc 3 (ping \u003cIP Default Gateway - ví dụ 192.168.1.1\u003e)**: Kiểm tra xem máy mình đã nối thông tới cửa ngõ Router chưa. • **Nấc 4 (ping 8.8.8.8)**: Kiểm tra xem Router đã định tuyến thông ra ngoài Internet chưa. Nếu Nấc 4 thông mà gõ ping google.com báo lỗi thì chắc chắn 100% là lỗi **DNS**!",
                                 "5. Hiểu rõ thông báo lỗi Request timed out vs. Destination host unreachable khi gõ lệnh Ping trên Windows: • **Request timed out (Hết giờ chờ phản hồi)**: Máy tính của bạn đã gửi gói tin đi vào mạng, nhưng chờ hết 4 giây không thấy tăm hơi gói trả lời quay về (thường do máy đích bị tắt nguồn, bật Tường lửa Windows Firewall chặn ICMP, hoặc Router chiều về không biết đường trả lại). • **Reply from 192.168.1.x: Destination host unreachable (Không tìm thấy máy đích)**: Nếu báo từ chính IP máy bạn nghĩa là chưa tìm được ARP của máy đích trong LAN; nếu báo từ IP của Router nghĩa là Router không có tuyến đường (Route) tới mạng đích."
                             ],
        "beginnerGuide_en":  [
                                 "1. What happens when you type `ping`? The `ping` command sends **ICMP Echo Request** packets to a target IP address asking *\u0027Are you reachable?\u0027*. If the target is online and the network path is working, it replies with **ICMP Echo Reply** packets and displays the Round-Trip Time (RTT) in milliseconds.",
                                 "2. What is `tracert` / `traceroute` used for? While `ping` only tells you if the final destination succeeded or failed, `tracert` maps out **every single router hop along the path** (Hop 1, Hop 2, Hop 3...). If a connection fails, `tracert` shows you the exact router where packets stop flowing!",
                                 "3. Why `ping 127.0.0.1` (Loopback)? `127.0.0.1` (and `::1` in IPv6) points back to your own computer\u0027s internal TCP/IP stack. Pinging it verifies that your operating system\u0027s networking software is functioning properly, even if no cable is plugged in."
                             ],
        "advancedTopics_vi":  [
                                  "Mở rộng Nâng cao 1 — Giải phẫu cơ chế `Extended Ping` và `Extended Traceroute` trên Router Cisco khi đi làm: Khi bạn gõ lệnh `ping 192.168.20.10` thông thường trên Router R1, Router sẽ tự động lấy **Địa chỉ IP của cổng xuất gần đích nhất (ví dụ cổng WAN `10.1.1.1`)** làm `Source IP`. Điều này rất dễ đánh lừa kỹ sư mạng: vì cổng WAN ping thông nhưng các máy tính trong mạng LAN (`192.168.10.0/24`) lại không đi được! Để kiểm tra chính xác bảng định tuyến chiều đi lẫn chiều về của mạng LAN, bạn gõ lệnh `ping` (không kèm IP) rồi bấm Enter để vào chế độ **Extended Ping**, điền `Source address or interface: 192.168.10.1` (hoặc gõ tắt 1 dòng: **`R1# ping 192.168.20.10 source g0/0/0 repeat 100 size 1500`**)!",
                                  "Mở rộng Nâng cao 2 — Tấn công ICMP Flood / Smurf Attack và Lý do các Quản trị viên Chặn ICMP ở Biên mạng: Kẻ tấn công có thể lợi dụng ICMP bằng cách gửi hàng triệu gói `ICMP Echo Request` có gắn `Source IP giả mạo` là IP của máy chủ nạn nhân vào địa chỉ Broadcast của một mạng lớn (gọi là *Smurf Attack* hoặc *Ping Flood*), khiến hàng trăm máy tính cùng dội bão `Echo Reply` làm sập máy chủ nạn nhân. Vì vậy, trên Tường lửa (Firewall) biên của doanh nghiệp, kỹ sư thường **cho phép `Echo Reply` đi vào nhưng chặn `Echo Request` từ ngoài Internet ping vào trong LAN**!",
                                  "Mở rộng Nâng cao 3 — Khám phá Kích thước Gói tin Tối đa trên Đường truyền (Path MTU Discovery - PMTUD) nhờ ICMP: Khi máy chủ gửi một gói tin kích thước lớn (1500 Bytes) có bật cờ **DF (Don\u0027t Fragment - Cấm cắt mảnh)** đi qua một đoạn đường hầm VPN chỉ cho phép tối đa 1400 Bytes, Router tại nút thắt cổ chai đó sẽ hủy gói tin và gửi trả về bản tin **ICMP Type 3 Code 4 (Fragmentation Needed and DF Set)** kèm thông số MTU=1400. Nhờ bản tin ICMP này, máy gửi tự động điều chỉnh thu nhỏ kích thước gói xuống 1400 Bytes để đi lọt qua đường hầm! Đây là lý do quản trị viên không được chặn mù quáng toàn bộ giao thức ICMP trên Firewall."
                              ],
        "advancedTopics_en":  [
                                  "Advanced Expansion 1 — Cisco IOS Extended Ping (`ping \u003cdest\u003e source \u003cinterface\u003e`): A standard `ping` from a router uses the exit WAN interface IP as the Source IP, which doesn\u0027t test whether remote routers have a return route back to your internal LAN subnet! Using **Extended Ping (`ping 192.168.20.10 source g0/0/0`)** forces the router to send the ping from its internal LAN IP address.",
                                  "Advanced Expansion 2 — ICMP Security \u0026 Firewall Filtering: Attackers use ICMP for Ping Sweeps (reconnaissance) and ICMP Flood / Smurf DDoS attacks. Enterprise firewalls typically allow outbound `Echo Requests` and inbound `Echo Replies` so internal admins can ping out, while blocking unsolicited inbound `Echo Requests` from the Internet."
                              ]
    },
    {
        "id":  14,
        "title":  "Transport Layer",
        "title_vi":  "Tầng Giao Vận: Giao Thức TCP, UDP và Số Hiệu Cổng",
        "overview":  "Module 14 covers OSI Layer 4 (Transport Layer), which manages logical end-to-end conversations between applications running on hosts. While Layer 3 (IP) gets a packet to the right computer, Layer 4 (TCP and UDP) uses **16-bit Port Numbers** to deliver the data to the exact application window (browser tab, email client, Zoom call, or DNS service) on that computer. You will compare **TCP (Transmission Control Protocol)**—which guarantees delivery via the 3-Way Handshake, Sequence Numbers, ACKs, and Sliding Windows—against **UDP (User Datagram Protocol)**—which prioritizes speed and minimal overhead for real-time voice, video, DNS, and DHCP.",
        "overview_vi":  "Module 14 đi sâu vào Tầng 4 OSI (Transport Layer) — tầng chịu trách nhiệm kết nối trực tiếp giữa các phần mềm ứng dụng. Nếu Tầng 3 (Địa chỉ IP) giúp người đưa thư tìm đúng **Địa chỉ tòa nhà (Máy tính)**, thì Tầng 4 (Số hiệu cổng **Port Number**) giúp giao tận tay cho đúng **Người nhận ở Phòng ban cụ thể (Trình duyệt Web, Game, Zalo, hay Email)** bên trong máy tính đó! Tầng 4 cung cấp 2 giao thức có tính cách trái ngược nhau hoàn toàn: **TCP (Transmission Control Protocol)** — anh chàng cẩn thận, bắt tay 3 bước trước khi nói chuyện, đánh số thứ tự từng trang, mất trang nào bắt gửi lại trang đó; và **UDP (User Datagram Protocol)** — anh chàng tốc độ, cứ thế bắn dữ liệu đi nhanh nhất có thể không cần bắt tay hay chờ báo nhận, cực kỳ lý tưởng cho gọi thoại VoIP, họp Video trực tuyến, chơi Game online, DNS và DHCP.",
        "analogy_vi":  "Hãy so sánh **TCP** và **UDP** ngoài đời thực: • **TCP** giống như gửi **Thư Bảo Đảm có Ký Nhận**: Trước khi gửi phải gọi điện xác nhận người nhận có ở nhà không (**Bắt tay 3 bước: SYN -\u003e SYN/ACK -\u003e ACK**); mỗi thùng hàng đều đánh số thứ tự `1/10, 2/10...` (**Sequence Number**); người nhận kiểm đếm đủ mới ký giấy báo nhận (**ACK**), nếu thùng số 3 bị rơi dọc đường thì người gửi phải gửi bù lại thùng số 3 (**Retransmission**). Rất an toàn nhưng tốn thời gian! • **UDP** giống như **Phát sóng Truyền hình Trực tiếp / Gọi điện thoại**: Người nói cứ nói liên tục vào micro không chờ ký nhận — nếu rớt mất 0.1 giây âm thanh trên đường truyền thì bỏ qua luôn để nói tiếp câu hiện tại (chứ nếu bắt dừng lại phát lại câu của 5 giây trước thì cuộc trò chuyện sẽ bị trễ và loạn xạ ngay!).",
        "keyConcepts":  [
                            "TCP vs. UDP Head-to-Head Comparison: • **TCP (Protocol 6)**: Connection-oriented, Reliable, Stateful, 20-byte header (minimum), uses 3-Way Handshake, Sequence Numbers (reorders out-of-order segments), Acknowledgments (ACKs + retransmission of lost segments), and Flow Control (Window Size). Used by: HTTP (80), HTTPS (443), SSH (22), Telnet (23), FTP (20/21), SMTP (25), POP3 (110), IMAP (143). • **UDP (Protocol 17)**: Connectionless, Best-Effort / Unreliable, Stateless, tiny 8-byte header, zero handshake delay, no retransmission delay. Used by: DNS (53), DHCP (67/68), TFTP (69), SNMP (161/162), VoIP \u0026 Live Video Streaming.",
                            "The TCP 3-Way Handshake (Connection Establishment): Before sending a single byte of application data, TCP establishes a session in 3 steps: 1) **Client sends `SYN`** (Synchronize sequence number, e.g., `SEQ = 100`); 2) **Server replies `SYN + ACK`** (acknowledges client with `ACK = 101` and sends its own `SEQ = 300`); 3) **Client replies `ACK`** (`ACK = 301`). Connection is now `ESTABLISHED`! (Closing a session uses a 4-step `FIN -\u003e ACK -\u003e FIN -\u003e ACK` exchange).",
                            "16-Bit Port Numbers \u0026 The 3 IANA Port Ranges (Exam Must-Know!): Every TCP/UDP header has a **Source Port** (randomly chosen by the client OS) and a **Destination Port** (identifies the server service): 1) **Well-Known Ports (`0` to `1023`)**: Reserved for standard services (HTTP 80, HTTPS 443, SSH 22, DNS 53); 2) **Registered Ports (`1024` to `49151`)**: Assigned to vendor applications (e.g., Cisco RADIUS 1812, MySQL 3306, RDP 3389); 3) **Dynamic / Private / Ephemeral Ports (`49152` to `65535`)**: Temporarily allocated as the **Source Port** when your PC opens a connection.",
                            "What is a Socket \u0026 How Multiplexing Works: A **Socket** is the combination of an `IP Address : Port Number` (e.g., `192.168.1.10:50123`). Because every browser tab on your PC picks a unique Ephemeral Source Port (`50123`, `50124`, `50125`), your PC can download a file, load 10 web pages, and chat on Discord simultaneously over a single IP address without mixing up the returning packets!",
                            "TCP Reliability \u0026 Flow Control (SEQ, ACK, Window Size): **Sequence Numbers** ensure that even if segments take different router paths and arrive out of order (`Segment 1, Segment 3, Segment 2`), TCP reassembles them in exact order (`1, 2, 3`) before handing data to the application. **Window Size (Sliding Window)** tells the sender how many bytes the receiver\u0027s buffer can accept at once before requiring an ACK—if the receiver is busy, it shrinks the Window Size so the sender slows down (Flow Control)."
                        ],
        "keyConcepts_vi":  [
                               "Bảng so sánh đối đầu TCP và UDP (Câu hỏi tủ trong mọi đề thi CCNA): • **TCP (Header tối thiểu 20 Bytes — An toàn tuyệt đối)**: Hướng kết nối (phải bắt tay 3 bước trước khi truyền), Đáng tin cậy (mất gói tin sẽ tự động gửi lại), Đánh số thứ tự `Sequence Number` (gói tin đi nhiều đường đến lộn xộn vẫn xếp lại đúng thứ tự 1-2-3), Điều khiển luồng bằng `Window Size`. Dùng cho các ứng dụng không được phép sai sót dù chỉ 1 chữ cái: **Web (HTTP 80 / HTTPS 443), Email (SMTP 25, POP3 110, IMAP 143), Điều khiển từ xa (SSH 22, Telnet 23), Truyền file (FTP 20/21)**. • **UDP (Header siêu nhẹ chỉ 8 Bytes — Tốc độ tối đa)**: Không kết nối trước, Không báo nhận ACK, Không gửi lại gói mất, Không làm trễ đường truyền. Dùng cho: **Gọi thoại VoIP, Họp Video Zoom/Teams, Game Online, Phân giải tên miền DNS (53), Xin IP tự động DHCP (67/68), TFTP (69), SNMP (161/162)**.",
                               "Quy trình Bắt tay 3 bước của TCP (TCP 3-Way Handshake): Trước khi trình duyệt gửi yêu cầu tải trang web, TCP thực hiện 3 bước chào hỏi: • **Bước 1 (`SYN`)**: Máy khách gửi gói tin bật cờ `SYN` (kèm số thứ tự ban đầu `SEQ = 100`, ý hỏi: *\u0027Server ơi, tôi muốn nói chuyện, bắt đầu từ trang 100 nhé?\u0027*). • **Bước 2 (`SYN + ACK`)**: Server trả lời gói bật cả 2 cờ `SYN` và `ACK` (báo nhận `ACK = 101` nghĩa là *\u0027Đã nghe rõ trang 100, chờ trang 101 của bạn\u0027*, đồng thời gửi số thứ tự của Server `SEQ = 300`). • **Bước 3 (`ACK`)**: Máy khách gửi gói `ACK = 301` xác nhận hoàn tất -\u003e Đường truyền chính thức mở (`ESTABLISHED`)! (Khi kết thúc cuộc trò chuyện sẽ dùng 4 bước vẫy tay chào: `FIN -\u003e ACK -\u003e FIN -\u003e ACK`).",
                               "3 Dải Số hiệu Cổng (Port Numbers — 16 bit từ 0 đến 65535): Mỗi gói tin Tầng 4 đều mang **Source Port (Cổng nguồn)** và **Destination Port (Cổng đích)**: 1) **Well-Known Ports (`0` – `1023`)**: Cổng chuẩn quốc tế cố định cho các dịch vụ máy chủ phổ biến (Web=80/443, SSH=22, DNS=53...); 2) **Registered Ports (`1024` – `49151`)**: Cổng đăng ký cho các phần mềm hãng thứ ba (SQL Server, RDP, Game...); 3) **Dynamic / Private Ports (`49152` – `65535`)**: Cổng động tạm thời — mỗi khi bạn mở 1 tab trình duyệt trên PC, Windows sẽ bốc ngẫu nhiên 1 con số trong dải `49152–65535` làm **Source Port** cho tab đó!",
                               "Khái niệm Socket (Ổ cắm mạng): Khi ghép **Địa chỉ IP + Số hiệu Port** lại với nhau (ví dụ `192.168.1.10:49500`) ta gọi đó là một **Socket**. Nhờ mỗi cửa sổ phần mềm trên máy tính giữ một Source Port khác nhau, khi máy chủ trả dữ liệu về cùng một địa chỉ IP `192.168.1.10`, hệ điều hành nhìn vào số Port để phân phát chính xác dữ liệu Web vào Chrome, dữ liệu Nhạc vào Spotify, dữ liệu Tin nhắn vào Zalo mà không bao giờ bị nhầm lẫn!",
                               "Cơ chế Đánh số báo nhận (Expectational ACK) \u0026 Cửa sổ trượt (Window Size): Trong TCP, nếu máy nhận trả lời `ACK = 5001`, điều đó có nghĩa là: *\u0027Tôi đã nhận đầy đủ, nguyên vẹn mọi byte đến hết byte 5000, bây giờ làm ơn gửi tiếp cho tôi bắt đầu từ byte thứ 5001!\u0027*. Còn trường **Window Size** cho phép máy nhận bảo máy gửi: *\u0027Bộ nhớ đệm RAM của tôi đang rảnh 64KB, bạn cứ gửi liền một mạch 64KB đi rồi mới cần dừng lại chờ tôi ký nhận ACK 1 lần\u0027* — giúp tăng tốc độ truyền lên gấp nhiều lần."
                           ],
        "realWorldExample":  "Scenario: On your PC (`192.168.1.10`), you open two browser tabs to the same HTTPS Web Server (`203.0.113.5`).\n• **Tab 1** opens a TCP connection using Socket Pair: Source `192.168.1.10:49152` -\u003e Destination `203.0.113.5:443` (HTTPS).\n• **Tab 2** opens a TCP connection using Socket Pair: Source `192.168.1.10:49153` -\u003e Destination `203.0.113.5:443` (HTTPS).\n• When the Web Server sends packets back, it swaps the ports: packets with Destination Port `49152` go straight to Tab 1, and packets with Destination Port `49153` go straight to Tab 2!",
        "realWorldExample_vi":  "Ví dụ thực tế cách Số hiệu Port (Port Number) phân biệt các tab trình duyệt trên máy tính của bạn:\nGiả sử máy tính của bạn có IP `192.168.1.10`. Bạn mở Chrome bật **Tab 1** đọc báo và **Tab 2** xem tin tức trên cùng một máy chủ Web có IP `203.0.113.5` (chạy dịch vụ HTTPS cổng chuẩn `443`):\n• **Ở Tab 1**: Windows tự bốc cổng nguồn ngẫu nhiên `49152`, gửi gói tin đi với cặp địa chỉ: `Nguồn 192.168.1.10:49152 ---\u003e Đích 203.0.113.5:443`.\n• **Ở Tab 2**: Windows tự bốc cổng nguồn kế tiếp `49153`, gửi gói tin đi với cặp địa chỉ: `Nguồn 192.168.1.10:49153 ---\u003e Đích 203.0.113.5:443`.\n• **Khi Máy chủ Web trả dữ liệu về**: Máy chủ đảo ngược chiều Port lại! Gói tin nào ghi `Đích 192.168.1.10:49152` sẽ hiện ra đúng ở màn hình **Tab 1**, còn gói nào ghi `Đích 192.168.1.10:49153` sẽ hiện ra đúng ở **Tab 2**!",
        "diagramType":  "tcp-handshake",
        "commands":  [
                         "Bảng Cổng TCP chuẩn (Well-Known TCP Ports): 20/21=FTP | 22=SSH | 23=Telnet | 25=SMTP | 53=DNS(Zone) | 80=HTTP | 110=POP3 | 143=IMAP | 443=HTTPS",
                         "Bảng Cổng UDP chuẩn (Well-Known UDP Ports): 53=DNS(Truy vấn) | 67=DHCP Server | 68=DHCP Client | 69=TFTP | 123=NTP | 161/162=SNMP",
                         "3 Dải Port IANA: 0 - 1023 (Well-Known) | 1024 - 49151 (Registered) | 49152 - 65535 (Dynamic/Private - Dùng làm Source Port)",
                         "C:\\\u003e netstat                               # Xem danh sách các kết nối TCP đang hoạt động trên máy tính",
                         "C:\\\u003e netstat -ano                          # Xem toàn bộ kết nối TCP/UDP bằng số IP:Port kèm mã tiến trình PID của từng phần mềm"
                     ],
        "comparisonTable":  {
                                "title_vi":  "Bảng Tra Cứu Tổng Hợp Số Hiệu Cổng (Port Numbers) \u0026 So Sánh Chi Tiết TCP vs. UDP",
                                "headers_vi":  [
                                                   "Số Cổng (Port)",
                                                   "Giao Thức Tầng 4",
                                                   "Tên Dịch Vụ Tầng 7",
                                                   "Chức Năng \u0026 Ghi Chú Quan Trọng Khi Thi CCNA"
                                               ],
                                "rows":  [
                                             [
                                                 "**Port 20 \u0026 Port 21**",
                                                 "**TCP**",
                                                 "**FTP** (File Transfer Protocol)",
                                                 "Port **21** dùng để Điều khiển/Đăng nhập; Port **20** dùng để Truyền dữ liệu file."
                                             ],
                                             [
                                                 "**Port 22**",
                                                 "**TCP**",
                                                 "**SSH** (Secure Shell) / SFTP",
                                                 "Điều khiển dòng lệnh CLI từ xa **có mã hóa bảo mật** (thay thế Telnet)."
                                             ],
                                             [
                                                 "**Port 23**",
                                                 "**TCP**",
                                                 "**Telnet**",
                                                 "Điều khiển CLI từ xa **KHÔNG mã hóa** (lộ mật khẩu plaintext — không dùng trong thực tế)."
                                             ],
                                             [
                                                 "**Port 25**",
                                                 "**TCP**",
                                                 "**SMTP** (Simple Mail Transfer Protocol)",
                                                 "Dùng để **GỬI email** từ máy khách lên Server và chuyển tiếp giữa các Mail Server."
                                             ],
                                             [
                                                 "**Port 53**",
                                                 "**UDP \u0026 TCP**",
                                                 "**DNS** (Domain Name System)",
                                                 "Phân giải tên miền ra IP. Dùng **UDP 53** cho truy vấn thường (\u003c512B); dùng **TCP 53** cho Zone Transfer giữa các Server."
                                             ],
                                             [
                                                 "**Port 67 \u0026 Port 68**",
                                                 "**UDP**",
                                                 "**DHCPv4** (Dynamic Host Config)",
                                                 "Cấp phát IP tự động: Máy chủ DHCP lắng nghe ở **UDP 67**, Máy trạm Client dùng **UDP 68**."
                                             ],
                                             [
                                                 "**Port 69**",
                                                 "**UDP**",
                                                 "**TFTP** (Trivial FTP)",
                                                 "Truyền file siêu nhẹ không cần mật khẩu — dùng sao lưu IOS và cấu hình Router/Switch Cisco."
                                             ],
                                             [
                                                 "**Port 80 \u0026 Port 443**",
                                                 "**TCP**",
                                                 "**HTTP (80)** \u0026 **HTTPS (443)**",
                                                 "Truy cập trang Web (HTTP truyền chữ rõ, HTTPS mã hóa qua SSL/TLS)."
                                             ],
                                             [
                                                 "**Port 110 \u0026 Port 143**",
                                                 "**TCP**",
                                                 "**POP3 (110)** \u0026 **IMAP (143)**",
                                                 "Dùng để **NHẬN/TẢI email** từ Mail Server về máy người dùng."
                                             ],
                                             [
                                                 "**Port 123** / **161–162** / **514**",
                                                 "**UDP**",
                                                 "**NTP (123)** / **SNMP (161/162)** / **Syslog (514)**",
                                                 "Đồng bộ giờ mạng (**NTP 123**), Giám sát thiết bị mạng (**SNMP 161/162**), Gửi nhật ký sự kiện (**Syslog 514**)."
                                             ]
                                         ]
                            },
        "jobSkills_vi":  [
                             "Kinh nghiệm Đi Làm 1 — Dùng lệnh `netstat -ano` và `Test-NetConnection` để bắt bệnh \u0027Server mở cổng hay bị Tường lửa chặn\u0027: Khi đi làm, bộ phận lập trình (Dev) rất hay đổ lỗi cho bộ phận Mạng (Network): *\u0027Anh mạng ơi sao phần mềm của em không kết nối được vào Database cổng 1433 trên Server `10.1.1.50`?\u0027*. Kỹ sư mạng xử lý trong 10 giây bằng 2 lệnh: 1) Ngồi trên Server `10.1.1.50` gõ `netstat -ano | findstr :1433` — nếu không hiện dòng `LISTENING` nào nghĩa là **chính phần mềm Database của Dev chưa bật lên** chứ không phải lỗi mạng! 2) Ngồi trên máy nhân viên mở PowerShell gõ: **`Test-NetConnection 10.1.1.50 -Port 1433`** (hoặc `telnet 10.1.1.50 1433`) để kiểm tra xem cổng TCP 1433 có thông qua Firewall hay không!",
                             "Kinh nghiệm Đi Làm 2 — Tại sao DNS dùng cả UDP lẫn TCP trên cùng cổng 53? Câu hỏi phỏng vấn kinh điển: Bình thường khi bạn gõ `google.com`, máy tính gửi gói truy vấn bằng **UDP Port 53** vì nó không tốn 3 bước bắt tay như TCP nên cực nhanh. Tuy nhiên, nếu gói trả lời của DNS lớn hơn 512 Bytes (hoặc khi 2 máy chủ DNS chính và phụ sao chép toàn bộ cơ sở dữ liệu tên miền cho nhau — gọi là **Zone Transfer**), DNS sẽ tự động chuyển sang dùng **TCP Port 53** để đảm bảo không bị rớt mất bất kỳ bản ghi nào!"
                         ],
        "quiz":  [
                     {
                         "question_vi":  "Câu 1 (Đề thi CCNA): Giao thức nào ở Tầng 4 (Transport Layer) có kích thước Header chỉ 8 Bytes, không thiết lập kết nối trước khi truyền, và được ưu tiên sử dụng cho các ứng dụng thoại VoIP, hội nghị truyền hình trực tuyến và truy vấn DNS?",
                         "options_vi":  [
                                            "A. TCP (Transmission Control Protocol)",
                                            "B. UDP (User Datagram Protocol)",
                                            "C. ICMP (Internet Control Message Protocol)",
                                            "D. ARP (Address Resolution Protocol)"
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B (UDP). UDP có phần Header tối giản chỉ 8 Bytes (gồm Source Port, Destination Port, Length, Checksum), không tốn thời gian bắt tay 3 bước và không dừng lại chờ gửi lại gói bị rớt, giúp loại bỏ độ trễ cho âm thanh/hình ảnh thời gian thực."
                     },
                     {
                         "question_vi":  "Câu 2 (Đề thi CCNA): Khi một máy tính PC mở trình duyệt Web truy cập vào trang `https://www.cisco.com`, máy tính sẽ chọn **Source Port (Cổng nguồn)** và **Destination Port (Cổng đích)** trong gói tin TCP gửi đi như thế nào?",
                         "options_vi":  [
                                            "A. Source Port là `443` — Destination Port là một số ngẫu nhiên từ `49152` đến `65535`.",
                                            "B. Source Port là một số cổng động (Dynamic/Ephemeral Port) từ `49152` đến `65535` — Destination Port là cổng chuẩn `443` (HTTPS).",
                                            "C. Cả Source Port và Destination Port đều là `80`.",
                                            "D. Source Port là `22` — Destination Port là `53`."
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B. Máy khách (Client) luôn lấy một số cổng ngẫu nhiên trong dải Dynamic/Private (`49152–65535`) làm **Source Port** để định danh riêng cho tab trình duyệt đó, và gửi tới **Destination Port** là cổng dịch vụ chuẩn Well-Known của máy chủ (`443` cho HTTPS hoặc `80` cho HTTP). Khi máy chủ trả lời về thì 2 số cổng này sẽ đảo vị trí cho nhau."
                     },
                     {
                         "question_vi":  "Câu 3 (Đề thi CCNA): Cơ chế nào trong giao thức TCP cho phép máy nhận báo cho máy gửi biết dung lượng bộ nhớ đệm (Buffer) còn trống của mình để điều chỉnh tốc độ gửi dữ liệu nhằm tránh làm tràn bộ nhớ máy nhận?",
                         "options_vi":  [
                                            "A. Sequence Number (Số thứ tự)",
                                            "B. Window Size / Sliding Window (Kích thước cửa sổ trượt - Flow Control)",
                                            "C. Port Forwarding",
                                            "D. UDP Checksum"
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B (Window Size). Trường Window Size trong TCP Header thực hiện chức năng Điều khiển luồng (Flow Control): cho phép máy nhận tăng hoặc giảm số lượng byte mà máy gửi được phép truyền liên tiếp trước khi phải dừng lại chờ báo nhận ACK."
                     }
                 ],
        "beginnerGuide_vi":  [
                                 "1. Hiểu cực kỳ rõ ràng vai trò của Tầng 4 (Transport Layer) và \u0027Số hiệu cổng (Port Number)\u0027: Hãy tưởng tượng máy tính của bạn là một **Tòa chung cư có 1 Địa chỉ IP duy nhất là `192.168.1.10`**. Trên máy tính đó bạn đang mở cùng lúc 3 phần mềm: Trình duyệt Chrome đọc báo, phần mềm Zalo nhắn tin, và tựa Game Liên Minh Huyền Thoại. Khi các gói tin từ Internet gửi về địa chỉ `192.168.1.10`, làm sao Windows biết gói tin nào phải đưa vào Chrome, gói nào đưa vào Zalo, gói nào đưa vào Game? Chính là nhờ Tầng 4 gắn cho mỗi phần mềm một **Số Phòng riêng biệt gọi là Số Hiệu Cổng (Port Number — từ 0 đến 65535)**!",
                                 "2. Tại sao Tầng 4 lại phải chia ra làm 2 giao thức là TCP và UDP? Bởi vì các phần mềm trên đời có 2 nhu cầu trái ngược nhau: • **Nhóm 1 cần Chính Xác 100% (Web, Email, Chuyển khoản ngân hàng, Tải file)**: Nếu tải 1 file hợp đồng hoặc chuyển tiền mà rớt mất 1 con số `0` là thảm họa! Nhóm này bắt buộc dùng **TCP** — gửi gói nào phải ký nhận (`ACK`) gói đó, rớt gói nào phải gửi đền lại ngay gói đó. • **Nhóm 2 cần Nhanh Tức Thì theo thời gian thực (Gọi điện thoại VoIP, Họp Zoom, Xem Livestream, Chơi Game)**: Nếu bạn đang gọi điện thoại mà mạng bị rớt mất 0.1 giây tiếng nói, bạn muốn nghe tiếp câu hiện tại hay muốn dừng cuộc gọi lại 5 giây để phát lại tiếng \u0027Alo\u0027 đã bị rớt từ lúc nãy? Chắc chắn là bỏ qua luôn để nói tiếp! Nhóm này dùng **UDP** — bắn dữ liệu đi liên tục không cần bắt tay hay gửi lại!",
                                 "3. Phân biệt Cổng Nguồn (Source Port) và Cổng Đích (Destination Port) khi máy bạn lướt Web: Khi bạn mở Chrome vào trang web bảo mật `https://google.com`, máy chủ Google luôn mở sẵn cửa số **`443` (HTTPS)** chờ khách. Vậy gói tin đi từ máy bạn sẽ ghi: **Destination Port (Cổng đích) = `443`**, còn **Source Port (Cổng nguồn)** là một con số lớn ngẫu nhiên do Windows tự bốc (ví dụ **`51234`**) để đánh dấu riêng cho cái Tab Chrome đó!",
                                 "4. Bộ 3 thông tin tạo nên một Socket (Cặp kết nối duy nhất) là gì? Làm sao trình duyệt của bạn vừa mở 5 tab xem YouTube, vừa tải file, vừa lướt Facebook về cùng 1 địa chỉ IP của bạn mà các luồng dữ liệu không bị trộn lẫn vào nhau? Bí quyết nằm ở **Số cổng nguồn ngẫu nhiên (Source Port - từ 49152 đến 65535)**: Tab thứ nhất mở từ cổng nguồn 50101, Tab thứ hai mở từ cổng nguồn 50102... Khi ghép **[Địa chỉ IP + Số hiệu Cổng]** lại với nhau (ví dụ 192.168.1.10:50101), ta gọi đó là một **Socket** — giúp hệ điều hành phân phát từng gói tin trả về cho đúng từng cửa sổ ứng dụng!",
                                 "5. Cách nhớ nhanh bảng Số hiệu Cổng (Well-Known Ports từ 0 đến 1023) hay ra thi nhất: • **Nhóm truyền File**: FTP dùng cổng **20** (truyền dữ liệu) \u0026 **21** (điều khiển) chạy TCP; TFTP (truyền file gọn nhẹ cho thiết bị mạng) dùng cổng **69** chạy UDP. • **Nhóm Quản trị từ xa**: SSH (mã hóa an toàn) dùng cổng **22** TCP; Telnet (không mã hóa) dùng cổng **23** TCP. • **Nhóm Email**: SMTP (gửi thư) cổng **25** TCP; POP3 (tải thư) cổng **110** TCP; IMAP (đồng bộ thư) cổng **143** TCP. • **Nhóm Web \u0026 Hạ tầng**: DNS (tên miền) cổng **53** (cả UDP \u0026 TCP); DHCP (cấp IP) cổng **67** (Server) \u0026 **68** (Client) UDP; HTTP cổng **80** TCP; HTTPS cổng **443** TCP."
                             ],
        "beginnerGuide_en":  [
                                 "1. Why do we need Port Numbers at Layer 4? Your computer has only one IP address, but runs many apps at the same time (Browser, Zoom, Email, Games). **Port Numbers (0–65535)** act like apartment numbers inside your computer so the OS delivers incoming data to the exact application window.",
                                 "2. Why have two different protocols (TCP vs. UDP)? **TCP** is built for **100% accuracy** (Web pages, Emails, File downloads, SSH)—it sets up a connection (3-Way Handshake), numbers every byte, and retransmits any lost packet. **UDP** is built for **real-time speed** (Voice calls, Live Video, Gaming, DNS)—it blasts packets out immediately with zero handshake or retransmission delay.",
                                 "3. Source Port vs. Destination Port: When your PC connects to an HTTPS web server, the **Destination Port** is the server\u0027s well-known service port (**`443`**), while the **Source Port** is a random ephemeral port (**`49152–65535`**) picked by your PC to track that specific browser tab."
                             ],
        "advancedTopics_vi":  [
                                  "Mở rộng Nâng cao 1 — Giải phẫu chi tiết 6 Cờ Điều Khiển (6 Control Flags) bên trong TCP Header: Bên trong phần Header 20 Bytes của TCP có 6 bit cờ điều khiển trạng thái phiên kết nối: 1) **`SYN` (Synchronize)**: Khởi tạo kết nối và đồng bộ số thứ tự Sequence Number ban đầu; 2) **`ACK` (Acknowledgment)**: Xác nhận đã nhận dữ liệu thành công; 3) **`FIN` (Finish)**: Xin đóng kết nối một cách lịch sự khi đã truyền xong dữ liệu; 4) **`RST` (Reset)**: Cắt đứt kết nối ngay lập tức khi có lỗi nghiêm trọng hoặc khi máy đích từ chối kết nối (cổng đóng); 5) **`PSH` (Push)**: Thúc giục đẩy dữ liệu lên thẳng ứng dụng ngay mà không chờ đầy bộ nhớ đệm; 6) **`URG` (Urgent)**: Báo có dữ liệu khẩn cấp.",
                                  "Mở rộng Nâng cao 2 — Cơ chế Cửa sổ trượt (Sliding Window) và Khởi đầu chậm (TCP Slow Start / Congestion Avoidance): Nếu máy gửi cứ bắn 1 gói tin rồi lại phải dừng lại chờ 50ms để nhận gói `ACK` từ máy nhận thì đường cáp quang 1 Gbps sẽ bị lãng phí 99% thời gian chờ đợi! Nhờ cơ chế **Sliding Window**, máy nhận thông báo kích thước `Window Size` (ví dụ `65.535 Bytes`), cho phép máy gửi bắn liên hoàn hàng chục gói tin đi cùng lúc rồi mới nhận 1 gói `ACK` tổng hợp. Nếu trên đường đi có Router bị nghẽn làm rớt gói tin, TCP lập tức thu nhỏ `Window Size` lại để giảm tốc độ gửi (chống tắc nghẽn mạng), sau đó mới tăng dần trở lại!",
                                  "Mở rộng Nâng cao 3 — Thỏa thuận Kích thước Phân đoạn Tối đa (TCP MSS - Maximum Segment Size) và Tấn công SYN Flood: • **TCP MSS**: Ngay trong bước 1 và bước 2 của quá trình Bắt tay 3 bước (SYN và SYN-ACK), hai thiết bị trao đổi thông số **MSS** (thường là 1460 Bytes = 1500 MTU - 20 Bytes IP Header - 20 Bytes TCP Header) để thống nhất độ lớn tối đa của phần dữ liệu bên trong mỗi gói TCP. • **Tấn công TCP SYN Flood**: Kẻ tấn công bắn hàng vạn gói SYN giả mạo IP nguồn tới Server; Server gửi trả SYN-ACK và mở sẵn bộ nhớ chờ bước 3 (ACK) không bao giờ tới, dẫn đến tràn bộ nhớ kết nối. Giải pháp là bật tính năng **SYN Cookies** trên Firewall."
                              ],
        "advancedTopics_en":  [
                                  "Advanced Expansion 1 — The 6 TCP Control Flags (`SYN`, `ACK`, `FIN`, `RST`, `PSH`, `URG`): `SYN` initiates a connection; `ACK` confirms receipt of bytes; `FIN` gracefully closes a session; `RST` abruptly terminates an invalid or refused connection; `PSH` forces immediate delivery to the upper application; `URG` flags urgent data.",
                                  "Advanced Expansion 2 — TCP Sliding Windows \u0026 Congestion Control: Instead of waiting for an ACK after every single segment, the receiver advertises a **Window Size** allowing the sender to transmit multiple segments in flight before receiving a cumulative ACK, dynamically scaling up or down based on network congestion."
                              ]
    },
    {
        "id":  15,
        "title":  "Application Layer",
        "title_vi":  "Tầng Ứng Dụng: Dịch Vụ DNS, DHCP, Web, Email \u0026 FTP",
        "overview":  "Module 15 explores the Application Layer of the TCP/IP model (which encompasses OSI Layers 5 Session, 6 Presentation, and 7 Application). It compares the **Client-Server** model with **Peer-to-Peer (P2P)** networks and examines how core everyday Internet protocols operate under the hood: **HTTP/HTTPS** (Web), **SMTP/POP3/IMAP** (Email), **DNS** (translating domain names like `cisco.com` to IP addresses using `A`, `AAAA`, `MX`, `NS` records), **DHCP** (dynamically assigning IPv4 configurations via the 4-step **DORA** process), and **FTP/TFTP/SMB** (file sharing).",
        "overview_vi":  "Module 15 khám phá tầng cao nhất nơi con người tương tác trực tiếp: **Tầng Ứng Dụng (Application Layer trong TCP/IP, gộp cả 3 tầng 5, 6, 7 của OSI)**. Bạn sẽ hiểu rõ sự khác biệt giữa mô hình **Client-Server (Khách - Chủ)** với **Peer-to-Peer (Mạng ngang hàng P2P)**, đồng thời nắm rõ cơ chế vận hành bên trong của 5 dịch vụ mạng quan trọng nhất thế giới: **DNS** (Danh bạ Internet dịch tên miền `google.com` ra địa chỉ IP), **DHCP** (Cấp phát địa chỉ IP tự động qua 4 bước **DORA**), **Web HTTP/HTTPS**, **Hệ thống Thư điện tử (SMTP gửi thư, POP3 và IMAP nhận thư)**, cùng **Truyền tải tập tin (FTP, TFTP, SMB)**.",
        "analogy_vi":  "Nếu Địa chỉ IP (`142.250.199.14`) giống như dãy số điện thoại dài ngoằng khó nhớ, thì dịch vụ **DNS (Domain Name System)** chính là cuốn **Danh bạ Điện thoại thông minh**: Bạn chỉ cần gõ cái tên dễ nhớ là `www.google.com`, DNS sẽ tự động tra danh bạ trả về con số IP `142.250.199.14` để máy tính kết nối. Còn **DHCP** giống như nhân viên Lễ tân khách sạn: Ngay khi bạn vừa bước vào khách sạn (cắm dây mạng hoặc bắt Wi-Fi) và hô lên *\u0027Cho tôi thuê 1 phòng!\u0027* (**DHCP Discover**), lễ tân lập tức chọn 1 phòng trống (**DHCP Offer**), bạn đồng ý nhận (**DHCP Request**) và lễ tân trao chìa khóa phòng kèm mật khẩu ăn sáng (**DHCP ACK** — gồm IP, Subnet Mask, Default Gateway và DNS Server)!",
        "keyConcepts":  [
                            "OSI Layers 7, 6, and 5 Functions: • **Application (L7)**: Network protocols that interface directly with user software (HTTP, DNS, DHCP, FTP, SMTP). • **Presentation (L6)**: Formats and translates data so the receiving device can read it (character encoding ASCII/UTF-8, image/video formats PNG, JPEG, MP4, data compression, and TLS/SSL encryption). • **Session (L5)**: Creates, maintains, and restarts dialogs between source and destination applications.",
                            "Domain Name System (DNS — Port 53 UDP/TCP): Resolves human-readable domain names (FQDNs) into numeric IP addresses. Uses UDP Port 53 for standard name queries (fast, low overhead) and TCP Port 53 when the response exceeds 512 bytes or for Zone Transfers between DNS servers. **4 Essential DNS Record Types**: **`A`** = End-device IPv4 address; **`AAAA`** (Quad-A) = End-device IPv6 address; **`MX`** = Mail Exchange server; **`NS`** = Authoritative Name Server; **`CNAME`** = Canonical Name (alias).",
                            "DHCP (Dynamic Host Configuration Protocol — UDP Ports 67 \u0026 68) \u0026 The 4-Step DORA Process: Automates assigning IPv4 Address, Subnet Mask, Default Gateway, and DNS Server to clients. Memorize the **DORA** sequence: 1) **DHCP Discover** (Client sends a **Broadcast** from UDP 68 to UDP 67 asking for any DHCP server); 2) **DHCP Offer** (DHCP Server responds from UDP 67 to UDP 68 offering an available IP lease); 3) **DHCP Request** (Client sends a **Broadcast** formally requesting to use that offered IP); 4) **DHCP Ack** (Server sends an Acknowledgment confirming the lease).",
                            "Email Protocols — SMTP vs. POP3 vs. IMAP (Exam Classic!): • **Sending Email (`SMTP` — TCP Port 25)**: Used when a client sends mail to a mail server, AND when one mail server relays mail to another mail server. • **Receiving Email (`POP3` — TCP Port 110 vs. `IMAP` — TCP Port 143)**: `POP3` downloads email to your device and **deletes it from the server** by default (bad if you check mail on both phone and laptop). `IMAP` keeps emails stored centrally on the server and **synchronizes** read/unread status and folders across all your devices!",
                            "Web \u0026 File Transfer Protocols (HTTP/HTTPS, FTP, TFTP, SMB): • **HTTP (TCP 80)** sends web traffic in plaintext using `GET` (request page), `POST`/`PUT` (upload data), `DELETE`; **HTTPS (TCP 443)** encrypts HTTP inside TLS/SSL. • **FTP (TCP 20 \u0026 21)**: Uses **Port 21** for Control commands (login, browse folders) and **Port 20** for actual Data file transfer. • **TFTP (UDP 69)**: Connectionless, tiny protocol with no login—used on LANs to copy IOS images and configs to Cisco routers/switches. • **SMB (Server Message Block)**: Microsoft Windows protocol for sharing folders and network printers on a LAN."
                        ],
        "keyConcepts_vi":  [
                               "Vai trò riêng biệt của Tầng 7, Tầng 6 và Tầng 5 trong mô hình OSI: • **Tầng 7 (Application)**: Cung cấp các giao thức dịch vụ mạng cho phần mềm (HTTP, DNS, DHCP, SMTP, FTP). • **Tầng 6 (Presentation)**: Chịu trách nhiệm **Định dạng dữ liệu** (đuôi ảnh `.jpg`, `.png`, video `.mp4`, bảng mã chữ `UTF-8`), **Nén dữ liệu** và **Mã hóa bảo mật** (SSL/TLS). • **Tầng 5 (Session)**: Khởi tạo, duy trì và đồng bộ hóa các phiên hội thoại giữa hai ứng dụng.",
                               "Hệ thống Phân giải Tên miền DNS (Cổng 53 UDP/TCP) \u0026 4 Loại Bản ghi DNS bắt buộc nhớ: Mặc định máy tính hỏi DNS bằng giao thức **UDP Port 53** cho nhanh; chỉ khi gói trả lời lớn hơn 512 Bytes hoặc đồng bộ dữ liệu giữa 2 máy chủ DNS (Zone Transfer) mới dùng **TCP Port 53**. **4 Bản ghi (Resource Records) hay thi nhất**: 1) Bản ghi **`A`**: Ánh xạ tên miền sang địa chỉ **IPv4**; 2) Bản ghi **`AAAA` (4 chữ A)**: Ánh xạ tên miền sang địa chỉ **IPv6** (vì IPv6 dài gấp 4 lần IPv4!); 3) Bản ghi **`MX` (Mail Exchange)**: Chỉ đường tới máy chủ nhận Email; 4) Bản ghi **`NS` (Name Server)**: Khai báo máy chủ DNS quản lý tên miền đó.",
                               "Quy trình 4 Bước **DORA** xin cấp IP tự động của DHCP (UDP Port 67 trên Server, Port 68 trên Client): Khi một máy tính mới bật lên chưa có IP (đang mang IP `0.0.0.0`), nó thực hiện 4 bước **D - O - R - A**: • **Bước 1 — D (DHCP Discover - Broadcast)**: Máy khách hét lớn ra toàn mạng LAN: *\u0027Có máy chủ DHCP nào ở đây không, cho tôi xin 1 IP!\u0027*. • **Bước 2 — O (DHCP Offer)**: Máy chủ DHCP nghe thấy và chìa ra một đề nghị: *\u0027Tôi có IP 192.168.1.50 đang trống này, bạn lấy không?\u0027*. • **Bước 3 — R (DHCP Request - Broadcast)**: Máy khách phát Broadcast xác nhận: *\u0027Tôi đồng ý nhận IP 192.168.1.50 của máy chủ A nhé!\u0027*. • **Bước 4 — A (DHCP ACK)**: Máy chủ DHCP đóng dấu xác nhận chính thức cấp bộ thông số (IP, Subnet Mask, Default Gateway, DNS) kèm thời hạn thuê (Lease Time).",
                               "Phân biệt 3 Giao thức Email: SMTP (Gửi) vs. POP3 và IMAP (Nhận): • **Gửi thư đi (`SMTP` — TCP Port 25)**: Dùng để đẩy thư từ máy người gửi lên Mail Server, và chuyển thư giữa các Mail Server với nhau. • **Tải thư về (`POP3` — TCP Port 110 vs. `IMAP` — TCP Port 143)**: Giao thức **`POP3`** tải thư từ Server về máy tính xong là **XÓA LUÔN thư gốc trên Server** (nên mở điện thoại lên sẽ không thấy thư đó nữa!). Ngược lại, **`IMAP`** giữ nguyên thư gốc trên Server và **đồng bộ hóa** giữa Điện thoại, Laptop, Máy tính bảng (đọc thư trên điện thoại thì trên Laptop cũng tự chuyển thành Đã đọc!).",
                               "Các giao thức Web và Chia sẻ File (HTTP/HTTPS, FTP, TFTP, SMB): • **HTTP (TCP 80)** truyền web không mã hóa (dùng lệnh `GET` để tải trang, `POST`/`PUT` để gửi dữ liệu form lên); **HTTPS (TCP 443)** bọc mã hóa bảo mật SSL/TLS. • **FTP (TCP 20 \u0026 21)**: Mở tới 2 cổng TCP — **Cổng 21** dùng để điều khiển/đăng nhập, còn **Cổng 20** dùng để truyền dữ liệu file. • **TFTP (UDP 69)**: Truyền file siêu gọn nhẹ qua UDP không cần đăng nhập — chuyên dùng để chép hệ điều hành Cisco IOS và sao lưu file cấu hình Router/Switch. • **SMB (Server Message Block)**: Giao thức chia sẻ thư mục (`\\\\192.168.1.10\\Share`) và máy in dùng chung trong mạng LAN Windows."
                           ],
        "realWorldExample":  "Scenario: What happens behind the scenes in the first 500 milliseconds when you plug an Ethernet cable into your laptop and type `https://www.cisco.com`?\n1. **DHCP (UDP 68 -\u003e 67)**: Your laptop runs the 4-step **DORA** process (`Discover -\u003e Offer -\u003e Request -\u003e Ack`) and receives IP `192.168.1.100/24`, Default Gateway `192.168.1.1`, and DNS Server `8.8.8.8`.\n2. **ARP (Broadcast -\u003e Unicast)**: Your laptop sends an ARP Request for Default Gateway `192.168.1.1` and learns the Router\u0027s MAC address.\n3. **DNS (UDP Port 53)**: Your laptop sends a DNS query to `8.8.8.8` asking for the `A` (IPv4) and `AAAA` (IPv6) records of `www.cisco.com`, receiving `72.163.4.185`.\n4. **TCP + HTTPS (TCP Port 443)**: Your laptop completes a TCP 3-Way Handshake (`SYN -\u003e SYN/ACK -\u003e ACK`) and TLS handshake with `72.163.4.185:443`, sends an encrypted `HTTP GET` request, and renders the Cisco homepage!",
        "realWorldExample_vi":  "Ví dụ thực tế kết nối toàn bộ kiến thức CCNA: Chuyện gì diễn ra trong vòng **0.5 giây** kể từ lúc bạn cắm dây mạng vào Laptop và gõ `https://www.cisco.com`?\n1. **Xin IP bằng DHCP (UDP 68 -\u003e 67)**: Laptop vừa cắm dây chưa có IP liền chạy 4 bước **DORA (`Discover -\u003e Offer -\u003e Request -\u003e ACK`)** và được Router cấp cho IP `192.168.1.100/24`, Default Gateway `192.168.1.1`, và DNS Server `8.8.8.8`.\n2. **Tìm MAC của Router bằng ARP**: Để ra được Internet, Laptop phát gói **ARP Request (Broadcast)** hỏi địa chỉ MAC của Default Gateway `192.168.1.1` và nhận về **ARP Reply**.\n3. **Hỏi danh bạ DNS (UDP Port 53)**: Laptop gửi gói tin UDP cổng 53 ra máy chủ DNS `8.8.8.8` hỏi: *\u0027Cho xin bản ghi `A` (IPv4) của tên miền `www.cisco.com`?\u0027* -\u003e Máy chủ DNS trả về con số IP `72.163.4.185`.\n4. **Mở kết nối Web HTTPS (TCP Port 443)**: Laptop thực hiện **Bắt tay 3 bước TCP (`SYN -\u003e SYN+ACK -\u003e ACK`)** tới địa chỉ đích `72.163.4.185:443`, trao đổi khóa bảo mật TLS, rồi gửi lệnh `HTTP GET` tải toàn bộ hình ảnh và nội dung trang chủ Cisco về hiển thị lên màn hình!",
        "diagramType":  "dhcp-dora",
        "commands":  [
                         "C:\\\u003e ipconfig /release                     # Trả lại địa chỉ IPv4 đang thuê cho máy chủ DHCP",
                         "C:\\\u003e ipconfig /renew                       # Chạy lại quy trình 4 bước DORA để xin cấp mới địa chỉ IPv4 từ DHCP Server",
                         "C:\\\u003e nslookup www.cisco.com                # Hỏi trực tiếp máy chủ DNS để tra cứu địa chỉ IPv4 (A) và IPv6 (AAAA) của tên miền",
                         "C:\\\u003e ipconfig /displaydns                  # Xem danh sách các tên miền đã tra cứu đang lưu sẵn trong bộ nhớ đệm DNS Cache",
                         "C:\\\u003e ipconfig /flushdns                    # Xóa sạch bộ nhớ đệm DNS Cache trên máy tính Windows khi đổi IP website",
                         "Router# copy running-config tftp:          # Sao lưu file cấu hình của Router Cisco lên máy chủ TFTP (UDP Port 69)"
                     ],
        "comparisonTable":  {
                                "title_vi":  "Bảng Phân Biệt Chi Tiết Các Giao Thức Tầng Ứng Dụng (DHCP DORA, DNS Records, Email \u0026 File)",
                                "headers_vi":  [
                                                   "Nhóm Dịch Vụ",
                                                   "Giao Thức / Bản Tin",
                                                   "Cổng \u0026 Kiểu Truyền",
                                                   "Điểm Cốt Lõi Cần Nhớ Khi Đi Thi \u0026 Đi Làm"
                                               ],
                                "rows":  [
                                             [
                                                 "DHCP Bước 1 \u0026 2",
                                                 "**1. Discover** -\u003e **2. Offer**",
                                                 "Client (`UDP 68`) \u003c-\u003e Server (`UDP 67`)",
                                                 "Client phát **Broadcast** `DHCP Discover` tìm Server; Server trả lời `DHCP Offer` đề nghị 1 địa chỉ IP."
                                             ],
                                             [
                                                 "DHCP Bước 3 \u0026 4",
                                                 "**3. Request** -\u003e **4. ACK**",
                                                 "Client (`UDP 68`) \u003c-\u003e Server (`UDP 67`)",
                                                 "Client phát **Broadcast** `DHCP Request` xin nhận IP đó; Server gửi `DHCP ACK` chốt cấp phát chính thức."
                                             ],
                                             [
                                                 "DNS Resource Records",
                                                 "**`A`** / **`AAAA`** / **`MX`** / **`NS`** / **`CNAME`**",
                                                 "UDP / TCP **Port 53**",
                                                 "**`A`** = IPv4; **`AAAA`** = IPv6; **`MX`** = Mail Server; **`NS`** = Name Server; **`CNAME`** = Tên bí danh (Alias)."
                                             ],
                                             [
                                                 "Gửi \u0026 Nhận Email",
                                                 "**SMTP (25)** vs. **POP3 (110)** vs. **IMAP (143)**",
                                                 "TCP Ports **25, 110, 143**",
                                                 "**SMTP** chỉ dùng để GỬI thư; **POP3** tải thư về và xóa trên Server; **IMAP** giữ thư trên Server và đồng bộ nhiều thiết bị."
                                             ],
                                             [
                                                 "Truyền File Mạng",
                                                 "**FTP (20/21)** vs. **TFTP (69)** vs. **SMB (445)**",
                                                 "TCP 20/21, UDP 69, TCP 445",
                                                 "**FTP** có đăng nhập (21 điều khiển, 20 truyền file); **TFTP** qua UDP không đăng nhập (chép IOS Cisco); **SMB** chia sẻ thư mục/máy in Windows."
                                             ]
                                         ]
                            },
        "jobSkills_vi":  [
                             "Kinh nghiệm Đi Làm 1 — Quy trình phân giải tên miền đệ quy của DNS (hosts file -\u003e Local DNS Cache -\u003e Company DNS -\u003e Root -\u003e TLD `.com` -\u003e Authoritative Server): Khi một máy tính trong công ty không vào được tên miền nội bộ, kỹ sư mạng phải biết chính xác thứ tự máy tính đi tìm tên miền: 1) Đầu tiên máy tính kiểm tra file **`C:\\Windows\\System32\\drivers\\etc\\hosts`** trên ổ cứng xem có dòng ép cứng IP nào không; 2) Kiểm tra bộ nhớ đệm **`ipconfig /displaydns`**; 3) Hỏi máy chủ **DNS Server** khai trong card mạng (dùng lệnh `nslookup` để kiểm tra và `ipconfig /flushdns` để xóa bộ nhớ đệm cũ khi website vừa đổi sang máy chủ mới)!",
                             "Kinh nghiệm Đi Làm 2 — Tại sao bước thứ 3 của DHCP (`DHCP Request`) máy trạm vẫn phải phát Broadcast thay vì gửi Unicast? Đây là câu hỏi phỏng vấn rất sâu: Trong mạng doanh nghiệp thường có **2 máy chủ DHCP chạy dự phòng cho nhau (DHCP Failover)**. Khi máy trạm phát `Discover` ở bước 1, cả 2 máy chủ DHCP đều nghe thấy và cùng gửi `Offer` ở bước 2! Do đó ở bước 3 (`DHCP Request`), máy trạm cố tình phát **Broadcast** cho cả 2 máy chủ cùng nghe: *\u0027Tôi quyết định chọn lấy IP của Máy chủ DHCP số 1 nhé!\u0027* — nhờ vậy Máy chủ số 1 biết để cấp `ACK`, còn Máy chủ số 2 biết để thu hồi lại IP kia cho người khác dùng!"
                         ],
        "quiz":  [
                     {
                         "question_vi":  "Câu 1 (Đề thi CCNA): Hãy sắp xếp đúng thứ tự 4 bản tin trong quy trình một máy trạm xin cấp địa chỉ IPv4 động từ máy chủ DHCP:",
                         "options_vi":  [
                                            "A. DHCP Request -\u003e DHCP Offer -\u003e DHCP Discover -\u003e DHCP Ack",
                                            "B. DHCP Discover -\u003e DHCP Offer -\u003e DHCP Request -\u003e DHCP Ack (Quy trình **DORA**)",
                                            "C. DHCP Discover -\u003e DHCP Request -\u003e DHCP Offer -\u003e DHCP Ack",
                                            "D. DHCP Offer -\u003e DHCP Discover -\u003e DHCP Ack -\u003e DHCP Request"
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B (**DORA**: **D**iscover -\u003e **O**ffer -\u003e **R**equest -\u003e **A**ck). Trong đó bản tin số 1 (`Discover`) và bản tin số 3 (`Request`) từ máy khách gửi đi luôn là các bản tin **Broadcast**."
                     },
                     {
                         "question_vi":  "Câu 2 (Đề thi CCNA): Loại bản ghi (Resource Record) nào trên máy chủ DNS được sử dụng để ánh xạ một tên miền (ví dụ `www.cisco.com`) sang một địa chỉ **IPv6** 128-bit?",
                         "options_vi":  [
                                            "A. Bản ghi `A`",
                                            "B. Bản ghi `MX`",
                                            "C. Bản ghi `AAAA` (Quad-A)",
                                            "D. Bản ghi `CNAME`"
                                        ],
                         "answerIndex":  2,
                         "explanation_vi":  "Đáp án đúng là C (`AAAA`). Bản ghi `A` ánh xạ tên miền sang địa chỉ IPv4 (32-bit), còn bản ghi `AAAA` (4 chữ A vì 128-bit gấp 4 lần 32-bit) ánh xạ tên miền sang địa chỉ IPv6!"
                     },
                     {
                         "question_vi":  "Câu 3 (Đề thi CCNA): Một giám đốc muốn đọc và quản lý hộp thư email công việc đồng bộ trên cả điện thoại iPhone, máy tính bảng iPad và Laptop ở văn phòng (khi đọc hoặc xóa một thư trên điện thoại thì trên Laptop cũng cập nhật trạng thái y hệt). Giao thức nhận thư nào đáp ứng đúng nhu cầu này?",
                         "options_vi":  [
                                            "A. SMTP",
                                            "B. POP3",
                                            "C. IMAP",
                                            "D. SNMP"
                                        ],
                         "answerIndex":  2,
                         "explanation_vi":  "Đáp án đúng là C (IMAP - TCP Port 143). SMTP chỉ dùng để gửi thư đi; POP3 tải thư về một thiết bị và mặc định xóa bản gốc trên máy chủ; chỉ có **IMAP** lưu trữ thư tập trung trên Server và đồng bộ hóa trạng thái thư theo thời gian thực cho nhiều thiết bị."
                     }
                 ],
        "beginnerGuide_vi":  [
                                 "1. Tại sao mỗi lần cắm dây mạng hoặc bắt Wi-Fi ở quán cafe, điện thoại và laptop của bạn lại tự động vào mạng được ngay mà bạn không hề phải tự gõ Địa chỉ IP, Subnet Mask hay Default Gateway? Đó là nhờ dịch vụ **DHCP (Dynamic Host Configuration Protocol — Cấp phát địa chỉ IP động)** chạy ngầm bên trong chiếc Router quán cafe! Ngay khi máy bạn vừa kết nối vào mạng, trong vòng chưa đầy 1 giây, máy bạn và Router đã âm thầm trao đổi 4 câu nói (**Discover -\u003e Offer -\u003e Request -\u003e Ack**, viết tắt là **DORA**) để Router cho máy bạn \u0027mượn tạm\u0027 một bộ thông số IP đầy đủ!",
                                 "2. Dịch vụ DNS (Domain Name System) giúp ích gì cho bạn mỗi ngày? Trong thế giới mạng, các máy chủ nói chuyện với nhau hoàn toàn bằng những con số IP khô khan như `142.250.199.14` hay `2001:4860:4860::8888`. Không ai trên đời có thể nhớ nổi hàng trăm dãy số như vậy để đọc báo hay lướt Facebook! Vì vậy, **DNS** đóng vai trò là **Cuốn Danh Bạ Điện Thoại Khổng Lồ của Internet**: bạn chỉ cần gõ cái tên dễ nhớ là `youtube.com`, máy tính sẽ tự động hỏi máy chủ DNS để lấy con số IP thật sự về kết nối!",
                                 "3. Phân biệt mô hình Mạng Khách - Chủ (Client-Server) và Mạng Ngang Hàng (Peer-to-Peer / P2P): • **Client-Server**: Có một máy chủ chuyên dụng cực mạnh (Server) mở 24/24 chứa toàn bộ dữ liệu web/mail, còn điện thoại/laptop của bạn là máy khách (Client) chỉ gửi yêu cầu lên xin dữ liệu về xem. • **Peer-to-Peer (P2P)**: Không có máy chủ trung tâm! Hai máy tính cá nhân trong văn phòng tự bật chia sẻ thư mục/máy in cho nhau (hoặc mạng tải file BitTorrent) — mỗi máy vừa là người xin dữ liệu (Client) vừa là người cung cấp dữ liệu (Server) cùng một lúc!",
                                 "4. So sánh mô hình Mạng Khách - Chủ (Client-Server) và Mạng Ngang Hàng (Peer-to-Peer / P2P): • **Mô hình Client-Server**: Có một máy chủ chuyên dụng (Server) luôn bật 24/7 lưu trữ dữ liệu tập trung (như máy chủ Web, máy chủ Mail); các máy trạm (Clients) gửi yêu cầu lên Server để xin dữ liệu — dễ bảo mật và sao lưu tập trung. • **Mô hình Peer-to-Peer (P2P)**: Không có máy chủ chuyên dụng; hai hay nhiều máy tính cá nhân nối mạng và chia sẻ thư mục/máy in trực tiếp cho nhau — mỗi máy vừa đóng vai trò là người xin (Client) vừa là người phục vụ (Server) cùng một lúc.",
                                 "5. Cách tự tay kiểm tra dịch vụ DNS và DHCP trên máy tính của bạn bằng 2 câu lệnh thực tế: • **Kiểm tra DHCP (ipconfig /all)**: Cho biết máy bạn đang nhận IP bao nhiêu, nhận từ máy chủ DHCP nào (DHCP Server), và thời hạn thuê IP đến mấy giờ. Nếu muốn trả lại IP cũ và xin cấp IP mới ngay lập tức, bạn gõ 2 lệnh liên tiếp: ipconfig /release rồi ipconfig /renew. • **Kiểm tra DNS (\nslookup cisco.com)**: Hỏi trực tiếp máy chủ DNS xem tên miền cisco.com đang ứng với địa chỉ IPv4 và IPv6 nào!"
                             ],
        "beginnerGuide_en":  [
                                 "1. How does your phone or laptop get an IP address automatically when you join a Wi-Fi network? Through **DHCP (Dynamic Host Configuration Protocol)**! Within milliseconds of connecting, your device and the DHCP server exchange 4 messages (**DORA: Discover -\u003e Offer -\u003e Request -\u003e Ack**) to lease an IP address, Subnet Mask, Default Gateway, and DNS server.",
                                 "2. What does DNS (Domain Name System) do? Computers communicate using numeric IP addresses (like `142.250.199.14`), which humans can\u0027t easily memorize. **DNS** acts as the **Phonebook of the Internet**, automatically translating domain names like `www.google.com` into their corresponding IPv4 (`A` record) and IPv6 (`AAAA` record) addresses.",
                                 "3. Client-Server vs. Peer-to-Peer (P2P): In **Client-Server**, dedicated servers host resources centrally while clients request them. In **P2P** (such as Windows homegroup file/printer sharing or BitTorrent), every computer acts as both a client and a server simultaneously."
                             ],
        "advancedTopics_vi":  [
                                  "Mở rộng Nâng cao 1 — Cấu hình Router Cisco làm Máy chủ DHCPv4 hoàn chỉnh (4 bước thực chiến trong phòng Lab và đi làm): Trong đề thi CCNA và thực tế tại các văn phòng chi nhánh, bạn sẽ phải cấu hình chính con Router Cisco cấp IP động cho mạng LAN `192.168.10.0/24`: • **Bước 1 (Loại trừ các IP tĩnh của Router/Switch/Server không đem cấp)**: `R1(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.10` • **Bước 2 (Đặt tên bể cấp IP)**: `R1(config)# ip dhcp pool PHONG_KINH_DOANH` • **Bước 3 (Khai báo mạng và Subnet Mask)**: `R1(dhcp-config)# network 192.168.10.0 255.255.255.0` • **Bước 4 (Khai báo Default Gateway và DNS cho máy trạm)**: `R1(dhcp-config)# default-router 192.168.10.1` và `R1(dhcp-config)# dns-server 8.8.8.8`!",
                                  "Mở rộng Nâng cao 2 — Phân biệt FTP Chủ động (Active Mode) và FTP Thụ động (Passive Mode) khi đi qua Tường lửa: Giao thức truyền file **FTP** rất đặc biệt vì dùng tới **2 cổng TCP**: Cổng **21** để gửi lệnh điều khiển, và Cổng **20** để truyền dữ liệu. Trong chế độ *Active FTP*, máy chủ FTP chủ động mở kết nối từ cổng 20 ngược về máy khách — nên rất hay bị Tường lửa (Firewall) trên máy khách chặn mất! Để khắc phục, thực tế đi làm luôn chọn chế độ **Passive FTP (PASV)** để máy khách chủ động mở cả kênh điều khiển lẫn kênh dữ liệu đi ra ngoài qua Tường lửa một cách trơn tru!",
                                  "Mở rộng Nâng cao 3 — Cấu hình DHCP Relay Agent (ip helper-address) khi Máy chủ DHCP nằm ở Mạng khác: Như ta đã biết, bước 1 của DHCP (DHCP Discover) là một gói tin **Broadcast**, mà Router thì chặn đứng mọi gói tin Broadcast! Vậy trong công ty có 20 phòng ban (20 mạng con khác nhau), chẳng lẽ phải dựng 20 chiếc máy chủ DHCP cho từng phòng? Không cần! Kỹ sư chỉ cần dựng **1 máy chủ DHCP tập trung duy nhất**, sau đó vào cổng LAN của các Router gõ lệnh **ip helper-address \u003cIP-Máy-Chủ-DHCP\u003e**. Lệnh này giúp Router đón gói tin DHCP Broadcast của nhân viên, bọc lại thành gói tin **Unicast** và chuyển tiếp xuyên mạng tới tận máy chủ DHCP trung tâm!"
                              ],
        "advancedTopics_en":  [
                                  "Advanced Expansion 1 — Configuring a Cisco IOS Router as a DHCPv4 Server: 1) Exclude static IPs: `ip dhcp excluded-address 192.168.10.1 192.168.10.10`; 2) Create pool: `ip dhcp pool LAN10`; 3) Define subnet: `network 192.168.10.0 255.255.255.0`; 4) Set gateway \u0026 DNS: `default-router 192.168.10.1` and `dns-server 8.8.8.8`.",
                                  "Advanced Expansion 2 — Active vs. Passive FTP Across Firewalls: FTP uses **TCP Port 21** for control and **TCP Port 20** for data. In Active FTP, the server initiates the data connection back to the client, which client firewalls often block; in **Passive FTP (PASV)**, the client initiates both control and data connections outbound."
                              ]
    },
    {
        "id":  16,
        "title":  "Network Security Fundamentals",
        "title_vi":  "Nền Tảng Bảo Mật Mạng và Cấu Hình Mã Hóa SSH",
        "overview":  "Module 16 introduces foundational cybersecurity concepts, threat actors, malware categories (Viruses, Worms, Trojan Horses), network attack types (Reconnaissance, Access, DoS/DDoS), defense-in-depth security appliances (Firewalls, IPS, VPN, AAA, ESA/WSA), and practical Cisco IOS device hardening. Most importantly, you learn why **Telnet (TCP 23)** is dangerous (sending passwords in cleartext) and how to configure **Secure Shell (SSH v2, TCP 22)**, minimum password lengths, idle timeouts (`exec-timeout`), and brute-force login blocking (`login block-for`) on Cisco routers and switches.",
        "overview_vi":  "Module 16 trang bị kiến thức cốt lõi về An ninh mạng (Cybersecurity) và thực hành gia cố bảo mật (Hardening) cho thiết bị Router/Switch Cisco. Bạn sẽ nắm vững tam giác bảo mật **CIA Triad**, phân biệt chính xác 3 loại mã độc kinh điển (**Virus, Worm, Trojan Horse**), 3 nhóm tấn công mạng (**Do thám Reconnaissance, Truy cập trái phép Access Attack, và Từ chối dịch vụ DoS/DDoS**), các thiết bị phòng thủ chuyên dụng (**Firewall, IPS, VPN, AAA**), và đặc biệt là bài thực hành bắt buộc khi thi CCNA: **Xóa bỏ Telnet (cổng 23 truyền mật khẩu lộ thiên) để cấu hình chuẩn mã hóa SSH v2 (cổng 22)** kèm tính năng tự động khóa tài khoản khi có kẻ dò mật khẩu (`login block-for`)!",
        "analogy_vi":  "Sự khác biệt giữa **Virus**, **Worm (Sâu máy tính)** và **Trojan Horse (Ngựa gỗ thành Troy)**: • **Virus** giống như ký sinh trùng bám vào một file phần mềm hợp lệ — nếu bạn không bấm chạy file đó thì nó nằm im, chỉ khi con người bấm mở file hoặc chép USB sang máy khác nó mới lây lan. • **Worm (Sâu mạng)** nguy hiểm hơn nhiều: nó tự có chân bò qua dây mạng! Chỉ cần 1 máy trong mạng LAN bị nhiễm, Worm tự động quét lỗ hổng các máy bên cạnh và tự nhân bản lây lan khắp công ty mà không cần ai bấm vào bất cứ thứ gì! • **Trojan Horse** giống như con ngựa gỗ tặng làm quà: bên ngoài trông như phần mềm cờ-rắc miễn phí hoặc game hấp dẫn để dụ bạn tự tay cài vào máy, nhưng bên trong nó âm thầm mở cửa hậu (Backdoor) cho Hacker điều khiển máy bạn từ xa!",
        "keyConcepts":  [
                            "The CIA Triad of Information Security: 1) **Confidentiality (Tính bí mật)**: Only authorized users can read data (achieved via Encryption like SSH, HTTPS, IPsec VPN). 2) **Integrity (Tính toàn vẹn)**: Data has not been tampered with or altered in transit (achieved via Hashing like MD5, SHA-256). 3) **Availability (Tính sẵn sàng)**: Authorized users have uninterrupted access to network resources (achieved via redundancy, backups, and anti-DDoS).",
                            "Malware Types — Virus vs. Worm vs. Trojan Horse (Exam Favorite!): • **Virus**: Malicious code attached to an executable file; **requires human action** (opening the file) to activate and spread. • **Worm**: Self-replicating malware that **automatically propagates across the network on its own** without any human interaction, consuming bandwidth. • **Trojan Horse**: Non-self-replicating malware disguised as legitimate software (e.g., a free utility) that opens a backdoor or steals credentials.",
                            "Three Categories of Network Attacks: 1) **Reconnaissance (Information Gathering)**: Ping sweeps, DNS queries, port scanning (Nmap), and packet sniffing (Wireshark) to map out a target before attacking. 2) **Access Attacks**: Exploiting vulnerabilities to gain unauthorized entry (Password Brute-Force/Dictionary attacks, ARP/IP Spoofing, Man-in-the-Middle). 3) **DoS / DDoS (Denial of Service)**: Flooding a server or router with overwhelming traffic (e.g., TCP SYN Flood or a Botnet of thousands of infected zombie devices in a Distributed DoS) so legitimate users cannot connect.",
                            "Defense-in-Depth Security Appliances: • **Firewall**: Filters traffic between internal trusted LAN and untrusted Internet using stateful inspection. • **IPS (Intrusion Prevention System)**: Inspects live packet payloads inline against attack signatures and drops malicious packets immediately. • **AAA Server (RADIUS / TACACS+)**: Centralized **A**uthentication (Who are you?), **A**uthorization (What are you allowed to do?), and **A**ccounting (Logging what you did). • **ESA / WSA**: Email Security Appliance (blocks phishing/spam) and Web Security Appliance (blocks malicious URLs).",
                            "Configuring SSH on Cisco IOS (5 Mandatory Steps): Never use Telnet (`TCP 23`) in production because Wireshark can read your password in plaintext! To enable encrypted **SSH (`TCP 22`)**: 1) Configure a custom `hostname` (cannot be default `Router`/`Switch`); 2) Configure an `ip domain-name` (e.g., `cisco.com`)—hostname + domain name are combined (`R1.cisco.com`) to name the RSA keypair; 3) Generate RSA cryptographic keys (`crypto key generate rsa` with modulus `\u003e= 1024`); 4) Create a local user account (`username admin secret ...`); 5) On `line vty 0 4` (or `0 15`), set `login local` and `transport input ssh`!"
                        ],
        "keyConcepts_vi":  [
                               "Tam giác Bảo mật CIA (Confidentiality - Integrity - Availability): 1) **Confidentiality (Tính Bí mật)**: Chỉ người có quyền mới đọc được dữ liệu (dùng Mã hóa Encryption như SSH, HTTPS, VPN); 2) **Integrity (Tính Toàn vẹn)**: Đảm bảo dữ liệu truyền đi nguyên vẹn, không bị kẻ gian sửa đổi con số giữa đường (dùng Hàm băm Hashing như SHA-256, MD5); 3) **Availability (Tính Sẵn sàng)**: Hệ thống luôn hoạt động phục vụ người dùng hợp pháp 24/7 (dùng thiết bị dự phòng, tường lửa chống DDoS).",
                               "Phân biệt 3 loại Mã độc (Malware) hay hỏi thi nhất: • **Virus**: Đoạn mã độc ký sinh vào một file chương trình — **bắt buộc phải có con người bấm mở file** thì nó mới kích hoạt và lây lan. • **Worm (Sâu mạng)**: Mã độc có khả năng **tự động nhân bản và tự bò lan truyền qua mạng** khai thác lỗ hổng các máy khác mà **không cần bất kỳ tác động nào của con người**, làm nghẽn sập băng thông mạng. • **Trojan Horse (Ngựa gỗ)**: Phần mềm độc hại ngụy trang dưới vỏ bọc phần mềm hữu ích miễn phí để lừa người dùng cài đặt, từ đó mở cửa hậu (Backdoor) đánh cắp mật khẩu.",
                               "3 Nhóm Tấn công Mạng (Reconnaissance, Access, DoS/DDoS): 1) **Tấn công Do thám (Reconnaissance)**: Kẻ tấn công chưa phá hoại ngay mà dùng công cụ quét dải IP (Ping sweep), quét cổng mở (Port scan bằng Nmap) để vẽ sơ đồ tìm điểm yếu của mục tiêu. 2) **Tấn công Truy cập (Access Attacks)**: Dò mật khẩu (Brute-force), giả mạo địa chỉ (Spoofing), nghe lén xen giữa (Man-in-the-Middle) để chiếm quyền điều khiển. 3) **Tấn công Từ chối dịch vụ (DoS / DDoS)**: Huy động hàng chục ngàn máy tính ma (Botnet) gửi hàng triệu yêu cầu rác cùng lúc làm tràn bộ nhớ Server hoặc đứt băng thông khiến khách hàng thật không thể truy cập.",
                               "Quy trình 5 Bước Bắt Buộc Để Cấu Hình SSH (TCP Port 22) thay thế Telnet (TCP Port 23): Giao thức Telnet truyền toàn bộ tên đăng nhập và mật khẩu dưới dạng chữ rõ (Plaintext) nên cực kỳ nguy hiểm. Để bật **SSH mã hóa an toàn** trên Router/Switch Cisco, bạn phải làm đủ **5 bước**: • **Bước 1**: Đặt tên thiết bị khác mặc định (`hostname R1`); • **Bước 2**: Đặt tên miền (`ip domain-name cisco.com`) — thiết bị sẽ ghép thành `R1.cisco.com` để làm tên tạo khóa; • **Bước 3**: Tạo cặp khóa mã hóa RSA (`crypto key generate rsa`, chọn độ dài khóa từ `1024` hoặc `2048` bit); • **Bước 4**: Tạo tài khoản người dùng lưu trên máy (`username admin secret ...`); • **Bước 5**: Vào `line vty 0 4`, gõ `login local` (bắt kiểm tra tài khoản vừa tạo) và `transport input ssh` (chỉ cho phép SSH, cấm hẳn Telnet)!",
                               "Gia cố chống dò mật khẩu trên Cisco IOS: • `security passwords min-length 10`: Bắt buộc mọi mật khẩu tạo ra phải dài ít nhất 10 ký tự. • `exec-timeout 5 0`: Nếu quản trị viên bỏ máy đi uống cafe quên thoát trong 5 phút 0 giây, thiết bị tự động đăng xuất để người lạ không ngồi vào gõ lệnh được. • `login block-for 120 attempts 3 within 60`: Nếu có kẻ nhập sai mật khẩu **3 lần trong vòng 60 giây**, Router lập tức **khóa cổng đăng nhập suốt 120 giây** (chống tấn công Brute-force dò mật khẩu tự động)!"
                           ],
        "realWorldExample":  "Scenario: Hardening Router `R1` for secure remote SSH administration and brute-force protection:\n1. Set `hostname R1` and `ip domain-name netacad.pka`.\n2. Enforce 10-character minimum passwords (`security passwords min-length 10`) and create user `admin` with scrypt/MD5 secret `Str0ngP@ss99`.\n3. Generate a 1024-bit RSA keypair and enable `ip ssh version 2`.\n4. Lock down VTY lines (`line vty 0 4`) to accept ONLY SSH (`transport input ssh`), authenticate against the local database (`login local`), and auto-logout after 5 minutes of inactivity (`exec-timeout 5 0`).\n5. Configure `login block-for 180 attempts 4 within 60` so any attacker failing 4 logins in 1 minute is locked out for 3 minutes.",
        "realWorldExample_vi":  "Ví dụ bài Lab cấu hình Bảo mật SSH \u0026 Chống dò mật khẩu đạt 100/100 điểm trên Cisco Packet Tracer:\nĐề bài yêu cầu trên Router `R1`: Tắt hoàn toàn Telnet, chỉ cho phép quản trị từ xa qua **SSH v2** bằng tài khoản `admin` / mật khẩu `Admin@12345`, tự thoát sau 5 phút không gõ phím, và khóa 2 phút nếu nhập sai 3 lần trong 60 giây:\n1. Đặt tên và miền: `hostname R1` và `ip domain-name cisco.com`.\n2. Đặt độ dài mật khẩu tối thiểu 10 ký tự: `security passwords min-length 10`.\n3. Tạo tài khoản cục bộ: `username admin secret Admin@12345`.\n4. Sinh khóa mã hóa RSA 1024-bit: `crypto key generate rsa` -\u003e nhập `1024`, bật `ip ssh version 2`.\n5. Vào cổng điều khiển từ xa `line vty 0 4`: gõ `transport input ssh` (chặn đứng Telnet), `login local` (kiểm tra đúng user `admin`), và `exec-timeout 5 0` (5 phút tự thoát).\n6. Bật lá chắn chống Brute-force ở chế độ Global Config: `login block-for 120 attempts 3 within 60`. Bây giờ từ máy tính PC gõ `ssh -l admin 192.168.10.1` là đăng nhập mã hóa an toàn tuyệt đối!",
        "diagramType":  "ssh-security",
        "commands":  [
                         "Router(config)# hostname R1                                        # Bước 1 SSH: Đặt tên Hostname cho thiết bị",
                         "R1(config)# ip domain-name cisco.com                               # Bước 2 SSH: Đặt Domain Name để ghép tên sinh khóa RSA",
                         "R1(config)# security passwords min-length 10                       # Bắt buộc mật khẩu từ 10 ký tự trở lên",
                         "R1(config)# username admin secret Adm1nP@ss99                      # Bước 3 SSH: Tạo tài khoản và mật khẩu mã hóa trong cơ sở dữ liệu nội bộ",
                         "R1(config)# crypto key generate rsa general-keys modulus 1024      # Bước 4 SSH: Sinh cặp khóa mã hóa RSA 1024-bit (tự động bật dịch vụ SSH)",
                         "R1(config)# ip ssh version 2                                       # Chuyển sang dùng chuẩn SSH phiên bản 2 an toàn hơn",
                         "R1(config)# line vty 0 4                                           # Bước 5 SSH: Vào cấu hình các đường kết nối từ xa VTY",
                         "R1(config-line)# login local                                       # Yêu cầu đăng nhập bằng username/secret vừa tạo ở Bước 3",
                         "R1(config-line)# transport input ssh                               # CHỈ cho phép kết nối qua SSH (cấm hoàn toàn Telnet)",
                         "R1(config-line)# exec-timeout 5 0                                  # Tự động đăng xuất nếu treo máy không gõ lệnh sau 5 phút 0 giây",
                         "R1(config-line)# exit",
                         "R1(config)# login block-for 120 attempts 3 within 60               # Khóa đăng nhập 120 giây nếu nhập sai mật khẩu 3 lần trong vòng 60 giây",
                         "R1# show ip ssh                                                    # Kiểm tra trạng thái phiên bản SSH đã bật thành công chưa"
                     ],
        "comparisonTable":  {
                                "title_vi":  "Bảng Tổng Hợp Các Mối Đe Dọa An Ninh Mạng, Giải Pháp Phòng Thủ \u0026 Danh Sách Kiểm Soát Truy Cập (ACL)",
                                "headers_vi":  [
                                                   "Loại Tấn Công / Giải Pháp",
                                                   "Cơ Chế Hoạt Động",
                                                   "Ví Dụ Thực Tế",
                                                   "Cách Phòng Chống Chuẩn Cisco"
                                               ],
                                "rows":  [
                                             [
                                                 "Virus vs. Worm vs. Trojan",
                                                 "**Virus** cần người mở file; **Worm** tự động bò lan qua mạng; **Trojan** giả dạng phần mềm tốt mở cửa hậu.",
                                                 "WannaCry (Worm tống tiền), Keylogger ngụy trang trong phần mềm crack (Trojan).",
                                                 "Cập nhật bản vá hệ điều hành, cài Endpoint Antivirus/EDR, chặn cổng SMB thừa."
                                             ],
                                             [
                                                 "Reconnaissance (Do thám)",
                                                 "Quét mạng tìm IP sống, quét cổng mở, bắt gói tin nghe lén trước khi tấn công thật.",
                                                 "Dùng `Nmap` quét cổng, dùng `Wireshark` bắt gói tin Telnet/HTTP không mã hóa.",
                                                 "Tắt Telnet chuyển sang **SSH v2**, dùng HTTPS, tắt CDP ở cổng ngoài (`no cdp enable`)."
                                             ],
                                             [
                                                 "Access \u0026 MitM Attacks",
                                                 "Dò mật khẩu (Brute-force), Giả mạo ARP (ARP Spoofing), Giả mạo DHCP Server.",
                                                 "Kẻ gian cắm máy tính vào mạng LAN chạy công cụ giả làm Default Gateway.",
                                                 "Bật **`login block-for`** trên Router; bật **Port-Security, DHCP Snooping \u0026 Dynamic ARP Inspection** trên Switch."
                                             ],
                                             [
                                                 "DoS / DDoS Attack",
                                                 "Làm ngập lụt băng thông hoặc làm tràn tài nguyên RAM/CPU của Server/Router.",
                                                 "TCP SYN Flood, Botnet hàng vạn camera IoT cùng tấn công 1 website.",
                                                 "Cấu hình Firewall, IPS (Intrusion Prevention System), giới hạn tốc độ (Rate-limiting)."
                                             ],
                                             [
                                                 "Standard IPv4 ACL (Số 1–99)",
                                                 "Chỉ lọc gói tin dựa trên duy nhất **Địa chỉ IP Nguồn (Source IP)**.",
                                                 "`access-list 10 permit 192.168.1.0 0.0.0.255`",
                                                 "Quy tắc đặt: Đặt Standard ACL **GẦN ĐÍCH (Destination) NHẤT** để tránh chặn nhầm sang các mạng khác."
                                             ],
                                             [
                                                 "Extended IPv4 ACL (Số 100–199)",
                                                 "Lọc chi tiết theo cả **IP Nguồn, IP Đích, Giao thức (TCP/UDP/ICMP) và Số Cổng (Port)**.",
                                                 "`access-list 100 permit tcp any host 10.1.1.5 eq 443`",
                                                 "Quy tắc đặt: Đặt Extended ACL **GẦN NGUỒN (Source) NHẤT** để chặn gói tin xấu ngay từ cửa ngõ!"
                                             ]
                                         ]
                            },
        "jobSkills_vi":  [
                             "Kinh nghiệm Đi Làm 1 — Giới hạn chỉ cho phép duy nhất máy tính của Admin được phép SSH vào Router bằng ACL (`access-class`): Dù bạn đã bật SSH v2 và đặt mật khẩu mạnh, nhưng nếu để bất kỳ máy tính nào trong công ty (hoặc ngoài Internet) cũng hiện màn hình hỏi mật khẩu SSH của Router thì vẫn rất rủi ro. Khi đi làm, kỹ sư mạng sẽ tạo một danh sách cho phép chỉ riêng IP máy tính của phòng IT (`192.168.10.99`) được phép chạm vào cổng VTY: 1) Tạo ACL: `R1(config)# access-list 99 permit host 192.168.10.99`; 2) Áp vào cổng VTY: `R1(config)# line vty 0 4` -\u003e **`R1(config-line)# access-class 99 in`**! Từ lúc đó, mọi máy tính khác kết nối SSH vào Router đều bị từ chối thẳng thừng ngay từ vòng gửi xe!",
                             "Kinh nghiệm Đi Làm 2 — Hiểu rõ \u0027Wildcard Mask\u0027 (Mặt nạ nghịch đảo) khi viết lệnh ACL và OSPF: Trong Cisco IOS, khi cấu hình ACL hoặc định tuyến OSPF, người ta không dùng Subnet Mask (`255.255.255.0`) mà dùng **Wildcard Mask** (`0.0.0.255` — trong đó bit `0` nghĩa là *Bắt buộc phải khớp chính xác*, còn bit `1` nghĩa là *Bỏ qua không cần kiểm tra*). Công thức tính Wildcard Mask cực dễ: **Lấy `255.255.255.255` trừ đi Subnet Mask**! Ví dụ: Subnet Mask `/26` là `255.255.255.192` $\\Rightarrow$ Wildcard Mask = `0.0.0.63` (luôn bằng **Bước nhảy trừ đi 1**!)."
                         ],
        "quiz":  [
                     {
                         "question_vi":  "Câu 1 (Đề thi CCNA): Loại mã độc (Malware) nào có khả năng tự động nhân bản và tự phát tán lây lan qua mạng từ máy tính này sang máy tính khác bằng cách khai thác lỗ hổng bảo mật mà KHÔNG CẦN bất kỳ thao tác mở file nào từ phía người dùng?",
                         "options_vi":  [
                                            "A. Virus",
                                            "B. Trojan Horse (Ngựa gỗ)",
                                            "C. Worm (Sâu mạng)",
                                            "D. Spyware"
                                        ],
                         "answerIndex":  2,
                         "explanation_vi":  "Đáp án đúng là C (Worm - Sâu mạng). Điểm phân biệt sống còn trong đề thi CCNA: **Virus** cần con người kích hoạt/chạy file nhiễm độc; **Trojan Horse** ngụy trang thành phần mềm hợp pháp nhưng không tự nhân bản; còn **Worm** tự động quét mạng, tự nhân bản và lây lan độc lập làm tiêu tốn băng thông mạng."
                     },
                     {
                         "question_vi":  "Câu 2 (Đề thi CCNA): Trước khi có thể chạy lệnh `crypto key generate rsa` để sinh cặp khóa mã hóa cho dịch vụ SSH trên một thiết bị Router hoặc Switch Cisco mới, quản trị viên BẮT BUỘC phải cấu hình hai lệnh nào trước?",
                         "options_vi":  [
                                            "A. `enable secret` và `service password-encryption`",
                                            "B. `hostname` (khác tên mặc định) và `ip domain-name`",
                                            "C. `banner motd` và `no ip domain-lookup`",
                                            "D. `ip default-gateway` và `interface vlan 1`"
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B (`hostname` và `ip domain-name`). Thiết bị Cisco IOS sử dụng tổ hợp `\u003chostname\u003e.\u003cdomain-name\u003e` (ví dụ `R1.cisco.com`) để đặt tên định danh cho cặp khóa RSA. Nếu chưa đổi hostname hoặc chưa đặt `ip domain-name`, lệnh `crypto key generate rsa` sẽ báo lỗi từ chối thực hiện ngay."
                     },
                     {
                         "question_vi":  "Câu 3 (Đề thi CCNA): Quản trị viên gõ câu lệnh `R1(config)# login block-for 180 attempts 3 within 60` trên Router R1. Câu lệnh này có tác dụng gì?",
                         "options_vi":  [
                                            "A. Tự động đăng xuất quản trị viên sau 180 giây không gõ bàn phím.",
                                            "B. Cho phép tối đa 3 người cùng đăng nhập SSH trong 60 giây.",
                                            "C. Nếu có người nhập sai mật khẩu đăng nhập 3 lần liên tiếp trong vòng 60 giây, Router sẽ tự động khóa mọi kết nối đăng nhập Telnet/SSH/Console trong 180 giây để chống tấn công dò mật khẩu (Brute-force).",
                                            "D. Mã hóa mật khẩu dài 60 ký tự trong 180 ngày."
                                        ],
                         "answerIndex":  2,
                         "explanation_vi":  "Đáp án đúng là C. Lệnh `login block-for \u003cgiây_khóa\u003e attempts \u003csố_lần_sai\u003e within \u003ckhung_thời_gian_giây\u003e` là tính năng chống tấn công dò mật khẩu tự động (Brute-force / Dictionary attack) trực tiếp trên Cisco IOS."
                     }
                 ],
        "beginnerGuide_vi":  [
                                 "1. Tại sao một người mới học mạng lại phải quan tâm đến Bảo mật (Security) ngay từ những bài đầu tiên? Hãy tưởng tượng bạn xây một ngôi nhà thật đẹp (cấu hình mạng chạy thông suốt), nhưng lại không lắp ổ khóa cửa hay để chìa khóa ngay dưới tấm thảm chùi chân (đặt mật khẩu mặc định là `cisco`, dùng giao thức `Telnet` không mã hóa, không khóa các cổng Switch trống). Chỉ cần một người biết chút ít công nghệ cắm laptop vào ổ mạng trên tường là có thể nghe lén toàn bộ mật khẩu của công ty hoặc làm sập mạng trong vài giây!",
                                 "2. Hiểu cực dễ sự khác nhau giữa Telnet (Cổng 23) và SSH (Cổng 22) khi điều khiển thiết bị từ xa: Cả Telnet và SSH đều giúp bạn ngồi ở bàn làm việc gõ lệnh điều khiển Switch/Router ở dưới phòng Server. Nhưng: • **Telnet** giống như bạn viết mật khẩu lên một tờ bưu thiếp không bỏ vào phong bì — đi qua dây mạng ai nhìn vào (bằng phần mềm Wireshark) cũng đọc được rõ mồn một chữ `Password: Admin123`! • **SSH (Secure Shell)** giống như bỏ bức thư vào một chiếc két sắt khóa mật mã **RSA** trước khi gửi đi — kẻ nghe lén bắt được gói tin trên đường dây cũng chỉ thấy một đống ký tự vô nghĩa `#$%@!^\u0026*`!",
                                 "3. Tường lửa (Firewall) và Danh sách kiểm soát truy cập (ACL - Access Control List) là gì? Hãy hình dung chúng giống như **Bác bảo vệ gác cổng tòa nhà cầm theo một tờ Danh sách Quy định (ACL)**: Khi có một gói tin muốn đi từ ngoài Internet vào mạng công ty, bác bảo vệ đối chiếu từ dòng số 1 xuống dòng cuối cùng của danh sách: *\u0027Dòng 1: Cho phép khách vào trang Web công ty (Permit TCP Port 443); Dòng 2: Cấm mọi người lạ bước vào phòng Kế toán (Deny all)\u0027*!",
                                 "4. Phân biệt 3 loại phần mềm độc hại (Malware) phổ biến nhất: Virus, Worm (Sâu máy tính) và Trojan Horse (Ngựa gỗ thành Troy): • **Virus**: Là đoạn mã độc gắn kèm vào một file chương trình hợp lệ. Nó nằm im cho đến khi **con người vô tình bấm đúp chuột chạy file đó** thì mới phát tán. • **Worm (Sâu mạng)**: Nguy hiểm hơn Virus rất nhiều vì nó **TỰ ĐỘNG NHÂN BẢN VÀ LÂY LAN QUA MẠNG** bằng cách quét các lỗ hổng bảo mật mà **không cần bất kỳ sự tác động nào của con người** (làm nghẽn toàn bộ băng thông mạng). • **Trojan Horse**: Ngụy trang dưới vỏ bọc một phần mềm miễn phí hấp dẫn để dụ người dùng tự cài vào máy, từ đó mở cửa hậu (Backdoor) cho hacker điều khiển từ xa.",
                                 "5. Ba chữ A trong hệ thống bảo mật AAA (Authentication - Authorization - Accounting) nghĩa là gì? Hãy hình dung bạn dùng thẻ ngân hàng: • **1. Authentication (Xác thực — \u0027Bạn là ai?\u0027)**: Bạn đút thẻ vào máy ATM và nhập mã PIN 6 số để chứng minh danh tính. • **2. Authorization (Phân quyền — \u0027Bạn được phép làm gì?\u0027)**: Sau khi đúng PIN, hệ thống kiểm tra thẻ của bạn là thẻ chuẩn nên chỉ cho phép rút tối đa 20 triệu đồng/ngày. • **3. Accounting (Kiểm toán / Ghi nhật ký — \u0027Bạn đã làm những gì?\u0027)**: Hệ thống ghi lại chính xác lúc 14:05 bạn đã rút 2 triệu đồng tại cây ATM Quận 1 để lưu bằng chứng đối soát."
                             ],
        "beginnerGuide_en":  [
                                 "1. Why is Network Security critical from Day 1? A working network with default passwords, unencrypted management protocols, or open switch ports can be compromised in seconds by anyone plugging in a laptop or running packet-sniffing software.",
                                 "2. Telnet (Port 23) vs. SSH (Port 22) Made Simple: Both allow you to remotely access a router or switch CLI over the network. However, **Telnet** sends your username, password, and commands in **unencrypted cleartext** (anyone running Wireshark can read your password!), whereas **SSH (Secure Shell)** encrypts the entire session using **RSA cryptography**.",
                                 "3. What are Firewalls and ACLs (Access Control Lists)? They act as security guards at network boundaries, reading a top-to-bottom rule list (**Permit** or **Deny**) based on IP addresses and port numbers to filter out unauthorized traffic."
                             ],
        "advancedTopics_vi":  [
                                  "Mở rộng Nâng cao 1 — Cấu hình Bảo mật Cổng Switch (**Port Security**) chống cắm thiết bị lạ và chống tràn bảng MAC: Trên các cổng Switch cắm xuống bàn làm việc của nhân viên (ví dụ `interface fa0/5`), kỹ sư mạng gõ 4 câu lệnh bảo vệ Tầng 2 cực mạnh: 1) `switchport mode access` (Bắt buộc chuyển sang cổng Access trước mới bật được Port-Security!); 2) `switchport port-security` (Kích hoạt tính năng); 3) `switchport port-security maximum 1` (Chỉ cho phép đúng 1 địa chỉ MAC duy nhất trên cổng này); 4) `switchport port-security mac-address sticky` (Tự động học địa chỉ MAC của chiếc PC đầu tiên cắm vào và lưu cứng vào cấu hình) + `switchport port-security violation shutdown` (Nếu ai đó rút dây PC ra cắm laptop lạ vào, cổng sẽ tự động khóa chết về trạng thái `err-disabled`)!",
                                  "Mở rộng Nâng cao 2 — Quy tắc sống còn khi viết Danh sách Kiểm soát Truy cập ACL trên Router Cisco (`Implicit Deny Any` ở dòng cuối cùng!): Khi bạn tạo một danh sách lọc gói tin **ACL** trên Router, ở dưới đáy của mọi ACL luôn có một dòng vô hình mặc định là **`deny ip any any` (Cấm tất cả những gì không được liệt kê ở trên)**! Vì vậy, nếu bạn viết một ACL chỉ có các câu lệnh `deny` mà quên không có ít nhất một câu lệnh **`permit`** ở dưới thì ngay khi áp ACL lên cổng, **100% lưu lượng mạng đi qua cổng đó sẽ bị chặn sạch sẽ**!",
                                  "Mở rộng Nâng cao 3 — Bộ 3 Lá chắn Bảo mật Tầng 2 trên Switch Doanh nghiệp (DHCP Snooping + Dynamic ARP Inspection + IP Source Guard): Để bảo vệ mạng nội bộ tuyệt đối trước hacker ngồi ngay trong văn phòng, kỹ sư triển khai liên hoàn 3 lớp khóa trên Switch: 1) **DHCP Snooping**: Chia các cổng Switch thành cổng *Trusted* (cổng nối lên DHCP Server thật) và *Untrusted* (cổng nhân viên), đồng thời ghi lại bảng ánh xạ [MAC + IP + Cổng + VLAN]; 2) **Dynamic ARP Inspection (DAI)**: Dựa vào bảng DHCP Snooping để chặn đứng mọi gói tin ARP Reply giả mạo (chống ARP Spoofing); 3) **IP Source Guard (IPSG)**: Cấm máy trạm tự ý đặt IP tĩnh giả mạo máy khác."
                              ],
        "advancedTopics_en":  [
                                  "Advanced Expansion 1 — Switch Port Security (`switchport port-security`): Prevents MAC table overflow attacks and rogue devices on access ports: 1) `switchport mode access`; 2) `switchport port-security`; 3) `switchport port-security maximum 1`; 4) `switchport port-security mac-address sticky`; 5) `switchport port-security violation {protect | restrict | shutdown}`.",
                                  "Advanced Expansion 2 — The Invisible \u0027Implicit Deny Any\u0027 at the End of Every Cisco ACL: Every Cisco Access Control List ends with an unseen **`deny any`** rule. Therefore, every ACL MUST contain at least one **`permit`** statement, or it will block 100% of traffic on the interface!"
                              ]
    },
    {
        "id":  17,
        "title":  "Build a Small Network",
        "title_vi":  "Thiết Kế, Triển Khai và Xử Lý Sự Cố Mạng Nhỏ",
        "overview":  "Module 17 brings together every concept from Modules 1–16 to design, build, document, baseline, and troubleshoot a complete small enterprise network. You learn how to choose the right routers and switches (fixed vs. modular, port speed, PoE, redundancy), implement QoS queuing so voice and video never lag, map out a live network topology using **Cisco Discovery Protocol (CDP)**, and apply the structured **6/7-Step Troubleshooting Methodology** alongside Layered Approaches (**Bottom-Up, Top-Down, and Divide-and-Conquer**) to resolve real-world network outages quickly.",
        "overview_vi":  "Module 17 là bài tổng kết thực chiến ghép nối toàn bộ kiến thức từ Module 1 đến Module 16 để tự tay **Thiết kế, Xây dựng, Khám phá sơ đồ và Xử lý sự cố (Troubleshooting)** cho một mạng doanh nghiệp vừa và nhỏ hoàn chỉnh. Bạn sẽ học cách chọn mua thiết bị Switch/Router phù hợp ngân sách và khả năng mở rộng, thiết lập ưu tiên băng thông QoS cho cuộc gọi thoại/video, dùng công cụ thần thánh **`show cdp neighbors`** để vẽ lại sơ đồ mạng khi vào nhận việc ở một công ty không có tài liệu bàn giao, và áp dụng **3 Phương pháp khoanh vùng bắt bệnh mạng (Bottom-Up, Top-Down, Divide-and-Conquer)** để tìm ra chính xác nguyên nhân mất mạng chỉ trong vài phút!",
        "analogy_vi":  "Khi một người dùng gọi điện báo *\u0027Anh IT ơi máy em không vào được web!\u0027*, một kỹ sư mạng chuyên nghiệp (CCNA) không bao giờ đoán mò hay cài lại Win ngay, mà làm giống hệt một Bác sĩ cấp cứu theo phương pháp **Chia để trị (Divide-and-Conquer)**: Bác sĩ đặt ống nghe vào ngay chính giữa cơ thể (**Tầng 3 Network — gõ lệnh `ping` tới Default Gateway và `ping 8.8.8.8`**): • Nếu `ping 8.8.8.8` **THÔNG SUỐT** mà vào web `google.com` không được -\u003e Chắc chắn Tầng 1, 2, 3 hoàn toàn khỏe mạnh! Bệnh nằm ở nửa trên (**Tầng 4–7**, cụ thể 99% là thiếu hoặc sai **DNS Server**!). • Ngược lại, nếu `ping` tới Default Gateway **THẤT BẠI** -\u003e Bệnh nằm ở nửa dưới (**Tầng 1–3**: tuột dây mạng, tắt cổng Switch, đặt sai IP hoặc sai Subnet Mask)!",
        "keyConcepts":  [
                            "Small Network Design \u0026 Device Selection Factors: 1) **Cost \u0026 Port Density** (Fixed-configuration switches like Catalyst 2960/1000 vs. Modular chassis switches); 2) **Speed \u0026 Power over Ethernet (PoE)** to power IP Phones and Wireless Access Points directly over the UTP Ethernet cable; 3) **Redundancy** (eliminating Single Points of Failure with dual links/gateways); 4) **QoS Priority Queuing** (placing Delay-Sensitive Voice traffic into the Strict Priority Queue so it is always forwarded first).",
                            "Establishing a Network Performance Baseline: You cannot know if a network is \u0027slow\u0027 today unless you recorded what \u0027normal\u0027 looks like! A Network Baseline documents normal CPU/RAM utilization (`show processes cpu`), interface bandwidth usage (`show interfaces`), and average `ping` RTT / `tracert` latency during both peak business hours and quiet hours.",
                            "Cisco Discovery Protocol (CDP) vs. LLDP: **CDP** is a Cisco-proprietary Layer 2 protocol enabled by default that periodically sends advertisements to directly connected Cisco neighbors—even if no IP addresses are configured! Running `show cdp neighbors` reveals the neighbor\u0027s **Device ID (hostname), Local Interface, Neighbor\u0027s Port ID, Hardware Platform, and Capabilities** (`R`=Router, `S`=Switch). Adding `detail` (`show cdp neighbors detail`) also reveals the **Neighbor\u0027s IPv4/IPv6 Address and IOS Version**! *(Note: Because CDP reveals sensitive info to attackers, disable it on untrusted ports with `no cdp enable` or globally with `no cdp run`).*",
                            "The 6-Step Cisco Troubleshooting Process: **Step 1**: Identify the problem (gather symptoms from users and `show` commands); **Step 2**: Establish a theory of probable causes; **Step 3**: Test the theory to determine the exact cause; **Step 4**: Establish a plan of action and implement the solution; **Step 5**: Verify full system functionality and implement preventive measures; **Step 6**: Document findings, actions, and outcomes.",
                            "Three OSI Troubleshooting Approaches: 1) **Bottom-Up** (Start at Layer 1 physical cables/LEDs and work up to Layer 7—best when you suspect a physical/hardware issue or single host outage); 2) **Top-Down** (Start at Layer 7 application/browser and work down—best when only one specific application like email fails while web browsing works); 3) **Divide-and-Conquer** (Start at Layer 3 with `ping`/`tracert`: a successful ping proves Layers 1–3 work so you check Layers 4–7; a failed ping tells you to check Layers 1–3!).",
                            "Top 5 Classic Exam Troubleshooting Scenarios: 1) **Duplex Mismatch** (One end set to `duplex full` and the other set to `duplex half` -\u003e connection works slowly with massive collision/CRC errors); 2) **Wrong Default Gateway on PC** (PC can ping other PCs in the same LAN, but CANNOT ping anything outside its LAN!); 3) **DNS Failure** (PC can `ping 8.8.8.8` by IP address, but cannot open `www.google.com` by name); 4) **Router Interface `administratively down`** (Someone forgot `no shutdown`); 5) **Overlapping or Wrong Subnet Mask**."
                        ],
        "keyConcepts_vi":  [
                               "Tiêu chí chọn thiết bị và Thiết kế mạng doanh nghiệp nhỏ: 1) **Số lượng cổng và Khả năng mở rộng** (Chọn Switch cố định 24/48 cổng hay Switch dạng khe cắm Module mở rộng); 2) **Cấp nguồn qua cáp mạng (PoE - Power over Ethernet)**: Chọn Switch có PoE để cấp điện trực tiếp qua sợi cáp mạng RJ45 nuôi Điện thoại bàn IP (IP Phone), Cục phát Wi-Fi (Access Point) và Camera IP mà không cần cắm ổ điện rời; 3) **Dự phòng chịu lỗi (Redundancy)** và **Ưu tiên lưu lượng QoS** (Đưa gói tin thoại VoIP vào hàng đợi ưu tiên tuyệt đối Priority Queue để không bao giờ bị trễ tiếng).",
                               "Giao thức Khám phá Hàng xóm **CDP (Cisco Discovery Protocol)** — Vũ khí bí mật khi đi làm: Giả sử bạn mới vào nhận việc ở một công ty, hệ thống mạng không có bản vẽ sơ đồ và dây cáp trong tủ Rack rối như tơ vò, làm sao biết cổng `Gi0/1` của Switch đang cắm vào con Router nào? Chỉ cần gõ **`show cdp neighbors`**! CDP hoạt động ở Tầng 2 (kể cả khi thiết bị đầu kia chưa đặt IP vẫn tìm ra được!), cho bạn biết ngay: **Tên thiết bị hàng xóm (Device ID), Cổng trên máy mình (Local Intrfce), Loại thiết bị (Switch hay Router), và Cổng cắm bên máy hàng xóm (Port ID)**. Nếu gõ thêm chữ `detail` (**`show cdp neighbors detail`**), bạn biết luôn cả **Địa chỉ IP của thiết bị hàng xóm** để SSH sang nó! *(Lưu ý bảo mật: Hãy tắt CDP ở các cổng nối ra ngoài Internet bằng lệnh `no cdp enable` để Hacker không dò được thông tin thiết bị).* ",
                               "3 Phương pháp Khoanh vùng Bắt bệnh theo mô hình OSI: • **1. Bottom-Up (Đi từ Tầng 1 Vật lý đi lên)**: Kiểm tra đèn cổng mạng, dây cáp, trạng thái `up/up` trước rồi mới kiểm tra IP -\u003e Rất hiệu quả khi nghi ngờ đứt cáp hoặc mất mạng hoàn toàn trên 1 máy. • **2. Top-Down (Đi từ Tầng 7 Ứng dụng đi xuống)**: Kiểm tra phần mềm trình duyệt, DNS trước -\u003e Dùng khi máy vẫn vào Zalo/Web bình thường nhưng chỉ riêng phần mềm Kế toán hoặc Email bị lỗi. • **3. Divide-and-Conquer (Chia để trị — Nhanh nhất và hay dùng nhất)**: Đứng ngay giữa ở **Tầng 3 gõ lệnh `ping`**: Nếu `ping` ra IP ngoài mạng thành công -\u003e Tầng 1, 2, 3 hoàn toàn tốt, chỉ cần kiểm tra Tầng 4–7 (như DNS, Port, Firewall); nếu `ping` thất bại -\u003e Kiểm tra ngược xuống Tầng 1, 2, 3 (Default Gateway, IP, VLAN, Cáp)!",
                               "5 \u0027Căn Bệnh Kinh Điển\u0027 Luôn Xuất Hiện Trong Đề Thi Thực Hành CCNA (Bắt buộc nhớ triệu chứng): • **Bệnh 1 — Ping cùng mạng LAN thì được, nhưng Ping sang mạng khác thì chết**: 99% là do máy tính PC đặt **SAI địa chỉ Default Gateway** (hoặc cổng Router chưa bật)! • **Bệnh 2 — Ping địa chỉ số `8.8.8.8` thì thành công, nhưng gõ tên miền `www.cisco.com` thì báo lỗi**: 100% là do máy tính khai báo **SAI hoặc THIẾU địa chỉ DNS Server**! • **Bệnh 3 — Lệch chế độ Duplex (Duplex Mismatch)**: Một đầu dây đặt `duplex full`, đầu kia đặt `duplex half` -\u003e Mạng vẫn sáng đèn nhưng chập chờn cực chậm, gõ `show interfaces` thấy báo hàng ngàn lỗi `Late collisions` và `CRC`. • **Bệnh 4 — Cổng Router báo `administratively down`**: Quên gõ lệnh `no shutdown`. • **Bệnh 5 — Máy tính tự nhận IP `169.254.x.x` (APIPA)**: Không liên lạc được với máy chủ DHCP.",
                               "Lệnh kiểm tra thông tin phần cứng và hệ điều hành (`show version`): Cho biết phiên bản hệ điều hành Cisco IOS đang chạy trong bộ nhớ Flash, thời gian thiết bị đã chạy liên tục (Uptime), dung lượng RAM/NVRAM/Flash, số lượng cổng vật lý, và mã thanh ghi khởi động **Configuration Register** (mặc định là `0x2102` — tải file `startup-config` bình thường; nếu là `0x2142` — bỏ qua `startup-config` dùng để phá mật khẩu khi quên!)."
                           ],
        "realWorldExample":  "Scenario: Troubleshooting a Mystery Network Ticket using Divide-and-Conquer \u0026 CDP:\n**Ticket**: User on PC1 (`192.168.10.50/24`) says *\u0027I cannot open the company intranet website `http://intranet.corp.local` (hosted on Server `192.168.20.100`), even though I can print to the local office printer `192.168.10.5`!\u0027*\n1. **Clue 1**: Printing to `192.168.10.5` works! That immediately proves PC1\u0027s Layer 1 cable, Layer 2 switch port, and local IPv4 address (`192.168.10.50/24`) are 100% working!\n2. **Step 2 (Divide-and-Conquer at Layer 3)**: On PC1, you run `ping 192.168.20.100` -\u003e **Request timed out**.\n3. **Step 3 (Check Default Gateway)**: You run `ipconfig` on PC1 and spot the culprit: Default Gateway is typed as `192.168.10.100` instead of Router R1\u0027s IP `192.168.10.1`!\n4. **Resolution**: You fix PC1\u0027s Default Gateway to `192.168.10.1`. Now `ping 192.168.20.100` and `http://intranet.corp.local` work instantly!",
        "realWorldExample_vi":  "Tình huống thực tế Xử lý sự cố mạng trong 60 giây bằng phương pháp Chia để trị (Divide-and-Conquer):\n**Sự cố**: Nhân viên kế toán ngồi tại máy **PC1 (`192.168.10.50/24`)** báo: *\u0027Em vẫn in được tài liệu ra máy in trong phòng (`192.168.10.5`), nhưng không thể nào truy cập được trang web nội bộ trên Server ở phòng bên cạnh (`http://ketoan.congty.vn` có IP là `192.168.20.100`)!\u0027*\n\n**Các bước chẩn đoán của Kỹ sư CCNA**:\n• **Phân tích dữ kiện**: Máy PC1 vẫn in được ra máy in `192.168.10.5` (cùng mạng `.10.0/24`) -\u003e Chứng tỏ Dây cáp mạng (Tầng 1), Switch (Tầng 2) và IP của PC1 hoàn toàn BÌNH THƯỜNG! Không cần cúi xuống gầm bàn kiểm tra dây cáp làm gì cho mất công!\n• **Bước 1 (Thử Ping bằng IP sang Server mạng `.20.0`)**: Gõ `ping 192.168.20.100`:\n  - *Khả năng A*: Nếu `ping 192.168.20.100` **THÀNH CÔNG**, mà mở web `http://ketoan.congty.vn` không lên -\u003e Lỗi 100% do **DNS Server** (gõ `nslookup` để kiểm tra).\n  - *Khả năng B*: Nếu `ping 192.168.20.100` **THẤT BẠI (Request timed out)** -\u003e Gói tin không bước ra khỏi phòng được! Bạn gõ ngay `ipconfig` kiểm tra dòng **Default Gateway** trên PC1 thì phát hiện ai đó gõ nhầm thành `192.168.1.1` thay vì `192.168.10.1`!\n• **Bước 2 (Khắc phục \u0026 Xác nhận)**: Sửa lại Default Gateway của PC1 thành `192.168.10.1` -\u003e Ping thông suốt và vào trang web kế toán ngay lập tức!",
        "diagramType":  "small-network-troubleshoot",
        "commands":  [
                         "Router# show cdp neighbors                 # Khám phá các thiết bị Cisco đang nối trực tiếp (Tên, Cổng nối, Loại thiết bị)",
                         "Router# show cdp neighbors detail          # Xem chi tiết cả Địa chỉ IP và phiên bản IOS của thiết bị Cisco hàng xóm",
                         "Router(config)# no cdp run                 # Tắt hoàn toàn giao thức CDP trên toàn bộ thiết bị để bảo mật",
                         "Router(config-if)# no cdp enable           # Chỉ tắt CDP trên 1 cổng cụ thể (ví dụ cổng nối ra ngoài nhà mạng ISP)",
                         "Router# show version                       # Xem phiên bản IOS, thời gian Uptime, dung lượng RAM/Flash và thanh ghi 0x2102",
                         "Switch# show interfaces status             # Xem bảng tóm tắt toàn bộ các cổng Switch (Connected/Notconnect, VLAN, Duplex, Speed)",
                         "Router# show ip interface brief            # Kiểm tra nhanh IP và trạng thái Tầng 1 / Tầng 2 (up / up) của mọi cổng",
                         "Router# show ip route                      # Kiểm tra bảng định tuyến xem đã có đường đi tới mạng đích chưa",
                         "Router# show ip protocols                  # Xem các giao thức định tuyến động đang chạy trên Router"
                     ],
        "comparisonTable":  {
                                "title_vi":  "Bảng 8 Mức Độ Cảnh Báo Nhật Ký Hệ Thống (Syslog Severity Levels 0–7) \u0026 Lệnh Chẩn Đoán Thực Chiến",
                                "headers_vi":  [
                                                   "Mức Syslog (Level)",
                                                   "Tên Tiếng Anh (Chuẩn Đề Thi)",
                                                   "Ý Nghĩa Thực Tế",
                                                   "Mẹo Nhớ Thuộc Lòng Từ Mức 0 -\u003e Mức 7"
                                               ],
                                "rows":  [
                                             [
                                                 "**Level 0**",
                                                 "**Emergencies** (Khẩn cấp nhất)",
                                                 "Hệ thống sập hoàn toàn không thể sử dụng (`System Unusable`).",
                                                 "**E**very (0 - Emergencies)"
                                             ],
                                             [
                                                 "**Level 1**",
                                                 "**Alerts** (Báo động đỏ)",
                                                 "Cần hành động can thiệp ngay lập tức (ví dụ cháy nguồn chính).",
                                                 "**A**wesome (1 - Alerts)"
                                             ],
                                             [
                                                 "**Level 2**",
                                                 "**Critical** (Nghiêm trọng)",
                                                 "Tình trạng nguy cấp (ví dụ lỗi phần cứng module mạng).",
                                                 "**C**isco (2 - Critical)"
                                             ],
                                             [
                                                 "**Level 3**",
                                                 "**Errors** (Lỗi)",
                                                 "Thông báo lỗi hoạt động (ví dụ cổng mạng bị đứt cáp rớt xuống `down`).",
                                                 "**E**ngineer (3 - Errors)"
                                             ],
                                             [
                                                 "**Level 4**",
                                                 "**Warnings** (Cảnh báo)",
                                                 "Cảnh báo nguy cơ (ví dụ phát hiện Duplex Mismatch hoặc tràn bảng MAC).",
                                                 "**W**ill (4 - Warnings)"
                                             ],
                                             [
                                                 "**Level 5**",
                                                 "**Notifications** (Thông báo chuẩn)",
                                                 "Sự kiện bình thường nhưng quan trọng (ví dụ cổng bật lên `up` hoặc lưu cấu hình).",
                                                 "**N**eed (5 - Notifications)"
                                             ],
                                             [
                                                 "**Level 6**",
                                                 "**Informational** (Thông tin)",
                                                 "Thông tin hoạt động thông thường của hệ thống.",
                                                 "**I**cecream (6 - Informational)"
                                             ],
                                             [
                                                 "**Level 7**",
                                                 "**Debugging** (Gỡ lỗi chi tiết)",
                                                 "Thông tin chi tiết từng gói tin khi kỹ sư bật lệnh `debug`.",
                                                 "**D**aily (7 - Debugging)"
                                             ]
                                         ]
                            },
        "jobSkills_vi":  [
                             "Kinh nghiệm Đi Làm 1 — Khám phá và vẽ lại Sơ đồ mạng công ty không có tài liệu bằng `show cdp neighbors detail` và `show lldp neighbors`: Khi bạn mới nhận việc ở một công ty mà người IT cũ nghỉ việc không bàn giao sơ đồ mạng, đừng hoảng sợ! Hãy SSH vào con Switch hoặc Router đầu tiên bạn biết IP, sau đó gõ **`show cdp neighbors detail`** (nếu là thiết bị Cisco) hoặc **`show lldp neighbors detail`** (nếu công ty dùng lẫn lộn Switch Cisco, HP Aruba, Juniper, Fortinet). Màn hình sẽ hiện ra tên thiết bị kế cận, cổng đang cắm và địa chỉ IP quản trị của thiết bị đó — bạn cứ thế SSH lần lượt sang từng thiết bị tiếp theo là vẽ lại được toàn bộ sơ đồ mạng công ty chỉ trong 30 phút!",
                             "Kinh nghiệm Đi Làm 2 — Quy trình Sao lưu (Backup) và Nâng cấp hệ điều hành Cisco IOS qua TFTP/USB an toàn: Trước khi sửa cấu hình lớn hoặc nâng cấp thiết bị, kỹ sư mạng luôn chạy lệnh sao lưu cấu hình và file IOS ra máy chủ TFTP: **`Router# copy running-config tftp:`** và **`Router# copy flash:c2960-lanbasek9-mz.150-2.SE4.bin tftp:`**. Khi chép IOS mới vào Flash để nâng cấp, nhớ kiểm tra mã băm MD5 bằng lệnh `verify /md5 flash:\u003ctên_file\u003e` để chắc chắn file không bị lỗi trong lúc truyền trước khi gõ `reload`!",
                             "Kinh nghiệm Đi Làm 3 — Thuộc lòng câu thần chú 8 mức Syslog (Từ 0 đến 7) đi thi CCNA chắc chắn trúng: **\u0027Every (0-Emergencies) Awesome (1-Alerts) Cisco (2-Critical) Engineer (3-Errors) Will (4-Warnings) Need (5-Notifications) Icecream (6-Informational) Daily (7-Debugging)\u0027**! Con số càng NHỎ thì mức độ sự cố càng NGHIÊM TRỌNG (Mức 0 là sập hệ thống, Mức 7 chỉ là thông tin gỡ lỗi)."
                         ],
        "quiz":  [
                     {
                         "question_vi":  "Câu 1 (Đề thi CCNA): Một nhân viên báo cáo rằng máy tính của họ không thể truy cập trang web `https://www.cisco.com`. Kỹ sư mạng ngồi vào máy tính đó, mở CMD gõ `ping 8.8.8.8` và `ping 72.163.4.185` (địa chỉ IP của cisco.com) thì thấy cả hai lệnh ping đều trả về kết quả thành công `Reply from...` rất nhanh. Theo phương pháp **Chia để trị (Divide-and-Conquer)**, nguyên nhân gây lỗi nằm ở đâu?",
                         "options_vi":  [
                                            "A. Dây cáp mạng RJ-45 cắm vào máy tính bị đứt (Tầng 1).",
                                            "B. Máy tính bị đặt sai địa chỉ Default Gateway (Tầng 3).",
                                            "C. Cổng Switch cắm máy tính bị gán sai VLAN (Tầng 2).",
                                            "D. Máy tính đang bị cấu hình sai hoặc thiếu địa chỉ máy chủ phân giải tên miền **DNS Server** (Tầng 7) hoặc trình duyệt bị chặn cổng 443."
                                        ],
                         "answerIndex":  3,
                         "explanation_vi":  "Đáp án đúng là D. Việc `ping` thành công bằng địa chỉ IP tới máy chủ ngoài Internet chứng tỏ Tầng 1 (Cáp mạng), Tầng 2 (Switch/VLAN/MAC) và Tầng 3 (IP, Subnet Mask, Default Gateway, Routing) đều hoạt động hoàn hảo 100%! Việc ping được bằng số IP mà không mở được bằng tên miền `www.cisco.com` chỉ ra ngay lập tức lỗi phân giải tên miền **DNS**."
                     },
                     {
                         "question_vi":  "Câu 2 (Đề thi CCNA): Quản trị viên muốn biết địa chỉ IPv4 của một thiết bị Router Cisco hàng xóm đang kết nối trực tiếp vào cổng `Gi0/1` của Switch S1 thông qua giao thức Cisco Discovery Protocol (CDP). Câu lệnh nào cung cấp thông tin địa chỉ IP này?",
                         "options_vi":  [
                                            "A. `Switch# show cdp neighbors`",
                                            "B. `Switch# show cdp neighbors detail`",
                                            "C. `Switch# show interfaces status`",
                                            "D. `Switch# show mac address-table`"
                                        ],
                         "answerIndex":  1,
                         "explanation_vi":  "Đáp án đúng là B (`show cdp neighbors detail`). Đây là câu hỏi bẫy rất hay gặp! Lệnh `show cdp neighbors` thông thường chỉ hiển thị 5 cột: Device ID, Local Interface, Holdtme, Capability, Platform và Port ID (KHÔNG hiển thị địa chỉ IP). Muốn xem được địa chỉ IP Tầng 3 và phiên bản IOS của thiết bị hàng xóm, bắt buộc phải có thêm từ khóa **`detail`**!"
                     },
                     {
                         "question_vi":  "Câu 3 (Đề thi CCNA): Trong hệ thống ghi nhật ký sự kiện Syslog của Cisco IOS (từ Mức 0 đến Mức 7), nếu quản trị viên cấu hình câu lệnh `logging trap warnings` (Mức 4), những thông điệp thuộc các mức nào sẽ được gửi về máy chủ Syslog Server?",
                         "options_vi":  [
                                            "A. Chỉ duy nhất mức 4 (Warnings).",
                                            "B. Các mức từ 4 đến 7 (Warnings, Notifications, Informational, Debugging).",
                                            "C. Các mức từ **0 đến 4** (Emergencies, Alerts, Critical, Errors, và Warnings — tức là mức được chọn cùng toàn bộ các mức nghiêm trọng hơn nó).",
                                            "D. Tất cả các mức từ 0 đến 7."
                                        ],
                         "answerIndex":  2,
                         "explanation_vi":  "Đáp án đúng là C (Mức 0, 1, 2, 3, 4). Trong Cisco Syslog, mức 0 là nghiêm trọng nhất và mức 7 là nhẹ nhất. Khi bạn đặt ngưỡng ở mức $N$ (ví dụ mức 4 - Warnings), hệ thống sẽ gửi mọi cảnh báo từ mức nghiêm trọng nhất (`0`) cho đến mức $N$ (`0, 1, 2, 3, 4`)."
                     }
                 ],
        "beginnerGuide_vi":  [
                                 "1. Khi bạn tự tay thiết kế và lắp đặt một mạng nhỏ cho văn phòng công ty (ví dụ 30 nhân viên) từ con số 0, bạn cần chuẩn bị những gì? • **Bước 1 (Chọn phần cứng)**: 1 chiếc **Router** nối cáp quang nhà mạng, 1 hoặc 2 chiếc **Switch 24–48 cổng** (chọn loại có PoE nếu dùng Điện thoại bàn IP và Cục phát Wi-Fi gắn trần), dây cáp đồng UTP Cat6 và hạt mạng RJ-45. • **Bước 2 (Quy hoạch địa chỉ IP và VLAN)**: Chia mạng con rõ ràng — ví dụ `VLAN 10` (`192.168.10.0/24`) cho Nhân viên, `VLAN 20` (`192.168.20.0/24`) cho Điện thoại Voice IP, `VLAN 30` (`192.168.30.0/24`) cho Khách bắt Wi-Fi, và `VLAN 99` cho Quản trị thiết bị. • **Bước 3 (Cấu hình cơ bản \u0026 Bảo mật)**: Đặt tên thiết bị, mật khẩu `enable secret`, bật điều khiển từ xa qua **SSH v2**, cấu hình DHCP cấp IP tự động và lưu cấu hình vào NVRAM (`copy run start`).",
                                 "2. Tư duy \u0027Bắt bệnh mạng có phương pháp\u0027 cho người mới (Không bao giờ đoán mò!): Khi có một máy tính không vào được mạng, thay vì cuống cuồng tháo máy hay cài lại Windows, hãy kiểm tra từng bước thật bình tĩnh bằng phương pháp **Chia để trị (Divide-and-Conquer)**: Mở màn hình CMD lên và gõ lệnh **`ping 8.8.8.8`** (hoặc `ping` tới địa chỉ IP của Router `192.168.1.1`). Kết quả của đúng 1 câu lệnh này sẽ chia đôi bài toán giúp bạn tìm ra thủ phạm ngay lập tức!",
                                 "4. Ý nghĩa của Thời gian phản hồi (\time=1ms) và Chỉ số TTL khi bạn gõ lệnh Ping thành công: Khi bạn gõ ping 8.8.8.8 và nhận được dòng chữ Reply from 8.8.8.8: bytes=32 time=18ms TTL=116: • **\time=18ms (Độ trễ khứ hồi)**: Gói tin đi từ máy bạn tới máy chủ Google rồi quay ngược trở về chỉ mất **18 phần nghìn giây** (dưới 50ms là mạng cực nhanh, trên 200ms là mạng bị trễ/lag). • **TTL=116**: Cho biết gói tin còn sống thêm được 116 trạm Router nữa, đồng thời giúp đoán hệ điều hành của máy đích (Linux thường bắt đầu với TTL=64, Windows bắt đầu với TTL=128, thiết bị Cisco bắt đầu với TTL=255).",
                                 "5. Tại sao mọi kỹ sư mạng chuyên nghiệp đều phải tạo Tài liệu Hồ sơ Mạng (Network Documentation \u0026 Baseline)? Khi quản lý một mạng công ty, bạn không thể nhớ hết hàng trăm sợi dây cáp cắm vào cổng nào. Bộ hồ sơ chuẩn bắt buộc phải có 3 thứ: **1) Sơ đồ Vật lý \u0026 Luận lý** (vẽ vị trí tủ Rack, tên cổng, VLAN, dải IP), **2) Bảng danh mục thiết bị \u0026 Địa chỉ IP**, và **3) Đường cơ sở hiệu năng (Network Baseline)** — đo mức sử dụng CPU và băng thông lúc mạng đang chạy bình thường, để khi mạng đột nhiên chậm đi sẽ có mốc số liệu so sánh ngay!"
                             ],
        "beginnerGuide_en":  [
                                 "1. Building a Small Office Network from Scratch in 3 Steps: • **Step 1 (Hardware Selection)**: Choose an enterprise Router, 24/48-port PoE Switches, Wireless Access Points, and Cat6 cabling. • **Step 2 (IP Addressing \u0026 VLAN Design)**: Segment traffic logically—e.g., `VLAN 10` (`192.168.10.0/24`) for Staff Data, `VLAN 20` for VoIP Phones, `VLAN 30` for Guest Wi-Fi, and `VLAN 99` for Management. • **Step 3 (Hardening \u0026 Services)**: Configure hostnames, strong `enable secret` passwords, SSHv2 remote access, DHCP pools, NAT, and save to NVRAM (`copy run start`).",
                                 "2. Structured Troubleshooting Mindset for Beginners: Never guess randomly! Start at Layer 3 (Divide-and-Conquer) by running `ipconfig` and `ping \u003cDefault Gateway\u003e` / `ping 8.8.8.8` to immediately isolate whether the problem is in the lower physical/switching layers (Layers 1–3) or upper application/DNS layers (Layers 4–7)."
                             ],
        "advancedTopics_vi":  [
                                  "Mở rộng Nâng cao 1 — Đồng bộ Thời gian thực trên toàn mạng bằng Giao thức NTP (Network Time Protocol - UDP Port 123): Tại sao việc chỉnh đúng đồng hồ ngày giờ trên Router và Switch lại cực kỳ quan trọng khi đi làm? Bởi vì: 1) Khi có sự cố hoặc hacker tấn công, kỹ sư phải đọc nhật ký **Syslog** trên 10 con Switch/Router khác nhau — nếu đồng hồ mỗi máy lệch nhau vài tiếng (mặc định khi mới bật nguồn đồng hồ Cisco quay về năm *1993*!) thì bạn không thể biết sự cố xảy ra lúc mấy giờ; 2) Các chứng chỉ bảo mật số (PKI/HTTPS/VPN) sẽ bị từ chối ngay nếu đồng hồ hệ thống bị sai! Lệnh cấu hình: **`R1(config)# ntp server 216.239.35.0`** (trỏ về máy chủ giờ chuẩn và kiểm tra bằng `show ntp status`).",
                                  "Mở rộng Nâng cao 2 — Tổng hợp Bộ 10 Câu Lệnh Kiểm Tra \u0026 Bắt Bệnh (`show` commands) Mà Mọi Kỹ Sư CCNA Đều Phải Thuộc Lòng: 1) `show ip interface brief` (Kiểm tra IP và trạng thái `up/up` của mọi cổng); 2) `show ip route` (Kiểm tra bảng định tuyến Tầng 3); 3) `show running-config` (Xem toàn bộ cấu hình hiện tại); 4) `show interfaces` (Kiểm tra lỗi cáp CRC, Runts, Duplex); 5) `show mac address-table` (Xem bảng MAC trên Switch); 6) `show ip arp` (Xem bảng ánh xạ IP-MAC); 7) `show vlan brief` (Kiểm tra cổng nào thuộc VLAN nào); 8) `show interfaces trunk` (Kiểm tra đường Trunk 802.1Q giữa các Switch); 9) `show cdp neighbors detail` (Tìm tên, cổng và IP của thiết bị hàng xóm); 10) `show version` (Kiểm tra phiên bản IOS, Uptime và thanh ghi `0x2102`).",
                                  "Mở rộng Nâng cao 3 — Đồng bộ Thời gian Mạng (NTP - Network Time Protocol) và Máy chủ Nhật ký Tập trung (Syslog Server): Khi xảy ra sự cố sập mạng hoặc bị hacker tấn công lúc nửa đêm, kỹ sư phải đọc lại nhật ký sự kiện (**Logs**) trên hàng chục Switch và Router để tìm nguyên nhân. Nếu đồng hồ trên các thiết bị lệch nhau, việc truy vết sẽ hoàn toàn vô nghĩa! Vì vậy, trong mọi mạng chuẩn thực tế, tất cả thiết bị đều phải cấu hình giao thức **NTP (UDP Port 123)** để đồng bộ đồng hồ chính xác tới từng mili-giây với một máy chủ thời gian chuẩn (\ntp server ...), và tự động đẩy toàn bộ cảnh báo lỗi (từ mức 0 Emergency đến mức 7 Debugging) về máy chủ **Syslog (UDP Port 514)**."
                              ],
        "advancedTopics_en":  [
                                  "Advanced Expansion 1 — Network Time Protocol (NTP — UDP Port 123): Synchronizing clocks across all routers, switches, and firewalls (`ntp server \u003cIP\u003e`) is essential for correlating **Syslog** timestamps during outage/security investigations and validating digital certificates.",
                                  "Advanced Expansion 2 — The Top 10 Essential Cisco IOS `show` Commands for CCNA \u0026 Real-World Troubleshooting: 1) `show ip interface brief`, 2) `show ip route`, 3) `show running-config`, 4) `show interfaces`, 5) `show mac address-table`, 6) `show ip arp`, 7) `show vlan brief`, 8) `show interfaces trunk`, 9) `show cdp neighbors detail`, 10) `show version`."
                              ]
    }
];
