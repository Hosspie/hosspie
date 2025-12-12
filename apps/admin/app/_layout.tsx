import '../global.css';

import { GluestackProvider } from '@hosspie/design-system/providers/gluestack';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import 'react-native-reanimated';

import { useInitialAndroidBarSync } from '@/hooks/useColorScheme';
import { SessionProvider, useSession } from '@/providers/session';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  useInitialAndroidBarSync();

  console.log('root layout');

  return (
    <GluestackProvider>
      <SessionProvider>
        <StatusBar key="root-status-bar-light" style="light" />
        <RootNavigator />
      </SessionProvider>
    </GluestackProvider>
  );
};

export default RootLayout;

const RootNavigator = () => {
  const { isLoading, session } = useSession();
  const hasSession = !!session;

  if (isLoading) {
    console.log('root navigator: isLoading');
    return null;
  }

  SplashScreen.hideAsync();

  console.log('root navigator: isLoaded');

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'black' } }}>
      <Stack.Protected guard={hasSession}>
        <Stack.Screen name="(authenticated)" />
      </Stack.Protected>

      <Stack.Protected guard={!hasSession}>
        <Stack.Screen name="signin" />
      </Stack.Protected>
    </Stack>
  );
};
