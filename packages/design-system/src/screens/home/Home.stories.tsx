import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { View, ScrollView, Pressable, StyleSheet, Text as RNText } from 'react-native'
import { MobileFrame } from '../../../.storybook/decorators/MobileFrame'
import { Card, CardBody } from '../../components/card'
import { Text } from '../../components/text'
import { Avatar } from '../../components/avatar'
import { Badge } from '../../components/badge'
import { Icon } from '../../components/icon'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'
import { radius } from '../../tokens/radius'

// ---------------------------------------------------------------------------
// 더미 데이터
// ---------------------------------------------------------------------------

const GUESTHOUSE_NAME = '홍대 게스트하우스'
const HOST_NAME = '김호스트'

const CHECKIN_STATS = {
  total: 6,
  checkedIn: 3,
  notCheckedIn: 3,
}

const TODAY_SCHEDULE = [
  { name: '김지수', role: '매니저', shift: '09:00 – 18:00', isToday: true },
  { name: '이민호', role: '프런트', shift: '18:00 – 02:00', isToday: false },
  { name: '박서연', role: '청소', shift: '10:00 – 15:00', isToday: true },
]

const NOTICE_TEXT = '오늘 저녁 8시에 BBQ 파티가 있습니다. 게스트 여러분께 안내 부탁드립니다.'

// ---------------------------------------------------------------------------
// 오늘 날짜
// ---------------------------------------------------------------------------

function getTodayLabel(): string {
  return new Date().toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

// ---------------------------------------------------------------------------
// 서브 컴포넌트: 브랜드 헤더
// ---------------------------------------------------------------------------

function BrandHeader({ onMenuPress }: { onMenuPress: () => void }) {
  return (
    <View style={headerStyles.container}>
      <View style={headerStyles.topRow}>
        <View style={headerStyles.left}>
          <View style={headerStyles.brandDot} />
          <RNText style={headerStyles.brandName}>{GUESTHOUSE_NAME}</RNText>
        </View>
        <Pressable
          onPress={onMenuPress}
          style={headerStyles.menuButton}
          accessibilityRole="button"
          accessibilityLabel="메뉴 열기"
        >
          <Icon name="menu-outline" size="md" color="primary" />
        </Pressable>
      </View>
      <View style={headerStyles.greetingRow}>
        <Avatar size="md" fallback={HOST_NAME.charAt(0)} />
        <View style={headerStyles.greetingText}>
          <RNText style={headerStyles.greeting}>
            안녕하세요, <RNText style={headerStyles.greetingBold}>{HOST_NAME}</RNText>님
          </RNText>
          <RNText style={headerStyles.dateLabel}>{getTodayLabel()}</RNText>
        </View>
      </View>
    </View>
  )
}

const headerStyles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    paddingBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
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
  brandName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.secondary,
    letterSpacing: 0.5,
  },
  menuButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.neutral[200],
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  greetingText: {
    flex: 1,
    gap: spacing.xs,
  },
  greeting: {
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.regular,
    color: colors.text.primary,
    lineHeight: typography.sizes.h2 * typography.lineHeights.tight,
  },
  greetingBold: {
    fontWeight: typography.weights.bold,
  },
  dateLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
    color: colors.text.secondary,
  },
})

// ---------------------------------------------------------------------------
// 서브 컴포넌트: 통계 요약 카드 (한 줄에 3개)
// ---------------------------------------------------------------------------

interface StatItemProps {
  label: string
  value: number
  unit: string
  accent?: boolean
}

function StatItem({ label, value, unit, accent }: StatItemProps) {
  return (
    <View style={[statStyles.item, accent && statStyles.itemAccent]}>
      <RNText style={[statStyles.value, accent && statStyles.valueAccent]}>
        {value}
        <RNText style={statStyles.unit}>{unit}</RNText>
      </RNText>
      <RNText style={statStyles.label}>{label}</RNText>
    </View>
  )
}

