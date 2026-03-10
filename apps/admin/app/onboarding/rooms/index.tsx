import { Sheet } from '@hosspie/design-system/components/sheet';
import {
  type ButtonGroupItemProps,
  ButtonGroup,
} from '@hosspie/design-system/organisms/button-group';
import { CardList, type CardListItem } from '@hosspie/design-system/organisms/card-list';
import { Fab } from '@hosspie/design-system/organisms/fab';
import { FormField } from '@hosspie/design-system/organisms/form-field';
import { ScrollArea } from '@hosspie/design-system/organisms/scroll-area';
import { TextBlock } from '@hosspie/design-system/organisms/text-block';
import { Field, useForm } from '@hosspie/services/form';
import { Gender, type CreateRoomInput } from '@hosspie/types';
import { router } from 'expo-router';
import { PlusIcon } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Alert } from 'react-native';

import { IOnboardingFormData } from '../_layout';

import { useCreateOnboardingMutation } from '@/lib/graphql/operations/createOnboarding.generated';

export default function OnboardingRoomsScreen() {
  const { handleSubmit } = useForm<IOnboardingFormData>();
  const [createOnboarding, { loading: submitting }] = useCreateOnboardingMutation();

  const [showModal, setShowModal] = useState(false);
  const [roomList, setRoomList] = useState<CreateRoomInput[]>([]);
  const [editingRoom, setEditingRoom] = useState<Partial<CreateRoomInput>>();
  const hasRegisteredRoom = roomList.length > 0;

  const editingRoomIndexRef = useRef<number>(0);

  const handlePressAddButton = () => {
    setShowModal(true);
  };

  const handlePressNext = handleSubmit(
    async (data) => {
      try {
        const rooms = Object.values(data.rooms || {});
        await createOnboarding({
          variables: {
            input: {
              name: data.name,
              description: data.description,
              address: data.address,
              phone: data.phone,
              email: data.email,
              website: data.website,
              dinnerPartyType: data.dinnerParty.type,
              dinnerPartyDescription: data.dinnerParty.description,
              rooms,
            },
          },
        });
        router.replace('/(authenticated)/(tabs)');
      } catch (error) {
        Alert.alert('오류', '온보딩을 완료할 수 없습니다.');
        console.error(error);
      }
    },
    () => {
      // 유효성 검사 실패 시 폼이 에러 표시 처리
    }
  );

  const handlePressBack = () => {
    router.back();
  };

  const buttons: ButtonGroupItemProps[] = [
    {
      text: '이전',
      onPress: handlePressBack,
      variant: 'outline',
    },
    {
      text: submitting ? '저장 중...' : '온보딩 완료',
      onPress: handlePressNext,
      variant: 'primary',
      disabled: submitting,
    },
  ];

  const genderLabel = (gender: Gender): string => {
    switch (gender) {
      case Gender.REGARDLESS:
        return '무관';
      case Gender.MALE:
        return '남성';
      case Gender.FEMALE:
        return '여성';
      default:
        return '';
    }
  };

  const items: CardListItem[] = roomList.map((room) => ({
    title: room.name,
    description: `정원: ${room.capacity}명, 성별: ${genderLabel(room.gender as Gender)}, 욕실: ${room.hasBathroom ? '있음' : '없음'}`,
  }));

  return (
    <ScrollArea>
      <TextBlock
        title={`방 구성을\n등록해 주세요`}
        description="게스트들이 머물 방의 정보를 입력해주세요"
      />
      {hasRegisteredRoom && <CardList items={items} />}
      <Fab
        isFoldable={false}
        placement="right"
        items={[
          {
            icon: <PlusIcon color="#FFFFFF" size={24} />,
            onPress: handlePressAddButton,
          },
        ]}
      />
      <ButtonGroup direction="vertical" buttons={buttons} placement="bottom" />

      {/* 방 추가 모달 - Field 컴포넌트 사용 */}
      <Field<IOnboardingFormData, 'rooms'>
        name="rooms"
        render={({ field: { onChange, value = {} } }) => {
          const handlePressField = (
            key: keyof CreateRoomInput,
            selectedValue: CreateRoomInput[typeof key]
          ) => {
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

            const newRoom: CreateRoomInput = {
              capacity: editingRoom.capacity as number,
              gender: editingRoom.gender as Gender,
              hasBathroom: editingRoom.hasBathroom as boolean,
              name: editingRoom.name ?? `${editingRoom.capacity}인실`,
            };
            onChange({ ...value, [editingRoomIndexRef.current]: newRoom });
            setRoomList((prev) => [...prev, newRoom]);
            editingRoomIndexRef.current += 1;
            handleClose();
          };

          const isEditFieldsNotEnough =
            !editingRoom ||
            !editingRoom.capacity ||
            !editingRoom.gender ||
            editingRoom.hasBathroom === undefined;
          const modalButtons: ButtonGroupItemProps[] = [
            {
              text: '추가',
              onPress: handlePressConfirmAddButton,
              disabled: isEditFieldsNotEnough,
              variant: 'primary',
            },
          ];

          return (
            <Sheet visible={showModal} onClose={handleClose}>
              <Sheet.Content>
                <FormField
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

                <FormField
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
                    { value: Gender.REGARDLESS, label: '무관' },
                    { value: Gender.MALE, label: '남성' },
                    { value: Gender.FEMALE, label: '여성' },
                  ]}
                />

                <FormField
                  type="input"
                  title="방 이름 (선택사항)"
                  placeholder="예: 커플룸, VIP룸 등"
                  value={editingRoom?.name}
                  onChange={(roomName) => handlePressField('name', roomName)}
                  isRequired={false}
                />

                <FormField
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
                <ButtonGroup buttons={modalButtons} />
              </Sheet.Content>
            </Sheet>
          );
        }}
      />
    </ScrollArea>
  );
}
