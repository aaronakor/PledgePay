# PledgePay — Architecture

## Overview

PledgePay is a mobile-first web application built around a structured commitment
lifecycle. It is not a lending institution. It is a trust and accountability
layer that sits between two people who already know each other.

The architecture prioritises simplicity, reliability, and low operational cost.
Every decision must serve the MVP first. No over-engineering.

---

## Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + CSS Variables for the design token system
- **State Management:** Zustand (lightweight, no Redux complexity)
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Axios with interceptors for auth headers and error handling

### Backend
- **Runtime:** Node.js via Next.js API Routes (no separate backend server for MVP)
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL (via Supabase — free tier covers us)
- **Authentication:** NextAuth.js (JWT sessions, no OAuth for MVP)
- **Email:** Nodemailer + Gmail SMTP (free — up to 500 emails/day via App Password)
- **File Storage:** Supabase Storage (proof of payment uploads — free tier)
- **Payment Processing:** Flutterwave

### Infrastructure
- **Hosting:** Vercel (free tier for MVP)
- **Database:** Supabase (free tier for MVP — PostgreSQL + Storage in one place)
- **Storage:** Supabase Storage (free tier for MVP — proof of payment uploads)
- **Domain:** Custom domain via Vercel

> All MVP infrastructure choices are free tier. Zero monthly cost until we scale.

---

## Application Structure

```
pledgepay/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group: login, register
│   ├── (dashboard)/              # Protected: dashboard, pledges
│   ├── pledge/[token]/           # Public pledge acceptance page
│   └── api/                      # API routes
│       ├── auth/                 # NextAuth endpoints
│       ├── pledges/              # Pledge CRUD
│       ├── payments/             # Payment initiation
│       └── webhooks/
│           └── flutterwave/      # Flutterwave webhook handler
│
├── components/
│   ├── ui/                       # Base components (Button, Input, Card, etc.)
│   ├── pledge/                   # Pledge-specific components
│   ├── payment/                  # Payment flow components
│   └── reputation/               # Reputation display components
│
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── flutterwave.ts            # Flutterwave API wrapper
│   ├── reputation.ts             # Reputation scoring logic
│   ├── notifications.ts          # Email notification logic (Nodemailer)
│   └── validations/              # Zod schemas
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Migration history
│
└── types/
    └── index.ts                  # Shared TypeScript types
```

---

## Data Model

Refer to the PRD. The canonical schema lives in `prisma/schema.prisma`.
Summary of core tables:

- **users** — accounts, bank details, reputation score
- **pledges** — the core commitment record, status lifecycle
- **payments** — individual repayment records from Flutterwave
- **notifications** — in-app notification records
- **activities** — immutable event log per pledge (timeline)

---

## Pledge Lifecycle (State Machine)

```
PENDING_ACCEPTANCE
  → (borrower accepts)         → AWAITING_FUNDING
  → (24h expires, no action)  → EXPIRED

AWAITING_FUNDING
  → (lender marks funded)     → ACTIVE
  → (timeout, never funded)   → EXPIRED

ACTIVE
  → (due date passes, balance > 0)  → OVERDUE
  → (balance reaches zero)          → COMPLETED

OVERDUE
  → (balance reaches zero)    → COMPLETED

CANCELLED                           (lender cancels from PENDING_ACCEPTANCE only)
```

Status transitions are always handled server-side. The client never dictates
a status change directly — it triggers an action and the server resolves the
new status.

---

## Payment Flow

