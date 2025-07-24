import { isServer, QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient();

export const getQueryClient = () => {
  if (isServer) {
    return new QueryClient();
  }
  return queryClient;
};
