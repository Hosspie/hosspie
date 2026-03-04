import React from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
  type ViewProps,
  type ImageSourcePropType,
} from 'react-native'
import { colors } from '../../tokens/colors'
import { typography } from '../../tokens/typography'
import { sizing } from '../../tokens/sizing'

export type AvatarSize = 'sm' | 'md' | 'lg'

export interface AvatarProps extends Omit<ViewProps, 'style'> {
  size?: AvatarSize
  src?: ImageSourcePropType
  fallback?: string
}

const sizeMap: Record<AvatarSize, number> = {
  sm: sizing.avatarSm,
  md: sizing.avatarMd,
  lg: sizing.avatarLg,
}

const fontSizeMap: Record<AvatarSize, number> = {
  sm: typography.sizes.xs,
  md: typography.sizes.sm,
  lg: typography.sizes.lg,
}

export function Avatar({
  size = 'md',
  src,
  fallback,
  ...props
}: AvatarProps) {
  const dimension = sizeMap[size]

  if (src) {
    return React.createElement(Image, {
      source: src,
      style: {
        width: dimension,
        height: dimension,
        borderRadius: dimension / 2,
        backgroundColor: colors.neutral[300],
      },
    })
  }

  return React.createElement(
    View,
    {
      ...props,
      style: [
        styles.fallback,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
        },
      ],
    },
    React.createElement(
      Text,
      { style: [styles.fallbackText, { fontSize: fontSizeMap[size] }] },
      fallback ? fallback.charAt(0).toUpperCase() : '?',
    ),
  )
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.neutral[400],
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
  },
})
