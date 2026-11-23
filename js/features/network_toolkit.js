// ============================================================================
// CCNA NETWORK ACADEMY — INTERACTIVE NETWORK ENGINEER TOOLKIT
// 1. Visual Subnet & VLSM Architect:
//    - Single IP/CIDR Analyzer with 32-bit Binary Color Grid (Network / Subnet / Host),
//      Magic Number step-by-step teacher walkthrough, Network ID, First/Last IP,
//      Broadcast, Subnet Mask, Wildcard Mask (OSPF/ACL)
//    - Multi-Department VLSM Planner with largest-first sorting, overflow check,
//      utilization %, and copyable Cisco IOS interface configuration
// 2. Interactive Packet Flow & OSI 7-Layer PDU Inspector:
//    - Auto-attaches "▶️ Mô phỏng gửi gói tin (Simulate Ping / PDU)" to all 35 Lab SVGs
//    - Animates packet envelope hop-by-hop (PC -> Switch -> Router -> Destination)
//    - Live OSI 7-Layer PDU Inspector showing Src/Dst MAC, 802.1Q VLAN Tag,
//      Src/Dst IP, TTL decrement, CAM Table / LPM Routing / NAT translation
// ============================================================================

(function () {
  "use strict";

  function escHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ==========================================================================
  // PART A: VISUAL SUBNET & VLSM ARCHITECT
  // ==========================================================================
  function ipToInt(ipStr) {
    const parts = String(ipStr || "").trim().split(".").map(Number);
    if (parts.length !== 4 || parts.some((n) => isNaN(n) || n < 0 || n > 255)) return null;
    return (((parts[0] << 24) >>> 0) + ((parts[1] << 16) >>> 0) + ((parts[2] << 8) >>> 0) + (parts[3] >>> 0)) >>> 0;
  }

  function intToIp(num) {
    const u = num >>> 0;
    return [(u >>> 24) & 255, (u >>> 16) & 255, (u >>> 8) & 255, u & 255].join(".");
  }

  function intToBin32(num) {
    return (num >>> 0).toString(2).padStart(32, "0");
  }

  function prefixToMaskInt(prefix) {
    if (prefix === 0) return 0;
    return (0xffffffff << (32 - prefix)) >>> 0;
  }

  function getClassfulPrefix(firstOctet) {
    if (firstOctet < 128) return { cls: "Class A", basePrefix: 8 };
    if (firstOctet < 192) return { cls: "Class B", basePrefix: 16 };
    if (firstOctet < 224) return { cls: "Class C", basePrefix: 24 };
    if (firstOctet < 240) return { cls: "Class D (Multicast)", basePrefix: 24 };
    return { cls: "Class E (Experimental)", basePrefix: 24 };
  }

  function isPrivateIp(ipInt) {
    const a = (ipInt >>> 24) & 255;
    const b = (ipInt >>> 16) & 255;
    if (a === 10) return "Private (RFC 1918: 10.0.0.0/8)";
    if (a === 172 && b >= 16 && b <= 31) return "Private (RFC 1918: 172.16.0.0/12)";
    if (a === 192 && b === 168) return "Private (RFC 1918: 192.168.0.0/16)";
    if (a === 127) return "Loopback (127.0.0.0/8)";
    if (a === 169 && b === 254) return "APIPA Link-Local (169.254.0.0/16)";
    return "Public IPv4";
  }

  function analyzeCidr(cidrInput) {
    const match = String(cidrInput || "").trim().match(/^(\d+\.\d+\.\d+\.\d+)\s*\/\s*(\d+)$/);
    if (!match) return { error: "Định dạng không hợp lệ. Vui lòng nhập theo chuẩn IP/CIDR (VD: 192.168.10.64/26)." };
    const ipInt = ipToInt(match[1]);
    const prefix = parseInt(match[2], 10);
    if (ipInt === null || isNaN(prefix) || prefix < 0 || prefix > 32) {
      return { error: "Địa chỉ IP (0-255) hoặc Prefix (/0 đến /32) không hợp lệ." };
    }

    const maskInt = prefixToMaskInt(prefix);
    const wildcardInt = (~maskInt) >>> 0;
    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | wildcardInt) >>> 0;
    const totalAddresses = Math.pow(2, 32 - prefix);
    const usableHosts = prefix <= 30 ? Math.max(0, totalAddresses - 2) : (prefix === 31 ? 2 : 1);
    const firstUsable = prefix <= 30 ? intToIp(networkInt + 1) : intToIp(networkInt);
    const lastUsable = prefix <= 30 ? intToIp(broadcastInt - 1) : intToIp(broadcastInt);

    const firstOctet = (ipInt >>> 24) & 255;
    const { cls, basePrefix } = getClassfulPrefix(firstOctet);
    const subnetBits = Math.max(0, prefix - basePrefix);
    const hostBits = 32 - prefix;

    // Interesting octet & Magic Number
    const maskOctets = intToIp(maskInt).split(".").map(Number);
    let interestingIdx = 3;
    for (let i = 0; i < 4; i++) {
      if (maskOctets[i] < 255) {
        interestingIdx = i;
        break;
      }
    }
    const interestingMaskVal = maskOctets[interestingIdx];
    const magicNumber = 256 - interestingMaskVal;

    return {
      ip: match[1],
      ipInt,
      prefix,
      mask: intToIp(maskInt),
      maskInt,
      wildcard: intToIp(wildcardInt),
      network: intToIp(networkInt),
      networkInt,
      broadcast: intToIp(broadcastInt),
      firstUsable,
      lastUsable,
      totalAddresses,
      usableHosts,
      cls,
      basePrefix,
      subnetBits,
      hostBits,
      interestingIdx,
      interestingMaskVal,
      magicNumber,
      ipScope: isPrivateIp(ipInt)
    };
  }

  function renderBinaryBitGrid(info) {
    const ipBin = intToBin32(info.ipInt);
    const maskBin = intToBin32(info.maskInt);
    const netBitsCount = Math.min(info.basePrefix, info.prefix);
    const subEnd = info.prefix;

    const buildRow = (label, binStr) => {
      let html = `<div class="bin-row"><span class="bin-row-label">${label}</span><div class="bin-octets">`;
      for (let oct = 0; oct < 4; oct++) {
        html += `<div class="bin-octet">`;
        for (let b = 0; b < 8; b++) {
          const bitIdx = oct * 8 + b;
          const bit = binStr[bitIdx];
          let role = "host";
          if (bitIdx < netBitsCount) role = "net";
          else if (bitIdx < subEnd) role = "sub";
          html += `<span class="bin-bit bit-${role}" title="Bit ${bitIdx + 1}: ${role.toUpperCase()}">${bit}</span>`;
        }
        html += `</div>`;
      }
      html += `</div></div>`;
      return html;
    };

    return `
      <div class="bin-visualizer">
        <div class="bin-legend">
          <span><i class="bit-swatch net"></i> Network (${netBitsCount} bit)</span>
          <span><i class="bit-swatch sub"></i> Subnet (${info.subnetBits} bit mượn)</span>
          <span><i class="bit-swatch host"></i> Host (${info.hostBits} bit)</span>
        </div>
        ${buildRow("IPv4 Binary", ipBin)}
        ${buildRow("Subnet Mask", maskBin)}
      </div>
    `;
  }

  function computeVlsmAllocation(baseCidr, depts) {
    const base = analyzeCidr(baseCidr);
    if (base.error) return { error: base.error };

    const validDepts = depts
      .filter((d) => d.name.trim() && Number(d.hosts) > 0)
      .map((d) => ({ name: d.name.trim(), hosts: Math.max(1, parseInt(d.hosts, 10)) }))
      .sort((a, b) => b.hosts - a.hosts);

    if (validDepts.length === 0) return { error: "Vui lòng nhập ít nhất 1 phòng ban có số lượng host > 0." };

    let cursor = base.networkInt;
    const baseEnd = (base.networkInt + base.totalAddresses - 1) >>> 0;
    const allocations = [];
    let overflow = false;

    for (const d of validDepts) {
      // Need hosts + 2 (network + broadcast)
      const neededTotal = d.hosts + 2;
      const hostBits = Math.ceil(Math.log2(neededTotal));
      const prefix = 32 - hostBits;
      const blockSize = Math.pow(2, hostBits);
      // Align cursor to blockSize boundary
      if (cursor % blockSize !== 0) {
        cursor = (Math.ceil(cursor / blockSize) * blockSize) >>> 0;
      }
      const netInt = cursor;
      const bcastInt = (netInt + blockSize - 1) >>> 0;
      if (bcastInt > baseEnd) {
        overflow = true;
      }
      const maskInt = prefixToMaskInt(prefix);
      const wildcardInt = (~maskInt) >>> 0;
      const usable = Math.max(0, blockSize - 2);
      allocations.push({
        name: d.name,
        requested: d.hosts,
        usable,
        blockSize,
        prefix,
        network: intToIp(netInt),
        mask: intToIp(maskInt),
        wildcard: intToIp(wildcardInt),
        firstIp: intToIp(netInt + 1),
        lastIp: intToIp(bcastInt - 1),
        broadcast: intToIp(bcastInt),
        utilization: Math.min(100, Math.round((d.hosts / Math.max(1, usable)) * 100)),
        overflow: bcastInt > baseEnd
      });
      cursor = (bcastInt + 1) >>> 0;
    }

    return { base, allocations, overflow };
  }

  function ensureSubnetToolkitModalDom() {
    if (document.getElementById("subnet-toolkit-modal")) return;
    const html = `
      <div class="subnet-toolkit-modal" id="subnet-toolkit-modal" role="dialog" aria-modal="true" aria-label="Máy tính Subnetting & VLSM trực quan" hidden>
        <div class="cmd-palette-backdrop" id="subnet-toolkit-backdrop"></div>
        <div class="subnet-toolkit-box">
          <header class="ios-sim-modal-header">
            <div style="display:flex;align-items:center;gap:0.65rem;flex-wrap:wrap;">
              <span class="brand-badge">ENGINEER TOOLKIT</span>
              <h3 style="margin:0;font-size:1.05rem;">🧮 Visual Subnet &amp; VLSM Architect (Chuẩn CCNA 200-301)</h3>
            </div>
            <button type="button" class="shortcuts-close-btn" id="subnet-toolkit-close-btn" aria-label="Đóng">✕</button>
          </header>

          <div class="toolkit-tabs">
            <button type="button" class="toolkit-tab-btn active" data-tab="cidr">🔍 Phân tích IP/CIDR &amp; 32-Bit Nhị phân</button>
            <button type="button" class="toolkit-tab-btn" data-tab="vlsm">🏢 Quy hoạch chia mạng VLSM nhiều phòng ban</button>
          </div>

          <div class="toolkit-body">
            <!-- TAB 1: SINGLE IP/CIDR -->
            <div class="toolkit-pane active" id="toolkit-pane-cidr">
              <div class="cidr-input-bar">
                <input type="text" id="tk-cidr-input" class="tk-input" value="192.168.10.64/26" placeholder="Nhập IP/CIDR (VD: 192.168.10.64/26)" />
                <button type="button" class="ws-btn primary" id="tk-cidr-calc-btn">Tính toán ngay</button>
              </div>
              <div class="cidr-presets">
                <span>Ví dụ nhanh:</span>
                <button type="button" class="tk-preset-chip" data-cidr="192.168.10.64/26">192.168.10.64/26</button>
                <button type="button" class="tk-preset-chip" data-cidr="172.16.35.123/20">172.16.35.123/20</button>
                <button type="button" class="tk-preset-chip" data-cidr="10.0.15.200/27">10.0.15.200/27</button>
                <button type="button" class="tk-preset-chip" data-cidr="203.0.113.2/30">203.0.113.2/30 (WAN)</button>
              </div>
              <div id="tk-cidr-output"></div>
            </div>

            <!-- TAB 2: VLSM PLANNER -->
            <div class="toolkit-pane" id="toolkit-pane-vlsm">
              <div class="cidr-input-bar">
                <label style="font-size:0.86rem;font-weight:700;">Mạng gốc (Base Network):</label>
                <input type="text" id="tk-vlsm-base" class="tk-input" value="192.168.10.0/24" style="max-width:220px;" />
                <button type="button" class="ws-btn" id="tk-vlsm-add-row">+ Thêm phòng ban</button>
                <button type="button" class="ws-btn primary" id="tk-vlsm-calc-btn">🚀 Chia VLSM tối ưu</button>
              </div>
              <div id="tk-vlsm-rows" class="vlsm-rows"></div>
              <div id="tk-vlsm-output"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", html);

    document.getElementById("subnet-toolkit-backdrop")?.addEventListener("click", closeSubnetToolkitModal);
    document.getElementById("subnet-toolkit-close-btn")?.addEventListener("click", closeSubnetToolkitModal);

    // Tab switching
    document.querySelectorAll(".toolkit-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const t = btn.dataset.tab;
        document.querySelectorAll(".toolkit-tab-btn").forEach((b) => b.classList.toggle("active", b === btn));
        document.getElementById("toolkit-pane-cidr")?.classList.toggle("active", t === "cidr");
        document.getElementById("toolkit-pane-vlsm")?.classList.toggle("active", t === "vlsm");
      });
    });

    // CIDR events
    const cidrInput = document.getElementById("tk-cidr-input");
    const runCidr = () => renderCidrResult(cidrInput.value);
    document.getElementById("tk-cidr-calc-btn")?.addEventListener("click", runCidr);
    cidrInput?.addEventListener("keydown", (e) => { if (e.key === "Enter") runCidr(); });
    document.querySelectorAll(".tk-preset-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        if (cidrInput) cidrInput.value = chip.dataset.cidr;
        runCidr();
      });
    });

    // VLSM default departments
    const defaultDepts = [
      { name: "Phòng Kế toán (VLAN 10)", hosts: 50 },
      { name: "Phòng Kỹ thuật (VLAN 20)", hosts: 25 },
      { name: "Phòng Nhân sự (VLAN 30)", hosts: 12 },
      { name: "Liên kết WAN R1-R2", hosts: 2 }
    ];
    const rowsWrap = document.getElementById("tk-vlsm-rows");
    const addVlsmRow = (name = "", hosts = 10) => {
      const row = document.createElement("div");
      row.className = "vlsm-input-row";
      row.innerHTML = `
        <input type="text" class="tk-input vlsm-dept-name" value="${escHtml(name)}" placeholder="Tên phòng ban / Subnet" />
        <input type="number" class="tk-input vlsm-dept-hosts" value="${hosts}" min="1" max="100000" style="max-width:130px;" placeholder="Số máy" />
        <button type="button" class="ios-mini-btn vlsm-del-row" title="Xóa dòng">✕</button>
      `;
      row.querySelector(".vlsm-del-row").addEventListener("click", () => row.remove());
      rowsWrap.appendChild(row);
    };
    defaultDepts.forEach((d) => addVlsmRow(d.name, d.hosts));

    document.getElementById("tk-vlsm-add-row")?.addEventListener("click", () => addVlsmRow("Phòng mới", 14));
    document.getElementById("tk-vlsm-calc-btn")?.addEventListener("click", runVlsmCalculation);

    runCidr();
    runVlsmCalculation();
  }

  function renderCidrResult(cidrStr) {
    const out = document.getElementById("tk-cidr-output");
    if (!out) return;
    const info = analyzeCidr(cidrStr);
    if (info.error) {
      out.innerHTML = `<div class="ios-diag-warn">${escHtml(info.error)}</div>`;
      return;
    }

    const octNames = ["Octet 1", "Octet 2", "Octet 3", "Octet 4"];
    out.innerHTML = `
      ${renderBinaryBitGrid(info)}
      <div class="subnet-kpi-grid">
        <div class="subnet-kpi"><span>Network ID</span><strong>${info.network}/${info.prefix}</strong></div>
        <div class="subnet-kpi"><span>First Usable IP</span><strong>${info.firstUsable}</strong></div>
        <div class="subnet-kpi"><span>Last Usable IP</span><strong>${info.lastUsable}</strong></div>
        <div class="subnet-kpi"><span>Broadcast Address</span><strong>${info.broadcast}</strong></div>
        <div class="subnet-kpi"><span>Subnet Mask</span><strong>${info.mask}</strong></div>
        <div class="subnet-kpi accent"><span>Wildcard Mask (OSPF/ACL)</span><strong>${info.wildcard}</strong></div>
        <div class="subnet-kpi"><span>Usable Hosts (2^${info.hostBits} - 2)</span><strong>${info.usableHosts.toLocaleString()} hosts</strong></div>
        <div class="subnet-kpi"><span>Class &amp; Scope</span><strong>${info.cls} • ${info.ipScope}</strong></div>
      </div>

      <div class="subnet-teacher-box">
        <h4>👨‍🏫 Giải thích từng bước bằng quy tắc Magic Number (Đi thi tính trong 15 giây):</h4>
        <ol>
          <li><strong>Xác định Octet thú vị (Interesting Octet):</strong> Với <code>/${info.prefix}</code>, Subnet Mask là <code>${info.mask}</code> → Octet không phải 255 đầu tiên là <strong>${octNames[info.interestingIdx]}</strong> có giá trị <code>${info.interestingMaskVal}</code>.</li>
          <li><strong>Tính Magic Number (Bước nhảy Subnet):</strong> <code>256 - ${info.interestingMaskVal} = ${info.magicNumber}</code>. Các mạng con sẽ nhảy từng bước <strong>${info.magicNumber}</strong> tại ${octNames[info.interestingIdx]} (0, ${info.magicNumber}, ${info.magicNumber * 2}, ...).</li>
          <li><strong>Tìm Network ID &amp; Broadcast:</strong> Bội số của ${info.magicNumber} gần nhất ≤ IP đang xét cho ta Network ID = <code>${info.network}</code>. Mạng kế tiếp trừ 1 cho Broadcast = <code>${info.broadcast}</code>.</li>
          <li><strong>Tính Wildcard Mask cho OSPF / ACL:</strong> Lấy <code>255.255.255.255 - ${info.mask} = ${info.wildcard}</code>.</li>
        </ol>
      </div>
    `;
  }

  function runVlsmCalculation() {
    const baseInput = document.getElementById("tk-vlsm-base");
    const out = document.getElementById("tk-vlsm-output");
    if (!baseInput || !out) return;
    const depts = Array.from(document.querySelectorAll("#tk-vlsm-rows .vlsm-input-row")).map((r) => ({
      name: r.querySelector(".vlsm-dept-name")?.value || "",
      hosts: parseInt(r.querySelector(".vlsm-dept-hosts")?.value || "0", 10)
    }));

    const res = computeVlsmAllocation(baseInput.value, depts);
    if (res.error) {
      out.innerHTML = `<div class="ios-diag-warn">${escHtml(res.error)}</div>`;
      return;
    }

    const rowsHtml = res.allocations
      .map(
        (a, idx) => `
        <tr class="${a.overflow ? "vlsm-row-overflow" : ""}">
          <td><strong>${idx + 1}. ${escHtml(a.name)}</strong></td>
          <td>${a.requested}</td>
          <td>${a.usable} (${a.utilization}%)</td>
          <td><code>${a.network}/${a.prefix}</code></td>
          <td><code>${a.mask}</code></td>
          <td><code>${a.wildcard}</code></td>
          <td><code>${a.firstIp} – ${a.lastIp}</code></td>
          <td><code>${a.broadcast}</code></td>
        </tr>
      `
      )
      .join("");

    const iosSnippet = res.allocations
      .map(
        (a, i) => `interface GigabitEthernet0/0.${(i + 1) * 10}\n description ${a.name}\n encapsulation dot1Q ${(i + 1) * 10}\n ip address ${a.firstIp} ${a.mask}\n no shutdown`
      )
      .join("\n!\n");

    out.innerHTML = `
      ${res.overflow ? `<div class="ios-diag-warn">⚠️ Cảnh báo: Tổng số IP yêu cầu vượt quá không gian mạng gốc <code>${res.base.network}/${res.base.prefix}</code> (${res.base.totalAddresses} địa chỉ)! Hãy chọn prefix gốc nhỏ hơn (VD: /22 hoặc /23).</div>` : `<div class="ios-diag-ok">✅ Quy hoạch VLSM hợp lệ 100% (Đã tự động sắp xếp phòng ban lớn nhất trước theo chuẩn Cisco)!</div>`}
      <div class="table-responsive" style="margin-top:0.75rem;">
        <table class="tech-table">
          <thead>
            <tr>
              <th>Phòng ban (Ưu tiên lớn → nhỏ)</th>
              <th>Cần</th>
              <th>Cấp phát</th>
              <th>Network / CIDR</th>
              <th>Subnet Mask</th>
              <th>Wildcard</th>
              <th>Dải IP khả dụng</th>
              <th>Broadcast</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
      <div style="margin-top:0.85rem;">
        <strong style="font-size:0.86rem;">💻 Mẫu cấu hình Router-on-a-Stick tự sinh từ bảng VLSM:</strong>
        <pre class="cli-block" style="margin-top:0.35rem;"><code>${escHtml(iosSnippet)}</code></pre>
      </div>
    `;
  }

  function openSubnetToolkitModal(defaultTab = "cidr") {
    ensureSubnetToolkitModalDom();
    const modal = document.getElementById("subnet-toolkit-modal");
    if (!modal) return;
    modal.hidden = false;
    const tabBtn = modal.querySelector(`.toolkit-tab-btn[data-tab="${defaultTab}"]`);
    if (tabBtn) tabBtn.click();
  }

  function closeSubnetToolkitModal() {
    const modal = document.getElementById("subnet-toolkit-modal");
    if (modal) modal.hidden = true;
  }

  // ==========================================================================
  // PART B: INTERACTIVE PACKET FLOW & OSI 7-LAYER PDU INSPECTOR (35 LAB SVGs)
  // ==========================================================================
  function computeShortestPath(lab) {
    const nodes = lab.nodes || [];
    const links = lab.links || [];
    if (nodes.length < 2 || links.length === 0) return [];

    // Build adjacency list
    const adj = Array.from({ length: nodes.length }, () => []);
    links.forEach((lk, idx) => {
      if (lk.down || lk.stpBlock) return;
      if (nodes[lk.from] && nodes[lk.to]) {
        adj[lk.from].push({ to: lk.to, link: lk, linkIdx: idx, dir: 1 });
        adj[lk.to].push({ to: lk.from, link: lk, linkIdx: idx, dir: -1 });
      }
    });

    // Pick best source (PC/Laptop) and destination (Server/Cloud/distant PC)
    let srcIdx = nodes.findIndex((n) => !["router", "switch", "l3switch", "firewall", "cloud"].includes(n.type));
    if (srcIdx === -1) srcIdx = 0;

    // BFS from srcIdx to find farthest reachable node (preferring server/pc/cloud)
    const visited = new Set([srcIdx]);
    const parent = new Map();
    const queue = [srcIdx];
    let bestDst = srcIdx;

    while (queue.length > 0) {
      const u = queue.shift();
      if (u !== srcIdx) {
        const n = nodes[u];
        if (n.type === "server" || n.type === "cloud" || (!["switch"].includes(n.type))) {
          bestDst = u;
        }
      }
      for (const edge of adj[u]) {
        if (!visited.has(edge.to)) {
          visited.add(edge.to);
          parent.set(edge.to, { from: u, edge });
          queue.push(edge.to);
        }
      }
    }

    if (bestDst === srcIdx) {
      // Fallback: pick any connected node
      for (const v of visited) {
        if (v !== srcIdx) { bestDst = v; break; }
      }
    }
    if (bestDst === srcIdx) return [];

    const hops = [];
    let curr = bestDst;
    while (curr !== srcIdx) {
      const step = parent.get(curr);
      if (!step) break;
      hops.unshift({ nodeIdx: curr, fromIdx: step.from, link: step.edge.link });
      curr = step.from;
    }
    hops.unshift({ nodeIdx: srcIdx, fromIdx: null, link: null });
    return hops;
  }

  function fakeMacForNode(nodeIdx, type) {
    const prefix = type === "router" ? "0001.C9" : type === "switch" || type === "l3switch" ? "00D0.BA" : "00E0.F7";
    const hex = String((nodeIdx + 1) * 17).padStart(2, "0");
    return `${prefix}${hex}.${String(1000 + nodeIdx * 111).slice(0, 4)}`;
  }

  function extractIpFromNode(node, fallback) {
    const m = String(node?.ip || "").match(/\d+\.\d+\.\d+\.\d+/);
    return m ? m[0] : fallback;
  }

  function buildPduSnapshotsForPath(lab, hops) {
    const nodes = lab.nodes || [];
    const srcNode = nodes[hops[0].nodeIdx];
    const dstNode = nodes[hops[hops.length - 1].nodeIdx];
    const origSrcIp = extractIpFromNode(srcNode, "192.168.10.10");
    const origDstIp = extractIpFromNode(dstNode, "192.168.20.20");
    const isNatLab = /nat|pat/i.test(lab.title_vi || "");
    const isVlanLab = /vlan|trunk|802\.1q|inter-vlan/i.test(lab.title_vi || "");

    let currentTtl = 128;
    let currentSrcIp = origSrcIp;
    let l2SrcMac = fakeMacForNode(hops[0].nodeIdx, srcNode.type);
    let l2DstMac = hops.length > 1 ? fakeMacForNode(hops[1].nodeIdx, nodes[hops[1].nodeIdx].type) : "FF:FF:FF:FF:FF:FF";

    return hops.map((hop, idx) => {
      const node = nodes[hop.nodeIdx];
      const nextHop = hops[idx + 1];
      const nextNode = nextHop ? nodes[nextHop.nodeIdx] : null;
      const link = hop.link;
      let actionNote = "";
      let vlanTag = "Untagged (Native / Access)";

      if (idx === 0) {
        actionNote = `Đóng gói gói tin ICMP Echo Request (Ping) từ ${node.name} (${origSrcIp}) gửi tới ${dstNode.name} (${origDstIp}). Kiểm tra ARP Cache lấy Dst MAC.`;
      } else if (node.type === "switch" || node.type === "l3switch") {
        if (isVlanLab && (link?.label?.toLowerCase().includes("trunk") || nextHop?.link?.label?.toLowerCase().includes("trunk"))) {
          vlanTag = "802.1Q Tag: VLAN 10 (TPID 0x8100)";
        }
        actionNote = `Switch ${node.name} tra cứu CAM Table (MAC Address Table) theo Dst MAC ${l2DstMac} → Chuyển tiếp Frame nguyên vẹn L3 IP/TTL ra cổng đích.${isVlanLab ? " Gắn/giữ thẻ IEEE 802.1Q khi qua đường Trunk." : ""}`;
      } else if (node.type === "router" || node.type === "firewall") {
        currentTtl = Math.max(1, currentTtl - 1);
        l2SrcMac = fakeMacForNode(hop.nodeIdx, node.type);
        if (nextNode) l2DstMac = fakeMacForNode(nextHop.nodeIdx, nextNode.type);
        let natMsg = "";
        if (isNatLab && nextNode && nextNode.type === "cloud") {
          currentSrcIp = "203.0.113.2 (NAT Overload Public IP)";
          natMsg = " Thực hiện PAT/NAT Overload dịch Inside Local → Inside Global!";
        }
        actionNote = `Router ${node.name} bóc Header Layer 2 cũ, giảm TTL còn ${currentTtl}, tra cứu Routing Table (Longest Prefix Match), đóng gói lại Src/Dst MAC mới cho chặng tiếp theo.${natMsg}`;
      } else {
        actionNote = `Thiết bị đích ${node.name} nhận gói tin thành công! Kiểm tra CRC Layer 2 & Dest IP khớp → Chuẩn bị gửi gói ICMP Echo Reply trả về nguồn.`;
      }

      return {
        hopIndex: idx,
        nodeName: node.name,
        nodeType: node.type,
        x: node.x,
        y: node.y,
        l1: link ? `${(link.type || "Ethernet UTP").toUpperCase()} (${link.p1 || "Port"} ↔ ${link.p2 || "Port"})` : "Originating NIC (Ethernet 1Gbps)",
        l2SrcMac,
        l2DstMac,
        vlanTag,
        l3SrcIp: currentSrcIp,
        l3DstIp: origDstIp,
        ttl: currentTtl,
        l4: "ICMP Type 8 (Echo Request) • Seq=1",
        l7: `Ping / Diagnostic PDU (Lab #${lab.id})`,
        actionNote
      };
    });
  }

  function enhanceLabSvgWithPacketFlow() {
    if (typeof PACKET_TRACER_LABS === "undefined") return;
    document.querySelectorAll(".pt-lab-card").forEach((card) => {
      if (card.dataset.pduEnhanced === "1") return;
      card.dataset.pduEnhanced = "1";
      const match = (card.id || "").match(/pt-lab-(\d+)/);
      if (!match) return;
      const labId = parseInt(match[1], 10);
      const lab = PACKET_TRACER_LABS.find((l) => l.id === labId);
      if (!lab) return;

      const svgWrap = card.querySelector(".svg-diagram-wrapper");
      const svgEl = svgWrap && svgWrap.querySelector("svg");
      if (!svgWrap || !svgEl) return;

      const hops = computeShortestPath(lab);
      if (hops.length < 2) return;
      const snapshots = buildPduSnapshotsForPath(lab, hops);

      // Inject animated packet marker group into SVG
      const ns = "http://www.w3.org/2000/svg";
      const markerGroup = document.createElementNS(ns, "g");
      markerGroup.setAttribute("class", "pdu-svg-packet");
      markerGroup.setAttribute("style", "display:none;transition:transform 0.65s cubic-bezier(0.22,1,0.36,1);");
      markerGroup.innerHTML = `
        <circle r="13" fill="#f59e0b" opacity="0.28"><animate attributeName="r" values="10;18;10" dur="1.2s" repeatCount="indefinite"/></circle>
        <rect x="-11" y="-8" width="22" height="16" rx="3" fill="#f59e0b" stroke="#0f172a" stroke-width="1.6"/>
        <polyline points="-11,-8 0,1 11,-8" fill="none" stroke="#0f172a" stroke-width="1.4"/>
      `;
      svgEl.appendChild(markerGroup);

      const bar = document.createElement("div");
      bar.className = "pdu-sim-bar";
      bar.innerHTML = `
        <div class="pdu-sim-controls">
          <button type="button" class="ws-btn primary pdu-play-btn">▶️ Mô phỏng gửi gói tin (Simulate Ping / PDU)</button>
          <button type="button" class="ios-mini-btn pdu-prev-btn" disabled>⏮ Chặng trước</button>
          <button type="button" class="ios-mini-btn pdu-next-btn">⏭ Chặng tiếp</button>
          <span class="pdu-hop-pill">Sẵn sàng (${snapshots.length} chặng)</span>
        </div>
        <div class="pdu-inspector-panel" hidden></div>
      `;
      svgWrap.insertAdjacentElement("afterend", bar);

      let currentStep = -1;
      let playTimer = null;
      const playBtn = bar.querySelector(".pdu-play-btn");
      const prevBtn = bar.querySelector(".pdu-prev-btn");
      const nextBtn = bar.querySelector(".pdu-next-btn");
      const hopPill = bar.querySelector(".pdu-hop-pill");
      const inspector = bar.querySelector(".pdu-inspector-panel");

      function showHop(idx) {
        currentStep = Math.max(0, Math.min(snapshots.length - 1, idx));
        const snap = snapshots[currentStep];
        markerGroup.style.display = "block";
        markerGroup.setAttribute("transform", `translate(${snap.x}, ${snap.y - 26})`);

        hopPill.textContent = `Chặng ${currentStep + 1} / ${snapshots.length}: ${snap.nodeName}`;
        prevBtn.disabled = currentStep <= 0;
        nextBtn.disabled = currentStep >= snapshots.length - 1;

        const hopTabs = snapshots
          .map(
            (s, i) => `<button type="button" class="pdu-hop-chip ${i === currentStep ? "active" : ""}" data-hop="${i}">${i + 1}. ${escHtml(s.nodeName)}</button>`
          )
          .join("");

        inspector.hidden = false;
        inspector.innerHTML = `
          <div class="pdu-inspector-head">
            <strong>📦 OSI 7-Layer PDU Inspector — Tại thiết bị: ${escHtml(snap.nodeName)}</strong>
            <div class="pdu-hop-tabs">${hopTabs}</div>
          </div>
          <div class="pdu-action-note">${escHtml(snap.actionNote)}</div>
          <div class="pdu-layers-grid">
            <div class="pdu-layer l7"><span>L5–L7 Application</span><code>${escHtml(snap.l7)}</code></div>
            <div class="pdu-layer l4"><span>L4 Transport</span><code>${escHtml(snap.l4)}</code></div>
            <div class="pdu-layer l3"><span>L3 Network (IP &amp; TTL)</span><code>Src: ${escHtml(snap.l3SrcIp)} → Dst: ${escHtml(snap.l3DstIp)} | TTL: ${snap.ttl}</code></div>
            <div class="pdu-layer l2"><span>L2 Data Link (MAC &amp; VLAN)</span><code>Src MAC: ${snap.l2SrcMac} → Dst MAC: ${snap.l2DstMac} | ${escHtml(snap.vlanTag)}</code></div>
            <div class="pdu-layer l1"><span>L1 Physical</span><code>${escHtml(snap.l1)}</code></div>
          </div>
        `;

        inspector.querySelectorAll(".pdu-hop-chip").forEach((chip) => {
          chip.addEventListener("click", () => {
            stopAutoPlay();
            showHop(parseInt(chip.dataset.hop, 10));
          });
        });
      }

      function stopAutoPlay() {
        if (playTimer) {
          clearInterval(playTimer);
          playTimer = null;
        }
        playBtn.textContent = "▶️ Mô phỏng gửi gói tin (Simulate Ping / PDU)";
      }

      playBtn.addEventListener("click", () => {
        if (playTimer) {
          stopAutoPlay();
          return;
        }
        playBtn.textContent = "⏸ Tạm dừng mô phỏng";
        if (currentStep < 0 || currentStep >= snapshots.length - 1) {
          showHop(0);
        }
        playTimer = setInterval(() => {
          if (currentStep < snapshots.length - 1) {
            showHop(currentStep + 1);
          } else {
            stopAutoPlay();
          }
        }, 1450);
      });

      prevBtn.addEventListener("click", () => {
        stopAutoPlay();
        showHop(currentStep - 1);
      });

      nextBtn.addEventListener("click", () => {
        stopAutoPlay();
        showHop(currentStep < 0 ? 0 : currentStep + 1);
      });
    });
  }

  function initNetworkToolkit() {
    const detail = document.getElementById("module-detail");
    if (!detail) return;
    enhanceLabSvgWithPacketFlow();
    const obs = new MutationObserver(() => enhanceLabSvgWithPacketFlow());
    obs.observe(detail, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNetworkToolkit);
  } else {
    initNetworkToolkit();
  }

  window.openSubnetToolkitModal = openSubnetToolkitModal;
  window.closeSubnetToolkitModal = closeSubnetToolkitModal;
  window.analyzeCidr = analyzeCidr;
  window.computeVlsmAllocation = computeVlsmAllocation;
})();
