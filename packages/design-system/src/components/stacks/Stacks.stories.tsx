import type { Meta, StoryObj } from '@storybook/react'
import { YStack, XStack, Text } from 'tamagui'

const meta: Meta<typeof YStack> = {
  title: 'Components/Stacks',
  component: YStack,
}
export default meta

type Story = StoryObj<typeof YStack>

const Box = ({ children }: { children: string }) => (
  <YStack padding="$3" backgroundColor="$color5" borderRadius="$2">
    <Text color="$color12">{children}</Text>
  </YStack>
)

export const Vertical: Story = {
  render: () => (
    <YStack gap="$3">
      <Box>항목 1</Box>
      <Box>항목 2</Box>
      <Box>항목 3</Box>
    </YStack>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <XStack gap="$3">
      <Box>항목 1</Box>
      <Box>항목 2</Box>
      <Box>항목 3</Box>
    </XStack>
  ),
}

export const VerticalGapVariations: Story = {
  name: 'Gap 변형',
  render: () => (
    <XStack gap="$6">
      <YStack gap="$1">
        <Text color="$color10" fontSize="$1">gap=$1</Text>
        <Box>A</Box><Box>B</Box>
      </YStack>
      <YStack gap="$3">
        <Text color="$color10" fontSize="$1">gap=$3</Text>
        <Box>A</Box><Box>B</Box>
      </YStack>
      <YStack gap="$6">
        <Text color="$color10" fontSize="$1">gap=$6</Text>
        <Box>A</Box><Box>B</Box>
      </YStack>
    </XStack>
  ),
}
