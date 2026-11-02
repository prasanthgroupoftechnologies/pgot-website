# Prasanth Group of Technologies (PGOT) — Enterprise Web Platform

> **THINK BEYOND. BUILD BEYOND.**

A complete, premium, futuristic, cinematic corporate web platform engineered for **Prasanth Group of Technologies**, featuring an enterprise-grade Customer Enquiry System with database persistence and automated email notifications.

---

## 💎 Brand Identity & Visual Language
- **Deep Midnight Navy**: `#061426`
- **Dark Navy**: `#0A1B33`
- **Metallic Gold**: `#D4AF37`
- **Soft Gold**: `#F0D98A`
- **Pure White**: `#FFFFFF`
- **Electric Blue**: `#168BFF`
- **Cyber Cyan**: `#00E5FF`

---

## 📬 Customer Enquiry & Notification Architecture

### 1. Mandatory Form Fields
- **Full Name** (compulsory, min 2 chars)
- **Company Name** (compulsory, min 2 chars)
- **Email Address** (compulsory, validated format)
- **Phone Number** (compulsory, validated format)
- **Service Focus** (Dropdown: AI & Automation, SaaS, Cloud, Custom Software, Enterprise Tech, BPA, General Consultation)
- **Subject** (custom subject line)
- **Message** (compulsory, min 10 chars)
- **Honeypot Trap** (invisible anti-spam field)

### 2. Zero-Data-Loss Database Persistence
Every submitted enquiry is stored in a local SQLite database at `data/enquiries.db`:
- Unique Reference Code (e.g. `PGOT-ENQ-894095-582`)
- Customer Name, Company, Email, Phone, Service, Subject, Message
- Submission Timestamp (ISO format)
- Email Delivery Status (`SENT` / `FAILED` / `PENDING`)
- Client IP Address

### 3. Automated Dual-Inbox Notifications
Every enquiry triggers an HTML email with the customer's full specifications and sets `Reply-To` directly to the customer's email address:
- **Primary Recipient**: `prasanthgroupoftechnologies@gmail.com`
- **Notification Recipient**: `prasanthhealthtech@gmail.com`

---

## ⚙️ Backend Email Configuration (`.env`)

Configure your email delivery credentials in `.env`:

### Option A: Resend API (Recommended)
1. Sign up at [https://resend.com](https://resend.com).
2. Create an API key in your Resend Dashboard.
3. Update `.env`:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   EMAIL_FROM=PGOT Enquiries <onboarding@resend.dev>
   ```

### Option B: Gmail App Password / SMTP
1. In your Google Account: **Security** > **2-Step Verification** > **App Passwords**.
2. Generate an app password for "Mail".
3. Update `.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=your_company_email@gmail.com
   SMTP_PASS=your_16_character_app_password
   ```

*Note: In development without active credentials, the system automatically uses Ethereal test transport and generates a live web receipt URL while always storing every submission in the database.*

---

## 🚀 Running the Platform

### Start Backend API Server
```bash
npm run server
```
Runs at: `http://localhost:5000`
- `POST /api/enquiry` — Registers customer enquiry and dispatches notifications
- `GET /api/enquiries` — Retrieves stored database enquiries (for testing/admin review)
- `GET /api/health` — Service healthcheck

### Start Frontend Dev Server
```bash
npm run dev
```
Runs at: `http://localhost:3000` (auto-proxies `/api` requests to backend at port 5000).

---

## 📁 Directory Structure
```
pgot-website/
├── data/
│   └── enquiries.db               <-- SQLite database (zero data loss)
├── server/
│   ├── database.js                <-- Database connection & queries
│   ├── emailService.js            <-- Resend & SMTP email dispatcher
│   └── server.js                  <-- Express API server
├── public/
│   └── assets/
│       ├── images/
│       │   ├── pgot-logo.png
│       │   └── pgot-logo.jpg
│       └── videos/
│           └── pgot-hero-background.mp4
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   └── InteractiveGlobe.tsx
│   │   ├── background/
│   │   │   ├── HeroVideoBackground.tsx
│   │   │   └── ParticleFieldCanvas.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Footer.tsx
│   │       ├── GlowBadge.tsx
│   │       ├── Modal.tsx
│   │       ├── Navbar.tsx
│   │       └── SectionHeading.tsx
│   ├── sections/
│   │   ├── AboutSection.tsx
│   │   ├── AiRoboticsSection.tsx
│   │   ├── ContactSection.tsx     <-- Customer Enquiry Form
│   │   ├── HeroSection.tsx
│   │   ├── IndustriesSection.tsx
│   │   ├── InnovationShowcaseSection.tsx
│   │   ├── ServicesSection.tsx
│   │   └── WhyPgotSection.tsx
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── cn.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env                           <-- Environment variables (credentials)
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```
