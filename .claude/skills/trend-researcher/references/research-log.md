# 리서치 로그

> 수행한 리서치의 이력을 기록합니다. 중복 조사 방지 및 후속 리서치 계획에 활용합니다.

## 완료된 리서치

| 날짜 | 주제 | 핵심 발견 | 결과물 위치 |
|------|------|----------|------------|
| 2026-04-04 | 예약 채널별 관리 현황 및 수수료 비교 | 네이버(0~3.74%) vs OTA(10~20%) 격차 큼. 소규모 업체는 네이버+DM 조합으로 운영, 엑셀 수기 관리가 보편적 | `research/reservation-management/` |
| 2026-04-04 | 자동 알림 수신/파싱 기술 실현 가능성 | iOS/Android SMS 읽기 불가(OS 정책), 네이버는 2023.9~앱푸시 전환. 이메일 인바운드 파싱(Cloudmailin 무료)이 가장 현실적. Android NotificationListenerService는 리스크 있는 옵션. 카카오 알림톡은 발송만, 수신 API 없음 | `research/auto-notification-parsing/` |
| 2026-04-05 | 멀티 채널 예약 API/연동 가능성 | 야놀자·여기어때 공개 API 없음, 네이버 예약 숙박 제외, Airbnb/Booking은 Connectivity Partner 심사 필요(Booking은 신규 등록 중단). ONDA 채널매니저 파트너십이 소규모 업체의 유일한 현실적 통합 경로. iCal은 Airbnb/Booking만 지원, 3시간 지연. DM 채널은 LLM 파싱으로 반자동화 권장. 3단계 전략: Phase1 iCal+이메일/DM LLM 파싱, Phase2 ONDA 파트너십, Phase3 자체 Connectivity 자격 | `research/multi-channel-api/` |

## 계획된 리서치

| 우선순위 | 주제 | 목적 | 상태 |
|----------|------|------|------|
| 높음 | 운영자 커뮤니티 페인포인트 심층 조사 | 네이버 카페/블로그에서 실제 운영자 불만 수집 | 미시작 |
| 높음 | PMS 앱스토어 리뷰 분석 | 기존 PMS의 강점/약점 파악 | 미시작 |
| 높음 | ONDA 파트너십 접근 경로 심층 조사 | 실제 파트너십 조건, 수수료, 기술 연동 범위 | 미시작 (multi-channel-api에서 후속 파생) |
| 중간 | 네이버 예약 API/연동 가능성 | 기술적 연동 방안 조사 | 완료 (multi-channel-api에 포함) |
| 중간 | 해외 소규모 숙박 관리 앱 벤치마킹 | 글로벌 트렌드 참고 | 미시작 |
| 중간 | LLM 기반 이메일/DM 예약 파싱 정확도 실험 | Phase 1 MVP 타당성 검증 | 미시작 |

## 주요 검색 키워드 (한국어)

리서치 시 효과적인 검색을 위한 키워드 모음:

- 게스트하우스 관리, 게스트하우스 운영, 게스트하우스 예약 시스템
- 소규모 숙박 관리, 펜션 관리 프로그램, 민박 운영
- 숙박업 PMS, 호텔 관리 시스템, 채널 매니저
- 야놀자 업주, 여기어때 업주, 에어비앤비 호스트
- 숙박업 창업, 게스트하우스 창업, 숙박업 트렌드
- 네이버 예약 수수료, 스마트플레이스 숙박, 네이버페이 PG수수료

## 주요 검색 키워드 (영어)

- hostel management software, guesthouse PMS
- small accommodation management, property management system
- channel manager hospitality, booking management
