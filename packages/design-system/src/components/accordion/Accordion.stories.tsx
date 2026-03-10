import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '.'
import { Text, StyleSheet } from 'react-native'

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  args: {
    type: 'single',
    onValueChange: fn(),
  },
  argTypes: {
    type: { control: 'select', options: ['single', 'multiple'] },
    defaultValue: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof Accordion>

export const Default: Story = {
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item1">
        <AccordionTrigger>섹션 1</AccordionTrigger>
        <AccordionContent>
          <Text style={styles.text}>섹션 1의 내용입니다.</Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item2">
        <AccordionTrigger>섹션 2</AccordionTrigger>
        <AccordionContent>
          <Text style={styles.text}>섹션 2의 내용입니다.</Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item3">
        <AccordionTrigger>섹션 3</AccordionTrigger>
        <AccordionContent>
          <Text style={styles.text}>섹션 3의 내용입니다.</Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: '#AAAAAA',
    lineHeight: 22,
  },
})
