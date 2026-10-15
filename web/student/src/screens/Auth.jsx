import { PasswordField } from '../../../../shared/PasswordField.jsx';
import { AccountRecovery, recoveryToken } from '../../../../shared/AccountRecovery.jsx';
import { passwordIssues, PASSWORD_REQUIREMENTS } from '../../../../shared/password-policy.mjs';
import * as recoveryApi from '../config/api.js';
import { ChemWizBrand } from '../components/ChemWizBrand.jsx';
import React, { useState } from "react";

export function Auth({ t, onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation,setConfirmation] = useState("");
  const [recovery,setRecovery] = useState(()=>recoveryToken() ? {} : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isRegister = mode === "register";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const issues=passwordIssues(password);
        if(issues.length) throw new Error(issues.join(' '));
        if(password !== confirmation) throw new Error('The passwords do not match.');
        await onRegister({ name, email, password });
      } else {
        await onLogin({ email, password });
      }
    } catch (err) {
      if(err.data?.code === 'PASSWORD_UPGRADE_REQUIRED') { setRecovery({upgradeToken:err.data.upgradeToken});setPassword(''); }
      else setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const vars = {
    '--cw-bg': t.bg,
    '--cw-color-scheme': t.colorScheme || 'dark',
    '--cw-panel': t.panel,
    '--cw-panel-hi': t.panelHi,
    '--cw-text': t.text,
    '--cw-muted': t.textMuted,
    '--cw-dim': t.textDim,
    '--cw-border': t.border,
    '--cw-accent': t.accent,
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: 10,
    background: t.panel,
    border: `1px solid ${t.border}`,
    color: t.text,
    borderRadius: 8,
    boxSizing: "border-box",
    outline: "none",
  };

  return (
    <div className="cw-auth-root" style={vars}>
      <div className="cw-auth-window">
        <section className="cw-auth-hero" aria-label="ChemWiz introduction">
          <div>
            <ChemWizBrand className="cw-landing-logo" />
            <h2>Your chemistry workspace, wherever you learn.</h2>
            <p>
              Explore ZIMSEC-aligned notes, diagrams, quizzes and chemistry tools. Learn at your pace and keep your progress together on your phone or computer.
            </p>
          </div>
          <div className="cw-auth-pills">
            <span className="cw-auth-pill">24 ZIMSEC TOPICS</span>
            <span className="cw-auth-pill">NOTES & QUIZZES</span>
            <span className="cw-auth-pill">WIZ AI TUTOR</span>
            <span className="cw-auth-pill">YOUR SAVED PROGRESS</span>
          </div>
        </section>

        <section className="cw-auth-form-side">
          <div className="cw-auth-card">
            <ChemWizBrand className="cw-login-logo" />
            <div style={{ fontSize: 10, letterSpacing: "0.3em", color: t.textDim }}>CHEMWIZ ACCOUNT</div>
            <h1 style={{ margin: "8px 0 4px", fontSize: 26, color: t.text }}>
              {isRegister ? "Create account" : "Welcome back"}
            </h1>
            <p style={{ color: t.textMuted, fontSize: 12, lineHeight: 1.6, marginBottom: 0 }}>
              Sign in to keep your progress, quiz results and settings together.
            </p>

            <a className="cw-home-link" href="/">‹ ChemWiz home</a>
            {recovery ? <AccountRecovery api={recoveryApi} email={email} {...recovery} onBack={()=>{setRecovery(null);setError('');setPassword('');setConfirmation('');}} /> : <>
            <form onSubmit={submit} style={{ marginTop: 20 }}>
              {isRegister && (
                <input
                  style={inputStyle}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  aria-label="Full name"
                  autoComplete="name"
                  required
                />
              )}

              <input
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                aria-label="Email"
                type="email"
                autoComplete="email"
                required
              />

              <PasswordField
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                aria-label="Password"
                autoComplete={isRegister ? "new-password" : "current-password"}
                minLength={isRegister ? 12 : undefined}
                required
              />

              {isRegister && <><p className="cw-account-policy" style={{color:t.textMuted,fontSize:12,lineHeight:1.6}}>{PASSWORD_REQUIREMENTS}</p><PasswordField label="Confirm password" placeholder="Confirm password" autoComplete="new-password" style={inputStyle} value={confirmation} onChange={event=>setConfirmation(event.target.value)} minLength={12} required /></>}

              {error && (
                <div role="alert" style={{ color: "#ff6b6b", fontSize: 11, marginBottom: 10, lineHeight: 1.45 }}>
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                style={{
                  width: "100%",
                  padding: 13,
                  background: loading ? t.textDim : t.accent,
                  color: "#000",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 900,
                  letterSpacing: "0.15em",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "PLEASE WAIT..." : isRegister ? "CREATE ACCOUNT" : "LOGIN"}
              </button>
            </form>
            {!isRegister && <button type="button" className="cw-home-link" style={{background:'transparent',border:0,color:t.textMuted,minHeight:44,cursor:'pointer'}} onClick={()=>{setError('');setRecovery({});}}>Forgot password?</button>}
            </>}


            {!recovery && <button
              onClick={() => {
                setError("");setPassword("");setConfirmation("");
                setMode(isRegister ? "login" : "register");
              }}
              type="button"
              style={{
                marginTop: 14,
                width: "100%",
                background: "transparent",
                border: "none",
                color: t.textDim,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              {isRegister
                ? "Already have an account? Login"
                : "No account yet? Create one"}
            </button>}
          </div>
        </section>
      </div>
    </div>
  );
}
