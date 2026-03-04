import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { Sheet, SheetContent } from '.'
import { Text, Pressable, StyleSheet } from 'react-native'

const meta: Meta<typeof Sheet> = {
  title: 'Components/Sheet',
  component: Sheet,
  args: {
    onClose: fn(),
  },
  argTypes: {
    onClose: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof Sheet>

function SheetDemo(props: React.ComponentProps<typeof Sheet>) {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Pressable onPress={() => setVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>시트 열기</Text>
      </Pressable>
      <Sheet
        {...props}
        visible={visible}
        onClose={() => {
          setVisible(false)
          props.onClose?.()
        }}
      >
        <SheetContent>
          <Text style={styles.title}>바텀 시트</Text>
          <Text style={styles.description}>시트 내용이 여기에 표시됩니다.</Text>
        </SheetContent>
      </Sheet>
    </>
  )
}

export const Default: Story = {
  render: (args) => <SheetDemo {...args} />,
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#AAAAAA',
    lineHeight: 24,
  },
})
