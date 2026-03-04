import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  type PropsWithChildren,
} from 'react'
import {
  View,
  Pressable,
  Text,
  Animated,
  StyleSheet,
  type ViewProps,
  type PressableProps,
  type LayoutChangeEvent,
} from 'react-native'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'
import { sizing } from '../../tokens/sizing'

interface AccordionContextValue {
  expandedItems: string[]
  toggle: (value: string) => void
  type: 'single' | 'multiple'
}

const AccordionContext = createContext<AccordionContextValue>({
  expandedItems: [],
  toggle: () => {},
  type: 'single',
})

interface AccordionItemContextValue {
  value: string
  isExpanded: boolean
}

const AccordionItemContext = createContext<AccordionItemContextValue>({
  value: '',
  isExpanded: false,
})

export interface AccordionProps extends Omit<ViewProps, 'style'> {
  type?: 'single' | 'multiple'
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

export function Accordion({
  type = 'single',
  defaultValue = [],
  onValueChange,
  children,
  ...props
}: PropsWithChildren<AccordionProps>) {
  const [expandedItems, setExpandedItems] = useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : [],
  )

  const toggle = (value: string) => {
    let next: string[]
    if (type === 'single') {
      next = expandedItems.includes(value) ? [] : [value]
    } else {
      next = expandedItems.includes(value)
        ? expandedItems.filter((v) => v !== value)
        : [...expandedItems, value]
    }
    setExpandedItems(next)
    onValueChange?.(next)
  }

  return React.createElement(
    AccordionContext.Provider,
    { value: { expandedItems, toggle, type } },
    React.createElement(View, { ...props, style: styles.root }, children),
  )
}

export interface AccordionItemProps extends Omit<ViewProps, 'style'> {
  value: string
}

export function AccordionItem({
  value,
  children,
  ...props
}: PropsWithChildren<AccordionItemProps>) {
  const { expandedItems } = useContext(AccordionContext)
  const isExpanded = expandedItems.includes(value)

  return React.createElement(
    AccordionItemContext.Provider,
    { value: { value, isExpanded } },
    React.createElement(
      View,
      { ...props, style: styles.item },
      children,
    ),
  )
}

export interface AccordionTriggerProps extends Omit<PressableProps, 'style'> {}

export function AccordionTrigger({
  children,
  ...props
}: PropsWithChildren<AccordionTriggerProps>) {
  const { toggle } = useContext(AccordionContext)
  const { value, isExpanded } = useContext(AccordionItemContext)
  const rotation = useRef(new Animated.Value(isExpanded ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [isExpanded])

  const rotateZ = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  })

  return React.createElement(
    Pressable,
    {
      ...props,
      onPress: () => toggle(value),
      style: styles.trigger,
      accessibilityRole: 'button',
      accessibilityState: { expanded: isExpanded },
    },
    typeof children === 'string'
      ? React.createElement(
          Text,
          { style: styles.triggerText },
          children,
        )
      : children,
    React.createElement(
      Animated.Text,
      { style: [styles.chevron, { transform: [{ rotateZ }] }] },
      '▼',
    ),
  )
}

export interface AccordionContentProps extends Omit<ViewProps, 'style'> {}

export function AccordionContent({
  children,
  ...props
}: PropsWithChildren<AccordionContentProps>) {
  const { isExpanded } = useContext(AccordionItemContext)
  const animatedHeight = useRef(new Animated.Value(0)).current
  const contentHeight = useRef(0)
  const [measured, setMeasured] = useState(false)

  const onContentLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height
    if (h > 0 && !measured) {
      contentHeight.current = h
      setMeasured(true)
      if (isExpanded) {
        animatedHeight.setValue(h)
      }
    }
  }

  useEffect(() => {
    if (!measured) return
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? contentHeight.current : 0,
      duration: 250,
      useNativeDriver: false,
    }).start()
  }, [isExpanded, measured])

  return React.createElement(
    Animated.View,
    {
      style: {
        height: measured ? animatedHeight : undefined,
        overflow: 'hidden',
      },
    },
    React.createElement(
      View,
      { ...props, style: styles.content, onLayout: onContentLayout },
      children,
    ),
  )
}

Accordion.Item = AccordionItem
Accordion.Trigger = AccordionTrigger
Accordion.Content = AccordionContent

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  item: {
    borderBottomWidth: sizing.borderWidth,
    borderBottomColor: colors.border.normal,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  triggerText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    flex: 1,
  },
  chevron: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
})
