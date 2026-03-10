import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { ButtonGroup } from '.'

const meta: Meta<typeof ButtonGroup> = {
  title: 'Organisms/ButtonGroup',
  component: ButtonGroup,
  args: {
    buttons: [
      { text: '이전', onPress: fn(), variant: 'outline' },
      { text: '다음 단계', onPress: fn(), variant: 'primary' },
    ],
    direction: 'vertical',
    placement: 'default',
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    placement: {
      control: 'select',
      options: ['default', 'bottom'],
    },
  },
}

export default meta
type Story = StoryObj<typeof ButtonGroup>

export const Default: Story = {}

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
  },
}

export const SingleButton: Story = {
  args: {
    buttons: [
      { text: '온보딩 시작', onPress: fn(), variant: 'primary' },
    ],
  },
}

export const WithDisabled: Story = {
  args: {
    buttons: [
      { text: '취소', onPress: fn(), variant: 'outline' },
      { text: '저장', onPress: fn(), variant: 'primary', disabled: true },
    ],
  },
}
