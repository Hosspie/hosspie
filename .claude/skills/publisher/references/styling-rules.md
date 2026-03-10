# 스타일링 규칙 (RN StyleSheet + 디자인 토큰)

## 기본 원칙

1. `StyleSheet.create()` 사용 - 컴포넌트 외부에 정의
2. 디자인 토큰만 사용 - `@hosspie/design-system/tokens/` import
3. 하드코딩 금지 - 숫자값, 색상값 직접 사용 불가
4. inline style 금지 - `style={{ }}` 대신 StyleSheet 사용

## StyleSheet.create() 패턴

### 기본 스타일

```ts
import { StyleSheet } from 'react-native'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { radius } from '../../tokens/radius'

// ✅ 컴포넌트 외부에 정의 (한 번만 생성됨)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.base,
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.normal,
  },
})

// ❌ 컴포넌트 내부에 정의 (매 렌더마다 재생성)
function Bad() {
  const styles = StyleSheet.create({ ... })  // 성능 저하
}
```

### Variant 스타일 패턴

Props 값에 따른 조건부 스타일은 별도 StyleSheet으로 분리.

```ts
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

// ✅ variant별 스타일을 별도 StyleSheet으로 분리
const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  secondary: {
    backgroundColor: colors.neutral[300],
    borderColor: colors.neutral[300],
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: colors.neutral[500],
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
})

const sizeStyles = StyleSheet.create({
  sm: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
  md: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl },
})

// 사용: 스타일 배열로 조합
style: [styles.base, sizeStyles[size], variantStyles[variant]]
```

### 상태 기반 스타일 (pressed/focused/disabled)

```ts
// Pressable의 style 함수 패턴
style: ({ pressed }) => [
  styles.base,
  variantStyles[variant],
  pressed && !disabled && pressedStyles[variant],
  disabled && styles.disabled,
]

// focused 상태 (Input)
const [focused, setFocused] = useState(false)
style: [
  styles.input,
  focused && styles.focused,
  disabled && styles.disabled,
]
```

## 디자인 토큰 사용

### colors (색상)

다크 모드 기반 시맨틱 컬러. 하드코딩된 색상값 절대 금지.

```ts
import { colors } from '../../tokens/colors'

// ✅ 시맨틱 토큰 사용
backgroundColor: colors.surface.base,      // #080808 (배경)
backgroundColor: colors.surface.card,      // #191919 (카드)
color: colors.text.primary,                // #FFFFFF (주요 텍스트)
color: colors.text.secondary,              // #AAAAAA (보조 텍스트)
color: colors.text.disabled,               // #737373 (비활성)
borderColor: colors.border.normal,         // #323232 (기본 테두리)
borderColor: colors.border.focus,          // #FF6B35 (포커스)
backgroundColor: colors.brand.primary,     // #FF6B35 (브랜드)
color: colors.status.error,                // #FF4B4B (에러)
color: colors.status.errorText,            // #FF8282 (에러 텍스트)

// ❌ 하드코딩
backgroundColor: '#191919',
color: '#FFFFFF',
borderColor: '#FF6B35',
```

#### 색상 용도 가이드

| 카테고리 | 토큰 | 용도 |
|---|---|---|
| `surface.base` | 페이지 배경 |
| `surface.card` | 카드, 입력 필드 배경 |
| `surface.elevated` | 팝오버, 모달 배경 |
| `text.primary` | 주요 텍스트 (흰색) |
| `text.secondary` | 보조 설명 텍스트 |
| `text.disabled` | 비활성 텍스트 |
| `text.onBrand` | 브랜드 색 위 텍스트 |
| `brand.primary` | 주요 액션, CTA |
| `neutral[0-900]` | 그레이 스케일 |
| `status.*` | 성공/에러/경고/정보 |
| `border.*` | 테두리 (normal/focus/error) |

### spacing (간격)

4px 그리드 기반. 모든 padding, margin, gap에 사용.

```ts
import { spacing } from '../../tokens/spacing'

// ✅ 토큰 사용
padding: spacing.md,       // 12
gap: spacing.sm,           // 8
marginTop: spacing.xl,     // 24

// ❌ 하드코딩
padding: 12,
gap: 8,
marginTop: 24,
```

