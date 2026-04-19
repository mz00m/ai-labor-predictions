# Design System — jobsdata.ai

## Product Context
- **What this is:** Labor market signals dashboard tracking AI's impact on employment through prediction graphs, task visualizers, and research evidence
- **Who it's for:** Funders, researchers, policymakers, journalists, curious people following AI economics
- **Space/industry:** AI labor economics, data journalism, research dashboards
- **Project type:** Data-heavy editorial site with interactive assessment tool

## Aesthetic Direction
- **Direction:** Bold editorial with playful personality
- **Decoration level:** Intentional — subtle background treatments (gradient orbs, grid patterns), meaningful animations, easter eggs
- **Mood:** Authoritative but alive. The site should feel like a carefully built research tool that rewards curiosity. Stripe's clarity meets editorial confidence meets hidden delight.
- **Personality elements:** 50+ microinteractions, Konami easter egg, ChatbotBuddy, SplitFlapWord ticker, spring/pop/burst animations on assessment pages. These are features, not decoration. Preserve them.

## Typography

### Font Stack
- **Primary (body, UI, labels):** Inter via `var(--font-inter)` — Tailwind class: `font-sans`
- **Editorial (H1 headings only):** Source Serif 4 via `var(--font-serif)` — Tailwind class: `font-serif`
- **Data/alternate body:** DM Sans via `var(--font-dm)` — Tailwind class: `font-dm`
- **Code/monospace:** DM Mono via `var(--font-mono)` — Tailwind class: `font-mono`
- **Loading:** Next.js font optimization with CSS variable bindings in `layout.tsx`

### Font Roles — Consistency Rules
- **H1 page titles:** Source Serif 4 (`font-serif`), used sparingly for the single page heading. Never use inline `style={{ fontFamily }}` — always use the Tailwind `font-serif` class.
- **H2 section headings:** Inter (`font-sans`), `font-bold` (not `font-extrabold` — reserve extrabold for the homepage hero only)
- **Body text:** Inter, `text-base` (13px) to `text-prose` (17px) depending on context
- **Data labels, captions:** Inter or DM Sans, `text-sm` (12px) or `text-xs` (11px)
- **Monospace (code, data):** DM Mono, `font-mono`

### Type Scale (from tailwind.config.ts)
| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `3xs` | 9px | 1.4 | Micro labels |
| `2xs` | 10px | 1.4 | Badges, pill text |
| `xs` | 11px | 1.45 | Captions, footnotes |
| `sm` | 12px | 1.5 | Small labels, metadata |
| `base` | 13px | 1.6 | Default body |
| `md` | 14px | 1.6 | Slightly larger body |
| `lg` | 15px | 1.6 | Card body text |
| `xl` | 16px | 1.5 | Prominent body |
| `prose` | 17px | 1.6 | Long-form reading |
| `2xl` | 18px | 1.4 | Subheadings |
| `heading-sm` | 20px | 1.45 | Small section headings |
| `3xl` | 22px | 1.3 | — |
| `heading` | 24px | 1.35 | Standard section headings |
| `heading-lg` | 26px | 1.3 | — |
| `4xl` | 28px | 1.2 | — |
| `heading-xl` | 30px | 1.25 | Large section headings |
| `heading-2xl` | 32px | 1.2 | — |
| `title-sm` | 34px | 1.2 | — |
| `5xl` | 36px | 1.15 | Page titles |
| `title` | 40px | 1.15 | — |
| `6xl` | 44px | 1.1 | — |
| `7xl` | 56px | 1.05 | Hero display |

**Known issue:** The naming is non-monotonic (`title-sm` at 34px is larger than `heading-xl` at 30px). Prefer the named tokens (`heading-sm`, `heading`, `heading-lg`, `heading-xl`) for section headings, and `5xl`+ for page titles. Avoid using arbitrary `text-[42px]` — use the nearest scale token instead.

### H1 Sizing Standard
All page H1s should use a consistent pattern:
- **Standard pages:** `text-5xl sm:text-6xl font-extrabold font-serif` (36px / 44px)
- **Homepage hero:** `text-[42px] sm:text-7xl font-extrabold` (the one exception — homepage gets its own treatment)
- **Assessment pages:** `text-heading-xl sm:text-5xl font-bold font-serif` (30px / 36px — slightly smaller, cleaner weight)

