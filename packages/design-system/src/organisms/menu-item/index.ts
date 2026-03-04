import React, { type ReactNode } from 'react'
import {
  View,
  Pressable,
  Text as RNText,
  StyleSheet,
  type PressableProps,
} from 'react-native'
import { Icon } from '../../components/icon'
import { Separator } from '../../components/separator'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { sizing } from '../../tokens/sizing'
import { typography } from '../../tokens/typography'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MenuItemProps {
  icon?: ReactNode
  label: string
  description?: string
  onPress?: PressableProps['onPress']
  rightElement?: ReactNode
  showArrow?: boolean
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MenuItem({
  icon,
  label,
  description,
  onPress,
  rightElement,
  showArrow = true,
}: MenuItemProps) {
  return React.createElement(
    View,
    { style: styles.wrapper },
    React.createElement(
      Pressable,
      {
        onPress,
        style: ({ pressed }: { pressed: boolean }) => [
          styles.container,
          pressed && onPress && styles.pressed,
        ],
        accessibilityRole: 'button',
        accessible: true,
        accessibilityLabel: label,
      },
      // 아이콘 (선택)
      icon
        ? React.createElement(
            View,
            { style: styles.iconWrapper },
            icon,
          )
        : null,
      // 가운데: 라벨 + 설명
      React.createElement(
        View,
        { style: styles.labelWrapper },
        React.createElement(
          RNText,
          { style: styles.label },
          label,
        ),
        description
          ? React.createElement(
              RNText,
              { style: styles.description },
              description,
            )
          : null,
      ),
      // 오른쪽: rightElement 또는 chevron
      React.createElement(
        View,
        { style: styles.rightWrapper },
        rightElement
          ? rightElement
          : showArrow
            ? React.createElement(Icon, {
                name: 'chevron-forward',
                size: 'sm',
                color: 'secondary',
              })
            : null,
      ),
    ),
    React.createElement(Separator, {}),
  )
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surface.base,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: sizing.inputHeight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.surface.base,
  },
  pressed: {
    backgroundColor: colors.neutral[200],
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: sizing.iconMd,
    height: sizing.iconMd,
  },
  labelWrapper: {
    flex: 1,
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.regular,
    color: colors.text.primary,
  },
  description: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
    color: colors.text.secondary,
  },
  rightWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: sizing.iconMd,
  },
})
