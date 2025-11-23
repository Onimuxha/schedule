# Design Guidelines: Weekly Schedule PWA

## Design Approach
**System-Based with Modern Enhancement**: Material Design 3 dark theme principles combined with 2025 futuristic aesthetics. The application is utility-focused (productivity tool) with premium visual treatment through glow effects and smooth animations.

## Core Design Principles
- **Dark Theme Only**: All UI elements on dark backgrounds with high contrast
- **Futuristic 2025 Aesthetic**: Soft glows, subtle gradients, glass morphism effects
- **Premium Minimalism**: Clean layouts with purposeful animations
- **Responsive First**: Mobile-optimized with tablet and desktop enhancements

## Typography System

**Font Families:**
- Khmer: `InterKhmerLooped` (local file: InterKhmerLooped.ttf)
- English: `Outfit` (primary) or `Poppins` (fallback)

**Hierarchy:**
- Hero/Headers: text-3xl to text-5xl, font-bold
- Section Titles: text-xl to text-2xl, font-semibold  
- Body Text: text-base to text-lg, font-normal
- Captions/Labels: text-sm, font-medium

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-4, p-6
- Section margins: mb-6, mb-8
- Grid gaps: gap-4, gap-6

**Container Strategy:**
- Main container: max-w-7xl mx-auto px-4
- Card containers: rounded-xl with backdrop-blur effects
- Weekly grid: 7-column layout (desktop), stack on mobile

## Component Library

**Navigation:**
- Top bar with language switcher (Khmer 🇰🇭 / English 🇺🇸)
- Fixed position with glass morphism background
- Language toggle button with flag icons

**Weekly Schedule Grid:**
- 7 cards representing Monday-Sunday
- Each day card shows:
  - Day name header with glow border for "Today"
  - Time slots list (6-7 PM workdays, 9-10 AM day-offs)
  - "Day Off" toggle button
  - Activity checkboxes with drag handles
- Draggable activities using @dnd-kit with smooth transitions

**Activity Management:**
- Activity cards with checkbox, edit, delete icons
- Add activity input with glow button
- Magic UI modal for editing activities
- Toast notifications for all CRUD operations

**Action Buttons:**
- "Generate Random Schedule" - primary CTA with glow effect
- "Download PNG/PDF" - secondary actions
- Day Off toggle - tertiary styling with state indication

**Progress Indicator:**
- Horizontal progress bar showing completion percentage
- Gradient fill with soft glow
- Positioned prominently at top of schedule view

**Forms & Inputs:**
- Dark input fields with subtle border glow on focus
- Magic UI components for modals and dropdowns
- Consistent hover states with soft glow transitions

## Visual Effects

**Glow Effects:**
- Today's day card: border glow in accent color
- Primary buttons: soft glow on hover
- Active/dragging items: enhanced glow
- Focus states: subtle ring glow

**Animations:**
- Page transitions: fade and slide (300ms)
- Drag and drop: smooth lift and shadow
- Checkbox toggle: satisfying check animation
- Toast notifications: slide from top-right

**Glass Morphism:**
- Navigation bar: backdrop-blur-md with semi-transparent background
- Modal overlays: backdrop-blur-sm
- Card backgrounds: subtle transparency with border highlights

## Images
No hero images required. This is a utility application focused on schedule management. All visual interest comes from UI components, glow effects, and data visualization.

## Accessibility
- High contrast text on dark backgrounds
- Focus indicators with visible glow rings
- Keyboard navigation for all interactive elements
- Clear visual feedback for drag and drop states
- ARIA labels for language switcher and day toggles

## PWA Specific
- App icon with glow effect for home screen
- Splash screen with brand styling
- Offline state indicator with friendly messaging
- Install prompt with premium button styling