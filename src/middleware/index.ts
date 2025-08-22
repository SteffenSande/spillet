import { defineMiddleware } from "astro:middleware";
import { sequence } from "astro:middleware";
import prisma from "../lib/prisma";
import { isDead } from "../lib/user";

// `context` and `next` are automatically typed
export const auth = defineMiddleware(async (context, next) => {
  try {
    const loggedIn = context.cookies.has("session-mafia-grande");

    if (loggedIn) {
      const idToken = context.cookies.get("session-mafia-grande")?.value;
      if (idToken) context.locals.user = idToken;
    } else {
      // Redirect to home and tell them to log in by scanning again.
    }
    return next();
  } catch (e) {
    console.error(e);
    return next();
  }
});

// `context` and `next` are automatically typed
export const killed = defineMiddleware(async (context, next) => {
  try {
    const user = context.locals.user;
    if (
      user &&
      (await isDead(user)) &&
      !context.url.pathname.includes("/killed")
    ) {
      return context.redirect("/killed");
    }
    return next();
  } catch (e) {
    return next();
  }
});

export const onRequest = sequence(auth, killed);
