# TODOS

## Assessment: Add auth before enabling payments
**Priority:** P1 (blocks monetization)
**Effort:** M (human) / S (CC)
**What:** Add session-based authentication to assessment API routes (report, feedback, addon).
**Why:** Currently any assessment ID grants full access to the report. During the free validation phase this is acceptable, but enabling Stripe checkout without auth means anyone who guesses or intercepts an ID can access a paid report.
**How:** Generate a secret token per assessment at creation time. Store in HttpOnly cookie + DB. Validate on every API call to report/feedback/addon routes. Also upgrade assessment IDs from Date.now+Math.random (~40 bits entropy) to crypto.randomUUID (128 bits).
**Depends on:** Nothing. Must be done before re-enabling Stripe checkout.
**Added:** 2026-04-04 (eng review)

## Assessment: Create DESIGN.md for assessment pages
**Priority:** P2 (design debt)
**Effort:** S (human) / S (CC)
**What:** Create a DESIGN.md documenting the assessment design system: accent color (#5C61F6), typography (Source Serif 4 for narratives, DM Mono for numbers), spacing scale, light theme tokens (white bg, gray-50 cards), component patterns (pills, progress steps, collapsible sections).
**Why:** No design system document exists. The assessment pages use a distinct light theme from the main dark jobsdata.ai dashboard, but the design decisions are implicit in code. Without a reference, new features drift and inconsistency compounds. Pass 5 of design review rated this 3/10.
**Pros:** Prevents design drift across assessment pages, gives AI tools (Claude, Codex) a constraint document to reference, makes onboarding easier.
**Cons:** Minor upfront effort, needs maintenance as design evolves.
**Context:** Assessment uses light theme (white bg, gray-50 cards) vs main site dark theme. Accent #5C61F6 used for interactive elements. Report page uses Source Serif 4 for narrative text and DM Mono for numbers. Start page uses pill-based multi-select with industry templates. Progress page uses step pills with green/accent/gray states.
**Depends on:** Nothing.
**Added:** 2026-04-04 (design review)

## Assessment: Design inter-step feedback form for progress page
**Priority:** P2 (design debt, enables core 4-step value prop)
**Effort:** S (human) / S (CC)
**What:** Design the UI for inter-step feedback on the progress page. Users should be able to refine results between steps (e.g., after Step 1 profile completes, provide feedback before Step 2 tasks runs). The backend already supports this via `saveStepFeedback()` and feedback injection into subsequent prompts.
**Why:** The 4-step sequential architecture exists specifically to enable human-in-the-loop refinement. The feedback form was "removed from between steps" (per code comment in progress/page.tsx) but no replacement was designed. Without it, the 4-step model loses its key differentiator over a single-call approach.
**Pros:** Unlocks the core value of the 4-step architecture, gives users agency over their report, increases report quality through iterative refinement.
**Cons:** Adds complexity to the progress flow, needs careful UX to avoid interrupting momentum (optional vs required feedback).
**Context:** Backend is ready: `saveStepFeedback(targetId, { ...feedback, step, submittedAt })` in route.ts. Steps 2-4 already accept `feedback` parameter. The design question is: what does the user see between steps? A text input? Structured questions? Optional or required? How long before it auto-advances?
**Depends on:** Phase 4 (frontend error boundary) should land first so the progress page is stable.
**Added:** 2026-04-04 (design review)
