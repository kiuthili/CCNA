// ==========================================================================
// CCNA LEARNING — MASTER CLI COMMANDS, EXAM SIMULATOR & CRAM TABLES
// Module hỗ trợ thi đỗ CCNA 200-301 (v1.1 & v2.0) 100% & Vận hành mạng thực tế
// ==========================================================================

// --------------------------------------------------------------------------
// 1. DATA: BỘ TỪ ĐIỂN LỆNH CISCO IOS CHUYÊN SÂU (PRODUCTION & CCNA READY)
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
    cmd: "interface <UPLINK_INT>\n switchport trunk encapsulation dot1q\n switchport mode trunk\n switchport trunk native vlan <NATIVE_VLAN_ID>",
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
    example: "Switch(config-if)# switchport trunk allowed vlan 10,20,99\nSwitch(config-if)# switchport trunk allowed vlan add 30",
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
    cmd: "spanning-tree vlan <VLAN_ID> priority <4096_BOI_SO>",
    scenario: "Trong mô hình mạng phân tầng (Core - Distribution - Access), Switch Core mạnh nhất phải luôn là Root Bridge.",
    why: "Nếu không cấu hình, một Switch Access rẻ tiền có thể vô tình trở thành Root Bridge (do MAC nhỏ hơn), dẫn đến lưu lượng toàn công ty bị thắt cổ chai chạy vòng vèo qua switch yếu.",
    prereq: "Chỉ số Priority phải là bội số của 4096 (0, 4096, 8192, 12288, 16384, ...). Mặc định là 32768.",
    example: "Core-SW01(config)# spanning-tree vlan 1-100 priority 4096\nDist-SW02(config)# spanning-tree vlan 1-100 priority 8192",
    verify: "show spanning-tree vlan 10 (Hiển thị: 'This bridge is the root')."
  },
  {
    id: "cli-stp-portfast-bpdu",
    category: "stp",
    categoryName: "STP & EtherChannel",
    title: "Cấu hình STP PortFast và BPDU Guard trên cổng cắm máy trạm",
    mode: "Switch(config-if)#",
    cmd: "spanning-tree portfast\nspanning-tree bpduguard enable",
    scenario: "Bắt buộc trên mọi cổng Access nối tới End Devices (PC, Server, Printer, Camera).",
    why: "PortFast bỏ qua giai đoạn Listening & Learning, chuyển ngay sang Forwarding để máy trạm nhận IP DHCP ngay mà không bị timeout. BPDU Guard sẽ lập tức ngắt cổng (err-disable) nếu ai đó cắm lậu 1 con Switch lạ vào cổng này.",
    prereq: "TUYỆT ĐỐI KHÔNG bật PortFast trên cổng nối giữa Switch với Switch hoặc Router (sẽ gây loop sập mạng).",
    example: "Switch(config)# interface range FastEthernet 0/1 - 48\nSwitch(config-if-range)# switchport mode access\nSwitch(config-if-range)# spanning-tree portfast\nSwitch(config-if-range)# spanning-tree bpduguard enable",
    verify: "show running-config interface f0/1\nshow interfaces status err-disabled"
  },
  {
    id: "cli-stp-lacp-l2",
    category: "stp",
    categoryName: "STP & EtherChannel",
    title: "Gom kênh băng thông Layer 2 EtherChannel qua chuẩn LACP (802.3ad)",
    mode: "Switch(config-if)#",
    cmd: "interface range <INT_RANGE>\n channel-group <ID> mode active\ninterface port-channel <ID>\n switchport mode trunk",
    scenario: "Cần tăng băng thông uplink giữa Switch Access lên Switch Core và tạo đường dự phòng không bị STP block.",
    why: "Nếu nối 2 dây giữa 2 Switch, STP sẽ khóa 1 dây để chống loop. EtherChannel gom nhiều đường vật lý thành 1 đường logic duy nhất (Port-Channel), vừa nhân đôi băng thông vừa cân bằng tải.",
    prereq: "Tất cả các cổng tham gia nhóm phải giống hệt nhau về: Tốc độ (Speed), Duplex, VLAN, và trạng thái Trunk.",
    example: "Switch-A(config)# interface range GigabitEthernet 0/1 - 2\nSwitch-A(config-if-range)# channel-group 1 mode active\nSwitch-A(config-if-range)# exit\nSwitch-A(config)# interface port-channel 1\nSwitch-A(config-if)# switchport mode trunk",
    verify: "show etherchannel summary (Kiểm tra cờ 'SU' = Layer2 In Use, và các cổng có cờ 'P' = Bundled in port-channel)."
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
    example: "CoreSW(config)# ip routing\nCoreSW(config)# interface vlan 10\nCoreSW(config-if)# description Gateway-Phong-Ke-Toan\nCoreSW(config-if)# ip address 192.168.10.1 255.255.255.0\nCoreSW(config-if)# no shutdown",
    verify: "show ip interface brief (Kiểm tra Vlan10 Status: Up, Protocol: Up)\nshow ip route (Xem các mạng directly connected C)."
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
    example: "Router(config)# interface GigabitEthernet 0/0/0\nRouter(config-if)# no shutdown\nRouter(config-if)# exit\nRouter(config)# interface GigabitEthernet 0/0/0.10\nRouter(config-subif)# encapsulation dot1Q 10\nRouter(config-subif)# ip address 192.168.10.1 255.255.255.0",
    verify: "show ip route (Thấy các mạng 192.168.10.0 xuất hiện dạng Connected trên g0/0/0.10)."
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
    example: "R1(config)# router ospf 1\nR1(config-router)# router-id 1.1.1.1\nR1(config-router)# network 10.1.1.0 0.0.0.3 area 0\nR1(config-router)# network 192.168.10.0 0.0.0.255 area 0\nR1(config-router)# passive-interface GigabitEthernet 0/0/1",
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
    verify: "show ip route | include 0.0.0.0 (Thấy tuyến O*E2 trên các router bên trong)."
  },

  // ==================== E. DỊCH VỤ MẠNG & AN NINH IP ====================
  {
    id: "cli-services-dhcp",
    category: "services",
    categoryName: "Dịch Vụ IP (DHCP/NAT/NTP)",
    title: "Cấu hình dịch vụ DHCP Server cấp phát IP tự động",
    mode: "Router(config)#",
    cmd: "ip dhcp excluded-address <LOW_IP> [HIGH_IP]\nip dhcp pool <POOL_NAME>\n network <NET_ID> <MASK>\n default-router <GW_IP>\n dns-server <DNS_IP>",
    scenario: "Cấp địa chỉ IP động cho hàng trăm máy tính, điện thoại, thiết bị IoT trong văn phòng.",
    why: "Tiết kiệm thời gian cấu hình thủ công từng máy, tránh xung đột IP. Cần loại trừ (excluded) dải IP tĩnh dùng cho Router Gateway, Switch, Máy chủ và Máy in.",
    prereq: "Xác định rõ dải IP mạng, IP Gateway và danh sách DNS Server (như 8.8.8.8, 1.1.1.1).",
    example: "Router(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.30\nRouter(config)# ip dhcp pool LAN_OFFICE\nRouter(dhcp-config)# network 192.168.10.0 255.255.255.0\nRouter(dhcp-config)# default-router 192.168.10.1\nRouter(dhcp-config)# dns-server 8.8.8.8 1.1.1.1",
    verify: "show ip dhcp binding (Xem danh sách các IP đã được cấp cho MAC nào)."
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
    verify: "show ip nat translations (Xem bảng chuyển dịch IP và Port)\nshow ip nat statistics."
  },
  {
    id: "cli-services-ntp",
    category: "services",
    categoryName: "Dịch Vụ IP (DHCP/NAT/NTP)",
    title: "Đồng bộ thời gian hệ thống qua giao thức NTP (Network Time Protocol)",
    mode: "Router(config)#",
    cmd: "ntp server <IP_OR_FQDN>\nclock timezone <ZONE_NAME> <OFFSET_HOURS>",
    scenario: "Cấu hình bắt buộc trên toàn bộ hệ thống mạng của mọi công ty.",
    why: "Khi điều tra sự cố an ninh mạng hoặc đối chiếu nhật ký Syslog, thời gian trên các thiết bị phải khớp đến từng mili-giây. Nếu lệch giờ, chứng chỉ số SSL/TLS sẽ báo lỗi và không thể đối chiếu log tấn công.",
    prereq: "Thiết bị có thể kết nối Internet tới NTP Server hoặc có máy chủ NTP nội bộ (UDP port 123).",
    example: "Router(config)# clock timezone ICT 7 0\nRouter(config)# ntp server pool.ntp.org",
    verify: "show ntp status (Kiểm tra dòng 'Clock is synchronized', stratum level)\nshow clock."
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
    verify: "show port-security interface f0/5 (Port Security: Enabled, Violation Mode: Shutdown)\nshow port-security address."
  },
  {
    id: "cli-sec-ext-acl",
    category: "security",
    categoryName: "Bảo Mật & ACL",
    title: "Cấu hình Extended Named ACL chuyên sâu (Lọc theo IP, Protocol & Port)",
    mode: "Router(config)#",
    cmd: "ip access-list extended <TEN_ACL>\n [permit | deny] <PROTOCOL> <SRC_NET> <SRC_WILD> [eq <PORT>] <DST_NET> <DST_WILD> [eq <PORT>]\ninterface <INT>\n ip access-group <TEN_ACL> [in | out]",
    scenario: "Kiểm soát chi tiết: Cho phép nhân viên lướt Web (HTTP/HTTPS) và DNS nhưng cấm tuyệt đối SSH/Telnet và Ping (ICMP) vào máy chủ.",
    why: "Extended ACL cho phép kiểm tra cả Layer 3 (IP nguồn/đích) và Layer 4 (TCP/UDP Port). Đặt Extended ACL càng gần nguồn càng tốt để loại bỏ gói tin rác ngay lập tức trước khi nó chiếm băng thông đường truyền.",
    prereq: "Nắm vững danh sách Well-Known Ports: TCP 80 (HTTP), TCP 443 (HTTPS), TCP 22 (SSH), TCP 23 (Telnet), UDP 53 (DNS).",
    example: "Router(config)# ip access-list extended SECURE_FW\nRouter(config-ext-nacl)# permit tcp 192.168.1.0 0.0.0.255 any eq 80\nRouter(config-ext-nacl)# permit tcp 192.168.1.0 0.0.0.255 any eq 443\nRouter(config-ext-nacl)# deny tcp any any eq 23\nRouter(config-ext-nacl)# permit ip any any\nRouter(config)# interface GigabitEthernet 0/0/1\nRouter(config-if)# ip access-group SECURE_FW in",
    verify: "show ip access-lists SECURE_FW (Xem số lượng gói tin matches)."
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
    verify: "show ipv6 interface brief\nshow ipv6 route."
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
    example: "Router# show ip interface brief\nInterface              IP-Address      OK? Method Status                Protocol\nGigabitEthernet0/0/0   203.0.113.2     YES manual up                    up\nGigabitEthernet0/0/1   192.168.1.1     YES manual up                    up",
    verify: "Nếu Status là `administratively down`, nguyên nhân là chưa gõ `no shutdown`."
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
    example: "Router# show ip route\nGateway of last resort is 203.0.113.1 to network 0.0.0.0\nS*    0.0.0.0/0 [1/0] via 203.0.113.1\nC     192.168.1.0/24 is directly connected, GigabitEthernet0/0/1",
    verify: "Nếu không thấy dải mạng đích trong bảng định tuyến, gói tin chắc chắn sẽ bị drop."
  },
  {
    id: "cli-show-vlan-trunk",
    category: "troubleshoot",
    categoryName: "Kiểm Tra & Xử Lý Sự Cố",
    title: "Kiểm tra đường Trunk và cấu hình VLAN trên Switch",
    mode: "Switch#",
    cmd: "show interfaces trunk\nshow vlan brief",
    scenario: "Khi 2 máy trạm cùng thuộc VLAN 10 nhưng cắm ở 2 Switch khác nhau không thể ping thông cho nhau.",
    why: "90% lỗi trong mạng Layer 2 là do đường Trunk chưa hình thành, lệch Native VLAN, hoặc VLAN bị loại khỏi danh sách Allowed VLAN trên đường Trunk.",
    prereq: "Đã cắm cáp liên kết giữa 2 Switch.",
    example: "Switch# show interfaces trunk\nPort        Mode             Encapsulation  Status        Native vlan\nGi0/1       on               802.1q         trunking      1",
    verify: "Kiểm tra Native VLAN của 2 đầu Switch có khớp nhau không."
  },
  {
    id: "cli-show-cdp-lldp",
    category: "troubleshoot",
    categoryName: "Kiểm Tra & Xử Lý Sự Cố",
    title: "Dò tìm sơ đồ mạng với CDP và LLDP (Hàng xóm láng giềng)",
    mode: "Router# / Switch#",
    cmd: "show cdp neighbors detail\nshow lldp neighbors detail",
    scenario: "Khi tiếp quản hệ thống mạng của một công ty mới mà không có sơ đồ tài liệu thiết kế mạng để lại.",
    why: "CDP và LLDP giúp khám phá thông tin thiết bị đầu cáp bên kia (Model, IP, port kết nối) mà không cần cấu hình trước.",
    prereq: "CDP bật mặc định trên Cisco; LLDP cần lệnh `lldp run`.",
    example: "Switch# show cdp neighbors",
    verify: "Hiển thị Device ID, Local Interface, Port ID đối diện."
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
    { ip: "224.0.0.102", usage: "HSRP Version 2" },
    { ip: "01:80:C2:00:00:00", usage: "Địa chỉ MAC Multicast chuẩn của gói tin STP BPDU" }
  ]
};

