// ============================================================================
// CCNA NETWORK ACADEMY — ENTERPRISE CURRICULUM & 8-LEVEL LEARNING PATH ENGINE
// Chuẩn hóa:
// 1. Lộ trình 8 Cấp độ (8-Level Systematic Learning Path) đối chiếu CCNA 200-301
// 2. Cấu trúc 10 Phần thống nhất cho mỗi Bài học Lý thuyết (Part 3 Specification)
// 3. Cấu trúc 10 Phần bắt buộc cho toàn bộ 35 Bài Lab (Part 4 & Part 5 Specification)
// ============================================================================

const CCNA_ACADEMY_ROADMAP = [
  {
    level: 1,
    code: "LEVEL 1",
    title_vi: "NETWORKING FUNDAMENTALS (Nền Tảng Mạng Máy Tính)",
    title_en: "NETWORKING FUNDAMENTALS",
    badge: "CCNA Domain 1.0 • Core Foundation",
    examScope: "CCNA 200-301 Bắt buộc (100%)",
    summary_vi: "Xây dựng gốc rễ vững chắc nhất cho người mới bắt đầu từ con số 0: Hiểu bản chất mạng máy tính, phân loại LAN/WAN/WLAN/MAN, mô hình Client-Server & P2P, các thiết bị mạng (Hub, Switch, Router, Access Point, Firewall), phương tiện truyền dẫn (Cáp đồng UTP, Cáp quang SMF/MMF, Sóng RF), đơn vị dữ liệu PDU (Bit, Frame, Packet, Segment), Bandwidth/Throughput/Latency, Half/Full-Duplex và quá trình Đóng gói / Mở gói qua 7 tầng OSI & 4 tầng TCP/IP.",
    summary_en: "Build rock-solid foundations from zero: network architectures, LAN/WAN/WLAN/MAN, Client-Server vs P2P, Hub/Switch/Router/AP, cabling & physical media, PDUs, Bandwidth/Throughput/Latency, Half vs Full Duplex, and OSI / TCP-IP encapsulation.",
    prerequisites_vi: "Không yêu cầu kiến thức nền tảng trước đó (Bắt đầu từ con số 0).",
    outcomes_vi: [
      "Phân biệt chính xác vai trò của End Devices, Intermediary Devices (Hub, Switch, Router, AP, Firewall) và Network Media.",
      "Hiểu sâu cơ chế đóng gói (Encapsulation) và mở gói (Decapsulation) từ Data -> Segment -> Packet -> Frame -> Bits.",
      "Bấm cáp và chọn đúng loại cáp đồng (Straight-through vs. Crossover), cáp quang (Single-mode vs. Multimode) và cáp Console.",
      "Làm chủ các chế độ dòng lệnh Cisco IOS CLI (User EXEC, Privileged EXEC, Global Config) và quản lý bộ nhớ RAM/NVRAM."
    ],
    topics: [
      { name: "Network là gì? End Devices & Intermediary Devices", moduleId: 1, examCore: true },
      { name: "LAN, WAN, WLAN, MAN, SAN & SOHO", moduleId: 1, examCore: true },
      { name: "Client-Server vs. Peer-to-Peer (P2P)", moduleId: 15, examCore: true },
      { name: "Physical vs. Logical Network Topology", moduleId: 1, examCore: true },
      { name: "Hub, Switch, Router, Access Point & Firewall", moduleId: 1, examCore: true },
      { name: "Cisco IOS CLI, RAM vs. NVRAM & Basic Device Config", moduleId: 2, examCore: true },
      { name: "Bit, Byte, Frame, Packet, Segment (PDUs)", moduleId: 3, examCore: true },
      { name: "OSI 7-Layer Model & TCP/IP 4-Layer Model", moduleId: 3, examCore: true },
      { name: "Encapsulation & Decapsulation Process", moduleId: 3, examCore: true },
      { name: "Bandwidth, Throughput, Goodput & Latency", moduleId: 4, examCore: true },
      { name: "Copper (UTP/STP T568A/B), Fiber (SMF/MMF) & Wireless Media", moduleId: 4, examCore: true },
      { name: "Half-Duplex (CSMA/CD) vs. Full-Duplex & Auto-MDIX", moduleId: 6, examCore: true }
    ],
    moduleIds: [1, 2, 3, 4, 6],
    masteryIds: [8],
    labIds: [1, 2, 3, 4, 5, 7]
  },
  {
    level: 2,
    code: "LEVEL 2",
    title_vi: "ETHERNET & SWITCHING (Chuyển Mạch Tầng 2, VLAN, STP & EtherChannel)",
    title_en: "ETHERNET & SWITCHING",
    badge: "CCNA Domain 2.0 • Network Access (20%)",
    examScope: "CCNA 200-301 Bắt buộc (100%)",
    summary_vi: "Giải phẫu toàn diện cơ chế hoạt động của Switch Layer 2 trong doanh nghiệp: Cấu trúc khung tin Ethernet II Frame, chip phần cứng ASIC, cách Switch tự học địa chỉ MAC nguồn (MAC Learning) vào bảng CAM Table, cơ chế chuyển tiếp (Forwarding, Filtering, Unknown Unicast Flooding), phân tách Collision Domain và Broadcast Domain bằng VLAN, cấu hình cổng Access & đường trung kế IEEE 802.1Q Trunking, Native VLAN, chống vòng lặp với STP / Rapid-PVST+ (802.1w) và gộp băng thông EtherChannel (LACP/PAgP).",
    summary_en: "Master Layer 2 Ethernet Switching: Ethernet frame anatomy, MAC address learning & flooding, Collision vs Broadcast domains, VLAN segmentation, Access & 802.1Q Trunk ports, Native VLAN, STP/Rapid-PVST+, and LACP/PAgP EtherChannel.",
    prerequisites_vi: "Hoàn thành Level 1 (Hiểu mô hình OSI, cáp mạng và Cisco IOS CLI cơ bản).",
    outcomes_vi: [
      "Giải thích chi tiết quy trình Switch học MAC nguồn và tra cứu MAC đích (hoặc Flood khi chưa biết MAC).",
      "Tính toán chính xác số lượng Collision Domain và Broadcast Domain trên sơ đồ có Hub, Switch, VLAN và Router.",
      "Thiết kế và cấu hình thành thạo Data VLAN, Voice VLAN, Management VLAN, Access Port và 802.1Q Trunk Port.",
      "Làm chủ thuật toán bầu chọn Root Bridge của STP/RSTP, cấu hình PortFast, BPDU Guard, Root Guard, Loop Guard và gom cổng EtherChannel."
    ],
    topics: [
      { name: "NIC, 48-bit MAC Address (OUI & Vendor Assigned)", moduleId: 7, examCore: true },
      { name: "Ethernet Frame Anatomy (Preamble, SFD, MACs, Type, FCS)", moduleId: 7, examCore: true },
      { name: "MAC Address Table (CAM), MAC Learning & Aging (300s)", moduleId: 7, examCore: true },
      { name: "Unknown Unicast Flooding, Broadcast & Multicast", moduleId: 7, examCore: true },
      { name: "Store-and-Forward vs. Cut-Through Switching", moduleId: 7, examCore: true },
      { name: "Collision Domain vs. Broadcast Domain", moduleId: 7, examCore: true },
      { name: "VLAN Segmentation (Data, Voice, Management, Native)", masteryId: 1, examCore: true },
      { name: "Access Port vs. Trunk Port & DTP Negotiation", masteryId: 1, examCore: true },
      { name: "IEEE 802.1Q Tagging (4-Byte Tag) & Native VLAN Mismatch", masteryId: 1, examCore: true },
      { name: "Spanning Tree Protocol (STP 802.1D) & Rapid-PVST+ (802.1w)", masteryId: 1, examCore: true },
      { name: "PortFast, BPDU Guard, Root Guard & Loop Guard", masteryId: 7, examCore: true },
      { name: "EtherChannel Link Aggregation (LACP 802.3ad & Cisco PAgP)", masteryId: 1, examCore: true }
    ],
    moduleIds: [7],
    masteryIds: [1],
    labIds: [8, 21, 24, 25]
  },
  {
    level: 3,
    code: "LEVEL 3",
    title_vi: "IP ADDRESSING & SUBNETTING (Quy Hoạch Địa Chỉ IPv4, VLSM & IPv6)",
    title_en: "IP ADDRESSING & SUBNETTING",
    badge: "CCNA Domain 1.0 & 3.0 • Core IP Architecture",
    examScope: "CCNA 200-301 Bắt buộc (100%)",
    summary_vi: "Làm chủ kỹ năng quan trọng bậc nhất của kỳ thi CCNA và công việc Network Engineer: Quy đổi thần tốc Nhị phân (Binary) - Thập phân (Decimal) - Thập lục phân (Hex), cấu trúc địa chỉ IPv4 32-bit, phân biệt Network Address, Usable Host Address và Broadcast Address, Subnet Mask, CIDR, chia mạng con đều (FLSM) và chia mạng con độ dài thay đổi (VLSM) trong 15 giây bằng phương pháp Magic Number, phân giải ARP, cùng toàn bộ kiến trúc IPv6 128-bit (GUA, Link-Local, SLAAC, Stateless/Stateful DHCPv6, EUI-64).",
    summary_en: "Master Binary/Decimal/Hex conversion, IPv4 addressing, Network/Host/Broadcast calculation, Subnet Mask & CIDR, fast Subnetting & VLSM design, Private vs Public IPs, ARP & ND, and IPv6 addressing (GUA, Link-Local, SLAAC, DHCPv6).",
    prerequisites_vi: "Hoàn thành Level 1 & Level 2 (Hiểu cấu trúc gói tin Layer 2 và Layer 3).",
    outcomes_vi: [
      "Đổi nhẩm bất kỳ octet IPv4 hoặc cụm Hex IPv6/MAC nào sang nhị phân trong dưới 10 giây.",
      "Xác định tức thì Network ID, First Host, Last Host, Broadcast Address và số lượng Host khả dụng cho mọi prefix từ /8 đến /30.",
      "Thiết kế bảng quy hoạch địa chỉ IP VLSM hoàn chỉnh cho doanh nghiệp nhiều phòng ban và đường kết nối WAN /30 không lãng phí IP.",
      "Rút gọn và triển khai địa chỉ IPv6 Dual-Stack, tự động cấp phát IPv6 qua SLAAC, Stateless DHCPv6 và Stateful DHCPv6."
    ],
    topics: [
      { name: "Binary, Decimal & Hexadecimal Conversion (8-bit & 4-bit Nibble)", moduleId: 5, examCore: true },
      { name: "IPv4 Address Structure, Network vs. Host Portion", moduleId: 11, examCore: true },
      { name: "Network Address, Usable Host Range & Broadcast Address", moduleId: 11, examCore: true },
      { name: "Subnet Mask, Prefix Length (CIDR /8 -> /32) & Magic Number", moduleId: 11, examCore: true },
      { name: "Fixed-Length Subnetting (FLSM) & Variable-Length (VLSM)", moduleId: 11, examCore: true },
      { name: "RFC 1918 Private IPv4 vs. Public IPv4, Loopback & APIPA", moduleId: 11, examCore: true },
      { name: "Address Resolution Protocol (ARP) & Gratuitous ARP", moduleId: 9, examCore: true },
      { name: "IPv6 128-bit Fundamentals, Compression Rules (::)", moduleId: 12, examCore: true },
      { name: "IPv6 Global Unicast (2000::/3), Link-Local (FE80::/10) & Multicast (FF00::/8)", moduleId: 12, examCore: true },
      { name: "ICMPv6 Neighbor Discovery (NS/NA, RS/RA) & Solicited-Node Multicast", moduleId: 9, examCore: true },
      { name: "IPv6 SLAAC, EUI-64, Stateless DHCPv6 & Stateful DHCPv6", moduleId: 12, examCore: true },
      { name: "ICMPv4 / ICMPv6 Echo, Ping & Traceroute Diagnostics", moduleId: 13, examCore: true }
    ],
    moduleIds: [5, 9, 11, 12, 13],
    masteryIds: [],
    labIds: [6, 10, 12, 13, 14]
  },
  {
    level: 4,
    code: "LEVEL 4",
    title_vi: "ROUTING (Định Tuyến Tĩnh, Inter-VLAN Routing & Định Tuyến Động OSPF)",
    title_en: "IP ROUTING & OSPF",
    badge: "CCNA Domain 3.0 • IP Connectivity (25% — Trọng số cao nhất!)",
    examScope: "CCNA 200-301 Bắt buộc (100%)",
    summary_vi: "Chiếm 25% tổng điểm kỳ thi CCNA 200-301! Hiểu sâu cơ chế chuyển tiếp gói tin của Router ở Tầng 3, giải phẫu bảng định tuyến (`show ip route`), 3 quy tắc vàng chọn đường đi (Longest Prefix Match -> Administrative Distance -> Metric), cấu hình cổng Router Dual-Stack, định tuyến giữa các VLAN bằng Router-on-a-Stick (802.1Q Subinterfaces) và Switch Layer 3 (SVI + `ip routing`), cấu hình Static Route, Default Route, Floating Static Route dự phòng, và làm chủ hoàn toàn giao thức định tuyến động OSPFv2.",
    summary_en: "Covers 25% of the CCNA exam: Router packet forwarding, Routing Table anatomy, Longest Prefix Match vs AD vs Metric, Inter-VLAN routing (Router-on-a-Stick & Layer 3 Switch SVI), Static/Default/Floating Static Routes, and OSPFv2.",
    prerequisites_vi: "Hoàn thành Level 2 (VLAN/Trunking) và Level 3 (IPv4/IPv6 Subnetting).",
    outcomes_vi: [
      "Đọc bảng định tuyến Cisco IOS và xác định chính xác 100% cổng thoát của bất kỳ gói tin nào theo quy tắc Longest Prefix Match.",
      "Triển khai thông suốt định tuyến giữa các VLAN bằng cả 2 phương pháp: Router-on-a-Stick và Multilayer Switch SVI.",
      "Cấu hình Static Route, Default Route (`0.0.0.0/0`) và Floating Static Route tự động chuyển mạch dự phòng khi đứt cáp chính.",
      "Triển khai, tối ưu và xử lý sự cố OSPFv2 (Router-ID, Wildcard Mask, Passive-Interface, Cost Metric, bầu chọn DR/BDR và 6 điều kiện lên Neighbor FULL)."
    ],
    topics: [
      { name: "Router Operation, Packet Forwarding & Default Gateway", moduleId: 8, examCore: true },
      { name: "Cisco Router Interface Configuration & Status/Protocol (up/up)", moduleId: 10, examCore: true },
      { name: "Routing Table Anatomy (C, L, S, S*, O, D, B)", moduleId: 8, examCore: true },
      { name: "3 Golden Path Selection Rules: Longest Prefix Match, AD & Metric", masteryId: 3, examCore: true },
      { name: "Administrative Distance (AD) Values (0, 1, 20, 90, 110, 120)", masteryId: 3, examCore: true },
      { name: "Connected, Static Route & Default Route (Gateway of Last Resort)", moduleId: 8, examCore: true },
      { name: "Floating Static Route (Backup WAN Failover via higher AD)", masteryId: 3, examCore: true },
      { name: "Inter-VLAN Routing: Router-on-a-Stick (802.1Q Subinterfaces)", moduleId: 10, examCore: true },
      { name: "Inter-VLAN Routing: Layer 3 Multilayer Switch (SVI & Routed Ports)", masteryId: 1, examCore: true },
      { name: "Dynamic Routing Fundamentals (Distance-Vector vs. Link-State)", masteryId: 3, examCore: true },
      { name: "OSPFv2 Architecture, Router-ID Priority, Cost Metric & SPF Tree", masteryId: 3, examCore: true },
      { name: "OSPF Neighbor Adjacency States, DR/BDR Election & Troubleshooting", masteryId: 3, examCore: true }
    ],
    moduleIds: [8, 10],
    masteryIds: [3],
    labIds: [9, 11, 22, 23, 26, 34]
  },
  {
    level: 5,
    code: "LEVEL 5",
    title_vi: "NETWORK SERVICES (TCP/UDP, DHCP, DNS, NAT/PAT, ACL, QoS & Quản Trị)",
    title_en: "IP NETWORK SERVICES & ACLs",
    badge: "CCNA Domain 4.0 & 5.0 • IP Services",
    examScope: "CCNA 200-301 Bắt buộc (100%)",
    summary_vi: "Làm chủ các giao thức tầng Giao vận (TCP 3-way handshake, Flow control, UDP) và toàn bộ dịch vụ hạ tầng mạng doanh nghiệp: Cấu hình Router làm DHCPv4 Server và DHCP Relay Agent (`ip helper-address`), dịch vụ phân giải tên miền DNS, dịch địa chỉ Static NAT / Dynamic NAT / PAT Overload ra Internet, đồng bộ thời gian NTP, giám sát SNMPv2c/v3, nhật ký Syslog 8 mức độ (0–7), truyền file FTP/TFTP, lọc gói tin bằng Standard & Extended IPv4 ACLs, và kiến trúc ưu tiên chất lượng dịch vụ QoS (CoS, DSCP EF, LLQ).",
    summary_en: "Master Transport Layer (TCP/UDP & Port Numbers) and Enterprise IP Services: DHCP Server & Relay, DNS, Static/Dynamic NAT & PAT Overload, NTP, SNMP, Syslog, FTP/TFTP, Standard & Extended ACLs, and QoS.",
    prerequisites_vi: "Hoàn thành Level 3 (IP Addressing) và Level 4 (IP Routing).",
    outcomes_vi: [
      "Phân biệt cơ chế hoạt động của TCP vs. UDP và thuộc lòng bộ Well-Known Ports quan trọng trong đề thi CCNA.",
      "Cấu hình hoàn chỉnh DHCP Server trên Router Cisco và chuyển tiếp DHCP xuyên VLAN/Router bằng `ip helper-address`.",
      "Triển khai NAT Overload (PAT) cho mạng LAN ra Internet và Static NAT (Port Forwarding) cho máy chủ DMZ nội bộ.",
      "Thiết kế và đặt đúng vị trí Standard ACL (gần đích) và Extended ACL (gần nguồn) để kiểm soát lưu lượng theo IP và Port."
    ],
    topics: [
      { name: "Transport Layer: TCP 3-Way Handshake, Windowing vs. UDP", moduleId: 14, examCore: true },
      { name: "Well-Known TCP/UDP Port Numbers (20/21, 22, 23, 25, 53, 67/68, 69, 80, 123, 161/162, 443, 514)", moduleId: 14, examCore: true },
      { name: "DHCPv4 DORA Process, Cisco IOS DHCP Server & DHCP Relay (`ip helper-address`)", moduleId: 15, examCore: true },
      { name: "DNS Hierarchy & Resource Records (A, AAAA, MX, CNAME, NS, PTR)", moduleId: 15, examCore: true },
      { name: "NAT & PAT (Overload): Inside Local, Inside Global, Outside Local, Outside Global", masteryId: 4, examCore: true },
      { name: "Network Time Protocol (NTP Stratum Levels 0–15) & Clock Sync", masteryId: 4, examCore: true },
      { name: "Syslog (8 Severity Levels 0–7) & SNMP (v1/v2c/v3 authPriv, MIB, Trap/Poll)", masteryId: 4, examCore: true },
      { name: "FTP (Active vs. Passive) & TFTP IOS Image Backup / Recovery", moduleId: 15, examCore: true },
      { name: "Standard & Extended IPv4 Access Control Lists (ACLs) & Wildcard Masks", moduleId: 16, examCore: true },
      { name: "QoS Fundamentals: Classification, Marking (CoS 5, DSCP EF 46), LLQ & Shaping/Policing", masteryId: 4, examCore: true }
    ],
    moduleIds: [14, 15],
    masteryIds: [4],
    labIds: [15, 16, 17, 18, 27, 28, 29, 35]
  },
  {
    level: 6,
    code: "LEVEL 6",
    title_vi: "NETWORK INFRASTRUCTURE & SECURITY (Wi-Fi WLC, Bảo Mật Tầng 2 & Dự Phòng FHRP)",
    title_en: "NETWORK INFRASTRUCTURE & SECURITY",
    badge: "CCNA Domain 2.0 & 5.0 • Security & Wireless (15%)",
    examScope: "CCNA 200-301 Bắt buộc (100%)",
    summary_vi: "Thiết kế hạ tầng mạng không dây và hệ thống phòng thủ đa lớp (Defense-in-Depth) cho doanh nghiệp: Kiến trúc Wi-Fi tập trung với Cisco Wireless LAN Controller (WLC) và Lightweight AP (LAP) qua đường hầm CAPWAP (UDP 5246/5247), chuẩn bảo mật không dây WPA2/WPA3 (Personal SAE vs. Enterprise 802.1X RADIUS), gia cố thiết bị với SSHv2 & AAA, bảo mật cổng Switch Layer 2 (Port Security, DHCP Snooping, Dynamic ARP Inspection - DAI), và dự phòng Gateway tự động với FHRP (HSRP, VRRP, GLBP).",
    summary_en: "Enterprise Wireless & Network Security: WLAN Architecture (Autonomous vs Lightweight AP, Cisco WLC, CAPWAP), WPA2/WPA3 Security, SSHv2 Device Hardening, Layer 2 Security (Port Security, DHCP Snooping, DAI), and First Hop Redundancy (HSRP/VRRP/GLBP).",
    prerequisites_vi: "Hoàn thành Level 2 (Switching/VLAN) và Level 5 (Network Services & ACL).",
    outcomes_vi: [
      "Triển khai và cấu hình hệ thống Cisco WLC-2504 quản lý các Lightweight AP, ánh xạ SSID vào các Dynamic VLAN Interfaces.",
      "Gia cố bảo mật (Hardening) cho Router/Switch bằng SSHv2, `login block-for`, `exec-timeout`, và ACL `access-class` trên VTY.",
      "Cấu hình bộ 3 lá chắn bảo mật Tầng 2 trên Switch: Port Security (Sticky MAC), DHCP Snooping (Trust/Untrust) và Dynamic ARP Inspection (DAI).",
      "Triển khai dự phòng Gateway không gián đoạn bằng giao thức HSRP (Active/Standby, Priority, Preempt)."
    ],
    topics: [
      { name: "Wireless Fundamentals: 2.4GHz (Ch 1, 6, 11) vs. 5GHz vs. 6GHz, SSID/BSSID/ESSID", masteryId: 2, examCore: true },
      { name: "WLAN Architecture: Autonomous AP vs. Lightweight AP (LAP) & Split-MAC", masteryId: 2, examCore: true },
      { name: "CAPWAP Tunnel (UDP 5246 Control & UDP 5247 Data) & AP Modes (Local, FlexConnect)", masteryId: 2, examCore: true },
      { name: "Cisco WLC Ports & Interfaces (Management, Dynamic VLAN, Virtual, Service)", masteryId: 2, examCore: true },
      { name: "Wireless Security: WPA2 (AES-CCMP) vs. WPA3 (SAE / GCMP-256) & 802.1X RADIUS", masteryId: 2, examCore: true },
      { name: "Cybersecurity CIA Triad, Threat Actors, Malware (Virus, Worm, Trojan) & Attacks", moduleId: 16, examCore: true },
      { name: "Device Hardening: SSHv2 (RSA 2048), VTY Lock, `login block-for` & AAA (RADIUS/TACACS+)", moduleId: 16, examCore: true },
      { name: "Switch Port Security: Sticky MAC & Violation Modes (Protect, Restrict, Shutdown)", moduleId: 16, examCore: true },
      { name: "DHCP Snooping (Trusted vs. Untrusted Ports) & Dynamic ARP Inspection (DAI)", masteryId: 6, examCore: true },
      { name: "First Hop Redundancy Protocols (FHRP): HSRP, VRRP & GLBP High Availability", masteryId: 3, examCore: true }
    ],
    moduleIds: [16],
    masteryIds: [2],
    labIds: [19, 20, 31, 32, 33]
  },
  {
    level: 7,
    code: "LEVEL 7",
    title_vi: "AUTOMATION & MODERN NETWORKING (SDN, REST API, JSON, Terraform & AI)",
    title_en: "AUTOMATION & PROGRAMMABILITY",
    badge: "CCNA Domain 6.0 • Automation & v1.1 Updates (10%)",
    examScope: "CCNA 200-301 v1.1 Bắt buộc (100%)",
    summary_vi: "Chinh phục 10% trọng số cuối cùng của kỳ thi CCNA 200-301 (cập nhật mới nhất phiên bản v1.1): Sự chuyển dịch từ quản trị CLI truyền thống sang mạng điều khiển tập trung (Controller-Based Networking & SDN), tách bạch Control Plane / Data Plane / Management Plane, kiến trúc Northbound & Southbound APIs (NETCONF/RESTCONF/OpenFlow),Cisco DNA Center (Catalyst Center), cấu trúc dữ liệu JSON, giải phẫu REST API (CRUD HTTP Verbs, Status Codes, Authentication: Basic, Bearer Token, API Key), công cụ tự động hóa cấu hình (Ansible, Puppet, Chef, Terraform IaC) và trí tuệ nhân tạo trong vận hành mạng (Generative AI vs. Predictive AI).",
    summary_en: "Master CCNA Domain 6.0 (including v1.1 blueprint updates): SDN & Controller-Based Networking (Control vs Data Plane), Cisco Catalyst Center (DNA Center), REST APIs (CRUD, HTTP Status Codes, Auth), JSON format, Ansible/Puppet/Chef/Terraform IaC, and Generative/Predictive AI in Networking.",
    prerequisites_vi: "Hoàn thành Level 1 đến Level 6 (Nắm vững mạng truyền thống trước khi tự động hóa).",
    outcomes_vi: [
      "Phân biệt rõ chức năng và cơ chế hoạt động của Data Plane (ASIC/TCAM), Control Plane (OSPF/STP CPU) và Management Plane (CLI/SNMP/NETCONF).",
      "Đọc hiểu và phát hiện lỗi cú pháp trong bất kỳ đoạn dữ liệu JSON (Key-Value, Object `{ }`, Array `[ ]`) nào trong đề thi.",
      "Ánh xạ chính xác 4 thao tác CRUD sang 4 phương thức HTTP của REST API (`POST`, `GET`, `PUT/PATCH`, `DELETE`) và các mã trạng thái HTTP (`200`, `201`, `400`, `401`, `403`, `404`, `500`).",
      "So sánh đặc điểm kỹ thuật của Ansible, Puppet, Chef, Terraform (Push vs. Pull, Agentless vs. Agent-based, YAML vs. HCL) và ứng dụng AI trong mạng."
    ],
    topics: [
      { name: "Traditional Networking vs. Controller-Based Networking (SDN)", masteryId: 5, examCore: true },
      { name: "Data Plane vs. Control Plane vs. Management Plane Separation", masteryId: 5, examCore: true },
      { name: "Overlay (VXLAN/LISP) vs. Underlay Network & Fabric Architecture", masteryId: 5, examCore: true },
      { name: "Northbound APIs (REST) vs. Southbound APIs (NETCONF, RESTCONF, OpenFlow)", masteryId: 5, examCore: true },
      { name: "Cisco DNA Center / Catalyst Center (Assurance, Provisioning, Policy)", masteryId: 5, examCore: true },
      { name: "REST API Fundamentals: CRUD Operations, HTTP Verbs & Status Codes", masteryId: 5, examCore: true },
      { name: "REST API Authentication Mechanisms (Basic Auth, Bearer Token, OAuth, API Key)", masteryId: 7, examCore: true },
      { name: "JSON Data Encoding Format (Objects, Arrays, Key-Value Pairs)", masteryId: 5, examCore: true },
      { name: "Configuration Management: Ansible vs. Puppet vs. Chef", masteryId: 5, examCore: true },
      { name: "Infrastructure as Code (IaC) with Terraform & Generative/Predictive AI (CCNA v1.1)", masteryId: 7, examCore: true }
    ],
    moduleIds: [],
    masteryIds: [5, 7],
    labIds: []
  },
  {
    level: 8,
    code: "LEVEL 8",
    title_vi: "REAL-WORLD NETWORK ENGINEERING (Thiết Kế, Triển Khai & Xử Lý Sự Cố Doanh Nghiệp)",
    title_en: "REAL-WORLD NETWORK ENGINEERING",
    badge: "Enterprise Career • Production & Troubleshooting",
    examScope: "50% Thi CCNA (Troubleshooting) + 50% Mở rộng Thực chiến Đi làm",
    summary_vi: "Cầu nối trực tiếp từ chứng chỉ CCNA sang công việc thực tế của một Kỹ sư Mạng Doanh nghiệp (Enterprise Network Engineer): Quy hoạch tổng thể kiến trúc mạng phân cấp 3 lớp (Access - Distribution - Core), lập bảng quy hoạch IP & VLAN (IP/VLAN Planning), chuẩn hóa hồ sơ tài liệu mạng (Network Documentation), lắp đặt tủ Rack & Patch Panel thực tế, quản trị thiết bị đa hãng qua Web GUI / Cloud (Switch HPE Aruba, Router cân bằng tải Multi-WAN MikroTik / DrayTek / FortiGate), triển khai thiết bị ngoại vi văn phòng (Máy in MFP Port 9100, Máy scan SMB 445, POS, VoIP Phone passthrough, Camera PoE, RMM), quy trình xử lý sự cố 7 bước (Troubleshooting Methodology), Change Management và Incident Handling.",
    summary_en: "Bridge CCNA certification to real-world Enterprise Network Engineering: 3-Tier Campus Design, IP & VLAN Planning, Network Documentation, Multi-vendor Administration (HPE Aruba, MikroTik, DrayTek, FortiGate), Enterprise Peripherals, Troubleshooting Methodology, Change Management, and Incident Handling.",
    prerequisites_vi: "Hoàn thành Level 1 đến Level 7 (Nắm vững toàn bộ kiến thức CCNA 200-301).",
    outcomes_vi: [
      "Tự tay thiết kế và triển khai từ A-Z mạng văn phòng doanh nghiệp đa phòng ban (Multi-VLAN, DHCP, SSH, Port Security, OSPF, HSRP, NAT).",
      "Quản trị tự tin cả thiết bị Cisco CLI lẫn các dòng Switch HPE Aruba (Untagged/Tagged Web GUI) và Router cân bằng tải Multi-WAN (MikroTik/DrayTek).",
      "Triển khai và khắc phục triệt để các sự cố thiết bị ngoại vi thực tế tại văn phòng (Máy in báo Offline ảo do cổng WSD, Scan SMB, VoIP Passthrough).",
      "Áp dụng quy trình Troubleshooting bài bản, Change Management (Backup cấu hình trước khi thay đổi) và trả lời xuất sắc các câu hỏi phỏng vấn Kỹ sư Mạng."
    ],
    topics: [
      { name: "Enterprise Network Design: Cisco 3-Tier (Access/Dist/Core) & Collapsed Core", moduleId: 17, examCore: true },
      { name: "Enterprise IP Address Planning & VLAN Allocation Strategy", moduleId: 17, examCore: true },
      { name: "Network Documentation, CDP/LLDP Topology Discovery & Baseline", moduleId: 17, examCore: true },
      { name: "Structured Cabling, 19-Inch Server Rack, Patch Panel & Hardware Anatomy", masteryId: 8, examCore: false },
      { name: "Multi-Vendor Switching: HPE Aruba Web GUI (Untagged 'U' vs. Tagged 'T') & Cloud", masteryId: 9, examCore: false },
      { name: "Multi-WAN Load Balancing & Failover Routers (MikroTik, DrayTek, FortiGate)", masteryId: 9, examCore: false },
      { name: "Enterprise Peripherals: MFP Printers (RAW 9100), SMB Scanners, POS, VoIP & Camera PoE", masteryId: 10, examCore: false },
      { name: "Structured Network Troubleshooting Methodology (Top-Down, Bottom-Up, Divide & Conquer)", moduleId: 17, examCore: true },
      { name: "Network Maintenance, Change Management, IOS Upgrade & Incident Handling", masteryId: 6, examCore: false },
      { name: "12 Classic Network Engineer Job Interview Scenarios & Capstone Deployment", masteryId: 6, examCore: false }
    ],
    moduleIds: [17],
    masteryIds: [6, 8, 9, 10],
    labIds: [30]
  }
];

