# AI Rules for Saad Bin Zain Portfolio

## Tech Stack Overview

- **Framework**: React 18 + TypeScript with Vite build system
- **Styling**: Tailwind CSS 3.4 with custom CSS variables for theming (dark luxury aesthetic)
- **UI Components**: shadcn/ui component library (Radix UI primitives + Tailwind)
- **Animation**: GSAP + ScrollTrigger for scroll-driven animations; Framer Motion for React state-based animations
- **3D/WebGL**: React Three Fiber (@react-three/fiber) + Three.js + @react-three/drei for 3D scenes
- **Smooth Scroll**: Lenis (@studio-freight/lenis) for buttery smooth scrolling with GSAP ScrollTrigger integration
- **State Management**: TanStack Query (React Query) for server state; React hooks for local state
- **Routing**: React Router v6 for client-side navigation
- **Icons**: Lucide React (consistent iconography)

## Coding Rules

### Component Architecture
- **ALWAYS** create new files for every new component or hook, no matter how small
- **NEVER** add new components to existing files, even if they seem related
- Aim for components that are 100 lines of code or less
- Use `"use client"` directive for client-side components (required for GSAP, Three.js, etc.)
- Keep pages in `src/pages/` and reusable components in `src/components/`

### Styling Guidelines
- **ALWAYS** use Tailwind CSS for styling components
- Use the custom CSS variables defined in `src/index.css` for colors:
  - `--gold: 40 46% 56%` (primary accent)
  - `--charcoal: 0 0% 3%` (dark backgrounds)
  - `--gallery-white: 0 0% 97.6%` (light text)
- Use `font-family: var(--font-serif)` for headings (Playfair Display, Cormorant Garamond)
- Use `font-family: var(--font-sans)` for body text (Inter)
- Use `gold-text-gradient` and `gold-gradient` utility classes for gold effects
- Use `hsl()` notation with CSS variables for theming consistency

### Animation Libraries - When to Use What

**Use GSAP + ScrollTrigger when:**
- Creating scroll-driven animations (pinning, scrubbing, timeline-based)
- Need precise control over animation timing and sequencing
- Animating DOM elements based on scroll position
- Creating complex timeline animations with multiple steps

**Use Framer Motion when:**
- Animating React component state changes (mount/unmount, hover, tap)
- Need spring physics-based animations
- Creating gesture-based interactions (drag, pan)
- AnimatePresence for exit animations

**Use CSS/Tailwind when:**
- Simple hover states and transitions
- Keyframe animations (defined in `tailwind.config.ts`)
- Basic opacity/transform transitions

### 3D/WebGL Guidelines
- **ALWAYS** use React Three Fiber for Three.js integration (declarative React patterns)
- Use `@react-three/drei` for utilities (Float, Reflector, RoundedBox, etc.)
- Keep 3D scenes in dedicated components (e.g., `GoldFluidScene.tsx`, `BankingAdvantage.tsx`)
- Use `dpr={[1, 1.5]}` or `dpr={[1, 1.7]}` for performance optimization on high-DPI screens
- Use `gl={{ antialias: true, alpha: true }}` for transparent backgrounds
- Always import `* as THREE from "three"` when working with Three.js primitives

### Smooth Scroll Integration
- **ALWAYS** use Lenis for smooth scrolling (already configured in `Index.tsx`)
- Sync Lenis with GSAP ScrollTrigger: `lenis.on("scroll", ScrollTrigger.update)`
- Use `gsap.ticker.lagSmoothing(0)` for smooth animation frames
- Register ScrollTrigger: `gsap.registerPlugin(ScrollTrigger)`

### Font Usage
- **Headings**: `'Playfair Display', serif` (font-weight: 200 for elegance)
- **Body/Labels**: `'Inter', sans-serif` (tracking: 0.3em for uppercase labels)
- **Accent text**: `'Cormorant Garamond', serif` (for descriptions and quotes)
- Use `clamp()` for responsive font sizing

### State Management
- Use React Query for any server/API state
- Use `useRef` for GSAP animations (avoid state for animation refs)
- Use `useState` for UI state (active tabs, toggles, etc.)
- Custom hooks go in `src/hooks/` (e.g., `use-toast.ts`, `use-mobile.tsx`)

### Performance Rules
- Use `will-change: transform, opacity` on animated elements
- Use `transform` and `opacity` for animations (GPU accelerated)
- Lazy load 3D scenes and heavy components
- Use `Suspense` for 3D components with fallback UI
- Optimize images (WebP format, lazy loading)

### Import Conventions
- Use `@/` alias for imports from `src/` (e.g., `@/components/ui/button`)
- Import React hooks explicitly: `import { useEffect, useRef } from "react"`
- Import GSAP plugins: `import { ScrollTrigger } from "gsap/ScrollTrigger"`
- Import Three.js as: `import * as THREE from "three"`

### Responsive Design
- **ALWAYS** generate responsive designs
- Mobile-first approach with Tailwind breakpoints (`md:`, `lg:`)
- Use `hidden lg:block` pattern for conditional rendering
- Test touch interactions on mobile (custom cursor should disable on touch)

### Color Palette (Strict)
- **Primary Gold**: `hsl(40 46% 56%)` / `#C5A059`
- **Gold Light**: `hsl(40 50% 70%)`
- **Gold Dark**: `hsl(40 40% 40%)`
- **Background**: `hsl(0 0% 3%)` / `#080808`
- **Text**: `hsl(0 0% 97.6%)` / off-white
- **Muted**: `hsl(0 0% 50%)` for secondary text

### File Structure
```
src/
├── components/          # Reusable components
│   ├── ui/               # shadcn/ui components (don't edit directly)
│   ├── [Feature].tsx     # Feature components
│   └── [Scene].tsx       # 3D scenes
├── pages/               # Route pages
├── hooks/               # Custom React hooks
├── lib/                 # Utilities (cn function)
├── assets/              # Images, fonts
└── index.css            # Global styles + CSS variables
```

### Testing
- Use Vitest for unit testing
- Use React Testing Library for component testing
- Test files: `*.test.ts` or `*.spec.ts`

### Build & Deploy
- Vite handles the build process
- Port 8080 for development
- Optimize deps include: `gsap`, `three`, `@react-three/fiber`, `framer-motion`, `lenis`