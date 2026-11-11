// Chuyên Đề Hoàn Thiện 100% Khung Chương Trình Thi Quốc Tế CCNA 200-301 (6 Domains) & Cẩm Nang Phỏng Vấn Đi Làm Kỹ Sư Mạng
// Bổ sung đầy đủ các mảnh ghép của CCNA 2 (SRWE) & CCNA 3 (ENSA) để học viên tự tin thi đỗ chứng chỉ 200-301 và làm việc thực tế.

const CCNA_EXAM_MASTERY = [
  {
    id: 1,
    badge: "DOMAIN 2.0 • NETWORK ACCESS (20% ĐỀ THI)",
    title_vi: "Chuyên Đề 1: Chuyển Mạch Doanh Nghiệp Chuyên Sâu — VLAN, Trunking 802.1Q, DTP, Spanning Tree (STP) & EtherChannel",
    summary_vi: "Nắm vững toàn bộ kiến thức Tầng 2 nâng cao bắt buộc xuất hiện trong đề thi CCNA 200-301: Phân loại các loại VLAN đặc biệt (Data, Voice, Management, Native VLAN), giao thức tự thương lượng Trunk DTP, thuật toán bầu chọn Root Bridge của STP/RSTP và gom nhóm cổng EtherChannel (LACP vs. PAgP).",
    svg: `
      <svg viewBox="0 0 840 245" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="840" height="245" rx="8" fill="#0f172a"/>
        <text x="20" y="28" font-size="13.5" font-weight="bold" fill="#38bdf8">GIẢI PHẪU THUẬT TOÁN BẦU CHỌN STP ROOT BRIDGE (802.1D / 802.1W) &amp; BẢNG TƯƠNG THÍCH ETHERCHANNEL</text>

        <!-- STP Box -->
        <rect x="20" y="42" width="390" height="185" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="35" y="65" font-size="12.5" font-weight="bold" fill="#fbbf24">1. Quy trình 3 Bước Bầu Chọn STP (Ai NHỎ NHẤT sẽ thắng!):</text>
        <text x="35" y="88" font-size="11" fill="#e2e8f0">• Bước 1: Bầu 1 Switch làm ROOT BRIDGE có Bridge ID nhỏ nhất</text>
        <text x="45" y="106" font-size="10.5" fill="#93c5fd">Bridge ID = [Priority (Mặc định 32768 + VLAN ID)] + [MAC Address]</text>
        <text x="35" y="128" font-size="11" fill="#4ade80">• Bước 2: Mỗi Switch còn lại chọn 1 ROOT PORT (RP) hướng về Root</text>
        <text x="45" y="146" font-size="10.5" fill="#d1fae5">Tính theo tổng Chi phí đường đi (Cost: 10G=2, 1G=4, 100M=19, 10M=100)</text>
        <text x="35" y="168" font-size="11" fill="#f472b6">• Bước 3: Trên mỗi nhánh dây chọn 1 DESIGNATED PORT (DP),</text>
        <text x="45" y="186" font-size="10.5" fill="#fbcfe8">các cổng dư thừa còn lại bị khóa thành ALTERNATE / BLOCKED (Đèn cam)!</text>
        <text x="35" y="212" font-size="10.5" font-weight="bold" fill="#fde047">💡 Lưu ý: Mọi cổng trên chiếc Root Bridge luôn luôn là Designated Port (DP)!</text>

        <!-- EtherChannel Box -->
        <rect x="430" y="42" width="390" height="185" rx="6" fill="#1e293b" stroke="#10b981" stroke-width="1.5"/>
        <text x="445" y="65" font-size="12.5" font-weight="bold" fill="#6ee7b7">2. Bảng Ghép Cặp EtherChannel (Cực kỳ hay ra thi CCNA):</text>
        <text x="445" y="90" font-size="11" font-weight="bold" fill="#38bdf8">• Chuẩn quốc tế LACP (IEEE 802.3ad):</text>
        <text x="455" y="108" font-size="11" fill="#e2e8f0">- Active + Active = ✅ Lên  |  Active + Passive = ✅ Lên</text>
        <text x="455" y="126" font-size="11" fill="#fca5a5">- Passive + Passive = ❌ KHÔNG LÊN (Cả 2 cùng ngồi im chờ nhau!)</text>
        <text x="445" y="150" font-size="11" font-weight="bold" fill="#fbbf24">• Chuẩn độc quyền Cisco PAgP:</text>
        <text x="455" y="168" font-size="11" fill="#e2e8f0">- Desirable + Desirable = ✅ Lên  |  Desirable + Auto = ✅ Lên</text>
        <text x="455" y="186" font-size="11" fill="#fca5a5">- Auto + Auto = ❌ KHÔNG LÊN</text>
        <text x="445" y="212" font-size="10.5" font-weight="bold" fill="#a7f3d0">• Chế độ Tĩnh: On + On = ✅ Lên (Không trộn On với Active/Desirable!)</text>
      </svg>
    `,
    sections: [
      {
        heading: "1. Năm loại VLAN trong mạng doanh nghiệp & Bản chất của Native VLAN (802.1Q)",
        content: "• **Default VLAN (VLAN 1)**: Mặc định mọi cổng Switch đều nằm ở VLAN 1; không thể xóa hay đổi tên VLAN 1. • **Data VLAN**: Chỉ chở dữ liệu của máy tính người dùng. • **Voice VLAN (`switchport voice vlan 150`)**: Dành riêng cho điện thoại VoIP (được ưu tiên băng thông QoS mức `CoS = 5 / DSCP EF = 46` và cho phép 1 sợi cáp từ cổng Switch cắm vào IP Phone rồi nối tiếp ra PC chở đồng thời 2 VLAN!). • **Management VLAN**: VLAN riêng biệt dùng để đặt địa chỉ IP quản trị SVI cho các Switch. • **Native VLAN (Mặc định là VLAN 1 trên đường Trunk 802.1Q)**: Trên đường cáp Trunk nối giữa 2 Switch, tất cả các khung tin của các VLAN bình thường đều bị gắn thêm chiếc thẻ **802.1Q Tag dài 4 Bytes**; duy nhất các khung tin thuộc **Native VLAN** đi qua đường Trunk **KHÔNG BỊ GẮN THẺ (Untagged)**! Lưu ý sống còn: Hai đầu đường cáp Trunk bắt buộc phải cấu hình **cùng một số Native VLAN** (nếu lệch nhau sẽ báo lỗi `%CDP-4-NATIVE_VLAN_MISMATCH` và rò rỉ dữ liệu!)."
      },
      {
        heading: "2. Giao thức Tự động Thương lượng Trunk DTP (Dynamic Trunking Protocol)",
        content: "Cổng Switch Cisco mặc định chạy giao thức độc quyền **DTP** để tự đàm phán xem nên làm cổng Access hay cổng Trunk: • **`dynamic auto`**: Thụ động chờ đầu kia rủ làm Trunk; • **`dynamic desirable`**: Chủ động gạ gẫm đầu kia làm Trunk; • **`switchport mode trunk`**: Ép cứng làm Trunk; • **`switchport mode access`**: Ép cứng làm Access. **Quy tắc ghép cặp DTP**: `Auto + Auto = Access (Không lên Trunk!)`; `Desirable + Auto = Trunk`; `Desirable + Desirable = Trunk`. Để bảo mật chống tấn công *VLAN Hopping*, kỹ sư luôn tắt hẳn DTP bằng lệnh **`switchport nonegotiate`**!"
      },
      {
        heading: "3. So sánh Spanning Tree cổ điển (STP 802.1D) vs. Rapid PVST+ (RSTP 802.1w)",
        content: "• **STP 802.1D**: Hội tụ cực chậm mất **30 – 50 giây** vì phải đi qua 4 trạng thái: *Blocking (20s Max Age) → Listening (15s Forward Delay) → Learning (15s Forward Delay) → Forwarding*. • **Rapid PVST+ (802.1w)**: Hội tụ siêu tốc chỉ trong **dưới 1 – 2 giây** nhờ rút gọn các trạng thái khóa/nghe thành trạng thái **`Discarding`**, giữ nguyên `Learning` và `Forwarding`, đồng thời cho phép 2 Switch đàm phán trực tiếp với nhau mà không cần ngồi chờ đồng hồ đếm ngược 15 giây!"
      },
      {
        heading: "4. Năm điều kiện bắt buộc phải giống hệt nhau khi bó cổng EtherChannel",
        content: "Để gom từ 2 đến 8 cổng vật lý thành 1 cổng `Port-channel`, toàn bộ các cổng thành viên ở cả 2 đầu Switch bắt buộc phải khớp nhau 5 thông số: **1) Tốc độ (`Speed`)**; **2) Chế độ Song công (`Duplex`)**; **3) Chế độ cổng (`Access` hoặc cùng là `Trunk`)**; **4) Cùng `Native VLAN`**; và **5) Cùng danh sách `Allowed VLANs` trên đường Trunk**. Nếu lệch bất kỳ 1 thông số nào, cổng đó sẽ bị treo hoặc chuyển sang trạng thái lỗi `err-disabled`!"
      }
    ],
    table: {
      title: "Bảng So Sánh Các Giao Thức & Tính Năng Tầng 2 Trong Đề Thi CCNA 200-301",
      headers: ["Tính năng / Giao thức", "Chuẩn / Nguồn gốc", "Thông số Mặc định & Đặc điểm", "Câu lệnh Cấu hình Chuẩn"],
      rows: [
        ["**802.1Q Trunking**", "Chuẩn quốc tế IEEE 802.1Q", "Chèn Tag **4 Bytes** vào giữa Source MAC và EtherType; Native VLAN không gắn Tag", "`switchport mode trunk` + `switchport trunk native vlan 99`"],
        ["**Rapid PVST+**", "Cisco (dựa trên IEEE 802.1w)", "Chạy 1 cây STP riêng cho từng VLAN; Bridge Priority mặc định = **32768** (bội số của 4096)", "`spanning-tree mode rapid-pvst` + `spanning-tree vlan 10 priority 4096`"],
        ["**PortFast & BPDU Guard**", "Tính năng bảo vệ STP", "Bật trên cổng cắm PC: Vào thẳng Forwarding ngay lập tức; nếu nhận được gói BPDU từ Switch lạ cắm vào thì khóa sập cổng (`err-disabled`)", "`spanning-tree portfast` + `spanning-tree bpduguard enable`"],
        ["**LACP EtherChannel**", "Chuẩn quốc tế IEEE 802.3ad", "Hỗ trợ tối đa 8 cổng chạy cùng lúc + 8 cổng dự phòng; dùng chế độ **`active`** và **`passive`**", "`channel-group 1 mode active`"],
        ["**PAgP EtherChannel**", "Độc quyền của Cisco", "Hỗ trợ tối đa 8 cổng; dùng chế độ **`desirable`** và **`auto`**", "`channel-group 1 mode desirable`"]
      ]
    }
  },

  {
    id: 2,
    badge: "DOMAIN 2.0 • WIRELESS LANs (WLANs)",
    title_vi: "Chuyên Đề 2: Kiến Trúc Mạng Không Dây Doanh Nghiệp — Cisco WLC, Lightweight AP, Đường Hầm CAPWAP & Bảo Mật WPA2/WPA3",
    summary_vi: "Làm chủ toàn bộ kiến thức về hệ thống Wi-Fi doanh nghiệp trong đề thi CCNA 200-301: Sự khác biệt giữa Autonomous AP và Lightweight AP, kiến trúc chia đôi chức năng Split-MAC qua đường hầm CAPWAP (UDP 5246/5247), quy hoạch kênh tần số 2.4GHz/5GHz và chuẩn mã hóa WPA3 SAE / 802.1X.",
    svg: `
      <svg viewBox="0 0 840 220" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="840" height="220" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
        <text x="20" y="28" font-size="13.5" font-weight="bold" fill="#0f172a">KIẾN TRÚC SPLIT-MAC: ĐƯỜNG HẦM CAPWAP GIỮA LIGHTWEIGHT AP (LAP) VÀ BỘ ĐIỀU KHIỂN CISCO WLC</text>

        <rect x="25" y="55" width="140" height="75" rx="6" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
        <text x="95" y="85" font-size="12" font-weight="bold" text-anchor="middle" fill="#1e3a8a">📱 Laptop / Phone</text>
        <text x="95" y="105" font-size="10.5" text-anchor="middle" fill="#1d4ed8">WPA2 / WPA3 (802.11)</text>

        <rect x="230" y="48" width="175" height="90" rx="6" fill="#0284c7"/>
        <text x="317" y="75" font-size="12" font-weight="bold" text-anchor="middle" fill="#fff">📡 Lightweight AP (LAP)</text>
        <text x="317" y="95" font-size="10" text-anchor="middle" fill="#e0f2fe">• Real-time MAC: Phát sóng</text>
        <text x="317" y="112" font-size="10" text-anchor="middle" fill="#e0f2fe">  Beacons, ACK, Mã hóa RF</text>
        <text x="317" y="128" font-size="10" font-weight="bold" text-anchor="middle" fill="#fde047">• Nhận nguồn PoE từ Switch</text>

        <!-- CAPWAP Tunnel -->
        <rect x="440" y="65" width="165" height="56" rx="18" fill="#fef3c7" stroke="#d97706" stroke-width="2" stroke-dasharray="6,3"/>
        <text x="522" y="88" font-size="11" font-weight="bold" text-anchor="middle" fill="#92400e">Đường hầm CAPWAP</text>
        <text x="522" y="106" font-size="10" font-weight="bold" text-anchor="middle" fill="#b45309">UDP 5246 &amp; UDP 5247</text>

        <rect x="640" y="48" width="175" height="90" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
        <text x="727" y="75" font-size="12" font-weight="bold" text-anchor="middle" fill="#38bdf8">🎛️ Cisco WLC Controller</text>
        <text x="727" y="95" font-size="10" text-anchor="middle" fill="#cbd5e1">• Quản lý tập trung 100+ APs</text>
        <text x="727" y="112" font-size="10" text-anchor="middle" fill="#cbd5e1">• Xác thực, Roaming, RRM</text>
        <text x="727" y="128" font-size="10" font-weight="bold" text-anchor="middle" fill="#4ade80">• Nối cổng TRUNK vào Switch</text>

        <line x1="165" y1="92" x2="230" y2="92" stroke="#2563eb" stroke-width="2.5" stroke-dasharray="4,3"/>
        <line x1="405" y1="92" x2="440" y2="92" stroke="#d97706" stroke-width="3"/>
        <line x1="605" y1="92" x2="640" y2="92" stroke="#d97706" stroke-width="3"/>

        <rect x="25" y="155" width="790" height="48" rx="6" fill="#f0fdf4" stroke="#16a34a"/>
        <text x="40" y="176" font-size="11.5" font-weight="bold" fill="#14532d">💡 3 Kênh không chồng lấn (Non-Overlapping Channels) ở băng tần 2.4 GHz bắt buộc nhớ khi thi: Kênh 1, Kênh 6 và Kênh 11!</text>
        <text x="40" y="194" font-size="11" fill="#166534">• Chế độ AP: Local Mode (Mặc định - Đẩy toàn bộ dữ liệu về WLC) vs. FlexConnect Mode (Cho phép AP ở chi nhánh xa tự chuyển mạch nội bộ khi đứt WAN).</text>
      </svg>
    `,
    sections: [
      {
        heading: "1. Ba mô hình triển khai Access Point: Autonomous AP vs. Cloud-Managed vs. Controller-Based (Lightweight AP)",
        content: "• **Autonomous AP (AP độc lập)**: Mỗi cục phát Wi-Fi tự chứa toàn bộ cấu hình và phải đăng nhập vào từng cục để cài đặt bằng tay — chỉ phù hợp cho quán cà phê hoặc văn phòng nhỏ dưới 5 AP. • **Controller-Based / Lightweight AP (LAP + WLC)**: Các cục phát sóng trần nhà (**LAP**) hoàn toàn không chứa cấu hình mà hoạt động dưới sự chỉ huy của một **Bộ điều khiển trung tâm (Cisco WLC)** thông qua giao thức **CAPWAP**. Khi lắp thêm 100 cục AP mới, chỉ cần cắm dây mạng PoE là AP tự tìm về WLC tải cấu hình xuống! • **Kiến trúc Split-MAC & CAPWAP**: Đường hầm CAPWAP chạy trên nền UDP gồm 2 cổng bắt buộc thuộc lòng: **UDP Port `5246` (Control Messages - được mã hóa DTLS)** và **UDP Port `5247` (User Data Traffic)**."
      },
      {
        heading: "2. Các loại Cổng (Ports) và Giao diện Logic (Interfaces) trên thiết bị Cisco WLC",
        content: "Trong đề thi CCNA rất hay hỏi về các giao diện bên trong màn hình quản trị của Cisco WLC: • **Management Interface**: Giao diện dùng để quản trị WLC (vào Web GUI HTTPS/SSH) và giao tiếp CAPWAP với các AP. • **Virtual Interface**: Dùng để xử lý chuyển hướng trang đăng nhập Web (Web Auth) và hỗ trợ chuyển vùng di động (Mobility/DHCP Relay). • **Dynamic Interfaces (VLAN Interfaces)**: Được kỹ sư tạo ra để ánh xạ từng mạng Wi-Fi (**WLAN / SSID**) vào từng **VLAN** tương ứng trong mạng dây (ví dụ SSID `WiFi-NhanVien` gắn vào Dynamic Interface `VLAN 10`, còn SSID `WiFi-Khach` gắn vào `VLAN 99`). • **Service Port**: Cổng vật lý riêng biệt dùng để cứu hộ Out-of-Band khi mạng chính bị lỗi."
      },
      {
        heading: "3. Các chế độ hoạt động của Lightweight AP (Local, FlexConnect, Monitor, Rogue Detector, Sniffer)",
        content: "• **Local Mode (Mặc định)**: AP phát sóng phục vụ người dùng và đóng gói toàn bộ lưu lượng đẩy về WLC trung tâm. • **FlexConnect Mode (trước đây gọi là H-REAP)**: Dành cho các AP đặt tại chi nhánh ở xa (qua đường WAN); nếu đường WAN về trụ sở bị đứt, AP ở chế độ FlexConnect vẫn tự chuyển mạch dữ liệu nội bộ tại chi nhánh mà không làm rớt Wi-Fi! • **Monitor Mode**: AP không phát sóng cho người dùng mà chỉ lắng nghe sóng xung quanh để phát hiện AP giả mạo (**Rogue AP**) và tấn công IDS. • **Sniffer Mode**: Biến AP thành thiết bị bắt gói tin không dây gửi về phần mềm Wireshark của kỹ sư."
      },
      {
        heading: "4. Các chuẩn Bảo mật Không dây: WPA vs. WPA2 vs. WPA3 (Personal PSK/SAE vs. Enterprise 802.1X)",
        content: "• **Open (Không mật khẩu)**: Không mã hóa sóng vô tuyến. • **WEP & WPA (TKIP)**: Thế hệ cũ đã bị bẻ khóa, không còn an toàn. • **WPA2 (Chuẩn IEEE 802.11i)**: Sử dụng thuật toán mã hóa đối xứng cực mạnh **AES-CCMP**. • **WPA3 (Thế hệ mới nhất)**: Thay thế cơ chế bắt tay PSK của WPA2 bằng giao thức **SAE (Simultaneous Authentication of Equals)** giúp chống dò mật khẩu Offline Dictionary Attack, dùng mã hóa **GCMP-256**, và bổ sung tính năng **OWE (Opportunistic Wireless Encryption)** mã hóa tự động ngay cả cho mạng Wi-Fi công cộng không đặt mật khẩu! • **Personal vs. Enterprise**: *Personal* dùng 1 mật khẩu chung (Pre-Shared Key) cho mọi người; *Enterprise* bắt buộc mỗi nhân viên đăng nhập bằng tài khoản riêng qua chuẩn **IEEE 802.1X / EAP** kết nối tới máy chủ **RADIUS Server (như Cisco ISE)**."
      }
    ],
    table: {
      title: "Bảng Tóm Tắt Thông Số Tần Số & Bảo Mật Wi-Fi Trong Đề Thi CCNA 200-301",
      headers: ["Tiêu chí", "Băng tần 2.4 GHz (802.11b/g/n/ax)", "Băng tần 5 GHz (802.11a/n/ac/ax)", "Băng tần 6 GHz (Wi-Fi 6E - 802.11ax)"],
      rows: [
        ["**Phạm vi phủ sóng & Xuyên tường**", "Đi xa nhất, xuyên tường bê tông tốt nhất", "Phạm vi ngắn hơn 2.4 GHz, suy hao qua tường nhiều hơn", "Phạm vi ngắn, tốc độ cực cao trong phòng mở"],
        ["**Nhiễu sóng & Kênh không chồng lấn**", "Rất dễ nhiễu (Bluetooth, lò vi sóng). Chỉ có **3 kênh không chồng lấn: 1, 6, 11**", "Ít nhiễu hơn hẳn, có tới **24 kênh không chồng lấn** (36, 40, 44, 48...)", "Băng thông cực rộng, hoàn toàn sạch nhiễu từ thiết bị cũ"],
        ["**Bản chất định danh không dây**", "**SSID**: Tên mạng Wi-Fi hiển thị", "**BSSID**: Địa chỉ MAC của radio trên 1 cục AP (Basic Service Set)", "**ESSID**: Tập hợp nhiều cục AP cùng phát chung 1 tên SSID để đi lại (Roaming)"]
      ]
    }
  },

  {
    id: 3,
    badge: "DOMAIN 3.0 • IP CONNECTIVITY (25% — TRỌNG SỐ LỚN NHẤT ĐỀ THI!)",
    title_vi: "Chuyên Đề 3: Định Tuyến Chuyên Sâu — 3 Quy Tắc Vàng Chọn Đường, Giải Phẫu OSPFv2 & Dự Phòng Gateway FHRP (HSRP/VRRP/GLBP)",
    summary_vi: "Chiếm tới 25% tổng điểm bài thi CCNA 200-301! Chuyên đề này trang bị cho bạn kỹ năng đọc bảng định tuyến nâng cao để trả lời ngay lập tức câu hỏi 'Gói tin đi ra cổng nào?', làm chủ hoàn toàn giao thức OSPFv2 và 3 giao thức dự phòng Gateway FHRP.",
    svg: `
      <svg viewBox="0 0 840 240" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="840" height="240" rx="8" fill="#0f172a"/>
        <text x="20" y="28" font-size="13.5" font-weight="bold" fill="#38bdf8">THỨ TỰ 3 QUY TẮC VÀNG KHI ROUTER CHỌN ĐƯỜNG ĐI &amp; BẢNG ADMINISTRATIVE DISTANCE (AD)</text>

        <!-- 3 Golden Rules -->
        <rect x="20" y="42" width="430" height="180" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="35" y="65" font-size="12.5" font-weight="bold" fill="#fbbf24">🔥 Thứ tự ưu tiên xét duyệt của Router (Đừng bao giờ nhầm!):</text>
        <text x="35" y="92" font-size="11.5" font-weight="bold" fill="#4ade80">Ưu tiên số 1: LONGEST PREFIX MATCH (Độ dài /n lớn nhất thắng tuyệt đối!)</text>
        <text x="45" y="110" font-size="10.5" fill="#e2e8f0">Khi gói tin đã nằm trong bảng định tuyến, tuyến đường có /28 LUÔN THẮNG /24</text>
        <text x="45" y="126" font-size="10.5" fill="#e2e8f0">và /24 LUÔN THẮNG /16 — bất kể tuyến đó học từ RIP, OSPF hay Static!</text>
        <text x="35" y="152" font-size="11.5" font-weight="bold" fill="#38bdf8">Ưu tiên số 2: ADMINISTRATIVE DISTANCE (AD - Độ tin cậy nhỏ nhất)</text>
        <text x="45" y="170" font-size="10.5" fill="#e2e8f0">Chỉ xét khi 2 giao thức khác nhau cùng dạy Router tới CÙNG MỘT PREFIX (VD cùng /24)!</text>
        <text x="35" y="196" font-size="11.5" font-weight="bold" fill="#f472b6">Ưu tiên số 3: METRIC (Chi phí nhỏ nhất — Nếu bằng nhau thì ECMP chia tải!)</text>
        <text x="45" y="212" font-size="10.5" fill="#e2e8f0">Chỉ xét khi trùng cả Prefix Length và học từ cùng 1 giao thức định tuyến.</text>

        <!-- AD Table -->
        <rect x="465" y="42" width="355" height="180" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="480" y="65" font-size="12.5" font-weight="bold" fill="#38bdf8">Bảng Chỉ Số AD Mặc Định (Thuộc lòng 100%):</text>
        <text x="480" y="90" font-size="11" fill="#4ade80">• Connected (Nối trực tiếp):       AD = 0</text>
        <text x="480" y="110" font-size="11" fill="#4ade80">• Static Route (ip route):         AD = 1</text>
        <text x="480" y="130" font-size="11" fill="#fbbf24">• External BGP (eBGP):             AD = 20</text>
        <text x="480" y="150" font-size="11" fill="#fbbf24">• EIGRP Internal (D):              AD = 90</text>
        <text x="480" y="170" font-size="11" font-weight="bold" fill="#38bdf8">• OSPF (O):                        AD = 110</text>
        <text x="480" y="190" font-size="11" fill="#cbd5e1">• IS-IS (i): AD = 115  |  RIP (R): AD = 120</text>
        <text x="480" y="210" font-size="11" fill="#fca5a5">• EIGRP Ext: AD = 170  |  iBGP:    AD = 200</text>
      </svg>
    `,
    sections: [
      {
        heading: "1. Giải quyết bài toán kinh điển nhất đề thi CCNA: 'Gói tin có IP đích X sẽ đi theo dòng nào trong bảng định tuyến?'",
        content: "Giả sử bảng định tuyến của Router đang có 3 dòng: 1) `O 10.1.1.0/24 [110/50] via 192.168.1.2`; 2) `R 10.1.1.128/25 [120/4] via 192.168.2.2`; 3) `S 10.1.0.0/16 [1/0] via 192.168.3.2`. Hỏi một gói tin gửi tới địa chỉ **`10.1.1.150`** sẽ được đẩy ra cổng nào? • Nhiều thí sinh nhìn thấy `Static AD = 1` hoặc `OSPF AD = 110` là chọn ngay — **SAI HOÀN TOÀN!** Khi các dòng đã nằm sẵn trong bảng định tuyến, Router **chỉ xét duy nhất quy tắc Longest Prefix Match (Số bit khớp dài nhất)**: Địa chỉ `10.1.1.150` khớp với cả 3 dòng (`.150` nằm trong khoảng `.128 -> .255` của `/25`), và vì **`/25` dài hơn `/24` và `/16`** nên Router bắt buộc chọn dòng **`R 10.1.1.128/25` (RIP)**!"
      },
      {
        heading: "2. Giải phẫu toàn diện Giao thức Định tuyến Động OSPFv2 (Open Shortest Path First)",
        content: "• **Đặc điểm cốt lõi**: Giao thức định tuyến trạng thái liên kết (**Link-State**) chuẩn mở quốc tế, sử dụng thuật toán **SPF của Dijkstra**, `AD = 110`, số hiệu giao thức trong IP Header là `Protocol = 89`, gửi bản tin qua địa chỉ Multicast **`224.0.0.5` (Tất cả OSPF Routers)** và **`224.0.0.6` (Chỉ gửi cho DR/BDR)**. • **Công thức tính Metric (Cost)**: `Cost = Reference Bandwidth (Mặc định 100,000,000 bps = 100 Mbps) / Băng thông cổng` (với cổng 10Mbps Cost=10; từ cổng FastEthernet 100Mbps, Gigabit 1Gbps, 10Gbps nếu để mặc định đều bị tính tròn `Cost = 1` -> Phải gõ lệnh `auto-cost reference-bandwidth 10000` trên mọi Router để phân biệt tốc độ 1G và 10G!). • **Thứ tự 3 ưu tiên chọn Router-ID (32-bit)**: 1) Lệnh gõ tay `router-id x.x.x.x`; 2) Nếu không gõ tay, lấy **Địa chỉ IPv4 CAO NHẤT trong các cổng ảo `Loopback`**; 3) Nếu không có Loopback, lấy **Địa chỉ IPv4 CAO NHẤT trong các cổng vật lý đang `up/up`**. • **6 Điều kiện bắt buộc phải khớp để 2 Router lên láng giềng OSPF (`FULL`)**: 1) Cùng **Area ID**; 2) Cùng **Hello Timer (10s) & Dead Timer (40s)**; 3) Cùng **Subnet Mask** trên đường nối; 4) Cùng **Mật khẩu xác thực (Authentication)**; 5) Cùng **Cờ vùng đặc biệt (Stub Area Flag)**; 6) Khác **Router-ID** và khớp **MTU**."
      },
      {
        heading: "3. Bầu chọn DR (Designated Router) và BDR (Backup DR) trên mạng Ethernet Multiaccess trong OSPF",
        content: "Khi nhiều Router cùng cắm vào 1 chiếc Switch Ethernet (Broadcast Multiaccess), để tránh việc mọi Router đều gửi bản tin LSA chéo cho nhau gây ngập lụt (`n(n-1)/2` cặp), OSPF bầu ra 1 ông trưởng phòng **DR** và 1 ông phó phòng **BDR**: • **Tiêu chí bầu**: 1) Ai có **`ip ospf priority` CAO NHẤT** sẽ thắng (mặc định = `1`, từ `0` đến `255`; nếu đặt **`priority = 0`** thì Router đó từ chối không bao giờ làm DR/BDR và gọi là **DROTHER**); 2) Nếu Priority bằng nhau, ai có **Router-ID CAO NHẤT** sẽ làm DR, cao nhì làm BDR! • **Lưu ý bẫy đề thi**: Cuộc bầu chọn DR/BDR của OSPF **KHÔNG có tính chất Preempt (chiếm quyền)** — nghĩa là khi đã có DR rồi, dù bạn cắm thêm một Router mới có Priority=255 vào sau thì nó cũng phải đợi đến khi DR hiện tại bị tắt hoặc khởi động lại tiến trình (`clear ip ospf process`) mới được lên thay! *(Trên đường cáp nối thẳng Point-to-Point giữa 2 Router thì KHÔNG bầu DR/BDR).* "
      },
      {
        heading: "4. So sánh 3 Giao thức Dự phòng Cổng Mặc Định FHRP (HSRP vs. VRRP vs. GLBP)",
        content: "• **HSRP (Hot Standby Router Protocol)**: Độc quyền của Cisco, gồm 1 **Active Router** + 1 **Standby Router**; Priority mặc định = `100`, Hello 3s / Hold 10s, Multicast `224.0.0.2` (v1) / `224.0.0.102` (v2), Địa chỉ MAC ảo cố định là **`0000.0c07.acXX`** (với `XX` là số Group viết bằng 2 chữ số Hex, ví dụ Group 10 = `0a`). • **VRRP (Virtual Router Redundancy Protocol)**: Chuẩn mở quốc tế IETF, gồm 1 **Master Router** + nhiều **Backup Routers**; Multicast `224.0.0.18`, MAC ảo **`0000.5e00.01XX`**, mặc định bật sẵn tính năng chiếm quyền *Preempt*. • **GLBP (Gateway Load Balancing Protocol)**: Độc quyền của Cisco, gồm 1 **AVG (Active Virtual Gateway)** và tối đa 4 **AVF (Active Virtual Forwarders)** giúp vừa dự phòng vừa **cân bằng tải đồng thời qua tất cả các Router**!"
      }
    ],
    table: {
      title: "Bảng So Sánh 3 Giao Thức Dự Phòng Gateway FHRP (HSRP vs. VRRP vs. GLBP)",
      headers: ["Tiêu chí", "HSRP (Hot Standby)", "VRRP (Virtual Router Redundancy)", "GLBP (Gateway Load Balancing)"],
      rows: [
        ["**Nguồn gốc / Tiêu chuẩn**", "Độc quyền **Cisco**", "Chuẩn mở quốc tế **IETF (RFC 5798)**", "Độc quyền **Cisco**"],
        ["**Tên gọi các vai trò**", "**Active** (Chính) & **Standby** (Dự phòng)", "**Master** (Chính) & **Backup** (Dự phòng)", "**AVG** (Điều phối) & **AVF** (Chuyển tiếp)"],
        ["**Khả năng Cân bằng tải**", "Chỉ 1 Router Active chuyển dữ liệu tại 1 thời điểm", "Chỉ 1 Router Master chuyển dữ liệu tại 1 thời điểm", "**Cân bằng tải qua tối đa 4 Router cùng lúc!**"],
        ["**Địa chỉ MAC Ảo (Virtual MAC)**", "`0000.0c07.acXX` (v1) / `0000.0c9f.fXXX` (v2)", "`0000.5e00.01XX`", "`0007.b400.XXYY`"]
      ]
    }
  },

  {
    id: 4,
    badge: "DOMAIN 4.0 • IP SERVICES (10% ĐỀ THI)",
    title_vi: "Chuyên Đề 4: Dịch Vụ Hạ Tầng Mạng Doanh Nghiệp — NAT/PAT 4 Thuật Ngữ, NTP Stratum, Syslog 8 Mức Độ, SNMP & QoS",
    summary_vi: "Tổng hợp toàn bộ kiến thức Domain 4.0: Phân biệt chính xác 4 thuật ngữ địa chỉ trong NAT (Inside Local, Inside Global, Outside Local, Outside Global), đồng bộ thời gian NTP, 8 cấp độ nghiêm trọng của nhật ký Syslog (0–7), giám sát mạng SNMPv3 và kiến trúc ưu tiên chất lượng dịch vụ QoS.",
    svg: `
      <svg viewBox="0 0 840 220" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="840" height="220" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
        <text x="20" y="28" font-size="13.5" font-weight="bold" fill="#0f172a">SƠ ĐỒ PHÂN BIỆT 4 THUẬT NGỮ ĐỊA CHỈ NAT (INSIDE LOCAL / INSIDE GLOBAL / OUTSIDEGLOBAL) &amp; 8 MỨC SYSLOG</text>

        <rect x="20" y="42" width="440" height="162" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
        <text x="35" y="64" font-size="12" font-weight="bold" fill="#1e3a8a">1. Bốn Thuật Ngữ Địa Chỉ Trong Bảng Dịch NAT (show ip nat translations):</text>
        <text x="35" y="88" font-size="11" fill="#1e40af">• Inside Local: IP Private của máy tính trong LAN (VD: 192.168.1.10)</text>
        <text x="35" y="110" font-size="11" font-weight="bold" fill="#0369a1">• Inside Global: IP Public của Router công ty đại diện đi ra Internet (VD: 203.0.113.2)</text>
        <text x="35" y="132" font-size="11" fill="#15803d">• Outside Global: IP Public thật của máy chủ ngoài Internet (VD: 8.8.8.8)</text>
        <text x="35" y="154" font-size="11" fill="#15803d">• Outside Local: IP của máy chủ ngoài Internet khi nhìn từ trong LAN (Thường trùng 8.8.8.8)</text>
        <text x="35" y="185" font-size="10.5" font-style="italic" fill="#334155">💡 Mẹo nhớ: 'Inside' = Thiết bị của công ty mình; 'Local' = Nhìn ở trong LAN; 'Global' = Nhìn ngoài Internet!</text>

        <rect x="475" y="42" width="345" height="162" rx="6" fill="#0f172a"/>
        <text x="490" y="64" font-size="12" font-weight="bold" fill="#fbbf24">2. Tám Mức Độ Nghiêm Trọng Của Syslog (0 -&gt; 7):</text>
        <text x="490" y="86" font-size="10.5" fill="#fca5a5">• Mức 0: Emergencies (Hệ thống sập hoàn toàn)</text>
        <text x="490" y="103" font-size="10.5" fill="#fca5a5">• Mức 1: Alerts (Cần hành động khẩn cấp ngay)</text>
        <text x="490" y="120" font-size="10.5" fill="#fdba74">• Mức 2: Critical  |  Mức 3: Errors (Lỗi cổng/giao thức)</text>
        <text x="490" y="137" font-size="10.5" fill="#fde047">• Mức 4: Warnings  |  Mức 5: Notifications (Lên/xuống cổng)</text>
        <text x="490" y="154" font-size="10.5" fill="#4ade80">• Mức 6: Informational  |  Mức 7: Debugging (Chi tiết nhất)</text>
        <text x="490" y="182" font-size="10" font-weight="bold" fill="#38bdf8">Mẹo nhớ: Every Awesome Cisco Engineer Will Need Ice-cream Daily</text>
      </svg>
    `,
    sections: [
      {
        heading: "1. Ba kiểu cấu hình NAT: Static NAT vs. Dynamic NAT vs. PAT (NAT Overload)",
        content: "• **Static NAT (Ánh xạ tĩnh 1-đổi-1)**: Gán cố định 1 địa chỉ IP Private nội bộ với 1 địa chỉ IP Public (`ip nat inside source static 192.168.1.100 203.0.113.100`) — bắt buộc dùng khi bạn đặt một **Web Server hoặc Mail Server ở trong mạng nội bộ** và muốn khách hàng từ ngoài Internet truy cập vào được Server đó! • **Dynamic NAT (Ánh xạ động từ bể Pool)**: Cấp phát theo cơ chế 1-đổi-1 từ một dải nhiều IP Public; nếu có 5 IP Public thì chỉ đúng 5 máy đi ra được cùng lúc, máy thứ 6 phải đợi. • **PAT / NAT Overload (`overload`)**: Ánh xạ **Hàng ngàn IP Private ra duy nhất 1 IP Public** bằng cách gắn kèm **Số hiệu cổng nguồn (Source Port)** khác nhau cho từng phiên kết nối."
      },
      {
        heading: "2. Giao thức Giám sát Thiết bị Mạng SNMP (Simple Network Management Protocol - UDP Ports 161 & 162)",
        content: "Hệ thống giám sát mạng tự động (như PRTG, SolarWinds, Zabbix) hoạt động dựa trên giao thức **SNMP** gồm 3 thành phần: 1) **SNMP Manager (NMS)**: Máy chủ giám sát trung tâm; 2) **SNMP Agent**: Tiến trình chạy ngầm trên các Switch/Router; 3) **MIB (Management Information Base)**: Cơ sở dữ liệu chứa các biến số trạng thái thiết bị (như nhiệt độ CPU, băng thông cổng) được đánh mã định danh dạng cây gọi là **OID**. • **Hai chiều giao tiếp**: Máy chủ NMS chủ động hỏi thông số qua **`Get / Set Request` (UDP Port 161)**; hoặc khi thiết bị gặp sự cố (như đứt cáp, quạt nguồn ngừng quay), thiết bị chủ động bắn bản tin báo động **`SNMP Trap / Inform` (UDP Port 162)** về máy chủ! • **Phiên bản**: `SNMPv1/v2c` dùng chuỗi mật khẩu chữ rõ *Community String (`public`/`private`)* kém an toàn; **`SNMPv3`** là chuẩn bắt buộc hiện nay vì hỗ trợ xác thực và mã hóa toàn bộ gói tin (**chế độ `authPriv`**)."
      },
      {
        heading: "3. Kiến trúc Chất lượng Dịch vụ QoS (Quality of Service): Phân loại, Đánh dấu (CoS vs. DSCP), Policing/Shaping & LLQ",
        content: "• **Classification & Marking (Phân loại & Đánh dấu tại biên phần cứng - Trust Boundary)**: Khi chiếc điện thoại IP Phone gửi gói tin thoại vào Switch, nó đánh dấu độ ưu tiên ở Tầng 2 (trong thẻ 802.1Q VLAN Tag) bằng 3 bit **CoS (Class of Service = `5`)**, và ở Tầng 3 (trong IP Header) bằng 6 bit **DSCP (Differentiated Services Code Point = `EF` hay số thập phân **`46`** - Expedited Forwarding)**. • **Queuing (Xếp hàng đợi)**: Khi mạng nghẽn, thuật toán **CBWFQ kết hợp LLQ (Low Latency Queuing)** sẽ tạo một **Hàng đợi Ưu tiên Tuyệt đối (Strict Priority Queue)** dành riêng cho gói tin Voice (`DSCP EF = 46`) được phóng đi ngay lập tức không phải xếp hàng! • **Traffic Policing vs. Traffic Shaping**: Khi lưu lượng vượt quá băng thông cam kết, **Policing** sẽ **cắt bỏ (Drop)** ngay các gói vượt ngưỡng; còn **Shaping** sẽ **giữ tạm vào bộ đệm (Buffer)** rồi điều tiết gửi đi từ từ giúp hạn chế mất gói."
      }
    ],
    table: {
      title: "Bảng Tổng Hợp Các Giao Thức Dịch Vụ Hạ Tầng Domain 4.0 (Cổng & Câu Lệnh Chuẩn)",
      headers: ["Giao thức / Dịch vụ", "Giao thức & Số hiệu Port", "Thông số cốt lõi hay ra thi", "Câu lệnh Cisco IOS tiêu biểu"],
      rows: [
        ["**NTP (Đồng bộ giờ)**", "**UDP Port 123**", "Cấp độ **Stratum 0** (Đồng hồ nguyên tử) → **Stratum 1** (Máy chủ nối trực tiếp) → tối đa **Stratum 15** (Stratum 16 = Không đồng bộ)", "`ntp server 192.168.1.100` / `ntp master 2`"],
        ["**Syslog (Nhật ký)**", "**UDP Port 514**", "8 mức độ từ **0 (Emergencies)** đến **7 (Debugging)**. Mức số càng NHỎ thì lỗi càng NGHIÊM TRỌNG!", "`logging host 192.168.1.100` + `logging trap debugging`"],
        ["**SNMP (Giám sát)**", "**UDP 161** (Get/Set) & **UDP 162** (Trap)", "**SNMPv3 `authPriv`** là chế độ an toàn nhất (vừa xác thực người dùng vừa mã hóa gói tin bằng AES/DES)", "`snmp-server group ... v3 priv`"],
        ["**QoS cho Voice VoIP**", "Layer 2 **CoS** (3-bit) / Layer 3 **DSCP** (6-bit)", "Voice luôn dùng **`CoS = 5`** và **`DSCP = EF (46)`** chạy trong hàng đợi ưu tiên **LLQ**; độ trễ một chiều yêu cầu **`<= 150 ms`**, Jitter **`<= 30 ms`**, Loss **`<= 1%`**", "`mls qos trust cos` / `priority` (trong policy-map)"]
      ]
    }
  },

  {
    id: 5,
    badge: "DOMAIN 6.0 • AUTOMATION & PROGRAMMABILITY (10% ĐỀ THI MỚI)",
    title_vi: "Chuyên Đề 5: Tự Động Hóa Mạng, Kiến Trúc SDN, Cisco DNA Center, REST API, JSON & Công Cụ Ansible / Puppet / Chef",
    summary_vi: "Đây là phần kiến thức mới chiếm 10% điểm số trong đề thi CCNA 200-301 hiện đại mà các tài liệu cũ không có! Bạn sẽ hiểu rõ sự tách biệt giữa Control Plane và Data Plane, kiến trúc SDN Controller, đọc hiểu dữ liệu JSON, REST API và phân biệt ngay Ansible, Puppet, Chef.",
    svg: `
      <svg viewBox="0 0 840 235" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="840" height="235" rx="8" fill="#0f172a"/>
        <text x="20" y="28" font-size="13.5" font-weight="bold" fill="#38bdf8">KIẾN TRÚC MẠNG ĐỊNH NGHĨA BẰNG PHẦN MỀM (SDN): NORTHBOUND API VS. SOUTHBOUND API</text>

        <!-- Applications -->
        <rect x="240" y="42" width="360" height="42" rx="6" fill="#4f46e5"/>
        <text x="420" y="68" font-size="12" font-weight="bold" text-anchor="middle" fill="#fff">💻 Ứng Dụng Quản Trị &amp; Tự Động Hóa (Python Scripts / Web Portal)</text>

        <!-- Northbound API -->
        <text x="420" y="102" font-size="11" font-weight="bold" text-anchor="middle" fill="#fbbf24">⬆️⬇️ NORTHBOUND API: Giao thức REST API (HTTP GET/POST/PUT/DELETE + Dữ liệu JSON)</text>

        <!-- SDN Controller -->
        <rect x="200" y="112" width="440" height="48" rx="8" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
        <text x="420" y="135" font-size="13" font-weight="bold" text-anchor="middle" fill="#fff">🧠 SDN CONTROLLER (CISCO DNA CENTER / CATALYST CENTER)</text>
        <text x="420" y="152" font-size="10.5" text-anchor="middle" fill="#e0f2fe">Nắm giữ bộ não điều khiển tập trung (Centralized Control Plane)</text>

        <!-- Southbound API -->
        <text x="420" y="178" font-size="11" font-weight="bold" text-anchor="middle" fill="#4ade80">⬆️⬇️ SOUTHBOUND API: Giao thức NETCONF, RESTCONF, OpenFlow, OpFlex, SSH/SNMP</text>

        <!-- Physical Switches/Routers -->
        <rect x="80" y="188" width="210" height="36" rx="5" fill="#1e293b" stroke="#64748b"/><text x="185" y="210" font-size="11" font-weight="bold" text-anchor="middle" fill="#cbd5e1">🔀 Switch 1 (Data Plane ASIC)</text>
        <rect x="315" y="188" width="210" height="36" rx="5" fill="#1e293b" stroke="#64748b"/><text x="420" y="210" font-size="11" font-weight="bold" fill="#cbd5e1">🌐 Router 2 (Data Plane ASIC)</text>
        <rect x="550" y="188" width="210" height="36" rx="5" fill="#1e293b" stroke="#64748b"/><text x="655" y="210" font-size="11" font-weight="bold" fill="#cbd5e1">📡 WLC 3 (Data Plane ASIC)</text>
      </svg>
    `,
    sections: [
      {
        heading: "1. Ba Mặt phẳng Hoạt động của Thiết bị Mạng: Data Plane vs. Control Plane vs. Management Plane",
        content: "• **Data Plane (Forwarding Plane - Mặt phẳng Dữ liệu)**: Là phần cứng chip **ASIC / TCAM** chuyên làm công việc chân tay tốc độ cao — nhận khung tin vào cổng, tra bảng FIB/CAM có sẵn và bắn khung tin ra cổng đích với tốc độ hàng triệu gói/giây. • **Control Plane (Mặt phẳng Điều khiển)**: Là 'Bộ não' chạy bằng CPU để trao đổi các bản tin định tuyến **OSPF, EIGRP, BGP, STP, ARP** và tính toán vẽ ra bảng định tuyến. Trong mạng truyền thống, mỗi chiếc Router tự giữ một bộ não Control Plane riêng; còn trong mạng **SDN (Software-Defined Networking)**, toàn bộ Control Plane được gom về một **Máy chủ Điều khiển Trung tâm (SDN Controller)**! • **Management Plane (Mặt phẳng Quản trị)**: Giao tiếp phục vụ quản trị viên con người như **SSH, Telnet, SNMP, Syslog, RESTCONF/NETCONF**."
      },
      {
        heading: "2. Northbound API vs. Southbound API & Giải pháp Cisco DNA Center (SD-Access)",
        content: "• **Northbound API (API hướng Bắc)**: Giao diện nối từ **SDN Controller đi lên phía các ứng dụng phần mềm/con người** — luôn sử dụng kiến trúc **RESTful API** chạy trên nền HTTPS trao đổi dữ liệu định dạng **JSON**. • **Southbound API (API hướng Nam)**: Giao diện nối từ **SDN Controller đi xuống điều khiển các thiết bị phần cứng Switch/Router bên dưới** — sử dụng các giao thức như **OpenFlow, NETCONF (TCP 830, dùng XML), RESTCONF (dùng JSON/XML), hoặc Cisco OpFlex**. • **Cisco DNA Center (nay là Cisco Catalyst Center)**: Là bộ điều khiển SDN cho mạng doanh nghiệp (Enterprise Campus) triển khai kiến trúc **SD-Access (Software-Defined Access)** dùng giao thức **LISP** (quản lý định danh IP), **VXLAN** (đóng gói đường hầm dữ liệu Data Plane) và **Cisco TrustSec / SGT** (gắn nhãn bảo mật)."
      },
      {
        heading: "3. Cấu trúc dữ liệu JSON (JavaScript Object Notation) & Các phương thức REST API (CRUD)",
        content: "Trong đề thi CCNA chắc chắn sẽ có câu hỏi cho một đoạn mã **JSON** và hỏi đâu là cú pháp hợp lệ! Hãy nhớ 4 quy tắc của JSON: 1) Dữ liệu được viết dưới dạng cặp **`\"key\": value`** (Tên thuộc tính `key` **bắt buộc phải bọc trong dấu ngoặc kép `\" \"`**!); 2) Một **Object (Đối tượng)** được bọc trong cặp dấu ngoặc nhọn **`{ }`**; 3) Một **Array (Mảng danh sách)** được bọc trong cặp dấu ngoặc vuông **`[ ]`**; 4) Các phần tử cách nhau bằng dấu phẩy `,`. • **Ánh xạ 4 thao tác dữ liệu CRUD sang phương thức HTTP của REST API**: **C**reate (Tạo mới) = **`POST`**; **R**ead (Đọc/Lấy dữ liệu) = **`GET`**; **U**pdate (Cập nhật) = **`PUT` / `PATCH`**; **D**elete (Xóa) = **`DELETE`**."
      },
      {
        heading: "4. So sánh 3 Công cụ Tự động hóa Cấu hình: Ansible vs. Puppet vs. Chef",
        content: "Đây là câu hỏi ăn điểm dễ nhất nếu bạn thuộc bảng phân biệt sau: • **Ansible**: Là công cụ duy nhất **KHÔNG CẦN CÀI ĐẶT PHẦN MỀM AGENT LÊN SWITCH/ROUTER (`Agentless`)**! Máy chủ Ansible chủ động **Đẩy cấu hình xuống (`Push Model`)** thông qua kết nối **SSH / NETCONF**, và kịch bản của nó được gọi là **Playbook** viết bằng ngôn ngữ **YAML** rất dễ đọc. • **Puppet**: Yêu cầu cài đặt **Agent** (hoặc Proxy Agent), thiết bị chủ động **Kéo cấu hình về (`Pull Model`)** qua cổng **TCP 8140**, file kịch bản gọi là **Manifest**. • **Chef**: Yêu cầu cài đặt **Agent (`Pull Model`)**, viết kịch bản bằng ngôn ngữ lập trình **Ruby**, file kịch bản gọi là **Recipe / Cookbook**."
      }
    ],
    table: {
      title: "Bảng Vàng So Sánh Công Cụ Tự Động Hóa Mạng: Ansible vs. Puppet vs. Chef",
      headers: ["Tiêu chí so sánh", "Ansible (Phổ biến nhất cho Mạng)", "Puppet", "Chef"],
      rows: [
        ["**Cài đặt Agent trên thiết bị?**", "**Agentless (Không cần cài Agent!)**", "Agent-based (Cần Agent)", "Agent-based (Cần Agent)"],
        ["**Cơ chế truyền cấu hình**", "**Push Model** (Máy chủ đẩy cấu hình xuống thiết bị)", "**Pull Model** (Thiết bị tự kéo cấu hình từ Puppet Master)", "**Pull Model** (Thiết bị kéo từ Chef Server)"],
        ["**Giao thức kết nối & Port**", "**SSH (TCP Port 22)** hoặc NETCONF (Port 830)", "HTTPS tùy chỉnh (**TCP Port 8140**)", "HTTPS (TCP Port 443 / 10002)"],
        ["**Ngôn ngữ & Tên gọi file kịch bản**", "Viết bằng **YAML** — Gọi là **Playbook**", "Ngôn ngữ riêng của Puppet — Gọi là **Manifest**", "Viết bằng **Ruby** — Gọi là **Recipe & Cookbook**"]
      ]
    }
  },

  {
    id: 6,
    badge: "CẨM NANG ĐI LÀM THỰC TẾ & TUYỂN DỤNG",
    title_vi: "Chuyên Đề 6: Kinh Nghiệm Đi Làm Kỹ Sư Mạng Thực Tế & Bộ 12 Câu Hỏi Phỏng Vấn Tuyển Dụng Kinh Điển",
    summary_vi: "Giúp bạn tự tin bước qua vòng phỏng vấn kỹ thuật (Technical Interview) tại các doanh nghiệp, ngân hàng, nhà mạng ISP (Viettel, VNPT, FPT) và nắm vững quy trình làm việc chuẩn của một Network Engineer thực thụ.",
    svg: `
      <svg viewBox="0 0 840 190" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="840" height="190" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
        <text x="20" y="28" font-size="13.5" font-weight="bold" fill="#0f172a">QUY TRÌNH 5 BƯỚC THỰC HIỆN THAY ĐỔI MẠNG TRONG DOANH NGHIỆP (CHANGE MANAGEMENT PLAYBOOK)</text>

        <rect x="20" y="48" width="150" height="115" rx="6" fill="#dbeafe" stroke="#2563eb"/><text x="95" y="75" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#1e3a8a">1. Backup Cấu Hình</text><text x="95" y="98" font-size="10" text-anchor="middle" fill="#1e40af">Copy running-config</text><text x="95" y="114" font-size="10" text-anchor="middle" fill="#1e40af">ra TFTP/Laptop trước</text><text x="95" y="130" font-size="10" text-anchor="middle" fill="#1e40af">khi gõ bất kỳ lệnh gì!</text>

        <rect x="182" y="48" width="150" height="115" rx="6" fill="#fef3c7" stroke="#d97706"/><text x="257" y="75" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#92400e">2. Hẹn Giờ Reload</text><text x="257" y="98" font-size="10" text-anchor="middle" fill="#b45309">Gõ reload in 10 khi</text><text x="257" y="114" font-size="10" text-anchor="middle" fill="#b45309">cấu hình từ xa (Phòng</text><text x="257" y="130" font-size="10" text-anchor="middle" fill="#b45309">khi tự khóa mất SSH)</text>

        <rect x="344" y="48" width="150" height="115" rx="6" fill="#e0e7ff" stroke="#4f46e5"/><text x="419" y="75" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#312e81">3. Thực Thi (Change)</text><text x="419" y="98" font-size="10" text-anchor="middle" fill="#3730a3">Chạy trong khung giờ</text><text x="419" y="114" font-size="10" text-anchor="middle" fill="#3730a3">bảo trì ban đêm</text><text x="419" y="130" font-size="10" text-anchor="middle" fill="#3730a3">(Maintenance Window)</text>

        <rect x="506" y="48" width="150" height="115" rx="6" fill="#dcfce7" stroke="#16a34a"/><text x="581" y="75" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#14532d">4. Kiểm Tra (Verify)</text><text x="581" y="98" font-size="10" text-anchor="middle" fill="#166534">So sánh Baseline,</text><text x="581" y="114" font-size="10" text-anchor="middle" fill="#166534">Ping, Check Log, rồi</text><text x="581" y="130" font-size="10" text-anchor="middle" fill="#166534">hủy reload cancel</text>

        <rect x="668" y="48" width="152" height="115" rx="6" fill="#fce7f3" stroke="#db2777"/><text x="744" y="75" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#831843">5. Lưu &amp; Cập Nhật</text><text x="744" y="98" font-size="10" text-anchor="middle" fill="#9d174d">Gõ copy run start</text><text x="744" y="114" font-size="10" text-anchor="middle" fill="#9d174d">và cập nhật ngay vào</text><text x="744" y="130" font-size="10" text-anchor="middle" fill="#9d174d">Sơ đồ mạng công ty!</text>
      </svg>
    `,
    sections: [
      {
        heading: "1. Mẹo sinh tồn số 1 khi cấu hình thiết bị ở xa hàng trăm km: Lệnh hẹn giờ `reload in 10`",
        content: "Khi bạn đang ngồi ở TP.HCM và SSH ra một chiếc Router ở Đà Nẵng để sửa bộ lọc bảo mật ACL hoặc đổi địa chỉ IP, chỉ cần bạn gõ nhầm 1 dòng `deny` là kết nối SSH của bạn bị cắt đứt ngay lập tức và không ai ở Đà Nẵng biết cắm dây Console sửa giúp bạn! **Kinh nghiệm xương máu của kỹ sư lâu năm**: Trước khi gõ lệnh nguy hiểm, hãy **KHÔNG lưu cấu hình vào NVRAM** và gõ lệnh **`reload in 10`** (hẹn giờ tự khởi động lại máy sau 10 phút). Sau đó bạn sửa ACL: Nếu chẳng may bạn bị văng mất kết nối, chỉ cần ngồi đợi đúng 10 phút là Router tự khởi động lại bằng file `startup-config` cũ lành lặn trong NVRAM và bạn vào lại được! Còn nếu sửa xong mà mọi thứ vẫn chạy tốt, bạn chỉ cần gõ **`reload cancel`** để hủy hẹn giờ rồi mới gõ `copy running-config startup-config`!"
      },
      {
        heading: "2. Câu hỏi Phỏng vấn #1: 'Hãy kể chi tiết từng bước chuyện gì xảy ra trên mạng từ lúc người dùng gõ `https://google.com` rồi nhấn Enter?'",
        content: "Đây là câu hỏi 'kinh điển của mọi cuộc phỏng vấn mạng' vì chỉ cần 1 câu này nhà tuyển dụng biết ngay bạn có hiểu 7 tầng OSI hay không! **Câu trả lời điểm 10**: 1) **Kiểm tra IP/DHCP**: Máy tính phải có IP, Subnet Mask, Default Gateway và DNS Server (nhận qua 4 bước **DHCP D-O-R-A** trên cổng UDP 67/68). 2) **Phân giải tên miền DNS**: Máy tính kiểm tra bộ nhớ đệm DNS Cache; nếu chưa có sẽ đóng gói tin **DNS Query (UDP Port 53)** hỏi DNS Server xem `google.com` có IP là bao nhiêu. 3) **Tìm địa chỉ MAC của Default Gateway (ARP)**: Vì DNS Server và Google nằm ở khác mạng, máy tính dùng phép toán AND phát hiện đích ở xa nên phát bản tin **ARP Request (Broadcast `FF:FF:FF:FF:FF:FF`)** để xin địa chỉ MAC của cổng LAN Router (Default Gateway). 4) **Định tuyến & Dịch NAT**: Gói tin đi qua Switch (dựa vào bảng CAM) lên Router; Router tra bảng định tuyến (`show ip route`), dịch địa chỉ Private IP của máy tính sang Public IP bằng **NAT Overload (PAT)** rồi đẩy ra nhà mạng ISP. 5) **Bắt tay TCP & Mã hóa TLS**: Khi biết IP của Google, trình duyệt thực hiện **Bắt tay 3 bước TCP (`SYN`, `SYN-ACK`, `ACK`)** tới cổng **TCP 443**, thỏa thuận khóa mã hóa **SSL/TLS**, rồi mới gửi bản tin **`HTTP GET`** tải nội dung trang web về!"
      },
      {
        heading: "3. Câu hỏi Phỏng vấn #2: 'Nhân viên báo máy tính hiện dấu chấm than vàng hoặc nhận địa chỉ IP lạ `169.254.x.x` — Em xử lý thế nào?'",
        content: "**Câu trả lời chuẩn kỹ sư**: Địa chỉ `169.254.x.x/16` là địa chỉ **APIPA (Link-Local)** do hệ điều hành Windows tự sinh ra khi máy tính được để ở chế độ nhận IP tự động nhưng **gửi gói tin DHCP Discover đi mà không nhận được bất kỳ phản hồi nào từ máy chủ DHCP**! Các nguyên nhân và thứ tự kiểm tra: 1) Kiểm tra cổng Switch cắm máy tính đó có bị gán **sai VLAN** không (`show vlan brief`); 2) Kiểm tra đường cáp **Trunk** nối từ Switch đó lên Switch trung tâm/Router có cho phép VLAN đó đi qua không (`show interfaces trunk`); 3) Nếu DHCP Server nằm ở mạng khác, kiểm tra trên cổng LAN của Router đã có lệnh **`ip helper-address <IP-DHCP-Server>`** chưa; 4) Kiểm tra trên DHCP Server xem **bể IP (DHCP Pool) có bị cạn sạch địa chỉ trống** hay không (`show ip dhcp pool`)."
      },
      {
        heading: "4. Câu hỏi Phỏng vấn #3: 'Sự khác biệt giữa Switch Layer 2, Switch Layer 3 và Router là gì? Khi nào dùng Switch Layer 3 thay cho Router?'",
        content: "**Câu trả lời chuẩn kỹ sư**: • **Switch Layer 2**: Chỉ đọc địa chỉ vật lý **MAC** trong khung tin Ethernet và chuyển mạch phần cứng qua chip **ASIC** trong nội bộ cùng một mạng LAN/VLAN. • **Switch Layer 3 (Multilayer Switch)**: Vừa có chip phần cứng **ASIC** giống Switch L2, vừa hiểu được địa chỉ **IP và định tuyến giữa các VLAN (Inter-VLAN Routing qua cổng ảo SVI)** với tốc độ hàng chục triệu gói/giây! Vì vậy ở **lõi mạng nội bộ tòa nhà (Core / Distribution Layer)** nơi có 10–50 VLAN cần trao đổi dữ liệu tốc độ 10Gbps cực lớn với nhau, người ta luôn dùng **Switch Layer 3** thay vì Router-on-a-Stick. • **Router chuyên dụng**: Mặc dù tốc độ cổng thấp hơn Switch L3, nhưng Router bắt buộc phải đứng ở **biên mạng (Edge)** nối ra Internet/WAN vì Router hỗ trợ **NAT/PAT chuyên sâu, đường hầm mã hóa IPsec VPN, Tường lửa ZBFW, QoS nâng cao (Shaping) và giao thức định tuyến toàn cầu BGP**."
      }
    ],
    table: {
      title: "Bộ Cẩm Nang Bắt Bệnh Nhanh 6 Tình Huống Thực Tế Khi Đi Làm & Phỏng Vấn",
      headers: ["Triệu chứng sự cố thực tế", "Nguyên nhân gốc rễ (Root Cause)", "Câu lệnh Kiểm tra (Show)", "Cách khắc phục triệt để"],
      rows: [
        ["Ping được `8.8.8.8` nhưng mở trình duyệt không vào được `google.com`", "Thiếu hoặc sai địa chỉ **DNS Server** trên máy trạm (Tầng 1–3 đã thông suốt 100%)", "`ipconfig /all` & `nslookup google.com`", "Cấu hình DNS `8.8.8.8` / `1.1.1.1` trong DHCP Pool hoặc trên card mạng PC"],
        ["Các máy cùng VLAN trên cùng 1 Switch ping nhau được, nhưng không ping được sang máy cùng VLAN ở Switch bên cạnh", "Cổng nối giữa 2 Switch quên cấu hình **Trunk (`802.1Q`)** hoặc bị lọc mất VLAN đó trong danh sách Allowed VLAN", "`show interfaces trunk`", "Vào cổng Uplink giữa 2 Switch gõ `switchport mode trunk` và `switchport trunk allowed vlan all`"],
        ["Cổng Switch đột nhiên tắt đen thui, gõ `show interfaces status` báo **`err-disabled`**", "Vi phạm bảo mật **Port Security** (cắm máy lạ) hoặc bật **BPDU Guard** mà có ai đó cắm Switch con vào", "`show interfaces status err-disabled` & `show port-security interface ...`", "Tháo thiết bị vi phạm ra, vào cổng đó gõ `shutdown` rồi gõ `no shutdown`"],
        ["Mạng vẫn sáng đèn xanh nhưng cực kỳ chậm, rớt gói liên tục, bộ đếm **`CRC` và `Late Collisions`** tăng vọt", "**Lệch chế độ Song công (Duplex Mismatch)**: Một đầu cáp để `Full-Duplex`, đầu kia để `Half-Duplex`", "`show interfaces fa0/1`", "Đặt cả 2 đầu cáp về `duplex auto` / `speed auto` hoặc khóa cứng `duplex full` ở cả 2 đầu"],
        ["Hai Router nối nhau đã `up/up`, ping thông IP cổng nối, nhưng mãi **không lên láng giềng OSPF (`FULL`)**", "Lệch 1 trong 6 thông số: **Area ID, Hello/Dead Timer, Subnet Mask, Mật khẩu, Stub Flag**, hoặc gõ nhầm `passive-interface` trên cổng nối!", "`show ip ospf interface` & `show ip protocols`", "Đồng bộ lại Area ID, Hello/Dead timer và bỏ `passive-interface` trên cổng nối giữa 2 Router"],
        ["Máy tính trong LAN ping được khắp các phòng ban và ping được IP WAN của Router, nhưng **không ping được ra Internet `8.8.8.8`**", "Router biên thiếu **Default Route (`0.0.0.0/0`)** trỏ ra ISP hoặc quên cấu hình **NAT Overload (`ip nat inside/outside`)**", "`show ip route` & `show ip nat translations`", "Thêm `ip route 0.0.0.0 0.0.0.0 <IP-ISP>` và kiểm tra ACL của câu lệnh `ip nat inside source list ... overload`"]
      ]
    }
  },

  {
    id: 7,
    badge: "MỚI NHẤT • ĐỀ THI CCNA 200-301 v2.0 & v1.1 (AI, TERRAFORM & STP GUARDS)",
    title_vi: "Chuyên Đề 7: Toàn Cảnh Kỳ Thi Mới CCNA 200-301 v2.0 & v1.1 — AI Tạo Sinh / Agentic AI, Prompt Engineering, Terraform IaC, Root Guard / Loop Guard & Xác Thực REST API",
    summary_vi: "Tổng hợp 100% các chủ đề mới nhất vừa được Cisco đưa vào khung đề thi CCNA 200-301 v1.1 và phiên bản nâng cấp lớn CCNA 200-301 v2.0: Cấu trúc 5 Domain mới của v2.0, ứng dụng Generative AI / Predictive AI / Agentic AI trong vận hành mạng (AIOps), kỹ thuật viết Prompt an toàn, công cụ Hạ tầng bằng Mã lệnh Terraform (IaC), bộ tứ bảo vệ Spanning Tree (Root Guard, Loop Guard, BPDU Guard, BPDU Filter) và các phương thức xác thực REST API.",
    svg: `
      <svg viewBox="0 0 860 265" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="860" height="265" rx="10" fill="#f0f9ff" stroke="#bae6fd" stroke-width="2"/>
        <text x="20" y="28" font-size="13.5" font-weight="bold" fill="#0369a1">BẢN ĐỒ SO SÁNH KHUNG ĐỀ THI CISCO CCNA 200-301 (v1.1 HIỆN TẠI VS. v2.0 THẾ HỆ MỚI AI-ERA)</text>

        <!-- Left Box: v1.1 vs v2.0 Domains -->
        <rect x="20" y="42" width="405" height="205" rx="8" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
        <text x="35" y="64" font-size="12" font-weight="bold" fill="#0f172a">1. Cấu trúc 5 Domains Mới của CCNA 200-301 v2.0:</text>
        <text x="35" y="86" font-size="11" fill="#0369a1" font-weight="bold">• Domain 1.0: Network Infrastructure &amp; Connectivity (25%)</text>
        <text x="35" y="106" font-size="11" fill="#0369a1" font-weight="bold">• Domain 2.0: Switching and Network Access (25%)</text>
        <text x="35" y="126" font-size="11" fill="#0284c7" font-weight="bold">• Domain 3.0: IP Routing — Static &amp; OSPFv2 (20%)</text>
        <text x="35" y="146" font-size="11" fill="#0284c7" font-weight="bold">• Domain 4.0: Network Services &amp; Security (20%)</text>
        <text x="35" y="166" font-size="11" fill="#d97706" font-weight="bold">• Domain 5.0: AI, &amp; Network Operations and Mgmt (10%)</text>
        <rect x="32" y="180" width="380" height="55" rx="6" fill="#fef3c7" stroke="#f59e0b"/>
        <text x="42" y="198" font-size="10.5" font-weight="bold" fill="#92400e">🔥 Thay đổi cốt lõi ở v2.0: Chuyển từ 'Học thuộc định nghĩa'</text>
        <text x="42" y="214" font-size="10.5" fill="#78350f">sang 'Chẩn đoán &amp; Xử lý sự cố thực chiến' (Troubleshoot, Diagnose,</text>
        <text x="42" y="229" font-size="10.5" fill="#78350f">Interpret &amp; Validate) kết hợp Trợ lý AI (Agentic AI / Prompting)!</text>

        <!-- Right Box: STP Guards & AI/Terraform -->
        <rect x="440" y="42" width="400" height="205" rx="8" fill="#ffffff" stroke="#16a34a" stroke-width="1.5"/>
        <text x="455" y="64" font-size="12" font-weight="bold" fill="#14532d">2. Bộ Tứ Bảo Vệ STP &amp; Công Nghệ Mới Bắt Buộc Nhớ:</text>
        <text x="455" y="86" font-size="11" fill="#15803d">• BPDU Guard: Nhận BPDU trên cổng PortFast → Tắt cổng (err-disabled)</text>
        <text x="455" y="106" font-size="11" fill="#15803d">• Root Guard: Chặn Switch lạ cướp Root → Đưa vào root-inconsistent</text>
        <text x="455" y="126" font-size="11" fill="#15803d">• Loop Guard: Đứt 1 chiều sợi quang → Đưa vào loop-inconsistent</text>
        <text x="455" y="146" font-size="11" fill="#15803d">• BPDU Filter: Ngừng gửi/nhận BPDU trên cổng chỉ định</text>
        <line x1="455" y1="158" x2="825" y2="158" stroke="#cbd5e1" stroke-width="1"/>
        <text x="455" y="178" font-size="11" font-weight="bold" fill="#0369a1">• Terraform (IaC): Ngôn ngữ HCL, Declarative, quản lý file .tfstate</text>
        <text x="455" y="198" font-size="11" font-weight="bold" fill="#7c3aed">• Generative AI vs. Predictive AI vs. Agentic AI (AIOps)</text>
        <text x="455" y="218" font-size="11" font-weight="bold" fill="#b45309">• REST API Auth: Basic Auth (Base64) | API Key | Bearer Token (OAuth2)</text>
      </svg>
    `,
    sections: [
      {
        heading: "1. Sự dịch chuyển từ CCNA 200-301 v1.1 sang CCNA 200-301 v2.0: Bạn cần chuẩn bị gì?",
        content: "• **Lộ trình áp dụng**: Phiên bản **v1.1** và phiên bản nâng cấp **v2.0** giữ nguyên mã môn thi là **200-301** (120 phút). Điểm thay đổi lớn nhất của **CCNA v2.0** là gom 6 Domain cũ thành **5 Domain trọng tâm** và thay đổi động từ đánh giá từ *Describe / Explain (Mô tả / Giải thích)* sang **`Troubleshoot / Diagnose / Interpret / Validate` (Bắt bệnh, Chẩn đoán log, Đọc hiểu kết quả `show` và Kiểm chứng cấu hình)**. • **Giảm tải phần cấu hình giao diện WLC truyền thống**: Thay vì hỏi sâu từng nút bấm trên giao diện Web GUI của bộ điều khiển Cisco WLC 2504 cũ, đề thi mới tập trung vào **nguyên lý sóng vô tuyến RF, quy hoạch kênh 2.4GHz/5GHz/6GHz (Wi-Fi 6/6E/7), bảo mật WPA3 SAE/OWE và xử lý sự cố máy trạm không kết nối được Wi-Fi**."
      },
      {
        heading: "2. Trí Tuệ Nhân Tạo Trong Vận Hành Mạng (Domain 5.0 v2.0 / Domain 6.0 v1.1): Generative AI, Predictive AI & Agentic AI",
        content: "Đề thi CCNA mới yêu cầu kỹ sư mạng phân biệt rõ 3 khái niệm AI ứng dụng trong hạ tầng mạng (**AIOps**): • **1) Generative AI (AI Tạo sinh — dựa trên mô hình ngôn ngữ lớn LLM)**: Giúp kỹ sư mạng **soạn thảo nhanh đoạn lệnh cấu hình CLI / Ansible Playbook / Python script**, dịch các dòng nhật ký lỗi `Syslog` phức tạp sang ngôn ngữ tự nhiên dễ hiểu, hoặc tóm tắt tài liệu kỹ thuật. • **2) Predictive AI & Machine Learning (AI Dự đoán & Học máy)**: Thu thập dữ liệu **Telemetry** liên tục từ hàng ngàn Switch/Router để học thói quen lưu lượng bình thường (**Baseline**), từ đó **phát hiện sớm bất thường (Anomaly Detection)** và **dự đoán trước nguy cơ nghẽn băng thông hoặc hỏng ổ cứng/quạt nguồn trước khi sự cố xảy ra**. • **3) Agentic AI & Digital Network Assistants (Trợ lý AI Tác tử trong CCNA v2.0)**: Thế hệ AI không chỉ trả lời câu hỏi mà có khả năng **tự lập kế hoạch nhiều bước** (tự động chạy các lệnh `show ip route`, `show ip ospf neighbor`, đối chiếu log để tìm nguyên nhân gốc rễ Root Cause và đề xuất lệnh sửa lỗi cho kỹ sư phê duyệt — *Human-in-the-Loop*)."
      },
      {
        heading: "3. Kỹ Thuật Viết Prompt (Prompt Engineering) & Quy Tắc Bảo Mật Sống Còn Khi Dùng AI Cho Kỹ Sư Mạng",
        content: "Trong kỳ thi CCNA v2.0, thí sinh được đánh giá kỹ năng **xây dựng câu lệnh Prompt hiệu quả** và **kiểm chứng đầu ra của AI (Validating AI Output)**: • **Công thức 4 phần của một Prompt mạng chuẩn**: 1) **Bối cảnh & Sơ đồ (Context/Role)**: *'Đóng vai kỹ sư CCNA, tôi có 2 Router Cisco IOS XE nối qua cổng Gi0/0/0 chạy OSPFv2 Area 0'*; 2) **Dữ liệu đầu vào (Input Data)**: Dán kết quả lệnh `show ip ospf interface` và dòng báo lỗi Syslog; 3) **Yêu cầu cụ thể (Task)**: *'Hãy chỉ ra nguyên nhân vì sao trạng thái kẹt ở EXSTART/INIT'*; 4) **Ràng buộc (Constraints)**: *'Chỉ đưa ra lệnh chuẩn Cisco IOS-XE và giải thích từng dòng'*. • **⚠️ QUY TẮC BẢO MẬT SỐ 1 (Data Sanitization) RẤT HAY RA THI**: Trước khi dán file cấu hình `running-config` lên bất kỳ công cụ Generative AI công cộng nào, kỹ sư **BẮT BUỘC phải xóa/ẩn (Sanitize/Redact)** toàn bộ thông tin nhạy cảm của công ty gồm: **Mật khẩu (`enable secret`, `password`), chuỗi khóa `SNMP Community`, khóa bí mật `IPsec Pre-Shared Key / Private Key`, Token API và Địa chỉ IP Public thật của doanh nghiệp**! Đồng thời không bao giờ copy-paste thẳng lệnh AI sinh ra vào mạng thật mà không kiểm tra lại vì AI có thể mắc hiện tượng **Ảo giác (Hallucination - tự bịa ra câu lệnh CLI không tồn tại)**."
      },
      {
        heading: "4. Giải Phẫu Bộ Tứ Bảo Vệ Spanning Tree Mới (Root Guard vs. Loop Guard vs. BPDU Guard vs. BPDU Filter)",
        content: "Đây là phần kiến thức cực kỳ quan trọng mới được bổ sung vào đề thi: • **1) BPDU Guard (`spanning-tree bpduguard enable`)**: Bật trên các cổng Access cắm máy tính (`PortFast`). Nếu có người lén cắm một chiếc Switch vào cổng này (làm xuất hiện gói tin BPDU), cổng sẽ lập tức bị **khóa sập hoàn toàn sang trạng thái `err-disabled`**! • **2) Root Guard (`spanning-tree guard root`)**: Bật trên các cổng **Designated Port (DP)** của Switch phân phối nối xuống các Switch tầng dưới để **bảo vệ ngôi vị của chiếc Root Bridge hiện tại**. Nếu một Switch ở dưới gửi lên gói tin **Superior BPDU** (có Priority nhỏ hơn đòi cướp quyền làm Root Bridge), Root Guard sẽ chặn ngay và đưa cổng đó vào trạng thái **`root-inconsistent` (Tương đương Blocking)**. Điểm đặc biệt: Khi Switch kia ngừng gửi Superior BPDU, cổng `root-inconsistent` sẽ **TỰ ĐỘNG MỞ LẠI bình thường mà không cần kỹ sư gõ `shutdown / no shutdown`**! • **3) Loop Guard (`spanning-tree guard loop`)**: Bật trên các cổng **Root Port (RP) hoặc Alternate/Blocked Port** (đặc biệt trên đường cáp quang 2 sợi Thu/Phát). Nếu sợi quang chiều nhận bị đứt (**Unidirectional Link Failure**), cổng đang bị khóa `Blocked` đột nhiên không nhận được BPDU nữa; nếu không có Loop Guard, sau 20s nó sẽ tưởng đường chính bị đứt và tự mở sang `Forwarding` gây bão **Loop sập mạng**! Loop Guard sẽ phát hiện việc mất BPDU đột ngột và giữ chặt cổng ở trạng thái **`loop-inconsistent`** để chống lặp. • **4) BPDU Filter (`spanning-tree bpdufilter enable`)**: Ngăn cổng gửi và nhận khung tin BPDU (cần dùng cực kỳ cẩn trọng vì nếu bật cứng cấp độ cổng sẽ làm mất khả năng phát hiện vòng lặp)."
      },
      {
        heading: "5. Công Cụ Hạ Tầng Bằng Mã Lệnh Terraform (IaC) & Các Cơ Chế Xác Thực REST API",
        content: "• **Terraform vs. Ansible**: Trong khi **Ansible** mạnh về **Quản lý cấu hình (Configuration Management)** theo kiểu *Procedural (thực thi tuần tự các bước trong YAML Playbook qua SSH)*, thì **Terraform (của HashiCorp)** là công cụ **Infrastructure as Code (IaC)** chuyên dùng để **Khởi tạo hạ tầng đám mây & mạng (Provisioning)** theo lối **Declarative (Khai báo trạng thái đích mong muốn bằng ngôn ngữ HCL - HashiCorp Configuration Language)**. Terraform lưu giữ bức tranh hiện trạng hạ tầng trong file **`terraform.tfstate`**, đảm bảo tính **Idempotency (Tính lũy đẳng — chạy lệnh 1 lần hay 10 lần đều ra đúng 1 kết quả hạ tầng như nhau, chỉ sửa đúng phần bị lệch Configuration Drift)**. • **3 Phương thức Xác thực REST API cần nhớ khi đi thi**: 1) **Basic Authentication**: Gửi kèm `username:password` được mã hóa **Base64** trong Header `Authorization: Basic ...` (Base64 chỉ là mã hóa ký tự chứ không phải mã hóa bảo mật nên bắt buộc phải đi qua HTTPS/TLS!); 2) **API Key**: Gửi một chuỗi khóa tĩnh định danh ứng dụng trong Header (ví dụ `X-Cisco-Meraki-API-Key`); 3) **Token-Based / Bearer Token (OAuth 2.0 / JWT)**: Đăng nhập lần đầu để lấy một chiếc vé **Access Token có thời hạn ngắn**, sau đó gắn vào Header `Authorization: Bearer <token>` cho các lệnh `GET/POST/PUT/DELETE` tiếp theo."
      }
    ],
    table: {
      title: "Bảng Phân Biệt Nhanh Bộ Tứ Bảo Vệ Spanning Tree (STP Guards) & Công Cụ Tự Động Hóa Mới",
      headers: ["Tính năng / Công cụ", "Vị trí triển khai", "Sự kiện kích hoạt", "Trạng thái cổng khi kích hoạt & Cách khôi phục"],
      rows: [
        ["**BPDU Guard**", "Cổng Access cắm PC có bật **PortFast**", "Nhận được bất kỳ khung tin **BPDU** nào đi vào cổng", "Rơi vào **`err-disabled`** (Tắt hẳn cổng) → Phải gõ `shutdown` / `no shutdown` hoặc bật `errdisable recovery`"],
        ["**Root Guard**", "Cổng **Designated Port** hướng xuống Switch cấp dưới", "Nhận được **Superior BPDU** (đòi cướp ngôi Root Bridge)", "Rơi vào **`root-inconsistent`** (Chặn lưu lượng) → **Tự động khôi phục** ngay khi ngừng nhận Superior BPDU!"],
        ["**Loop Guard**", "Cổng **Root Port / Alternate Blocked Port** (Cáp quang)", "Đột ngột **ngừng nhận được BPDU** trên cổng đang Blocked (Lỗi đứt 1 chiều sợi quang)", "Rơi vào **`loop-inconsistent`** (Giữ nguyên khóa để chống Loop)"],
        ["**Terraform (IaC)**", "Đám mây (AWS/Azure) & Hạ tầng mạng đa hãng", "Khai báo trạng thái đích bằng ngôn ngữ **HCL (`.tf`)**", "Đối chiếu với file **`terraform.tfstate`** (`terraform plan` → `terraform apply`) — Đảm bảo tính **Declarative & Idempotent**"]
      ]
    }
  },

  {
    id: 8,
    badge: "THỰC TẾ LẮP ĐẶT PHẦN CỨNG • ĐA GÓC ĐỘ & CẬN CẢNH CỔNG PORT",
    title_vi: "Chuyên Đề 8: Giải Phẫu Đa Góc Độ Thiết Bị Mạng Thực Tế (Mặt Trước, Mặt Sau, Cận Cảnh Từng Cổng Port) & Sơ Đồ Đấu Cáp Chuẩn Tủ Rack",
    summary_vi: "Dành cho người mới học muốn nhìn tận mắt và hình dung rõ ràng khi cầm thiết bị thật ngoài đời: Phân biệt mặt trước (Front Panel), mặt sau (Rear Panel), cận cảnh từng loại cổng cắm (RJ-45 Copper, SFP/SFP+ Fiber, Console RJ-45 & USB-C, Patch Panel 110 IDC, Serial WAN), ý nghĩa từng màu đèn LED và sơ đồ đấu nối từ bàn làm việc nhân viên về tủ Rack phòng Server.",
    svg: `
      <svg viewBox="0 0 860 360" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="860" height="360" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
        <text x="20" y="26" font-size="13.5" font-weight="bold" fill="#0f172a">GIẢI PHẪU ĐA GÓC ĐỘ (MẶT TRƯỚC + MẶT SAU + CẬN CẢNH CHÂN PORT) KHI LẮP ĐẶT TỦ RACK THỰC TẾ</text>

        <!-- 1. SWITCH FRONT PANEL -->
        <rect x="20" y="40" width="820" height="92" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>
        <text x="35" y="60" font-size="11.5" font-weight="bold" fill="#38bdf8">GÓC 1 — MẶT TRƯỚC SWITCH CISCO CATALYST 2960/9200 (24 Cổng Đồng RJ-45 PoE+ &amp; 4 Khe Quang SFP+ Uplink)</text>
        <!-- LED block -->
        <rect x="35" y="70" width="95" height="50" rx="4" fill="#0f172a" stroke="#64748b"/>
        <circle cx="50" cy="83" r="4" fill="#22c55e"/><text x="60" y="87" font-size="9" fill="#e2e8f0">SYST (Nguồn)</text>
        <circle cx="50" cy="98" r="4" fill="#22c55e"/><text x="60" y="102" font-size="9" fill="#e2e8f0">STAT (Trạng thái)</text>
        <circle cx="50" cy="113" r="4" fill="#f59e0b"/><text x="60" y="117" font-size="9" fill="#fde047">PoE (Cấp điện)</text>

        <!-- 12x2 RJ45 Ports -->
        <g transform="translate(145, 68)">
          <rect x="0" y="0" width="430" height="52" rx="4" fill="#334155" stroke="#94a3b8"/>
          <text x="215" y="22" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#4ade80">🟢 24 CỔNG ACCESS RJ-45 (Fa0/1..24 hoặc Gi1/0/1..24)</text>
          <text x="215" y="40" font-size="9.5" text-anchor="middle" fill="#e2e8f0">Cắm dây nhảy Patch Cord nối lên Patch Panel (Đi ra PC, IP Phone, Wi-Fi AP)</text>
        </g>

        <!-- 4 SFP Uplinks -->
        <g transform="translate(590, 68)">
          <rect x="0" y="0" width="235" height="52" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="117" y="22" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#38bdf8">🔵 4 KHE MODULE QUANG SFP/SFP+</text>
          <text x="117" y="40" font-size="9.5" text-anchor="middle" fill="#bae6fd">Cổng Gi0/1..4 (TRUNK nối lên Core/Router)</text>
        </g>

        <!-- 2. ROUTER REAR PANEL (BACK VIEW) -->
        <rect x="20" y="144" width="820" height="96" rx="8" fill="#0f172a" stroke="#0284c7" stroke-width="2"/>
        <text x="35" y="164" font-size="11.5" font-weight="bold" fill="#fde047">GÓC 2 — MẶT SAU ROUTER CISCO ISR 4321 / 2911 (Nơi tập trung toàn bộ các cổng cắm điều khiển &amp; WAN/LAN)</text>

        <rect x="35" y="175" width="130" height="52" rx="4" fill="#1e293b" stroke="#94a3b8"/>
        <text x="100" y="196" font-size="10" font-weight="bold" text-anchor="middle" fill="#f8fafc">🔌 Nguồn AC &amp; Công tắc</text>
        <text x="100" y="214" font-size="9" text-anchor="middle" fill="#cbd5e1">100-240V + Dây tiếp địa</text>

        <rect x="178" y="175" width="165" height="52" rx="4" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="260" y="195" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#7dd3fc">🩵 CỔNG CONSOLE (Viền Xanh)</text>
        <text x="260" y="213" font-size="9" text-anchor="middle" fill="#e0f2fe">RJ-45 + USB Mini-B (9600 bps)</text>

        <rect x="356" y="175" width="140" height="52" rx="4" fill="#1e293b" stroke="#64748b"/>
        <text x="426" y="195" font-size="10" font-weight="bold" text-anchor="middle" fill="#cbd5e1">🖤 CỔNG AUX / MGMT</text>
        <text x="426" y="213" font-size="9" text-anchor="middle" fill="#94a3b8">Quản trị Out-of-Band</text>

        <rect x="508" y="175" width="165" height="52" rx="4" fill="#14532d" stroke="#22c55e" stroke-width="1.5"/>
        <text x="590" y="195" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#86efac">🟡 CỔNG Gi0/0/0 &amp; Gi0/0/1</text>
        <text x="590" y="213" font-size="9" text-anchor="middle" fill="#dcfce7">Nối xuống Switch LAN &amp; Modem ISP</text>

        <rect x="685" y="175" width="140" height="52" rx="4" fill="#3b0764" stroke="#c084fc" stroke-width="1.5"/>
        <text x="755" y="195" font-size="10" font-weight="bold" text-anchor="middle" fill="#e9d5ff">🟣 KHE NIM / HWIC</text>
        <text x="755" y="213" font-size="9" text-anchor="middle" fill="#f3e8ff">Gắn thêm cổng Serial / Quang</text>

        <!-- 3. REAL-LIFE WIRING CHAIN -->
        <rect x="20" y="252" width="820" height="94" rx="8" fill="#ffffff" stroke="#16a34a" stroke-width="1.5"/>
        <text x="35" y="273" font-size="11.5" font-weight="bold" fill="#15803d">GÓC 3 — QUY TRÌNH ĐẤU NỐI DÂY THỰC TẾ TRONG TÒA NHÀ (TỪ BÀN LÀM VIỆC VỀ TỦ RACK PHÒNG SERVER):</text>
        <text x="35" y="296" font-size="11" fill="#0f172a">💻 [Card mạng PC] ──(Dây nhảy 1.5m)──► 🧱 [Ổ cắm âm tường Wallplate] ──(Cáp Cat6 âm tường 40m)──► 🔩 [Mặt sau Patch Panel (Bắn dao nhấn Krone)]</text>
        <text x="35" y="318" font-size="11" fill="#0369a1" font-weight="bold">──► [Mặt trước Patch Panel] ──(Dây nhảy Patch Cord ngắn 0.5m)──► 🔀 [Cổng Access Switch] ──(Cáp Quang SFP+ LC Trunk)──► 🌐 [Router / Firewall]</text>
        <text x="35" y="337" font-size="10.5" fill="#b45309">💡 Tại sao không bấm đầu RJ-45 vào cáp âm tường rồi cắm thẳng vào Switch? Vì cáp âm tường cứng, rút ra cắm vào nhiều lần sẽ gãy lẫy cổng Switch đắt tiền!</text>
      </svg>
    `,
    sections: [
      {
        heading: "1. Cách nhìn và phân biệt ngay mọi loại Cổng (Port) trên Switch & Router ngoài đời thực",
        content: "Khi đứng trước một tủ mạng (Server Rack) ngoài đời thực, bạn hãy nhìn vào **màu sắc viền cổng và hình dáng lỗ cắm** để nhận diện ngay lập tức không bao giờ cắm nhầm: • **1) Cổng Console RJ-45 (Viền màu Xanh Ngọc Lam - Light Blue và có chữ `CONSOLE`)**: Tuyệt đối KHÔNG phải cổng mạng Ethernet! Cổng này dùng để cắm dây cáp Console nối vào Laptop kỹ sư (chạy Putty/TeraTerm tốc độ `9600 bps`) khi mới mua thiết bị về. На các dòng Switch/Router đời mới còn có thêm **lỗ cắm Console chuẩn USB Mini-B hoặc USB Type-C** nằm ngay cạnh. • **2) Cổng Ethernet Đồng RJ-45 (Viền màu Vàng trên Router hoặc đánh số 1–24/48 trên Switch)**: Có 8 chân đồng mạ vàng bên trong; dùng để cắm đầu hạt mạng **RJ-45 (8P8C)** của cáp xoắn đôi Cat5e/Cat6. • **3) Khe cắm Module Quang SFP / SFP+ (Hình chữ nhật rỗng bằng kim loại)**: Khi mới xuất xưởng, khe này là một hốc kim loại trống rỗng! Muốn cắm dây cáp quang vào, bạn phải cầm cục **Module quang SFP (1Gbps) hoặc SFP+ (10Gbps)** trượt vào khe này cho đến khi nghe tiếng *'tách'*, sau đó mới cắm cặp đầu dây nhảy quang **LC Duplex (1 sợi Thu RX + 1 sợi Phát TX)** vào lỗ của cục SFP!"
      },
      {
        heading: "2. Giải mã ý nghĩa Đèn LED báo hiệu trên cổng Switch Cisco Catalyst khi đi làm",
        content: "Chỉ cần nhìn đèn LED phía trên mỗi cổng RJ-45 của Switch Cisco, kỹ sư có kinh nghiệm biết ngay cổng đó đang chạy tốt hay đang bị lỗi gì: • **Đèn Xanh Lá Cây đứng im (Solid Green)**: Cáp đã kết nối vật lý tốt (`up/up`), hiện không có dữ liệu truyền qua. • **Đèn Xanh Lá Cây nhấp nháy liên tục (Blinking Green)**: Cổng đang truyền nhận dữ liệu bình thường. • **Đèn Cam / Hổ Phách đứng im (Solid Amber - khoảng 30 giây đầu khi mới cắm cáp)**: Giao thức **Spanning Tree (STP)** đang kiểm tra vòng lặp (*Listening / Learning*), hoặc cổng đang bị STP khóa làm cổng dự phòng (**Alternate Blocked Port**) để chống Loop! • **Đèn Cam nhấp nháy hoặc Đỏ (Blinking Amber) / Tắt ngúm dù đã cắm dây**: Cổng đang bị lỗi phần cứng, sai cáp, hoặc bị khóa bảo mật **`err-disabled`** do vi phạm **Port Security / BPDU Guard**! • **Nút bấm `MODE` bên góc trái mặt trước Switch**: Khi bạn nhấn nút `MODE` từng nhịp, dàn đèn LED trên các cổng sẽ lần lượt chuyển sang báo: *Tốc độ cổng (`STAT`)* → *Chế độ Song công (`DUPLX`)* → *Trạng thái cấp nguồn qua cáp mạng (`PoE`)!"
      },
      {
        heading: "3. Thanh Đấu Nối Cáp Patch Panel là gì? Tại sao mọi tủ Rack doanh nghiệp đều phải có Patch Panel?",
        content: "Người mới học trên Packet Tracer chỉ thấy nối thẳng sợi dây từ PC vào Switch, nhưng **trong thực tế đi làm không ai làm vậy cả**! • Ở văn phòng thật, dây cáp mạng Cat6 chạy âm trong tường, trên trần thạch cao từ bàn nhân viên về phòng Server dài 30–80 mét là loại **cáp lõi đồng đặc (Solid Core)** rất cứng. • Đầu cáp âm tường này được bấm cố định bằng **Dao nhấn mạng (Punch-down Tool)** vào các khe kim loại **110 IDC ở MẶT SAU của thanh Patch Panel** (thanh sắt đen gắn cố định trên tủ Rack có đánh số thứ tự cổng `01` đến `24` tương ứng với từng bàn làm việc). • Còn ở **MẶT TRƯỚC của thanh Patch Panel** là 24 lỗ cắm RJ-45 cái; từ đây kỹ sư dùng các sợi **Dây nhảy (Patch Cord) lõi mềm ngắn 0.5m – 1m** cắm nối xuống các cổng của Switch nằm ngay tầng dưới! Nhờ có Patch Panel, khi muốn đổi cổng hoặc kiểm tra đường dây của bàn nhân viên nào, kỹ sư chỉ cần rút cắm sợi dây nhảy ngắn trên Patch Panel mà không bao giờ làm đứt gãy sợi cáp chạy ngầm trong tường!"
      }
    ],
    table: {
      title: "Bảng Tra Cứu Nhanh Các Loại Đầu Bấm, Cổng Cắm & Dây Cáp Thực Tế Khi Thi Công Tủ Rack",
      headers: ["Tên Cổng / Đầu Cắm", "Hình Dáng & Đặc Điểm Nhận Diện", "Loại Dây Cáp Đi Kèm", "Ứng Dụng Thực Tế Trong Tủ Mạng"],
      rows: [
        ["**Hạt mạng RJ-45 (8P8C)**", "Đầu nhựa trong suốt có **8 chân đồng** xếp ngang và lẫy gài chống tuột", "Cáp đồng xoắn đôi **UTP / STP (Cat5e, Cat6, Cat6A)**", "Cắm vào cổng LAN máy tính, IP Phone, Wi-Fi AP, Patch Panel, cổng Access Switch"],
        ["**Đầu quang LC Duplex**", "Đầu vuông nhỏ gọn (bằng nửa đầu RJ-45), thường đi theo **cặp 2 sợi (TX/RX)**", "Dây nhảy quang **OM3/OM4 (Màu Xanh Ngọc - Đa mốt)** hoặc **OS2 (Màu Vàng - Đơn mốt)**", "Cắm trực tiếp vào **Module quang SFP / SFP+ / QSFP** trên Switch/Router đời mới"],
        ["**Đầu quang SC / ST**", "**SC**: Đầu vuông to rút-đẩy; **ST**: Đầu tròn kim loại vặn khớp gài lưỡi lê", "Cáp quang Single-mode / Multimode", "Thường gặp trên hộp phối quang **ODF** hoặc Modem quang GPON của nhà mạng ISP"],
        ["**Cổng Console (RJ-45 / USB)**", "Viền màu **Xanh Ngọc (Cyan)** ở mặt sau Router/Switch; hoặc lỗ **USB Mini-B / USB-C**", "Cáp **Rollover (Chân 1↔8)** + đầu chuyển USB-to-Serial (COM Port)", "Dùng để cấu hình thiết bị lần đầu tiên qua phần mềm **PuTTY / SecureCRT (9600-8-N-1)**"]
      ]
    },
    photos: [
      {
        url: "images/switch_ports_closeup.jpg",
        title_vi: "Góc Cận Cảnh: Dãy Cổng Đồng RJ-45 & Đèn LED Trạng Thái Trên Mặt Trước Switch",
        desc_vi: "Nhìn rõ từng lỗ cắm RJ-45 và đèn LED báo Link/Activity. Khi cắm hạt mạng vào phải nghe tiếng 'tách' của lẫy nhựa và đèn LED chuyển sang sáng xanh."
      },
      {
        url: "images/router_rear_ports.jpg",
        title_vi: "Góc Mặt Sau (Rear Panel): Các Cổng Kết Nối WAN, LAN, Console, AUX & Nguồn Trên Router Cisco",
        desc_vi: "Toàn cảnh mặt sau của một chiếc Router Cisco thực tế với các cổng giao tiếp vật lý, công tắc nguồn và khe cắm mở rộng."
      },
      {
        url: "images/patch_panel_ports.jpg",
        title_vi: "Góc Mặt Trước & Mặt Sau: Thanh Đấu Nối Cáp Patch Panel 24-Port Chuẩn Tủ Rack 19-Inch",
        desc_vi: "Cáp âm tường từ các phòng ban được bắn cố định vào mặt sau Patch Panel, mặt trước dùng dây nhảy ngắn nối xuống Switch."
      },
      {
        url: "images/rj45_connector_pins.jpg",
        title_vi: "Góc Phóng Đại Cận Cảnh: 8 Chân Đồng (Pin 1 → Pin 8) Của Đầu Hạt Mạng & Ổ Cắm RJ-45 (8P8C)",
        desc_vi: "Cấu tạo cơ khí và 8 lá đồng mạ vàng bên trong đầu bấm RJ-45 đực và ổ cắm RJ-45 cái."
      },
      {
        url: "images/fiber_lc_sc_ports.jpg",
        title_vi: "Góc Cận Cảnh: Đầu Nối Cáp Quang Chuẩn LC Duplex (Nhỏ) & Chuẩn SC (Vuông)",
        desc_vi: "Đầu LC cắm trực tiếp vào Module quang SFP/SFP+ trên Switch/Router; đầu SC cắm vào hộp phối quang ODF."
      },
      {
        url: "images/sfp_module.jpg",
        title_vi: "Góc Cận Cảnh: Module Quang SFP / SFP+ (Transceiver) Để Gắn Vào Khe Uplink Của Switch/Router",
        desc_vi: "Module chuyển đổi tín hiệu điện sang tia laser quang học, có thể cắm nóng (Hot-swappable) vào khe SFP."
      },
      {
        url: "images/poe_switch_ports.jpg",
        title_vi: "Góc Nhìn Nội Thất Bo Mạch: Chip Chuyển Mạch Phần Cứng ASIC Ngay Phía Sau Dãy Cổng Switch Cisco 2960-S",
        desc_vi: "Bên trong nắp máy Switch Cisco Catalyst 2960-S: Con chip Broadcom ASIC xử lý chuyển mạch khung tin ở tốc độ dây (Wire-speed)."
      },
      {
        url: "images/rack_rear_cabling.jpg",
        title_vi: "Góc Nhìn Phía Sau Tủ Mạng: Hệ Thống Đấu Nối Cáp Mạng Mật Độ Cao Thực Tế",
        desc_vi: "Hình ảnh thực tế phía sau thanh đấu nối cáp trong phòng máy chủ (Server Room) khi triển khai hệ thống mạng lớn."
      }
    ]
  },

  {
    id: 9,
    badge: "ĐA HÃNG THỰC TẾ • ARUBA WEB GUI, MIKROTIK, DRAYTEK, FORTIGATE & UNIFI",
    title_vi: "Chuyên Đề 9: Quản Trị Thiết Bị Mạng Đa Hãng Thực Tế (Không Rập Khuôn CLI Cisco) — Switch HPE Aruba (Web GUI / Cloud), Router MikroTik / DrayTek / FortiGate & Từ Điển Quy Đổi Thuật Ngữ",
    summary_vi: "Giúp bạn thoát khỏi sự rập khuôn 'chỉ biết mỗi dòng lệnh CLI của Cisco': Thực tế đi làm tại các công ty, tòa nhà, chuỗi bán lẻ, nhà máy ở Việt Nam sử dụng rất nhiều Switch HPE Aruba (quản lý bằng Giao diện Web GUI hoặc Aruba Instant On Cloud), Switch TP-Link Omada / Cisco Business, Router MikroTik (WinBox/WebFig), DrayTek Vigor, Firewall FortiGate và Wi-Fi Ubiquiti UniFi. Chuyên đề này hướng dẫn bạn cách cấu hình qua giao diện Web và bảng dịch thuật ngữ sống còn giữa các hãng!",
    svg: `
      <svg viewBox="0 0 860 285" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="860" height="285" rx="10" fill="#f8fafc" stroke="#bae6fd" stroke-width="2"/>
        <text x="20" y="26" font-size="13.5" font-weight="bold" fill="#0369a1">🖥️ MÔ PHỎNG GIAO DIỆN QUẢN TRỊ WEB GUI CỦA SWITCH HPE ARUBA / SMART MANAGED SWITCH NGOÀI ĐỜI THỰC</text>

        <!-- Web Browser Frame -->
        <rect x="20" y="38" width="820" height="232" rx="8" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
        <rect x="20" y="38" width="820" height="32" rx="8" fill="#0f172a"/>
        <circle cx="38" cy="54" r="5" fill="#ef4444"/><circle cx="54" cy="54" r="5" fill="#f59e0b"/><circle cx="70" cy="54" r="5" fill="#22c55e"/>
        <text x="95" y="58" font-size="11" font-weight="bold" fill="#38bdf8">🔒 https://192.168.1.250 — HPE Aruba Switch Web Management Portal (VLAN &amp; PoE Matrix)</text>

        <!-- Left Menu in Web GUI -->
        <rect x="20" y="70" width="160" height="200" fill="#f1f5f9" stroke="#e2e8f0"/>
        <text x="32" y="94" font-size="10.5" font-weight="bold" fill="#0f172a">📊 System Dashboard</text>
        <rect x="26" y="104" width="148" height="24" rx="4" fill="#0284c7"/>
        <text x="34" y="120" font-size="10.5" font-weight="bold" fill="#ffffff">🏷️ VLAN Configuration</text>
        <text x="32" y="144" font-size="10.5" fill="#334155">🔌 Port &amp; PoE Power</text>
        <text x="32" y="166" font-size="10.5" fill="#334155">🔗 Trunk / LACP (Trk1)</text>
        <text x="32" y="188" font-size="10.5" fill="#334155">🛡️ Loop Protection</text>
        <text x="32" y="210" font-size="10.5" fill="#334155">☁️ Cloud / Firmware</text>

        <!-- VLAN Untagged / Tagged Matrix in Web GUI -->
        <text x="195" y="92" font-size="11.5" font-weight="bold" fill="#0f172a">Bảng Ma Trận Gán VLAN Trên Web GUI (Click chuột chọn U = Untagged | T = Tagged | E = Exclude):</text>

        <!-- Table Header -->
        <rect x="195" y="102" width="630" height="26" rx="4" fill="#e0f2fe"/>
        <text x="210" y="119" font-size="10" font-weight="bold" fill="#0369a1">VLAN ID / Tên</text>
        <text x="335" y="119" font-size="10" font-weight="bold" fill="#0369a1">Port 1-10 (PC KT)</text>
        <text x="450" y="119" font-size="10" font-weight="bold" fill="#0369a1">Port 11-20 (PC KD)</text>
        <text x="570" y="119" font-size="10" font-weight="bold" fill="#0369a1">Port 21-22 (Wi-Fi AP)</text>
        <text x="700" y="119" font-size="10" font-weight="bold" fill="#0369a1">Port 24 (Uplink Router)</text>

        <!-- Row 1: VLAN 1 -->
        <rect x="195" y="132" width="630" height="28" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="210" y="150" font-size="10" font-weight="bold" fill="#334155">VLAN 1 (Default)</text>
        <text x="365" y="150" font-size="10" fill="#94a3b8">E (Trống)</text>
        <text x="480" y="150" font-size="10" fill="#94a3b8">E (Trống)</text>
        <rect x="595" y="136" width="55" height="20" rx="4" fill="#dcfce7" stroke="#16a34a"/><text x="622" y="150" font-size="9.5" font-weight="bold" text-anchor="middle" fill="#15803d">U (Native)</text>
        <rect x="725" y="136" width="55" height="20" rx="4" fill="#dcfce7" stroke="#16a34a"/><text x="752" y="150" font-size="9.5" font-weight="bold" text-anchor="middle" fill="#15803d">U (Native)</text>

        <!-- Row 2: VLAN 10 -->
        <rect x="195" y="162" width="630" height="28" fill="#ffffff" stroke="#e2e8f0"/>
        <text x="210" y="180" font-size="10" font-weight="bold" fill="#0284c7">VLAN 10 (Kế Toán)</text>
        <rect x="345" y="166" width="75" height="20" rx="4" fill="#dcfce7" stroke="#16a34a"/><text x="382" y="180" font-size="9.5" font-weight="bold" text-anchor="middle" fill="#15803d">U (Untagged)</text>
        <text x="480" y="180" font-size="10" fill="#94a3b8">E (Trống)</text>
        <rect x="590" y="166" width="65" height="20" rx="4" fill="#fef3c7" stroke="#d97706"/><text x="622" y="180" font-size="9.5" font-weight="bold" text-anchor="middle" fill="#92400e">T (Tagged)</text>
        <rect x="720" y="166" width="65" height="20" rx="4" fill="#fef3c7" stroke="#d97706"/><text x="752" y="180" font-size="9.5" font-weight="bold" text-anchor="middle" fill="#92400e">T (Tagged)</text>

        <!-- Row 3: VLAN 20 -->
        <rect x="195" y="192" width="630" height="28" fill="#f8fafc" stroke="#e2e8f0"/>
        <text x="210" y="210" font-size="10" font-weight="bold" fill="#7c3aed">VLAN 20 (Kinh Doanh)</text>
        <text x="365" y="210" font-size="10" fill="#94a3b8">E (Trống)</text>
        <rect x="460" y="196" width="75" height="20" rx="4" fill="#dcfce7" stroke="#16a34a"/><text x="497" y="210" font-size="9.5" font-weight="bold" text-anchor="middle" fill="#15803d">U (Untagged)</text>
        <rect x="590" y="196" width="65" height="20" rx="4" fill="#fef3c7" stroke="#d97706"/><text x="622" y="210" font-size="9.5" font-weight="bold" text-anchor="middle" fill="#92400e">T (Tagged)</text>
        <rect x="720" y="196" width="65" height="20" rx="4" fill="#fef3c7" stroke="#d97706"/><text x="752" y="210" font-size="9.5" font-weight="bold" text-anchor="middle" fill="#92400e">T (Tagged)</text>

        <rect x="195" y="228" width="630" height="32" rx="5" fill="#fffbeb" stroke="#fcd34d"/>
        <text x="208" y="248" font-size="10.5" font-weight="bold" fill="#92400e">💡 Quy tắc vàng trên Web GUI Aruba/HP/TP-Link: Cổng cắm PC chọn [U - Untagged]; Cổng nối lên Router/AP chọn [T - Tagged]!</text>
      </svg>
    `,
    photos: [
      {
        url: "images/aruba_switch.jpg",
        title_vi: "Switch Doanh Nghiệp HPE Aruba (Quản trị bằng Giao diện Web GUI trực quan, Cloud Portal & CLI)",
        desc_vi: "Dòng Switch cực kỳ phổ biến tại các doanh nghiệp, khách sạn, văn phòng hiện đại: Hỗ trợ quản trị qua trình duyệt Web (HTTPS GUI), ứng dụng điện thoại/Cloud (Aruba Instant On / Aruba Central) và cấp nguồn PoE+ cho Wi-Fi/Camera."
      },
      {
        url: "images/mikrotik_router.jpg",
        title_vi: "Router Chuyên Dụng Đa Cổng WAN/LAN (MikroTik RouterBOARD / DrayTek / FortiGate)",
        desc_vi: "Ngoài Router Cisco, các doanh nghiệp vừa và nhỏ, quán cafe lớn, văn phòng dùng rất nhiều Router MikroTik (quản lý qua phần mềm WinBox / giao diện WebFig) hoặc DrayTek để gộp băng thông 2-4 đường truyền Internet cáp quang (Multi-WAN Load Balancing)."
      }
    ],
    sections: [
      {
        heading: "1. Phá bỏ tư duy rập khuôn: Tại sao đi làm bạn bắt buộc phải biết dùng Giao diện Web GUI của Switch HPE Aruba, TP-Link Omada, Cisco CBS, UniFi?",
        content: "Khi học trong trường hoặc trên Packet Tracer, bạn chỉ thấy màn hình đen trắng gõ lệnh CLI của Cisco IOS. Nhưng **khi bước chân vào doanh nghiệp thực tế**, bạn sẽ gặp hàng loạt dòng Switch thế hệ mới như **HPE Aruba (Aruba Instant On 1930/1960, Aruba CX 6000/6100, HP ProCurve 2530/2920)**, **Cisco Business (CBS250/CBS350)**, **TP-Link JetStream Omada**, hoặc **Ubiquiti UniFi Switch**! • **Cách quản trị hiện đại**: Thay vì phải mang dây Console chạy đi cắm từng chiếc Switch, các dòng Switch này được quản lý trực tiếp bằng **Giao diện Đồ họa Web (Web GUI qua trình duyệt `https://<IP-Switch>`)** hoặc **Quản trị Đám mây Tập trung (Cloud Portal như Aruba Central / Instant On Portal / UniFi Controller)**! • Trên màn hình Web GUI có hình vẽ trực quan của đúng 24/48 cổng Switch: cổng nào đang cắm dây hiện màu xanh lá, cổng nào đang cấp điện PoE hiện biểu tượng tia sét kèm số Watt tiêu thụ (ví dụ `8.4W`), cổng nào bị đứt ngầm cáp có công cụ **Cable Test (TDR)** bấm 1 nút là báo đứt ở mét thứ bao nhiêu!"
      },
      {
        heading: "2. Cú sốc ngôn từ số 1 khi chuyển từ Cisco sang Switch HPE Aruba / HP: Phân biệt `Untagged (U)` vs. `Tagged (T)` và chữ `Trunk`!",
        content: "Rất nhiều người có bằng CCNA nhưng ngày đầu tiên đi làm đụng vào Switch **HPE Aruba** đã cấu hình sập mạng vì **2 hãng dùng từ ngược nhau hoàn toàn**: • **Bẫy số 1 — Chữ `Trunk`**: Trên **Cisco**, `Trunk` là đường cáp chở nhiều VLAN (`802.1Q`). Nhưng trên **Switch HPE Aruba / HP ProCurve**, chữ **`Trunk (Trk1, Trk2...)`** lại có nghĩa là **Gom nhóm nhiều cổng vật lý thành 1 bó cáp (LACP Link Aggregation — tương đương `EtherChannel` của Cisco)**! Nếu bạn muốn nối 1 sợi cáp chở nhiều VLAN trên Aruba mà lại vào mục `Trunk` là sai hoàn toàn! • **Bẫy số 2 — Cách chia VLAN bằng `Untagged (U)` và `Tagged (T)` trên Giao diện Web GUI**: Trên giao diện Web của Aruba, TP-Link, D-Link, Netgear không dùng từ *Access Port / Trunk Port* như Cisco, mà dùng chuẩn IEEE 802.1Q gốc: 1) **`Untagged (U)` + `PVID` (Port VLAN ID)**: Tương đương **Cổng `Access` (hoặc `Native VLAN`) của Cisco** — dành cho cổng cắm thẳng vào Máy tính PC, Máy in, Camera (vì máy tính không hiểu thẻ VLAN Tag!). Mỗi cổng chỉ được phép có **duy nhất 1 VLAN là `Untagged (U)`**. 2) **`Tagged (T)`**: Tương đương **Các VLAN được phép đi qua đường `Trunk` của Cisco (`switchport trunk allowed vlan`)** — dành cho cổng nối giữa 2 Switch, cổng nối lên Router, hoặc cổng cắm bộ phát **Wi-Fi Access Point phát nhiều tên Wi-Fi (Multi-SSID)** và **Điện thoại bàn IP Phone**!"
      },
      {
        heading: "3. Quy trình 5 bước cấu hình Switch HPE Aruba bằng Giao diện Web (Web GUI) ngoài đời thực",
        content: "Khi sếp giao cho bạn một chiếc Switch HPE Aruba mới tinh vừa khui thùng, đây là 5 bước bạn làm thực tế: • **Bước 1 (Truy cập Web GUI)**: Cắm dây mạng từ Switch vào mạng có DHCP (dùng phần mềm *Advanced IP Scanner* hoặc màn hình Router để xem Switch nhận IP bao nhiêu, hoặc nếu không có DHCP thì Switch Aruba tự nhận IP mặc định `192.168.1.1`). Mở trình duyệt Chrome gõ `https://<IP-Switch>`, đăng nhập và đổi mật khẩu quản trị. • **Bước 2 (Đặt IP Quản trị cố định)**: Vào menu **System / Network → IPv4 Configuration**, chuyển từ DHCP sang **Static IP** (ví dụ `192.168.1.250`, Mask `255.255.255.0`, Gateway `192.168.1.1`, DNS `8.8.8.8`). • **Bước 3 (Tạo danh sách VLAN)**: Vào menu **VLAN → VLAN Create**, nhập ID `10` (Tên: `KeToan`), `20` (Tên: `KinhDoanh`), `30` (Tên: `Camera_PoE`) rồi nhấn **Apply**. • **Bước 4 (Gán cổng trực quan trên bảng ma trận)**: Vào **VLAN → VLAN Membership**: Chọn `VLAN 10`, bấm chuột vào các cổng `1 đến 10` chuyển thành chữ **`U` (Untagged)**; bấm vào cổng Uplink `Port 24` chuyển thành chữ **`T` (Tagged)**. Làm tương tự cho `VLAN 20` (cổng `11 đến 20` là **`U`**, cổng `24` là **`T`**). • **Bước 5 (Bật chống Loop & Lưu cấu hình)**: Vào menu **Spanning Tree / Loop Protection**, bật tính năng chống cắm vòng dây trên các cổng `1 → 22`, sau đó bấm biểu tượng **Save Configuration** ở góc trên bên phải màn hình Web!"
      },
      {
        heading: "4. Thực tế cấu hình Router Đa Hãng (MikroTik, DrayTek Vigor, FortiGate, Ruijie): Quay số PPPoE Nhà Mạng & Gộp Băng Thông Multi-WAN",
        content: "Ở Việt Nam, khi kéo mạng cáp quang **Viettel, VNPT, FPT**, nhà mạng luôn lắp một cục **Modem Quang GPON (ONT)**. Nếu công ty có trên 30 nhân viên, cục Modem khuyến mãi của nhà mạng sẽ bị treo vì quá tải bảng NAT! Kỹ sư mạng thực tế sẽ làm như sau: • **1) Chuyển Modem nhà mạng sang Bridge Mode**: Gọi tổng đài nhà mạng nhờ chuyển cục Modem quang sang chế độ **Bridge Mode** (lúc này cục Modem chỉ làm nhiệm vụ biến ánh sáng quang thành điện Ethernet, nhường toàn bộ việc định tuyến cho Router chuyên dụng của công ty). • **2) Cấu hình Quay số `PPPoE Client` trên Router công ty (MikroTik / DrayTek / Cisco / FortiGate)**: Đăng nhập vào giao diện **Web GUI (hoặc phần mềm WinBox của MikroTik)**, vào cổng `WAN1`, chọn kiểu kết nối là **`PPPoE`**, nhập **Tài khoản (`Username`) và Mật khẩu (`Password`) đường truyền** (kèm `VLAN Tag 35 / 11` nếu nhà mạng yêu cầu) để Router nhận trực tiếp địa chỉ **IP Public thật**! • **3) Cân bằng tải nhiều đường truyền (`Dual-WAN / Multi-WAN Load Balancing & Failover`)**: Các công ty thường thuê 2 đường mạng của 2 nhà mạng khác nhau (ví dụ `WAN1 = Viettel 500Mbps`, `WAN2 = VNPT 500Mbps`) cắm vào cổng `WAN1` và `WAN2` trên Router **DrayTek / MikroTik / FortiGate**. Kỹ sư bật tính năng **Load Balancing + WAN Backup**: Bình thường gộp băng thông cả 2 đường lên `1000Mbps`; hễ cá mập cắn cáp hoặc đứt đường Viettel thì toàn bộ công ty tự động chuyển sang đường VNPT trong 1 giây không ai biết!"
      }
    ],
    table: {
      title: "Bảng Từ Điển Quy Đổi Thuật Ngữ & Cú Pháp Giữa Cisco IOS vs. HPE Aruba (Web/CLI) vs. MikroTik / FortiGate",
      headers: ["Tính năng mạng", "Thuật ngữ trên Cisco IOS", "Thuật ngữ trên Switch HPE Aruba / HP", "Thuật ngữ trên MikroTik / FortiGate / UniFi"],
      rows: [
        ["**Cổng cắm Máy tính / Máy in (1 VLAN)**", "**`Access Port`** (`switchport mode access` + `access vlan 10`)", "**`Untagged (U)`** + **`PVID = 10`** trên Web GUI (hoặc `vlan 10 untagged 1-10`)", "**UniFi**: Native VLAN / Port Profile  |  **MikroTik**: Bridge Port `PVID=10`"],
        ["**Cổng nối giữa 2 Switch / Router (Nhiều VLAN)**", "**`Trunk Port`** (`switchport mode trunk` + `allowed vlan 10,20`)", "**`Tagged (T)`** cho VLAN 10, 20 + **`Untagged (U)`** cho Native VLAN trên Web GUI", "**UniFi**: Tagged VLAN Management  |  **FortiGate**: VLAN Subinterface"],
        ["**Gom nhiều cổng vật lý tăng băng thông (LACP)**", "**`EtherChannel / Port-channel`** (`channel-group 1 mode active`)", "Gọi là **`Trunk (Trk1, Trk2)`**! (`trunk 23-24 trk1 lacp`)", "**MikroTik**: `Bonding (802.3ad)`  |  **FortiGate**: `802.3ad Aggregate`"],
        ["**Khám phá thiết bị hàng xóm nối trực tiếp**", "**`CDP`** (Độc quyền Cisco) & **`LLDP`** (`show cdp/lldp neighbors`)", "**`LLDP`** (Chuẩn quốc tế IEEE 802.1AB — `show lldp info remote-device`)", "**MikroTik**: `IP -> Neighbors (MNDP/LLDP/CDP)` trên WinBox"],
        ["**Công cụ Quản trị phổ biến nhất**", "Cửa sổ lệnh **CLI (SSH / Console)** & **Cisco Catalyst Center**", "**Giao diện Web GUI (HTTPS)**, **Aruba Instant On App / Aruba Central Cloud**", "**MikroTik**: Phần mềm **WinBox / WebFig**  |  **UniFi**: **UniFi Network Web Controller**"]
      ]
    }
  },

  {
    id: 10,
    badge: "THIẾT BỊ VĂN PHÒNG THỰC TẾ • MÁY IN LCD, MÁY SCAN, MÁY IN BILL, IP PHONE & QUẢN TRỊ TỪ XA PC",
    title_vi: "Chuyên Đề 10: Cẩm Nang Triển Khai Thiết Bị Ngoại Vi Trong Doanh Nghiệp — Máy In Màn Hình Cảm Ứng, Máy Scan Mạng (SMB/Email), Máy In Bill Thu Ngân (POS), Điện Thoại Bàn IP, Camera PoE & Quản Lý Từ Xa Máy Tính Nhân Viên",
    summary_vi: "Khi đi làm IT / Kỹ sư mạng tại công ty, bạn không chỉ cấu hình mỗi Switch và Router! Mỗi ngày bạn sẽ phải đấu nối và xử lý sự cố cho toàn bộ hệ sinh thái thiết bị đầu cuối thực tế: Máy photocopy/in đa năng có màn hình cảm ứng (MFP), Máy Scan tài liệu tự đẩy file về thư mục máy tính (Scan to SMB), Máy in hóa đơn/in bill nhiệt tại quầy thu ngân & nhà bếp (POS Port 9100), Điện thoại bàn IP Phone cắm nối tiếp ra PC nhân viên, Camera an ninh PoE và các công cụ điều khiển từ xa máy tính nhân viên (RDP, UltraViewer/AnyDesk, Wake-on-LAN, Active Directory).",
    svg: `
      <svg viewBox="0 0 860 280" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">
        <rect width="860" height="280" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
        <text x="20" y="26" font-size="13.5" font-weight="bold" fill="#0f172a">🏢 SƠ ĐỒ KẾT NỐI TOÀN BỘ THIẾT BỊ NGOẠI VI THỰC TẾ TRONG VĂN PHÒNG &amp; CỬA HÀNG (PORTS &amp; PROTOCOLS)</text>

        <!-- Central PoE Switch -->
        <rect x="295" y="108" width="270" height="58" rx="8" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
        <text x="430" y="133" font-size="12.5" font-weight="bold" text-anchor="middle" fill="#ffffff">🔀 Switch Quản Trị PoE+ (Aruba / Cisco)</text>
        <text x="430" y="152" font-size="10" text-anchor="middle" fill="#e0f2fe">Chia VLAN Data (10), Voice (150), Printer/POS (20), CCTV (30)</text>

        <!-- Device 1: MFP Touch Printer & Scanner -->
        <rect x="20" y="42" width="235" height="62" rx="6" fill="#ffffff" stroke="#0284c7" stroke-width="1.5"/>
        <text x="32" y="62" font-size="11" font-weight="bold" fill="#0369a1">🖨️ Máy In/Photo Màn Hình Cảm Ứng</text>
        <text x="32" y="79" font-size="9.5" fill="#334155">• Đặt IP Tĩnh trên màn hình LCD</text>
        <text x="32" y="94" font-size="9.5" font-weight="bold" fill="#15803d">• In: Port 9100 | Scan SMB: Port 445</text>

        <!-- Device 2: POS Receipt Printer -->
        <rect x="20" y="120" width="235" height="62" rx="6" fill="#ffffff" stroke="#d97706" stroke-width="1.5"/>
        <text x="32" y="140" font-size="11" font-weight="bold" fill="#b45309">🧾 Máy In Bill Thu Ngân / Bếp (POS)</text>
        <text x="32" y="157" font-size="9.5" fill="#334155">• Giữ nút FEED + Bật nguồn in phiếu IP</text>
        <text x="32" y="172" font-size="9.5" font-weight="bold" fill="#92400e">• Cắm dây LAN IP Tĩnh (RAW Port 9100)</text>

        <!-- Device 3: IP Phone + Employee PC Daisy Chain -->
        <rect x="20" y="198" width="235" height="66" rx="6" fill="#ffffff" stroke="#16a34a" stroke-width="1.5"/>
        <text x="32" y="218" font-size="11" font-weight="bold" fill="#15803d">☎️ Điện Thoại Bàn IP ──► 💻 PC Nhân Viên</text>
        <text x="32" y="235" font-size="9.5" fill="#334155">• 1 Cáp từ Switch vào cổng SW (PoE)</text>
        <text x="32" y="250" font-size="9.5" font-weight="bold" fill="#166534">• Cổng PC nối ra máy tính (SIP Port 5060)</text>

        <!-- Device 4: Remote Management PC -->
        <rect x="605" y="42" width="235" height="62" rx="6" fill="#ffffff" stroke="#7c3aed" stroke-width="1.5"/>
        <text x="617" y="62" font-size="11" font-weight="bold" fill="#6d28d9">🛠️ Quản Lý Từ Xa Máy Tính Nhân Viên</text>
        <text x="617" y="79" font-size="9.5" fill="#334155">• Remote Desktop (RDP TCP Port 3389)</text>
        <text x="617" y="94" font-size="9.5" font-weight="bold" fill="#5b21b6">• Wake-on-LAN (Bật PC từ xa bằng MAC)</text>

        <!-- Device 5: Document Scanner -->
        <rect x="605" y="120" width="235" height="62" rx="6" fill="#ffffff" stroke="#0d9488" stroke-width="1.5"/>
        <text x="617" y="140" font-size="11" font-weight="bold" fill="#0f766e">📄 Máy Scan Mạng Chuyên Dụng</text>
        <text x="617" y="157" font-size="9.5" fill="#334155">• Scan to Network Folder (SMB v2/v3)</text>
        <text x="617" y="172" font-size="9.5" font-weight="bold" fill="#115e59">• Scan to Email (SMTP TLS Port 587)</text>

        <!-- Device 6: PoE CCTV Camera & Time Attendance -->
        <rect x="605" y="198" width="235" height="66" rx="6" fill="#ffffff" stroke="#dc2626" stroke-width="1.5"/>
        <text x="617" y="218" font-size="11" font-weight="bold" fill="#b91c1c">📹 Camera IP PoE &amp; Máy Chấm Công</text>
        <text x="617" y="235" font-size="9.5" fill="#334155">• Camera RTSP Port 554 / ONVIF + NVR</text>
        <text x="617" y="250" font-size="9.5" font-weight="bold" fill="#991b1b">• Máy chấm công vân tay: TCP Port 4370</text>

        <!-- Connecting Lines -->
        <line x1="255" y1="73" x2="295" y2="122" stroke="#0284c7" stroke-width="2"/>
        <line x1="255" y1="151" x2="295" y2="137" stroke="#d97706" stroke-width="2"/>
        <line x1="255" y1="230" x2="295" y2="152" stroke="#16a34a" stroke-width="2"/>
        <line x1="565" y1="122" x2="605" y2="73" stroke="#7c3aed" stroke-width="2"/>
        <line x1="565" y1="137" x2="605" y2="151" stroke="#0d9488" stroke-width="2"/>
        <line x1="565" y1="152" x2="605" y2="230" stroke="#dc2626" stroke-width="2"/>
      </svg>
    `,
    photos: [
      {
        url: "images/mfp_printer_lcd.jpg",
        title_vi: "Máy In Đa Năng / Máy Photocopy Có Màn Hình Cảm Ứng Hiển Thị (Network MFP — Ricoh / Xerox / Canon / HP)",
        desc_vi: "Trên màn hình cảm ứng LCD lớn, kỹ sư bấm trực tiếp để đặt IP Tĩnh (Static IP), xem lượng mực, và cấu hình danh bạ Scan-to-Folder (SMB) / Scan-to-Email cho từng nhân viên."
      },
      {
        url: "images/office_scanner.jpg",
        title_vi: "Máy Scan Tài Liệu Tốc Độ Cao Qua Mạng LAN / Wi-Fi (Network Document Scanner)",
        desc_vi: "Kết nối thẳng vào Switch qua cổng RJ-45 hoặc Wi-Fi, cho phép quét hàng trăm trang hợp đồng thành file PDF và tự động đẩy về thư mục chia sẻ (Shared Folder SMB Port 445) trên máy tính nhân viên."
      },
      {
        url: "images/pos_receipt_printer.jpg",
        title_vi: "Máy In Hóa Đơn / Máy In Bill Nhiệt Mạng LAN Tại Quầy Thu Ngân & Nhà Bếp (POS Receipt Printer)",
        desc_vi: "Sử dụng cổng mạng RJ-45 với giao thức RAW Port 9100. Muốn biết IP hiện tại của máy in bill: Tắt nguồn, nhấn giữ nút FEED rồi bật nguồn để máy tự in ra tờ giấy Self-Test chứa địa chỉ IP!"
      },
      {
        url: "images/ip_phone.jpg",
        title_vi: "Điện Thoại Bàn IP Phone Có Màn Hình Hiển Thị & 2 Cổng Mạng Mặt Đế (Cổng SW PoE + Cổng PC)",
        desc_vi: "Nhận nguồn điện PoE từ Switch và cho phép nối tiếp 1 sợi dây mạng từ mặt dưới điện thoại sang máy tính của nhân viên. Quản trị số nội bộ SIP (Port 5060) ngay trên giao diện Web của điện thoại."
      },
      {
        url: "images/cctv_ip_camera.jpg",
        title_vi: "Camera An Ninh IP Cấp Nguồn Qua Cáp Mạng (PoE IP Camera — Chuẩn 802.3af/at)",
        desc_vi: "Chỉ cần kéo duy nhất 1 sợi cáp mạng Cat6 từ Switch PoE lên trần nhà là vừa cấp điện vừa truyền hình ảnh độ phân giải cao về đầu ghi NVR qua giao thức RTSP (Port 554) và ONVIF."
      }
    ],
    sections: [
      {
        heading: "1. Máy in có màn hình hiển thị (Network MFP Printer) & Cách xử lý dứt điểm lỗi 'Máy in bị Offline' trong văn phòng",
        content: "Trong mọi văn phòng, sự cố nhân viên gọi IT nhiều nhất chính là: *'Em ơi hôm qua vẫn in bình thường mà sáng nay máy in báo Offline không in được!'*. **Nguyên nhân gốc rễ**: Do người lắp máy in để chế độ nhận IP động (**DHCP**); sau khi cúp điện hoặc qua ngày mới, Router cấp cho máy in một địa chỉ IP khác (ví dụ từ `.150` nhảy sang `.182`), trong khi máy tính của nhân viên vẫn gửi lệnh in tới IP cũ `.150`! • **Cách cấu hình chuẩn 100% trên Màn hình cảm ứng của Máy in**: 1) Nhấn nút **`Menu / Settings / System Settings`** trên màn hình LCD của máy in → Chọn **`Network / TCP/IP Settings -> IPv4`**; 2) Tắt `DHCP / Auto-Obtain` và chuyển sang **`Static / Manual IP`**, nhập một địa chỉ IP cố định nằm ngoài vùng cấp DHCP (ví dụ `192.168.1.200`, Subnet Mask `255.255.255.0`, Gateway `192.168.1.1`). • **Cách cài máy in trên Windows không bao giờ bị lỗi Offline**: Vào *Control Panel -> Devices and Printers -> Add a printer -> The printer that I want isn't listed -> Add a printer using a TCP/IP address*, ở ô **Device type** bắt buộc chọn **`TCP/IP Device`** (tuyệt đối KHÔNG chọn `WSD Port` vì giao thức WSD của Windows rất hay mất kết nối!), nhập IP `192.168.1.200` (chạy trên **Cổng chuẩn `RAW Port 9100`**). Sau khi máy in có IP tĩnh, bạn còn có thể mở trình duyệt Web gõ `http://192.168.1.200` để vào **Giao diện Web của máy in (Remote UI)** kiểm tra xem còn bao nhiêu % mực từ xa!"
      },
      {
        heading: "2. Máy Scan mạng & Cấu hình 'Scan về Thư mục Máy tính (Scan to SMB Folder)' / 'Scan về Email'",
        content: "Các dòng máy Scan chuyên dụng (HP ScanJet Pro, Fujitsu fi-Series, Brother) hoặc máy Photocopy văn phòng (Ricoh, Canon, Toshiba) đều có tính năng quét tài liệu qua mạng cực kỳ tiện lợi mà mọi nhân viên IT phải biết cài: • **Cơ chế 1 — Scan to Network Folder (Giao thức SMB Port `445`)**: 1) Trên máy tính của nhân viên (ví dụ máy của chị Lan Kế Toán có IP `192.168.1.55`), bạn tạo một thư mục `C:\\Scan_TaiLieu`, bấm chuột phải chọn **Properties -> Sharing -> Advanced Sharing**, bật chia sẻ và cấp quyền **Full Control (Read/Write)** cho tài khoản của máy đó. 2) Trên máy tính của bạn, mở trình duyệt Web nhập địa chỉ IP của máy Scan/Photocopy (ví dụ `http://192.168.1.200`) để vào **Web Admin -> Address Book (Danh bạ) -> Add User**: Nhập tên hiển thị trên màn hình cảm ứng là `Chi Lan - Ke Toan`, chọn giao thức **`SMB`**, điền đường dẫn mạng **`\\\\192.168.1.55\\Scan_TaiLieu`** kèm `Username` và `Password` đăng nhập máy tính của chị Lan! *(Mẹo xử lý lỗi kinh điển: Nếu máy Photocopy đời cũ chỉ hỗ trợ `SMBv1` mà máy tính chạy Windows 10/11 đã tắt SMBv1 vì bảo mật, bạn phải vào Web GUI của máy Photocopy bật **`SMBv2 / SMBv3`** hoặc dùng giao thức **`FTP` Port 21**!)*"
      },
      {
        heading: "3. Máy in Hóa đơn / Máy in Bill nhiệt mạng LAN (POS Receipt Printer) tại Quầy Thu Ngân, Nhà Hàng, Siêu Thị",
        content: "Khi triển khai mạng cho chuỗi F&B (quán cà phê, nhà hàng), siêu thị, shop thời trang hay bệnh viện, bạn sẽ phải cấu hình hàng loạt **Máy in bill nhiệt (Epson TM-T82, Xprinter, Zywell)** nối mạng LAN để phần mềm bán hàng (POS trên máy tính/iPad/điện thoại) bấm thanh toán là bếp và quầy bar tự ra bill: • **Bí kíp số 1 — Làm sao tìm được địa chỉ IP hiện tại của máy in bill khi nó KHÔNG có màn hình?**: Hãy **Tắt công tắc nguồn** của máy in bill → Dùng ngón tay **nhấn đè giữ chặt nút `FEED`** ở mặt trước → Vừa giữ nút `FEED` vừa **bật công tắc nguồn lên**, đợi khoảng 3 giây rồi thả tay ra! Máy in bill sẽ lập tức chạy giấy và in ra một tờ hóa đơn tự kiểm tra (**`Self-Test Page`**), trên tờ giấy đó in rõ ràng dòng **`IP Address: 192.168.1.114`**, `Subnet Mask` và `DHCP: Disabled/Enabled`! • **Bí kíp số 2 — Cách đổi IP máy in bill cho trùng với lớp mạng của quán**: Nếu Router của quán đang chạy lớp mạng `192.168.10.x` mà tờ giấy Self-Test của máy in bill đang là `192.168.1.114`, bạn chỉ cần đặt tạm IP tĩnh cho Laptop của mình thành `192.168.1.50`, cắm dây mạng vào máy in bill rồi mở trình duyệt Web gõ `http://192.168.1.114` — một giao diện Web cấu hình của máy in bill sẽ hiện ra cho bạn đổi IP sang `192.168.10.201` (sử dụng cố định **`TCP Port 9100`**)!"
      },
      {
        heading: "4. Điện thoại bàn IP Phone (VoIP) cắm nối tiếp ra Máy tính nhân viên & Quản trị qua Giao diện Web",
        content: "• **Cách đi dây thông minh tiết kiệm 50% số cổng Switch**: Mặt dưới của mọi chiếc điện thoại bàn IP Phone (Cisco, Yealink, Grandstream) luôn có **2 lỗ cắm mạng RJ-45**: Lỗ thứ nhất ghi chữ **`SW / LAN / Network` (có ký hiệu PoE)** dùng để cắm sợi dây mạng từ ổ cắm tường/Switch đi vào; Lỗ thứ hai ghi chữ **`PC`** dùng để cắm một sợi dây nhảy ngắn nối thẳng sang thùng máy tính để bàn của nhân viên ngồi ngay đó! Bên trong chiếc điện thoại bàn đã tích hợp sẵn một bộ chuyển mạch 3 cổng mini (Mini-Switch): Nó tự động gắn thẻ **Voice VLAN (VD: VLAN 150, ưu tiên QoS `DSCP EF = 46`)** cho các cuộc gọi điện thoại, và cho lưu lượng của máy tính đi qua ở dạng **Untagged Data VLAN (VD: VLAN 10)**! • **Cách cấu hình Điện thoại bàn bằng Giao diện Web**: Nhấn nút **`OK`** hoặc nút **`Menu -> Status`** ngay trên bàn phím chiếc điện thoại bàn, màn hình LCD của điện thoại sẽ hiện ra địa chỉ IP nó đang nhận (ví dụ `192.168.150.25`). Bạn mở trình duyệt Web trên máy tính gõ `https://192.168.150.25` (tài khoản mặc định thường là `admin/admin`), vào tab **Account 1** và điền địa chỉ IP của **Tổng đài IP-PBX (`SIP Server`, Port `5060`)**, Số máy lẻ (**`Extension`: ví dụ `108`**) và mật khẩu SIP là điện thoại đổ chuông ngay!"
      },
      {
        heading: "5. Quản lý, Hỗ trợ Từ Xa Máy Tính Nhân Viên (Remote Support) & Bật Nguồn Máy Tính Từ Xa (Wake-on-LAN)",
        content: "Một kỹ sư mạng / IT System giỏi không bao giờ phải chạy bộ lên xuống 10 tầng lầu mỗi khi nhân viên nhờ cài phần mềm hay sửa lỗi máy in! Bạn sẽ quản lý toàn bộ máy tính của nhân viên từ xa ngay tại bàn làm việc của mình bằng 4 công nghệ sau: • **1) Điều khiển màn hình từ xa trong mạng LAN (`Remote Desktop RDP — TCP Port 3389` & `VNC — Port 5900`)**: Trong nội bộ công ty (hoặc qua đường hầm VPN), kỹ sư dùng **Microsoft Remote Desktop (`mstsc`)**, **UltraViewer / AnyDesk / RustDesk** hoặc công cụ tích hợp trong **Windows Active Directory** để điều khiển trực tiếp chuột và bàn phím máy tính nhân viên, cài đặt máy in, sửa lỗi mạng trong 30 giây. • **2) Quản trị tập trung hàng trăm máy tính bằng `Active Directory (AD Domain) & Group Policy (GPO)`**: Thay vì đi từng máy cài phần mềm hay map ổ đĩa mạng, kỹ sư đưa toàn bộ máy tính nhân viên gia nhập tên miền công ty (**Join Domain**, ví dụ `congty.local`). Từ máy chủ Windows Server, kỹ sư đẩy chính sách **GPO** để tự động gắn ổ đĩa chung, tự động cài đặt máy in cho cả phòng ban, khóa cổng USB chống rò rỉ dữ liệu và đồng bộ mật khẩu! • **3) Đánh thức máy tính nhân viên đang tắt nguồn từ xa bằng `Wake-on-LAN (WoL)`**: Nếu nhân viên đi công tác ở Hà Nội muốn lấy file trên máy tính để bàn ở văn phòng TP.HCM nhưng máy tính đó đã tắt nguồn (`Shutdown`), kỹ sư mạng chỉ cần bật tính năng *Wake on PCI-E / LAN* trong BIOS và card mạng, sau đó từ Router/Switch gửi một gói tin đặc biệt gọi là **`Magic Packet` (chứa 6 byte `FF` nối tiếp bởi 16 lần Địa chỉ MAC của máy tính đó qua cổng `UDP Port 7 hoặc Port 9`)** — card mạng dù máy đang tắt vẫn có điện chờ (Standby) sẽ nhận ra địa chỉ MAC của mình và kích hoạt bo mạch chủ bật nguồn máy tính lên ngay lập tức! • **4) Nền tảng Quản trị Điểm cuối RMM (NinjaOne, ManageEngine, Action1)**: Cài đặt Agent ngầm trên PC nhân viên để theo dõi tải CPU/RAM, tự động cập nhật bản vá Windows Patch Management, cài phần mềm âm thầm qua Silent Install và chạy lệnh PowerShell từ xa mà không làm chiếm chuột hay gián đoạn công việc của nhân viên!"
      },
      {
        heading: "6. Hệ Thống Camera IP PoE, Máy Chấm Công Khuôn Mặt / Vân Tay & Bộ Lưu Điện Thông Minh UPS (Network UPS NMC)",
        content: "• **1) Camera an ninh IP PoE & Đầu ghi hình NVR**: Sử dụng chuẩn cấp nguồn qua dây mạng **PoE 802.3af (15.4W) hoặc PoE+ 802.3at (30W)**. Khi thiết kế mạng, kỹ sư mạng luôn tách riêng toàn bộ Camera sang một **VLAN Camera riêng biệt (VD: VLAN 30)** và cô lập không cho đi chung với VLAN người dùng để tránh luồng video streaming độ phân giải cao (giao thức **RTSP TCP/UDP 554** và chuẩn kết nối **ONVIF**) làm nghẽn mạng văn phòng. Luôn tính toán **PoE Budget** (ví dụ Switch 24 cổng có công suất cấp nguồn 250W thì tối đa nuôi được bao nhiêu camera ban đêm khi bật đèn hồng ngoại IR). • **2) Máy chấm công vân tay / Nhận diện khuôn mặt FaceID (ZKTeco, Ronald Jack, Hikvision)**: Kết nối dây mạng LAN RJ-45, đặt IP tĩnh cố định và mở kết nối qua **cổng TCP/UDP `4370`** hoặc cấu hình Cloud Webhook/ADMS để dữ liệu quẹt công tự động đẩy về máy chủ phòng Nhân sự theo thời gian thực. • **3) Bộ lưu điện thông minh UPS (APC Smart-UPS, Vertiv, Santak)**: Trong phòng Server, các bộ UPS cao cấp được gắn thêm **Card quản trị mạng NMC (Network Management Card)** có cổng RJ-45 và địa chỉ IP riêng. Kỹ sư có thể truy cập Web GUI để xem nhiệt độ ắc quy, mức tải điện, và cấu hình giao thức **SNMP Trap**. Khi xảy ra sự cố mất điện lưới, UPS sẽ tự động gửi email/tin nhắn SMS cảnh báo và kích hoạt lệnh điều khiển qua mạng (**PowerChute Network Shutdown**) để tự động lưu dữ liệu và tắt an toàn toàn bộ máy chủ Server trước khi cạn pin!"
      }
    ],
    table: {
      title: "Bảng Tổng Hợp Cổng Giao Thức (Ports) & Mẹo Triển Khai Toàn Bộ Thiết Bị Văn Phòng Thực Tế",
      headers: ["Thiết bị văn phòng thực tế", "Cổng & Giao thức mạng sử dụng", "Cách đặt IP & Kết nối chuẩn", "Mẹo xử lý sự cố thực chiến"],
      rows: [
        ["**Máy in màn hình cảm ứng (MFP) & Máy in mạng**", "**TCP Port `9100` (RAW/JetDirect)**, **Port `631` (IPP)**, **Port `515` (LPR)**, SNMP `161`", "Đặt **IP Tĩnh** trực tiếp trên màn hình cảm ứng LCD; cài trên PC qua **Standard TCP/IP Port**", "Tuyệt đối không dùng cổng `WSD` trên Windows để tránh lỗi máy in báo Offline ảo sau khi ngủ đông"],
        ["**Máy Scan mạng / Scan-to-Folder & Email**", "**TCP Port `445` (SMB)**, **TCP Port `21` (FTP)**, **TCP Port `587/465` (SMTP)**", "Khai báo đường dẫn `\\\\IP-May-Tinh\\Ten-Thu-Muc` vào **Address Book** trên Web GUI của máy Scan", "Điền địa chỉ **IP** của máy tính thay vì *Tên máy (Hostname)* để không bao giờ bị lỗi mất phân giải NetBIOS"],
        ["**Máy in Bill thu ngân / Nhà bếp (POS Printer)**", "**TCP Port `9100` (RAW Socket)**", "Bắt buộc kéo **dây mạng LAN RJ-45** và đặt **IP Tĩnh** (Không dùng Wi-Fi cho máy in bếp!)", "**Tắt nguồn → Giữ nút `FEED` → Bật nguồn** giữ 3 giây để máy tự in ra phiếu **Self-Test** chứa địa chỉ IP hiện tại"],
        ["**Điện thoại bàn IP Phone (VoIP)**", "**UDP/TCP `5060` (SIP)**, **TCP `5061` (SIP TLS)**, **UDP `10000-20000` (RTP Audio)**", "Cắm cáp từ Switch PoE vào cổng **`SW`**, nối cổng **`PC`** ra máy tính; cấu hình SIP qua **Web GUI**", "Bật `switchport voice vlan` trên Switch và tắt tính năng `SIP ALG` trên Router nếu gọi điện bị mất tiếng 1 chiều!"],
        ["**Quản lý từ xa PC Nhân viên & Máy chấm công**", "**TCP `3389` (RDP)**, **UDP `7/9` (Wake-on-LAN)**, **TCP `4370` (Máy chấm công ZKTeco)**", "Phân quyền qua **Active Directory / GPO**; máy chấm công vân tay/khuôn mặt đặt IP tĩnh cổng `4370`", "Khi nhân viên làm việc ở nhà cần Remote Desktop vào PC công ty: Bắt buộc kết nối qua **VPN** trước, không mở thẳng Port 3389 ra ngoài Internet!"],
        ["**Camera An ninh IP PoE & Đầu ghi NVR**", "**TCP/UDP `554` (RTSP Video)**, **Port `80/8000/37777` (ONVIF / SDK)**", "Tách riêng vào **`VLAN Camera`**; cấp nguồn từ Switch PoE chuẩn **802.3af (15.4W) / 802.3at (30W)**", "Luôn kiểm tra **Tổng công suất PoE (PoE Budget)** của Switch (VD: Switch 120W cắm 16 Camera bật hồng ngoại ban đêm sẽ bị sập bớt cổng vì thiếu điện!)"],
        ["**Bộ lưu điện thông minh UPS (Network NMC)**", "**TCP Port `80/443` (Web GUI)**, **UDP `161/162` (SNMP Trap)**", "Cắm cáp LAN vào Card NMC của UPS; đặt IP tĩnh; cấu hình tài khoản giám sát qua Web", "Thiết lập kịch bản **Network Shutdown**: Khi ắc quy còn dưới 15%, tự động gửi lệnh tắt cụm máy chủ ảo hóa VMware/Hyper-V an toàn!"]
      ]
    }
  }
];
