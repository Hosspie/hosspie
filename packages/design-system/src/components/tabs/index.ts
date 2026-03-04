import React, { createContext, useContext, type PropsWithChildren } from 'react'
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  type ViewProps,
  type PressableProps,
} from 'react-native'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'
import { sizing } from '../../tokens/sizing'

interface TabsContextValue {
  value?: string
  onValueChange?: (value: string) => void
}

const TabsContext = createContext<TabsContextValue>({})

export interface TabsProps extends Omit<ViewProps, 'style'> {
  value?: string
  onValueChange?: (value: string) => void
}

export function Tabs({
  value,
  onValueChange,
  children,
  ...props
}: PropsWithChildren<TabsProps>) {
  return React.createElement(
    TabsContext.Provider,
    { value: { value, onValueChange } },
    React.createElement(View, { ...props }, children),
  )
}

export interface TabsListProps extends Omit<ViewProps, 'style'> {}

export function TabsList({
  children,
  ...props
}: PropsWithChildren<TabsListProps>) {
  return React.createElement(
    View,
    { ...props, style: styles.list, accessibilityRole: 'tablist' },
    children,
  )
}

export interface TabsTriggerProps extends Omit<PressableProps, 'style'> {
  value: string
}

export function TabsTrigger({
  value,
  children,
  ...props
}: PropsWithChildren<TabsTriggerProps>) {
  const ctx = useContext(TabsContext)
  const isActive = ctx.value === value

  return React.createElement(
    Pressable,
    {
      ...props,
      onPress: () => ctx.onValueChange?.(value),
      style: [styles.trigger, isActive && styles.triggerActive],
      accessibilityRole: 'tab',
      accessibilityState: { selected: isActive },
    },
    typeof children === 'string'
      ? React.createElement(
          Text,
          { style: [styles.triggerText, isActive && styles.triggerTextActive] },
          children,
        )
      : children,
  )
}

export interface TabsContentProps extends Omit<ViewProps, 'style'> {
  value: string
}

export function TabsContent({
  value,
  children,
  ...props
}: PropsWithChildren<TabsContentProps>) {
  const ctx = useContext(TabsContext)
  if (ctx.value !== value) return null

  return React.createElement(
    View,
    { ...props, style: styles.content },
    children,
  )
}

Tabs.List = TabsList
Tabs.Trigger = TabsTrigger
Tabs.Content = TabsContent

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    height: sizing.tabBarHeight,
    borderBottomWidth: sizing.borderWidth,
    borderBottomColor: colors.border.normal,
  },
  trigger: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  triggerActive: {
    borderBottomColor: colors.brand.primary,
  },
  triggerText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
  },
  triggerTextActive: {
    color: colors.brand.primary,
    fontWeight: typography.weights.semibold,
  },
  content: {
    paddingTop: spacing.lg,
  },
})
