---
title: 네이티브 SDK
impact: HIGH
tags: polyfills, intl, crypto, navigation, native
---

# Skill: 네이티브 SDK

더 나은 성능을 위해 웹 polyfill과 JS navigator를 네이티브 React Native 구현으로 교체합니다.

## 빠른 패턴

**Before (JS polyfills - 430+ KB):**

```tsx
import '@formatjs/intl-datetimeformat/polyfill';
import CryptoJS from 'crypto-js';
import { createStackNavigator } from '@react-navigation/stack';
```

**After (네이티브 구현):**

```tsx
// Hermes는 네이티브 Intl.DateTimeFormat 가짐 - polyfill 불필요
import { createHash } from 'react-native-quick-crypto';  // 58배 빠름
import { createNativeStackNavigator } from '@react-navigation/native-stack';
```

## 언제 사용하나요

- polyfill로 인한 큰 JS 번들
- 네비게이션이 네이티브처럼 느껴지지 않음
- Crypto 작업이 느림
- 국제화가 번들 크기 증가

## 단계별 가이드

### 1. 불필요한 Intl Polyfill 제거

Hermes는 이제 많은 `Intl` API를 네이티브로 지원합니다. import를 확인하세요:

```tsx
// BEFORE: 모든 polyfill (430+ KB)
import '@formatjs/intl-getcanonicallocales/polyfill';
import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-numberformat/polyfill';
import '@formatjs/intl-numberformat/locale-data/en';
import '@formatjs/intl-datetimeformat/polyfill';
import '@formatjs/intl-datetimeformat/locale-data/en';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/locale-data/en';
import '@formatjs/intl-displaynames/polyfill';
```

**Hermes 지원 (2025년 기준):**

| API | Hermes | Polyfill 유지? |
|-----|--------|----------------|
| `Intl.Collator` | ✅ | 아니오 |
| `Intl.DateTimeFormat` | ✅ | 아니오 |
| `Intl.NumberFormat` | ✅ | 아니오 |
| `Intl.getCanonicalLocales()` | ✅ | 아니오 |
| `Intl.supportedValuesOf()` | ✅ | 아니오 |
| `Intl.Locale` | ❌ | 예 |
| `Intl.PluralRules` | ❌ | 예 |
| `Intl.RelativeTimeFormat` | ❌ | 예 |
| `Intl.DisplayNames` | ❌ | 예 |
| `Intl.ListFormat` | ❌ | 예 |
| `Intl.Segmenter` | ❌ | 예 |

```tsx
// AFTER: 필요한 polyfill만
import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/locale-data/en';
import '@formatjs/intl-displaynames/polyfill';
```

### 2. 네이티브 Crypto 사용

JS crypto를 네이티브 C++ 구현으로 교체:

```bash
npm install react-native-quick-crypto
```

**성능**: `crypto-js`보다 최대 58배 빠름.

```tsx
// BEFORE: 느린 JS 구현
import CryptoJS from 'crypto-js';

// AFTER: 네이티브 C++ 구현
import { createHash } from 'react-native-quick-crypto';
```

필수 사항:
- Web3 지갑 시드 생성
- CSPRNG (암호학적으로 안전한 난수)
- 모든 무거운 암호화 작업

### 3. Native Stack Navigator 사용

```bash
npm install @react-navigation/native-stack react-native-screens
```

```tsx
// BEFORE: JS 기반 스택 (더 유연하지만 덜 네이티브)
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

// AFTER: 네이티브 스택 (네이티브 느낌, 더 나은 성능)
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

// 사용법은 거의 동일
<Stack.Navigator>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Details" component={DetailsScreen} />
</Stack.Navigator>
```

**이점:**
- 네이티브 네비게이션 애니메이션
- 플랫폼별 헤더 (iOS의 큰 제목)
- 더 낮은 메모리 사용량
- JS 스레드에서 작업 오프로드

### 4. Native Bottom Tabs 사용

```bash
npm install @bottom-tabs/react-navigation react-native-bottom-tabs
```

```tsx
// BEFORE: JS 탭
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tabs = createBottomTabNavigator();

// AFTER: 네이티브 탭
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
const Tabs = createNativeBottomTabNavigator();

<Tabs.Navigator>
  <Tabs.Screen name="Home" component={HomeScreen} />
  <Tabs.Screen name="Profile" component={ProfileScreen} />
</Tabs.Navigator>
```

## 권장 네이티브 라이브러리

| 카테고리 | 라이브러리 | 설명 |
|----------|---------|-------------|
| Navigation | `react-native-screens` | 네이티브 화면 컨테이너 |
| Menus | `zeego` | 네이티브 메뉴 (Radix 스타일 API) |
| Slider | `@react-native-community/slider` | 네이티브 슬라이더 |
| Date Picker | `react-native-date-picker` | 네이티브 날짜/시간 picker |
| Image | `react-native-fast-image` | 네이티브 이미지 캐싱 |

## 결정 매트릭스

| 시나리오 | 네이티브 사용? | 트레이드오프 |
|----------|-------------|----------|
| 표준 네비게이션 | ✅ 예 | 약간의 API 차이 |
| 커스텀 전환 애니메이션 | ⚠️ 아마도 | 네이티브는 더 제한적 |
| 플랫폼 일관성 UI | ✅ 예 | 커스터마이징 덜함 |
| 독특한/브랜드 디자인 | ⚠️ JS 고려 | 네이티브가 지원 안 할 수 있음 |

## 흔한 실수

- **모든 polyfill 필요하다고 가정**: 먼저 Hermes 호환성 확인
- **마이그레이션 노력 무시**: 네이티브 navigator는 약간 다른 API 가짐
- **네이티브 컴포넌트 과도한 커스터마이징**: 디자인이 많은 커스터마이징 필요하면 JS가 더 나을 수 있음

## 관련 스킬

- [bundle-analyze-js.md](./bundle-analyze-js.md) - Polyfill 영향 측정
- [bundle-library-size.md](./bundle-library-size.md) - 라이브러리 크기 비교
