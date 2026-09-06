# 🌍 Wanderlist - Premium Full-Stack Travel Booking Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=3395FF" />
</p>

## 📌 Overview
Wanderlist is a production-ready, full-stack travel reservation platform designed with premium aesthetics and a highly robust backend architecture. It features secure JWT-based authentication, real-time slot booking with concurrency management, and an end-to-end payment & auto-refund system powered by Razorpay.

## 🚀 Key Architectural Features (Recruiter Highlights)

* **Concurrency & Slot Reservation Lock:** Engineered a zero-collision booking system using deterministic `activeSlotKey` logic inside isolated Prisma transactions. Abandoned checkouts are tracked and swept automatically using a lifecycle manager (Node server intervals) to gracefully free up slots.
* **Idempotent Payment Engine:** Hardened the Razorpay integration against double-spending and network races. Reacts securely to webhook callbacks (`payment.captured`, `refund.processed`) with strict HMAC SHA256 signature verification. 
* **Automated Refund Policy:** Built a smart cancellation engine that calculates travel window distances programmatically. Instantly initiates 100% Refunds for eligible cancellations (48+ hours prior) directly through Razorpay API logic.
* **Dynamic Client-Side Experience:** Utilizes Zustand for global state management, Framer Motion for premium staggered UI reveals, and `react-hot-toast` for frictionless user feedback. Native Light/Dark mode enabled globally.

## 💻 Tech Stack

| Tier | Technology |
|---|---|
| **Frontend UI/UX** | React, Vite, Tailwind CSS, Framer Motion, Lucide React, Hot-Toast |
| **State & Data** | Zustand (Global State), React Hook Form, Zod, Axios |
| **Backend & Routing**| Node.js, Express.js, Cookie-Parser, CORS |
| **Database & ORM** | Neon.tech (Serverless PostgreSQL), Prisma ORM |
| **Security & Payments**| JWT (HTTP-Only Auth), Razorpay Payment Gateway, HMAC Validation |

## 🛠️ Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/kasimshah19/travel-booking-ui.git
cd travel-booking-ui
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

### 3. Backend Setup
```bash
cd server
npm install
```

### 4. Environment Variables (`server/.env`)
Create an `.env` file in the `/server` directory and configure the following:
```env
# Database Configuration
DATABASE_URL="postgresql://user:password@hostname/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@hostname/dbname?sslmode=require"

# JWT Secret
JWT_SECRET="your_highly_secure_jwt_secret"

# Razorpay Test Credentials
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET="your_custom_webhook_secret"
```

### 5. Finalize Database & Start
```bash
# Push schema and seed initial destination logic
npx prisma db push
node prisma/seed.js

# Start backend server
node index.js
```

## 📸 Core Flows
1. **Authentication:** Secure sign-up/login generating HTTP-Only JWT tokens inside interceptors.
2. **Booking Engine:** User selects destination, travel dates, and time slot. Backend strictly prevents past-date bookings and handles multi-slot locks simultaneously.
3. **Payment & Webhooks:** Complete payment flow via Razorpay popup. Async webhook listeners atomically commit Confirmed routes to the database upon capture.
4. **My Bookings Dashboard:** Clean historic and upcoming grouped UI tabs. Supports 1-click active cancellation and instant timeline updates.

---
*Architected and developed by Kasim Shah.*
