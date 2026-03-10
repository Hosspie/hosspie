# 온보딩 리팩토링 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Gluestack/NativeWind/Tamagui 의존성을 완전히 제거하고, organism을 RN StyleSheet + atom 컴포넌트로 재작성하며, 온보딩 페이지를 리뉴얼한다.

**Architecture:** 기존 organism 인터페이스를 유지하면서 내부 구현을 RN StyleSheet 기반 atom 컴포넌트로 교체. 온보딩 페이지에서 className(NativeWind)을 제거하고 StyleSheet으로 전환. 타입을 `@hosspie/utils/types`에서 `@hosspie/types`로 마이그레이션.

**Tech Stack:** React Native StyleSheet, design-system atom 컴포넌트, react-hook-form, expo-router

---

## 중요 참고 사항

### Atom 컴포넌트 작성 규칙
- 파일 확장자: `.ts` (JSX 없음)
- `React.createElement` 패턴 사용
- `Omit<Props, 'style'>` 로 style 주입 방지
- 디자인 토큰만 사용 (하드코딩 금지)
- `StyleSheet.create` 사용

### 현재 사용 가능한 Atom 컴포넌트
`packages/design-system/src/components/` 하위:
- accordion, avatar, badge, button, card, checkbox, dialog, form, image, input, label, popover, progress, radio, scroll-view, select, separator, sheet, slider, spinner, stacks (VStack/HStack), switch, tabs, text

### 더 이상 존재하지 않는 구 컴포넌트
box, v-stack, h-stack, form-control, header(Heading), text-area, action-sheet, icon
→ 이들을 import하는 모든 organism은 현재 빌드 불가 상태

---

## Task 1: BackgroundLayout organism 재작성

**Files:**
- Modify: `packages/design-system/src/organisms/background-layout/index.tsx`

기존 `Box` + `className` → `View` + `StyleSheet` + safe area insets

```tsx
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context'
import { colors } from '../../tokens/colors'

interface BackgroundLayoutProps {
  children: React.ReactNode
  edges?: Edge[]
}

export function BackgroundLayout({ children, edges = ['top', 'bottom'] }: BackgroundLayoutProps) {
  const insets = useSafeAreaInsets()

  const edgePadding: Record<string, number> = {}
  if (edges.includes('top')) edgePadding.paddingTop = insets.top
  if (edges.includes('bottom')) edgePadding.paddingBottom = insets.bottom
  if (edges.includes('left')) edgePadding.paddingLeft = insets.left
  if (edges.includes('right')) edgePadding.paddingRight = insets.right

  return <View style={[styles.container, edgePadding]}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.base,
  },
})
```

---

## Task 2: TextBlock organism 재작성

**Files:**
- Create: `packages/design-system/src/organisms/text-block/index.ts`
- Delete: `packages/design-system/src/organisms/text-container/index.tsx`

기존 `TextContainer` → `TextBlock`. `React.createElement` 패턴, `.ts` 확장자.

```ts
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from '../../components/text'
import { spacing } from '../../tokens/spacing'

interface TextBlockProps {
  title?: string
  description?: string
  align?: 'start' | 'center' | 'end'
}

const ALIGN_MAP = {
  start: 'flex-start' as const,
  center: 'center' as const,
  end: 'flex-end' as const,
}

export function TextBlock({ title, description, align = 'start' }: TextBlockProps) {
  return React.createElement(
    View,
    { style: [styles.container, { alignItems: ALIGN_MAP[align] }] },
    title && React.createElement(Text, { variant: 'h2' }, title),
    description && React.createElement(Text, { variant: 'body' }, description),
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.sm,
  },
})
```

---

## Task 3: ProgressBar organism 재작성

**Files:**
- Modify: `packages/design-system/src/organisms/progress-bar/index.tsx` → rename to `index.ts`

기존 Gluestack Progress → atom Progress + Text

```ts
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Progress } from '../../components/progress'
import { Text } from '../../components/text'
import { spacing } from '../../tokens/spacing'

interface ProgressBarProps {
  value: number
  caption?: string
}

export function ProgressBar({ value, caption }: ProgressBarProps) {
  return React.createElement(
    View,
    { style: styles.container },
    React.createElement(Progress, { value }),
    caption && React.createElement(Text, { variant: 'caption' }, caption),
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.sm,
  },
})
```

