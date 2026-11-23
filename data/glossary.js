// Bách Khoa Toàn Thư Giải Thích Chi Tiết Toàn Bộ Thuật Ngữ & Kiến Thức Mở Rộng Từng Học Phần (Modules 1 - 17)
// Dành cho người mới học từ con số 0 đến luyện thi chứng chỉ quốc tế CCNA 200-301

const MODULE_DEEP_GLOSSARY = {
  1: [
    {
      term: "Host / End Device (Thiết bị đầu cuối)",
      simple_vi: "Là mọi thiết bị mà con người sử dụng trực tiếp hoặc là nơi tạo ra / nhận dữ liệu cuối cùng trên mạng (Máy tính PC, Laptop, Điện thoại thông minh, Máy chủ Server, Máy in mạng, Camera IP, Điện thoại bàn VoIP).",
      detail_vi: "Trong thuật ngữ CCNA, mỗi Thiết bị đầu cuối có kết nối IP được gọi là một **Host**. Để giao tiếp trên mạng, mỗi Host bắt buộc phải có: 1) Một **Card mạng (NIC)**; 2) Một **Địa chỉ vật lý MAC (48-bit)** gắn cứng trên card mạng để đi trong nội bộ phòng; và 3) Một **Địa chỉ logic IP (IPv4 32-bit hoặc IPv6 128-bit)** để định danh trên toàn mạng. Host đóng vai trò là **Client** (người đi xin dịch vụ, như trình duyệt Chrome) hoặc **Server** (máy chủ cung cấp dịch vụ Web, Email, File) hoặc kiêm cả hai (trong mạng ngang hàng Peer-to-Peer).",
      example_vi: "Khi bạn dùng điện thoại mở ứng dụng YouTube: Điện thoại của bạn là End Device (Client), còn máy chủ chứa kho video của Google ở Singapore cũng là một End Device (Server)."
    },
    {
      term: "Intermediary Device (Thiết bị mạng trung gian)",
      simple_vi: "Là các 'hộp thiết bị kỹ thuật' nằm trong tủ mạng có nhiệm vụ nối các máy tính lại với nhau và dẫn đường cho gói tin đi từ nơi gửi tới đúng nơi nhận.",
      detail_vi: "Thiết bị trung gian KHÔNG tự sinh ra dữ liệu người dùng mà làm 4 nhiệm vụ cốt lõi: 1) Tái tạo và khuếch đại lại tín hiệu điện/quang bị yếu đi trên dây cáp; 2) Lưu giữ thông tin về các con đường tồn tại trong mạng (bảng MAC trên Switch, bảng Định tuyến trên Router); 3) Chuyển tiếp dữ liệu theo địa chỉ đích và báo lỗi khi đường cáp bị đứt; 4) Phân loại mức độ ưu tiên (QoS) và lọc chặn gói tin nguy hiểm (Firewall/ACL). Bốn thiết bị trung gian quan trọng nhất trong CCNA là: **Switch (Bộ chuyển mạch LAN Tầng 2)**, **Router (Bộ định tuyến liên mạng Tầng 3)**, **Wireless Access Point (Bộ phát sóng Wi-Fi)** và **Firewall (Tường lửa bảo mật)**.",
      example_vi: "Trong đề thi CCNA hay có câu hỏi phân loại: Máy in mạng (Network Printer) và Máy chủ (Server) là Thiết bị đầu cuối (End Devices), còn Switch và Router là Thiết bị trung gian (Intermediary Devices)."
    },
    {
      term: "Network Media (Phương tiện truyền dẫn vật lý)",
      simple_vi: "Là 'con đường' vật chất mang tín hiệu dữ liệu đi từ thiết bị này sang thiết bị khác: Dây cáp đồng, Dây cáp quang và Sóng vô tuyến không dây.",
      detail_vi: "Có đúng 3 loại môi trường truyền dẫn trong mạng máy tính: 1) **Cáp đồng (Copper - UTP, STP, Coaxial)**: Mã hóa bit `0` và `1` thành các **xung điện áp (Electrical pulses)** chạy trên sợi đồng, giá rẻ nhưng chỉ truyền tối đa 100 mét và dễ bị nhiễu điện từ; 2) **Cáp quang (Fiber-Optic)**: Mã hóa dữ liệu thành các **xung ánh sáng (Pulses of light - tia Laser hoặc đèn LED)** chạy trong sợi thủy tinh, truyền xa hàng chục kilomet, tốc độ siêu cao và chống sét/chống nhiễu điện từ 100%; 3) **Không dây (Wireless)**: Mã hóa dữ liệu thành **sóng điện từ (Electromagnetic waves / Radio Frequency - RF)** truyền qua không gian tự do.",
      example_vi: "Từ bàn làm việc của bạn tới tủ mạng trong phòng dùng Cáp đồng UTP; còn từ tòa nhà công ty bạn nối ra nhà mạng Viettel/VNPT dùng Cáp quang."
    },
    {
      term: "LAN vs. WAN vs. MAN vs. WLAN vs. SAN (Phân loại quy mô mạng)",
      simple_vi: "Cách gọi tên mạng dựa theo diện tích địa lý và quyền sở hữu: LAN là mạng trong 1 nhà/tòa nhà, WAN là mạng nối xuyên thành phố/quốc gia.",
      detail_vi: "• **LAN (Local Area Network - Mạng cục bộ)**: Phạm vi nhỏ (1 căn phòng, 1 tòa nhà văn phòng, 1 khuôn viên trường học), thuộc quyền quản lý của **1 cá nhân hoặc 1 tổ chức duy nhất**, tốc độ truyền rất cao (100 Mbps – 10 Gbps). • **WAN (Wide Area Network - Mạng diện rộng)**: Nối các mạng LAN ở cách xa nhau hàng trăm/ngàn kilomet thông qua đường truyền thuê của các **Nhà cung cấp dịch vụ viễn thông (TSP/ISP)**. • **WLAN (Wireless LAN)**: Mạng LAN dùng sóng Wi-Fi thay vì dây cáp. • **MAN (Metropolitan Area Network)**: Mạng đô thị phủ sóng một thành phố. • **SAN (Storage Area Network)**: Mạng chuyên dụng tốc độ cực cao trong trung tâm dữ liệu chỉ dùng để nối các máy chủ với hệ thống ổ cứng lưu trữ khổng lồ.",
      example_vi: "Internet chính là một 'Mạng của các mạng' (Network of Networks) kết nối hàng triệu mạng LAN và WAN trên toàn cầu lại với nhau."
    },
    {
      term: "Intranet vs. Extranet vs. Internet (Mạng nội bộ, Mạng đối tác & Mạng công cộng)",
      simple_vi: "Ba mức độ cho phép ai được quyền truy cập vào hệ thống mạng của một công ty.",
      detail_vi: "• **Intranet (Mạng nội bộ kín)**: Chỉ dành riêng cho **nhân viên chính thức bên trong công ty** truy cập (ví dụ: cổng thông tin nhân sự, bảng lương nội bộ). • **Extranet (Mạng mở rộng cho đối tác)**: Vẫn là mạng riêng của công ty nhưng cấp quyền cho **nhà cung cấp, đối tác hoặc khách hàng đã đăng ký** truy cập vào một phần dữ liệu (ví dụ: hệ thống bệnh viện cho phép các nhà thuốc đối tác tra cứu tồn kho thuốc). • **Internet**: Mạng toàn cầu công cộng mà bất kỳ ai trên thế giới cũng có thể truy cập.",
      example_vi: "Mẹo nhớ thi CCNA: Chỉ nhân viên công ty = **Intranet**; Có thêm đối tác/khách hàng/nhà cung cấp bên ngoài = **Extranet**; Mọi người trên thế giới = **Internet**."
    },
    {
      term: "Converged Network (Mạng hội tụ)",
      simple_vi: "Là mạng hiện đại gộp chung cả 3 luồng: Dữ liệu máy tính (Data) + Điện thoại giọng nói (Voice) + Truyền hình ảnh (Video) chạy trên cùng một sợi dây cáp mạng duy nhất.",
      detail_vi: "Trước đây, một tòa nhà phải kéo 3 hệ thống dây riêng biệt: dây đồng mạng cho máy tính, dây điện thoại bàn (RJ-11) cho tổng đài và dây cáp đồng trục cho tivi/camera. Ngày nay, **Mạng hội tụ (Converged Network)** số hóa cả giọng nói (VoIP) và hình ảnh (IP Camera/Video Conference) thành các gói tin IP để chạy chung trên một hạ tầng Switch/Router duy nhất — giúp tiết kiệm chi phí lắp đặt và quản lý tập trung.",
      example_vi: "Trên bàn làm việc công ty, sợi cáp mạng từ tường cắm vào Điện thoại IP Cisco, rồi từ mặt sau Điện thoại IP lại có 1 cổng nối tiếp sang máy tính PC!"
    },
    {
      term: "Fault Tolerance (Khả năng chịu lỗi) & Redundancy (Dự phòng)",
      simple_vi: "Thiết kế mạng có nhiều đường dây và nhiều thiết bị dự phòng để nếu đứt 1 sợi cáp hoặc cháy 1 Router thì mạng vẫn tự động chạy tiếp qua đường phụ mà không bị sập.",
      detail_vi: "Để đạt được **Fault Tolerance**, kỹ sư triển khai **Redundancy (Dự phòng phần cứng & đường truyền)** kết hợp với mạng chuyển mạch gói (**Packet-Switched Network**): Khi một thông điệp được chia thành nhiều gói tin nhỏ, nếu nhánh cáp A bị đứt giữa chừng, các Router tự động tính toán lại bảng định tuyến và lái các gói tin tiếp theo đi vòng qua nhánh cáp B chỉ trong vài phần nghìn giây.",
      example_vi: "Các doanh nghiệp lớn luôn thuê 2 đường cáp quang Internet từ 2 nhà mạng khác nhau (ví dụ 1 đường Viettel + 1 đường VNPT) cắm vào 2 Router biên chạy giao thức dự phòng HSRP."
    },
    {
      term: "Scalability (Khả năng mở rộng) & QoS (Quality of Service - Chất lượng dịch vụ)",
      simple_vi: "Scalability là khả năng thêm hàng trăm nhân viên mới mà mạng không bị hỏng; QoS là cơ chế 'làn đường ưu tiên xe cứu thương' cho cuộc gọi thoại và video không bị giật lag.",
      detail_vi: "• **Scalability**: Mạng đạt tính mở rộng tốt nhờ tuân thủ các **tiêu chuẩn mở quốc tế (Open Standards)** và thiết kế phân cấp (Access - Distribution - Core). • **QoS (Quality of Service)**: Khi đường truyền bị nghẽn (ai đó đang tải file phim 50GB làm đầy băng thông), cơ chế QoS trên Router/Switch sẽ phân loại gói tin thành các hàng đợi (**Queues**): đẩy các gói tin nhạy cảm với độ trễ như **Giọng nói VoIP và Họp trực tuyến Video** đi trước ngay lập tức, còn các gói tin tải file hoặc xem web thì xếp hàng chờ thêm vài mili-giây.",
      example_vi: "Nếu đang gọi Zalo/Zoom mà tiếng bị méo, vỡ hình hoặc trễ 2 giây mới nghe thấy — đó là do mạng thiếu cấu hình ưu tiên QoS!"
    },
    {
      term: "CIA Triad (Tam giác bảo mật: Confidentiality - Integrity - Availability)",
      simple_vi: "Ba mục tiêu tối thượng của bảo mật thông tin: Không bị lộ (Bí mật), Không bị sửa đổi trộm (Toàn vẹn), và Luôn truy cập được khi cần (Sẵn sàng).",
      detail_vi: "• **Confidentiality (Tính Bí mật)**: Chỉ những người được cấp quyền mới đọc được dữ liệu — thực hiện bằng **Xác thực mật khẩu (AAA)** và **Mã hóa dữ liệu (Encryption như AES, SSH, IPsec VPN)**. • **Integrity (Tính Toàn vẹn)**: Đảm bảo dữ liệu từ lúc gửi đi đến lúc nhận về không bị kẻ gian chặn giữa đường sửa đổi — thực hiện bằng thuật toán **Hàm băm (Hashing như SHA-256, MD5)**. • **Availability (Tính Sẵn sàng)**: Đảm bảo người dùng hợp lệ luôn truy cập được dịch vụ 24/7 — thực hiện bằng **Tường lửa chống DDoS, thiết bị dự phòng và bộ lưu điện UPS**.",
      example_vi: "Đề thi CCNA rất hay hỏi tình huống: 'Kẻ tấn công chặn gói tin chuyển tiền và sửa số tài khoản nhận' là vi phạm yếu tố nào? -> Đáp án: **Integrity (Tính toàn vẹn)**!"
    },
    {
      term: "BYOD, Cloud Computing (Public/Private/Hybrid) & DSL/Cable/Fiber/Cellular",
      simple_vi: "Các xu hướng mạng hiện đại và các công nghệ kết nối Internet băng thông rộng tại gia đình & doanh nghiệp.",
      detail_vi: "• **BYOD (Bring Your Own Device)**: Cho phép nhân viên/sinh viên mang laptop, điện thoại cá nhân vào kết nối mạng công ty. • **Cloud Computing (Điện toán đám mây)**: Gồm *Public Cloud* (dùng chung hạ tầng công cộng như AWS, Google Drive), *Private Cloud* (đám mây riêng cho 1 tổ chức/chính phủ), *Hybrid Cloud* (kết hợp cả hai). • **Công nghệ kết nối ISP**: **DSL** (chạy trên dây điện thoại đồng cũ), **Cable** (chạy trên cáp truyền hình đồng trục), **FTTH Fiber** (cáp quang kéo tới tận nhà), **Cellular 4G/5G** (sóng di động), **Satellite** (vệ tinh cho vùng sâu vùng xa/tàu biển) và **Leased Line** (đường cáp quang thuê riêng tốc độ đối xứng cam kết 100% cho doanh nghiệp).",
      example_vi: "Công ty tài chính lưu dữ liệu mật của khách hàng trên máy chủ riêng tại trụ sở (Private Cloud) nhưng dùng thêm máy chủ công cộng AWS khi có đợt khuyến mãi đông khách — mô hình đó gọi là **Hybrid Cloud**."
    },
    {
      term: "HPE Aruba Switch Web GUI & Cloud Management (Aruba Instant On / ArubaOS-CX)",
      simple_vi: "Dòng Switch doanh nghiệp thế hệ mới quản lý bằng giao diện Web trực quan và ứng dụng điện thoại Cloud thay vì dòng lệnh CLI gõ tay.",
      detail_vi: "Trong thực tế văn phòng, khách sạn, chuỗi cửa hàng, Switch HPE Aruba (như Instant On 1930/1960 hoặc dòng doanh nghiệp CX 6000/6100) rất phổ biến. Kỹ sư chỉ cần mở trình duyệt web `https://<IP-Switch>` để xem sơ đồ 24/48 cổng trực quan: cổng màu xanh là đang cắm dây, cổng có biểu tượng tia sét kèm số Watt là đang cấp nguồn PoE. Cấu hình chia VLAN bằng ma trận kéo thả: cổng cắm PC chọn **`Untagged (U)`**, cổng nối Trunk chọn **`Tagged (T)`**. Hỗ trợ quản lý tập trung từ xa qua **Aruba Central Cloud** hoặc app di động mà không cần mở port NAT Router.",
      example_vi: "Khi nhận Switch HPE Aruba mới khui hộp, kỹ sư cắm dây mạng, xem IP nó nhận qua DHCP hoặc IP mặc định `192.168.1.1`, vào Web GUI đặt IP tĩnh `192.168.1.250` và bật Spanning Tree chỉ bằng 3 cú nhấp chuột."
    },
    {
      term: "Embedded Web Server (EWS) & Màn Hình Cảm Ứng Máy In Đa Năng (MFP)",
      simple_vi: "Mỗi máy in mạng hiện đại là một Web Server độc lập và có màn hình cảm ứng LCD hiển thị địa chỉ IP, trạng thái mực in.",
      detail_vi: "Các máy in/photocopy đa năng (HP LaserJet, Canon imageRUNNER, Ricoh, Fuji Xerox) đều có: 1) Màn hình LCD cảm ứng cho phép xem và đặt IP tĩnh (`TCP/IP Configuration -> Static IP`), xem % mực in từng màu; 2) **Embedded Web Server (EWS)**: Kỹ sư gõ `https://[IP-Máy-In]` trên trình duyệt web để vào trang quản trị: xem hàng đợi in (print queue), cấu hình sổ địa chỉ người dùng (Address Book), tích hợp Active Directory/LDAP để xác thực người dùng nhả bản in an toàn bằng mã PIN hoặc thẻ từ (Pull Printing / Follow-Me Printing), và khóa quyền in màu để tiết kiệm chi phí.",
      example_vi: "Nhân viên bấm in tài liệu mật tại bàn nhưng máy in chưa chạy; khi nhân viên bước tới quẹt thẻ nhân viên trên đầu đọc máy in thì máy mới nhả bản in ra — đó là bảo mật Pull Printing qua EWS."
    },
    {
      term: "Standard TCP/IP Port (Port 9100 RAW) vs. WSD Port Trên Máy In Windows",
      simple_vi: "Cổng giao thức in mạng chuẩn giúp máy in không bao giờ bị báo lỗi 'Offline' ảo trên máy tính nhân viên.",
      detail_vi: "Khi cài đặt máy in mạng trên Windows, hệ điều hành hay tự động dò tìm qua giao thức **WSD (Web Services for Devices)**. Điểm yếu chết người của cổng WSD là khi máy in đi vào chế độ ngủ đông tiết kiệm điện (Deep Sleep), Windows sẽ tưởng máy in bị rút dây và báo **Offline** vĩnh viễn! Quy tắc sống còn của kỹ sư IT: Luôn cài máy in thủ công bằng **`Standard TCP/IP Port`** sử dụng số hiệu **`RAW Port 9100`** (hoặc giao thức **`IPP Port 631`** / **`LPR Port 515`**). Nhờ vậy, máy tính gửi lệnh in trực tiếp đến socket TCP 9100 của máy in mà không bao giờ bị mất kết nối.",
      example_vi: "Xử lý máy in báo Offline trong văn phòng: Vào Printer Properties -> tab Ports -> Add Port -> Standard TCP/IP Port -> nhập IP tĩnh của máy in (VD: `192.168.1.200`) -> Chọn RAW Port 9100 là máy in hoạt động lại ngay lập tức!"
    },
    {
      term: "Network Document Scanner & Scan to SMB Folder / Scan to Email",
      simple_vi: "Máy scan tài liệu mạng chuyên dụng tự động đẩy file số hóa về thư mục chia sẻ máy tính nhân viên hoặc gửi vào hộp thư.",
      detail_vi: "Máy scan mạng văn phòng (hoặc bộ scan ADF trên máy photocopy) kết nối Switch qua cáp RJ-45/Wi-Fi: • **Scan to Folder (SMBv2/v3 — TCP Port `445`)**: Nhân viên đặt tài liệu lên khay, bấm nút chọn tên mình trên màn hình; máy scan tự động quét 2 mặt, nén thành file PDF/OCR và ghi thẳng vào thư mục chia sẻ `\\\\IP-May-Tinh\\Scan` qua mạng LAN; • **Scan to Email (SMTP TLS — Port `587` / `465`)**: Máy scan tự động gửi email đính kèm file vừa quét vào hòm thư nhân viên qua máy chủ mail Microsoft 365/Google Workspace. Kỹ sư lưu ý luôn điền địa chỉ **IP** của máy tính đích thay vì *Tên máy (Hostname)* trong Address Book để tránh lỗi phân giải NetBIOS.",
      example_vi: "Kế toán quét tập hóa đơn 50 trang: Bấm 1 nút 'Scan Chi Lan' trên máy photocopy Ricoh, 10 giây sau file PDF đã nằm sẵn trong thư mục máy tính của chị Lan."
    },
    {
      term: "Thermal POS Receipt Printer (Máy In Hóa Đơn / In Bill Nhiệt Quầy Thu Ngân)",
      simple_vi: "Máy in bill nhiệt kết nối mạng LAN qua cổng TCP 9100, chuyên dùng trong nhà hàng, quán cafe, siêu thị và chuỗi bán lẻ.",
      detail_vi: "Máy in bill nhiệt (Epson TM-T82, Xprinter, Citizen) dùng đầu nhiệt đốt cháy lớp hóa chất trên giấy in nhiệt K80/K57 (không cần mực in). Thiết bị kết nối Switch bằng cáp mạng RJ-45, nhận lệnh in từ phần mềm POS (KiotViet, Sapo, iPOS) qua cổng **`RAW TCP Port 9100`** bằng ngôn ngữ tập lệnh **`ESC/POS`**. • **Mẹo tìm IP máy in bill**: Tắt nguồn máy in, dùng 1 ngón tay nhấn đè nút **`FEED`**, tay kia bật công tắc nguồn lên và giữ 3 giây rồi thả ra: máy in sẽ tự động nhả ra một phiếu tự kiểm tra (**`Self-Test Page`**) in rõ địa chỉ IP hiện tại! • Tích hợp cổng cắm cáp **RJ-11 Cash Drawer** cấp xung điện 24V giật mở két đựng tiền thu ngân tự động mỗi khi in bill thành công.",
      example_vi: "Tại quán cafe: Khách gọi món trên iPad tại bàn, lệnh in gửi qua mạng LAN tới máy in bill bếp ở tầng trệt (IP `192.168.1.210:9100`) và máy in bar ở tầng 1 (IP `192.168.1.211:9100`) tự động nhả giấy order để nhân viên pha chế."
    },
    {
      term: "VoIP Phone Dual-Port PC Passthrough & Voice VLAN (Cổng Kép Nối Tiếp Máy Tính)",
      simple_vi: "Thiết kế thông minh trên điện thoại bàn IP Phone: cắm 1 sợi dây mạng từ Switch vào điện thoại, rồi nối tiếp 1 sợi dây từ điện thoại ra PC.",
      detail_vi: "Dưới đế mỗi điện thoại bàn IP Phone (Cisco, Yealink, Grandstream, Fanvil) luôn có **2 cổng mạng RJ-45**: • Cổng **`SW / LAN (PoE)`**: Cắm dây từ Switch PoE vào để vừa lấy nguồn điện nuôi điện thoại (chuẩn 802.3af), vừa nhận luồng âm thanh thoại được gắn thẻ **Voice VLAN (VLAN 150, ưu tiên QoS CoS 5 / DSCP EF=46)**; • Cổng **`PC`**: Dùng dây nhảy cắm sang máy tính để bàn của nhân viên ngồi cạnh đó. Bên trong điện thoại có 1 chip mini-switch 3 cổng chuyển tiếp lưu lượng dữ liệu máy tính ở dạng **Untagged Data VLAN (VLAN 10)**. Giải pháp này giúp công ty tiết kiệm 50% số cổng Switch và không phải tốn tiền đục tường kéo thêm 1 đường cáp mạng thứ hai cho bàn làm việc!",
      example_vi: "Một văn phòng 100 nhân viên chỉ cần mua Switch 24 cổng có PoE để cắm cho 24 cụm bàn gồm 24 điện thoại bàn và 24 PC hoạt động song song mượt mà."
    },
    {
      term: "Remote Desktop & RMM (Quản Trị Máy Tính Nhân Viên Từ Xa - RDP, RustDesk, NinjaOne)",
      simple_vi: "Bộ công cụ giúp kỹ sư IT ngồi tại chỗ điều khiển màn hình, cài phần mềm và khắc phục sự cố máy tính nhân viên từ xa.",
      detail_vi: "Kỹ sư IT doanh nghiệp sử dụng các công nghệ quản trị từ xa: • **1) Microsoft Remote Desktop (RDP TCP Port 3389)**: Giao thức truyền màn hình mượt mà native của Windows; trong doanh nghiệp bắt buộc chỉ mở qua đường hầm **VPN nội bộ** hoặc **RD Gateway** có MFA; • **2) Remote Support (RustDesk, AnyDesk, TeamViewer)**: Kết nối xuyên qua mọi tầng NAT/Firewall; **RustDesk** cho phép doanh nghiệp tự dựng Server Relay nội bộ (Self-hosted) để bảo mật tuyệt đối dữ liệu; • **3) Nền tảng Quản trị Điểm cuối RMM (Remote Monitoring & Management như NinjaOne, Action1, ManageEngine)**: Cài Agent ngầm trên PC nhân viên để theo dõi nhiệt độ phần cứng, tự vá lỗi Windows Patch, chạy script PowerShell ngầm (**Background Tools**) và cài phần mềm âm thầm mà không làm chiếm chuột hay gián đoạn nhân viên đang làm việc.",
      example_vi: "Nhân viên đang gõ văn bản Word, IT ngồi từ xa chạy lệnh PowerShell ngầm gỡ bỏ phần mềm rác và cập nhật driver máy in mà màn hình nhân viên không hề bị nháy hay chiếm quyền điều khiển!"
    },
    {
      term: "Wake-on-LAN (WoL) & Magic Packet (Đánh Thức Máy Tính Từ Xa Qua Mạng)",
      simple_vi: "Khả năng gửi một gói tin đặc biệt qua dây mạng để tự động bật nguồn một chiếc máy tính đang tắt ngúm.",
      detail_vi: "Khi máy tính bấm Shutdown tắt nguồn, bo mạch chủ (Mainboard) và card mạng NIC vẫn được nuôi bằng dòng điện chờ 5V Standby. Kỹ sư bật tính năng **Wake-on-LAN (WoL)** trong BIOS và cài đặt Card mạng. Khi cần bật máy tính từ xa (ví dụ lúc 2 giờ sáng để backup dữ liệu hoặc quét virus), kỹ sư từ Router/máy chủ gửi một gói tin gọi là **`Magic Packet`** qua cổng **`UDP Port 7 hoặc Port 9`**: Gói tin này chứa 6 byte giá trị `0xFF` theo sau là chuỗi **Địa chỉ MAC của card mạng máy đích được lặp lại đúng 16 lần**. Khi card mạng nhận ra địa chỉ MAC của mình trong Magic Packet, nó lập tức kích hoạt tín hiệu gửi tới bộ nguồn để bật máy tính sáng đèn chạy bình thường.",
      example_vi: "Lúc 23:00 đêm cả công ty đã về, phần mềm RMM gửi Magic Packet đánh thức toàn bộ 200 máy tính dậy, tự động cài bản cập nhật Windows Updates và vá bảo mật, sau đó tự Shutdown lại trước 6:00 sáng hôm sau."
    },
    {
      term: "Multi-WAN Load Balancing Router (Router Cân Bằng Tải Gộp Nhiều Đường Truyền)",
      simple_vi: "Router chuyên dụng hỗ trợ cắm 2-4 đường mạng cáp quang của nhiều nhà mạng khác nhau để gộp băng thông và chống mất mạng.",
      detail_vi: "Khác với Router Cisco thuần CLI, các doanh nghiệp vừa và nhỏ (SMB) tại Việt Nam chuộng dùng Router cân bằng tải quản trị Web GUI như **DrayTek Vigor 2927/3910**, **MikroTik RouterOS (Winbox/WebFig)**, **pfSense / OPNsense**: • Cắm đồng thời 2-4 đường mạng cáp quang ISP (VD: `WAN1 = Viettel 500Mbps`, `WAN2 = VNPT 500Mbps`) cấu hình quay số PPPoE nhận IP Public thật; • Chế độ **Cân bằng tải (Load Balancing Session-based)** gộp tổng băng thông công ty lên 1000Mbps; • Chế độ **Dự phòng chuyển đổi (Failover Backup)**: Nếu đường Viettel bị đứt cáp, 100% người dùng tự động nhảy sang đường VNPT trong 1 giây không ai bị rớt mạng; • Tích hợp máy chủ **SSL VPN / WireGuard Server** cho nhân viên làm việc từ xa kết nối an toàn về văn phòng.",
      example_vi: "Một văn phòng công ty thương mại điện tử thuê 1 đường mạng Viettel và 1 đường FPT. Khi bão đứt dây cáp ngoài đường làm mất mạng Viettel, nhân viên vẫn livestream bán hàng bình thường nhờ Router tự chuyển sang FPT."
    },
    {
      term: "PoE IP Camera & ONVIF / RTSP Protocol (Camera An Ninh Cấp Nguồn Qua Dây Mạng)",
      simple_vi: "Camera giám sát lấy nguồn điện trực tiếp từ dây cáp mạng Switch và truyền hình ảnh độ nét cao về đầu ghi NVR.",
      detail_vi: "Camera an ninh hiện đại (Hikvision, Dahua, Axis, UniFi Protect) sử dụng công nghệ **PoE (Power over Ethernet - chuẩn 802.3af 15.4W hoặc 802.3at 30W)**: Kéo duy nhất 1 sợi cáp mạng Cat6 từ Switch PoE lên trần nhà là camera vừa có điện vừa truyền dữ liệu. • Luồng video truyền về đầu ghi **NVR** qua giao thức thời gian thực **`RTSP` (Real-Time Streaming Protocol — TCP/UDP Port `554`)** và chuẩn tương thích mở quốc tế **`ONVIF`** (cho phép cắm camera hãng này vào đầu ghi hãng khác). • **Nguyên tắc vàng của kỹ sư mạng**: Luôn tạo riêng 1 **`VLAN Camera`** độc lập và chặn không cho truy cập ra ngoài Internet tùy tiện để chống rò rỉ video riêng tư và chống nghẽn băng thông mạng nội bộ.",
      example_vi: "Tòa nhà 5 tầng lắp 32 camera: kỹ sư chọn Switch 48 cổng có PoE Budget 370W, đặt các camera vào VLAN 30 dải `192.168.30.x` và cắm đầu ghi NVR thu hình 24/7."
    },
    {
      term: "Network UPS & Management Card NMC (Bộ Lưu Điện Có Card Mạng SNMP / Web)",
      simple_vi: "Bộ lưu điện phòng máy chủ có gắn card mạng để quản trị qua Web và tự động tắt an toàn hệ thống máy chủ khi cúp điện.",
      detail_vi: "Trong tủ mạng Server Rack, các bộ lưu điện cao cấp (APC Smart-UPS, Vertiv) được gắn thêm một chiếc card mạng gọi là **NMC (Network Management Card)** có cổng RJ-45 và địa chỉ IP tĩnh riêng. Kỹ sư có thể truy cập Web GUI (`https://<IP-UPS>`) để theo dõi tình trạng bình ắc quy, nhiệt độ tủ rack, và nhận cảnh báo qua giao thức **SNMP Trap (UDP Port 162)**. Khi điện lưới bị cắt quá 15 phút và ắc quy sắp cạn, NMC gửi lệnh điều khiển mạng (**PowerChute Network Shutdown**) yêu cầu toàn bộ máy chủ ảo hóa VMware ESXi / Hyper-V tự động lưu dữ liệu và tắt nguồn an toàn trước khi cúp điện hoàn toàn, ngăn chặn triệt để nguy cơ hỏng cơ cấu ổ cứng và mất cơ sở dữ liệu.",
      example_vi: "Lúc nửa đêm tòa nhà bị nổ trạm biến áp, bộ lưu điện UPS kích hoạt chế độ pin, gửi email cảnh báo cho IT, sau 10 phút tự động gửi tín hiệu tắt an toàn 5 máy chủ Server không mất 1 dòng dữ liệu nào."
    }
  ],

  2: [
    {
      term: "IOS (Internetwork Operating System) & Kernel / Shell / CLI / GUI",
      simple_vi: "Cisco IOS là hệ điều hành điều khiển các thiết bị Switch và Router của Cisco (giống như Windows trên máy tính hay Android trên điện thoại).",
      detail_vi: "Cấu trúc của mọi hệ điều hành mạng gồm 3 lớp đồng tâm: 1) **Hardware (Phần cứng)**: Bo mạch, chip ASIC, các cổng cắm cáp; 2) **Kernel (Nhân hệ điều hành)**: Phần lõi giao tiếp trực tiếp với phần cứng và phân bổ tài nguyên CPU/RAM; 3) **Shell (Lớp vỏ giao tiếp người dùng)**: Cho phép con người ra lệnh cho máy thông qua giao diện đồ họa (**GUI** - bấm chuột) hoặc giao diện dòng lệnh (**CLI - Command-Line Interface** - gõ lệnh bằng bàn phím). Kỹ sư mạng chuyên nghiệp luôn dùng **CLI** vì tốn ít tài nguyên, chính xác tuyệt đối và dễ viết kịch bản tự động hóa.",
      example_vi: "File hệ điều hành Cisco IOS có đuôi `.bin` (ví dụ `c2960-lanbasek9-mz.150-2.SE4.bin`) được lưu trữ trong bộ nhớ **Flash** của thiết bị."
    },
    {
      term: "Out-of-Band Management (Console) vs. In-Band Management (SSH / Telnet)",
      simple_vi: "Out-of-Band là cầm dây cáp Console tới cắm trực tiếp vào đít máy; In-Band là ngồi từ xa đăng nhập qua mạng LAN/Internet bằng địa chỉ IP.",
      detail_vi: "• **Out-of-Band (Quản trị ngoài băng tần - Cổng Console / AUX)**: Dùng đường cáp vật lý chuyên dụng (cáp Rollover RJ-45 hoặc USB mini-B) nối trực tiếp từ Laptop vào thiết bị. **Ưu điểm tuyệt đối**: Hoạt động ngay cả khi thiết bị mới khui hộp chưa có địa chỉ IP hoặc khi toàn bộ mạng LAN đang bị sập! • **In-Band (Quản trị trong băng tần - SSH, Telnet, HTTPS)**: Truyền lệnh điều khiển đi chung trên chính đường dây cáp mạng dữ liệu bình thường. Yêu cầu bắt buộc thiết bị phải có ít nhất 1 cổng đã được đặt địa chỉ IP và mạng phải đang thông.",
      example_vi: "Khi gõ nhầm lệnh làm mất kết nối mạng từ xa (In-Band SSH bị văng ra), cách duy nhất để cứu thiết bị là xách laptop và dây Console vào phòng Server (Out-of-Band)."
    },
    {
      term: "User EXEC Mode (`>`) vs. Privileged EXEC Mode (`#`) vs. Global Config Mode (`(config)#`)",
      simple_vi: "Ba cấp độ cửa bảo vệ từ ngoài vào trong khi gõ lệnh trên thiết bị Cisco.",
      detail_vi: "• **1. User EXEC Mode (`Switch>` hoặc `Router>`)**: Chế độ hạn chế nhất khi vừa cắm dây vào — chỉ cho phép gõ vài lệnh kiểm tra cơ bản như `ping`, `show version`, không xem được cấu hình mật và không sửa được bất kỳ cài đặt nào. • **2. Privileged EXEC Mode (`Switch#` hoặc `Router#`)**: Từ `>` gõ lệnh **`enable`** để bước vào. Đây là quyền Quản trị viên tối cao để xem toàn bộ cấu hình (`show running-config`), chẩn đoán lỗi (`debug`), khởi động lại (`reload`) và lưu file (`copy`). • **3. Global Configuration Mode (`Switch(config)#`)**: Từ `#` gõ lệnh **`configure terminal`** để bước vào. Mọi lệnh gõ ở đây ảnh hưởng tới toàn bộ thiết bị, và từ đây mới rẽ nhánh vào các chế độ con (**Subconfiguration Modes**) như `(config-if)#` (cấu hình cổng mạng) hay `(config-line)#` (cấu hình cổng Console/VTY).",
      example_vi: "Để nhảy một phát từ bất kỳ chế độ con sâu nào (`Switch(config-if)#`) quay thẳng về chế độ Đặc quyền `Switch#`, bạn chỉ cần gõ lệnh **`end`** hoặc bấm tổ hợp phím **`Ctrl + Z`**!"
    },
    {
      term: "RAM (`running-config`) vs. NVRAM (`startup-config`) vs. Flash vs. ROM",
      simple_vi: "Bốn loại chip bộ nhớ bên trong một chiếc Switch hoặc Router Cisco và nhiệm vụ của từng loại.",
      detail_vi: "• **RAM (Bộ nhớ khả biến - Mất sạch khi tắt điện)**: Chứa file cấu hình đang chạy tức thời (**`running-config`**), bảng định tuyến, bảng ARP và bộ đệm gói tin. Gõ lệnh xong là masuk vào RAM có hiệu lực ngay, nhưng rút điện ra là bay màu! • **NVRAM (Non-Volatile RAM - Bộ nhớ không mất dữ liệu khi tắt điện)**: Chứa file cấu hình khởi động (**`startup-config`**). Muốn giữ cấu hình vĩnh viễn phải chép từ RAM sang NVRAM bằng lệnh `copy running-config startup-config`. • **Flash (Bộ nhớ thẻ nhớ không mất dữ liệu)**: Chứa file hệ điều hành **Cisco IOS image (`.bin`)** và file cơ sở dữ liệu VLAN (`vlan.dat`). • **ROM (Bộ nhớ chỉ đọc gắn trên bo mạch)**: Chứa chương trình tự kiểm tra phần cứng **POST**, trình nạp khởi động **Bootstrap** và hệ điều hành cứu hộ tối giản **ROMMON**.",
      example_vi: "Nếu bạn lỡ tay cấu hình sai làm đơ mạng nhưng **chưa gõ lệnh lưu `copy run start`**, bạn chỉ cần khởi động lại máy (`reload`) là máy sẽ đọc lại file `startup-config` sạch sẽ từ NVRAM!"
    },
    {
      term: "`enable password` (Chữ rõ) vs. `enable secret` (Băm MD5) & `service password-encryption`",
      simple_vi: "Ba câu lệnh bảo vệ mật khẩu trên thiết bị Cisco và mức độ an toàn của chúng.",
      detail_vi: "• **`enable password <mật-khẩu>`**: Câu lệnh thế hệ cũ lưu mật khẩu bảo vệ chế độ `#` dưới dạng chữ rõ hoàn toàn trong file cấu hình (ai nhìn qua vai màn hình là đọc được ngay). • **`enable secret <mật-khẩu>`**: Câu lệnh chuẩn hiện đại sử dụng thuật toán băm một chiều **MD5 (Type 5)** hoặc **SCRYPT (Type 9)** biến mật khẩu thành chuỗi ký tự ngẫu nhiên không thể giải mã ngược. Nếu cấu hình cả hai câu lệnh cùng lúc, thiết bị sẽ **chỉ dùng `enable secret`**! • **`service password-encryption`**: Tự động mã hóa nhẹ (chuẩn Vigenère **Type 7**) cho tất cả các mật khẩu chữ rõ khác (như mật khẩu `line console`, `line vty`) để người ngoài nhìn vào `show running-config` không đọc được bằng mắt thường.",
      example_vi: "Trong `show running-config`, nếu thấy `enable secret 5 $1$mERr$hx5r...` thì số `5` nghĩa là đã băm MD5 an toàn; còn nếu thấy `password 7 0822455D0A16` thì số `7` là mã hóa bởi `service password-encryption`."
    },
    {
      term: "SVI (Switch Virtual Interface - `interface vlan 1`) & `ip default-gateway`",
      simple_vi: "Tại sao chiếc Switch Layer 2 chỉ làm việc với địa chỉ MAC mà vẫn cần được gán một địa chỉ IP?",
      detail_vi: "Một chiếc Switch Layer 2 mới khui hộp vẫn chuyển tiếp dữ liệu giữa các máy tính trong phòng bình thường mà **không cần bất kỳ địa chỉ IP nào**. Tuy nhiên, nếu kỹ sư muốn ngồi từ bàn làm việc (hoặc từ chi nhánh khác) để `ping`, `SSH` hoặc `Telnet` vào chiếc Switch đó để cấu hình từ xa, thì bản thân chiếc Switch phải có một địa chỉ IP đóng vai trò như một Host! Vì các cổng sắt `Fa0/1..24` của Switch Layer 2 không cho phép đặt IP trực tiếp, ta phải đặt IP lên một **Cổng ảo bằng phần mềm gọi là SVI (`interface vlan 1`)**, gõ `no shutdown`, và khai báo thêm `ip default-gateway <IP-Router>` để Switch biết đường trả lời ra ngoài mạng khác.",
      example_vi: "Nhớ kỹ bẫy đề thi CCNA: Lệnh `ip default-gateway` trên Switch Layer 2 **chỉ phục vụ cho các gói tin quản trị của chính bản thân chiếc Switch đó (như SSH/Ping vào Switch)**, chứ không dùng để định tuyến gói tin cho các máy tính PC cắm vào Switch!"
    },
    {
      term: "Line Console 0 vs. Line VTY 0 15 & `logging synchronous` / `no ip domain-lookup`",
      simple_vi: "Các cổng giao tiếp quản trị và 2 câu lệnh chống phiền toái mà kỹ sư nào cũng gõ đầu tiên.",
      detail_vi: "• **`line console 0`**: Đại diện cho 1 cổng vật lý Console duy nhất ở vỏ máy. • **`line vty 0 15` (Virtual Teletype)**: Đại diện cho 16 phiên kết nối mạng ảo từ xa (từ đường số 0 đến đường số 15 trên Switch, hoặc `0 4` gồm 5 đường trên Router) phục vụ SSH/Telnet. • **`logging synchronous`**: Khi bạn đang gõ dở một câu lệnh dài trên CLI mà có ai đó rút cắm dây cáp, hệ thống sẽ bắn ra dòng thông báo `%LINK-3-UPDOWN` cắt đôi dòng chữ bạn đang gõ; lệnh này bắt hệ thống tự động xuống dòng mới trả lại nguyên vẹn câu lệnh đang gõ dở! • **`no ip domain-lookup`**: Khi bạn gõ sai chính tả một lệnh ở chế độ `#`, mặc định Cisco IOS tưởng bạn đang muốn kết nối tới một máy chủ có tên đó nên gửi Broadcast tìm DNS làm treo cứng bàn phím mất 30 giây; lệnh này tắt hẳn cơ chế đó.",
      example_vi: "Bộ 3 câu lệnh vàng luôn gõ trong `line console 0`: `password ...`, `login`, và `logging synchronous`."
    },
    {
      term: "Banner MOTD (`banner motd #...#`) — Thông điệp cảnh báo pháp lý",
      simple_vi: "Bảng thông báo hiện ra đầu tiên trên màn hình trước cả khi người dùng nhập mật khẩu đăng nhập.",
      detail_vi: "**MOTD** là viết tắt của *Message of the Day*. Cú pháp chuẩn sử dụng một **ký tự phân cách bất kỳ (Delimiter character)** như dấu `#` hoặc `$` bọc ở đầu và cuối thông điệp (ví dụ `banner motd #CAM TRUY CAP TRAI PHEP!#`). Về mặt pháp lý và an ninh mạng quốc tế, thông báo này tuyệt đối **KHÔNG được ghi câu chào mừng như 'Welcome to Router R1!'** (vì tòa án có thể coi đó là lời mời gọi hacker vào máy!), mà bắt buộc phải ghi rõ: *'Chỉ người được ủy quyền mới được phép truy cập, mọi hành vi đều bị giám sát và truy tố'*.",
      example_vi: "Bạn có thể viết thông báo nhiều dòng bằng cách gõ `banner motd #`, nhấn Enter gõ nhiều dòng trang trí đẹp mắt rồi gõ dấu `#` cuối cùng để kết thúc."
    },
    {
      term: "Cấu hình IP trên Máy trạm Windows (`ipconfig`, `ipconfig /all`, `ipconfig /release`, `/renew`)",
      simple_vi: "Các câu lệnh kiểm tra và làm mới địa chỉ IP trên máy tính cá nhân của người dùng cuối.",
      detail_vi: "Để một máy tính đầu cuối (PC) truy cập được cả mạng nội bộ lẫn Internet, cần cấu hình 4 thông số: 1) **IPv4 Address** (địa chỉ riêng của máy đó); 2) **Subnet Mask** (xác định máy đó thuộc mạng nào); 3) **Default Gateway** (địa chỉ IP của cổng Router nối với mạng LAN đó — thiếu thông số này thì vẫn chat được trong phòng nhưng mất hoàn toàn Internet!); 4) **DNS Server** (địa chỉ máy chủ dịch tên miền như `8.8.8.8`). Trên Windows, gõ `ipconfig` xem nhanh 3 thông số đầu; gõ `ipconfig /all` xem thêm địa chỉ MAC, DNS và DHCP Server.",
      example_vi: "Khi máy tính báo biểu tượng chấm than vàng không vào được mạng, mở `cmd` gõ `ipconfig /release` (trả lại IP cũ) rồi `ipconfig /renew` (xin cấp lại IP mới từ DHCP)."
    },
    {
      term: "Xóa trắng cấu hình Switch & Router về mặc định xuất xưởng (`erase startup-config` & `delete vlan.dat`)",
      simple_vi: "Cách 'Format' một chiếc Switch hoặc Router cũ về lại trạng thái mới tinh như lúc vừa mua từ nhà máy.",
      detail_vi: "Trên **Router**, toàn bộ cấu hình nằm gọn trong NVRAM nên chỉ cần gõ `erase startup-config` rồi `reload` là trắng tinh. Tuy nhiên trên **Switch Cisco**, danh sách các mạng ảo VLAN mà người trước đã tạo lại không nằm trong NVRAM mà được lưu thành một file riêng tên là **`vlan.dat` nằm trong bộ nhớ Flash**! Do đó, muốn xóa trắng hoàn toàn một chiếc Switch để làm bài Lab mới, bạn bắt buộc phải làm đủ **3 bước**: 1) `delete flash:vlan.dat`; 2) `erase startup-config`; 3) `reload` (không lưu cấu hình đang chạy khi máy hỏi).",
      example_vi: "Đi làm thực tế: Trước khi lấy một chiếc Switch cũ trong kho ra lắp vào mạng công ty, luôn phải `delete vlan.dat` để tránh thông tin VLAN cũ ghi đè làm sập mạng hiện tại!"
    }
  ],

  3: [
    {
      term: "Network Protocol (Giao thức mạng) & Protocol Suite (Bộ giao thức)",
      simple_vi: "Giao thức là 'Bộ quy tắc ngôn ngữ và luật lệ chung' mà 2 máy tính bắt buộc phải tuân theo để hiểu được nhau.",
      detail_vi: "Mọi quá trình giao tiếp (dù là giữa 2 con người hay giữa 2 máy tính) đều cần 3 yếu tố: **Nguồn gửi (Sender)**, **Đích nhận (Receiver)** và **Kênh truyền (Channel)**. Một giao thức mạng quy định chặt chẽ 6 yêu cầu: 1) **Message Encoding** (Mã hóa thông điệp thành bit và sóng); 2) **Message Formatting & Encapsulation** (Đóng khung và ghi nhãn địa chỉ Nguồn/Đích); 3) **Message Size** (Kích thước tối đa mỗi mảnh cắt là bao nhiêu Byte); 4) **Message Timing** (Tốc độ gửi *Flow Control*, thời gian chờ tối đa *Response Timeout* và luật xin đường *Access Method*); 5) **Delivery Options** (Gửi cho 1 người *Unicast*, 1 nhóm *Multicast* hay tất cả *Broadcast*).",
      example_vi: "Tập hợp nhiều giao thức phối hợp với nhau ở các tầng khác nhau (như HTTP + TCP + IP + Ethernet) được gọi là một **Bộ giao thức (Protocol Suite)**."
    },
    {
      term: "OSI Reference Model (Mô hình tham chiếu 7 tầng OSI) vs. TCP/IP Model (Mô hình 4 tầng TCP/IP)",
      simple_vi: "Hai bản thiết kế chia nhỏ quá trình truyền mạng phức tạp thành từng tầng riêng biệt để dễ chế tạo thiết bị và dễ bắt bệnh khi hỏng mạng.",
      detail_vi: "• **Mô hình OSI (Open Systems Interconnection - 7 tầng do ISO tạo ra)**: Là mô hình lý thuyết chi tiết nhất mà mọi kỹ sư mạng dùng để gọi tên tầng: **Tầng 1 Physical (Vật lý)** -> **Tầng 2 Data Link (Liên kết dữ liệu)** -> **Tầng 3 Network (Mạng)** -> **Tầng 4 Transport (Giao vận)** -> **Tầng 5 Session (Phiên)** -> **Tầng 6 Presentation (Trình diễn)** -> **Tầng 7 Application (Ứng dụng)**. *(Mẹo nhớ từ 1 lên 7: **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way)*. • **Mô hình TCP/IP (4 tầng thực tế của Internet)**: Gộp tầng 5+6+7 của OSI thành **Application**; giữ nguyên **Transport** và **Internet** (Network); gộp tầng 1+2 thành **Network Access**.",
      example_vi: "Khi kỹ sư mạng nói 'Lỗi ở Layer 1' nghĩa là đứt dây cáp; 'Lỗi ở Layer 2' là sai VLAN/MAC; 'Lỗi ở Layer 3' là sai IP/Routing!"
    },
    {
      term: "Data Encapsulation (Đóng gói dữ liệu) & De-encapsulation (Mở gói dữ liệu)",
      simple_vi: "Quá trình bọc thêm từng lớp phong bì và dán nhãn địa chỉ khi dữ liệu đi từ Tầng 7 xuống Tầng 1 ở máy gửi, và bóc từng lớp vỏ ra từ Tầng 1 lên Tầng 7 ở máy nhận.",
      detail_vi: "Khi bạn bấm gửi một tin nhắn ở Tầng 7: • Xuống **Tầng 4 (Transport)**, dữ liệu được cắt nhỏ và gắn thêm **TCP/UDP Header** (chứa Số hiệu Cổng Nguồn & Đích) -> tạo thành **Segment**. • Xuống **Tầng 3 (Network)**, toàn bộ Segment đó được bỏ vào trong và gắn thêm **IP Header** (chứa Địa chỉ IP Nguồn & Đích) -> tạo thành **Packet**. • Xuống **Tầng 2 (Data Link)**, toàn bộ Packet được gắn thêm **Frame Header** (chứa Địa chỉ MAC Đích & Nguồn) ở đầu và **FCS Trailer** ở đuôi -> tạo thành **Frame**. • Xuống **Tầng 1 (Physical)**, Frame được chuyển thành chuỗi **Bits (`0` và `1`)** truyền đi. Máy nhận sẽ làm ngược lại từ Tầng 1 bóc dần lên Tầng 7 (**De-encapsulation**).",
      example_vi: "Giống hệt như viết một lá thư (Data) -> bỏ vào phong bì nhỏ ghi tên phòng ban (Segment) -> bỏ vào phong bì lớn ghi địa chỉ nhà người nhận (Packet) -> xếp lên thùng xe tải (Frame) -> chạy trên đường quốc lộ (Bits)."
    },
    {
      term: "PDU (Protocol Data Unit - Tên gọi đơn vị dữ liệu ở từng tầng)",
      simple_vi: "Cách gọi tên chính xác của cục dữ liệu khi nó nằm ở từng tầng khác nhau trong mô hình OSI.",
      detail_vi: "Đây là câu hỏi **bắt buộc xuất hiện trong mọi đề thi CCNA**: Bạn phải thuộc lòng tên gọi PDU của 5 tầng dưới đây: • **Tầng 5, 6, 7**: Gọi là **Data (Dữ liệu)**; • **Tầng 4 (Transport)**: Gọi là **Segment (Phân đoạn)** nếu dùng giao thức TCP, hoặc **Datagram** nếu dùng giao thức UDP; • **Tầng 3 (Network)**: Gọi là **Packet (Gói tin)**; • **Tầng 2 (Data Link)**: Gọi là **Frame (Khung tin)**; • **Tầng 1 (Physical)**: Gọi là **Bits (Chuỗi bit nhị phân 0/1)**.",
      example_vi: "Mẹo nhớ thứ tự PDU từ Tầng 7 xuống Tầng 1: **D**ata -> **S**egment -> **P**acket -> **F**rame -> **B**its (**D**on't **S**ome **P**eople **F**ear **B**irthdays)."
    },
    {
      term: "Three-Layer Addressing (Bộ 3 địa chỉ: MAC Tầng 2 vs. IP Tầng 3 vs. Port Tầng 4)",
      simple_vi: "Tại sao một gói tin đi trên mạng lại cần tới 3 loại địa chỉ khác nhau cùng lúc?",
      detail_vi: "Mỗi lớp địa chỉ đảm nhận một sứ mệnh riêng biệt không thể thay thế: • **1. Địa chỉ Tầng 2 (MAC Address - 48 bit)**: Chỉ dùng để giao hàng **từ thiết bị này sang thiết bị kế tiếp trong cùng một mạng nội bộ (Hop-to-Hop / Same Network)** — thay đổi liên tục qua mỗi trạm Router. • **2. Địa chỉ Tầng 3 (IP Address - 32/128 bit)**: Dùng để dẫn đường gói tin đi **xuyên qua nhiều mạng từ máy khởi nguồn ban đầu đến tận máy đích cuối cùng (End-to-End)** — giữ nguyên không đổi trên suốt hành trình. • **3. Địa chỉ Tầng 4 (Port Number - 16 bit)**: Khi gói tin đã vào tới đúng chiếc máy tính đích rồi, số hiệu Port cho biết phải giao gói tin đó cho **phần mềm nào** đang mở trên máy (giao cho trình duyệt Web Port 443 hay giao cho phần mềm Email Port 110).",
      example_vi: "Trong khung tin Ethernet Frame, trường **Destination MAC** luôn đứng trước trường **Source MAC**; ngược lại trong gói tin IP Packet, trường **Source IP** lại đứng trước **Destination IP**!"
    },
    {
      term: "Unicast vs. Broadcast vs. Multicast (Ba phương thức phân phối thông điệp)",
      simple_vi: "Gửi riêng cho 1 người (Unicast), gửi loa phóng thanh cho tất cả mọi người (Broadcast), hay gửi cho 1 nhóm đăng ký trước (Multicast).",
      detail_vi: "• **Unicast (1-to-1)**: Một nguồn gửi tới một đích duy nhất. • **Broadcast (1-to-All)**: Một nguồn gửi tới tất cả các máy trong cùng mạng LAN (IPv4 dùng địa chỉ kết thúc bằng toàn bit 1 ở phần Host như `192.168.1.255` hoặc `255.255.255.255`; MAC đích luôn là `FF-FF-FF-FF-FF-FF`). Lưu ý: IPv6 đã loại bỏ hoàn toàn Broadcast! • **Multicast (1-to-Many)**: Một nguồn gửi tới một nhóm các máy quan tâm cùng lúc (IPv4 dùng dải Lớp D từ `224.0.0.0` đến `239.255.255.255`; IPv6 dùng dải `FF00::/8`).",
      example_vi: "Các giao thức định tuyến động như OSPF không dùng Broadcast làm phiền cả mạng mà dùng địa chỉ Multicast `224.0.0.5` để chỉ nói chuyện riêng với các Router OSPF khác."
    },
    {
      term: "IEEE, IETF (RFC), ISO, IANA, ICANN & EIA/TIA (Các tổ chức tiêu chuẩn mạng quốc tế)",
      simple_vi: "Những tổ chức quốc tế ban hành luật lệ để thiết bị của Cisco, Intel, Apple, Samsung cắm vào nhau là chạy được ngay.",
      detail_vi: "• **IEEE (Institute of Electrical and Electronics Engineers)**: Quản lý các chuẩn Tầng 1 và Tầng 2 — nổi tiếng nhất là chuẩn **IEEE 802.3 (Mạng dây cáp Ethernet)** và **IEEE 802.11 (Mạng không dây Wi-Fi)**. • **IETF (Internet Engineering Task Force)**: Quản lý bộ giao thức TCP/IP (Tầng 3, 4, 7) thông qua các văn bản kỹ thuật gọi là **RFC (Request for Comments)**. • **IANA & ICANN**: Quản lý kho địa chỉ IP toàn cầu, hệ thống tên miền gốc DNS và bảng phân bổ số hiệu Port. • **TIA/EIA**: Ban hành chuẩn màu bấm dây cáp mạng RJ-45 (**T568A và T568B**).",
      example_vi: "Thấy con số bắt đầu bằng `802.x` (như `802.3` Ethernet, `802.11` Wi-Fi, `802.1Q` VLAN, `802.1D` STP) là nhớ ngay đến tổ chức **IEEE**!"
    },
    {
      term: "Flow Control (Điều khiển luồng), Response Timeout & Access Method (Phương thức truy cập)",
      simple_vi: "Ba cơ chế điều tiết nhịp độ truyền dữ liệu để máy gửi nhanh không làm tràn ngập máy nhận chậm.",
      detail_vi: "• **Flow Control**: Nếu một máy chủ cực mạnh bắn dữ liệu quá nhanh về một chiếc điện thoại yếu, bộ nhớ đệm của điện thoại sẽ bị tràn; cơ chế Flow Control giúp máy nhận ra hiệu 'Gửi chậm lại!' để đồng bộ tốc độ. • **Response Timeout**: Quy định nếu gửi gói tin đi mà sau bao nhiêu mili-giây không thấy phản hồi thì coi như gói tin đã mất để gửi lại. • **Access Method**: Quy định khi nào thiết bị được phép phát tín hiệu lên đường dây chung để không đâm sầm vào nhau (như CSMA/CD trên mạng dây cổ điển hoặc CSMA/CA trên sóng Wi-Fi).",
      example_vi: "Giao thức TCP thực hiện Flow Control thông qua trường **Window Size** trong TCP Header."
    }
  ],

  4: [
    {
      term: "Line Coding / Encoding (Mã hóa bit) vs. Signaling (Báo hiệu vật lý)",
      simple_vi: "Cách biến các con số 0 và 1 trừu tượng trong máy tính thành xung điện, tia sáng hoặc sóng vô tuyến thực tế.",
      detail_vi: "• **Encoding (Mã hóa đường truyền)**: Là phương pháp quy ước nhóm các bit dữ liệu thành các mẫu ký hiệu (ví dụ mã hóa Manchester dùng sự chuyển đổi điện áp từ cao xuống thấp làm bit 0, hoặc mã hóa 4B/5B trong cáp quang biến mỗi 4 bit thành 5 bit để đảm bảo luôn có xung đồng bộ đồng hồ giữa 2 đầu). • **Signaling (Báo hiệu)**: Là phương thức vật lý tạo ra sự thay đổi điện áp trên dây đồng, bật/tắt tia sáng trong sợi quang hoặc biến thiên biên độ/tần số/pha (AM, FM, PM) của sóng vô tuyến.",
      example_vi: "Card mạng NIC chính là nơi thực hiện cả quá trình Encoding lẫn Signaling ở Tầng 1 (Physical Layer)."
    },
    {
      term: "Bandwidth (Băng thông) vs. Latency (Độ trễ) vs. Throughput (Thông lượng) vs. Goodput",
      simple_vi: "Bốn thước đo tốc độ và hiệu năng của một đường truyền mạng.",
      detail_vi: "• **Bandwidth (Băng thông)**: Dung lượng tối đa theo thiết kế của đường cáp tính bằng số bit/giây (`bps`, `Kbps`, `Mbps`, `Gbps`, `Tbps`). • **Latency (Độ trễ)**: Thời gian (tính bằng mili-giây `ms`) để một bit đi từ nguồn tới đích, bao gồm cả thời gian xếp hàng xử lý tại các Router trung gian. • **Throughput (Thông lượng)**: Lượng bit thực tế đi qua được đường truyền trong 1 giây (luôn nhỏ hơn hoặc bằng Bandwidth do kẹt mạng, nhiễu sóng). • **Goodput**: Lượng dữ liệu ứng dụng hữu ích thực nhận được (`Goodput = Throughput - Overhead Headers - Retransmissions`).",
      example_vi: "Nếu bạn nối 1 sợi cáp quang tốc độ `10 Gbps` với 1 sợi cáp đồng tốc độ `100 Mbps`, thì thông lượng tối đa của cả tuyến đường chỉ đạt đúng mắt xích yếu nhất là **`100 Mbps`**!"
    },
    {
      term: "EMI / RFI (Nhiễu điện từ / Nhiễu tần số vô tuyến) & Crosstalk (Nhiễu xuyên âm)",
      simple_vi: "Hai kẻ thù lớn nhất làm hỏng tín hiệu điện chạy bên trong dây cáp mạng đồng.",
      detail_vi: "• **EMI (Electromagnetic Interference) & RFI (Radio Frequency Interference)**: Nhiễu từ bên ngoài xâm nhập vào dây cáp đồng khi bạn đi dây mạng sát với đường dây điện 220V/380V, bóng đèn huỳnh quang, động cơ thang máy hoặc lò vi sóng. • **Crosstalk (Nhiễu xuyên âm)**: Nhiễu nội bộ sinh ra khi từ trường của cặp dây đồng số 1 cảm ứng sang cặp dây đồng số 2 nằm sát bên cạnh nó trong cùng một vỏ cáp. Để chống Crosstalk, cáp UTP dùng kỹ thuật **xoắn đôi các sợi đồng (Twisting)** với bước xoắn khác nhau; để chống EMI/RFI nặng trong nhà máy, kỹ sư dùng **cáp STP (có bọc lá bạc kim loại chống nhiễu)** hoặc chuyển hẳn sang **cáp quang**.",
      example_vi: "Khi bấm hạt mạng RJ-45, kỹ sư giỏi luôn giữ lớp vỏ xoắn của các cặp dây sát tới tận chân đồng, tuyệt đối không tháo xoắn quá 1.3 cm để tránh nhiễu Near-End Crosstalk (NEXT)!"
    },
    {
      term: "UTP vs. STP vs. Coaxial Cable (Ba loại cáp đồng trong mạng)",
      simple_vi: "Cáp xoắn đôi không bọc kim (UTP), Cáp xoắn đôi có bọc lá kim loại (STP) và Cáp đồng trục (Coaxial).",
      detail_vi: "• **UTP (Unshielded Twisted Pair)**: Loại cáp mạng LAN phổ biến nhất thế giới (Cat5e tốc độ 1Gbps, Cat6 tốc độ 1–10Gbps, Cat6a/Cat7 lên tới 10Gbps ở 100m), gồm 4 cặp dây đồng xoắn vào nhau, không có lớp lá kim loại nên mềm dẻo, dễ thi công, giá rẻ. • **STP (Shielded Twisted Pair)**: Có thêm lớp vỏ lưới đồng và lá nhôm bọc quanh từng cặp dây để chống nhiễu EMI/RFI cực mạnh, nhưng đắt tiền, cứng và yêu cầu nối đất chuẩn. • **Coaxial (Cáp đồng trục)**: Có 1 lõi đồng cứng ở tâm bọc cách điện và lưới đồng chống nhiễu bên ngoài — dùng cho truyền hình cáp (Cable Internet) và nối ăng-ten phát sóng không dây.",
      example_vi: "Tất cả các chuẩn cáp mạng đồng Ethernet (10BASE-T, 100BASE-TX, 1000BASE-T) đều bị giới hạn chiều dài tối đa là **100 mét** do hiện tượng suy hao tín hiệu điện (Attenuation)."
    },
    {
      term: "T568A vs. T568B, Straight-Through (Cáp thẳng), Crossover (Cáp chéo), Rollover & Auto-MDIX",
      simple_vi: "Hai chuẩn thứ tự màu bấm hạt mạng RJ-45 và 3 loại dây cáp đồng phục vụ các mục đích đấu nối khác nhau.",
      detail_vi: "• **Chuẩn T568A**: 1.Trắng-XanhLá, 2.XanhLá, 3.Trắng-Cam, 4.XanhDương, 5.Trắng-XanhDương, 6.Cam, 7.Trắng-Nâu, 8.Nâu. • **Chuẩn T568B** (Đảo vị trí cặp Cam và Xanh lá ở chân 1,2 và 3,6): 1.Trắng-Cam, 2.Cam, 3.Trắng-XanhLá, 4.XanhDương, 5.Trắng-XanhDương, 6.XanhLá, 7.Trắng-Nâu, 8.Nâu. • **Cáp Thẳng (Straight-Through)**: Hai đầu bấm giống hệt nhau (thường là B–B) -> Dùng nối 2 thiết bị **KHÁC NHÓM** (PC–Switch, Switch–Router). • **Cáp Chéo (Crossover)**: Một đầu bấm A, một đầu bấm B -> Dùng nối 2 thiết bị **CÙNG NHÓM** (Switch–Switch, Router–Router, PC–PC, và **PC–Router** vì cả PC lẫn Router đều phát ở chân 1,2 và thu ở chân 3,6!). • **Auto-MDIX**: Tính năng trên Switch/Router đời mới tự động nhận biết và đảo chân điện tử bên trong nên cắm cáp thẳng hay cáp chéo đều chạy được.",
      example_vi: "Câu hỏi bẫy kinh điển thi CCNA: 'Khi tắt tính năng Auto-MDIX, muốn nối trực tiếp máy tính PC vào cổng Ethernet của Router thì phải dùng cáp gì?' -> Đáp án: **Cáp Chéo (Crossover Cable)**!"
    },
    {
      term: "Single-Mode Fiber (SMF) vs. Multimode Fiber (MMF) & Đầu nối quang LC / SC / ST",
      simple_vi: "Hai loại cáp quang học: Single-Mode (lõi siêu nhỏ, dùng Laser, đi xa hàng chục km) và Multimode (lõi lớn, dùng đèn LED, đi gần trong tòa nhà).",
      detail_vi: "• **Single-Mode Fiber (SMF - Cáp quang đơn mốt, vỏ thường màu Vàng)**: Lõi thủy tinh siêu nhỏ chỉ **9 micromet**, truyền duy nhất 1 tia sáng **Laser** đi thẳng tắp ở tâm lõi nên hầu như không bị tán sắc, truyền xa tới **10 km – 100 km** (dùng nối WAN giữa các thành phố, cáp quang biển). • **Multimode Fiber (MMF - Cáp quang đa mốt, vỏ thường màu Cam hoặc Xanh ngọc Aqua)**: Lõi thủy tinh lớn hơn (**50 hoặc 62.5 micromet**), dùng nguồn sáng **đèn LED** giá rẻ phát nhiều tia sáng phản xạ зиг-zắc trong lõi, truyền khoảng cách ngắn dưới **550 mét** (dùng nối trục đứng giữa các tầng trong cùng tòa nhà hoặc trong phòng Data Center). • **Đầu nối quang**: **LC** (nhỏ gọn nhất, cắm trực tiếp vào module SFP), **SC** (đầu vuông cắm rút), **ST** (đầu tròn vặn khớp cài).",
      example_vi: "Vì cáp quang truyền ánh sáng chỉ theo 1 chiều nên mỗi đường nối quang tiêu chuẩn luôn gồm **2 sợi quang đi cặp với nhau (Duplex Fiber)**: 1 sợi chuyên Phát (TX) và 1 sợi chuyên Thu (RX)."
    },
    {
      term: "Wi-Fi (IEEE 802.11a/b/g/n/ac/ax), Bluetooth (802.15), WiMAX (802.16) & Zigbee",
      simple_vi: "Các chuẩn công nghệ truyền dẫn không dây bằng sóng vô tuyến điện từ.",
      detail_vi: "Mạng không dây có ưu điểm di động cao nhưng chịu 4 nhược điểm vật lý: Vùng phủ sóng phụ thuộc vật cản (tường bê tông, kim loại), bị nhiễu sóng bởi thiết bị khác (lò vi sóng ở tần số 2.4GHz), dễ bị nghe lén qua không khí nên bắt buộc phải mã hóa (WPA2/WPA3), và phải chạy chế độ **Half-Duplex (dùng thuật toán tránh đụng độ CSMA/CA)**. Các chuẩn Wi-Fi chính: **802.11n (Wi-Fi 4)** chạy cả 2.4GHz & 5GHz; **802.11ac (Wi-Fi 5)** chạy ở 5GHz tốc độ Gigabit; **802.11ax (Wi-Fi 6 / 6E)** chạy ở 2.4GHz, 5GHz và 6GHz.",
      example_vi: "Để triển khai mạng Wi-Fi cho văn phòng lớn, cần kết hợp **Bộ phát sóng (Wireless Access Point - WAP)** và **Bộ điều khiển không dây tập trung (Wireless LAN Controller - WLC)**."
    }
  ],

  5: [
    {
      term: "Binary (Hệ Nhị phân cơ số 2) vs. Decimal (Hệ Thập phân cơ số 10) vs. Hexadecimal (Hệ Thập lục phân cơ số 16)",
      simple_vi: "Ba ngôn ngữ chữ số trong ngành mạng: Con người dùng cơ số 10, Máy tính xử lý bằng cơ số 2, và Địa chỉ MAC / IPv6 viết gọn bằng cơ số 16.",
      detail_vi: "• **Decimal (Cơ số 10)**: Dùng 10 chữ số (`0` đến `9`), giá trị mỗi hàng tăng theo lũy thừa của 10 ($10^0=1, 10^1=10, 10^2=100$). • **Binary (Cơ số 2)**: Chỉ dùng 2 chữ số (`0` và `1`), giá trị mỗi cột tăng gấp đôi từ phải sang trái theo lũy thừa của 2 ($2^0=1, 2^1=2, 2^2=4, 2^3=8, 2^4=16, 2^5=32, 2^6=64, 2^7=128$). • **Hexadecimal (Cơ số 16)**: Dùng 16 ký tự (`0–9` và `A=10, B=11, C=12, D=13, E=14, F=15`). Cứ **1 chữ số Hex đại diện chính xác cho 4 bit nhị phân**, và **2 chữ số Hex (ví dụ `0xFF`) đại diện cho 1 Byte (8 bit)**.",
      example_vi: "Một địa chỉ IPv6 dài 128 bit nếu viết bằng nhị phân sẽ dài tới 128 chữ số 0/1 không ai đọc nổi; nhưng nhờ hệ Hexadecimal, 128 bit thu gọn chỉ còn `128 / 4 = 32` chữ số Hex!"
    },
    {
      term: "Bit vs. Nibble (4-bit) vs. Byte / Octet (8-bit) vs. Hextet (16-bit)",
      simple_vi: "Cách gọi tên các đơn vị gom nhóm bit nhị phân trong địa chỉ mạng.",
      detail_vi: "• **Bit**: Đơn vị nhỏ nhất chỉ mang giá trị `0` hoặc `1`. • **Nibble (4 bits)**: Cụm 4 bit nhị phân có giá trị từ `0000` (0) đến `1111` (15), tương ứng với đúng **1 chữ số Hexadecimal** (theo bảng trọng số vàng `8 - 4 - 2 - 1`). • **Byte / Octet (8 bits)**: Cụm 8 bit nhị phân có giá trị từ `00000000` (0) đến `11111111` (255), tương ứng với **1 thành phần trong địa chỉ IPv4** (ví dụ địa chỉ IPv4 gồm 4 Octet cách nhau bởi dấu chấm). • **Hextet (16 bits / 2 Bytes)**: Cụm gồm 4 chữ số Hex (16 bit nhị phân), tương ứng với **1 thành phần trong địa chỉ IPv6** (địa chỉ IPv6 gồm 8 Hextet cách nhau bởi dấu hai chấm `:`).",
      example_vi: "Muốn đổi nhanh số nhị phân `1101 0110` sang Hex: Cắt đôi thành 2 Nibble -> Nibble trái `1101 = 8+4+1 = 13 = D`; Nibble phải `0110 = 4+2 = 6` -> Kết quả là **`D6`**!"
    },
    {
      term: "Positional Value Table (Bảng giá trị vị trí 8-bit: 128 - 64 - 32 - 16 - 8 - 4 - 2 - 1)",
      simple_vi: "Chiếc chìa khóa vạn năng giúp đổi mọi địa chỉ IPv4 và tính toán chia mạng con Subnetting trong vài giây.",
      detail_vi: "Khi đặt 8 bit của một Octet từ trái sang phải ($2^7$ xuống $2^0$), ta có 8 cột giá trị cố định: **`128 | 64 | 32 | 16 | 8 | 4 | 2 | 1`**. • **Đổi từ Nhị phân sang Thập phân**: Chỉ cần cộng các con số ở những cột có bit bằng `1`. • **Đổi từ Thập phân sang Nhị phân (Phương pháp trừ dần từ trái sang phải)**: Đem số cần đổi so sánh từ cột `128` trở xuống — nếu lớn hơn hoặc bằng cột đó thì ghi bit `1` và lấy số dư xét tiếp cột kế bên; nếu nhỏ hơn thì ghi bit `0`.",
      example_vi: "Quy luật cộng dồn từ trái sang phải tạo ra **9 con số vàng của Subnet Mask**: `0`, `128`, `192` (128+64), `224` (+32), `240` (+16), `248` (+8), `252` (+4), `254` (+2), `255` (+1)."
    }
  ],

  6: [
    {
      term: "LLC Sublayer (IEEE 802.2) vs. MAC Sublayer (IEEE 802.3 / 802.11)",
      simple_vi: "Hai tầng con bên trong Tầng 2 (Data Link Layer): Tầng trên nối với phần mềm Tầng 3, Tầng dưới nối với phần cứng dây cáp Tầng 1.",
      detail_vi: "IEEE chia Tầng 2 (Data Link) thành 2 tầng con độc lập: • **1. LLC (Logical Link Control - Chuẩn IEEE 802.2)**: Nằm ở nửa trên, thực hiện bằng phần mềm Driver mạng. Nhiệm vụ của LLC là nhận gói tin từ Tầng 3 và đánh dấu trường nhận diện xem gói tin đó là **IPv4, IPv6 hay ARP**, giúp một giao thức IP duy nhất ở Tầng 3 có thể chạy trên bất kỳ loại cáp nào bên dưới. • **2. MAC (Media Access Control - Chuẩn 802.3 Ethernet / 802.11 Wi-Fi / 802.15 Bluetooth)**: Nằm ở nửa dưới, thực hiện trực tiếp bằng chip phần cứng trên Card mạng NIC. Nhiệm vụ của MAC là đóng gói khung Frame, gắn địa chỉ MAC Nguồn/Đích, tính mã kiểm lỗi FCS và điều khiển việc phát tín hiệu lên dây cáp.",
      example_vi: "Đề thi CCNA rất hay hỏi: 'Tầng con nào của Data Link chịu trách nhiệm giao tiếp trực tiếp với Tầng Vật Lý (Physical Layer)?' -> Đáp án: **MAC Sublayer**!"
    },
    {
      term: "CSMA/CD (Phát hiện đụng độ trên cáp đồng) vs. CSMA/CA (Tránh đụng độ trên sóng Wi-Fi)",
      simple_vi: "Hai bộ luật giao thông giúp các thiết bị dùng chung 1 đường truyền (Half-Duplex) không đâm sầm tín hiệu vào nhau.",
      detail_vi: "Khi nhiều thiết bị chia sẻ chung một môi trường truyền dẫn (Multiaccess Half-Duplex): • **CSMA/CD (Carrier Sense Multiple Access with Collision Detection - Dùng trên mạng cáp đồng Ethernet Hub cũ)**: Máy tính lắng nghe dây cáp thấy rảnh thì truyền ngay; nếu chẳng may 2 máy truyền cùng lúc gây đụng độ (**Collision**), cả hai phát hiện điện áp tăng vọt sẽ lập tức ngừng gửi, phát tín hiệu báo kẹt (**Jam Signal**), rồi chạy thuật toán chờ một khoảng thời gian ngẫu nhiên (**Backoff Algorithm**) trước khi gửi lại. • **CSMA/CA (Collision Avoidance - Dùng trên mạng Wi-Fi 802.11)**: Vì trên không trung thiết bị phát sóng không thể vừa phát vừa nghe để biết có đụng độ hay không, nên máy tính phải chủ động **tránh đụng độ từ trước** bằng cách gửi bản tin xin phép **RTS (Request to Send)** lên bộ phát Wi-Fi và chờ bộ phát trả lời cho phép **CTS (Clear to Send)** kèm thời gian chiếm sóng thì mới được truyền!",
      example_vi: "Lưu ý quan trọng: Trong mạng LAN hiện đại dùng **Switch chạy chế độ Full-Duplex**, mỗi cổng có cặp dây thu/phát riêng nên **hoàn toàn không bao giờ xảy ra đụng độ và CSMA/CD được tắt bỏ**!"
    },
    {
      term: "Half-Duplex (Bán song công) vs. Full-Duplex (Song công toàn phần)",
      simple_vi: "Half-Duplex giống như bộ đàm (ai nói thì người kia phải nghe, không nói cùng lúc được); Full-Duplex giống như gọi điện thoại (hai bên vừa nói vừa nghe cùng một lúc).",
      detail_vi: "• **Half-Duplex**: Dữ liệu chỉ có thể truyền theo **1 chiều tại một thời điểm** (hoặc gửi, hoặc nhận). Bắt buộc áp dụng trên thiết bị Hub cổ điển và mạng không dây **Wi-Fi (WLAN)**. • **Full-Duplex**: Dữ liệu được truyền và nhận **đồng thời cả 2 chiều cùng một lúc** trên các cặp dây đồng hoặc sợi quang riêng biệt, giúp tăng gấp đôi hiệu suất thực tế (100% tốc độ mỗi chiều) và đạt **0% Collision**. Để chạy được Full-Duplex, cả 2 đầu cáp đều phải là Switch, Router hoặc Card mạng PC/Server hỗ trợ Full-Duplex.",
      example_vi: "Nếu một đầu cổng cấu hình `duplex full` còn đầu kia để `duplex half` (**Duplex Mismatch**), mạng vẫn sáng đèn xanh nhưng sẽ cực kỳ chậm và rớt gói liên tục do lỗi **Late Collisions & CRC Errors**!"
    },
    {
      term: "Frame Header, Payload & FCS Trailer (Cấu trúc 3 phần của khung tin Tầng 2)",
      simple_vi: "Mọi khung tin Tầng 2 đều gồm: Đầu khung (Header), Thân dữ liệu (Payload) và Đuôi kiểm lỗi (Trailer).",
      detail_vi: "• **1. Frame Header**: Chứa các bit khởi động báo hiệu bắt đầu khung (Frame Start), **Địa chỉ vật lý Đích & Nguồn**, và trường **Type/Length** cho biết giao thức Tầng 3 bên trong. • **2. Payload (Data)**: Chính là nguyên vẹn gói tin **IP Packet** của Tầng 3 đưa xuống. • **3. Frame Trailer**: Chứa trường **FCS (Frame Check Sequence - 4 Bytes)** sử dụng thuật toán đa thức **CRC (Cyclic Redundancy Check)**: Máy gửi tính ra một con số CRC từ nội dung khung tin và đính vào đuôi; máy nhận tính lại đúng công thức đó — nếu 2 con số khớp nhau nghĩa là khung tin nguyên vẹn, nếu lệch dù chỉ 1 bit do nhiễu đường truyền thì máy nhận lập tức **vứt bỏ khung tin hỏng đó trong im lặng**!",
      example_vi: "Tầng 2 chỉ **phát hiện lỗi (Error Detection)** bằng FCS rồi xóa bỏ khung hỏng, chứ không tự xin gửi lại (việc xin gửi lại do TCP ở Tầng 4 đảm nhận)."
    },
    {
      term: "Physical vs. Logical Topologies (Point-to-Point, Hub-and-Spoke, Mesh, Star, Bus, Ring)",
      simple_vi: "Các hình dáng kết nối giữa các thiết bị mạng trong mạng diện rộng WAN và mạng cục bộ LAN.",
      detail_vi: "• **Trong mạng WAN**: 1) **Point-to-Point (Điểm nối điểm)**: Một đường cáp nối thẳng giữa 2 điểm; 2) **Hub-and-Spoke**: Các chi nhánh (Spokes) đều nối tập trung về một Trụ sở chính (Hub); 3) **Mesh (Mạng lưới toàn phần)**: Mọi trạm đều nối trực tiếp với tất cả các trạm còn lại (chịu lỗi cao nhất nhưng đắt đỏ nhất). • **Trong mạng LAN**: 1) **Star / Extended Star (Hình sao)**: Mọi máy tính nối về Switch trung tâm (chuẩn hiện đại); 2) **Bus**: Dùng chung 1 trục cáp đồng trục (cổ điển); 3) **Ring (Hình vòng)**: Các máy nối thành vòng tròn truyền thẻ bài Token (cổ điển).",
      example_vi: "Trên đường Point-to-Point nối trực tiếp giữa 2 Router (không qua Switch Ethernet), khung tin Tầng 2 dùng giao thức **PPP hoặc HDLC** nên thậm chí không cần đến địa chỉ MAC 48-bit!"
    }
  ],

  7: [
    {
      term: "Ethernet II Frame Fields (Preamble, SFD, Destination MAC, Source MAC, EtherType, Data, FCS)",
      simple_vi: "Giải phẫu chi tiết từng ô bên trong một khung tin Ethernet chuẩn (kích thước từ 64 đến 1518 Bytes).",
      detail_vi: "Một khung tin Ethernet hoàn chỉnh gồm: • **Preamble (7 Bytes `10101010...`) + SFD (1 Byte `10101011`)**: Dùng để đánh thức card mạng nhận và đồng bộ nhịp đồng hồ thu phát (8 Bytes này không tính vào kích thước 64–1518 Bytes của Frame). • **Destination MAC Address (6 Bytes)**: Địa chỉ MAC của thiết bị nhận. • **Source MAC Address (6 Bytes)**: Địa chỉ MAC của thiết bị gửi (luôn là Unicast!). • **EtherType / Length (2 Bytes)**: Nếu giá trị $\ge \text{0x0600}$ (1536) thì cho biết giao thức Tầng 3 bên trong: **`0x0800` = IPv4**, **`0x86DD` = IPv6**, **`0x0806` = ARP**. • **Data Payload (46 – 1500 Bytes)**: Chứa gói tin Tầng 3 (nếu gói tin nhỏ hơn 46 Bytes thì tự động chèn thêm các bit đệm **Padding** cho đủ 46 Bytes để tổng Frame đạt tối thiểu **64 Bytes**). • **FCS (4 Bytes)**: Mã kiểm lỗi CRC-32. Nếu gắn thêm thẻ VLAN 802.1Q (4 Bytes), kích thước tối đa tăng lên **1522 Bytes**.",
      example_vi: "Bất kỳ khung tin nào ngắn hơn **64 Bytes** (gọi là **Runt Frame** - thường do đụng độ Collision làm đứt gãy) hoặc dài hơn **1518 Bytes** (gọi là **Giant / Baby Giant Frame**) đều bị coi là khung lỗi!"
    },
    {
      term: "MAC Address Structure (48-bit = 24-bit OUI + 24-bit Vendor Assigned / BIA)",
      simple_vi: "Cấu trúc làm nên tính duy nhất trên toàn thế giới của một địa chỉ vật lý MAC.",
      detail_vi: "Địa chỉ MAC dài **48 bit (6 Bytes = 12 chữ số Hex)** được ghi vào chip ROM của Card mạng khi xuất xưởng (gọi là **BIA - Burned-In Address**). Nó được chia làm 2 nửa bằng nhau: • **24 bit đầu (3 Bytes / 6 chữ số Hex đầu)**: Gọi là **OUI (Organizationally Unique Identifier)** — Mã định danh nhà sản xuất do tổ chức IEEE cấp riêng cho từng hãng (ví dụ `00-60-2F` là của Cisco, `00-1B-63` là của Apple, `3C-D9-2B` là của HP). • **24 bit sau (3 Bytes / 6 chữ số Hex cuối)**: Số sê-ri duy nhất do chính hãng sản xuất đó tự đánh số cho từng chiếc card mạng xuất xưởng.",
      example_vi: "Khi nhìn vào địa chỉ MAC trong bảng `show mac address-table` của Switch, kỹ sư bảo mật chỉ cần tra cứu 6 ký tự đầu (OUI) là biết ngay chiếc máy đang cắm vào cổng đó là iPhone, Laptop Dell hay Camera Hikvision!"
    },
    {
      term: "Unicast MAC vs. Broadcast MAC (`FF-FF-FF-FF-FF-FF`) vs. Multicast MAC (`01-00-5E-...` / `33-33-...`)",
      simple_vi: "Cách nhìn vào chữ số Hex đầu tiên của địa chỉ MAC để phân biệt ngay đó là MAC cá nhân, MAC quảng bá hay MAC nhóm.",
      detail_vi: "• **Unicast MAC**: Địa chỉ gắn cứng trên 1 card mạng cụ thể. • **Broadcast MAC**: Toàn bộ 48 bit đều bằng 1, viết dạng Hex là **`FF-FF-FF-FF-FF-FF`** (hoặc `ffff.ffff.ffff` trên Cisco). • **Multicast MAC**: Được ánh xạ tự động từ địa chỉ IP Multicast ở Tầng 3: Với **IPv4 Multicast**, địa chỉ MAC luôn bắt đầu bằng 6 chữ số Hex cố định là **`01-00-5E`** (24 bit cuối lấy từ 23 bit cuối của địa chỉ IPv4 Multicast); còn với **IPv6 Multicast**, địa chỉ MAC luôn bắt đầu bằng 4 chữ số Hex cố định là **`33-33`**!",
      example_vi: "Mẹo vàng thi CCNA: Nhìn thấy MAC `FF-FF-FF-FF-FF-FF` = **Broadcast**; Nhìn thấy `01-00-5E-xx-xx-xx` = **IPv4 Multicast**; Nhìn thấy `33-33-xx-xx-xx-xx` = **IPv6 Multicast**!"
    },
    {
      term: "CAM Table (MAC Address Table) — Cơ chế Learn (Học) & Forward/Flood/Filter của Switch",
      simple_vi: "Cuốn sổ tay thông minh bên trong bộ nhớ phần cứng của Switch giúp nó nhớ máy tính nào đang cắm ở cổng số mấy.",
      detail_vi: "Mỗi khi có một khung tin đi vào cổng của Switch, Switch thực hiện 2 bước hoàn toàn độc lập: • **Bước 1: LEARN (Học địa chỉ — Luôn nhìn vào SOURCE MAC)**: Switch đọc địa chỉ **MAC Nguồn** của khung tin và cổng vừa đi vào; nếu chưa có trong bảng CAM thì ghi mới vào kèm đồng hồ đếm ngược **300 giây (5 phút)**; nếu đã có rồi thì làm mới (Reset) đồng hồ về lại 300 giây. • **Bước 2: FORWARD (Chuyển tiếp — Luôn nhìn vào DESTINATION MAC)**: 1) Nếu **MAC Đích có trong bảng CAM**: Chuyển khung tin ra **đúng 1 cổng duy nhất đó** (*Forward / Filter các cổng khác*); 2) Nếu **MAC Đích CHƯA CÓ trong bảng CAM** (gọi là **Unknown Unicast**) hoặc MAC Đích là **Broadcast / Multicast**: Nhân bản và phát khung tin ra **TẤT CẢ các cổng đang bật trừ cổng vừa nhận vào** (**Flooding**).",
      example_vi: "Câu hỏi bẫy đề thi CCNA: 'Switch làm gì khi nhận một khung tin Unicast mà địa chỉ MAC Đích chưa có trong bảng MAC?' -> Đáp án: **Flood ra tất cả các cổng trừ cổng nhận vào** (chứ không bao giờ vứt bỏ!)."
    },
    {
      term: "Store-and-Forward Switching vs. Cut-Through Switching (Fast-Forward & Fragment-Free)",
      simple_vi: "Hai phương pháp chuyển mạch của Switch: Kiểm tra kỹ toàn bộ khung tin rồi mới gửi (Store-and-Forward) hay vừa đọc xong địa chỉ đích ở đầu khung là phóng đi luôn (Cut-Through).",
      detail_vi: "• **1. Store-and-Forward (Lưu và Chuyển tiếp — Mặc định trên mọi Switch Cisco Catalyst)**: Switch nhận trọn vẹn 100% khung tin vào bộ nhớ đệm, tính toán kiểm tra mã lỗi **FCS (CRC)** ở đuôi khung — nếu khung tin bị lỗi thì vứt bỏ ngay tại chỗ không làm bẩn mạng, nếu khung tốt mới chuyển đi. Ngoài ra, phương pháp này **bắt buộc phải dùng khi chuyển dữ liệu giữa 2 cổng có tốc độ khác nhau** (ví dụ từ cổng 100Mbps lên cổng 1Gbps) và hỗ trợ phân loại ưu tiên **QoS**. • **2. Cut-Through (Chuyển mạch cắt ngang — Độ trễ siêu thấp)**: Switch không thèm đợi nhận hết khung tin và **không kiểm tra lỗi FCS**! Nó có 2 biến thể: **Fast-Forward** (chỉ đọc đúng 6 Bytes MAC Đích đầu tiên là phóng đi ngay — nhanh nhất nhưng chuyển luôn cả khung rác bị lỗi!) và **Fragment-Free** (đợi đọc hết **64 Bytes đầu tiên** — nơi xảy ra hầu hết lỗi đụng độ Runt Frame — rồi mới phóng đi).",
      example_vi: "Mẹo nhớ thi CCNA: Có kiểm tra FCS + hỗ trợ QoS + nối 2 cổng khác tốc độ = **Store-and-Forward**; Chuyển đi ngay khi đọc xong Destination MAC = **Fast-Forward**; Đợi đủ 64 Bytes đầu tiên = **Fragment-Free**."
    },
    {
      term: "Memory Buffering trên Switch (Port-Based Memory vs. Shared Memory)",
      simple_vi: "Hai cách thiết kế kho chứa tạm các khung tin bên trong Switch khi cổng ra bị kẹt xe.",
      detail_vi: "• **Port-Based Memory (Bộ đệm theo từng cổng riêng)**: Mỗi cổng vật lý được chia một ngăn nhớ cố định. Nhược điểm: Nếu 1 khung tin đầu hàng bị kẹt chờ máy đích bận, toàn bộ các khung tin phía sau dù gửi cho máy khác cũng bị tắc nghẽn theo, và cổng ít việc không chia sẻ bộ nhớ cho cổng nhiều việc được. • **Shared Memory (Bộ đệm dùng chung)**: Tất cả các cổng cùng gửi khung tin vào một kho bộ nhớ chung khổng lồ và phân bổ linh hoạt theo nhu cầu thực tế. Đây là cơ chế bắt buộc để thực hiện **Asymmetric Switching** (chuyển mạch bất đối xứng giữa cổng Server 10Gbps và các cổng máy trạm 100Mbps/1Gbps).",
      example_vi: "Nhờ có **Shared Memory Buffering**, khi 10 nhân viên tốc độ 1Gbps cùng truy cập vào 1 cổng Server 10Gbps, Switch có thể đệm tạm dữ liệu mà không làm rớt gói tin."
    }
  ],

  8: [
    {
      term: "Three Characteristics of IP: Connectionless, Best Effort (Unreliable) & Media Independent",
      simple_vi: "Ba bản chất thiết kế giúp giao thức IP (IPv4 và IPv6) vận hành nhẹ nhàng và nhanh chóng trên toàn cầu.",
      detail_vi: "• **1. Connectionless (Không thiết lập kết nối trước)**: Trước khi gửi gói tin IP, máy gửi không gửi bất kỳ bản tin thông báo hay bắt tay nào với máy nhận. Các gói tin đi độc lập nên có thể đi theo các tuyến đường khác nhau và tới đích không theo thứ tự ban đầu. • **2. Best Effort / Unreliable (Nỗ lực tối đa / Không đảm bảo tin cậy ở Tầng 3)**: IP Header không có các trường xác nhận đã nhận (ACK) hay xin gửi lại gói mất — giúp giảm tải tối đa cho các Router trên đường đi. Nếu ứng dụng cần độ tin cậy 100%, nhiệm vụ đó được giao cho giao thức **TCP ở Tầng 4**. • **3. Media Independent (Độc lập với môi trường truyền dẫn)**: Gói tin IP có thể chạy qua cáp đồng Ethernet, cáp quang, sóng Wi-Fi hay đường vệ tinh mà không cần sửa đổi cấu trúc IP Packet; chỉ duy nhất thông số **MTU (Maximum Transmission Unit)** là cần lưu ý để cắt mảnh (Fragmentation) nếu đường cáp phía trước hẹp hơn.",
      example_vi: "Lưu ý bẫy đề thi: Trong IPv4, nếu gói tin lớn hơn MTU thì **Router trung gian** có thể cắt mảnh (Fragmentation); nhưng trong **IPv6**, Router trung gian **TUYỆT ĐỐI KHÔNG cắt mảnh gói tin** (trường Fragmentation đã bị xóa khỏi IPv6 Header để tăng tốc độ Router)!"
    },
    {
      term: "IPv4 Header Fields (Version, DSCP/ECN, TTL, Protocol, Header Checksum, Source IP, Destination IP)",
      simple_vi: "Ý nghĩa của các ô thông tin quan trọng nhất nằm ở phần đầu của mỗi gói tin IPv4 (20 Bytes).",
      detail_vi: "• **Version (4 bits)**: Luôn mang giá trị nhị phân `0100` (số 4). • **DiffServ / DSCP (6 bits) & ECN (2 bits)**: Đánh dấu mức độ ưu tiên chất lượng dịch vụ **QoS** (ví dụ ưu tiên gói thoại VoIP). • **TTL (Time to Live - 8 bits)**: Số bước nhảy tối đa cho phép gói tin tồn tại; cứ đi qua 1 chiếc Router là bị trừ đi 1, nếu chạm 0 thì Router hủy gói tin để chống lặp vô tận. • **Protocol (8 bits)**: Cho biết giao thức Tầng 4 nằm bên trong gói tin là gì (**`1 = ICMP`**, **`6 = TCP`**, **`17 = UDP`**, **`89 = OSPF`**). • **Header Checksum (16 bits)**: Kiểm tra lỗi của riêng phần nhãn IPv4 Header (vì TTL giảm đi 1 ở mỗi trạm nên Router phải tính lại Checksum ở mỗi bước nhảy). • **Source IPv4 & Destination IPv4 (mỗi trường 32 bits)**: Địa chỉ IP của máy gửi gốc và máy nhận cuối.",
      example_vi: " Thuộc lòng 3 con số của trường Protocol trong IPv4 Header khi đi thi: **ICMP = 1**, **TCP = 6**, **UDP = 17**!"
    },
    {
      term: "IPv6 Header Fields (40 Bytes cố định: Version, Traffic Class, Flow Label, Payload Length, Next Header, Hop Limit)",
      simple_vi: "Tại sao nhãn đầu của gói tin IPv6 dài gấp đôi IPv4 (40 Bytes so với 20 Bytes) nhưng Router lại xử lý nhanh hơn gấp nhiều lần?",
      detail_vi: "IPv4 Header tuy chỉ 20 Bytes nhưng chứa tới **12 trường thông tin phức tạp** có độ dài thay đổi (Variable length từ 20–60 Bytes) và bắt Router phải tính lại **Header Checksum** ở mỗi trạm. Ngược lại, **IPv6 Header có kích thước cố định đúng 40 Bytes** và rút gọn chỉ còn **8 trường thông tin**: 1) **Version** (`0110` = 6); 2) **Traffic Class** (tương đương DSCP làm QoS); 3) **Flow Label (20 bits)** (giúp Router nhận diện các gói tin thuộc cùng một luồng thời gian thực mà không cần mở Tầng 4); 4) **Payload Length**; 5) **Next Header** (tương đương trường Protocol của IPv4); 6) **Hop Limit** (tương đương trường TTL của IPv4); 7) **Source IPv6 (128 bits)**; 8) **Destination IPv6 (128 bits)**.",
      example_vi: "Ba thứ đã bị xóa bỏ hoàn toàn khỏi IPv6 Header để giúp Router chuyển mạch siêu tốc: **1) Header Checksum** (vì Tầng 2 FCS và Tầng 4 TCP/UDP đã kiểm lỗi rồi), **2) Các trường cắt mảnh Fragmentation**, và **3) IHL / Options**."
    },
    {
      term: "Host Routing Decision (Myself / Local Host / Remote Host) & Default Gateway",
      simple_vi: "Quy trình 3 lựa chọn khi bản thân một chiếc máy tính (PC) quyết định gửi gói tin đi đâu.",
      detail_vi: "Không chỉ Router mới có bảng định tuyến, mà bản thân mỗi chiếc máy tính Windows/Linux cũng có bảng định tuyến riêng (`netstat -r` hoặc `route print`) và chia đích đến làm 3 nhóm: • **1. Myself (Chính bản thân máy mình)**: Gửi tới `127.0.0.1` (IPv4) hoặc `::1` (IPv6) — gói tin xử lý ngay trong chip phần mềm của máy. • **2. Local Host (Máy đích nằm cùng mạng LAN)**: Sau khi lấy IP Đích phép toán AND với Subnet Mask thấy trùng Network ID với mình -> PC dùng ARP tìm thẳng địa chỉ MAC của máy đích và gửi qua Switch, **không đi qua Default Gateway**. • **3. Remote Host (Máy đích nằm ở mạng khác)**: Kết quả phép toán AND khác Network ID -> PC tra mục `0.0.0.0` (Default Gateway) và đóng Frame gửi tới địa chỉ MAC của cổng Router!",
      example_vi: "Một chiếc Default Gateway bắt buộc phải thỏa mãn 2 điều kiện: 1) Có địa chỉ IP nằm **cùng dải mạng (Same Subnet)** với các máy tính trong LAN; 2) Có khả năng nhận dữ liệu từ LAN và định tuyến ra các mạng khác."
    },
    {
      term: "Routing Table Entries: Directly Connected (`C`, `L`) vs. Remote Routes (`S`, `O`, `D`) & Default Route (`S* 0.0.0.0/0`)",
      simple_vi: "Cách đọc hiểu toàn bộ các chữ cái viết tắt đầu dòng trong bảng định tuyến của Router Cisco (`show ip route`).",
      detail_vi: "• **`C` (Connected)**: Mạng gắn trực tiếp vào cổng của Router (tự động xuất hiện ngay khi đặt IP cho cổng và gõ `no shutdown`). • **`L` (Local - từ IOS 15 trở lên)**: Chính là địa chỉ IP cụ thể (`/32` hoặc `/128`) đã đặt trên cổng đó của Router. • **`S` (Static Route)**: Tuyến đường tới mạng ở xa do kỹ sư tự gõ tay bằng lệnh `ip route`. • **`O` (OSPF)** / **`D` (EIGRP)** / **`R` (RIP)**: Tuyến đường tới mạng ở xa do Router tự học được qua giao thức định tuyến động. • **`S*` (`0.0.0.0/0` hoặc `::/0` - Gateway of Last Resort / Default Route)**: Tuyến đường 'vét cạn cuối cùng' — bất kỳ gói tin nào có IP đích không khớp với các mạng cụ thể trong bảng sẽ được đẩy theo tuyến đường này ra ngoài Internet (nếu không có dòng `0.0.0.0/0` thì gói tin không khớp sẽ bị hủy bỏ ngay!).",
      example_vi: "Trong dòng `O 192.168.30.0/24 [110/2] via 10.1.1.2`: Số **`110`** đứng trước dấu gạch chéo là **Administrative Distance (Độ tin cậy của giao thức: Connected=0, Static=1, EIGRP=90, OSPF=110, RIP=120)**; còn số **`2`** đứng sau là **Metric (Chi phí đường đi)**!"
    }
  ],

  9: [
    {
      term: "ARP (Address Resolution Protocol) — Tại sao có IP rồi vẫn bắt buộc phải tìm địa chỉ MAC?",
      simple_vi: "Vì Switch ở Tầng 2 và Card mạng NIC chỉ đọc được địa chỉ MAC chứ không hiểu địa chỉ IP!",
      detail_vi: "Khi người dùng gõ lệnh `ping 192.168.1.20` hoặc truy cập web, phần mềm ở Tầng 3 biết **Địa chỉ IP Đích**, nhưng khi đẩy gói tin xuống Tầng 2 (Data Link) để đóng khung Ethernet Frame, Card mạng cần phải điền vào ô **Destination MAC Address (48-bit)**. Nếu chưa biết địa chỉ MAC ứng với IP đó là gì, máy tính sẽ tạm cất gói tin IP vào bộ nhớ đệm và kích hoạt giao thức **ARP** để đi hỏi: *'Ai đang giữ địa chỉ IP này thì cho tôi biết địa chỉ MAC của bạn!'*.",
      example_vi: "Nếu máy đích nằm **cùng mạng LAN**, ARP sẽ hỏi xin MAC của chính **IP máy đích đó**; nhưng nếu máy đích nằm ở **khác mạng (ví dụ `8.8.8.8`)**, ARP sẽ hỏi xin MAC của **Default Gateway (Router)**!"
    },
    {
      term: "ARP Request (Broadcast `FF-FF-FF-FF-FF-FF`) vs. ARP Reply (Unicast) & ARP Cache Timer",
      simple_vi: "Quy trình 2 bước của ARP: Bước 1 bắc loa hỏi cả phòng (Broadcast), Bước 2 người có IP đó nhắn riêng trả lời (Unicast).",
      detail_vi: "• **Bước 1: ARP Request (Broadcast)**: Máy gửi đóng một khung tin với **Destination MAC = `FF-FF-FF-FF-FF-FF`** và `EtherType = 0x0806`. Vì là Broadcast nên Switch nhân bản và phát ra tất cả các cổng trong cùng VLAN; mọi máy tính trong LAN đều phải mở khung tin này ra đọc. • **Bước 2: ARP Reply (Unicast)**: Tất cả các máy không trùng IP sẽ im lặng bỏ qua; **chỉ duy nhất 1 máy có địa chỉ IP trùng khớp** mới tạo bản tin ARP Reply chứa địa chỉ MAC của nó và gửi trả riêng (**Unicast**) thẳng về địa chỉ MAC của máy hỏi. • **Bước 3: Lưu vào ARP Cache**: Máy hỏi ghi cặp `[IP <-> MAC]` vào bảng nhớ tạm ARP Cache (trên Windows lưu từ 15–45 giây hoặc tối đa vài phút; trên Router Cisco lưu **4 giờ = 240 phút**).",
      example_vi: "Nhớ kỹ khi đi thi: **ARP Request là Broadcast**, nhưng **ARP Reply là Unicast**!"
    },
    {
      term: "ARP Broadcast Overhead & ARP Spoofing / ARP Poisoning (Tấn công giả mạo ARP)",
      simple_vi: "Hai điểm yếu chí tử của giao thức ARP: Gây nghẽn mạng nếu phát quá nhiều và dễ bị hacker nói dối đánh lừa.",
      detail_vi: "• **Broadcast Overhead**: Nếu cả 500 máy tính trong mạng cùng bật nguồn một lúc và đồng loạt phát ARP Broadcast, toàn bộ băng thông mạng và CPU của các máy sẽ bị chậm lại. • **ARP Spoofing / Poisoning (Đầu độc bảng ARP)**: Vì giao thức ARP hoàn toàn không có bước kiểm tra mật khẩu xác thực, bất kỳ máy tính nào của kẻ tấn công trong mạng LAN cũng có thể tự ý gửi một bản tin **Gratuitous ARP / ARP Reply giả mạo** tuyên bố: *'IP Default Gateway 192.168.1.1 có địa chỉ MAC là laptop của tôi đây!'*. Khi đó, toàn bộ máy tính nhân viên và cả Router đều ghi đè MAC của hacker vào bảng ARP, đẩy toàn bộ dữ liệu mật qua máy hacker (**Man-in-the-Middle Attack**).",
      example_vi: "Để chống tấn công ARP Spoofing triệt để, kỹ sư mạng cấu hình tính năng **Dynamic ARP Inspection (DAI)** trên Switch Cisco."
    },
    {
      term: "ICMPv6 Neighbor Discovery (ND / NDP): Neighbor Solicitation (NS) & Neighbor Advertisement (NA)",
      simple_vi: "Phiên bản tiến hóa thay thế hoàn toàn giao thức ARP trong mạng thế hệ mới IPv6.",
      detail_vi: "Trong mạng IPv6 không còn giao thức ARP rời rạc nữa, mà chức năng tìm địa chỉ MAC được tích hợp gọn vào giao thức **ICMPv6 Neighbor Discovery (ND)** thông qua cặp bản tin: • **1. Neighbor Solicitation (ICMPv6 Type 135 - NS)**: Đóng vai trò giống *ARP Request* — máy gửi hỏi *'Ai có địa chỉ IPv6 này hãy cho tôi xin địa chỉ MAC?'*. Điểm vượt trội là bản tin NS **không dùng Broadcast làm phiền cả mạng**, mà gửi tới địa chỉ **Solicited-Node Multicast (`FF02::1:FFxx:xxxx` - ghép từ 24 bit cuối của địa chỉ IPv6 đích)** nên chỉ đúng chiếc máy đích đó mới phải xử lý! • **2. Neighbor Advertisement (ICMPv6 Type 136 - NA)**: Đóng vai trò giống *ARP Reply* — máy đích trả lời địa chỉ MAC về bằng gói tin **Unicast**.",
      example_vi: "Trong IPv6 ND còn có thêm cặp bản tin thứ hai để máy trạm nói chuyện với Router (phục vụ tự cấp phát IP SLAAC): **Router Solicitation (RS - Máy trạm hỏi Router)** và **Router Advertisement (RA - Router trả lời Prefix /64)**!"
    },
    {
      term: "DAD (Duplicate Address Detection - Phát hiện trùng lặp địa chỉ tự động)",
      simple_vi: "Cơ chế tự kiểm tra xem địa chỉ IP mình định dùng đã có ai trong phòng dùng trước hay chưa.",
      detail_vi: "Trước khi một thiết bị chính thức sử dụng một địa chỉ IPv6 (dù là địa chỉ gán tĩnh bằng tay hay địa chỉ tự sinh qua SLAAC), nó sẽ thực hiện quy trình **DAD**: Thiết bị tự gửi một bản tin **ICMPv6 Neighbor Solicitation (NS)** hỏi chính địa chỉ IPv6 của bản thân nó ra mạng LAN. Nếu chờ một lúc mà **không có ai trả lời**, nghĩa là địa chỉ đó hoàn toàn duy nhất và an toàn để sử dụng; ngược lại, nếu có một máy khác gửi bản tin **NA** trả lời *'Địa chỉ đó tôi đang dùng rồi!'*, thiết bị sẽ lập tức ngừng sử dụng địa chỉ bị trùng đó và báo lỗi **Duplicate Address**.",
      example_vi: "Trong IPv4 hiện đại cũng có cơ chế tương tự gọi là **Gratuitous ARP (GARP)** để phát hiện xung đột địa chỉ IP (`IP Address Conflict`)."
    }
  ]
};