| 키 | 값 | 용도 |
|---|---|---|
| `xs` | 4 | 최소 간격, 에러 텍스트 영역 |
| `sm` | 8 | 요소 내 간격, 아이콘-텍스트 간격 |
| `md` | 12 | 기본 padding, 폼 필드 간격 |
| `lg` | 16 | 카드 padding, 섹션 간격 |
| `xl` | 24 | 페이지 수평 padding |
| `2xl` | 32 | 큰 섹션 간격 |
| `3xl` | 48 | 페이지 상단 여백 |

### typography (타이포그래피)

```ts
import { typography } from '../../tokens/typography'

// 폰트 크기
fontSize: typography.sizes.md,     // 16 (본문)
fontSize: typography.sizes.h1,     // 32 (대제목)
fontSize: typography.sizes.caption, // 14 (캡션)

// 폰트 두께
fontWeight: typography.weights.regular,   // '400'
fontWeight: typography.weights.semibold,  // '600'
fontWeight: typography.weights.bold,      // '700'

// 행간 (fontSize * lineHeight)
lineHeight: typography.sizes.body * typography.lineHeights.relaxed, // 16 * 1.5
```

| sizes | 값 | weights | 값 | lineHeights | 값 |
|---|---|---|---|---|---|
| `xs` | 12 | `regular` | '400' | `tight` | 1.2 |
| `sm` | 14 | `medium` | '500' | `snug` | 1.3 |
| `md` | 16 | `semibold` | '600' | `normal` | 1.4 |
| `lg` | 18 | `bold` | '700' | `relaxed` | 1.5 |
| `h2` | 24 | | | | |
| `h1` | 32 | | | | |
| `display` | 48 | | | | |

### radius (모서리 반경)

```ts
import { radius } from '../../tokens/radius'

borderRadius: radius.sm,    // 8  (작은 요소)
borderRadius: radius.md,    // 12 (기본 입력, 버튼)
borderRadius: radius.lg,    // 16 (카드)
borderRadius: radius.xl,    // 20 (큰 카드)
borderRadius: radius.full,  // 9999 (원형)
```

### sizing (고정 크기)

```ts
import { sizing } from '../../tokens/sizing'

minHeight: sizing.inputHeight,   // 44 (터치 영역 최소값)
borderWidth: sizing.borderWidth, // 1
width: sizing.checkboxSize,      // 22
height: sizing.avatarMd,         // 40
```

### shadows (그림자)

```ts
import { shadows } from '../../tokens/shadows'

// 카드 그림자 (Platform.select 내장)
...shadows.card,

// 브랜드 글로우
...shadows.glow.brand,
```

## 플랫폼별 스타일

```ts
import { Platform, StyleSheet } from 'react-native'

// ✅ Platform.select - 토큰 수준에서 처리
const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
})

// ✅ shadows 토큰이 이미 Platform.select 처리됨
...shadows.card,  // iOS: shadowColor/shadowOffset, Android: elevation
```

## 레이아웃 패턴

### VStack / HStack 사용 (Stack 컴포넌트)

```ts
import { VStack, HStack } from '../../components/stacks'

// ✅ Stack 컴포넌트 사용 (gap, padding을 SpacingKey로)
React.createElement(VStack, { gap: 'md', padding: 'lg' }, children)
React.createElement(HStack, { gap: 'sm', justify: 'space-between' }, children)

// ❌ View + 직접 스타일링
React.createElement(View, { style: { flexDirection: 'row', gap: 8 } }, children)
```

### Flex 패턴

```ts
const styles = StyleSheet.create({
  fill: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  spaceBetween: { justifyContent: 'space-between' },
  bottomPinned: { marginTop: 'auto' },  // 하단 고정
})
```

## DO / DON'T 요약

```ts
// ✅ DO
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.surface.card,
    borderRadius: radius.md,
    borderWidth: sizing.borderWidth,
    borderColor: colors.border.normal,
  },
})

// ❌ DON'T - 하드코딩
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#191919',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#323232',
  },
})

// ❌ DON'T - inline style
<View style={{ padding: 16, gap: 8 }}>

// ❌ DON'T - 컴포넌트 내부에 StyleSheet
function Component() {
  const styles = StyleSheet.create({ ... })
}

// ❌ DON'T - 라이트 모드 색상
backgroundColor: '#FFFFFF',
color: '#18181B',

// ❌ DON'T - style prop 허용
export interface BadgeProps extends ViewProps {  // ViewProps에 style 포함
  color?: string  // 커스텀 색상 prop
}
```
