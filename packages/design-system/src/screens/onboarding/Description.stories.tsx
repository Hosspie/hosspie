import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { View } from 'react-native'
import { MobileFrame } from '../../../.storybook/decorators/MobileFrame'
import { ProgressBar } from '../../organisms/progress-bar'
import { TextBlock } from '../../organisms/text-block'
import { FormField } from '../../organisms/form-field'
import { ButtonGroup } from '../../organisms/button-group'

const DescriptionPage = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  return (
    <View style={{ flex: 1, gap: 16 }}>
      <ProgressBar value={25} max={100} />

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
        buttons={[{ text: '다음 단계', onPress: fn(), variant: 'primary' }]}
      />
    </View>
  )
}

const meta: Meta = {
  title: 'Admin Screens/Onboarding/Description',
  component: DescriptionPage,
  decorators: [MobileFrame],
}

export default meta
type Story = StoryObj

export const Default: Story = {}

export const WithFilledData: Story = {
  render: () => {
    const FilledPage = () => {
      const [name, setName] = useState('홍대 게스트하우스')
      const [description, setDescription] = useState(
        '홍대입구역 2번 출구 도보 5분 거리에 위치한 아늑한 게스트하우스입니다.'
      )

      return (
        <View style={{ flex: 1, gap: 16 }}>
          <ProgressBar value={25} max={100} />

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
            buttons={[{ text: '다음 단계', onPress: fn(), variant: 'primary' }]}
          />
        </View>
      )
    }
    return <FilledPage />
  },
}

export const WithError: Story = {
  render: () => (
    <View style={{ flex: 1, gap: 16 }}>
      <ProgressBar value={25} max={100} />

      <TextBlock
        title={`게스트하우스 정보를\n등록해 주세요`}
        description="기본적인 정보부터 시작해보겠습니다"
      />

      <FormField
        type="input"
        title="게스트하우스 이름"
        placeholder="예: 홍대 게스트하우스"
        value=""
        onChange={() => {}}
        isRequired
        error={{ message: '게스트하우스 이름을 입력해주세요' }}
      />

      <FormField
        type="textarea"
        title="게스트하우스에 대한 설명을 적어주세요"
        placeholder="ex. 안락한 소규모 게스트하우스입니다."
        value="짧은"
        onChange={() => {}}
        isRequired
        error={{ message: '게스트하우스에 대한 설명은 최소 10자 이상 입력해주세요' }}
      />

      <ButtonGroup
        placement="bottom"
        direction="vertical"
        buttons={[{ text: '다음 단계', onPress: fn(), variant: 'primary' }]}
      />
    </View>
  ),
}
