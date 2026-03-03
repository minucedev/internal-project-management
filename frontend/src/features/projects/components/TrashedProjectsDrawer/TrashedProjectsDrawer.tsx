import { format } from 'date-fns';
import { Drawer } from 'antd';
import { Button, EmptyState, Spinner, ConfirmDialog } from '@/shared/components/ui';
import { useTrashedProjects, useRestoreProject, useDeleteProject } from '../../hooks';
import { useState } from 'react';

interface TrashedProjectsDrawerProps {
    open: boolean;
    onClose: () => void;
}

export const TrashedProjectsDrawer = ({ open, onClose }: TrashedProjectsDrawerProps) => {
    const { data: trashedProjects, isLoading } = useTrashedProjects();
    const restoreProject = useRestoreProject();
    const deleteProject = useDeleteProject();
    const [hardDeleteId, setHardDeleteId] = useState<number | null>(null);

    const formatDate = (dateString?: string) =>
        dateString ? format(new Date(dateString), 'dd/MM/yyyy HH:mm') : '—';

    const handleHardDeleteConfirm = () => {
        if (hardDeleteId) {
            deleteProject.mutate(
                { id: String(hardDeleteId), hardDelete: true },
                { onSuccess: () => setHardDeleteId(null) },
            );
        }
    };

    return (
        <>
            <Drawer
                title={
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Thùng rác</span>
                        {trashedProjects && trashedProjects.length > 0 && (
                            <span className="ml-auto text-sm font-normal text-gray-500">
                                {trashedProjects.length} dự án
                            </span>
                        )}
                    </div>
                }
                open={open}
                onClose={onClose}
                width={420}
                className="trashed-drawer"
            >
                {isLoading && (
                    <div className="flex justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                )}

                {!isLoading && (!trashedProjects || trashedProjects.length === 0) && (
                    <EmptyState
                        title="Thùng rác trống"
                        description="Chưa có dự án nào bị xóa."
                        icon={
                            <svg className="w-16 h-16 text-gray-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        }
                    />
                )}

                {!isLoading && trashedProjects && trashedProjects.length > 0 && (
                    <div className="space-y-3">
                        {trashedProjects.map((project) => (
                            <div
                                key={project.id}
                                className="border border-gray-200 rounded-xl p-4 bg-white hover:border-gray-300 transition-colors"
                            >
                                {/* Project info */}
                                <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{project.name}</h4>
                                {project.description && (
                                    <p className="text-sm text-gray-500 mb-2 line-clamp-1">{project.description}</p>
                                )}
                                <p className="text-xs text-gray-400 mb-3">
                                    🗑 Đã xóa lúc {formatDate(project.updatedAt)}
                                </p>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="flex-1"
                                        isLoading={restoreProject.isPending && restoreProject.variables === String(project.id)}
                                        onClick={() => restoreProject.mutate(String(project.id))}
                                    >
                                        Khôi phục
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        className="flex-1"
                                        onClick={() => setHardDeleteId(project.id)}
                                    >
                                        Xóa vĩnh viễn
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Drawer>

            {/* Hard delete confirmation */}
            <ConfirmDialog
                isOpen={!!hardDeleteId}
                onClose={() => setHardDeleteId(null)}
                onConfirm={handleHardDeleteConfirm}
                title="Xóa vĩnh viễn"
                message="Bạn có chắc chắn muốn xóa vĩnh viễn dự án này không? Hành động này không thể hoàn tác."
                confirmText="Xóa vĩnh viễn"
                cancelText="Hủy"
                variant="danger"
                isLoading={deleteProject.isPending}
            />
        </>
    );
};
