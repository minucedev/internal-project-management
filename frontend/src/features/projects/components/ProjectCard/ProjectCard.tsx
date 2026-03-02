import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Dropdown, type DropdownItem } from '@/shared/components/ui';
import { APP_ROUTES } from '@/shared/constants/routes.constants';
import type { Project } from '../../types';

export interface ProjectCardProps {
    project: Project;
    onEdit: (project: Project) => void;
    onDelete: (projectId: string) => void;
}

export const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
    const navigate = useNavigate();
    const isLeader = project.currentUserRole === 'LEADER';

    const dropdownItems: DropdownItem[] = [
        {
            key: 'edit',
            label: 'Chỉnh sửa',
            icon: (
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
            onClick: () => onEdit(project),
        },
        {
            key: 'delete',
            label: 'Xóa dự án',
            icon: (
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
            danger: true,
            onClick: () => onDelete(project.id),
        },
    ];

    const handleCardClick = (e?: React.MouseEvent) => {
        // Prevent navigation if clicking on dropdown
        if (e && (e.target as HTMLElement).closest('[data-dropdown]')) {
            return;
        }
        navigate(APP_ROUTES.DASHBOARD.PROJECT_DETAIL(project.id));
    };

    const formatDate = (dateString: string) => format(new Date(dateString), 'dd/MM/yyyy');

    // Show max 5 avatars
    const visibleMembers = project.members?.slice(0, 5) || [];
    const remainingCount = (project.members?.length || 0) - 5;

    return (
        <Card className="relative" onClick={handleCardClick} hoverable>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 flex-1">
                    {project.name}
                </h3>
                {isLeader && (
                    <div data-dropdown onClick={(e) => e.stopPropagation()}>
                        <Dropdown
                            trigger={
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="5" r="2" />
                                        <circle cx="12" cy="12" r="2" />
                                        <circle cx="12" cy="19" r="2" />
                                    </svg>
                                </button>
                            }
                            items={dropdownItems}
                            placement="bottom-right"
                        />
                    </div>
                )}
            </div>

            {/* Gradient border-top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl" />

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                {project.description || 'Chưa có mô tả'}
            </p>

            {/* Dates */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(project.startDate)} → {formatDate(project.endDate)}</span>
            </div>

            {/* Members */}
            <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                    {visibleMembers.map((member) => (
                        <Avatar
                            key={member.id}
                            name={member.username}
                            size="sm"
                            className="border-2 border-white"
                        />
                    ))}
                    {remainingCount > 0 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-600">+{remainingCount}</span>
                        </div>
                    )}
                </div>
                <span className="text-sm text-gray-500">
                    {project.members?.length || 0} thành viên
                </span>
            </div>
        </Card>
    );
};
