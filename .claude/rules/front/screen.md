---
paths:
  - "apps/admin/app/**/*.tsx"
---

# 스크린 구성 규칙

## Organism Only Import

스크린은 `@hosspie/design-system/organisms/*` 만 import.

```ts
// ✅
import { ButtonGroup } from '@hosspie/design-system/organisms/button-group';
import { FormField } from '@hosspie/design-system/organisms/form-field';

// ❌ atom 직접 import
import { Button } from '@hosspie/design-system/components/button';
```

**금지**:
- `react-native` 시각 컴포넌트 (`Text`, `Pressable` 등) — 레이아웃용 `View` / `ScrollView` 는 예외
- atom 직접 import (`@hosspie/design-system/components/*`) — `Sheet` 등 overlay 성격 특수 컴포넌트만 예외
- 인라인 `style={{...}}` 객체, 하드코딩 수치·색상

비시각적 RN API (`Alert`, `Platform`) 허용. 필요한 organism 없으면 publisher 에이전트에 생성 요청 (메인 대화로 보고).

## 상태 관리 매핑

| 용도 | 도구 |
|---|---|
| 서버 데이터 | Apollo generated hooks (`useFooQuery`) |
| 폼 | react-hook-form (`Field`, `useFormContext`) |
| 로컬 UI | `useState` |
| 전역 (auth/세션) | Context API |

서버 데이터를 `useState` 로 복사 금지.

## 에러 처리

mutation/query 결과의 union variant 분기로 UI 처리 (toast, inline error, navigation 등). try/catch 안 씀. 자세히는 `front/code-style.md` 의 "에러 처리" 참조.

## 라우트 함수명 통일

| 파일 | default export 함수명 |
|---|---|
| `app/**/index.tsx` | `Index` |
| `app/**/_layout.tsx` | `Layout` |

경로 중복 명명 금지 (`ProtectedLayout`, `OnboardingIndex` 등).

## 상단 블록 순서

```
refs → states → animation values → hooks → consts → handlers → useEffect → return
```

- 블록 사이 빈 줄 1줄, **블록 내부 빈 줄 없음**
- 예외: `handlers` 블록 내 handler 선언 사이는 빈 줄 1줄 (각 handler가 독립 이벤트 진입점)

**`animation values` 블록**: `useSafeAreaInsets` / `useWindowDimensions` / `useSharedValue` / `useReanimatedKeyboardAnimation` / `useDerivedValue` 등 layout·animation에 직접 consume되는 네이티브 측정값·구독 값.

**`hooks` 블록**: 커스텀 도메인 hook, Apollo generated hook, expo-router hook 등. `useAnimatedStyle` 같은 derived 애니메이션 hook은 hooks 블록 **맨 아래** 배치.

**`consts` 블록**: hook 결과 가공·boolean 파생값. hook 블록 끝이나 return 직전에 흩뿌리지 않고 여기에 모음.

```tsx
// ✅ 블록 순서 예시
export default function Index() {
  const idRef = useRef<TextFieldHandle>(null);

  const [error, setError] = useState<string | null>(null);

  const insets = useSafeAreaInsets();

  const { data } = useGuesthouseQuery();
  const [createReservation] = useCreateReservationMutation();

  const isSubmitDisabled = !data || !!error;

  const handlePressSubmit = () => {
    // ...
  };

  useEffect(() => {
    // ...
  }, []);

  return <View>...</View>;
}
```

## testID

kebab-case `<screen>-<element>-<role>` (screen = 파일명 기준). 사용자 액션 핸들러를 받는 컴포넌트에 의무 부여.

```tsx
// 파일: app/reservation/index.tsx
<ButtonGroup testID="reservation-submit-button" onPress={handlePressSubmit} />
```
