import React from 'react'
import { View, StyleSheet, type FlexAlignType } from 'react-native'
import { Text } from '../../components/text'
import { spacing } from '../../tokens/spacing'

export interface TextBlockProps {
  title: string
  description?: string
  align?: 'left' | 'center' | 'right'
}

const alignMap: Record<NonNullable<TextBlockProps['align']>, FlexAlignType> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
}

/**
 * 제목 + 설명 텍스트 블록.
 * 섹션 헤더나 온보딩 안내 문구 등에 사용한다.
 */
export function TextBlock({
  title,
  description,
  align = 'left',
}: TextBlockProps) {
  return React.createElement(
    View,
    { style: [styles.container, { alignItems: alignMap[align] }] },
    React.createElement(Text, { variant: 'h2' }, title),
    description
      ? React.createElement(
          Text,
          { variant: 'caption' },
          description,
        )
      : null,
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
})
