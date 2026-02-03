# Health & Fitness MVP - Design Guidelines

## Brand Identity
**Purpose**: Home office fitness app for a 23-year-old user (50kg) focused on calorie tracking and micro-workouts.

**Personality**: Motivational, immediate, friction-free. The app removes barriers to healthy habits through instant logging and contextual nudging.

**Memorable Element**: Sub-3-second food logging with celebration confetti/shimmer feedback. No pop-ups, no friction.

## Navigation Architecture
**Type**: Tab Navigation (3 tabs)

**Screens**:
1. **Dashboard (Home)** - Quick-add food items, weight trend graph, daily summary
2. **Exercise** - 10-minute pre-sleep workout routine with timer
3. **Profile/Settings** - Streak management, notification preferences, user stats

## Screen-by-Screen Specifications

### 1. Dashboard (Home Tab)
**Purpose**: Instant food/supplement logging and progress visualization.

**Layout**:
- Header: Transparent, greeting text (e.g., "Olá, [Name]"), right button for settings
- Content: Scrollable
- Top inset: headerHeight + Spacing.xl
- Bottom inset: tabBarHeight + Spacing.xl

**Components**:
- **Quick-Add Buttons Section**: Grid of large, tappable cards for pre-defined meals:
  - "Pão com Nutella"
  - "Iogurte + Granola"
  - "Burger Blend"
  - "Shot de Mel" (Honey Shot - Energy Boost widget, prominent placement)
  - "Shake de Whey"
- **Weight Trend Graph (CTM Method)**: Line chart showing weekly moving averages. Use neutral colors (blue/green), avoid red. Display current weight and trend arrow.
- **Daily Summary Cards**: Calories consumed vs. target, exercise status (completed/pending)

**Interaction**: Tapping a quick-add button logs the item instantly with visual feedback (confetti animation or shimmer effect). No confirmation dialogs.

### 2. Exercise Screen
**Purpose**: Guide user through 10-minute pre-sleep workout routine.

**Layout**:
- Header: Default with title "Treino de 10min"
- Content: Scrollable list of exercise cards
- Top inset: Spacing.xl
- Bottom inset: tabBarHeight + Spacing.xl

**Components**:
- **Primary CTA Button (Top)**: "Estender o Tapete" (Roll Out the Mat) - large, prominent button to trigger identity/habit formation
- **Exercise Cards**: Vertical list with:
  - Exercise name (Prancha Abdominal, Agachamento na Parede, Panturrilha)
  - Illustration/icon for each exercise
  - Built-in timer (progressive)
  - Start/Complete button
- **Completion Reward**: After finishing all exercises, show "Recompensa Liberada: Shot de Mel / Shake de Whey" with celebratory animation

### 3. Profile/Settings Screen
**Purpose**: Manage streaks, notifications, and user progression.

**Layout**:
- Header: Default with title "Perfil"
- Content: Scrollable
- Top inset: Spacing.xl
- Bottom inset: tabBarHeight + Spacing.xl

**Components**:
- **User Card**: Avatar, display name, current tier (e.g., "Ectomorfo Sedentário" → "Atleta Home Office")
- **Streak Display**: Current streak count with "Streak Freezes" available (2 per month)
- **Notification Settings**:
  - Toggle for contextual triggers (PC events: closing laptop, meeting start)
  - Custom phrases: Climate-based (sunny = loss-framed, cloudy = gain-framed)
  - Posture reminders during work hours
  - 18h "Shutdown Ritual" reminder
- **App Preferences**: Theme, language

## Color Palette
- **Primary**: Vibrant green (#4CAF50) for growth/progress
- **Secondary**: Energizing orange (#FF9800) for workout/action buttons
- **Background**: White (#FFFFFF)
- **Surface**: Light gray (#F5F5F5) for cards
- **Text Primary**: Dark gray (#212121)
- **Text Secondary**: Medium gray (#757575)
- **Success**: Blue-green (#00BCD4) for weight graph (avoid red)
- **Accent**: Gold (#FFC107) for streaks/rewards

## Typography
- **Font**: System default (Roboto for Android, SF Pro for iOS)
- **Heading 1**: 28pt, Bold
- **Heading 2**: 20pt, Semibold
- **Body**: 16pt, Regular
- **Caption**: 14pt, Regular

## Visual Design
- Quick-add buttons use flat design with subtle shadows on press
- Celebration animations (confetti, shimmer) trigger on successful logging
- Exercise cards have clear visual hierarchy with icons
- Weight graph uses smooth curves with area fill

## Assets to Generate
1. **icon.png** - App icon with fitness/health motif (dumbbell or growth symbol)
2. **splash-icon.png** - Launch screen icon
3. **exercise-plank.png** - Illustration for Prancha Abdominal card
4. **exercise-wall-squat.png** - Illustration for Agachamento na Parede card
5. **exercise-calf-raise.png** - Illustration for Panturrilha card
6. **empty-workouts.png** - Empty state for exercise history (not provided in initial spec but recommended)
7. **reward-honey.png** - Icon/illustration for Shot de Mel quick-add button
8. **reward-whey.png** - Icon/illustration for Shake de Whey quick-add button
9. **avatar-default.png** - Default user avatar for Profile screen

**WHERE USED**:
- icon.png: Device home screen
- splash-icon.png: App launch
- exercise-*.png: Exercise Screen cards
- reward-*.png: Dashboard quick-add buttons
- avatar-default.png: Profile Screen user card
- empty-workouts.png: Exercise history when no workouts logged

## Technical Notes
- Implement Firebase Auth for data persistence
- Use local notifications for contextual reminders
- Quick-add logging must complete in <3 seconds
- Charts library for weight trend visualization (CTM method with weekly moving averages)