import React from "react";

export function LockedFeature({ t, user, featureName, onBack, onProfile }) {
  const tier = user?.subscriptionTier || "free";
  const status = user?.subscriptionStatus || "active";

  return (
    <div style={{ padding: 18, color: t.text }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", color: t.textDim }}>
          PREMIUM ACCESS
        </div>

        <h1 style={{ margin: "6px 0 4px", fontSize: 26 }}>
          Feature Locked
        </h1>

        <p style={{ margin: 0, color: t.textMuted, fontSize: 12, lineHeight: 1.5 }}>
          {featureName} is available to Premium, Teacher, and Admin accounts.
        </p>
      </div>

      <div
        style={{
          background: t.panel,
          border: `1px solid ${t.border}`,
          borderRadius: 14,
          padding: 16,
          marginBottom: 14,
        }}
      >
        <div style={{ fontSize: 11, color: t.textDim, marginBottom: 8 }}>
          CURRENT PLAN
        </div>

        <div style={{ fontSize: 14, fontWeight: 800 }}>
          Tier: {tier}
        </div>

        <div style={{ fontSize: 12, color: t.textMuted, marginTop: 6 }}>
          Status: {status}
        </div>
      </div>

      <button
        type="button"
        onClick={onProfile}
        style={{
          width: "100%",
          padding: 12,
          background: t.accent,
          color: "#000",
          border: "none",
          borderRadius: 8,
          fontWeight: 900,
          fontFamily: "monospace",
          letterSpacing: "0.14em",
          cursor: "pointer",
          marginBottom: 10,
        }}
      >
        VIEW PROFILE / PLAN
      </button>

      <button
        type="button"
        onClick={onBack}
        style={{
          width: "100%",
          padding: 12,
          background: "transparent",
          color: t.text,
          border: `1px solid ${t.border}`,
          borderRadius: 8,
          fontWeight: 800,
          fontFamily: "monospace",
          letterSpacing: "0.14em",
          cursor: "pointer",
        }}
      >
        GO BACK
      </button>
    </div>
  );
}