# ChemWiz integration preflight

Status: PASS

Version: 1.3.0

Source fingerprint: 9394b7f6f4b6cffdf81b043e5257927f667ea6a8b6b989d90f6fd5b5f56f01bc

| Frontend function | Method | API path | Backend file | Declared middleware |
| --- | --- | --- | --- | --- |
| loginAdmin | POST | /api/auth/login | backend/src/routes/auth.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline |
| checkAdmin | GET | /api/admin/test | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, inline |
| getAdminStats | GET | /api/admin/stats | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, inline |
| getAdminUsers | GET | /api/admin/users | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, inline |
| updateUserSubscription | PATCH | /api/admin/users/:param/subscription | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, inline |
| updateUserStatus | PATCH | /api/admin/users/:param/status | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, inline |
| getAdminLogs | GET | /api/admin/logs | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, inline |
| updateUserRole | PATCH | /api/admin/users/:param/role | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, inline |
| registerUser | POST | /api/auth/register | backend/src/routes/auth.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline |
| loginUser | POST | /api/auth/login | backend/src/routes/auth.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline |
| getCurrentUser | GET | /api/auth/me | backend/src/routes/auth.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, inline |
| getLearningState | GET | /api/progress/me | backend/src/routes/progress.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, inline, inline |
| validateLearningImport | POST | /api/progress/validate | backend/src/routes/progress.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, inline, inline |
| putLearningState | PUT | /api/progress/me | backend/src/routes/progress.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, inline, inline |
| askTutor | POST | /api/tutor/message | backend/src/routes/tutor.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, requirePremium, tutorRateLimit, inline |
| transcribeTutorNote | POST | /api/tutor/transcribe | backend/src/routes/tutor.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, requirePremium, inline, voiceRateLimit, voiceDailyLimit, raw, inline |
| createLiveVoiceSession | POST | /api/tutor/live/session | backend/src/routes/liveVoice.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, requirePremium, inline, minuteLimit, dailyLimit, text, inline |

All required preflight stages passed.

Defined security checks and dependency advisories are covered; live Atlas/provider/audio acceptance is separate.
