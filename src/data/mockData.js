// Mock data for hospital website

// Departments data
export const departments = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    description: 'Comprehensive heart care including diagnosis, treatment, and prevention of cardiovascular diseases.',
    icon: '❤️',
    operatingHours: {
      weekdays: '8:00 AM - 6:00 PM',
      weekends: '9:00 AM - 2:00 PM'
    }
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    description: 'Specialized medical care for infants, children, and adolescents up to age 18.',
    icon: '👶',
    operatingHours: {
      weekdays: '7:00 AM - 7:00 PM',
      weekends: '8:00 AM - 4:00 PM'
    }
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    description: 'Treatment of musculoskeletal system including bones, joints, ligaments, tendons, and muscles.',
    icon: '🦴',
    operatingHours: {
      weekdays: '8:00 AM - 5:00 PM',
      weekends: 'Closed'
    }
  },
  {
    id: 'neurology',
    name: 'Neurology',
    description: 'Diagnosis and treatment of disorders affecting the brain, spinal cord, and nervous system.',
    icon: '🧠',
    operatingHours: {
      weekdays: '9:00 AM - 6:00 PM',
      weekends: '10:00 AM - 2:00 PM'
    }
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    description: 'Expert care for skin, hair, and nail conditions including medical and cosmetic treatments.',
    icon: '🩺',
    operatingHours: {
      weekdays: '8:00 AM - 5:00 PM',
      weekends: 'Closed'
    }
  },
  {
    id: 'general-medicine',
    name: 'General Medicine',
    description: 'Primary care and treatment for a wide range of common health conditions and preventive care.',
    icon: '⚕️',
    operatingHours: {
      weekdays: '7:00 AM - 8:00 PM',
      weekends: '8:00 AM - 5:00 PM'
    }
  }
];

// Doctors data
export const doctors = [
  {
    id: 'dr-smith',
    name: 'Dr. Sarah Smith',
    specialization: 'Cardiologist',
    departmentId: 'cardiology',
    photo: 'https://via.placeholder.com/150/10B981/FFFFFF?text=SS',
    bio: 'Board-certified cardiologist with 15 years of experience in interventional cardiology and heart disease prevention.'
  },
  {
    id: 'dr-johnson',
    name: 'Dr. Michael Johnson',
    specialization: 'Cardiologist',
    departmentId: 'cardiology',
    photo: 'https://via.placeholder.com/150/10B981/FFFFFF?text=MJ',
    bio: 'Specialized in cardiac imaging and non-invasive cardiology with expertise in echocardiography.'
  },
  {
    id: 'dr-williams',
    name: 'Dr. Emily Williams',
    specialization: 'Pediatrician',
    departmentId: 'pediatrics',
    photo: 'https://via.placeholder.com/150/10B981/FFFFFF?text=EW',
    bio: 'Dedicated pediatrician focusing on child development, vaccinations, and preventive care for children of all ages.'
  },
  {
    id: 'dr-brown',
    name: 'Dr. James Brown',
    specialization: 'Pediatrician',
    departmentId: 'pediatrics',
    photo: 'https://via.placeholder.com/150/10B981/FFFFFF?text=JB',
    bio: 'Experienced in pediatric emergency care and chronic disease management in children.'
  },
  {
    id: 'dr-davis',
    name: 'Dr. Robert Davis',
    specialization: 'Orthopedic Surgeon',
    departmentId: 'orthopedics',
    photo: 'https://via.placeholder.com/150/10B981/FFFFFF?text=RD',
    bio: 'Expert in joint replacement surgery and sports medicine with over 20 years of surgical experience.'
  },
  {
    id: 'dr-miller',
    name: 'Dr. Jennifer Miller',
    specialization: 'Orthopedic Surgeon',
    departmentId: 'orthopedics',
    photo: 'https://via.placeholder.com/150/10B981/FFFFFF?text=JM',
    bio: 'Specialized in spine surgery and minimally invasive orthopedic procedures.'
  },
  {
    id: 'dr-wilson',
    name: 'Dr. David Wilson',
    specialization: 'Neurologist',
    departmentId: 'neurology',
    photo: 'https://via.placeholder.com/150/10B981/FFFFFF?text=DW',
    bio: 'Board-certified neurologist with expertise in stroke care, epilepsy, and movement disorders.'
  },
  {
    id: 'dr-moore',
    name: 'Dr. Lisa Moore',
    specialization: 'Neurologist',
    departmentId: 'neurology',
    photo: 'https://via.placeholder.com/150/10B981/FFFFFF?text=LM',
    bio: 'Specialized in headache medicine and neuromuscular disorders with a focus on patient-centered care.'
  },
  {
    id: 'dr-taylor',
    name: 'Dr. Amanda Taylor',
    specialization: 'Dermatologist',
    departmentId: 'dermatology',
    photo: 'https://via.placeholder.com/150/10B981/FFFFFF?text=AT',
    bio: 'Expert in medical dermatology, skin cancer detection, and cosmetic dermatology procedures.'
  },
  {
    id: 'dr-anderson',
    name: 'Dr. Christopher Anderson',
    specialization: 'Dermatologist',
    departmentId: 'dermatology',
    photo: 'https://via.placeholder.com/150/10B981/FFFFFF?text=CA',
    bio: 'Specialized in pediatric dermatology and treatment of complex skin conditions.'
  },
  {
    id: 'dr-thomas',
    name: 'Dr. Patricia Thomas',
    specialization: 'General Practitioner',
    departmentId: 'general-medicine',
    photo: 'https://via.placeholder.com/150/10B981/FFFFFF?text=PT',
    bio: 'Family medicine physician providing comprehensive primary care for patients of all ages.'
  },
  {
    id: 'dr-jackson',
    name: 'Dr. Richard Jackson',
    specialization: 'General Practitioner',
    departmentId: 'general-medicine',
    photo: 'https://via.placeholder.com/150/10B981/FFFFFF?text=RJ',
    bio: 'Experienced in preventive medicine, chronic disease management, and health promotion.'
  }
];

