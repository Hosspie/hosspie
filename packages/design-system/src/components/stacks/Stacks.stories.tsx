import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { View, Text, StyleSheet } from 'react-native'
import { VStack, HStack } from '.'

const meta: Meta<typeof VStack> = {
  title: 'Components/Stacks',
  component: VStack,
  args: {
    gap: 'md',
  },
  argTypes: {
    gap: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    padding: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    align: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'stretch'],
    },
    justify: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
    },
  },
}

export default meta
type Story = StoryObj<typeof VStack>

function Box({ label }: { label: string }) {
  return (
    <View style={s.box}>
      <Text style={s.boxText}>{label}</Text>
    </View>
  )
}

export const Default: Story = {
  render: (args) => (
    <VStack gap="lg">
      <Text style={s.label}>VStack</Text>
      <VStack {...args}>
        <Box label="1" />
        <Box label="2" />
        <Box label="3" />
      </VStack>

      <Text style={s.label}>HStack</Text>
      <HStack {...args}>
        <Box label="1" />
        <Box label="2" />
        <Box label="3" />
      </HStack>
    </VStack>
  ),
}

const s = StyleSheet.create({
  box: {
    width: 60,
    height: 60,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    color: '#AAAAAA',
    fontWeight: '600',
  },
})
