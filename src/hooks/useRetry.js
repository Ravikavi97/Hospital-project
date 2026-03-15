import { useState, useCallback } from 'react';

/**
 * Custom hook for handling retry logic for failed operations
 * @param {Function} operation - The async operation to retry
 * @param {Object} options - Configuration options
 * @param {number} options.maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} options.retryDelay - Delay between retries in ms (default: 1000)
 * @param {Function} options.onError - Callback when all retries fail
 * @param {Function} options.onSuccess - Callback when operation succeeds
 * @returns {Object} - { execute, isLoading, error, retryCount, reset }
 */
function useRetry(operation, options = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onError,
    onSuccess
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setRetryCount(0);
  }, []);

  const execute = useCallback(async (...args) => {
    setIsLoading(true);
    setError(null);
    let currentRetry = 0;

    while (currentRetry <= maxRetries) {
      try {
        const result = await operation(...args);
        setIsLoading(false);
        setRetryCount(0);
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } catch (err) {
        currentRetry++;
        setRetryCount(currentRetry);

        if (currentRetry > maxRetries) {
          setIsLoading(false);
          setError(err);
          
          if (onError) {
            onError(err);
          }
          
          throw err;
        }

        // Wait before retrying (exponential backoff)
        await new Promise(resolve => 
          setTimeout(resolve, retryDelay * Math.pow(2, currentRetry - 1))
        );
      }
    }
  }, [operation, maxRetries, retryDelay, onError, onSuccess]);

  return {
    execute,
    isLoading,
    error,
    retryCount,
    reset
  };
}

export default useRetry;
