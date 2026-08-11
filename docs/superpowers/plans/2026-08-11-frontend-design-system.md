# Frontend Design System (Static HTML) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Tailwind CDN + export-class noise with CSS tokens, `@layer components`, and a single compiled `dist/styles.css` across all static pages.

**Architecture:** Tokens live in `:root` inside `src/styles.css`. `tailwind.config.js` maps theme values to those CSS variables and scans all HTML/JS. Component classes (`.btn`, `.card`, etc.) wrap repeated UI. Pages drop CDN/inline config and link the built stylesheet. Layout utilities stay in HTML; brand chrome moves to tokens/components.

**Tech Stack:** HTML5, Tailwind CSS 3.4.13, PostCSS, Autoprefixer, vanilla JS (`js/components.js`), static multi-locale folders (`/`, `es/`, `fr/`, `it/`).

## Global Constraints

- Stay static HTML — no SSG, React, Astro, or Vite app rewrite
- Do not unify i18n templates; keep `en/es/fr/it` HTML copies
- Do not change copy, section layout, Fillout URLs, or GTM IDs
- Partials remain header/footer only (class-level components, not new HTML partials)
- Primary brand color stays `#2B30A3` (primary-500)
- Fonts stay Google Sans + Instrument Serif
- Verification = `npm run build` + ripgrep gates (no unit-test framework in repo)
- Spec: `docs/superpowers/specs/2026-08-11-frontend-design-system-design.md`

## File map

| File | Responsibility |
|------|----------------|
| `src/styles.css` | `:root` tokens, base scroll/font rules, `@layer components` |
| `tailwind.config.js` | theme → `var(--*)`, content globs, drop oklab safelist |
| `dist/styles.css` | built output (generated, commit if repo currently tracks it) |
| `components/header.html` | `.site-header`, `.nav-link`, `.btn` |
| `components/footer.html` | `.container-page`, cleaned classes |
| `scripts/strip-export-noise.mjs` | one-shot/mechanical HTML cleanup helper |
| `*.html`, `es|fr|it/*.html` | stylesheet link, noise strip, component class swaps |
| `js/components.js` | remove injected style block once CSS owns scroll/font tracking |
| `REPOSITORY_GUIDE.md` | fix Inter → Google Sans, document DS path |

---

### Task 1: Token foundation + Tailwind theme mapping

**Files:**
- Modify: `src/styles.css`
- Modify: `tailwind.config.js`
- Generate: `dist/styles.css` via build

**Interfaces:**
- Consumes: existing palette values from current `tailwind.config.js`
- Produces: CSS custom properties `--color-*`, `--font-*`, `--radius-*`, `--shadow-*`, `--container-max`, `--header-offset`, `--focus-ring`; Tailwind theme keys `primary/secondary/neutral/gray/success/error`, `fontFamily.google_sans|heading|instrument`, `boxShadow.sm|md|cta`, `borderRadius` mapped to vars

- [ ] **Step 1: Replace `src/styles.css` with tokens + base rules**

