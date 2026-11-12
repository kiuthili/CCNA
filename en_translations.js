// ==============================================================================
// CCNA 200-301 Comprehensive English Translation Dictionary
// Provides 100% fluent English translations for Quizzes, Comparison Tables,
// Job Skills, Labs, and Exam Mastery domains.
// ==============================================================================

const CCNA_QUIZ_EN = {
  1: [
    {
      question_en: "Question 1 (CCNA Exam): An enterprise wants to ensure that when employees place VoIP calls or conduct video conferences, the audio and video stream smoothly without stuttering or latency, even when heavy file transfers are occurring simultaneously. Which network architecture characteristic directly addresses this requirement?",
      options_en: [
        "A. Fault Tolerance",
        "B. Scalability",
        "C. Quality of Service (QoS)",
        "D. Confidentiality"
      ],
      answerIndex: 2,
      explanation_en: "Correct answer is C (Quality of Service - QoS). QoS classifies traffic and places latency-sensitive packets (such as real-time Voice and Video) into Priority Queues so Routers/Switches transmit them before best-effort background data transfers."
    },
    {
      question_en: "Question 2 (CCNA Exam): A network technician is inspecting network cabling in a wiring closet. Which medium is completely immune to Electromagnetic Interference (EMI) and Radio Frequency Interference (RFI), and can carry data across several kilometers?",
      options_en: [
        "A. Shielded Twisted-Pair (STP) copper cable",
        "B. Unshielded Twisted-Pair (UTP) Cat6 cable",
        "C. Fiber-optic glass cable",
        "D. Coaxial RG-6 cable"
      ],
      answerIndex: 2,
      explanation_en: "Correct answer is C (Fiber-optic cable). Fiber-optic cables transmit data as pulses of light through high-purity glass strands rather than electrical currents, rendering them 100% immune to electromagnetic interference, electrical surges, and lightning."
    },
    {
      question_en: "Question 3 (CCNA Exam): What is the primary difference between a Physical Topology Diagram and a Logical Topology Diagram in network documentation?",
      options_en: [
        "A. Physical diagram shows IP addresses; Logical diagram shows room locations.",
        "B. Physical diagram shows physical hardware locations, rack units, and cable runs; Logical diagram shows interface designations, IP schemes, and VLAN segmentation.",
        "C. Logical diagram is only used by executive management, while Physical diagram is used by software developers.",
        "D. Physical diagram only applies to wireless networks; Logical diagram applies only to wired switches."
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B. A physical topology documents actual hardware installations (rack, room, cable length), whereas a logical topology illustrates addressing, interface IDs (e.g. Gi0/0/0), routing protocols, and broadcast domains."
    }
  ],
  2: [
    {
      question_en: "Question 1 (CCNA Exam): Which Cisco IOS CLI mode is indicated by the prompt 'Switch(config)#' and what administrative privileges does it provide?",
      options_en: [
        "A. User EXEC Mode — only allows basic view and ping commands.",
        "B. Privileged EXEC Mode — allows running show commands and debugging.",
        "C. Global Configuration Mode — allows modifying device-wide settings and parameters.",
        "D. Interface Configuration Mode — modifies only a specific port."
      ],
      answerIndex: 2,
      explanation_en: "Correct answer is C (Global Configuration Mode). The prompt 'Router(config)#' or 'Switch(config)#' signifies global config mode, accessed by issuing 'configure terminal' from Privileged EXEC mode."
    },
    {
      question_en: "Question 2 (CCNA Exam): A network engineer configures 'service password-encryption' on a Cisco switch. What does this command accomplish?",
      options_en: [
        "A. Encrypts passwords using strong SHA-256 hashing in the configuration file.",
        "B. Obfuscates all plaintext passwords (like line console and line vty) into reversible Type 7 cipher text.",
        "C. Prevents unauthorized users from logging into the console port.",
        "D. Automatically generates an RSA crypto key pair for SSH access."
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B. The 'service password-encryption' command applies Cisco Type 7 reversible encryption to prevent shoulder-surfing of plaintext passwords in the running configuration."
    },
    {
      question_en: "Question 3 (CCNA Exam): Which memory location holds the active, unsaved Cisco IOS configuration currently executing in RAM?",
      options_en: [
        "A. NVRAM (startup-config)",
        "B. Flash memory (IOS binary image)",
        "C. RAM (running-config)",
        "D. ROM (Bootstrap loader)"
      ],
      answerIndex: 2,
      explanation_en: "Correct answer is C (RAM - running-config). RAM holds the active running configuration, which is lost upon reboot unless copied to NVRAM using 'copy running-config startup-config'."
    }
  ],
  3: [
    {
      question_en: "Question 1 (CCNA Exam): At which layer of the OSI model does logical IP addressing (IPv4 and IPv6) and path determination (Routing) occur?",
      options_en: [
        "A. Layer 2 — Data Link Layer",
        "B. Layer 3 — Network Layer",
        "C. Layer 4 — Transport Layer",
        "D. Layer 7 — Application Layer"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B (Layer 3 — Network Layer). Layer 3 handles logical end-to-end addressing (IP addresses), packet encapsulation, and best-path determination across interconnected networks via routing protocols."
    },
    {
      question_en: "Question 2 (CCNA Exam): What is the correct term for the Protocol Data Unit (PDU) at the Transport Layer of the OSI Model?",
      options_en: [
        "A. Packet",
        "B. Frame",
        "C. Segment (or Datagram for UDP)",
        "D. Bit"
      ],
      answerIndex: 2,
      explanation_en: "Correct answer is C (Segment). Layer 4 PDUs are called Segments (TCP) or Datagrams (UDP). Layer 3 PDUs are Packets, Layer 2 are Frames, and Layer 1 are Bits."
    },
    {
      question_en: "Question 3 (CCNA Exam): What happens during the Decapsulation process as incoming data moves up the protocol stack on a destination host?",
      options_en: [
        "A. Headers and trailers are stripped off layer-by-layer to recover the original user payload.",
        "B. Additional encryption headers are appended at each layer.",
        "C. Packets are converted into binary optical signals.",
        "D. MAC addresses are translated into domain names."
      ],
      answerIndex: 0,
      explanation_en: "Correct answer is A. During decapsulation, each layer inspects and strips its corresponding protocol header and passes the remaining payload up to the higher layer."
    }
  ],
  4: [
    {
      question_en: "Question 1 (CCNA Exam): Which physical transmission characteristic refers to the theoretical maximum volume of data that a medium can transport per unit of time?",
      options_en: [
        "A. Throughput",
        "B. Goodput",
        "C. Bandwidth",
        "D. Latency"
      ],
      answerIndex: 2,
      explanation_en: "Correct answer is C (Bandwidth). Bandwidth is the theoretical maximum capacity of a physical medium (e.g. 1 Gbps). Throughput is the actual transferred rate, and Goodput is usable application data after subtracting protocol overhead."
    },
    {
      question_en: "Question 2 (CCNA Exam): Which Ethernet copper cable pinout standard defines the following wire pairs: Pin 1: White/Orange, Pin 2: Orange, Pin 3: White/Green, Pin 6: Green?",
      options_en: [
        "A. T568A Standard",
        "B. T568B Standard",
        "C. USOC Standard",
        "D. Rollover Console Cable"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B (T568B Standard). T568B begins with White/Orange and Orange on pins 1 and 2, and White/Green on pin 3 with Green on pin 6. T568A begins with Green pairs."
    },
    {
      question_en: "Question 3 (CCNA Exam): Why does Single-Mode Fiber (SMF) achieve vastly longer transmission distances than Multi-Mode Fiber (MMF)?",
      options_en: [
        "A. SMF uses multiple light rays bouncing inside a wide 50-micron glass core.",
        "B. SMF uses a microscopic 9-micron glass core and a laser transmitter, virtually eliminating modal dispersion.",
        "C. SMF is made of copper wire wrapped in shielding foil.",
        "D. SMF operates only on battery power."
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B. Single-mode fiber has a tiny core (~9 microns) carrying a single ray of laser light directly down the center without reflection angles, eliminating modal dispersion and allowing spans of 10km to 100km."
    }
  ],
  5: [
    {
      question_en: "Question 1 (CCNA Exam): What is the hexadecimal equivalent of the decimal number 254?",
      options_en: [
        "A. 0xFA",
        "B. 0xFE",
        "C. 0xFF",
        "D. 0xEE"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B (0xFE). 254 in binary is 11111110. Splitting into two 4-bit nibbles: 1111 = 15 (F) and 1110 = 14 (E), giving 0xFE."
    },
    {
      question_en: "Question 2 (CCNA Exam): How many total bits make up an IPv4 address and an IPv6 address, respectively?",
      options_en: [
        "A. 16 bits and 32 bits",
        "B. 32 bits and 64 bits",
        "C. 32 bits and 128 bits",
        "D. 48 bits and 128 bits"
      ],
      answerIndex: 2,
      explanation_en: "Correct answer is C (32 bits and 128 bits). IPv4 addresses are 32 bits divided into 4 octets. IPv6 addresses are 128 bits divided into 8 hex hextets."
    },
    {
      question_en: "Question 3 (CCNA Exam): What is the binary representation of the decimal octet 192?",
      options_en: [
        "A. 11000000",
        "B. 10101000",
        "C. 11110000",
        "D. 11001000"
      ],
      answerIndex: 0,
      explanation_en: "Correct answer is A (11000000). 128 + 64 = 192, so the first two bits are 1 and the remaining 6 bits are 0."
    }
  ],
  6: [
    {
      question_en: "Question 1 (CCNA Exam): What is the primary purpose of the Media Access Control (MAC) sublayer in the IEEE 802 LAN architecture?",
      options_en: [
        "A. Multiplexing network layer protocols via 802.2 LLC headers.",
        "B. Interfacing with hardware, framing data, calculating FCS error check, and controlling media access.",
        "C. Routing packets across different autonomous systems.",
        "D. Managing end-to-end TCP flow control."
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B. The MAC sublayer (IEEE 802.3/802.11) manages physical hardware addressing (MAC addresses), frame assembly/disassembly, media access control (CSMA/CD), and Frame Check Sequence (FCS) error detection."
    },
    {
      question_en: "Question 2 (CCNA Exam): In what duplex mode is collision detection (CSMA/CD) required on Ethernet networks?",
      options_en: [
        "A. Full-duplex mode",
        "B. Half-duplex mode",
        "C. Both Half-duplex and Full-duplex modes",
        "D. Auto-negotiation mode only"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B (Half-duplex). In half-duplex, devices cannot send and receive simultaneously on the same channel, requiring CSMA/CD to detect and back off from collisions. Full-duplex Ethernet has dedicated TX/RX paths and zero collisions."
    },
    {
      question_en: "Question 3 (CCNA Exam): What is the size of an Ethernet MAC address, and how is it structured?",
      options_en: [
        "A. 32 bits, expressed as four decimal numbers.",
        "B. 48 bits (6 bytes), with the first 24 bits representing the vendor OUI and the last 24 bits uniquely assigned by the manufacturer.",
        "C. 64 bits, generated randomly upon every system reboot.",
        "D. 128 bits, expressed in hexadecimal format."
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B. A MAC address is 48 bits (6 bytes) long. The first 3 bytes (24 bits) are the Organizationally Unique Identifier (OUI) assigned by IEEE to the hardware manufacturer."
    }
  ],
  7: [
    {
      question_en: "Question 1 (CCNA Exam): How does an Ethernet switch learn source MAC addresses and populate its MAC Address Table (CAM Table)?",
      options_en: [
        "A. By inspecting the destination MAC address of incoming frames.",
        "B. By inspecting the source MAC address and ingress port of every incoming frame.",
        "C. By querying the local DHCP server for active leases.",
        "D. By sending periodic broadcast ping packets to all ports."
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B. Switches dynamically populate their CAM table by inspecting the SOURCE MAC address of every arriving frame and recording which physical port it entered on."
    },
    {
      question_en: "Question 2 (CCNA Exam): What action does a Layer 2 switch take when it receives an 'Unknown Unicast' frame (the destination MAC is not in its CAM table)?",
      options_en: [
        "A. Drops the frame immediately and logs an error to Syslog.",
        "B. Floods the frame out of all ports except the port on which it was received.",
        "C. Forwards the frame to the default gateway router.",
        "D. Sends an ARP request to determine the correct port."
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B (Floods the frame). When a destination MAC is unknown, the switch floods the frame out all active ports in the same VLAN except the receiving port."
    },
    {
      question_en: "Question 3 (CCNA Exam): Which switch forwarding method begins forwarding a frame immediately after reading the 6-byte destination MAC address, offering the lowest latency?",
      options_en: [
        "A. Store-and-Forward switching",
        "B. Cut-Through switching",
        "C. Fragment-Free switching",
        "D. Adaptive switching"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B (Cut-Through). Cut-Through switching inspects only the first 6 bytes (Destination MAC) and forwards the frame immediately without buffering or verifying the FCS check."
    }
  ],
  8: [
    {
      question_en: "Question 1 (CCNA Exam): What is the primary purpose of the IPv4 Time-to-Live (TTL) field?",
      options_en: [
        "A. Measuring end-to-end network latency in milliseconds.",
        "B. Preventing packets from circulating indefinitely in Layer 3 routing loops.",
        "C. Ensuring packets arrive in their original sequential order.",
        "D. Authenticating the sender's digital signature."
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B. Each router that forwards an IPv4 packet decrements its TTL field by 1. When TTL reaches 0, the packet is discarded and an ICMP Time Exceeded message is returned, preventing endless looping."
    },
    {
      question_en: "Question 2 (CCNA Exam): Which IPv4 header field is used by Quality of Service (QoS) mechanisms to prioritize packets across network routers?",
      options_en: [
        "A. Identification (16 bits)",
        "B. Differentiated Services Code Point (DSCP / ToS field - 8 bits)",
        "C. Protocol field (8 bits)",
        "D. Header Checksum (16 bits)"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B (DSCP / DiffServ). The 8-bit Differentiated Services field (DSCP) is used by QoS routers to mark packet priority (e.g. EF for voice, AF for critical business apps)."
    },
    {
      question_en: "Question 3 (CCNA Exam): What are the two essential components contained within every routing table entry?",
      options_en: [
        "A. Source IP address and Source MAC address",
        "B. Destination network prefix/mask and Next-hop IP address (or Exit interface)",
        "C. VLAN ID and STP root port ID",
        "D. Port number and TCP sequence number"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B. A routing table maps destination network subnets to the next-hop router address or local outgoing interface needed to reach that destination."
    }
  ],
  9: [
    {
      question_en: "Question 1 (CCNA Exam): What is the purpose of the Address Resolution Protocol (ARP) in an IPv4 network?",
      options_en: [
        "A. Translating public IP addresses into private IP addresses.",
        "B. Resolving a known target IPv4 address into its corresponding Layer 2 MAC address.",
        "C. Resolving domain names into numeric IP addresses.",
        "D. Assigning IP addresses dynamically to client hosts."
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B. When a host knows the destination IP address on the local LAN but needs the Layer 2 MAC address to build an Ethernet frame, it broadcasts an ARP Request."
    },
    {
      question_en: "Question 2 (CCNA Exam): What Layer 2 broadcast destination MAC address is placed in an ARP Request frame?",
      options_en: [
        "A. 00:00:00:00:00:00",
        "B. FF:FF:FF:FF:FF:FF",
        "C. 01:00:5E:00:00:01",
        "D. The MAC address of the default gateway router"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B (FF:FF:FF:FF:FF:FF). ARP Requests are broadcast to all devices on the local VLAN using the all-ones broadcast MAC address."
    },
    {
      question_en: "Question 3 (CCNA Exam): Which security attack occurs when a malicious host sends unsolicited fake ARP replies to associate its own MAC address with the default gateway's IP address?",
      options_en: [
        "A. DHCP Starvation attack",
        "B. ARP Spoofing / ARP Poisoning (Man-in-the-Middle)",
        "C. SYN Flood attack",
        "D. VLAN Hopping attack"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B (ARP Poisoning). An attacker injects false ARP mappings into client ARP caches to intercept, inspect, or alter network traffic. Mitigated using Dynamic ARP Inspection (DAI)."
    }
  ],
  10: [
    {
      question_en: "Question 1 (CCNA Exam): Which command must be executed on a Cisco router interface before it can transmit or receive traffic?",
      options_en: [
        "A. Router(config-if)# enable interface",
        "B. Router(config-if)# no shutdown",
        "C. Router(config-if)# ip routing on",
        "D. Router(config-if)# start link"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B ('no shutdown'). Cisco router interfaces are administratively down ('shutdown') by default and require 'no shutdown' to change status to up/up."
    },
    {
      question_en: "Question 2 (CCNA Exam): When a host on subnet 192.168.10.0/24 needs to send a packet to a server on 10.0.0.50, where does the host forward the packet at Layer 2?",
      options_en: [
        "A. Directly to the MAC address of 10.0.0.50.",
        "B. To the MAC address of its configured Default Gateway router.",
        "C. To the broadcast MAC address FF:FF:FF:FF:FF:FF.",
        "D. Drops the packet because it belongs to a different network."
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B. When the destination IP is on a remote subnet, the sending host encapsulates the packet inside a frame addressed to the Layer 2 MAC of its local Default Gateway."
    },
    {
      question_en: "Question 3 (CCNA Exam): Which Cisco IOS command displays a concise table showing the IP address and Layer 1/2 status of all router interfaces?",
      options_en: [
        "A. Router# show ip route",
        "B. Router# show ip interface brief",
        "C. Router# show interfaces status",
        "D. Router# show version"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B ('show ip interface brief'). This command provides an essential summary table listing interface names, assigned IP addresses, OK status, method, and Layer 1/2 operational states."
    }
  ],
  11: [
    {
      question_en: "Question 1 (CCNA Exam): How many usable host IP addresses are available on an IPv4 subnet with a prefix length of /27?",
      options_en: [
        "A. 32",
        "B. 30",
        "C. 62",
        "D. 14"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B (30 usable hosts). A /27 prefix leaves 32 - 27 = 5 host bits. Total addresses = 2^5 = 32. Subtracting 2 (Network ID and Broadcast ID) leaves 30 usable host IP addresses."
    },
    {
      question_en: "Question 2 (CCNA Exam): Which of the following IPv4 addresses belongs to the private address ranges defined in RFC 1918?",
      options_en: [
        "A. 172.33.10.5",
        "B. 192.168.100.1",
        "C. 11.0.0.1",
        "D. 169.254.1.1"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B (192.168.100.1). RFC 1918 private ranges: 10.0.0.0/8, 172.16.0.0 to 172.31.255.255 (/12), and 192.168.0.0/16. 172.33.x.x is public, and 169.254.x.x is APIPA link-local."
    },
    {
      question_en: "Question 3 (CCNA Exam): What is the subnet broadcast address for the host IP 192.168.1.100 with a subnet mask of 255.255.255.192 (/26)?",
      options_en: [
        "A. 192.168.1.127",
        "B. 192.168.1.255",
        "C. 192.168.1.63",
        "D. 192.168.1.191"
      ],
      answerIndex: 0,
      explanation_en: "Correct answer is A (192.168.1.127). For /26, block size = 256 - 192 = 64. Subnets: .0, .64, .128. Host .100 falls in the .64 subnet (Network: .64, Broadcast: .127, Usable: .65 - .126)."
    }
  ],
  12: [
    {
      question_en: "Question 1 (CCNA Exam): Which IPv6 address type is designated by the prefix fe80::/10 and is mandatory on every IPv6-enabled interface?",
      options_en: [
        "A. Global Unicast Address (GUA)",
        "B. Unique Local Address (ULA)",
        "C. Link-Local Address (LLA)",
        "D. Anycast Address"
      ],
      answerIndex: 2,
      explanation_en: "Correct answer is C (Link-Local Address - LLA). LLAs start with fe80::/10 and are used exclusively for communications on the local link (such as router discovery and next-hop routing)."
    },
    {
      question_en: "Question 2 (CCNA Exam): How can the IPv6 address 2001:0db8:0000:0000:0000:0000:0000:0001 be compressed to its shortest legal notation?",
      options_en: [
        "A. 2001:db8::1",
        "B. 2001:db8:0:0:0:0:0:1",
        "C. 2001:0db8::1",
        "D. 2001::db8::1"
      ],
      answerIndex: 0,
      explanation_en: "Correct answer is A (2001:db8::1). Leading zeros are omitted (0db8 -> db8), and the single longest contiguous run of zeros is replaced once by a double colon (::)."
    },
    {
      question_en: "Question 3 (CCNA Exam): In IPv6 Stateless Address Autoconfiguration (SLAAC), what ICMPv6 message does a client host send to discover local routers?",
      options_en: [
        "A. Router Advertisement (RA)",
        "B. Router Solicitation (RS)",
        "C. Neighbor Solicitation (NS)",
        "D. Neighbor Advertisement (NA)"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B (Router Solicitation - RS). The host sends an RS message to the all-routers multicast address ff02::2, prompting routers to immediately respond with an RA containing prefix information."
    }
  ],
  13: [
    {
      question_en: "Question 1 (CCNA Exam): What command is used to test basic network connectivity and measure Round-Trip Time (RTT) between two devices?",
      options_en: [
        "A. traceroute (or tracert)",
        "B. ping",
        "C. netstat",
        "D. nslookup"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B (ping). Ping sends ICMP Echo Request messages and listens for ICMP Echo Reply messages to verify Layer 3 connectivity and measure latency."
    },
    {
      question_en: "Question 2 (CCNA Exam): How does the traceroute utility discover each router hop along the path to a destination host?",
      options_en: [
        "A. By querying the local DNS server for all intermediate routers.",
        "B. By sending packets with incrementally increasing TTL values starting at 1 and listening for ICMP Time Exceeded replies.",
        "C. By broadcasting ARP requests across all router interfaces.",
        "D. By reading the OSPF link-state database on the host."
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B. Traceroute sends packets with TTL=1 (expired by hop 1), TTL=2 (expired by hop 2), etc., identifying each intermediate router by its ICMP Time Exceeded (Type 11) response."
    },
    {
      question_en: "Question 3 (CCNA Exam): Which ICMP message type and code indicates that a router cannot find a route to the destination IP address?",
      options_en: [
        "A. Destination Unreachable (Type 3, Code 0 - Net Unreachable)",
        "B. Time Exceeded (Type 11, Code 0)",
        "C. Echo Reply (Type 0, Code 0)",
        "D. Redirect Message (Type 5, Code 1)"
      ],
      answerIndex: 0,
      explanation_en: "Correct answer is A. When a router cannot find a matching route in its routing table for a destination network, it discards the packet and returns an ICMP Destination Unreachable message."
    }
  ],
  14: [
    {
      question_en: "Question 1 (CCNA Exam): What is the fundamental difference in reliability between TCP and UDP at the Transport Layer?",
      options_en: [
        "A. UDP uses a 3-way handshake and acknowledges every segment; TCP does not.",
        "B. TCP is connection-oriented, reliable (uses acknowledgments, retransmissions, sequence numbers); UDP is connectionless and best-effort with minimal overhead.",
        "C. TCP is used only for audio/video streaming; UDP is used for web and file transfers.",
        "D. TCP uses 16-bit port numbers; UDP uses 32-bit port numbers."
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B. TCP establishes a connection via a 3-way handshake and guarantees delivery through sequence numbers and ACKs. UDP provides low-overhead, best-effort transport without acknowledgments."
    },
    {
      question_en: "Question 2 (CCNA Exam): What are the three TCP control flags exchanged in order during the standard TCP 3-Way Handshake?",
      options_en: [
        "A. ACK -> SYN -> FIN",
        "B. SYN -> SYN-ACK -> ACK",
        "C. PSH -> URG -> ACK",
        "D. RST -> SYN -> ACK"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B (SYN -> SYN-ACK -> ACK). The client initiates with SYN, the server responds with SYN-ACK, and the client acknowledges with ACK before data transmission begins."
    },
    {
      question_en: "Question 3 (CCNA Exam): What range of port numbers is designated as 'Well-Known Ports' reserved for standardized system services like HTTP, HTTPS, SSH, and DNS?",
      options_en: [
        "A. 0 to 1,023",
        "B. 1,024 to 49,151",
        "C. 49,152 to 65,535",
        "D. 80 to 443"
      ],
      answerIndex: 0,
      explanation_en: "Correct answer is A (0 to 1,023). Well-known ports (0–1023) are assigned by IANA for standard services (e.g. SSH: 22, DNS: 53, HTTP: 80, HTTPS: 443). Registered ports are 1024–49151, and Dynamic/Private ports are 49152–65535."
    }
  ],
  15: [
    {
      question_en: "Question 1 (CCNA Exam): Which Application Layer protocol resolves human-friendly Fully Qualified Domain Names (e.g., www.cisco.com) into numeric IP addresses?",
      options_en: [
        "A. DHCP (Dynamic Host Configuration Protocol)",
        "B. DNS (Domain Name System)",
        "C. SNMP (Simple Network Management Protocol)",
        "D. NTP (Network Time Protocol)"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B (DNS - UDP/TCP Port 53). DNS is the distributed hierarchical database service that resolves domain names to IP addresses (A/AAAA records)."
    },
    {
      question_en: "Question 2 (CCNA Exam): What are the four messages exchanged during a successful DHCPv4 client address assignment (the DORA process)?",
      options_en: [
        "A. Discover -> Offer -> Request -> Acknowledgment (DORA)",
        "B. Discover -> Order -> Response -> Approve",
        "C. Detect -> Offer -> Register -> Accept",
        "D. Demand -> Option -> Require -> Allocate"
      ],
      answerIndex: 0,
      explanation_en: "Correct answer is A (DORA). 1) DHCP Discover (broadcast), 2) DHCP Offer (unicast/broadcast), 3) DHCP Request (broadcast), 4) DHCP Acknowledgment (ACK)."
    },
    {
      question_en: "Question 3 (CCNA Exam): What is the primary difference between POP3 and IMAP4 email retrieval protocols?",
      options_en: [
        "A. POP3 is used for sending emails; IMAP4 is used for receiving emails.",
        "B. POP3 downloads messages to the local device and typically deletes them from the server; IMAP4 synchronizes messages and keeps them stored in folders on the server.",
        "C. POP3 encrypts emails; IMAP4 does not support SSL/TLS.",
        "D. POP3 uses UDP; IMAP4 uses TCP."
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B. POP3 downloads messages locally, while IMAP4 synchronizes mailboxes across multiple devices, retaining email history and folders on the mail server."
    }
  ],
  16: [
    {
      question_en: "Question 1 (CCNA Exam): What is the most secure method for managing network devices remotely across an untrusted network like the Internet?",
      options_en: [
        "A. Telnet (TCP Port 23)",
        "B. SSHv2 (Secure Shell v2 - TCP Port 22)",
        "C. HTTP (TCP Port 80)",
        "D. TFTP (UDP Port 69)"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B (SSHv2). Unlike Telnet, which transmits all credentials and commands in unencrypted plaintext, SSH encrypts all management sessions using strong symmetric and asymmetric ciphers."
    },
    {
      question_en: "Question 2 (CCNA Exam): Which Cisco IOS configuration command establishes a modern, cryptographically strong SHA-256 hashed password for entering Privileged EXEC mode?",
      options_en: [
        "A. enable password SecretPass123",
        "B. enable secret SecretPass123",
        "C. line vty 0 4 password SecretPass123",
        "D. service password-encryption"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B ('enable secret'). 'enable secret' stores the password using a one-way cryptographic hash (Type 8 or Type 9 PBKDF2/SHA-256), completely overriding the insecure legacy 'enable password'."
    },
    {
      question_en: "Question 3 (CCNA Exam): What security feature on Cisco Catalyst switches mitigates brute-force password guessing attacks on VTY lines by locking out logins after repeated failures?",
      options_en: [
        "A. login block-for <seconds> attempts <n> within <seconds>",
        "B. transport input ssh",
        "C. switchport port-security",
        "D. no ip domain-lookup"
      ],
      answerIndex: 0,
      explanation_en: "Correct answer is A ('login block-for'). This command automatically blocks login attempts for a specified quiet period when an excessive number of failed login attempts occur within a given time window."
    }
  ],
  17: [
    {
      question_en: "Question 1 (CCNA Exam): A user reports they cannot access the website 'https://www.cisco.com'. The network technician pings '8.8.8.8' and '72.163.4.185' (the IP of cisco.com) and both ping successfully. Following the Divide-and-Conquer troubleshooting methodology, where does the issue reside?",
      options_en: [
        "A. The Ethernet cable is disconnected (Layer 1).",
        "B. The Default Gateway is incorrectly configured on the PC (Layer 3).",
        "C. The switch port is assigned to the wrong VLAN (Layer 2).",
        "D. The host is experiencing a Domain Name System (DNS) resolution failure (Layer 7) or web proxy blocking.",
      ],
      answerIndex: 3,
      explanation_en: "Correct answer is D. Successfully pinging external IP addresses proves that Layers 1, 2, and 3 (Physical, Switching, IP routing) are functioning properly. Failure to resolve 'www.cisco.com' indicates a DNS resolution failure."
    },
    {
      question_en: "Question 2 (CCNA Exam): An administrator needs to view the IPv4 management address of an adjacent Cisco router connected directly to switch port Gi0/1 via Cisco Discovery Protocol (CDP). Which command displays this IP address?",
      options_en: [
        "A. Switch# show cdp neighbors",
        "B. Switch# show cdp neighbors detail",
        "C. Switch# show interfaces status",
        "D. Switch# show mac address-table"
      ],
      answerIndex: 1,
      explanation_en: "Correct answer is B ('show cdp neighbors detail'). The basic 'show cdp neighbors' command only lists Device ID, local interface, holdtime, capability, platform, and port ID (NO IP). The 'detail' keyword is required to display Layer 3 IP addresses."
    },
    {
      question_en: "Question 3 (CCNA Exam): In the Cisco IOS Syslog logging severity scale (Levels 0 to 7), if an engineer configures 'logging trap warnings' (Level 4), which message levels are forwarded to the Syslog server?",
      options_en: [
        "A. Only Level 4 (Warnings).",
        "B. Levels 4 through 7 (Warnings, Notifications, Informational, Debugging).",
        "C. Levels 0 through 4 (Emergencies, Alerts, Critical, Errors, and Warnings).",
        "D. All levels from 0 to 7."
      ],
      answerIndex: 2,
      explanation_en: "Correct answer is C (Levels 0 through 4). In Syslog, Level 0 is the most severe and Level 7 is the least severe. Configuring a threshold of Level N forwards all messages from Level 0 down to Level N."
    }
  ]
};

const CCNA_COMPARISON_TABLES_EN = {
  1: {
    title_en: "Enterprise Network Architectures & WAN Transmission Standards",
    headers_en: ["Technology / Standard", "Technical Architecture", "Actual Throughput", "Enterprise & CCNA Exam Use-Case"],
    rows_en: [
      ["LAN (Local Area Network)", "Local network spanning a single building/campus, fully owned by the enterprise.", "100 Mbps – 100 Gbps", "Corporate offices, school campuses, local private Data Centers."],
      ["WAN (Wide Area Network)", "Connects geographically separated LANs across ISP leased-line infrastructure.", "10 Mbps – 100 Gbps", "Connecting Headquarters (HQ) with regional Branch Offices."],
      ["SOHO (Small Office / Home Office)", "Small office network (1–10 users) using an integrated all-in-one router box.", "100 Mbps – 1 Gbps", "Retail shops, coffee shops, home teleworker setups."],
      ["FTTH / Metro Ethernet", "Dedicated fiber-optic drop (GPON for SMBs, AON/Metro-E point-to-point for enterprise).", "300 Mbps – 10 Gbps", "Primary corporate Internet connection and leased lines between offices."],
      ["DSL vs. Cable Broadband", "DSL runs over twisted-pair copper phone lines (RJ-11); Cable runs over 75-ohm coaxial TV cable.", "10 Mbps – 500 Mbps", "Common CCNA question: DSL uses telephone lines; Cable uses coaxial CATV."],
      ["Cellular (4G/5G) & Satellite", "4G/5G utilizes mobile towers; Satellite (Starlink/VSAT) serves remote outposts with higher latency.", "50 Mbps – 1 Gbps", "Backup WAN failover for branch routers and automated bank ATMs."]
    ]
  },
  2: {
    title_en: "Cisco IOS Memory Architecture & Configuration Comparison",
    headers_en: ["Memory Type", "Storage Technology", "Contents / Functionality", "Persistence Across Reboot"],
    rows_en: [
      ["RAM (Random Access Memory)", "Volatile semiconductor RAM", "running-config, routing tables, ARP cache, packet buffers.", "No (Lost immediately upon power loss or reload)."],
      ["NVRAM (Non-Volatile RAM)", "Non-volatile memory", "startup-config file, configuration register settings.", "Yes (Preserved permanently until erased with write erase)."],
      ["Flash Memory", "Electronically erasable Flash", "Cisco IOS system software image (.bin), backup files.", "Yes (Preserved permanently; default boot device)."],
      ["ROM (Read-Only Memory)", "Hardwired chip", "Bootstrap code, POST diagnostic firmware, ROMMON recovery.", "Yes (Permanent read-only factory firmware)."]
    ]
  },
  3: {
    title_en: "OSI 7-Layer Reference Model vs. TCP/IP 4-Layer Architecture",
    headers_en: ["OSI Layer", "TCP/IP Equivalent", "PDU Unit", "Core Protocols & Standards"],
    rows_en: [
      ["Layer 7 - Application", "Application Layer", "Data / Payload", "HTTP, HTTPS, DNS, DHCP, SSH, Telnet, SNMP, FTP"],
      ["Layer 6 - Presentation", "Application Layer", "Data", "TLS/SSL, ASCII, UTF-8, JPEG, PNG, MPEG, Compression"],
      ["Layer 5 - Session", "Application Layer", "Data", "RPC, SQL Net, NetBIOS, Session Management"],
      ["Layer 4 - Transport", "Transport Layer", "Segment (TCP) / Datagram (UDP)", "TCP (Reliable, ACK, 3-way handshake), UDP (Best-effort)"],
      ["Layer 3 - Network", "Internet Layer", "Packet", "IPv4, IPv6, ICMP, ICMPv6, OSPF, EIGRP, BGP, ARP"],
      ["Layer 2 - Data Link", "Network Access Layer", "Frame", "Ethernet 802.3, Wi-Fi 802.11, HDLC, PPP, Frame Relay"],
      ["Layer 1 - Physical", "Network Access Layer", "Bits", "Copper UTP/STP, Fiber-optic Single/Multi-mode, Radio Frequency"]
    ]
  }
};

const CCNA_JOB_SKILLS_EN = {
  1: [
    "Field Practice 1 — Network Baseline Documentation: Always document network baseline metrics (normal CPU utilization, peak interface bandwidth, average ping round-trip times) during normal business hours. When users report network sluggishness, comparing live metrics against the baseline reveals the bottleneck in minutes.",
    "Field Practice 2 — Standard Cabling & Cable Management: Never leave patch cords dangling loosely in front of server racks. Use horizontal cable managers and velcro ties, adhere strictly to T568B pinout, and label both ends of every cable with source device and patch panel port number.",
    "Field Practice 3 — Quality of Service (QoS) in Production: Prioritize real-time voice (VoIP) and video packets in the strict priority queue. Ensure non-critical background traffic like Windows Updates or peer-to-peer transfers are shaped to prevent link saturation."
  ],
  2: [
    "Field Practice 1 — Safe Backup and Verification Routine: Before modifying any production switch or router configuration, always backup the current running-config to TFTP or USB flash: `Router# copy running-config tftp:`. When uploading a new IOS binary, always verify the MD5 hash using `verify /md5 flash:<filename>` before issuing `reload`.",
    "Field Practice 2 — Securing Out-of-Band Management: Never leave console or AUX ports unpassworded in wiring closets. Configure `exec-timeout 5 0`, `logging synchronous`, and `login local` with strong secret passwords to prevent unauthorized console takeover.",
    "Field Practice 3 — Automated Configuration Rollback: When making risky routing changes remotely over SSH, use the `reload in 10` safeguard command. If your change severs connectivity, the router will automatically reboot back to its saved config after 10 minutes."
  ]
};


// ==============================================================================
// CCNA English Metaphors & Real-World Analogies for All 17 Modules
// ==============================================================================
const CCNA_ANALOGY_EN = {
  1: "Imagine computer networking as a nationwide logistics and postal system: End devices (PCs, phones, servers) are houses and warehouses producing and consuming goods; Network media (copper cables, optical fiber, wireless airwaves) are highways, railroads, and shipping lanes; Intermediary devices (Switches, Routers, Firewalls) act as traffic roundabouts, border checkpoints, and distribution sorting hubs ensuring packets reach the exact intended destination.",
  2: "Navigating Cisco IOS CLI is identical to exploring folders in an operating system: User EXEC Mode ('>') is like a Guest account with basic read-only status commands; Privileged EXEC Mode ('#') is like running Administrator/Root mode; Global Configuration Mode ('(config)#') is like opening the Master System Control Panel to install drivers and modify global device settings.",
  3: "Protocols in networking are like diplomatic rules and etiquette when two people converse: they must agree on a common language (syntax), speak at a mutually intelligible speed without shouting (flow control), and pause to confirm 'Did you hear that?' (acknowledgment). OSI and TCP/IP models organize these rules into clean hierarchical layers.",
  4: "Physical transmission media is like transportation pipelines: Copper UTP cables are standard paved city streets (affordable, fast up to 100 meters, but vulnerable to electromagnetic noise); Fiber-optic cables are subterranean vacuum tube bullet trains carrying laser light pulses across tens of kilometers at light speed without interference.",
  5: "Binary and Hexadecimal counting: Humans have 10 fingers, so we intuitively count in Base-10 (Decimal 0–9). Inside router silicon and computer CPUs, there are only billions of electronic transistor switches: Power On = 1, Power Off = 0 (Base-2 Binary). When you type IP 192.168.1.1, the machine instantly converts it into 32 binary bits (11000000.10101000.00000001.00000001) to calculate routing.",
  6: "The Data Link Layer is like an armored envelope with a postal stamp: It wraps raw Layer 3 packets into structured Ethernet Frames, complete with sender and recipient hardware MAC addresses stamped on both ends, and an Error Check FCS checksum at the back to discard damaged deliveries.",
  7: "Ethernet Switching is like a smart postal distribution mailroom: Hubs were reckless bullhorns broadcasting every incoming package out to all workers in the building; Switches maintain an internal MAC Address Table, quietly learning which device sits at which desk, forwarding frames strictly to the destination port.",
  8: "Network Layer addressing (IP) is like a global courier delivery system: A MAC address is like your citizen ID number (unique to you but doesn't tell a mail carrier where your house is located); An IP address is your full physical postal address (Country, City, Street, House Number), allowing international couriers to route packets across continents.",
  9: "Address Resolution Protocol (ARP) is like walking into an office room and asking out loud: 'Who here is assigned IP address 192.168.1.50? Please whisper your hardware MAC address back to me!' Once PC2 replies privately, PC1 caches the answer into its ARP table for 5 to 20 minutes.",
  10: "A Router is like a smart air traffic control tower and international immigration hub: It inspects packet destination IP headers, consults its Routing Table for the best outbound path (Metric/Administrative Distance), strips the old incoming Ethernet header, and encapsulates the packet in a new Layer 2 frame outbound.",
  11: "IPv4 Subnetting is like dividing a large commercial building into private office suites: Instead of having 250 employees sharing one noisy open hall (causing massive broadcast storms), you build partitions and give each department its own private subnet room, separated by router gateways.",
  12: "IPv6 is like upgrading from phone numbers to a boundless global GPS grid: IPv4 ran out with 4.3 billion addresses. IPv6 delivers 340 undecillion addresses (enough to assign billions of unique public IPs to every grain of sand on Earth), eliminating the need for complex NAT translations.",
  13: "Layer 4 Transport protocols (TCP vs. UDP) are like Registered Certified Mail vs. a Fast Courier Flyer: TCP is Registered Mail that requires a 3-way handshake signature, tracks every sequence number, and retransmits lost parcels; UDP is a live streaming broadcast that fires data continuously with minimal overhead.",
  14: "Application Layer services: DNS is the internet's phonebook translating human names like google.com into IP 142.250.190.46; DHCP is the automatic concierge handing out room keys (IP, subnet mask, default gateway, DNS) to guests the instant they plug into the network.",
  15: "Network Security is like airport defense-in-depth: Perimeter fences are your Edge Firewalls, metal detectors and baggage scanners are IPS/WSA, passenger ID boarding passes are 802.1X / RADIUS authentication, and security cameras are Syslog monitoring.",
  16: "Network Automation is like transitioning from manually tightening every screw by hand on an assembly line to programming industrial robotic arms: Rather than typing commands into 200 switches one-by-one, engineers write Python scripts and Ansible playbooks to configure all 200 devices simultaneously via REST APIs in seconds.",
  17: "Systematic Troubleshooting is like a medical emergency triage: Never guess blindly! Use the Divide-and-Conquer approach starting at Layer 3: Ping the Default Gateway and 8.8.8.8 to immediately isolate whether the breakdown is down in physical wiring/switching (Layers 1–2) or up in DNS/firewall/application configs (Layers 4–7)."
};

// ==============================================================================
// CCNA English Exam Mastery Topics (10 Domains)
// ==============================================================================
const CCNA_EXAM_MASTERY_EN = {
  1: {
    title_en: "Mastery Topic 1: Enterprise Switching Deep Dive — VLANs, 802.1Q Trunking, DTP, Spanning Tree (STP/RSTP) & EtherChannel",
    summary_en: "Master all core Layer 2 enterprise switching concepts tested on the CCNA 200-301 exam: Specialized VLAN architectures (Data, Voice, Management, Native), Dynamic Trunking Protocol (DTP) negotiation, Spanning Tree Root Bridge election criteria (802.1D / 802.1w), and EtherChannel link aggregation (LACP vs. PAgP vs. Static)."
  },
  2: {
    title_en: "Mastery Topic 2: Enterprise Routing Protocols — OSPFv2, OSPFv3 & Dynamic Routing Mechanics",
    summary_en: "Comprehensive mastery of Link-State routing: OSPF 7-state neighbor adjacency progression, DR/BDR election in multiaccess broadcast networks, OSPF cost calculations, LSA types, and Area 0 backbone hierarchy."
  },
  3: {
    title_en: "Mastery Topic 3: IP Services & High Availability — FHRP (HSRP/VRRP), DHCP Snooping & NTP",
    summary_en: "First-Hop Redundancy Protocols (HSRP active/standby virtual gateway failover, preemption), Network Time Protocol (NTP stratum hierarchy for synchronized logging), and DHCP relay agents."
  },
  4: {
    title_en: "Mastery Topic 4: Network Security Fundamentals — Standard & Extended ACLs, Port Security & DAI",
    summary_en: "Securing access switches and routed boundaries: Port Security (Violation modes: protect, restrict, shutdown), Dynamic ARP Inspection (DAI), DHCP Snooping untrusted port filtering, and IPv4/IPv6 Access Control Lists."
  },
  5: {
    title_en: "Mastery Topic 5: Network Address Translation (NAT) & Private Addressing (RFC 1918)",
    summary_en: "Static NAT (1-to-1 hosting), Dynamic NAT (pool allocation), and Port Address Translation (PAT / NAT Overload) using ephemeral port multiplexing to preserve public IPv4 addresses."
  },
  6: {
    title_en: "Mastery Topic 6: Enterprise Wireless LANs (WLAN) — Architectures, WLC, CAPWAP & 802.11 Standards",
    summary_en: "Autonomous APs vs. Lightweight APs (Split-MAC architecture), CAPWAP tunnel encapsulation (Control UDP 5246, Data UDP 5247), Cisco Wireless LAN Controllers (WLC), WPA2/WPA3 Personal vs. Enterprise 802.1X."
  },
  7: {
    title_en: "Mastery Topic 7: Network Automation, Programmability & Software-Defined Networking (SDN)",
    summary_en: "Cisco DNA Center / Catalyst Center, Software-Defined Access (SDA) Fabric (Underlay vs. Overlay, LISP, VXLAN), REST APIs (GET, POST, PUT, DELETE), JSON / XML / YAML data serialization, and Ansible / Puppet / Chef / Terraform configuration management."
  },
  8: {
    title_en: "Mastery Topic 8: Quality of Service (QoS) & Traffic Management",
    summary_en: "Classification and Marking (CoS Layer 2, ToS/DSCP Layer 3: EF, AF, CS, Best Effort), Queuing mechanisms (FIFO, WFQ, CBWFQ, LLQ Strict Priority for Voice), Traffic Policing (drop) vs. Traffic Shaping (buffer/smooth)."
  },
  9: {
    title_en: "Mastery Topic 9: WAN Technologies & Modern Cloud Connectivity",
    summary_en: "Leased lines, Metro Ethernet, MPLS VPNs, Site-to-Site IPsec VPNs, Generic Routing Encapsulation (GRE), SD-WAN architectures (vManage, vSmart, vBond, vEdge), and Public Cloud on-ramps (AWS Direct Connect, Azure ExpressRoute)."
  },
  10: {
    title_en: "Mastery Topic 10: Network Operations, Monitoring & Production Troubleshooting Toolkit",
    summary_en: "Syslog severity levels 0–7 (Emergency down to Debugging), SNMPv2c vs. SNMPv3 (AuthNoPriv, AuthPriv encryption), Cisco Discovery Protocol (CDP) vs. Link Layer Discovery Protocol (LLDP), and Cisco IOS system baseline recovery."
  }
};

// ==============================================================================
// CCNA English In-Depth Glossary for Modules 1 - 17
// ==============================================================================
const CCNA_GLOSSARY_EN = {
  1: [
    {
      term_en: "Host / End Device",
      simple_en: "Any computing device directly interacted with by humans or acting as the ultimate source/destination of data across a network (PCs, laptops, smartphones, servers, network printers, IP cameras, VoIP phones).",
      detail_en: "In CCNA terminology, every IP-connected endpoint is called a **Host**. To communicate over a network, each host requires: 1) A **Network Interface Card (NIC)**; 2) A burned-in **48-bit Physical MAC Address** for local subnet communication; and 3) A **Logical IP Address (32-bit IPv4 or 128-bit IPv6)** for end-to-end global routing. Hosts operate as **Clients** (requesting services, such as a web browser), **Servers** (providing services like HTTP, DNS, File storage), or both simultaneously (Peer-to-Peer).",
      example_en: "When streaming a video on your smartphone, your phone is the Client End Device, while the Google/YouTube data center server in Singapore is the Server End Device."
    },
    {
      term_en: "Intermediary Device",
      simple_en: "Infrastructure appliances located inside network racks responsible for interconnecting endpoints and directing data packets along optimal paths.",
      detail_en: "Intermediary devices do NOT generate user application payload. They perform four critical functions: 1) Regenerate and retransmit degraded electrical or optical signals; 2) Maintain topologies and forward tables (MAC address tables on switches, Routing tables on routers); 3) Forward frames/packets and alert administrators on link failures; 4) Enforce Quality of Service (QoS) priorities and filter threats (Firewall/ACL). The four primary intermediary devices in CCNA are **Switches (Layer 2)**, **Routers (Layer 3)**, **Wireless Access Points (WAPs)**, and **Next-Generation Firewalls (NGFW)**.",
      example_en: "In the CCNA exam: Network printers and servers are classified as End Devices, whereas switches, routers, and firewalls are Intermediary Devices."
    },
    {
      term_en: "Network Media",
      simple_en: "The physical transmission pathways that carry encoded signals between devices: Copper cables, Fiber-optic strands, and Wireless radio frequencies.",
      detail_en: "There are three primary media types: 1) **Copper (UTP, STP, Coaxial)**: Encodes binary 0 and 1 into **electrical voltage pulses**, cost-effective up to 100 meters but susceptible to electromagnetic interference (EMI); 2) **Fiber-Optic (Single-mode, Multi-mode)**: Encodes data as **pulses of light (Laser or LED)** through high-purity silica glass cores, spanning tens of kilometers at ultra-high speeds with 100% immunity to EMI and lightning surges; 3) **Wireless (RF)**: Encodes data into **electromagnetic waves** transmitted through free space.",
      example_en: "From your workstation to the floor wiring closet uses Cat6 UTP copper cable; connecting the enterprise building to the ISP uplink uses single-mode optical fiber."
    },
    {
      term_en: "LAN vs. WAN vs. WLAN vs. MAN vs. SAN",
      simple_en: "Classifications of computer networks based on geographical scale, operational span, and organizational ownership.",
      detail_en: "• **LAN (Local Area Network)**: Small geographical scope (single room, office floor, campus building), operated by a **single individual or organization**, delivering high speeds (1 Gbps - 10 Gbps). • **WAN (Wide Area Network)**: Interconnects distant LANs separated by hundreds or thousands of kilometers across telecom service provider (TSP/ISP) infrastructure. • **WLAN (Wireless LAN)**: Local area network using Wi-Fi radio waves instead of physical ethernet cabling. • **MAN (Metropolitan Area Network)**: City-wide public or municipal network. • **SAN (Storage Area Network)**: High-speed dedicated back-end fabric connecting enterprise servers to centralized storage arrays.",
      example_en: "The global Internet is literally a 'Network of Networks' stitching together millions of private LANs and public WANs worldwide."
    },
    {
      term_en: "Intranet vs. Extranet vs. Internet",
      simple_en: "Three progressive access tiers defining who is authorized to reach an organization's network assets.",
      detail_en: "• **Intranet (Private Internal Network)**: Strictly reserved for **authenticated internal employees** (e.g., HR portals, internal payroll, development environments). • **Extranet (Extended Partner Network)**: Private network zones granting controlled, authorized access to **external suppliers, trusted partners, and enterprise customers** (e.g., supplier inventory lookups). • **Internet (Public Global Network)**: Globally accessible public network reachable by anyone across the world.",
      example_en: "CCNA Exam Memory Rule: Internal employees only = **Intranet**; Trusted external partners/vendors = **Extranet**; Everyone worldwide = **Internet**."
    },
    {
      term_en: "Converged Network",
      simple_en: "A modern unified network infrastructure that merges computer data, voice telephony (VoIP), and video streams onto a single common cabling infrastructure.",
      detail_en: "Legacy buildings required three separate, redundant physical wiring networks: copper Cat3 for analog telephones, Cat5 for computers, and coaxial for CCTV cameras. A modern **Converged Network** digitizes all voice and surveillance video into standard IP packets routed over unified Cisco switch/router infrastructure—dramatically reducing installation costs and enabling centralized policy management.",
      example_en: "On corporate office desks, a single ethernet cable from the wall jack connects to a Cisco IP Phone, and a passthrough port on the phone daisy-chains directly to the employee's PC!"
    }
  ],
  2: [
    {
      term_en: "Cisco IOS (Internetwork Operating System)",
      simple_en: "The specialized operating system family executing inside Cisco hardware routers, switches, and security appliances.",
      detail_en: "Cisco IOS is a modular, monolithic or microkernel multitasking OS tailored for high-speed hardware switching and routing. IOS executes out of RAM (volatile memory) during runtime and stores permanent configuration files in NVRAM (`startup-config`), while the binary operating system image (`.bin`) resides in Flash memory. Administrators interact with IOS through the Command Line Interface (CLI) via Console, Telnet, or secure SSHv2.",
      example_en: "When a Cisco switch powers on, the bootstrap code loads the IOS image from `flash:c2960-lanbasek9-mz.150-2.SE4.bin` into RAM and applies `startup-config` from NVRAM."
    },
    {
      term_en: "User EXEC vs. Privileged EXEC Mode",
      simple_en: "The two foundational command execution privilege levels in Cisco IOS.",
      detail_en: "• **User EXEC Mode (Prompt: `Router>`)**: Level 1 view-only mode allowing basic diagnostic commands (`ping`, `traceroute`, `show version`), but prohibiting any system configuration changes. • **Privileged EXEC Mode (Prompt: `Router#`)**: Level 15 administrator/enable mode entered by typing `enable`. Unlocks full administrative visibility (`show running-config`), file system operations (`copy run start`, `reload`), and debug operations.",
      example_en: "Exam question: Which prompt allows saving configurations to NVRAM? Answer: Privileged EXEC mode (`Router# copy running-config startup-config`)."
    },
    {
      term_en: "RAM vs. NVRAM vs. Flash vs. ROM",
      simple_en: "The four distinct hardware memory components inside Cisco enterprise network equipment.",
      detail_en: "• **RAM (Random Access Memory)**: Volatile working memory holding the running IOS image, active routing tables, ARP tables, and the `running-config`. Contents vanish instantly upon power loss. • **NVRAM (Non-Volatile RAM)**: Retains the saved `startup-config` permanently across power cycles and reboots. • **Flash Memory**: Electronically erasable non-volatile memory storing the Cisco IOS software binary image (`.bin`). • **ROM (Read-Only Memory)**: Firmware chip housing the initial Power-On Self-Test (POST) diagnostic instructions, bootstrap loader, and the ROMMON recovery shell.",
      example_en: "If you modify a switch configuration but forget to execute `copy run start` or `write memory`, every change is lost the moment the power cable is unplugged!"
    }
  ],
  3: [
    {
      term_en: "OSI 7-Layer Reference Model",
      simple_en: "A standard architectural blueprint created by ISO dividing computer network communications into seven distinct, standardized functional layers.",
      detail_en: "From Layer 7 down to Layer 1: **Layer 7 (Application)**: User-facing interface (HTTP, DNS); **Layer 6 (Presentation)**: Data representation, compression, encryption (TLS/SSL); **Layer 5 (Session)**: Session management (RPC); **Layer 4 (Transport)**: End-to-end reliability and port multiplexing (TCP, UDP); **Layer 3 (Network)**: Logical IP addressing and best path routing (IPv4, IPv6); **Layer 2 (Data Link)**: Physical MAC addressing and framing (Ethernet 802.3, Wi-Fi 802.11); **Layer 1 (Physical)**: Binary bit encoding into physical signals (Voltage, Light, Radio).",
      example_en: "Mnemonic to remember all 7 layers from Layer 7 down: **A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing."
    },
    {
      term_en: "Encapsulation & Decapsulation (PDU)",
      simple_en: "The packaging process as data travels down the network stack (encapsulation) and unwrapping process upon arrival (decapsulation).",
      detail_en: "Each layer wraps the incoming payload with its own specialized Protocol Data Unit (PDU) header: Layer 7-5 produces **Data**; Layer 4 adds Port numbers to create a **Segment**; Layer 3 adds IP addresses to create a **Packet**; Layer 2 adds MAC addresses and an FCS trailer to create a **Frame**; Layer 1 converts the frame into raw **Bits**.",
      example_en: "When your PC sends a web request: Browser payload → TCP Segment → IP Packet → Ethernet Frame → Electrical bits on copper cable."
    }
  ]
};
