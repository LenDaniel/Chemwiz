# W2 — responsive/accessibility and admin session reliability

Version 1.3.0 patches the unified 1.2.1 baseline. The working application, 24 topic/assessment records, persistent account/learning schemas, provider settings and origin allowlist are preserved.

## Delivered changes

- Shared diagrams wrap explanatory labels, card/step/table rows and titles; measured bounds retain complete equations/raw structures and every label. Learners can enlarge and read diagram text.
- Reader font preferences affect actual paragraph/list text. Forms, periodic elements, toggles and navigation have meaningful names/states. Search and admin user details use native modal dialogs with explicit keyboard cycling, Escape and trigger focus return.
- The shell, controls, quiz, structured/worked activities, tools, profile/progress, Wiz and admin tables are checked across six viewport sizes; mobile gets direct topbar logout through the existing save-and-sign-out handler.
- Admin authentication is separated from optional dashboard panels. Transient panel/network failures retain a valid session and allow retry. Real authentication/role failures still reject access. HTTP status/error codes survive the frontend wrapper, and unexpected HTML API responses are diagnosed.
- Backend health/readiness and the admin entry page advertise the release version. Read-only diagnostics distinguish old deployments, rejected origins, database readiness and selected-account record problems. They never print password material or change accounts/settings.
- Windows check commands invoke npm's JavaScript CLI directly through Node with shell disabled, eliminating the helper's DEP0190 pattern.

## Validation and installation

All required gates passed: 17 actual frontend request probes, 24 backend route/access checks, 59 regression tests, 26 browser scenarios and zero measured diagram text clipping across all 218 diagrams. See docs/VERIFICATION.md and the supplied sanitized release evidence. Use the ZIP README_PATCH.md installer and exact check sequence before publication. Existing private settings and data stay in place.

Live admin diagnosis still requires the actual public URL/current error or the operator running ADMIN_LOGIN_GUIDE.md. This build does not access the live deployment or prove real Atlas/provider/device operation. The existing medium password/throttling findings and the large on-demand search chunk remain documented. W3 is next; no remaining roadmap phase is cancelled.

Implementation references: [W3C modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [W3C native dialog technique](https://www.w3.org/WAI/WCAG22/Techniques/html/H102), [Node child process API](https://nodejs.org/api/child_process.html).
