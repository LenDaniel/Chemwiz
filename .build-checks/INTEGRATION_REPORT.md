# ChemWiz integration preflight

Status: PASS

Version: 1.9.0

Source fingerprint: fd95448cf434c4d16d049210c65473973e4596901c1c1f39d960286b3d2aabe1

| Frontend function | Method | API path | Backend file | Declared middleware |
| --- | --- | --- | --- | --- |
| loginAdmin | POST | /api/auth/login | backend/src/routes/auth.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, loginLimiter, inline |
| requestPasswordReset | POST | /api/auth/forgot-password | backend/src/routes/auth.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, recoveryLimiter, inline |
| resetPassword | POST | /api/auth/reset-password | backend/src/routes/auth.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, recoveryLimiter, inline |
| upgradePassword | POST | /api/auth/upgrade-password | backend/src/routes/auth.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, recoveryLimiter, inline |
| checkAdmin | GET | /api/admin/test | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, inline |
| getAdminStats | GET | /api/admin/stats | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, inline |
| getAdminUsers | GET | /api/admin/users | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, inline |
| updateUserSubscription | PATCH | /api/admin/users/:param/subscription | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, inline |
| updateUserStatus | PATCH | /api/admin/users/:param/status | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, inline |
| getAdminLogs | GET | /api/admin/logs | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, inline |
| updateUserRole | PATCH | /api/admin/users/:param/role | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, inline |
| trashUserAccount | POST | /api/admin/users/:param/trash | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, recordWriteLimit, recordRoute |
| getRecycleBin | GET | /api/admin/recycle-bin | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, recordRoute |
| restoreRecycleEntry | POST | /api/admin/recycle-bin/:param/restore | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, recordWriteLimit, recordRoute |
| purgeRecycleEntry | DELETE | /api/admin/recycle-bin/:param | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, recordWriteLimit, recordRoute |
| getContentInventory | GET | /api/admin/content-inventory | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, recordRoute |
| getContentDrafts | GET | /api/admin/content | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, recordRoute |
| createContentDraft | POST | /api/admin/content | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, recordWriteLimit, recordRoute |
| updateContentDraft | PUT | /api/admin/content/:param | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, recordWriteLimit, recordRoute |
| trashContentDraft | DELETE | /api/admin/content/:param | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, recordWriteLimit, recordRoute |
| importContentDraft | POST | /api/admin/content/import | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, recordWriteLimit, recordRoute |
| getContentHistory | GET | /api/admin/content/:param/history | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, recordRoute |
| publishContentDraft | POST | /api/admin/content/:param/publish | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, recordWriteLimit, recordRoute |
| unpublishContentDraft | POST | /api/admin/content/:param/unpublish | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, recordWriteLimit, recordRoute |
| rollbackContentDraft | POST | /api/admin/content/:param/rollback | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, recordWriteLimit, recordRoute |
| getMediaLibrary | GET | /api/admin/media | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, recordRoute |
| updateMedia | PUT | /api/admin/media/:param | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, recordWriteLimit, recordRoute |
| trashMedia | DELETE | /api/admin/media/:param | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, recordWriteLimit, recordRoute |
| uploadMedia | POST | /api/admin/media | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, mediaUploadLimit, raw, recordRoute |
| getAdminMediaFile | GET | /api/admin/media/:param/file | backend/src/routes/admin.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, adminOnly, inline |
| registerUser | POST | /api/auth/register | backend/src/routes/auth.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, registerLimiter, inline |
| loginUser | POST | /api/auth/login | backend/src/routes/auth.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, loginLimiter, inline |
| requestPasswordReset | POST | /api/auth/forgot-password | backend/src/routes/auth.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, recoveryLimiter, inline |
| resetPassword | POST | /api/auth/reset-password | backend/src/routes/auth.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, recoveryLimiter, inline |
| upgradePassword | POST | /api/auth/upgrade-password | backend/src/routes/auth.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, recoveryLimiter, inline |
| getCurrentUser | GET | /api/auth/me | backend/src/routes/auth.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, inline |
| getPublishedMaterials | GET | /api/content | backend/src/routes/content.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline, protect, requireLearningConsent, read |
| getPublishedMaterial | GET | /api/content/:param | backend/src/routes/content.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline, protect, requireLearningConsent, read |
| getPublishedCredits | GET | /api/content/credits | backend/src/routes/content.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline, protect, requireLearningConsent, read |
| getPublishedMedia | GET | /api/content/:param/media/:param | backend/src/routes/content.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline, protect, requireLearningConsent, inline |
| getLearningState | GET | /api/progress/me | backend/src/routes/progress.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, requireLearningConsent, inline, inline |
| validateLearningImport | POST | /api/progress/validate | backend/src/routes/progress.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, requireLearningConsent, inline, inline |
| putLearningState | PUT | /api/progress/me | backend/src/routes/progress.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, requireLearningConsent, inline, inline |
| askTutor | POST | /api/tutor/message | backend/src/routes/tutor.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, requirePremium, requireAIConsent, tutorRateLimit, inline |
| transcribeTutorNote | POST | /api/tutor/transcribe | backend/src/routes/tutor.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, requirePremium, requireAIConsent, inline, voiceRateLimit, voiceDailyLimit, raw, inline |
| createLiveVoiceSession | POST | /api/tutor/live/session | backend/src/routes/liveVoice.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, requirePremium, requireAIConsent, inline, minuteLimit, dailyLimit, text, inline |
| getPublicPrivacy | GET | /api/privacy/public | backend/src/routes/privacy.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline, wrap |
| getMyPrivacy | GET | /api/privacy/me | backend/src/routes/privacy.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline, protect, wrap |
| completeOnboarding | POST | /api/privacy/onboarding | backend/src/routes/privacy.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline, protect, writeLimit, wrap |
| updatePrivacyChoices | PATCH | /api/privacy/preferences | backend/src/routes/privacy.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline, protect, writeLimit, wrap |
| submitPrivacyRequest | POST | /api/privacy/requests | backend/src/routes/privacy.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline, protect, recoveryLimiter, wrap |
| exportPrivacyData | GET | /api/privacy/export | backend/src/routes/privacy.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline, protect, wrap |
| updateSchoolSharing | PATCH | /api/privacy/schools/:param/sharing | backend/src/routes/privacy.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline, protect, wrap |
| getPrivacySettings | GET | /api/privacy/admin/settings | backend/src/routes/privacy.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline, protect, adminOnly, wrap |
| savePrivacySettings | PUT | /api/privacy/admin/settings | backend/src/routes/privacy.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline, protect, adminOnly, wrap |
| getPrivacyQueue | GET | /api/privacy/admin/queue | backend/src/routes/privacy.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline, protect, adminOnly, wrap |
| createGuardianAuthorisation | POST | /api/privacy/admin/guardians | backend/src/routes/privacy.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline, protect, adminOnly, wrap |
| revokeGuardianAuthorisation | DELETE | /api/privacy/admin/guardians/:param | backend/src/routes/privacy.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline, protect, adminOnly, wrap |
| reviewPrivacyRequest | PATCH | /api/privacy/admin/requests/:param | backend/src/routes/privacy.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, inline, protect, adminOnly, wrap |
| getSchools | GET | /api/schools | backend/src/routes/schools.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, inline, wrap |
| createSchool | POST | /api/schools | backend/src/routes/schools.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, inline, adminOnly, wrap |
| updateSchool | PUT | /api/schools/:param | backend/src/routes/schools.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, inline, adminOnly, wrap |
| updateSchoolMembership | PUT | /api/schools/:param/membership | backend/src/routes/schools.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, inline, adminOnly, wrap |
| getSchoolRoster | GET | /api/schools/:param/roster | backend/src/routes/schools.routes.js | corsMiddleware, helmet, morgan, json, urlencoded, ensureDataReady, protect, inline, wrap |

All required preflight stages passed.

Defined security checks and dependency advisories are covered; live Atlas/provider/audio acceptance is separate.
