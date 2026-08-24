---
name: Luminous Enterprise
colors:
  surface: '#faf9ff'
  surface-dim: '#ccdaff'
  surface-bright: '#faf9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8ff'
  surface-container-highest: '#d8e2ff'
  on-surface: '#051a3e'
  on-surface-variant: '#434654'
  inverse-surface: '#1d3054'
  inverse-on-surface: '#edf0ff'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#004b59'
  on-tertiary: '#ffffff'
  tertiary-container: '#006477'
  on-tertiary-container: '#76e2ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#afecff'
  tertiary-fixed-dim: '#48d7f9'
  on-tertiary-fixed: '#001f27'
  on-tertiary-fixed-variant: '#004e5d'
  background: '#faf9ff'
  on-background: '#051a3e'
  surface-variant: '#d8e2ff'
typography:
  display-lg:
    fontFamily: Kanit
    fontSize: 57px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: Kanit
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Kanit
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  title-md:
    fontFamily: Kanit
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0.15px
  body-lg:
    fontFamily: Kanit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Kanit
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Kanit
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style

The design system is engineered for a high-performance enterprise environment, specifically tailored for "SmartCheck" (เช็คชื่อ). The brand personality is **authoritative yet frictionless**, blending the systematic rigor of Material Design 3 with an **"AI-First" aesthetic**. This is achieved through precision-engineered layouts, subtle glassmorphism to denote intelligence layers, and high-clarity data visualization.

The style is **Corporate Modern with a Tech-Forward edge**. It prioritizes extreme legibility and "calm" interfaces that reduce cognitive load during repetitive tasks. The emotional response is one of reliability, speed, and advanced technological assistance.

- **Minimalism:** Use of generous negative space to separate functional groups.
- **AI Influence:** Subtle glow effects and iridescent gradients are used sparingly to highlight AI-driven insights or automated actions.
- **Professionalism:** Strict adherence to grid alignment and consistent elevation scales.

## Colors

The palette is anchored by a deep **Primary Blue (#0052CC)**, signaling trust and enterprise stability. **Secondary White** is utilized for expansive surfaces to maintain a clean, airy feel.

- **Primary:** Used for key actions, active states, and brand identifiers.
- **Accent Gradients:** A technical transition from Primary Blue to Tertiary Cyan, reserved for AI-related features, progress bars, and high-impact data points.
- **Neutral Palette:** A sophisticated range of cool greys derived from the primary hue to maintain tonal harmony.
- **Dark Mode:** A true-black and deep-charcoal implementation that preserves contrast ratios for late-night administrative work while reducing eye strain.

## Typography

The design system utilizes **Kanit** for all typographic roles to ensure a modern, geometric feel that supports both Thai and Latin scripts with equal legibility.

- **Hierarchies:** Strong weight contrast is used between labels (Medium/600) and body text (Regular/400).
- **Scale:** Display sizes are reserved for dashboard hero metrics. Headlines are kept tight for information-dense enterprise views.
- **Readability:** Line heights are set to 1.5x for body text to accommodate the vertical height of Thai characters and ensure comfortable long-form reading.

## Layout & Spacing

This design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The spacing rhythm is strictly based on an **8px linear scale**, ensuring mathematical harmony across all components.

- **Desktop:** 1440px max-width container with 24px margins.
- **Tablet:** Fluid width with 16px margins; content reflows to 8 columns.
- **Mobile:** 16px safe-area margins.
- **Density:** High-density views (Data Tables) may drop to a 4px (xxs) spacing unit for internal padding to maximize information visibility.

## Elevation & Depth

Hierarchy is established using **Tonal Layers** and **Soft Ambient Shadows**. This follows Material Design 3 logic where higher elevation is indicated by lighter surface tints in Dark Mode and softer, more expansive shadows in Light Mode.

- **Level 0 (Surface):** Default background.
- **Level 1 (Cards/Sidebar):** +1dp elevation. Subtle 1px border (#E3E3E3) or a slight tonal shift.
- **Level 2 (Modals/Popovers):** +3dp elevation. Uses an extra-diffused 15% opacity shadow with a 16px blur to create a sense of floating over the primary workspace.
- **AI Layers:** Features "Glassmorphism" with a 12px backdrop blur and 40% transparency to indicate automated or ephemeral information overlays.

## Shapes

The shape language is **Rounded (Level 2)**. This strikes a balance between the friendliness of a modern app and the structure required for an enterprise tool.

- **Buttons & Inputs:** 8px (0.5rem) corner radius.
- **Cards & Modals:** 16px (1rem) corner radius for a softer, modern container feel.
- **Selection Indicators:** Pill-shaped (fully rounded) for tags, chips, and active nav states to distinguish them from structural containers.

## Components

### Buttons
- **Primary:** Solid Primary Blue with white text.
- **Secondary:** Outlined with Primary Blue or Ghost style for less urgent actions.
- **AI Action:** Uses the Primary-to-Tertiary gradient with a subtle glow on hover.

### Cards
- **Structure:** White background, 1px neutral border, 16px internal padding.
- **Behavior:** Hover states should lift the card slightly (Level 2 elevation) and deepen the shadow.

### Data Tables
- **Styling:** Borderless rows with 1px horizontal dividers. 
- **Header:** Sticky headers with a Medium weight font and subtle grey background.
- **Interaction:** Alternating row stripes (zebra) are discouraged; use hover highlights instead.

### Sidebars & Navbars
- **Sidebar:** Fixed width (260px), Level 1 elevation. Active links use a "pill" background in light blue with bold text.
- **Navbar:** Transparent or blurred glass effect (Level 2) to maintain context of the content below.

### Modals
- **Design:** Centered with a dimmed backdrop (40% black). 24px internal padding. Primary action always placed on the bottom right.

### Charts
- **Palette:** Use the Primary and Tertiary colors as the base. For multi-series charts, use a sequence of blues and cyans.
- **Style:** Clean lines, no grid-line clutter. Use Kanit Label-sm for all axis titles.