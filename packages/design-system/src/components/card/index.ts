import React, { type PropsWithChildren } from 'react'
import {
  View,
  StyleSheet,
  type ViewProps,
} from 'react-native'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { radius } from '../../tokens/radius'
import { sizing } from '../../tokens/sizing'

export interface CardProps extends Omit<ViewProps, 'style'> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({
  padding = 'md',
  children,
  ...props
}: PropsWithChildren<CardProps>) {
  return React.createElement(
    View,
    {
      ...props,
      style: [styles.base, paddingStyles[padding]],
    },
    children,
  )
}

export function CardHeader({ children, ...props }: PropsWithChildren<Omit<ViewProps, 'style'>>) {
  return React.createElement(
    View,
    { ...props, style: styles.header },
    children,
  )
}

export function CardBody({ children, ...props }: PropsWithChildren<Omit<ViewProps, 'style'>>) {
  return React.createElement(
    View,
    { ...props, style: styles.body },
    children,
  )
}

export function CardFooter({ children, ...props }: PropsWithChildren<Omit<ViewProps, 'style'>>) {
  return React.createElement(
    View,
    { ...props, style: styles.footer },
    children,
  )
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
    borderWidth: sizing.borderWidth,
    borderColor: colors.border.normal,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: sizing.borderWidth,
    borderTopColor: colors.border.normal,
  },
})

const paddingStyles = StyleSheet.create({
  none: {},
  sm: { padding: spacing.sm },
  md: { padding: spacing.lg },
  lg: { padding: spacing.xl },
})
