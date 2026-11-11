// Detailed Visual SVG Diagrams & Real Hardware / Wireshark / Packet Tracer Visual Cards for all 17 CCNA 1 Modules

const MODULE_VISUALS = {
  1: {
    svg: `
      <svg viewBox="0 0 840 330" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="840" height="330" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
        <text x="20" y="24" font-size="13" font-weight="bold" fill="#0369a1">🏢 HỆ SINH THÁI MẠNG DOANH NGHIỆP THỰC TẾ: THIẾT BỊ ĐA HÃNG &amp; NGOẠI VI VĂN PHÒNG (ARUBA WEB GUI, MFP LCD, SCAN SMB, POS, VOIP, RMM)</text>

        <!-- Central Smart PoE Switch -->
        <rect x="290" y="115" width="260" height="72" rx="8" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
        <text x="420" y="140" font-size="12" font-weight="bold" text-anchor="middle" fill="#ffffff">🔀 Switch Quản Trị PoE+ (Aruba / UniFi / Cisco)</text>
        <text x="420" y="158" font-size="10" text-anchor="middle" fill="#e0f2fe">Web GUI HTTPS • Cloud App • Cấp điện PoE 802.3at</text>
        <text x="420" y="174" font-size="9.5" text-anchor="middle" fill="#bae6fd">VLAN 10 (Data), VLAN 150 (Voice), VLAN 20 (POS/In), VLAN 30 (CCTV)</text>

        <!-- Left Side: Office Peripherals -->
        <!-- 1. MFP Printer & Scanner -->
        <rect x="20" y="42" width="240" height="72" rx="6" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
        <text x="32" y="62" font-size="11" font-weight="bold" fill="#0369a1">🖨️ Máy In Đa Năng LCD &amp; Máy Scan</text>
        <text x="32" y="79" font-size="9.5" fill="#334155">• IP Tĩnh trên LCD • Web nhúng EWS (HTTPS)</text>
        <text x="32" y="94" font-size="9.5" font-weight="bold" fill="#15803d">• In: Standard TCP/IP Port 9100 (RAW)</text>
        <text x="32" y="108" font-size="9.5" fill="#475569">• Scan to Folder: SMBv2/v3 Port 445 / Email</text>

        <!-- 2. Thermal POS Printer -->
        <rect x="20" y="126" width="240" height="66" rx="6" fill="#ffffff" stroke="#d97706" stroke-width="1.5"/>
        <text x="32" y="146" font-size="11" font-weight="bold" fill="#b45309">🧾 Máy In Bill Quầy Thu Ngân / Bếp (POS)</text>
        <text x="32" y="163" font-size="9.5" fill="#334155">• Cổng mạng LAN RJ-45 • Socket RAW Port 9100</text>
        <text x="32" y="177" font-size="9.5" fill="#b45309">• Nhấn giữ nút FEED + Bật nguồn để in IP Self-Test</text>
        <text x="32" y="189" font-size="9" fill="#64748b">• Tích hợp Jack RJ-11 giật mở két tiền thu ngân</text>

        <!-- 3. VoIP Phone + PC Daisy Chain -->
        <rect x="20" y="204" width="240" height="76" rx="6" fill="#ffffff" stroke="#16a34a" stroke-width="1.5"/>
        <text x="32" y="224" font-size="11" font-weight="bold" fill="#15803d">☎️ IP Phone PoE ──► 💻 PC Nhân Viên</text>
        <text x="32" y="241" font-size="9.5" fill="#334155">• 1 Dây Switch cắm cổng SW: Cấp PoE + Voice VLAN</text>
        <text x="32" y="256" font-size="9.5" font-weight="bold" fill="#166534">• Cổng PC nối tiếp ra máy tính: Nhận Data VLAN</text>
        <text x="32" y="271" font-size="9" fill="#059669">• Tiết kiệm 50% số cổng Switch và chi phí kéo dây cáp!</text>

        <!-- Right Side: Infrastructure & Remote Mgmt -->
        <!-- 4. IT Remote Management -->
        <rect x="580" y="42" width="240" height="72" rx="6" fill="#ffffff" stroke="#7c3aed" stroke-width="1.5"/>
        <text x="592" y="62" font-size="11" font-weight="bold" fill="#6d28d9">🛠️ Quản Trị Từ Xa PC (Helpdesk / RMM)</text>
        <text x="592" y="79" font-size="9.5" fill="#334155">• Điều khiển: RustDesk / AnyDesk / RDP 3389 qua VPN</text>
        <text x="592" y="94" font-size="9.5" font-weight="bold" fill="#5b21b6">• RMM NinjaOne: Vá lỗi ngầm không chiếm chuột</text>
        <text x="592" y="108" font-size="9.5" fill="#475569">• Wake-on-LAN: Magic Packet UDP 7/9 bật nguồn 2h sáng</text>

        <!-- 5. Camera & Time Attendance -->
        <rect x="580" y="126" width="240" height="66" rx="6" fill="#ffffff" stroke="#dc2626" stroke-width="1.5"/>
        <text x="592" y="146" font-size="11" font-weight="bold" fill="#b91c1c">📹 Camera IP PoE &amp; Máy Chấm Công</text>
        <text x="592" y="163" font-size="9.5" fill="#334155">• Camera an ninh: Nguồn PoE • RTSP 554 • Chuẩn ONVIF</text>
        <text x="592" y="177" font-size="9.5" fill="#b91c1c">• Tách VLAN Camera riêng chống nghẽn mạng văn phòng</text>
        <text x="592" y="189" font-size="9" fill="#64748b">• Máy chấm công FaceID/Vân tay: TCP/UDP Port 4370</text>

        <!-- 6. Multi-WAN Load Balancing Router -->
        <rect x="580" y="204" width="240" height="76" rx="6" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
        <text x="592" y="224" font-size="11" font-weight="bold" fill="#0369a1">🌐 Router Cân Bằng Tải (DrayTek / MikroTik)</text>
        <text x="592" y="241" font-size="9.5" fill="#334155">• Quản lý Web GUI / Winbox • Quay số PPPoE 2 WAN</text>
        <text x="592" y="256" font-size="9.5" font-weight="bold" fill="#0284c7">• Dual-WAN Failover: Viettel 500M + VNPT 500M</text>
        <text x="592" y="271" font-size="9" fill="#0369a1">• Tích hợp SSL VPN Server cho nhân viên Work From Home</text>

        <!-- Connecting Lines -->
        <line x1="260" y1="78" x2="290" y2="135" stroke="#0284c7" stroke-width="2"/>
        <line x1="260" y1="159" x2="290" y2="151" stroke="#d97706" stroke-width="2"/>
        <line x1="260" y1="242" x2="290" y2="167" stroke="#16a34a" stroke-width="2"/>
        <line x1="550" y1="135" x2="580" y2="78" stroke="#7c3aed" stroke-width="2"/>
        <line x1="550" y1="151" x2="580" y2="159" stroke="#dc2626" stroke-width="2"/>
        <line x1="550" y1="167" x2="580" y2="242" stroke="#0284c7" stroke-width="2.5"/>

        <!-- Bottom Legend -->
        <rect x="20" y="290" width="800" height="30" rx="4" fill="#f1f5f9" stroke="#cbd5e1"/>
        <text x="35" y="310" font-size="10" font-weight="bold" fill="#334155">💡 Mẹo cốt lõi cho kỹ sư mạng:</text>
        <text x="180" y="310" font-size="9.5" fill="#0f172a">Mọi thiết bị dùng chung (In, Scan, POS, Camera, Chấm công, SVI) BẮT BUỘC đặt Static IP ngoài DHCP • Dùng dây mạng LAN cho máy in bếp</text>
      </svg>
    `,
    hardwareSvg: `
      <svg viewBox="0 0 820 115" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, monospace">
        <rect width="820" height="115" rx="8" fill="#1e293b"/>
        <text x="20" y="24" font-size="12" font-weight="bold" fill="#38bdf8">MẶT TRƯỚC THIẾT BỊ THỰC TẾ: CISCO CATALYST 2960 SWITCH (24 CỔNG RJ-45 + 2 CỔNG UPLINK GIGABIT)</text>
        <rect x="20" y="34" width="780" height="66" rx="4" fill="#0f172a" stroke="#475569" stroke-width="2"/>
        <text x="35" y="58" font-size="13" font-weight="bold" fill="#22c55e">CISCO</text>
        <circle cx="48" cy="78" r="5" fill="#22c55e"/><text x="60" y="82" font-size="9" fill="#94a3b8">SYST</text>
        <!-- 12 top + 12 bottom RJ45 ports -->
        <g transform="translate(115, 42)" fill="#334155" stroke="#94a3b8" stroke-width="1">
          <rect x="0" y="0" width="22" height="18"/><rect x="28" y="0" width="22" height="18"/><rect x="56" y="0" width="22" height="18"/><rect x="84" y="0" width="22" height="18"/>
          <rect x="120" y="0" width="22" height="18"/><rect x="148" y="0" width="22" height="18"/><rect x="176" y="0" width="22" height="18"/><rect x="204" y="0" width="22" height="18"/>
          <rect x="240" y="0" width="22" height="18"/><rect x="268" y="0" width="22" height="18"/><rect x="296" y="0" width="22" height="18"/><rect x="324" y="0" width="22" height="18"/>
          <rect x="0" y="24" width="22" height="18"/><rect x="28" y="24" width="22" height="18"/><rect x="56" y="24" width="22" height="18"/><rect x="84" y="24" width="22" height="18"/>
          <rect x="120" y="24" width="22" height="18"/><rect x="148" y="24" width="22" height="18"/><rect x="176" y="24" width="22" height="18"/><rect x="204" y="24" width="22" height="18"/>
          <rect x="240" y="24" width="22" height="18"/><rect x="268" y="24" width="22" height="18"/><rect x="296" y="24" width="22" height="18"/><rect x="324" y="24" width="22" height="18"/>
        </g>
        <!-- Green LEDs -->
        <circle cx="126" cy="40" r="3" fill="#22c55e"/><circle cx="154" cy="40" r="3" fill="#22c55e"/><circle cx="182" cy="40" r="3" fill="#f59e0b"/>
        <!-- Uplink SFP/Gigabit -->
        <rect x="520" y="45" width="36" height="36" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
        <rect x="565" y="45" width="36" height="36" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="615" y="60" font-size="11" font-weight="bold" fill="#38bdf8">Gi0/1 &amp; Gi0/2 (Uplink)</text>
        <text x="615" y="78" font-size="10" fill="#cbd5e1">Nối lên Router / Core Switch</text>
      </svg>
    `,
    photos: [
    {
        "url":  "images/switch_cisco.jpg",
        "desc_vi":  "Thiết bị trung gian (Intermediary Device) phổ biến nhất trong mạng LAN. Mặt trước có hàng loạt cổng RJ-45 để cắm cáp mạng nối tới từng máy tính PC, máy in, Camera và IP Phone trong cùng tòa nhà.",
        "desc_en":  "The primary intermediary device in a LAN, featuring 24 to 48 RJ-45 ports to connect PCs, printers, and IP phones within the same building.",
        "title_en":  "Enterprise LAN Switch (Cisco Catalyst)",
        "title_vi":  "Thiết bị Switch doanh nghiệp (Cisco Catalyst 24/48 cổng)"
    },
    {
        "url":  "images/router_cisco.jpg",
        "desc_vi":  "Thiết bị trung gian đóng vai trò \u0027Cánh cổng biên giới\u0027 (Default Gateway) nối mạng nội bộ LAN ra ngoài mạng diện rộng WAN / Internet. Khác với Switch có nhiều cổng, Router có ít cổng hơn nhưng cực kỳ thông minh.",
        "desc_en":  "Acts as the Default Gateway connecting internal LANs to external WANs and the Internet based on IP addresses.",
        "title_en":  "Enterprise Router (Cisco ISR)",
        "title_vi":  "Thiết bị Định tuyến Router doanh nghiệp (Cisco ISR)"
    },
    {
        "url":  "images/server_rack.jpg",
        "desc_vi":  "Bên trong phòng máy chủ (Server Room): Các thanh Patch Panel gom cáp mạng âm tường từ các phòng ban rồi đấu dây nhảy (Patch Cord) gọn gàng vào Switch và Router.",
        "desc_en":  "Patch panels terminate horizontal wall cabling and connect via short patch cords into rack-mounted switches and servers.",
        "title_en":  "Enterprise Wiring Closet \u0026 Server Rack",
        "title_vi":  "Tủ Rack Mạng \u0026 Hệ thống Cáp Đấu Nối Thực Tế"
    },
    {
        "url":  "images/ip_phone.jpg",
        "desc_vi":  "Ví dụ điển hình của Mạng Hội Tụ (Converged Network): Chiếc điện thoại bàn này cắm chung dây cáp mạng Ethernet với máy tính PC để truyền giọng nói số hóa (VoIP) và nhận cả nguồn điện PoE từ Switch.",
        "desc_en":  "An end device on a converged network that receives both voice data and electrical power (PoE) over a single Ethernet cable.",
        "title_en":  "Cisco VoIP IP Phone (End Device / Host)",
        "title_vi":  "Điện thoại IP Phone Cisco (Thiết bị đầu cuối - End Device)"
    }
]
  },

  2: {
    svg: `
      <svg viewBox="0 0 820 245" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, monospace">
        <rect width="820" height="245" rx="8" fill="#0f172a"/>
        <text x="24" y="32" font-size="14" font-weight="bold" fill="#38bdf8">SƠ ĐỒ CHUYỂN ĐỔI CÁC CHẾ ĐỘ DÒNG LỆNH CISCO IOS (CLI MODES)</text>
        <!-- Mode 1 -->
        <rect x="24" y="55" width="165" height="75" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
        <text x="106" y="80" font-size="13" font-weight="bold" text-anchor="middle" fill="#f8fafc">User EXEC</text>
        <text x="106" y="102" font-size="14" font-weight="bold" text-anchor="middle" fill="#38bdf8">Switch&gt;</text>
        <text x="106" y="120" font-size="10" text-anchor="middle" fill="#94a3b8">Chỉ xem cơ bản</text>

        <!-- Arrow 1 -->
        <line x1="189" y1="92" x2="245" y2="92" stroke="#22c55e" stroke-width="2.5"/>
        <text x="217" y="82" font-size="11" font-weight="bold" text-anchor="middle" fill="#4ade80">enable</text>

        <!-- Mode 2 -->
        <rect x="245" y="55" width="175" height="75" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="332" y="80" font-size="13" font-weight="bold" text-anchor="middle" fill="#f8fafc">Privileged EXEC</text>
        <text x="332" y="102" font-size="14" font-weight="bold" text-anchor="middle" fill="#38bdf8">Switch#</text>
        <text x="332" y="120" font-size="10" text-anchor="middle" fill="#94a3b8">show / copy run start</text>

        <!-- Arrow 2 -->
        <line x1="420" y1="92" x2="485" y2="92" stroke="#22c55e" stroke-width="2.5"/>
        <text x="452" y="82" font-size="11" font-weight="bold" text-anchor="middle" fill="#4ade80">conf t</text>

        <!-- Mode 3 -->
        <rect x="485" y="55" width="175" height="75" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
        <text x="572" y="80" font-size="13" font-weight="bold" text-anchor="middle" fill="#f8fafc">Global Config</text>
        <text x="572" y="102" font-size="13" font-weight="bold" text-anchor="middle" fill="#fbbf24">Switch(config)#</text>
        <text x="572" y="120" font-size="10" text-anchor="middle" fill="#94a3b8">hostname / enable secret</text>

        <!-- Submodes -->
        <rect x="685" y="38" width="118" height="48" rx="5" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
        <text x="744" y="58" font-size="11" font-weight="bold" text-anchor="middle" fill="#e9d5ff">(config-line)#</text>
        <text x="744" y="75" font-size="10" text-anchor="middle" fill="#cbd5e1">line con 0 / vty</text>

        <rect x="685" y="100" width="118" height="48" rx="5" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
        <text x="744" y="120" font-size="11" font-weight="bold" text-anchor="middle" fill="#e9d5ff">(config-if)#</text>
        <text x="744" y="137" font-size="10" text-anchor="middle" fill="#cbd5e1">int vlan 1 / fa0/1</text>

        <line x1="660" y1="78" x2="685" y2="62" stroke="#c084fc" stroke-width="2"/>
        <line x1="660" y1="105" x2="685" y2="122" stroke="#c084fc" stroke-width="2"/>

        <!-- RAM vs NVRAM Bar -->
        <rect x="24" y="160" width="375" height="65" rx="6" fill="#172554" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="40" y="185" font-size="12" font-weight="bold" fill="#93c5fd">⚡ Bộ nhớ RAM: running-config</text>
        <text x="40" y="207" font-size="11" fill="#dbeafe">Có hiệu lực ngay khi gõ lệnh, nhưng MẤT SẠCH khi tắt nguồn!</text>

        <rect x="425" y="160" width="378" height="65" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
        <text x="440" y="185" font-size="12" font-weight="bold" fill="#6ee7b7">💾 Bộ nhớ NVRAM: startup-config</text>
        <text x="440" y="207" font-size="11" fill="#d1fae5">Lưu vĩnh viễn qua lệnh: copy running-config startup-config</text>
      </svg>
    `,
    hardwareSvg: `
      <svg viewBox="0 0 820 110" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, monospace">
        <rect width="820" height="110" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
        <text x="20" y="24" font-size="12" font-weight="bold" fill="#0f172a">KẾT NỐI CÁP CONSOLE THỰC TẾ TỪ LAPTOP VÀO CỔNG CONSOLE CỦA SWITCH (OUT-OF-BAND MANAGEMENT)</text>
        <rect x="30" y="38" width="160" height="55" rx="6" fill="#1e293b"/><text x="110" y="62" font-size="12" font-weight="bold" text-anchor="middle" fill="#fff">💻 Laptop Kỹ Sư</text><text x="110" y="80" font-size="10" text-anchor="middle" fill="#38bdf8">PuTTY: Serial 9600 bps</text>
        <path d="M 190 65 C 290 35, 370 95, 470 65" stroke="#06b6d4" stroke-width="6" fill="none"/>
        <text x="330" y="52" font-size="11" font-weight="bold" text-anchor="middle" fill="#0891b2">Dây Cáp Console (USB/RS-232 sang RJ-45)</text>
        <rect x="470" y="38" width="320" height="55" rx="6" fill="#0f172a" stroke="#0284c7" stroke-width="2"/>
        <rect x="490" y="50" width="34" height="28" fill="#06b6d4"/><text x="507" y="68" font-size="9" font-weight="bold" text-anchor="middle" fill="#0f172a">CON</text>
        <text x="650" y="62" font-size="12" font-weight="bold" text-anchor="middle" fill="#fff">Mặt sau Switch Cisco</text>
        <text x="650" y="80" font-size="10" text-anchor="middle" fill="#bae6fd">Cổng Console viền màu xanh ngọc</text>
      </svg>
    `,
    photos: [
    {
        "url":  "images/console_cable.jpg",
        "desc_vi":  "Khi mới mua Switch hoặc Router về, thiết bị hoàn toàn trắng tinh và chưa có địa chỉ IP. Kỹ sư mạng phải dùng sợi cáp Console màu xanh ngọc này cắm một đầu vào cổng Console của máy, đầu kia (qua cổng USB/Serial) cắm vào Laptop để mở phần mềm PuTTY cấu hình lần đầu.",
        "desc_en":  "Used for out-of-band initial configuration by connecting a laptop\u0027s USB/Serial port directly to the Switch or Router Console port.",
        "title_en":  "Cisco Light-Blue Console Cable (Rollover Cable)",
        "title_vi":  "Dây cáp Console Cisco màu xanh ngọc (Rollover Cable)"
    },
    {
        "url":  "images/switch_cisco.jpg",
        "desc_vi":  "Trên Switch thực tế không có màn hình hay bàn phím. Mọi thao tác đặt tên máy (hostname), đặt mật khẩu (enable secret) và đặt địa chỉ IP quản trị (interface vlan 1) đều thực hiện qua giao diện dòng lệnh CLI.",
        "desc_en":  "Enterprise switches have no monitor or keyboard; all configuration (hostname, passwords, SVI IP) is performed via IOS CLI.",
        "title_en":  "Cisco Catalyst Switch Front Panel \u0026 Status LEDs",
        "title_vi":  "Mặt trước và các đèn LED trạng thái trên Switch Cisco"
    }
]
  },

  3: {
    svg: `
      <svg viewBox="0 0 820 290" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="820" height="290" rx="8" fill="#f8fafc"/>
        <text x="20" y="28" font-size="14" font-weight="bold" fill="#0f172a">SO SÁNH MÔ HÌNH 7 TẦNG OSI, 4 TẦNG TCP/IP &amp; ĐƠN VỊ DỮ LIỆU (PDU)</text>

        <!-- Column Headers -->
        <text x="125" y="52" font-size="12" font-weight="bold" text-anchor="middle" fill="#0369a1">MÔ HÌNH OSI (7 TẦNG)</text>
        <text x="345" y="52" font-size="12" font-weight="bold" text-anchor="middle" fill="#0f766e">MÔ HÌNH TCP/IP (4 TẦNG)</text>
        <text x="530" y="52" font-size="12" font-weight="bold" text-anchor="middle" fill="#b45309">TÊN GỌI PDU (ĐỀ THI)</text>
        <text x="710" y="52" font-size="12" font-weight="bold" text-anchor="middle" fill="#4f46e5">GIAO THỨC &amp; THIẾT BỊ</text>

        <!-- L7, L6, L5 -->
        <rect x="20" y="62" width="210" height="28" rx="4" fill="#dbeafe"/><text x="125" y="81" font-size="12" font-weight="bold" text-anchor="middle" fill="#1e3a8a">7. Application (Ứng dụng)</text>
        <rect x="20" y="94" width="210" height="28" rx="4" fill="#dbeafe"/><text x="125" y="113" font-size="12" font-weight="bold" text-anchor="middle" fill="#1e3a8a">6. Presentation (Trình diễn)</text>
        <rect x="20" y="126" width="210" height="28" rx="4" fill="#dbeafe"/><text x="125" y="145" font-size="12" font-weight="bold" text-anchor="middle" fill="#1e3a8a">5. Session (Phiên)</text>

        <rect x="245" y="62" width="200" height="92" rx="6" fill="#ccfbf1" stroke="#0d9488"/><text x="345" y="113" font-size="13" font-weight="bold" text-anchor="middle" fill="#115e59">4. Application Layer</text>
        <rect x="460" y="62" width="140" height="92" rx="6" fill="#fef3c7" stroke="#d97706"/><text x="530" y="113" font-size="13" font-weight="bold" text-anchor="middle" fill="#92400e">📦 DATA</text>
        <rect x="615" y="62" width="185" height="92" rx="6" fill="#eef2ff"/><text x="707" y="102" font-size="11" font-weight="bold" text-anchor="middle" fill="#312e81">HTTP, HTTPS, DNS,</text><text x="707" y="122" font-size="11" font-weight="bold" text-anchor="middle" fill="#312e81">DHCP, SMTP, SSH, FTP</text>

        <!-- L4 -->
        <rect x="20" y="160" width="210" height="30" rx="4" fill="#bae6fd"/><text x="125" y="180" font-size="12" font-weight="bold" text-anchor="middle" fill="#0c4a6e">4. Transport (Giao vận)</text>
        <rect x="245" y="160" width="200" height="30" rx="4" fill="#99f6e4"/><text x="345" y="180" font-size="12" font-weight="bold" text-anchor="middle" fill="#115e59">3. Transport Layer</text>
        <rect x="460" y="160" width="140" height="30" rx="4" fill="#fde68a"/><text x="530" y="180" font-size="11" font-weight="bold" text-anchor="middle" fill="#92400e">Segment / Datagram</text>
        <rect x="615" y="160" width="185" height="30" rx="4" fill="#e0e7ff"/><text x="707" y="180" font-size="11" font-weight="bold" text-anchor="middle" fill="#312e81">TCP, UDP (Port Numbers)</text>

        <!-- L3 -->
        <rect x="20" y="195" width="210" height="30" rx="4" fill="#7dd3fc"/><text x="125" y="215" font-size="12" font-weight="bold" text-anchor="middle" fill="#0c4a6e">3. Network (Mạng)</text>
        <rect x="245" y="195" width="200" height="30" rx="4" fill="#5eead4"/><text x="345" y="215" font-size="12" font-weight="bold" text-anchor="middle" fill="#134e4a">2. Internet Layer</text>
        <rect x="460" y="195" width="140" height="30" rx="4" fill="#fcd34d"/><text x="530" y="215" font-size="12" font-weight="bold" text-anchor="middle" fill="#78350f">📨 PACKET</text>
        <rect x="615" y="195" width="185" height="30" rx="4" fill="#c7d2fe"/><text x="707" y="215" font-size="11" font-weight="bold" text-anchor="middle" fill="#312e81">IPv4, IPv6, ICMP, Router</text>

        <!-- L2 & L1 -->
        <rect x="20" y="230" width="210" height="26" rx="4" fill="#38bdf8"/><text x="125" y="248" font-size="12" font-weight="bold" text-anchor="middle" fill="#082f49">2. Data Link (Liên kết DL)</text>
        <rect x="20" y="259" width="210" height="25" rx="4" fill="#0284c7"/><text x="125" y="276" font-size="12" font-weight="bold" text-anchor="middle" fill="#fff">1. Physical (Vật lý)</text>

        <rect x="245" y="230" width="200" height="54" rx="6" fill="#2dd4bf"/><text x="345" y="262" font-size="12" font-weight="bold" text-anchor="middle" fill="#042f2e">1. Network Access</text>
        <rect x="460" y="230" width="140" height="26" rx="4" fill="#fbbf24"/><text x="530" y="248" font-size="12" font-weight="bold" text-anchor="middle" fill="#78350f">🖼️ FRAME</text>
        <rect x="460" y="259" width="140" height="25" rx="4" fill="#f59e0b"/><text x="530" y="276" font-size="12" font-weight="bold" text-anchor="middle" fill="#fff">⚡ BITS (0 / 1)</text>
        <rect x="615" y="230" width="185" height="26" rx="4" fill="#a5b4fc"/><text x="707" y="248" font-size="11" font-weight="bold" text-anchor="middle" fill="#1e1b4b">Ethernet MAC, Switch</text>
        <rect x="615" y="259" width="185" height="25" rx="4" fill="#818cf8"/><text x="707" y="276" font-size="11" font-weight="bold" text-anchor="middle" fill="#fff">Cáp UTP, Quang, Hub</text>
      </svg>
    `,
    hardwareSvg: `
      <svg viewBox="0 0 820 110" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="820" height="110" rx="8" fill="#0f172a"/>
        <text x="20" y="24" font-size="12" font-weight="bold" fill="#38bdf8">MINH HỌA QUÁ TRÌNH ĐÓNG GÓI (ENCAPSULATION) KHI BẮT GÓI TIN THỰC TẾ TRÊN WIRESHARK</text>
        <rect x="25" y="38" width="130" height="52" rx="4" fill="#0284c7"/><text x="90" y="60" font-size="11" font-weight="bold" text-anchor="middle" fill="#fff">Ethernet Header</text><text x="90" y="78" font-size="10" text-anchor="middle" fill="#e0f2fe">MAC Đích / Nguồn (L2)</text>
        <rect x="159" y="38" width="160" height="52" rx="4" fill="#16a34a"/><text x="239" y="60" font-size="11" font-weight="bold" text-anchor="middle" fill="#fff">IPv4 Header</text><text x="239" y="78" font-size="10" text-anchor="middle" fill="#dcfce7">Src IP / Dst IP (L3)</text>
        <rect x="323" y="38" width="160" height="52" rx="4" fill="#d97706"/><text x="403" y="60" font-size="11" font-weight="bold" text-anchor="middle" fill="#fff">TCP Header</text><text x="403" y="78" font-size="10" text-anchor="middle" fill="#fef3c7">Src Port / Dst Port (L4)</text>
        <rect x="487" y="38" width="195" height="52" rx="4" fill="#7c3aed"/><text x="584" y="60" font-size="11" font-weight="bold" text-anchor="middle" fill="#fff">Application Data</text><text x="584" y="78" font-size="10" text-anchor="middle" fill="#ede9fe">Nội dung HTTP GET (L7)</text>
        <rect x="686" y="38" width="110" height="52" rx="4" fill="#475569"/><text x="741" y="60" font-size="11" font-weight="bold" text-anchor="middle" fill="#fff">FCS Trailer</text><text x="741" y="78" font-size="10" text-anchor="middle" fill="#cbd5e1">CRC Kiểm lỗi (L2)</text>
      </svg>
    `,
    photos: [
    {
        "url":  "images/nic_card.jpg",
        "desc_vi":  "Đây là linh kiện phần cứng gắn trong máy tính giúp biến dữ liệu phần mềm thành khung tin Ethernet Frame (Tầng 2) và phát thành xung điện trên dây cáp đồng (Tầng 1).",
        "desc_en":  "Hardware adapter inside a host that encapsulates IP packets into Ethernet frames (Layer 2) and transmits electrical bits onto the wire (Layer 1).",
        "title_en":  "Network Interface Card - NIC (OSI Layers 1 \u0026 2)",
        "title_vi":  "Card mạng NIC (Hoạt động ở Tầng 1 Physical \u0026 Tầng 2 Data Link)"
    },
    {
        "url":  "images/router_cisco.jpg",
        "desc_vi":  "Khi gói tin đi qua Router, thiết bị này sẽ bóc lớp vỏ Frame Tầng 2 ra để đọc Địa chỉ IP Nguồn \u0026 Đích ở Tầng 3 (Packet), sau đó đóng lại lớp vỏ Frame mới trước khi đẩy sang chặng tiếp theo.",
        "desc_en":  "De-encapsulates the Layer 2 Ethernet frame to inspect the Layer 3 IP packet destination address before re-encapsulating and forwarding.",
        "title_en":  "Cisco Router (OSI Layer 3 - Network Layer)",
        "title_vi":  "Router Cisco (Hoạt động ở Tầng 3 - Network Layer)"
    }
]
  },

  4: {
    svg: `
      <svg viewBox="0 0 820 230" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="820" height="230" rx="8" fill="#f8fafc"/>
        <text x="20" y="28" font-size="14" font-weight="bold" fill="#0f172a">BẢNG MÀU BẤM CÁP MẠNG RJ-45 CHUẨN T568A VÀ T568B (8 CHÂN ĐỒNG)</text>

        <!-- T568A -->
        <rect x="20" y="45" width="380" height="168" rx="8" fill="#fff" stroke="#cbd5e1" stroke-width="1.5"/>
        <text x="35" y="68" font-size="13" font-weight="bold" fill="#0369a1">Chuẩn T568A (Chân 1 -&gt; Chân 8)</text>
        <g font-size="11" font-weight="bold">
          <rect x="35" y="80" width="80" height="22" fill="#dcfce7" stroke="#16a34a"/><text x="42" y="95" fill="#14532d">1. Trắng-X.Lá</text>
          <rect x="122" y="80" width="80" height="22" fill="#16a34a"/><text x="132" y="95" fill="#fff">2. Xanh Lá</text>
          <rect x="209" y="80" width="80" height="22" fill="#ffedd5" stroke="#ea580c"/><text x="216" y="95" fill="#9a3412">3. Trắng-Cam</text>
          <rect x="296" y="80" width="88" height="22" fill="#2563eb"/><text x="306" y="95" fill="#fff">4. Xanh Dương</text>

          <rect x="35" y="110" width="80" height="22" fill="#dbeafe" stroke="#2563eb"/><text x="40" y="125" fill="#1e3a8a">5. Trắng-X.D</text>
          <rect x="122" y="110" width="80" height="22" fill="#ea580c"/><text x="135" y="125" fill="#fff">6. Cam</text>
          <rect x="209" y="110" width="80" height="22" fill="#fef3c7" stroke="#78350f"/><text x="215" y="125" fill="#78350f">7. Trắng-Nâu</text>
          <rect x="296" y="110" width="88" height="22" fill="#78350f"/><text x="315" y="125" fill="#fff">8. Nâu</text>
        </g>
        <text x="35" y="158" font-size="11" fill="#334155">• Cáp Thẳng (Straight-through): 2 đầu giống nhau (B-B)</text>
        <text x="35" y="176" font-size="11" fill="#334155">  -&gt; Nối 2 thiết bị KHÁC LOẠI (PC-Switch, Switch-Router)</text>

        <!-- T568B -->
        <rect x="420" y="45" width="380" height="168" rx="8" fill="#fff" stroke="#cbd5e1" stroke-width="1.5"/>
        <text x="435" y="68" font-size="13" font-weight="bold" fill="#ea580c">Chuẩn T568B (Phổ biến nhất thực tế)</text>
        <g font-size="11" font-weight="bold">
          <rect x="435" y="80" width="80" height="22" fill="#ffedd5" stroke="#ea580c"/><text x="442" y="95" fill="#9a3412">1. Trắng-Cam</text>
          <rect x="522" y="80" width="80" height="22" fill="#ea580c"/><text x="540" y="95" fill="#fff">2. Cam</text>
          <rect x="609" y="80" width="80" height="22" fill="#dcfce7" stroke="#16a34a"/><text x="615" y="95" fill="#14532d">3. Trắng-X.Lá</text>
          <rect x="696" y="80" width="88" height="22" fill="#2563eb"/><text x="706" y="95" fill="#fff">4. Xanh Dương</text>

          <rect x="435" y="110" width="80" height="22" fill="#dbeafe" stroke="#2563eb"/><text x="440" y="125" fill="#1e3a8a">5. Trắng-X.D</text>
          <rect x="522" y="110" width="80" height="22" fill="#16a34a"/><text x="532" y="125" fill="#fff">6. Xanh Lá</text>
          <rect x="609" y="110" width="80" height="22" fill="#fef3c7" stroke="#78350f"/><text x="615" y="125" fill="#78350f">7. Trắng-Nâu</text>
          <rect x="696" y="110" width="88" height="22" fill="#78350f"/><text x="715" y="125" fill="#fff">8. Nâu</text>
        </g>
        <text x="435" y="158" font-size="11" fill="#334155">• Cáp Chéo (Crossover): 1 đầu A, 1 đầu B (Đảo chân 1,2 &lt;-&gt; 3,6)</text>
        <text x="435" y="176" font-size="11" fill="#334155">  -&gt; Nối 2 thiết bị CÙNG LOẠI (Switch-Switch, PC-PC, PC-Router)</text>
      </svg>
    `,
    hardwareSvg: `
      <svg viewBox="0 0 820 115" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="820" height="115" rx="8" fill="#1e293b"/>
        <text x="20" y="24" font-size="12" font-weight="bold" fill="#38bdf8">SO SÁNH LÕI CÁP QUANG SINGLE-MODE (SMF - VỎ VÀNG) VS. MULTIMODE (MMF - VỎ CAM/XANH)</text>
        <rect x="20" y="35" width="380" height="66" rx="6" fill="#0f172a" stroke="#eab308" stroke-width="2"/>
        <circle cx="60" cy="68" r="22" fill="#fef08a" stroke="#eab308" stroke-width="2"/><circle cx="60" cy="68" r="3" fill="#dc2626"/>
        <text x="98" y="58" font-size="12" font-weight="bold" fill="#fde047">Single-Mode Fiber (SMF - Lõi 9 µm siêu nhỏ)</text>
        <text x="98" y="78" font-size="11" fill="#e2e8f0">Dùng tia Laser đi 1 đường thẳng — Đi xa tới 100 km (WAN)</text>

        <rect x="420" y="35" width="380" height="66" rx="6" fill="#0f172a" stroke="#f97316" stroke-width="2"/>
        <circle cx="460" cy="68" r="22" fill="#fed7aa" stroke="#f97316" stroke-width="2"/><circle cx="460" cy="68" r="11" fill="#ea580c"/>
        <text x="498" y="58" font-size="12" font-weight="bold" fill="#fdba74">Multimode Fiber (MMF - Lõi 50/62.5 µm lớn)</text>
        <text x="498" y="78" font-size="11" fill="#e2e8f0">Dùng đèn LED phản xạ nhiều tia — Đi trong tòa nhà &lt; 550m</text>
      </svg>
    `,
    photos: [
    {
        "url":  "images/utp_cable.jpg",
        "desc_vi":  "Bên trong vỏ nhựa cáp mạng LAN là 8 sợi dây đồng nhỏ chia thành 4 cặp xoắn chặt vào nhau (Cam, Xanh lá, Xanh dương, Nâu). Việc xoắn đôi giúp tự triệt tiêu nhiễu điện từ và nhiễu xuyên âm (Crosstalk), truyền tối đa 100 mét.",
        "desc_en":  "Contains 8 color-coded copper wires twisted into 4 pairs to cancel out EMI/RFI and crosstalk up to 100 meters.",
        "title_en":  "UTP Copper Cable (4 Twisted Pairs) \u0026 RJ-45 Connector",
        "title_vi":  "Cáp đồng xoắn đôi UTP (Unshielded Twisted Pair) \u0026 Đầu hạt mạng RJ-45"
    },
    {
        "url":  "images/fiber_optic.jpg",
        "desc_vi":  "Lõi làm bằng sợi thủy tinh siêu tinh khiết truyền dữ liệu bằng tia sáng Laser hoặc đèn LED. Cáp quang hoàn toàn không dẫn điện nên chống sét 100%, không bị nhiễu điện từ và truyền xa hàng chục kilomet giữa các tòa nhà/thành phố.",
        "desc_en":  "Transmits data as pulses of light through glass strands, offering complete immunity to EMI/lightning and long-distance high bandwidth.",
        "title_en":  "Fiber-Optic Patch Cable",
        "title_vi":  "Cáp quang học (Fiber-Optic Cable)"
    },
    {
        "url":  "images/sfp_module.jpg",
        "desc_vi":  "Cục thu phát quang bằng kim loại cắm vào khe Uplink của Switch hoặc Router. Nó làm nhiệm vụ chuyển đổi tín hiệu điện trong bo mạch thành tia sáng Laser phóng vào sợi cáp quang.",
        "desc_en":  "Hot-swappable transceiver that plugs into Switch/Router SFP slots to convert electrical signals into optical laser pulses.",
        "title_en":  "SFP Fiber-Optic Transceiver Module",
        "title_vi":  "Module quang SFP (Small Form-factor Pluggable)"
    },
    {
        "url":  "images/wifi_ap.jpg",
        "desc_vi":  "Phương tiện truyền dẫn thứ 3 tại Tầng Vật Lý: Chuyển đổi khung tin từ dây cáp mạng thành sóng điện từ vô tuyến (RF 2.4GHz / 5GHz / 6GHz) phát ra không gian cho Laptop và Điện thoại bắt sóng.",
        "desc_en":  "Bridges wired Ethernet LANs to wireless clients using radio frequency (RF) waves at 2.4 GHz, 5 GHz, and 6 GHz.",
        "title_en":  "Enterprise Wireless Access Point (WAP)",
        "title_vi":  "Bộ phát sóng Không dây Doanh nghiệp (Wireless Access Point - WAP)"
    }
]
  },

  5: {
    svg: `
      <svg viewBox="0 0 820 225" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, monospace">
        <rect width="820" height="225" rx="8" fill="#0f172a"/>
        <text x="20" y="30" font-size="14" font-weight="bold" fill="#38bdf8">BẢNG QUY ĐỔI NHỊ PHÂN 8-BIT (IPv4 OCTET) — VÍ DỤ ĐỔI SỐ 192 VÀ 168</text>

        <!-- Columns -->
        <g transform="translate(20, 45)">
          <rect x="0" y="0" width="95" height="36" fill="#1e293b" stroke="#475569"/><text x="47" y="23" font-size="13" font-weight="bold" text-anchor="middle" fill="#94a3b8">Lũy thừa 2</text>
          <rect x="95" y="0" width="85" height="36" fill="#1e293b" stroke="#475569"/><text x="137" y="23" font-size="13" font-weight="bold" text-anchor="middle" fill="#fbbf24">2^7 = 128</text>
          <rect x="180" y="0" width="85" height="36" fill="#1e293b" stroke="#475569"/><text x="222" y="23" font-size="13" font-weight="bold" text-anchor="middle" fill="#fbbf24">2^6 = 64</text>
          <rect x="265" y="0" width="85" height="36" fill="#1e293b" stroke="#475569"/><text x="307" y="23" font-size="13" font-weight="bold" text-anchor="middle" fill="#fbbf24">2^5 = 32</text>
          <rect x="350" y="0" width="85" height="36" fill="#1e293b" stroke="#475569"/><text x="392" y="23" font-size="13" font-weight="bold" text-anchor="middle" fill="#fbbf24">2^4 = 16</text>
          <rect x="435" y="0" width="85" height="36" fill="#1e293b" stroke="#475569"/><text x="477" y="23" font-size="13" font-weight="bold" text-anchor="middle" fill="#fbbf24">2^3 = 8</text>
          <rect x="520" y="0" width="85" height="36" fill="#1e293b" stroke="#475569"/><text x="562" y="23" font-size="13" font-weight="bold" text-anchor="middle" fill="#fbbf24">2^2 = 4</text>
          <rect x="605" y="0" width="85" height="36" fill="#1e293b" stroke="#475569"/><text x="647" y="23" font-size="13" font-weight="bold" text-anchor="middle" fill="#fbbf24">2^1 = 2</text>
          <rect x="690" y="0" width="85" height="36" fill="#1e293b" stroke="#475569"/><text x="732" y="23" font-size="13" font-weight="bold" text-anchor="middle" fill="#fbbf24">2^0 = 1</text>

          <!-- Row 192 -->
          <rect x="0" y="42" width="95" height="38" fill="#064e3b"/><text x="47" y="66" font-size="13" font-weight="bold" text-anchor="middle" fill="#6ee7b7">Số 192 =</text>
          <rect x="95" y="42" width="85" height="38" fill="#065f46" stroke="#10b981"/><text x="137" y="66" font-size="15" font-weight="bold" text-anchor="middle" fill="#fff">1 (128)</text>
          <rect x="180" y="42" width="85" height="38" fill="#065f46" stroke="#10b981"/><text x="222" y="66" font-size="15" font-weight="bold" text-anchor="middle" fill="#fff">1 (+64)</text>
          <rect x="265" y="42" width="510" height="38" fill="#0f172a" stroke="#334155"/><text x="520" y="66" font-size="14" text-anchor="middle" fill="#64748b">0   |   0   |   0   |   0   |   0   |   0</text>

          <!-- Row 168 -->
          <rect x="0" y="86" width="95" height="38" fill="#1e3a8a"/><text x="47" y="110" font-size="13" font-weight="bold" text-anchor="middle" fill="#93c5fd">Số 168 =</text>
          <rect x="95" y="86" width="85" height="38" fill="#1d4ed8" stroke="#60a5fa"/><text x="137" y="110" font-size="15" font-weight="bold" text-anchor="middle" fill="#fff">1 (128)</text>
          <rect x="180" y="86" width="85" height="38" fill="#0f172a" stroke="#334155"/><text x="222" y="110" font-size="14" text-anchor="middle" fill="#64748b">0</text>
          <rect x="265" y="86" width="85" height="38" fill="#1d4ed8" stroke="#60a5fa"/><text x="307" y="110" font-size="15" font-weight="bold" text-anchor="middle" fill="#fff">1 (+32)</text>
          <rect x="350" y="86" width="85" height="38" fill="#0f172a" stroke="#334155"/><text x="392" y="110" font-size="14" text-anchor="middle" fill="#64748b">0</text>
          <rect x="435" y="86" width="85" height="38" fill="#1d4ed8" stroke="#60a5fa"/><text x="477" y="110" font-size="15" font-weight="bold" text-anchor="middle" fill="#fff">1 (+8)</text>
          <rect x="520" y="86" width="255" height="38" fill="#0f172a" stroke="#334155"/><text x="647" y="110" font-size="14" text-anchor="middle" fill="#64748b">0   |   0   |   0</text>
        </g>
        <text x="20" y="202" font-size="12" fill="#e2e8f0">💡 Mẹo đổi Hex &lt;-&gt; Nhị phân: Cắt đôi 8-bit thành 2 cụm 4-bit (8-4-2-1). VD: 1010 1000 = A8 (vì 1010=10=A, 1000=8)</text>
      </svg>
    `,
    hardwareSvg: `
      <svg viewBox="0 0 820 115" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, monospace">
        <rect width="820" height="115" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
        <text x="20" y="24" font-size="12" font-weight="bold" fill="#0f172a">MINH HỌA CHUYỂN ĐỔI ĐỊA CHỈ MAC &amp; IPv6 BẰNG BẢNG NIBBLE 4-BIT (8 - 4 - 2 - 1)</text>
        <rect x="20" y="36" width="380" height="65" rx="6" fill="#eff6ff" stroke="#3b82f6"/>
        <text x="35" y="58" font-size="12" font-weight="bold" fill="#1d4ed8">Ví dụ 1 Byte trong Địa chỉ MAC:  0x5C</text>
        <text x="35" y="78" font-size="11.5" fill="#1e3a8a">• Số 5 = 0101 (4+1)   |   Chữ C (12) = 1100 (8+4)</text>
        <text x="35" y="94" font-size="11.5" font-weight="bold" fill="#0369a1">=&gt; Nhị phân: 0101 1100  (Thập phân: 64+16+8+4 = 92)</text>

        <rect x="420" y="36" width="380" height="65" rx="6" fill="#f0fdf4" stroke="#16a34a"/>
        <text x="435" y="58" font-size="12" font-weight="bold" fill="#15803d">Dãy 9 số Vàng của Subnet Mask (Octet):</text>
        <text x="435" y="78" font-size="11.5" fill="#14532d">0 -&gt; 128 (/25) -&gt; 192 (/26) -&gt; 224 (/27) -&gt; 240 (/28)</text>
        <text x="435" y="94" font-size="11.5" font-weight="bold" fill="#166534">-&gt; 248 (/29) -&gt; 252 (/30) -&gt; 254 (/31) -&gt; 255 (/32)</text>
      </svg>
    `,
    photos: [
    {
        "url":  "images/nic_card.jpg",
        "desc_vi":  "Tại sao phải học hệ cơ số 16 (Hexadecimal)? Vì mọi chiếc Card mạng NIC trên thế giới đều có mã định danh MAC gồm 12 chữ số Hex (ví dụ: 00:1B:63:84:45:E6) khắc cứng trên chip ROM.",
        "desc_en":  "Every network card has a globally unique 48-bit MAC address represented as 12 hexadecimal digits (0-9, A-F).",
        "title_en":  "Hexadecimal MAC Address Burned into a NIC",
        "title_vi":  "Địa chỉ vật lý MAC (Hệ Thập Lục Phân - Hexadecimal) trên Card mạng"
    },
    {
        "url":  "images/router_cisco.jpg",
        "desc_vi":  "Con người gõ địa chỉ IPv4 dạng Thập phân (192.168.1.1) hoặc IPv6 dạng Hex (2001:db8::1), nhưng CPU của Router hoàn toàn xử lý bằng chuỗi 32-bit và 128-bit Nhị phân (0 và 1).",
        "desc_en":  "Routers process 32-bit IPv4 addresses and 128-bit hexadecimal IPv6 addresses purely as binary bitstreams in hardware.",
        "title_en":  "Binary IPv4 \u0026 Hexadecimal IPv6 Processing on Routers",
        "title_vi":  "Xử lý Nhị phân (Binary) và Thập lục phân (Hex) trên Router"
    }
]
  },

  6: {
    svg: `
      <svg viewBox="0 0 820 215" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="820" height="215" rx="8" fill="#f8fafc"/>
        <text x="20" y="28" font-size="14" font-weight="bold" fill="#0f172a">CẤU TRÚC 2 TẦNG CON DATA LINK (LLC &amp; MAC) VÀ KHUNG TIN FRAME TẦNG 2</text>

        <!-- Sublayers -->
        <rect x="20" y="45" width="330" height="65" rx="6" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
        <text x="35" y="68" font-size="13" font-weight="bold" fill="#1e3a8a">Tầng con trên: LLC (IEEE 802.2 - Phần mềm)</text>
        <text x="35" y="90" font-size="11" fill="#1e40af">Nhận diện gói tin Tầng 3 bên trong là IPv4, IPv6 hay ARP</text>

        <rect x="20" y="120" width="330" height="75" rx="6" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
        <text x="35" y="143" font-size="13" font-weight="bold" fill="#14532d">Tầng con dưới: MAC (IEEE 802.3 / 802.11 - Card NIC)</text>
        <text x="35" y="163" font-size="11" fill="#166534">• Đóng khung Frame, gắn MAC Nguồn/Đích, kiểm lỗi FCS</text>
        <text x="35" y="181" font-size="11" fill="#166534">• Điều khiển truy cập: Full-Duplex, CSMA/CD, CSMA/CA</text>

        <!-- Frame Structure -->
        <rect x="375" y="45" width="425" height="150" rx="8" fill="#fff" stroke="#94a3b8"/>
        <text x="390" y="70" font-size="13" font-weight="bold" fill="#0f172a">3 Phần của một Khung tin (Data Link Frame):</text>

        <rect x="390" y="88" width="135" height="55" rx="4" fill="#0284c7"/>
        <text x="457" y="112" font-size="12" font-weight="bold" text-anchor="middle" fill="#fff">1. HEADER</text>
        <text x="457" y="130" font-size="10" text-anchor="middle" fill="#e0f2fe">MAC Đích + Nguồn + Type</text>

        <rect x="529" y="88" width="145" height="55" rx="4" fill="#f59e0b"/>
        <text x="601" y="112" font-size="12" font-weight="bold" text-anchor="middle" fill="#fff">2. DATA (PAYLOAD)</text>
        <text x="601" y="130" font-size="10" text-anchor="middle" fill="#fef3c7">Gói tin IP Packet (L3)</text>

        <rect x="678" y="88" width="105" height="55" rx="4" fill="#16a34a"/>
        <text x="730" y="112" font-size="12" font-weight="bold" text-anchor="middle" fill="#fff">3. TRAILER</text>
        <text x="730" y="130" font-size="10" text-anchor="middle" fill="#dcfce7">FCS (Kiểm lỗi CRC)</text>

        <text x="390" y="172" font-size="11" fill="#475569">⚡ Qua mỗi trạm Router, Header + Trailer Tầng 2 cũ bị bóc bỏ và thay mới!</text>
      </svg>
    `,
    hardwareSvg: `
      <svg viewBox="0 0 820 115" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="820" height="115" rx="8" fill="#0f172a"/>
        <text x="20" y="24" font-size="12" font-weight="bold" fill="#38bdf8">SO SÁNH TRỰC QUAN: HALF-DUPLEX (HUB / WI-FI) VS. FULL-DUPLEX (SWITCH HIỆN ĐẠI)</text>
        <rect x="20" y="36" width="380" height="65" rx="6" fill="#450a0a" stroke="#ef4444"/>
        <text x="35" y="56" font-size="12" font-weight="bold" fill="#fca5a5">Half-Duplex (1 làn đường chung — Dễ đụng độ):</text>
        <text x="35" y="76" font-size="11" fill="#fecaca">[PC1] ====== Đụng độ (Collision! ⚡) ======&gt; &lt;====== [Hub]</text>
        <text x="35" y="94" font-size="10.5" fill="#fde047">Phải bật CSMA/CD (cáp đồng) hoặc CSMA/CA (Wi-Fi)</text>

        <rect x="420" y="36" width="380" height="65" rx="6" fill="#064e3b" stroke="#10b981"/>
        <text x="435" y="56" font-size="12" font-weight="bold" fill="#6ee7b7">Full-Duplex (2 làn đường riêng — 0% Đụng độ):</text>
        <text x="435" y="76" font-size="11" fill="#d1fae5">[PC1] --- Cặp dây Phát (TX) ---&gt; &amp; &lt;--- Cặp dây Thu (RX) --- [Switch]</text>
        <text x="435" y="94" font-size="10.5" fill="#a7f3d0">Vừa truyền vừa nhận đồng thời 100% tốc độ, tắt CSMA/CD</text>
      </svg>
    `,
    photos: [
    {
        "url":  "images/nic_card.jpg",
        "desc_vi":  "Chip xử lý trên Card mạng chịu trách nhiệm đóng gói Packet thành Frame, gắn địa chỉ MAC nguồn/đích và tính toán mã kiểm lỗi FCS (CRC-32) ở đuôi Frame.",
        "desc_en":  "Performs frame encapsulation, MAC addressing, and FCS CRC-32 error checking in hardware.",
        "title_en":  "PCIe Ethernet NIC (Layer 2 LLC \u0026 MAC Sublayers)",
        "title_vi":  "Card mạng PCIe (Nơi thực thi Tầng con LLC và MAC của Tầng 2)"
    },
    {
        "url":  "images/switch_cisco.jpg",
        "desc_vi":  "Khi cắm cáp từ Card mạng vào cổng Switch Cisco, hai thiết bị tự động thương lượng chế độ Full-Duplex (vừa gửi vừa nhận đồng thời trên các cặp dây đồng riêng biệt), loại bỏ hoàn toàn hiện tượng đụng độ tín hiệu (Collision).",
        "desc_en":  "Modern switches operate in Full-Duplex mode over separate transmit and receive wire pairs, eliminating collisions.",
        "title_en":  "Full-Duplex Collision-Free Switching",
        "title_vi":  "Truyền dẫn Full-Duplex không đụng độ trên Switch hiện đại"
    }
]
  },

  7: {
    svg: `
      <svg viewBox="0 0 820 250" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="820" height="250" rx="8" fill="#f8fafc"/>
        <text x="20" y="26" font-size="14" font-weight="bold" fill="#0f172a">GIẢI PHẪU KHUNG TIN ETHERNET II (64 - 1518 BYTES) &amp; BẢNG MAC CỦA SWITCH</text>

        <!-- Ethernet Frame Fields -->
        <g transform="translate(20, 40)" font-size="11" font-weight="bold">
          <rect x="0" y="0" width="95" height="50" fill="#64748b" rx="4"/><text x="47" y="22" text-anchor="middle" fill="#fff">Preamble+SFD</text><text x="47" y="40" text-anchor="middle" fill="#e2e8f0" font-size="10">8 Bytes</text>
          <rect x="99" y="0" width="145" height="50" fill="#0284c7" rx="4"/><text x="171" y="22" text-anchor="middle" fill="#fff">Destination MAC</text><text x="171" y="40" text-anchor="middle" fill="#bae6fd" font-size="10">6 Bytes (12 số Hex)</text>
          <rect x="248" y="0" width="140" height="50" fill="#0369a1" rx="4"/><text x="318" y="22" text-anchor="middle" fill="#fff">Source MAC</text><text x="318" y="40" text-anchor="middle" fill="#bae6fd" font-size="10">6 Bytes (OUI + Serial)</text>
          <rect x="392" y="0" width="95" height="50" fill="#4f46e5" rx="4"/><text x="439" y="22" text-anchor="middle" fill="#fff">EtherType</text><text x="439" y="40" text-anchor="middle" fill="#e0e7ff" font-size="10">2 Bytes (0x0800)</text>
          <rect x="491" y="0" width="190" height="50" fill="#d97706" rx="4"/><text x="586" y="22" text-anchor="middle" fill="#fff">Data (IP Packet)</text><text x="586" y="40" text-anchor="middle" fill="#fef3c7" font-size="10">46 - 1500 Bytes</text>
          <rect x="685" y="0" width="95" height="50" fill="#16a34a" rx="4"/><text x="732" y="22" text-anchor="middle" fill="#fff">FCS (CRC)</text><text x="732" y="40" text-anchor="middle" fill="#dcfce7" font-size="10">4 Bytes</text>
        </g>

        <!-- Switch Learning vs Forwarding -->
        <rect x="20" y="108" width="380" height="125" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="35" y="132" font-size="13" font-weight="bold" fill="#1d4ed8">Bước 1: SWITCH HỌC (LEARN) — Nhìn SOURCE MAC</text>
        <text x="35" y="155" font-size="11.5" fill="#1e3a8a">• Frame từ PC1 đi vào cổng Fa0/1 mang Src MAC = 00-0A</text>
        <text x="35" y="175" font-size="11.5" fill="#1e3a8a">• Switch ghi ngay vào Bảng CAM: [Cổng Fa0/1 &lt;--&gt; 00-0A]</text>
        <text x="35" y="195" font-size="11.5" fill="#1e3a8a">• Lưu trong bộ nhớ 300 giây (5 phút) nếu có truyền tiếp sẽ làm mới.</text>

        <rect x="420" y="108" width="380" height="125" rx="6" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
        <text x="435" y="132" font-size="13" font-weight="bold" fill="#15803d">Bước 2: CHUYỂN TIẾP (FORWARD) — Nhìn DEST MAC</text>
        <text x="435" y="155" font-size="11.5" fill="#14532d">• Nếu Dest MAC ĐÃ CÓ trong bảng: Chuyển ra đúng 1 cổng đó.</text>
        <text x="435" y="175" font-size="11.5" fill="#14532d">• Nếu Dest MAC CHƯA CÓ (Unknown Unicast) hoặc là</text>
        <text x="435" y="195" font-size="11.5" fill="#14532d">  Broadcast (FF-FF-FF-FF-FF-FF): FLOOD ra mọi cổng trừ cổng vào!</text>
      </svg>
    `,
    hardwareSvg: `
      <svg viewBox="0 0 820 115" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, monospace">
        <rect width="820" height="115" rx="8" fill="#0f172a"/>
        <text x="20" y="24" font-size="12" font-weight="bold" fill="#38bdf8">MÀN HÌNH KẾT QUẢ THỰC TẾ LỆNH: SWITCH# SHOW MAC ADDRESS-TABLE</text>
        <rect x="20" y="34" width="780" height="68" rx="4" fill="#1e293b" stroke="#475569"/>
        <text x="35" y="52" font-size="11.5" font-weight="bold" fill="#fbbf24">Vlan    Mac Address       Type        Ports</text>
        <text x="35" y="69" font-size="11.5" fill="#4ade80">   1    0060.2f3a.07bc    DYNAMIC     Fa0/1    &lt;-- Học tự động từ Source MAC của PC1 (Lưu 300s)</text>
        <text x="35" y="86" font-size="11.5" fill="#4ade80">  10    001b.6384.45e6    DYNAMIC     Fa0/5    &lt;-- Học tự động từ Source MAC của PC2 (VLAN 10)</text>
        <text x="35" y="100" font-size="11" fill="#38bdf8">  10    000a.f311.9901    STATIC      Fa0/12   &lt;-- Gắn tĩnh bảo mật qua lệnh Port-Security Sticky</text>
      </svg>
    `,
    photos: [
    {
        "url":  "images/switch_cisco.jpg",
        "desc_vi":  "Bên trong Switch có chip phần cứng ASIC siêu tốc và bộ nhớ CAM. Mỗi khi có khung tin đi vào cổng, Switch lập tức đọc Source MAC để ghi nhớ máy nào đang ngồi ở cổng số mấy, rồi đọc Destination MAC để chuyển khung tin tới đúng cổng đích.",
        "desc_en":  "Uses dedicated ASIC chips to learn Source MAC addresses into its CAM table and forward frames based on Destination MAC.",
        "title_en":  "Cisco Layer 2 Switch — Hardware ASIC \u0026 CAM Table",
        "title_vi":  "Switch Layer 2 Cisco Catalyst — Học MAC vào bảng CAM Table"
    },
    {
        "url":  "images/server_rack.jpg",
        "desc_vi":  "Mỗi cổng trên Switch là một miền đụng độ riêng biệt (Microsegmentation), cho phép hàng chục máy tính truyền dữ liệu tốc độ Gigabit cùng lúc mà không làm nghẽn mạng của nhau.",
        "desc_en":  "Each switch port forms its own independent collision domain, enabling full-speed simultaneous communication.",
        "title_en":  "High-Density Switch Port Connections in a Rack",
        "title_vi":  "Kết nối hàng chục máy trạm vào Switch trung tâm trong Tủ Rack"
    }
]
  },

  8: {
    svg: `
      <svg viewBox="0 0 820 235" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, monospace">
        <rect width="820" height="235" rx="8" fill="#0f172a"/>
        <text x="20" y="28" font-size="14" font-weight="bold" fill="#38bdf8">GIẢI MÃ BẢNG ĐỊNH TUYẾN ROUTER CISCO (LỆNH: SHOW IP ROUTE)</text>

        <rect x="20" y="42" width="780" height="115" rx="6" fill="#1e293b" stroke="#475569"/>
        <text x="35" y="66" font-size="12" fill="#94a3b8">Gateway of last resort is 203.113.1.1 to network 0.0.0.0</text>
        <text x="35" y="90" font-size="12" font-weight="bold" fill="#4ade80">C    192.168.10.0/24 is directly connected, GigabitEthernet0/0/0   &lt;-- Mạng nối trực tiếp vào cổng</text>
        <text x="35" y="112" font-size="12" font-weight="bold" fill="#38bdf8">L    192.168.10.1/32 is directly connected, GigabitEthernet0/0/0   &lt;-- Địa chỉ IP của chính cổng Gi0/0/0</text>
        <text x="35" y="134" font-size="12" font-weight="bold" fill="#fbbf24">S    192.168.20.0/24 [1/0] via 10.1.1.2                            &lt;-- Tuyến đường Tĩnh (Static) qua trạm 10.1.1.2</text>
        <text x="35" y="152" font-size="12" font-weight="bold" fill="#f472b6">S*   0.0.0.0/0 [1/0] via 203.113.1.1                               &lt;-- Default Route đẩy ra Internet</text>

        <rect x="20" y="168" width="780" height="52" rx="6" fill="#172554"/>
        <text x="35" y="190" font-size="11.5" fill="#dbeafe">• Khi gói tin đi qua Router: Trường TTL (IPv4) / Hop Limit (IPv6) bị trừ đi 1. Nếu về 0 sẽ bị hủy và báo ICMP Time Exceeded.</text>
        <text x="35" y="210" font-size="11.5" fill="#dbeafe">• IPv6 Header cố định 40 Bytes, bỏ trường Checksum và Fragmentation để Router xử lý nhanh gấp nhiều lần IPv4!</text>
      </svg>
    `,
    hardwareSvg: `
      <svg viewBox="0 0 820 115" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="820" height="115" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
        <text x="20" y="24" font-size="12" font-weight="bold" fill="#0f172a">SO SÁNH CẤU TRÚC NHÃN IPv4 HEADER (20 BYTES - 12 TRƯỜNG) VS. IPv6 HEADER (40 BYTES - 8 TRƯỜNG)</text>
        <rect x="20" y="36" width="380" height="65" rx="6" fill="#fffbeb" stroke="#f59e0b"/>
        <text x="35" y="56" font-size="12" font-weight="bold" fill="#b45309">IPv4 Header (20–60 Bytes — Phức tạp):</text>
        <text x="35" y="75" font-size="11" fill="#78350f">Ver(4) | IHL | DSCP | Total Len | ID/Flags/Frag Offset</text>
        <text x="35" y="92" font-size="11" font-weight="bold" fill="#92400e">TTL | Protocol | Header Checksum | Src IP | Dst IP</text>

        <rect x="420" y="36" width="380" height="65" rx="6" fill="#f0fdf4" stroke="#16a34a"/>
        <text x="435" y="56" font-size="12" font-weight="bold" fill="#15803d">IPv6 Header (Cố định 40 Bytes — Tối ưu tốc độ):</text>
        <text x="435" y="75" font-size="11" fill="#14532d">Ver(6) | Traffic Class | Flow Label | Payload Length</text>
        <text x="435" y="92" font-size="11" font-weight="bold" fill="#166534">Next Header | Hop Limit | Src IPv6 (128b) | Dst IPv6 (128b)</text>
      </svg>
    `,
    photos: [
    {
        "url":  "images/router_cisco.jpg",
        "desc_vi":  "Router lưu trữ Bảng Định Tuyến (Routing Table - xem bằng lệnh show ip route). Khi nhận gói tin, Router so khớp địa chỉ IP đích với tuyến đường có Prefix dài nhất (Longest Prefix Match) để phóng gói tin đi.",
        "desc_en":  "Inspects the destination IP address of incoming packets and consults its routing table using Longest Prefix Match.",
        "title_en":  "Cisco ISR Router — Layer 3 Routing Engine",
        "title_vi":  "Router Cisco ISR — Bộ não Định tuyến ở Tầng 3 (Network Layer)"
    },
    {
        "url":  "images/sfp_module.jpg",
        "desc_vi":  "Để kết nối mạng LAN ở trụ sở Hà Nội với chi nhánh TP.HCM, các Router sử dụng cổng quang SFP hoặc cổng WAN tốc độ cao nối qua hạ tầng của nhà mạng ISP.",
        "desc_en":  "Connects enterprise branch routers across long-distance WAN links.",
        "title_en":  "WAN Fiber Uplink via SFP Transceiver",
        "title_vi":  "Kết nối Cáp quang WAN giữa các Router qua Module SFP"
    }
]
  },

  9: {
    svg: `
      <svg viewBox="0 0 820 230" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="820" height="230" rx="8" fill="#f8fafc"/>
        <text x="20" y="28" font-size="14" font-weight="bold" fill="#0f172a">QUY TRÌNH PHÂN GIẢI ĐỊA CHỈ ARP (IPv4): BƯỚC 1 BROADCAST &amp; BƯỚC 2 UNICAST</text>

        <!-- Step 1 -->
        <rect x="20" y="45" width="380" height="168" rx="8" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="35" y="68" font-size="13" font-weight="bold" fill="#b45309">1. ARP REQUEST (Hỏi cả làng - BROADCAST)</text>
        <text x="35" y="92" font-size="11.5" fill="#78350f">• PC1 (192.168.1.10) cần gửi cho .1.20 nhưng chưa biết MAC.</text>
        <text x="35" y="114" font-size="11.5" font-weight="bold" fill="#dc2626">• Đóng Frame với Dest MAC = FF-FF-FF-FF-FF-FF</text>
        <text x="35" y="136" font-size="11.5" fill="#78350f">• Nội dung: "Ai có IP 192.168.1.20 cho xin địa chỉ MAC?"</text>
        <text x="35" y="158" font-size="11.5" fill="#78350f">• Switch Flood gói này ra TẤT CẢ các cổng trong mạng LAN.</text>
        <text x="35" y="185" font-size="11" font-style="italic" fill="#92400e">⚠️ Lưu ý: Nếu đích ở khác mạng, PC1 sẽ hỏi ARP MAC của Default Gateway!</text>

        <!-- Step 2 -->
        <rect x="420" y="45" width="380" height="168" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
        <text x="435" y="68" font-size="13" font-weight="bold" fill="#15803d">2. ARP REPLY (Trả lời riêng - UNICAST)</text>
        <text x="435" y="92" font-size="11.5" fill="#14532d">• Chỉ duy nhất PC2 (192.168.1.20) khớp IP lên tiếng trả lời.</text>
        <text x="435" y="114" font-size="11.5" font-weight="bold" fill="#15803d">• Đóng Frame Unicast gửi thẳng về MAC của PC1 (AA-AA)</text>
        <text x="435" y="136" font-size="11.5" fill="#14532d">• Nội dung: "Tôi là 192.168.1.20 đây, MAC của tôi là BB-BB!"</text>
        <text x="435" y="158" font-size="11.5" fill="#14532d">• PC1 lưu cặp [192.168.1.20 &lt;-&gt; BB-BB] vào bảng ARP Cache.</text>
        <text x="435" y="185" font-size="11" font-style="italic" fill="#166534">💡 Trong IPv6: Thay ARP bằng ICMPv6 Neighbor Solicitation (NS) &amp; NA.</text>
      </svg>
    `,
    hardwareSvg: `
      <svg viewBox="0 0 820 110" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, monospace">
        <rect width="820" height="110" rx="8" fill="#0f172a"/>
        <text x="20" y="24" font-size="12" font-weight="bold" fill="#38bdf8">MÀN HÌNH KẾT QUẢ LỆNH: C:\&gt; ARP -A (TRÊN WINDOWS) &amp; ROUTER# SHOW IP ARP</text>
        <rect x="20" y="34" width="780" height="64" rx="4" fill="#1e293b" stroke="#475569"/>
        <text x="35" y="52" font-size="11.5" font-weight="bold" fill="#fbbf24">Internet Address      Physical Address      Type</text>
        <text x="35" y="70" font-size="11.5" fill="#4ade80">  192.168.1.1           00-1b-63-84-45-e6     dynamic   &lt;-- Địa chỉ MAC của Default Gateway (Router)</text>
        <text x="35" y="88" font-size="11.5" fill="#38bdf8">  192.168.1.20          00-60-2f-3a-07-bc     dynamic   &lt;-- Địa chỉ MAC của máy PC2 trong cùng LAN</text>
      </svg>
    `,
    photos: [
    {
        "url":  "images/switch_cisco.jpg",
        "desc_vi":  "Khi PC1 biết IP của PC2 nhưng chưa biết địa chỉ vật lý MAC, PC1 gửi bản tin ARP Request với MAC đích là FF:FF:FF:FF:FF:FF. Switch nhận thấy địa chỉ Broadcast này sẽ nhân bản và phát ra tất cả các cổng trong mạng LAN.",
        "desc_en":  "Because an ARP Request uses destination MAC FF:FF:FF:FF:FF:FF, the switch floods it out all ports in the local VLAN.",
        "title_en":  "ARP Step 1: Switch Floods Broadcast ARP Request",
        "title_vi":  "Bước 1 của ARP: Switch phát tán gói tin ARP Request (Broadcast) ra mọi cổng"
    },
    {
        "url":  "images/nic_card.jpg",
        "desc_vi":  "Chỉ duy nhất chiếc máy tính nào có địa chỉ IP trùng khớp mới tạo gói tin ARP Reply ghi rõ địa chỉ MAC trên Card mạng của mình và gửi riêng (Unicast) về cho máy hỏi.",
        "desc_en":  "Only the host owning the requested IPv4 address responds with a unicast ARP Reply containing its burned-in MAC address.",
        "title_en":  "ARP Step 2: Target NIC Sends Unicast ARP Reply",
        "title_vi":  "Bước 2 của ARP: Card mạng của máy đích trả lời ARP Reply (Unicast)"
    }
]
  },

  10: {
    svg: `
      <svg viewBox="0 0 820 225" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="820" height="225" rx="8" fill="#f8fafc"/>
        <text x="20" y="28" font-size="14" font-weight="bold" fill="#0f172a">CẤU HÌNH ROUTER NỐI 2 MẠNG LAN &amp; GIẢI MÃ LỆNH SHOW IP INTERFACE BRIEF</text>

        <!-- Topology -->
        <rect x="20" y="48" width="210" height="80" rx="6" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
        <text x="125" y="72" font-size="12" font-weight="bold" text-anchor="middle" fill="#1e3a8a">LAN 1: 192.168.10.0/24</text>
        <text x="125" y="92" font-size="11" text-anchor="middle" fill="#1e40af">PC1: 192.168.10.10</text>
        <text x="125" y="110" font-size="11" font-weight="bold" text-anchor="middle" fill="#1d4ed8">Gateway: 192.168.10.1</text>

        <rect x="315" y="48" width="190" height="80" rx="8" fill="#0f172a" stroke="#0284c7" stroke-width="2.5"/>
        <text x="410" y="75" font-size="13" font-weight="bold" text-anchor="middle" fill="#fff">🌐 Router R1</text>
        <text x="410" y="95" font-size="10.5" text-anchor="middle" fill="#4ade80">Gi0/0/0: 192.168.10.1</text>
        <text x="410" y="112" font-size="10.5" text-anchor="middle" fill="#38bdf8">Gi0/0/1: 192.168.20.1</text>

        <rect x="590" y="48" width="210" height="80" rx="6" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
        <text x="695" y="72" font-size="12" font-weight="bold" text-anchor="middle" fill="#14532d">LAN 2: 192.168.20.0/24</text>
        <text x="695" y="92" font-size="11" text-anchor="middle" fill="#166534">PC2: 192.168.20.10</text>
        <text x="695" y="110" font-size="11" font-weight="bold" text-anchor="middle" fill="#15803d">Gateway: 192.168.20.1</text>

        <line x1="230" y1="88" x2="315" y2="88" stroke="#2563eb" stroke-width="3"/>
        <line x1="505" y1="88" x2="590" y2="88" stroke="#16a34a" stroke-width="3"/>

        <!-- Status vs Protocol -->
        <rect x="20" y="142" width="780" height="68" rx="6" fill="#fff" stroke="#cbd5e1"/>
        <text x="35" y="165" font-size="12" font-weight="bold" fill="#0f172a">Cách đọc 2 cột cuối trong lệnh 'show ip interface brief':</text>
        <text x="35" y="185" font-size="11.5" fill="#dc2626">• Status = administratively down: Quên gõ lệnh 'no shutdown'!  |  Status = down: Tuột cáp, đứt cáp hoặc đầu kia tắt nguồn.</text>
        <text x="35" y="202" font-size="11.5" fill="#15803d">• Status = up &amp; Protocol = up: Cả Tầng 1 (Vật lý) và Tầng 2 (Data Link) đều hoạt động hoàn hảo!</text>
      </svg>
    `,
    hardwareSvg: `
      <svg viewBox="0 0 820 110" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, monospace">
        <rect width="820" height="110" rx="8" fill="#1e293b"/>
        <text x="20" y="24" font-size="12" font-weight="bold" fill="#38bdf8">MẶT SAU ROUTER DOANH NGHIỆP CISCO ISR 4321 (CÁC CỔNG VẬT LÝ CHÍNH)</text>
        <rect x="20" y="34" width="780" height="62" rx="4" fill="#0f172a" stroke="#475569" stroke-width="2"/>
        <rect x="40" y="46" width="58" height="38" rx="4" fill="#334155"/><text x="69" y="69" font-size="10" font-weight="bold" text-anchor="middle" fill="#f8fafc">POWER</text>
        <rect x="120" y="46" width="90" height="38" rx="4" fill="#0891b2"/><text x="165" y="64" font-size="10" font-weight="bold" text-anchor="middle" fill="#fff">CONSOLE</text><text x="165" y="78" font-size="9" text-anchor="middle" fill="#cffafe">RJ45 / USB</text>
        <rect x="235" y="46" width="115" height="38" rx="4" fill="#ca8a04"/><text x="292" y="64" font-size="11" font-weight="bold" text-anchor="middle" fill="#fff">Gi0/0/0 (LAN 1)</text><text x="292" y="78" font-size="9" text-anchor="middle" fill="#fef08a">192.168.10.1</text>
        <rect x="370" y="46" width="115" height="38" rx="4" fill="#16a34a"/><text x="427" y="64" font-size="11" font-weight="bold" text-anchor="middle" fill="#fff">Gi0/0/1 (LAN 2)</text><text x="427" y="78" font-size="9" text-anchor="middle" fill="#dcfce7">192.168.20.1</text>
        <rect x="515" y="46" width="260" height="38" rx="4" fill="#1e293b" stroke="#64748b" stroke-dasharray="4,3"/><text x="645" y="69" font-size="11" text-anchor="middle" fill="#94a3b8">Khe cắm mở rộng NIM (Serial WAN / Fiber)</text>
      </svg>
    `,
    photos: [
    {
        "url":  "images/router_cisco.jpg",
        "desc_vi":  "Khác với Switch (cắm dây là đèn sáng xanh), tất cả các cổng mạng trên Router Cisco khi xuất xưởng đều bị khóa (administratively down). Kỹ sư bắt buộc phải đặt IP và gõ lệnh \u0027no shutdown\u0027 thì cổng mới bật sáng!",
        "desc_en":  "Unlike switch ports, router interfaces are administratively down by default and require an IP address plus the \u0027no shutdown\u0027 command.",
        "title_en":  "Router GigabitEthernet Interfaces (Default Shutdown)",
        "title_vi":  "Các cổng GigabitEthernet (Gi0/0/0, Gi0/0/1) trên Router thực tế"
    },
    {
        "url":  "images/console_cable.jpg",
        "desc_vi":  "Sử dụng dây cáp Console nối từ Laptop vào cổng Console của Router để thiết lập hostname, mật khẩu bảo mật, banner cảnh báo và địa chỉ IP Default Gateway cho các mạng LAN.",
        "desc_en":  "Connecting a laptop to the router\u0027s console port to configure initial security, interface IPs, and SSH access.",
        "title_en":  "Initial Router Provisioning via Console Cable",
        "title_vi":  "Cấu hình Router thực tế qua dây cáp Console"
    }
]
  },

  11: {
    svg: `
      <svg viewBox="0 0 820 250" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, monospace">
        <rect width="820" height="250" rx="8" fill="#0f172a"/>
        <text x="20" y="28" font-size="14" font-weight="bold" fill="#38bdf8">BẢNG TRA NHANH CHIA MẠNG CON (SUBNETTING) &amp; BƯỚC NHẢY (BLOCK SIZE)</text>

        <g transform="translate(20, 42)" font-size="11.5">
          <rect x="0" y="0" width="780" height="30" fill="#1e293b"/>
          <text x="15" y="20" font-weight="bold" fill="#fbbf24">Prefix</text>
          <text x="95" y="20" font-weight="bold" fill="#fbbf24">Subnet Mask</text>
          <text x="260" y="20" font-weight="bold" fill="#fbbf24">Octet 4 (Nhị phân)</text>
          <text x="450" y="20" font-weight="bold" fill="#fbbf24">Bước nhảy (256-M)</text>
          <text x="605" y="20" font-weight="bold" fill="#fbbf24">Số IP dùng được (2^h - 2)</text>

          <text x="15" y="48" fill="#fff">/24</text><text x="95" y="48" fill="#cbd5e1">255.255.255.0</text><text x="260" y="48" fill="#94a3b8">00000000 (h=8)</text><text x="450" y="48" fill="#38bdf8">256</text><text x="605" y="48" fill="#4ade80">254 máy (1 mạng /24)</text>
          <text x="15" y="72" fill="#fff">/25</text><text x="95" y="72" fill="#cbd5e1">255.255.255.128</text><text x="260" y="72" fill="#94a3b8">10000000 (h=7)</text><text x="450" y="72" fill="#38bdf8">128 (.0, .128)</text><text x="605" y="72" fill="#4ade80">126 máy (2 mạng con)</text>
          <text x="15" y="96" fill="#fff">/26</text><text x="95" y="96" fill="#cbd5e1">255.255.255.192</text><text x="260" y="96" fill="#94a3b8">11000000 (h=6)</text><text x="450" y="96" fill="#38bdf8">64 (.0, .64, .128, .192)</text><text x="605" y="96" fill="#4ade80">62 máy (4 mạng con)</text>
          <text x="15" y="120" fill="#fff">/27</text><text x="95" y="120" fill="#cbd5e1">255.255.255.224</text><text x="260" y="120" fill="#94a3b8">11100000 (h=5)</text><text x="450" y="120" fill="#38bdf8">32 (.0, .32, .64, .96...)</text><text x="605" y="120" fill="#4ade80">30 máy (8 mạng con)</text>
          <text x="15" y="144" fill="#fff">/28</text><text x="95" y="144" fill="#cbd5e1">255.255.255.240</text><text x="260" y="144" fill="#94a3b8">11110000 (h=4)</text><text x="450" y="144" fill="#38bdf8">16 (.0, .16, .32, .48...)</text><text x="605" y="144" fill="#4ade80">14 máy (16 mạng con)</text>
          <text x="15" y="168" fill="#fff">/29</text><text x="95" y="168" fill="#cbd5e1">255.255.255.248</text><text x="260" y="168" fill="#94a3b8">11111000 (h=3)</text><text x="450" y="168" fill="#38bdf8">8 (.0, .8, .16, .24...)</text><text x="605" y="168" fill="#4ade80">6 máy (32 mạng con)</text>
          <text x="15" y="192" fill="#fff">/30</text><text x="95" y="192" fill="#cbd5e1">255.255.255.252</text><text x="260" y="192" fill="#94a3b8">11111100 (h=2)</text><text x="450" y="192" fill="#38bdf8">4 (.0, .4, .8, .12...)</text><text x="605" y="192" fill="#f472b6">2 máy (Nối 2 Router P2P)</text>
        </g>
      </svg>
    `,
    hardwareSvg: `
      <svg viewBox="0 0 820 115" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="820" height="115" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
        <text x="20" y="24" font-size="12" font-weight="bold" fill="#0f172a">SƠ ĐỒ CHIA VLSM THỰC TẾ TRÊN 1 MẠNG /24 (256 ĐỊA CHỈ TỪ .0 ĐẾN .255)</text>
        <rect x="20" y="38" width="240" height="58" rx="4" fill="#0284c7"/><text x="140" y="62" font-size="12" font-weight="bold" text-anchor="middle" fill="#fff">LAN 1: /26 (64 IPs: .0 -&gt; .63)</text><text x="140" y="82" font-size="10.5" text-anchor="middle" fill="#e0f2fe">Dùng cho Phòng Kinh Doanh (50 máy)</text>
        <rect x="264" y="38" width="160" height="58" rx="4" fill="#16a34a"/><text x="344" y="62" font-size="12" font-weight="bold" text-anchor="middle" fill="#fff">LAN 2: /27 (.64 -&gt; .95)</text><text x="344" y="82" font-size="10.5" text-anchor="middle" fill="#dcfce7">Phòng IT (20 máy)</text>
        <rect x="428" y="38" width="110" height="58" rx="4" fill="#d97706"/><text x="483" y="62" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#fff">WAN: /30 (.96-.99)</text><text x="483" y="82" font-size="10" text-anchor="middle" fill="#fef3c7">R1-R2 (2 IPs)</text>
        <rect x="542" y="38" width="258" height="58" rx="4" fill="#e2e8f0" stroke="#94a3b8" stroke-dasharray="5,3"/><text x="671" y="62" font-size="12" font-weight="bold" text-anchor="middle" fill="#334155">Còn trống (.100 -&gt; .255)</text><text x="671" y="82" font-size="10.5" text-anchor="middle" fill="#64748b">Dự trữ mở rộng chi nhánh mới</text>
      </svg>
    `,
    photos: [
    {
        "url":  "images/router_cisco.jpg",
        "desc_vi":  "Khi chia mạng con (Subnetting), bạn không thể đặt 2 cổng của cùng 1 chiếc Router thuộc cùng 1 dải mạng. Ví dụ: Cổng Gi0/0/0 là mạng Phòng Kế Toán (192.168.1.0/26), cổng Gi0/0/1 là mạng Phòng Kỹ Thuật (192.168.1.64/26).",
        "desc_en":  "Every router interface bounds a separate broadcast domain and must be assigned a unique IPv4 subnet.",
        "title_en":  "Router Interfaces Separate Distinct IPv4 Subnets",
        "title_vi":  "Mỗi cổng trên Router là một Mạng Con (Subnet / Broadcast Domain) riêng biệt"
    },
    {
        "url":  "images/server_rack.jpg",
        "desc_vi":  "Trong thực tế đi làm, các địa chỉ IP đầu tiên của mỗi Subnet (ví dụ .1 đến .10) luôn được kỹ sư quy hoạch đặt tĩnh cho Default Gateway (Router), Switch, Firewall và Máy chủ Server.",
        "desc_en":  "In production networks, the first usable IPs in each subnet are reserved for gateways, switches, and rack servers.",
        "title_en":  "Static IP Allocation for Servers \u0026 Network Infrastructure",
        "title_vi":  "Quy hoạch địa chỉ IP tĩnh cho Tủ Server \u0026 Thiết bị mạng"
    }
]
  },

  12: {
    svg: `
      <svg viewBox="0 0 820 225" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, monospace">
        <rect width="820" height="225" rx="8" fill="#f8fafc"/>
        <text x="20" y="28" font-size="14" font-weight="bold" fill="#0f172a">CẤU TRÚC 128-BIT CỦA ĐỊA CHỈ IPv6 GLOBAL UNICAST (/64) &amp; QUY TẮC RÚT GỌN</text>

        <!-- 3 Parts of IPv6 GUA -->
        <rect x="20" y="45" width="280" height="65" rx="6" fill="#0284c7"/>
        <text x="160" y="70" font-size="13" font-weight="bold" text-anchor="middle" fill="#fff">2001 : 0db8 : acad</text>
        <text x="160" y="92" font-size="11" text-anchor="middle" fill="#e0f2fe">Global Routing Prefix (48 bits - 3 Hextets)</text>

        <rect x="306" y="45" width="135" height="65" rx="6" fill="#f59e0b"/>
        <text x="373" y="70" font-size="13" font-weight="bold" text-anchor="middle" fill="#fff">0001</text>
        <text x="373" y="92" font-size="11" text-anchor="middle" fill="#fef3c7">Subnet ID (16 bits)</text>

        <rect x="447" y="45" width="353" height="65" rx="6" fill="#16a34a"/>
        <text x="623" y="70" font-size="13" font-weight="bold" text-anchor="middle" fill="#fff">0000 : 0000 : 0000 : 0200</text>
        <text x="623" y="92" font-size="11" text-anchor="middle" fill="#dcfce7">Interface ID / Phần Host (64 bits - 4 Hextets)</text>

        <!-- Compression Rules Box -->
        <rect x="20" y="125" width="780" height="85" rx="6" fill="#fff" stroke="#94a3b8"/>
        <text x="35" y="148" font-size="12" font-weight="bold" fill="#0369a1">• Quy tắc 1 (Bỏ số 0 đứng đầu mỗi cụm):  2001 : db8 : acad : 1 : 0 : 0 : 0 : 200</text>
        <text x="35" y="170" font-size="12" font-weight="bold" fill="#15803d">• Quy tắc 2 (Thay chuỗi số 0 liên tiếp bằng :: đúng 1 lần):  2001:db8:acad:1::200/64</text>
        <text x="35" y="194" font-size="11.5" fill="#475569">💡 Địa chỉ Link-Local (fe80::/10) tự động sinh ra trên mọi cổng IPv6 và đóng vai trò Default Gateway trong mạng LAN.</text>
      </svg>
    `,
    hardwareSvg: `
      <svg viewBox="0 0 820 110" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, monospace">
        <rect width="820" height="110" rx="8" fill="#0f172a"/>
        <text x="20" y="24" font-size="12" font-weight="bold" fill="#38bdf8">QUY TRÌNH BIẾN ĐỔI ĐỊA CHỈ MAC 48-BIT THÀNH 64-BIT INTERFACE ID THEO CHUẨN EUI-64</text>
        <rect x="20" y="36" width="230" height="58" rx="4" fill="#1e293b" stroke="#64748b"/>
        <text x="135" y="58" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#fbbf24">1. MAC Gốc (48-bit):</text>
        <text x="135" y="80" font-size="12" font-weight="bold" text-anchor="middle" fill="#fff">00-60-2F  |  3A-07-BC</text>

        <rect x="275" y="36" width="255" height="58" rx="4" fill="#1e293b" stroke="#38bdf8"/>
        <text x="402" y="58" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#38bdf8">2. Chèn FFFE vào chính giữa:</text>
        <text x="402" y="80" font-size="12" font-weight="bold" text-anchor="middle" fill="#fff">0060:2F [FF:FE] 3A:07BC</text>

        <rect x="555" y="36" width="245" height="58" rx="4" fill="#064e3b" stroke="#10b981"/>
        <text x="677" y="58" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#6ee7b7">3. Đảo bit số 7 (00 -&gt; 02):</text>
        <text x="677" y="80" font-size="12" font-weight="bold" text-anchor="middle" fill="#fff">0260:2fff:fe3a:07bc</text>
      </svg>
    `,
    photos: [
    {
        "url":  "images/router_cisco.jpg",
        "desc_vi":  "Khi bật lệnh \u0027ipv6 unicast-routing\u0027, Router sẽ định kỳ phát bản tin ICMPv6 RA chứa Prefix /64 ra mạng LAN để mọi máy tính tự động sinh địa chỉ IPv6 Global Unicast mà không cần máy chủ DHCP!",
        "desc_en":  "Once \u0027ipv6 unicast-routing\u0027 is enabled, the router sends Router Advertisements so hosts can self-configure IPv6 addresses via SLAAC.",
        "title_en":  "Cisco Router Broadcasting ICMPv6 RA for SLAAC",
        "title_vi":  "Router Cisco phát bản tin RA (Router Advertisement) cấp IPv6 tự động (SLAAC)"
    },
    {
        "url":  "images/nic_card.jpg",
        "desc_vi":  "Ngay khi bật IPv6, Card mạng lấy địa chỉ MAC 48-bit của mình, chèn thêm FFFE vào giữa và đảo bit thứ 7 (quy tắc EUI-64) để tự tạo ra địa chỉ giao tiếp nội bộ FE80::/10.",
        "desc_en":  "Network interfaces automatically create a Link-Local IPv6 address (\fe80::/10) using EUI-64 or random interface IDs.",
        "title_en":  "NIC Auto-Generating IPv6 Link-Local Address (FE80::)",
        "title_vi":  "Card mạng tự động sinh địa chỉ Link-Local (FE80::) từ địa chỉ MAC"
    }
]
  },

  13: {
    svg: `
      <svg viewBox="0 0 820 220" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="820" height="220" rx="8" fill="#f8fafc"/>
        <text x="20" y="28" font-size="14" font-weight="bold" fill="#0f172a">NGUYÊN LÝ HOẠT ĐỘNG CỦA TRACEROUTE (TRACERT) DỰA TRÊN TTL &amp; ICMP TIME EXCEEDED</text>

        <!-- Devices -->
        <rect x="25" y="60" width="110" height="55" rx="6" fill="#0284c7"/><text x="80" y="92" font-size="12" font-weight="bold" text-anchor="middle" fill="#fff">💻 PC (Nguồn)</text>
        <circle cx="280" cy="87" r="34" fill="#0f172a"/><text x="280" y="91" font-size="12" font-weight="bold" text-anchor="middle" fill="#38bdf8">Router 1</text>
        <circle cx="490" cy="87" r="34" fill="#0f172a"/><text x="490" y="91" font-size="12" font-weight="bold" text-anchor="middle" fill="#38bdf8">Router 2</text>
        <rect x="675" y="60" width="120" height="55" rx="6" fill="#16a34a"/><text x="735" y="92" font-size="12" font-weight="bold" text-anchor="middle" fill="#fff">🖥️ Server Đích</text>

        <line x1="135" y1="87" x2="246" y2="87" stroke="#64748b" stroke-width="2"/>
        <line x1="314" y1="87" x2="456" y2="87" stroke="#64748b" stroke-width="2"/>
        <line x1="524" y1="87" x2="675" y2="87" stroke="#64748b" stroke-width="2"/>

        <!-- Explanations -->
        <rect x="25" y="132" width="770" height="75" rx="6" fill="#fff" stroke="#cbd5e1"/>
        <text x="40" y="154" font-size="11.5" fill="#0369a1" font-weight="bold">• Lượt 1: PC gửi gói tin với TTL = 1 ---&gt; Tới Router 1 bị trừ về TTL = 0 ---&gt; Router 1 trả về ICMP Time Exceeded (Biết được IP Trạm 1!)</text>
        <text x="40" y="174" font-size="11.5" fill="#b45309" font-weight="bold">• Lượt 2: PC gửi gói tin với TTL = 2 ---&gt; Qua R1 còn 1, tới Router 2 về TTL = 0 ---&gt; Router 2 trả về Time Exceeded (Biết được IP Trạm 2!)</text>
        <text x="40" y="194" font-size="11.5" fill="#15803d" font-weight="bold">• Lượt 3: PC gửi gói tin với TTL = 3 ---&gt; Chạm tới Server Đích ---&gt; Server trả về ICMP Echo Reply hoàn tất hành trình!</text>
      </svg>
    `,
    hardwareSvg: `
      <svg viewBox="0 0 820 110" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, monospace">
        <rect width="820" height="110" rx="8" fill="#0f172a"/>
        <text x="20" y="24" font-size="12" font-weight="bold" fill="#38bdf8">KÝ HIỆU KẾT QUẢ PING TRÊN CISCO IOS CLI (CẦN PHÂN BIỆT RÕ KHI THI)</text>
        <rect x="20" y="35" width="250" height="60" rx="4" fill="#064e3b" stroke="#10b981"/>
        <text x="145" y="58" font-size="14" font-weight="bold" text-anchor="middle" fill="#4ade80">. ! ! ! !  (Success 80%)</text>
        <text x="145" y="78" font-size="10.5" text-anchor="middle" fill="#d1fae5">Rớt gói 1 do chờ ARP, 4 gói sau thông</text>

        <rect x="285" y="35" width="250" height="60" rx="4" fill="#1e293b" stroke="#f59e0b"/>
        <text x="410" y="58" font-size="14" font-weight="bold" text-anchor="middle" fill="#fbbf24">. . . . .  (Success 0%)</text>
        <text x="410" y="78" font-size="10.5" text-anchor="middle" fill="#fde68a">Timeout: Đích chặn Firewall hoặc mất đường về</text>

        <rect x="550" y="35" width="250" height="60" rx="4" fill="#450a0a" stroke="#ef4444"/>
        <text x="675" y="58" font-size="14" font-weight="bold" text-anchor="middle" fill="#fca5a5">U . U . U  (Unreachable)</text>
        <text x="675" y="78" font-size="10.5" text-anchor="middle" fill="#fecaca">Router báo thiếu Route hoặc bị ACL chặn!</text>
      </svg>
    `,
    photos: [
    {
        "url":  "images/router_cisco.jpg",
        "desc_vi":  "Khi bạn gõ lệnh \u0027tracert 8.8.8.8\u0027, mỗi chiếc Router trên đường đi khi giảm TTL về 0 sẽ gửi trả lại một bản tin ICMP Time Exceeded về máy bạn, nhờ đó vẽ ra được toàn bộ bản đồ các trạm trung gian!",
        "desc_en":  "Each router decrements the packet\u0027s TTL and replies with ICMP Time Exceeded when TTL hits zero, enabling traceroute path discovery.",
        "title_en":  "Router Generating ICMP Time Exceeded for Traceroute",
        "title_vi":  "Router giảm chỉ số TTL và gửi bản tin báo lỗi ICMP Time Exceeded"
    },
    {
        "url":  "images/switch_cisco.jpg",
        "desc_vi":  "Khi mạng gặp sự cố, kỹ sư dùng lệnh \u0027ping\u0027 (ICMP Echo Request / Echo Reply) theo thứ tự: Ping 127.0.0.1 -\u003e Ping IP máy mình -\u003e Ping Default Gateway (Router) -\u003e Ping 8.8.8.8.",
        "desc_en":  "Engineers isolate faults by pinging loopback (127.0.0.1), local LAN hosts, the Default Gateway, and remote Internet IPs.",
        "title_en":  "Step-by-Step Connectivity Verification with ICMP Ping",
        "title_vi":  "Kiểm tra kết nối từng chặng từ Switch nội bộ ra Router biên bằng lệnh Ping"
    }
]
  },

  14: {
    svg: `
      <svg viewBox="0 0 820 235" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="820" height="235" rx="8" fill="#f8fafc"/>
        <text x="20" y="28" font-size="14" font-weight="bold" fill="#0f172a">BẮT TAY 3 BƯỚC TCP (3-WAY HANDSHAKE) VS. TRUYỀN NHANH UDP</text>

        <!-- TCP 3-way handshake -->
        <rect x="20" y="42" width="420" height="178" rx="8" fill="#fff" stroke="#0284c7" stroke-width="1.5"/>
        <text x="35" y="64" font-size="13" font-weight="bold" fill="#0369a1">TCP (An toàn, Bắt tay 3 bước, Báo nhận ACK)</text>

        <rect x="40" y="78" width="90" height="125" rx="6" fill="#dbeafe"/><text x="85" y="142" font-size="12" font-weight="bold" text-anchor="middle" fill="#1e3a8a">PC Client</text>
        <rect x="325" y="78" width="95" height="125" rx="6" fill="#dcfce7"/><text x="372" y="142" font-size="12" font-weight="bold" text-anchor="middle" fill="#14532d">Web Server</text>

        <line x1="130" y1="95" x2="325" y2="112" stroke="#0284c7" stroke-width="2"/>
        <text x="227" y="96" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#0369a1">1. SYN (SEQ = 100) ---&gt;</text>

        <line x1="325" y1="132" x2="130" y2="149" stroke="#16a34a" stroke-width="2"/>
        <text x="227" y="135" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#15803d">&lt;--- 2. SYN + ACK (SEQ=300, ACK=101)</text>

        <line x1="130" y1="170" x2="325" y2="187" stroke="#0284c7" stroke-width="2"/>
        <text x="227" y="173" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#0369a1">3. ACK (ACK = 301) ---&gt; ESTABLISHED!</text>

        <!-- UDP -->
        <rect x="455" y="42" width="345" height="178" rx="8" fill="#fff" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="470" y="64" font-size="13" font-weight="bold" fill="#b45309">UDP (Tốc độ cao, Header 8 Bytes nhẹ)</text>
        <text x="470" y="92" font-size="11.5" fill="#78350f">• Không bắt tay trước khi gửi</text>
        <text x="470" y="114" font-size="11.5" fill="#78350f">• Không dừng lại chờ gói ACK báo nhận</text>
        <text x="470" y="136" font-size="11.5" fill="#78350f">• Không gửi lại gói bị rớt (tránh trễ tiếng/hình)</text>
        <text x="470" y="164" font-size="11.5" font-weight="bold" fill="#0f172a">Ứng dụng chuẩn:</text>
        <text x="470" y="184" font-size="11" fill="#334155">• TCP: Web (80/443), SSH (22), Email (25/110/143), FTP</text>
        <text x="470" y="202" font-size="11" fill="#334155">• UDP: DNS (53), DHCP (67/68), TFTP (69), VoIP, Game</text>
      </svg>
    `,
    hardwareSvg: `
      <svg viewBox="0 0 820 110" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="820" height="110" rx="8" fill="#0f172a"/>
        <text x="20" y="24" font-size="12" font-weight="bold" fill="#38bdf8">SO SÁNH KÍCH THƯỚC HEADER TẦNG 4: TCP HEADER (20 BYTES) VS. UDP HEADER (8 BYTES)</text>
        <rect x="20" y="36" width="480" height="60" rx="4" fill="#1e3a8a" stroke="#60a5fa"/>
        <text x="35" y="55" font-size="11.5" font-weight="bold" fill="#93c5fd">TCP Header (Tối thiểu 20 Bytes — Đầy đủ kiểm soát):</text>
        <text x="35" y="78" font-size="10.5" fill="#fff">Src Port(16b) | Dst Port(16b) | Sequence #(32b) | ACK #(32b) | Flags(SYN/ACK/FIN) | Window(16b) | Checksum</text>

        <rect x="515" y="36" width="285" height="60" rx="4" fill="#78350f" stroke="#fbbf24"/>
        <text x="530" y="55" font-size="11.5" font-weight="bold" fill="#fde047">UDP Header (Chỉ 8 Bytes — Siêu gọn):</text>
        <text x="530" y="78" font-size="10.5" fill="#fff">Src Port (16b) | Dst Port (16b) | Length | Checksum</text>
      </svg>
    `,
    photos: [
    {
        "url":  "images/server_rack.jpg",
        "desc_vi":  "Một chiếc máy chủ chỉ có 1 địa chỉ IP nhưng chạy hàng chục dịch vụ cùng lúc nhờ Số hiệu Cổng (Port Number) ở Tầng 4: Cổng TCP 443 cho Web HTTPS, TCP 22 cho quản trị SSH, UDP 53 cho DNS.",
        "desc_en":  "A single server IP hosts multiple simultaneous services distinguished by Layer 4 port numbers (TCP 443 HTTPS, TCP 22 SSH, UDP 53 DNS).",
        "title_en":  "Multi-Service Rack Server Listening on TCP/UDP Ports",
        "title_vi":  "Hệ thống Máy chủ (Server) lắng nghe đồng thời nhiều Cổng dịch vụ (TCP/UDP Ports)"
    },
    {
        "url":  "images/ip_phone.jpg",
        "desc_vi":  "Tại sao gọi điện thoại VoIP hay họp Zoom không dùng TCP mà phải dùng UDP? Vì giọng nói cần truyền ngay lập tức với độ trễ thấp nhất — nếu rớt 1 gói âm thanh nhỏ (0.01 giây) thì bỏ qua luôn chứ không dừng cuộc gọi lại để xin gửi lại như TCP!",
        "desc_en":  "Real-time voice and video traffic rely on connectionless UDP to avoid retransmission delays and head-of-line blocking.",
        "title_en":  "VoIP IP Phone Using Low-Latency UDP Transport",
        "title_vi":  "Điện thoại IP Phone sử dụng giao thức UDP để truyền âm thanh thời gian thực"
    }
]
  },

  15: {
    svg: `
      <svg viewBox="0 0 820 225" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="820" height="225" rx="8" fill="#f8fafc"/>
        <text x="20" y="28" font-size="14" font-weight="bold" fill="#0f172a">QUY TRÌNH 4 BƯỚC DORA CỦA DHCP &amp; SO SÁNH EMAIL SMTP / POP3 / IMAP</text>

        <!-- DHCP DORA -->
        <rect x="20" y="42" width="390" height="168" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="35" y="65" font-size="13" font-weight="bold" fill="#1d4ed8">Quy trình 4 Bước DHCP (D - O - R - A):</text>
        <text x="35" y="92" font-size="11.5" font-weight="bold" fill="#1e3a8a">1. [D] DHCP Discover (Client Broadcast ---&gt;):</text>
        <text x="50" y="108" font-size="11" fill="#334155">"Có máy chủ DHCP nào ở đây không? Cho xin IP!"</text>
        <text x="35" y="128" font-size="11.5" font-weight="bold" fill="#15803d">2. [O] DHCP Offer (&lt;--- Server Đề nghị):</text>
        <text x="50" y="144" font-size="11" fill="#334155">"Tôi có IP 192.168.1.50/24 đang rảnh, bạn lấy không?"</text>
        <text x="35" y="164" font-size="11.5" font-weight="bold" fill="#b45309">3. [R] DHCP Request (Client Broadcast ---&gt;): "Tôi đồng ý lấy!"</text>
        <text x="35" y="186" font-size="11.5" font-weight="bold" fill="#0369a1">4. [A] DHCP ACK (&lt;--- Server Xác nhận cấp IP + DNS)</text>

        <!-- DNS & Email -->
        <rect x="425" y="42" width="375" height="168" rx="8" fill="#fff" stroke="#cbd5e1" stroke-width="1.5"/>
        <text x="440" y="65" font-size="13" font-weight="bold" fill="#0f172a">Các bản ghi DNS (Port 53) &amp; Giao thức Email:</text>
        <text x="440" y="90" font-size="11.5" fill="#334155">• Bản ghi A: Tên miền -&gt; IPv4  |  AAAA: Tên miền -&gt; IPv6</text>
        <text x="440" y="110" font-size="11.5" fill="#334155">• Bản ghi MX: Máy chủ Mail  |  NS: Máy chủ quản lý tên miền</text>
        <text x="440" y="138" font-size="11.5" font-weight="bold" fill="#0369a1">• SMTP (TCP 25): Chỉ dùng để GỬI và CHUYỂN TIẾP thư.</text>
        <text x="440" y="160" font-size="11.5" font-weight="bold" fill="#dc2626">• POP3 (TCP 110): Tải thư về máy xong XÓA luôn trên Server.</text>
        <text x="440" y="182" font-size="11.5" font-weight="bold" fill="#15803d">• IMAP (TCP 143): Giữ thư trên Server, ĐỒNG BỘ nhiều máy.</text>
      </svg>
    `,
    hardwareSvg: `
      <svg viewBox="0 0 820 110" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="820" height="110" rx="8" fill="#0f172a"/>
        <text x="20" y="24" font-size="12" font-weight="bold" fill="#38bdf8">HÀNH TRÌNH ĐẦY ĐỦ KHI MỞ WEB: 1. DHCP (DORA) ---&gt; 2. ARP GATEWAY ---&gt; 3. DNS (PORT 53) ---&gt; 4. HTTPS (PORT 443)</text>
        <rect x="20" y="38" width="180" height="55" rx="5" fill="#1e293b" stroke="#38bdf8"/><text x="110" y="60" font-size="11" font-weight="bold" text-anchor="middle" fill="#38bdf8">Bước 1: DHCP (UDP 67/68)</text><text x="110" y="78" font-size="10" text-anchor="middle" fill="#cbd5e1">Nhận IP, Mask, GW, DNS</text>
        <rect x="220" y="38" width="180" height="55" rx="5" fill="#1e293b" stroke="#fbbf24"/><text x="310" y="60" font-size="11" font-weight="bold" text-anchor="middle" fill="#fbbf24">Bước 2: ARP Request</text><text x="310" y="78" font-size="10" text-anchor="middle" fill="#cbd5e1">Tìm MAC của Default GW</text>
        <rect x="420" y="38" width="180" height="55" rx="5" fill="#1e293b" stroke="#a855f7"/><text x="510" y="60" font-size="11" font-weight="bold" text-anchor="middle" fill="#d8b4fe">Bước 3: DNS (UDP 53)</text><text x="510" y="78" font-size="10" text-anchor="middle" fill="#cbd5e1">Dịch cisco.com ra IP</text>
        <rect x="620" y="38" width="180" height="55" rx="5" fill="#064e3b" stroke="#10b981"/><text x="710" y="60" font-size="11" font-weight="bold" text-anchor="middle" fill="#4ade80">Bước 4: TCP + HTTPS</text><text x="710" y="78" font-size="10" text-anchor="middle" fill="#d1fae5">Bắt tay 3 bước &amp; Tải Web</text>
      </svg>
    `,
    photos: [
    {
        "url":  "images/server_rack.jpg",
        "desc_vi":  "Tại Tầng 7 (Application Layer), các máy chủ trong trung tâm dữ liệu cung cấp dịch vụ trực tiếp cho phần mềm người dùng: DNS dịch tên miền ra IP, DHCP cấp IP tự động, và Web/Mail Server phục vụ dữ liệu.",
        "desc_en":  "Enterprise servers running Layer 7 daemons that respond to client requests for name resolution, IP leasing, and web content.",
        "title_en":  "Data Center Application Servers (DNS, DHCP, Web, Email)",
        "title_vi":  "Máy chủ Dịch vụ Mạng: Web Server (HTTP/HTTPS), DNS Server \u0026 DHCP Server"
    },
    {
        "url":  "images/wifi_ap.jpg",
        "desc_vi":  "Ngay giây phút điện thoại của bạn kết nối vào bộ phát Wi-Fi, nó tự động phát bản tin DHCP Discover để xin địa chỉ IP, Subnet Mask, Default Gateway và DNS Server mà bạn không cần nhập tay.",
        "desc_en":  "As soon as a smartphone associates with a Wi-Fi AP, it broadcasts a DHCP Discover message to obtain its IP configuration automatically.",
        "title_en":  "Wireless Clients Automatically Requesting IP via DHCP (DORA)",
        "title_vi":  "Thiết bị di động vừa bắt sóng Wi-Fi lập tức chạy 4 bước DHCP (DORA)"
    }
]
  },

  16: {
    svg: `
      <svg viewBox="0 0 820 225" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="820" height="225" rx="8" fill="#0f172a"/>
        <text x="20" y="28" font-size="14" font-weight="bold" fill="#38bdf8">TẠI SAO PHẢI TẮT TELNET (PORT 23) VÀ BẬT MÃ HÓA SSH (PORT 22)?</text>

        <!-- Telnet -->
        <rect x="20" y="45" width="380" height="162" rx="8" fill="#450a0a" stroke="#ef4444" stroke-width="1.5"/>
        <text x="35" y="70" font-size="13" font-weight="bold" fill="#fca5a5">❌ TELNET (TCP Port 23 — NGUY HIỂM)</text>
        <text x="35" y="95" font-size="11.5" fill="#fecaca">• Truyền toàn bộ Username &amp; Password dạng CHỮ RÕ (Plaintext)</text>
        <text x="35" y="118" font-size="11.5" fill="#fecaca">• Hacker mở phần mềm Wireshark bắt gói tin sẽ đọc được ngay:</text>
        <text x="35" y="142" font-size="12" font-family="monospace" font-weight="bold" fill="#fde047">  User: admin  |  Password: Cisco123!</text>
        <text x="35" y="172" font-size="11.5" fill="#fca5a5">• Phải khóa ngay trên cổng VTY bằng: transport input ssh</text>

        <!-- SSH -->
        <rect x="420" y="45" width="380" height="162" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
        <text x="435" y="70" font-size="13" font-weight="bold" fill="#6ee7b7">✅ SECURE SHELL - SSH v2 (TCP Port 22 — AN TOÀN)</text>
        <text x="435" y="95" font-size="11.5" fill="#d1fae5">• Mã hóa toàn bộ phiên làm việc bằng khóa RSA (1024/2048-bit)</text>
        <text x="435" y="118" font-size="11.5" fill="#d1fae5">• 5 Bước cấu hình SSH bắt buộc trên Router/Switch:</text>
        <text x="435" y="140" font-size="11" font-family="monospace" fill="#a7f3d0">  1. hostname R1          2. ip domain-name cisco.com</text>
        <text x="435" y="160" font-size="11" font-family="monospace" fill="#a7f3d0">  3. crypto key gen rsa   4. username admin secret ...</text>
        <text x="435" y="180" font-size="11" font-family="monospace" fill="#a7f3d0">  5. line vty 0 4 -&gt; login local &amp; transport input ssh</text>
      </svg>
    `,
    hardwareSvg: `
      <svg viewBox="0 0 820 110" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="820" height="110" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
        <text x="20" y="24" font-size="12" font-weight="bold" fill="#0f172a">MÔ HÌNH PHÒNG THỦ NHIỀU LỚP TRONG DOANH NGHIỆP (DEFENSE-IN-DEPTH ARCHITECTURE)</text>
        <rect x="20" y="38" width="140" height="55" rx="6" fill="#fee2e2" stroke="#ef4444"/><text x="90" y="62" font-size="11" font-weight="bold" text-anchor="middle" fill="#991b1b">☁️ Internet / WAN</text><text x="90" y="80" font-size="10" text-anchor="middle" fill="#b91c1c">Mạng không tin cậy</text>
        <rect x="180" y="38" width="145" height="55" rx="6" fill="#ffedd5" stroke="#ea580c"/><text x="252" y="62" font-size="11" font-weight="bold" text-anchor="middle" fill="#9a3412">🔥 Firewall ASA/NGFW</text><text x="252" y="80" font-size="10" text-anchor="middle" fill="#c2410c">Lọc gói tin Stateful</text>
        <rect x="345" y="38" width="145" height="55" rx="6" fill="#fef3c7" stroke="#d97706"/><text x="417" y="62" font-size="11" font-weight="bold" text-anchor="middle" fill="#92400e">🛡️ IPS + ESA/WSA</text><text x="417" y="80" font-size="10" text-anchor="middle" fill="#b45309">Chặn mã độc &amp; Phishing</text>
        <rect x="510" y="38" width="140" height="55" rx="6" fill="#dbeafe" stroke="#2563eb"/><text x="580" y="62" font-size="11" font-weight="bold" text-anchor="middle" fill="#1e3a8a">🔑 AAA Server</text><text x="580" y="80" font-size="10" text-anchor="middle" fill="#1d4ed8">RADIUS / TACACS+</text>
        <rect x="670" y="38" width="130" height="55" rx="6" fill="#dcfce7" stroke="#16a34a"/><text x="735" y="62" font-size="11" font-weight="bold" text-anchor="middle" fill="#14532d">🔀 Switch L2</text><text x="735" y="80" font-size="10" text-anchor="middle" fill="#15803d">Port-Sec + DAI</text>
      </svg>
    `,
    photos: [
    {
        "url":  "images/firewall_asa.jpg",
        "desc_vi":  "Thiết bị bảo mật đặt ở biên mạng doanh nghiệp (giữa Router Internet và mạng nội bộ). Tường lửa kiểm tra trạng thái từng phiên kết nối (Stateful Inspection), chặn hacker từ ngoài Internet xâm nhập vào LAN và thiết lập đường hầm mã hóa VPN.",
        "desc_en":  "Dedicated perimeter security appliance providing stateful packet inspection, VPN termination, and intrusion prevention.",
        "title_en":  "Cisco ASA 5500 Hardware Security Firewall",
        "title_vi":  "Thiết bị Tường lửa Phần cứng chuyên dụng Cisco ASA 5500 Series"
    },
    {
        "url":  "images/switch_cisco.jpg",
        "desc_vi":  "An ninh mạng không chỉ ở Tường lửa! Ngay trên Switch cắm máy tính nhân viên, kỹ sư phải bật Port Security để khóa số lượng địa chỉ MAC (chống người lạ cắm nhờ dây mạng) và bật DHCP Snooping chống giả mạo máy chủ cấp IP.",
        "desc_en":  "Securing internal LAN switch ports against rogue devices, MAC flooding, and rogue DHCP servers.",
        "title_en":  "Layer 2 Access Switch Hardening (Port Security \u0026 DHCP Snooping)",
        "title_vi":  "Bảo mật Tầng 2 ngay trên các cổng Switch (Port Security \u0026 DHCP Snooping)"
    }
]
  },

  17: {
    svg: `
      <svg viewBox="0 0 820 230" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="820" height="230" rx="8" fill="#f8fafc"/>
        <text x="20" y="28" font-size="14" font-weight="bold" fill="#0f172a">PHƯƠNG PHÁP BẮT BỆNH MẠNG "CHIA ĐỂ TRỊ" (DIVIDE-AND-CONQUER) TẠI TẦNG 3</text>

        <rect x="245" y="45" width="330" height="52" rx="8" fill="#0284c7"/>
        <text x="410" y="68" font-size="13" font-weight="bold" text-anchor="middle" fill="#fff">BƯỚC KHỞI ĐẦU: ĐỨNG Ở TẦNG 3 GÕ LỆNH PING</text>
        <text x="410" y="86" font-size="11" text-anchor="middle" fill="#e0f2fe">C:\\&gt; ping 8.8.8.8 (hoặc ping IP máy chủ đích)</text>

        <!-- Left Branch: Ping Failed -->
        <rect x="20" y="122" width="375" height="92" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5"/>
        <text x="35" y="145" font-size="12.5" font-weight="bold" fill="#b91c1c">❌ NẾU PING IP THẤT BẠI -&gt; Kiểm tra Tầng 1 - 2 - 3:</text>
        <text x="35" y="166" font-size="11.5" fill="#7f1d1d">1. Tầng 1: Tuột dây cáp? Cổng Router quên 'no shutdown'?</text>
        <text x="35" y="185" font-size="11.5" fill="#7f1d1d">2. Tầng 2: Sai VLAN? Lệch Duplex (Full vs Half)?</text>
        <text x="35" y="204" font-size="11.5" fill="#7f1d1d">3. Tầng 3: PC đặt sai Default Gateway? Router thiếu Route?</text>

        <!-- Right Branch: Ping Succeeded -->
        <rect x="425" y="122" width="375" height="92" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
        <text x="440" y="145" font-size="12.5" font-weight="bold" fill="#15803d">✅ NẾU PING IP THÀNH CÔNG -&gt; Tầng 1-2-3 Tốt 100%!</text>
        <text x="440" y="166" font-size="11.5" fill="#14532d">• Kiểm tra lên Tầng 4 - 7 (Application / Transport):</text>
        <text x="440" y="185" font-size="11.5" fill="#14532d">• Ping được 8.8.8.8 mà không vào được web google.com?</text>
        <text x="440" y="204" font-size="11.5" font-weight="bold" fill="#15803d">  ---&gt; 100% lỗi thiếu hoặc sai địa chỉ DNS Server!</text>

        <line x1="330" y1="97" x2="205" y2="122" stroke="#ef4444" stroke-width="2.5"/>
        <line x1="490" y1="97" x2="615" y2="122" stroke="#16a34a" stroke-width="2.5"/>
      </svg>
    `,
    hardwareSvg: `
      <svg viewBox="0 0 820 115" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, monospace">
        <rect width="820" height="115" rx="8" fill="#0f172a"/>
        <text x="20" y="24" font-size="12" font-weight="bold" fill="#38bdf8">MÀN HÌNH LỆNH KHÁM PHÁ HÀNG XÓM: SWITCH# SHOW CDP NEIGHBORS</text>
        <rect x="20" y="34" width="780" height="68" rx="4" fill="#1e293b" stroke="#475569"/>
        <text x="35" y="52" font-size="11.5" font-weight="bold" fill="#fbbf24">Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID</text>
        <text x="35" y="70" font-size="11.5" fill="#4ade80">R1.cisco.com     Gig 0/1           154         R S I      ISR4321   Gig 0/0/0</text>
        <text x="35" y="88" font-size="11.5" fill="#38bdf8">SW-Tang2         Fas 0/24          142          S I       WS-C2960  Fas 0/24</text>
        <text x="35" y="101" font-size="10.5" fill="#cbd5e1">💡 Muốn xem cả Địa chỉ IP của R1 và SW-Tang2 -&gt; Gõ thêm: show cdp neighbors detail</text>
      </svg>
    `,
    photos: [
    {
        "url":  "images/server_rack.jpg",
        "desc_vi":  "Sự kết hợp đồng bộ của toàn bộ 17 Module CCNA 1: Từ cáp quang nhà mạng đi vào Router biên, qua Tường lửa ASA, xuống Switch phân phối và nối cáp đồng UTP tới từng máy trạm, máy chủ, điện thoại IP và bộ phát Wi-Fi.",
        "desc_en":  "Integrates all CCNA 1 components: ISP fiber uplink, edge router, ASA firewall, Catalyst switch, patch panels, and end devices.",
        "title_en":  "Complete Small Enterprise Network Rack Deployment",
        "title_vi":  "Mô hình Mạng Doanh Nghiệp Nhỏ Hoàn Chỉnh trong Tủ Rack"
    },
    {
        "url":  "images/router_cisco.jpg",
        "desc_vi":  "Thực hiện định tuyến giữa các VLAN/Subnet nội bộ và chạy dịch vụ NAT (Network Address Translation) để dịch các IP Private (192.168.x.x) thành IP Public khi đi ra ngoài Internet.",
        "desc_en":  "Routes traffic between internal subnets and translates private RFC 1918 addresses to public Internet IPs using NAT/PAT.",
        "title_en":  "Edge Router Performing Routing \u0026 NAT",
        "title_vi":  "Router Biên (Edge Router / Default Gateway)"
    },
    {
        "url":  "images/utp_cable.jpg",
        "desc_vi":  "Thực tế đi làm, hơn 50% sự cố mất mạng bắt nguồn từ Tầng 1 (Physical Layer): lỏng đầu hạt mạng RJ-45, đứt ngầm sợi đồng số 1/2/3/6, chuột cắn cáp hoặc cắm nhầm cổng trên Switch.",
        "desc_en":  "Over half of real-world network outages stem from Layer 1 physical issues such as loose RJ-45 plugs, damaged pairs, or wrong patch ports.",
        "title_en":  "Layer 1 Physical Cable \u0026 Connector Inspection",
        "title_vi":  "Kiểm tra Vật lý Cáp mạng \u0026 Đầu bấm RJ-45 khi Xử lý Sự cố (Troubleshooting)"
    }
]
  }
};


