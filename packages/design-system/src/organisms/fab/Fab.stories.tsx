import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { View, Text } from 'react-native'
import { Fab } from '.'

const PlusText = () => (
  <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' }}>+</Text>
)

const meta: Meta<typeof Fab> = {
  title: 'Organisms/Fab',
  component: Fab,
  decorators: [
    (Story) => (
      <View style={{ height: 300 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    items: [{ icon: <PlusText />, onPress: fn() }],
    isFoldable: false,
    placement: 'right',
  },
  argTypes: {
    isFoldable: { control: 'boolean' },
    placement: {
      control: 'select',
      options: ['left', 'right'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Fab>

export const Default: Story = {}

export const LeftPlacement: Story = {
  args: { placement: 'left' },
}

export const WithLabel: Story = {
  args: {
    items: [{ label: '방 추가', onPress: fn() }],
  },
}

export const MultipleFabs: Story = {
  args: {
    items: [
      { label: '삭제', onPress: fn() },
      { label: '수정', onPress: fn() },
      { icon: <PlusText />, onPress: fn() },
    ],
  },
}

export const Foldable: Story = {
  args: {
    isFoldable: true,
    items: [
      { label: '방 추가', onPress: fn() },
      { label: '설정', onPress: fn() },
    ],
  },
}
