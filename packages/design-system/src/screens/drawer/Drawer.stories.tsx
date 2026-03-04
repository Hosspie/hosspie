import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { View, ScrollView, Pressable, StyleSheet, Text as RNText } from 'react-native'
import { MobileFrame } from '../../../.storybook/decorators/MobileFrame'
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

type DrawerRole = 'host' | 'staff'

interface DrawerPageProps {
  role?: DrawerRole
  userName?: string
  guesthouseName?: string
  onEditProfile?: () => void
  onGuesthouseInfo?: () => void
  onSchedule?: () => void
  onLogout?: () => void
}

// ---------------------------------------------------------------------------
// 프로필 헤더 (브랜드 틴트 배경)
// ---------------------------------------------------------------------------

interface ProfileHeaderProps {
  userName: string
  guesthouseName: string
  role: DrawerRole
  onEditProfile: () => void
}

function ProfileHeader({ userName, guesthouseName, role, onEditProfile }: ProfileHeaderProps) {
  const roleLabel = role === 'host' ? '호스트' : '스탭'

  return (
    <View style={profileStyles.container}>
      {/* 브랜드 배경 장식 */}
      <View style={profileStyles.bgDecoration} />

      <View style={profileStyles.content}>
        {/* 아바타 */}
        <View style={profileStyles.avatarWrapper}>
          <View style={profileStyles.avatarRing}>
            <Avatar size="lg" fallback={userName.charAt(0)} />
          </View>
        </View>

        {/* 이름 + 역할 */}
        <View style={profileStyles.infoGroup}>
          <View style={profileStyles.nameRow}>
            <RNText style={profileStyles.name}>{userName}</RNText>
            <Badge
              label={roleLabel}
              variant={role === 'host' ? 'info' : 'success'}
            />
          </View>
          <RNText style={profileStyles.guesthouse}>{guesthouseName}</RNText>
        </View>

        {/* 프로필 수정 버튼 */}
        <Pressable
          onPress={onEditProfile}
          style={({ pressed }) => [
            profileStyles.editButton,
            pressed && profileStyles.editButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="프로필 수정"
        >
          <Icon name="create-outline" size="sm" color="brand" />
          <RNText style={profileStyles.editButtonText}>프로필 수정</RNText>
        </Pressable>
      </View>
    </View>
  )
}

const profileStyles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.normal,
  },
  bgDecoration: {
    position: 'absolute',
    top: -60,
    left: -20,
    right: -20,
    height: 140,
    borderRadius: 100,
    backgroundColor: colors.brand.primaryLight,
    opacity: 0.6,
  },
  content: {
    alignItems: 'center',
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  avatarWrapper: {
    alignItems: 'center',
  },
  avatarRing: {
    padding: 3,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.brand.primary,
  },
  infoGroup: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  guesthouse: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
    color: colors.text.secondary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.brand.primary + '66',
    backgroundColor: colors.brand.primaryLight,
  },
  editButtonPressed: {
    opacity: 0.7,
  },
  editButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.brand.primary,
  },
})

// ---------------------------------------------------------------------------
// 메뉴 아이템 컴포넌트 (리디자인)
// ---------------------------------------------------------------------------

interface MenuItemRowProps {
  iconName: string
  label: string
  description?: string
  onPress?: () => void
  rightElement?: React.ReactNode
  showArrow?: boolean
}

function MenuItemRow({
  iconName,
  label,
  description,
  onPress,
  rightElement,
  showArrow = true,
}: MenuItemRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        menuStyles.container,
        pressed && onPress && menuStyles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={menuStyles.iconCircle}>
        <Icon name={iconName as any} size="sm" color="primary" />
      </View>
      <View style={menuStyles.textWrapper}>
        <RNText style={menuStyles.label}>{label}</RNText>
        {description && (
          <RNText style={menuStyles.description}>{description}</RNText>
        )}
      </View>
      {rightElement || (
        showArrow && <Icon name="chevron-forward" size="sm" color="secondary" />
      )}
    </Pressable>
  )
}

const menuStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },
  pressed: {
    backgroundColor: colors.neutral[200],
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    flex: 1,
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
  },
  description: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
})

// ---------------------------------------------------------------------------
// 섹션 헤더
// ---------------------------------------------------------------------------

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={sectionStyles.header}>
      <RNText style={sectionStyles.title}>{title}</RNText>
    </View>
  )
}

const sectionStyles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text.disabled,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
})

// ---------------------------------------------------------------------------
// DrawerPage 컴포넌트
// ---------------------------------------------------------------------------

const DrawerPage = ({
  role = 'host',
  userName = '김호스트',
  guesthouseName = '홍대 게스트하우스',
  onEditProfile = fn(),
  onGuesthouseInfo = fn(),
  onSchedule = fn(),
  onLogout = fn(),
}: DrawerPageProps) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(true)

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 헤더 */}
        <ProfileHeader
          userName={userName}
          guesthouseName={guesthouseName}
          role={role}
          onEditProfile={onEditProfile}
        />

        {/* 관리 메뉴 */}
        <SectionHeader title="관리" />
        {role === 'host' ? (
          <MenuItemRow
            iconName="home-outline"
            label="게스트하우스 정보"
            description="업체 정보 수정"
            onPress={onGuesthouseInfo}
          />
        ) : (
          <MenuItemRow
            iconName="calendar-outline"
            label="근무 일정"
            description="이번주 근무 확인"
            onPress={onSchedule}
          />
        )}

        {/* 설정 메뉴 */}
        <SectionHeader title="설정" />
        <MenuItemRow
          iconName="notifications-outline"
          label="알림"
          showArrow={false}
          rightElement={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              accessibilityLabel="알림 설정 토글"
            />
          }
        />
        <MenuItemRow
          iconName="moon-outline"
          label="다크 모드"
          showArrow={false}
          rightElement={
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              accessibilityLabel="다크 모드 토글"
            />
          }
        />
        <MenuItemRow
          iconName="language-outline"
          label="언어"
          description="한국어"
        />

        {/* 기타 */}
        <SectionHeader title="기타" />
        <MenuItemRow
          iconName="help-circle-outline"
          label="도움말"
        />
        <MenuItemRow
          iconName="document-text-outline"
          label="이용약관"
        />
        <MenuItemRow
          iconName="shield-checkmark-outline"
          label="개인정보 처리방침"
        />
      </ScrollView>

      {/* 하단: 로그아웃 + 버전 */}
      <View style={styles.footer}>
        <Pressable
          onPress={onLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="로그아웃"
        >
          <Icon name="log-out-outline" size="sm" color="secondary" />
          <RNText style={styles.logoutText}>로그아웃</RNText>
        </Pressable>
        <RNText style={styles.versionText}>Hosspie v1.0.0</RNText>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  footer: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.normal,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
  },
  logoutPressed: {
    backgroundColor: colors.neutral[200],
  },
  logoutText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
  },
  versionText: {
    fontSize: typography.sizes.xs,
    color: colors.text.disabled,
  },
})

// ---------------------------------------------------------------------------
// 스토리 메타
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Admin Screens/Drawer/Drawer',
  component: DrawerPage,
  decorators: [MobileFrame],
}

export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// 스토리
// ---------------------------------------------------------------------------

export const HostView: Story = {
  render: () => (
    <DrawerPage
      role="host"
      userName="김호스트"
      guesthouseName="홍대 게스트하우스"
      onEditProfile={fn()}
      onGuesthouseInfo={fn()}
      onLogout={fn()}
    />
  ),
}

export const StaffView: Story = {
  render: () => (
    <DrawerPage
      role="staff"
      userName="이스탭"
      guesthouseName="홍대 게스트하우스"
      onEditProfile={fn()}
      onSchedule={fn()}
      onLogout={fn()}
    />
  ),
}
