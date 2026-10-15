import { useState } from 'react';
import { AccountRecovery, recoveryToken } from '../../../../shared/AccountRecovery.jsx';
import { PasswordField } from '../../../../shared/PasswordField.jsx';
import * as recoveryApi from '../config/api.js';
import { ChemWizBrand } from '../components/ChemWizBrand.jsx';
import release from '../../../../package.json';

export function AdminLogin({
  email,
  setEmail,
  password,
  setPassword,
  busy,
  error,
  handleLogin,
  retrySession,
  upgradeToken,clearUpgrade,onRecoveryDone,
}) {
  const [recovering,setRecovering] = useState(()=>Boolean(recoveryToken()));
  if(recovering || upgradeToken) return <div className="admin-shell login-shell"><div className="login-card"><ChemWizBrand/><AccountRecovery api={recoveryApi} workspace="admin" email={email} upgradeToken={upgradeToken} onDone={onRecoveryDone} onBack={()=>{setRecovering(false);clearUpgrade();}} /></div></div>;
  return (
    <div className="admin-shell login-shell">
      <form className="login-card" onSubmit={handleLogin}>
        <ChemWizBrand />

        <p className="eyebrow">CHEMWIZ ADMIN</p>
        <h1>Admin Login</h1>

        <p className="muted">
          Sign in with an account that has admin privileges.
        </p>
        <p><a href="/">‹ ChemWiz home</a> · <a href="/student/">Student workspace</a></p>

        {error && <div className="error-box" role="alert">{error}</div>}
        {retrySession && <button type="button" onClick={retrySession} disabled={busy}>Retry saved session</button>}

        <label htmlFor="admin-email">Email</label>
        <input
          id="admin-email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="admin@email.com"
          autoComplete="username"
          required
        />

        <label htmlFor="admin-password">Password</label>
        <PasswordField
          id="admin-password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          required
        />

        <button disabled={busy} type="submit">
          {busy ? "Checking..." : "Login"}
        </button>
        <button type="button" className="secondary" onClick={()=>setRecovering(true)}>Forgot password?</button>
        <details className="admin-login-help"><summary>Admin sign-in help</summary>
          <p>Use an existing administrator account for this database. Public signup creates a learner account. Local demo credentials do not automatically create an administrator in MongoDB.</p>
          <p>An origin error happens before password checking. Confirm the current deployment and the public site address in the Admin login guide.</p>
        </details>
        <p className="admin-build-version">ChemWiz {release.version}</p>
      </form>
    </div>
  );
}
