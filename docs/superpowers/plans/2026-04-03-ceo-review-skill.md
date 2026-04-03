# CEO Review 스킬 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** CEO 관점의 사업 판단을 체계적으로 수행하는 Claude Code 스킬을 생성한다.

**Architecture:** SKILL.md에 트리거 식별 → 경량/중량 분기 → 도전자 질문 → 모드 선언 → 문서화 플로우를 정의. references/에 지속 문서(vision.md, roadmap.md)와 리뷰 히스토리를 저장.

**Tech Stack:** Claude Code Skill (Markdown), YAML frontmatter

---

## 파일 구조

```
.claude/skills/ceo-review/
├── SKILL.md                           # 스킬 본체 (트리거, 플로우, 원칙)
└── references/
    ├── history/                        # 리뷰 문서 저장 디렉토리
    │   └── .gitkeep
    ├── review-template.md              # 리뷰 문서 템플릿
    ├── roadmap.md                      # 마일스톤/로드맵 (초기 비어있음)
    └── vision.md                       # 서비스 비전 (초기 비어있음)
```

---

### Task 1: 디렉토리 구조 생성

**Files:**
- Create: `.claude/skills/ceo-review/references/history/.gitkeep`

- [ ] **Step 1: 디렉토리 생성**

```bash
mkdir -p .claude/skills/ceo-review/references/history
touch .claude/skills/ceo-review/references/history/.gitkeep
```

- [ ] **Step 2: 커밋**

```bash
git add .claude/skills/ceo-review/
git commit -m "chore: ceo-review 스킬 디렉토리 구조 생성"
```

---

### Task 2: 리뷰 문서 템플릿 작성

**Files:**
- Create: `.claude/skills/ceo-review/references/review-template.md`

- [ ] **Step 1: 템플릿 파일 작성**

경량/중량 트리거 공용 템플릿. 중량 전용 섹션은 주석으로 표시.

```markdown
# {주제}

- 날짜: YYYY-MM-DD
- 트리거: feedback | milestone-review | new-service | pivot
- 모드: 확장 | 유지 | 축소

## 배경
{왜 이 리뷰를 하게 되었는지}

## 전제 (중량 트리거만 — 경량 시 이 섹션 제거)
- ✅ {합의된 전제}
- ❌ {기각된 전제} → {수정된 내용}
- ❓ {미확인 전제} → 검증 필요

## 핵심 판단
{도전자 질문을 통해 도출된 결론 요약}

## 대안 검토 (중량 트리거만 — 경량 시 이 섹션 제거)
| 대안 | 장점 | 단점 |
|------|------|------|
| A    |      |      |
| B    |      |      |
→ 선택: {선택한 대안과 이유}

## 다음 액션
- [ ] {구체적 후속 작업 1}
- [ ] {구체적 후속 작업 2}
```

- [ ] **Step 2: 커밋**

```bash
git add .claude/skills/ceo-review/references/review-template.md
git commit -m "docs: ceo-review 리뷰 문서 템플릿 추가"
```

---

### Task 3: 지속 문서 초기화 (vision.md, roadmap.md)

**Files:**
- Create: `.claude/skills/ceo-review/references/vision.md`
- Create: `.claude/skills/ceo-review/references/roadmap.md`

- [ ] **Step 1: vision.md 초기 파일 작성**

```markdown
# Hosspie 서비스 비전

> 이 문서는 CEO Review 스킬 실행 시 자동으로 참조되며, 리뷰 결과에 따라 갱신됩니다.

## 비전
(아직 정의되지 않음 — 첫 CEO Review 시 작성)

## 핵심 가치

## 타겟 사용자

## 차별점
```

- [ ] **Step 2: roadmap.md 초기 파일 작성**

```markdown
# Hosspie 로드맵

> 이 문서는 CEO Review 스킬 실행 시 자동으로 참조되며, 마일스톤 리뷰 시 갱신됩니다.

## 현재 마일스톤
(아직 정의되지 않음 — 첫 CEO Review 시 작성)

## 완료된 마일스톤

## 향후 계획
```

- [ ] **Step 3: 커밋**

```bash
git add .claude/skills/ceo-review/references/vision.md .claude/skills/ceo-review/references/roadmap.md
git commit -m "docs: ceo-review 지속 문서 초기화 (vision, roadmap)"
```

---

### Task 4: SKILL.md 작성 — Frontmatter + 개요

**Files:**
- Create: `.claude/skills/ceo-review/SKILL.md`

