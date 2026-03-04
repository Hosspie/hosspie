import React, { useEffect, useRef } from 'react'
import {
  View,
  Animated,
  StyleSheet,
  type ViewProps,
} from 'react-native'
import { colors } from '../../tokens/colors'
import { radius } from '../../tokens/radius'
import { sizing } from '../../tokens/sizing'

export interface ProgressProps extends Omit<ViewProps, 'style'> {
  value?: number
  max?: number
}

export function Progress({
  value = 0,
  max = 100,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const animatedWidth = useRef(new Animated.Value(percentage)).current

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: percentage,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [percentage])

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  })

  return React.createElement(
    View,
    { ...props, style: styles.track },
    React.createElement(Animated.View, {
      style: [styles.fill, { width: widthInterpolation }],
    }),
  )
}

const styles = StyleSheet.create({
  track: {
    height: sizing.progressHeight,
    backgroundColor: colors.neutral[300],
    borderRadius: radius.full,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.brand.primary,
    borderRadius: radius.full,
  },
})
