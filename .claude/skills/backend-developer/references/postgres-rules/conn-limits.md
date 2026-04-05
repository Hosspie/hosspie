---
title: 적절한 커넥션 제한 설정
impact: CRITICAL
impactDescription: 데이터베이스 크래시와 메모리 고갈 방지
tags: connections, max-connections, limits, stability
---

## 적절한 커넥션 제한 설정

너무 많은 커넥션은 메모리를 고갈시키고 성능을 저하시킵니다. 사용 가능한 리소스에 따라 제한을 설정하세요.

**잘못된 방법 (무제한 또는 과도한 커넥션):**

```sql
-- 기본 max_connections = 100, 하지만 무분별하게 증가시키는 경우가 많음
show max_connections;  -- 500 (4GB RAM에는 너무 높음)

-- 각 커넥션은 1-3MB RAM 사용
-- 500 커넥션 * 2MB = 커넥션만으로 1GB!
-- 부하 상태에서 메모리 부족 에러 발생
```

**올바른 방법 (리소스 기반 계산):**

```sql
-- 공식: max_connections = (RAM(MB) / 커넥션당 5MB) - 예약
-- 4GB RAM의 경우: (4096 / 5) - 10 = ~800 이론적 최대값
-- 하지만 실제로는 쿼리 성능을 위해 100-200이 더 좋음

-- 4GB RAM에 권장되는 설정
alter system set max_connections = 100;

-- work_mem도 적절히 설정
-- work_mem * max_connections는 RAM의 25%를 초과하지 않아야 함
alter system set work_mem = '8MB';  -- 8MB * 100 = 800MB 최대
```

커넥션 사용량 모니터링:

```sql
select count(*), state from pg_stat_activity group by state;
```

참고: [Database Connections](https://supabase.com/docs/guides/platform/performance#connection-management)
