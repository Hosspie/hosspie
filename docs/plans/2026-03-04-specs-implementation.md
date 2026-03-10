# 기획 명세서 패키지 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** docs 패키지를 생성하고, 각 스크린의 기획 명세서를 기능 코드와 테스트 케이스를 포함하여 작성한다.

**Architecture:** docs 패키지는 apps/admin의 라우트 구조를 미러링한다. 공통 참조(`_shared/`)와 스크린별 명세(`admin/`)로 구성하며, 향후 `guest/`가 추가될 수 있다.

**Tech Stack:** Markdown, pnpm workspace

---

## Task 1: docs 패키지 인프라 생성

**Files:**
- Create: `docs/package.json`
- Modify: `pnpm-workspace.yaml`

**Step 1: package.json 생성**

```json
{
  "name": "@hosspie/docs",
  "version": "0.0.1",
  "private": true,
  "description": "Hosspie 기획 명세서"
}
```

**Step 2: pnpm-workspace.yaml에 docs 추가**

```yaml
packages:
  - apps/*
  - packages/**/*
  - docs

nodeLinker: hoisted
```

**Step 3: 디렉토리 구조 생성**

```bash
mkdir -p docs/_shared
mkdir -p docs/admin/onboarding
mkdir -p "docs/admin/(authenticated)/(tabs)"
mkdir -p docs/guest
mkdir -p docs/plans
```

**Step 4: Commit**

```bash
git add docs/package.json pnpm-workspace.yaml
git commit -m "chore: docs 패키지 인프라 생성"
```

---

## Task 2: 전체 기능 코드 목록 작성

**Files:**
- Create: `docs/_shared/feature-codes.md`

**Step 1: 파일 작성**

```markdown
# 기능 코드 목록

## 코드 규칙

```
형식: {도메인}-{스크린}-{번호}
테스트: {기능코드}-T{번호}
```

## 도메인 접두어

| 접두어 | 도메인 | 설명 |
|--------|--------|------|
| AUTH | 인증 | 로그인, 회원가입 |
| OBD | 온보딩 | 게스트하우스 최초 등록 |
| HOME | 홈 | 메인 대시보드 |
| CHK | 체크인 | 게스트 체크인 관리 |
| SCH | 스케줄 | 스탭 근무 관리 |
| CHAT | 채팅 | 게스트-게스트하우스 1:1 채팅 |
| PROF | 프로필 | 프로필 조회/수정 |
| GRST | 게스트 등록 | 게스트 수동 등록 |

## 전체 기능 코드

### AUTH (인증)
| 코드 | 기능명 | 스크린 |
|------|--------|--------|
| AUTH-SIGNIN-001 | 전화번호 OTP 인증 | signin.md |
| AUTH-SIGNIN-002 | 카카오 소셜 로그인 | signin.md |
| AUTH-SIGNIN-003 | 네이버 소셜 로그인 | signin.md |
| AUTH-SIGNIN-004 | 애플 소셜 로그인 | signin.md |

### OBD (온보딩)
| 코드 | 기능명 | 스크린 |
|------|--------|--------|
| OBD-DESC-001 | 게스트하우스 이름 입력 | onboarding/description.md |
| OBD-DESC-002 | 게스트하우스 설명 입력 | onboarding/description.md |
| OBD-INFO-001 | 주소 입력 | onboarding/information.md |
| OBD-INFO-002 | 전화번호 입력 | onboarding/information.md |
| OBD-INFO-003 | 이메일 입력 | onboarding/information.md |
| OBD-INFO-004 | 웹사이트 입력 | onboarding/information.md |
| OBD-PARTY-001 | 파티 방식 선택 | onboarding/dinner-party.md |
| OBD-ROOMS-001 | 방 추가 | onboarding/rooms.md |
| OBD-ROOMS-002 | 방 삭제 | onboarding/rooms.md |
| OBD-ROOMS-003 | 온보딩 완료 | onboarding/rooms.md |

### HOME (홈)
| 코드 | 기능명 | 스크린 |
|------|--------|--------|
| HOME-DASH-001 | 공유사항 조회 | (tabs)/index.md |
| HOME-DASH-002 | 공유사항 작성 | (tabs)/index.md |
| HOME-DASH-003 | 체크인 현황 요약 | (tabs)/index.md |
| HOME-DASH-004 | 이번주 스탭 근무표 요약 | (tabs)/index.md |
| HOME-DASH-005 | 게스트 등록 유도 | (tabs)/index.md |

### CHK (체크인)
| 코드 | 기능명 | 스크린 |
|------|--------|--------|
| CHK-LIST-001 | 게스트 목록 조회 | (tabs)/check-in.md |
| CHK-LIST-002 | 체크인 상태 토글 | (tabs)/check-in.md |
| CHK-LIST-003 | 게스트 메모 등록 | (tabs)/check-in.md |
| CHK-LIST-004 | 개인 SMS 발송 | (tabs)/check-in.md |
| CHK-LIST-005 | 파티 참가 여부 표시 | (tabs)/check-in.md |

### SCH (스케줄)
| 코드 | 기능명 | 스크린 |
|------|--------|--------|
| SCH-WEEK-001 | 이번주 스탭 근무 조회 | (tabs)/schedule.md |
| SCH-WEEK-002 | 스탭 근무 등록/수정 | (tabs)/schedule.md |
| SCH-WEEK-003 | 스탭 초대 (딥링크) | (tabs)/schedule.md |

### CHAT (채팅)
| 코드 | 기능명 | 스크린 |
|------|--------|--------|
| CHAT-CONV-001 | 채팅 목록 조회 | (tabs)/chat.md |
| CHAT-CONV-002 | 메시지 전송 | (tabs)/chat.md |
| CHAT-CONV-003 | 메시지 실시간 수신 | (tabs)/chat.md |

### PROF (프로필)
| 코드 | 기능명 | 스크린 |
|------|--------|--------|
| PROF-EDIT-001 | host 프로필 수정 | edit-profile.md |
| PROF-EDIT-002 | staff 프로필 수정 | edit-profile.md |

### GRST (게스트 등록)
| 코드 | 기능명 | 스크린 |
|------|--------|--------|
| GRST-REG-001 | 게스트 수동 등록 | register-guests.md |
| GRST-REG-002 | 안내 SMS 일괄 발송 | register-guests.md |
```

