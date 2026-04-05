---
title: OFFSET 대신 커서 기반 페이지네이션 사용
impact: MEDIUM-HIGH
impactDescription: 페이지 깊이와 무관한 일관된 O(1) 성능
tags: pagination, cursor, keyset, offset, performance
---

## OFFSET 대신 커서 기반 페이지네이션 사용

OFFSET 기반 페이지네이션은 건너뛴 모든 행을 스캔하여 페이지가 깊어질수록 느려집니다. 커서 페이지네이션은 O(1)입니다.

**잘못된 방법 (OFFSET 페이지네이션):**

```sql
-- 페이지 1: 20개 행 스캔
select * from products order by id limit 20 offset 0;

-- 페이지 100: 1980개 행을 건너뛰기 위해 2000개 행 스캔
select * from products order by id limit 20 offset 1980;

-- 페이지 10000: 200,000개 행 스캔!
select * from products order by id limit 20 offset 199980;
```

**올바른 방법 (커서/키셋 페이지네이션):**

```sql
-- 페이지 1: 첫 20개 가져오기
select * from products order by id limit 20;
-- 애플리케이션이 last_id = 20 저장

-- 페이지 2: 마지막 ID 이후부터 시작
select * from products where id > 20 order by id limit 20;
-- 인덱스 사용, 페이지 깊이와 무관하게 항상 빠름

-- 페이지 10000: 페이지 1과 동일한 속도
select * from products where id > 199980 order by id limit 20;
```

다중 컬럼 정렬의 경우:

```sql
-- 커서는 모든 정렬 컬럼을 포함해야 함
select * from products
where (created_at, id) > ('2024-01-15 10:00:00', 12345)
order by created_at, id
limit 20;
```

참고: [Pagination](https://supabase.com/docs/guides/database/pagination)
