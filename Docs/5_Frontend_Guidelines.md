# Frontend Guidelines - Traveloop

This document establishes the patterns and guidelines for the **React** and **Tailwind CSS** frontend. The goal is to create a dynamic, premium, and highly responsive user interface.

## 1. Project Structure

```text
src/
├── assets/          # Static files (images, icons)
├── components/      # Reusable UI components (Buttons, Inputs, Cards)
│   ├── common/      # Generic UI (Button, Modal, Input)
│   ├── itinerary/   # Specific to Itinerary Builder (StopCard, ActivityList)
│   └── layout/      # Navbar, Sidebar, Footer
├── contexts/        # React Contexts (AuthContext, ThemeContext)
├── hooks/           # Custom hooks (useAuth, useTripData)
├── pages/           # Route-level components (Dashboard, TripBuilder, Profile)
├── services/        # API client files (authService.js, tripService.js)
├── store/           # Zustand store for complex global states
└── utils/           # Helper functions (date formatters, currency converters)
```

## 2. Styling with Tailwind CSS

### 2.1. Premium Aesthetics
- **Color Palette:** Avoid stark primary colors. Use custom HSL palettes defined in `tailwind.config.js`.
  - Primary: Sleek Indigo/Violet shades for action buttons.
  - Background: Off-whites (e.g., `#f8fafc`) for light mode, deep slate (`#0f172a`) for dark mode.
- **Typography:** Use modern fonts like `Inter` or `Outfit`.
  - Import via Google Fonts in `index.css`.
  - Configure in `tailwind.config.js`: `fontFamily: { sans: ['Inter', 'sans-serif'] }`.
- **Glassmorphism & Shadows:** Use Tailwind's `backdrop-blur-md` and `bg-white/70` for floating headers or modals. Apply soft shadows `shadow-sm` and `shadow-md` for cards to create depth.

### 2.2. Dynamic Design (Micro-Animations)
- All interactive elements MUST have hover states (e.g., `hover:bg-primary-dark`, `hover:shadow-lg`).
- Use `transition-all duration-300 ease-in-out` on buttons and cards.
- Use `framer-motion` for page transitions and complex staggered list animations (e.g., when rendering activities in the itinerary).

## 3. State Management Strategy

### 3.1. Local vs. Global State
- **Local State (`useState`):** Form inputs, modal visibility, toggle switches.
- **Global State (Zustand):** The `ItineraryBuilder` requires complex state (reordering cities, adding activities to specific dates). A Zustand store `useItineraryStore` is recommended to prevent excessive prop-drilling and unnecessary re-renders.
- **Server State (React Query):** Use `@tanstack/react-query` to handle fetching, caching, and updating API data (Trips, Auth, Cities). This handles loading states and error handling elegantly.

## 4. MapBox Integration (`react-map-gl`)

### 4.1. Setup
- Install: `npm install react-map-gl mapbox-gl`
- Use a custom MapBox style URL for a premium look (e.g., `mapbox://styles/mapbox/navigation-night-v1` or a custom studio style).

### 4.2. Implementation Guidelines
- **Markers:** Render custom React components as markers on the map using the `<Marker>` component for each `Stop`.
- **Connecting Routes:** Use MapBox's `<Source>` and `<Layer>` components with GeoJSON to draw lines connecting the cities in the itinerary.
- **Interactivity:** Clicking a marker should center the map and open a popup with the city's planned activities.

## 5. Routing Security

- Implement `ProtectedRoute` wrappers using `react-router-dom`.
- If a user is not authenticated, redirect them to `/login`.
- If a user tries to access a `Trip` they don't own (and the `is_public` flag is false), show a 403 Forbidden or 404 Not Found page.
