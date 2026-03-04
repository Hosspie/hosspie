import React, { type PropsWithChildren } from 'react'
import { View, type ViewProps } from 'react-native'

export interface FormProps extends Omit<ViewProps, 'style'> {}

export function Form({ children, ...props }: PropsWithChildren<FormProps>) {
  return React.createElement(View, props, children)
}