// Helper function to generate appointment slots for next 30 days
const generateAppointmentSlots = (doctorId, departmentId) => {
  const slots = [];
  const today = new Date();
  
  // Get department operating hours
  const department = departments.find(d => d.id === departmentId);
  const isWeekendOpen = department.operatingHours.weekends !== 'Closed';
  
  // Generate slots for next 30 days
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);
    
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Skip weekends if department is closed
    if (isWeekend && !isWeekendOpen) {
      continue;
    }
    
    // Determine time slots based on day type
    const timeSlots = isWeekend 
      ? ['09:00', '10:00', '11:00', '12:00', '13:00'] // Weekend hours (shorter)
      : ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']; // Weekday hours
    
    timeSlots.forEach(time => {
      // Randomly mark some slots as unavailable (70% available)
      const available = Math.random() > 0.3;
      
      slots.push({
        id: `${doctorId}-${date.toISOString().split('T')[0]}-${time}`,
        doctorId: doctorId,
        date: date.toISOString().split('T')[0], // YYYY-MM-DD format
        time: time,
        available: available
      });
    });
  }
  
  return slots;
};

// Generate appointment slots for all doctors
export const appointmentSlots = doctors.flatMap(doctor => 
  generateAppointmentSlots(doctor.id, doctor.departmentId)
);

// Helper function to get slots by doctor ID
export const getSlotsByDoctor = (doctorId) => {
  return appointmentSlots.filter(slot => slot.doctorId === doctorId);
};

// Helper function to get available slots by doctor ID
export const getAvailableSlotsByDoctor = (doctorId) => {
  return appointmentSlots.filter(slot => slot.doctorId === doctorId && slot.available);
};

// Helper function to get doctors by department ID
export const getDoctorsByDepartment = (departmentId) => {
  return doctors.filter(doctor => doctor.departmentId === departmentId);
};

// Helper function to get department by ID
export const getDepartmentById = (departmentId) => {
  return departments.find(dept => dept.id === departmentId);
};

// Helper function to get doctor by ID
export const getDoctorById = (doctorId) => {
  return doctors.find(doc => doc.id === doctorId);
};
