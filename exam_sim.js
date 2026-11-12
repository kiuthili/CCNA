// ==========================================================================
// CCNA LEARNING — EXAM SIMULATOR, CLI CHEAT SHEET & CRAM TABLES
// Module hỗ trợ thi đỗ CCNA 200-301 (v1.1 & v2.0) 100% & Đi làm thực tế
// ==========================================================================

// --------------------------------------------------------------------------
// 1. DATA: BỘ TRA CỨU LỆNH CISCO IOS & BẢNG GHI NHỚ THẦN TỐC (CHEAT SHEET)
// --------------------------------------------------------------------------
const CCNA_CHEAT_SHEET_DATA = [
  // --- A. CẤU HÌNH CĂN BẢN & BẢO MẬT QUẢN TRỊ ---
  {
    category: "basic",
    categoryName: "Căn Bản & Quản Trị",
    cmd: "enable / disable",
    desc: "Chuyển đổi giữa chế độ User EXEC (dấu >) và Privileged EXEC (dấu #).",
    mode: "Router> hoặc Switch>"
  },
  {
    category: "basic",
    categoryName: "Căn Bản & Quản Trị",
    cmd: "configure terminal (conf t)",
    desc: "Vào chế độ cấu hình toàn cục (Global Configuration Mode).",
    mode: "Router#"
  },
  {
    category: "basic",
    categoryName: "Căn Bản & Quản Trị",
    cmd: "hostname <NAME>",
    desc: "Đặt tên định danh cho thiết bị Router hoặc Switch.",
    mode: "Router(config)#"
  },
  {
    category: "basic",
    categoryName: "Căn Bản & Quản Trị",
    cmd: "enable secret <PASSWORD>",
    desc: "Đặt mật khẩu mã hóa một chiều (MD5/SHA-256) bảo vệ chế độ Privileged EXEC.",
    mode: "Router(config)#"
  },
  {
    category: "basic",
    categoryName: "Căn Bản & Quản Trị",
    cmd: "service password-encryption",
    desc: "Mã hóa tất cả mật khẩu văn bản thường hiển thị trong file cấu hình (Type 7).",
    mode: "Router(config)#"
  },
  {
    category: "basic",
    categoryName: "Căn Bản & Quản Trị",
    cmd: "banner motd #<THÔNG ĐIỆP>#",
    desc: "Hiển thị cảnh báo pháp lý khi người dùng kết nối vào thiết bị.",
    mode: "Router(config)#"
  },
  {
    category: "basic",
    categoryName: "Căn Bản & Quản Trị",
    cmd: "line console 0\n password <PASS>\n login\n logging synchronous\n exec-timeout 5 0",
    desc: "Bảo vệ cổng Console vật lý, chống ngắt dòng gõ lệnh và tự ngắt phiên sau 5 phút.",
    mode: "Router(config-line)#"
  },
  {
    category: "basic",
    categoryName: "Căn Bản & Quản Trị",
    cmd: "ip domain-name cisco.local\ncrypto key generate rsa modulus 2048\nip ssh version 2\nline vty 0 4\n transport input ssh\n login local",
    desc: "Kích hoạt điều khiển từ xa bảo mật SSHv2 (thay thế Telnet hoàn toàn).",
    mode: "Router(config)#"
  },
  {
    category: "basic",
    categoryName: "Căn Bản & Quản Trị",
    cmd: "copy running-config startup-config (write memory / wr)",
    desc: "Lưu toàn bộ cấu hình đang chạy trong RAM sang bộ nhớ cố định NVRAM.",
    mode: "Router#"
  },

  // --- B. CHUYỂN MẠCH TẦNG 2 (SWITCHING, VLAN, STP, ETHERCHANNEL) ---
  {
    category: "switching",
    categoryName: "Chuyển Mạch Tầng 2",
    cmd: "vlan <1-4094>\n name <TEN_VLAN>",
    desc: "Tạo VLAN và gán tên mô tả cho vùng broadcast.",
    mode: "Switch(config)#"
  },
  {
    category: "switching",
    categoryName: "Chuyển Mạch Tầng 2",
    cmd: "interface <INTERFACE>\n switchport mode access\n switchport access vlan <VLAN_ID>",
    desc: "Gán cổng Switch vào một VLAN dữ liệu người dùng cụ thể.",
    mode: "Switch(config-if)#"
  },
  {
    category: "switching",
    categoryName: "Chuyển Mạch Tầng 2",
    cmd: "switchport voice vlan <VOICE_VLAN_ID>",
    desc: "Cấu hình Voice VLAN cho điện thoại VoIP, cho phép PC nối tiếp qua cổng IP Phone.",
    mode: "Switch(config-if)#"
  },
  {
    category: "switching",
    categoryName: "Chuyển Mạch Tầng 2",
    cmd: "switchport mode trunk\nswitchport trunk allowed vlan <VLAN_LIST>\nswitchport trunk native vlan <NATIVE_ID>",
    desc: "Ép cổng làm Trunk 802.1Q, lọc danh sách VLAN cho phép và đổi Native VLAN (chống tấn công VLAN Hopping).",
    mode: "Switch(config-if)#"
  },
  {
    category: "switching",
    categoryName: "Chuyển Mạch Tầng 2",
    cmd: "switchport nonegotiate",
    desc: "Tắt giao thức tự động đàm phán Trunk DTP (bắt buộc trong môi trường an ninh).",
    mode: "Switch(config-if)#"
  },
  {
    category: "switching",
    categoryName: "Chuyển Mạch Tầng 2",
    cmd: "spanning-tree mode rapid-pvst",
    desc: "Bật chế độ Rapid Spanning Tree 802.1w (hội tụ dưới 2 giây thay vì 30-50s của 802.1D).",
    mode: "Switch(config)#"
  },
  {
    category: "switching",
    categoryName: "Chuyển Mạch Tầng 2",
    cmd: "spanning-tree vlan <VLAN_ID> root primary / priority 4096",
    desc: "Ép Switch trở thành Root Bridge cho VLAN chỉ định bằng cách giảm Priority.",
    mode: "Switch(config)#"
  },
  {
    category: "switching",
    categoryName: "Chuyển Mạch Tầng 2",
    cmd: "spanning-tree portfast\nspanning-tree bpduguard enable",
    desc: "Bật PortFast trên cổng cắm PC để bỏ qua nghe/học vào thẳng Forwarding; nếu có switch lạ cắm vào gửi BPDU sẽ lập tức khóa cổng (err-disabled).",
    mode: "Switch(config-if)#"
  },
  {
    category: "switching",
    categoryName: "Chuyển Mạch Tầng 2",
    cmd: "interface range g0/1 - 2\n channel-group 1 mode active",
    desc: "Bó 2 cổng thành 1 EtherChannel theo chuẩn mở quốc tế LACP (active / passive).",
    mode: "Switch(config-if-range)#"
  },
  {
    category: "switching",
    categoryName: "Chuyển Mạch Tầng 2",
    cmd: "interface range g0/1 - 2\n channel-group 1 mode desirable",
    desc: "Bó cổng EtherChannel theo chuẩn độc quyền Cisco PAgP (desirable / auto).",
    mode: "Switch(config-if-range)#"
  },

  // --- C. ĐỊNH TUYẾN TẦNG 3 (ROUTING, OSPF, SVI, ROAS) ---
  {
    category: "routing",
    categoryName: "Định Tuyến Tầng 3",
    cmd: "ip routing",
    desc: "Kích hoạt tính năng định tuyến trên Switch Layer 3 (Multilayer Switch).",
    mode: "Switch(config)#"
  },
  {
    category: "routing",
    categoryName: "Định Tuyến Tầng 3",
    cmd: "interface vlan <ID>\n ip address <IP> <MASK>\n no shutdown",
    desc: "Tạo cổng ảo SVI (Switch Virtual Interface) làm Default Gateway cho VLAN.",
    mode: "Switch(config-if)#"
  },
  {
    category: "routing",
    categoryName: "Định Tuyến Tầng 3",
    cmd: "interface g0/0/0.<VLAN>\n encapsulation dot1Q <VLAN>\n ip address <IP> <MASK>",
    desc: "Cấu hình định tuyến Router-on-a-Stick trên sub-interface của Router.",
    mode: "Router(config-subif)#"
  },
  {
    category: "routing",
    categoryName: "Định Tuyến Tầng 3",
    cmd: "ip route 0.0.0.0 0.0.0.0 <NEXT_HOP_IP>",
    desc: "Cấu hình Default Route (tuyến mặc định hướng ra Internet hoặc ISP).",
    mode: "Router(config)#"
  },
  {
    category: "routing",
    categoryName: "Định Tuyến Tầng 3",
    cmd: "ip route <DEST_NETWORK> <MASK> <NEXT_HOP> [AD]",
    desc: "Cấu hình Static Route tĩnh (nếu thêm AD ví dụ 10 thì thành Floating Static Route dự phòng).",
    mode: "Router(config)#"
  },
  {
    category: "routing",
    categoryName: "Định Tuyến Tầng 3",
    cmd: "router ospf 1\n router-id 1.1.1.1\n network <NET> <WILDCARD> area 0\n passive-interface g0/0/1",
    desc: "Cấu hình giao thức OSPFv2, thiết lập Router-ID thủ công và tắt gửi Hello ra cổng cắm máy tính người dùng.",
    mode: "Router(config-router)#"
  },
  {
    category: "routing",
    categoryName: "Định Tuyến Tầng 3",
    cmd: "default-information originate",
    desc: "Quảng bá Default Route vào mạng OSPF cho toàn bộ các Router khác.",
    mode: "Router(config-router)#"
  },
  {
    category: "routing",
    categoryName: "Định Tuyến Tầng 3",
    cmd: "standby 1 ip <VIRTUAL_GW_IP>\nstandby 1 priority 110\nstandby 1 preempt",
    desc: "Cấu hình dự phòng cổng ngầm HSRP với độ ưu tiên cao hơn và cướp quyền khi phục hồi.",
    mode: "Router(config-if)#"
  },

  // --- D. DỊCH VỤ MẠNG & AN NINH (NAT, DHCP, ACL, PORT-SECURITY) ---
  {
    category: "security",
    categoryName: "An Ninh & Dịch Vụ IP",
    cmd: "ip dhcp pool <TEN_POOL>\n network <NET> <MASK>\n default-router <GW_IP>\n dns-server <DNS_IP>",
    desc: "Cấu hình DHCP Server cấp phát địa chỉ IP, Gateway và DNS tự động.",
    mode: "Router(config)#"
  },
  {
    category: "security",
    categoryName: "An Ninh & Dịch Vụ IP",
    cmd: "ip helper-address <DHCP_SERVER_IP>",
    desc: "DHCP Relay Agent: chuyển đổi gói tin DHCP Broadcast thành Unicast vượt qua Router.",
    mode: "Router(config-if)#"
  },
  {
    category: "security",
    categoryName: "An Ninh & Dịch Vụ IP",
    cmd: "access-list 1 permit 192.168.1.0 0.0.0.255\nip nat inside source list 1 interface g0/0/0 overload",
    desc: "Cấu hình PAT (Port Address Translation / NAT Overload) chia sẻ 1 IP Public cho toàn bộ mạng LAN.",
    mode: "Router(config)#"
  },
  {
    category: "security",
    categoryName: "An Ninh & Dịch Vụ IP",
    cmd: "ip nat inside source static <IP_PRIVATE> <IP_PUBLIC>",
    desc: "Cấu hình Static NAT tĩnh 1-1 để mở cổng Web / Mail Server ra Internet.",
    mode: "Router(config)#"
  },
  {
    category: "security",
    categoryName: "An Ninh & Dịch Vụ IP",
    cmd: "switchport port-security\nswitchport port-security maximum 2\nswitchport port-security mac-address sticky\nswitchport port-security violation shutdown",
    desc: "Bật Port Security: học tự động 2 địa chỉ MAC (sticky), khóa sập cổng nếu có thiết bị lạ cắm vào.",
    mode: "Switch(config-if)#"
  },
  {
    category: "security",
    categoryName: "An Ninh & Dịch Vụ IP",
    cmd: "ip dhcp snooping\nip dhcp snooping vlan 10,20\ninterface g0/0/1\n ip dhcp snooping trust",
    desc: "Chống tấn công Rogue DHCP Server bằng DHCP Snooping (chỉ tin tưởng cổng Uplink nối lên Server).",
    mode: "Switch(config)#"
  },
  {
    category: "security",
    categoryName: "An Ninh & Dịch Vụ IP",
    cmd: "access-list 101 permit tcp 192.168.1.0 0.0.0.255 any eq 80\naccess-list 101 deny ip any any",
    desc: "Extended ACL (số 100-199): Lọc lưu lượng theo IP nguồn, IP đích, giao thức (TCP/UDP) và cổng Port.",
    mode: "Router(config)#"
  },
  {
    category: "security",
    categoryName: "An Ninh & Dịch Vụ IP",
    cmd: "ntp server <IP_SERVER>",
    desc: "Đồng bộ thời gian chuẩn NTP để ghi chép log hệ thống chuẩn xác.",
    mode: "Router(config)#"
  },

  // --- E. CÁC CÂU LỆNH KIỂM TRA & TROUBLESHOOTING (SHOW COMMANDS) ---
  {
    category: "troubleshoot",
    categoryName: "Kiểm Tra & Xử Lý Sự Cố",
    cmd: "show ip interface brief",
    desc: "Kiểm tra nhanh IP và trạng thái Up/Down của tất cả các cổng trên thiết bị.",
    mode: "Router# / Switch#"
  },
  {
    category: "troubleshoot",
    categoryName: "Kiểm Tra & Xử Lý Sự Cố",
    cmd: "show ip route",
    desc: "Xem bảng định tuyến của Router (kiểm tra mã C, S, O, D, *).",
    mode: "Router#"
  },
  {
    category: "troubleshoot",
    categoryName: "Kiểm Tra & Xử Lý Sự Cố",
    cmd: "show vlan brief",
    desc: "Kiểm tra danh sách VLAN và các cổng đang được gán vào từng VLAN.",
    mode: "Switch#"
  },
  {
    category: "troubleshoot",
    categoryName: "Kiểm Tra & Xử Lý Sự Cố",
    cmd: "show interfaces trunk",
    desc: "Xem các cổng đang làm đường Trunk, Native VLAN và danh sách VLAN được cho phép.",
    mode: "Switch#"
  },
  {
    category: "troubleshoot",
    categoryName: "Kiểm Tra & Xử Lý Sự Cố",
    cmd: "show spanning-tree",
    desc: "Xem cây Spanning Tree, ai là Root Bridge, trạng thái cổng (RP, DP, ALT/BLK).",
    mode: "Switch#"
  },
  {
    category: "troubleshoot",
    categoryName: "Kiểm Tra & Xử Lý Sự Cố",
    cmd: "show etherchannel summary",
    desc: "Kiểm tra trạng thái Port-channel (cờ SU = Layer 2 Up, RU = Layer 3 Up, P = Bundled).",
    mode: "Switch#"
  },
  {
    category: "troubleshoot",
    categoryName: "Kiểm Tra & Xử Lý Sự Cố",
    cmd: "show ip ospf neighbor",
    desc: "Kiểm tra quan hệ láng giềng OSPF (trạng thái FULL/DR, FULL/BDR hoặc FULL/DROTHER).",
    mode: "Router#"
  },
  {
    category: "troubleshoot",
    categoryName: "Kiểm Tra & Xử Lý Sự Cố",
    cmd: "show ip nat translations",
    desc: "Xem bảng ánh xạ địa chỉ IP Private ra IP Public và số cổng Port đang hoạt động.",
    mode: "Router#"
  },
  {
    category: "troubleshoot",
    categoryName: "Kiểm Tra & Xử Lý Sự Cố",
    cmd: "show mac address-table",
    desc: "Xem bảng địa chỉ MAC của Switch (MAC học được trên cổng nào, VLAN nào).",
    mode: "Switch#"
  },
  {
    category: "troubleshoot",
    categoryName: "Kiểm Tra & Xử Lý Sự Cố",
    cmd: "show cdp neighbors detail / show lldp neighbors detail",
    desc: "Khám phá thông tin chi tiết thiết bị láng giềng cắm trực tiếp (IP, model, cổng đối diện).",
    mode: "Router# / Switch#"
  }
];

