import { VStack } from '@hosspie/design-system/components/v-stack';
import { BackgroundLayout } from '@hosspie/design-system/organisms/background-layout';
import { IButtonProps, Buttons } from '@hosspie/design-system/organisms/buttons';
import { ImageContainer } from '@hosspie/design-system/organisms/image-container';
import { router } from 'expo-router';

import AppleLogo from '../assets/images/apple_logo.svg';
import KakaoIcon from '../assets/images/kakao_icon.svg';
import Logo from '../assets/images/logo.svg';
import NaverIcon from '../assets/images/naver_icon.svg';

import { useSession } from '@/providers/session';
import { ActivityIndicator } from 'react-native';

export default function SigninScreen() {
  const { isLoading, signIn } = useSession();

  const handleSignIn = async () => {
    signIn();
    router.replace('/');
  };

  const buttons: IButtonProps[] = [
    {
      id: 'save',
      text: '카카오톡 로그인',
      action: 'secondary',
      icon: KakaoIcon,
      iconPosition: 'left',
      backgroundColor: '#FEE500',
      textColor: 'black',
      onPress: handleSignIn,
    },
    {
      id: 'cancel',
      text: '네이버 로그인',
      action: 'secondary',
      iconPosition: 'left',
      backgroundColor: '#2DB400',
      textColor: 'black',
      icon: NaverIcon,
      onPress: handleSignIn,
    },
    {
      id: 'add',
      text: '애플 로그인',
      icon: AppleLogo,
      action: 'secondary',
      textColor: 'black',
      iconPosition: 'left',
      backgroundColor: 'white',
      onPress: handleSignIn,
    },
  ];

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <BackgroundLayout edges={['top', 'bottom']}>
      <VStack style={{ flex: 1, justifyContent: 'center' }}>
        <ImageContainer size="2xl" src={Logo} alt="image" />
        <Buttons direction="vertical" buttons={buttons} />
      </VStack>
    </BackgroundLayout>
  );
}
