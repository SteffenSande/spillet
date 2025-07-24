-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "maxGuesses" INTEGER NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "gamesId" INTEGER NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alias" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "teamsId" INTEGER NOT NULL,

    CONSTRAINT "Alias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AliasGuesses" (
    "id" SERIAL NOT NULL,
    "aliasId" INTEGER NOT NULL,
    "guesserId" INTEGER NOT NULL,

    CONSTRAINT "AliasGuesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Codes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodesGuess" (
    "id" SERIAL NOT NULL,
    "codesId" INTEGER NOT NULL,
    "aliasId" INTEGER NOT NULL,
    "aliasGuessId" INTEGER,

    CONSTRAINT "CodesGuess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_gamesId_fkey" FOREIGN KEY ("gamesId") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alias" ADD CONSTRAINT "Alias_teamsId_fkey" FOREIGN KEY ("teamsId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AliasGuesses" ADD CONSTRAINT "AliasGuesses_aliasId_fkey" FOREIGN KEY ("aliasId") REFERENCES "Alias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AliasGuesses" ADD CONSTRAINT "AliasGuesses_guesserId_fkey" FOREIGN KEY ("guesserId") REFERENCES "Alias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodesGuess" ADD CONSTRAINT "CodesGuess_codesId_fkey" FOREIGN KEY ("codesId") REFERENCES "Codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodesGuess" ADD CONSTRAINT "CodesGuess_aliasId_fkey" FOREIGN KEY ("aliasId") REFERENCES "Alias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
