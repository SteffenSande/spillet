import prisma from "./prisma";

export type DashboardGame = Awaited<ReturnType<typeof getDashboardGame>>;
export type DashboardCode = Awaited<ReturnType<typeof getDashboardCodes>>;

export const getDashboardGame = async (gameId: number) => {
  return await prisma.games.findFirstOrThrow({
    where: {
      id: gameId,
    },
    include: {
      extraInformation: true,
      teams: {
        include: {
          AliasGuesses: {
            include: {
              guess: true,
              guesser: true,
            },
          },
          Alias: {
            include: {
              FinalFound: {
                include: {
                  finalQuestion: {
                    include: {
                      FinalQuestionGuess: true,
                    },
                  },
                },
              },
              CodeFound: {
                include: {
                  code: {
                    include: {
                      CodesGuess: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};

export const getDashboardCodes = async () => {
  return await prisma.codes.findMany({
    include: {
      CodeFound: {
        include: {
          alias: true,
        },
      },
      CodesGuess: {
        include: {
          alias: true,
        },
      },
    },
  });
};