// Bổ sung Bộ Ảnh Chụp Cận Cảnh Cổng Cắm (Close-Up Ports) & Đa Góc Độ (Mặt Trước / Mặt Sau / Tủ Rack) Cho Toàn Bộ 17 Học Phần
const MODULE_EXTRA_PORT_PHOTOS = {
  1: [
    {
      url: "images/switch_ports_closeup.jpg",
      title_vi: "Cận cảnh Cổng RJ-45 & Đèn LED Trạng Thái trên Switch (Góc nhìn trực diện khi cắm dây)",
      title_en: "Close-Up of Switch RJ-45 Ports & Link/Activity LEDs",
      desc_vi: "Góc nhìn cận cảnh các lỗ cắm RJ-45 trên Switch: Mỗi cổng có 8 chân đồng tiếp xúc và 2 đèn LED báo trạng thái kết nối vật lý (Link - Xanh đứng im) và truyền dữ liệu (Activity - Nhấp nháy)."
    },
    {
      url: "images/patch_panel_ports.jpg",
      title_vi: "Thanh Đấu Nối Cáp Patch Panel 24-Port (Cầu nối giữa cáp âm tường và Switch trong tủ Rack)",
      title_en: "19-Inch 24-Port Keystone Patch Panel (Front & Rear Termination)",
      desc_vi: "Ngoài đời thực, dây mạng từ bàn làm việc nhân viên sẽ được bấm cố định vào mặt sau của thanh Patch Panel này, sau đó dùng dây nhảy ngắn cắm từ mặt trước Patch Panel xuống cổng Switch."
    }
  ],
  2: [
    {
      url: "images/router_rear_ports.jpg",
      title_vi: "Góc chụp Mặt Sau Thiết Bị Cisco (Nơi bố trí Cổng Console, Nguồn AC, AUX và các cổng WAN/LAN)",
      title_en: "Rear Panel View of Cisco Router Showing Console, AUX, and Interface Ports",
      desc_vi: "Khác với Switch có cổng ở mặt trước, các dòng Router thường bố trí toàn bộ cổng Console, cổng nguồn, công tắc bật/tắt và các khe cắm mở rộng ở mặt sau để tiện đi dây trong tủ Rack."
    },
    {
      url: "images/switch_ports_closeup.jpg",
      title_vi: "Cận cảnh Cổng FastEthernet / GigabitEthernet (Fa0/1, Gi0/1) khi cấu hình trên CLI",
      title_en: "Close-Up View of Physical Switch Ports Mapped to IOS CLI Interface Names",
      desc_vi: "Mỗi lỗ cắm vật lý có số thứ tự in ngay trên vỏ thép (1, 2, 3... 24) tương ứng chính xác với câu lệnh 'interface FastEthernet 0/1' đến '0/24' mà bạn gõ trong cửa sổ lệnh CLI."
    }
  ],
  3: [
    {
      url: "images/rj45_connector_pins.jpg",
      title_vi: "Cận cảnh Cấu tạo 8 Chân Đồng (8P8C) của Đầu cắm và Ổ cắm RJ-45 Chuẩn IEEE 802.3",
      title_en: "Close-Up of 8P8C / RJ-45 Male Plug Pins and Female Jack Contacts",
      desc_vi: "Hình ảnh phóng đại cho thấy quy chuẩn vật lý thuộc Tầng 1: kích thước cơ khí của lẫy gài và vị trí 8 chân đồng tiếp xúc từ Chân số 1 đến Chân số 8 theo tiêu chuẩn EIA/TIA."
    },
    {
      url: "images/fiber_lc_sc_ports.jpg",
      title_vi: "Cận cảnh Đầu nối Cáp Quang Chuẩn LC (Nhỏ) và SC (Vuông) khi đóng gói bit thành ánh sáng",
      title_en: "Close-Up Comparison of LC and SC Fiber-Optic Connectors",
      desc_vi: "Khi gói tin đi xuống Tầng Vật Lý trên đường cáp quang, các bit 0/1 được biến thành tia laser đi qua lõi sứ trắng siêu nhỏ (Ferrule) ở chính giữa đầu cắm LC/SC này."
    }
  ],
  4: [
    {
      url: "images/rj45_connector_pins.jpg",
      title_vi: "Góc chụp Cận cảnh 8 Chân Hạt Mạng RJ-45 (8P8C) — Nơi bấm 8 sợi cáp đồng T568A / T568B",
      title_en: "Close-Up of 8P8C RJ-45 Connector Pins & Female Socket",
      desc_vi: "Khi cầm hạt mạng RJ-45 lật mặt lá đồng lên trên (lẫy nhựa quay xuống dưới), chân bên trái ngoài cùng là Chân 1 (Trắng-Cam theo chuẩn B) và chân bên phải ngoài cùng là Chân 8 (Nâu)."
    },
    {
      url: "images/fiber_lc_sc_ports.jpg",
      title_vi: "Góc chụp Cận cảnh 2 Loại Đầu Cắm Quang Phổ Biến Nhất: Đầu LC (Trái) & Đầu SC (Phải)",
      title_en: "Side-by-Side Close-Up of LC Duplex and SC Fiber Connectors",
      desc_vi: "Đầu LC có kích thước nhỏ gọn bằng một nửa đầu SC, chuyên dùng để cắm vào lỗ Module quang SFP/SFP+ trên Switch/Router Cisco; còn đầu SC vuông lớn thường cắm vào hộp phối quang ODF."
    },
    {
      url: "images/patch_panel_ports.jpg",
      title_vi: "Thanh Patch Panel 24 Cổng Chuẩn Tủ Rack 19-inch (Đấu nối cáp đồng Cat6 thực tế)",
      title_en: "24-Port Modular RJ-45 Patch Panel for Structured Cabling",
      desc_vi: "Mỗi ổ cắm (Keystone Jack) trên thanh Patch Panel có đánh mã màu chuẩn T568A và T568B ở mặt sau để kỹ sư dùng dao nhấn (Punch-down tool) cố định từng sợi dây đồng."
    }
  ],
  5: [
    {
      url: "images/switch_ports_closeup.jpg",
      title_vi: "Cận cảnh các Cổng Switch nơi đọc hiểu chuỗi Bit Nhị phân 0/1 và Địa chỉ MAC Hexadecimal",
      title_en: "Switch RJ-45 Ports Processing Binary Frames and Hexadecimal MAC Addresses",
      desc_vi: "Mọi con số Thập phân hay Thập lục phân mà chúng ta cấu hình đều được vi mạch phía sau các cổng RJ-45 này thu phát dưới dạng chuỗi xung điện Nhị phân (0 và 1)."
    }
  ],
  6: [
    {
      url: "images/poe_switch_ports.jpg",
      title_vi: "Góc nhìn Bên Trong Bo Mạch & Chip Xử Lý Tầng 2 (MAC/PHY) Phía Sau Các Cổng Switch Cisco 2960",
      title_en: "Internal View of Broadcom Layer 2 PHY/Switch ASIC Inside a Cisco Catalyst 2960-S",
      desc_vi: "Ảnh chụp mở nắp vỏ một chiếc Switch Cisco Catalyst 2960-S thực tế: Ngay phía sau dãy cổng RJ-45 mặt trước là con chip phần cứng kiểm tra lỗi FCS/CRC và đọc địa chỉ MAC ở Tầng 2."
    },
    {
      url: "images/router_rear_ports.jpg",
      title_vi: "Mặt Sau Router với các Cổng Giao Tiếp WAN/Serial và Ethernet (Đổi khung tin Layer 2 ở mỗi chặng)",
      title_en: "Router Rear Interfaces Separating Layer 2 Data Link Domains",
      desc_vi: "Mỗi cổng vật lý ở mặt sau chiếc Router này sử dụng một giao thức Tầng 2 riêng (Ethernet ở cổng LAN, PPP/HDLC ở cổng Serial WAN); khi gói tin đi qua Router, nhãn Layer 2 sẽ được bóc ra và đóng mới hoàn toàn."
    }
  ],
  7: [
    {
      url: "images/switch_ports_closeup.jpg",
      title_vi: "Cận cảnh Dãy Cổng Switch 24-Port: Mỗi cổng là 1 Miền Đụng Độ (Collision Domain) Riêng Biệt!",
      title_en: "Close-Up of Switch Ports — Each Port Forms an Independent Collision Domain",
      desc_vi: "Khi nhìn vào dãy cổng này, hãy nhớ: mỗi lỗ cắm có 1 cặp dây Gửi (TX) và 1 cặp dây Nhận (RX) độc lập, cho phép máy tính truyền và nhận cùng lúc (Full-Duplex) với 0% va chạm tín hiệu!"
    },
    {
      url: "images/poe_switch_ports.jpg",
      title_vi: "Bên trong Switch Cisco Catalyst: Chip ASIC & Bộ nhớ CAM Table xử lý hàng triệu khung tin/giây",
      title_en: "Cisco Catalyst Switch Internal ASIC & CAM Table Hardware",
      desc_vi: "Nhờ con chip phần cứng chuyên dụng này gắn trực tiếp vào các cổng mạng, Switch tra cứu địa chỉ MAC đích trong bảng CAM chỉ mất vài nano-giây mà không làm bận CPU chính."
    }
  ],
  8: [
    {
      url: "images/router_rear_ports.jpg",
      title_vi: "Cận cảnh Mặt Sau Router Cisco: Các cổng mạng nối các nhánh LAN và WAN khác nhau",
      title_en: "Close-Up of Cisco Router Rear Panel Interfaces (LAN, WAN, Console, AUX)",
      desc_vi: "Khi lắp đặt thực tế, kỹ sư cắm dây mạng từ Switch nội bộ vào cổng Ethernet (LAN) của Router, và cắm cáp từ nhà mạng ISP vào cổng WAN để định tuyến gói tin IP ra ngoài Internet."
    },
    {
      url: "images/fiber_lc_sc_ports.jpg",
      title_vi: "Đầu cắm Cáp Quang LC/SC dùng trên các tuyến đường trục (Backbone) nối giữa các Router",
      title_en: "LC and SC Fiber Connectors Used on High-Speed Router Trunks",
      desc_vi: "Các tuyến kết nối giữa các Router ở các tòa nhà hoặc trạm viễn thông luôn sử dụng đầu cắm quang LC/SC để truyền gói tin Tầng 3 đi xa hàng chục km."
    }
  ],
  9: [
    {
      url: "images/switch_ports_closeup.jpg",
      title_vi: "Cận cảnh Các Cổng Switch khi chuyển tiếp bản tin ARP Request (Broadcast ra tất cả các cổng)",
      title_en: "Switch Ports Flooding Broadcast ARP Requests (FF:FF:FF:FF:FF:FF)",
      desc_vi: "Khi một máy tính cắm ở cổng số 1 phát bản tin ARP Request tìm MAC, đèn LED của toàn bộ các cổng đang cắm máy khác trên cùng VLAN sẽ nhấp nháy vì Switch nhân bản gói Broadcast ra mọi cổng!"
    }
  ],
  10: [
    {
      url: "images/router_rear_ports.jpg",
      title_vi: "Giải Phẫu Mặt Sau Router Cisco Thực Tế: Vị trí Cổng Console, AUX, Ethernet & Serial WAN",
      title_en: "Detailed Rear View of a Cisco Router Showing Physical Ports and Connectors",
      desc_vi: "Hình ảnh thực tế giúp bạn hình dung ngay khi đứng sau tủ Rack: nơi cắm dây nguồn, cổng Console để cấu hình từ Laptop, và các cổng giao tiếp mạng vật lý mặc định đang ở trạng thái 'shutdown'."
    },
    {
      url: "images/fiber_lc_sc_ports.jpg",
      title_vi: "Cận cảnh Đầu cắm Quang LC Duplex (2 sợi Thu/Phát) cắm vào khe SFP trên Router",
      title_en: "LC Duplex Fiber Connectors for Router SFP Uplink Ports",
      desc_vi: "Trên Router Cisco ISR 4000 Series, cổng GigabitEthernet thường là cổng Combo (vừa có lỗ cắm đồng RJ-45, vừa có khe cắm quang SFP dùng đầu LC này)."
    }
  ],
  11: [
    {
      url: "images/patch_panel_ports.jpg",
      title_vi: "Quy hoạch các Cổng trên Thanh Patch Panel theo từng Mạng Con (Subnet / Phòng Ban)",
      title_en: "Patch Panel Ports Labeled and Grouped by Department IPv4 Subnets",
      desc_vi: "Khi đi làm thực tế, kỹ sư luôn dán nhãn đánh số trên mặt trước Patch Panel (ví dụ: Cổng 1-12 thuộc Subnet Phòng Kế Toán 192.168.10.0/26, Cổng 13-24 thuộc Phòng Kỹ Thuật)."
    },
    {
      url: "images/switch_ports_closeup.jpg",
      title_vi: "Chia nhóm các Cổng Vật Lý trên Switch tương ứng với từng VLAN và Subnet",
      title_en: "Grouping Physical Switch RJ-45 Ports into Separate VLANs and Subnets",
      desc_vi: "Mỗi dải mạng con (Subnet) mà bạn tính toán bằng VLSM sẽ được ánh xạ vào một VLAN và gán xuống một nhóm cổng RJ-45 cụ thể trên mặt trước chiếc Switch này."
    }
  ],
  12: [
    {
      url: "images/router_rear_ports.jpg",
      title_vi: "Mặt sau Router chạy song song cả IPv4 và IPv6 (Dual-Stack) trên cùng một cổng vật lý",
      title_en: "Router Rear Interfaces Configured with Dual-Stack IPv4 and IPv6 Addresses",
      desc_vi: "Bạn không cần mua cáp mạng mới hay Router mới để chạy IPv6! Trên cùng một cổng vật lý ở mặt sau Router này, bạn gán đồng thời cả lệnh 'ip address' (IPv4) và 'ipv6 address' (IPv6)."
    }
  ],
  13: [
    {
      url: "images/switch_ports_closeup.jpg",
      title_vi: "Quan sát Đèn LED Cổng Mạng đầu tiên khi Lệnh Ping báo lỗi Request Timed Out",
      title_en: "Checking Physical Port Link LEDs First When ICMP Ping Fails",
      desc_vi: "Kinh nghiệm thực tế: Khi gõ lệnh ping không thông, việc đầu tiên là nhìn vào đèn LED ngay trên lỗ cắm RJ-45 này xem đèn có sáng xanh hay đã tắt ngúm do lỏng đầu cáp!"
    }
  ],
  14: [
    {
      url: "images/rack_rear_cabling.jpg",
      title_vi: "Góc nhìn Mặt Sau Hệ Thống Đấu Nối Tủ Rack Máy Chủ nơi tập trung hàng ngàn phiên TCP/UDP",
      title_en: "Rear Cabling View of High-Density Patch Panel in a Data Center Rack",
      desc_vi: "Góc nhìn phía sau hệ thống đấu nối cáp của trung tâm dữ liệu: hàng trăm sợi cáp đồng thời vận chuyển cả các luồng dữ liệu TCP (cần độ tin cậy tuyệt đối) và UDP (cần tốc độ thời gian thực)."
    }
  ],
  15: [
    {
      url: "images/patch_panel_ports.jpg",
      title_vi: "Đấu nối Máy chủ Web, DNS, DHCP và Máy trạm qua hệ thống Patch Panel chuẩn doanh nghiệp",
      title_en: "Connecting Application Servers and Workstations via Structured Patch Panels",
      desc_vi: "Toàn bộ lưu lượng Tầng 7 (HTTP, HTTPS, DNS, DHCP, Email, SMB) của nhân viên đều đi từ ổ cắm tường về thanh Patch Panel này trước khi vào Switch và tới Server."
    }
  ],
  16: [
    {
      url: "images/switch_ports_closeup.jpg",
      title_vi: "Cận cảnh các Cổng Switch cần bật Bảo mật Port Security & Tắt các cổng không sử dụng",
      title_en: "Unused Switch RJ-45 Ports Must Be Administratively Shut Down for Security",
      desc_vi: "Nguyên tắc bảo mật thực tế bắt buộc: Tất cả những lỗ cắm RJ-45 đang để trống (không cắm dây) trên mặt trước Switch phải được gõ lệnh 'shutdown' và đẩy vào một VLAN rác để kẻ gian cắm dây vào cũng không có mạng!"
    }
  ],
  17: [
    {
      url: "images/rack_rear_cabling.jpg",
      title_vi: "Góc nhìn Thực tế Hệ thống Đi Dây & Đấu Nối Cổng Phía Sau Tủ Rack Khi Xây Dựng Mạng",
      title_en: "Real-World Structured Cabling & Port Termination Inside an Enterprise Rack",
      desc_vi: "Khi thiết kế và lắp đặt mạng thực tế, việc bó dây gọn gàng và dán nhãn (Labeling) ở cả 2 đầu mỗi sợi cáp quan trọng không kém việc gõ lệnh cấu hình trên CLI!"
    },
    {
      url: "images/switch_ports_closeup.jpg",
      title_vi: "Cận cảnh Cổng Access & Cổng Uplink trên Switch khi nghiệm thu Hệ thống Mạng Nhỏ",
      title_en: "Close-Up Inspection of Switch Access & Trunk Ports During Network Commissioning",
      desc_vi: "Bước kiểm tra vật lý cuối cùng trước khi bàn giao mạng: Đảm bảo mọi đầu hạt mạng RJ-45 đã gài chặt lẫy khóa và đèn LED tất cả các cổng đang hoạt động đều sáng xanh ổn định."
    }
  ]
};

