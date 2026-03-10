import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { KanbanColumn } from './KanbanColumn';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskDetailModal } from './TaskDetailModal';
import { getTaskPermissions } from '../../utils/taskPermissions';
import {
    useTasks, useCreateTask, useUpdateTask, useChangeStatus, useAssignTask, useDeleteTask,
} from '../../hooks/useTasks';
import { TASK_STATUS_ORDER, type Task, type TaskStatus } from '../../types/task.types';
import type { ProjectRole, MemberResponse } from '../../types';

interface TaskBoardProps {
    projectId: string;
    role: ProjectRole;
    currentUserId: number;
    members: MemberResponse[];
}

export const TaskBoard = ({ projectId, role, currentUserId, members }: TaskBoardProps) => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const { data: tasks = [], isLoading } = useTasks(projectId);
    const createTask = useCreateTask(projectId);
    const updateTask = useUpdateTask(projectId);
    const changeStatus = useChangeStatus(projectId);
    const assignTask = useAssignTask(projectId);
    const deleteTask = useDeleteTask(projectId);

    // Pure function — no hook violation (hooks only in hooks/components)
    const getPermissions = (task: Task) => getTaskPermissions({ role, task, currentUserId });

    const tasksByStatus = TASK_STATUS_ORDER.reduce<Record<TaskStatus, Task[]>>((acc, s) => {
        acc[s] = tasks.filter((t) => t.status === s);
        return acc;
    }, {} as Record<TaskStatus, Task[]>);

    const canCreate = role === 'LEADER' || role === 'MEMBER';

    const handleOpenDetail = (task: Task) => {
        setSelectedTask(task);
        setDetailModalOpen(true);
    };

    const handleEdit = () => {
        if (!selectedTask) return;
        setEditingTask(selectedTask);
        setCreateModalOpen(true);
    };

    const handleCreateSubmit = (data: Parameters<typeof createTask.mutate>[0]) => {
        if (editingTask) {
            updateTask.mutate({ taskId: editingTask.id, data }, {
                onSuccess: () => { setCreateModalOpen(false); setEditingTask(null); },
            });
        } else {
            createTask.mutate(data, { onSuccess: () => setCreateModalOpen(false) });
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-5 gap-4 animate-pulse">
                {TASK_STATUS_ORDER.map((s) => (
                    <div key={s} className="space-y-3">
                        <div className="h-10 bg-slate-200 rounded-xl" />
                        {[1, 2].map((i) => <div key={i} className="h-28 bg-slate-100 rounded-xl" />)}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            {/* Board header */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-800">Kanban Board</h2>
                {canCreate && (
                    <button
                        onClick={() => { setEditingTask(null); setCreateModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-linear-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-500/25 transition-all active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Tạo công việc
                    </button>
                )}
            </div>

            {/* Kanban columns — 5-column scroll */}
            <div className={twMerge(
                'grid gap-4 overflow-x-auto pb-4',
                'grid-cols-5', // default 5 cols desktop
            )}>
                {TASK_STATUS_ORDER.map((status) => (
                    <KanbanColumn
                        key={status}
                        status={status}
                        tasks={tasksByStatus[status]}
                        getPermissions={getPermissions}
                        canCreate={canCreate}
                        onAddTask={() => { setEditingTask(null); setCreateModalOpen(true); }}
                        onEdit={(task) => { setEditingTask(task); setCreateModalOpen(true); }}
                        onDelete={(taskId) => deleteTask.mutate(taskId)}
                        onChangeStatus={(taskId, s) => changeStatus.mutate({ taskId, status: s })}
                        onSelfAssign={(taskId) => assignTask.mutate({ taskId, data: { assigneeId: currentUserId } })}
                        onOpenDetail={handleOpenDetail}
                    />
                ))}
            </div>

            {/* Modals */}
            <CreateTaskModal
                isOpen={createModalOpen}
                onClose={() => { setCreateModalOpen(false); setEditingTask(null); }}
                onSubmit={handleCreateSubmit}
                isSubmitting={createTask.isPending || updateTask.isPending}
                defaultStatus="TODO"
                role={role}
                members={members}
                editingTask={editingTask ?? undefined}
            />

            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    isOpen={detailModalOpen}
                    onClose={() => { setDetailModalOpen(false); setSelectedTask(null); }}
                    permissions={getPermissions(selectedTask)}
                    role={role}
                    members={members}
                    onEdit={handleEdit}
                    onDelete={(taskId) => { deleteTask.mutate(taskId); }}
                    onChangeStatus={(taskId, s) => { changeStatus.mutate({ taskId, status: s }); }}
                    onSelfAssign={(taskId) => { assignTask.mutate({ taskId, data: { assigneeId: currentUserId } }); }}
                    onAssign={(taskId, assigneeId) => { assignTask.mutate({ taskId, data: { assigneeId } }); }}
                    isSubmitting={changeStatus.isPending || assignTask.isPending}
                />
            )}
        </>
    );
};
