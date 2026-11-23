# CCNA NETWORK ACADEMY (200-301 v1.1 & v2.0)

Full-stack interactive learning platform for Cisco CCNA 200-301 with 17 Core Modules, 35 Cisco Packet Tracer Labs, 10 Real-World Enterprise Domains, Interactive Cisco IOS CLI Simulator, Visual Subnet/VLSM Architect, OSI 7-Layer PDU Inspector, Anki SM-2 Flashcards, 6-Domain Mastery Radar, AI Network Tutor (SSE Streaming + Vision), and Offline-First PWA support.

## Project Structure

```text
CCNA/
├── index.html                      # Application entry point
├── manifest.json                   # PWA Web App Manifest (root scope)
├── sw.js                           # Offline-First Service Worker (root scope)
├── favicon.svg                     # Site icon
├── README.md                       # Architecture & deployment guide
├── api/                            # Vercel Serverless Backend Functions
│   ├── ai-tutor.js                 # Gemini SSE Streaming proxy, rate limit TTL, usageMetadata
│   ├── auth.js                     # HMAC-SHA256 multi-user authentication gateway
│   └── sync.js                     # Smart per-entity delta/timestamp cloud sync merge
├── assets/
│   ├── css/
│   │   ├── style.css               # Base layout & component styles
│   │   └── theme_executive.css     # Executive Navy & Crisp White design system
│   ├── images/                     # 24 hardware, cabling & peripheral close-up photos
│   └── labs/
│       └── lab01.pkt               # Downloadable Cisco Packet Tracer topology file
├── data/                           # Static curriculum & bilingual academic datasets
│   ├── ccna_data.json              # 17 Core Modules (VI/EN concepts, CLI, tables, quizzes)
│   ├── curriculum.js               # Standard-10 Lesson & Lab enrichments + 8-Level Roadmap
│   ├── diagrams.js                 # Interactive SVG network diagrams & hardware galleries
│   ├── en_translations.js          # 1:1 English translations for 10 Mastery Domains
│   ├── exam_mastery.js             # 10 CCNA Exam Mastery & Enterprise Field Playbooks
│   ├── glossary.js                 # Deep technical networking glossary
│   └── labs.js                     # 35 Cisco Packet Tracer Labs (topologies, IP tables, CLI)
├── js/
│   ├── core/
│   │   ├── app.js                  # Main controller, Auth/Sync, Offline Queue, SM-2 Flashcards
│   │   ├── academy_ui.js           # Dashboard, Roadmap, User Guide (#guide), TOC, Hash Router
│   │   └── workspace.js            # Personal Learning Workspace (Notes, Highlights, Bookmarks)
│   └── features/
│       ├── ai_tutor.js             # AI Network Tutor (SSE Streaming, RAG, Vision 2.0)
│       ├── command_palette.js      # Global Ctrl+K 7-source Omni-Search & Shortcuts (?)
│       ├── exam_sim.js             # Pearson VUE Mock Exam, 6-Domain Radar, Weak-Spot Drill
│       ├── ios_simulator.js        # Web Cisco IOS CLI Emulator & Live Lab Task Checker
│       └── network_toolkit.js      # Visual Subnet/VLSM Architect & Packet Flow PDU Inspector
└── scripts/
    └── validate_platform.ps1       # Automated 106-check QA validation suite
```

## Validation

Run the automated QA suite from the project root:

```powershell
powershell -ExecutionPolicy Bypass -File ".\scripts\validate_platform.ps1"
```

## Deployment (Vercel)

Pushing to `main` automatically deploys static assets and `/api/*` serverless functions on Vercel.
Optional Environment Variables on Vercel:
- `GEMINI_API_KEY`: Enables server-side AI Network Tutor SSE Streaming.
- `CCNA_AUTH_SECRET`: Secret key for signing HMAC-SHA256 session tokens.
- `CCNA_AUTH_USERS`: Optional JSON array of additional student accounts.
