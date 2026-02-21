import type { Meta, StoryObj } from '@storybook/react'
import { Separator, Text, XStack, YStack } from 'tamagui'

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
}
export default meta

type Story = StoryObj<typeof Separator>

export const Horizontal: Story = {
  name: '수평',
  render: () => (
    <YStack gap="$3" width={300}>
      <Text>위 항목</Text>
      <Separator />
      <Text>아래 항목</Text>
    </YStack>
  ),
}

export const Vertical: Story = {
  name: '수직',
  render: () => (
    <XStack gap="$3" height={100} alignItems="center">
      <Text>왼쪽</Text>
      <Separator vertical />
      <Text>오른쪽</Text>
    </XStack>
  ),
}
