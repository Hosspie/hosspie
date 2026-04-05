---
name: publisher
description: "Hosspie 디자인 시스템(packages/design-system) 전담 퍼블리셔 스킬. 컴포넌트(atom) 생성/수정, organism 생성/수정, 페이지 스토리 작성, Storybook 스토리, 디자인 토큰 추가/수정, 스타일링 작업 시 사용. UI 디자인 가이드(미학, 디자인 사고)도 포함. 트리거 키워드: 디자인 시스템, 컴포넌트, organism, atom, page story, Storybook, 디자인 토큰, 스타일링, Button/Input/Card/Text 등 UI 컴포넌트, FormField/ButtonGroup/BackgroundLayout 등 organism, pages/ 디렉토리 작업, 디자인 가이드, UI 미학, 프론트엔드 디자인. packages/design-system/src/ 하위 파일 작업 시 자동 적용."
---

# Publisher 스킬 (디자이너 + 퍼블리셔)

design-system 패키지의 components, organisms, pages 생성/관리 전담.

## Atomic Design 계층

```
components/  → Atom    (단일 UI 요소: Button, Input, Text, Badge, Card 등)
organisms/   → Organism (Atom 조합: FormField, ButtonGroup, ProgressBar 등)
pages/       → Page    (Storybook 페이지 스토리 = Frontend Developer용 UI 설계도)
```

### 판단 기준

| Atom (components/) | Organism (organisms/) | Page (pages/) |
|---|---|---|
| 단일 역할, 독립적 | 여러 Atom 조합 | 전체 화면 목업 |
| Button, Input, Text, Badge | FormField, ButtonGroup, TextBlock | Onboarding/Information |
| RN 프리미티브 래핑 가능 | Atom만 import | Organism + Atom 조합 |

## 컴포넌트(Atom) 작성

### 파일 구조

```
components/{name}/
├── index.ts           # 컴포넌트 구현 (.ts, JSX 아님)
└── {Name}.stories.tsx  # Storybook 스토리 (.tsx)
```

### 핵심 규칙

1. **style 주입 금지** - `Omit<ViewProps, 'style'>` 패턴 사용
2. **디자인 토큰만 사용** - 하드코딩 절대 금지, 없으면 토큰 신규 생성
3. **다크 모드 전용** - `colors.ts`의 시맨틱 토큰 사용
4. **React.createElement** - `.ts` 확장자 유지, JSX 금지
5. **StyleSheet.create()** - 컴포넌트 외부에 정의

### Atom 템플릿

```ts
import React from 'react'
import { View, StyleSheet, type ViewProps } from 'react-native'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { typography } from '../../tokens/typography'
import { radius } from '../../tokens/radius'

export interface MyComponentProps extends Omit<ViewProps, 'style'> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export function MyComponent({
  variant = 'primary',
  size = 'md',
  ...props
}: MyComponentProps) {
  return React.createElement(
    View,
    {
      ...props,
      style: [styles.base, sizeStyles[size], variantStyles[variant]],
    },
    // children
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    padding: spacing.md,
  },
})

const sizeStyles = StyleSheet.create({
  sm: { padding: spacing.sm },
  md: { padding: spacing.md },
  lg: { padding: spacing.lg },
})

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.brand.primary },
  secondary: { backgroundColor: colors.neutral[300] },
})
```

### 조건부 Pressable 패턴

`onPress`가 optional일 때: 있으면 Pressable, 없으면 View.

```ts
export function Badge({ label, onPress, ...props }: BadgeProps) {
  const content = React.createElement(Text, { style: styles.text }, label)

  if (onPress) {
    return React.createElement(Pressable, { ...props, onPress, style: styles.base }, content)
  }
  return React.createElement(View, { ...props, style: styles.base }, content)
}
```

## Organism 작성

### 파일 구조

```
organisms/{name}/
└── index.ts  # organism 구현
```

### 핵심 규칙

1. **Atom만 import** - `react-native` 프리미티브 직접 사용 금지 (View/Pressable/Text는 레이아웃용으로만 허용)
2. **Props interface 필수** - 명확한 타입 정의
3. **JSDoc 한글 주석** - 용도 설명

```ts
// ✅ Atom import
import { Button } from '../../components/button'
import { Text } from '../../components/text'
import { Card } from '../../components/card'

// ❌ RN 프리미티브로 UI 구성 금지
import { Pressable, Text as RNText } from 'react-native'
```

### Organism 템플릿

```ts
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from '../../components/button'
import { Text } from '../../components/text'
import { spacing } from '../../tokens/spacing'

export interface MyOrganismProps {
  title: string
  onAction: () => void
}

/**
 * 제목 + 액션 버튼 조합.
 * 특정 상황에서 사용하는 organism.
 */
export function MyOrganism({ title, onAction }: MyOrganismProps) {
  return React.createElement(
    View,
    { style: styles.container },
    React.createElement(Text, { variant: 'h2' }, title),
    React.createElement(Button, { title: '액션', onPress: onAction }),
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
})
```

## Page 작성 (Storybook 페이지 스토리)

Pages = Frontend Developer가 참고하는 **UI 설계도**. 실제 앱 코드가 아님.

### 파일 구조

```
pages/{feature}/
├── {ScreenName}.stories.tsx  # 각 화면별 페이지 스토리
└── FullFlow.stories.tsx      # (선택) 전체 플로우 스토리
```

