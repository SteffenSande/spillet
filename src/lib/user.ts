import prisma from "./prisma";
import type { Code, PublicUser, Team, User, Votes } from "./types";

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

export const getVotes = async (aliasId: string): Promise<Votes> => {
  // Fetch all guesses made by this alias
  const game = await prisma.games.findFirstOrThrow({
    where: {
      teams: {
        some: {
          Alias: {
            some: {
              externalId: aliasId,
            },
          },
        },
      },
    },
    include: {
      teams: true,
    },
  });

  const votesUsed = await prisma.aliasGuesses.count({
    where: {
      guesser: {
        externalId: aliasId,
      },
    },
  });

  return {
    max: game.maxGuesses,
    used: votesUsed,
    canVote: votesUsed < game.maxGuesses,
  };
};

export const getTeams = async (aliasId: string): Promise<Team[]> => {
  // Fetch all guesses made by this alias
  const game = await prisma.games.findFirstOrThrow({
    where: {
      teams: {
        some: {
          Alias: {
            some: {
              externalId: aliasId,
            },
          },
        },
      },
    },
    include: {
      teams: true,
    },
  });

  return game.teams.map((team) => {
    return {
      id: team.id,
      name: team.name,
    };
  });
};

export const getPublicUsers = async (
  aliasId: string
): Promise<PublicUser[]> => {
  // Fetch all guesses made by this alias
  const game = await prisma.games.findFirstOrThrow({
    where: {
      teams: {
        some: {
          Alias: {
            some: {
              externalId: aliasId,
            },
          },
        },
      },
    },
    include: {
      teams: {
        include: {
          Alias: true,
        },
      },
    },
  });
  const guesses = await prisma.aliasGuesses.findMany({
    where: {
      guesser: {
        externalId: aliasId,
      },
    },
  });

  const guessesMap = new Map<number, boolean>();
  for (const guess of guesses) {
    guessesMap.set(guess.aliasId, true);
  }

  const aliases: PublicUser[] = game.teams
    .map((team) => team.Alias)
    .reduce((acc, item) => {
      return [...acc, ...item];
    }, [])
    .map((alias) => {
      return {
        id: alias.id,
        description: alias.description || "",
        isAlive: alias.alive,
        name: alias.name,
        alreadyVotedFor: guessesMap.has(alias.id),
      };
    });

  return aliases;
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

export const isDead = async (user: string): Promise<Boolean> => {
  const alias = await prisma.alias.findFirstOrThrow({
    where: {
      externalId: user,
    },
  });
  return !alias.alive;
};

export const shouldDie = async (id: number): Promise<Boolean> => {
  const aliasWithGame = await prisma.alias.findFirstOrThrow({
    where: {
      id: id,
    },
    include: {
      teams: {
        include: {
          games: true,
        },
      },
    },
  });

  const guesses = await prisma.aliasGuesses.count({
    where: {
      guessId: id,
      isCorrect: true,
    },
  });

  const nrOfCorrectGuessesToKill =
    aliasWithGame.teams.games.nrOfCorrectGuessesToKill;

  console.log("guesses", guesses);
  console.log("nrOfCorrectGuesses", nrOfCorrectGuessesToKill);
  return guesses >= nrOfCorrectGuessesToKill;
};
