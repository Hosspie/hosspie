---
title: Insert-or-Update 작업을 위한 UPSERT 사용
impact: MEDIUM
impactDescription: 원자적 작업, 경쟁 조건 제거
tags: upsert, on-conflict, insert, update
---

## Insert-or-Update 작업을 위한 UPSERT 사용

별도의 SELECT-then-INSERT/UPDATE 사용은 경쟁 조건을 만듭니다. 원자적 upsert를 위해 INSERT ... ON CONFLICT를 사용하세요.

**잘못된 방법 (check-then-insert 경쟁 조건):**

```sql
-- 경쟁 조건: 두 요청이 동시에 확인
select * from settings where user_id = 123 and key = 'theme';
-- 둘 다 아무것도 찾지 못함

-- 둘 다 삽입 시도
insert into settings (user_id, key, value) values (123, 'theme', 'dark');
-- 하나는 성공, 하나는 중복 키 에러로 실패!
```

**올바른 방법 (원자적 UPSERT):**

```sql
-- 단일 원자적 작업
insert into settings (user_id, key, value)
values (123, 'theme', 'dark')
on conflict (user_id, key)
do update set value = excluded.value, updated_at = now();

-- 삽입/업데이트된 행 반환
insert into settings (user_id, key, value)
values (123, 'theme', 'dark')
on conflict (user_id, key)
do update set value = excluded.value
returning *;
```

Insert-or-ignore 패턴:

```sql
-- 존재하지 않을 때만 삽입 (업데이트 없음)
insert into page_views (page_id, user_id)
values (1, 123)
on conflict (page_id, user_id) do nothing;
```

참고: [INSERT ON CONFLICT](https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT)