- [ ] **Step 1: YAML frontmatter + 역할 정의 + 트리거 섹션 작성**

```markdown
---
name: ceo-review
description: CEO 관점의 사업 판단 스킬. 서비스 비전, 방향성, 사업 아이템 평가, 마일스톤 리뷰를 체계적으로 수행합니다. 트리거: CEO 리뷰, 사업 방향, 비전, 마일스톤 리뷰, 방향 전환, 새 서비스, 피드백 CEO 관점, 로드맵, 사업 평가.
---

# CEO Review

PO가 "뭘 만들까"를 결정한다면, CEO는 **"왜 이걸 하는가, 지금 이 방향이 맞는가"**를 판단한다.

1인 사업체 대표가 서비스의 비전, 방향성, 사업 판단을 체계적으로 내리기 위한 사고 프레임워크.

## AI 역할

- **초반 — 도전자(Challenger)**: 전제를 검증하고, 방향의 약점을 짚는다.
- **후반 — 정리자(Facilitator)**: 대화 결과를 구조화하고 문서화한다.

## 트리거

이벤트 기반으로 동작하며, 경량/중량으로 분류된다.

| 트리거 | 분류 | 설명 |
|--------|------|------|
| `feedback` | 경량 | 서비스 기획안/명세를 CEO 관점에서 피드백 |
| `milestone-review` | 경량 | 마일스톤 완료 후 방향 정합성 점검 |
| `new-service` | 중량 | 새로운 서비스/사업 아이템 구상 및 평가 |
| `pivot` | 중량 | 서비스 방향 전환 검토 |

**트리거 식별**: 대화 맥락에서 추론한다. 모호하면 사용자에게 확인. 사용자가 직접 지정해도 된다.
```

이 단계에서는 frontmatter + 개요 + 트리거까지만 작성한다. 플로우는 다음 Task에서 추가.

- [ ] **Step 2: 커밋**

```bash
git add .claude/skills/ceo-review/SKILL.md
git commit -m "feat: ceo-review 스킬 frontmatter + 개요 + 트리거 작성"
```

---

### Task 5: SKILL.md 작성 — 범위 모드 + CEO 역할

**Files:**
- Modify: `.claude/skills/ceo-review/SKILL.md`

- [ ] **Step 1: 범위 모드 섹션 추가**

SKILL.md 끝에 추가:

```markdown
## 범위 모드

매 의사결정 시 현재 상황에 맞는 모드를 **명시적으로 선언**한다.

| 모드 | 의미 | 예시 |
|------|------|------|
| **확장** | 새 기능/시장 진입, 리소스 투입 | "예약 관리에 자동 가격 추천 붙이자" |
| **유지** | 현재 방향 유지, 품질 개선에 집중 | "로드맵대로 간다" |
| **축소** | 범위를 줄이고 핵심에 집중 | "인증은 MVP 이후로 미루자" |

## CEO가 던지는 핵심 질문

| 역할 | 핵심 질문 |
|------|----------|
| 서비스 비전 수립 | "이 서비스가 존재하는 이유는?" |
| 수요 현실 점검 | "사람들이 진짜 이걸 원하는가?" |
| 사업 아이템 구상/평가 | "이게 사업이 되는가?" |
| 가장 좁은 쐐기 식별 | "하나만 만든다면 뭘 만들어야 하나?" |
| 제품 방향성 수립 | "다음 6개월, 어디로 가는가?" |
| 범위 의사결정 | "지금은 확장할 때인가, 축소할 때인가?" |
| 마일스톤/로드맵 관리 | "언제까지 뭘 달성해야 하나?" |
| 경쟁 환경 인식 | "우리만의 차별점이 유지되고 있는가?" |
```

- [ ] **Step 2: 커밋**

```bash
git add .claude/skills/ceo-review/SKILL.md
git commit -m "feat: ceo-review 범위 모드 + CEO 핵심 질문 추가"
```

---

### Task 6: SKILL.md 작성 — 경량 트리거 플로우

**Files:**
- Modify: `.claude/skills/ceo-review/SKILL.md`

- [ ] **Step 1: 경량 트리거 플로우 섹션 추가**

SKILL.md 끝에 추가:

