import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, FormInput } from '@/shared/components/ui';
import { useInviteMember } from '../../hooks';
import { inviteMemberSchema } from '../../utils/validation';
import type { InviteMemberFormData } from '../../types';

export interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
}

const ROLE_OPTIONS: { value: InviteMemberFormData['role']; label: string; description: string }[] = [
    { value: 'LEADER', label: 'Leader', description: 'Toàn quyền quản lý dự án' },
    { value: 'MEMBER', label: 'Member', description: 'Có thể xem và thực hiện task' },
    { value: 'VIEWER', label: 'Viewer', description: 'Chỉ xem, không chỉnh sửa' },
];

export const InviteMemberModal = ({ isOpen, onClose, projectId }: InviteMemberModalProps) => {
    const inviteMember = useInviteMember(projectId);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<InviteMemberFormData>({
        resolver: zodResolver(inviteMemberSchema),
        defaultValues: { role: 'MEMBER' },
    });

    const selectedRole = watch('role');

    const onSubmit = (data: InviteMemberFormData) => {
        inviteMember.mutate(
            {
                email: data.email,
                role: data.role,
                positionTitle: data.positionTitle || undefined,
            },
            { onSuccess: () => { reset(); onClose(); } },
        );
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Mời thành viên" size="sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <FormInput
                    label="Email thành viên"
                    name="email"
                    type="email"
                    register={register}
                    errors={errors}
                    placeholder="Nhập email của người dùng..."
                    disabled={inviteMember.isPending}
                    required
                />

                {/* Role selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vai trò <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {ROLE_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setValue('role', opt.value)}
                                className={`p-3 rounded-lg border-2 text-left transition-all ${selectedRole === opt.value
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <p className="font-medium text-sm text-gray-900">{opt.label}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
                            </button>
                        ))}
                    </div>
                    {errors.role && (
                        <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
                    )}
                </div>

                {/* Position title (optional) */}
                <FormInput
                    label="Chức vụ"
                    name="positionTitle"
                    register={register}
                    errors={errors}
                    placeholder="VD: Backend Developer (tùy chọn)"
                    disabled={inviteMember.isPending}
                />

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={inviteMember.isPending}
                        fullWidth
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        isLoading={inviteMember.isPending}
                        disabled={inviteMember.isPending}
                        fullWidth
                    >
                        Gửi lời mời
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
