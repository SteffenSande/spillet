import { createReadStream } from "fs";
import path from "path";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { parse } from "fast-csv";

const prisma = new PrismaClient();

export async function main() {
  const game = await prisma.games.create({
    data: {
      name: "Leon 11",
      maxGuesses: 1,
      description: "Noe du sent vil glemme",
    },
  });
  const teite = await prisma.teams.create({
    data: {
      name: "Returnere",
      gamesId: game.id,
    },
  });

  const copier = await prisma.teams.create({
    data: {
      name: "Lage kopier",
      gamesId: game.id,
    },
  });

  const patent = await prisma.teams.create({
    data: {
      name: "Bevise forfalskning",
      gamesId: game.id,
    },
  });

  const destroyer = await prisma.teams.create({
    data: {
      name: "Ødelegger",
      gamesId: game.id,
    },
  });
  const csvPath = path.join(process.cwd(), "data", "updatedAlias.csv");
  const aliases: AliasCSVLeon[] = [];

  // Read CSV
  await new Promise((resolve, reject) => {
    createReadStream(csvPath)
      .pipe(
        parse<AliasCSVLeon, AliasCSVLeon>({
          headers: true,
          delimiter: ";",
          quote: '"',
          ignoreEmpty: true,
        })
      )
      .on("data", (row) => {
        aliases.push(row);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  // Seed data
  for (const row of aliases) {
    try {
      await prisma.alias.create({
        data: {
          externalId: row.externalId,
          description: row.description,
          name: row.name,
          hiddenDescription: row.hiddenDescription,
          teamsId: parseInt(row.teamsId, 10),
        },
      });
    } catch (error) {
      console.error(`❌ Error creating alias ${row.name}:`, error);
    }
  }

  const csvPathHints = path.join(process.cwd(), "data", "updatedCodes.csv");
  const hints: Hint[] = [];
  // Read CSV
  await new Promise((resolve, reject) => {
    createReadStream(csvPathHints)
      .pipe(
        parse<Hint, Hint>({
          headers: true,
          delimiter: ";",
          quote: '"',
          escape: '"',
          ignoreEmpty: true,
          trim: true,
        })
      )
      .on("data", (row) => hints.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  const hintsFiltered = hints.filter((hint) => hint.assignment);

  // Seed data
  for (const row of hintsFiltered) {
    try {
      await prisma.codes.create({
        data: {
          code: row.code,
          hint: row.hint,
          assignment: row.assignment,
          externalId: row.externalId,
        },
      });
    } catch (error) {
      console.error(`❌ Error creating alias ${row.assignment}:`, error);
    }
  }

  const csvPathFinalQuestion = path.join(
    process.cwd(),
    "data",
    "updatedFinalQuestion.csv"
  );
  const finalQuestions: FinalQuesiton[] = [];
  // Read CSV
  await new Promise((resolve, reject) => {
    createReadStream(csvPathFinalQuestion)
      .pipe(
        parse<FinalQuesiton, FinalQuesiton>({
          headers: true,
          delimiter: ";",
          quote: '"',
          escape: '"',
          ignoreEmpty: true,
          trim: true,
        })
      )
      .on("data", (row) => hints.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  const finalQuestionsFiltered = finalQuestions.filter(
    (question) => question.assignment
  );

  // Seed data
  for (const row of finalQuestionsFiltered) {
    try {
      await prisma.finalQuestion.create({
        data: {
          code: row.code,
          assignment: row.assignment,
          externalId: row.externalId,
        },
      });
    } catch (error) {
      console.error(`❌ Error creating alias ${row.assignment}:`, error);
    }
  }
}
main();

export interface AliasCSV {
  id: string;
  sortId: string;
  teamsId: string;
  teamsName: string;
  title: string;
  firstName: string;
  nickName: string;
  LastName: string;
  Initials: string;
  FullName: string;
  kjønn: string;
  publicDescription: string;
  secretDescription: string;
}
export interface AliasCSVLeon {
  id: number;
  externalId: string;
  name: string;
  description: string;
  hiddenDescription: string;
  teamsId: string;
  alive: boolean;
}

interface Hint {
  id: number;
  code: string;
  externalId: string;
  hint: string;
  assignment: string;
}

interface FinalQuesiton {
  id: number;
  code: string;
  externalId: string;
  assignment: string;
}
