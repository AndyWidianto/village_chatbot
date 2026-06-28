/*
  Warnings:

  - A unique constraint covering the columns `[instanceName]` on the table `devices` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "devices" ALTER COLUMN "instanceName" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "devices_instanceName_key" ON "devices"("instanceName");
