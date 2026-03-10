import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { View, ScrollView, Pressable, StyleSheet, Text as RNText } from 'react-native'
import { MobileFrame } from '../../../.storybook/decorators/MobileFrame'
import { Card } from '../../components/card'
import { Text } from '../../components/text'
import { Avatar } from '../../components/avatar'
import { Badge } from '../../components/badge'
import { Switch } from '../../components/switch'
import { Icon } from '../../components/icon'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'
import { radius } from '../../tokens/radius'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GuestData {
  id: string
  name: string
  room: string
  isCheckedIn: boolean
  expectedTime?: string
  isPartyAttending: boolean
  memo?: string
}

type FilterTab = 'all' | 'checkedIn' | 'notCheckedIn'

// ---------------------------------------------------------------------------
// 예시 데이터
// ---------------------------------------------------------------------------

const initialGuests: GuestData[] = [
  {
    id: '1',
    name: '김민준',
    room: '101호',
    isCheckedIn: true,
    expectedTime: '14:00',
    isPartyAttending: true,
    memo: '음식 알레르기: 견과류 주의',
  },
  {
    id: '2',
    name: '이서연',
    room: '102호',
    isCheckedIn: true,
    expectedTime: '15:00',
    isPartyAttending: false,
  },
  {
    id: '3',
    name: '박지훈',
    room: '201호',
    isCheckedIn: true,
    expectedTime: '15:30',
    isPartyAttending: true,
  },
  {
    id: '4',
    name: '최유나',
    room: '101호',
    isCheckedIn: false,
    expectedTime: '17:00',
    isPartyAttending: true,
    memo: '늦게 도착 예정, 연락 필요',
  },
  {
    id: '5',
    name: '정도현',
    room: '202호',
    isCheckedIn: false,
    expectedTime: '18:00',
    isPartyAttending: false,
  },
  {
    id: '6',
    name: '한소희',
    room: '201호',
    isCheckedIn: false,
    isPartyAttending: true,
    memo: '공항픽업 요청',
  },
]

const allCheckedInGuests: GuestData[] = initialGuests.map((g) => ({
  ...g,
  isCheckedIn: true,
}))

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
// 탭 필터 컴포넌트
// ---------------------------------------------------------------------------

interface FilterTabsProps {
  activeTab: FilterTab
  onTabChange: (tab: FilterTab) => void
  counts: { all: number; checkedIn: number; notCheckedIn: number }
}

function FilterTabs({ activeTab, onTabChange, counts }: FilterTabsProps) {
  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: '전체', count: counts.all },
    { key: 'checkedIn', label: '체크인', count: counts.checkedIn },
    { key: 'notCheckedIn', label: '미체크인', count: counts.notCheckedIn },
  ]

  return (
    <View style={tabStyles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            style={[tabStyles.tab, isActive && tabStyles.tabActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${tab.label} ${tab.count}명`}
          >
            <RNText style={[tabStyles.tabLabel, isActive && tabStyles.tabLabelActive]}>
              {tab.label}
            </RNText>
            <View style={[tabStyles.countBadge, isActive && tabStyles.countBadgeActive]}>
              <RNText style={[tabStyles.countText, isActive && tabStyles.countTextActive]}>
                {tab.count}
              </RNText>
            </View>
          </Pressable>
        )
      })}
    </View>
  )
}

const tabStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.neutral[200],
    borderRadius: radius.full,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
  },
  tabActive: {
    backgroundColor: colors.surface.card,
  },
  tabLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
  },
  tabLabelActive: {
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
  },
  countBadge: {
    backgroundColor: colors.neutral[400],
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    minWidth: 22,
    alignItems: 'center',
  },
  countBadgeActive: {
    backgroundColor: colors.brand.primary,
  },
  countText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text.secondary,
  },
  countTextActive: {
    color: colors.text.onBrand,
  },
})

// ---------------------------------------------------------------------------
// 게스트 카드 컴포넌트 (리디자인)
// ---------------------------------------------------------------------------

interface GuestCardProps {
  guest: GuestData
  onToggleCheckin: () => void
  onSendMessage: () => void
}

function GuestCard({ guest, onToggleCheckin, onSendMessage }: GuestCardProps) {
  return (
    <Card padding="none">
      <View style={guestStyles.content}>
        {/* 상단: 아바타 + 이름 + 방 + 스위치 */}
        <View style={guestStyles.topRow}>
          <Avatar size="md" fallback={guest.name.charAt(0)} />
          <View style={guestStyles.info}>
            <View style={guestStyles.nameRow}>
              <RNText style={guestStyles.name}>{guest.name}</RNText>
              <Badge
                label={guest.isCheckedIn ? '체크인' : '미체크인'}
                variant={guest.isCheckedIn ? 'success' : 'error'}
              />
            </View>
            <View style={guestStyles.detailRow}>
              <Icon name="bed-outline" size="sm" color="secondary" />
              <RNText style={guestStyles.detail}>{guest.room}</RNText>
              {guest.expectedTime && (
                <>
                  <View style={guestStyles.detailDot} />
                  <Icon name="time-outline" size="sm" color="secondary" />
                  <RNText style={guestStyles.detail}>{guest.expectedTime}</RNText>
                </>
              )}
            </View>
          </View>
          <Switch
            value={guest.isCheckedIn}
            onValueChange={onToggleCheckin}
            accessibilityLabel={`${guest.name} 체크인 토글`}
          />
        </View>

        {/* 하단: 배지 + 액션 */}
        <View style={guestStyles.bottomRow}>
          <View style={guestStyles.badges}>
            <Badge
              label={guest.isPartyAttending ? '파티 참가' : '파티 불참'}
              variant={guest.isPartyAttending ? 'info' : 'default'}
            />
            {guest.memo && (
              <Badge label="메모 있음" variant="warning" />
            )}
          </View>
          <Pressable
            onPress={onSendMessage}
            style={({ pressed }) => [
              guestStyles.msgButton,
              pressed && guestStyles.msgButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${guest.name}에게 문자 발송`}
          >
            <Icon name="chatbubble-outline" size="sm" color="brand" />
          </Pressable>
        </View>

        {/* 메모 (있을 경우) */}
        {guest.memo && (
          <View style={guestStyles.memoArea}>
            <View style={guestStyles.memoAccent} />
            <RNText style={guestStyles.memoText}>{guest.memo}</RNText>
          </View>
        )}
      </View>
    </Card>
  )
}

const guestStyles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detail: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  detailDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.neutral[600],
    marginHorizontal: spacing.xs,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  msgButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.brand.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  msgButtonPressed: {
    opacity: 0.7,
  },
  memoArea: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.neutral[200],
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  memoAccent: {
    width: 3,
    height: '100%' as any,
    minHeight: 16,
    borderRadius: 2,
    backgroundColor: colors.status.warning,
  },
  memoText: {
    flex: 1,
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    lineHeight: typography.sizes.xs * typography.lineHeights.relaxed,
  },
})

