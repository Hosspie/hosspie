import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { Card } from '../../components/card'
import { Text } from '../../components/text'
import { Badge } from '../../components/badge'
import { Switch } from '../../components/switch'
import { Icon } from '../../components/icon'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GuestCheckinItemProps {
  name: string
  isCheckedIn: boolean
  expectedTime?: string
  isPartyAttending: boolean
  memo?: string
  onToggleCheckin: () => void
  onSendMessage: () => void
  onEditMemo: () => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * 게스트 체크인 항목 organism.
 * 게스트 이름, 체크인 상태, 예상 시간, 파티 참가 여부, 메모,
 * 체크인 토글 스위치, 문자 발송 아이콘 버튼을 포함한다.
 */
export function GuestCheckinItem({
  name,
  isCheckedIn,
  expectedTime,
  isPartyAttending,
  memo,
  onToggleCheckin,
  onSendMessage,
  onEditMemo,
}: GuestCheckinItemProps) {
  // 카드 본문
  const mainRow = React.createElement(
    View,
    { style: styles.mainRow },
    // 왼쪽: 이름 + 예상 시간
    React.createElement(
      View,
      { style: styles.leftSection },
      React.createElement(
        Text,
        { variant: 'body', weight: 'semibold' },
        name,
      ),
      expectedTime
        ? React.createElement(
            View,
            { style: styles.timeRow },
            React.createElement(Icon, { name: 'time-outline', size: 'sm', color: 'secondary' }),
            React.createElement(
              Text,
              { variant: 'caption' },
              expectedTime,
            ),
          )
        : null,
    ),
    // 가운데: Badge 영역
    React.createElement(
      View,
      { style: styles.centerSection },
      React.createElement(Badge, {
        label: isCheckedIn ? '체크인' : '미체크인',
        variant: isCheckedIn ? 'success' : 'error',
      }),
      React.createElement(Badge, {
        label: isPartyAttending ? '파티참가' : '파티불참',
        variant: isPartyAttending ? 'info' : 'default',
      }),
    ),
    // 오른쪽: Switch + 문자발송 버튼
    React.createElement(
      View,
      { style: styles.rightSection },
      React.createElement(Switch, {
        value: isCheckedIn,
        onValueChange: onToggleCheckin,
        accessibilityLabel: `${name} 체크인 토글`,
      }),
      React.createElement(
        Pressable,
        {
          onPress: onSendMessage,
          style: ({ pressed }: { pressed: boolean }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ],
          accessibilityLabel: `${name}에게 문자 발송`,
          accessibilityRole: 'button',
        },
        React.createElement(Icon, { name: 'chatbubble-outline', size: 'md', color: 'brand' }),
      ),
    ),
  )

  // 메모 영역 (있을 때만 표시)
  const memoRow = memo
    ? React.createElement(
        Pressable,
        {
          onPress: onEditMemo,
          style: styles.memoContainer,
          accessibilityLabel: `${name} 메모 편집`,
          accessibilityRole: 'button',
        },
        React.createElement(
          View,
          { style: styles.memoInner },
          React.createElement(Icon, { name: 'document-text-outline', size: 'sm', color: 'secondary' }),
          React.createElement(
            Text,
            { variant: 'caption' },
            memo,
          ),
        ),
      )
    : null

  return React.createElement(
    Card,
    { padding: 'md' },
    mainRow,
    memoRow,
  )
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  leftSection: {
    flex: 1,
    gap: spacing.xs,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  centerSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: colors.neutral[300],
  },
  iconButtonPressed: {
    backgroundColor: colors.neutral[400],
  },
  memoContainer: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.normal,
  },
  memoInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  memoText: {
    flex: 1,
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    fontWeight: typography.weights.regular,
  },
})
