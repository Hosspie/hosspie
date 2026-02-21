import { X } from 'lucide-react-native';
import React, { useMemo } from 'react';

import { Button } from '../../components/button';
import { Dialog } from '../../components/dialog';
import { Sheet } from '../../components/sheet';
import { XStack, YStack } from '../../components/stacks';
import { H3, Text } from '../../components/text';

type IModalProps =
  | {
      type?: 'dialog';
      isOpen: boolean;
      onClose: () => void;
      title: string;
      body: string;
      cancelButtonText: string;
      confirmButtonText: string;
    }
  | {
      type?: 'bottomSheet';
      isOpen: boolean;
      onClose: () => void;
      children: React.ReactNode;
    };

export const useModal = () => {
  const Modal = useMemo(() => {
    return (props: IModalProps) => {
      if (props.type === 'bottomSheet') {
        const { children, isOpen, onClose } = props;
        return (
          <Sheet
            open={isOpen}
            onOpenChange={(open: boolean) => {
              if (!open) onClose();
            }}
            modal
            snapPointsMode="percent"
            snapPoints={[85]}
            dismissOnSnapToBottom
            zIndex={100000}
            animation="medium"
          >
            <Sheet.Overlay
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
            <Sheet.Frame padding="$4">
              <Sheet.Handle />
              <YStack width="100%">{children}</YStack>
            </Sheet.Frame>
          </Sheet>
        );
      }

      const { isOpen, onClose, title, body, cancelButtonText, confirmButtonText } = props;
      return (
        <Dialog
          open={isOpen}
          onOpenChange={(open: boolean) => {
            if (!open) onClose();
          }}
        >
          <Dialog.Portal>
            <Dialog.Overlay
              key="overlay"
              animation="fast"
              opacity={0.5}
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
            <Dialog.Content
              key="content"
              bordered
              elevate
              animation={[
                'fast',
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]}
              enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
              exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
              gap="$4"
              padding="$6"
            >
              <XStack justifyContent="space-between" alignItems="center">
                <Dialog.Title>
                  <H3>{title}</H3>
                </Dialog.Title>
                <Dialog.Close asChild>
                  <Button
                    size="$3"
                    circular
                    icon={X}
                    chromeless
                  />
                </Dialog.Close>
              </XStack>

              <Dialog.Description>
                <Text color="$textSecondary" fontSize="$1">
                  {body}
                </Text>
              </Dialog.Description>

              <XStack gap="$3" justifyContent="flex-end">
                <Dialog.Close displayWhenAdapted asChild>
                  <Button variant="outlined" onPress={onClose}>
                    {cancelButtonText}
                  </Button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <Button onPress={onClose}>
                    {confirmButtonText}
                  </Button>
                </Dialog.Close>
              </XStack>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>
      );
    };
  }, []);

  return {
    Modal,
  };
};
