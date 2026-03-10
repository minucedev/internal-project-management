// ─────────────────────────────────────────────────────────
// TASK TYPES — Sprint 1, map 1:1 với DB schema
// ─────────────────────────────────────────────────────────

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

// ─── Sub-types ─────────────────────────────────────────────

export interface TaskUser {
    id: number;
    username: string;
    avatarUrl?: string;
    email?: string;
}

// ─── Core entity ───────────────────────────────────────────

/** Maps to backend TaskResponse DTO. Field names match DB columns (camelCase). */
export interface Task {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    projectId: number;
    assigneeId: number | null;
    assignee: TaskUser | null;        // null = Unassigned
    createdBy: TaskUser;
    deadline?: string;                // ISO timestamp, nullable
    completedAt?: string | null;      // set when Leader marks DONE
    createdAt: string;
    updatedAt: string;
}

// ─── Request DTOs ──────────────────────────────────────────

/** POST /projects/{id}/tasks — Leader & Member */
export interface CreateTaskRequest {
    title: string;
    description?: string;
    priority: TaskPriority;
    deadline?: string;
    assigneeId?: number;              // only Leader can set this
}

/** PATCH /projects/{id}/tasks/{tid} — Leader only */
export interface UpdateTaskMetadataRequest {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    deadline?: string | null;
}

/** PATCH /projects/{id}/tasks/{tid}/status — Leader & Member */
export interface ChangeStatusRequest {
    status: TaskStatus;
}

/** PATCH /projects/{id}/tasks/{tid}/assign — Leader & Member */
export interface AssignTaskRequest {
    assigneeId: number | null;        // null = unassign
}

// ─── Permission output ─────────────────────────────────────

export interface TaskPermissions {
    canEdit: boolean;
    canDelete: boolean;
    canAssign: boolean;
    canSelfAssign: boolean;           // Member + task is Unassigned
    canChangeStatus: boolean;
    availableStatuses: TaskStatus[];  // empty = terminal or no permission
}

// ─── Display constants (Von Restorff: distinct colors) ─────

export const TASK_STATUS_ORDER: TaskStatus[] = [
    'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'CANCELLED',
];

export const TASK_STATUS_META: Record<TaskStatus, {
    label: string;
    color: string;          // Tailwind text+bg
    borderColor: string;    // Tailwind border
    dotColor: string;       // Tailwind bg for dot
}> = {
    TODO: { label: 'Cần làm', color: 'text-slate-600 bg-slate-100', borderColor: 'border-slate-300', dotColor: 'bg-slate-400' },
    IN_PROGRESS: { label: 'Đang làm', color: 'text-blue-600 bg-blue-50', borderColor: 'border-blue-300', dotColor: 'bg-blue-500' },
    IN_REVIEW: { label: 'Đang review', color: 'text-amber-600 bg-amber-50', borderColor: 'border-amber-300', dotColor: 'bg-amber-500' },
    DONE: { label: 'Hoàn thành', color: 'text-emerald-600 bg-emerald-50', borderColor: 'border-emerald-300', dotColor: 'bg-emerald-500' },
    CANCELLED: { label: 'Đã huỷ', color: 'text-red-500 bg-red-50', borderColor: 'border-red-200', dotColor: 'bg-red-400' },
};

export const TASK_PRIORITY_META: Record<TaskPriority, {
    label: string;
    color: string;
    stripe: string;   // left border stripe color on TaskCard
}> = {
    HIGH: { label: 'Cao', color: 'text-red-600 bg-red-50 border-red-200', stripe: 'bg-red-400' },
    MEDIUM: { label: 'Trung bình', color: 'text-amber-600 bg-amber-50 border-amber-200', stripe: 'bg-amber-400' },
    LOW: { label: 'Thấp', color: 'text-slate-500 bg-slate-50 border-slate-200', stripe: 'bg-slate-300' },
};

/** Status transitions — Hick's Law: show only valid next steps */
export const MEMBER_NEXT_STATUS: Partial<Record<TaskStatus, TaskStatus>> = {
    TODO: 'IN_PROGRESS',
    IN_PROGRESS: 'IN_REVIEW',
    IN_REVIEW: 'DONE',
    // DONE & CANCELLED = terminal, no next
};