// ============================================================================
// PART 3: CHUẨN HÓA CẤU TRÚC 10 PHẦN CHO MỖI BÀI HỌC (LESSON ENRICHMENT DATA)
// Bổ sung đầy đủ các mục Learning Objectives, Real-world Scenario, Verification
// và Troubleshooting chi tiết cho toàn bộ 17 Học phần
// ============================================================================
const MODULE_STANDARD_10_ENRICHMENT = {
  1: {
    level: 1,
    examTag: "CCNA Domain 1.0 • Network Fundamentals",
    objectives_vi: [
      "Phân biệt rõ 3 thành phần cốt lõi của mọi hệ thống mạng: Thiết bị đầu cuối (End Devices / Hosts), Thiết bị trung gian (Intermediary Devices) và Phương tiện truyền dẫn (Network Media).",
      "So sánh sự khác biệt giữa Sơ đồ Vật lý (Physical Topology) và Sơ đồ Logic (Logical Topology), cũng như các quy mô mạng LAN, WAN, WLAN, MAN, SAN.",
      "Giải thích 4 trụ cột bắt buộc của kiến trúc mạng doanh nghiệp đáng tin cậy: Khả năng chịu lỗi (Fault Tolerance), Khả năng mở rộng (Scalability), Chất lượng dịch vụ (QoS) và Bảo mật (Security - CIA Triad).",
      "Nhận diện vai trò của các thiết bị trong mạng văn phòng thực tế: Switch, Router, Firewall, Access Point, IP Phone PoE, Máy in mạng và Máy chủ."
    ],
    scenario_vi: "Một công ty thương mại điện tử mới thuê văn phòng 3 tầng cho 80 nhân viên gồm các bộ phận: Kinh doanh, Kế toán, Kỹ thuật và Chăm sóc khách hàng (dùng điện thoại bàn VoIP). Ban giám đốc yêu cầu bạn — với tư cách là Network Engineer — thiết kế hạ tầng mạng sao cho: 1) Nhân viên vừa gọi điện thoại VoIP, họp video trực tuyến vừa tải dữ liệu trên cùng một hệ thống cáp mà không bị giật lag; 2) Nếu một đường cáp quang nhà mạng bị đứt thì văn phòng vẫn không bị mất Internet; và 3) Có sơ đồ quản lý rõ ràng cả vị trí lắp đặt lẫn quy hoạch IP.",
    verification_vi: [
      {
        cmd: "ipconfig /all   (trên Windows)  hoặc  ifconfig / ip addr  (trên Linux/macOS)",
        purpose: "Kiểm tra thông số định danh của một Thiết bị đầu cuối (Host) trên mạng.",
        expectedOutput: "Hiển thị đầy đủ Physical Address (Địa chỉ MAC 48-bit), IPv4 Address, Subnet Mask, Default Gateway (địa chỉ của Router biên) và DNS Servers.",
        wrongSign: "Nếu thiếu Default Gateway, máy tính vẫn ping được các máy khác trong cùng phòng (cùng LAN) nhưng hoàn toàn không thể truy cập ra ngoài Internet (WAN)."
      },
      {
        cmd: "ping 192.168.1.1   và   tracert 8.8.8.8",
        purpose: "Kiểm tra kết nối từ Host tới Thiết bị trung gian (Router Gateway) và truy vết đường đi qua mạng WAN.",
        expectedOutput: "`ping` trả về 4 dòng `Reply from 192.168.1.1: bytes=32 time<1ms TTL=255`. `tracert` liệt kê từng trạm Router từ LAN ra ISP tới `8.8.8.8`.",
        wrongSign: "Nếu ngay trạm số 1 (`192.168.1.1`) báo `Request timed out` hoặc `Destination host unreachable`, lỗi nằm ngay tại mạng nội bộ LAN (đứt cáp, sai VLAN hoặc cổng Switch/Router bị tắt)."
      }
    ],
    troubleshooting_vi: [
      {
        issue: "Sự cố 1: Nhân viên họp video Zoom/Teams bị giật tiếng, vỡ hình mỗi khi có người tải file nặng.",
        cause: "Mạng hội tụ (Converged Network) đang chạy chung Data, Voice và Video nhưng chưa cấu hình cơ chế ưu tiên **Quality of Service (QoS)** trên Switch và Router.",
        fix: "Phân tách lưu lượng thoại/video (Voice VLAN) và kích hoạt QoS (tin cậy nhãn CoS = 5 / DSCP EF = 46, đưa vào hàng đợi ưu tiên tuyệt đối LLQ trên Router)."
      },
      {
        issue: "Sự cố 2: Đứt cáp quang của nhà mạng ISP ngoài đường làm toàn bộ công ty tê liệt giao dịch.",
        cause: "Thiết kế mạng thiếu tính chịu lỗi (**Fault Tolerance / Redundancy**), phụ thuộc vào một điểm lỗi duy nhất (Single Point of Failure - SPOF).",
        fix: "Thuê 2 đường truyền cáp quang từ 2 ISP độc lập (Dual-WAN) kết nối vào Router biên cấu hình **Floating Static Route kèm IP SLA Tracking** (hoặc HSRP trên 2 Router)."
      },
      {
        issue: "Sự cố 3: Máy in văn phòng cài tự động trên Windows thường xuyên báo 'Offline' ảo dù máy in vẫn bật điện.",
        cause: "Windows tự động dùng cổng **WSD (Web Services for Devices)** và máy in đang để chế độ nhận IP động (DHCP) nên khi ngủ đông hoặc đổi IP sẽ mất kết nối.",
        fix: "Đặt **Static IP** cố định cho máy in nằm ngoài dải cấp DHCP và chuyển cổng in trên Windows sang **Standard TCP/IP Port (RAW Port 9100)**."
      }
    ]
  },
  2: {
    level: 1,
    examTag: "CCNA Domain 1.0 & 2.0 • IOS CLI & Device Config",
    objectives_vi: [
      "Kết nối vật lý từ Laptop vào Switch/Router mới khui hộp thông qua dây cáp Console (Out-of-Band) và phần mềm Terminal (9600-8-N-1).",
      "Điều hướng thuần thục giữa các chế độ dòng lệnh Cisco IOS: User EXEC (`>`), Privileged EXEC (`#`), Global Configuration (`(config)#`), Line (`(config-line)#`) và Interface (`(config-if)#`).",
      "Cấu hình bảo mật cơ bản cho thiết bị: Hostname, mật khẩu Console, mật khẩu VTY, `enable secret`, `service password-encryption`, `banner motd` và `no ip domain-lookup`.",
      "Đặt địa chỉ IP quản trị từ xa trên giao diện ảo SVI (`interface vlan 1`), khai báo `ip default-gateway` và lưu cấu hình từ RAM (`running-config`) vào NVRAM (`startup-config`)."
    ],
    scenario_vi: "Công ty vừa nhập về 1 chiếc Switch Cisco Catalyst 2960-24TT mới nguyên thùng để lắp vào tủ Rack Tầng 1 (`SW-Floor1`). Thiết bị chưa có bất kỳ cấu hình hay địa chỉ IP nào. Bạn cần mang Laptop và cáp Console vào phòng Server để đặt tên định danh, thiết lập 3 lớp mật khẩu bảo vệ, cấu hình địa chỉ IP quản trị `192.168.1.2/24` (Gateway `192.168.1.1`) để từ ngày mai bạn có thể ngồi tại bàn làm việc điều khiển Switch qua mạng mà không cần xuống phòng Server, đồng thời đảm bảo khi cúp điện cấu hình không bị mất.",
    verification_vi: [
      {
        cmd: "Switch# show running-config   và   Switch# show startup-config",
        purpose: "Kiểm tra cấu hình đang chạy trong RAM và cấu hình đã lưu trong NVRAM.",
        expectedOutput: "`enable secret 5 $1$...` hiển thị dạng mã băm MD5; các mật khẩu line console/vty hiển thị dạng `password 7 ...` (nhờ `service password-encryption`); `show startup-config` khớp với `running-config`.",
        wrongSign: "Nếu `show startup-config` báo `startup-config is not present`, bạn đã quên gõ `copy running-config startup-config` — tắt nguồn sẽ mất sạch cấu hình!"
      },
      {
        cmd: "Switch# show ip interface brief",
        purpose: "Kiểm tra địa chỉ IP và trạng thái hoạt động của cổng ảo quản trị SVI `Vlan1` cùng 24 cổng vật lý.",
        expectedOutput: "Dòng `Vlan1` hiển thị IP `192.168.1.2`, cột `Status: up` và cột `Protocol: up`.",
        wrongSign: "Nếu `Vlan1` hiện `Status: administratively down`, bạn đã quên gõ `no shutdown` trong `interface vlan 1`. Nếu `Status: up` nhưng `Protocol: down`, chưa có bất kỳ cổng vật lý nào thuộc VLAN 1 đang cắm cáp active (`up/up`)."
      }
    ],
    troubleshooting_vi: [
      {
        issue: "Sự cố 1: Gõ sai một từ ở dấu nhắc `Switch#` khiến màn hình CLI bị treo cứng khoảng 30 giây kèm dòng `Translating \"...\"... domain server (255.255.255.255)`.",
        cause: "Mặc định Cisco IOS hiểu mọi từ không phải câu lệnh là tên miền một thiết bị khác và phát Broadcast tìm máy chủ DNS để Telnet tới.",
        fix: "Bấm tổ hợp phím `Ctrl + Shift + 6` để cắt ngang ngay lập tức, sau đó vào Global Config gõ lệnh **`no ip domain-lookup`**."
      },
      {
        issue: "Sự cố 2: Đã đặt IP cho `interface vlan 1` và `no shutdown` trên Switch, máy tính trong cùng phòng ping tới Switch thông, nhưng máy tính của Admin ở phòng ban khác (khác Subnet, đi qua Router) lại không ping hay Telnet/SSH vào Switch được.",
        cause: "Quên cấu hình **`ip default-gateway`** trên Switch Layer 2, khiến Switch không biết gửi gói tin trả lời về cho Router nào để đi sang mạng khác.",
        fix: "Ở chế độ Global Config trên Switch, gõ lệnh **`ip default-gateway 192.168.1.1`** (trỏ về địa chỉ IP cổng LAN của Router)."
      },
      {
        issue: "Sự cố 3: Đã gõ `password cisco123` trong `line console 0` hoặc `line vty 0 15`, nhưng khi kết nối vào thiết bị vẫn không hỏi mật khẩu (hoặc báo `Password required, but none set`).",
        cause: "Thiếu câu lệnh kích hoạt kiểm tra đăng nhập **`login`** bên dưới chế độ `(config-line)#`.",
        fix: "Vào lại `line console 0` và `line vty 0 15`, gõ bổ sung lệnh **`login`** (hoặc `login local` nếu dùng tài khoản `username ... secret ...`)."
      }
    ]
  },
  3: {
    level: 1,
    examTag: "CCNA Domain 1.0 • OSI & TCP/IP Models",
    objectives_vi: [
      "Thuộc lòng và giải thích đúng chức năng của 7 tầng trong mô hình tham chiếu OSI (Physical -> Application) và 4 tầng trong mô hình giao thức TCP/IP.",
      "Xác định chính xác tên gọi Đơn vị dữ liệu giao thức (PDU) tại từng tầng: Bits (L1), Frame (L2), Packet (L3), Segment/Datagram (L4) và Data (L5–L7).",
      "Mô tả từng bước quá trình Đóng gói (Encapsulation - từ trên xuống dưới tại máy gửi) và Mở gói (Decapsulation - từ dưới lên trên tại máy nhận).",
      "Phân biệt vai trò và sự thay đổi của Địa chỉ vật lý Tầng 2 (MAC Address - thay đổi qua từng chặng Router) và Địa chỉ logic Tầng 3 (IP Address - giữ nguyên từ nguồn tới đích)."
    ],
    scenario_vi: "Một máy trạm PC của nhân viên Phòng Kế Toán (`192.168.10.10`) mở trình duyệt truy cập vào máy chủ Web Nội Bộ (`192.168.20.100`) nằm ở một mạng LAN khác cách đó 2 chiếc Router. Khi sự cố mất kết nối xảy ra, để không phải đoán mò, bạn cần sử dụng mô hình phân tầng OSI để khoanh vùng chính xác lỗi đang nằm ở Tầng 1 (Cáp/Đèn cổng), Tầng 2 (MAC/VLAN/Switch), Tầng 3 (IP/Routing) hay Tầng 4–7 (Port/Firewall/Web Service).",
    verification_vi: [
      {
        cmd: "Simulation Mode trong Cisco Packet Tracer (Bấm vào phong bì PDU -> Xem tab Inbound PDU Details & Outbound PDU Details)",
        purpose: "Quan sát trực quan các lớp Header được đóng gói tại từng tầng OSI khi gói tin đi qua PC, Switch và Router.",
        expectedOutput: "Tại Switch Layer 2 chỉ thấy OSI Layer 1 và Layer 2 (Ethernet II Header với Src MAC & Dst MAC). Tại Router Layer 3 thấy bóc lớp Ethernet II cũ, đọc Layer 3 IP Header (Src IP & Dst IP), giảm TTL đi 1 và đóng lớp Ethernet II mới.",
        wrongSign: "Nếu tại một thiết bị phong bì PDU hiện dấu `X` màu đỏ, bấm vào phong bì để xem tầng nào từ chối xử lý (ví dụ Layer 3 báo không có route, hoặc Layer 2 báo sai VLAN)."
      }
    ],
    troubleshooting_vi: [
      {
        issue: "Sự cố 1: Nhầm lẫn trong bài thi và thực tế về việc Địa chỉ MAC và Địa chỉ IP có thay đổi hay không khi gói tin đi qua nhiều Router.",
        cause: "Chưa nắm vững ranh giới giữa Tầng 2 (Data Link - chỉ có giá trị trong từng chặng mạng cục bộ) và Tầng 3 (Network - định danh đầu-cuối toàn cầu).",
        fix: "Ghi nhớ quy tắc bất biến: Khi đi qua Router (không chạy NAT), **Source IP và Destination IP luôn GIỮ NGUYÊN từ đầu đến cuối**; còn **Source MAC và Destination MAC bị XÓA VÀ VIẾT LẠI MỚI ở mỗi chặng Router (Hop-by-Hop)**!"
      },
      {
        issue: "Sự cố 2: Ping địa chỉ IP của Web Server (`ping 192.168.20.100`) thông hoàn toàn (Tầng 1, 2, 3 tốt), nhưng mở trình duyệt Web gõ `http://192.168.20.100` lại báo lỗi không tải được trang.",
        cause: "Tầng 1–3 đã thông suốt, lỗi nằm ở **Tầng 4 (Transport - bị ACL chặn TCP Port 80/443)** hoặc **Tầng 7 (Application - dịch vụ HTTP trên Server đang bị tắt)**.",
        fix: "Kiểm tra dịch vụ HTTP/HTTPS trên Server đã bật `On` chưa, và dùng `show access-lists` trên Router kiểm tra xem có dòng ACL nào chặn TCP port 80/443 không."
      }
    ]
  },
  4: {
    level: 1,
    examTag: "CCNA Domain 1.0 • Physical Layer & Cabling",
    objectives_vi: [
      "Giải thích chức năng của Tầng 1 (Physical Layer) và phân biệt rõ 4 khái niệm: Bandwidth (Băng thông lý thuyết), Throughput (Thông lượng thực tế), Goodput (Dữ liệu ứng dụng hữu ích) và Latency (Độ trễ).",
      "Nắm vững cấu tạo cáp đồng UTP/STP, nguyên lý xoắn đôi chống nhiễu EMI/RFI/Crosstalk, và thuộc lòng thứ tự 8 màu dây chuẩn bấm cáp **T568A** và **T568B**.",
      "Chọn đúng loại cáp đồng trong mọi tình huống: Cáp thẳng (Straight-Through), Cáp chéo (Crossover) và Cáp điều khiển (Rollover/Console).",
      "So sánh chi tiết cáp quang **Single-Mode Fiber (SMF - Lõi 9 µm, tia Laser, vỏ vàng, đi xa tới 100 km)** và **Multimode Fiber (MMF - Lõi 50/62.5 µm, đèn LED, vỏ cam/xanh ngọc, đi gần < 550m)**."
    ],
    scenario_vi: "Bạn phụ trách nghiệm thu hệ thống cáp mạng cho một tòa nhà văn phòng mới gồm: kéo cáp từ tủ Rack tầng đến 48 bàn làm việc (khoảng cách 40m–85m), nối 2 chiếc Switch cũ trong phòng máy với nhau, và kéo một đường trục Uplink nối từ Tòa nhà A sang Tòa nhà B cách nhau 1.200 mét đi ngang qua trạm biến áp điện cao thế. Bạn phải chọn đúng loại cáp cho từng vị trí để mạng không bị suy hao hay nhiễu.",
    verification_vi: [
      {
        cmd: "Switch# show interfaces gigabitEthernet 0/1",
        purpose: "Kiểm tra thông số vật lý Tầng 1: trạng thái cáp, tốc độ (Speed), chế độ song công (Duplex) và các bộ đếm lỗi vật lý (CRC, Runts, Giants, Collisions).",
        expectedOutput: "`GigabitEthernet0/1 is up, line protocol is up (connected)`, `Full-duplex, 1000Mb/s`, và `0 input errors, 0 CRC, 0 frame, 0runts, 0 giants, 0 collisions`.",
        wrongSign: "Nếu thấy chỉ số `CRC` và `input errors` tăng liên tục, dây cáp đồng đang bị bấm lỏng hạt RJ-45, cáp dài quá 100m, đi sát dây điện cao thế gây nhiễu EMI, hoặc bị lệch Duplex (Duplex Mismatch)!"
      }
    ],
    troubleshooting_vi: [
      {
        issue: "Sự cố 1: Kéo cáp đồng UTP Cat6 dài 160 mét nối từ tủ mạng văn phòng ra nhà kho khiến mạng chập chờn, rớt gói liên tục hoặc đèn cổng không sáng.",
        cause: "Vi phạm giới hạn vật lý của cáp đồng Ethernet UTP (**tối đa 100 mét** do hiện tượng suy hao tín hiệu điện - Attenuation).",
        fix: "Thay đường cáp nối ra nhà kho bằng **Cáp quang (Fiber-Optic)** sử dụng module quang SFP, hoặc đặt thêm một chiếc Switch trung gian ở mốc 80 mét để tái tạo tín hiệu."
      },
      {
        issue: "Sự cố 2: Trong Cisco Packet Tracer, nối 2 chiếc Switch 2960 (hoặc nối trực tiếp PC vào Router) bằng cáp đồng thẳng (Copper Straight-Through) nhưng đèn cổng ở cả 2 đầu vẫn đỏ lòm dù đã gõ `no shutdown`.",
        cause: "Hai thiết bị **cùng nhóm chân thu/phát** nối với nhau mà tính năng tự đảo chân **Auto-MDIX** đang bị tắt (hoặc mô phỏng thiết bị đời cũ), khiến chân Phát (Tx 1-2) của máy này đâm thẳng vào chân Phát (Tx 1-2) của máy kia.",
        fix: "Xóa sợi cáp thẳng và thay bằng sợi **Cáp chéo (Copper Cross-Over - nét đứt)** (1 đầu T568A, 1 đầu T568B), hoặc bật lệnh `mdix auto` trên cổng Switch."
      }
    ]
  },
  5: {
    level: 3,
    examTag: "CCNA Domain 1.0 • Binary & Hexadecimal",
    objectives_vi: [
      "Hiểu tại sao thiết bị mạng xử lý mọi địa chỉ IPv4 (32-bit), IPv6 (128-bit) và MAC (48-bit) dưới dạng hệ Nhị phân (Binary) và biểu diễn rút gọn qua hệ Thập phân / Thập lục phân.",
      "Thuộc lòng bảng giá trị 8 vị trí bit của 1 Octet (`128 - 64 - 32 - 16 - 8 - 4 - 2 - 1`) và dãy 9 con số vàng của Subnet Mask (`0, 128, 192, 224, 240, 248, 252, 254, 255`).",
      "Chuyển đổi chính xác và nhanh chóng giữa Thập phân <-> Nhị phân (8-bit) phục vụ chia mạng con IPv4.",
      "Chuyển đổi thần tốc giữa Nhị phân <-> Thập lục phân (Hexadecimal 0–9, A–F) bằng phương pháp cắt cụm 4-bit (Nibble `8 - 4 - 2 - 1`)."
    ],
    scenario_vi: "Trong bài thi CCNA 200-301 (không được mang máy tính bỏ túi vào phòng thi) cũng như khi cấu hình ACL Wildcard Mask, OSPF và đọc gói tin Wireshark tại doanh nghiệp, bạn bắt buộc phải tính nhẩm quy đổi các địa chỉ IP như `172.16.145.200/27` sang dạng nhị phân để tìm địa chỉ mạng, hoặc đọc địa chỉ MAC/IPv6 dạng Hex như `00:1B:63:84:45:E6` và `2001:0DB8:ACAD:000A::1` chỉ trong vài giây.",
    verification_vi: [
      {
        cmd: "Sử dụng Công cụ Quy đổi Nhị phân - Thập phân - Hex tương tác ngay bên dưới bài học",
        purpose: "Kiểm chứng kết quả tự tính nhẩm bằng tay với kết quả phân tách từng bit 8-bit và Hex.",
        expectedOutput: "Mọi số thập phân từ 0 đến 255 đều được tổ hợp duy nhất từ tổng các lũy thừa của 2 (`128, 64, 32, 16, 8, 4, 2, 1`).",
        wrongSign: "Nếu sau khi trừ đi giá trị một cột mà số dư vẫn lớn hơn hoặc bằng chính cột đó, bạn đã bỏ sót cột bên trái lớn hơn!"
      }
    ],
    troubleshooting_vi: [
      {
        issue: "Sự cố: Tính sai giá trị Subnet Mask khi mượn bit (ví dụ `/27` tính nhầm thành `.240` thay vì `.224`).",
        cause: "Cộng nhầm thứ tự các cột lũy thừa của 2 từ trái sang phải.",
        fix: "Thuộc lòng quy tắc cộng dồn 8 bit từ trái qua phải: 1 bit = `128` (/25); 2 bit = `192` (/26); 3 bit = `224` (/27); 4 bit = `240` (/28); 5 bit = `248` (/29); 6 bit = `252` (/30); 7 bit = `254` (/31); 8 bit = `255` (/32)."
      }
    ]
  },
  6: {
    level: 1,
    examTag: "CCNA Domain 1.0 & 2.0 • Data Link Layer",
    objectives_vi: [
      "Giải thích chức năng của Tầng 2 (Data Link Layer) và sự phối hợp giữa 2 tầng con: **LLC (IEEE 802.2 - kết nối lên Tầng 3)** và **MAC (IEEE 802.3/802.11 - đóng khung Frame và truy cập đường truyền)**.",
      "Phân biệt các mô hình拓扑 vật lý và logic của mạng LAN (Star, Extended Star) và mạng WAN (Point-to-Point, Hub-and-Spoke, Full Mesh).",
      "So sánh cơ chế truyền **Half-Duplex (Bán song công - dùng CSMA/CD trên Hub hoặc CSMA/CA trên Wi-Fi)** và **Full-Duplex (Song công toàn phần - truyền và nhận đồng thời trên Switch hiện đại, triệt tiêu 100% xung đột Collision)**.",
      "Giải phẫu 3 phần của mọi khung tin Data Link Frame: Header (Địa chỉ đích/nguồn, Type), Payload (Packet Tầng 3) và Trailer (FCS kiểm lỗi CRC-32)."
    ],
    scenario_vi: "Một xưởng sản xuất phản ánh đường truyền từ máy chủ điều khiển xuống khu vực văn phòng bị chậm bất thường, tốc độ copy file chỉ đạt vài trăm KB/s dù đang dùng cổng 100Mbps. Khi kiểm tra lệnh `show interfaces fa0/1` trên Switch, bạn phát hiện một đầu đang cấu hình cứng `Full-duplex` trong khi đầu kia tự thương lượng về `Half-duplex`, gây ra hàng vạn lỗi `Late Collisions` và `CRC errors`.",
    verification_vi: [
      {
        cmd: "Switch# show interfaces fastEthernet 0/1   và   Switch# show interfaces status",
        purpose: "Kiểm tra trạng thái thương lượng tốc độ (Speed) và chế độ song công (Duplex) giữa 2 thiết bị.",
        expectedOutput: "`show interfaces status` hiển thị `a-full` và `a-100` (hoặc `a-1000`) nghĩa là cả 2 đầu đã tự động đàm phán (Auto-negotiation) thành công lên Full-Duplex.",
        wrongSign: "Nếu 1 đầu hiện `full` (ép cứng) còn đầu kia hiện `a-half` (do không nhận được tín hiệu auto-negotiation nên lùi về mặc định Half-Duplex), mạng đang bị lỗi **Duplex Mismatch** nghiêm trọng (CDP sẽ báo `%CDP-4-DUPLEX_MISMATCH`)."
      }
    ],
    troubleshooting_vi: [
      {
        issue: "Sự cố: Lỗi lệch chế độ song công (Duplex Mismatch) giữa Switch và Router (hoặc giữa 2 Switch) làm tốc độ mạng tụt thê thảm và rớt gói khi truyền tải nặng.",
        cause: "Một đầu cổng được người quản trị gõ lệnh ép cứng `speed 100` và `duplex full`, trong khi đầu bên kia vẫn để mặc định `auto`. Theo chuẩn IEEE, khi đầu `auto` không nhận được xung đàm phán từ đầu ép cứng, nó sẽ tự hạ xuống **`half-duplex`**!",
        fix: "Luôn cấu hình **đồng bộ cả 2 đầu dây**: Hoặc để cả 2 đầu cùng là **`speed auto` + `duplex auto`** (khuyên dùng theo chuẩn Gigabit), hoặc nếu ép cứng thì phải ép **`duplex full`** ở cả 2 đầu!"
      }
    ]
  },
  7: {
    level: 2,
    examTag: "CCNA Domain 2.0 • Ethernet Switching & MAC Table",
    objectives_vi: [
      "Giải phẫu từng trường trong khung tin Ethernet II Frame (kích thước chuẩn từ **64 Bytes đến 1518 Bytes**; nhỏ hơn 64B là Runt frame, lớn hơn 1518B là Giant/Jumbo frame) và cấu trúc địa chỉ MAC 48-bit (24-bit OUI + 24-bit Vendor Assigned).",
      "Mô tả chính xác 2 quy trình cốt lõi của Switch Layer 2: **1) Học địa chỉ MAC nguồn (Learning - kiểm tra Source MAC)** và **2) Chuyển tiếp khung tin (Forwarding/Flooding - kiểm tra Destination MAC)**.",
      "Phân biệt rõ 3 trường hợp khi Switch tra cứu Destination MAC: **Known Unicast** (đẩy ra đúng 1 cổng duy nhất), **Unknown Unicast** (Flood ra tất cả các cổng cùng VLAN trừ cổng nhận vào), và **Broadcast/Multicast** (Flood ra tất cả các cổng cùng VLAN trừ cổng nhận vào).",
      "So sánh 2 phương thức chuyển mạch phần cứng trên Switch Cisco: **Store-and-Forward** (nhận đủ toàn bộ Frame, kiểm tra FCS không lỗi mới gửi đi) và **Cut-Through** (Fast-Forward & Fragment-Free)."
    ],
    scenario_vi: "Trong mạng LAN tầng 2 có 4 máy tính PC1, PC2, PC3, PC4 vừa mới bật nguồn và cắm vào các cổng `Fa0/1` đến `Fa0/4` của một chiếc Switch Cisco 2960 vừa khởi động lại (bảng MAC đang trống rỗng). Khi PC1 gửi gói tin đầu tiên cho PC3, bạn cần giải thích tại sao ban đầu tất cả các máy đều nhận được bản tin, nhưng từ gói tin thứ hai trở đi chỉ có đúng PC1 và PC3 giao tiếp riêng tư với nhau ở tốc độ tối đa.",
    verification_vi: [
      {
        cmd: "Switch# show mac address-table   (hoặc  show mac-address-table dynamic)",
        purpose: "Xem bảng địa chỉ MAC (CAM Table) hiện tại mà Switch đã học được trên từng cổng và từng VLAN.",
        expectedOutput: "Hiển thị danh sách gồm 4 cột: `Vlan` (ví dụ 1 hoặc 10), `Mac Address` (ví dụ `00d0.ba8e.1234`), `Type` (`DYNAMIC` - tự học có thời hạn lưu 300 giây, hoặc `STATIC`), và `Ports` (`Fa0/1`).",
        wrongSign: "Nếu bảng MAC hoàn toàn trống hoặc thiếu địa chỉ MAC của một máy PC, nghĩa là máy PC đó chưa gửi bất kỳ khung tin nào vào Switch trong 5 phút (300 giây) vừa qua hoặc dây cáp đang bị đứt (`down`)."
      }
    ],
    troubleshooting_vi: [
      {
        issue: "Sự cố 1: Thí sinh hoặc kỹ sư mới hiểu nhầm rằng khi Switch nhận một khung tin có Destination MAC chưa có trong bảng MAC, Switch sẽ gửi bản tin ARP đi hỏi.",
        cause: "Nhầm lẫn giữa vai trò của Host/Router (Tầng 3 chạy ARP để tìm MAC từ IP) với Switch Layer 2 (chỉ nhìn MAC, hoàn toàn không quan tâm tới IP).",
        fix: "Ghi nhớ: Switch Layer 2 thuần túy **KHÔNG BAO GIỜ phát ARP cho dữ liệu của PC**. Khi gặp Destination MAC lạ (Unknown Unicast), Switch chỉ đơn giản là **nhân bản và đẩy (Flood) khung tin đó ra tất cả các cổng đang mở thuộc cùng VLAN (trừ cổng vừa nhận vào)**!"
      },
      {
        issue: "Sự cố 2: Mạng LAN văn phòng tự nhiên đơ cứng, đèn tất cả các cổng trên Switch nhấp nháy sáng liên tục với tốc độ cực nhanh, CPU Switch lên 100%.",
        cause: "Xảy ra **Vòng lặp Tầng 2 (Layer 2 Switching Loop)** do ai đó cắm 2 đầu của cùng 1 sợi dây mạng vào 2 ổ cắm tường (hoặc nối vòng giữa 2 Switch mà tắt STP). Vì khung tin Ethernet Layer 2 **không có trường giảm thời gian sống TTL** như gói tin IP Layer 3, các khung tin Broadcast và Unknown Unicast sẽ bị Flood quay vòng tròn vĩnh viễn tạo thành **Bão Quảng bá (Broadcast Storm)** và làm bảng MAC bị nhảy cổng liên tục (**MAC Database Instability / MAC Flapping**).",
        fix: "Rút ngay sợi cáp cắm vòng lặp, bật giao thức **`spanning-tree mode rapid-pvst`** trên toàn bộ Switch và bật **`spanning-tree bpduguard enable`** trên tất cả các cổng Access cắm máy tính người dùng."
      }
    ]
  },
  8: {
    level: 4,
    examTag: "CCNA Domain 3.0 • Network Layer & IP Routing",
    objectives_vi: [
      "Giải thích 4 chức năng cốt lõi của Tầng 3 (Network Layer): Định địa chỉ logic (Addressing), Đóng gói (Encapsulation), Định tuyến (Routing) và Mở gói (Decapsulation).",
      "Hiểu rõ 3 đặc tính bản chất của giao thức IP (IPv4 & IPv6): **Connectionless** (Không thiết lập kết nối trước), **Best Effort** (Nỗ lực tối đa nhưng không đảm bảo báo nhận — việc đảm bảo tin cậy thuộc về TCP ở Tầng 4), và **Media Independent** (Độc lập với môi trường truyền dẫn vật lý, chỉ phụ thuộc MTU).",
      "Phân biệt cách một Host quyết định gửi gói tin: Gửi trực tiếp trong cùng mạng LAN (Local host) hay gửi qua **Default Gateway** (Remote host ở mạng khác) bằng phép toán AND giữa IP và Subnet Mask.",
      "Giải phẫu từng ký hiệu và thông số trong bảng định tuyến của Router Cisco (`show ip route`): `C` (Connected), `L` (Local /32), `S` (Static), `S*` (Default Route), `O` (OSPF), `[AD/Metric]`, Next-Hop IP và Exit Interface."
    ],
    scenario_vi: "Trụ sở chính công ty (Router R1 - LAN `192.168.10.0/24`) vừa mở thêm một Chi nhánh mới (Router R2 - LAN `192.168.20.0/24`) được nối với nhau qua đường cáp WAN `10.0.0.0/30`. Dù đã đặt đúng IP trên tất cả các cổng và đèn đều sáng xanh, máy tính ở Trụ sở vẫn không thể ping sang máy tính ở Chi nhánh (`Reply from 192.168.10.1: Destination host unreachable`). Bạn cần kiểm tra bảng định tuyến và cấu hình đường đi 2 chiều cho 2 Router.",
    verification_vi: [
      {
        cmd: "Router# show ip route   và   Router# show ipv6 route",
        purpose: "Kiểm tra bảng định tuyến Tầng 3 để xem Router đã biết đường tới mạng đích hay chưa.",
        expectedOutput: "Hiển thị các mạng gắn trực tiếp (`C` và `L`), các tuyến đường tĩnh (`S 192.168.20.0/24 [1/0] via 10.0.0.2`), tuyến động (`O` với `[110/cost]`), và dòng `Gateway of last resort is ...` nếu đã có Default Route (`S* 0.0.0.0/0`).",
        wrongSign: "Nếu dải mạng đích không khớp với bất kỳ dòng nào trong `show ip route` và cũng không có Default Route (`Gateway of last resort is not set`), Router sẽ lập tức **vứt bỏ (Drop)** gói tin và trả về thông báo ICMP `Destination Unreachable`!"
      }
    ],
    troubleshooting_vi: [
      {
        issue: "Sự cố 1: Đã cấu hình lệnh `ip route 192.168.20.0 255.255.255.0 10.0.0.2` trên Router R1 (Trụ sở), nhưng khi ping từ PC1 (`192.168.10.10`) sang PC2 (`192.168.20.10`) ở Chi nhánh vẫn bị `Request timed out`.",
        cause: "Định tuyến luôn đòi hỏi **Đường đi 2 chiều (Bidirectional Routing)**! Gói tin ICMP Echo Request đã đi từ R1 sang tới PC2 thành công, nhưng khi PC2 trả lời về cho Router R2 (Chi nhánh), trong bảng định tuyến của **R2 lại chưa có tuyến đường quay ngược về mạng `192.168.10.0/24`** của R1!",
        fix: "Đăng nhập vào Router R2 (Chi nhánh), kiểm tra `show ip route` và cấu hình bổ sung tuyến đường chiều về: **`R2(config)# ip route 192.168.10.0 255.255.255.0 10.0.0.1`**."
      },
      {
        issue: "Sự cố 2: Đã gõ câu lệnh `ip route` đúng cú pháp trên Router, nhưng khi gõ `show ip route` lại hoàn toàn không thấy dòng chữ `S` đó xuất hiện trong bảng định tuyến.",
        cause: "Một tuyến đường tĩnh (Static Route) chỉ được đưa vào bảng định tuyến khi **cổng thoát (Exit Interface) ứng với địa chỉ Next-Hop đó đang ở trạng thái `up / up`** và Next-Hop IP có thể giải quyết được trong bảng định tuyến.",
        fix: "Dùng lệnh `show ip interface brief` kiểm tra xem cổng nối sang Next-Hop có đang bị `shutdown` hay đứt cáp (`down/down`) không, hoặc kiểm tra xem có gõ sai địa chỉ IP của Next-Hop không."
      }
    ]
  },
  9: {
    level: 3,
    examTag: "CCNA Domain 1.0 & 3.0 • ARP & IPv6 ND",
    objectives_vi: [
      "Giải thích mối quan hệ sống còn giữa Địa chỉ IP (Tầng 3) và Địa chỉ MAC (Tầng 2) khi đóng gói một khung tin Ethernet.",
      "Mô tả chính xác 2 bước của giao thức **ARP (Address Resolution Protocol)** trong IPv4: **ARP Request (Broadcast `FF-FF-FF-FF-FF-FF`)** và **ARP Reply (Unicast)**.",
      "Xác định chính xác địa chỉ Destination MAC mà một máy tính sẽ đi tìm qua ARP khi gửi dữ liệu cho máy **cùng mạng LAN** so với khi gửi dữ liệu cho máy **khác mạng LAN (qua Default Gateway)**.",
      "Giải thích cách IPv6 loại bỏ hoàn toàn Broadcast và thay thế ARP bằng giao thức **ICMPv6 Neighbor Discovery (ND)** với 2 bản tin **Neighbor Solicitation (NS - gửi tới Solicited-Node Multicast `FF02::1:FFxx:xxxx`)** và **Neighbor Advertisement (NA)**."
    ],
    scenario_vi: "Khi máy tính PC1 (`192.168.1.10/24`, Gateway `192.168.1.1`) gõ lệnh `ping 8.8.8.8` lần đầu tiên sau khi khởi động, gói tin ping số 1 thường bị rớt (`Request timed out`) rồi 3 gói tin sau mới thành công (`! ! !`). Bạn cần giải thích cho khách hàng tại sao gói ping đầu tiên lại bị trễ do quy trình ARP và máy tính PC1 thực sự đã đóng gói địa chỉ MAC đích của ai vào trong khung tin gửi đi `8.8.8.8`.",
    verification_vi: [
      {
        cmd: "C:\\> arp -a   (trên PC Windows)   và   Router# show ip arp",
        purpose: "Xem bộ nhớ đệm bảng ánh xạ `[Địa chỉ IPv4 <-> Địa chỉ vật lý MAC]` hiện tại trên thiết bị.",
        expectedOutput: "Trên PC hiển thị các dòng `Internet Address (192.168.1.1) <-> Physical Address (00-01-42-xx-xx-xx) <-> Type (dynamic)`. Trên Router Cisco hiển thị thêm cột `Age (min)` và `Interface`.",
        wrongSign: "Nếu trong bảng `arp -a` của PC không hề có dòng địa chỉ IP của Default Gateway (`192.168.1.1`) sau khi ping, nghĩa là bản tin ARP Request không tới được cổng Router hoặc Router chưa bật cổng (`shutdown`)."
      }
    ],
    troubleshooting_vi: [
      {
        issue: "Sự cố 1 (Bẫy số 1 trong đề thi CCNA): Khi PC1 (`192.168.1.10/24`) gửi gói tin tới Web Server ngoài Internet (`8.8.8.8`), thí sinh chọn đáp án rằng PC1 sẽ gửi ARP Request hỏi 'Ai có IP 8.8.8.8?'.",
        cause: "Quên mất rằng bản tin Broadcast ARP **không bao giờ đi qua được Router** để ra ngoài mạng khác!",
        fix: "Quy tắc vàng: Khi máy tính thấy IP đích (`8.8.8.8`) **khác mạng con** với mình, nó **CHỈ gửi ARP Request hỏi địa chỉ MAC của Default Gateway (`192.168.1.1`)**! Trong khung tin rời khỏi PC1: `Dst IP = 8.8.8.8`, nhưng **`Dst MAC = MAC của cổng Router Default Gateway`**!"
      },
      {
        issue: "Sự cố 2: Kẻ tấn công trong mạng LAN gửi hàng loạt gói tin Gratuitous ARP / ARP Reply giả mạo tự nhận mình là IP Default Gateway `192.168.1.1` để nghe lén toàn bộ mật khẩu của nhân viên (ARP Spoofing / Poisoning).",
        cause: "Giao thức ARP truyền thống không có cơ chế xác thực — bất kỳ máy nào nhận được ARP Reply đều tự động ghi đè địa chỉ MAC mới vào bảng ARP Cache.",
        fix: "Bật bộ đôi tính năng bảo mật Tầng 2 trên Switch doanh nghiệp: **`ip dhcp snooping`** kết hợp **`ip arp inspection vlan <id>` (Dynamic ARP Inspection - DAI)** để Switch kiểm tra chéo và chặn đứng mọi gói ARP giả mạo."
      }
    ]
  },
  10: {
    level: 4,
    examTag: "CCNA Domain 1.0 & 3.0 • Basic Router Config",
    objectives_vi: [
      "Nêu rõ 3 điểm khác biệt cốt lõi khi cấu hình cổng vật lý của Router so với cổng của Switch Layer 2.",
      "Cấu hình hoàn chỉnh một Router Cisco chạy song song Dual-Stack (IPv4 + IPv6 Global Unicast + IPv6 Link-Local) kèm lệnh bắt buộc `ipv6 unicast-routing` và `no shutdown`.",
      "Chẩn đoán chính xác lỗi mạng Tầng 1 và Tầng 2 thông qua 4 tổ hợp trạng thái `Status / Protocol` của lệnh `show ip interface brief`.",
      "Triển khai giao diện ảo Loopback (`interface loopback 0`) và cấu hình định tuyến giữa các VLAN bằng kỹ thuật **Router-on-a-Stick (`encapsulation dot1Q <vlan>`)**."
    ],
    scenario_vi: "Công ty nâng cấp mạng văn phòng gồm 2 phòng ban: Phòng Kỹ Thuật (`VLAN 10: 192.168.10.0/24`) và Phòng Kinh Doanh (`VLAN 20: 192.168.20.0/24`) nối vào 1 chiếc Router Cisco ISR 4321 duy nhất. Bạn cần cấu hình chiếc Router này làm Default Gateway cho cả 2 phòng ban (hỗ trợ cả IPv4 và IPv6) và kiểm tra đảm bảo mọi cổng giao tiếp đều đạt trạng thái `up / up`.",
    verification_vi: [
      {
        cmd: "R1# show ip interface brief   và   R1# show ipv6 interface brief",
        purpose: "Kiểm tra nhanh toàn bộ địa chỉ IPv4/IPv6 và trạng thái hoạt động Tầng 1 (`Status`) / Tầng 2 (`Protocol`) của mọi cổng trên Router.",
        expectedOutput: "Các cổng đã cấu hình hiển thị đúng IP, `Method: manual`, `Status: up` và `Protocol: up`.",
        wrongSign: "`Status: administratively down` = Quên gõ `no shutdown`. `Status: down / Protocol: down` = Lỗi vật lý (đứt cáp, sai cáp, đầu kia đang tắt). `Status: up / Protocol: down` = Lỗi đóng gói Tầng 2 (sai encapsulation, thiếu clock rate)."
      }
    ],
    troubleshooting_vi: [
      {
        issue: "Sự cố 1: Khi gán địa chỉ IP cho cổng `Gi0/0/1` trên Router, màn hình CLI báo lỗi `% 192.168.10.0 overlaps with GigabitEthernet0/0/0`.",
        cause: "Cố tình đặt 2 cổng của cùng một chiếc Router thuộc **cùng một mạng con (Subnet)**! Khác với Switch, mỗi cổng định tuyến của Router là một miền quảng bá (Broadcast Domain) độc lập.",
        fix: "Kiểm tra lại bảng quy hoạch IP và gán cho mỗi cổng Router (hoặc mỗi Subinterface) một dải mạng con hoàn toàn tách biệt (ví dụ `Gi0/0/0` là `192.168.10.1/24`, còn `Gi0/0/1` là `192.168.20.1/24`)."
      },
      {
        issue: "Sự cố 2: Trong mô hình Router-on-a-Stick, đã tạo đủ các cổng con `Gi0/0/0.10` và `Gi0/0/0.20`, nhưng khi gõ lệnh `ip address 192.168.10.1 255.255.255.0` trong cổng con thì Router báo lỗi `% Configuring IP routing on a LAN subinterface is only allowed if that subinterface is already configured as part of an IEEE 802.10, IEEE 802.1Q, or ISL vLAN`.",
        cause: "Trên Subinterface của Router, bạn **bắt buộc phải khai báo lệnh đóng gói thẻ VLAN (`encapsulation dot1Q <vlan_id>`) TRƯỚC** rồi mới được phép gõ lệnh `ip address`!",
        fix: "Gõ lệnh **`encapsulation dot1Q 10`** trước, sau đó gõ lại lệnh `ip address 192.168.10.1 255.255.255.0`, và đừng quên vào cổng vật lý mẹ `interface Gi0/0/0` gõ **`no shutdown`**!"
      }
    ]
  },
  11: {
    level: 3,
    examTag: "CCNA Domain 1.0 & 3.0 • IPv4 Subnetting & VLSM",
    objectives_vi: [
      "Xác định chính xác 3 dải địa chỉ Private IPv4 theo chuẩn RFC 1918 (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) và các địa chỉ đặc biệt (Loopback `127.0.0.1`, APIPA `169.254.x.x`).",
      "Áp dụng 2 công thức cốt lõi khi mượn $n$ bit chia mạng con và còn lại $h$ bit Host: Số mạng con = $2^n$; Số IP khả dụng mỗi mạng = $2^h - 2$.",
      "Sử dụng phương pháp **Bước nhảy (Magic Number / Block Size = $256 - \\text{Mask}$)** để tìm tức thì Network ID, First Host, Last Host và Broadcast Address của bất kỳ IP nào trong 15 giây.",
      "Thiết kế bảng quy hoạch chia mạng con có độ dài thay đổi (**VLSM**) từ phòng ban lớn nhất xuống nhỏ nhất (dành `/30` cho kết nối WAN Point-to-Point giữa 2 Router)."
    ],
    scenario_vi: "Công ty bạn được cấp một dải mạng `192.168.10.0/24`. Sếp giao cho bạn quy hoạch địa chỉ IP bằng kỹ thuật VLSM cho 4 khu vực: Phòng Sản Xuất (100 máy), Phòng Kinh Doanh (50 máy), Phòng Kế Toán (25 máy), Phòng IT (10 máy) và 2 đường nối WAN điểm-nối-điểm giữa các Router (mỗi đường cần 2 IP). Nếu chia sai dẫn đến chồng lấn dải mạng (Overlapping Subnets) hoặc lấy nhầm địa chỉ Broadcast gán cho PC, mạng công ty sẽ lỗi ngay lập tức.",
    verification_vi: [
      {
        cmd: "Sử dụng Máy tính chia mạng con IPv4 (Subnetting & VLSM Calculator) tương tác ngay trong bài học + lệnh `show ip route` trên Router",
        purpose: "Kiểm tra chéo từng dải mạng con sau khi chia VLSM để đảm bảo không có 2 mạng con nào bị chồng lấn (Overlap) lên nhau.",
        expectedOutput: "Mọi Địa chỉ Mạng (Network ID) đều là **số chẵn** (chia hết cho Bước nhảy $2^h$), và mọi Địa chỉ Quảng bá (Broadcast Address) đều là **số lẻ** (bằng Địa chỉ mạng kế tiếp trừ đi 1).",
        wrongSign: "Khi gõ lệnh `ip address <ip> <mask>` trên PC hoặc Router mà máy báo `Bad mask /26 for address 192.168.10.64`, nghĩa là bạn đã vô tình lấy chính **Địa chỉ Mạng (Network ID)** hoặc **Địa chỉ Broadcast** đem gán cho thiết bị!"
      }
    ],
    troubleshooting_vi: [
      {
        issue: "Sự cố 1: Máy tính nhân viên báo dấu chấm than vàng không vào được mạng; khi gõ `ipconfig` thấy máy đang mang địa chỉ IP `169.254.45.12` kèm Subnet Mask `255.255.0.0`.",
        cause: "Địa chỉ **`169.254.x.x/16` (APIPA - Automatic Private IP Addressing)** là dấu hiệu kinh điển cho biết máy tính đang để chế độ nhận IP động (DHCP) nhưng **không liên lạc được với bất kỳ DHCP Server nào** nên hệ điều hành Windows tự bịa ra một IP tạm!",
        fix: "Kiểm tra dây cáp mạng cắm vào Switch, kiểm tra cổng Switch có đúng VLAN không, đã bật `spanning-tree portfast` chưa, và kiểm tra dịch vụ DHCP Server (hoặc lệnh `ip helper-address` trên Router)."
      },
      {
        issue: "Sự cố 2: Hai máy tính trong cùng một VLAN nhưng một máy cấu hình Subnet Mask là `/24` (`255.255.255.0`) còn máy kia gõ nhầm thành `/26` (`255.255.255.192`) dẫn đến lúc ping được lúc không.",
        cause: "Khi đặt lệch Subnet Mask, hai máy tính sẽ tính toán ra 2 miền Broadcast khác nhau. Máy `/26` (`.10`) sẽ tưởng rằng người bạn cùng phòng ở địa chỉ `.100` nằm ở mạng khác nên gửi gói tin lên Default Gateway thay vì gửi trực tiếp trong LAN!",
        fix: "Đảm bảo tất cả các thiết bị và cổng Default Gateway nằm trong cùng một VLAN / Subnet bắt buộc phải khai báo **cùng một Subnet Mask giống hệt nhau**."
      }
    ]
  },
  12: {
    level: 3,
    examTag: "CCNA Domain 1.0 & 3.0 • IPv6 Addressing & SLAAC",
    objectives_vi: [
      "Áp dụng chính xác 2 quy tắc vàng để rút gọn và bung rộng địa chỉ IPv6 dài 128-bit (8 Hextets): **Quy tắc 1 (Bỏ các số `0` đứng đầu mỗi Hextet)** và **Quy tắc 2 (Dùng dấu hai chấm kép `::` duy nhất 1 lần để thay cho chuỗi các Hextet toàn số `0` liên tiếp)**.",
      "Phân biệt 3 nhóm địa chỉ IPv6: **Unicast** (Global Unicast `2000::/3`, Link-Local `FE80::/10`, Loopback `::1/128`, Unique Local `FC00::/7`), **Multicast** (`FF00::/8`, All-Nodes `FF02::1`, All-Routers `FF02::2`) và **Anycast**.",
      "Giải thích quy trình tự tạo phần Interface ID 64-bit theo chuẩn **EUI-64** (chèn `FFFE` vào chính giữa địa chỉ MAC 48-bit và đảo bit thứ 7 từ trái sang) hoặc Random Interface ID.",
      "So sánh 3 phương thức cấp phát IPv6 tự động thông qua cờ trong bản tin ICMPv6 Router Advertisement (RA): **1) SLAAC thuần túy (`M=0, O=0`)**, **2) SLAAC + Stateless DHCPv6 (`M=0, O=1`)**, và **3) Stateful DHCPv6 (`M=1`)**."
    ],
    scenario_vi: "Theo yêu cầu chuyển đổi số và chuẩn bị cho sự cạn kiệt IPv4, công ty yêu cầu bạn nâng cấp mạng nội bộ lên chạy song song **Dual-Stack (IPv4 + IPv6)** với dải mạng IPv6 toàn cầu `2001:DB8:ACAD:10::/64`. Bạn cần cấu hình Router R1 sao cho toàn bộ máy tính nhân viên khi cắm dây vào mạng sẽ tự động nhận được địa chỉ IPv6 Global Unicast và Default Gateway qua cơ chế **SLAAC** mà không cần cài đặt máy chủ DHCPv6 phức tạp.",
    verification_vi: [
      {
        cmd: "R1# show ipv6 interface gigabitEthernet 0/0/0   và   R1# show ipv6 neighbors",
        purpose: "Kiểm tra chi tiết địa chỉ IPv6 Link-Local, Global Unicast, các nhóm Multicast đã tham gia (`FF02::1`, `FF02::2`) và bảng hàng xóm ICMPv6 ND.",
        expectedOutput: "Hiển thị `Link-local address is FE80::1`, `Global unicast address(es): 2001:DB8:ACAD:10::1, subnet is 2001:DB8:ACAD:10::/64`, và trong `Joined group address(es)` phải có **`FF02::2` (All-Routers Multicast)**.",
        wrongSign: "Nếu trong `Joined group address(es)` chỉ có `FF02::1` mà **KHÔNG có `FF02::2`**, bạn đã quên gõ câu lệnh toàn cục **`ipv6 unicast-routing`** — lúc này Router chỉ hoạt động như một máy trạm thường, không định tuyến IPv6 và không phát bản tin RA cho các PC chạy SLAAC!"
      }
    ],
    troubleshooting_vi: [
      {
        issue: "Sự cố 1: Đã gán địa chỉ IPv6 `2001:db8:acad:10::1/64` và `no shutdown` trên cổng LAN của Router, nhưng các máy tính PC trong phòng để chế độ `Automatic (SLAAC)` vẫn không tự sinh được địa chỉ IPv6 Global Unicast (chỉ có mỗi địa chỉ `FE80::...`).",
        cause: "Quên gõ câu lệnh **`Router(config)# ipv6 unicast-routing`**! Khi chưa có lệnh này, Router không gửi các bản tin **ICMPv6 Router Advertisement (RA)** chứa thông tin Prefix `/64` xuống mạng LAN.",
        fix: "Vào Global Configuration mode trên Router và gõ **`ipv6 unicast-routing`**. Ngay lập tức các máy tính PC trong LAN sẽ nhận được bản tin RA và tự ghép Prefix `2001:db8:acad:10::/64` thành địa chỉ IPv6 hoàn chỉnh!"
      },
      {
        issue: "Sự cố 2: Rút gọn địa chỉ IPv6 dùng dấu hai chấm kép `::` tới 2 lần trong cùng một địa chỉ (ví dụ `2001:db8::acad::1`), làm thiết bị báo lỗi cú pháp.",
        cause: "Nếu dùng `::` hai lần, máy tính không thể biết mỗi chỗ `::` đại diện cho bao nhiêu cụm 16-bit bằng `0` để cộng đủ 8 Hextets (128 bits).",
        fix: "Chỉ được phép dùng dấu **`::` tối đa 1 LẦN DUY NHẤT** cho chuỗi Hextet `0` dài nhất; vị trí các Hextet `0` ngắn hơn còn lại phải viết là số `:0:` đơn lẻ (ví dụ `2001:db8:0:acad::1`)."
      }
    ]
  },
  13: {
    level: 3,
    examTag: "CCNA Domain 1.0 & 3.0 • ICMP, Ping & Traceroute",
    objectives_vi: [
      "Giải thích vai trò của giao thức **ICMPv4** và **ICMPv6** trong việc báo cáo lỗi và kiểm tra khả năng kết nối mạng.",
      "Đọc hiểu chính xác các ký hiệu kết quả Ping trên Cisco IOS: **`!` (Thành công)**, **`.` (Hết thời gian chờ - Timeout)**, và **`U` (Destination Unreachable - Không tìm thấy đường đi hoặc bị ACL chặn)**.",
      "Giải thích cơ chế hoạt động từng bước của công cụ **`traceroute` / `tracert`** dựa trên việc tăng dần trường **TTL (Time-to-Live trong IPv4)** hoặc **Hop Limit (trong IPv6)** từ `1, 2, 3...` để thu nhận bản tin `ICMP Time Exceeded` từ từng Router trung gian.",
      "Nắm vững 4 bản tin đặc trưng chỉ có trong ICMPv6: **Router Solicitation (RS)**, **Router Advertisement (RA)**, **Neighbor Solicitation (NS)** và **Neighbor Advertisement (NA)** cùng cơ chế **DAD (Duplicate Address Detection)**."
    ],
    scenario_vi: "Một chi nhánh ở Đà Nẵng báo không thể truy cập được ứng dụng ERP đặt tại Trung tâm dữ liệu Hà Nội (đi qua 4 trạm Router). Bạn cần sử dụng tổ hợp lệnh `ping`, `Extended Ping` (chọn IP nguồn từ cổng LAN) và `traceroute` để xác định chính xác gói tin đang bị đứt hoặc bị chặn tại chiếc Router thứ mấy trên đường truyền.",
    verification_vi: [
      {
        cmd: "R1# ping 192.168.30.10 source 192.168.10.1   và   R1# traceroute 192.168.30.10",
        purpose: "Sử dụng Extended Ping để giả lập gói tin xuất phát từ mạng LAN nội bộ (`192.168.10.1`) thay vì cổng WAN gần nhất, và dùng `traceroute` để tìm chính xác trạm Router gây lỗi.",
        expectedOutput: "`ping` trả về `!!!!!` (`Success rate is 100 percent (5/5)`). `traceroute` hiển thị danh sách từng chặng `1 10.1.12.2 4 msec`, `2 10.1.23.2 8 msec`... cho tới đích.",
        wrongSign: "Nếu trên Router R1 gõ `ping 192.168.30.10` thông (`!!!!!`), nhưng khi thêm `source 192.168.10.1` lại báo `. . . . .` (Timeout) hoặc `U.U.U`, nghĩa là Router ở phía đích **chưa có tuyến đường định tuyến quay về mạng LAN `192.168.10.0/24`** (hoặc có ACL đang chặn mạng `192.168.10.0/24`)!"
      }
    ],
    troubleshooting_vi: [
      {
        issue: "Sự cố 1: Gõ lệnh `ping` trên Router Cisco thấy màn hình hiện kết quả **`U.U.U`** thay vì `.....`.",
        cause: "Chữ **`U` (Unreachable)** có nghĩa là một chiếc Router trên đường đi đã trả lời bản tin **ICMP Destination Unreachable** về cho bạn. Hai nguyên nhân phổ biến nhất là: 1) Chiếc Router đó tra bảng định tuyến không thấy đường tới mạng đích; hoặc 2) Gói tin bị một danh sách **ACL (Access Control List)** trên Router đó chặn (`deny`)!",
        fix: "Dùng lệnh `traceroute <ip_đích>` để xem trạm Router cuối cùng phản hồi trước khi báo `!H` hoặc `* * *` là trạm nào, sau đó đăng nhập vào Router đó kiểm tra `show ip route` và `show access-lists`."
      },
      {
        issue: "Sự cố 2: Gói tin đi vào một vòng lặp định tuyến (Routing Loop) giữa 2 Router R1 và R2 do cấu hình nhầm Default Route chỉ chéo vào nhau.",
        cause: "R1 đẩy gói tin sang R2, R2 lại đẩy trả về R1.",
        fix: "Trường **TTL (Time-to-Live)** trong IPv4 Header (hoặc **Hop Limit** trong IPv6) sẽ cứu mạng không bị treo vĩnh viễn bằng cách giảm đi 1 ở mỗi trạm Router; khi TTL giảm về `0`, Router sẽ hủy gói tin và gửi trả bản tin **ICMP Time Exceeded** (khi bạn chạy `traceroute`, nếu thấy địa chỉ 2 Router lặp đi lặp lại xen kẽ nhau cho tới dòng 30, chắc chắn mạng đang bị **Routing Loop**!)."
      }
    ]
  },
  14: {
    level: 5,
    examTag: "CCNA Domain 1.0 & 4.0 • Transport Layer (TCP & UDP)",
    objectives_vi: [
      "So sánh toàn diện 2 giao thức Tầng 4 (Transport Layer): **TCP (Hướng kết nối, Tin cậy 100%, Đánh số thứ tự Sequence/ACK, Điều khiển luồng Windowing, Header 20–60 Bytes)** và **UDP (Không kết nối, Nhanh, Độ trễ cực thấp, Không truyền lại, Header cố định 8 Bytes)**.",
      "Giải thích chi tiết quy trình **Bắt tay 3 bước của TCP (TCP 3-Way Handshake: `1. SYN` -> `2. SYN-ACK` -> `3. ACK`)** và quy trình đóng kết nối 4 bước (`FIN` / `ACK`).",
      "Phân loại 3 dải số hiệu cổng (Port Numbers 16-bit: 0–65535): **Well-Known Ports (0–1023)**, **Registered Ports (1024–49151)** và **Dynamic/Private Ports (49152–65535)**.",
      "Thuộc lòng bảng ánh xạ các ứng dụng mạng sang đúng giao thức TCP hay UDP và đúng số hiệu Port để viết cấu hình Extended ACL và chẩn đoán Firewall."
    ],
    scenario_vi: "Khi thiết lập quy tắc bảo mật Extended ACL trên Router biên của công ty, bạn phải mở chính xác các cổng dịch vụ cho nhân viên làm việc: Duyệt web an toàn (HTTPS), tra cứu tên miền (DNS), đồng bộ giờ (NTP), quản trị từ xa (SSH) và gọi điện thoại nội bộ (VoIP). Nếu bạn mở nhầm giao thức `tcp` thay vì `udp` cho dịch vụ NTP hoặc TFTP, toàn bộ hệ thống sẽ không hoạt động.",
    verification_vi: [
      {
        cmd: "C:\\> netstat -an   (trên Windows/Linux)   và   Router# show tcp brief",
        purpose: "Kiểm tra danh sách các kết nối TCP/UDP (Sockets = `IP:Port`) đang mở và trạng thái phiên làm việc (`LISTENING`, `ESTABLISHED`, `TIME_WAIT`, `SYN_SENT`).",
        expectedOutput: "Hiển thị cặp `Local Address (192.168.1.10:51234)` kết nối tới `Foreign Address (142.250.199.14:443)` với trạng thái `ESTABLISHED`.",
        wrongSign: "Nếu kết nối dừng mãi ở trạng thái `SYN_SENT`, nghĩa là máy bạn đã gửi gói `TCP SYN` (Bước 1 bắt tay) nhưng bị Firewall/ACL ở giữa đường chặn mất hoặc Server đích không mở Port đó!"
      }
    ],
    troubleshooting_vi: [
      {
        issue: "Sự cố 1 (Bẫy kinh điển trong đề thi CCNA): Viết lệnh ACL chỉ mở `permit udp any any eq 53` cho dịch vụ DNS nhưng một số truy vấn DNS lớn hoặc đồng bộ dữ liệu giữa 2 máy chủ DNS (Zone Transfer) lại bị lỗi.",
        cause: "Dịch vụ **DNS (Port 53)** là giao thức đặc biệt sử dụng **CẢ HAI giao thức UDP và TCP**: Nó dùng **UDP Port 53** cho các truy vấn tra cứu tên miền thông thường của người dùng (nhanh, gọn), nhưng dùng **TCP Port 53** khi kích thước bản tin trả lời lớn hơn 512 bytes hoặc khi đồng bộ cơ sở dữ liệu giữa các máy chủ DNS (**Zone Transfer**)!",
        fix: "Khi cấu hình Firewall/ACL cho máy chủ DNS, cần lưu ý vai trò kép của cả `udp eq 53` và `tcp eq 53`."
      },
      {
        issue: "Sự cố 2: Đường truyền WAN có hiện tượng nghẽn cổ chai khiến một số gói tin bị rớt, làm tốc độ tải file TCP đột ngột giảm mạnh rồi tăng dần lên lại.",
        cause: "Cơ chế **TCP Sliding Window & Congestion Avoidance (Điều khiển luồng và chống tắc nghẽn)**: Khi phát hiện mất gói tin (không nhận được `ACK`), TCP tự động thu nhỏ kích thước cửa sổ (`Window Size`) xuống để giảm số byte gửi đi mỗi đợt, sau đó mới tăng dần trở lại để bảo vệ mạng không bị sập.",
        fix: "Kiểm tra băng thông đường truyền và cấu hình QoS để ưu tiên các luồng dữ liệu quan trọng."
      }
    ]
  },
  15: {
    level: 5,
    examTag: "CCNA Domain 4.0 • Application Layer (DHCP, DNS, Web, FTP)",
    objectives_vi: [
      "Hiểu sâu và sắp xếp đúng thứ tự 4 bản tin trong quy trình xin cấp IPv4 động của **DHCP (Quy trình DORA: `1. DHCP Discover [Broadcast]` -> `2. DHCP Offer` -> `3. DHCP Request [Broadcast]` -> `4. DHCP ACK`)**.",
      "Cấu hình thành thạo một chiếc Router Cisco làm **DHCPv4 Server** (`ip dhcp excluded-address`, `ip dhcp pool`, `network`, `default-router`, `dns-server`) và cấu hình **DHCP Relay Agent (`ip helper-address`)** vượt qua Router.",
      "Phân biệt chức năng của 5 loại bản ghi DNS quan trọng nhất trong đề thi CCNA: **`A` (IPv4)**, **`AAAA` (IPv6)**, **`MX` (Mail Exchange)**, **`NS` (Name Server)** và **`CNAME` (Canonical Name / Alias)**.",
      "So sánh các giao thức Email (**SMTP Port 25** dùng để gửi; **POP3 Port 110** vs. **IMAP Port 143** dùng để nhận) và các giao thức truyền file (**FTP TCP 20/21**, **TFTP UDP 69**, **SMB TCP 445**)."
    ],
    scenario_vi: "Doanh nghiệp bạn có 3 VLAN người dùng (VLAN 10, 20, 30) nhưng chỉ đặt duy nhất 1 máy chủ Windows Server chạy dịch vụ DHCP và DNS tập trung tại Phòng Server (`VLAN 100 - IP 192.168.100.10`). Ban đầu các máy tính ở VLAN 10, 20, 30 không thể nào nhận được địa chỉ IP tự động từ máy chủ ở VLAN 100. Bạn cần giải thích nguyên nhân ở Tầng 3 và cấu hình lệnh tiếp sức trên Router/Switch Layer 3.",
    verification_vi: [
      {
        cmd: "Router# show ip dhcp binding   và   Router# show ip dhcp pool",
        purpose: "Kiểm tra danh sách các địa chỉ IP mà Router DHCP Server đã cấp phát cho từng địa chỉ MAC của máy trạm và số lượng IP còn trống trong bể Pool.",
        expectedOutput: "Bảng `show ip dhcp binding` liệt kê rõ `IP address (192.168.10.11) <-> Client-ID/Hardware address (0050.7966.6800) <-> Lease expiration <-> Type (Automatic)`.",
        wrongSign: "Nếu bảng `show ip dhcp binding` trống trơn trong khi PC báo lỗi APIPA `169.254.x.x`, kiểm tra xem câu lệnh `network` trong `ip dhcp pool` đã khớp với địa chỉ IP của cổng LAN trên Router chưa, hoặc cổng LAN nối với máy khách ở mạng khác đã có lệnh `ip helper-address` chưa!"
      }
    ],
    troubleshooting_vi: [
      {
        issue: "Sự cố 1: Máy chủ DHCP nằm ở mạng `192.168.100.10`, còn máy tính nhân viên nằm ở mạng `192.168.10.0/24` (cắm vào cổng `Gi0/0/0` của Router). Nhân viên để chế độ nhận IP động nhưng toàn bộ đều thất bại và rơi về IP `169.254.x.x`.",
        cause: "Bản tin đầu tiên của máy trạm là **`DHCP Discover`** được gửi dưới dạng **Broadcast (`255.255.255.255`)**. Theo nguyên lý cốt lõi, **Router chặn đứng mọi gói tin Broadcast Tầng 3** nên gói tin Discover bị chặn ngay tại cổng `Gi0/0/0` và không bao giờ sang được mạng `.100.0`!",
        fix: "Vào đúng cổng Router nối trực tiếp với máy tính nhân viên (`interface Gi0/0/0`), gõ lệnh **`ip helper-address 192.168.100.10`** (chú ý: điền IP của máy chủ DHCP). Router sẽ đón gói DHCP Broadcast, đóng gói lại thành Unicast và chuyển thẳng sang máy chủ DHCP!"
      },
      {
        issue: "Sự cố 2: Máy tính ping địa chỉ IP `8.8.8.8` hoặc IP của website công ty thì thông hoàn toàn, nhưng gõ tên miền `www.cisco.com` trên trình duyệt lại báo `This site can't be reached (DNS_PROBE_FINISHED_NXDOMAIN)`.",
        cause: "Kết nối định tuyến IP Tầng 3 hoàn toàn tốt, nhưng máy tính đang bị **thiếu cấu hình địa chỉ DNS Server** hoặc máy chủ DNS đang bị lỗi / lưu bộ nhớ đệm DNS Cache cũ.",
        fix: "Mở Command Prompt gõ `nslookup www.cisco.com` để kiểm tra phản hồi của DNS; gõ `ipconfig /flushdns` để xóa cache cũ và khai báo bổ sung `dns-server 8.8.8.8` trong bể cấp phát DHCP."
      }
    ]
  },
  16: {
    level: 6,
    examTag: "CCNA Domain 5.0 • Security Fundamentals & Hardening",
    objectives_vi: [
      "Áp dụng tam giác bảo mật **CIA Triad (Confidentiality, Integrity, Availability)** để phân loại các mối đe dọa, 3 loại mã độc (**Virus, Worm, Trojan Horse**) và 3 nhóm tấn công mạng (**Reconnaissance, Access, DoS/DDoS**).",
      "Thực hiện đúng và đủ **5 bước bắt buộc để cấu hình quản trị từ xa mã hóa qua SSH v2 (TCP Port 22)** và khóa hoàn toàn giao thức Telnet (TCP Port 23) trên Router/Switch Cisco.",
      "Gia cố thiết bị chống tấn công dò mật khẩu (Brute-Force) bằng bộ lệnh: `security passwords min-length`, `exec-timeout`, `login block-for <seconds> attempts <tries> within <seconds>`.",
      "Hiểu nguyên lý bảo mật cổng Switch (**Port Security**), quy tắc đặt **Standard ACL (gần Đích)** vs. **Extended ACL (gần Nguồn)** và mô hình xác thực tập trung **AAA (RADIUS vs. TACACS+)**."
    ],
    scenario_vi: "Đoàn kiểm toán an ninh thông tin (ISO 27001) vừa quét mạng công ty bạn và phát hiện lỗi bảo mật nghiêm trọng: các thiết bị Router và Switch vẫn đang mở cổng **Telnet (TCP 23)** cho phép bắt gói tin Wireshark đọc trộm mật khẩu dạng chữ rõ, không có cơ chế tự khóa khi có kẻ chạy tool dò mật khẩu liên tục, và các ổ cắm mạng ở phòng họp khách vãng lai không được khóa địa chỉ MAC. Bạn có 2 giờ để gia cố (Hardening) toàn bộ hệ thống.",
    verification_vi: [
      {
        cmd: "R1# show ip ssh   và   R1# show ssh",
        purpose: "Kiểm tra xem dịch vụ SSH v2 đã được kích hoạt thành công chưa và xem các phiên đăng nhập SSH đang hoạt động.",
        expectedOutput: "`SSH Enabled - version 2.0`, `Authentication timeout: 120 secs; Authentication retries: 3`.",
        wrongSign: "Nếu `show ip ssh` báo `SSH Disabled - version 1.99`, bạn chưa sinh cặp khóa mã hóa RSA bằng lệnh `crypto key generate rsa`!"
      },
      {
        cmd: "SW1# show port-security interface fastEthernet 0/1   và   SW1# show port-security address",
        purpose: "Kiểm tra trạng thái bảo mật cổng Switch, số lượng MAC tối đa cho phép, chế độ xử lý vi phạm (Violation Mode) và danh sách địa chỉ MAC hợp lệ đã học (Sticky).",
        expectedOutput: "`Port Security : Enabled`, `Port Status : Secure-up`, `Violation Mode : Shutdown`, `Maximum MAC Addresses : 1`, `Security Violation Count : 0`.",
        wrongSign: "Nếu `Port Status : Secure-shutdown` (và trong `show interfaces status` hiện **`err-disabled`**), nghĩa là đã có người cắm một thiết bị có địa chỉ MAC lạ vào cổng đó khiến Switch tự động khóa sập cổng!"
      }
    ],
    troubleshooting_vi: [
      {
        issue: "Sự cố 1: Khi gõ lệnh `crypto key generate rsa` để bật SSH trên Router/Switch, máy báo lỗi `% Please define ahostname other than Router` hoặc `% Please define a domain-name first`.",
        cause: "Để tạo cặp khóa RSA, Cisco IOS bắt buộc phải lấy **`<hostname>.<domain-name>`** (ví dụ `R1.cisco.com`) làm tên định danh cho chìa khóa.",
        fix: "Thực hiện đúng trình tự: 1) Đổi tên máy khác mặc định (`hostname R1`); 2) Đặt tên miền (`ip domain-name cisco.com`); rồi mới 3) Gõ `crypto key generate rsa general-keys modulus 2048`."
      },
      {
        issue: "Sự cố 2: Một cổng trên Switch bị khóa vào trạng thái **`err-disabled`** sau khi nhân viên đổi máy tính mới (vi phạm Port Security Violation Shutdown). Dù đã cắm lại máy tính cũ hợp lệ và vào cổng gõ `no shutdown`, cổng vẫn không sáng đèn trở lại!",
        cause: "Khi một cổng Cisco Switch đã rơi vào trạng thái lỗi bảo mật `err-disabled`, chỉ gõ mỗi lệnh `no shutdown` sẽ **KHÔNG có tác dụng** khôi phục cổng!",
        fix: "Sau khi đã xử lý xong nguyên nhân vi phạm (hoặc xóa MAC cũ bằng `no switchport port-security mac-address sticky ...`), bạn bắt buộc phải vào cổng đó gõ **2 lệnh liên tiếp: tắt cổng hoàn toàn bằng `shutdown`, rồi mới bật lại bằng `no shutdown`**!"
      }
    ]
  },
  17: {
    level: 8,
    examTag: "CCNA Domain 1.0–5.0 • Enterprise Design & Troubleshooting",
    objectives_vi: [
      "Thiết kế mạng doanh nghiệp vừa và nhỏ theo mô hình phân cấp chuẩn Cisco (Access - Distribution - Core / Collapsed Core) đảm bảo khả năng mở rộng, dự phòng và bảo mật.",
      "Xây dựng bộ tài liệu hồ sơ mạng chuẩn kỹ sư (Network Documentation & Baseline) và sử dụng giao thức **CDP / LLDP** để tự động khám phá, vẽ lại sơ đồ kết nối của một hệ thống mạng chưa có tài liệu.",
      "Áp dụng thuần thục **Quy trình Xử lý Sự cố 6 Bước của Cisco** và 3 phương pháp tiếp cận theo mô hình OSI (**Bottom-Up**, **Top-Down**, **Divide-and-Conquer**).",
      "Xử lý trọn vẹn các kịch bản lỗi tổng hợp thực tế: Lỗi cáp/cổng Tầng 1, lỗi VLAN/Trunking/Port-Security Tầng 2, lỗi IP/Subnet/Default Gateway/Routing Tầng 3, và lỗi ACL/NAT/DNS/DHCP Tầng 4–7."
    ],
    scenario_vi: "Bạn vừa được tuyển dụng làm Kỹ sư Mạng chính thức cho một doanh nghiệp có 3 phòng ban (VLAN 10, VLAN 20, VLAN 30), hệ thống điện thoại VoIP, máy chủ nội bộ và kết nối Internet qua Router biên. Người quản trị cũ nghỉ việc không bàn giao lại sơ đồ đấu nối cáp, đồng thời sáng nay Phòng Kế Toán báo không thể truy cập được máy chủ File Server và Internet. Bạn phải dùng các lệnh chẩn đoán để tự vẽ lại sơ đồ mạng, khoanh vùng điểm lỗi và khôi phục toàn bộ dịch vụ trong 30 phút.",
    verification_vi: [
      {
        cmd: "Switch# show cdp neighbors detail   và   Switch# show lldp neighbors detail",
        purpose: "Khám phá trực tiếp mọi thiết bị mạng đang cắm ở đầu dây bên kia (Tên thiết bị, Model, Cổng nối bên mình, Cổng nối bên kia, Phiên bản IOS và Địa chỉ IP quản trị).",
        expectedOutput: "Liệt kê rõ từng thiết bị hàng xóm, ví dụ `Device ID: R1-Edge`, `Entry address(es): IP address: 192.168.1.1`, `Interface: GigabitEthernet0/1, Port ID (outgoing port): GigabitEthernet0/0/0`.",
        wrongSign: "Nếu hai thiết bị đã cắm cáp sáng đèn xanh (`up/up`) nhưng `show cdp neighbors` không thấy thiết bị bên kia, có thể thiết bị bên kia không phải của Cisco (hãy bật chuẩn quốc tế `lldp run` và dùng `show lldp neighbors`) hoặc CDP đã bị tắt (`no cdp enable`)."
      }
    ],
    troubleshooting_vi: [
      {
        issue: "Sự cố 1 (Phương pháp Divide-and-Conquer / Chia để trị hiệu quả nhất thực tế): Nhân viên báo 'Mất mạng không vào được trang web nội bộ `http://fileserver.company.local`'.",
        cause: "Có hàng chục nguyên nhân có thể xảy ra từ Tầng 1 đến Tầng 7.",
        fix: "Thực hiện kiểm tra **Chia đôi từ Tầng 3 bằng lệnh `ping <IP_của_FileServer>`**: • Nếu **Ping IP THÔNG**: Chứng tỏ Tầng 1 (Cáp), Tầng 2 (VLAN/Trunk/Switch) và Tầng 3 (IP/Gateway/Routing) đã đúng 100% -> Chỉ cần kiểm tra từ Tầng 4 lên Tầng 7 (kiểm tra DNS `nslookup`, kiểm tra ACL chặn Port 80/443/445, hoặc dịch vụ trên Server). • Nếu **Ping IP THẤT BẠI**: Kiểm tra ngược xuống Tầng 1–3 (`ipconfig` -> `ping Default Gateway` -> `traceroute` -> `show ip interface brief` -> `show vlan brief` / `show interfaces trunk`)."
      },
      {
        issue: "Sự cố 2: Đã sửa xong lỗi cấu hình trên Router/Switch giúp mạng công ty chạy lại bình thường, nhưng sáng hôm sau sau một đợt cúp điện ngắn, toàn bộ lỗi cũ lại tái phát y hệt!",
        cause: "Quên bước cuối cùng trong quy trình Change Management: Cấu hình vừa sửa chỉ mới nằm trên bộ nhớ tạm **RAM (`running-config`)**, chưa được ghi vào **NVRAM (`startup-config`)**!",
        fix: "Sau mỗi lần thay đổi cấu hình và kiểm tra nghiệm thu thành công, luôn luôn gõ lệnh **`copy running-config startup-config`** (hoặc `write memory`) và sao lưu file cấu hình ra máy chủ TFTP/SCP."
      }
    ]
  }
};

