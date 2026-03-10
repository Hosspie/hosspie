import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Label } from '.'

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  args: {
    children: '라벨',
    required: false,
  },
  argTypes: {
    required: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {}
