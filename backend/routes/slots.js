import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/slots?doctorId=dr-smith&date=2025-07-20
router.get('/', async (req, res, next) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId) return res.status(400).json({ error: 'doctorId is required' });

    let sql = `
      SELECT s.id, s.doctor_id, s.slot_date, s.slot_time,
             CASE WHEN a.id IS NULL THEN 1 ELSE 0 END AS available
      FROM slots s
      LEFT JOIN appointments a ON a.slot_id = s.id AND a.status != 'cancelled'
      WHERE s.doctor_id = ?
    `;
    const params = [doctorId];

    if (date) {
      sql += ' AND s.slot_date = ?';
      params.push(date);
    } else {
      // Default: next 30 days
      sql += ' AND s.slot_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)';
    }
    sql += ' ORDER BY s.slot_date, s.slot_time';

    const [rows] = await query(sql, params);
    res.json(
      rows.map((s) => ({
        id: s.id,
        doctorId: s.doctor_id,
        date: s.slot_date,
        time: s.slot_time,
        available: s.available === 1,
      }))
    );
  } catch (err) {
    next(err);
  }
});

export default router;
