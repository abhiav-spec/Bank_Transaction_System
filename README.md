# NEXA Bank Transaction System

A full-stack digital banking system with:

- **Backend:** Node.js + Express + MongoDB
- **Frontend:** React + Redux Toolkit + React Router + Tailwind CSS + Axios + Three.js

This is the main README for running and understanding the complete NEXA Bank project.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Core Features](#core-features)
- [Application Routes](#application-routes)
- [User Roles](#user-roles)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Run the Project](#run-the-project)
- [API + Frontend Flow](#api--frontend-flow)
- [Troubleshooting](#troubleshooting)
- [Project Docs](#project-docs)

---

## Project Overview

This project provides a secure digital banking workflow for both normal users and system users.

Key capabilities include:

- User registration, login, logout, and protected routes
- Dedicated account creation page with multi-step KYC flow
- Account balance derived from ledger credit and debit entries
- Quick transfer flow secured with transaction PIN and idempotency key
- Recipient lookup by phone number with account selection when multiple accounts exist
- Selected payment card flow so transfers are made from one explicitly chosen card
- System-user-only funding and account management operations
- Password reset flow using secure reset token in the URL
- Separate user dashboard and admin dashboard with a consistent light glass UI

---

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT auth
- bcryptjs
- Nodemailer

### Frontend

- React (Vite)
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- Three.js (`@react-three/fiber`)

---

## Repository Structure

```bash
Bank_Transaction_System/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── run_full_flow.sh
│   ├── README.md
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
├── frontend/
│   ├── package.json
│   ├── README.md
│   └── src/
│       ├── app/
│       ├── components/
│       ├── features/
│       ├── pages/
│       └── services/
└── README.md   # (this file)
```

---

## Core Features

- **Auth:** register, login, logout, token blacklist, token version invalidation
- **Auth UI:** modern split-screen Login/Register/Forgot/Reset pages with shared auth navbar + About modal
- **Auth Guardrails:** Login and Register require Terms checkbox before submit
- **Password Reset:** forgot/reset with hashed reset token + expiry
- **Accounts:** separate account list page (`/accounts`) and dedicated create page (`/accounts/create`) with 4-step KYC, Aadhaar validation, phone number capture, and max-3 account rule per Aadhaar
- **Selected Payment Card:** dedicated Select Card page (`/select-card`) with persisted single-card selection for transfers
- **Transfers:** idempotency key + transaction PIN required
- **Phone-Based Recipient Search:** transfer form searches recipient accounts by phone number and allows choosing the target account
- **Dashboard UX:** live search navigation, recent transaction notifications, quick actions, and filtered card tabs
- **UI Design:** blurred image background, glassmorphism layout, transparent navbar, light-themed sidebar, and NEXA Bank branding
- **System Funding:** protected endpoint for system user only
- **Admin Console:**
  - dashboard stats
  - account search by id/email/aadhaar
  - all accounts with status filters
  - users list
  - transactions list
  - funding form
  - account status management
  - same branded light-theme layout as the user dashboard

---

## Application Routes

### Public Routes

- `/login`
- `/register`
- `/forgot-password`
- `/reset-password?token=...`

### Normal User Routes

- `/dashboard`
- `/accounts`
- `/accounts/create`
- `/select-card`
- `/transfer`
- `/transactions`
- `/profile`

### System User Routes

- `/admin`
- `/admin/search-account`
- `/admin/all-accounts`
- `/admin/users`
- `/admin/transactions`
- `/admin/system-funding`

---

## User Roles

1. **Normal User**
   - create accounts
  - select one payment card for transfers
   - transfer funds
  - search recipient by phone number and choose recipient account
   - view own transactions
  - use dashboard search and notifications

2. **System User (Bank Admin)**
   - access admin dashboard
   - manage account status
  - search and review all accounts
  - review users and transactions
   - system initial funding to user accounts

---

## Quick Start

### 1) Install dependencies

```bash
# backend
npm --prefix backend install

# frontend
npm --prefix frontend install
```

### 2) Configure backend environment

Create `backend/.env` with required values, for example:

```env
PORT=3000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
EMAIL_USER=<smtp_user>
EMAIL_PASS=<smtp_pass>
FRONTEND_URL=http://localhost:5173
```

### 3) Start backend

```bash
npm --prefix backend run dev
```

### 4) Start frontend

```bash
npm --prefix frontend run dev
```

---

## Environment Variables

Main backend vars used by this project:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
- `FRONTEND_URL`

Frontend uses:

- `VITE_API_BASE_URL` (optional, defaults to `http://localhost:3000`)

Backend account creation and transfer flow now also rely on:

- account-level `phoneNumber` stored during account creation
- phone-based recipient lookup endpoint used by the transfer UI

---

## Run the Project

- Backend health check: `http://localhost:3000/`
- Frontend dev app: `http://localhost:5173/`

Recommended startup order:

1. backend
2. frontend

Recommended commands:

```bash
# terminal 1
npm --prefix backend run dev

# terminal 2
npm --prefix frontend run dev
```

Notes:

- Running `npm run dev` from the repository root will fail because the root does not define that script.
- Use the package-specific commands above or run commands from inside `backend/` and `frontend/`.

---

## API + Frontend Flow

- Frontend uses Axios instance in `frontend/src/services/api.js`
- JWT token is attached through Axios request interceptor
- Admin access check is performed through system account API authorization
- User account creation is initiated from `/accounts/create` and account listing remains on `/accounts`
- Account creation captures identity details such as Aadhaar number and phone number
- Transfer flow uses the selected payment card as sender account
- Transfer UI searches recipient accounts by phone number through `GET /api/accounts/search?phone=...`
- When multiple accounts are mapped to the same phone number, the user chooses which recipient account to send money to
- Reset password page reads token from URL query (`/reset-password?token=...`) and does not expose token input
- Funding API used by admin page:
  - `POST /api/transactions/system/initial-funds`

---

## Troubleshooting

### Backend starts but funding fails

Check these first:

- logged in user is a **system user**
- selected `fromAccount` belongs to system user
- both accounts are `active`
- `idempotencyKey` is unique

### Transfer search by phone returns no accounts

Check these first:

- the recipient account was created with a phone number in account KYC
- the phone number matches exactly what is stored on the account
- the recipient account status is `active`
- backend server is running and reachable on port `3000`

### Transfer fails even after selecting a recipient

Check these first:

- a payment card is selected on `/select-card`
- the transaction PIN is correct
- sender account has enough balance
- recipient account chosen from search results is the intended account

### 404 on `/api/transactions/system/all`

This project uses `GET /api/transactions` for transactions list in frontend fallback flow; the `/system/all` route is not required for core operation.

### CORS issues in browser

Set `FRONTEND_URL=http://localhost:5173` in `backend/.env` and restart backend.

---

## Project Docs

- Backend detailed docs: `backend/README.md`
- Frontend docs/template: `frontend/README.md`

