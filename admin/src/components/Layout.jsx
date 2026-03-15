import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { can, ROLE_COLORS } from '../permissions.js';

const ALL_NAV = [
  { to: '/dashboard',   icon: '📊', label: 'Dashboard',   action: 'viewAll' },
  { to: '/appointments',icon: '📅', label: 'Appointments', action: 'viewAll' },
  { to: '/doctors',     icon: '👨‍⚕️', label: 'Doctors',      action: 'viewAll' },
  { to: '/departments', icon: '🏥', label: 'Departments',  action: 'viewAll' },
  { to: '/patients',    icon: '👥', label: 'Patients',     action: 'viewAll' },
  { to: '/users',       icon: '🔐', label: 'Users',        action: 'manageUsers' },
];

export default function Layout() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const role = auth?.user?.role;
  const nav = ALL_NAV.filter(n => can(role, n.action));

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {open && (
        <div onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 99 }} />
      )}

      <aside className={`sidebar${open ? ' open' : ''}`} style={{
        width: 240, background: 'linear-gradient(180deg, #0f766e 0%, #0d5f58 100%)',
        color: '#fff', display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100, transition: 'transform .25s',
      }}>
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,.15)' }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>🏥 MediAdmin</div>
          <div style={{ fontSize: 12, opacity: .7, marginTop: 4 }}>Hospital Staff Portal</div>
        </div>

        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {nav.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10, padding: '11px 20px',
                color: isActive ? '#fff' : 'rgba(255,255,255,.75)',
                background: isActive ? 'rgba(255,255,255,.15)' : 'transparent',
                borderLeft: isActive ? '3px solid #fff' : '3px solid transparent',
                fontWeight: isActive ? 600 : 400, fontSize: 14, transition: 'all .15s',
              })}>
              <span>{icon}</span>{label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,.15)' }}>
          <div style={{ fontSize: 13, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ opacity: .9 }}>👤 {auth?.user?.full_name || auth?.user?.username}</span>
            <span style={{
              fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 600,
              background: ROLE_COLORS[role] || '#666', color: '#fff',
            }}>{role}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm"
            style={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)', width: '100%', justifyContent: 'center' }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      <div className="main-content" style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={{
          background: '#fff', borderBottom: '1px solid var(--border)', padding: '0 24px',
          height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 50, boxShadow: 'var(--shadow)',
        }}>
          <button className="hamburger-btn" onClick={() => setOpen(o => !o)}
            style={{ background: 'none', border: 'none', fontSize: 22, display: 'none' }}>☰</button>
          <div style={{ fontWeight: 600, color: 'var(--primary)' }}>Hospital Admin Portal</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </header>
        <main style={{ flex: 1, padding: '24px' }}><Outlet /></main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
          .main-content { margin-left: 0 !important; }
          .hamburger-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}
