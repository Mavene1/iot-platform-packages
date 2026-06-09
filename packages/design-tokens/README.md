# @iot-platform-saf/design-tokens

CSS custom properties for the Safaricom IoT Unified Platform. Defines layout dimensions, brand colours, semantic surfaces, and chart palette — shared identically across every app in the platform.

> **Source of truth.** Never hand-edit the `:root` token block in your app. Update this package and publish a new version instead.

---

## Installation

```bash
pnpm add @iot-platform-saf/design-tokens
```

This is a CSS-only package — there is no JavaScript bundle and no build step required.

---

## Step-by-Step Setup

### 1. Import in your global stylesheet

Add a single import at the very top of your app's `globals.css`, **before** any Tailwind directives:

```css
/* app/globals.css */
@import "@iot-platform-saf/design-tokens";

@import "tailwindcss";

/* your shadcn/ui and app-specific overrides below */
```

> The import must come first so your Tailwind utilities and shadcn tokens can reference the custom properties.

### 2. Verify the tokens are loaded

Open your browser's DevTools, inspect the `<html>` element, and confirm properties like `--navbar-height`, `--green-500`, and `--saf-green-primary` are present in the computed styles.

### 3. Use tokens in your CSS or Tailwind config

Reference any token via `var()`:

```css
.my-component {
  background-color: var(--surface);
  border-color: var(--border-light);
  color: var(--text-primary);
}
```

Or extend your Tailwind theme in `tailwind.config.ts` to use them as design-system values:

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        "saf-green": "var(--saf-green-primary)",
        surface: "var(--surface)",
      },
      height: {
        navbar: "var(--navbar-height)",
        footer: "var(--footer-height)",
      },
      width: {
        sidebar: "var(--sidebar-width)",
      },
    },
  },
};
```

---

## Token Reference

### Layout

| Token | Value | Usage |
|---|---|---|
| `--radius` | `0.625rem` | Default border radius for cards and inputs |
| `--navbar-height` | `56px` | Height of `AppNavbar` — use for `padding-top` on the main content area |
| `--sidebar-width` | `240px` | Width of `AppSidebar` when expanded — use for `padding-left` on the main content area |
| `--footer-height` | `40px` | Height of `AppFooter` — use for `padding-bottom` on the main content area |

Standard main content offset:

```css
main {
  padding-top: var(--navbar-height);
  padding-left: var(--sidebar-width);
  padding-bottom: var(--footer-height);
}
```

---

### Brand Green Palette

| Token | Hex |
|---|---|
| `--green-50` | `#ecfdf3` |
| `--green-100` | `#d1fae5` |
| `--green-200` | `#a4edba` |
| `--green-300` | `#65d470` |
| `--green-400` | `#45bd4a` |
| `--green-500` | `#35a839` |
| `--green-600` | `#2a8c2e` |
| `--green-700` | `#067647` |
| `--green-800` | `#055c37` |
| `--green-900` | `#04422a` |

---

### Dark Palette

Used for hero sections and CTA backgrounds.

| Token | Hex |
|---|---|
| `--dark-950` | `#0a0f0d` |
| `--dark-900` | `#111a16` |
| `--dark-800` | `#1a2620` |
| `--dark-700` | `#243530` |
| `--dark-600` | `#2f4a40` |

---

### Safaricom Brand Colours

| Token | Hex | Usage |
|---|---|---|
| `--saf-green-primary` | `#35a839` | Primary CTA, active states |
| `--saf-green-700` | `#067647` | Hover / pressed green |
| `--saf-green-50` | `#ecfdf3` | Green tint backgrounds |
| `--saf-red-primary` | `#e03137` | Destructive actions, error states |
| `--saf-red-700` | `#b42318` | Hover / pressed red |
| `--saf-red-50` | `#fef3f2` | Red tint backgrounds |
| `--saf-yellow-primary` | `#f59e0b` | Warning states |
| `--saf-yellow-700` | `#a15c07` | Hover / pressed yellow |
| `--saf-yellow-50` | `#fefce8` | Yellow tint backgrounds |
| `--saf-gray-primary` | `#5c6b63` | Secondary text, icons |
| `--saf-gray-500` | `#8a9690` | Placeholder text |
| `--saf-gray-50` | `#f0f7f4` | Subtle backgrounds |
| `--saf-white` | `#ffffff` | — |

---

### Semantic Surfaces

| Token | Value | Usage |
|---|---|---|
| `--surface` | `#f7fbf9` | Page background |
| `--surface-secondary` | `#f0f7f4` | Card / panel background |
| `--surface-raised` | `var(--surface-secondary)` | Elevated surface (same as secondary) |

---

### Text

| Token | Hex | Usage |
|---|---|---|
| `--text-primary` | `#0f1b15` | Body text, headings |
| `--text-secondary` | `#5c6b63` | Supporting text, labels |
| `--text-tertiary` | `#8a9690` | Placeholders, captions |
| `--text-on-dark` | `#f0f5f2` | Text on dark backgrounds |
| `--text-on-dark-secondary` | `#9ca8a1` | Supporting text on dark |

---

### Borders

| Token | Hex | Usage |
|---|---|---|
| `--border-light` | `#e5eae7` | Default border colour |
| `--border-dark` | `#1f2e28` | Border on dark surfaces |

---

### Chart Palette

Consistent data visualisation colours for Recharts, Chart.js, etc.

| Token | Hex |
|---|---|
| `--chart-amber` | `#f59e0b` |
| `--chart-blue` | `#3b82f6` |
| `--chart-purple` | `#8b5cf6` |
| `--chart-pink` | `#ec4899` |
| `--chart-teal` | `#14b8a6` |
| `--chart-red` | `#ef4444` |
| `--chart-slate` | `#64748b` |
| `--chart-cyan` | `#06b6d4` |
| `--chart-gray` | `#6b7280` |

Usage with Recharts:

```tsx
<Line stroke="var(--chart-blue)" />
<Bar fill="var(--chart-teal)" />
```

---

### Callout tokens

For documentation or help content.

| Token | Usage |
|---|---|
| `--callout-tip-bg` / `--callout-tip-border` / `--callout-tip-title` | Tip / success callout |
| `--callout-info-bg` / `--callout-info-border` / `--callout-info-title` | Info callout |
| `--callout-warning-bg` / `--callout-warning-border` / `--callout-warning-title` | Warning callout |
| `--callout-danger-bg` / `--callout-danger-border` / `--callout-danger-title` | Danger / error callout |

---

## What this package does NOT include

- **shadcn/ui semantic tokens** (`--background`, `--foreground`, `--primary`, `--ring`, etc.) — shadcn generates those per-app via `npx shadcn init`. Do not copy them here.
- **Dark mode overrides for shadcn tokens** — define `.dark {}` in your app's `globals.css`.
- **`@theme`, `@layer`, `@utility` blocks** — define those in your app.
