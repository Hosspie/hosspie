---
title: 스레딩 모델
impact: HIGH
tags: threads, turbo-modules, fabric, async, sync
---

# Skill: 스레딩 모델

Turbo Modules와 Fabric이 초기화, 메서드 호출, 뷰 업데이트에 어떤 스레드를 사용하는지 이해합니다.

## 빠른 참조

| 동작 | iOS 스레드 | Android 스레드 |
|--------|------------|----------------|
| 모듈 초기화 | Main | JS (lazy) / Native (eager) |
| Sync 메서드 | JS | JS |
| Async 메서드 | Native modules | Native modules |
| View 초기화/props | Main | Main |
| Yoga 레이아웃 | JS | JS |

**핵심 규칙**: Sync 메서드는 JS 스레드 블록. 16ms 이하로 유지하거나 async로 만드세요.

## 언제 사용하나요

- 네이티브 모듈 빌드
- 스레딩 문제 디버깅
- 네이티브 코드에서 UI 접근
- async vs sync 메서드 동작 이해

## 사용 가능한 스레드

| 스레드 | 디버거 이름 | 목적 |
|--------|------------------|---------|
| Main/UI | Main thread | UI 렌더링, UIKit/Android Views |
| JavaScript | `mqt_v_js` | JS 실행, React |
| Native Modules | `mqt_v_native` | Async Turbo Module 호출 |
| Custom | 다양함 | 사용자 정의 백그라운드 스레드 |

## Turbo Modules 스레딩

### 초기화

| 플랫폼 | 스레드 | 참고 |
|----------|--------|-------|
| iOS | Main thread | UIKit 접근 필요 가정 |
| Android (lazy) | JS thread | 기본 동작 |
| Android (eager) | Native modules thread | `needsEagerInit = true`일 때 |

**iOS**: React Native는 UIKit 접근을 가정하여 메인 스레드에서 `init` 실행.

**Android Eager Loading:**

```kotlin
// ReactModuleInfo 생성자 매개변수:
// canOverrideExistingModule, needsEagerInit, isCxxModule, isTurboModule
ReactModuleInfo(
    AwesomeModule.NAME,
    AwesomeModule.NAME,
    false,
    true,   // needsEagerInit = true → native modules thread에서 실행
    false,
    true
)
```

### 동기 메서드 호출

**항상 JS 스레드에서 실행** - 반환까지 블록.

```swift
// iOS - JS 스레드에서 실행
@objc func multiply(_ a: Double, b: Double) -> NSNumber {
    // 전체 기간 동안 JS 블록!
    return a * b as NSNumber
}
```

**위험**: 긴 sync 작업은 앱을 멈춤:

```swift
// 나쁨: 20초 동안 JS 블록
@objc func multiply(_ a: Double, b: Double) -> NSNumber {
    Thread.sleep(forTimeInterval: 20)  // 앱 멈춤!
    return a * b as NSNumber
}
```

### 비동기 메서드 호출

**Native Modules 스레드에서 실행** - JS 블록 안 함.

```swift
// iOS - mqt_v_native 스레드에서 실행
@objc func asyncOperation(
    _ a: Double,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: RCTPromiseRejectBlock
) {
    // 이미 백그라운드 스레드
    resolve(a * 2)
}
```

```kotlin
// Android - native modules 스레드에서 실행
override fun asyncOperation(a: Double, promise: Promise?) {
    // 이미 백그라운드 스레드
    promise?.resolve(a * 2)
}
```

### 모듈 무효화

React Native 인스턴스가 종료될 때 호출 (예: Metro 리로드):

| 플랫폼 | 스레드 |
|----------|--------|
| iOS | Native modules thread |
| Android | ReactHost thread pool |

**iOS**: `RCTInvalidating` 프로토콜 구현.

## Fabric (네이티브 뷰) 스레딩

### 뷰 라이프사이클

| 작업 | 스레드 |
|-----------|--------|
| View 초기화 | Main thread |
| Prop 업데이트 | Main thread |
| 레이아웃 (Yoga) | JS thread |

뷰는 항상 메인 스레드에서 UI 조작 (UIKit/Android 요구사항).

### Yoga 레이아웃

레이아웃 계산은 JS 스레드에서 발생:

```
JS Thread: Yoga 트리 계산 → Shadow 트리
Main Thread: 네이티브 뷰에 레이아웃 적용
```

## 백그라운드로 작업 이동

### iOS: DispatchQueue

```swift
@objc func heavyWork(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: RCTPromiseRejectBlock
) {
    DispatchQueue.global().async {
        // 여기서 무거운 연산
        let result = self.compute()
        resolve(result)
    }
}
```

### Android: Coroutines

```kotlin
class MyModule(reactContext: ReactApplicationContext) :
    NativeMyModuleSpec(reactContext) {

    private val moduleScope = CoroutineScope(Dispatchers.Default + SupervisorJob())

    override fun heavyWork(promise: Promise?) {
        moduleScope.launch {
            // 여기서 무거운 연산
            val result = compute()
            promise?.resolve(result)
        }
    }

    override fun invalidate() {
        super.invalidate()
        moduleScope.cancel()  // 중요: 누수 방지를 위해 취소
    }
}
```

## 스레드 안전성 체크리스트

| 시나리오 | 안전? | 해결책 |
|----------|-------|----------|
| 공유 상태 접근하는 Sync 메서드 | ⚠️ | lock/synchronized 사용 |
| UI 접근하는 Async 메서드 | ❌ | 메인 스레드로 dispatch |
| 동일 리소스에 대한 다중 async 호출 | ⚠️ | Queue 또는 mutex |
| 백그라운드에서 JS 접근 | ❌ | CallInvoker 사용 |

### 백그라운드에서 UI 접근 (iOS)

```swift
DispatchQueue.global().async {
    let result = self.heavyComputation()

    DispatchQueue.main.async {
        // 여기서 UI 업데이트 안전
        self.updateUI(with: result)
    }
}
```

### 백그라운드에서 UI 접근 (Android)

```kotlin
moduleScope.launch(Dispatchers.Default) {
    val result = heavyComputation()

    withContext(Dispatchers.Main) {
        // 여기서 UI 업데이트 안전
        updateUI(result)
    }
}
```

## 요약 테이블

| 동작 | iOS 스레드 | Android 스레드 |
|--------|------------|----------------|
| 모듈 초기화 | Main | JS (lazy) / Native (eager) |
| Sync 메서드 | JS | JS |
| Async 메서드 | Native modules | Native modules |
| View 초기화 | Main | Main |
| Prop 업데이트 | Main | Main |
| Yoga 레이아웃 | JS | JS |
| 무효화 | Native modules | ReactHost pool |

## 관련 스킬

- [native-turbo-modules.md](./native-turbo-modules.md) - 백그라운드 스레드 구현
- [native-profiling.md](./native-profiling.md) - 스레드 문제 디버깅
