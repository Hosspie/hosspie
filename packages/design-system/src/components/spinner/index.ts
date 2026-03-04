import React from 'react'
import {
  ActivityIndicator,
  type ActivityIndicatorProps,
} from 'react-native'
import { colors } from '../../tokens/colors'

export type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SpinnerProps extends Omit<ActivityIndicatorProps, 'style' | 'size' | 'color'> {
  size?: SpinnerSize
}

const sizeMap: Record<SpinnerSize, 'small' | 'large'> = {
  sm: 'small',
  md: 'small',
  lg: 'large',
}

export function Spinner({
  size = 'md',
  ...props
}: SpinnerProps) {
  return React.createElement(ActivityIndicator, {
    ...props,
    size: sizeMap[size],
    color: colors.brand.primary,
  })
}
