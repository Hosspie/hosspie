import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { Dialog, DialogActions } from '.'
import { Button } from '../button'

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  args: {
    title: '제목',
    description: '다이얼로그 설명 텍스트입니다.',
    onClose: fn(),
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    onClose: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof Dialog>

function DialogWithState(props: { title?: string; description?: string; onClose?: () => void }) {
  const [visible, setVisible] = useState(false)
  const handleClose = () => {
    setVisible(false)
    props.onClose?.()
  }
  return (
    <>
      <Button title="다이얼로그 열기" onPress={() => setVisible(true)} />
      <Dialog
        visible={visible}
        onClose={handleClose}
        title={props.title}
        description={props.description}
      >
        <DialogActions>
          <Button title="닫기" variant="secondary" size="sm" onPress={handleClose} />
          <Button title="확인" variant="primary" size="sm" onPress={handleClose} />
        </DialogActions>
      </Dialog>
    </>
  )
}

export const Default: Story = {
  render: (args) => (
    <DialogWithState
      title={args.title}
      description={args.description}
      onClose={args.onClose}
    />
  ),
}
