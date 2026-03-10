import React from 'react'
import {
  Switch as RNSwitch,
  type SwitchProps as RNSwitchProps,
} from 'react-native'
import { colors } from '../../tokens/colors'

export interface SwitchProps extends RNSwitchProps {}

export function Switch(props: SwitchProps) {
  return React.createElement(RNSwitch, {
    trackColor: {
      false: colors.neutral[400],
      true: colors.brand.primary,
    },
    thumbColor: colors.neutral[900],
    ...props,
  })
}
