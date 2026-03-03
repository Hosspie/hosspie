import React, { type ReactNode } from 'react'
import { View, StyleSheet } from 'react-native'
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'

export interface BackgroundLayoutProps {
  children: ReactNode
  edges?: Edge[]
}

/**
 * 전체 화면 배경 레이아웃.
 * SafeArea 인셋을 적용하고 기본 배경색을 설정한다.
 */
export function BackgroundLayout({
  children,
  edges = ['top', 'bottom'],
}: BackgroundLayoutProps) {
  const insets = useSafeAreaInsets()

  const edgePadding: Record<string, number> = {}
  if (edges.includes('top')) edgePadding.paddingTop = insets.top
  if (edges.includes('bottom')) edgePadding.paddingBottom = insets.bottom
  if (edges.includes('left')) edgePadding.paddingLeft = insets.left
  if (edges.includes('right')) edgePadding.paddingRight = insets.right

  return React.createElement(
    View,
    { style: [styles.container, edgePadding] },
    children,
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.base,
    paddingHorizontal: spacing.xl,
  },
})
