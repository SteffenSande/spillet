import { PrismaClient, Prisma } from "../src/generated/prisma/client.js";

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
      name: "Ødeleggerne",
      gamesId: game.id,
    },
  });

  const patent = await prisma.teams.create({
    data: {
      name: "Åpen patent",
      gamesId: game.id,
    },
  });

  const teite = await prisma.teams.create({
    data: {
      name: "Kverulantene",
      gamesId: game.id,
    },
  });

  const sellers = await prisma.teams.create({
    data: {
      name: "De griske",
      gamesId: game.id,
    },
  });

  const knute = await prisma.alias.create({
    data: {
      name: "Knutemannen",
      description: "Han kan alle knutene",
      hiddenDescription: "Han kan alle knutene",
      teamsId: destroyers.id,
    },
  });
  const damen = await prisma.alias.create({
    data: {
      name: "damen",
      description: "generisk dame",
      hiddenDescription: "generisk dame",
      teamsId: teite.id,
    },
  });

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
