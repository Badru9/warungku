# Design Specification: Luxury Real Estate Editorial Dashboard

**Project:** Warungku Stock Management System
**Date:** 2026-05-07
**Approach:** Editorial Architecture — luxury real estate magazine aesthetic
**Scope:** Dashboard sections (Products, Transactions, Staff) + Login page

---

## 1. Design Principles

- **Purpose preserved:** Stock management workflows unchanged. Only visual language transforms.
- **Editorial luxury:** Oversized serif titles, asymmetric layouts, generous whitespace, magazine-like rhythm.
- **Cool modern accent:** Teal/slate palette (#285156) evokes contemporary architecture.
- **Light base:** Warm off-white (#f5f2ee) keeps it airy and editorial.
- **Per-section variation:** Products, Transactions, Staff each have subtle unique treatments while sharing the core design system.

---

## 2. Design Tokens

### Colors

| Token                    | Value                 | Usage                                  |
| ------------------------ | --------------------- | -------------------------------------- |
| `--color-base`           | `#f5f2ee`             | Page background                        |
| `--color-surface`        | `#ffffff`             | Cards, modals, inputs                  |
| `--color-accent`         | `#285156`             | Buttons, links, active states, accents |
| `--color-accent-glass`   | `rgba(40,81,86,0.12)` | Glassmorphism overlays                 |
| `--color-accent-border`  | `rgba(40,81,86,0.25)` | Glass borders                          |
| `--color-text-primary`   | `#111111`             | Headings, body text                    |
| `--color-text-secondary` | `#6b7280`             | Labels, captions, metadata             |
| `--color-border`         | `#e5e0d8`             | Card borders, dividers                 |

### Typography

| Role                  | Font             | Weight | Size | Notes                                |
| --------------------- | ---------------- | ------ | ---- | ------------------------------------ |
| Display / Page Titles | Playfair Display | 700    | 48px | Tight line-height (0.95), title-case |
| Section Headings      | Playfair Display | 600    | 28px |                                      |
| Body / UI Text        | DM Sans          | 400    | 14px | Letter-spacing 0.02em                |
| Labels / Tags         | DM Sans          | 500    | 11px | Uppercase, letter-spacing 0.18em     |
| Buttons               | DM Sans          | 600    | 13px | Uppercase, letter-spacing 0.1em      |

### Spacing

- Section padding: 120–160px vertical
- Card padding: 40px
- Element gap: 24px (cards), 16px (form fields), 12px (inline elements)
- Border radius: 12px (cards), 4px (buttons), 999px (pills/badges)

### Shadows

- Card: `0 8px 30px rgba(40,81,86,0.08)`
- Glass: `0 18px 40px rgba(20,40,40,0.12)`
- Button hover: `0 4px 12px rgba(40,81,86,0.2)`

---

## 3. Login Page

**Layout:** Full-viewport hero section

- Background: Full-bleed luxury architectural photography from Unsplash (modern home exterior/interior)
- Dark gradient overlay (bottom-left heavy) for text legibility
- **Headline:** 72px Playfair Display, white, left-aligned, 2-3 lines
- **Subtitle:** 14px DM Sans, uppercase, wide tracking, muted white
- **Glassmorphism login card:** Floating center-right
  - `background: rgba(255,255,255,0.1)`, `backdrop-filter: blur(12px)`, thin white border
  - Inputs: transparent background, teal bottom border-only, soft teal glow on focus
  - Button: Ghost/outlined white, hover fills white with dark text
- **Marquee text:** Slow-scrolling text at bottom edge — "CONTEMPORARY · ARCHITECTURE · DESIGN · INNOVATION ·"
- **Navigation:** Fixed top nav, transparent with blur backdrop, logo left, minimal center links, user avatar + CTA right

---

## 4. Dashboard Layout

**Shell:**

- Sidebar: Collapses to hamburger on mobile (<768px)
- Top nav bar: Thin `#285156` bottom border accent
- Page titles: 48px Playfair Display, tight line-height, `#111111`
- Content area: Generous padding (60px desktop, 24px mobile)

**Common Components:**

### Buttons

- Outlined style: `border: 1.5px solid #285156`, `color: #285156`, 4px radius
- Uppercase DM Sans, letter-spacing 0.1em
- Hover: `#285156` fill, white text, smooth 0.3s transition

### Inputs

- Transparent background, `border-bottom: 1.5px solid #285156`, no border-radius
- Focus: soft teal box-shadow glow
- Label: DM Sans 11px uppercase, `#6b7280`

### Cards

- White surface (`#ffffff`)
- 40px padding, 12px radius
- Thin `#285156` top accent stripe (3px)
- Shadow: `0 8px 30px rgba(40,81,86,0.08)`
- Hover: subtle translateY(-2px) transition

### Tables

- No vertical lines, minimalist horizontal rows
- Teal-tinted alternate rows: `rgba(40,81,86,0.04)`
- Header: `#285156` bottom border underline
- Row hover: `rgba(40,81,86,0.06)` background

---

## 5. Section Variations

### Products Page

- **Layout:** Asymmetric 3-column grid
- **Hero card:** Large product card spans 2 columns, features oversized image
- **Card accents:** Teal-tinted top borders vary slightly in shade per card
- **Quick-action FAB:** Deep teal (`#285156`), fixed bottom-right, white icon
- **Filters:** Horizontal pill-style with teal active state

### Transactions Page

- **Layout:** Table-first with stat cards at top
- **Stat cards:** Glassmorphism style (rgba surface, blur, thin border)
- **Table:** Teal-striped rows, date filters stacked horizontally
- **Active filters:** Teal pill capsules (`rgba(40,81,86,0.12)` background, `#285156` text)
- **Status badges:** Soft teal capsules for completed, muted gray for pending

### Staff Page

- **Layout:** Card grid with circular avatar insets (80px diameter)
- **Card accent:** Thin left `#285156` border (3px) on each card
- **Role badges:** Soft teal capsules (`rgba(40,81,86,0.12)` background)
- **Avatar border:** Thin `#285156` ring
- **Hover state:** Card elevates slightly, teal accent brightens

---

## 6. Technical Implementation

### Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + HeroUI v3
- **Typography:** Next.js `next/font` — load Playfair Display + DM Sans
- **State:** TanStack Query v5 (existing)
- **Icons:** Lucide React (existing)

### File Structure (additions/changes)

```
src/
  app/
    (auth)/login/page.tsx          # Redesign with hero + glassmorphism
    (dashboard)/
      layout.tsx                   # Update shell with new nav/cards
      dashboard/page.tsx           # Update with editorial styling
      products/
        page.tsx                   # Asymmetric grid + hero card
        [id]/page.tsx              # Detail page
        new/page.tsx               # Form page
        [id]/edit/page.tsx         # Edit form
      transactions/
        page.tsx                   # Table-first + glass stat cards
        new/page.tsx               # Transaction form
      staff/
        page.tsx                   # Card grid + avatar insets
        new/page.tsx               # Staff form
  components/
    ui/
      Card.tsx                     # New editorial-style card
      Button.tsx                   # New outlined-teal button
      Input.tsx                    # New minimal input
      Table.tsx                    # New teal-accented table
      GlassCard.tsx                # Glassmorphism panel
    layout/
      DashboardNav.tsx             # Updated nav with luxury styling
  styles/
    globals.css                    # All CSS custom properties under :root + new fonts
```

### Key Technical Details

- **All design tokens in `globals.css`**: CSS custom properties defined under `:root` selector
- User can change any `--color-*`, `--shadow-*`, `--radius-*`, `--spacing-*` value in `globals.css` to retheme instantly
- HeroUI theme customization via Tailwind v4 CSS variables or inline `className` with Tailwind
- All images lazy-loaded (`loading="lazy"`)
- Smooth scroll enabled (`scroll-behavior: smooth`)
- Parallax effect on login hero via CSS `transform: translateY()` on scroll (20-30% speed)
- Scroll-triggered fade-up animations via IntersectionObserver
- Mobile responsive: single-column grids, stacked nav, hamburger sidebar

### Example globals.css Token Block

```css
:root {
  /* Base */
  --color-base: #f5f2ee;
  --color-surface: #ffffff;
  --color-accent: #285156;
  --color-accent-glass: rgba(40, 81, 86, 0.12);
  --color-accent-border: rgba(40, 81, 86, 0.25);
  --color-text-primary: #111111;
  --color-text-secondary: #6b7280;
  --color-border: #e5e0d8;

  /* Typography */
  --font-display: 'Playfair Display', serif;
  --font-body: 'DM Sans', sans-serif;

  /* Spacing */
  --section-padding: 120px;
  --card-padding: 40px;
  --gap-cards: 24px;

  /* Shadows */
  --shadow-card: 0 8px 30px rgba(40, 81, 86, 0.08);
  --shadow-glass: 0 18px 40px rgba(20, 40, 40, 0.12);

  /* Radius */
  --radius-card: 12px;
  --radius-button: 4px;
  --radius-pill: 999px;
}
```

---

## 7. Success Criteria

- [ ] Login page evokes luxury real estate editorial (hero + glass card)
- [ ] Dashboard shell uses Playfair Display titles, teal accents, editorial spacing
- [ ] Products page has asymmetric grid with hero card
- [ ] Transactions page has glass stat cards + teal-striped table
- [ ] Staff page has avatar insets + left-border accent cards
- [ ] All buttons use outlined-teal style with correct hover
- [ ] All inputs use minimal bottom-border style
- [ ] Mobile responsive across all pages
- [ ] No functionality broken — only visual changes

---

_Design approved: 2026-05-07_
_Approach: Editorial Architecture (A)_
_Scope: Dashboard + Login_
_Base: Light (#f5f2ee) | Accent: Cool Teal (#285156)_
