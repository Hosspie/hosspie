---
title: RLS 정책 성능 최적화
impact: HIGH
impactDescription: 적절한 패턴으로 5-10배 빠른 RLS 쿼리
tags: rls, performance, security, optimization
---

## RLS 정책 성능 최적화

잘못 작성된 RLS 정책은 심각한 성능 문제를 일으킬 수 있습니다. 서브쿼리와 인덱스를 전략적으로 사용하세요.

**잘못된 방법 (모든 행마다 함수 호출):**

```sql
create policy orders_policy on orders
  using (auth.uid() = user_id);  -- auth.uid()가 행마다 호출됨!

-- 100만 행이 있으면 auth.uid()가 100만 번 호출됨
```

**올바른 방법 (SELECT로 함수 감싸기):**

```sql
create policy orders_policy on orders
  using ((select auth.uid()) = user_id);  -- 한 번만 호출되고 캐시됨

-- 대용량 테이블에서 100배 이상 빠름
```

복잡한 검사를 위한 security definer 함수 사용:

```sql
-- 헬퍼 함수 생성 (definer로 실행, RLS 우회)
create or replace function is_team_member(team_id bigint)
returns boolean
language sql
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.team_members
    where team_id = $1 and user_id = (select auth.uid())
  );
$$;

-- 정책에서 사용 (행별 검사가 아닌 인덱스 조회)
create policy team_orders_policy on orders
  using ((select is_team_member(team_id)));
```

RLS 정책에 사용되는 컬럼에는 항상 인덱스 추가:

```sql
create index orders_user_id_idx on orders (user_id);
```

참고: [RLS Performance](https://supabase.com/docs/guides/database/postgres/row-level-security#rls-performance-recommendations)
