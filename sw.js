// ============================================================================
// CCNA NETWORK ACADEMY — OFFLINE-FIRST SERVICE WORKER (PWA)
// - Precaches all core HTML, CSS, JS, ccna_data.json, SVG & hardware images
// - Cache-First for static educational assets so students can study 100% offline
// - Network-First for /api/* requests (AI Tutor, Cloud Sync, Auth)
// ============================================================================

const CACHE_VERSION = "ccna-academy-v2026-11-23-v6";

const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./favicon.svg",
  "./style.css?v=20261123_v6",
  "./theme_executive.css?v=20261123_v6",
  "./ccna_data.json",
  "./diagrams.js?v=20261123_v4",
  "./glossary.js?v=20261123_v4",
  "./labs.js?v=20261123_v4",
  "./exam_mastery.js?v=20261123_v4",
  "./en_translations.js?v=20261123_v4",
  "./exam_sim.js?v=20261123_v4",
  "./ai_tutor.js?v=20261123_v4",
  "./curriculum.js?v=20261123_v4",
  "./workspace.js?v=20261123_v4",
  "./command_palette.js?v=20261123_v4",
  "./ios_simulator.js?v=20261123_v4",
  "./network_toolkit.js?v=20261123_v4",
  "./app.js?v=20261123_v4",
  "./academy_ui.js?v=20261123_v4",
  "./images/aruba_switch.jpg",
  "./images/cctv_ip_camera.jpg",
  "./images/coaxial_bnc_port.jpg",
  "./images/console_cable.jpg",
  "./images/fiber_lc_sc_ports.jpg",
  "./images/fiber_optic.jpg",
  "./images/firewall_asa.jpg",
  "./images/ip_phone.jpg",
  "./images/mfp_printer_lcd.jpg",
  "./images/mikrotik_router.jpg",
  "./images/nic_card.jpg",
  "./images/office_scanner.jpg",
  "./images/patch_panel_ports.jpg",
  "./images/poe_switch_ports.jpg",
  "./images/pos_receipt_printer.jpg",
  "./images/rack_rear_cabling.jpg",
  "./images/rj45_connector_pins.jpg",
  "./images/router_cisco.jpg",
  "./images/router_rear_ports.jpg",
  "./images/server_rack.jpg",
  "./images/sfp_module.jpg",
  "./images/switch_cisco.jpg",
  "./images/switch_ports_closeup.jpg",
  "./images/utp_cable.jpg",
  "./images/wifi_ap.jpg"
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

  // Never cache dynamic API requests or external ntfy streams
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

  // Same-origin static assets: Cache-First with background refresh (Stale-While-Revalidate)
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
