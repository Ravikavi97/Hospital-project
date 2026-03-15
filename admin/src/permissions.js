// Role hierarchy: admin > manager > staff
const LEVEL = { admin: 3, manager: 2, staff: 1 };

export const can = (role, action) => {
  const level = LEVEL[role] || 0;
  switch (action) {
    case 'manageUsers':       return level >= 3; // admin only
    case 'manageDoctors':     return level >= 2; // manager+
    case 'manageDepartments': return level >= 2;
    case 'cancelAppointment': return level >= 2;
    case 'viewAll':           return level >= 1; // all
    default: return false;
  }
};

export const ROLE_LABELS = { admin: 'Admin', manager: 'Manager', staff: 'Staff' };
export const ROLE_COLORS = { admin: '#0f766e', manager: '#6366f1', staff: '#f59e0b' };
