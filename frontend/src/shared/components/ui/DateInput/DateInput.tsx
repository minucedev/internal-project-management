import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
    (
        {
            label,
            error,
            helperText,
            className,
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    <input
                        ref={ref}
                        type="date"
                        disabled={disabled}
                        className={twMerge(
                            'w-full px-4 py-3 rounded-lg border',
                            'bg-white text-gray-900',
                            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            'transition-all duration-300',
                            error
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 hover:border-gray-400',
                            disabled && 'bg-gray-100 cursor-not-allowed opacity-60',
                            className
                        )}
                        {...props}
                    />
                </div>

                {(error || helperText) && (
                    <p
                        className={twMerge(
                            'mt-2 text-sm',
                            error ? 'text-red-600' : 'text-gray-500'
                        )}
                    >
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

DateInput.displayName = 'DateInput';
