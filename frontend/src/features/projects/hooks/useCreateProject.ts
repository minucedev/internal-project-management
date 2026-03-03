import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { projectsApi } from "../api";
import { getErrorMessage } from "@/shared/utils/api";
import { APP_ROUTES } from "@/shared/constants/routes.constants";
import type { CreateProjectRequest } from "../types";

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectsApi.create(data),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Tạo dự án thành công!");
      navigate(APP_ROUTES.DASHBOARD.PROJECT_DETAIL(String(project.id)));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
