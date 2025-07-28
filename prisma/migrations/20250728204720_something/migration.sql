/*
  Warnings:

  - You are about to drop the column `aliasId` on the `AliasGuesses` table. All the data in the column will be lost.
  - Added the required column `guessId` to the `AliasGuesses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AliasGuesses" DROP CONSTRAINT "AliasGuesses_aliasId_fkey";

-- AlterTable
ALTER TABLE "AliasGuesses" DROP COLUMN "aliasId",
ADD COLUMN     "guessId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "AliasGuesses" ADD CONSTRAINT "AliasGuesses_guessId_fkey" FOREIGN KEY ("guessId") REFERENCES "Alias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
