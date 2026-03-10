---
name: specification-workshop
description: 기능 PRD 생성 + Three Amigos 명세 워크숍. 기능을 구현하기 전에 페이지 구조, API 스키마, 디자인 가이드, Given/When/Then 시나리오를 포함한 PRD를 작성합니다. 사용 시기: (1) 새 기능의 요구사항과 PRD를 정의할 때, (2) Given/When/Then 시나리오가 필요할 때, (3) frontend/backend/publisher가 공유할 명세가 필요할 때, (4) 기존 PRD를 수정하거나 확장할 때. 트리거: spec, specification, workshop, 명세, 스펙, 시나리오, given when then, three amigos, prd, 기획, 기능 정의, feature spec.
---

# 기능 PRD + 명세 워크숍

Janet Gregory의 "Three Amigos" 방법론에 기반한 기능 PRD 생성 프로세스입니다.
기획 → 디자인 → 개발 전체 플로우에서 frontend, backend, publisher가 공유하는 단일 문서를 만듭니다.

## Three Amigos 관점

| 역할 | 관점 | 핵심 질문 |
|------|------|----------|
| **Product Owner** | 무엇을, 왜 | 이 기능의 가치는? 완료 기준은? |
| **Developer** | 어떻게 | 기술적으로 어떻게 구현? 제약사항은? |
| **Tester** | 만약에 | 엣지 케이스는? 어떻게 검증? |

## 실행 모드

### 신규 기능
전체 절차를 순서대로 진행합니다.

### 기존 기능 수정
1. `docs/prd/` 에서 기존 PRD를 찾아 읽습니다
2. 변경사항을 사용자와 확인합니다
3. 해당 섹션만 업데이트합니다
4. 네이밍 매핑 테이블도 함께 업데이트합니다

---

## 실행 절차

### Phase 1: 기획 (Product Owner)

#### 1-1. 사용자 스토리 정의

```markdown
**As a** [역할]
**I want** [기능]
**So that** [이점]
```

사용자에게 AskUserQuestion으로 역할, 기능, 이점을 확인합니다.

#### 1-2. 인수 조건

사용자와 협의하여 측정 가능한 완료 조건을 정의합니다:

```markdown
## 인수 조건
- [ ] [측정 가능한 조건 1]
- [ ] [측정 가능한 조건 2]
- [ ] [측정 가능한 조건 3]
```

#### 1-3. 네이밍 컨벤션 매핑

**모든 기능에 대해 통일된 이름을 부여합니다.**
이 테이블은 frontend, backend, publisher, tester가 동일한 용어를 사용하도록 보장합니다.

```markdown
## 네이밍 매핑

| 기능명 | 페이지 경로 | GraphQL Operation | Organism | 테스트 시나리오 |
|--------|-------------|-------------------|----------|---------------|
| 객실 추가 | /onboarding/rooms | createRoom | RoomFormOrganism | 객실_추가_시나리오 |
| 객실 수정 | /rooms/[id]/edit | updateRoom | RoomFormOrganism | 객실_수정_시나리오 |
| 객실 삭제 | /rooms/[id] | deleteRoom | - | 객실_삭제_시나리오 |
```

**네이밍 규칙**:
- 기능명: 한글 동사 + 명사 (예: 객실 추가)
- 페이지 경로: expo-router 파일 기반 (예: /onboarding/rooms)
- GraphQL: camelCase 동사 + 명사 (예: createRoom)
- Organism: PascalCase + Organism 접미사 (예: RoomFormOrganism)
- 테스트: 기능명_한글_시나리오 (예: 객실_추가_시나리오)

---

### Phase 2: 설계 (Developer)

#### 2-1. 페이지 구조 & 라우팅

코드베이스의 기존 라우팅 구조를 분석한 후 새 페이지를 정의합니다.

```markdown
## 페이지 구조

### 라우팅 트리
app/
├── (authenticated)/
│   └── (tabs)/
│       └── rooms/
│           ├── index.tsx          # 객실 목록
│           └── [id]/
│               └── edit.tsx       # 객실 수정

### 화면별 구성

#### 객실 목록 (/rooms)
- **레이아웃**: YStack + FlashList
- **Organism**: RoomCardOrganism (목록 아이템)
- **데이터**: useRoomsQuery()
- **액션**: 객실 추가 FAB → /rooms/new

#### 객실 수정 (/rooms/[id]/edit)
- **레이아웃**: YStack + ScrollView
- **Organism**: RoomFormOrganism (폼)
- **데이터**: useRoomByIdQuery(id)
- **액션**: 저장 → updateRoom mutation
```

