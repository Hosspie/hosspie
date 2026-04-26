---
paths:
  - "packages/design-system/src/components/**/*.{ts,tsx}"
---

# Atom 규칙

`packages/design-system/src/components/` 의 단일 UI 컴포넌트(Atom) 작성 규칙.

## Props — 외부 style 주입 금지

```ts
type ButtonProps = Omit<ViewProps, 'style'> & {
  label: string;
  onPress?: () => void;
};
```

외부에서 `style` prop 을 받지 않는다. 레이아웃 배치는 사용처(organism/screen) 의 책임.

## 디자인 토큰 전용

하드코딩 hex(`'#fff'`), RGBA 리터럴, RN 색상 키워드(`'white'`, `'black'`) 사용 금지.
필요한 값이 없으면 `tokens/` 에 먼저 추가 후 사용.

**색상 예외 (토큰 의무 면제)**:
- `'transparent'`
- `react-native-svg` 프리미티브(`<Path>`, `<Circle>` 등)의 `fill`/`stroke`
- `.svg` 자산 파일 내부 색상

## 다크 모드 전용

`tokens/colors.ts` 의 시맨틱 토큰만 사용. 라이트 모드 분기 없음.

## 파일 확장자 + JSX 금지

- atom 구현 파일은 `.ts` 확장자 + `React.createElement` 사용. **JSX 금지**.
- `.stories.tsx` 만 예외 (Storybook은 JSX 허용).

```ts
// ✅ atom index.ts
export const Badge = (props: BadgeProps) =>
  React.createElement(View, { style: styles.container },
    React.createElement(Text, { style: styles.label }, props.label)
  );
```

## StyleSheet 위치

`StyleSheet.create()` 는 컴포넌트 **외부** (파일 하단) 에 정의.

```ts
export const Badge = (props: BadgeProps) => React.createElement(...);

const styles = StyleSheet.create({
  container: { backgroundColor: colors.surface.card, ... },
});
```

## onPress 분기

`onPress` 가 optional 이면:
- 있을 때 → `Pressable`
- 없을 때 → `View`

```ts
const Root = onPress
  ? React.createElement(Pressable, { onPress, ... })
  : React.createElement(View, ...);
```

## 파일 구조

```
components/{name}/
  index.ts          # 구현
  {Name}.stories.tsx # 스토리
```

## 접근성

- 최소 터치 영역 44×44 (`sizing.inputHeight`).
- `accessibilityRole` / `accessibilityState` 적절히 설정.

## JSDoc

컴포넌트 export 함수 + 토큰 신규 추가 시 한글 설명 + `@example` 필수.

```ts
/**
 * 객실 상태를 나타내는 뱃지.
 * @example
 * React.createElement(Badge, { status: 'available', label: '예약 가능' })
 */
```
