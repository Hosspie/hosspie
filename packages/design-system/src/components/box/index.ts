import React, { type PropsWithChildren } from 'react'
import { View, type ViewProps } from 'react-native'

export interface BoxProps extends Omit<ViewProps, 'style'> {
  flex?: number
}

export function Box({
  flex,
  children,
  ...props
}: PropsWithChildren<BoxProps>) {
  return React.createElement(
    View,
    {
      ...props,
      style: flex !== undefined ? { flex } : undefined,
    },
    children,
  )
}