```markdown
## 플로우

### 경량 트리거 (feedback, milestone-review)

```
진입 → 트리거 식별 → 현황 파악 → 도전자 질문 2-3개 → 모드 선언 → 결론 정리 → 문서화
```

**1. 현황 파악**
- `references/vision.md`, `references/roadmap.md`를 읽어서 현재 비전/방향성 확인한다.
  - 파일이 없으면 스킵. 결론 단계에서 초기 문서 생성을 제안한다.
- 트리거에 따라 대상 파악:
  - `feedback`: 사용자가 제시한 기획안/명세를 읽는다.
  - `milestone-review`: 사용자가 완료된 마일스톤을 알려주면, 해당 범위의 git log와 관련 docs를 확인한다.

**2. 도전자 질문 (2-3개)**
- 한 메시지에 하나씩, 대화 턴을 나눠서 진행한다.
- 사용자가 "한꺼번에 해줘"라고 요청하면 묶어서 제시해도 된다.
- 비전/방향성 대비 현재 상태의 정합성을 검증하는 질문을 던진다.
- 예시:
  - feedback: "이 기능이 핵심 사용자의 가장 큰 고통을 해결하나요, 아니면 nice-to-have인가요?"
  - milestone-review: "이번 마일스톤 결과가 다음 마일스톤으로 자연스럽게 연결되나요?"

**3. 모드 선언**
- 대화 결과를 바탕으로 현재 상황에 맞는 모드(확장/유지/축소)를 제안한다.
- 사용자가 최종 선택한다.

**4. 결론 정리 + 문서화**
- 판단 요약: 모드, 핵심 결론, 다음 액션을 정리한다.
- `references/review-template.md`를 참고하여 `references/history/YYYY-MM-DD-{트리거}-{주제}.md`에 저장한다.
- 결론이 비전이나 로드맵에 영향을 주면, 해당 지속 문서 갱신을 제안한다. 사용자 확인 후 갱신.
```

- [ ] **Step 2: 커밋**

```bash
git add .claude/skills/ceo-review/SKILL.md
git commit -m "feat: ceo-review 경량 트리거 플로우 작성"
```

---

### Task 7: SKILL.md 작성 — 중량 트리거 플로우

**Files:**
- Modify: `.claude/skills/ceo-review/SKILL.md`

- [ ] **Step 1: 중량 트리거 플로우 섹션 추가**

SKILL.md의 경량 트리거 플로우 아래에 추가:

```markdown
### 중량 트리거 (new-service, pivot)

```
진입 → 트리거 식별 → 현황 파악 → 전제 검증 → 도전자 질문 → 대안 제시 → 모드 선언 → 결론 정리 → 문서화
```

경량 대비 **전제 검증**과 **대안 제시**가 추가된다.

**1. 현황 파악** — 경량과 동일.

**2. 전제 검증 (Premise Challenge)**
- 사용자의 아이디어/방향에서 핵심 전제 2-3개를 추출한다.
- 반증 가능한 명제로 만들어 하나씩 제시한다.
- 응답 선택지: **동의 / 반대 / 수정 / 잘 모르겠다**
  - "잘 모르겠다" → 미확인 전제(❓)로 기록. 검증이 필요한 가설로 남겨둔다.
- 예시:
  > "게스트하우스 운영자는 현재 수기/엑셀로 관리하고 있어서 전용 툴에 비용을 지불할 의향이 있다" → 동의/반대/수정/잘 모르겠다?
- 합의된 전제는 이후 판단의 기반이 된다. 문서에도 기록한다.

**3. 도전자 질문 (3-5개)**
- 한 메시지에 하나씩, 대화 턴을 나눠서 진행한다.
- 사용자가 "한꺼번에 해줘"라고 요청하면 묶어서 제시해도 된다.
- 1인 사업체에 맞는 핵심 질문:
  - **수요 현실**: "이걸 당장 쓰겠다는 사람이 있나요?"
  - **가장 좁은 쐐기**: "이것 하나만으로 쓸 이유가 되는 핵심은?"
  - **기존 대안**: "지금 사람들이 이 문제를 어떻게 해결하고 있나요?"
  - **차별점**: "기존 대안 대비 10배 나은 점이 뭔가요?"
  - **실현 가능성**: "1인이 만들 수 있는 범위인가요?"

**4. 대안 제시**
- 도전자 질문 결과를 바탕으로 2-3가지 방향을 제안한다.
- 각 대안에 트레이드오프와 추천안을 포함한다.
- "가장 좁은 쐐기" 관점: 가장 적은 기능으로 가장 큰 가치를 내는 방향을 우선 추천한다.

**5. 모드 선언 → 결론 정리 → 문서화** — 경량과 동일.
```