**Step 2: Commit**

```bash
git add docs/_shared/feature-codes.md
git commit -m "docs: 전체 기능 코드 목록 작성"
```

---

## Task 3: 공통 데이터 모델 작성

**Files:**
- Create: `docs/_shared/data-models.md`

**Step 1: 파일 작성**

```markdown
# 공통 데이터 모델

기획 단계에서 정의하는 개념 모델이다. 실제 DB 스키마와 API 응답은 각 직군이 결정한다.

## 사용자

### Host (게스트하우스 오너)
| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | 고유 식별자 |
| phone | string | 전화번호 |
| name | string | 이름 |
| socialProvider | 'kakao' \| 'naver' \| 'apple' \| null | 소셜 로그인 제공자 |
| guesthouseId | string | 소유한 게스트하우스 ID |

### Staff (직원)
| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | 고유 식별자 |
| phone | string | 전화번호 |
| name | string | 이름 |
| socialProvider | 'kakao' \| 'naver' \| 'apple' \| null | 소셜 로그인 제공자 |
| guesthouseId | string | 소속 게스트하우스 ID |
| invitedBy | string | 초대한 host ID |

## 게스트하우스

### Guesthouse
| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | 고유 식별자 |
| name | string | 게스트하우스 이름 |
| description | string | 설명 |
| address | string | 주소 |
| phone | string | 대표 전화번호 |
| email | string | 이메일 |
| website | string \| null | 웹사이트 (선택) |
| dinnerParty | IDinnerParty | 파티 방식 |
| rooms | IRoom[] | 방 목록 |

### IDinnerParty
`'POT_LUCK' | 'HOST_SERVED' | 'CUSTOM'`

### IRoom
| 필드 | 타입 | 설명 |
|------|------|------|
| capacity | number | 수용 인원 (1-4) |
| gender | IGender | 성별 제한 |
| name | string | 방 이름 (선택) |
| hasBathroom | boolean | 개인 화장실 여부 |

### IGender
`'male' | 'female' | 'regardless'`

## 게스트

### Guest
| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | 고유 식별자 |
| name | string | 이름 |
| phone | string | 전화번호 |
| expectedArrivalTime | string | 도착 예상 시간 (HH:mm) |
| checkedIn | boolean | 체크인 여부 |
| partyAttending | boolean | 파티 참가 여부 |
| memo | string \| null | 내부 메모 |
| roomId | string | 배정 방 ID |
| checkInDate | string | 체크인 날짜 (YYYY-MM-DD) |
| checkOutDate | string | 체크아웃 날짜 (YYYY-MM-DD) |

## 공유사항

### Announcement
| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | 고유 식별자 |
| content | string | 내용 |
| authorId | string | 작성자 ID (host 또는 staff) |
| createdAt | string | 작성 시간 |

## 스케줄

### StaffSchedule
| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | 고유 식별자 |
| staffId | string | 스탭 ID |
| date | string | 근무 날짜 (YYYY-MM-DD) |

## 채팅

### ChatRoom
| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | 고유 식별자 |
| guestId | string | 게스트 ID |
| guesthouseId | string | 게스트하우스 ID |
| lastMessage | string | 마지막 메시지 미리보기 |
| lastMessageAt | string | 마지막 메시지 시간 |
| unreadCount | number | 읽지 않은 메시지 수 |

### ChatMessage
| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | 고유 식별자 |
| chatRoomId | string | 채팅방 ID |
| senderId | string | 발신자 ID |
| senderType | 'guest' \| 'host' \| 'staff' | 발신자 역할 |
| content | string | 메시지 내용 |
| createdAt | string | 전송 시간 |
```

**Step 2: Commit**

```bash
git add docs/_shared/data-models.md
git commit -m "docs: 공통 데이터 모델 정의"
```

---

## Task 4: 로그인 명세서 작성

**Files:**
- Create: `docs/admin/signin.md`

**Step 1: 파일 작성**

