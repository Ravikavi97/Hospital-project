import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppointment } from '../../../context/AppointmentContext';
import './PatientInfoForm.css';

function PatientInfoForm() {
  const { patientInfo, updatePatientInfo } = useAppointment();

  const {
    register,
    formState: { errors },
    watch,
    trigger
  } = useForm({
    mode: 'onChange',
    defaultValues: patientInfo
  });

  // Watch all fields and update context in real-time
  const watchedFields = watch();

  useEffect(() => {
    updatePatientInfo(watchedFields);
  }, [watchedFields, updatePatientInfo]);

  // Trigger validation on mount if fields have values
  useEffect(() => {
    if (patientInfo.name || patientInfo.email || patientInfo.phone) {
      trigger();
    }
  }, []);

  return (
    <div className="patient-info-form">
      <h2 className="patient-info-form__title">Your Information</h2>
      <p className="patient-info-form__subtitle">
        Please provide your contact details to complete the booking
      </p>

      <form className="patient-info-form__form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name <span className="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Enter your full name"
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
              },
              pattern: {
                value: /^[a-zA-Z\s]+$/,
                message: 'Name can only contain letters and spaces'
              }
            })}
          />
          {errors.name && (
            <span className="form-error">{errors.name.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address <span className="required">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="your.email@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address'
              }
            })}
          />
          {errors.email && (
            <span className="form-error">{errors.email.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Phone Number <span className="required">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            placeholder="(123) 456-7890"
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[\d\s\-\(\)\+]+$/,
                message: 'Please enter a valid phone number'
              },
              minLength: {
                value: 10,
                message: 'Phone number must be at least 10 digits'
              }
            })}
          />
          {errors.phone && (
            <span className="form-error">{errors.phone.message}</span>
          )}
          <span className="form-hint">
            Include country code if calling from outside the US
          </span>
        </div>
      </form>
    </div>
  );
}

export default PatientInfoForm;
