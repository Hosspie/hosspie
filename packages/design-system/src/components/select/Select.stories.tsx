import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { Select } from '.'

const options = [
  { label: '옵션 1', value: 'opt1' },
  { label: '옵션 2', value: 'opt2' },
  { label: '옵션 3', value: 'opt3' },
  { label: '옵션 4', value: 'opt4' },
]

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  args: {
    options,
    placeholder: '선택하세요',
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    onValueChange: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof Select>

function SelectWithState(props: React.ComponentProps<typeof Select>) {
  const [value, setValue] = useState<string | undefined>(undefined)
  return (
    <Select
      {...props}
      value={value}
      onValueChange={(v) => {
        setValue(v)
        props.onValueChange?.(v)
      }}
    />
  )
}

export const Default: Story = {
  render: (args) => <SelectWithState {...args} />,
}
