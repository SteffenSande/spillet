-- AlterTable
ALTER TABLE "CodesGuess" ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "CodeFound" (
    "id" SERIAL NOT NULL,
    "codesId" INTEGER NOT NULL,
    "aliasId" INTEGER NOT NULL,

    CONSTRAINT "CodeFound_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CodeFound" ADD CONSTRAINT "CodeFound_codesId_fkey" FOREIGN KEY ("codesId") REFERENCES "Codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeFound" ADD CONSTRAINT "CodeFound_aliasId_fkey" FOREIGN KEY ("aliasId") REFERENCES "Alias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
