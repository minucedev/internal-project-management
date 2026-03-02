import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { projectsApi } from '../api';
import { getErrorMessage } from '@/shared/utils';

export const useAcceptInvite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectId, token }: { projectId: string; token: string }) =>
            projectsApi.acceptInvite(projectId, token),
        onSuccess: (data, variables) => {
            toast.success('Chấp nhận lời mời thành công!');
            // Invalidate the project cache so the member list updates
            queryClient.invalidateQueries({
                queryKey: ['projects', variables.projectId],
            });
            // Also invalidate projects list
            queryClient.invalidateQueries({
                queryKey: ['projects'],
            });
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};
