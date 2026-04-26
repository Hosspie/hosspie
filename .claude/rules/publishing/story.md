---
paths:
  - "packages/design-system/**/*.stories.tsx"
---

# Storybook 스토리 규칙

## 파일 위치

| 종류 | 위치 |
|---|---|
| 페이지 스토리 | `pages/{feature}/{ScreenName}.stories.tsx` |
| 컴포넌트 스토리 | `components/{name}/{Name}.stories.tsx` |

## 페이지 스토리

- title 형식: `'Admin Pages/{Feature}/{ScreenName}'`
- **MobileFrame 데코레이터 필수** (iPhone 프레임 시뮬레이션).

```tsx
export default {
  title: 'Admin Pages/Onboarding/Welcome',
  decorators: [MobileFrameDecorator],
} satisfies Meta;
```

- `Default` + `WithFilledData` 두 스토리 권장.
- organism + atom 조합으로 인터랙션 구현 (`useState`, `storybook/test` 의 `fn()`).

## 컴포넌트 스토리 (Atom)

- 스토리 1개(`Default`). 변형은 Controls 패널로 조작.
- `argTypes` 로 select/boolean 컨트롤 명시.
- 함수 prop 엔 `storybook/test` 의 `fn()`.

```tsx
export default {
  title: 'Components/Badge',
  argTypes: {
    status: { control: 'select', options: ['available', 'occupied'] },
    onPress: { action: true },
  },
} satisfies Meta<BadgeProps>;

export const Default: Story = {
  args: { status: 'available', label: '예약 가능', onPress: fn() },
};
```

## RN 사용 제한

스토리 파일 내 RN 직접 사용은 레이아웃 전용 `View` / `ScrollView` 만 허용.
