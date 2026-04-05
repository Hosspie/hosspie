# React Native 성능 최적화 가이드

> 출처: Callstack의 "Ultimate Guide to React Native Optimization"

## 개요

JavaScript/React, Native(iOS/Android), 번들링 최적화를 다루는 React Native 애플리케이션 성능 최적화 가이드입니다. Callstack의 "Ultimate Guide to React Native Optimization"을 기반으로 합니다.

## 스킬 형식

각 참조 파일은 빠른 검색과 깊은 이해를 위한 하이브리드 형식을 따릅니다:

- **Quick Pattern**: 즉각적인 패턴 매칭을 위한 잘못된/올바른 코드 스니펫
- **Quick Command**: 프로세스/측정 스킬을 위한 쉘 명령어
- **Quick Config**: 설정 중심 스킬을 위한 구성 스니펫
- **Quick Reference**: 개념적 스킬을 위한 요약 테이블
- **Deep Dive**: 사용 시기, 전제 조건, 단계별 가이드, 일반적인 함정을 포함한 전체 컨텍스트

**영향도 평가**: CRITICAL (즉시 수정), HIGH (상당한 개선), MEDIUM (가치 있는 최적화)

## 적용 시기

다음과 같은 경우 이 가이드라인을 참조하세요:
- 느리거나 끊기는 UI 또는 애니메이션 디버깅
- 메모리 누수 조사 (JS 또는 네이티브)
- 앱 시작 시간(TTI) 최적화
- 번들 또는 앱 크기 줄이기
- 네이티브 모듈(Turbo Modules) 작성
- React Native 성능 프로파일링
- React Native 코드 성능 검토

## 우선순위별 가이드라인

| 우선순위 | 카테고리 | 영향도 | 접두사 |
|----------|----------|--------|--------|
| 1 | FPS & 리렌더링 | CRITICAL | `js-*` |
| 2 | 번들 크기 | CRITICAL | `bundle-*` |
| 3 | TTI 최적화 | HIGH | `native-*`, `bundle-*` |
| 4 | 네이티브 성능 | HIGH | `native-*` |
| 5 | 메모리 관리 | MEDIUM-HIGH | `js-*`, `native-*` |
| 6 | 애니메이션 | MEDIUM | `js-*` |

## 빠른 참조

### 중요: FPS & 리렌더링

**먼저 프로파일링:**
```bash
# React Native DevTools 열기
# Metro에서 'j' 누르기, 또는 기기를 흔들어 → "Open DevTools"
```

**일반적인 해결책:**
- 리스트에는 ScrollView 대신 FlatList/FlashList 사용
- 자동 메모이제이션을 위해 React Compiler 사용
- 리렌더링 줄이기 위해 atomic state (Jotai/Zustand) 사용
- 비용이 큰 연산에 `useDeferredValue` 사용

### 중요: 번들 크기

**번들 분석:**
```bash
npx react-native bundle \
  --entry-file index.js \
  --bundle-output output.js \
  --platform ios \
  --sourcemap-output output.js.map \
  --dev false --minify true

npx source-map-explorer output.js --no-border-checks
```

**일반적인 해결책:**
- barrel import 피하기 (소스에서 직접 import)
- 불필요한 Intl polyfill 제거 (Hermes는 네이티브 지원)
- tree shaking 활성화 (Expo SDK 52+ 또는 Re.Pack)
- Android 네이티브 코드 축소를 위해 R8 활성화

### 높음: TTI 최적화

**TTI 측정:**
- 마커를 위해 `react-native-performance` 사용
- cold start만 측정 (warm/hot/prewarm 제외)

**일반적인 해결책:**
- Android에서 JS 번들 압축 비활성화 (Hermes mmap 활성화)
- 네이티브 내비게이션 사용 (react-native-screens)
- `InteractionManager`로 중요하지 않은 작업 연기

### 높음: 네이티브 성능

**네이티브 프로파일링:**
- iOS: Xcode Instruments → Time Profiler
- Android: Android Studio → CPU Profiler

**일반적인 해결책:**
- 무거운 네이티브 작업에 백그라운드 스레드 사용
- Turbo Module 메서드에서 sync보다 async 선호
- 크로스 플랫폼 성능 중요 코드에 C++ 사용

## 참조 문서

