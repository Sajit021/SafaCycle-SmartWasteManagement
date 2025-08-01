<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Smart Waste Management App - Development Guidelines

## Project Overview

This is a React Native Expo application for smart waste management with role-based access control supporting Admin, Driver, and Customer user types.

## Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (v6+)
- **State Management**: Context API (planned)
- **Styling**: StyleSheet with custom theme system
- **Architecture**: Functional components with React Hooks

## Code Style Guidelines

- Use functional components with React Hooks exclusively
- Follow consistent naming conventions:
  - Components: PascalCase (e.g., `WelcomeScreen`, `CustomButton`)
  - Files: PascalCase for components, camelCase for utilities
  - Variables/functions: camelCase
- Use destructuring for props and imports
- Implement proper error handling and loading states

## Project Structure

```
src/
├── screens/          # Screen components (WelcomeScreen, LoginScreen, etc.)
├── components/       # Reusable UI components
├── navigation/       # Navigation configuration
├── context/          # Context providers for state management
├── utils/           # Utility functions and theme constants
└── assets/          # Images, fonts, and other static resources
```

## Styling Guidelines

- Use the centralized theme system from `src/utils/theme.js`
- Follow the green color scheme for environmental theme
- Implement consistent spacing using theme constants
- Use proper shadows and elevation for depth
- Ensure accessibility with proper contrast ratios

## Role-Based Features

- **Admin**: User management, analytics, route planning
- **Driver**: Task assignments, route navigation, progress tracking
- **Customer**: Collection scheduling, driver tracking, issue reporting

## Development Priorities

1. Frontend UI implementation with static/dummy data
2. Navigation flow between screens
3. Reusable component library
4. State management setup
5. Backend integration (future phase)
6. ML model integration (future phase)

## Best Practices

- Keep components modular and reusable
- Implement proper loading and error states
- Use TypeScript-style JSDoc comments for better IntelliSense
- Test on both iOS and Android simulators
- Follow React Native performance best practices
- Implement proper keyboard handling for forms
