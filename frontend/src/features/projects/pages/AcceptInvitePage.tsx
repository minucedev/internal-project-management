import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Spinner, Button } from '@/shared/components/ui';
import { useAcceptInvite } from '../hooks';
import { APP_ROUTES } from '@/shared/constants';

// ── Error code → UI message mapping ─────────────────────────────────────────
// Matches backend ErrorCode enum in BusinessException responses
interface InviteErrorInfo {
    title: string;
    description: string;
    icon: 'expired' | 'forbidden' | 'used' | 'invalid';
}

const getInviteError = (errorCode?: string): InviteErrorInfo => {
    switch (errorCode) {
        case 'INVITATION_EXPIRED':
            return {
                title: 'Lời mời đã hết hạn',
                description: 'Liên kết mời này đã hết hạn (quá 7 ngày). Vui lòng yêu cầu LEADER gửi lại lời mời mới.',
                icon: 'expired',
            };
        case 'INVITATION_FORBIDDEN':
            return {
                title: 'Không có quyền truy cập',
                description: 'Lời mời này không dành cho tài khoản của bạn. Vui lòng đăng nhập bằng đúng tài khoản được mời.',
                icon: 'forbidden',
            };
        case 'INVITATION_NOT_PENDING':
            return {
                title: 'Lời mời đã được xử lý',
                description: 'Lời mời này đã được chấp nhận hoặc đã bị hủy trước đó.',
                icon: 'used',
            };
        case 'INVITATION_NOT_FOUND':
        default:
            return {
                title: 'Liên kết không hợp lệ',
                description: 'Liên kết mời không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại email hoặc yêu cầu lời mời mới.',
                icon: 'invalid',
            };
    }
};

// ── Icon components by error type ─────────────────────────────────────────────
const ErrorIcon = ({ type }: { type: InviteErrorInfo['icon'] }) => {
    const icons = {
        expired: (
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        forbidden: (
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
        used: (
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        invalid: (
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
    };
    return icons[type];
};

// ── Bg color by error type ─────────────────────────────────────────────────────
const ERROR_BG: Record<InviteErrorInfo['icon'], string> = {
    expired: 'bg-orange-100',
    forbidden: 'bg-yellow-100',
    used: 'bg-blue-100',
    invalid: 'bg-red-100',
};

// ── Extract error code from Axios error ──────────────────────────────────────
const extractErrorCode = (error: unknown): string | undefined => {
    if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'code' in error.response.data
    ) {
        return (error.response.data as { code: string }).code;
    }
    return undefined;
};

// ── Page component ────────────────────────────────────────────────────────────
export const AcceptInvitePage = () => {
    const { id, token } = useParams<{ id: string; token: string }>();
    const navigate = useNavigate();
    const acceptInvite = useAcceptInvite();

    useEffect(() => {
        if (id && token && !acceptInvite.isPending && !acceptInvite.isSuccess && !acceptInvite.isError) {
            acceptInvite.mutate({ projectId: id, token }, {
                onSuccess: () => {
                    setTimeout(() => {
                        navigate(APP_ROUTES.DASHBOARD.PROJECT_DETAIL(id));
                    }, 2000);
                },
            });
        }
    }, [id, token]);

    // Derive error info from error code when in error state
    const errorCode = acceptInvite.isError ? extractErrorCode(acceptInvite.error) : undefined;
    const errorInfo = errorCode !== undefined ? getInviteError(errorCode) : getInviteError(undefined);

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">

                {/* ── Loading state ── */}
                {acceptInvite.isPending && (
                    <>
                        <div className="mb-6 flex justify-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Chấp nhận lời mời</h1>
                        <div className="py-6">
                            <Spinner size="lg" />
                            <p className="mt-4 text-gray-500">Đang xử lý lời mời của bạn...</p>
                        </div>
                    </>
                )}

                {/* ── Success state ── */}
                {acceptInvite.isSuccess && (
                    <>
                        <div className="mb-6 flex justify-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tham gia thành công! 🎉</h1>
                        <p className="text-gray-500 mb-6">Bạn đã tham gia dự án thành công. Đang chuyển hướng về trang dự án...</p>
                        <div className="flex justify-center">
                            <Spinner size="sm" />
                        </div>
                    </>
                )}

                {/* ── Error state — specific message per error code ── */}
                {acceptInvite.isError && (
                    <>
                        <div className="mb-6 flex justify-center">
                            <div className={`w-16 h-16 ${ERROR_BG[errorInfo.icon]} rounded-full flex items-center justify-center`}>
                                <ErrorIcon type={errorInfo.icon} />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{errorInfo.title}</h1>
                        <p className="text-gray-500 text-sm mb-8">{errorInfo.description}</p>

                        {/* Show error code for debugging (dev) */}
                        {errorCode && import.meta.env.DEV && (
                            <p className="text-xs text-gray-300 font-mono mb-4">code: {errorCode}</p>
                        )}

                        <div className="flex flex-col gap-3">
                            <Link to={APP_ROUTES.DASHBOARD.PROJECTS}>
                                <Button fullWidth>Về trang Projects</Button>
                            </Link>
                            <Link to={APP_ROUTES.DASHBOARD.ROOT}>
                                <Button variant="secondary" fullWidth>Về Dashboard</Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
