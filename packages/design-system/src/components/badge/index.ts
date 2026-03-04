import React from 'react'
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  type ViewProps,
  type PressableProps,
} from 'react-native'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'
import { radius } from '../../tokens/radius'

export type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

export interface BadgeProps extends Omit<ViewProps, 'style'> {
  label: string
  variant?: BadgeVariant
  onPress?: PressableProps['onPress']
}

export function Badge({
  label,
  variant = 'default',
  onPress,
  ...props
}: BadgeProps) {
  const content = React.createElement(
    Text,
    { style: [styles.text, variantTextStyles[variant]] },
    label,
  )

  if (onPress) {
    return React.createElement(
      Pressable,
      {
        ...props,
        onPress,
        style: [styles.base, variantStyles[variant]],
      },
      content,
    )
  }

  return React.createElement(
    View,
    {
      ...props,
      style: [styles.base, variantStyles[variant]],
    },
    content,
  )
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  text: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
})

const variantStyles = StyleSheet.create({
  default: { backgroundColor: colors.neutral[300] },
  success: { backgroundColor: colors.status.successBg },
  error: { backgroundColor: colors.status.errorBg },
  warning: { backgroundColor: colors.status.warningBg },
  info: { backgroundColor: colors.status.infoBg },
})

const variantTextStyles = StyleSheet.create({
  default: { color: colors.neutral[900] },
  success: { color: colors.status.successText },
  error: { color: colors.status.errorText },
  warning: { color: colors.status.warningText },
  info: { color: colors.status.infoText },
})
