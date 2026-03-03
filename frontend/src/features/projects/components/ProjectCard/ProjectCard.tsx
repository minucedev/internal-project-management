import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Badge, Dropdown, type DropdownItem } from '@/shared/components/ui';
import { APP_ROUTES } from '@/shared/constants/routes.constants';
import type { ProjectResponse, ProjectRole } from '../../types';

interface ProjectCardProps {
    project: ProjectResponse;
    onEdit: (project: ProjectResponse) => void;
    onDelete: (projectId: string) => void;
}

const ROLE_BADGE: Record<ProjectRole, { label: string; variant: 'primary' | 'success' | 'default' }> = {
    LEADER: { label: 'Leader', variant: 'primary' },
    MEMBER: { label: 'Member', variant: 'success' },
    VIEWER: { label: 'Viewer', variant: 'default' },
};

export const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
    const navigate = useNavigate();
    const isLeader = project.currentUserRole === 'LEADER';
    const roleBadge = ROLE_BADGE[project.currentUserRole];

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
            label: 'Chuyển vào thùng rác',
            icon: (
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
            danger: true,
            onClick: () => onDelete(String(project.id)),
        },
    ];

    const handleCardClick = (e?: React.MouseEvent) => {
        if (e && (e.target as HTMLElement).closest('[data-dropdown]')) return;
        navigate(APP_ROUTES.DASHBOARD.PROJECT_DETAIL(String(project.id)));
    };

    const formatDate = (dateString?: string) =>
        dateString ? format(new Date(dateString), 'dd/MM/yyyy') : '—';

    return (
        <Card className="relative" onClick={handleCardClick} hoverable>
            {/* Gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl" />

            {/* Header */}
            <div className="flex items-start justify-between mb-3 pt-1">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{project.name}</h3>
                </div>
                <div className="flex items-center gap-2 ml-2 shrink-0">
                    {/* Role badge */}
                    <Badge variant={roleBadge.variant} size="sm">{roleBadge.label}</Badge>
                    {/* Actions — LEADER only */}
                    {isLeader && (
                        <div data-dropdown onClick={(e) => e.stopPropagation()}>
                            <Dropdown
                                trigger={
                                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
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
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-10">
                {project.description || 'Chưa có mô tả'}
            </p>

            {/* Dates */}
            {(project.startDate || project.endDate) && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <svg className="w-4 h-4 shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(project.startDate)} → {formatDate(project.endDate)}</span>
                </div>
            )}

            {/* Footer: member count */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Avatar name={project.createdByUsername} size="sm" className="border-2 border-white" />
                <span className="font-medium text-gray-700">{project.memberCount}</span>
                <span>thành viên</span>
            </div>
        </Card>
    );
};
