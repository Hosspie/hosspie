# Hosspie 멀티 채널 연동 전략 제안

> 조사일: 2026-04-05
> 대상 독자: Hosspie 창업자/PM
> 가정: Hosspie는 소규모 게스트하우스·펜션 대상 모바일 우선 관리 앱 (AI 디자인→개발 파이프라인 활용 중)

## 전략 원칙

1. **소규모 업주의 "지금" 문제부터 해결**: API 연동이 완벽하지 않아도 업주가 여러 채널을 한눈에 볼 수 있는 것만으로도 가치 제공.
2. **공식 API에 너무 일찍 베팅하지 않는다**: 파트너 심사는 6개월~2년이 걸릴 수 있음. 심사 대기 중에 제품 가치를 증명할 방법이 필요.
3. **비구조적 데이터(DM·카톡·이메일)를 1급 시민으로 대우**: Hosspie의 현실 경쟁력은 여기서 나올 가능성이 높음. 경쟁사(ONDA·야놀자클라우드)가 소홀히 하는 영역.
4. **채널매니저 파트너십은 확실하지만 양날의 검**: 종속과 수수료 쌓임을 염두에 두고 단계적으로 의존도 조정.

---

## Phase 1: MVP (0~3개월) — "AI 통합 인박스" 포지셔닝

### 목표
업주가 **5분 내에 Hosspie에 예약 5건을 통합**할 수 있는 경험 제공. 완벽한 실시간 동기화 대신 "한 화면에 모이는 것"이 핵심.

### 연동 기능

#### 1. Airbnb + Booking.com: iCal 브릿지
- 업주에게 iCal URL 복사 → Hosspie에 붙여넣는 2단계 온보딩.
- Hosspie 백엔드에서 3시간 주기로 .ics 파일 fetch → Prisma의 `Reservation` 테이블에 저장.
- 한계 명시: "오버부킹 100% 방지는 아닙니다. 정확도를 위해서는 ONDA 연동(Phase 2)이 필요합니다"를 UX에 투명하게 노출.
- 예상 개발: 2주.

#### 2. 이메일 파싱 어댑터 (네이버 예약, 야놀자, 여기어때)
- 업주가 예약 알림 이메일을 전용 Hosspie 주소로 **자동 전달 설정** (Gmail 필터, 네이버 메일 규칙).
- Hosspie가 수신 이메일을 LLM(Claude/GPT)으로 파싱 → 예약 카드 생성.
- 각 채널별 이메일 템플릿 학습. 실패 시 업주가 필드 수정 → 학습 데이터로 활용.
- 예상 개발: 3~4주 (LLM 파싱 파이프라인 + 수정 UI).

#### 3. DM 어시스턴트 (카카오톡·Instagram·문자)
- 업주가 메시지 스크린샷 업로드 또는 텍스트 붙여넣기.
- LLM이 날짜/인원/객실/연락처 추출 → 예약 카드 생성.
- Instagram Graph API 정식 연동은 Phase 2 이후 (앱 심사 필요).
- 카카오톡 알림톡으로 게스트에게 예약 확정 메시지 발송 (솔라피·NHN 등 인증 발송대행 활용).
- 예상 개발: 3주.

#### 4. 수기 입력 (안전망)
- 어떤 자동화도 실패했을 때, 업주가 5개 필드만 입력하면 예약 생성.
- 모든 채널의 폴백.

### 성공 지표
- 예약 1건을 Hosspie에 넣는 평균 시간 < 30초
- 이메일 파싱 정확도 > 90% (2주 학습 후)
- 업주 WAU/MAU > 0.5 (주 3회 이상 앱 사용)

---

## Phase 2: 확장 (3~9개월) — "ONDA 파트너십"

### 목표
한국 OTA(야놀자·여기어때·네이버) 커버리지를 확보해, Hosspie를 "진짜 멀티채널 PMS"로 포지셔닝.

### 실행 액션

#### 1. ONDA 파트너십 협상 (가장 중요)
- `onda.me/affiliate` 경로로 초기 접촉.
- 협상 포인트:
  - Hosspie는 **디자인·UX·자동화**에 특화, ONDA는 **유통 인프라** 담당 — 경쟁 아닌 보완 관계로 포지셔닝.
  - 공동 마케팅 제안 (ONDA 고객 중 소형 호스텔·게스트하우스를 Hosspie로 안내).
  - 수수료 레이어 최소화 협상.
- 기술 연동:
  - ONDA REST API 연동 (채널별 예약/가격/재고 조회·업데이트).
  - 1~2개월 내 기본 연동 가능할 것으로 추정.
  - Phase 1의 iCal·이메일 파싱과 공존 (ONDA 미가입 업체 대응).

#### 2. 네이버 스마트플레이스 제휴 시도
- ONDA도 네이버 연동이 제한적일 수 있으므로 별도 제휴 추진.
- 네이버 고객센터(1644-5690) → 숙박 비즈니스 팀 연결.

#### 3. Instagram Graph API 정식 연동
- 메타 앱 심사 통과 (2~3개월 소요).
- 비즈니스 계정 DM 자동 수신·파싱·응답.
- 24시간 규칙 내에서 자동화 UX 설계.

