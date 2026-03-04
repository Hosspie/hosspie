import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';

interface SafeAreaProviderProps {
  children: React.ReactNode;
  edges?: Edge[];
}

export const SafeAreaProvider = ({
  children,
  edges = ['top', 'bottom'],
}: SafeAreaProviderProps) => {
  const insets = useSafeAreaInsets();

  console.log('🔴 [SafeAreaProvider] RENDERING!');
  console.log('🔴 [SafeAreaProvider] insets:', insets);
  console.log('🔴 [SafeAreaProvider] edges:', edges);

  const getPadding = () => {
    const style: Record<string, number> = {};

    if (edges.includes('top')) {
      style.paddingTop = insets.top;
    }
    if (edges.includes('bottom')) {
      style.paddingBottom = insets.bottom;
    }
    if (edges.includes('left')) {
      style.paddingLeft = insets.left;
    }
    if (edges.includes('right')) {
      style.paddingRight = insets.right;
    }

    return style;
  };

  const paddings = getPadding();

  console.log('🔴 [SafeAreaProvider] paddings:', paddings);

  return <View style={[{ flex: 1, backgroundColor: '#FF6B00' }, paddings]}>{children}</View>;
};
