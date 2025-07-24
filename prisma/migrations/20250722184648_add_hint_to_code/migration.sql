/*
  Warnings:

  - Added the required column `hint` to the `Codes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Codes" ADD COLUMN     "hint" TEXT NOT NULL;
