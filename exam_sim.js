// ==========================================================================
// CCNA LEARNING — MASTER CLI COMMANDS, EXAM SIMULATOR & CRAM TABLES
// Module hỗ trợ thi đỗ CCNA 200-301 (v1.1 & v2.0) 100% & Vận hành mạng thực tế
// ==========================================================================

// --------------------------------------------------------------------------
// 1. DATA: BỘ TỪ ĐIỂN LỆNH CISCO IOS CHUYÊN SÂU (PRODUCTION & CCNA READY)
// Mỗi lệnh bao gồm: Trường hợp dùng, Tại sao/Công dụng, Điều kiện, Ví dụ & Lệnh kiểm tra
// --------------------------------------------------------------------------
const CCNA_CHEAT_SHEET_DATA = [
  // ==================== A. CĂN BẢN & QUẢN TRỊ THIẾT BỊ ====================
  {
    id: "cli-basic-hostname",
    category: "basic",
    categoryName: "Căn Bản & Quản Trị",
    title: "Đặt tên định danh thiết bị (Hostname)",
    mode: "Router(config)# / Switch(config)#",
    cmd: "hostname <TEN_THIET_BI>",
    scenario: "Bắt buộc thực hiện đầu tiên ngay khi unbox thiết bị mới hoặc tái cấu hình Router/Switch trong phòng Server và Data Center.",
    why: "Giúp người quản trị phân biệt chính xác thiết bị đang thao tác qua SSH/Console, tránh nhầm lẫn cấu hình giữa Core Switch, Distribution Switch hoặc Router chi nhánh.",
    prereq: "Đã vào chế độ Privileged EXEC (enable) và Global Configuration (configure terminal).",
    example: "Router# configure terminal\nRouter(config)# hostname HN-CORE-SW01\nHN-CORE-SW01(config)#",
    verify: "Dấu nhắc lệnh CLI đổi từ `Router#` thành `HN-CORE-SW01#`."
  },
  {
    id: "cli-basic-secret",
    category: "basic",
    categoryName: "Căn Bản & Quản Trị",
    title: "Đặt mật khẩu bảo vệ chế độ đặc quyền (Enable Secret)",
    mode: "Router(config)#",
    cmd: "enable secret <MAT_KHAU_MANH>",
    scenario: "Bắt buộc cho mọi thiết bị trong mạng doanh nghiệp để ngăn người dùng trái phép truy cập chế độ cấu hình và xem thông tin nhạy cảm.",
    why: "Mã hóa một chiều cực mạnh bằng thuật toán SHA-256 (Type 8 hoặc Type 9 hoặc Type 5 MD5). Khác với lệnh cũ `enable password` lưu dưới dạng văn bản thô cực kỳ nguy hiểm.",
    prereq: "Không được đặt mật khẩu trùng với username hoặc hostname của thiết bị.",
    example: "HN-CORE-SW01(config)# enable secret AdminSecureP@ss2026!",
    verify: "show running-config | include enable secret\n(Kết quả hiển thị chuỗi băm $8$ hoặc $9$, không hiển thị mật khẩu gốc)."
  },
  {
    id: "cli-basic-ssh",
    category: "basic",
    categoryName: "Căn Bản & Quản Trị",
    title: "Cấu hình truy cập từ xa an toàn qua SSHv2 (Thay thế Telnet)",
    mode: "Router(config)#",
    cmd: "ip domain-name <DOMAIN>\ncrypto key generate rsa modulus 2048\nip ssh version 2\nusername <USER> privilege 15 secret <PASS>\nline vty 0 4\n login local\n transport input ssh",
    scenario: "Quản trị viên cần đăng nhập điều khiển thiết bị từ xa qua mạng nội bộ hoặc VPN mà không làm lộ mật khẩu qua đường truyền.",
    why: "Telnet gửi dữ liệu và mật khẩu dưới dạng văn bản thô (Plaintext, port 23) khiến hacker dễ dàng đánh cắp bằng Wireshark. SSHv2 (port 22) mã hóa toàn bộ phiên làm việc bằng RSA/AES.",
    prereq: "Thiết bị phải có Hostname khác mặc định, Domain Name đã cấu hình, và Image IOS hỗ trợ tính năng Crypto (k9).",
    example: "Switch(config)# hostname Dist-SW01\nDist-SW01(config)# ip domain-name cisco.local\nDist-SW01(config)# crypto key generate rsa modulus 2048\nDist-SW01(config)# ip ssh version 2\nDist-SW01(config)# username netadmin privilege 15 secret Cisco@SSH2026\nDist-SW01(config)# line vty 0 4\nDist-SW01(config-line)# login local\nDist-SW01(config-line)# transport input ssh\nDist-SW01(config-line)# exit",
    verify: "show ip ssh (Kiểm tra SSH Enabled - version 2.0)\nshow ssh (Xem các phiên SSH đang kết nối active)."
  },
  {
    id: "cli-basic-banner",
    category: "basic",
    categoryName: "Căn Bản & Quản Trị",
    title: "Hiển thị thông điệp cảnh báo pháp lý (Banner MOTD)",
    mode: "Router(config)#",
    cmd: "banner motd #<NOI_DUNG_CANH_BAO>#",
    scenario: "Quy định bảo mật quốc tế (ISO 27001, PCI-DSS) yêu cầu hiển thị cảnh báo pháp lý trước khi bất kỳ ai đăng nhập vào thiết bị mạng.",
    why: "Tuyên bố quyền sở hữu và cảnh báo truy cập trái phép sẽ bị truy tố pháp luật. Tránh dùng từ 'Welcome' vì có thể bị khai thác trong tranh chấp pháp lý.",
    prereq: "Ký tự kết thúc thông điệp (delimiter như # hoặc %) không được xuất hiện trong nội dung văn bản cảnh báo.",
    example: "Router(config)# banner motd #\n=======================================================\n WARNING: AUTHORIZED ACCESS ONLY!\n All activities are monitored and logged to Syslog.\n Unauthorized access will be prosecuted under law.\n=======================================================#",
    verify: "Thoát ra màn hình chờ Console hoặc Telnet/SSH để xem biểu ngữ hiển thị trước khi đăng nhập."
  },
  {
    id: "cli-basic-save-backup",
    category: "basic",
    categoryName: "Căn Bản & Quản Trị",
    title: "Lưu cấu hình vào NVRAM & Sao lưu lên máy chủ TFTP",
    mode: "Router#",
    cmd: "copy running-config startup-config (hoặc: write memory)\ncopy running-config tftp:",
    scenario: "Sau mỗi lần thay đổi cấu hình thành công hoặc trước khi bảo trì, reboot, nâng cấp phần mềm IOS.",
    why: "`running-config` nằm trên RAM và sẽ mất sạch khi cúp điện. Lưu vào `startup-config` trong NVRAM để nạp lại khi khởi động; sao lưu TFTP để dự phòng hỏng hóc phần cứng.",
    prereq: "Cấu hình vừa thực hiện đã được test chạy ổn định. Với sao lưu TFTP, phải ping thông máy chủ TFTP.",
    example: "Router# copy running-config startup-config\nDestination filename [startup-config]? [Enter]\nBuilding configuration...\n[OK]\nRouter# copy running-config tftp:\nAddress or name of remote host []? 192.168.1.50\nDestination filename [router-confg]? CoreSW-Backup-2026.cfg\n!!\n[OK - 4096 bytes]",
    verify: "show startup-config"
  },
  {
    id: "cli-basic-recovery",
    category: "basic",
    categoryName: "Căn Bản & Quản Trị",
    title: "Đổi thanh ghi cấu hình để khôi phục mật khẩu (Configuration Register)",
    mode: "Router(config)# / rommon 1 >",
    cmd: "config-register 0x2142 (bỏ qua NVRAM)\nconfig-register 0x2102 (chế độ bình thường)",
    scenario: "Khi quản trị viên quên mật khẩu enable secret của Router và không thể truy cập cấu hình.",
    why: "Giá trị 0x2142 báo cho ROMMON bỏ qua việc nạp file `startup-config` trong NVRAM khi khởi động, cho phép vào Router mà không cần mật khẩu để đặt lại.",
    prereq: "Phải có cáp Console cắm trực tiếp vào cổng Console vật lý của Router.",
    example: "rommon 1 > confreg 0x2142\nrommon 2 > reset\n... (Router khởi động không hỏi pass) ...\nRouter> enable\nRouter# copy startup-config running-config\nRouter(config)# enable secret NewStrongPassword2026\nRouter(config)# config-register 0x2102\nRouter(config)# exit\nRouter# copy running-config startup-config",
    verify: "show version | include Configuration register (Phải hiển thị 0x2102)."
  },

  // ==================== B. CHUYỂN MẠCH, VLAN & TRUNKING ====================
  {
    id: "cli-vlan-create",
    category: "vlan",
    categoryName: "VLAN & Trunking",
    title: "Tạo VLAN và gán tên định danh",
    mode: "Switch(config)#",
    cmd: "vlan <VLAN_ID>\n name <TEN_VLAN>",
    scenario: "Chia tách mạng nội bộ công ty thành các phòng ban độc lập (Kế toán, Kỹ thuật, Giám đốc, Khách hàng).",
    why: "Phân tách miền quảng bá (Broadcast Domain), ngăn chặn bão broadcast, tăng hiệu suất mạng và ngăn chặn các phòng ban nhìn trộm dữ liệu của nhau ở Layer 2.",
    prereq: "VLAN ID hợp lệ trong phạm vi chuẩn (1 - 1005) hoặc mở rộng (1006 - 4094). Tránh dùng VLAN 1 mặc định cho người dùng.",
    example: "Switch(config)# vlan 10\nSwitch(config-vlan)# name KE_TOAN\nSwitch(config-vlan)# vlan 20\nSwitch(config-vlan)# name KY_THUAT\nSwitch(config-vlan)# vlan 99\nSwitch(config-vlan)# name MANAGEMENT",
    verify: "show vlan brief (Kiểm tra VLAN 10, 20, 99 có trạng thái active)."
  },
  {
    id: "cli-vlan-access",
    category: "vlan",
    categoryName: "VLAN & Trunking",
    title: "Cấu hình cổng Access và gán vào VLAN người dùng",
    mode: "Switch(config-if)#",
    cmd: "interface <INTERFACE>\n switchport mode access\n switchport access vlan <VLAN_ID>",
    scenario: "Cắm dây mạng từ máy tính PC bàn, laptop, máy in hoặc camera văn phòng vào cổng của Switch.",
    why: "Ép cổng Switch hoạt động ở chế độ Access (chỉ mang 1 VLAN duy nhất không gán nhãn 802.1Q) và cấm tạo đường Trunk trái phép từ máy client.",
    prereq: "VLAN tương ứng đã được tạo sẵn trên Switch trước đó.",
    example: "Switch(config)# interface range FastEthernet 0/1 - 12\nSwitch(config-if-range)# switchport mode access\nSwitch(config-if-range)# switchport access vlan 10\nSwitch(config-if-range)# no shutdown",
    verify: "show interface f0/1 switchport (Operational Mode: static access, Access Mode VLAN: 10)."
  },
  {
    id: "cli-vlan-trunk",
    category: "vlan",
    categoryName: "VLAN & Trunking",
    title: "Cấu hình đường trung kế Trunk 802.1Q nối Switch-to-Switch",
    mode: "Switch(config-if)#",
    cmd: "interface <UPLINK_INT>\n switchport trunk encapsulation dot1q (áp dụng Catalyst cũ)\n switchport mode trunk\n switchport trunk native vlan <NATIVE_VLAN_ID>",
    scenario: "Đường dây cáp nối giữa Switch Access lên Switch Core hoặc nối Switch lên Router.",
    why: "Cho phép lưu lượng của hàng chục VLAN khác nhau cùng đi qua một sợi cáp vật lý duy nhất nhờ gắn nhãn thẻ 4-byte 802.1Q Tag. Đổi Native VLAN khác VLAN 1 để phòng chống tấn công VLAN Hopping (Double-Tagging).",
    prereq: "Cả hai đầu Switch nối với nhau phải đồng nhất Native VLAN và chuẩn encapsulation dot1Q.",
    example: "Switch(config)# interface GigabitEthernet 0/1\nSwitch(config-if)# switchport trunk encapsulation dot1q\nSwitch(config-if)# switchport mode trunk\nSwitch(config-if)# switchport trunk native vlan 999\nSwitch(config-if)# switchport nonegotiate\nSwitch(config-if)# no shutdown",
    verify: "show interfaces trunk (Kiểm tra Mode: on, Encapsulation: 802.1q, Native vlan: 999)."
  },
  {
    id: "cli-vlan-allowed",
    category: "vlan",
    categoryName: "VLAN & Trunking",
    title: "Thu hẹp danh sách VLAN được phép qua đường Trunk (Pruning)",
    mode: "Switch(config-if)#",
    cmd: "switchport trunk allowed vlan [add | remove | only] <VLAN_LIST>",
    scenario: "Tối ưu hóa băng thông đường truyền giữa các Switch và tăng tính bảo mật cho hệ thống phân tán.",
    why: "Mặc định Cisco cho phép TẤT CẢ VLAN (1-4094) đi qua Trunk. Nếu một VLAN có bão Broadcast, nó sẽ tràn sang toàn bộ các Switch khác. Chỉ cho phép đúng các VLAN cần thiết đi qua.",
    prereq: "Cổng giao tiếp đã được cấu hình chế độ Trunk (`switchport mode trunk`).",
    example: "Switch(config-if)# switchport trunk allowed vlan 10,20,99\n! Khi muốn thêm VLAN mới mà không ghi đè:\nSwitch(config-if)# switchport trunk allowed vlan add 30",
    verify: "show interfaces trunk (Cột 'Vlans allowed on trunk' chỉ hiển thị 10,20,30,99)."
  },
  {
    id: "cli-vlan-voice",
    category: "vlan",
    categoryName: "VLAN & Trunking",
    title: "Cấu hình Voice VLAN cho điện thoại Cisco IP Phone nối chung PC",
    mode: "Switch(config-if)#",
    cmd: "interface <INT>\n switchport mode access\n switchport access vlan <DATA_VLAN>\n switchport voice vlan <VOICE_VLAN>\n mls qos trust cos",
    scenario: "Văn phòng chỉ có 1 ổ cắm mạng trên tường nhưng cần cắm cả điện thoại bàn IP Phone và máy tính nhân viên.",
    why: "Cisco IP Phone hoạt động như một mini-switch 3 cổng. Nó gắn tag 802.1Q với CoS cao (ưu tiên thoại không bị giật lag) cho Voice VLAN, trong khi lưu lượng PC đi qua dạng Untagged thuộc Data VLAN.",
    prereq: "Cả 2 VLAN (Data và Voice) đã được tạo trên Switch.",
    example: "Switch(config)# interface range g0/1 - 24\nSwitch(config-if-range)# switchport mode access\nSwitch(config-if-range)# switchport access vlan 10\nSwitch(config-if-range)# switchport voice vlan 50\nSwitch(config-if-range)# spanning-tree portfast",
    verify: "show interfaces g0/1 switchport (Kiểm tra Access VLAN: 10 và Voice VLAN: 50)."
  },

  // ==================== C. SPANNING TREE PROTOCOL & ETHERCHANNEL ====================
  {
    id: "cli-stp-mode",
    category: "stp",
    categoryName: "STP & EtherChannel",
    title: "Kích hoạt Rapid-PVST+ (IEEE 802.1w hội tụ cực nhanh)",
    mode: "Switch(config)#",
    cmd: "spanning-tree mode rapid-pvst",
    scenario: "Triển khai ngay khi cài đặt Switch để thay thế giao thức STP cổ điển (802.1D).",
    why: "STP cổ điển mất 30 - 50 giây để hội tụ khi đứt cáp (Listening -> Learning -> Forwarding). Rapid-PVST+ hội tụ chỉ trong vòng < 2 giây nhờ cơ chế bắt tay Proposal/Agreement trực tiếp.",
    prereq: "Nên bật trên tất cả các Switch trong cùng mạng doanh nghiệp để đạt hiệu quả cao nhất.",
    example: "Switch(config)# spanning-tree mode rapid-pvst",
    verify: "show spanning-tree summary (Kiểm tra: Switch is in rapid-pvst mode)."
  },
  {
    id: "cli-stp-root",
    category: "stp",
    categoryName: "STP & EtherChannel",
    title: "Chỉ định Switch làm Root Bridge (Gốc cây Spanning Tree)",
    mode: "Switch(config)#",
    cmd: "spanning-tree vlan <VLAN_ID> priority <4096_BOI_SO>\n(Hoặc: spanning-tree vlan <ID> root primary)",
    scenario: "Trong mô hình mạng phân tầng (Core - Distribution - Access), Switch Core mạnh nhất phải luôn là Root Bridge.",
    why: "Nếu không cấu hình, một Switch Access rẻ tiền có thể vô tình trở thành Root Bridge (do MAC nhỏ hơn), dẫn đến lưu lượng toàn công ty bị thắt cổ chai chạy vòng vèo qua switch yếu.",
    prereq: "Chỉ số Priority phải là bội số của 4096 (0, 4096, 8192, 12288, 16384, ...). Mặc định là 32768.",
    example: "Core-SW01(config)# spanning-tree vlan 1-100 priority 4096\nDist-SW02(config)# spanning-tree vlan 1-100 priority 8192  ! (Làm Root phụ dự phòng)",
    verify: "show spanning-tree vlan 10 (Hiển thị: 'This bridge is the root')."
  },
  {
    id: "cli-stp-portfast-bpdu",
    category: "stp",
    categoryName: "STP & EtherChannel",
    title: "Cấu hình STP PortFast và BPDU Guard trên cổng cắm máy trạm",
    mode: "Switch(config-if)#",
    cmd: "spanning-tree portfast\nspanning-tree bpduguard enable\n(Hoặc bật toàn cục: spanning-tree portfast default)",
    scenario: "Bắt buộc trên mọi cổng Access nối tới End Devices (PC, Server, Printer, Camera).",
    why: "PortFast bỏ qua giai đoạn Listening & Learning, chuyển ngay sang Forwarding để máy trạm nhận IP DHCP ngay mà không bị timeout. BPDU Guard sẽ lập tức ngắt cổng (err-disable) nếu ai đó cắm lậu 1 con Switch lạ vào cổng này.",
    prereq: "TUYỆT ĐỐI KHÔNG bật PortFast trên cổng nối giữa Switch với Switch hoặc Router (sẽ gây loop sập mạng).",
    example: "Switch(config)# interface range FastEthernet 0/1 - 48\nSwitch(config-if-range)# switchport mode access\nSwitch(config-if-range)# spanning-tree portfast\nSwitch(config-if-range)# spanning-tree bpduguard enable",
    verify: "show running-config interface f0/1\nshow interfaces status err-disabled (Kiểm tra cổng có bị khóa do vi phạm BPDU không)."
  },
  {
    id: "cli-stp-lacp-l2",
    category: "stp",
    categoryName: "STP & EtherChannel",
    title: "Gom kênh băng thông Layer 2 EtherChannel qua chuẩn LACP (802.3ad)",
    mode: "Switch(config-if)#",
    cmd: "interface range <INT_RANGE>\n channel-group <ID> mode active\ninterface port-channel <ID>\n switchport mode trunk",
    scenario: "Cần tăng băng thông uplink giữa Switch Access lên Switch Core (ví dụ gộp 2 hoặc 4 cổng 1Gbps thành 2Gbps/4Gbps) và tạo đường dự phòng không bị STP block.",
    why: "Nếu nối 2 dây giữa 2 Switch, STP sẽ khóa 1 dây để chống loop. EtherChannel gom nhiều đường vật lý thành 1 đường logic duy nhất (Port-Channel), vừa nhân đôi băng thông vừa cân bằng tải.",
    prereq: "Tất cả các cổng tham gia nhóm phải giống hệt nhau về: Tốc độ (Speed), Duplex, VLAN, và trạng thái Trunk.",
    example: "Switch-A(config)# interface range GigabitEthernet 0/1 - 2\nSwitch-A(config-if-range)# channel-group 1 mode active\nSwitch-A(config-if-range)# exit\nSwitch-A(config)# interface port-channel 1\nSwitch-A(config-if)# switchport mode trunk\nSwitch-A(config-if)# switchport trunk allowed vlan 10,20,30\n\n! Switch đối diện (Switch-B):\nSwitch-B(config)# interface range GigabitEthernet 0/1 - 2\nSwitch-B(config-if-range)# channel-group 1 mode active\nSwitch-B(config-if-range)# exit\nSwitch-B(config)# interface port-channel 1\nSwitch-B(config-if)# switchport mode trunk",
    verify: "show etherchannel summary (Kiểm tra cờ 'SU' = Layer2 In Use, và các cổng có cờ 'P' = Bundled in port-channel)."
  },
  {
    id: "cli-stp-lacp-l3",
    category: "stp",
    categoryName: "STP & EtherChannel",
    title: "Cấu hình Routed Layer 3 EtherChannel (Gom kênh định tuyến có IP)",
    mode: "Switch(config-if)#",
    cmd: "interface range <INT_RANGE>\n no switchport\n channel-group <ID> mode active\ninterface port-channel <ID>\n no switchport\n ip address <IP> <MASK>",
    scenario: "Kết nối băng thông lớn giữa 2 Switch Core Layer 3 trong mạng doanh nghiệp chạy OSPF.",
    why: "Không chạy Spanning Tree ở Layer 2, biến đường gom thành cổng định tuyến Tầng 3 trực tiếp, hội tụ định tuyến siêu nhanh và ổn định.",
    prereq: "Thiết bị là Multilayer Switch có hỗ trợ tính năng `ip routing` và lệnh `no switchport`.",
    example: "Core1(config)# ip routing\nCore1(config)# interface range g0/1 - 2\nCore1(config-if-range)# no switchport\nCore1(config-if-range)# channel-group 10 mode active\nCore1(config-if-range)# exit\nCore1(config)# interface port-channel 10\nCore1(config-if)# no switchport\nCore1(config-if)# ip address 10.0.0.1 255.255.255.252",
    verify: "show etherchannel summary (Kiểm tra cờ 'RU' = Layer3 In Use, và ping thông sang IP đầu bên kia)."
  },

  // ==================== D. ĐỊNH TUYẾN TẦNG 3 & OSPF ====================
  {
    id: "cli-routing-svi",
    category: "routing",
    categoryName: "Định Tuyến & OSPF",
    title: "Cấu hình SVI (Switch Virtual Interface) làm Gateway trên Switch L3",
    mode: "Switch(config)#",
    cmd: "ip routing\ninterface vlan <VLAN_ID>\n ip address <GW_IP> <SUBNET_MASK>\n no shutdown",
    scenario: "Triển khai định tuyến giữa các VLAN (Inter-VLAN Routing) tốc độ cao phần cứng (Wire-speed) trên Core Switch.",
    why: "Nhanh hơn gấp nhiều lần giải pháp Router-on-a-Stick truyền thống vì việc chuyển mạch và định tuyến gói tin được xử lý hoàn toàn bằng chip ASIC phần cứng.",
    prereq: "Bắt buộc phải gõ lệnh `ip routing` ở Global Config để Switch kích hoạt chức năng Router.",
    example: "CoreSW(config)# ip routing\nCoreSW(config)# interface vlan 10\nCoreSW(config-if)# description Gateway-Phong-Ke-Toan\nCoreSW(config-if)# ip address 192.168.10.1 255.255.255.0\nCoreSW(config-if)# no shutdown\nCoreSW(config)# interface vlan 20\nCoreSW(config-if)# description Gateway-Phong-Ky-Thuat\nCoreSW(config-if)# ip address 192.168.20.1 255.255.255.0\nCoreSW(config-if)# no shutdown",
    verify: "show ip interface brief (Kiểm tra Vlan10, Vlan20 trạng thái Status: Up, Protocol: Up)\nshow ip route (Xem các mạng directly connected C)."
  },
  {
    id: "cli-routing-roas",
    category: "routing",
    categoryName: "Định Tuyến & OSPF",
    title: "Cấu hình Router-on-a-Stick (Inter-VLAN qua Sub-interfaces)",
    mode: "Router(config)#",
    cmd: "interface <PARENT_INT>.<SUB_ID>\n encapsulation dot1Q <VLAN_ID>\n ip address <GW_IP> <SUBNET_MASK>",
    scenario: "Khi công ty dùng Switch Layer 2 thuần túy (không hỗ trợ định tuyến) và có một Router trung tâm.",
    why: "Cho phép 1 cổng vật lý duy nhất của Router có thể đóng vai trò làm Default Gateway cho nhiều VLAN khác nhau thông qua các cổng phụ luận lý (Sub-interfaces).",
    prereq: "Cổng vật lý chính của Router phải bật (`no shutdown`) và cổng Switch nối lên Router phải là cổng Trunk.",
    example: "Router(config)# interface GigabitEthernet 0/0/0\nRouter(config-if)# no shutdown\nRouter(config-if)# exit\nRouter(config)# interface GigabitEthernet 0/0/0.10\nRouter(config-subif)# encapsulation dot1Q 10\nRouter(config-subif)# ip address 192.168.10.1 255.255.255.0\nRouter(config-subif)# interface GigabitEthernet 0/0/0.20\nRouter(config-subif)# encapsulation dot1Q 20\nRouter(config-subif)# ip address 192.168.20.1 255.255.255.0",
    verify: "show ip route (Thấy các mạng 192.168.10.0 và 20.0 xuất hiện dạng Connected trên cổng phụ g0/0/0.10 và g0/0/0.20)."
  },
  {
    id: "cli-routing-static",
    category: "routing",
    categoryName: "Định Tuyến & OSPF",
    title: "Cấu hình Default Route hướng ra ISP & Floating Static Route dự phòng",
    mode: "Router(config)#",
    cmd: "ip route 0.0.0.0 0.0.0.0 <NEXT_HOP_ISP_CHINH>\nip route 0.0.0.0 0.0.0.0 <NEXT_HOP_ISP_PHU> <AD_CAO_HON>",
    scenario: "Mạng doanh nghiệp thuê 2 đường truyền Internet (VNPT chính, Viettel dự phòng).",
    why: "Default Route hướng toàn bộ lưu lượng không rõ địa chỉ ra Internet. Bằng cách gán Administrative Distance (AD) cao hơn cho đường Viettel (ví dụ AD = 10, so với mặc định 1 của VNPT), đường phụ sẽ tự động nhảy lên khi đường chính bị đứt cáp.",
    prereq: "Cổng nối ra modem/nhà mạng ISP phải ping thông được Next-hop IP của nhà mạng.",
    example: "Router(config)# ip route 0.0.0.0 0.0.0.0 203.162.0.1\nRouter(config)# ip route 0.0.0.0 0.0.0.0 118.69.0.1 10",
    verify: "show ip route (Lúc bình thường chỉ thấy route 203.162.0.1 với AD 1. Khi rút dây mạng, route 118.69.0.1 nhảy vào bảng)."
  },
  {
    id: "cli-routing-ospf",
    category: "routing",
    categoryName: "Định Tuyến & OSPF",
    title: "Cấu hình giao thức định tuyến động OSPFv2 (Single/Multi-Area)",
    mode: "Router(config)#",
    cmd: "router ospf <PROCESS_ID>\n router-id <ROUTER_ID_IP>\n network <NET> <WILDCARD_MASK> area <AREA_ID>\n passive-interface <USER_INTERFACE>",
    scenario: "Hạ tầng mạng từ vừa đến lớn gồm nhiều Router và Switch Layer 3 cần tự động trao đổi và cập nhật bảng định tuyến.",
    why: "OSPF là giao thức chuẩn mở (Link-State), hội tụ nhanh, không bị loop nhờ giải thuật Dijkstra SPF, chia Area giảm tải CPU. Đặt Router-ID thủ công để tránh tranh chấp; đặt passive-interface để không bắn gói tin Hello lãng phí ra mạng cắm máy tính người dùng.",
    prereq: "Tính toán đúng Wildcard Mask (Lấy 255.255.255.255 trừ Subnet Mask. Ví dụ /24 là 0.0.0.255).",
    example: "R1(config)# router ospf 1\nR1(config-router)# router-id 1.1.1.1\nR1(config-router)# network 10.1.1.0 0.0.0.3 area 0\nR1(config-router)# network 192.168.10.0 0.0.0.255 area 0\nR1(config-router)# passive-interface GigabitEthernet 0/0/1\nR1(config-router)# auto-cost reference-bandwidth 1000",
    verify: "show ip ospf neighbor (Trạng thái láng giềng phải đạt FULL/DR hoặc FULL/BDR)\nshow ip route ospf (Xem các route ký hiệu 'O')."
  },
  {
    id: "cli-routing-ospf-default",
    category: "routing",
    categoryName: "Định Tuyến & OSPF",
    title: "Quảng bá Default Route ra toàn mạng OSPF",
    mode: "Router(config-router)#",
    cmd: "router ospf <PROCESS_ID>\n default-information originate [always]",
    scenario: "Router biên (Edge/Gateway Router) nối ra Internet muốn chia sẻ đường ra Internet cho tất cả các Router nội bộ khác.",
    why: "Giúp các Router nhánh bên trong không cần phải cấu hình Default Route thủ công bằng tay. Mọi thay đổi ở Router biên sẽ được đồng bộ tự động qua OSPF Type-5 LSA (O*E2).",
    prereq: "Router biên phải có sẵn một Default Route đang hoạt động (trừ khi dùng thêm từ khóa `always`).",
    example: "Edge-Router(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1\nEdge-Router(config)# router ospf 1\nEdge-Router(config-router)# default-information originate",
    verify: "Đứng trên Router nội bộ gõ: show ip route | include 0.0.0.0\n(Thấy tuyến: O*E2 0.0.0.0/0 [110/1] via Edge-Router-IP)."
  },
  {
    id: "cli-routing-hsrp",
    category: "routing",
    categoryName: "Định Tuyến & OSPF",
    title: "Cấu hình dự phòng Gateway FHRP bằng giao thức Cisco HSRP",
    mode: "Router(config-if)#",
    cmd: "standby <GROUP> ip <VIRTUAL_GW_IP>\nstandby <GROUP> priority <PRIORITY_VAL>\nstandby <GROUP> preempt",
    scenario: "Hệ thống có 2 Router hoặc 2 Switch Core chạy song song làm Default Gateway cho người dùng.",
    why: "Máy tính PC chỉ cấu hình được 1 IP Default Gateway duy nhất. HSRP tạo ra 1 IP và MAC ảo (Virtual Gateway). Khi Router chính chết, Router phụ lập tức tiếp quản địa chỉ ảo đó trong vòng mili-giây mà người dùng không bị mất mạng.",
    prereq: "Cả 2 Router phải nằm chung phân đoạn mạng LAN và thống nhất cùng Virtual IP và Group ID.",
    example: "! Router 1 (Active Gateway chính):\nR1(config)# interface g0/0/1\nR1(config-if)# ip address 192.168.1.2 255.255.255.0\nR1(config-if)# standby 1 ip 192.168.1.1\nR1(config-if)# standby 1 priority 110\nR1(config-if)# standby 1 preempt\n\n! Router 2 (Standby Gateway phụ):\nR2(config)# interface g0/0/1\nR2(config-if)# ip address 192.168.1.3 255.255.255.0\nR2(config-if)# standby 1 ip 192.168.1.1\nR2(config-if)# standby 1 priority 90",
    verify: "show standby brief (Thấy R1 trạng thái 'Active', R2 trạng thái 'Standby', Virtual IP là 192.168.1.1)."
  },

  // ==================== E. DỊCH VỤ MẠNG & AN NINH IP ====================
  {
    id: "cli-services-dhcp",
    category: "services",
    categoryName: "Dịch Vụ IP (DHCP/NAT/NTP)",
    title: "Cấu hình dịch vụ DHCP Server cấp phát IP tự động",
    mode: "Router(config)#",
    cmd: "ip dhcp excluded-address <LOW_IP> [HIGH_IP]\nip dhcp pool <POOL_NAME>\n network <NET_ID> <MASK>\n default-router <GW_IP>\n dns-server <DNS_IP>\n domain-name <DOMAIN>\n lease <DAYS> [HOURS]",
    scenario: "Cấp địa chỉ IP động cho hàng trăm máy tính, điện thoại, thiết bị IoT trong văn phòng.",
    why: "Tiết kiệm thời gian cấu hình thủ công từng máy, tránh xung đột IP. Cần loại trừ (excluded) dải IP tĩnh dùng cho Router Gateway, Switch, Máy chủ và Máy in.",
    prereq: "Xác định rõ dải IP mạng, IP Gateway và danh sách DNS Server (như 8.8.8.8, 1.1.1.1).",
    example: "Router(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.30\nRouter(config)# ip dhcp pool LAN_OFFICE\nRouter(dhcp-config)# network 192.168.10.0 255.255.255.0\nRouter(dhcp-config)# default-router 192.168.10.1\nRouter(dhcp-config)# dns-server 8.8.8.8 1.1.1.1\nRouter(dhcp-config)# domain-name cisco.com\nRouter(dhcp-config)# lease 7",
    verify: "show ip dhcp binding (Xem danh sách các IP đã được cấp cho MAC nào)\nshow ip dhcp pool (Xem số lượng IP còn trống)."
  },
  {
    id: "cli-services-helper",
    category: "services",
    categoryName: "Dịch Vụ IP (DHCP/NAT/NTP)",
    title: "Cấu hình DHCP Relay Agent vượt qua Router (ip helper-address)",
    mode: "Router(config-if)#",
    cmd: "interface <LAN_INT>\n ip helper-address <DHCP_SERVER_IP>",
    scenario: "Doanh nghiệp đặt máy chủ Windows Server DHCP tập trung ở phòng Server (VLAN 100), trong khi các máy client ở các VLAN khác (VLAN 10, 20).",
    why: "Gói tin DHCP Discover là Broadcast Tầng 3 (255.255.255.255) và Router mặc định sẽ drop gói Broadcast. Lệnh này biến gói Broadcast thành Unicast hướng thẳng về địa chỉ máy chủ DHCP.",
    prereq: "Cấu hình trực tiếp trên cổng Interface (hoặc Sub-interface/SVI) trực tiếp quay mặt về phía máy client.",
    example: "Router(config)# interface GigabitEthernet 0/0/1.10\nRouter(config-subif)# ip helper-address 10.10.100.50",
    verify: "Kiểm tra máy trạm PC ở VLAN 10 xin được địa chỉ IP thành công từ máy chủ 10.10.100.50."
  },
  {
    id: "cli-services-pat",
    category: "services",
    categoryName: "Dịch Vụ IP (DHCP/NAT/NTP)",
    title: "Cấu hình NAT Overload (PAT) cho phép toàn bộ mạng LAN ra Internet",
    mode: "Router(config)#",
    cmd: "access-list <ACL_NUM> permit <SRC_LAN> <WILDCARD>\nip nat inside source list <ACL_NUM> interface <WAN_INT> overload\ninterface <LAN_INT>\n ip nat inside\ninterface <WAN_INT>\n ip nat outside",
    scenario: "Hầu như tất cả các công ty trên thế giới đều dùng PAT để đưa hàng ngàn máy tính dùng IP Private (192.168.x.x, 10.x.x.x) ra Internet chỉ với 1 địa chỉ IP Public duy nhất.",
    why: "Địa chỉ IPv4 công cộng cạn kiệt và đắt đỏ. PAT ánh xạ địa chỉ IP nguồn và số cổng Port Layer 4 (Port Number) để phân biệt các phiên kết nối của từng máy tính.",
    prereq: "Phải gắn chính xác nhãn `ip nat inside` trên cổng mạng nội bộ và `ip nat outside` trên cổng quay ra Internet.",
    example: "Router(config)# access-list 1 permit 192.168.0.0 0.0.255.255\nRouter(config)# ip nat inside source list 1 interface GigabitEthernet 0/0/0 overload\nRouter(config)# interface GigabitEthernet 0/0/1\nRouter(config-if)# ip nat inside\nRouter(config)# interface GigabitEthernet 0/0/0\nRouter(config-if)# ip nat outside",
    verify: "show ip nat translations (Xem bảng chuyển dịch IP và Port)\nshow ip nat statistics (Xem tỷ lệ trúng/trượt NAT)."
  },
  {
    id: "cli-services-static-nat",
    category: "services",
    categoryName: "Dịch Vụ IP (DHCP/NAT/NTP)",
    title: "Cấu hình Static NAT 1-1 (Public máy chủ nội bộ ra ngoài Internet)",
    mode: "Router(config)#",
    cmd: "ip nat inside source static <PRIVATE_IP> <PUBLIC_IP>\ninterface <LAN_INT>\n ip nat inside\ninterface <WAN_INT>\n ip nat outside",
    scenario: "Khi doanh nghiệp đặt Web Server, Mail Server hoặc VPN Gateway trong mạng nội bộ và cần người dùng toàn cầu truy cập được.",
    why: "Tạo liên kết tĩnh vĩnh viễn 1-1 giữa địa chỉ IP Private và 1 địa chỉ IP Public cố định.",
    prereq: "Phải sở hữu IP Public tĩnh từ nhà mạng ISP và khai báo đúng inside/outside interface.",
    example: "Router(config)# ip nat inside source static 192.168.10.80 203.0.113.80\nRouter(config)# interface g0/0/1\nRouter(config-if)# ip nat inside\nRouter(config)# interface g0/0/0\nRouter(config-if)# ip nat outside",
    verify: "show ip nat translations (Thấy dòng ánh xạ cố định Static giữa 192.168.10.80 và 203.0.113.80)."
  },
  {
    id: "cli-services-ntp",
    category: "services",
    categoryName: "Dịch Vụ IP (DHCP/NAT/NTP)",
    title: "Đồng bộ thời gian hệ thống qua giao thức NTP (Network Time Protocol)",
    mode: "Router(config)#",
    cmd: "ntp server <IP_OR_FQDN>\nclock timezone <ZONE_NAME> <OFFSET_HOURS>",
    scenario: "Cấu hình bắt buộc trên toàn bộ hệ thống mạng của mọi công ty.",
    why: "Khi điều tra sự cố an ninh mạng hoặc đọc nhật ký Syslog, thời gian trên các thiết bị phải khớp đến từng mili-giây. Nếu lệch giờ, chứng chỉ số SSL/TLS sẽ báo lỗi và không thể đối chiếu log tấn công.",
    prereq: "Thiết bị có thể kết nối Internet tới NTP Server hoặc có máy chủ NTP nội bộ (UDP port 123).",
    example: "Router(config)# clock timezone ICT 7 0\nRouter(config)# ntp server 216.239.35.0\nRouter(config)# ntp server pool.ntp.org",
    verify: "show ntp status (Kiểm tra dòng 'Clock is synchronized', stratum level)\nshow clock (Kiểm tra giờ hiện tại đã đúng múi giờ chưa)."
  },

  // ==================== F. AN NINH MẠNG, ACL & BẢO MẬT CỔNG ====================
  {
    id: "cli-sec-port-security",
    category: "security",
    categoryName: "Bảo Mật & ACL",
    title: "Cấu hình bảo mật cổng Switch (Port Security - Chống cắm trộm)",
    mode: "Switch(config-if)#",
    cmd: "switchport mode access\nswitchport port-security\nswitchport port-security maximum <NUM>\nswitchport port-security mac-address sticky\nswitchport port-security violation [shutdown | restrict | protect]",
    scenario: "Áp dụng cho các cổng mạng cắm ở khu vực công cộng, sảnh lễ tân, phòng họp mở.",
    why: "Ngăn chặn kẻ gian rút dây mạng máy in/camera để cắm laptop lạ vào hack hệ thống. Tùy chọn `sticky` giúp Switch tự động học và lưu địa chỉ MAC của thiết bị hợp lệ; nếu phát hiện MAC lạ sẽ lập tức sập cổng (shutdown) đưa về trạng thái err-disabled.",
    prereq: "Cổng phải ở chế độ Access cố định (`switchport mode access`), không hỗ trợ trên cổng Dynamic Trunk.",
    example: "Switch(config)# interface FastEthernet 0/5\nSwitch(config-if)# switchport mode access\nSwitch(config-if)# switchport port-security\nSwitch(config-if)# switchport port-security maximum 1\nSwitch(config-if)# switchport port-security mac-address sticky\nSwitch(config-if)# switchport port-security violation shutdown",
    verify: "show port-security interface f0/5 (Port Security: Enabled, Violation Mode: Shutdown)\nshow port-security address (Xem các địa chỉ MAC đã học sticky)."
  },
  {
    id: "cli-sec-std-acl",
    category: "security",
    categoryName: "Bảo Mật & ACL",
    title: "Cấu hình Standard ACL (Lọc lưu lượng theo địa chỉ IP nguồn)",
    mode: "Router(config)#",
    cmd: "access-list <1-99> [permit | deny] <SRC_IP> <WILDCARD>\ninterface <INT>\n ip access-group <1-99> [in | out]",
    scenario: "Chặn toàn bộ một dải mạng phòng ban không được đi tới một phân vùng mạng khác.",
    why: "Standard ACL là bộ lọc đơn giản, tiêu tốn cực ít tài nguyên CPU. Quy tắc vàng của Cisco: 'Đặt Standard ACL CÀNG GẦN ĐÍCH CÀNG TỐT' (vì chỉ lọc IP nguồn, đặt gần nguồn sẽ chặn nhầm cả các dịch vụ hợp lệ khác).",
    prereq: "Cuối mỗi ACL luôn có luật ngầm định `deny ip any any` (chặn tất cả những gì không được phép).",
    example: "! Chặn dải 192.168.10.0/24 truy cập phòng Server (10.0.0.0/24):\nRouter(config)# access-list 10 deny 192.168.10.0 0.0.0.255\nRouter(config)# access-list 10 permit any\nRouter(config)# interface GigabitEthernet 0/0/2\nRouter(config-if)# ip access-group 10 out",
    verify: "show access-lists 10 (Kiểm tra các dòng lệnh và số đếm gói tin matches)."
  },
  {
    id: "cli-sec-ext-acl",
    category: "security",
    categoryName: "Bảo Mật & ACL",
    title: "Cấu hình Extended Named ACL chuyên sâu (Lọc theo IP, Protocol & Port)",
    mode: "Router(config)#",
    cmd: "ip access-list extended <TEN_ACL>\n [permit | deny] <PROTOCOL> <SRC_NET> <SRC_WILD> [eq <PORT>] <DST_NET> <DST_WILD> [eq <PORT>]\ninterface <INT>\n ip access-group <TEN_ACL> [in | out]",
    scenario: "Kiểm soát chi tiết: Cho phép nhân viên lướt Web (HTTP/HTTPS) và DNS nhưng cấm tuyệt đối SSH/Telnet và Ping (ICMP) vào máy chủ.",
    why: "Extended ACL cho phép kiểm tra cả Layer 3 (IP nguồn/đích) và Layer 4 (TCP/UDP Port). Quy tắc vàng của Cisco: 'Đặt Extended ACL CÀNG GẦN NGUỒN CÀNG TỐT' để loại bỏ gói tin rác ngay lập tức trước khi nó chiếm băng thông đường truyền.",
    prereq: "Nắm vững danh sách Well-Known Ports: TCP 80 (HTTP), TCP 443 (HTTPS), TCP 22 (SSH), TCP 23 (Telnet), UDP 53 (DNS).",
    example: "Router(config)# ip access-list extended SECURE_FIREWALL\nRouter(config-ext-nacl)# remark Cho phep truy cap Web va DNS\nRouter(config-ext-nacl)# permit tcp 192.168.1.0 0.0.0.255 any eq 80\nRouter(config-ext-nacl)# permit tcp 192.168.1.0 0.0.0.255 any eq 443\nRouter(config-ext-nacl)# permit udp 192.168.1.0 0.0.0.255 any eq 53\nRouter(config-ext-nacl)# remark Chan toan bo ket noi Telnet va SSH ra ngoai\nRouter(config-ext-nacl)# deny tcp any any eq 23\nRouter(config-ext-nacl)# deny tcp any any eq 22\nRouter(config-ext-nacl)# permit ip any any\nRouter(config-ext-nacl)# exit\nRouter(config)# interface GigabitEthernet 0/0/1\nRouter(config-if)# ip access-group SECURE_FIREWALL in",
    verify: "show ip access-lists SECURE_FIREWALL (Xem số lượng gói tin bị chặn và cho phép)."
  },
  {
    id: "cli-sec-dhcp-snoop",
    category: "security",
    categoryName: "Bảo Mật & ACL",
    title: "Cấu hình DHCP Snooping chống máy chủ DHCP giả mạo (Rogue DHCP)",
    mode: "Switch(config)#",
    cmd: "ip dhcp snooping\nip dhcp snooping vlan <VLAN_LIST>\ninterface <UPLINK_INT>\n ip dhcp snooping trust",
    scenario: "Phòng chống kẻ tấn công cắm 1 cục phát Wi-Fi hoặc máy tính giả làm DHCP Server để cấp Gateway giả, thực hiện tấn công Man-in-the-Middle (MITM).",
    why: "DHCP Snooping phân loại các cổng của Switch thành Trust (Tin cậy) và Untrust (Không tin cậy). Chỉ cổng Uplink nối lên Server/Router mới được gán 'Trust', mọi gói tin DHCP Offer/ACK từ cổng Untrust của người dùng sẽ bị Switch drop ngay lập tức.",
    prereq: "Bật tính năng toàn cục trước, sau đó bật trên từng VLAN cụ thể.",
    example: "Switch(config)# ip dhcp snooping\nSwitch(config)# ip dhcp snooping vlan 10,20\nSwitch(config)# interface GigabitEthernet 0/1\nSwitch(config-if)# ip dhcp snooping trust",
    verify: "show ip dhcp snooping (Xem danh sách VLAN kích hoạt và cổng Trusted)\nshow ip dhcp snooping binding (Xem bảng ánh xạ MAC-IP hợp lệ)."
  },

  // ==================== G. CẤU HÌNH IPV6 ====================
  {
    id: "cli-ipv6-base",
    category: "ipv6",
    categoryName: "IPv6 Toàn Diện",
    title: "Kích hoạt định tuyến IPv6 & Gán địa chỉ Global Unicast / Link-Local",
    mode: "Router(config)#",
    cmd: "ipv6 unicast-routing\ninterface <INT>\n ipv6 address <IPV6_ADDR>/<PREFIX>\n ipv6 address fe80::1 link-local\n no shutdown",
    scenario: "Chuyển dịch hạ tầng mạng doanh nghiệp hỗ trợ công nghệ thế hệ mới Dual-Stack (chạy đồng thời IPv4 và IPv6).",
    why: "Mặc định Router Cisco TẮT chức năng chuyển tiếp gói tin IPv6. Phải gõ `ipv6 unicast-routing`. Việc gán Link-Local tĩnh dễ nhớ (như fe80::1) giúp cấu hình Next-hop và OSPFv3 gọn gàng, trực quan.",
    prereq: "Nắm vững quy tắc rút gọn địa chỉ IPv6 (bỏ số 0 đứng đầu, thay dãy số 0 liên tiếp bằng dấu hai chấm kép `::`).",
    example: "Router(config)# ipv6 unicast-routing\nRouter(config)# interface GigabitEthernet 0/0/0\nRouter(config-if)# ipv6 address 2001:db8:acad:1::1/64\nRouter(config-if)# ipv6 address fe80::1 link-local\nRouter(config-if)# no shutdown",
    verify: "show ipv6 interface brief (Kiểm tra địa chỉ Global và Link-Local của cổng)\nshow ipv6 route (Xem bảng định tuyến IPv6)."
  },
  {
    id: "cli-ipv6-ospfv3",
    category: "ipv6",
    categoryName: "IPv6 Toàn Diện",
    title: "Cấu hình giao thức định tuyến OSPFv3 cho mạng IPv6",
    mode: "Router(config)#",
    cmd: "ipv6 router ospf <PROCESS_ID>\n router-id <IPV4_FORMAT_ID>\ninterface <INT>\n ipv6 ospf <PROCESS_ID> area <AREA_ID>",
    scenario: "Định tuyến động các mạng IPv6 nội bộ thay thế OSPFv2.",
    why: "Khác với OSPFv2 khai báo bằng câu lệnh `network` ở chế độ Router, OSPFv3 được bật TRỰC TIẾP trên từng Interface cụ thể. OSPFv3 bắt buộc phải cấu hình Router-ID theo định dạng 32-bit (dạng giống IPv4 A.B.C.D).",
    prereq: "Lệnh `ipv6 unicast-routing` đã được bật toàn cục.",
    example: "Router(config)# ipv6 router ospf 10\nRouter(config-rtr)# router-id 2.2.2.2\nRouter(config-rtr)# exit\nRouter(config)# interface GigabitEthernet 0/0/0\nRouter(config-if)# ipv6 ospf 10 area 0",
    verify: "show ipv6 ospf neighbor\nshow ipv6 route ospf"
  },

  // ==================== H. KIỂM TRA & XỬ LÝ SỰ CỐ (TROUBLESHOOTING) ====================
  {
    id: "cli-show-ip-int-brief",
    category: "troubleshoot",
    categoryName: "Kiểm Tra & Xử Lý Sự Cố",
    title: "Kiểm tra nhanh trạng thái Up/Down và IP của toàn bộ cổng",
    mode: "Router# / Switch#",
    cmd: "show ip interface brief (viết tắt: sh ip int br)",
    scenario: "Câu lệnh đầu tiên luôn luôn phải gõ khi thiết bị mạng gặp sự cố mất kết nối hoặc khi vừa thi công cắm dây xong.",
    why: "Cung cấp cái nhìn tổng quan tức thì về: Địa chỉ IP của cổng, Trạng thái vật lý Layer 1 (Status: Up/Down/Administratively Down) và Trạng thái liên kết dữ liệu Layer 2 (Protocol: Up/Down).",
    prereq: "Chạy ở chế độ Privileged EXEC (dấu #) hoặc thêm tiền tố `do` nếu đang ở trong config mode.",
    example: "Router# show ip interface brief\nInterface              IP-Address      OK? Method Status                Protocol\nGigabitEthernet0/0/0   203.0.113.2     YES manual up                    up\nGigabitEthernet0/0/1   192.168.1.1     YES manual up                    up\nGigabitEthernet0/0/2   unassigned      YES unset  administratively down down",
    verify: "Nếu Status là `administratively down`, nguyên nhân là chưa gõ `no shutdown`. Nếu Status Up nhưng Protocol Down, nguyên nhân là lỗi cáp, bấm sai đầu dây hoặc sai encapsulation."
  },
  {
    id: "cli-show-ip-route",
    category: "troubleshoot",
    categoryName: "Kiểm Tra & Xử Lý Sự Cố",
    title: "Xem bảng định tuyến IP (Routing Table) của Router",
    mode: "Router#",
    cmd: "show ip route [ospf | static | connected]",
    scenario: "Khi máy trạm báo không thể kết nối tới một máy chủ hoặc chi nhánh khác.",
    why: "Kiểm tra xem Router có biết đường đi tới mạng đích hay không. Hiển thị mã nguồn định tuyến: `C` (Connected), `S` (Static), `O` (OSPF), `D` (EIGRP), `*` (Tuyến mặc định Default Route).",
    prereq: "Giao thức định tuyến đã được cấu hình và các interface tương ứng đang Up.",
    example: "Router# show ip route\nGateway of last resort is 203.0.113.1 to network 0.0.0.0\nS*    0.0.0.0/0 [1/0] via 203.0.113.1\nC     192.168.1.0/24 is directly connected, GigabitEthernet0/0/1\nO     10.10.20.0/24 [110/2] via 10.0.0.2, 00:15:42, GigabitEthernet0/0/0",
    verify: "Nếu không thấy dải mạng đích trong bảng định tuyến, gói tin chắc chắn sẽ bị drop (Destination Host Unreachable)."
  },
  {
    id: "cli-show-vlan-trunk",
    category: "troubleshoot",
    categoryName: "Kiểm Tra & Xử Lý Sự Cố",
    title: "Kiểm tra đường Trunk và cấu hình VLAN trên Switch",
    mode: "Switch#",
    cmd: "show interfaces trunk\nshow vlan brief",
    scenario: "Khi 2 máy trạm cùng thuộc VLAN 10 nhưng cắm ở 2 Switch khác nhau không thể ping thông cho nhau.",
    why: "90% lỗi trong mạng Layer 2 là do đường Trunk chưa hình thành, lệch Native VLAN (Native VLAN Mismatch cảnh báo bởi CDP), hoặc VLAN bị loại khỏi danh sách Allowed VLAN trên đường Trunk.",
    prereq: "Đã cắm cáp liên kết giữa 2 Switch.",
    example: "Switch# show interfaces trunk\nPort        Mode             Encapsulation  Status        Native vlan\nGi0/1       on               802.1q         trunking      1\n\nPort        Vlans allowed on trunk\nGi0/1       10,20,30",
    verify: "Kiểm tra Native VLAN của 2 đầu Switch có khớp nhau không và VLAN cần truyền có nằm trong 'Vlans in spanning tree forwarding state and not pruned' không."
  },
  {
    id: "cli-show-cdp-lldp",
    category: "troubleshoot",
    categoryName: "Kiểm Tra & Xử Lý Sự Cố",
    title: "Dò tìm sơ đồ mạng với CDP và LLDP (Hàng xóm láng giềng)",
    mode: "Router# / Switch#",
    cmd: "show cdp neighbors detail\nshow lldp neighbors detail",
    scenario: "Khi tiếp quản hệ thống mạng của một công ty mới mà không có sơ đồ tài liệu thiết kế mạng để lại.",
    why: "CDP (Cisco Discovery Protocol) và LLDP (Link Layer Discovery Protocol) giúp 'nhìn xuyên dây cáp', cho biết đầu cáp bên kia đang cắm vào thiết bị hãng gì, dòng máy gì, chạy IP nào, và cắm vào đúng cổng nào.",
    prereq: "CDP được bật mặc định trên thiết bị Cisco. Với thiết bị hãng khác hoặc muốn dùng LLDP, gõ `lldp run` ở global config.",
    example: "Switch# show cdp neighbors\nDevice ID        Local Intrfce     Holdtme    Capability  Platform  Port ID\nDist-SW01        Gig 0/1           145              S I   WS-C2960+ Gig 0/24\nEdge-Router      Gig 0/24          162            R S I   ISR4321   Gig 0/0/0",
    verify: "Dùng thông tin này để vẽ lại chính xác 100% sơ đồ đấu nối vật lý của cả hệ thống mạng."
  },
  {
    id: "cli-show-nat",
    category: "troubleshoot",
    categoryName: "Kiểm Tra & Xử Lý Sự Cố",
    title: "Kiểm tra phiên dịch địa chỉ NAT và xử lý nghẽn cổng",
    mode: "Router#",
    cmd: "show ip nat translations\nshow ip nat statistics\nclear ip nat translation *",
    scenario: "Khi người dùng mạng nội bộ báo mất mạng Internet hoặc máy chủ Web bị quá tải kết nối NAT.",
    why: "`show ip nat translations` cho biết phiên kết nối của IP Private nào đang đi ra ngoài qua IP Public và Port nào. Lệnh `clear ip nat translation *` dùng để giải phóng tức thì các bảng NAT bị treo hoặc rác bộ nhớ.",
    prereq: "Router đã được cấu hình dịch vụ NAT.",
    example: "Router# show ip nat translations\nPro Inside global      Inside local       Outside local      Outside global\ntcp 203.0.113.2:49152  192.168.1.50:49152 142.250.71.14:443 142.250.71.14:443",
    verify: "Kiểm tra số lượng active translations trong lệnh `show ip nat statistics` xem có bị chạm trần bộ nhớ RAM của Router không."
  }
];

