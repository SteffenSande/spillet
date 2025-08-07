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
          escape: '"',
          ignoreEmpty: true,
        })
      )
      .on("data", (row) => {
        aliases.push(row);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  const aliasFiltered = aliases.filter((alias) => !!alias.hiddenDescription);

  // Seed data
  for (const row of aliasFiltered) {
    try {
      await prisma.alias.create({
        data: {
          ...row,
          // name: row.kallenavn
          //   ? `${row.fornavn} ${row.kallenavn} ${row.etternavn}`
          //   : `${row.fornavn} ${row.etternavn}`,
          // description: row["offentlig beskrivelse"] || "",
          // hiddenDescription: row["hemmelig beskrivelse "] || null,
          // teamsId: parseInt(row.lag, 10),
        },
      });
    } catch (error) {
      console.error(`❌ Error creating alias ${row.name}:`, error);
    }
  }

  const csvPathHints = path.join(process.cwd(), "data", "hints.csv");
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

  const hintsFiltered = hints.filter((hint) => !!hint["oppgave"]);

  // Seed data
  for (const row of hintsFiltered) {
    console.log(row);
    try {
      await prisma.codes.create({
        data: {
          code: row["løsning"].toLowerCase(),
          hint: row.hint,
          assignment: row["oppgave"],
        },
      });
    } catch (error) {
      console.error(`❌ Error creating alias ${row.oppgave}:`, error);
    }
  }
  await prisma.finalQuestion.create({
    data: {
      assignment:
        "Du har funnet saven med Athenas Øye, har du nok hint til å finne koden?",
      code: "a3o5",
    },
  });
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
  teamsId: number;
  alive: boolean;
}

interface Hint {
  oppgave: string;
  løsning: string;
  hint: string;
}
