import React from 'react';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';

import { Box } from '../../components/box';

interface SafeAreaViewProps {
  children: React.ReactNode;
  edges?: Edge[];
}

const BackgroundLayout = ({ children, edges = ['top', 'bottom'] }: SafeAreaViewProps) => {
  const insets = useSafeAreaInsets();

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

  return (
    <Box style={paddings} className="flex-1">
      {children}
    </Box>
  );
};

export { BackgroundLayout };
