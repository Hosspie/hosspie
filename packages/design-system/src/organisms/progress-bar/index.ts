import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Progress } from '../../components/progress'
import { Text } from '../../components/text'
import { spacing } from '../../tokens/spacing'

export interface ProgressBarProps {
  value: number
  max?: number
  caption?: string
}

/**
 * 프로그레스 바 + 선택적 캡션.
 * 온보딩 진행률 등 단계 표시에 사용한다.
 */
export function ProgressBar({
  value,
  max = 100,
  caption,
}: ProgressBarProps) {
  return React.createElement(
    View,
    { style: styles.container },
    React.createElement(Progress, { value, max }),
    caption
      ? React.createElement(Text, { variant: 'caption' }, caption)
      : null,
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
})
