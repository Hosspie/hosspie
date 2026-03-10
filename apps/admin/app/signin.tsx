import { Spinner } from '@hosspie/design-system/components/spinner';
import { VStack } from '@hosspie/design-system/components/stacks';
import { BackgroundLayout } from '@hosspie/design-system/organisms/background-layout';
import { ImageContainer } from '@hosspie/design-system/organisms/image-container';
import { radius } from '@hosspie/design-system/tokens/radius';
import { sizing } from '@hosspie/design-system/tokens/sizing';
import { spacing } from '@hosspie/design-system/tokens/spacing';
import { typography } from '@hosspie/design-system/tokens/typography';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import AppleLogo from '../assets/images/apple_logo.svg';
import KakaoIcon from '../assets/images/kakao_icon.svg';
import Logo from '../assets/images/logo.svg';
import NaverIcon from '../assets/images/naver_icon.svg';

import { useSession } from '@/providers/session';

const SOCIAL_BRANDS = {
  kakao: { backgroundColor: '#FEE500', textColor: '#000000' },
  naver: { backgroundColor: '#2DB400', textColor: '#000000' },
  apple: { backgroundColor: '#FFFFFF', textColor: '#000000' },
} as const;

interface SocialButtonProps {
  text: string;
  icon: React.FC<{ width: number; height: number }>;
  brand: keyof typeof SOCIAL_BRANDS;
  onPress: () => void;
}

function SocialButton({ text, icon: Icon, brand, onPress }: SocialButtonProps) {
  const { backgroundColor, textColor } = SOCIAL_BRANDS[brand];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        borderRadius: radius.md,
        backgroundColor,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View style={{ position: 'absolute', left: spacing.xl }}>
        <Icon width={sizing.iconMd} height={sizing.iconMd} />
      </View>
      <Text
        style={{
          fontSize: typography.sizes.md,
          fontWeight: typography.weights.semibold,
          color: textColor,
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
}

export default function SigninScreen() {
  const { isLoading, signIn } = useSession();

  const handleSignIn = async () => {
    signIn();
    router.replace('/');
  };

  if (isLoading) {
    return <Spinner size="lg" />;
  }

  return (
    <BackgroundLayout edges={['top', 'bottom']}>
      <VStack flex={1} justify="center" gap="lg">
        <ImageContainer src={Logo} alt="logo" size={120} />
        <VStack gap="sm">
          <SocialButton
            text="카카오톡 로그인"
            icon={KakaoIcon}
            brand="kakao"
            onPress={handleSignIn}
          />
          <SocialButton
            text="네이버 로그인"
            icon={NaverIcon}
            brand="naver"
            onPress={handleSignIn}
          />
          <SocialButton text="애플 로그인" icon={AppleLogo} brand="apple" onPress={handleSignIn} />
        </VStack>
      </VStack>
    </BackgroundLayout>
  );
}
