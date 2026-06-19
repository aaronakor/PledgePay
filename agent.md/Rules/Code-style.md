# PledgePay — Code Style

## Philosophy

Write code that a tired developer can read at 11pm without confusion.
Clarity beats cleverness. Consistency beats personal preference.
Every file in this codebase should feel like it was written by the same person.

---

## Language

- **TypeScript strict mode** is non-negotiable. No `any`. No `// @ts-ignore`.
- If you don't know the type, figure it out. Don't escape the type system.
- All shared types live in `types/index.ts`. Don't scatter type definitions.

---

## Naming Conventions

### Files and Folders
- Components: `PascalCase.tsx` → `PledgeCard.tsx`
- Utilities/lib: `kebab-case.ts` → `reputation-score.ts`
- API routes: Next.js convention → `app/api/pledges/route.ts`
- Hooks: `use` prefix → `usePledge.ts`

### Variables and Functions
```ts
// Variables: camelCase
const pledgeStatus = 'ACTIVE'

// Functions: camelCase, verb-first
function calculateReputationDelta() {}
function sendReminderEmail() {}
function verifyFlutterwaveWebhook() {}

// Constants: SCREAMING_SNAKE_CASE
const MAX_REPUTATION_SCORE = 100
const MIN_REPUTATION_SCORE = 0
const PLEDGE_EXPIRY_HOURS = 24

// Types and Interfaces: PascalCase
type PledgeStatus = 'PENDING_ACCEPTANCE' | 'AWAITING_FUNDING' | 'ACTIVE' | 'OVERDUE' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED'

interface Pledge {
  id: string
  lenderId: string
  borrowerId: string | null
  amount: number
  status: PledgeStatus
  dueDate: Date
}
```

### React Components
```tsx
// Named exports only. No default exports for components.
// Exception: Next.js page files require default exports — that's fine.

export function PledgeCard({ pledge }: PledgeCardProps) {
  return (...)
}

// Props interface always directly above the component
interface PledgeCardProps {
  pledge: Pledge
  onRepay?: () => void
}
```

---

## File Structure Rules

Each file does one thing. If a file is doing two things, split it.

```ts
// lib/reputation.ts — ONLY reputation logic
// lib/notifications.ts — ONLY notification sending
// lib/flutterwave.ts — ONLY Flutterwave API calls
// lib/pledge-status.ts — ONLY status transition logic
```

Keep API route files thin. They receive, validate, delegate, respond.
Business logic belongs in `lib/`, not in `app/api/`.

```ts
// app/api/pledges/route.ts — THIN
export async function POST(req: Request) {
  const body = await req.json()
  const validated = CreatePledgeSchema.parse(body)
  const pledge = await createPledge(validated, session.user.id)
  return Response.json(pledge, { status: 201 })
}

// lib/pledges.ts — WHERE THE LOGIC LIVES
export async function createPledge(data: CreatePledgeInput, lenderId: string) {
  // all the real work happens here
}
```

---

## Imports

Order imports: external packages → internal lib → components → types.
Leave a blank line between each group.

```ts
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { sendReminderEmail } from '@/lib/notifications'

import { PledgeCard } from '@/components/pledge/PledgeCard'
import { Button } from '@/components/ui/Button'

import type { Pledge, PledgeStatus } from '@/types'
```

Use `@/` path aliases everywhere. No relative `../../` imports.

---

## Error Handling

### API Routes
Every API route must handle errors explicitly. No unhandled promise rejections.

```ts
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validated = CreatePledgeSchema.parse(body)
    const pledge = await createPledge(validated, session.user.id)
    return Response.json(pledge, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    console.error('[POST /api/pledges]', error)
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
```

### Client Side
Use React Error Boundaries for page-level errors.
Use inline error states for form and fetch errors — never silent failures.

```tsx
// Always show the user what went wrong
{error && (
  <p className="text-error text-sm mt-1">{error}</p>
)}
```

---

## Zod Validation

Every API input is validated with Zod before touching the database.
Schemas live in `lib/validations/`.

```ts
// lib/validations/pledge.ts
import { z } from 'zod'

export const CreatePledgeSchema = z.object({
  borrowerName: z.string().min(2, 'Name must be at least 2 characters'),
  borrowerEmail: z.string().email('Enter a valid email address'),
  borrowerPhone: z.string().min(11, 'Enter a valid Nigerian phone number'),
  amount: z.number().positive('Amount must be greater than zero'),
  purpose: z.string().min(3, 'Describe the purpose of this pledge'),
  dueDate: z.string().datetime(),
  reminderPreference: z.enum(['LIGHT', 'STANDARD', 'STRICT']),
})

export type CreatePledgeInput = z.infer<typeof CreatePledgeSchema>
```

---

## Database (Prisma)

- Use Prisma's typed client everywhere. No raw SQL in MVP.
- Always select only the fields you need. No `findMany()` with zero options.
- Wrap multi-step DB operations in transactions.

```ts
// Good
const pledge = await prisma.pledge.findUnique({
  where: { id: pledgeId },
  select: {
    id: true,
    amount: true,
    status: true,
    dueDate: true,
    lender: { select: { fullName: true, email: true } },
  },
})

// Bad — fetches everything including fields you never use
const pledge = await prisma.pledge.findUnique({ where: { id: pledgeId } })
```

---

## Comments

Comment the *why*, not the *what*. The code explains what. Comments explain
why a decision was made, especially when it's non-obvious.

```ts
// Good
// Flutterwave webhooks can fire multiple times for the same transaction.
// We check for existing SUCCESSFUL payment before processing to prevent
// double-crediting the pledge balance.
const existingPayment = await prisma.payment.findUnique({
  where: { flutterwaveTransactionId: flwRef },
})

// Bad
// Find existing payment
const existingPayment = await prisma.payment.findUnique(...)
```

---

## Forbidden Patterns

```ts
// No any
const data: any = response.data  // ❌

// No non-null assertions without a comment justifying it
const user = session!.user  // ❌ (unless you just checked session is not null)

// No console.log in production paths — use structured error logging
console.log('pledge created', pledge)  // ❌ in lib/ or api/ files

// No business logic in components
function PledgeCard({ pledge }) {
  const score = pledge.amount * 0.01  // ❌ this belongs in lib/
}

// No hardcoded strings for status values — use the type
if (pledge.status === 'active')  // ❌
if (pledge.status === 'ACTIVE')  // ✅ — matches the PledgeStatus type
```

---

## Commit Messages

Use conventional commits:

```
feat: add pledge acceptance flow
fix: prevent double webhook processing for same transaction
chore: update Flutterwave SDK
refactor: extract reputation logic into lib/reputation.ts
docs: update Architecture.md with cron job details
```

---

## Environment Variables

- Never access `process.env` directly in components or pages.
- Always access env vars through a central `lib/env.ts` that validates on startup.

```ts
// lib/env.ts
export const env = {
  flutterwaveSecretKey:     process.env.FLW_SECRET_KEY!,
  flutterwaveWebhookSecret: process.env.FLW_WEBHOOK_SECRET!,
  gmailUser:                process.env.GMAIL_USER!,
  gmailAppPassword:         process.env.GMAIL_APP_PASSWORD!,
  emailFrom:                process.env.EMAIL_FROM!,
  supabaseUrl:              process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseServiceRoleKey:   process.env.SUPABASE_SERVICE_ROLE_KEY!,
  appUrl:                   process.env.NEXT_PUBLIC_APP_URL!,
}
```
