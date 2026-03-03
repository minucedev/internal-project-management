import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { projectsApi } from "../api";
import { getErrorMessage } from "@/shared/utils/api";
import type { InviteMemberRequest } from "../types";

export const useInviteMember = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: InviteMemberRequest) =>
            projectsApi.invite(projectId, data),
        onSuccess: () => {
            // Refresh both the project detail (memberCount) and member list
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
            queryClient.invalidateQueries({ queryKey: ["members", projectId] });
            toast.success("Gửi lời mời thành công! Email đã được gửi.");
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};
