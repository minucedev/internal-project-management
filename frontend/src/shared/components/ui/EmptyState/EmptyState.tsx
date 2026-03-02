import { twMerge } from 'tailwind-merge';

export interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

const DefaultIcon = () => (
    <svg
        className="w-24 h-24 text-gray-300"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export const EmptyState = ({
    title,
    description,
    icon,
    action,
    className,
}: EmptyStateProps) => {
    return (
        <div
            className={twMerge(
                'flex flex-col items-center justify-center py-12 px-4',
                'text-center',
                className
            )}
        >
            {/* Icon */}
            <div className="mb-4 opacity-50">
                {icon || <DefaultIcon />}
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>

            {/* Description */}
            {description && (
                <p className="text-gray-500 max-w-md mb-6">{description}</p>
            )}

            {/* Action Button */}
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};
