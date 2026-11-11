// 30 Bài Lab Thực Hành Cisco Packet Tracer Toàn Diện (Từ Con Số 0 Đến Thi Đỗ CCNA 200-301)
// Bao gồm: Sơ đồ mô phỏng giao diện Cisco Packet Tracer trực quan, Bảng quy hoạch IP, Yêu cầu đề bài,
// Hướng dẫn từng bước thao tác chuột trên Packet Tracer, Giải thích chi tiết từng câu lệnh CLI và Lệnh kiểm tra nghiệm thu.

function renderPacketTracerTopologySvg(lab) {
  const nodes = lab.nodes || [];
  const links = lab.links || [];
  const zones = lab.zones || [];

  const zonesSvg = zones
    .map(
      (z) => `
      <rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="8" fill="${z.fill || "#eff6ff"}" stroke="${z.stroke || "#3b82f6"}" stroke-width="1.5" stroke-dasharray="6,4"/>
      <text x="${z.x + 12}" y="${z.y + 20}" font-size="11.5" font-weight="bold" fill="${z.textColor || "#1d4ed8"}">${z.label}</text>
    `
    )
    .join("");

  const linksSvg = links
    .map((lk) => {
      const n1 = nodes[lk.from];
      const n2 = nodes[lk.to];
      if (!n1 || !n2) return "";
      let stroke = "#0f172a";
      let dash = "";
      let width = "2.5";
      if (lk.type === "console") {
        stroke = "#06b6d4";
        width = "3";
      } else if (lk.type === "crossover") {
        stroke = "#0f172a";
        dash = "6,4";
      } else if (lk.type === "fiber") {
        stroke = "#f97316";
        width = "3";
      } else if (lk.type === "serial") {
        stroke = "#dc2626";
        width = "2.5";
      }
      const mx = (n1.x + n2.x) / 2;
      const my = (n1.y + n2.y) / 2;
      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const p1x = Math.round(n1.x + dx * 0.26);
      const p1y = Math.round(n1.y + dy * 0.26);
      const p2x = Math.round(n1.x + dx * 0.74);
      const p2y = Math.round(n1.y + dy * 0.74);

      const dotColor1 = lk.down ? "#ef4444" : lk.stpBlock ? "#f59e0b" : "#16a34a";
      const dotColor2 = lk.down ? "#ef4444" : "#16a34a";

      return `
        <line x1="${n1.x}" y1="${n1.y}" x2="${n2.x}" y2="${n2.y}" stroke="${stroke}" stroke-width="${width}" ${dash ? `stroke-dasharray="${dash}"` : ""}/>
        <circle cx="${p1x}" cy="${p1y}" r="5" fill="${dotColor1}" stroke="#fff" stroke-width="1"/>
        <circle cx="${p2x}" cy="${p2y}" r="5" fill="${dotColor2}" stroke="#fff" stroke-width="1"/>
        ${
          lk.p1
            ? `<rect x="${p1x - 24}" y="${p1y - 20}" width="48" height="14" rx="3" fill="#ffffff" opacity="0.9"/><text x="${p1x}" y="${p1y - 10}" font-size="9.5" font-weight="bold" text-anchor="middle" fill="#0f172a">${lk.p1}</text>`
            : ""
        }
        ${
          lk.p2
            ? `<rect x="${p2x - 24}" y="${p2y - 20}" width="48" height="14" rx="3" fill="#ffffff" opacity="0.9"/><text x="${p2x}" y="${p2y - 10}" font-size="9.5" font-weight="bold" text-anchor="middle" fill="#0f172a">${lk.p2}</text>`
            : ""
        }
        ${
          lk.label
            ? `<rect x="${mx - 55}" y="${my - 9}" width="110" height="16" rx="4" fill="#fef3c7" stroke="#f59e0b" stroke-width="1"/><text x="${mx}" y="${my + 3}" font-size="9.5" font-weight="bold" text-anchor="middle" fill="#92400e">${lk.label}</text>`
            : ""
        }
      `;
    })
    .join("");

  const nodesSvg = nodes
    .map((n) => {
      let iconSvg = "";
      if (n.type === "router") {
        iconSvg = `
          <circle cx="${n.x}" cy="${n.y}" r="26" fill="#0284c7" stroke="#0f172a" stroke-width="2"/>
          <line x1="${n.x - 14}" y1="${n.y}" x2="${n.x + 14}" y2="${n.y}" stroke="#fff" stroke-width="2.5"/>
          <line x1="${n.x}" y1="${n.y - 14}" x2="${n.x}" y2="${n.y + 14}" stroke="#fff" stroke-width="2.5"/>
          <text x="${n.x}" y="${n.y + 4}" font-size="9" font-weight="bold" text-anchor="middle" fill="#e0f2fe">RTR</text>
        `;
      } else if (n.type === "switch" || n.type === "l3switch") {
        const fill = n.type === "l3switch" ? "#4f46e5" : "#0369a1";
        iconSvg = `
          <rect x="${n.x - 32}" y="${n.y - 16}" width="64" height="32" rx="5" fill="${fill}" stroke="#0f172a" stroke-width="2"/>
          <line x1="${n.x - 18}" y1="${n.y - 5}" x2="${n.x + 18}" y2="${n.y - 5}" stroke="#bae6fd" stroke-width="2"/>
          <line x1="${n.x - 18}" y1="${n.y + 5}" x2="${n.x + 18}" y2="${n.y + 5}" stroke="#bae6fd" stroke-width="2"/>
          <text x="${n.x}" y="${n.y + 3}" font-size="8.5" font-weight="bold" text-anchor="middle" fill="#fff">${n.type === "l3switch" ? "L3-SW" : "2960"}</text>
        `;
      } else if (n.type === "server") {
        iconSvg = `
          <rect x="${n.x - 22}" y="${n.y - 24}" width="44" height="48" rx="4" fill="#15803d" stroke="#0f172a" stroke-width="2"/>
          <line x1="${n.x - 14}" y1="${n.y - 12}" x2="${n.x + 14}" y2="${n.y - 12}" stroke="#dcfce7" stroke-width="2"/>
          <line x1="${n.x - 14}" y1="${n.y - 2}" x2="${n.x + 14}" y2="${n.y - 2}" stroke="#dcfce7" stroke-width="2"/>
          <circle cx="${n.x + 10}" cy="${n.y + 12}" r="3" fill="#4ade80"/>
          <text x="${n.x}" y="${n.y + 15}" font-size="8" font-weight="bold" text-anchor="middle" fill="#fff">SRV</text>
        `;
      } else if (n.type === "cloud" || n.type === "firewall") {
        const fill = n.type === "firewall" ? "#b91c1c" : "#d97706";
        iconSvg = `
          <rect x="${n.x - 34}" y="${n.y - 18}" width="68" height="36" rx="10" fill="${fill}" stroke="#0f172a" stroke-width="2"/>
          <text x="${n.x}" y="${n.y + 4}" font-size="9.5" font-weight="bold" text-anchor="middle" fill="#fff">${n.type === "firewall" ? "ASA FW" : "ISP/WAN"}</text>
        `;
      } else {
        // PC / Laptop
        iconSvg = `
          <rect x="${n.x - 24}" y="${n.y - 20}" width="48" height="32" rx="4" fill="#1e293b" stroke="#0284c7" stroke-width="2"/>
          <rect x="${n.x - 19}" y="${n.y - 15}" width="38" height="22" rx="2" fill="#38bdf8"/>
          <rect x="${n.x - 12}" y="${n.y + 12}" width="24" height="5" fill="#475569"/>
          <text x="${n.x}" y="${n.y - 1}" font-size="9" font-weight="bold" text-anchor="middle" fill="#0f172a">PC</text>
        `;
      }

      return `
        <g>
          ${iconSvg}
          <text x="${n.x}" y="${n.y + 34}" font-size="11" font-weight="bold" text-anchor="middle" fill="#0f172a">${n.name}</text>
          ${
            n.ip
              ? `<text x="${n.x}" y="${n.y + 47}" font-size="9.5" font-family="monospace" font-weight="bold" text-anchor="middle" fill="#0369a1">${n.ip}</text>`
              : ""
          }
        </g>
      `;
    })
    .join("");

  return `
    <svg viewBox="0 0 840 310" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
      <!-- Cisco Packet Tracer Window Chrome -->
      <rect width="840" height="310" rx="8" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
      <!-- Top Menu & Toolbar -->
      <rect x="0" y="0" width="840" height="30" rx="6" fill="#0f172a"/>
      <text x="14" y="20" font-size="11.5" font-weight="bold" fill="#38bdf8">🟦 Cisco Packet Tracer 8.2 — Mô Phỏng Sơ Đồ Bài Lab #${lab.id}: ${lab.title_vi}</text>
      <!-- Logical / Physical Workspace Bar -->
      <rect x="0" y="30" width="840" height="24" fill="#f1f5f9" stroke="#cbd5e1"/>
      <rect x="10" y="33" width="86" height="18" rx="3" fill="#eab308"/><text x="53" y="46" font-size="10" font-weight="bold" text-anchor="middle" fill="#0f172a">[Logical]</text>
      <rect x="102" y="33" width="86" height="18" rx="3" fill="#cbd5e1"/><text x="145" y="46" font-size="10" text-anchor="middle" fill="#475569">[Physical]</text>
      <circle cx="230" cy="42" r="5" fill="#16a34a"/><text x="240" y="46" font-size="10" fill="#15803d">Đèn Xanh = Up/Up</text>
      <circle cx="355" cy="42" r="5" fill="#f59e0b"/><text x="365" y="46" font-size="10" fill="#b45309">Đèn Cam = STP Learning/Blocked</text>
      <circle cx="545" cy="42" r="5" fill="#ef4444"/><text x="555" y="46" font-size="10" fill="#b91c1c">Đèn Đỏ = Shutdown</text>
      <line x1="670" y1="42" x2="700" y2="42" stroke="#06b6d4" stroke-width="3"/><text x="706" y="46" font-size="10" fill="#0891b2">Cáp Console</text>

      <!-- Workspace Canvas -->
      <g transform="translate(0, 54)">
        ${zonesSvg}
        ${linksSvg}
        ${nodesSvg}
      </g>

      <!-- Bottom Realtime / Simulation Bar -->
      <rect x="0" y="282" width="840" height="28" fill="#1e293b"/>
      <text x="14" y="300" font-size="10" fill="#cbd5e1">🔧 Thiết bị: [Network Devices: Router 4321 / Switch 2960]   [End Devices: PC / Server]   [Connections: ⚡ Copper Straight / Crossover / Console]</text>
      <rect x="725" y="286" width="105" height="20" rx="4" fill="#0284c7"/><text x="777" y="300" font-size="10" font-weight="bold" text-anchor="middle" fill="#fff">⏱️ Realtime Mode</text>
    </svg>
  `;
}

