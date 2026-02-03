# FitHome - Health & Fitness MVP

## Overview

FitHome is a mobile health and fitness application built with React Native/Expo targeting a 23-year-old home office user (50kg) focused on calorie tracking and micro-workouts. The app emphasizes friction-free logging (sub-3-second food entries), gamification through streaks, and contextual habit nudging.

**Core Features:**
- Quick-add food logging with instant visual feedback (confetti/shimmer animations)
- Weight trend visualization using CTM (moving averages) method
- 10-minute pre-sleep workout routines with timer-based exercises
- Streak gamification with "Streak Freezes" and tier progression
- Pull-up counter tracking
- Posture reminders for home office workers

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React Native with Expo SDK 54 (New Architecture enabled)
- **Navigation**: React Navigation v7 with bottom tabs and native stack navigators
- **State Management**: TanStack React Query for server state, local React state for UI
- **Animations**: React Native Reanimated for performant animations and gesture feedback
- **Styling**: StyleSheet-based with a comprehensive theme system supporting light/dark modes
- **Haptic Feedback**: Expo Haptics for tactile responses on user interactions

### Directory Structure
```
client/           - React Native/Expo frontend
  components/     - Reusable UI components
  screens/        - Screen-level components
  navigation/     - Navigation configuration
  constants/      - Theme, static data, colors
  hooks/          - Custom React hooks
  lib/            - Utilities (storage, query client)
  types/          - TypeScript type definitions
server/           - Express.js backend
shared/           - Shared schema definitions (Drizzle ORM)
```

### Backend Architecture
- **Runtime**: Node.js with Express.js v5
- **API Pattern**: RESTful endpoints under `/api` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod via drizzle-zod integration
- **Storage**: Currently uses in-memory storage (`MemStorage` class) with PostgreSQL schema defined

### Data Persistence Strategy
- **Client-side**: AsyncStorage for local data (food logs, weight entries, workout logs, user stats)
- **Server-side**: PostgreSQL database (via DATABASE_URL environment variable)
- **Sync Pattern**: Designed for offline-first with local storage, backend ready for future sync

### Key Design Patterns
1. **Instant Feedback Pattern**: All logging actions trigger immediate haptic + visual feedback without confirmation dialogs
2. **Theme System**: Centralized color tokens in `constants/theme.ts` with `useTheme` hook for consistent styling
3. **Error Boundary**: Class-based error boundary with development mode detailed error view
4. **Path Aliases**: `@/` maps to `client/`, `@shared/` maps to `shared/`

### Build Configuration
- **Development**: Expo packager with proxy configuration for Replit environment
- **Production**: Static web build via custom build script, server bundled with esbuild
- **Database Migrations**: Drizzle Kit for schema management (`drizzle-kit push`)

## External Dependencies

### Core Services
- **Database**: PostgreSQL (configured via `DATABASE_URL` environment variable)
- **Expo Services**: Splash screen, fonts (Nunito via Google Fonts), haptics, linear gradients

### Key Third-Party Libraries
| Category | Library | Purpose |
|----------|---------|---------|
| Navigation | @react-navigation/* | Tab and stack navigation |
| Data | @tanstack/react-query | Server state management |
| Storage | @react-native-async-storage | Local persistence |
| Animation | react-native-reanimated | Performant animations |
| Database | drizzle-orm, pg | PostgreSQL ORM |
| Date | date-fns | Date formatting (Portuguese locale support) |
| UI | expo-blur, expo-linear-gradient | Visual effects |
| Charts | react-native-svg | Custom weight chart rendering |

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `EXPO_PUBLIC_DOMAIN` - API server domain for client requests
- `REPLIT_DEV_DOMAIN` - Development domain (Replit-specific)