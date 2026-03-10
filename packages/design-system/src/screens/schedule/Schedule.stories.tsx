import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { View, Text as RNText, StyleSheet, Pressable } from 'react-native'
import { MobileFrame } from '../../../.storybook/decorators/MobileFrame'
import { Card } from '../../components/card'
import { Avatar } from '../../components/avatar'
import { Badge } from '../../components/badge'
import { Icon } from '../../components/icon'
import { Text } from '../../components/text'
import { Fab } from '../../organisms/fab'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'
import { radius } from '../../tokens/radius'

// ---------------------------------------------------------------------------
// 데이터
// ---------------------------------------------------------------------------

const SAMPLE_ENTRIES = [
  { staffName: '김민준', days: [true, true, false, true, true, false, false] },
  { staffName: '이서연', days: [false, true, true, true, false, true, true] },
  { staffName: '박지호', days: [true, false, true, false, true, true, false] },
  { staffName: '최유나', days: [true, true, true, false, false, false, true] },
]

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'] as const

// ---------------------------------------------------------------------------
// 주간 테이블 (리디자인)
// ---------------------------------------------------------------------------

interface ScheduleTableEntry {
  staffName: string
  days: boolean[]
}

function WeeklyScheduleTable({ entries }: { entries: ScheduleTableEntry[] }) {
  return (
    <Card padding="none">
      {/* 요일 헤더 */}
      <View style={tableStyles.headerRow}>
        <View style={tableStyles.nameCol}>
          <RNText style={tableStyles.headerLabel}>스탭</RNText>
        </View>
        {DAY_LABELS.map((day, i) => (
          <View key={i} style={tableStyles.dayCol}>
            <RNText style={tableStyles.dayLabel}>{day}</RNText>
          </View>
        ))}
      </View>

      <View style={tableStyles.divider} />

      {/* 데이터 행 */}
      {entries.map((entry, rowIndex) => (
        <View key={rowIndex}>
          <View style={tableStyles.dataRow}>
            <View style={tableStyles.nameCol}>
              <View style={tableStyles.staffInfo}>
                <Avatar size="sm" fallback={entry.staffName.charAt(0)} />
                <RNText style={tableStyles.staffName}>{entry.staffName}</RNText>
              </View>
            </View>
            {entry.days.slice(0, 7).map((isWorking, dayIndex) => (
              <View key={dayIndex} style={tableStyles.dayCol}>
                <View
                  style={[
                    tableStyles.dot,
                    isWorking ? tableStyles.dotActive : tableStyles.dotInactive,
                  ]}
                />
              </View>
            ))}
          </View>
          {rowIndex < entries.length - 1 && (
            <View style={tableStyles.rowDivider} />
          )}
        </View>
      ))}

      {/* 하단 요약 */}
      <View style={tableStyles.summary}>
        <View style={tableStyles.summaryItem}>
          <View style={[tableStyles.dot, tableStyles.dotActive]} />
          <RNText style={tableStyles.summaryText}>근무</RNText>
        </View>
        <View style={tableStyles.summaryItem}>
          <View style={[tableStyles.dot, tableStyles.dotInactive]} />
          <RNText style={tableStyles.summaryText}>휴무</RNText>
        </View>
      </View>
    </Card>
  )
}

const tableStyles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  nameCol: {
    width: 96,
    paddingRight: spacing.sm,
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text.disabled,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.normal,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  staffInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  staffName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.neutral[300],
    marginHorizontal: spacing.md,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  dotActive: {
    backgroundColor: colors.brand.primary,
  },
  dotInactive: {
    backgroundColor: colors.neutral[300],
  },
  summary: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.normal,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryText: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
})

// ---------------------------------------------------------------------------
// 편집 모드 행
// ---------------------------------------------------------------------------

