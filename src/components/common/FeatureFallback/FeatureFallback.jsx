import './FeatureFallback.css';

/**
 * Component for graceful degradation when features are unavailable
 */
function FeatureFallback({ 
  featureName, 
  message, 
  onRetry, 
  showRetry = true,
  children 
}) {
  const defaultMessage = `${featureName || 'This feature'} is currently unavailable. Please try again later.`;

  return (
    <div className="feature-fallback" role="status" aria-live="polite">
      <div className="feature-fallback__content">
        <svg 
          className="feature-fallback__icon" 
          width="48" 
          height="48" 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path 
            d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 40C15.18 40 8 32.82 8 24C8 15.18 15.18 8 24 8C32.82 8 40 15.18 40 24C40 32.82 32.82 40 24 40ZM22 22V14H26V22H22ZM22 34V26H26V34H22Z" 
            fill="currentColor"
          />
        </svg>
        
        <p className="feature-fallback__message">
          {message || defaultMessage}
        </p>

        {children && (
          <div className="feature-fallback__alternative">
            {children}
          </div>
        )}

        {showRetry && onRetry && (
          <button 
            className="btn btn-primary feature-fallback__retry" 
            onClick={onRetry}
            aria-label="Retry loading feature"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default FeatureFallback;
