import AppointmentForm from '../components/appointment/AppointmentForm/AppointmentForm';

function AppointmentPage() {
  const handleComplete = () => {
    // This will be implemented in task 12 for confirmation modal
    console.log('Appointment booking completed');
  };

  return (
    <div className="page appointment-page">
      <div className="container">
        <AppointmentForm onComplete={handleComplete} />
      </div>
    </div>
  );
}

export default AppointmentPage;
