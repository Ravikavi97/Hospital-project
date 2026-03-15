import { useState, useEffect } from 'react';
import { useAppointment } from '../../../context/AppointmentContext';
import { api } from '../../../utils/api.js';
import './DepartmentSelector.css';

function DepartmentSelector() {
  const { selectedDepartment, updateDepartment } = useAppointment();
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getDepartments()
      .then(setDepartments)
      .catch(() => setError('Failed to load departments. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="department-selector"><p>Loading departments...</p></div>;
  if (error) return <div className="department-selector"><p className="department-selector__empty">{error}</p></div>;

  return (
    <div className="department-selector">
      <h2 className="department-selector__title">Select a Department</h2>
      <p className="department-selector__subtitle">
        Choose the medical department you'd like to visit
      </p>

      <div className="department-selector__search">
        <label htmlFor="department-search" className="visually-hidden">Search departments</label>
        <input
          id="department-search"
          type="text"
          placeholder="Search departments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="department-selector__search-input"
          aria-label="Search departments by name or description"
        />
      </div>

      <div className="department-selector__grid" role="list" aria-label="Available departments">
        {filteredDepartments.map((dept) => (
          <article
            key={dept.id}
            className={`department-card ${selectedDepartment?.id === dept.id ? 'selected' : ''}`}
            onClick={() => updateDepartment(dept)}
            role="button"
            tabIndex={0}
            aria-pressed={selectedDepartment?.id === dept.id}
            aria-label={`Select ${dept.name} department`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateDepartment(dept); } }}
          >
            <div className="department-card__icon" aria-hidden="true">{dept.icon}</div>
            <h3 className="department-card__name">{dept.name}</h3>
            <p className="department-card__description">{dept.description}</p>
            <div className="department-card__hours">
              <div className="department-card__hours-item">
                <strong>Weekdays:</strong> {dept.operatingHours.weekdays}
              </div>
              <div className="department-card__hours-item">
                <strong>Weekends:</strong> {dept.operatingHours.weekends}
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredDepartments.length === 0 && (
        <div className="department-selector__empty" role="status" aria-live="polite">
          <p>No departments found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}

export default DepartmentSelector;