const MODULE_DEEP_GLOSSARY_PART2 = {
  10: [
    {
      term: "Router Interfaces (GigabitEthernet vs. Serial vs. Loopback) & Default `administratively down`",
      simple_vi: "Các loại cổng mạng trên một chiếc Router và lý do tại sao mọi cổng vật lý của Router đều bị tắt sẵn khi mới xuất xưởng.",
      detail_vi: "• **Cổng LAN/WAN Ethernet (`FastEthernet`, `GigabitEthernet Gi0/0/0`)**: Dùng để nối xuống Switch nội bộ hoặc nối cáp quang/cáp đồng ra modem nhà mạng. Mỗi cổng Router là một **Miền Quảng Bá (Broadcast Domain) độc lập** nên hai cổng trên cùng một chiếc Router **không bao giờ được đặt địa chỉ IP thuộc cùng một Subnet**! • **Cổng虚拟 Loopback (`interface loopback 0`)**: Giao diện phần mềm luôn luôn ở trạng thái `up/up` chừng nào Router còn bật điện — dùng làm Router-ID cố định cho OSPF hoặc địa chỉ kiểm tra quản trị. • **Mặc định `administratively down`**: Khác với Switch (các cổng mở sẵn), mọi cổng vật lý của Router mặc định bị khóa bằng lệnh `shutdown` để tránh định tuyến nhầm khi chưa cấu hình xong; bắt buộc phải gõ **`no shutdown`** mới hoạt động.",
      example_vi: "Nếu bạn đặt `Gi0/0/0` là `192.168.1.1/24` rồi sang `Gi0/0/1` đặt `192.168.1.2/24`, Router sẽ báo lỗi từ chối ngay: `% 192.168.1.0 overlaps with GigabitEthernet0/0/0`!"
    },
    {
      term: "`show ip interface brief` — Giải mã 2 cột `Status` (Tầng 1) và `Protocol` (Tầng 2)",
      simple_vi: "Câu lệnh 'bắt mạch' nhanh nhất trên Router và Switch giúp biết ngay cổng nào đang sống, cổng nào đứt cáp hay quên bật.",
      detail_vi: "Trong bảng kết quả của lệnh `show ip interface brief` (và `show ipv6 interface brief`), 2 cột cuối cùng phản ánh chính xác trạng thái của **Tầng 1 (Status)** và **Tầng 2 (Protocol)**: • **1. `administratively down / down`**: Kỹ sư **quên gõ lệnh `no shutdown`** (hoặc chủ động khóa cổng). • **2. `down / down`**: Đã gõ `no shutdown` nhưng **tuột dây cáp, đứt cáp, bấm sai chuẩn cáp, hoặc thiết bị đầu bên kia đang tắt nguồn** (Lỗi Tầng 1 Vật lý). • **3. `up / down`**: Đèn cáp Tầng 1 đã thông nhưng **sai đóng gói giao thức Tầng 2** (ví dụ một đầu cổng Serial chạy HDLC còn đầu kia chạy PPP, hoặc quên gán Clock Rate). • **4. `up / up`**: Cả Tầng 1 và Tầng 2 đều hoạt động hoàn hảo!",
      example_vi: "Đây là câu hỏi kinh điển trong đề thi CCNA: Nhìn thấy `Status = up, Protocol = down` là kết luận ngay lỗi ở **Tầng 2 (Data Link Layer)**!"
    },
    {
      term: "Pipe Filtering Commands (`| section`, `| include`, `| exclude`, `| begin`)",
      simple_vi: "Bốn bộ lọc tìm kiếm siêu tốc giúp kỹ sư không phải cuộn đọc hàng ngàn dòng cấu hình trên màn hình CLI.",
      detail_vi: "Khi gõ các lệnh `show` dài (như `show running-config` hay `show ip route`), bạn có thể thêm dấu gạch đứng **`|`** (Pipe) kèm từ khóa lọc (phân biệt chữ HOA/thường): • **`| include <từ-khóa>`**: Chỉ in ra những dòng đơn lẻ có chứa từ khóa đó (ví dụ `show ip interface brief | include up`). • **`| exclude <từ-khóa>`**: In ra mọi dòng ngoại trừ những dòng chứa từ khóa đó (ví dụ `show ip interface brief | exclude unassigned`). • **`| section <từ-khóa>`**: In ra nguyên cả một khối cấu hình liên quan (ví dụ `show running-config | section line vty`). • **`| begin <từ-khóa>`**: Bắt đầu hiển thị từ dòng đầu tiên khớp từ khóa cho đến hết.",
      example_vi: "Khi đang xem màn hình `--More--` của lệnh `show running-config`: Bấm phím **`Enter`** để xem nhích từng dòng một; bấm phím **`Space` (Dấu cách)** để lật sang trang tiếp theo; bấm phím **`Q`** để thoát ngay lập tức!"
    }
  ],

  11: [
    {
      term: "Network Portion vs. Host Portion, Subnet Mask, Prefix Length (`/n`) & Logical AND Operation",
      simple_vi: "Cấu trúc 2 phần của mọi địa chỉ IPv4 (Phần Mạng + Phần Máy trạm) và phép toán nhân logic AND giúp tìm ra Địa chỉ Mạng.",
      detail_vi: "Một địa chỉ IPv4 dài 32 bit không tự nói lên được đâu là phần Tên Đường (Network Portion), đâu là phần Số Nhà (Host Portion) nếu thiếu đi **Subnet Mask (Mặt nạ mạng - cũng dài 32 bit)**. Trong Subnet Mask, chuỗi các bit **`1` liên tiếp bên trái** đánh dấu **Phần Mạng**, còn chuỗi các bit **`0` liên tiếp bên phải** đánh dấu **Phần Host**. Số lượng bit `1` trong Subnet Mask được viết gọn bằng dấu gạch chéo gọi là **Prefix Length (CIDR)**, ví dụ `255.255.255.0` có 24 bit `1` nên viết gọn là **`/24`**. Router tìm Địa chỉ Mạng (Network Address) bằng phép toán **Logical AND** từng bit giữa IP và Subnet Mask: chỉ khi **`1 AND 1 = 1`**, các trường hợp còn lại (`1 AND 0`, `0 AND 0`) đều bằng **`0`**!",
      example_vi: "Trong bất kỳ mạng con nào cũng luôn có 2 địa chỉ bị trừ đi không được gán cho máy tính (`2^h - 2`): **Địa chỉ đầu tiên** (toàn bộ bit Host = `0`) là **Network Address**; **Địa chỉ cuối cùng** (toàn bộ bit Host = `1`) là **Broadcast Address**!"
    },
    {
      term: "Classful Addressing (Lớp A, B, C, D, E) vs. Classless Addressing (CIDR) & Private vs. Public IPv4 (RFC 1918)",
      simple_vi: "Cách phân chia các lớp địa chỉ IPv4 và sự khác biệt giữa IP Nội bộ miễn phí (Private IP) với IP Công cộng trên Internet (Public IP).",
      detail_vi: "• **5 Lớp địa chỉ truyền thống (Dựa theo Octet đầu tiên)**: **Lớp A** (`1.0.0.0` – `126.255.255.255`, mặc định `/8`, 16 triệu máy/mạng); **Lớp B** (`128.0.0.0` – `191.255.255.255`, mặc định `/16`, 65.534 máy/mạng); **Lớp C** (`192.0.0.0` – `223.255.255.255`, mặc định `/24`, 254 máy/mạng); **Lớp D** (`224.0.0.0` – `239.255.255.255` dành riêng cho **Multicast**); **Lớp E** (`240.0.0.0` – `255.255.255.255` nghiên cứu). • **3 Dải Địa chỉ IP Private nội bộ (Chuẩn RFC 1918 — Bắt buộc thuộc lòng khi thi CCNA)**: **1) `10.0.0.0/8`** (`10.0.0.0` – `10.255.255.255`); **2) `172.16.0.0/12`** (`172.16.0.0` – `172.31.255.255` — *cẩn thận bẫy đề thi cho `172.32.x.x` là IP Public!*); **3) `192.168.0.0/16`** (`192.168.0.0` – `192.168.255.255`). Địa chỉ Private được dùng miễn phí trong mọi mạng LAN nhưng bị các Router ngoài Internet chặn đứng, muốn ra Internet phải dịch sang **Public IP** bằng công nghệ **NAT/PAT**.",
      example_vi: "Ngoài ra còn 3 dải đặc biệt: **Loopback** (`127.0.0.0/8`), **Link-Local APIPA** (`169.254.0.0/16` khi lỗi mất DHCP), và **TEST-NET** (`192.0.2.0/24` dùng làm ví dụ trong sách giáo khoa)."
    },
    {
      term: "FLSM Subnetting (`2^n` Subnets, `2^h - 2` Hosts, Block Size) vs. VLSM (Variable Length Subnet Mask)",
      simple_vi: "Công thức chia mạng con đều nhau (FLSM) và kỹ thuật chia mạng con kích thước linh hoạt theo nhu cầu thực tế (VLSM) để tiết kiệm từng địa chỉ IP.",
      detail_vi: "Khi mượn thêm $n$ bit từ phần Host sang làm phần Mạng (còn lại $h$ bit cho phần Host): • **Số mạng con tạo được** = $2^n$; • **Số máy trạm (Usable Hosts) tối đa trong mỗi mạng con** = $2^h - 2$; • **Bước nhảy giữa các mạng con (Block Size / Magic Number)** = $256 - \text{Giá trị Octet của Subnet Mask}$ (hoặc chính bằng $2^h$ ở Octet thứ 4). • **VLSM (Chia mạng con của mạng con)**: Thay vì chia tất cả các phòng ban bằng nhau (gây lãng phí khi đường nối WAN giữa 2 Router chỉ cần đúng 2 IP mà phải cấp cả một mạng lớn), VLSM cho phép **sắp xếp các mạng theo thứ tự từ nhiều máy nhất xuống ít máy nhất**, chia mạng lớn trước rồi lấy một nhánh chưa dùng đem cắt nhỏ tiếp cho các mạng bé hơn (như `/30` cho đường WAN chỉ chứa đúng $2^2 - 2 = 2$ IP!).",
      example_vi: "Bảng tra nhanh Prefix từ `/24` đến `/30`: `/25` (Mask `.128`, 126 máy); `/26` (`.192`, 62 máy); `/27` (`.224`, 30 máy); `/28` (`.240`, 14 máy); `/29` (`.248`, 6 máy); `/30` (`.252`, 2 máy nối P2P Router)."
    }
  ],

  12: [
    {
      term: "IPv6 Address Types: Unicast (GUA `2000::/3`, LLA `FE80::/10`, ULA `FC00::/7`, Loopback `::1`), Multicast (`FF00::/8`) & Anycast",
      simple_vi: "Bản đồ phân loại toàn bộ các dòng địa chỉ IPv6 dựa vào những chữ số Hex đứng đầu tiên.",
      detail_vi: "Trong IPv6 có **3 kiểu địa chỉ chính** là **Unicast, Multicast và Anycast** (*không có Broadcast!*): • **1. Global Unicast Address (GUA - `2000::/3`, bắt đầu bằng số `2` hoặc `3`, phổ biến nhất là `2001:db8::`)**: Tương đương *Public IPv4*, định tuyến toàn cầu trên Internet. • **2. Link-Local Address (LLA - `FE80::/10`, thường dùng từ `FE80::` đến `FEBF::`)**: Bắt buộc phải có trên mọi cổng bật IPv6; chỉ giao tiếp nội bộ trong cùng 1 nhánh LAN (Router không bao giờ chuyển tiếp gói tin có nguồn/đích là LLA sang mạng khác!) và được dùng làm địa chỉ **Default Gateway** cho các máy trạm. • **3. Unique Local Address (ULA - `FC00::/7` / `FD00::/8`)**: Tương đương *Private IPv4 (RFC 1918)* dùng nội bộ. • **4. Loopback (`::1/128`)** và **Unspecified (`::/128`)**. • **5. Multicast (`FF00::/8`)**: `FF02::1` = Tất cả các máy (All-Nodes, thay thế Broadcast), `FF02::2` = Tất cả các Router (All-Routers). • **6. Anycast**: Một địa chỉ IPv6 gán cho nhiều máy chủ cùng lúc; máy trạm gửi tin sẽ tự động tới chiếc máy chủ nào nằm gần nhất.",
      example_vi: "Nhớ 4 mốc nhận diện ngay lập tức trong đề thi CCNA: Bắt đầu bằng **`2001:`** = **GUA (Global Unicast)**; Bắt đầu bằng **`FE80:`** = **LLA (Link-Local)**; Bắt đầu bằng **`FC00:` / `FD00:`** = **ULA (Private)**; Bắt đầu bằng **`FF02:`** = **Multicast**!"
    },
    {
      term: "IPv6 GUA Structure (48-bit Global Routing Prefix + 16-bit Subnet ID + 64-bit Interface ID) & EUI-64",
      simple_vi: "Cấu trúc 3 phần chuẩn mực của một địa chỉ IPv6 `/64` và cách máy tính tự chế tạo 64 bit cuối từ địa chỉ MAC.",
      detail_vi: "Một địa chỉ IPv6 Global Unicast chuẩn dài 128 bit (8 Hextets) được chia làm 3 phần: • **1. Global Routing Prefix (48 bits đầu = 3 Hextets đầu)**: Do nhà mạng ISP cấp cho doanh nghiệp (ví dụ `2001:0db8:acad`). • **2. Subnet ID (16 bits giữa = Hextet thứ 4)**: Dành riêng cho kỹ sư mạng tự chia thành $2^{16} = 65.536$ mạng con `/64` khác nhau trong công ty (từ `:0000:` đến `:ffff:`). • **3. Interface ID (64 bits cuối = 4 Hextets cuối)**: Tương đương phần Host. Máy tính có thể tự tạo ra 64 bit Interface ID này theo 2 cách: 1) **Chuẩn EUI-64**: Lấy địa chỉ MAC 48-bit cắt làm đôi, chèn **`FFFE` (16 bit)** vào chính giữa, rồi **đảo ngược bit thứ 7 (U/L bit)** của Byte đầu tiên; 2) **Random 64-bit (Mặc định trên Windows hiện đại)**: Tự sinh ngẫu nhiên 64 bit để bảo mật quyền riêng tư không bị lộ mã phần cứng MAC.",
      example_vi: "Ví dụ tính EUI-64 nhanh: MAC là `00-60-2F-3A-07-BC` -> Chèn `FFFE` vào giữa thành `0060:2FFF:FE3A:07BC` -> Hai số đầu `00` (`0000 0000`) đảo bit thứ 7 thành `02` (`0000 0010`) -> Kết quả Interface ID là **`0260:2fff:fe3a:07bc`**!"
    },
    {
      term: "Three Methods of Dynamic IPv6 Assignment: SLAAC vs. Stateless DHCPv6 (SLAAC + DHCPv6) vs. Stateful DHCPv6",
      simple_vi: "Ba phương thức cấp địa chỉ IPv6 tự động được điều khiển bởi 3 cờ hiệu (`A`, `O`, `M`) nằm bên trong bản tin Router Advertisement (RA) của Router.",
      detail_vi: "Khi máy tính bật lên, nó gửi bản tin **RS (Router Solicitation)** tới `FF02::2` hỏi Router; Router trả lời bằng bản tin **RA (Router Advertisement)** về `FF02::1`. Bên trong bản tin RA có 3 cờ quyết định cách máy tính nhận IP: • **Phương pháp 1: SLAAC thuần túy (Mặc định: Cờ `A=1, O=0, M=0`)**: Máy tính lấy toàn bộ thông tin (Prefix `/64` + Default Gateway `FE80::...`) ngay từ bản tin RA của Router và tự ghép Interface ID để thành địa chỉ hoàn chỉnh mà **không cần bất kỳ máy chủ DHCPv6 nào**! • **Phương pháp 2: Stateless DHCPv6 (`A=1, O=1, M=0` — lệnh `ipv6 nd other-config-flag`)**: Máy tính vẫn tự tạo địa chỉ IP qua SLAAC từ Router, nhưng hỏi thêm máy chủ DHCPv6 để xin thông số phụ như **địa chỉ DNS Server và Domain Name**. • **Phương pháp 3: Stateful DHCPv6 (`A=0, M=1` — lệnh `ipv6 nd managed-config-flag`)**: Giống hệt DHCPv4 — Router bảo máy tính không được tự tạo IP bằng SLAAC nữa mà phải đến xin trực tiếp **máy chủ DHCPv6** cấp cho cả địa chỉ IPv6 lẫn DNS và ghi sổ quản lý!",
      example_vi: "Mẹo nhớ cờ RA khi đi thi CCNA: **`A=1, O=0, M=0` = SLAAC Only**; **`O=1` (Other) = Stateless DHCPv6 (Chỉ xin thêm DNS)**; **`M=1` (Managed) = Stateful DHCPv6 (DHCPv6 cấp toàn bộ IP)**!"
    }
  ],

  13: [
    {
      term: "ICMPv4 vs. ICMPv6 Message Types (Echo Request/Reply, Destination Unreachable, Time Exceeded)",
      simple_vi: "Các loại bản tin thông báo và chẩn đoán lỗi cốt lõi của giao thức ICMP trong cả IPv4 và IPv6.",
      detail_vi: "Giao thức **ICMP (Internet Control Message Protocol)** là người trợ lý đắc lực của giao thức IP dùng để kiểm tra kết nối và báo cáo tại sao một gói tin không tới được đích: • **1. Xác nhận kết nối (Host Confirmation - Lệnh `ping`)**: Máy nguồn gửi **ICMP Echo Request (ICMPv4 Type 8 / ICMPv6 Type 128)**; nếu máy đích còn sống và cho phép, nó trả lời về **ICMP Echo Reply (ICMPv4 Type 0 / ICMPv6 Type 129)**. • **2. Không tới được đích (Destination or Service Unreachable - ICMPv4 Type 3 / ICMPv6 Type 1)**: Trong ICMPv4 có 4 mã Code hay thi: `Code 0 = Net Unreachable` (Router không có đường tới mạng đó), `Code 1 = Host Unreachable` (Tới được Router cuối nhưng máy tính đích tắt nguồn không trả lời ARP), `Code 2 = Protocol Unreachable`, `Code 3 = Port Unreachable` (Dịch vụ phần mềm trên Server đang tắt). • **3. Hết thời gian sống (Time Exceeded - ICMPv4 Type 11 / ICMPv6 Type 3)**: Do Router gửi trả về khi giảm trường **TTL (IPv4)** hoặc **Hop Limit (IPv6)** chạm mốc **`0`**.",
      example_vi: "Trong ICMPv6, các mã Code của bản tin *Destination Unreachable* có chút khác biệt cần lưu ý: `Code 0 = No route to destination`, `Code 1 = Communication with destination administratively prohibited` (Bị tường lửa/ACL chặn!), `Code 3 = Address unreachable`, `Code 4 = Port unreachable`."
    },
    {
      term: "Cơ chế hoạt động bên trong của Ping (RTT) & Traceroute / Tracert (Tăng dần TTL = 1, 2, 3...)",
      simple_vi: "Làm sao lệnh `tracert` có thể liệt kê chính xác từng chiếc Router mà gói tin đi qua từ Việt Nam sang tận Mỹ?",
      detail_vi: "• **Ping**: Đo **RTT (Round-Trip Time)** — tổng thời gian đi và về tính bằng mili-giây (`ms`) và tỷ lệ mất gói (% Loss). • **Traceroute (`tracert` trên Windows dùng ICMP Echo; `traceroute` trên Cisco/Linux dùng UDP Port 33434)**: Sử dụng một mẹo cực kỳ thông minh với trường **TTL (Time to Live)**: 1) Đầu tiên, máy gửi bắn ra loạt gói tin thứ nhất cố tình đặt **`TTL = 1`** -> Vừa chạm vào **Router số 1 (Default Gateway)**, TTL bị trừ đi 1 về `0`, buộc Router 1 phải hủy gói và gửi trả về bản tin **ICMP Time Exceeded** (Nhờ địa chỉ IP nguồn của bản tin báo lỗi này, máy tính biết được IP của Trạm 1 và đo được thời gian tới Trạm 1!); 2) Tiếp theo, máy gửi bắn loạt gói thứ hai đặt **`TTL = 2`** -> Vượt qua R1 (còn 1) và chết tại **Router số 2**, thu được IP của Trạm 2; 3) Cứ tăng dần `TTL = 3, 4, 5...` cho đến khi gói tin chạm tới tận máy chủ đích cuối cùng và nhận về **ICMP Echo Reply** (hoặc UDP Port Unreachable) thì dừng lại!",
      example_vi: "Trên mỗi dòng kết quả của lệnh `tracert` luôn hiển thị **3 con số thời gian `ms`** (ví dụ `2 ms   1 ms   1 ms`) vì tại mỗi mức TTL, máy tính gửi đi **3 gói tin thăm dò liên tiếp** để lấy kết quả trung bình chính xác!"
    }
  ],

  14: [
    {
      term: "Transport Layer Responsibilities: Session Multiplexing, Segmentation & Reassembly, Error Recovery, Flow Control",
      simple_vi: "Năm nhiệm vụ sống còn của Tầng 4 (Giao vận) đứng giữa phần mềm ứng dụng (Tầng 7) và mạng đường trục (Tầng 3).",
      detail_vi: "1) **Theo dõi từng cuộc hội thoại (Tracking Individual Conversations)**: Mỗi ứng dụng đang chạy được cấp một số cổng riêng. 2) **Phân đoạn và Ráp nối (Segmentation & Reassembly)**: Chia một file lớn 1GB thành hàng triệu mảnh nhỏ (**Segments**) để nếu bị lỗi trên đường truyền thì chỉ cần gửi lại đúng mảnh nhỏ 1460 Bytes bị rớt chứ không phải gửi lại cả 1GB! Đồng thời giúp **Ghép kênh (Conversation Multiplexing)** — trộn xen kẽ các mảnh của cuộc gọi Zoom, tải file, lướt web đi chung trên 1 sợi dây cáp mà không ai phải đợi ai. 3) **Nhận diện đúng ứng dụng (Port Numbers)**. 4) **Khôi phục lỗi (Error Recovery)** và **Điều khiển luồng (Flow Control)** (chỉ có trên TCP).",
      example_vi: "Nếu không có tính năng Segmentation và Multiplexing ở Tầng 4, khi bạn đang tải một bộ phim dài 2 tiếng, toàn bộ trình duyệt Web và tin nhắn Zalo sẽ bị tê liệt hoàn toàn phải xếp hàng chờ bộ phim tải xong!"
    },
    {
      term: "TCP (Transmission Control Protocol) vs. UDP (User Datagram Protocol) — So sánh cấu trúc Header & Đặc tính",
      simple_vi: "TCP giống như gửi thư bảo đảm có ký nhận từng trang (An toàn 100%, chậm hơn); UDP giống như phát thanh trực tiếp (Nhanh tức thì, rớt gói bỏ qua luôn).",
      detail_vi: "• **TCP (RFC 793 - Giao thức hướng kết nối và Đáng tin cậy)**: Header dài tối thiểu **20 Bytes (160 bits)** chứa đầy đủ: *Source Port (16b), Destination Port (16b), Sequence Number (32b - đánh số thứ tự từng Byte để sắp xếp lại đúng thứ tự ở máy nhận), Acknowledgment Number (32b - báo nhận), Control Bits/Flags (6b: URG, ACK, PSH, RST, SYN, FIN), Window Size (16b - điều khiển luồng), Checksum (16b)*. • **UDP (RFC 768 - Giao thức không kết nối, Nỗ lực tối đa, Độ trễ cực thấp)**: Header siêu nhỏ gọn chỉ đúng **8 Bytes (64 bits)** gồm vỏn vẹn 4 trường: *Source Port (16b), Destination Port (16b), Length (16b), Checksum (16b)*. Các mảnh dữ liệu UDP được gọi là **Datagrams**, đến đích theo thứ tự nào thì giao ngay cho ứng dụng theo thứ tự đó, mất gói không gửi lại.",
      example_vi: "Tại sao giao thức **DNS (Port 53)** và **SNMP** lại dùng UDP thay vì TCP? Vì một câu hỏi tên miền DNS chỉ gói gọn trong 1 gói tin siêu nhỏ — dùng UDP hỏi 1 phát trả lời luôn chỉ tốn **2 gói tin**, trong khi nếu dùng TCP phải mất thêm **3 gói bắt tay + 4 gói đóng kết nối** cực kỳ lãng phí thời gian! *(DNS chỉ chuyển sang dùng TCP Port 53 khi truyền đồng bộ dữ liệu lớn Zone Transfer > 512 Bytes)*."
    },
    {
      term: "TCP 3-Way Handshake (`SYN` -> `SYN-ACK` -> `ACK`) & 4-Step Session Termination (`FIN` -> `ACK` -> `FIN` -> `ACK`)",
      simple_vi: "Quy trình 3 bước bắt tay mở cuộc trò chuyện và 4 bước chào tạm biệt đóng cuộc trò chuyện của giao thức TCP.",
      detail_vi: "• **Mở kết nối (3-Way Handshake)**: 1) Máy khách (Client) gửi gói bật cờ **`SYN`** kèm số thứ tự khởi tạo ngẫu nhiên `SEQ = x` (ví dụ `100`) để xin đồng bộ; 2) Máy chủ (Server) nhận được sẽ bật cả 2 cờ **`SYN + ACK`**, gửi số thứ tự của riêng Server `SEQ = y` (ví dụ `300`) và xác nhận đã nhận của Client bằng cách cộng thêm 1: **`ACK = x + 1` (`101`)**; 3) Client gửi lại gói bật cờ **`ACK`** với `SEQ = 101` và **`ACK = y + 1` (`301`)** -> Phiên kết nối chính thức đạt trạng thái **`ESTABLISHED`**! • **Đóng kết nối (4-Step Termination)**: Vì kết nối TCP là 2 chiều độc lập nên mỗi bên phải tự đóng chiều gửi của mình bằng cặp gói tin: 1) Client gửi **`FIN`**; 2) Server trả lời **`ACK`**; 3) Server gửi **`FIN`**; 4) Client trả lời **`ACK`** (nếu muốn ngắt đột ngột ngay lập tức khi có lỗi hoặc từ chối kết nối thì dùng cờ **`RST - Reset`**).",
      example_vi: "Quy tắc vàng của số báo nhận TCP (`ACK Number`): Giá trị của `ACK` luôn cho biết **'Số thứ tự của Byte TIẾP THEO mà máy nhận đang mong đợi'** (`Expectational ACK = Số Byte đã nhận + 1`)!"
    },
    {
      term: "Sliding WindowSize (Cửa sổ trượt), Congestion Avoidance & Selective Acknowledgment (SACK)",
      simple_vi: "Làm sao TCP gửi được hàng ngàn gói tin nhanh mà không phải dừng lại chờ ký nhận từng gói một?",
      detail_vi: "Nếu cứ gửi 1 gói rồi ngồi chờ 1 gói `ACK` quay về thì đường truyền sẽ cực kỳ chậm. Do đó TCP dùng cơ chế **Sliding Window (Cửa sổ trượt)** thông qua trường **Window Size**: Máy nhận thông báo *'Bộ nhớ đệm của tôi hiện đang trống 10.000 Bytes'* -> Máy gửi được phép bắn liên thanh nhiều gói Segment liên tiếp nhau miễn sao tổng dung lượng chưa vượt quá 10.000 Bytes rồi mới cần nhận 1 gói `ACK` xác nhận chung! Nếu mạng thông suốt, kích thước cửa sổ tự động mở rộng lớn dần; nếu phát hiện có gói bị rớt (nghẽn mạng), máy gửi lập tức **thu nhỏ Window Size lại** để giảm tốc độ truyền (**Congestion Control**).",
      example_vi: "Nếu gói số 3 bị rớt nhưng gói số 4 và 5 vẫn tới đích an toàn, tính năng **SACK (Selective ACK)** giúp máy nhận báo cho máy gửi chỉ cần gửi bù lại đúng gói số 3 mà không phải gửi lại cả gói 4 và 5!"
    },
    {
      term: "Three Port Number Ranges (IANA): Well-Known (`0–1023`), Registered (`1024–49151`) & Dynamic/Private (`49152–65535`)",
      simple_vi: "Ba khoảng số hiệu cổng do tổ chức IANA quy hoạch và cách máy tính chọn cổng Nguồn / cổng Đích.",
      detail_vi: "Số hiệu cổng Tầng 4 dài 16 bit (từ `0` đến `65535`) được chia làm 3 dải: • **1. Well-Known Ports (`0 – 1023`)**: Dành riêng cố định cho các dịch vụ máy chủ phổ biến toàn cầu (`20/21 FTP`, `22 SSH`, `23 Telnet`, `25 SMTP`, `53 DNS`, `67/68 DHCP`, `69 TFTP`, `80 HTTP`, `110 POP3`, `123 NTP`, `143 IMAP`, `161 SNMP`, `443 HTTPS`). • **2. Registered Ports (`1024 – 49151`)**: Cấp cho các phần mềm hãng thứ ba đăng ký (như `1812 RADIUS`, `3306 MySQL`, `3389 Remote Desktop`, `8080 HTTP Proxy`). • **3. Dynamic / Ephemeral Ports (`49152 – 65535`)**: Dải cổng tự do mà hệ điều hành máy khách (Client) **tự động bốc ngẫu nhiên làm Source Port** mỗi khi mở một tab trình duyệt hay ứng dụng mới để nối lên Well-Known Port của Server.",
      example_vi: "Khi bạn mở web `https://google.com`: **Destination Port** luôn cố định là **`443`** (Well-Known Port), còn **Source Port** trên máy tính của bạn sẽ là một con số ngẫu nhiên lớn như **`52418`** (Dynamic Port)!"
    }
  ],

  15: [
    {
      term: "Application, Presentation & Session Layers (Chức năng cụ thể của Tầng 7, Tầng 6 và Tầng 5 trong OSI)",
      simple_vi: "Phân biệt rõ nhiệm vụ của 3 tầng trên cùng trong mô hình OSI trước khi chúng được gộp chung vào Tầng Application của TCP/IP.",
      detail_vi: "• **Tầng 5 - Session Layer (Tầng Phiên)**: Khởi tạo, duy trì và đồng bộ hóa các phiên hội thoại giữa ứng dụng nguồn và đích; nếu cuộc truyền bị gián đoạn giữa chừng, tầng Session giúp khôi phục lại từ điểm đánh dấu (Checkpoint). • **Tầng 6 - Presentation Layer (Tầng Trình diễn)**: Đảm nhiệm 3 công việc liên quan đến định dạng dữ liệu: 1) **Định dạng & Chuyển đổi mã ký tự/hình ảnh/âm thanh** (ASCII, Unicode, `.JPEG`, `.GIF`, `.PNG`, `.MP4`, `.MP3`); 2) **Nén dữ liệu (Data Compression)** để giảm dung lượng truyền; 3) **Mã hóa dữ liệu (Encryption như SSL/TLS)**. • **Tầng 7 - Application Layer (Tầng Ứng dụng)**: Chứa các **Giao thức dịch vụ mạng** (HTTP, DNS, DHCP, SMTP, FTP) giao tiếp trực tiếp với phần mềm người dùng.",
      example_vi: "Lưu ý: Bản thân trình duyệt Google Chrome hay phần mềm Microsoft Word **KHÔNG phải** là Tầng 7, mà giao thức **`HTTP/HTTPS`** nằm bên dưới trình duyệt Chrome mới là giao thức của Tầng 7!"
    },
    {
      term: "HTTP (Port 80) vs. HTTPS (Port 443) & Các phương thức HTTP (`GET`, `POST`, `PUT`, `DELETE`)",
      simple_vi: "Giao thức tải trang Web chữ rõ (HTTP) và phiên bản mã hóa an toàn có biểu tượng ổ khóa (HTTPS).",
      detail_vi: "Khi bạn nhập địa chỉ URL vào trình duyệt: • **`GET`**: Yêu cầu lấy dữ liệu từ Web Server về hiển thị (tải trang HTML, hình ảnh). • **`POST`**: Gửi dữ liệu mới từ trình duyệt lên Server (như bấm nút Đăng nhập gửi Username/Password, gửi biểu mẫu bình luận). • **`PUT`**: Tải lên hoặc cập nhật toàn bộ một tài nguyên trên Server. • **`DELETE`**: Yêu cầu xóa một tài nguyên trên Server. Vì `HTTP` (TCP Port 80) truyền toàn bộ mật khẩu dạng chữ rõ rất nguy hiểm, mọi website hiện đại đều chuyển sang **`HTTPS` (TCP Port 443)** kết hợp mã hóa **TLS/SSL**.",
      example_vi: "Các mã trạng thái trả về của HTTP Server rất quan trọng khi làm việc với Web/API: **`200 OK`** (Thành công), **`301/302`** (Chuyển hướng Redirect), **`403 Forbidden`** (Cấm quyền truy cập), **`404 Not Found`** (Không tìm thấy trang), **`500 Internal Server Error`** (Lỗi phía máy chủ)."
    },
    {
      term: "DNS Hierarchy (Cấu trúc phân cấp tên miền), Các loại bản ghi (`A`, `AAAA`, `MX`, `NS`, `CNAME`) & `nslookup`",
      simple_vi: "Cuốn danh bạ toàn cầu tự động dịch tên miền dễ nhớ (`google.com`) sang địa chỉ IP số học (`142.250.x.x`).",
      detail_vi: "Hệ thống máy chủ DNS trên toàn thế giới được tổ chức theo hình cây phân cấp từ trên xuống: **Root Servers (`.`)** -> **Top-Level Domain Servers (TLD như `.com`, `.org`, `.vn`)** -> **Second-Level / Authoritative Servers (`cisco.com`)**. Các bản ghi tài nguyên (**Resource Records**) lưu trong máy chủ DNS gồm: • **`A` Record**: Ánh xạ Tên miền $\rightarrow$ Địa chỉ **IPv4**; • **`AAAA` (Quad-A) Record**: Ánh xạ Tên miền $\rightarrow$ Địa chỉ **IPv6** (dài gấp 4 lần IPv4 nên gồm 4 chữ A!); • **`MX` (Mail Exchange)**: Chỉ định máy chủ nhận thư điện tử Email cho tên miền đó; • **`NS` (Name Server)**: Chỉ định máy chủ DNS có thẩm quyền quản lý vùng tên miền; • **`CNAME` (Canonical Name)**: Tạo tên bí danh (Alias) trỏ sang một tên miền khác; • **`PTR` (Pointer)**: Phân giải ngược từ Địa chỉ IP ra Tên miền.",
      example_vi: "Trên Windows, gõ `ipconfig /displaydns` để xem bộ nhớ đệm DNS Cache đang lưu trong máy, và gõ `ipconfig /flushdns` để xóa sạch bộ nhớ đệm DNS khi website vừa đổi địa chỉ IP mới!"
    },
    {
      term: "DHCPv4 4-Step DORA Process (`Discover` -> `Offer` -> `Request` -> `ACK`) & Lease Renewal",
      simple_vi: "Bốn bước thương lượng tự động để một chiếc máy tính vừa bật nguồn xin được trọn bộ địa chỉ IP từ máy chủ DHCP.",
      detail_vi: "Quy trình 4 bước viết tắt là **D-O-R-A** (sử dụng cổng **UDP 68** ở phía Client và **UDP 67** ở phía Server): • **1. `DHCPDISCOVER` (Broadcast)**: Máy trạm vừa bật lên chưa có IP (`Src IP = 0.0.0.0`, `Dst IP = 255.255.255.255`) bắc loa hỏi khắp mạng LAN *'Có máy chủ DHCP nào ở đây không?'*. • **2. `DHCPOFFER` (Unicast hoặc Broadcast)**: Các máy chủ DHCP trả lời đề nghị cho thuê 1 địa chỉ IP đang rảnh kèm Subnet Mask và thời hạn thuê (Lease time). • **3. `DHCPREQUEST` (Luôn là Broadcast!)**: Tại sao bước 3 biết tên máy chủ rồi mà vẫn phải phát **Broadcast**? Vì trong mạng có thể có 2–3 máy chủ DHCP cùng gửi lời mời ở bước 2; máy trạm phát Broadcast bước 3 để vừa báo *'Tôi đồng ý nhận IP của Server A'*, vừa báo cho các Server B, C biết để **thu hồi lại các IP đã đề nghị**! • **4. `DHCPACK` (Unicast/Broadcast)**: Máy chủ xác nhận chính thức bàn giao IP!",
      example_vi: "Câu hỏi bẫy đề thi CCNA: Ở bước 1 (`Discover`) và bước 3 (`Request`), các bản tin do Client gửi đi **luôn luôn là Broadcast (`255.255.255.255`)**!"
    },
    {
      term: "Email Protocols (`SMTP` Port 25 vs. `POP3` Port 110 vs. `IMAP` Port 143) & File Sharing (`FTP` 20/21, `TFTP` 69, `SMB` 445)",
      simple_vi: "Sự khác biệt giữa giao thức Gửi thư (SMTP) với 2 giao thức Nhận thư (POP3 / IMAP), và các giao thức chia sẻ file.",
      detail_vi: "• **Trong hệ thống Email**: 1) **`SMTP` (Simple Mail Transfer Protocol - TCP Port 25)**: Chỉ dùng để **GỬI thư** từ máy người dùng lên Mail Server và chuyển tiếp thư giữa các Mail Server với nhau; 2) **`POP3` (Post Office Protocol v3 - TCP Port 110)**: Tải thư từ Server về máy tính cá nhân xong thì **mặc định xóa luôn bức thư gốc trên Server** (không đồng bộ được giữa điện thoại và laptop); 3) **`IMAP` (Internet Message Access Protocol - TCP Port 143)**: Giữ nguyên thư gốc trên Server, cho phép người dùng đọc và **đồng bộ hóa trạng thái thư/thư mục trên nhiều thiết bị cùng lúc**. • **Chia sẻ File**: **`FTP`** dùng 2 cổng TCP (**Port 21** thiết lập lệnh điều khiển, **Port 20** truyền nội dung file); **`TFTP` (UDP Port 69)** không cần đăng nhập mật khẩu, cực nhẹ dùng để chép hệ điều hành IOS và cấu hình trên Switch/Router; **`SMB` (Server Message Block - TCP Port 445)** dùng để chia sẻ thư mục và máy in trong mạng LAN Windows (`\\\\192.168.1.100\\Share`).",
      example_vi: "Khi đi thi CCNA gặp câu hỏi: *'Nhân viên muốn đọc email công ty trên cả iPhone, iPad lẫn Laptop ở nhà và thấy cùng một hộp thư đồng bộ'* -> Chọn ngay đáp án **`IMAP`**!"
    }
  ],

  16: [
    {
      term: "Threat, Vulnerability, Exploit, Mitigation & 4 Nhóm Tấn Công Mạng (Reconnaissance, Access, DoS/DDoS, Social Engineering)",
      simple_vi: "Bốn khái niệm cơ bản của an ninh mạng và 4 kiểu tấn công mà hacker thường sử dụng nhất.",
      detail_vi: "• **Threat (Mối đe dọa)**: Bất kỳ nguy cơ tiềm ẩn nào (hacker, thiên tai, nhân viên bất mãn); **Vulnerability (Lỗ hổng)**: Điểm yếu trong phần mềm hoặc cấu hình (như dùng Telnet không mã hóa); **Exploit (Khai thác)**: Công cụ/hành động tấn công vào lỗ hổng đó; **Mitigation (Giảm thiểu)**: Biện pháp vá lỗi và phòng chống. • **4 Kiểu tấn công**: 1) **Reconnaissance (Do thám/Trinh sát)**: Quét mạng tìm IP sống và cổng mở (`ping sweep`, `port scan` bằng Nmap, nghe lén gói tin bằng Wireshark); 2) **Access Attacks (Tấn công giành quyền truy cập)**: Dò mật khẩu Brute-force, Man-in-the-Middle, giả mạo IP/MAC; 3) **DoS / DDoS (Từ chối dịch vụ phân tán)**: Huy động hàng vạn máy tính ma (**Botnet / Zombies**) bắn lưu lượng rác làm tê liệt máy chủ hợp pháp; 4) **Social Engineering (Kỹ nghệ xã hội — Phishing, Vishing, Tailgating, Baiting)**: Đánh lừa tâm lý con người để họ tự tiết lộ mật khẩu.",
      example_vi: "Biện pháp chống nghe lén gói tin (Packet Sniffing) hiệu quả nhất là **Mã hóa toàn bộ lưu lượng truyền trên dây (dùng SSH thay cho Telnet, HTTPS thay cho HTTP, và IPsec VPN)**!"
    },
    {
      term: "Malware (Virus, Worm, Trojan Horse, Ransomware, Spyware, Adware, Rootkit)",
      simple_vi: "Phân loại các dòng phần mềm độc hại nguy hiểm nhất hiện nay.",
      detail_vi: "• **Virus**: Gắn vào file chương trình, cần **con người bấm chạy file** mới kích hoạt và lây lan. • **Worm (Sâu mạng)**: Nguy hiểm nhất đối với hạ tầng mạng vì nó **tự động quét lỗ hổng và tự nhân bản lây lan qua mạng từ máy này sang máy khác mà KHÔNG CẦN con người bấm chạy**, làm nghẽn toàn bộ băng thông Router/Switch! • **Trojan Horse**: Phần mềm gián điệp đội lốt phần mềm hợp pháp để mở cửa hậu (Backdoor). • **Ransomware (Mã độc tống tiền)**: Tự động mã hóa khóa chặt toàn bộ dữ liệu ổ cứng của nạn nhân và đòi tiền chuộc bằng tiền điện tử Bitcoin.",
      example_vi: "Câu hỏi phân biệt kinh điển trong đề thi CCNA: *'Loại mã độc nào tự lây lan qua mạng bằng cách khai thác lỗ hổng mà không cần sự tương tác của người dùng?'* -> Đáp án: **Worm (Sâu máy tính)**!"
    },
    {
      term: "Defense-in-Depth (Phòng thủ chiều sâu): Firewall, IPS/IDS, ESA/WSA & AAA (RADIUS / TACACS+)",
      simple_vi: "Hệ thống các lớp khiên bảo vệ xếp chồng lên nhau trong một mạng doanh nghiệp chuẩn quốc tế.",
      detail_vi: "• **Firewall (Tường lửa - như Cisco ASA / Firepower)**: Đặt ở biên mạng, sử dụng cơ chế **Stateful Packet Inspection** (ghi nhớ các kết nối từ trong LAN đi ra để chỉ cho phép các gói tin trả lời tương ứng từ Internet quay vào, chặn đứng mọi kết nối lạ tự ý từ ngoài Internet chọc vào). • **IDS vs. IPS**: *IDS (Intrusion Detection System)* chỉ phát hiện và báo động; còn **IPS (Intrusion Prevention System)** nằm trực tiếp trên luồng dây cáp để **chặn và cắt đứt gói tin chứa mã độc ngay tức khắc**. • **ESA (Email Security Appliance)** lọc thư rác Phishing/Malware; **WSA (Web Security Appliance)** chặn nhân viên vào các trang web độc hại. • **AAA Server (RADIUS / TACACS+)**: Máy chủ quản lý tài khoản tập trung kiểm soát *Authentication* (Xác thực), *Authorization* (Phân quyền) và *Accounting* (Ghi nhật ký).",
      example_vi: "Khu vực mạng trung gian nằm giữa Internet và mạng nội bộ dùng để đặt các máy chủ công cộng (như Web Server của công ty) được gọi là vùng **DMZ (Demilitarized Zone - Vùng phi quân sự)**."
    },
    {
      term: "Cisco Device Hardening: Password Policy, `login block-for` (Chống Brute-Force), `exec-timeout` & SSH v2",
      simple_vi: "Các câu lệnh gia cố bảo mật bắt buộc phải gõ trên mọi chiếc Router và Switch thực tế để chống hacker dò mật khẩu.",
      detail_vi: "• **`security passwords min-length 10`**: Ép buộc mọi mật khẩu tạo trên máy phải dài tối thiểu 10 ký tự. • **`login block-for 120 attempts 3 within 60`**: Nếu có kẻ thử đăng nhập sai mật khẩu quá **3 lần trong vòng 60 giây**, Router sẽ **tự động khóa cổng đăng nhập trong 120 giây** (chống tấn công dò mật khẩu tự động Brute-Force!). • **`exec-timeout 5 0`** (trong `line con 0` và `line vty 0 4`): Nếu kỹ sư đang cấu hình mà đứng dậy đi uống cà phê quên thoát máy quá **5 phút 0 giây**, thiết bị tự động đăng xuất để người lạ đi ngang qua không phá hoại được. • **5 bước bật SSH v2**: `hostname` -> `ip domain-name` -> `crypto key generate rsa` (2048-bit) -> `username ... secret ...` -> `line vty 0 4` (`login local` + `transport input ssh`).",
      example_vi: "Tuyệt đối không dùng lệnh `transport input all` trên cổng VTY vì nó vẫn mở cửa cho giao thức không mã hóa Telnet (Port 23); phải dùng **`transport input ssh`**!"
    }
  ],

  17: [
    {
      term: "Small Network Design, Redundancy, Traffic Prioritization & Network Baseline (Đường cơ sở hiệu năng mạng)",
      simple_vi: "Cách thiết kế một mạng doanh nghiệp nhỏ ổn định và tại sao phải đo đạc thông số mạng lúc bình thường làm chuẩn đối chiếu.",
      detail_vi: "Khi thiết kế mạng nhỏ, kỹ sư phải chọn thiết bị có đủ số cổng dự phòng tăng trưởng (Scalability), hỗ trợ cấp nguồn PoE cho điện thoại IP/Wi-Fi, và phân loại ưu tiên lưu lượng (QoS: Voice ở mức ưu tiên cao nhất, sau đó đến Video, giao dịch tài chính, và cuối cùng là lướt web/tải file). Đặc biệt, sau khi lắp đặt mạng xong, kỹ sư phải đo **Network Baseline (Đường cơ sở hiệu năng)**: Chụp lại kết quả thời gian phản hồi `ping`, mức tải CPU (`show processes cpu`), bộ nhớ RAM và lưu lượng băng thông vào cả giờ cao điểm lẫn giờ thấp điểm trong nhiều ngày để làm **thước đo chuẩn** khi mạng gặp sự cố chậm bất thường trong tương lai.",
      example_vi: "Để lập Network Baseline đơn giản trên Windows và Cisco IOS, kỹ sư copy kết quả của các lệnh `ping`, `tracert`, `show interfaces`, `show arp`, `show ip route` vào file văn bản theo từng mốc thời gian."
    },
    {
      term: "7-Step Troubleshooting Process & 3 Phương Pháp Bắt Bệnh Mạng (Top-Down, Bottom-Up, Divide-and-Conquer)",
      simple_vi: "Quy trình chuẩn quốc tế khi đi sửa mạng bị sập: Nên kiểm tra từ dây cáp đi lên, từ phần mềm đi xuống, hay đứng ở giữa (Tầng 3) chẻ đôi?",
      detail_vi: "Khi người dùng báo mất mạng, kỹ sư chuyên nghiệp áp dụng 1 trong 3 phương pháp tiếp cận theo mô hình OSI: • **1. Bottom-Up (Từ dưới lên — Tầng 1 $\rightarrow$ Tầng 7)**: Kiểm tra dây cáp mạng, đèn LED cổng Switch trước rồi mới kiểm tra MAC, IP, Phần mềm (phù hợp khi chỉ có 1 máy bị mất mạng hoàn toàn). • **2. Top-Down (Từ trên xuống — Tầng 7 $\rightarrow$ Tầng 1)**: Kiểm tra trình duyệt web, DNS, phần mềm trước (phù hợp khi người dùng vẫn vào được Zalo nhưng không mở được 1 trang web nội bộ). • **3. Divide-and-Conquer (Chia để trị — Nhanh nhất trong thực tế!)**: Bắt đầu ngay tại **Tầng 3 bằng lệnh `ping <IP-Đích>`**: Nếu `ping` bằng IP **thành công**, chứng tỏ Tầng 1, 2, 3 đã tốt 100%, chỉ cần tìm lỗi ở Tầng 4–7 (như lỗi DNS); nếu `ping` **thất bại**, mới quay xuống kiểm tra Tầng 1, 2, 3!",
      example_vi: "Ví dụ kinh điển: Máy tính gõ `ping 8.8.8.8` thông 100%, nhưng mở trình duyệt gõ `google.com` báo lỗi -> Theo phương pháp *Divide-and-Conquer*, Tầng 1–3 đã thông suốt, lỗi nằm ở Tầng 7 (**Sai hoặc thiếu địa chỉ DNS Server**)!"
    },
    {
      term: "CDP (Cisco Discovery Protocol) vs. LLDP (Link Layer Discovery Protocol - IEEE 802.1AB)",
      simple_vi: "Hai giao thức 'hỏi thăm hàng xóm' ở Tầng 2 giúp kỹ sư biết đầu kia của sợi dây cáp đang cắm vào thiết bị tên gì, cổng số mấy và có IP bao nhiêu.",
      detail_vi: "• **CDP (Giao thức độc quyền của Cisco — Mặc định bật sẵn trên mọi thiết bị Cisco)**: Cứ mỗi 60 giây, các thiết bị Cisco gửi khung tin quảng bá Tầng 2 cho các thiết bị Cisco nối trực tiếp với nó. Gõ **`show cdp neighbors`** cho biết: Tên hàng xóm (*Device ID*), Cổng của máy mình (*Local Interface*), Cổng của máy hàng xóm (*Port ID*) và Dòng máy (*Platform*). Gõ **`show cdp neighbors detail`** cho biết thêm hai thông tin quý giá là **Địa chỉ IP của hàng xóm** và **Phiên bản IOS**! • **LLDP (Chuẩn mở quốc tế IEEE 802.1AB)**: Hoạt động tương tự CDP nhưng dùng được cho cả thiết bị Cisco lẫn HP, Juniper, Aruba (bật bằng lệnh `lldp run`, xem bằng `show lldp neighbors detail`).",
      example_vi: "Vì lý do an ninh mạng (tránh hacker cắm laptop vào cổng mạng rồi bật phần mềm nghe lén gói CDP để biết hết địa chỉ IP và phiên bản IOS của Router), kỹ sư luôn tắt CDP trên các cổng nối ra ngoài Internet hoặc cổng người dùng bằng lệnh `no cdp enable` (tắt trên 1 cổng) hoặc `no cdp run` (tắt toàn máy)!"
    },
    {
      term: "Các lỗi Tầng 1, Tầng 2, Tầng 3 phổ biến nhất trong thực tế & Cách đọc bộ đếm lỗi `show interfaces`",
      simple_vi: "Cách nhìn vào con số thống kê trong lệnh `show interfaces` để biết dây cáp bị nhiễu, lệch Duplex hay sai cấu hình IP.",
      detail_vi: "Khi gõ lệnh `show interfaces gigabitEthernet 0/0/0`, hãy nhìn vào các bộ đếm lỗi ở nửa dưới: • **Runts**: Khung tin nhỏ hơn 64 Bytes — nguyên nhân do **đụng độ tín hiệu (Collision / Lệch Half-Duplex)**. • **Giants**: Khung tin lớn hơn 1518 Bytes. • **CRC / Input Errors**: Mã kiểm lỗi FCS ở đuôi khung bị sai — nguyên nhân do **dây cáp mạng kém chất lượng, lỏng đầu RJ-45, bị nhiễu điện từ EMI nặng hoặc lệch chế độ Duplex (Duplex Mismatch)**. • **Late Collisions**: Đụng độ xảy ra sau khi đã truyền quá 64 Bytes đầu tiên — dấu hiệu đặc trưng của việc **1 đầu cáp để Full-Duplex còn đầu kia để Half-Duplex** (hoặc dây cáp dài quá 100 mét)!",
      example_vi: "Khi máy tính nhân viên không ra được mạng, hãy kiểm tra 3 lỗi cấu hình IP hay gặp nhất: 1) Đặt trùng IP với máy khác; 2) Đặt **Default Gateway sai địa chỉ hoặc khác Subnet**; 3) Cổng Switch gắn nhầm **VLAN**!"
    }
  ]
};

