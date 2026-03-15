import { useState } from 'react';
import { useAppointment } from '../../../context/AppointmentContext';
import { useToast } from '../../../context/ToastContext';
import DepartmentSelector from '../DepartmentSelector/DepartmentSelector';
import DoctorSelector from '../DoctorSelector/DoctorSelector';
import DateTimePicker from '../DateTimePicker/DateTimePicker';
import PatientInfoForm from '../PatientInfoForm/PatientInfoForm';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import useRetry from '../../../hooks/useRetry';
import { api } from '../../../utils/api.js';
import './AppointmentForm.css';

const STEPS = {
  DEPARTMENT: 1,
  DOCTOR: 2,
  DATETIME: 3,
  PATIENT_INFO: 4
};

const STEP_TITLES = {
  [STEPS.DEPARTMENT]: 'Select Department',
  [STEPS.DOCTOR]: 'Choose Doctor',
  [STEPS.DATETIME]: 'Pick Date & Time',
  [STEPS.PATIENT_INFO]: 'Your Information'
};

function AppointmentForm({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(STEPS.DEPARTMENT);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { selectedDepartment, selectedDoctor, selectedSlot, patientInfo, resetBooking } = useAppointment();
  const { showSuccess, showError } = useToast();

  const bookAppointment = async () => {
    const result = await api.bookAppointment({
      slotId: selectedSlot.id,
      doctorId: selectedDoctor.id,
      departmentId: selectedDepartment.id,
      patientName: patientInfo.name,
      patientEmail: patientInfo.email,
      patientPhone: patientInfo.phone,
    });
    return result;
  };

  // Use retry hook for booking with automatic retry logic
  const { execute: submitBooking, isLoading: isSubmitting, error: submitError } = useRetry(
    bookAppointment,
    {
      maxRetries: 2,
      retryDelay: 1000,
      onSuccess: () => {
        showSuccess('Appointment booked successfully!');
        setShowConfirmation(true);
        onComplete?.();
      },
      onError: (error) => {
        showError(error.message || 'Failed to book appointment after multiple attempts. Please try again later.');
      }
    }
  );

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case STEPS.DEPARTMENT:
        return selectedDepartment !== null;
      case STEPS.DOCTOR:
        return selectedDoctor !== null;
      case STEPS.DATETIME:
        return selectedSlot !== null;
      case STEPS.PATIENT_INFO:
        return patientInfo.name && patientInfo.email && patientInfo.phone;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStep() && currentStep < STEPS.PATIENT_INFO) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > STEPS.DEPARTMENT) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate all steps are complete
    if (!selectedDepartment || !selectedDoctor || !selectedSlot || !patientInfo.name || !patientInfo.email || !patientInfo.phone) {
      showError('Please complete all steps before submitting.');
      return;
    }

    try {
      await submitBooking();
    } catch (error) {
      // Error already handled by useRetry hook
      console.error('Booking failed:', error);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    resetBooking();
    setCurrentStep(STEPS.DEPARTMENT);
  };

  const getAppointmentDetails = () => {
    if (!selectedDepartment || !selectedDoctor || !selectedSlot) {
      return null;
    }

    return {
      department: selectedDepartment.name,
      doctor: selectedDoctor.name,
      date: new Date(selectedSlot.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: selectedSlot.time,
      patientName: patientInfo.name,
      patientEmail: patientInfo.email,
      patientPhone: patientInfo.phone
    };
  };

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.DEPARTMENT:
        return <DepartmentSelector />;
      case STEPS.DOCTOR:
        return <DoctorSelector />;
      case STEPS.DATETIME:
        return <DateTimePicker />;
      case STEPS.PATIENT_INFO:
        return <PatientInfoForm />;
      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / Object.keys(STEPS).length) * 100;

  return (
    <div className="appointment-form">
      <div className="appointment-form__header">
        <nav className="appointment-form__steps" aria-label="Appointment booking progress">
          {Object.entries(STEPS).map(([key, stepNumber]) => (
            <div
              key={key}
              className={`appointment-form__step ${
                stepNumber === currentStep ? 'active' : ''
              } ${stepNumber < currentStep ? 'completed' : ''}`}
              aria-current={stepNumber === currentStep ? 'step' : undefined}
            >
              <div className="appointment-form__step-number" aria-label={`Step ${stepNumber}`}>
                {stepNumber}
              </div>
              <div className="appointment-form__step-title">
                {STEP_TITLES[stepNumber]}
              </div>
            </div>
          ))}
        </nav>
        <div className="appointment-form__progress" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin="0" aria-valuemax="100" aria-label="Booking progress">
          <div
            className="appointment-form__progress-bar"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {submitError && (
        <div className="appointment-form__error" role="alert" aria-live="assertive">
          {submitError.message || submitError}
        </div>
      )}

      <div className="appointment-form__content">
        {isSubmitting && <LoadingSpinner fullScreen />}
        {renderStep()}
      </div>

      <div className="appointment-form__actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleBack}
          disabled={currentStep === STEPS.DEPARTMENT || isSubmitting}
          aria-label="Go back to previous step"
        >
          Back
        </button>
        {currentStep < STEPS.PATIENT_INFO ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!canProceedToNextStep()}
            aria-label="Proceed to next step"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!canProceedToNextStep() || isSubmitting}
            aria-label="Submit appointment booking"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>

      {showConfirmation && getAppointmentDetails() && (
        <ConfirmationModal
          appointmentDetails={getAppointmentDetails()}
          onClose={handleCloseConfirmation}
        />
      )}
    </div>
  );
}

export default AppointmentForm;
