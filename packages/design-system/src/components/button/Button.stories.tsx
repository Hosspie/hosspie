import type { Meta, StoryObj } from '@storybook/react'
import { Button, XStack, YStack } from 'tamagui'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
}
export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {
  render: () => <Button>기본 버튼</Button>,
}

export const Sizes: Story = {
  name: '크기별',
  render: () => (
    <XStack gap="$3" alignItems="center">
      <Button size="$2">Small</Button>
      <Button size="$4">Medium</Button>
      <Button size="$6">Large</Button>
    </XStack>
  ),
}

export const Themes: Story = {
  name: '색상별',
  render: () => (
    <YStack gap="$3">
      <Button theme="active">Active</Button>
      <Button disabled>Disabled</Button>
    </YStack>
  ),
}
