import React, { useState } from 'react'
import {
  TextInput,
  StyleSheet,
  type TextInputProps,
} from 'react-native'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'
import { radius } from '../../tokens/radius'
import { sizing } from '../../tokens/sizing'

export interface InputProps extends Omit<TextInputProps, 'style'> {}

export function Input({
  editable = true,
  multiline,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false)
  const isDisabled = editable === false

  return React.createElement(TextInput, {
    ...props,
    editable,
    multiline,
    placeholderTextColor: colors.text.disabled,
    onFocus: (e) => {
      setFocused(true)
      props.onFocus?.(e)
    },
    onBlur: (e) => {
      setFocused(false)
      props.onBlur?.(e)
    },
    style: [
      styles.input,
      focused && styles.focused,
      isDisabled && styles.disabled,
    ],
  })
}

const styles = StyleSheet.create({
  input: {
    borderWidth: sizing.borderWidth,
    borderColor: colors.border.normal,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    backgroundColor: colors.surface.card,
  },
  focused: {
    borderColor: colors.border.focus,
    borderWidth: sizing.borderWidth * 2,
  },
  disabled: {
    backgroundColor: colors.neutral[100],
    color: colors.text.disabled,
  },
})
