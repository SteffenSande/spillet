import { useQuery } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const queryKeyTableDiagrams = "tableDiagrams";

export const useTableDiagrams = (diagram_id: null | number) => {
  return useQuery({
    queryKey: [queryKeyTableDiagrams, diagram_id],
    queryFn: async () => {
      if (diagram_id) {
        const response = await actions.tablesDiagrams.all({ diagram_id });
        const { data = [] } = response;
        const queryClient = getQueryClient();
        if (data) {
          for (const table of data) {
            queryClient.setQueryData(
              [queryKeyTableDiagrams, diagram_id, table.id],
              () => table
            );
          }
        }
        return data ?? [];
      }
    },
  });
};
