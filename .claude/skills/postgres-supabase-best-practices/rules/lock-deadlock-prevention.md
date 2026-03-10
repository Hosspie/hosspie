---
title: 일관된 락 순서로 교착 상태 방지
impact: MEDIUM-HIGH
impactDescription: 교착 상태 에러 제거, 신뢰성 향상
tags: deadlocks, locking, transactions, ordering
---

## 일관된 락 순서로 교착 상태 방지

교착 상태는 트랜잭션이 서로 다른 순서로 리소스를 락할 때 발생합니다. 항상 일관된 순서로 락을 획득하세요.

**잘못된 방법 (일관되지 않은 락 순서):**

```sql
-- 트랜잭션 A                    -- 트랜잭션 B
begin;                              begin;
update accounts                     update accounts
set balance = balance - 100         set balance = balance - 50
where id = 1;                       where id = 2;  -- B가 행 2를 락

update accounts                     update accounts
set balance = balance + 100         set balance = balance + 50
where id = 2;  -- A가 B를 대기     where id = 1;  -- B가 A를 대기

-- 교착 상태! 서로를 대기
```

**올바른 방법 (먼저 일관된 순서로 행 락):**

```sql
-- 업데이트 전에 ID 순서로 명시적으로 락 획득
begin;
select * from accounts where id in (1, 2) order by id for update;

-- 이제 어떤 순서로든 업데이트 수행 - 락이 이미 보유됨
update accounts set balance = balance - 100 where id = 1;
update accounts set balance = balance + 100 where id = 2;
commit;
```

대안: 단일 문으로 원자적 업데이트:

```sql
-- 단일 문이 모든 락을 원자적으로 획득
begin;
update accounts
set balance = balance + case id
  when 1 then -100
  when 2 then 100
end
where id in (1, 2);
commit;
```

로그에서 교착 상태 감지:

```sql
-- 최근 교착 상태 확인
select * from pg_stat_database where deadlocks > 0;

-- 교착 상태 로깅 활성화
set log_lock_waits = on;
set deadlock_timeout = '1s';
```

참고: [Deadlocks](https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-DEADLOCKS)
