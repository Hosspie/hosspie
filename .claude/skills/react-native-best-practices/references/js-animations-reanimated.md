---
title: 고성능 애니메이션
impact: MEDIUM
tags: reanimated, animations, worklets, ui-thread
---

# Skill: 고성능 애니메이션

React Native Reanimated와 InteractionManager를 사용하여 60+ FPS의 부드러운 애니메이션을 구현하세요.

## 빠른 패턴

**잘못된 방법 (JS 스레드 - 무거운 작업 시 블로킹됨):**

```jsx
const opacity = useRef(new Animated.Value(0)).current;
Animated.timing(opacity, { toValue: 1 }).start();
```

**올바른 방법 (UI 스레드 - JS 작업 중에도 부드러움):**

```jsx
const opacity = useSharedValue(0);
const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
opacity.value = withTiming(1);
```

## 사용 시기

- 애니메이션이 프레임을 드롭하거나 버벅거릴 때
- 애니메이션 중 UI가 멈출 때
- 제스처 기반 애니메이션이 필요할 때
- 무거운 JS 작업 중에도 애니메이션을 실행하고 싶을 때

## 사전 요구사항

- `react-native-reanimated` (v4+) 및 `react-native-worklets` 설치

```bash
npm install react-native-reanimated react-native-worklets
```

`babel.config.js`에 추가:

```javascript
module.exports = {
  plugins: ['react-native-worklets/plugin'],  // 마지막에 위치해야 함
};
```

> **참고**: Reanimated 4는 React Native의 **New Architecture** (Fabric + TurboModules)가 필요합니다. Legacy Architecture는 더 이상 지원되지 않습니다. v3에서 업그레이드하는 경우, 이 문서 끝부분의 마이그레이션 노트를 참조하세요.

## 핵심 개념

### Main Thread vs JS Thread

- **Main/UI Thread**: 네이티브 렌더링 처리 (60+ FPS 목표)
- **JS Thread**: React와 JavaScript 실행

**문제점**: 무거운 JS 작업이 JS 스레드에서 실행되는 애니메이션을 차단합니다.

**해결책**: Reanimated worklets로 UI 스레드에서 애니메이션 실행

## 단계별 지침

### 1. 기본 애니메이션 스타일 (UI Thread)

```jsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';

const FadeInView = () => {
  const opacity = useSharedValue(0);

  // UI 스레드에서 실행 - JS에 의해 차단되지 않음
  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
  }, []);

  return <Animated.View style={[styles.box, animatedStyle]} />;
};
```

### 2. `scheduleOnUI`로 UI Thread에서 코드 실행

```jsx
import { scheduleOnUI } from 'react-native-worklets';

const triggerAnimation = () => {
  scheduleOnUI(() => {
    'worklet';
    console.log('UI 스레드에서 실행 중');
    // 여기서 직접 UI 조작
  });
};
```

### 3. `scheduleOnRN`으로 UI Thread에서 JS 호출

```jsx
import { scheduleOnRN } from 'react-native-worklets';

// 일반 JS 함수
const trackAnalytics = (value) => {
  analytics.track('animation_complete', { value });
};

const AnimatedComponent = () => {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    // 애니메이션 완료 시 JS 함수 호출
    if (progress.value === 1) {
      scheduleOnRN(trackAnalytics, progress.value);
    }
    return { opacity: progress.value };
  });

  return <Animated.View style={animatedStyle} />;
};
```

### 4. 콜백이 있는 애니메이션

```jsx
import { scheduleOnRN } from 'react-native-worklets';

const AnimatedButton = () => {
  const scale = useSharedValue(1);

  const onComplete = () => {
    console.log('애니메이션 완료!');
  };

  const handlePress = () => {
    scale.value = withTiming(
      1.2,
      { duration: 200 },
      (finished) => {
        if (finished) {
          scheduleOnRN(onComplete);
        }
      }
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[styles.button, animatedStyle]}>
        <Text>Press Me</Text>
      </Animated.View>
    </Pressable>
  );
};
```

## 무거운 작업을 위한 InteractionManager

애니메이션이 완료될 때까지 비용이 많이 드는 JS 작업을 지연시킵니다:

```jsx
import { InteractionManager } from 'react-native';

const ScreenWithAnimation = () => {
  useEffect(() => {
    // 애니메이션/인터랙션이 완료된 후 스케줄링
    const task = InteractionManager.runAfterInteractions(() => {
      // 여기서 무거운 연산 수행
      loadExpensiveData();
    });

    return () => task.cancel();
  }, []);

  return <AnimatedHeader />;
};
```

### React Navigation과 함께 사용

```jsx
import { useFocusEffect } from '@react-navigation/native';

const Screen = () => {
  useFocusEffect(
    useCallback(() => {
      // 화면 전환 애니메이션이 완료될 때까지 대기
      const task = InteractionManager.runAfterInteractions(() => {
        fetchData();
        renderExpensiveComponent();
      });

      return () => task.cancel();
    }, [])
  );

  return <View>...</View>;
};
```

