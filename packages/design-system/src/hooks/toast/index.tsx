import { createToastHook } from '@gluestack-ui/toast';
import React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';
import { Motion, AnimatePresence, MotionComponentProps } from '@legendapp/motion';

import { HStack } from '../../components/h-stack';
import { CloseIcon, HelpCircleIcon, Icon } from '../../components/icon';
import { VStack } from '../../components/v-stack';
import { Toast, ToastTitle, ToastDescription } from './toast';

export type ModeType = 'light' | 'dark' | 'system';

type IMotionViewProps = React.ComponentProps<typeof View> &
  MotionComponentProps<typeof View, ViewStyle, unknown, unknown, unknown>;

const MotionView = Motion.View as React.ComponentType<IMotionViewProps>;

export const useToast = () => {
  const toast = createToastHook(MotionView, AnimatePresence)();

  const showToast = ({
    type = 'default',
    message,
    title,
  }: {
    type?: 'default' | 'error';
    message: string;
    title?: string;
  }) => {
    const newId = Math.random().toString();

    toast.show({
      id: newId,
      placement: 'top',
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = 'toast-' + id;
        if (type === 'default') {
          return (
            <Toast nativeID={uniqueToastId} action="muted" variant="solid">
              <ToastTitle>{title}</ToastTitle>
              <ToastDescription>{message}</ToastDescription>
            </Toast>
          );
        }
        if (type === 'error') {
          return (
            <Toast
              action="error"
              variant="outline"
              nativeID={uniqueToastId}
              className="bg-background-950 border-error-500 shadow-hard-5 w-full max-w-[443px] flex-row justify-between gap-6 p-4"
            >
              <HStack space="md">
                <Icon as={HelpCircleIcon} className="text-error-500" />
                <VStack space="xs">
                  <ToastTitle className="text-error-500 font-semibold">{title}</ToastTitle>
                  <ToastDescription className="text-typography-50" size="sm">
                    {message}
                  </ToastDescription>
                </VStack>
              </HStack>
              <HStack className="gap-1 min-[450px]:gap-3">
                <Pressable onPress={() => toast.close(id)}>
                  <Icon className="text-typography-50" as={CloseIcon} />
                </Pressable>
              </HStack>
            </Toast>
          );
        }
      },
    });
  };

  return {
    showToast,
  };
};
