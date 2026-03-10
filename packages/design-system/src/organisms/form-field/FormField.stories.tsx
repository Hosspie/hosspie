import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { FormField } from '.'

const meta: Meta<typeof FormField> = {
  title: 'Organisms/FormField',
  component: FormField,
}

export default meta
type Story = StoryObj<typeof FormField>

export const InputField: Story = {
  args: {
    type: 'input',
    title: '게스트하우스 이름',
    placeholder: '예: 홍대 게스트하우스',
    value: '',
    onChange: () => {},
    isRequired: true,
  },
}

export const InputWithError: Story = {
  args: {
    type: 'input',
    title: '이메일',
    placeholder: 'example@email.com',
    value: 'invalid',
    onChange: () => {},
    isRequired: true,
    error: { message: '올바른 이메일 형식이 아닙니다' },
  },
}

export const TextareaField: Story = {
  args: {
    type: 'textarea',
    title: '게스트하우스 설명',
    placeholder: '안락한 소규모 게스트하우스입니다.',
    value: '',
    onChange: () => {},
  },
}

const CardFieldDemo = () => {
  const [value, setValue] = useState<{ type: string } | undefined>(undefined)
  return (
    <FormField
      type="card"
      title="저녁 파티 방식"
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
            label: '설명 입력',
            placeholder: '예: 바비큐 파티',
            onChange: () => {},
          },
        },
      ]}
    />
  )
}

export const CardField: Story = {
  render: () => <CardFieldDemo />,
}

const RadioFieldDemo = () => {
  const [value, setValue] = useState<string | undefined>(undefined)
  return (
    <FormField
      type="radio"
      title="성별"
      value={value}
      onChange={setValue}
      isRequired
      direction="horizontal"
      options={[
        { value: 'REGARDLESS', label: '무관' },
        { value: 'MALE', label: '남성' },
        { value: 'FEMALE', label: '여성' },
      ]}
    />
  )
}

export const RadioField: Story = {
  render: () => <RadioFieldDemo />,
}

const RadioVerticalDemo = () => {
  const [value, setValue] = useState<number | undefined>(undefined)
  return (
    <FormField
      type="radio"
      title="인원"
      value={value}
      onChange={setValue}
      isRequired
      direction="vertical"
      options={[
        { value: 1, label: '1명' },
        { value: 2, label: '2명' },
        { value: 3, label: '3명' },
        { value: 4, label: '4명' },
      ]}
    />
  )
}

export const RadioVertical: Story = {
  render: () => <RadioVerticalDemo />,
}
