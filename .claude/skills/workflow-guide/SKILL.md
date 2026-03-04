---
name: workflow-guide
description: Superpowers + Ralph + Agent Teams 통합 워크플로우 가이드. 기획부터 실행, 품질 확인까지 전체 개발 플로우에서 어떤 스킬을 어떤 순서로 사용할지 안내합니다. 사용 시기: (1) 새 기능 개발을 시작할 때 어떤 스킬부터 쓸지 모를 때, (2) "워크플로우", "개발 프로세스", "어떤 순서로" 등 개발 흐름을 묻는 질문, (3) 프로젝트에 처음 합류하여 개발 프로세스를 파악할 때, (4) ralph과 superpowers를 함께 사용하는 방법이 필요할 때, (5) Agent Teams으로 병렬 작업을 구성할 때. 트리거: 워크플로우, 개발 프로세스, 개발 순서, 어디서부터, how to start, workflow, process, ralph superpowers, agent teams, 팀, 병렬.
---

# Superpowers + Ralph + Agent Teams 통합 워크플로우

기획 → 명세 → 태스크 분해 → 실행 → 품질 확인까지, 상황에 맞는 스킬 조합을 안내합니다.

## 전체 흐름

```
기획 ─→ 태스크 분해 ─→ 실행 ─→ 품질 확인
```

| 단계 | 스킬 | 역할 |
|------|------|------|
| 기획 | brainstorming | 아이디어 탐색, 접근법 제안 |
| 기획 | specification-workshop | 구조화된 명세 (Given/When/Then) |
| 분해 | prd-to-tasks | 명세 → 우선순위별 체크리스트 |
| 분해 | writing-plans | 상세 구현 계획 (TDD, 바이트 사이즈) |
| 실행 | executing-plans | 3개씩 배치 실행 + 사람 리뷰 |
| 실행 | ralph-loop | 자율 루프 (EXIT_SIGNAL까지) |
| 실행 | subagent-driven-development | 독립 태스크 병렬 실행 (단일 세션) |
| 실행 | **Agent Teams** | 독립 Teammate가 협의하며 병렬 실행 |
| 품질 | verification-before-completion | 테스트/빌드 검증 |
| 품질 | requesting-code-review | 코드 리뷰 |
| 품질 | finishing-a-development-branch | PR 생성 또는 머지 |

## 상황별 추천 조합

### 간단한 기능 (CRUD, 화면 추가)

태스크가 명확하고 판단이 적게 필요한 작업.

```
prd-to-tasks → ralph-loop → verification-before-completion
```

1. 요구사항을 fix_plan.md로 변환
2. ralph이 자율적으로 하나씩 구현
3. 완료 후 검증

### 중요한 기능 (인증, 결제, 핵심 비즈니스)

설계 판단이 필요하고 실수하면 안 되는 작업.

```
brainstorming → specification-workshop → prd-to-tasks
→ writing-plans → executing-plans
→ verification-before-completion → requesting-code-review
```

1. 아이디어 탐색 및 접근법 결정
2. Three Amigos 명세로 엣지케이스 정리
3. 태스크 분해
4. TDD 기반 상세 계획 작성
5. 3개씩 배치 실행, 매번 사람 리뷰
6. 검증 + 코드 리뷰

### 대규모 기능 - 단일 세션 (전체 모듈, 여러 파일)

독립적인 태스크가 많아 병렬 처리가 유리한 작업. 단일 세션에서 서브에이전트로 실행.

```
brainstorming → specification-workshop → prd-to-tasks
→ writing-plans → subagent-driven-development
→ verification-before-completion → finishing-a-development-branch
```

1. 기획 + 명세
2. 태스크를 독립 단위로 분해
3. 서브에이전트로 병렬 실행
4. 검증 후 브랜치 마무리

### 대규모 기능 - Agent Teams (독립 에이전트 병렬)

독립적인 태스크를 별도의 Teammate 에이전트가 각각 맡아 병렬로 실행.
서브에이전트보다 더 독립적이고, 각 Teammate가 자체 컨텍스트를 가짐.

```
brainstorming → specification-workshop → prd-to-tasks
→ Team Lead가 TaskCreate로 태스크 분배
→ Teammate들이 병렬 실행 (tmux 분할 창)
→ verification-before-completion → finishing-a-development-branch
```

1. 기획 + 명세
2. prd-to-tasks로 독립 단위 분해 (카테고리별: [DB], [API], [FE])
3. Team Lead가 TaskCreate로 태스크 생성 + 의존성 설정
4. 독립 태스크를 Teammate에 할당 → 병렬 실행
5. 의존성 있는 태스크는 선행 완료 후 순차 실행
6. 전체 완료 후 검증 + 브랜치 마무리

**prd-to-tasks → Agent Teams 연동 예시**:

```
fix_plan.md 결과:
  [DB] Reservation 모델 정의        ← 의존성 없음
  [DB] Payment 모델 정의            ← 의존성 없음
  [API] Reservation 리졸버 구현     ← [DB] Reservation에 의존
  [API] Payment 리졸버 구현         ← [DB] Payment에 의존
  [FE] 예약 화면 구현               ← [API] Reservation에 의존
  [FE] 결제 화면 구현               ← [API] Payment에 의존

→ 병렬 그룹 1: [DB] Reservation + [DB] Payment (Teammate A, B)
→ 병렬 그룹 2: [API] Reservation + [API] Payment (Teammate A, B)
→ 병렬 그룹 3: [FE] 예약 + [FE] 결제 (Teammate A, B)
```

