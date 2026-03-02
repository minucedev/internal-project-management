import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Modal, Button, FormInput, Textarea, DateInput } from '@/shared/components/ui';
import { useCreateProject, useUpdateProject } from '../../hooks';
import { projectFormSchema } from '../../utils/validation';
import type { ProjectFormData, Project } from '../../types';

export interface ProjectFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    projectId?: string;
    defaultValues?: Partial<Project>;
}

export const ProjectFormModal = ({
    isOpen,
    onClose,
    mode,
    projectId,
    defaultValues,
}: ProjectFormModalProps) => {
    const createProject = useCreateProject();
    const updateProject = useUpdateProject(projectId || '');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: {
            name: defaultValues?.name || '',
            description: defaultValues?.description || '',
            startDate: defaultValues?.startDate || '',
            endDate: defaultValues?.endDate || '',
        },
    });

    // Reset form when modal opens/closes or defaultValues change
    useEffect(() => {
        if (isOpen) {
            reset({
                name: defaultValues?.name || '',
                description: defaultValues?.description || '',
                startDate: defaultValues?.startDate ? defaultValues.startDate.split('T')[0] : '',
                endDate: defaultValues?.endDate ? defaultValues.endDate.split('T')[0] : '',
            });
        }
    }, [isOpen, defaultValues, reset]);

    const onSubmit = (data: ProjectFormData) => {
        if (mode === 'create') {
            createProject.mutate(data, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else if (mode === 'edit' && projectId) {
            updateProject.mutate(data, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    const isLoading = createProject.isPending || updateProject.isPending;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={mode === 'create' ? 'Tạo dự án mới' : 'Chỉnh sửa dự án'}
            size="lg"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Project Name */}
                <FormInput
                    label="Tên dự án"
                    name="name"
                    register={register}
                    errors={errors}
                    placeholder="Nhập tên dự án"
                    disabled={isLoading}
                    required
                />

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả
                    </label>
                    <Textarea
                        {...register('description')}
                        placeholder="Nhập mô tả dự án (tùy chọn)"
                        rows={4}
                        disabled={isLoading}
                        error={errors.description?.message}
                    />
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ngày bắt đầu <span className="text-red-500">*</span>
                        </label>
                        <DateInput
                            {...register('startDate')}
                            disabled={isLoading}
                            error={errors.startDate?.message}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ngày kết thúc <span className="text-red-500">*</span>
                        </label>
                        <DateInput
                            {...register('endDate')}
                            disabled={isLoading}
                            error={errors.endDate?.message}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                        fullWidth
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        disabled={isLoading}
                        fullWidth
                    >
                        {mode === 'create' ? 'Tạo dự án' : 'Lưu thay đổi'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
