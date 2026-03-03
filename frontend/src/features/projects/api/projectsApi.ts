import { axiosInstance } from "@/shared/utils/api";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import type { ApiResponse } from "@/shared/types/api.types";
import type {
  ProjectResponse,
  ProjectDetailResponse,
  ProjectListResponse,
  MemberListResponse,
  InviteResponse,
  InviteMemberRequest,
  CreateProjectRequest,
  UpdateProjectRequest,
  GetProjectsParams,
  GetMembersParams,
} from "../types";

export const projectsApi = {
  // ── PROJECT CRUD ──────────────────────────────────────────────────────────

  // Get all projects with pagination, role filter and sort
  // BE: GET /projects?page&size&role&sort
  getAll: async (params?: GetProjectsParams): Promise<ProjectListResponse> => {
    const response = await axiosInstance.get<ApiResponse<ProjectListResponse>>(
      API_ENDPOINTS.PROJECTS.BASE,
      { params },
    );
    return response.data.data!;
  },

  // Get project detail (members list + role stats)
  // BE: GET /projects/{id}
  getDetail: async (id: string): Promise<ProjectDetailResponse> => {
    const response = await axiosInstance.get<ApiResponse<ProjectDetailResponse>>(
      API_ENDPOINTS.PROJECTS.DETAIL(id),
    );
    return response.data.data!;
  },

  // Create project
  // BE: POST /projects
  // Note: BE expects LocalDateTime format (ISO), FE form sends 'YYYY-MM-DD' date string
  create: async (data: CreateProjectRequest): Promise<ProjectResponse> => {
    const payload = {
      ...data,
      // Convert 'YYYY-MM-DD' → 'YYYY-MM-DDT00:00:00' for Spring LocalDateTime
      startDate: data.startDate ? `${data.startDate}T00:00:00` : undefined,
      endDate: data.endDate ? `${data.endDate}T00:00:00` : undefined,
    };
    const response = await axiosInstance.post<ApiResponse<ProjectResponse>>(
      API_ENDPOINTS.PROJECTS.BASE,
      payload,
    );
    return response.data.data!;
  },

  // Update project (partial update, LEADER only)
  // BE: PUT /projects/{id}
  update: async (id: string, data: UpdateProjectRequest): Promise<ProjectResponse> => {
    const payload = {
      ...data,
      endDate: data.endDate ? `${data.endDate}T00:00:00` : undefined,
    };
    const response = await axiosInstance.put<ApiResponse<ProjectResponse>>(
      API_ENDPOINTS.PROJECTS.DETAIL(id),
      payload,
    );
    return response.data.data!;
  },

  // Delete project (soft delete by default, LEADER only)
  // BE: DELETE /projects/{id}?hardDelete=false
  delete: async (id: string, hardDelete = false): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.PROJECTS.DETAIL(id), {
      params: { hardDelete },
    });
  },

  // ── TRASH BIN ─────────────────────────────────────────────────────────────

  // Get trashed projects where current user is LEADER
  // BE: GET /projects/trashed
  getTrashed: async (): Promise<ProjectResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<ProjectResponse[]>>(
      API_ENDPOINTS.PROJECTS.TRASHED,
    );
    return response.data.data!;
  },

  // Restore project from trash (LEADER only)
  // BE: POST /projects/{id}/restore
  restore: async (id: string): Promise<ProjectResponse> => {
    const response = await axiosInstance.post<ApiResponse<ProjectResponse>>(
      API_ENDPOINTS.PROJECTS.RESTORE(id),
    );
    return response.data.data!;
  },

  // ── MEMBER MANAGEMENT ─────────────────────────────────────────────────────

  // Get members list with optional filters and pagination
  // BE: GET /projects/{id}/members?includePending&page&size&sortBy
  getMembers: async (projectId: string, params?: GetMembersParams): Promise<MemberListResponse> => {
    const response = await axiosInstance.get<ApiResponse<MemberListResponse>>(
      API_ENDPOINTS.PROJECTS.MEMBERS(projectId),
      { params },
    );
    return response.data.data!;
  },

  // Invite member via email (LEADER only)
  // BE: POST /projects/{id}/members/invite
  // Body: { email, role?, positionTitle? }
  invite: async (projectId: string, data: InviteMemberRequest): Promise<InviteResponse> => {
    const response = await axiosInstance.post<ApiResponse<InviteResponse>>(
      API_ENDPOINTS.PROJECTS.INVITE(projectId),
      data,
    );
    return response.data.data!;
  },

  // Accept invitation using token from email link
  // BE: POST /projects/{id}/members/invites/{token}/accept
  acceptInvite: async (projectId: string, token: string): Promise<void> => {
    await axiosInstance.post(
      API_ENDPOINTS.PROJECTS.ACCEPT_INVITE(projectId, token),
    );
  },

  // Remove member from project (soft remove, LEADER only)
  // BE: DELETE /projects/{id}/members/{userId}
  removeMember: async (projectId: string, userId: string): Promise<void> => {
    await axiosInstance.delete(
      `${API_ENDPOINTS.PROJECTS.MEMBERS(projectId)}/${userId}`,
    );
  },
};
