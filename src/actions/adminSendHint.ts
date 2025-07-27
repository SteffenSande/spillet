import { defineAction } from "astro:actions";
import { z } from "astro:content";
import "dotenv";
import { send } from "../pages/api/events";

export const hints = {
  send: defineAction({
    input: z.string(),
    handler: async (input: string) => {
      try {
        console.log("sending");

        send({ id: 1, hint: input + Math.random() * 100 });
      } catch (e) {
        console.error(e);
      }
    },
  }),
};