function StatsRow({ total, checkedIn, notCheckedIn }: typeof CHECKIN_STATS) {
  return (
    <View style={statStyles.container}>
      <View style={statStyles.headerRow}>
        <Icon name="people-outline" size="sm" color="brand" />
        <RNText style={statStyles.headerLabel}>오늘 체크인 현황</RNText>
      </View>
      <View style={statStyles.row}>
        <StatItem label="총 게스트" value={total} unit="명" />
        <View style={statStyles.divider} />
        <StatItem label="체크인" value={checkedIn} unit="명" accent />
        <View style={statStyles.divider} />
        <StatItem label="미체크인" value={notCheckedIn} unit="명" />
      </View>
    </View>
  )
}

const statStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.normal,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  itemAccent: {
    backgroundColor: colors.brand.primaryLight,
    borderRadius: radius.md,
    marginHorizontal: spacing.xs,
  },
  value: {
    fontSize: typography.sizes.h1,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    lineHeight: typography.sizes.h1 * typography.lineHeights.tight,
  },
  valueAccent: {
    color: colors.brand.primary,
  },
  unit: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.regular,
    color: colors.text.secondary,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: colors.neutral[400],
  },
})

// ---------------------------------------------------------------------------
// 서브 컴포넌트: 공지사항
// ---------------------------------------------------------------------------

function NoticeCard() {
  return (
    <View style={noticeStyles.container}>
      <View style={noticeStyles.accent} />
      <View style={noticeStyles.content}>
        <View style={noticeStyles.titleRow}>
          <Icon name="megaphone-outline" size="sm" color="brand" />
          <RNText style={noticeStyles.title}>오늘의 공유사항</RNText>
          <RNText style={noticeStyles.time}>오전 9:30</RNText>
        </View>
        <RNText style={noticeStyles.body}>{NOTICE_TEXT}</RNText>
        <RNText style={noticeStyles.author}>— 매니저 김지수</RNText>
      </View>
    </View>
  )
}

const noticeStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.normal,
    overflow: 'hidden',
  },
  accent: {
    width: 4,
    backgroundColor: colors.brand.primary,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  time: {
    fontSize: typography.sizes.xs,
    color: colors.text.disabled,
  },
  body: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: typography.sizes.sm * typography.lineHeights.relaxed,
  },
  author: {
    fontSize: typography.sizes.xs,
    color: colors.text.disabled,
    textAlign: 'right',
  },
})

// ---------------------------------------------------------------------------
// 서브 컴포넌트: 빠른 실행 버튼
// ---------------------------------------------------------------------------

interface QuickActionProps {
  icon: string
  label: string
  onPress: () => void
}

function QuickAction({ icon, label, onPress }: QuickActionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        quickStyles.button,
        pressed && quickStyles.buttonPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={quickStyles.iconCircle}>
        <Icon name={icon as any} size="md" color="brand" />
      </View>
      <RNText style={quickStyles.label}>{label}</RNText>
    </Pressable>
  )
}

function QuickActions({
  onRegisterGuest,
  onViewCheckins,
}: {
  onRegisterGuest: () => void
  onViewCheckins: () => void
}) {
  return (
    <View style={quickStyles.container}>
      <QuickAction
        icon="person-add-outline"
        label="게스트 등록"
        onPress={onRegisterGuest}
      />
      <QuickAction
        icon="checkmark-circle-outline"
        label="체크인 관리"
        onPress={onViewCheckins}
      />
      <QuickAction
        icon="calendar-outline"
        label="근무표"
        onPress={fn()}
      />
      <QuickAction
        icon="chatbubbles-outline"
        label="문자 발송"
        onPress={fn()}
      />
    </View>
  )
}

const quickStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border.normal,
  },
  buttonPressed: {
    backgroundColor: colors.neutral[300],
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.brand.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
    textAlign: 'center',
  },
})

// ---------------------------------------------------------------------------
// 서브 컴포넌트: 오늘의 근무자
// ---------------------------------------------------------------------------

