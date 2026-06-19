# PledgePay — DB Migration

## Purpose

This skill defines how to create, run, and reason about every database change
in PledgePay. Prisma is the only way we touch the database. No raw SQL except
in documented edge cases. No schema changes without a migration. No migration
without reading this file first.

---

## The Golden Rules

1. **Never edit the database directly.** All changes go through Prisma migrations.
2. **Never modify an existing migration file.** Create a new one.
3. **Never run `prisma db push` in production.** Use `prisma migrate deploy`.
4. **Always review the generated SQL before applying.** Understand what Prisma
   will do before it does it.
5. **Destructive changes (drop column, rename) need extra caution.** See the
   Destructive Changes section below.

---

## The Full Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // Supabase connection string (Project Settings → Database → URI)
}

// ─── ENUMS ────────────────────────────────────────────────────────────────────

enum PledgeStatus {
  PENDING_ACCEPTANCE
  AWAITING_FUNDING
  ACTIVE
  OVERDUE
  COMPLETED
  CANCELLED
  EXPIRED
}

enum ReminderPreference {
  LIGHT
  STANDARD
  STRICT
}

enum PaymentStatus {
  PENDING
  SUCCESSFUL
  FAILED
}

enum NotificationType {
  PLEDGE_RECEIVED
  PLEDGE_ACCEPTED
  FUNDING_CONFIRMED
  REMINDER
  PAYMENT_RECEIVED
  PLEDGE_COMPLETED
  PLEDGE_OVERDUE
}

enum ActivityEventType {
  PLEDGE_CREATED
  PLEDGE_ACCEPTED
  FUNDING_CONFIRMED
  REMINDER_SENT
  PAYMENT_RECEIVED
  PLEDGE_COMPLETED
  PLEDGE_OVERDUE
  PLEDGE_CANCELLED
  PLEDGE_EXPIRED
}

// ─── MODELS ───────────────────────────────────────────────────────────────────

model User {
  id              String   @id @default(cuid())
  fullName        String
  email           String   @unique
  phoneNumber     String   @unique
  passwordHash    String
  bankName        String?
  accountNumber   String?
  accountName     String?
  reputationScore Int      @default(50)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  pledgesAsLender   Pledge[] @relation("LenderPledges")
  pledgesAsBorrower Pledge[] @relation("BorrowerPledges")
  notifications     Notification[]
  activities        Activity[]

  @@map("users")
}

model Pledge {
  id                  String             @id @default(cuid())
  shareToken          String             @unique @default(cuid())
  lenderId            String
  borrowerId          String?
  borrowerName        String
  borrowerEmail       String
  borrowerPhone       String
  amount              Int                // Stored in kobo (smallest unit)
  outstandingBalance  Int                // Stored in kobo
  purpose             String
  dueDate             DateTime
  status              PledgeStatus       @default(PENDING_ACCEPTANCE)
  reminderPreference  ReminderPreference @default(STANDARD)
  proofOfFundingUrl   String?
  createdAt           DateTime           @default(now())
  acceptedAt          DateTime?
  fundedAt            DateTime?
  completedAt         DateTime?
  updatedAt           DateTime           @updatedAt

  lender    User    @relation("LenderPledges",  fields: [lenderId],   references: [id])
  borrower  User?   @relation("BorrowerPledges", fields: [borrowerId], references: [id])
  payments  Payment[]
  activities Activity[]

  @@index([lenderId])
  @@index([borrowerId])
  @@index([status])
  @@index([shareToken])
  @@map("pledges")
}

model Payment {
  id                      String        @id @default(cuid())
  pledgeId                String
  amount                  Int           // Stored in kobo
  flutterwaveTransactionId String       @unique  // Idempotency key
  flutterwaveRef          String?
  status                  PaymentStatus @default(PENDING)
  paidAt                  DateTime?
  createdAt               DateTime      @default(now())

  pledge Pledge @relation(fields: [pledgeId], references: [id])

  @@index([pledgeId])
  @@index([flutterwaveTransactionId])
  @@map("payments")
}

model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  message   String
  read      Boolean          @default(false)
  createdAt DateTime         @default(now())

  user User @relation(fields: [userId], references: [id])

  @@index([userId, read])
  @@map("notifications")
}

model Activity {
  id        String            @id @default(cuid())
  pledgeId  String
  actorId   String?
  eventType ActivityEventType
  metadata  Json?
  createdAt DateTime          @default(now())

  pledge Pledge @relation(fields: [pledgeId], references: [id])
  actor  User?  @relation(fields: [actorId], references: [id])

  @@index([pledgeId])
  @@map("activities")
}
```

---

## Important Schema Decisions

**Amounts are stored in kobo (smallest unit), not naira.**
₦10,000 is stored as `1000000`. This avoids floating point issues entirely.
All formatting to naira happens at display time in `lib/format.ts`.

**`shareToken` is separate from `id`.**
The pledge `id` is an internal cuid. The `shareToken` is what goes in the
public URL (`/pledge/{shareToken}`). They are independent. This means we can
rotate tokens without changing the pledge's internal ID.

**`borrowerId` is nullable.**
When a lender creates a pledge, the borrower hasn't signed up yet. The borrower
details (`borrowerName`, `borrowerEmail`, `borrowerPhone`) are stored as
strings on the pledge. `borrowerId` is only set after the borrower creates an
account and accepts the pledge.

**`outstandingBalance` is a field on the pledge.**
We don't compute it dynamically from payments each time. We decrement it
each time a SUCCESSFUL payment is processed. This is authoritative for status
displays. Always update it in the same transaction as the payment update.

---

## Migration Workflow

### Development (local)

```bash
# 1. Edit prisma/schema.prisma
# 2. Create and apply migration
npx prisma migrate dev --name describe_the_change

