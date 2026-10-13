const cors = require('cors');
const { getAllowedOrigins, normalizeOrigin } = require('./runtime');

const corsMiddleware = cors((req, callback) => callback(null, {
  origin(origin, callback) {
    const normalizedOrigin = normalizeOrigin(origin);
    const allowedOrigins = getAllowedOrigins();

    const sameOrigin = `${req.protocol}://${req.get('host')}`;
    if (!origin || normalizedOrigin === sameOrigin || allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    const error = new Error('This origin is not permitted to access ChemWiz.');
    error.statusCode = 403;
    error.code = 'CORS_ORIGIN_BLOCKED';
    return callback(error);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Wiz-Context'],
  credentials: true,
  maxAge: 86400,
}));

module.exports = corsMiddleware;
module.exports.getAllowedOrigins = getAllowedOrigins;
