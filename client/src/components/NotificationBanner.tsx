import { X, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationBannerProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

export default function NotificationBanner({
  message,
  type = 'info',
  action,
  onDismiss
}: NotificationBannerProps) {

  const bannerStyles = {
    info: 'bg-primary/90 text-white',
    success: 'bg-success-green/90 text-white',
    warning: 'bg-warning-orange/90 text-white', 
    error: 'bg-destructive/90 text-white'
  };

  return (
    <div
      className={cn(
        'absolute top-0 left-0 w-full h-11 px-5 flex items-center justify-between z-50',
        bannerStyles[type]
      )}
      data-testid="notification-banner"
    >
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        <p className="text-sm font-semibold">{message}</p>
      </div>
      
      <div className="flex items-center gap-2">
        {action && (
          <button 
            className="text-xs font-bold hover:bg-white/20 px-2 py-1 rounded transition-colors"
            onClick={action.onClick}
            data-testid="banner-action"
          >
            {action.label}
          </button>
        )}
        <button
          className="hover:bg-white/20 p-1 rounded transition-colors"
          onClick={onDismiss}
          data-testid="banner-dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}