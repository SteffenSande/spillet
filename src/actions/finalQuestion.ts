import { defineAction } from "astro:actions";
import { z } from "astro:content";
import "dotenv";
import { getDb } from "../lib/getPrisma";
import { validateUser } from "./helpers";

export const finalQuestionActions = {
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
          include: {
            teams: true,
          },
        });
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
          return {
            error: "That's wrong, try again",
          };
      } catch (e) {
        console.error(e);
      }
    },
  }),
};
