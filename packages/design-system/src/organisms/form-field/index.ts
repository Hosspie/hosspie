import React from 'react'
import {
  View,
  Pressable,
  Text as RNText,
  StyleSheet,
} from 'react-native'
import { Text } from '../../components/text'
import { Input } from '../../components/input'
import { Radio } from '../../components/radio'
import { Card } from '../../components/card'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../components/accordion'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'
import { sizing } from '../../tokens/sizing'
import { radius } from '../../tokens/radius'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FormFieldType = 'input' | 'textarea' | 'card' | 'radio'

export type ExpandableConfig =
  | { type: 'text'; label: string; content: string }
  | {
      type: 'input'
      label: string
      placeholder: string
      value?: string
      onChange: (v: string) => void
    }

export interface CardOption<T> {
  value: T
  label: string
  description?: string
  expandable?: ExpandableConfig
}

export interface RadioOption<T> {
  value: T
  label: string
  expandable?: ExpandableConfig
}

type BaseFormField = {
  title?: string
  placeholder?: string
  isRequired?: boolean
  error?: { message?: string }
}

type InputFieldProps = BaseFormField & {
  type: 'input'
  value?: string
  onChange: (value: string) => void
}

type TextareaFieldProps = BaseFormField & {
  type: 'textarea'
  value?: string
  onChange: (value: string) => void
}

type CardFieldProps<T> = BaseFormField & {
  type: 'card'
  value?: T
  onChange: (value: T) => void
  options: CardOption<T>[]
}

type RadioFieldProps<T> = BaseFormField & {
  type: 'radio'
  value?: T
  onChange: (value: T) => void
  options: RadioOption<T>[]
  direction?: 'horizontal' | 'vertical'
}

export type FormFieldProps<T = any> =
  | InputFieldProps
  | TextareaFieldProps
  | CardFieldProps<T>
  | RadioFieldProps<T>

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isEqual<T>(a: T, b: T): boolean {
  if (a === b) return true
  if (typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a) === JSON.stringify(b)
  }
  return false
}

/**
 * 옵션의 키 기준으로 부분 일치 검사.
 * 현재 value가 option.value의 모든 키를 동일한 값으로 포함하면 선택된 것으로 판정.
 * (expandable input이 value에 추가 키를 넣어도 선택 상태 유지)
 */
function isPartialMatch<T>(value: T, optionValue: T): boolean {
  if (value === optionValue) return true
  if (
    typeof optionValue === 'object' &&
    typeof value === 'object' &&
    optionValue !== null &&
    value !== null
  ) {
    return Object.keys(optionValue as object).every(
      (key) => (value as any)[key] === (optionValue as any)[key],
    )
  }
  return isEqual(value, optionValue)
}

// ---------------------------------------------------------------------------
// Shared sub-renderers
// ---------------------------------------------------------------------------

/**
 * 제목 행: 라벨 + 필수 표시 (*)
 */
function renderTitle(title: string | undefined, isRequired: boolean | undefined) {
  if (!title) return null
  return React.createElement(
    View,
    { style: styles.titleRow },
    React.createElement(Text, { variant: 'body', weight: 'semibold' }, title),
    isRequired
      ? React.createElement(
          RNText,
          { style: styles.asterisk },
          ' *',
        )
      : null,
  )
}

/**
 * 에러 메시지 (항상 영역 확보하여 높이 안정성 유지)
 */
function renderError(error: { message?: string } | undefined) {
  return React.createElement(
    View,
    { style: styles.errorContainer },
    error?.message
      ? React.createElement(
          RNText,
          { style: styles.errorText },
          error.message,
        )
      : null,
  )
}

/**
 * 확장 가능한 섹션 (Accordion) 렌더링
 */
