import React, { useState, useRef, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  disabled?: boolean;
}

export default function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  disabled = false
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const touchStartRef = useRef<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;

    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    if (scrollTop === 0) {
      touchStartRef.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, [disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || isRefreshing || !isPulling) return;

    const currentTouch = e.touches[0].clientY;
    const distance = Math.max(0, currentTouch - touchStartRef.current);

    // Add resistance as user pulls further
    const resistedDistance = distance < threshold
      ? distance
      : threshold + (distance - threshold) * 0.5;

    setPullDistance(resistedDistance);

    // Prevent default scroll behavior when pulling down
    if (distance > 0) {
      e.preventDefault();
    }
  }, [disabled, isRefreshing, isPulling, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (disabled || isRefreshing || !isPulling) return;

    setIsPulling(false);

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
  }, [disabled, isRefreshing, isPulling, pullDistance, threshold, onRefresh]);

  const refreshProgress = Math.min(pullDistance / threshold, 1);
  const shouldShowSpinner = isRefreshing || pullDistance >= threshold;

  return (
    <div className="relative overflow-hidden">
      {/* Pull to refresh indicator */}
      <div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `translateY(${Math.min(pullDistance - 60, 0)}px)`,
          height: '60px'
        }}
      >
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-full p-3 shadow-lg">
          <RefreshCw
            className={`h-5 w-5 text-primary transition-all duration-200 ${
              shouldShowSpinner ? 'animate-spin' : ''
            }`}
            style={{
              transform: `rotate(${refreshProgress * 180}deg)`,
              opacity: Math.max(0.3, refreshProgress)
            }}
          />
        </div>
      </div>

      {/* Content container */}
      <div
        ref={scrollContainerRef}
        className="transition-transform duration-200 ease-out"
        style={{
          transform: `translateY(${isPulling || isRefreshing ? pullDistance : 0}px)`
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}