const BASE = '/api';

const clearSession = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  window.location.href = '/login';
};

const req = async (path, options = {}) => {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const data = await res.json();
  if (res.status === 401) {
    clearSession();
    return;
  }
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

export const api = {
  login: (body) => req('/admin/login', { method: 'POST', body: JSON.stringify(body) }),
  stats: () => req('/admin/stats'),
  appointments: (params = {}) => req('/admin/appointments?' + new URLSearchParams(params)),
  cancelAppointment: (id) => req(`/admin/appointments/${id}/cancel`, { method: 'PATCH' }),
  patients: () => req('/admin/patients'),
  doctors: (deptId) => req(`/doctors${deptId ? `?departmentId=${deptId}` : ''}`),
  createDoctor: (body) => req('/admin/doctors', { method: 'POST', body: JSON.stringify(body) }),
  updateDoctor: (id, body) => req(`/admin/doctors/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteDoctor: (id) => req(`/admin/doctors/${id}`, { method: 'DELETE' }),
  departments: () => req('/departments'),
  createDepartment: (body) => req('/admin/departments', { method: 'POST', body: JSON.stringify(body) }),
  updateDepartment: (id, body) => req(`/admin/departments/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteDepartment: (id) => req(`/admin/departments/${id}`, { method: 'DELETE' }),
  users: () => req('/admin/users'),
  createUser: (body) => req('/admin/users', { method: 'POST', body: JSON.stringify(body) }),
  updateUser: (id, body) => req(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteUser: (id) => req(`/admin/users/${id}`, { method: 'DELETE' }),
};