// --------------------------------------------------------------------------
// 2. BẢNG GHI NHỚ THẦN TỐC (GOLDEN CRAM TABLES CHO KỲ THI CCNA)
// --------------------------------------------------------------------------
const CCNA_CRAM_TABLES = {
  ad: [
    { route: "Connected (Nối trực tiếp)", ad: 0 },
    { route: "Static Route (Tuyến tĩnh)", ad: 1 },
    { route: "eBGP (BGP đối ngoại)", ad: 20 },
    { route: "EIGRP Internal", ad: 90 },
    { route: "OSPF", ad: 110 },
    { route: "IS-IS", ad: 115 },
    { route: "RIP", ad: 120 },
    { route: "EIGRP External", ad: 170 },
    { route: "iBGP (BGP nội bộ)", ad: 200 },
    { route: "Unreachable (Không thể tới)", ad: 255 }
  ],
  ports: [
    { port: "FTP", num: "TCP 20 (Data), TCP 21 (Control)" },
    { port: "SSH", num: "TCP 22" },
    { port: "Telnet", num: "TCP 23" },
    { port: "SMTP", num: "TCP 25" },
    { port: "DNS", num: "UDP/TCP 53" },
    { port: "DHCP", num: "UDP 67 (Server), UDP 68 (Client)" },
    { port: "TFTP", num: "UDP 69" },
    { port: "HTTP", num: "TCP 80" },
    { port: "NTP", num: "UDP 123" },
    { port: "SNMP", num: "UDP 161 (Agent), UDP 162 (Trap)" },
    { port: "HTTPS", num: "TCP 443" },
    { port: "Syslog", num: "UDP 514" }
  ],
  syslog: [
    { level: 0, name: "Emergency", desc: "Hệ thống sập hoàn toàn không thể sử dụng" },
    { level: 1, name: "Alert", desc: "Cần hành động can thiệp khẩn cấp ngay lập tức" },
    { level: 2, name: "Critical", desc: "Tình trạng nguy kịch (hỏng phần cứng)" },
    { level: 3, name: "Error", desc: "Lỗi vận hành hệ thống" },
    { level: 4, name: "Warning", desc: "Cảnh báo sự cố tiềm tàng" },
    { level: 5, name: "Notice", desc: "Sự kiện bình thường nhưng đáng chú ý (UP/DOWN interface)" },
    { level: 6, name: "Informational", desc: "Thông tin hoạt động thông thường" },
    { level: 7, name: "Debugging", desc: "Thông tin gỡ lỗi chi tiết (tiêu tốn CPU)" }
  ],
  multicast: [
    { ip: "224.0.0.1", usage: "Tất cả các host trong mạng LAN (All hosts)" },
    { ip: "224.0.0.2", usage: "Tất cả các Router trong mạng LAN (All routers)" },
    { ip: "224.0.0.5", usage: "OSPF: Tất cả Router OSPF (All OSPF Routers)" },
    { ip: "224.0.0.6", usage: "OSPF: Dành riêng cho DR và BDR" },
    { ip: "224.0.0.9", usage: "RIPv2" },
    { ip: "224.0.0.10", usage: "EIGRP" },
    { ip: "01:80:C2:00:00:00", usage: "Địa chỉ MAC Multicast của gói tin STP BPDU" }
  ]
};

