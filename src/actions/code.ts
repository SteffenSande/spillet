import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:content";
import "dotenv";
import { getDb } from "../lib/getPrisma";
import { validateUser } from "./helpers";

const ONE_MINUTES = 1 * 60 * 1000;

export const codeActions = {
  send: defineAction({
    input: z.any(),
    handler: async (input: { code: string; externalId: string }, context) => {
      const user = validateUser(context);
      const db = await getDb();
      const alias = await db.alias.findFirstOrThrow({
        where: {
          externalId: user,
        },
      });

      const rateLimit = await db.rateLimit.findFirst({
        where: {
          actionName: `code-${input.externalId}`,
          alias: {
            externalId: user,
          },
        },
      });

      if (!!rateLimit) {
        const now = new Date();
        if (now.getTime() < rateLimit.lastAccess.getTime() + ONE_MINUTES) {
          const diffSeconds =
            Math.floor(
              (ONE_MINUTES - now.getTime() + rateLimit.lastAccess.getTime()) /
                1000
            ) % 60;
          const diffMinnutes = Math.floor(
            (ONE_MINUTES - now.getTime() + rateLimit.lastAccess.getTime()) /
              (60 * 1000)
          );

          throw new ActionError({
            code: "TOO_MANY_REQUESTS",
            message: `Du kan prøve igjen om: ${diffMinnutes > 0 ? diffMinnutes + "m " : ""}${diffSeconds}s`,
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

      if (!rateLimit) {
        await db.rateLimit.create({
          data: {
            lastAccess: new Date(),
            actionName: `code-${input.externalId}`,
            aliasId: alias.id,
          },
        });
      }
      const code = await db.codes.findFirstOrThrow({
        where: {
          externalId: input.externalId,
        },
      });
      const guess = await db.codesGuess.create({
        data: {
          aliasId: alias.id,
          codesId: code.id,
          isCorrect: code.code.toLowerCase() === input.code.toLowerCase(),
        },
      });
      if (guess.isCorrect) {
        return {
          success: code.hint,
        };
      } else
        throw new ActionError({
          code: "TOO_MANY_REQUESTS",
          message: `Du kan prøve igjen om: 1m`,
        });
    },
  }),
};
