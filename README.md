# NEXUS AI WORKSPACE — Agent Orchestrator Manager Dashboard

Dashboard prototype untuk **monitoring agentic AI** secara *real-time*. Menampilkan orkestrasi
hirarkis sekumpulan agen AI: satu **Master Orchestrator (CEO)** mendelegasikan tugas ke
*Head* departemen, dan masing-masing mengelola tim agen spesialis.

Seluruh data bersifat **simulasi (prototype)** — digenerate oleh *simulation engine* lokal
yang memproduksi event agent secara live. Tidak ada backend, tidak ada koneksi API.

> Blueprint layout + spesifikasi animasi lengkap: [`docs/layout-animasi-agent-dashboard.md`](docs/layout-animasi-agent-dashboard.md)

---

## Fitur

| Zona | Deskripsi |
|---|---|
| **Topbar** | Env badge, jumlah agen aktif, counter token (animasi spring), kontrol play/pause & kecepatan (0.5×–4×), tombol `⚡ Deploy All` |
| **Agent Registry** (kiri) | Tree organisasi 16 agen, expandable/collapsible, status dot per agen, klik untuk memilih |
| **Orchestrator Canvas** (tengah) | Tree hierarkis 3 tingkat dalam SVG: edge beranimasi (dash-flow + data packet), status ring 🟢🟡⚪, activation wave, zoom/fit, badge `Cycle #N` |
| **Inspector** (kanan) | Detail agen terpilih: status, progress, *thought stream* (ketik per-karakter + cursor), checklist akses tools, metrik token |
| **Telemetry & Logs** (bawah) | Live chatter ber-timestamp, warna per level (info/debug/success/warn/error), auto-scroll, tombol download log |

## Teknologi

- **Next.js 16** (App Router, Turbopack) — React 19, TypeScript
- **Tailwind CSS v4** — dark theme, glassmorphism, token warna status
- **Framer Motion 12** — animasi state machine, spring counter, transisi
- **Lucide React** — ikon
- **SVG SMIL** (`animateMotion`) — data packet yang meluncur di edge kanvas

## Arsitektur & Struktur File

```
src/
├── app/
│   ├── layout.tsx          # Root layout (dark theme)
│   ├── page.tsx            # Workspace single-screen (client)
│   └── globals.css         # Theme tokens + keyframes animasi + reduced-motion
├── components/
│   ├── canvas/             # OrchestratorCanvas, OrgNode, OrgEdge (SVG)
│   ├── inspector/          # InspectorPanel (thought stream, tools)
│   ├── layout/             # TopBar
│   ├── logs/               # TelemetryLogs
│   ├── registry/           # AgentRegistry (tree)
│   └── ui/                 # StatusDot, AnimatedNumber, TypingDots, ProgressBar
├── hooks/
│   └── useSimulation.ts    # Hook reducer + interval tick
└── lib/
    ├── anim/               # tokens durasi/easing, variants framer-motion
    └── simulation/
        ├── types.ts        # AgentNode, LogLine, SimState, AgentStatus
        ├── agents.ts       # Seed 16 agen (CEO → 3 dept → 10 spesialis)
        ├── scenarios.ts    # Naratif task + rotating goals
        └── engine.ts       # Reducer (TICK/DEPLOY/PAUSE/…) + state machine
```

### Simulation Engine

- Agent punya state machine: `idle → queued → thinking → tool → working → success/error → idle`.
- Engine jalan via `useReducer` + `setInterval` (tick = 1 detik ÷ speed).
- **Infinite loop** — tiap siklus (±17 tick) agent di-reset bersih dan goal ber-rotasi
  otomatis di antara 4 varian, sehingga terlihat seperti *engineering loop* yang terus berjalan.
- Log dibatasi 120 baris terakhir; counter token terakumulasi terus-menerus.

## Menjalankan

Prasyarat: Node.js ≥ 20.9.

```bash
npm install
npm run dev          # bind port 3000
```

Buka: <http://localhost:3000/agent-orchestrator-nextjs>

> Aplikasi memakai **basePath** `/agent-orchestrator-nextjs`, jadi root `/` tidak dipakai.
> `allowedDevOrigins` sudah di-set untuk akses via IP network (mis. `11.11.10.3`).

### Script

| Script | Kegunaan |
|---|---|
| `npm run dev` | Dev server di port 3000 (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Jalankan production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check |

## Kontrol Interaktif

- **Play/Pause** — hentikan/lanjutkan simulasi (tombol di Topbar).
- **Kecepatan** — 0.5×, 1×, 2×, 4×.
- **⚡ Deploy All** — mulai siklus orkestrasi baru secara manual.
- **Klik node / baris registry** — pilih agen untuk di-inspect di panel kanan.
- **Zoom + / − / Fit** — kontrol tampilan kanvas.

## Dokumentasi Lain

- [Layout & Spesifikasi Animasi](docs/layout-animasi-agent-dashboard.md) — blueprint ASCII,
  5 zona layout, tree 16 agen, spesifikasi animasi "agent sedang bekerja", kontrak engine.
