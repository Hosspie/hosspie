import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  View,
  PanResponder,
  StyleSheet,
  type ViewProps,
  type LayoutChangeEvent,
} from 'react-native'
import { colors } from '../../tokens/colors'
import { radius } from '../../tokens/radius'
import { sizing } from '../../tokens/sizing'

export interface SliderProps extends Omit<ViewProps, 'style'> {
  value?: number
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number) => void
  disabled?: boolean
}

export function Slider({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled = false,
  ...props
}: SliderProps) {
  const trackLayout = useRef({ x: 0, width: 0 })
  const containerRef = useRef<View>(null)
  const [localValue, setLocalValue] = useState(value)

  const clamp = useCallback(
    (v: number) => {
      const stepped = Math.round(v / step) * step
      return Math.min(Math.max(stepped, min), max)
    },
    [step, min, max],
  )

  const positionToValue = useCallback(
    (pageX: number) => {
      const { x, width } = trackLayout.current
      if (width === 0) return min
      const ratio = Math.max(0, Math.min(1, (pageX - x) / width))
      return clamp(min + ratio * (max - min))
    },
    [clamp, min, max],
  )

  const percentage = ((localValue - min) / (max - min)) * 100

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (evt) => {
        const newValue = positionToValue(evt.nativeEvent.pageX)
        setLocalValue(newValue)
        onValueChange?.(newValue)
      },
      onPanResponderMove: (evt) => {
        const newValue = positionToValue(evt.nativeEvent.pageX)
        setLocalValue(newValue)
        onValueChange?.(newValue)
      },
    }),
  ).current

  const handleLayout = (e: LayoutChangeEvent) => {
    containerRef.current?.measureInWindow((x, _y, width) => {
      trackLayout.current = { x, width }
    })
  }

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  return React.createElement(
    View,
    {
      ...props,
      ref: containerRef,
      style: [styles.container, disabled && styles.disabled],
      onLayout: handleLayout,
      ...panResponder.panHandlers,
      accessibilityRole: 'adjustable',
      accessibilityValue: { min, max, now: localValue },
    },
    React.createElement(
      View,
      { style: styles.track },
      React.createElement(View, {
        style: [styles.fill, { width: `${percentage}%` }],
      }),
    ),
    React.createElement(View, {
      style: [
        styles.thumb,
        { left: `${percentage}%`, marginLeft: -sizing.sliderThumbSize / 2 },
      ],
    }),
  )
}

const styles = StyleSheet.create({
  container: {
    height: sizing.sliderThumbSize + sizing.sliderTrackHeight,
    justifyContent: 'center',
    width: '100%',
  },
  track: {
    height: sizing.sliderTrackHeight,
    backgroundColor: colors.neutral[400],
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.brand.primary,
    borderRadius: radius.full,
  },
  thumb: {
    position: 'absolute',
    width: sizing.sliderThumbSize,
    height: sizing.sliderThumbSize,
    borderRadius: sizing.sliderThumbSize / 2,
    backgroundColor: colors.text.primary,
    borderWidth: sizing.borderWidth * 2,
    borderColor: colors.brand.primary,
    top: 0,
  },
  disabled: {
    opacity: 0.5,
  },
})
