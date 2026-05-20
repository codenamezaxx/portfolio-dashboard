import React from 'react';
import { LoadingSpinner, type LoadingSpinnerProps } from './LoadingSpinner';
import { SkeletonLoader, type SkeletonLoaderProps } from './SkeletonLoader';

export type LoadingIndicatorType = 'spinner' | 'skeleton';

export interface LoadingStateProps {
  /**
   * Whether the component is in a loading state
   */
  isLoading: boolean;

  /**
   * Type of loading indicator to display
   * @default 'spinner'
   */
  indicatorType?: LoadingIndicatorType;

  /**
   * Props to pass to the LoadingSpinner component
   */
  spinnerProps?: Omit<LoadingSpinnerProps, 'ariaLabel'>;

  /**
   * Props to pass to the SkeletonLoader component
   */
  skeletonProps?: Omit<SkeletonLoaderProps, 'ariaLabel'>;

  /**
   * Optional message to display during loading
   */
  message?: string;

  /**
   * Whether to display the loading indicator in full screen overlay
   * @default false
   */
  isFullScreen?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * ARIA label for accessibility
   * @default 'Loading'
   */
  ariaLabel?: string;

  /**
   * Children to display when not loading
   */
  children?: React.ReactNode;
}

/**
 * LoadingState Component
 * A flexible loading state component that supports different loading indicators
 * Can display spinner, skeleton, or custom loading UI
 * Supports full-screen overlay mode for async operations
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  indicatorType = 'spinner',
  spinnerProps,
  skeletonProps,
  message,
  isFullScreen = false,
  className = '',
  ariaLabel = 'Loading',
  children,
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  const loadingContent = (
    <div
      className={`
        flex flex-col items-center justify-center gap-4
        ${className}
      `}
    >
      {indicatorType === 'spinner' ? (
        <div
          role="status"
          aria-label={ariaLabel}
          aria-live="polite"
          className="flex flex-col items-center justify-center gap-2"
        >
          <LoadingSpinner
            {...spinnerProps}
          />
        </div>
      ) : (
        <div
          role="status"
          aria-label={ariaLabel}
          aria-live="polite"
        >
          <SkeletonLoader
            {...skeletonProps}
            ariaLabel={undefined}
          />
        </div>
      )}
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
      )}
    </div>
  );

  if (isFullScreen) {
    return (
      <div
        className={`
          fixed inset-0
          bg-white/80 dark:bg-gray-900/80
          backdrop-blur-sm
          flex items-center justify-center
          z-50
        `}
      >
        {loadingContent}
      </div>
    );
  }

  return loadingContent;
};

LoadingState.displayName = 'LoadingState';
