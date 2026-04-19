# 빌드/배포 파이프라인 설계

> EAS 유료 서비스 없이 Expo 로컬 빌드 기반의 빌드/배포 파이프라인

## 배경

### 현재 상태
- Expo SDK 53 + React Native 0.79 모노레포
- EAS Build/Update 유료 서비스 미사용
- 1인 개발자

### 결정 사항
- Expo 프레임워크 유지 (무료 오픈소스 기능만 사용)
- EAS 클라우드 빌드/업데이트 사용 안 함
- 빌드는 전부 로컬에서 수행

### 검토 후 제외한 대안들

| 대안 | 제외 사유 |
|------|----------|
| **Granite (토스)** | 브라운필드(기존 네이티브 앱에 RN 추가) 전용. 독립형 앱인 Hosspie와 목적 불일치 |
| **Bare React Native (Expo 탈피)** | Expo SDK 모듈(expo-image, expo-haptics, expo-router 등) 전부 대체 필요. 비용 절감 아닌 작업량 증가 |
| **ESBuild 번들러 도입** | Metro 대체 불가. RN 전용 요구사항(플랫폼별 모듈 분기, 에셋 해상도, Hermes 변환, HMR) 미지원 |
| **Ad Hoc 프로비저닝 (Preview)** | 1인 개발자 셀프 테스트에는 불필요. USB 직접 설치로 충분 |

## 빌드 단계별 설계

### 1. Dev (일상 개발)

```bash
pnpm dev:all
```

- Metro dev server + 핫 리로드
- 네이티브 빌드 불필요 (이미 빌드된 dev client 사용)
- 비용: 무료

### 2. Preview (배포 전 셀프 E2E 테스트)

```bash
# iOS - 본인 기기에 USB 직접 설치
expo run:ios --configuration Release

# Android - APK 직접 설치
expo run:android --variant release
```

- 용도: 개발 완료 후 스토어 제출 전 셀프 테스트
- Ad Hoc 프로비저닝 불필요
- QR 배포 불필요 (1인 개발)
- Apple Developer 계정 불필요 (본인 기기 USB 설치)
- 비용: 무료

### 3. Production (스토어 제출)

```bash
# iOS
eas build --platform ios --local

# Android
eas build --platform android --local
```

- `eas.json` 설정 그대로 활용하되 로컬에서 실행
- 스토어 제출: Fastlane 사용

#### 필수 계정
- Apple Developer Program: $99/년 (App Store 제출 시 필수)
- Google Play 개발자 계정: $25 일회성 (Play Store 제출 시 필수)

#### Fastlane 설정 (Production 제출 자동화)

```ruby
# fastlane/Fastfile

platform :ios do
  lane :release do
    # eas build --local로 생성된 .ipa 업로드
    upload_to_app_store(
      ipa: "build/hosspie-admin.ipa",
      skip_metadata: true,
      skip_screenshots: true
    )
  end
end

platform :android do
  lane :release do
    upload_to_play_store(
      aab: "build/hosspie-admin.aab",
      track: "production"
    )
  end
end
```

## 빌드 흐름 요약

```
일상 개발
  pnpm dev:all → Metro dev server → 핫 리로드 (수초)

배포 전 테스트
  expo run:ios --configuration Release → USB 설치 → 셀프 E2E 테스트

스토어 제출
  eas build --local → .ipa/.aab 생성 → fastlane release → App Store / Play Store
```

## 네이티브 빌드가 필요한 시점

다음 경우에만 네이티브 빌드(5-30분)가 필요:
- 새 네이티브 모듈 추가 (Expo Modules API로 Swift/Kotlin 모듈 작성 시)
- 네이티브 의존성 버전 업그레이드
- Expo SDK 업그레이드
- Preview/Production 배포 빌드

일상 개발에서는 `expo start`만 사용하므로 네이티브 빌드 불필요.

## 향후 확장 (팀 확장 시)

팀원이 생기면 다음을 추가 검토:
- **GitHub Actions + Fastlane**: PR 머지 시 자동 빌드/배포 (무료 티어 월 ~10회 iOS 빌드 가능)
- **Ad Hoc 프로비저닝 + Firebase App Distribution**: 테스터 QR 배포
- **Self-hosted Mac Mini**: 빌드 빈도 높아지면 장기적으로 가장 경제적

## 관련 리서치

- Metro 번들러 성능 최적화는 별도 리서치 예정
- Expo Modules API를 통한 네이티브 확장은 현재 Expo 프레임워크 내에서 충분히 가능