Write the full file (fonts stay loaded via existing HTML `<link>` tags; do not `@import` fonts after `@tailwind`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Primary */
  --color-primary-50: #E4E5F4;
  --color-primary-100: #D0D1EB;
  --color-primary-200: #A7A9D9;
  --color-primary-300: #7D80C7;
  --color-primary-400: #5458B5;
  --color-primary-500: #2B30A3;
  --color-primary-600: #222682;
  --color-primary-700: #1A1D62;
  --color-primary-800: #111341;
  --color-primary-900: #090A21;

  /* Secondary (slate) */
  --color-secondary-50: #f8fafc;
  --color-secondary-100: #f1f5f9;
  --color-secondary-200: #e2e8f0;
  --color-secondary-300: #cbd5e1;
  --color-secondary-400: #94a3b8;
  --color-secondary-500: #64748b;
  --color-secondary-600: #475569;
  --color-secondary-700: #334155;
  --color-secondary-800: #1e293b;
  --color-secondary-900: #0f172a;

  /* Neutral (zinc) */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f4f4f5;
  --color-neutral-200: #e4e4e7;
  --color-neutral-300: #d4d4d8;
  --color-neutral-400: #a1a1aa;
  --color-neutral-500: #71717a;
  --color-neutral-600: #52525b;
  --color-neutral-700: #3f3f46;
  --color-neutral-800: #27272a;
  --color-neutral-900: #18181b;

  /* Gray */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;

  /* Success */
  --color-success-50: #CDE7CF;
  --color-success-100: #BCDBBD;
  --color-success-200: #98C49A;
  --color-success-300: #75AC78;
  --color-success-400: #519555;
  --color-success-500: #2E7A4F;
  --color-success-600: #256428;
  --color-success-700: #1C4B1E;
  --color-success-800: #123214;
  --color-success-900: #09190A;

  /* Error */
  --color-error-50: #fef2f2;
  --color-error-100: #fee2e2;
  --color-error-200: #fecaca;
  --color-error-300: #fca5a5;
  --color-error-400: #f87171;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  --color-error-700: #b91c1c;
  --color-error-800: #991b1b;
  --color-error-900: #7f1d1d;

  /* Semantic */
  --color-bg: #ffffff;
  --color-fg: var(--color-neutral-900);
  --color-muted: var(--color-secondary-600);
  --color-border: var(--color-gray-200);
  --color-focus: var(--color-primary-300);

  /* Typography */
  --font-sans: 'Google Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
  --font-heading: var(--font-sans);
  --font-serif: 'Instrument Serif', ui-serif, Georgia, Cambria, 'Times New Roman', serif;
  --tracking-heading: -0.025em;

  --text-hero: 34px;
  --text-hero-lg: 56px;
  --leading-hero: 40px;
  --leading-hero-lg: 62px;
  --text-h1: 28px;
  --text-h1-lg: 34px;
  --leading-h1: 36px;
  --leading-h1-lg: 40px;
  --text-h2: 21px;
  --text-h2-lg: 28px;
  --leading-h2: 28px;
  --leading-h2-lg: 34px;
  --text-h3: 18px;
  --text-body: 16px;
  --text-sm: 14px;

  /* Shape / elevation / layout */
  --radius-sm: 2px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-cta: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --container-max: 72rem;
  --space-section-y: 3rem;
  --space-section-y-lg: 4rem;
  --header-offset: 100px;
  --focus-ring: var(--color-focus);
}

@layer base {
  html {
    scroll-padding-top: var(--header-offset);
  }

  #works,
  #pricing {
    scroll-margin-top: var(--header-offset);
  }
}

/* Keep utility class names used in HTML */
.font-heading {
  font-family: var(--font-heading);
  letter-spacing: var(--tracking-heading);
}

.font-instrument {
  font-family: var(--font-serif);
  letter-spacing: 0;
}

.font-google_sans {
  font-family: var(--font-sans);
}
```

- [ ] **Step 2: Rewrite `tailwind.config.js` to map theme → CSS vars**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './es/**/*.html',
    './fr/**/*.html',
    './it/**/*.html',
    './components/**/*.html',
    './js/**/*.js',
  ],
  theme: {
    extend: {
      borderRadius: {
        DEFAULT: 'var(--radius-sm)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        '2xl': 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        cta: 'var(--shadow-cta)',
      },
      maxWidth: {
        '6xl': 'var(--container-max)',
      },
      fontFamily: {
        google_sans: ['var(--font-sans)'],
        heading: ['var(--font-heading)'],
        instrument: ['var(--font-serif)'],
      },
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        secondary: {
          50: 'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
          800: 'var(--color-secondary-800)',
          900: 'var(--color-secondary-900)',
        },
        neutral: {
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },
        gray: {
          50: 'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
        },
        success: {
          50: 'var(--color-success-50)',
          100: 'var(--color-success-100)',
          200: 'var(--color-success-200)',
          300: 'var(--color-success-300)',
          400: 'var(--color-success-400)',
          500: 'var(--color-success-500)',
          600: 'var(--color-success-600)',
          700: 'var(--color-success-700)',
          800: 'var(--color-success-800)',
          900: 'var(--color-success-900)',
        },
        error: {
          50: 'var(--color-error-50)',
          100: 'var(--color-error-100)',
          200: 'var(--color-error-200)',
          300: 'var(--color-error-300)',
          400: 'var(--color-error-400)',
          500: 'var(--color-error-500)',
          600: 'var(--color-error-600)',
          700: 'var(--color-error-700)',
          800: 'var(--color-error-800)',
          900: 'var(--color-error-900)',
        },
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 3: Build and verify tokens land in output**

Run:

```bash
npm run build
rg -n --color=never "color-primary-500|--header-offset|font-heading" dist/styles.css | head
```

Expected: build exits 0; `dist/styles.css` contains `--color-primary-500` and `.font-heading`.

- [ ] **Step 4: Commit**

```bash
git add src/styles.css tailwind.config.js dist/styles.css
git commit -m "$(cat <<'EOF'
Add CSS design tokens and map Tailwind theme to variables.

