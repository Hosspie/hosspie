import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TextBlock } from '.'

const meta: Meta<typeof TextBlock> = {
  title: 'Organisms/TextBlock',
  component: TextBlock,
  args: {
    title: '게스트하우스 정보를\n등록해 주세요',
    description: '기본적인 정보부터 시작해보겠습니다',
    align: 'left',
  },
  argTypes: {
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
  },
}

export default meta
type Story = StoryObj<typeof TextBlock>

export const Default: Story = {}

export const CenterAligned: Story = {
  args: {
    title: '환영합니다',
    description: '게스트하우스를 설정해보세요',
    align: 'center',
  },
}

export const TitleOnly: Story = {
  args: {
    title: '방 구성을\n등록해 주세요',
    description: undefined,
  },
}
