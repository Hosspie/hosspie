import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { View } from 'react-native'
import { MobileFrame } from '../../../.storybook/decorators/MobileFrame'
import { ProgressBar } from '../../organisms/progress-bar'
import { TextBlock } from '../../organisms/text-block'
import { FormField } from '../../organisms/form-field'
import { ButtonGroup } from '../../organisms/button-group'

type DinnerPartyValue = { type: string; description?: string }

const DinnerPartyPage = () => {
  const [value, setValue] = useState<DinnerPartyValue | undefined>(undefined)

  return (
    <View style={{ flex: 1, gap: 16 }}>
      <ProgressBar value={75} max={100} />

      <TextBlock
        title={`저녁 파티 방식을\n선택해 주세요`}
        description="게스트들과 함께하는 특별한 시간을 만들어보세요"
      />

      <FormField
        type="card"
        title="저녁 파티 방식을 선택해 주세요"
        value={value}
        onChange={setValue}
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
              value: value?.description || '',
              onChange: (description: string) => {
                setValue((prev) => (prev ? { ...prev, description } : prev))
              },
            },
          },
        ]}
      />

      <ButtonGroup
        placement="bottom"
        direction="vertical"
        buttons={[
          { text: '이전', onPress: fn(), variant: 'outline' },
          { text: '다음 단계', onPress: fn(), variant: 'primary' },
        ]}
      />
    </View>
  )
}

const meta: Meta = {
  title: 'Admin Screens/Onboarding/DinnerParty',
  component: DinnerPartyPage,
  decorators: [MobileFrame],
}

export default meta
type Story = StoryObj

export const Default: Story = {}

export const WithSelection: Story = {
  render: () => {
    const SelectedPage = () => {
      const [value, setValue] = useState<DinnerPartyValue>({ type: 'POT_LUCK' })

      return (
        <View style={{ flex: 1, gap: 16 }}>
          <ProgressBar value={75} max={100} />

          <TextBlock
            title={`저녁 파티 방식을\n선택해 주세요`}
            description="게스트들과 함께하는 특별한 시간을 만들어보세요"
          />

          <FormField
            type="card"
            title="저녁 파티 방식을 선택해 주세요"
            value={value}
            onChange={setValue}
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
                  value: value?.description || '',
                  onChange: (description: string) => {
                    setValue((prev) => ({ ...prev, description }))
                  },
                },
              },
            ]}
          />

          <ButtonGroup
            placement="bottom"
            direction="vertical"
            buttons={[
              { text: '이전', onPress: fn(), variant: 'outline' },
              { text: '다음 단계', onPress: fn(), variant: 'primary' },
            ]}
          />
        </View>
      )
    }
    return <SelectedPage />
  },
}
