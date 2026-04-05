---
title: R8 코드 축소
impact: HIGH
tags: android, r8, proguard, minify, shrink
---

# Skill: R8 코드 축소

Android용 R8을 활성화하여 네이티브 코드를 축소, 최적화 및 난독화합니다.

## 빠른 설정

```groovy
// android/app/build.gradle
def enableProguardInReleaseBuilds = true

android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
        }
    }
}
```

## 사용 시기

- Android 앱 크기가 너무 큼
- 보안을 위해 코드 난독화하고 싶음
- 릴리스 APK/AAB 빌드

## R8이란?

R8이 Android에서 ProGuard를 대체합니다:
- **축소**: 사용하지 않는 코드 제거
- **최적화**: bytecode 개선
- **난독화**: 클래스/메서드 이름 변경

**호환성**: ProGuard 설정 형식 사용.

## 단계별 가이드

### 1. R8 활성화

`android/app/build.gradle` 편집:

```groovy
def enableProguardInReleaseBuilds = true
```

릴리스 빌드에서 `minifyEnabled = true`로 설정됩니다.

### 2. 리소스 축소 활성화 (선택사항)

사용하지 않는 리소스를 제거하여 크기를 더 줄입니다:

```groovy
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true  // minifyEnabled 필요

            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. ProGuard 규칙 설정 (필요한 경우)

`android/app/proguard-rules.pro`를 편집합니다. React Native 기본값은 일반적으로 충분합니다—특정 라이브러리가 R8 활성화 후 깨질 때만 규칙을 추가하세요.

**Firebase (`@react-native-firebase/*`) 사용 시에만 추가:**

```proguard
-keep class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**
```

**Retrofit 사용 시에만 추가:**

```proguard
-keepattributes Signature
-keepattributes *Annotation*
-keep class retrofit2.** { *; }
-dontwarn retrofit2.**
```

더 많은 예제는 [일반 라이브러리 규칙](#일반-라이브러리-규칙)과 [문제 해결](#문제-해결)을 참조하세요.

### 4. 빌드 및 테스트

```bash
cd android
./gradlew assembleRelease
# 또는
./gradlew bundleRelease
```

**중요**: 철저하게 테스트하세요! R8은 사용하지 않는다고 생각하는 코드를 제거할 수 있습니다.

## ProGuard 규칙 참조

| 규칙 | 효과 |
|------|--------|
| `-keep class X` | 클래스 X 제거하지 않음 |
| `-keepclassmembers` | 멤버 유지하지만 이름 변경 허용 |
| `-keepnames` | 이름 유지하지만 미사용 시 제거 허용 |
| `-dontwarn X` | X에 대한 경고 억제 |
| `-dontobfuscate` | 난독화 비활성화 |

### 전체 패키지 유지

```proguard
-keep class com.mypackage.** { *; }
```

### 어노테이션이 있는 클래스 유지

```proguard
-keep @interface com.facebook.proguard.annotations.DoNotStrip
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}
```

## 난독화 비활성화 (필요한 경우)

```proguard
# proguard-rules.pro
-dontobfuscate
```

다음과 같은 경우 사용:
- 크래시 디버깅 (스택 추적이 더 읽기 쉬움)
- 라이브러리가 클래스 이름 필요

## 크기 영향

가이드의 예제:
- **R8 없음**: 9.5 MB
- **R8 있음**: 6.3 MB
- **절약**: 33%

더 큰 앱은 20-30% 감소를 볼 수 있습니다.

## 문제 해결

### R8 후 앱 크래시

일반적으로 필요한 클래스가 제거되었음을 의미합니다.

**디버그 단계**:

1. 크래시 로그에서 클래스 이름 확인
2. keep 규칙 추가:
   ```proguard
   -keep class com.example.CrashedClass { *; }
   ```
3. 재빌드 및 테스트

### 라이브러리별 규칙

많은 라이브러리가 ProGuard 규칙을 제공합니다. 확인:
- 라이브러리 README
- 라이브러리의 `consumer-proguard-rules.pro`
- Stack Overflow에서 라이브러리 + proguard 검색

### 일반 라이브러리 규칙

```proguard
# Hermes (일반적으로 자동 포함)
-keep class com.facebook.hermes.unicode.** { *; }

# React Native
-keep class com.facebook.react.** { *; }

# Gson
-keepattributes Signature
-keep class com.google.gson.** { *; }

# OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**
```

## 검증

### APK 크기 확인

```bash
# 빌드
./gradlew assembleRelease

# 크기 확인
ls -la android/app/build/outputs/apk/release/
```

### 자세한 분석을 위해 Ruler 사용

[bundle-analyze-app.md](./bundle-analyze-app.md) 참조.

### 난독화 확인

APK를 디컴파일하여 클래스 이름이 난독화되었는지 확인:

```bash
# jadx 또는 유사 도구 사용
jadx android/app/build/outputs/apk/release/app-release.apk
```

## 일반적인 함정

- **릴리스 빌드 테스트하지 않음**: 항상 R8이 활성화된 상태로 QA
- **라이브러리 규칙 누락**: 라이브러리 문서 확인
- **과도한 keep**: 너무 많은 keep 규칙은 이점을 무효화
- **리플렉션**: 리플렉션을 사용하는 코드는 깨질 수 있음

## 관련 스킬

- [bundle-analyze-app.md](./bundle-analyze-app.md) - 크기 영향 측정
- [bundle-native-assets.md](./bundle-native-assets.md) - 추가 크기 감소
