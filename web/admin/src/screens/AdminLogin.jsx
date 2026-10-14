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
}) {
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
        <input
          id="admin-password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          required
        />

        <button disabled={busy} type="submit">
          {busy ? "Checking..." : "Login"}
        </button>
        <details className="admin-login-help"><summary>Admin sign-in help</summary>
          <p>Use an existing administrator account for this database. Public signup creates a learner account. Local demo credentials do not automatically create an administrator in MongoDB.</p>
          <p>An origin error happens before password checking. Confirm the current deployment and the public site address in the Admin login guide.</p>
        </details>
        <p className="admin-build-version">ChemWiz {release.version}</p>
      </form>
    </div>
  );
}
