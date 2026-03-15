const IS_PROD = process.env.NODE_ENV === 'production';

export const errorHandler = (err, req, res, next) => {
  // Always log full error server-side
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} — ${err.stack || err.message}`);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'This appointment slot is already booked.' });
  }

  const status = err.status || 500;
  // Never expose internal error details in production
  const message = IS_PROD && status === 500 ? 'Internal server error' : (err.message || 'Internal server error');
  res.status(status).json({ error: message });
};

export const notFound = (req, res) => {
  res.status(404).json({ error: 'Not found' });
};