```markdown
# 로그인 (AUTH-SIGNIN)

## 개요
- **목적**: 사용자가 전화번호 OTP 또는 소셜 로그인으로 인증한다
- **진입 경로**: `signin.tsx`

---

## 기능 목록 & 테스트 케이스

### AUTH-SIGNIN-001: 전화번호 OTP 인증
> 전화번호를 입력하면 OTP를 발송하고, OTP 입력 후 인증을 완료한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| AUTH-SIGNIN-001-T01 | OTP 발송 성공 | 전화번호 입력란 표시됨 | 유효한 전화번호 입력 후 인증 요청 | OTP 발송 성공, OTP 입력란 표시 |
| AUTH-SIGNIN-001-T02 | 잘못된 전화번호 | 전화번호 입력란 표시됨 | 잘못된 형식의 번호 입력 후 인증 요청 | 유효성 에러 표시 |
| AUTH-SIGNIN-001-T03 | OTP 인증 성공 | OTP 입력란 표시됨 | 올바른 OTP 입력 | 인증 완료, 미등록 시 온보딩으로 / 등록 시 홈으로 이동 |
| AUTH-SIGNIN-001-T04 | OTP 인증 실패 | OTP 입력란 표시됨 | 잘못된 OTP 입력 | 에러 메시지 "인증번호가 올바르지 않습니다" |
| AUTH-SIGNIN-001-T05 | OTP 재발송 | OTP 입력란 표시됨 | 재발송 버튼 클릭 | 새 OTP 발송, 타이머 초기화 |

---

### AUTH-SIGNIN-002: 카카오 소셜 로그인
> 카카오 계정으로 로그인한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| AUTH-SIGNIN-002-T01 | 로그인 성공 (신규) | 로그인 화면 표시됨 | 카카오 로그인 버튼 클릭 → 카카오 인증 완료 | 온보딩 화면으로 이동 |
| AUTH-SIGNIN-002-T02 | 로그인 성공 (기존) | 로그인 화면 표시됨 | 카카오 로그인 버튼 클릭 → 카카오 인증 완료 | 홈 화면으로 이동 |
| AUTH-SIGNIN-002-T03 | 로그인 취소 | 카카오 인증 화면 표시됨 | 사용자가 인증 취소 | 로그인 화면으로 복귀 |

---

### AUTH-SIGNIN-003: 네이버 소셜 로그인
> 네이버 계정으로 로그인한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| AUTH-SIGNIN-003-T01 | 로그인 성공 (신규) | 로그인 화면 표시됨 | 네이버 로그인 버튼 클릭 → 네이버 인증 완료 | 온보딩 화면으로 이동 |
| AUTH-SIGNIN-003-T02 | 로그인 성공 (기존) | 로그인 화면 표시됨 | 네이버 로그인 버튼 클릭 → 네이버 인증 완료 | 홈 화면으로 이동 |
| AUTH-SIGNIN-003-T03 | 로그인 취소 | 네이버 인증 화면 표시됨 | 사용자가 인증 취소 | 로그인 화면으로 복귀 |

---

### AUTH-SIGNIN-004: 애플 소셜 로그인
> 애플 계정으로 로그인한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| AUTH-SIGNIN-004-T01 | 로그인 성공 (신규) | 로그인 화면 표시됨 | 애플 로그인 버튼 클릭 → 애플 인증 완료 | 온보딩 화면으로 이동 |
| AUTH-SIGNIN-004-T02 | 로그인 성공 (기존) | 로그인 화면 표시됨 | 애플 로그인 버튼 클릭 → 애플 인증 완료 | 홈 화면으로 이동 |
| AUTH-SIGNIN-004-T03 | 로그인 취소 | 애플 인증 화면 표시됨 | 사용자가 인증 취소 | 로그인 화면으로 복귀 |
```

**Step 2: Commit**

```bash
git add docs/admin/signin.md
git commit -m "docs: 로그인 명세서 작성 (AUTH-SIGNIN)"
```

---

## Task 5: 온보딩 - 기본정보 명세서 작성

**Files:**
- Create: `docs/admin/onboarding/description.md`

**Step 1: 파일 작성**

```markdown
# 게스트하우스 기본정보 입력 (OBD-DESC)

## 개요
- **목적**: 게스트하우스의 이름과 설명을 입력한다 (온보딩 1단계)
- **진입 경로**: `onboarding/description/index.tsx`

---

## 기능 목록 & 테스트 케이스

### OBD-DESC-001: 게스트하우스 이름 입력
> 게스트하우스 이름을 입력하고 유효성을 검증한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| OBD-DESC-001-T01 | 유효한 이름 입력 | 이름 입력란 비어있음 | "해피 게스트하우스" 입력 | 유효성 통과, 다음 버튼 활성화 |
| OBD-DESC-001-T02 | 이름 미입력 | 이름 입력란 비어있음 | 다음 버튼 클릭 | 에러 "게스트하우스 이름을 입력해주세요" |
| OBD-DESC-001-T03 | 이름 너무 짧음 | 이름 입력란 표시됨 | 1글자 입력 후 다음 | 에러 "2자 이상 입력해주세요" |
| OBD-DESC-001-T04 | 이름 너무 길음 | 이름 입력란 표시됨 | 50자 초과 입력 후 다음 | 에러 "50자 이하로 입력해주세요" |

---

### OBD-DESC-002: 게스트하우스 설명 입력
> 게스트하우스 설명을 입력하고 유효성을 검증한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| OBD-DESC-002-T01 | 유효한 설명 입력 | 설명 텍스트영역 비어있음 | 10자 이상 설명 입력 | 유효성 통과 |
| OBD-DESC-002-T02 | 설명 미입력 | 설명 텍스트영역 비어있음 | 다음 버튼 클릭 | 에러 "설명을 입력해주세요" |
| OBD-DESC-002-T03 | 설명 너무 짧음 | 설명 텍스트영역 표시됨 | 9자 이하 입력 후 다음 | 에러 "10자 이상 입력해주세요" |
| OBD-DESC-002-T04 | 다음 단계 이동 | 이름, 설명 모두 유효하게 입력됨 | 다음 버튼 클릭 | `onboarding/information`으로 이동 |
```

**Step 2: Commit**

```bash
git add docs/admin/onboarding/description.md
git commit -m "docs: 온보딩 기본정보 명세서 작성 (OBD-DESC)"
```

---

## Task 6: 온보딩 - 상세정보 명세서 작성

**Files:**
- Create: `docs/admin/onboarding/information.md`

**Step 1: 파일 작성**