const PACKET_TRACER_LABS = [
  {
    id: 1,
    moduleId: 1,
    level: "Cơ bản (Nhập môn)",
    title_vi: "Lab 01: Làm Quen Giao Diện Cisco Packet Tracer & Kết Nối Mạng LAN Đầu Tiên",
    objective_vi: "Biết cách kéo thả thiết bị đầu cuối (PC, Server), thiết bị trung gian (Switch 2960), chọn đúng dây cáp mạng đồng thẳng (Copper Straight-Through), đặt địa chỉ IPv4 tĩnh và kiểm tra thông mạng bằng lệnh Ping.",
    nodes: [
      { name: "PC1 (Nhân viên)", type: "pc", x: 140, y: 80, ip: "192.168.1.10/24" },
      { name: "PC2 (Kế toán)", type: "pc", x: 140, y: 170, ip: "192.168.1.20/24" },
      { name: "SW1 (Cisco 2960)", type: "switch", x: 420, y: 125, ip: "Layer 2 Switch" },
      { name: "Web-Server", type: "server", x: 700, y: 125, ip: "192.168.1.100/24" }
    ],
    links: [
      { from: 0, to: 2, type: "straight", p1: "Fa0", p2: "Fa0/1" },
      { from: 1, to: 2, type: "straight", p1: "Fa0", p2: "Fa0/2" },
      { from: 2, to: 3, type: "straight", p1: "Fa0/24", p2: "Fa0" }
    ],
    zones: [
      { x: 60, y: 20, w: 720, height: 200, h: 200, label: "MẠNG NỘI BỘ LAN: 192.168.1.0/24 (Cùng 1 Subnet)" }
    ],
    ipTable: [
      ["PC1", "FastEthernet0 (Fa0)", "192.168.1.10", "255.255.255.0", "Chưa cần (Cùng LAN)"],
      ["PC2", "FastEthernet0 (Fa0)", "192.168.1.20", "255.255.255.0", "Chưa cần (Cùng LAN)"],
      ["Web-Server", "FastEthernet0 (Fa0)", "192.168.1.100", "255.255.255.0", "Chưa cần (Cùng LAN)"]
    ],
    steps_vi: [
      "Bước 1 (Kéo thả thiết bị): Mở phần mềm Cisco Packet Tracer. Ở góc dưới bên trái, bấm chọn mục **[Network Devices]** -> chọn **[Switches]** -> kéo biểu tượng **Switch 2960** thả ra giữa màn hình. Tiếp theo chọn **[End Devices]** -> kéo **2 máy tính (PC)** và **1 máy chủ (Server)** thả ra 2 bên.",
      "Bước 2 (Đấu dây cáp mạng): Bấm vào biểu tượng **Tia sét màu cam (Connections)**. Chọn sợi dây **Đen nét liền (Copper Straight-Through - Cáp thẳng)** vì ta đang nối các thiết bị khác loại (PC nối vào Switch). Bấm vào `PC1` chọn cổng `FastEthernet0` rồi kéo sang `SW1` chọn cổng `FastEthernet0/1`. Làm tương tự cho `PC2` (vào `Fa0/2`) và `Server` (vào `Fa0/24`).",
      "Bước 3 (Quan sát đèn tín hiệu STP): Ngay khi cắm dây, bạn sẽ thấy đầu dây hiện **Chấm tròn màu cam** trong khoảng 30 giây (Switch đang chạy thuật toán Spanning Tree để kiểm tra chống vòng lặp). Hãy bấm nút **Fast Forward Time (`Alt + D`)** ở góc dưới để tua nhanh 30 giây cho đèn chuyển sang **Tam giác màu xanh lá (Up)**.",
      "Bước 4 (Đặt địa chỉ IP cho PC và Server): Nháy đúp chuột vào `PC1` -> chọn thẻ **Desktop** -> bấm vào **IP Configuration** -> tích chọn **Static** và nhập IPv4 Address: `192.168.1.10`, Subnet Mask: `255.255.255.0`. Lặp lại tương tự cho `PC2` (`192.168.1.20`) và `Web-Server` (`192.168.1.100`).",
      "Bước 5 (Kiểm tra kết nối bằng Ping và Trình duyệt Web): Trên `PC1`, mở thẻ **Desktop -> Command Prompt** và gõ lệnh `ping 192.168.1.100`. Sau đó mở **Web Browser** trên `PC1`, nhập `http://192.168.1.100` rồi bấm **Go** để xem trang web trả về từ Server!"
    ],
    cli_commands: [
      "C:\\> ipconfig                              # Xem địa chỉ IP và Subnet Mask hiện tại trên PC1",
      "C:\\> ping 192.168.1.20                     # Kiểm tra thông mạng từ PC1 sang PC2 (4 gói Reply thành công)",
      "C:\\> ping 192.168.1.100                    # Kiểm tra thông mạng từ PC1 tới Web-Server",
      "C:\\> arp -a                                # Xem bảng địa chỉ MAC mà PC1 vừa tự động học được"
    ],
    verify_vi: "Kết quả đạt 100% khi: 1) Cả 3 sợi dây đều sáng 2 đầu tam giác màu xanh lá; 2) Lệnh `ping 192.168.1.100` báo `Sent = 4, Received = 4, Lost = 0 (0% loss)`; 3) Mở Web Browser gõ `192.168.1.100` hiện trang chủ Cisco Packet Tracer."
  },
  {
    id: 2,
    moduleId: 2,
    level: "Cơ bản",
    title_vi: "Lab 02: Cắm Dây Cáp Console & Cấu Hình Bảo Mật Cơ Bản Cho Switch Mới Khui Hộp",
    objective_vi: "Thực hành đấu cáp Console (màu xanh ngọc) từ Laptop vào cổng Console của Switch 2960, mở phần mềm Terminal (9600 bps) và cấu hình trọn bộ: Hostname, Mật khẩu Console, Mật khẩu Enable Secret, Mã hóa mật khẩu, Banner cảnh báo và Lưu cấu hình vào NVRAM.",
    nodes: [
      { name: "Laptop-Admin", type: "pc", x: 200, y: 120, ip: "Cổng RS-232 (Serial)" },
      { name: "SW1 (Mới khui hộp)", type: "switch", x: 580, y: 120, ip: "Cổng Console" }
    ],
    links: [
      { from: 0, to: 1, type: "console", p1: "RS-232", p2: "Console", label: "Cáp Console Xanh Ngọc" }
    ],
    zones: [
      { x: 90, y: 30, w: 660, h: 180, label: "QUẢN TRỊ NGOÀI BĂNG TẦN (OUT-OF-BAND MANAGEMENT QUA DÂY CONSOLE)" }
    ],
    ipTable: [
      ["Laptop-Admin", "RS-232", "Không cần IP", "-", "Dùng phần mềm Terminal (9600 bps, 8-N-1)"],
      ["SW1", "Console 0", "Chưa có IP", "-", "Cấu hình lần đầu qua dây Console"]
    ],
    steps_vi: [
      "Bước 1 (Cắm dây Console): Chọn biểu tượng **Tia sét (Connections)** -> chọn sợi dây **Màu xanh ngọc uốn cong (Console)**. Bấm vào `Laptop-Admin` chọn cổng **RS-232**, kéo sang `SW1` và chọn cổng **Console**.",
      "Bước 2 (Mở phần mềm Terminal như ngoài đời thực): Bấm vào `Laptop-Admin` -> chọn thẻ **Desktop** -> bấm vào biểu tượng **Terminal** (ngoài đời thực là phần mềm PuTTY). Kiểm tra thông số mặc định: **Bits per second = 9600**, Data bits = 8, Parity = None, Stop bits = 1 -> bấm **OK** để vào màn hình đen `Switch>`.",
      "Bước 3 (Đặt tên thiết bị và bảo mật 2 lớp mật khẩu): Chuyển từ `Switch>` lên `Switch#` bằng lệnh `enable`, rồi vào chế độ cấu hình toàn cục `Switch(config)#` bằng lệnh `configure terminal`. Thực hiện đặt tên `hostname SW1`, đặt mật khẩu cổng Console (`line console 0`) và mật khẩu đặc quyền băm MD5 (`enable secret`).",
      "Bước 4 (Mã hóa mật khẩu chữ rõ & Tạo bảng cảnh báo): Gõ lệnh `service password-encryption` để che toàn bộ mật khẩu dạng chữ rõ trong file cấu hình thành chuỗi số dạng Type 7, và tạo `banner motd`.",
      "Bước 5 (Lưu vào bộ nhớ NVRAM & Kiểm tra): Thoát ra `SW1#` và gõ `copy running-config startup-config` để khi tắt nguồn không bị mất cấu hình."
    ],
    cli_commands: [
      "Switch> enable                                    # Bước vào chế độ Đặc quyền (Privileged EXEC)",
      "Switch# configure terminal                        # Bước vào chế độ Cấu hình toàn cục (Global Config)",
      "Switch(config)# hostname SW1                      # Đổi tên thiết bị từ Switch thành SW1",
      "SW1(config)# no ip domain-lookup                  # Tắt tính năng tự dịch từ gõ sai thành DNS (tránh treo máy)",
      "SW1(config)# enable secretMatKhauAdmin@123        # Đặt mật khẩu bảo vệ chế độ Đặc quyền (Băm MD5 an toàn)",
      "SW1(config)# line console 0                       # Đi vào cổng vật lý Console ở mặt sau Switch",
      "SW1(config-line)# password MatKhauConsole123      # Đặt mật khẩu cho cổng Console",
      "SW1(config-line)# login                           # BẮT BUỘC: Bật yêu cầu hỏi mật khẩu khi cắm dây Console",
      "SW1(config-line)# logging synchronous             # Không cho dòng thông báo hệ thống cắt ngang câu lệnh đang gõ",
      "SW1(config-line)# exit                            # Quay về chế độ Global Config",
      "SW1(config)# service password-encryption          # Mã hóa tất cả mật khẩu chữ rõ thành dạng ẩn Type 7",
      "SW1(config)# banner motd #CANH BAO: CAM TRUY CAP TRAI PHEP!#  # Tạo thông báo cảnh báo pháp lý khi đăng nhập",
      "SW1(config)# end                                  # Thoát thẳng về chế độ Đặc quyền SW1#",
      "SW1# copy running-config startup-config           # Lưu cấu hình từ RAM vào NVRAM vĩnh viễn"
    ],
    verify_vi: "Gõ lệnh `SW1# exit` để đăng xuất ra ngoài. Ngay lập tức bạn phải thấy dòng chữ `CANH BAO: CAM TRUY CAP TRAI PHEP!` hiện lên, tiếp theo máy hỏi mật khẩu Console (`MatKhauConsole123`), và khi gõ `enable` máy hỏi tiếp mật khẩu Secret (`MatKhauAdmin@123`)."
  },
  {
    id: 3,
    moduleId: 2,
    level: "Cơ bản - Trung cấp",
    title_vi: "Lab 03: Đặt Địa Chỉ IP Ảo Quản Trị Từ Xa Cho Switch (SVI VLAN 1) & Điều Khiển Từ PC",
    objective_vi: "Hiểu tại sao Switch Layer 2 cần địa chỉ IP trên cổng ảo `interface vlan 1` (SVI) và `ip default-gateway` để kỹ sư ngồi từ phòng IT có thể ping và đăng nhập quản trị Switch từ xa qua mạng mà không cần cầm dây Console đi tới tủ Rack.",
    nodes: [
      { name: "PC-IT-Admin", type: "pc", x: 180, y: 120, ip: "192.168.1.10/24" },
      { name: "SW1 (Catalyst 2960)", type: "switch", x: 560, y: 120, ip: "VLAN 1: 192.168.1.2/24" }
    ],
    links: [
      { from: 0, to: 1, type: "straight", p1: "Fa0", p2: "Fa0/1", label: "Cáp mạng UTP (LAN)" }
    ],
    zones: [
      { x: 80, y: 30, w: 660, h: 180, label: "QUẢN TRỊ QUA MẠNG NỘI BỘ (IN-BAND MANAGEMENT VỚI SVI VLAN 1)" }
    ],
    ipTable: [
      ["PC-IT-Admin", "FastEthernet0", "192.168.1.10", "255.255.255.0", "192.168.1.1"],
      ["SW1", "Interface VLAN 1 (SVI)", "192.168.1.2", "255.255.255.0", "192.168.1.1"]
    ],
    steps_vi: [
      "Bước 1: Kéo 1 máy tính `PC-IT-Admin` và 1 `Switch 2960` ra màn hình, nối cổng `Fa0` của PC vào cổng `Fa0/1` của Switch bằng cáp thẳng (Copper Straight-Through).",
      "Bước 2: Đặt IP tĩnh cho `PC-IT-Admin` là `192.168.1.10`, Subnet Mask `255.255.255.0`, Default Gateway `192.168.1.1`.",
      "Bước 3: Bấm vào `SW1` -> chọn thẻ **CLI** -> vào chế độ cấu hình và vào cổng ảo `interface vlan 1`. Đặt địa chỉ IP `192.168.1.2 255.255.255.0` và **bắt buộc gõ lệnh `no shutdown`** (vì mặc định cổng ảo VLAN 1 bị tắt!).",
      "Bước 4: Cấu hình `ip default-gateway 192.168.1.1` cho Switch và mở 16 cổng ảo từ xa `line vty 0 15` để cho phép kỹ sư đăng nhập từ PC.",
      "Bước 5: Từ `PC-IT-Admin`, mở **Command Prompt** gõ `ping 192.168.1.2` và `telnet 192.168.1.2` để điều khiển Switch ngay từ máy tính!"
    ],
    cli_commands: [
      "SW1> enable                                               # Vào chế độ Đặc quyền",
      "SW1# configure terminal                                   # Vào chế độ Cấu hình toàn cục",
      "SW1(config)# enable secret CiscoEnable123                 # Bắt buộc phải có mật khẩu Enable thì mới vào được từ xa",
      "SW1(config)# interface vlan 1                             # Truy cập vào giao diện ảo quản trị SVI VLAN 1",
      "SW1(config-if)# ip address 192.168.1.2 255.255.255.0      # Gán địa chỉ IPv4 quản trị cho chiếc Switch",
      "SW1(config-if)# no shutdown                               # Bật cổng ảo VLAN 1 lên trạng thái hoạt động (UP)",
      "SW1(config-if)# exit                                      # Thoát ra Global Config",
      "SW1(config)# ip default-gateway 192.168.1.1               # Khai báo cổng Router mặc định để quản trị từ mạng khác",
      "SW1(config)# line vty 0 15                                # Mở toàn bộ 16 đường kết nối ảo từ xa (Virtual Teletype)",
      "SW1(config-line)# password CiscoVty123                    # Đặt mật khẩu đăng nhập từ xa",
      "SW1(config-line)# login                                   # Kích hoạt kiểm tra mật khẩu trên đường VTY",
      "SW1(config-line)# end                                     # Trở về SW1#",
      "SW1# show ip interface brief                              # Kiểm tra cột Vlan1 đã có IP 192.168.1.2 và up/up chưa"
    ],
    verify_vi: "Mở Command Prompt trên `PC-IT-Admin`, gõ `telnet 192.168.1.2` -> Nhập mật khẩu `CiscoVty123` -> Nhập `enable` và mật khẩu `CiscoEnable123` -> Bạn đã điều khiển được hoàn toàn chiếc Switch từ xa!"
  },
  {
    id: 4,
    moduleId: 3,
    level: "Cơ bản",
    title_vi: "Lab 04: Bắt Gói Tin Bằng Chế Độ Simulation Mode — Quan Sát 7 Tầng OSI (In-Layers / Out-Layers)",
    objective_vi: "Sử dụng tính năng độc quyền **Simulation Mode** của Cisco Packet Tracer để 'chụp X-quang' một gói tin đi từ PC sang Web Server, tận mắt nhìn thấy 7 tầng OSI đóng gói (Encapsulation) và mở gói (De-encapsulation) ở từng thiết bị.",
    nodes: [
      { name: "PC-Client", type: "pc", x: 150, y: 120, ip: "192.168.1.10/24" },
      { name: "SW1 (Layer 2)", type: "switch", x: 420, y: 120, ip: "Chỉ đọc Tầng 1 & 2" },
      { name: "Web-Server", type: "server", x: 690, y: 120, ip: "192.168.1.100/24" }
    ],
    links: [
      { from: 0, to: 1, type: "straight", p1: "Fa0", p2: "Fa0/1" },
      { from: 1, to: 2, type: "straight", p1: "Fa0/2", p2: "Fa0" }
    ],
    zones: [
      { x: 60, y: 25, w: 720, h: 185, label: "PHÂN TÍCH GÓI TIN PDU TRONG CHẾ ĐỘ SIMULATION MODE" }
    ],
    ipTable: [
      ["PC-Client", "FastEthernet0", "192.168.1.10", "255.255.255.0", "-"],
      ["Web-Server", "FastEthernet0", "192.168.1.100", "255.255.255.0", "-"]
    ],
    steps_vi: [
      "Bước 1: Dùng lại sơ đồ nối `PC-Client` (192.168.1.10) qua `SW1` tới `Web-Server` (192.168.1.100).",
      "Bước 2 (Chuyển sang chế độ quay chậm Simulation): Ở góc dưới cùng bên phải của Packet Tracer, bấm chuyển từ **Realtime** sang biểu tượng đồng hồ bấm giờ **Simulation**.",
      "Bước 3 (Tạo gói tin thử nghiệm): Bấm vào biểu tượng **Phong bì thư có dấu cộng (Add Simple PDU - Phím tắt `P`)** ở thanh công cụ phía trên -> Bấm chuột vào `PC-Client` (làm nguồn) rồi bấm vào `Web-Server` (làm đích). Bạn sẽ thấy một phong bì thư xuất hiện ngay trên `PC-Client`!",
      "Bước 4 (Giải phẫu 7 tầng OSI): Nháy đúp chuột прямо vào **chiếc phong bì thư** trên `PC-Client`. Cửa sổ **PDU Information** hiện ra với 2 thẻ cực kỳ giá trị: • Thẻ **OSI Model**: Cho thấy dữ liệu đang đi qua Layer 3 (`IP Header: Src 192.168.1.10 -> Dst 192.168.1.100`), Layer 2 (`Ethernet II: Src MAC -> Dst MAC`), và Layer 1 (`FastEthernet0`). • Thẻ **Outbound PDU Details**: Vẽ chính xác cấu trúc từng ô bit của khung tin Ethernet II, IPv4 Header và ICMP!",
      "Bước 5: Bấm nút **Capture / Forward (`Alt + C`)** từng nhịp một: Nhịp 1 phong bì bay tới `SW1` (bấm vào phong bì tại `SW1`, bạn sẽ thấy Switch **chỉ đọc đến Layer 2** chứ không hề mở Layer 3!). Nhịp 2 phong bì bay tới `Web-Server`, và nhịp 3-4 quay về `PC-Client` kèm dấu tích xanh `Successful`!"
    ],
    cli_commands: [
      "# Các thao tác kiểm tra trực tiếp trên cửa sổ PDU Information trong Packet Tracer:",
      "1. Tại PC-Client (Out-Layers): Layer 3 (ICMP Echo Request) -> Layer 2 (Ethernet II Frame) -> Layer 1 (Bits)",
      "2. Tại Switch SW1 (In/Out-Layers): Chỉ sáng ở Layer 1 và Layer 2 (Switch không can thiệp vào IP Layer 3!)",
      "3. Tại Web-Server (In-Layers): Mở gói từ Layer 1 -> Layer 2 -> Layer 3 và đóng gói trả lời Echo Reply"
    ],
    verify_vi: "Mở thẻ **Outbound PDU Details** của phong bì thư và ghi nhận đủ 3 lớp nhãn: `ETHERNET II` (Preamble, Dest MAC, Src MAC, Type `0x0800`, FCS), `IP` (Version 4, TTL=128, Src IP, Dst IP), và `ICMP` (Type 8 = Echo Request)."
  },
  {
    id: 5,
    moduleId: 4,
    level: "Cơ bản",
    title_vi: "Lab 05: Phân Biệt Cáp Thẳng (Straight-Through), Cáp Chéo (Crossover) & Cấu Hình Speed/Duplex",
    objective_vi: "Hiểu rõ khi nào dùng cáp thẳng, khi nào dùng cáp chéo nối 2 thiết bị cùng loại, tác dụng của tính năng tự đảo chân tín hiệu `mdix auto`, và cách khóa cứng tốc độ `speed 100` + `duplex full` trên cổng Switch.",
    nodes: [
      { name: "PC1", type: "pc", x: 140, y: 120, ip: "192.168.1.10/24" },
      { name: "SW1 (2960)", type: "switch", x: 380, y: 120, ip: "Fa0/24 nối SW2" },
      { name: "SW2 (2960)", type: "switch", x: 640, y: 120, ip: "Fa0/24 nối SW1" }
    ],
    links: [
      { from: 0, to: 1, type: "straight", p1: "Fa0", p2: "Fa0/1", label: "Cáp Thẳng (Khác loại)" },
      { from: 1, to: 2, type: "crossover", p1: "Fa0/24", p2: "Fa0/24", label: "Cáp Chéo (Cùng loại)" }
    ],
    zones: [
      { x: 60, y: 25, w: 720, h: 185, label: "ĐẤU NỐI VẬT LÝ TẦNG 1 & THƯƠNG LƯỢNG TỐC ĐỘ / SONG CÔNG (SPEED & DUPLEX)" }
    ],
    ipTable: [
      ["PC1", "FastEthernet0", "192.168.1.10", "255.255.255.0", "Speed 100 Mbps / Full-Duplex"],
      ["SW1 <-> SW2", "Fa0/24 <-> Fa0/24", "Layer 2 Link", "-", "Cáp Chéo (Copper Cross-Over)"]
    ],
    steps_vi: [
      "Bước 1: Kéo `PC1`, `SW1` và `SW2` ra màn hình. Nối `PC1` vào `SW1` (cổng `Fa0/1`) bằng **Cáp Thẳng (nét liền)**. Nối `SW1` (cổng `Fa0/24`) sang `SW2` (cổng `Fa0/24`) bằng **Cáp Chéo (Copper Cross-Over - nét đứt)**.",
      "Bước 2 (Thử nghiệm lỗi thực tế): Hãy thử xóa sợi cáp chéo giữa `SW1` và `SW2`, thay bằng cáp thẳng rồi vào `SW1` tắt tính năng tự đảo dây bằng lệnh `no mdix auto` — bạn sẽ thấy đèn biến thành **màu đỏ (Down)** ngay lập tức vì 2 cổng Switch đều phát ở chân 1,2 và thu ở chân 3,6!",
      "Bước 3: Bật lại `mdix auto` hoặc dùng cáp chéo chuẩn, sau đó cấu hình khóa cứng tốc độ `speed 100` và chế độ song công toàn phần `duplex full` trên cả 2 đầu nối để tránh lỗi lệch song công (Duplex Mismatch)."
    ],
    cli_commands: [
      "SW1# configure terminal                           # Vào chế độ cấu hình trên SW1",
      "SW1(config)# interface fastEthernet 0/1           # Vào cổng nối với máy tính PC1",
      "SW1(config-if)# description Ket-noi-may-PC1       # Ghi chú tên cổng để dễ quản lý",
      "SW1(config-if)# speed 100                         # Khóa tốc độ ở mức 100 Mbps",
      "SW1(config-if)# duplex full                       # Khóa chế độ truyền nhận 2 chiều đồng thời (Full-Duplex)",
      "SW1(config-if)# mdix auto                         # Bật tự động nhận diện cáp thẳng / cáp chéo (Auto-MDIX)",
      "SW1(config-if)# end                               # Thoát về SW1#",
      "SW1# show interfaces fastEthernet 0/1             # Kiểm tra dòng 'Full-duplex, 100Mb/s' và các bộ đếm lỗi CRC/Runts",
      "SW1# show interfaces status                       # Xem bảng tổng hợp trạng thái, VLAN, Duplex, Speed của cả 24 cổng"
    ],
    verify_vi: "Gõ lệnh `SW1# show interfaces status`, kiểm tra cổng `Fa0/1` hiển thị `connected`, cột Duplex là `full` và cột Speed là `100`."
  },
  {
    id: 6,
    moduleId: 5,
    level: "Cơ bản",
    title_vi: "Lab 06: Thực Hành Quy Đổi Nhị Phân - Thập Phân - Hexadecimal Trên Địa Chỉ IPv4, IPv6 & MAC",
    objective_vi: "Kiểm chứng thực tế cách thiết bị Cisco và Windows hiển thị địa chỉ IPv4 (32-bit Thập phân), địa chỉ MAC (48-bit Thập lục phân) và địa chỉ IPv6 (128-bit Thập lục phân).",
    nodes: [
      { name: "PC1", type: "pc", x: 200, y: 120, ip: "192.168.10.150/24" },
      { name: "R1 (ISR 4321)", type: "router", x: 580, y: 120, ip: "192.168.10.1 / 2001:db8::1" }
    ],
    links: [
      { from: 0, to: 1, type: "crossover", p1: "Fa0", p2: "Gi0/0/0", label: "192.168.10.0/24" }
    ],
    zones: [
      { x: 90, y: 25, w: 660, h: 185, label: "ĐỐI CHIẾU CÁC HỆ ĐẾM TRÊN CARD MẠNG PC & CỔNG ROUTER" }
    ],
    ipTable: [
      ["PC1", "Fa0", "192.168.10.150 (11000000.10101000.00001010.10010110)", "255.255.255.0", "192.168.10.1"],
      ["R1", "Gi0/0/0", "192.168.10.1 & 2001:db8:acad:1::1/64", "255.255.255.0", "-"]
    ],
    steps_vi: [
      "Bước 1: Đổi địa chỉ IP của `PC1` (`192.168.10.150`) ra nhị phân bằng bảng 8 mốc vàng (`128, 64, 32, 16, 8, 4, 2, 1`): • `192 = 128 + 64 = 11000000` • `168 = 128 + 32 + 8 = 10101000` • `10 = 8 + 2 = 00001010` • `150 = 128 + 16 + 4 + 2 = 10010110`.",
      "Bước 2: Mở `PC1 -> Command Prompt` và gõ lệnh `ipconfig /all`. Quan sát dòng **Physical Address** (ví dụ `0001.42A9.C31F`) — đây chính là 12 chữ số hệ Thập lục phân (Hexadecimal), mỗi chữ số ứng với 4 bit nhị phân (`48 bit`).",
      "Bước 3: Vào Router `R1`, bật cổng `Gi0/0/0` và gõ `show interfaces gigabitEthernet 0/0/0` để tìm địa chỉ phần cứng BIA (Burned-In Address) của cổng Router."
    ],
    cli_commands: [
      "C:\\> ipconfig /all                                # Xem Physical Address (MAC 12 số Hex) + IPv4 + IPv6 trên PC1",
      "R1# show interfaces gigabitEthernet 0/0/0         # Xem dòng 'Hardware is ISR4321, address is xxxx.xxxx.xxxx (bia ...)'",
      "# Công thức kiểm tra nhanh trên nháp:",
      "# 192.168.10.150 = 11000000 . 10101000 . 00001010 . 10010110 (Nhị phân)",
      "#                = 0xC0 . 0xA8 . 0x0A . 0x96                 (Thập lục phân - Hex)"
    ],
    verify_vi: "Xác định đúng 6 chữ số Hex đầu tiên của địa chỉ MAC là mã nhà sản xuất (OUI - 24 bit) và 6 chữ số Hex cuối là số định danh card mạng (24 bit)."
  },
  {
    id: 7,
    moduleId: 6,
    level: "Cơ bản",
    title_vi: "Lab 07: Kiểm Chứng Sự Khác Biệt Giữa Hub (Half-Duplex Collision) Và Switch (Full-Duplex)",
    objective_vi: "Tận mắt nhìn thấy hiện tượng **Đụng độ cháy gói tin (Collision 🔥)** khi 2 máy tính gửi dữ liệu cùng lúc qua Hub (Tầng 1 - Half-Duplex), và sự mượt mà tuyệt đối khi thay Hub bằng Switch (Tầng 2 - Full-Duplex).",
    nodes: [
      { name: "PC1", type: "pc", x: 130, y: 70, ip: "192.168.1.1/24" },
      { name: "PC2", type: "pc", x: 130, y: 175, ip: "192.168.1.2/24" },
      { name: "Hub-PT (Layer 1)", type: "cloud", x: 420, y: 120, ip: "1 Miền Đụng Độ Chung!" },
      { name: "PC3", type: "pc", x: 700, y: 120, ip: "192.168.1.3/24" }
    ],
    links: [
      { from: 0, to: 2, type: "straight", p1: "Fa0", p2: "Port0" },
      { from: 1, to: 2, type: "straight", p1: "Fa0", p2: "Port1" },
      { from: 2, to: 3, type: "straight", p1: "Port2", p2: "Fa0" }
    ],
    zones: [
      { x: 50, y: 20, w: 740, h: 195, label: "THÍ NGHIỆM ĐỤNG ĐỘ TÍN HIỆU (COLLISION) TRÊN HUB VS. SWITCH" }
    ],
    ipTable: [
      ["PC1", "Fa0", "192.168.1.1", "255.255.255.0", "-"],
      ["PC2", "Fa0", "192.168.1.2", "255.255.255.0", "-"],
      ["PC3", "Fa0", "192.168.1.3", "255.255.255.0", "-"]
    ],
    steps_vi: [
      "Bước 1: Trong Packet Tracer, chọn mục **[Network Devices] -> [Hubs]** -> kéo 1 chiếc **Hub-PT** ra giữa màn hình, nối 3 máy tính `PC1`, `PC2`, `PC3` vào Hub và đặt IP cùng mạng `192.168.1.x/24`.",
      "Bước 2: Bật chế độ **Simulation Mode**. Dùng công cụ **Add Simple PDU (`P`)** tạo đồng thời **2 phong bì thư cùng lúc**: Phong bì 1 từ `PC1` gửi sang `PC3`, và Phong bì 2 từ `PC2` gửi sang `PC1`.",
      "Bước 3: Bấm **Capture / Forward** 1 nhịp -> Bạn sẽ thấy cả 2 phong bì lao vào chiếc Hub cùng lúc và **bốc cháy (biểu tượng ngọn lửa 🔥)!** Đó chính là hiện tượng **Đụng độ tín hiệu (Collision)** do Hub bắt buộc chạy chế độ Half-Duplex chia sẻ chung 1 làn đường.",
      "Bước 4: Xóa chiếc Hub đi, thay bằng **Switch 2960** và thực hiện lại bước gửi 2 phong bì cùng lúc -> Cả 2 phong bì đi qua Switch êm ru không hề va chạm nhờ cơ chế **Full-Duplex** và vi phân đoạn (Microsegmentation)!"
    ],
    cli_commands: [
      "# Khi thay bằng Switch 2960, kiểm tra chế độ Full-Duplex không còn đụng độ:",
      "Switch# show interfaces fastEthernet 0/1          # Xem dòng 'Full-duplex, 100Mb/s, 0 collisions, 0 late collisions'",
      "Switch# show mac address-table                    # Xem bảng ánh xạ từng địa chỉ MAC vào từng cổng riêng biệt"
    ],
    verify_vi: "Hiểu rõ tại sao mạng hiện đại đã loại bỏ hoàn toàn thiết bị Hub và thay thế 100% bằng Switch chạy chế độ Full-Duplex."
  },
  {
    id: 8,
    moduleId: 7,
    level: "Cơ bản - Trung cấp",
    title_vi: "Lab 08: Khám Phá Bảng Địa Chỉ MAC (CAM Table) & Quá Trình Switch Học MAC Nguồn",
    objective_vi: "Quan sát quá trình một chiếc Switch trắng tinh tự động ghi nhớ **Source MAC Address** vào bảng CAM Table khi có gói tin đi qua, cách lọc bảng MAC và cách xóa bảng MAC.",
    nodes: [
      { name: "PC1", type: "pc", x: 130, y: 70, ip: "192.168.1.10/24" },
      { name: "PC2", type: "pc", x: 130, y: 175, ip: "192.168.1.20/24" },
      { name: "SW1 (2960)", type: "switch", x: 420, y: 120, ip: "Bảng CAM Table" },
      { name: "PC3", type: "pc", x: 700, y: 120, ip: "192.168.1.30/24" }
    ],
    links: [
      { from: 0, to: 2, type: "straight", p1: "Fa0", p2: "Fa0/1" },
      { from: 1, to: 2, type: "straight", p1: "Fa0", p2: "Fa0/2" },
      { from: 2, to: 3, type: "straight", p1: "Fa0/3", p2: "Fa0" }
    ],
    zones: [
      { x: 50, y: 20, w: 740, h: 195, label: "CƠ CHẾ SWITCH HỌC SOURCE MAC VÀ CHUYỂN TIẾP THEO DESTINATION MAC" }
    ],
    ipTable: [
      ["PC1", "Fa0 ( nối vào Fa0/1 )", "192.168.1.10", "255.255.255.0", "-"],
      ["PC2", "Fa0 ( nối vào Fa0/2 )", "192.168.1.20", "255.255.255.0", "-"],
      ["PC3", "Fa0 ( nối vào Fa0/3 )", "192.168.1.30", "255.255.255.0", "-"]
    ],
    steps_vi: [
      "Bước 1: Khi vừa nối cáp xong và chưa gửi bất kỳ gói tin nào, vào `SW1` gõ lệnh `show mac address-table`. Bạn sẽ thấy bảng MAC hoàn toàn **trống rỗng**!",
      "Bước 2: Từ `PC1` (`192.168.1.10`), mở Command Prompt gõ `ping 192.168.1.30` (gửi sang `PC3`).",
      "Bước 3: Quay lại `SW1` gõ lại lệnh `show mac address-table` -> Lập tức xuất hiện 2 dòng `DYNAMIC`: Cổng `Fa0/1` gắn với địa chỉ MAC của `PC1`, và cổng `Fa0/3` gắn với địa chỉ MAC của `PC3` (riêng `PC2` chưa lên tiếng nên Switch vẫn chưa biết MAC của `PC2`!).",
      "Bước 4: Thực hành xóa sạch bảng MAC bằng lệnh `clear mac address-table dynamic` và gán cứng (Static) một địa chỉ MAC vào cổng `Fa0/2`."
    ],
    cli_commands: [
      "SW1# show mac address-table                       # Xem toàn bộ bảng địa chỉ MAC hiện có trong bộ nhớ CAM",
      "SW1# show mac address-table dynamic               # Chỉ lọc xem các địa chỉ MAC học tự động (tồn tại 300 giây)",
      "SW1# show mac address-table interface fa0/1       # Xem máy tính cắm ở cổng Fa0/1 có địa chỉ MAC là gì",
      "SW1# clear mac address-table dynamic              # Xóa toàn bộ các mục MAC học tự động để Switch học lại từ đầu",
      "SW1(config)# mac address-table static 0060.2f3a.07bc vlan 1 interface fastEthernet 0/2  # Gán tĩnh 1 MAC cố định"
    ],
    verify_vi: "Sau khi ping từ `PC1` sang `PC2` và `PC3`, lệnh `show mac address-table` trên `SW1` phải hiển thị đầy đủ cả 3 cổng `Fa0/1`, `Fa0/2` và `Fa0/3`."
  },
  {
    id: 9,
    moduleId: 8,
    level: "Trung cấp",
    title_vi: "Lab 09: Cấu Hình Định Tuyến Tĩnh (Static Route) & Tuyến Mặc Định (Default Route) Giữa 2 Router",
    objective_vi: "Hiểu cách 2 chiếc Router ở 2 chi nhánh khác nhau trao đổi gói tin xuyên mạng WAN bằng lệnh `ip route`, và cách cấu hình Default Route `0.0.0.0 0.0.0.0` đẩy lưu lượng ra ngoài Internet.",
    nodes: [
      { name: "PC1 (Chi nhánh HN)", type: "pc", x: 110, y: 120, ip: "192.168.10.10/24" },
      { name: "R1 (Hà Nội)", type: "router", x: 310, y: 120, ip: ".10.1 | WAN: 10.1.1.1" },
      { name: "R2 (TP.HCM)", type: "router", x: 530, y: 120, ip: "WAN: 10.1.1.2 | .20.1" },
      { name: "PC2 (Chi nhánh HCM)", type: "pc", x: 730, y: 120, ip: "192.168.20.10/24" }
    ],
    links: [
      { from: 0, to: 1, type: "crossover", p1: "Fa0", p2: "Gi0/0/0" },
      { from: 1, to: 2, type: "crossover", p1: "Gi0/0/1", p2: "Gi0/0/1", label: "WAN: 10.1.1.0/30" },
      { from: 2, to: 3, type: "crossover", p1: "Gi0/0/0", p2: "Fa0" }
    ],
    zones: [
      { x: 40, y: 30, w: 210, h: 175, label: "LAN 1: 192.168.10.0/24" },
      { x: 590, y: 30, w: 210, h: 175, label: "LAN 2: 192.168.20.0/24" }
    ],
    ipTable: [
      ["PC1", "Fa0", "192.168.10.10", "255.255.255.0", "192.168.10.1"],
      ["R1", "Gi0/0/0 (LAN 1)", "192.168.10.1", "255.255.255.0", "-"],
      ["R1", "Gi0/0/1 (WAN)", "10.1.1.1", "255.255.255.252 (/30)", "-"],
      ["R2", "Gi0/0/1 (WAN)", "10.1.1.2", "255.255.255.252 (/30)", "-"],
      ["R2", "Gi0/0/0 (LAN 2)", "192.168.20.1", "255.255.255.0", "-"],
      ["PC2", "Fa0", "192.168.20.10", "255.255.255.0", "192.168.20.1"]
    ],
    steps_vi: [
      "Bước 1: Dựng sơ đồ gồm 2 Router **ISR 4321** (`R1` và `R2`) nối với 2 máy tính `PC1` và `PC2`. Đặt đúng địa chỉ IP và Default Gateway trên 2 máy PC.",
      "Bước 2: Đặt IP và gõ lệnh `no shutdown` trên cả 2 cổng của `R1` (`Gi0/0/0` và `Gi0/0/1`) và 2 cổng của `R2` (`Gi0/0/0` và `Gi0/0/1`).",
      "Bước 3 (Tại sao chưa ping được?): Lúc này `R1` chỉ biết mạng `192.168.10.0/24` và `10.1.1.0/30` (nối trực tiếp vào nó), nhưng hoàn toàn **mù tịt về mạng `192.168.20.0/24` ở phía sau R2**! Bạn phải dạy cho `R1` đường đi bằng lệnh `ip route 192.168.20.0 255.255.255.0 10.1.1.2`.",
      "Bước 4 (Định tuyến luôn phải có 2 chiều đi và về!): Gói tin đi tới được `PC2` nhưng muốn quay về được `PC1` thì trên `R2` cũng phải khai báo chiều ngược lại: `ip route 192.168.10.0 255.255.255.0 10.1.1.1`."
    ],
    cli_commands: [
      "! === CẤU HÌNH TRÊN ROUTER R1 (HÀ NỘI) ===",
      "R1(config)# interface gigabitEthernet 0/0/0",
      "R1(config-if)# ip address 192.168.10.1 255.255.255.0",
      "R1(config-if)# no shutdown",
      "R1(config-if)# interface gigabitEthernet 0/0/1",
      "R1(config-if)# ip address 10.1.1.1 255.255.255.252",
      "R1(config-if)# no shutdown",
      "R1(config-if)# exit",
      "R1(config)# ip route 192.168.20.0 255.255.255.0 10.1.1.2   # Chỉ đường: Muốn tới mạng .20.0/24 thì đẩy sang IP 10.1.1.2 (R2)",
      "",
      "! === CẤU HÌNH TRÊN ROUTER R2 (TP.HCM) ===",
      "R2(config)# interface gigabitEthernet 0/0/0",
      "R2(config-if)# ip address 192.168.20.1 255.255.255.0",
      "R2(config-if)# no shutdown",
      "R2(config-if)# interface gigabitEthernet 0/0/1",
      "R2(config-if)# ip address 10.1.1.2 255.255.255.252",
      "R2(config-if)# no shutdown",
      "R2(config-if)# exit",
      "R2(config)# ip route 192.168.10.0 255.255.255.0 10.1.1.1   # Chỉ đường chiều về: Muốn về mạng .10.0/24 thì đẩy sang 10.1.1.1 (R1)",
      "R2# show ip route                                          # Kiểm tra dòng chữ 'S 192.168.10.0/24 [1/0] via 10.1.1.1'"
    ],
    verify_vi: "Từ `PC1` (`192.168.10.10`), mở Command Prompt gõ `ping 192.168.20.10` và `tracert 192.168.20.10` -> Kết quả thông suốt qua 2 trạm Router `192.168.10.1` -> `10.1.1.2` -> `192.168.20.10`!"
  },
  {
    id: 10,
    moduleId: 9,
    level: "Cơ bản - Trung cấp",
    title_vi: "Lab 10: Phân Tích Bản Tin ARP Request (Broadcast) & ARP Reply (Unicast) Khi Ping Cùng Mạng Và Khác Mạng",
    objective_vi: "Chứng minh tại sao gói Ping đầu tiên qua Router luôn bị rớt (`.!!!!` - 80% thành công) do Router phải tạm cất gói ICMP để đi phát gói ARP tìm địa chỉ MAC của máy đích.",
    nodes: [
      { name: "PC1", type: "pc", x: 120, y: 120, ip: "192.168.1.10/24" },
      { name: "SW1", type: "switch", x: 310, y: 120, ip: "Flood ARP Broadcast" },
      { name: "R1 (Gateway)", type: "router", x: 520, y: 120, ip: "Gi0/0: 192.168.1.1" },
      { name: "Server-WAN", type: "server", x: 720, y: 120, ip: "203.0.113.10/24" }
    ],
    links: [
      { from: 0, to: 1, type: "straight", p1: "Fa0", p2: "Fa0/1" },
      { from: 1, to: 2, type: "straight", p1: "Fa0/24", p2: "Gi0/0/0" },
      { from: 2, to: 3, type: "crossover", p1: "Gi0/0/1", p2: "Fa0" }
    ],
    zones: [
      { x: 45, y: 25, w: 540, h: 185, label: "MIỀN QUẢNG BÁ ARP (CHỈ TRONG MẠNG LAN 192.168.1.0/24)" }
    ],
    ipTable: [
      ["PC1", "Fa0", "192.168.1.10", "255.255.255.0", "192.168.1.1"],
      ["R1", "Gi0/0/0", "192.168.1.1", "255.255.255.0", "-"],
      ["R1", "Gi0/0/1", "203.0.113.1", "255.255.255.0", "-"],
      ["Server-WAN", "Fa0", "203.0.113.10", "255.255.255.0", "203.0.113.1"]
    ],
    steps_vi: [
      "Bước 1: Mở `PC1 -> Command Prompt`, gõ lệnh `arp -d` để xóa sạch bảng nhớ ARP Cache.",
      "Bước 2: Chuyển sang chế độ **Simulation Mode**, bấm nút **Show All/None** ở góc dưới rồi bấm **Edit Filters** -> chỉ tích chọn đúng 2 giao thức là **ARP** và **ICMP**.",
      "Bước 3: Từ `PC1` (`192.168.1.10`), gửi 1 gói Ping tới `Server-WAN` (`203.0.113.10` - nằm ở mạng khác). Bấm vào phong bì **ARP** vừa sinh ra trên `PC1`: Bạn sẽ thấy một điều cực kỳ thú vị — mặc dù IP Đích của lệnh Ping là `203.0.113.10`, nhưng gói **ARP Request lại hỏi xin địa chỉ MAC của `192.168.1.1` (Default Gateway)**! Vì `PC1` biết đích ở xa nên nó chỉ cần tìm MAC của cánh cửa Router gần nhất.",
      "Bước 4: Sau khi Ping thành công, quay lại `PC1` gõ `arp -a` và vào `R1` gõ `show ip arp` để đối chiếu bảng ánh xạ IP <-> MAC."
    ],
    cli_commands: [
      "C:\\> arp -d                                      # Xóa trắng bộ nhớ đệm ARP Cache trên PC1",
      "C:\\> ping 203.0.113.10                           # Gửi Ping xuyên qua Router R1 sang mạng 203.0.113.0/24",
      "C:\\> arp -a                                      # Lưu ý: PC1 chỉ lưu MAC của Default Gateway (192.168.1.1)!",
      "R1# show ip arp                                  # Xem bảng ARP của Router R1 (chứa cả MAC của PC1 lẫn Server-WAN)"
    ],
    verify_vi: "Trong kết quả `arp -a` trên `PC1`, bạn sẽ thấy địa chỉ IP `192.168.1.1` đi kèm địa chỉ MAC cổng `Gi0/0/0` của Router `R1`, tuyệt đối không bao giờ thấy MAC của `Server-WAN` vì Router đã chặn và thay mới lớp vỏ Tầng 2."
  },
  {
    id: 11,
    moduleId: 10,
    level: "Cơ bản - Trung cấp",
    title_vi: "Lab 11: Cấu Hình Cơ Bản Router Cisco ISR 4321 Nối 2 Mạng LAN Khác Nhau",
    objective_vi: "Thực hành cấu hình hoàn chỉnh một chiếc Router nối 2 phòng ban (Phòng Kinh Doanh `192.168.1.0/24` và Phòng Kỹ Thuật `192.168.2.0/24`), bật cổng bằng `no shutdown` và kiểm tra bằng `show ip interface brief`.",
    nodes: [
      { name: "PC-Sales", type: "pc", x: 110, y: 120, ip: "192.168.1.10/24" },
      { name: "SW-Sales", type: "switch", x: 265, y: 120, ip: "LAN 1" },
      { name: "R1 (Gateway)", type: "router", x: 430, y: 120, ip: ".1.1 & .2.1" },
      { name: "SW-Tech", type: "switch", x: 595, y: 120, ip: "LAN 2" },
      { name: "PC-Tech", type: "pc", x: 740, y: 120, ip: "192.168.2.10/24" }
    ],
    links: [
      { from: 0, to: 1, type: "straight", p1: "Fa0", p2: "Fa0/1" },
      { from: 1, to: 2, type: "straight", p1: "Gi0/1", p2: "Gi0/0/0" },
      { from: 2, to: 3, type: "straight", p1: "Gi0/0/1", p2: "Gi0/1" },
      { from: 3, to: 4, type: "straight", p1: "Fa0/1", p2: "Fa0" }
    ],
    zones: [
      { x: 40, y: 25, w: 310, h: 185, label: "LAN 1: 192.168.1.0/24 (GW: .1.1)" },
      { x: 505, y: 25, w: 300, h: 185, label: "LAN 2: 192.168.2.0/24 (GW: .2.1)" }
    ],
    ipTable: [
      ["R1", "GigabitEthernet0/0/0", "192.168.1.1", "255.255.255.0", "Default Gateway cho LAN 1"],
      ["R1", "GigabitEthernet0/0/1", "192.168.2.1", "255.255.255.0", "Default Gateway cho LAN 2"],
      ["PC-Sales", "FastEthernet0", "192.168.1.10", "255.255.255.0", "192.168.1.1"],
      ["PC-Tech", "FastEthernet0", "192.168.2.10", "255.255.255.0", "192.168.2.1"]
    ],
    steps_vi: [
      "Bước 1: Kéo 1 Router **ISR 4321**, 2 Switch **2960** và 2 máy **PC** ra màn hình. Đấu cáp thẳng như sơ đồ. Bạn sẽ thấy 2 sợi dây cắm vào Router hiện **Tam giác màu đỏ (Down)** vì cổng Router mặc định bị khóa!",
      "Bước 2: Đặt IP cho `PC-Sales` (`192.168.1.10`, Gateway `192.168.1.1`) và `PC-Tech` (`192.168.2.10`, Gateway `192.168.2.1`).",
      "Bước 3: Vào thẻ **CLI** của Router `R1`. Nếu máy hỏi `Would you like to enter the initial configuration dialog? [yes/no]:`, hãy gõ **`no`** rồi nhấn Enter.",
      "Bước 4: Cấu hình bảo mật cơ bản và đặt IP + `no shutdown` cho cả 2 cổng `Gi0/0/0` và `Gi0/0/1`. Ngay khi gõ `no shutdown`, đèn tam giác đỏ trên dây sẽ biến thành màu xanh lá!",
      "Bước 5: Từ `PC-Sales`, gõ `ping 192.168.2.10` để kiểm tra Router tự động định tuyến giữa 2 mạng nối trực tiếp (Connected Routes)."
    ],
    cli_commands: [
      "Router> enable",
      "Router# configure terminal",
      "Router(config)# hostname R1",
      "R1(config)# enable secret CiscoSecret123",
      "R1(config)# service password-encryption",
      "R1(config)# interface gigabitEthernet 0/0/0                  # Vào cổng nối với mạng Phòng Kinh Doanh (LAN 1)",
      "R1(config-if)# description Cua-ngo-Gateway-LAN-Sales",
      "R1(config-if)# ip address 192.168.1.1 255.255.255.0",
      "R1(config-if)# no shutdown                                   # Bật cổng lên trạng thái UP",
      "R1(config-if)# interface gigabitEthernet 0/0/1               # Vào cổng nối với mạng Phòng Kỹ Thuật (LAN 2)",
      "R1(config-if)# description Cua-ngo-Gateway-LAN-Tech",
      "R1(config-if)# ip address 192.168.2.1 255.255.255.0",
      "R1(config-if)# no shutdown",
      "R1(config-if)# end",
      "R1# copy running-config startup-config",
      "R1# show ip interface brief                                  # Kiểm tra cả 2 cổng Gi0/0/0 và Gi0/0/1 đều Status=up, Protocol=up"
    ],
    verify_vi: "Lệnh `show ip route` trên `R1` hiển thị 2 dòng `C` (`192.168.1.0/24` và `192.168.2.0/24`) và 2 dòng `L` (`192.168.1.1/32` và `192.168.2.1/32`). Ping từ `PC-Sales` sang `PC-Tech` thông 100%."
  },
  {
    id: 12,
    moduleId: 11,
    level: "Trung cấp - Trọng tâm thi CCNA",
    title_vi: "Lab 12: Thực Hành Chia Mạng Con VLSM Thực Tế (Chia 1 Mạng /24 Cho 3 Phòng Ban & Đường WAN)",
    objective_vi: "Từ 1 dải mạng gốc duy nhất `192.168.10.0/24`, tự tay tính toán chia mạng con theo kỹ thuật VLSM (từ lớn đến nhỏ: `/26`, `/27`, `/28`, `/30`) và áp dụng cấu hình thực tế lên Router & PC trong Packet Tracer.",
    nodes: [
      { name: "LAN-A (50 máy)", type: "pc", x: 120, y: 65, ip: ".10.10/26 (Mask .192)" },
      { name: "LAN-B (25 máy)", type: "pc", x: 120, y: 175, ip: ".10.70/27 (Mask .224)" },
      { name: "R1", type: "router", x: 370, y: 120, ip: "GW: .1 & .65" },
      { name: "R2", type: "router", x: 580, y: 120, ip: "GW: .113" },
      { name: "LAN-C (10 máy)", type: "pc", x: 740, y: 120, ip: ".10.115/28 (Mask .240)" }
    ],
    links: [
      { from: 0, to: 2, type: "crossover", p1: "Fa0", p2: "Gi0/0/0" },
      { from: 1, to: 2, type: "crossover", p1: "Fa0", p2: "Gi0/0/1" },
      { from: 2, to: 3, type: "serial", p1: "Se0/1/0", p2: "Se0/1/0", label: "WAN /30: .96/30" },
      { from: 3, to: 4, type: "crossover", p1: "Gi0/0/0", p2: "Fa0" }
    ],
    zones: [
      { x: 35, y: 20, w: 770, h: 195, label: "QUY HOẠCH VLSM TỪ MẠNG GỐC 192.168.10.0/24: LAN-A (/26) | LAN-B (/27) | WAN (/30) | LAN-C (/28)" }
    ],
    ipTable: [
      ["LAN-A (50 máy -> cần /26)", "R1 Gi0/0/0", "192.168.10.1", "255.255.255.192 (/26)", "Mạng .0 -> .63 (Host: .1 -> .62)"],
      ["LAN-B (25 máy -> cần /27)", "R1 Gi0/0/1", "192.168.10.65", "255.255.255.224 (/27)", "Mạng .64 -> .95 (Host: .65 -> .94)"],
      ["WAN R1-R2 (2 IP -> cần /30)", "Se0/1/0", ".97 (R1) & .98 (R2)", "255.255.255.252 (/30)", "Mạng .96 -> .99 (Broadcast: .99)"],
      ["LAN-C (10 máy -> cần /28)", "R2 Gi0/0/0", "192.168.10.113", "255.255.255.240 (/28)", "Mạng .112 -> .127 (Host: .113 -> .126)"]
    ],
    steps_vi: [
      "Bước 1 (Sắp xếp các mạng từ lớn nhất đến nhỏ nhất trước khi chia VLSM): • Lớn nhất là **LAN-A (50 máy)**: Cần $2^6 - 2 = 62$ IP -> Dùng **`/26` (`255.255.255.192`)**, lấy đoạn từ **`.0` đến `.63`** (Gateway R1 lấy `.1`, PC lấy `.10`).",
      "Bước 2: • Tiếp theo là **LAN-B (25 máy)**: Cần $2^5 - 2 = 30$ IP -> Dùng **`/27` (`255.255.255.224`)**, bắt đầu ngay sau `.63` tức là từ **`.64` đến `.95`** (Gateway R1 lấy `.65`, PC lấy `.70`).",
      "Bước 3: • Tiếp theo là **WAN nối R1-R2 (2 IP)**: Cần $2^2 - 2 = 2$ IP -> Dùng **`/30` (`255.255.255.252`)**, lấy từ **`.96` đến `.99`** (R1 lấy `.97`, R2 lấy `.98`). • Cuối cùng **LAN-C (10 máy)** dùng **`/28` (`255.255.255.240`)** từ **`.112` đến `.127`** (Gateway R2 lấy `.113`, PC lấy `.115`).",
      "Bước 4: Cấu hình đúng Subnet Mask khác nhau (`.192`, `.224`, `.252`, `.240`) lên từng cổng của `R1`, `R2` và các máy PC. Nếu bạn gõ nhầm hai cổng trùng dải mạng, Router Cisco sẽ báo lỗi ngay lập tức: `% 192.168.10.x overlaps with GigabitEthernet0/0/0`!"
    ],
    cli_commands: [
      "! === CẤU HÌNH VLSM TRÊN ROUTER R1 ===",
      "R1(config)# interface gigabitEthernet 0/0/0",
      "R1(config-if)# ip address 192.168.10.1 255.255.255.192       # Subnet /26 (.0 -> .63)",
      "R1(config-if)# no shutdown",
      "R1(config-if)# interface gigabitEthernet 0/0/1",
      "R1(config-if)# ip address 192.168.10.65 255.255.255.224      # Subnet /27 (.64 -> .95)",
      "R1(config-if)# no shutdown",
      "R1(config-if)# interface serial 0/1/0",
      "R1(config-if)# ip address 192.168.10.97 255.255.255.252      # Subnet /30 (.96 -> .99)",
      "R1(config-if)# no shutdown",
      "R1(config-if)# exit",
      "R1(config)# ip route 192.168.10.112 255.255.255.240 192.168.10.98  # Trỏ đường tới LAN-C (/28)"
    ],
    verify_vi: "Gõ `show ip route` trên `R1` sẽ thấy tiêu đề `192.168.10.0/24 is variably subnetted, 4 subnets, 4 masks` — chứng tỏ bạn đã cấu hình VLSM thành công!"
  },
  {
    id: 13,
    moduleId: 12,
    level: "Trung cấp",
    title_vi: "Lab 13: Triển Khai Mạng Chạy Song Song IPv4 & IPv6 (Dual-Stack) Và Tự Cấp Phát IPv6 SLAAC",
    objective_vi: "Cấu hình Router vừa chạy IPv4 vừa chạy IPv6 (Dual-Stack), bật tính năng `ipv6 unicast-routing` để máy tính tự động nhận địa chỉ IPv6 Global Unicast (`2001:db8:acad:1::/64`) qua cơ chế SLAAC mà không cần máy chủ DHCP.",
    nodes: [
      { name: "PC1 (Dual-Stack)", type: "pc", x: 140, y: 120, ip: "Auto SLAAC: 2001:db8:acad:1::..." },
      { name: "R1 (Dual-Stack)", type: "router", x: 430, y: 120, ip: "LLA: fe80::1 | GUA: ::1/64" },
      { name: "PC2 (Dual-Stack)", type: "pc", x: 710, y: 120, ip: "Auto SLAAC: 2001:db8:acad:2::..." }
    ],
    links: [
      { from: 0, to: 1, type: "crossover", p1: "Fa0", p2: "Gi0/0/0" },
      { from: 1, to: 2, type: "crossover", p1: "Gi0/0/1", p2: "Fa0" }
    ],
    zones: [
      { x: 45, y: 25, w: 325, h: 185, label: "LAN 1 IPv6: 2001:db8:acad:1::/64" },
      { x: 485, y: 25, w: 315, h: 185, label: "LAN 2 IPv6: 2001:db8:acad:2::/64" }
    ],
    ipTable: [
      ["R1", "Gi0/0/0", "2001:db8:acad:1::1/64", "Link-Local: fe80::1", "Phát gói RA cho LAN 1"],
      ["R1", "Gi0/0/1", "2001:db8:acad:2::1/64", "Link-Local: fe80::1", "Phát gói RA cho LAN 2"],
      ["PC1 & PC2", "Fa0", "Chọn chế độ 'Auto Config'", "Prefix /64", "Tự nhận IP qua SLAAC"]
    ],
    steps_vi: [
      "Bước 1 (Lệnh quan trọng nhất trong IPv6): Mặc định Router Cisco chỉ định tuyến IPv4 chứ **không định tuyến IPv6 và không phát gói tin RA**! Bạn bắt buộc phải gõ lệnh `ipv6 unicast-routing` ở chế độ Global Config trước tiên.",
      "Bước 2: Vào cổng `Gi0/0/0` của `R1`, đặt địa chỉ Link-Local cố định dễ nhớ là `ipv6 address fe80::1 link-local` và địa chỉ toàn cầu GUA là `ipv6 address 2001:db8:acad:1::1/64`, rồi gõ `no shutdown`. Làm tương tự cho `Gi0/0/1` với mạng `:2::1/64`.",
      "Bước 3 (Xem phép màu SLAAC trên PC): Mở `PC1 -> Desktop -> IP Configuration`, tại mục **IPv6 Configuration**, tích chọn nút **Auto Config**. Chỉ trong 1 giây, `PC1` nhận được bản tin RA từ `R1` và tự ghép địa chỉ MAC (theo chuẩn EUI-64) vào đuôi `2001:db8:acad:1::` để có địa chỉ IPv6 hoàn chỉnh, đồng thời tự điền `IPv6 Default Gateway = FE80::1`!"
    ],
    cli_commands: [
      "R1(config)# ipv6 unicast-routing                             # BẮT BUỘC: Bật bộ định tuyến IPv6 & phát bản tin ICMPv6 RA",
      "R1(config)# interface gigabitEthernet 0/0/0",
      "R1(config-if)# ipv6 address fe80::1 link-local               # Đặt địa chỉ Link-Local ngắn gọn làm Default Gateway cho LAN",
      "R1(config-if)# ipv6 address 2001:db8:acad:1::1/64            # Đặt địa chỉ IPv6 Global Unicast (GUA) cho LAN 1",
      "R1(config-if)# no shutdown",
      "R1(config-if)# interface gigabitEthernet 0/0/1",
      "R1(config-if)# ipv6 address fe80::1 link-local               # Có thể dùng chung fe80::1 vì Link-Local chỉ có giá trị nội bộ từng cổng!",
      "R1(config-if)# ipv6 address 2001:db8:acad:2::1/64            # Đặt địa chỉ IPv6 Global Unicast cho LAN 2",
      "R1(config-if)# no shutdown",
      "R1(config-if)# end",
      "R1# show ipv6 interface brief                                # Kiểm tra cả địa chỉ FE80::1 và 2001:DB8:ACAD:... trên các cổng",
      "R1# show ipv6 route                                          # Xem bảng định tuyến IPv6"
    ],
    verify_vi: "Trên `PC1`, mở Command Prompt gõ `ipv6config` để xem địa chỉ IPv6 tự sinh, sau đó gõ `ping 2001:db8:acad:2::1` để kiểm tra thông mạng IPv6."
  },
  {
    id: 14,
    moduleId: 13,
    level: "Cơ bản - Trung cấp",
    title_vi: "Lab 14: Sử Dụng ICMP Ping, Extended Ping & Traceroute (Tracert) Để Truy Vết Đường Đi Qua 3 Router",
    objective_vi: "Sử dụng thành thạo công cụ `ping`, `extended ping` (chọn IP nguồn xuất phát trên Router) và `tracert` / `traceroute` để tìm chính xác vị trí đứt mạng trên chuỗi nhiều Router.",
    nodes: [
      { name: "PC1", type: "pc", x: 95, y: 120, ip: "192.168.1.10/24" },
      { name: "R1 (Hop 1)", type: "router", x: 265, y: 120, ip: "192.168.1.1" },
      { name: "R2 (Hop 2)", type: "router", x: 440, y: 120, ip: "10.1.1.2 | 10.2.2.1" },
      { name: "R3 (Hop 3)", type: "router", x: 610, y: 120, ip: "10.2.2.2 | .3.1" },
      { name: "Server", type: "server", x: 755, y: 120, ip: "192.168.3.100/24" }
    ],
    links: [
      { from: 0, to: 1, type: "crossover", p1: "Fa0", p2: "Gi0/0" },
      { from: 1, to: 2, type: "serial", p1: "Se0/1/0", p2: "Se0/1/0", label: "10.1.1.0/30" },
      { from: 2, to: 3, type: "serial", p1: "Se0/1/1", p2: "Se0/1/0", label: "10.2.2.0/30" },
      { from: 3, to: 4, type: "crossover", p1: "Gi0/0", p2: "Fa0" }
    ],
    zones: [
      { x: 35, y: 25, w: 775, h: 185, label: "TRUY VẾT HÀNH TRÌNH GÓI TIN QUA 3 TRẠM ROUTER BẰNG LỆNH TRACERT (ICMP TIME EXCEEDED)" }
    ],
    ipTable: [
      ["PC1", "Fa0", "192.168.1.10", "255.255.255.0", "192.168.1.1"],
      ["R1 -> R2", "Se0/1/0", "10.1.1.1 <-> 10.1.1.2", "255.255.255.252", "-"],
      ["R2 -> R3", "Se0/1/1", "10.2.2.1 <-> 10.2.2.2", "255.255.255.252", "-"],
      ["Server", "Fa0", "192.168.3.100", "255.255.255.0", "192.168.3.1"]
    ],
    steps_vi: [
      "Bước 1: Trên `PC1`, mở Command Prompt và gõ `tracert 192.168.3.100`. Bạn sẽ thấy màn hình in ra lần lượt 4 dòng: Trạm 1 là `192.168.1.1` (R1), Trạm 2 là `10.1.1.2` (R2), Trạm 3 là `10.2.2.2` (R3), và Trạm 4 là `192.168.3.100` (Server).",
      "Bước 2 (Giả lập sự cố mất đường về trên R3): Vào `R3`, xóa dòng định tuyến về mạng `192.168.1.0/24`. Lúc này trên `PC1` gõ `tracert 192.168.3.100`, bạn sẽ thấy gói tin đi qua được Trạm 1 (`R1`) và Trạm 2 (`R2`), nhưng đến Trạm 3 (`R3`) thì hiện `* * * Request timed out` — giúp kỹ sư khoanh vùng ngay lập tức lỗi nằm ở `R3`!",
      "Bước 3 (Kỹ thuật Extended Ping trên Router): Đứng tại `R1#`, nếu chỉ gõ `ping 192.168.3.100`, Router sẽ lấy IP cổng WAN `10.1.1.1` làm nguồn gửi đi. Để kiểm tra xem mạng LAN `192.168.1.1` của `R1` có đi tới được Server không, hãy gõ `ping` rồi nhấn Enter để chọn `Extended commands [n]: y` và nhập `Source address: 192.168.1.1`!"
    ],
    cli_commands: [
      "C:\\> tracert 192.168.3.100                       # Lệnh truy vết đường đi trên Windows (dùng gói ICMP)",
      "R1# traceroute 192.168.3.100                     # Lệnh truy vết đường đi trên Cisco IOS CLI",
      "R1# ping                                         # Gõ ping không tham số rồi Enter để mở chế độ Extended Ping:",
      "Protocol [ip]:                                   # Nhấn Enter chọn IP",
      "Target IP address: 192.168.3.100                 # Nhập IP đích cần kiểm tra",
      "Repeat count [5]: 10                             # Gửi 10 gói liên tiếp",
      "Extended commands [n]: y                         # Gõ y để chọn địa chỉ IP nguồn xuất phát",
      "Source address or interface: 192.168.1.1         # Giả lập gói tin xuất phát từ cổng LAN Gi0/0 của R1!"
    ],
    verify_vi: "Hiểu rõ ý nghĩa các ký hiệu trả về trên Cisco IOS: `!` (Thành công), `.` (Hết giờ Timeout), `U` (Destination Unreachable - Thiếu Route hoặc bị ACL chặn)."
  },
  {
    id: 15,
    moduleId: 14,
    level: "Trung cấp",
    title_vi: "Lab 15: Quan Sát Bắt Tay 3 Bước TCP (SYN, SYN-ACK, ACK) & So Sánh Với UDP Trên Packet Tracer",
    objective_vi: "Bắt tận tay quá trình **TCP 3-Way Handshake** khi trình duyệt truy cập Web (Port 80) và so sánh với gói tin **UDP** gửi thẳng không cần bắt tay của dịch vụ DNS (Port 53).",
    nodes: [
      { name: "PC-Client", type: "pc", x: 160, y: 120, ip: "192.168.1.10/24" },
      { name: "SW1", type: "switch", x: 420, y: 120, ip: "Layer 2" },
      { name: "Multi-Server", type: "server", x: 680, y: 120, ip: "192.168.1.100 (DNS+Web)" }
    ],
    links: [
      { from: 0, to: 1, type: "straight", p1: "Fa0", p2: "Fa0/1" },
      { from: 1, to: 2, type: "straight", p1: "Fa0/2", p2: "Fa0" }
    ],
    zones: [
      { x: 60, y: 25, w: 720, h: 185, label: "SO SÁNH UDP (DNS PORT 53) VÀ TCP 3-WAY HANDSHAKE (HTTP PORT 80)" }
    ],
    ipTable: [
      ["PC-Client", "Fa0", "192.168.1.10", "255.255.255.0", "DNS Server: 192.168.1.100"],
      ["Multi-Server", "Fa0", "192.168.1.100", "255.255.255.0", "Bật dịch vụ DNS + HTTP"]
    ],
    steps_vi: [
      "Bước 1: Trên `Multi-Server`, vào thẻ **Services -> DNS**, bật **ON**, thêm bản ghi tên miền `www.cisco.local` trỏ về `192.168.1.100` rồi bấm **Add**. Trên `PC-Client`, điền `DNS Server = 192.168.1.100`.",
      "Bước 2: Bật **Simulation Mode**, lọc hiển thị 3 giao thức: **DNS**, **TCP**, và **HTTP**.",
      "Bước 3: Mở **Web Browser** trên `PC-Client`, gõ `http://www.cisco.local` rồi bấm **Go**. Bấm nút **Capture / Forward** từng bước một và quan sát:",
      "• **Giai đoạn 1 (UDP - Không bắt tay)**: `PC-Client` bắn ngay 1 phong bì **DNS** (bọc trong **UDP** với `Dst Port = 53`) sang Server và nhận về câu trả lời IP `192.168.1.100` ngay lập tức mà không hề có bước chào hỏi trước!",
      "• **Giai đoạn 2 (TCP 3-Way Handshake)**: Trước khi gửi yêu cầu tải trang Web HTTP, `PC-Client` phải trao đổi 3 phong bì **TCP** màu tím với Server (`Dst Port = 80`): Phong bì 1 bật cờ **SYN**, Phong bì 2 trả về **SYN + ACK**, Phong bì 3 xác nhận **ACK**. Chỉ sau khi xong bước 3, phong bì **HTTP GET** mới được phép bay đi!"
    ],
    cli_commands: [
      "C:\\> netstat -n                                  # Xem các phiên kết nối TCP đang ở trạng thái ESTABLISHED hoặc TIME_WAIT",
      "# Quan sát trong thẻ Outbound PDU Details của phong bì TCP:",
      "# Source Port: 1025 (Cổng ngẫu nhiên trên PC)  --->  Destination Port: 80 (Dịch vụ HTTP trên Server)",
      "# Cờ điều khiển (Flags): Bước 1 [SYN]  --->  Bước 2 [SYN, ACK]  --->  Bước 3 [ACK]"
    ],
    verify_vi: "Mở cửa sổ `netstat` trên `PC-Client` ngay sau khi tải trang web để thấy kết nối `192.168.1.10:1025 -> 192.168.1.100:80`."
  }
];

