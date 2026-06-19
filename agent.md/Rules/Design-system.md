# PledgePay — Design System

## Design Philosophy

PledgePay exists in the space between two people who trust each other enough
to exchange money informally. The design must honour that trust.

It should feel:
- **Calm** — not urgent, not aggressive, never pressure-driven
- **Clear** — financial information is always precise and readable
- **Human** — warm, not clinical; relational, not transactional
- **Accountable** — every status is visible, every action is logged

It must never feel like a loan shark app. No red urgency. No countdown pressure.
No dark patterns. The design enforces the principle of accountability without harassment.

---

## Colour Palette

```css
:root {
  /* Primary — Deep Teal */
  --color-primary-900: #064E45;
  --color-primary-800: #0A6B5E;
  --color-primary-700: #0D7C6E;   /* Main primary */
  --color-primary-600: #0F8F7E;
  --color-primary-500: #12A28E;
  --color-primary-100: #D6F0ED;
  --color-primary-50:  #EBF7F6;

  /* Neutrals */
  --color-ink:         #111827;   /* Primary text */
  --color-ink-muted:   #6B7280;   /* Secondary text */
  --color-ink-faint:   #9CA3AF;   /* Placeholder text */
  --color-border:      #E5E7EB;   /* Default borders */
  --color-surface:     #F9FAFB;   /* Page background */
  --color-white:       #FFFFFF;   /* Card surfaces */

  /* Semantic — Status Colours */
  --color-success:     #16A34A;   /* Completed, paid */
  --color-success-bg:  #F0FDF4;
  --color-warning:     #D97706;   /* Overdue, pending */
  --color-warning-bg:  #FFFBEB;
  --color-info:        #2563EB;   /* Active, in-progress */
  --color-info-bg:     #EFF6FF;
  --color-error:       #DC2626;   /* Failed payment, error */
  --color-error-bg:    #FEF2F2;
  --color-neutral-status: #6B7280; /* Expired, cancelled */
  --color-neutral-bg:  #F3F4F6;
}
```

### Colour Usage Rules

- `--color-primary-700` is the only primary action colour. Use it for primary
  buttons, active states, links, and key highlights.
- Never use red for anything except genuine errors and failed payments.
  Overdue pledges use `--color-warning`, not red. Red feels like a threat.
- Status badges always use the semantic colour + its background pair.
- Text on `--color-primary-700` backgrounds must be white.
- Never use primary colour for destructive actions (cancel, delete).
  Use a neutral dark button style instead.

---

## Pledge Status Badge Colours

| Status              | Text Colour          | Background             |
|---------------------|----------------------|------------------------|
| PENDING_ACCEPTANCE  | `--color-warning`    | `--color-warning-bg`   |
| AWAITING_FUNDING    | `--color-info`       | `--color-info-bg`      |
| ACTIVE              | `--color-primary-700`| `--color-primary-50`   |
| OVERDUE             | `--color-warning`    | `--color-warning-bg`   |
| COMPLETED           | `--color-success`    | `--color-success-bg`   |
| CANCELLED           | `--color-neutral`    | `--color-neutral-bg`   |
| EXPIRED             | `--color-neutral`    | `--color-neutral-bg`   |

---

## Typography

### Typefaces

```css
/* Display / Headings */
font-family: 'DM Serif Display', Georgia, serif;

/* Body / UI */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

Load from Google Fonts. DM Serif Display for headings gives warmth and
authority — it signals that agreements mean something. Inter for body
ensures clarity and readability at all sizes.

### Type Scale

```css
:root {
  --text-xs:   0.75rem;    /* 12px — labels, metadata */
  --text-sm:   0.875rem;   /* 14px — secondary text, captions */
  --text-base: 1rem;       /* 16px — body text */
  --text-lg:   1.125rem;   /* 18px — lead text */
  --text-xl:   1.25rem;    /* 20px — card titles */
  --text-2xl:  1.5rem;     /* 24px — section headings */
  --text-3xl:  1.875rem;   /* 30px — page headings */
  --text-4xl:  2.25rem;    /* 36px — hero amounts */
}
```

### Type Rules

- Amounts (₦ values) always use `font-variant-numeric: tabular-nums` so digits
  align correctly in tables and lists.
- Never display a large naira amount without a label beneath it clarifying
  what it represents (e.g. "Outstanding Balance").
- Headings use DM Serif Display. Everything else uses Inter.
- Body text line height: `1.6`. Heading line height: `1.2`.

---

## Spacing

8px base unit. All spacing is a multiple of 8.

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

---

## Border Radius

```css
:root {
  --radius-sm:   4px;    /* Tags, badges */
  --radius-md:   8px;    /* Inputs, small cards */
  --radius-lg:   12px;   /* Cards */
  --radius-xl:   16px;   /* Modals, bottom sheets */
  --radius-full: 9999px; /* Pills, avatar */
}
```

---

## Shadows

```css
:root {
  --shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
  --shadow-md:  0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04);
  --shadow-lg:  0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04);
}
```

Cards use `--shadow-md`. Modals and bottom sheets use `--shadow-lg`.

---

## Core Components

### Button

```tsx
// Variants:
// primary   — teal fill, white text. One per screen.
// secondary — white fill, teal border, teal text.
// ghost     — no background, no border, teal text. Navigation only.
// danger    — dark fill (--color-ink), white text. Destructive actions.

