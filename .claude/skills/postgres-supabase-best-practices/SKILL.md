---
name: supabase-postgres-best-practices
description: Supabase의 Postgres 성능 최적화 및 모범 사례. Postgres 쿼리 작성, 스키마 설계, 데이터베이스 설정을 최적화할 때 이 스킬을 사용하세요.
license: MIT
metadata:
  author: supabase
  version: "1.0.0"
---

# Supabase Postgres 모범 사례

Supabase가 관리하는 Postgres용 포괄적인 성능 최적화 가이드입니다. 8개 카테고리에 걸쳐 규칙을 포함하고 있으며, 자동화된 쿼리 최적화와 스키마 설계를 안내하기 위해 영향도별로 우선순위가 지정되어 있습니다.

## 적용 시점

다음과 같은 경우에 이 가이드라인을 참고하세요:
- SQL 쿼리 작성 또는 스키마 설계
- 인덱스 구현 또는 쿼리 최적화
- 데이터베이스 성능 문제 검토
- 커넥션 풀링 또는 스케일링 설정
- Postgres 전용 기능 최적화
- Row-Level Security (RLS) 작업

## 우선순위별 규칙 카테고리

| 우선순위 | 카테고리 | 영향도 | 접두사 |
|----------|----------|--------|--------|
| 1 | 쿼리 성능 | CRITICAL | `query-` |
| 2 | 커넥션 관리 | CRITICAL | `conn-` |
| 3 | 보안 & RLS | CRITICAL | `security-` |
| 4 | 스키마 설계 | HIGH | `schema-` |
| 5 | 동시성 & 락킹 | MEDIUM-HIGH | `lock-` |
| 6 | 데이터 접근 패턴 | MEDIUM | `data-` |
| 7 | 모니터링 & 진단 | LOW-MEDIUM | `monitor-` |
| 8 | 고급 기능 | LOW | `advanced-` |

## 사용 방법

자세한 설명과 SQL 예제를 보려면 개별 규칙 파일을 읽어보세요:

```
rules/query-missing-indexes.md
rules/schema-partial-indexes.md
rules/_sections.md
```

각 규칙 파일에는 다음이 포함되어 있습니다:
- 왜 중요한지에 대한 간단한 설명
- 설명과 함께 제공되는 잘못된 SQL 예제
- 설명과 함께 제공되는 올바른 SQL 예제
- 선택적 EXPLAIN 출력 또는 메트릭
- 추가 컨텍스트 및 참고 자료
- Supabase 전용 참고사항 (해당하는 경우)

## 전체 컴파일된 문서

모든 규칙이 확장된 전체 가이드는 `AGENTS.md`를 참고하세요.
