# ChemWiz K-AI4 — live voice pilot

Apply the patch over the **K-AI3** voice-note build, or extract the full three-project build into a fresh directory. Keep your Backend `.env` and local user data. Add `AI_LIVE_VOICE_ENABLED=true` to Backend `.env`; optionally set `AI_REALTIME_MODEL=gpt-realtime-2.1-mini` and `AI_DAILY_LIVE_SESSIONS_LIMIT=3`. If `DATA_MODE=local`, retain `AI_LIVE_IN_LOCAL_MODE=true`. Your OpenAI API project must have model access and billing. Restart Backend, then start Student and Admin normally.

Sign in as a Premium learner, open a chemistry topic/feature, open Wiz, and choose **Live voice**. Tap **Start live voice**, permit microphone access, and speak naturally. Use Mute and End; if browser autoplay is blocked, tap **Enable audio**. The browser needs HTTPS or localhost. For Android/Capacitor later, confirm WebView microphone permission and audio routing. Voice calls do not use the daily text-question quota.

Changed: Backend `src/services/liveVoice.service.js`, `src/routes/liveVoice.routes.js`, `src/routes/tutor.routes.js`, `src/config/cors.js`, `.env.example`, `README.md`, `package.json`, `tests/liveVoice.test.js`; Student `src/config/api.js`, `src/screens/LiveVoice.jsx`, `src/screens/TutorChat.jsx`; roadmap v3.8.

Verification: Backend `npm test` passed 3 suites; Student `npm run build` passed with 72 modules and the existing K4 large-bundle warning; JavaScript syntax checks passed. The provider was mocked for tests, so a live call, answer quality, browser audio and costs have **not** been verified here.

Pilot limit: call creation is gated by Premium and capped per backend process, and the app ends the call after five minutes. These are not a server-enforced hard cost cap. A production rollout needs server-side call supervision/termination, persistent shared quotas, budget monitoring, learner safety review and a live device pilot. The setting defaults to off so the existing voice-note flow remains available.