### Page 스토리 템플릿

```tsx
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { View, ScrollView } from 'react-native'
import { MobileFrame } from '../../../.storybook/decorators/MobileFrame'
import { ProgressBar } from '../../organisms/progress-bar'
import { TextBlock } from '../../organisms/text-block'
import { FormField } from '../../organisms/form-field'
import { ButtonGroup } from '../../organisms/button-group'

const MyPage = () => {
  const [value, setValue] = useState('')

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar value={50} max={100} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 8 }}>
        <TextBlock title="제목" description="설명" />
        <FormField type="input" title="필드" value={value} onChange={setValue} />
      </ScrollView>
      <ButtonGroup
        placement="bottom"
        buttons={[
          { text: '이전', onPress: fn(), variant: 'outline' },
          { text: '다음', onPress: fn(), variant: 'primary' },
        ]}
      />
    </View>
  )
}

const meta: Meta = {
  title: 'Admin Pages/{Feature}/{ScreenName}',
  component: MyPage,
  decorators: [MobileFrame],  // 모바일 프레임 필수
}

export default meta
type Story = StoryObj

export const Default: Story = {}

export const WithFilledData: Story = {
  render: () => { /* 데이터 채워진 상태 */ },
}
```

### Page 스토리 규칙

- **MobileFrame 데코레이터 필수** - iPhone 프레임으로 감싸기
- **title 형식**: `'Admin Pages/{Feature}/{ScreenName}'`
- **Default + WithFilledData** 두 가지 스토리 권장
- **상태 관리**: useState로 인터랙션 구현
- **organism/atom만 사용**: RN 프리미티브는 레이아웃(View, ScrollView)용만 허용

## 디자인 토큰

위치: `packages/design-system/src/tokens/`

| 파일 | 내용 | 예시 |
|---|---|---|
| `colors.ts` | 시맨틱 컬러 (다크 모드) | `colors.brand.primary`, `colors.text.secondary` |
| `spacing.ts` | 4px 그리드 간격 | `xs:4, sm:8, md:12, lg:16, xl:24, 2xl:32, 3xl:48` |
| `typography.ts` | 폰트 크기/두께/행간 | `sizes.md:16`, `weights.semibold:'600'` |
| `radius.ts` | 모서리 반경 | `sm:8, md:12, lg:16, xl:20, full:9999` |
| `sizing.ts` | 컴포넌트 고정 크기 | `inputHeight:44`, `borderWidth:1` |
| `shadows.ts` | 그림자/elevation | `shadows.card`, `shadows.glow.brand` |

토큰에 필요한 값이 없으면 **토큰 파일에 추가** 후 사용.

## Storybook

상세 내용: `references/storybook.md` 참조

### 컴포넌트 스토리 규칙

- **스토리 1개** - Default만. 모든 변형은 Controls 패널로 조작
- **fn() 사용** - 함수 prop에 `storybook/test`의 `fn()` 사용
- **argTypes 설정** - select/boolean 등 적절한 컨트롤 타입

```tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { Button } from '.'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: { title: '버튼', variant: 'primary', size: 'md', onPress: fn() },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'outline', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    onPress: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {}
```

### 검증 워크플로우

```bash
pnpm storybook:web  # localhost:6006에서 확인
```

Playwright MCP로 스크린샷 캡처 후 디자인 검증 가능.

## 디자인 가이드

차별화된 UI를 만들기 위한 디자인 사고방식과 미학 가이드라인: `references/design-guide.md` 참조

새로운 컴포넌트나 페이지 디자인 시 일반적인 AI 스타일을 피하고 대담한 미학적 방향을 설정하는 데 활용.

## 스타일링 규칙

상세 내용: `references/styling-rules.md` 참조

핵심 요약:
- `StyleSheet.create()` - 컴포넌트 외부에 정의
- 디자인 토큰만 사용 - `@hosspie/design-system/tokens/` import
- variant 패턴 - Props + 조건부 스타일 배열
- 하드코딩 금지 - 숫자, 색상 직접 사용 불가

## Export 규칙

package.json exports:

```json
{
  "./components/*": "./src/components/*",
  "./organisms/*": "./src/organisms/*",
  "./tokens/*": "./src/tokens/*"
}
```

사용처에서 import:

```ts
import { Button } from '@hosspie/design-system/components/button'
import { FormField } from '@hosspie/design-system/organisms/form-field'
import { colors } from '@hosspie/design-system/tokens/colors'
```

## 접근성

- **최소 터치 영역 44x44px** - `sizing.inputHeight` 참조
- **색상 대비** - `colors.text.primary`(#FFF) / `colors.text.secondary`(#AAA) 사용
- **accessibilityRole** - Pressable에 적절한 role 지정
- **accessibilityState** - selected, disabled 등 상태 전달

## 체크리스트

작업 완료 시 확인:

- [ ] `Omit<Props, 'style'>` 로 style 주입 차단
- [ ] 모든 수치가 디자인 토큰 참조 (하드코딩 없음)
- [ ] 다크 모드 색상 (`colors.ts`) 사용
- [ ] `.ts` 확장자 + `React.createElement` (스토리만 `.tsx`)
- [ ] Atom 범위 초과 시 organisms/ 이동
- [ ] 스토리 작성 완료
- [ ] 접근성 속성 설정
