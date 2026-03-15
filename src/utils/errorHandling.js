/**
 * Utility functions for error handling across the application
 */

/**
 * Format error messages for user display
 * @param {Error|string} error - The error to format
 * @returns {string} - User-friendly error message
 */
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Check if error is a network error
 * @param {Error} error - The error to check
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return (
    error?.message?.includes('network') ||
    error?.message?.includes('fetch') ||
    error?.name === 'NetworkError' ||
    !navigator.onLine
  );
};

/**
 * Check if error is a validation error
 * @param {Error} error - The error to check
 * @returns {boolean}
 */
export const isValidationError = (error) => {
  return (
    error?.message?.includes('validation') ||
    error?.message?.includes('invalid') ||
    error?.name === 'ValidationError'
  );
};

/**
 * Log error to console in development, or to error tracking service in production
 * @param {Error} error - The error to log
 * @param {Object} context - Additional context about the error
 */
export const logError = (error, context = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
    console.error('Context:', context);
  } else {
    // In production, send to error tracking service
    // Example: Sentry.captureException(error, { extra: context });
  }
};

/**
 * Create a user-friendly error message based on error type
 * @param {Error} error - The error
 * @returns {string} - User-friendly message
 */
export const getUserFriendlyMessage = (error) => {
  if (isNetworkError(error)) {
    return 'Unable to connect. Please check your internet connection and try again.';
  }

  if (isValidationError(error)) {
    return error.message || 'Please check your input and try again.';
  }

  return formatErrorMessage(error);
};