// ---------------------------------------------------------------------------
// 전체 완료 배너
// ---------------------------------------------------------------------------

function AllCheckedInBanner() {
  return (
    <View style={bannerStyles.container}>
      <View style={bannerStyles.iconCircle}>
        <Icon name="checkmark-circle" size="md" color="onBrand" />
      </View>
      <RNText style={bannerStyles.title}>모든 게스트가 체크인했습니다</RNText>
      <RNText style={bannerStyles.description}>오늘의 체크인이 완료되었습니다</RNText>
    </View>
  )
}

const bannerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
    backgroundColor: colors.status.successBg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.status.success + '33',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.status.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.status.successText,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
})

// ---------------------------------------------------------------------------
// 체크인 페이지 컴포넌트
// ---------------------------------------------------------------------------

interface CheckinsPageProps {
  initialGuests: GuestData[]
  onSendMessage?: (name: string) => void
}

function CheckinsPage({
  initialGuests: guestList,
  onSendMessage = fn(),
}: CheckinsPageProps) {
  const [guests, setGuests] = useState<GuestData[]>(guestList)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const handleToggleCheckin = (id: string) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, isCheckedIn: !g.isCheckedIn } : g)),
    )
  }

  const checkedInCount = guests.filter((g) => g.isCheckedIn).length
  const notCheckedInCount = guests.length - checkedInCount
  const allCheckedIn = notCheckedInCount === 0

  const filteredGuests = guests.filter((g) => {
    if (activeTab === 'checkedIn') return g.isCheckedIn
    if (activeTab === 'notCheckedIn') return !g.isCheckedIn
    return true
  })

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.brandDot} />
            <RNText style={styles.dateLabel}>{getTodayLabel()}</RNText>
          </View>
        </View>
        <Text variant="h2" weight="bold">오늘의 체크인</Text>
      </View>

      {/* 탭 필터 */}
      <View style={styles.tabWrapper}>
        <FilterTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={{
            all: guests.length,
            checkedIn: checkedInCount,
            notCheckedIn: notCheckedInCount,
          }}
        />
      </View>

      {/* 게스트 목록 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 전체 완료 배너 */}
        {allCheckedIn && activeTab !== 'notCheckedIn' && <AllCheckedInBanner />}

        {/* 게스트 카드 */}
        {filteredGuests.map((guest) => (
          <GuestCard
            key={guest.id}
            guest={guest}
            onToggleCheckin={() => handleToggleCheckin(guest.id)}
            onSendMessage={() => onSendMessage(guest.name)}
          />
        ))}

        {/* 빈 상태 */}
        {filteredGuests.length === 0 && !allCheckedIn && (
          <View style={styles.emptyState}>
            <Icon name="search-outline" size="md" color="secondary" />
            <RNText style={styles.emptyText}>
              {activeTab === 'checkedIn'
                ? '아직 체크인한 게스트가 없습니다'
                : '미체크인 게스트가 없습니다'}
            </RNText>
          </View>
        )}
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
  header: {
    gap: spacing.xs,
    paddingBottom: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  dateLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
  },
  tabWrapper: {
    paddingBottom: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.sm,
    paddingBottom: spacing['2xl'],
  },
  emptyState: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing['3xl'],
  },
  emptyText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
})

// ---------------------------------------------------------------------------
// 스토리 메타
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Admin Screens/Checkins/Checkins',
  component: CheckinsPage,
  decorators: [MobileFrame],
}

export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// 스토리
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: () => (
    <CheckinsPage
      initialGuests={initialGuests}
      onSendMessage={fn()}
    />
  ),
}

export const AllCheckedIn: Story = {
  render: () => (
    <CheckinsPage
      initialGuests={allCheckedInGuests}
      onSendMessage={fn()}
    />
  ),
}
