import React from 'react'
import { View, Text as RNText, StyleSheet } from 'react-native'
import { Card } from '../../components/card'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ScheduleEntry {
  staffName: string
  /** [월, 화, 수, 목, 금, 토, 일] - 7개 요소 */
  days: boolean[]
}

export interface ScheduleTableProps {
  /** "3월 1주차" 등 주차 라벨 */
  weekLabel: string
  entries: ScheduleEntry[]
}

// ---------------------------------------------------------------------------
// 상수
// ---------------------------------------------------------------------------

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'] as const

// ---------------------------------------------------------------------------
// 서브 컴포넌트 렌더러
// ---------------------------------------------------------------------------

function renderDayDot(isWorking: boolean, dayIndex: number) {
  return React.createElement(View, {
    key: dayIndex,
    style: [styles.dayDot, isWorking ? styles.dayDotActive : styles.dayDotInactive],
  })
}

function renderDayHeader() {
  return React.createElement(
    View,
    { style: styles.rowContainer },
    // 스탭 이름 열 헤더 (빈 공간)
    React.createElement(View, { style: styles.staffNameCell }),
    // 요일 라벨
    ...DAY_LABELS.map((day, index) =>
      React.createElement(
        View,
        { key: index, style: styles.dayCell },
        React.createElement(
          RNText,
          { style: styles.dayLabelText },
          day,
        ),
      ),
    ),
  )
}

function renderEntryRow(entry: ScheduleEntry, rowIndex: number) {
  return React.createElement(
    View,
    {
      key: rowIndex,
      style: [styles.rowContainer, rowIndex > 0 && styles.rowBorder],
    },
    // 스탭 이름 셀
    React.createElement(
      View,
      { style: styles.staffNameCell },
      React.createElement(
        RNText,
        { style: styles.staffNameText },
        entry.staffName,
      ),
    ),
    // 요일별 근무 인디케이터
    ...entry.days.slice(0, 7).map((isWorking, dayIndex) =>
      React.createElement(
        View,
        { key: dayIndex, style: styles.dayCell },
        renderDayDot(isWorking, dayIndex),
      ),
    ),
  )
}

// ---------------------------------------------------------------------------
// 메인 컴포넌트
// ---------------------------------------------------------------------------

/**
 * ScheduleTable organism.
 * 주간 스탭 근무표 테이블. 스탭 이름 + 요일별 근무 여부를 표시.
 */
export function ScheduleTable({ weekLabel, entries }: ScheduleTableProps) {
  return React.createElement(
    Card,
    { padding: 'none' },
    // 카드 헤더: 주차 라벨
    React.createElement(
      View,
      { style: styles.tableHeader },
      React.createElement(
        RNText,
        { style: styles.weekLabelText },
        weekLabel,
      ),
    ),
    // 구분선
    React.createElement(View, { style: styles.divider }),
    // 테이블 본문
    React.createElement(
      View,
      { style: styles.tableBody },
      // 요일 헤더 행
      renderDayHeader(),
      // 구분선
      React.createElement(View, { style: styles.headerDivider }),
      // 스탭별 행
      ...entries.map((entry, index) => renderEntryRow(entry, index)),
    ),
  )
}

// ---------------------------------------------------------------------------
// 스타일
// ---------------------------------------------------------------------------

const DAY_CELL_SIZE = 32

const styles = StyleSheet.create({
  tableHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  weekLabelText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.normal,
  },
  tableBody: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.neutral[300],
  },
  staffNameCell: {
    width: 72,
    paddingRight: spacing.sm,
  },
  staffNameText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
    color: colors.text.primary,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: DAY_CELL_SIZE,
    minHeight: DAY_CELL_SIZE,
  },
  dayLabelText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  headerDivider: {
    height: 1,
    backgroundColor: colors.neutral[300],
    marginBottom: spacing.xs,
  },
  dayDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  dayDotActive: {
    backgroundColor: colors.brand.primary,
  },
  dayDotInactive: {
    backgroundColor: 'transparent',
  },
})
