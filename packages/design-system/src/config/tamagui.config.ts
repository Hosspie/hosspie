import { createAnimations } from '@tamagui/animations-react-native'
import { createInterFont } from '@tamagui/font-inter'
import { shorthands } from '@tamagui/shorthands'
import { createTamagui, createTokens } from 'tamagui'

// ---------------------------------------------------------------------------
// Animations
// ---------------------------------------------------------------------------

const animations = createAnimations({
  fast: { type: 'spring', damping: 20, mass: 1.2, stiffness: 250 },
  medium: { type: 'spring', damping: 15, mass: 0.9, stiffness: 150 },
  slow: { type: 'spring', damping: 20, stiffness: 60 },
  bouncy: { type: 'spring', damping: 8, mass: 0.9, stiffness: 150 },
  lazy: { type: 'spring', damping: 20, stiffness: 60 },
  tooltip: { type: 'spring', damping: 10, mass: 0.9, stiffness: 100 },
})

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

const tokens = createTokens({
  color: {
    // --- Brand Primary (원본: #FF8A3D) ---
    brandPrimary: '#FF8A3D',
    brandGradientStart: '#FF8A3D',
    brandGradientEnd: '#FFB366',

    // --- Accent (원본: #10B981) ---
    accentPrimary: '#10B981',

    // --- Surface (원본 디자인 토큰) ---
    surfaceBase: '#0A0A0F',
    surfaceCard: '#1A1A24',
    surfaceElevated: '#242433',

    // --- Text (원본 디자인 토큰) ---
    textPrimary: '#FFFFFF',
    textSecondary: '#B8B8C8',
    textOnBrand: '#FFFFFF',
    textOnAccent: '#0A0A0F',

    // --- Border (원본 디자인 토큰) ---
    borderNormal: '#2A2A3A',

    // --- Status ---
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',

    // --- Grayscale (12-step scale based on surfaces) ---
    gray1: '#0A0A0F',     // surface.base
    gray2: '#1A1A24',     // surface.card
    gray3: '#242433',     // surface.elevated
    gray4: '#2A2A3A',     // border.normal
    gray5: '#3A3A4A',
    gray6: '#5A5A6A',
    gray7: '#7A7A8A',
    gray8: '#9A9AAA',
    gray9: '#B8B8C8',     // text.secondary
    gray10: '#D8D8E8',
    gray11: '#E8E8F8',
    gray12: '#FFFFFF',    // text.primary

    // --- Base ---
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },

  space: {
    0: 0,
    1: 4,   // xs
    2: 8,   // sm
    3: 12,
    4: 16,  // md
    5: 20,
    6: 24,  // lg
    7: 28,
    8: 32,  // xl
    9: 36,
    10: 40,
    12: 48, // 2xl
    16: 64,
    true: 16,
  },

  size: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    12: 48,
    16: 64,
    true: 16,
  },

  radius: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    true: 8,
  },

  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
})

// ---------------------------------------------------------------------------
// Themes
// ---------------------------------------------------------------------------

const darkTheme = {
  background: tokens.color.surfaceBase,       // #0A0A0F
  backgroundHover: tokens.color.surfaceCard,  // #1A1A24
  backgroundPress: tokens.color.surfaceElevated, // #242433
  backgroundFocus: tokens.color.surfaceCard,
  color: tokens.color.textPrimary,            // #FFFFFF
  colorHover: tokens.color.textPrimary,
  colorPress: tokens.color.textSecondary,     // #B8B8C8
  borderColor: tokens.color.borderNormal,     // #2A2A3A
  borderColorHover: tokens.color.gray5,
  shadowColor: tokens.color.black,
  // 12-step scale
  color1: tokens.color.gray1,   // #0A0A0F (surfaceBase)
  color2: tokens.color.gray2,   // #1A1A24 (surfaceCard)
  color3: tokens.color.gray3,   // #242433 (surfaceElevated)
  color4: tokens.color.gray4,   // #2A2A3A (borderNormal)
  color5: tokens.color.gray5,
  color6: tokens.color.gray6,
  color7: tokens.color.gray7,
  color8: tokens.color.gray8,
  color9: tokens.color.brandPrimary,  // #FF8A3D
  color10: tokens.color.gray9,  // #B8B8C8 (textSecondary)
  color11: tokens.color.gray10,
  color12: tokens.color.gray12, // #FFFFFF (textPrimary)
}

const lightTheme = {
  background: tokens.color.gray12,            // #FFFFFF
  backgroundHover: tokens.color.gray11,       // #E8E8F8
  backgroundPress: tokens.color.gray10,       // #D8D8E8
  backgroundFocus: tokens.color.gray11,
  color: tokens.color.gray1,                  // #0A0A0F
  colorHover: tokens.color.gray1,
  colorPress: tokens.color.gray3,             // #242433
  borderColor: tokens.color.gray10,           // #D8D8E8
  borderColorHover: tokens.color.gray9,
  shadowColor: 'rgba(0,0,0,0.1)',
  // 12-step scale (반전)
  color1: tokens.color.gray12,  // #FFFFFF
  color2: tokens.color.gray11,  // #E8E8F8
  color3: tokens.color.gray10,  // #D8D8E8
  color4: tokens.color.gray9,   // #B8B8C8
  color5: tokens.color.gray8,   // #9A9AAA
  color6: tokens.color.gray7,   // #7A7A8A
  color7: tokens.color.gray6,   // #5A5A6A
  color8: tokens.color.gray5,   // #3A3A4A
  color9: tokens.color.brandPrimary,  // #FF8A3D
  color10: tokens.color.gray4,  // #2A2A3A
  color11: tokens.color.gray2,  // #1A1A24
  color12: tokens.color.gray1,  // #0A0A0F
}

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Media queries
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Final config
// ---------------------------------------------------------------------------

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
