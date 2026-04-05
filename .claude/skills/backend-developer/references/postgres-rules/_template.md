---
title: 명확하고 행동 지향적인 제목 (예: "필터링된 쿼리를 위한 부분 인덱스 사용")
impact: MEDIUM
impactDescription: 필터링된 쿼리에서 5-20배 쿼리 속도 향상
tags: indexes, query-optimization, performance
---

## [규칙 제목]

[문제와 왜 중요한지에 대한 1-2문장 설명. 성능 영향도에 집중.]

**잘못된 예 (문제 설명):**

```sql
-- 무엇이 느리거나 문제가 되는지 설명하는 주석
CREATE INDEX users_email_idx ON users(email);

SELECT * FROM users WHERE email = 'user@example.com' AND deleted_at IS NULL;
-- 삭제된 레코드를 불필요하게 스캔함
```

**올바른 예 (해결책 설명):**

```sql
-- 왜 이것이 더 나은지 설명하는 주석
CREATE INDEX users_active_email_idx ON users(email) WHERE deleted_at IS NULL;

SELECT * FROM users WHERE email = 'user@example.com' AND deleted_at IS NULL;
-- 활성 사용자만 인덱싱, 10배 작은 인덱스, 더 빠른 쿼리
```

[선택사항: 추가 컨텍스트, 엣지 케이스, 또는 트레이드오프]

참고: [Postgres 문서](https://www.postgresql.org/docs/current/)
