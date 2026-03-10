import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { twMerge } from 'tailwind-merge';
import type { ProjectRole } from '../../types';
import type { MemberResponse } from '../../types';
import type { Task, TaskPriority, TaskStatus } from '../../types/task.types';

// ─── Schema ────────────────────────────────────────────────

const schema = z.object({
    title: z.string().min(1, 'Tiêu đề không được để trống').max(255),
    description: z.string().max(2000).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH'] as const),
    deadline: z.string().optional(),
    assigneeId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ─── Props ─────────────────────────────────────────────────

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        title: string; description?: string; priority: TaskPriority;
        deadline?: string; assigneeId?: number;
    }) => void;
    isSubmitting: boolean;
    defaultStatus: TaskStatus;
    role: ProjectRole;
    members: MemberResponse[];
    editingTask?: Task;   // if set = edit mode
}

export const CreateTaskModal = ({
    isOpen, onClose, onSubmit, isSubmitting, role, members, editingTask,
}: CreateTaskModalProps) => {
    const isEdit = !!editingTask;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            priority: 'MEDIUM',
            title: '', description: '', deadline: '', assigneeId: '',
        },
    });

    // Populate form when editing
    useEffect(() => {
        if (editingTask) {
            reset({
                title: editingTask.title,
                description: editingTask.description ?? '',
                priority: editingTask.priority,
                deadline: editingTask.deadline ? editingTask.deadline.split('T')[0] : '',
                assigneeId: editingTask.assigneeId ? String(editingTask.assigneeId) : '',
            });
        } else {
            reset({ priority: 'MEDIUM', title: '', description: '', deadline: '', assigneeId: '' });
        }
    }, [editingTask, reset, isOpen]);

    if (!isOpen) return null;

    const handleFormSubmit = (values: FormValues) => {
        onSubmit({
            title: values.title,
            description: values.description,
            priority: values.priority,
            deadline: values.deadline || undefined,
            assigneeId: values.assigneeId ? Number(values.assigneeId) : undefined,
        });
    };

    const inputCls = 'w-full px-3 py-2 rounded-xl border border-gray-200 hover:border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-[slideUp_0.2s_ease-out]">
                {/* Accent stripe — visual anchor */}
                <div className="h-1 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-500" />

                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">
                        {isEdit ? 'Chỉnh sửa công việc' : 'Tạo công việc mới'}
                    </h2>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-5 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <input {...register('title')} placeholder="Nhập tiêu đề công việc..."
                            className={twMerge(inputCls, errors.title && 'border-red-400 bg-red-50 focus:ring-red-500')} />
                        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                        <textarea {...register('description')} rows={3} placeholder="Chi tiết công việc... (tùy chọn)"
                            className={twMerge(inputCls, 'resize-none')} />
                    </div>

                    {/* Priority + Deadline */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ưu tiên</label>
                            <select {...register('priority')} className={twMerge(inputCls, 'bg-white')}>
                                <option value="HIGH">🔴 Cao</option>
                                <option value="MEDIUM">🟡 Trung bình</option>
                                <option value="LOW">⚪ Thấp</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hạn chót</label>
                            <input {...register('deadline')} type="date" className={inputCls} />
                        </div>
                    </div>

                    {/* Assignee — Leader only (US-03 vs US-04) */}
                    {role === 'LEADER' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giao cho</label>
                            <select {...register('assigneeId')} className={twMerge(inputCls, 'bg-white')}>
                                <option value="">— Chưa giao —</option>
                                {members.filter((m) => m.statusInProject === 'ACTIVE').map((m) => (
                                    <option key={m.userId} value={String(m.userId)}>{m.username}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50">
                            Hủy
                        </button>
                        <button type="submit" disabled={isSubmitting}
                            className="px-5 py-2 text-sm font-semibold text-white bg-linear-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
                            {isSubmitting && (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                            )}
                            {isEdit ? 'Lưu thay đổi' : 'Tạo công việc'}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};
