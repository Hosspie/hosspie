import React, { useState, useRef } from 'react'
import {
  View,
  Pressable,
  Animated,
  StyleSheet,
} from 'react-native'
import { Icon } from '../../components/icon'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { radius } from '../../tokens/radius'
import { typography } from '../../tokens/typography'
import { sizing } from '../../tokens/sizing'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FabItem {
  icon?: React.ReactNode
  label?: string
  onPress: () => void
}

export interface FabProps {
  items: FabItem[]
  isFoldable?: boolean
  placement?: 'left' | 'right'
}

// ---------------------------------------------------------------------------
// Sub-renderer
// ---------------------------------------------------------------------------

function renderFabButton(
  item: FabItem,
  index: number,
  isPrimary: boolean,
) {
  const hasOnlyIcon = !item.label && !!item.icon

  return React.createElement(
    Pressable,
    {
      key: index,
      onPress: item.onPress,
      style: [
        styles.fabButton,
        isPrimary ? styles.fabPrimary : styles.fabSecondary,
        hasOnlyIcon ? styles.fabCircle : styles.fabRounded,
      ],
      accessibilityRole: 'button' as const,
    },
    item.icon ? item.icon : null,
    item.label
      ? React.createElement(
          Animated.Text,
          { style: styles.fabLabel },
          item.label,
        )
      : null,
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * Fab organism.
 * 플로팅 액션 버튼. isFoldable=true면 접기/펼치기 애니메이션 지원.
 */
export function Fab({
  items,
  isFoldable = false,
  placement = 'right',
}: FabProps) {
  const [isFolded, setIsFolded] = useState(true)
  const fadeAnim = useRef(new Animated.Value(0)).current

  const toggleFold = () => {
    const nextFolded = !isFolded
    setIsFolded(nextFolded)
    Animated.timing(fadeAnim, {
      toValue: nextFolded ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  const alignStyle =
    placement === 'right' ? styles.alignRight : styles.alignLeft

  // 접기/펼치기 없는 단순 모드
  if (!isFoldable) {
    const hasOnlyOne = items.length === 1
    return React.createElement(
      View,
      { style: [styles.container, alignStyle] },
      ...items.map((item, index) =>
        renderFabButton(item, index, hasOnlyOne),
      ),
    )
  }

  // 접기/펼치기 모드
  return React.createElement(
    View,
    { style: [styles.container, alignStyle] },
    // 펼쳐진 아이템들 (애니메이션)
    React.createElement(
      Animated.View,
      {
        style: [
          styles.foldableItems,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ],
        pointerEvents: isFolded ? 'none' : 'auto',
      },
      ...items.map((item, index) =>
        renderFabButton(item, index, false),
      ),
    ),
    // 메인 토글 버튼
    React.createElement(
      Pressable,
      {
        onPress: toggleFold,
        style: [styles.fabButton, styles.fabPrimary, styles.fabCircle],
        accessibilityRole: 'button' as const,
      },
      React.createElement(
        Animated.View,
        {
          style: {
            transform: [
              {
                rotateZ: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '45deg'],
                }),
              },
            ],
          },
        },
        React.createElement(Icon, { name: 'add', color: 'onBrand' }),
      ),
    ),
  )
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const FAB_SIZE = sizing.fabSize

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: spacing.md,
    padding: spacing.lg,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  alignLeft: {
    alignItems: 'flex-start',
  },
  fabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: FAB_SIZE,
    minWidth: FAB_SIZE,
  },
  fabPrimary: {
    backgroundColor: colors.brand.primary,
  },
  fabSecondary: {
    backgroundColor: colors.neutral[400],
  },
  fabCircle: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
  },
  fabRounded: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  fabLabel: {
    color: colors.text.onBrand,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
  },
  foldableItems: {
    gap: spacing.md,
  },
})