```
Borrower clicks "Pay Now"
  → Frontend calls POST /api/payments/initiate
  → Server creates a pending payment record
  → Server calls Flutterwave to generate a payment link
  → Frontend redirects to Flutterwave hosted payment page
  → Borrower completes payment on Flutterwave
  → Flutterwave sends webhook to POST /api/webhooks/flutterwave
  → Server verifies webhook signature
  → Server verifies transaction via Flutterwave API (never trust webhook alone)
  → Server updates payment record to SUCCESSFUL
  → Server updates pledge outstanding balance
  → Server fires reputation update
  → Server fires notification to both users
  → Server logs activity event

Fallback (webhook delay):
  → If pledge status not updated within 30s of payment
  → Frontend polls GET /api/payments/verify?ref={transaction_ref}
  → Server cross-checks directly with Flutterwave API
  → Forces update if transaction is confirmed
```

PledgePay never holds funds. All money flows Borrower → Flutterwave → Lender Bank.

---

## Webhook Idempotency

Every Flutterwave transaction has a unique `flw_ref`. Before processing any
webhook event, the server checks if a payment record with that `flw_ref`
already exists and is marked SUCCESSFUL. If yes, the webhook is acknowledged
(200 OK) and ignored. This prevents double-processing duplicate webhook calls.

---

## Reminder System

Reminders are handled by a cron job (Vercel Cron — free tier).
The cron runs daily at 08:00 WAT.

Logic:
1. Query all ACTIVE pledges
2. For each pledge, check the lender's reminder preference (Light / Standard / Strict)
3. Calculate days until due date
4. If today matches a reminder trigger day, send email to borrower via Nodemailer
5. Log a REMINDER_SENT activity event on the pledge

Reminder trigger windows:
- Light: 14, 7, 1 days before
- Standard: 14, 7, 3, 1 days before
- Strict: 21, 14, 7, 3, 1 days before

---

## Expiration Jobs

Also handled by the daily cron:
- PENDING_ACCEPTANCE pledges older than 24 hours → EXPIRED
- AWAITING_FUNDING pledges older than 24 hours → EXPIRED
- ACTIVE pledges past their due date with outstanding balance → OVERDUE

---

## Authentication

- JWT-based sessions via NextAuth.js
- Sessions stored in HTTP-only cookies (not localStorage)
- Token expiration: 7 days, refreshed on activity
- All API routes behind `/api` are protected with session middleware
  except: `/api/auth/*`, `/api/webhooks/*`, and public pledge view

---

## Environment Variables

```env
# Database
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Flutterwave
FLW_PUBLIC_KEY=
FLW_SECRET_KEY=
FLW_WEBHOOK_SECRET=

# Nodemailer — Gmail SMTP
GMAIL_USER=                  # your Gmail address e.g. pledgepay@gmail.com
GMAIL_APP_PASSWORD=          # Gmail App Password (not your regular password)
EMAIL_FROM=                  # Display name + address e.g. "PledgePay <pledgepay@gmail.com>"

# Supabase (database + storage)
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Email (Nodemailer + Gmail SMTP)

All email is sent through a single `lib/mailer.ts` module. Nothing else
in the codebase imports Nodemailer directly — only `lib/notifications.ts`
calls `lib/mailer.ts`.

```ts
// lib/mailer.ts

import nodemailer from 'nodemailer'
import { env } from '@/lib/env'

// Transporter is created once and reused — not on every email send
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.gmailUser,
    pass: env.gmailAppPassword,   // Gmail App Password, NOT your Gmail login password
  },
})

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  await transporter.sendMail({
    from: env.emailFrom,   // e.g. "PledgePay <pledgepay@gmail.com>"
    to,
    subject,
    html,
  })
}
```

### Setting Up Gmail App Password (One-Time Setup)

1. Go to your Google Account → Security
2. Enable 2-Step Verification (required)
3. Go to Security → App Passwords
4. Generate a new App Password for "Mail"
5. Copy the 16-character password into `GMAIL_APP_PASSWORD`

### Email Templates

All email templates are functions that return an HTML string.
They live in `lib/email-templates/`.

```ts
// lib/email-templates/pledge-received.ts