같은 디렉토리(`rn-performance/`)에 코드 예제가 포함된 전체 문서:

### JavaScript/React (`js-*`)

| 파일 | 영향도 | 설명 |
|------|--------|-------------|
| `js-lists-flatlist-flashlist.md` | CRITICAL | ScrollView를 가상화된 리스트로 대체 |
| `js-profile-react.md` | MEDIUM | React DevTools 프로파일링 |
| `js-measure-fps.md` | HIGH | FPS 모니터링 및 측정 |
| `js-memory-leaks.md` | MEDIUM | JS 메모리 누수 추적 |
| `js-atomic-state.md` | HIGH | Jotai/Zustand 패턴 |
| `js-concurrent-react.md` | HIGH | useDeferredValue, useTransition |
| `js-react-compiler.md` | HIGH | 자동 메모이제이션 |
| `js-animations-reanimated.md` | MEDIUM | Reanimated worklets |
| `js-uncontrolled-components.md` | HIGH | TextInput 최적화 |

### Native (`native-*`)

| 파일 | 영향도 | 설명 |
|------|--------|-------------|
| `native-turbo-modules.md` | HIGH | 빠른 네이티브 모듈 빌드 |
| `native-sdks-over-polyfills.md` | HIGH | 네이티브 vs JS 라이브러리 |
| `native-measure-tti.md` | HIGH | TTI 측정 설정 |
| `native-threading-model.md` | HIGH | Turbo Module 스레드 |
| `native-profiling.md` | MEDIUM | Xcode/Android Studio 프로파일링 |
| `native-platform-setup.md` | MEDIUM | iOS/Android 도구 가이드 |
| `native-view-flattening.md` | MEDIUM | View 계층 디버깅 |
| `native-memory-patterns.md` | MEDIUM | C++/Swift/Kotlin 메모리 |
| `native-memory-leaks.md` | MEDIUM | 네이티브 메모리 누수 추적 |
| `native-android-16kb-alignment.md` | CRITICAL | Google Play용 서드파티 라이브러리 정렬 |

### Bundling (`bundle-*`)

| 파일 | 영향도 | 설명 |
|------|--------|-------------|
| `bundle-barrel-exports.md` | CRITICAL | barrel import 피하기 |
| `bundle-analyze-js.md` | CRITICAL | JS 번들 시각화 |
| `bundle-tree-shaking.md` | HIGH | 데드 코드 제거 |
| `bundle-analyze-app.md` | HIGH | 앱 크기 분석 |
| `bundle-r8-android.md` | HIGH | Android 코드 축소 |
| `bundle-hermes-mmap.md` | HIGH | 번들 압축 비활성화 |
| `bundle-native-assets.md` | HIGH | Asset catalog 설정 |
| `bundle-library-size.md` | MEDIUM | 의존성 평가 |
| `bundle-code-splitting.md` | MEDIUM | Re.Pack 코드 분할 |

## 참조 문서 검색

```bash
# 키워드로 패턴 찾기
grep -l "reanimated" references/
grep -l "flatlist" references/
grep -l "memory" references/
grep -l "profil" references/
grep -l "tti" references/
grep -l "bundle" references/
```

## 문제 → 스킬 매핑

| 문제 | 시작할 문서 |
|---------|------------|
| 앱이 느리거나 끊김 | `js-measure-fps.md` → `js-profile-react.md` |
| 과도한 리렌더링 | `js-profile-react.md` → `js-react-compiler.md` |
| 느린 시작 (TTI) | `native-measure-tti.md` → `bundle-analyze-js.md` |
| 큰 앱 크기 | `bundle-analyze-app.md` → `bundle-r8-android.md` |
| 메모리 증가 | `js-memory-leaks.md` 또는 `native-memory-leaks.md` |
| 애니메이션 프레임 드롭 | `js-animations-reanimated.md` |
| 리스트 스크롤 끊김 | `js-lists-flatlist-flashlist.md` |
| TextInput 지연 | `js-uncontrolled-components.md` |
| 네이티브 모듈 느림 | `native-turbo-modules.md` → `native-threading-model.md` |
| 네이티브 라이브러리 정렬 문제 | `native-android-16kb-alignment.md` |

## 출처

Callstack의 "The Ultimate Guide to React Native Optimization"을 기반으로 합니다.
