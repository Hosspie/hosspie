import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CardList } from '.'

const meta: Meta<typeof CardList> = {
  title: 'Organisms/CardList',
  component: CardList,
  args: {
    items: [
      {
        title: '4인실',
        description: '정원: 4명, 성별: 무관, 욕실: 있음',
        badges: [{ label: '기본', variant: 'default' as const }],
      },
      {
        title: '커플룸',
        description: '정원: 2명, 성별: 무관, 욕실: 있음',
        badges: [{ label: '인기', variant: 'success' as const }],
      },
      {
        title: '여성 전용 3인실',
        description: '정원: 3명, 성별: 여성, 욕실: 없음',
      },
    ],
  },
}

export default meta
type Story = StoryObj<typeof CardList>

export const Default: Story = {}

export const WithExpandable: Story = {
  args: {
    items: [
      {
        title: '포틀럭 파티',
        description: '게스트들이 자유롭게 참여하는 파티',
        expandable: {
          label: '자세히 보기',
          content: '각자 음식을 하나씩 가져와서 함께 나누는 파티입니다. 매주 금요일 저녁에 진행됩니다.',
        },
      },
      {
        title: '호스트 제공',
        description: '호스트가 직접 준비하는 저녁 식사',
        badges: [{ label: '추천', variant: 'success' as const }],
      },
    ],
  },
}

export const SingleCard: Story = {
  args: {
    items: [
      {
        title: 'VIP룸',
        description: '정원: 1명, 성별: 무관, 욕실: 있음',
        badges: [
          { label: 'VIP', variant: 'warning' as const },
          { label: '프리미엄', variant: 'info' as const },
        ],
      },
    ],
  },
}
