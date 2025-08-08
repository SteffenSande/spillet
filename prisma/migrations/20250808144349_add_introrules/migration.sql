/*
  Warnings:

  - You are about to drop the column `description` on the `games` table. All the data in the column will be lost.
  - Added the required column `intro` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rules` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."games" DROP COLUMN "description",
ADD COLUMN     "intro" TEXT NOT NULL,
ADD COLUMN     "rules" TEXT NOT NULL;
