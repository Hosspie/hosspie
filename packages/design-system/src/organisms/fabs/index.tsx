import { ChevronDownIcon, ChevronUpIcon, type LucideIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, TouchableHighlight } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { Box } from '../../components/box';
import { Icon } from '../../components/icon';
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

  if (!isFoldable) {
    const hasOnlyOneFab = fabs.length === 1;
    const itemsAlignment = placement === 'right' ? 'items-end' : 'items-start';
    return (
      <Box className={`flex-1 ${itemsAlignment} justify-end gap-4 p-4`}>
        {fabs.map((fab, index) => {
          const hasOnlyIcon = !fab.label && fab.icon;
          const bgColor = hasOnlyOneFab ? 'bg-primary-500' : 'bg-secondary-500';
          const rounded = hasOnlyIcon ? 'rounded-full' : 'rounded-lg';
          return (
            <TouchableHighlight key={index} className={itemsAlignment} onPress={fab.onPress}>
              <Box
                className={`${bgColor} flex-row items-center justify-center gap-2 ${rounded} p-2`}
              >
                {fab.icon && <Icon size="xl" className="text-typography-500" as={fab.icon} />}
                {fab.label && <Text>{fab.label}</Text>}
              </Box>
            </TouchableHighlight>
          );
        })}
      </Box>
    );
  }

  const handlePressFoldButton = () => {
    setIsFolded(!isFolded);
  };

  const itemsAlignment = placement === 'right' ? 'items-end' : 'items-start';
  return (
    <Box className={`flex-1 ${itemsAlignment} justify-end gap-4 p-4`}>
      {!isFolded && (
        <Animated.View className="gap-4" entering={FadeInDown} exiting={FadeOutDown}>
          {fabs.map((fab, index) => {
            return (
              <TouchableHighlight key={index} onPress={fab.onPress}>
                <Box className="bg-secondary-500 flex-row items-center justify-center gap-2 rounded-lg p-2">
                  {fab.icon && <Icon size="xl" className="text-typography-500" as={fab.icon} />}
                  {fab.label && <Text>{fab.label}</Text>}
                </Box>
              </TouchableHighlight>
            );
          })}
        </Animated.View>
      )}
      <Pressable
        onPress={handlePressFoldButton}
        className="bg-primary-500 h-10 w-10 items-center justify-center rounded-full"
      >
        <Icon size="xl" color="white" as={isFolded ? ChevronUpIcon : ChevronDownIcon} />
      </Pressable>
    </Box>
  );
};

export { FabsOrganism };