**네비게이션 플로우**:
```
[객실 목록] → [객실 상세] → [객실 수정]
     ↓
[객실 추가] (모달 또는 새 화면)
```

#### 2-2. API 스키마 & DB 모델

```markdown
## API 스키마

### DB 모델 (Prisma)
model Room {
  id          String   @id @default(cuid())
  name        String
  capacity    Int
  gender      Gender
  hasBathroom Boolean  @default(false)
  guesthouseId String
  guesthouse  Guesthouse @relation(fields: [guesthouseId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

### GraphQL 타입
type Room {
  id: ID!
  name: String!
  capacity: Int!
  gender: Gender!
  hasBathroom: Boolean!
}

### Mutations
- createRoom(input: CreateRoomInput!): Room!
- updateRoom(id: ID!, input: UpdateRoomInput!): Room!
- deleteRoom(id: ID!): Room!

### Queries
- room(id: ID!): Room!
- rooms(guesthouseId: ID!): [Room!]!

### Input 타입
input CreateRoomInput {
  name: String!       # @IsString @MinLength(1) @MaxLength(50)
  capacity: Int!      # @IsInt @Min(1) @Max(20)
  gender: Gender!     # @IsEnum(Gender)
  hasBathroom: Boolean
}
```

**참고**: Prisma Schema가 단일 진실의 소스입니다. `@hosspie/database`에서 Enum/Model import.

#### 2-3. 구현 접근법

```markdown
## 구현 접근법

**전략**: [구현 전략 요약]

**수정 대상**:
- [수정할 파일/모듈 1]
- [수정할 파일/모듈 2]

**제약사항**:
- [기술적 제약 1]
- [기술적 제약 2]

**의존성**:
- [필요한 사전 작업]
```

---

### Phase 3: 디자인 가이드 (Publisher)

#### 3-1. 컴포넌트 & Storybook 참조

디자인은 Storybook Story로 관리합니다. PRD에는 사용할 컴포넌트 목록과 해당 Story 태그를 기록합니다.

```markdown
## 디자인 가이드

### 사용할 컴포넌트

| 컴포넌트 | 소스 | 용도 | Storybook Story |
|----------|------|------|-----------------|
| YStack | tamagui | 수직 레이아웃 | - |
| Button | tamagui | 액션 버튼 | Components/Button |
| Input | tamagui | 텍스트 입력 | Components/Input |
| RoomFormOrganism | @hosspie/design-system | 객실 폼 | Organisms/RoomForm |
| RoomCardOrganism | @hosspie/design-system | 객실 카드 | Organisms/RoomCard |

### Storybook 참조

화면 디자인은 Storybook에서 확인합니다:
- **Organism Story**: `Organisms/RoomForm` - 폼 컴포넌트 단독 확인
- **Screen Story**: `Screens/Onboarding/Rooms` - 전체 화면 확인 (추후 추가)

> Story가 아직 없으면 publisher가 Organism/Screen Story를 먼저 생성합니다.

### 디자인 토큰 사용

- 배경: $background (테마 자동 전환)
- 텍스트: $color12 (높은 대비), $color11 (보조)
- 간격: $4 (기본), $6 (섹션 간)
- 테두리: $borderColor
- 버튼: theme="blue" 또는 brand 테마
```

---

### Phase 4: 검증 (Tester)

#### 4-1. 시나리오 명세 (Given/When/Then)

핵심 시나리오 3~5개를 구체적으로 작성합니다:

```markdown
## 시나리오 명세

### 시나리오 1: [네이밍 매핑의 테스트 시나리오명]

**Given**:
- [초기 조건 1]
- [초기 조건 2]

**When**: [사용자 액션 또는 트리거]

**Then**:
- [기대 결과 1]
- [기대 결과 2]

**And**:
- [추가 검증]
```

#### 4-2. 테스터 질문

```markdown
## 테스터 질문

1. [엣지 케이스]는 어떻게 처리하나요?
   → [답변]
2. [비정상 입력] 시 어떤 동작이 예상되나요?
   → [답변]
3. [동시성 문제]가 발생할 수 있나요?
   → [답변]
```

#### 4-3. 엣지 케이스와 에러 조건

