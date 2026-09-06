/*
  Warnings:

  - A unique constraint covering the columns `[activeSlotKey]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'EXPIRED';

-- DropIndex
DROP INDEX "Booking_destinationId_date_slot_key";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "activeSlotKey" TEXT,
ADD COLUMN     "reservationExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_activeSlotKey_key" ON "Booking"("activeSlotKey");