// Tự động gộp bộ ảnh Cận cảnh Cổng Port & Đa góc độ vào từng Module
Object.keys(MODULE_EXTRA_PORT_PHOTOS).forEach((idStr) => {
  const id = Number(idStr);
  if (MODULE_VISUALS[id] && Array.isArray(MODULE_VISUALS[id].photos)) {
    MODULE_VISUALS[id].photos = MODULE_VISUALS[id].photos.concat(MODULE_EXTRA_PORT_PHOTOS[id]);
  }
});

// Hàm vẽ Sơ Đồ Giải Phẫu Đa Góc Độ (Mặt Trước • Mặt Sau • Cận Cảnh Chân Cổng Port & Cách Cắm Cáp Thực Tế) tươi sáng, dễ nhìn cho từng Học Phần
function renderMultiAnglePortAnatomySvg(modId) {
  const portGuides = {
    1: {
      device: "Switch Cisco Catalyst 2960 & Thanh Đấu Nối Patch Panel",
      frontTitle: "GÓC 1: MẶT TRƯỚC (FRONT PANEL) — 24 Cổng Đồng RJ-45 + 2 Cổng Uplink Gigabit",
      rearTitle: "GÓC 2: MẶT SAU (REAR PANEL) — Cổng Console RJ-45, Quạt Tản Nhiệt & Nguồn AC",
      pinTitle: "GÓC 3: CẬN CẢNH LỖ CẮM & CÁCH ĐẤU DÂY THỰC TẾ",
      pinDesc1: "• Cổng 1 → 24 (Access): Cắm cáp thẳng Cat6 nối ra PC, Laptop, Máy in, IP Phone.",
      pinDesc2: "• Cổng Gi0/1 → Gi0/2 (Uplink): Cắm cáp nối lên Router hoặc Switch trung tâm.",
      pinDesc3: "• Đèn LED: Sáng Xanh = Cáp tốt (Up) | Nhấp nháy Xanh = Đang truyền dữ liệu | Cam = Đang chờ STP hoặc bị khóa."
    },
    2: {
      device: "Cổng Console Quản Trị Trên Switch & Router Cisco (Mặt Trước vs. Mặt Sau)",
      frontTitle: "GÓC 1: CỔNG CONSOLE TRÊN LAPTOP KỸ SƯ (USB-A / USB-C → COM Port)",
      rearTitle: "GÓC 2: MẶT SAU SWITCH / ROUTER — Cổng Console RJ-45 (Viền Xanh Ngọc) & USB Mini-B",
      pinTitle: "GÓC 3: CÁCH CẮM CÁP CONSOLE KHI MỚI KHUI THÙNG THIẾT BỊ",
      pinDesc1: "• Bước 1: Cắm đầu RJ-45 của cáp Console màu xanh da trời vào lỗ có chữ CONSOLE (viền xanh ngọc) ở mặt sau Switch.",
      pinDesc2: "• Bước 2: Đầu còn lại cắm qua bộ chuyển USB-to-Serial vào cổng USB của Laptop.",
      pinDesc3: "• Bước 3: Mở Device Manager xem số cổng COM (VD: COM3) → Mở PuTTY chọn Serial, tốc độ 9600 bps, 8-N-1."
    },
    3: {
      device: "Giải Phẫu Cổng Vật Lý & Đóng Gói Khung Tin Qua Từng Thiết Bị (PC → Switch → Router)",
      frontTitle: "GÓC 1: CỔNG CARD MẠNG PC (NIC RJ-45) — Nơi sinh ra Gói tin IP & Khung Ethernet",
      rearTitle: "GÓC 2: CỔNG SWITCH (Chỉ đọc MAC Tầng 2) vs. CỔNG ROUTER (Đọc IP Tầng 3)",
      pinTitle: "GÓC 3: QUAN SÁT ĐÈN BÁO TRÊN CỔNG KHI GÓI TIN ĐI QUA",
      pinDesc1: "• Trên cổng NIC máy tính: Có 2 đèn LED nhỏ (1 đèn Link báo có điện cáp mạng, 1 đèn Activity chớp vàng khi truyền dữ liệu).",
      pinDesc2: "• Trên cổng Switch: Khi nhận khung tin, Switch giữ nguyên gói tin bên trong, chỉ tra bảng MAC để đẩy ra cổng đích.",
      pinDesc3: "• Trên cổng Router: Bóc bỏ vỏ khung Ethernet cũ, tra bảng định tuyến IP rồi đóng vỏ khung mới ở cổng đi ra."
    },
    4: {
      device: "Cận Cảnh Chân Hạt Mạng RJ-45 (Chân 1→8), Khe Cắm Quang SFP & Đầu Quang LC/SC",
      frontTitle: "GÓC 1: THỨ TỰ 8 CHÂN ĐỒNG HẠT MẠNG RJ-45 (Chuẩn bấm T568B phổ biến nhất)",
      rearTitle: "GÓC 2: KHE MODULE QUANG SFP/SFP+ & CẶP ĐẦU CẮM QUANG LC DUPLEX (TX / RX)",
      pinTitle: "GÓC 3: HƯỚNG DẪN BẤM CÁP & CẮM MODULE QUANG THỰC TẾ",
      pinDesc1: "• Chuẩn T568B (Chân 1 → 8): 1.Trắng-Cam | 2.Cam | 3.Trắng-XanhLá | 4.XanhDương | 5.Trắng-XanhDương | 6.XanhLá | 7.Trắng-Nâu | 8.Nâu.",
      pinDesc2: "• Cáp 100Mbps dùng 4 sợi (Chân 1-2 phát TX, Chân 3-6 thu RX). Cáp Gigabit 1Gbps dùng cả 8 sợi đồng!",
      pinDesc3: "• Khi cắm cáp quang: Trượt cục SFP vào khe kim loại trên Switch trước, rồi cắm 2 đầu quang LC (1 sợi Phát TX, 1 sợi Thu RX) vào."
    }
  };

  const info = portGuides[modId] || {
    device: `Hệ Thống Cổng Đấu Nối Vật Lý Trên Thiết Bị Mạng Thực Tế (Học Phần ${modId})`,
    frontTitle: "GÓC 1: MẶT TRƯỚC THIẾT BỊ (FRONT PANEL) — Dãy Cổng RJ-45 Access, Đèn LED & Khe Quang SFP",
    rearTitle: "GÓC 2: MẶT SAU THIẾT BỊ (REAR PANEL) — Cổng Console (Viền Xanh), Cổng WAN/LAN & Nguồn Điện",
    pinTitle: "GÓC 3: HƯỚNG DẪN NHẬN DIỆN CỔNG & ĐẤU NỐI CÁP KHI ĐI LÀM THỰC TẾ",
    pinDesc1: "• Cổng Access RJ-45 (Fa0/1..24): Dùng cáp thẳng nối qua Patch Panel ra máy trạm PC, IP Phone, Camera, Wi-Fi AP.",
    pinDesc2: "• Cổng Uplink / Trunk (Gi0/1..2 hoặc SFP Quang): Cấu hình 802.1Q Trunk nối giữa các Switch hoặc nối lên Router.",
    pinDesc3: "• Cổng Console (Viền xanh ngọc / USB Mini-B): Chỉ dùng để cắm cáp cấu hình từ Laptop kỹ sư, tuyệt đối không cắm dây mạng LAN vào đây!"
  };

  return `
    <svg viewBox="0 0 860 285" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
      <rect width="860" height="285" rx="10" fill="#f8fafc" stroke="#bae6fd" stroke-width="2"/>
      <text x="20" y="25" font-size="13" font-weight="bold" fill="#0369a1">🔍 SƠ ĐỒ GIẢI PHẪU ĐA GÓC ĐỘ &amp; CẬN CẢNH CỔNG PORT: ${info.device.toUpperCase()}</text>

      <!-- Angle 1: Front Panel Close-up -->
      <rect x="20" y="38" width="405" height="118" rx="8" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
      <text x="32" y="57" font-size="11" font-weight="bold" fill="#0369a1">${info.frontTitle}</text>
      <!-- Simulated Switch Front Ports -->
      <rect x="32" y="66" width="380" height="58" rx="6" fill="#1e293b" stroke="#475569"/>
      <!-- 8 detailed RJ-45 ports with LEDs -->
      <g transform="translate(42, 74)">
        <rect x="0" y="0" width="30" height="24" rx="2" fill="#0f172a" stroke="#94a3b8"/><circle cx="7" cy="5" r="2.5" fill="#22c55e"/><circle cx="23" cy="5" r="2.5" fill="#22c55e"/><text x="15" y="36" font-size="8.5" text-anchor="middle" fill="#cbd5e1">Port 1</text>
        <rect x="36" y="0" width="30" height="24" rx="2" fill="#0f172a" stroke="#94a3b8"/><circle cx="43" cy="5" r="2.5" fill="#22c55e"/><circle cx="59" cy="5" r="2.5" fill="#22c55e"/><text x="51" y="36" font-size="8.5" text-anchor="middle" fill="#cbd5e1">Port 2</text>
        <rect x="72" y="0" width="30" height="24" rx="2" fill="#0f172a" stroke="#94a3b8"/><circle cx="79" cy="5" r="2.5" fill="#f59e0b"/><circle cx="95" cy="5" r="2.5" fill="#64748b"/><text x="87" y="36" font-size="8.5" text-anchor="middle" fill="#fde047">STP</text>
        <rect x="108" y="0" width="30" height="24" rx="2" fill="#0f172a" stroke="#94a3b8"/><circle cx="115" cy="5" r="2.5" fill="#22c55e"/><circle cx="131" cy="5" r="2.5" fill="#22c55e"/><text x="123" y="36" font-size="8.5" text-anchor="middle" fill="#cbd5e1">Port 4</text>
        <rect x="144" y="0" width="30" height="24" rx="2" fill="#0f172a" stroke="#94a3b8"/><circle cx="151" cy="5" r="2.5" fill="#64748b"/><circle cx="167" cy="5" r="2.5" fill="#64748b"/><text x="159" y="36" font-size="8.5" text-anchor="middle" fill="#94a3b8">Trống</text>
        <!-- SFP Fiber Uplinks -->
        <rect x="195" y="0" width="76" height="26" rx="3" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="233" y="16" font-size="9" font-weight="bold" text-anchor="middle" fill="#7dd3fc">SFP+ Gi0/1</text>
        <text x="233" y="38" font-size="8.5" text-anchor="middle" fill="#38bdf8">Cổng Quang LC</text>
        <rect x="280" y="0" width="76" height="26" rx="3" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="318" y="16" font-size="9" font-weight="bold" text-anchor="middle" fill="#7dd3fc">SFP+ Gi0/2</text>
        <text x="318" y="38" font-size="8.5" text-anchor="middle" fill="#38bdf8">Uplink Trunk</text>
      </g>
      <text x="32" y="143" font-size="10" fill="#334155">🟢 Đèn Xanh: Hoạt động tốt  |  🟠 Đèn Cam: Đang kiểm tra STP / Blocked  |  ⚫ Tắt: Chưa cắm / Shutdown</text>

      <!-- Angle 2: Rear Panel & Close-Up Pins -->
      <rect x="438" y="38" width="402" height="118" rx="8" fill="#ffffff" stroke="#0d9488" stroke-width="1.5"/>
      <text x="450" y="57" font-size="11" font-weight="bold" fill="#0f766e">${info.rearTitle}</text>
      <rect x="450" y="66" width="378" height="58" rx="6" fill="#0f172a" stroke="#475569"/>
      <g transform="translate(460, 73)">
        <rect x="0" y="0" width="72" height="34" rx="3" fill="#1e293b" stroke="#94a3b8"/>
        <text x="36" y="15" font-size="8.5" font-weight="bold" text-anchor="middle" fill="#f8fafc">AC POWER</text>
        <text x="36" y="27" font-size="8" text-anchor="middle" fill="#cbd5e1">100-240V~</text>

        <rect x="82" y="0" width="90" height="34" rx="3" fill="#083344" stroke="#22d3ee" stroke-width="1.5"/>
        <text x="127" y="15" font-size="8.5" font-weight="bold" text-anchor="middle" fill="#67e8f9">CONSOLE PORT</text>
        <text x="127" y="27" font-size="8" text-anchor="middle" fill="#cffafe">RJ-45 / USB-C</text>

        <rect x="182" y="0" width="85" height="34" rx="3" fill="#14532d" stroke="#4ade80" stroke-width="1.5"/>
        <text x="224" y="15" font-size="8.5" font-weight="bold" text-anchor="middle" fill="#86efac">WAN Gi0/0/0</text>
        <text x="224" y="27" font-size="8" text-anchor="middle" fill="#dcfce7">Nối Modem ISP</text>

        <rect x="276" y="0" width="82" height="34" rx="3" fill="#3b0764" stroke="#c084fc" stroke-width="1.5"/>
        <text x="317" y="15" font-size="8.5" font-weight="bold" text-anchor="middle" fill="#e9d5ff">LAN Gi0/0/1</text>
        <text x="317" y="27" font-size="8" text-anchor="middle" fill="#f3e8ff">Default GW</text>
      </g>
      <text x="450" y="143" font-size="10" fill="#334155">💡 Mẹo phân biệt: Cổng Console luôn có viền màu Xanh Ngọc Lam, cổng LAN/WAN có viền Vàng!</text>

      <!-- Angle 3: Practical Installation Guide -->
      <rect x="20" y="168" width="820" height="102" rx="8" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5"/>
      <text x="35" y="190" font-size="11.5" font-weight="bold" fill="#166534">🛠️ ${info.pinTitle}</text>
      <text x="35" y="212" font-size="11" fill="#14532d">${info.pinDesc1}</text>
      <text x="35" y="234" font-size="11" fill="#14532d">${info.pinDesc2}</text>
      <text x="35" y="256" font-size="11" font-weight="bold" fill="#0369a1">${info.pinDesc3}</text>
    </svg>
  `;
}


