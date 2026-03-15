import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { can } from '../permissions.js';

const EMPTY = { id: '', name: '', specialization: '', department_id: '', photo: '', bio: '' };

export default function DoctorsPage() {
  const { auth } = useAuth();
  const canManage = can(auth?.user?.role, 'manageDoctors');
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const load = () => api.doctors().then(setDoctors);
  useEffect(() => { load(); api.departments().then(setDepartments); }, []);

  const openAdd = () => { reset(EMPTY); setModal('add'); };
  const openEdit = (d) => { reset({ ...d, department_id: d.department_id || d.departmentId }); setModal(d); };
  const closeModal = () => setModal(null);

  const onSubmit = async (data) => {
    try {
      if (modal === 'add') await api.createDoctor(data);
      else await api.updateDoctor(modal.id, data);
      await load(); closeModal();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this doctor? This will also delete their slots.')) return;
    setDeleting(id);
    try { await api.deleteDoctor(id); await load(); }
    catch (err) { alert(err.message); }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>👨⚕️ Doctors</h1>
        {canManage && <button className="btn btn-primary" onClick={openAdd}>+ Add Doctor</button>}
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Doctor</th><th>Specialization</th><th>Department</th>
                {canManage && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {doctors.map(d => (
                <tr key={d.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={d.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=0f766e&color=fff&size=36`}
                        alt={d.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 500 }}>{d.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{d.specialization}</td>
                  <td>{departments.find(dep => dep.id === (d.department_id || d.departmentId))?.name || d.department_id || d.departmentId}</td>
                  {canManage && (
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(d)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id)} disabled={deleting === d.id}>
                          {deleting === d.id ? '…' : '🗑️'}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {canManage && modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h3>{modal === 'add' ? 'Add Doctor' : 'Edit Doctor'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body">
                {modal === 'add' && (
                  <div className="form-group">
                    <label>ID (slug, e.g. dr-jones)</label>
                    <input className={`form-control ${errors.id ? 'error' : ''}`} {...register('id', { required: true })} />
                    {errors.id && <span className="error-msg">Required</span>}
                  </div>
                )}
                <div className="form-group">
                  <label>Full Name</label>
                  <input className={`form-control ${errors.name ? 'error' : ''}`} {...register('name', { required: true })} />
                  {errors.name && <span className="error-msg">Required</span>}
                </div>
                <div className="form-group">
                  <label>Specialization</label>
                  <input className={`form-control ${errors.specialization ? 'error' : ''}`} {...register('specialization', { required: true })} />
                  {errors.specialization && <span className="error-msg">Required</span>}
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select className={`form-control ${errors.department_id ? 'error' : ''}`} {...register('department_id', { required: true })}>
                    <option value="">Select department</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  {errors.department_id && <span className="error-msg">Required</span>}
                </div>
                <div className="form-group">
                  <label>Photo URL (optional)</label>
                  <input className="form-control" {...register('photo')} placeholder="https://..." />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Bio (optional)</label>
                  <textarea className="form-control" rows={3} {...register('bio')} />
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
