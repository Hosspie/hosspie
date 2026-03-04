import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button, type ButtonProps } from '../../components/button'
import { spacing } from '../../tokens/spacing'

export interface ButtonGroupItemProps {
  text: string
  onPress: () => void
  variant?: ButtonProps['variant']
  disabled?: boolean
}

export interface ButtonGroupProps {
  buttons: ButtonGroupItemProps[]
  direction?: 'horizontal' | 'vertical'
  placement?: 'default' | 'bottom'
}

/**
 * 버튼 그룹.
 * 여러 액션 버튼을 수평/수직으로 배치한다.
 * placement='bottom'이면 화면 하단에 고정되도록 marginTop: auto 적용.
 */
export function ButtonGroup({
  buttons,
  direction = 'vertical',
  placement = 'default',
}: ButtonGroupProps) {
  const isHorizontal = direction === 'horizontal'

  return React.createElement(
    View,
    {
      style: [
        styles.container,
        isHorizontal ? styles.horizontal : styles.vertical,
        placement === 'bottom' && styles.bottom,
      ],
    },
    ...buttons.map((btn, index) =>
      React.createElement(
        View,
        {
          key: index,
          style: isHorizontal ? styles.horizontalItem : undefined,
        },
        React.createElement(Button, {
          title: btn.text,
          onPress: btn.onPress,
          variant: btn.variant,
          disabled: btn.disabled,
        }),
      ),
    ),
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
  bottom: {
    marginTop: 'auto',
  },
  horizontalItem: {
    flex: 1,
  },
})
