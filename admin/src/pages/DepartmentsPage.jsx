import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { can } from '../permissions.js';

const EMPTY = { id: '', name: '', description: '', icon: '', weekday_hours: '', weekend_hours: '' };

export default function DepartmentsPage() {
  const { auth } = useAuth();
  const canManage = can(auth?.user?.role, 'manageDepartments');
  const [departments, setDepartments] = useState([]);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const load = () => api.departments().then(setDepartments);
  useEffect(() => { load(); }, []);

  const openAdd = () => { reset(EMPTY); setModal('add'); };
  const openEdit = (d) => {
    reset({ ...d, weekday_hours: d.operatingHours?.weekdays, weekend_hours: d.operatingHours?.weekends });
    setModal(d);
  };
  const closeModal = () => setModal(null);

  const onSubmit = async (data) => {
    try {
      if (modal === 'add') await api.createDepartment(data);
      else await api.updateDepartment(modal.id, data);
      await load(); closeModal();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this department? All associated doctors and slots will be removed.')) return;
    setDeleting(id);
    try { await api.deleteDepartment(id); await load(); }
    catch (err) { alert(err.message); }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>🏥 Departments</h1>
        {canManage && <button className="btn btn-primary" onClick={openAdd}>+ Add Department</button>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {departments.map(d => (
          <div key={d.id} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontSize: 32 }}>{d.icon}</div>
              {canManage && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(d)}>✏️</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id)} disabled={deleting === d.id}>
                    {deleting === d.id ? '…' : '🗑️'}
                  </button>
                </div>
              )}
            </div>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{d.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>{d.description}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
              <div>🕐 Weekdays: {d.operatingHours?.weekdays}</div>
              <div>🕐 Weekends: {d.operatingHours?.weekends}</div>
            </div>
          </div>
        ))}
      </div>

      {canManage && modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h3>{modal === 'add' ? 'Add Department' : 'Edit Department'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body">
                {modal === 'add' && (
                  <div className="form-group">
                    <label>ID (slug, e.g. radiology)</label>
                    <input className={`form-control ${errors.id ? 'error' : ''}`} {...register('id', { required: true })} />
                    {errors.id && <span className="error-msg">Required</span>}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 12 }}>
                  <div className="form-group">
                    <label>Name</label>
                    <input className={`form-control ${errors.name ? 'error' : ''}`} {...register('name', { required: true })} />
                    {errors.name && <span className="error-msg">Required</span>}
                  </div>
                  <div className="form-group">
                    <label>Icon</label>
                    <input className="form-control" {...register('icon')} placeholder="🏥" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className={`form-control ${errors.description ? 'error' : ''}`} rows={2} {...register('description', { required: true })} />
                  {errors.description && <span className="error-msg">Required</span>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Weekday Hours</label>
                    <input className="form-control" {...register('weekday_hours')} placeholder="8:00 AM - 5:00 PM" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Weekend Hours</label>
                    <input className="form-control" {...register('weekend_hours')} placeholder="Closed" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
