import { Router } from 'express';
import { query } from '../db.js';
import { requireAdmin, requireMinRole } from '../middleware/auth.js';

const router = Router();
router.use(requireAdmin); // all routes require valid JWT

// ── Stats: all roles ──────────────────────────────────────────
router.get('/stats', async (req, res, next) => {
  try {
    const [[{ total_appointments }]] = await query("SELECT COUNT(*) AS total_appointments FROM appointments");
    const [[{ confirmed }]] = await query("SELECT COUNT(*) AS confirmed FROM appointments WHERE status='confirmed'");
    const [[{ cancelled }]] = await query("SELECT COUNT(*) AS cancelled FROM appointments WHERE status='cancelled'");
    const [[{ total_doctors }]] = await query("SELECT COUNT(*) AS total_doctors FROM doctors");
    const [[{ total_patients }]] = await query("SELECT COUNT(*) AS total_patients FROM patients");
    const [[{ total_departments }]] = await query("SELECT COUNT(*) AS total_departments FROM departments");
    res.json({ total_appointments, confirmed, cancelled, total_doctors, total_patients, total_departments });
  } catch (err) { next(err); }
});

// ── Appointments: all roles can view, manager+ can cancel ─────
router.get('/appointments', async (req, res, next) => {
  try {
    const { status, doctorId, departmentId, date } = req.query;
    let sql = `SELECT a.id, a.status, a.created_at,
                      s.slot_date, s.slot_time,
                      d.name AS doctor_name, d.specialization,
                      dep.name AS department_name,
                      p.name AS patient_name, p.email AS patient_email, p.phone AS patient_phone
               FROM appointments a
               JOIN slots s ON s.id = a.slot_id
               JOIN doctors d ON d.id = a.doctor_id
               JOIN departments dep ON dep.id = a.department_id
               JOIN patients p ON p.id = a.patient_id
               WHERE 1=1`;
    const params = [];
    if (status) { sql += ' AND a.status = ?'; params.push(status); }
    if (doctorId) { sql += ' AND a.doctor_id = ?'; params.push(doctorId); }
    if (departmentId) { sql += ' AND a.department_id = ?'; params.push(departmentId); }
    if (date) { sql += ' AND s.slot_date = ?'; params.push(date); }
    sql += ' ORDER BY s.slot_date DESC, s.slot_time DESC';
    const [rows] = await query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
});

router.patch('/appointments/:id/cancel', requireMinRole('manager'), async (req, res, next) => {
  try {
    const [result] = await query(
      "UPDATE appointments SET status='cancelled' WHERE id=? AND status='confirmed'",
      [req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Not found or already cancelled' });
    res.json({ message: 'Cancelled successfully' });
  } catch (err) { next(err); }
});

// ── Patients: all roles can view ──────────────────────────────
router.get('/patients', async (req, res, next) => {
  try {
    const [rows] = await query(
      `SELECT p.id, p.name, p.email, p.phone, p.created_at,
              COUNT(a.id) AS appointment_count
       FROM patients p
       LEFT JOIN appointments a ON a.patient_id = p.id
       GROUP BY p.id ORDER BY p.created_at DESC`
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// ── Doctors: manager+ can mutate ──────────────────────────────
router.post('/doctors', requireMinRole('manager'), async (req, res, next) => {
  try {
    const { id, name, specialization, department_id, photo, bio } = req.body;
    await query(
      'INSERT INTO doctors (id, name, specialization, department_id, photo, bio) VALUES (?,?,?,?,?,?)',
      [id, name, specialization, department_id, photo || null, bio || null]
    );
    res.status(201).json({ message: 'Doctor created' });
  } catch (err) { next(err); }
});

router.put('/doctors/:id', requireMinRole('manager'), async (req, res, next) => {
  try {
    const { name, specialization, department_id, photo, bio } = req.body;
    const [result] = await query(
      'UPDATE doctors SET name=?, specialization=?, department_id=?, photo=?, bio=? WHERE id=?',
      [name, specialization, department_id, photo || null, bio || null, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Doctor not found' });
    res.json({ message: 'Doctor updated' });
  } catch (err) { next(err); }
});

router.delete('/doctors/:id', requireMinRole('manager'), async (req, res, next) => {
  try {
    const [result] = await query('DELETE FROM doctors WHERE id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Doctor not found' });
    res.json({ message: 'Doctor deleted' });
  } catch (err) { next(err); }
});

// ── Departments: manager+ can mutate ─────────────────────────
router.post('/departments', requireMinRole('manager'), async (req, res, next) => {
  try {
    const { id, name, description, icon, weekday_hours, weekend_hours } = req.body;
    await query(
      'INSERT INTO departments (id, name, description, icon, weekday_hours, weekend_hours) VALUES (?,?,?,?,?,?)',
      [id, name, description, icon, weekday_hours, weekend_hours]
    );
    res.status(201).json({ message: 'Department created' });
  } catch (err) { next(err); }
});

router.put('/departments/:id', requireMinRole('manager'), async (req, res, next) => {
  try {
    const { name, description, icon, weekday_hours, weekend_hours } = req.body;
    const [result] = await query(
      'UPDATE departments SET name=?, description=?, icon=?, weekday_hours=?, weekend_hours=? WHERE id=?',
      [name, description, icon, weekday_hours, weekend_hours, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Department not found' });
    res.json({ message: 'Department updated' });
  } catch (err) { next(err); }
});

router.delete('/departments/:id', requireMinRole('manager'), async (req, res, next) => {
  try {
    const [result] = await query('DELETE FROM departments WHERE id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Department not found' });
    res.json({ message: 'Department deleted' });
  } catch (err) { next(err); }
});

export default router;
