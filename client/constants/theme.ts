import { Platform } from "react-native";

const tintColorLight = "#5B67F5";
const tintColorDark = "#7C85FF";

export const AppColors = {
  primary: "#5B67F5",
  primaryLight: "#E8EAFF",
  secondary: "#FF9800",
  secondaryLight: "#FFF3E0",
  success: "#4CAF50",
  successLight: "#E8F5E9",
  teal: "#00BFA5",
  tealLight: "#E0F7F4",
  orange: "#FF7043",
  orangeGradientStart: "#FF9A56",
  orangeGradientEnd: "#FF6B35",
  purple: "#7C4DFF",
  purpleLight: "#EDE7F6",
  gold: "#FFD700",
  gray100: "#F8F9FA",
  gray200: "#F1F3F5",
  gray300: "#E9ECEF",
  gray400: "#DEE2E6",
  gray500: "#ADB5BD",
  gray600: "#6C757D",
  gray700: "#495057",
  gray800: "#343A40",
  gray900: "#212529",
  white: "#FFFFFF",
  black: "#000000",
};

export const Colors = {
  light: {
    text: "#212529",
    textSecondary: "#6C757D",
    buttonText: "#FFFFFF",
    tabIconDefault: "#ADB5BD",
    tabIconSelected: tintColorLight,
    link: "#5B67F5",
    backgroundRoot: "#F8F9FA",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F1F3F5",
    backgroundTertiary: "#E9ECEF",
    border: "#E9ECEF",
    cardShadow: "rgba(0, 0, 0, 0.05)",
  },
  dark: {
    text: "#F8F9FA",
    textSecondary: "#ADB5BD",
    buttonText: "#FFFFFF",
    tabIconDefault: "#6C757D",
    tabIconSelected: tintColorDark,
    link: "#7C85FF",
    backgroundRoot: "#1A1B1E",
    backgroundDefault: "#25262B",
    backgroundSecondary: "#2C2E33",
    backgroundTertiary: "#373A40",
    border: "#373A40",
    cardShadow: "rgba(0, 0, 0, 0.3)",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  tiny: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
