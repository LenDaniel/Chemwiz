const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const packageFolder = __dirname;
const manifest = JSON.parse(fs.readFileSync(path.join(packageFolder, 'patch-manifest.json'), 'utf8'));
const argument = process.argv[2];
if (!argument || process.argv.length !== 3) {
  console.error('Usage: node apply-patch.cjs "PATH_TO_YOUR_EXISTING_CHEMWIZ_UNIFIED_FOLDER"');
  process.exit(1);
}
const target = path.resolve(argument);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const normalizedHash = bytes => hash(Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n')));
function safePath(root, relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative) || relative.includes('\\') ||
    relative.split('/').some(part => !part || part === '.' || part === '..')) throw new Error('Unsafe patch path.');
  if (/^(?:data|node_modules|dist|\.git|\.wrangler|\.build-checks)(?:\/|$)/.test(relative) || /(^|\/)\.env(?:\.|$)/.test(relative)) throw new Error('Patch attempts to replace private/runtime files.');
  const result = path.resolve(root, relative);
  if (!result.startsWith(path.resolve(root) + path.sep)) throw new Error('Patch path leaves its target folder.');
  let position = path.resolve(root);
  for (const part of relative.split('/')) {
    position = path.join(position, part);
    if (fs.existsSync(position) && fs.lstatSync(position).isSymbolicLink()) throw new Error('Patch paths must not use symbolic links: ' + relative);
  }
  return result;
}
try {
  const targetPackage = JSON.parse(fs.readFileSync(path.join(target, 'package.json'), 'utf8'));
  if (targetPackage.name !== 'chemwiz-unified' || ![manifest.baselineVersion, manifest.targetVersion].includes(targetPackage.version)) {
    throw new Error('This patch requires chemwiz-unified v' + manifest.baselineVersion + '. Keep this ZIP separate from the three old projects.');
  }
  if (!Array.isArray(manifest.files) || !manifest.files.length) throw new Error('Empty patch manifest.');
  const seen = new Set(), changes = [];
  for (const entry of manifest.files) {
    if (seen.has(entry.path)) throw new Error('Duplicate patch path: ' + entry.path);
    seen.add(entry.path);
    const source = safePath(path.join(packageFolder, 'chemwiz-unified'), entry.path);
    const destination = safePath(target, entry.path);
    if (fs.existsSync(destination + '.chemwiz-patch.tmp')) throw new Error('A previous patch temporary file exists: ' + entry.path + '. Review it before retrying.');
    const bytes = fs.readFileSync(source);
    if (hash(bytes) !== entry.sha256) throw new Error('Damaged patch payload: ' + entry.path);
    const existing = fs.existsSync(destination) ? fs.readFileSync(destination) : null;
    const existingHash = existing ? hash(existing) : null;
    const textHash = existing && entry.text ? normalizedHash(existing) : null;
    if (existingHash === entry.sha256 || (textHash && textHash === entry.normalizedSha256)) continue;
    const generatedEvidence = entry.generated === true && entry.path === 'verification/release-evidence.json';
    if (!generatedEvidence && (entry.baselineSha256 === null ? existing !== null :
      existingHash !== entry.baselineSha256 && (!textHash || textHash !== entry.baselineNormalizedSha256))) {
      throw new Error('Existing file differs from the checked baseline: ' + entry.path + '. Nothing has been patched; preserve your changes and use the matching baseline.');
    }
    changes.push({ entry, destination, bytes, existing });
  }
  if (!changes.length) {
    console.log('Patch already applied. Run check:integration, test:local and ready:deploy before publishing.');
    process.exit(0);
  }
  safePath(target, 'patch-backups/check');
  const backup = path.join(target, 'patch-backups', manifest.targetVersion + '-' + Date.now());
  fs.mkdirSync(backup, { recursive: true });
  // Verify every baseline and payload before writing any application file.
  for (const change of changes) {
    if (change.existing !== null) {
      const filename = path.join(backup, change.entry.path);
      fs.mkdirSync(path.dirname(filename), { recursive: true });
      fs.writeFileSync(filename, change.existing);
    }
  }
  fs.writeFileSync(path.join(backup, 'PATCH_BACKUP.json'), JSON.stringify({ version: targetPackage.version,
    patch: manifest.targetVersion, replaced: changes.filter(item => item.existing !== null).map(item => item.entry.path),
    added: changes.filter(item => item.existing === null).map(item => item.entry.path) }, null, 2) + '\n');
  for (const { destination, bytes } of changes) {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    const temporary = destination + '.chemwiz-patch.tmp';
    fs.writeFileSync(temporary, bytes, { flag: 'wx' });
    fs.renameSync(temporary, destination);
  }
  console.log('Applied v' + manifest.targetVersion + ': ' + changes.length + ' files.');
  console.log('Replaced-file backup: ' + backup);
  console.log('Run npm ci --include=dev, check:integration, test:local and ready:deploy before publishing.');
} catch (error) {
  console.error('PATCH BLOCKED:', error.message);
  process.exitCode = 1;
}
