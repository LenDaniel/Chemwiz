const express = require('express');
const { rateLimit } = require('express-rate-limit');
const { protect } = require('../middleware/auth.middleware');
const { requireAIConsent } = require('../middleware/privacy.middleware');
const { requirePremium } = require('../middleware/access.middleware');
const { createLiveCall, parseContext, LiveVoiceError } = require('../services/liveVoice.service');

const router = express.Router();
const minuteLimit = rateLimit({
  windowMs: 60_000, limit: 2, keyGenerator: (req) => String(req.user._id),
  standardHeaders: 'draft-8', legacyHeaders: false,
  message: { success: false, code: 'LIVE_VOICE_RATE_LIMIT', message: 'Please wait before starting another live voice session.' },
});
const dailyLimit = rateLimit({
  windowMs: 24 * 60 * 60_000,
  limit: Math.min(20, Math.max(1, Number(process.env.AI_DAILY_LIVE_SESSIONS_LIMIT) || 3)),
  keyGenerator: (req) => String(req.user._id), standardHeaders: 'draft-8', legacyHeaders: false,
  message: { success: false, code: 'LIVE_VOICE_DAILY_LIMIT', message: 'Your live voice sessions are used up for today. Use voice notes or text chat.' },
});

router.post('/session', protect, requirePremium, requireAIConsent, (req, res, next) => {
  if (process.env.AI_LIVE_VOICE_ENABLED !== 'true') return res.status(503).json({ success: false, code: 'LIVE_VOICE_DISABLED', message: 'Live voice is not enabled yet.' });
  if (String(process.env.DATA_MODE || '').toLowerCase() === 'local' && process.env.AI_LIVE_IN_LOCAL_MODE !== 'true') {
    return res.status(503).json({ success: false, code: 'VOICE_OFFLINE', message: 'Enable live local mode to use voice chat.' });
  }
  if (req.headers['content-type']?.split(';')[0].toLowerCase() !== 'application/sdp') {
    return res.status(415).json({ success: false, code: 'VOICE_SDP_INVALID', message: 'The voice connection format is unsupported.' });
  }
  try { req.wizContext = parseContext(req.headers['x-wiz-context']); }
  catch (error) { return res.status(error.status || 400).json({ success: false, code: error.code, message: error.message }); }
  return next();
}, minuteLimit, dailyLimit, express.text({ type: 'application/sdp', limit: '32kb' }), async (req, res) => {
  try {
    const answer = await createLiveCall({ sdp: req.body, context: req.wizContext, userId: String(req.user._id) });
    return res.set('Cache-Control', 'no-store').type('application/sdp').send(answer);
  } catch (error) {
    if (!(error instanceof LiveVoiceError)) console.error('Wiz live voice error:', error);
    return res.status(error.status || 503).json({ success: false, code: error.code || 'VOICE_UNAVAILABLE', message: error instanceof LiveVoiceError ? error.message : 'Wiz could not start live voice. Please try again.' });
  }
});

module.exports = router;
