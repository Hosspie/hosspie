---
title: Tree Shaking
impact: HIGH
tags: bundle, tree-shaking, dead-code, metro, repack
---

# Skill: Tree Shaking

사용하지 않는 export를 JavaScript 번들에서 제거하기 위해 dead code elimination을 활성화합니다.

## 빠른 설정

```bash
# .env (Expo SDK 52+)
EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1
EXPO_UNSTABLE_TREE_SHAKING=1
```

```javascript
// metro.config.js
config.transformer.getTransformOptions = async () => ({
  transform: { experimentalImportSupport: true },
});
```

```javascript
// babel.config.js (non-Expo 프로젝트는 `disableImportExportTransform` 설정 필수)
module.exports = {
  presets: [
    [
      'module:@react-native/babel-preset',
      { disableImportExportTransform: true },
    ],
  ],
};
```

## 사용 시기

- 번들에 사용하지 않는 라이브러리 코드 포함
- 자동 배럴 export 최적화 원함
- Expo SDK 52+ 사용 (권장 접근법)
- 프로젝트가 이미 Re.Pack (`@callstack/repack`) 사용

## 플랫폼 지원

| Bundler        | Tree Shaking    | 참고                        |
| -------------- | --------------- | ---------------------------- |
| Metro          | ❌ 아니오       | metro-serializer-esbuild 사용 |
| Expo (SDK 52+) | ✅ 실험적       | 설정 필요              |
| Re.Pack        | ✅ 예          | Webpack/Rspack을 통해 내장  |

## 설정: Expo SDK 52+

### 1. Import 지원 활성화

```javascript
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

### 2. Tree Shaking 활성화

`.env` 생성/편집:

```bash
EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1
EXPO_UNSTABLE_TREE_SHAKING=1
```

**참고**: 프로덕션 빌드에만 적용됩니다.

## 설정: Metro with ESBuild

```bash
npm install @rnx-kit/metro-serializer-esbuild
```

metro.config.js에서 설정합니다.

## 설정: Re.Pack (이미 설치된 경우에만)

> **중요**: Re.Pack (`@callstack/repack`)은 Rspack/Webpack을 사용하는 커스텀 번들러입니다. 프로젝트에 Re.Pack이 이미 구성되어 있는 경우에만 이 지침을 적용하세요. 코드베이스를 Re.Pack으로 마이그레이션하도록 제안하지 마세요—거의 필요하지 않으며 상당한 설정이 필요합니다.

**프로젝트의 의존성에 `@callstack/repack`이 있는 경우:**

Tree shaking은 Rspack에서 기본적으로 활성화됩니다. 설정에서 확인:

```javascript
// rspack.config.js 또는 webpack.config.js
module.exports = {
  optimization: {
    usedExports: true, // 사용하지 않는 export 표시
    minimize: true, // minification 중에 제거
  },
};
```

## Platform Shaking

`Platform.OS`와 `Platform.select` 확인 내부의 코드는 다른 플랫폼에서 제거됩니다:

```tsx
// 중요: 'react-native'에서 Platform을 직접 import
import { Platform } from 'react-native';

if (Platform.OS === 'ios') {
  // Android 번들에서 제거됨
}

if (Platform.select({ ios: true, android: false }) === 'ios') {
  // Android 번들에서 제거됨
}
```

**중요**: 직접 import를 사용해야 합니다. 이것은 작동하지 않습니다:

```tsx
import * as RN from 'react-native';
if (RN.Platform.OS === 'ios') {
  // 제거되지 않음 - 최적화 실패
}
```

non-Expo 프로젝트의 경우, Metro 설정에서 `experimentalImportSupport: true`와 Babel 설정에서 `disableImportExportTransform: true`가 모두 필요합니다.

영향: React Native Community CLI 프로젝트에서 platform shaking을 활성화하면 절감:
- 5% 작은 Hermes bytecode (2.79 MB → 2.64 MB)
- 15% 작은 minified JS 번들 (1 MB → 0.85 MB)

## Tree Shaking 요구사항

### ESM Import 필요

```tsx
// ✅ ESM - Tree shakeable
import { foo } from './module';

// ❌ CommonJS - Tree shakeable하지 않음
const { foo } = require('./module');
```

### Side Effects 선언

라이브러리는 `package.json`에서 side-effect-free로 선언해야 합니다:

```json
{
  "sideEffects": false
}
```

또는 side effect가 있는 파일 지정:

```json
{
  "sideEffects": ["*.css", "./src/polyfills.js"]
}
```

## 크기 영향

| Bundle Type       | Metro (MB) | Re.Pack (MB) | 변화   |
| ----------------- | ---------- | ------------ | -------- |
| Production        | 35.63      | 38.48        | +8%      |
| Prod Minified     | 15.54      | 13.36        | **-14%** |
| Prod HBC          | 21.79      | 19.35        | **-11%** |
| Prod Minified HBC | 21.62      | 19.05        | **-12%** |

**예상 개선**: 10-15% 번들 크기 감소.

## 검증

1. 프로덕션 번들 빌드 ([bundle-analyze-js.md](./bundle-analyze-js.md) 참조)
2. source-map-explorer로 분석 ([bundle-analyze-js.md](./bundle-analyze-js.md) 참조)
3. 사용하지 않는다고 알고 있는 함수 검색
4. 발견되면 → tree shaking 작동하지 않음

### 테스트 예제

```tsx
// test-treeshake.js
export const usedFunction = () => 'used';
export const unusedFunction = () => 'unused'; // 제거되어야 함

// app.js
import { usedFunction } from './test-treeshake';
```

빌드 후, 번들에서 `unusedFunction`을 검색합니다. 존재하지 않아야 합니다.

## 일반적인 함정

- **프로덕션 빌드를 사용하지 않음**: Tree shaking은 프로덕션에서만
- **CommonJS 모듈**: 완전한 효과를 위해 ESM 필요
- **Side effects 선언되지 않음**: 라이브러리가 shakeable하지 않을 수 있음
- **동적 import**: `require(variable)`은 분석을 방해
- **Babel/Metro 설정 불일치**: `disableImportExportTransform`이 `experimentalImportSupport`와 일치해야 함

## 관련 스킬

- [bundle-analyze-js.md](./bundle-analyze-js.md) - tree shaking 효과 확인
- [bundle-barrel-exports.md](./bundle-barrel-exports.md) - 수동 대안
- [bundle-code-splitting.md](./bundle-code-splitting.md) - Re.Pack code splitting
