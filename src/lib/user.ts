import prisma from "./prisma";
import type { Code, User } from "./types";

export const getUserWithAllCodes = async (
  aliasId: string
): Promise<User | undefined> => {
  // Fetch the alias and their team
  const alias = await prisma.alias.findUnique({
    where: { externalId: aliasId },
    include: {
      teams: true,
    },
  });

  if (!alias) return;

  const codes = await getCodesForUser(aliasId);

  // Final User object
  const user: User = {
    name: alias.name,
    description: alias.description ?? "",
    team: alias.teams.name,
    hiddenDescription: alias.hiddenDescription ?? "",
    codes,
  };

  return user;
};

export const getCodesForUser = async (aliasId: string): Promise<Code[]> => {
  const allCodes = await prisma.codes.findMany();

  // Fetch all guesses made by this alias
  const guesses = await prisma.codesGuess.findMany({
    where: {
      alias: {
        externalId: aliasId,
      },
    },
    include: {
      code: true,
    },
  });
  const foundClue = await prisma.codeFound.findMany({
    where: {
      alias: {
        externalId: aliasId,
      },
    },
    include: {
      code: true,
    },
  });

  // Create a map from codeId to guess info
  const codeGuesses = new Map<number, { correct: boolean }>();

  const codesFound = new Map<number, { found: boolean }>();

  for (const codeFound of foundClue) {
    codesFound.set(codeFound.codesId, { found: true });
  }
  console.log(codesFound);

  for (const guess of guesses) {
    const info = codeGuesses.get(guess.codesId) || {
      correct: false,
    };
    if (guess.isCorrect) info.correct = true;
    codeGuesses.set(guess.codesId, info);
  }

  // Build codes array with conditional fields
  const codes: Code[] = allCodes.map((code) => {
    const guessInfo = codeGuesses.get(code.id) ?? {
      correct: false,
    };

    const foundInfo = codesFound.get(code.id) ?? {
      found: false,
    };

    return {
      ...(foundInfo.found && { externalId: code.externalId }),
      ...(foundInfo.found && { assignment: code.assignment }),
      ...(guessInfo.correct && { hint: code.hint }),
    };
  });
  return codes;
};
