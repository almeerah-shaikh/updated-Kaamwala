# Kaamwala — Agentic AI Service Discovery & Orchestrator

**Kaamwala** is a premium, high-fidelity Single Page Application (SPA) designed to orchestrate the informal economy using an intelligent agentic engine. The platform bridges the gap between local service providers (plumbers, electricians, tutors, mechanics, house cleaners, etc.) and customers through unstructured, multilingual conversation, multi-factor matching algorithms, and active stress testing control dashboards.

---

## 🚀 Architectural Architecture Overview

The system runs completely client-side to facilitate instantaneous, zero-overhead demonstrations while simulating high-performance AI engines, database structures, spreadsheet integrations, and SMS dispatch queues.

```
+---------------------------------------------------------------------------------+
|                                 KAAMWALA APP                                    |
+------------------------------+--------------------+-----------------------------+
|    CUSTOMER APP SIMULATOR    |  PROVIDER APP SIM  |   ANTIGRAVITY ENGINE HUD    |
+------------------------------+--------------------+-----------------------------+
| * WhatsApp-style Chat UI     | * Radar Waiting    | * Weight Tuning Sliders     |
| * Roman-Urdu / English NLP   | * Bid Alert (15s)  | * 7-Factor Match Board Grid |
| * Itemized Quotes Receipts   | * Journey Tracker  | * Dynamic Pricing Receipt   |
| * Live Map GPS Trajectories  | * Service Checklist| * Real-time Terminal Trace  |
| * Stars Rating Reviews Forms | * Earnings Ledger  | * Stress Testing Chaos board|
+------------------------------+--------------------+-----------------------------+
```

---

## 🛠️ Key Engine Capabilities

### 1. Multilingual Roman-Urdu NLP Parser
Noisy, conversational language is normalized into standardized service requests. The engine uses regex token lexicons to extract intent, sectoral locations, and urgency levels from Urdu, Roman Urdu (*e.g., "AC thanda nahi kar raha jaldi kisi ko bheinjo"*), or standard English inputs:
- **Detected Intent**: Resolves to one of **9 service professions** (AC Repair, Plumber, Tutor, Electrician, House Cleaning, Car Mechanic, Beautician, Driver, Carpenter/Painter).
- **Location Extraction**: Automatically scans for Islamabad sectors (G-11, G-13, F-11, F-10, I-8, E-11, G-10).
- **Urgency Levels**: Flags high priority if urgency words (*jaldi, emergency, fauran, abhi*) are injected, triggering immediate surge multipliers.

### 2. 7-Factor Matching Optimization
Candidate providers are evaluated using dynamic weights adjustable in real-time on the control panel:
$$\text{Score} = W_d \cdot S_d + W_s \cdot S_s + W_r \cdot S_r + W_p \cdot S_p + W_c \cdot S_c + W_a \cdot S_a + W_e \cdot S_e$$
- $S_d$ **(Distance)**: Exponential decay computed via Euclidean coordinates ($1 / (1 + \text{distance})$).
- $S_s$ **(Skill Specialization)**: Checks exact query match against detailed provider sub-skills.
- $S_r$ **(On-Time Reliability)**: Historical provider timeliness rates.
- $S_p$ **(Price Compatibility)**: Compares base rate to sector-wide averages.
- $S_c$ **(Cancellation Rate)**: Evaluates structural drop rates ($1.0 - \text{CancelRate}$).
- $S_a$ **(Average Rating)**: Normalized 5-star customer review score.
- $S_e$ **(Experience & Certifications)**: Factors years of experience and formal training certs.

### 3. Dynamic Pricing Model
Prices are dynamically computed with fully itemized breakdowns:
$$\text{Final Quote} = \text{BaseRate} + \text{TravelBuffer} + \text{UrgencyCharge} - \text{LoyaltyDiscount}$$
- **Travel Buffer**: PKR 50 per kilometer of sector separation.
- **Surge Multipliers**: 1.3x for customer urgency, or a **3.0x peak hour surge** under chaos simulation.
- **Loyalty Rebate**: Standard flat PKR 200 discount for frequent customers.

### 4. Interactive Stress Testing & Chaos Control
The dashboard exposes real-world failure scenarios to demonstrate system resiliency:
- **🌪️ Mid-Job Provider Cancellation**: Triggers a sudden cancellation mid-trip, issuing an warning notification, blacklisting the provider, and firing an **autonomous re-matching algorithm** to pick the next best candidate without requiring customer re-input.
- **⚡ Peak Rush-Hour Congestion**: Triples fares city-wide, spikes sector loads to 94%, and changes capacity gauges to critical danger.
- **❌ No Suitable Providers**: Artificially locks all providers as busy, validating the waitlist buffer and visual retry notifications.
- **🗣️ Multilingual Chaos Injector**: Automatically inputs highly code-switched slang query strings into the client terminal.

---

## 📁 Preseeded Database Structure (18 Detailed Records)

The app comes preseeded with exactly 18 highly realistic informal economy providers, each maintaining extensive records such as:
- DAE HVAC certifications, L'Oreal professional degrees, HTV luxury driving licenses.
- Detailed coordinates inside Islamabad sectors.
- Real-time cumulative ledger earnings tracker.

---

## 🏃 Quick Start Guide

Since Kaamwala is built as a pure HTML5/CSS3/ES6 Single Page Application, running it is extremely simple:

1. Locate the workspace folder:  
   `C:\Users\shaik\OneDrive\Documents\file1\Kaamwala`
2. Double-click or open **`index.html`** in any modern web browser (Chrome, Edge, Firefox, or Safari).
3. Select a **Quick Action Chip** on the Customer Phone (Left) or type a request in Roman Urdu (e.g., *"Plumber leak ho rha hai jaldi bheinjo yaar"*).
4. Watch the Antigravity Orchestrator (Right) execute matching logic, and control the Partner Phone (Middle) to accept, drive, and complete the checklist task!
---

## 🔐 Auth Test Instructions

If you want to verify the backend auth flow end-to-end:

```bash
cd "C:\Users\shaik\OneDrive\Documents\file1\Kaamwala"
npm install
cmd /c "npm start"
cmd /c "node scripts/test-auth.js"
```

The test script will sign up a new user, log in, and create a booking using the returned JWT token.
