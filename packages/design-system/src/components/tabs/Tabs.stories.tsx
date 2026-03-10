import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '.'
import { Text, StyleSheet } from 'react-native'

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    onValueChange: fn(),
  },
  argTypes: {
    onValueChange: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof Tabs>

function TabsWithState(props: React.ComponentProps<typeof Tabs>) {
  const [value, setValue] = useState('tab1')
  return (
    <Tabs
      {...props}
      value={value}
      onValueChange={(v) => {
        setValue(v)
        props.onValueChange?.(v)
      }}
    >
      <TabsList>
        <TabsTrigger value="tab1">탭 1</TabsTrigger>
        <TabsTrigger value="tab2">탭 2</TabsTrigger>
        <TabsTrigger value="tab3">탭 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <Text style={styles.text}>탭 1 내용</Text>
      </TabsContent>
      <TabsContent value="tab2">
        <Text style={styles.text}>탭 2 내용</Text>
      </TabsContent>
      <TabsContent value="tab3">
        <Text style={styles.text}>탭 3 내용</Text>
      </TabsContent>
    </Tabs>
  )
}

export const Default: Story = {
  render: (args) => <TabsWithState {...args} />,
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#FFFFFF',
  },
})
