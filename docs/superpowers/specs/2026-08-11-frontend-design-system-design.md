# Frontend Design System Refactor (Static HTML)

**Date:** 2026-08-11  
**Status:** Approved for implementation planning  
**Scope:** Approach A — stay on static HTML + Tailwind; no SSG/framework rewrite

## Goal

Remove export noise and duplicated theme config. Introduce a single token source and reusable component classes so brand/UI changes happen in one place, while keeping the current multi-locale static HTML structure.

## Non-goals

- SSG (Eleventy/Astro) or React/Vite rewrite
- Unifying `en/es/fr/it` into one template + JSON i18n
- Layout/copy redesign
- Changing Fillout checkout flow or GTM wiring
- Expanding partials beyond existing header/footer (class-level components only)

## Current state (audit)

- ~45 HTML pages load `cdn.tailwindcss.com` with duplicated inline `tailwind.config`
- `npm run build` → `dist/styles.css` is unused
- `tailwind.config.js` `content` only scans `./*.html` (misses locales + components)
- ~70% of class attributes contain export noise (`oklab`, `caret-transparent`, `box-border`)
- Design tokens partially exist in Tailwind config but are not the runtime source of truth
- `success.html` (and locale copies) drift to indigo + dark mode
- Docs claim Inter; code uses Google Sans + Instrument Serif

## Approach

**A2 — CSS variables as token source + `@layer components`**

1. Define tokens in `:root` (`src/styles.css`)
2. Map tokens into `tailwind.config.js` theme
3. Encode repeated UI as component classes
4. Switch all pages from CDN to compiled `dist/styles.css`
5. Mechanically strip export noise and replace repeated utility soup with component classes

## Architecture

```
src/styles.css          ← tokens (:root) + @layer components
tailwind.config.js      ← theme maps to var(--*), content globs
dist/styles.css         ← built CSS (only stylesheet pages load)
*.html / es|fr|it/*     ← semantic markup + component/utility classes
components/header|footer← cleaned to use DS classes
js/components.js        ← unchanged behavior; no style injection for fonts/scroll if moved to CSS
```

### Runtime styling path

```
npm run build/dev
  → src/styles.css + content HTML/JS
  → dist/styles.css
  → <link rel="stylesheet" href="[../]dist/styles.css">
```

CDN Tailwind and inline per-page configs are removed entirely.

## Tokens

Defined once in `:root`, consumed via Tailwind theme and component CSS.

### Color

- `--color-primary-50` … `--color-primary-900` (keep existing palette; primary-500 = `#2B30A3`)
- `--color-success-*`, `--color-error-*`
- `--color-neutral-*` (zinc scale)
- `--color-gray-*` (keep for existing class usage; do not invent a third gray family)
- Semantic aliases (optional but recommended):
  - `--color-bg`, `--color-fg`, `--color-muted`, `--color-border`, `--color-focus`

### Typography

- `--font-sans` / `--font-heading` → Google Sans stack
- `--font-serif` → Instrument Serif
- Scale:
  - `--text-hero` (mobile/desktop pair via component, not raw arbitrary px in HTML)
  - `--text-h1`, `--text-h2`, `--text-h3`
  - `--text-body`, `--text-sm`
  - `--leading-*` matching current visual sizes
  - `--tracking-heading: -0.025em`

### Shape / elevation / layout

- `--radius-sm`, `--radius-md`, `--radius-lg` (2xl cards), `--radius-full`
- `--shadow-sm`, `--shadow-md`, `--shadow-cta` (replace long rgba arbitrary shadows)
- `--container-max: 72rem` (max-w-6xl)
- `--space-section-y` / `--space-section-y-lg`
- `--header-offset: 100px` (scroll-padding / sticky offset)
- `--focus-ring` → primary-300

### Tailwind mapping

```js
colors.primary[500] = 'var(--color-primary-500)'
// same pattern for all scales
fontFamily.heading = ['var(--font-heading)', ...]
borderRadius.lg / full from CSS vars
boxShadow.cta / sm / md from CSS vars
```

