import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Spinner, Button } from '@/shared/components/ui';
import { useAcceptInvite } from '../hooks';
import { APP_ROUTES } from '@/shared/constants';

export const AcceptInvitePage = () => {
    const { id, token } = useParams<{ id: string; token: string }>();
    const navigate = useNavigate();
    const acceptInvite = useAcceptInvite();

    useEffect(() => {
        if (id && token && !acceptInvite.isPending && !acceptInvite.isSuccess && !acceptInvite.isError) {
            acceptInvite.mutate({ projectId: id, token }, {
                onSuccess: () => {
                    // Redirect to project detail after short delay
                    setTimeout(() => {
                        navigate(APP_ROUTES.DASHBOARD.PROJECT_DETAIL(id));
                    }, 2000);
                }
            });
        }
    }, [id, token]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Chấp nhận lời mời</h1>
                
                {acceptInvite.isPending && (
                    <div className="py-8">
                        <Spinner size="lg" />
                        <p className="mt-4 text-gray-500">Đang xử lý lời mời của bạn...</p>
                    </div>
                )}

                {acceptInvite.isSuccess && (
                    <div className="py-8">
                        <div className="text-green-500 mb-4">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-gray-900 font-medium mb-1">Thành công!</p>
                        <p className="text-gray-500 text-sm">Bạn đã tham gia dự án thành công. Đang chuyển hướng...</p>
                    </div>
                )}

                {acceptInvite.isError && (
                    <div className="py-8">
                        <div className="text-red-500 mb-4">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <p className="text-gray-900 font-medium mb-1">Có lỗi xảy ra</p>
                        <p className="text-gray-500 text-sm mb-6">Liên kết không hợp lệ hoặc đã hết hạn.</p>
                        <Link to={APP_ROUTES.DASHBOARD.PROJECTS}>
                            <Button fullWidth>Quay lại Dashboard</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
