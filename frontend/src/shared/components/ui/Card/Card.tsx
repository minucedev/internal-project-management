import { twMerge } from 'tailwind-merge';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    hoverable?: boolean;
    onClick?: (e?: React.MouseEvent) => void;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export const Card = ({
    children,
    className,
    hoverable = false,
    onClick,
    padding = 'md',
}: CardProps) => {
    const isClickable = !!onClick || hoverable;

    return (
        <div
            onClick={onClick}
            className={twMerge(
                'bg-white rounded-xl shadow-lg',
                'transition-all duration-300',
                paddingClasses[padding],
                isClickable && 'cursor-pointer hover:shadow-xl hover:scale-105',
                className
            )}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
                onClick
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onClick();
                        }
                    }
                    : undefined
            }
        >
            {children}
        </div>
    );
};
