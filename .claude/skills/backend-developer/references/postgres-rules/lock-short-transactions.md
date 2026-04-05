---
title: 락 경합 감소를 위해 트랜잭션을 짧게 유지
impact: MEDIUM-HIGH
impactDescription: 3-5배 처리량 향상, 교착 상태 감소
tags: transactions, locking, contention, performance
---

## 락 경합 감소를 위해 트랜잭션을 짧게 유지

오래 실행되는 트랜잭션은 다른 쿼리를 차단하는 락을 보유합니다. 트랜잭션을 가능한 한 짧게 유지하세요.

**잘못된 방법 (외부 호출이 있는 긴 트랜잭션):**

```sql
begin;
select * from orders where id = 1 for update;  -- 락 획득

-- 애플리케이션이 결제 API에 HTTP 호출 (2-5초)
-- 이 행에 대한 다른 쿼리들이 차단됨!

update orders set status = 'paid' where id = 1;
commit;  -- 전체 기간 동안 락 보유
```

**올바른 방법 (최소한의 트랜잭션 범위):**

```sql
-- 트랜잭션 밖에서 데이터 검증 및 API 호출
-- 애플리케이션: response = await paymentAPI.charge(...)

-- 실제 업데이트를 위해서만 락 보유
begin;
update orders
set status = 'paid', payment_id = $1
where id = $2 and status = 'pending'
returning *;
commit;  -- 밀리초 동안만 락 보유
```

폭주 트랜잭션 방지를 위해 `statement_timeout` 사용:

```sql
-- 30초 이상 실행되는 쿼리 중단
set statement_timeout = '30s';

-- 또는 세션별
set local statement_timeout = '5s';
```

참고: [Transaction Management](https://www.postgresql.org/docs/current/tutorial-transactions.html)
