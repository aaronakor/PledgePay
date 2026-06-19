# PledgePay — API Route Scaffolder

## Purpose

This skill defines the exact pattern for creating every API route in PledgePay.
Every route must follow this structure without exception.
When scaffolding a new route, work through every section of this file in order.

---

## Route Location Convention

All API routes live under `app/api/`. The folder name is the resource.
The file is always `route.ts`.

```
app/api/
├── auth/
│   └── [...nextauth]/route.ts     # NextAuth — do not touch
├── pledges/
│   ├── route.ts                   # GET (list), POST (create)
│   └── [id]/
│       ├── route.ts               # GET (single), PATCH (update)
│       ├── fund/route.ts          # POST — lender marks as funded
│       └── cancel/route.ts        # POST — lender cancels
├── payments/
│   ├── initiate/route.ts          # POST — start a Flutterwave payment
│   └── verify/route.ts            # GET — manual verify by transaction ref
├── notifications/
│   └── route.ts                   # GET (list), PATCH (mark read)
├── profile/
│   └── route.ts                   # GET, PATCH
└── webhooks/
    └── flutterwave/route.ts       # POST — Flutterwave webhook (no auth)
```

---

## The Anatomy of Every Route

Every route file follows this exact structure. No exceptions.

```ts
// app/api/pledges/route.ts

import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CreatePledgeSchema } from '@/lib/validations/pledge'
import { createPledge, getUserPledges } from '@/lib/pledges'
import { ZodError } from 'zod'

// ─── GET ───────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // 1. Auth check
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return Response.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // 2. Parse query params if needed
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? undefined

  // 3. Delegate to lib — no business logic in the route
  try {
    const pledges = await getUserPledges(session.user.id, { status })
    return Response.json(pledges)
  } catch (error) {
    console.error('[GET /api/pledges]', error)
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

// ─── POST ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Auth check
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return Response.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // 2. Parse and validate body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // 3. Zod validation
  try {
    const validated = CreatePledgeSchema.parse(body)

    // 4. Delegate to lib
    const pledge = await createPledge(validated, session.user.id)

    return Response.json(pledge, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('[POST /api/pledges]', error)
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
```

---

## The Five Steps — In Order, Always

Every route handler must follow these five steps in this exact order.
Skip any step and you've broken the pattern.

### Step 1 — Auth Check
```ts
const session = await getServerSession(authOptions)
if (!session?.user) {
  return Response.json({ error: 'Unauthorised' }, { status: 401 })
}
```
**Exception:** Webhook routes and public pledge view skip this step.
They have their own verification (Flutterwave signature, token-based respectively).

### Step 2 — Parse Input
For request bodies:
```ts
let body: unknown
try {
  body = await req.json()
} catch {
  return Response.json({ error: 'Invalid request body' }, { status: 400 })
}
```
For query params:
```ts
const { searchParams } = new URL(req.url)
const status = searchParams.get('status') ?? undefined
```
For dynamic segments:
```ts
// app/api/pledges/[id]/route.ts
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
```

### Step 3 — Validate with Zod
```ts
const validated = SomeSchema.parse(body)
// ZodError is caught in the outer try/catch
```
Zod schemas live in `lib/validations/`. Import them. Never define inline.

### Step 4 — Authorisation (ownership check)
After auth, check the user is allowed to act on this specific resource.
```ts
const pledge = await prisma.pledge.findUnique({ where: { id: params.id } })
if (!pledge) {
  return Response.json({ error: 'Not found' }, { status: 404 })
}
if (pledge.lenderId !== session.user.id && pledge.borrowerId !== session.user.id) {
  return Response.json({ error: 'Forbidden' }, { status: 403 })
}
```
Never skip this on resource-specific routes.

### Step 5 — Delegate to lib
```ts
const result = await someLibFunction(validated, session.user.id)
return Response.json(result, { status: 201 })
```
Zero business logic in the route file. It receives, validates, checks, delegates, responds.

---

## HTTP Status Code Guide

| Situation                          | Status |
|------------------------------------|--------|
| Successful GET or PATCH            | 200    |
| Successful POST (created)          | 201    |
| Successful action (no body)        | 204    |
| Validation failed (Zod)            | 400    |
| Not authenticated (no session)     | 401    |
| Authenticated but not authorised   | 403    |
| Resource not found                 | 404    |
| Conflict (duplicate, wrong status) | 409    |
| Server error                       | 500    |

---

## Webhook Route Pattern (Special Case)

The Flutterwave webhook route bypasses session auth and uses signature
verification instead. It follows its own pattern — see Security.md for the
full implementation. Key differences:

- No `getServerSession` call
- First line after parsing body is `verifyFlutterwaveWebhook()`
- Returns 200 immediately after idempotency check if already processed
- Always returns 200 to Flutterwave even on processing errors (to prevent retries
  from unhandled non-200 responses) — log the error internally instead

---

## Public Route Pattern (Pledge View)

The pledge acceptance page is public — borrowers view it before they have an account.
The route is protected by the pledge token, not a session.

```ts
// app/api/pledges/public/[token]/route.ts
export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const pledge = await prisma.pledge.findUnique({
    where: { shareToken: params.token },
    select: {
      // Only return fields needed for the acceptance page
      // NEVER return lender bank details here
      id: true,
      amount: true,
      purpose: true,
      dueDate: true,
      status: true,
      lender: { select: { fullName: true } },
    },
  })

  if (!pledge || pledge.status === 'CANCELLED' || pledge.status === 'EXPIRED') {
    return Response.json(
      { error: 'This pledge is no longer available.' },
      { status: 404 }
    )
  }

  return Response.json(pledge)
}
```

---

## Error Response Shape

All error responses follow the same shape:

```ts
// Validation error
{ error: 'Validation failed', details: ZodError.errors }

// Auth error
{ error: 'Unauthorised' }

// Forbidden
{ error: 'Forbidden' }

// Not found
{ error: 'Not found' }

// Business logic conflict
{ error: 'Pledge is not in a state that allows this action.' }

// Server error (generic — never expose internals)
{ error: 'Something went wrong. Please try again.' }
```

---

## Checklist Before Submitting a New Route

- [ ] Session check is the first thing that runs (unless public/webhook route)
- [ ] Input is validated with a Zod schema from `lib/validations/`
- [ ] Ownership/authorisation is checked for resource-specific routes
- [ ] All business logic is in `lib/`, not in the route
- [ ] Zod errors return 400, not 500
- [ ] Server errors are logged with `console.error('[METHOD /path]', error)`
- [ ] Error messages never expose internal details or stack traces
- [ ] Bank details are never returned in any response unless it's the authenticated
      owner's own profile
- [ ] New route is added to the route map at the top of this file
