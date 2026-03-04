---
title: 네이티브 애셋
impact: HIGH
tags: assets, images, asset-catalog, app-thinning
---

# Skill: 네이티브 애셋

플랫폼별 애셋 전달을 설정하여 앱 다운로드 크기를 줄입니다.

## 빠른 설정

**iOS Asset Catalog (Build Phase):**

```bash
# "Bundle React Native code and images" build phase에 추가
export EXTRA_PACKAGER_ARGS="--asset-catalog-dest ./"
```

**Android**: AAB를 통해 자동 — Play Store가 기기별로 올바른 밀도를 전달합니다.

## 사용 시기

- 이미지가 앱 크기를 비대화시킴
- 다른 기기 밀도에 다른 애셋 필요
- App Store/Play Store 최적화 활용하고 싶음
- 고해상도 이미지 사용

## 개념: 크기 접미사

여러 해상도를 위한 React Native 규칙:

```
assets/
├── image.jpg       # 1x 해상도 (기본)
├── image@2x.jpg    # 2x 해상도
└── image@3x.jpg    # 3x 해상도
```

```tsx
// React Native가 기기에 맞는 최상의 이미지 선택
<Image source={require('./assets/image.jpg')} />
```

## Android: 자동 최적화

Android는 이를 자동으로 처리합니다.

### 작동 방식

1. AAB 빌드:
   ```bash
   cd android && ./gradlew bundleRelease
   ```

2. Metro가 밀도 폴더에 이미지 배치:
   ```
   android/app/build/outputs/bundle/release/
   └── base/
       └── res/
           ├── drawable-mdpi-v4/     # 1x
           ├── drawable-hdpi-v4/     # 1.5x
           ├── drawable-xhdpi-v4/    # 2x
           ├── drawable-xxhdpi-v4/   # 3x
           └── drawable-xxxhdpi-v4/  # 4x
   ```

3. Play Store가 기기별로 필요한 밀도만 전달합니다.

**Android에는 설정이 필요 없습니다**.

## iOS: Asset Catalog 설정

iOS는 명시적 설정이 필요합니다.

### 1단계: Asset Catalog 생성

`ios/`에 폴더 생성:

```
ios/RNAssets.xcassets/
```

**중요**: 정확히 `RNAssets.xcassets`로 명명해야 합니다 (React Native에 하드코딩됨).

### 2단계: Build Phase 설정

Xcode에서:
1. 프로젝트 설정 열기
2. **Build Phases**로 이동
3. **"Bundle React Native code and images"** 찾기
4. 8번 줄 앞에 추가:

```bash
export EXTRA_PACKAGER_ARGS="--asset-catalog-dest ./"
```

### 3단계: 빌드

asset catalog를 채우기 위해 빌드 실행:

```bash
npx react-native run-ios --mode Release
```

또는 수동으로:

```bash
npx react-native bundle \
  --entry-file index.js \
  --bundle-output ios-bundle.js \
  --platform ios \
  --dev false \
  --asset-catalog-dest ios \
  --assets-dest ios/assets
```

### 4단계: 검증

빌드 후, `RNAssets.xcassets`에 포함:

```
ios/RNAssets.xcassets/
└── assets_image_image.imageset/
    ├── Contents.json
    ├── image.jpg
    ├── image@2x.jpg
    └── image@3x.jpg
```

App Store가 필요한 해상도만 전달합니다.

## 전/후 비교

### Asset Catalog 없음 (모든 변형)

```
앱 번들 포함:
├── image.jpg       (100 KB)
├── image@2x.jpg    (300 KB)
└── image@3x.jpg    (600 KB)
총: 1 MB
```

### Asset Catalog 있음 (기기별)

```
iPhone 15 Pro 수신:
└── image@3x.jpg    (600 KB)
총: 600 KB  (40% 작음)
```

## 애셋 최적화 팁

### 1. 이미지 압축

프로젝트에 추가하기 전에 도구 사용:

```bash
# ImageOptim (macOS)
# TinyPNG (web)
# sharp (프로그래밍 방식)

npx sharp-cli input.jpg -o output.jpg --quality 80
```

### 2. 적절한 포맷 사용

| 포맷 | 적합한 용도 |
|--------|----------|
| JPEG | 사진 |
| PNG | 아이콘, 투명도 |
| WebP | 둘 다 (더 작음) |
| SVG | 벡터 아이콘 |

### 3. react-native-fast-image 고려

캐싱 및 더 나은 이미지 처리:

```bash
npm install react-native-fast-image
```

## 검증

### iOS App Thinning Report

export 후, `App Thinning Size Report.txt` 확인:

```
Variant: MyApp-<UUID>.ipa
Supported variant descriptors: iPhone15,2 ...
App size: 3.5 MB compressed, 10.6 MB uncompressed
```

### Emerge Tools 사용

IPA를 업로드하여 애셋 분류 확인.

## 일반적인 함정

- **잘못된 폴더 이름**: 정확히 `RNAssets.xcassets`여야 함
- **build phase 설정 누락**: 애셋이 처리되지 않음
- **크기 접미사를 사용하지 않음**: 모든 변형이 어쨌든 포함됨
- **재빌드 잊어버림**: 변경 사항은 새로운 빌드 필요

## 향후 참고

2025년 1월 현재, Asset Catalog는 기본값이 아닙니다. 향후 React Native 버전에서 기본값이 될 수 있습니다.

## 관련 스킬

- [bundle-analyze-app.md](./bundle-analyze-app.md) - 애셋 영향 확인
- [bundle-r8-android.md](./bundle-r8-android.md) - Android 코드 최적화
