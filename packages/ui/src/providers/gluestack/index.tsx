import { OverlayProvider } from '@gluestack-ui/overlay';
import { ToastProvider } from '@gluestack-ui/toast';
import { config } from '@hosspie/ui-config/tokens/color';
import { useColorScheme } from 'nativewind';
import React, { useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export type ModeType = 'light' | 'dark' | 'system';

export function GluestackProvider({
  mode = 'light',
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(mode);
  }, [mode]);

  return (
    <View style={[config[colorScheme!], { flex: 1, height: '100%', width: '100%' }, props.style]}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <OverlayProvider>
          <ToastProvider>{props.children}</ToastProvider>
        </OverlayProvider>
      </GestureHandlerRootView>
    </View>
  );
}
