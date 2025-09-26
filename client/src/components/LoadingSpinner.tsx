import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'white' | 'muted';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'primary',
  className 
}: LoadingSpinnerProps) {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  const variantStyles = {
    primary: 'text-primary',
    white: 'text-white',
    muted: 'text-muted-foreground'
  };

  return (
    <div 
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      data-testid="loading-spinner"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}