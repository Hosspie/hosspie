import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { View, Text, StyleSheet } from 'react-native'
import { Separator } from '.'

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  args: {
    orientation: 'horizontal',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Separator>

export const Default: Story = {
  render: (args) => (
    <View style={args.orientation === 'vertical' ? styles.row : styles.column}>
      <Text style={styles.text}>영역 A</Text>
      <Separator {...args} />
      <Text style={styles.text}>영역 B</Text>
    </View>
  ),
}

const styles = StyleSheet.create({
  column: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 40 },
  text: { fontSize: 15, color: '#FFFFFF' },
})