---

## Task 4: ButtonGroup organism 재작성

**Files:**
- Create: `packages/design-system/src/organisms/button-group/index.ts`
- Delete: `packages/design-system/src/organisms/buttons/index.tsx`

기존 `Buttons` → `ButtonGroup`. Gluestack Button → atom Button.

```ts
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from '../../components/button'
import { spacing } from '../../tokens/spacing'

export interface ButtonGroupItemProps {
  text: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  disabled?: boolean
}

interface ButtonGroupProps {
  buttons: ButtonGroupItemProps[]
  direction?: 'horizontal' | 'vertical'
  placement?: 'default' | 'bottom'
}

export function ButtonGroup({
  buttons,
  direction = 'vertical',
  placement = 'default',
}: ButtonGroupProps) {
  const isHorizontal = direction === 'horizontal'
  const isBottom = placement === 'bottom'

  return React.createElement(
    View,
    {
      style: [
        styles.container,
        isHorizontal ? styles.horizontal : styles.vertical,
        isBottom && styles.bottom,
      ],
    },
    ...buttons.map((btn, i) =>
      React.createElement(
        View,
        { key: i, style: isHorizontal && styles.flex1 },
        React.createElement(Button, {
          variant: btn.variant || 'primary',
          onPress: btn.onPress,
          disabled: btn.disabled,
          children: btn.text,
        }),
      ),
    ),
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
  bottom: {
    marginTop: 'auto',
  },
  flex1: {
    flex: 1,
  },
})
```

---

## Task 5: FormField organism 재작성

**Files:**
- Create: `packages/design-system/src/organisms/form-field/index.ts`
- Delete: `packages/design-system/src/organisms/form-field/index.tsx`

가장 큰 organism. 4가지 타입(input, textarea, card, radio) 지원.
atom 컴포넌트: Text, Input, Radio, Card, Accordion 활용.

인터페이스는 기존과 유사하게 유지하되 Gluestack 의존성 제거:

```ts
import React, { type PropsWithChildren } from 'react'
import { View, TextInput, Pressable, StyleSheet } from 'react-native'
import { Text } from '../../components/text'
import { Input } from '../../components/input'
import { Radio } from '../../components/radio'
import { Card } from '../../components/card'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/accordion'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'
import { radius } from '../../tokens/radius'
import { sizing } from '../../tokens/sizing'

export type FormFieldType = 'input' | 'textarea' | 'card' | 'radio'

type BaseFormField = {
  title?: string
  placeholder?: string
  isRequired?: boolean
  error?: { message?: string }
}

export type FormFieldProps<T = any> =
  | (BaseFormField & {
      type: 'input' | 'textarea'
      value?: string
      onChange: (value: string) => void
    })
  | (BaseFormField & {
      type: 'card'
      value: T
      onChange: (value: T) => void
      options: CardOption<T>[]
    })
  | (BaseFormField & {
      type: 'radio'
      value: T
      onChange: (value: T) => void
      options: RadioOption<T>[]
      direction?: 'horizontal' | 'vertical'
    })

interface CardOption<T> {
  value: T
  label: string
  description?: string
  expandable?: ExpandableConfig
}

interface RadioOption<T> {
  value: T
  label: string
  expandable?: ExpandableConfig
}

type ExpandableConfig =
  | { type: 'text'; label: string; content: string }
  | { type: 'input'; label: string; placeholder: string; value?: string; onChange: (v: string) => void }

export function FormField<T>(props: FormFieldProps<T>) {
  // React.createElement로 구현
  // 각 type별 렌더링 분기
  // 에러 표시: colors.status.error + Text
  // title: Text variant='body' weight='semibold'
  // input/textarea: Input atom 사용
  // card: Card atom + Radio(선택 표시) + Accordion(expandable)
  // radio: Radio atom + HStack/VStack 배치
}
```

