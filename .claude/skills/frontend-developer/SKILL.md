---
name: frontend-developer
description: "React Native/Expo 앱 로직 구현 가이드. design-system의 pages 스토리를 참고하여 organisms만 import해 스크린을 구성하고, 서비스 로직(GraphQL, 상태 관리, 폼, 라우팅)을 연결합니다. 트리거: 앱 스크린 구현, 화면 추가/수정, GraphQL operation 작성, Apollo Client 연동, react-hook-form 폼 처리, expo-router 라우팅, 멀티 스텝 폼, 상태 관리, 성능 최적화, 앱 배포, API fetch, 인증/세션, Context API, 서버 상태, 로딩/에러 처리. apps/admin/ 내 파일 작업 시 자동 적용."
---

# Frontend Developer 가이드

## 역할

design-system의 **pages/ 스토리를 참고**하여 organisms를 import하고, 서비스 로직(GraphQL, 상태 관리, 폼, 라우팅)을 연결하여 앱 스크린을 구현합니다.

**담당 영역**: 서비스 로직, 성능 개선, 배포, 백엔드 API fetch

**Tech Stack**: Expo SDK 53, React Native 0.79, expo-router v5, Apollo Client 3, react-hook-form

## 스크린 구성 규칙 (가장 중요)

### 핵심 원칙: organisms만 import

스크린은 **design-system의 organisms만 조합**하여 구성합니다. UI 구조는 `packages/design-system/src/pages/` 스토리를 참고합니다.

```tsx
// ✅ 올바름 - organisms만 import
import { BackgroundLayout } from '@hosspie/design-system/organisms/background-layout';
import { ButtonGroup, ButtonGroupItemProps } from '@hosspie/design-system/organisms/button-group';
import { FormField } from '@hosspie/design-system/organisms/form-field';
import { TextBlock } from '@hosspie/design-system/organisms/text-block';
import { ScrollArea } from '@hosspie/design-system/organisms/scroll-area';

export default function OnboardingScreen() {
  const { handleSubmit } = useForm<IOnboardingFormData>();

  return (
    <ScrollArea>
      <TextBlock title="제목" description="설명" />
      <FormField type="input" title="이름" ... />
      <ButtonGroup buttons={buttons} placement="bottom" />
    </ScrollArea>
  );
}
```

### 금지 사항

```tsx
// ❌ react-native 프리미티브 직접 import 금지
import { View, Text, Pressable } from 'react-native';

// ❌ components/ (atoms) 직접 import 금지 - organisms 내부에서만 사용
import { Button } from '@hosspie/design-system/components/button';
import { Input } from '@hosspie/design-system/components/input';

// ❌ 인라인 style 객체 금지
<View style={{ padding: 16, backgroundColor: '#000' }}>

// ❌ 하드코딩된 레이아웃 금지
<View style={{ flex: 1, justifyContent: 'center' }}>
```

### 예외: react-native import 허용 사항

```tsx
// ✅ Alert, Platform 등 비시각적 API는 허용
import { Alert, Platform } from 'react-native';

// ✅ Sheet 같은 특수 컴포넌트는 components/ import 허용
import { Sheet } from '@hosspie/design-system/components/sheet';
```

### organism이 없을 때

필요한 organism이 design-system에 없으면 **직접 만들지 말고 Publisher에게 생성 요청**합니다.

## 상태 관리

| 용도 | 도구 | 예시 |
|------|------|------|
| 서버 상태 | Apollo Client (generated hooks) | `useMyGuesthouseQuery()` |
| 폼 상태 | react-hook-form | `useForm()`, `useFormContext()` |
| 로컬 UI 상태 | useState | `[isOpen, setIsOpen]` |
| 전역 상태 | Context API | `useSession()` |

```tsx
// ✅ 서버 데이터는 Apollo Client로 관리
const { data, loading } = useMyGuesthouseQuery();

// ❌ 서버 데이터를 로컬 상태로 복사 금지
const [data, setData] = useState(null);
useEffect(() => { fetch(...).then(setData) }, []);
```