**적합한 경우**:
- 독립적인 태스크가 3개 이상
- 각 태스크가 서로 다른 파일/모듈을 수정
- 충돌 가능성이 낮은 작업

### 버그 수정

```
systematic-debugging → test-driven-development
→ verification-before-completion
```

### 반복 작업 (마이그레이션, 리팩토링)

패턴이 동일한 반복 작업.

```
prd-to-tasks → ralph-loop
```

## 실행 모드 비교

| | 사람 감독 (executing-plans) | 자율 (ralph-loop) | 병렬 (subagent) | 팀 병렬 (Agent Teams) |
|---|---|---|---|---|
| 실행 단위 | 3개 배치 | 1개/루프 | 태스크별 에이전트 | 태스크별 Teammate |
| 사람 개입 | 매 배치 리뷰 | EXIT_SIGNAL까지 없음 | 태스크 간 리뷰 | Team Lead가 조율 |
| 안전장치 | 사람 판단 | 서킷 브레이커 | 에이전트 격리 | 태스크 의존성 + mailbox |
| 적합 상황 | 설계 판단 필요 | 명확한 반복 구현 | 독립적 태스크 다수 | 독립 모듈 병렬 개발 |
| 속도 | 느림 (리뷰 대기) | 중간 (순차) | 빠름 (병렬) | 가장 빠름 (완전 병렬) |
| 컨텍스트 | 단일 세션 공유 | 단일 세션 | 메인 세션 내 격리 | 완전 독립 세션 |

## 스킬 연결 규칙

```
brainstorming ──→ writing-plans (필수 후속)
writing-plans ──→ executing-plans 또는 subagent-driven-development
executing-plans ──→ finishing-a-development-branch (필수 후속)
```

Ralph 스킬은 이 체인과 독립적으로 사용 가능:

```
specification-workshop ──→ prd-to-tasks ──→ ralph-loop
```

Agent Teams는 prd-to-tasks와 연동:

```
prd-to-tasks ──→ TaskCreate (의존성 설정) ──→ Agent Teams 병렬 실행
```

## 판단 기준: 어떤 조합을 쓸까?

```
태스크가 명확한가?
├─ Yes → 설계 판단이 필요한가?
│        ├─ Yes → writing-plans → executing-plans
│        └─ No  → prd-to-tasks → ralph-loop
└─ No  → brainstorming → specification-workshop부터
```

```
태스크가 독립적인가?
├─ Yes (3개 이상) → 각 태스크가 별도 모듈/파일인가?
│                    ├─ Yes → Agent Teams (완전 독립 병렬)
│                    └─ No  → subagent-driven-development (단일 세션 병렬)
└─ No (순차 의존) → executing-plans 또는 ralph-loop
```

## Hosspie 프로젝트 실전 예시

### 예시 1: 객실 예약 기능 (순차 실행)

```
1. brainstorming
   → "객실 예약 기능을 만들고 싶어"
   → 접근법 3개 제안, 사용자 승인

2. specification-workshop
   → Given/When/Then 시나리오 5개 작성
   → .ralph/specs/room-reservation.md 저장

3. prd-to-tasks
   → fix_plan.md 생성:
     [DB] Reservation 모델 → [API] 리졸버 → [FE] 화면

4. writing-plans
   → TDD 기반 상세 구현 계획
   → docs/plans/2026-02-21-room-reservation.md

5. executing-plans
   → 3개씩 배치 실행, 리뷰

6. verification-before-completion
   → pnpm test, pnpm lint 확인

7. finishing-a-development-branch
   → PR 생성 (git-pull-request 스킬 활용)
```

### 예시 2: 예약 + 결제 + 알림 (Agent Teams 병렬)

독립 모듈이 여러 개일 때 Agent Teams로 병렬 처리하는 예시.

```
1. brainstorming → specification-workshop
   → 예약, 결제, 알림 각각 명세 작성

2. prd-to-tasks → fix_plan.md:
   [DB] Reservation 모델      ← 독립
   [DB] Payment 모델           ← 독립
   [DB] Notification 모델      ← 독립
   [API] Reservation 리졸버    ← [DB] Reservation 의존
   [API] Payment 리졸버        ← [DB] Payment 의존
   [API] Notification 리졸버   ← [DB] Notification 의존
   [FE] 예약 화면              ← [API] Reservation 의존
   [FE] 결제 화면              ← [API] Payment 의존

3. Team Lead가 TaskCreate로 태스크 생성:
   - 의존성 없는 [DB] 태스크 3개 → Teammate A, B, C에 할당
   - blockedBy 설정으로 [API] 태스크 대기
   - [API] 완료 후 [FE] 태스크 할당

4. 병렬 실행 (tmux 분할 창):
   ┌──────────────┬──────────────┬──────────────┐
   │ Teammate A   │ Teammate B   │ Teammate C   │
   │ Reservation  │ Payment      │ Notification │
   │ DB → API → FE│ DB → API → FE│ DB → API     │
   └──────────────┴──────────────┴──────────────┘

5. verification-before-completion
   → 전체 빌드/테스트 확인

6. finishing-a-development-branch → PR 생성
```

## Agent Teams 사전 설정

Agent Teams를 사용하려면 `.claude/settings.local.json`에 다음이 필요:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

**핵심 개념**:
- **Team Lead**: 태스크 분배 및 조율 (TaskCreate, TaskUpdate)
- **Teammate**: 할당된 태스크를 독립적으로 실행
- **공유 태스크 목록**: TaskList로 진행 상황 추적
- **Mailbox**: Teammate 간 메시지 전달 (의존성 알림 등)