function renderExpandable(
  expandable: ExpandableConfig,
  itemKey: string,
) {
  const content =
    expandable.type === 'text'
      ? React.createElement(
          Text,
          { variant: 'caption' },
          expandable.content,
        )
      : React.createElement(Input, {
          placeholder: expandable.placeholder,
          value: expandable.value,
          onChangeText: expandable.onChange,
        })

  return React.createElement(
    Accordion,
    { type: 'single' as const },
    React.createElement(
      AccordionItem,
      { value: itemKey },
      React.createElement(AccordionTrigger, null, expandable.label),
      React.createElement(AccordionContent, null, content),
    ),
  )
}

// ---------------------------------------------------------------------------
// Input field
// ---------------------------------------------------------------------------

function renderInputField(props: InputFieldProps) {
  const hasError = !!props.error?.message

  return React.createElement(
    View,
    { style: styles.wrapper },
    renderTitle(props.title, props.isRequired),
    React.createElement(
      View,
      { style: [styles.inputBorderWrapper, hasError && styles.inputErrorBorderActive] },
      React.createElement(Input, {
        placeholder: props.placeholder,
        value: props.value,
        onChangeText: props.onChange,
      }),
    ),
    renderError(props.error),
  )
}

// ---------------------------------------------------------------------------
// Textarea field
// ---------------------------------------------------------------------------

function renderTextareaField(props: TextareaFieldProps) {
  const hasError = !!props.error?.message

  return React.createElement(
    View,
    { style: styles.wrapper },
    renderTitle(props.title, props.isRequired),
    React.createElement(
      View,
      { style: [styles.inputBorderWrapper, hasError && styles.inputErrorBorderActive] },
      React.createElement(Input, {
        placeholder: props.placeholder,
        value: props.value,
        onChangeText: props.onChange,
        multiline: true,
        numberOfLines: 4,
      }),
    ),
    renderError(props.error),
  )
}

// ---------------------------------------------------------------------------
// Card field
// ---------------------------------------------------------------------------

function renderCardField<T>(props: CardFieldProps<T>) {
  return React.createElement(
    View,
    { style: styles.wrapper },
    renderTitle(props.title, props.isRequired),
    React.createElement(
      View,
      { style: styles.optionsVertical },
      ...props.options.map((option, index) => {
        const selected = isPartialMatch(props.value, option.value)
        return React.createElement(
          Pressable,
          {
            key: index,
            onPress: () => props.onChange(option.value),
            accessibilityRole: 'button' as const,
            accessibilityState: { selected },
          },
          // 카드를 감싸는 View (항상 border 공간 확보, 선택 시 색상 변경)
          React.createElement(
            View,
            { style: [styles.cardWrapper, selected && styles.cardWrapperSelected] },
            React.createElement(
              Card,
              { padding: 'md' },
              // 카드 내부 레이아웃: 좌측 내용 + 우측 선택 표시
              React.createElement(
                View,
                { style: styles.cardInner },
                // 좌측: label + description
                React.createElement(
                  View,
                  { style: styles.cardContent },
                  React.createElement(
                    Text,
                    { variant: 'body', weight: 'semibold' },
                    option.label,
                  ),
                  option.description
                    ? React.createElement(
                        RNText,
                        { style: styles.cardDescriptionText },
                        option.description,
                      )
                    : null,
                ),
                // 우측: 선택 표시 (filled circle)
                React.createElement(
                  View,
                  {
                    style: [
                      styles.selectionIndicator,
                      selected && styles.selectionIndicatorSelected,
                    ],
                  },
                  selected
                    ? React.createElement(View, {
                        style: styles.selectionDot,
                      })
                    : null,
                ),
              ),
              // 확장 가능한 섹션 (선택 시만 표시)
              option.expandable && selected
                ? React.createElement(
                    View,
                    { style: styles.expandableContainer },
                    renderExpandable(option.expandable, `card-${index}`),
                  )
                : null,
            ),
          ),
        )
      }),
    ),
    renderError(props.error),
  )
}

// ---------------------------------------------------------------------------
// Radio field
// ---------------------------------------------------------------------------

