import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from '.'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  args: {
    size: 'md',
    fallback: '홍',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    fallback: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {}
