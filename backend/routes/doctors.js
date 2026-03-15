import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/doctors  (optional ?departmentId=cardiology)
router.get('/', async (req, res, next) => {
  try {
    const { departmentId } = req.query;
    let sql = 'SELECT id, name, specialization, department_id, photo, bio FROM doctors';
    const params = [];
    if (departmentId) {
      sql += ' WHERE department_id = ?';
      params.push(departmentId);
    }
    sql += ' ORDER BY name';
    const [rows] = await query(sql, params);
    res.json(rows.map((d) => ({ ...d, departmentId: d.department_id })));
  } catch (err) {
    next(err);
  }
});

// GET /api/doctors/:id
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await query(
      'SELECT id, name, specialization, department_id, photo, bio FROM doctors WHERE id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Doctor not found' });
    const d = rows[0];
    res.json({ ...d, departmentId: d.department_id });
  } catch (err) {
    next(err);
  }
});

export default router;
