/*
  Warnings:

  - Added the required column `isCorrect` to the `CodesGuess` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CodesGuess" ADD COLUMN     "isCorrect" BOOLEAN NOT NULL;
