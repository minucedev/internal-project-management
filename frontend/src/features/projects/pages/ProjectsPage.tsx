import { useState } from 'react';
import { Button, Input, EmptyState, ConfirmDialog } from '@/shared/components/ui';
import { useDebounce } from '@/shared/hooks';
import { useProjects, useDeleteProject } from '../hooks';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectFormModal } from '../components/ProjectFormModal';
import type { Project } from '../types';
import { PROJECT_MESSAGES } from '../constants';

export const ProjectsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

    const debouncedSearch = useDebounce(searchTerm, 300);
    const { data: projects, isLoading } = useProjects(debouncedSearch);
    const deleteProject = useDeleteProject();

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setIsCreateModalOpen(true);
    };

    const handleDeleteClick = (projectId: string) => {
        setDeletingProjectId(projectId);
    };

    const handleDeleteConfirm = () => {
        if (deletingProjectId) {
            deleteProject.mutate(deletingProjectId, {
                onSuccess: () => {
                    setDeletingProjectId(null);
                },
            });
        }
    };

    // Loading state with skeleton cards
    if (isLoading) {
        return (
            <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
                </div>

                {/* Skeleton Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
                        >
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Empty state
    if (!projects || projects.length === 0) {
        if (searchTerm) {
            // No results for search
            return (
                <div>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Input
                                type="text"
                                placeholder="Tìm kiếm dự án..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64"
                                leftIcon={
                                    <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                }
                            />
                            <Button onClick={() => setIsCreateModalOpen(true)}>
                                <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M12 4v16m8-8H4" />
                                </svg>
                                Tạo dự án
                            </Button>
                        </div>
                    </div>

                    <EmptyState
                        title="Không tìm thấy dự án nào"
                        description={`Không có dự án nào khớp với "${searchTerm}"`}
                        icon={
                            <svg className="w-24 h-24 text-gray-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        }
                    />
                </div>
            );
        }

        // No projects at all
        return (
            <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
                </div>

                <EmptyState
                    title="Chưa có dự án nào"
                    description="Tạo dự án đầu tiên của bạn để bắt đầu quản lý công việc hiệu quả hơn"
                    icon={
                        <svg className="w-24 h-24 text-gray-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                    }
                    action={{
                        label: 'Tạo dự án mới',
                        onClick: () => setIsCreateModalOpen(true),
                    }}
                />
            </div>
        );
    }

    // Projects list
    return (
        <div>
            {/* Header with Search and Create Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Input
                        type="text"
                        placeholder="Tìm kiếm dự án..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64"
                        leftIcon={
                            <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        }
                    />
                    <Button onClick={() => setIsCreateModalOpen(true)} className="whitespace-nowrap">
                        <svg className="w-5 h-5 sm:mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="hidden sm:inline">Tạo dự án</span>
                    </Button>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                    />
                ))}
            </div>

            {/* Create/Edit Project Modal */}
            <ProjectFormModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingProject(null);
                }}
                mode={editingProject ? 'edit' : 'create'}
                projectId={editingProject?.id}
                defaultValues={editingProject || undefined}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!deletingProjectId}
                onClose={() => setDeletingProjectId(null)}
                onConfirm={handleDeleteConfirm}
                title={PROJECT_MESSAGES.DELETE_CONFIRM_TITLE}
                message={PROJECT_MESSAGES.DELETE_CONFIRM_MESSAGE}
                confirmText="Xóa"
                cancelText="Hủy"
                variant="danger"
                isLoading={deleteProject.isPending}
            />
        </div>
    );
};