// Bổ sung Bộ Ảnh Thiết Bị Mạng Đa Hãng (Switch HPE Aruba Web GUI, Router MikroTik) & Thiết Bị Ngoại Vi Văn Phòng Thực Tế (Máy in màn hình LCD, Máy Scan, Máy in Bill POS, Camera PoE) vào các Học phần
const MODULE_DIVERSE_ENTERPRISE_PHOTOS = {
  1: [
    {
      url: "images/aruba_switch.jpg",
      title_vi: "Switch Doanh Nghiệp HPE Aruba (Quản trị bằng Giao diện Web GUI trực quan & Cloud Portal)",
      title_en: "HPE Aruba Enterprise Switch (Managed via Web GUI, Aruba Central Cloud & CLI)",
      desc_vi: "Không chỉ có Switch Cisco gõ lệnh CLI! Trong thực tế các công ty, tòa nhà, khách sạn sử dụng rất nhiều Switch HPE Aruba quản lý trực tiếp trên trình duyệt Web (HTTPS GUI) với giao diện chọn VLAN Untagged/Tagged cực kỳ trực quan."
    },
    {
      url: "images/mfp_printer_lcd.jpg",
      title_vi: "Máy In Đa Năng / Máy Photocopy Có Màn Hình Cảm Ứng Hiển Thị (Network MFP Printer)",
      title_en: "Touch-Screen Multifunction Network Printer & Copier (Static IP, Port 9100, SMB Scan)",
      desc_vi: "Thiết bị đầu cuối (End Device) quan trọng bậc nhất văn phòng: Kỹ sư bấm trực tiếp trên màn hình cảm ứng LCD để đặt IP Tĩnh (Static IP) và cấu hình in mạng qua cổng TCP 9100."
    },
    {
      url: "images/office_scanner.jpg",
      title_vi: "Máy Scan Tài Liệu Qua Mạng LAN (Scan-to-Folder SMB Port 445 & Scan-to-Email SMTP)",
      title_en: "Network Document Scanner (Scan-to-SMB Shared Folder & Scan-to-Email)",
      desc_vi: "Kết nối vào mạng LAN để nhân viên quét hợp đồng, hóa đơn thành file PDF và tự động đẩy thẳng về thư mục chia sẻ (Shared Folder) trên máy tính cá nhân của từng người."
    },
    {
      url: "images/pos_receipt_printer.jpg",
      title_vi: "Máy In Hóa Đơn / Máy In Bill Nhiệt Mạng LAN Tại Quầy Thu Ngân & Nhà Bếp (POS Printer)",
      title_en: "Ethernet Thermal POS Receipt Printer (TCP Port 9100 RAW Socket)",
      desc_vi: "Thiết bị đầu cuối bắt buộc trong siêu thị, nhà hàng, quán cafe: Cắm dây mạng RJ-45 đặt IP Tĩnh (Port 9100). Muốn xem IP hiện tại: Tắt nguồn, giữ nút FEED rồi bật nguồn để máy tự in phiếu Self-Test!"
    },
    {
      url: "images/cctv_ip_camera.jpg",
      title_vi: "Camera An Ninh IP Cấp Nguồn Qua Cáp Mạng (PoE CCTV Camera — RTSP Port 554 & ONVIF)",
      title_en: "PoE IP Surveillance Camera (802.3af/at Power over Ethernet & RTSP Streaming)",
      desc_vi: "Nhận cả điện năng lẫn truyền hình ảnh qua duy nhất 1 sợi cáp mạng Cat6 cắm vào Switch PoE, quy hoạch vào một VLAN Camera riêng biệt."
    }
  ],
  2: [
    {
      url: "images/aruba_switch.jpg",
      title_vi: "Quản trị Switch qua Giao diện Web GUI (HPE Aruba / Cisco CBS / TP-Link Omada) vs. Dòng lệnh CLI",
      title_en: "Web GUI Switch Management (HPE Aruba / Smart Managed Switches) vs. Console CLI",
      desc_vi: "Ngoài cách cắm dây Console gõ lệnh CLI, các dòng Switch hiện đại như HPE Aruba cho phép mở trình duyệt Web (https://IP-Switch) để xem sơ đồ cổng màu xanh/cam, tạo VLAN và bật chống Loop bằng chuột!"
    },
    {
      url: "images/mfp_printer_lcd.jpg",
      title_vi: "Cấu hình IP Tĩnh trực tiếp trên Màn hình cảm ứng của Máy in / Máy Photocopy văn phòng",
      title_en: "Configuring Static IPv4 Address on an Office MFP Touch Screen",
      desc_vi: "Khi đi làm, đối với máy in có màn hình hiển thị, bạn bấm vào Settings -> Network -> TCP/IP -> IPv4 trên màn hình cảm ứng để khóa IP Tĩnh (tránh lỗi nhảy IP DHCP làm máy in bị Offline)."
    }
  ],
  7: [
    {
      url: "images/aruba_switch.jpg",
      title_vi: "Switch HPE Aruba: Cách gọi tên VLAN 'Untagged (U) / Tagged (T)' và chữ 'Trunk (LACP)' khác Cisco",
      title_en: "HPE Aruba Switch Terminology: Untagged (Access) vs. Tagged (802.1Q) & Trunk (LACP)",
      desc_vi: "Lưu ý sống còn khi đi làm: Trên giao diện Web của Switch Aruba/HP, cổng cắm PC gọi là Untagged (U), cổng chở nhiều VLAN gọi là Tagged (T), còn chữ 'Trunk (Trk1)' lại có nghĩa là bó cáp LACP!"
    }
  ],
  10: [
    {
      url: "images/mikrotik_router.jpg",
      title_vi: "Router Doanh Nghiệp Đa Cổng WAN/LAN (MikroTik RouterBOARD / DrayTek Vigor / FortiGate)",
      title_en: "Multi-WAN Enterprise Router (MikroTik WinBox/WebFig, PPPoE Client & Load Balancing)",
      desc_vi: "Trong thực tế tại Việt Nam, kỹ sư thường chuyển Modem nhà mạng sang Bridge Mode rồi dùng Router MikroTik / DrayTek / FortiGate quay số PPPoE và gộp băng thông 2-3 đường truyền Internet (Multi-WAN Load Balancing)."
    }
  ],
  15: [
    {
      url: "images/office_scanner.jpg",
      title_vi: "Ứng dụng Giao thức SMB (Port 445) & SMTP (Port 587) trên Máy Scan Mạng Văn Phòng",
      title_en: "Network Scanner Using Layer 7 SMB (Port 445) and SMTP (Port 587) Protocols",
      desc_vi: "Ví dụ thực tế nhất của Tầng Ứng Dụng (Layer 7): Máy Scan dùng giao thức SMB để đẩy file PDF thẳng vào thư mục Shared Folder trên máy tính nhân viên, hoặc dùng SMTP để gửi file Scan vào Email."
    },
    {
      url: "images/pos_receipt_printer.jpg",
      title_vi: "Ứng dụng Giao thức In Mạng RAW Socket (TCP Port 9100) trên Máy In Bill Thu Ngân",
      title_en: "POS Receipt Printer Listening on Layer 4/7 TCP Port 9100",
      desc_vi: "Phần mềm bán hàng trên máy thu ngân hoặc điện thoại nhân viên order kết nối tới địa chỉ IP Tĩnh của máy in bill qua cổng TCP 9100 để in hóa đơn tức thì."
    }
  ],
  17: [
    {
      url: "images/aruba_switch.jpg",
      title_vi: "Kết hợp Switch HPE Aruba (Web GUI), Router Đa WAN, Máy In Màn Hình LCD & Quản Lý Từ Xa PC Nhân Viên",
      title_en: "Real-World Office Network Integrating Multi-Vendor Switches, MFP Printers & Remote Desktop",
      desc_vi: "Một hệ thống mạng văn phòng hoàn chỉnh ngoài đời thực kết hợp Switch PoE quản lý qua Web, máy in/scan đa năng, máy in bill, điện thoại bàn IP Phone và quản trị máy tính nhân viên từ xa qua RDP (Port 3389) / Wake-on-LAN."
    }
  ]
};

Object.keys(MODULE_DIVERSE_ENTERPRISE_PHOTOS).forEach((idStr) => {
  const id = Number(idStr);
  if (MODULE_VISUALS[id] && Array.isArray(MODULE_VISUALS[id].photos)) {
    MODULE_VISUALS[id].photos = MODULE_VISUALS[id].photos.concat(MODULE_DIVERSE_ENTERPRISE_PHOTOS[id]);
  }
});
