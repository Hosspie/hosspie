---
title: 모든 애플리케이션에서 커넥션 풀링 사용
impact: CRITICAL
impactDescription: 10-100배 더 많은 동시 사용자 처리
tags: connection-pooling, pgbouncer, performance, scalability
---

## 모든 애플리케이션에서 커넥션 풀링 사용

Postgres 커넥션은 비용이 많이 듭니다 (각 1-3MB RAM). 풀링 없이는 애플리케이션이 부하 상황에서 커넥션을 소진합니다.

**잘못된 예 (요청당 새로운 커넥션):**

```sql
-- 각 요청마다 새로운 커넥션 생성
-- 애플리케이션 코드: 요청당 db.connect()
-- 결과: 500명의 동시 사용자 = 500개의 커넥션 = 데이터베이스 크래시

-- 현재 커넥션 확인
select count(*) from pg_stat_activity;  -- 487개의 커넥션!
```

**올바른 예 (커넥션 풀링):**

```sql
-- 앱과 데이터베이스 사이에 PgBouncer 같은 풀러 사용
-- 애플리케이션은 풀러에 연결하고, 풀러는 Postgres에 대한 작은 풀을 재사용

-- pool_size 설정 공식: (CPU 코어 * 2) + spindle_count
-- 4코어 예시: pool_size = 10

-- 결과: 500명의 동시 사용자가 10개의 실제 커넥션 공유
select count(*) from pg_stat_activity;  -- 10개의 커넥션
```

풀 모드:

- **Transaction 모드**: 각 트랜잭션 후 커넥션 반환 (대부분의 앱에 가장 적합)
- **Session 모드**: 전체 세션 동안 커넥션 유지 (prepared statement, 임시 테이블에 필요)

참고: [커넥션 풀링](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
