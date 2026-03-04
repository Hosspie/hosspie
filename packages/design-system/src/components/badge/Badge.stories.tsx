import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { Badge } from '.'

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  args: {
    label: '배지',
    variant: 'default',
    onPress: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    variant: {
      control: 'select',
      options: ['default', 'success', 'error', 'warning', 'info'],
    },
    onPress: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {}
