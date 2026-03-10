---
title: WHERE 및 JOIN 컬럼에 인덱스 추가
impact: CRITICAL
impactDescription: 대규모 테이블에서 100-1000배 빠른 쿼리
tags: indexes, performance, sequential-scan, query-optimization
---

## WHERE 및 JOIN 컬럼에 인덱스 추가

인덱스가 없는 컬럼에서 필터링하거나 조인하는 쿼리는 전체 테이블 스캔을 발생시키며, 테이블이 커질수록 기하급수적으로 느려집니다.

**잘못된 예 (대규모 테이블에서 순차 스캔):**

```sql
-- customer_id에 인덱스가 없으면 전체 테이블 스캔 발생
select * from orders where customer_id = 123;

-- EXPLAIN 결과: Seq Scan on orders (cost=0.00..25000.00 rows=100 width=85)
```

**올바른 예 (인덱스 스캔):**

```sql
-- 자주 필터링하는 컬럼에 인덱스 생성
create index orders_customer_id_idx on orders (customer_id);

select * from orders where customer_id = 123;

-- EXPLAIN 결과: Index Scan using orders_customer_id_idx (cost=0.42..8.44 rows=100 width=85)
```

JOIN 컬럼의 경우, 항상 외래 키 쪽에 인덱스를 생성하세요:

```sql
-- 참조하는 컬럼에 인덱스 생성
create index orders_customer_id_idx on orders (customer_id);

select c.name, o.total
from customers c
join orders o on o.customer_id = c.id;
```

참고: [쿼리 최적화](https://supabase.com/docs/guides/database/query-optimization)
