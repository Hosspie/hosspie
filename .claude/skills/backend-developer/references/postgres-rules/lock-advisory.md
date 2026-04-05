---
title: 애플리케이션 수준 락킹을 위한 Advisory Lock 사용
impact: MEDIUM
impactDescription: 행 수준 락 오버헤드 없이 효율적인 조정
tags: advisory-locks, coordination, application-locks
---

## 애플리케이션 수준 락킹을 위한 Advisory Lock 사용

Advisory lock은 데이터베이스 행을 락할 필요 없이 애플리케이션 수준 조정을 제공합니다.

**잘못된 방법 (락을 위한 더미 행 생성):**

```sql
-- 락을 위한 더미 행 생성
create table resource_locks (
  resource_name text primary key
);

insert into resource_locks values ('report_generator');

-- 행을 선택하여 락
select * from resource_locks where resource_name = 'report_generator' for update;
```

**올바른 방법 (advisory lock):**

```sql
-- 세션 수준 advisory lock (연결 해제 또는 unlock 시 해제)
select pg_advisory_lock(hashtext('report_generator'));
-- ... 배타적 작업 수행 ...
select pg_advisory_unlock(hashtext('report_generator'));

-- 트랜잭션 수준 락 (commit/rollback 시 해제)
begin;
select pg_advisory_xact_lock(hashtext('daily_report'));
-- ... 작업 수행 ...
commit;  -- 락 자동 해제
```

논블로킹 작업을 위한 try-lock:

```sql
-- 대기하지 않고 즉시 true/false 반환
select pg_try_advisory_lock(hashtext('resource_name'));

-- 애플리케이션에서 사용
if (acquired) {
  -- 작업 수행
  select pg_advisory_unlock(hashtext('resource_name'));
} else {
  -- 건너뛰거나 나중에 재시도
}
```

참고: [Advisory Locks](https://www.postgresql.org/docs/current/explicit-locking.html#ADVISORY-LOCKS)
