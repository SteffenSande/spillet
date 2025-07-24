/*
  Warnings:

  - Made the column `assignment` on table `Codes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Codes" ALTER COLUMN "assignment" SET NOT NULL;
