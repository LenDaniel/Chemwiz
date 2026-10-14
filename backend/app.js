// The unified root server loads configuration and owns the only listener.

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./src/config/db');
const corsMiddleware = require('./src/config/cors');
const {
  getDataMode,
  getMongoUri,
  getOpenAIKey,
  validateRuntimeConfig,
} = require('./src/config/runtime');
const errorHandler = require('./src/middleware/errorHandler');

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const subscriptionRoutes = require('./src/routes/subscription.routes');
const paymentRoutes = require('./src/routes/payment.routes');
const tutorRoutes = require('./src/routes/tutor.routes');
const progressRoutes = require('./src/routes/progress.routes');
const quizRoutes = require('./src/routes/quiz.routes');
const adminRoutes = require('./src/routes/admin.routes');

const app = express();
const { version } = require('../package.json');
app.disable('x-powered-by');

async function ensureDataReady(req, res, next) {
  try {
    validateRuntimeConfig();
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
}

app.use(corsMiddleware);
app.use(helmet({ contentSecurityPolicy: false, strictTransportSecurity: false }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// This route remains useful for normal Node/local execution. On Cloudflare,
// worker.js intercepts /api/health first so it can diagnose Worker startup even
// if an application dependency cannot initialize.
app.get('/api/health', (req, res) => {
  const dataMode = getDataMode();
  res.status(200).json({
    success: true,
    message: 'ChemWiz Express backend is running',
    stage: 'express',
    service: 'chemwiz-unified',
    version,
    dataMode,
    configuration: {
      jwtConfigured: Boolean(String(process.env.JWT_SECRET || '').trim()),
      databaseConfigured: dataMode === 'local' || Boolean(getMongoUri()),
      openAIConfigured: Boolean(getOpenAIKey()),
    },
    timestamp: new Date().toISOString(),
  });
});

// Ready is intentionally stricter than health: it imports the application,
// validates required config and proves the selected data layer can connect.
app.get('/api/ready', async (req, res, next) => {
  try {
    const config = validateRuntimeConfig();
    await connectDB();

    res.status(200).json({
      success: true,
      message: 'ChemWiz backend is ready',
      stage: 'express+database',
      service: 'chemwiz-unified',
      version,
      dataMode: config.dataMode,
      configuration: {
        jwtConfigured: config.jwtConfigured,
        databaseConfigured: config.mongoConfigured,
        openAIConfigured: config.openAIConfigured,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// All functional API routes require the selected data layer to be ready.
app.use('/api', ensureDataReady);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorHandler);

// Importing the API application never opens a separate listener.
module.exports = app;

