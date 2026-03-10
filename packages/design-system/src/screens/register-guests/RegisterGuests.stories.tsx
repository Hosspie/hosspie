import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { View, ScrollView, StyleSheet, Text as RNText } from 'react-native'
import { MobileFrame } from '../../../.storybook/decorators/MobileFrame'
import { Card } from '../../components/card'
import { Text } from '../../components/text'
import { Badge } from '../../components/badge'
import { Switch } from '../../components/switch'
import { Avatar } from '../../components/avatar'
import { Icon } from '../../components/icon'
import { FormField } from '../../organisms/form-field'
import { ButtonGroup } from '../../organisms/button-group'
import { Fab } from '../../organisms/fab'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'
import { radius } from '../../tokens/radius'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GuestForm {
  name: string
  room: string
  expectedCheckInTime: string
  isPartyAttending: boolean
}

interface RegisteredGuest {
  id: string
  name: string
  room: string
  expectedCheckInTime: string
  isPartyAttending: boolean
}

// ---------------------------------------------------------------------------
// 방 목록
// ---------------------------------------------------------------------------

const ROOM_OPTIONS = [
  { value: '101호', label: '101호', description: '4인실 · 혼성' },
  { value: '102호', label: '102호', description: '2인실 · 여성 전용' },
  { value: '201호', label: '201호', description: '3인실 · 남성 전용' },
  { value: '202호', label: '202호', description: '커플룸 · 혼성' },
]

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
// 게스트 등록 폼 카드
// ---------------------------------------------------------------------------

interface GuestFormCardProps {
  index: number
  total: number
  form: GuestForm
  onChange: (form: GuestForm) => void
}

function GuestFormCard({ index, total, form, onChange }: GuestFormCardProps) {
  return (
    <Card padding="lg">
      {/* 폼 번호 (여러 명일 때) */}
      {total > 1 && (
        <View style={formStyles.indexRow}>
          <View style={formStyles.indexDot} />
          <RNText style={formStyles.indexText}>게스트 {index + 1}</RNText>
        </View>
      )}

      {/* 이름 */}
      <FormField
        type="input"
        title="이름"
        placeholder="게스트 이름을 입력하세요"
        value={form.name}
        onChange={(value: string) => onChange({ ...form, name: value })}
        isRequired
      />

      {/* 배정 방 */}
      <FormField<string>
        type="card"
        title="배정 방"
        value={form.room}
        onChange={(value: string) => onChange({ ...form, room: value })}
        isRequired
        options={ROOM_OPTIONS}
      />

      {/* 체크인 예상 시간 */}
      <FormField
        type="input"
        title="체크인 예상 시간"
        placeholder="예: 15:00"
        value={form.expectedCheckInTime}
        onChange={(value: string) => onChange({ ...form, expectedCheckInTime: value })}
      />

      {/* 파티 참가 여부 */}
      <View style={formStyles.switchRow}>
        <View style={formStyles.switchLabel}>
          <RNText style={formStyles.switchTitle}>파티 참가 여부</RNText>
          <RNText style={formStyles.switchCaption}>저녁 파티 참가 여부를 선택하세요</RNText>
        </View>
        <Switch
          value={form.isPartyAttending}
          onValueChange={(value: boolean) => onChange({ ...form, isPartyAttending: value })}
        />
      </View>
    </Card>
  )
}

const formStyles = StyleSheet.create({
  indexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  indexDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.brand.primary,
  },
  indexText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.brand.primary,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  switchLabel: {
    flex: 1,
    gap: spacing.xs,
  },
  switchTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  switchCaption: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
})

// ---------------------------------------------------------------------------
// 등록된 게스트 카드
// ---------------------------------------------------------------------------

function RegisteredGuestCard({ guest }: { guest: RegisteredGuest }) {
  return (
    <View style={registeredStyles.card}>
      <Avatar size="sm" fallback={guest.name.charAt(0)} />
      <View style={registeredStyles.info}>
        <RNText style={registeredStyles.name}>{guest.name}</RNText>
        <View style={registeredStyles.detailRow}>
          <Icon name="bed-outline" size="sm" color="secondary" />
          <RNText style={registeredStyles.detail}>{guest.room}</RNText>
          {guest.expectedCheckInTime && (
            <>
              <View style={registeredStyles.detailDot} />
              <Icon name="time-outline" size="sm" color="secondary" />
              <RNText style={registeredStyles.detail}>{guest.expectedCheckInTime}</RNText>
            </>
          )}
        </View>
      </View>
      <Badge
        label={guest.isPartyAttending ? '파티 참가' : '파티 불참'}
        variant={guest.isPartyAttending ? 'success' : 'default'}
      />
    </View>
  )
}

function RegisteredGuestsList({ guests }: { guests: RegisteredGuest[] }) {
  if (guests.length === 0) return null

  return (
    <View style={registeredStyles.container}>
      <View style={registeredStyles.headerRow}>
        <Icon name="checkmark-circle-outline" size="sm" color="brand" />
        <RNText style={registeredStyles.headerLabel}>등록된 게스트</RNText>
        <Badge label={`${guests.length}명`} variant="default" />
      </View>
      <Card padding="none">
        {guests.map((guest, index) => (
          <View key={guest.id}>
            <RegisteredGuestCard guest={guest} />
            {index < guests.length - 1 && (
              <View style={registeredStyles.divider} />
            )}
          </View>
        ))}
      </Card>
    </View>
  )
}

