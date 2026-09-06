# UI/UX Design System Reference

This document captures the complete styling, typography, colors, and layout tokens for reuse in future website builds for MentorMatrix.

## 1. Color Palette

### Light Mode
- **Background (Cream)**: `#f5f0e8`
- **Background Alternate (Cream Alt)**: `#ede8de`
- **Text Primary (Brown)**: `#1a1208`
- **Text Secondary (Brown Mid)**: `#4a3f2f`
- **Text Muted (Brown Soft)**: `#8a7a66`
- **Accent (Amber)**: `#c8830a`
- **Accent Light**: `rgba(200, 131, 10, 0.12)`
- **Accent Border**: `rgba(200, 131, 10, 0.25)`

### Dark Mode
- **Background**: `#141210`
- **Background Alternate**: `#1c1916`
- **Text Primary**: `#f0ece4`
- **Text Secondary**: `#c8bfb0`
- **Text Muted**: `#8a7a66`
- **Accent (Amber)**: `#c8830a` (Remains the same)
- **Accent Light**: `rgba(200, 131, 10, 0.15)`
- **Accent Border**: `rgba(200, 131, 10, 0.3)`

---

## 2. Typography

- **Headings (Serif)**: `'Playfair Display', serif`
  - *Main Hero (h1)*: `clamp(3.5rem, 8vw, 6.5rem)`, Weight `400`, Letter-spacing `-0.03em`, Line-height `1.08`.
  - *Section Titles (h2)*: `clamp(2.4rem, 5vw, 4rem)`, Weight `400`, Letter-spacing `-0.025em`, Line-height `1.12`.
- **Body & UI (Sans-serif)**: `'Inter', sans-serif`
  - *Base Size*: `15px` on Mobile, `16px` on Desktop.
  - *Line-height*: `1.8` for readability.
- **Section Labels**: `0.7rem`, Font-weight `500`, Letter-spacing `0.14em` (widely spaced), Uppercase, colored in Accent (Amber).

---

## 3. Structural Tokens

- **Border Radii**:
  - *Small elements*: `10px`
  - *Medium elements*: `16px`
  - *Cards/Modals*: `20px` to `24px`
  - *Pills/Buttons*: `100px` (fully rounded)
- **Transitions**: Global ease transition of `0.2s ease`.
- **Shadows**:
  - *Floating Elements/Cards*: `0 16px 40px rgba(200, 132, 42, 0.1)`
  - *Hover State*: `0 20px 50px rgba(200, 132, 42, 0.1)` with a `transform: translateY(-6px)`.

---

## 4. UI Components

### Buttons
- **Primary Button**:
  - Background: Brown `#1a1208`
  - Text: Cream `#f5f0e8`, `0.95rem`, `500` weight
  - Border-radius: `100px` (Pill shape)
  - Hover: Background changes to Amber `#c8830a`, translates `Y(-2px)`.
- **Ghost Button**:
  - Background: Transparent
  - Border: `1.5px solid rgba(26, 18, 8, 0.18)`
  - Hover: Border and Text change to Amber, translates `Y(-2px)`.

### Cards (e.g., Steps, Features)
- **Light Mode**: White background, `1px` subtle amber border (`rgba(200, 132, 42, 0.12)`).
- **Dark Mode**: `#1c1916` background, matching subtle borders.
- **Interactions**: Lifts up `translateY(-6px)` and drops a soft amber shadow on hover.

### Badges / Tags
- Background: Very pale amber (`var(--amber-pale)` / `rgba(200, 131, 10, 0.1)`)
- Text: Amber `#c8830a`, `0.68rem`, `500` weight, `0.1em` letter-spacing, uppercase.
- Border: `1px solid rgba(200, 132, 42, 0.2)`

---

## 5. Visual Effects & Flourishes

- **Custom Cursor**:
  - Hidden native cursor (`cursor: none`).
  - Follows mouse with an inner `5px` solid amber dot and a `36px` amber ring border.
  - Expands to `scale(1.6)` with a faint background fill when hovering over clickable elements.
  - Automatically disabled on touch devices.
- **Ambient Floating Orbs**:
  - Background shapes using `radial-gradient` and heavy blur (`filter: blur(60px)`).
  - Continuous 6-second breathing animations (`scale` & `opacity`).
- **Marquee Scroller**:
  - Infinite CSS linear animation `marquee 28s linear infinite`.
  - Uppercase text separated by tiny dot elements.
- **Scroll Reveal**:
  - Elements start with `opacity: 0` and `transform: translateY(2px)`.
  - Transition to `opacity: 1` and normal position when entering the viewport.
