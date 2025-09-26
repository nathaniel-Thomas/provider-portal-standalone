import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  pressEffect?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function AnimatedCard({
  children,
  className,
  hoverEffect = true,
  pressEffect = true, 
  onClick,
  disabled = false
}: AnimatedCardProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    if (pressEffect && !disabled) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  return (
    <div
      className={cn(
        'transition-all duration-200 ease-out',
        hoverEffect && !disabled && 'hover:scale-[1.02] hover:shadow-lg',
        pressEffect && isPressed && 'scale-[0.98]',
        onClick && !disabled && 'cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={!disabled ? onClick : undefined}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      data-testid="animated-card"
    >
      {children}
    </div>
  );
}