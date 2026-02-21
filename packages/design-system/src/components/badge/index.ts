import { styled, Text, View } from 'tamagui'

export const Badge = styled(View, {
  name: 'Badge',
  paddingHorizontal: '$2',
  paddingVertical: '$1',
  borderRadius: '$6',
  backgroundColor: '$color5',

  variants: {
    variant: {
      success: { backgroundColor: '$success' },
      error: { backgroundColor: '$error' },
      warning: { backgroundColor: '$warning' },
      info: { backgroundColor: '$info' },
    },
  } as const,
})

export const BadgeText = styled(Text, {
  name: 'BadgeText',
  fontSize: '$1',
  color: '$color12',
})
