// ============================================================================
// CCNA NETWORK ACADEMY — GAMIFICATION, INCIDENT RPG, 60s SPEED ARCADE & PODCAST
// 1. XP, 6 Career Ranks (Intern -> Principal Architect), Badges & Confetti FX
// 2. 10 Real-World "Cứu Sự Cố Mạng" Incident RPG Missions
// 3. 60-Second CCNA Speed Arcade (Ports, OSI, Subnet/CLI) with Combo x2/x3/x5
// 4. Web Speech API Audio Podcast Mode (Vietnamese TTS Summary Reader)
// ============================================================================

(function () {
  "use strict";

  const RANKS = [
    { minXp: 0, title: "Thực tập sinh IT (Intern)", icon: "🎓" },
    { minXp: 150, title: "IT Helpdesk L1", icon: "🖥️" },
    { minXp: 400, title: "Junior Network Admin", icon: "🔌" },
    { minXp: 800, title: "Network Engineer (CCNA)", icon: "🛡️" },
    { minXp: 1400, title: "Senior Network Specialist", icon: "🌐" },
    { minXp: 2200, title: "Principal Network Architect", icon: "👑" }
  ];

  const BADGE_DEFS = [
    { id: "first_xp", icon: "🔥", name: "Khởi động", desc: "Nhận những điểm XP đầu tiên" },
    { id: "incident_hero", icon: "🚨", name: "Cứu hộ mạng", desc: "Giải quyết thành công 3 sự cố RPG" },
    { id: "combo_master", icon: "⚡", name: "Thần tốc x5", desc: "Đạt Combo x5 trong Đấu trường 60s" },
    { id: "podcast_fan", icon: "🎧", name: "Học bằng tai", desc: "Nghe giảng tóm tắt bằng Audio Podcast" },
    { id: "arcade_pro", icon: "🏆", name: "Cao thủ Arcade", desc: "Đạt >= 150 điểm trong 1 ván 60s" }
  ];

  const INCIDENT_MISSIONS = [
    {
      id: "inc-01",
      ticket: "INC-01 • KHẨN CẤP",
      title: "Sếp đang họp Zoom thì rớt mạng — PC hiện IP lạ 169.254.18.42!",
      symptom: "C:\\> ipconfig\nIPv4 Address. . . . . . . . . . : 169.254.18.42\nSubnet Mask . . . . . . . . . . : 255.255.0.0\nDefault Gateway . . . . . . . . : (trống)",
      options: [
        "Máy tính không xin được IP từ DHCP Server nên tự cấp địa chỉ APIPA → Kiểm tra dịch vụ DHCP / lệnh `ip helper-address` trên Router",
        "Card mạng bị cháy phần cứng → Thay ngay mainboard cho máy của Sếp",
        "Đổi cáp mạng từ chuẩn T568B sang cáp Console xanh ngọc",
        "Tắt tường lửa Windows Firewall để máy tự sinh ra Default Gateway"
      ],
      correct: 0,
      explain: "Dải `169.254.0.0/16` là **APIPA** — dấu hiệu kinh điển cho thấy máy tính gửi gói DHCP Discover nhưng **không có DHCP Server nào phản hồi** (hoặc thiếu `ip helper-address` khi DHCP nằm khác VLAN)."
    },
    {
      id: "inc-02",
      ticket: "INC-02 • HỆ THỐNG",
      title: "Phòng Kế toán (VLAN 10) ping được nhau nhưng không sang được Kỹ thuật (VLAN 20)",
      symptom: "SW1# show interfaces trunk\nPort   Mode   Encapsulation  Status    Vlans allowed on trunk\nGi0/1  on     802.1q         trunking  1,10",
      options: [
        "Cổng Trunk lên Router đang thiếu VLAN 20 → Bổ sung `switchport trunk allowed vlan add 20`",
        "Gán lại tất cả máy tính Phòng Kỹ thuật vào VLAN 1",
        "Cắm thêm 1 dây cáp nữa giữa PC1 và PC2",
        "Khởi động lại toàn bộ máy in trong công ty"
      ],
      correct: 0,
      explain: "Kết quả `show interfaces trunk` cho thấy đường Trunk lên Router chỉ cho phép VLAN `1,10` đi qua, chặn mất VLAN 20! Thêm VLAN 20 vào Allowed VLAN là Inter-VLAN thông ngay."
    },
    {
      id: "inc-03",
      ticket: "INC-03 • NGUY HIỂM",
      title: "Cắm thêm Switch mới vào tầng 2 thì cả mạng công ty đứng hình, đèn nháy điên cuồng!",
      symptom: "CPU Switch: 99% | Broadcast packets: 450,000/sec | Ping mất gói 90%",
      options: [
        "Xảy ra Broadcast Storm do vòng lặp Layer 2 (Loop) → Rút dây tạo vòng lặp, bật RSTP + BPDU Guard trên các cổng Access",
        "Do địa chỉ IPv6 xung đột với IPv4 → Tắt IPv6 trên tất cả PC",
        "Do tốc độ Wi-Fi 5GHz nhiễu sóng vào dây cáp đồng",
        "Cấu hình thêm Static Route `0.0.0.0 0.0.0.0` trên Switch Layer 2"
      ],
      correct: 0,
      explain: "Vòng lặp vật lý ở Layer 2 không có trường TTL như IP nên gói Broadcast nhân bản vô hạn gây **Broadcast Storm** làm treo toàn mạng. **STP/RSTP + BPDU Guard** là lá chắn bắt buộc!"
    },
    {
      id: "inc-04",
      ticket: "INC-04 • ĐỊNH TUYẾN",
      title: "Router R1 & R2 nối trực tiếp nhau nhưng `show ip ospf neighbor` trống trơn!",
      symptom: "R1 (Gi0/0): 10.0.0.1/30 — Area 0 — Hello 10s\nR2 (Gi0/0): 10.0.0.2/30 — Area 1 — Hello 10s",
      options: [
        "Hai Router đang khai báo lệch **OSPF Area ID** (Area 0 vs Area 1) → Đổi R2 về cùng `area 0`",
        "Đổi địa chỉ IP của R2 thành `10.0.0.1/30` cho giống hệt R1",
        "Bật `switchport mode trunk` trên cổng Router",
        "Xóa lệnh `no shutdown` trên cổng Gi0/0"
      ],
      correct: 0,
      explain: "Để 2 Router bắt tay thành OSPF Neighbor (`FULL`), bắt buộc phải khớp **Area ID**, **Subnet Mask**, **Hello/Dead Timer** và **Authentication**."
    },
    {
      id: "inc-05",
      ticket: "INC-05 • BẢO MẬT",
      title: "Nhân viên cắm laptop lạ vào ổ mạng văn phòng thì cổng Switch bị tắt cứng `err-disabled`!",
      symptom: "%PM-4-ERR_DISABLE: psecure-violation error detected on Fa0/5, putting Fa0/5 in err-disable state",
      options: [
        "Tính năng **Port Security** phát hiện MAC lạ vượt giới hạn nên tự khóa cổng → Gỡ thiết bị lạ rồi gõ `shutdown` sau đó `no shutdown`",
        "Cổng Fa0/5 đã hỏng vật lý → Phải mua Switch Cisco mới",
        "Đổi dây cáp thẳng sang cáp chéo (Crossover)",
        "Tăng băng thông cổng lên 10Gbps bằng lệnh `speed 10000`"
      ],
      correct: 0,
      explain: "Khi Port Security ở chế độ mặc định `shutdown` phát hiện vi phạm MAC, cổng sẽ rơi vào `err-disabled`. Muốn mở lại sau khi rút máy lạ: vào interface gõ `shutdown` rồi `no shutdown`."
    },
    {
      id: "inc-06",
      ticket: "INC-06 • INTERNET",
      title: "Router biên ping được Google `8.8.8.8`, nhưng toàn bộ PC nội bộ không ra được Internet!",
      symptom: "PC (192.168.10.15) -> R1-Edge (WAN: 203.0.113.2) -> ISP (8.8.8.8)\nR1# show ip nat translations  --> (trống)",
      options: [
        "Chưa cấu hình **NAT Overload (PAT)** dịch IP Private `192.168.10.x` sang IP Public WAN → Cấu hình `ip nat inside/outside` & `overload`",
        "Gán trực tiếp IP `8.8.8.8` cho tất cả các máy tính trong công ty",
        "Chặn cổng TCP 80 và 443 bằng Extended ACL",
        "Xóa Default Gateway trên tất cả PC"
      ],
      correct: 0,
      explain: "IP Private (`192.168.x.x`) không được định tuyến ngoài Internet công cộng. Router biên bắt buộc phải bật **PAT (NAT Overload)** để dịch sang IP Public của cổng WAN."
    },
    {
      id: "inc-07",
      ticket: "INC-07 • TƯỜNG LỬA ACL",
      title: "Cấu hình ACL chặn Telnet từ VLAN 30 tới Server xong thì... VLAN 30 mất sạch mạng luôn!",
      symptom: "access-list 101 deny tcp 192.168.30.0 0.0.0.255 host 10.1.1.10 eq 23\n(hết danh sách ACL)",
      options: [
        "Quên dòng `permit ip any any` ở cuối ACL nên bị luật ẩn **Implicit Deny Any** chặn sạch mọi lưu lượng khác!",
        "Do cổng Telnet là 22 chứ không phải 23",
        "Do Wildcard Mask của /24 phải là `255.255.255.0`",
        "Phải áp ACL lên cổng Console 0 của Router"
      ],
      correct: 0,
      explain: "Mọi Cisco ACL đều có 1 dòng ẩn **Implicit Deny Any** ở cuối cùng! Nếu bạn chỉ viết lệnh `deny` mà quên `permit ip any any`, toàn bộ lưu lượng còn lại đều bị chặn sạch."
    },
    {
      id: "inc-08",
      ticket: "INC-08 • DỊCH VỤ MẠNG",
      title: "Gõ `ping 8.8.8.8` thông 100%, nhưng mở Chrome vào `google.com` lại báo lỗi không tìm thấy trang!",
      symptom: "Ping 8.8.8.8: Reply from 8.8.8.8 time=12ms (0% loss)\nnslookup google.com: DNS request timed out",
      options: [
        "Lỗi phân giải tên miền **DNS (UDP/TCP Port 53)** → Kiểm tra địa chỉ DNS Server trên PC/DHCP Pool (`dns-server 8.8.8.8`)",
        "Đứt cáp quang biển đi quốc tế",
        "Sai Subnet Mask trên cổng LAN của Router",
        "Card mạng PC đang chạy chế độ Half-Duplex"
      ],
      correct: 0,
      explain: "Ping bằng IP thành công chứng tỏ Layer 1–3 và NAT/Routing đều thông suốt 100%. Chỉ không vào được bằng tên miền → 100% là lỗi **DNS (Port 53)**!"
    }
  ];

  const ARCADE_BANK = {
    ports: [
      { q: "Cổng mặc định của giao thức SSH (Remote bảo mật)?", opts: ["22", "23", "80", "443"], a: 0 },
      { q: "Cổng mặc định của Telnet (Remote không mã hóa)?", opts: ["21", "22", "23", "25"], a: 2 },
      { q: "Cổng mặc định của DNS (Phân giải tên miền)?", opts: ["53", "67", "69", "110"], a: 0 },
      { q: "Cổng mặc định của HTTPS (Web mã hóa TLS)?", opts: ["80", "443", "8080", "3389"], a: 1 },
      { q: "Cổng của DHCP Server & Client (UDP)?", opts: ["53 / 54", "67 / 68", "161 / 162", "20 / 21"], a: 1 },
      { q: "Cổng mặc định của HTTP?", opts: ["25", "80", "123", "443"], a: 1 },
      { q: "Cổng mặc định của SMTP (Gửi Email)?", opts: ["25", "110", "143", "514"], a: 0 },
      { q: "Cổng mặc định của NTP (Đồng bộ thời gian)?", opts: ["UDP 69", "UDP 123", "UDP 161", "UDP 514"], a: 1 },
      { q: "Cổng mặc định của Syslog (Ghi nhật ký hệ thống)?", opts: ["UDP 514", "TCP 22", "UDP 161", "TCP 3389"], a: 0 },
      { q: "Cổng mặc định của SNMP Polling?", opts: ["UDP 123", "UDP 161", "UDP 514", "TCP 443"], a: 1 },
      { q: "Cổng mặc định của TFTP (Truyền file IOS nhẹ, UDP)?", opts: ["21", "53", "69", "110"], a: 2 },
      { q: "Cổng mặc định của Remote Desktop (RDP Windows)?", opts: ["22", "445", "3389", "5900"], a: 2 }
    ],
    osi: [
      { q: "Thiết bị Switch Layer 2 hoạt động ở tầng nào của mô hình OSI?", opts: ["Tầng 1 (Physical)", "Tầng 2 (Data Link)", "Tầng 3 (Network)", "Tầng 4 (Transport)"], a: 1 },
      { q: "Router định tuyến gói tin dựa trên địa chỉ IP ở tầng nào?", opts: ["Tầng 2", "Tầng 3 (Network)", "Tầng 4", "Tầng 7"], a: 1 },
      { q: "Đơn vị dữ liệu (PDU) tại Tầng 2 (Data Link) gọi là gì?", opts: ["Bit", "Frame", "Packet", "Segment"], a: 1 },
      { q: "Đơn vị dữ liệu (PDU) tại Tầng 3 (Network) gọi là gì?", opts: ["Frame", "Packet", "Segment", "Data"], a: 1 },
      { q: "Giao thức TCP và UDP nằm ở tầng nào của OSI?", opts: ["Tầng 2", "Tầng 3", "Tầng 4 (Transport)", "Tầng 5"], a: 2 },
      { q: "Cáp UTP, cáp quang Fiber và Hub thuộc tầng nào?", opts: ["Tầng 1 (Physical)", "Tầng 2", "Tầng 3", "Tầng 4"], a: 0 },
      { q: "Địa chỉ MAC (48-bit Hex) hoạt động ở tầng nào?", opts: ["Tầng 1", "Tầng 2 (Data Link)", "Tầng 3", "Tầng 4"], a: 1 },
      { q: "Giao thức Ping (ICMP) thuộc tầng nào?", opts: ["Tầng 2", "Tầng 3 (Network)", "Tầng 4", "Tầng 7"], a: 1 },
      { q: "Chuẩn gắn thẻ VLAN IEEE 802.1Q hoạt động ở tầng nào?", opts: ["Tầng 1", "Tầng 2 (Data Link)", "Tầng 3", "Tầng 4"], a: 1 },
      { q: "HTTPS, DNS, DHCP, FTP thuộc tầng nào của OSI?", opts: ["Tầng 3", "Tầng 4", "Tầng 6", "Tầng 7 (Application)"], a: 3 }
    ],
    subnet: [
      { q: "Subnet Mask của `/24` là gì?", opts: ["255.255.255.0", "255.255.255.128", "255.255.255.192", "255.255.0.0"], a: 0 },
      { q: "Mạng `/30` (thường dùng cho WAN điểm-điểm) có bao nhiêu IP khả dụng cho host?", opts: ["2", "4", "6", "14"], a: 0 },
      { q: "Subnet Mask của `/26` là gì?", opts: ["255.255.255.128", "255.255.255.192", "255.255.255.224", "255.255.255.240"], a: 1 },
      { q: "Wildcard Mask của `/24` (`255.255.255.0`) là gì?", opts: ["0.0.0.255", "0.0.0.63", "0.0.255.255", "255.255.255.0"], a: 0 },
      { q: "Chỉ số Administrative Distance (AD) mặc định của OSPF là?", opts: ["1", "90", "110", "120"], a: 2 },
      { q: "Chỉ số Administrative Distance (AD) của Static Route là?", opts: ["0", "1", "90", "110"], a: 1 },
      { q: "Lệnh viết tắt chuẩn Cisco để bật cổng Router đang bị down?", opts: ["up", "no sh", "start", "enable port"], a: 1 },
      { q: "Lệnh xem nhanh IP và trạng thái UP/DOWN các cổng Router?", opts: ["sh ip int br", "sh vlan br", "sh mac", "sh ver"], a: 0 },
      { q: "Mạng `/27` có Magic Number (bước nhảy) là bao nhiêu?", opts: ["16", "32", "64", "128"], a: 1 },
      { q: "Lệnh lưu cấu hình từ RAM vào NVRAM nhanh nhất trên Cisco IOS?", opts: ["save", "wr", "commit", "flash"], a: 1 }
    ]
  };

  function getUid() {
    return typeof getActiveUserProfileId === "function" ? getActiveUserProfileId() : "default_user";
  }

  function getProfileKey() {
    return `ccna_gamify_${getUid()}`;
  }

  function loadGamifyProfile() {
    try {
      const p = JSON.parse(localStorage.getItem(getProfileKey()) || "{}");
      return {
        xp: Number(p.xp || 0),
        solvedMissions: Array.isArray(p.solvedMissions) ? p.solvedMissions : [],
        badges: Array.isArray(p.badges) ? p.badges : [],
        bestArcadeScore: Number(p.bestArcadeScore || 0),
        bestCombo: Number(p.bestCombo || 0)
      };
    } catch {
      return { xp: 0, solvedMissions: [], badges: [], bestArcadeScore: 0, bestCombo: 0 };
    }
  }

  function saveGamifyProfile(p) {
    try {
      localStorage.setItem(getProfileKey(), JSON.stringify(p));
    } catch {}
  }

  function getRankInfo(xp) {
    let current = RANKS[0];
    let next = RANKS[1] || null;
    for (let i = 0; i < RANKS.length; i++) {
      if (xp >= RANKS[i].minXp) {
        current = RANKS[i];
        next = RANKS[i + 1] || null;
      }
    }
    const pct = next
      ? Math.min(100, Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100))
      : 100;
    return { current, next, pct };
  }

  function showXpToast(msg, celebrate = false) {
    let toast = document.getElementById("ccna-xp-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "ccna-xp-toast";
      toast.className = "ccna-xp-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 2600);
    if (celebrate) triggerConfettiBurst();
  }

  function triggerConfettiBurst() {
    const colors = ["#f5c451", "#2563eb", "#10b981", "#f97316", "#ec4899"];
    const wrap = document.createElement("div");
    wrap.className = "ccna-confetti-layer";
    for (let i = 0; i < 28; i++) {
      const p = document.createElement("span");
      p.className = "confetti-piece";
      p.style.left = `${15 + Math.random() * 70}%`;
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = `${(Math.random() * 0.25).toFixed(2)}s`;
      p.style.transform = `rotate(${Math.round(Math.random() * 360)}deg)`;
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 1700);
  }

  function awardXp(amount, reason = "", badgeId = null) {
    const p = loadGamifyProfile();
    const oldRank = getRankInfo(p.xp).current.title;
    p.xp += amount;
    if (!p.badges.includes("first_xp")) p.badges.push("first_xp");
    if (badgeId && !p.badges.includes(badgeId)) p.badges.push(badgeId);
    saveGamifyProfile(p);

    const newRank = getRankInfo(p.xp).current;
    const rankedUp = newRank.title !== oldRank;
    if (rankedUp) {
      showXpToast(`🎉 THĂNG CHỨC: ${newRank.icon} ${newRank.title}! (+${amount} XP)`, true);
    } else if (amount > 0) {
      showXpToast(`✨ +${amount} XP${reason ? ` • ${reason}` : ""}`, amount >= 50);
    }
    return p;
  }

  // ==========================================================================
  // AUDIO PODCAST MODE (WEB SPEECH API — VIETNAMESE TTS SUMMARY READER)
  // ==========================================================================
  let isSpeaking = false;
  let podcastRate = 1.0;

  function stopPodcast() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    isSpeaking = false;
    document.querySelectorAll(".podcast-play-btn").forEach((b) => {
      b.textContent = "🎧 Nghe giảng (Podcast)";
      b.classList.remove("is-speaking");
    });
  }

  function playModulePodcast(modId) {
    if (!("speechSynthesis" in window)) {
      alert("Trình duyệt của bạn chưa hỗ trợ đọc giọng nói (Web Speech API).");
      return;
    }
    if (isSpeaking) {
      stopPodcast();
      return;
    }

    const mod = typeof modulesData !== "undefined" ? modulesData.find((m) => m.id === (modId || activeModuleId || 1)) : null;
    if (!mod) return;

    const clean = (s) => String(s || "").replace(/[*`#<>]/g, "").replace(/->/g, " dẫn đến ").trim();
    const concepts = (mod.keyConcepts_vi || []).slice(0, 4).map((c, idx) =>
      `Ý thứ ${idx + 1}: ${clean(c.term)}. ${clean(c.desc)}`
    ).join(". ");

    const script = `Chào mừng bạn đến với Podcast tóm tắt Học phần ${mod.id}: ${clean(mod.title_vi || mod.title)}. ${clean(mod.overview_vi)}. Sau đây là các khái niệm trọng tâm bạn cần nhớ. ${concepts}. Chúc bạn học thật tốt và nhớ làm 3 câu trắc nghiệm cuối bài để nhận điểm XP nhé!`;

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(script);
    utter.lang = "vi-VN";
    utter.rate = podcastRate;
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang && v.lang.toLowerCase().includes("vi"));
    if (viVoice) utter.voice = viVoice;

    utter.onstart = () => {
      isSpeaking = true;
      document.querySelectorAll(".podcast-play-btn").forEach((b) => {
        b.textContent = "⏹ Dừng nghe giảng";
        b.classList.add("is-speaking");
      });
    };
    utter.onend = () => {
      stopPodcast();
      awardXp(15, "Nghe hết Podcast tóm tắt", "podcast_fan");
    };
    utter.onerror = () => stopPodcast();

    window.speechSynthesis.speak(utter);
  }

  // Inject Podcast button automatically into Guided Bar of every Module
  function injectPodcastButtonIntoModule() {
    const row = document.querySelector("#guided-bar-wrap .guided-mode-row");
    if (!row || row.querySelector(".podcast-play-btn")) return;
    const wrap = document.createElement("div");
    wrap.style.cssText = "display:inline-flex;align-items:center;gap:0.35rem;";
    wrap.innerHTML = `
      <button type="button" class="ws-btn podcast-play-btn" title="Nghe web đọc tóm tắt bài học như Podcast">🎧 Nghe giảng (Podcast)</button>
      <button type="button" class="ws-btn" id="podcast-speed-btn" title="Đổi tốc độ đọc">1.0x</button>
    `;
    row.appendChild(wrap);
    wrap.querySelector(".podcast-play-btn").addEventListener("click", () => playModulePodcast(typeof activeModuleId !== "undefined" ? activeModuleId : 1));
    wrap.querySelector("#podcast-speed-btn").addEventListener("click", (e) => {
      const speeds = [0.9, 1.0, 1.25, 1.5];
      podcastRate = speeds[(speeds.indexOf(podcastRate) + 1) % speeds.length];
      e.currentTarget.textContent = `${podcastRate}x`;
    });
  }

  // ==========================================================================
  // DEDICATED PAGE: CCNA ARCADE & INCIDENT RPG HUB (#arcade)
  // ==========================================================================
  let arcadeTimer = null;

  function renderArcadeHubPage() {
    const container = document.getElementById("module-detail");
    if (!container) return;
    stopPodcast();
    clearInterval(arcadeTimer);

    const profile = loadGamifyProfile();
    const rank = getRankInfo(profile.xp);

    const badgesHtml = BADGE_DEFS.map((b) => {
      const unlocked = profile.badges.includes(b.id);
      return `
        <div class="arcade-badge-card ${unlocked ? "unlocked" : "locked"}" title="${b.desc}">
          <span class="ab-icon">${b.icon}</span>
          <div>
            <strong>${b.name}</strong>
            <div style="font-size:0.72rem;color:var(--text-muted);">${unlocked ? "Đã mở khóa" : b.desc}</div>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <div class="arcade-hub-page">
        <!-- Rank & XP Executive Card -->
        <section class="today-focus-hero">
          <div class="today-focus-left">
            <div class="today-streak-row">
              <span class="today-streak-badge">${rank.current.icon} ${rank.current.title}</span>
              <span class="today-eta-badge">⭐ ${profile.xp} XP</span>
              <span class="today-eta-badge">🚨 Đã cứu ${profile.solvedMissions.length}/${INCIDENT_MISSIONS.length} sự cố</span>
              <span class="today-eta-badge">⚡ Kỷ lục 60s: ${profile.bestArcadeScore} điểm</span>
            </div>
            <h2 class="today-focus-title">Đấu Trường Học-Mà-Chơi CCNA (RPG &amp; Speed Arcade)</h2>
            <p class="today-focus-sub">
              Chán đọc lý thuyết khô khan? Hãy <strong>nhập vai Kỹ sư Mạng cứu công ty khỏi sập mạng</strong> hoặc <strong>đấu tốc độ 60 giây</strong> đoán Port / OSI / Subnet để kiếm XP thăng chức!
            </p>
            <div class="xp-progress-track">
              <div class="xp-progress-fill" style="width:${rank.pct}%"></div>
            </div>
            <div style="font-size:0.74rem;color:#94a3b8;margin-top:0.35rem;">
              ${rank.next ? `Còn <strong>${rank.next.minXp - profile.xp} XP</strong> nữa để thăng chức lên <strong>${rank.next.icon} ${rank.next.title}</strong>` : "👑 Bạn đã đạt cấp bậc cao nhất: Principal Network Architect!"}
            </div>
          </div>
          <div class="today-focus-actions">
            <button type="button" class="ws-btn primary today-big-cta" id="arcade-tab-rpg-btn">🚨 Vào Game Cứu Sự Cố</button>
            <button type="button" class="ws-btn" id="arcade-tab-speed-btn">⚡ Chơi Đấu Trường 60s</button>
          </div>
        </section>

        <!-- Mode Switcher -->
        <div class="arcade-mode-tabs">
          <button type="button" class="toolkit-tab-btn active" data-atab="rpg">🚨 Nhiệm vụ Cứu Sự Cố Mạng (${INCIDENT_MISSIONS.length} vụ án)</button>
          <button type="button" class="toolkit-tab-btn" data-atab="speed">⚡ Đấu Trường Tốc Độ 60 Giây (Combo x5)</button>
          <button type="button" class="toolkit-tab-btn" data-atab="badges">🏅 Hồ Sơ Thăng Chức &amp; Huy Hiệu</button>
        </div>

        <!-- PANE 1: INCIDENT RPG -->
        <div class="arcade-pane active" id="arcade-pane-rpg">
          <div class="rpg-mission-selector" id="rpg-mission-selector"></div>
          <div class="rpg-stage-card" id="rpg-stage-card"></div>
        </div>

        <!-- PANE 2: 60s SPEED ARCADE -->
        <div class="arcade-pane" id="arcade-pane-speed">
          <div class="speed-stage-card" id="speed-stage-card"></div>
        </div>

        <!-- PANE 3: BADGES -->
        <div class="arcade-pane" id="arcade-pane-badges">
          <section class="section-block" style="padding:1rem;">
            <h3 style="margin-bottom:0.75rem;font-size:0.98rem;">🏅 Bộ Sưu Tập Huy Hiệu Kỹ Sư Mạng</h3>
            <div class="arcade-badges-grid">${badgesHtml}</div>
          </section>
        </div>
      </div>
    `;

    // Tab switching
    const switchTab = (tabName) => {
      clearInterval(arcadeTimer);
      container.querySelectorAll(".arcade-mode-tabs .toolkit-tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.atab === tabName));
      container.querySelectorAll(".arcade-pane").forEach((p) => p.classList.toggle("active", p.id === `arcade-pane-${tabName}`));
      if (tabName === "speed") renderSpeedLobby();
    };

    container.querySelectorAll(".arcade-mode-tabs .toolkit-tab-btn").forEach((b) => {
      b.addEventListener("click", () => switchTab(b.dataset.atab));
    });
    document.getElementById("arcade-tab-rpg-btn")?.addEventListener("click", () => switchTab("rpg"));
    document.getElementById("arcade-tab-speed-btn")?.addEventListener("click", () => switchTab("speed"));

    renderRpgMission(0);
    renderSpeedLobby();
  }

  function renderRpgMission(idx) {
    const selEl = document.getElementById("rpg-mission-selector");
    const stageEl = document.getElementById("rpg-stage-card");
    if (!selEl || !stageEl) return;

    const profile = loadGamifyProfile();
    selEl.innerHTML = INCIDENT_MISSIONS.map((m, i) => {
      const done = profile.solvedMissions.includes(m.id);
      return `<button type="button" class="rpg-pill ${i === idx ? "active" : ""} ${done ? "solved" : ""}" data-midx="${i}">${done ? "✅" : "🚨"} Vụ #${i + 1}</button>`;
    }).join("");

    selEl.querySelectorAll(".rpg-pill").forEach((b) => {
      b.addEventListener("click", () => renderRpgMission(Number(b.dataset.midx)));
    });

    const m = INCIDENT_MISSIONS[idx];
    const letters = ["A", "B", "C", "D"];
    stageEl.innerHTML = `
      <div class="rpg-ticket-head">
        <span class="rpg-ticket-badge">${m.ticket}</span>
        <span style="font-size:0.78rem;color:var(--text-muted);">Phần thưởng: <strong>+60 XP</strong></span>
      </div>
      <h3 class="rpg-ticket-title">${m.title}</h3>
      <pre class="cli-block" style="margin:0.75rem 0;"><code>${m.symptom}</code></pre>
      <div class="rpg-options-list">
        ${m.options.map((opt, i) => `
          <button type="button" class="rpg-opt-btn" data-opt="${i}">
            <span class="rpg-opt-letter">${letters[i]}</span>
            <span>${typeof formatRichText === "function" ? formatRichText(opt) : opt}</span>
          </button>
        `).join("")}
      </div>
      <div class="rpg-feedback-box" id="rpg-feedback-box" hidden></div>
    `;

    stageEl.querySelectorAll(".rpg-opt-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const chosen = Number(btn.dataset.opt);
        const fb = document.getElementById("rpg-feedback-box");
        const isCorrect = chosen === m.correct;

        stageEl.querySelectorAll(".rpg-opt-btn").forEach((b, i) => {
          b.disabled = true;
          if (i === m.correct) b.classList.add("correct");
          else if (i === chosen && !isCorrect) b.classList.add("wrong");
        });

        if (isCorrect) {
          const p = loadGamifyProfile();
          const firstTime = !p.solvedMissions.includes(m.id);
          if (firstTime) {
            p.solvedMissions.push(m.id);
            saveGamifyProfile(p);
            const badge = p.solvedMissions.length >= 3 ? "incident_hero" : null;
            awardXp(60, `Cứu thành công ${m.ticket}`, badge);
          } else {
            showXpToast("✅ Chính xác! Bạn đã làm chủ sự cố này rồi!", false);
          }
        }

        if (fb) {
          fb.hidden = false;
          fb.className = `rpg-feedback-box ${isCorrect ? "ok" : "err"}`;
          const nextIdx = (idx + 1) % INCIDENT_MISSIONS.length;
          fb.innerHTML = `
            <div><strong>${isCorrect ? "🎉 TUYỆT VỜI! BẠN ĐÃ CỨU MẠNG CÔNG TY THÀNH CÔNG!" : "⚠️ MẠNG VẪN SẬP! XEM NGAY NGUYÊN NHÂN:"}</strong></div>
            <p style="margin:0.4rem 0 0.7rem;">${typeof formatRichText === "function" ? formatRichText(m.explain) : m.explain}</p>
            <button type="button" class="ws-btn primary" id="rpg-next-mission-btn">🚨 Sang vụ sự cố tiếp theo (#${nextIdx + 1}) →</button>
          `;
          document.getElementById("rpg-next-mission-btn")?.addEventListener("click", () => renderRpgMission(nextIdx));
        }
      });
    });
  }

  function renderSpeedLobby() {
    const stage = document.getElementById("speed-stage-card");
    if (!stage) return;
    clearInterval(arcadeTimer);
    stage.innerHTML = `
      <div style="text-align:center;padding:1.2rem 0.5rem;">
        <h3 style="font-size:1.18rem;margin-bottom:0.4rem;">⚡ Đấu Trường Tốc Độ 60 Giây (CCNA Speed Arcade)</h3>
        <p style="font-size:0.86rem;color:var(--text-muted);max-width:540px;margin:0 auto 1.15rem;">
          Trả lời thật nhanh trong 60 giây! Đúng liên tiếp sẽ kích hoạt <strong>Combo x2, x3, x5 🔥</strong> giúp nhân điểm và kiếm XP cực nhanh.
        </p>
        <div class="speed-mode-grid">
          <button type="button" class="speed-mode-btn" data-smode="ports"><strong>🔌 Port &amp; Giao thức</strong><span>SSH, DNS, HTTPS, DHCP, SNMP...</span></button>
          <button type="button" class="speed-mode-btn" data-smode="osi"><strong>🧱 Mô hình OSI &amp; Thiết bị</strong><span>Frame, Packet, Switch, Router...</span></button>
          <button type="button" class="speed-mode-btn" data-smode="subnet"><strong>🧮 Subnet, AD &amp; Lệnh CLI</strong><span>/24, /30, Wildcard, OSPF AD...</span></button>
        </div>
      </div>
    `;
    stage.querySelectorAll(".speed-mode-btn").forEach((b) => {
      b.addEventListener("click", () => startSpeedRound(b.dataset.smode));
    });
  }

  function startSpeedRound(modeKey) {
    const stage = document.getElementById("speed-stage-card");
    if (!stage) return;
    const bank = [...(ARCADE_BANK[modeKey] || ARCADE_BANK.ports)];
    let timeLeft = 60;
    let score = 0;
    let combo = 0;
    let maxCombo = 0;
    let correctCount = 0;

    const pickQuestion = () => bank[Math.floor(Math.random() * bank.length)];

    const drawQuestion = () => {
      const q = pickQuestion();
      const mult = combo >= 5 ? 5 : combo >= 3 ? 3 : combo >= 2 ? 2 : 1;
      stage.innerHTML = `
        <div class="speed-hud">
          <span class="speed-hud-pill">⏱️ <strong id="spd-time">${timeLeft}s</strong></span>
          <span class="speed-hud-pill">🏆 Điểm: <strong>${score}</strong></span>
          <span class="speed-hud-pill combo">🔥 Combo: <strong>x${mult}</strong> (${combo} liên tiếp)</span>
        </div>
        <div class="speed-q-title">${q.q}</div>
        <div class="speed-opts-grid">
          ${q.opts.map((o, i) => `<button type="button" class="speed-opt-btn" data-oi="${i}">${o}</button>`).join("")}
        </div>
      `;

      stage.querySelectorAll(".speed-opt-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const picked = Number(btn.dataset.oi);
          if (picked === q.a) {
            combo++;
            if (combo > maxCombo) maxCombo = combo;
            correctCount++;
            const mNow = combo >= 5 ? 5 : combo >= 3 ? 3 : combo >= 2 ? 2 : 1;
            score += 10 * mNow;
            btn.classList.add("correct");
          } else {
            combo = 0;
            btn.classList.add("wrong");
          }
          setTimeout(() => {
            if (timeLeft > 0) drawQuestion();
          }, 180);
        });
      });
    };

    clearInterval(arcadeTimer);
    drawQuestion();

    arcadeTimer = setInterval(() => {
      timeLeft--;
      const tEl = document.getElementById("spd-time");
      if (tEl) tEl.textContent = `${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(arcadeTimer);
        const p = loadGamifyProfile();
        if (score > p.bestArcadeScore) p.bestArcadeScore = score;
        if (maxCombo > p.bestCombo) p.bestCombo = maxCombo;
        saveGamifyProfile(p);

        const xpEarned = Math.max(10, Math.round(score / 3));
        const badge = maxCombo >= 5 ? "combo_master" : score >= 150 ? "arcade_pro" : null;
        awardXp(xpEarned, `Đấu trường 60s (${score} điểm)`, badge);

        stage.innerHTML = `
          <div style="text-align:center;padding:1.5rem 0.5rem;">
            <div style="font-size:2rem;margin-bottom:0.4rem;">🏁</div>
            <h3 style="margin-bottom:0.4rem;">Hết giờ! Bạn ghi được <span style="color:var(--exec-blue);">${score} điểm</span></h3>
            <p style="font-size:0.86rem;color:var(--text-muted);margin-bottom:1rem;">
              Trả lời đúng <strong>${correctCount} câu</strong> • Combo cao nhất: <strong>x${maxCombo}</strong> • Nhận thưởng <strong>+${xpEarned} XP</strong>!
            </p>
            <div style="display:flex;gap:0.55rem;justify-content:center;flex-wrap:wrap;">
              <button type="button" class="ws-btn primary" id="spd-replay-btn">⚡ Chơi lại ngay</button>
              <button type="button" class="ws-btn" id="spd-lobby-btn">Đổi chủ đề khác</button>
            </div>
          </div>
        `;
        document.getElementById("spd-replay-btn")?.addEventListener("click", () => startSpeedRound(modeKey));
        document.getElementById("spd-lobby-btn")?.addEventListener("click", renderSpeedLobby);
      }
    }, 1000);
  }

  // Observe module-detail to inject Podcast button into Guided Bar
  function initGamificationObserver() {
    const detail = document.getElementById("module-detail");
    if (!detail) return;
    injectPodcastButtonIntoModule();
    const obs = new MutationObserver(() => injectPodcastButtonIntoModule());
    obs.observe(detail, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGamificationObserver);
  } else {
    initGamificationObserver();
  }

  window.renderArcadeHubPage = renderArcadeHubPage;
  window.awardCcnaXp = awardXp;
  window.loadGamifyProfile = loadGamifyProfile;
  window.getCcnaRankInfo = getRankInfo;
  window.playModulePodcast = playModulePodcast;
})();
