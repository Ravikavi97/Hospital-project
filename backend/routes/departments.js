import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/departments
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await query(
      'SELECT id, name, description, icon, weekday_hours, weekend_hours FROM departments ORDER BY name'
    );
    const departments = rows.map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description,
      icon: d.icon,
      operatingHours: { weekdays: d.weekday_hours, weekends: d.weekend_hours },
    }));
    res.json(departments);
  } catch (err) {
    next(err);
  }
});

// GET /api/departments/:id
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await query(
      'SELECT id, name, description, icon, weekday_hours, weekend_hours FROM departments WHERE id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Department not found' });
    const d = rows[0];
    res.json({
      id: d.id,
      name: d.name,
      description: d.description,
      icon: d.icon,
      operatingHours: { weekdays: d.weekday_hours, weekends: d.weekend_hours },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
