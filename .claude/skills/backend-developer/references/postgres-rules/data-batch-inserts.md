---
title: 대량 데이터를 위한 INSERT 문 배치 처리
impact: MEDIUM
impactDescription: 10-50배 빠른 대량 삽입
tags: batch, insert, bulk, performance, copy
---

## 대량 데이터를 위한 INSERT 문 배치 처리

개별 INSERT 문은 높은 오버헤드가 있습니다. 단일 문에서 여러 행을 배치 처리하거나 COPY를 사용하세요.

**잘못된 방법 (개별 삽입):**

```sql
-- 각 삽입은 별도의 트랜잭션이자 왕복
insert into events (user_id, action) values (1, 'click');
insert into events (user_id, action) values (1, 'view');
insert into events (user_id, action) values (2, 'click');
-- ... 1000개 이상의 개별 삽입

-- 1000번의 삽입 = 1000번의 왕복 = 느림
```

**올바른 방법 (배치 삽입):**

```sql
-- 단일 문에서 여러 행
insert into events (user_id, action) values
  (1, 'click'),
  (1, 'view'),
  (2, 'click'),
  -- ... 배치당 최대 ~1000개 행
  (999, 'view');

-- 1000개 행을 위한 하나의 왕복
```

대량 임포트에는 COPY 사용:

```sql
-- COPY는 대량 로딩에 가장 빠름
copy events (user_id, action, created_at)
from '/path/to/data.csv'
with (format csv, header true);

-- 또는 애플리케이션에서 stdin으로
copy events (user_id, action) from stdin with (format csv);
1,click
1,view
2,click
\.
```

참고: [COPY](https://www.postgresql.org/docs/current/sql-copy.html)
