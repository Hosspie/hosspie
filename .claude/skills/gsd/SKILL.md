---
name: gsd
description: GET SHIT DONE - 스펙 기반 개발 시스템. 프로젝트 초기화부터 마일스톤 완료까지 구조화된 워크플로우. 사용 시기: (1) 새 프로젝트/마일스톤을 시작할 때, (2) 피쳐를 페이즈 단위로 계획하고 실행할 때, (3) 컨텍스트 로트 없이 대규모 작업을 진행할 때, (4) "gsd", "get shit done", "마일스톤", "로드맵", "페이즈" 등 키워드. 트리거: gsd, get shit done, 마일스톤, milestone, roadmap, 로드맵, phase, 페이즈, ship, 출시.
---

# GET SHIT DONE (GSD)

경량 스펙 기반 개발 시스템. 컨텍스트 로트(context rot) 없이 아이디어→출시까지.

> 참고: https://github.com/gsd-build/get-shit-done

## 핵심 원리

1. **컨텍스트 엔지니어링**: 버전 관리되는 파일로 상태 추적 (세션 간 유실 방지)
2. **원자적 태스크**: 각 태스크는 독립적으로 실행/커밋/되돌리기 가능
3. **멀티 에이전트 오케스트레이션**: 리서치/계획/실행/검증을 전문 에이전트가 분담
4. **페이즈 단위 진행**: 큰 작업을 소화 가능한 페이즈로 분해

## 파일 구조

```
.planning/
├── PROJECT.md          # 프로젝트 비전 (항상 로드)
├── REQUIREMENTS.md     # 범위별 요구사항 (v1/v2 분리)
├── ROADMAP.md          # 마일스톤 + 페이즈 진행 상황
├── STATE.md            # 현재 위치, 결정사항, 블로커
├── CONTEXT.md          # 페이즈별 구현 결정사항
├── research/           # 도메인/기술 리서치 결과
│   └── {phase}-RESEARCH.md
├── plans/              # 원자적 태스크 계획
│   └── {phase}-{N}-PLAN.md
├── summaries/          # 실행 완료 기록
│   └── {phase}-{N}-SUMMARY.md
├── verifications/      # 검증 결과
│   └── {phase}-VERIFICATION.md
├── quick/              # ad-hoc 빠른 태스크
├── todos/              # 나중에 할 일
├── threads/            # 진행 중인 논의
└── seeds/              # 아이디어 씨앗
```

## 6단계 워크플로우

```
초기화 → 논의 → 계획 → 실행 → 검증 → 출시
  ↑                                    │
  └────── 다음 페이즈/마일스톤 ─────────┘
```

### 1. 프로젝트 초기화 (`gsd:new-project`)

**수행**: 아이디어를 완전히 이해할 때까지 질문 → 병렬 에이전트로 도메인 리서치 → v1/v2 요구사항 추출 → 페이즈별 로드맵 생성

**산출물**: `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`, `research/`

**PROJECT.md 구조**:
```markdown
# 프로젝트명

## 비전
한 문장으로 프로젝트가 존재하는 이유.

## 핵심 가치
- ...

## 대상 사용자
- ...

## 성공 지표
- ...
```

**ROADMAP.md 구조**:
```markdown
# 로드맵

## 마일스톤 1: MVP
- [x] Phase 1: 기반 인프라
- [ ] Phase 2: 핵심 기능
- [ ] Phase 3: 사용자 플로우

## 마일스톤 2: Beta
- [ ] Phase 4: ...
```

### 2. 페이즈 논의 (`gsd:discuss-phase [N]`)

**수행**: 해당 페이즈의 구현에서 발생할 수 있는 회색 지대(gray area) 분석 → 시각적 기능, API, 콘텐츠 시스템 등에 대해 질문 → 결정사항을 CONTEXT.md에 기록

**산출물**: `CONTEXT.md` (업데이트)

**포인트**:
- 무엇을 만들지가 아니라 **어떻게** 만들지에 대한 결정
- 연구/계획 단계에서 직접 참조됨

### 3. 페이즈 계획 (`gsd:plan-phase [N]`)

**수행**: CONTEXT.md 기반으로 구현 접근법 리서치 → 원자적 태스크 계획 2-3개 생성 → 계획 검증 루프 (통과할 때까지)

**산출물**: `{phase}-RESEARCH.md`, `{phase}-{N}-PLAN.md`