// ============================================================================
// PART 4 & PART 5: CHUẨN HÓA TOÀN BỘ 35 BÀI LAB THEO 10 MỤC KỸ SƯ THỰC TẾ
// Tự động cung cấp đầy đủ 10 phần bắt buộc (A -> J) cho mọi bài Lab (Lab 01 -> 35):
// A. Lab Overview (Metadata, Độ khó Beginner/Intermediate/Advanced, Thời gian, Tiên quyết)
// B. Business Scenario (Đặt người học vào vai Network Engineer)
// C. Network Topology (Sơ đồ trực quan + chú thích cổng/VLAN/IP)
// D. IP Addressing Table (Bảng quy hoạch địa chỉ IP đầy đủ)
// E. Connection Guide (Bảng đấu nối cáp chi tiết từng cổng A <-> B & loại cáp)
// F. Step-by-step Configuration (Các giai đoạn cấu hình + CLI + Giải thích từng lệnh)
// G. Verification (Danh sách lệnh kiểm tra + Output mẫu đúng + Dấu hiệu nhận biết sai)
// H. Troubleshooting Scenarios (Các lỗi cố tình đưa vào + Quy trình 6 bước khắc phục)
// I. Expected Result (Checklist kết quả đầu ra phải đạt)
// J. Real-world Extension (Bài tập mở rộng theo môi trường doanh nghiệp)
// ============================================================================

