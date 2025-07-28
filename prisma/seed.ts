import csvParser from "csv-parser";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { createReadStream } from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function main() {
  const game = await prisma.games.create({
    data: {
      name: "Hedda 30",
      maxGuesses: 3,
      description: "Noe du sent vil glemme",
    },
  });
  const destroyers = await prisma.teams.create({
    data: {
      name: "De uskyldige",
      gamesId: game.id,
    },
  });

  const patent = await prisma.teams.create({
    data: {
      name: "De grådige",
      gamesId: game.id,
    },
  });

  const teite = await prisma.teams.create({
    data: {
      name: "De destruktive",
      gamesId: game.id,
    },
  });

  const sellers = await prisma.teams.create({
    data: {
      name: "De tvilsomme",
      gamesId: game.id,
    },
  });
  const csvPath = path.join(process.cwd(), "data", "aliases.csv");
  const aliases: AliasCSV[] = [];

  // Read CSV
  await new Promise((resolve, reject) => {
    createReadStream(csvPath)
      .pipe(
        csvParser({
          separator: ";",
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
      console.log(JSON.stringify(row, null, 2));
      await prisma.alias.create({
        data: {
          name: row.FullName,
          description: row.publicDescription || "",
          hiddenDescription: row.secretDescription || null,
          teamsId: parseInt(row.teamsId, 10),
        },
      });
    } catch (error) {
      console.error(`❌ Error creating alias ${row.FullName}:`, error);
    }
  }

  const hint = await prisma.codes.create({
    data: {
      code: "1234",
      hint: "Det er bak dører som ikke bare er dører og under, men samtidig oppi",
      assignment: "Svaret er 1234",
    },
  });
  const hint2 = await prisma.codes.create({
    data: {
      code: "1234",
      hint: "Det er bak dører som ikke bare er dører og under, men samtidig oppi",
      assignment: "Svaret er 1234",
    },
  });
  const hint3 = await prisma.codes.create({
    data: {
      code: "1234",
      hint: "Det er bak dører som ikke bare er dører og under, men samtidig oppi",
      assignment: "Svaret er 1234",
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
