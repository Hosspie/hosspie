---
title: 대용량 테이블 파티셔닝으로 성능 향상
impact: MEDIUM-HIGH
impactDescription: 대용량 테이블에서 5-20배 빠른 쿼리와 유지보수
tags: partitioning, large-tables, time-series, performance
---

## 대용량 테이블 파티셔닝으로 성능 향상

파티셔닝은 대용량 테이블을 작은 조각으로 나누어 쿼리 성능과 유지보수 작업을 향상시킵니다.

**잘못된 방법 (단일 대용량 테이블):**

```sql
create table events (
  id bigint generated always as identity,
  created_at timestamptz,
  data jsonb
);

-- 5억 행, 쿼리가 모든 것을 스캔
select * from events where created_at > '2024-01-01';  -- 느림
vacuum events;  -- 몇 시간 걸리고, 테이블 락
```

**올바른 방법 (시간 범위별 파티셔닝):**

```sql
create table events (
  id bigint generated always as identity,
  created_at timestamptz not null,
  data jsonb
) partition by range (created_at);

-- 각 월별로 파티션 생성
create table events_2024_01 partition of events
  for values from ('2024-01-01') to ('2024-02-01');

create table events_2024_02 partition of events
  for values from ('2024-02-01') to ('2024-03-01');

-- 쿼리는 관련 파티션만 스캔
select * from events where created_at > '2024-01-15';  -- events_2024_01+ 만 스캔

-- 오래된 데이터 즉시 삭제
drop table events_2023_01;  -- 즉시 완료 vs 몇 시간 걸리는 DELETE
```

파티셔닝 사용 시기:

- 1억 행 이상의 테이블
- 날짜 기반 쿼리가 있는 시계열 데이터
- 오래된 데이터를 효율적으로 삭제해야 할 때

참고: [Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)
