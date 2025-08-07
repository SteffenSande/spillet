/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `FinalQuestion` will be added. If there are existing duplicate values, this will fail.
  - The required column `externalId` was added to the `FinalQuestion` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "public"."FinalQuestion" ADD COLUMN     "externalId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FinalQuestion_externalId_key" ON "public"."FinalQuestion"("externalId");
