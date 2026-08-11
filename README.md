# RentalHub — Equipment Rental Platform

[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Flash_3.6-8E75B2?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

**RentalHub** is a universal, peer-to-peer equipment rental platform that connects customer renters with equipment owners and commercial rental businesses across **Construction, Agriculture, Film & Media, Event & Audio, Logistics, and Manufacturing**.

The platform eliminates double-booking conflicts and spreadsheet overhead through a centralized **MongoDB Atlas transaction engine**, `2dsphere` geospatial discovery, native MongoDB aggregation pipelines, and Gemini AI intent search.

---

## 🏗️ Technical Architecture Diagram

```mermaid
graph TD
    Client["React 19 SPA Frontend (TailwindCSS, Lucide)"]
    API["Express.js API Layer (TypeScript, Helmet, Zod, Rate Limiter)"]
    Auth["JWT Authentication & Bcrypt Password Hashing"]
    Engine["Atomic Booking Transaction Engine"]
    Geo["Geospatial Engine ($near 2dsphere)"]
    Agg["MongoDB Aggregation Pipelines"]
    Gemini["Gemini AI (Intent Search & Dynamic Pricing)"]
    Atlas[("MongoDB Atlas Database Cluster")]

    Client -->|REST API / Bearer JWT| API
    API --> Auth
    API --> Engine
    API --> Geo
    API --> Agg
    API --> Gemini
    Engine -->|session.withTransaction()| Atlas
    Geo -->|2dsphere index| Atlas
    Agg -->|$match / $group| Atlas
```

---

## 🌟 Core Problem Statement Alignment

| Problem Requirement | Solution Implemented | Technical Evidence |
| :--- | :--- | :--- |
| **Comprehensive Digital Lifecycle** | End-to-end digital touchpoints from search, geospatial discovery, booking, pickup, to condition verification & return tracking. | `BookingDetailsPage.tsx` state machine transitions |
| **Structured User Roles** | Three-tier management: **Customers** (search, book, track), **Owners** (equipment CRUD, dynamic pricing, utilization analytics), and **Admins** (governance, disputes, audit log). | Express `requireRole('customer', 'owner', 'admin')` middleware |
| **Centralized Availability Engine** | Real-time availability locking preventing scheduling overlaps. | Mongoose `session.withTransaction()` atomic date overlap validation |
| **Business Analytics & Insights** | Actionable yield metrics, gross transaction volume (GMV), platform fee earnings, and CO2 offset metrics. | Native MongoDB Aggregation Pipelines (`$match`, `$group`) |

---

## 🛡️ Security & Protection Framework

RentalHub enforces enterprise-grade security across all backend services:

1. **Password Protection**: User passwords are encrypted with `bcrypt` (10 salt rounds) and verified on `POST /api/auth/login`.
2. **JWT Session Tokens**: Signed JSON Web Tokens with 7-day expiration pass authenticated identity claims.
3. **Role-Based Access Control (RBAC)**: Express `requireRole` middleware prevents unauthorized access to owner/admin endpoints.
4. **Security Headers**: `helmet` shields Express against HTTP header vulnerability exploits.
5. **Rate Limiting**: `express-rate-limit` enforces a 200 request / 15 minute cap per IP address.
6. **Request Payload Validation**: `zod` schemas validate incoming request data for registration, login, equipment creation, and booking creation.
7. **No Fallback Credentials**: Fail-fast server boot if `MONGODB_URI` or `JWT_SECRET` is missing.

---

## ⚡ Real-Time & MongoDB Atlas Capabilities

### 1. Atomic Double-Booking Prevention (Transactions)
When a customer submits a booking, `db.createBooking` runs inside a Mongoose `session.withTransaction()`. The transaction re-evaluates date overlaps (`startDate < requestedEnd AND endDate > requestedStart`) inside the lock context, atomically inserting the reservation, availability block, audit record, and notification. Under concurrent requests, exactly one reservation succeeds while the second receives an explicit `BOOKING_CONFLICT` rejection.

### 2. Geospatial Discovery (`2dsphere` Index)
`GET /api/equipment/nearby` executes `$near` spatial queries on `EquipmentModel` using `GeoJSON Point [longitude, latitude]` coordinates within user-defined kilometer radii.

### 3. Native MongoDB Aggregation Pipelines
- **Owner Yield Analytics**: `$match: { ownerId, status: { $ne: 'cancelled' } }` → `$group: { _id: null, totalRevenue: { $sum: '$priceBreakdown.total' }, totalBookingsCount: { $sum: 1 }, totalRentalDays: { $sum: '$priceBreakdown.rentalDays' } }`.
- **Admin Ecosystem GMV**: `$match: { status: { $ne: 'cancelled' } }` → `$group: { _id: null, totalGmv: { $sum: '$priceBreakdown.total' }, platformRevenue: { $sum: '$priceBreakdown.platformFee' } }`.

### 4. Push-Based Server-Sent Events (SSE)
`GET /api/events` streams real-time Server-Sent Events (SSE) to connected frontend clients when booking transactions commit or asset availability changes.

---

## 🧠 AI / GenAI Integration

- **Natural Language Intent Search (`POST /api/ai/smart-search`)**: Converts complex natural language requests ("I need an excavator near Austin for 3 days") into structured JSON filters (`category`, `location`, `lat`, `lng`, `radiusKm`), which execute against MongoDB Atlas 2dsphere and text indices.
- **Explainable Dynamic Pricing (`POST /api/ai/recommend-pricing`)**: Evaluates real MongoDB rental history (recent bookings count, area benchmarks, current daily rate). If fewer than 1 booking exists, it outputs `"Insufficient data for recommendation"`, preventing fabricated advice.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Connection URI (`MONGODB_URI`)

### 1. Environment Setup
Copy `.env.example` to `.env` and fill in your configuration:
```env
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/rentalhub?retryWrites=true&w=majority"
JWT_SECRET="rentalhub_super_secret_jwt_key_2026"
APP_URL="http://localhost:3000"
```

### 2. Installation
```bash
npm install
```

### 3. Seed MongoDB Atlas Cluster
```bash
npm run seed
```

### 4. Execute Integration & Conflict Test Suite
```bash
npm run test
```

### 5. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🎤 Pitch Defense & Technical QA Guidelines

- **Why Mongoose over raw MongoDB driver?**
  *Mongoose provides strict document schema validation, typed model hooks, built-in 2dsphere geospatial index management, and transaction session helpers (`session.withTransaction()`).*
- **Why `2dsphere` geospatial indexing?**
  *Physical equipment rentals are constrained by transport distance. `2dsphere` spatial indexing enables high-precision spherical distance calculation on Earth's surface via `$near` queries.*
- **How does the AI pricing model function?**
  *The pricing model analyzes real historical booking counts from MongoDB, local market benchmarks, and utilization rates. It operates in an owner-controlled advisory mode.*
