---
title: EXPLAIN ANALYZE로 느린 쿼리 진단
impact: LOW-MEDIUM
impactDescription: 쿼리 실행의 정확한 병목 지점 식별
tags: explain, analyze, diagnostics, query-plan
---

## EXPLAIN ANALYZE로 느린 쿼리 진단

EXPLAIN ANALYZE는 쿼리를 실행하고 실제 타이밍을 보여주어, 진정한 성능 병목 지점을 드러냅니다.

**잘못된 방법 (성능 문제 추측):**

```sql
-- 쿼리가 느린데, 왜?
select * from orders where customer_id = 123 and status = 'pending';
-- "인덱스가 누락되었을 것이다" - 하지만 어떤 것?
```

**올바른 방법 (EXPLAIN ANALYZE 사용):**

```sql
explain (analyze, buffers, format text)
select * from orders where customer_id = 123 and status = 'pending';

-- 출력이 문제를 드러냄:
-- Seq Scan on orders (cost=0.00..25000.00 rows=50 width=100) (actual time=0.015..450.123 rows=50 loops=1)
--   Filter: ((customer_id = 123) AND (status = 'pending'::text))
--   Rows Removed by Filter: 999950
--   Buffers: shared hit=5000 read=15000
-- Planning Time: 0.150 ms
-- Execution Time: 450.500 ms
```

주목할 주요 사항:

```sql
-- 대용량 테이블의 Seq Scan = 인덱스 누락
-- Rows Removed by Filter = 낮은 선택도 또는 인덱스 누락
-- Buffers: read >> hit = 데이터가 캐시되지 않음, 더 많은 메모리 필요
-- 높은 loops를 가진 Nested Loop = 다른 조인 전략 고려
-- Sort Method: external merge = work_mem이 너무 낮음
```

참고: [EXPLAIN](https://supabase.com/docs/guides/database/inspect)
