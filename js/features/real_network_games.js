// ============================================================================
// CCNA NETWORK ACADEMY — 3 REAL INTERACTIVE GAMES (ZERO MULTIPLE-CHOICE!)
// 1. 🛡️ Firewall Packet Defender (Real-Time HTML5 Canvas Action Game)
// 2. 🔌 Rack Cable Patching Game (Interactive Click-Port-to-Port SVG Game)
// 3. 🔢 Binary Bit-Flipper (Tactile 8-Bit Hardware LED Switchboard Puzzle)
// ============================================================================

(function () {
  "use strict";

  let activeCanvasRaf = null;
  let activeBitTimer = null;

  function stopAllRealGames() {
    if (activeCanvasRaf) {
      cancelAnimationFrame(activeCanvasRaf);
      activeCanvasRaf = null;
    }
    if (activeBitTimer) {
      clearInterval(activeBitTimer);
      activeBitTimer = null;
    }
  }

  // ==========================================================================
  // GAME 1: 🛡️ FIREWALL PACKET DEFENDER (REAL-TIME HTML5 CANVAS ACTION GAME)
  // ==========================================================================
  function renderFirewallDefenderGame(container) {
    stopAllRealGames();
    container.innerHTML = `
      <div class="real-game-card">
        <div class="rg-header">
          <div>
            <h3 style="margin:0;font-size:1.05rem;">🛡️ Firewall Packet Defender (HTML5 Canvas)</h3>
            <p style="font-size:0.8rem;color:var(--text-muted);margin:0.2rem 0 0;">
              <strong>CLICK vào gói ĐỎ (độc hại)</strong> để bắn chặn (DROP) trước khi chạm Server! <strong>ĐỪNG BẮN gói XANH (an toàn)</strong> — để chúng đi qua Server ghi điểm!
            </p>
          </div>
          <div class="rg-hud">
            <span class="rg-pill" id="fw-lives">❤️❤️❤️</span>
            <span class="rg-pill">🏆 <strong id="fw-score">0</strong></span>
            <span class="rg-pill">🌊 Wave <strong id="fw-wave">1</strong></span>
            <button type="button" class="ws-btn primary" id="fw-start-btn">▶ Bắt đầu chơi</button>
          </div>
        </div>
        <div class="fw-canvas-wrap">
          <canvas id="fw-defender-canvas" width="820" height="360"></canvas>
        </div>
        <div class="rg-legend-bar">
          <span class="rg-tag safe">🟢 THẢ QUA: HTTPS :443 • SSH :22 • DNS :53 • NTP :123 • SNMPv3</span>
          <span class="rg-tag bad">🔴 BẮN CHẶN: TELNET :23 • SYN Flood • ARP Spoof • Malware :4444 • Rogue DHCP</span>
        </div>
      </div>
    `;

    const canvas = document.getElementById("fw-defender-canvas");
    const ctx = canvas.getContext("2d");
    const startBtn = document.getElementById("fw-start-btn");
    const scoreEl = document.getElementById("fw-score");
    const livesEl = document.getElementById("fw-lives");
    const waveEl = document.getElementById("fw-wave");

    const SAFE_PACKETS = ["HTTPS :443", "SSH :22", "DNS :53", "NTP :123", "DHCP OK", "ICMP Ping"];
    const BAD_PACKETS = ["TELNET :23", "SYN Flood", "ARP Spoof", "Malware :4444", "Rogue DHCP", "SQL Inject"];

    let running = false;
    let score = 0;
    let lives = 3;
    let wave = 1;
    let spawnTimer = 0;
    let packets = [];
    let particles = [];
    let floatingTexts = [];

    function drawIdleScreen() {
      ctx.fillStyle = "#0b1426";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Grid lines
      ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
      // Server defense zone on right
      ctx.fillStyle = "rgba(16, 185, 129, 0.14)";
      ctx.fillRect(canvas.width - 84, 0, 84, canvas.height);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(canvas.width - 84, 0); ctx.lineTo(canvas.width - 84, canvas.height); ctx.stroke();
      ctx.fillStyle = "#34d399";
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SERVER", canvas.width - 42, canvas.height / 2 - 6);
      ctx.fillText("LAN", canvas.width - 42, canvas.height / 2 + 12);

      if (!running) {
        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 20px Inter, sans-serif";
        ctx.fillText("🛡️ Sẵn sàng bảo vệ Server công ty!", canvas.width / 2 - 30, canvas.height / 2 - 12);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "14px Inter, sans-serif";
        ctx.fillText("Bấm '▶ Bắt đầu chơi' — Click chuột vào gói ĐỎ để DROP, thả gói XANH đi qua!", canvas.width / 2 - 30, canvas.height / 2 + 18);
      }
    }

    function spawnBurst(x, y, color, label) {
      for (let i = 0; i < 16; i++) {
        const ang = (Math.PI * 2 * i) / 16 + Math.random() * 0.3;
        const spd = 1.6 + Math.random() * 3.5;
        particles.push({ x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, life: 28, color });
      }
      if (label) floatingTexts.push({ x, y, text: label, color, life: 36 });
    }

    function updateHud() {
      if (scoreEl) scoreEl.textContent = String(score);
      if (livesEl) livesEl.textContent = "❤️".repeat(Math.max(0, lives)) + "🖤".repeat(Math.max(0, 3 - lives));
      if (waveEl) waveEl.textContent = String(wave);
    }

    function spawnPacket() {
      const isBad = Math.random() < 0.56;
      const list = isBad ? BAD_PACKETS : SAFE_PACKETS;
      const label = list[Math.floor(Math.random() * list.length)];
      const y = 38 + Math.random() * (canvas.height - 76);
      const speed = 1.35 + wave * 0.28 + Math.random() * 0.6;
      packets.push({ x: -70, y, w: 112, h: 32, isBad, label, speed });
    }

    function gameLoop() {
      if (!running) return;
      drawIdleScreen();

      spawnTimer++;
      const spawnInterval = Math.max(36, 92 - wave * 8);
      if (spawnTimer >= spawnInterval) {
        spawnTimer = 0;
        spawnPacket();
      }

      wave = 1 + Math.floor(score / 180);

      // Update & draw packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.x += p.speed;

        // Draw packet pill
        ctx.fillStyle = p.isBad ? "#dc2626" : "#059669";
        ctx.strokeStyle = p.isBad ? "#fca5a5" : "#6ee7b7";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y - p.h / 2, p.w, p.h, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px Consolas, monospace";
        ctx.textAlign = "center";
        ctx.fillText(p.label, p.x + p.w / 2, p.y + 4);

        // Reached Server line
        if (p.x + p.w >= canvas.width - 84) {
          if (p.isBad) {
            lives--;
            spawnBurst(canvas.width - 84, p.y, "#ef4444", "💥 LỌT TẤN CÔNG!");
            updateHud();
            if (lives <= 0) {
              endGame();
              return;
            }
          } else {
            score += 20;
            spawnBurst(canvas.width - 84, p.y, "#10b981", "+20 OK");
            updateHud();
          }
          packets.splice(i, 1);
        }
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        ctx.globalAlpha = Math.max(0, pt.life / 28);
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 4, 4);
        ctx.globalAlpha = 1;
        if (pt.life <= 0) particles.splice(i, 1);
      }

      // Floating texts
      for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y -= 0.9;
        ft.life--;
        ctx.globalAlpha = Math.max(0, ft.life / 36);
        ctx.fillStyle = ft.color;
        ctx.font = "bold 13px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.globalAlpha = 1;
        if (ft.life <= 0) floatingTexts.splice(i, 1);
      }

      activeCanvasRaf = requestAnimationFrame(gameLoop);
    }

    function endGame() {
      running = false;
      stopAllRealGames();
      drawIdleScreen();
      const xp = Math.max(15, Math.round(score / 4));
      if (typeof window.awardCcnaXp === "function") {
        window.awardCcnaXp(xp, `Firewall Defender (${score} điểm)`);
      }
      ctx.fillStyle = "rgba(11, 20, 38, 0.82)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#f5c451";
      ctx.font = "bold 24px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`🏁 GAME OVER — ĐIỂM: ${score} (+${xp} XP)`, canvas.width / 2, canvas.height / 2 - 10);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "14px Inter, sans-serif";
      ctx.fillText("Bấm '▶ Chơi lại' để phá kỷ lục và bảo vệ Server ở Wave cao hơn!", canvas.width / 2, canvas.height / 2 + 20);
      startBtn.textContent = "▶ Chơi lại";
    }

    canvas.addEventListener("click", (e) => {
      if (!running) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        if (mx >= p.x - 6 && mx <= p.x + p.w + 6 && my >= p.y - p.h / 2 - 6 && my <= p.y + p.h / 2 + 6) {
          if (p.isBad) {
            score += 30;
            spawnBurst(p.x + p.w / 2, p.y, "#f5c451", "+30 DROP!");
          } else {
            lives--;
            spawnBurst(p.x + p.w / 2, p.y, "#ef4444", "❌ BẮN NHẦM GÓI SẠCH!");
            if (lives <= 0) {
              packets.splice(i, 1);
              updateHud();
              endGame();
              return;
            }
          }
          packets.splice(i, 1);
          updateHud();
          break;
        }
      }
    });

    startBtn.addEventListener("click", () => {
      stopAllRealGames();
      running = true;
      score = 0;
      lives = 3;
      wave = 1;
      spawnTimer = 60;
      packets = [];
      particles = [];
      floatingTexts = [];
      updateHud();
      startBtn.textContent = "🔄 Chơi lại";
      gameLoop();
    });

    drawIdleScreen();
  }

  // ==========================================================================
  // GAME 2: 🔌 CẮM CÁP TỦ RACK (INTERACTIVE CLICK-PORT-TO-PORT SVG GAME)
  // ==========================================================================
  const CABLE_LEVELS = [
    {
      name: "Màn 1: Cắm dây Console cấu hình Switch mới khui hộp",
      hint: "Chọn dây Console xanh ngọc → Click cổng RS-232 trên Laptop → Click cổng Console trên Switch!",
      devices: [
        { id: "lap", name: "Laptop Admin", icon: "💻", x: 140, y: 145, ports: [{ id: "rs232", label: "RS-232", dx: 48, dy: 0 }] },
        { id: "sw", name: "Switch 2960", icon: "🔀", x: 640, y: 145, ports: [{ id: "con", label: "Console", dx: -48, dy: 0 }] }
      ],
      targets: [{ a: "lap:rs232", b: "sw:con", cable: "console" }]
    },
    {
      name: "Màn 2: Nối PC Kế toán vào Switch rồi lên Router",
      hint: "Hai thiết bị KHÁC nhóm (PC↔Switch, Switch↔Router) dùng Cáp Thẳng (Straight-Through)!",
      devices: [
        { id: "pc", name: "PC Kế toán", icon: "🖥️", x: 110, y: 145, ports: [{ id: "nic", label: "NIC", dx: 45, dy: 0 }] },
        { id: "sw", name: "Switch 2960", icon: "🔀", x: 390, y: 145, ports: [{ id: "fa01", label: "Fa0/1", dx: -48, dy: 0 }, { id: "gi01", label: "Gi0/1", dx: 48, dy: 0 }] },
        { id: "r1", name: "Router R1", icon: "🌐", x: 670, y: 145, ports: [{ id: "gi00", label: "Gi0/0", dx: -45, dy: 0 }] }
      ],
      targets: [
        { a: "pc:nic", b: "sw:fa01", cable: "straight" },
        { a: "sw:gi01", b: "r1:gi00", cable: "straight" }
      ]
    },
    {
      name: "Màn 3: Nối 2 Switch cùng tầng & 2 Router biên (Thiết bị CÙNG nhóm)",
      hint: "Hai thiết bị CÙNG nhóm (Switch↔Switch, Router↔Router) dùng Cáp Chéo (Cross-Over) chuẩn CCNA!",
      devices: [
        { id: "sw1", name: "Switch SW1", icon: "🔀", x: 140, y: 85, ports: [{ id: "gi01", label: "Gi0/1", dx: 48, dy: 0 }] },
        { id: "sw2", name: "Switch SW2", icon: "🔀", x: 640, y: 85, ports: [{ id: "gi01", label: "Gi0/1", dx: -48, dy: 0 }] },
        { id: "r1", name: "Router R1", icon: "🌐", x: 140, y: 215, ports: [{ id: "gi00", label: "Gi0/0", dx: 45, dy: 0 }] },
        { id: "r2", name: "Router R2", icon: "🌐", x: 640, y: 215, ports: [{ id: "gi00", label: "Gi0/0", dx: -45, dy: 0 }] }
      ],
      targets: [
        { a: "sw1:gi01", b: "sw2:gi01", cable: "crossover" },
        { a: "r1:gi00", b: "r2:gi00", cable: "crossover" }
      ]
    },
    {
      name: "Màn 4: Kết nối Cáp Quang Fiber 10Gbps từ Core Switch sang Server Farm",
      hint: "Đường Uplink tốc độ cao giữa 2 cổng SFP/SFP+ dùng Cáp Quang Fiber màu cam!",
      devices: [
        { id: "core", name: "Core Switch 3650", icon: "⚡", x: 150, y: 145, ports: [{ id: "sfp1", label: "SFP+ 1/1", dx: 52, dy: 0 }] },
        { id: "srv", name: "Server Rack", icon: "🗄️", x: 630, y: 145, ports: [{ id: "sfp0", label: "SFP+ 0", dx: -52, dy: 0 }] }
      ],
      targets: [{ a: "core:sfp1", b: "srv:sfp0", cable: "fiber" }]
    }
  ];

  const CABLE_STYLES = {
    straight: { label: "⬛ Cáp Thẳng (Straight)", color: "#0f172a", dash: "" },
    crossover: { label: "⚡ Cáp Chéo (Cross-Over)", color: "#6366f1", dash: "7,4" },
    console: { label: "🟦 Cáp Console", color: "#06b6d4", dash: "" },
    fiber: { label: "🟧 Cáp Quang (Fiber)", color: "#f97316", dash: "" }
  };

  function renderCablePatchingGame(container, levelIdx = 0) {
    stopAllRealGames();
    const lv = CABLE_LEVELS[levelIdx] || CABLE_LEVELS[0];
    let selectedCable = "straight";
    let firstPort = null;
    let connected = [];

    function getPortCoords(portKey) {
      const [devId, pId] = portKey.split(":");
      const dev = lv.devices.find((d) => d.id === devId);
      const port = dev && dev.ports.find((p) => p.id === pId);
      if (!dev || !port) return { x: 0, y: 0 };
      return { x: dev.x + port.dx, y: dev.y + port.dy };
    }

    function drawBoard(statusMsg = lv.hint, statusType = "info") {
      const linesSvg = connected.map((c) => {
        const p1 = getPortCoords(c.a);
        const p2 = getPortCoords(c.b);
        const st = CABLE_STYLES[c.cable];
        return `
          <line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${st.color}" stroke-width="4" ${st.dash ? `stroke-dasharray="${st.dash}"` : ""}/>
          <circle cx="${p1.x}" cy="${p1.y}" r="6" fill="#16a34a" stroke="#fff" stroke-width="1.5"/>
          <circle cx="${p2.x}" cy="${p2.y}" r="6" fill="#16a34a" stroke="#fff" stroke-width="1.5"/>
        `;
      }).join("");

      const devsSvg = lv.devices.map((d) => {
        const portsSvg = d.ports.map((p) => {
          const pKey = `${d.id}:${p.id}`;
          const px = d.x + p.dx;
          const py = d.y + p.dy;
          const isSel = firstPort === pKey;
          const isDone = connected.some((c) => c.a === pKey || c.b === pKey);
          const fill = isDone ? "#16a34a" : isSel ? "#f59e0b" : "#334155";
          return `
            <g class="cable-port-node" data-pkey="${pKey}" style="cursor:pointer;">
              <circle cx="${px}" cy="${py}" r="12" fill="${fill}" stroke="#ffffff" stroke-width="2"/>
              <text x="${px}" y="${py + 25}" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#0f172a">${p.label}</text>
            </g>
          `;
        }).join("");

        return `
          <g>
            <rect x="${d.x - 42}" y="${d.y - 32}" width="84" height="64" rx="10" fill="#0f1d36" stroke="#38bdf8" stroke-width="2"/>
            <text x="${d.x}" y="${d.y + 5}" font-size="22" text-anchor="middle">${d.icon}</text>
            <text x="${d.x}" y="${d.y + 50}" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#0f172a">${d.name}</text>
            ${portsSvg}
          </g>
        `;
      }).join("");

      const allDone = connected.length === lv.targets.length;

      container.innerHTML = `
        <div class="real-game-card">
          <div class="rg-header">
            <div>
              <h3 style="margin:0;font-size:1.05rem;">🔌 ${lv.name}</h3>
              <div class="cable-status-msg ${statusType}">${statusMsg}</div>
            </div>
            <div class="rg-hud">
              ${CABLE_LEVELS.map((_, i) => `<button type="button" class="rpg-pill ${i === levelIdx ? "active" : ""}" data-clv="${i}">Màn ${i + 1}</button>`).join("")}
            </div>
          </div>

          <div class="cable-svg-box">
            <svg viewBox="0 0 780 285" width="100%" style="background:#f8fafc;border-radius:10px;border:1px solid var(--border-color);">
              ${linesSvg}
              ${devsSvg}
            </svg>
          </div>

          <div class="cable-tray">
            <span style="font-size:0.78rem;font-weight:700;color:var(--text-muted);">1️⃣ Chọn dây cáp:</span>
            ${Object.entries(CABLE_STYLES).map(([k, v]) => `
              <button type="button" class="cable-pick-btn ${selectedCable === k ? "active" : ""}" data-ckey="${k}">${v.label}</button>
            `).join("")}
            ${allDone ? `<button type="button" class="ws-btn primary" id="cable-next-lv-btn" style="margin-left:auto;">🎉 Qua Màn tiếp theo →</button>` : ""}
          </div>
        </div>
      `;

      container.querySelectorAll("[data-clv]").forEach((b) => {
        b.addEventListener("click", () => renderCablePatchingGame(container, Number(b.dataset.clv)));
      });
      container.querySelectorAll(".cable-pick-btn").forEach((b) => {
        b.addEventListener("click", () => {
          selectedCable = b.dataset.ckey;
          drawBoard(`Đã cầm ${CABLE_STYLES[selectedCable].label} — Bấm vào Cổng A rồi Cổng B để cắm dây!`, "info");
        });
      });
      container.querySelectorAll(".cable-port-node").forEach((node) => {
        node.addEventListener("click", () => {
          const pKey = node.dataset.pkey;
          if (!firstPort) {
            firstPort = pKey;
            drawBoard(`Đã cắm 1 đầu vào ${pKey} — Giờ bấm vào cổng đích để hoàn tất!`, "info");
            return;
          }
          if (firstPort === pKey) {
            firstPort = null;
            drawBoard("Đã hủy chọn cổng.", "info");
            return;
          }
          const match = lv.targets.find((t) =>
            (t.a === firstPort && t.b === pKey) || (t.b === firstPort && t.a === pKey)
          );
          if (!match) {
            firstPort = null;
            drawBoard("❌ Hai cổng này không cần nối trực tiếp với nhau ở màn này! Thử cặp cổng khác nhé.", "err");
            return;
          }
          if (match.cable !== selectedCable) {
            firstPort = null;
            drawBoard(`🔴 Sai loại cáp! Bạn đang cầm ${CABLE_STYLES[selectedCable].label}, nhưng cặp cổng này cần ${CABLE_STYLES[match.cable].label}!`, "err");
            return;
          }
          if (!connected.some((c) => (c.a === match.a && c.b === match.b))) {
            connected.push(match);
          }
          firstPort = null;
          if (connected.length === lv.targets.length) {
            if (typeof window.awardCcnaXp === "function") window.awardCcnaXp(45, `Cắm cáp chuẩn Màn ${levelIdx + 1}!`);
            drawBoard("🟢 ĐÈN XANH UP/UP! Bạn đã cắm cáp chuẩn 100% kỹ sư mạng (+45 XP)!", "ok");
          } else {
            drawBoard("🟢 Tuyệt vời! Nối tiếp sợi cáp còn lại để hoàn thành màn này.", "ok");
          }
        });
      });
      document.getElementById("cable-next-lv-btn")?.addEventListener("click", () => {
        renderCablePatchingGame(container, (levelIdx + 1) % CABLE_LEVELS.length);
      });
    }

    drawBoard();
  }

  // ==========================================================================
  // GAME 3: 🔢 BINARY BIT-FLIPPER (TACTILE 8-BIT HARDWARE LED SWITCHBOARD)
  // ==========================================================================
  function renderBinaryBitFlipper(container) {
    stopAllRealGames();
    const BIT_WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];
    const SUBNET_TARGETS = [128, 192, 224, 240, 248, 252, 254, 255, 172, 168, 10, 64, 96, 160, 200, 42, 130];

    let bits = [0, 0, 0, 0, 0, 0, 0, 0];
    let target = 192;
    let score = 0;
    let streak = 0;

    function pickNewTarget() {
      bits = [0, 0, 0, 0, 0, 0, 0, 0];
      target = SUBNET_TARGETS[Math.floor(Math.random() * SUBNET_TARGETS.length)];
    }

    function drawSwitchboard(flashOk = false) {
      const sum = bits.reduce((acc, b, i) => acc + (b ? BIT_WEIGHTS[i] : 0), 0);
      const binStr = bits.join("");

      container.innerHTML = `
        <div class="real-game-card ${flashOk ? "bit-flash-ok" : ""}">
          <div class="rg-header">
            <div>
              <h3 style="margin:0;font-size:1.05rem;">🔢 Binary Bit-Flipper — Bảng Công Tắc LED 8-Bit</h3>
              <p style="font-size:0.8rem;color:var(--text-muted);margin:0.2rem 0 0;">
                Bấm gạt các công tắc <strong>128 | 64 | 32 | 16 | 8 | 4 | 2 | 1</strong> sao cho tổng bằng đúng số mục tiêu để luyện phản xạ chia Subnet!
              </p>
            </div>
            <div class="rg-hud">
              <span class="rg-pill">🏆 Điểm: <strong>${score}</strong></span>
              <span class="rg-pill">🔥 Chuỗi: <strong>${streak}</strong></span>
              <button type="button" class="ws-btn" id="bit-skip-btn">🎲 Đổi số khác</button>
            </div>
          </div>

          <div class="bit-target-stage">
            <div class="bit-box target">
              <span>MỤC TIÊU (DECIMAL)</span>
              <strong>${target}</strong>
            </div>
            <div class="bit-eq-sign">${sum === target ? "✅" : "≠"}</div>
            <div class="bit-box current ${sum === target ? "matched" : sum > target ? "over" : ""}">
              <span>TỔNG HIỆN TẠI (${binStr})</span>
              <strong>${sum}</strong>
            </div>
          </div>

          <div class="bit-switches-row">
            ${BIT_WEIGHTS.map((w, idx) => `
              <button type="button" class="bit-switch-btn ${bits[idx] ? "on" : "off"}" data-bidx="${idx}">
                <span class="bit-led"></span>
                <span class="bit-val">${bits[idx]}</span>
                <span class="bit-weight">${w}</span>
              </button>
            `).join("")}
          </div>
        </div>
      `;

      container.querySelectorAll(".bit-switch-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const i = Number(btn.dataset.bidx);
          bits[i] = bits[i] ? 0 : 1;
          const newSum = bits.reduce((acc, b, idx) => acc + (b ? BIT_WEIGHTS[idx] : 0), 0);
          if (newSum === target) {
            score += 25;
            streak++;
            if (typeof window.awardCcnaXp === "function") {
              window.awardCcnaXp(25, `Bit-Flipper khớp ${target} (${bits.join("")})!`);
            }
            drawSwitchboard(true);
            setTimeout(() => {
              pickNewTarget();
              drawSwitchboard(false);
            }, 650);
          } else {
            drawSwitchboard(false);
          }
        });
      });

      document.getElementById("bit-skip-btn")?.addEventListener("click", () => {
        streak = 0;
        pickNewTarget();
        drawSwitchboard(false);
      });
    }

    drawSwitchboard();
  }

  // Upgrade renderArcadeHubPage so these 3 REAL interactive games appear FIRST!
  const origRenderArcade = window.renderArcadeHubPage;
  window.renderArcadeHubPage = function () {
    if (typeof origRenderArcade === "function") origRenderArcade();
    const tabsBar = document.querySelector(".arcade-mode-tabs");
    const hub = document.querySelector(".arcade-hub-page");
    if (!tabsBar || !hub) return;

    // Prepend 3 REAL game tabs before RPG/Speed/Badges
    tabsBar.insertAdjacentHTML("afterbegin", `
      <button type="button" class="toolkit-tab-btn active" data-atab="firewall">🛡️ Firewall Defender (Bắn gói tin)</button>
      <button type="button" class="toolkit-tab-btn" data-atab="cables">🔌 Cắm Cáp Tủ Rack (SVG)</button>
      <button type="button" class="toolkit-tab-btn" data-atab="bitflip">🔢 Gạt LED 8-Bit (Subnet)</button>
    `);

    // Deactivate old default tab
    tabsBar.querySelector('[data-atab="rpg"]')?.classList.remove("active");
    document.getElementById("arcade-pane-rpg")?.classList.remove("active");

    const rpgPane = document.getElementById("arcade-pane-rpg");
    if (rpgPane) {
      rpgPane.insertAdjacentHTML("beforebegin", `
        <div class="arcade-pane active" id="arcade-pane-firewall"></div>
        <div class="arcade-pane" id="arcade-pane-cables"></div>
        <div class="arcade-pane" id="arcade-pane-bitflip"></div>
      `);
    }

    // Re-bind all tabs cleanly
    tabsBar.querySelectorAll(".toolkit-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        stopAllRealGames();
        const t = btn.dataset.atab;
        tabsBar.querySelectorAll(".toolkit-tab-btn").forEach((b) => b.classList.toggle("active", b === btn));
        hub.querySelectorAll(".arcade-pane").forEach((p) => p.classList.toggle("active", p.id === `arcade-pane-${t}`));
        if (t === "firewall") renderFirewallDefenderGame(document.getElementById("arcade-pane-firewall"));
        else if (t === "cables") renderCablePatchingGame(document.getElementById("arcade-pane-cables"), 0);
        else if (t === "bitflip") renderBinaryBitFlipper(document.getElementById("arcade-pane-bitflip"));
      });
    });

    // Update Hero CTA buttons to jump straight to Firewall Defender & Cable Patching
    const heroRpgBtn = document.getElementById("arcade-tab-rpg-btn");
    const heroSpdBtn = document.getElementById("arcade-tab-speed-btn");
    if (heroRpgBtn) {
      heroRpgBtn.textContent = "🛡️ Chơi Firewall Defender ngay";
      heroRpgBtn.onclick = () => tabsBar.querySelector('[data-atab="firewall"]')?.click();
    }
    if (heroSpdBtn) {
      heroSpdBtn.textContent = "🔌 Chơi Cắm Cáp Tủ Rack";
      heroSpdBtn.onclick = () => tabsBar.querySelector('[data-atab="cables"]')?.click();
    }

    // Launch Firewall Defender immediately!
    renderFirewallDefenderGame(document.getElementById("arcade-pane-firewall"));
  };

  window.renderFirewallDefenderGame = renderFirewallDefenderGame;
  window.renderCablePatchingGame = renderCablePatchingGame;
  window.renderBinaryBitFlipper = renderBinaryBitFlipper;
})();