function classifyLabTier(lab) {
  // Part 5 Categorization: BEGINNER / INTERMEDIATE / ADVANCED & REAL-WORLD
  const beginnerIds = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 21];
  const intermediateIds = [9, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 25, 26, 27, 28];
  if (beginnerIds.includes(lab.id)) {
    return {
      tier: "BEGINNER",
      tierLabel_vi: "BEGINNER (Cơ bản & Nền tảng)",
      tierLabel_en: "BEGINNER",
      duration_vi: "25 – 35 phút",
      duration_en: "25 – 35 mins",
      color: "beginner"
    };
  }
  if (intermediateIds.includes(lab.id)) {
    return {
      tier: "INTERMEDIATE",
      tierLabel_vi: "INTERMEDIATE (Trung cấp & Cốt lõi CCNA)",
      tierLabel_en: "INTERMEDIATE",
      duration_vi: "40 – 50 phút",
      duration_en: "40 – 50 mins",
      color: "intermediate"
    };
  }
  return {
    tier: "ADVANCED",
    tierLabel_vi: "ADVANCED / REAL-WORLD (Nâng cao & Doanh nghiệp)",
    tierLabel_en: "ADVANCED / REAL-WORLD",
    duration_vi: "50 – 75 phút",
    duration_en: "50 – 75 mins",
    color: "advanced"
  };
}

