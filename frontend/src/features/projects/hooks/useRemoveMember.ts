import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { projectsApi } from "../api";
import { getErrorMessage } from "@/shared/utils/api";

export const useRemoveMember = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) =>
      projectsApi.removeMember(projectId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
      toast.success("Xóa thành viên thành công!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
