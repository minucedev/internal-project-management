import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import * as taskApi from '../api/taskApi';
import type {
    Task, TaskStatus,
    CreateTaskRequest, UpdateTaskMetadataRequest, AssignTaskRequest,
} from '../types/task.types';

const taskKeys = {
    all: (pid: string) => ['tasks', pid] as const,
    detail: (pid: string, tid: number) => ['tasks', pid, tid] as const,
};

// ─── Read ──────────────────────────────────────────────────

export const useTasks = (projectId: string) =>
    useQuery({
        queryKey: taskKeys.all(projectId),
        queryFn: () => taskApi.getTasks(projectId),
        staleTime: 30_000,
    });

export const useTaskDetail = (projectId: string, taskId: number) =>
    useQuery({
        queryKey: taskKeys.detail(projectId, taskId),
        queryFn: () => taskApi.getTaskDetail(projectId, taskId),
    });

// ─── Create ────────────────────────────────────────────────

export const useCreateTask = (projectId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateTaskRequest) => taskApi.createTask(projectId, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: taskKeys.all(projectId) });
            toast.success('Tạo công việc thành công!');
        },
        onError: () => toast.error('Không thể tạo công việc. Thử lại nhé.'),
    });
};

// ─── Update metadata (Leader only) ────────────────────────

export const useUpdateTask = (projectId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ taskId, data }: { taskId: number; data: UpdateTaskMetadataRequest }) =>
            taskApi.updateTaskMetadata(projectId, taskId, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: taskKeys.all(projectId) });
            toast.success('Đã cập nhật công việc.');
        },
        onError: () => toast.error('Cập nhật thất bại. Thử lại nhé.'),
    });
};

// ─── Change status — OPTIMISTIC (Doherty Threshold <400ms) ─

export const useChangeStatus = (projectId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ taskId, status }: { taskId: number; status: TaskStatus }) =>
            taskApi.changeTaskStatus(projectId, taskId, { status }),

        onMutate: async ({ taskId, status }) => {
            await qc.cancelQueries({ queryKey: taskKeys.all(projectId) });
            const prev = qc.getQueryData<Task[]>(taskKeys.all(projectId));

            // Optimistic: update cache immediately
            qc.setQueryData<Task[]>(taskKeys.all(projectId), (old = []) =>
                old.map((t) => (t.id === taskId ? { ...t, status } : t))
            );
            return { prev };
        },

        onError: (_err, _vars, ctx) => {
            // Roll back on failure
            if (ctx?.prev) qc.setQueryData(taskKeys.all(projectId), ctx.prev);
            toast.error('Đổi trạng thái thất bại — đã hoàn tác.');
        },

        onSettled: () => {
            qc.invalidateQueries({ queryKey: taskKeys.all(projectId) });
        },
    });
};

// ─── Assign (Leader pick member, or Member self-assign) ───

export const useAssignTask = (projectId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ taskId, data }: { taskId: number; data: AssignTaskRequest }) =>
            taskApi.assignTask(projectId, taskId, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: taskKeys.all(projectId) });
            toast.success('Đã cập nhật người thực hiện.');
        },
        onError: () => toast.error('Gán task thất bại. Thử lại nhé.'),
    });
};

// ─── Delete (Leader only, guard TODO) ─────────────────────

export const useDeleteTask = (projectId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (taskId: number) => taskApi.deleteTask(projectId, taskId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: taskKeys.all(projectId) });
            toast.success('Đã xóa công việc.');
        },
        onError: (err) => toast.error(err instanceof Error ? err.message : 'Xóa thất bại.'),
    });
};
