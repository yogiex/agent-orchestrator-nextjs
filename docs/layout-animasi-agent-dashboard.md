# Layout & Spesifikasi Animasi — NEXUS AI WORKSPACE (Agent Orchestrator Manager Dashboard)

## Ringkasan

Dokumen ini adalah **blueprint layout + spesifikasi animasi** untuk prototype dashboard
monitoring agentic AI bernama **NEXUS AI WORKSPACE**. Dashboard menampilkan orkestrasi
hirarkis agen AI secara *real-time*: satu Master Orchestrator (CEO) mendelegasikan
tugas ke para *Head* departemen, yang masing-masing mengelola tim agen spesialis.

Tujuan dokumen:

- Menjadi **referensi tunggal** layout 5 zona dan struktur tree 16 node agen.
- Menetapkan **spesifikasi animasi "agent sedang bekerja"** secara deterministik
  (state machine → motion signature → teknik implementasi).
- Mendokumentasikan **kontrak data** Simulation Engine beserta struktur file.

---

## 1. Blueprint Layout (ASCII)

Berikut diagram ASCII blueprint layout utama dashboard:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ ◉ NEXUS AI WORKSPACE   [Env: Prod]   🟢 16 Agents Active   🔥 45.2k Tokens   [⚡ Deploy All]│
├────────────┬─────────────────────────────────────────────────────────────────────┬───────────┤
│ 🏢 AGENT   │ 🕸️ ORCHESTRATOR CANVAS (Hierarchical Startup Tree)      [Zoom] [Fit]│ 🎛️ INSP.  │
│ REGISTRY   │                                                                     │           │
│            │                   ╔═══════════════════════════╗                     │ 💻 FRONT- │
│ ▼ Startup  │                   ║ 🧠 CEO / MASTER ORCH.     ║                     │ END ENG.  │
│  ├─🧠 CEO  │                   ║ 🟢 Orchestrating Goal...  ║                     │ #A-04     │
│  ├─📦 Prod │                   ╚═════════════╤═════════════╝                     ├───────────┤
│  │ ├─📋 PM  │                                 │                                 │ Status:   │
│  │ ├─🎨 UX  │       ┌─────────────────────────┼─────────────────────────┐       │ 🟢 Running│
│  │ ├─💻 FE ◀┼───────┼─────────────────────────┼─────────────────────────┼──────▶│           │
│  │ ├─⚙️ BE  │       ▼                         ▼                         ▼       │ Thought:  │
│  │ └─📱 MB  │ ╔═══════════════════╗ ╔═══════════════════╗ ╔═══════════════════╗ │ > Import..│
│  ├─📈 Grow  │ ║ 📦 HEAD OF PRODUCT║ ║ 📈 HEAD OF GROWTH ║ ║ 💼 HEAD OF BIZ &  ║ │ > compon..│
│  │ ├─🚀 GH  │ ║ 🟡 Reviewing Spec ║ ║ 🟢 Running Ads    ║ ║ 📊 DATA ANALYTICS ║ │ > styling │
│  │ ├─💰 Perf│ ╚═════════╤═════════╝ ╚═════════╤═════════╝ ║ ⚪ Awaiting Data    ║ │ > with Ta │
│  │ ├─🔍 SEO │           │                     │           ╚═════════╤═════════╝ │ > ilwind  │
│  │ ├─✍️ CC  │   ┌───┬───┼───┬───┐     ┌───┬───┼───┬───┐           │           ├───────────┤
│  │ └─📡 DM  │   ▼   ▼   ▼   ▼   ▼     ▼   ▼   ▼   ▼   ▼     ┌─────┴─────┐     │ Tools:    │
│  └─💼 Biz   │ [📋][🎨][💻][⚙️][📱]   [🚀][💰][🔍][✍️][📡]     ▼           ▼     │ [x] Read  │
│    ├─🤝 BD  │ [PM][UX][FE][BE][MB]   [GH][PF][SE][CC][DM]   [🤝]        [📊]  │ [x] Write │
│    └─📊 DA  │                                                           [BD]  [DA]  │ [x] Bash  │
│            │                                                                     │ [ ] DB    │
├────────────┴─────────────────────────────────────────────────────────────────────┴───────────┤
│ ▼ TELEMETRY & LOGS (Live Startup Chatter)                                             [⬇️]  │
│ [10:02:01] 🟢 [CEO] Goal received: "Launch Q3 Mobile App & Marketing Campaign"                 │
│ [10:02:05] 🟡 [Head Prod] Delegating UI/UX to Designer, and specs to PM...                     │
│ [10:02:12] 🔵 [FE Agent] Waking up... Importing React components and styling with Tailwind...  │
│ [10:02:15] 🟣 [Perf Marketer] Allocating $500 budget to Meta Ads for iOS user acquisition...   │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Breakdown 5 Zona Layout

