---
title: Concurrent React
impact: HIGH
tags: useDeferredValue, useTransition, suspense, concurrent
---

# Skill: Concurrent React

`useDeferredValue`와 `useTransition`을 사용하여 중요한 업데이트를 우선순위화하여 체감 성능을 개선하세요.

## 빠른 패턴

**잘못된 방법 (모든 키 입력마다 입력 차단):**

```jsx
const [query, setQuery] = useState('');
<TextInput value={query} onChangeText={setQuery} />
<ExpensiveList query={query} />  // 타이핑 차단
```

**올바른 방법 (입력은 반응성 유지):**

```jsx
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);
<TextInput value={query} onChangeText={setQuery} />
<ExpensiveList query={deferredQuery} />  // 지연된 업데이트
```

## 사용 시기

- 큰 결과 집합이 있는 검색/필터 입력이 느릴 때
- 비용이 많이 드는 연산이 UI 상호작용을 차단할 때
- 로딩 상태가 너무 자주 나타날 때
- 새 콘텐츠를 로드하는 동안 오래된 콘텐츠를 표시하고 싶을 때
- 백그라운드 업데이트보다 사용자 입력을 우선순위화해야 할 때

## 사전 요구사항

- New Architecture가 활성화된 React Native (RN 0.76+에서 기본)
- React 18+ 기능 (`useDeferredValue`, `useTransition`, `Suspense`)

## 개념 개요

**Concurrent React**는 업데이트를 다음과 같이 할 수 있게 합니다:
- **일시 중지**: 낮은 우선순위 작업은 대기 가능
- **중단**: 사용자 입력이 우선순위를 가짐
- **포기**: 오래된 업데이트는 건너뛸 수 있음

## 단계별 지침

### 패턴 1: `useDeferredValue`로 비용이 많이 드는 렌더링 지연

값이 비용이 많이 드는 연산을 유발하지만 입력은 반응성을 유지하고 싶을 때 사용합니다.

```jsx
import { useState, useDeferredValue } from 'react';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  // query는 즉시 업데이트됨 (입력은 반응성 유지)
  // deferredQuery는 React에 시간이 있을 때 업데이트됨

  return (
    <View>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search..."
      />
      {/* ExpensiveList는 지연된 값을 받음 */}
      <ExpensiveList query={deferredQuery} />
    </View>
  );
};
```

### 패턴 2: 로딩 중 오래된 콘텐츠 표시

```jsx
const SearchWithStaleIndicator = () => {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <View>
      <TextInput value={query} onChangeText={setQuery} />
      <View style={isStale && { opacity: 0.7 }}>
        <SearchResults query={deferredQuery} />
      </View>
      {isStale && <ActivityIndicator />}
    </View>
  );
};
```

### 패턴 3: `useTransition`으로 중요하지 않은 업데이트 전환

여러 상태 업데이트가 있고 일부를 낮은 우선순위로 표시하고 싶을 때 사용합니다.

```jsx
import { useState, useTransition } from 'react';

const TransitionExample = () => {
  const [count, setCount] = useState(0);
  const [heavyData, setHeavyData] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleIncrement = () => {
    // 높은 우선순위 - 즉시 업데이트
    setCount(c => c + 1);

    // 낮은 우선순위 - 중단 가능
    startTransition(() => {
      setHeavyData(computeExpensiveData());
    });
  };

  return (
    <View>
      <Text>Count: {count}</Text>
      {isPending ? <ActivityIndicator /> : <HeavyComponent data={heavyData} />}
      <Button onPress={handleIncrement} title="Increment" />
    </View>
  );
};
```

### 패턴 4: 데이터 페칭을 위한 Suspense

```jsx
import { Suspense, useDeferredValue } from 'react';

const DataScreen = () => {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  return (
    <View>
      <TextInput value={query} onChangeText={setQuery} />
      <Suspense fallback={<LoadingSpinner />}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </View>
  );
};
```

## 코드 예제

### 느린 컴포넌트 최적화

```jsx
// Concurrent React 없이 - UI 멈춤
const SlowSearch = () => {
  const [query, setQuery] = useState('');

  return (
    <>
      <TextInput value={query} onChangeText={setQuery} />
      <SlowComponent query={query} /> {/* 모든 키 입력 차단 */}
    </>
  );
};

// Concurrent React 사용 - UI 반응성 유지
const FastSearch = () => {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  return (
    <>
      <TextInput value={query} onChangeText={setQuery} />
      <SlowComponent query={deferredQuery} />
    </>
  );
};

// 중요: 부모의 리렌더링을 방지하기 위해 SlowComponent를 memo로 감싸기
const SlowComponent = memo(({ query }) => {
  // 여기서 비용이 많이 드는 연산
});
```

### 자동 배칭 (React 18+)

React 18은 상태 업데이트를 자동으로 배칭합니다:

```jsx
// React 18 이전 - 2번 리렌더링
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // 두 번 렌더링됨
}, 1000);

// React 18+ - 1번 리렌더링 (자동 배칭)
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // 한 번만 렌더링!
}, 1000);
```

## 언제 무엇을 사용할지

| 시나리오 | 해결책 |
|----------|----------|
| 단일 값이 비용이 많이 드는 렌더링 유발 | `useDeferredValue` |
| 여러 상태 업데이트, 일부는 중요하지 않음 | `useTransition` |
| 전환에 대한 로딩 표시기 필요 | `useTransition` (`isPending` 있음) |
| 로딩 상태가 있는 데이터 페칭 | `Suspense` + `useDeferredValue` |
| 간단한 부모-자식 값 지연 | `useDeferredValue` |

## 중요한 고려사항

1. **비용이 많이 드는 컴포넌트를 `memo()`로 감싸기**: 메모이제이션 없이는 컴포넌트가 어쨌든 부모에서 리렌더링됩니다.

2. **New Architecture와 함께 사용**: Concurrent 기능은 React Native에서 New Architecture가 필요합니다.

3. **과도하게 사용하지 않기**: 진정으로 비용이 많이 드는 작업만 지연하세요. 빠른 컴포넌트에 복잡성을 추가하는 것은 역효과입니다.

## 일반적인 함정

- **memo() 잊어버리기**: 자식이 부모에서 리렌더링되면 `useDeferredValue`는 쓸모없음
- **간단한 상태에 사용**: 저렴한 업데이트에는 오버헤드가 가치가 없음
- **더 빠른 연산 기대**: 이러한 hooks는 코드를 더 빠르게 만들지 않고, 무엇이 언제 실행되는지 우선순위를 지정함

## 관련 Skills

- [js-profile-react.md](./js-profile-react.md) - 느린 컴포넌트 식별
- [js-react-compiler.md](./js-react-compiler.md) - 자동 메모이제이션
- [js-lists-flatlist-flashlist.md](./js-lists-flatlist-flashlist.md) - 리스트별 최적화
