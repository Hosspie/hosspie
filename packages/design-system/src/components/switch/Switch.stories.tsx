import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { Switch } from '.'

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  args: {
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    disabled: { control: 'boolean' },
    onValueChange: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof Switch>

function SwitchWithState(props: React.ComponentProps<typeof Switch>) {
  const [value, setValue] = useState(false)
  return (
    <Switch
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
  render: (args) => <SwitchWithState {...args} />,
}
