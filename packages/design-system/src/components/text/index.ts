import React from 'react'
import {
  Text as RNText,
  StyleSheet,
  type TextProps as RNTextProps,
} from 'react-native'
import { colors } from '../../tokens/colors'
import { typography } from '../../tokens/typography'

export interface TextProps extends Omit<RNTextProps, 'style'> {
  variant?: 'display' | 'h1' | 'h2' | 'body' | 'caption'
  weight?: 'regular' | 'medium' | 'semibold' | 'bold'
}

export function Text({
  variant = 'body',
  weight,
  ...props
}: TextProps) {
  return React.createElement(RNText, {
    ...props,
    style: [
      styles.base,
      variantStyles[variant],
      weight && { fontWeight: typography.weights[weight] },
    ],
  })
}

export function H1(props: Omit<TextProps, 'variant'>) {
  return React.createElement(Text, { ...props, variant: 'h1', weight: props.weight || 'bold' })
}

export function H2(props: Omit<TextProps, 'variant'>) {
  return React.createElement(Text, { ...props, variant: 'h2', weight: props.weight || 'semibold' })
}

export function Paragraph(props: Omit<TextProps, 'variant'>) {
  return React.createElement(Text, { ...props, variant: 'body' })
}

export function Caption(props: Omit<TextProps, 'variant'>) {
  return React.createElement(Text, { ...props, variant: 'caption' })
}

const styles = StyleSheet.create({
  base: {
    color: colors.text.primary,
  },
})

const variantStyles = StyleSheet.create({
  display: {
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.bold,
    lineHeight: typography.sizes.display * typography.lineHeights.tight,
  },
  h1: {
    fontSize: typography.sizes.h1,
    fontWeight: typography.weights.bold,
    lineHeight: typography.sizes.h1 * typography.lineHeights.snug,
  },
  h2: {
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.sizes.h2 * typography.lineHeights.snug,
  },
  body: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.regular,
    lineHeight: typography.sizes.body * typography.lineHeights.relaxed,
  },
  caption: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.regular,
    lineHeight: typography.sizes.caption * typography.lineHeights.normal,
    color: colors.text.secondary,
  },
})
