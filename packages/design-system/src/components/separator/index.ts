import React from 'react'
import { View, StyleSheet, type ViewProps } from 'react-native'
import { colors } from '../../tokens/colors'
import { sizing } from '../../tokens/sizing'

export interface SeparatorProps extends Omit<ViewProps, 'style'> {
  orientation?: 'horizontal' | 'vertical'
}

export function Separator({
  orientation = 'horizontal',
  ...props
}: SeparatorProps) {
  return React.createElement(View, {
    ...props,
    style: orientation === 'horizontal' ? styles.horizontal : styles.vertical,
  })
}

const styles = StyleSheet.create({
  horizontal: {
    height: sizing.borderWidth,
    backgroundColor: colors.border.normal,
    width: '100%',
  },
  vertical: {
    width: sizing.borderWidth,
    backgroundColor: colors.border.normal,
    height: '100%',
  },
})
