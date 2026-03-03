import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api";

export const useTrashedProjects = () => {
    return useQuery({
        queryKey: ["projects", "trashed"],
        queryFn: () => projectsApi.getTrashed(),
    });
};
