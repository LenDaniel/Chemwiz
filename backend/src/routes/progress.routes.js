const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { validateState, getState, saveState } = require('../services/learningState.service');
const router = express.Router();
router.use(protect);
router.use((req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
router.get(['/', '/me'], async (req, res, next) => {
  try { res.json({ success: true, ...(await getState(req.user._id)) }); }
  catch (error) { next(error); }
});
router.post('/validate', (req, res, next) => {
  try { res.json({ success: true, state: validateState(req.body?.state) }); }
  catch (error) { next(error); }
});
router.put('/me', async (req, res, next) => {
  try {
    const revision = req.body?.revision;
    if (!Number.isInteger(revision) || revision < 0) return res.status(400).json({ success: false, message: 'A valid saved revision is required.' });
    const state = validateState(req.body.state);
    const saved = await saveState(req.user._id, revision, state);
    if (!saved) return res.status(409).json({ success: false, code: 'PROGRESS_CONFLICT', message: 'Learning data changed in another session.', ...(await getState(req.user._id)) });
    res.json({ success: true, ...saved });
  } catch (error) { next(error); }
});
module.exports = router;
