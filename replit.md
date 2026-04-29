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
  App.tsx           — Root component with routing
  main.tsx          — Entry point
  pages/            — Page components
  components/       — Shared components (layout, ui, landing, auth, store, etc.)
                      Store-specific UI: CinematicHeroSlider (3D promo slider),
                      BentoGrid (departmental highlights), OffersTicker (scrolling
                      news/discounts), Carousel3D (related items in circular 3D
                      motion), LiveActivityFeed (psychological live notifications).
  data/             — Static data files
  hooks/            — Custom React hooks
  lib/              — Utilities (cn, etc.)
  assets/           — Static assets
server/
  src/              — Express backend (TypeScript, built separately)
public/             — Static public files
index.html          — HTML entry (Arabic/RTL)
vite.config.ts      — Vite config (requires PORT and BASE_PATH env vars)
```

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
