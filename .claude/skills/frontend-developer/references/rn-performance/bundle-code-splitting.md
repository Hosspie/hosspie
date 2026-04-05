---
title: 원격 코드 로딩
impact: MEDIUM
tags: code-splitting, repack, lazy-loading, chunks
---

# Skill: 원격 코드 로딩

Re.Pack을 사용하여 온디맨드 번들 로딩을 위한 코드 스플리팅을 설정합니다.

## 빠른 패턴

**이전 (정적 import):**

```jsx
import SettingsScreen from './screens/SettingsScreen';
```

**이후 (lazy loaded chunk):**

```jsx
const SettingsScreen = React.lazy(() =>
  import(/* webpackChunkName: "settings" */ './screens/SettingsScreen')
);

<Suspense fallback={<Loading />}>
  <SettingsScreen />
</Suspense>
```

## 사용 시기

다음과 같은 경우 코드 스플리팅을 고려하세요:
- **Hermes를 사용하지 않는 경우** (JSC/V8이 더 큰 이점)
- 앱 크기가 200 MB 초과 (Play Store 제한)
- 마이크로 프론트엔드 아키텍처 구축
- 사용자 권한에 따라 기능 로딩
- 다른 최적화를 모두 시도한 경우

**참고**: Hermes는 이미 효율적인 번들 읽기를 위해 메모리 매핑을 사용합니다. Hermes에서 코드 스플리팅의 이점은 최소화되거나 경우에 따라 역효과가 날 수 있습니다.

## 사전 요구사항

- Re.Pack 설치 (Metro 대체)

```bash
npx @callstack/repack-init
```

## 단계별 가이드

### 1. Re.Pack 초기화

```bash
npx @callstack/repack-init
```

프롬프트를 따라 Metro에서 마이그레이션합니다. [마이그레이션 가이드](https://re-pack.dev/docs/getting-started/quick-start)를 확인하세요.

### 2. React.lazy로 Split Point 생성

```tsx
// 이전: 정적 import
import SettingsScreen from './screens/SettingsScreen';

// 이후: 동적 import (split point 생성)
const SettingsScreen = React.lazy(() =>
  import(/* webpackChunkName: "settings" */ './screens/SettingsScreen')
);
```

### 3. Suspense로 감싸기

```tsx
import React, { Suspense } from 'react';

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SettingsScreen />
    </Suspense>
  );
};
```

### 4. Chunk 로딩 설정

```tsx
// index.js (AppRegistry 전)
import { ScriptManager, Script } from '@callstack/repack/client';

ScriptManager.shared.addResolver((scriptId) => ({
  url: __DEV__
    ? Script.getDevServerURL(scriptId)  // 개발 서버
    : `https://my-cdn.com/assets/${scriptId}`,  // 프로덕션 CDN
}));

AppRegistry.registerComponent(appName, () => App);
```

### 5. Chunk 빌드 및 배포

빌드 시 생성되는 파일:
- `index.bundle` - 메인 번들
- `settings.chunk.bundle` - Lazy-loaded chunk

설정된 URL로 chunk를 CDN에 배포합니다.

## 완전한 예제

```tsx
// App.tsx
import React, { Suspense, useState } from 'react';
import { Button, View, ActivityIndicator } from 'react-native';

// 무거운 기능을 lazy load
const HeavyFeature = React.lazy(() =>
  import(/* webpackChunkName: "heavy-feature" */ './HeavyFeature')
);

const App = () => {
  const [showFeature, setShowFeature] = useState(false);

  return (
    <View>
      <Button
        title="Load Feature"
        onPress={() => setShowFeature(true)}
      />

      {showFeature && (
        <Suspense fallback={<ActivityIndicator />}>
          <HeavyFeature />
        </Suspense>
      )}
    </View>
  );
};
```

## Module Federation (고급)

마이크로 프론트엔드 아키텍처용:

```tsx
// 호스트 앱이 원격 모듈 로드
const RemoteModule = React.lazy(() =>
  import('remote-app/Module')
);
```

가능한 기능:
- 독립적인 팀 배포
- 의존성 공유
- 런타임 컴포지션

**복잡성 경고**: 조직적 이점이 오버헤드를 상회할 때만 사용하세요.

### 버전 관리

다음을 위해 [Zephyr Cloud](https://zephyr-cloud.io/) 고려:
- 서브초 배포
- 버전 관리
- Re.Pack 통합

## 캐싱 전략

```tsx
ScriptManager.shared.addResolver((scriptId) => ({
  url: `https://my-cdn.com/${scriptId}`,
  cache: {
    // 캐싱 활성화
    enabled: true,
    // 캐시 위치
    path: `${FileSystem.cacheDirectory}/chunks/`,
  },
}));
```

## 사용하지 말아야 할 경우

| 시나리오 | 이유 |
|----------|---------|
| Hermes 사용 중 | mmap이 이미 효율적 |
| 작은 앱 | 오버헤드가 가치 없음 |
| 단순한 네비게이션 | 네이티브 네비게이션이 더 나음 |
| 빠른 반복 필요 | 복잡성 증가 |

## Hermes 메모리 매핑

Hermes는 mmap을 통해 bytecode를 lazy하게 읽습니다:
- 실행된 코드만 메모리에 로드
- 파싱 단계 불필요
- 코드 스플리팅이 제공하는 이점은 미미

## 검증

```tsx
// chunk가 올바르게 로드되었는지 확인
ScriptManager.shared.on('loading', (scriptId) => {
  console.log(`Loading: ${scriptId}`);
});

ScriptManager.shared.on('loaded', (scriptId) => {
  console.log(`Loaded: ${scriptId}`);
});

ScriptManager.shared.on('error', (scriptId, error) => {
  console.error(`Failed: ${scriptId}`, error);
});
```

## 일반적인 함정

- **Suspense 잊어버림**: Lazy 컴포넌트는 fallback 필요
- **잘못된 CDN 경로**: 프로덕션에서 chunk가 404
- **캐싱 없음**: 매번 다시 다운로드
- **너무 많은 chunk**: 네트워크 오버헤드가 절약분 초과

## 관련 스킬

- [bundle-tree-shaking.md](./bundle-tree-shaking.md) - Re.Pack tree shaking
- [bundle-analyze-js.md](./bundle-analyze-js.md) - chunk 크기 측정
- [native-measure-tti.md](./native-measure-tti.md) - TTI 영향 검증
