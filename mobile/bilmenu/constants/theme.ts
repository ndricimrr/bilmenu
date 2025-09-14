// BilMenu Mobile App Theme - Based on webapp colors
export const BilMenuTheme = {
  colors: {
    // Primary colors from webapp
    primary: "#1a2a5c", // Main dark blue background
    primaryLight: "#1e2f6b", // Lighter blue for accents
    secondary: "#ff9434", // Orange accent color
    secondaryDark: "#ff6b35", // Darker orange
    secondaryLight: "#ffae31", // Light orange

    // Background colors
    background: "#1a2a5c", // Main background
    surface: "rgba(255, 255, 255, 0.95)", // Card backgrounds
    surfaceLight: "rgba(255, 255, 255, 0.1)", // Light overlays

    // Text colors
    text: "#333", // Dark text
    textLight: "#666", // Light text
    textWhite: "#ffffff", // White text
    textMuted: "rgba(255, 255, 255, 0.8)", // Muted white text

    // Status colors
    success: "#4caf50",
    warning: "#ff9800",
    error: "#f83f35",

    // Border colors
    border: "rgba(255, 255, 255, 0.2)",
    borderLight: "rgba(255, 255, 255, 0.1)",

    // Switch colors
    switchTrack: "#767577",
    switchTrackActive: "#81b0ff",
    switchThumb: "#f4f3f4",
    switchThumbActive: "#f5dd4b",
  },

  gradients: {
    primary: "linear-gradient(135deg, #ff9434, #ff6b35)",
    primaryReverse: "linear-gradient(135deg, #ff6b35, #ff9434)",
    surface:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))",
  },

  shadows: {
    small: "0 2px 8px rgba(0, 0, 0, 0.1)",
    medium: "0 4px 16px rgba(0, 0, 0, 0.15)",
    large: "0 8px 32px rgba(0, 0, 0, 0.2)",
    card: "0 16px 48px rgba(0, 0, 0, 0.15)",
  },

  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 20,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },

  typography: {
    title: {
      fontSize: 24,
      fontWeight: "700" as const,
      lineHeight: 32,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: "600" as const,
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      fontWeight: "400" as const,
      lineHeight: 22,
    },
    caption: {
      fontSize: 14,
      fontWeight: "400" as const,
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontWeight: "400" as const,
      lineHeight: 16,
    },
  },
};
