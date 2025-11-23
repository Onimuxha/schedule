# Weekly Schedule Planner PWA

## Overview

A modern, futuristic Progressive Web Application (PWA) for managing weekly schedules with drag-and-drop functionality and bilingual support (English/Khmer). The application features a dark-themed Material Design 3 interface with 2025 aesthetic elements including soft glows, glass morphism, and smooth animations. Users can manage activities across a weekly calendar, mark days as work days or days off, track task completion, and export schedules as PNG or PDF.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management and caching

**UI Framework**
- **Shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Material Design 3** principles with dark theme only
- Custom CSS variables for theming in both light/dark modes (dark mode enforced)

**Key Design Decisions**
- Dark-only theme with futuristic 2025 aesthetics (soft glows, gradients, glass morphism)
- Responsive-first approach with mobile optimization
- Custom font loading: InterKhmerLooped for Khmer, Outfit/Poppins for English
- Component-based architecture with strict separation of concerns

**Drag-and-Drop System**
- **@dnd-kit** library for accessible, performant drag-and-drop
- Sortable contexts for time slot reordering within and across days
- Visual feedback during drag operations (opacity, scale, glow effects)

**State Management Strategy**
- React Context API (`ScheduleContext`) for global schedule state
- LocalStorage persistence for activities, week schedules, and language preference
- Validation with Zod schemas before persistence
- No backend state synchronization - fully client-side data management

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript for REST API endpoints
- Development and production server configurations separated
- Hot module replacement in development via Vite middleware

**Database Strategy**
- **Drizzle ORM** configured for PostgreSQL (via Neon serverless driver)
- Schema defined for users table with UUID primary keys
- In-memory storage fallback (`MemStorage`) for development without database
- Database migrations managed through Drizzle Kit

**Key Decisions**
- Backend is minimal - most logic is client-side
- Storage interface abstraction allows switching between in-memory and database storage
- User authentication schema present but not actively used in current implementation
- Session management prepared with `connect-pg-simple` but not implemented

### Data Storage Solutions

**Client-Side Storage**
- LocalStorage for persistence of:
  - Activities list with English/Khmer names
  - Weekly schedule with time slots and completion status
  - User language preference (en/kh)
- Validation layer using Zod schemas ensures data integrity
- Fallback to default data if localStorage is corrupted or unavailable

**Data Models**
- **Activity**: Unique ID, English name, optional Khmer name
- **TimeSlot**: ID, day of week (0-6), time string, activity reference, completion flag
- **DaySchedule**: Day of week, day-off status, array of time slots
- **WeekSchedule**: Array of 7 day schedules

**Design Rationale**
- No server-side persistence required for MVP
- Reduces infrastructure complexity and costs
- Enables offline-first PWA functionality
- Data remains on user's device for privacy

### PWA Features

**Progressive Web App Implementation**
- Service Worker for offline caching (cache-first strategy)
- Web App Manifest with app metadata, icons, and display settings
- Installable on mobile devices and desktop
- Cache version management for updates

**Export Functionality**
- **html2canvas** for generating PNG snapshots of the schedule
- **jsPDF** for creating PDF exports
- Client-side generation without server dependency

## External Dependencies

### Third-Party Libraries

**UI Components**
- `@radix-ui/*` (multiple packages) - Unstyled, accessible component primitives
- `class-variance-authority` - Type-safe variant styling
- `cmdk` - Command menu component
- `react-hot-toast` - Toast notifications
- `lucide-react` - Icon library

**Drag and Drop**
- `@dnd-kit/core` - Core drag-and-drop functionality
- `@dnd-kit/sortable` - Sortable list utilities
- `@dnd-kit/utilities` - Helper utilities for transforms

**Forms and Validation**
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Validation resolver integration
- `zod` - TypeScript-first schema validation
- `drizzle-zod` - Zod schema generation from Drizzle schemas

**Date and Time**
- `date-fns` - Date manipulation and formatting

**Fonts**
- Google Fonts API for Outfit and Poppins fonts
- Local font file (InterKhmerLooped.ttf) for Khmer language support

### Database and ORM

**Database Connection**
- `@neondatabase/serverless` - Serverless PostgreSQL driver for Neon
- Connection string via `DATABASE_URL` environment variable

**ORM and Migrations**
- `drizzle-orm` - TypeScript ORM with SQL-like API
- `drizzle-kit` - CLI for migrations and schema management
- PostgreSQL dialect configured

### Development Tools

**Replit Integration**
- `@replit/vite-plugin-runtime-error-modal` - Error overlay in development
- `@replit/vite-plugin-cartographer` - Code navigation
- `@replit/vite-plugin-dev-banner` - Development environment indicator

**Build Tools**
- `esbuild` - Fast JavaScript bundler for server code
- `tsx` - TypeScript execution for development server
- `autoprefixer` - CSS vendor prefixing
- `postcss` - CSS processing

### Session Management

**Prepared but Not Active**
- `connect-pg-simple` - PostgreSQL session store for Express
- Session storage configured but authentication not implemented in current version