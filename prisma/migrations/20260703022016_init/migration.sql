-- CreateEnum
CREATE TYPE "PledgeStatus" AS ENUM ('PENDING_ACCEPTANCE', 'AWAITING_FUNDING', 'ACTIVE', 'OVERDUE', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ReminderPreference" AS ENUM ('LIGHT', 'STANDARD', 'STRICT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESSFUL', 'FAILED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('PLEDGE_RECEIVED', 'PLEDGE_ACCEPTED', 'FUNDING_CONFIRMED', 'REMINDER', 'PAYMENT_RECEIVED', 'PLEDGE_COMPLETED', 'PLEDGE_OVERDUE');

-- CreateEnum
CREATE TYPE "ActivityEventType" AS ENUM ('PLEDGE_CREATED', 'PLEDGE_ACCEPTED', 'FUNDING_CONFIRMED', 'REMINDER_SENT', 'PAYMENT_RECEIVED', 'PLEDGE_COMPLETED', 'PLEDGE_OVERDUE', 'PLEDGE_CANCELLED', 'PLEDGE_EXPIRED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "accountName" TEXT,
    "reputationScore" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pledges" (
    "id" TEXT NOT NULL,
    "shareToken" TEXT NOT NULL,
    "lenderId" TEXT NOT NULL,
    "borrowerId" TEXT,
    "borrowerName" TEXT NOT NULL,
    "borrowerEmail" TEXT NOT NULL,
    "borrowerPhone" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "outstandingBalance" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "PledgeStatus" NOT NULL DEFAULT 'PENDING_ACCEPTANCE',
    "reminderPreference" "ReminderPreference" NOT NULL DEFAULT 'STANDARD',
    "proofOfFundingUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "fundedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pledges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "pledgeId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "flutterwaveTransactionId" TEXT NOT NULL,
    "flutterwaveRef" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "pledgeId" TEXT NOT NULL,
    "actorId" TEXT,
    "eventType" "ActivityEventType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "pledges_shareToken_key" ON "pledges"("shareToken");

-- CreateIndex
CREATE INDEX "pledges_lenderId_idx" ON "pledges"("lenderId");

-- CreateIndex
CREATE INDEX "pledges_borrowerId_idx" ON "pledges"("borrowerId");

-- CreateIndex
CREATE INDEX "pledges_status_idx" ON "pledges"("status");

-- CreateIndex
CREATE INDEX "pledges_shareToken_idx" ON "pledges"("shareToken");

-- CreateIndex
CREATE UNIQUE INDEX "payments_flutterwaveTransactionId_key" ON "payments"("flutterwaveTransactionId");

-- CreateIndex
CREATE INDEX "payments_pledgeId_idx" ON "payments"("pledgeId");

-- CreateIndex
CREATE INDEX "payments_flutterwaveTransactionId_idx" ON "payments"("flutterwaveTransactionId");

-- CreateIndex
CREATE INDEX "notifications_userId_read_idx" ON "notifications"("userId", "read");

-- CreateIndex
CREATE INDEX "activities_pledgeId_idx" ON "activities"("pledgeId");

-- AddForeignKey
ALTER TABLE "pledges" ADD CONSTRAINT "pledges_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pledges" ADD CONSTRAINT "pledges_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_pledgeId_fkey" FOREIGN KEY ("pledgeId") REFERENCES "pledges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_pledgeId_fkey" FOREIGN KEY ("pledgeId") REFERENCES "pledges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
