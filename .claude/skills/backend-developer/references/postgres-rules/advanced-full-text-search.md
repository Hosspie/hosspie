---
title: 전문 검색을 위한 tsvector 사용
impact: MEDIUM
impactDescription: LIKE보다 100배 빠르고, 순위 지원
tags: full-text-search, tsvector, gin, search
---

## 전문 검색을 위한 tsvector 사용

와일드카드가 있는 LIKE는 인덱스를 사용할 수 없습니다. tsvector를 사용한 전문 검색이 몇 배나 더 빠릅니다.

**잘못된 방법 (LIKE 패턴 매칭):**

```sql
-- 인덱스 사용 불가, 모든 행 스캔
select * from articles where content like '%postgresql%';

-- 대소문자 구분 없으면 더 나쁨
select * from articles where lower(content) like '%postgresql%';
```

**올바른 방법 (tsvector를 사용한 전문 검색):**

```sql
-- tsvector 컬럼과 인덱스 추가
alter table articles add column search_vector tsvector
  generated always as (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,''))) stored;

create index articles_search_idx on articles using gin (search_vector);

-- 빠른 전문 검색
select * from articles
where search_vector @@ to_tsquery('english', 'postgresql & performance');

-- 순위와 함께
select *, ts_rank(search_vector, query) as rank
from articles, to_tsquery('english', 'postgresql') query
where search_vector @@ query
order by rank desc;
```

여러 용어 검색:

```sql
-- AND: 두 용어 모두 필요
to_tsquery('postgresql & performance')

-- OR: 둘 중 하나
to_tsquery('postgresql | mysql')

-- 접두사 매칭
to_tsquery('post:*')
```

참고: [Full Text Search](https://supabase.com/docs/guides/database/full-text-search)