// --------------------------------------------------------------------------
// 2. BẢNG GHI NHỚ THẦN TỐC (GOLDEN CRAM TABLES CHO KỲ THI CCNA)
// --------------------------------------------------------------------------
const CCNA_CRAM_TABLES = {
  ad: [
    { route: "Connected (Nối trực tiếp)", ad: 0, note: "Độ tin cậy tuyệt đối (gắn trực tiếp trên cổng)" },
    { route: "Static Route (Tuyến tĩnh)", ad: 1, note: "Do người quản trị cấu hình thủ công" },
    { route: "eBGP (BGP đối ngoại)", ad: 20, note: "Định tuyến giữa các hệ thống tự trị Internet (AS)" },
    { route: "EIGRP Internal (Nội bộ)", ad: 90, note: "Giao thức định tuyến nâng cao của Cisco" },
    { route: "OSPF", ad: 110, note: "Giao thức chuẩn mở Link-State thông dụng nhất CCNA" },
    { route: "IS-IS", ad: 115, note: "Thường dùng trong mạng ISP và Service Provider" },
    { route: "RIP", ad: 120, note: "Distance-Vector cổ điển, giới hạn tối đa 15 hops" },
    { route: "EIGRP External (Ngoại vi)", ad: 170, note: "Route được redistribute từ giao thức khác vào EIGRP" },
    { route: "iBGP (BGP nội bộ)", ad: 200, note: "Chạy bên trong cùng một Autonomous System" },
    { route: "Unreachable (Không thể tới)", ad: 255, note: "Router sẽ vứt bỏ route này, không bao giờ dùng" }
  ],
  ports: [
    { port: "FTP (File Transfer)", num: "TCP 20 (Data), TCP 21 (Control)", desc: "Truyền file văn bản không mã hóa" },
    { port: "SSH (Secure Shell)", num: "TCP 22", desc: "Quản trị từ xa có mã hóa (Thay thế Telnet)" },
    { port: "Telnet", num: "TCP 23", desc: "Quản trị dòng lệnh văn bản thô (Không an toàn)" },
    { port: "SMTP", num: "TCP 25", desc: "Gửi thư điện tử giữa các Mail Server" },
    { port: "DNS", num: "UDP 53 (Queries) / TCP 53 (Zone Transfer)", desc: "Phân giải tên miền thành địa chỉ IP" },
    { port: "DHCP", num: "UDP 67 (Server), UDP 68 (Client)", desc: "Cấp phát cấu hình IP tự động" },
    { port: "TFTP", num: "UDP 69", desc: "Truyền file không nén nhẹ qua UDP (backup IOS)" },
    { port: "HTTP", num: "TCP 80", desc: "Giao thức truyền siêu văn bản Web không mã hóa" },
    { port: "NTP", num: "UDP 123", desc: "Đồng bộ thời gian chuẩn đồng hồ hệ thống" },
    { port: "SNMP", num: "UDP 161 (Poll/Get), UDP 162 (Trap)", desc: "Giám sát trạng thái thiết bị mạng từ xa" },
    { port: "BGP", num: "TCP 179", desc: "Trao đổi bảng định tuyến Internet qua kết nối TCP tin cậy" },
    { port: "HTTPS (SSL/TLS)", num: "TCP 443", desc: "Duyệt web an toàn có chứng chỉ mã hóa" },
    { port: "Syslog", num: "UDP 514", desc: "Chuyển tiếp nhật ký hoạt động về máy chủ tập trung" }
  ],
  syslog: [
    { level: 0, name: "Emergency", desc: "Hệ thống sập hoàn toàn không thể sử dụng (System is unusable)" },
    { level: 1, name: "Alert", desc: "Cần hành động can thiệp khẩn cấp ngay lập tức (Action must be taken immediately)" },
    { level: 2, name: "Critical", desc: "Tình trạng nguy kịch, hỏng hóc phần cứng cốt lõi (Critical conditions)" },
    { level: 3, name: "Error", desc: "Lỗi vận hành dịch vụ hệ thống (Error conditions)" },
    { level: 4, name: "Warning", desc: "Cảnh báo nguy cơ tiềm ẩn có thể gây lỗi (Warning conditions)" },
    { level: 5, name: "Notice", desc: "Sự kiện bình thường nhưng quan trọng (Interface Up/Down, cấu hình thay đổi)" },
    { level: 6, name: "Informational", desc: "Thông tin vận hành thông thường (Informational messages)" },
    { level: 7, name: "Debugging", desc: "Thông tin gỡ lỗi chi tiết chuyên sâu của kỹ sư (Tiêu tốn CPU rất lớn)" }
  ],
  multicast: [
    { ip: "224.0.0.1", usage: "Tất cả các host trong mạng cục bộ LAN (All hosts)" },
    { ip: "224.0.0.2", usage: "Tất cả các Router trong mạng cục bộ LAN (All routers)" },
    { ip: "224.0.0.5", usage: "OSPF: Tất cả Router OSPF (All OSPF Routers)" },
    { ip: "224.0.0.6", usage: "OSPF: Dành riêng cho DR và BDR trao đổi" },
    { ip: "224.0.0.9", usage: "RIPv2 Multicast" },
    { ip: "224.0.0.10", usage: "EIGRP Multicast" },
    { ip: "224.0.0.102", usage: "HSRP Version 2 (So với 224.0.0.2 của HSRP v1)" },
    { ip: "01:80:C2:00:00:00", usage: "Địa chỉ MAC Multicast chuẩn của gói tin STP BPDU" }
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

  // Thời gian: 45 phút cho bài thi thử
  mockExamSecondsLeft = Math.round((mockExamQuestions.length / 30) * 45 * 60);

  const modal = document.getElementById("mock-exam-modal");
  if (modal) modal.classList.add("active");

  const resultsView = document.getElementById("exam-results-view");
  const activeView = document.getElementById("exam-active-view");
  if (resultsView) resultsView.style.display = "none";
  if (activeView) activeView.style.display = "flex";

  startExamTimer();
  renderMockExamQuestion();
  renderMockExamNavigator();
}

function startExamTimer() {
  clearInterval(mockExamTimerInterval);
  updateTimerDisplay();

  mockExamTimerInterval = setInterval(() => {
    mockExamSecondsLeft--;
    updateTimerDisplay();

    if (mockExamSecondsLeft <= 0) {
      clearInterval(mockExamTimerInterval);
      alert("Hết giờ làm bài! Hệ thống đang tự động nộp bài thi của bạn.");
      finishMockExam(true);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerEl = document.getElementById("exam-timer-display");
  if (!timerEl) return;

  const minutes = Math.floor(mockExamSecondsLeft / 60);
  const seconds = mockExamSecondsLeft % 60;
  timerEl.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  if (mockExamSecondsLeft <= 300) {
    timerEl.classList.add("warning");
  } else {
    timerEl.classList.remove("warning");
  }
}

function renderMockExamQuestion() {
  const q = mockExamQuestions[mockExamCurrentIndex];
  if (!q) return;

  const qNumEl = document.getElementById("exam-question-num");
  const qDomainEl = document.getElementById("exam-question-domain");
  const qTextEl = document.getElementById("exam-question-text");
  const qOptionsEl = document.getElementById("exam-options-container");
  const flagBtn = document.getElementById("exam-flag-btn");

  if (qNumEl) qNumEl.textContent = `Câu ${mockExamCurrentIndex + 1}/${mockExamQuestions.length}`;
  if (qDomainEl) qDomainEl.textContent = q.domain;
  if (qTextEl) qTextEl.innerHTML = formatExamRichText(q.question);

  if (flagBtn) {
    if (mockExamFlagged[mockExamCurrentIndex]) {
      flagBtn.classList.add("active");
      flagBtn.innerHTML = `★ Đã đánh dấu`;
    } else {
      flagBtn.classList.remove("active");
      flagBtn.innerHTML = `☆ Đánh dấu xem lại`;
    }
  }

  if (qOptionsEl) {
    const letters = ["A", "B", "C", "D", "E", "F"];
    const currentSelected = mockExamUserAnswers[mockExamCurrentIndex];

    qOptionsEl.innerHTML = q.options
      .map((opt, idx) => {
        const isSelected = currentSelected === idx;
        return `
          <label class="exam-option-card ${isSelected ? "selected" : ""}" onclick="selectExamOption(${idx})">
            <span class="exam-opt-indicator">${letters[idx]}</span>
            <span class="exam-opt-text">${formatExamRichText(opt)}</span>
          </label>
        `;
      })
      .join("");
  }

  // Update footer button states
  const prevBtn = document.getElementById("exam-prev-btn");
  const nextBtn = document.getElementById("exam-next-btn");
  if (prevBtn) prevBtn.disabled = mockExamCurrentIndex === 0;
  if (nextBtn) {
    if (mockExamCurrentIndex === mockExamQuestions.length - 1) {
      nextBtn.textContent = "Nộp bài thi";
      nextBtn.classList.add("btn-finish");
    } else {
      nextBtn.textContent = "Câu tiếp theo →";
      nextBtn.classList.remove("btn-finish");
    }
  }
}

window.selectExamOption = function(idx) {
  mockExamUserAnswers[mockExamCurrentIndex] = idx;
  renderMockExamQuestion();
  renderMockExamNavigator();
};

function renderMockExamNavigator() {
  const navContainer = document.getElementById("exam-navigator-grid");
  if (!navContainer) return;

  navContainer.innerHTML = mockExamQuestions
    .map((_, idx) => {
      const isAnswered = typeof mockExamUserAnswers[idx] !== "undefined";
      const isCurrent = idx === mockExamCurrentIndex;
      const isFlagged = !!mockExamFlagged[idx];

      let classes = ["exam-nav-pill"];
      if (isCurrent) classes.push("current");
      if (isAnswered) classes.push("answered");
      if (isFlagged) classes.push("flagged");

      return `
        <button type="button" class="${classes.join(" ")}" onclick="jumpToExamQuestion(${idx})">
          ${idx + 1}
        </button>
      `;
    })
    .join("");
}

window.jumpToExamQuestion = function(idx) {
  if (idx >= 0 && idx < mockExamQuestions.length) {
    mockExamCurrentIndex = idx;
    renderMockExamQuestion();
    renderMockExamNavigator();
  }
};

function finishMockExam(isTimeout = false) {
  clearInterval(mockExamTimerInterval);
  mockExamIsRunning = false;

  let totalQuestions = mockExamQuestions.length;
  let correctCount = 0;
  let domainStats = {};

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

  // Điểm số tính theo thang điểm Pearson VUE (300 - 1000 điểm, qua môn là 825/1000)
  const percentage = totalQuestions > 0 ? (correctCount / totalQuestions) : 0;
  const scaledScore = Math.round(300 + percentage * 700);
  const isPassed = scaledScore >= 825;

  const activeView = document.getElementById("exam-active-view");
  const resultsView = document.getElementById("exam-results-view");
  if (activeView) activeView.style.display = "none";
  if (resultsView) resultsView.style.display = "block";

  // Hiển thị kết quả tổng quan
  const scoreBanner = document.getElementById("exam-score-banner");
  if (scoreBanner) {
    scoreBanner.className = `exam-score-banner ${isPassed ? "pass" : "fail"}`;
    scoreBanner.innerHTML = `
      <div class="banner-badge">${isPassed ? "PASS — ĐẠT CHUẨN CCNA" : "FAIL — CẦN ÔN TẬP THÊM"}</div>
      <div class="banner-score">${scaledScore} <span class="score-max">/ 1000</span></div>
      <div class="banner-desc">
        ${isPassed 
          ? `Chúc mừng bạn! Bạn đã đạt ${Math.round(percentage * 100)}% (${correctCount}/${totalQuestions} câu đúng), vượt qua điểm sàn 825 của kỳ thi Pearson VUE CCNA 200-301.`
          : `Bạn đạt ${Math.round(percentage * 100)}% (${correctCount}/${totalQuestions} câu đúng). Điểm chuẩn yêu cầu của Cisco là 825/1000. Hãy xem phân tích yếu kém bên dưới để củng cố lại kiến thức!`}
      </div>
    `;
  }

  // Phân tích chi tiết từng Domain Cisco CCNA
  const domainBreakdown = document.getElementById("exam-domain-breakdown");
  if (domainBreakdown) {
    domainBreakdown.innerHTML = Object.keys(domainStats)
      .map((dName) => {
        const d = domainStats[dName];
        const dPct = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
        const isGood = dPct >= 80;
        return `
          <div class="domain-stat-row">
            <div class="domain-header">
              <span class="domain-name">${dName}</span>
              <span class="domain-pct ${isGood ? "good" : "weak"}">${dPct}% (${d.correct}/${d.total})</span>
            </div>
            <div class="domain-bar">
              <div class="domain-bar-fill ${isGood ? "good" : "weak"}" style="width: ${dPct}%"></div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  // Danh sách lời giải chi tiết
  const reviewContainer = document.getElementById("exam-solution-review");
  if (reviewContainer) {
    const letters = ["A", "B", "C", "D", "E", "F"];
    reviewContainer.innerHTML = mockExamQuestions
      .map((q, idx) => {
        const userAns = mockExamUserAnswers[idx];
        const isCorrect = userAns === q.answerIndex;
        const userAnsText = typeof userAns !== "undefined" ? `${letters[userAns]}. ${q.options[userAns]}` : "Chưa trả lời";
        const correctAnsText = `${letters[q.answerIndex]}. ${q.options[q.answerIndex]}`;

        return `
          <div class="solution-card ${isCorrect ? "correct" : "incorrect"}">
            <div class="sol-header">
              <span class="sol-tag">${isCorrect ? "✓ Đúng" : "✗ Sai"}</span>
              <span class="sol-qnum">Câu ${idx + 1} (${q.domain})</span>
            </div>
            <div class="sol-qtext">${formatExamRichText(q.question)}</div>
            <div class="sol-answers-grid">
              <div class="sol-ans-box user">
                <span class="sol-label">Lựa chọn của bạn:</span>
                <span class="sol-val ${isCorrect ? "text-success" : "text-danger"}">${formatExamRichText(userAnsText)}</span>
              </div>
              <div class="sol-ans-box correct">
                <span class="sol-label">Đáp án chuẩn Cisco:</span>
                <span class="sol-val text-success">${formatExamRichText(correctAnsText)}</span>
              </div>
            </div>
            <div class="sol-explanation">
              <strong>💡 Giải thích chi tiết:</strong> ${formatExamRichText(q.explanation)}
            </div>
          </div>
        `;
      })
      .join("");
  }
}

function closeMockExamModal() {
  if (mockExamIsRunning) {
    if (!confirm("Bài thi đang diễn ra! Bạn có chắc muốn thoát không? Kết quả sẽ không được lưu.")) {
      return;
    }
  }
  clearInterval(mockExamTimerInterval);
  mockExamIsRunning = false;
  const modal = document.getElementById("mock-exam-modal");
  if (modal) modal.classList.remove("active");
}

// --------------------------------------------------------------------------
// 4. CHEAT SHEET & CRAM TABLES UI RENDERER
// --------------------------------------------------------------------------
function openCheatSheetModal(defaultTab = "commands") {
  const modal = document.getElementById("cheatsheet-modal");
  if (modal) {
    modal.classList.add("active");
    renderCheatSheetTab(defaultTab);
  }
}

function closeCheatSheetModal() {
  const modal = document.getElementById("cheatsheet-modal");
  if (modal) modal.classList.remove("active");
}

function renderCheatSheetTab(tabKey) {
  // Update active tab buttons
  const tabBtns = document.querySelectorAll(".cs-tab-btn");
  tabBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabKey);
  });

  const contentArea = document.getElementById("cheatsheet-tab-content");
  if (!contentArea) return;

  if (tabKey === "commands") {
    renderCheatSheetCommands(contentArea);
  } else if (tabKey === "cram-ad") {
    renderCramTableAD(contentArea);
  } else if (tabKey === "cram-ports") {
    renderCramTablePorts(contentArea);
  } else if (tabKey === "cram-syslog") {
    renderCramTableSyslog(contentArea);
  } else if (tabKey === "cram-multicast") {
    renderCramTableMulticast(contentArea);
  }
}

function renderCheatSheetCommands(container) {
  container.innerHTML = `
    <div class="cs-controls-bar">
      <div class="cs-search-wrap">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input type="text" id="cs-search-input" placeholder="Tìm lệnh nhanh (ví dụ: ospf, trunk, nat, vlan, portfast, show)..." autocomplete="off" />
      </div>
      <div class="cs-category-filter" id="cs-category-filter">
        <button type="button" class="cs-filter-pill active" data-cat="all">Tất cả (${CCNA_CHEAT_SHEET_DATA.length})</button>
        <button type="button" class="cs-filter-pill" data-cat="basic">Căn bản</button>
        <button type="button" class="cs-filter-pill" data-cat="vlan">VLAN & Trunk</button>
        <button type="button" class="cs-filter-pill" data-cat="stp">STP & EtherChannel</button>
        <button type="button" class="cs-filter-pill" data-cat="routing">Định tuyến L3</button>
        <button type="button" class="cs-filter-pill" data-cat="services">Dịch vụ IP</button>
        <button type="button" class="cs-filter-pill" data-cat="security">Bảo mật & ACL</button>
        <button type="button" class="cs-filter-pill" data-cat="ipv6">IPv6</button>
        <button type="button" class="cs-filter-pill" data-cat="troubleshoot">Show & Khắc phục lỗi</button>
      </div>
    </div>
    <div class="cs-commands-list" id="cs-commands-list"></div>
  `;

  const searchInput = document.getElementById("cs-search-input");
  const listEl = document.getElementById("cs-commands-list");
  const catPills = container.querySelectorAll(".cs-filter-pill");

  let currentCat = "all";
  let currentSearch = "";

  const filterAndDraw = () => {
    const q = currentSearch.toLowerCase();
    const filtered = CCNA_CHEAT_SHEET_DATA.filter((item) => {
      const matchCat = currentCat === "all" || item.category === currentCat;
      const matchSearch =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.cmd && item.cmd.toLowerCase().includes(q)) ||
        (item.scenario && item.scenario.toLowerCase().includes(q)) ||
        (item.why && item.why.toLowerCase().includes(q)) ||
        (item.example && item.example.toLowerCase().includes(q)) ||
        (item.verify && item.verify.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="cs-empty">Không tìm thấy lệnh nào khớp với từ khóa "<strong>${escapeHtml(currentSearch)}</strong>".</div>`;
      return;
    }

    listEl.innerHTML = filtered
      .map(
        (item) => `
        <div class="cs-cmd-card" id="${item.id}">
          <div class="cs-cmd-header">
            <h4 class="cs-cmd-title">${escapeHtml(item.title)}</h4>
            <div class="cs-cmd-meta">
              <span class="cs-badge">${escapeHtml(item.categoryName)}</span>
              <span class="cs-mode">${escapeHtml(item.mode)}</span>
            </div>
          </div>

          <pre class="cs-code-wrap"><code>${escapeHtml(item.cmd)}</code><button type="button" class="cs-copy-btn" title="Sao chép cú pháp lệnh" onclick="copyCheatSheetCmd(this, \`${item.cmd.replace(/`/g, "\\`").replace(/\\/g, "\\\\")}\`)">Copy Lệnh</button></pre>

          <div class="cs-details-grid">
            <div class="cs-detail-box">
              <span class="cs-detail-label">🎯 Trường hợp sử dụng (Khi nào dùng):</span>
              <span class="cs-detail-text">${formatExamRichText(item.scenario)}</span>
            </div>
            <div class="cs-detail-box">
              <span class="cs-detail-label">💡 Tại sao &amp; Công dụng kỹ thuật:</span>
              <span class="cs-detail-text">${formatExamRichText(item.why)}</span>
            </div>
            <div class="cs-detail-box">
              <span class="cs-detail-label">⚙️ Điều kiện tiên quyết:</span>
              <span class="cs-detail-text">${formatExamRichText(item.prereq)}</span>
            </div>
          </div>

          <div class="cs-example-wrap">
            <div class="cs-example-head">
              <span>💻 VÍ DỤ CẤU HÌNH THỰC TẾ CHI TIẾT</span>
              <button type="button" class="cs-copy-btn" title="Sao chép ví dụ" onclick="copyCheatSheetCmd(this, \`${item.example.replace(/`/g, "\\`").replace(/\\/g, "\\\\")}\`)">Copy Ví Dụ</button>
            </div>
            <pre class="cs-example-code"><code>${escapeHtml(item.example)}</code></pre>
          </div>

          <div class="cs-verify-row">
            <span class="cs-verify-label">🔍 Lệnh kiểm tra nghiệm thu (Verify):</span>
            <span class="cs-verify-cmd">${formatExamRichText(item.verify)}</span>
          </div>
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
    .map(
      (r) => `
      <tr>
        <td><strong>${escapeHtml(r.route)}</strong></td>
        <td style="color:#0284c7;font-weight:bold;font-size:1.15rem;text-align:center;">${r.ad}</td>
        <td style="color:#64748b;font-size:0.86rem;">${escapeHtml(r.note)}</td>
      </tr>`
    )
    .join("");

  container.innerHTML = `
    <div class="cs-table-card">
      <h3 class="cs-table-title">Bảng Độ Ưu Tiên Tuyến Đường (Administrative Distance - AD)</h3>
      <p class="cs-table-desc">Quy tắc vàng CCNA: Khi Router học cùng một mạng đích từ nhiều nguồn khác nhau, nó luôn chọn tuyến có AD NHỎ NHẤT để đưa vào Routing Table.</p>
      <table class="tech-table">
        <thead>
          <tr>
            <th style="width: 35%">Nguồn Định Tuyến (Routing Source)</th>
            <th style="width: 20%; text-align: center">Chỉ Số AD Mặc Định</th>
            <th style="width: 45%">Ý Nghĩa &amp; Ghi Chú Kỹ Thuật</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderCramTablePorts(container) {
  const rows = CCNA_CRAM_TABLES.ports
    .map(
      (r) => `
      <tr>
        <td><strong>${escapeHtml(r.port)}</strong></td>
        <td><code class="inline-code">${escapeHtml(r.num)}</code></td>
        <td style="color:#64748b;font-size:0.86rem;">${escapeHtml(r.desc)}</td>
      </tr>`
    )
    .join("");

  container.innerHTML = `
    <div class="cs-table-card">
      <h3 class="cs-table-title">Bảng Cổng Dịch Vụ Mạng Cốt Lõi (Well-Known Port Numbers 0 - 1023)</h3>
      <p class="cs-table-desc">Cực kỳ quan trọng trong đề thi CCNA khi cấu hình Extended Access-Control Lists (ACL) và kiểm tra Firewall.</p>
      <table class="tech-table">
        <thead>
          <tr>
            <th style="width: 30%">Tên Giao Thức</th>
            <th style="width: 35%">Số Cổng (Port) &amp; Tầng 4</th>
            <th style="width: 35%">Chức Năng Chính</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderCramTableSyslog(container) {
  const rows = CCNA_CRAM_TABLES.syslog
    .map(
      (r) => `
      <tr>
        <td style="font-weight:bold;color:#0284c7;text-align:center;font-size:1.15rem;">${r.level}</td>
        <td><strong>${escapeHtml(r.name)}</strong></td>
        <td>${escapeHtml(r.desc)}</td>
      </tr>`
    )
    .join("");

  container.innerHTML = `
    <div class="cs-table-card">
      <h3 class="cs-table-title">Bảng 8 Mức Độ Ghi Nhận Nhật Ký Hệ Thống (Syslog Severity Levels 0 - 7)</h3>
      <p class="cs-table-desc">Mẹo ghi nhớ siêu tốc đi thi CCNA: <em>"Every Alien Should Eat M&amp;Ms Daily"</em> (Emergency, Alert, Critical, Error, Warning, Notice, Informational, Debugging).</p>
      <table class="tech-table">
        <thead>
          <tr>
            <th style="width: 15%; text-align: center">Mức Độ</th>
            <th style="width: 25%">Tên Chuẩn Cisco</th>
            <th style="width: 60%">Mô Tả &amp; Trường Hợp Xảy Ra</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderCramTableMulticast(container) {
  const rows = CCNA_CRAM_TABLES.multicast
    .map(
      (r) => `
      <tr>
        <td><code class="inline-code">${escapeHtml(r.ip)}</code></td>
        <td>${escapeHtml(r.usage)}</td>
      </tr>`
    )
    .join("");

  container.innerHTML = `
    <div class="cs-table-card">
      <h3 class="cs-table-title">Bảng Địa Chỉ Multicast IPv4 &amp; MAC Thường Gặp</h3>
      <p class="cs-table-desc">Các địa chỉ Multicast dành riêng cho định tuyến động và chuyển mạch Tầng 2.</p>
      <table class="tech-table">
        <thead>
          <tr>
            <th style="width: 35%">Địa Chỉ Multicast</th>
            <th style="width: 65%">Giao Thức &amp; Mục Đích Sử Dụng</th>
          </tr>
        </thead>
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
