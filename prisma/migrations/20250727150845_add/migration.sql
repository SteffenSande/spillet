/*
  Warnings:

  - Added the required column `teamsId` to the `AliasGuesses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AliasGuesses" ADD COLUMN     "teamsId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "AliasGuesses" ADD CONSTRAINT "AliasGuesses_teamsId_fkey" FOREIGN KEY ("teamsId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
