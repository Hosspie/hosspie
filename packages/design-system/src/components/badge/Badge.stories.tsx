import type { Meta, StoryObj } from '@storybook/react'
import { XStack } from 'tamagui'
import { Badge, BadgeText } from './index'

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
}
export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {
  render: () => (
    <Badge>
      <BadgeText>Default</BadgeText>
    </Badge>
  ),
}

export const Variants: Story = {
  name: '변형',
  render: () => (
    <XStack gap="$3">
      <Badge variant="success"><BadgeText>Success</BadgeText></Badge>
      <Badge variant="error"><BadgeText>Error</BadgeText></Badge>
      <Badge variant="warning"><BadgeText>Warning</BadgeText></Badge>
      <Badge variant="info"><BadgeText>Info</BadgeText></Badge>
    </XStack>
  ),
}
