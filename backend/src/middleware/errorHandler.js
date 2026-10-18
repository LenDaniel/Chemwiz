const errorHandler = (err, req, res, next) => {
  let statusCode =
    err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  const production = process.env.NODE_ENV === 'production';
  const databaseError = /^Mongo/.test(err.name || '') || ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEOUT'].includes(err.code);
  const publicPrivacyError=/^(PRIVACY_|LEGAL_|AGE_|GUARDIAN_|SCHOOL_|GOVERNANCE_)/.test(err.code || '');
  if (production && databaseError) statusCode = 503;
  if (production) console.error('ChemWiz API error:', { name: err.name, code: err.code || 'API_ERROR', status: statusCode });
  else console.error('Error:', err);

  res.status(statusCode).json({
    success: false,
    ...(production && databaseError ? { code: 'DATABASE_UNAVAILABLE' } :
      publicPrivacyError || ['CORS_ORIGIN_BLOCKED', 'RUNTIME_CONFIG_MISSING'].includes(err.code) ? { code: err.code } : {}),
    message: production && statusCode >= 500 && err.code !== 'RUNTIME_CONFIG_MISSING' && !publicPrivacyError
      ? (databaseError ? 'The production database could not be reached. Check Atlas access, credentials and deployment logs.' : 'ChemWiz could not complete this request. Check deployment logs.')
      : err.message || 'Server error',
  });
};

module.exports = errorHandler;
