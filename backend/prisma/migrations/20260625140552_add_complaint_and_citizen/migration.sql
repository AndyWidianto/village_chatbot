-- CreateEnum
CREATE TYPE "ChatPlatform" AS ENUM ('WHATSAPP', 'TELEGRAM', 'WEB_CHAT');

-- CreateEnum
CREATE TYPE "ComplaintCategory" AS ENUM ('INFRASTRUCTURE', 'ADMINISTRATION', 'SECURITY', 'SOCIAL_ASSISTANCE', 'HEALTH', 'OTHERS');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Citizen" (
    "id" TEXT NOT NULL,
    "nik" TEXT,
    "fullName" TEXT,
    "platformId" TEXT NOT NULL,
    "platform" "ChatPlatform" NOT NULL,
    "subDistrict" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Citizen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ComplaintCategory" NOT NULL,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'PENDING',
    "attachmentUrl" TEXT,
    "officerNotes" TEXT,
    "citizenId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Citizen_nik_key" ON "Citizen"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "Citizen_platformId_key" ON "Citizen"("platformId");

-- CreateIndex
CREATE INDEX "Citizen_platformId_idx" ON "Citizen"("platformId");

-- CreateIndex
CREATE UNIQUE INDEX "Complaint_ticketNumber_key" ON "Complaint"("ticketNumber");

-- CreateIndex
CREATE INDEX "Complaint_ticketNumber_idx" ON "Complaint"("ticketNumber");

-- CreateIndex
CREATE INDEX "Complaint_status_idx" ON "Complaint"("status");

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "Citizen"("id") ON DELETE CASCADE ON UPDATE CASCADE;
