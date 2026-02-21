import type { Meta, StoryObj } from '@storybook/react'
import { Switch, XStack, Text } from 'tamagui'

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
}
export default meta

type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: () => (
    <Switch>
      <Switch.Thumb />
    </Switch>
  ),
}

export const WithLabel: Story = {
  name: '라벨 포함',
  render: () => (
    <XStack gap="$3" alignItems="center">
      <Text>알림 설정</Text>
      <Switch>
        <Switch.Thumb />
      </Switch>
    </XStack>
  ),
}
