-- CreateTable
CREATE TABLE "public"."FinalQuestion" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "isCorrect" BOOLEAN NOT NULL,
    "code" TEXT NOT NULL,
    "assignment" TEXT NOT NULL,

    CONSTRAINT "FinalQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FinalQuestionGuess" (
    "id" SERIAL NOT NULL,
    "aliasId" INTEGER NOT NULL,
    "finalQuestionId" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "FinalQuestionGuess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."FinalQuestionGuess" ADD CONSTRAINT "FinalQuestionGuess_aliasId_fkey" FOREIGN KEY ("aliasId") REFERENCES "public"."Alias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FinalQuestionGuess" ADD CONSTRAINT "FinalQuestionGuess_finalQuestionId_fkey" FOREIGN KEY ("finalQuestionId") REFERENCES "public"."FinalQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
