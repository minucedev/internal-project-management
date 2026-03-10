import type { ProjectRole } from '../types';
import type { Task, TaskStatus, TaskPermissions } from '../types/task.types';
import { MEMBER_NEXT_STATUS } from '../types/task.types';

interface UseTaskPermissionInput {
    role: ProjectRole;
    task: Task;
    currentUserId: number;
}

/**
 * Single source of truth for task permissions.
 * All components read flags from here — never check role directly.
 */
export function useTaskPermission({ role, task, currentUserId }: UseTaskPermissionInput): TaskPermissions {
    const isLeader = role === 'LEADER';
    const isOwner = task.assigneeId === currentUserId;
    const isUnassigned = task.assignee === null;
    const isTerminal = task.status === 'DONE' || task.status === 'CANCELLED';

    // ── canSelfAssign: Member + task has no assignee ──────────
    const canSelfAssign = role === 'MEMBER' && isUnassigned;

    // ── canChangeStatus ───────────────────────────────────────
    //   Leader: yes (unless terminal)
    //   Member: only their own task, only forward
    const canChangeStatus =
        (isLeader && !isTerminal) ||
        (role === 'MEMBER' && isOwner && !isTerminal);

    // ── availableStatuses (Hick's Law: only valid options) ────
    let availableStatuses: TaskStatus[] = [];
    if (isLeader && !isTerminal) {
        // Leader sees all statuses except keeping current (no-op) and terminal ones as source
        availableStatuses = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'CANCELLED']
            .filter((s) => s !== task.status) as TaskStatus[];
    } else if (role === 'MEMBER' && isOwner && !isTerminal) {
        // Member only sees the next status
        const next = MEMBER_NEXT_STATUS[task.status];
        availableStatuses = next ? [next] : [];
    }

    return {
        canEdit: isLeader,
        canDelete: isLeader && task.status === 'TODO',  // only TODO can be deleted
        canAssign: isLeader,
        canSelfAssign,
        canChangeStatus,
        availableStatuses,
    };
}
