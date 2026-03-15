import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { can } from '../permissions.js';

export default function AppointmentsPage() {
  const { auth } = useAuth();
  const canCancel = can(auth?.user?.role, 'cancelAppointment');
  const [appointments, setAppointments] = useState([]);
  const [filters, setFilters] = useState({ status: '', departmentId: '', date: '' });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const data = await api.appointments(params);
      setAppointments(data);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    api.departments().then(setDepartments);
    load();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    setCancelling(id);
    try {
      await api.cancelAppointment(id);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
    } catch (err) { alert(err.message); }
    finally { setCancelling(null); }
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>📅 Appointments</h1>

      {/* Filters */}
      <div className="card" style={{ padding: 16, marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
        <div className="form-group" style={{ margin: 0, flex: '1 1 130px' }}>
          <label>Status</label>
          <select className="form-control" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
            <option value="">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="form-group" style={{ margin: 0, flex: '1 1 150px' }}>
          <label>Department</label>
          <select className="form-control" value={filters.departmentId} onChange={e => setFilters(f => ({ ...f, departmentId: e.target.value }))}>
            <option value="">All</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ margin: 0, flex: '1 1 140px' }}>
          <label>Date</label>
          <input type="date" className="form-control" value={filters.date} onChange={e => setFilters(f => ({ ...f, date: e.target.value }))} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button className="btn btn-primary" onClick={load}>🔍 Filter</button>
          <button className="btn btn-ghost" onClick={() => { setFilters({ status: '', departmentId: '', date: '' }); setTimeout(load, 0); }}>✕ Clear</button>
        </div>
      </div>

      <div className="card">
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600 }}>Results</span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{appointments.length} records</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading…</div>
        ) : appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No appointments found</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="appt-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Department</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    {canCancel && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>#{a.id}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{a.patient_name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.patient_phone}</div>
                      </td>
                      <td>
                        <div>{a.doctor_name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.specialization}</div>
                      </td>
                      <td>{a.department_name}</td>
                      <td>
                        <div>{new Date(a.slot_date).toLocaleDateString()}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{String(a.slot_time).slice(0, 5)}</div>
                      </td>
                      <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                      {canCancel && (
                        <td>
                          {a.status === 'confirmed' && (
                            <button className="btn btn-danger btn-sm" onClick={() => handleCancel(a.id)} disabled={cancelling === a.id}>
                              {cancelling === a.id ? '…' : 'Cancel'}
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="appt-cards">
              {appointments.map(a => (
                <div key={a.id} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{a.patient_name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.patient_phone}</div>
                    </div>
                    <span className={`badge badge-${a.status}`}>{a.status}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', fontSize: 13 }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Doctor: </span>{a.doctor_name}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Dept: </span>{a.department_name}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Date: </span>{new Date(a.slot_date).toLocaleDateString()}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Time: </span>{String(a.slot_time).slice(0, 5)}</div>
                  </div>
                  {canCancel && a.status === 'confirmed' && (
                    <div style={{ marginTop: 10 }}>
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancel(a.id)} disabled={cancelling === a.id}>
                        {cancelling === a.id ? '…' : 'Cancel Appointment'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        .appt-table-wrap { overflow-x: auto; }
        .appt-cards { display: none; }
        @media (max-width: 640px) {
          .appt-table-wrap { display: none; }
          .appt-cards { display: block; }
        }
      `}</style>
    </div>
  );
}
