---
name: code-review
description: 변경 코드 리뷰 워크플로우. 로컬 diff(미커밋 또는 main 대비 브랜치)를 분석하고 변경 영역을 식별해 영역별 가이드를 적용한다. RN 영역(apps/admin) 변경 시 react-native-best-practices 스킬을 참고. 트리거 — 코드 리뷰 요청, /code-review, "리뷰해줘", PR 만들기 직전 셀프 체크.
---

# Code Review

hosspie 모노레포의 변경 사항을 영역별로 분류해 리뷰하는 워크플로우. 영역마다 적용할 시야와 가이드가 다르므로, 변경 파일 경로로 영역을 판별하고 해당 영역의 가이드를 호출한다.

## 스킬 범위

### ✅ 다루는 것
- 로컬 diff(미커밋 또는 `main` 대비 현재 브랜치) 리뷰
- 영역별 가이드 라우팅 (현재: RN. 추후 영역 추가)
- 리뷰 결과를 카테고리별로 정리해 사용자에게 보고

### ❌ 다루지 않는 것
- GitHub PR 본문/리뷰 코멘트 작성: 플러그인 `code-review:code-review`, `pr-review-toolkit:review-pr` 사용
- 자동 수정/커밋: 리뷰는 진단까지만. 수정은 사용자 결정 또는 도메인 junior 에이전트에 위임
- 빌드/테스트 실행: 별도 영역

## 입력 결정

기본은 로컬 diff. 다음 우선순위로 결정:

1. 사용자가 특정 파일/범위를 지정 → 해당 범위만
2. 미커밋 변경 존재 (`git status`에 변경/스테이지된 파일) → `git diff HEAD`
3. 브랜치가 `main`과 다름 → `git diff main...HEAD`
4. 모두 없으면 사용자에게 입력 범위 확인

## 플로우

```
diff 수집 → 영역 분류 → 영역별 가이드 호출 → rules/스킬 문서 정합성 → 결과 통합 → 사용자 보고
```

### 1. diff 수집

위 입력 우선순위에 따라 변경 파일 목록과 diff를 확보한다.

### 2. 영역 분류

변경 파일을 다음 영역에 매핑한다. 한 변경 세트가 여러 영역에 걸칠 수 있다.

| 영역 | 경로 패턴 | 도메인 가이드 | 자동 적용 rules |
|------|----------|--------|----------------|
| RN (Admin 앱) | `apps/admin/**`, `packages/services/frontend/**` | `react-native-best-practices:react-native-best-practices` 스킬 | `.claude/rules/front/*.md` |
| (추후) Backend API | `apps/api/**`, `packages/database/**` | TBD | `.claude/rules/backend/*.md` |
| (추후) Design System | `packages/design-system/**` | TBD | `.claude/rules/publishing/*.md` |
| 문서 | `**/*.md`, `**/README*`, `docs/**` | — | `.claude/rules/docs/*.md` |
| `.claude` 정의 | `.claude/skills/**`, `.claude/agents/**`, `.claude/rules/**` | — | `.claude/rules/docs/claude-structure.md` (역할 분리·중복 금지) |
| 기타 | 위에 매칭되지 않는 파일 | — | 프로젝트 `CLAUDE.md` 컨벤션 |

**rules 는 항상 적용된다**. 도메인 가이드가 TBD인 영역도 rules 정합성은 점검한다. 새 영역이 필요해지면 이 표에 행을 추가하고 아래 "영역별 가이드 호출"에 해당 섹션을 만든다.

### 3. 영역별 가이드 호출

영역별로 진단을 수집한다. 변경 파일이 없는 영역은 건너뛴다.

#### RN

RN 영역 파일이 1개 이상 있으면:

1. `Skill` 툴로 `react-native-best-practices:react-native-best-practices` 호출
2. 스킬이 제공하는 진단 프레임(FPS, TTI, 번들 사이즈, 메모리 누수, 리렌더, 애니메이션, FlashList, JS 스레드 블로킹 등)을 변경된 RN 파일에 적용

> 변경이 RN과 무관(예: 설정/문서만 수정)하면 RN 가이드는 생략한다. 도메인별 코드 컨벤션(import 규칙, 폼 패턴 등)은 4단계 rules 점검에서 다룬다.

