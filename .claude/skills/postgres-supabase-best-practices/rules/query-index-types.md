---
title: 데이터에 맞는 올바른 인덱스 타입 선택
impact: HIGH
impactDescription: 올바른 인덱스 타입으로 10-100배 성능 향상
tags: indexes, btree, gin, brin, hash, index-types
---

## 데이터에 맞는 올바른 인덱스 타입 선택

인덱스 타입마다 서로 다른 쿼리 패턴에 최적화되어 있습니다. 기본 B-tree가 항상 최적은 아닙니다.

**잘못된 방법 (JSONB 포함 연산에 B-tree 사용):**

```sql
-- B-tree는 포함 연산자를 최적화할 수 없음
create index products_attrs_idx on products (attributes);
select * from products where attributes @> '{"color": "red"}';
-- 전체 테이블 스캔 - B-tree는 @> 연산자 지원 안 함
```

**올바른 방법 (JSONB에 GIN 사용):**

```sql
-- GIN은 @>, ?, ?&, ?| 연산자 지원
create index products_attrs_idx on products using gin (attributes);
select * from products where attributes @> '{"color": "red"}';
```

인덱스 타입 가이드:

```sql
-- B-tree (기본값): =, <, >, BETWEEN, IN, IS NULL
create index users_created_idx on users (created_at);

-- GIN: 배열, JSONB, 전문 검색
create index posts_tags_idx on posts using gin (tags);

-- BRIN: 대용량 시계열 테이블 (10-100배 작은 크기)
create index events_time_idx on events using brin (created_at);

-- Hash: 동등 조건만 (=에 대해 B-tree보다 약간 빠름)
create index sessions_token_idx on sessions using hash (token);
```

참고: [Index Types](https://www.postgresql.org/docs/current/indexes-types.html)
