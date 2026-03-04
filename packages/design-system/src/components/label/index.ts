import React from 'react'
import {
  Text,
  StyleSheet,
  type TextProps,
} from 'react-native'
import { colors } from '../../tokens/colors'
import { typography } from '../../tokens/typography'
import { spacing } from '../../tokens/spacing'

export interface LabelProps extends Omit<TextProps, 'style'> {
  required?: boolean
}

export function Label({
  required = false,
  children,
  ...props
}: LabelProps) {
  return React.createElement(
    Text,
    { ...props, style: styles.label },
    children,
    required && React.createElement(Text, { style: styles.required }, ' *'),
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  required: {
    color: colors.status.error,
  },
})
