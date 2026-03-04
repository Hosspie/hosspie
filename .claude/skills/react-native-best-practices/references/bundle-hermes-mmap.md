---
title: JS 번들 압축 비활성화
impact: HIGH
tags: android, hermes, mmap, tti, startup
---

# Skill: JS 번들 압축 비활성화

Hermes 메모리 매핑을 활성화하여 더 빠른 시작을 위해 Android JS 번들 압축을 비활성화합니다.

## 빠른 설정

```groovy
// android/app/build.gradle
android {
    androidResources {
        noCompress += ["bundle"]
    }
}
```

**참고**: React Native 0.79+에서는 기본값입니다. 0.78 이전 버전에서만 필요합니다.

## 사용 시기

- Hermes를 사용하는 Android 앱
- 더 빠른 TTI (Time to Interactive) 원함
- 설치 크기 대신 시작 속도를 선택할 의향이 있음
- React Native 버전이 0.78 이하인 경우, 그렇지 않으면 건너뛰기 (적용 가능성 참조)

## 배경

Android는 기본적으로 `index.android.bundle`을 포함한 APK/AAB의 대부분 파일을 압축합니다.

**문제**: 압축된 파일은 메모리 매핑(mmap)이 불가능합니다.

**영향**: Hermes는 읽기 전에 압축을 풀어야 하며, 주요 최적화 중 하나를 잃게 됩니다.

## Hermes 메모리 매핑 작동 방식

압축 없이:
1. Hermes가 bytecode 파일 열기
2. OS가 디스크에 직접 메모리 매핑
3. 실제로 접근한 페이지만 로드됨
4. **결과**: 빠른 시작, 낮은 메모리

압축 있음:
1. Android가 전체 번들 압축 해제
2. 메모리에 로드
3. 그 후 Hermes 처리
4. **결과**: 느린 시작, 높은 메모리

## 단계별 구현

### build.gradle 편집

`android/app/build.gradle`에서:

```groovy
android {
    androidResources {
        noCompress += ["bundle"]
    }
}
```

### 전체 컨텍스트

```groovy
android {
    namespace "com.myapp"
    defaultConfig {
        applicationId "com.myapp"
        // ...
    }

    androidResources {
        noCompress += ["bundle"]
    }

    buildTypes {
        release {
            minifyEnabled true
            // ...
        }
    }
}
```

### 재빌드

```bash
cd android
./gradlew clean
./gradlew bundleRelease
# 또는
./gradlew assembleRelease
```

## 트레이드오프

| 메트릭 | 변경 없음 | 변경 있음 |
|--------|----------------|-------------|
| 다운로드 크기 | 동일 | 동일 |
| 설치 크기 | 더 작음 | **+8% 더 큼** |
| TTI | 더 느림 | **-16% 더 빠름** |

**실제 예제**: 75.9 MB 설치 → 82 MB 설치, 하지만 450ms 더 빠른 시작.

## 적용 가능성

**React Native 0.78 이하**: 이 최적화를 수동으로 적용하세요.

**React Native 0.79+**: 건너뛰세요—번들 압축이 기본적으로 비활성화되어 있습니다.

## 검증

### APK 내용 확인

```bash
# APK 압축 해제
unzip app-release.apk -d apk-contents

# 번들이 압축되었는지 확인
file apk-contents/assets/index.android.bundle
# "data" 표시되어야 함 ("gzip compressed" 아님)
```

### TTI 영향 측정

성능 마커를 사용하여 이전/이후를 비교하세요 ([native-measure-tti.md](./native-measure-tti.md) 참조).

## 여러 파일 유형

mmap의 이점을 받는 다른 파일이 있는 경우:

```groovy
androidResources {
    noCompress += ["bundle", "hbc", "data"]
}
```

## 일반적인 함정

- **재빌드하지 않음**: 변경 사항은 클린 빌드 필요
- **잘못된 설정 위치**: `android` 블록 내에 있어야 함
- **크기 증가 무시**: 설치 크기에 대한 사용자 피드백 모니터링
- **이미 기본값**: React Native 버전에 이미 포함되어 있는지 확인

## Expo 참고사항

Expo 프로젝트의 경우, 먼저 `npx expo prebuild`를 실행하여 `android/` 폴더를 생성한 다음 `build.gradle` 변경 사항을 적용하세요. 지속적인 변경을 위해 `android/`를 버전 관리에 추가하거나 [config plugin](https://docs.expo.dev/config-plugins/introduction/)을 사용하세요.

## 활성화해야 할까요?

| 시나리오 | 권장사항 |
|----------|---------------|
| 시작이 중요한 앱 | ✅ 활성화 |
| 저장 공간에 민감한 사용자 | ⚠️ 영향 테스트 |
| 이미 빠른 TTI | 가치가 없을 수 있음 |
| 큰 JS 번들 | ✅ 더 큰 이점 |

## 관련 스킬

- [native-measure-tti.md](./native-measure-tti.md) - TTI 개선 측정
- [bundle-analyze-app.md](./bundle-analyze-app.md) - 크기 영향 확인
- [bundle-r8-android.md](./bundle-r8-android.md) - 크기 증가 상쇄
