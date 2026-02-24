## Invoice Pro – Production-Ready Invoice Management System

Invoice Pro is a full‑stack, production‑grade invoice management system built with a modern React frontend and a robust Node.js/Express backend.

It supports secure authentication, invoice lifecycle management, payments tracking, PDF generation, and automated overdue status handling – all backed by a relational PostgreSQL database and Prisma ORM.

---

## 1. Features Overview

### 1.1 Core Business Features

- **Authentication & Authorization**
  - JWT‑based authentication (register/login).
  - Protected API routes; frontend route guards.
  - Per‑user data isolation (each user sees only their invoices).

- **Invoice Management**
  - Create, view, edit invoices.
  - Statuses: `DRAFT`, `SENT`, `PAID`, `OVERDUE`.
  - Archive and restore invoices (soft delete via `isArchived` flag).
  - Automatic overdue detection based on `dueDate` and `balanceDue`.

- **Line Items & Totals**
  - Multiple line items per invoice (quantity, unit price, description).
  - Server‑side calculation of:
    - Line totals
    - Subtotal
    - Tax amount
    - Total amount
    - Amount paid
    - Balance due

- **Payments**
  - Add payments against invoices.
  - Transaction‑safe balance updates.
  - Payment history per invoice.
  - Status update to `PAID` when fully paid; `OVERDUE` when past due with remaining balance.

- **PDF Generation**
  - Downloadable, server‑generated PDF for any invoice.
  - Auth‑protected endpoint for PDF downloads.

- **Dashboard & Reporting**
  - Invoice list with status, amount, due date.
  - High‑level metrics:
    - Total invoices
    - Total revenue
    - Pending amount.
  - Search by invoice number and customer name.
  - Active vs archived invoices view & restoration.

---

## 2. Tech Stack

### 2.1 Frontend

- **React + Vite**
  - Fast dev server and HMR.
  - React 18+ app structure.
- **React Router**
  - SPA routing.
  - Protected routes for authenticated areas.
- **TanStack Query (React Query)**
  - Server state management (invoices, invoice details, payments).
  - Query caching, background refetching, and cache invalidation on mutations.
- **Tailwind CSS**
  - Utility‑first styling.
  - Dark mode via `dark` class (currently toggle removed as requested).
- **Framer Motion**
  - Subtle page and component animations.
- **react-hot-toast**
  - User feedback for success and error states.

### 2.2 Backend

- **Node.js + Express**
  - REST API with structured routing and middleware.
- **Prisma + PostgreSQL**
  - Prisma as ORM for schema, migrations, and type‑safe DB access.
  - PostgreSQL as primary data store.
- **Authentication**
  - JWT tokens using `jsonwebtoken`.
  - Hashing with `bcrypt`.
- **Logging & Monitoring**
  - `pino` + `pino-http` for structured request logging.
- **Validation**
  - `zod` schemas for request payload validation.
- **PDF Generation**
  - `pdfkit` for invoice PDF creation.
- **Background Jobs**
  - `node-cron` for overdue invoice checks (`overdue_job.js`).

---

## 3. Project Structure

High‑level layout:

- **`frontend/`**
  - `src/`
    - `app/` – router and query client.
    - `components/` – layout, invoice UI, shared components.
    - `context/` – auth context, search context.
    - `hooks/` – React Query hooks (`useInvoices`, `useInvoice`, `useAddPayment`, `useArchivedInvoices`, `useTheme`).
    - `pages/` – `Home`, `Login`, `Register`, `Dashboard`, `CreateInvoice`, `EditInvoice`, `InvoiceDetails`.
    - `services/` – `api`, `invoice.services`, `payment.services`, `pdf.service`.
    - `utils/` – helpers like `formatCurrency`.

- **`backend/`**
  - `src/`
    - `config/` – environment and Prisma client.
    - `middleware/` – `auth_middleware`, `error_middleware`.
    - `modules/`
      - `auth/` – auth controller, routes, service, validation.
      - `invoice/` – controller, service, routes, presenter, utils, validation.
      - `payment/` – controller, routes, service, validation, provider.
      - `pdf/` – PDF controller, routes, service.
    - `utils/` – logger, overdue job.
    - `app.js` – Express app wiring.
    - `server.js` – entrypoint, DB connect, and job start.
  - `prisma/` – Prisma schema & migrations.

---

## 4. Setup & Installation

> You need **Node.js (v18+)** and a running **PostgreSQL** instance.

### 4.1 Clone the repository

```bash
git clone <repo-url> Meru-Technolog_assignment
cd Meru-Technolog_assignment
```

### 4.2 Backend Setup

```bash
cd backend
npm install
```

1. **Environment file**

   Copy the example and adjust:

   ```bash
   cp .env.example .env
   ```

   Update at minimum:

   ```env
   PORT=5000
   DATABASE_URL=postgresql://user:password@localhost:5432/invoice_db
   JWT_SECRET=your-super-secret-jwt-key
   ```

2. **Prisma database migrations**

   ```bash
   npx prisma migrate dev
   # Optional: generate client
   npx prisma generate
   ```

3. **Run the backend**

   ```bash
   npm run dev   # uses nodemon
   # or
   npm start     # plain node
   ```

   Health check:

   ```bash
   curl http://localhost:5000/health
   # -> { "status": "ok" }
   ```

### 4.3 Frontend Setup

```bash
cd frontend
npm install
```

1. **Environment file**

   ```bash
   cp .env.example .env
   ```

   Ensure:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

2. **Run the frontend**

   ```bash
   npm run dev
   ```

   Open in browser:

   ```text
   http://localhost:5173
   ```

---

## 5. Usage Guide

### 5.1 Public Landing & Auth

