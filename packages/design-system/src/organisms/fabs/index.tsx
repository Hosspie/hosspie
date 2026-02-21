import { ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, TouchableHighlight } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { XStack, YStack } from '../../components/stacks';
import { Text } from '../../components/text';

interface FabProps {
  icon?: LucideIcon;
  label?: string;
  onPress: () => void;
}

interface FabsOrganismProps {
  isFoldable?: boolean;
  placement?: 'left' | 'right';
  fabs: FabProps[];
}

const FabsOrganism = ({ isFoldable = false, placement = 'right', fabs }: FabsOrganismProps) => {
  const [isFolded, setIsFolded] = useState<boolean>(true);
  const itemsAlignment = placement === 'right' ? 'flex-end' : 'flex-start';

  if (!isFoldable) {
    const hasOnlyOneFab = fabs.length === 1;

    return (
      <YStack flex={1} alignItems={itemsAlignment} justifyContent="flex-end" gap="$4" padding="$4">
        {fabs.map((fab, index) => {
          const hasOnlyIcon = !fab.label && fab.icon;
          const bgColor = hasOnlyOneFab ? '$brandPrimary' : '$surfaceElevated';
          const borderRadius = hasOnlyIcon ? 999 : '$3';
          const FabIcon = fab.icon;

          return (
            <TouchableHighlight key={index} onPress={fab.onPress}>
              <XStack
                backgroundColor={bgColor}
                alignItems="center"
                justifyContent="center"
                gap="$2"
                borderRadius={borderRadius}
                padding="$2"
              >
                {FabIcon && <FabIcon size={24} color="white" />}
                {fab.label && <Text color="$textPrimary">{fab.label}</Text>}
              </XStack>
            </TouchableHighlight>
          );
        })}
      </YStack>
    );
  }

  const handlePressFoldButton = () => {
    setIsFolded(!isFolded);
  };

  return (
    <YStack flex={1} alignItems={itemsAlignment} justifyContent="flex-end" gap="$4" padding="$4">
      {!isFolded && (
        <Animated.View style={{ gap: 16 }} entering={FadeInDown} exiting={FadeOutDown}>
          {fabs.map((fab, index) => {
            const FabIcon = fab.icon;
            return (
              <TouchableHighlight key={index} onPress={fab.onPress}>
                <XStack
                  backgroundColor="$surfaceElevated"
                  alignItems="center"
                  justifyContent="center"
                  gap="$2"
                  borderRadius="$3"
                  padding="$2"
                >
                  {FabIcon && <FabIcon size={24} color="white" />}
                  {fab.label && <Text color="$textPrimary">{fab.label}</Text>}
                </XStack>
              </TouchableHighlight>
            );
          })}
        </Animated.View>
      )}
      <Pressable
        onPress={handlePressFoldButton}
        style={{
          backgroundColor: '#FF8A3D',
          height: 40,
          width: 40,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
        }}
      >
        {isFolded ? (
          <ChevronUp size={24} color="white" />
        ) : (
          <ChevronDown size={24} color="white" />
        )}
      </Pressable>
    </YStack>
  );
};

export { FabsOrganism };
