/**
 * LoadingSpinner Component
 * 
 * Reusable full-page loading spinner for blocking operations.
 * Used during authentication initialization, data fetching, etc.
 * 
 * Features:
 * - Full-screen overlay with gradient background
 * - Centered Ant Design Spin component
 * - Optional loading tip message
 * - Consistent styling with auth pages
 * 
 * @example
 * ```tsx
 * if (isLoading) {
 *   return <LoadingSpinner tip="Loading data..." />;
 * }
 * ```
 */

import { Spin } from 'antd';

interface LoadingSpinnerProps {
  /**
   * Optional message to display below the spinner
   * @default "Loading..."
   */
  tip?: string;
  
  /**
   * Spinner size
   * @default "large"
   */
  size?: 'small' | 'default' | 'large';
}

/**
 * Full-page loading spinner component
 * 
 * @param {LoadingSpinnerProps} props - Component props
 * @param {string} props.tip - Loading message (optional)
 * @param {string} props.size - Spinner size (optional)
 * @returns {JSX.Element} Full-page loading spinner
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  tip = 'Loading...', 
  size = 'large' 
}) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-primary">
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default LoadingSpinner;
