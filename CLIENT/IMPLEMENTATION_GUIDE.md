# LMS Client Implementation Guide

Welcome to the **St. Joseph's College LMS Client** developer guide. This document provides a detailed overview of the project architecture, design patterns, and step-by-step instructions for implementing new features.

---

## 🏛️ Architecture Overview

The system is built with a focus on **permission-based navigation**, **dynamic routing**, and **modular components**.

### 1. Dynamic Routing & Rendering
All application routes are defined in a centralized configuration rather than being hardcoded in `App.tsx`.
- **Config**: [routeConfig.ts](file:///Users/ashwinsi/projects/LMS/CLIENT/src/constants/routeConfig.ts)
- **Renderer**: [RouteRenderer.tsx](file:///Users/ashwinsi/projects/LMS/CLIENT/src/config/RouteRenderer.tsx)

This allows the UI to automatically filter the sidebar and restrict route access based on the user's permissions loaded from the backend.

### 2. State Management (Redux)
We use Redux Toolkit for managing persistent global state:
- **`jwtSlice`**: Manages authentication tokens and user identity.
- **`permissionsSlice`**: Stores the user's role and permission list.
- **`loadingSlice`**: Global loading state for API transitions.

### 3. Permission System
Permissions are structured as a hierarchy in [permissions.ts](file:///Users/ashwinsi/projects/LMS/CLIENT/src/constants/permissions.ts).
- **Admin**: `admin.dashboard.view`, `admin.rewards.create`, etc.
- **Client**: `client.access`.

---

## 📂 Feature Structure

Every major feature (e.g., Rewards) should follow this folder structure within `src/pages/admin/` or `src/pages/client/`:

```
<feature_name>/
├── api/             # Feature-specific API calls
│   └── api.ts
├── pages/           # Page components
│   ├── PageOne.tsx
│   ├── PageTwo.tsx
│   └── index.ts     # Centralized exports
├── types/           # TS Interfaces & Types
│   └── index.ts
```

> [!TIP]
> This modularity makes it easy to isolate logic and types, reducing circular dependencies.

---

## 🚀 How to Add a New Page

Following the standard pattern ensures your page is automatically protected and added to the sidebar correctly.

### Step 1: Create the Components
1. Create a folder in `src/pages/admin/` or `src/pages/client/`.
2. Implement your page components.
3. Export them from the feature's `index.ts` and then from the main `src/pages/index.ts`.

### Step 2: Define Permissions (if Admin)
Add the required permission to [permissions.ts](file:///Users/ashwinsi/projects/LMS/CLIENT/src/constants/permissions.ts):

```typescript
export const ADMIN_PERMISSIONS = {
  // ...
  NEW_FEATURE: {
    VIEW: "admin.new_feature.view",
  },
};
```

### Step 3: Add to Route Map
Update [routeConfig.ts](file:///Users/ashwinsi/projects/LMS/CLIENT/src/constants/routeConfig.ts) by adding your route to the `ADMIN_ROUTE_MAP` or `CLIENT_ROUTE_MAP`.

```typescript
NEW_FEATURE: {
  path: "/dashboard/admin/new-feature",
  permission: ADMIN_PERMISSIONS.NEW_FEATURE.VIEW,
  label: "New Feature",
  icon: React.createElement(Star, { size: 18 }),
  component: NewFeatureComponent,
},
```

---

## 🎨 Styling Guidelines

We use **TailwindCSS 4** with a custom design system defined in [index.css](file:///Users/ashwinsi/projects/LMS/CLIENT/src/index.css).

> [!IMPORTANT]
> **ALWAYS use CSS variables from `index.css`**. Never use hardcoded colors, gradients, or custom values. This ensures consistency across light/dark themes and maintains a cohesive design system.

### Design System Variables

#### Color Variables (MANDATORY)
Always use these CSS variables for colors:

```css
/* Background & Surface */
--background         /* Page background */
--surface-color      /* Card/component background */
--bg-muted          /* Muted background areas */
--bg-code           /* Code block backgrounds */

/* Text */
--text-primary      /* Primary text color */
--text-secondary    /* Secondary/muted text */

/* Interactive */
--accent            /* Primary action color (buttons, links) */
--accent-hover      /* Hover state for accent */
--border-color      /* Borders and dividers */

/* Status */
--success           /* Success states */
--warning           /* Warning states */
--error             /* Error states */

/* Glassmorphism */
--glass-bg          /* Glass background */
--glass-border      /* Glass border */
--glass-hover       /* Glass hover state */
```

#### Spacing & Layout
Use **Tailwind spacing utilities** for consistency:
- **Padding**: `p-4`, `p-6`, `p-8`, `p-12`, `p-16`
- **Margin**: `m-2`, `m-4`, `m-6`, `m-8`, `mb-12`
- **Gap**: `gap-4`, `gap-6`, `space-y-4`, `space-y-6`

**Standard spacing scale**:
- `4` = 1rem (16px) - Small spacing
- `6` = 1.5rem (24px) - Medium spacing
- `8` = 2rem (32px) - Large spacing
- `12` = 3rem (48px) - Extra large spacing
- `16` = 4rem (64px) - Section spacing

### ❌ Prohibited Practices

**NEVER do the following**:
- ❌ Hardcoded colors: `#2563eb`, `rgb(37, 99, 235)`, `blue-600`
- ❌ Hardcoded gradients: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- ❌ Inline margin/padding values: `style={{ padding: 8 }}`
- ❌ Custom border colors: `border-gray-200`, `border-blue-500`
- ❌ Arbitrary text colors: `text-gray-600`, `text-blue-600`

### ✅ Correct Practices

**DO use Tailwind CSS utility classes with CSS variable references**:
```tsx
// ✅ BEST - Using Tailwind classes with CSS variables
<div className="bg-[var(--surface-color)] border border-[var(--border-color)] text-[var(--text-primary)]">

// ✅ CORRECT - Using Tailwind spacing
<div className="p-8 mb-6 space-y-4">

// ✅ CORRECT - Hover and focus states with Tailwind
<input className="border-2 border-[var(--border-color)] focus:border-[var(--accent)]" />

<button className="bg-[var(--accent)] hover:bg-[var(--accent-hover)]" />

<a className="text-[var(--accent)] hover:text-[var(--accent-hover)]" />
```

**Only use inline styles for complex dynamic values**:
```tsx
// ✅ Acceptable for box-shadow, border-radius, etc.
<div style={{ borderRadius: '24px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)' }}>
```


### Design Aesthetic
- **Clean & Modern**: Minimal, spacious layouts with clear hierarchy
- **Consistent Spacing**: Use the standard spacing scale
- **Subtle Interactions**: Smooth transitions (200-300ms)
- **Accessibility**: Proper contrast, focus states, and semantic HTML

### Custom Utilities (Optional)
Use these sparingly for special effects:
- `custom-hilight`: Animated gradient backgrounds
- `button-hilight`: Premium animated buttons
- `scrollbar-hide`: Hide scrollbars while maintaining functionality
- `animate-fadeIn`, `animate-float`, `animate-glow`: Micro-animations

### Typography
Use Tailwind text utilities with CSS variable colors:
```tsx
<h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
<p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
```

---

## 📡 API Integration

Always use the centralized `ApiService` for consistent interceptor handling (JWT injection, 401 redirection).

```typescript
// example use in a feature api
import { ApiService } from "../../api/apiservice";

export const getFeatureData = async () => {
  const response = await ApiService.get("/feature-endpoint");
  return response.data;
};
```

> [!IMPORTANT]
> The `ApiService` automatically handles token refreshes (if implemented) and unauthorized redirects to the login page.

