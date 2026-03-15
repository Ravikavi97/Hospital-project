import { useEffect } from 'react';
import './Toast.css';

function Toast({ id, message, type, onClose }) {
  useEffect(() => {
    // Add animation class after mount
    const timer = setTimeout(() => {
      const element = document.getElementById(`toast-${id}`);
      if (element) {
        element.classList.add('toast--visible');
      }
    }, 10);

    return () => clearTimeout(timer);
  }, [id]);

  const handleClose = () => {
    const element = document.getElementById(`toast-${id}`);
    if (element) {
      element.classList.remove('toast--visible');
      element.classList.add('toast--exit');
      setTimeout(() => {
        onClose(id);
      }, 300);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="toast__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="currentColor"/>
          </svg>
        );
      case 'error':
        return (
          <svg className="toast__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor"/>
          </svg>
        );
      case 'warning':
        return (
          <svg className="toast__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M1 17H19L10 2L1 17ZM11 14H9V12H11V14ZM11 10H9V6H11V10Z" fill="currentColor"/>
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="toast__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z" fill="currentColor"/>
          </svg>
        );
    }
  };

  return (
    <div
      id={`toast-${id}`}
      className={`toast toast--${type}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {getIcon()}
      <span className="toast__message">{message}</span>
      <button
        className="toast__close"
        onClick={handleClose}
        aria-label="Close notification"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

export default Toast;
