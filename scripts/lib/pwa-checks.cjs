const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { studentWorkerSource } = require('./student-service-worker.cjs');
function checkPwaBuild(root) {
  const directory = path.join(root, 'dist/student');
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'manifest.webmanifest'), 'utf8'));
  assert.equal(manifest.id, '/student/'); assert.equal(manifest.scope, '/student/');
  assert.equal(manifest.start_url, '/student/'); assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.prefer_related_applications, false);
  assert.ok(manifest.name && manifest.short_name);
  const files = ['/student/offline.html', '/student/manifest.webmanifest', '/student/icons/chemwiz-192.png', '/student/icons/chemwiz-512.png', '/student/icons/chemwiz.svg'];
  for (const size of [192, 512]) {
    const icon = manifest.icons.find(icon => icon.sizes === `${size}x${size}`);
    assert.equal(icon?.src, `/student/icons/chemwiz-${size}.png`);
    const bytes = fs.readFileSync(path.join(root, 'dist', icon.src));
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(bytes.readUInt32BE(16), size); assert.equal(bytes.readUInt32BE(20), size);
  }
  const hash = createHash('sha256').update(JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version);
  for (const file of files) hash.update(file).update(fs.readFileSync(path.join(root, 'dist', file)));
  hash.update(fs.readFileSync(path.join(root, 'dist/.vite/manifest.json')));
  const version = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;
  const buildId = version + '-' + hash.digest('hex').slice(0, 16);
  assert.equal(fs.readFileSync(path.join(directory, 'sw.js'), 'utf8'), studentWorkerSource({ buildId, files }));
  assert.ok(fs.readFileSync(path.join(directory, 'index.html'), 'utf8').includes('/student/manifest.webmanifest'));
  return { status: 'PASS', buildId, cacheFiles: files, checks: ['Learner-only manifest and standalone start URL', 'Actual 192/512 PNG icons', 'Deterministic worker matches this release and recovery file hashes', 'Recovery cache is limited to five explicit public files'] };
}
module.exports = { checkPwaBuild };
