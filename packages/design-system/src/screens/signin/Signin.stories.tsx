import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { View, Pressable, Text as RNText, StyleSheet } from 'react-native'
import { MobileFrame } from '../../../.storybook/decorators/MobileFrame'
import { Text } from '../../components/text'
import { Icon } from '../../components/icon'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'
import { radius } from '../../tokens/radius'

// ---------------------------------------------------------------------------
// 소셜 로그인 브랜드 상수
// ---------------------------------------------------------------------------

const KAKAO_BG = '#FEE500'
const KAKAO_TEXT = '#191919'
const NAVER_BG = '#03C75A'
const NAVER_TEXT = '#FFFFFF'

// ---------------------------------------------------------------------------
// 소셜 버튼 컴포넌트 (pill 스타일)
// ---------------------------------------------------------------------------

interface SocialButtonProps {
  label: string
  iconName: string
  backgroundColor: string
  textColor: string
  onPress?: () => void
  disabled?: boolean
}

function SocialButton({
  label,
  iconName,
  backgroundColor,
  textColor,
  onPress,
  disabled = false,
}: SocialButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        socialStyles.base,
        { backgroundColor },
        pressed && !disabled && socialStyles.pressed,
        disabled && socialStyles.disabled,
      ]}
    >
      <RNText style={[socialStyles.icon, { color: textColor }]}>{iconName}</RNText>
      <RNText style={[socialStyles.label, { color: textColor }]}>{label}</RNText>
    </Pressable>
  )
}

function AppleButton({
  onPress,
  disabled = false,
}: {
  onPress?: () => void
  disabled?: boolean
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessible
      accessibilityRole="button"
      accessibilityLabel="Apple로 로그인"
      style={({ pressed }) => [
        socialStyles.base,
        socialStyles.appleBase,
        pressed && !disabled && socialStyles.applePressed,
        disabled && socialStyles.disabled,
      ]}
    >
      <RNText style={socialStyles.appleIcon}>{'\uF8FF'}</RNText>
      <RNText style={socialStyles.appleLabel}>Apple로 로그인</RNText>
    </Pressable>
  )
}

const socialStyles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 52,
    gap: spacing.sm,
  },
  icon: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  appleBase: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.neutral[500],
  },
  applePressed: {
    backgroundColor: colors.neutral[300],
  },
  appleIcon: {
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    fontWeight: typography.weights.bold,
  },
  appleLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
})

// ---------------------------------------------------------------------------
// 구분선
// ---------------------------------------------------------------------------

function OrDivider() {
  return (
    <View style={dividerStyles.container}>
      <View style={dividerStyles.line} />
      <RNText style={dividerStyles.text}>또는</RNText>
      <View style={dividerStyles.line} />
    </View>
  )
}

const dividerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral[400],
  },
  text: {
    fontSize: typography.sizes.xs,
    color: colors.text.disabled,
    fontWeight: typography.weights.medium,
  },
})

// ---------------------------------------------------------------------------
// 페이지 컴포넌트
// ---------------------------------------------------------------------------

interface SigninPageProps {
  onKakaoPress?: () => void
  onNaverPress?: () => void
  onApplePress?: () => void
  isLoading?: boolean
}

const SigninPage = ({
  onKakaoPress,
  onNaverPress,
  onApplePress,
  isLoading = false,
}: SigninPageProps) => {
  return (
    <View style={styles.container}>
      {/* 상단: 브랜드 히어로 영역 */}
      <View style={styles.heroArea}>
        {/* 장식용 브랜드 글로우 */}
        <View style={styles.glowOuter}>
          <View style={styles.glowInner} />
        </View>
        {/* 브랜드 로고 */}
        <RNText style={styles.brandName}>Hosspie</RNText>
        <RNText style={styles.brandTagline}>호스트를 위한 공간</RNText>
      </View>

      {/* 중간: 마케팅 카피 */}
      <View style={styles.copyArea}>
        <Text variant="h1" weight="bold">
          {'게스트하우스 관리,\n더 쉽게 시작하세요'}
        </Text>
        <RNText style={styles.copyDescription}>
          호스트를 위한 올인원 게스트하우스 운영 관리 서비스
        </RNText>
      </View>

      {/* 하단: 소셜 로그인 */}
      <View style={styles.buttonArea}>
        <SocialButton
          label="카카오로 계속하기"
          iconName="💬"
          backgroundColor={KAKAO_BG}
          textColor={KAKAO_TEXT}
          onPress={onKakaoPress}
          disabled={isLoading}
        />

        <SocialButton
          label="네이버로 계속하기"
          iconName="N"
          backgroundColor={NAVER_BG}
          textColor={NAVER_TEXT}
          onPress={onNaverPress}
          disabled={isLoading}
        />

        <OrDivider />

        <AppleButton onPress={onApplePress} disabled={isLoading} />
      </View>

      {/* 하단 약관 안내 */}
      <RNText style={styles.termsText}>
        계속 진행 시 서비스 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주합니다
      </RNText>
    </View>
  )
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface.base,
  },

  // 히어로 영역
  heroArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  glowOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.brand.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  glowInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.brand.primary,
    opacity: 0.3,
  },
  brandName: {
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.bold,
    color: colors.brand.primary,
    letterSpacing: -1,
  },
  brandTagline: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },

  // 마케팅 카피
  copyArea: {
    alignItems: 'center',
    paddingBottom: spacing['2xl'],
    gap: spacing.sm,
  },
  copyDescription: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.sizes.sm * typography.lineHeights.relaxed,
  },

  // 버튼 영역
  buttonArea: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },

  // 약관
  termsText: {
    fontSize: typography.sizes.xs,
    color: colors.text.disabled,
    textAlign: 'center',
    lineHeight: typography.sizes.xs * typography.lineHeights.relaxed,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
})

// ---------------------------------------------------------------------------
// 스토리 메타
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Admin Screens/Signin/Signin',
  component: SigninPage,
  decorators: [MobileFrame],
}

export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// 스토리
// ---------------------------------------------------------------------------

/**
 * 기본 로그인 화면.
 * Pill 스타일 소셜 버튼과 브랜드 히어로 영역이 특징.
 */
export const Default: Story = {
  render: () => {
    const Page = () => {
      const [isLoading, setIsLoading] = useState(false)

      const handleSocialLogin = (provider: string) => {
        fn()()
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 2000)
      }

      return (
        <SigninPage
          onKakaoPress={() => handleSocialLogin('kakao')}
          onNaverPress={() => handleSocialLogin('naver')}
          onApplePress={() => handleSocialLogin('apple')}
          isLoading={isLoading}
        />
      )
    }
    return <Page />
  },
}

/**
 * 로딩 상태.
 */
export const WithLoading: Story = {
  render: () => (
    <SigninPage
      onKakaoPress={fn()}
      onNaverPress={fn()}
      onApplePress={fn()}
      isLoading={true}
    />
  ),
}
