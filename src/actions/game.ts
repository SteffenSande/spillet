import { defineAction } from "astro:actions";
import { z } from "astro:content";
import "dotenv";
import { getDb } from "../lib/getPrisma";

export const game = {
  add: defineAction({
    input: z.object({
      extraInformation: z.string(),
      gameId: z.number(),
    }),
    handler: async (input: { extraInformation: string; gameId: number }) => {
      try {
        const db = await getDb();
        await db.extraInformation.create({
          data: {
            gamesId: input.gameId,
            text: input.extraInformation,
          },
        });
        console.log("created");
      } catch (e) {
        console.error(e);
      }
    },
  }),
  update: defineAction({
    input: z.object({
      extraInformation: z.string(),
      id: z.number(),
    }),
    handler: async (input: { extraInformation: string; id: number }) => {
      try {
        const db = await getDb();
        await db.extraInformation.update({
          where: {
            id: input.id,
          },
          data: {
            text: input.extraInformation,
          },
        });
      } catch (e) {
        console.error(e);
      }
    },
  }),
  delete: defineAction({
    input: z.object({
      id: z.number(),
    }),
    handler: async (input: { id: number }) => {
      try {
        const db = await getDb();
        await db.extraInformation.delete({
          where: {
            id: input.id,
          },
        });
      } catch (e) {
        console.error(e);
      }
    },
  }),
};
