import { forwardRef, type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary: 'bg-accent-lime text-[var(--accent-lime-fg,#000)] hover:brightness-110 border border-accent-lime',
  secondary: 'bg-transparent text-text-primary border border-theme-subtle hover:border-theme-strong hover:bg-theme-muted',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-theme-muted border border-transparent',
  danger: 'bg-transparent text-accent-orange border border-accent-orange/30 hover:bg-accent-orange/10',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          font-condensed font-semibold tracking-wider uppercase
          rounded-xl transition-all duration-200
          hover:-translate-y-0.5 active:scale-[0.98]
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0
          ${variants[variant]} ${sizes[size]} ${className}
        `}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
