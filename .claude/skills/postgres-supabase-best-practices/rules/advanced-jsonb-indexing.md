---
title: 효율적인 쿼리를 위한 JSONB 컬럼 인덱싱
impact: MEDIUM
impactDescription: 적절한 인덱싱으로 10-100배 빠른 JSONB 쿼리
tags: jsonb, gin, indexes, json
---

## 효율적인 쿼리를 위한 JSONB 컬럼 인덱싱

인덱스가 없는 JSONB 쿼리는 전체 테이블을 스캔합니다. 포함 쿼리를 위해 GIN 인덱스를 사용하세요.

**잘못된 방법 (JSONB에 인덱스 없음):**

```sql
create table products (
  id bigint primary key,
  attributes jsonb
);

-- 모든 쿼리마다 전체 테이블 스캔
select * from products where attributes @> '{"color": "red"}';
select * from products where attributes->>'brand' = 'Nike';
```

**올바른 방법 (JSONB를 위한 GIN 인덱스):**

```sql
-- 포함 연산자 (@>, ?, ?&, ?|)를 위한 GIN 인덱스
create index products_attrs_gin on products using gin (attributes);

-- 이제 포함 쿼리가 인덱스 사용
select * from products where attributes @> '{"color": "red"}';

-- 특정 키 조회를 위해서는 표현식 인덱스 사용
create index products_brand_idx on products ((attributes->>'brand'));
select * from products where attributes->>'brand' = 'Nike';
```

올바른 연산자 클래스 선택:

```sql
-- jsonb_ops (기본값): 모든 연산자 지원, 더 큰 인덱스
create index idx1 on products using gin (attributes);

-- jsonb_path_ops: @> 연산자만 지원, 하지만 2-3배 작은 인덱스
create index idx2 on products using gin (attributes jsonb_path_ops);
```

참고: [JSONB Indexes](https://www.postgresql.org/docs/current/datatype-json.html#JSON-INDEXING)
