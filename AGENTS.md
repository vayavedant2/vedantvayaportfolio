# AGENTS.md

Source of truth for Cursor agents working in this repo.  
`next.config.ts` has `agentRules: false` — do not rely on Next’s auto-generated agent docs.

## Stack

- Next.js App Router, React 19, GSAP + ScrollTrigger, Lenis
- No Framer Motion (or other animation libs) unless the user explicitly asks

## Architecture map

| Layer | Path | Rule |
|-------|------|------|
| Routes | `src/app/` | Thin server pages: `metadata` + one view import |
| UI | `src/components/site/` | Client sections and shared chrome |
| Data | `src/data/` | Typed copy, lists, site meta — never hardcode in components |
| Tokens | `src/app/globals.css` | Colors, fonts, shared CSS variables |
| Home CSS | `src/components/site/home.module.css` | Home section layout |
| Shared CSS | `src/components/site/site.module.css` | Intro, rail, poster, `srOnly`, italic |
| Pages CSS | `src/components/site/pages.module.css` | `/works`, `/info`, `/contact` layouts |

**Motion core**

- `src/components/site/motion.ts` — `gsap`, `ScrollTrigger`, `prefersReducedMotion()`, `isCompactLayout()`
- `src/components/site/ready.ts` — intro gate: `markReady()` / `onReady()` / `isReady()`
- `src/components/site/SmoothScroll.tsx` — Lenis via dynamic `import("lenis")`; wires Lenis → `ScrollTrigger.update`

**Home composition** (`Home.tsx`): `SmoothScroll` → `Grain` → `Intro` → `<main id="content">`: Hero → About → Projects → Gallery → Skills → Awards → ContactBand → Footer.

## New section checklist (mandatory)

When creating or substantially editing a page section, complete every item.

### Structure

- [ ] Keep the App Router page thin; put the section in `src/components/site/`
- [ ] Stable `id` on `<section>`; register in `Home.tsx` (and `railSections` in `src/data/profile.ts` if nav/rail should list it)
- [ ] Copy and lists live in `src/data/*` typed exports
- [ ] Styles in the matching CSS module; use `site.srOnly` heading + visible kicker (`aria-hidden`) like `About.tsx`

### Reveal on scroll (required)

- [ ] Default: GSAP + ScrollTrigger from `./motion` (scrub reveal pattern in `About.tsx`)
- [ ] Gate with `prefersReducedMotion()` — final static state, no tween
- [ ] Use `isCompactLayout()` / `max-width: 900px` when pin/scrub would fight mobile layout
- [ ] Kill tween + `scrollTrigger` in the `useEffect` cleanup
- [ ] Anything that must run after Intro uses `onReady()` / `markReady()` — never ad-hoc timeouts
- [ ] Do not add a second smooth-scroll library; keep Lenis via `SmoothScroll`

### Asset loading (required)

| When | Action |
|------|--------|
| LCP / first viewport | **Preload** critical bytes (hero: `/vendor/core-renderer.js`, `/images/shader-background/background.png`; fonts via existing `next/font` in `layout.tsx`) |
| Below-fold heavy UI | **Lazy-load** with `next/dynamic` or `import()` for section components / large libs |
| New imagery | Prefer SVG / `Poster`; if raster needed, `next/image` (lazy by default, `priority` only for true LCP) |

- Keep GSAP registration centralized in `motion.ts`
- Do not pull large assets into the initial home client graph without a reason
- Intro’s visual “preloader” is **not** asset preloading — use real `<link rel="preload">`, `next/font`, or early fetch for critical bytes

### Other optimizations (required)

- [ ] `"use client"` only when the section needs browser APIs / GSAP
- [ ] No new global CSS files; extend tokens in `globals.css` when needed
- [ ] Match reduced-motion and `@media (max-width: 900px)` patterns already in home CSS
- [ ] Accessibility: real heading (`srOnly` ok); decorative visuals `aria-hidden`

## Motion vocabulary

| Intent | Pattern | Reference |
|--------|---------|-----------|
| Text / opacity reveal | ScrollTrigger scrub on words/nodes | `About.tsx` |
| Pinned scrub stage | pin + progress-driven transforms | `Projects.tsx`, `Gallery.tsx` |
| Post-intro entrance | `onReady()` then GSAP | `Hero.tsx` |
| Heavy optional effect | async script + destroy on unmount | `FluidWash.tsx` |
| Smooth scroll | Lenis dynamic import | `SmoothScroll.tsx` |

## Don’ts

- Don’t add dashboard-style card grids that fight the existing composition
- Don’t hardcode site URL or copy outside `src/data`
- Don’t call `CoreRenderer` outside the `FluidWash` lifecycle
- Don’t skip reduced-motion handling for new motion
- Don’t treat Intro splash as resource preloading
