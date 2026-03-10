import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { View, Text } from 'react-native'
import { MobileFrame } from '../../../.storybook/decorators/MobileFrame'
import { ProgressBar } from '../../organisms/progress-bar'
import { TextBlock } from '../../organisms/text-block'
import { CardList, type CardListItem } from '../../organisms/card-list'
import { Fab } from '../../organisms/fab'
import { FormField } from '../../organisms/form-field'
import { ButtonGroup } from '../../organisms/button-group'

const PlusIcon = () => (
  <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' }}>+</Text>
)

type Room = {
  name: string
  capacity: number
  gender: string
  hasBathroom: boolean
}

const genderLabel = (gender: string): string => {
  switch (gender) {
    case 'REGARDLESS':
      return '무관'
    case 'MALE':
      return '남성'
    case 'FEMALE':
      return '여성'
    default:
      return ''
  }
}

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Partial<Room>>({})

  const items: CardListItem[] = rooms.map((room) => ({
    title: room.name,
    description: `정원: ${room.capacity}명, 성별: ${genderLabel(room.gender)}, 욕실: ${room.hasBathroom ? '있음' : '없음'}`,
  }))

  const handleAddRoom = () => {
    if (!editingRoom.capacity || !editingRoom.gender || editingRoom.hasBathroom === undefined) {
      return
    }
    const newRoom: Room = {
      name: editingRoom.name || `${editingRoom.capacity}인실`,
      capacity: editingRoom.capacity,
      gender: editingRoom.gender,
      hasBathroom: editingRoom.hasBathroom,
    }
    setRooms((prev) => [...prev, newRoom])
    setEditingRoom({})
    setShowModal(false)
  }

  const isAddDisabled =
    !editingRoom.capacity || !editingRoom.gender || editingRoom.hasBathroom === undefined

  return (
    <View style={{ flex: 1, gap: 16 }}>
      <ProgressBar value={100} max={100} />

      <TextBlock
        title={`방 구성을\n등록해 주세요`}
        description="게스트들이 머물 방의 정보를 입력해주세요"
      />

      {rooms.length > 0 && <CardList items={items} />}

      <Fab
        isFoldable={false}
        placement="right"
        items={[
          {
            icon: <PlusIcon />,
            onPress: () => setShowModal(true),
          },
        ]}
      />

      <ButtonGroup
        placement="bottom"
        direction="vertical"
        buttons={[
          { text: '이전', onPress: fn(), variant: 'outline' },
          { text: '온보딩 완료', onPress: fn(), variant: 'primary' },
        ]}
      />

      {showModal && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#1A1A1A',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 24,
            gap: 16,
          }}
        >
          <FormField
            type="radio"
            title="인원"
            value={editingRoom.capacity}
            onChange={(v: number) => setEditingRoom((prev) => ({ ...prev, capacity: v }))}
            isRequired
            direction="vertical"
            options={[
              { value: 1, label: '1명' },
              { value: 2, label: '2명' },
              { value: 3, label: '3명' },
              { value: 4, label: '4명' },
            ]}
          />

          <FormField
            type="radio"
            title="성별"
            value={editingRoom.gender}
            onChange={(v: string) => setEditingRoom((prev) => ({ ...prev, gender: v }))}
            isRequired
            direction="horizontal"
            options={[
              { value: 'REGARDLESS', label: '무관' },
              { value: 'MALE', label: '남성' },
              { value: 'FEMALE', label: '여성' },
            ]}
          />

          <FormField
            type="input"
            title="방 이름 (선택사항)"
            placeholder="예: 커플룸, VIP룸 등"
            value={editingRoom.name || ''}
            onChange={(v: string) => setEditingRoom((prev) => ({ ...prev, name: v }))}
          />

          <FormField
            type="radio"
            title="내부 욕실"
            value={editingRoom.hasBathroom}
            onChange={(v: boolean) => setEditingRoom((prev) => ({ ...prev, hasBathroom: v }))}
            isRequired
            direction="horizontal"
            options={[
              { value: false, label: '없음' },
              { value: true, label: '있음' },
            ]}
          />

          <ButtonGroup
            buttons={[
              { text: '추가', onPress: handleAddRoom, variant: 'primary', disabled: isAddDisabled },
            ]}
          />
        </View>
      )}
    </View>
  )
}

const meta: Meta = {
  title: 'Admin Screens/Onboarding/Rooms',
  component: RoomsPage,
  decorators: [MobileFrame],
}

export default meta
type Story = StoryObj

export const Default: Story = {}

export const WithRooms: Story = {
  render: () => {
    const WithRoomsPage = () => {
      const prefilledRooms: Room[] = [
        { name: '4인실', capacity: 4, gender: 'REGARDLESS', hasBathroom: true },
        { name: '커플룸', capacity: 2, gender: 'REGARDLESS', hasBathroom: true },
        { name: '여성 전용 3인실', capacity: 3, gender: 'FEMALE', hasBathroom: false },
      ]

      const items: CardListItem[] = prefilledRooms.map((room) => ({
        title: room.name,
        description: `정원: ${room.capacity}명, 성별: ${genderLabel(room.gender)}, 욕실: ${room.hasBathroom ? '있음' : '없음'}`,
      }))

      return (
        <View style={{ flex: 1, gap: 16 }}>
          <ProgressBar value={100} max={100} />

          <TextBlock
            title={`방 구성을\n등록해 주세요`}
            description="게스트들이 머물 방의 정보를 입력해주세요"
          />

          <CardList items={items} />

          <Fab
            isFoldable={false}
            placement="right"
            items={[
              {
                icon: <PlusIcon />,
                onPress: fn(),
              },
            ]}
          />

          <ButtonGroup
            placement="bottom"
            direction="vertical"
            buttons={[
              { text: '이전', onPress: fn(), variant: 'outline' },
              { text: '온보딩 완료', onPress: fn(), variant: 'primary' },
            ]}
          />
        </View>
      )
    }
    return <WithRoomsPage />
  },
}
