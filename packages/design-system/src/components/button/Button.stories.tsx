import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { Button } from '.'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: {
    title: '버튼',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    onPress: fn(),
  },
  argTypes: {
    title: { control: 'text' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onPress: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {}