```markdown
# 게스트하우스 상세정보 입력 (OBD-INFO)

## 개요
- **목적**: 게스트하우스의 주소, 전화번호, 이메일, 웹사이트를 입력한다 (온보딩 2단계)
- **진입 경로**: `onboarding/information/index.tsx`

---

## 기능 목록 & 테스트 케이스

### OBD-INFO-001: 주소 입력
> 게스트하우스 주소를 입력하고 유효성을 검증한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| OBD-INFO-001-T01 | 유효한 주소 입력 | 주소 입력란 비어있음 | "서울시 마포구 합정동 123-4" 입력 | 유효성 통과 |
| OBD-INFO-001-T02 | 주소 미입력 | 주소 입력란 비어있음 | 다음 버튼 클릭 | 에러 표시 |
| OBD-INFO-001-T03 | 주소 너무 짧음 | 주소 입력란 표시됨 | 4자 이하 입력 | 에러 "5자 이상 입력해주세요" |

---

### OBD-INFO-002: 전화번호 입력
> 대표 전화번호를 입력하고 형식을 검증한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| OBD-INFO-002-T01 | 유효한 번호 (지역번호) | 전화번호 입력란 표시됨 | "02-1234-5678" 입력 | 유효성 통과 |
| OBD-INFO-002-T02 | 유효한 번호 (핸드폰) | 전화번호 입력란 표시됨 | "010-1234-5678" 입력 | 유효성 통과 |
| OBD-INFO-002-T03 | 잘못된 형식 | 전화번호 입력란 표시됨 | "12345678" 입력 | 에러 "올바른 전화번호 형식을 입력해주세요" |

---

### OBD-INFO-003: 이메일 입력
> 이메일을 입력하고 형식을 검증한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| OBD-INFO-003-T01 | 유효한 이메일 | 이메일 입력란 표시됨 | "host@example.com" 입력 | 유효성 통과 |
| OBD-INFO-003-T02 | 잘못된 형식 | 이메일 입력란 표시됨 | "invalid-email" 입력 | 에러 "올바른 이메일 형식을 입력해주세요" |

---

### OBD-INFO-004: 웹사이트 입력
> 웹사이트 URL을 입력한다 (선택사항)

| 우선순위 | P1 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| OBD-INFO-004-T01 | 유효한 URL | 웹사이트 입력란 표시됨 | "https://myguesthouse.com" 입력 | 유효성 통과 |
| OBD-INFO-004-T02 | 프로토콜 누락 | 웹사이트 입력란 표시됨 | "myguesthouse.com" 입력 | 에러 "http:// 또는 https://를 포함해주세요" |
| OBD-INFO-004-T03 | 미입력 (선택) | 웹사이트 입력란 비어있음 | 다음 버튼 클릭 | 유효성 통과, 다음 단계 이동 |
| OBD-INFO-004-T04 | 다음 단계 이동 | 모든 필수 필드 유효 | 다음 버튼 클릭 | `onboarding/dinner-party`로 이동 |
| OBD-INFO-004-T05 | 이전 단계 이동 | 화면 표시됨 | 이전 버튼 클릭 | `onboarding/description`으로 이동, 입력값 유지 |
```

**Step 2: Commit**

```bash
git add docs/admin/onboarding/information.md
git commit -m "docs: 온보딩 상세정보 명세서 작성 (OBD-INFO)"
```

---

## Task 7: 온보딩 - 파티 방식 명세서 작성

**Files:**
- Create: `docs/admin/onboarding/dinner-party.md`

**Step 1: 파일 작성**

```markdown
# 파티 방식 선택 (OBD-PARTY)

## 개요
- **목적**: 게스트하우스의 저녁 파티 운영 방식을 선택한다 (온보딩 3단계)
- **진입 경로**: `onboarding/dinner-party/index.tsx`

---

## 기능 목록 & 테스트 케이스

### OBD-PARTY-001: 파티 방식 선택
> 3가지 파티 방식 중 하나를 선택한다. CUSTOM 선택 시 상세 설명을 입력할 수 있다.

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| OBD-PARTY-001-T01 | POT_LUCK 선택 | 3개 카드 표시됨 | POT_LUCK 카드 선택 | 선택됨 표시, 다음 버튼 활성화 |
| OBD-PARTY-001-T02 | HOST_SERVED 선택 | 3개 카드 표시됨 | HOST_SERVED 카드 선택 | 선택됨 표시, 다음 버튼 활성화 |
| OBD-PARTY-001-T03 | CUSTOM 선택 | 3개 카드 표시됨 | CUSTOM 카드 선택 | 선택됨 표시, 상세 입력란 펼침 |
| OBD-PARTY-001-T04 | 미선택 시 진행 불가 | 아무것도 선택 안 됨 | 다음 버튼 클릭 | 에러 "파티 방식을 선택해주세요" |
| OBD-PARTY-001-T05 | 다음 단계 이동 | 파티 방식 선택됨 | 다음 버튼 클릭 | `onboarding/rooms`로 이동 |
| OBD-PARTY-001-T06 | 이전 단계 이동 | 화면 표시됨 | 이전 버튼 클릭 | `onboarding/information`으로 이동, 선택값 유지 |
```

**Step 2: Commit**

```bash
git add docs/admin/onboarding/dinner-party.md
git commit -m "docs: 온보딩 파티 방식 명세서 작성 (OBD-PARTY)"
```

---

## Task 8: 온보딩 - 방 정보 명세서 작성

**Files:**
- Create: `docs/admin/onboarding/rooms.md`

**Step 1: 파일 작성**

