/*
  Warnings:

  - You are about to drop the column `extraInformation` on the `games` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."games" DROP COLUMN "extraInformation";

-- CreateTable
CREATE TABLE "public"."extraInformation" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "gamesId" INTEGER,

    CONSTRAINT "extraInformation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."extraInformation" ADD CONSTRAINT "extraInformation_gamesId_fkey" FOREIGN KEY ("gamesId") REFERENCES "public"."games"("id") ON DELETE SET NULL ON UPDATE CASCADE;