```markdown
## 엣지 케이스
1. [엣지 케이스] → [예상 동작]
2. [엣지 케이스] → [예상 동작]

## 에러 조건
1. [에러 상황] → [에러 처리 방법] → [에러 메시지 (한글)]
2. [에러 상황] → [에러 처리 방법] → [에러 메시지 (한글)]
```

#### 4-4. 테스트 전략

```markdown
## 테스트 전략

### 단위 테스트
- [ ] [테스트 항목] → [테스트 파일 경로]

### 통합 테스트
- [ ] [테스트 항목]

### Storybook 검증
- [ ] [Organism Story] 기본 렌더링 확인
- [ ] [Organism Story] 에러 상태 확인
- [ ] [Screen Story] 전체 화면 확인 (해당 시)
```

---

## 출력 형식

완성된 PRD는 `docs/prd/{feature-name}.md`에 저장합니다.

**파일명 규칙**: 기능의 영문 kebab-case (예: `room-management.md`, `reservation-system.md`)

```markdown
# PRD: [기능명 (한글)]

**작성일**: YYYY-MM-DD
**상태**: draft | review | approved | implemented
**관련 이슈**: #[이슈번호] (있을 경우)

---

## 1. 사용자 스토리

As a [역할]
I want [기능]
So that [이점]

## 2. 인수 조건

- [ ] ...

## 3. 네이밍 매핑

| 기능명 | 페이지 경로 | GraphQL Operation | Organism | 테스트 시나리오 |
|--------|-------------|-------------------|----------|---------------|
| ... | ... | ... | ... | ... |

## 4. 페이지 구조

### 라우팅 트리
...

### 화면별 구성
...

### 네비게이션 플로우
...

## 5. API 스키마 & DB 모델

### DB 모델 (Prisma)
...

### GraphQL 타입
...

### Mutations / Queries
...

### Input 타입
...

## 6. 디자인 가이드

### 사용할 컴포넌트
| 컴포넌트 | 소스 | 용도 | Storybook Story |
|----------|------|------|-----------------|
| ... | ... | ... | ... |

### Storybook 참조
...

### 디자인 토큰 사용
...

## 7. 구현 접근법
...

## 8. 시나리오 명세

### 시나리오 1: ...
...

## 9. 엣지 케이스와 에러 조건
...

## 10. 테스트 전략
...
```

---

## 워크숍 진행 방식

### 하이브리드 방식

1. **코드베이스 분석**: 기존 구조, 라우팅, API 패턴을 먼저 파악
2. **초안 자동 생성**: 분석 결과를 바탕으로 PRD 초안 작성
3. **핵심 결정사항 질문**: AskUserQuestion으로 확인이 필요한 부분만 질문
4. **사용자 리뷰**: 전체 PRD를 보여주고 승인/수정
5. **파일 저장**: 승인 후 `docs/prd/`에 저장

### 진행 팁

- 사용자가 Product Owner 역할, Claude가 Developer+Tester 역할을 대행
- 시나리오는 **구체적인 데이터**로 작성 (추상적 설명 지양)
- 엣지 케이스는 최소 3개 이상 식별
- 인수 조건은 자동화 테스트로 변환 가능한 수준으로 작성
- 네이밍 매핑 테이블은 반드시 작성 (팀 간 소통의 기반)
- API 스키마는 Prisma 모델 형태로 (타입 시스템 가이드 준수)
- 디자인은 Storybook Story 참조로 관리 (ASCII 스케치 대신)
- 구현 시작 전에 사용자 승인을 받은 후 진행

---

## 다음 단계 연결

PRD 완성 후 사용 가능한 스킬:

| 다음 스킬 | 용도 |
|-----------|------|
| `prd-to-tasks` | PRD를 우선순위별 태스크 체크리스트로 변환 |
| `workflow-guide` | 전체 개발 플로우에서 다음 단계 안내 |
| `ralph-loop` | 태스크 자율 실행 |

---

## Hosspie 프로젝트 예시

