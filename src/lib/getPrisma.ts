export const getDb = async () => {
  return (await import("./prisma")).default;
};