const PACKET_TRACER_LABS_PART2 = [
  {
    id: 16,
    moduleId: 15,
    level: "Trung cấp",
    title_vi: "Lab 16: Cấu Hình Router Cisco Làm Máy Chủ Cấp IP Tự Động (DHCPv4 Server) Cho Mạng LAN",
    objective_vi: "Biết cách biến chiếc Router Cisco thành máy chủ DHCP cấp tự động Địa chỉ IP, Subnet Mask, Default Gateway và DNS Server cho toàn bộ máy tính trong công ty, đồng thời loại trừ các địa chỉ IP tĩnh (`ip dhcp excluded-address`).",
    nodes: [
      { name: "PC1 (DHCP Client)", type: "pc", x: 130, y: 70, ip: "Nhận tự động: .1.11" },
      { name: "PC2 (DHCP Client)", type: "pc", x: 130, y: 175, ip: "Nhận tự động: .1.12" },
      { name: "SW1 (2960)", type: "switch", x: 410, y: 120, ip: "Layer 2" },
      { name: "R1 (DHCP Server)", type: "router", x: 680, y: 120, ip: "Gi0/0/0: 192.168.1.1" }
    ],
    links: [
      { from: 0, to: 2, type: "straight", p1: "Fa0", p2: "Fa0/1" },
      { from: 1, to: 2, type: "straight", p1: "Fa0", p2: "Fa0/2" },
      { from: 2, to: 3, type: "straight", p1: "Gi0/1", p2: "Gi0/0/0", label: "DHCP D-O-R-A" }
    ],
    zones: [
      { x: 45, y: 20, w: 730, h: 195, label: "CẤP PHÁT IP TỰ ĐỘNG QUA 4 BƯỚC DHCP (DISCOVER - OFFER - REQUEST - ACK)" }
    ],
    ipTable: [
      ["R1 (DHCP Server)", "Gi0/0/0", "192.168.1.1", "255.255.255.0", "Giữ lại .1 -> .10 cho thiết bị tĩnh"],
      ["PC1 & PC2", "Fa0", "Chọn nút 'DHCP'", "Nhận từ .1.11 trở đi", "GW: 192.168.1.1 | DNS: 8.8.8.8"]
    ],
    steps_vi: [
      "Bước 1 (Nguyên tắc sống còn khi cấu hình DHCP): Trước khi tạo bể cấp IP (DHCP Pool), bạn **phải cất riêng các địa chỉ IP dành cho Router, Switch, Server** bằng lệnh `ip dhcp excluded-address 192.168.1.1 192.168.1.10` để Router không đem cấp nhầm IP của chính nó cho nhân viên!",
      "Bước 2: Tạo bể cấp IP tên là `LAN-POOL` bằng lệnh `ip dhcp pool LAN-POOL`, khai báo dải mạng `network 192.168.1.0 255.255.255.0`, cổng ra `default-router 192.168.1.1` và máy chủ tên miền `dns-server 8.8.8.8`.",
      "Bước 3: Mở `PC1` và `PC2` -> **Desktop -> IP Configuration** -> chuyển từ **Static** sang **DHCP**. Quan sát dòng thông báo `DHCP request successful` và địa chỉ IP tự nhảy vào ô là `192.168.1.11` và `192.168.1.12`!"
    ],
    cli_commands: [
      "R1(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.10  # Loại trừ 10 IP đầu tiên không đem cấp phát",
      "R1(config)# ip dhcp pool LAN-POOL                              # Tạo bể cấp phát IP tên là LAN-POOL",
      "R1(dhcp-config)# network 192.168.1.0 255.255.255.0             # Khai báo dải mạng cần cấp",
      "R1(dhcp-config)# default-router 192.168.1.1                    # Cấp kèm thông số Default Gateway cho máy trạm",
      "R1(dhcp-config)# dns-server 8.8.8.8                            # Cấp kèm thông số DNS Server cho máy trạm",
      "R1(dhcp-config)# end",
      "R1# show ip dhcp binding                                       # Xem danh sách máy tính nào (MAC) đang thuê IP nào"
    ],
    verify_vi: "Gõ `R1# show ip dhcp binding` trên Router để thấy danh sách địa chỉ MAC của `PC1` và `PC2` gắn với IP `.1.11` và `.1.12`."
  },
  {
    id: 17,
    moduleId: 15,
    level: "Trung cấp - Nâng cao",
    title_vi: "Lab 17: Cấu Hình Chuyển Tiếp DHCP Xuyên Router Bằng Lệnh `ip helper-address` (DHCP Relay Agent)",
    objective_vi: "Giải quyết bài toán thực tế: Khi máy chủ DHCP nằm ở Phòng Server (Mạng B), làm sao máy tính nhân viên ở Phòng Kế Toán (Mạng A) xin được IP khi Router chặn đứng gói Broadcast DHCP Discover?",
    nodes: [
      { name: "PC-KeToan", type: "pc", x: 110, y: 120, ip: "Xin IP mạng .10.x/24" },
      { name: "SW1", type: "switch", x: 270, y: 120, ip: "LAN A" },
      { name: "R1 (Relay Agent)", type: "router", x: 450, y: 120, ip: "ip helper-address" },
      { name: "DHCP-Server", type: "server", x: 710, y: 120, ip: "192.168.99.100/24" }
    ],
    links: [
      { from: 0, to: 1, type: "straight", p1: "Fa0", p2: "Fa0/1" },
      { from: 1, to: 2, type: "straight", p1: "Gi0/1", p2: "Gi0/0/0" },
      { from: 2, to: 3, type: "crossover", p1: "Gi0/0/1", p2: "Fa0", label: "Chuyển thành Unicast" }
    ],
    zones: [
      { x: 40, y: 25, w: 340, h: 185, label: "LAN KẾ TOÁN: 192.168.10.0/24" },
      { x: 540, y: 25, w: 260, h: 185, label: "PHÒNG SERVER: 192.168.99.0/24" }
    ],
    ipTable: [
      ["R1", "Gi0/0/0 (LAN Kế Toán)", "192.168.10.1/24", "Cấu hình `ip helper-address 192.168.99.100`", "Đón gói Broadcast"],
      ["R1", "Gi0/0/1 (Phòng Server)", "192.168.99.1/24", "255.255.255.0", "Nối tới DHCP Server"],
      ["DHCP-Server", "Fa0", "192.168.99.100/24", "GW: 192.168.99.1", "Tạo Pool 192.168.10.0/24"]
    ],
    steps_vi: [
      "Bước 1: Trên `DHCP-Server` (`192.168.99.100`), vào thẻ **Services -> DHCP**, bật **ON**, tạo thêm một Pool tên `POOL-KETOAN` với Default Gateway `192.168.10.1`, Start IP `192.168.10.20`, Subnet Mask `255.255.255.0` rồi bấm **Add**.",
      "Bước 2: Nếu lúc này bạn bật DHCP trên `PC-KeToan`, nó sẽ báo **DHCP Failed (169.254.x.x)**! Vì gói tin `DHCP Discover` là Broadcast nên bị cổng `Gi0/0/0` của `R1` chặn lại.",
      "Bước 3 (Câu lệnh cứu tinh): Vào đúng cổng `interface gigabitEthernet 0/0/0` (cổng hướng về phía nhân viên xin IP!) và gõ lệnh `ip helper-address 192.168.99.100`. Ngay lập tức `R1` sẽ đón gói Broadcast đó, đổi thành Unicast gửi sang máy chủ `.99.100` và lấy IP `.10.20` về cho `PC-KeToan`!"
    ],
    cli_commands: [
      "R1(config)# interface gigabitEthernet 0/0/0                 # Lưu ý: Phải vào cổng LAN nơi có máy tính nhân viên!",
      "R1(config-if)# ip address 192.168.10.1 255.255.255.0",
      "R1(config-if)# ip helper-address 192.168.99.100             # Chuyển tiếp gói DHCP Broadcast về IP của DHCP Server",
      "R1(config-if)# no shutdown",
      "R1(config-if)# interface gigabitEthernet 0/0/1",
      "R1(config-if)# ip address 192.168.99.1 255.255.255.0",
      "R1(config-if)# no shutdown"
    ],
    verify_vi: "Trên `PC-KeToan`, bật lại nút DHCP sẽ nhận được ngay địa chỉ `192.168.10.20/24` và Gateway `192.168.10.1` dù máy chủ DHCP nằm ở mạng `.99.0`!"
  },
  {
    id: 18,
    moduleId: 15,
    level: "Cơ bản - Trung cấp",
    title_vi: "Lab 18: Xây Dựng Hệ Thống Dịch Vụ Tầng Ứng Dụng Hoàn Chỉnh (DNS + Web HTTP/HTTPS + FTP + Email)",
    objective_vi: "Tự tay dựng một phòng Server doanh nghiệp thu nhỏ trên Packet Tracer chạy đủ 4 dịch vụ cốt lõi của Tầng 7: Phân giải tên miền DNS, Web Server, truyền file FTP và gửi nhận thư điện tử Email (SMTP/POP3).",
    nodes: [
      { name: "PC-User1", type: "pc", x: 130, y: 65, ip: "192.168.1.10/24" },
      { name: "PC-User2", type: "pc", x: 130, y: 175, ip: "192.168.1.20/24" },
      { name: "SW-Core", type: "switch", x: 410, y: 120, ip: "LAN Switch" },
      { name: "Enterprise-Srv", type: "server", x: 690, y: 120, ip: "192.168.1.100 (All-in-One)" }
    ],
    links: [
      { from: 0, to: 2, type: "straight", p1: "Fa0", p2: "Fa0/1" },
      { from: 1, to: 2, type: "straight", p1: "Fa0", p2: "Fa0/2" },
      { from: 2, to: 3, type: "straight", p1: "Gi0/1", p2: "Fa0" }
    ],
    zones: [
      { x: 45, y: 20, w: 735, h: 195, label: "HỆ THỐNG MÁY CHỦ DỊCH VỤ TẦNG 7: DNS (53) | HTTP (80) | FTP (21) | EMAIL (25/110)" }
    ],
    ipTable: [
      ["Enterprise-Srv", "Fa0", "192.168.1.100", "255.255.255.0", "Chạy DNS, HTTP, FTP, Email"],
      ["PC-User1", "Fa0", "192.168.1.10", "255.255.255.0", "DNS Server: 192.168.1.100"],
      ["PC-User2", "Fa0", "192.168.1.20", "255.255.255.0", "DNS Server: 192.168.1.100"]
    ],
    steps_vi: [
      "Bước 1 (Cấu hình DNS trên Server): Vào `Enterprise-Srv -> Services -> DNS`, bật **ON**, tạo bản ghi Type `A Record` tên là `congty.vn` trỏ về `192.168.1.100` -> bấm **Add**.",
      "Bước 2 (Cấu hình Email SMTP/POP3): Vào mục **Services -> EMAIL**, bật **ON** cả SMTP và POP3. Nhập `Domain Name = congty.vn` rồi bấm **Set**. Tạo 2 tài khoản: `nv1` (mật khẩu `123`) và `nv2` (mật khẩu `123`) rồi bấm dấu **`+`**.",
      "Bước 3 (Kiểm tra FTP tải file): Mở `PC-User1 -> Command Prompt`, gõ `ftp congty.vn`, đăng nhập bằng user `cisco` / password `cisco`, rồi gõ lệnh `dir` để xem danh sách file trên Server.",
      "Bước 4 (Kiểm tra gửi Email giữa 2 nhân viên): Mở `PC-User1 -> Desktop -> Email`, khai báo địa chỉ `nv1@congty.vn`, Incoming/Outgoing Mail Server là `congty.vn`. Soạn bức thư gửi tới `nv2@congty.vn`, sau đó qua `PC-User2` bấm nút **Receive** để nhận thư!"
    ],
    cli_commands: [
      "C:\\> nslookup congty.vn                         # Kiểm tra DNS dịch tên miền congty.vn ra 192.168.1.100",
      "C:\\> ftp congty.vn                              # Kết nối tới máy chủ FTP qua cổng TCP 21",
      "Username: cisco  |  Password: cisco              # Tài khoản FTP mặc định trên Server của Packet Tracer",
      "ftp> dir                                         # Xem danh sách các file hệ điều hành IOS lưu trên Server",
      "ftp> quit                                        # Đóng phiên làm việc FTP"
    ],
    verify_vi: "Cả 3 dịch vụ Web (`http://congty.vn`), FTP (`ftp congty.vn`) và gửi nhận thư giữa `nv1@congty.vn` <-> `nv2@congty.vn` đều hoạt động bằng tên miền."
  },
  {
    id: 19,
    moduleId: 16,
    level: "Trung cấp - Trọng tâm thi CCNA",
    title_vi: "Lab 19: Cấu Hình Quản Trị Từ Xa Mã Hóa An Toàn Bằng SSH v2 & Khóa Chặn Telnet Trên Router/Switch",
    objective_vi: "Thực hiện đầy đủ 5 bước chuẩn mực để bật giao thức mã hóa **SSH v2 (TCP Port 22)** trên thiết bị Cisco và khóa hoàn toàn giao thức không mã hóa Telnet.",
    nodes: [
      { name: "PC-Admin (SSH Client)", type: "pc", x: 180, y: 120, ip: "192.168.1.10/24" },
      { name: "R1 (SSH Server)", type: "router", x: 580, y: 120, ip: "Gi0/0/0: 192.168.1.1" }
    ],
    links: [
      { from: 0, to: 1, type: "crossover", p1: "Fa0", p2: "Gi0/0/0", label: "Mã hóa RSA 2048-bit (Port 22)" }
    ],
    zones: [
      { x: 80, y: 25, w: 660, h: 185, label: "5 BƯỚC CẤU HÌNH BẢO MẬT SSH v2 TRÊN CỔNG VTY (THAY THẾ HOÀN TOÀN TELNET)" }
    ],
    ipTable: [
      ["PC-Admin", "Fa0", "192.168.1.10", "255.255.255.0", "192.168.1.1"],
      ["R1", "Gi0/0/0", "192.168.1.1", "255.255.255.0", "User: admin / Pass: Admin@123"]
    ],
    steps_vi: [
      "Bước 1 (Đặt tên máy & Tên miền): Thuật toán sinh khóa mã hóa RSA bắt buộc thiết bị phải có tên khác mặc định (`hostname R1`) và có tên miền (`ip domain-name cisco.com`) để ghép thành tên khóa `R1.cisco.com`.",
      "Bước 2 (Sinh cặp khóa mã hóa RSA 2048-bit): Gõ lệnh `crypto key generate rsa`, khi máy hỏi `How many bits in the modulus [512]:`, hãy nhập **`2048`** (chuẩn bảo mật cao cho SSH v2).",
      "Bước 3 (Tạo tài khoản локал trong cơ sở dữ liệu máy): Gõ `username admin secret Admin@123` và bật `ip ssh version 2`.",
      "Bước 4 (Áp dụng lên cổng VTY và cấm Telnet): Vào `line vty 0 4`, gõ `login local` (bắt buộc tra cứu cả Username lẫn Password vừa tạo) và gõ `transport input ssh` (chỉ nhận SSH, từ chối mọi kết nối Telnet!).",
      "Bước 5 (Kiểm tra từ PC): Mở `PC-Admin -> Command Prompt`, gõ lệnh `ssh -l admin 192.168.1.1` (chú ý là chữ `-l` viết tắt của chữ *login*, không phải số 1!)."
    ],
    cli_commands: [
      "R1(config)# hostname R1                                      # Bước 1a: Đặt tên thiết bị",
      "R1(config)# ip domain-name cisco.com                         # Bước 1b: Đặt tên miền để tạo khóa RSA",
      "R1(config)# crypto key generate rsa                          # Bước 2: Sinh cặp khóa mã hóa bất đối xứng RSA",
      "How many bits in the modulus [512]: 2048                     # Nhập độ dài khóa 2048-bit",
      "R1(config)# username admin secret Admin@123                  # Bước 3: Tạo tài khoản người dùng cục bộ (Local DB)",
      "R1(config)# enable secret Enable@123                         # Đặt mật khẩu vào chế độ Đặc quyền",
      "R1(config)# ip ssh version 2                                 # Bắt buộc chỉ chạy phiên bản SSH v2 an toàn",
      "R1(config)# line vty 0 4                                     # Bước 4: Vào các đường kết nối từ xa VTY",
      "R1(config-line)# login local                                 # Yêu cầu xác thực bằng Username + Password cục bộ",
      "R1(config-line)# transport input ssh                         # CHỈ CHO PHÉP SSH (Khóa hoàn toàn Telnet Port 23!)",
      "R1(config-line)# exec-timeout 5 0                            # Tự động đăng xuất nếu 5 phút không gõ phím",
      "R1(config-line)# end",
      "C:\\> ssh -l admin 192.168.1.1                               # Lệnh đăng nhập SSH từ Command Prompt của PC"
    ],
    verify_vi: "Trên `PC-Admin`, nếu gõ `telnet 192.168.1.1` sẽ bị từ chối ngay (`Connection refused`), nhưng gõ `ssh -l admin 192.168.1.1` thì đăng nhập thành công!"
  },
  {
    id: 20,
    moduleId: 16,
    level: "Trung cấp - Trọng tâm thi CCNA",
    title_vi: "Lab 20: Bảo Mật Cổng Switch (Port Security) — Chống Người Lạ Cắm Nhờ Dây Mạng LAN",
    objective_vi: "Cấu hình tính năng **Port Security** trên cổng Switch để khóa chặt chỉ cho phép đúng chiếc máy tính của nhân viên (theo địa chỉ MAC `sticky`) được dùng mạng; nếu kẻ lạ rút dây cắm laptop khác vào thì cổng Switch tự động sập nguồn (`err-disabled`)!",
    nodes: [
      { name: "PC-HopLe (Nhân viên)", type: "pc", x: 150, y: 70, ip: "192.168.1.10 (Được phép)" },
      { name: "Laptop-KeLa (Hacker)", type: "pc", x: 150, y: 175, ip: "192.168.1.99 (Bị khóa cổng!)" },
      { name: "SW1 (Port-Security)", type: "switch", x: 520, y: 120, ip: "Cổng Fa0/1: Max MAC = 1" }
    ],
    links: [
      { from: 0, to: 2, type: "straight", p1: "Fa0", p2: "Fa0/1", label: "MAC Sticky Hợp Lệ" },
      { from: 1, to: 2, type: "straight", down: true, p1: "Fa0", p2: "Fa0/1", label: "Vi phạm -> Err-Disabled!" }
    ],
    zones: [
      { x: 55, y: 20, w: 690, h: 195, label: "BẢO MẬT CỔNG TRUY CẬP TẦNG 2 (SWITCHPORT PORT-SECURITY)" }
    ],
    ipTable: [
      ["SW1 Cổng Fa0/1", "Chế độ Access", "Maximum MAC = 1", "Học tự động: mac-address sticky", "Vi phạm: violation shutdown"]
    ],
    steps_vi: [
      "Bước 1 (Điều kiện bắt buộc để bật Port Security): Cổng Switch mặc định ở chế độ động (`dynamic auto`), không cho phép bật Port Security. Bạn **bắt buộc phải chuyển cổng sang chế độ Access** bằng lệnh `switchport mode access` trước, sau đó mới gõ lệnh `switchport port-security`!",
      "Bước 2: Giới hạn số lượng địa chỉ MAC tối đa là 1 (`switchport port-security maximum 1`), bật tính năng tự động dán chặt địa chỉ MAC của chiếc máy đầu tiên gửi gói tin vào cấu hình (`switchport port-security mac-address sticky`), và chọn hình thức xử lý vi phạm là ngắt cổng (`switchport port-security violation shutdown`).",
      "Bước 3: Từ `PC-HopLe`, ping vào Switch để Switch học MAC của `PC-HopLe`. Sau đó xóa dây cáp của `PC-HopLe`, cắm sang `Laptop-KeLa` và gửi 1 gói Ping -> Ngay lập tức đèn cổng `Fa0/1` biến thành **Màu Đỏ (Err-Disabled)**, khóa đứng kẻ xâm nhập!",
      "Bước 4 (Cách khôi phục cổng bị khóa Err-Disabled): Sau khi rút máy kẻ lạ ra, kỹ sư phải vào cổng `Fa0/1` gõ liên tiếp **2 lệnh**: `shutdown` rồi `no shutdown` thì cổng mới sống lại!"
    ],
    cli_commands: [
      "SW1(config)# interface fastEthernet 0/1",
      "SW1(config-if)# switchport mode access                       # BẮT BUỘC: Chuyển cổng sang chế độ Access tĩnh",
      "SW1(config-if)# switchport port-security                     # Bật tính năng Port Security trên cổng này",
      "SW1(config-if)# switchport port-security maximum 1           # Chỉ cho phép tối đa 1 địa chỉ MAC duy nhất",
      "SW1(config-if)# switchport port-security mac-address sticky  # Tự động ghi nhớ MAC của máy hợp lệ đầu tiên",
      "SW1(config-if)# switchport port-security violation shutdown  # Nếu phát hiện MAC lạ -> Khóa sập cổng (err-disabled)",
      "SW1(config-if)# end",
      "SW1# show port-security interface fastEthernet 0/1           # Xem trạng thái Port Security và số lần vi phạm (Violation Count)",
      "! === CÁCH MỞ LẠI CỔNG SAU KHI BỊ KHÓA ERR-DISABLED ===",
      "SW1(config)# interface fastEthernet 0/1",
      "SW1(config-if)# shutdown                                     # Bước 1: Tắt hẳn cổng",
      "SW1(config-if)# no shutdown                                  # Bước 2: Bật lại cổng"
    ],
    verify_vi: "Lệnh `show port-security interface fa0/1` hiển thị `Port Status : Secure-up` (khi máy hợp lệ cắm) hoặc `Secure-shutdown` (khi máy lạ cắm vào)."
  },
  {
    id: 21,
    moduleId: 7,
    level: "Trung cấp - Trọng tâm CCNA",
    title_vi: "Lab 21: Chia Mạng LAN Ảo (VLAN) & Cấu Hình Đường Truyền Trunking 802.1Q Giữa 2 Switch",
    objective_vi: "Hiểu bản chất VLAN giúp chia nhỏ Miền Quảng Bá (Broadcast Domain) ngay trên Switch: Tạo VLAN 10 (Kế toán) và VLAN 20 (Kỹ thuật), gán cổng Access vào từng VLAN và cấu hình đường nối **Trunk (IEEE 802.1Q)** giữa 2 Switch.",
    nodes: [
      { name: "PC1 (VLAN 10)", type: "pc", x: 110, y: 65, ip: "192.168.10.1/24" },
      { name: "PC2 (VLAN 20)", type: "pc", x: 110, y: 175, ip: "192.168.20.1/24" },
      { name: "SW1 (Tầng 1)", type: "switch", x: 320, y: 120, ip: "Access + Trunk" },
      { name: "SW2 (Tầng 2)", type: "switch", x: 530, y: 120, ip: "Access + Trunk" },
      { name: "PC3 (VLAN 10)", type: "pc", x: 730, y: 65, ip: "192.168.10.2/24" },
      { name: "PC4 (VLAN 20)", type: "pc", x: 730, y: 175, ip: "192.168.20.2/24" }
    ],
    links: [
      { from: 0, to: 2, type: "straight", p1: "Fa0", p2: "Fa0/1" },
      { from: 1, to: 2, type: "straight", p1: "Fa0", p2: "Fa0/2" },
      { from: 2, to: 3, type: "crossover", p1: "Gi0/1", p2: "Gi0/1", label: "802.1Q TRUNK (VLAN 10,20)" },
      { from: 3, to: 4, type: "straight", p1: "Fa0/1", p2: "Fa0" },
      { from: 3, to: 5, type: "straight", p1: "Fa0/2", p2: "Fa0" }
    ],
    zones: [
      { x: 35, y: 20, w: 770, h: 195, label: "PHÂN TÁCH MIỀN QUẢNG BÁ BẰNG VLAN 10 & VLAN 20 QUA ĐƯỜNG TRUNK 802.1Q" }
    ],
    ipTable: [
      ["PC1 & PC3 (Kế Toán)", "Cổng Fa0/1 trên SW1 & SW2", "192.168.10.1 & .10.2", "255.255.255.0", "Thuộc VLAN 10 (KE-TOAN)"],
      ["PC2 & PC4 (Kỹ Thuật)", "Cổng Fa0/2 trên SW1 & SW2", "192.168.20.1 & .20.2", "255.255.255.0", "Thuộc VLAN 20 (KY-THUAT)"],
      ["SW1 <-> SW2", "Cổng Gi0/1 <-> Gi0/1", "Chế độ Trunking (802.1Q)", "-", "Chở tất cả các VLAN đi qua"]
    ],
    steps_vi: [
      "Bước 1 (Tạo VLAN trên cả 2 Switch): Vào `SW1` và `SW2`, tạo `vlan 10` đặt tên `name KE-TOAN`, và `vlan 20` đặt tên `name KY-THUAT`.",
      "Bước 2 (Gán cổng nhân viên vào VLAN - Access Port): Trên cả 2 Switch, đưa cổng `Fa0/1` vào `vlan 10` và cổng `Fa0/2` vào `vlan 20`.",
      "Bước 3 (Cấu hình cổng Trunk nối giữa 2 Switch): Nếu cổng `Gi0/1` nối giữa `SW1` và `SW2` để mặc định (VLAN 1), các gói tin của VLAN 10 và VLAN 20 sẽ không đi sang được Switch bên kia! Bạn phải vào cổng `Gi0/1` gõ `switchport mode trunk` để Switch đóng nhãn thẻ **802.1Q Tag (4 Bytes)** ghi rõ gói tin thuộc VLAN nào trước khi phóng qua sợi cáp chung."
    ],
    cli_commands: [
      "! === THỰC HIỆN GIỐNG HỆT NHAU TRÊN CẢ SW1 VÀ SW2 ===",
      "SW1(config)# vlan 10                                         # Tạo VLAN số 10",
      "SW1(config-vlan)# name KE-TOAN                               # Đặt tên cho VLAN 10",
      "SW1(config-vlan)# vlan 20                                    # Tạo VLAN số 20",
      "SW1(config-vlan)# name KY-THUAT                              # Đặt tên cho VLAN 20",
      "SW1(config-vlan)# exit",
      "SW1(config)# interface fastEthernet 0/1                      # Vào cổng cắm máy Kế toán",
      "SW1(config-if)# switchport mode access                       # Thiết lập cổng truy cập đơn VLAN",
      "SW1(config-if)# switchport access vlan 10                    # Gán cổng Fa0/1 vào VLAN 10",
      "SW1(config-if)# interface fastEthernet 0/2                   # Vào cổng cắm máy Kỹ thuật",
      "SW1(config-if)# switchport mode access",
      "SW1(config-if)# switchport access vlan 20                    # Gán cổng Fa0/2 vào VLAN 20",
      "SW1(config-if)# interface gigabitEthernet 0/1                # Vào cổng Uplink nối sang Switch bên kia",
      "SW1(config-if)# switchport mode trunk                        # Chuyển thành đường trục Trunk 802.1Q chở đa VLAN",
      "SW1(config-if)# end",
      "SW1# show vlan brief                                         # Kiểm tra danh sách VLAN và các cổng thuộc từng VLAN",
      "SW1# show interfaces trunk                                   # Kiểm tra cổng Gi0/1 đang ở trạng thái 'trunking' (802.1q)"
    ],
    verify_vi: "`PC1` (VLAN 10 ở SW1) ping thông sang `PC3` (VLAN 10 ở SW2), nhưng hoàn toàn cách ly không thể ping sang `PC2` (VLAN 20) dù cắm chung một chiếc Switch!"
  },
  {
    id: 22,
    moduleId: 10,
    level: "Trung cấp - Nâng cao (Trọng tâm CCNA)",
    title_vi: "Lab 22: Định Tuyến Giữa Các VLAN Bằng Kỹ Thuật Router-on-a-Stick (Cổng Phụ Subinterfaces 802.1Q)",
    objective_vi: "Giúp các phòng ban khác VLAN (VLAN 10 và VLAN 20) có thể liên lạc được với nhau chỉ bằng **1 sợi dây cáp vật lý duy nhất** nối từ Switch lên Router thông qua kỹ thuật chia cổng con ảo (**Subinterfaces `Gi0/0/0.10` và `Gi0/0/0.20`**).",
    nodes: [
      { name: "PC1 (VLAN 10)", type: "pc", x: 140, y: 70, ip: "192.168.10.10/24" },
      { name: "PC2 (VLAN 20)", type: "pc", x: 140, y: 175, ip: "192.168.20.10/24" },
      { name: "SW1 (2960)", type: "switch", x: 420, y: 120, ip: "Gi0/1: TRUNK" },
      { name: "R1 (ROAS)", type: "router", x: 690, y: 120, ip: "Gi0/0/0.10 & .20" }
    ],
    links: [
      { from: 0, to: 2, type: "straight", p1: "Fa0", p2: "Fa0/1", label: "Access VLAN 10" },
      { from: 1, to: 2, type: "straight", p1: "Fa0", p2: "Fa0/2", label: "Access VLAN 20" },
      { from: 2, to: 3, type: "straight", p1: "Gi0/1", p2: "Gi0/0/0", label: "1 Dây Trunk 802.1Q" }
    ],
    zones: [
      { x: 50, y: 20, w: 730, h: 195, label: "ĐỊNH TUYẾN INTER-VLAN ROUTING: ROUTER-ON-A-STICK (SUBINTERFACES)" }
    ],
    ipTable: [
      ["R1 Cổng con 1", "Gi0/0/0.10", "192.168.10.1", "255.255.255.0", "encapsulation dot1Q 10 (GW cho VLAN 10)"],
      ["R1 Cổng con 2", "Gi0/0/0.20", "192.168.20.1", "255.255.255.0", "encapsulation dot1Q 20 (GW cho VLAN 20)"],
      ["PC1 (VLAN 10)", "Fa0", "192.168.10.10", "255.255.255.0", "Default Gateway: 192.168.10.1"],
      ["PC2 (VLAN 20)", "Fa0", "192.168.20.10", "255.255.255.0", "Default Gateway: 192.168.20.1"]
    ],
    steps_vi: [
      "Bước 1 (Trên Switch SW1): Tạo VLAN 10, VLAN 20; gán `Fa0/1` vào VLAN 10, `Fa0/2` vào VLAN 20. Quan trọng nhất: Cổng `Gi0/1` nối lên Router phải cấu hình là **`switchport mode trunk`**!",
      "Bước 2 (Trên Router R1 - Mở cổng vật lý): Vào cổng vật lý `interface gigabitEthernet 0/0/0`, **KHÔNG đặt địa chỉ IP** ở đây mà chỉ gõ lệnh `no shutdown` để bật sáng đèn vật lý.",
      "Bước 3 (Tạo 2 cổng con ảo Subinterfaces): Gõ `interface gigabitEthernet 0/0/0.10` -> **bắt buộc gõ lệnh `encapsulation dot1Q 10` trước** rồi mới gõ được `ip address 192.168.10.1 255.255.255.0`! Làm tương tự cho `interface gigabitEthernet 0/0/0.20` với `encapsulation dot1Q 20` và IP `192.168.20.1`."
    ],
    cli_commands: [
      "! === CẤU HÌNH TRÊN ROUTER R1 (ROUTER-ON-A-STICK) ===",
      "R1(config)# interface gigabitEthernet 0/0/0                  # Vào cổng vật lý chính",
      "R1(config-if)# no shutdown                                   # Chỉ bật nguồn cổng vật lý, không đặt IP ở đây!",
      "R1(config-if)# exit",
      "R1(config)# interface gigabitEthernet 0/0/0.10               # Tạo cổng con ảo số .10 cho VLAN 10",
      "R1(config-subif)# encapsulation dot1Q 10                     # BẮT BUỘC GÕ TRƯỚC: Đóng/mở nhãn VLAN 10 chuẩn 802.1Q",
      "R1(config-subif)# ip address 192.168.10.1 255.255.255.0      # Đặt IP làm Default Gateway cho VLAN 10",
      "R1(config-subif)# exit",
      "R1(config)# interface gigabitEthernet 0/0/0.20               # Tạo cổng con ảo số .20 cho VLAN 20",
      "R1(config-subif)# encapsulation dot1Q 20                     # Đóng/mở nhãn VLAN 20 chuẩn 802.1Q",
      "R1(config-subif)# ip address 192.168.20.1 255.255.255.0      # Đặt IP làm Default Gateway cho VLAN 20",
      "R1(config-subif)# end",
      "R1# show ip interface brief                                  # Thấy cả Gi0/0/0.10 và Gi0/0/0.20 đều up/up!"
    ],
    verify_vi: "Từ `PC1` (`192.168.10.10` - VLAN 10) gõ `ping 192.168.20.10` (`PC2` - VLAN 20) -> Gói tin đi từ PC1 lên SW1, chạy qua dây Trunk lên R1, được R1 đổi nhãn từ VLAN 10 sang VLAN 20 rồi trả xuống SW1 về PC2 thành công!"
  },
  {
    id: 23,
    moduleId: 7,
    level: "Nâng cao (Thực chiến Doanh nghiệp)",
    title_vi: "Lab 23: Cấu Hình Định Tuyến Inter-VLAN Tốc Độ Cao Trên Switch Layer 3 (Cisco 3560/3650 Multilayer Switch)",
    objective_vi: "Sử dụng thiết bị **Switch Layer 3 (Multilayer Switch 3560/3650)** và lệnh `ip routing` để định tuyến giữa các VLAN ngay trong chip phần cứng của Switch mà không cần dùng đến Router ngoài.",
    nodes: [
      { name: "PC1 (VLAN 10)", type: "pc", x: 150, y: 70, ip: "192.168.10.10/24" },
      { name: "PC2 (VLAN 20)", type: "pc", x: 150, y: 175, ip: "192.168.20.10/24" },
      { name: "MLS-3560 (Layer 3)", type: "l3switch", x: 520, y: 120, ip: "SVI 10: .10.1 | SVI 20: .20.1" }
    ],
    links: [
      { from: 0, to: 2, type: "straight", p1: "Fa0", p2: "Fa0/1", label: "VLAN 10" },
      { from: 1, to: 2, type: "straight", p1: "Fa0", p2: "Fa0/2", label: "VLAN 20" }
    ],
    zones: [
      { x: 55, y: 20, w: 690, h: 195, label: "ĐỊNH TUYẾN INTER-VLAN SIÊU TỐC BẰNG GIAO DIỆN SVI TRÊN SWITCH LAYER 3" }
    ],
    ipTable: [
      ["MLS-3560", "interface vlan 10", "192.168.10.1", "255.255.255.0", "Default Gateway cho VLAN 10"],
      ["MLS-3560", "interface vlan 20", "192.168.20.1", "255.255.255.0", "Default Gateway cho VLAN 20"]
    ],
    steps_vi: [
      "Bước 1: Trong Packet Tracer, vào mục **Switches** và kéo thiết bị **3560-24PS** hoặc **3650-24PS** (Multilayer Switch) ra màn hình.",
      "Bước 2: Tạo `vlan 10` và `vlan 20`, gán cổng `Fa0/1` vào `vlan 10` và `Fa0/2` vào `vlan 20`.",
      "Bước 3 (Câu lệnh kích hoạt chức năng Router trên Switch L3): Mặc định Switch Layer 3 tắt tính năng định tuyến! Bạn phải gõ lệnh **`ip routing`** ở chế độ Global Config.",
      "Bước 4: Tạo 2 cổng ảo SVI: `interface vlan 10` (đặt IP `192.168.10.1/24`, `no shutdown`) và `interface vlan 20` (đặt IP `192.168.20.1/24`, `no shutdown`)."
    ],
    cli_commands: [
      "MLS(config)# ip routing                                      # BẮT BUỘC: Bật bộ máy định tuyến Tầng 3 trên Switch!",
      "MLS(config)# vlan 10",
      "MLS(config-vlan)# vlan 20",
      "MLS(config-vlan)# exit",
      "MLS(config)# interface fastEthernet 0/1",
      "MLS(config-if)# switchport mode access",
      "MLS(config-if)# switchport access vlan 10",
      "MLS(config-if)# interface fastEthernet 0/2",
      "MLS(config-if)# switchport mode access",
      "MLS(config-if)# switchport access vlan 20",
      "MLS(config-if)# interface vlan 10                            # Tạo cổng ảo SVI làm Gateway cho VLAN 10",
      "MLS(config-if)# ip address 192.168.10.1 255.255.255.0",
      "MLS(config-if)# no shutdown",
      "MLS(config-if)# interface vlan 20                            # Tạo cổng ảo SVI làm Gateway cho VLAN 20",
      "MLS(config-if)# ip address 192.168.20.1 255.255.255.0",
      "MLS(config-if)# no shutdown",
      "MLS(config-if)# end",
      "MLS# show ip route                                           # Switch L3 hiện bảng định tuyến giống hệt Router!"
    ],
    verify_vi: "`PC1` ping sang `PC2` thông ngay lập tức với độ trễ dưới 1ms mà không cần bất kỳ chiếc Router rời nào."
  },
  {
    id: 24,
    moduleId: 7,
    level: "Trung cấp - Nâng cao",
    title_vi: "Lab 24: Chống Vòng Lặp Mạng Với Giao Thức Spanning Tree (STP), Bầu Chọn Root Bridge & Bật PortFast",
    objective_vi: "Quan sát cách giao thức **Spanning Tree Protocol (STP)** tự động khóa 1 cổng dự phòng (Đèn cam 🟠) khi nối 3 Switch thành vòng tròn để chống bão Broadcast, cách ép 1 Switch làm Root Bridge và bật `spanning-tree portfast` cho cổng cắm PC.",
    nodes: [
      { name: "SW1 (Root Bridge)", type: "switch", x: 420, y: 45, ip: "Priority = 4096" },
      { name: "SW2 (Access)", type: "switch", x: 220, y: 165, ip: "Default 32768" },
      { name: "SW3 (Access)", type: "switch", x: 620, y: 165, ip: "Khóa 1 cổng (Đèn cam)" }
    ],
    links: [
      { from: 0, to: 1, type: "crossover", p1: "Gi0/1", p2: "Gi0/1", label: "Forwarding (Xanh)" },
      { from: 0, to: 2, type: "crossover", p1: "Gi0/2", p2: "Gi0/1", label: "Forwarding (Xanh)" },
      { from: 1, to: 2, type: "crossover", stpBlock: true, p1: "Gi0/2", p2: "Gi0/2", label: "STP Blocked (Đèn Cam)" }
    ],
    zones: [
      { x: 110, y: 15, w: 620, h: 205, label: "CHỐNG VÒNG LẶP LAYER 2 VỚI SPANNING TREE PROTOCOL (IEEE 802.1D / PVST+)" }
    ],
    ipTable: [
      ["SW1 (Core Switch)", "VLAN 1", "Priority = 4096 (hoặc root primary)", "-", "Đóng vai trò Root Bridge (Tất cả cổng đều xanh)"],
      ["SW2 & SW3", "Gi0/2", "Priority mặc định = 32768", "-", "1 cổng bị khóa (Alternate Blocking - Đèn cam)"]
    ],
    steps_vi: [
      "Bước 1: Kéo 3 chiếc Switch 2960 ra màn hình và dùng cáp chéo nối thành hình tam giác khép kín. Sau 30 giây, bạn sẽ thấy có **5 đầu dây màu xanh lá** và **đúng 1 đầu dây giữ nguyên chấm tròn màu cam (Blocked)**! Nếu không có STP khóa đầu dây màu cam đó lại, các gói Broadcast sẽ chạy vòng tròn vĩnh viễn làm treo cứng cả 3 Switch chỉ trong 2 giây.",
      "Bước 2: Để chỉ định chiếc Switch mạnh nhất (`SW1`) làm trung tâm (**Root Bridge**), vào `SW1` gõ lệnh `spanning-tree vlan 1 root primary` (hoặc hạ Priority xuống `4096`).",
      "Bước 3 (Bật PortFast & BPDU Guard trên cổng cắm máy tính): Để nhân viên cắm dây mạng vào cổng `Fa0/1` là đèn xanh ngay lập tức (không phải chờ 30 giây đèn cam), hãy bật `spanning-tree portfast` và `spanning-tree bpduguard enable`."
    ],
    cli_commands: [
      "SW1(config)# spanning-tree mode rapid-pvst                   # Chuyển sang chuẩn Rapid-PVST+ (802.1w) hội tụ trong 1 giây",
      "SW1(config)# spanning-tree vlan 1 root primary               # Ép SW1 trở thành Root Bridge cho VLAN 1",
      "SW1(config)# interface range fastEthernet 0/1 - 20           # Chọn hàng loạt 20 cổng cắm máy tính nhân viên",
      "SW1(config-if-range)# switchport mode access",
      "SW1(config-if-range)# spanning-tree portfast                 # Bỏ qua 30 giây chờ đèn cam, cắm PC vào là xanh ngay!",
      "SW1(config-if-range)# spanning-tree bpduguard enable         # Khóa cổng ngay nếu ai đó lén cắm thêm Switch vào cổng PC",
      "SW1(config-if-range)# end",
      "SW1# show spanning-tree                                      # Kiểm tra dòng 'This bridge is the root'"
    ],
    verify_vi: "Thử cắt đứt sợi cáp giữa `SW1` và `SW3` -> Cổng đèn cam giữa `SW2` và `SW3` lập tức chuyển sang **màu xanh lá** để cứu mạng không bị gián đoạn!"
  },
  {
    id: 25,
    moduleId: 7,
    level: "Nâng cao (Trọng tâm CCNA)",
    title_vi: "Lab 25: Gộp Băng Thông Nhiều Dây Cáp Giữa 2 Switch Bằng Công Nghệ EtherChannel (LACP 802.3ad)",
    objective_vi: "Bó 2 sợi cáp vật lý (`Fa0/23` và `Fa0/24`) nối giữa 2 Switch thành **1 đường ống logic duy nhất (`Port-channel 1`)** để vừa nhân đôi tốc độ băng thông vừa không bị STP khóa mất 1 dây.",
    nodes: [
      { name: "SW1 (2960)", type: "switch", x: 240, y: 120, ip: "Channel-Group 1 (Active)" },
      { name: "SW2 (2960)", type: "switch", x: 600, y: 120, ip: "Channel-Group 1 (Active)" }
    ],
    links: [
      { from: 0, to: 1, type: "crossover", p1: "Fa0/23-24", p2: "Fa0/23-24", label: "Gộp 2 dây thành Port-Channel 1 (LACP)" }
    ],
    zones: [
      { x: 110, y: 25, w: 620, h: 185, label: "GỘP BĂNG THÔNG ETHERCHANNEL CHUẨN QUỐC TẾ IEEE 802.3AD (LACP)" }
    ],
    ipTable: [
      ["SW1 & SW2", "Fa0/23 và Fa0/24", "channel-group 1 mode active", "Chạy giao thức LACP", "Tạo ra cổng ảo interface port-channel 1"]
    ],
    steps_vi: [
      "Bước 1: Nối 2 sợi cáp giữa cổng `Fa0/23`, `Fa0/24` của `SW1` sang `Fa0/23`, `Fa0/24` của `SW2`. Bình thường STP sẽ khóa 1 sợi màu cam.",
      "Bước 2: Trên cả `SW1` và `SW2`, chọn cùng lúc 2 cổng bằng lệnh `interface range fa0/23 - 24` và gõ `channel-group 1 mode active` (chế độ `active` kích hoạt chuẩn quốc tế **LACP**).",
      "Bước 3: Sau khi bó xong, vào cổng đại diện `interface port-channel 1` và chuyển thành đường Trunk bằng lệnh `switchport mode trunk`. Lúc này cả 2 sợi cáp vật lý đều sáng đèn xanh lá và truyền dữ liệu song song!"
    ],
    cli_commands: [
      "! === CẤU HÌNH GIỐNG NHAU TRÊN CẢ SW1 VÀ SW2 ===",
      "SW1(config)# interface range fastEthernet 0/23 - 24          # Chọn đồng thời cả 2 cổng vật lý",
      "SW1(config-if-range)# channel-group 1 mode active            # Bó vào nhóm số 1 chạy giao thức chuẩn LACP (Active)",
      "SW1(config-if-range)# exit",
      "SW1(config)# interface port-channel 1                        # Vào cổng đại diện sau khi đã bó",
      "SW1(config-if)# switchport mode trunk                        # Cấu hình Trunk trên Port-Channel sẽ tự áp xuống cả 2 dây!",
      "SW1(config-if)# end",
      "SW1# show etherchannel summary                               # Kiểm tra cột Port-channel hiện ký hiệu 'Po1(SU)' là thành công!"
    ],
    verify_vi: "Trong lệnh `show etherchannel summary`, ký hiệu chữ `S` hoa nghĩa là Layer 2 và chữ `U` hoa nghĩa là `In Use` (đang hoạt động tốt), kèm theo `Fa0/23(P)` và `Fa0/24(P)`."
  },
  {
    id: 26,
    moduleId: 8,
    level: "Trung cấp - Nâng cao (Trọng tâm CCNA)",
    title_vi: "Lab 26: Cấu Hình Giao Thức Định Tuyến Động OSPFv2 Đa Router (Single-Area OSPF Area 0)",
    objective_vi: "Thay vì phải gõ từng dòng `ip route` tĩnh bằng tay, cấu hình giao thức định tuyến động **OSPF (Open Shortest Path First)** để 3 chiếc Router tự động gửi bản tin Hello, tự học toàn bộ các mạng trong công ty và tự tìm đường đi mới khi đứt cáp.",
    nodes: [
      { name: "R1 (Router-ID 1.1.1.1)", type: "router", x: 220, y: 155, ip: "LAN: 192.168.1.0/24" },
      { name: "R2 (Router-ID 2.2.2.2)", type: "router", x: 420, y: 50, ip: "LAN: 192.168.2.0/24" },
      { name: "R3 (Router-ID 3.3.3.3)", type: "router", x: 620, y: 155, ip: "LAN: 192.168.3.0/24" }
    ],
    links: [
      { from: 0, to: 1, type: "serial", p1: "Gi0/0", p2: "Gi0/0", label: "10.1.12.0/30" },
      { from: 1, to: 2, type: "serial", p1: "Gi0/1", p2: "Gi0/0", label: "10.1.23.0/30" },
      { from: 0, to: 2, type: "serial", p1: "Gi0/1", p2: "Gi0/1", label: "10.1.13.0/30 (Dự phòng)" }
    ],
    zones: [
      { x: 110, y: 15, w: 620, h: 205, label: "ĐỊNH TUYẾN ĐỘNG OSPF VÙNG XƯƠNG SỐNG (BACKBONE AREA 0 - AD = 110)" }
    ],
    ipTable: [
      ["R1", "OSPF Process 1", "router-id 1.1.1.1", "Quảng bá: 192.168.1.0/24 & 10.1.12.0/30", "Wildcard Mask: 0.0.0.255 & 0.0.0.3"],
      ["R2", "OSPF Process 1", "router-id 2.2.2.2", "Quảng bá: 192.168.2.0/24, 10.1.12.0, 10.1.23.0", "Area 0"],
      ["R3", "OSPF Process 1", "router-id 3.3.3.3", "Quảng bá: 192.168.3.0/24 & 10.1.23.0/30", "Area 0"]
    ],
    steps_vi: [
      "Bước 1 (Hiểu khái niệm Wildcard Mask trong OSPF): Khác với Subnet Mask thông thường, câu lệnh `network` của OSPF dùng **Wildcard Mask (Mặt nạ đảo ngược)**: Lấy `255.255.255.255` trừ đi Subnet Mask! Ví dụ: `/24` (`255.255.255.0`) có Wildcard Mask là **`0.0.0.255`**; còn `/30` (`255.255.255.252`) có Wildcard Mask là **`0.0.0.3`**.",
      "Bước 2: Trên mỗi Router, khởi tạo tiến trình `router ospf 1`, gán mã định danh `router-id` (ví dụ `1.1.1.1`), và dùng lệnh `network ... area 0` để thông báo các mạng đang nối trực tiếp vào Router đó.",
      "Bước 3: Gõ lệnh `passive-interface gigabitEthernet 0/0/0` trên các cổng nối xuống máy tính nhân viên LAN để không phát bản tin OSPF Hello thừa thãi xuống PC."
    ],
    cli_commands: [
      "! === CẤU HÌNH OSPF TRÊN ROUTER R1 ===",
      "R1(config)# router ospf 1                                    # Bật tiến trình định tuyến OSPF số 1",
      "R1(config-router)# router-id 1.1.1.1                         # Đặt tên định danh duy nhất cho R1",
      "R1(config-router)# network 192.168.1.0 0.0.0.255 area 0      # Quảng bá mạng LAN /24 (Wildcard = 0.0.0.255) vào Area 0",
      "R1(config-router)# network 10.1.12.0 0.0.0.3 area 0          # Quảng bá đường nối /30 (Wildcard = 0.0.0.3) vào Area 0",
      "R1(config-router)# passive-interface gigabitEthernet 0/0/0   # Bảo mật: Không gửi gói OSPF Hello xuống mạng LAN của PC",
      "R1(config-router)# end",
      "R1# show ip ospf neighbor                                    # Kiểm tra trạng thái láng giềng đạt chữ 'FULL' là thành công!",
      "R1# show ip route ospf                                       # Xem các tuyến đường học được qua OSPF (ký hiệu chữ 'O', AD=110)"
    ],
    verify_vi: "Khi láng giềng OSPF thiết lập xong, màn hình CLI tự động báo `%OSPF-5-ADJCHG: Process 1, Nbr 2.2.2.2 ... from LOADING to FULL`, và bảng định tuyến hiện các dòng chữ `O`."
  },
  {
    id: 27,
    moduleId: 16,
    level: "Nâng cao (Trọng tâm thi CCNA)",
    title_vi: "Lab 27: Lọc Gói Tin Bảo Mật Bằng Danh Sách Kiểm Soát Truy Cập (Standard & Extended ACLs)",
    objective_vi: "Cấu hình bộ lọc **Access Control List (ACL)** trên Router như một bức tường lửa: Cho phép Phòng Kế Toán truy cập máy chủ Web (`TCP Port 80`), nhưng chặn không cho phép Ping hoặc truy cập máy chủ dữ liệu mật.",
    nodes: [
      { name: "PC-NhanVien", type: "pc", x: 130, y: 70, ip: "192.168.1.10 (Chỉ được vào Web)" },
      { name: "PC-QuanTriIT", type: "pc", x: 130, y: 175, ip: "192.168.1.99 (Toàn quyền)" },
      { name: "R1 (Bộ lọc ACL)", type: "router", x: 430, y: 120, ip: "Áp Extended ACL 100" },
      { name: "Server-Farm", type: "server", x: 700, y: 120, ip: "10.0.0.100 (Web + FTP + Ping)" }
    ],
    links: [
      { from: 0, to: 2, type: "crossover", p1: "Fa0", p2: "Gi0/0/0" },
      { from: 1, to: 2, type: "crossover", p1: "Fa0", p2: "Gi0/0/0" },
      { from: 2, to: 3, type: "crossover", p1: "Gi0/0/1", p2: "Fa0", label: "ip access-group 100 in" }
    ],
    zones: [
      { x: 45, y: 20, w: 735, h: 195, label: "LỌC GÓI TIN TẦNG 3 & TẦNG 4 VỚI EXTENDED ACCESS CONTROL LIST (ACL 100 - 199)" }
    ],
    ipTable: [
      ["Luật 1 (Permit)", "Host 192.168.1.99 (IT)", "Tới bất kỳ đâu (any)", "Giao thức: ip (Mọi dịch vụ)", "Cho phép máy IT toàn quyền"],
      ["Luật 2 (Permit)", "Mạng 192.168.1.0/24", "Host 10.0.0.100", "Giao thức: tcp eq 80 (www)", "Cho phép nhân viên xem Web"],
      ["Luật 3 (Deny ngầm định)", "any", "any", "ip", "Chặn tất cả các kết nối còn lại (Ping, FTP, SSH)"]
    ],
    steps_vi: [
      "Bước 1 (Phân biệt Standard ACL và Extended ACL): • **Standard ACL (Số 1–99)**: Chỉ kiểm tra duy nhất **IP Nguồn** -> Đặt càng gần Đích càng tốt. • **Extended ACL (Số 100–199)**: Kiểm tra đủ **Giao thức (TCP/UDP/ICMP) + IP Nguồn + IP Đích + Số hiệu Port (80, 443, 22...)** -> Đặt càng gần Nguồn càng tốt!",
      "Bước 2 (Quy tắc đọc từ trên xuống & Luật cấm ngầm định ở cuối): Router đọc từng dòng lệnh ACL từ trên xuống dưới; hễ khớp dòng nào là thực thi ngay dòng đó. Ở cuối mỗi danh sách ACL luôn có một dòng vô hình **`deny ip any any` (Chặn tất cả)**, nên trong một ACL bắt buộc phải có ít nhất 1 dòng `permit`!",
      "Bước 3 (Áp ACL vào cổng Router): Tạo xong ACL chưa có tác dụng gì cả cho đến khi bạn vào cổng `Gi0/0/0` và gắn nó vào chiều đi vào bằng lệnh `ip access-group 100 in`."
    ],
    cli_commands: [
      "! === TẠO DANH SÁCH EXTENDED ACL SỐ 100 TRÊN ROUTER R1 ===",
      "R1(config)# access-list 100 permit ip host 192.168.1.99 any                  # Luật 1: Máy IT (.1.99) được phép đi mọi nơi",
      "R1(config)# access-list 100 permit tcp 192.168.1.0 0.0.0.255 host 10.0.0.100 eq 80  # Luật 2: Nhân viên chỉ được vào Web (Port 80)",
      "R1(config)# access-list 100 deny icmp any any                                # Luật 3: Cấm nhân viên gõ lệnh Ping (ICMP)",
      "! === GẮN BỘ LỌC VÀO CỔNG LAN Gi0/0/0 CHIỀU ĐI VÀO (INBOUND) ===",
      "R1(config)# interface gigabitEthernet 0/0/0",
      "R1(config-if)# ip access-group 100 in                                        # Áp dụng ACL 100 cho mọi gói tin từ LAN đi vào R1",
      "R1(config-if)# end",
      "R1# show access-lists                                                        # Xem các dòng luật và số gói tin bị bắt (matches)"
    ],
    verify_vi: "Từ `PC-NhanVien` (`192.168.1.10`), mở trình duyệt Web gõ `http://10.0.0.100` thì lên trang web bình thường, nhưng mở Command Prompt gõ `ping 10.0.0.100` thì bị Router chặn ngay lập tức (`Reply from 192.168.1.1: Destination host unreachable - U.U.U`)!"
  },
  {
    id: 28,
    moduleId: 11,
    level: "Nâng cao (Trọng tâm thi CCNA & Đi làm)",
    title_vi: "Lab 28: Cấu Hình Dịch Địa Chỉ NAT Overload (PAT) Để Hàng Trăm Máy Tính LAN Ra Internet Bằng 1 IP Public",
    objective_vi: "Hiểu tại sao địa chỉ IP Private (`192.168.1.x`) không thể tự đi ra ngoài Internet và cách cấu hình **NAT Overload (PAT)** trên Router biên để dịch toàn bộ mạng nội bộ sang 1 địa chỉ IP Public duy nhất của cổng WAN.",
    nodes: [
      { name: "PC1 (IP Private)", type: "pc", x: 120, y: 120, ip: "192.168.1.10/24" },
      { name: "R1 (NAT Router)", type: "router", x: 380, y: 120, ip: "Inside: .1.1 | Outside: 203.0.113.2" },
      { name: "ISP-Router", type: "cloud", x: 600, y: 120, ip: "203.0.113.1" },
      { name: "Google-Web", type: "server", x: 750, y: 120, ip: "8.8.8.8" }
    ],
    links: [
      { from: 0, to: 1, type: "crossover", p1: "Fa0", p2: "Gi0/0/0", label: "ip nat inside" },
      { from: 1, to: 2, type: "serial", p1: "Gi0/0/1", p2: "Gi0/0/0", label: "ip nat outside" },
      { from: 2, to: 3, type: "crossover", p1: "Gi0/0/1", p2: "Fa0" }
    ],
    zones: [
      { x: 40, y: 25, w: 300, h: 185, label: "MẠNG BÊN TRONG (INSIDE: 192.168.1.0/24)" },
      { x: 430, y: 25, w: 380, h: 185, label: "MẠNG INTERNET CÔNG CỘNG (OUTSIDE: PUBLIC IP)" }
    ],
    ipTable: [
      ["R1 Cổng LAN", "Gi0/0/0", "192.168.1.1/24", "Đánh dấu: ip nat inside", "Mạng nội bộ Private"],
      ["R1 Cổng WAN", "Gi0/0/1", "203.0.113.2/30", "Đánh dấu: ip nat outside", "IP Public nhà mạng cấp"],
      ["Google-Web", "Fa0", "8.8.8.8/24", "Chỉ biết IP Public 203.0.113.2", "Không biết mạng 192.168.1.0"]
    ],
    steps_vi: [
      "Bước 1 (Đánh dấu đâu là cổng trong nhà, đâu là cổng ngoài đường): Vào cổng LAN `Gi0/0/0` gõ `ip nat inside`; vào cổng WAN `Gi0/0/1` gõ `ip nat outside`.",
      "Bước 2 (Tạo danh sách ACL chỉ định những IP nội bộ nào được phép dịch ra Internet): Gõ `access-list 1 permit 192.168.1.0 0.0.0.255`.",
      "Bước 3 (Câu lệnh vàng kích hoạt PAT Overload): Gõ lệnh `ip nat inside source list 1 interface gigabitEthernet 0/0/1 overload` (Từ khóa **`overload`** ở cuối cực kỳ quan trọng: nó cho phép hàng trăm máy tính cùng dùng chung 1 IP Public của cổng `Gi0/0/1` bằng cách phân biệt qua số hiệu Port!)."
    ],
    cli_commands: [
      "R1(config)# interface gigabitEthernet 0/0/0",
      "R1(config-if)# ip nat inside                                 # Bước 1a: Đánh dấu cổng mạng nội bộ (Inside)",
      "R1(config-if)# interface gigabitEthernet 0/0/1",
      "R1(config-if)# ip nat outside                                # Bước 1b: Đánh dấu cổng nối ra nhà mạng ISP (Outside)",
      "R1(config-if)# exit",
      "R1(config)# access-list 1 permit 192.168.1.0 0.0.0.255       # Bước 2: Khai báo dải IP Private được phép dịch NAT",
      "R1(config)# ip nat inside source list 1 interface gigabitEthernet 0/0/1 overload  # Bước 3: Bật PAT Overload!",
      "R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1             # Đẩy mặc định mọi lưu lượng Internet sang ISP",
      "R1(config)# end",
      "R1# show ip nat translations                                 # Xem bảng dịch Inside Local (192.168.1.10) -> Inside Global (203.0.113.2)"
    ],
    verify_vi: "Từ `PC1` (`192.168.1.10`), truy cập Web `http://8.8.8.8`, sau đó vào `R1` gõ `show ip nat translations` sẽ thấy rõ `Inside local = 192.168.1.10:1025` đã được biến hình thành `Inside global = 203.0.113.2:1025`!"
  },
  {
    id: 29,
    moduleId: 17,
    level: "Nâng cao",
    title_vi: "Lab 29: Vẽ Lại Sơ Đồ Mạng Bị Ẩn Bằng Giao Thức Khám Phá Láng Giềng CDP & LLDP, Đồng Bộ Giờ NTP & Syslog",
    objective_vi: "Thực hành kỹ năng của kỹ sư mới nhận bàn giao hệ thống mạng không có sơ đồ: dùng lệnh `show cdp neighbors detail` để dò tìm toàn bộ thiết bị kết nối xung quanh, đồng bộ thời gian NTP và gửi nhật ký về Syslog Server.",
    nodes: [
      { name: "SW-Access", type: "switch", x: 160, y: 120, ip: "192.168.1.2/24" },
      { name: "R1-Core", type: "router", x: 430, y: 120, ip: "192.168.1.1/24" },
      { name: "NTP-Syslog-Srv", type: "server", x: 700, y: 120, ip: "192.168.1.100/24" }
    ],
    links: [
      { from: 0, to: 1, type: "straight", p1: "Gi0/1", p2: "Gi0/0/0", label: "CDP / LLDP Frames" },
      { from: 1, to: 2, type: "crossover", p1: "Gi0/0/1", p2: "Fa0", label: "NTP (123) + Syslog (514)" }
    ],
    zones: [
      { x: 55, y: 25, w: 730, h: 185, label: "GIÁM SÁT & QUẢN TRỊ MẠNG DOANH NGHIỆP: CDP | LLDP | NTP | SYSLOG" }
    ],
    ipTable: [
      ["SW-Access", "VLAN 1", "192.168.1.2", "255.255.255.0", "Bật CDP & LLDP để khám phá R1-Core"],
      ["NTP-Syslog-Srv", "Fa0", "192.168.1.100", "255.255.255.0", "Bật dịch vụ NTP và SYSLOG trên Server"]
    ],
    steps_vi: [
      "Bước 1 (Khám phá hàng xóm bằng CDP và LLDP): Đứng trên `SW-Access`, gõ lệnh `show cdp neighbors` — máy sẽ cho bạn biết ngay cổng `Gi0/1` của bạn đang cắm vào cổng `Gi0/0/0` của chiếc Router tên là `R1-Core` (dòng máy `ISR4321`). Muốn biết luôn địa chỉ IP của `R1-Core` để SSH sang, hãy gõ thêm chữ `detail`: `show cdp neighbors detail`!",
      "Bước 2 (Bảo mật CDP trên cổng ra Internet): Vì CDP tiết lộ tên máy, phiên bản IOS và địa chỉ IP, bạn phải tắt CDP trên cổng nối ra ngoài nhà mạng ISP bằng lệnh `no cdp enable`.",
      "Bước 3 (Đồng bộ thời gian NTP & đẩy nhật ký lỗi về Syslog Server): Trên `NTP-Syslog-Srv`, bật dịch vụ **NTP** và **SYSLOG**. Trên `R1-Core`, gõ `ntp server 192.168.1.100` và `logging 192.168.1.100`."
    ],
    cli_commands: [
      "SW-Access# show cdp neighbors                                # Xem tên thiết bị, cổng nối và dòng máy của các thiết bị kế bên",
      "SW-Access# show cdp neighbors detail                         # Xem chi tiết cả Địa chỉ IP và phiên bản hệ điều hành IOS của hàng xóm",
      "R1-Core(config)# lldp run                                    # Bật chuẩn khám phá láng giềng quốc tế IEEE 802.1AB (LLDP)",
      "R1-Core(config)# interface gigabitEthernet 0/0/1",
      "R1-Core(config-if)# no cdp enable                            # Bảo mật: Tắt CDP trên cổng nối ra ngoài biên mạng",
      "R1-Core(config-if)# exit",
      "R1-Core(config)# ntp server 192.168.1.100                    # Đồng bộ đồng hồ hệ thống với máy chủ NTP (UDP Port 123)",
      "R1-Core(config)# service timestamps log datetime msec        # Đánh dấu ngày giờ chính xác tới mili-giây vào từng dòng nhật ký",
      "R1-Core(config)# logging host 192.168.1.100                  # Tự động bắn mọi bản tin nhật ký sự kiện về Syslog Server (UDP 514)",
      "R1-Core(config)# logging trap informational                  # Gửi nhật ký từ mức 0 (Emergency) đến mức 6 (Informational)"
    ],
    verify_vi: "Thử tắt/bật 1 cổng trên `R1-Core`, sau đó mở `NTP-Syslog-Srv -> Services -> SYSLOG` sẽ thấy bản tin báo trạng thái cổng được gửi về lưu trữ kèm dấu thời gian chính xác!"
  },
  {
    id: 30,
    moduleId: 17,
    level: "Tổng hợp (Đề thi thực hành cuối khóa CCNA 1)",
    title_vi: "Lab 30: Đồ Án Tổng Hợp Cuối Khóa — Thiết Kế, Cấu Hình & Bắt Bệnh Mạng Doanh Nghiệp Nhỏ Từ A Đến Z",
    objective_vi: "Kết hợp toàn bộ kiến thức của 17 Module CCNA 1 vào một mạng doanh nghiệp hoàn chỉnh: Chia mạng con VLSM, cấu hình VLAN & Router-on-a-Stick, cấp IP tự động DHCP, bật bảo mật SSH v2, Port Security, NAT ra Internet và xử lý 5 lỗi mạng kinh điển.",
    nodes: [
      { name: "PC-PhongBan", type: "pc", x: 100, y: 70, ip: "VLAN 10: .10.x/26" },
      { name: "IP-Phone-VoIP", type: "pc", x: 100, y: 175, ip: "VLAN 20: .64.x/27" },
      { name: "SW-Access (2960)", type: "switch", x: 295, y: 120, ip: "Port-Sec + Trunk" },
      { name: "R1-Edge (ISR4321)", type: "router", x: 515, y: 120, ip: "ROAS + DHCP + NAT + SSH" },
      { name: "ISP-Internet", type: "server", x: 740, y: 120, ip: "Web/DNS: 8.8.8.8" }
    ],
    links: [
      { from: 0, to: 2, type: "straight", p1: "Fa0", p2: "Fa0/1" },
      { from: 1, to: 2, type: "straight", p1: "Fa0", p2: "Fa0/2" },
      { from: 2, to: 3, type: "straight", p1: "Gi0/1", p2: "Gi0/0/0", label: "Trunk 802.1Q" },
      { from: 3, to: 4, type: "crossover", p1: "Gi0/0/1", p2: "Fa0", label: "WAN NAT Public" }
    ],
    zones: [
      { x: 30, y: 20, w: 575, h: 195, label: "MẠNG NỘI BỘ DOANH NGHIỆP (VLAN 10 + VLAN 20 + DHCP + SSH + PORT-SEC)" },
      { x: 630, y: 20, w: 185, h: 195, label: "INTERNET (8.8.8.8)" }
    ],
    ipTable: [
      ["VLAN 10 (Nhân viên - 50 máy)", "R1 Gi0/0/0.10", "192.168.1.1/26", "255.255.255.192", "DHCP Pool cấp từ .1.11 -> .1.62"],
      ["VLAN 20 (VoIP/IT - 20 máy)", "R1 Gi0/0/0.20", "192.168.1.65/27", "255.255.255.224", "DHCP Pool cấp từ .1.70 -> .1.94"],
      ["Đường WAN Internet", "R1 Gi0/0/1", "203.0.113.2/30", "255.255.255.252", "Chạy NAT Overload ra 8.8.8.8"]
    ],
    steps_vi: [
      "Bước 1 (Tầng 1 & Tầng 2 trên SW-Access): Đặt hostname, mật khẩu bảo mật; tạo VLAN 10 và VLAN 20; gán cổng Access kèm `spanning-tree portfast` và `switchport port-security`; cấu hình cổng `Gi0/1` lên Router là `switchport mode trunk`.",
      "Bước 2 (Định tuyến & Cấp IP trên R1-Edge): Bật cổng `Gi0/0/0` (`no shutdown`), tạo 2 cổng con `Gi0/0/0.10` (`/26`) và `Gi0/0/0.20` (`/27`). Tạo 2 bể DHCP tương ứng cấp IP tự động cho cả 2 VLAN.",
      "Bước 3 (Kết nối WAN, NAT & Bảo mật SSH): Đặt IP cổng WAN `Gi0/0/1`, tạo Default Route `0.0.0.0 0.0.0.0` trỏ ra ISP, bật NAT Overload (PAT) và cấu hình SSH v2 trên đường `line vty 0 4`.",
      "Bước 4 (Quy trình 5 điểm kiểm tra bắt bệnh nếu mất mạng): 1) Kiểm tra đèn cáp vật lý (`show ip interface brief`); 2) Kiểm tra cổng `Gi0/1` trên Switch đã bật `trunk` chưa (`show interfaces trunk`); 3) Kiểm tra máy tính đã nhận đúng IP/Gateway qua DHCP chưa (`ipconfig /all`); 4) Ping thử Default Gateway `.1.1`; 5) Kiểm tra bảng dịch NAT (`show ip nat translations`) và DNS (`nslookup`)."
    ],
    cli_commands: [
      "! === TỔNG HỢP LỆNH KIỂM TRA NGHIỆM THU TOÀN MẠNG (VERIFICATION CHECKLIST) ===",
      "SW-Access# show vlan brief                                   # 1. Kiểm tra các cổng Access đã nằm đúng VLAN 10, 20 chưa",
      "SW-Access# show interfaces trunk                             # 2. Kiểm tra đường Uplink Gi0/1 đã là 802.1Q Trunk chưa",
      "SW-Access# show port-security                                # 3. Kiểm tra bảo mật cổng Tầng 2",
      "R1-Edge# show ip interface brief                             # 4. Kiểm tra các cổng vật lý và cổng con (.10, .20) đều up/up",
      "R1-Edge# show ip dhcp binding                                # 5. Kiểm tra các máy trạm đã thuê được IP tự động chưa",
      "R1-Edge# show ip route                                       # 6. Kiểm tra bảng định tuyến có đủ Connected Routes & Default Route (S*)",
      "R1-Edge# show ip nat translations                            # 7. Kiểm tra NAT PAT đang dịch IP Private ra Internet"
    ],
    verify_vi: "Hoàn thành bài Lab số 30 này đồng nghĩa với việc bạn đã nắm vững 100% kỹ năng thực hành cốt lõi của chứng chỉ CCNA!"
  }
];

