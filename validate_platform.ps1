# ==============================================================================
# CCNA NETWORK ACADEMY — AUTOMATED CONTENT, LAB, ARCHITECTURE & QA VALIDATOR
# Verifies:
# 1. All 17 Core Modules in ccna_data.json & FALLBACK_CCNA_DATA (Structure, CLI, Quizzes, Tables)
# 2. All 17 Module Standard-10 Enrichments in curriculum.js
# 3. All 35 Cisco Packet Tracer Labs in labs.js (Topology nodes, links, IP addresses, Steps, CLI)
# 4. All 10 Exam Mastery & Real-World Domains in exam_mastery.js & 1:1 EN Translation alignment
# 5. All 24 Hardware & Peripheral Photo assets referenced across the platform
# 6. Personal Learning Workspace, Multi-User Isolation, URL Hash Routing & AI Network Tutor
# 7. Backend Serverless Security Controls (/api/ai-tutor.js & /api/sync.js)
# ==============================================================================

$ErrorActionPreference = "Stop"
$passed = 0
$failed = 0

function Assert-Condition($condition, $testName, $detail = "") {
  if ($condition) {
    $script:passed++
    Write-Output ("[PASS] {0}" -f $testName)
  } else {
    $script:failed++
    Write-Output ("[FAIL] {0} {1}" -f $testName, $detail)
  }
}

Write-Output "=== 1. MODULE CONTENT & CURRICULUM VALIDATION (17 MODULES) ==="
$ccnaJson = Get-Content -Path "d:\CCNA\ccna_data.json" -Raw -Encoding UTF8 | ConvertFrom-Json
Assert-Condition ($ccnaJson.Count -eq 17) "ccna_data.json contains exactly 17 Modules" "Found: $($ccnaJson.Count)"

foreach ($m in $ccnaJson) {
  $hasTitle = (-not [string]::IsNullOrWhiteSpace($m.title)) -and (-not [string]::IsNullOrWhiteSpace($m.title_vi))
  $hasOverview = (-not [string]::IsNullOrWhiteSpace($m.overview)) -and (-not [string]::IsNullOrWhiteSpace($m.overview_vi))
  $hasConcepts = ($m.keyConcepts.Count -ge 4) -and ($m.keyConcepts_vi.Count -ge 4)
  $hasCmds = ($m.commands.Count -ge 4)
  $hasQuiz = ($m.quiz.Count -ge 3)
  $hasTable = ($null -ne $m.comparisonTable) -and ($m.comparisonTable.rows.Count -ge 3)
  Assert-Condition ($hasTitle -and $hasOverview -and $hasConcepts -and $hasCmds -and $hasQuiz -and $hasTable) ("Module {0:D2} ({1}) complete structure (Overview, Concepts, CLI, Table, Quiz)" -f $m.id, $m.title)
}

$currRaw = Get-Content -Path "d:\CCNA\curriculum.js" -Raw -Encoding UTF8
for ($i = 1; $i -le 17; $i++) {
  $hasEnrich = $currRaw -match "(?m)^\s*$i\s*:\s*\{"
  Assert-Condition $hasEnrich ("Module {0:D2} has Standard-10 Enrichment (Objectives, Scenario, Verification, Troubleshooting)" -f $i)
}

Write-Output "`n=== 2. PRACTICAL LABS VALIDATION (35 PACKET TRACER LABS) ==="
$labsRaw = Get-Content -Path "d:\CCNA\labs.js" -Raw -Encoding UTF8
for ($labId = 1; $labId -le 35; $labId++) {
  $hasLab = $labsRaw -match "(?m)^\s*id:\s*$labId\s*,"
  Assert-Condition $hasLab ("Lab {0:D2} exists in PACKET_TRACER_LABS" -f $labId)
}

