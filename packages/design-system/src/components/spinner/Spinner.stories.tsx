import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from '.'

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  args: {
    size: 'md',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = {}
