import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ProgressBar } from '.'

const meta: Meta<typeof ProgressBar> = {
  title: 'Organisms/ProgressBar',
  component: ProgressBar,
  args: {
    value: 50,
    max: 100,
    caption: '2/4 단계',
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    max: { control: 'number' },
    caption: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof ProgressBar>

export const Default: Story = {}

export const Quarter: Story = {
  args: { value: 25, caption: '1/4 단계' },
}

export const Half: Story = {
  args: { value: 50, caption: '2/4 단계' },
}

export const ThreeQuarters: Story = {
  args: { value: 75, caption: '3/4 단계' },
}

export const Complete: Story = {
  args: { value: 100, caption: '4/4 단계' },
}

export const NoCaption: Story = {
  args: { value: 60, caption: undefined },
}
