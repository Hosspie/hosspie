---
title: 원자적 상태 관리
impact: HIGH
tags: state, jotai, zustand, re-renders, context
---

# Skill: 원자적 상태 관리

원자적 상태 라이브러리(Jotai, Zustand)를 사용하여 수동 메모이제이션 없이 불필요한 리렌더링을 줄이세요.

## 빠른 패턴

**이전 (Context - 모든 소비자가 리렌더링):**

```jsx
const { filter, todos } = useContext(TodoContext);
// 모든 상태 변경 시 리렌더링
```

**이후 (Zustand - 구독한 상태만):**

```jsx
const filter = useTodoStore((s) => s.filter);
// filter 변경 시에만 리렌더링
```

## 사용 시기

- 전역 상태 변경이 광범위한 리렌더링을 유발할 때
- 앱 상태에 React Context 사용 중
- 데이터가 변경되지 않았는데도 컴포넌트가 리렌더링될 때
- 수동 `useMemo`/`useCallback`을 모든 곳에서 사용하고 싶지 않을 때
- React Compiler 도입 준비가 되지 않았을 때

## 사전 요구사항

- 상태 관리 라이브러리: `jotai` 또는 `zustand`

```bash
npm install jotai
# 또는
npm install zustand
```

## 문제 설명

기존 React state나 Context 사용 시:

```jsx
// filter 또는 todos가 변경되면 모든 것이 리렌더링됨
const App = () => {
  const [filter, setFilter] = useState('all');
  const [todos, setTodos] = useState([]);

  return (
    <>
      <FilterMenu filter={filter} setFilter={setFilter} />
      <TodoList todos={todos} filter={filter} setTodos={setTodos} />
    </>
  );
};
```

todo를 변경하면 todos를 사용하지 않음에도 FilterMenu가 리렌더링됩니다.

## 단계별 지침

### Jotai 사용

#### 1. Atoms 정의

```jsx
import { atom } from 'jotai';

// 각 atom은 독립적인 상태 조각
const filterAtom = atom('all');
const todosAtom = atom([]);

// 파생된 atom (계산된 값)
const filteredTodosAtom = atom((get) => {
  const filter = get(filterAtom);
  const todos = get(todosAtom);

  if (filter === 'active') return todos.filter(t => !t.completed);
  if (filter === 'completed') return todos.filter(t => t.completed);
  return todos;
});
```

#### 2. 컴포넌트에서 Atoms 사용

```jsx
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

// filterAtom 변경 시에만 리렌더링
const FilterMenu = () => {
  const [filter, setFilter] = useAtom(filterAtom);

  return (
    <View>
      {['all', 'active', 'completed'].map((f) => (
        <Pressable key={f} onPress={() => setFilter(f)}>
          <Text style={filter === f ? styles.active : null}>{f}</Text>
        </Pressable>
      ))}
    </View>
  );
};

// todosAtom 변경 시에만 리렌더링
const TodoItem = ({ id }) => {
  const setTodos = useSetAtom(todosAtom);  // setter만, 읽기 시 리렌더링 없음

  const toggleTodo = () => {
    setTodos((prev) =>
      prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  };

  return <Pressable onPress={toggleTodo}>...</Pressable>;
};
```

### Zustand 사용

#### 1. Store 생성

```jsx
import { create } from 'zustand';

const useTodoStore = create((set, get) => ({
  filter: 'all',
  todos: [],

  setFilter: (filter) => set({ filter }),

  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ),
  })),

  // 파생된 상태를 위한 selector
  getFilteredTodos: () => {
    const { filter, todos } = get();
    if (filter === 'active') return todos.filter(t => !t.completed);
    if (filter === 'completed') return todos.filter(t => t.completed);
    return todos;
  },
}));
```

#### 2. Selectors 사용

```jsx
// filter 변경 시에만 리렌더링
const FilterMenu = () => {
  const filter = useTodoStore((state) => state.filter);
  const setFilter = useTodoStore((state) => state.setFilter);

  return (
    <View>
      {['all', 'active', 'completed'].map((f) => (
        <Pressable key={f} onPress={() => setFilter(f)}>
          <Text>{f}</Text>
        </Pressable>
      ))}
    </View>
  );
};

// todos 변경 시에만 리렌더링
const TodoList = () => {
  const todos = useTodoStore((state) => state.todos);
  return todos.map((todo) => <TodoItem key={todo.id} {...todo} />);
};
```

## 코드 예제

### 이전: Context 기반 (많은 리렌더링)

```jsx
const TodoContext = createContext();

const TodoProvider = ({ children }) => {
  const [state, setState] = useState({ filter: 'all', todos: [] });
  return (
    <TodoContext.Provider value={{ state, setState }}>
      {children}
    </TodoContext.Provider>
  );
};

// 이 context를 사용하는 모든 컴포넌트는 모든 상태 변경 시 리렌더링됨
const FilterMenu = () => {
  const { state, setState } = useContext(TodoContext);
  // todos 변경 시에도 리렌더링!
};
```

### 이후: Atomic (타겟 리렌더링)

```jsx
// Jotai 버전 - 영향받는 컴포넌트만 리렌더링
const filterAtom = atom('all');
const todosAtom = atom([]);

const FilterMenu = () => {
  const [filter, setFilter] = useAtom(filterAtom);
  // filter 변경 시에만 리렌더링
};

const TodoList = () => {
  const todos = useAtomValue(todosAtom);
  // todos 변경 시에만 리렌더링
};
```

## 비교

| 기능 | Context | Jotai | Zustand |
|---------|---------|-------|---------|
| 리렌더링 범위 | 모든 소비자 | Atom 구독자 | Selector 구독자 |
| 파생 상태 | 수동 | 내장 atoms | Selectors |
| DevTools | React DevTools | Jotai DevTools | Zustand DevTools |
| 번들 크기 | 0 KB | ~3 KB | ~2 KB |
| 학습 곡선 | 낮음 | 중간 | 낮음 |

## 언제 무엇을 사용할지

- **Jotai**: 세밀한 상태, 많은 작은 atoms, 파생/비동기 atoms
- **Zustand**: 더 간단한 멘탈 모델, 단일 store, 익숙한 Redux-like 패턴
- **React Compiler**: 사용 가능하다면 이러한 라이브러리가 필요 없을 수 있음

## 일반적인 함정

- **과도한 atom화**: 모든 변수에 대해 atom을 만들지 마세요. 관련 상태를 그룹화하세요.
- **Zustand에서 selector 누락**: 불필요한 리렌더링을 방지하려면 항상 selector를 사용하세요.
- **메모이제이션 없는 파생 상태**: 파생 atoms(Jotai) 또는 메모이제이션된 selectors 사용

## 관련 Skills

- [js-react-compiler.md](./js-react-compiler.md) - 자동 메모이제이션 대안
- [js-profile-react.md](./js-profile-react.md) - 리렌더링 감소 검증