1. Navigate to `http://localhost:5173/`:
   - You’ll see the **Home** landing page with CTAs:
     - **Get started** → `/register`
     - **Sign in** → `/login`

2. **Register**
   - Go to `/register`.
   - Fill `name`, `email`, `password`.
   - On success:
     - JWT token is stored.
     - You’re redirected to `/dashboard`.

3. **Login**
   - Go to `/login`.
   - Use previously registered credentials.
   - On success:
     - You’re redirected to `/dashboard`.

4. **Logout**
   - Use the **Sign out** button in the topbar.
   - Token and user info are cleared; you go back to the public area.

### 5.2 Dashboard

- At `/dashboard` you see:
  - **Summary cards**:
    - Total invoices
    - Total revenue
    - Pending amount
  - **Invoices table**:
    - Number, customer, amount, status, due date, and a **View** link.
  - **Search bar** (topbar):
    - Filters invoices by invoice number or customer name.
  - **Create invoice** button:
    - Navigates to `/invoices/new`.

### 5.3 Creating an Invoice

1. Click **Create invoice** or go to `/invoices/new`.
2. Fill:
   - Customer name
   - Issue date & due date
   - Status: `Save as draft` (DRAFT) or `Mark as sent` (SENT).
   - Line items:
     - Description, quantity, unit price.
3. Totals are calculated client‑side for UX, but **authoritative values** are computed on the backend.
4. Click **Create invoice**:
   - `POST /api/invoices` is called.
   - On success, you are redirected to `/invoices/:id`.

### 5.4 Invoice Details

At `/invoices/:id`:

- **Header**:
  - Invoice number, customer, status.
  - Issue and due dates.
  - Actions:
    - Add Payment
    - Edit Invoice
    - Download PDF
    - Archive / Restore invoice

- **Items & Totals**:
  - Line items table with description, quantity, unit price, line total.
  - Summary card:
    - Subtotal
    - Tax
    - Total
    - Amount paid
    - Balance due

- **Payments**:
  - List of all payments with date and amount.

### 5.5 Payments

- Click **Add Payment**:
  - Modal opens.
  - Enter an amount ≤ current balance due.
  - On confirm, `POST /api/payments/:invoiceId` is called.
  - On success:
    - Invoice totals are recalculated.
    - Status may change to `PAID` or `OVERDUE`.

### 5.6 Archiving & Restoring Invoices

- **Archive**:
  - From invoice header, click **Archive invoice**.
  - Calls `POST /api/invoices/:id/archive`.

- **Restore**:
  - On dashboard, click **Show archived (N)**.
  - Use **Restore** action in the archived list.
  - Calls `POST /api/invoices/:id/restore`.

---

## 6. API Overview

Base URL: `http://localhost:5000/api`

### 6.1 Authentication

- `POST /auth/register`
  - Body: `{ name, email, password }`
  - Response: `{ token, user: { id, name, email } }`

- `POST /auth/login`
  - Body: `{ email, password }`
  - Response: `{ token, user: { id, name, email } }`

### 6.2 Invoices

- `GET /invoices`
  - List active invoices for authenticated user.

- `GET /invoices/archived`
  - List archived invoices.

- `GET /invoices/:id`
  - Get raw invoice with relations.

- `GET /invoices/:id/details`
  - Get formatted invoice with totals, payments, etc. (`buildInvoiceResponse`).

- `POST /invoices`
  - Create invoice via validated payload (Zod `createInvoiceSchema`).

- `PUT /invoices/:id`
  - Update invoice, recalc totals, and status (`updateInvoiceSchema`).

- `POST /invoices/:id/archive`
  - Soft‑delete by setting `isArchived = true`.

- `POST /invoices/:id/restore`
  - Restore by setting `isArchived = false`.

### 6.3 Payments

- `POST /payments/:invoiceId`
  - Body: `{ amount }`
  - Adds a payment transactionally and updates invoice balances.

### 6.4 PDF

- `GET /pdf/invoice/:invoiceId`
  - Streams a generated PDF to the client.

---

## 7. Architecture & Design Decisions

- **Backend‑authoritative financial logic**
  - All monetary calculations are done server‑side with Prisma models.
  - Frontend only displays and formats values.

- **Transactional safety**
  - Payments and invoice updates use Prisma transactions.
  - Ensures data consistency even under concurrent changes.

- **Modular domain structure**
  - `auth`, `invoice`, `payment`, `pdf` separated into modules.
  - Easier to maintain and extend domain logic.

- **Validation layer**
  - Zod schemas ensure incoming data is correct before hitting business logic.

- **Error handling**
  - Central `error_middleware` formats errors consistently.
  - Frontend shows user‑friendly messages via toasts.

---

## 8. Testing & Verification (Manual)

Use this quick checklist to verify everything after setup:

1. **Auth**
   - Register a new user.
   - Log in and out.
2. **Dashboard**
   - Confirm counts and totals change after creating invoices/payments.
3. **Invoices**
   - Create invoice (draft & sent).
   - Edit invoice and confirm recalculated totals.
4. **Payments**
   - Add payments; verify balances and status transitions.
5. **Archive / Restore**
   - Archive invoice and ensure it moves to archived list.
   - Restore and confirm it returns to active list.
6. **PDF**
   - Download an invoice PDF and confirm file opens.

---

## 9. Production Considerations

For real production deployment you should:

- Use a managed PostgreSQL service.
- Store `JWT_SECRET` and DB credentials in a secure secret manager.
- Use HTTPS everywhere.
- Add rate limiting and stricter CORS.
- Introduce structured logging piping to a log aggregator (e.g. ELK/Datadog).
- Run schema migrations as part of CI/CD.
- Add automated tests for payments and invoice transitions.

---

## 10. License

This project is provided for assessment and educational purposes. Adapt or extend it as needed for your own production use. 
