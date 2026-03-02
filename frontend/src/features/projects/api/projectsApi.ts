import { axiosInstance } from "@/shared/utils/api";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import type { ApiResponse } from "@/shared/types/api.types";
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  AddMemberRequest,
  ProjectMember,
} from "../types";

export const projectsApi = {
  // Get all projects (with optional search)
  getAll: async (params?: { search?: string }): Promise<Project[]> => {
    const response = await axiosInstance.get<ApiResponse<Project[]>>(
      API_ENDPOINTS.PROJECTS.BASE,
      { params },
    );
    return response.data.data!;
  },

  // Get project by ID
  getById: async (id: string): Promise<Project> => {
    const response = await axiosInstance.get<ApiResponse<Project>>(
      API_ENDPOINTS.PROJECTS.DETAIL(id),
    );
    return response.data.data!;
  },

  // Create project
  create: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await axiosInstance.post<ApiResponse<Project>>(
      API_ENDPOINTS.PROJECTS.BASE,
      data,
    );
    return response.data.data!;
  },

  // Update project
  update: async (id: string, data: UpdateProjectRequest): Promise<Project> => {
    const response = await axiosInstance.put<ApiResponse<Project>>(
      API_ENDPOINTS.PROJECTS.DETAIL(id),
      data,
    );
    return response.data.data!;
  },

  // Delete project
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.PROJECTS.DETAIL(id));
  },

  // Add member to project (via email invitation)
  addMember: async (
    projectId: string,
    data: AddMemberRequest,
  ): Promise<ProjectMember> => {
    // Note: To match BE, this returns an InviteResponse instead but for FE compatibility we'll type it correctly
    const response = await axiosInstance.post<ApiResponse<any>>(
      API_ENDPOINTS.PROJECTS.INVITE(projectId),
      data,
    );
    return response.data.data!;
  },

  // Accept invitation
  acceptInvite: async (projectId: string, token: string): Promise<ProjectMember> => {
    const response = await axiosInstance.post<ApiResponse<ProjectMember>>(
      API_ENDPOINTS.PROJECTS.ACCEPT_INVITE(projectId, token),
    );
    return response.data.data!;
  },

  // Remove member from project
  removeMember: async (projectId: string, memberId: string): Promise<void> => {
    await axiosInstance.delete(
      `${API_ENDPOINTS.PROJECTS.MEMBERS(projectId)}/${memberId}`,
    );
  },
};
