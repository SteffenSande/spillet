import { defineAction } from "astro:actions";
import { z } from "astro:content";
import "dotenv";
import { getDb } from "../lib/getPrisma";
import { validateUser } from "./helpers";

export const codeActions = {
  send: defineAction({
    input: z.any(),
    handler: async (input: { code: string; externalId: string }, context) => {
      const user = validateUser(context);
      try {
        const db = await getDb();
        const alias = await db.alias.findFirstOrThrow({
          where: {
            externalId: user,
          },
        });
        const code = await db.codes.findFirstOrThrow({
          where: {
            externalId: input.externalId,
          },
        });
        const guess = await db.codesGuess.create({
          data: {
            aliasId: alias.id,
            codesId: code.id,
            isCorrect: code.code === input.code.toLowerCase(),
          },
        });
        if (guess.isCorrect) {
          return {
            success: code.hint,
          };
        } else
          return {
            error: "That's wrong, try again",
          };
      } catch (e) {
        console.error(e);
      }
    },
  }),
};
