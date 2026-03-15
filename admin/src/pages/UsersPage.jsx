import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';
import { ROLE_COLORS, ROLE_LABELS } from '../permissions.js';

const ROLES = ['admin', 'manager', 'staff'];

export default function UsersPage() {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(null); // null | 'add' | user object
  const [deleting, setDeleting] = useState(null);
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm();
  const isEdit = modal && modal !== 'add';

  const load = () => api.users().then(setUsers);
  useEffect(() => { load(); }, []);

  const openAdd = () => { reset({ username: '', full_name: '', password: '', role: 'staff' }); setModal('add'); };
  const openEdit = (u) => { reset({ full_name: u.full_name, role: u.role, is_active: u.is_active, password: '' }); setModal(u); };
  const closeModal = () => setModal(null);

  const onSubmit = async (data) => {
    try {
      if (!isEdit) {
        await api.createUser(data);
      } else {
        const payload = { full_name: data.full_name, role: data.role, is_active: data.is_active };
        if (data.password) payload.password = data.password;
        await api.updateUser(modal.id, payload);
      }
      await load();
      closeModal();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (u) => {
    if (!confirm(`Delete user "${u.username}"? This cannot be undone.`)) return;
    setDeleting(u.id);
    try { await api.deleteUser(u.id); await load(); }
    catch (err) { alert(err.message); }
    finally { setDeleting(null); }
  };

  const handleToggleActive = async (u) => {
    try {
      await api.updateUser(u.id, { full_name: u.full_name, role: u.role, is_active: !u.is_active });
      await load();
    } catch (err) { alert(err.message); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>🔐 User Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>Manage staff accounts and permissions</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add User</button>
      </div>

      {/* Role legend */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {ROLES.map(r => (
          <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: ROLE_COLORS[r], display: 'inline-block' }} />
            <strong>{ROLE_LABELS[r]}</strong>
            <span style={{ color: 'var(--text-muted)' }}>—</span>
            <span style={{ color: 'var(--text-muted)' }}>
              {r === 'admin' ? 'Full access + user management' : r === 'manager' ? 'Manage appointments, doctors, departments' : 'View only'}
            </span>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr><th>User</th><th>Username</th><th>Role</th><th>Status</th><th>Created</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff',
                        background: ROLE_COLORS[u.role] || '#888', flexShrink: 0,
                      }}>
                        {(u.full_name || u.username).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{u.full_name || '—'}</div>
                        {u.id === auth?.user?.id && <div style={{ fontSize: 11, color: 'var(--primary)' }}>● You</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{u.username}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                      background: ROLE_COLORS[u.role] + '20', color: ROLE_COLORS[u.role],
                    }}>{ROLE_LABELS[u.role]}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => u.id !== auth?.user?.id && handleToggleActive(u)}
                      disabled={u.id === auth?.user?.id}
                      style={{
                        padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, border: 'none', cursor: u.id === auth?.user?.id ? 'default' : 'pointer',
                        background: u.is_active ? 'var(--success-light)' : 'var(--danger-light)',
                        color: u.is_active ? '#065f46' : '#991b1b',
                      }}
                      title={u.id === auth?.user?.id ? 'Cannot change own status' : u.is_active ? 'Click to disable' : 'Click to enable'}
                    >
                      {u.is_active ? '✓ Active' : '✗ Disabled'}
                    </button>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(u)}>✏️ Edit</button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(u)}
                        disabled={deleting === u.id || u.id === auth?.user?.id}
                        title={u.id === auth?.user?.id ? 'Cannot delete own account' : ''}
                      >
                        {deleting === u.id ? '…' : '🗑️'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h3>{isEdit ? `Edit User — ${modal.username}` : 'Add New User'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body">
                {!isEdit && (
                  <div className="form-group">
                    <label>Username</label>
                    <input className={`form-control ${errors.username ? 'error' : ''}`}
                      placeholder="e.g. john_doe"
                      {...register('username', { required: true, pattern: /^[a-z0-9_]+$/ })} />
                    {errors.username && <span className="error-msg">Lowercase letters, numbers, underscores only</span>}
                  </div>
                )}
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="form-control" placeholder="e.g. John Doe" {...register('full_name')} />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select className={`form-control ${errors.role ? 'error' : ''}`} {...register('role', { required: true })}>
                    {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                  </select>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    {watch('role') === 'admin' && '⚠️ Admin has full access including user management'}
                    {watch('role') === 'manager' && 'Can manage appointments, doctors, departments'}
                    {watch('role') === 'staff' && 'Can only view appointments and patients'}
                  </div>
                </div>
                {isEdit && (
                  <div className="form-group">
                    <label>Status</label>
                    <select className="form-control" {...register('is_active', { setValueAs: v => v === 'true' || v === true })}>
                      <option value="true">Active</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>
                )}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>{isEdit ? 'New Password (leave blank to keep current)' : 'Password'}</label>
                  <input type="password" className={`form-control ${errors.password ? 'error' : ''}`}
                    placeholder={isEdit ? 'Leave blank to keep current' : 'Min 6 characters'}
                    {...register('password', { required: !isEdit, minLength: isEdit ? 0 : 6 })} />
                  {errors.password && <span className="error-msg">Minimum 6 characters required</span>}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving…' : isEdit ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
