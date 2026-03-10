# 앱 구조 참고

## expo-router 라우팅

### 파일 기반 라우팅

```
app/
├── _layout.tsx           # 루트 레이아웃 (Providers)
├── index.tsx             # /
├── signin.tsx            # /signin
├── (authenticated)/      # 그룹 (경로에 포함 안 됨)
│   ├── _layout.tsx       # 세션 가드
│   └── (tabs)/           # 중첩 그룹
│       ├── _layout.tsx   # 탭 네비게이션
│       ├── index.tsx     # /
│       └── profile.tsx   # /profile
└── onboarding/
    ├── _layout.tsx       # 공유 레이아웃 (FormProvider)
    ├── description/      # /onboarding/description
    ├── information/      # /onboarding/information
    └── rooms/            # /onboarding/rooms
```

**규칙**:
- `()`로 감싼 폴더명은 URL 경로에 포함되지 않음
- `_layout.tsx`는 해당 경로의 공유 레이아웃
- `index.tsx`는 해당 경로의 루트

### 네비게이션

```typescript
import { router } from 'expo-router';

// ✅ router 사용
router.push('/onboarding/description');   // 다음 화면으로 이동
router.replace('/signin');                 // 현재 화면 교체 (뒤로가기 불가)
router.back();                             // 이전 화면으로

// ✅ 파라미터 전달
router.push({
  pathname: '/guesthouse/[id]',
  params: { id: '123' }
});

// ❌ React Navigation 직접 사용 금지
navigation.navigate('OnboardingStep1');
```

### 동적 라우트

```typescript
// app/guesthouse/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function GuesthouseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <GuesthouseDetail id={id} />;
}
```

## 레이아웃 패턴

### 공유 상태 레이아웃 (멀티 스텝 폼)

```typescript
// app/onboarding/_layout.tsx
import { BackgroundLayout } from '@hosspie/design-system/organisms/background-layout';
import { ProgressBar } from '@hosspie/design-system/organisms/progress-bar';
import { FormProvider } from '@hosspie/services/form';
import { Stack, usePathname } from 'expo-router';

export default function OnboardingLayout() {
  const pathname = usePathname();
  const progress = PROGRESS_MAP[pathname];

  return (
    <BackgroundLayout>
      <FormProvider<OnboardingFormData>>
        <ProgressBar value={progress} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'black' } }} />
      </FormProvider>
    </BackgroundLayout>
  );
}
```

### 보호된 라우트 (Protected Routes)

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

const RootNavigator = () => {
  const { isLoading, session } = useSession();
  const hasSession = !!session;

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={hasSession}>
        <Stack.Screen name="(authenticated)" />
      </Stack.Protected>
      <Stack.Protected guard={!hasSession}>
        <Stack.Screen name="signin" />
      </Stack.Protected>
    </Stack>
  );
};
```

### 탭 네비게이션

```typescript
// app/(authenticated)/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: '스케줄',
          tabBarIcon: ({ color, size }) => <CalendarIcon color={color} size={size} />
        }}
      />
    </Tabs>
  );
}
```

## Provider 구성

### Provider 계층 순서

```typescript
// app/_layout.tsx
export default function RootLayout() {
  return (
    <ApolloProvider>          {/* 1. Data Provider */}
      <SessionProvider>       {/* 2. Auth Provider */}
        <RootNavigator />     {/* 3. Router */}
      </SessionProvider>
    </ApolloProvider>
  );
}
```

**순서 이유**:
1. **ApolloProvider**: GraphQL 클라이언트 - 데이터 레이어
2. **SessionProvider**: 인증 상태 - 세션 데이터 제공
3. **Router**: 화면 렌더링

### ApolloProvider 설정

```typescript
// providers/apollo.tsx
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.EXPO_PUBLIC_API_URL,
  cache: new InMemoryCache()
});

export function AppApolloProvider({ children }: PropsWithChildren) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
```

### Custom Provider 패턴

```typescript
// providers/session.tsx
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

## 스크린 구조

### 기본 스크린 템플릿

```typescript
// app/some-screen.tsx
import { SomeOrganism } from '@hosspie/design-system/organisms/some-organism';
import { ScrollArea } from '@hosspie/design-system/organisms/scroll-area';
import { TextBlock } from '@hosspie/design-system/organisms/text-block';
import { ButtonGroup } from '@hosspie/design-system/organisms/button-group';

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
      <ButtonGroup buttons={buttons} placement="bottom" />
    </ScrollArea>
  );
}
```

### 멀티 스텝 플로우

**패턴**: 공유 레이아웃 (`FormProvider`) + 개별 스텝

```typescript
// app/onboarding/_layout.tsx
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

// app/onboarding/description/index.tsx
export default function DescriptionScreen() {
  const { handleSubmit } = useForm<OnboardingFormData>();

  const handlePressNext = handleSubmit(
    () => router.push('/onboarding/information'),
    () => { /* 유효성 검사 실패 */ }
  );

  return (
    <ScrollArea>
      <TextBlock title="게스트하우스 정보를\n등록해 주세요" />
      <Field name="name" ... />
      <ButtonGroup buttons={[{ text: '다음', onPress: handlePressNext, variant: 'primary' }]} />
    </ScrollArea>
  );
}

// app/onboarding/rooms/index.tsx (마지막 스텝)
export default function RoomsScreen() {
  const { handleSubmit } = useForm<OnboardingFormData>();
  const [createOnboarding, { loading }] = useCreateOnboardingMutation();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createOnboarding({ variables: { input: transformData(data) } });
      router.replace('/(authenticated)/(tabs)');
    } catch (error) {
      Alert.alert('오류', '온보딩을 완료할 수 없습니다.');
    }
  });

  return (
    <ScrollArea>
      {/* ... */}
      <ButtonGroup buttons={[
        { text: '이전', onPress: router.back, variant: 'outline' },
        { text: loading ? '저장 중...' : '완료', onPress: onSubmit, variant: 'primary', disabled: loading },
      ]} />
    </ScrollArea>
  );
}
```

## 화면 옵션

### 헤더 설정

```typescript
// 개별 화면에서
import { Stack } from 'expo-router';

export default function SomeScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '제목', headerShown: true }} />
      {/* 화면 컨텐츠 */}
    </>
  );
}

// 레이아웃에서
export default function SomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'black' } }} />
  );
}
```

## 에러 처리

### 스크린 레벨 에러

```typescript
export default function GuesthouseScreen() {
  const { data, loading, error } = useMyGuesthouseQuery();

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message="게스트하우스 정보를 불러올 수 없습니다." />;
  if (!data?.myGuesthouse) return <EmptyScreen message="게스트하우스가 없습니다." />;

  return <GuesthouseInfo guesthouse={data.myGuesthouse} />;
}
```

### 앱 레벨 에러 (ErrorBoundary)

```typescript
// app/_layout.tsx
import { ErrorBoundary } from 'react-error-boundary';

export default function RootLayout() {
  return (
    <ErrorBoundary
      fallback={<GlobalErrorScreen />}
      onError={(error) => console.error('Global Error:', error)}
    >
      {/* Providers & Router */}
    </ErrorBoundary>
  );
}
```

## 플랫폼별 코드

```typescript
import { Platform } from 'react-native';

// Platform.select
const styles = Platform.select({
  ios: { paddingTop: 20 },
  android: { paddingTop: 0 }
});

// Platform.OS 조건
if (Platform.OS === 'ios') {
  // iOS 전용 로직
}

// 파일 확장자로 분리
// SomeComponent.ios.tsx
// SomeComponent.android.tsx
```
