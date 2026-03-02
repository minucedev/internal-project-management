import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    shape?: 'circle' | 'square';
    className?: string;
}

const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
};

const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg',
};

// Generate consistent color based on string
const getColorFromString = (str: string): string => {
    const colors = [
        'from-blue-500 to-blue-600',
        'from-purple-500 to-purple-600',
        'from-pink-500 to-pink-600',
        'from-red-500 to-red-600',
        'from-orange-500 to-orange-600',
        'from-yellow-500 to-yellow-600',
        'from-green-500 to-green-600',
        'from-teal-500 to-teal-600',
        'from-cyan-500 to-cyan-600',
        'from-indigo-500 to-indigo-600',
    ];

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
};

// Get initials from name
const getInitials = (name: string): string => {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

export const Avatar = ({
    src,
    alt,
    name,
    size = 'md',
    shape = 'circle',
    className,
}: AvatarProps) => {
    const [imageError, setImageError] = useState(false);
    const displayName = alt || name || '';
    const initials = displayName ? getInitials(displayName) : '?';
    const gradientColor = getColorFromString(displayName);

    const showImage = src && !imageError;

    return (
        <div
            className={twMerge(
                'inline-flex items-center justify-center',
                'font-semibold text-white',
                'ring-2 ring-white shadow-md',
                'transition-all duration-300',
                sizeClasses[size],
                shapeClasses[shape],
                !showImage && `bg-gradient-to-br ${gradientColor}`,
                className
            )}
            title={displayName}
        >
            {showImage ? (
                <img
                    src={src}
                    alt={displayName}
                    className={twMerge('w-full h-full object-cover', shapeClasses[shape])}
                    onError={() => setImageError(true)}
                />
            ) : (
                <span>{initials}</span>
            )}
        </div>
    );
};
