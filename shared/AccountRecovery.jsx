import { useEffect, useState } from 'react';
import { PasswordField } from './PasswordField.jsx';
import { passwordIssues, PASSWORD_REQUIREMENTS } from './password-policy.mjs';
export function recoveryToken() {
  if(typeof window === 'undefined') return '';
  const value = new URLSearchParams(window.location.hash.replace(/^#/,'' )).get('reset');
  return value && /^[a-f0-9]{64}$/.test(value) ? value : '';
}
export function AccountRecovery({api,workspace='student',email:initialEmail='',upgradeToken='',onBack,onDone}) {
  const [token] = useState(recoveryToken);
  const [mode,setMode] = useState(upgradeToken ? 'upgrade' : token ? 'link' : 'request');
  const [email,setEmail] = useState(initialEmail);
  const [code,setCode] = useState('');
  const [password,setPassword] = useState('');
  const [confirmation,setConfirmation] = useState('');
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const [message,setMessage] = useState('');
  useEffect(()=>{
    if (token) window.history.replaceState(null,'',window.location.pathname+window.location.search);
  },[token]);
  async function submit(event) {
    event.preventDefault();setBusy(true);setError('');
    try {
      if (mode === 'request') {
        const data = await api.requestPasswordReset({email,workspace});
        setMessage(data.message);setMode('code');
      } else {
        const issues = passwordIssues(password);
        if (issues.length) throw new Error(issues.join(' '));
        if (password !== confirmation) throw new Error('The new passwords do not match.');
        const data = mode === 'upgrade'
          ? await api.upgradePassword({upgradeToken,newPassword:password,confirmPassword:confirmation})
          : await api.resetPassword({...(mode === 'link' ? {token} : {email,code}),newPassword:password,confirmPassword:confirmation});
        setPassword('');setConfirmation('');setMessage(data.message);setMode('done');
        localStorage.removeItem(workspace === 'admin' ? 'chemwiz.admin.token' : 'cw.authToken');
        onDone?.();
      }
    } catch(err) {setError(err.message || 'Could not update your password. Try again.');}
    finally {setBusy(false);}
  }
  return <section className="cw-account-recovery" aria-label="Account recovery">
    <h2>{mode === 'upgrade' ? 'Upgrade your password' : mode === 'done' ? 'Password updated' : mode === 'request' ? 'Forgot your password?' : 'Set a new password'}</h2>
    {mode === 'upgrade' && <p>Your current password needs to be stronger. Complete this step to continue signing in.</p>}
    {message && <p role="status">{message}</p>}
    {mode !== 'done' && <form onSubmit={submit}>
      {['request','code'].includes(mode) && <label>Email<input aria-label="Recovery email" type="email" autoComplete="email" value={email} onChange={event=>setEmail(event.target.value)} required /></label>}
      {mode === 'code' && <label>8-digit reset code<input aria-label="Reset code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{8}" minLength={8} maxLength={8} value={code} onChange={event=>setCode(event.target.value.replace(/[^0-9]/g,''))} required /></label>}
      {mode !== 'request' && <>
        <p id="cw-recovery-requirements">{PASSWORD_REQUIREMENTS}</p>
        <label>New password<PasswordField label="New password" placeholder="New password" autoComplete="new-password" aria-describedby="cw-recovery-requirements" minLength={12} value={password} onChange={event=>setPassword(event.target.value)} required /></label>
        <label>Confirm new password<PasswordField label="Confirm new password" placeholder="Confirm new password" autoComplete="new-password" minLength={12} value={confirmation} onChange={event=>setConfirmation(event.target.value)} required /></label>
      </>}
      {error && <p role="alert" className="cw-account-error">{error}</p>}
      <button type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'request' ? 'Send reset email' : 'Update password'}</button>
    </form>}
    {mode === 'request' && <button type="button" className="cw-account-link" onClick={()=>{setError('');setMode('code');}}>I already have a reset code</button>}
    {['code','link'].includes(mode) && <button type="button" className="cw-account-link" onClick={()=>{setError('');setMessage('');setMode('request');}}>Request a new reset email</button>}
    <button type="button" className="cw-account-link" disabled={busy} onClick={onBack}>{mode === 'done' ? 'Back to sign in' : 'Cancel and return to sign in'}</button>
    <p className="cw-account-support">Need help? <a href="https://wa.me/263718645362" target="_blank" rel="noopener noreferrer">WhatsApp +263 718 645 362</a></p>
  </section>;
}
