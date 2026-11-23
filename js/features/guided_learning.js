// ============================================================================
// CCNA NETWORK ACADEMY — GUIDED 4-STEP MICRO-LEARNING ENGINE & STUDY STREAK
// Transforms dense 11-section modules into an engaging, bite-sized 4-step course:
//   Step 1: 💡 Hiểu nhanh trong 2 phút (3-Bullet ELI5 + Hình ảnh & Sơ đồ)
//   Step 2: 📘 Kiến thức trọng tâm & Lệnh CLI (Phần nâng cao thu gọn mặc định)
//   Step 3: 🧪 Thực hành Lab & Xử lý lỗi (Packet Flow + Cisco IOS Terminal)
//   Step 4: 🏆 Kiểm tra nhanh & Chốt bài (Quiz + Chuyển bài kế tiếp + Streak)
// Users can toggle anytime between "Học từng bước (Dễ hiểu)" and "Xem toàn bộ trang".
// ============================================================================

(function () {
  "use strict";

  const MODE_STORAGE_KEY = "ccna_guided_mode_enabled";
  let currentStep = 1;
  let lastEnhancedModId = null;

  function isGuidedModeEnabled() {
    const val = localStorage.getItem(MODE_STORAGE_KEY);
    return val === null ? true : val === "true"; // Enabled by default for effortless learning
  }

  function setGuidedModeEnabled(enabled) {
    localStorage.setItem(MODE_STORAGE_KEY, enabled ? "true" : "false");
  }

  // Daily Study Streak Tracker (Per-user isolated)
  function getStreakKey() {
    const uid = typeof getActiveUserProfileId === "function" ? getActiveUserProfileId() : "default_user";
    return `ccna_study_streak_${uid}`;
  }

  function getStudyStreak() {
    try {
      const data = JSON.parse(localStorage.getItem(getStreakKey()) || "{}");
      return {
        days: Number(data.days || 1),
        lastDate: data.lastDate || "",
        todayDone: data.lastDate === new Date().toISOString().slice(0, 10)
      };
    } catch {
      return { days: 1, lastDate: "", todayDone: false };
    }
  }

  function recordStudyActivityToday() {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    let data = { days: 1, lastDate: today };
    try {
      const prev = JSON.parse(localStorage.getItem(getStreakKey()) || "{}");
      if (prev.lastDate === today) {
        data = prev;
      } else if (prev.lastDate === yesterday) {
        data = { days: (Number(prev.days) || 0) + 1, lastDate: today };
      } else {
        data = { days: 1, lastDate: today };
      }
      localStorage.setItem(getStreakKey(), JSON.stringify(data));
    } catch {}
    return data;
  }

  // Plain-Vietnamese Friendly Heading Simplifier (Removes dry academic English walls in VI mode)
  function humanizeHeadingsForVietnamese(detailEl) {
    if (typeof currentLang !== "undefined" && currentLang === "en") return;
    const replacements = [
      [/1\.\s*Learning Objectives.*$/i, "🎯 Mục tiêu bài học & Tình huống thực tế"],
      [/^.*Core Theory.*$/i, "📘 Kiến thức cốt lõi cần nắm"],
      [/^.*Deep Technical Glossary.*$/i, "📖 Giải thích từ khóa dễ hiểu"],
      [/^.*Real-World Enterprise Skills.*$/i, "💼 Kinh nghiệm đi làm thực tế"],
      [/^.*Worked Example.*$/i, "✏️ Ví dụ giải mẫu từng bước"],
      [/^.*Verification.*Troubleshooting.*$/i, "✅ Lệnh kiểm tra & Xử lý lỗi hay gặp"]
    ];
    detailEl.querySelectorAll("h3.section-title span, h3.section-title").forEach((el) => {
      if (el.children.length > 0 && el.tagName === "H3") return;
      const txt = el.textContent.trim();
      for (const [re, viTitle] of replacements) {
        if (re.test(txt)) {
          el.textContent = viTitle;
          break;
        }
      }
    });
  }

  function classifySectionStep(secEl) {
    const id = (secEl.id || "").toLowerCase();
    const text = (secEl.querySelector("h3.section-title")?.textContent || "").toLowerCase();

    if (id.includes("quiz") || text.includes("trắc nghiệm") || text.includes("kiểm tra nhanh")) {
      return { step: 4, optional: false };
    }
    if (
      id.includes("lab") ||
      id.includes("verify") ||
      id.includes("troubleshoot") ||
      id.includes("calc") ||
      text.includes("bài lab") ||
      text.includes("thực hành") ||
      text.includes("xử lý lỗi")
    ) {
      return { step: 3, optional: false };
    }
    if (
      id.includes("beginner") ||
      id.includes("visual") ||
      id.includes("std-intro") ||
      text.includes("nhập môn") ||
      text.includes("ảnh thiết bị") ||
      text.includes("mục tiêu")
    ) {
      return { step: 1, optional: false };
    }
    if (
      id.includes("glossary") ||
      id.includes("advanced") ||
      id.includes("job") ||
      id.includes("example") ||
      text.includes("mở rộng") ||
      text.includes("thuật ngữ") ||
      text.includes("kinh nghiệm") ||
      text.includes("ví dụ giải mẫu")
    ) {
      return { step: 2, optional: true };
    }
    return { step: 2, optional: false };
  }

  function buildQuickSummaryCardHtml(mod) {
    if (!mod) return "";
    const concepts = (mod.keyConcepts_vi || mod.keyConcepts || []).slice(0, 3);
    const bullets = concepts.map((c) => {
      const term = typeof c === "string" ? c : (c.term || c.title || "");
      const desc = typeof c === "string" ? "" : (c.desc || c.explanation || "");
      const shortDesc = desc.length > 130 ? desc.substring(0, 128) + "..." : desc;
      return `<li><strong>${term}</strong>${shortDesc ? `: ${shortDesc}` : ""}</li>`;
    }).join("");

    return `
      <div class="guided-eli5-card" id="guided-eli5-card">
        <div class="guided-eli5-head">
          <span class="guided-eli5-pill">💡 HIỂU NHANH TRONG 2 PHÚT</span>
          <span class="guided-eli5-hint">Học xong bài này bạn chỉ cần nhớ 3 ý chính sau:</span>
        </div>
        <ul class="guided-eli5-list">${bullets || `<li>${(mod.overview_vi || "").substring(0, 220)}...</li>`}</ul>
      </div>
    `;
  }

  function applyStepVisibility(detailEl, stepNum, mod) {
    const guided = isGuidedModeEnabled();
    const sections = Array.from(detailEl.querySelectorAll(":scope > section.section-block"));

    // Toggle clutter bars in guided mode
    detailEl.classList.toggle("is-guided-mode", guided);

    const eli5Card = detailEl.querySelector("#guided-eli5-card");
    if (eli5Card) eli5Card.style.display = guided && stepNum === 1 ? "block" : "none";

    const footerNav = detailEl.querySelector("#guided-step-footer");
    if (footerNav) footerNav.style.display = guided ? "flex" : "none";

    sections.forEach((sec) => {
      if (!guided) {
        sec.style.display = "";
        sec.classList.remove("guided-hidden-step");
        return;
      }
      const info = classifySectionStep(sec);
      const show = info.step === stepNum;
      sec.style.display = show ? "" : "none";
      sec.classList.toggle("guided-hidden-step", !show);

      // Collapse optional deep-dive sections by default in Step 2 so student never feels overwhelmed
      if (show && info.optional && !sec.dataset.guidedUserToggled) {
        sec.classList.add("is-collapsed");
      } else if (show && !info.optional) {
        sec.classList.remove("is-collapsed");
      }
    });

    // Update stepper UI
    detailEl.querySelectorAll(".guided-step-btn").forEach((btn) => {
      const s = Number(btn.dataset.step);
      btn.classList.toggle("active", s === stepNum);
      btn.classList.toggle("done", s < stepNum);
    });

    const prevBtn = detailEl.querySelector("#guided-prev-step-btn");
    const nextBtn = detailEl.querySelector("#guided-next-step-btn");
    const nextLabels = {
      1: "Đã hiểu sơ bộ → Sang Bước 2: Kiến thức & CLI →",
      2: "Tiếp tục → Sang Bước 3: Thực hành Lab →",
      3: "Tiếp tục → Sang Bước 4: Kiểm tra chốt bài →",
      4: mod && mod.id < 17 ? `🎉 Hoàn thành Bài ${mod.id} & Sang Bài ${mod.id + 1} →` : "🎉 Hoàn thành Học phần này!"
    };
    if (prevBtn) prevBtn.style.visibility = stepNum > 1 ? "visible" : "hidden";
    if (nextBtn) nextBtn.textContent = nextLabels[stepNum] || "Tiếp tục →";
  }

  function enhanceModuleWithGuidedMode() {
    const detailEl = document.getElementById("module-detail");
    if (!detailEl) return;

    // Only apply to Theory Module pages (has .module-header and sec-block-overview or sec-block-quiz)
    const isTheoryModule = !!detailEl.querySelector("#sec-block-overview, #sec-block-quiz") &&
      (typeof currentMode === "undefined" || currentMode === "modules") &&
      (!window.currentAcademySection || window.currentAcademySection === "modules" || window.currentAcademySection === "fundamentals");

    if (!isTheoryModule) {
      detailEl.classList.remove("is-guided-mode");
      return;
    }

    if (detailEl.querySelector("#guided-bar-wrap")) return;

    const modId = typeof activeModuleId !== "undefined" ? activeModuleId : 1;
    const mod = typeof modulesData !== "undefined" ? modulesData.find((m) => m.id === modId) : null;
    if (lastEnhancedModId !== modId) {
      currentStep = 1;
      lastEnhancedModId = modId;
    }

    humanizeHeadingsForVietnamese(detailEl);

    const headerEl = detailEl.querySelector(".module-header");
    if (!headerEl) return;

    const guidedOn = isGuidedModeEnabled();
    const stepperHtml = `
      <div class="guided-bar-wrap" id="guided-bar-wrap">
        <div class="guided-mode-row">
          <div class="guided-mode-title">
            <span class="guided-dot"></span>
            <strong>Chế độ học dễ hiểu (4 bước ngắn)</strong>
          </div>
          <div class="guided-mode-switch" role="group" aria-label="Chế độ xem bài học">
            <button type="button" class="guided-toggle-pill ${guidedOn ? "active" : ""}" data-gmode="guided">📖 Học từng bước</button>
            <button type="button" class="guided-toggle-pill ${!guidedOn ? "active" : ""}" data-gmode="full">📄 Xem cả trang</button>
          </div>
        </div>
        <div class="guided-steps-track" id="guided-steps-track" style="${guidedOn ? "" : "display:none;"}">
          <button type="button" class="guided-step-btn active" data-step="1"><span class="gs-num">1</span><span class="gs-lbl">Hiểu nhanh (2p)</span></button>
          <button type="button" class="guided-step-btn" data-step="2"><span class="gs-num">2</span><span class="gs-lbl">Kiến thức &amp; CLI</span></button>
          <button type="button" class="guided-step-btn" data-step="3"><span class="gs-num">3</span><span class="gs-lbl">Thực hành Lab</span></button>
          <button type="button" class="guided-step-btn" data-step="4"><span class="gs-num">4</span><span class="gs-lbl">Chốt bài (Quiz)</span></button>
        </div>
      </div>
      ${buildQuickSummaryCardHtml(mod)}
    `;

    headerEl.insertAdjacentHTML("afterend", stepperHtml);

    const footerHtml = `
      <div class="guided-step-footer" id="guided-step-footer">
        <button type="button" class="ws-btn" id="guided-prev-step-btn">← Bước trước</button>
        <button type="button" class="ws-btn primary guided-next-cta" id="guided-next-step-btn">Tiếp tục →</button>
      </div>
    `;
    detailEl.insertAdjacentHTML("beforeend", footerHtml);

    // Track manual user expand/collapse so we don't override them
    detailEl.querySelectorAll("section.section-block .section-header-wrap").forEach((h) => {
      h.addEventListener("click", () => {
        const sec = h.closest("section.section-block");
        if (sec) sec.dataset.guidedUserToggled = "1";
      });
    });

    // Mode toggle handlers
    detailEl.querySelectorAll(".guided-toggle-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        const wantGuided = pill.dataset.gmode === "guided";
        setGuidedModeEnabled(wantGuided);
        detailEl.querySelectorAll(".guided-toggle-pill").forEach((p) => p.classList.toggle("active", p === pill));
        const track = detailEl.querySelector("#guided-steps-track");
        if (track) track.style.display = wantGuided ? "" : "none";
        applyStepVisibility(detailEl, currentStep, mod);
      });
    });

    // Step button click handlers
    detailEl.querySelectorAll(".guided-step-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentStep = Number(btn.dataset.step) || 1;
        applyStepVisibility(detailEl, currentStep, mod);
        detailEl.querySelector("#guided-bar-wrap")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    });

    detailEl.querySelector("#guided-prev-step-btn")?.addEventListener("click", () => {
      if (currentStep > 1) {
        currentStep--;
        applyStepVisibility(detailEl, currentStep, mod);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    detailEl.querySelector("#guided-next-step-btn")?.addEventListener("click", () => {
      recordStudyActivityToday();
      if (currentStep < 4) {
        currentStep++;
        applyStepVisibility(detailEl, currentStep, mod);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Complete current module & advance to next module
        if (mod && typeof completedItems !== "undefined" && !completedItems[`module-${mod.id}`] && typeof toggleItemCompleted === "function") {
          toggleItemCompleted(`module-${mod.id}`);
        }
        if (mod && mod.id < 17 && typeof selectModule === "function") {
          currentStep = 1;
          selectModule(mod.id + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    });

    applyStepVisibility(detailEl, currentStep, mod);
  }

  function initGuidedLearningObserver() {
    const detail = document.getElementById("module-detail");
    if (!detail) return;
    let raf = null;
    const schedule = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => enhanceModuleWithGuidedMode());
    };
    schedule();
    const obs = new MutationObserver(() => {
      if (!detail.querySelector("#guided-bar-wrap")) schedule();
    });
    obs.observe(detail, { childList: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGuidedLearningObserver);
  } else {
    initGuidedLearningObserver();
  }

  window.getStudyStreak = getStudyStreak;
  window.recordStudyActivityToday = recordStudyActivityToday;
})();
