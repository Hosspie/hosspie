import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { View, ScrollView } from 'react-native'
import { MobileFrame } from '../../../.storybook/decorators/MobileFrame'
import { ProgressBar } from '../../organisms/progress-bar'
import { TextBlock } from '../../organisms/text-block'
import { FormField } from '../../organisms/form-field'
import { ButtonGroup } from '../../organisms/button-group'

const InformationPage = () => {
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar value={50} max={100} />

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
          { text: '이전', onPress: fn(), variant: 'outline' },
          { text: '다음 단계', onPress: fn(), variant: 'primary' },
        ]}
      />
    </View>
  )
}

const meta: Meta = {
  title: 'Admin Screens/Onboarding/Information',
  component: InformationPage,
  decorators: [MobileFrame],
}

export default meta
type Story = StoryObj

export const Default: Story = {}

export const WithFilledData: Story = {
  render: () => {
    const FilledPage = () => {
      const [address, setAddress] = useState('서울시 마포구 홍대입구역 2번 출구')
      const [phone, setPhone] = useState('02-1234-5678')
      const [email, setEmail] = useState('contact@guesthouse.com')
      const [website, setWebsite] = useState('https://guesthouse.com')

      return (
        <View style={{ flex: 1 }}>
          <ProgressBar value={50} max={100} />

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
              { text: '이전', onPress: fn(), variant: 'outline' },
              { text: '다음 단계', onPress: fn(), variant: 'primary' },
            ]}
          />
        </View>
      )
    }
    return <FilledPage />
  },
}
