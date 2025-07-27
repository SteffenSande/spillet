/*
  Warnings:

  - Made the column `description` on table `Alias` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `games` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `teams` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Alias" ADD COLUMN     "alive" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT '';

-- AlterTable
ALTER TABLE "games" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT '';

-- AlterTable
ALTER TABLE "teams" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT '';
