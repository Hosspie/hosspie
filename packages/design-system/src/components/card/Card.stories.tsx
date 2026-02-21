import type { Meta, StoryObj } from '@storybook/react'
import { Card, H3, Paragraph, XStack, Button } from 'tamagui'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
}
export default meta

type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card elevate bordered padding="$4" width={300}>
      <Card.Header>
        <H3>카드 제목</H3>
      </Card.Header>
      <Paragraph>카드 내용이 여기에 표시됩니다.</Paragraph>
      <Card.Footer>
        <XStack flex={1} />
        <Button size="$3">확인</Button>
      </Card.Footer>
    </Card>
  ),
}
