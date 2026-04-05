---
title: 적절한 데이터 타입 선택
impact: HIGH
impactDescription: 50% 스토리지 절감, 빠른 비교 연산
tags: data-types, schema, storage, performance
---

## 적절한 데이터 타입 선택

올바른 데이터 타입을 사용하면 스토리지를 줄이고, 쿼리 성능을 향상시키며, 버그를 방지할 수 있습니다.

**잘못된 방법 (잘못된 데이터 타입):**

```sql
create table users (
  id int,                    -- 21억에서 오버플로우 발생
  email varchar(255),        -- 불필요한 길이 제한
  created_at timestamp,      -- 타임존 정보 누락
  is_active varchar(5),      -- boolean을 문자열로
  price varchar(20)          -- 숫자를 문자열로
);
```

**올바른 방법 (적절한 데이터 타입):**

```sql
create table users (
  id bigint generated always as identity primary key,  -- 9경(quintillion) 최대
  email text,                     -- 인위적인 제한 없음, varchar와 동일한 성능
  created_at timestamptz,         -- 항상 타임존 인식 타임스탬프 저장
  is_active boolean default true, -- 1바이트 vs 가변 문자열 길이
  price numeric(10,2)             -- 정확한 십진 연산
);
```

주요 가이드라인:

```sql
-- ID: bigint 사용, int 사용 안 함 (미래 대비)
-- 문자열: text 사용, 제약 조건이 필요하지 않으면 varchar(n) 사용 안 함
-- 시간: timestamptz 사용, timestamp 사용 안 함
-- 금액: numeric 사용, float 사용 안 함 (정밀도 중요)
-- Enum: text와 check 제약 조건 사용 또는 enum 타입 생성
```

참고: [Data Types](https://www.postgresql.org/docs/current/datatype.html)
