import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  height?: 'sm' | 'md' | 'lg' | 'xl';
  showHandle?: boolean;
  closeOnOverlayClick?: boolean;
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = 'lg',
  showHandle = true,
  closeOnOverlayClick = true
}: BottomSheetProps) {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const heightStyles = {
    sm: 'h-[300px]',
    md: 'h-[400px]', 
    lg: 'h-[500px]',
    xl: 'h-[600px]'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
        data-testid="overlay"
      />
      
      {/* Sheet */}
      <div 
        className={cn(
          'relative w-full bg-card rounded-t-2xl flex flex-col shadow-2xl border-t border-border transform transition-transform duration-300 ease-out',
          heightStyles[height],
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
        data-testid="bottom-sheet"
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-border">
          {showHandle && (
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-3" />
          )}
          
          {title && (
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-border rounded-full transition-colors"
                data-testid="close-button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
}