/**
 * Design Tokens - Sizing
 *
 * 컴포넌트 고정 크기 값.
 */

export const sizing = {
  inputHeight: 44,
  dialogMaxWidth: 400,
  borderWidth: 1,
  checkboxSize: 22,
  radioSize: 22,
  avatarSm: 32,
  avatarMd: 40,
  avatarLg: 56,
  progressHeight: 8,
  sliderTrackHeight: 4,
  sliderThumbSize: 24,
  tabBarHeight: 44,
  iconSm: 16,
  iconMd: 20,
  fabSize: 48,
} as const;

export type SizingToken = typeof sizing;
