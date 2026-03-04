/**
 * Design Tokens - Border Radius
 *
 * 컴포넌트별 모서리 라운딩 스케일.
 */

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export type RadiusToken = typeof radius;
export type RadiusKey = keyof RadiusToken;
