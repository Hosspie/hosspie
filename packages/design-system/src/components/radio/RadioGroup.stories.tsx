import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { Radio } from '.'

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  args: {
    selected: false,
    disabled: false,
    onSelect: fn(),
  },
  argTypes: {
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onSelect: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof Radio>

function RadioWithState(props: React.ComponentProps<typeof Radio>) {
  const [selected, setSelected] = useState(props.selected ?? false)

  React.useEffect(() => {
    setSelected(props.selected ?? false)
  }, [props.selected])

  return (
    <Radio
      {...props}
      selected={selected}
      onSelect={() => {
        setSelected((v) => !v)
        props.onSelect?.()
      }}
    />
  )
}

export const Default: Story = {
  render: (args) => <RadioWithState {...args} />,
}
