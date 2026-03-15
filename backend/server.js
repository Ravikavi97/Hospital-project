import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import departmentsRouter from './routes/departments.js';
import doctorsRouter from './routes/doctors.js';
import slotsRouter from './routes/slots.js';
import appointmentsRouter from './routes/appointments.js';
import adminAuthRouter from './routes/admin.js';
import adminDataRouter from './routes/adminData.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'hospital_jwt_secret_change_in_prod') {
  if (process.env.NODE_ENV === 'production') {
    console.error('FATAL: JWT_SECRET must be set in production');
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Trust reverse proxy (Nginx) for accurate IP in rate limiting
app.set('trust proxy', 1);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  'http://localhost:5000',
  ...(IS_PROD ? [] : ['http://localhost:5173', 'http://localhost:5174']),
].filter(Boolean);

// ── Security headers ──────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      scriptSrc: ["'none'"],
      styleSrc: ["'none'"],
      imgSrc: ["'none'"],
      connectSrc: allowedOrigins,
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body size limit — prevent large payload attacks
app.use(express.json({ limit: '50kb' }));

// ── Rate limiting ─────────────────────────────────────────────
// Strict limit on login — 10 attempts per 15 min per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // only count failures
});

// General API limit — 150 req per 15 min
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Routes ────────────────────────────────────────────────────
app.use('/api/admin/login', loginLimiter);
app.use('/api', apiLimiter);

app.use('/api/departments', departmentsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/slots', slotsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/admin', adminAuthRouter);
app.use('/api/admin', adminDataRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => console.log(`Hospital API running on port ${PORT} [${IS_PROD ? 'production' : 'development'}]`));
