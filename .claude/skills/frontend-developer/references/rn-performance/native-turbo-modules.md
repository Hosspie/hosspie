---
title: 빠른 네이티브 모듈
impact: HIGH
tags: turbo-modules, native, swift, kotlin, c++
---

# Skill: 빠른 네이티브 모듈

현대적인 언어와 백그라운드 스레딩을 사용하여 고성능 Turbo Modules를 빌드합니다.

## 빠른 패턴

**잘못됨 (sync 메서드가 JS 스레드 블록):**

```swift
@objc func heavyWork() -> NSNumber {
    Thread.sleep(forTimeInterval: 2)  // 2초 동안 JS 블록!
    return 42
}
```

**올바름 (백그라운드 스레드에서 async):**

```swift
@objc func heavyWork(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: RCTPromiseRejectBlock
) {
    DispatchQueue.global().async {
        let result = self.compute()
        resolve(result)
    }
}
```

## 언제 사용하나요

- 새 네이티브 모듈 생성
- 기존 모듈 성능 최적화
- 무거운 연산이 JS 스레드에서 벗어나야 할 때
- 크로스 플랫폼 C++ 코드 필요

## 사전 준비사항

- 스캐폴딩을 위한 React Native Builder Bob

```bash
npx create-react-native-library@latest my-library
```

## 단계별 가이드

### 1. Builder Bob으로 스캐폴딩

```bash
npx create-react-native-library@latest awesome-library
# 프롬프트 따라가기: Turbo Module 선택, 언어 선택
```

다음이 포함된 배포 가능한 라이브러리 생성:
- iOS (Obj-C/Swift) 지원
- Android (Kotlin) 지원
- TypeScript 정의
- Codegen 설정

로컬 모듈의 경우:

```bash
npx create-react-native-library@latest awesome-library --local
```

### 2. iOS 모듈에서 Swift 활성화

`awesome-library.podspec` 업데이트:

```diff
- s.source_files = "ios/**/*.{h,m,mm,cpp}"
+ s.source_files = "ios/**/*.{h,m,mm,cpp,swift}"
```

Xcode에서 Swift 파일 생성 (브리징 헤더 프롬프트 수락).

Swift 호환성을 위해 헤더 파일 업데이트:

```objc
// AwesomeLibrary.h
#import <Foundation/Foundation.h>

#if __cplusplus
#import "ReactCodegen/RNAwesomeLibrarySpec/RNAwesomeLibrarySpec.h"
#endif

@interface AwesomeLibrary : NSObject
#if __cplusplus
<NativeAwesomeLibrarySpec>
#endif
@end
```

브리징 헤더에 헤더 import:

```objc
// AwesomeLibrary-Bridging-Header.h
#import "AwesomeLibrary.h"
```

Swift로 구현:

```swift
// AwesomeLibrary.swift
import Foundation

extension AwesomeLibrary {
    @objc func multiply(_ a: Double, b: Double) -> NSNumber {
        return (a * b) as NSNumber
    }
}
```

Obj-C++에서 브리지:

```objc
// AwesomeLibrary.mm
#import "AwesomeLibrary.h"

#if __has_include("awesome_library/awesome_library-Swift.h")
#import "awesome_library/awesome_library-Swift.h"
#else
#import "awesome_library-Swift.h"
#endif

@implementation AwesomeLibrary
RCT_EXPORT_MODULE()
RCT_EXTERN_METHOD(multiply:(double)a b:(double)b);
@end
```

### 3. 백그라운드 스레드에서 실행 (iOS)

```swift
@objc func heavyOperation(
    _ input: Double,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: RCTPromiseRejectBlock
) {
    DispatchQueue.global().async {
        // 백그라운드 스레드에서 무거운 작업
        let result = self.expensiveComputation(input)
        resolve(result)
    }
}
```

### 4. 백그라운드 스레드에서 실행 (Android)

