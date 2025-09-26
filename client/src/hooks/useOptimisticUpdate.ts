import { useState, useCallback } from 'react';

interface OptimisticUpdateOptions<T> {
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
  revert?: () => void;
}

export function useOptimisticUpdate<T = any>() {
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async <TResult = T>(
    optimisticUpdate: () => void,
    asyncAction: () => Promise<TResult>,
    options: OptimisticUpdateOptions<TResult> = {}
  ): Promise<TResult | null> => {
    const { onSuccess, onError, revert } = options;

    try {
      setIsLoading(true);

      // Apply optimistic update immediately
      optimisticUpdate();

      // Perform async action
      const result = await asyncAction();

      // If successful, call onSuccess
      onSuccess?.(result);

      return result;
    } catch (error) {
      // If failed, revert the optimistic update
      revert?.();
      onError?.(error as Error);
      console.error('Optimistic update failed:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    execute,
    isLoading
  };
}

export default useOptimisticUpdate;