PACKET_TRACER_LABS.push(...PACKET_TRACER_LABS_PART2);

const PACKET_TRACER_LABS_PART3 = [
  {
    id: 31,
    moduleId: 10,
    level: "Nâng cao (Thực chiến Doanh nghiệp & Thi CCNA)",
    title_vi: "Lab 31: Cấu Hình Dự Phòng Cổng Mặc Định Tự Động Bằng Giao Thức HSRP (Hot Standby Router Protocol)",
    objective_vi: "Giải quyết điểm chết duy nhất (Single Point of Failure) tại Router biên: Cấu hình 2 chiếc Router `R1` (Active) và `R2` (Standby) cùng dùng chung 1 **Địa chỉ IP Ảo Default Gateway (`192.168.1.1`)** để nếu `R1` bị cháy nguồn hay đứt cáp, `R2` tự động nhảy lên thay thế trong 1 giây mà nhân viên không hề bị rớt mạng!",
    nodes: [
      { name: "PC-NhanVien", type: "pc", x: 120, y: 120, ip: "192.168.1.10 (GW: .1.1)" },
      { name: "SW1 (2960)", type: "switch", x: 300, y: 120, ip: "Virtual GW: 192.168.1.1" },
      { name: "R1 (HSRP Active)", type: "router", x: 500, y: 55, ip: "IP thật: .1.2 (Prio 150)" },
      { name: "R2 (HSRP Standby)", type: "router", x: 500, y: 185, ip: "IP thật: .1.3 (Prio 100)" },
      { name: "ISP-Internet", type: "server", x: 720, y: 120, ip: "8.8.8.8" }
    ],
    links: [
      { from: 0, to: 1, type: "straight", p1: "Fa0", p2: "Fa0/1" },
      { from: 1, to: 2, type: "straight", p1: "Gi0/1", p2: "Gi0/0/0", label: "Đường chính (Active)" },
      { from: 1, to: 3, type: "straight", p1: "Gi0/2", p2: "Gi0/0/0", label: "Đường dự phòng (Standby)" },
      { from: 2, to: 4, type: "crossover", p1: "Gi0/0/1", p2: "Fa0" },
      { from: 3, to: 4, type: "crossover", p1: "Gi0/0/1", p2: "Fa1" }
    ],
    zones: [
      { x: 40, y: 15, w: 760, h: 205, label: "DỰ PHÒNG GATEWAY TỰ ĐỘNG FHRP: HSRP GROUP 1 (VIRTUAL IP: 192.168.1.1 | VIRTUAL MAC: 0000.0c07.ac01)" }
    ],
    ipTable: [
      ["HSRP Virtual Gateway (Ảo)", "Group 1", "192.168.1.1", "255.255.255.0", "MAC ảo: 0000.0c07.ac01 (Group 1 = 01 Hex)"],
      ["R1 (Active Router)", "Gi0/0/0", "192.168.1.2 (IP thật)", "255.255.255.0", "standby 1 priority 150 + standby 1 preempt"],
      ["R2 (Standby Router)", "Gi0/0/0", "192.168.1.3 (IP thật)", "255.255.255.0", "Priority mặc định = 100 (Dự phòng nóng)"],
      ["PC-NhanVien", "Fa0", "192.168.1.10", "255.255.255.0", "Default Gateway trỏ về IP ảo: 192.168.1.1"]
    ],
    steps_vi: [
      "Bước 1 (Nguyên lý HSRP cực dễ hiểu): Thay vì trỏ Default Gateway của PC vào IP thật của `R1` (`.1.2`) hay `R2` (`.1.3`), ta cho cả `R1` và `R2` cùng tạo ra một **Người đại diện ảo có IP là `192.168.1.1`**. Mọi máy tính trong công ty đều trỏ Gateway về `.1.1`.",
      "Bước 2: Trên `R1`, đặt IP thật là `192.168.1.2`, khởi tạo nhóm HSRP số 1 với IP ảo `standby 1 ip 192.168.1.1`, nâng độ ưu tiên lên `standby 1 priority 150` (mặc định là 100, ai cao hơn làm **Active**), và bật quyền giành lại ngôi chủ khi sống dậy bằng lệnh `standby 1 preempt`.",
      "Bước 3: Trên `R2`, đặt IP thật là `192.168.1.3` và gõ `standby 1 ip 192.168.1.1` (giữ Priority mặc định 100 làm **Standby**).",
      "Bước 4 (Thử nghiệm rút cáp): Trên `PC-NhanVien`, gõ `ping -t 8.8.8.8` rồi dùng công cụ xóa cáp cắt đứt sợi dây của `R1` -> `R2` lập tức báo `%HSRP-6-STATECHANGE: GigabitEthernet0/0/0 Grp 1 state Standby -> Active` và mạng vẫn ping thông liên tục!"
    ],
    cli_commands: [
      "! === CẤU HÌNH TRÊN ROUTER R1 (ĐÓNG VAI TRÒ ACTIVE CHÍNH) ===",
      "R1(config)# interface gigabitEthernet 0/0/0",
      "R1(config-if)# ip address 192.168.1.2 255.255.255.0          # Địa chỉ IP vật lý thật của cổng R1",
      "R1(config-if)# standby version 2                             # Chuyển sang HSRP v2 (hỗ trợ tới 4095 nhóm và IPv6)",
      "R1(config-if)# standby 1 ip 192.168.1.1                      # Khai báo Địa chỉ IP Ảo (Virtual IP) dùng chung cho Group 1",
      "R1(config-if)# standby 1 priority 150                        # Tăng Priority lên 150 (> 100 mặc định) để R1 làm Active",
      "R1(config-if)# standby 1 preempt                             # BẮT BUỘC: Cho phép R1 giành lại quyền Active sau khi sửa xong!",
      "R1(config-if)# no shutdown",
      "",
      "! === CẤU HÌNH TRÊN ROUTER R2 (ĐÓNG VAI TRÒ STANDBY DỰ PHÒNG) ===",
      "R2(config)# interface gigabitEthernet 0/0/0",
      "R2(config-if)# ip address 192.168.1.3 255.255.255.0          # Địa chỉ IP vật lý thật của cổng R2",
      "R2(config-if)# standby version 2",
      "R2(config-if)# standby 1 ip 192.168.1.1                      # Cùng khai báo Địa chỉ IP Ảo 192.168.1.1",
      "R2(config-if)# no shutdown",
      "R1# show standby brief                                       # Kiểm tra bảng trạng thái HSRP (State = Active / Standby)"
    ],
    verify_vi: "Trên `PC-NhanVien`, gõ `arp -a` sẽ thấy địa chỉ IP `192.168.1.1` mang địa chỉ MAC ảo đặc trưng của HSRP (`0000.0c07.ac01` đối với HSRPv1 hoặc `0000.0c9f.f001` đối với HSRPv2)."
  },
  {
    id: 32,
    moduleId: 16,
    level: "Nâng cao (Bảo mật Tầng 2 Trọng tâm CCNA)",
    title_vi: "Lab 32: Chống Giả Mạo Máy Chủ DHCP & Đầu Độc ARP Bằng DHCP Snooping + Dynamic ARP Inspection (DAI)",
    objective_vi: "Triển khai bộ đôi lá chắn bảo mật Tầng 2 quan trọng nhất trên Switch doanh nghiệp: **DHCP Snooping** (chặn kẻ xấu tự dựng máy chủ DHCP lậu trong LAN) và **Dynamic ARP Inspection - DAI** (chặn đứng tấn công nghe lén ARP Spoofing).",
    nodes: [
      { name: "PC-NhanVien", type: "pc", x: 130, y: 65, ip: "Fa0/1: Untrusted Port" },
      { name: "Hacker-RogueDHCP", type: "server", x: 130, y: 175, ip: "Fa0/2: Untrusted (Bị chặn!)" },
      { name: "SW1 (Snooping+DAI)", type: "switch", x: 420, y: 120, ip: "Gi0/1 = TRUSTED PORT" },
      { name: "DHCP-Server-That", type: "server", x: 700, y: 120, ip: "192.168.1.100 (Hợp pháp)" }
    ],
    links: [
      { from: 0, to: 2, type: "straight", p1: "Fa0", p2: "Fa0/1", label: "Untrusted (Limit 10 pps)" },
      { from: 1, to: 2, type: "straight", down: true, p1: "Fa0", p2: "Fa0/2", label: "Chặn DHCPOFFER lậu!" },
      { from: 2, to: 3, type: "straight", p1: "Gi0/1", p2: "Fa0", label: "TRUSTED PORT (Cho phép)" }
    ],
    zones: [
      { x: 45, y: 20, w: 740, h: 195, label: "LÁ CHẮN BẢO MẬT TẦNG 2: DHCP SNOOPING (TRUST/UNTRUST) + DYNAMIC ARP INSPECTION (DAI)" }
    ],
    ipTable: [
      ["SW1 Cổng Gi0/1", "Nối lên DHCP Server thật", "ip dhcp snooping trust & ip arp inspection trust", "Cổng Tin cậy (Trusted)", "Cho phép trả lời DHCPOFFER"],
      ["SW1 Cổng Fa0/1 - 24", "Nối xuống PC nhân viên", "Mặc định là Untrusted (Không tin cậy)", "Giới hạn tốc độ 10 gói/s", "Cấm gửi DHCPOFFER & Kiểm tra ARP"]
    ],
    steps_vi: [
      "Bước 1 (Nguyên lý DHCP Snooping): Mặc định khi bật `ip dhcp snooping`, toàn bộ các cổng trên Switch đều trở thành **Untrusted (Không tin cậy)** — bất kỳ bản tin cấp IP (`DHCPOFFER`, `DHCPACK`) nào đi từ cổng Untrusted vào đều bị Switch vứt bỏ ngay lập tức! Bạn chỉ mở khóa **`ip dhcp snooping trust`** cho duy nhất cổng Uplink `Gi0/1` nối tới máy chủ DHCP thật của công ty.",
      "Bước 2 (Xây dựng Bảng dữ liệu vàng DHCP Snooping Binding Database): Mỗi khi máy tính nhân viên ở cổng `Fa0/1` nhận được IP hợp lệ từ máy chủ thật, Switch tự động ghi vào sổ: `[MAC của PC + IP vừa được cấp + Cổng Fa0/1 + VLAN 1]`.",
      "Bước 3 (Kích hoạt Dynamic ARP Inspection - DAI dựa trên bảng Snooping): Khi bật lệnh `ip arp inspection vlan 1`, bất kỳ kẻ tấn công nào ở cổng Untrusted cố tình phát gói tin **ARP Reply giả mạo** có cặp `[IP + MAC]` không khớp với cuốn sổ DHCP Snooping đều bị Switch chặn đứng và xóa bỏ!"
    ],
    cli_commands: [
      "SW1(config)# ip dhcp snooping                                # 1. Bật tính năng DHCP Snooping trên toàn Switch",
      "SW1(config)# ip dhcp snooping vlan 1                         # 2. Áp dụng DHCP Snooping cho VLAN 1 (hoặc vlan 10,20)",
      "SW1(config)# no ip dhcp snooping information option          # Tắt chèn Option 82 nếu DHCP Server nằm cùng Switch L2",
      "SW1(config)# interface gigabitEthernet 0/1                   # 3. Vào cổng nối lên Máy chủ DHCP thật / Router",
      "SW1(config-if)# ip dhcp snooping trust                       # Đánh dấu cổng Gi0/1 là cổng TIN CẬY (Trusted)",
      "SW1(config-if)# ip arp inspection trust                      # Tin cậy luôn bản tin ARP từ cổng Uplink này",
      "SW1(config-if)# exit",
      "SW1(config)# interface range fastEthernet 0/1 - 24           # 4. Vào toàn bộ các cổng cắm máy tính nhân viên (Untrusted)",
      "SW1(config-if-range)# ip dhcp snooping limit rate 10         # Chống DHCP Starvation: Giới hạn tối đa 10 gói DHCP/giây!",
      "SW1(config-if-range)# exit",
      "SW1(config)# ip arp inspection vlan 1                        # 5. Bật tính năng chống giả mạo ARP (DAI) cho VLAN 1",
      "SW1(config)# end",
      "SW1# show ip dhcp snooping binding                           # Xem cuốn sổ ánh xạ [MAC - IP - Lease - VLAN - Interface]"
    ],
    verify_vi: "Khi `Hacker-RogueDHCP` ở cổng `Fa0/2` bật dịch vụ DHCP lậu, mọi gói `DHCPOFFER` của hắn đều bị Switch hủy bỏ; chỉ có `DHCP-Server-That` ở cổng `Gi0/1` (Trusted) mới cấp được IP cho `PC-NhanVien`!"
  },
  {
    id: 33,
    moduleId: 4,
    level: "Nâng cao (Trọng tâm Domain 2.0 Thi CCNA)",
    title_vi: "Lab 33: Triển Khai Mạng Wi-Fi Doanh Nghiệp Với Bộ Điều Khiển Trung Tâm Cisco WLC-2504 & Lightweight AP",
    objective_vi: "Thực hành mô hình mạng không dây doanh nghiệp chuẩn CCNA 200-301: Kết nối **Bộ điều khiển không dây (Wireless LAN Controller - WLC 2504)** với **Lightweight Access Point (LAP-PT)** qua đường hầm **CAPWAP** và phát sóng Wi-Fi bảo mật **WPA2-PSK**.",
    nodes: [
      { name: "WLC-2504 (Controller)", type: "server", x: 140, y: 65, ip: "Mgmt: 192.168.1.250" },
      { name: "PC-Admin (Web GUI)", type: "pc", x: 140, y: 175, ip: "192.168.1.10 (HTTPS WLC)" },
      { name: "SW-PoE (2960)", type: "switch", x: 410, y: 120, ip: "Cấp nguồn PoE + DHCP" },
      { name: "LAP-1 (Lightweight AP)", type: "cloud", x: 640, y: 70, ip: "CAPWAP Tunnel -> WLC" },
      { name: "Laptop-WiFi", type: "pc", x: 730, y: 175, ip: "Bắt sóng: CongTy-WiFi" }
    ],
    links: [
      { from: 0, to: 2, type: "straight", p1: "Port1", p2: "Fa0/1", label: "WLC Management" },
      { from: 1, to: 2, type: "straight", p1: "Fa0", p2: "Fa0/2" },
      { from: 2, to: 3, type: "straight", p1: "Fa0/3 (PoE)", p2: "Gi0", label: "CAPWAP (UDP 5246/5247)" },
      { from: 3, to: 4, type: "crossover", p1: "Radio", p2: "WLAN0", label: "Sóng WPA2-AES" }
    ],
    zones: [
      { x: 40, y: 15, w: 765, h: 205, label: "KIẾN TRÚC WIRELESS DOANH NGHIỆP: CISCO WLC-2504 + LIGHTWEIGHT AP (ĐƯỜNG HẦM CAPWAP)" }
    ],
    ipTable: [
      ["WLC-2504", "Management Interface", "192.168.1.250", "255.255.255.0", "Truy cập giao diện Web qua https://192.168.1.250"],
      ["LAP-1 (3702i)", "GigabitEthernet0", "Nhận IP tự động qua DHCP", "255.255.255.0", "Tự động tìm WLC qua CAPWAP UDP 5246"],
      ["Laptop-WiFi", "Card mạng WPC300N", "Nhận IP tự động qua DHCP", "255.255.255.0", "Kết nối vào SSID: CongTy-WiFi (Pass: Cisco12345)"]
    ],
    steps_vi: [
      "Bước 1 (Kéo thiết bị WLC và Lightweight AP trong Packet Tracer): Chọn mục **[Network Devices] -> [Wireless Devices]** -> kéo bộ điều khiển **2504 (WLC)** và bộ phát **3702i (Lightweight AP)** ra màn hình. Lưu ý: Bộ phát `3702i` mặc định chưa cắm cục nguồn điện — bạn phải bấm vào nó, ở thẻ **Physical** kéo cục gạch nguồn **Power Brick** ở góc dưới cắm vào ổ điện của AP (hoặc cắm vào Switch cấp nguồn PoE)!",
      "Bước 2 (Truy cập giao diện đồ họa Web GUI của WLC): Mở `PC-Admin -> Desktop -> Web Browser`, nhập địa chỉ **`https://192.168.1.250`** (nhớ có chữ **`s`** trong `https`!). Đăng nhập tài khoản Admin của WLC.",
      "Bước 3 (Tạo mạng Wi-Fi mới trên WLC): Trên thanh menu ngang của WLC, bấm vào thẻ **WLANs** -> chọn **Create New -> Go**. Nhập `Profile Name = LAN-NhanVien`, `SSID = CongTy-WiFi` -> bấm **Apply**. Tích chọn ô **Status = Enabled**.",
      "Bước 4 (Bật bảo mật WPA2-PSK AES): Chuyển sang thẻ con **Security -> Layer 2**, chọn `Layer 2 Security = WPA+WPA2`, tích chọn `WPA2 Policy = AES`, tích chọn `Auth Key Mgmt = PSK` và nhập mật khẩu Wi-Fi là **`Cisco12345`** -> bấm **Apply**. Ngay lập tức WLC đẩy cấu hình qua đường hầm CAPWAP xuống `LAP-1`!",
      "Bước 5 (Lắp card Wi-Fi cho Laptop và kết nối): Bấm vào `Laptop-WiFi`, tắt nút nguồn vật lý, tháo card mạng dây RJ-45 ra và kéo card thu sóng không dây **`WPC300N`** lắp vào rồi bật lại nguồn. Vào **Desktop -> PC Wireless -> Connect**, chọn sóng `CongTy-WiFi` và nhập mật khẩu `Cisco12345`!"
    ],
    cli_commands: [
      "# Các thông số quan trọng trên giao diện Web GUI của Cisco WLC (Hay hỏi trong đề thi CCNA 200-301):",
      "1. Giao thức kết nối giữa WLC và Lightweight AP: CAPWAP (UDP Port 5246 = Control, UDP Port 5247 = Data)",
      "2. Cổng vật lý trên WLC nối với Switch: Luôn cấu hình là cổng TRUNK (802.1Q) để chở nhiều VLAN tương ứng nhiều SSID",
      "3. Chuẩn bảo mật cá nhân: WPA2-Personal / WPA3-Personal (dùng mật khẩu chung Pre-Shared Key - PSK / SAE)",
      "4. Chuẩn bảo mật doanh nghiệp: WPA2-Enterprise / WPA3-Enterprise (xác thực 802.1X qua máy chủ RADIUS Server)"
    ],
    verify_vi: "Trên sơ đồ Packet Tracer, xuất hiện đường sóng nét đứt nối liền giữa `Laptop-WiFi` và `LAP-1`, đồng thời trong mục **Monitor** của WLC hiển thị `Number of APs = 1` và `Clients = 1`."
  },
  {
    id: 34,
    moduleId: 8,
    level: "Nâng cao (Trọng tâm Domain 3.0 Thi CCNA)",
    title_vi: "Lab 34: Cấu Hình Tuyến Đường Tĩnh Dự Phòng (Floating Static Route) Tự Động Chuyển Mạch Khi Đứt Cáp OSPF",
    objective_vi: "Ứng dụng chỉ số **Administrative Distance (AD)** để thiết lập cơ chế tự động chuyển đường truyền dự phòng (**Floating Static Route**): Bình thường chạy đường cáp quang chính qua **OSPF (`AD = 110`)**, khi cáp quang chính đứt thì đường dự phòng 4G/Leased Line (`AD = 150`) tự động nổi lên cứu mạng!",
    nodes: [
      { name: "R1 (Chi nhánh)", type: "router", x: 180, y: 120, ip: "LAN: 192.168.1.0/24" },
      { name: "Đường Cáp Quang Chính", type: "cloud", x: 420, y: 55, ip: "Chạy OSPF (AD = 110)" },
      { name: "Đường Dự Phòng Backup", type: "cloud", x: 420, y: 185, ip: "Floating Static (AD = 150)" },
      { name: "R2 (Trụ sở HQ)", type: "router", x: 660, y: 120, ip: "Server: 192.168.2.0/24" }
    ],
    links: [
      { from: 0, to: 1, type: "fiber", p1: "Gi0/0/0", p2: "Port0", label: "Chính: 10.1.1.0/30 (AD 110)" },
      { from: 1, to: 3, type: "fiber", p1: "Port1", p2: "Gi0/0/0" },
      { from: 0, to: 2, type: "serial", p1: "Se0/1/0", p2: "Port0", label: "Dự phòng: 10.2.2.0/30 (AD 150)" },
      { from: 2, to: 3, type: "serial", p1: "Port1", p2: "Se0/1/0" }
    ],
    zones: [
      { x: 60, y: 15, w: 720, h: 205, label: "CƠ CHẾ FLOATING STATIC ROUTE: ĐẶT CHỈ SỐ AD (150) LỚN HƠN OSPF (110)" }
    ],
    ipTable: [
      ["Đường chính (OSPF)", "Gi0/0/0 (10.1.1.0/30)", "Học qua OSPF", "AD mặc định = 110", "Đang nằm trong Bảng định tuyến (Active)"],
      ["Đường phụ (Floating Static)", "Se0/1/0 (10.2.2.0/30)", "ip route ... 150", "AD đặt bằng tay = 150", "Nằm ẩn chờ sẵn, chỉ hiện ra khi đường OSPF đứt!"]
    ],
    steps_vi: [
      "Bước 1 (Tại sao không dùng lệnh `ip route` bình thường?): Mặc định lệnh `ip route` tĩnh có **`AD = 1`** (nhỏ hơn `OSPF AD = 110`). Nếu bạn gõ lệnh `ip route` bình thường trên đường phụ chậm, Router sẽ tưởng đường phụ tốt hơn OSPF và đẩy hết dữ liệu sang đường phụ!",
      "Bước 2 (Bí quyết tạo Floating Static Route): Khi gõ lệnh `ip route` cho đường dự phòng, bạn **thêm một con số lớn hơn 110 ở cuối câu lệnh** (ví dụ số **`150`**): `ip route 192.168.2.0 255.255.255.0 10.2.2.2 150`.",
      "Bước 3: Khi đường chính OSPF (`AD = 110`) đang sống, dòng Static (`AD = 150`) sẽ bị ẩn đi không xuất hiện trong `show ip route`. Ngay giây phút bạn tắt cổng `Gi0/0/0` (giả lập đứt cáp quang chính), tuyến OSPF biến mất và dòng **`S 192.168.2.0/24 [150/0] via 10.2.2.2`** lập tức nổi lên (Float) trong bảng định tuyến!"
    ],
    cli_commands: [
      "! === CẤU HÌNH FLOATING STATIC ROUTE TRÊN ROUTER R1 ===",
      "R1(config)# router ospf 1                                                 # Đường cáp quang chính chạy OSPF (AD = 110)",
      "R1(config-router)# network 192.168.1.0 0.0.0.255 area 0",
      "R1(config-router)# network 10.1.1.0 0.0.0.3 area 0",
      "R1(config-router)# exit",
      "R1(config)# ip route 192.168.2.0 255.255.255.0 10.2.2.2 150               # Số 150 ở cuối chính là Administrative Distance (AD > 110)!",
      "R1# show ip route                                                         # Lúc bình thường: Chỉ thấy dòng 'O 192.168.2.0/24 [110/2]'",
      "! === GIẢ LẬP ĐỨT CÁP QUANG CHÍNH ĐỂ KIỂM TRA CHUYỂN MẠCH DỰ PHÒNG ===",
      "R1(config)# interface gigabitEthernet 0/0/0",
      "R1(config-if)# shutdown                                                   # Ngắt cổng đường chính",
      "R1(config-if)# end",
      "R1# show ip route                                                         # Lập tức thấy dòng 'S 192.168.2.0/24 [150/0] via 10.2.2.2'!"
    ],
    verify_vi: "Khi bật lại cổng chính (`no shutdown`), OSPF (`AD = 110`) khôi phục và tự động đẩy dòng Static (`AD = 150`) lùi về hậu trường dự phòng."
  },
  {
    id: 35,
    moduleId: 17,
    level: "Thực chiến Kỹ sư Mạng (Production Operations)",
    title_vi: "Lab 35: Sao Lưu & Nâng Cấp Hệ Điều Hành Cisco IOS Qua Máy Chủ TFTP + Khôi Phục Mật Khẩu ROMMON",
    objective_vi: "Thực hành 2 kỹ năng sinh tồn bắt buộc khi đi làm kỹ sư vận hành mạng: 1) Sao lưu file cấu hình `running-config` và file hệ điều hành `.bin` từ Flash lên máy chủ **TFTP Server**; 2) Cứu hộ Router bị quên mật khẩu bằng chế độ **ROMMON (`confreg 0x2142`)**.",
    nodes: [
      { name: "Laptop-Console", type: "pc", x: 150, y: 120, ip: "Nhấn Ctrl+Break -> ROMMON" },
      { name: "R1 (Cần Bảo Trì)", type: "router", x: 430, y: 120, ip: "Gi0/0/0: 192.168.1.1" },
      { name: "TFTP-Backup-Srv", type: "server", x: 700, y: 120, ip: "192.168.1.100 (UDP 69)" }
    ],
    links: [
      { from: 0, to: 1, type: "console", p1: "RS-232", p2: "Console", label: "Cứu hộ ROMMON" },
      { from: 1, to: 2, type: "crossover", p1: "Gi0/0/0", p2: "Fa0", label: "copy running-config tftp:" }
    ],
    zones: [
      { x: 50, y: 20, w: 740, h: 195, label: "SAO LƯU HỆ THỐNG QUA TFTP (UDP 69) & KHÔI PHỤC MẬT KHẨU QUA THANH GHI 0x2142" }
    ],
    ipTable: [
      ["R1", "Gi0/0/0", "192.168.1.1", "255.255.255.0", "Thanh ghi mặc định: 0x2102 | Bỏ qua NVRAM: 0x2142"],
      ["TFTP-Backup-Srv", "Fa0", "192.168.1.100", "255.255.255.0", "Bật dịch vụ Services -> TFTP = ON"]
    ],
    steps_vi: [
      "Bước 1 (Sao lưu cấu hình và hệ điều hành IOS lên TFTP Server): Trước khi sửa đổi lớn hoặc nâng cấp thiết bị ngoài doanh nghiệp, kỹ sư luôn gõ lệnh `show flash:` để xem tên file hệ điều hành `.bin`, sau đó gõ `copy running-config tftp:` và `copy flash: tftp:` nhập IP `192.168.1.100` để đẩy bản sao lưu về máy chủ cất giữ an toàn.",
      "Bước 2 (Quy trình cứu hộ khi quên mật khẩu `enable secret` trên Router): • Tắt công tắc nguồn vật lý của Router rồi bật lại; ngay khi màn hình Console hiện dòng chữ `#####` đang giải nén IOS, bấm tổ hợp phím **`Ctrl + C`** (hoặc `Ctrl + Break` trên PuTTY) để nhảy vào chế độ cứu hộ **`rommon 1 >`**.",
      "Bước 3: Tại dấu nhắc `rommon 1 >`, gõ lệnh **`confreg 0x2142`** rồi gõ **`reset`**. Con số `0x2142` ra lệnh cho Router khi khởi động lên **phớt lờ không đọc file `startup-config` trong NVRAM** -> Nhờ đó Router vào thẳng màn hình trắng mà không hỏi mật khẩu!",
      "Bước 4 (Khôi phục lại cấu hình cũ và đặt mật khẩu mới): Khi đã vào được `Router#`, tuyệt đối **KHÔNG gõ `copy run start` ngay** (vì sẽ xóa trắng cấu hình cũ!), mà phải gõ ngược lại là **`copy startup-config running-config`** để kéo toàn bộ cấu hình cũ từ NVRAM vào RAM, sau đó đổi lại `enable secret Mới`, trả thanh ghi về bình thường bằng lệnh **`config-register 0x2102`** rồi mới lưu `copy run start`!"
    ],
    cli_commands: [
      "! === PHẦN 1: SAO LƯU CẤU HÌNH & IOS LÊN MÁY CHỦ TFTP ===",
      "R1# show file systems                                        # Xem dung lượng bộ nhớ Flash và NVRAM",
      "R1# show flash:                                              # Xem tên file hệ điều hành IOS (.bin) trong thẻ nhớ Flash",
      "R1# copy running-config tftp:                                # Sao lưu file cấu hình đang chạy lên TFTP Server (192.168.1.100)",
      "R1# copy flash: tftp:                                        # Sao lưu toàn bộ file hệ điều hành .bin lên TFTP Server",
      "",
      "! === PHẦN 2: QUY TRÌNH KHÔI PHỤC MẬT KHẨU QUA ROMMON (0x2142) ===",
      "rommon 1 > confreg 0x2142                                    # 1. Đổi thanh ghi để bỏ qua NVRAM khi khởi động",
      "rommon 2 > reset                                             # 2. Khởi động lại Router (vào thẳng không hỏi mật khẩu!)",
      "Router> enable                                               # 3. Vào thẳng chế độ Đặc quyền",
      "Router# copy startup-config running-config                   # 4. Nạp lại cấu hình cũ từ NVRAM vào RAM",
      "R1# configure terminal",
      "R1(config)# enable secret MatKhauMoi@2026                    # 5. Ghi đè mật khẩu mới",
      "R1(config)# config-register 0x2102                           # 6. QUAN TRỌNG: Trả thanh ghi về chuẩn 0x2102 để lần sau đọc NVRAM!",
      "R1(config)# end",
      "R1# copy running-config startup-config                       # 7. Lưu toàn bộ cấu hình kèm mật khẩu mới vào NVRAM"
    ],
    verify_vi: "Gõ lệnh `R1# show version` và nhìn dòng cuối cùng: `Configuration register is 0x2102` — đảm bảo thiết bị khởi động bình thường từ NVRAM ở các lần sau."
  }
];

PACKET_TRACER_LABS.push(...PACKET_TRACER_LABS_PART3);
