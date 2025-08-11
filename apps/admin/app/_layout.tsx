import '@/global.css';

import { GluestackProvider } from '@hosspie/design-system/providers/gluestack';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import 'react-native-reanimated';

import '../global.css';

import { useInitialAndroidBarSync } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    NotoSansKR: require('../assets/fonts/NotoSansKR-Regular.ttf'),
  });

  useInitialAndroidBarSync();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GluestackProvider>
      <StatusBar key="root-status-bar-dark" style="dark" />
      <Stack>
        <Stack.Screen name="+not-found" />
      </Stack>
    </GluestackProvider>
  );
}
