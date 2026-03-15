import { useState, useEffect, useMemo } from 'react';
import { useAppointment } from '../../../context/AppointmentContext';
import { api } from '../../../utils/api.js';
import './DateTimePicker.css';

function DateTimePicker() {
  const { selectedDoctor, selectedSlot, updateSlot } = useAppointment();
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedDoctor) return;
    setLoading(true);
    api.getSlots(selectedDoctor.id)
      .then(setSlots)
      .catch(() => setError('Failed to load available slots. Please try again.'))
      .finally(() => setLoading(false));
  }, [selectedDoctor]);

  // Normalize date: DB returns ISO string "2026-03-02T00:00:00.000Z", extract YYYY-MM-DD
  const toDateKey = (isoDate) => {
    if (!isoDate) return '';
    return typeof isoDate === 'string' ? isoDate.slice(0, 10) : isoDate;
  };

  const slotsByDate = useMemo(() => {
    const grouped = {};
    slots.forEach((slot) => {
      const key = toDateKey(slot.date);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push({ ...slot, dateKey: key });
    });
    return grouped;
  }, [slots]);

  if (!selectedDoctor) {
    return <div className="datetime-picker__error"><p>Please select a doctor first.</p></div>;
  }
  if (loading) return <div className="datetime-picker"><p>Loading available slots...</p></div>;
  if (error) return <div className="datetime-picker"><p>{error}</p></div>;

  const availableDates = Object.keys(slotsByDate).sort();

  const formatDate = (dateKey) => {
    const date = new Date(dateKey + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = String(timeString).split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const timeSlots = selectedDate ? slotsByDate[selectedDate] : [];

  return (
    <div className="datetime-picker">
      <h2 className="datetime-picker__title">Select Date & Time</h2>
      <p className="datetime-picker__subtitle">
        Choose an available appointment slot with {selectedDoctor.name}
      </p>

      <div className="datetime-picker__content">
        <div className="datetime-picker__dates">
          <h3 className="datetime-picker__section-title">Available Dates</h3>
          <div className="datetime-picker__date-list" role="list" aria-label="Available appointment dates">
            {availableDates.map((dateKey) => {
              const hasAvailable = slotsByDate[dateKey].some(s => s.available);
              return (
                <button
                  key={dateKey}
                  className={`date-button ${selectedDate === dateKey ? 'selected' : ''} ${!hasAvailable ? 'disabled' : ''}`}
                  onClick={() => setSelectedDate(dateKey)}
                  disabled={!hasAvailable}
                  aria-pressed={selectedDate === dateKey}
                  aria-label={`${formatDate(dateKey)}${!hasAvailable ? ' - No slots available' : ''}`}
                >
                  <span className="date-button__text">{formatDate(dateKey)}</span>
                  {!hasAvailable && <span className="date-button__badge" aria-hidden="true">Full</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="datetime-picker__times">
          <h3 className="datetime-picker__section-title">
            {selectedDate ? 'Available Times' : 'Select a date first'}
          </h3>
          {selectedDate && (
            <div className="datetime-picker__time-grid" role="list" aria-label="Available appointment times">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  className={`time-button ${selectedSlot?.id === slot.id ? 'selected' : ''} ${!slot.available ? 'disabled' : ''}`}
                  onClick={() => slot.available && updateSlot(slot)}
                  disabled={!slot.available}
                  aria-pressed={selectedSlot?.id === slot.id}
                  aria-label={`${formatTime(slot.time)}${!slot.available ? ' - Not available' : ''}`}
                >
                  {formatTime(slot.time)}
                </button>
              ))}
            </div>
          )}
          {!selectedDate && (
            <div className="datetime-picker__placeholder" role="status" aria-live="polite">
              <p>Please select a date to view available time slots</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DateTimePicker;