**계획 XML 구조**:
```xml
<task type="auto">
  <name>게스트 체크인 API 엔드포인트 생성</name>
  <files>src/modules/checkin/checkin.resolver.ts, checkin.service.ts</files>
  <action>
    Prisma로 Guest 모델 조회.
    체크인 상태 업데이트 mutation 구현.
    입력 validation은 class-validator 사용.
  </action>
  <verify>GraphQL Playground에서 mutation 실행 → 상태 변경 확인</verify>
  <done>체크인/체크아웃 상태 전환이 정상 동작</done>
</task>
```

### 4. 페이즈 실행 (`gsd:execute-phase [N]`)

**수행**: 의존성 기반으로 병렬 "웨이브"로 실행 → 각 실행자는 신선한 컨텍스트 사용 (200k 토큰) → 태스크마다 즉시 커밋 → 페이즈 약속 이행 검증

**웨이브 실행**:
```
Wave 1: [독립 태스크 A] + [독립 태스크 B]  (병렬)
Wave 2: [A에 의존하는 태스크 C]             (순차)
Wave 3: [B,C에 의존하는 태스크 D]           (순차)
```

**산출물**: `{phase}-{N}-SUMMARY.md`, `{phase}-VERIFICATION.md`

**원자적 커밋**:
```
abc123f docs(01-01): 체크인 API 계획 완료
def456g feat(01-01): Guest 모델 체크인 상태 필드 추가
hij789k feat(01-02): 체크인 mutation 리졸버 구현
```

### 5. 작업 검증 (`gsd:verify-work [N]`)

**수행**: 테스트 가능한 산출물 추출 → 하나씩 인터랙티브하게 확인 → 실패 시 디버그 에이전트 자동 투입 → 수정 계획 생성

**산출물**: `{phase}-UAT.md`

### 6. 출시 및 반복 (`gsd:ship`, `gsd:next`)

- **ship**: 검증된 페이즈를 PR로 생성
- **next**: 다음 논리적 단계 자동 감지 후 실행
- **complete-milestone**: 마일스톤 아카이브 + 태그 릴리스
- **new-milestone**: 다음 버전 사이클 시작

## 빠른 모드 (`gsd:quick`)

정식 계획 없이 빠르게 처리할 ad-hoc 태스크용.

```
gsd:quick "로그인 페이지에 비밀번호 찾기 링크 추가"
```

- 동일 품질의 에이전트 (planner + executor)
- 리서치/계획 검증/검증 생략 (기본)
- `--discuss`, `--research`, `--full` 플래그로 단계 추가 가능

## Hosspie 프로젝트 연동

### 기존 스킬과의 관계

| GSD 단계 | 대응하는 기존 스킬 | 역할 |
|----------|-------------------|------|
| 초기화/논의 | brainstorming, specification-workshop | 아이디어 탐색 + 명세 |
| 계획 | writing-plans, prd-to-tasks | 태스크 분해 + 상세 계획 |
| 실행 | executing-plans, Agent Teams | 배치/병렬 실행 |
| 검증 | verification-before-completion | 테스트/빌드 확인 |
| 출시 | git-pull-request | PR 생성 |

### 적합한 사용 시나리오

- **마일스톤 단위 로드맵 관리**: 전체 제품 방향을 페이즈로 분해
- **새로운 기능 모듈 시작**: 리서치부터 출시까지 엔드투엔드
- **세션 간 상태 유지**: STATE.md로 어디까지 했는지 추적

## 명령어 레퍼런스

| 명령어 | 용도 |
|--------|------|
| `gsd:new-project` | 프로젝트 초기화 (질문, 리서치, 요구사항, 로드맵) |
| `gsd:discuss-phase [N]` | 구현 결정사항 캡처 |
| `gsd:plan-phase [N]` | 리서치 + 계획 + 검증 |
| `gsd:execute-phase [N]` | 병렬 웨이브로 실행 |
| `gsd:verify-work [N]` | 사용자 수용 테스트 |
| `gsd:ship [N]` | PR 생성 |
| `gsd:next` | 다음 단계 자동 진행 |
| `gsd:quick [text]` | ad-hoc 빠른 태스크 |
| `gsd:complete-milestone` | 마일스톤 아카이브 + 태그 |
| `gsd:new-milestone` | 다음 마일스톤 시작 |
| `gsd:status` | 현재 상태 표시 |
