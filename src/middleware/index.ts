import { defineMiddleware } from "astro:middleware";
import { sequence } from "astro:middleware";

// `context` and `next` are automatically typed
export const auth = defineMiddleware(async (context, next) => {
  try {
    const loggedIn = context.cookies.has("session");

    if (loggedIn) {
      const idToken = context.cookies.get("session")?.value;
      if (idToken) context.locals.user = idToken;
    }
    next();
  } catch (e) {
    console.error(e);
  }
});

export const onRequest = sequence(auth);
