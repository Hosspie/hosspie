---
title: 논블로킹 큐 처리를 위한 SKIP LOCKED 사용
impact: MEDIUM-HIGH
impactDescription: 워커 큐에서 10배 처리량
tags: skip-locked, queue, workers, concurrency
---

## 논블로킹 큐 처리를 위한 SKIP LOCKED 사용

여러 워커가 큐를 처리할 때, SKIP LOCKED는 워커들이 대기 없이 다른 행을 처리할 수 있게 합니다.

**잘못된 방법 (워커들이 서로 차단):**

```sql
-- Worker 1과 Worker 2가 모두 다음 작업을 가져오려 시도
begin;
select * from jobs where status = 'pending' order by created_at limit 1 for update;
-- Worker 2가 Worker 1의 락 해제를 대기!
```

**올바른 방법 (병렬 처리를 위한 SKIP LOCKED):**

```sql
-- 각 워커는 락된 행을 건너뛰고 다음 사용 가능한 행 획득
begin;
select * from jobs
where status = 'pending'
order by created_at
limit 1
for update skip locked;

-- Worker 1은 작업 1을 획득, Worker 2는 작업 2를 획득 (대기 없음)

update jobs set status = 'processing' where id = $1;
commit;
```

완전한 큐 패턴:

```sql
-- 단일 문으로 원자적 claim-and-update
update jobs
set status = 'processing', worker_id = $1, started_at = now()
where id = (
  select id from jobs
  where status = 'pending'
  order by created_at
  limit 1
  for update skip locked
)
returning *;
```

참고: [SELECT FOR UPDATE SKIP LOCKED](https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE)
