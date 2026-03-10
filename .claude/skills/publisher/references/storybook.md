# Storybook 설정 및 워크플로우

## 기술 스택

- **프레임워크**: `@storybook/react-vite` (Vite 기반)
- **RN 호환**: `react-native-web` alias로 웹 렌더링
- **버전**: Storybook 10.x

## 설정 파일

### .storybook/main.mts

```ts
export default {
  stories: [
    '../src/components/**/*.@(mdx|stories.@(ts|tsx))',
    '../src/organisms/**/*.@(mdx|stories.@(ts|tsx))',
    '../src/pages/**/*.@(mdx|stories.@(ts|tsx))',
  ],
  addons: ['@storybook/addon-docs'],
  viteFinal: async (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native': 'react-native-web',
    }
    config.resolve.extensions = ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js']
    return config
  },
  typescript: { reactDocgen: 'react-docgen' },
  framework: { name: '@storybook/react-vite', options: {} },
  docs: { autodocs: true },
}
```

### .storybook/preview.tsx

전역 다크 모드 배경 + flex 레이아웃 설정. 모든 스토리에 자동 적용.

```tsx
const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
  },
  decorators: [
    (Story) => (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
        minHeight: '100vh',
        backgroundColor: '#080808',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <Story />
      </div>
    ),
  ],
}
```

### .storybook/decorators/MobileFrame.tsx

iPhone 프레임 데코레이터. Page 스토리에서 사용.
- 375x812 (iPhone X 기준)
- 상단 노치, 하단 홈 인디케이터 포함
- 콘텐츠 영역: padding 24px, overflow-y auto

## 스토리 파일 컨벤션

### 위치 및 네이밍

| 계층 | 위치 | 파일명 | title |
|---|---|---|---|
| Component (Atom) | `components/{name}/` | `{Name}.stories.tsx` | `'Components/{Name}'` |
| Organism | `organisms/{name}/` | `{Name}.stories.tsx` | `'Organisms/{Name}'` |
| Page | `pages/{feature}/` | `{ScreenName}.stories.tsx` | `'Admin Pages/{Feature}/{ScreenName}'` |

### Component 스토리 (Atom)

**원칙**: 스토리 1개(Default). 모든 변형은 Controls 패널로 조작.

```tsx
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { Button } from '.'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: {
    title: '버튼',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    onPress: fn(),
  },
  argTypes: {
    title: { control: 'text' },
    variant: { control: 'select', options: ['primary', 'secondary', 'outline', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onPress: { table: { disable: true } },  // Controls에서 숨김
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {}
```

### 상태 관리가 필요한 컴포넌트

Switch, Checkbox 등 controlled 컴포넌트는 래퍼 사용.

```tsx
import React, { useState } from 'react'

function SwitchWithState(props: React.ComponentProps<typeof Switch>) {
  const [value, setValue] = useState(false)
  return (
    <Switch
      {...props}
      value={value}
      onValueChange={(v) => { setValue(v); props.onValueChange?.(v) }}
    />
  )
}

export const Default: Story = {
  render: (args) => <SwitchWithState {...args} />,
}
```

### Page 스토리

**역할**: Frontend Developer가 참고하는 UI 설계도. 실제 앱 코드가 아님.

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

const InformationPage = () => {
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar value={50} max={100} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 8 }}>
        <TextBlock
          title={`연락처 정보를\n입력해 주세요`}
          description="고객들이 쉽게 연락할 수 있도록 정보를 입력해주세요"
        />
        <FormField type="input" title="주소" value={address} onChange={setAddress} isRequired />
        <FormField type="input" title="연락처" value={phone} onChange={setPhone} isRequired />
      </ScrollView>
      <ButtonGroup
        placement="bottom"
        buttons={[
          { text: '이전', onPress: fn(), variant: 'outline' },
          { text: '다음 단계', onPress: fn(), variant: 'primary' },
        ]}
      />
    </View>
  )
}

const meta: Meta = {
  title: 'Admin Pages/Onboarding/Information',
  component: InformationPage,
  decorators: [MobileFrame],  // 필수: 모바일 프레임
}

export default meta
type Story = StoryObj

export const Default: Story = {}

export const WithFilledData: Story = {
  render: () => {
    const FilledPage = () => {
      const [address, setAddress] = useState('서울시 마포구...')
      // ... 데이터 채워진 상태
      return ( /* ... */ )
    }
    return <FilledPage />
  },
}
```

#### Page 스토리 규칙

- **MobileFrame 데코레이터 필수** - `decorators: [MobileFrame]`
- **title**: `'Admin Pages/{Feature}/{ScreenName}'`
- **Default + WithFilledData** 스토리 권장
- **useState로 인터랙션 구현** - 실제 상태 변화 시뮬레이션
- **organism/atom만 사용** - View/ScrollView는 레이아웃용 허용
- **fn()으로 네비게이션 대체** - `onPress: fn()` (실제 라우팅 없음)

## 명령어

```bash
# Storybook 개발 서버 시작 (localhost:6006)
pnpm storybook:web

# Storybook 빌드
pnpm storybook:build
```

## 디자인 검증 워크플로우

Storybook + Playwright MCP를 통한 자율 검증:

1. `pnpm storybook:web` 실행
2. Playwright MCP로 `localhost:6006` 접속
3. 각 Story 스크린샷 캡처
4. 디자인 확인 후 코드 수정
5. 반복

### 검증 체크포인트

- [ ] 다크 모드 배경에서 텍스트 가독성
- [ ] 컴포넌트 간격/정렬 일관성
- [ ] 브랜드 컬러(#FF6B35) 올바른 적용
- [ ] 비활성 상태(opacity 0.5) 시각적 확인
- [ ] Page 스토리의 모바일 프레임 내 레이아웃

## argTypes 컨트롤 타입 가이드

| Prop 타입 | argTypes 설정 |
|---|---|
| string union | `{ control: 'select', options: ['a', 'b', 'c'] }` |
| boolean | `{ control: 'boolean' }` |
| string | `{ control: 'text' }` |
| number | `{ control: 'number' }` |
| 함수 (onPress 등) | `{ table: { disable: true } }` + args에 `fn()` |
| children (ReactNode) | `{ control: 'text' }` |

## fn() 사용

`storybook/test`에서 import. Actions 탭에서 호출 확인 가능.

```tsx
import { fn } from 'storybook/test'

args: {
  onPress: fn(),
  onValueChange: fn(),
}
```