| Zona | Elemen | State / Animasi |
| --- | --- | --- |
| **1. Topbar** | Logo `◉ NEXUS AI WORKSPACE`, badge `[Env: Prod]`, indikator `🟢 16 Agents Active`, `🔥 45.2k Tokens`, tombol `[⚡ Deploy All]` | Badge env statis; counter agent & token beranimasi (AnimatedNumber spring); tombol Deploy All memicu *deploy wave* ke seluruh canvas |
| **2. Agent Registry (kiri)** | Panel `🏢 AGENT REGISTRY`, pohon tree 16 node (Startup → Prod/Grow/Biz → spesialis), node terpilih ditandai `◀` | Node baru *expand/slide-in* saat deploy; node aktif diberi **status dot breathing**; indentasi tree via layoutId |
| **3. Orchestrator Canvas (tengah)** | `🕸️ ORCHESTRATOR CANVAS` — node CEO/Head + kolom leaf, edge hierarki, tombol `[Zoom] [Fit]`, edge CEO→FE **di-highlight** | *Flowing dashed edges* (stroke-dashoffset), **data packet** via SVG animateMotion, **activation wave**, status ring **glow**, ripple pada receive |
| **4. Inspector (kanan)** | `🎛️ INSPECTOR` — identitas agent (`💻 FRONT-END ENG. #A-04`), Status `🟢 Running`, panel Thought (streaming), Tools checklist (Read/Write/Bash ✅, DB ❌) | Thought **typing per-char** + **blinking cursor**; indikator status ring glow; checklist tools *slide + check* |
| **5. Telemetry & Logs (bawah)** | `▼ TELEMETRY & LOGS` — baris log `[timestamp] level [agent] pesan`, tombol `[⬇️]` download, live startup chatter | Log **slide-in dari bawah**, **auto-scroll** ke baris terbaru, batas 120 baris (ring buffer) |

---

## 3. Struktur Tree Agent (16 Node)

```
🧠 CEO / Master Orchestrator (root)
├── 📦 Head of Product
│   ├── 📋 PM (Product Manager)
│   ├── 🎨 UX (UX Designer)
│   ├── 💻 FE (Front-End Engineer)
│   ├── ⚙️ BE (Back-End Engineer)
│   └── 📱 MB (Mobile Engineer)
├── 📈 Head of Growth
│   ├── 🚀 GH (Growth Hacker)
│   ├── 💰 Perf (Performance Marketer)
│   ├── 🔍 SEO (SEO Specialist)
│   ├── ✍️ CC (Content Creator)
│   └── 📡 DM (Digital Marketer)
└── 💼 Head of Biz & Data
    ├── 🤝 BD (Biz Dev)
    └── 📊 DA (Data Analyst)
```

**16 node**: 1 CEO + 3 Head + 12 spesialis (5 Product + 5 Growth + 2 Biz & Data).

### Naratif Aktif (scene demo)

Goal berjalan: **"Launch Q3 Mobile App & Marketing Campaign"**

| Agent | Status | Peran dalam naratif |
| --- | --- | --- |
| 🧠 CEO / Master Orchestrator | 🟢 | Menerima goal, mengorkestrasi delegasi ke 3 Head |
| 📦 Head of Product | 🟡 | *Reviewing Spec* — mendelegasikan UI/UX ke Designer & specs ke PM |
| 📈 Head of Growth | 🟢 | *Running Ads* — mengalokasikan $500 ke Meta Ads (iOS acquisition) |
| 💼 Head of Biz & Data | ⚪ | *Awaiting Data* — menunggu input sebelum eksekusi |
| 💻 FE Engineer | 🟢 | Sedang **di-inspect** (panel Inspector `#A-04`) — thought streaming (Import components → styling Tailwind), tools Read/Write/Bash aktif, **DB non-aktif** |

Detail interaksi: **edge CEO→FE di-highlight** (panah `────▶`) menandakan delegasi langsung aktif
ke agent yang sedang di-inspect. Panel Telemetry menampilkan chatter live sesuai alur:
`CEO → Head Prod → FE Agent → Perf Marketer`.

