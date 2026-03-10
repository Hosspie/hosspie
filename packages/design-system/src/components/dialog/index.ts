import React, { type PropsWithChildren } from 'react'
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  type ModalProps,
} from 'react-native'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'
import { radius } from '../../tokens/radius'
import { sizing } from '../../tokens/sizing'

export interface DialogProps {
  visible: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  modalProps?: Omit<ModalProps, 'visible'>
}

export function Dialog({
  visible,
  onClose,
  title,
  description,
  children,
  modalProps,
}: DialogProps) {
  return React.createElement(
    Modal,
    {
      visible,
      transparent: true,
      animationType: 'fade',
      onRequestClose: onClose,
      ...modalProps,
    },
    React.createElement(
      Pressable,
      { style: styles.overlay, onPress: onClose },
      React.createElement(
        Pressable,
        { style: styles.content, onPress: (e) => e.stopPropagation() },
        title && React.createElement(Text, { style: styles.title }, title),
        description && React.createElement(Text, { style: styles.description }, description),
        children,
      ),
    ),
  )
}

export function DialogActions({ children, ...props }: PropsWithChildren<Omit<React.ComponentProps<typeof View>, 'style'>>) {
  return React.createElement(
    View,
    { ...props, style: styles.actions },
    children,
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  content: {
    backgroundColor: colors.neutral[200],
    borderRadius: radius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: sizing.dialogMaxWidth,
    borderWidth: sizing.borderWidth,
    borderColor: colors.border.normal,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    lineHeight: typography.sizes.md * typography.lineHeights.relaxed,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
})