`content` must include:

```js
[
  './*.html',
  './es/**/*.html',
  './fr/**/*.html',
  './it/**/*.html',
  './components/**/*.html',
  './js/**/*.js',
]
```

Remove safelist patterns that only exist for `oklab`/arbitrary export values after cleanup.

## Component classes

Implemented in `@layer components` using tokens (prefer `@apply` of Tailwind utilities that themselves resolve to tokens, or plain CSS with `var(--*)`).

| Class | Role |
|-------|------|
| `.container-page` | max-width + horizontal padding |
| `.section` / `.section-tight` | vertical section rhythm |
| `.btn` | base button/link button |
| `.btn-primary` | filled primary CTA |
| `.btn-secondary` | outlined/white CTA |
| `.btn-on-dark` | light button on primary/dark surfaces |
| `.input` / `.input-error` | form controls + focus |
| `.label` / `.field-error` | form chrome |
| `.card` | bordered white panel |
| `.heading-hero` / `.heading-1` / `.heading-2` / `.heading-3` | type scale |
| `.badge` | small pills (pricing labels) |
| `.pricing-tab` / `.pricing-tab-active` | duration switcher |
| `.nav-link` | header nav anchors |
| `.legal-prose` | legal page body rhythm |
| `.site-header` | sticky, blur, border |

### HTML target pattern

```html
<!-- before -->
<a class="text-zinc-50 text-sm ... bg-primary-500 shadow-[rgba...] rounded-full">...</a>

<!-- after -->
<a class="btn btn-primary">...</a>
```

Layout utilities (`grid`, `flex`, `gap-*`, responsive columns) stay as Tailwind utilities in HTML.

## Cleanup rules

Mechanically remove or replace:

- `caret-transparent`
- redundant `box-border` (unless needed for a specific box model fix)
- `outline-[oklab(...)]` and other `oklab(...)` arbitrary colors → tokenized colors/utilities
- noop multi-layer `shadow-[rgba(0,0,0,0)_...]` → `.btn` / `--shadow-*` / drop
- `rounded-[3.35544e+07px]` → `rounded-full` or component class
- hardcoded hex focus styles in CSS (`#7D80C7`) → `--color-primary-300` / `.input:focus`
- success pages: replace indigo/slate dark-mode styling with primary/neutral tokens; drop dark theme unless product requires it later

Do not change visible layout, copy, or checkout URLs during cleanup.

## Migration order

1. **Foundation:** tokens in `src/styles.css`, Tailwind theme mapping, content globs, build smoke on `index.html`
2. **Components:** add `@layer components` classes; apply to `components/header.html` + `footer.html`
3. **Wire stylesheets:** replace CDN/inline config with `dist/styles.css` on EN pages first, then locales
4. **Cleanup pass:** strip noise; swap repeated CTA/form/card/heading patterns to component classes (script-assisted OK)
5. **Align success pages** to primary tokens
6. **Verify:** visual spot-check key pages (index, contact, faq, shipping, success) × one locale; `npm run build` succeeds; no CDN references remain

## Risk / rollback

- Risk: missing utility after CDN removal if class only existed via JIT CDN → mitigated by full content globs + visual QA
- Risk: locale path to CSS wrong (`../dist/styles.css`) → checklist in implementation
- Rollback: git revert; CDN removal is the hard cut — land foundation + one page first before mass delete

## Success criteria

- Zero `cdn.tailwindcss.com` / inline `tailwind.config =` in repo HTML
- Brand color/radius/shadow/type changeable from tokens without hunting HTML
- Primary CTAs/forms/cards/headings use component classes on migrated pages
- Export noise (`oklab`, `caret-transparent`) gone from migrated templates
- `success` pages visually consistent with primary brand tokens
- `npm run build` is the stylesheet source of truth

## Follow-ups (explicitly later)

- Approach B: SSG + single templates + JSON i18n to kill ×4 HTML duplication
- Optional partials for pricing card / FAQ item once a build step exists
