export const fontFamilies = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

export const typography = {
  h1: {
    fontFamily: fontFamilies.bold,
    fontSize: 32,
    lineHeight: 38.4,
  },
  h2: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 24,
    lineHeight: 31.2,
  },
  h3: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 20,
    lineHeight: 26,
  },
  h4: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    lineHeight: 22.4,
  },
  bodyLarge: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 25.6,
  },
  bodyMedium: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 22.4,
  },
  bodySmall: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    lineHeight: 20.8,
  },
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    lineHeight: 15.4,
  },
} as const;

export type TypographyToken = keyof typeof typography;
