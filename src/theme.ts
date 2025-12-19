/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";
const tintColorLight = "#2B8A3E"; // deep, muted green
const tintColorDark = "#A8D5BA"; // soft mint green

export const Colors = {
  light: {
    text: "#1B1B1B", // dark gray for text
    background: "#F6F6F6", // very light gray instead of stark white
    tint: tintColorLight, // accent color
    icon: "#5C5C5C", // medium gray icons
    tabIconDefault: "#5C5C5C",
    tabIconSelected: tintColorLight,
    cardBg: "#FFFFFF", // white cards on light gray background
    border: "#E5E5E5", // subtle borders
  },
  dark: {
    text: "#E0E0E0", // light gray text
    background: "#121B17", // almost black with subtle green undertone
    tint: tintColorDark, // accent
    icon: "#7D8C84", // muted gray-green icons
    tabIconDefault: "#7D8C84",
    tabIconSelected: tintColorDark,
    cardBg: "#1A2621", // slightly lighter than background for cards
    border: "#2A3A32", // subtle green-tinted border
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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