function getCableNameVi(type) {
  switch (type) {
    case "console":
      return "Cáp Console xanh ngọc (Rollover Cable)";
    case "crossover":
      return "Cáp đồng chéo (Copper Cross-Over - Nét đứt)";
    case "wireless":
      return "Sóng vô tuyến Wi-Fi (IEEE 802.11 Wireless RF - Không dùng cáp)";
    case "fiber":
      return "Cáp quang học (Fiber-Optic Cable - Màu cam)";
    case "serial":
      return "Cáp WAN tốc độ cao (Serial DCE/DTE hoặc Gigabit WAN)";
    default:
      return "Cáp đồng thẳng (Copper Straight-Through - Nét liền)";
  }
}

function getCableReasonVi(n1, n2, type) {
  if (type === "console") {
    return "Quản trị ngoài băng tần (Out-of-Band) nối từ cổng Serial RS-232 của Laptop vào cổng Console của Switch/Router.";
  }
  if (type === "wireless") {
    return `Kết nối không dây qua sóng vô tuyến Wi-Fi (WPA2/WPA3) giữa ${n1?.name || "Access Point"} và ${n2?.name || "Thiết bị thu Wi-Fi"}.`;
  }
  if (type === "fiber") {
    return "Kết nối trục xương sống tốc độ cao, khoảng cách xa và chống nhiễu điện từ giữa các tòa nhà / Core Switch.";
  }
  if (type === "serial") {
    return "Kết nối đường truyền diện rộng (WAN Point-to-Point) giữa 2 Router hoặc nối ra nhà mạng ISP.";
  }
  if (type === "crossover") {
    return `Kết nối giữa 2 thiết bị cùng nhóm chân thu/phát (${n1?.name || "Thiết bị A"} <-> ${n2?.name || "Thiết bị B"}) cần đảo cặp chân Tx (1-2) sang Rx (3-6).`;
  }
  return `Kết nối tiêu chuẩn giữa 2 thiết bị khác nhóm (${n1?.name || "Thiết bị đầu cuối"} <-> ${n2?.name || "Switch/Router"}).`;
}

