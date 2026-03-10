---
title: 유휴 커넥션 타임아웃 설정
impact: HIGH
impactDescription: 유휴 클라이언트로부터 커넥션 슬롯의 30-50% 회수
tags: connections, timeout, idle, resource-management
---

## 유휴 커넥션 타임아웃 설정

유휴 커넥션은 리소스를 낭비합니다. 타임아웃을 설정하여 자동으로 회수하세요.

**잘못된 방법 (커넥션을 무기한 유지):**

```sql
-- 타임아웃 설정 없음
show idle_in_transaction_session_timeout;  -- 0 (비활성화됨)

-- 유휴 상태에서도 커넥션이 영원히 열려 있음
select pid, state, state_change, query
from pg_stat_activity
where state = 'idle in transaction';
-- 락을 보유한 채 몇 시간 동안 유휴 상태인 트랜잭션 표시
```

**올바른 방법 (유휴 커넥션 자동 정리):**

```sql
-- 트랜잭션 내에서 30초 동안 유휴 상태인 커넥션 종료
alter system set idle_in_transaction_session_timeout = '30s';

-- 완전히 유휴 상태인 커넥션을 10분 후 종료
alter system set idle_session_timeout = '10min';

-- 설정 다시 로드
select pg_reload_conf();
```

풀링된 커넥션의 경우, 풀러 레벨에서 설정:

```ini
# pgbouncer.ini
server_idle_timeout = 60
client_idle_timeout = 300
```

참고: [Connection Timeouts](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-IDLE-IN-TRANSACTION-SESSION-TIMEOUT)
