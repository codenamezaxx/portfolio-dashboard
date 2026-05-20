import React from 'react';
import { Button, type ButtonProps } from './Button';

export type ErrorMessageType = 'validation' | 'network' | 'server' | 'auth' | 'generic';

export interface ErrorStateProps {
  /**
   * Whether the component is in an error state
   */
  isError: boolean;

  /**
   * Error message to display
   */
  message?: string;

  /**
   * Type of error for styling and context
   * @default 'generic'
   */
  errorType?: ErrorMessageType;

  /**
   * Detailed error description (shown below main message)
   */
  description?: string;

  /**
   * Whether to display the error in full screen overlay
   * @default false
   */
  isFullScreen?: boolean;

  /**
   * Callback function for retry button
   */
  onRetry?: () => void;

  /**
   * Callback function for dismiss button
   */
  onDismiss?: () => void;

  /**
   * Whether to show retry button
   * @default true
   */
  showRetry?: boolean;

  /**
   * Whether to show dismiss button
   * @default true
   */
  showDismiss?: boolean;

  /**
   * Custom retry button text
   * @default 'Try Again'
   */
  retryButtonText?: string;

  /**
   * Custom dismiss button text
   * @default 'Dismiss'
   */
  dismissButtonText?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * ARIA label for accessibility
   * @default 'Error'
   */
  ariaLabel?: string;

  /**
   * Children to display when not in error state
   */
  children?: React.ReactNode;
}

/**
 * ErrorState Component
 * A flexible error state component that displays error messages with retry and dismiss options
 * Supports different error types with appropriate styling
 * Includes accessibility features with ARIA labels
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  isError,
  message,
  errorType = 'generic',
  description,
  isFullScreen = false,
  onRetry,
  onDismiss,
  showRetry = true,
  showDismiss = true,
  retryButtonText = 'Try Again',
  dismissButtonText = 'Dismiss',
  className = '',
  ariaLabel = 'Error',
  children,
}) => {
  if (!isError) {
    return <>{children}</>;
  }

  const errorTypeStyles = {
    validation: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-700 dark:text-yellow-400',
      icon: '⚠️',
    },
    network: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      text: 'text-orange-700 dark:text-orange-400',
      icon: '🌐',
    },
    server: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-700 dark:text-red-400',
      icon: '❌',
    },
    auth: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-700 dark:text-red-400',
      icon: '🔒',
    },
    generic: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-700 dark:text-red-400',
      icon: '❌',
    },
  };

  const styles = errorTypeStyles[errorType];

  const errorContent = (
    <div
      className={`
        ${styles.bg}
        border ${styles.border}
        rounded-lg p-4
        ${className}
      `}
      role="alert"
      aria-label={ariaLabel}
      aria-live="assertive"
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 text-xl">
          {styles.icon}
        </div>
        <div className="flex-1">
          {message && (
            <h3 className={`font-semibold ${styles.text} mb-1`}>
              {message}
            </h3>
          )}
          {description && (
            <p className={`text-sm ${styles.text} mb-3`}>
              {description}
            </p>
          )}
          {(showRetry || showDismiss) && (
            <div className="flex gap-2 mt-3">
              {showRetry && onRetry && (
                <Button
                  onClick={onRetry}
                  variant="secondary"
                  size="sm"
                  className={`${styles.text} hover:opacity-80`}
                >
                  {retryButtonText}
                </Button>
              )}
              {showDismiss && onDismiss && (
                <Button
                  onClick={onDismiss}
                  variant="ghost"
                  size="sm"
                  className={`${styles.text} hover:opacity-80`}
                >
                  {dismissButtonText}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
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
          p-4
        `}
      >
        <div className="max-w-md w-full">
          {errorContent}
        </div>
      </div>
    );
  }

  return errorContent;
};

ErrorState.displayName = 'ErrorState';