```markdown
# 방 정보 등록 (OBD-ROOMS)

## 개요
- **목적**: 게스트하우스의 방 정보를 등록하고 온보딩을 완료한다 (온보딩 4단계)
- **진입 경로**: `onboarding/rooms/index.tsx`

---

## 기능 목록 & 테스트 케이스

### OBD-ROOMS-001: 방 추가
> FAB 버튼을 눌러 모달에서 방 정보를 입력하고 추가한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| OBD-ROOMS-001-T01 | 방 추가 성공 | 모달에서 인원(2), 성별(regardless), 화장실(있음) 입력 | 추가 버튼 클릭 | 방 카드가 목록에 추가됨, 모달 닫힘 |
| OBD-ROOMS-001-T02 | 필수 항목 누락 | 모달에서 인원만 선택 | 추가 버튼 클릭 | 에러 표시 (성별, 화장실 선택 필요) |
| OBD-ROOMS-001-T03 | 방 이름 입력 (선택) | 모달 열림 | 방 이름 "201호" 입력 + 나머지 필수값 입력 후 추가 | 카드에 "201호" 이름 표시 |
| OBD-ROOMS-001-T04 | 여러 방 추가 | 방 1개 등록됨 | FAB 클릭 → 새 방 정보 입력 → 추가 | 목록에 방 2개 표시 |

---

### OBD-ROOMS-002: 방 삭제
> 등록된 방을 목록에서 삭제한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| OBD-ROOMS-002-T01 | 방 삭제 | 방 2개 등록됨 | 방 카드의 삭제 버튼 클릭 | 해당 방 삭제, 목록에 1개 남음 |

---

### OBD-ROOMS-003: 온보딩 완료
> 방 정보를 하나 이상 등록한 후 온보딩을 완료한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| OBD-ROOMS-003-T01 | 온보딩 완료 | 방 1개 이상 등록됨 | 온보딩 완료 버튼 클릭 | 홈 화면 `(authenticated)/(tabs)/index.tsx`로 이동 |
| OBD-ROOMS-003-T02 | 방 없이 완료 시도 | 방 0개 | 온보딩 완료 버튼 클릭 | 에러 "최소 1개 이상의 방을 등록해주세요" |
| OBD-ROOMS-003-T03 | 이전 단계 이동 | 화면 표시됨 | 이전 버튼 클릭 | `onboarding/dinner-party`로 이동, 등록된 방 유지 |
```

**Step 2: Commit**

```bash
git add docs/admin/onboarding/rooms.md
git commit -m "docs: 온보딩 방 정보 명세서 작성 (OBD-ROOMS)"
```

---

## Task 9: 홈 대시보드 명세서 작성

**Files:**
- Create: `docs/admin/(authenticated)/(tabs)/index.md`

**Step 1: 파일 작성**

```markdown
# 홈 대시보드 (HOME-DASH)

## 개요
- **목적**: 오늘의 핵심 정보를 한 화면에 요약하여 보여준다
- **진입 경로**: `(authenticated)/(tabs)/index.tsx`

---

## 기능 목록 & 테스트 케이스

### HOME-DASH-001: 공유사항 조회
> 오늘의 공유사항 목록을 표시한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| HOME-DASH-001-T01 | 공유사항 있음 | 오늘 공유사항 2개 등록됨 | 홈 화면 진입 | 공유사항 2개 표시 (작성자, 내용, 시간) |
| HOME-DASH-001-T02 | 공유사항 없음 | 오늘 공유사항 없음 | 홈 화면 진입 | "등록된 공유사항이 없습니다" 안내 |

---

### HOME-DASH-002: 공유사항 작성
> host 또는 staff가 공유사항을 작성한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| HOME-DASH-002-T01 | 작성 성공 | 공유사항 입력란 표시됨 | 내용 입력 후 등록 | 목록 최상단에 추가됨 |
| HOME-DASH-002-T02 | 빈 내용 | 공유사항 입력란 표시됨 | 내용 미입력 후 등록 | 유효성 에러 표시 |
| HOME-DASH-002-T03 | host가 작성 | host로 로그인됨 | 공유사항 작성 | 작성자에 host 이름 표시 |
| HOME-DASH-002-T04 | staff가 작성 | staff로 로그인됨 | 공유사항 작성 | 작성자에 staff 이름 표시 |

---

### HOME-DASH-003: 체크인 현황 요약
> 오늘의 체크인 현황을 요약하여 보여준다

| 우선순위 | P1 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| HOME-DASH-003-T01 | 현황 표시 | 오늘 게스트 8명, 3명 체크인 완료 | 홈 화면 진입 | "3/8명 체크인" 표시 |
| HOME-DASH-003-T02 | 게스트 없음 | 오늘 체크인 게스트 없음 | 홈 화면 진입 | "오늘 체크인 게스트가 없습니다" 표시 |
| HOME-DASH-003-T03 | 탭 이동 | 체크인 현황 영역 표시됨 | 현황 영역 클릭 | 체크인 탭 `(tabs)/check-in.tsx`으로 이동 |

---

### HOME-DASH-004: 이번주 스탭 근무표 요약
> 이번주 스탭 근무 스케줄을 간략히 보여준다

| 우선순위 | P1 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| HOME-DASH-004-T01 | 근무표 있음 | 이번주 근무 등록된 스탭 존재 | 홈 화면 진입 | 요일별 근무 스탭 이름 간략 표시 |
| HOME-DASH-004-T02 | 근무표 없음 | 등록된 근무 없음 | 홈 화면 진입 | "등록된 근무가 없습니다" 표시 |
| HOME-DASH-004-T03 | 탭 이동 | 근무표 영역 표시됨 | 근무표 영역 클릭 | 스케줄 탭 `(tabs)/schedule.tsx`로 이동 |

---

### HOME-DASH-005: 게스트 등록 유도
> 오늘 게스트가 등록되지 않았을 때 등록을 유도한다

| 우선순위 | P1 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| HOME-DASH-005-T01 | 유도 메시지 표시 | 오늘 게스트 미등록 | 홈 화면 진입 | "오늘의 게스트를 등록해주세요" + 등록 버튼 표시 |
| HOME-DASH-005-T02 | 등록 화면 이동 | 유도 메시지 표시됨 | 등록 버튼 클릭 | 게스트 등록 화면 `register-guests.tsx`로 이동 |
| HOME-DASH-005-T03 | 유도 미표시 | 오늘 게스트 1명 이상 등록됨 | 홈 화면 진입 | 유도 메시지 미표시, 체크인 현황 표시 |
```

