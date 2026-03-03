import { useState } from 'react';
import { format } from 'date-fns';
import { Table, Avatar, Badge, ConfirmDialog, type Column } from '@/shared/components/ui';
import { useRemoveMember } from '../../hooks';
import { useAuth } from '@/features/auth';
import type { MemberResponse, ProjectRole, MemberStatus } from '../../types';
import { PROJECT_MESSAGES } from '../../constants';

export interface MemberTableProps {
    projectId: string;
    members: MemberResponse[];
    isCurrentUserLeader: boolean;
}

const ROLE_BADGE: Record<ProjectRole, { label: string; variant: 'primary' | 'success' | 'default' }> = {
    LEADER: { label: 'Leader', variant: 'primary' },
    MEMBER: { label: 'Member', variant: 'success' },
    VIEWER: { label: 'Viewer', variant: 'default' },
};

const STATUS_BADGE: Record<MemberStatus, { label: string; variant: 'success' | 'warning' | 'default' | 'danger' }> = {
    ACTIVE: { label: 'Active', variant: 'success' },
    PENDING: { label: 'Pending', variant: 'warning' },
    INACTIVE: { label: 'Inactive', variant: 'default' },
    REMOVED: { label: 'Removed', variant: 'danger' },
};

export const MemberTable = ({ projectId, members, isCurrentUserLeader }: MemberTableProps) => {
    const { user } = useAuth();
    const removeMember = useRemoveMember(projectId);
    const [removingMemberId, setRemovingMemberId] = useState<number | null>(null);

    const handleRemoveConfirm = () => {
        if (removingMemberId) {
            removeMember.mutate(String(removingMemberId), {
                onSuccess: () => setRemovingMemberId(null),
            });
        }
    };

    const formatDate = (dateString?: string) =>
        dateString ? format(new Date(dateString), 'dd/MM/yyyy') : '—';

    const columns: Column<MemberResponse>[] = [
        {
            key: 'member',
            title: 'Thành viên',
            render: (record) => (
                <div className="flex items-center gap-3">
                    <Avatar name={record.username} size="sm" />
                    <div>
                        <p className="font-semibold text-gray-900">{record.username}</p>
                        <p className="text-sm text-gray-500">{record.email}</p>
                        {record.phoneNumber && (
                            <p className="text-xs text-gray-400">{record.phoneNumber}</p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'role',
            title: 'Vai trò',
            width: '120px',
            render: (record) => {
                const badge = ROLE_BADGE[record.roleInProject];
                return <Badge variant={badge.variant}>{badge.label}</Badge>;
            },
        },
        {
            key: 'status',
            title: 'Trạng thái',
            width: '110px',
            render: (record) => {
                const badge = STATUS_BADGE[record.statusInProject] ?? { label: record.statusInProject, variant: 'default' as const };
                return <Badge variant={badge.variant}>{badge.label}</Badge>;
            },
        },
        {
            key: 'positionTitle',
            title: 'Chức vụ',
            render: (record) => (
                <span className="text-sm text-gray-600">
                    {record.positionTitle || <span className="text-gray-300">—</span>}
                </span>
            ),
        },
        {
            key: 'joinedAt',
            title: 'Ngày tham gia',
            width: '130px',
            render: (record) => (
                <span className="text-sm text-gray-500">{formatDate(record.joinedAt)}</span>
            ),
        },
        {
            key: 'actions',
            title: '',
            align: 'center',
            width: '60px',
            render: (record) => {
                // Only LEADER can remove; cannot remove yourself
                const canRemove = isCurrentUserLeader && record.userId !== user?.userId;
                // Don't show remove button for PENDING invites (use different flow)
                if (!canRemove || record.statusInProject === 'PENDING') return null;

                return (
                    <button
                        onClick={() => setRemovingMemberId(record.userId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa thành viên"
                    >
                        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                );
            },
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                data={members}
                rowKey={(m) => String(m.userId)}
                emptyText="Chưa có thành viên nào trong dự án"
            />

            <ConfirmDialog
                isOpen={!!removingMemberId}
                onClose={() => setRemovingMemberId(null)}
                onConfirm={handleRemoveConfirm}
                title={PROJECT_MESSAGES.MEMBER_REMOVE_CONFIRM_TITLE}
                message={PROJECT_MESSAGES.MEMBER_REMOVE_CONFIRM_MESSAGE}
                confirmText="Xóa"
                cancelText="Hủy"
                variant="danger"
                isLoading={removeMember.isPending}
            />
        </>
    );
};
