import { ChemWizBrand } from '../components/ChemWizBrand.jsx';

export function AdminLogin({
  email,
  setEmail,
  password,
  setPassword,
  busy,
  error,
  handleLogin,
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

        {error && <div className="error-box">{error}</div>}

        <label htmlFor="admin-email">Email</label>
        <input
          id="admin-email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="admin@email.com"
          autoComplete="username"
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
        />

        <button disabled={busy} type="submit">
          {busy ? "Checking..." : "Login"}
        </button>
      </form>
    </div>
  );
}
