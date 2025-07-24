/*
  Warnings:

  - You are about to drop the column `externalId` on the `CodesGuess` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[externalId]` on the table `Codes` will be added. If there are existing duplicate values, this will fail.
  - The required column `externalId` was added to the `Codes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "CodesGuess_externalId_key";

-- AlterTable
ALTER TABLE "Codes" ADD COLUMN     "externalId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CodesGuess" DROP COLUMN "externalId";

-- CreateIndex
CREATE UNIQUE INDEX "Codes_externalId_key" ON "Codes"("externalId");
