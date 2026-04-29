# Global Leopard City (مدينة الفهود العالمية)

## Overview

An inclusive scouting platform for the "Cheetahs Group" — a comprehensive management system for scouting activities supporting both typical individuals and those with special needs (people of determination). The app is in Arabic (RTL layout).

## Tech Stack

- **Frontend**: React 18 + Vite 8, TypeScript, Tailwind CSS v4, Shadcn UI
- **Routing**: Wouter
- **State/Data**: TanStack React Query
- **Icons**: Lucide React, React Icons (for social media icons)
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod + @hookform/resolvers
- **UI Primitives**: Radix UI (full suite)
- **Backend**: Express 4 (Node.js) — `server/index.js`

## Project Structure

```
src/
  App.tsx           — Root component (wraps ThemeProvider + Auth + Cart + i18n)
  main.tsx          — Entry point (registers /sw.js in production)
  pages/            — Page components
  components/       — Shared components (layout, ui, landing, auth, store, etc.)
                      Store-specific UI: CinematicHeroSlider, BentoGrid,
                      OffersTicker, Carousel3D, LiveActivityFeed.
                      layout/: ThemeToggle, GlobalSearch (Cmd+K), SeoHead,
                      PWAInstallPrompt, LanguageSwitcher.
  context/          — ThemeContext (light/dark, persists to localStorage),
                      AccessibilityContext.
  data/             — Static data files (news, products, events, ACADEMY_COURSES)
  hooks/            — Custom React hooks
  lib/              — Utilities (cn, i18n, globalSearch index, queryClient)
  assets/           — Static assets
server/
  src/              — Express backend (TypeScript) — auth, orders, academy,
                      leaderboard, /api/contact (wired from ContactForm).
public/
  manifest.webmanifest — PWA manifest (SVG icons, RTL/Arabic)
  sw.js                — Service worker (stale-while-revalidate, bypasses /api/ + /locales/)
  favicon.svg, icons/  — Brand SVG icons (192, 512, maskable)
index.html          — HTML entry (Arabic/RTL, PWA meta tags, theme-color, Cairo+Almarai)
vite.config.ts      — Vite config (requires PORT and BASE_PATH env vars)
```

## Recent Additions (April 2026)

- **Dark mode**: `ThemeContext` toggles `.dark` on `<html>`, persists `alfohod_theme`
  in localStorage, syncs the `theme-color` meta tag. `ThemeToggle` button appears
  in both desktop and mobile header bars.
- **Global search**: `GlobalSearch` (Cmd/Ctrl+K from anywhere) searches the
  inline `globalSearch.ts` index covering academy courses, games, news, events,
  and products. Inline input shown at 2xl+ in header; full search in mobile sheet.
- **PWA**: `manifest.webmanifest`, `public/sw.js` (cache-first for static, network
  bypass for `/api/` and `/locales/`), `PWAInstallPrompt` (8s defer, 7-day TTL).
  Service worker is registered in `main.tsx` only in production builds.
- **SEO**: `SeoHead` mounted in `App` updates `<title>`, description, OG/Twitter,
  canonical, and `hreflang` for all 20 supported languages on every route change.
- **Contact form**: `ContactForm` now POSTs to `/api/contact` via TanStack
  `useMutation` + `apiRequest`, with loading state and error toasts.
- **Frontend↔backend bridge & self-healing (April 29 2026)**:
  - New `user_preferences` table (one row per user) holding `language`,
    `signLanguageMode`, `theme`, `updatedAt`.
  - New API: `GET/PUT /api/preferences` (auth-required) and `GET /api/health`.
  - `usePreferencesSync` hook (mounted in `App` as `<PreferencesBridge />`)
    pulls preferences once after sign-in and applies them to i18n / a11y / theme;
    then debounces writes back to the server whenever the user changes any of
    them. Game scores (`/api/leaderboard`) and academy progress
    (`/api/academy/progress`) were already wired to the database.
  - `apiRequest` and the default query function now retry with exponential
    backoff (up to 4 attempts, capped at ~3s) on 408/425/429/5xx and on network
    errors, and pause until `navigator.onLine` returns true.
  - TanStack Query mutations use `networkMode: "offlineFirst"`, smart 4xx-skip
    retries, and resume automatically on reconnect.
  - `<ConnectionStatus />` polls `/api/health` (every 60s healthy / 5s unhealthy),
    listens to the browser online/offline events, shows toasts on transitions,
    and invalidates queries + resumes paused mutations once the server is back.
  - All of the above ships as a single Express app that serves both the API and
    the built React bundle on one port — `npm run build` then `npm start`.

## Running the App

- **Dev**: `npm run client` (sets PORT=5000 BASE_PATH=/)
- **Build**: `npm run build`
- The workflow "Start application" runs `npm run client` on port 5000.

## Key Notes

