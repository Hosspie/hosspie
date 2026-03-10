import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { Input } from '.'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  args: {
    placeholder: '입력하세요',
    editable: true,
    onChangeText: fn(),
  },
  argTypes: {
    placeholder: { control: 'text' },
    editable: { control: 'boolean' },
    secureTextEntry: { control: 'boolean' },
    onChangeText: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {}