function TodaySchedule() {
  return (
    <View style={scheduleStyles.container}>
      <View style={scheduleStyles.headerRow}>
        <View style={scheduleStyles.headerLeft}>
          <Icon name="calendar-outline" size="sm" color="brand" />
          <RNText style={scheduleStyles.headerLabel}>오늘의 근무자</RNText>
        </View>
        <Badge label="3명" variant="default" />
      </View>
      <Card padding="none">
        {TODAY_SCHEDULE.map((staff, index) => (
          <View key={staff.name}>
            <View style={scheduleStyles.row}>
              <Avatar size="sm" fallback={staff.name.charAt(0)} />
              <View style={scheduleStyles.rowText}>
                <View style={scheduleStyles.nameRow}>
                  <RNText style={scheduleStyles.staffName}>{staff.name}</RNText>
                  <Badge
                    label={staff.role}
                    variant={staff.isToday ? 'success' : 'default'}
                  />
                </View>
                <RNText style={scheduleStyles.staffShift}>{staff.shift}</RNText>
              </View>
            </View>
            {index < TODAY_SCHEDULE.length - 1 && (
              <View style={scheduleStyles.divider} />
            )}
          </View>
        ))}
      </Card>
    </View>
  )
}

const scheduleStyles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowText: {
    flex: 1,
    gap: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  staffName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  staffShift: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.normal,
    marginHorizontal: spacing.lg,
  },
})

// ---------------------------------------------------------------------------
// 게스트 등록 유도 카드
// ---------------------------------------------------------------------------

function GuestPromptCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        promptStyles.container,
        pressed && promptStyles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel="게스트 등록하기"
    >
      <View style={promptStyles.iconWrapper}>
        <Icon name="person-add" size="md" color="onBrand" />
      </View>
      <View style={promptStyles.textGroup}>
        <RNText style={promptStyles.title}>오늘의 게스트를 등록해주세요</RNText>
        <RNText style={promptStyles.description}>
          체크인 예정 게스트가 아직 등록되지 않았어요
        </RNText>
      </View>
      <Icon name="chevron-forward" size="sm" color="brand" />
    </Pressable>
  )
}

const promptStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.brand.primaryLight,
    borderWidth: 1,
    borderColor: colors.brand.primary + '33',
  },
  pressed: {
    opacity: 0.85,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  description: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    lineHeight: typography.sizes.xs * typography.lineHeights.normal,
  },
})

// ---------------------------------------------------------------------------
// 홈 페이지 본체
// ---------------------------------------------------------------------------

interface HomePageProps {
  hasGuests?: boolean
  onMenuPress?: () => void
  onRegisterGuest?: () => void
  onViewCheckins?: () => void
}

function HomePage({
  hasGuests = true,
  onMenuPress = fn(),
  onRegisterGuest = fn(),
  onViewCheckins = fn(),
}: HomePageProps) {
  const stats = hasGuests
    ? CHECKIN_STATS
    : { total: 0, checkedIn: 0, notCheckedIn: 0 }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 브랜드 헤더 */}
        <BrandHeader onMenuPress={onMenuPress} />

        {/* 게스트 등록 유도 (게스트 없을 때) */}
        {!hasGuests && <GuestPromptCard onPress={onRegisterGuest} />}

        {/* 체크인 통계 */}
        <StatsRow
          total={stats.total}
          checkedIn={stats.checkedIn}
          notCheckedIn={stats.notCheckedIn}
        />

        {/* 빠른 실행 */}
        <QuickActions
          onRegisterGuest={onRegisterGuest}
          onViewCheckins={onViewCheckins}
        />

        {/* 공지사항 */}
        <NoticeCard />

        {/* 오늘의 근무자 */}
        <TodaySchedule />

        {/* 하단 여백 */}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
})

// ---------------------------------------------------------------------------
// 스토리 메타
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Admin Screens/Home/Home',
  component: HomePage,
  decorators: [MobileFrame],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => {
    const Page = () => {
      return React.createElement(HomePage, {
        hasGuests: true,
        onMenuPress: fn(),
        onRegisterGuest: fn(),
        onViewCheckins: fn(),
      })
    }
    return React.createElement(Page, null)
  },
}

export const WithNoGuests: Story = {
  render: () => {
    const Page = () => {
      const [registered, setRegistered] = useState(false)

      return React.createElement(HomePage, {
        hasGuests: registered,
        onMenuPress: fn(),
        onRegisterGuest: () => setRegistered(true),
        onViewCheckins: fn(),
      })
    }
    return React.createElement(Page, null)
  },
}
