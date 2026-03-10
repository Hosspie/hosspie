---
title: VACUUM과 ANALYZE로 테이블 통계 유지
impact: MEDIUM
impactDescription: 정확한 통계로 2-10배 나은 쿼리 플랜
tags: vacuum, analyze, statistics, maintenance, autovacuum
---

## VACUUM과 ANALYZE로 테이블 통계 유지

오래된 통계는 쿼리 플래너가 잘못된 결정을 내리게 합니다. VACUUM은 공간을 회수하고, ANALYZE는 통계를 업데이트합니다.

**잘못된 방법 (오래된 통계):**

```sql
-- 테이블에 100만 행이 있지만 통계는 1000행이라고 함
-- 쿼리 플래너가 잘못된 전략 선택
explain select * from orders where status = 'pending';
-- 표시: Seq Scan (통계가 작은 테이블을 보여주기 때문)
-- 실제: Index Scan이 훨씬 빠름
```

**올바른 방법 (최신 통계 유지):**

```sql
-- 대량 데이터 변경 후 수동 분석
analyze orders;

-- WHERE 절에 사용되는 특정 컬럼 분석
analyze orders (status, created_at);

-- 테이블이 마지막으로 분석된 시기 확인
select
  relname,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze
from pg_stat_user_tables
order by last_analyze nulls first;
```

바쁜 테이블을 위한 Autovacuum 튜닝:

```sql
-- 높은 변경률 테이블의 빈도 증가
alter table orders set (
  autovacuum_vacuum_scale_factor = 0.05,     -- 5% 데드 튜플에서 Vacuum (기본값 20%)
  autovacuum_analyze_scale_factor = 0.02     -- 2% 변경에서 Analyze (기본값 10%)
);

-- autovacuum 상태 확인
select * from pg_stat_progress_vacuum;
```

참고: [VACUUM](https://supabase.com/docs/guides/database/database-size#vacuum-operations)
