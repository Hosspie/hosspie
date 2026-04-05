# SMS 자동 수신 및 파싱 실현 가능성

## 결론 먼저

**SMS 자동 수신은 앱스토어/플레이스토어로 배포하는 일반 앱에서는 사실상 불가능하다.**
- iOS: 원천적으로 불가 (OS 정책).
- Android: Google Play 정책상 "기본 SMS 앱"만 허용. Hosspie는 해당 안 됨 → 심사 거부.
- 기술적으로 우회하더라도 배포 채널이 사이드로드/엔터프라이즈로 제한됨 → 1인 개발 MVP에 부적합.

게다가 **네이버 예약은 2023년 9월부터 SMS 알림을 중단**했고, 나머지 OTA는 앱 푸시/이메일 중심이라 SMS 자체의 전략적 가치도 낮아졌다.

---

## 1. iOS: 불가능

### 공식 제약
- iOS 앱은 수신 SMS/iMessage 내용을 읽을 수 없다. 보안/프라이버시 정책.
- Apple Developer Forum 및 문서에 "third party apps cannot see the contents of SMS" 명시.

### 제한적 대안: `IdentityLookup` Message Filter Extension
- iOS 11부터 도입. SMS **스팸 필터링** 용도로만 제공.
- 앱 extension이 "알 수 없는 발신자"의 SMS를 받아서 "스팸/프로모션/거래" 등으로 분류.
- **제약**:
  - 연락처에 저장된 발신자의 메시지는 받지 못함.
  - iMessage는 제외.
  - 메시지 내용을 앱 본체로 전달할 수 없음. 분류 결과만 iOS가 활용.
  - 즉, Hosspie 백엔드로 SMS 내용을 보낼 수 없음 → **예약 파싱 용도 불가**.

### SiriKit
- SiriKit은 메시지 "송신" 인텐트는 지원하지만 수신 읽기는 없음. 해당 없음.

### 결론
**iOS에서 SMS 자동 수신은 불가능.** 사장님이 iPhone을 쓴다면 SMS 기반 자동화는 포기해야 한다.

---

## 2. Android: 가능하지만 Play Store 거부 확정

### 권한: `READ_SMS`, `RECEIVE_SMS`
- Android manifest에 선언하면 기술적으로 수신 가능.
- `react-native-get-sms-android`, `react-native-android-sms-listener`, `react-native-expo-read-sms` 등의 라이브러리가 존재.

### Google Play 정책 (2019년 1월부터)
> "To protect user privacy, Google Play restricts apps' access to call- and messaging-related permission groups. If you distribute your app on the Google Play Store and want to access sensitive user information related to call logs and SMS messages, **your app needs to be registered as the user's default handler** for the core device function related to that permission."

- 즉, Hosspie가 `READ_SMS`를 쓰려면 **사용자 기본 SMS 앱**이 되어야 함. 말이 안 됨 (사장님이 Hosspie로 문자 보내고 받을 리가 없음).
- 예외 사례: OTP 자동입력(SMS Retriever API), 백업 복원, 스팸 차단 앱 등 정해진 use case만. "예약 알림 파싱"은 예외에 해당 안 됨.
- 위반 시 **Play Console에서 앱 스토어 게시 거부 또는 삭제**.

### SMS Retriever API (제한된 대안)
- Google이 제공하는 OTP 전용 API. 앱이 보낸 발신자의 특정 포맷 SMS만 자동 읽기 가능.
- 앱 시그니처 해시를 SMS에 포함해야 함 → **Hosspie가 제어할 수 없는 OTA 발신 SMS는 대응 불가**.

### Expo 워크플로우 이슈
- `react-native-expo-read-sms`는 Expo Bare/Dev Client에서만 동작. Expo Managed Workflow 비호환.
- Hosspie는 Expo SDK 53 사용 → Config Plugin 또는 Prebuild 필요. 기술적으로 가능은 함.

### 유지보수 상태
- 주요 라이브러리 대부분 **최근 1~2년간 유지보수 뜸함**. 이슈 쌓여 있음. Google Play 정책 때문에 사실상 수요가 죽음.

---

## 3. 개인정보보호법 관점

- SMS 읽기 권한은 한국 개인정보보호법상 **민감한 개인정보** 접근으로 취급.
- 사용자(사장님) 동의는 필수이며, 수집·이용 목적·보관 기간·제3자 제공 여부 명시해야 함.
- 더 큰 문제: SMS에는 **게스트의 전화번호**가 포함될 수 있음. 사장님 동의만으로 수집하는 건 부족하고, 게스트의 간접 동의(OTA 이용약관 경유)가 필요. 법적 회색지대.

---

## 4. 실무 판단

| 항목 | 평가 |
|------|------|
| iOS 지원 | 불가 |
| Android 기술적 구현 | 가능 |
| Google Play 심사 통과 | 거의 불가능 |
| 커버리지 (2026년 기준) | 낮음 (네이버 SMS 중단, OTA 앱 푸시 이전 추세) |
| 개발 비용 | 중 (Expo Bare + Config Plugin 필요) |
| 법적 리스크 | 높음 |

**결론**: SMS 자동 수신 경로는 Hosspie MVP에서 **제외**. 1인 개발자의 시간은 이메일 인바운드 + LLM 파싱에 투자하는 것이 훨씬 효율적이다.

---

## 부록: 만약 꼭 SMS가 필요하다면

**가상번호(050) 우회 경로**를 고려할 수 있다. `alternatives.md` 참고.
- 사장님이 OTA에 등록한 연락처를 Hosspie 발급 050 번호로 교체 → 백엔드가 통신사 API로 SMS 수신.
- Android/iOS 앱 권한 문제를 우회.
- 단, 비용(번호당 월 수천~수만원)과 사장님의 번호 교체 저항감이 크다.
