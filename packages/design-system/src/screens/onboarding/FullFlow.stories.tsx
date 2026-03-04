import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { MobileFrame } from '../../../.storybook/decorators/MobileFrame'
import { ProgressBar } from '../../organisms/progress-bar'
import { TextBlock } from '../../organisms/text-block'
import { FormField } from '../../organisms/form-field'
import { ButtonGroup } from '../../organisms/button-group'
import { CardList, type CardListItem } from '../../organisms/card-list'
import { Fab } from '../../organisms/fab'

type DinnerPartyValue = { type: string; description?: string }
type Room = {
  name: string
  capacity: number
  gender: string
  hasBathroom: boolean
}

const STEPS = ['설명', '연락처', '파티', '방'] as const
const STEP_PROGRESS = [25, 50, 75, 100]

const PlusIcon = () => (
  <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' }}>+</Text>
)

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

const FullFlowPage = () => {
  const [step, setStep] = useState(0)

  // Step 1: Description
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  // Step 2: Information
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')

  // Step 3: DinnerParty
  const [dinnerParty, setDinnerParty] = useState<DinnerPartyValue | undefined>(undefined)

  // Step 4: Rooms
  const [rooms, setRooms] = useState<Room[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Partial<Room>>({})

  const handleNext = () => setStep((s) => Math.min(s + 1, 3))
  const handleBack = () => setStep((s) => Math.max(s - 1, 0))

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={{ flex: 1, gap: 16 }}>
            <TextBlock
              title={`게스트하우스 정보를\n등록해 주세요`}
              description="기본적인 정보부터 시작해보겠습니다"
            />
            <FormField
              type="input"
              title="게스트하우스 이름"
              placeholder="예: 홍대 게스트하우스"
              value={name}
              onChange={setName}
              isRequired
            />
            <FormField
              type="textarea"
              title="게스트하우스에 대한 설명을 적어주세요"
              placeholder="ex. 안락한 소규모 게스트하우스입니다."
              value={description}
              onChange={setDescription}
              isRequired
            />
            <ButtonGroup
              placement="bottom"
              direction="vertical"
              buttons={[{ text: '다음 단계', onPress: handleNext, variant: 'primary' }]}
            />
          </View>
        )

      case 1:
        return (
          <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 8 }}>
              <TextBlock
                title={`연락처 정보를\n입력해 주세요`}
                description="고객들이 쉽게 연락할 수 있도록 정보를 입력해주세요"
              />
              <FormField
                type="input"
                title="주소"
                placeholder="예: 서울시 마포구 홍대입구역 2번 출구"
                value={address}
                onChange={setAddress}
                isRequired
              />
              <FormField
                type="input"
                title="연락처"
                placeholder="예: 02-1234-5678"
                value={phone}
                onChange={setPhone}
                isRequired
              />
              <FormField
                type="input"
                title="이메일"
                placeholder="예: contact@guesthouse.com"
                value={email}
                onChange={setEmail}
                isRequired
              />
              <FormField
                type="input"
                title="웹사이트 (선택사항)"
                placeholder="예: https://guesthouse.com"
                value={website}
                onChange={setWebsite}
              />
            </ScrollView>
            <ButtonGroup
              placement="bottom"
              direction="vertical"
              buttons={[
                { text: '이전', onPress: handleBack, variant: 'outline' },
                { text: '다음 단계', onPress: handleNext, variant: 'primary' },
              ]}
            />
          </View>
        )

      case 2:
        return (
          <View style={{ flex: 1, gap: 16 }}>
            <TextBlock
              title={`저녁 파티 방식을\n선택해 주세요`}
              description="게스트들과 함께하는 특별한 시간을 만들어보세요"
            />
            <FormField
              type="card"
              title="저녁 파티 방식을 선택해 주세요"
              value={dinnerParty}
              onChange={setDinnerParty}
              isRequired
              options={[
                {
                  value: { type: 'POT_LUCK' },
                  label: '포틀럭 파티',
                  description: '게스트들이 자유롭게 참여하는 파티',
                },
                {
                  value: { type: 'HOST_SERVED' },
                  label: '호스트 제공',
                  description: '호스트가 제공하는 식사',
                },
                {
                  value: { type: 'CUSTOM' },
                  label: '기타',
                  description: '직접 입력하여 커스텀 파티를 만들어보세요',
                  expandable: {
                    type: 'input' as const,
                    label: '펼치기',
                    placeholder: '예: 바비큐 파티, 와인 테이스팅 등',
                    value: dinnerParty?.description || '',
                    onChange: (desc: string) => {
                      setDinnerParty((prev) => (prev ? { ...prev, description: desc } : prev))
                    },
                  },
                },
              ]}
            />
            <ButtonGroup
              placement="bottom"
              direction="vertical"
              buttons={[
                { text: '이전', onPress: handleBack, variant: 'outline' },
                { text: '다음 단계', onPress: handleNext, variant: 'primary' },
              ]}
            />
          </View>
        )

      case 3: {
        const items: CardListItem[] = rooms.map((room) => ({
          title: room.name,
          description: `정원: ${room.capacity}명, 성별: ${genderLabel(room.gender)}, 욕실: ${room.hasBathroom ? '있음' : '없음'}`,
        }))

        const handleAddRoom = () => {
          if (
            !editingRoom.capacity ||
            !editingRoom.gender ||
            editingRoom.hasBathroom === undefined
          ) {
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
            <TextBlock
              title={`방 구성을\n등록해 주세요`}
              description="게스트들이 머물 방의 정보를 입력해주세요"
            />
            {rooms.length > 0 && <CardList items={items} />}
            <Fab
              isFoldable={false}
              placement="right"
              items={[{ icon: <PlusIcon />, onPress: () => setShowModal(true) }]}
            />
            <ButtonGroup
              placement="bottom"
              direction="vertical"
              buttons={[
                { text: '이전', onPress: handleBack, variant: 'outline' },
                { text: '온보딩 완료', onPress: () => {}, variant: 'primary' },
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
                  onChange={(v: boolean) =>
                    setEditingRoom((prev) => ({ ...prev, hasBathroom: v }))
                  }
                  isRequired
                  direction="horizontal"
                  options={[
                    { value: false, label: '없음' },
                    { value: true, label: '있음' },
                  ]}
                />
                <ButtonGroup
                  buttons={[
                    {
                      text: '추가',
                      onPress: handleAddRoom,
                      variant: 'primary',
                      disabled: isAddDisabled,
                    },
                  ]}
                />
              </View>
            )}
          </View>
        )
      }

      default:
        return null
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Step tabs */}
      <View
        style={{
          flexDirection: 'row',
          gap: 4,
          marginBottom: 12,
        }}
      >
        {STEPS.map((label, i) => (
          <Pressable
            key={label}
            onPress={() => setStep(i)}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: step === i ? '#FF6B35' : '#222',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 12, fontWeight: step === i ? '700' : '400' }}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ProgressBar
        value={STEP_PROGRESS[step]}
        max={100}
      />

      {renderStep()}
    </View>
  )
}

const meta: Meta = {
  title: 'Admin Screens/Onboarding/FullFlow',
  component: FullFlowPage,
  decorators: [MobileFrame],
}

export default meta
type Story = StoryObj

export const Default: Story = {}