// Sizes: sm | md | lg
// md is the default. lg for full-width CTA buttons on mobile.

// Always has a loading state with a spinner.
// Disabled state reduces opacity to 0.4.
// Full width when inside a form on mobile.
```

### Input

```tsx
// States: default | focused | error | disabled
// Always has a label above it. Never placeholder-only.
// Error message appears below in --color-error, text-sm.
// Naira inputs prefix with "₦" inside the input field.
```

### Card

```tsx
// White background, --shadow-md, --radius-lg.
// Padding: --space-6 on desktop, --space-4 on mobile.
// Never nest cards inside cards.
```

### Status Badge

```tsx
// Pill shape (--radius-full), text-xs, font-medium.
// Colour pairs from the status table above.
// Always uppercase. Always a single word or short phrase.
```

### Activity Timeline

```tsx
// Vertical line connecting events (left-aligned on mobile).
// Each event: icon (coloured by event type) + label + timestamp.
// Timestamp: relative for recent (2 hours ago), absolute for older (12 Jun 2025).
// Never truncate event descriptions. Every event is complete.
```

### Reputation Score Display

```tsx
// Large number in DM Serif Display (--text-4xl).
// Coloured by score range:
//   80–100: --color-success
//   50–79:  --color-primary-700
//   30–49:  --color-warning
//   0–29:   --color-error
// "New" badge replaces score until first pledge is completed.
// Supporting stats below: Completed Pledges, On-Time Rate, Active Overdue.
```

---

## Mobile-First Layout

PledgePay is primarily used on mobile. Design mobile first, enhance for desktop.

```
Mobile (< 640px):
  - Single column
  - Bottom-sheet modals instead of centred modals
  - Full-width buttons
  - Tab bar navigation (bottom)
  - 16px minimum touch targets

Desktop (≥ 1024px):
  - Max content width: 480px centred (app-like feel)
  - Sidebar navigation optional in later versions
```

The desktop experience intentionally mirrors the mobile layout at a larger
size. PledgePay is not a data dashboard — it's a relationship tool. Wide
multi-column layouts don't serve the product.

---

## Iconography

Use **Lucide React** for all icons. No mixing icon libraries.

Key icons and their assigned meanings in PledgePay:

| Icon          | Usage                        |
|---------------|------------------------------|
| `Link`        | Share pledge                 |
| `CheckCircle` | Completed, success           |
| `Clock`       | Pending, waiting             |
| `AlertCircle` | Overdue, warning             |
| `XCircle`     | Cancelled, expired, error    |
| `Banknote`    | Payment, amount              |
| `Star`        | Reputation                   |
| `Bell`        | Notifications                |
| `User`        | Profile                      |
| `ArrowRight`  | Navigation, next step        |

Icon size: 16px in badges/labels, 20px in buttons, 24px in headings.
Never use icons without an accessible label or `aria-label`.

---

## Empty States

Every list or data section must have an empty state.
Empty states always:
- Show a relevant icon (muted colour)
- Give a one-line explanation
- Provide a single call to action where appropriate

```
[Icon]
No pledges yet
Create your first pledge to get started.
[Create Pledge →]
```

---

## Loading States

- Buttons: show a spinner inside the button, disable it, keep the label.
- Lists/cards: use skeleton loaders that match the shape of the real content.
- Full page: use a centred teal spinner on white background.
- Never show blank white screens during loading.

---

## Tone of Voice (UI Copy)

- Sentence case everywhere. Never ALL CAPS for body copy.
- Warm but precise. "Your pledge has been sent to Chidi" not "Request submitted."
- Amounts always formatted with commas: ₦100,000 not ₦100000.
- Dates always formatted: "12 Jun 2025" — never "06/12/2025".
- Error messages explain what happened and what to do next.
  "Payment failed. Please try again or contact your bank." not "Error 500."
- Success messages confirm the outcome. "Payment of ₦20,000 received." not "Done."