// --------------------------------------------------------------------------
// 3. MOCK EXAM SYSTEM (MÔ PHỎNG THI THỬ THỜI GIAN THỰC PEARSON VUE)
// --------------------------------------------------------------------------
let mockExamQuestions = [];
let mockExamUserAnswers = {};
let mockExamFlagged = {};
let mockExamCurrentIndex = 0;
let mockExamTimerInterval = null;
let mockExamSecondsLeft = 0;
let mockExamIsRunning = false;

function buildMockExamPool() {
  const isEn = typeof currentLang !== "undefined" && currentLang === "en";
  const pool = [];

  // Lấy câu hỏi từ 17 modules
  if (typeof modulesData !== "undefined" && Array.isArray(modulesData)) {
    modulesData.forEach((mod) => {
      const qList = (isEn && typeof CCNA_QUIZ_EN !== "undefined" && CCNA_QUIZ_EN[mod.id])
        ? CCNA_QUIZ_EN[mod.id]
        : (mod.quiz || []);

      qList.forEach((q, idx) => {
        pool.push({
          id: `mod-${mod.id}-q-${idx}`,
          domain: getDomainForModule(mod.id),
          modId: mod.id,
          question: isEn ? (q.question_en || q.question_vi) : q.question_vi,
          options: isEn ? (q.options_en || q.options_vi) : q.options_vi,
          answerIndex: q.answerIndex,
          explanation: isEn ? (q.explanation_en || q.explanation_vi) : q.explanation_vi
        });
      });
    });
  }

  return pool;
}

