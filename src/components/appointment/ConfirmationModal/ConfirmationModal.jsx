import { useNavigate } from 'react-router-dom';
import './ConfirmationModal.css';

function ConfirmationModal({ appointmentDetails, onClose }) {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    navigate('/');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `
APPOINTMENT CONFIRMATION

Department: ${appointmentDetails.department}
Doctor: ${appointmentDetails.doctor}
Date: ${appointmentDetails.date}
Time: ${appointmentDetails.time}

Patient Information:
Name: ${appointmentDetails.patientName}
Email: ${appointmentDetails.patientEmail}
Phone: ${appointmentDetails.patientPhone}

Thank you for choosing our hospital!
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointment-confirmation-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="confirmation-modal__overlay" onClick={handleClose} role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
      <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-modal__header">
          <div className="confirmation-modal__icon" aria-hidden="true">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" fill="#10B981" />
              <path
                d="M8 12L11 15L16 9"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 id="confirmation-title" className="confirmation-modal__title">Appointment Confirmed!</h2>
          <p className="confirmation-modal__message">
            Your appointment has been successfully booked. We look forward to seeing you!
          </p>
        </div>

        <div className="confirmation-modal__details">
          <h3 className="confirmation-modal__section-title">Appointment Details</h3>
          
          <div className="confirmation-modal__detail-row">
            <span className="confirmation-modal__label">Department:</span>
            <span className="confirmation-modal__value">{appointmentDetails.department}</span>
          </div>

          <div className="confirmation-modal__detail-row">
            <span className="confirmation-modal__label">Doctor:</span>
            <span className="confirmation-modal__value">{appointmentDetails.doctor}</span>
          </div>

          <div className="confirmation-modal__detail-row">
            <span className="confirmation-modal__label">Date:</span>
            <span className="confirmation-modal__value">{appointmentDetails.date}</span>
          </div>

          <div className="confirmation-modal__detail-row">
            <span className="confirmation-modal__label">Time:</span>
            <span className="confirmation-modal__value">{appointmentDetails.time}</span>
          </div>

          <h3 className="confirmation-modal__section-title">Patient Information</h3>

          <div className="confirmation-modal__detail-row">
            <span className="confirmation-modal__label">Name:</span>
            <span className="confirmation-modal__value">{appointmentDetails.patientName}</span>
          </div>

          <div className="confirmation-modal__detail-row">
            <span className="confirmation-modal__label">Email:</span>
            <span className="confirmation-modal__value">{appointmentDetails.patientEmail}</span>
          </div>

          <div className="confirmation-modal__detail-row">
            <span className="confirmation-modal__label">Phone:</span>
            <span className="confirmation-modal__value">{appointmentDetails.patientPhone}</span>
          </div>
        </div>

        <div className="confirmation-modal__actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleDownload}
            aria-label="Download appointment confirmation"
          >
            Download
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePrint}
            aria-label="Print appointment confirmation"
          >
            Print
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleClose}
            aria-label="Close confirmation and return to home"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