**Step 2: Commit**

```bash
git add "docs/admin/(authenticated)/(tabs)/index.md"
git commit -m "docs: 홈 대시보드 명세서 작성 (HOME-DASH)"
```

---

## Task 10: 체크인 관리 명세서 작성

**Files:**
- Create: `docs/admin/(authenticated)/(tabs)/check-in.md`

**Step 1: 파일 작성**

```markdown
# 체크인 관리 (CHK-LIST)

## 개요
- **목적**: 오늘 체크인 예정인 게스트 목록을 관리하고, 체크인 상태를 업데이트하며, 개인 SMS를 발송한다
- **진입 경로**: `(authenticated)/(tabs)/check-in.tsx`

---

## 기능 목록 & 테스트 케이스

### CHK-LIST-001: 게스트 목록 조회
> 오늘 날짜 기준 체크인 예정 게스트 리스트를 표시한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| CHK-LIST-001-T01 | 정상 조회 | 오늘 체크인 게스트 3명 등록됨 | 체크인 탭 진입 | 게스트 카드 3개 표시, 각 카드에 이름/예상시간/파티참가여부 표시 |
| CHK-LIST-001-T02 | 빈 목록 | 오늘 체크인 게스트 없음 | 체크인 탭 진입 | 빈 상태 안내 메시지 + 게스트 등록 화면 이동 버튼 |
| CHK-LIST-001-T03 | 네트워크 에러 | API 응답 실패 | 체크인 탭 진입 | 에러 메시지 + 재시도 버튼 |

---

### CHK-LIST-002: 체크인 상태 토글
> 게스트의 체크인/미체크인 상태를 토글한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| CHK-LIST-002-T01 | 체크인 처리 | 미체크인 상태의 게스트 | 토글 ON | 체크인으로 변경, 상단 현황 카운트 +1 |
| CHK-LIST-002-T02 | 체크인 취소 | 체크인 상태의 게스트 | 토글 OFF | 미체크인으로 변경, 상단 현황 카운트 -1 |
| CHK-LIST-002-T03 | API 실패 시 롤백 | 미체크인 상태의 게스트 | 토글 ON → API 실패 | 토글 OFF로 복귀, 에러 토스트 표시 |

---

### CHK-LIST-003: 게스트 메모 등록
> 특정 게스트에 대한 내부 메모를 작성한다

| 우선순위 | P1 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| CHK-LIST-003-T01 | 메모 저장 | 게스트 카드 선택됨 | 메모 입력 후 저장 | 메모가 카드에 표시됨 |
| CHK-LIST-003-T02 | 메모 수정 | 기존 메모가 있는 게스트 | 메모 수정 후 저장 | 수정된 내용으로 업데이트 |
| CHK-LIST-003-T03 | 메모 삭제 | 기존 메모가 있는 게스트 | 메모 내용 비우고 저장 | 메모 영역 비어있음 |

---

### CHK-LIST-004: 개인 SMS 발송
> 특정 게스트에게 개별 문자를 발송한다

| 우선순위 | P1 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| CHK-LIST-004-T01 | 정상 발송 | SMS 발송 모달 열림 | 메시지 입력 후 발송 | 성공 토스트, 발송 완료 표시 |
| CHK-LIST-004-T02 | 빈 메시지 | SMS 발송 모달 열림 | 메시지 미입력 후 발송 | 유효성 에러 "메시지를 입력하세요" |
| CHK-LIST-004-T03 | 발송 실패 | SMS 발송 모달 열림 | 메시지 입력 후 발송 → API 실패 | 에러 토스트 "발송에 실패했습니다" |

---

### CHK-LIST-005: 파티 참가 여부 표시
> 게스트의 당일 파티 참가 여부를 토글한다

| 우선순위 | P1 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| CHK-LIST-005-T01 | 파티 참가 설정 | 미참가 상태의 게스트 | 파티 참가 토글 ON | 참가로 변경 |
| CHK-LIST-005-T02 | 파티 미참가 설정 | 참가 상태의 게스트 | 파티 참가 토글 OFF | 미참가로 변경 |
| CHK-LIST-005-T03 | 파티 없는 게스트하우스 | 온보딩에서 파티 방식 미설정 | 체크인 탭 진입 | 파티 참가 토글 자체가 미표시 |
```

**Step 2: Commit**

```bash
git add "docs/admin/(authenticated)/(tabs)/check-in.md"
git commit -m "docs: 체크인 관리 명세서 작성 (CHK-LIST)"
```

---

## Task 11: 스케줄 관리 명세서 작성

**Files:**
- Create: `docs/admin/(authenticated)/(tabs)/schedule.md`

**Step 1: 파일 작성**

