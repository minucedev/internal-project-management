import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'default';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
    info: 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white',
    default: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
};

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
};

export const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    className,
}: BadgeProps) => {
    return (
        <span
            className={twMerge(
                'inline-flex items-center justify-center',
                'rounded-full font-semibold',
                'transition-all duration-300',
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
        >
            {children}
        </span>
    );
};
