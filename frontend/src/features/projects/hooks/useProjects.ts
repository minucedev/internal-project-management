import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api";
import type { GetProjectsParams } from "../types";

export const useProjects = (params?: GetProjectsParams) => {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => projectsApi.getAll(params),
  });
};
