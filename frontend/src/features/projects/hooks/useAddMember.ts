import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { projectsApi } from "../api";
import { getErrorMessage } from "@/shared/utils/api";
import type { AddMemberRequest } from "../types";

export const useAddMember = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddMemberRequest) =>
      projectsApi.addMember(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
      toast.success("Thêm thành viên thành công!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
