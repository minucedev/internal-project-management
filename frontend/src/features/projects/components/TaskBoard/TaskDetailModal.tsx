import { useState } from 'react';
import { format, isPast, isToday } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import { Avatar } from '@/shared/components/ui';
import {
    TASK_STATUS_META, TASK_PRIORITY_META, TASK_STATUS_ORDER,
    type Task, type TaskStatus, type TaskPermissions,
} from '../../types/task.types';
import type { ProjectRole } from '../../types';
import type { MemberResponse } from '../../types';

interface TaskDetailModalProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
    permissions: TaskPermissions;
    role: ProjectRole;
    members: MemberResponse[];
    onEdit: () => void;
    onDelete: (taskId: number) => void;
    onChangeStatus: (taskId: number, status: TaskStatus) => void;
    onSelfAssign: (taskId: number) => void;
    onAssign: (taskId: number, assigneeId: number | null) => void;
    isSubmitting: boolean;
}

export const TaskDetailModal = ({
    task, isOpen, onClose, permissions, role, members,
    onEdit, onDelete, onChangeStatus, onSelfAssign, onAssign, isSubmitting,
}: TaskDetailModalProps) => {
    const [showAssignDropdown, setShowAssignDropdown] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    if (!isOpen || !task) return null;
    const sm = TASK_STATUS_META[task.status];
    const pm = TASK_PRIORITY_META[task.priority];
    const isTerminal = task.status === 'DONE' || task.status === 'CANCELLED';
    const isOverdue = !isTerminal && task.deadline && isPast(new Date(task.deadline)) && !isToday(new Date(task.deadline));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-[slideIn_0.2s_ease-out]">
                {/* Status accent strip */}
                <div className={twMerge('h-1 w-full', sm.dotColor.replace('bg-', 'bg-'))} />

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <p className={twMerge('text-xl font-bold text-gray-900 leading-snug', task.status === 'DONE' && 'line-through text-slate-400')}>
                            {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className={twMerge('text-xs font-semibold px-2.5 py-1 rounded-full', sm.color)}>{sm.label}</span>
                            <span className={twMerge('text-xs font-semibold px-2 py-0.5 rounded-full border', pm.color)}>{pm.label}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4 max-h-[55vh] overflow-y-auto">
                    {/* Description */}
                    {task.description && (
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{task.description}</p>
                    )}

                    {/* Meta grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-xs text-gray-400 font-medium mb-1">Người thực hiện</p>
                            {task.assignee ? (
                                <div className="flex items-center gap-2">
                                    <Avatar name={task.assignee.username} src={task.assignee.avatarUrl} size="xs" />
                                    <span className="text-gray-700 font-medium">{task.assignee.username}</span>
                                </div>
                            ) : (
                                <span className="text-slate-400 italic text-xs">Chưa giao</span>
                            )}
                        </div>

                        <div>
                            <p className="text-xs text-gray-400 font-medium mb-1">Hạn chót</p>
                            {task.deadline ? (
                                <span className={twMerge('text-sm font-medium', isOverdue ? 'text-red-500' : 'text-gray-700')}>
                                    {isOverdue && '⚠ '}{format(new Date(task.deadline), 'dd/MM/yyyy')}
                                </span>
                            ) : (
                                <span className="text-slate-400 italic text-xs">Không có</span>
                            )}
                        </div>

                        <div>
                            <p className="text-xs text-gray-400 font-medium mb-1">Người tạo</p>
                            <div className="flex items-center gap-2">
                                <Avatar name={task.createdBy.username} src={task.createdBy.avatarUrl} size="xs" />
                                <span className="text-gray-700">{task.createdBy.username}</span>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-gray-400 font-medium mb-1">Ngày tạo</p>
                            <span className="text-gray-700">{format(new Date(task.createdAt), 'dd/MM/yyyy')}</span>
                        </div>

                        {task.completedAt && (
                            <div className="col-span-2">
                                <p className="text-xs text-gray-400 font-medium mb-1">Hoàn thành lúc</p>
                                <span className="text-emerald-600 font-medium">{format(new Date(task.completedAt), 'dd/MM/yyyy HH:mm')}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action footer — render based on permissions */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-2 flex-wrap">

                    {/* VIEWER: no actions */}
                    {role === 'VIEWER' && (
                        <p className="text-xs text-slate-400 italic">Bạn chỉ có quyền xem.</p>
                    )}

                    {/* MEMBER self-assign */}
                    {permissions.canSelfAssign && (
                        <button
                            onClick={() => { onSelfAssign(task.id); onClose(); }}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
                        >
                            Nhận việc này
                        </button>
                    )}

                    {/* MEMBER change status (forward only) */}
                    {permissions.canChangeStatus && permissions.availableStatuses.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {permissions.availableStatuses.map((s) => (
                                <button key={s}
                                    onClick={() => { onChangeStatus(task.id, s); onClose(); }}
                                    disabled={isSubmitting}
                                    className={twMerge(
                                        'px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors',
                                        TASK_STATUS_META[s].color, TASK_STATUS_META[s].borderColor,
                                        'hover:opacity-80',
                                    )}
                                >
                                    → {TASK_STATUS_META[s].label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* LEADER actions */}
                    {role === 'LEADER' && (
                        <div className="flex items-center gap-2 ml-auto flex-wrap">
                            {/* Assign dropdown */}
                            {permissions.canAssign && (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowAssignDropdown((v) => !v)}
                                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-colors"
                                    >
                                        Giao việc ▾
                                    </button>
                                    {showAssignDropdown && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setShowAssignDropdown(false)} />
                                            <div className="absolute bottom-full mb-1 left-0 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[160px]">
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm text-slate-500 hover:bg-slate-50"
                                                    onClick={() => { onAssign(task.id, null); setShowAssignDropdown(false); }}
                                                >
                                                    — Bỏ giao —
                                                </button>
                                                {members.filter((m) => m.statusInProject === 'ACTIVE').map((m) => (
                                                    <button key={m.userId}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-50"
                                                        onClick={() => { onAssign(task.id, m.userId); setShowAssignDropdown(false); }}
                                                    >
                                                        {m.username}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Status dropdown — all statuses except terminal-from-terminal */}
                            {!['DONE', 'CANCELLED'].includes(task.status) && (
                                <select
                                    value={task.status}
                                    onChange={(e) => onChangeStatus(task.id, e.target.value as TaskStatus)}
                                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {TASK_STATUS_ORDER.map((s) => (
                                        <option key={s} value={s}>{TASK_STATUS_META[s].label}</option>
                                    ))}
                                </select>
                            )}

                            {/* Edit */}
                            {permissions.canEdit && (
                                <button onClick={() => { onEdit(); onClose(); }}
                                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-colors"
                                >
                                    Sửa
                                </button>
                            )}

                            {/* Delete — only for TODO */}
                            {permissions.canDelete && !showDeleteConfirm && (
                                <button onClick={() => setShowDeleteConfirm(true)}
                                    className="px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded-xl transition-colors"
                                >
                                    Xóa
                                </button>
                            )}
                            {showDeleteConfirm && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-red-600 font-medium">Xác nhận xóa?</span>
                                    <button onClick={() => { onDelete(task.id); onClose(); }}
                                        className="px-3 py-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
                                        Xóa
                                    </button>
                                    <button onClick={() => setShowDeleteConfirm(false)}
                                        className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                        Hủy
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
        </div>
    );
};
