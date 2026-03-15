import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../db.js';

const router = Router();

const bookingValidation = [
  body('slotId').notEmpty().withMessage('slotId is required'),
  body('doctorId').notEmpty().withMessage('doctorId is required'),
  body('departmentId').notEmpty().withMessage('departmentId is required'),
  body('patientName').trim().notEmpty().withMessage('Patient name is required'),
  body('patientEmail').trim().isEmail().withMessage('Valid email is required'),
  body('patientPhone')
    .trim()
    .matches(/^[\d\s\-()+]+$/)
    .withMessage('Valid phone number is required'),
];

// POST /api/appointments  — book an appointment
router.post('/', bookingValidation, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { slotId, doctorId, departmentId, patientName, patientEmail, patientPhone } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Lock the slot row to prevent double-booking
    const [slots] = await conn.execute(
      'SELECT id FROM slots WHERE id = ? FOR UPDATE',
      [slotId]
    );
    if (!slots.length) {
      await conn.rollback();
      return res.status(404).json({ error: 'Slot not found' });
    }

    // Check if already booked
    const [existing] = await conn.execute(
      "SELECT id FROM appointments WHERE slot_id = ? AND status != 'cancelled'",
      [slotId]
    );
    if (existing.length) {
      await conn.rollback();
      return res.status(409).json({ error: 'This slot is already booked. Please choose another.' });
    }

    // Upsert patient
    await conn.execute(
      `INSERT INTO patients (email, name, phone)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), phone = VALUES(phone)`,
      [patientEmail, patientName, patientPhone]
    );
    const [patientRows] = await conn.execute(
      'SELECT id FROM patients WHERE email = ?',
      [patientEmail]
    );
    const patientId = patientRows[0].id;

    // Create appointment
    const [result] = await conn.execute(
      `INSERT INTO appointments (slot_id, doctor_id, department_id, patient_id, status)
       VALUES (?, ?, ?, ?, 'confirmed')`,
      [slotId, doctorId, departmentId, patientId]
    );

    await conn.commit();

    // Return full appointment details
    const [appt] = await conn.execute(
      `SELECT a.id, a.status, a.created_at,
              s.slot_date, s.slot_time,
              d.name AS doctor_name, d.specialization,
              dep.name AS department_name,
              p.name AS patient_name, p.email AS patient_email, p.phone AS patient_phone
       FROM appointments a
       JOIN slots s ON s.id = a.slot_id
       JOIN doctors d ON d.id = a.doctor_id
       JOIN departments dep ON dep.id = a.department_id
       JOIN patients p ON p.id = a.patient_id
       WHERE a.id = ?`,
      [result.insertId]
    );

    res.status(201).json(appt[0]);
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
});

// GET /api/appointments/:id
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.id, a.status, a.created_at,
              s.slot_date, s.slot_time,
              d.name AS doctor_name, d.specialization,
              dep.name AS department_name,
              p.name AS patient_name, p.email AS patient_email, p.phone AS patient_phone
       FROM appointments a
       JOIN slots s ON s.id = a.slot_id
       JOIN doctors d ON d.id = a.doctor_id
       JOIN departments dep ON dep.id = a.department_id
       JOIN patients p ON p.id = a.patient_id
       WHERE a.id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Appointment not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/appointments/:id/cancel
router.patch('/:id/cancel', async (req, res, next) => {
  try {
    const [result] = await pool.execute(
      "UPDATE appointments SET status = 'cancelled' WHERE id = ? AND status = 'confirmed'",
      [req.params.id]
    );
    if (!result.affectedRows) {
      return res.status(404).json({ error: 'Appointment not found or already cancelled' });
    }
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