# Examples of good migration names:
# --name add_share_token_to_pledges
# --name add_reminder_preference_enum
# --name add_outstanding_balance_to_pledges
# --name add_activity_metadata_column

# 3. Regenerate the Prisma client (usually automatic with migrate dev)
npx prisma generate

# 4. Inspect what SQL was generated
cat prisma/migrations/[timestamp]_describe_the_change/migration.sql
```

### Production (Vercel)

Migrations run automatically on deploy via the build command:
```json
// package.json
"scripts": {
  "build": "prisma generate && prisma migrate deploy && next build"
}
```

`migrate deploy` applies pending migrations in order without prompts.
It never creates new migrations — only applies existing ones.

---

## Common Migration Patterns

### Add a nullable column (safe)
```prisma
model Pledge {
  // ... existing fields
  cancelledReason String?   // New nullable field — safe to add
}
```
```bash
npx prisma migrate dev --name add_cancelled_reason_to_pledges
```

### Add a non-nullable column with a default (safe)
```prisma
model Pledge {
  remindersSentCount Int @default(0)   // Default handles existing rows
}
```

### Add a new enum value (careful)
Adding values to an existing enum is generally safe in PostgreSQL.
```prisma
enum PledgeStatus {
  // ... existing values
  DISPUTED   // New value
}
```
After running the migration, also update:
- `PledgeStatus` TypeScript type in `types/index.ts`
- `statusConfig` in `StatusBadge.tsx`
- Any switch/if statements that handle all pledge statuses

### Add an index (safe)
```prisma
model Pledge {
  dueDate DateTime

  @@index([dueDate])   // New index for the cron job query
}
```

---

## Destructive Change Protocol

Destructive changes = dropping columns, renaming columns, changing column types.
These can cause data loss. Follow this three-step process:

### Renaming a column (example: `amount` → `amountKobo`)

**Step 1 — Add new column alongside old one**
```prisma
amount      Int   // Keep the old column
amountKobo  Int   @default(0)  // Add the new column
```
```bash
npx prisma migrate dev --name add_amount_kobo_to_pledges
```

**Step 2 — Backfill data**
```ts
// Run this as a one-off script
await prisma.$executeRaw`
  UPDATE pledges SET "amountKobo" = amount * 100
`
```

**Step 3 — Remove old column (separate migration, after deploy + verify)**
```prisma
// Remove 'amount' field from schema
amountKobo  Int
```
```bash
npx prisma migrate dev --name remove_amount_from_pledges
```

Never rename and deploy in one step. Always expand → migrate → contract.

---

## Seeding (Development Only)

```ts
// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create two test users
  const lender = await prisma.user.upsert({
    where: { email: 'lender@test.com' },
    update: {},
    create: {
      fullName: 'Emeka Okafor',
      email: 'lender@test.com',
      phoneNumber: '08012345678',
      passwordHash: await bcrypt.hash('password123', 12),
      bankName: 'GTBank',
      accountNumber: '0123456789',
      accountName: 'EMEKA OKAFOR',
      reputationScore: 75,
    },
  })

  const borrower = await prisma.user.upsert({
    where: { email: 'borrower@test.com' },
    update: {},
    create: {
      fullName: 'Chidi Nwosu',
      email: 'borrower@test.com',
      phoneNumber: '08098765432',
      passwordHash: await bcrypt.hash('password123', 12),
      reputationScore: 50,
    },
  })

  // Create a test active pledge
  await prisma.pledge.upsert({
    where: { shareToken: 'test-token-active' },
    update: {},
    create: {
      shareToken: 'test-token-active',
      lenderId: lender.id,
      borrowerId: borrower.id,
      borrowerName: 'Chidi Nwosu',
      borrowerEmail: 'borrower@test.com',
      borrowerPhone: '08098765432',
      amount: 10000000,           // ₦100,000 in kobo
      outstandingBalance: 8000000, // ₦80,000 in kobo (partial repayment)
      purpose: 'Business stock',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      status: 'ACTIVE',
      reminderPreference: 'STANDARD',
      acceptedAt: new Date(),
      fundedAt: new Date(),
    },
  })

  console.log('Seed complete.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
```

```bash
# Run the seed
npx prisma db seed
```

```json
// package.json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

---

## Useful Prisma Commands

```bash
# View current database state in Prisma Studio (visual UI)
npx prisma studio

# Check if schema and DB are in sync (no migration)
npx prisma migrate status

# Reset the database and re-run all migrations (dev only — DESTROYS DATA)
npx prisma migrate reset

# Pull DB schema into Prisma schema (only if you've made raw DB changes — avoid)
npx prisma db pull

# Generate Prisma client after schema change
npx prisma generate

# Format the schema file
npx prisma format
```

---

## Migration Checklist

- [ ] Migration name is descriptive (`add_X_to_Y`, `remove_X_from_Y`, not `update1`)
- [ ] Generated SQL reviewed before applying — no surprises
- [ ] Non-nullable columns have a default or are nullable
- [ ] Destructive changes use the expand → migrate → contract pattern
- [ ] New enum values are reflected in TypeScript types and all switch statements
- [ ] New indexes added for any column used in `WHERE` clauses in cron or API queries
- [ ] Seed file updated if new required fields were added
- [ ] `prisma generate` has run so the client reflects the new schema
- [ ] `migrate status` is clean before pushing to production
