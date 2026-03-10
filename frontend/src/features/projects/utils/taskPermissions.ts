import type { ProjectRole } from '../types';
import type { Task, TaskStatus, TaskPermissions } from '../types/task.types';
import { MEMBER_NEXT_STATUS } from '../types/task.types';

interface PermissionInput {
    role: ProjectRole;
    task: Task;
    currentUserId: number;
}

/**
 * Pure function version of task permission logic.
 * Use this in non-hook contexts (e.g., inside callbacks or map functions).
 * For hook contexts, use `useTaskPermission` from hooks/.
 */
export function getTaskPermissions({ role, task, currentUserId }: PermissionInput): TaskPermissions {
    const isLeader = role === 'LEADER';
    const isOwner = task.assigneeId === currentUserId;
    const isUnassigned = task.assignee === null;
    const isTerminal = task.status === 'DONE' || task.status === 'CANCELLED';

    const canSelfAssign = role === 'MEMBER' && isUnassigned;

    const canChangeStatus =
        (isLeader && !isTerminal) ||
        (role === 'MEMBER' && isOwner && !isTerminal);

    let availableStatuses: TaskStatus[] = [];
    if (isLeader && !isTerminal) {
        availableStatuses = (['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'CANCELLED'] as TaskStatus[])
            .filter((s) => s !== task.status);
    } else if (role === 'MEMBER' && isOwner && !isTerminal) {
        const next = MEMBER_NEXT_STATUS[task.status];
        availableStatuses = next ? [next] : [];
    }

    return {
        canEdit: isLeader,
        canDelete: isLeader && task.status === 'TODO',
        canAssign: isLeader,
        canSelfAssign,
        canChangeStatus,
        availableStatuses,
    };
}
