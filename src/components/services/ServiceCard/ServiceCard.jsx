import { useState } from 'react';
import { getDoctorsByDepartment } from '../../../data/mockData';
import LazyImage from '../../common/LazyImage/LazyImage';
import './ServiceCard.css';

function ServiceCard({ department }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const doctors = getDoctorsByDepartment(department.id);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <article className={`service-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="service-card-header" onClick={toggleExpand}>
        <div className="service-card-title">
          <span className="service-card-icon" aria-hidden="true">{department.icon}</span>
          <h3>{department.name}</h3>
        </div>
        <button 
          className="expand-button"
          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${department.name} details`}
          aria-expanded={isExpanded}
          aria-controls={`service-details-${department.id}`}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      <p className="service-card-description">{department.description}</p>

      {isExpanded && (
        <div id={`service-details-${department.id}`} className="service-card-details">
          <div className="service-card-section">
            <h4>Operating Hours</h4>
            <div className="operating-hours">
              <div className="hours-row">
                <span className="hours-label">Weekdays:</span>
                <span className="hours-value">{department.operatingHours.weekdays}</span>
              </div>
              <div className="hours-row">
                <span className="hours-label">Weekends:</span>
                <span className="hours-value">{department.operatingHours.weekends}</span>
              </div>
            </div>
          </div>

          <div className="service-card-section">
            <h4>Our Doctors</h4>
            <div className="doctors-list" role="list">
              {doctors.map(doctor => (
                <article key={doctor.id} className="doctor-item" role="listitem">
                  <LazyImage 
                    src={doctor.photo} 
                    alt={`Portrait of Dr. ${doctor.name}`}
                    className="doctor-photo"
                  />
                  <div className="doctor-info">
                    <p className="doctor-name">{doctor.name}</p>
                    <p className="doctor-specialization">{doctor.specialization}</p>
                    <p className="doctor-bio">{doctor.bio}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default ServiceCard;
