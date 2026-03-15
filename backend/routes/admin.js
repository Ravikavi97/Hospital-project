import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { requireAdmin, requireRole } from '../middleware/auth.js';

const router = Router();
const VALID_ROLES = ['admin', 'manager', 'staff'];
const JWT_SECRET = () => process.env.JWT_SECRET || 'hospital_jwt_secret';

// POST /api/admin/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Input validation with length limits
    if (!username || !password ||
        typeof username !== 'string' || typeof password !== 'string' ||
        username.length > 50 || password.length > 128) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const [rows] = await query('SELECT * FROM admin_users WHERE username = ?', [username.trim()]);

    // Always run bcrypt even if user not found — prevents timing-based user enumeration
    const DUMMY_HASH = '$2b$12$invalidhashfortimingnormalization000000000000000000000';
    const hash = rows.length ? rows[0].password : DUMMY_HASH;
    const valid = await bcrypt.compare(password, hash);

    if (!rows.length || !valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!rows[0].is_active) {
      return res.status(403).json({ error: 'Account disabled. Contact administrator.' });
    }

    const token = jwt.sign(
      { id: rows[0].id, username: rows[0].username, full_name: rows[0].full_name, role: rows[0].role },
      JWT_SECRET(),
      { expiresIn: '8h', algorithm: 'HS256' }
    );

    res.json({ token, username: rows[0].username, full_name: rows[0].full_name, role: rows[0].role });
  } catch (err) { next(err); }
});

// ── User management (admin only) ──────────────────────────────

router.get('/users', requireAdmin, requireRole('admin'), async (req, res, next) => {
  try {
    const [rows] = await query(
      'SELECT id, username, full_name, role, is_active, created_at FROM admin_users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/users', requireAdmin, requireRole('admin'), async (req, res, next) => {
  try {
    const { username, full_name, password, role } = req.body;

    if (!username || !password || !role ||
        typeof username !== 'string' || typeof password !== 'string' ||
        username.length > 50 || password.length > 128 || password.length < 8) {
      return res.status(400).json({ error: 'username (max 50), password (8-128 chars) and role are required' });
    }
    if (!VALID_ROLES.includes(role)) return res.status(400).json({ error: 'Invalid role' });
    if (!/^[a-z0-9_]+$/.test(username)) return res.status(400).json({ error: 'Username: lowercase letters, numbers, underscores only' });

    const hash = await bcrypt.hash(password, 12);
    await query(
      'INSERT INTO admin_users (username, full_name, password, role) VALUES (?,?,?,?)',
      [username.trim(), (full_name || '').slice(0, 100), hash, role]
    );
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Username already exists' });
    next(err);
  }
});

router.put('/users/:id', requireAdmin, requireRole('admin'), async (req, res, next) => {
  try {
    const { full_name, role, is_active, password } = req.body;
    const targetId = parseInt(req.params.id, 10);
    if (isNaN(targetId)) return res.status(400).json({ error: 'Invalid user id' });
    if (role && !VALID_ROLES.includes(role)) return res.status(400).json({ error: 'Invalid role' });
    if (targetId === req.admin.id && is_active === false) {
      return res.status(400).json({ error: 'Cannot disable your own account' });
    }
    if (password && (typeof password !== 'string' || password.length < 8 || password.length > 128)) {
      return res.status(400).json({ error: 'Password must be 8-128 characters' });
    }

    let sql = 'UPDATE admin_users SET full_name=?, role=?, is_active=?';
    const params = [(full_name || '').slice(0, 100), role, is_active ? 1 : 0];

    if (password) {
      sql += ', password=?';
      params.push(await bcrypt.hash(password, 12));
    }
    sql += ' WHERE id=?';
    params.push(targetId);

    const [result] = await query(sql, params);
    if (!result.affectedRows) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated' });
  } catch (err) { next(err); }
});

router.delete('/users/:id', requireAdmin, requireRole('admin'), async (req, res, next) => {
  try {
    const targetId = parseInt(req.params.id, 10);
    if (isNaN(targetId)) return res.status(400).json({ error: 'Invalid user id' });
    if (targetId === req.admin.id) return res.status(400).json({ error: 'Cannot delete your own account' });
    const [result] = await query('DELETE FROM admin_users WHERE id=?', [targetId]);
    if (!result.affectedRows) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) { next(err); }
});

export default router;