function getDomainForModule(modId) {
  if (modId <= 4) return "1.0 Network Fundamentals";
  if (modId <= 6) return "2.0 Network Access (VLAN / STP / EtherChannel)";
  if (modId <= 9) return "3.0 IP Connectivity (Routing & OSPF)";
  if (modId <= 11) return "4.0 IP Services (NAT / DHCP / QoS)";
  if (modId <= 14) return "5.0 Security Fundamentals";
  return "6.0 Automation and Programmability";
}

function startMockExam(questionCount = 30) {
  const allPool = buildMockExamPool();
  if (allPool.length === 0) {
    alert("Dữ liệu câu hỏi đang được nạp, vui lòng thử lại sau vài giây.");
    return;
  }

  // Shuffle pool
  const shuffled = [...allPool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  mockExamQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length));
  mockExamUserAnswers = {};
  mockExamFlagged = {};
  mockExamCurrentIndex = 0;
  mockExamIsRunning = true;

  // Thời gian thi: 30 câu = 40 phút, 60 câu = 75 phút, 100 câu = 120 phút
  const minutes = questionCount <= 15 ? 20 : questionCount <= 30 ? 40 : questionCount <= 60 ? 75 : 120;
  mockExamSecondsLeft = minutes * 60;

  clearInterval(mockExamTimerInterval);
  mockExamTimerInterval = setInterval(() => {
    mockExamSecondsLeft--;
    updateMockExamTimerDisplay();
    if (mockExamSecondsLeft <= 0) {
      clearInterval(mockExamTimerInterval);
      finishMockExam(true);
    }
  }, 1000);

  renderMockExamQuestion();
  renderMockExamNavigator();
  updateMockExamTimerDisplay();

  const modal = document.getElementById("mock-exam-modal");
  if (modal) {
    modal.hidden = false;
    modal.classList.add("in-exam");
    modal.classList.remove("in-result");
  }
}

