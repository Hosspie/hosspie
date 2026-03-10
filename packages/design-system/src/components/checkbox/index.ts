import React from 'react'
import {
  View,
  Pressable,
  StyleSheet,
  type PressableProps,
} from 'react-native'
import { colors } from '../../tokens/colors'
import { radius } from '../../tokens/radius'
import { sizing } from '../../tokens/sizing'

export interface CheckboxProps extends Omit<PressableProps, 'style'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}

export function Checkbox({
  checked = false,
  onCheckedChange,
  disabled = false,
  ...props
}: CheckboxProps) {
  return React.createElement(
    Pressable,
    {
      ...props,
      disabled,
      onPress: () => onCheckedChange?.(!checked),
      style: [
        styles.base,
        checked && styles.checked,
        disabled && styles.disabled,
      ],
      accessibilityRole: 'checkbox',
      accessibilityState: { checked, disabled },
    },
    checked &&
      React.createElement(View, { style: styles.checkmark }),
  )
}

const styles = StyleSheet.create({
  base: {
    width: sizing.checkboxSize,
    height: sizing.checkboxSize,
    borderRadius: radius.sm / 2,
    borderWidth: sizing.borderWidth * 2,
    borderColor: colors.neutral[500],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checked: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  checkmark: {
    width: sizing.checkboxSize * 0.45,
    height: sizing.checkboxSize * 0.25,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.text.onBrand,
    transform: [{ rotate: '-45deg' }, { translateY: -1 }],
  },
})
