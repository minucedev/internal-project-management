import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { TaskCard } from './TaskCard';
import { TASK_STATUS_META, type Task, type TaskStatus, type TaskPermissions } from '../../types/task.types';

interface KanbanColumnProps {
    status: TaskStatus;
    tasks: Task[];
    getPermissions: (task: Task) => TaskPermissions;
    onAddTask: (status: TaskStatus) => void;
    onEdit: (task: Task) => void;
    onDelete: (taskId: number) => void;
    onChangeStatus: (taskId: number, status: TaskStatus) => void;
    onSelfAssign: (taskId: number) => void;
    onOpenDetail: (task: Task) => void;
    canCreate: boolean;
}

export const KanbanColumn = ({
    status, tasks, getPermissions, onAddTask,
    onEdit, onDelete, onChangeStatus, onSelfAssign, onOpenDetail, canCreate,
}: KanbanColumnProps) => {
    const [collapsed, setCollapsed] = useState(status === 'CANCELLED');
    const meta = TASK_STATUS_META[status];

    return (
        <div className="flex flex-col min-w-0">
            {/* Column header */}
            <div
                className={twMerge(
                    'flex items-center justify-between px-3 py-2.5 rounded-xl border mb-3 cursor-pointer select-none',
                    meta.borderColor, 'bg-white',
                )}
                onClick={() => setCollapsed((c) => !c)}
            >
                <div className="flex items-center gap-2">
                    <span className={twMerge('w-2.5 h-2.5 rounded-full', meta.dotColor)} />
                    <span className="text-sm font-bold text-gray-800">{meta.label}</span>
                    <span className={twMerge(
                        'text-xs font-bold px-2 py-0.5 rounded-full',
                        meta.color,
                    )}>
                        {tasks.length}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    {canCreate && !collapsed && (
                        <button
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            onClick={(e) => { e.stopPropagation(); onAddTask(status); }}
                            title={`Thêm vào ${meta.label}`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    )}
                    {/* Collapse toggle */}
                    <svg
                        className={twMerge('w-4 h-4 text-slate-400 transition-transform', collapsed && '-rotate-90')}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Cards */}
            {!collapsed && (
                <div className="flex flex-col gap-2.5 min-h-[80px]">
                    {tasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-xs">Trống</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                permissions={getPermissions(task)}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onChangeStatus={onChangeStatus}
                                onSelfAssign={onSelfAssign}
                                onOpenDetail={onOpenDetail}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
