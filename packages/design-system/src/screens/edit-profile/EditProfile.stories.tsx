import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { View, ScrollView, Pressable, Text as RNText, StyleSheet } from 'react-native'
import { MobileFrame } from '../../../.storybook/decorators/MobileFrame'
import { Avatar } from '../../components/avatar'
import { Icon } from '../../components/icon'
import { Text } from '../../components/text'
import { FormField } from '../../organisms/form-field'
import { ButtonGroup } from '../../organisms/button-group'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'
import { radius } from '../../tokens/radius'

// ---------------------------------------------------------------------------
// Avatar 변경 영역 (리디자인)
// ---------------------------------------------------------------------------

interface AvatarSectionProps {
  fallback: string
  onChangePress: () => void
}

function AvatarSection({ fallback, onChangePress }: AvatarSectionProps) {
  return (
    <View style={avatarStyles.container}>
      {/* 브랜드 배경 */}
      <View style={avatarStyles.bgDecoration} />
      <View style={avatarStyles.avatarRing}>
        <Avatar size="lg" fallback={fallback} />
      </View>
      <Pressable
        style={({ pressed }) => [
          avatarStyles.changeButton,
          pressed && avatarStyles.changeButtonPressed,
        ]}
        onPress={onChangePress}
        accessibilityRole="button"
        accessibilityLabel="프로필 사진 변경"
      >
        <Icon name="camera-outline" size="sm" color="brand" />
        <RNText style={avatarStyles.changeButtonText}>사진 변경</RNText>
      </Pressable>
    </View>
  )
}

const avatarStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  bgDecoration: {
    position: 'absolute',
    top: -40,
    left: -20,
    right: -20,
    height: 100,
    borderRadius: 80,
    backgroundColor: colors.brand.primaryLight,
    opacity: 0.5,
  },
  avatarRing: {
    padding: 3,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.brand.primary,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.neutral[500],
    backgroundColor: 'transparent',
    minHeight: 44,
  },
  changeButtonPressed: {
    backgroundColor: colors.neutral[300],
  },
  changeButtonText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
})

// ---------------------------------------------------------------------------
// HostView 페이지
// ---------------------------------------------------------------------------

interface HostViewPageProps {
  onCancel?: () => void
  onSave?: () => void
  onAvatarChange?: () => void
  initialData?: {
    name?: string
    description?: string
    phone?: string
    email?: string
    website?: string
  }
}

function HostViewPage({
  onCancel = fn(),
  onSave = fn(),
  onAvatarChange = fn(),
  initialData = {},
}: HostViewPageProps) {
  const [name, setName] = useState(initialData.name ?? '')
  const [description, setDescription] = useState(initialData.description ?? '')
  const [phone, setPhone] = useState(initialData.phone ?? '')
  const [email, setEmail] = useState(initialData.email ?? '')
  const [website, setWebsite] = useState(initialData.website ?? '')

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
            <RNText style={styles.headerLabel}>프로필</RNText>
          </View>
        </View>
        <Text variant="h2" weight="bold">게스트하우스 정보 수정</Text>

        {/* Avatar */}
        <AvatarSection fallback="호" onChangePress={onAvatarChange} />

        {/* 폼 필드들 */}
        <FormField
          type="input"
          title="게스트하우스 이름"
          placeholder="예: 홍대 게스트하우스"
          value={name}
          onChange={setName}
          isRequired
        />
        <FormField
          type="textarea"
          title="게스트하우스 설명"
          placeholder="게스트하우스에 대한 간략한 설명을 입력해주세요"
          value={description}
          onChange={setDescription}
          isRequired
        />
        <FormField
          type="input"
          title="대표 전화번호"
          placeholder="예: 02-1234-5678"
          value={phone}
          onChange={setPhone}
          isRequired
        />
        <FormField
          type="input"
          title="이메일"
          placeholder="예: contact@guesthouse.com"
          value={email}
          onChange={setEmail}
          isRequired
        />
        <FormField
          type="input"
          title="홈페이지 (선택사항)"
          placeholder="예: https://guesthouse.com"
          value={website}
          onChange={setWebsite}
        />

        <View style={styles.bottomPadding} />
      </ScrollView>

      <ButtonGroup
        placement="bottom"
        direction="horizontal"
        buttons={[
          { text: '취소', onPress: onCancel, variant: 'outline' },
          { text: '저장', onPress: onSave, variant: 'primary' },
        ]}
      />
    </View>
  )
}

// ---------------------------------------------------------------------------
// StaffView 페이지
// ---------------------------------------------------------------------------

interface StaffViewPageProps {
  onCancel?: () => void
  onSave?: () => void
  onAvatarChange?: () => void
  initialData?: {
    name?: string
    phone?: string
    email?: string
  }
}

function StaffViewPage({
  onCancel = fn(),
  onSave = fn(),
  onAvatarChange = fn(),
  initialData = {},
}: StaffViewPageProps) {
  const [name, setName] = useState(initialData.name ?? '')
  const [phone, setPhone] = useState(initialData.phone ?? '')
  const [email, setEmail] = useState(initialData.email ?? '')

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
            <RNText style={styles.headerLabel}>프로필</RNText>
          </View>
        </View>
        <Text variant="h2" weight="bold">개인 정보 수정</Text>

        {/* Avatar */}
        <AvatarSection fallback="김" onChangePress={onAvatarChange} />

        {/* 폼 필드들 */}
        <FormField
          type="input"
          title="이름"
          placeholder="이름을 입력해주세요"
          value={name}
          onChange={setName}
          isRequired
        />
        <FormField
          type="input"
          title="연락처"
          placeholder="예: 010-1234-5678"
          value={phone}
          onChange={setPhone}
          isRequired
        />
        <FormField
          type="input"
          title="이메일"
          placeholder="예: staff@guesthouse.com"
          value={email}
          onChange={setEmail}
          isRequired
        />

        <View style={styles.bottomPadding} />
      </ScrollView>

      <ButtonGroup
        placement="bottom"
        direction="horizontal"
        buttons={[
          { text: '취소', onPress: onCancel, variant: 'outline' },
          { text: '저장', onPress: onSave, variant: 'primary' },
        ]}
      />
    </View>
  )
}

