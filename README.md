# ALMOST

> **Experience everything. Own nothing.**

**ALMOST** is an AI-powered experiential sanctuary where users can simulate aspirational purchases, luxurious expeditions, and quiet escapes without actually purchasing, booking, consuming, or owning anything.

Built on the philosophy of **maximum delight per minute**, ALMOST delivers immersive 2–7 minute experiences that satisfy curiosity, provide emotional payoff, generate shareable artifacts, and leave the user with zero financial damage.

---

## Key Features

1. **AI-Driven Experience Router**: Intelligently routes natural-language cravings to one of five core simulation types.
2. **The Dopamine Dial**: An intensity selector (1 — Calm, 2 — Light, 3 — Fun, 4 — Exciting, 5 — Ridiculous) modulating animation speed, tone, humor, and depth.
3. **Five Core Experiences**:
   - **ZeroCart**: Fantasy luxury shopping with bespoke configuration, $0 checkout, and acquisition reflection.
   - **DreamTrip**: Virtual luxury expedition with flight suite selection, alpine hotels, and an authentic fictional boarding pass.
   - **Five-Minute Escape**: Minimalist guided meditation with procedural soundscapes (rain, ocean, café, zen) and breathing guidance.
   - **Billion Dollar Mode**: Extravagant sovereign spending spree with an active decrementing $1,000,000,000 ticker and itemized billionaire receipt.
   - **QuitCart**: Impulse purchase intercept with an educational compounding investment growth visualizer.
4. **Museum of Things I Never Bought**: A persistent virtual gallery showcasing items explored, curiosity moments, and total avoided spending.
5. **The Nothing Feed**: Real-time anonymous social stream with only a single interaction: **"Me too"**. No vanity metrics, profiles, or follower counts.
6. **Shareable Social Artifacts**: High-fidelity client-side image generator exporting 1:1 (Instagram), 16:9 (X/LinkedIn), and 9:16 (Stories) cards.
7. **Zero-Dependency Procedural Sound Engine**: Native Web Audio API synthesizer generating natural rain, ocean swells, and zen chimes without loading external audio files.

---

## Architecture Diagram

```
                              ┌─────────────────────────┐
                              │      User Interface     │
                              │ (Next.js 16 + React 19) │
                              └────────────┬────────────┘
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │     Experience API      │
                              │   /api/experience       │
                              └────────────┬────────────┘
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │    Experience Router    │
                              │    (Prompt Analyzer)    │
                              └────────────┬────────────┘
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │       AI Director       │
                              │ (Schema & Pacing Logic) │
                              └────────────┬────────────┘
                                           │
                     ┌─────────────────────┴─────────────────────┐
                     ▼                                           ▼
         ┌───────────────────────┐                   ┌───────────────────────┐
         │    MockLLMProvider    │                   │ OpenAICompatible      │
         │ (Zero-cost, offline)  │                   │ (OpenAI, Ollama, Groq)│
         └───────────┬───────────┘                   └───────────┬───────────┘
                     │                                           │
                     └─────────────────────┬─────────────────────┘
                                           │ Validated JSON
                                           ▼
                              ┌─────────────────────────┐
                              │    Experience Engine    │
                              │   (Dynamic Renderer)    │
                              └────────────┬────────────┘
                                           │
                     ┌─────────────────────┼─────────────────────┐
                     ▼                     ▼                     ▼
              ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
              │  ZeroCart   │       │  DreamTrip  │       │ FiveMin/etc │
              └─────────────┘       └─────────────┘       └─────────────┘
```

---

## Directory Structure