function EditEntryRow({
  staffName,
  days,
  onToggle,
}: {
  staffName: string
  days: boolean[]
  onToggle: (dayIndex: number) => void
}) {
  return (
    <View style={editStyles.rowContainer}>
      <View style={editStyles.staffCell}>
        <Avatar size="sm" fallback={staffName.charAt(0)} />
        <RNText style={editStyles.staffName}>{staffName}</RNText>
      </View>
      <View style={editStyles.daysRow}>
        {days.slice(0, 7).map((isWorking, dayIndex) => (
          <Pressable
            key={dayIndex}
            onPress={() => onToggle(dayIndex)}
            style={[
              editStyles.dayButton,
              isWorking ? editStyles.dayButtonActive : editStyles.dayButtonInactive,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${staffName} ${DAY_LABELS[dayIndex]}요일 근무 ${isWorking ? '해제' : '등록'}`}
          >
            <RNText
              style={[
                editStyles.dayButtonText,
                isWorking ? editStyles.dayButtonTextActive : editStyles.dayButtonTextInactive,
              ]}
            >
              {DAY_LABELS[dayIndex]}
            </RNText>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const editStyles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[300],
  },
  staffCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    width: 96,
  },
  staffName: {
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  daysRow: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dayButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
  dayButtonActive: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  dayButtonInactive: {
    backgroundColor: 'transparent',
    borderColor: colors.neutral[500],
  },
  dayButtonText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  dayButtonTextActive: {
    color: colors.text.onBrand,
  },
  dayButtonTextInactive: {
    color: colors.text.secondary,
  },
})

// ---------------------------------------------------------------------------
// 기본 스케줄 페이지
// ---------------------------------------------------------------------------

interface SchedulePageProps {
  onAddStaff?: () => void
  onEditSchedule?: () => void
}

const SchedulePage = ({
  onAddStaff = fn(),
  onEditSchedule = fn(),
}: SchedulePageProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentArea}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.brandDot} />
            <RNText style={styles.weekInfo}>2025년 3월 1주차</RNText>
          </View>
        </View>
        <Text variant="h2" weight="bold">이번주 근무표</Text>
        <RNText style={styles.subDescription}>스탭별 주간 근무 일정을 확인하세요</RNText>

        {/* 주간 테이블 */}
        <View style={styles.tableWrapper}>
          <View style={styles.tableTitleRow}>
            <RNText style={styles.tableTitle}>3/3 (월) – 3/9 (일)</RNText>
            <Badge label={`${SAMPLE_ENTRIES.length}명`} variant="default" />
          </View>
          <WeeklyScheduleTable entries={SAMPLE_ENTRIES} />
        </View>
      </View>

      {/* FAB */}
      <View style={styles.fabWrapper}>
        <Fab
          items={[
            {
              icon: React.createElement(Icon, { name: 'person-add', color: 'onBrand' }),
              label: '스탭 추가',
              onPress: onAddStaff,
            },
            {
              icon: React.createElement(Icon, { name: 'create-outline', color: 'onBrand' }),
              label: '근무 수정',
              onPress: onEditSchedule,
            },
          ]}
          isFoldable
          placement="right"
        />
      </View>
    </View>
  )
}

// ---------------------------------------------------------------------------
// 편집 모드 페이지
// ---------------------------------------------------------------------------

interface EditSchedulePageProps {
  onSave?: () => void
  onAddStaff?: () => void
}

const EditSchedulePage = ({
  onSave = fn(),
  onAddStaff = fn(),
}: EditSchedulePageProps) => {
  const [entries, setEntries] = useState(
    SAMPLE_ENTRIES.map((e) => ({ ...e, days: [...e.days] })),
  )

  const handleToggle = (entryIndex: number, dayIndex: number) => {
    setEntries((prev) =>
      prev.map((entry, i) => {
        if (i !== entryIndex) return entry
        const newDays = [...entry.days]
        newDays[dayIndex] = !newDays[dayIndex]
        return { ...entry, days: newDays }
      }),
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentArea}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.brandDot} />
            <RNText style={styles.weekInfo}>2025년 3월 1주차</RNText>
          </View>
        </View>
        <Text variant="h2" weight="bold">근무 수정</Text>
        <RNText style={styles.subDescription}>요일 버튼을 눌러 근무 일정을 변경하세요</RNText>

        {/* 편집 카드 */}
        <Card padding="lg">
          <View style={styles.editCardHeader}>
            <RNText style={styles.editCardTitle}>3월 1주차</RNText>
            <Pressable
              onPress={onSave}
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="저장"
            >
              <Icon name="checkmark" size="sm" color="onBrand" />
              <RNText style={styles.saveButtonText}>저장</RNText>
            </Pressable>
          </View>
          {entries.map((entry, entryIndex) => (
            <EditEntryRow
              key={entryIndex}
              staffName={entry.staffName}
              days={entry.days}
              onToggle={(dayIndex) => handleToggle(entryIndex, dayIndex)}
            />
          ))}
        </Card>
      </View>

      {/* FAB */}
      <View style={styles.fabWrapper}>
        <Fab
          items={[
            {
              icon: React.createElement(Icon, { name: 'person-add', color: 'onBrand' }),
              label: '스탭 추가',
              onPress: onAddStaff,
            },
          ]}
          isFoldable={false}
          placement="right"
        />
      </View>
    </View>
  )
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.base,
  },
  contentArea: {
    flex: 1,
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand.primary,
  },
  weekInfo: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
  },
  subDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  tableWrapper: {
    gap: spacing.sm,
  },
  tableTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tableTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  editCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  editCardTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.brand.primary,
  },
  saveButtonPressed: {
    opacity: 0.85,
  },
  saveButtonText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text.onBrand,
  },
  fabWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
})

// ---------------------------------------------------------------------------
// 스토리 메타
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Admin Screens/Schedule/Schedule',
  component: SchedulePage,
  decorators: [MobileFrame],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => {
    const Page = () => React.createElement(SchedulePage, {
      onAddStaff: fn(),
      onEditSchedule: fn(),
    })
    return React.createElement(Page)
  },
}

export const WithEditMode: Story = {
  render: () => {
    const Page = () => React.createElement(EditSchedulePage, {
      onSave: fn(),
      onAddStaff: fn(),
    })
    return React.createElement(Page)
  },
}
