import * as NavigationBar from 'expo-navigation-bar';
import * as React from 'react';
import { Platform, useColorScheme as useRNColorScheme } from 'react-native';

const useColorScheme = () => {
  const colorScheme = useRNColorScheme() ?? 'light';
  const [currentScheme, setCurrentScheme] = React.useState<'light' | 'dark'>(colorScheme);

  async function setColorScheme(scheme: 'light' | 'dark') {
    setCurrentScheme(scheme);
    if (Platform.OS !== 'android') return;
    try {
      await setNavigationBar(scheme);
    } catch (error) {
      console.error('useColorScheme.ts', 'setColorScheme', error);
    }
  }

  function toggleColorScheme() {
    return setColorScheme(currentScheme === 'light' ? 'dark' : 'light');
  }

  return {
    colorScheme: currentScheme,
    isDarkColorScheme: currentScheme === 'dark',
    setColorScheme,
    toggleColorScheme,
  };
};

/**
 * Set the Android navigation bar color based on the color scheme.
 */
const useInitialAndroidBarSync = () => {
  const { colorScheme } = useColorScheme();
  React.useEffect(() => {
    if (Platform.OS !== 'android') return;
    setNavigationBar(colorScheme).catch((error) => {
      console.error('useColorScheme.ts', 'useInitialColorScheme', error);
    });
  }, []);
};

export { useColorScheme, useInitialAndroidBarSync };

function setNavigationBar(colorScheme: 'light' | 'dark') {
  return Promise.all([
    NavigationBar.setButtonStyleAsync(colorScheme === 'dark' ? 'light' : 'dark'),
    NavigationBar.setPositionAsync('absolute'),
    NavigationBar.setBackgroundColorAsync(colorScheme === 'dark' ? '#00000030' : '#ffffff80'),
  ]);
}