- [ ] **Step 2: 커밋**

```bash
git add .claude/skills/ceo-review/SKILL.md
git commit -m "feat: ceo-review 중량 트리거 플로우 작성"
```

---

### Task 8: SKILL.md 작성 — 문서화 규칙 + 스킬 연결 + 설계 원칙

**Files:**
- Modify: `.claude/skills/ceo-review/SKILL.md`

- [ ] **Step 1: 문서화 규칙, 스킬 연결, 설계 원칙 섹션 추가**

SKILL.md 끝에 추가:

```markdown
## 문서화

### 리뷰 문서

매 실행 시 `references/history/YYYY-MM-DD-{트리거}-{주제}.md`에 저장한다.

**파일명 규칙:**
- `{주제}`는 대화 내용에서 핵심 키워드를 추출하여 kebab-case로 생성한다.
- 한글 사용 가능, 공백은 하이픈으로 대체한다.
- 예: `2026-04-03-feedback-예약관리-기획안.md`

템플릿은 `references/review-template.md`를 참조한다.

### 지속 문서

- `references/vision.md` — 서비스 비전
- `references/roadmap.md` — 마일스톤/로드맵

어떤 트리거든 결론이 비전이나 로드맵에 영향을 주면, 해당 문서 갱신을 제안한다. 사용자 확인 후 갱신.

## 스킬 연결

CEO 스킬은 **판단까지만** 책임진다. 구체적 실행으로의 전환은 사용자가 결정한다. 스킬이 자동으로 다른 스킬을 호출하지 않는다.

| 트리거 | 결론 이후 제안 |
|--------|---------------|
| `feedback` | "피드백 반영하여 기획안을 수정하시겠어요?" |
| `milestone-review` | "다음 마일스톤을 roadmap.md에 업데이트하시겠어요?" |
| `new-service` | "이 방향으로 구체적인 기획을 시작하시겠어요?" |
| `pivot` | "방향 전환을 vision.md에 반영하시겠어요?" |

## 설계 원칙

- **User Sovereignty**: AI는 추천하고, 사용자가 결정한다.
- **1인 사업체 최적화**: 대기업용 프로세스를 가져오지 않는다. 경량/중량 분류로 과한 프로세스를 방지한다.
- **한 번에 하나의 질문**: 여러 질문을 한꺼번에 던지지 않는다. 사용자가 요청하면 묶어서 가능.
- **모드 선언 필수**: 모든 판단에 확장/유지/축소 모드를 명시하여 의사결정 이력을 추적 가능하게 한다.
- **판단과 실행의 분리**: CEO 스킬은 판단만, 실행은 다른 스킬에서.
```

- [ ] **Step 2: 커밋**

```bash
git add .claude/skills/ceo-review/SKILL.md
git commit -m "feat: ceo-review 문서화 규칙 + 스킬 연결 + 설계 원칙 작성"
```

---

### Task 9: workflow-guide 스킬에 ceo-review 연결 추가

**Files:**
- Modify: `.claude/skills/workflow-guide/SKILL.md:8-28`

- [ ] **Step 1: 전체 흐름 다이어그램에 방향 판단 단계 추가**

`.claude/skills/workflow-guide/SKILL.md`의 전체 흐름 섹션(line 12-14)을 수정:

```markdown
```
방향 판단 ─→ 기획 ─→ 태스크 분해 ─→ 실행 ─→ 품질 확인
```
```

- [ ] **Step 2: 전체 흐름 표에 ceo-review 행 추가**

표(line 16-28)의 기획 행 위에 삽입:

```markdown
| 방향 판단 | ceo-review | CEO 관점 사업 판단 (비전, 방향성, 범위 모드) |
```

- [ ] **Step 3: 스킬 연결 규칙에 ceo-review 추가**

스킬 연결 규칙 섹션(line 142-148)에 추가:

```markdown
ceo-review ──→ brainstorming (사용자 판단에 의해, 자동 호출 아님)
```

- [ ] **Step 4: 판단 기준 트리에 ceo-review 분기 추가**

판단 기준 섹션(line 162-178)의 맨 앞에 추가:

```markdown
방향/비전 판단이 필요한가?
├─ Yes → ceo-review부터
└─ No  → 기존 플로우 진행
```

- [ ] **Step 5: 커밋**

```bash
git add .claude/skills/workflow-guide/SKILL.md
git commit -m "docs: workflow-guide에 ceo-review 스킬 연결 추가"
```
