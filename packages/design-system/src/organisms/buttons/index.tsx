import { type LucideIcon } from 'lucide-react-native';
import { ComponentProps, type ComponentType } from 'react';

import { Button, ButtonGroup, ButtonIcon, ButtonText } from '../../components/button';
import { HStack } from '../../components/h-stack';
import { VStack } from '../../components/v-stack';

export interface IButtonProps extends Omit<ComponentProps<typeof Button>, 'className'> {
  text: string;
  iconPosition?: 'left' | 'right';
  icon?: LucideIcon | ComponentType;
  backgroundColor?: string;
  textColor?: string;
}

interface ButtonsProps {
  direction?: 'horizontal' | 'vertical';
  buttons: IButtonProps[];
  placement?: 'default' | 'bottom';
}

const Buttons = ({ direction = 'vertical', buttons, placement = 'default' }: ButtonsProps) => {
  const itemsAlignment = placement === 'bottom' ? 'mt-auto p-3' : 'p-3';

  if (direction === 'horizontal') {
    return (
      <HStack space="md" className={`${itemsAlignment}`}>
        {buttons.map(
          (
            {
              text,
              icon,
              backgroundColor,
              textColor,
              action,
              iconPosition = 'right',
              disabled,
              ...props
            },
            index
          ) => {
            const iconAlignment = iconPosition === 'right' ? 'flex-row' : 'flex-row-reverse';

            return (
              <ButtonGroup className="flex-1" isDisabled={disabled} key={index}>
                <Button
                  style={
                    backgroundColor && {
                      backgroundColor: backgroundColor && backgroundColor,
                    }
                  }
                  className={`${iconAlignment}`}
                  action={disabled ? 'secondary' : action}
                  {...props}
                >
                  <ButtonText style={textColor && { color: textColor }}>{text}</ButtonText>
                  {icon && <ButtonIcon as={icon} />}
                </Button>
              </ButtonGroup>
            );
          }
        )}
      </HStack>
    );
  }

  return (
    <VStack space="md" className={`${itemsAlignment}`}>
      {buttons.map(
        (
          {
            text,
            icon,
            backgroundColor,
            textColor,
            action,
            iconPosition = 'right',
            disabled,
            ...props
          },
          index
        ) => {
          const iconAlignment = iconPosition === 'right' ? 'flex-row' : 'flex-row-reverse';

          return (
            <ButtonGroup key={index} isDisabled={disabled}>
              <Button
                style={
                  backgroundColor && {
                    backgroundColor: backgroundColor && backgroundColor,
                  }
                }
                className={`${iconAlignment}`}
                action={disabled ? 'secondary' : action}
                {...props}
              >
                <ButtonText style={textColor && { color: textColor }}>{text}</ButtonText>
                {icon && <ButtonIcon as={icon} />}
              </Button>
            </ButtonGroup>
          );
        }
      )}
    </VStack>
  );
};

export { Buttons };
