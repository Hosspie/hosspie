import React, { type ReactNode } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Box } from '../../components/box'

export interface ScrollAreaProps {
  children: ReactNode
}

/**
 * 스크롤 가능한 콘텐츠 영역.
 * flexGrow: 1로 콘텐츠가 적어도 화면을 채우며,
 * ButtonGroup의 placement='bottom' (marginTop: auto)이 정상 동작한다.
 */
export function ScrollArea({ children }: ScrollAreaProps) {
  return React.createElement(
    Box,
    { flex: 1 },
    React.createElement(
      ScrollView,
      {
        style: styles.scroll,
        contentContainerStyle: styles.content,
        showsVerticalScrollIndicator: false,
      },
      children,
    ),
  )
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
})
