/**
 * Design Tokens - Typography
 *
 * 타이포그래피 스케일, 폰트 패밀리, 행간.
 */

import { Platform } from 'react-native';

export const typography = {
  fonts: {
    body: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: 'System',
    }),
  },

  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    h2: 24,
    h1: 32,
    display: 48,
    /** @alias sm */
    caption: 14,
    /** @alias md */
    body: 16,
  },

  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  lineHeights: {
    tight: 1.2,
    snug: 1.3,
    normal: 1.4,
    relaxed: 1.5,
  },
} as const;

export type TypographyToken = typeof typography;
export type FontSize = keyof typeof typography.sizes;
export type FontWeight = keyof typeof typography.weights;
