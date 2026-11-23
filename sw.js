// ============================================================================
// CCNA NETWORK ACADEMY — OFFLINE-FIRST SERVICE WORKER (PWA)
// - Precaches all core HTML, CSS, JS, data/ccna_data.json, SVG & hardware images
// - Cache-First for static educational assets so students can study 100% offline
// - Network-First for /api/* requests (AI Tutor, Cloud Sync, Auth)
// ============================================================================

const CACHE_VERSION = "ccna-academy-v2026-11-23-v13";

const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./favicon.svg",
  "./assets/css/style.css?v=20261123_v13",
  "./assets/css/theme_executive.css?v=20261123_v13",
  "./data/ccna_data.json",
  "./data/diagrams.js?v=20261123_v11",
  "./data/glossary.js?v=20261123_v11",
  "./data/labs.js?v=20261123_v11",
  "./data/exam_mastery.js?v=20261123_v11",
  "./data/en_translations.js?v=20261123_v11",
  "./data/curriculum.js?v=20261123_v11",
  "./js/core/workspace.js?v=20261123_v11",
  "./js/core/app.js?v=20261123_v11",
  "./js/core/academy_ui.js?v=20261123_v11",
  "./js/features/exam_sim.js?v=20261123_v11",
  "./js/features/ai_tutor.js?v=20261123_v11",
  "./js/features/command_palette.js?v=20261123_v11",
  "./js/features/ios_simulator.js?v=20261123_v12",
  "./js/features/network_toolkit.js?v=20261123_v12",
  "./js/features/guided_learning.js?v=20261123_v13",
  "./js/features/gamification_arcade.js?v=20261123_v13",
  "./assets/images/aruba_switch.jpg",
  "./assets/images/cctv_ip_camera.jpg",
  "./assets/images/coaxial_bnc_port.jpg",
  "./assets/images/console_cable.jpg",
  "./assets/images/fiber_lc_sc_ports.jpg",
  "./assets/images/fiber_optic.jpg",
  "./assets/images/firewall_asa.jpg",
  "./assets/images/ip_phone.jpg",
  "./assets/images/mfp_printer_lcd.jpg",
  "./assets/images/mikrotik_router.jpg",
  "./assets/images/nic_card.jpg",
  "./assets/images/office_scanner.jpg",
  "./assets/images/patch_panel_ports.jpg",
  "./assets/images/poe_switch_ports.jpg",
  "./assets/images/pos_receipt_printer.jpg",
  "./assets/images/rack_rear_cabling.jpg",
  "./assets/images/rj45_connector_pins.jpg",
  "./assets/images/router_cisco.jpg",
  "./assets/images/router_rear_ports.jpg",
  "./assets/images/server_rack.jpg",
  "./assets/images/sfp_module.jpg",
  "./assets/images/switch_cisco.jpg",
  "./assets/images/switch_ports_closeup.jpg",
  "./assets/images/utp_cable.jpg",
  "./assets/images/wifi_ap.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch(() => null)
        )
      )
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_VERSION)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  if (url.pathname.startsWith("/api/") || url.hostname.includes("ntfy.sh") || url.hostname.includes("googleapis.com")) {
    event.respondWith(
      fetch(req).catch(() =>
        new Response(JSON.stringify({ error: "Offline", offline: true }), {
          status: 503,
          headers: { "Content-Type": "application/json" }
        })
      )
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req, { ignoreSearch: false }).then((cached) => {
        const networkFetch = fetch(req)
          .then((res) => {
            if (res && res.status === 200 && res.type === "basic") {
              const copy = res.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy)).catch(() => {});
            }
            return res;
          })
          .catch(() => null);

        if (cached) return cached;
        return networkFetch.then((res) => res || caches.match("./index.html"));
      })
    );
  }
});
