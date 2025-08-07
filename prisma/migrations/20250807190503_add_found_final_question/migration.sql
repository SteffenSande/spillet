-- CreateTable
CREATE TABLE "public"."FinalFound" (
    "id" SERIAL NOT NULL,
    "finalQuestionId" INTEGER NOT NULL,
    "aliasId" INTEGER NOT NULL,

    CONSTRAINT "FinalFound_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."FinalFound" ADD CONSTRAINT "FinalFound_finalQuestionId_fkey" FOREIGN KEY ("finalQuestionId") REFERENCES "public"."FinalQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FinalFound" ADD CONSTRAINT "FinalFound_aliasId_fkey" FOREIGN KEY ("aliasId") REFERENCES "public"."Alias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
