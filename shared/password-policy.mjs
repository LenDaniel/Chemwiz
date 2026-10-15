export const PASSWORD_POLICY_VERSION = 1;
export const PASSWORD_REQUIREMENTS = 'Use at least 12 characters, including a letter, a number and a special character. Avoid common passwords or repeated sequences.';
export function passwordIssues(password) {
  if (typeof password !== 'string') return [PASSWORD_REQUIREMENTS];
  const issues = [];
  if (password.length < 12) issues.push('Use at least 12 characters.');
  if (new TextEncoder().encode(password).length > 72) issues.push('Use at most 72 UTF-8 bytes (usually 72 characters).');
  if (!/\p{L}/u.test(password)) issues.push('Include a letter.');
  if (!/[0-9]/.test(password)) issues.push('Include a number.');
  if (!/[^\p{L}\p{N}\s]/u.test(password)) issues.push('Include a special character.');
  const letters = password.toLowerCase().replace(/[^a-z]/g, '');
  if (['password','qwerty','letmein','welcome','changeme','admin','administrator','chemwiz','abcdef','abcdefgh','abcdefghijkl'].includes(letters) || /^(.)\1{5,}$/.test(letters)) issues.push('Choose a less predictable password.');
  return issues;
}
