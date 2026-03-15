import { useState, useEffect } from 'react';
import { useAppointment } from '../../../context/AppointmentContext';
import { api } from '../../../utils/api.js';
import LazyImage from '../../common/LazyImage/LazyImage';
import './DoctorSelector.css';

function DoctorSelector() {
  const { selectedDepartment, selectedDoctor, updateDoctor } = useAppointment();
  const [expandedDoctorId, setExpandedDoctorId] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedDepartment) return;
    setLoading(true);
    api.getDoctors(selectedDepartment.id)
      .then(setDoctors)
      .catch(() => setError('Failed to load doctors. Please try again.'))
      .finally(() => setLoading(false));
  }, [selectedDepartment]);

  if (!selectedDepartment) {
    return <div className="doctor-selector__error"><p>Please select a department first.</p></div>;
  }

  if (loading) return <div className="doctor-selector"><p>Loading doctors...</p></div>;
  if (error) return <div className="doctor-selector"><p>{error}</p></div>;

  return (
    <div className="doctor-selector">
      <h2 className="doctor-selector__title">Choose Your Doctor</h2>
      <p className="doctor-selector__subtitle">
        Select a healthcare provider from {selectedDepartment.name}
      </p>

      <div className="doctor-selector__list" role="list" aria-label="Available doctors">
        {doctors.map((doctor) => {
          const isExpanded = expandedDoctorId === doctor.id;
          return (
            <article
              key={doctor.id}
              className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
            >
              <div
                className="doctor-card__main"
                onClick={() => updateDoctor(doctor)}
                role="button"
                tabIndex={0}
                aria-pressed={selectedDoctor?.id === doctor.id}
                aria-label={`Select ${doctor.name}, ${doctor.specialization}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateDoctor(doctor); } }}
              >
                <div className="doctor-card__photo">
                  <LazyImage src={doctor.photo} alt={`Portrait of ${doctor.name}`} />
                </div>
                <div className="doctor-card__info">
                  <h3 className="doctor-card__name">{doctor.name}</h3>
                  <p className="doctor-card__specialization">{doctor.specialization}</p>
                  <div className="doctor-card__availability">
                    <span className="doctor-card__availability-badge available" role="status">
                      Available
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="doctor-card__bio-toggle"
                onClick={() => setExpandedDoctorId(isExpanded ? null : doctor.id)}
                aria-expanded={isExpanded}
                aria-controls={`doctor-bio-${doctor.id}`}
                aria-label={`${isExpanded ? 'Hide' : 'View'} biography for ${doctor.name}`}
              >
                {isExpanded ? 'Hide' : 'View'} Bio
              </button>

              {isExpanded && (
                <div
                  id={`doctor-bio-${doctor.id}`}
                  className="doctor-card__bio"
                  role="region"
                  aria-label={`Biography of ${doctor.name}`}
                >
                  <p>{doctor.bio}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {doctors.length === 0 && (
        <div className="doctor-selector__empty" role="status" aria-live="polite">
          <p>No doctors available for this department.</p>
        </div>
      )}
    </div>
  );
}

export default DoctorSelector;