**구현 세부사항:**
- `input` 타입: Text(title) + Input + Text(error)
- `textarea` 타입: Text(title) + Input(multiline) + Text(error)
- `card` 타입: Text(title) + Card들(Pressable + 선택 표시 + Accordion) + Text(error)
- `radio` 타입: Text(title) + Radio들(horizontal/vertical) + Text(error)

---

## Task 6: CardList organism 재작성

**Files:**
- Create: `packages/design-system/src/organisms/card-list/index.ts`
- Delete: `packages/design-system/src/organisms/cards/index.tsx`

```ts
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Card, CardBody } from '../../components/card'
import { Text } from '../../components/text'
import { Badge } from '../../components/badge'
import { spacing } from '../../tokens/spacing'

export interface CardListItem {
  title: string
  description: string
  badges?: { label: string; variant?: 'default' | 'success' | 'error' | 'warning' | 'info' }[]
}

interface CardListProps {
  items: CardListItem[]
}

export function CardList({ items }: CardListProps) {
  // Card atom으로 각 아이템 렌더링
}
```

---

## Task 7: Fab organism 재작성

**Files:**
- Create: `packages/design-system/src/organisms/fab/index.ts`
- Delete: `packages/design-system/src/organisms/fabs/index.tsx`

```ts
import React from 'react'
import { Pressable, Animated, StyleSheet, View } from 'react-native'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { radius } from '../../tokens/radius'

interface FabAction {
  icon: React.ReactNode
  label?: string
  onPress: () => void
}

interface FabProps {
  actions: FabAction[]
  placement?: 'left' | 'right'
}

export function Fab({ actions, placement = 'right' }: FabProps) {
  // Pressable + Animated로 FAB 구현
  // reanimated 의존성 제거 → RN Animated 사용
}
```

---

## Task 8: useModal hook 제거 → 직접 Sheet/Dialog 사용

**Files:**
- Delete: `packages/design-system/src/hooks/modal/index.tsx`
- Delete: `packages/design-system/src/hooks/modal/modal.tsx`
- Delete: `packages/design-system/src/hooks/toast/index.tsx`
- Delete: `packages/design-system/src/hooks/toast/toast.tsx`

온보딩 rooms 페이지에서 `useModal` → `Sheet` atom 직접 사용으로 변경.
Toast는 현재 온보딩에서 사용하지 않으므로 삭제만.

---

## Task 9: 타입 마이그레이션

**Files:**
- Modify: `apps/admin/app/onboarding/_layout.tsx`

`@hosspie/utils/types`의 `IDinnerParty`, `IRoom`, `IGender` →
`@hosspie/types`의 `DinnerPartyType`, `CreateRoomInput`, `Gender` 사용

```tsx
// Before
import { IDinnerParty, IRoom } from '@hosspie/utils/types'
interface IOnboardingFormData {
  dinnerParty: { type: IDinnerParty; description?: string }
  rooms: Record<string, IRoom>
}

// After
import { DinnerPartyType, Gender } from '@hosspie/types'
interface OnboardingFormData {
  name: string
  description: string
  address: string
  phone: string
  email: string
  website?: string
  dinnerPartyType: DinnerPartyType
  dinnerPartyDescription?: string
  rooms: RoomFormData[]
}

interface RoomFormData {
  capacity: number
  gender: Gender
  name: string
  hasBathroom: boolean
}
```

---

## Task 10: 온보딩 레이아웃 재작성

**Files:**
- Modify: `apps/admin/app/onboarding/_layout.tsx`

```tsx
import { BackgroundLayout } from '@hosspie/design-system/organisms/background-layout'
import { ProgressBar } from '@hosspie/design-system/organisms/progress-bar'
import { FormProvider } from '@hosspie/services/form'
import { DinnerPartyType, Gender } from '@hosspie/types'
import { Stack, usePathname } from 'expo-router'
import React from 'react'

// ... 새 타입 + 레이아웃
```

---

## Task 11: description 페이지 재작성

**Files:**
- Modify: `apps/admin/app/onboarding/description/index.tsx`

`Box className` → `View style`, `FormFieldOrganism` → `FormField`,
`Buttons` → `ButtonGroup`, `TextContainer` → `TextBlock`

---

## Task 12: information 페이지 재작성

