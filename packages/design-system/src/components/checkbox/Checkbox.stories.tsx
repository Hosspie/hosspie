import React, { useState, useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { Checkbox } from '.'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: {
    checked: false,
    disabled: false,
    onCheckedChange: fn(),
  },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onCheckedChange: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

function CheckboxWithState(props: React.ComponentProps<typeof Checkbox>) {
  const [checked, setChecked] = useState(props.checked ?? false)

  useEffect(() => {
    setChecked(props.checked ?? false)
  }, [props.checked])

  return (
    <Checkbox
      {...props}
      checked={checked}
      onCheckedChange={(v) => {
        setChecked(v)
        props.onCheckedChange?.(v)
      }}
    />
  )
}

export const Default: Story = {
  render: (args) => <CheckboxWithState {...args} />,
}