#### 기타

도메인 가이드가 TBD인 영역(Backend / Design System / 기타)은 4단계의 rules 점검만 수행한다.

### 4. rules / 스킬 문서 정합성 점검

변경된 모든 파일에 대해 영역 매핑(2단계)에 해당하는 `.claude/rules/<area>/*.md` 를 읽고, diff 가 그 규칙과 어긋나는지 점검한다.

**수행 절차**:

1. 변경 파일이 매핑된 영역의 rules 파일을 모두 읽는다 (여러 영역이면 모두 합집합).
2. diff 의 각 라인이 rules 의 컨벤션·템플릿·금지 패턴을 위반하는지 확인.
3. 위반은 출력 포맷의 해당 영역 섹션에 이슈로 추가. 위반 항목에는 어떤 rules 파일의 어느 규칙인지 명시 (`.claude/rules/front/screen.md` 등).

**`.claude/skills/**`, `.claude/agents/**`, `.claude/rules/**` 변경 시 추가 점검** (`claude-structure.md` 기반):

- **역할 분리**: rules 가 아닌 곳(agents, skills)에 코드 린트·템플릿 규칙이 들어가 있지 않은지
- **중복 금지**: 같은 규칙이 여러 파일에 흩어져 있지 않은지
- **agent rules pointer**: agent 정의 마지막에 "구체 컨벤션은 `.claude/rules/<domain>/` 자동 적용" 한 줄이 있는지
- **신규 스킬 등록**: 새 스킬이 추가되었는데 `.claude/CLAUDE.md` 의 "스킬 가이드" 표에 행이 없는지
- **신규 에이전트 등록**: 새 에이전트가 추가되었는데 `.claude/CLAUDE.md` 의 "에이전트 가이드" 표에 행이 없는지

**문서 변경 시**: `.claude/rules/docs/writing-style.md` 기준으로 한글·이모지·톤 일관성 점검.

## 출력 포맷

리뷰 결과는 다음 구조로 보고한다:

```
## 리뷰 요약
- 변경 파일: N개 (RN: a, 문서: b, .claude: c, 기타: d)
- 주요 이슈: M건 (Critical: x, Warning: y, Info: z)

## RN
### Critical
- {file}:{line} — {이슈} → {제안} [rules: front/screen.md]
### Warning
- ...

## 문서
- ...

## .claude 정의
- ...

## 기타
- ...

## 다음 액션
- (사용자가 바로 적용할 수 있는 액션 1-3개)
```

각 이슈가 rules 위반에서 기인하면 끝에 `[rules: <파일>]` 태그를 붙여 출처를 밝힌다. 이슈 없으면 "이슈 없음 ✅"으로 간결히 보고하고 끝낸다.

**심각도 기준**:
- **Critical**: 런타임 버그, 성능 회귀, 보안 이슈, 컨벤션 위반 중 코드베이스 일관성을 깨는 것
- **Warning**: 베스트 프랙티스 위반, 잠재적 리렌더/메모리 이슈, 가독성 저해
- **Info**: 선택적 개선, 스타일 제안

## 영역 추가 가이드 (점진적 확장)

새 영역을 추가할 때:

1. "영역 분류" 표에 경로 패턴 + 가이드 행 추가
2. "영역별 가이드 호출"에 해당 영역 섹션 추가 (외부 스킬 호출 또는 인라인 체크리스트)
3. "출력 포맷"에 새 영역 섹션 추가

빈 영역을 미리 채우지 않는다. 실제 리뷰가 필요해진 시점에 추가한다.

## 설계 원칙

- **진단까지만**: 자동 수정하지 않는다. 수정은 사용자 또는 도메인 junior 에이전트에 위임
- **영역 라우팅**: 모든 코드를 동일한 시야로 보지 않는다. RN/Backend/DesignSystem은 각자 다른 가이드가 필요
- **점진적 확장**: 새 가이드는 사용해야 할 때 추가한다. 가짜 TBD를 채우지 않는다
- **외부 스킬 위임**: 같은 가이드가 외부 스킬로 존재하면 직접 복제하지 말고 `Skill` 호출로 위임한다
