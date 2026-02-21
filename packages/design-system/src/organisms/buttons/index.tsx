import { type LucideIcon } from 'lucide-react-native';
import { type ComponentType } from 'react';

import { Button } from '../../components/button';
import { XStack, YStack } from '../../components/stacks';

export interface IButtonProps {
  text: string;
  iconPosition?: 'left' | 'right';
  icon?: LucideIcon | ComponentType;
  backgroundColor?: string;
  textColor?: string;
  action?: string;
  disabled?: boolean;
  onPress?: () => void;
}

interface ButtonsProps {
  direction?: 'horizontal' | 'vertical';
  buttons: IButtonProps[];
  placement?: 'default' | 'bottom';
}

const Buttons = ({ direction = 'vertical', buttons, placement = 'default' }: ButtonsProps) => {
  const Stack = direction === 'horizontal' ? XStack : YStack;
  const marginTop = placement === 'bottom' ? 'auto' : undefined;

  return (
    <Stack
      gap="$4"
      padding="$3"
      {...(marginTop ? { marginTop } : {})}
    >
      {buttons.map(
        (
          {
            text,
            icon,
            backgroundColor,
            textColor,
            iconPosition = 'right',
            disabled,
            onPress,
            action,
            ...props
          },
          index
        ) => {
          const iconProps =
            iconPosition === 'left'
              ? { icon: icon as any }
              : { iconAfter: icon as any };

          return (
            <Button
              key={index}
              disabled={disabled}
              onPress={onPress}
              {...(icon ? iconProps : {})}
              {...(backgroundColor ? { backgroundColor } : {})}
              {...(textColor ? { color: textColor } : {})}
              {...(direction === 'horizontal' ? { flex: 1 } : {})}
              {...(disabled ? { opacity: 0.5 } : {})}
            >
              {text}
            </Button>
          );
        }
      )}
    </Stack>
  );
};

export { Buttons };
