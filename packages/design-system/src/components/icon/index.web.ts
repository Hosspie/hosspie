import React from 'react'
import { colors } from '../../tokens/colors'
import { sizing } from '../../tokens/sizing'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IconProps {
  name: string
  size?: 'sm' | 'md'
  color?: 'primary' | 'secondary' | 'disabled' | 'onBrand' | 'brand' | 'inverse'
}

// ---------------------------------------------------------------------------
// Mappings
// ---------------------------------------------------------------------------

const sizeMap = {
  sm: sizing.iconSm,
  md: sizing.iconMd,
} as const

const colorMap = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  disabled: colors.text.disabled,
  onBrand: colors.text.onBrand,
  brand: colors.brand.primary,
  inverse: colors.text.inverse,
} as const

// ---------------------------------------------------------------------------
// SVG paths (Ionicons 호환, viewBox 0 0 512 512)
// ---------------------------------------------------------------------------

const iconPaths: Record<string, string> = {
  add: 'M256 48v416M48 256h416',
  close: 'M400 112L112 400M112 112l288 288',
  'chevron-forward': 'M184 112l144 144-144 144',
  'chevron-back': 'M328 112L184 256l144 144',
  checkmark: 'M416 128L192 384l-96-96',
}

// ---------------------------------------------------------------------------
// Component (Web/Storybook 전용)
// ---------------------------------------------------------------------------

export function Icon({
  name,
  size = 'md',
  color = 'primary',
}: IconProps) {
  const sizeValue = sizeMap[size]
  const colorValue = colorMap[color]
  const path = iconPaths[name]

  if (!path) {
    return null
  }

  return React.createElement(
    'svg',
    {
      width: sizeValue,
      height: sizeValue,
      viewBox: '0 0 512 512',
      fill: 'none',
      stroke: colorValue,
      strokeWidth: 48,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    React.createElement('path', { d: path }),
  )
}
