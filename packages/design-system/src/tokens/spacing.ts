/**
 * Design Tokens - Spacing
 *
 * 4px 그리드 기반 간격 스케일.
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

export type SpacingToken = typeof spacing;
export type SpacingKey = keyof SpacingToken;
