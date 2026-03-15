import { useEffect, useState } from 'react';
import { api } from '../api.js';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 52, height: 52, borderRadius: 12, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color }}>{value ?? '—'}</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.stats(), api.appointments({ status: 'confirmed' })])
      .then(([s, appts]) => { setStats(s); setRecent(appts.slice(0, 8)); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading…</div>;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Overview of hospital operations</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard icon="📅" label="Total Appointments" value={stats?.total_appointments} color="#0f766e" />
        <StatCard icon="✅" label="Confirmed" value={stats?.confirmed} color="#10b981" />
        <StatCard icon="❌" label="Cancelled" value={stats?.cancelled} color="#ef4444" />
        <StatCard icon="👨‍⚕️" label="Doctors" value={stats?.total_doctors} color="#6366f1" />
        <StatCard icon="👥" label="Patients" value={stats?.total_patients} color="#f59e0b" />
        <StatCard icon="🏥" label="Departments" value={stats?.total_departments} color="#0ea5e9" />
      </div>

      <div className="card">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>
          📋 Recent Confirmed Appointments
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>No appointments</td></tr>
              ) : recent.map(a => (
                <tr key={a.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{a.patient_name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.patient_email}</div>
                  </td>
                  <td>{a.doctor_name}</td>
                  <td>{a.department_name}</td>
                  <td>{new Date(a.slot_date).toLocaleDateString()}</td>
                  <td>{String(a.slot_time).slice(0, 5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
