import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { View } from 'react-native'
import { Fab } from '.'
import { Icon } from '../../components/icon'

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
    items: [{ icon: <Icon name="add" color="onBrand" />, onPress: fn() }],
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

export const IconWithLabel: Story = {
  args: {
    items: [
      { icon: <Icon name="add" color="onBrand" />, label: '방 추가', onPress: fn() },
    ],
  },
}

export const MultipleFabs: Story = {
  args: {
    items: [
      { label: '삭제', onPress: fn() },
      { label: '수정', onPress: fn() },
      { icon: <Icon name="add" color="onBrand" />, onPress: fn() },
    ],
  },
}

export const Foldable: Story = {
  args: {
    isFoldable: true,
    items: [
      { icon: <Icon name="add" color="onBrand" />, label: '방 추가', onPress: fn() },
      { icon: <Icon name="close" color="onBrand" />, label: '설정', onPress: fn() },
    ],
  },
}

export const FoldableIconOnly: Story = {
  args: {
    isFoldable: true,
    items: [
      { icon: <Icon name="add" color="onBrand" />, onPress: fn() },
      { icon: <Icon name="checkmark" color="onBrand" />, onPress: fn() },
    ],
  },
}
