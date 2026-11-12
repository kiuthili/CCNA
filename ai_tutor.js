/**
 * CCNA Learning Platform — AI Tutor & Cisco Packet Tracer Assistant
 * Multimodal AI Assistant powered by Google Gemini (Vision & Text)
 * With Smart Cisco Lab Heuristics Fallback & Clipboard Image Paste (Ctrl+V)
 */

(function () {
  "use strict";

  // Storage Keys
  const STORAGE_KEY_API_KEY = "ccna_gemini_api_key";
  const STORAGE_KEY_MODEL = "ccna_gemini_model";
  const STORAGE_KEY_CHAT_HISTORY = "ccna_ai_chat_history";

  // Default Model (Low token consumption & ultra-fast)
  const DEFAULT_MODEL = "gemini-2.5-flash-lite";

  // State
  let chatHistory = [];
  let attachedImage = null; // { base64: string, mimeType: string, previewUrl: string, name: string }
  let isGenerating = false;

  // Load chat history from localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CHAT_HISTORY);
    if (saved) {
      chatHistory = JSON.parse(saved);
      if (!Array.isArray(chatHistory)) chatHistory = [];
    }
  } catch {
    chatHistory = [];
  }

  // System Prompt for Cisco CCNA Certified Instructor & Senior Network Architect
  function buildSystemInstruction() {
    return (
      "Bạn là Giảng viên Chuyên gia Mạng Cisco CCNA (CCNA 200-301 Master Instructor) và Kỹ sư Trưởng Xử lý Sự cố Mạng (Senior Network Architect).\n" +
      "Nhiệm vụ chính:\n" +
      "1. Hỗ trợ giải đáp kiến thức CCNA 200-301 và chẩn đoán sự cố Cisco Packet Tracer.\n" +
      "2. Khi nhận ảnh chụp Packet Tracer (Topology, CLI, Ping timeout): Soi kỹ đèn báo cổng (Xanh/Cam/Đỏ), loại cáp (Straight-through/Cross-over), IP/Subnet/Default Gateway, và trạng thái cổng.\n" +
      "3. Nguyên tắc trả lời: CÔ ĐỌNG, SÚC TÍCH, ĐI THẲNG VÀO NGUYÊN NHÂN LỖI và cung cấp ngay khối lệnh Cisco IOS CLI khắc phục chuẩn xác (kèm chế độ cấu hình Router(config)#). Tránh viết dài dòng để tối ưu token cho người học."
    );
  }

  // Extract current study context (Module, Lab or Mastery Domain)
  function getCurrentStudyContext() {
    try {
      const mode = typeof currentMode !== "undefined" ? currentMode : "modules";

      if (mode === "labs") {
        const labId = typeof activeLabId !== "undefined" ? activeLabId : 0;
        const allLabs = typeof PACKET_TRACER_LABS !== "undefined" ? PACKET_TRACER_LABS : [];
        if (labId > 0) {
          const currentLab = allLabs.find((l) => l.id === labId);
          if (currentLab) {
            let summary = `[NGỮ CẢNH: HỌC VIÊN ĐANG LÀM BÀI LAB #${currentLab.id}: ${currentLab.title_vi}]\n`;
            summary += `Mục tiêu bài Lab: ${currentLab.objective_vi || ""}\n`;
            if (currentLab.addressing_table && currentLab.addressing_table.length > 0) {
              summary += "Bảng quy hoạch IP của bài Lab:\n";
              currentLab.addressing_table.slice(0, 5).forEach((row) => {
                summary += `- Thiết bị ${row.device} | Cổng ${row.interface} | IP: ${row.ip} | Subnet Mask: ${row.subnet} | Default GW: ${row.gateway || "N/A"}\n`;
              });
            }
            if (currentLab.cli_commands && currentLab.cli_commands.length > 0) {
              summary += `Các lệnh CLI mẫu của bài Lab:\n\`\`\`cisco\n${currentLab.cli_commands.slice(0, 8).join("\n")}\n\`\`\`\n`;
            }
            return {
              type: "lab",
              title: `Lab #${currentLab.id}: ${currentLab.title_vi}`,
              contextText: summary
            };
          }
        }
        return {
          type: "labs_overview",
          title: "35 Bài Lab Thực hành Cisco Packet Tracer",
          contextText: "[NGỮ CẢNH: Danh mục 35 Bài Lab Thực hành Cisco Packet Tracer]"
        };
      }

      if (mode === "mastery") {
        const masteryId = typeof activeMasteryId !== "undefined" ? activeMasteryId : 0;
        const allMastery = typeof EXAM_MASTERY_DOMAINS !== "undefined" ? EXAM_MASTERY_DOMAINS : [];
        const currentDom = allMastery.find((d) => d.id === masteryId);
        if (currentDom) {
          return {
            type: "mastery",
            title: `Chuyên đề #${currentDom.id}: ${currentDom.title_vi}`,
            contextText: `[NGỮ CẢNH: Chuyên đề CCNA #${currentDom.id}: ${currentDom.title_vi} — ${currentDom.summary_vi}]`
          };
        }
      }

      // Default: Modules
      const modId = typeof activeModuleId !== "undefined" ? activeModuleId : 1;
      const allMods = typeof modulesData !== "undefined" && modulesData.length > 0 ? modulesData : [];
      const currentMod = allMods.find((m) => m.id === modId);
      if (currentMod) {
        return {
          type: "module",
          title: `Học phần ${currentMod.id}: ${currentMod.title_vi || currentMod.title}`,
          contextText: `[NGỮ CẢNH: Học viên đang xem Học phần ${currentMod.id}: ${currentMod.title_vi || currentMod.title} — ${currentMod.overview_vi || currentMod.overview || ""}]`
        };
      }
    } catch (e) {
      console.warn("Error getting study context:", e);
    }

    return {
      type: "general",
      title: "Khóa học CCNA 200-301 Toàn diện",
      contextText: "[NGỮ CẢNH: Khóa học Cisco CCNA 200-301 Toàn diện & Lab Packet Tracer]"
    };
  }

  // Smart Offline Fallback Heuristics Engine
  function generateSmartOfflineResponse(userPrompt, imageAttached, context) {
    const p = (userPrompt || "").toLowerCase();
    const isLab = context.type === "lab";

    let reply = `### 💡 Phản hồi từ Trợ lý Kỹ thuật Cisco CCNA (Chế độ Phân tích Sẵn sàng)\n\n`;

    if (imageAttached) {
      reply += `> 📸 **Đã nhận ảnh chụp màn hình Packet Tracer của bạn!**\n>\n`;
      reply += `> Để kích hoạt trí tuệ nhân tạo **Gemini Vision 2.0** soi chiếu từng pixel, kiểm tra màu sắc đèn cổng (Xanh/Cam/Đỏ) và đọc từng dòng bảng cấu hình trên ảnh, bạn chỉ cần bấm nút **⚙️ Cài đặt** ở góc trên và dán **API Key Gemini miễn phí** (lấy trong 10 giây tại Google AI Studio).\n\n`;
    }

    reply += `Dưới đây là chẩn đoán nhanh và hướng dẫn khắc phục dựa trên ngữ cảnh **${escapeHtml(context.title)}**:\n\n`;

    // Case 1: Ping Fail / No Connectivity
    if (p.includes("ping") || p.includes("không thông") || p.includes("timeout") || p.includes("rớt gói") || p.includes("fail")) {
      reply += `#### 🔍 Quy trình 5 bước bắt bệnh khi Ping thất bại trong Packet Tracer:\n\n`;
      reply += `1. **Kiểm tra đèn cổng (Link Lights):**\n`;
      reply += `   - **Đèn Đỏ:** Cổng đang bị tắt (\`shutdown\`) hoặc chọn sai dây cáp mạng. Dùng cáp đồng thẳng (*Copper Straight-Through*) nối PC sang Switch; cáp chéo (*Copper Cross-Over*) nối Switch sang Switch hoặc PC sang Router.\n`;
      reply += `   - **Đèn Cam (Amber):** Cổng đang chạy thuật toán Spanning Tree (STP) mất khoảng 30–50 giây để chuyển sang trạng thái *Forwarding*. Bạn có thể bấm nút **Fast Forward Time (Alt + D)** ở góc dưới Packet Tracer để tua nhanh.\n\n`;
      reply += `2. **Kiểm tra Default Gateway trên máy PC:**\n`;
      reply += `   - Nếu ping ra ngoài mạng LAN (sang subnet khác), PC bắt buộc phải được cấu hình đúng **Default Gateway** (chính là IP cổng Router nối vào LAN đó).\n\n`;
      reply += `3. **Lệnh kiểm tra trên Router / Switch:**\n`;
      reply += `\`\`\`cisco\n`;
      reply += `enable\n`;
      reply += `show ip interface brief    ! Xem cổng nào có trạng thái 'administratively down'\n`;
      reply += `show ip route              ! Kiểm tra xem Router đã có đường đi tới mạng đích chưa\n`;
      reply += `configure terminal\n`;
      reply += `interface <tên_cổng>\n`;
      reply += ` no shutdown               ! Bật sáng cổng nếu đang bị tắt\n`;
      reply += `\`\`\`\n\n`;
    }
    // Case 2: OSPF / Routing issues
    else if (p.includes("ospf") || p.includes("định tuyến") || p.includes("routing") || p.includes("neighbor")) {
      reply += `#### 🔍 Khắc phục sự cố láng giềng OSPF không lên Full:\n\n`;
      reply += `1. **4 điều kiện bắt buộc OSPF Neighbor:**\n`;
      reply += `   - Cùng **Area ID** (ví dụ cùng thuộc \`area 0\`).\n`;
      reply += `   - Cùng **Subnet Mask** và thuộc cùng một dải mạng.\n`;
      reply += `   - Khớp bộ đếm thời gian **Hello / Dead Intervals** (mặc định Broadcast là 10s / 40s).\n`;
      reply += `   - Khớp cờ xác thực (Authentication) và cờ vùng đặc biệt (Stub Area).\n\n`;
      reply += `2. **Lệnh CLI chẩn đoán & cấu hình chuẩn OSPF:**\n`;
      reply += `\`\`\`cisco\n`;
      reply += `enable\n`;
      reply += `show ip ospf neighbor      ! Kiểm tra trạng thái láng giềng (phải là FULL/DR hoặc FULL/BDR)\n`;
      reply += `show ip ospf interface     ! Soi chi tiết Hello timer và Area ID trên từng cổng\n`;
      reply += `show ip route ospf         ! Xem các mạng học được qua OSPF (ký hiệu chữ 'O')\n`;
      reply += `\`\`\`\n\n`;
    }
    // Case 3: VLAN / Trunking issues
    else if (p.includes("vlan") || p.includes("trunk") || p.includes("802.1q") || p.includes("native")) {
      reply += `#### 🔍 Khắc phục sự cố VLAN & Cổng Trunking Switch:\n\n`;
      reply += `1. **Cổng nối giữa 2 Switch (hoặc Switch nối Router) phải là TRUNK:**\n`;
      reply += `\`\`\`cisco\n`;
      reply += `enable\n`;
      reply += `configure terminal\n`;
      reply += `interface gigabitEthernet 0/1\n`;
      reply += ` switchport mode trunk      ! Bật chế độ Trunk cho đường truyền liên kết\n`;
      reply += ` switchport trunk allowed vlan all\n`;
      reply += `\`\`\`\n\n`;
      reply += `2. **Lệnh kiểm tra trạng thái VLAN & Trunk:**\n`;
      reply += `\`\`\`cisco\n`;
      reply += `show interfaces trunk      ! Cực kỳ quan trọng: Xem cổng nào đang Trunk, Native VLAN là bao nhiêu\n`;
      reply += `show vlan brief            ! Đảm bảo các cổng Access đã được gán đúng số VLAN\n`;
      reply += `\`\`\`\n\n`;
    }
    // General case
    else {
      reply += `#### 🛠️ Hướng dẫn kiểm tra tổng thể bài Lab hiện tại:\n\n`;
      reply += `- **Bước 1:** Bật chế độ hiển thị cổng trong Packet Tracer: Vào menu **Options &gt; Preferences &gt; Always Show Port Labels in Logical Workspace** để nhìn rõ cổng \`Gi0/0\`, \`Fa0/1\`.\n`;
      reply += `- **Bước 2:** Bấm vào từng máy PC, vào thẻ **Desktop &gt; IP Configuration** để kiểm tra lại IP, Subnet Mask và Default Gateway.\n`;
      reply += `- **Bước 3:** Sử dụng cửa sổ lệnh CLI của Router/Switch và gõ lệnh \`show ip interface brief\` để đảm bảo các cổng đều ở trạng thái \`Status: up / Protocol: up\`.\n\n`;
    }

    reply += `---\n`;
    reply += `👉 **Mẹo lớn:** Để nhận được lời giải chi tiết cho hình ảnh cụ thể của bạn, hãy nhập **API Key Gemini** tại nút ⚙️ góc trên bên phải. Hoàn toàn miễn phí, không tốn phí duy trì!`;

    return reply;
  }

  // Call Google Gemini API (Supports Vision & Multi-turn chat)
  async function callGeminiApi(userPrompt, imageObj, context) {
    const apiKey = localStorage.getItem(STORAGE_KEY_API_KEY) || "";
    const model = localStorage.getItem(STORAGE_KEY_MODEL) || DEFAULT_MODEL;

    // If no API Key is provided, use the Smart Offline Engine
    if (!apiKey.trim()) {
      await new Promise((res) => setTimeout(res, 600)); // slight natural feel
      return generateSmartOfflineResponse(userPrompt, imageObj, context);
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;

    // Construct prompt with context
    let promptWithContext = "";
    if (context && context.contextText) {
      promptWithContext += `${context.contextText}\n\n`;
    }
    promptWithContext += `Câu hỏi của học viên: ${userPrompt || "Hãy phân tích hình ảnh đính kèm và hướng dẫn giải quyết sự cố trong Cisco Packet Tracer."}`;

    // Parts array
    const parts = [{ text: promptWithContext }];

    // If image attached, add inlineData
    if (imageObj && imageObj.base64 && imageObj.mimeType) {
      parts.push({
        inlineData: {
          mimeType: imageObj.mimeType,
          data: imageObj.base64
        }
      });
    }

    const payload = {
      systemInstruction: {
        parts: [{ text: buildSystemInstruction() }]
      },
      contents: [
        {
          role: "user",
          parts: parts
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024
      }
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const errMsg = errJson?.error?.message || `Mã lỗi HTTP ${response.status}`;
      if (response.status === 400 && errMsg.includes("API key not valid")) {
        throw new Error("API Key không hợp lệ. Vui lòng kiểm tra lại API Key Gemini của bạn trong Cài đặt (⚙️).");
      }
      if (response.status === 429) {
        throw new Error("Đã vượt quá giới hạn lượt gọi API tạm thời (Rate Limit). Vui lòng thử lại sau 30 giây.");
      }
      throw new Error(`Lỗi kết nối Gemini API: ${errMsg}`);
    }

    const resData = await response.json();
    const candidate = resData?.candidates?.[0];
    const textPart = candidate?.content?.parts?.map((p) => p.text).join("\n") || "";

    if (!textPart) {
      throw new Error("AI không trả về nội dung. Vui lòng thử lại với câu hỏi hoặc hình ảnh khác.");
    }

    return textPart;
  }

  // Simple Markdown Parser with Cisco CLI Syntax Highlighting & Copy Button
  function formatMarkdown(text) {
    if (!text) return "";

    let html = escapeHtml(text);

    // Code blocks ```cisco or ```ios or ```bash or ```
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
              📋 Sao chép lệnh
            </button>
          </div>
          <pre class="ai-cli-body" id="${codeId}"><code>${trimmedCode}</code></pre>
        </div>
      `;
    });

    // Inline code `code`
    html = html.replace(/`([^`]+)`/g, "<code class='ai-inline-code'>$1</code>");

    // Headers
    html = html.replace(/^### (.*$)/gim, "<h4 class='ai-msg-h4'>$1</h4>");
    html = html.replace(/^## (.*$)/gim, "<h3 class='ai-msg-h3'>$1</h3>");
    html = html.replace(/^# (.*$)/gim, "<h2 class='ai-msg-h2'>$1</h2>");

    // Bold & Italic
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, "<blockquote class='ai-quote'>$1</blockquote>");

    // Unordered lists
    html = html.replace(/^\s*-\s+(.*$)/gim, "<li class='ai-list-item'>$1</li>");
    html = html.replace(/^\s*\*\s+(.*$)/gim, "<li class='ai-list-item'>$1</li>");
    html = html.replace(/(<li class='ai-list-item'>[\s\S]*?<\/li>)/gim, "<ul class='ai-list'>$1</ul>");

    // Ordered lists
    html = html.replace(/^\s*(\d+)\.\s+(.*$)/gim, "<li class='ai-olist-item'><strong>$1.</strong> $2</li>");
    html = html.replace(/(<li class='ai-olist-item'>[\s\S]*?<\/li>)/gim, "<ol class='ai-olist'>$1</ol>");

    // Paragraph line breaks
    html = html.replace(/\n\n+/g, "<p class='ai-p'></p>");
    html = html.replace(/\n/g, "<br/>");

    return html;
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // --------------------------------------------------------------------------
  // AI Tutor UI & DOM Controller
  // --------------------------------------------------------------------------
  function createAiTutorModalDom() {
    if (document.getElementById("ai-tutor-modal")) return;

    const modalHtml = `
      <!-- AI CCNA & Cisco Packet Tracer Tutor Modal -->
      <div class="ai-tutor-modal" id="ai-tutor-modal" role="dialog" aria-modal="true" aria-label="Trợ lý AI Cisco Packet Tracer" hidden>
        <div class="ai-tutor-backdrop" id="ai-tutor-backdrop"></div>
        <div class="ai-tutor-container">
          <!-- Header -->
          <header class="ai-tutor-header">
            <div class="ai-header-left">
              <div class="ai-avatar-wrap">
                <span class="ai-avatar-icon">🤖</span>
                <span class="ai-online-dot" title="Sẵn sàng giải đáp"></span>
              </div>
              <div class="ai-header-info">
                <div class="ai-header-title-row">
                  <h3 class="ai-header-title">Trợ Lý AI Cisco Lab</h3>
                  <span class="ai-model-badge" id="ai-active-model-badge">Gemini 2.0 Flash</span>
                </div>
                <p class="ai-header-sub">Chuyên gia CCNA 200-301 &amp; Chẩn đoán hình ảnh Packet Tracer</p>
              </div>
            </div>

            <div class="ai-header-actions">
              <button type="button" class="ai-tool-btn" id="ai-settings-toggle-btn" title="Cài đặt API Key &amp; Model">
                ⚙️ Cài đặt
              </button>
              <button type="button" class="ai-tool-btn" id="ai-clear-chat-btn" title="Xóa lịch sử hội thoại">
                🗑️
              </button>
              <button type="button" class="ai-close-btn" id="ai-tutor-close-btn" aria-label="Đóng Trợ lý AI" title="Đóng (Esc)">
                ✕
              </button>
            </div>
          </header>

          <!-- Current Study Context Pill -->
          <div class="ai-context-bar" id="ai-context-bar">
            <span class="ai-context-icon">📌</span>
            <span class="ai-context-text" id="ai-context-text">Đang nhận diện bài học...</span>
            <button type="button" class="ai-context-refresh-btn" id="ai-context-refresh-btn" title="Cập nhật ngữ cảnh theo bài học bạn đang mở">
              Làm mới
            </button>
          </div>

          <!-- Chat Stream Area -->
          <div class="ai-chat-stream" id="ai-chat-stream">
            <!-- Messages will be rendered here -->
          </div>

          <!-- Attachment Preview Bar (shown when an image is pasted or selected) -->
          <div class="ai-attachment-preview-bar" id="ai-attachment-preview-bar" style="display: none;">
            <div class="ai-attachment-thumb-wrap">
              <img id="ai-attachment-thumb" class="ai-attachment-thumb" src="" alt="Ảnh đính kèm" />
              <button type="button" class="ai-remove-attachment-btn" id="ai-remove-attachment-btn" title="Hủy ảnh này">
                ✕
              </button>
            </div>
            <div class="ai-attachment-info">
              <span class="ai-attachment-name" id="ai-attachment-name">screenshot.png</span>
              <span class="ai-attachment-desc">Sẵn sàng để AI phân tích khi bạn bấm Gửi</span>
            </div>
          </div>

          <!-- Suggested Quick Prompts -->
          <div class="ai-quick-prompts" id="ai-quick-prompts">
            <button type="button" class="ai-prompt-chip" data-prompt="Soi lỗi ảnh Packet Tracer này giúp tôi: tại sao link bị đỏ hoặc ping không thông?">
              🔍 Soi lỗi ảnh Packet Tracer
            </button>
            <button type="button" class="ai-prompt-chip" data-prompt="Hướng dẫn từng bước cấu hình CLI để hoàn thành bài Lab hiện tại">
              🛠️ Hướng dẫn làm Lab hiện tại
            </button>
            <button type="button" class="ai-prompt-chip" data-prompt="Giải thích sự khác biệt giữa Switchport Access và Trunk 802.1Q">
              💡 Phân biệt Access &amp; Trunk
            </button>
            <button type="button" class="ai-prompt-chip" data-prompt="Cho tôi một bài tập tính nhẩm chia mạng con Subnetting kèm lời giải">
              🎯 Bài tập Subnetting
            </button>
          </div>

          <!-- Input Footer -->
          <footer class="ai-tutor-footer">
            <div class="ai-input-wrapper">
              <label for="ai-image-upload-input" class="ai-image-btn" title="Đính kèm ảnh chụp màn hình Packet Tracer (hoặc bấm Ctrl+V để dán trực tiếp)">
                📷
                <input type="file" id="ai-image-upload-input" accept="image/*" style="display:none;" />
              </label>

              <textarea
                id="ai-user-prompt-input"
                class="ai-prompt-textarea"
                rows="1"
                placeholder="Hỏi AI bất kỳ điều gì, hoặc bấm Ctrl+V để dán ảnh Packet Tracer..."
              ></textarea>

              <button type="button" class="ai-send-btn" id="ai-send-msg-btn" title="Gửi câu hỏi (Enter)">
                <span class="send-icon">➤</span>
              </button>
            </div>
            <div class="ai-footer-hint">
              <span>💡 Mẹo: Dùng <strong>Win + Shift + S</strong> chụp màn hình Packet Tracer &rarr; Bấm <strong>Ctrl + V</strong> vào khung chat để dán ảnh tức thì!</span>
            </div>
          </footer>
        </div>
      </div>

      <!-- AI Settings Modal (API Key & Model Selection) -->
      <div class="ai-settings-modal" id="ai-settings-modal" role="dialog" aria-modal="true" aria-label="Cài đặt AI" hidden>
        <div class="ai-settings-backdrop" id="ai-settings-backdrop"></div>
        <div class="ai-settings-card">
          <div class="ai-settings-header">
            <h4>⚙️ Cài Đặt Trợ Lý AI Cisco</h4>
            <button type="button" class="ai-settings-close-btn" id="ai-settings-close-btn">✕</button>
          </div>

          <div class="ai-settings-body">
            <div class="ai-field-group">
              <label for="ai-api-key-input">
                <strong>Google Gemini API Key</strong>
                <span class="ai-field-tag">Miễn phí 100%</span>
              </label>
              <div class="ai-api-key-row">
                <input
                  type="password"
                  id="ai-api-key-input"
                  class="ai-key-input"
                  placeholder="Dán API Key (AIzaSy...)"
                />
                <button type="button" id="ai-api-key-toggle-btn" class="ai-key-toggle-btn" title="Ẩn/Hiện">👁️</button>
              </div>
              <p class="ai-field-hint">
                Chưa có mã? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" class="ai-link">Bấm vào đây để lấy API Key miễn phí tại Google AI Studio</a> (chỉ mất 10 giây đăng nhập tài khoản Google).
              </p>
            </div>

            <div class="ai-field-group">
              <label for="ai-model-select"><strong>Mô hình AI (Model)</strong></label>
              <select id="ai-model-select" class="ai-select-field">
                <option value="gemini-2.5-flash-lite" selected>Gemini 2.5 Flash-Lite (Tiết kiệm token tối đa, Siêu tốc - Khuyên dùng)</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Cân bằng, Phân tích ảnh sắc nét)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Suy luận sâu)</option>
              </select>
            </div>

            <div class="ai-notice-box">
              <p>🛡️ <strong>Bảo mật:</strong> API Key được lưu an toàn trực tiếp trên trình duyệt của riêng bạn (LocalStorage). Hệ thống không bao giờ lưu trữ hay chuyển tiếp API Key của bạn qua máy chủ trung gian.</p>
            </div>
          </div>

          <div class="ai-settings-footer">
            <button type="button" class="ai-btn-secondary" id="ai-settings-cancel-btn">Đóng</button>
            <button type="button" class="ai-btn-primary" id="ai-settings-save-btn">Lưu cấu hình</button>
          </div>
        </div>
      </div>
    `;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = modalHtml;
    document.body.appendChild(wrapper);
  }

  // Render chat messages to DOM
  function renderChatMessages() {
    const stream = document.getElementById("ai-chat-stream");
    if (!stream) return;

    if (chatHistory.length === 0) {
      const context = getCurrentStudyContext();
      stream.innerHTML = `
        <div class="ai-welcome-card">
          <div class="ai-welcome-icon">🎓</div>
          <h4 class="ai-welcome-title">Chào bạn! Tôi là Trợ Lý AI Cisco Lab</h4>
          <p class="ai-welcome-desc">
            Tôi có thể hỗ trợ bạn học tập toàn bộ 17 học phần CCNA 200-301 và chẩn đoán sự cố trong <strong>Cisco Packet Tracer</strong>.
          </p>
          <div class="ai-welcome-features">
            <div class="ai-feat-item">
              <span class="feat-icon">📸</span>
              <span><strong>Soi lỗi ảnh chụp màn hình:</strong> Gửi ảnh sơ đồ Packet Tracer, báo lỗi ping đỏ hoặc CLI để nhận lệnh sửa ngay.</span>
            </div>
            <div class="ai-feat-item">
              <span class="feat-icon">⚡</span>
              <span><strong>Dán ảnh nhanh:</strong> Chụp màn hình (<code>Win + Shift + S</code>) rồi bấm <code>Ctrl + V</code> vào khung chat!</span>
            </div>
            <div class="ai-feat-item">
              <span class="feat-icon">🎯</span>
              <span><strong>Gắn ngữ cảnh tự động:</strong> Hiện đang theo sát: <em>${escapeHtml(context.title)}</em>.</span>
            </div>
          </div>
        </div>
      `;
      return;
    }

    let html = "";
    chatHistory.forEach((msg, idx) => {
      const isUser = msg.role === "user";
      html += `
        <div class="ai-message-row ${isUser ? "user" : "assistant"}">
          <div class="ai-msg-avatar">
            ${isUser ? "👤" : "🤖"}
          </div>
          <div class="ai-msg-content-wrap">
            <div class="ai-msg-sender">${isUser ? "Bạn" : "Cisco AI Tutor"}</div>
            ${
              msg.image
                ? `<div class="ai-msg-image-wrap">
                     <img src="${msg.image}" alt="Ảnh gửi từ người dùng" class="ai-msg-img" onclick="window.openImageLightbox && window.openImageLightbox('${msg.image}', 'Ảnh Packet Tracer')" />
                   </div>`
                : ""
            }
            <div class="ai-msg-body">
              ${isUser ? escapeHtml(msg.text).replace(/\n/g, "<br/>") : formatMarkdown(msg.text)}
            </div>
            <div class="ai-msg-time">${msg.time || ""}</div>
          </div>
        </div>
      `;
    });

    if (isGenerating) {
      html += `
        <div class="ai-message-row assistant">
          <div class="ai-msg-avatar">🤖</div>
          <div class="ai-msg-content-wrap">
            <div class="ai-msg-sender">Cisco AI Tutor</div>
            <div class="ai-msg-body ai-loading-body">
              <span class="ai-typing-dot"></span>
              <span class="ai-typing-dot"></span>
              <span class="ai-typing-dot"></span>
              <span style="font-size:0.85rem; color:var(--text-muted); margin-left:0.5rem;">AI đang soi chiếu sơ đồ &amp; chuẩn bị lời giải...</span>
            </div>
          </div>
        </div>
      `;
    }

    stream.innerHTML = html;

    // Attach copy handlers to CLI code blocks
    stream.querySelectorAll(".ai-cli-copy-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const codeId = btn.dataset.codeId;
        const codeEl = document.getElementById(codeId);
        if (codeEl) {
          const text = codeEl.innerText;
          await navigator.clipboard.writeText(text);
          const orig = btn.innerText;
          btn.innerText = "✓ Đã sao chép";
          setTimeout(() => (btn.innerText = orig), 1800);
        }
      });
    });

    // Scroll to bottom
    stream.scrollTop = stream.scrollHeight;
  }

  // Update current context text
  function updateContextDisplay() {
    const textEl = document.getElementById("ai-context-text");
    if (!textEl) return;
    const ctx = getCurrentStudyContext();
    textEl.innerHTML = `Đang gắn ngữ cảnh: <strong>${escapeHtml(ctx.title)}</strong>`;
  }

  // Handle User Send
  async function handleSendUserMessage(customPrompt) {
    if (isGenerating) return;

    const input = document.getElementById("ai-user-prompt-input");
    const promptText = (customPrompt || (input ? input.value : "")).trim();

    if (!promptText && !attachedImage) {
      if (input) input.focus();
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // User message
    const userMsg = {
      role: "user",
      text: promptText,
      image: attachedImage ? attachedImage.previewUrl : null,
      time: timeStr
    };

    chatHistory.push(userMsg);
    saveChatHistory();

    const imageToSend = attachedImage;
    clearAttachment();

    if (input) {
      input.value = "";
      input.style.height = "auto";
    }

    isGenerating = true;
    renderChatMessages();

    const context = getCurrentStudyContext();

    try {
      const responseText = await callGeminiApi(promptText, imageToSend, context);
      chatHistory.push({
        role: "assistant",
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      });
      saveChatHistory();
    } catch (err) {
      chatHistory.push({
        role: "assistant",
        text: `⚠️ **Không thể hoàn thành yêu cầu:**\n\n${err.message}\n\n*Gợi ý:* Hãy kiểm tra kết nối mạng hoặc dán lại API Key hợp lệ trong phần Cài đặt (⚙️).`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      });
      saveChatHistory();
    } finally {
      isGenerating = false;
      renderChatMessages();
    }
  }

  function saveChatHistory() {
    try {
      // Keep last 30 messages to avoid local storage overflow
      const trimmed = chatHistory.slice(-30);
      localStorage.setItem(STORAGE_KEY_CHAT_HISTORY, JSON.stringify(trimmed));
    } catch (e) {
      console.warn("Failed to save AI chat history:", e);
    }
  }

  function clearAttachment() {
    attachedImage = null;
    const bar = document.getElementById("ai-attachment-preview-bar");
    const thumb = document.getElementById("ai-attachment-thumb");
    const nameEl = document.getElementById("ai-attachment-name");
    const fileInput = document.getElementById("ai-image-upload-input");

    if (bar) bar.style.display = "none";
    if (thumb) thumb.src = "";
    if (nameEl) nameEl.textContent = "";
    if (fileInput) fileInput.value = "";
  }

  function setAttachmentFromFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      alert("Vui lòng chọn một tệp hình ảnh (PNG, JPG, JPEG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Token Saver: Downscale image to max dimension 1024px to drastically reduce token usage
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

        // Compress to efficient JPEG 0.82 quality (preserves CLI text & link lights while saving ~80% tokens)
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
        const base64 = compressedDataUrl.split(",")[1];

        attachedImage = {
          base64: base64,
          mimeType: "image/jpeg",
          previewUrl: compressedDataUrl,
          name: file.name || "packet_tracer_screenshot.jpg"
        };

        const bar = document.getElementById("ai-attachment-preview-bar");
        const thumb = document.getElementById("ai-attachment-thumb");
        const nameEl = document.getElementById("ai-attachment-name");

        if (thumb) thumb.src = compressedDataUrl;
        if (nameEl) nameEl.textContent = `${attachedImage.name} (${width}x${height} - Tối ưu token)`;
        if (bar) bar.style.display = "flex";

        const input = document.getElementById("ai-user-prompt-input");
        if (input) {
          input.focus();
          if (!input.value.trim()) {
            input.value = "Nhờ AI soi lỗi trên sơ đồ Packet Tracer này và chỉ cách sửa giúp tôi:";
          }
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Open & Close Modal
  function openAiTutorModal(initialPrompt) {
    createAiTutorModalDom();
    const modal = document.getElementById("ai-tutor-modal");
    if (!modal) return;

    modal.hidden = false;
    document.body.classList.add("modal-open");
    updateContextDisplay();
    renderChatMessages();

    const activeModel = localStorage.getItem(STORAGE_KEY_MODEL) || DEFAULT_MODEL;
    const badge = document.getElementById("ai-active-model-badge");
    if (badge) {
      badge.textContent = activeModel.replace("gemini-", "").toUpperCase();
    }

    const input = document.getElementById("ai-user-prompt-input");
    if (input) {
      if (initialPrompt) input.value = initialPrompt;
      setTimeout(() => input.focus(), 150);
    }
  }

  function closeAiTutorModal() {
    const modal = document.getElementById("ai-tutor-modal");
    if (modal) modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  // Settings Modal Handlers
  function openAiSettingsModal() {
    const m = document.getElementById("ai-settings-modal");
    const keyInput = document.getElementById("ai-api-key-input");
    const modelSelect = document.getElementById("ai-model-select");

    if (keyInput) keyInput.value = localStorage.getItem(STORAGE_KEY_API_KEY) || "";
    if (modelSelect) modelSelect.value = localStorage.getItem(STORAGE_KEY_MODEL) || DEFAULT_MODEL;
    if (m) m.hidden = false;
  }

  function closeAiSettingsModal() {
    const m = document.getElementById("ai-settings-modal");
    if (m) m.hidden = true;
  }

  // Initialize event listeners
  function initAiTutor() {
    createAiTutorModalDom();

    // Floating Button
    const floatingFab = document.getElementById("floating-ai-fab");
    if (floatingFab) {
      floatingFab.addEventListener("click", () => openAiTutorModal());
    }

    // Modal close & backdrop
    const closeBtn = document.getElementById("ai-tutor-close-btn");
    const backdrop = document.getElementById("ai-tutor-backdrop");
    if (closeBtn) closeBtn.addEventListener("click", closeAiTutorModal);
    if (backdrop) backdrop.addEventListener("click", closeAiTutorModal);

    // Context refresh
    const refreshContextBtn = document.getElementById("ai-context-refresh-btn");
    if (refreshContextBtn) {
      refreshContextBtn.addEventListener("click", () => {
        updateContextDisplay();
        refreshContextBtn.textContent = "✓ Đã cập nhật";
        setTimeout(() => (refreshContextBtn.textContent = "Làm mới"), 1200);
      });
    }

    // Clear chat
    const clearBtn = document.getElementById("ai-clear-chat-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirm("Bạn có muốn xóa toàn bộ lịch sử trò chuyện với AI không?")) {
          chatHistory = [];
          localStorage.removeItem(STORAGE_KEY_CHAT_HISTORY);
          renderChatMessages();
        }
      });
    }

    // Settings modal toggle
    const settingsBtn = document.getElementById("ai-settings-toggle-btn");
    const settingsClose = document.getElementById("ai-settings-close-btn");
    const settingsCancel = document.getElementById("ai-settings-cancel-btn");
    const settingsBackdrop = document.getElementById("ai-settings-backdrop");
    const settingsSave = document.getElementById("ai-settings-save-btn");
    const keyToggle = document.getElementById("ai-api-key-toggle-btn");
    const keyInput = document.getElementById("ai-api-key-input");

    if (settingsBtn) settingsBtn.addEventListener("click", openAiSettingsModal);
    if (settingsClose) settingsClose.addEventListener("click", closeAiSettingsModal);
    if (settingsCancel) settingsCancel.addEventListener("click", closeAiSettingsModal);
    if (settingsBackdrop) settingsBackdrop.addEventListener("click", closeAiSettingsModal);

    if (keyToggle && keyInput) {
      keyToggle.addEventListener("click", () => {
        const isPwd = keyInput.type === "password";
        keyInput.type = isPwd ? "text" : "password";
        keyToggle.textContent = isPwd ? "🙈" : "👁️";
      });
    }

    if (settingsSave) {
      settingsSave.addEventListener("click", () => {
        const keyVal = keyInput ? keyInput.value.trim() : "";
        const modelSelect = document.getElementById("ai-model-select");
        const modelVal = modelSelect ? modelSelect.value : DEFAULT_MODEL;

        if (keyVal) {
          localStorage.setItem(STORAGE_KEY_API_KEY, keyVal);
        } else {
          localStorage.removeItem(STORAGE_KEY_API_KEY);
        }
        localStorage.setItem(STORAGE_KEY_MODEL, modelVal);

        const badge = document.getElementById("ai-active-model-badge");
        if (badge) badge.textContent = modelVal.replace("gemini-", "").toUpperCase();

        closeAiSettingsModal();
        alert("Đã lưu cấu hình AI thành công!");
      });
    }

    // Send button & input keydown
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

      // Auto expand height
      promptInput.addEventListener("input", () => {
        promptInput.style.height = "auto";
        promptInput.style.height = Math.min(promptInput.scrollHeight, 120) + "px";
      });
    }

    // File input attachment
    const fileInput = document.getElementById("ai-image-upload-input");
    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
          setAttachmentFromFile(e.target.files[0]);
        }
      });
    }

    // Remove attachment button
    const removeAttBtn = document.getElementById("ai-remove-attachment-btn");
    if (removeAttBtn) removeAttBtn.addEventListener("click", clearAttachment);

    // Quick prompt chips
    const quickPrompts = document.getElementById("ai-quick-prompts");
    if (quickPrompts) {
      quickPrompts.addEventListener("click", (e) => {
        const chip = e.target.closest(".ai-prompt-chip");
        if (chip && chip.dataset.prompt) {
          handleSendUserMessage(chip.dataset.prompt);
        }
      });
    }

    // CLIPBOARD IMAGE PASTE (Ctrl+V) — Superpower for Packet Tracer screenshots!
    window.addEventListener("paste", (e) => {
      const modal = document.getElementById("ai-tutor-modal");
      if (!modal || modal.hidden) return; // Only process when AI modal is open

      const items = (e.clipboardData || e.originalEvent.clipboardData)?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) {
            setAttachmentFromFile(file);
            break;
          }
        }
      }
    });

    // DRAG & DROP Image into Chat Stream
    const stream = document.getElementById("ai-chat-stream");
    if (stream) {
      stream.addEventListener("dragover", (e) => {
        e.preventDefault();
        stream.classList.add("dragover");
      });
      stream.addEventListener("dragleave", () => {
        stream.classList.remove("dragover");
      });
      stream.addEventListener("drop", (e) => {
        e.preventDefault();
        stream.classList.remove("dragover");
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          setAttachmentFromFile(e.dataTransfer.files[0]);
        }
      });
    }
  }

  // Expose to window
  window.openAiTutorModal = openAiTutorModal;
  window.closeAiTutorModal = closeAiTutorModal;
  window.initAiTutor = initAiTutor;

  // Auto initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAiTutor);
  } else {
    initAiTutor();
  }
})();
