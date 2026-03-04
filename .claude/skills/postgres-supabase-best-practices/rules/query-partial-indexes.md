---
title: 필터링된 쿼리를 위한 부분 인덱스 사용
impact: HIGH
impactDescription: 5-20배 작은 인덱스, 빠른 쓰기와 쿼리
tags: indexes, partial-index, query-optimization, storage
---

## 필터링된 쿼리를 위한 부분 인덱스 사용

부분 인덱스는 WHERE 조건과 일치하는 행만 포함하여, 쿼리가 일관되게 동일한 조건으로 필터링할 때 더 작고 빠르게 만듭니다.

**잘못된 방법 (전체 인덱스가 관련 없는 행 포함):**

```sql
-- 소프트 삭제된 행을 포함한 모든 행을 인덱스에 포함
create index users_email_idx on users (email);

-- 쿼리는 항상 활성 사용자만 필터링
select * from users where email = 'user@example.com' and deleted_at is null;
```

**올바른 방법 (부분 인덱스가 쿼리 필터와 일치):**

```sql
-- 활성 사용자만 인덱스에 포함
create index users_active_email_idx on users (email)
where deleted_at is null;

-- 쿼리는 더 작고 빠른 인덱스 사용
select * from users where email = 'user@example.com' and deleted_at is null;
```

부분 인덱스의 일반적인 사용 사례:

```sql
-- 대기 중인 주문만 (완료되면 상태가 거의 변경되지 않음)
create index orders_pending_idx on orders (created_at)
where status = 'pending';

-- null이 아닌 값만
create index products_sku_idx on products (sku)
where sku is not null;
```

참고: [Partial Indexes](https://www.postgresql.org/docs/current/indexes-partial.html)
