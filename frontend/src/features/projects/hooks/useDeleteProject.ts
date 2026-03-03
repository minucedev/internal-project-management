import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { projectsApi } from "../api";
import { getErrorMessage } from "@/shared/utils/api";
import { APP_ROUTES } from "@/shared/constants/routes.constants";

interface DeleteProjectParams {
  id: string;
  hardDelete?: boolean;
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ id, hardDelete = false }: DeleteProjectParams) =>
      projectsApi.delete(id, hardDelete),
    onSuccess: (_, { hardDelete }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      if (hardDelete) {
        // Hard delete from trash — also refresh trash list, stay on current page
        queryClient.invalidateQueries({ queryKey: ["projects", "trashed"] });
        toast.success("Đã xóa vĩnh viễn dự án!");
      } else {
        // Soft delete — go back to projects list
        toast.success("Dự án đã được chuyển vào thùng rác!");
        navigate(APP_ROUTES.DASHBOARD.PROJECTS);
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

