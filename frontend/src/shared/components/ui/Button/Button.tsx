import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { Spinner } from '../Spinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 ease-out outline-none disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 active:scale-95 overflow-hidden group';
    
    const variants = {
      primary: `
        bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 
        text-white shadow-lg shadow-blue-500/50 
        hover:shadow-xl hover:shadow-blue-500/60 
        hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800
        focus:ring-blue-400
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
      `,
      secondary: `
        bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 
        text-gray-900 shadow-md shadow-gray-400/30
        hover:shadow-lg hover:shadow-gray-400/40
        hover:from-gray-200 hover:via-gray-300 hover:to-gray-400
        focus:ring-gray-400
        border border-gray-300/50
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/60 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
      `,
      danger: `
        bg-gradient-to-br from-red-600 via-red-700 to-rose-700 
        text-white shadow-lg shadow-red-500/50
        hover:shadow-xl hover:shadow-red-500/60
        hover:from-red-700 hover:via-red-800 hover:to-rose-800
        focus:ring-red-400
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
      `,
      ghost: `
        bg-transparent text-gray-700 
        hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200
        shadow-none hover:shadow-sm
        focus:ring-gray-300
        border border-transparent hover:border-gray-200
      `,
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm min-h-[36px]',
      md: 'px-6 py-3 text-base min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[52px]',
    };

    return (
      <button
        ref={ref}
        type={type}
        className={twMerge(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading && <Spinner size="sm" />}
          {children}
        </span>
        
        {/* Ripple effect overlay */}
        <span className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></span>
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;