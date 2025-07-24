import { ActionError, type ActionAPIContext } from "astro:actions";

export const validateUser = (context: ActionAPIContext): string => {
  if (!context.locals.user) {
    throw new ActionError({ code: "UNAUTHORIZED" });
  }
  return context.locals.user;
};
