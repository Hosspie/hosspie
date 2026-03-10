---
title: React Compiler
impact: HIGH
tags: memoization, react-compiler, memo, useMemo, useCallback
---

# Skill: React Compiler

컴포넌트를 자동으로 메모이제이션하고 불필요한 리렌더링을 제거하기 위해 React Compiler를 설정합니다.

## 빠른 패턴

**Before (수동 메모이제이션):**

```jsx
const MemoizedButton = memo(({ onPress }) => <Pressable onPress={onPress} />);
const handler = useCallback(() => doSomething(), []);
```

**After (React Compiler로 자동화):**

```jsx
// memo/useCallback 불필요 - 컴파일러가 처리
const Button = ({ onPress }) => <Pressable onPress={onPress} />;
const handler = () => doSomething();
```

## 언제 사용하나요

- 수동 `memo`/`useMemo`/`useCallback` 없이 자동 성능 최적화 원할 때
- 코드베이스가 Rules of React를 따를 때
- React Native 0.76+ 또는 Expo SDK 52+
- 보일러플레이트 메모이제이션 코드를 제거할 준비가 되었을 때

## 사전 준비사항

- React 17+ (React 19 권장, 최고의 호환성)
- Babel 기반 빌드 시스템
- [Rules of React](https://react.dev/reference/rules)를 따르는 코드

## 단계별 가이드

### Step 1: 호환성 확인

컴파일러를 활성화하기 전에 프로젝트 호환성을 확인하세요:

```bash
npx react-compiler-healthcheck@latest
```

앱이 Rules of React를 따르는지 확인하고 잠재적 문제를 식별합니다.

### Step 2: React Compiler 설치

#### Expo 프로젝트

**SDK 54 이상** (간소화된 설정):

```bash
npx expo install babel-plugin-react-compiler
```

**SDK 52-53**:

```bash
npx expo install babel-plugin-react-compiler@beta react-compiler-runtime@beta
```

그런 다음 앱 설정에서 활성화:

```json
// app.json
{
  "expo": {
    "experiments": {
      "reactCompiler": true
    }
  }
}
```

#### React Native (Expo 없이)

```bash
npm install -D babel-plugin-react-compiler@latest
```

React Native < 0.78 (React < 19)의 경우 런타임도 설치:

```bash
npm install react-compiler-runtime@beta
```

### Step 3: Babel 설정 (Expo 없는 React Native)

Expo가 아닌 React Native 프로젝트의 경우 수동으로 Babel 구성:

```javascript
// babel.config.js
const ReactCompilerConfig = {
  target: '19', // React Native < 0.78은 '18' 사용
};

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig], // 먼저 실행되어야 함!
      // ... 다른 플러그인들
    ],
  };
};
```

> **중요**: React Compiler는 Babel 플러그인 파이프라인에서 **먼저** 실행되어야 합니다. 컴파일러는 적절한 분석을 위해 원본 소스 정보가 필요합니다.

### Step 4: ESLint 설정 (권장)

ESLint 플러그인은 최적화할 수 없는 코드를 식별하고 Rules of React를 강제합니다.

#### Expo 프로젝트

```bash
npx expo lint  # ESLint 설정 확인
npx expo install eslint-plugin-react-compiler -- -D
```

ESLint 구성:

```javascript
// .eslintrc.js
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const reactCompiler = require('eslint-plugin-react-compiler');

module.exports = defineConfig([
  expoConfig,
  reactCompiler.configs.recommended,
  {
    ignores: ['dist/*'],
  },
]);
```

#### React Native (Expo 없이)

```bash
npm install -D eslint-plugin-react-hooks@latest
```

컴파일러 규칙은 `recommended-latest` 프리셋에서 사용 가능합니다. [eslint-plugin-react-hooks 설치 안내](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks)를 따르세요.

### Step 5: 최적화 확인

React DevTools를 엽니다. 최적화된 컴포넌트에는 `Memo ✨` 배지가 표시됩니다.

빌드 출력을 확인하여 검증할 수도 있습니다—컴파일된 코드에는 자동 메모이제이션이 포함됩니다:

```javascript
import { c as _c } from 'react/compiler-runtime';

export default function MyApp() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for('react.memo_cache_sentinel')) {
    t0 = <div>Hello World</div>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}
```

**참고**: React Native 0.76+는 기본적으로 Memo 배지 지원이 포함된 DevTools를 포함합니다. 구버전이나 버전 불일치가 있는 서드파티 디버거의 경우 `package.json`에서 `react-devtools-core`를 재정의해야 할 수 있습니다.

## 점진적 도입

두 가지 전략을 사용하여 점진적으로 React Compiler를 도입할 수 있습니다:

### 전략 1: 특정 디렉토리로 제한

특정 파일(예: 다음 예제의 `src/path/to/dir`)에만 실행되도록 Babel 플러그인 구성:

**Expo** (`npx expo customize babel.config.js`로 `babel.config.js` 생성):

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          'react-compiler': {
            sources: (filename) => {
              return filename.includes('src/path/to/dir');
            },
          },
        },
      ],
    ],
  };
};
```

**React Native (Expo 없이)**:

```javascript
// babel.config.js
const ReactCompilerConfig = {
  target: '19',
  sources: (filename) => {
    return filename.includes('src/path/to/dir');
  },
};

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
  };
};
```

`babel.config.js` 변경 후 캐시를 지우고 Metro 재시작:

```bash
# Expo
npx expo start --clear

