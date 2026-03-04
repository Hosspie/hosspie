# Postgres 모범 사례 - 기여자 가이드

이 저장소는 AI 에이전트와 LLM에 최적화된 Postgres 성능 최적화 규칙을 포함하고 있습니다.

## 빠른 시작

```bash
# 저장소 루트에서
npm install

# 기존 규칙 검증
npm run validate

# AGENTS.md 빌드
npm run build
```

## 새로운 규칙 만들기

1. **카테고리에 따라 섹션 접두사 선택**:
   - `query-` 쿼리 성능 (CRITICAL)
   - `conn-` 커넥션 관리 (CRITICAL)
   - `security-` 보안 & RLS (CRITICAL)
   - `schema-` 스키마 설계 (HIGH)
   - `lock-` 동시성 & 락킹 (MEDIUM-HIGH)
   - `data-` 데이터 접근 패턴 (MEDIUM)
   - `monitor-` 모니터링 & 진단 (LOW-MEDIUM)
   - `advanced-` 고급 기능 (LOW)

2. **템플릿 복사**:
   ```bash
   cp rules/_template.md rules/query-your-rule-name.md
   ```

3. **템플릿 구조에 따라 내용 작성**

4. **검증 및 빌드**:
   ```bash
   npm run validate
   npm run build
   ```

5. **생성된 `AGENTS.md` 검토**

## 저장소 구조

```
skills/postgres-best-practices/
├── SKILL.md           # 에이전트용 스킬 매니페스트
├── AGENTS.md          # [생성됨] 컴파일된 규칙 문서
├── README.md          # 이 파일
├── metadata.json      # 버전 및 메타데이터
└── rules/
    ├── _template.md      # 규칙 템플릿
    ├── _sections.md      # 섹션 정의
    ├── _contributing.md  # 작성 가이드라인
    └── *.md              # 개별 규칙들

packages/skills-build/
├── src/               # 일반 빌드 시스템 소스
├── package.json       # NPM 스크립트
└── test-cases.json    # [생성됨] 테스트 아티팩트
```

## 규칙 파일 구조

전체 템플릿은 `rules/_template.md`를 참고하세요. 주요 요소:

````markdown
---
title: 명확하고 행동 지향적인 제목
impact: CRITICAL|HIGH|MEDIUM-HIGH|MEDIUM|LOW-MEDIUM|LOW
impactDescription: 정량화된 이점 (예: "10-100배 빠름")
tags: 관련, 키워드
---

## [제목]

[1-2문장 설명]

**잘못된 예 (설명):**

```sql
-- 무엇이 잘못되었는지 설명하는 주석
[잘못된 SQL 예제]
```
````

**올바른 예 (설명):**

```sql
-- 왜 이것이 더 나은지 설명하는 주석
[올바른 SQL 예제]
```

```
## 작성 가이드라인

자세한 가이드라인은 `rules/_contributing.md`를 참고하세요. 핵심 원칙:

1. **구체적인 변환 보여주기** - 추상적인 조언이 아닌 "X를 Y로 변경"
2. **에러 우선 구조** - 해결책 전에 문제를 먼저 보여주기
3. **영향도 정량화** - 구체적인 메트릭 포함 (10배 빠름, 50% 작음)
4. **자체 완결적인 예제** - 완전하고 실행 가능한 SQL
5. **의미론적 네이밍** - (table1, col1)이 아닌 의미 있는 이름 사용 (users, email)

## 영향도 레벨

| 레벨 | 개선도 | 예시 |
|-------|-------------|----------|
| CRITICAL | 10-100배 | 누락된 인덱스, 커넥션 고갈 |
| HIGH | 5-20배 | 잘못된 인덱스 타입, 잘못된 파티셔닝 |
| MEDIUM-HIGH | 2-5배 | N+1 쿼리, RLS 최적화 |
| MEDIUM | 1.5-3배 | 중복 인덱스, 오래된 통계 |
| LOW-MEDIUM | 1.2-2배 | VACUUM 튜닝, 설정 조정 |
| LOW | 점진적 | 고급 패턴, 엣지 케이스 |
```
