/**
 * Design Tokens - Colors (Dark Mode)
 *
 * 다크 모드 기반 시맨틱 컬러 시스템.
 * @see packages/configs/ui/token/color.ts 의 다크 테마 값 기반
 */

export const colors = {
  brand: {
    primary: '#FF6B35',
    primaryLight: '#3D1E10',
    gradient: {
      start: '#FF6B35',
      end: '#FF9C47',
    },
  },

  accent: {
    primary: '#4B965F',
  },

  neutral: {
    0: '#080808',
    50: '#0C0C0C',
    100: '#121212',
    200: '#191919',
    300: '#232323',
    400: '#2D2D2D',
    500: '#373737',
    600: '#464646',
    700: '#5A5A5A',
    800: '#8C8C8C',
    900: '#DCDCDC',
  },

  status: {
    success: '#4B965F',
    successBg: '#142319',
    successText: '#82BE96',
    error: '#FF4B4B',
    errorBg: '#281414',
    errorText: '#FF8282',
    warning: '#D2963C',
    warningBg: '#2D230F',
    warningText: '#F0BE64',
    info: '#4682C8',
    infoBg: '#141E28',
    infoText: '#78AAEB',
  },

  surface: {
    base: '#080808',
    card: '#191919',
    elevated: '#121212',
  },

  text: {
    primary: '#FFFFFF',
    secondary: '#AAAAAA',
    disabled: '#737373',
    inverse: '#080808',
    onBrand: '#FFFFFF',
  },

  border: {
    normal: '#323232',
    focus: '#FF6B35',
    error: '#FF4B4B',
  },
} as const

export type ColorToken = typeof colors
