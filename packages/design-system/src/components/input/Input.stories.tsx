import type { Meta, StoryObj } from '@storybook/react'
import { Input } from 'tamagui'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
}
export default meta

type Story = StoryObj<typeof Input>

export const Default: Story = {
  render: () => <Input />,
}

export const WithPlaceholder: Story = {
  name: 'Placeholder',
  render: () => <Input placeholder="이메일을 입력하세요" />,
}

export const Disabled: Story = {
  render: () => <Input placeholder="비활성화" disabled />,
}