Do NOT mix: `text-4xl` on one page, `text-5xl sm:text-6xl` on another, custom `text-[42px]` on a third. Pick the standard and apply it.

## Color

### Approach: Restrained with semantic meaning
Color earns its place. The base palette is minimal — most of the site is navy text on white with one indigo accent. Section-specific accent colors on the homepage create identity without chaos.

### Core Palette (from globals.css `:root`)
| Token | Hex | Usage |
|-------|-----|-------|
| `--foreground` | `#1a1a1a` | Body text |
| `--background` | `#ffffff` | Page background |
| `--heading` | `#2E3650` | Headings, dark text |
| `--accent` | `#5C61F6` | Primary accent (indigo) — links, buttons, highlights |
| `--accent-text` | `#4F52D4` | Darker accent for text on light backgrounds |
| `--accent-light` | `#eef0ff` | Accent tint for backgrounds |
| `--highlight` | `#F66B5C` | Coral highlight — sparingly, for emphasis |
| `--muted` | `#6b7280` | Secondary text |
| `--muted-light` | `#9ca3af` | Tertiary text, placeholders |
| `--muted-lighter` | `#d1d5db` | Borders, dividers |

### Signal Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--signal-positive` | `#22c55e` | Good / up / growth |
| `--signal-negative` | `#ef4444` | Bad / down / risk |
| `--signal-warning` | `#f59e0b` | Caution / mixed |
| `--signal-positive-strong` | `#16a34a` | Strong positive emphasis |
| `--signal-negative-strong` | `#dc2626` | Strong negative emphasis |
| `--signal-positive-muted` | `#10B981` | Subtle positive |
| `--signal-warning-muted` | `#d97706` | Subtle warning |

### Section Accent Colors (homepage only)
These give each section its identity on the homepage. Use them ONLY on the homepage SectionBar components and their corresponding watermark icons.
| Section | Hex |
|---------|-----|
| Task Visualizer | `#3ECFAE` |
| Predictions | `#6B7BF7` |
| Demand Elasticity | `#34D399` |
| J-Curve | `#F7C96B` |
| Productivity | `#3B4494` |
| History | `#9A9AAF` |
| Signals | `#F26D6D` |

### Scorecard Score Bands
| Band | Hex | Usage |
|------|-----|-------|
| Getting Started | `#94a3b8` | Low exposure |
| Building Momentum | `#5C61F6` | Moderate exposure |
| AI-Powered | `#7c3aed` | High exposure |
| AI-Native | `#0891b2` | Very high exposure |

### Border Colors (from Tailwind config)
| Token | Value | Usage |
|-------|-------|-------|
| `border-divider` | `rgba(0,0,0,0.04)` | Subtle section dividers |
| `border-card` | `rgba(0,0,0,0.06)` | Card borders |
| `border-strong` | `rgba(0,0,0,0.08)` | Emphasized borders |

### Color Rules
- Never use color opacity via string concatenation (`color + "30"`). Use Tailwind opacity utilities (`bg-accent/30`) or CSS `color-mix()`.
- Assessment pages use `border-gray-100`, `border-gray-200`, `bg-gray-50` from Tailwind defaults — this is fine, keep it consistent within the assessment section.
- Signal colors are semantic. Do not use red for decoration or green for branding.

## Spacing

### Base Unit: 4px (Tailwind default)
The Tailwind spacing scale applies. No custom spacing tokens needed.

### Density: Comfortable
The site is data-dense but not cramped. Generous whitespace between sections, tighter within cards.

### Container Widths — Consistency Standard
| Context | Width | Tailwind Class |
|---------|-------|---------------|
| Main content (most pages) | 1152px | `max-w-6xl` |
| Long-form reading (explainers) | 740px | `max-w-[740px]` |
| Assessment pages | 1152px | `max-w-6xl` |
| Scorecard pages | 768px | `max-w-3xl` |

