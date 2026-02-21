import type { Meta, StoryObj } from '@storybook/react'
import { Button, Dialog, XStack } from 'tamagui'

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
}
export default meta

type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  render: () => (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button>다이얼로그 열기</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          padding="$4"
          gap="$3"
        >
          <Dialog.Title>제목</Dialog.Title>
          <Dialog.Description>
            다이얼로그 설명 텍스트입니다.
          </Dialog.Description>
          <XStack gap="$3" justifyContent="flex-end">
            <Dialog.Close asChild>
              <Button>닫기</Button>
            </Dialog.Close>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  ),
}
