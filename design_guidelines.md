# Design Guidelines: Premium Weekly Schedule PWA (2025)

## Design Approach
**Material Design 3 Enhanced with Premium Futuristic Aesthetic**: Utility-focused productivity tool elevated with luxurious glass morphism, refined gradients, and sophisticated neon-style glows. Deep navy/slate foundation with vibrant cyan, indigo, and purple accents creating an ultra-modern 2025 experience.

## Core Design Principles
- **Premium Dark Theme**: Deep backgrounds with high-contrast vibrant accents
- **Luxurious Glass Morphism**: Multi-layer transparency with refined blur effects
- **Futuristic Neon Glows**: Strategic use of vibrant glow effects on interactive elements
- **Generous Spacing**: Breathing room that emphasizes premium quality
- **Polished Animations**: Smooth, physics-based transitions throughout

## Typography System

**Font Families:**
- Khmer: `InterKhmerLooped` (local: InterKhmerLooped.ttf)
- English: `Outfit` (primary), `Inter` (secondary)

**Hierarchy:**
- App Title/Hero: text-4xl to text-6xl, font-bold, tracking-tight
- Section Headers: text-2xl to text-3xl, font-semibold
- Day Headers: text-xl, font-semibold, uppercase tracking-wide
- Body/Activities: text-base to text-lg, font-medium
- Timestamps/Labels: text-sm, font-medium, opacity-80

**Treatment:**
- Headers use gradient text effects on key elements
- Generous line-height (leading-relaxed) for readability
- Letter-spacing adjusted for premium feel (tracking-tight on headers, tracking-wide on labels)

## Layout System

**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, and 16
- Card padding: p-6 to p-8
- Section spacing: mb-8, mb-12, mt-16
- Grid gaps: gap-6, gap-8
- Container margins: mx-6 to mx-8

**Container Strategy:**
- Main wrapper: max-w-7xl mx-auto px-6 lg:px-8
- Generous top padding: pt-24 (for fixed nav + breathing room)
- Weekly grid: 7-column responsive (lg:grid-cols-7 md:grid-cols-3 grid-cols-1)
- Minimum touch targets: 48px height for mobile interactions

## Component Library

### Navigation Bar
- Fixed top position with multi-layer glass effect
- Height: 72px with substantial backdrop-blur
- Contains: App title (left), Language switcher (right: 🇰🇭/🇺🇸 toggle)
- Border: subtle bottom glow line
- z-index: 50 for layering

### Weekly Schedule Grid
**Day Cards** (7 total, Monday-Sunday):
- Rounded-2xl with thick glass border
- Multi-layer background: semi-transparent with gradient overlay
- Padding: p-6
- Min-height: 400px for consistent alignment
- Today's card: Enhanced with vibrant neon glow border (shadow-2xl with glow)

**Day Card Structure:**
1. **Header Section** (mb-6):
   - Day name: text-xl, uppercase, tracking-wide
   - Date indicator: text-sm, opacity-70
   - Day Off toggle: Premium switch with glow states

2. **Time Slot Indicator** (mb-4):
   - Chip-style badge with glass background
   - Shows "6-7 PM" or "9-10 AM" based on workday/day-off
   - Subtle glow effect

3. **Activities List** (space-y-3):
   - Draggable activity items with drag handles
   - Each activity: checkbox + text + action icons (edit/delete)
   - Smooth hover lift effect (translateY + shadow increase)
   - Active drag state: enhanced glow + scale(1.02)

4. **Add Activity Section** (mt-6):
   - Input field with glass background
   - Primary CTA button with neon glow
   - Icon: Plus symbol

### Progress Indicator
- Positioned below nav, above schedule grid
- Full-width bar with rounded-full caps
- Height: 8px
- Multi-layer: background track + gradient-filled progress
- Vibrant glow on progress fill
- Percentage text: right-aligned, text-sm, font-semibold

### Action Button Row
Positioned above weekly grid (mb-8):
- **Generate Random Schedule**: Primary button, large, prominent neon glow
- **Download PNG/PDF**: Secondary buttons, glass morphism style, icon + text
- Layout: flex justify-between md:justify-start gap-4
- All buttons: rounded-xl, px-6, py-3, font-semibold

### Modal (Activity Edit)
- Full-screen overlay with heavy backdrop-blur
- Centered card: max-w-md, rounded-2xl
- Glass morphism with thick glow border
- Form fields: glass inputs with focus glow
- Action buttons: Save (primary glow), Cancel (ghost)

### Toast Notifications
- Top-right positioning (fixed top-6 right-6)
- Glass card with vibrant accent border (success/error/info)
- Icon + message + auto-dismiss
- Slide-in animation from right

## Visual Effects Specification

**Glass Morphism Layers:**
- Level 1 (Cards): backdrop-blur-md, 10% background opacity
- Level 2 (Nav/Modal): backdrop-blur-lg, 15% background opacity
- Level 3 (Overlays): backdrop-blur-xl, 20% background opacity
- All layers: subtle border with gradient highlights

**Neon Glow Implementation:**
- Primary glows: Multi-layer shadow with vibrant accent (3-4 shadow layers)
- Interactive states: Glow intensity increases 50% on hover
- Today's indicator: Pulsing glow animation (subtle, 2s duration)
- Focus rings: Thick (3px) with matching neon glow

**Gradient Applications:**
- Button fills: Diagonal gradients (cyan → indigo or indigo → purple)
- Text highlights: Gradient overlays on hero text
- Border accents: Gradient borders on premium cards
- Progress bar: Multi-stop gradient for visual interest

**Animation Timing:**
- Micro-interactions: 200ms ease-out
- Card transitions: 300ms cubic-bezier
- Drag operations: 150ms for immediate feedback
- Page loads: 400ms staggered fade-in
- Toast entrance: 300ms slide + fade

**Animation Behaviors:**
- Drag preview: Scale(1.05) + rotate(2deg) + enhanced shadow
- Checkbox check: Smooth bounce effect
- Button press: Scale(0.98) + slight glow pulse
- Card hover: translateY(-2px) + shadow expansion
- Language toggle: Slide transition with flag swap

## Accessibility

- Contrast ratio: Minimum 7:1 for all text
- Focus indicators: Thick glowing rings (always visible)
- Keyboard nav: Full support with visual feedback
- Screen reader: Comprehensive ARIA labels (day names, activity counts, progress percentage)
- Touch targets: Minimum 48x48px on mobile
- Drag operations: Keyboard alternative (arrow keys + modifier)
- Language switcher: Clear visual state and labels

## PWA Elements

- App icon: Premium gradient with subtle glow effect
- Splash screen: Deep background with app logo + tagline
- Offline indicator: Floating toast with retry option
- Install prompt: Premium modal with benefits list and gradient CTA
- Loading states: Skeleton screens with shimmer effect

## Images

**No hero images required.** This utility application's visual impact comes from:
- Premium glass morphism components
- Vibrant neon glow effects
- Sophisticated gradient treatments
- Polished micro-interactions

All visual interest is UI-driven, maintaining focus on schedule management functionality while delivering a luxurious, futuristic aesthetic.