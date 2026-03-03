import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Spinner,
    Tabs,
    Dropdown,
    Button,
    Input,
    ConfirmDialog,
    FormInput,
    Textarea,
    DateInput,
    type Tab,
    type DropdownItem,
} from '@/shared/components/ui';
import { useProjectDetail, useDeleteProject, useUpdateProject, useMembers } from '../hooks';
import { MemberTable, InviteMemberModal } from '../components';
import { APP_ROUTES } from '@/shared/constants/routes.constants';
import { PROJECT_MESSAGES } from '../constants';
import { projectFormSchema } from '../utils/validation';
import type { ProjectFormData } from '../types';

export const ProjectDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: project, isLoading } = useProjectDetail(id!);
    const deleteProject = useDeleteProject();
    const updateProject = useUpdateProject(id!);

    const [activeTab, setActiveTab] = useState('members');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);
    const [memberSearch, setMemberSearch] = useState('');
    const [includePending, setIncludePending] = useState(false);

    const isLeader = project?.currentUserRole === 'LEADER';

    // Fetch members separately for search/filter support
    const { data: memberList, isLoading: isMembersLoading } = useMembers(id!, {
        includePending: isLeader && includePending,
        size: 100, // fetch all for client-side search
    });

    // Client-side search filter
    const filteredMembers = useMemo(() => {
        const members = memberList?.members ?? project?.members ?? [];
        if (!memberSearch.trim()) return members;
        const q = memberSearch.toLowerCase();
        return members.filter(
            (m) =>
                m.username.toLowerCase().includes(q) ||
                m.email.toLowerCase().includes(q) ||
                m.positionTitle?.toLowerCase().includes(q),
        );
    }, [memberList, project?.members, memberSearch]);

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
                startDate: project.startDate?.split('T')[0] ?? '',
                endDate: project.endDate?.split('T')[0] ?? '',
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
            label: 'Chuyển vào thùng rác',
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

    const formatDate = (dateString?: string) =>
        dateString ? format(new Date(dateString), 'dd/MM/yyyy') : '—';

    return (
        <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <Link to={APP_ROUTES.DASHBOARD.ROOT} className="hover:text-blue-600">Dashboard</Link>
                <span>/</span>
                <Link to={APP_ROUTES.DASHBOARD.PROJECTS} className="hover:text-blue-600">Projects</Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">{project.name}</span>
            </nav>

            {/* Project Header */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                        {(project.startDate || project.endDate) && (
                            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                                <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{formatDate(project.startDate)} → {formatDate(project.endDate)}</span>
                            </div>
                        )}
                        {project.description && (
                            <p className="text-gray-500 text-sm max-w-xl">{project.description}</p>
                        )}
                    </div>

                    {isLeader && (
                        <Dropdown
                            trigger={
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="5" r="2" />
                                        <circle cx="12" cy="12" r="2" />
                                        <circle cx="12" cy="19" r="2" />
                                    </svg>
                                </button>
                            }
                            items={dropdownItems}
                        />
                    )}
                </div>

                {/* Member stats bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
                    {[
                        { label: 'Tổng', value: project.totalMembers, color: 'text-gray-700' },
                        { label: 'Leader', value: project.leaderCount, color: 'text-purple-600' },
                        { label: 'Member', value: project.memberCount, color: 'text-blue-600' },
                        { label: 'Viewer', value: project.viewerCount, color: 'text-gray-500' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value ?? 0}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab}>
                {/* Board tab */}
                {activeTab === 'board' && (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <div className="text-gray-300 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon – Sprint 2</h3>
                        <p className="text-gray-500">Kanban board sẽ được triển khai trong sprint tiếp theo</p>
                    </div>
                )}

                {/* Members tab */}
                {activeTab === 'members' && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                            <h2 className="text-xl font-semibold text-gray-900">Thành viên dự án</h2>
                            {isLeader && (
                                <Button onClick={() => setIsInviteMemberModalOpen(true)}>
                                    <svg className="w-4 h-4 sm:mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    <span className="hidden sm:inline">Mời thành viên</span>
                                </Button>
                            )}
                        </div>

                        {/* Search + filter pending */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-5">
                            <Input
                                type="text"
                                placeholder="Tìm theo tên, email, chức vụ..."
                                value={memberSearch}
                                onChange={(e) => setMemberSearch(e.target.value)}
                                className="flex-1"
                                leftIcon={
                                    <svg className="w-4 h-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                }
                            />
                            {isLeader && (
                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={includePending}
                                        onChange={(e) => setIncludePending(e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600"
                                    />
                                    Hiện lời mời đang chờ
                                </label>
                            )}
                        </div>

                        {isMembersLoading ? (
                            <div className="flex justify-center py-10">
                                <Spinner size="md" />
                            </div>
                        ) : (
                            <MemberTable
                                projectId={String(project.id)}
                                members={filteredMembers}
                                isCurrentUserLeader={isLeader}
                            />
                        )}
                    </div>
                )}

                {/* Settings tab */}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
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
                                    <Button type="submit" isLoading={updateProject.isPending} disabled={updateProject.isPending}>
                                        Lưu thay đổi
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-red-200">
                            <h2 className="text-xl font-semibold text-red-600 mb-4">🚨 Danger Zone</h2>
                            <div className="bg-red-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Chuyển dự án vào thùng rác</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Dự án sẽ được chuyển vào thùng rác, bạn có thể khôi phục lại sau.
                                </p>
                                <Button
                                    variant="danger"
                                    onClick={() => setIsDeleteDialogOpen(true)}
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
                    deleteProject.mutate({ id: String(project.id), hardDelete: false });
                    setIsDeleteDialogOpen(false);
                }}
                title="Chuyển vào thùng rác"
                message="Dự án sẽ được chuyển vào thùng rác. Bạn có thể khôi phục lại từ trang Projects."
                confirmText="Chuyển vào thùng rác"
                cancelText="Hủy"
                variant="danger"
                isLoading={deleteProject.isPending}
            />

            {/* Invite Member Modal */}
            {isInviteMemberModalOpen && (
                <InviteMemberModal
                    isOpen={isInviteMemberModalOpen}
                    onClose={() => setIsInviteMemberModalOpen(false)}
                    projectId={String(project.id)}
                />
            )}
        </div>
    );
};
