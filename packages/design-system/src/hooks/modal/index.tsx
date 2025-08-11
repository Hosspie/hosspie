import { X } from 'lucide-react-native';
import { useMemo } from 'react';

import {
  ModalWrapper,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from './modal';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
} from '../../components/action-sheet';
import { Button, ButtonText } from '../../components/button';
import { Heading } from '../../components/header';
import { Icon } from '../../components/icon';
import { Text } from '../../components/text';

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
          <Actionsheet isOpen={isOpen} onClose={onClose}>
            <ActionsheetBackdrop />
            <ActionsheetContent>
              <ActionsheetDragIndicatorWrapper>
                <ActionsheetDragIndicator />
              </ActionsheetDragIndicatorWrapper>
              {children}
            </ActionsheetContent>
          </Actionsheet>
        );
      }

      const { isOpen, onClose, title, body, cancelButtonText, confirmButtonText } = props;
      return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} size="md">
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Heading size="md" className="text-typography-950">
                {title}
              </Heading>
              <ModalCloseButton>
                <Icon
                  as={X}
                  size="md"
                  className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
                />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Text size="sm" className="text-typography-500">
                {body}
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" action="secondary" onPress={onClose}>
                <ButtonText>{cancelButtonText}</ButtonText>
              </Button>
              <Button onPress={onClose}>
                <ButtonText>{confirmButtonText}</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalWrapper>
      );
    };
  }, []);

  return {
    Modal,
  };
};
