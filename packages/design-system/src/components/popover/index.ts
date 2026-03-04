import React, { useState, type PropsWithChildren } from 'react'
import {
  View,
  Modal,
  Pressable,
  StyleSheet,
  type ViewProps,
} from 'react-native'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { radius } from '../../tokens/radius'
import { sizing } from '../../tokens/sizing'

// TODO: 정교한 위치 계산 (trigger 기준 상대 위치) 미구현.
// 현재는 중앙 모달 방식으로 동작.

export interface PopoverProps {
  children?: React.ReactNode
}

export function Popover({ children }: PopoverProps) {
  const [visible, setVisible] = useState(false)
  const triggerElement: React.ReactNode[] = []
  const contentElement: React.ReactNode[] = []

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return
    if (child.type === PopoverTrigger) {
      triggerElement.push(
        React.cloneElement(child as React.ReactElement<PopoverTriggerInternalProps>, {
          _onPress: () => setVisible(true),
        }),
      )
    } else if (child.type === PopoverContent) {
      contentElement.push(child)
    }
  })

  return React.createElement(
    View,
    null,
    ...triggerElement,
    React.createElement(
      Modal,
      {
        visible,
        transparent: true,
        animationType: 'fade',
        onRequestClose: () => setVisible(false),
      },
      React.createElement(
        Pressable,
        { style: styles.overlay, onPress: () => setVisible(false) },
        React.createElement(
          Pressable,
          { style: styles.content, onPress: (e) => e.stopPropagation() },
          contentElement,
        ),
      ),
    ),
  )
}

interface PopoverTriggerInternalProps {
  _onPress?: () => void
}

export interface PopoverTriggerProps extends Omit<ViewProps, 'style'> {}

export function PopoverTrigger({
  children,
  _onPress,
  ...props
}: PropsWithChildren<PopoverTriggerProps & PopoverTriggerInternalProps>) {
  return React.createElement(
    Pressable,
    { ...props, onPress: _onPress },
    children,
  )
}

export interface PopoverContentProps extends Omit<ViewProps, 'style'> {}

export function PopoverContent({
  children,
  ...props
}: PropsWithChildren<PopoverContentProps>) {
  return React.createElement(View, props, children)
}

Popover.Trigger = PopoverTrigger
Popover.Content = PopoverContent

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  content: {
    backgroundColor: colors.neutral[200],
    borderRadius: radius.lg,
    borderWidth: sizing.borderWidth,
    borderColor: colors.border.normal,
    padding: spacing.lg,
    maxWidth: sizing.dialogMaxWidth,
    width: '100%',
  },
})
