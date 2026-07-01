'use client';

import React, { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * Button Component
 * A reusable button with multiple variants, sizes, and loading state
 * Conforms to the design system specifications with light and dark mode support
 * 
 * Variants:
 * - primary: Gold background (#B8860B) with deep olive text, 40px height
 * - secondary: Soft cream background with ink text, 40px height
 * - tertiary: Transparent background with ink text
 * - danger: Red accent background with white text
 * - ghost: Transparent with hover effect
 * - outline: Transparent with border
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      font-button-md border border-line
      transition-colors duration-200
      focus:outline-none
      disabled:cursor-not-allowed disabled:opacity-30
      inline-flex items-center justify-center gap-2
    `;

    const variantStyles = {
      primary: `
        bg-primary/10 text-ink
        hover:bg-primary/20 active:bg-primary/20
        disabled:bg-transparent disabled:text-ink/30
      `,
      secondary: `
        bg-transparent text-ink
        hover:bg-white/20 active:bg-white/20
        disabled:text-ink/30
      `,
      tertiary: `
        bg-transparent text-ink
        hover:opacity-60 active:opacity-40
        disabled:text-ink/30
      `,
      danger: `
        bg-transparent text-accent-red border-accent-red
        hover:bg-accent-red-soft active:bg-accent-red-soft
        disabled:text-ink/30
      `,
      ghost: `
        bg-transparent text-ink
        hover:bg-white/20 active:bg-white/20
        disabled:text-ink/30
      `,
      outline: `
        bg-transparent text-ink border border-line
        hover:bg-white/20 active:bg-white/20
        disabled:text-ink/30
      `,
    };

    const sizeStyles = {
      sm: 'px-3 py-1 text-xs h-8',
      md: 'px-4 py-2 h-10',
      lg: 'px-6 py-3 text-base h-12',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${widthStyle}
          ${className}
        `}
        aria-busy={isLoading}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