# React Native CLI
npx react-native start --reset-cache
```

### 전략 2: 특정 컴포넌트 제외

`"use no memo"` 지시어를 사용하여 특정 컴포넌트나 파일의 최적화를 건너뜁니다:

```jsx
function ProblematicComponent() {
  'use no memo';

  return <Text>최적화되지 않음</Text>;
}
```

문제를 일으키는 컴포넌트를 임시로 제외하는 데 유용합니다. 근본 문제를 수정한 후 지시어를 제거하세요.

## 작동 원리

컴파일러는 코드를 변환하여 자동으로 값을 캐시합니다:

**Before (작성한 코드):**

```jsx
export default function MyApp() {
  const [value, setValue] = useState('');
  return (
    <TextInput onChangeText={() => setValue(value)}>Hello World</TextInput>
  );
}
```

**After (컴파일된 출력):**

```jsx
import { c as _c } from 'react/compiler-runtime';

export default function MyApp() {
  const $ = _c(2); // 2개의 슬롯을 가진 캐시
  const [value, setValue] = useState('');

  let t0;
  if ($[0] !== value) {
    t0 = (
      <TextInput onChangeText={() => setValue(value)}>Hello World</TextInput>
    );
    $[0] = value;
    $[1] = t0;
  } else {
    t0 = $[1]; // 캐시된 JSX 반환
  }
  return t0;
}
```

## 코드 예제

### React Compiler Playground

[React Playground](https://playground.react.dev/)에서 변환을 테스트하세요.

### 최적화되는 것

```jsx
// 컴포넌트 - 자동 메모이제이션됨
const Button = ({ onPress, label }) => (
  <Pressable onPress={onPress}>
    <Text>{label}</Text>
  </Pressable>
);

// 콜백 - 자동 캐시됨 (useCallback 불필요)
const handlePress = () => {
  console.log('pressed');
};

// 비싼 연산 - 자동 캐시됨 (useMemo 불필요)
const filtered = items.filter((item) => item.active);
```

### 컴파일을 깨뜨리는 것

```jsx
// 나쁨: props 변경
const BadComponent = ({ items }) => {
  items.push('new item'); // 변경!
  return <List data={items} />;
};

// 나쁨: 렌더 중 변경
const BadMutation = () => {
  const [items, setItems] = useState([]);
  items.push('new'); // 렌더 중 변경!
  return <List data={items} />;
};

// 나쁨: 비멱등적 렌더
let counter = 0;
const BadRender = () => {
  counter++; // 렌더 중 부작용!
  return <Text>{counter}</Text>;
};
```

## 수동 메모이제이션을 제거해야 하나요?

개선 사항은 주로 자동입니다. 컴파일러가 프로젝트에서 올바르게 작동하면 자동 메모이제이션을 위해 `useCallback`, `useMemo`, `React.memo` 인스턴스를 제거할 수 있습니다.

**참고**: 클래스 컴포넌트는 최적화되지 않습니다. 모든 이점을 위해 함수 컴포넌트로 마이그레이션하세요.

Expo 구현은 애플리케이션 코드에만 실행됩니다(node_modules 제외). 클라이언트용 번들링 시에만 실행됩니다(서버 렌더링에서는 비활성화됨).

## 예상 성능 개선

Expensify 앱 테스트 결과:

- Chat Finder TTI에서 **4.3% 개선**
- 연쇄적 리렌더링 크게 감소
- 기존 수동 최적화가 없는 앱에 가장 큰 영향

이미 많이 최적화된 앱은 미미한 개선을 볼 수 있습니다.

## 흔한 실수

- **먼저 ESLint 오류 수정 안 함**: ESLint가 오류를 보고하면 컴파일러는 해당 컴포넌트를 건너뜁니다—이것은 안전하지만 최적화를 놓침
- **나쁜 패턴을 수정할 것으로 기대**: 컴파일러는 좋은 코드를 최적화하지, 나쁜 코드를 수정하지 않음
- **얕은 비교 잊기**: `memo`처럼 컴파일러는 객체/배열에 얕은 비교 사용
- **헬스체크 실행 안 함**: 활성화 전 항상 `npx react-compiler-healthcheck@latest` 실행

## 관련 스킬

- [js-profile-react.md](./js-profile-react.md) - 최적화 영향 확인
- [js-atomic-state.md](./js-atomic-state.md) - state 관련 리렌더링 대안