function updateMockExamTimerDisplay() {
  const timerEl = document.getElementById("exam-timer-display");
  if (!timerEl) return;
  const m = Math.floor(mockExamSecondsLeft / 60);
  const s = mockExamSecondsLeft % 60;
  timerEl.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  if (mockExamSecondsLeft < 300) {
    timerEl.classList.add("warning");
  } else {
    timerEl.classList.remove("warning");
  }
}

function renderMockExamQuestion() {
  if (mockExamQuestions.length === 0) return;
  const q = mockExamQuestions[mockExamCurrentIndex];
  const isEn = typeof currentLang !== "undefined" && currentLang === "en";

  const numEl = document.getElementById("exam-q-num");
  const domainEl = document.getElementById("exam-q-domain");
  const textEl = document.getElementById("exam-q-text");
  const optionsEl = document.getElementById("exam-q-options");
  const flagBtn = document.getElementById("exam-flag-btn");
  const prevBtn = document.getElementById("exam-prev-btn");
  const nextBtn = document.getElementById("exam-next-btn");

  if (numEl) numEl.textContent = `${isEn ? "Question" : "Câu hỏi"} ${mockExamCurrentIndex + 1} / ${mockExamQuestions.length}`;
  if (domainEl) domainEl.textContent = q.domain;
  if (textEl) textEl.innerHTML = formatExamRichText(q.question);

  if (flagBtn) {
    const isFlagged = !!mockExamFlagged[mockExamCurrentIndex];
    flagBtn.classList.toggle("flagged", isFlagged);
    flagBtn.innerHTML = isFlagged
      ? `⚑ ${isEn ? "Flagged for review" : "Đã gắn cờ xem lại"}`
      : `⚐ ${isEn ? "Flag question" : "Gắn cờ xem lại"}`;
  }

  if (prevBtn) prevBtn.disabled = mockExamCurrentIndex === 0;
  if (nextBtn) {
    const isLast = mockExamCurrentIndex === mockExamQuestions.length - 1;
    nextBtn.textContent = isLast ? (isEn ? "Review & Submit" : "Xem lại & Nộp bài") : (isEn ? "Next &rarr;" : "Câu tiếp &rarr;");
  }

  if (optionsEl) {
    const selectedIdx = mockExamUserAnswers[mockExamCurrentIndex];
    optionsEl.innerHTML = q.options
      .map((opt, idx) => {
        const letter = String.fromCharCode(65 + idx);
        const isChecked = selectedIdx === idx;
        return `
          <label class="exam-opt-item ${isChecked ? "selected" : ""}" data-idx="${idx}">
            <input type="radio" name="mock-exam-ans" value="${idx}" ${isChecked ? "checked" : ""} />
            <span class="exam-opt-letter">${letter}</span>
            <span class="exam-opt-text">${formatExamRichText(opt)}</span>
          </label>
        `;
      })
      .join("");

    optionsEl.querySelectorAll(".exam-opt-item").forEach((el) => {
      el.addEventListener("click", () => {
        const idx = Number(el.dataset.idx);
        mockExamUserAnswers[mockExamCurrentIndex] = idx;
        optionsEl.querySelectorAll(".exam-opt-item").forEach((item, i) => {
          item.classList.toggle("selected", i === idx);
          const radio = item.querySelector("input");
          if (radio) radio.checked = i === idx;
        });
        renderMockExamNavigator();
      });
    });
  }
}

function renderMockExamNavigator() {
  const gridEl = document.getElementById("exam-nav-grid");
  if (!gridEl) return;
  gridEl.innerHTML = mockExamQuestions
    .map((_, idx) => {
      const isCurrent = idx === mockExamCurrentIndex;
      const isAnswered = typeof mockExamUserAnswers[idx] === "number";
      const isFlagged = !!mockExamFlagged[idx];
      let cls = "exam-nav-dot";
      if (isCurrent) cls += " current";
      if (isAnswered) cls += " answered";
      if (isFlagged) cls += " flagged";
      return `<button type="button" class="${cls}" data-idx="${idx}">${idx + 1}</button>`;
    })
    .join("");

  gridEl.querySelectorAll(".exam-nav-dot").forEach((btn) => {
    btn.addEventListener("click", () => {
      mockExamCurrentIndex = Number(btn.dataset.idx);
      renderMockExamQuestion();
      renderMockExamNavigator();
    });
  });
}

