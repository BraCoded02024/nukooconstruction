/**
 * Development: localhost / 127.0.0.1 on any port.
 * Production: set ALLOWED_ORIGINS to a comma-separated list (e.g. https://app.example.com).
 */
function buildCorsOptions() {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (!isProd) {
        const ok = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
        return callback(null, ok);
      }
      const allowed = (process.env.ALLOWED_ORIGINS || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (allowed.length === 0) {
        console.warn(
          '[CORS] NODE_ENV=production but ALLOWED_ORIGINS is empty — browser requests will be rejected.',
        );
        return callback(null, false);
      }
      return callback(null, allowed.includes(origin));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
}

module.exports = { buildCorsOptions };
