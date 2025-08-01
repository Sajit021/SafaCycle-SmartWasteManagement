# Smart Waste Management App

A role-based mobile application built with React Native and Expo for efficient waste collection and management.

## 🎯 Project Overview

This app provides a comprehensive solution for smart waste management with three distinct user roles:

- **Admin**: Manage users, drivers, routes, and analytics
- **Driver**: Handle daily tasks, track collection routes, and report issues
- **Customer**: Schedule collections, track drivers, and manage waste requests

## 🚀 Features

### Current Implementation (Phase 1)

- ✅ Welcome screen with app introduction
- ✅ Navigation setup with React Navigation
- ✅ Placeholder login and signup screens
- ✅ Clean project structure and components
- ✅ Custom theme system with green environmental colors
- ✅ Reusable UI components

### Planned Features (Upcoming Phases)

- 🔄 Complete authentication system with role selection
- 🔄 Role-based dashboards and navigation
- 🔄 Driver tracking and route management
- 🔄 Camera integration for waste scanning
- 🔄 Push notifications and reminders
- 🔄 Backend integration with MongoDB
- 🔄 ML model integration for smart features

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **State Management**: Context API (planned)
- **Styling**: StyleSheet with custom theme
- **Backend**: MongoDB (future integration)
- **ML**: Custom trained model (future integration)

## 📁 Project Structure

```
src/
├── screens/          # Screen components
│   ├── WelcomeScreen.js
│   ├── LoginScreen.js
│   └── SignupScreen.js
├── components/       # Reusable UI components
│   └── CustomButton.js
├── navigation/       # Navigation configuration
│   └── AppNavigator.js
├── utils/           # Utilities and theme
│   └── theme.js
└── context/         # State management (planned)
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd smart-waste-management
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   # or
   npx expo start
   ```

4. **Run on device/simulator**

   ```bash
   # For Android
   npm run android

   # For iOS (macOS only)
   npm run ios

   # For web
   npm run web
   ```

## 📱 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (macOS only)
- `npm run web` - Run in web browser

## 🎨 Design System

The app uses a consistent design system with:

- **Primary Color**: Sea Green (#2E8B57) - representing environmental theme
- **Typography**: System fonts with consistent sizing
- **Spacing**: Standardized padding and margins
- **Components**: Reusable UI elements with consistent styling

## 🔮 Roadmap

### Phase 1: Frontend Foundation ✅

- [x] Project setup and navigation
- [x] Welcome screen implementation
- [x] Basic component structure

### Phase 2: Authentication & Onboarding 🔄

- [ ] Complete login/signup forms
- [ ] Role selection system
- [ ] User onboarding flow

### Phase 3: Core Features 🔄

- [ ] Role-based dashboards
- [ ] Driver tracking interface
- [ ] Customer management screens

### Phase 4: Advanced Features 🔄

- [ ] Camera integration
- [ ] Push notifications
- [ ] Offline support

### Phase 5: Backend Integration 🔄

- [ ] MongoDB integration
- [ ] API development
- [ ] Real-time features

### Phase 6: Smart Features 🔄

- [ ] ML model integration
- [ ] Automated waste classification
- [ ] Predictive analytics

## 🤝 Contributing

This project follows standard React Native development practices:

1. Use functional components with hooks
2. Follow the established folder structure
3. Maintain consistent styling with the theme system
4. Write clean, readable code with proper comments

## 📄 License

This project is developed as a capstone project for educational purposes.

## 📞 Contact

For questions or suggestions, please reach out to the development team.