function finishMockExam(isTimeOut = false) {
  clearInterval(mockExamTimerInterval);
  mockExamIsRunning = false;

  const isEn = typeof currentLang !== "undefined" && currentLang === "en";
  let correctCount = 0;
  const domainStats = {};

  mockExamQuestions.forEach((q, idx) => {
    if (!domainStats[q.domain]) {
      domainStats[q.domain] = { total: 0, correct: 0 };
    }
    domainStats[q.domain].total++;

    const userAns = mockExamUserAnswers[idx];
    if (userAns === q.answerIndex) {
      correctCount++;
      domainStats[q.domain].correct++;
    }
  });

  const total = mockExamQuestions.length;
  // CCNA Score calculation (scale 300 to 1000)
  const score = total > 0 ? Math.round(300 + (correctCount / total) * 700) : 300;
  const isPass = score >= 825; // 825/1000 is Cisco CCNA passing score

  const modal = document.getElementById("mock-exam-modal");
  if (modal) {
    modal.classList.remove("in-exam");
    modal.classList.add("in-result");
  }

  const resultContainer = document.getElementById("mock-exam-result-view");
  if (resultContainer) {
    const domainRowsHtml = Object.keys(domainStats)
      .map((d) => {
        const item = domainStats[d];
        const pct = Math.round((item.correct / item.total) * 100);
        return `
          <div class="exam-domain-row">
            <div class="exam-domain-meta">
              <span class="exam-domain-name">${escapeHtml(d)}</span>
              <span class="exam-domain-score">${item.correct}/${item.total} (${pct}%)</span>
            </div>
            <div class="exam-domain-bar-bg">
              <div class="exam-domain-bar-fill" style="width: ${pct}%; background: ${pct >= 80 ? "#22c55e" : pct >= 60 ? "#eab308" : "#ef4444"};"></div>
            </div>
          </div>
        `;
      })
      .join("");

    const reviewQuestionsHtml = mockExamQuestions
      .map((q, idx) => {
        const userAns = mockExamUserAnswers[idx];
        const isCorrect = userAns === q.answerIndex;
        const letterUser = typeof userAns === "number" ? String.fromCharCode(65 + userAns) : (isEn ? "Not answered" : "Bỏ trống");
        const letterCorrect = String.fromCharCode(65 + q.answerIndex);
        return `
          <div class="exam-review-card ${isCorrect ? "correct" : "wrong"}">
            <div class="exam-review-header">
              <span class="exam-review-badge ${isCorrect ? "pass" : "fail"}">
                ${isCorrect ? "✓ " + (isEn ? "CORRECT" : "ĐÚNG") : "✕ " + (isEn ? "INCORRECT" : "SAI")}
              </span>
              <span class="exam-review-domain">${escapeHtml(q.domain)} • Câu ${idx + 1}</span>
            </div>
            <div class="exam-review-q">${formatExamRichText(q.question)}</div>
            <div class="exam-review-answers">
              <div><strong>${isEn ? "Your Choice:" : "Lựa chọn của bạn:"}</strong> ${letterUser} ${userAns !== undefined ? `- ${formatExamRichText(q.options[userAns] || "")}` : ""}</div>
              <div style="color:#16a34a;"><strong>${isEn ? "Correct Answer:" : "Đáp án đúng:"}</strong> ${letterCorrect} - ${formatExamRichText(q.options[q.answerIndex] || "")}</div>
            </div>
            <div class="exam-review-exp">
              <strong>${isEn ? "Detailed Technical Explanation:" : "Giải thích chi tiết nguyên lý:"}</strong><br/>
              ${formatExamRichText(q.explanation)}
            </div>
          </div>
        `;
      })
      .join("");

    resultContainer.innerHTML = `
      <div class="exam-report-card ${isPass ? "pass" : "fail"}">
        <div class="exam-result-badge-top">
          ${isPass ? "🎉 CISCO CERTIFIED BENCHMARK ACHIEVED" : "⚠️ NEEDS MORE DRILL PRACTICE"}
        </div>
        <h2 class="exam-score-title">${score} <span class="exam-score-max">/ 1000</span></h2>
        <div class="exam-status-banner ${isPass ? "pass" : "fail"}">
          ${isPass ? (isEn ? "CONGRATULATIONS: PASS (Qualified to Pass CCNA 200-301)" : "CHÚC MỪNG: BẠN ĐÃ ĐẠT (ĐỦ NĂNG LỰC THI ĐỖ CCNA 200-301)!") : (isEn ? "RESULT: FAIL (Passing Score: 825/1000)" : "KẾT QUẢ: CHƯA ĐẠT (Điểm đạt chuẩn Cisco là 825/1000)")}
        </div>
        <p class="exam-summary-text">
          ${isEn 
            ? `You answered ${correctCount}/${total} questions correctly (${Math.round((correctCount / total) * 100)}%). ${isTimeOut ? "(Exam terminated by countdown timer)." : ""}` 
            : `Bạn đã trả lời đúng ${correctCount}/${total} câu (${Math.round((correctCount / total) * 100)}%). ${isTimeOut ? "(Bài thi tự động nộp do hết thời gian làm bài)." : ""}`}
        </p>

        <div class="exam-domains-breakdown">
          <h3 class="exam-domains-title">${isEn ? "Score Breakdown by Cisco Exam Blueprint Domains:" : "Phân tích điểm theo 6 miền kiến thức của Cisco Blueprint:"}</h3>
          ${domainRowsHtml}
        </div>

        <div class="exam-result-actions">
          <button type="button" class="exam-btn-primary" id="exam-retry-btn">
            ${isEn ? "Take Another Exam Drill" : "Luyện thi lại đề khác"}
          </button>
          <button type="button" class="exam-btn-secondary" id="exam-close-result-btn">
            ${isEn ? "Close & Continue Studying" : "Đóng & Tiếp tục học bài"}
          </button>
        </div>

        <div class="exam-detailed-review">
          <h3 class="exam-domains-title" style="margin-top:2rem;">${isEn ? "Question-by-Question Solution & Explanations:" : "Chi tiết đáp án & Lời giải mẫu từng câu:"}</h3>
          <div class="exam-review-list">${reviewQuestionsHtml}</div>
        </div>
      </div>
    `;

    const retryBtn = document.getElementById("exam-retry-btn");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        startMockExam(mockExamQuestions.length);
      });
    }

    const closeBtn = document.getElementById("exam-close-result-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        closeMockExamModal();
      });
    }
  }
}

function closeMockExamModal() {
  if (mockExamIsRunning) {
    if (!confirm("Bài thi đang diễn ra. Bạn có chắc muốn dừng bài thi thử không?")) {
      return;
    }
  }
  clearInterval(mockExamTimerInterval);
  mockExamIsRunning = false;
  const modal = document.getElementById("mock-exam-modal");
  if (modal) modal.hidden = true;
}