```markdown
# 스케줄 관리 (SCH-WEEK)

## 개요
- **목적**: 이번주 스탭 근무 스케줄을 관리하고 새로운 스탭을 초대한다
- **진입 경로**: `(authenticated)/(tabs)/schedule.tsx`

---

## 기능 목록 & 테스트 케이스

### SCH-WEEK-001: 이번주 스탭 근무 조회
> 이번주 요일별 스탭 근무 배정을 표시한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| SCH-WEEK-001-T01 | 근무표 조회 | 이번주 스탭 3명 근무 등록됨 | 스케줄 탭 진입 | 요일별 근무 스탭 표시 |
| SCH-WEEK-001-T02 | 근무 없음 | 이번주 등록된 근무 없음 | 스케줄 탭 진입 | 빈 상태 안내 + 근무 등록 유도 |
| SCH-WEEK-001-T03 | 네트워크 에러 | API 응답 실패 | 스케줄 탭 진입 | 에러 메시지 + 재시도 버튼 |

---

### SCH-WEEK-002: 스탭 근무 등록/수정
> 특정 요일에 스탭 근무를 등록하거나 수정한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| SCH-WEEK-002-T01 | 근무 등록 | 빈 요일 셀 표시됨 | 요일 선택 → 스탭 선택 → 저장 | 해당 요일에 스탭 이름 표시 |
| SCH-WEEK-002-T02 | 근무 삭제 | 스탭이 배정된 요일 | 해당 근무 삭제 | 요일 셀 비어있음 |
| SCH-WEEK-002-T03 | host가 근무 등록 | host로 로그인됨 | 근무 등록 | 등록 성공 |
| SCH-WEEK-002-T04 | staff가 근무 등록 | staff로 로그인됨 | 근무 등록 | 등록 성공 |

---

### SCH-WEEK-003: 스탭 초대 (딥링크)
> 새로운 스탭을 딥링크로 초대한다

| 우선순위 | P1 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| SCH-WEEK-003-T01 | 초대 링크 생성 | 스탭 추가 버튼 표시됨 | 스탭 추가 버튼 클릭 | 딥링크 URL 생성, 공유 시트 표시 |
| SCH-WEEK-003-T02 | 링크 공유 | 공유 시트 표시됨 | 카카오톡/문자 등으로 공유 | 공유 완료 |
| SCH-WEEK-003-T03 | host만 초대 가능 | staff로 로그인됨 | 스탭 추가 버튼 확인 | 스탭 추가 버튼 미표시 |
```

**Step 2: Commit**

```bash
git add "docs/admin/(authenticated)/(tabs)/schedule.md"
git commit -m "docs: 스케줄 관리 명세서 작성 (SCH-WEEK)"
```

---

## Task 12: 채팅 명세서 작성

**Files:**
- Create: `docs/admin/(authenticated)/(tabs)/chat.md`

**Step 1: 파일 작성**

```markdown
# 채팅 (CHAT-CONV)

## 개요
- **목적**: 게스트하우스와 게스트 간 1:1 채팅을 관리한다. host와 staff 모두 응대할 수 있다.
- **진입 경로**: `(authenticated)/(tabs)/chat.tsx`

---

## 기능 목록 & 테스트 케이스

### CHAT-CONV-001: 채팅 목록 조회
> 게스트별 1:1 채팅방 목록을 표시한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| CHAT-CONV-001-T01 | 채팅방 있음 | 게스트 3명과 채팅방 존재 | 채팅 탭 진입 | 채팅방 3개 표시 (게스트명, 마지막 메시지, 시간) |
| CHAT-CONV-001-T02 | 채팅방 없음 | 채팅방 없음 | 채팅 탭 진입 | 빈 상태 안내 메시지 |
| CHAT-CONV-001-T03 | 읽지 않은 메시지 | 특정 채팅방에 안읽은 메시지 2개 | 채팅 탭 진입 | 해당 채팅방에 뱃지 "2" 표시 |

---

### CHAT-CONV-002: 메시지 전송
> 게스트에게 채팅 메시지를 전송한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| CHAT-CONV-002-T01 | 메시지 전송 | 채팅방 내부 진입됨 | 메시지 입력 후 전송 | 메시지가 채팅 화면에 표시, 목록의 마지막 메시지 갱신 |
| CHAT-CONV-002-T02 | 빈 메시지 전송 불가 | 채팅방 내부 진입됨 | 빈 입력 상태에서 전송 | 전송 버튼 비활성화 |
| CHAT-CONV-002-T03 | host가 전송 | host로 로그인, 채팅방 진입 | 메시지 전송 | 전송 성공, 발신자 host로 표시 |
| CHAT-CONV-002-T04 | staff가 전송 | staff로 로그인, 채팅방 진입 | 메시지 전송 | 전송 성공, 발신자 staff로 표시 |

---

### CHAT-CONV-003: 메시지 실시간 수신
> 게스트가 보낸 메시지를 실시간으로 수신한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| CHAT-CONV-003-T01 | 실시간 수신 (채팅방 내) | 채팅방 내부 진입됨 | 게스트가 메시지 전송 | 채팅 화면에 즉시 표시 |
| CHAT-CONV-003-T02 | 실시간 수신 (목록) | 채팅 목록 화면 | 게스트가 메시지 전송 | 해당 채팅방의 마지막 메시지 갱신 + 뱃지 표시 |
| CHAT-CONV-003-T03 | 오프라인 후 복귀 | 앱 백그라운드 후 복귀 | 채팅 탭 진입 | 누락된 메시지 모두 동기화 |
```

**Step 2: Commit**

```bash
git add "docs/admin/(authenticated)/(tabs)/chat.md"
git commit -m "docs: 채팅 명세서 작성 (CHAT-CONV)"
```

---

## Task 13: 게스트 등록 명세서 작성

**Files:**
- Create: `docs/admin/register-guests.md`

**Step 1: 파일 작성**

