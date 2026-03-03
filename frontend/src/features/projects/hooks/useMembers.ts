import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api";
import type { GetMembersParams } from "../types";

export const useMembers = (projectId: string, params?: GetMembersParams) => {
    return useQuery({
        queryKey: ["members", projectId, params],
        queryFn: () => projectsApi.getMembers(projectId, params),
        enabled: !!projectId,
    });
};