**Files:**
- Modify: `apps/admin/app/onboarding/information/index.tsx`

동일 패턴. `FormData` 타입 버그도 수정 (`IOnboardingFormData`로).

---

## Task 13: dinner-party 페이지 재작성

**Files:**
- Modify: `apps/admin/app/onboarding/dinner-party/index.tsx`

카드 선택 UI를 새 `FormField` type='card'로 교체.

---

## Task 14: rooms 페이지 재작성

**Files:**
- Modify: `apps/admin/app/onboarding/rooms/index.tsx`

`useModal` → `Sheet` atom 직접 사용.
`FabsOrganism` → `Fab`.
`CardsOrganism` → `CardList`.
`IGender`, `IRoom` → `Gender`, `RoomFormData`.

---

## Task 15: 루트 레이아웃에서 GluestackProvider 제거

**Files:**
- Modify: `apps/admin/app/_layout.tsx`

```tsx
// Before
import '../global.css'
import { GluestackProvider } from '@hosspie/design-system/providers/gluestack'

// After
// global.css import 제거
// GluestackProvider 제거, children만 렌더링
```

---

## Task 16: Tamagui 제거 (design-system)

**Files:**
- Delete: `packages/design-system/src/config/tamagui.config.ts`
- Delete: `packages/design-system/src/config/tamagui.config.web.ts`
- Delete: `packages/design-system/src/providers/tamagui/index.tsx`
- Modify: `packages/design-system/package.json` - Tamagui 의존성 제거, exports에서 config 제거
- Modify: `packages/design-system/.storybook/main.mts` - Tamagui 관련 설정 제거
- Modify: `packages/design-system/.storybook/preview.tsx` - Tamagui provider 제거 (이미 제거됨)

---

## Task 17: NativeWind/Gluestack 의존성 제거 (admin)

**Files:**
- Modify: `apps/admin/package.json` - 23 Gluestack + NativeWind + Tailwind 패키지 제거
- Modify: `apps/admin/babel.config.js` - nativewind preset 제거
- Modify: `apps/admin/metro.config.js` - withNativeWind 제거
- Delete: `apps/admin/global.css`
- Delete: `apps/admin/nativewind-env.d.ts`
- Modify: `apps/admin/tsconfig.json` - nativewind-env.d.ts 참조 제거

---

## Task 18: 불필요한 organism/hook 디렉토리 정리

**Files:**
- Delete: `packages/design-system/src/organisms/form-fields/index.tsx` (FormField로 통합)
- Delete: `packages/design-system/src/organisms/image-container/index.tsx` (현재 미사용)
- Delete: `packages/design-system/src/hooks/modal/` 디렉토리
- Delete: `packages/design-system/src/hooks/toast/` 디렉토리
- Delete: `packages/design-system/src/providers/safearea/` (BackgroundLayout에 통합)

---

## Task 19: pnpm install + 빌드 검증

**Run:**
```bash
cd /Users/kmjnnhyk/DEV/hosspie
pnpm install
cd packages/design-system && pnpm storybook:build
```

빌드 에러 수정.

---

## Task 20: 온보딩 페이지별 Storybook 스토리 생성

**Files:**
- Create: `packages/design-system/src/organisms/form-field/FormField.stories.tsx`
- Create: `packages/design-system/src/organisms/button-group/ButtonGroup.stories.tsx`
- Create: `packages/design-system/src/organisms/text-block/TextBlock.stories.tsx`
- Create: `packages/design-system/src/organisms/progress-bar/ProgressBar.stories.tsx`
- Create: `packages/design-system/src/organisms/card-list/CardList.stories.tsx`
- Create: `packages/design-system/src/organisms/fab/Fab.stories.tsx`

Storybook main.mts의 stories 패턴에 organisms 추가 필요:
```ts
stories: [
  '../src/components/**/*.stories.@(ts|tsx)',
  '../src/organisms/**/*.stories.@(ts|tsx)',
]
```

---

## Task 21: 최종 검증 + 커밋

**Run:**
```bash
pnpm install
cd packages/design-system && pnpm storybook:build
```

모든 에러 수정 후 커밋.