---

## 4. Spesifikasi Animasi "Agent Sedang Bekerja"

### 4.1 State Machine → Motion Signature

| Fase | Motion Signature | Teknik Implementasi |
| --- | --- | --- |
| **idle** | Node statis, ring tipis 1px, dot biru redup, opacity rendah | `animate={{ opacity: 0.55 }}`, transition 250–300ms |
| **queued** | Ring kuning berkedip, node bergoyang halus (nudge), panah masuk ke node | `animate={{ x: [0, -2, 2, 0] }}`, durasi 250ms, loop |
| **thinking** | Ring biru *pulsing glow*, ikon `…` animasi dot 3-titik, latar shimmer samar | `animate={{ opacity: [1, 0.4, 1] }}` + box-shadow glow, 400ms |
| **tool** | Ikon tool muncul + *pop*; checklist tools slide-in satu per satu | `spring` (stiffness ~300, damping ~20) untuk scale/opacity |
| **working** | Progress bar determinate maju, edge anak *flowing*, data packet meluncur | stroke-dashoffset linear `animateMotion`, durasi 1.2s |
| **success** | Ring hijau *ring pulse* sekali + checkmark *scale-in* + riak (ripple) | `keyframes` scale 0.6→1.15→1, opasitas ripple fades 400ms |
| **error** | Ring merah bergetar (shake), getaran 2px X/Y, log level error merah | `animate={{ x: [0, -4, 4, -2, 0] }}`, 250ms, sekali |

### 4.2 Detail Komponen

| Komponen | Spesifikasi |
| --- | --- |
| **Orchestration canvas** | Edge dashed `stroke-dasharray: 6 4` + **flowing** via `stroke-dashoffset` animasi; **data packet** bulatan SVG di `animateMotion` mengikuti path edge; **activation wave** — gelombang radius dari node aktif; **status ring glow** — box-shadow keyed per status; **ripple receive** — lingkaran membesar + fade saat node menerima packet |
| **Inspector** | Thought **typing per-char** (interval ~15–30ms/char), **blinking cursor** `▍` (opacity 1/0, 500ms); daftar thought auto-append |
| **Telemetry** | Log **slide-in dari bawah** (`y: 20 → 0`, 250ms), **auto-scroll** ke baris terbaru; log lama fade keluar ring buffer 120 baris |
| **Counter angka** | `AnimatedNumber` dengan **spring** (`type: "spring", stiffness: 200`) untuk totalTokens & activeAgents |
| **Progress bar** | **Determinate** (fill kanan kiri, 250ms/ease-out) untuk status `working`; **indeterminate shimmer** (gradient slide-loop 1.2s) saat `thinking` |
| **Micro-detail** | **Live clock** topbar tick tiap detik; **breathing status dots** (scale 1→1.25→1, 1.2s ease-in-out); **play/pause/speed** control (0.5× / 1× / 2× / 4×) untuk simulasi |

### 4.3 Aturan Animasi

- **Hanya animasi `transform` + `opacity`** — tidak pernah animasi `width/height/top/left` (hindari layout thrashing, kompatibel compositor GPU).
- **`prefers-reduced-motion: reduce`** — semua animasi loop di-disable; hanya transisi state statis yang dipertahankan.
- **Durasi tokens**: micro **150ms** (hover, tooltip, tap), standard **250–300ms** (log, checklist, panel), status **400ms** (ring glow, success pulse), ambient **1.2–3s** (flowing edges, shimmer, breathing dot).
- Timing semua diambil dari varian duration token agar konsisten lintas komponen.

---

## 5. Model Data Simulation Engine

Simulasi dijalankan dengan **pure reducer** (pattern `useReducer`) sehingga seluruh state
deterministik dan bisa di-replay.

### 5.1 SimState

```ts
interface SimState {
  agents: AgentNode[];        // 16 node agen (tree)
  log: LogLine[];             // ring buffer log (maks 120)
  totalTokens: number;        // akumulasi token, tampil di Topbar
  activeAgents: number;       // jumlah agen berstatus aktif
  goal: string;               // goal aktif (default "Launch Q3 Mobile App & Marketing Campaign")
  running: boolean;           // true = sim berjalan
  speed: number;              // kecepatan sim (0.5 | 1 | 2 | 4)
  cycle: number;              // siklus scenario
  tick: number;               // counter tick engine
  selectedAgentId: string;    // agent yang sedang di-inspect
  deployed: number;           // jumlah agen ter-deploy
}
```