// --------------------------------------------------------------------------
// 3. STANDALONE QUESTION BANK (ĐỀ THI THỬ CHUẨN PEARSON VUE CCNA 200-301)
// Luôn sẵn sàng hoạt động ngay lập tức (kể cả offline hay đang tải dữ liệu)
// --------------------------------------------------------------------------
const CCNA_STANDALONE_EXAM_BANK = [
  {
    id: "q-stand-01",
    domain: "1.0 Network Fundamentals",
    question_vi: "Thiết bị mạng nào hoạt động chủ yếu ở Tầng 2 (Data Link) của mô hình OSI và chuyển tiếp khung dữ liệu (frame) dựa trên địa chỉ MAC đích?",
    question_en: "Which network device operates primarily at Layer 2 of the OSI model and forwards frames based on the destination MAC address?",
    options_vi: ["Router", "Layer 2 Switch", "Hub", "Firewall Tầng 3"],
    options_en: ["Router", "Layer 2 Switch", "Hub", "Layer 3 Firewall"],
    answerIndex: 1,
    explanation_vi: "Switch Layer 2 duy trì bảng MAC Address Table và chuyển tiếp các Ethernet frame dựa trên địa chỉ MAC đích ở tầng liên kết dữ liệu.",
    explanation_en: "A Layer 2 Switch maintains a MAC address table and forwards Ethernet frames based on the destination MAC address at the Data Link layer."
  },
  {
    id: "q-stand-02",
    domain: "1.0 Network Fundamentals",
    question_vi: "Dải địa chỉ IPv4 nào dưới đây thuộc địa chỉ Private theo chuẩn RFC 1918?",
    question_en: "Which of the following IPv4 address ranges is designated as Private IP space by RFC 1918?",
    options_vi: ["172.32.0.0 - 172.64.255.255", "192.168.0.0 - 192.168.255.255", "169.254.0.0 - 169.254.255.255", "100.64.0.0 - 100.127.255.255"],
    options_en: ["172.32.0.0 - 172.64.255.255", "192.168.0.0 - 192.168.255.255", "169.254.0.0 - 169.254.255.255", "100.64.0.0 - 100.127.255.255"],
    answerIndex: 1,
    explanation_vi: "RFC 1918 định nghĩa 3 dải Private IP: 10.0.0.0/8, 172.16.0.0/12 (172.16.0.0 - 172.31.255.255), và 192.168.0.0/16 (192.168.0.0 - 192.168.255.255).",
    explanation_en: "RFC 1918 defines 3 private address spaces: 10.0.0.0/8, 172.16.0.0/12 (172.16.0.0 - 172.31.255.255), and 192.168.0.0/16."
  },
  {
    id: "q-stand-03",
    domain: "2.0 Network Access",
    question_vi: "Kích thước thẻ nhãn 802.1Q (VLAN Tag) được chèn vào tiêu đề khung Ethernet là bao nhiêu byte?",
    question_en: "What is the size of the IEEE 802.1Q VLAN tag inserted into the Ethernet frame header?",
    options_vi: ["2 bytes", "4 bytes", "8 bytes", "32 bytes"],
    options_en: ["2 bytes", "4 bytes", "8 bytes", "32 bytes"],
    answerIndex: 1,
    explanation_vi: "Thẻ IEEE 802.1Q Tag có kích thước đúng 4 bytes (gồm 2 bytes TPID 0x8100 và 2 bytes TCI chứa Priority, DEI, và 12-bit VLAN ID).",
    explanation_en: "The IEEE 802.1Q header is exactly 4 bytes long, containing TPID and TCI (PCP, DEI, and 12-bit VLAN ID)."
  },
  {
    id: "q-stand-04",
    domain: "2.0 Network Access",
    question_vi: "Lệnh nào kích hoạt tính năng chuyển ngay cổng Switch sang trạng thái Forwarding mà không cần trải qua Listening & Learning?",
    question_en: "Which command immediately transitions a switch port to the Forwarding state, bypassing Listening and Learning states?",
    options_vi: ["spanning-tree bpdufilter enable", "spanning-tree portfast", "spanning-tree guard root", "switchport mode trunk"],
    options_en: ["spanning-tree bpdufilter enable", "spanning-tree portfast", "spanning-tree guard root", "switchport mode trunk"],
    answerIndex: 1,
    explanation_vi: "STP PortFast giúp cổng nối tới máy trạm client (PC, printer) chuyển thẳng sang Forwarding để nhận DHCP kịp thời mà không phải chờ 30 giây.",
    explanation_en: "STP PortFast transitions an access port directly from Blocking to Forwarding, preventing DHCP timeouts for end stations."
  },
  {
    id: "q-stand-05",
    domain: "3.0 IP Connectivity",
    question_vi: "Chỉ số độ tin cậy tuyến đường (Administrative Distance - AD) mặc định của giao thức OSPF là bao nhiêu?",
    question_en: "What is the default Administrative Distance (AD) of the OSPF routing protocol?",
    options_vi: ["90", "100", "110", "120"],
    options_en: ["90", "100", "110", "120"],
    answerIndex: 2,
    explanation_vi: "Thứ tự AD mặc định: Connected = 0, Static = 1, eBGP = 20, EIGRP Internal = 90, OSPF = 110, RIP = 120, External EIGRP = 170, iBGP = 200.",
    explanation_en: "Default AD values: Connected = 0, Static = 1, EIGRP Internal = 90, OSPF = 110, RIP = 120."
  },
  {
    id: "q-stand-06",
    domain: "3.0 IP Connectivity",
    question_vi: "Khi Router có nhiều tuyến đường tới cùng một mạng đích, tiêu chí nào được Router xét ĐẦU TIÊN để chọn tuyến chuyển tiếp gói tin?",
    question_en: "When a router has multiple paths to the same destination in its routing table, which rule is evaluated FIRST?",
    options_vi: ["Administrative Distance thấp nhất", "Metric / Cost nhỏ nhất", "Longest Prefix Match (Độ dài Prefix dài nhất)", "Tốc độ băng thông của cổng cao nhất"],
    options_en: ["Lowest Administrative Distance", "Lowest Metric / Cost", "Longest Prefix Match", "Highest Interface Bandwidth"],
    answerIndex: 2,
    explanation_vi: "Router luôn luôn so khớp tiền tố dài nhất (Longest Prefix Match) trước tiên. Chỉ khi độ dài prefix giống nhau thì mới so sánh AD và Metric.",
    explanation_en: "The router always uses Longest Prefix Match first. If prefix lengths are identical, AD and metric are used."
  },
  {
    id: "q-stand-07",
    domain: "4.0 IP Services",
    question_vi: "Giao thức NTP (Network Time Protocol) sử dụng số cổng và giao thức Tầng 4 nào?",
    question_en: "Which transport protocol and port number does Network Time Protocol (NTP) use?",
    options_vi: ["TCP port 123", "UDP port 123", "UDP port 69", "TCP port 514"],
    options_en: ["TCP port 123", "UDP port 123", "UDP port 69", "TCP port 514"],
    answerIndex: 1,
    explanation_vi: "NTP sử dụng cổng UDP 123 để đồng bộ thời gian giữa các thiết bị mạng và máy chủ chuẩn đồng hồ nguyên tử.",
    explanation_en: "NTP operates over UDP port 123 to synchronize clocks among computer systems."
  },
  {
    id: "q-stand-08",
    domain: "4.0 IP Services",
    question_vi: "Khi mạng LAN sử dụng một máy chủ DHCP tập trung ở VLAN khác, lệnh nào cần được cấu hình trên cổng Gateway của Router?",
    question_en: "When clients use a centralized DHCP server located in another subnet, which command must be configured on the router gateway interface?",
    options_vi: ["ip dhcp snooping", "ip helper-address <DHCP_SERVER_IP>", "ip nat inside source", "default-information originate"],
    options_en: ["ip dhcp snooping", "ip helper-address <DHCP_SERVER_IP>", "ip nat inside source", "default-information originate"],
    answerIndex: 1,
    explanation_vi: "`ip helper-address` biến gói tin DHCP Discover Broadcast (255.255.255.255) thành gói Unicast để chuyển tiếp qua Router tới DHCP Server.",
    explanation_en: "The `ip helper-address` command forwards DHCP broadcast requests as unicast to the configured DHCP server IP."
  },
  {
    id: "q-stand-09",
    domain: "5.0 Security Fundamentals",
    question_vi: "Trong cấu hình Port Security trên Switch, chế độ vi phạm (Violation Mode) nào sẽ TẮT NGAY LẬP TỨC cổng và đưa vào trạng thái err-disabled khi có MAC lạ?",
    question_en: "In Cisco Port Security, which violation mode immediately shuts down the port and places it into the err-disabled state upon a violation?",
    options_vi: ["protect", "restrict", "shutdown", "disable"],
    options_en: ["protect", "restrict", "shutdown", "disable"],
    answerIndex: 2,
    explanation_vi: "Chế độ `shutdown` (mặc định) sẽ lập tức đưa cổng vào trạng thái err-disabled, gửi cảnh báo Syslog và tăng bộ đếm vi phạm.",
    explanation_en: "The `shutdown` mode immediately places the port into an err-disabled state and generates a syslog message."
  },
  {
    id: "q-stand-10",
    domain: "5.0 Security Fundamentals",
    question_vi: "Theo khuyến nghị thực hành tốt nhất của Cisco, vị trí tối ưu để đặt Extended ACL là ở đâu?",
    question_en: "According to Cisco best practices, where is the optimal placement for an Extended Access Control List (ACL)?",
    options_vi: ["Càng gần nguồn lưu lượng càng tốt", "Càng gần đích lưu lượng càng tốt", "Trên bất kỳ cổng nào của Core Switch", "Chỉ trên cổng kết nối ra ngoài Internet"],
    options_en: ["As close to the traffic source as possible", "As close to the destination as possible", "On any Core switch port", "Exclusively on the Internet WAN interface"],
    answerIndex: 0,
    explanation_vi: "Extended ACL lọc được cả IP nguồn, IP đích và Port nên cần đặt CÀNG GẦN NGUỒN CÀNG TỐT để drop gói rác ngay từ đầu, tiết kiệm băng thông mạng.",
    explanation_en: "Extended ACLs should be placed as close to the source as possible to drop unwanted packets early and save network bandwidth."
  },
  {
    id: "q-stand-11",
    domain: "6.0 Automation and Programmability",
    question_vi: "Phương thức HTTP nào trong kiến trúc REST API tương ứng với thao tác TẠO MỚI (Create) trong mô hình CRUD?",
    question_en: "Which HTTP method in a RESTful API corresponds to the CREATE operation in the CRUD model?",
    options_vi: ["GET", "POST", "PUT", "DELETE"],
    options_en: ["GET", "POST", "PUT", "DELETE"],
    answerIndex: 1,
    explanation_vi: "Ánh xạ CRUD sang HTTP: Create -> POST, Read -> GET, Update -> PUT/PATCH, Delete -> DELETE.",
    explanation_en: "CRUD to HTTP mapping: Create = POST, Read = GET, Update = PUT/PATCH, Delete = DELETE."
  },
  {
    id: "q-stand-12",
    domain: "6.0 Automation and Programmability",
    question_vi: "Công cụ quản lý cấu hình tự động (Configuration Management) nào dưới đây hoạt động theo mô hình Agentless (không cần cài phần mềm agent lên switch/router) và dùng kết nối SSH?",
    question_en: "Which configuration management tool is AGENTLESS and operates primarily over SSH?",
    options_vi: ["Puppet", "Chef", "Ansible", "SaltStack (chế độ mặc định)"],
    options_en: ["Puppet", "Chef", "Ansible", "SaltStack (default mode)"],
    answerIndex: 2,
    explanation_vi: "Ansible là công cụ Agentless nổi tiếng nhất, sử dụng Playbook định dạng YAML và đẩy cấu hình tới thiết bị mạng qua giao thức SSH an toàn.",
    explanation_en: "Ansible is agentless and uses SSH with YAML playbooks to manage network devices without installing custom software on the managed node."
  }
];

