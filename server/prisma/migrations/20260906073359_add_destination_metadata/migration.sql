-- CreateEnum
CREATE TYPE "DestinationCategory" AS ENUM ('BEACH', 'MOUNTAIN', 'HERITAGE', 'WILDLIFE', 'HILL_STATION', 'BACKWATERS');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentStatus" ADD VALUE 'PENDING_REFUND';
ALTER TYPE "PaymentStatus" ADD VALUE 'REFUNDED';
ALTER TYPE "PaymentStatus" ADD VALUE 'REFUND_FAILED';
ALTER TYPE "PaymentStatus" ADD VALUE 'NOT_REFUNDED';

-- AlterTable
ALTER TABLE "Destination" ADD COLUMN     "amenities" TEXT[],
ADD COLUMN     "category" "DestinationCategory" NOT NULL DEFAULT 'HERITAGE',
ADD COLUMN     "location" TEXT NOT NULL DEFAULT 'India',
ADD COLUMN     "originalPrice" DOUBLE PRECISION,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.5;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "gatewayPaymentId" TEXT,
ADD COLUMN     "refundCompletedAt" TIMESTAMP(3),
ADD COLUMN     "refundId" TEXT,
ADD COLUMN     "refundInitiatedAt" TIMESTAMP(3),
ADD COLUMN     "refundedAmount" INTEGER;
