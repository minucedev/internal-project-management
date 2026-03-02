import { useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

export interface DropdownItem {
    key: string;
    label: string;
    icon?: React.ReactNode;
    danger?: boolean;
    onClick: () => void;
    disabled?: boolean;
    divider?: boolean;
}

export interface DropdownProps {
    trigger: React.ReactNode;
    items: DropdownItem[];
    placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
    className?: string;
}

const placementClasses = {
    'bottom-left': 'top-full left-0 mt-2',
    'bottom-right': 'top-full right-0 mt-2',
    'top-left': 'bottom-full left-0 mb-2',
    'top-right': 'bottom-full right-0 mb-2',
};

export const Dropdown = ({
    trigger,
    items,
    placement = 'bottom-right',
    className,
}: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Close on ESC key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const handleItemClick = (item: DropdownItem) => {
        if (!item.disabled) {
            item.onClick();
            setIsOpen(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, item: DropdownItem) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleItemClick(item);
        }
    };

    return (
        <div ref={dropdownRef} className={twMerge('relative inline-block', className)}>
            {/* Trigger */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsOpen(!isOpen);
                    }
                }}
            >
                {trigger}
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className={twMerge(
                        'absolute z-50 min-w-[12rem]',
                        'bg-white rounded-lg shadow-xl border border-gray-200',
                        'py-2 animate-scaleIn origin-top-right',
                        placementClasses[placement]
                    )}
                >
                    {items.map((item, index) => (
                        <div key={item.key}>
                            {item.divider && index > 0 && (
                                <div className="h-px bg-gray-200 my-2" />
                            )}
                            <button
                                onClick={() => handleItemClick(item)}
                                onKeyDown={(e) => handleKeyDown(e, item)}
                                disabled={item.disabled}
                                className={twMerge(
                                    'w-full px-4 py-2 text-left flex items-center gap-3',
                                    'transition-colors duration-200',
                                    'focus:outline-none focus:bg-gray-100',
                                    item.danger
                                        ? 'text-red-600 hover:bg-red-50'
                                        : 'text-gray-700 hover:bg-gray-100',
                                    item.disabled && 'opacity-50 cursor-not-allowed'
                                )}
                            >
                                {item.icon && <span className="text-lg">{item.icon}</span>}
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