### 커스텀 Interaction Handle

```jsx
import { scheduleOnRN } from 'react-native-worklets';

// 애니메이션을 "interaction"으로 표시
const handle = InteractionManager.createInteractionHandle();

// 애니메이션 실행...
animatedValue.value = withTiming(100, {}, () => {
  // 완료 시 핸들 정리
  scheduleOnRN(InteractionManager.clearInteractionHandle, handle);
});
```

## 언제 무엇을 사용할지

| 스레드 | 최적 용도 |
|--------|----------|
| **UI Thread** (worklets) | 시각적 애니메이션, 변형, 제스처 |
| **JS Thread** | 상태 업데이트, 데이터 처리, API 호출 |

| Hook/API | 사용 사례 |
|----------|----------|
| `useAnimatedStyle` | 애니메이션 스타일 (자동으로 UI 스레드) |
| `scheduleOnUI` | 수동 UI 스레드 실행 (`react-native-worklets`에서) |
| `scheduleOnRN` | worklets에서 JS 함수 호출 (`react-native-worklets`에서) |
| `InteractionManager` | 애니메이션 완료까지 무거운 JS 지연 |
| `useTransition` | React 상태 기반 지연의 대안 |

## 일반적인 함정

- **worklets에서 React state 접근**: 애니메이션 값에는 `useState` 대신 `useSharedValue` 사용
- **Animated 컴포넌트 미사용**: `Animated.View`, `Animated.Text` 등을 사용해야 함
- **useAnimatedStyle에서 무거운 연산**: worklets를 빠르게 유지
- **'worklet' 지시어 누락**: 인라인 worklet 함수에 필요

```jsx
// 나쁨: useAnimatedStyle에서 일반 함수
const style = useAnimatedStyle(() => {
  heavyComputation();  // UI 스레드 차단!
  return { opacity: 1 };
});

// 좋음: worklets를 빠르게 유지
const style = useAnimatedStyle(() => {
  return { opacity: opacity.value };  // 값만 읽기
});
```

## Reanimated 3.x에서 4.x로 마이그레이션

Reanimated 3.x에서 업그레이드하는 경우, 주요 변경 사항은 다음과 같습니다.

> **v4로 업그레이드할 수 없나요?** 프로젝트가 New Architecture로 마이그레이션하지 못하는 경우(예: 호환되지 않는 네이티브 라이브러리, 복잡한 네이티브 코드, 타임라인 제약), 기존 API를 계속 사용하고 가능한 경우 네이티브 드라이버를 활용하세요. 향후 마이그레이션 복잡성을 줄이기 위해 legacy Reanimated 3.x 이하 버전 도입을 피하세요.

### Breaking Changes

| 기존 API (v3) | 새 API (v4) | 패키지 |
|--------------|--------------|---------|
| `runOnUI(() => {...})()` | `scheduleOnUI(() => {...})` | `react-native-worklets` |
| `runOnJS(fn)(args)` | `scheduleOnRN(fn, args)` | `react-native-worklets` |
| `executeOnUIRuntimeSync` | `runOnUISync` | `react-native-worklets` |
| `runOnRuntime` | `scheduleOnRuntime` | `react-native-worklets` |
| `useScrollViewOffset` | `useScrollOffset` | `react-native-reanimated` |
| `useWorkletCallback` | `'worklet';` 지시어와 함께 `useCallback` 사용 | React |

### 제거된 API

- `useAnimatedGestureHandler` - `react-native-gesture-handler` v2+의 Gesture API로 마이그레이션
- `addWhitelistedNativeProps` / `addWhitelistedUIProps` - 더 이상 필요하지 않음
- `combineTransition` - `EntryExitTransition.entering(...).exiting(...)` 대신 사용

### withSpring 변경 사항

```jsx
// 이전 (v3)
withSpring(value, {
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
  duration: 300,
});

// 이후 (v4)
withSpring(value, {
  energyThreshold: 0.01,  // 두 threshold 매개변수 대체
  duration: 200,          // duration은 이제 "지각적" (~1.5배 실제 시간)
});
```

### 마이그레이션 체크리스트

1. **New Architecture 활성화** - Reanimated 4는 Fabric + TurboModules만 지원
2. **`react-native-worklets` 설치** - 필수 새 의존성
3. **Babel plugin 업데이트** - `'react-native-reanimated/plugin'`을 `'react-native-worklets/plugin'`으로 변경
4. **imports 업데이트** - worklet 함수를 `react-native-worklets`로 이동
5. **API 호출 업데이트** - 새 함수는 callback + args를 직접 받음 (커리되지 않음)
6. **네이티브 앱 재빌드** - `react-native-worklets` 추가 후 필수

## 관련 Skills

- [js-measure-fps.md](./js-measure-fps.md) - 애니메이션 프레임 레이트 확인
- [js-concurrent-react.md](./js-concurrent-react.md) - useTransition을 사용한 React 레벨 지연