- `package.json` must have `"type": "module"` for ESM plugins to work with Vite 8.
- Vite config requires `PORT` and `BASE_PATH` environment variables.
- Social media icons (Facebook, Twitter, Instagram, LinkedIn) come from `react-icons/fa`, not lucide-react (which removed them).
- The app uses `tsconfig.json` without extending a base config (standalone).
- HTML is `lang="ar" dir="rtl"` for Arabic/RTL layout.

## Pages

Landing, About, WhatWeDo, ProgrammeDetail, News, ArticleDetail, Events, EventDetail, Regions, RegionDetail, Resources, Videos, Store, StoreCollection, ProductDetail, Checkout, Academy, AcademyCourse, AcademyLearn, GetInvolved, JoinRole, Donate, Contact, Search, Login, Register, ForgotPassword, VerifyEmail, Account, **InstructorDashboard** (/instructor)

## Instructor Dashboard

- Route: `/instructor`
- Auth-guarded: redirects to login if no user session
- Data stored in `localStorage` key `cheetahs_instructor_courses`
- Store API: `src/lib/instructorStore.ts`
- Features:
  - **Overview tab**: stats cards (total courses, enrollments, published, drafts) + performance table
  - **My Courses tab**: card grid with enrollment counts, publish/delete actions
  - **New Course tab**: full form (title, subtitle, description, category, level, pricing, skills, requirements, cover color)
  - **Lessons tab**: sidebar course selector + add/delete lessons per course (type: video/reading/quiz, duration, description)
- Header user menu includes "لوحة المدرّب" link for logged-in users

## Games Page (/games)

- Route: `/games`
- 6 fully interactive mini-games in 3 categories:
  - **كشفية (Scout):** ثقافة كشفية (trivia quiz, 8 Qs), الذاكرة الكشفية (16-card memory match), حروف مبعثرة (word scramble)
  - **عامة (General):** إكس أو (Tic-Tac-Toe 2-player), خمّن الرقم (number guessing, 7 tries), تسلسل الألوان (Simon-like color memory)
- Filter by category (كشفية / عامة) and audience (أطفال / كبار)
- Animated game cards with hover effects
- Score tracking, restart, and win/loss states per game

## Academy Data Layer (fully local, no backend)

- `src/data/academyCourses.ts` — 8 full courses with all lessons, instructors, skills, requirements
- `src/lib/academyApi.ts` — rewrote from fetch-based to local: reads from ACADEMY_COURSES, stores enrollments in localStorage (`cheetahs_academy_enrollments`)
- Courses:
  1. القيم والأخلاق الكشفية (6 lessons, free) — د. عبدالمجيد صالح
  2. العقد والربطات الكشفية (10 lessons, $15) — خالد سعيد
  3. مهارات البقاء في الطبيعة (14 lessons, $39.99) — عمر سالم
  4. حماية البيئة واستدامتها (8 lessons, free) — م. طارق علي
  5. التكنولوجيا في خدمة الكشافة (9 lessons, $19.99) — سمير حسن
  6. إدارة المشاريع التطوعية (11 lessons, free) — منى حسين
  7. أساسيات القيادة الكشفية (12 lessons, free, featured) — أحمد عبدالله
  8. الإسعافات الأولية المتقدمة (15 lessons, $29.99, featured) — د. سارة محمد
- Enrollment progress tracked per user email in localStorage

## Sign Language Accessibility (Global)

- `src/context/AccessibilityContext.tsx` — provides `mode` (normal | sign-language) via React context, persisted in localStorage
- `src/components/accessibility/FloatingSignLanguageButton.tsx` — global floating draggable button:
  - Rendered inside `App.tsx` outside of route Switch so it appears on every page
  - Drag anywhere on screen via pointer events (mouse + touch), position saved in localStorage (`sl_btn_pos`)
  - Click to open panel with: mode toggle (عادي / لغة الإشارة) + animated sign dictionary (10 Arabic words)
  - In sign-language mode: button pulses blue with "صم" badge; bottom bar shows animated emoji signs cycling per word
  - AnimatedSign component cycles through emoji frames every 600ms to simulate motion

## Internationalization (i18n) — 20 Languages

- `src/lib/i18n.ts` — i18next config with browser language detection (localStorage `alfohod_lang` → navigator → htmlTag), HTTP backend loads JSON from `/locales/{{lng}}/common.json`, normalizes to language-only (`load: "languageOnly"` + `nonExplicitSupportedLngs: true`)
- `applyLanguageDirection(code)` sets `<html dir>` and `<html lang>`; auto-fires on init + every languageChanged
- RTL languages: `ar` (default), `fa`, `he`, `ur` — others LTR
- All 20 supported: ar, en, fr, es, de, zh, ru, pt, it, tr, ja, ko, hi, id, ms, nl, fa, he, ur, sw
- Translation files: `public/locales/{lang}/common.json` — Arabic + English have full nav + academy keys; other 18 have nav core + academy.title/subtitle, missing keys fall back to English (`fallbackLng: "en"`)
- `src/components/layout/LanguageSwitcher.tsx` — dropdown with flag + native name + English label, normalizes `i18n.language` to handle `en-US`-style codes; variants: `compact` (desktop, shows label at lg+) / `icon` (mobile)
- Wired into `Header.tsx`: replaced all hardcoded Arabic nav strings with `t("nav.*")`, mobile sheet side flips on dir, dropdown text-align flips, switcher in both desktop and mobile bars
- Academy hero `h1` uses `t("academy.title", "أكاديمية عالم الفهود")` with Arabic fallback for safety
- Loaded once via `import "./lib/i18n"` in `src/main.tsx`

