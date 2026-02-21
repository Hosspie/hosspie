import { useToastController, useToastState, Toast, ToastViewport } from '@tamagui/toast';
import React from 'react';

import { YStack } from '../../components/stacks';
import { Text } from '../../components/text';

export type ModeType = 'light' | 'dark' | 'system';

/**
 * Toast 뷰포트 컴포넌트 — 앱 루트에 배치해야 합니다.
 *
 * 사용법:
 * ```tsx
 * import { ToastProvider } from '@tamagui/toast'
 * import { ToastViewportComponent } from '@hosspie/design-system/hooks/toast'
 *
 * <ToastProvider>
 *   <App />
 *   <ToastViewportComponent />
 * </ToastProvider>
 * ```
 */
export function ToastViewportComponent() {
  return <ToastViewport top={60} left={0} right={0} />;
}

/**
 * 현재 활성화된 Toast를 렌더링하는 컴포넌트 — 앱 루트에 배치해야 합니다.
 */
export function CurrentToast() {
  const currentToast = useToastState();

  if (!currentToast || currentToast.isHandledNatively) return null;

  const isError = currentToast.customData?.type === 'error';

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      animation="fast"
      backgroundColor={isError ? '$error' : '$surfaceElevated'}
      borderWidth={isError ? 1 : 0}
      borderColor={isError ? '$error' : undefined}
      padding="$4"
      borderRadius="$3"
    >
      <YStack gap="$1">
        {currentToast.title && (
          <Toast.Title>
            <Text fontWeight="600" color="$textPrimary">
              {currentToast.title}
            </Text>
          </Toast.Title>
        )}
        {currentToast.message && (
          <Toast.Description>
            <Text fontSize="$1" color="$textSecondary">
              {currentToast.message}
            </Text>
          </Toast.Description>
        )}
      </YStack>
    </Toast>
  );
}

export const useToast = () => {
  const toast = useToastController();

  const showToast = ({
    type = 'default',
    message,
    title,
  }: {
    type?: 'default' | 'error';
    message: string;
    title?: string;
  }) => {
    toast.show(title ?? '', {
      message,
      duration: 3000,
      customData: { type },
    });
  };

  return {
    showToast,
  };
};