EOF
)"
```

---

### Task 2: Component layer in CSS

**Files:**
- Modify: `src/styles.css` (append `@layer components` after `:root` / base)

**Interfaces:**
- Consumes: tokens from Task 1
- Produces: classes `.container-page`, `.section`, `.section-tight`, `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-on-dark`, `.input`, `.input-error`, `.label`, `.field-error`, `.card`, `.heading-hero`, `.heading-1`, `.heading-2`, `.heading-3`, `.badge`, `.pricing-tab`, `.pricing-tab-active`, `.nav-link`, `.legal-prose`, `.site-header`

- [ ] **Step 1: Append component layer to `src/styles.css`**

Add after the font utility blocks:

```css
@layer components {
  .container-page {
    @apply mx-auto px-4;
    max-width: var(--container-max);
  }

  .section {
    padding-top: var(--space-section-y);
    padding-bottom: var(--space-section-y);
  }

  @media (min-width: 768px) {
    .section {
      padding-top: var(--space-section-y-lg);
      padding-bottom: var(--space-section-y-lg);
    }
  }

  .section-tight {
    @apply py-5;
  }

  .site-header {
    @apply sticky top-0 z-20 border-b border-gray-200 backdrop-blur;
    background-color: rgb(255 255 255 / 0.8);
  }

  .nav-link {
    @apply text-sm leading-5 hover:text-primary-500 transition-colors;
  }

  .btn {
    @apply inline-flex items-center justify-center gap-2 text-sm leading-5 px-4 py-3 transition-colors;
    border-radius: var(--radius-full);
  }

  .btn-primary {
    @apply text-zinc-50 bg-primary-500;
    box-shadow: var(--shadow-md);
  }

  .btn-primary:hover {
    @apply bg-primary-600;
  }

  .btn-secondary {
    @apply bg-white border border-gray-200 shadow-sm;
  }

  .btn-secondary:hover {
    @apply bg-gray-50;
  }

  .btn-on-dark {
    @apply text-gray-900 font-semibold bg-white;
    box-shadow: var(--shadow-md);
  }

  .btn-on-dark:hover {
    @apply bg-gray-50;
  }

  .label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }

  .input {
    @apply w-full border border-gray-200 bg-white px-3 py-2 text-sm;
    border-radius: var(--radius-md);
  }

  .input:focus {
    outline: none;
    border-color: var(--focus-ring);
    box-shadow: 0 0 0 1px var(--focus-ring);
  }

  .input-error {
    @apply border-red-500;
  }

  .field-error {
    @apply text-sm text-red-600 mt-1;
  }

  .card {
    @apply bg-white border border-gray-200 border-solid p-5 md:p-6;
    border-radius: var(--radius-lg);
  }

  .heading-hero {
    @apply font-heading font-medium;
    font-size: var(--text-hero);
    line-height: var(--leading-hero);
  }

  @media (min-width: 768px) {
    .heading-hero {
      font-size: var(--text-hero-lg);
      line-height: var(--leading-hero-lg);
    }
  }

  .heading-1 {
    @apply font-heading font-medium;
    font-size: var(--text-h1);
    line-height: var(--leading-h1);
  }

  @media (min-width: 768px) {
    .heading-1 {
      font-size: var(--text-h1-lg);
      line-height: var(--leading-h1-lg);
    }
  }

  .heading-2 {
    @apply font-heading font-medium;
    font-size: var(--text-h2);
    line-height: var(--leading-h2);
  }

  @media (min-width: 768px) {
    .heading-2 {
      font-size: var(--text-h2-lg);
      line-height: var(--leading-h2-lg);
    }
  }

  .heading-3 {
    @apply font-heading font-medium;
    font-size: var(--text-h3);
  }

  .badge {
    @apply absolute text-gray-800 text-xs font-semibold bg-white border border-gray-200 px-3 py-1 border-solid;
    border-radius: var(--radius-full);
  }

  .pricing-tab {
    @apply text-xs md:text-sm leading-4 md:leading-5 border border-transparent px-4 py-3 cursor-pointer transition-all duration-200;
    border-radius: var(--radius-full);
  }

  .pricing-tab-active {
    @apply text-neutral-50 border-transparent;
    background-image: linear-gradient(
      rgb(46, 122, 79) 0%,
      color-mix(in oklab, var(--color-success-500) 80%, transparent) 100%
    );
  }

  .legal-prose {
    @apply text-base leading-6 text-zinc-900;
  }

  .legal-prose h1 {
    @apply heading-1 mb-4;
  }
}
```

- [ ] **Step 2: Rebuild and verify component selectors exist**

Run:

```bash
npm run build
rg -n "^\.btn-primary|^\.site-header|^\.heading-hero|^\.container-page" dist/styles.css | head
```

Expected: each selector appears in compiled CSS.

- [ ] **Step 3: Commit**

```bash
git add src/styles.css dist/styles.css
git commit -m "$(cat <<'EOF'
Add design-system component classes for buttons, forms, and type.