## Core Web Vitals Optimization (April 29 2026)

Goal: <2s global load, all images served as WebP. Achieved an estimated **20.3 MB → 1.6 MB** image payload (~92% reduction) plus aggressive code-splitting and caching.

### Image pipeline
- `scripts/convert-images-to-webp.mjs` — sharp-based converter (quality 82, effort 5). Walks `src/assets/images/`, converts every `.png/.jpg/.jpeg` to `.webp`, deletes the source, then rewrites every matching string in `src/**/*.{ts,tsx,js,jsx,css}` from `.png/.jpg` to `.webp`. Idempotent — safe to re-run.
- All 17 PNGs (about-hero, donation-impact, hero, jamboree, programme-hero, regions-abstract, service, store-banner, store-hero, video-featured, plus 7 product images) are now WebP. Largest savings: about-hero 2080KB → 256KB, service 1967KB → 218KB.
- `scripts/add-lazy-loading.mjs` — adds `loading="lazy" decoding="async"` to every `<img>` tag in `src/` that does not already have a `loading=` attr. Touched 22 component/page files.
- Hero LCP image (`src/components/landing/Hero.tsx`) overrides this with `loading="eager" fetchpriority="high"` so the browser prioritizes its download.
- Fixed `src/pages/Login.tsx` — was using a string path `/src/assets/images/hero.webp` (broken in production). Now properly imported as `loginHeroImg from "@/assets/images/hero.webp"` so Vite hashes it.

### Server (`server/index.ts` + `server/vite.ts`)
- `compression()` middleware (gzip/brotli-aware) enabled with 1KB threshold. Compresses HTML, JS, CSS, JSON, SVG, manifest. WebP/JPG/PNG are skipped (already compressed).
- `serveStatic()` rewritten with tiered Cache-Control:
  - `/assets/*` (Vite-hashed JS/CSS/images): `immutable, max-age=31536000` (1 year)
  - `/sw.js` + `/manifest.webmanifest`: `no-cache, must-revalidate` (instant updates)
  - Everything else (favicon, locale JSON, icons): `max-age=86400` (1 day) with ETag
  - `index.html`: `no-cache, no-store, must-revalidate`
- Replaced legacy `require("express")` with proper `await import("express")` for ESM compatibility.

### Vite (`vite.config.ts`)
- Build target `es2020`, source maps off, compressed-size reporting off (faster builds).
- `assetsInlineLimit: 4096` — inlines small assets to save HTTP roundtrips.
- `manualChunks` splits `node_modules` into named vendor bundles for parallel/cacheable downloads:
  - `react-vendor`, `query-vendor`, `ui-vendor` (Radix + cmdk + vaul), `motion-vendor`, `i18n-vendor`, `charts-vendor` (recharts + d3), `icons-vendor`, `forms-vendor` (zod + react-hook-form), and a catch-all `vendor`.
- Bumped `chunkSizeWarningLimit` to 700 to suppress noise from sensible bundles.

### App shell (`src/App.tsx`)
- Switched from eager imports of every page to `React.lazy()` for all 32 secondary routes. Only `LandingPage` is eager (it's the entry route).
- `<Suspense fallback={<RouteFallback/>}>` wraps the `<Switch>` with a centered spinner (`data-testid="status-route-loading"`).
- Fixed a pre-existing bug: the in-component `new QueryClient()` was a fresh instance with no retry/network-mode config. Now imports the configured `queryClient` from `@/lib/queryClient`, restoring the self-healing behavior to all queries/mutations.

### `index.html`
- Added `dns-prefetch` for `images.unsplash.com` (used by news/articles/store).
- Async font loading via `media="print" onload="this.media='all'"` pattern with `<noscript>` fallback — Google Fonts no longer blocks first paint.
- Existing `preconnect` to fonts.googleapis.com + fonts.gstatic.com retained.

### Net effect
- Image payload reduction: ~92%. Hero image drops from 1.5 MB to 104 KB.
- Initial JS bundle drops dramatically because every secondary route is now its own chunk fetched on demand.
- Subsequent navigations cache the chunks immutably for a year.
- API/HTML responses are gzip/brotli-compressed in production.
- Sign-in / Account / Academy routes no longer pull their dependencies on landing page load.
