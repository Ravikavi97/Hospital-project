import jwt from 'jsonwebtoken';
import { query } from '../db.js';

const ROLE_LEVEL = { admin: 3, manager: 2, staff: 1 };
const JWT_SECRET = () => process.env.JWT_SECRET || 'hospital_jwt_secret';

export const requireAdmin = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let payload;
  try {
    payload = jwt.verify(auth.slice(7), JWT_SECRET(), {
      algorithms: ['HS256'],
      clockTolerance: 0,
    });
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Session expired' : 'Invalid token';
    return res.status(401).json({ error: msg });
  }

  // Re-check is_active from DB on every request — catches real-time account disabling
  try {
    const [rows] = await query(
      'SELECT id, role, is_active FROM admin_users WHERE id = ?',
      [payload.id]
    );
    if (!rows.length || !rows[0].is_active) {
      return res.status(401).json({ error: 'Account disabled or not found' });
    }
    // Attach fresh DB role (not stale JWT role) to prevent privilege escalation
    req.admin = { ...payload, role: rows[0].role };
    next();
  } catch (err) {
    next(err);
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.admin?.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

export const requireMinRole = (minRole) => (req, res, next) => {
  const userLevel = ROLE_LEVEL[req.admin?.role] || 0;
  const minLevel = ROLE_LEVEL[minRole] || 99;
  if (userLevel < minLevel) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};