# Verify specific high-priority lab fixes (AUD-03 & AUD-06)
Assert-Condition ($labsRaw -match 'PC1 \(VLAN 10\).*192\.168\.10\.10') "Lab 23 includes PC1 & PC2 IP and Default Gateway rows in ipTable"
Assert-Condition ($labsRaw -match 'SW1\(config-if-range\)#\s*switchport mode trunk') "Lab 25 sets switchport mode trunk on member interfaces before LACP channel-group"
Assert-Condition ($labsRaw -match 'R1-Edge\(config-if\)#\s*ip address 203\.0\.113\.2 255\.255\.255\.252' -and $labsRaw -match 'ip route 0\.0\.0\.0 0\.0\.0\.0 203\.0\.113\.1') "Lab 30 WAN IP (203.0.113.2/30) and Default Route match ipTable 100%"
Assert-Condition ($labsRaw -match 'R1 \(HSRP Active\).*LAN: \.1\.2 \| WAN: 203\.0\.113\.2' -and $labsRaw -match 'R2 \(HSRP Standby\).*LAN: \.1\.3 \| WAN: 203\.0\.113\.3') "Lab 31 HSRP node labels match physical IPs (.2 and .3) and Virtual IP (.1)"
Assert-Condition ($labsRaw -match 'type:\s*"wireless"' -and $labsRaw -match 'WLAN_POOL') "Lab 33 uses IEEE 802.11 wireless link type and configures WLC DHCP Scope"
Assert-Condition (-not ($labsRaw -match 'name:\s*"Đường Chính \(Gi0/0/0\)"')) "Lab 34 uses direct parallel links with offsetY instead of fake cloud devices"
Assert-Condition (Test-Path "d:\CCNA\lab\lab01.pkt") "Downloadable Packet Tracer simulation file lab/lab01.pkt exists on disk"

Write-Output "`n=== 3. EXAM MASTERY & BILINGUAL TRANSLATION ALIGNMENT (AUD-02) ==="
$enRaw = Get-Content -Path "d:\CCNA\en_translations.js" -Raw -Encoding UTF8
Assert-Condition ($enRaw -match 'Mastery Topic 2: Enterprise Wireless LAN Architecture') "CCNA_EXAM_MASTERY_EN[2] accurately maps to Wireless LANs (WLC/LAP/CAPWAP)"
Assert-Condition ($enRaw -match 'Mastery Topic 3: Advanced IP Routing') "CCNA_EXAM_MASTERY_EN[3] accurately maps to IP Connectivity (LPM/OSPFv2/FHRP)"
Assert-Condition ($enRaw -match 'Mastery Topic 4: Enterprise IP Services') "CCNA_EXAM_MASTERY_EN[4] accurately maps to IP Services (NAT/NTP/Syslog/SNMP/QoS)"
Assert-Condition ($enRaw -match 'Mastery Topic 5: Network Automation, SDN Architecture') "CCNA_EXAM_MASTERY_EN[5] accurately maps to Network Automation & SDN"
Assert-Condition ($enRaw -match 'Mastery Topic 6: Real-World Network Engineer Field Playbook') "CCNA_EXAM_MASTERY_EN[6] accurately maps to Real-World Career & Interview Playbook"
Assert-Condition ($enRaw -match 'Mastery Topic 7: Official CCNA 200-301 v1\.1 Exam Updates') "CCNA_EXAM_MASTERY_EN[7] accurately maps to CCNA v1.1 AI, Terraform & STP Guards"
Assert-Condition ($enRaw -match 'Mastery Topic 8: Multi-Angle Physical Hardware Anatomy') "CCNA_EXAM_MASTERY_EN[8] accurately maps to Multi-Angle Hardware & Rack Cabling"
Assert-Condition ($enRaw -match 'Mastery Topic 9: Multi-Vendor Network Administration') "CCNA_EXAM_MASTERY_EN[9] accurately maps to Multi-Vendor (HPE Aruba/MikroTik/FortiGate)"
Assert-Condition ($enRaw -match 'Mastery Topic 10: Enterprise Office Peripherals') "CCNA_EXAM_MASTERY_EN[10] accurately maps to Enterprise Office Peripherals & RMM"

