import React, { useState, useEffect, useRef, useCallback, type PropsWithChildren } from 'react'
import {
  View,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  StyleSheet,
  type ViewProps,
  type ModalProps,
} from 'react-native'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { radius } from '../../tokens/radius'
import { sizing } from '../../tokens/sizing'

const SCREEN_HEIGHT = Dimensions.get('window').height

export interface SheetProps {
  visible: boolean
  onClose: () => void
  children?: React.ReactNode
  modalProps?: Omit<ModalProps, 'visible'>
}

export function Sheet({
  visible,
  onClose,
  children,
  modalProps,
}: SheetProps) {
  const [modalVisible, setModalVisible] = useState(false)
  const dimOpacity = useRef(new Animated.Value(0)).current
  const slideY = useRef(new Animated.Value(SCREEN_HEIGHT)).current

  const animateIn = useCallback(() => {
    setModalVisible(true)
    Animated.parallel([
      Animated.timing(dimOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const animateOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(dimOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false)
    })
  }, [])

  useEffect(() => {
    if (visible) {
      animateIn()
    } else if (modalVisible) {
      animateOut()
    }
  }, [visible])

  return React.createElement(
    Modal,
    {
      visible: modalVisible,
      transparent: true,
      animationType: 'none',
      onRequestClose: onClose,
      ...modalProps,
    },
    React.createElement(
      View,
      { style: styles.wrapper },
      React.createElement(
        Animated.View,
        {
          style: [styles.dim, { opacity: dimOpacity }],
        },
        React.createElement(Pressable, {
          style: StyleSheet.absoluteFill,
          onPress: onClose,
        }),
      ),
      React.createElement(
        Animated.View,
        {
          style: [styles.content, { transform: [{ translateY: slideY }] }],
        },
        React.createElement(
          Pressable,
          { onPress: (e) => e.stopPropagation() },
          React.createElement(View, { style: styles.handle }),
          children,
        ),
      ),
    ),
  )
}

export interface SheetContentProps extends Omit<ViewProps, 'style'> {}

export function SheetContent({
  children,
  ...props
}: PropsWithChildren<SheetContentProps>) {
  return React.createElement(
    View,
    { ...props, style: styles.body },
    children,
  )
}

Sheet.Content = SheetContent

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  content: {
    backgroundColor: colors.neutral[200],
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderTopWidth: sizing.borderWidth,
    borderColor: colors.border.normal,
    paddingBottom: spacing['2xl'],
    maxHeight: '80%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.neutral[500],
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  body: {
    paddingHorizontal: spacing.xl,
  },
})
