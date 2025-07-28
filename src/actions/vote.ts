import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:content";
import "dotenv";
import { send } from "../pages/api/events";
import { getDb } from "../lib/getPrisma";
import { shouldDie } from "../lib/user";
import prisma from "../lib/prisma";

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
          return vote.guessId === input.id;
        })
      ) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Can't vote for the same person",
        });
      }
      if (voterVotes.length >= game.maxGuesses) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: `Can't vote more than ${game.maxGuesses} times`,
        });
      }
      {
        const votingFor = await db.alias.findFirstOrThrow({
          where: {
            id: input.id,
          },
          include: {
            teams: true,
          },
        });
        if (!votingFor.alive) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: "Can't vote for a dead person",
          });
        }

        const correctGuess = votingFor.teamsId == input.team;

        await db.aliasGuesses.create({
          data: {
            isCorrect: correctGuess,
            guessId: votingFor.id,
            guesserId: voter.id,
            teamsId: input.team,
          },
        });

        const isVotingForDying = await shouldDie(votingFor.id);

        if (isVotingForDying) {
          await prisma.alias.update({
            where: {
              id: votingFor.id,
            },
            data: {
              alive: false,
            },
          });
          send(
            {
              type: "kill",
            },
            votingFor.externalId
          );
        }
      }
    },
  }),
};
