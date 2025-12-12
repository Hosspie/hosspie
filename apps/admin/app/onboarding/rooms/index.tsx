import { Box } from '@hosspie/design-system/components/box';
import { useModal } from '@hosspie/design-system/hooks/modal';
import { type IButtonProps, Buttons } from '@hosspie/design-system/organisms/buttons';
import { CardOption, CardsOrganism } from '@hosspie/design-system/organisms/cards';
import { FabsOrganism } from '@hosspie/design-system/organisms/fabs';
import { FormFieldOrganism } from '@hosspie/design-system/organisms/form-field';
import { TextContainer } from '@hosspie/design-system/organisms/text-container';
import { Field, useForm } from '@hosspie/services/form';
import { type IGender, IRoom } from '@hosspie/utils/types';
import { router } from 'expo-router';
import { PlusIcon } from 'lucide-react-native';
import React, { useRef, useState } from 'react';

import { IOnboardingFormData } from '../_layout';

export default function OnboardingRoomsScreen() {
  console.log('OnboardingRoomsScreen');

  const { handleSubmit } = useForm<IOnboardingFormData>();
  const { Modal } = useModal();

  const [showModal, setShowModal] = useState(false);
  const [roomList, setRoomList] = useState<IRoom[]>([]);
  const [editingRoom, setEditingRoom] = useState<Partial<IRoom>>();
  const hasRegisteredRoom = roomList.length > 0;

  const editingRoomIndexRef = useRef<number>(0);

  const handlePressAddButton = () => {
    setShowModal(true);
  };

  const handlePressNext = handleSubmit(
    (data) => {
      console.log('Form data:', data);
      router.push('/(authenticated)/(tabs)');
    },
    (errors) => {
      console.log('error', errors);
    }
  );

  const handlePressBack = () => {
    router.back();
  };

  const buttons: IButtonProps[] = [
    {
      text: '이전',
      onPress: handlePressBack,
      variant: 'outline',
      action: 'secondary',
    },
    {
      text: '온보딩 완료',
      onPress: handlePressNext,
      variant: 'solid',
      action: 'primary',
    },
  ];

  const options: CardOption[] = roomList.map((room) => ({
    title: room.name,
    description: `정원: ${room.capacity}명, 성별: ${room.gender === 'regardless' ? '무관' : room.gender === 'male' ? '남성' : '여성'}, 욕실: ${room.hasBathroom === 0 ? '없음' : '있음'}`,
  }));

  return (
    <Box className="flex-1">
      <TextContainer
        title={`방 구성을\n등록해 주세요`}
        description="게스트들이 머물 방의 정보를 입력해주세요"
      />
      {hasRegisteredRoom && <CardsOrganism options={options} />}
      <FabsOrganism
        isFoldable={false}
        placement="right"
        fabs={[
          {
            icon: PlusIcon,
            onPress: handlePressAddButton,
          },
        ]}
      />
      <Buttons direction="vertical" buttons={buttons} placement="bottom" />

      {/* 방 추가 모달 - Field 컴포넌트 사용 */}
      <Field<IOnboardingFormData, 'rooms'>
        name="rooms"
        render={({ field: { onChange, value = {} } }) => {
          const handlePressField = (key: keyof IRoom, selectedValue: IRoom[typeof key]) => {
            setEditingRoom((prev) => {
              if (!prev) {
                return { [key]: selectedValue };
              }
              return { ...prev, [key]: selectedValue };
            });
          };

          const handleClose = () => {
            setEditingRoom(undefined);
            setShowModal(false);
          };

          const handlePressConfirmAddButton = () => {
            if (!editingRoom) {
              return;
            }

            const newRoom: IRoom = {
              capacity: editingRoom.capacity as number,
              gender: editingRoom.gender as IGender,
              hasBathroom: editingRoom.hasBathroom as boolean,
              name: editingRoom.name ?? `${editingRoom.capacity}인실`,
            };
            onChange({ ...value, [editingRoomIndexRef.current]: newRoom });
            setRoomList((prev) => [...prev, newRoom]);
            handleClose();
          };

          const isEditFieldsNotEnough =
            !editingRoom ||
            !editingRoom.capacity ||
            !editingRoom.gender ||
            editingRoom.hasBathroom === undefined;
          const modalButtons: IButtonProps[] = [
            {
              text: '추가',
              onPress: handlePressConfirmAddButton,
              disabled: isEditFieldsNotEnough,
              variant: 'solid',
              action: 'primary',
            },
          ];

          return (
            <Modal type="bottomSheet" isOpen={showModal} onClose={handleClose}>
              <Box className="p-3">
                <FormFieldOrganism
                  type="radio"
                  title="인원"
                  value={editingRoom?.capacity}
                  onChange={(capacity) => {
                    const isCapacityEmpty = !capacity;
                    if (isCapacityEmpty) {
                      return;
                    }
                    handlePressField('capacity', capacity);
                  }}
                  isRequired={true}
                  direction="vertical"
                  options={[
                    ...[1, 2, 3, 4].map((num) => ({
                      value: num,
                      label: `${num}명`,
                    })),
                  ]}
                />

                <FormFieldOrganism
                  type="radio"
                  title="성별"
                  value={editingRoom?.gender}
                  onChange={(gender) => {
                    const isGenderEmpty = !gender;
                    if (isGenderEmpty) {
                      return;
                    }
                    handlePressField('gender', gender);
                  }}
                  isRequired={true}
                  direction="horizontal"
                  options={[
                    { value: 'regardless', label: '무관' },
                    { value: 'male', label: '남성' },
                    { value: 'female', label: '여성' },
                  ]}
                />

                <FormFieldOrganism
                  type="input"
                  title="방 이름 (선택사항)"
                  placeholder="예: 커플룸, VIP룸 등"
                  value={editingRoom?.name}
                  onChange={(roomName) => handlePressField('name', roomName)}
                  isRequired={false}
                />

                <FormFieldOrganism
                  type="radio"
                  title="내부 욕실"
                  value={editingRoom?.hasBathroom}
                  onChange={(hasBathroom) => {
                    const isNumberOfBathroomsEmpty = hasBathroom === undefined;
                    if (isNumberOfBathroomsEmpty) {
                      return;
                    }
                    handlePressField('hasBathroom', hasBathroom);
                  }}
                  isRequired={true}
                  direction="horizontal"
                  options={[
                    { value: false, label: '없음' },
                    { value: true, label: '있음' },
                  ]}
                />
                <Buttons buttons={modalButtons} />
              </Box>
            </Modal>
          );
        }}
      />
    </Box>
  );
}
