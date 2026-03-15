import { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReset = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { fallback, showDetails = false } = this.props;
      const { error, errorInfo, retryCount } = this.state;

      // Use custom fallback if provided
      if (fallback) {
        return fallback({ error, errorInfo, retry: this.handleRetry, reset: this.handleReset });
      }

      // Default error UI
      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary__content">
            <svg 
              className="error-boundary__icon" 
              width="64" 
              height="64" 
              viewBox="0 0 64 64" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="4"/>
              <path d="M32 16V36M32 44V48" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            
            <h1 className="error-boundary__title">Something went wrong</h1>
            
            <p className="error-boundary__message">
              We're sorry, but something unexpected happened. Please try again or return to the homepage.
            </p>

            {showDetails && error && (
              <details className="error-boundary__details">
                <summary>Error details</summary>
                <pre className="error-boundary__stack">
                  {error.toString()}
                  {errorInfo && errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="error-boundary__actions">
              <button 
                className="btn btn-primary" 
                onClick={this.handleRetry}
                aria-label="Try again"
              >
                {retryCount > 0 ? `Try Again (${retryCount})` : 'Try Again'}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={this.handleReset}
                aria-label="Go to homepage"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
