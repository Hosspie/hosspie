import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Icon } from '.'

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  args: {
    name: 'add',
    size: 'md',
    color: 'primary',
  },
  argTypes: {
    name: { control: 'select', options: ['add', 'close', 'chevron-forward', 'chevron-back', 'checkmark'] },
    size: { control: 'select', options: ['sm', 'md'] },
    color: { control: 'select', options: ['primary', 'secondary', 'disabled', 'onBrand', 'brand', 'inverse'] },
  },
}

export default meta
type Story = StoryObj<typeof Icon>

export const Default: Story = {}
