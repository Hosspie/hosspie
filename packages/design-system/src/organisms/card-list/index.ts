import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Card } from '../../components/card'
import { Text } from '../../components/text'
import { Badge, type BadgeVariant } from '../../components/badge'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../components/accordion'
import { spacing } from '../../tokens/spacing'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CardListItem {
  title: string
  description: string
  badges?: { label: string; variant?: BadgeVariant }[]
  expandable?: { label: string; content: string }
}

export interface CardListProps {
  items: CardListItem[]
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * CardList organism.
 * 읽기 전용 카드 목록을 렌더링한다. 뱃지와 아코디언 확장 섹션을 선택적으로 포함.
 */
export function CardList({ items }: CardListProps) {
  return React.createElement(
    View,
    { style: styles.container },
    ...items.map((item, index) =>
      React.createElement(
        Card,
        { key: index, padding: 'md' },
        // 헤더: 제목 + 뱃지 행
        React.createElement(
          View,
          { style: styles.header },
          React.createElement(
            View,
            { style: styles.titleRow },
            React.createElement(
              Text,
              { variant: 'body', weight: 'semibold' },
              item.title,
            ),
            item.badges && item.badges.length > 0
              ? React.createElement(
                  View,
                  { style: styles.badgeRow },
                  ...item.badges.map((badge, badgeIndex) =>
                    React.createElement(Badge, {
                      key: badgeIndex,
                      label: badge.label,
                      variant: badge.variant,
                    }),
                  ),
                )
              : null,
          ),
          // 설명
          React.createElement(
            Text,
            { variant: 'caption' },
            item.description,
          ),
        ),
        // 확장 가능한 섹션
        item.expandable
          ? React.createElement(
              View,
              { style: styles.expandableContainer },
              React.createElement(
                Accordion,
                { type: 'single' as const },
                React.createElement(
                  AccordionItem,
                  { value: `card-${index}` },
                  React.createElement(
                    AccordionTrigger,
                    null,
                    item.expandable.label,
                  ),
                  React.createElement(
                    AccordionContent,
                    null,
                    React.createElement(
                      Text,
                      { variant: 'caption' },
                      item.expandable.content,
                    ),
                  ),
                ),
              ),
            )
          : null,
      ),
    ),
  )
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  expandableContainer: {
    marginTop: spacing.sm,
  },
})
