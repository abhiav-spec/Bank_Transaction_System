# Bank Transaction System API

A secure Node.js + Express + MongoDB backend for user authentication, account management, ledger-based money movement, system-controlled initial funding, and password reset flow.

---

## Introduction

The **Bank Transaction System** is designed as a backend API for basic digital banking operations:

- User registration, login, logout
- Account creation and account balance tracking
- User-to-user fund transfer (with idempotency support)
- UPI-style transaction password (PIN) required for fund transfer
- System user controlled initial deposit flow
- Secure forgot/reset password flow with one-time token expiry
- Email notifications for auth and transaction events

The project follows a modular structure using controllers, models, services, routes, middleware, and utilities.

---

## Table of Contents

- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How the System Works](#how-the-system-works)
  - [Auth Flow](#auth-flow)
  - [Account Flow](#account-flow)
  - [Transaction Flow](#transaction-flow)
  - [System Initial Funds Flow](#system-initial-funds-flow)
  - [Transaction Password Flow](#transaction-password-flow)
  - [Forgot/Reset Password Flow](#forgotreset-password-flow)
- [API Base URL](#api-base-url)
- [Authentication](#authentication)
- [Complete API Reference](#complete-api-reference)
  - [Health API](#health-api)
  - [Auth APIs](#auth-apis)
  - [Account APIs](#account-apis)
  - [Transaction APIs](#transaction-apis)
- [Environment Variables](#environment-variables)
- [Setup & Run](#setup--run)
- [Security Features](#security-features)
- [Error Handling](#error-handling)
- [Notes](#notes)

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + Cookie support
- **Password Hashing:** bcryptjs
- **Email:** Nodemailer (Gmail OAuth2)
- **Config:** dotenv

---

## Project Structure

```bash
.
├── package.json
├── server.js
├── run_full_flow.sh
└── src
    ├── app.js
    ├── config
    │   └── db.js
    ├── controllers
    │   ├── auth.controller.js
    │   ├── account.controller.js
    │   ├── transaction.controller.js
    │   └── Initialfunds.controller.js
    ├── middleware
    │   └── auth.middleware.js
    ├── models
    │   ├── user.model.js
    │   ├── account.model.js
    │   ├── ledger.model.js
    │   ├── transaction.model.js
    │   └── tokenblacklist.model.js
    ├── routes
    │   ├── auth.routes.js
    │   ├── account.routes.js
    │   └── transaction.routes.js
    ├── services
    │   └── email.service.js
    └── utils
        ├── resetToken.util.js
        └── rateLimit.util.js
```

---

## How the System Works

### Auth Flow

1. User registers with `name`, `email`, `password`.
2. Password is hashed using bcrypt before save.
3. User logs in with email/password.
4. Server issues JWT with `id` and `tokenVersion`.
5. Logout blacklists token using `tokenblacklist` collection.

### Transaction Password Flow

1. Authenticated user sets transaction password (4 to 6 digits) using set API.
2. User can update transaction password using current + new transaction password.
3. Transaction password is stored as bcrypt hash in user profile.
4. Every fund transfer requires valid `transactionPassword`.
5. Transfer fails if transaction password is missing/wrong or not set.

### Account Flow

1. Authenticated user creates an account with a currency code (e.g. `INR`).
2. Account status defaults to `active`.
3. Balance is calculated from ledger entries:
   - `balance = total credits - total debits`

### Transaction Flow

1. Authenticated user requests transfer using:
  - `fromAccount`, `toAccount`, `amount`, `idempotencyKey`, `transactionPassword`
2. Server validates transaction password, account ownership (`fromAccount` must belong to logged-in user), active status, idempotency key, and available balance.
3. Transaction + ledger debit/credit are done in MongoDB session transaction.
4. Emails are sent to both account owners.

### System Initial Funds Flow

1. Endpoint is restricted to **system user only** (`systemUserMiddleware`).
2. System user can add initial funds to target account using:
   - `fromAccount` (must belong to logged-in system user)
   - `toAccount`, `amount`, `idempotencyKey`
3. Records debit from system account + credit to user account in ledger.

### Forgot/Reset Password Flow

1. User hits forgot password with email.
2. Response is always generic (prevents email enumeration).
3. Server generates secure random token using crypto.
4. Token is SHA256 hashed before DB storage.
5. Expiry is set to **15 minutes**.
6. Email is sent with reset link.
7. Reset API accepts `token` + `newPassword` (min 8 chars).
8. On success:
   - password is updated (bcrypt hash)
   - reset token fields are removed
   - `tokenVersion` increments (old JWT sessions become invalid)

---

## API Base URL

Local default:

```bash
http://localhost:<PORT>
```

Example:

```bash
http://localhost:3000
```

---

## Authentication

Protected APIs require JWT via either:

- Cookie: `token`
- Header: `Authorization: Bearer <jwt_token>`

If token is blacklisted, expired, invalid, or tokenVersion mismatches, request is rejected.

---

## Complete API Reference

### Health API

#### `GET /`

Returns service health message.

---

### Auth APIs

#### `POST /api/auth/register`

Create new user.

**Body**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

---

#### `POST /api/auth/login`

Login user and return JWT.

**Body**

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

---

#### `POST /api/auth/logout`

Logout and blacklist current token.

**Header**

```bash
Authorization: Bearer <token>
```

---

#### `POST /api/auth/forgot-password`

Request password reset link.

- Rate limited (default 5 requests / 15 minutes per IP+email key)
- Always returns generic success message

**Body**

```json
{
  "email": "john@example.com"
}
```

---

#### `POST /api/auth/reset-password`

Reset password using token.

**Body**

```json
{
  "token": "raw_reset_token_from_email",
  "newPassword": "NewStrongPass123"
}
```

---

#### `POST /api/auth/transaction-password/set`

Set transaction password (PIN) for logged-in user.

**Header**

```bash
Authorization: Bearer <token>
```

**Body**

```json
{
  "transactionPassword": "1234"
}
```

---

#### `POST /api/auth/transaction-password/update`

Update transaction password (PIN) for logged-in user.

**Header**

```bash
Authorization: Bearer <token>
```

**Body**

```json
{
  "currentTransactionPassword": "1234",
  "newTransactionPassword": "5678"
}
```

---

### Account APIs

#### `GET /api/accounts`

Get all accounts for logged-in user.

---

#### `POST /api/accounts`

Create account for logged-in user.

**Body**

```json
{
  "currency": "INR"
}
```

---

#### `GET /api/accounts/balance/:accountId`

Get balance for one account (owned by logged-in user).

---

### Transaction APIs

#### `GET /api/transactions`

Get transactions where user is sender or receiver through owned accounts.

---

#### `POST /api/transactions`

Transfer funds between accounts.

**Body**

```json
{
  "fromAccount": "<accountId>",
  "toAccount": "<accountId>",
  "amount": 300,
  "idempotencyKey": "txn-unique-key-001",
  "transactionPassword": "1234"
}
```

---

#### `POST /api/transactions/system/initial-funds`

System user only endpoint to credit initial funds.

**Body**

```json
{
  "fromAccount": "<systemAccountId>",
  "toAccount": "<targetAccountId>",
  "amount": 1500,
  "idempotencyKey": "init-unique-key-001"
}
```

---

## Environment Variables

Create `.env` file in project root:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/bank_transaction_system
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token

# optional (for reset link base URL)
PASSWORD_RESET_URL=http://localhost:3000
# or FRONTEND_URL=http://localhost:5173
# or APP_URL=http://localhost:3000
```

---

## Setup & Run

### 1) Install dependencies

```bash
npm install
```

### 2) Start server

```bash
npm start
```

### 3) Development mode

```bash
npm run dev
```

---

## Security Features

- Password hashing with bcrypt
- JWT auth with token blacklist on logout
- Token version check to invalidate old sessions after password reset
- Transaction password (PIN) stored as bcrypt hash
- Transaction password required for user-to-user transfers
- Sender account ownership check on transfers
- System-user restricted initial funding endpoint
- Idempotency key for transactions
- MongoDB transactions for ledger consistency
- Forgot-password token hashing (SHA256)
- One-time reset token usage
- Token expiry enforcement (15 minutes)
- Basic rate limiting on forgot-password endpoint

---

## Error Handling

- Consistent JSON response with `status: false` and `message`
- Validation errors return client-friendly messages
- Try/catch used across controllers
- Auth middleware handles missing/invalid/blacklisted tokens

---

## Notes

- Current transfer controller introduces a deliberate 5-second wait before credit entry (simulated delay).
- `run_full_flow.sh` exists for manual flow testing, but ensure it matches latest auth restrictions before using in production checks.
- This README documents backend APIs only (no UI layer).
