export const getGameId = (Astro: any) => {
  const { gameId } = Astro.params;
  if (!gameId) {
    return Astro.redirect("/");
  }
  return parseInt(gameId, 10);
};

export const getUser = (Astro: any) => {
  const user = Astro.cookies.get("session-mafia-grande")?.value;
  if (!user) {
    return Astro.redirect("/");
  }
  return user;
};
