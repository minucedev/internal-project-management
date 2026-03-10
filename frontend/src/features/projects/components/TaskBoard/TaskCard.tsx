import { useState } from 'react';
import { isPast, isToday, format } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import { Avatar } from '@/shared/components/ui';
import {
    TASK_PRIORITY_META, TASK_STATUS_META, type Task, type TaskStatus, type TaskPermissions,
} from '../../types/task.types';

// ─── Sub-components ────────────────────────────────────────

const PriorityBadge = ({ priority }: { priority: Task['priority'] }) => {
    const m = TASK_PRIORITY_META[priority];
    return (
        <span className={twMerge('inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border', m.color)}>
            <span className={twMerge('w-1.5 h-1.5 rounded-full', m.stripe)} />
            {m.label}
        </span>
    );
};

const DeadlineBadge = ({ deadline, isTerminal }: { deadline?: string; isTerminal: boolean }) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    // Overdue logic only applies if NOT terminal
    const overdue = !isTerminal && isPast(date) && !isToday(date);
    return (
        <span className={twMerge(
            'text-xs font-medium flex items-center gap-1',
            overdue ? 'text-red-500' : 'text-slate-400',
        )}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {overdue && '⚠ '}{format(date, 'dd/MM')}
        </span>
    );
};

// ─── Props ─────────────────────────────────────────────────

interface TaskCardProps {
    task: Task;
    permissions: TaskPermissions;
    onEdit: (task: Task) => void;
    onDelete: (taskId: number) => void;
    onChangeStatus: (taskId: number, status: TaskStatus) => void;
    onSelfAssign: (taskId: number) => void;
    onOpenDetail: (task: Task) => void;
}

// ─── TaskCard ──────────────────────────────────────────────

export const TaskCard = ({
    task, permissions,
    onEdit, onDelete, onChangeStatus, onSelfAssign, onOpenDetail,
}: TaskCardProps) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const isUnassigned = task.assignee === null;
    const isDone = task.status === 'DONE';
    const isTerminal = task.status === 'DONE' || task.status === 'CANCELLED';
    const m = TASK_PRIORITY_META[task.priority];

    return (
        <div
            className={twMerge(
                // Gestalt Figure/Ground: card elevates on hover
                'group relative bg-white rounded-xl transition-all duration-200 cursor-pointer',
                'hover:shadow-md hover:-translate-y-0.5',
                // Unassigned visual — visually distinct per US-02
                isUnassigned
                    ? 'border-2 border-dashed border-slate-300 bg-slate-50/60'
                    : 'border border-gray-100 shadow-sm',
            )}
            onClick={() => onOpenDetail(task)}
        >
            {/* Priority stripe — Gestalt Serial Position: leftmost = first seen */}
            <div className={twMerge('absolute left-0 top-3 bottom-3 w-1 rounded-r-full', m.stripe)} />

            <div className="pl-4 pr-3 pt-3 pb-3">
                {/* Title row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <p className={twMerge(
                        'text-sm font-semibold text-gray-900 leading-snug flex-1 line-clamp-2',
                        isDone && 'line-through text-slate-400',
                    )}>
                        {task.title}
                    </p>

                    {/* Menu ⋮ — only visible on hover, minimizes Hick's Law cognitive load */}
                    {(permissions.canEdit || permissions.canDelete || permissions.canChangeStatus) && (
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setMenuOpen((v) => !v)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
                                </svg>
                            </button>

                            {menuOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                    <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[168px]">
                                        {/* Status options (only valid next statuses — Hick's Law) */}
                                        {permissions.availableStatuses.map((s) => (
                                            <button
                                                key={s}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 flex items-center gap-2"
                                                onClick={() => { onChangeStatus(task.id, s); setMenuOpen(false); }}
                                            >
                                                <span className={twMerge('w-2 h-2 rounded-full', TASK_STATUS_META[s].dotColor)} />
                                                {TASK_STATUS_META[s].label}
                                            </button>
                                        ))}
                                        {permissions.availableStatuses.length > 0 && (
                                            <div className="my-1 border-t border-gray-100" />
                                        )}
                                        {permissions.canEdit && (
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 flex items-center gap-2"
                                                onClick={() => { onEdit(task); setMenuOpen(false); }}
                                            >
                                                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Chỉnh sửa
                                            </button>
                                        )}
                                        {permissions.canDelete && (
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                onClick={() => { onDelete(task.id); setMenuOpen(false); }}
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Xóa
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Description preview */}
                {task.description && (
                    <p className="text-xs text-slate-400 line-clamp-1 mb-2">{task.description}</p>
                )}

                {/* Footer row — Gestalt Proximity: related info grouped together */}
                <div className="flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <PriorityBadge priority={task.priority} />
                        <DeadlineBadge deadline={task.deadline} isTerminal={isTerminal} />
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                        {/* Self-assign button — prominent for Unassigned + Member */}
                        {permissions.canSelfAssign && (
                            <button
                                className="text-xs text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full transition-colors font-medium"
                                onClick={(e) => { e.stopPropagation(); onSelfAssign(task.id); }}
                            >
                                Nhận
                            </button>
                        )}
                        {task.assignee ? (
                            <Avatar name={task.assignee.username} src={task.assignee.avatarUrl} size="xs" />
                        ) : (
                            <span className="text-slate-300 text-xs">—</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
