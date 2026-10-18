const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { requireAIConsent } = require('../middleware/privacy.middleware');
const { requirePremium } = require('../middleware/access.middleware');
const { rateLimit } = require('express-rate-limit');
const { askAI, moderate, transcribeAudio, TutorProviderError } = require('../services/ai.service');
const { reserve, refund } = require('../services/tutorQuota.service');

const router = express.Router();
router.use('/live', require('./liveVoice.routes'));

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ChemWiz tutor service is available.',
    mode: String(process.env.DATA_MODE || 'mongodb').toLowerCase() === 'local' && process.env.AI_LIVE_IN_LOCAL_MODE !== 'true' ? 'local-test' : 'backend',
  });
});

const tutorRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 6,
  keyGenerator: (req) => String(req.user._id),
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, code: 'TUTOR_RATE_LIMIT', message: 'Please wait a minute before sending more questions to Wiz.' },
});

const voiceRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 3,
  keyGenerator: (req) => String(req.user._id),
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, code: 'VOICE_RATE_LIMIT', message: 'Please wait a minute before recording another voice note.' },
});
const voiceDailyLimit = rateLimit({
  windowMs: 24 * 60 * 60_000,
  limit: Math.min(100, Math.max(1, Number(process.env.AI_DAILY_VOICE_LIMIT) || 20)),
  keyGenerator: (req) => String(req.user._id),
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, code: 'VOICE_DAILY_LIMIT', message: 'You have reached today’s voice-note limit. Please type your question or return tomorrow.' },
});

const audioTypes = new Set(['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg']);
router.post('/transcribe', protect, requirePremium, requireAIConsent, (req, res, next) => {
  const type = String(req.headers['content-type'] || '').split(';')[0].toLowerCase();
  if (!audioTypes.has(type)) return res.status(415).json({ success: false, code: 'VOICE_FORMAT', message: 'This voice note format is unsupported. Try recording in the browser.' });
  return next();
}, voiceRateLimit, voiceDailyLimit, express.raw({ type: () => true, limit: '5mb' }), async (req, res) => {
  if (String(process.env.DATA_MODE || '').toLowerCase() === 'local' && process.env.AI_LIVE_IN_LOCAL_MODE !== 'true') {
    return res.status(503).json({ success: false, code: 'VOICE_OFFLINE', message: 'Voice transcription needs the live Wiz API. Enable live local mode or try typing.' });
  }
  if (!Buffer.isBuffer(req.body) || req.body.length < 100) {
    return res.status(400).json({ success: false, code: 'VOICE_EMPTY', message: 'Record a voice note before sending it.' });
  }
  try {
    const text = await transcribeAudio(req.body, String(req.headers['content-type']).split(';')[0].toLowerCase());
    return res.json({ success: true, text });
  } catch (error) {
    if (!(error instanceof TutorProviderError)) console.error('Wiz transcription error:', error);
    return res.status(error.status || 503).json({ success: false, code: error.code || 'VOICE_UNAVAILABLE', message: error instanceof TutorProviderError ? error.message : 'Wiz could not process the voice note. Please try again.' });
  }
});

router.post('/message', protect, requirePremium, requireAIConsent, tutorRateLimit, async (req, res) => {
  const body = req.body || {};
  const context = body.context && typeof body.context === 'object' ? body.context : {};
  const topicId = String(body.topicId || '').trim().slice(0, 80);
  const topicTitle = String(body.topicTitle || 'Chemistry').trim().slice(0, 160) || 'Chemistry';
  const featureKey = String(context.featureKey || body.featureKey || '').trim().slice(0, 80);
  const featureLabel = String(context.featureLabel || body.featureLabel || '').trim().slice(0, 120);
  const featureTitle = String(context.featureTitle || body.featureTitle || '').trim().slice(0, 180);
  const contextSummary = String(context.contextSummary || body.contextSummary || '').trim().slice(0, 400);
  const message = String(body.message || '').trim();
  const prompt = String(message || '').trim();

  if (!topicId && !featureKey) {
    return res.status(400).json({
      success: false,
      code: 'TUTOR_CONTEXT_REQUIRED',
      message: 'Open a specific chemistry topic or feature before asking Wiz a question.',
    });
  }

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: 'A tutor message is required.',
    });
  }

  if (prompt.length > 2000) {
    return res.status(413).json({
      success: false,
      code: 'TUTOR_MESSAGE_TOO_LONG',
      message: 'Keep the tutor question under 2,000 characters.',
    });
  }

  const history = Array.isArray(body.history)
    ? body.history.slice(-8).filter((item) =>
      item && (item.role === 'user' || item.role === 'assistant') &&
      typeof item.content === 'string' && item.content.length <= 2000
    ).map((item) => ({ role: item.role, content: item.content }))
    : [];

  const tutorContext = {
    topicId: topicId || null,
    topicTitle,
    featureKey: featureKey || null,
    featureLabel: featureLabel || null,
    featureTitle: featureTitle || null,
    contextSummary: contextSummary || null,
  };

  const isLocal = String(process.env.DATA_MODE || '').toLowerCase() === 'local';

  if (isLocal && process.env.AI_LIVE_IN_LOCAL_MODE !== 'true') {
    const scope = [topicTitle, featureLabel, featureTitle].filter(Boolean).join(' · ');
    return res.json({
      success: true,
      mode: 'local-test',
      reply:
        `Wiz local test mode is working for ${scope || 'Chemistry'}. ` +
        `Your question was received successfully: “${prompt.slice(0, 180)}”. ` +
        'Live AI answers are intentionally disabled during offline/local testing.',
      context: tutorContext,
    });
  }

  if (!process.env.OPENAI_API_KEY && !process.env.AI_API_KEY) {
    return res.status(503).json({
      success: false,
      code: 'AI_NOT_CONFIGURED',
      message: 'The AI tutor is not configured on the backend yet.',
    });
  }

  let reservation;
  try {
    if (await moderate(prompt)) {
      return res.status(400).json({ success: false, code: 'TUTOR_SAFETY', message: 'Wiz cannot help with that request. Please ask a safe chemistry question.' });
    }

    reservation = await reserve(req.user._id);
    if (!reservation) return res.status(401).json({ success: false, message: 'User not found.' });
    if (reservation.exceeded) {
      return res.status(429).json({
        success: false,
        code: 'TUTOR_DAILY_LIMIT',
        message: 'You have reached your Wiz question limit for today. Please return after the daily reset.',
        quota: reservation,
      });
    }

    const { reply, usage } = await askAI({ message: prompt, context: tutorContext, history });
    if (await moderate(reply)) {
      return res.status(400).json({ success: false, code: 'TUTOR_SAFETY', message: 'Wiz could not provide a safe response. Please rephrase your chemistry question.' });
    }

    return res.json({
      success: true,
      mode: 'openai',
      reply,
      context: tutorContext,
      quota: { limit: reservation.limit, remaining: reservation.remaining, resetAt: reservation.resetAt },
      usage: usage ? { inputTokens: usage.input_tokens || 0, outputTokens: usage.output_tokens || 0 } : null,
    });
  } catch (error) {
    if (reservation && !reservation.exceeded) {
      try { await refund(req.user._id, reservation.day); }
      catch (refundError) { console.error('Wiz quota refund failed:', refundError); }
    }
    if (!(error instanceof TutorProviderError)) console.error('Wiz tutor error:', error);
    return res.status(error.status || 503).json({
      success: false,
      code: error.code || 'AI_UNAVAILABLE',
      message: error instanceof TutorProviderError ? error.message : 'Wiz is temporarily unavailable. Please try again shortly.',
    });
  }
});

module.exports = router;
