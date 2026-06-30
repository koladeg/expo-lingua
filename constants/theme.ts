import { colors, fontFamilies } from '@/theme';

export const Colors = {
  light: {
    text: colors.text,
    background: colors.background,
    tint: colors.primaryDeep,
    icon: colors.textSecondary,
    tabIconDefault: colors.textSecondary,
    tabIconSelected: colors.primaryDeep,
    border: colors.border,
    surface: colors.surface,
  },
  dark: {
    text: colors.text,
    background: colors.background,
    tint: colors.primaryDeep,
    icon: colors.textSecondary,
    tabIconDefault: colors.textSecondary,
    tabIconSelected: colors.primaryDeep,
    border: colors.border,
    surface: colors.surface,
  },
};

export const Fonts = {
  sans: fontFamilies.regular,
  rounded: fontFamilies.semiBold,
  mono: fontFamilies.regular,
  regular: fontFamilies.regular,
  medium: fontFamilies.medium,
  semiBold: fontFamilies.semiBold,
  bold: fontFamilies.bold,
};

export { colors, fontFamilies };
