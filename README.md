# RentalHub — AI-Powered Universal Equipment Rental Platform

[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Flash_2.5-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

**RentalHub** is an AI-powered, peer-to-peer equipment rental transaction marketplace and operational management system. It connects customer renters with equipment owners and commercial rental businesses across **Construction & Heavy Machinery, Agriculture, Film & Optics, Event Production, Logistics, and Industrial Manufacturing**.

---

## 📋 Table of Contents
1. [Problem Statement](#1-problem-statement)
2. [Key Platform Features](#2-key-platform-features)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture & Workflow](#4-system-architecture--workflow)
5. [Setup & Installation Instructions](#5-setup--installation-instructions)
6. [Environment Variables Configuration](#6-environment-variables-configuration)
7. [REST API Endpoint Documentation](#7-rest-api-endpoint-documentation)
8. [MongoDB Database Schema & Indexing](#8-mongodb-database-schema--indexing)
9. [Security & Performance Optimization](#9-security--performance-optimization)
10. [Future Architectural Roadmap](#10-future-architectural-roadmap)

---

## 1. Problem Statement

Equipment rental industries suffer from scheduling friction, double-booking conflicts, manual spreadsheet tracking, and fragmented trust verification. RentalHub solves these challenges through:
- **Centralized Atomic Availability Engine**: A database-level date-slot reservation lock context (`{ equipmentId: 1, date: 1 }`) operating inside MongoDB Mongoose `session.withTransaction()`, preventing double-booking under high concurrency.
- **Full Digital Touchpoint Lifecycle**: Managing equipment discovery, live availability, instant booking, pickup condition verification, active rental tracking, return inspection, and automated revenue pipeline settlement.
- **Structured Multi-Role Governance**: Role-based access control (RBAC) separating **Customers** (renters), **Owners** (fleet operators), and **Admins** (platform moderators).

---

## 2. Key Platform Features

### 👤 Customer Persona
- **Smart Natural Language Search**: Gemini AI natural language search interpreting intent, location, and equipment requirements.
- **Geospatial Proximity Filtering**: Find equipment within specified kilometer radii using MongoDB `2dsphere` `$near` spatial queries.
- **Live Availability Calendar**: Real-time calendar querying MongoDB Atlas `AvailabilityBlockModel` daily date slots.
- **Equipment Comparison Workspace (`/compare`)**: Compare up to 4 assets side-by-side (daily rate, deposit, trust score, specs) with dynamic "Best Value" identification.

### 🚜 Owner Persona
- **Fleet Management & Inventory CRUD**: Create, edit, list, and unlist equipment with specs, pricing, and location coordinates.
- **AI Dynamic Pricing Assistant**: Gemini AI market analytics offering yield and rate recommendations based on demand trends.
- **Real-Time Yield Analytics**: Native MongoDB Aggregation Pipelines (`$match`, `$group`) calculating gross revenue, utilization percentage, and CO2 offset metrics.

### 🛡️ Admin Persona
- **User Governance & Role Management**: View, promote/demote roles, and approve KYC verification documents live in MongoDB `UserModel`.
- **Equipment Approval Moderation**: Approve or reject owner equipment listings live in MongoDB `EquipmentModel`.
- **Taxonomy Management**: Full category and industry CRUD stored directly in MongoDB `CategoryModel`.
- **Dispute Resolution & Audit Timeline**: Oversee rental disputes and inspect platform audit logs.

---

## 3. Technology Stack

- **Backend Runtime**: Node.js v22.x & Express.js 4.21
- **Database Engine**: MongoDB Atlas Cluster via Mongoose ODM 8.13
- **Frontend Architecture**: React 19 SPA SPA & TypeScript 5.8
- **Styling & UI Components**: TailwindCSS v4, Lucide Icons & Motion Animations
- **AI / GenAI Engine**: `@google/genai` (Gemini 2.5 Flash SDK)
- **Security & Validation**: `bcryptjs` (Password Hashing), `jsonwebtoken` (JWT), `helmet` (Security Headers), `express-rate-limit` (Rate Limiting), `zod` (Input Validation)

---

## 4. System Architecture & Workflow

```mermaid
graph TD
    Client["React 19 SPA Frontend (TailwindCSS, Lucide)"]
    API["Express.js API Layer (TypeScript, Helmet, Zod, Rate Limiter)"]
    Auth["JWT Auth & Bcrypt Password Hashing"]
    Engine["Atomic Day-Slot Concurrency Engine"]
    Geo["Geospatial Engine ($near 2dsphere)"]
    Agg["MongoDB Aggregation Pipelines"]
    Gemini["Gemini AI (Smart Search & Pricing)"]
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

## 5. Setup & Installation Instructions

### Prerequisites
- Node.js v18.0 or higher
- MongoDB Atlas Cluster connection URI or local MongoDB v6.0+ instance

### Step 1: Clone Repository & Install Dependencies
```bash
git clone https://github.com/itzmesooraj8/RentalHub.git
cd RentalHub
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/rentalhub?retryWrites=true&w=majority
JWT_SECRET=rentalhub_super_secret_jwt_key_2026
GEMINI_API_KEY=your_gemini_api_key_here
ALLOW_DEMO_LOGIN=true
```

### Step 3: Seed Initial MongoDB Atlas Data
```bash
npm run seed
```

### Step 4: Run Development Server (Integrated Express + Vite)
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your browser.

---

## 6. Environment Variables Configuration

| Variable Name | Required | Default Value | Description |
| :--- | :---: | :--- | :--- |
| `PORT` | Optional | `3000` | Port for Express server and Vite development proxy |
| `MONGODB_URI` | **Required** | None | MongoDB Atlas connection string |
| `JWT_SECRET` | **Required** | `rentalhub_jwt_secret` | Secret key used for signing JWT tokens |
| `GEMINI_API_KEY` | Optional | None | Google Gemini API key for AI Smart Search and Pricing |
| `ALLOW_DEMO_LOGIN` | Optional | `true` | Enables single-click demo persona logins for evaluation |

---

## 7. REST API Endpoint Documentation

### Authentication & Governance
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer or owner (Sanitizes role) |
| `POST` | `/api/auth/login` | Public | Authenticate with email & password (Bcrypt verified) |
| `GET` | `/api/auth/me` | JWT | Get current authenticated user profile |
| `POST` | `/api/auth/kyc` | JWT | Submit KYC identification document |

### Equipment & Catalog
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/equipment` | Public | Search equipment with filters, date range & pagination |
| `GET` | `/api/equipment/nearby` | Public | Geospatial `$near` 2dsphere radius search |
| `GET` | `/api/equipment/:id/availability` | Public | Get monthly blocked date slots from MongoDB |
| `POST` | `/api/equipment` | Owner/Admin | Create new equipment listing |
| `PUT` | `/api/equipment/:id` | Owner/Admin | Update equipment listing (Owner IDOR protected) |
| `DELETE` | `/api/equipment/:id` | Owner/Admin | Delete equipment listing (Owner IDOR protected) |

### Bookings & Availability Engine
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/bookings` | JWT | List user bookings (Role scoped) |
| `POST` | `/api/bookings` | Customer | Create booking inside Mongoose transaction |
| `PATCH` | `/api/bookings/:id/status` | JWT | Update booking status (Actor RBAC matrix enforced) |
| `POST` | `/api/bookings/:id/condition` | JWT | Submit pickup/return condition or damage report |

### Admin & Analytics
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/admin/users` | Admin | List all users from MongoDB |
| `PATCH` | `/api/admin/users/:id/role` | Admin | Update user role |
| `PATCH` | `/api/admin/users/:id/kyc` | Admin | Approve/reject user KYC |
| `GET` | `/api/admin/categories` | Public | Get equipment categories from MongoDB |
| `POST` | `/api/admin/categories` | Admin | Create category in MongoDB |
| `DELETE` | `/api/admin/categories/:id` | Admin | Delete category in MongoDB |
| `PATCH` | `/api/admin/equipment/:id/approve` | Admin | Approve/reject equipment listing |

---

## 8. MongoDB Database Schema & Indexing

RentalHub utilizes 9 operational collections in MongoDB Atlas:

```text
rentalhub Database
├── users (Unique index: { email: 1 })
├── equipment (Indexes: 2dsphere on locationCoordinates, { category: 1, dailyRate: 1 }, { ownerId: 1 })
├── categories (Unique index: { id: 1 })
├── bookings (Indexes: { customerId: 1 }, { ownerId: 1 }, { status: 1 })
├── availabilityblocks (Compound Unique Index: { equipmentId: 1, date: 1 })
├── reviews (Indexes: { equipmentId: 1 })
├── disputes (Indexes: { status: 1 })
├── notifications (Indexes: { userId: 1 })
└── auditlogs (Indexes: { actorId: 1 }, { timestamp: -1 })
```

---

## 9. Security & Performance Optimization

- **Password Hashing**: `bcryptjs` with 10 salt rounds used for all user passwords.
- **JWT Authorization**: 7-day signed JWT tokens carrying user identity claims.
- **Input Validation**: `zod` schema validation middleware on registration, login, equipment creation, and booking creation.
- **Security Hardening**: `helmet` security HTTP headers and `express-rate-limit` capping requests at 200 per 15-minute window per IP.
- **IDOR Protection**: Object-level authorization enforcing `ownerId === req.user.id` on equipment CRUD and booking state transitions.
- **Atomic Concurrency**: Compound unique index `{ equipmentId: 1, date: 1 }` preventing double-booking race conditions during simultaneous checkout requests.

---

## 10. Future Architectural Roadmap

- **Integration of Real Stripe Payment Gateway**: Transitioning simulated authorization holds to live Stripe PaymentIntents.
- **IoT Telemetry GPS Tracking**: In-fleet GPS tracking for active heavy machinery equipment.
- **Automated AI Damage Inspection**: Machine vision models analyzing pickup vs return inspection photographs.
