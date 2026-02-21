import { createAnimations } from '@tamagui/animations-css'
import { createInterFont } from '@tamagui/font-inter'
import { shorthands } from '@tamagui/shorthands'
import { createTamagui, createTokens } from 'tamagui'

// 원본 config의 tokens, themes, fonts, media를 그대로 재사용하되
// animations만 CSS 기반으로 교체

const animations = createAnimations({
  fast: 'ease-in 150ms',
  medium: 'ease-in 300ms',
  slow: 'ease-in 450ms',
  bouncy: 'ease-in 200ms',
  lazy: 'ease-in 450ms',
  tooltip: 'ease-in 200ms',
})

const tokens = createTokens({
  color: {
    brandPrimary: '#FF8A3D',
    brandGradientStart: '#FF8A3D',
    brandGradientEnd: '#FFB366',
    accentPrimary: '#10B981',
    surfaceBase: '#0A0A0F',
    surfaceCard: '#1A1A24',
    surfaceElevated: '#242433',
    textPrimary: '#FFFFFF',
    textSecondary: '#B8B8C8',
    textOnBrand: '#FFFFFF',
    textOnAccent: '#0A0A0F',
    borderNormal: '#2A2A3A',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
    gray1: '#0A0A0F',
    gray2: '#1A1A24',
    gray3: '#242433',
    gray4: '#2A2A3A',
    gray5: '#3A3A4A',
    gray6: '#5A5A6A',
    gray7: '#7A7A8A',
    gray8: '#9A9AAA',
    gray9: '#B8B8C8',
    gray10: '#D8D8E8',
    gray11: '#E8E8F8',
    gray12: '#FFFFFF',
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },
  space: {
    0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 28,
    8: 32, 9: 36, 10: 40, 12: 48, 16: 64, true: 16,
  },
  size: {
    0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 28,
    8: 32, 9: 36, 10: 40, 12: 48, 16: 64, true: 16,
  },
  radius: { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, true: 8 },
  zIndex: { 0: 0, 1: 100, 2: 200, 3: 300, 4: 400, 5: 500 },
})

const darkTheme = {
  background: tokens.color.surfaceBase,
  backgroundHover: tokens.color.surfaceCard,
  backgroundPress: tokens.color.surfaceElevated,
  backgroundFocus: tokens.color.surfaceCard,
  color: tokens.color.textPrimary,
  colorHover: tokens.color.textPrimary,
  colorPress: tokens.color.textSecondary,
  borderColor: tokens.color.borderNormal,
  borderColorHover: tokens.color.gray5,
  shadowColor: tokens.color.black,
  color1: tokens.color.gray1,
  color2: tokens.color.gray2,
  color3: tokens.color.gray3,
  color4: tokens.color.gray4,
  color5: tokens.color.gray5,
  color6: tokens.color.gray6,
  color7: tokens.color.gray7,
  color8: tokens.color.gray8,
  color9: tokens.color.brandPrimary,
  color10: tokens.color.gray9,
  color11: tokens.color.gray10,
  color12: tokens.color.gray12,
}

const lightTheme = {
  background: tokens.color.gray12,
  backgroundHover: tokens.color.gray11,
  backgroundPress: tokens.color.gray10,
  backgroundFocus: tokens.color.gray11,
  color: tokens.color.gray1,
  colorHover: tokens.color.gray1,
  colorPress: tokens.color.gray3,
  borderColor: tokens.color.gray10,
  borderColorHover: tokens.color.gray9,
  shadowColor: 'rgba(0,0,0,0.1)',
  color1: tokens.color.gray12,
  color2: tokens.color.gray11,
  color3: tokens.color.gray10,
  color4: tokens.color.gray9,
  color5: tokens.color.gray8,
  color6: tokens.color.gray7,
  color7: tokens.color.gray6,
  color8: tokens.color.gray5,
  color9: tokens.color.brandPrimary,
  color10: tokens.color.gray4,
  color11: tokens.color.gray2,
  color12: tokens.color.gray1,
}

const headingFont = createInterFont({
  size: { 1: 14, 2: 16, 3: 18, 4: 24, 5: 32, 6: 48 },
  weight: { 4: '400', 5: '500', 6: '600', 7: '700' },
  face: {
    700: { normal: 'InterBold' },
    600: { normal: 'InterSemiBold' },
  },
})

const bodyFont = createInterFont({
  size: { 1: 12, 2: 14, 3: 16, 4: 18 },
  weight: { 4: '400', 5: '500' },
})

const media = {
  xs: { maxWidth: 660 },
  sm: { maxWidth: 800 },
  md: { maxWidth: 1020 },
  lg: { maxWidth: 1280 },
  gtXs: { minWidth: 661 },
  gtSm: { minWidth: 801 },
  gtMd: { minWidth: 1021 },
  gtLg: { minWidth: 1281 },
}

const config = createTamagui({
  tokens,
  themes: { dark: darkTheme, light: lightTheme },
  shorthands,
  fonts: { heading: headingFont, body: bodyFont },
  media,
  animations,
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