#### 4. 카카오톡 챗봇 (선택)
- Hosspie 브랜드 카카오 채널 개설 + 오픈빌더 봇.
- 게스트가 "예약 가능한가요?" DM → 봇이 업주 캘린더 조회 후 응답.
- 게스트하우스 오너에게 자체 카카오 채널 제공하는 화이트라벨 고려.

### 성공 지표
- ONDA 연동 완료 후 한국 5대 채널(야놀자/여기어때/네이버/Airbnb/Booking) 커버리지 달성
- 파트너 채널 예약 실시간성 < 5분
- 유료 전환율 > 10% (ONDA 연동이 유료 락인 포인트)

---

## Phase 3: 독립 (9~18개월) — "자체 Connectivity 자격"

### 목표
거래량 기반으로 Airbnb Preferred Partner, Booking.com Connectivity Partner 자격을 직접 획득. ONDA 의존도를 분산.

### 실행 액션

#### 1. Airbnb Preferred Software Partner 신청
- 데이터 보안·API 품질 심사 준비 (ISO 27001 또는 SOC 2 고려).
- 최소 수백 개 리스팅을 관리하는 트랙 레코드 필요 (Phase 2에서 확보).
- 심사 기간 3~6개월 예상.

#### 2. Booking.com Connectivity Partner 등록
- 2025~2026 신규 등록이 재개되면 즉시 신청.
- 1년치 rate·availability 제공 능력, 사용자 친화 UI 등 요건 충족.
- OTA XML 또는 JSON 스키마 지원.

#### 3. 야놀자·여기어때 B2B 제휴 재시도
- 거래량이 야놀자클라우드/여기어때 비즈에 매력적이 되면 직접 협상 가능성 열림.

#### 4. 자체 Distribution Hub 초기 버전
- Hosspie를 쓰는 호스트들의 재고를 Agoda/Expedia 등 채널에 직접 판매하는 역채널매니저화.
- 장기적으로 ONDA 경쟁자화 가능 (리스크·기회 동시 존재).

---

## 기술 아키텍처 제안 (요약)

```
┌─────────────────────────────────────────────────────┐
│  Hosspie 앱 (Expo/RN) - organisms UI                │
└─────────────────────────┬───────────────────────────┘
                          │ GraphQL
┌─────────────────────────▼───────────────────────────┐
│  Hosspie API (NestJS)                                │
│  ├─ ReservationService (통합 모델)                    │
│  ├─ ChannelAdapter 인터페이스                         │
│  │   ├─ ICalAdapter (Airbnb, Booking iCal)           │
│  │   ├─ EmailParsingAdapter (네이버/야놀자/여기어때)    │
│  │   ├─ LLMMessageAdapter (카톡/인스타 DM)            │
│  │   ├─ OndaAdapter (Phase 2)                        │
│  │   ├─ AirbnbApiAdapter (Phase 3)                   │
│  │   └─ BookingConnectivityAdapter (Phase 3)         │
│  └─ WebhookReceiver / Poller                         │
└─────────────────────────┬───────────────────────────┘
                          │
                 ┌────────┴─────────┐
                 │  Prisma/Postgres │
                 │  Reservation     │
                 │  ChannelMapping  │
                 │  ParsedSource    │
                 └──────────────────┘
```

**핵심 설계**: `ChannelAdapter` 인터페이스로 모든 채널을 추상화. Phase 1의 허술한 어댑터와 Phase 3의 공식 API 어댑터가 동일한 인터페이스를 구현해 점진적 교체 가능.

**공통 도메인 모델**:
```prisma
model Reservation {
  id            String   @id
  guesthouseId  String
  roomId        String?
  channelId     String   // "airbnb" | "booking" | "yanolja" | ...
  externalId    String?  // 채널별 ID (iCal UID, 이메일 MessageID, ONDA 예약 ID)
  sourceType    SourceType // ICAL | EMAIL | DM | API | MANUAL
  checkIn       DateTime
  checkOut      DateTime
  guestName     String?
  guestContact  String?
  rawPayload    Json     // 원본 보관 (디버깅/재파싱)
  confidence    Float    // LLM 파싱 시 신뢰도
  ...
}
```

---

## 리스크 및 완화책

| 리스크 | 완화 |
|--------|------|
| ONDA가 파트너십 거절 | Phase 1 iCal+이메일 파싱으로 단독 운영 가능한 MVP 유지 |
| iCal 3시간 지연으로 오버부킹 | UX에 투명 고지, Airbnb Instant Book 설정 권장 |
| LLM 파싱 오류 | 수정 UI 필수, 매 케이스 학습 루프 |
| Booking.com 파트너 등록 재개 지연 | ONDA 경유로 무기한 대체 가능 |
| 야놀자·여기어때 스크래핑 유혹 | **금지**. 약관 위반·법적 리스크(2022 판례 참조). 수기·이메일 파싱만 사용. |
| 카카오/인스타 API 심사 실패 | 업주가 직접 붙여넣는 반자동 UX로 백업 |

---

## 한 줄 요약

**"Phase 1에서는 iCal + LLM 이메일/DM 파싱으로 빠르게 가치를 증명하고, Phase 2에 ONDA 파트너십으로 한국 OTA 커버리지를 확보한 다음, Phase 3에 자체 Connectivity 자격을 얻어 독립한다."**
