import type { Meta, StoryObj } from '@storybook/react'
import { Text, H1, H2, H3, H4, H5, H6, Paragraph, YStack } from 'tamagui'

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
}
export default meta

type Story = StoryObj<typeof Text>

export const Default: Story = {
  render: () => <Text>기본 텍스트</Text>,
}

export const Headings: Story = {
  name: 'H1-H6',
  render: () => (
    <YStack gap="$2">
      <H1>Heading 1</H1>
      <H2>Heading 2</H2>
      <H3>Heading 3</H3>
      <H4>Heading 4</H4>
      <H5>Heading 5</H5>
      <H6>Heading 6</H6>
    </YStack>
  ),
}

export const ParagraphStory: Story = {
  name: 'Paragraph',
  render: () => (
    <Paragraph>
      이것은 문단 텍스트입니다. Tamagui의 Paragraph 컴포넌트로 렌더링됩니다.
    </Paragraph>
  ),
}
