import React from 'react'
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  type PressableProps,
  type ViewStyle,
  type TextStyle,
} from 'react-native'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'
import { radius } from '../../tokens/radius'

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return React.createElement(
    Pressable,
    {
      ...props,
      disabled: isDisabled,
      style: ({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        pressed && !isDisabled && pressedVariantStyles[variant],
        isDisabled && styles.disabled,
      ],
    },
    loading
      ? React.createElement(ActivityIndicator, {
          size: 'small',
          color: variant === 'primary' ? colors.text.onBrand : colors.brand.primary,
        })
      : React.createElement(
          Text,
          {
            style: [
              styles.text,
              sizeTextStyles[size],
              variantTextStyles[variant],
              isDisabled && styles.disabledText,
            ],
          },
          title,
        ),
  )
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  } as ViewStyle,
  text: {
    fontWeight: typography.weights.semibold,
  } as TextStyle,
  disabled: {
    opacity: 0.5,
  } as ViewStyle,
  disabledText: {
    opacity: 0.7,
  } as TextStyle,
})

const sizeStyles = StyleSheet.create({
  sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  lg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
  },
})

const sizeTextStyles = StyleSheet.create({
  sm: { fontSize: typography.sizes.xs },
  md: { fontSize: typography.sizes.md },
  lg: { fontSize: typography.sizes.lg },
})

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  secondary: {
    backgroundColor: colors.neutral[300],
    borderColor: colors.neutral[300],
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: colors.neutral[500],
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
})

const pressedVariantStyles = StyleSheet.create({
  primary: { opacity: 0.85 },
  secondary: { backgroundColor: colors.neutral[400] },
  outline: { backgroundColor: colors.neutral[300] },
  ghost: { backgroundColor: colors.neutral[300] },
})

const variantTextStyles = StyleSheet.create({
  primary: { color: colors.text.onBrand },
  secondary: { color: colors.text.primary },
  outline: { color: colors.text.primary },
  ghost: { color: colors.brand.primary },
})
