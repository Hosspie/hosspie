---
title: 멀티 테넌트 데이터를 위한 Row Level Security 활성화
impact: CRITICAL
impactDescription: 데이터베이스 수준의 테넌트 격리, 데이터 유출 방지
tags: rls, row-level-security, multi-tenant, security
---

## 멀티 테넌트 데이터를 위한 Row Level Security 활성화

Row Level Security(RLS)는 데이터베이스 수준에서 데이터 접근을 강제하여, 사용자가 자신의 데이터만 볼 수 있도록 보장합니다.

**잘못된 방법 (애플리케이션 수준 필터링만):**

```sql
-- 애플리케이션만으로 필터링
select * from orders where user_id = $current_user_id;

-- 버그나 우회 수단이 있으면 모든 데이터가 노출됨!
select * from orders;  -- 모든 주문 반환
```

**올바른 방법 (데이터베이스 강제 RLS):**

```sql
-- 테이블에 RLS 활성화
alter table orders enable row level security;

-- 사용자가 자신의 주문만 볼 수 있도록 정책 생성
create policy orders_user_policy on orders
  for all
  using (user_id = current_setting('app.current_user_id')::bigint);

-- 테이블 소유자에게도 RLS 강제 적용
alter table orders force row level security;

-- 사용자 컨텍스트 설정 및 쿼리
set app.current_user_id = '123';
select * from orders;  -- 사용자 123의 주문만 반환
```

인증된 역할을 위한 정책:

```sql
create policy orders_user_policy on orders
  for all
  to authenticated
  using (user_id = auth.uid());
```

참고: [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