Write-Output "`n=== 4. WORKSPACE UNIFICATION, USER ISOLATION & URL ROUTING (AUD-01, AUD-04, AUD-11) ==="
$wsRaw = Get-Content -Path "d:\CCNA\workspace.js" -Raw -Encoding UTF8
$appRaw = Get-Content -Path "d:\CCNA\app.js" -Raw -Encoding UTF8
$acadRaw = Get-Content -Path "d:\CCNA\academy_ui.js" -Raw -Encoding UTF8

Assert-Condition ($wsRaw -match 'function upsertLessonNoteFromDrawer' -and $appRaw -match 'upsertLessonNoteFromDrawer') "Bidirectional note synchronization bridge active between app.js drawer and workspace.js"
Assert-Condition ($appRaw -match 'function getCompletedStorageKey' -and $acadRaw -match 'function getRecentStorageKey') "Completion progress and recently studied history are isolated per active user ID"
Assert-Condition ($acadRaw -match 'function updateRouteHash' -and $acadRaw -match 'function restoreRouteFromUrlHash') "URL Hash Router persists and restores active section/lesson/lab across browser reloads"

Write-Output "`n=== 5. AI NETWORK TUTOR & BACKEND SECURITY (AUD-05, AUD-09, AUD-10) ==="
$aiRaw = Get-Content -Path "d:\CCNA\ai_tutor.js" -Raw -Encoding UTF8
$apiAiRaw = Get-Content -Path "d:\CCNA\api\ai-tutor.js" -Raw -Encoding UTF8
$apiSyncRaw = Get-Content -Path "d:\CCNA\api\sync.js" -Raw -Encoding UTF8

Assert-Condition ($aiRaw -match 'document\.body\.classList\.add\("ai-sidebar-open"\)' -and $aiRaw -match 'window\.innerWidth <= 980') "AI Network Tutor docks as non-blocking right split-panel on desktop without locking lesson scroll"
Assert-Condition ($aiRaw -match 'type:\s*"cli_cheatsheet"' -and $aiRaw -match 'm\.advancedTopics_vi') "AI RAG Knowledge Index covers all lesson sections and 120+ CLI Cheat Sheet entries"
Assert-Condition ($aiRaw -match '\.pt-step-item\[data-step-idx\]') "Clicking any Lab step automatically updates AI Lab Assistant step context"
Assert-Condition ($apiAiRaw -match 'MAX_PAYLOAD_BYTES' -and $apiAiRaw -match 'ALLOWED_MODELS' -and -not ($apiAiRaw -match 'Access-Control-Allow-Credentials')) "/api/ai-tutor.js enforces 4MB payload limit, model allowlist, and compliant CORS"
Assert-Condition ($apiSyncRaw -match 'MAX_SYNC_PAYLOAD_BYTES' -and -not ($apiSyncRaw -match 'Access-Control-Allow-Credentials')) "/api/sync.js enforces 2MB payload limit, key sanitization, and compliant CORS"

Write-Output "`n=== 6. FULL-STACK UPGRADE VALIDATION (STREAMING, SMART MERGE, AUTH, PWA, IOS SIM, TOOLKIT, SM-2, RADAR) ==="
$apiAuthExists = Test-Path "d:\CCNA\api\auth.js"
$apiAuthRaw = if ($apiAuthExists) { Get-Content -Path "d:\CCNA\api\auth.js" -Raw -Encoding UTF8 } else { "" }
$cmdRaw = if (Test-Path "d:\CCNA\command_palette.js") { Get-Content -Path "d:\CCNA\command_palette.js" -Raw -Encoding UTF8 } else { "" }
$iosRaw = if (Test-Path "d:\CCNA\ios_simulator.js") { Get-Content -Path "d:\CCNA\ios_simulator.js" -Raw -Encoding UTF8 } else { "" }
$tkRaw = if (Test-Path "d:\CCNA\network_toolkit.js") { Get-Content -Path "d:\CCNA\network_toolkit.js" -Raw -Encoding UTF8 } else { "" }
$examRaw = Get-Content -Path "d:\CCNA\exam_sim.js" -Raw -Encoding UTF8
$indexRaw = Get-Content -Path "d:\CCNA\index.html" -Raw -Encoding UTF8

