/**
 * SelectField Component
 * 
 * A select component with integrated validation display
 */

import React, { forwardRef } from 'react';

export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
  touched?: boolean;
  variant?: 'default' | 'admin';
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

/**
 * SelectField Component
 * A reusable select field with integrated validation display
 */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      containerClassName = '',
      className = '',
      id,
      touched,
      variant = 'default',
      options,
      placeholder,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const showError = touched && error;

    const baseStyles = {
      default: {
        container: 'flex flex-col gap-1',
        label: 'text-sm font-medium text-gray-700 dark:text-gray-300',
        select: `
          px-3 py-2 border rounded-md
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          border-gray-300 dark:border-gray-600
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 dark:disabled:bg-gray-700
          disabled:text-gray-500 dark:disabled:text-gray-400
          disabled:cursor-not-allowed
          transition-colors duration-200
        `,
        error: 'text-sm text-red-500 dark:text-red-400',
        helper: 'text-sm text-gray-500 dark:text-gray-400',
      },
      admin: {
        container: 'flex flex-col gap-2',
        label: 'text-sm font-medium text-[var(--foreground)]',
        select: `
          px-3 py-2 bg-[var(--card)] border border-[var(--border)]
          text-[var(--foreground)] placeholder-[var(--muted)]
          rounded-lg focus:outline-none focus:border-blue-500/50
          focus:ring-1 focus:ring-blue-500/20
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        `,
        error: 'text-sm text-red-400',
        helper: 'text-sm text-[var(--muted)]',
      },
    };

    const styles = baseStyles[variant];

    return (
      <div className={`${styles.container} ${containerClassName}`}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`
            ${styles.select}
            ${showError ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {showError && <p className={styles.error}>{error}</p>}
        {helperText && !showError && <p className={styles.helper}>{helperText}</p>}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';