EOF
)"
```

---

### Task 3: Pilot — wire `index.html` to compiled CSS

**Files:**
- Modify: `index.html` (head only in this task)

**Interfaces:**
- Consumes: `dist/styles.css` from Tasks 1–2
- Produces: root EN homepage no longer depends on CDN Tailwind

- [ ] **Step 1: Replace CDN + inline config in `index.html` head**

In `index.html` `<head>`, remove:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

and the entire following `<script> tailwind.config = { ... }; </script>` block (ends just before the `validateForm` script).

Keep Google Fonts `<link>`s and `js/components.js`.

Insert after favicon/fonts links:

```html
  <link rel="stylesheet" href="dist/styles.css">
```

Ensure order is: fonts → `dist/styles.css` → `js/components.js` → page scripts.

- [ ] **Step 2: Verify gates**

Run:

```bash
npm run build
rg -n "cdn\.tailwindcss|tailwind\.config\s*=" index.html || true
rg -n 'href="dist/styles.css"' index.html
```

Expected: first rg prints nothing (or only `|| true` empty); second finds the stylesheet link.

- [ ] **Step 3: Manual smoke**

Open `index.html` via local static server (not `file://` if header fetch needed):

```bash
npx --yes serve -l 4173 .
```

Check `/` : header loads, primary buttons still blue `#2B30A3`, hero grid intact.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
Switch homepage from Tailwind CDN to compiled design-system CSS.

EOF
)"
```

---

### Task 4: Migrate header + footer to component classes

**Files:**
- Modify: `components/header.html`
- Modify: `components/footer.html`
- Modify: `js/components.js` (remove duplicate injected scroll/font styles)

**Interfaces:**
- Consumes: `.site-header`, `.nav-link`, `.btn`, `.btn-primary`, `.container-page`
- Produces: shared chrome markup that works for all pages still using `data-component`

- [ ] **Step 1: Rewrite `components/header.html`**

```html
<header class="site-header">
  <div class="container-page flex items-center justify-between py-3">
    <div class="flex items-center gap-x-2">
      <a data-nav-link="home" href="index.html">
        <img src="images/Advisor_Logo.svg" alt="International Driving Advisor" class="h-6 md:h-8 w-auto" />
      </a>
    </div>
    <nav class="hidden md:flex items-center gap-x-6 text-sm leading-5">
      <a data-nav-link="works" href="index.html#works" class="nav-link" data-i18n="nav.howItWorks">How it works</a>
      <a data-nav-link="pricing" href="index.html#pricing" class="nav-link" data-i18n="nav.pricing">Pricing</a>
      <a data-nav-link="faq" href="faq.html" class="nav-link" data-i18n="nav.faq">FAQ</a>
      <a data-nav-link="contact" href="contact.html" class="nav-link" data-i18n="nav.contact">Contact Us</a>
    </nav>
    <div class="flex items-center gap-x-4">
      <div class="relative" id="language-selector">
        <button type="button" id="language-toggle" class="flex items-center gap-x-1 text-sm text-gray-700 hover:text-primary-500 transition-colors px-2 py-1 rounded hover:bg-gray-100">
          <span id="current-lang-flag">🇬🇧</span>
          <span id="current-lang-code" class="hidden sm:inline">EN</span>
          <svg class="w-4 h-4 transition-transform" id="language-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div id="language-dropdown" class="hidden absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
          <a href="#" data-lang="en" data-lang-path="" class="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-500">
            <span>🇬🇧</span><span>English</span>
          </a>
          <a href="#" data-lang="es" data-lang-path="/es" class="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-500">
            <span>🇪🇸</span><span>Español</span>
          </a>
          <a href="#" data-lang="fr" data-lang-path="/fr" class="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-500">
            <span>🇫🇷</span><span>Français</span>
          </a>
          <a href="#" data-lang="it" data-lang-path="/it" class="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-500">
            <span>🇮🇹</span><span>Italiano</span>
          </a>
        </div>
      </div>
      <a data-nav-link="cta" href="https://idpcheckout.fillout.com/t/2ESX5foenCus?source=header_button" class="btn btn-primary px-4 py-2" data-i18n="nav.getYourIdp">
        Get Your Translation
        <img src="images/icons/icon-3.svg" alt="Icon" class="h-4 w-4" style="filter: brightness(0) invert(1);" />
      </a>
    </div>
  </div>