function renderRadioField<T>(props: RadioFieldProps<T>) {
  const isHorizontal = props.direction === 'horizontal'

  return React.createElement(
    View,
    { style: styles.wrapper },
    renderTitle(props.title, props.isRequired),
    // 라디오 옵션 목록
    React.createElement(
      View,
      {
        style: isHorizontal
          ? styles.optionsHorizontal
          : styles.optionsVertical,
      },
      ...props.options.map((option, index) => {
        const selected = isEqual(props.value, option.value)
        return React.createElement(
          View,
          { key: index, style: styles.radioOptionWrapper },
          // 라디오 + 라벨 행
          React.createElement(
            Pressable,
            {
              onPress: () => props.onChange(option.value),
              style: styles.radioRow,
              accessibilityRole: 'radio' as const,
              accessibilityState: { selected },
            },
            React.createElement(Radio, {
              selected,
              onSelect: () => props.onChange(option.value),
            }),
            React.createElement(
              View,
              { style: styles.radioLabelWrapper },
              React.createElement(
                Text,
                { variant: 'body' },
                option.label,
              ),
            ),
          ),
          // 확장 가능한 섹션 (선택 시만 표시)
          option.expandable && selected
            ? React.createElement(
                View,
                { style: styles.expandableContainer },
                renderExpandable(option.expandable, `radio-${index}`),
              )
            : null,
        )
      }),
    ),
    renderError(props.error),
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * FormField organism.
 * input / textarea / card / radio 4종 폼 필드를 통합 렌더링한다.
 */
export function FormField<T = any>(props: FormFieldProps<T>) {
  switch (props.type) {
    case 'input':
      return renderInputField(props)
    case 'textarea':
      return renderTextareaField(props)
    case 'card':
      return renderCardField(props)
    case 'radio':
      return renderRadioField(props)
    default:
      return null
  }
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  asterisk: {
    color: colors.status.error,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
  },
  errorContainer: {
    minHeight: typography.sizes.xs * typography.lineHeights.normal,
  },
  errorText: {
    color: colors.status.errorText,
    fontSize: typography.sizes.xs,
  },

  // Input border wrapper (항상 border 공간 확보, 에러 시 색상 변경)
  inputBorderWrapper: {
    borderWidth: sizing.borderWidth * 2,
    borderColor: 'transparent',
    borderRadius: radius.md,
  },
  inputErrorBorderActive: {
    borderColor: colors.border.error,
  },

  // Card field (항상 border 공간 확보, 선택 시 색상 변경)
  cardWrapper: {
    borderRadius: radius.lg,
    borderWidth: sizing.borderWidth * 2,
    borderColor: 'transparent',
  },
  cardWrapperSelected: {
    borderColor: colors.brand.primary,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
    marginRight: spacing.md,
    gap: spacing.xs,
  },
  cardDescriptionText: {
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
    lineHeight: typography.sizes.caption * typography.lineHeights.normal,
  },
  selectionIndicator: {
    width: sizing.radioSize,
    height: sizing.radioSize,
    borderRadius: sizing.radioSize / 2,
    borderWidth: sizing.borderWidth * 2,
    borderColor: colors.neutral[500],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  selectionIndicatorSelected: {
    borderColor: colors.brand.primary,
  },
  selectionDot: {
    width: sizing.radioSize * 0.5,
    height: sizing.radioSize * 0.5,
    borderRadius: sizing.radioSize * 0.25,
    backgroundColor: colors.brand.primary,
  },

  // Radio field
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabelWrapper: {
    marginLeft: spacing.sm,
  },
  radioOptionWrapper: {
    gap: spacing.xs,
  },

  // Options layout
  optionsVertical: {
    gap: spacing.md,
  },
  optionsHorizontal: {
    flexDirection: 'row',
    gap: spacing.xl,
    flexWrap: 'wrap',
  },

  // Expandable
  expandableContainer: {
    marginTop: spacing.sm,
  },
})
