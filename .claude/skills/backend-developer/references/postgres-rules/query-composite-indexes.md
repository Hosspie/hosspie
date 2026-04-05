---
title: 다중 컬럼 쿼리를 위한 복합 인덱스 생성
impact: HIGH
impactDescription: 5-10배 빠른 다중 컬럼 쿼리
tags: indexes, composite-index, multi-column, query-optimization
---

## 다중 컬럼 쿼리를 위한 복합 인덱스 생성

쿼리가 여러 컬럼으로 필터링할 때, 복합 인덱스가 개별 단일 컬럼 인덱스보다 효율적입니다.

**잘못된 방법 (개별 인덱스는 비트맵 스캔 필요):**

```sql
-- 두 개의 개별 인덱스
create index orders_status_idx on orders (status);
create index orders_created_idx on orders (created_at);

-- 쿼리는 두 인덱스를 모두 결합해야 함 (느림)
select * from orders where status = 'pending' and created_at > '2024-01-01';
```

**올바른 방법 (복합 인덱스):**

```sql
-- 단일 복합 인덱스 (동등 조건 컬럼을 먼저 배치)
create index orders_status_created_idx on orders (status, created_at);

-- 쿼리는 하나의 효율적인 인덱스 스캔 사용
select * from orders where status = 'pending' and created_at > '2024-01-01';
```

**컬럼 순서가 중요함** - 동등 조건 컬럼을 먼저, 범위 조건 컬럼을 나중에 배치:

```sql
-- 좋음: status (=)를 created_at (>) 앞에 배치
create index idx on orders (status, created_at);

-- 작동함: WHERE status = 'pending'
-- 작동함: WHERE status = 'pending' AND created_at > '2024-01-01'
-- 작동하지 않음: WHERE created_at > '2024-01-01' (최좌측 접두사 규칙)
```

참고: [Multicolumn Indexes](https://www.postgresql.org/docs/current/indexes-multicolumn.html)
