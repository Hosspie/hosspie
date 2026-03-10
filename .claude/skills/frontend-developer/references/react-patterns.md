# React 패턴 참고

## 컴포넌트 작성

### 함수형 컴포넌트

```typescript
// ✅ function 선언 + export default
export default function GuesthouseScreen() {
  return <ScrollArea>...</ScrollArea>;
}

// ✅ Props 타입 정의
interface GuesthouseCardProps {
  guesthouse: Guesthouse;
  onPress: () => void;
}

export function GuesthouseCard({ guesthouse, onPress }: GuesthouseCardProps) {
  return <CardOrganism {...guesthouse} onPress={onPress} />;
}
```

### Props 타입

```typescript
// ✅ interface 사용
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

// ✅ PropsWithChildren
interface LayoutProps extends PropsWithChildren {
  title: string;
}

// ❌ any 타입 금지
function Button({ title, onPress }: any) { ... }
```

## Hooks

### 기본 Hooks

```typescript
export default function OnboardingScreen() {
  // 상태
  const [step, setStep] = useState(1);

  // 사이드 이펙트
  useEffect(() => {
    console.log('Step changed:', step);
  }, [step]);

  // 메모이제이션
  const expensiveValue = useMemo(() => {
    return calculateExpensiveValue(data);
  }, [data]);

  // 콜백 메모이제이션
  const handleNext = useCallback(() => {
    setStep(prev => prev + 1);
  }, []);

  return <ScrollArea>...</ScrollArea>;
}
```

### Custom Hooks

```typescript
function useGuesthouse(id: string) {
  const { data, loading, error } = useGuesthouseByIdQuery({
    variables: { id }
  });

  return {
    guesthouse: data?.guesthouse,
    isLoading: loading,
    error
  };
}

// 사용
export default function GuesthouseScreen({ id }: { id: string }) {
  const { guesthouse, isLoading, error } = useGuesthouse(id);

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;

  return <GuesthouseInfo guesthouse={guesthouse} />;
}
```

### Hook 규칙

- 컴포넌트 최상위에서만 호출
- 조건문, 반복문 내부에서 호출 금지
- Custom Hook은 `use` 접두사 사용

## Form 처리

### react-hook-form 사용

```typescript
import { Field, useForm } from '@hosspie/services/form';
import { FormField } from '@hosspie/design-system/organisms/form-field';

export default function OnboardingForm() {
  const { handleSubmit } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    await createOnboarding({ variables: { input: data } });
  });

  return (
    <ScrollArea>
      <Field<FormData, 'name'>
        name="name"
        rules={{
          required: '이름을 입력하세요',
          minLength: { value: 2, message: '최소 2자 이상 입력하세요' }
        }}
        render={({ field: { onChange, value }, fieldState: { error, isRequired } }) => (
          <FormField
            type="input"
            title="이름"
            value={value}
            onChange={onChange}
            error={error && { message: error.message || '' }}
            isRequired={isRequired}
          />
        )}
      />
      <ButtonGroup buttons={[{ text: '제출', onPress: onSubmit, variant: 'primary' }]} />
    </ScrollArea>
  );
}
```

### 멀티 스텝 폼

**공유 레이아웃**:
```typescript
// onboarding/_layout.tsx
import { FormProvider } from '@hosspie/services/form';

export default function OnboardingLayout() {
  return (
    <BackgroundLayout>
      <FormProvider<OnboardingFormData>>
        <ProgressBar value={progress} />
        <Stack screenOptions={{ headerShown: false }} />
      </FormProvider>
    </BackgroundLayout>
  );
}
```

**각 스텝**:
```typescript
// onboarding/step1.tsx
import { useForm } from '@hosspie/services/form';

export default function Step1() {
  const { handleSubmit } = useForm<OnboardingFormData>();

  return (
    <ScrollArea>
      <Field name="name" ... />
      <ButtonGroup buttons={[{ text: '다음', onPress: handleNext, variant: 'primary' }]} />
    </ScrollArea>
  );
}
```