</header>
```

- [ ] **Step 2: Rewrite `components/footer.html` (structure + copy unchanged)**

```html
<footer>
  <div class="container-page grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-8 pt-16 pb-10">
    <div class="md:col-span-4">
      <div class="flex items-center gap-x-2 mb-4">
        <img src="images/Advisor_Logo.svg" alt="International Driving Advisor" class="h-6 md:h-8 w-auto" />
      </div>
      <p class="text-slate-600 text-sm leading-5">Your trusted partner for international driving translations.</p>
      <p class="text-slate-600 text-sm leading-5">GoDrive Global Pte. Ltd</p>
      <p class="text-slate-600 text-sm leading-5">UEN: 202529095Z</p>
      <p class="text-slate-600 text-sm leading-5">60 PAYA LEBAR ROAD, #11-03, PAYA LEBAR SQUARE, SINGAPORE 409051</p>
    </div>

    <div class="text-sm leading-5 md:col-span-2">
      <p class="font-semibold text-lg mb-4">Support</p>
      <div class="space-y-3">
        <a href="mailto:hello@internationaldrivingadvisor.com" class="flex items-center gap-x-2 text-slate-600 hover:text-primary-500 transition-colors">
          <img src="images/icons/icon-17.svg" alt="Icon" class="h-4 w-4" />
          hello@internationaldrivingadvisor.com
        </a>
        <a href="tel:+6598274856" class="flex items-center gap-x-2 text-slate-600 hover:text-primary-500 transition-colors">
          <img src="images/icons/icon-18.svg" alt="Icon" class="h-4 w-4" />
          +65 9827 4856
        </a>
      </div>
    </div>

    <div class="text-sm leading-5 md:col-span-2 md:col-start-9">
      <p class="font-semibold text-lg mb-4">Company</p>
      <div class="space-y-2">
        <a href="about.html" class="text-slate-600 hover:text-primary-500 block transition-colors">About Us</a>
        <a href="contact.html" class="text-slate-600 hover:text-primary-500 block transition-colors">Contact</a>
        <a href="faq.html" class="text-slate-600 hover:text-primary-500 block transition-colors">FAQ</a>
      </div>
    </div>

    <div class="text-sm leading-5 md:col-span-3 md:col-start-11">
      <p class="font-semibold text-lg mb-4">Legal</p>
      <div class="space-y-2">
        <a href="privacy.html" class="text-slate-600 hover:text-primary-500 block transition-colors">Privacy Policy</a>
        <a href="cookies.html" class="text-slate-600 hover:text-primary-500 block transition-colors">Cookie Policy</a>
        <a href="terms.html" class="text-slate-600 hover:text-primary-500 block transition-colors">Terms & Conditions</a>
        <a href="legal.html" class="text-slate-600 hover:text-primary-500 block transition-colors">Legal Disclaimer</a>
        <a href="refund.html" class="text-slate-600 hover:text-primary-500 block transition-colors">Refund Policy</a>
        <a href="shipping.html" class="text-slate-600 hover:text-primary-500 block transition-colors">Shipping & Delivery</a>
      </div>
    </div>
  </div>

  <div class="mt-8">
    <div class="container-page py-6">
      <div class="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center gap-4">
        <p class="text-slate-600 text-xs">© 2025 International Driving Advisor. All rights reserved.</p>
        <p class="text-slate-600 text-xs">Legal Disclaimer: The document from International Driving Advisor is a private translation of your national driver’s license — not a government-issued IDP and does not grant legal driving rights. It is also not affiliated with or endorsed by American Automobile Association (AAA) or any official licensing authority. When driving abroad, always carry your original license. </p>
      </div>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Remove duplicate style injection from `js/components.js`**

