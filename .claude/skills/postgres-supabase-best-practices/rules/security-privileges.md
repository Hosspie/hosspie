---
title: 최소 권한 원칙 적용
impact: MEDIUM
impactDescription: 공격 표면 감소, 더 나은 감사 추적
tags: privileges, security, roles, permissions
---

## 최소 권한 원칙 적용

필요한 최소한의 권한만 부여하세요. 애플리케이션 쿼리에 슈퍼유저를 절대 사용하지 마세요.

**잘못된 방법 (과도하게 넓은 권한):**

```sql
-- 애플리케이션이 슈퍼유저 커넥션 사용
-- 또는 애플리케이션 역할에 ALL 부여
grant all privileges on all tables in schema public to app_user;
grant all privileges on all sequences in schema public to app_user;

-- 어떤 SQL 인젝션이든 치명적이 됨
-- drop table users; 모든 것에 연쇄 작용
```

**올바른 방법 (최소한의 특정 권한 부여):**

```sql
-- 기본 권한 없이 역할 생성
create role app_readonly nologin;

-- 특정 테이블에만 SELECT 권한 부여
grant usage on schema public to app_readonly;
grant select on public.products, public.categories to app_readonly;

-- 제한된 범위의 쓰기 역할 생성
create role app_writer nologin;
grant usage on schema public to app_writer;
grant select, insert, update on public.orders to app_writer;
grant usage on sequence orders_id_seq to app_writer;
-- DELETE 권한 없음

-- 로그인 역할은 이들로부터 상속
create role app_user login password 'xxx';
grant app_writer to app_user;
```

public 기본값 취소:

```sql
-- 기본 public 접근 취소
revoke all on schema public from public;
revoke all on all tables in schema public from public;
```

참고: [Roles and Privileges](https://supabase.com/blog/postgres-roles-and-privileges)
