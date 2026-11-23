// ============================================================================
// CCNA NETWORK ACADEMY — INTERACTIVE CISCO IOS CLI TERMINAL SIMULATOR
// - Full Mode Hierarchy: User (>), Priv (#), Global Config ((config)#),
//   Interface ((config-if)#), VLAN ((config-vlan)#), Router ((config-router)#),
//   Line ((config-line)#), DHCP ((dhcp-config)#)
// - Authentic Cisco IOS UX: `?` context help, `Tab` auto-complete, Cisco
//   abbreviations (`en`, `conf t`, `int g0/1`, `sh ip int br`, `wr`, `no sh`),
//   `↑`/`↓` command history, virtual running-config & live `show` outputs
// - Live Lab Task Checker (0% -> 100%) comparing typed commands against any of
//   the 35 Packet Tracer Labs with actionable error diagnostics
// ============================================================================

(function () {
  "use strict";

  const MODE_HELP = {
    user: [
      ["enable", "Chuyển sang chế độ Privileged EXEC (#)"],
      ["show version", "Xem thông tin IOS & phần cứng thiết bị"],
      ["ping <ip>", "Kiểm tra kết nối ICMP tới địa chỉ đích"],
      ["exit", "Thoát phiên console"]
    ],
    priv: [
      ["configure terminal", "Vào chế độ Cấu hình Toàn cục (Global Config)"],
      ["show running-config", "Hiển thị cấu hình đang chạy trong RAM"],
      ["show ip interface brief", "Xem tóm tắt trạng thái và IP các cổng"],
      ["show vlan brief", "Xem danh sách VLAN và cổng thành viên"],
      ["show ip route", "Hiển thị bảng định tuyến Layer 3"],
      ["show ip ospf neighbor", "Xem danh sách router hàng xóm OSPF"],
      ["show spanning-tree", "Kiểm tra trạng thái STP/RSTP & Root Bridge"],
      ["copy running-config startup-config", "Lưu cấu hình RAM vào NVRAM (hoặc wr)"],
      ["write memory", "Lưu nhanh cấu hình vào NVRAM"],
      ["ping <ip>", "Gửi gói tin ICMP Echo kiểm tra thông mạng"],
      ["disable", "Quay về User EXEC (>)"]
    ],
    config: [
      ["hostname <name>", "Đặt tên thiết bị mạng"],
      ["interface <if>", "Vào cấu hình cổng (VD: g0/0, fa0/1, vlan 10)"],
      ["interface range <range>", "Cấu hình đồng thời nhiều cổng"],
      ["vlan <id>", "Tạo hoặc chỉnh sửa VLAN (1-4094)"],
      ["router ospf <pid>", "Bật giao thức định tuyến động OSPFv2"],
      ["ip route <net> <mask> <nh>", "Cấu hình tuyến đường tĩnh (Static Route)"],
      ["ip dhcp pool <name>", "Tạo DHCP Pool cấp IP động"],
      ["ip dhcp excluded-address <start> <end>", "Loại trừ dải IP không cấp phát DHCP"],
      ["enable secret <pwd>", "Đặt mật khẩu mã hóa vào Privileged EXEC"],
      ["service password-encryption", "Mã hóa mật khẩu văn bản rõ trong running-config"],
      ["banner motd #<msg>#", "Đặt thông báo cảnh báo khi đăng nhập"],
      ["line console 0 / line vty 0 4", "Vào cấu hình cổng Console hoặc VTY SSH/Telnet"],
      ["ip nat inside source list <acl> interface <if> overload", "Cấu hình PAT (NAT Overload)"],
      ["access-list <num> permit/deny ...", "Tạo Standard/Extended ACL"],
      ["end / exit", "Thoát về Privileged EXEC (#)"]
    ],
    if: [
      ["ip address <ip> <mask>", "Gán địa chỉ IPv4 và Subnet Mask cho cổng"],
      ["no shutdown", "Bật cổng hoạt động (UP/UP)"],
      ["shutdown", "Tắt cổng (Administratively Down)"],
      ["description <text>", "Ghi chú mô tả cổng"],
      ["switchport mode access", "Chuyển cổng Switch sang chế độ Access"],
      ["switchport mode trunk", "Chuyển cổng Switch sang chế độ Trunk 802.1Q"],
      ["switchport access vlan <id>", "Gán cổng Access vào VLAN"],
      ["switchport trunk allowed vlan <list>", "Cho phép các VLAN đi qua Trunk"],
      ["switchport trunk native vlan <id>", "Đặt Native VLAN cho Trunk"],
      ["switchport port-security", "Bật bảo mật Port Security"],
      ["encapsulation dot1Q <vlan>", "Bật đóng gói 802.1Q trên subinterface"],
      ["channel-group <num> mode active", "Gộp cổng EtherChannel LACP"],
      ["ip nat inside / outside", "Đánh dấu vùng NAT Inside/Outside"],
      ["standby <grp> ip <vip>", "Cấu hình HSRP Virtual Gateway IP"],
      ["exit / end", "Quay lại Global Config / Priv EXEC"]
    ],
    vlan: [
      ["name <vlan-name>", "Đặt tên cho VLAN hiện tại"],
      ["exit", "Lưu VLAN và quay lại Global Config"]
    ],
    router: [
      ["router-id <a.b.c.d>", "Đặt OSPF Router-ID thủ công"],
      ["network <ip> <wildcard> area <id>", "Quảng bá mạng vào OSPF Area"],
      ["passive-interface <if>", "Chặn gửi gói Hello OSPF ra cổng LAN"],
      ["default-information originate", "Quảng bá Default Route vào OSPF"],
      ["exit / end", "Thoát cấu hình định tuyến"]
    ],
    line: [
      ["password <pwd>", "Đặt mật khẩu truy cập line"],
      ["login / login local", "Yêu cầu xác thực khi đăng nhập"],
      ["transport input ssh", "Chỉ cho phép kết nối SSH bảo mật"],
      ["logging synchronous", "Chống log hệ thống chèn ngang lệnh đang gõ"],
      ["exit", "Quay lại Global Config"]
    ],
    dhcp: [
      ["network <ip> <mask>", "Khai báo dải mạng cấp phát DHCP"],
      ["default-router <ip>", "Khai báo Default Gateway cấp cho Client"],
      ["dns-server <ip>", "Khai báo máy chủ DNS cấp cho Client"],
      ["exit", "Quay lại Global Config"]
    ]
  };

  const AUTOCOMPLETE_DICT = [
    "enable",
    "configure terminal",
    "hostname",
    "interface GigabitEthernet0/0",
    "interface GigabitEthernet0/1",
    "interface FastEthernet0/1",
    "interface range FastEthernet0/1-24",
    "interface vlan 1",
    "ip address",
    "no shutdown",
    "shutdown",
    "description",
    "switchport mode access",
    "switchport mode trunk",
    "switchport access vlan",
    "switchport trunk allowed vlan",
    "switchport trunk native vlan",
    "switchport port-security",
    "encapsulation dot1Q",
    "channel-group 1 mode active",
    "vlan",
    "name",
    "router ospf 1",
    "router-id",
    "network",
    "passive-interface",
    "default-information originate",
    "ip route 0.0.0.0 0.0.0.0",
    "ip dhcp pool",
    "ip dhcp excluded-address",
    "default-router",
    "dns-server",
    "enable secret",
    "service password-encryption",
    "banner motd",
    "line console 0",
    "line vty 0 4",
    "transport input ssh",
    "login local",
    "show running-config",
    "show ip interface brief",
    "show vlan brief",
    "show ip route",
    "show ip ospf neighbor",
    "show spanning-tree",
    "show version",
    "copy running-config startup-config",
    "write memory",
    "ping",
    "exit",
    "end"
  ];

  function escHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normalizeIosCmd(raw) {
    let s = String(raw || "").trim().replace(/\s+/g, " ");
    // Strip leading prompt like R1(config-if)# or Switch>
    s = s.replace(/^[A-Za-z0-9_.-]+(?:\([a-z0-9-]+\))?[>#]\s*/i, "");
    return s.trim();
  }

  function expandIosCommand(raw) {
    const trimmed = String(raw || "").trim().replace(/\s+/g, " ");
    if (!trimmed) return "";
    const lower = trimmed.toLowerCase();
    const parts = trimmed.split(" ");
    const p0 = parts[0].toLowerCase();
    const p1 = (parts[1] || "").toLowerCase();
    const p2 = (parts[2] || "").toLowerCase();

    if (p0 === "en" && parts.length === 1) return "enable";
    if (p0 === "ex" && parts.length === 1) return "exit";
    if (p0 === "wr" || (p0 === "write" && (!p1 || p1.startsWith("mem")))) return "write memory";
    if (p0 === "copy" && p1.startsWith("run") && p2.startsWith("st")) return "copy running-config startup-config";
    if (p0.startsWith("conf") && (p1 === "t" || p1.startsWith("term"))) return "configure terminal";
    if (p0 === "no" && p1.startsWith("sh")) return "no shutdown";
    if (p0 === "sh" && parts.length === 1) return "show";
    if (p0 === "sh" || p0 === "show") {
      if (p1 === "run" || p1 === "running-config") return "show running-config";
      if (p1 === "ip" && p2.startsWith("int")) return "show ip interface brief";
      if (p1 === "ip" && p2.startsWith("rou")) return "show ip route";
      if (p1 === "ip" && p2.startsWith("ospf")) return "show ip ospf neighbor";
      if (p1 === "vlan" || (p1 === "vl" && (!p2 || p2.startsWith("br")))) return "show vlan brief";
      if (p1.startsWith("span")) return "show spanning-tree";
      if (p1.startsWith("ver")) return "show version";
    }
    if (p0 === "int" || p0 === "interface") {
      const rest = parts.slice(1).join(" ")
        .replace(/^g(\d)/i, "GigabitEthernet$1")
        .replace(/^gi(\d)/i, "GigabitEthernet$1")
        .replace(/^f(\d)/i, "FastEthernet$1")
        .replace(/^fa(\d)/i, "FastEthernet$1")
        .replace(/^s(\d)/i, "Serial$1")
        .replace(/^lo(\d)/i, "Loopback$1");
      return `interface ${rest}`.trim();
    }
    if (p0 === "sw" || p0 === "switchport") {
      const rest = parts.slice(1).join(" ")
        .replace(/^mo\s+ac/i, "mode access")
        .replace(/^mo\s+tr/i, "mode trunk")
        .replace(/^ac\s+vl/i, "access vlan");
      return `switchport ${rest}`.trim();
    }
    if (p0 === "ip" && p1 === "add") {
      return `ip address ${parts.slice(2).join(" ")}`.trim();
    }
    if (p0 === "host") {
      return `hostname ${parts.slice(1).join(" ")}`.trim();
    }
    if (lower === "shut") return "shutdown";
    return trimmed;
  }

  function extractLabTargetTasks(lab) {
    if (!lab || !Array.isArray(lab.cli_commands)) return [];
    const tasks = [];
    lab.cli_commands.forEach((line) => {
      const raw = String(line || "").trim();
      if (!raw || raw.startsWith("!") || raw.startsWith("#") || raw.startsWith("//")) return;
      const cmd = normalizeIosCmd(raw);
      if (!cmd || cmd.startsWith("!")) return;
      // Ignore purely informational prose lines
      if (cmd.length > 110) return;
      const expanded = expandIosCommand(cmd);
      tasks.push({
        raw: cmd,
        normalized: expanded.toLowerCase(),
        completed: false
      });
    });
    return tasks;
  }

  class CiscoIosSession {
    constructor(lab = null) {
      this.lab = lab;
      this.hostname = this.detectInitialHostname(lab);
      this.mode = "user"; // user | priv | config | if | vlan | router | line | dhcp
      this.activeInterface = "";
      this.activeVlan = "";
      this.activeRouter = "";
      this.activeLine = "";
      this.activeDhcp = "";
      this.history = [];
      this.historyIndex = -1;

      this.config = {
        enableSecret: "",
        passwordEncryption: false,
        bannerMotd: "",
        interfaces: {
          "GigabitEthernet0/0": { ip: "unassigned", mask: "", status: "administratively down", protocol: "down", mode: "routed", vlan: "1", desc: "" },
          "GigabitEthernet0/1": { ip: "unassigned", mask: "", status: "administratively down", protocol: "down", mode: "routed", vlan: "1", desc: "" },
          "FastEthernet0/1": { ip: "unassigned", mask: "", status: "up", protocol: "up", mode: "access", vlan: "1", desc: "" },
          "FastEthernet0/2": { ip: "unassigned", mask: "", status: "up", protocol: "up", mode: "access", vlan: "1", desc: "" }
        },
        vlans: {
          "1": { name: "default", status: "active", ports: ["Fa0/1", "Fa0/2"] }
        },
        routes: [],
        ospf: { pid: null, routerId: "", networks: [], passive: [] },
        dhcpPools: {},
        acls: [],
        natRules: [],
        savedToNvram: false
      };

      this.tasks = extractLabTargetTasks(lab);
    }

    detectInitialHostname(lab) {
      if (!lab || !Array.isArray(lab.nodes)) return "Router";
      const firstNetDev = lab.nodes.find((n) => n.type === "router" || n.type === "switch" || n.type === "l3switch");
      if (firstNetDev) {
        return firstNetDev.type === "router" ? "Router" : "Switch";
      }
      return "Router";
    }

    getPrompt() {
      const h = this.hostname;
      switch (this.mode) {
        case "user": return `${h}>`;
        case "priv": return `${h}#`;
        case "config": return `${h}(config)#`;
        case "if": return this.activeInterface.startsWith("range") ? `${h}(config-if-range)#` : `${h}(config-if)#`;
        case "vlan": return `${h}(config-vlan)#`;
        case "router": return `${h}(config-router)#`;
        case "line": return `${h}(config-line)#`;
        case "dhcp": return `${h}(dhcp-config)#`;
        default: return `${h}>`;
      }
    }

    getCompletionStats() {
      const total = this.tasks.length;
      const done = this.tasks.filter((t) => t.completed).length;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      return { total, done, pct };
    }

    checkAgainstLabTasks(expandedCmd) {
      if (this.tasks.length === 0) return null;
      const typedLower = expandedCmd.toLowerCase();
      let matchedAny = false;
      for (const task of this.tasks) {
        if (task.completed) continue;
        if (
          task.normalized === typedLower ||
          expandIosCommand(task.raw).toLowerCase() === typedLower ||
          (typedLower.startsWith("hostname ") && task.normalized.startsWith("hostname ")) ||
          (typedLower.startsWith("banner motd") && task.normalized.startsWith("banner motd"))
        ) {
          task.completed = true;
          matchedAny = true;
          break;
        }
      }
      return matchedAny;
    }

    getDiagnosticHints() {
      const hints = [];
      if (this.tasks.length === 0) return hints;
      const missing = this.tasks.filter((t) => !t.completed);
      if (missing.some((m) => m.normalized === "no shutdown") && Object.values(this.config.interfaces).some((i) => i.ip !== "unassigned" && i.status.includes("down"))) {
        hints.push("⚠️ Bạn đã gán IP cho interface nhưng quên lệnh `no shutdown` để bật cổng UP!");
      }
      if (missing.some((m) => m.normalized.startsWith("copy running") || m.normalized === "write memory") && missing.length <= 2) {
        hints.push("💡 Đừng quên lưu cấu hình vào NVRAM bằng `wr` hoặc `copy running-config startup-config`.");
      }
      if (this.mode === "user" && missing.length > 0) {
        hints.push("💡 Bạn đang ở User EXEC (>). Gõ `enable` rồi `configure terminal` để bắt đầu cấu hình.");
      }
      return hints;
    }

    autocomplete(partial) {
      const input = String(partial || "").trim();
      if (!input) return partial;
      const lower = input.toLowerCase();
      const matches = AUTOCOMPLETE_DICT.filter((cmd) => cmd.toLowerCase().startsWith(lower));
      if (matches.length === 1) return matches[0] + " ";
      if (matches.length > 1) {
        // Longest common prefix
        let prefix = matches[0];
        for (let i = 1; i < matches.length; i++) {
          while (!matches[i].toLowerCase().startsWith(prefix.toLowerCase()) && prefix.length > 0) {
            prefix = prefix.slice(0, -1);
          }
        }
        return prefix.length > input.length ? prefix : partial;
      }
      return expandIosCommand(input);
    }

    execute(rawInput) {
      const trimmed = String(rawInput || "").trim();
      if (!trimmed) return { output: "", type: "normal" };

      this.history.push(trimmed);
      this.historyIndex = this.history.length;

      // Context-sensitive Help `?`
      if (trimmed === "?" || trimmed.endsWith(" ?")) {
        const list = MODE_HELP[this.mode] || MODE_HELP.priv;
        const lines = list.map(([cmd, desc]) => `  ${cmd.padEnd(36, " ")} ${desc}`);
        return {
          output: `Exec/Config commands available in mode [${this.getPrompt()}]:\n${lines.join("\n")}`,
          type: "help"
        };
      }

      const expanded = expandIosCommand(trimmed);
      const lower = expanded.toLowerCase();
      const parts = expanded.split(/\s+/);
      const cmd0 = parts[0].toLowerCase();

      // Universal commands
      if (lower === "clear" || lower === "cls") {
        return { output: "", type: "clear" };
      }

      if (lower === "end") {
        if (this.mode !== "user") {
          this.mode = "priv";
          this.checkAgainstLabTasks(expanded);
          return { output: "%SYS-5-CONFIG_I: Configured from console by console", type: "sys" };
        }
        return { output: "", type: "normal" };
      }

      if (lower === "exit") {
        this.checkAgainstLabTasks(expanded);
        if (this.mode === "if" || this.mode === "vlan" || this.mode === "router" || this.mode === "line" || this.mode === "dhcp") {
          this.mode = "config";
        } else if (this.mode === "config") {
          this.mode = "priv";
          return { output: "%SYS-5-CONFIG_I: Configured from console by console", type: "sys" };
        } else if (this.mode === "priv") {
          this.mode = "user";
        }
        return { output: "", type: "normal" };
      }

      // Support `do <command>` from config modes
      if (cmd0 === "do" && this.mode !== "user" && this.mode !== "priv") {
        const subCmd = parts.slice(1).join(" ");
        const savedMode = this.mode;
        this.mode = "priv";
        const res = this.execute(subCmd);
        this.mode = savedMode;
        return res;
      }

      // USER EXEC MODE (>)
      if (this.mode === "user") {
        if (lower === "enable") {
          this.mode = "priv";
          this.checkAgainstLabTasks(expanded);
          return { output: "", type: "normal" };
        }
        if (lower.startsWith("ping ")) {
          return this.runPing(parts[1]);
        }
        if (lower === "show version") {
          return this.showVersion();
        }
        return {
          output: `% Invalid input detected at '^' marker. (Bạn đang ở User EXEC '>' — hãy gõ 'enable' hoặc '?' để xem lệnh hỗ trợ)`,
          type: "error"
        };
      }

      // PRIVILEGED EXEC MODE (#)
      if (this.mode === "priv") {
        if (lower === "configure terminal") {
          this.mode = "config";
          this.checkAgainstLabTasks(expanded);
          return { output: "Enter configuration commands, one per line.  End with CNTL/Z.", type: "sys" };
        }
        if (lower === "disable") {
          this.mode = "user";
          return { output: "", type: "normal" };
        }
        if (lower === "write memory" || lower === "copy running-config startup-config") {
          this.config.savedToNvram = true;
          this.checkAgainstLabTasks(expanded);
          return { output: "Building configuration...\n[OK]", type: "success" };
        }
        if (lower === "show ip interface brief") {
          this.checkAgainstLabTasks(expanded);
          return this.showIpIntBrief();
        }
        if (lower === "show vlan brief") {
          this.checkAgainstLabTasks(expanded);
          return this.showVlanBrief();
        }
        if (lower === "show running-config") {
          this.checkAgainstLabTasks(expanded);
          return this.showRunningConfig();
        }
        if (lower === "show ip route") {
          this.checkAgainstLabTasks(expanded);
          return this.showIpRoute();
        }
        if (lower === "show ip ospf neighbor") {
          this.checkAgainstLabTasks(expanded);
          return this.showOspfNeighbor();
        }
        if (lower === "show spanning-tree") {
          this.checkAgainstLabTasks(expanded);
          return this.showSpanningTree();
        }
        if (lower === "show version") {
          return this.showVersion();
        }
        if (lower.startsWith("ping ")) {
          this.checkAgainstLabTasks(expanded);
          return this.runPing(parts[1]);
        }
        return {
          output: `% Unknown command or computer name, or unable to find computer address. (Gõ '?' để xem lệnh Privileged EXEC)`,
          type: "error"
        };
      }

      // GLOBAL CONFIG MODE & SUBMODES
      if (cmd0 === "hostname" && parts[1]) {
        this.hostname = parts[1];
        this.mode = "config";
        this.checkAgainstLabTasks(expanded);
        return { output: "", type: "normal" };
      }

      if (cmd0 === "interface" && parts[1]) {
        const ifName = parts.slice(1).join(" ");
        this.mode = "if";
        this.activeInterface = ifName;
        if (!ifName.toLowerCase().startsWith("range") && !this.config.interfaces[ifName]) {
          this.config.interfaces[ifName] = { ip: "unassigned", mask: "", status: "administratively down", protocol: "down", mode: "routed", vlan: "1", desc: "" };
        }
        this.checkAgainstLabTasks(expanded);
        return { output: "", type: "normal" };
      }

      if (cmd0 === "vlan" && parts[1] && /^\d+$/.test(parts[1])) {
        this.mode = "vlan";
        this.activeVlan = parts[1];
        if (!this.config.vlans[parts[1]]) {
          this.config.vlans[parts[1]] = { name: `VLAN${String(parts[1]).padStart(4, "0")}`, status: "active", ports: [] };
        }
        this.checkAgainstLabTasks(expanded);
        return { output: "", type: "normal" };
      }

      if (cmd0 === "router" && parts[1]) {
        this.mode = "router";
        this.activeRouter = parts.slice(1).join(" ");
        if (parts[1].toLowerCase() === "ospf") {
          this.config.ospf.pid = parts[2] || "1";
        }
        this.checkAgainstLabTasks(expanded);
        return { output: "", type: "normal" };
      }

      if (cmd0 === "line" && parts[1]) {
        this.mode = "line";
        this.activeLine = parts.slice(1).join(" ");
        this.checkAgainstLabTasks(expanded);
        return { output: "", type: "normal" };
      }

      if (lower.startsWith("ip dhcp pool ") && parts[3]) {
        this.mode = "dhcp";
        this.activeDhcp = parts[3];
        if (!this.config.dhcpPools[parts[3]]) {
          this.config.dhcpPools[parts[3]] = { network: "", router: "", dns: "" };
        }
        this.checkAgainstLabTasks(expanded);
        return { output: "", type: "normal" };
      }

      // Mode-specific commands
      if (this.mode === "if") {
        const curIf = this.config.interfaces[this.activeInterface];
        if (lower.startsWith("ip address ")) {
          const ip = parts[2];
          const mask = parts[3];
          if (!ip || !mask || !/^\d+\.\d+\.\d+\.\d+$/.test(ip) || !/^\d+\.\d+\.\d+\.\d+$/.test(mask)) {
            return { output: `% Incomplete or invalid IPv4/Subnet Mask. Cú pháp chuẩn: ip address <IP> <SubnetMask>`, type: "error" };
          }
          if (curIf) {
            curIf.ip = ip;
            curIf.mask = mask;
          }
          this.checkAgainstLabTasks(expanded);
          return { output: "", type: "normal" };
        }
        if (lower === "no shutdown") {
          if (curIf) {
            curIf.status = "up";
            curIf.protocol = "up";
          }
          this.checkAgainstLabTasks(expanded);
          return {
            output: `%LINK-5-CHANGED: Interface ${this.activeInterface}, changed state to up\n%LINEPROTO-5-UPDOWN: Line protocol on Interface ${this.activeInterface}, changed state to up`,
            type: "sys"
          };
        }
        if (lower === "shutdown") {
          if (curIf) {
            curIf.status = "administratively down";
            curIf.protocol = "down";
          }
          this.checkAgainstLabTasks(expanded);
          return { output: `%LINK-5-CHANGED: Interface ${this.activeInterface}, changed state to administratively down`, type: "sys" };
        }
        if (lower.startsWith("description ")) {
          if (curIf) curIf.desc = parts.slice(1).join(" ");
          this.checkAgainstLabTasks(expanded);
          return { output: "", type: "normal" };
        }
        if (lower.startsWith("switchport ")) {
          if (curIf) {
            if (lower.includes("mode access")) curIf.mode = "access";
            if (lower.includes("mode trunk")) curIf.mode = "trunk";
            const accMatch = lower.match(/access vlan (\d+)/);
            if (accMatch) {
              curIf.vlan = accMatch[1];
              if (!this.config.vlans[accMatch[1]]) {
                this.config.vlans[accMatch[1]] = { name: `VLAN${accMatch[1].padStart(4, "0")}`, status: "active", ports: [] };
              }
              if (!this.config.vlans[accMatch[1]].ports.includes(this.activeInterface)) {
                this.config.vlans[accMatch[1]].ports.push(this.activeInterface);
              }
            }
          }
          this.checkAgainstLabTasks(expanded);
          return { output: "", type: "normal" };
        }
        if (lower.startsWith("encapsulation dot1q") || lower.startsWith("channel-group") || lower.startsWith("ip nat ") || lower.startsWith("standby ") || lower.startsWith("spanning-tree ") || lower.startsWith("ip access-group ") || lower.startsWith("ip helper-address ") || lower.startsWith("ip ospf ")) {
          this.checkAgainstLabTasks(expanded);
          return { output: "", type: "normal" };
        }
      }

      if (this.mode === "vlan") {
        if (cmd0 === "name" && parts[1]) {
          if (this.config.vlans[this.activeVlan]) {
            this.config.vlans[this.activeVlan].name = parts.slice(1).join(" ");
          }
          this.checkAgainstLabTasks(expanded);
          return { output: "", type: "normal" };
        }
      }

      if (this.mode === "router") {
        if (cmd0 === "router-id" && parts[1]) {
          this.config.ospf.routerId = parts[1];
          this.checkAgainstLabTasks(expanded);
          return { output: "", type: "normal" };
        }
        if (cmd0 === "network" && parts[1]) {
          this.config.ospf.networks.push(parts.slice(1).join(" "));
          this.checkAgainstLabTasks(expanded);
          return { output: "", type: "normal" };
        }
        if (cmd0 === "passive-interface" && parts[1]) {
          this.config.ospf.passive.push(parts[1]);
          this.checkAgainstLabTasks(expanded);
          return { output: "", type: "normal" };
        }
        if (lower.startsWith("default-information")) {
          this.checkAgainstLabTasks(expanded);
          return { output: "", type: "normal" };
        }
      }

      if (this.mode === "dhcp") {
        const pool = this.config.dhcpPools[this.activeDhcp];
        if (pool) {
          if (cmd0 === "network") pool.network = parts.slice(1).join(" ");
          if (cmd0 === "default-router") pool.router = parts[1] || "";
          if (cmd0 === "dns-server") pool.dns = parts[1] || "";
        }
        this.checkAgainstLabTasks(expanded);
        return { output: "", type: "normal" };
      }

      if (this.mode === "line") {
        if (["password", "login", "transport", "logging", "exec-timeout"].includes(cmd0)) {
          this.checkAgainstLabTasks(expanded);
          return { output: "", type: "normal" };
        }
      }

      // Global config general commands
      if (this.mode === "config") {
        if (lower.startsWith("ip route ")) {
          this.config.routes.push(parts.slice(2).join(" "));
          this.checkAgainstLabTasks(expanded);
          return { output: "", type: "normal" };
        }
        if (lower.startsWith("enable secret ")) {
          this.config.enableSecret = parts.slice(2).join(" ");
          this.checkAgainstLabTasks(expanded);
          return { output: "", type: "normal" };
        }
        if (lower === "service password-encryption") {
          this.config.passwordEncryption = true;
          this.checkAgainstLabTasks(expanded);
          return { output: "", type: "normal" };
        }
        if (lower.startsWith("banner motd")) {
          this.config.bannerMotd = parts.slice(2).join(" ");
          this.checkAgainstLabTasks(expanded);
          return { output: "", type: "normal" };
        }
        if (
          lower.startsWith("ip dhcp excluded-address") ||
          lower.startsWith("access-list ") ||
          lower.startsWith("ip access-list ") ||
          lower.startsWith("ip nat ") ||
          lower.startsWith("ip default-gateway ") ||
          lower.startsWith("ip domain-name ") ||
          lower.startsWith("username ") ||
          lower.startsWith("crypto key ") ||
          lower.startsWith("ip ssh ") ||
          lower.startsWith("spanning-tree ") ||
          lower.startsWith("ip routing") ||
          lower.startsWith("ntp ") ||
          lower.startsWith("logging ") ||
          lower.startsWith("snmp-server ") ||
          lower.startsWith("no ip domain-lookup")
        ) {
          this.checkAgainstLabTasks(expanded);
          return { output: "", type: "normal" };
        }
      }

      return {
        output: `% Invalid input detected at '^' marker for "${trimmed}". Gõ '?' để xem danh sách lệnh hợp lệ trong chế độ ${this.getPrompt()}.`,
        type: "error"
      };
    }

    runPing(targetIp) {
      if (!targetIp || !/^\d+\.\d+\.\d+\.\d+$/.test(targetIp)) {
        return { output: "% Invalid IP address. Cú pháp: ping 192.168.1.1", type: "error" };
      }
      return {
        output: `Type escape sequence to abort.\nSending 5, 100-byte ICMP Echos to ${targetIp}, timeout is 2 seconds:\n.!!!!\nSuccess rate is 80 percent (4/5), round-trip min/avg/max = 1/2/4 ms`,
        type: "success"
      };
    }

    showVersion() {
      return {
        output: `Cisco IOS Software, C2900 Software (C2900-UNIVERSALK9-M), Version 15.7(3)M2\nCCNA NETWORK ACADEMY Virtual IOS Engine v2.0\n${this.hostname} uptime is 1 hour, 24 minutes\nConfiguration register is 0x2102`,
        type: "normal"
      };
    }

    showIpIntBrief() {
      const header = "Interface                  IP-Address      OK? Method Status                Protocol";
      const rows = Object.entries(this.config.interfaces).map(([name, info]) => {
        const method = info.ip === "unassigned" ? "unset" : "manual";
        return `${name.padEnd(27)}${info.ip.padEnd(16)}YES ${method.padEnd(7)}${info.status.padEnd(22)}${info.protocol}`;
      });
      return { output: `${header}\n${rows.join("\n")}`, type: "normal" };
    }

    showVlanBrief() {
      const header = "VLAN Name                             Status    Ports\n---- -------------------------------- --------- -------------------------------";
      const rows = Object.entries(this.config.vlans).map(([id, v]) => {
        return `${String(id).padEnd(5)}${v.name.padEnd(33)}${v.status.padEnd(10)}${(v.ports || []).join(", ")}`;
      });
      return { output: `${header}\n${rows.join("\n")}`, type: "normal" };
    }

    showIpRoute() {
      const lines = [
        "Codes: L - local, C - connected, S - static, O - OSPF, * - candidate default",
        ""
      ];
      Object.entries(this.config.interfaces).forEach(([name, info]) => {
        if (info.ip !== "unassigned" && info.status === "up") {
          lines.push(`C    ${info.ip} is directly connected, ${name}`);
        }
      });
      this.config.routes.forEach((r) => {
        lines.push(`S${r.startsWith("0.0.0.0") ? "*" : " "}   ${r}`);
      });
      if (this.config.ospf.networks.length > 0) {
        lines.push(`O    OSPF Process ${this.config.ospf.pid || 1} active (${this.config.ospf.networks.length} advertised networks)`);
      }
      if (lines.length === 2) lines.push("Gateway of last resort is not set (Chưa có tuyến đường nào UP)");
      return { output: lines.join("\n"), type: "normal" };
    }

    showOspfNeighbor() {
      if (!this.config.ospf.pid) {
        return { output: "% OSPF process chưa được cấu hình (dùng 'router ospf 1').", type: "normal" };
      }
      return {
        output: `Neighbor ID     Pri   State           Dead Time   Address         Interface\n2.2.2.2           1   FULL/DR         00:00:34    10.0.0.2        GigabitEthernet0/0`,
        type: "normal"
      };
    }

    showSpanningTree() {
      return {
        output: `VLAN0001\n  Spanning tree enabled protocol rstp\n  Root ID    Priority    32769\n             Address     0001.42A1.8801\n             This bridge is the root\n  Interface        Role Sts Cost      Prio.Nbr Type\n  ---------------- ---- --- --------- -------- ----\n  Fa0/1            Desg FWD 19        128.1    P2p`,
        type: "normal"
      };
    }

    showRunningConfig() {
      const lines = [
        "Building configuration...",
        "Current configuration : 1248 bytes",
        "!",
        `hostname ${this.hostname}`,
        "!"
      ];
      if (this.config.passwordEncryption) lines.push("service password-encryption");
      if (this.config.enableSecret) lines.push("enable secret 5 $1$mERr$CCNA_HASHED_SECRET");
      if (this.config.bannerMotd) lines.push(`banner motd ${this.config.bannerMotd}`);
      Object.entries(this.config.interfaces).forEach(([name, info]) => {
        lines.push(`interface ${name}`);
        if (info.desc) lines.push(` description ${info.desc}`);
        if (info.ip !== "unassigned") lines.push(` ip address ${info.ip} ${info.mask}`);
        if (info.mode === "access") lines.push(` switchport mode access\n switchport access vlan ${info.vlan}`);
        if (info.mode === "trunk") lines.push(" switchport mode trunk");
        if (info.status.includes("down")) lines.push(" shutdown");
        lines.push("!");
      });
      if (this.config.ospf.pid) {
        lines.push(`router ospf ${this.config.ospf.pid}`);
        if (this.config.ospf.routerId) lines.push(` router-id ${this.config.ospf.routerId}`);
        this.config.ospf.networks.forEach((n) => lines.push(` network ${n}`));
        this.config.ospf.passive.forEach((p) => lines.push(` passive-interface ${p}`));
        lines.push("!");
      }
      this.config.routes.forEach((r) => lines.push(`ip route ${r}`));
      lines.push("end");
      return { output: lines.join("\n"), type: "normal" };
    }
  }

  function renderTerminalWidget(containerEl, lab = null) {
    const session = new CiscoIosSession(lab);
    const hasLabTasks = session.tasks.length > 0;

    containerEl.innerHTML = `
      <div class="ios-sim-shell">
        <div class="ios-sim-topbar">
          <div class="ios-sim-dots">
            <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
            <span class="ios-sim-title">Cisco IOS CLI Simulator ${lab ? `— Lab #${lab.id}` : "— Sandbox Router/Switch"}</span>
          </div>
          <div class="ios-sim-controls">
            <button type="button" class="ios-mini-btn" data-act="help" title="Gõ ? để xem lệnh hỗ trợ">? Help</button>
            <button type="button" class="ios-mini-btn" data-act="hint" title="Gợi ý lệnh tiếp theo của bài Lab">💡 Gợi ý lệnh</button>
            <button type="button" class="ios-mini-btn" data-act="clear" title="Xóa màn hình">🧹 Clear</button>
            <button type="button" class="ios-mini-btn" data-act="reset" title="Khởi động lại thiết bị">🔄 Reset</button>
          </div>
        </div>

        ${hasLabTasks ? `
        <div class="ios-lab-checker">
          <div class="ios-checker-head">
            <span>🎯 <strong>Live Lab Task Checker</strong> — Tiến độ cấu hình CLI</span>
            <span class="ios-checker-score">0 / ${session.tasks.length} lệnh (0%)</span>
          </div>
          <div class="ios-checker-bar"><div class="ios-checker-fill" style="width:0%"></div></div>
          <div class="ios-checker-diag"></div>
          <details class="ios-checker-checklist">
            <summary>Xem danh sách ${session.tasks.length} lệnh mục tiêu cần cấu hình</summary>
            <ul class="ios-task-list"></ul>
          </details>
        </div>` : ""}

        <div class="ios-sim-screen" tabindex="0">
          <div class="ios-sim-output">
            <div class="ios-line sys">Cisco IOS Software [CCNA NETWORK ACADEMY Web Emulator]</div>
            <div class="ios-line sys">Gõ <code>?</code> để xem lệnh hợp lệ, nhấn <code>Tab</code> để tự động hoàn thành, <code>↑/↓</code> để xem lịch sử lệnh.</div>
            <div class="ios-line sys">Bắt đầu bằng lệnh <code>enable</code> → <code>configure terminal</code>.</div>
          </div>
          <div class="ios-sim-input-line">
            <span class="ios-prompt">${escHtml(session.getPrompt())}</span>
            <input type="text" class="ios-input" autocomplete="off" spellcheck="false" aria-label="Cisco IOS CLI command input" placeholder="Gõ lệnh Cisco IOS (VD: en, conf t, sh ip int br, ?)..." />
          </div>
        </div>
      </div>
    `;

    const outputEl = containerEl.querySelector(".ios-sim-output");
    const promptEl = containerEl.querySelector(".ios-prompt");
    const inputEl = containerEl.querySelector(".ios-input");
    const screenEl = containerEl.querySelector(".ios-sim-screen");

    function updateCheckerUI() {
      if (!hasLabTasks) return;
      const { total, done, pct } = session.getCompletionStats();
      const scoreEl = containerEl.querySelector(".ios-checker-score");
      const fillEl = containerEl.querySelector(".ios-checker-fill");
      const diagEl = containerEl.querySelector(".ios-checker-diag");
      const listEl = containerEl.querySelector(".ios-task-list");

      if (scoreEl) scoreEl.textContent = `${done} / ${total} lệnh (${pct}%)`;
      if (fillEl) {
        fillEl.style.width = `${pct}%`;
        fillEl.classList.toggle("is-complete", pct === 100);
      }
      if (diagEl) {
        const hints = session.getDiagnosticHints();
        diagEl.innerHTML = pct === 100
          ? `<div class="ios-diag-ok">🎉 Xuất sắc! Bạn đã hoàn thành 100% lệnh CLI của bài Lab #${lab.id}!</div>`
          : hints.map((h) => `<div class="ios-diag-warn">${escHtml(h)}</div>`).join("");
      }
      if (listEl) {
        listEl.innerHTML = session.tasks
          .map((t) => `<li class="${t.completed ? "done" : ""}">${t.completed ? "✅" : "⬜"} <code>${escHtml(t.raw)}</code></li>`)
          .join("");
      }
    }

    function appendLine(text, cls = "normal") {
      if (!text) return;
      const div = document.createElement("div");
      div.className = `ios-line ${cls}`;
      div.textContent = text;
      outputEl.appendChild(div);
      screenEl.scrollTop = screenEl.scrollHeight;
    }

    function submitCommand(cmdText) {
      const promptNow = session.getPrompt();
      const echo = document.createElement("div");
      echo.className = "ios-line cmd-echo";
      echo.textContent = `${promptNow} ${cmdText}`;
      outputEl.appendChild(echo);

      const res = session.execute(cmdText);
      if (res.type === "clear") {
        outputEl.innerHTML = "";
      } else if (res.output) {
        appendLine(res.output, res.type);
      }

      promptEl.textContent = session.getPrompt();
      updateCheckerUI();
      screenEl.scrollTop = screenEl.scrollHeight;
    }

    screenEl.addEventListener("click", () => inputEl.focus());

    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const val = inputEl.value;
        inputEl.value = "";
        submitCommand(val);
      } else if (e.key === "Tab") {
        e.preventDefault();
        inputEl.value = session.autocomplete(inputEl.value);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (session.history.length > 0) {
          session.historyIndex = Math.max(0, session.historyIndex - 1);
          inputEl.value = session.history[session.historyIndex] || "";
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (session.historyIndex < session.history.length - 1) {
          session.historyIndex++;
          inputEl.value = session.history[session.historyIndex] || "";
        } else {
          session.historyIndex = session.history.length;
          inputEl.value = "";
        }
      } else if (e.ctrlKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        submitCommand("end");
      }
    });

    containerEl.querySelectorAll(".ios-mini-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const act = btn.dataset.act;
        if (act === "help") {
          submitCommand("?");
        } else if (act === "clear") {
          outputEl.innerHTML = "";
        } else if (act === "reset") {
          renderTerminalWidget(containerEl, lab);
        } else if (act === "hint") {
          const nextTask = session.tasks.find((t) => !t.completed);
          if (nextTask) {
            inputEl.value = nextTask.raw;
            inputEl.focus();
            appendLine(`💡 Gợi ý lệnh tiếp theo: ${nextTask.raw} (Nhấn Enter để thực thi)`, "help");
          } else {
            appendLine("💡 Gợi ý: Thử gõ `enable`, `configure terminal`, `hostname R1`, `interface g0/0`, `ip address 192.168.1.1 255.255.255.0`, `no shutdown`, `show ip interface brief`.", "help");
          }
        }
      });
    });

    updateCheckerUI();
  }

  // Standalone Modal for opening Cisco IOS Terminal anywhere
  function ensureStandaloneModalDom() {
    if (document.getElementById("ios-sim-modal")) return;
    const html = `
      <div class="ios-sim-modal" id="ios-sim-modal" role="dialog" aria-modal="true" aria-label="Trình giả lập Cisco IOS CLI" hidden>
        <div class="cmd-palette-backdrop" id="ios-sim-backdrop"></div>
        <div class="ios-sim-modal-box">
          <header class="ios-sim-modal-header">
            <div style="display:flex;align-items:center;gap:0.65rem;flex-wrap:wrap;">
              <span class="brand-badge">CISCO IOS CLI</span>
              <h3 style="margin:0;font-size:1.02rem;">Trình Giả Lập Dòng Lệnh Cisco IOS Tương Tác</h3>
              <select id="ios-sim-lab-selector" class="flashcard-select" aria-label="Chọn bài Lab để chấm điểm">
                <option value="0">Chế độ Tự do (Sandbox Router/Switch)</option>
              </select>
            </div>
            <button type="button" class="shortcuts-close-btn" id="ios-sim-close-btn" aria-label="Đóng">✕</button>
          </header>
          <div class="ios-sim-modal-body" id="ios-sim-modal-body"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", html);

    const sel = document.getElementById("ios-sim-lab-selector");
    if (sel && typeof PACKET_TRACER_LABS !== "undefined") {
      PACKET_TRACER_LABS.forEach((l) => {
        const opt = document.createElement("option");
        opt.value = String(l.id);
        opt.textContent = `Lab ${String(l.id).padStart(2, "0")}: ${l.title_vi.replace(/^Lab \d+:\s*/, "").substring(0, 48)}`;
        sel.appendChild(opt);
      });
      sel.addEventListener("change", () => {
        const lid = parseInt(sel.value, 10);
        const targetLab = lid > 0 ? PACKET_TRACER_LABS.find((x) => x.id === lid) : null;
        renderTerminalWidget(document.getElementById("ios-sim-modal-body"), targetLab);
      });
    }

    document.getElementById("ios-sim-backdrop")?.addEventListener("click", closeStandaloneIosTerminal);
    document.getElementById("ios-sim-close-btn")?.addEventListener("click", closeStandaloneIosTerminal);
  }

  function openStandaloneIosTerminal(labId = 0) {
    ensureStandaloneModalDom();
    const modal = document.getElementById("ios-sim-modal");
    const sel = document.getElementById("ios-sim-lab-selector");
    const body = document.getElementById("ios-sim-modal-body");
    if (!modal || !body) return;
    modal.hidden = false;
    const lid = Number(labId) || 0;
    if (sel) sel.value = String(lid);
    const targetLab = lid > 0 && typeof PACKET_TRACER_LABS !== "undefined"
      ? PACKET_TRACER_LABS.find((x) => x.id === lid)
      : null;
    renderTerminalWidget(body, targetLab);
  }

  function closeStandaloneIosTerminal() {
    const modal = document.getElementById("ios-sim-modal");
    if (modal) modal.hidden = true;
  }

  // Auto-enhance every rendered `.pt-lab-card` with an inline Cisco IOS CLI Simulator toggle
  function enhanceRenderedLabCards() {
    if (typeof PACKET_TRACER_LABS === "undefined") return;
    document.querySelectorAll(".pt-lab-card").forEach((card) => {
      if (card.dataset.iosEnhanced === "1") return;
      card.dataset.iosEnhanced = "1";
      const match = (card.id || "").match(/pt-lab-(\d+)/);
      if (!match) return;
      const labId = parseInt(match[1], 10);
      const lab = PACKET_TRACER_LABS.find((l) => l.id === labId);
      if (!lab) return;

      const body = card.querySelector(".pt-lab-body");
      if (!body) return;

      const wrap = document.createElement("div");
      wrap.className = "ios-inline-wrapper";
      wrap.innerHTML = `
        <div class="ios-inline-banner">
          <div>
            <strong>💻 Thực hành Cisco IOS CLI trực tiếp trên Web (Kèm chấm điểm Lab #${lab.id})</strong>
            <div style="font-size:0.82rem;color:var(--text-muted);">Hỗ trợ Tab auto-complete, gõ <code>?</code> xem gợi ý, viết tắt chuẩn Cisco và chấm tiến độ 0% → 100%.</div>
          </div>
          <button type="button" class="ws-btn primary ios-toggle-inline-btn">▶ Mở Terminal Lab #${lab.id}</button>
        </div>
        <div class="ios-inline-mount" hidden></div>
      `;
      body.appendChild(wrap);

      const toggleBtn = wrap.querySelector(".ios-toggle-inline-btn");
      const mountEl = wrap.querySelector(".ios-inline-mount");
      let mounted = false;

      toggleBtn.addEventListener("click", () => {
        const isHidden = mountEl.hidden;
        mountEl.hidden = !isHidden;
        toggleBtn.textContent = isHidden ? `▾ Thu gọn Terminal Lab #${lab.id}` : `▶ Mở Terminal Lab #${lab.id}`;
        if (isHidden && !mounted) {
          mounted = true;
          renderTerminalWidget(mountEl, lab);
        }
      });
    });
  }

  function initIosSimulatorObserver() {
    const detail = document.getElementById("module-detail");
    if (!detail) return;
    enhanceRenderedLabCards();
    const obs = new MutationObserver(() => enhanceRenderedLabCards());
    obs.observe(detail, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initIosSimulatorObserver);
  } else {
    initIosSimulatorObserver();
  }

  window.openStandaloneIosTerminal = openStandaloneIosTerminal;
  window.closeStandaloneIosTerminal = closeStandaloneIosTerminal;
  window.mountLabIosSimulator = renderTerminalWidget;
  window.CiscoIosSession = CiscoIosSession;
})();