### 5.2 AgentNode & AgentStatus

```ts
interface AgentNode {
  id: string;          // "A-01" ... "A-16"
  name: string;        // "Front-End Engineer"
  shortName: string;   // "FE"
  role: string;
  emoji: string;
  deptId: string | null; // parent / dept (null = CEO root)
  status: AgentStatus;
  currentTask: string;
  thoughts: string[];  // list pemikiran untuk Inspector
  tools: { read: boolean; write: boolean; bash: boolean; db: boolean };
  tokens: number;
  progress: number;    // 0..1 untuk progress bar
}

type AgentStatus =
  | "idle" | "queued" | "thinking"
  | "tool" | "working" | "success" | "error";

interface LogLine {
  id: string;
  time: string;        // "10:02:01"
  agentId: string;
  agentEmoji: string;
  agentName: string;
  level: LogLevel;     // info | success | warn | debug | error
  message: string;
}
```

### 5.3 Kontrol Hook & Reducer

**Hook `useSimulation()`** — expose kontrol:

```ts
const {
  state,          // SimState
  pause,          // () => void
  resume,         // () => void
  setSpeed,       // (s: 0.5 | 1 | 2 | 4) => void
  deployAll,      // () => void
  selectAgent,    // (id: string) => void
} = useSimulation();
```

**Reducer engine** — aksi:

```ts
type SimAction =
  | { type: "TICK" }                       // maju 1 langkah scenario
  | { type: "DEPLOY" }                     // deploy semua agen
  | { type: "PAUSE" } | { type: "RESUME" }
  | { type: "SET_SPEED"; speed: number }
  | { type: "SELECT"; agentId: string };
```

**Scenario loop** — engine berjalan dalam siklus **17 tick** (`SCENARIO_LOOP_AT = 17`)
yang memutar script naratif "Launch Q3 Mobile App & Marketing Campaign"; tiap TICK
memajukan status agen, menambah log, dan meng-update counter tokens.

---

## 6. Tech Stack & Struktur File

### Tech Stack

| Lapisan | Teknologi | Catatan |
| --- | --- | --- |
| Framework | **Next.js 16.2** (App Router) | — |
| UI Runtime | **React 19** | — |
| Bahasa | **TypeScript 5** | strict |
| Styling | **Tailwind CSS v4** | via `@tailwindcss/postcss` |
| Animasi | **framer-motion 12** | motion components + SVG animateMotion |
| Ikon | **lucide-react** | ikon UI (Zoom, Fit, Play, dll.) |

### Struktur Direktori `src/`

```
src/
├── app/
│   ├── layout.tsx          # Root layout (globals, font)
│   ├── page.tsx            # Halaman utama dashboard
│   ├── globals.css         # Tailwind v4 + tokens durasi animasi
│   └── favicon.ico
├── hooks/
│   └── useSimulation.ts    # Hook kontrol sim (pause/resume/setSpeed/deployAll/selectAgent)
├── lib/
│   └── simulation/
│       ├── types.ts        # SimState, AgentNode, AgentStatus, LogLine
│       ├── agents.ts       # Definisi 16 node agen (tree)
│       ├── engine.ts       # Reducer + aksi (TICK/DEPLOY/PAUSE/RESUME/SET_SPEED/SELECT)
│       └── scenarios.ts    # Script scenario loop 17 tick + default goal
└── components/
    ├── layout/             # Topbar, sidebar wrapper
    ├── registry/           # Zona 2 — Agent Registry tree
    ├── canvas/             # Zona 3 — Orchestrator Canvas + edge/packet
    ├── inspector/          # Zona 4 — Inspector (thought stream, tools)
    ├── logs/               # Zona 5 — Telemetry & Logs
    └── ui/                 # AnimatedNumber, StatusDot, ProgressBar, controls
```

---

## 7. Verifikasi

Jalankan dari root project untuk memverifikasi prototype:

```bash
npm run dev          # Jalankan dev server (http://localhost:3000)
npm run build        # Build production (verifikasi build clean)
npm run lint         # ESLint (config eslint-config-next)
npx tsc --noEmit     # Type-check seluruh project tanpa emit
```

Urutan verifikasi yang disarankan: `npx tsc --noEmit` → `npm run lint` → `npm run build`,
lalu `npm run dev` untuk pengecekan visual & interaksi.