```kotlin
class AwesomeLibraryModule(reactContext: ReactApplicationContext) :
    NativeAwesomeLibrarySpec(reactContext) {

    private val moduleScope = CoroutineScope(Dispatchers.Default + SupervisorJob())

    override fun heavyOperation(input: Double, promise: Promise?) {
        moduleScope.launch {
            // 코루틴에서 무거운 작업
            val result = expensiveComputation(input)
            promise?.resolve(result)
        }
    }

    override fun invalidate() {
        super.invalidate()
        moduleScope.cancel()  // 메모리 누수 방지!
    }
}
```

### 5. 크로스 플랫폼 코드를 위한 C++ 사용

공유 로직을 위한 C++ Turbo Module 생성:

```cpp
// MyCppModule.h
#pragma once

#include <ReactCommon/TurboModule.h>

namespace facebook::react {

class MyCppModule : public TurboModule {
public:
    MyCppModule(std::shared_ptr<CallInvoker> jsInvoker);

    double multiply(double a, double b);
};

} // namespace facebook::react
```

iOS auto-linking 등록:

```objc
// MyCppModuleRegistration.mm
#include <ReactCommon/CxxTurboModuleUtils.h>

@implementation MyCppModuleRegistration

+ (void)load {
    facebook::react::registerCxxModuleToGlobalModuleMap(
        std::string(facebook::react::MyCppModule::kModuleName),
        [&](std::shared_ptr<facebook::react::CallInvoker> jsInvoker) {
            return std::make_shared<facebook::react::MyCppModule>(jsInvoker);
        }
    );
}

@end
```

## 스레딩 요약

| 메서드 타입 | 기본 스레드 | 모범 사례 |
|-------------|----------------|---------------|
| Sync | JS thread | 빠르게 유지 (<16ms) |
| Async | Native modules thread | 보통 작업 OK |
| Heavy async | 커스텀 백그라운드 | DispatchQueue/Coroutines 사용 |

## 언어 Interop 비용

| 인터페이스 | 오버헤드 | 참고 |
|-----------|----------|-------|
| Obj-C ↔ C++ | ~0 | 컴파일 타임 |
| Swift ↔ C++ | ~0 | Swift 5.9+ interop |
| Kotlin ↔ C++ (JNI) | 중간 | 호출당 조회 |
| C++ Turbo Module | 낮음 | JSI 직접 접근 |

**팁**: C++ Turbo Modules는 JS가 JSI를 통해 C++ 함수 참조를 직접 보유하므로 런타임에 JNI를 건너뜀.

## 코드 예제: 완전한 Async 작업

```typescript
// TypeScript 인터페이스
export interface Spec extends TurboModule {
    multiply(a: number, b: number): number;  // Sync
    heavyOperation(input: number): Promise<number>;  // Async
}
```

```kotlin
// Android 구현
override fun heavyOperation(input: Double, promise: Promise?) {
    moduleScope.launch {
        try {
            val result = withContext(Dispatchers.Default) {
                // 무거운 작업 시뮬레이션
                delay(1000)
                input * 2
            }
            promise?.resolve(result)
        } catch (e: Exception) {
            promise?.reject("ERROR", e.message)
        }
    }
}
```

```swift
// iOS 구현
@objc func heavyOperation(
    _ input: Double,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
) {
    DispatchQueue.global(qos: .userInitiated).async {
        // 무거운 작업 시뮬레이션
        Thread.sleep(forTimeInterval: 1.0)
        let result = input * 2
        resolve(result)
    }
}
```

## 흔한 실수

- **블록하는 Sync 메서드**: 16ms 이하로 유지하거나 async로 만들기
- **코루틴 스코프 취소 잊기**: 메모리 누수 유발
- **async에서 에러 처리 안 함**: 항상 reject와 함께 try/catch
- **백그라운드에서 UI 접근**: 메인 스레드로 dispatch

## 관련 스킬

- [native-threading-model.md](./native-threading-model.md) - 스레드 세부사항
- [native-memory-patterns.md](./native-memory-patterns.md) - 네이티브 코드의 메모리
