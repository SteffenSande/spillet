import { createReadStream } from "fs";
import path from "path";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { parse } from "fast-csv";

const prisma = new PrismaClient();

export async function main() {
  const game = await prisma.games.create({
    data: {
      name: "Hedda 30",
      maxGuesses: 1,
      rules: `🛠 Praktisk informasjon
For å finne formelen må du samle hint.
Hintene er skjult bak QR-koder spredt rundt i huset. Når du finner en QR-kode, scanner du den med mobilen og kommer til en nettside med en oppgave. Løser du oppgaven riktig, får du et hint – som vil hjelpe deg i jakten på formelen.
Det finnes totalt 17 hintoppgaver, og du trenger flere av dem for å finne formelen.

❗ Regler og rammer:
• Rom som ikke er en del av spillet er tydelig merket med skilt. Gå ikke inn der.
• Du må ikke ødelegge, flytte på eller rote i huset – det du leter etter er smart plassert, ikke skjult bak bilder eller sokkelister.
• Etterlat alle rom slik du fant dem, så får alle en fair sjanse.
• Du kan samarbeide, men spør deg selv: Stoler du på dem? Kanskje dere egentlig har ulike mål.

🧩 Hemmelig informasjon
Alle har fått utdelt hemmelig informasjon.
Det kan hjelpe deg med å:
• Finne hint
• Forstå hvem du bør samarbeide med
• Avsløre gruppetilhørigheten til andre

🎯 Avsløring og eliminering
Hver spiller kan opptil tre ganger i løpet av spillet gjette hvilken gruppe en annen deltaker tilhører.
• Hvis to forskjellige spillere gjetter riktig på samme person, er den personen ute av spillet – og mister muligheten til å påvirke formelens skjebne.
• Gjetter du feil, skjer det ingenting – men du har brukt opp ett av dine tre forsøk.

🏆 Vinner
Alle gjenlevende deltakere på laget som først finner formelen er å anse som vinnere.
Det er derfor i din interesse å:
• Holde deg i live
• Finne ut hvem som er på ditt lag
• Få tak i formelen før de andre

🧠 Husk:
Den som finner formelen, bestemmer hva som skjer.
Men ingen kan vinne alene. Og ingen er trygge.`,
      intro: `🎭 Introduksjon til leken
Velkommen til fest.
Glassene er fylt, lysene er dempet, og du står midt i en forsamling av både gode venner og mildt sagt uforutsigbare bekjente. Dette er ikke en hvilken som helst bursdag. Dette er samlingspunktet for en gruppe mennesker som – på et eller annet tidspunkt – alle har bidratt til noe større.
Vertinnen (som kanskje har fått litt for mange idéer opp gjennom årene) har sammen med flere av dere utviklet noe... uvanlig. En formel. Ikke en oppskrift på kake eller cocktails – men en formel med kraft. Den kan påvirke beslutninger. Endre dynamikker. Avsløre sannheter. Eller lyve overbevisende. Alt etter hvordan den brukes.
Og her kommer problemet:
Formelen er borte.
Den er skjult et sted i huset.
Og alle vil ha den.
Men ikke alle vil det samme.
Nå begynner kappløpet.
Gjennom koder, spor og hint vil dere forsøke å finne frem til formelen før de andre gjør det. Den som først finner den, bestemmer hva som skjer videre. Og akkurat dét... burde bekymre dere alle.
Spill godt. Stol på ingen.  `,
    },
  });

  await prisma.teams.create({
    data: {
      name: "De Uskyldige",
      gamesId: game.id,
    },
  });
  await prisma.teams.create({
    data: {
      name: "De Grådige",
      gamesId: game.id,
    },
  });
  await prisma.teams.create({
    data: {
      name: "De Destruktive",
      gamesId: game.id,
    },
  });
  await prisma.teams.create({
    data: {
      name: "De Tvilende",
      gamesId: game.id,
    },
  });

  const csvPath = path.join(process.cwd(), "data", "aliasHedda.csv");
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
          description: row.description,
          name: row.name,
          hiddenDescription: row.hiddenDescription,
          teamsId: parseInt(row.teamsId, 10) - 4,
          alive: true,
        },
      });
    } catch (error) {
      console.error(`❌ Error creating alias ${row.name}:`, error);
    }
  }

  const csvPathHints = path.join(process.cwd(), "data", "oppgaverH.csv");
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

  const hintsFiltered = hints.filter((hint) => hint.gate);

  // Seed data
  for (const row of hintsFiltered) {
    try {
      await prisma.codes.create({
        data: {
          code: row.solution,
          hint: row.hint,
          assignment: row.gate,
          imagePath: row.url,
        },
      });
    } catch (error) {
      console.error(`❌ Error creating alias ${row.gate}:`, error);
    }
  }

  await prisma.finalQuestion.create({
    data: {
      assignment:
        "Du har funnet formelen, men den er låst i en safe. Har du knekt koden?",
      code: "1a#v34",
    },
  });
}
main();

// export interface AliasCSV {
//   id: string;
//   sortId: string;
//   teamsId: string;
//   teamsName: string;
//   title: string;
//   firstName: string;
//   nickName: string;
//   LastName: string;
//   Initials: string;
//   FullName: string;
//   kjønn: string;
//   publicDescription: string;
//   secretDescription: string;
// }

export interface AliasCSVLeon {
  name: string;
  description: string;
  hiddenDescription: string;
  teamsId: string;
}

interface Hint {
  gate: string;
  solution: string;
  hint: string;
  url?: string;
}

// interface FinalQuesiton {
//   id: number;
//   externalId: string;
//   code: string;
//   assignment: string;
// }

// Småstegimørket,visøkerenvei,
// derhandlinggirmening,ogordenebrei.
// Empati+Kunnskap×Handling–
// enformelsåenkel,denendrerallting.
