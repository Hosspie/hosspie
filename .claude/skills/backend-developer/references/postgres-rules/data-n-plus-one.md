---
title: 배치 로딩으로 N+1 쿼리 제거
impact: MEDIUM-HIGH
impactDescription: 10-100배 적은 데이터베이스 왕복
tags: n-plus-one, batch, performance, queries
---

## 배치 로딩으로 N+1 쿼리 제거

N+1 쿼리는 루프의 각 항목마다 하나의 쿼리를 실행합니다. 배열이나 JOIN을 사용하여 단일 쿼리로 배치 처리하세요.

**잘못된 방법 (N+1 쿼리):**

```sql
-- 첫 번째 쿼리: 모든 사용자 가져오기
select id from users where active = true;  -- 100개 ID 반환

-- 그 다음 N개 쿼리, 사용자당 하나씩
select * from orders where user_id = 1;
select * from orders where user_id = 2;
select * from orders where user_id = 3;
-- ... 97개 이상의 쿼리!

-- 총: 101번의 데이터베이스 왕복
```

**올바른 방법 (단일 배치 쿼리):**

```sql
-- ID를 수집하고 ANY로 한 번에 쿼리
select * from orders where user_id = any(array[1, 2, 3, ...]);

-- 또는 루프 대신 JOIN 사용
select u.id, u.name, o.*
from users u
left join orders o on o.user_id = u.id
where u.active = true;

-- 총: 1번의 왕복
```

애플리케이션 패턴:

```sql
-- 애플리케이션 코드에서 루프 대신:
-- for user in users: db.query("SELECT * FROM orders WHERE user_id = $1", user.id)

-- 배열 파라미터 전달:
select * from orders where user_id = any($1::bigint[]);
-- 애플리케이션이 전달: [1, 2, 3, 4, 5, ...]
```

참고: [N+1 Query Problem](https://supabase.com/docs/guides/database/query-optimization)
