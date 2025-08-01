// Theme constants for Smart Waste Management App
export const COLORS = {
  // Primary colors - Green theme for environmental/waste management
  primary: "#2E8B57", // Sea green
  primaryDark: "#1E5631", // Dark green
  primaryLight: "#90EE90", // Light green

  // Secondary colors
  secondary: "#FF6B35", // Orange for alerts/warnings
  accent: "#4A90E2", // Blue for information

  // Neutral colors
  background: "#f0f8f5", // Very light green
  surface: "#ffffff", // White
  white: "#ffffff", // White
  text: "#333333", // Dark gray
  textSecondary: "#666666", // Medium gray
  textLight: "#999999", // Light gray

  // Border colors
  border: "#E5E5E5", // Light border

  // Status colors
  success: "#28A745", // Green
  warning: "#FFC107", // Yellow
  error: "#DC3545", // Red
  info: "#17A2B8", // Cyan

  // Role-based colors
  admin: "#8E44AD", // Purple
  driver: "#3498DB", // Blue
  customer: "#E67E22", // Orange
};

export const SIZES = {
  // Base unit
  base: 8,

  // Padding and margins
  padding: 16,
  small: 8,
  medium: 16,
  large: 24,
  extraLarge: 32,

  // Font sizes (Typography)
  caption: 12,
  body: 14,
  h4: 16,
  h3: 18,
  h2: 20,
  h1: 24,
  title: 28,

  fontSmall: 14,
  fontMedium: 16,
  fontLarge: 18,
  fontExtraLarge: 24,
  fontTitle: 28,
  fontHeader: 32,

  // Border radius
  radius: 8,
  radiusSmall: 8,
  radiusMedium: 12,
  radiusLarge: 16,

  // Border
  border: 1,

  // Button heights
  buttonHeight: 48,
  inputHeight: 52,
};

export const FONTS = {
  regular: "System",
  medium: "System",
  bold: "System",

  // Font weights
  weightLight: "300",
  weightRegular: "400",
  weightMedium: "500",
  weightBold: "700",
};

export const SHADOWS = {
  light: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

// Default theme object that combines all theme constants
const theme = {
  COLORS,
  SIZES,
  FONTS,
  SHADOWS,
};

export { theme };
export default theme;
