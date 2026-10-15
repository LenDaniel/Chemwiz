# K-Cleanup + Render origin fix — v1.2.0

The Render admin login error was reproduced against the accepted U1.1 release using an HTTPS public origin forwarded to a plain HTTP Node listener. The new release recognises the platform-provided Render URL, normalises configured workspace URLs to origins and retains rejection of unlisted sites. No proxy-trust change or wildcard CORS rule was added.

The supplied latest source had already removed the old topic-level JSX diagrams. This release finishes the unused legacy component-rendering branch in `Primitives.jsx` after loading every topic and confirming that all 218 diagrams contain specs. The shared renderer remains in place.

## Targeted Polymerisation corrections

- Replaced the contradictory ammonia-based hydrolysis worked example with definite Nylon-6,6 evidence: hexane-1,6-diamine and a hexanedioate salt, followed by acidification to recover the diacid.
- Corrected caprolactam to a seven-membered ring containing six carbons and one nitrogen; clarified ring opening versus amino-acid condensation routes to Nylon-6.
- Corrected condensation diagrams to show two eliminated small molecules per diol/diacid or diamine/diacid repeat pair.
- Added the exact finite-chain convention: `n` diol plus `n` diacid molecules form `2n − 1` links/water molecules in one open chain. Repeat-unit equations omit end groups. The related MCQ now states the convention explicitly.
- Distinguished free carboxylic acids from their salts during acid/base hydrolysis, including PET recovery and the structured hydrolysis answer.
- Clarified the unmatched functional groups in the amino-alcohol example and the classification of Ziegler–Natta polymerisation.

Coverage was checked against the supplied Revised Chemistry Syllabus F5–6, printed page 32 (PDF page 35): addition and condensation polymerisation, monomer/repeat-unit deduction and polymer uses. These are targeted corrections; the remaining topic chemistry has not been independently re-reviewed in full.

Reference checks: [Chemguide polyamides](https://www.chemguide.co.uk/organicprops/amides/polyamides.html), [amide hydrolysis](https://www.chemguide.co.uk/organicprops/amides/hydrolysis.html), and the caprolactam structure linked from the polyamide page. These were also among the user-supplied content-alignment sources. The finite-chain water count follows from joining `2n` molecules into one open chain with `2n − 1` bonds.

## Preservation and acceptance

- All 24 topics, 255 chapters, 745 quizzes, 134 structured questions and 181 worked examples remain.
- The complete loaded records for the other 23 topics match the accepted U1.1 digest.
- 214 SVG renderings match U1.1 exactly; the other four are the corrected polymer specs.
- Browser checks confirm all 24 production topic chunks load at 1366px and 390px, and the corrected polymer chapter renders.
- The diagram geometry scan flags text outside the SVG viewBox in 50 inherited diagrams, the same number as U1.1. W2 will review text fitting/wrapping and accessibility. The four corrections introduced no additional clipping.
- Single-server startup, learner ownership, public signup, Premium activation, sidebar logout, search and Wiz/voice regression coverage remain.

The user reported a live Render launch on 13 October. This release has been built and tested locally; it has not been deployed to that service here. Live admin/learner, MongoDB and provider acceptance remains with the updated deployment. Next feature work is W2.
