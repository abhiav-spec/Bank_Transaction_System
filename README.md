# Bank Transaction System (Full Project)

A full-stack banking system with:

- **Backend:** Node.js + Express + MongoDB
- **Frontend:** React + Redux Toolkit + React Router + Tailwind CSS + Axios + Three.js

This is the **main project README** for running and understanding the complete system.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Core Features](#core-features)
- [User Roles](#user-roles)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Run the Project](#run-the-project)
- [API + Frontend Flow](#api--frontend-flow)
- [Troubleshooting](#troubleshooting)
- [Project Docs](#project-docs)

---

## Project Overview

This project provides a secure digital banking workflow:

- User registration/login/logout
- 4-step KYC-based account creation
- Account balance via ledger model (credit/debit)
- User-to-user transfer with idempotency and transaction PIN
- System-user-only initial funding endpoint
- Forgot/reset password with secure token flow
- Admin dashboard for account control and system operations

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
- **Password Reset:** forgot/reset with hashed reset token + expiry
- **Accounts:** 4-step KYC flow, Aadhaar validation, max-3 account rule
- **Transfers:** idempotency key + transaction PIN required
- **System Funding:** protected endpoint for system user only
- **Admin Console:**
  - dashboard stats
  - account search by id/email/aadhaar
  - all accounts with status filters
  - users list
  - transactions list
  - funding form

---

## User Roles

1. **Normal User**
   - create accounts
   - transfer funds
   - view own transactions

2. **System User (Bank Admin)**
   - access admin dashboard
   - manage account status
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
npm --prefix backend run start
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

---

## Run the Project

- Backend health check: `http://localhost:3000/`
- Frontend dev app: `http://localhost:5173/`

Recommended startup order:

1. backend
2. frontend

---

## API + Frontend Flow

- Frontend uses Axios instance in `frontend/src/services/api.js`
- JWT token is attached through Axios request interceptor
- Admin access check is performed through system account API authorization
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

### 404 on `/api/transactions/system/all`

This project uses `GET /api/transactions` for transactions list in frontend fallback flow; the `/system/all` route is not required for core operation.

### CORS issues in browser

Set `FRONTEND_URL=http://localhost:5173` in `backend/.env` and restart backend.

---

## Project Docs

- Backend detailed docs: `backend/README.md`
- Frontend docs/template: `frontend/README.md`

This root README is intentionally separate and does **not** modify backend/frontend README files.
