import { createContext, useContext, useState } from 'react';

const AppointmentContext = createContext(undefined);

export const AppointmentProvider = ({ children }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const updateDepartment = (department) => {
    setSelectedDepartment(department);
    // Reset dependent selections when department changes
    setSelectedDoctor(null);
    setSelectedSlot(null);
  };

  const updateDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    // Reset slot when doctor changes
    setSelectedSlot(null);
  };

  const updateSlot = (slot) => {
    setSelectedSlot(slot);
  };

  const updatePatientInfo = (info) => {
    setPatientInfo(prev => ({
      ...prev,
      ...info
    }));
  };

  const resetBooking = () => {
    setSelectedDepartment(null);
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setPatientInfo({
      name: '',
      email: '',
      phone: ''
    });
  };

  const value = {
    selectedDepartment,
    selectedDoctor,
    selectedSlot,
    patientInfo,
    updateDepartment,
    updateDoctor,
    updateSlot,
    updatePatientInfo,
    resetBooking
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};