```text
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── experience/route.ts      # AI Director experience generation
│   │   │   ├── museum/route.ts          # Museum items CRUD
│   │   │   ├── feed/route.ts            # The Nothing Feed & Me-Too actions
│   │   │   └── analytics/route.ts       # Privacy-conscious event collection
│   │   ├── museum/page.tsx              # Museum of Things I Never Bought
│   │   ├── feed/page.tsx                # The Nothing Feed
│   │   ├── layout.tsx                   # Root layout with fonts and providers
│   │   ├── page.tsx                     # Homepage with hero input & Dopamine Dial
│   │   └── globals.css                  # Dark-first cinematic design system
│   ├── packages/
│   │   ├── schemas/                     # Domain Zod schemas (Experience, Museum, Feed)
│   │   ├── ai-provider/                 # Model-agnostic abstraction (Mock, OpenAI/Ollama)
│   │   ├── ai-director/                 # Prompt orchestration & validation
│   │   ├── image-provider/              # Curated and procedural image generation
│   │   ├── sound-engine/                # Procedural Web Audio synthesizer (rain, ocean, zen)
│   │   ├── experience-engine/           # Dynamic stage dispatchers and renderers
│   │   └── ui/                          # Tactile buttons, BoardingPass, Receipt, Modals
│   └── lib/
│       ├── storage.ts                   # Client persistence and session management
│       └── prisma.ts                    # Database client singleton
├── prisma/
│   └── schema.prisma                    # PostgreSQL schema
├── tests/
│   ├── router.test.ts                   # Routing and intent tests
│   ├── director.test.ts                 # AI Director generation tests
│   ├── components.test.tsx              # UI component tests
│   └── storage.test.ts                  # Museum and session storage tests
├── Dockerfile                           # Multi-stage production build
├── docker-compose.yml                   # Compose config for Web + PostgreSQL
├── .env.example                         # Environment variable template
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 20+ (Node 22 recommended)
- npm 10+

### Local Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd almost
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   *(By default, `AI_PROVIDER=mock` and `IMAGE_PROVIDER=mock` require no API keys or paid services).*

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Running with Docker

To run the complete production stack including PostgreSQL:

```bash
docker compose up --build
```

Access the application at [http://localhost:3000](http://localhost:3000).

---

## AI Provider Configuration

ALMOST is model-provider agnostic.

### 1. Mock Mode (Default)
```env
AI_PROVIDER="mock"
IMAGE_PROVIDER="mock"
```
Provides instant, deterministic, highly witty responses for any user input without cost or latency.

### 2. OpenAI or OpenAI-Compatible (vLLM, Groq, Mistral)
```env
AI_PROVIDER="openai"
AI_BASE_URL="https://api.openai.com/v1"
AI_API_KEY="sk-..."
AI_MODEL="gpt-4o-mini"
```

### 3. Local Ollama
```env
AI_PROVIDER="ollama"
AI_BASE_URL="http://localhost:11434/v1"
AI_MODEL="llama3"
```

---

## Database Migrations (PostgreSQL)

If using a live PostgreSQL database:

1. Update `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/almost_db?schema=public"
   ```
2. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

---

## Testing

Run unit and integration tests with Vitest:

```bash
npm test
```

Build verification:

```bash
npm run build
```

---

## Architecture Decisions

- **Zero-Dependency Sound**: Rather than loading multi-megabyte external MP3 files that may fail over poor connections, ALMOST synthesizes binaural rain, ocean swell filters, and singing bowl chimes procedurally using the browser's native Web Audio API.
- **Client-Side Image Export**: Share cards are rendered as HTML DOM elements and snapshotted to PNG using canvas rasterization, allowing social sharing without requiring an image generation backend.
- **Fail-Safe AI Routing**: If external LLM calls timeout or fail schema validation, the system falls back gracefully to deterministic templates rather than displaying error states.
- **Privacy First**: No user prompt text is logged to server analytics. Sessions are anonymous UUIDs without advertising identifiers.

---

## Known Limitations & Roadmap

- **Audio Autoplay Restrictions**: Browsers require user interaction before playing Web Audio. Sound is intentionally default OFF and activates when toggled.
- **Next Roadmap Items**:
  - WebGL three-dimensional interactive car paint customizer.
  - Native Web Share API integration on mobile devices.
  - Multi-language localization for global currency units and travel destinations.