```markdown
# PRD: 게스트하우스 객실 관리

**작성일**: 2026-02-21
**상태**: approved
**관련 이슈**: #28

---

## 1. 사용자 스토리

As a 게스트하우스 관리자
I want 객실 정보를 추가/수정/삭제
So that 투숙객에게 정확한 객실 정보를 제공할 수 있다

## 2. 인수 조건

- [ ] 객실명, 수용 인원, 성별 제한을 설정할 수 있다
- [ ] 객실 목록에서 기존 객실을 수정할 수 있다
- [ ] 객실을 삭제하면 확인 다이얼로그가 표시된다

## 3. 네이밍 매핑

| 기능명 | 페이지 경로 | GraphQL Operation | Organism | 테스트 시나리오 |
|--------|-------------|-------------------|----------|---------------|
| 객실 추가 | /onboarding/rooms | createRoom | RoomFormOrganism | 객실_추가_시나리오 |
| 객실 수정 | /rooms/[id]/edit | updateRoom | RoomFormOrganism | 객실_수정_시나리오 |
| 객실 삭제 | /rooms/[id] | deleteRoom | - | 객실_삭제_시나리오 |
| 객실 목록 | /rooms | myRooms | RoomCardOrganism | 객실_목록_시나리오 |

## 4. 페이지 구조

### 라우팅 트리
app/
├── onboarding/
│   └── rooms/
│       └── index.tsx          # 온보딩 객실 입력
└── (authenticated)/
    └── (tabs)/
        └── rooms/
            ├── index.tsx      # 객실 목록
            └── [id]/
                └── edit.tsx   # 객실 수정

### 네비게이션 플로우
[온보딩] → [객실 입력] → [완료]
[객실 목록] → [객실 수정] → [저장] → [목록으로]

## 5. API 스키마 & DB 모델

### DB 모델
model Room {
  id          String   @id @default(cuid())
  name        String
  capacity    Int
  gender      Gender
  hasBathroom Boolean  @default(false)
  guesthouseId String
  guesthouse  Guesthouse @relation(...)
}

### Mutations
- createRoom(input: CreateRoomInput!): Room!
- updateRoom(id: ID!, input: UpdateRoomInput!): Room!
- deleteRoom(id: ID!): Room!

## 6. 디자인 가이드

### 사용할 컴포넌트
| 컴포넌트 | 소스 | 용도 | Storybook Story |
|----------|------|------|-----------------|
| YStack | tamagui | 수직 레이아웃 | - |
| Input | tamagui | 텍스트 입력 | Components/Input |
| RadioGroup | tamagui | 성별 선택 | Components/RadioGroup |
| Button | tamagui | 액션 버튼 | Components/Button |
| RoomFormOrganism | design-system | 객실 폼 | Organisms/RoomForm |
| RoomCardOrganism | design-system | 객실 카드 | Organisms/RoomCard |

### Storybook 참조
- Organisms/RoomForm - 폼 입력/유효성 검사 확인
- Organisms/RoomCard - 카드 표시 확인
- Screens/Onboarding/Rooms - 전체 화면 (추후)

### 디자인 토큰
- 배경: $background
- 카드: $backgroundHover, 패딩 $4, 라운드 $4
- 간격: 섹션 간 $6, 필드 간 $4

## 7. 구현 접근법

**전략**: Prisma 모델 → NestJS CRUD → Admin 화면 순차 구현

**수정 대상**:
- packages/database/prisma/schema.prisma
- apps/api/src/modules/guesthouse/
- apps/admin/app/onboarding/rooms/

## 8. 시나리오 명세

### 시나리오 1: 객실_추가_시나리오

**Given**:
- 관리자가 온보딩 객실 입력 화면에 있다
- 현재 객실이 0개 등록되어 있다

**When**: 객실 정보를 입력하고 "추가" 버튼을 누른다
- 객실명: "201호", 수용 인원: 4, 성별 제한: MIXED

**Then**:
- 객실 목록에 "201호"가 추가된다
- 총 객실 수가 1개로 표시된다

## 9. 엣지 케이스와 에러 조건

### 엣지 케이스
1. 같은 이름의 객실 추가 → "이미 존재하는 객실명입니다"
2. 수용 인원 0 입력 → "최소 1명 이상 입력하세요"

### 에러 조건
1. 네트워크 오류 → 토스트 "객실 추가에 실패했습니다."
2. 서버 에러 → 토스트 "일시적인 오류가 발생했습니다."

## 10. 테스트 전략

### 단위 테스트
- [ ] RoomService.create() 정상 생성
- [ ] RoomService.create() 중복 이름 에러

### Storybook 검증
- [ ] Organisms/RoomForm 기본 렌더링
- [ ] Organisms/RoomForm 에러 상태
- [ ] Organisms/RoomCard 정보 표시
```
