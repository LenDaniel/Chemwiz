import React from 'react';
import { LearningDataTransfer } from '../components/LearningDataTransfer.jsx';
import { PwaControls } from '../components/PwaControls.jsx';
import { version } from '../../../../package.json';

export function Profile({
  t,
  settings,
  onSettingsChange,
  onReset,
  user,
  onLogout,
  learning,
  authToken,
}) {
  const safeSettings = {
    theme: 'dark',
    fontSize: 'medium',
    syllabus: 'ZIMSEC',
    sound: 'on',
    ...(settings || {}),
  };

  const formatText = (value) => {
    if (!value) return 'Not set';
    const text = String(value);
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const accountStatus = user?.accountStatus || 'active';
  const isExpired = Boolean(user?.access?.isExpired);
  const isPremium = Boolean(user?.access?.isPremium);

  const tier = formatText(user?.subscriptionTier || 'free');
  const status = isExpired
    ? 'Expired'
    : formatText(user?.subscriptionStatus || 'active');

  const expiresAt = user?.subscriptionExpiresAt
    ? new Date(user.subscriptionExpiresAt).toLocaleDateString()
    : 'No expiry';

  const level = user?.level || 'A-Level Chemistry';
  const role = user?.role || 'student';

  const canUseStructured = Boolean(user?.access?.canUseStructured);
  const canUseWorkedExamples = Boolean(user?.access?.canUseWorkedExamples);
  const canUseTutor = Boolean(user?.access?.canUseTutor);

  const panel = t.panel || 'rgba(255,255,255,0.04)';
  const panelHi = t.panelHi || t.panel || 'rgba(255,255,255,0.07)';

  const cardStyle = {
    background: panel,
    border: `1px solid ${t.border}`,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 14,
  };

  const sectionTitleStyle = {
    padding: '10px 16px',
    background: panelHi,
    fontSize: 10,
    letterSpacing: '0.2em',
    color: t.textDim,
    fontFamily: 'monospace',
    fontWeight: 700,
    textTransform: 'uppercase',
  };

  const rowValueStyle = {
    color: t.text,
    fontWeight: 700,
    textAlign: 'right',
    fontSize: 11,
  };

  const infoRow = (label, value, opts = {}) => (
    <div
      key={label}
      className="cw-profile-row"
      style={{
        padding: '13px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        borderBottom: opts.last ? 'none' : `1px solid ${t.border}`,
      }}
    >
      <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 600 }}>
        {label}
      </div>

      <div className="cw-profile-value" style={{ ...rowValueStyle, ...(opts.valueStyle || {}) }}>
        {value}
      </div>
    </div>
  );

  const settingRow = (label, key, opts) => (
    <div
      key={label}
      className="cw-profile-setting"
      style={{
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        borderBottom: `1px solid ${t.border}`,
      }}
    >
      <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>
        {label}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
        }}
      >
        {opts.map((o) => {
          const active = safeSettings[key] === o.v;

          return (
            <button
              key={o.v}
              type="button"
              aria-pressed={active}
              aria-label={key === 'fontSize' ? `${o.v[0].toUpperCase()}${o.v.slice(1)} reading text` : undefined}
              onClick={() =>
                onSettingsChange?.({
                  ...safeSettings,
                  [key]: o.v,
                })
              }
              style={{
                padding: '5px 10px',
                background: active ? t.accent : 'transparent',
                color: active ? '#000' : t.text,
                border: `1px solid ${active ? t.accent : t.border}`,
                fontSize: 10,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                borderRadius: 3,
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const warningBox = (message, danger = false) => (
    <div
      style={{
        background: danger
          ? 'rgba(230, 57, 70, 0.14)'
          : 'rgba(0, 212, 255, 0.08)',
        border: danger
          ? '1px solid rgba(230, 57, 70, 0.35)'
          : `1px solid ${t.border}`,
        color: danger ? '#ffd6d6' : t.textMuted,
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
        fontSize: 12,
        lineHeight: 1.5,
      }}
    >
      {message}
    </div>
  );

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          fontSize: 10,
          letterSpacing: '0.3em',
          color: t.textDim,
          fontFamily: 'monospace',
        }}
      >
        CHEMWIZ ACCOUNT
      </div>

      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: t.text,
          marginTop: 4,
          marginBottom: 6,
        }}
      >
        Profile
      </div>

      <div
        style={{
          fontSize: 11,
          color: t.textMuted,
          lineHeight: 1.5,
          marginBottom: 16,
        }}
      >
        Manage account details, plan status, learning setup, and app settings.
      </div>

      {accountStatus !== 'active' &&
        warningBox(
          `Your account status is ${accountStatus}. Some features may be unavailable.`,
          true
        )}

      {isExpired &&
        warningBox(
          'Your subscription has expired. Renew to regain Premium access.',
          true
        )}

      {!isPremium &&
        accountStatus === 'active' &&
        !isExpired &&
        warningBox(
          'You are currently on the Free plan. Premium unlocks Structured Questions, Worked Examples, and Wiz AI Tutor access.'
        )}

      {isPremium &&
        accountStatus === 'active' &&
        !isExpired &&
        warningBox(
          'Premium access is active. Structured Questions, Worked Examples, and Wiz AI Tutor access are unlocked.'
        )}

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Account</div>

        {infoRow('Name', user?.name || 'ChemWiz User')}
        {infoRow('Email', user?.email || 'Not available')}
        {infoRow('Role', formatText(role))}
        {infoRow('Account status', formatText(accountStatus))}
        {infoRow('Login status', 'Logged in', {
          last: true,
          valueStyle: { color: '#31d67b', fontWeight: 900 },
        })}
      </div>

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Learning</div>

        {infoRow('Level', level)}
        {infoRow('Syllabus', 'Forms 5–6 Chemistry')}
        {infoRow('Progress', learning.status === 'saved' ? 'Saved to your account' : 'Changes waiting to save', { last: true })}
      </div>

      <LearningDataTransfer learning={learning} user={user} token={authToken} />
      <div className="cw-workspace-links">
        <a href="/">ChemWiz home</a>
        {user?.role === 'admin' && <a href="/admin/">Admin workspace</a>}
      </div>

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Plan</div>

        {infoRow('Tier', tier, {
          valueStyle: { color: t.accent, fontWeight: 900 },
        })}

        {infoRow('Status', status, {
          valueStyle: {
            color: isExpired ? '#e63946' : t.text,
            fontWeight: 900,
          },
        })}

        {infoRow('Expires', expiresAt)}
        {infoRow('Premium access', isPremium ? 'Unlocked' : 'Locked', {
          last: true,
          valueStyle: {
            color: isPremium ? '#31d67b' : '#e63946',
            fontWeight: 900,
          },
        })}

        <div style={{ padding: '0 16px 14px' }}>
          <button
            type="button"
            onClick={() => alert('Upgrade feature coming soon.')}
            style={{
              width: '100%',
              padding: 11,
              background: t.accent,
              border: 'none',
              color: '#000',
              fontSize: 10,
              letterSpacing: '0.18em',
              fontWeight: 900,
              fontFamily: 'monospace',
              cursor: 'pointer',
              borderRadius: 4,
            }}
          >
            UPGRADE PLAN
          </button>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Feature access</div>

        {infoRow('Structured Questions', canUseStructured ? 'Unlocked' : 'Locked')}
        {infoRow('Worked Examples', canUseWorkedExamples ? 'Unlocked' : 'Locked')}
        {infoRow('Wiz AI Tutor', canUseTutor ? 'Unlocked' : 'Locked', {
          last: true,
        })}
      </div>

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>App settings</div>

        {settingRow('Theme', 'theme', [
          { v: 'dark', label: 'DARK' },
          { v: 'light', label: 'LIGHT' },
        ])}

        {settingRow('Font size', 'fontSize', [
          { v: 'small', label: 'S' },
          { v: 'medium', label: 'M' },
          { v: 'large', label: 'L' },
        ])}

        {settingRow('Sound', 'sound', [
          { v: 'on', label: 'ON' },
          { v: 'off', label: 'OFF' },
        ])}
      </div>

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Syllabus</div>

        {settingRow('Preset', 'syllabus', [
          { v: 'ZIMSEC', label: 'ZIMSEC' },
          { v: 'CAIE', label: 'CAIE' },
        ])}

        <div
          style={{
            padding: '12px 16px',
            fontSize: 10,
            color: t.textDim,
            lineHeight: 1.5,
            fontStyle: 'italic',
          }}
        >
          ZIMSEC Form 5–6 Chemistry. Cambridge 9701 is highly compatible —
          content is notation-level different only.
        </div>
      </div>

      <div
        style={{
          background: panel,
          borderRadius: 8,
          padding: '14px 16px',
          marginBottom: 14,
          border: `1px solid ${t.border}`,
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.2em',
            color: t.textDim,
            fontFamily: 'monospace',
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          ABOUT
        </div>

        <div style={{ fontSize: 12, color: t.text, lineHeight: 1.6 }}>
          ChemWiz v{version}
        </div>

        <div style={{ fontSize: 10, color: t.textDim, marginTop: 4 }}>
          24-topic ZIMSEC build · student account + plan foundation
        </div>
      </div>

      <PwaControls learning={learning} />
      <button
        type="button"
        onClick={onReset}
        style={{
          width: '100%',
          padding: 12,
          background: 'transparent',
          border: '1px solid #e63946',
          color: '#e63946',
          fontSize: 10,
          letterSpacing: '0.25em',
          fontWeight: 700,
          fontFamily: 'monospace',
          cursor: 'pointer',
          borderRadius: 4,
          marginBottom: 10,
        }}
      >
        RESET LEARNING DATA
      </button>

      <button
        type="button"
        onClick={onLogout}
        style={{
          width: '100%',
          padding: 12,
          background: '#e63946',
          border: '1px solid #e63946',
          color: '#fff',
          fontSize: 10,
          letterSpacing: '0.25em',
          fontWeight: 700,
          fontFamily: 'monospace',
          cursor: 'pointer',
          borderRadius: 4,
        }}
      >
        LOG OUT
      </button>
    </div>
  );
}
