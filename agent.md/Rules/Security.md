# PledgePay — Security

## Overview

PledgePay handles sensitive financial data and personal banking information.
Security is not a feature — it is a foundation. Every API route, every data
model decision, and every client interaction must be built with security in mind.

This document defines the non-negotiable security rules for PledgePay MVP.

---

## Authentication

### Sessions
- Authentication is handled by **NextAuth.js** with JWT strategy.
- Sessions are stored in **HTTP-only, Secure, SameSite=Lax cookies**.
- No session tokens are ever stored in `localStorage` or `sessionStorage`.
- Token expiry: **7 days**, silently refreshed on active use.
- On logout, the session cookie is invalidated server-side.

### Passwords
- Passwords are hashed using **bcrypt** with a minimum cost factor of 12.
- Plain-text passwords are never stored, logged, or transmitted.
- Password minimum length: 8 characters (enforced both client and server-side).
- No password is echoed back in any API response, ever.

### Route Protection
- All routes under `/dashboard`, `/pledges`, and `/profile` require an active session.
- Unauthenticated requests to protected routes are redirected to `/login`.
- All `/api/*` routes validate session on every request via middleware,
  **except**: `/api/auth/*`, `/api/webhooks/flutterwave`, and the public
  pledge view endpoint.

---

## API Security

### Input Validation
- Every API route that accepts a request body validates it with a **Zod schema**
  before any database operation.
- Validation happens server-side, always. Client-side validation is UX only.
- Reject unknown fields. Zod schemas use `.strict()` where appropriate.

### Authorisation Checks
- After validating the session, always verify the user is authorised to act
  on the specific resource. A valid session does not mean access to all data.

```ts
// Always check ownership, not just authentication
const pledge = await prisma.pledge.findUnique({ where: { id: pledgeId } })

if (!pledge) {
  return Response.json({ error: 'Not found' }, { status: 404 })
}

// A user can only act on pledges where they are lender or borrower
if (pledge.lenderId !== session.user.id && pledge.borrowerId !== session.user.id) {
  return Response.json({ error: 'Forbidden' }, { status: 403 })
}
```

### Rate Limiting
- Sensitive endpoints are rate-limited using **Upstash Redis** (free tier) or
  in-memory rate limiting via `next-rate-limit` for MVP.
- Limits:
  - `/api/auth/login`: 5 attempts per 15 minutes per IP
  - `/api/pledges` POST: 10 pledges per hour per user
  - `/api/payments/initiate`: 5 attempts per 10 minutes per pledge

### HTTP Headers
Set the following security headers in `next.config.js`:

```js
headers: [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data:; connect-src 'self' api.flutterwave.com;"
  },
]
```

---

## Flutterwave Webhook Security

This is the most critical security surface in PledgePay. A compromised webhook
endpoint could allow fake payment confirmations.

### Signature Verification
Every incoming webhook request to `/api/webhooks/flutterwave` must be verified
before any processing occurs.

```ts
import crypto from 'crypto'

function verifyFlutterwaveWebhook(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.FLW_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex')

  // Use timingSafeEqual to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

export async function POST(req: Request) {
  const payload = await req.text()
  const signature = req.headers.get('verif-hash') ?? ''

  if (!verifyFlutterwaveWebhook(payload, signature)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Only now proceed with processing
  const event = JSON.parse(payload)
  // ...
}
```

### Double Verification
Never trust the webhook payload alone to confirm a payment.
After a webhook fires, always call Flutterwave's verification API to
independently confirm the transaction status and amount.

```ts
async function verifyTransaction(transactionId: string): Promise<boolean> {
  const response = await fetch(
    `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
    { headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` } }
  )
  const data = await response.json()
  return data.status === 'success' && data.data.status === 'successful'
}
```

### Idempotency
Before processing any payment webhook, check if it has already been processed.
Use the `flw_ref` (Flutterwave reference) as the idempotency key.

```ts
const existingPayment = await prisma.payment.findUnique({
  where: { flutterwaveTransactionId: flwRef },
})

if (existingPayment?.status === 'SUCCESSFUL') {
  // Already processed — acknowledge and return
  return Response.json({ received: true }, { status: 200 })
}
```

---

## Sensitive Data Handling

### What We Store
- Full Name, Email, Phone Number — required for identity and notifications
- Bank Name, Account Number, Account Name — required for repayment routing
- Password hash — bcrypt, never plaintext
- Proof of payment file URL — stored in Supabase Storage, not in the database

### What We Never Store
- Flutterwave card numbers or CVVs — Flutterwave handles this, never us
- Raw passwords at any point
- OTPs or temporary tokens after they expire

### Bank Details Exposure Rules
- A lender's bank details are **never returned to a borrower** through any API.
- Bank details are sent directly to Flutterwave server-side during repayment
  initiation — the borrower's client never sees them.
- Bank details are never included in API list responses. Only returned when
  explicitly needed (e.g. profile settings page, authenticated as that user).

### Data Masking in Logs
- Account numbers are masked in all logs: `****1234`
- Emails are partially masked in logs: `ch***@gmail.com`
- Never log full bank details, passwords, or session tokens.

```ts
// Logging helper
function maskAccountNumber(account: string): string {
  return `****${account.slice(-4)}`
}
```

---

## File Upload Security (Proof of Payment)

- Only image files (JPEG, PNG, WebP) and PDF are accepted.
- Maximum file size: **5MB**.
- Files are uploaded to **Supabase Storage** in a private bucket named `proof-of-payment`.
- A signed URL with a short expiry (1 hour) is generated when a lender or
  borrower needs to view the proof. The raw Supabase URL is never exposed.
- File type is validated server-side by checking the MIME type and file
  signature (magic bytes), not just the file extension.

---

## Pledge Link Security

Pledge links are the public surface of PledgePay. A link like
`/pledge/{token}` must be:

- Generated using `crypto.randomBytes(32).toString('hex')` — cryptographically
  random, not a sequential ID.
- Non-guessable. Never use pledge IDs or user IDs in the public URL.
- Validated on every access — check that the pledge exists, is not expired,
  and is in a state where access is meaningful.
- The borrower email shown on the pledge page is partially masked:
  `ch***@gmail.com` — to protect privacy while confirming the right person.

---

## Account Deletion

Per the PRD, users cannot delete their accounts while active pledges exist.
This prevents users from escaping obligations by deleting.

```ts
async function canDeleteAccount(userId: string): Promise<boolean> {
  const activePledges = await prisma.pledge.count({
    where: {
      OR: [{ lenderId: userId }, { borrowerId: userId }],
      status: { in: ['PENDING_ACCEPTANCE', 'AWAITING_FUNDING', 'ACTIVE', 'OVERDUE'] },
    },
  })
  return activePledges === 0
}
```

---

## Environment Variable Security

- Never commit `.env` files. `.env.local` is in `.gitignore`.
- Secret keys (Flutterwave, Resend, NextAuth, Supabase service role) are
  server-side only — never prefixed with `NEXT_PUBLIC_`.
- Only the following are exposed to the client:
  - `NEXT_PUBLIC_APP_URL`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_FLW_PUBLIC_KEY` (Flutterwave public key is designed to be public)

---

## Security Checklist Before Each Deployment

- [ ] All new API routes validate input with Zod
- [ ] All new API routes check session and authorisation
- [ ] No secrets in `NEXT_PUBLIC_` variables
- [ ] Flutterwave webhook signature verification untouched
- [ ] No `console.log` statements logging sensitive data
- [ ] File upload endpoints validate MIME type server-side
- [ ] New database queries use parameterised inputs (Prisma handles this)
- [ ] No `.env` file committed to the repository
