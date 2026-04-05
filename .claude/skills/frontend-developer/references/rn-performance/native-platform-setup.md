---
title: 플랫폼 차이점
impact: MEDIUM
tags: ios, android, xcode, gradle, cocoapods
---

# Skill: 플랫폼 차이점

React Native의 iOS와 Android 툴링, 의존성 관리, 빌드 시스템을 탐색합니다.

## 빠른 참조

| 플랫폼 | IDE | 패키지 관리자 | 빌드 시스템 |
|----------|-----|-----------------|--------------|
| JavaScript | VS Code | npm/yarn | Metro |
| iOS | Xcode | CocoaPods | xcodebuild |
| Android | Android Studio | Gradle | Gradle |

```bash
# 일반적인 명령어
cd ios && bundle exec pod install   # iOS 의존성 설치
cd android && ./gradlew clean       # Android 빌드 정리
xed ios/                            # Xcode 열기
```

## 언제 사용하나요

- 네이티브 개발 환경 설정
- 네이티브 의존성 추가
- 플랫폼별 문제 디버깅
- 빌드 프로세스 이해

## IDE 개요

| 플랫폼 | IDE | 주요 기능 |
|----------|-----|--------------|
| JavaScript | VS Code, WebStorm | TypeScript, ESLint, Prettier |
| iOS | Xcode | View Hierarchy, Instruments, Signing |
| Android | Android Studio | Layout Inspector, Profiler, Logcat |

## 의존성 관리

### JavaScript (npm/yarn)

```bash
# React Native 라이브러리 설치
npm install react-native-bottom-tabs

# 주요 파일
package.json          # 의존성과 스크립트
node_modules/         # 설치된 패키지
package-lock.json     # 버전 잠금
```

### iOS (CocoaPods)

```bash
# npm install 후 pod 설치
cd ios && bundle exec pod install

# 주요 파일
ios/Podfile           # Pod 의존성
ios/Pods/             # 설치된 pod (gitignored)
ios/*.xcworkspace     # Xcode에서 이것 열기 (.xcodeproj 아님)
Gemfile               # Ruby/CocoaPods 버전
```

**네이티브 iOS 의존성 추가:**

```ruby
# ios/Podfile
target 'MyApp' do
  pod 'SDWebImage', '~> 5.0'
end
```

버전 연산자:
- `~> 5.0` = ≥5.0, <6.0 (마이너 업데이트)
- `~> 5.0.1` = ≥5.0.1, <5.1 (패치만)

### Android (Gradle)

```bash
# 의존성 추가 후 동기화
cd android && ./gradlew clean

# 주요 파일
android/build.gradle           # 프로젝트 레벨 설정
android/app/build.gradle       # 앱 의존성
android/gradle.properties      # 빌드 플래그
android/gradlew                # Gradle wrapper
```

**네이티브 Android 의존성 추가:**

```groovy
// android/app/build.gradle
dependencies {
    implementation 'com.github.bumptech.glide:glide:4.12.0'
}
```

## 프로젝트 빌드

### JavaScript (Metro)

Metro는 Babel을 통해 JS 트랜스파일 처리:
- 현대 JS를 엔진 호환 코드로 변환
- 모듈 해석 처리
- JS 번들 생성

### iOS 빌드 파이프라인

1. **소스 컴파일**: Swift/Obj-C → 머신 코드 (Clang/LLVM)
2. **링킹**: 코드 + 프레임워크 + CocoaPods
3. **서명**: 인증서와 프로비저닝 프로파일
4. **패키징**: `.ipa` 파일

### Android 빌드 파이프라인

1. **컴파일**: Java/Kotlin → `.class` 파일
2. **DEX 변환**: `.class` → `.dex` (Android Runtime)
3. **리소스 처리**: XML, 이미지, assets
4. **서명**: Keystore 서명
5. **패키징**: `.apk` 또는 `.aab` 파일

## 기기에서 실행

### iOS 시뮬레이터

```bash
# 시뮬레이터 목록
xcrun simctl list

# 시뮬레이터 부팅
xcrun simctl boot "iPhone 15"

# 모두 종료
xcrun simctl shutdown all

# Xcode 빠른 실행
xed ios/
```

### Android 에뮬레이터

```bash
# 사용 가능한 기기 목록
emulator -list-avds

# 특정 기기 실행
emulator @Pixel_6_API_34

# 연결된 기기 목록
adb devices
```

### 유용한 도구

- **MiniSim**: 메뉴 바에서 시뮬레이터 관리
- **Expo Orbit**: 시뮬레이터 관리
- **Android iOS Emulator (VS Code)**: IDE 통합

## 일반 명령어

```bash
# iOS
cd ios && bundle exec pod install     # Pod 설치
xed .                                  # Xcode 열기
xcrun simctl list                      # 시뮬레이터 목록

# Android
cd android && ./gradlew clean          # 빌드 정리
./gradlew tasks                        # 사용 가능한 태스크 목록
./gradlew assembleRelease              # 릴리스 APK 빌드

# React Native CLI
npx react-native start                 # Metro 시작
npx react-native run-ios               # iOS에서 실행
npx react-native run-android           # Android에서 실행

# Expo
npx expo start                         # Metro 시작 (Expo)
npx expo run:ios                       # iOS에서 실행 (dev client)
npx expo run:android                   # Android에서 실행 (dev client)
npx expo prebuild                      # 네이티브 프로젝트 생성
```

### Expo 참고사항

- **Expo Go**: 제한된 네이티브 모듈 지원; JS 전용 개발에 사용
- **Dev Client**: 전체 네이티브 접근; 커스텀 네이티브 코드 필요
- **Prebuild**: 네이티브 커스터마이징을 위한 `ios/`와 `android/` 폴더 생성

## 문제 해결

| 문제 | 해결책 |
|-------|----------|
| Pod install 실패 | `bundle exec pod install --repo-update` |
| Xcode 빌드 실패 | 빌드 폴더 정리 (Cmd+Shift+K) |
| Android Gradle 동기화 실패 | `./gradlew clean` 후 동기화 |
| 시뮬레이터를 찾을 수 없음 | `xcrun simctl list`로 이름 확인 |
| Metro 캐시 문제 | `npx react-native start --reset-cache` |

## 관련 스킬

- [native-profiling.md](./native-profiling.md) - IDE 프로파일러 사용
- [native-turbo-modules.md](./native-turbo-modules.md) - 네이티브 모듈 빌드
