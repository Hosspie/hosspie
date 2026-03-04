import React, { type ReactNode } from 'react'
import { View, Text as RNText, StyleSheet } from 'react-native'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { radius } from '../../tokens/radius'
import { sizing } from '../../tokens/sizing'
import { typography } from '../../tokens/typography'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StatCardProps {
  /** 카드 상단에 표시할 아이콘 */
  icon: ReactNode
  /** 통계 라벨 (예: "총 게스트", "체크인") */
  label: string
  /** 통계 값 (예: "6명", "3") */
  value: string
  /**
   * 카드 스타일 변형.
   * - default: 일반 카드 (어두운 배경)
   * - highlight: 강조 카드 (브랜드 색상 테두리 + 배경)
   */
  variant?: 'default' | 'highlight'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * 대시보드 통계 카드.
 * 아이콘 + 값 + 라벨을 조합하여 핵심 수치를 강조 표시한다.
 * 체크인 현황, 객실 현황 등 요약 데이터 표시에 사용한다.
 */
export function StatCard({
  icon,
  label,
  value,
  variant = 'default',
}: StatCardProps) {
  const isHighlight = variant === 'highlight'

  return React.createElement(
    View,
    {
      style: [
        styles.container,
        isHighlight ? styles.containerHighlight : null,
      ],
    },
    // 아이콘 영역
    React.createElement(
      View,
      { style: styles.iconWrapper },
      icon,
    ),
    // 통계 값
    React.createElement(
      RNText,
      {
        style: [
          styles.value,
          isHighlight ? styles.valueHighlight : null,
        ],
      },
      value,
    ),
    // 라벨
    React.createElement(
      RNText,
      { style: styles.label },
      label,
    ),
  )
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.card,
    borderRadius: radius.md,
    borderWidth: sizing.borderWidth,
    borderColor: colors.border.normal,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 88,
  },
  containerHighlight: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.brand.primaryLight,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    lineHeight: typography.sizes.h2 * typography.lineHeights.tight,
    textAlign: 'center',
  },
  valueHighlight: {
    color: colors.brand.primary,
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.sizes.xs * typography.lineHeights.normal,
  },
})
