import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, FormInput } from '@/shared/components/ui';
import { useAddMember } from '../../hooks';
import { inviteMemberSchema } from '../../utils/validation';
import type { InviteMemberFormData } from '../../types';

export interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
}

export const InviteMemberModal = ({ isOpen, onClose, projectId }: InviteMemberModalProps) => {
    const addMember = useAddMember(projectId);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<InviteMemberFormData>({
        resolver: zodResolver(inviteMemberSchema),
    });

    const onSubmit = (data: InviteMemberFormData) => {
        addMember.mutate(data, {
            onSuccess: onClose,
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Mời thành viên" size="sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <FormInput
                    label="Email thành viên"
                    name="email"
                    type="email"
                    register={register}
                    errors={errors}
                    placeholder="Nhập email của người dùng..."
                    disabled={addMember.isPending}
                    required
                />

                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={addMember.isPending}
                        fullWidth
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        isLoading={addMember.isPending}
                        disabled={addMember.isPending}
                        fullWidth
                    >
                        Thêm
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
