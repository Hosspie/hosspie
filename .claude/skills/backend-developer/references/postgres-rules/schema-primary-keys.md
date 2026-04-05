---
title: 최적의 기본 키 전략 선택
impact: HIGH
impactDescription: 더 나은 인덱스 지역성, 단편화 감소
tags: primary-key, identity, uuid, serial, schema
---

## 최적의 기본 키 전략 선택

기본 키 선택은 삽입 성능, 인덱스 크기, 복제 효율성에 영향을 미칩니다.

**잘못된 방법 (문제가 있는 PK 선택):**

```sql
-- identity가 SQL 표준 접근 방식
create table users (
  id serial primary key  -- 작동하지만 IDENTITY가 권장됨
);

-- 랜덤 UUID(v4)는 인덱스 단편화 유발
create table orders (
  id uuid default gen_random_uuid() primary key  -- UUIDv4 = 랜덤 = 분산된 삽입
);
```

**올바른 방법 (최적의 PK 전략):**

```sql
-- 순차 ID에는 IDENTITY 사용 (SQL 표준, 대부분의 경우에 최적)
create table users (
  id bigint generated always as identity primary key
);

-- UUID가 필요한 분산 시스템에는 UUIDv7 사용 (시간 순서)
-- pg_uuidv7 확장 필요: create extension pg_uuidv7;
create table orders (
  id uuid default uuid_generate_v7() primary key  -- 시간 순서, 단편화 없음
);

-- 대안: 정렬 가능한 분산 ID를 위한 시간 접두사 ID (확장 불필요)
create table events (
  id text default concat(
    to_char(now() at time zone 'utc', 'YYYYMMDDHH24MISSMS'),
    gen_random_uuid()::text
  ) primary key
);
```

가이드라인:

- 단일 데이터베이스: `bigint identity` (순차, 8바이트, SQL 표준)
- 분산/노출된 ID: UUIDv7 (pg_uuidv7 필요) 또는 ULID (시간 순서, 단편화 없음)
- `serial`도 작동하지만 `identity`가 SQL 표준이며 새 애플리케이션에 권장됨
- 대용량 테이블의 기본 키로 랜덤 UUID(v4) 사용 피하기 (인덱스 단편화 유발)

참고: [Identity Columns](https://www.postgresql.org/docs/current/sql-createtable.html#SQL-CREATETABLE-PARMS-GENERATED-IDENTITY)
