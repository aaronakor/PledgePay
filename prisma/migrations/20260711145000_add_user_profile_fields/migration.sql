-- AlterTable
ALTER TABLE "users" ADD COLUMN     "firstLogin" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notificationPreference" TEXT,
ADD COLUMN     "onboardingStep" TEXT,
ADD COLUMN     "profileComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profilePhoto" TEXT;
