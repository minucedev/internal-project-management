import { useState } from 'react';
import { Table, Avatar, Badge, ConfirmDialog, type Column } from '@/shared/components/ui';
import { useRemoveMember } from '../../hooks';
import { useAuth } from '@/features/auth';
import type { ProjectMember } from '../../types';
import { PROJECT_MESSAGES } from '../../constants';

export interface MemberTableProps {
    projectId: string;
    members: ProjectMember[];
    isCurrentUserLeader: boolean;
}

export const MemberTable = ({ projectId, members, isCurrentUserLeader }: MemberTableProps) => {
    const { user } = useAuth();
    const removeMember = useRemoveMember(projectId);
    const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

    const handleRemoveClick = (memberId: string) => {
        setRemovingMemberId(memberId);
    };

    const handleRemoveConfirm = () => {
        if (removingMemberId) {
            removeMember.mutate(removingMemberId, {
                onSuccess: () => {
                    setRemovingMemberId(null);
                },
            });
        }
    };

    const columns: Column<ProjectMember>[] = [
        {
            key: 'member',
            title: 'Member',
            render: (record) => (
                <div className="flex items-center gap-3">
                    <Avatar name={record.username} size="sm" />
                    <div>
                        <p className="font-semibold text-gray-900">{record.username}</p>
                        <p className="text-sm text-gray-500">{record.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'role',
            title: 'Role',
            render: (record) => (
                <Badge variant={record.role === 'LEADER' ? 'danger' : 'primary'}>
                    {record.role}
                </Badge>
            ),
            width: '150px',
        },
        {
            key: 'actions',
            title: 'Actions',
            align: 'center',
            width: '100px',
            render: (record) => {
                const canRemove = isCurrentUserLeader && record.userId !== `${user?.userId}`;

                if (!canRemove) return null;

                return (
                    <button
                        onClick={() => handleRemoveClick(record.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Xóa thành viên"
                    >
                        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
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
                rowKey="id"
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
