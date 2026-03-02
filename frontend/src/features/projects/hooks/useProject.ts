import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api";

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  });
};