**Do NOT use** `max-w-[960px]` — this is an outlier. History page should be normalized to `max-w-[740px]` to match other explainer pages.

### Container Padding
Standard: `px-6 sm:px-10` (matches footer and homepage pattern)

### Spacing Direction
Use `mt-*` (margin-top) for vertical rhythm between sections, not `mb-*`. This creates a consistent "push down" pattern where each section declares its distance from the element above it.

**Known issue:** Some explainer pages use `mb-*` spacing. Normalize to `mt-*` for new work.

## Layout
- **Approach:** Grid-disciplined
- **Grid:** Single-column for content pages, responsive grid for homepage tiles and prediction cards
- **Max content width:** `max-w-6xl` (1152px) for dashboard pages, `max-w-[740px]` for reading pages
- **Border radius hierarchy:**
  - Cards: `rounded-lg` (8px) — standard across the site
  - Scorecard cards: `rounded-2xl` (16px) — larger for the hero scorecard treatment
  - Buttons: `rounded-lg` (8px)
  - Inputs: `rounded-lg` (8px)
  - Pills/badges: `rounded-full`
  - Never use `rounded-xl` (12px) on cards — pick `rounded-lg` or `rounded-2xl`, not in between

## Motion
- **Approach:** Intentional — motion is personality, not decoration
- **Global transition disable:** `* { transition: none; }` in globals.css prevents accidental CSS transitions. Interactive elements selectively re-enable transitions.
- **Easing:** Spring physics for assessment interactions (`spring-press`, `pill-pop`, `particle-burst`), CSS ease-out for general UI
- **Duration:** Micro interactions 100-200ms, entrance animations 300-500ms, scroll reveals 400-600ms
- **`prefers-reduced-motion`:** Must be respected. All animation classes should have reduced-motion fallbacks.
- **Rule:** Never remove existing animations without explicit approval. They are features.

## Assessment Page Patterns (Reference Standard)
The assessment pages represent the cleanest, most consistent design treatment on the site. Use these patterns as the reference when building new pages:

- **Container:** `max-w-6xl mx-auto px-6 sm:px-10`
- **Cards:** `bg-gray-50 border border-gray-100 rounded-lg p-6`
- **Buttons (primary):** `bg-accent hover:bg-[#4F52D4] text-white font-semibold px-7 py-3 rounded-lg`
- **Buttons (secondary):** `border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg`
- **Inputs:** `bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:border-accent focus:ring-2 focus:ring-accent/20`
- **H1:** `font-serif font-bold` with appropriate size token
- **Section headings:** `font-sans font-bold` (Inter)
- **Animations:** Spring-based micro-interactions on interactive elements. Subtle, physics-driven, not flashy.

## Known Inconsistencies — All Resolved
All 7 original inconsistencies have been fixed:

1. ~~H1 sizing chaos~~ — Fixed 2026-04-19. All standard pages now use `text-5xl sm:text-6xl font-extrabold font-serif`. Homepage hero remains intentionally unique.
2. ~~Serif usage inconsistent~~ — Fixed 2026-04-18. Inline `fontFamily` replaced with `font-serif` class.
3. ~~Inline font-family styles~~ — Fixed 2026-04-19. Future and Occupation Exposure subtitle paragraphs migrated. Assessment report pages retain inline styles (separate design system).
4. ~~Section heading weight mismatch~~ — Fixed 2026-04-18. Standardized on `font-bold` for section headings.
5. ~~Container width outlier~~ — Fixed 2026-04-18. History page normalized to `max-w-[740px]`.
6. ~~Spacing direction mixed~~ — Fixed 2026-04-18. Explainer pages converted to `mt-*`.
7. ~~Color opacity via string concatenation~~ — Fixed 2026-04-18. Migrated to `color-mix()`.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-18 | Initial design system created | Codified existing patterns from consistency audit. Assessment pages serve as reference standard. No redesign — consistency enforcement only. |
| 2026-04-19 | H1 sizing normalized site-wide | All standard page H1s use `text-5xl sm:text-6xl font-extrabold font-serif`. Predictions, Task Visualizer, Reading List, Future, Occupation Exposure all aligned. |
