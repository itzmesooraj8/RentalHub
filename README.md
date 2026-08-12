# RentalHub — AI-Powered Equipment Rental Intelligence Platform

[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![JavaScript ESM](https://img.shields.io/badge/JavaScript-ES_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Express.js](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Flash_2.5-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

> *"Equipment rental is not simply a marketplace problem — it is a real-time trust, availability, and asset-utilization problem."*

**RentalHub** is an end-to-end **AI-Powered Equipment Rental Intelligence Platform** powered by **MongoDB Atlas**. It transforms fragmented physical equipment rentals into an intelligent, data-driven transaction network across **Construction & Heavy Machinery, Agriculture, Film & Optics, Event Production, Logistics, and Industrial Manufacturing**.

---

## 📋 Table of Contents
1. [Strategic Positioning & Problem Statement](#1-strategic-positioning--problem-statement)
2. [The 4 Core Equipment Rental Challenges](#2-the-4-core-equipment-rental-challenges)
3. [MongoDB Atlas: 5 Core Architectural Innovations](#3-mongodb-atlas-5-core-architectural-innovations)
4. [Full Rental Lifecycle & Intelligence Workflow](#4-full-rental-lifecycle--intelligence-workflow)
5. [The 6 Live "WOW" Demo Moments](#5-the-6-live-wow-demo-moments)
6. [Technology Stack](#6-technology-stack)
7. [Setup & Installation Instructions](#7-setup--installation-instructions)
8. [REST API Documentation](#8-rest-api-documentation)
9. [Security & Application Controls](#9-security--application-controls)

---

## 1. Strategic Positioning & Problem Statement

Traditional equipment marketplaces act as passive bulletin boards. RentalHub elevates equipment rental from a basic listing platform to a **Real-Time Rental Intelligence Engine**:

```text
Discover ➔ Verify ➔ Assess Risk ➔ Reserve ➔ Inspect ➔ Rent ➔ Return ➔ Learn
```

Instead of relying on keyword matching and static listings, **MongoDB Atlas** serves as the central operational intelligence layer executing semantic vector search, geospatial proximity calculation, atomic day-slot concurrency locking, structured AI vision inspections, and fleet yield analytics in real time.

---

## 2. The 4 Core Equipment Rental Challenges

RentalHub addresses the four interconnected challenges facing contractors and commercial fleet owners:

1. **① "Can I find the right machine?" (Semantic AI Discovery)**:
   - Keyword searches fail when equipment descriptions vary. RentalHub uses **MongoDB Atlas Vector Search (`$vectorSearch`)** to understand contractor intent (e.g. *"heavy machine for soil excavation near Coimbatore"*) and return semantically matching equipment regardless of exact phrasing.

2. **② "Is it actually available?" (Atomic Concurrency Locking)**:
   - Prevents double-booking conflicts when two users simultaneously attempt to reserve the same machine for overlapping dates. A compound unique MongoDB index (`{ equipmentId: 1, date: 1 }`) guarantees atomic slot allocation at the database level.

3. **③ "Can I trust this equipment and renter?" (Explainable AI Risk & Vision Inspection)**:
   - Combines historical renter trust, owner reliability, and transaction anomalies into an explainable **AI Rental Risk Score (0–100)**, coupled with **Gemini 2.5 Flash multimodal vision analysis** for automated pre-dispatch structural inspection reports.

4. **④ "How do I maximize my equipment's utilization?" (Fleet Yield Intelligence)**:
   - Transforms raw rental activity into actionable intelligence for owners — computing gross revenue, idle cost estimates, utilization percentages, and AI dynamic pricing recommendations.

---

## 3. MongoDB Atlas: 5 Core Architectural Innovations

MongoDB is not merely storing RentalHub's data — **MongoDB executes the intelligence of the platform**:

```text
                     MONGODB ATLAS
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
   Vector               Geo               Transactions
   Search               Search             & Locking
 (`$vectorSearch`)   (`2dsphere`)    (`{equipmentId:1, date:1}`)
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                      Aggregation
                    (`$group`, `$dateToString`)
                           │
                  ┌────────┴────────┐
                  │                 │
              Risk Engine       Analytics
                  │                 │
                  └────────┬────────┘
                           │
                     Change Streams
                           │
                      Real-Time UI
```

1. **Atlas Vector Search (`$vectorSearch`) & Hybrid Discovery**:
   - Executes vector similarity searches over 1536-dimensional embeddings combined with geospatial `$near` distance filters and date availability constraints.
2. **Geospatial Proximity Search (`2dsphere` / `$near`)**:
   - Native GeoJSON Point indexing (`[lng, lat]`) calculating exact kilometer distances between job sites and equipment yards.
3. **Atomic Day-Slot Concurrency Protection**:
   - Compound unique indexing (`{ equipmentId: 1, date: 1 }`) operating inside MongoDB Mongoose transactions, guaranteeing zero double-bookings under concurrent load.
4. **Date-Grouped Aggregation Pipelines (`$group` / `$dateToString`)**:
   - Computes month-by-month financial yield, daily utilization, idle cost estimates, and CO2 offset metrics directly in MongoDB.
5. **Real-Time Change Streams & Push Events**:
   - Server-Sent Events (SSE) push stream connected directly to MongoDB Atlas Change Streams, broadcasting live availability updates across active user sessions.

---

## 4. Full Rental Lifecycle & Intelligence Workflow

```text
                 ┌─────────────────────────┐
                 │       CUSTOMER          │
                 │ "Need excavator nearby  │
                 │  for 5 days under ₹X"   │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │     AI DISCOVERY        │
                 │ MongoDB Vector Search   │
                 │ + Geospatial Search     │
                 │ + Availability          │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │      TRUST ENGINE       │
                 │ Reviews + Risk Score    │
                 │ Owner Reliability       │
                 │ Equipment History       │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │   ATOMIC BOOKING ENGINE │
                 │ MongoDB Transactions    │
                 │ Day-slot Locking        │
                 │ Double-book prevention  │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │   AI PRE-DISPATCH       │
                 │    INSPECTION           │
                 │ Gemini Vision Analysis  │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │    RENTAL LIFECYCLE     │
                 │ Pickup → Active → Return│
                 │ → Review → Dispute      │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │    OWNER INTELLIGENCE   │
                 │ Revenue • Utilization   │
                 │ Pricing • Demand        │
                 └────────────┬────────────┘
```

---

## 5. The 6 Live "WOW" Demo Moments

1. **WOW #1 — Hybrid Equipment Discovery**:
   - Renter types natural language requirements: *"heavy excavator for soil digging near Coimbatore"*. The hybrid discovery engine evaluates semantic relevance (`$vectorSearch`), distance in km (`2dsphere`), live date slots, and trust ratings simultaneously.
2. **WOW #2 — Native MongoDB Atlas Pipeline Execution**:
   - Live query resolution against Atlas vector indexes, geospatial `$near` distance filters, and date-grouped `$group` aggregation pipelines.
3. **WOW #3 — Double-Booking Conflict Prevention**:
   - Automated integration test (`npm run test` - Test 5) executes simultaneous `Promise.all` booking requests for the exact same asset and dates. The first request succeeds while the second is atomically rejected by MongoDB's unique index.
4. **WOW #4 — Gemini 2.5 Flash Pre-Dispatch Vision Inspection**:
   - Upload equipment images to generate a structured AI audit report (**Structural Condition**, **Damage Assessment**, **Dispatch Approval Recommendation**).
5. **WOW #5 — AI Rental Risk Score Engine**:
   - Calculates an explainable **0–100 Risk Score** (Renter Trust, Owner Reliability, Equipment Dispute History, Duration Anomaly) prior to confirmation.
6. **WOW #6 — Owner Fleet Intelligence & Dynamic Pricing**:
   - Fleet analytics workspace rendering real-time gross transaction volume (GMV), net platform fees, utilization percentages, idle costs, and AI-recommended rates.

---

## 6. Technology Stack

- **Backend Runtime**: Node.js & Express.js 4.21 (Pure JavaScript ES Modules)
- **Database Engine**: MongoDB Atlas Cluster via Mongoose ODM 8.13
- **Frontend Architecture**: React 19 SPA & JavaScript / JSX
- **Build Tooling**: Vite 6.2 & esbuild
- **Styling & UI Components**: TailwindCSS v4 & Lucide Icons
- **AI / Multimodal Engine**: `@google/genai` (Gemini 2.5 Flash SDK)
- **Security & Middleware**: `bcryptjs`, `jsonwebtoken` (JWT), `helmet`, `express-rate-limit`, `zod` schema validation

---

## 7. Setup & Installation Instructions

### Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB Atlas Cluster**: Connection string with index privileges

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/itzmesooraj8/RentalHub.git
cd RentalHub
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/rentalhub?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Seed MongoDB Atlas Cluster
```bash
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 5. Execute 15-Step Integration Test Suite
```bash
npm run test
```

### 6. Execute Production Build
```bash
npm run build
```

---

## 8. REST API Documentation

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account with bcrypt password hashing | No |
| `POST` | `/api/auth/login` | Authenticate user credentials & issue signed JWT | No |
| `GET` | `/api/equipment` | Query equipment with category, price, and geospatial filters | No |
| `POST` | `/api/equipment` | Create new owner equipment listing | Yes |
| `POST` | `/api/bookings` | Create atomic date-slot locked booking reservation | Yes |
| `POST` | `/api/ai/smart-search` | Multi-stage Hybrid AI Vector + Geospatial Discovery | No |
| `POST` | `/api/ai/booking-risk-score` | AI Rental Risk Score evaluation engine | Yes |
| `POST` | `/api/ai/pre-dispatch-inspection` | Gemini 2.5 Flash pre-dispatch structural inspection | Yes |
| `GET` | `/api/analytics/owner/:ownerId` | MongoDB aggregated fleet yield & utilization analytics | Yes (Owner/Admin) |
| `GET` | `/api/analytics/admin` | MongoDB aggregated gross transaction volume (GMV) & platform fees | Yes |
| `GET` | `/api/admin/audit-logs` | Retrieve platform security audit trail | Yes (Admin) |

---

## 9. Security & Application Controls

- **Authentication & RBAC**: Signed JWT tokens with embedded role claims (`customer`, `owner`, `admin`) enforced via authorization middleware (`server/middleware/auth.js`).
- **Object-Level Authorization (IDOR Protection)**: Verifies asset ownership prior to modifications or deletions.
- **Input Validation**: Schema validation using `zod` (`registerSchema`, `loginSchema`, `equipmentSchema`, `bookingSchema`).
- **Network Protection**: `helmet` security headers and `express-rate-limit` (200 requests per 15-min window).
- **Immutable Audit Trail**: Security-sensitive operations logged to `AuditLogModel` for compliance auditability.
