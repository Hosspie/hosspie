/**
 * Design Tokens - Shadows
 *
 * Shadow and elevation styles for cards and elevated surfaces.
 * Platform-specific implementations (iOS shadows vs Android elevation).
 */

import { Platform, ViewStyle } from 'react-native';

export const shadows = {
  /**
   * Card Shadow
   * Default shadow for cards and surfaces
   */
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }),

  /**
   * Glow Effects
   * Special glow for brand and accent colors
   */
  glow: {
    brand: Platform.select<ViewStyle>({
      ios: {
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
      default: {},
    }),
    accent: Platform.select<ViewStyle>({
      ios: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
      default: {},
    }),
  },
} as const;

/**
 * Type-safe shadow keys
 */
export type ShadowToken = typeof shadows;
