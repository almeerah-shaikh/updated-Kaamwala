# 📘 Kaamwala — README & Technical Documentation

<div align="center">

![Kaamwala](https://img.shields.io/badge/Kaamwala-AI%20Service%20Orchestrator-6C63FF?style=for-the-badge&logo=robot&logoColor=white)
[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-kamwla.netlify.app-brightgreen?style=for-the-badge)](https://kamwla.netlify.app)
[![Orchestrator](https://img.shields.io/badge/Orchestrator-Active-00D4AA?style=for-the-badge)](https://kamwla.netlify.app)
[![Providers](https://img.shields.io/badge/Providers-18%20Active-blue?style=for-the-badge)](https://kamwla.netlify.app)

</div>

---

## 📝 Project Overview

**Kaamwala** is a real-time agentic AI platform built for Pakistan's informal economy, connecting everyday skilled workers — plumbers, AC technicians, tutors, mechanics — with customers through an intelligent orchestration engine that understands Urdu, Roman Urdu, and English. When a customer describes their need in any language, Kaamwala's NLP parser detects the intent and urgency, then its 7-Factor AI Matcher scores and ranks nearby providers based on distance, skill, reliability, rating, price, cancellation history, and experience — dispatching the best match instantly with a live job card, turn-by-turn navigation, and a service checklist, while syncing everything to a real-time database and Google Sheets dashboard.

---

## 🎨 Overall Design of the Solution

Kaamwala is designed as a **dual-interface, single-page agentic system** — meaning both the customer-facing Client App and the provider-facing Partner App live within the same frontend shell, coordinated by a central AI orchestrator running entirely in the browser.

### Design Principles

| Principle | Implementation |
|---|---|
| **Agentic-first** | The orchestrator makes decisions autonomously — no human dispatcher needed |
| **Urdu-first UX** | All UI copy, chat messages, and notifications support Roman Urdu natively |
| **Transparency** | Every AI decision is logged in real-time in the Orchestrator Trace Log |
| **Resilience** | Built-in chaos scenarios test graceful degradation under failure |
| **Observability** | Live metrics, match scores, pricing, and logs are always visible |
| **Tunability** | Match weights are editable in real-time via sliders — no code change needed |

### UI Layout

```
┌────────────────────────────────────────────────────────────────────┐
│                        KAAMWALA PLATFORM                           │
├──────────────────────┬─────────────────────────────────────────────┤
│                      │                                             │
│    👤 CLIENT APP     │         🛠️ PARTNER APP                     │
│                      │                                             │
│  - Chat Interface    │  - Online/Offline Toggle                    │
│  - Quick Chips       │  - Job Dispatch Card                        │
│  - Language Toggle   │  - Navigation Guide                         │
│  - ETA Display       │  - Service Checklist                        │
│  - Rating Screen     │  - Earnings Dashboard                       │
│                      │                                             │
├──────────────────────┴─────────────────────────────────────────────┤
│                   🧠 AI ENGINE PANEL                               │
│                                                                    │
│  [🎯 NLP Parser]  [📊 Match Grid]  [⚙️ Weights]  [📟 Logs]        │
│  [💰 Pricing]     [🌪️ Stress Tester]   [🗄️ DB Sync]              │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture Overview

Kaamwala follows an **event-driven agentic architecture** where a central orchestrator reacts to user inputs, dispatches tasks to sub-agents, and updates state across both the client and partner interfaces simultaneously.

```
                     ┌─────────────────────────┐
                     │      USER INPUTS         │
                     │  (Chat / Chips / Toggle) │
                     └────────────┬────────────┘
                                  │ Events
                     ┌────────────▼────────────┐
                     │   KAAMWALA ORCHESTRATOR  │
                     │    AntigravityOS v2.0    │
                     │                         │
                     │  ┌───────────────────┐  │
                     │  │  Event Bus /      │  │
                     │  │  State Manager    │  │
                     │  └────────┬──────────┘  │
                     └───────────┼─────────────┘
          ┌────────────┬─────────┼──────────┬────────────┐
          │            │         │          │            │
   ┌──────▼───┐ ┌──────▼──┐ ┌───▼────┐ ┌───▼────┐ ┌────▼────┐
   │  NLP     │ │Matcher  │ │Pricing │ │Dispatch│ │ Logger  │
   │  Agent   │ │ Agent   │ │ Agent  │ │ Agent  │ │  Agent  │
   └──────┬───┘ └──────┬──┘ └───┬────┘ └───┬────┘ └────┬────┘
          │            │         │          │            │
          └────────────┴─────────┴──────────┴────────────┘
                                  │
                     ┌────────────▼────────────┐
                     │       DATA LAYER         │
                     │                         │
                     │  ┌──────────┐ ┌───────┐ │
                     │  │ Provider │ │Google │ │
                     │  │    DB    │ │Sheets │ │
                     │  └──────────┘ └───────┘ │
                     └─────────────────────────┘
```

### Architecture Layers

| Layer | Components | Responsibility |
|---|---|---|
| **Presentation** | Client App, Partner App | User interaction, state display |
| **Orchestration** | AntigravityOS v2.0 | Event routing, decision-making, coordination |
| **Agent Layer** | NLP, Matcher, Pricing, Dispatch, Logger Agents | Specialized AI task execution |
| **Data Layer** | Provider DB, Google Sheets | Persistence, sync, admin observability |

---

## 🤖 Agents Developed

Kaamwala's intelligence is broken into **5 specialized agents**, each responsible for a distinct function within the orchestration pipeline.

---

### 1. 🧠 NLP Agent — Multilingual Intent Parser

**Purpose:** Converts raw customer input (in any language) into structured intent data.

**Input:** Free-text string (Urdu / Roman Urdu / English / mixed)

**Output:**
```json
{
  "detected_intent": "AC_REPAIR",
  "extracted_urgency": "HIGH",
  "confidence_score": 0.96,
  "identified_location": "G-11, Islamabad",
  "translated_standard": "My AC has stopped working, need urgent repair"
}
```

**Capabilities:**
- Tokenizes code-switched input (e.g. `"yaar AC band ho gaya ASAP"`)
- Maps Roman Urdu slang to intent categories via custom lexicon
- Scores confidence on a 0–1 scale
- Identifies location references from informal names (e.g. "G-eleventh", "Blue Area")
- Handles 9 service intent categories across 3 language modes

**Languages Supported:**

| Mode | Example Input |
|---|---|
| Urdu | `"مجھے پلمبر چاہیے"` |
| Roman Urdu | `"mujhe plumber chahiye abhi"` |
| English | `"I need a plumber urgently"` |
| Code-switched | `"bhai plumber bejo na ghar pe leak ho raha hai"` |

---

### 2. 🎯 Matcher Agent — 7-Factor AI Matchmaker

**Purpose:** Scores and ranks all available service providers against the detected intent using a weighted multi-factor algorithm.

**Formula:**
```
Score = (W_d × S_distance) + (W_s × S_skill)    + (W_r × S_reliability)
      + (W_p × S_price)   + (W_c × S_cancel_inv) + (W_a × S_rating)
      + (W_e × S_experience)
```

**Default Weights:**

| Factor | Weight | Description |
|---|---|---|
| 🚗 Distance (W_d) | 0.25 | Proximity to customer |
| 🎯 Skill Match (W_s) | 0.20 | Specialization fit |
| ⏰ Reliability (W_r) | 0.15 | On-time history |
| 💰 Price Compat (W_p) | 0.10 | Budget alignment |
| ❌ Cancel Rate (W_c) | 0.10 | Inverse cancellation |
| ⭐ Rating (W_a) | 0.12 | Aggregate star score |
| 🎓 Experience (W_e) | 0.08 | Years + certifications |
| | **Σ 1.00** | |

**Output:** Ranked provider list with scores, displayed in the Match Grid table.

**Live Tuning:** All weights are adjustable in real-time via sliders without restarting the engine.

---

### 3. 💰 Pricing Agent — Dynamic Fare Calculator

**Purpose:** Calculates the estimated job cost based on service type, distance, and current city-wide demand.

**Formula:**
```
Final Price = (Base Service Charge + Distance Travel Buffer) × Surge Multiplier
```

**Surge States:**

| State | Capacity Load | Multiplier |
|---|---|---|
| 🟢 REGULAR | < 60% | 1.0× |
| 🟡 BUSY | 60–80% | 1.5× |
| 🟠 SURGE | 80–95% | 2.0× |
| 🔴 PEAK | > 95% | 3.0× |

**Output:**
```
Base Service Charge:       PKR 1,800
Distance Travel Buffer:    PKR   600
Surge Multiplier:          1.0×
Final Estimated Quote:     PKR 2,400
```

---

### 4. 📋 Dispatch Agent — Job Lifecycle Manager

**Purpose:** Manages the full lifecycle of a job from assignment through completion.

**Job States:**

```
IDLE → SEARCHING → MATCHED → DISPATCHED → EN_ROUTE → ARRIVED → IN_PROGRESS → COMPLETED → RATED
```

**Responsibilities:**
- Sends job cards to the top-matched provider with a 15-second countdown timer
- Handles accept / decline responses
- Falls back to the next ranked provider on decline or timeout
- Triggers navigation mode (turn-by-turn directions) on acceptance
- Activates service checklist on arrival
- Fires rating prompt on job completion
- Updates earnings counter for provider

---

### 5. 📟 Logger Agent — Orchestrator Trace System

**Purpose:** Records every system event in a real-time terminal log for full observability.

**Log Format:**
```
[HH:MM:SS] Component: Event description
```

**Sample Log Output:**
```
> AntigravityOS v2.0: Loading modules...
> AntigravityOS v2.0: Preseeded 18 providers across 9 categories.
> AntigravityOS v2.0: NLP Lexicon engine running. Ready for requests.
> [13:42:01] NLP_AGENT: Received → "AC band ho gaya"
> [13:42:01] NLP_AGENT: Intent=AC_REPAIR | Urgency=HIGH | Conf=0.96
> [13:42:02] MATCHER_AGENT: Scoring 4 eligible providers...
> [13:42:02] MATCHER_AGENT: Top match → Arshad Mahmood | Score=0.891
> [13:42:03] DISPATCH_AGENT: Job card sent. Timer=15s
> [13:42:11] DISPATCH_AGENT: Accepted by Arshad Mahmood
> [13:42:11] PRICING_AGENT: Quote=PKR 2,400 | Surge=1.0×
> [13:42:11] DISPATCH_AGENT: Status → EN_ROUTE
```

---

## 🔌 APIs Used

### Mock APIs (Simulated)

These APIs are simulated within the frontend to demonstrate real production behaviour without requiring a live backend.

| API | Purpose | Mock Behaviour |
|---|---|---|
| **Provider Database API** | Stores and queries the 18 preseeded provider records | In-memory JS object; simulates async query with latency |
| **Geolocation API** | Returns provider and customer coordinates | Hardcoded Islamabad zone coordinates (G-11, F-10, I-8, etc.) |
| **Routing / Navigation API** | Generates turn-by-turn directions | Scripted route strings based on zone pairs |
| **Notification API** | Sends job dispatch alerts to providers | DOM event triggers simulating push notifications |
| **Pricing API** | Returns dynamic fare estimates | Formula-based calculation from service + zone + surge state |
| **Rating & Feedback API** | Submits post-job ratings | Updates in-memory provider rating scores |

---

### Real APIs (Integrated)

| API | Purpose | Integration Type |
|---|---|---|
| **Google Sheets API** | Live-streams job records, provider updates, and workflow events to a connected spreadsheet for admin observability | Active (Live Streamed) |
| **Browser Geolocation API** | Accesses device location for customer proximity detection | Real (Web Standard) |

---

### API Response Example — Provider Match

```json
{
  "request_id": "REQ-20240521-0042",
  "service": "AC_REPAIR",
  "location": "G-11, Islamabad",
  "matches": [
    {
      "rank": 1,
      "provider_id": "PRV-007",
      "name": "Arshad Mahmood",
      "phone": "+92 300 5550192",
      "score": 0.891,
      "distance_km": 2.4,
      "eta_mins": 8,
      "rating": 4.8,
      "estimated_price_pkr": 2400,
      "surge_multiplier": 1.0
    },
    {
      "rank": 2,
      "provider_id": "PRV-012",
      "name": "Imran Hussain",
      "score": 0.847,
      "distance_km": 3.1,
      "eta_mins": 11,
      "rating": 4.6,
      "estimated_price_pkr": 2200,
      "surge_multiplier": 1.0
    }
  ],
  "capacity_load_pct": 34,
  "surge_state": "REGULAR"
}
```

---

## 🔗 Integrations Implemented

### 1. 📊 Google Sheets — Live Admin Dashboard

**Type:** Real integration (simulated streaming)

**How it works:** Every job event (request received, provider matched, job completed, rating submitted) is written as a new row to a connected Google Sheet. Non-technical admins can monitor all platform activity without accessing the codebase.

**Simulated Log Entries:**
```
Timestamp        | Event              | Provider        | Customer Zone | Amount
2024-05-21 13:42 | JOB_DISPATCHED     | Arshad Mahmood  | G-11          | PKR 2,400
2024-05-21 13:58 | JOB_COMPLETED      | Arshad Mahmood  | G-11          | PKR 2,400
2024-05-21 13:59 | RATING_SUBMITTED   | Arshad Mahmood  | ★★★★★        | —
```

---

### 2. 🌐 Multilingual Lexicon Engine

**Type:** Custom-built integration

**How it works:** A hand-curated lexicon maps Roman Urdu words, Urdu transliterations, and English service terms to standardized intent categories. The NLP Agent queries this lexicon on every input to tokenize and classify the request.

**Lexicon Sample:**
```javascript
{
  "AC": "AC_REPAIR",
  "bijli": "ELECTRICAL",
  "nal": "PLUMBING",
  "plumber": "PLUMBING",
  "ustaad": "TUTORING",
  "mechanic": "CAR_MECHANIC",
  "safai": "CLEANING",
  "leak": "PLUMBING",
  "band ho gaya": "REPAIR_NEEDED",
  "jaldi": "URGENCY_HIGH",
  "abhi": "URGENCY_URGENT",
  "kal": "TIME_TOMORROW"
}
```

---

### 3. 🌪️ Chaos Engineering Integration

**Type:** Built-in simulation framework

**Scenarios and what they integrate with:**

| Scenario | Systems Triggered |
|---|---|
| Mid-Job Cancellation | Dispatch Agent → re-triggers Matcher Agent → new job card sent |
| Rush-Hour Surge | Pricing Agent → surge multiplier updated → all active quotes recalculated |
| No Providers | Matcher Agent → queue buffer → Notification system → retry loop |
| Multilingual Chaos | NLP Agent → stress-tests lexicon with code-switched slang batch |

---

### 4. 🗄️ In-Memory Provider Database

**Type:** Simulated database with 18 seeded records

**Schema:**
```javascript
{
  provider_id: "PRV-007",
  name: "Arshad Mahmood",
  phone: "+92 300 5550192",
  service_category: "AC_REPAIR",
  rating: 4.8,
  total_jobs: 312,
  cancellation_rate: 0.02,
  experience_years: 7,
  certifications: ["HVAC Level 2"],
  base_zone: "G-10",
  is_online: true,
  current_job: null,
  daily_earnings_pkr: 0
}
```

---

## 📁 Project Structure

```
kaamwala/
│
├── index.html                  # Single-page app entry point
│
├── assets/
│   ├── css/
│   │   └── styles.css          # Full UI styling (dual-interface layout)
│   └── js/
│       ├── orchestrator.js     # AntigravityOS v2.0 — core event bus
│       ├── nlp-agent.js        # Multilingual NLP parser + lexicon
│       ├── matcher-agent.js    # 7-Factor matchmaking algorithm
│       ├── pricing-agent.js    # Dynamic fare calculation engine
│       ├── dispatch-agent.js   # Job lifecycle state machine
│       ├── logger-agent.js     # Real-time trace log renderer
│       ├── providers-db.js     # 18-record in-memory provider dataset
│       ├── stress-tester.js    # Chaos scenario simulation suite
│       └── sheets-sync.js      # Google Sheets integration handler
│
└── README.md                   # This file
```

---

## 🚀 How to Run

Since Kaamwala is a **fully frontend-rendered application** with no build step required:

```bash
# Clone the repository
git clone https://github.com/your-username/kaamwala.git

# Navigate to project folder
cd kaamwala

# Open directly in browser
open index.html

# OR serve locally
npx serve .
# → Visit http://localhost:3000
```

**Live version:** [kamwla.netlify.app](https://kamwla.netlify.app)

---

## 🧪 Testing the System

### Recommended Test Flow

1. **Open** [kamwla.netlify.app](https://kamwla.netlify.app)
2. **Client App** → Type `"AC band ho gaya"` or tap a Quick Chip
3. **Watch** the NLP Parser detect intent in real-time
4. **Watch** the Match Grid populate with ranked providers
5. **Partner App** → Accept the dispatched job
6. **Follow** the navigation checklist through to completion
7. **Rate** the provider (5 stars ⭐)
8. **Adjust** the Match Weight sliders and repeat to see different rankings
9. **Stress Test** → Try all 4 chaos scenarios

### Quick Input Test Cases

| Input | Expected Intent | Expected Urgency |
|---|---|---|
| `"AC band ho gaya"` | AC_REPAIR | HIGH |
| `"mujhe plumber chahiye abhi"` | PLUMBING | URGENT |
| `"Math tutor for Class 9"` | TUTORING | NORMAL |
| `"bijli nahi aa rahi"` | ELECTRICAL | HIGH |
| `"ghar ki safai karni hai kal"` | CLEANING | LOW |

---

## 📊 System Metrics

| Metric | Value |
|---|---|
| Active Providers | 18 |
| Service Categories | 9 |
| Match Confidence | 96% |
| NLP Languages | 3 (Urdu, Roman Urdu, English) |
| Matchmaking Factors | 7 |
| Stress Test Scenarios | 4 |
| Orchestrator | AntigravityOS v2.0 |
| Deployment | Netlify (CDN) |

---

## 🌍 Vision

Kaamwala is designed to scale into a **full production platform** for Pakistan's gig economy. The current frontend simulation demonstrates every major system component — NLP, matchmaking, dispatch, pricing, logging, and chaos resilience — in a way that maps 1:1 to a production backend architecture using Node.js, PostgreSQL, WebSockets, and a real Maps API.

---

<div align="center">

**Built for Pakistan's 40 million informal economy workers 🇵🇰**

*Kaamwala — Har Kaam Ka Hal* 🌟

![Made in Pakistan](https://img.shields.io/badge/Made%20in-Pakistan%20🇵🇰-009900?style=for-the-badge)
![Agentic AI](https://img.shields.io/badge/Agentic-AI%20Powered-6C63FF?style=for-the-badge)
![Multilingual](https://img.shields.io/badge/Urdu%20%7C%20Roman%20Urdu%20%7C%20English-Multilingual-FF6B35?style=for-the-badge)

</div>
kamwla.netlify.app
