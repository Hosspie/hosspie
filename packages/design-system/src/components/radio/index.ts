import React from 'react'
import {
  Pressable,
  View,
  StyleSheet,
  type PressableProps,
} from 'react-native'
import { colors } from '../../tokens/colors'
import { sizing } from '../../tokens/sizing'

export interface RadioProps extends Omit<PressableProps, 'style'> {
  selected?: boolean
  onSelect?: () => void
  disabled?: boolean
}

export function Radio({
  selected = false,
  onSelect,
  disabled = false,
  ...props
}: RadioProps) {
  return React.createElement(
    Pressable,
    {
      ...props,
      disabled,
      onPress: onSelect,
      style: [
        styles.radio,
        selected && styles.radioSelected,
        disabled && styles.disabled,
      ],
      accessibilityRole: 'radio',
      accessibilityState: { selected, disabled },
    },
    selected && React.createElement(View, { style: styles.radioDot }),
  )
}

const styles = StyleSheet.create({
  radio: {
    width: sizing.radioSize,
    height: sizing.radioSize,
    borderRadius: sizing.radioSize / 2,
    borderWidth: sizing.borderWidth * 2,
    borderColor: colors.neutral[500],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  radioSelected: {
    borderColor: colors.brand.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  radioDot: {
    width: sizing.radioSize * 0.5,
    height: sizing.radioSize * 0.5,
    borderRadius: sizing.radioSize * 0.25,
    backgroundColor: colors.brand.primary,
  },
})
