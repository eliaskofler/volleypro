/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    /* ---------- Brand ---------- */
    primary: '#0D18B5',      // Blue
    secondary: '#E61556',    // Red
    accent: '#FFD630',       // Yellow

    /* ---------- Brand Shades ---------- */
    primaryDark: '#080F7A',
    primaryLight: '#3C47D9',
    primarySoft: '#E6E8FA',

    secondaryDark: '#9F0F3B',
    secondaryLight: '#F04C7E',
    secondarySoft: '#FCE4EC',

    accentDark: '#C9A300',
    accentLight: '#FFE57A',
    accentSoft: '#FFF7D6',

    /* ---------- Backgrounds ---------- */
    background: '#FFFFFF',
    backgroundSecondary: '#F6F7FB',
    surface: '#FFFFFF',
    surfaceSecondary: '#EEF0F6',

    /* ---------- Text ---------- */
    textPrimary: '#0B0E1A',
    textSecondary: '#4A4F6A',
    textMuted: '#7A7F99',
    textDisabled: '#B2B6C9',
    textOnPrimary: '#FFFFFF',
    textOnSecondary: '#FFFFFF',
    textOnAccent: '#0B0E1A',

    /* ---------- UI Elements ---------- */
    border: '#D8DBE8',
    borderStrong: '#AEB3CF',
    focusRing: '#FFD630',
    inputBackground: '#FFFFFF',
    inputBorder: '#D8DBE8',
    inputBorderActive: '#0D18B5',

    /* ---------- Status ---------- */
    success: '#22C55E',
    successBackground: '#DCFCE7',

    warning: '#F59E0B',
    warningBackground: '#FEF3C7',

    error: '#E61556',
    errorBackground: '#FCE4EC',

    info: '#3C47D9',
    infoBackground: '#E6E8FA',
  },

  dark: {
    /* ---------- Brand ---------- */
    primary: '#3C47D9',
    secondary: '#F04C7E',
    accent: '#FFD630',

    /* ---------- Brand Shades ---------- */
    primaryDark: '#0D18B5',
    primaryLight: '#6B74F0',
    primarySoft: '#1A1F3A',

    secondaryDark: '#E61556',
    secondaryLight: '#FF7AA2',
    secondarySoft: '#3A1623',

    accentDark: '#C9A300',
    accentLight: '#FFE57A',
    accentSoft: '#3A330F',

    /* ---------- Backgrounds ---------- */
    background: '#0B0E1A',
    backgroundSecondary: '#12162B',
    surface: '#1A1F3A',
    surfaceSecondary: '#2A2F55',

    /* ---------- Text ---------- */
    textPrimary: '#FFFFFF',
    textSecondary: '#C9CBE0',
    textMuted: '#8F94B8',
    textDisabled: '#5E638C',
    textOnPrimary: '#FFFFFF',
    textOnSecondary: '#FFFFFF',
    textOnAccent: '#0B0E1A',

    /* ---------- UI Elements ---------- */
    border: '#2A2F55',
    borderStrong: '#3A3F6A',
    focusRing: '#FFD630',
    inputBackground: '#1A1F3A',
    inputBorder: '#2A2F55',
    inputBorderActive: '#FFD630',

    /* ---------- Status ---------- */
    success: '#22C55E',
    successBackground: '#12341F',

    warning: '#F59E0B',
    warningBackground: '#3A2A0F',

    error: '#F04C7E',
    errorBackground: '#3A1623',

    info: '#6B74F0',
    infoBackground: '#1A1F3A',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