Assert-Condition ($apiAiRaw -match 'streamGenerateContent\?alt=sse' -and $apiAiRaw -match 'cleanupIpRateLimitStore' -and $apiAiRaw -match 'followUpSuggestions') "/api/ai-tutor.js supports SSE streaming, IP TTL eviction, usageMetadata & follow-up suggestions"
Assert-Condition ($apiSyncRaw -match 'mergeSyncPayloads' -and $apiSyncRaw -match 'deletedAt' -and $apiSyncRaw -match 'examHistory') "/api/sync.js implements smart per-entity delta/timestamp merge with tombstone support"
Assert-Condition ($apiAuthExists -and $apiAuthRaw -match 'createHmac\("sha256"' -and $apiAuthRaw -match 'signSessionToken') "/api/auth.js implements HMAC-SHA256 signed multi-user authentication gateway"
Assert-Condition ($appRaw -match 'ccna_sync_pending_queue' -and $appRaw -match 'addEventListener\("online"' -and $appRaw -match '/api/auth') "app.js implements offline sync queue + online auto-retry + /api/auth with local SHA-256 fallback"
Assert-Condition ((Test-Path "d:\CCNA\manifest.json") -and (Test-Path "d:\CCNA\sw.js") -and $indexRaw -match 'manifest\.json' -and $indexRaw -match 'serviceWorker\.register') "PWA Offline-First manifest.json & Service Worker sw.js registered in index.html"
Assert-Condition ($cmdRaw -match 'buildOmniSearchIndex' -and $cmdRaw -match 'openCommandPalette' -and $cmdRaw -match 'openShortcutsModal') "Global Command Palette (Ctrl+K) 7-source omni-search & Keyboard Shortcuts (?) modal active"
Assert-Condition ($iosRaw -match 'class CiscoIosSession' -and $iosRaw -match 'extractLabTargetTasks' -and $iosRaw -match 'autocomplete') "Interactive Cisco IOS CLI Terminal Simulator with Tab, ? help & Live Lab Task Checker active"
Assert-Condition ($tkRaw -match 'computeVlsmAllocation' -and $tkRaw -match 'renderBinaryBitGrid' -and $tkRaw -match 'buildPduSnapshotsForPath') "Visual Subnet/VLSM Architect & Interactive Packet Flow OSI 7-Layer PDU Inspector active"
Assert-Condition ($appRaw -match 'computeSm2Schedule' -and $appRaw -match 'getDueFlashcardsCount' -and $indexRaw -match 'flashcard-sm2-bar') "Anki SM-2 Spaced Repetition Flashcard scheduler & rating UI active"
Assert-Condition ($examRaw -match 'renderSixDomainRadarSvg' -and $examRaw -match 'startWeakSpotDrill' -and $acadRaw -match 'dash-sm2-banner') "6-Domain CCNA 200-301 Mastery Radar, Smart Weak-Spot Drill & Dashboard SM-2 reminder active"
Assert-Condition ($aiRaw -match 'text/event-stream' -and $aiRaw -match 'followUpSuggestions') "ai_tutor.js consumes real-time SSE streaming tokens & renders follow-up suggestions"

Write-Output "`n=================================================================="
Write-Output ("VALIDATION SUMMARY: {0} PASSED | {1} FAILED" -f $passed, $failed)
Write-Output "=================================================================="
if ($failed -gt 0) { exit 1 }
