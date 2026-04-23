# ⚽ PitchOS - Live Match Command Center

A real-time football monitoring dashboard built as an OS-style interface for tracking live matches. Think infrastructure monitoring but for football.

**[Live Demo](https://pitch-os-beta.vercel.app/)** · **[GitHub](https://github.com/aumkarringe/PitchOS)**

<img width="1880" height="986" alt="image" src="https://github.com/user-attachments/assets/3587aba8-e259-463c-8808-4f01781e5711" />


## Tech Stack

| Technology | Role | Why |
|---|---|---|
| **Next.js 15** | Full-stack framework | App router, API routes, SSR |
| **Tailwind CSS** | Styling | Utility-first, fast iteration |
| **shadcn/ui** | Component library | Owned components, fully customizable |
| **Convex** | Real-time database | Automatic push updates — no polling |
| **Groq (Llama 3.3)** | Natural language AI | Sub-second inference for live queries |
| **Framer Motion** | Animations | Smooth state transitions |
| **Recharts** | Data visualization | Grafana-style stats charts |
| **PostHog** | Analytics | User behavior tracking |
| **API-Football** | Live data source | Real match scores and events |
| **Vercel** | Deployment | Zero-config, instant deploys |

---

## Key Features

### 1. Real-Time Match Grid
- Live scores updating automatically via Convex subscriptions
- No polling, no refresh - data pushes to every connected client instantly
- Skeleton loading states, empty states, error handling

### 2. Match Deep Dive
- Full player lineup grid - active, subbed, and injured players
- Color-coded status tiles (green = active, grey = subbed, red = injured)
- Live events feed with smooth slide-in animations
- Grafana-style stats: possession, shots, passes

### 3. Natural Language Interface (CMD+K)
- Ask questions about live matches in plain English
- Groq reads all live match data as context and answers intelligently
- Example: *"Which match has the most goals?"* → direct answer using real data
- Chat-style conversation UI with typing indicator

### 4. Simulate Incident
- One-click demo button that fires a realistic match event
- Score updates instantly on home page
- Event slides into the feed on the match page
- Demonstrates Convex real-time sync end-to-end

### 5. PostHog Analytics
- Tracks which matches users click most
- Tracks natural language queries
- Tracks feature usage patterns
- Demonstrates product thinking beyond just shipping features

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                  Next.js App                 │
│                                             │
│  ┌──────────────┐    ┌────────────────────┐ │
│  │   Frontend   │    │    API Routes      │ │
│  │              │    │                    │ │
│  │  React +     │    │  /api/matches      │ │
│  │  shadcn/ui   │    │  /api/match/[id]   │ │
│  │  Tailwind    │    │  /api/ask          │ │
│  └──────┬───────┘    └────────┬───────────┘ │
│         │                     │             │
└─────────┼─────────────────────┼─────────────┘
          │                     │
          ▼                     ▼
   ┌─────────────┐      ┌──────────────┐
   │   Convex    │      │ API-Football │
   │             │      │              │
   │  Real-time  │      │  Live match  │
   │  database   │      │  data source │
   │             │      │              │
   │  matches    │      └──────────────┘
   │  events     │
   │  players    │      ┌──────────────┐
   │  stats      │      │     Groq     │
   └─────────────┘      │              │
                        │  Llama 3.3   │
                        │  70B model   │
                        │              │
                        └──────────────┘
```

**Data flow:**
1. Next.js API route fetches from API-Football every 30 seconds
2. Fresh data gets written to Convex via mutations
3. Convex automatically pushes updates to all subscribed frontend components
4. Components re-render with new data — zero manual refresh logic

---

## Real-Time Architecture Decision

I chose **Convex over a traditional REST + polling approach** for a specific reason.

With polling:
- Frontend asks server every N seconds: "anything new?"
- Wasteful — most responses are "nothing changed"
- Latency = up to N seconds behind reality

With Convex subscriptions:
- Frontend declares what data it cares about once
- Convex pushes updates the moment data changes
- Latency = milliseconds
- Scales naturally to multiple connected clients

This is the same pattern needed for cluster monitoring — where node state changes constantly and dashboards must reflect reality immediately.

---

## Natural Language Interface Design

The CMD+K bar sends the full live match context to Groq with every query:

```
System: You are PitchOS — an intelligent football analyst.
        Answer in 2-3 sentences. Be direct and specific.

User: [all current match data as JSON]
      Question: "Which match has the most goals?"
```

This mirrors how a cluster monitoring AI would work — feeding current system state as context so the model can answer questions grounded in real data, not hallucinated facts.

---

## PostHog Integration

Tracked events:

| Event | Properties | Purpose |
|---|---|---|
| `match_clicked` | match_id, league, is_live | Which matches get most attention |
| `match_viewed` | match_id, teams, league | Deep dive engagement |
| `natural_language_query` | question, match_count | AI feature usage |
| `incident_simulated` | incident_type, match_id | Demo feature usage |

---

## Local Development

```bash
# Clone
git clone https://github.com/YOURUSERNAME/pitchos.git
cd pitchos

# Install
npm install

# Environment variables
cp .env.example .env.local
# Fill in your API keys

# Start Convex (in one terminal)
npx convex dev

# Start Next.js (in another terminal)
npm run dev
```

Open `http://localhost:3000`

---

## Environment Variables

```bash
FOOTBALL_API_KEY=        # api-football.com
GROQ_API_KEY=            # console.groq.com
NEXT_PUBLIC_POSTHOG_KEY= # posthog.com
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_CONVEX_URL=  # auto-set by Convex
```

---
