import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api";

export const useProjectDetail = (id: string) => {
    return useQuery({
        queryKey: ["project", id],
        queryFn: () => projectsApi.getDetail(id),
        enabled: !!id,
    });
};
