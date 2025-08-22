import { defineAction } from "astro:actions";
import { z } from "astro:content";
import "dotenv";
import { send } from "../pages/api/events";

export const hints = {
  kill: defineAction({
    handler: async (_, context) => {
      try {
        const user = context.locals.user;

        if (user)
          send(
            {
              type: "kill",
            },
            user
          );
      } catch (e) {
        console.error(e);
      }
    },
  }),
  send: defineAction({
    input: z.object({
      text: z.string(),
      user: z.string(),
    }),
    handler: async (input: { user: string; text: string }) => {
      try {
        send(
          {
            type: "hint",
            message: input.text,
          },
          input.user
        );
      } catch (e) {
        console.error(e);
      }
    },
  }),
};
