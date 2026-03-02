// Base Entities
export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate: string; // ISO date string
  endDate: string;
  currentUserRole: "LEADER" | "MEMBER";
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  userId: string;
  username: string;
  email: string;
  role: "LEADER" | "MEMBER";
  joinedAt: string;
}

// API Request/Response Types
export interface CreateProjectRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface AddMemberRequest {
  email: string;
}

// Form Data Types (for React Hook Form)
export interface ProjectFormData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface InviteMemberFormData {
  email: string;
}

// Role type
export type ProjectRole = "LEADER" | "MEMBER";