Delete the block that creates `#smooth-scroll-styles` and injects `scroll-padding-top` / `.font-heading` letter-spacing (CSS now owns this). Keep header/footer fetch + i18n + language selector logic unchanged.

- [ ] **Step 4: Rebuild + smoke header/footer on index**

```bash
npm run build
rg -n "oklab|caret-transparent" components/header.html components/footer.html || true
```

Expected: no matches. Browser: sticky header, CTA primary, footer links work, language dropdown still toggles.

- [ ] **Step 5: Commit**

```bash
git add components/header.html components/footer.html js/components.js dist/styles.css
git commit -m "$(cat <<'EOF'
Migrate header and footer to design-system component classes.

EOF
)"
```

---

### Task 5: Wire all remaining HTML pages off CDN

**Files:**
- Modify: every `*.html` under `/`, `es/`, `fr/`, `it/` except already-done `index.html`
- Create: `scripts/swap-tailwind-cdn.mjs` (helper)

**Interfaces:**
- Consumes: compiled CSS path convention — root pages `dist/styles.css`, locale pages `../dist/styles.css`
- Produces: zero `cdn.tailwindcss.com` / inline `tailwind.config =` in HTML

- [ ] **Step 1: Add swap script `scripts/swap-tailwind-cdn.mjs`**

```js
import fs from 'node:fs';
import path from 'node:path';

const roots = ['.', 'es', 'fr', 'it'];
const cdnRe = /<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>\s*/i;
const configRe = /<script>\s*tailwind\.config\s*=\s*\{[\s\S]*?\};\s*<\/script>\s*/i;

function walk(dir) {
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.html'))
    .map((f) => path.join(dir, f));
}

for (const root of roots) {
  for (const file of walk(root)) {
    let html = fs.readFileSync(file, 'utf8');
    if (!cdnRe.test(html) && !configRe.test(html)) continue;

    const cssHref = root === '.' ? 'dist/styles.css' : '../dist/styles.css';
    const link = `<link rel="stylesheet" href="${cssHref}">\n`;

    html = html.replace(cdnRe, '');
    html = html.replace(configRe, '');

    if (!html.includes(`href="${cssHref}"`)) {
      if (html.includes('</title>')) {
        html = html.replace('</title>', `</title>\n  ${link}`);
      } else {
        html = html.replace('</head>', `  ${link}</head>`);
      }
    }

    fs.writeFileSync(file, html);
    console.log('updated', file);
  }
}
```

- [ ] **Step 2: Run script**

```bash
node scripts/swap-tailwind-cdn.mjs
```

Expected: logs `updated` for remaining pages (~44).

- [ ] **Step 3: Verification gates**

```bash
rg -l "cdn\.tailwindcss\.com" --glob '*.html' || true
rg -l "tailwind\.config\s*=" --glob '*.html' || true
rg -l 'href="dist/styles.css"' --glob '*.html' | wc -l
rg -l 'href="../dist/styles.css"' --glob '*.html' | wc -l
npm run build
```

Expected: first two empty; root count ≥ 12; locale count ≥ 33; build OK.

Note: `success.html` may keep a local `<style>` for keyframes — that is fine. Remove only CDN + indigo theme config; Task 7 restyles indigo classes.

- [ ] **Step 4: Commit**

```bash
git add scripts/swap-tailwind-cdn.mjs *.html es fr it dist/styles.css
git commit -m "$(cat <<'EOF'
Replace Tailwind CDN with compiled CSS on all HTML pages.

EOF
)"
```

---

### Task 6: Strip export noise + apply core component classes on marketing pages

**Files:**
- Create: `scripts/strip-export-noise.mjs`
- Modify: marketing/legal HTML (all locales), prioritizing `index.html` / `es|fr|it/index.html` then legal pages

