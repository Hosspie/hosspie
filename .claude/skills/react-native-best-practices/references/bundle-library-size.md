---
title: 라이브러리 크기 확인
impact: MEDIUM
tags: dependencies, bundlephobia, library-size
---

# Skill: 라이브러리 크기 확인

프로젝트에 추가하기 전에 서드파티 라이브러리의 크기 영향을 평가합니다.

## 빠른 명령

```bash
# 설치 전 크기 확인
# 방문: https://bundlephobia.com/package/[package-name]

# 또는 CLI 사용
npx bundle-phobia-cli <package-name>
```

## 사용 시기

- 새로운 의존성 평가
- 대체 라이브러리 비교
- 기존 의존성 감사
- 번들 비대화 조사

## 도구 개요

| 도구 | 유형 | 적합한 용도 |
|------|------|----------|
| bundlephobia.com | 웹 | 빠른 크기 확인 |
| pkg-size.dev | 웹 | 백업/대안 |
| Import Cost (VS Code) | IDE 확장 | 실시간 피드백 |

## bundlephobia.com

### 사용법

[bundlephobia.com](https://bundlephobia.com)을 방문하여 패키지 이름을 입력합니다.

### 표시 항목

- **Minified 크기**: 원시 JS 크기
- **Minified + Gzipped**: 네트워크 전송 크기
- **다운로드 시간**: 다양한 연결에서 예상 시간
- **의존성**: 함께 가져오는 항목
- **구성**: 의존성별 분류

### 예제 분석

```
react-native-paper
├── Minified: 312 kB
├── Gzipped: 78 kB
└── Dependencies: 12 packages
    ├── @callstack/react-theme-provider
    ├── color
    └── ...
```

## pkg-size.dev

bundlephobia가 실패할 때 백업으로 사용합니다.

[pkg-size.dev](https://pkg-size.dev)를 패키지 이름과 함께 방문하세요.

**차이점**: 웹 컨테이너에서 패키지를 실제로 설치하므로 엣지 케이스에서 더 정확할 수 있습니다.

## Import Cost (VS Code 확장)

### 설치

VS Code 확장에서 "Import Cost"를 검색하거나:

```bash
code --install-extension wix.vscode-import-cost
```

### 사용법

import 옆에 인라인으로 크기 표시:

```tsx
import React from 'react';           // 6.5K (gzipped)
import { View, Text } from 'react-native';  // 0B (네이티브)
import lodash from 'lodash';         // 71.5K (gzipped: 24.7K)
import get from 'lodash/get';        // 8K (gzipped: 2.9K)
```

### 제한사항

- 내부적으로 Webpack 사용 (Metro 아님)
- React Native 전용 패키지에서 실패할 수 있음
- tree shaking을 고려하지 않음

## 비교 워크플로우

### 의존성 추가 전

1. bundlephobia에서 확인:
   ```
   https://bundlephobia.com/package/[package-name]
   ```

2. 대안 비교:
   ```
   moment (289 kB) vs date-fns (75 kB) vs dayjs (6 kB)
   ```

3. 실제로 필요한 것 확인:
   - 전체 라이브러리 import vs 특정 함수
   - 네이티브 대안 사용 가능?

### 추가 후

1. 번들 분석 (see [bundle-analyze-js.md](./bundle-analyze-js.md))
2. 실제 영향이 예상과 일치하는지 확인
3. 중복 의존성 확인

## 크기 가이드라인

| 크기 (gzipped) | 평가 | 조치 |
|----------------|------------|--------|
| < 5 KB | 작음 | 일반적으로 괜찮음 |
| 5-20 KB | 중간 | 필요성 평가 |
| 20-50 KB | 큼 | 대안 찾기 |
| > 50 KB | 매우 큼 | 강력한 정당화 필요 |

## 일반적인 큰 의존성

| 라이브러리 | 크기 (gzipped) | 대안 |
|---------|----------------|-------------|
| moment | ~70 KB | dayjs (~3 KB) |
| lodash (전체) | ~25 KB | lodash-es + 직접 import |
| aws-sdk (전체) | 200+ KB | @aws-sdk/client-* |
| crypto-js | ~15 KB | react-native-quick-crypto |

## 빠른 크기 확인 스크립트

```bash
# 설치 전 크기 확인
npx bundle-phobia-cli <package-name>

# 또는 npm 직접 사용 (덜 정확)
npm pack <package-name> --dry-run 2>&1 | grep "total files"
```

## 의사결정 매트릭스

| 요소 | JS 라이브러리 유지 | 네이티브 대안 사용 |
|--------|-----------------|------------------------|
| 크기 | > 50 KB | < 50 KB |
| 플랫폼 커버리지 | 양쪽 플랫폼 | 단일 플랫폼 OK |
| 성능 | 중요하지 않음 | 중요 경로 |
| 기능 | 간단 | 복잡한 계산 |

## 코드 예제: import 최적화

```tsx
// 나쁨: 전체 라이브러리 (71.5 KB)
import _ from 'lodash';
_.get(obj, 'path.to.value');

// 더 나음: 특정 import (8 KB)
import get from 'lodash/get';
get(obj, 'path.to.value');

// 최고: 네이티브 JS (0 KB)
obj?.path?.to?.value;
```

## 관련 스킬

- [bundle-analyze-js.md](./bundle-analyze-js.md) - 실제 번들 영향 확인
- [bundle-barrel-exports.md](./bundle-barrel-exports.md) - import 방법 최적화
- [native-sdks-over-polyfills.md](./native-sdks-over-polyfills.md) - JS 라이브러리의 네이티브 대안