function buildLabStandard10Data(lab) {
  const tierInfo = classifyLabTier(lab);
  const mod = (typeof modulesData !== "undefined" && modulesData.find((m) => m.id === lab.moduleId)) || null;
  const modTitle = mod ? `Học phần ${mod.id}: ${mod.title_vi || mod.title}` : `Học phần ${lab.moduleId}`;

  // E. Connection Guide Table built dynamically from lab.nodes & lab.links
  const nodes = lab.nodes || [];
  const links = lab.links || [];
  const connectionRows = links.map((lk, idx) => {
    const n1 = nodes[lk.from] || { name: `Device ${lk.from}`, type: "device" };
    const n2 = nodes[lk.to] || { name: `Device ${lk.to}`, type: "device" };
    return {
      step: idx + 1,
      devA: n1.name,
      portA: lk.p1 || "FastEthernet0 / Gi0/0",
      cable: getCableNameVi(lk.type),
      devB: n2.name,
      portB: lk.p2 || "FastEthernet0/1 / Gi0/1",
      note: lk.label || getCableReasonVi(n1, n2, lk.type)
    };
  });

  // F. Parse CLI commands into explained line-by-line table WITH exact CLI Mode context
  let currentPromptMode = "User EXEC (Switch> / Router>) hoặc PC Command Prompt";
  const cliExplanations = (lab.cli_commands || [])
    .filter((line) => line && !line.trim().startsWith("! ==="))
    .map((line) => {
      const commentMatch = line.match(/^(.+?\s)(#\s.*)$/);
      const cmdRaw = commentMatch ? commentMatch[1].trim() : line.trim();

      // Detect exact CLI Mode from prompt prefix
      let modeLabel = currentPromptMode;
      if (cmdRaw.startsWith("C:\\>") || cmdRaw.startsWith("PC>") || cmdRaw.startsWith("ftp>")) {
        modeLabel = "💻 PC Command Prompt (Desktop -> Command Prompt)";
      } else if (cmdRaw.startsWith("rommon")) {
        modeLabel = "🚑 ROMMON Recovery Mode (Nhấn Ctrl+C khi khởi động)";
      } else if (cmdRaw.includes("(config-if)#") || cmdRaw.includes("(config-if-range)#")) {
        modeLabel = "🔌 Interface Config Mode — (config-if)#";
        currentPromptMode = modeLabel;
      } else if (cmdRaw.includes("(config-subif)#")) {
        modeLabel = "🔀 Subinterface Config Mode — (config-subif)#";
        currentPromptMode = modeLabel;
      } else if (cmdRaw.includes("(config-line)#")) {
        modeLabel = "🔐 Line Config Mode — (config-line)#";
        currentPromptMode = modeLabel;
      } else if (cmdRaw.includes("(config-vlan)#")) {
        modeLabel = "🏷️ VLAN Config Mode — (config-vlan)#";
        currentPromptMode = modeLabel;
      } else if (cmdRaw.includes("(config-router)#")) {
        modeLabel = "🧭 Router OSPF Config Mode — (config-router)#";
        currentPromptMode = modeLabel;
      } else if (cmdRaw.includes("(dhcp-config)#")) {
        modeLabel = "📡 DHCP Pool Config Mode — (dhcp-config)#";
        currentPromptMode = modeLabel;
      } else if (cmdRaw.includes("(config)#")) {
        modeLabel = "⚙️ Global Configuration Mode — (config)#";
        currentPromptMode = modeLabel;
      } else if (cmdRaw.includes("#")) {
        modeLabel = "🛡️ Privileged EXEC Mode — Switch# / Router#";
        currentPromptMode = modeLabel;
      } else if (cmdRaw.includes(">")) {
        modeLabel = "👤 User EXEC Mode — Switch> / Router>";
        currentPromptMode = modeLabel;
      }

      if (commentMatch) {
        return {
          mode: modeLabel,
          cmd: cmdRaw,
          explain: commentMatch[2].replace(/^#\s*/, "").trim()
        };
      }
      // Auto-explain standard IOS commands if no inline comment
      let autoExp = "Thực thi câu lệnh cấu hình / kiểm tra trên thiết bị.";
      if (cmdRaw.includes("enable") && !cmdRaw.includes("secret")) autoExp = "Chuyển từ chế độ User EXEC (>) lên chế độ Đặc quyền Privileged EXEC (#).";
      else if (cmdRaw.includes("configure terminal")) autoExp = "Bước vào chế độ Cấu hình toàn cục (Global Configuration Mode).";
      else if (cmdRaw.includes("hostname ")) autoExp = "Đặt tên định danh cho thiết bị giúp phân biệt khi quản trị qua CLI/SSH.";
      else if (cmdRaw.includes("ip address ")) autoExp = "Gán địa chỉ IPv4 và Subnet Mask cho cổng giao tiếp đang chọn.";
      else if (cmdRaw.includes("no shutdown")) autoExp = "Kích hoạt mở cổng giao tiếp (chuyển trạng thái từ administratively down sang up/up).";
      else if (cmdRaw.includes("interface ")) autoExp = "Truy cập vào chế độ cấu hình của cổng giao tiếp mạng chỉ định.";
      else if (cmdRaw.includes("switchport mode access")) autoExp = "Ép cứng cổng Switch hoạt động ở chế độ Access (chỉ thuộc 1 VLAN, nối xuống thiết bị đầu cuối).";
      else if (cmdRaw.includes("switchport access vlan")) autoExp = "Gán cổng Access này vào đúng số hiệu VLAN của phòng ban tương ứng.";
      else if (cmdRaw.includes("switchport mode trunk")) autoExp = "Cấu hình cổng Switch thành đường trung kế Trunk 802.1Q chở nhiều VLAN cùng lúc.";
      else if (cmdRaw.includes("ip route ")) autoExp = "Khai báo tuyến đường tĩnh (Static Route): chỉ định mạng đích, Subnet Mask và địa chỉ Next-Hop.";
      else if (cmdRaw.includes("exit") || cmdRaw.includes("end")) autoExp = "Thoát khỏi chế độ cấu hình hiện tại để quay về cấp trước đó (hoặc về thẳng dấu nhắc #).";
      else if (cmdRaw.includes("copy running-config startup-config")) autoExp = "Lưu toàn bộ cấu hình đang chạy trong RAM vào bộ nhớ NVRAM vĩnh viễn.";
      return {
        mode: modeLabel,
        cmd: cmdRaw,
        explain: autoExp
      };
    });

  // Beginner 8-Question Walkthrough Guide ("Cẩm nang cầm tay chỉ việc cho người chưa biết gì")
  const devCategories = nodes.map((n) => {
    if (n.type === "router") return `• **${n.name}**: Góc dưới trái chọn **[Network Devices]** -> **[Routers]** -> Kéo model **4321 (ISR4321)** thả ra màn hình.`;
    if (n.type === "l3switch") return `• **${n.name}**: Chọn **[Network Devices]** -> **[Switches]** -> Kéo model **3560-24PS (Multilayer Switch)** thả ra màn hình.`;
    if (n.type === "switch") return `• **${n.name}**: Chọn **[Network Devices]** -> **[Switches]** -> Kéo model **2960-24TT** thả ra màn hình.`;
    if (n.type === "server") return `• **${n.name}**: Chọn **[End Devices]** -> **[End Devices]** -> Kéo biểu tượng **Server-PT** thả ra màn hình.`;
    if (n.type === "cloud") return `• **${n.name}**: Chọn nhánh kết nối mạng hoặc thiết bị tương ứng theo sơ đồ.`;
    return `• **${n.name}**: Chọn **[End Devices]** -> **[End Devices]** -> Kéo biểu tượng **PC-PT (hoặc Laptop-PT)** thả ra màn hình.`;
  });

  const beginnerWalkthrough = [
    {
      q: "1. Tôi cần click vào đâu & chọn thiết bị nào trong Cisco Packet Tracer?",
      a: `Nhìn xuống **Góc dưới cùng bên trái** màn hình Packet Tracer (khung chọn thiết bị), lần lượt click và kéo các thiết bị sau thả vào vùng trắng (Logical Workspace):<br/>${devCategories.join("<br/>")}<br/>💡 *Mẹo bắt buộc cho người mới:* Vào menu trên cùng **Options -> Preferences (Ctrl + R)** -> Tích chọn ô **Always Show Port Labels in Logical Workspace** để luôn nhìn thấy tên cổng \`Fa0/1\`, \`Gi0/0/0\` trên dây cáp!`
    },
    {
      q: "2. Tôi cần sử dụng loại cáp nào & kết nối vào cổng nào?",
      a: `Bấm vào biểu tượng **Tia sét màu cam (Connections)** ở góc dưới trái:<br/>` +
         `• **Dây đen nét liền (Copper Straight-Through - Cáp thẳng)**: Dùng nối 2 thiết bị **KHÁC nhóm** (PC/Server cắm vào Switch, hoặc Switch cắm lên Router).<br/>` +
         `• **Dây đen nét đứt (Copper Cross-Over - Cáp chéo)**: Dùng nối 2 thiết bị **CÙNG nhóm** (Switch nối Switch, Router nối Router, hoặc PC/Server cắm thẳng vào Router không qua Switch).<br/>` +
         `• **Dây xanh ngọc uốn cong (Console)**: Chỉ dùng khi muốn nối cổng \`RS-232\` của Laptop vào cổng \`Console\` của Switch/Router.<br/>` +
         `👉 *Chi tiết từng đầu cổng A và B đã được liệt kê chính xác tuyệt đối tại **Bảng E. Connection Guide** ngay bên dưới.*`
    },
    {
      q: "3. Tôi đặt địa chỉ IP cho PC ở đâu và nhập lệnh CLI cho Router/Switch ở chế độ nào?",
      a: `• **Đối với máy tính PC / Server**: Click vào hình chiếc PC -> Chọn tab **Desktop** -> Bấm vào ô **IP Configuration** -> Điền **IPv4 Address**, **Subnet Mask** và **Default Gateway** đúng theo **Bảng D. IP Addressing Table**.<br/>` +
         `• **Đối với Switch / Router**: Click vào thiết bị -> Chọn tab **CLI** (Nếu máy hỏi \`Would you like to enter the initial configuration dialog? [yes/no]:\`, hãy gõ **\`no\`** rồi bấm Enter).<br/>` +
         `• **Lưu ý quan trọng khi gõ lệnh**: Bạn **KHÔNG gõ phần dấu nhắc** (\`Switch>\`, \`Switch#\`, \`R1(config)#\`), mà **chỉ gõ phần câu lệnh nằm phía sau dấu \`>\` hoặc \`#\`**! Hãy đối chiếu cột **Chế độ CLI (Mode)** trong bảng giải thích lệnh ở Mục F để biết mình đang đứng đúng chế độ hay chưa.`
    },
    {
      q: "4. Làm sao biết mình đã làm đúng & Nếu kết quả không giống hướng dẫn thì phải làm gì?",
      a: `• **Dấu hiệu làm đúng**: 1) Đèn trên tất cả các sợi dây cáp đều chuyển sang **Tam giác màu xanh lá** (nếu đang màu cam STP, bấm nút **Fast Forward Time \`Alt + D\`** ở góc dưới trái để tua nhanh 30 giây); 2) Gõ các lệnh kiểm tra tại **Mục G. Verification** ra kết quả khớp với **Khung Output Mẫu Chuẩn**; 3) Đạt đủ các tiêu chí tại **Mục I. Expected Result**.<br/>` +
         `• **Nếu kết quả không giống**: Đừng xóa bài làm lại từ đầu! Hãy đối chiếu ngay với **Mục H. Troubleshooting Scenarios** bên dưới hoặc chụp màn hình gửi vào nút **🤖 Hỏi AI / Soi lỗi Lab** để được chỉ ra chính xác dòng lệnh bị thiếu.`
    }
  ];

  // B. Business Scenario tailored to the lab topic
  const scenario_vi = lab.scenario_vi || (
    `Bạn đang đảm nhận vị trí **Kỹ sư Mạng Doanh nghiệp (Enterprise Network Engineer)**. Trong dự án nâng cấp hạ tầng tuần này, Trưởng phòng IT giao cho bạn triển khai mô hình **${lab.title_vi.replace(/^Lab \d+:\s*/, "")}**. ` +
    `Hệ thống bao gồm các thiết bị: **${nodes.map((n) => n.name).join(", ")}**. ` +
    `Nhiệm vụ của bạn là đấu nối đúng loại cáp vật lý trên Cisco Packet Tracer, quy hoạch địa chỉ IP chính xác theo bảng thiết kế, thực hiện đầy đủ các bước cấu hình CLI, kiểm chứng bằng các lệnh \`show\` / \`ping\` và xử lý mọi sự cố phát sinh trước khi nghiệm thu đưa vào vận hành thực tế.`
  );

  // G. Verification Checklist & Output Analysis
  const verificationCommands = [];
  const allCmdStr = (lab.cli_commands || []).join("\n").toLowerCase();
  if (allCmdStr.includes("vlan") || allCmdStr.includes("switchport")) {
    verificationCommands.push({
      cmd: "show vlan brief   &   show interfaces trunk",
      goodOutput: "Các VLAN đã tạo hiển thị trạng thái `active` kèm đúng danh sách cổng Access (`Fa0/1`, `Fa0/2`...). Lệnh `show interfaces trunk` hiển thị cổng Uplink có `Mode: on`, `Encapsulation: 802.1q`, `Status: trunking` và `Native vlan` khớp cả 2 đầu.",
      sampleCliOutput:
`SW1# show vlan brief
VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Fa0/3, Fa0/4, ...
10   KE-TOAN                          active    Fa0/1
20   KY-THUAT                         active    Fa0/2

SW1# show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gi0/1       on           802.1q         trunking      1
Port        Vlans allowed on trunk
Gi0/1       1-1005`,
      badSign: "Nếu cổng Access vẫn nằm ở `VLAN 1 (default)` hoặc `show interfaces trunk` trống trơn (chưa lên Trunk), các máy cùng VLAN giữa 2 Switch sẽ không thể giao tiếp!"
    });
  }
  if (allCmdStr.includes("ip address") || allCmdStr.includes("interface")) {
    const firstDevName = (nodes.find((n) => n.type === "router" || n.type === "switch" || n.type === "l3switch")?.name || "R1").split(" ")[0];
    const ipSummaryLines = (lab.ipTable || [])
      .slice(0, 4)
      .map((row) => {
        const iface = (row[1] || "GigabitEthernet0/0/0").split("(")[0].trim().padEnd(22, " ");
        const ip = ((row[2] || "192.168.1.1").split("/")[0].split("&")[0].trim()).padEnd(15, " ");
        return `${iface} ${ip} YES manual up                    up`;
      })
      .join("\n");
    verificationCommands.push({
      cmd: "show ip interface brief   (hoặc  show ipv6 interface brief)",
      goodOutput: "Toàn bộ các cổng giao tiếp (vật lý, SVI `Vlan1`, hoặc Subinterface `.10`, `.20`) đều hiển thị đúng địa chỉ IP theo bảng quy hoạch, cột `Status: up` và cột `Protocol: up`.",
      sampleCliOutput:
`${firstDevName}# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
${ipSummaryLines || "GigabitEthernet0/0/0   192.168.1.1     YES manual up                    up"}`,
      badSign: "Nếu hiện `administratively down` là quên gõ lệnh `no shutdown`. Nếu hiện `Status: down / Protocol: down` là chưa cắm cáp, chọn sai loại cáp thẳng/chéo, hoặc cổng thiết bị đầu bên kia chưa bật."
    });
  }
  if (allCmdStr.includes("ip route") || allCmdStr.includes("router ospf") || allCmdStr.includes("encapsulation dot1q") || allCmdStr.includes("ip routing")) {
    verificationCommands.push({
      cmd: "show ip route",
      goodOutput: "Bảng định tuyến hiển thị đầy đủ các mạng kết nối trực tiếp (`C`), các tuyến đường tĩnh (`S` hoặc `S* 0.0.0.0/0`) và các tuyến học qua OSPF (`O` với `AD = 110`).",
      sampleCliOutput:
`R1# show ip route
Codes: L - local, C - connected, S - static, O - OSPF, * - candidate default
Gateway of last resort is 203.0.113.1 to network 0.0.0.0

C    192.168.10.0/24 is directly connected, GigabitEthernet0/0/0
S    192.168.20.0/24 [1/0] via 10.1.1.2
O    192.168.3.0/24 [110/2] via 10.1.12.2, 00:05:12, GigabitEthernet0/0/0`,
      badSign: "Nếu thiếu mạng đích trong `show ip route`, gói tin gửi tới mạng đó sẽ bị Router hủy bỏ và báo `Destination host unreachable (U.U.U)`."
    });
  }
  if (allCmdStr.includes("dhcp")) {
    verificationCommands.push({
      cmd: "show ip dhcp binding   &   ipconfig /all (trên PC)",
      goodOutput: "Hiển thị danh sách địa chỉ IP đã cấp thành công cho từng địa chỉ MAC của PC. Trên PC nhận đúng IPv4, Subnet Mask, Default Gateway và DNS Server.",
      sampleCliOutput:
`R1# show ip dhcp binding
IP address       Client-ID/              Lease expiration        Type
                 Hardware address
192.168.1.11     0001.42A8.19C1          --                      Automatic
192.168.1.12     00D0.BC74.3302          --                      Automatic`,
      badSign: "Nếu PC nhận địa chỉ `169.254.x.x` (APIPA), quá trình xin DHCP DORA đã thất bại!"
    });
  }
  if (allCmdStr.includes("nat")) {
    verificationCommands.push({
      cmd: "show ip nat translations   &   show ip nat statistics",
      goodOutput: "Sau khi PC ping hoặc duyệt web ra ngoài Internet, bảng dịch hiển thị rõ cột `Inside local` (IP Private) ánh xạ sang `Inside global` (IP Public kèm số Port).",
      sampleCliOutput:
`R1# show ip nat translations
Pro  Inside global         Inside local          Outside local         Outside global
icmp 203.0.113.2:1024      192.168.1.10:1        8.8.8.8:1             8.8.8.8:1024
tcp  203.0.113.2:1025      192.168.1.10:1025     8.8.8.8:80            8.8.8.8:80`,
      badSign: "Nếu bảng trống sau khi gửi lưu lượng, kiểm tra lại xem đã gõ đúng `ip nat inside` và `ip nat outside` trên 2 cổng Router chưa, và ACL trong câu lệnh NAT đã permit đúng dải mạng LAN chưa."
    });
  }
  if (allCmdStr.includes("access-list") || allCmdStr.includes("access-group")) {
    verificationCommands.push({
      cmd: "show access-lists",
      goodOutput: "Hiển thị đúng thứ tự các dòng luật `permit` / `deny` từ trên xuống dưới, kèm bộ đếm `(X matches)` tăng lên khi có gói tin đi qua khớp với luật đó.",
      sampleCliOutput:
`R1# show access-lists
Extended IP access list 100
    10 permit ip host 192.168.1.99 any (4 matches)
    20 permit tcp 192.168.1.0 0.0.0.255 host 10.0.0.100 eq www (12 matches)
    30 deny icmp any any (4 matches)`,
      badSign: "Nếu không có bộ đếm `(matches)` nào tăng lên, bạn đã quên gắn ACL vào cổng giao tiếp bằng lệnh `ip access-group <id> in/out` hoặc gắn nhầm chiều!"
    });
  }
  if (verificationCommands.length === 0) {
    verificationCommands.push({
      cmd: "ping <IP-Đích>   &   show running-config",
      goodOutput: "`ping` trả về tỷ lệ thành công 100% (`Sent = 4, Received = 4, Lost = 0` trên PC hoặc `!!!!!` trên Cisco CLI). File `running-config` ghi nhận đầy đủ các câu lệnh đã thiết lập.",
      sampleCliOutput:
`C:\\> ping 192.168.1.100
Pinging 192.168.1.100 with 32 bytes of data:
Reply from 192.168.1.100: bytes=32 time<1ms TTL=128
Reply from 192.168.1.100: bytes=32 time<1ms TTL=128
Ping statistics for 192.168.1.100:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`,
      badSign: "Nếu `ping` báo `Request timed out`, hãy kiểm tra lại đèn tín hiệu cáp (phải là tam giác xanh lá ở cả 2 đầu) và địa chỉ IP/Subnet Mask trên từng thiết bị."
    });
  }

  // H. Troubleshooting Scenarios (Realistic fault injection & 6-step diagnostic guide)
  const troubleshootingCases = buildLabTroubleshootingScenarios(lab, allCmdStr);

  // J. Real-world Enterprise Extension
  const extension_vi = buildLabRealWorldExtension(lab, allCmdStr);

  const hasPktFile = lab.id === 1;
  const pktFileUrl = hasPktFile ? "assets/labs/lab01.pkt" : null;
  const ptCompatibilityNote_vi = hasPktFile
    ? "✅ Đã đính kèm file mô phỏng gốc `assets/labs/lab01.pkt` (Tương thích Cisco Packet Tracer 8.0+). Các lệnh CLI và sơ đồ đã được kiểm chứng."
    : "🛠️ Tương thích Cisco Packet Tracer 8.2+ (Cần học viên tự dựng topology & nạp CLI để kiểm chứng trực tiếp trên phần mềm mô phỏng — Manual Simulation Verification Required). Lưu ý giới hạn mô phỏng: Packet Tracer hỗ trợ tập lệnh CCNA cốt lõi, một số tham số IOS-XE nâng cao ngoài phạm vi CCNA được ghi chú rõ.";

  return {
    tierInfo,
    modTitle,
    hasPktFile,
    pktFileUrl,
    ptCompatibilityNote_vi,
    prerequisites_vi: `Nắm vững lý thuyết tại **${modTitle}** và đã cài đặt phần mềm **Cisco Packet Tracer (phiên bản 8.x trở lên)**.`,
    tools_vi: "Cisco Packet Tracer 8.2+ (Logical & Physical Workspace, Simulation Mode, CLI Terminal, Command Prompt).",
    scenario_vi,
    connectionRows,
    cliExplanations,
    beginnerWalkthrough,
    verificationCommands,
    troubleshootingCases,
    extension_vi
  };
}

function buildLabTroubleshootingScenarios(lab, allCmdStr) {
  const cases = [];

  if (allCmdStr.includes("vlan") || allCmdStr.includes("trunk")) {
    cases.push({
      title: "Tình huống lỗi 1: Hai máy PC cùng thuộc một phòng ban (cùng VLAN) nhưng cắm trên 2 Switch khác nhau không thể Ping thông cho nhau.",
      symptom: "Ping từ PC ở Switch 1 sang PC cùng VLAN ở Switch 2 báo `Request timed out` hoàn toàn.",
      cause: "Cổng nối liên kết giữa 2 Switch vẫn đang ở chế độ mặc định (`Dynamic Auto` -> hình thành cổng Access VLAN 1) thay vì cổng **Trunk 802.1Q**, hoặc VLAN đó chưa được tạo trên một trong hai Switch, hoặc bị loại khỏi danh sách `allowed vlan`.",
      checkCmd: "SW1# show interfaces trunk   và   SW1# show vlan brief",
      analysis: "Nếu `show interfaces trunk` không liệt kê cổng nối giữa 2 Switch, đường Trunk chưa hình thành. Nếu cổng đã lên Trunk nhưng ở mục `Vlans in spanning tree forwarding state and not pruned` không có số VLAN đó, nghĩa là VLAN chưa được tạo hoặc đang bị STP khóa.",
      fixCmd: "interface <cổng_uplink>  ->  switchport mode trunk  ->  switchport trunk allowed vlan all",
      reverify: "Gõ lại `show interfaces trunk` thấy cổng xuất hiện trạng thái `trunking` và thực hiện `ping` lại giữa 2 PC thành công 100%."
    });
    cases.push({
      title: "Tình huống lỗi 2: Màn hình CLI liên tục bắn ra cảnh báo `%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/1`.",
      symptom: "Lưu lượng không gắn thẻ (Untagged) đi qua đường Trunk bị rò rỉ chéo giữa hai VLAN hoặc STP khóa cổng vì bất đồng bộ.",
      cause: "Hai đầu đường cáp Trunk giữa 2 Switch (hoặc giữa Switch và Subinterface của Router) đang cấu hình **khác số Native VLAN** (ví dụ SW1 để Native VLAN 99 nhưng SW2 vẫn để mặc định Native VLAN 1).",
      checkCmd: "SW1# show interfaces trunk   (So sánh cột `Native vlan` trên cả 2 thiết bị)",
      analysis: "Cột `Native vlan` trên SW1 hiện `99`, trong khi trên SW2 hiện `1`.",
      fixCmd: "Vào cổng Trunk của thiết bị bị lệch, gõ: `switchport trunk native vlan 99` (đồng bộ cả 2 đầu về cùng số VLAN 99).",
      reverify: "Thông báo lỗi CDP biến mất và `show interfaces trunk` trên cả 2 đầu đều hiển thị `Native vlan: 99`."
    });
  }

  if (allCmdStr.includes("ip route") || allCmdStr.includes("ospf") || allCmdStr.includes("encapsulation dot1q") || lab.moduleId === 8 || lab.moduleId === 10) {
    cases.push({
      title: "Tình huống lỗi: Máy tính PC ping tới địa chỉ IP cổng Router (Default Gateway) thì thành công, nhưng ping sang máy tính ở mạng LAN khác lại thất bại.",
      symptom: "Ping Default Gateway báo `Reply`, nhưng ping sang Subnet khác báo `Request timed out` hoặc `Reply from <Gateway>: Destination host unreachable`.",
      cause: "Có 3 nguyên nhân phổ biến nhất: 1) Máy tính PC ở mạng đích **khai báo sai hoặc quên điền Default Gateway** nên không biết gửi gói trả lời về đâu; 2) Router ở chiều đi hoặc chiều về **thiếu tuyến đường (Route)** trong bảng định tuyến; 3) Trong mô hình OSPF, hai Router cấu hình lệch **Area ID**, lệch **Subnet Mask / Wildcard Mask** hoặc lệch **Hello/Dead Timer** nên không lên được trạng thái `FULL`.",
      checkCmd: "Router# show ip route   |   Router# show ip ospf neighbor   |   PC> ipconfig",
      analysis: "Kiểm tra trên cả Router nguồn và Router đích xem đã có đủ tuyến đường tới mạng của nhau chưa. Kiểm tra trên PC đích xem mục `Default Gateway` có đang để trống hoặc gõ sai IP không.",
      fixCmd: "Điền đúng Default Gateway trên PC đích, và bổ sung lệnh `ip route <mạng_đích> <mask> <next_hop>` (hoặc `network <mạng> <wildcard> area 0` trong OSPF) trên cả 2 chiều Router.",
      reverify: "Gõ `show ip route` thấy xuất hiện mạng đích và `traceroute` từ PC nguồn sang PC đích đi qua đủ các trạm Router."
    });
  }

  // Universal physical / interface / IP troubleshooting scenario for every lab
  cases.push({
    title: `Tình huống lỗi ${cases.length + 1}: Đèn tín hiệu trên dây cáp trong Packet Tracer hiển thị màu Đỏ (hoặc màu Cam kéo dài) và cổng không hoạt động.`,
    symptom: "Đầu dây cáp hiện hình tam giác màu đỏ hướng xuống hoặc lệnh `ping` báo `Request timed out` 100%.",
    cause: "1) Nếu **Đèn Đỏ**: Cổng trên Router (hoặc cổng SVI `interface vlan 1` trên Switch) mặc định đang bị khóa tắt bởi lệnh **`shutdown`**; hoặc bạn chọn sai cáp đồng thẳng thay vì cáp đồng chéo khi nối 2 thiết bị cùng loại; hoặc cổng Switch bị khóa **`err-disabled`** do vi phạm Port Security / BPDU Guard. 2) Nếu **Đèn Cam**: Switch đang chạy thuật toán **Spanning Tree (STP)** mất 30–50 giây để nghe ngóng chống loop (hoặc cổng đó bị STP khóa làm Alternate Blocked Port trong mạch vòng).",
    checkCmd: "show ip interface brief   và   show interfaces status",
    analysis: "Quan sát cột `Status`: Nếu ghi `administratively down` là do thiếu lệnh `no shutdown`. Nếu ghi `down` là do sai loại cáp hoặc đầu bên kia chưa bật. Nếu ghi `err-disabled` là do vi phạm bảo mật cổng.",
    fixCmd: "interface <tên_cổng>  ->  no shutdown   (Nếu bị err-disabled thì gõ `shutdown` rồi mới gõ `no shutdown`; nếu đèn cam STP thì bấm nút `Fast Forward Time [Alt+D]` trên Packet Tracer).",
    reverify: "Đèn ở cả 2 đầu dây cáp chuyển sang hình tam giác màu xanh lá và lệnh `show ip interface brief` hiển thị `Status: up / Protocol: up`."
  });

  return cases;
}

function buildLabRealWorldExtension(lab, allCmdStr) {
  if (allCmdStr.includes("vlan") || allCmdStr.includes("trunk")) {
    return [
      "Mở rộng Doanh nghiệp 1 (Thêm phòng ban & Tách mạng Guest Wi-Fi): Hãy tạo thêm **VLAN 99 (Management)** để quản trị Switch riêng biệt và **VLAN 200 (Guest_WiFi)** dành cho khách vãng lai, đảm bảo lưu lượng khách bị cô lập hoàn toàn không được phép truy cập vào máy chủ nội bộ.",
      "Mở rộng Doanh nghiệp 2 (Bảo mật đường Trunk): Thay đổi Native VLAN trên tất cả các đường Trunk sang एक VLAN không sử dụng (ví dụ `switchport trunk native vlan 999`) và tắt giao thức tự đàm phán DTP bằng lệnh `switchport nonegotiate` để chống tấn công VLAN Hopping."
    ];
  }
  if (allCmdStr.includes("ospf") || allCmdStr.includes("ip route")) {
    return [
      "Mở rộng Doanh nghiệp 1 (Dự phòng Dual-WAN & Default Route): Thêm một chiếc Router ISP kết nối ra Internet (`8.8.8.8`), cấu hình Default Route trên Router biên và dùng lệnh `default-information originate` trong OSPF để tự động quảng bá đường ra Internet cho toàn bộ các Router chi nhánh.",
      "Mở rộng Doanh nghiệp 2 (Tối ưu băng thông & Bảo mật OSPF): Cấu hình `auto-cost reference-bandwidth 10000` trên tất cả các Router để OSPF phân biệt chính xác đường cáp quang 1Gbps và 10Gbps, đồng thời bật `passive-interface default` rồi chỉ mở trên các cổng nối giữa các Router."
    ];
  }
  return [
    "Mở rộng Doanh nghiệp 1 (Gia cố bảo mật Hardening): Trên tất cả các Switch và Router trong bài Lab này, hãy cấu hình thêm dịch vụ **SSH v2 (khóa RSA 2048-bit)**, khóa hoàn toàn Telnet (`transport input ssh`) và bật tính năng chống dò mật khẩu `login block-for 120 attempts 3 within 60`.",
    "Mở rộng Doanh nghiệp 2 (Mở rộng quy mô & Cấp phát tự động): Thêm 1 Switch Access tầng 2 nối Uplink lên hệ thống hiện tại, triển khai máy chủ **DHCP** cấp phát IP tự động cho các máy trạm mới và lưu toàn bộ cấu hình dự phòng lên máy chủ **TFTP Server**."
  ];
}

// Export global helpers
window.CCNA_ACADEMY_ROADMAP = CCNA_ACADEMY_ROADMAP;
window.MODULE_STANDARD_10_ENRICHMENT = MODULE_STANDARD_10_ENRICHMENT;
window.classifyLabTier = classifyLabTier;
window.buildLabStandard10Data = buildLabStandard10Data;