// --------------------------------------------------------------------------
// 4. CLI CHEAT SHEET & CRAM REFERENCE MODAL
// --------------------------------------------------------------------------
function openCheatSheetModal(defaultTab = "commands") {
  const modal = document.getElementById("cheatsheet-modal");
  if (!modal) return;
  modal.hidden = false;
  renderCheatSheetTab(defaultTab);
}

function closeCheatSheetModal() {
  const modal = document.getElementById("cheatsheet-modal");
  if (modal) modal.hidden = true;
}

function renderCheatSheetTab(tab = "commands") {
  const container = document.getElementById("cheatsheet-content");
  if (!container) return;

  const tabBtns = document.querySelectorAll(".cs-tab-btn");
  tabBtns.forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));

  if (tab === "commands") {
    renderCheatSheetCommands(container);
  } else if (tab === "ad") {
    renderCramTableAD(container);
  } else if (tab === "ports") {
    renderCramTablePorts(container);
  } else if (tab === "syslog") {
    renderCramTableSyslog(container);
  } else if (tab === "multicast") {
    renderCramTableMulticast(container);
  }
}

function renderCheatSheetCommands(container) {
  const isEn = typeof currentLang !== "undefined" && currentLang === "en";
  container.innerHTML = `
    <div class="cs-toolbar">
      <div class="cs-search-wrap">
        <input type="text" id="cs-search-input" class="cs-search-input" placeholder="${isEn ? "Search 120+ Cisco commands (e.g. ospf, vlan, trunk, nat, access-list)..." : "Tra nhanh 120+ lệnh Cisco IOS (gõ ospf, vlan, trunk, nat, acl)..."}" />
      </div>
      <div class="cs-category-pills">
        <button type="button" class="cs-cat-pill active" data-cat="all">Tất cả</button>
        <button type="button" class="cs-cat-pill" data-cat="basic">Căn bản</button>
        <button type="button" class="cs-cat-pill" data-cat="switching">Chuyển mạch L2</button>
        <button type="button" class="cs-cat-pill" data-cat="routing">Định tuyến L3</button>
        <button type="button" class="cs-cat-pill" data-cat="security">Bảo mật &amp; NAT</button>
        <button type="button" class="cs-cat-pill" data-cat="troubleshoot">Kiểm tra (Show)</button>
      </div>
    </div>
    <div class="cs-commands-list" id="cs-commands-list"></div>
  `;

  const listEl = document.getElementById("cs-commands-list");
  const searchInput = document.getElementById("cs-search-input");
  const catPills = container.querySelectorAll(".cs-cat-pill");

  let currentCat = "all";
  let currentSearch = "";

  const filterAndDraw = () => {
    const q = currentSearch.toLowerCase();
    const filtered = CCNA_CHEAT_SHEET_DATA.filter((item) => {
      const matchCat = currentCat === "all" || item.category === currentCat;
      const matchQuery = !q || item.cmd.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.categoryName.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="cs-empty">${isEn ? "No commands match your search." : "Không tìm thấy câu lệnh phù hợp với từ khóa."}</div>`;
      return;
    }

    listEl.innerHTML = filtered
      .map(
        (item) => `
        <div class="cs-cmd-card">
          <div class="cs-cmd-header">
            <span class="cs-badge">${escapeHtml(item.categoryName)}</span>
            <span class="cs-mode">${escapeHtml(item.mode)}</span>
          </div>
          <pre class="cs-code-wrap"><code>${escapeHtml(item.cmd)}</code><button type="button" class="cs-copy-btn" title="Sao chép lệnh" onclick="copyCheatSheetCmd(this, \`${item.cmd.replace(/`/g, "\\`").replace(/\\/g, "\\\\")}\`)">Copy</button></pre>
          <p class="cs-desc">${formatExamRichText(item.desc)}</p>
        </div>
      `
      )
      .join("");
  };

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value.trim();
      filterAndDraw();
    });
  }

  catPills.forEach((p) => {
    p.addEventListener("click", () => {
      catPills.forEach((pill) => pill.classList.remove("active"));
      p.classList.add("active");
      currentCat = p.dataset.cat;
      filterAndDraw();
    });
  });

  filterAndDraw();
}

window.copyCheatSheetCmd = async function(btn, text) {
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "Copy";
      btn.classList.remove("copied");
    }, 1500);
  } catch {
    btn.textContent = "Error";
  }
};

