import React, { type PropsWithChildren } from 'react'
import { View, StyleSheet, type ViewProps } from 'react-native'
import { spacing, type SpacingKey } from '../../tokens/spacing'

export interface StackProps extends Omit<ViewProps, 'style'> {
  gap?: SpacingKey
  padding?: SpacingKey
  flex?: number
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
}

export function VStack({
  gap,
  padding,
  flex,
  align,
  justify,
  children,
  ...props
}: PropsWithChildren<StackProps>) {
  return React.createElement(
    View,
    {
      ...props,
      style: [
        styles.vstack,
        gap !== undefined && { gap: spacing[gap] },
        padding !== undefined && { padding: spacing[padding] },
        flex !== undefined && { flex },
        align && { alignItems: align },
        justify && { justifyContent: justify },
      ],
    },
    children,
  )
}

export function HStack({
  gap,
  padding,
  flex,
  align = 'center',
  justify,
  children,
  ...props
}: PropsWithChildren<StackProps>) {
  return React.createElement(
    View,
    {
      ...props,
      style: [
        styles.hstack,
        gap !== undefined && { gap: spacing[gap] },
        padding !== undefined && { padding: spacing[padding] },
        flex !== undefined && { flex },
        align && { alignItems: align },
        justify && { justifyContent: justify },
      ],
    },
    children,
  )
}

const styles = StyleSheet.create({
  vstack: {
    flexDirection: 'column',
  },
  hstack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
