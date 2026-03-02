import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { projectsApi } from "../api";
import { getErrorMessage } from "@/shared/utils/api";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Xóa dự án thành công!");
      navigate(APP_ROUTES.DASHBOARD.PROJECTS);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
