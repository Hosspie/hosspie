---
title: 호환성을 위한 소문자 식별자 사용
impact: MEDIUM
impactDescription: 도구, ORM, AI 어시스턴트와의 대소문자 구분 버그 방지
tags: naming, identifiers, case-sensitivity, schema, conventions
---

## 호환성을 위한 소문자 식별자 사용

PostgreSQL은 따옴표 없는 식별자를 소문자로 변환합니다. 따옴표로 묶인 대소문자 혼합 식별자는 항상 따옴표가 필요하며, 이를 인식하지 못할 수 있는 도구, ORM, AI 어시스턴트와 문제를 일으킵니다.

**잘못된 방법 (대소문자 혼합 식별자):**

```sql
-- 따옴표 있는 식별자는 대소문자를 보존하지만 모든 곳에서 따옴표 필요
CREATE TABLE "Users" (
  "userId" bigint PRIMARY KEY,
  "firstName" text,
  "lastName" text
);

-- 항상 따옴표를 써야 하고 그렇지 않으면 쿼리 실패
SELECT "firstName" FROM "Users" WHERE "userId" = 1;

-- 이것은 실패 - 따옴표 없으면 Users가 users가 됨
SELECT firstName FROM Users;
-- ERROR: relation "users" does not exist
```

**올바른 방법 (소문자 snake_case):**

```sql
-- 따옴표 없는 소문자 식별자는 이식성이 좋고 도구 친화적
CREATE TABLE users (
  user_id bigint PRIMARY KEY,
  first_name text,
  last_name text
);

-- 따옴표 없이 작동, 모든 도구가 인식
SELECT first_name FROM users WHERE user_id = 1;
```

대소문자 혼합 식별자의 일반적인 출처:

```sql
-- ORM은 종종 따옴표 있는 camelCase 생성 - snake_case 사용하도록 설정
-- 다른 데이터베이스에서 마이그레이션하면 원래 대소문자 유지할 수 있음
-- 일부 GUI 도구는 기본적으로 식별자를 따옴표로 묶음 - 이것을 비활성화

-- 대소문자 혼합 식별자에 갇혔다면, 호환성 레이어로 뷰 생성
CREATE VIEW users AS SELECT "userId" AS user_id, "firstName" AS first_name FROM "Users";
```

참고: [Identifiers and Key Words](https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS)
