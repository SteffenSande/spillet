import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:content";
import "dotenv";
import { getDb } from "../lib/getPrisma";
import { validateUser } from "./helpers";

const FIVE_MINUTES = 5 * 60 * 1000;

export const finalQuestionActions = {
  send: defineAction({
    input: z.any(),
    handler: async (input: { code: string; externalId: string }, context) => {
      const user = validateUser(context);
      const db = await getDb();

      const rateLimit = await db.rateLimit.findFirst({
        where: {
          alias: {
            externalId: user,
          },
        },
      });

      if (!!rateLimit) {
        const now = new Date();
        if (now.getTime() < rateLimit.lastAccess.getTime() + FIVE_MINUTES) {
          const diffSeconds =
            Math.floor(
              (FIVE_MINUTES - now.getTime() + rateLimit.lastAccess.getTime()) /
                1000
            ) % 60;
          const diffMinnutes = Math.floor(
            (FIVE_MINUTES - now.getTime() + rateLimit.lastAccess.getTime()) /
              (60 * 1000)
          );

          throw new ActionError({
            code: "TOO_MANY_REQUESTS",
            message: `Du kan prøve igjen om: ${diffMinnutes}m ${diffSeconds}s`,
          });
        }
        await db.rateLimit.update({
          where: {
            id: rateLimit.id,
          },
          data: {
            lastAccess: now,
          },
        });
      }
      const alias = await db.alias.findFirstOrThrow({
        where: {
          externalId: user,
        },
        include: {
          teams: true,
        },
      });
      if (!rateLimit) {
        await db.rateLimit.create({
          data: {
            lastAccess: new Date(),
            actionName: "FinalQuestion",
            aliasId: alias.id,
          },
        });
      }

      const finalQuestion = await db.finalQuestion.findFirstOrThrow({
        where: {
          externalId: input.externalId,
        },
      });
      const guess = await db.finalQuestionGuess.create({
        data: {
          aliasId: alias.id,
          finalQuestionId: finalQuestion.id,
          isCorrect: finalQuestion.code === input.code,
        },
      });
      if (guess.isCorrect) {
        return {
          success: "Dette er riktig løsning",
          team: alias.teams,
        };
      } else
        throw new ActionError({
          code: "TOO_MANY_REQUESTS",
          message: `Du kan prøve igjen om: 5m`,
        });
    },
  }),
};
