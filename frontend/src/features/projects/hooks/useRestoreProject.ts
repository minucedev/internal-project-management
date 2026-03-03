import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { projectsApi } from "../api";
import { getErrorMessage } from "@/shared/utils/api";

export const useRestoreProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => projectsApi.restore(id),
        onSuccess: () => {
            // Invalidate both active projects list and trash bin
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["projects", "trashed"] });
            toast.success("Khôi phục dự án thành công!");
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};
