---
title: 네이티브 메모리 관리
impact: MEDIUM
tags: memory, c++, swift, kotlin, arc, smart-pointers
---

# Skill: 네이티브 메모리 관리

React Native 네이티브 모듈을 위한 C++, Swift, Kotlin의 메모리 관리 패턴을 이해합니다.

## 빠른 참조

| 패턴 | 언어 | 메커니즘 |
|---------|-----------|-----------|
| 참조 카운팅 | Swift, Obj-C, C++ (스마트 포인터) | 참조 카운트, 0에서 해제 |
| 가비지 컬렉션 | Kotlin/Java, JavaScript | GC가 도달 불가능한 것 스캔하여 해제 |
| 수동 | C, C++ (raw pointers) | 명시적 new/delete |

**핵심 규칙**: C++에서 `std::unique_ptr`/`std::shared_ptr` 사용, Swift에서 델리게이트는 `weak` 사용.

## 언제 사용하나요

- 수동 메모리 관리가 있는 네이티브 모듈 작성
- 네이티브 메모리 누수 디버깅
- C++와 Swift/Kotlin 인터페이싱
- 참조 카운팅 vs 가비지 컬렉션 이해

## 메모리 관리 패턴

| 패턴 | 언어 | 메커니즘 |
|---------|-----------|-----------|
| 참조 카운팅 | Swift, Obj-C, C++ (스마트 포인터) | 참조 카운트, 0에서 해제 |
| 가비지 컬렉션 | Kotlin/Java, JavaScript | GC가 도달 불가능한 것 스캔하여 해제 |
| 수동 | C, C++ (raw pointers) | 명시적 new/delete |

## C++ 스마트 포인터

### `std::unique_ptr` - 단일 소유자

```cpp
#include <memory>

void takeOwnership(std::unique_ptr<std::string> s) {
    std::cout << *s;
    // 함수 종료 시 자동 삭제
}

int main() {
    auto str = std::make_unique<std::string>("Hello");

    // 이동만 가능, 복사 불가
    takeOwnership(std::move(str));
    // str은 이제 비어있음

    return 0;
}
```

### `std::shared_ptr` - 다중 소유자

```cpp
void useShared(std::shared_ptr<std::string> s) {
    std::cout << *s;  // 참조 카운트 임시로 +1
}

void useReference(const std::shared_ptr<std::string>& s) {
    std::cout << *s;  // 참조 카운트 변경 없음 (참조로 전달)
}

int main() {
    auto str = std::make_shared<std::string>("Hello");

    useShared(str);      // 포인터 복사, 참조 카운트 +1
    useReference(str);   // 복사 없음, 참조 카운트 유지

    std::cout << *str;   // 여전히 유효
    return 0;
}
```

### `std::weak_ptr` - 비소유 참조

```cpp
void useWeak(std::weak_ptr<std::string> weak) {
    if (auto shared = weak.lock()) {  // 여전히 존재하는지 확인
        std::cout << *shared;
    } else {
        std::cout << "Object destroyed";
    }
}

int main() {
    auto str = std::make_shared<std::string>("Hello");
    std::weak_ptr<std::string> weak = str;  // 참조 카운트 증가 없음

    useWeak(weak);  // 작동
    str.reset();    // 객체 파괴
    useWeak(weak);  // "Object destroyed"

    return 0;
}
```

## Swift ARC (Automatic Reference Counting)

```swift
class Person {
    let name: String
    init(name: String) { self.name = name }
    deinit { print("Deallocated") }
}

do {
    let person1 = Person(name: "John")  // 참조 카운트: 1

    do {
        let person2 = person1  // 참조 카운트: 2
    }  // person2 범위 벗어남, 참조 카운트: 1

}  // person1 범위 벗어남, 참조 카운트: 0, "Deallocated"
```

### `weak`으로 참조 순환 끊기

```swift
// 나쁨: 참조 순환 (메모리 누수)
class A {
    var b: B?
}
class B {
    var a: A?  // 강한 참조가 순환 생성
}

// 좋음: weak으로 순환 끊기
class A {
    var b: B?
}
class B {
    weak var a: A?  // weak 참조, 할당 해제 방지 안 함
}
```

## Kotlin/Android GC

### 캐시용 WeakHashMap

```kotlin
val weakMap = WeakHashMap<String, String>()

run {
    weakMap[String("temp")] = "value"
    println(weakMap.size)  // 1
}

System.gc()  // 가비지 컬렉션 강제
Thread.sleep(100)

println(weakMap.size)  // 0 (키가 수집됨)
```

### 콜백용 WeakReference

```kotlin
class DataManager {
    // 리스너에 대한 weak 참조로 메모리 누수 방지
    private val listeners = mutableListOf<WeakReference<DataListener>>()

    fun addListener(listener: DataListener) {
        listeners.add(WeakReference(listener))
    }

    fun notifyListeners(data: String) {
        listeners.forEach { ref ->
            ref.get()?.onDataChanged(data)
        }
    }
}
```

## 일반적인 메모리 누수 원인

### 1. 삭제 잊기 (C++)

```cpp
// 나쁨: 메모리 누수
int main() {
    std::string* str = new std::string("Hello");
    // delete 잊음!
    return 0;
}

// 좋음: 스마트 포인터 또는 스택 할당 사용
int main() {
    auto str = std::make_unique<std::string>("Hello");
    // 자동으로 삭제됨
    return 0;
}
```

### 2. 참조 순환 (Swift/C++)

```cpp
// 나쁨: 순환
class A { std::shared_ptr<B> b; };
class B { std::shared_ptr<A> a; };

// 좋음: weak_ptr로 끊기
class A { std::shared_ptr<B> b; };
class B { std::weak_ptr<A> a; };
```

### 3. 리스너 미제거 (Kotlin)

```kotlin
// 나쁨: 리스너 제거 안 됨
class MyClass {
    private val listener = object : Callback {
        override fun onEvent() { /* ... */ }
    }

    init {
        EventManager.addListener(listener)
        // 제거 안 됨!
    }
}

// 좋음: 정리 구현
class MyClass : AutoCloseable {
    private val listener = object : Callback {
        override fun onEvent() { /* ... */ }
    }

    init {
        EventManager.addListener(listener)
    }

    override fun close() {
        EventManager.removeListener(listener)
    }
}
```

## Swift `Unmanaged` (고급)

C interop을 위해 수동으로 참조 카운트 관리:

```swift
let obj = MyObject()                        // 참조 카운트: 1

// 수동으로 증가
let unmanaged = Unmanaged.passRetained(obj) // 참조 카운트: 2

// 감소하고 객체 가져오기
let retrieved = unmanaged.takeRetainedValue() // 참조 카운트: 1

// C용 raw 포인터 가져오기
let pointer = unmanaged.toOpaque()
```

**규칙**: `passRetained`는 `takeRetainedValue`와, `passUnretained`는 `takeUnretainedValue`와 매칭.

## 모범 사례 요약

| 언어 | 모범 사례 |
|----------|---------------|
| C++ | 스마트 포인터 사용 (`shared_ptr`, `unique_ptr`) |
| Swift | 델리게이트에 `weak` 사용, 순환 끊기 |
| Kotlin | `AutoCloseable` 구현, `WeakReference` 사용 |
| 모두 | 가능하면 힙보다 스택 선호 |

## 관련 스킬

- [native-memory-leaks.md](./native-memory-leaks.md) - 프로파일러로 누수 찾기
- [native-turbo-modules.md](./native-turbo-modules.md) - 메모리 안전 모듈 빌드
