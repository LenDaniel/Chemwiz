import fs from 'node:fs';
import path from 'node:path';
import { sourceFingerprint } from './source-checks.mjs';

// File hashes explain a failure. Only verifyRelease decides whether tests and
// their aggregate source fingerprint authorize a release.
export function compareSourceFiles(current, recorded) {
  if (!recorded || typeof recorded !== 'object' || Array.isArray(recorded) ||
      !Object.keys(recorded).length || Object.values(recorded).some(value => !/^[a-f0-9]{64}$/.test(value))) return null;
  return {
    missing: Object.keys(recorded).filter(file => !Object.hasOwn(current, file)).sort(),
    extra: Object.keys(current).filter(file => !Object.hasOwn(recorded, file)).sort(),
    changed: Object.keys(current).filter(file => Object.hasOwn(recorded, file) && current[file] !== recorded[file]).sort(),
  };
}

export function releaseDiagnosticLines(root, evidence, { limit = 30 } = {}) {
  const snapshot = sourceFingerprint(root);
  const version = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;
  const lines = [
    `Application: v${version}; ${snapshot.files} source files; ${snapshot.digest}`,
    `Test report: ${evidence ? `v${evidence.version}; ${evidence.status}; ${evidence.fingerprint}` : 'missing or unreadable verification/release-evidence.json'}`,
  ];
  if (evidence && evidence.version !== version) lines.push('VERSION MISMATCH: the package and test report belong to different releases. Apply the complete update, then repeat the checks.');
  if (evidence?.fingerprint !== snapshot.digest) {
    const difference = compareSourceFiles(snapshot.fileHashes, evidence?.fileHashes);
    if (difference) {
      for (const [kind, files] of Object.entries(difference)) {
        if (!files.length) continue;
        lines.push(`${kind.toUpperCase()} FILES (${files.length}): ${files.slice(0, limit).map(file => JSON.stringify(file)).join(', ')}${files.length > limit ? `; plus ${files.length - limit} more` : ''}`);
      }
    } else lines.push('This older report has no per-file comparison. Recreate it with check:integration followed by test:local after completing the update.');
  }
  const helpers = ['apply-patch.cjs', 'patch-manifest.json'].filter(file => fs.existsSync(path.join(root, file)));
  if (helpers.length) lines.push(`PATCH FILES IN APPLICATION: ${helpers.join(', ')}. Extract patch packages outside the application and run their installer from that separate folder.`);
  return lines;
}
