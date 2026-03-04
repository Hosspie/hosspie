import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import 'react-native-reanimated';

import { useInitialAndroidBarSync } from '@/hooks/useColorScheme';
import { ApolloProvider } from '@/providers/apollo';
import { SessionProvider, useSession } from '@/providers/session';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  useInitialAndroidBarSync();

  return (
    <ApolloProvider>
      <SessionProvider>
        <StatusBar key="root-status-bar-light" style="light" />
        <RootNavigator />
      </SessionProvider>
    </ApolloProvider>
  );
};

export default RootLayout;

const RootNavigator = () => {
  const { isLoading, session } = useSession();
  const hasSession = !!session;

  if (isLoading) {
    return null;
  }

  SplashScreen.hideAsync();

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
