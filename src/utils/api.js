// In production (Docker/Nginx) requests go to /api on the same origin.
// In dev, Vite proxy forwards /api to http://localhost:5000/api.
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const request = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.errors?.[0]?.msg || 'Request failed');
  return data;
};

export const api = {
  getDepartments: () => request('/departments'),
  getDepartment: (id) => request(`/departments/${id}`),

  getDoctors: (departmentId) =>
    request(`/doctors${departmentId ? `?departmentId=${departmentId}` : ''}`),
  getDoctor: (id) => request(`/doctors/${id}`),

  getSlots: (doctorId, date) =>
    request(`/slots?doctorId=${doctorId}${date ? `&date=${date}` : ''}`),

  bookAppointment: (payload) =>
    request('/appointments', { method: 'POST', body: JSON.stringify(payload) }),

  getAppointment: (id) => request(`/appointments/${id}`),
  cancelAppointment: (id) => request(`/appointments/${id}/cancel`, { method: 'PATCH' }),
};