**Interfaces:**
- Consumes: component class names from Task 2
- Produces: HTML without `oklab` / `caret-transparent` noise; CTAs/headings/cards using DS classes where patterns match

- [ ] **Step 1: Add `scripts/strip-export-noise.mjs`**

```js
import fs from 'node:fs';
import path from 'node:path';

const files = [];
for (const root of ['.', 'es', 'fr', 'it', 'components']) {
  for (const name of fs.readdirSync(root)) {
    if (name.endsWith('.html')) files.push(path.join(root, name));
  }
}

function cleanClasses(classAttr) {
  let tokens = classAttr.split(/\s+/).filter(Boolean);
  tokens = tokens.filter((t) => {
    if (t === 'caret-transparent') return false;
    if (t === 'box-border') return false;
    if (t.startsWith('outline-[oklab')) return false;
    if (t.includes('oklab(')) return false;
    // drop noop zero shadows (export artifact)
    if (t.startsWith('shadow-[rgba(0,0,0,0)_')) return false;
    if (t === 'rounded-[3.35544e+07px]') return false;
    return true;
  });

  // normalize broken full radius
  tokens = tokens.map((t) => (t === 'rounded-[3.35544e+07px]' ? 'rounded-full' : t));

  return tokens.join(' ');
}

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const next = html.replace(/class="([^"]*)"/g, (_, cls) => `class="${cleanClasses(cls)}"`);
  // also fix remaining rounded junk if quoted differently
  const fixed = next.replace(/rounded-\[3\.35544e\+07px\]/g, 'rounded-full');
  if (fixed !== html) {
    fs.writeFileSync(file, fixed);
    console.log('cleaned', file);
  }
}
```

- [ ] **Step 2: Run noise strip**

```bash
node scripts/strip-export-noise.mjs
rg -o "oklab\(|caret-transparent" --glob '*.html' | wc -l
```

Expected: count `0` (or near-zero; if any remain outside `class=`, fix manually).

- [ ] **Step 3: Manually apply DS classes on EN `index.html` key nodes**

Replace (keep surrounding structure):

| Target | After |
|--------|-------|
| Hero `<h1 ...>` | `class="heading-hero"` |
| Section titles `#works`, `#what-you-receive`, pricing, FAQ, final CTA `<h2>` | `class="heading-1 ..."` (keep ids) |
| Benefit/feature white panels | add `card` (remove duplicate border/bg/radius utilities) |
| Primary CTAs (`bg-primary-500` + rounded-full soup) | `btn btn-primary` |
| Secondary CTAs (white bordered) | `btn btn-secondary` |
| Pricing dark card white button | `btn btn-on-dark` |
| Form fields | `input` (+ `input-error` toggled by existing JS if needed) |
| Application aside panel | `card` |
| Pricing “Best value” pill | `badge` (+ keep positioning utilities `left-4 -top-3`) |
| Duration tabs | `pricing-tab` / JS adds `pricing-tab-active` |

Update pricing tab JS in `index.html` (and locale indexes) so active class toggles `pricing-tab-active` instead of inline gradient class strings if present.

- [ ] **Step 4: Mirror the same class swaps on `es/index.html`, `fr/index.html`, `it/index.html`**

Do not change translated text — only `class` attributes / shared JS class names.

- [ ] **Step 5: Legal pages shell**

On `about.html`, `contact.html`, `faq.html`, `privacy.html`, `terms.html`, `legal.html`, `cookies.html`, `refund.html`, `shipping.html` (+ locales): wrap main content container with `container-page` + `legal-prose` where it reduces duplication; ensure `<h1>` uses `heading-1`.

- [ ] **Step 6: Rebuild + gates**

```bash
npm run build
rg -o "oklab\(|caret-transparent" --glob '*.html' | wc -l
rg -n "btn btn-primary|heading-hero|site-header" index.html components/header.html | head
```

Expected: noise 0; DS classes present.

- [ ] **Step 7: Commit**

```bash
git add scripts/strip-export-noise.mjs *.html es fr it components dist/styles.css
git commit -m "$(cat <<'EOF'
Strip export class noise and adopt design-system component classes.

EOF
)"
```

---

### Task 7: Align success pages to brand tokens

**Files:**
- Modify: `success.html`, `es/success.html`, `fr/success.html`, `it/success.html`