const registeredStyles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerLabel: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    fontSize: typography.sizes.sm,
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
  divider: {
    height: 1,
    backgroundColor: colors.border.normal,
    marginHorizontal: spacing.lg,
  },
})

// ---------------------------------------------------------------------------
// RegisterGuests 페이지
// ---------------------------------------------------------------------------

interface RegisterGuestsPageProps {
  initialRegisteredGuests?: RegisteredGuest[]
  onRegisterAndSend?: (guests: GuestForm[], registered: RegisteredGuest[]) => void
}

function RegisterGuestsPage({
  initialRegisteredGuests = [],
  onRegisterAndSend = fn(),
}: RegisterGuestsPageProps) {
  const emptyForm: GuestForm = {
    name: '',
    room: '',
    expectedCheckInTime: '',
    isPartyAttending: false,
  }

  const [forms, setForms] = useState<GuestForm[]>([{ ...emptyForm }])
  const [registeredGuests] = useState<RegisteredGuest[]>(initialRegisteredGuests)

  const handleFormChange = (index: number, updated: GuestForm) => {
    setForms((prev) => prev.map((f, i) => (i === index ? updated : f)))
  }

  const handleAddGuest = () => {
    setForms((prev) => [...prev, { ...emptyForm }])
  }

  const handleRegisterAndSend = () => {
    onRegisterAndSend(forms, registeredGuests)
  }

  const hasRegistered = registeredGuests.length > 0
  const buttonLabel = hasRegistered ? '추가 등록 및 문자 발송' : '일괄 등록 및 문자 발송'

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.brandDot} />
            <RNText style={styles.dateLabel}>{getTodayLabel()}</RNText>
          </View>
        </View>
        <Text variant="h2" weight="bold">오늘의 게스트 등록</Text>

        {/* 안내 문구 */}
        <View style={styles.noticeRow}>
          <View style={styles.noticeIconCircle}>
            <Icon name="information-circle-outline" size="sm" color="brand" />
          </View>
          <RNText style={styles.noticeText}>등록 시 안내 문자가 자동 발송됩니다</RNText>
        </View>

        {/* 등록된 게스트 */}
        {hasRegistered && (
          <RegisteredGuestsList guests={registeredGuests} />
        )}

        {/* 게스트 입력 폼 */}
        <View style={styles.formsSection}>
          <View style={styles.formsSectionHeader}>
            <RNText style={styles.formsSectionTitle}>
              {hasRegistered ? '추가 게스트 입력' : '게스트 정보 입력'}
            </RNText>
          </View>
          {forms.map((form, index) => (
            <GuestFormCard
              key={index}
              index={index}
              total={forms.length}
              form={form}
              onChange={(updated) => handleFormChange(index, updated)}
            />
          ))}
        </View>

        {/* 하단 여백 (FAB 겹침 방지) */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* FAB: 게스트 추가 */}
      <View style={styles.fabContainer}>
        <Fab
          placement="right"
          items={[
            {
              icon: React.createElement(Icon, { name: 'add', color: 'onBrand' }),
              label: '게스트 추가',
              onPress: handleAddGuest,
            },
          ]}
        />
      </View>

      {/* 하단 버튼 */}
      <ButtonGroup
        placement="default"
        direction="vertical"
        buttons={[
          {
            text: buttonLabel,
            onPress: handleRegisterAndSend,
            variant: 'primary',
          },
        ]}
      />
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
    flexGrow: 1,
    gap: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  dateLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.brand.primaryLight,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.brand.primary + '33',
  },
  noticeIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.brand.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
  formsSection: {
    gap: spacing.md,
  },
  formsSectionHeader: {
    marginBottom: spacing.xs,
  },
  formsSectionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  bottomSpacer: {
    height: spacing['3xl'],
  },
  fabContainer: {
    position: 'absolute',
    right: 0,
    bottom: spacing['3xl'] + spacing.xl,
    width: '100%',
    pointerEvents: 'box-none',
  } as any,
})

// ---------------------------------------------------------------------------
// 스토리 메타
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Admin Screens/RegisterGuests/RegisterGuests',
  component: RegisterGuestsPage,
  decorators: [MobileFrame],
}

export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// 스토리
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: () => {
    const Page = () => (
      <RegisterGuestsPage
        initialRegisteredGuests={[]}
        onRegisterAndSend={fn()}
      />
    )
    return <Page />
  },
}

export const WithRegisteredGuests: Story = {
  render: () => {
    const registeredGuests: RegisteredGuest[] = [
      {
        id: '1',
        name: '김민준',
        room: '101호',
        expectedCheckInTime: '14:00',
        isPartyAttending: true,
      },
      {
        id: '2',
        name: '이서연',
        room: '102호',
        expectedCheckInTime: '15:30',
        isPartyAttending: false,
      },
      {
        id: '3',
        name: '박지훈',
        room: '201호',
        expectedCheckInTime: '17:00',
        isPartyAttending: true,
      },
    ]

    const Page = () => (
      <RegisterGuestsPage
        initialRegisteredGuests={registeredGuests}
        onRegisterAndSend={fn()}
      />
    )
    return <Page />
  },
}
