---
title: 테이블 조회를 피하기 위한 커버링 인덱스 사용
impact: MEDIUM-HIGH
impactDescription: 힙 페치 제거로 2-5배 빠른 쿼리
tags: indexes, covering-index, include, index-only-scan
---

## 테이블 조회를 피하기 위한 커버링 인덱스 사용

커버링 인덱스는 쿼리에 필요한 모든 컬럼을 포함하여, 테이블을 완전히 건너뛰는 인덱스 전용 스캔을 가능하게 합니다.

**잘못된 방법 (인덱스 스캔 + 힙 페치):**

```sql
create index users_email_idx on users (email);

-- 테이블 힙에서 name과 created_at을 가져와야 함
select email, name, created_at from users where email = 'user@example.com';
```

**올바른 방법 (INCLUDE를 사용한 인덱스 전용 스캔):**

```sql
-- 검색하지 않는 컬럼을 인덱스에 포함
create index users_email_idx on users (email) include (name, created_at);

-- 모든 컬럼이 인덱스에서 제공됨, 테이블 접근 불필요
select email, name, created_at from users where email = 'user@example.com';
```

SELECT하지만 필터링하지 않는 컬럼에는 INCLUDE 사용:

```sql
-- status로 검색하지만, customer_id와 total도 필요
create index orders_status_idx on orders (status) include (customer_id, total);

select status, customer_id, total from orders where status = 'shipped';
```

참고: [Index-Only Scans](https://www.postgresql.org/docs/current/indexes-index-only-scans.html)