```markdown
# 게스트 등록 (GRST-REG)

## 개요
- **목적**: 오늘 체크인할 게스트를 수동으로 등록하고, 등록과 동시에 안내 SMS를 일괄 발송한다
- **진입 경로**: `register-guests.tsx`

---

## 기능 목록 & 테스트 케이스

### GRST-REG-001: 게스트 수동 등록
> 게스트의 이름, 전화번호, 도착 예상 시간, 배정 방을 입력하여 등록한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| GRST-REG-001-T01 | 게스트 1명 등록 | 등록 화면 진입 | 이름, 전화번호, 예상 도착시간, 방 선택 후 등록 | 게스트 등록 성공 |
| GRST-REG-001-T02 | 필수 항목 누락 | 등록 화면 진입 | 이름만 입력 후 등록 | 에러 표시 (전화번호, 도착시간, 방 필수) |
| GRST-REG-001-T03 | 여러 명 등록 | 등록 화면 진입 | 게스트 추가 버튼으로 3명 정보 입력 후 일괄 등록 | 3명 모두 등록 성공 |
| GRST-REG-001-T04 | 전화번호 형식 검증 | 등록 화면 진입 | 잘못된 전화번호 형식 입력 | 에러 "올바른 전화번호 형식을 입력해주세요" |
| GRST-REG-001-T05 | 방 목록 표시 | 등록 화면 진입 | 방 선택 드롭다운 클릭 | 온보딩에서 등록한 방 목록 표시 |

---

### GRST-REG-002: 안내 SMS 일괄 발송
> 게스트 등록과 동시에 안내 문자를 일괄 발송한다

| 우선순위 | P0 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| GRST-REG-002-T01 | 일괄 발송 성공 | 게스트 3명 등록 완료 | 안내 SMS 발송 버튼 클릭 | 3명 모두에게 SMS 발송 성공 토스트 |
| GRST-REG-002-T02 | 부분 발송 실패 | 게스트 3명 등록, 1명 번호 오류 | 안내 SMS 발송 | 2명 성공, 1명 실패 결과 표시 |
| GRST-REG-002-T03 | 안내 메시지 미리보기 | 등록 화면 표시됨 | SMS 미리보기 버튼 클릭 | 게스트하우스 이름, 주소, 체크인 안내가 포함된 메시지 미리보기 |
```

**Step 2: Commit**

```bash
git add docs/admin/register-guests.md
git commit -m "docs: 게스트 등록 명세서 작성 (GRST-REG)"
```

---

## Task 14: 프로필 수정 명세서 작성

**Files:**
- Create: `docs/admin/edit-profile.md`

**Step 1: 파일 작성**

```markdown
# 프로필 수정 (PROF-EDIT)

## 개요
- **목적**: host는 게스트하우스 정보를 수정하고, staff는 개인 프로필을 수정한다
- **진입 경로**: `edit-profile.tsx`

---

## 기능 목록 & 테스트 케이스

### PROF-EDIT-001: host 프로필 수정
> host가 온보딩에서 입력한 게스트하우스 정보를 수정한다

| 우선순위 | P1 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| PROF-EDIT-001-T01 | 기존값 표시 | host로 로그인, 프로필 수정 진입 | 화면 로드 | 온보딩에서 입력한 값들이 각 필드에 표시 |
| PROF-EDIT-001-T02 | 이름 수정 | 기존값 표시됨 | 게스트하우스 이름 수정 후 저장 | 수정된 이름으로 업데이트 |
| PROF-EDIT-001-T03 | 파티 방식 변경 | 기존 POT_LUCK 설정 | HOST_SERVED로 변경 후 저장 | 파티 방식 업데이트 |
| PROF-EDIT-001-T04 | 방 정보 수정 | 기존 방 2개 | 방 추가/삭제 후 저장 | 방 목록 업데이트 |
| PROF-EDIT-001-T05 | 유효성 검증 | 프로필 수정 화면 | 이름 비우고 저장 | 에러 "게스트하우스 이름을 입력해주세요" |
| PROF-EDIT-001-T06 | staff가 접근 | staff로 로그인 | 프로필 수정 진입 | 게스트하우스 정보 수정 영역 미표시 |

---

### PROF-EDIT-002: staff 프로필 수정
> staff가 자신의 프로필 정보를 수정한다

| 우선순위 | P1 |
|---------|-----|

| 테스트 코드 | 시나리오 | Given | When | Then |
|------------|----------|-------|------|------|
| PROF-EDIT-002-T01 | 기존값 표시 | staff로 로그인, 프로필 수정 진입 | 화면 로드 | 이름, 전화번호 등 기존값 표시 |
| PROF-EDIT-002-T02 | 이름 수정 | 기존값 표시됨 | 이름 수정 후 저장 | 수정된 이름으로 업데이트 |
| PROF-EDIT-002-T03 | host가 접근 | host로 로그인 | 프로필 수정 진입 | staff 프로필 수정 영역 미표시, 게스트하우스 정보 수정 영역 표시 |
```

**Step 2: Commit**

```bash
git add docs/admin/edit-profile.md
git commit -m "docs: 프로필 수정 명세서 작성 (PROF-EDIT)"
```

---

## 완료 확인

모든 Task 완료 후 최종 확인:

```bash
# 전체 구조 확인
find docs -type f | sort

# 기대 결과:
# docs/_shared/data-models.md
# docs/_shared/feature-codes.md
# docs/admin/(authenticated)/(tabs)/chat.md
# docs/admin/(authenticated)/(tabs)/check-in.md
# docs/admin/(authenticated)/(tabs)/index.md
# docs/admin/(authenticated)/(tabs)/schedule.md
# docs/admin/edit-profile.md
# docs/admin/onboarding/description.md
# docs/admin/onboarding/dinner-party.md
# docs/admin/onboarding/information.md
# docs/admin/onboarding/rooms.md
# docs/admin/register-guests.md
# docs/admin/signin.md
# docs/package.json
# docs/plans/2026-03-04-planning-method-design.md
# docs/plans/2026-03-04-specs-implementation.md
```
