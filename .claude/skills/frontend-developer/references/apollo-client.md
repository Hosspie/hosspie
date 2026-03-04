# Apollo Client 참고

## GraphQL Operation 작성

### 파일 위치

```
apps/admin/lib/graphql/operations/
├── createOnboarding.graphql
├── myGuesthouse.graphql
└── updateGuesthouse.graphql
```

### Operation 네이밍

```graphql
# ✅ 명확한 이름 - PascalCase
query MyGuesthouse {
  myGuesthouse {
    id
    name
  }
}

mutation CreateOnboarding($input: CreateGuesthouseInput!) {
  createOnboarding(input: $input) {
    id
    name
  }
}

# ❌ 불명확한 이름
query GetData { ... }
mutation Create { ... }
```

**규칙**:
- Query: `{Action}{Resource}` (예: `MyGuesthouse`, `GuesthouseById`)
- Mutation: `{Action}{Resource}` (예: `CreateOnboarding`, `UpdateGuesthouse`)

### 필드 선택

```graphql
# ✅ 필요한 필드만 선택
query MyGuesthouse {
  myGuesthouse {
    id
    name
    address
    rooms {
      id
      name
      capacity
    }
  }
}

# ❌ 모든 필드 선택 금지 - 성능 저하
```

## 코드 생성 워크플로우

```bash
# 1. .graphql 파일 작성
# 2. 타입 + 훅 생성
pnpm codegen:admin

# Watch 모드 (권장)
pnpm codegen:watch
```

생성 결과: `*.generated.ts` 파일에 타입 + 훅 자동 생성

## 생성된 훅 사용

### Query 훅

```typescript
import { useMyGuesthouseQuery } from '@/lib/graphql/operations/myGuesthouse.generated';

export default function GuesthouseScreen() {
  const { data, loading, error, refetch } = useMyGuesthouseQuery({
    fetchPolicy: 'cache-first',
    onCompleted: (data) => console.log('Loaded:', data),
    onError: (error) => console.error('Error:', error),
  });

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;
  if (!data?.myGuesthouse) return <EmptyScreen />;

  return <GuesthouseInfo guesthouse={data.myGuesthouse} />;
}
```

### Mutation 훅

```typescript
import { useCreateOnboardingMutation } from '@/lib/graphql/operations/createOnboarding.generated';

export default function OnboardingScreen() {
  const [createOnboarding, { loading }] = useCreateOnboardingMutation({
    onCompleted: () => router.replace('/'),
    onError: () => Alert.alert('오류', '온보딩을 완료할 수 없습니다.'),
  });

  const handleSubmit = async (formData: OnboardingFormData) => {
    await createOnboarding({
      variables: { input: formData }
    });
  };

  return (
    <ScrollArea>
      {/* ... */}
      <ButtonGroup buttons={[{
        text: loading ? '저장 중...' : '제출',
        onPress: handleSubmit,
        variant: 'primary',
        disabled: loading,
      }]} />
    </ScrollArea>
  );
}
```

## Fetch Policy

| 정책 | 용도 |
|------|------|
| `cache-first` | 기본값. 자주 변경되지 않는 데이터 |
| `network-only` | 항상 최신 데이터 필요 |
| `cache-and-network` | UX와 최신성 둘 다 중요 |
| `no-cache` | 민감한 데이터, 캐시 금지 |

```typescript
// 항상 최신 데이터
const { data } = useGuesthouseByIdQuery({
  variables: { id },
  fetchPolicy: 'network-only'
});

// 캐시 먼저 표시 후 업데이트
const { data } = useMyGuesthouseQuery({
  fetchPolicy: 'cache-and-network'
});
```

## 캐시 업데이트

### Mutation 후 캐시 갱신

```typescript
// 방법 1: refetchQueries (간단)
const [createRoom] = useCreateRoomMutation({
  refetchQueries: [{ query: MyGuesthouseDocument }]
});

// 방법 2: update 함수 (정밀)
const [createRoom] = useCreateRoomMutation({
  update(cache, { data }) {
    cache.modify({
      id: cache.identify({ __typename: 'Guesthouse', id: guesthouseId }),
      fields: {
        rooms(existingRooms = []) {
          const newRoomRef = cache.writeFragment({
            data: data?.createRoom,
            fragment: gql`
              fragment NewRoom on Room { id name capacity }
            `
          });
          return [...existingRooms, newRoomRef];
        }
      }
    });
  }
});

// 방법 3: 수동 refetch
const { refetch } = useMyGuesthouseQuery();
await createRoom({ variables: { input } });
await refetch();
```

## 에러 처리

### GraphQL 에러

```typescript
const { error } = useMyGuesthouseQuery();

if (error) {
  // GraphQL 에러
  if (error.graphQLErrors.length > 0) {
    const message = error.graphQLErrors[0].message;
    return <ErrorScreen message={message} />;
  }

  // 네트워크 에러
  if (error.networkError) {
    return <ErrorScreen message="네트워크 연결을 확인해주세요." />;
  }
}
```

### 전역 에러 처리

```typescript
// lib/apollo/client.ts
import { onError } from '@apollo/client/link/error';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      console.error(`[GraphQL error]: ${message}`);
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});
```

## 로딩 상태

```typescript
// ✅ 스크린 레벨 로딩
const { data, loading } = useMyGuesthouseQuery();
if (loading) return <LoadingScreen />;

// ✅ Mutation 버튼 로딩
const [createRoom, { loading }] = useCreateRoomMutation();
<ButtonGroup buttons={[{
  text: loading ? '저장 중...' : '방 추가',
  onPress: handleCreate,
  variant: 'primary',
  disabled: loading,
}]} />

// ❌ 로딩 상태 무시 금지
const { data } = useMyGuesthouseQuery();
return <Text>{data?.myGuesthouse.name}</Text>;  // data가 undefined일 수 있음
```

## Optimistic UI

```typescript
const [updateRoom] = useUpdateRoomMutation({
  optimisticResponse: {
    updateRoom: {
      __typename: 'Room',
      id: roomId,
      name: newName,
      capacity: newCapacity,
    }
  }
});
```

**사용 시기**: 빠른 UI 반응이 필요하고, 실패 확률이 낮은 경우

## 타입 안전성

```typescript
// ✅ 생성된 타입 사용
import {
  MyGuesthouseQuery,
  CreateOnboardingMutationVariables
} from '@/lib/graphql/operations/createOnboarding.generated';

const handleSubmit = async (data: CreateOnboardingMutationVariables['input']) => {
  await createOnboarding({ variables: { input: data } });
};

// ❌ any 타입 금지
const handleSubmit = async (data: any) => {
  await createOnboarding({ variables: { input: data } });
};
```
