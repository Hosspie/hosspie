---
title: 외래 키 컬럼에 인덱스 생성
impact: HIGH
impactDescription: 10-100배 빠른 JOIN과 CASCADE 연산
tags: foreign-key, indexes, joins, schema
---

## 외래 키 컬럼에 인덱스 생성

Postgres는 외래 키 컬럼에 자동으로 인덱스를 생성하지 않습니다. 인덱스가 없으면 느린 JOIN과 CASCADE 연산이 발생합니다.

**잘못된 방법 (인덱스 없는 외래 키):**

```sql
create table orders (
  id bigint generated always as identity primary key,
  customer_id bigint references customers(id) on delete cascade,
  total numeric(10,2)
);

-- customer_id에 인덱스 없음!
-- JOIN과 ON DELETE CASCADE 모두 전체 테이블 스캔 필요
select * from orders where customer_id = 123;  -- Seq Scan
delete from customers where id = 123;          -- 테이블 락, 모든 주문 스캔
```

**올바른 방법 (인덱스가 있는 외래 키):**

```sql
create table orders (
  id bigint generated always as identity primary key,
  customer_id bigint references customers(id) on delete cascade,
  total numeric(10,2)
);

-- 항상 FK 컬럼에 인덱스 생성
create index orders_customer_id_idx on orders (customer_id);

-- 이제 JOIN과 cascade가 빠름
select * from orders where customer_id = 123;  -- Index Scan
delete from customers where id = 123;          -- 인덱스 사용, 빠른 cascade
```

누락된 FK 인덱스 찾기:

```sql
select
  conrelid::regclass as table_name,
  a.attname as fk_column
from pg_constraint c
join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any(c.conkey)
where c.contype = 'f'
  and not exists (
    select 1 from pg_index i
    where i.indrelid = c.conrelid and a.attnum = any(i.indkey)
  );
```

참고: [Foreign Keys](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK)
