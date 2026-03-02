import { twMerge } from 'tailwind-merge';

export interface Tab {
    key: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}

export interface TabsProps {
    tabs: Tab[];
    activeKey: string;
    onChange: (key: string) => void;
    children: React.ReactNode;
    variant?: 'line' | 'card';
    className?: string;
}

export const Tabs = ({
    tabs,
    activeKey,
    onChange,
    children,
    variant = 'line',
    className,
}: TabsProps) => {
    const handleKeyDown = (e: React.KeyboardEvent, tabKey: string, index: number) => {
        if (e.key === 'ArrowLeft' && index > 0) {
            const prevTab = tabs[index - 1];
            if (!prevTab.disabled) {
                onChange(prevTab.key);
            }
        } else if (e.key === 'ArrowRight' && index < tabs.length - 1) {
            const nextTab = tabs[index + 1];
            if (!nextTab.disabled) {
                onChange(nextTab.key);
            }
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (tabKey !== activeKey) {
                onChange(tabKey);
            }
        }
    };

    return (
        <div className={twMerge('w-full', className)}>
            {/* Tab Headers */}
            <div
                className={twMerge(
                    'flex',
                    variant === 'line' && 'border-b border-gray-200',
                    variant === 'card' && 'bg-gray-100 rounded-lg p-1'
                )}
                role="tablist"
            >
                {tabs.map((tab, index) => {
                    const isActive = tab.key === activeKey;
                    const isDisabled = tab.disabled;

                    return (
                        <button
                            key={tab.key}
                            role="tab"
                            aria-selected={isActive}
                            aria-disabled={isDisabled}
                            tabIndex={isActive ? 0 : -1}
                            onClick={() => !isDisabled && onChange(tab.key)}
                            onKeyDown={(e) => !isDisabled && handleKeyDown(e, tab.key, index)}
                            disabled={isDisabled}
                            className={twMerge(
                                'flex items-center gap-2 px-4 py-3',
                                'font-medium text-sm transition-all duration-300',
                                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                                variant === 'line' && [
                                    'border-b-2 -mb-px',
                                    isActive
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300',
                                ],
                                variant === 'card' && [
                                    'rounded-md',
                                    isActive
                                        ? 'bg-white shadow-sm text-blue-600'
                                        : 'text-gray-600 hover:text-gray-900',
                                ],
                                isDisabled && 'opacity-50 cursor-not-allowed'
                            )}
                        >
                            {tab.icon && <span className="text-lg">{tab.icon}</span>}
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="mt-6" role="tabpanel">
                {children}
            </div>
        </div>
    );
};
