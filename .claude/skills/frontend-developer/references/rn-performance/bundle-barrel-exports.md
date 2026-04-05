---
title: Barrel Export 피하기
impact: CRITICAL
tags: bundle, imports, barrel, tree-shaking
---

# Skill: Barrel Export 피하기

번들 크기를 줄이고 시작 시간을 개선하기 위해 barrel import(index 파일)를 리팩토링합니다.

## 빠른 패턴

**잘못된 방법:**

```tsx
import { Button } from './components';
// components/index.ts의 모든 export를 로드
```

**올바른 방법:**

```tsx
import Button from './components/Button';
// Button만 로드
```

## 언제 사용하나요

- 번들에 라이브러리의 미사용 코드가 포함될 때
- Metro에서 순환 의존성 경고가 발생할 때
- Hot Module Replacement (HMR)가 자주 중단될 때
- 모듈 평가로 인해 TTI가 느릴 때

## Barrel Export란 무엇인가요?

```tsx
// components/index.ts (barrel 파일)
export { Button } from './Button';
export { Card } from './Card';
export { Modal } from './Modal';
export { Sidebar } from './Sidebar';

// 사용 (barrel import)
import { Button } from './components';
```

## Barrel Import의 문제점

### 1. 번들 크기 오버헤드

Metro는 하나만 사용해도 **모든 export**를 포함합니다:

```tsx
// Button만 필요하지만 barrel 전체가 번들에 포함됨
import { Button } from './components';
// Card, Modal, Sidebar도 포함됨!
```

### 2. 런타임 오버헤드

모든 모듈이 import를 반환하기 전에 평가됩니다:

```tsx
import { Button } from './components';
// JavaScript가 평가해야 하는 것:
// - Button.tsx
// - Card.tsx
// - Modal.tsx
// - Sidebar.tsx
// Button만 사용하는데도!
```

### 3. 순환 의존성

Barrel 파일은 실수로 순환 참조를 만들기 쉽게 만듭니다:

```
Warning: Require cycle:
  components/index.ts -> Button.tsx -> utils/index.ts -> components/index.ts
```

HMR이 중단되고 예측할 수 없는 동작이 발생합니다.

## 해결책 1: 직접 Import

barrel import를 직접 경로로 교체:

```tsx
// 이전: Barrel import
import { Button, Card } from './components';

// 이후: 직접 import
import Button from './components/Button';
import Card from './components/Card';
```

### ESLint로 강제하기

```bash
npm install -D eslint-plugin-no-barrel-files
```

```javascript
// eslint.config.js
import noBarrelFiles from 'eslint-plugin-no-barrel-files';

export default [
  {
    plugins: { 'no-barrel-files': noBarrelFiles },
    rules: {
      'no-barrel-files/no-barrel-files': 'error',
    },
  },
];
```

## 해결책 2: Tree Shaking (자동)

tree shaking을 활성화하여 사용하지 않는 barrel export를 자동으로 제거합니다.

### Expo SDK 52+

```tsx
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: true,
  },
});

module.exports = config;
```

```bash
# .env
EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1
EXPO_UNSTABLE_TREE_SHAKING=1
```

### metro-serializer-esbuild

```bash
npm install @rnx-kit/metro-serializer-esbuild
```

### Re.Pack (Webpack/Rspack)

Tree shaking이 내장되어 있습니다.

## 실제 예제: date-fns

```tsx
// 나쁨: 전체 라이브러리 import
import { format, addDays, isToday } from 'date-fns';

// 좋음: 직접 import
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import isToday from 'date-fns/isToday';
```

## 라이브러리별 해결책

일부 라이브러리는 Babel 플러그인을 제공합니다:

### React Native Paper

```javascript
// babel.config.js
module.exports = {
  plugins: [
    'react-native-paper/babel',  // import를 자동 변환
  ],
};
```

변환:
```tsx
import { Button } from 'react-native-paper';
// 다음으로 변환:
import Button from 'react-native-paper/lib/module/components/Button';
```

## 리팩토링 전략

### 1단계: Barrel 파일 식별

여러 export가 있는 `index.ts` 파일 찾기:

```bash
grep -r "export \* from" src/
grep -r "export { .* } from" src/
```

### 2단계: Import 업데이트

```tsx
// 모든 사용처 찾기
// VS Code: Cmd+Shift+F로 "from './components'" 검색

// 각각을 직접 import로 교체
import Button from './components/Button';
```

### 3단계: (선택) 외부 API용 Barrel 유지

패키지가 다른 사람에 의해 사용되는 경우:

```tsx
// 패키지 API용 index.ts 유지
// components/index.ts
export { Button } from './Button';

// 내부 코드는 직접 import 사용
// src/screens/Home.tsx
import Button from '../components/Button';
```

## 마이그레이션 스크립트 예제

```bash
# codemod 또는 검색-교체 사용
# 찾기: import { (\w+) } from '\.\/components';
# 교체: import $1 from './components/$1';
```

## 검증

리팩토링 후:

1. 번들 분석 실행 ([bundle-analyze-js.md](./bundle-analyze-js.md) 참조)
2. 전후 크기 비교
3. 순환 의존성 경고 확인

## 일반적인 함정

- **외부 사용자 중단**: 라이브러리를 퍼블리싱하는 경우 public API용 barrel 유지
- **IDE 자동 import**: 직접 import를 선호하도록 IDE 설정
- **일관성 없는 패턴**: 팀 전체에 ESLint로 강제

## 관련 스킬

- [bundle-analyze-js.md](./bundle-analyze-js.md) - 영향 확인
- [bundle-tree-shaking.md](./bundle-tree-shaking.md) - 자동 해결책
- [bundle-library-size.md](./bundle-library-size.md) - 라이브러리 패턴 확인
