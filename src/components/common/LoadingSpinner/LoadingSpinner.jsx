import './LoadingSpinner.css'

function LoadingSpinner({ size = 'medium', fullScreen = false }) {
  const spinnerClass = `loading-spinner loading-spinner--${size}`
  
  if (fullScreen) {
    return (
      <div className="loading-spinner-container" role="status" aria-live="polite">
        <div className={spinnerClass}>
          <div className="spinner"></div>
        </div>
        <span className="visually-hidden">Loading, please wait...</span>
      </div>
    )
  }

  return (
    <div className={spinnerClass} role="status" aria-live="polite">
      <div className="spinner"></div>
      <span className="visually-hidden">Loading...</span>
    </div>
  )
}

export default LoadingSpinner
