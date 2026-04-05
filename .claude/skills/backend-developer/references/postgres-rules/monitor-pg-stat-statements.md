---
title: 쿼리 분석을 위한 pg_stat_statements 활성화
impact: LOW-MEDIUM
impactDescription: 가장 많은 리소스를 소비하는 쿼리 식별
tags: pg-stat-statements, monitoring, statistics, performance
---

## 쿼리 분석을 위한 pg_stat_statements 활성화

pg_stat_statements는 모든 쿼리의 실행 통계를 추적하여, 느리고 빈번한 쿼리를 식별하는 데 도움을 줍니다.

**잘못된 방법 (쿼리 패턴에 대한 가시성 없음):**

```sql
-- 데이터베이스가 느린데, 어떤 쿼리가 문제인가?
-- pg_stat_statements 없이는 알 수 없음
```

**올바른 방법 (pg_stat_statements 활성화 및 쿼리):**

```sql
-- 확장 활성화
create extension if not exists pg_stat_statements;

-- 총 시간별 가장 느린 쿼리 찾기
select
  calls,
  round(total_exec_time::numeric, 2) as total_time_ms,
  round(mean_exec_time::numeric, 2) as mean_time_ms,
  query
from pg_stat_statements
order by total_exec_time desc
limit 10;

-- 가장 빈번한 쿼리 찾기
select calls, query
from pg_stat_statements
order by calls desc
limit 10;

-- 최적화 후 통계 재설정
select pg_stat_statements_reset();
```

모니터링할 주요 메트릭:

```sql
-- 높은 평균 시간을 가진 쿼리 (최적화 후보)
select query, mean_exec_time, calls
from pg_stat_statements
where mean_exec_time > 100  -- > 100ms 평균
order by mean_exec_time desc;
```

참고: [pg_stat_statements](https://supabase.com/docs/guides/database/extensions/pg_stat_statements)
