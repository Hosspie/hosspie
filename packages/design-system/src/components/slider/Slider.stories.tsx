import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { Slider } from '.'

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  args: {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    onValueChange: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof Slider>

function SliderWithState(props: React.ComponentProps<typeof Slider>) {
  const [value, setValue] = useState(50)
  return (
    <Slider
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
  render: (args) => <SliderWithState {...args} />,
}