Object.assign(MODULE_DEEP_GLOSSARY, MODULE_DEEP_GLOSSARY_PART2);


// Bổ sung Kiến Thức Thực Tế Đa Hãng & Thiết Bị Ngoại Vi Văn Phòng Hiện Đại vào Từ Điển Chuyên Sâu của các Học Phần
const MODULE_MULTI_VENDOR_AND_OFFICE_DEVICES = {
  1: [
    {
      term: "Hệ sinh thái Thiết bị Đầu cuối Văn phòng Thực tế: Máy in Màn hình LCD (MFP), Máy Scan Mạng, Máy in Bill (POS), Điện thoại bàn IP & Camera PoE",
      simple_vi: "Trong công ty thật, thiết bị đầu cuối (End Devices) không chỉ có máy tính PC và Laptop như trên hình vẽ sách giáo khoa, mà còn có Máy photocopy/máy in màn hình cảm ứng, Máy scan tài liệu, Máy in hóa đơn (in bill) quầy thu ngân, Điện thoại bàn IP, Máy chấm công khuôn mặt/vân tay và Camera an ninh PoE.",
      detail_vi: "• **1) Máy in đa năng có màn hình hiển thị (Network MFP — Ricoh, Canon, Xerox, HP)**: Bắt buộc phải bấm trên màn hình cảm ứng LCD để đặt **IP Tĩnh (Static IP)** và cài trên máy tính qua cổng **`Standard TCP/IP Port (RAW Port 9100)`** (không dùng WSD để tránh lỗi báo Offline ảo). • **2) Máy Scan mạng (Network Scanner)**: Cấu hình tính năng **Scan-to-Folder (giao thức SMB Port `445`)** đẩy thẳng file PDF vừa quét về thư mục chia sẻ trên máy tính nhân viên, hoặc **Scan-to-Email (SMTP Port `587`)**. • **3) Máy in Bill nhiệt mạng LAN (POS Receipt Printer)**: Không có màn hình hiển thị; muốn biết IP hiện tại phải **Tắt nguồn → Nhấn giữ nút `FEED` → Bật nguồn giữ 3 giây** để máy tự in ra phiếu `Self-Test` ghi rõ địa chỉ IP (luôn dùng dây LAN và IP tĩnh cổng `9100`). • **4) Điện thoại bàn IP Phone (Cisco, Yealink, Grandstream)**: Mặt đế có 2 cổng mạng RJ-45 gồm cổng **`SW/LAN` (nhận điện PoE từ Switch)** và cổng **`PC` (chia sẻ đường mạng nối sang máy tính của nhân viên)**, quản lý số máy lẻ SIP (`Port 5060`) qua giao diện Web của điện thoại.",
      example_vi: "Khi thiết kế mạng cho một văn phòng hoặc chuỗi cửa hàng, kỹ sư luôn dành riêng một dải IP tĩnh (ví dụ `.200` đến `.250`) cho Máy in MFP, Máy Scan, Máy in Bill POS và Máy chấm công (Port `4370`)."
    },
    {
      term: "Quản lý & Hỗ trợ Từ xa Máy tính Nhân viên (Remote Desktop RDP, UltraViewer/AnyDesk, Active Directory GPO & Wake-on-LAN)",
      simple_vi: "Cách kỹ sư IT ngồi tại chỗ điều khiển màn hình, cài đặt phần mềm, sửa lỗi máy in và bật nguồn từ xa cho hàng trăm máy tính nhân viên trong công ty mà không cần chạy bộ tới từng bàn.",
      detail_vi: "• **Điều khiển màn hình trực tiếp**: Dùng **Microsoft Remote Desktop (`mstsc` — TCP Port `3389`)**, **VNC (`Port 5900`)**, hoặc **UltraViewer / AnyDesk / RustDesk**. • **Quản trị tập trung bằng Windows Active Directory (Domain & GPO)**: Đưa máy tính nhân viên vào tên miền công ty (`Join Domain`) để tự động cài máy in, ánh xạ ổ đĩa mạng chung (`Map Network Drive`) và áp đặt chính sách bảo mật từ máy chủ. • **Bật máy tính đang tắt nguồn từ xa bằng `Wake-on-LAN (WoL)`**: Gửi gói tin đặc biệt **`Magic Packet` (UDP Port `7` hoặc `9` chứa 16 lần địa chỉ MAC của máy tính)** để đánh thức card mạng kích nguồn bật máy tính nhân viên từ xa.",
      example_vi: "Nhân viên đi công tác quên tài liệu trong máy tính để bàn đã tắt nguồn ở công ty: IT dùng lệnh Wake-on-LAN trên Switch/Router bắn gói tin vào địa chỉ MAC của máy đó để bật máy lên, sau đó nhân viên VPN về công ty và Remote Desktop (`Port 3389`) vào lấy file!"
    }
  ],
  2: [
    {
      term: "Quản trị Switch Đa Hãng Bằng Giao Diện Đồ Họa Web (Web GUI / Cloud) — HPE Aruba, Cisco CBS, TP-Link Omada & Ubiquiti UniFi",
      simple_vi: "Không phải Switch nào đi làm cũng bắt gõ lệnh đen trắng CLI! Các dòng Switch doanh nghiệp hiện đại như HPE Aruba, Cisco Business (CBS), TP-Link Omada hay UniFi đều có Giao diện Web trực quan (Web GUI) và Quản lý qua Đám mây (Cloud).",
      detail_vi: "Khi đăng nhập vào địa chỉ `https://<IP-Switch>` trên trình duyệt Web của **Switch HPE Aruba (như dòng Aruba Instant On 1930/1960 hoặc Aruba CX)**, bạn sẽ thấy hình ảnh trực quan của 24/48 cổng mạng: • Cổng nào đang cắm dây hiện màu xanh lá kèm tốc độ `1000Mbps Full-Duplex`; • Cổng nào đang cấp nguồn điện PoE cho Wi-Fi/Camera/IP Phone hiện số Watt tiêu thụ; • Tạo và gán VLAN chỉ bằng thao tác click chuột chọn **`U` (Untagged — cổng cắm PC)** hoặc **`T` (Tagged — cổng nối Trunk)**; • Có sẵn tính năng **Test đứt cáp (Cable Diagnostic TDR)** và bật **Loop Protection** chống nhân viên cắm nhầm dây gây sập mạng chỉ bằng 1 cú nhấp chuột!",
      example_vi: "Trong các khách sạn, chuỗi bán lẻ, văn phòng vừa và nhỏ, kỹ sư quản lý toàn bộ Switch HPE Aruba và bộ phát Wi-Fi từ xa ngay trên ứng dụng điện thoại hoặc Web Cloud Portal mà không cần cắm dây Console."
    }
  ],
  7: [
    {
      term: "Sự khác biệt sống còn về thuật ngữ VLAN & Bó cáp giữa Switch Cisco (Access/Trunk/EtherChannel) và Switch HPE Aruba (Untagged/Tagged/Trunk)",
      simple_vi: "Cảnh báo cực kỳ quan trọng khi đi làm thực tế: Chữ 'Trunk' trên Switch HPE Aruba/HP có nghĩa hoàn toàn khác với chữ 'Trunk' trên Switch Cisco!",
      detail_vi: "• **Trên Switch Cisco**: Cổng nối ra máy tính gọi là **`Access Port`**; cổng nối giữa 2 Switch chở nhiều VLAN gọi là **`Trunk Port`**; còn tính năng bó nhiều cổng vật lý thành 1 đường lớn gọi là **`EtherChannel (Port-channel)`**. • **Trên Switch HPE Aruba / HP ProCurve**: Chữ **`Trunk (Trk1, Trk2)`** lại dùng để chỉ **Gom nhóm nhiều cổng vật lý (LACP Link Aggregation — tương đương EtherChannel của Cisco)**! Còn để cấu hình VLAN trên giao diện Web GUI hoặc CLI của Aruba, người ta dùng 2 chữ: **`Untagged (U)`** *(tương đương cổng Access hoặc Native VLAN — gói tin đi ra không gắn thẻ)* và **`Tagged (T)`** *(tương đương các VLAN đi trên đường Trunk 802.1Q — gói tin đi qua được gắn thẻ 4-byte Tag)*!",
      example_vi: "Trên Web GUI của Switch HPE Aruba: Nếu cổng số 1 cắm máy tính Kế toán (VLAN 10), bạn chọn `VLAN 10 = Untagged (U)`. Nếu cổng số 24 nối lên Router chở cả VLAN 10 và VLAN 20, bạn chọn ở cổng 24: `VLAN 1 = Untagged (U)`, `VLAN 10 = Tagged (T)`, `VLAN 20 = Tagged (T)`."
    }
  ],
  10: [
    {
      term: "Thực tế Cấu hình Router Đa Hãng (MikroTik, DrayTek Vigor, FortiGate): Bridge Mode Modem Nhà mạng, Quay số PPPoE & Gộp băng thông Multi-WAN",
      simple_vi: "Cách các kỹ sư mạng tại Việt Nam kết nối đường truyền cáp quang Viettel/VNPT/FPT vào Router chuyên dụng của công ty và gộp nhiều đường mạng Internet để không bao giờ bị mất mạng.",
      detail_vi: "• **1) Bridge Mode + PPPoE Client**: Cục Modem quang GPON do nhà mạng tặng miễn phí chỉ chịu tải được khoảng 15–20 thiết bị. Khi lắp mạng cho công ty, kỹ sư luôn gọi tổng đài nhà mạng chuyển cục Modem đó sang chế độ **Bridge Mode (Cầu nối thuần túy)**, rồi dùng Router chịu tải cao (**MikroTik RouterBOARD quản lý bằng phần mềm WinBox/WebFig, DrayTek Vigor, FortiGate hoặc Cisco ISR**) cấu hình **`PPPoE Client`** (nhập Username/Password đường truyền) để Router công ty trực tiếp nắm giữ địa chỉ **IP Public**. • **2) Cân bằng tải nhiều đường truyền (`Multi-WAN Load Balancing & Failover`)**: Cắm 2 đường cáp quang của 2 nhà mạng khác nhau (VD: WAN1 Viettel + WAN2 VNPT) vào Router để vừa cộng gộp tốc độ, vừa tự động chuyển mạch dự phòng trong 1 giây khi 1 nhà mạng bị đứt cáp.",
      example_vi: "Trên Router MikroTik (dùng công cụ đồ họa WinBox) hoặc DrayTek Web GUI, kỹ sư còn dễ dàng giới hạn băng thông từng máy, chặn mạng xã hội giờ làm việc và tạo VPN cho nhân viên làm việc từ xa."
    }
  ]
};

Object.keys(MODULE_MULTI_VENDOR_AND_OFFICE_DEVICES).forEach((idStr) => {
  const id = Number(idStr);
  if (MODULE_DEEP_GLOSSARY[id] && Array.isArray(MODULE_DEEP_GLOSSARY[id])) {
    MODULE_DEEP_GLOSSARY[id] = MODULE_DEEP_GLOSSARY[id].concat(MODULE_MULTI_VENDOR_AND_OFFICE_DEVICES[id]);
  }
});
