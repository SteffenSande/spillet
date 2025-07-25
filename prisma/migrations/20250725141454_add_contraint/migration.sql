/*
  Warnings:

  - A unique constraint covering the columns `[aliasId,codesId]` on the table `CodeFound` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CodeFound_aliasId_codesId_key" ON "CodeFound"("aliasId", "codesId");
