---
title: 풀링 환경에서 Prepared Statements 올바르게 사용
impact: HIGH
impactDescription: 풀링 환경에서 prepared statement 충돌 방지
tags: prepared-statements, connection-pooling, transaction-mode
---

## 풀링 환경에서 Prepared Statements 올바르게 사용

Prepared statement는 개별 데이터베이스 커넥션에 묶여 있습니다. 트랜잭션 모드 풀링에서는 커넥션이 공유되어 충돌이 발생합니다.

**잘못된 방법 (트랜잭션 풀링에서 이름 있는 prepared statement):**

```sql
-- 이름 있는 prepared statement
prepare get_user as select * from users where id = $1;

-- 트랜잭션 모드 풀링에서 다음 요청은 다른 커넥션을 받을 수 있음
execute get_user(123);
-- ERROR: prepared statement "get_user" does not exist
```

**올바른 방법 (이름 없는 statement 또는 세션 모드 사용):**

```sql
-- 옵션 1: 이름 없는 prepared statement 사용 (대부분의 ORM이 자동으로 수행)
-- 쿼리가 단일 프로토콜 메시지로 준비되고 실행됨

-- 옵션 2: 트랜잭션 모드에서 사용 후 할당 해제
prepare get_user as select * from users where id = $1;
execute get_user(123);
deallocate get_user;

-- 옵션 3: 세션 모드 풀링 사용 (포트 5432 vs 6543)
-- 커넥션이 전체 세션 동안 유지되어 prepared statement가 지속됨
```

드라이버 설정 확인:

```sql
-- 많은 드라이버가 기본적으로 prepared statement 사용
-- Node.js pg: { prepare: false }로 비활성화
-- JDBC: prepareThreshold=0으로 비활성화
```

참고: [Prepared Statements with Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pool-modes)
