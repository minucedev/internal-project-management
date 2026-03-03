import { useState } from 'react';
import { Pagination } from 'antd';
import { Button, Input, EmptyState, ConfirmDialog } from '@/shared/components/ui';
import { useDebounce } from '@/shared/hooks';
import { useProjects, useDeleteProject } from '../hooks';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectFormModal } from '../components/ProjectFormModal';
import { TrashedProjectsDrawer } from '../components/TrashedProjectsDrawer';
import type { ProjectResponse, ProjectRole, GetProjectsParams } from '../types';

// Role filter tabs
const ROLE_TABS: { label: string; value: ProjectRole | undefined }[] = [
    { label: 'Tất cả', value: undefined },
    { label: 'Leader', value: 'LEADER' },
    { label: 'Member', value: 'MEMBER' },
    { label: 'Viewer', value: 'VIEWER' },
];

// Sort options
const SORT_OPTIONS: { label: string; value: string }[] = [
    { label: 'Mới nhất', value: 'createdAt' },
    { label: 'Tên A→Z', value: 'name' },
    { label: 'Ngày bắt đầu', value: 'startDate' },
    { label: 'Ngày kết thúc', value: 'endDate' },
];

const PAGE_SIZE = 9; // 3-column grid

export const ProjectsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeRole, setActiveRole] = useState<ProjectRole | undefined>(undefined);
    const [sort, setSort] = useState('createdAt');
    const [page, setPage] = useState(0); // 0-indexed for BE
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<ProjectResponse | null>(null);
    const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
    const [isTrashOpen, setIsTrashOpen] = useState(false);

    const debouncedSearch = useDebounce(searchTerm, 300);

    const queryParams: GetProjectsParams = {
        page,
        size: PAGE_SIZE,
        role: activeRole,
        sort,
    };

    const { data: projectList, isLoading } = useProjects(queryParams);
    const deleteProject = useDeleteProject();

    const projects = projectList?.projects ?? [];
    const totalElements = projectList?.totalElements ?? 0;

    const handleEdit = (project: ProjectResponse) => {
        setEditingProject(project);
        setIsCreateModalOpen(true);
    };

    const handleDeleteClick = (projectId: string) => {
        setDeletingProjectId(projectId);
    };

    const handleDeleteConfirm = () => {
        if (deletingProjectId) {
            deleteProject.mutate(
                { id: deletingProjectId, hardDelete: false },
                { onSuccess: () => setDeletingProjectId(null) },
            );
        }
    };

    // Reset page when filters change
    const handleRoleChange = (role: ProjectRole | undefined) => {
        setActiveRole(role);
        setPage(0);
    };

    const handleSortChange = (value: string) => {
        setSort(value);
        setPage(0);
    };

    // ── Header ───────────────────────────────────────────────────────────────
    const Header = (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <Input
                    type="text"
                    placeholder="Tìm kiếm dự án..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-56"
                    leftIcon={
                        <svg className="w-4 h-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    }
                />
                {/* Trash bin */}
                <button
                    onClick={() => setIsTrashOpen(true)}
                    className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-700"
                    title="Thùng rác"
                >
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
                <Button onClick={() => setIsCreateModalOpen(true)} className="whitespace-nowrap">
                    <svg className="w-4 h-4 sm:mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden sm:inline">Tạo dự án</span>
                </Button>
            </div>
        </div>
    );

    // ── Filter bar ────────────────────────────────────────────────────────────
    const FilterBar = (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            {/* Role tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                {ROLE_TABS.map((tab) => (
                    <button
                        key={tab.label}
                        onClick={() => handleRoleChange(tab.value)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeRole === tab.value
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Sort select */}
            <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );

    // ── Loading skeleton ──────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div>
                {Header}
                {FilterBar}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(PAGE_SIZE)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse">
                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-1/3" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ── Filter projects client-side by search term ────────────────────────────
    const filteredProjects = debouncedSearch
        ? projects.filter((p) =>
            p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            p.description?.toLowerCase().includes(debouncedSearch.toLowerCase()),
        )
        : projects;

    // ── Empty state ───────────────────────────────────────────────────────────
    if (filteredProjects.length === 0) {
        return (
            <div>
                {Header}
                {FilterBar}
                <EmptyState
                    title={debouncedSearch ? `Không tìm thấy dự án nào cho "${debouncedSearch}"` : 'Chưa có dự án nào'}
                    description={debouncedSearch ? 'Thử tìm kiếm với từ khóa khác.' : 'Tạo dự án đầu tiên để bắt đầu quản lý công việc.'}
                    icon={
                        <svg className="w-20 h-20 text-gray-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                    }
                    action={!debouncedSearch ? { label: 'Tạo dự án mới', onClick: () => setIsCreateModalOpen(true) } : undefined}
                />

                {/* Modals always mounted */}
                <ProjectFormModal
                    isOpen={isCreateModalOpen}
                    onClose={() => { setIsCreateModalOpen(false); setEditingProject(null); }}
                    mode={editingProject ? 'edit' : 'create'}
                    projectId={editingProject ? String(editingProject.id) : undefined}
                    defaultValues={editingProject || undefined}
                />
                <TrashedProjectsDrawer open={isTrashOpen} onClose={() => setIsTrashOpen(false)} />
            </div>
        );
    }

    // ── Projects grid ─────────────────────────────────────────────────────────
    return (
        <div>
            {Header}
            {FilterBar}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                    />
                ))}
            </div>

            {/* Pagination — only when not searching client-side */}
            {!debouncedSearch && totalElements > PAGE_SIZE && (
                <div className="flex justify-center mt-4">
                    <Pagination
                        current={page + 1}           // Ant Design is 1-indexed
                        pageSize={PAGE_SIZE}
                        total={totalElements}
                        onChange={(p) => setPage(p - 1)}
                        showSizeChanger={false}
                        showTotal={(total) => `${total} dự án`}
                    />
                </div>
            )}

            {/* Create / Edit project modal */}
            <ProjectFormModal
                isOpen={isCreateModalOpen}
                onClose={() => { setIsCreateModalOpen(false); setEditingProject(null); }}
                mode={editingProject ? 'edit' : 'create'}
                projectId={editingProject ? String(editingProject.id) : undefined}
                defaultValues={editingProject || undefined}
            />

            {/* Soft delete confirmation */}
            <ConfirmDialog
                isOpen={!!deletingProjectId}
                onClose={() => setDeletingProjectId(null)}
                onConfirm={handleDeleteConfirm}
                title="Chuyển vào thùng rác"
                message="Dự án sẽ được chuyển vào thùng rác. Bạn có thể khôi phục lại từ thùng rác sau."
                confirmText="Chuyển vào thùng rác"
                cancelText="Hủy"
                variant="danger"
                isLoading={deleteProject.isPending}
            />

            {/* Trash bin drawer */}
            <TrashedProjectsDrawer open={isTrashOpen} onClose={() => setIsTrashOpen(false)} />
        </div>
    );
};
