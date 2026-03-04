import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Text } from '.'

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  args: {
    children: '텍스트 미리보기',
    variant: 'body',
    weight: 'regular',
  },
  argTypes: {
    children: { control: 'text' },
    variant: {
      control: 'select',
      options: ['display', 'h1', 'h2', 'body', 'caption'],
    },
    weight: {
      control: 'select',
      options: ['regular', 'medium', 'semibold', 'bold'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Text>

export const Default: Story = {}
