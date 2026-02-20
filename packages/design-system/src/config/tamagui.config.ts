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
    // --- Brand Primary — Orange scale ---
    primary0: '#FFF4EB',
    primary50: '#FFE6CC',
    primary100: '#FFD8AD',
    primary200: '#FFBA7A',
    primary300: '#FF9C47',
    primary400: '#FF7E14',
    primary500: '#FF6B35', // main brand orange
    primary600: '#E65F30',
    primary700: '#CC542A',
    primary800: '#993F20',
    primary900: '#662A15',
    primary950: '#4C2010',

    // --- Secondary — Dark Grays ---
    secondary0: '#0F0F0F',
    secondary50: '#141414',
    secondary100: '#1E1E1E',
    secondary200: '#282828',
    secondary300: '#323232',
    secondary400: '#3C3C3C',
    secondary500: '#4B4B4B',
    secondary600: '#5A5A5A',
    secondary700: '#6E6E6E',
    secondary800: '#8C8C8C',
    secondary900: '#B4B4B4',
    secondary950: '#DCDCDC',

    // --- Background ---
    background0: '#080808',
    background50: '#0C0C0C',
    background100: '#121212',
    background200: '#191919',
    background300: '#232323',
    background400: '#2D2D2D',
    background500: '#373737',
    background600: '#464646',
    background700: '#5A5A5A',
    background800: '#787878',
    background900: '#B4B4B4',
    background950: '#F0F0F0',

    // --- Typography ---
    typography0: '#FFFFFF',
    typography50: '#FFFFFF',
    typography100: '#FAFAFA',
    typography200: '#FAFAFA',
    typography300: '#F5F5F5',
    typography400: '#F5F5F5',
    typography500: '#F5F5F5',
    typography600: '#F5F5F5',
    typography700: '#F5F5F5',
    typography800: '#AAAAAA',
    typography900: '#737373',
    typography950: '#3C3C3C',

    // --- Outline / Border ---
    outline0: '#505050',
    outline100: '#3C3C3C',
    outline200: '#323232',
    outline300: '#2D2D2D',
    outline400: '#282828',
    outline500: '#232323',

    // --- Status ---
    error: '#FF4B4B',
    success: '#4B965F',
    warning: '#D2963C',
    info: '#4682C8',

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
  background: tokens.color.background0,
  backgroundHover: tokens.color.background200,
  backgroundPress: tokens.color.background300,
  backgroundFocus: tokens.color.background200,
  color: tokens.color.typography0,
  colorHover: tokens.color.typography0,
  colorPress: tokens.color.typography800,
  borderColor: tokens.color.outline200,
  borderColorHover: tokens.color.outline0,
  shadowColor: tokens.color.black,
  // 12-step background scale
  color1: tokens.color.background0,
  color2: tokens.color.background100,
  color3: tokens.color.background200,
  color4: tokens.color.background300,
  color5: tokens.color.background400,
  color6: tokens.color.background500,
  color7: tokens.color.background600,
  color8: tokens.color.background700,
  color9: tokens.color.primary500,  // brand accent
  color10: tokens.color.typography800,
  color11: tokens.color.typography700,
  color12: tokens.color.typography0,
}

const lightTheme = {
  background: tokens.color.background950,
  backgroundHover: tokens.color.background900,
  backgroundPress: tokens.color.background800,
  backgroundFocus: tokens.color.background900,
  color: tokens.color.typography950,
  colorHover: tokens.color.typography950,
  colorPress: tokens.color.typography900,
  borderColor: tokens.color.outline0,
  borderColorHover: tokens.color.outline100,
  shadowColor: 'rgba(0,0,0,0.1)',
  // 12-step scale inverted
  color1: tokens.color.background950,
  color2: tokens.color.background900,
  color3: tokens.color.background800,
  color4: tokens.color.background700,
  color5: tokens.color.background600,
  color6: tokens.color.background500,
  color7: tokens.color.background400,
  color8: tokens.color.background300,
  color9: tokens.color.primary500,  // same brand accent
  color10: tokens.color.typography800,
  color11: tokens.color.typography900,
  color12: tokens.color.typography950,
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
