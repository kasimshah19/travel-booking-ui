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

## 🌐 Live Deployments
The application is fully configured and deployed across scalable cloud environments.

| Architecture Tier | Provider | Live URL | Description |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | Vercel | [travel-booking-ui-one.vercel.app](https://travel-booking-ui-one.vercel.app/) | React (Vite) client providing a premium, interactive user experience and state management. |
| **Backend API** | Render | [travel-booking-ui.onrender.com](https://travel-booking-ui.onrender.com/) | Node.js/Express server handling core business logic, webhooks, and temporal expiry crons. |
| **Database** | Neon.tech | *Secured* | Serverless PostgreSQL database utilized for relation modeling and Prisma ORM connection pooling. |

---

## � Team & Contributions (Recruiter Highlights)

This project was built collaboratively, dividing complex full-stack responsibilities into specialized roles to ensure production-grade quality across both the UI and the Backend engineering.

| Team Member | Role | Core Contributions & Engineering Solutions |
| :--- | :--- | :--- |
| **Kasim Shah** | **Lead Backend & Database Engineer** | • **Database Architecture:** Designed relational models (Prisma/Postgres) connecting Users, Destinations, Bookings, and Payments.<br>• **Payment Integration:** Built end-to-end Razorpay integration including order creation, signature verification (HMAC SHA256), and async webhook listeners.<br>• **Concurrency Locks:** Engineered zero-collision booking by implementing deterministic `activeSlotKey` logic inside DB transactions.<br>• **Automated Crons:** Developed server-side sweeping intervals to auto-expire abandoned carts and programmatic policy-based refund triggers. |
| **Faizan Khatib** | **Lead Frontend & UI/UX Engineer** | • **Visual Design:** Architected the premium look-and-feel of the application, utilizing Tailwind CSS for responsive and dynamic theming (Dark/Light mode).<br>• **Micro-Interactions:** Integrated `Framer Motion` for staggered component reveals and smooth page transitions.<br>• **Client Logic:** Managed complex client state using `Zustand` and built highly validated user forms utilizing `React Hook Form` and `Zod`.<br>• **UX Optimization:** Designed seamless user feedback loops with dynamic skeleton loaders, API error boundaries, and `react-hot-toast` notifications. |

---

## 🚀 Key Architectural Features

* **Deterministic Slot Reservation:** Engineered a zero-collision booking system. When a user begins checkout, the specific date/slot is hard-locked in the Database. Abandoned checkouts are tracked and swept automatically using a lifecycle manager to gracefully free up slots.
* **Idempotent Payment Engine:** Hardened the Razorpay integration against double-spending and network races. Reacts securely to webhook callbacks (`payment.captured`, `refund.processed`) instead of relying solely on client-side success callbacks.
* **Automated Refund Policy:** Built a smart cancellation engine that calculates travel window distances programmatically. Instantly initiates 100% Refunds for eligible cancellations (48+ hours prior) directly through the Razorpay Dashboard APIs.

---

## 💻 Detailed Technology Stack

| Category | Technologies Used | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React.js (Vite) | Lightning-fast component rendering and HMR. |
| **Styling & UI** | Tailwind CSS, Framer Motion | Utility-first styling with complex, staggered DOM animations. |
| **State & Forms** | Zustand, React Hook Form, Zod | Global state persistence, frictionless form handling, and strict schema validation. |
| **Backend Core** | Node.js, Express.js | High-performance RESTful API generation and routing. |
| **Database & ORM** | PostgreSQL, Prisma ORM | Relational data integrity, schema migrations, and type-safe DB queries. |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs | HTTP-Only cookie-based authentication ensuring zero XSS token leakage. |
| **External APIs** | Razorpay Node SDK | Handling domestic/international payments and automated refunds. |
| **DevOps & Hosting**| Vercel, Render, Neon.tech | CD/CI pipelines for serverless frontend, persistent backend, and cloud database. |

---

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
DATABASE_URL="postgresql://user:password@hostname/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@hostname/dbname?sslmode=require"
JWT_SECRET="your_highly_secure_jwt_secret"
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
FRONTEND_URL="http://localhost:5173"
```

### 5. Finalize Database & Start
```bash
# Push schema and seed initial destination logic
npx prisma db push
node prisma/seed.js

# Start backend server
node index.js
```

---
*Built with ❤️ by Kasim Shah & Faizan Khatib.*
