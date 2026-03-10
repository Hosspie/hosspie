import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from '.'

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  args: {
    value: 60,
    max: 100,
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: 'number' },
  },
}

export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {}
