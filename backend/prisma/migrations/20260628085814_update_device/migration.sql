-- CreateEnum
CREATE TYPE "StatusDevice" AS ENUM ('CONNECTING', 'CONNECTED', 'DISCONNECTED');

-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "status" "StatusDevice" NOT NULL DEFAULT 'CONNECTING';

-- CreateIndex
CREATE INDEX "devices_number_instanceName_idx" ON "devices"("number", "instanceName");