## GraphQL 워크플로우

### Operation 작성 → 코드 생성 → Hook 사용

```bash
# 1. .graphql 파일 작성
apps/admin/lib/graphql/operations/createOnboarding.graphql

# 2. 타입 + 훅 생성
pnpm codegen:admin

# 3. 생성된 훅 import
import { useCreateOnboardingMutation } from '@/lib/graphql/operations/createOnboarding.generated';
```

상세: [references/apollo-client.md](references/apollo-client.md)

## 멀티 스텝 폼 패턴

```
_layout.tsx: FormProvider + ProgressBar (상태 공유)
  ├── step1.tsx: useFormContext() → Field + FormField
  ├── step2.tsx: useFormContext() → Field + FormField
  └── step3.tsx: useFormContext() → handleSubmit → mutation
```

**레이아웃**:
```tsx
// onboarding/_layout.tsx
import { BackgroundLayout } from '@hosspie/design-system/organisms/background-layout';
import { ProgressBar } from '@hosspie/design-system/organisms/progress-bar';
import { FormProvider } from '@hosspie/services/form';

export default function OnboardingLayout() {
  return (
    <BackgroundLayout>
      <FormProvider<IOnboardingFormData>>
        <ProgressBar value={progress} />
        <Stack screenOptions={{ headerShown: false }} />
      </FormProvider>
    </BackgroundLayout>
  );
}
```

**각 스텝**:
```tsx
// onboarding/description/index.tsx
import { Field, useForm } from '@hosspie/services/form';
import { FormField } from '@hosspie/design-system/organisms/form-field';

export default function DescriptionScreen() {
  const { handleSubmit } = useForm<IOnboardingFormData>();

  return (
    <ScrollArea>
      <TextBlock title="게스트하우스 정보를\n등록해 주세요" />
      <Field<IOnboardingFormData, 'name'>
        name="name"
        rules={{ required: '이름을 입력하세요' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <FormField type="input" title="이름" value={value} onChange={onChange} error={error} />
        )}
      />
      <ButtonGroup buttons={buttons} placement="bottom" />
    </ScrollArea>
  );
}
```

## 스크린 템플릿

```tsx
// app/some-screen.tsx
import { SomeOrganism } from '@hosspie/design-system/organisms/some-organism';
import { useSomeQuery } from '@/lib/graphql/operations/some.generated';

export default function SomeScreen() {
  // 1. Hooks
  const { data, loading, error } = useSomeQuery();

  // 2. Early returns
  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;
  if (!data) return <EmptyScreen />;

  // 3. Event handlers
  const handleSubmit = async () => { ... };

  // 4. Render - organisms만 사용
  return (
    <ScrollArea>
      <TextBlock title="제목" description="설명" />
      <SomeOrganism data={data} onSubmit={handleSubmit} />
      <ButtonGroup buttons={buttons} />
    </ScrollArea>
  );
}
```

## 성능 최적화

| 기법 | 사용 시기 |
|------|----------|
| `React.memo` | 순수 컴포넌트, 리스트 아이템 |
| `useCallback` | 이벤트 핸들러 (특히 자식에 전달 시) |
| `useMemo` | 비싼 계산, 배열 정렬/필터 |

```tsx
// ✅ 리스트 아이템 메모이제이션
export const RoomCard = React.memo(({ room }: RoomCardProps) => {
  return <CardOrganism {...room} />;
});

// ✅ 네비게이션 콜백
const handleNavigate = useCallback(() => {
  router.push(`/guesthouse/${id}`);
}, [id]);
```

## 상세 참고 문서

- [React 패턴](references/react-patterns.md) - 컴포넌트, Hooks, 폼, 상태 관리
- [앱 구조](references/app-structure.md) - 라우팅, 레이아웃, Provider
- [Apollo Client](references/apollo-client.md) - GraphQL operations, 캐시, 에러 처리
