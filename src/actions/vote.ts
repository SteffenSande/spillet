import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:content";
import "dotenv";
import { send } from "../pages/api/events";
import { getDb } from "../lib/getPrisma";

export const vote = {
  send: defineAction({
    input: z.object({
      id: z.number(),
      team: z.number(),
    }),
    handler: async (input: { id: number; team: number }, context) => {
      const user = context.locals.user;
      const db = await getDb();
      const game = await db.games.findFirstOrThrow({
        where: {
          teams: {
            some: {
              Alias: {
                some: {
                  externalId: user,
                },
              },
            },
          },
        },
      });

      const voter = await db.alias.findFirstOrThrow({
        where: {
          externalId: user,
        },
      });

      const voterVotes = await db.aliasGuesses.findMany({
        where: {
          guesserId: voter.id,
        },
      });

      if (
        voterVotes.find((vote) => {
          return vote.aliasId === input.id;
        })
      ) {
        console.log("hello");
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Can't vote for the same person",
        });
      }
      if (voterVotes.length <= game.maxGuesses) {
        const votingFor = await db.alias.findFirstOrThrow({
          where: {
            id: input.id,
          },
          include: {
            teams: true,
          },
        });
        const correctGuess = votingFor.teamsId == input.team;

        await db.aliasGuesses.create({
          data: {
            isCorrect: correctGuess,
            aliasId: votingFor.id,
            guesserId: voter.id,
            teamsId: input.team,
          },
        });
      }
    },
  }),
};
