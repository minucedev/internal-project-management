// ─────────────────────────────────────────────────────────
// ENUMS — match backend ProjectRole & ProjectUserStatus
// ─────────────────────────────────────────────────────────

export type ProjectRole = 'LEADER' | 'MEMBER' | 'VIEWER';
export type MemberStatus = 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'REMOVED';

// ─────────────────────────────────────────────────────────
// PROJECT RESPONSES — match backend DTOs exactly
// ─────────────────────────────────────────────────────────

/**
 * ProjectResponse — used in list, create, update, restore, trash
 * Maps to: com.internalpj.crm_mini.dto.response.ProjectResponse
 */
export interface ProjectResponse {
  id: number;
  name: string;
  description?: string;
  startDate?: string;         // LocalDateTime → ISO string
  endDate?: string;
  createdById: number;
  createdByUsername: string;
  currentUserRole: ProjectRole;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * ProjectDetailResponse — used in GET /projects/{id}
 * Maps to: com.internalpj.crm_mini.dto.response.ProjectDetailResponse
 */
export interface ProjectDetailResponse {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  createdById: number;
  createdByUsername: string;
  createdByEmail: string;
  currentUserRole: ProjectRole;
  members: MemberResponse[];
  totalMembers: number;
  leaderCount: number;
  memberCount: number;
  viewerCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * ProjectListResponse — used in GET /projects (paginated)
 * Maps to: com.internalpj.crm_mini.dto.response.ProjectListResponse
 */
export interface ProjectListResponse {
  projects: ProjectResponse[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ─────────────────────────────────────────────────────────
// MEMBER RESPONSES — match backend DTOs exactly
// ─────────────────────────────────────────────────────────

/**
 * MemberResponse — used in member list and project detail
 * Maps to: com.internalpj.crm_mini.dto.response.MemberResponse
 */
export interface MemberResponse {
  userId: number;
  username: string;
  email: string;
  phoneNumber?: string;
  roleInProject: ProjectRole;
  positionTitle?: string;
  statusInProject: MemberStatus;
  joinedAt?: string;
}

/**
 * MemberListResponse — used in GET /projects/{id}/members
 * Maps to: com.internalpj.crm_mini.dto.response.MemberListResponse
 */
export interface MemberListResponse {
  members: MemberResponse[];
  // Statistics
  totalMembers: number;
  activeCount: number;
  pendingCount: number;
  // Role breakdown (active only)
  leaderCount: number;
  memberCount: number;
  viewerCount: number;
  // Pagination metadata (optional — present when paginated)
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

/**
 * InviteResponse — returned after sending an invitation
 * Maps to: com.internalpj.crm_mini.dto.response.InviteResponse
 */
export interface InviteResponse {
  userId: number;
  email: string;
  inviteToken: string;
  expiresAt: string;
  message: string;
}

// ─────────────────────────────────────────────────────────
// REQUEST TYPES
// ─────────────────────────────────────────────────────────

export interface CreateProjectRequest {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  endDate?: string;
}

/**
 * InviteMemberRequest — body for POST /projects/{id}/members/invite
 * Maps to: com.internalpj.crm_mini.dto.request.InviteMemberRequest
 */
export interface InviteMemberRequest {
  email: string;
  role?: ProjectRole;         // default: MEMBER (set by BE)
  positionTitle?: string;
}

// ─────────────────────────────────────────────────────────
// QUERY PARAMS
// ─────────────────────────────────────────────────────────

export interface GetProjectsParams {
  page?: number;              // 0-indexed, default 0
  size?: number;              // default 10
  role?: ProjectRole;         // filter by user's role in project
  sort?: string;              // name | startDate | endDate | createdAt
}

export interface GetMembersParams {
  includePending?: boolean;   // LEADER only, default false
  page?: number;              // 0-indexed, default 0
  size?: number;              // default 20
  sortBy?: string;            // username | email | role | joinedAt
}

// ─────────────────────────────────────────────────────────
// FORM DATA TYPES — for React Hook Form (UI only)
// ─────────────────────────────────────────────────────────

export interface ProjectFormData {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface InviteMemberFormData {
  email: string;
  role: ProjectRole;
  positionTitle?: string;
}

// ─────────────────────────────────────────────────────────
// LEGACY ALIASES — keep compatibility during transition
// ─────────────────────────────────────────────────────────

/** @deprecated Use ProjectResponse instead */
export type Project = ProjectResponse;

/** @deprecated Use MemberResponse instead */
export type ProjectMember = MemberResponse;

/** @deprecated Use InviteMemberRequest instead */
export type AddMemberRequest = InviteMemberRequest;
