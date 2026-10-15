function text(value) {
  return String(value || "").trim();
}

function normalizeOrigin(value) {
  return text(value).replace(/\/+$/, "");
}

// Configuration can contain a workspace URL. CORS compares only its origin,
// never the /admin/ or /student/ path, query string or fragment.
function configuredOrigin(value) {
  try {
    const url = new URL(text(value));
    if (!['http:', 'https:', 'capacitor:'].includes(url.protocol) ||
        !url.host || url.username || url.password) return '';
    return `${url.protocol}//${url.host}`;
  } catch {
    return '';
  }
}

function getDataMode() {
  const runtime = text(process.env.CHEMWIZ_RUNTIME).toLowerCase();
  const fallback = runtime === "cloudflare-worker" ? "mongodb" : "local";
  const mode = text(process.env.DATA_MODE || fallback).toLowerCase();

  if (!['local', 'mongodb'].includes(mode)) {
    throw new Error('Invalid DATA_MODE. Use exactly "local" or "mongodb".');
  }

  return mode;
}

function getAliasedValue(names, label) {
  const configured = names
    .map((name) => ({ name, value: text(process.env[name]) }))
    .filter((entry) => entry.value);

  const uniqueValues = [...new Set(configured.map((entry) => entry.value))];

  if (uniqueValues.length > 1) {
    throw new Error(
      `Conflicting ${label} environment variables are set (${configured.map((entry) => entry.name).join(', ')}). ` +
      `Keep only ${names[0]} to avoid ambiguity.`
    );
  }

  return configured[0]?.value || '';
}

function getMongoUri() {
  return getAliasedValue(['MONGODB_URI', 'MONGO_URI', 'MONGO_URL'], 'MongoDB URI');
}

function getOpenAIKey() {
  return getAliasedValue(['OPENAI_API_KEY', 'AI_API_KEY'], 'OpenAI API key');
}

function getAllowedOrigins() {
  const defaults = [
    `http://localhost:${process.env.PORT || 5000}`,
    `http://127.0.0.1:${process.env.PORT || 5000}`,
    'capacitor://localhost',
    'http://localhost',
  ];

  const configured = [
    process.env.APP_URL,
    // Render terminates HTTPS before forwarding to Node. Its public URL is
    // trusted configuration; forwarded request headers are not an allowlist.
    process.env.RENDER === 'true' ? process.env.RENDER_EXTERNAL_URL : '',
    process.env.FRONTEND_URLS,
    process.env.FRONTEND_URL,
    process.env.STUDENT_URL,
    process.env.ADMIN_URL,
  ]
    .flatMap((value) => text(value).split(','))
    .map(configuredOrigin)
    .filter(Boolean);

  return [...new Set([...defaults, ...configured])];
}

function validateRuntimeConfig() {
  const missing = [];
  const mode = getDataMode();

  if (!text(process.env.JWT_SECRET)) {
    missing.push('JWT_SECRET');
  }

  if (process.env.NODE_ENV === 'production' &&
      (text(process.env.JWT_SECRET).length < 32 || /replace|test-only/i.test(process.env.JWT_SECRET))) {
    throw new Error('Production requires a unique JWT_SECRET of at least 32 characters.');
  }

  if (mode === 'mongodb' && !getMongoUri()) {
    missing.push('MONGODB_URI');
  }

  if (missing.length) {
    const error = new Error(`ChemWiz backend configuration missing: ${missing.join(', ')}`);
    error.statusCode = 503;
    error.code = 'RUNTIME_CONFIG_MISSING';
    throw error;
  }

  return {
    dataMode: mode,
    mongoConfigured: mode === 'local' || Boolean(getMongoUri()),
    jwtConfigured: Boolean(text(process.env.JWT_SECRET)),
    openAIConfigured: Boolean(getOpenAIKey()),
  };
}

module.exports = {
  text,
  normalizeOrigin,
  getDataMode,
  getMongoUri,
  getOpenAIKey,
  getAllowedOrigins,
  validateRuntimeConfig,
};
