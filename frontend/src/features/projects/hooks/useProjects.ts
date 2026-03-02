import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api";

export const useProjects = (search?: string) => {
  return useQuery({
    queryKey: ["projects", search],
    queryFn: () => projectsApi.getAll({ search }),
  });
};