function renderCramTableAD(container) {
  const rows = CCNA_CRAM_TABLES.ad
    .map((r) => `<tr><td><strong>${escapeHtml(r.route)}</strong></td><td style="color:#0284c7;font-weight:bold;font-size:1.1rem;">${r.ad}</td></tr>`)
    .join("");

  container.innerHTML = `
    <div class="cs-table-card">
      <h3 class="cs-table-title">Bảng Độ Ưu Tiên Tuyến Đường (Administrative Distance - AD)</h3>
      <p class="cs-table-desc">Router luôn ưu tiên chọn tuyến có AD NHỎ NHẤT để đưa vào bảng định tuyến.</p>
      <table class="tech-table">
        <thead><tr><th>Nguồn Định Tuyến (Routing Source)</th><th>Chỉ Số AD Mặc Định</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderCramTablePorts(container) {
  const rows = CCNA_CRAM_TABLES.ports
    .map((r) => `<tr><td><strong>${escapeHtml(r.port)}</strong></td><td><code class="inline-code">${escapeHtml(r.num)}</code></td></tr>`)
    .join("");

  container.innerHTML = `
    <div class="cs-table-card">
      <h3 class="cs-table-title">Bảng Cổng Dịch Vụ Mạng Cốt Lõi (Well-Known Port Numbers)</h3>
      <p class="cs-table-desc">Cực kỳ quan trọng khi viết Extended Access-Control Lists (ACL) và kiểm tra Firewall.</p>
      <table class="tech-table">
        <thead><tr><th>Giao Thức Dịch Vụ</th><th>Cổng Port &amp; Giao Thức Tầng 4</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderCramTableSyslog(container) {
  const rows = CCNA_CRAM_TABLES.syslog
    .map((r) => `<tr><td style="font-weight:bold;color:#0284c7;text-align:center;">${r.level}</td><td><strong>${escapeHtml(r.name)}</strong></td><td>${escapeHtml(r.desc)}</td></tr>`)
    .join("");

  container.innerHTML = `
    <div class="cs-table-card">
      <h3 class="cs-table-title">Bảng 8 Mức Độ Ghi Nhận Nhật Ký Hệ Thống (Syslog Severity Levels 0 - 7)</h3>
      <p class="cs-table-desc">Mẹo ghi nhớ siêu tốc: <em>"Every Alien Should Eat M&amp;Ms Daily"</em> (Emergency, Alert, Critical, Error, Warning, Notice, Informational, Debugging).</p>
      <table class="tech-table">
        <thead><tr><th>Mức Độ (Level)</th><th>Tên Gọi Chuẩn (Severity)</th><th>Ý Nghĩa Kỹ Thuật</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderCramTableMulticast(container) {
  const rows = CCNA_CRAM_TABLES.multicast
    .map((r) => `<tr><td><code class="inline-code">${escapeHtml(r.ip)}</code></td><td>${escapeHtml(r.usage)}</td></tr>`)
    .join("");

  container.innerHTML = `
    <div class="cs-table-card">
      <h3 class="cs-table-title">Bảng Địa Chỉ Multicast IPv4 &amp; MAC Thường Gặp</h3>
      <p class="cs-table-desc">Các địa chỉ Multicast dành riêng cho định tuyến động và chuyển mạch Tầng 2.</p>
      <table class="tech-table">
        <thead><tr><th>Địa Chỉ Multicast</th><th>Ứng Dụng &amp; Giao Thức Sử Dụng</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 5. HELPER FORMATTER
// --------------------------------------------------------------------------
function formatExamRichText(str) {
  if (!str) return "";
  let s = String(str);
  s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  s = s.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return s;
}

// --------------------------------------------------------------------------
// 6. INITIALIZATION & EVENT BINDINGS
// --------------------------------------------------------------------------
function initExamAndCheatSheetUI() {
  const openExamBtn = document.getElementById("open-exam-btn");
  if (openExamBtn) {
    openExamBtn.addEventListener("click", () => {
      // Default to 30 questions
      startMockExam(30);
    });
  }

  const openCsBtn = document.getElementById("open-cheatsheet-btn");
  if (openCsBtn) {
    openCsBtn.addEventListener("click", () => {
      openCheatSheetModal("commands");
    });
  }

  // Mock Exam UI buttons
  const flagBtn = document.getElementById("exam-flag-btn");
  if (flagBtn) {
    flagBtn.addEventListener("click", () => {
      mockExamFlagged[mockExamCurrentIndex] = !mockExamFlagged[mockExamCurrentIndex];
      renderMockExamQuestion();
      renderMockExamNavigator();
    });
  }

  const prevBtn = document.getElementById("exam-prev-btn");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (mockExamCurrentIndex > 0) {
        mockExamCurrentIndex--;
        renderMockExamQuestion();
        renderMockExamNavigator();
      }
    });
  }

  const nextBtn = document.getElementById("exam-next-btn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (mockExamCurrentIndex < mockExamQuestions.length - 1) {
        mockExamCurrentIndex++;
        renderMockExamQuestion();
        renderMockExamNavigator();
      } else {
        // Last question -> submit
        const answeredCount = Object.keys(mockExamUserAnswers).length;
        const total = mockExamQuestions.length;
        if (confirm(`Bạn đã làm ${answeredCount}/${total} câu hỏi. Bạn có chắc chắn muốn nộp bài thi không?`)) {
          finishMockExam(false);
        }
      }
    });
  }

  const submitDirectBtn = document.getElementById("exam-submit-now-btn");
  if (submitDirectBtn) {
    submitDirectBtn.addEventListener("click", () => {
      const answeredCount = Object.keys(mockExamUserAnswers).length;
      const total = mockExamQuestions.length;
      if (confirm(`Bạn đã làm ${answeredCount}/${total} câu hỏi. Bạn có chắc chắn muốn nộp bài thi không?`)) {
        finishMockExam(false);
      }
    });
  }

  const examCloseBtn = document.getElementById("mock-exam-close-btn");
  if (examCloseBtn) {
    examCloseBtn.addEventListener("click", closeMockExamModal);
  }

  const examBackdrop = document.getElementById("mock-exam-backdrop");
  if (examBackdrop) {
    examBackdrop.addEventListener("click", closeMockExamModal);
  }

  // Cheat Sheet UI buttons
  const csCloseBtn = document.getElementById("cheatsheet-close-btn");
  if (csCloseBtn) csCloseBtn.addEventListener("click", closeCheatSheetModal);

  const csBackdrop = document.getElementById("cheatsheet-backdrop");
  if (csBackdrop) csBackdrop.addEventListener("click", closeCheatSheetModal);

  const csTabBtns = document.querySelectorAll(".cs-tab-btn");
  csTabBtns.forEach((b) => {
    b.addEventListener("click", () => {
      renderCheatSheetTab(b.dataset.tab);
    });
  });
}

document.addEventListener("DOMContentLoaded", initExamAndCheatSheetUI);
