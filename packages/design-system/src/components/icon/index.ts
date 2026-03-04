import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { colors } from '../../tokens/colors'
import { sizing } from '../../tokens/sizing'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type IconName = React.ComponentProps<typeof Ionicons>['name']

export interface IconProps {
  name: IconName
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
// Component
// ---------------------------------------------------------------------------

export function Icon({
  name,
  size = 'md',
  color = 'primary',
}: IconProps) {
  return React.createElement(Ionicons, {
    name,
    size: sizeMap[size],
    color: colorMap[color],
  })
}