// --------------------------------------------------------------------------
// 4. MOCK EXAM SYSTEM (MÔ PHỎNG THI THỬ THỜI GIAN THỰC PEARSON VUE)
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

  // 1. Thêm câu hỏi từ ngân hàng đề độc lập (luôn sẵn sàng)
  CCNA_STANDALONE_EXAM_BANK.forEach((q, idx) => {
    pool.push({
      id: q.id || `stand-q-${idx}`,
      domain: q.domain,
      question: isEn ? q.question_en : q.question_vi,
      options: isEn ? q.options_en : q.options_vi,
      answerIndex: q.answerIndex,
      explanation: isEn ? q.explanation_en : q.explanation_vi
    });
  });

  // 2. Bổ sung từ modulesData nếu đã nạp
  if (typeof modulesData !== "undefined" && Array.isArray(modulesData) && modulesData.length > 0) {
    modulesData.forEach((mod) => {
      const qList = (isEn && typeof CCNA_QUIZ_EN !== "undefined" && CCNA_QUIZ_EN[mod.id])
        ? CCNA_QUIZ_EN[mod.id]
        : (mod.quiz || []);

      qList.forEach((q, idx) => {
        pool.push({
          id: `mod-${mod.id}-q-${idx}`,
          domain: getDomainForModule(mod.id),
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

  // Thời gian: 45 phút cho 30 câu
  mockExamSecondsLeft = Math.round((mockExamQuestions.length / 30) * 45 * 60);

  const modal = document.getElementById("mock-exam-modal");
  if (modal) {
    modal.hidden = false;
    modal.removeAttribute("hidden");
    modal.classList.add("active");
    modal.classList.remove("in-result");
  }

  const resultsView = document.getElementById("mock-exam-result-view") || document.getElementById("exam-results-view");
  const activeView = document.querySelector(".mock-exam-body") || document.getElementById("exam-active-view");
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

  const qNumEl = document.getElementById("exam-q-num") || document.getElementById("exam-question-num");
  const qDomainEl = document.getElementById("exam-q-domain") || document.getElementById("exam-question-domain");
  const qTextEl = document.getElementById("exam-q-text") || document.getElementById("exam-question-text");
  const qOptionsEl = document.getElementById("exam-q-options") || document.getElementById("exam-options-container");
  const flagBtn = document.getElementById("exam-flag-btn");

  if (qNumEl) qNumEl.textContent = `Câu ${mockExamCurrentIndex + 1} / ${mockExamQuestions.length}`;
  if (qDomainEl) qDomainEl.textContent = q.domain;
  if (qTextEl) qTextEl.innerHTML = formatExamRichText(q.question);

  if (flagBtn) {
    if (mockExamFlagged[mockExamCurrentIndex]) {
      flagBtn.classList.add("flagged");
      flagBtn.innerHTML = `⚑ Đã gắn cờ`;
    } else {
      flagBtn.classList.remove("flagged");
      flagBtn.innerHTML = `⚐ Gắn cờ xem lại`;
    }
  }

  if (qOptionsEl) {
    const letters = ["A", "B", "C", "D", "E", "F"];
    const currentSelected = mockExamUserAnswers[mockExamCurrentIndex];

    qOptionsEl.innerHTML = q.options
      .map((opt, idx) => {
        const isSelected = currentSelected === idx;
        return `
          <div class="exam-opt-item ${isSelected ? "selected" : ""}" onclick="selectExamOption(${idx})">
            <span class="exam-opt-letter">${letters[idx]}</span>
            <span class="exam-opt-text">${formatExamRichText(opt)}</span>
          </div>
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
    } else {
      nextBtn.textContent = "Câu tiếp →";
    }
  }
}

window.selectExamOption = function(idx) {
  mockExamUserAnswers[mockExamCurrentIndex] = idx;
  renderMockExamQuestion();
  renderMockExamNavigator();
};

function renderMockExamNavigator() {
  const navContainer = document.getElementById("exam-nav-grid") || document.getElementById("exam-navigator-grid");
  if (!navContainer) return;

  navContainer.innerHTML = mockExamQuestions
    .map((_, idx) => {
      const isAnswered = typeof mockExamUserAnswers[idx] !== "undefined";
      const isCurrent = idx === mockExamCurrentIndex;
      const isFlagged = !!mockExamFlagged[idx];

      let classes = ["exam-nav-dot"];
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

  const modal = document.getElementById("mock-exam-modal");
  if (modal) modal.classList.add("in-result");

  const activeBody = document.querySelector(".mock-exam-body") || document.getElementById("exam-active-view");
  const resultsView = document.getElementById("mock-exam-result-view") || document.getElementById("exam-results-view");
  if (activeBody) activeBody.style.display = "none";
  if (resultsView) {
    resultsView.style.display = "block";

    const letters = ["A", "B", "C", "D", "E", "F"];

    // Render report card
    const domainRows = Object.keys(domainStats)
      .map((dName) => {
        const d = domainStats[dName];
        const dPct = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
        const color = dPct >= 80 ? "#10b981" : "#f59e0b";
        return `
          <div class="exam-domain-row">
            <div class="exam-domain-meta">
              <span>${escapeHtml(dName)}</span>
              <strong style="color: ${color}">${dPct}% (${d.correct}/${d.total})</strong>
            </div>
            <div class="exam-domain-bar-bg">
              <div class="exam-domain-bar-fill" style="width: ${dPct}%; background: ${color};"></div>
            </div>
          </div>
        `;
      })
      .join("");

    const reviewCards = mockExamQuestions
      .map((q, idx) => {
        const userAns = mockExamUserAnswers[idx];
        const isCorrect = userAns === q.answerIndex;
        const userAnsText = typeof userAns !== "undefined" ? `${letters[userAns]}. ${q.options[userAns]}` : "Chưa chọn đáp án";
        const correctAnsText = `${letters[q.answerIndex]}. ${q.options[q.answerIndex]}`;

        return `
          <div class="exam-review-card ${isCorrect ? "correct" : "wrong"}">
            <div class="exam-review-header">
              <span class="exam-review-badge ${isCorrect ? "pass" : "fail"}">${isCorrect ? "✓ ĐÚNG" : "✗ SAI"}</span>
              <span class="exam-review-domain">Câu ${idx + 1} • ${escapeHtml(q.domain)}</span>
            </div>
            <div class="exam-review-q">${formatExamRichText(q.question)}</div>
            <div class="exam-review-answers">
              <div><strong>Lựa chọn của bạn:</strong> <span style="color: ${isCorrect ? "#15803d" : "#b91c1c"}">${formatExamRichText(userAnsText)}</span></div>
              <div><strong>Đáp án chuẩn Cisco:</strong> <span style="color: #15803d; font-weight: 700;">${formatExamRichText(correctAnsText)}</span></div>
            </div>
            <div class="exam-review-exp">
              <strong>💡 Giải thích chi tiết:</strong> ${formatExamRichText(q.explanation)}
            </div>
          </div>
        `;
      })
      .join("");

    resultsView.innerHTML = `
      <div class="exam-report-card">
        <div class="exam-result-badge-top">CISCO CCNA 200-301 PEARSON VUE RESULT</div>
        <div class="exam-score-title">${scaledScore} <span class="exam-score-max">/ 1000</span></div>
        <div class="exam-status-banner ${isPassed ? "pass" : "fail"}">
          ${isPassed ? "PASS — ĐẠT CHUẨN CCNA" : "FAIL — CHƯA ĐẠT ĐIỂM CHUẨN"}
        </div>
        <p class="exam-summary-text">
          ${isPassed
            ? `Chúc mừng bạn! Bạn đã đạt ${Math.round(percentage * 100)}% (${correctCount}/${totalQuestions} câu đúng), vượt qua điểm chuẩn sàn 825/1000 của kỳ thi Pearson VUE CCNA 200-301.`
            : `Bạn đạt ${Math.round(percentage * 100)}% (${correctCount}/${totalQuestions} câu đúng). Điểm chuẩn yêu cầu của Cisco là 825/1000. Hãy xem phân tích từng phần bên dưới để ôn tập củng cố thêm!`}
        </p>

        <div class="exam-domains-breakdown">
          <h3 class="exam-domains-title">Phân Tích Năng Lực Theo Từng Domain Cisco</h3>
          ${domainRows}
        </div>

        <div class="exam-result-actions">
          <button type="button" class="exam-btn-primary" onclick="startMockExam(30)">Thi lại đề khác</button>
          <button type="button" class="exam-btn-secondary" onclick="closeMockExamModal()">Đóng phòng thi</button>
        </div>

        <div class="exam-review-list">
          <h3 class="exam-domains-title" style="margin-bottom: 1rem;">Chi Tiết Lời Giải & Đáp Án Toàn Bộ Đề Thi</h3>
          ${reviewCards}
        </div>
      </div>
    `;
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
  if (modal) {
    modal.hidden = true;
    modal.setAttribute("hidden", "");
    modal.classList.remove("active");
  }
}

// --------------------------------------------------------------------------
// 5. CHEAT SHEET & CRAM TABLES UI RENDERER
// --------------------------------------------------------------------------
function openCheatSheetModal(defaultTab = "commands") {
  const modal = document.getElementById("cheatsheet-modal");
  if (modal) {
    modal.hidden = false;
    modal.removeAttribute("hidden");
    modal.classList.add("active");
    renderCheatSheetTab(defaultTab);
  }
}

function closeCheatSheetModal() {
  const modal = document.getElementById("cheatsheet-modal");
  if (modal) {
    modal.hidden = true;
    modal.setAttribute("hidden", "");
    modal.classList.remove("active");
  }
}

function renderCheatSheetTab(tabKey) {
  // Normalize tabKey
  let normalizedTab = tabKey;
  if (tabKey === "ad") normalizedTab = "cram-ad";
  if (tabKey === "ports") normalizedTab = "cram-ports";
  if (tabKey === "syslog") normalizedTab = "cram-syslog";
  if (tabKey === "multicast") normalizedTab = "cram-multicast";

  const tabBtns = document.querySelectorAll(".cs-tab-btn");
  tabBtns.forEach((btn) => {
    const bTab = btn.dataset.tab;
    const isMatch = bTab === tabKey || bTab === normalizedTab || (bTab === "ad" && normalizedTab === "cram-ad") || (bTab === "ports" && normalizedTab === "cram-ports") || (bTab === "syslog" && normalizedTab === "cram-syslog") || (bTab === "multicast" && normalizedTab === "cram-multicast");
    btn.classList.toggle("active", isMatch);
  });

  const contentArea = document.getElementById("cheatsheet-content") || document.getElementById("cheatsheet-tab-content");
  if (!contentArea) return;

  if (normalizedTab === "commands") {
    renderCheatSheetCommands(contentArea);
  } else if (normalizedTab === "cram-ad" || normalizedTab === "ad") {
    renderCramTableAD(contentArea);
  } else if (normalizedTab === "cram-ports" || normalizedTab === "ports") {
    renderCramTablePorts(contentArea);
  } else if (normalizedTab === "cram-syslog" || normalizedTab === "syslog") {
    renderCramTableSyslog(contentArea);
  } else if (normalizedTab === "cram-multicast" || normalizedTab === "multicast") {
    renderCramTableMulticast(contentArea);
  }
}

function renderCheatSheetCommands(container) {
  container.innerHTML = `
    <div class="cs-toolbar">
      <input type="text" class="cs-search-input" id="cs-search-input" placeholder="Tìm kiếm nhanh lệnh Cisco IOS (ví dụ: ospf, trunk, nat, vlan, portfast, show)..." autocomplete="off" />
      <div class="cs-category-pills" id="cs-category-filter">
        <button type="button" class="cs-cat-pill active" data-cat="all">Tất cả (${CCNA_CHEAT_SHEET_DATA.length})</button>
        <button type="button" class="cs-cat-pill" data-cat="basic">Căn bản</button>
        <button type="button" class="cs-cat-pill" data-cat="vlan">VLAN & Trunk</button>
        <button type="button" class="cs-cat-pill" data-cat="stp">STP & EtherChannel</button>
        <button type="button" class="cs-cat-pill" data-cat="routing">Định tuyến L3</button>
        <button type="button" class="cs-cat-pill" data-cat="services">Dịch vụ IP</button>
        <button type="button" class="cs-cat-pill" data-cat="security">Bảo mật & ACL</button>
        <button type="button" class="cs-cat-pill" data-cat="ipv6">IPv6</button>
        <button type="button" class="cs-cat-pill" data-cat="troubleshoot">Show & Kiểm tra</button>
      </div>
    </div>
    <div class="cs-commands-list" id="cs-commands-list"></div>
  `;

  const searchInput = document.getElementById("cs-search-input");
  const listEl = document.getElementById("cs-commands-list");
  const catPills = container.querySelectorAll(".cs-cat-pill");

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
      listEl.innerHTML = `<div class="cs-empty" style="text-align:center;padding:2.5rem;color:var(--text-muted);">Không tìm thấy lệnh nào khớp với từ khóa "<strong>${escapeHtml(currentSearch)}</strong>".</div>`;
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
              <span class="cs-detail-label">🎯 Trường hợp sử dụng:</span>
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
            <span class="cs-verify-label">🔍 Kiểm tra nghiệm thu:</span>
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
// 6. HELPER FORMATTER
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
// 7. INITIALIZATION & EVENT BINDINGS
// --------------------------------------------------------------------------
function initExamAndCheatSheetUI() {
  const openExamBtn = document.getElementById("open-exam-btn");
  if (openExamBtn) {
    openExamBtn.onclick = () => startMockExam(30);
  }

  const openCsBtn = document.getElementById("open-cheatsheet-btn");
  if (openCsBtn) {
    openCsBtn.onclick = () => openCheatSheetModal("commands");
  }

  // Mock Exam UI buttons
  const flagBtn = document.getElementById("exam-flag-btn");
  if (flagBtn) {
    flagBtn.onclick = () => {
      mockExamFlagged[mockExamCurrentIndex] = !mockExamFlagged[mockExamCurrentIndex];
      renderMockExamQuestion();
      renderMockExamNavigator();
    };
  }

  const prevBtn = document.getElementById("exam-prev-btn");
  if (prevBtn) {
    prevBtn.onclick = () => {
      if (mockExamCurrentIndex > 0) {
        mockExamCurrentIndex--;
        renderMockExamQuestion();
        renderMockExamNavigator();
      }
    };
  }

  const nextBtn = document.getElementById("exam-next-btn");
  if (nextBtn) {
    nextBtn.onclick = () => {
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
    };
  }

  const submitDirectBtn = document.getElementById("exam-submit-now-btn");
  if (submitDirectBtn) {
    submitDirectBtn.onclick = () => {
      const answeredCount = Object.keys(mockExamUserAnswers).length;
      const total = mockExamQuestions.length;
      if (confirm(`Bạn đã làm ${answeredCount}/${total} câu hỏi. Bạn có chắc chắn muốn nộp bài thi không?`)) {
        finishMockExam(false);
      }
    };
  }

  const examCloseBtn = document.getElementById("mock-exam-close-btn");
  if (examCloseBtn) {
    examCloseBtn.onclick = closeMockExamModal;
  }

  const examBackdrop = document.getElementById("mock-exam-backdrop");
  if (examBackdrop) {
    examBackdrop.onclick = closeMockExamModal;
  }

  // Cheat Sheet UI buttons
  const csCloseBtn = document.getElementById("cheatsheet-close-btn");
  if (csCloseBtn) csCloseBtn.onclick = closeCheatSheetModal;

  const csBackdrop = document.getElementById("cheatsheet-backdrop");
  if (csBackdrop) csBackdrop.onclick = closeCheatSheetModal;

  const csTabBtns = document.querySelectorAll(".cs-tab-btn");
  csTabBtns.forEach((b) => {
    b.onclick = () => {
      renderCheatSheetTab(b.dataset.tab);
    };
  });
}

// Global Exports
window.openMockExam = startMockExam;
window.closeMockExam = closeMockExamModal;
window.openCheatSheet = openCheatSheetModal;
window.closeCheatSheet = closeCheatSheetModal;

// Run safely on loading or interactive
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initExamAndCheatSheetUI);
} else {
  initExamAndCheatSheetUI();
}
