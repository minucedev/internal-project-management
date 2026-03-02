import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Spinner,
    Tabs,
    Dropdown,
    Button,
    ConfirmDialog,
    FormInput,
    Textarea,
    DateInput,
    type Tab,
    type DropdownItem,
} from '@/shared/components/ui';
import { useProject, useDeleteProject, useUpdateProject } from '../hooks';
import { MemberTable, InviteMemberModal } from '../components';
import { APP_ROUTES } from '@/shared/constants/routes.constants';
import { PROJECT_MESSAGES } from '../constants';
import { projectFormSchema } from '../utils/validation';
import type { ProjectFormData } from '../types';

export const ProjectDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: project, isLoading } = useProject(id!);
    const deleteProject = useDeleteProject();
    const updateProject = useUpdateProject(id!);

    const [activeTab, setActiveTab] = useState('members');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);

    const isLeader = project?.currentUserRole === 'LEADER';

    // Form for Settings tab
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectFormSchema),
    });

    // Update form when project data loads
    useEffect(() => {
        if (project) {
            reset({
                name: project.name,
                description: project.description || '',
                startDate: project.startDate.split('T')[0],
                endDate: project.endDate.split('T')[0],
            });
        }
    }, [project, reset]);

    const tabs: Tab[] = [
        {
            key: 'board',
            label: 'Board',
            icon: (
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
        },
        {
            key: 'members',
            label: 'Members',
            icon: (
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
        {
            key: 'settings',
            label: 'Settings',
            icon: (
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            disabled: !isLeader,
        },
    ];

    const dropdownItems: DropdownItem[] = [
        {
            key: 'delete',
            label: 'Xóa dự án',
            icon: (
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
            danger: true,
            onClick: () => setIsDeleteDialogOpen(true),
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Không tìm thấy dự án</p>
            </div>
        );
    }

    const formatDate = (dateString: string) => format(new Date(dateString), 'dd/MM/yyyy');

    return (
        <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <Link to={APP_ROUTES.DASHBOARD.ROOT} className="hover:text-blue-600">
                    Dashboard
                </Link>
                <span>/</span>
                <Link to={APP_ROUTES.DASHBOARD.PROJECTS} className="hover:text-blue-600">
                    Projects
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">{project.name}</span>
            </nav>

            {/* Project Header */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formatDate(project.startDate)} → {formatDate(project.endDate)}</span>
                        </div>
                    </div>

                    {isLeader && (
                        <Dropdown trigger={
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="5" r="2" />
                                    <circle cx="12" cy="12" r="2" />
                                    <circle cx="12" cy="19" r="2" />
                                </svg>
                            </button>
                        } items={dropdownItems} />
                    )}
                </div>
            </div>

            {/* Tabs */}
            <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab}>
                {activeTab === 'board' && (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon - Sprint 2</h3>
                        <p className="text-gray-500">Kanban board sẽ được triển khai trong sprint tiếp theo</p>
                    </div>
                )}

                {activeTab === 'members' && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Thành viên dự án</h2>
                            {isLeader && (
                                <Button onClick={() => setIsInviteMemberModalOpen(true)}>
                                    <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    Mời thành viên
                                </Button>
                            )}
                        </div>

                        {/* Member Table */}
                        <MemberTable
                            projectId={project.id}
                            members={project.members || []}
                            isCurrentUserLeader={isLeader}
                        />
                    </div>
                )}

                {activeTab === 'settings' && isLeader && (
                    <div className="space-y-6">
                        {/* Project Information */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin dự án</h2>

                            <form onSubmit={handleSubmit((data) => updateProject.mutate(data))} className="space-y-5">
                                <FormInput
                                    label="Tên dự án"
                                    name="name"
                                    register={register}
                                    errors={errors}
                                    placeholder="Nhập tên dự án"
                                    disabled={updateProject.isPending}
                                    required
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mô tả
                                    </label>
                                    <Textarea
                                        {...register('description')}
                                        placeholder="Nhập mô tả dự án (tùy chọn)"
                                        rows={4}
                                        disabled={updateProject.isPending}
                                        error={errors.description?.message}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ngày bắt đầu <span className="text-red-500">*</span>
                                        </label>
                                        <DateInput
                                            {...register('startDate')}
                                            disabled={updateProject.isPending}
                                            error={errors.startDate?.message}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ngày kết thúc <span className="text-red-500">*</span>
                                        </label>
                                        <DateInput
                                            {...register('endDate')}
                                            disabled={updateProject.isPending}
                                            error={errors.endDate?.message}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        isLoading={updateProject.isPending}
                                        disabled={updateProject.isPending}
                                    >
                                        Lưu thay đổi
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-red-200">
                            <h2 className="text-xl font-semibold text-red-600 mb-4">🚨 Danger Zone</h2>
                            <div className="bg-red-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Xóa dự án này</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến dự án sẽ bị xóa vĩnh viễn.
                                </p>
                                <Button
                                    variant="danger"
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                                >
                                    Xóa dự án
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Tabs>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={() => {
                    deleteProject.mutate(project.id);
                }}
                title={PROJECT_MESSAGES.DELETE_CONFIRM_TITLE}
                message={PROJECT_MESSAGES.DELETE_CONFIRM_MESSAGE}
                confirmText="Xóa"
                cancelText="Hủy"
                variant="danger"
                isLoading={deleteProject.isPending}
            />

            {/* Invite Member Modal */}
            {isInviteMemberModalOpen && (
                <InviteMemberModal
                    isOpen={isInviteMemberModalOpen}
                    onClose={() => setIsInviteMemberModalOpen(false)}
                    projectId={project.id}
                />
            )}
        </div>
    );
};

