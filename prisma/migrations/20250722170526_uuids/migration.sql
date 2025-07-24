/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Alias` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `CodesGuess` will be added. If there are existing duplicate values, this will fail.
  - The required column `externalId` was added to the `Alias` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `externalId` was added to the `CodesGuess` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Alias" ADD COLUMN     "externalId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CodesGuess" ADD COLUMN     "externalId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Alias_externalId_key" ON "Alias"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "CodesGuess_externalId_key" ON "CodesGuess"("externalId");
