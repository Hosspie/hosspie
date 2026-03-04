import React, { useState, type PropsWithChildren } from 'react'
import {
  View,
  Modal,
  Pressable,
  Text,
  FlatList,
  StyleSheet,
  type ViewProps,
  type PressableProps,
  type ListRenderItemInfo,
} from 'react-native'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'
import { radius } from '../../tokens/radius'
import { sizing } from '../../tokens/sizing'

export interface SelectOption {
  label: string
  value: string
}

export interface SelectProps extends Omit<ViewProps, 'style'> {
  value?: string
  onValueChange?: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = '선택하세요',
  disabled = false,
  ...props
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const selectedLabel = options.find((o) => o.value === value)?.label

  return React.createElement(
    View,
    { ...props },
    React.createElement(
      Pressable,
      {
        onPress: () => !disabled && setOpen(true),
        style: [styles.trigger, disabled && styles.disabled],
        accessibilityRole: 'button',
      },
      React.createElement(
        Text,
        { style: [styles.triggerText, !selectedLabel && styles.placeholder] },
        selectedLabel || placeholder,
      ),
      React.createElement(Text, { style: styles.chevron }, '▼'),
    ),
    React.createElement(
      Modal,
      {
        visible: open,
        transparent: true,
        animationType: 'fade',
        onRequestClose: () => setOpen(false),
      },
      React.createElement(
        Pressable,
        { style: styles.overlay, onPress: () => setOpen(false) },
        React.createElement(
          View,
          { style: styles.dropdown },
          React.createElement(FlatList<SelectOption>, {
            data: options,
            keyExtractor: (item) => item.value,
            renderItem: ({ item }: ListRenderItemInfo<SelectOption>) =>
              React.createElement(
                Pressable,
                {
                  onPress: () => {
                    onValueChange?.(item.value)
                    setOpen(false)
                  },
                  style: [
                    styles.option,
                    item.value === value && styles.optionSelected,
                  ],
                },
                React.createElement(
                  Text,
                  {
                    style: [
                      styles.optionText,
                      item.value === value && styles.optionTextSelected,
                    ],
                  },
                  item.label,
                ),
              ),
          }),
        ),
      ),
    ),
  )
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: sizing.inputHeight,
    borderWidth: sizing.borderWidth,
    borderColor: colors.border.normal,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface.card,
  },
  triggerText: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    flex: 1,
  },
  placeholder: {
    color: colors.text.disabled,
  },
  chevron: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  dropdown: {
    width: '100%',
    maxWidth: sizing.dialogMaxWidth,
    maxHeight: 300,
    backgroundColor: colors.neutral[200],
    borderRadius: radius.lg,
    borderWidth: sizing.borderWidth,
    borderColor: colors.border.normal,
    overflow: 'hidden',
  },
  option: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: sizing.borderWidth,
    borderBottomColor: colors.border.normal,
  },
  optionSelected: {
    backgroundColor: colors.brand.primaryLight,
  },
  optionText: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  optionTextSelected: {
    color: colors.brand.primary,
    fontWeight: typography.weights.semibold,
  },
})