export function pledgeReceivedTemplate({
  borrowerName,
  lenderName,
  amount,
  purpose,
  dueDate,
  pledgeLink,
}: PledgeReceivedTemplateProps): string {
  return `
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h1 style="font-size: 24px; color: #111827;">You have a new pledge</h1>
      <p style="color: #6B7280;">Hi ${borrowerName},</p>
      <p style="color: #6B7280;">
        ${lenderName} has created a pledge for you on PledgePay.
      </p>
      <div style="background: #F9FAFB; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="margin: 0; color: #111827; font-size: 20px; font-weight: 600;">
          ₦${amount.toLocaleString('en-NG')}
        </p>
        <p style="margin: 4px 0 0; color: #6B7280; font-size: 14px;">${purpose}</p>
        <p style="margin: 4px 0 0; color: #6B7280; font-size: 14px;">Due: ${dueDate}</p>
      </div>
      <a href="${pledgeLink}"
         style="display: inline-block; background: #0D7C6E; color: white;
                padding: 12px 24px; border-radius: 8px; text-decoration: none;
                font-weight: 600; font-size: 14px;">
        Review &amp; Accept Pledge
      </a>
      <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px;">
        PledgePay — Accountability without harassment.
      </p>
    </div>
  `
}
```

Templates needed for MVP (one file each):
- `pledge-received.ts` — sent to borrower when pledge is created
- `pledge-accepted.ts` — sent to lender when borrower accepts
- `funding-confirmed.ts` — sent to borrower when lender marks as funded
- `reminder.ts` — sent to borrower on reminder days
- `payment-received.ts` — sent to lender when payment comes in
- `pledge-completed.ts` — sent to both when pledge is fully repaid

---



## File Storage (Supabase Storage)

Proof of payment uploads are handled through Supabase Storage (free tier).
All upload logic lives in `lib/storage.ts`. Nothing else in the codebase
imports the Supabase client directly for storage purposes.

```ts
// lib/storage.ts

import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

const supabase = createClient(
  env.supabaseUrl,
  env.supabaseServiceRoleKey
)

const BUCKET = 'proof-of-payment'  // Private bucket — create this in Supabase dashboard

export async function uploadProofOfPayment(
  fileBuffer: Buffer,
  mimeType: string,
  pledgeId: string,
  fileName: string
): Promise<string> {
  const path = `${pledgeId}/${Date.now()}-${fileName}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, fileBuffer, { contentType: mimeType, upsert: false })

  if (error) throw error
  return path  // Store the path, not the URL — generate signed URL on access
}

export async function getSignedProofUrl(path: string): Promise<string> {
  // Signed URL valid for 1 hour — never expose the raw Supabase URL
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 3600)

  if (error || !data) throw error
  return data.signedUrl
}
```

### Connecting Supabase (One-Time Setup)

1. Go to **supabase.com** and sign in to your project
2. Go to **Project Settings → Database**
3. Copy the **Connection String** (URI format) → paste as `DATABASE_URL`
4. Go to **Project Settings → API**
5. Copy **Project URL** → paste as `NEXT_PUBLIC_SUPABASE_URL`
6. Copy **service_role secret** → paste as `SUPABASE_SERVICE_ROLE_KEY`
7. Go to **Storage → New Bucket** → name it `proof-of-payment` → set to **Private**

### File Upload Rules

- Accepted types: JPEG, PNG, WebP, PDF
- Maximum size: 5MB (enforced client-side before upload and server-side)
- Files stored under `{pledgeId}/{timestamp}-{filename}` in the private bucket
- Access via signed URLs with 1-hour expiry — raw Supabase URLs are never exposed
- MIME type validated server-side before upload (not just file extension)

---

## Key Constraints
- **No message queues.** Cron + polling covers our async needs without cost.
- **No third-party auth (Google, etc.)** for MVP. Email + password only.
- **No client-side payment logic.** All payment state is server-authoritative.
- **Currency is Naira (₦) only.** No multi-currency in MVP.
- **All repayments must go through Flutterwave.** No external repayment tracking in MVP.