**Interfaces:**
- Consumes: primary/neutral/success tokens + `.btn` / `.card`
- Produces: no indigo/dark-theme success UI; light brand-consistent thank-you page

- [ ] **Step 1: Restyle EN `success.html`**

Rules:
- Remove theme toggle button + darkMode JS if present
- Replace `indigo-*` → `primary-*`
- Replace `dark:*` classes → delete
- Body: `bg-gray-50 text-zinc-900 min-h-screen flex flex-col font-google_sans`
- Primary dashboard CTA: `btn btn-primary` (or `bg-primary-500` utilities)
- Keep receipt/order JS behavior and Fillout/dashboard links unchanged
- Keep fade-in keyframes in a small `<style>` block or move to `src/styles.css` as `.animate-fade-in-up` / `.animate-fade-in-down`

Add to `src/styles.css` utilities section (outside components ok):

```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fade-in-down {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
.animate-fade-in-down { animation: fade-in-down 0.6s ease-out forwards; }
```

Then remove duplicate inline keyframes from success pages.

- [ ] **Step 2: Mirror class/token changes on `es/success.html`, `fr/success.html`, `it/success.html`**

Keep locale copy; sync structure/classes with EN.

- [ ] **Step 3: Gates**

```bash
npm run build
rg -n "indigo-|dark:" success.html es/success.html fr/success.html it/success.html || true
rg -n "cdn\.tailwindcss" success.html || true
```

Expected: no indigo/dark/cdn matches.

- [ ] **Step 4: Commit**

```bash
git add success.html es/success.html fr/success.html it/success.html src/styles.css dist/styles.css
git commit -m "$(cat <<'EOF'
Align success pages with primary design tokens.

EOF
)"
```

---

### Task 8: Final verification + docs

**Files:**
- Modify: `REPOSITORY_GUIDE.md` (Design System + stack notes)
- Optional keep: `scripts/*.mjs` as maintenance tools

**Interfaces:**
- Consumes: completed Tasks 1–7
- Produces: documented source of truth for tokens/components/build

- [ ] **Step 1: Run full verification suite**

```bash
npm run build
rg -l "cdn\.tailwindcss\.com" --glob '*.html' || true
rg -l "tailwind\.config\s*=" --glob '*.html' || true
rg -o "oklab\(|caret-transparent" --glob '*.html' | wc -l
rg -n "indigo-" success.html es/success.html fr/success.html it/success.html || true
test -f dist/styles.css && rg -n "\.btn-primary|--color-primary-500" dist/styles.css | head
```

Expected all green per success criteria in spec.

- [ ] **Step 2: Visual spot-check checklist**

With `npx serve -l 4173 .` open:
- `/`, `/faq.html`, `/contact.html`, `/shipping.html`, `/success.html`
- `/es/`, `/fr/index.html` (CSS path `../dist/styles.css`)
Confirm: header sticky, primary CTA color, no unstyled flash from missing CSS, forms focus ring uses primary-300, pricing tabs still switch.

- [ ] **Step 3: Update `REPOSITORY_GUIDE.md`**

In Design System / Typography / stack sections:
- Inter → Google Sans
- Document: tokens in `src/styles.css`, build via `npm run build`, pages link `dist/styles.css`
- Note component classes list briefly
- Remove claim that CDN is used if present

- [ ] **Step 4: Commit**

```bash
git add REPOSITORY_GUIDE.md dist/styles.css
git commit -m "$(cat <<'EOF'
Document design-system tokens, components, and build path.

EOF
)"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| CSS vars token source | Task 1 |
| Tailwind theme maps to vars | Task 1 |
| content globs include locales/components/js | Task 1 |
| Remove oklab safelist | Task 1 |
| `@layer components` set | Task 2 |
| CDN → `dist/styles.css` | Tasks 3, 5 |
| Header/footer use DS classes | Task 4 |
| Strip export noise | Task 6 |
| Apply btn/card/heading/input classes | Task 6 |
| Success pages → primary tokens | Task 7 |
| Verify no CDN / build truth | Task 8 |
| Docs corrected | Task 8 |
| No i18n/SSG rewrite | Global Constraints |

## Rollback

Any task commit is independently revertable. Hardest cut is Task 5 (CDN removal). If styles break in production, revert Task 5 commit or temporarily restore CDN on the broken page only while fixing content globs.
