export const palette = {
  primary: {
    purple: "#6C4EF5",
    deepPurple: "#5B3BF6",
    blue: "#4D8BFF",
    green: "#21C16B",
  },
  semantic: {
    success: "#21C16B",
    warning: "#FFC800",
    streak: "#FF8A00",
    error: "#FF4D4F",
    info: "#4D8BFF",
  },
  neutral: {
    textPrimary: "#0D132B",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    surface: "#F6F7FB",
    background: "#FFFFFF",
  },
} as const;

export const colors = {
  brand: palette.primary.deepPurple,
  primary: palette.primary.purple,
  primaryDeep: palette.primary.deepPurple,
  primaryBlue: palette.primary.blue,
  primaryGreen: palette.primary.green,
  success: palette.semantic.success,
  warning: palette.semantic.warning,
  streak: palette.semantic.streak,
  error: palette.semantic.error,
  info: palette.semantic.info,
  text: palette.neutral.textPrimary,
  textSecondary: palette.neutral.textSecondary,
  border: palette.neutral.border,
  surface: palette.neutral.surface,
  background: palette.neutral.background,
} as const;

export type AppColorName = keyof typeof colors;
