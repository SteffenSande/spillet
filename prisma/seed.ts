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
      rules: ` 🛠 Praktisk informasjon
For å finne øyet må du samle hint.
Hintene er skjult bak QR-koder spredt rundt i huset. Når du finner en QR-kode, scanner du den med mobilen og kommer til en nettside med en oppgave. Løser du oppgaven riktig, får du et hint – som vil hjelpe deg i jakten på øyet.
Det finnes totalt 12 hintoppgaver, og du trenger flere av dem for å finne øyet.

❗ Regler og rammer:
• Rom som ikke er en del av spillet er: Berit og Brage sitt rom, kjelleren og Aria sitt rom. Gå ikke inn der.
• Du må ikke ødelegge, flytte på eller rote i huset – det du leter etter er smart plassert, ikke skjult bak bilder eller sokkelister.
• Etterlat alle rom slik du fant dem, så får alle en fair sjanse.
• Du kan samarbeide, men spør deg selv: Stoler du på dem? Kanskje dere egentlig har ulike mål.

🧩 Hemmelig informasjon
Alle har fått utdelt hemmelig informasjon.
Det kan hjelpe deg med å:
• Finne hint.
• Forstå hvem du bør samarbeide med.
• Avsløre gruppetilhørigheten til andre.
• Velg selv hvor mye du er villig til å dele med andre.
• Det er ikke lov å be om å få se andres hemmelige informasjon eller vise sin egen.


🎯 Avsløring og eliminering
Hver spiller kan en gang i løpet av spillet gjette hvilken gruppe en annen deltaker tilhører.
• Hvis to forskjellige spillere gjetter riktig på samme person, er den personen ute av spillet – og mister muligheten til å påvirke øyets skjebne.
• Gjetter du feil, skjer det ingenting – men du har brukt opp ett av dine tre forsøk.

🏆 Vinner
Alle gjenlevende deltakere på laget som først finner øyet er å anse som vinnere.
Det er derfor i din interesse å:
• Holde deg i live
• Finne ut hvem som er på ditt lag
• Få tak i øyet før de andre

🧠 Husk:
Den som finner øyet, bestemmer hva som skjer.
Men ingen kan vinne alene. Og ingen er trygge.
`,
      intro: `🎭 Velkommen til Villa Leone – et kveldsmøte i kunstens og maktens navn.
Dere er samlet i kveld etter en eksklusiv invitasjon fra den karismatiske – og etter hvert omdiskuterte – kunstsamleren Olav W. Lehne. Etter mange år i det skjulte har Olav nå åpnet dørene til Villa Leone, hans private residens, for en intim gruppe av spesielt utvalgte gjester.

Anledningen? En spektakulær avsløring: Athenas Øye – en juvellignende artefakt av uvanlig skjønnhet og ukjent opprinnelse. Ifølge Olav ble Øyet “oppdaget” ved en tilfeldighet i kjelleren til en bygning han nylig overtok i Toscana. Det er nå satt i en glassmonter midt i Villaens salong, omgitt av vakthold og diskusjon.

Men gjenstanden har allerede skapt uro.

Eksperter mener det dreier seg om en hellenistisk relikvie som forsvant under uklare omstendigheter etter andre verdenskrig. En etterlysning fra Museet for Bysantinsk Kultur i Thessaloniki hevder at Øyet ble stjålet i 1948, og at det med sikkerhet tilhører museet og dermed den greske staten. Dette har ikke hindret Olav i å kalle det “høydepunktet i sin samling”.

De fleste her kjenner Olav godt – og mange kjenner hverandre fra før, både sosialt og gjennom kunstmiljøet. Det er nettopp derfor dere er her: Olav stoler på dere.

Men kan han egentlig det?

For uansett relasjon eller bakgrunn, har alle som er til stede forberedt seg. Det ryktes om både sannsynlige og usannsynlige allianser – og én ting er sikkert:
Alle har egne planer for Athenas Øye.`,
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
      name: "Selge",
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
      name: "Ødelegge",
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
      .on("data", (row) => finalQuestions.push(row))
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
  externalId: string;
  code: string;
  assignment: string;
}
