// Preserve normal local build behaviour. Render's existing npm run build now
// refuses an unchecked or changed release before producing deployable assets.
if (process.env.RENDER === 'true') await import('./release-gate.mjs');