// ---------------------------------------------------------------------------
// 공통 스타일
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.xs,
    paddingBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
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
  headerLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
  },
  bottomPadding: {
    height: spacing.xl,
  },
})

// ---------------------------------------------------------------------------
// 스토리 메타
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Admin Screens/EditProfile/EditProfile',
  decorators: [MobileFrame],
}

export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// HostView 스토리
// ---------------------------------------------------------------------------

export const HostView: Story = {
  render: () => {
    const Page = () => (
      <HostViewPage
        onCancel={fn()}
        onSave={fn()}
        onAvatarChange={fn()}
      />
    )
    return <Page />
  },
}

export const HostViewWithFilledData: Story = {
  render: () => {
    const Page = () => (
      <HostViewPage
        onCancel={fn()}
        onSave={fn()}
        onAvatarChange={fn()}
        initialData={{
          name: '홍대 게스트하우스',
          description:
            '홍대입구역 2번 출구 도보 5분 거리에 위치한 아늑한 게스트하우스입니다. 깔끔하고 편안한 환경을 제공합니다.',
          phone: '02-1234-5678',
          email: 'contact@hongdae-gh.com',
          website: 'https://hongdae-gh.com',
        }}
      />
    )
    return <Page />
  },
}

export const HostViewWithError: Story = {
  render: () => (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.brandDot} />
            <RNText style={styles.headerLabel}>프로필</RNText>
          </View>
        </View>
        <Text variant="h2" weight="bold">게스트하우스 정보 수정</Text>

        <AvatarSection fallback="호" onChangePress={fn()} />

        <FormField
          type="input"
          title="게스트하우스 이름"
          placeholder="예: 홍대 게스트하우스"
          value=""
          onChange={() => {}}
          isRequired
          error={{ message: '게스트하우스 이름을 입력해주세요' }}
        />
        <FormField
          type="textarea"
          title="게스트하우스 설명"
          placeholder="게스트하우스에 대한 간략한 설명을 입력해주세요"
          value=""
          onChange={() => {}}
          isRequired
          error={{ message: '게스트하우스 설명을 입력해주세요' }}
        />
        <FormField
          type="input"
          title="대표 전화번호"
          placeholder="예: 02-1234-5678"
          value=""
          onChange={() => {}}
          isRequired
          error={{ message: '전화번호를 입력해주세요' }}
        />
        <FormField
          type="input"
          title="이메일"
          placeholder="예: contact@guesthouse.com"
          value="invalid-email"
          onChange={() => {}}
          isRequired
          error={{ message: '올바른 이메일 형식이 아닙니다' }}
        />
        <FormField
          type="input"
          title="홈페이지 (선택사항)"
          placeholder="예: https://guesthouse.com"
          value=""
          onChange={() => {}}
        />

        <View style={styles.bottomPadding} />
      </ScrollView>

      <ButtonGroup
        placement="bottom"
        direction="horizontal"
        buttons={[
          { text: '취소', onPress: fn(), variant: 'outline' },
          { text: '저장', onPress: fn(), variant: 'primary' },
        ]}
      />
    </View>
  ),
}

// ---------------------------------------------------------------------------
// StaffView 스토리
// ---------------------------------------------------------------------------

export const StaffView: Story = {
  render: () => {
    const Page = () => (
      <StaffViewPage
        onCancel={fn()}
        onSave={fn()}
        onAvatarChange={fn()}
      />
    )
    return <Page />
  },
}

export const StaffViewWithFilledData: Story = {
  render: () => {
    const Page = () => (
      <StaffViewPage
        onCancel={fn()}
        onSave={fn()}
        onAvatarChange={fn()}
        initialData={{
          name: '김민준',
          phone: '010-1234-5678',
          email: 'minjun@hongdae-gh.com',
        }}
      />
    )
    return <Page />
  },
}

export const StaffViewWithError: Story = {
  render: () => (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.brandDot} />
            <RNText style={styles.headerLabel}>프로필</RNText>
          </View>
        </View>
        <Text variant="h2" weight="bold">개인 정보 수정</Text>

        <AvatarSection fallback="김" onChangePress={fn()} />

        <FormField
          type="input"
          title="이름"
          placeholder="이름을 입력해주세요"
          value=""
          onChange={() => {}}
          isRequired
          error={{ message: '이름을 입력해주세요' }}
        />
        <FormField
          type="input"
          title="연락처"
          placeholder="예: 010-1234-5678"
          value="123"
          onChange={() => {}}
          isRequired
          error={{ message: '올바른 연락처 형식이 아닙니다' }}
        />
        <FormField
          type="input"
          title="이메일"
          placeholder="예: staff@guesthouse.com"
          value="not-an-email"
          onChange={() => {}}
          isRequired
          error={{ message: '올바른 이메일 형식이 아닙니다' }}
        />

        <View style={styles.bottomPadding} />
      </ScrollView>

      <ButtonGroup
        placement="bottom"
        direction="horizontal"
        buttons={[
          { text: '취소', onPress: fn(), variant: 'outline' },
          { text: '저장', onPress: fn(), variant: 'primary' },
        ]}
      />
    </View>
  ),
}
