# ChemWiz EmailJS setup

The v1.5.0 app retains the backend EmailJS utility in backend/src/utils/email.js. Templates use the approved navy/cyan colours.

1. Connect and verify your sending service in EmailJS. Create a reset template and paste docs/emailjs/password-reset.html into its HTML/source editor. Subject: Reset your ChemWiz password. To Email: {{to_email}}. To Name, if offered: {{to_name}}. From Name: ChemWiz. Use the connected sender, leave CC/BCC empty, and use a real monitored reply mailbox if needed.
2. Optionally create a second template with docs/emailjs/password-changed.html. Subject: Your ChemWiz password changed. Use the same recipient/sender rules.
3. In EmailJS Account → Security, enable server/non-browser API access and private-key authentication. Keep escaped double-brace variables; do not use triple braces. The existing flow does not send a CAPTCHA token.
4. In Render Environment set EMAILJS_SERVICE_ID, EMAILJS_RESET_TEMPLATE_ID, EMAILJS_PUBLIC_KEY and EMAILJS_PRIVATE_KEY. Optional: EMAILJS_PASSWORD_CHANGED_TEMPLATE_ID. Preserve APP_URL, MONGODB_URI, JWT_SECRET and AI settings. Keys remain backend-only.
5. Reset parameters: to_email, to_name, reset_url, reset_code, expires_in, expires_at, support_whatsapp, support_url, app_name. Changed parameters: to_email, to_name, app_name, support_url. No password is sent.
6. Test actual delivery using your own test account/inbox. Each reset expires after one hour and can be used once, enforced by the backend. Completing a reset invalidates the code/link and old sessions. Check both workspaces and phone/Gmail/Outlook rendering.

The changed email’s Open ChemWiz link is https://chemwiz.co.zw/; change that static link if your address changes. Reset links come from trusted APP_URL. Limit unnecessary email history/tracking according to your privacy assessment.

Guardian invitations are manually shared after verified written authority in S1; these two security templates do not send guardian invitations automatically.

Official references: https://www.emailjs.com/docs/rest-api/send/ ; https://www.emailjs.com/docs/user-guide/dynamic-variables-templates/ ; https://github.com/emailjs-com/emailjs-nodejs#usage
