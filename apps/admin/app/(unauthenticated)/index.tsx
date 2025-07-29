import { useModal } from '@hosspie/ui/hooks/modal';
import { useToast } from '@hosspie/ui/hooks/toast';
import { useState } from 'react';
import { Button, ScrollView, Text } from 'react-native';

export default function UnauthenticatedScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const { showToast } = useToast();
  const { Modal } = useModal();

  return (
    <ScrollView style={{ flex: 1 }}>
      <Button title="show modal" onPress={() => setIsModalOpen(true)} />
      <Button title="show botto m sheet" onPress={() => setIsBottomSheetOpen(true)} />
      <Button
        title="show toast"
        onPress={() => showToast({ message: 'Error!', title: 'title!' })}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          showToast({ message: 'Error!', title: 'title!' });
        }}
        title="title"
        body="body"
        cancelButtonText="Cancel"
        confirmButtonText="Confirm"
      />
      <Modal
        type="bottomSheet"
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
      >
        <Text>Hello</Text>
      </Modal>
    </ScrollView>
  );
}
