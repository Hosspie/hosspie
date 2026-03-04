import React from 'react'
import { View, StyleSheet } from 'react-native'
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import {
  FormField,
  type FormFieldProps,
  type FormFieldType,
  type CardOption,
  type RadioOption,
} from '../form-field'
import { Text } from '../../components/text'
import { spacing } from '../../tokens/spacing'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BaseFieldConfig<T extends FieldValues> = {
  name: Path<T>
  title?: string
  isRequired?: boolean
  rules?: object
}

type InputFieldConfig<T extends FieldValues> = BaseFieldConfig<T> & {
  type: 'input' | 'textarea'
  placeholder?: string
}

type CardFieldConfig<T extends FieldValues> = BaseFieldConfig<T> & {
  type: 'card'
  options: CardOption<any>[]
}

type RadioFieldConfig<T extends FieldValues> = BaseFieldConfig<T> & {
  type: 'radio'
  options: RadioOption<any>[]
  direction?: 'horizontal' | 'vertical'
}

export type FieldConfig<T extends FieldValues = FieldValues> =
  | InputFieldConfig<T>
  | CardFieldConfig<T>
  | RadioFieldConfig<T>

export interface FormFieldsProps<T extends FieldValues> {
  control: Control<T>
  title?: string
  fields: FieldConfig<T>[]
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * FormFields organism.
 * react-hook-form Controller와 FormField organism을 연결하는 글루 레이어.
 * 여러 폼 필드를 일괄 렌더링한다.
 */
export function FormFields<T extends FieldValues>({
  control,
  title,
  fields,
}: FormFieldsProps<T>) {
  return React.createElement(
    View,
    { style: styles.container },
    // 제목
    title
      ? React.createElement(
          Text,
          { variant: 'h2', weight: 'bold' },
          title,
        )
      : null,
    // 필드 목록
    ...fields.map((field) =>
      React.createElement(Controller, {
        key: field.name,
        control: control as any,
        name: field.name as any,
        rules: field.rules as any,
        render: ({
          field: controllerField,
          fieldState,
        }): React.ReactElement => {
          const baseProps = {
            title: field.title,
            isRequired: field.isRequired,
            error: fieldState.error,
          }

          if (field.type === 'input' || field.type === 'textarea') {
            return React.createElement(FormField, {
              ...baseProps,
              type: field.type,
              placeholder: field.placeholder,
              value: controllerField.value ?? '',
              onChange: controllerField.onChange,
            } as FormFieldProps)
          }

          if (field.type === 'card') {
            return React.createElement(FormField, {
              ...baseProps,
              type: 'card',
              value: controllerField.value,
              onChange: controllerField.onChange,
              options: field.options,
            } as FormFieldProps)
          }

          // radio (default)
          return React.createElement(FormField, {
            ...baseProps,
            type: 'radio',
            value: controllerField.value,
            onChange: controllerField.onChange,
            options: (field as RadioFieldConfig<T>).options,
            direction: (field as RadioFieldConfig<T>).direction,
          } as FormFieldProps)
        },
      }),
    ),
  )
}

// Re-export useful types from form-field for convenience
export type { FormFieldType, CardOption, RadioOption } from '../form-field'

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: spacing.xl,
    padding: spacing.md,
  },
})