**마지막 스텝**:
```typescript
// onboarding/step3.tsx
export default function Step3() {
  const { handleSubmit } = useForm<OnboardingFormData>();
  const [createOnboarding] = useCreateOnboardingMutation();

  const onSubmit = handleSubmit(async (data) => {
    await createOnboarding({ variables: { input: data } });
    router.replace('/');
  });

  return (
    <ScrollArea>
      {/* ... */}
      <ButtonGroup buttons={[{ text: '완료', onPress: onSubmit, variant: 'primary' }]} />
    </ScrollArea>
  );
}
```

### Validation 규칙

```typescript
<Field
  name="email"
  rules={{
    required: '이메일을 입력하세요',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: '올바른 이메일 형식이 아닙니다'
    }
  }}
  ...
/>

<Field
  name="capacity"
  rules={{
    required: '인원을 입력하세요',
    min: { value: 1, message: '최소 1명 이상' },
    max: { value: 10, message: '최대 10명까지' }
  }}
  ...
/>
```

## 상태 관리

### 로컬 상태 (useState)

```typescript
// 단순 UI 상태
const [isOpen, setIsOpen] = useState(false);
const [selectedTab, setSelectedTab] = useState(0);
```

### Context API

```typescript
interface SessionContextType {
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SessionContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}
```

### 서버 상태 (Apollo Client)

```typescript
// ✅ GraphQL 쿼리로 관리
const { data } = useMyGuesthouseQuery();

// ❌ 서버 데이터를 로컬 상태로 관리 금지
const [guesthouse, setGuesthouse] = useState(null);
useEffect(() => { fetchGuesthouse().then(setGuesthouse) }, []);
```

## 성능 최적화

### React.memo

```typescript
// 순수 컴포넌트 메모이제이션
export const RoomCard = React.memo(({ room }: RoomCardProps) => {
  return <CardOrganism {...room} />;
});

// 비교 함수 커스터마이징
export const RoomCard = React.memo(
  ({ room }: RoomCardProps) => <CardOrganism {...room} />,
  (prevProps, nextProps) => prevProps.room.id === nextProps.room.id
);
```

### useCallback

```typescript
// ✅ 콜백 메모이제이션 (특히 자식 컴포넌트에 전달 시)
const handlePress = useCallback(() => {
  router.push(`/room/${room.id}`);
}, [room.id]);

// ❌ 매번 새로운 함수 생성
const handlePress = () => {
  router.push(`/room/${room.id}`);
};
```

### useMemo

```typescript
// ✅ 비싼 계산 메모이제이션
const sortedRooms = useMemo(() => {
  return rooms.sort((a, b) => a.capacity - b.capacity);
}, [rooms]);

// ❌ 단순 계산에 useMemo 불필요
const doubleCount = useMemo(() => count * 2, [count]);
```

## 조건부 렌더링

### Early Return

```typescript
// ✅ Early Return 패턴
export default function GuesthouseScreen() {
  const { data, loading, error } = useMyGuesthouseQuery();

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;
  if (!data?.myGuesthouse) return <EmptyScreen />;

  return <GuesthouseInfo guesthouse={data.myGuesthouse} />;
}
```

### 조건부 JSX

```typescript
// ✅ && 연산자 (0 주의)
{rooms.length > 0 && <RoomList rooms={rooms} />}

// ✅ 삼항 연산자
{isActive ? <ActiveBadge /> : <InactiveBadge />}

// ❌ 0이 렌더링될 수 있음
{rooms.length && <RoomList rooms={rooms} />}
```

## 에러 처리

### ErrorBoundary

```typescript
import { ErrorBoundary } from 'react-error-boundary';

export default function RootLayout() {
  return (
    <ErrorBoundary
      fallback={<ErrorScreen />}
      onError={(error, errorInfo) => {
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
      }}
    >
      <App />
    </ErrorBoundary>
  );
}
```

### Try-Catch

```typescript
const handleSubmit = async (data: FormData) => {
  try {
    await createOnboarding({ variables: { input: data } });
    router.replace('/');
  } catch (error) {
    Alert.alert('오류', '온보딩을 완료할 수 없습니다.');
    console.error(error);
  }
};
```
