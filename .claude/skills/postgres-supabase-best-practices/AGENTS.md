# Postgres 모범 사례

**버전 1.0.0**
Supabase
2026년 1월

> 이 문서는 AI 에이전트와 LLM에 최적화되어 있습니다. 규칙은 성능 영향도별로 우선순위가 지정되어 있습니다.

---

## 개요

Supabase와 Postgres를 사용하는 개발자를 위한 포괄적인 Postgres 성능 최적화 가이드입니다. 크리티컬(쿼리 성능, 커넥션 관리)부터 점진적(고급 기능)까지 영향도별로 우선순위가 지정된 8개 카테고리에 걸친 성능 규칙을 포함합니다. 각 규칙에는 자세한 설명, 잘못된 예제와 올바른 SQL 예제 비교, 쿼리 플랜 분석, 자동화된 최적화 및 코드 생성을 안내하는 구체적인 성능 메트릭이 포함되어 있습니다.

---

## 목차

1. [쿼리 성능](#query-performance) - **CRITICAL**
   - 1.1 [WHERE 및 JOIN 컬럼에 인덱스 추가](#11-add-indexes-on-where-and-join-columns)
   - 1.2 [데이터에 적합한 인덱스 타입 선택](#12-choose-the-right-index-type-for-your-data)
   - 1.3 [다중 컬럼 쿼리를 위한 복합 인덱스 생성](#13-create-composite-indexes-for-multi-column-queries)
   - 1.4 [테이블 조회를 피하기 위한 커버링 인덱스 사용](#14-use-covering-indexes-to-avoid-table-lookups)
   - 1.5 [필터링된 쿼리를 위한 부분 인덱스 사용](#15-use-partial-indexes-for-filtered-queries)

2. [커넥션 관리](#connection-management) - **CRITICAL**
   - 2.1 [유휴 커넥션 타임아웃 설정](#21-configure-idle-connection-timeouts)
   - 2.2 [적절한 커넥션 제한 설정](#22-set-appropriate-connection-limits)
   - 2.3 [모든 애플리케이션에서 커넥션 풀링 사용](#23-use-connection-pooling-for-all-applications)
   - 2.4 [풀링과 함께 Prepared Statement 올바르게 사용](#24-use-prepared-statements-correctly-with-pooling)

3. [보안 & RLS](#security-rls) - **CRITICAL**
   - 3.1 [최소 권한 원칙 적용](#31-apply-principle-of-least-privilege)
   - 3.2 [멀티 테넌트 데이터에 Row Level Security 활성화](#32-enable-row-level-security-for-multi-tenant-data)
   - 3.3 [성능을 위한 RLS 정책 최적화](#33-optimize-rls-policies-for-performance)

4. [스키마 설계](#schema-design) - **HIGH**
   - 4.1 [적절한 데이터 타입 선택](#41-choose-appropriate-data-types)
   - 4.2 [외래 키 컬럼 인덱싱](#42-index-foreign-key-columns)
   - 4.3 [더 나은 성능을 위한 대규모 테이블 파티셔닝](#43-partition-large-tables-for-better-performance)
   - 4.4 [최적의 기본 키 전략 선택](#44-select-optimal-primary-key-strategy)
   - 4.5 [호환성을 위한 소문자 식별자 사용](#45-use-lowercase-identifiers-for-compatibility)

5. [동시성 & 락킹](#concurrency-locking) - **MEDIUM-HIGH**
   - 5.1 [락 경합을 줄이기 위해 트랜잭션을 짧게 유지](#51-keep-transactions-short-to-reduce-lock-contention)
   - 5.2 [일관된 락 순서로 데드락 방지](#52-prevent-deadlocks-with-consistent-lock-ordering)
   - 5.3 [애플리케이션 레벨 락킹을 위한 Advisory Lock 사용](#53-use-advisory-locks-for-application-level-locking)
   - 5.4 [논블로킹 큐 처리를 위한 SKIP LOCKED 사용](#54-use-skip-locked-for-non-blocking-queue-processing)

6. [데이터 접근 패턴](#data-access-patterns) - **MEDIUM**
   - 6.1 [대량 데이터를 위한 INSERT 문 배치 처리](#61-batch-insert-statements-for-bulk-data)
   - 6.2 [배치 로딩으로 N+1 쿼리 제거](#62-eliminate-n1-queries-with-batch-loading)
   - 6.3 [OFFSET 대신 커서 기반 페이지네이션 사용](#63-use-cursor-based-pagination-instead-of-offset)
   - 6.4 [Insert-or-Update 작업에 UPSERT 사용](#64-use-upsert-for-insert-or-update-operations)

7. [모니터링 & 진단](#monitoring-diagnostics) - **LOW-MEDIUM**
   - 7.1 [쿼리 분석을 위한 pg_stat_statements 활성화](#71-enable-pgstatstatements-for-query-analysis)
   - 7.2 [VACUUM 및 ANALYZE로 테이블 통계 유지](#72-maintain-table-statistics-with-vacuum-and-analyze)
   - 7.3 [느린 쿼리 진단을 위한 EXPLAIN ANALYZE 사용](#73-use-explain-analyze-to-diagnose-slow-queries)

8. [고급 기능](#advanced-features) - **LOW**
   - 8.1 [효율적인 쿼리를 위한 JSONB 컬럼 인덱싱](#81-index-jsonb-columns-for-efficient-querying)
   - 8.2 [전문 검색을 위한 tsvector 사용](#82-use-tsvector-for-full-text-search)

---

## 1. 쿼리 성능

**영향도: CRITICAL**

느린 쿼리, 누락된 인덱스, 비효율적인 쿼리 플랜. Postgres 성능 문제의 가장 흔한 원인입니다.

### 1.1 WHERE 및 JOIN 컬럼에 인덱스 추가

**영향도: CRITICAL (대규모 테이블에서 100-1000배 빠른 쿼리)**

인덱스가 없는 컬럼에서 필터링하거나 조인하는 쿼리는 전체 테이블 스캔을 발생시키며, 테이블이 커질수록 기하급수적으로 느려집니다.

**잘못된 예 (대규모 테이블에서 순차 스캔):**

```sql
-- customer_id에 인덱스가 없으면 전체 테이블 스캔 발생
select * from orders where customer_id = 123;

-- EXPLAIN 결과: Seq Scan on orders (cost=0.00..25000.00 rows=100 width=85)
```

**올바른 예 (인덱스 스캔):**

```sql
-- 자주 필터링하는 컬럼에 인덱스 생성
create index orders_customer_id_idx on orders (customer_id);

select * from orders where customer_id = 123;

-- EXPLAIN 결과: Index Scan using orders_customer_id_idx (cost=0.42..8.44 rows=100 width=85)
-- 참조하는 컬럼에 인덱스 생성
create index orders_customer_id_idx on orders (customer_id);

select c.name, o.total
from customers c
join orders o on o.customer_id = c.id;
```

JOIN 컬럼의 경우, 항상 외래 키 쪽에 인덱스를 생성하세요:

참고: https://supabase.com/docs/guides/database/query-optimization

---

### 1.2 데이터에 적합한 인덱스 타입 선택

**영향도: HIGH (올바른 인덱스 타입으로 10-100배 개선)**

인덱스 타입마다 다른 쿼리 패턴에서 뛰어난 성능을 보입니다. 기본값인 B-tree가 항상 최적은 아닙니다.

**잘못된 예 (JSONB containment에 B-tree 사용):**

```sql
-- B-tree는 containment 연산자를 최적화할 수 없음
create index products_attrs_idx on products (attributes);
select * from products where attributes @> '{"color": "red"}';
-- 전체 테이블 스캔 - B-tree는 @> 연산자를 지원하지 않음
```

**올바른 예 (JSONB에 GIN 사용):**

```sql
-- GIN은 @>, ?, ?&, ?| 연산자를 지원
create index products_attrs_idx on products using gin (attributes);
select * from products where attributes @> '{"color": "red"}';
-- B-tree (기본값): =, <, >, BETWEEN, IN, IS NULL
create index users_created_idx on users (created_at);

-- GIN: 배열, JSONB, 전문 검색
create index posts_tags_idx on posts using gin (tags);

-- BRIN: 대규모 시계열 테이블 (10-100배 작음)
create index events_time_idx on events using brin (created_at);

-- Hash: 동등성 비교만 (B-tree보다 =에서 약간 빠름)
create index sessions_token_idx on sessions using hash (token);
```

인덱스 타입 가이드:

참고: https://www.postgresql.org/docs/current/indexes-types.html

---

### 1.3 다중 컬럼 쿼리를 위한 복합 인덱스 생성

**영향도: HIGH (다중 컬럼 쿼리에서 5-10배 빠름)**

여러 컬럼으로 필터링하는 쿼리의 경우, 복합 인덱스가 개별 단일 컬럼 인덱스보다 효율적입니다.

**잘못된 예 (별도 인덱스는 비트맵 스캔 필요):**

```sql
-- 두 개의 별도 인덱스
create index orders_status_idx on orders (status);
create index orders_created_idx on orders (created_at);

-- 쿼리가 두 인덱스를 조합해야 함 (느림)
select * from orders where status = 'pending' and created_at > '2024-01-01';
```

**올바른 예 (복합 인덱스):**

```sql
-- 단일 복합 인덱스 (동등성 체크를 위해 가장 왼쪽에 컬럼 배치)
create index orders_status_created_idx on orders (status, created_at);

-- 쿼리가 하나의 효율적인 인덱스 스캔 사용
select * from orders where status = 'pending' and created_at > '2024-01-01';
-- 좋음: status (=) 다음 created_at (>)
create index idx on orders (status, created_at);

-- 작동: WHERE status = 'pending'
-- 작동: WHERE status = 'pending' AND created_at > '2024-01-01'
-- 작동 안 함: WHERE created_at > '2024-01-01' (leftmost prefix 규칙)
```

**컬럼 순서가 중요** - 동등성 컬럼을 먼저, 범위 컬럼을 마지막에 배치:

참고: https://www.postgresql.org/docs/current/indexes-multicolumn.html

---

### 1.4 테이블 조회를 피하기 위한 커버링 인덱스 사용

**영향도: MEDIUM-HIGH (heap fetch를 제거하여 2-5배 빠른 쿼리)**

커버링 인덱스는 쿼리에 필요한 모든 컬럼을 포함하여, 테이블을 완전히 건너뛰는 인덱스 전용 스캔을 가능하게 합니다.

**잘못된 예 (인덱스 스캔 + heap fetch):**

```sql
create index users_email_idx on users (email);

-- 테이블 heap에서 name과 created_at을 가져와야 함
select email, name, created_at from users where email = 'user@example.com';
```

**올바른 예 (INCLUDE를 사용한 인덱스 전용 스캔):**

```sql
-- 검색하지 않는 컬럼도 인덱스에 포함
create index users_email_idx on users (email) include (name, created_at);

-- 모든 컬럼이 인덱스에서 제공되며, 테이블 접근 불필요
select email, name, created_at from users where email = 'user@example.com';
-- status로 검색하지만 customer_id와 total도 필요
create index orders_status_idx on orders (status) include (customer_id, total);

select status, customer_id, total from orders where status = 'shipped';
```

SELECT하지만 필터링하지 않는 컬럼에 INCLUDE 사용:

참고: https://www.postgresql.org/docs/current/indexes-index-only-scans.html

---

### 1.5 필터링된 쿼리를 위한 부분 인덱스 사용

**영향도: HIGH (5-20배 작은 인덱스, 더 빠른 쓰기 및 쿼리)**

부분 인덱스는 WHERE 조건과 일치하는 행만 포함하므로, 쿼리가 일관되게 동일한 조건으로 필터링할 때 더 작고 빠릅니다.

**잘못된 예 (전체 인덱스가 관련 없는 행 포함):**

```sql
-- 인덱스가 soft-deleted된 행까지 모든 행을 포함
create index users_email_idx on users (email);

-- 쿼리는 항상 활성 사용자만 필터링
select * from users where email = 'user@example.com' and deleted_at is null;
```

**올바른 예 (쿼리 필터와 일치하는 부분 인덱스):**

```sql
-- 인덱스가 활성 사용자만 포함
create index users_active_email_idx on users (email)
where deleted_at is null;

-- 쿼리가 더 작고 빠른 인덱스 사용
select * from users where email = 'user@example.com' and deleted_at is null;
-- 보류 중인 주문만 (완료되면 상태가 거의 변경되지 않음)
create index orders_pending_idx on orders (created_at)
where status = 'pending';

-- null이 아닌 값만
create index products_sku_idx on products (sku)
where sku is not null;
```

부분 인덱스의 일반적인 사용 사례:

참고: https://www.postgresql.org/docs/current/indexes-partial.html

---

## 2. 커넥션 관리

**영향도: CRITICAL**

커넥션 풀링, 제한, 서버리스 전략. 높은 동시성 또는 서버리스 배포를 사용하는 애플리케이션에 중요합니다.

### 2.1 유휴 커넥션 타임아웃 설정

**영향도: HIGH (유휴 클라이언트로부터 커넥션 슬롯의 30-50% 회수)**

유휴 커넥션은 리소스를 낭비합니다. 타임아웃을 설정하여 자동으로 회수하세요.

**잘못된 예 (커넥션이 무기한 유지됨):**

```sql
-- 타임아웃이 설정되지 않음
show idle_in_transaction_session_timeout;  -- 0 (비활성화)

-- 커넥션이 유휴 상태여도 영원히 열려 있음
select pid, state, state_change, query
from pg_stat_activity
where state = 'idle in transaction';
-- 락을 보유한 채 몇 시간 동안 유휴 상태인 트랜잭션 표시
```

**올바른 예 (유휴 커넥션 자동 정리):**

```ini
-- 30초 후 트랜잭션 중 유휴 커넥션 종료
alter system set idle_in_transaction_session_timeout = '30s';

-- 10분 후 완전히 유휴인 커넥션 종료
alter system set idle_session_timeout = '10min';

-- 설정 다시 로드
select pg_reload_conf();
# pgbouncer.ini
server_idle_timeout = 60
client_idle_timeout = 300
```

풀링된 커넥션의 경우, 풀러 레벨에서 설정:

참고: https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-IDLE-IN-TRANSACTION-SESSION-TIMEOUT

---

### 2.2 적절한 커넥션 제한 설정

**영향도: CRITICAL (데이터베이스 크래시 및 메모리 고갈 방지)**

너무 많은 커넥션은 메모리를 고갈시키고 성능을 저하시킵니다. 사용 가능한 리소스에 따라 제한을 설정하세요.

**잘못된 예 (무제한 또는 과도한 커넥션):**

```sql
-- 기본값 max_connections = 100, 하지만 종종 무분별하게 증가
show max_connections;  -- 500 (4GB RAM에는 너무 높음)

-- 각 커넥션은 1-3MB RAM 사용
-- 500 커넥션 * 2MB = 커넥션만으로 1GB!
-- 부하 시 메모리 부족 오류 발생
```

**올바른 예 (리소스 기반 계산):**

```sql
-- 공식: max_connections = (RAM(MB) / 커넥션당 5MB) - 예약
-- 4GB RAM의 경우: (4096 / 5) - 10 = ~800 이론적 최대값
-- 하지만 실제로는 쿼리 성능을 위해 100-200이 더 좋음

-- 4GB RAM에 권장되는 설정
alter system set max_connections = 100;

-- work_mem도 적절히 설정
-- work_mem * max_connections는 RAM의 25%를 초과하면 안 됨
alter system set work_mem = '8MB';  -- 8MB * 100 = 최대 800MB
select count(*), state from pg_stat_activity group by state;
```

커넥션 사용량 모니터링:

참고: https://supabase.com/docs/guides/platform/performance#connection-management

---

### 2.3 모든 애플리케이션에서 커넥션 풀링 사용

**영향도: CRITICAL (10-100배 더 많은 동시 사용자 처리)**

Postgres 커넥션은 비용이 큽니다(각각 1-3MB RAM). 풀링 없이는 애플리케이션이 부하 시 커넥션을 고갈시킵니다.

**잘못된 예 (요청당 새 커넥션):**

```sql
-- 각 요청이 새 커넥션 생성
-- 애플리케이션 코드: 요청당 db.connect()
-- 결과: 500 동시 사용자 = 500 커넥션 = 데이터베이스 크래시

-- 현재 커넥션 확인
select count(*) from pg_stat_activity;  -- 487 커넥션!
```

**올바른 예 (커넥션 풀링):**

```sql
-- 앱과 데이터베이스 사이에 PgBouncer 같은 풀러 사용
-- 애플리케이션은 풀러에 연결, 풀러는 Postgres에 작은 풀 재사용

-- pool_size 설정 기준: (CPU 코어 * 2) + spindle_count
-- 4코어 예시: pool_size = 10

-- 결과: 500 동시 사용자가 10개의 실제 커넥션 공유
select count(*) from pg_stat_activity;  -- 10 커넥션
```

풀 모드:
- **Transaction mode**: 각 트랜잭션 후 커넥션 반환 (대부분의 앱에 최적)
- **Session mode**: 전체 세션 동안 커넥션 유지 (prepared statement, 임시 테이블에 필요)

참고: https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler

---

### 2.4 풀링과 함께 Prepared Statement 올바르게 사용

**영향도: HIGH (풀링된 환경에서 prepared statement 충돌 방지)**

Prepared statement는 개별 데이터베이스 커넥션에 연결됩니다. 트랜잭션 모드 풀링에서는 커넥션이 공유되어 충돌이 발생합니다.

**잘못된 예 (트랜잭션 풀링과 함께 named prepared statement):**

```sql
-- Named prepared statement
prepare get_user as select * from users where id = $1;

-- 트랜잭션 모드 풀링에서 다음 요청은 다른 커넥션을 받을 수 있음
execute get_user(123);
-- ERROR: prepared statement "get_user" does not exist
```

**올바른 예 (unnamed statement 또는 세션 모드 사용):**

```sql
-- 옵션 1: Unnamed prepared statement 사용 (대부분의 ORM이 자동으로 수행)
-- 쿼리가 단일 프로토콜 메시지에서 준비되고 실행됨

-- 옵션 2: 트랜잭션 모드에서 사용 후 해제
prepare get_user as select * from users where id = $1;
execute get_user(123);
deallocate get_user;

-- 옵션 3: 세션 모드 풀링 사용 (포트 5432 vs 6543)
-- 전체 세션 동안 커넥션 유지, prepared statement 지속
-- 많은 드라이버가 기본적으로 prepared statement 사용
-- Node.js pg: { prepare: false }로 비활성화
-- JDBC: prepareThreshold=0로 비활성화
```

드라이버 설정 확인:

참고: https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pool-modes

---

## 3. 보안 & RLS

**영향도: CRITICAL**

Row-Level Security 정책, 권한 관리, 인증 패턴.

### 3.1 최소 권한 원칙 적용

**영향도: MEDIUM (공격 표면 감소, 더 나은 감사 추적)**

필요한 최소한의 권한만 부여하세요. 애플리케이션 쿼리에 절대 슈퍼유저를 사용하지 마세요.

**잘못된 예 (지나치게 광범위한 권한):**

```sql
-- 애플리케이션이 슈퍼유저 커넥션 사용
-- 또는 애플리케이션 role에 ALL 권한 부여
grant all privileges on all tables in schema public to app_user;
grant all privileges on all sequences in schema public to app_user;

-- 모든 SQL 인젝션이 치명적이 됨
-- drop table users; 모든 것으로 cascade
```

**올바른 예 (최소한의 특정 권한 부여):**

```sql
-- 기본 권한 없이 role 생성
create role app_readonly nologin;

-- 특정 테이블에만 SELECT 권한 부여
grant usage on schema public to app_readonly;
grant select on public.products, public.categories to app_readonly;

-- 제한된 범위로 쓰기 role 생성
create role app_writer nologin;
grant usage on schema public to app_writer;
grant select, insert, update on public.orders to app_writer;
grant usage on sequence orders_id_seq to app_writer;
-- DELETE 권한 없음

-- 로그인 role이 이들로부터 상속
create role app_user login password 'xxx';
grant app_writer to app_user;
-- 기본 public 액세스 취소
revoke all on schema public from public;
revoke all on all tables in schema public from public;
```

기본 public 권한 취소:

참고: https://supabase.com/blog/postgres-roles-and-privileges

---

### 3.2 멀티 테넌트 데이터에 Row Level Security 활성화

**영향도: CRITICAL (데이터베이스 강제 테넌트 격리, 데이터 유출 방지)**

Row Level Security (RLS)는 데이터베이스 레벨에서 데이터 액세스를 강제하여, 사용자가 자신의 데이터만 볼 수 있도록 보장합니다.

**잘못된 예 (애플리케이션 레벨 필터링만):**

```sql
-- 애플리케이션만 필터링에 의존
select * from orders where user_id = $current_user_id;

-- 버그 또는 우회는 모든 데이터가 노출됨을 의미!
select * from orders;  -- 모든 주문 반환
```

**올바른 예 (데이터베이스 강제 RLS):**

```sql
-- 테이블에서 RLS 활성화
alter table orders enable row level security;

-- 사용자가 자신의 주문만 볼 수 있도록 정책 생성
create policy orders_user_policy on orders
  for all
  using (user_id = current_setting('app.current_user_id')::bigint);

-- 테이블 소유자에게도 RLS 강제
alter table orders force row level security;

-- 사용자 컨텍스트 설정 및 쿼리
set app.current_user_id = '123';
select * from orders;  -- 사용자 123의 주문만 반환
create policy orders_user_policy on orders
  for all
  to authenticated
  using (user_id = auth.uid());
```

authenticated role을 위한 정책:

참고: https://supabase.com/docs/guides/database/postgres/row-level-security

---

### 3.3 성능을 위한 RLS 정책 최적화

**영향도: HIGH (적절한 패턴으로 5-10배 빠른 RLS 쿼리)**

잘못 작성된 RLS 정책은 심각한 성능 문제를 일으킬 수 있습니다. 서브쿼리와 인덱스를 전략적으로 사용하세요.

**잘못된 예 (모든 행마다 함수 호출):**

```sql
create policy orders_policy on orders
  using (auth.uid() = user_id);  -- auth.uid()가 행마다 호출됨!

-- 100만 행이면, auth.uid()가 100만 번 호출됨
```

**올바른 예 (SELECT로 함수 래핑):**

```sql
create policy orders_policy on orders
  using ((select auth.uid()) = user_id);  -- 한 번만 호출되고 캐시됨

-- 대규모 테이블에서 100배+ 빠름
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

-- 정책에서 사용 (인덱스 조회, 행별 체크 아님)
create policy team_orders_policy on orders
  using ((select is_team_member(team_id)));
create index orders_user_id_idx on orders (user_id);
```

복잡한 체크를 위한 security definer 함수 사용:
RLS 정책에 사용되는 컬럼에 항상 인덱스 추가:

참고: https://supabase.com/docs/guides/database/postgres/row-level-security#rls-performance-recommendations

---

## 4. 스키마 설계

**영향도: HIGH**

테이블 설계, 인덱스 전략, 파티셔닝, 데이터 타입 선택. 장기적인 성능의 기반.

### 4.1 적절한 데이터 타입 선택

**영향도: HIGH (50% 스토리지 감소, 더 빠른 비교)**

올바른 데이터 타입을 사용하면 스토리지가 줄고, 쿼리 성능이 향상되며, 버그가 방지됩니다.

**잘못된 예 (잘못된 데이터 타입):**

```sql
create table users (
  id int,                    -- 21억에서 오버플로우
  email varchar(255),        -- 불필요한 길이 제한
  created_at timestamp,      -- 타임존 정보 누락
  is_active varchar(5),      -- boolean에 문자열 사용
  price varchar(20)          -- numeric에 문자열 사용
);
```

**올바른 예 (적절한 데이터 타입):**

```sql
create table users (
  id bigint generated always as identity primary key,  -- 최대 9 quintillion
  email text,                     -- 인위적인 제한 없음, varchar와 동일한 성능
  created_at timestamptz,         -- 항상 타임존 인식 timestamp 저장
  is_active boolean default true, -- 1바이트 vs 가변 문자열 길이
  price numeric(10,2)             -- 정확한 십진 연산
);
-- ID: int가 아닌 bigint 사용 (미래 대비)
-- 문자열: 제약 조건이 필요하지 않으면 varchar(n)가 아닌 text 사용
-- 시간: timestamp가 아닌 timestamptz 사용
-- 금액: float이 아닌 numeric 사용 (정밀도 중요)
-- Enum: check constraint와 함께 text 사용 또는 enum 타입 생성
```

주요 가이드라인:

참고: https://www.postgresql.org/docs/current/datatype.html

---

### 4.2 외래 키 컬럼 인덱싱

**영향도: HIGH (10-100배 빠른 JOIN 및 CASCADE 작업)**

Postgres는 외래 키 컬럼을 자동으로 인덱싱하지 않습니다. 누락된 인덱스는 느린 JOIN과 CASCADE 작업을 유발합니다.

**잘못된 예 (인덱스 없는 외래 키):**

```sql
create table orders (
  id bigint generated always as identity primary key,
  customer_id bigint references customers(id) on delete cascade,
  total numeric(10,2)
);

-- customer_id에 인덱스 없음!
-- JOIN과 ON DELETE CASCADE 모두 전체 테이블 스캔 필요
select * from orders where customer_id = 123;  -- Seq Scan
delete from customers where id = 123;          -- 테이블 잠금, 모든 주문 스캔
```

**올바른 예 (인덱스된 외래 키):**

```sql
create table orders (
  id bigint generated always as identity primary key,
  customer_id bigint references customers(id) on delete cascade,
  total numeric(10,2)
);

-- 항상 FK 컬럼 인덱싱
create index orders_customer_id_idx on orders (customer_id);

-- 이제 JOIN과 cascade가 빠름
select * from orders where customer_id = 123;  -- Index Scan
delete from customers where id = 123;          -- 인덱스 사용, 빠른 cascade
select
  conrelid::regclass as table_name,
  a.attname as fk_column
from pg_constraint c
join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any(c.conkey)
where c.contype = 'f'
  and not exists (
    select 1 from pg_index i
    where i.indrelid = c.conrelid and a.attnum = any(i.indkey)
  );
```

누락된 FK 인덱스 찾기:

참고: https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK

---

### 4.3 더 나은 성능을 위한 대규모 테이블 파티셔닝

**영향도: MEDIUM-HIGH (대규모 테이블에서 5-20배 빠른 쿼리 및 유지보수)**

파티셔닝은 대규모 테이블을 더 작은 조각으로 분할하여, 쿼리 성능과 유지보수 작업을 개선합니다.

**잘못된 예 (단일 대규모 테이블):**

```sql
create table events (
  id bigint generated always as identity,
  created_at timestamptz,
  data jsonb
);

-- 5억 행, 쿼리가 모든 것을 스캔
select * from events where created_at > '2024-01-01';  -- 느림
vacuum events;  -- 몇 시간 소요, 테이블 잠금
```

**올바른 예 (시간 범위로 파티셔닝):**

```sql
create table events (
  id bigint generated always as identity,
  created_at timestamptz not null,
  data jsonb
) partition by range (created_at);

-- 각 월별로 파티션 생성
create table events_2024_01 partition of events
  for values from ('2024-01-01') to ('2024-02-01');

create table events_2024_02 partition of events
  for values from ('2024-02-01') to ('2024-03-01');

-- 쿼리가 관련 파티션만 스캔
select * from events where created_at > '2024-01-15';  -- events_2024_01+만 스캔

-- 오래된 데이터 즉시 삭제
drop table events_2023_01;  -- 즉시 vs 몇 시간 걸리는 DELETE
```

파티셔닝해야 할 때:
- 1억 행 이상의 테이블
- 날짜 기반 쿼리가 있는 시계열 데이터
- 오래된 데이터를 효율적으로 삭제해야 할 때

참고: https://www.postgresql.org/docs/current/ddl-partitioning.html

---

### 4.4 최적의 기본 키 전략 선택

**영향도: HIGH (더 나은 인덱스 지역성, 단편화 감소)**

기본 키 선택은 삽입 성능, 인덱스 크기, 복제 효율성에 영향을 줍니다.

**잘못된 예 (문제가 있는 PK 선택):**

```sql
-- identity가 SQL 표준 접근 방식
create table users (
  id serial primary key  -- 작동하지만 IDENTITY 권장
);

-- 랜덤 UUID (v4)는 인덱스 단편화 유발
create table orders (
  id uuid default gen_random_uuid() primary key  -- UUIDv4 = 랜덤 = 분산된 삽입
);
```

**올바른 예 (최적의 PK 전략):**

```sql
-- 순차 ID를 위한 IDENTITY 사용 (SQL 표준, 대부분의 경우 최적)
create table users (
  id bigint generated always as identity primary key
);

-- UUID가 필요한 분산 시스템의 경우, UUIDv7 사용 (시간 순서)
-- pg_uuidv7 확장 필요: create extension pg_uuidv7;
create table orders (
  id uuid default uuid_generate_v7() primary key  -- 시간 순서, 단편화 없음
);

-- 대안: 정렬 가능한 분산 ID를 위한 시간 접두사 ID (확장 불필요)
create table events (
  id text default concat(
    to_char(now() at time zone 'utc', 'YYYYMMDDHH24MISSMS'),
    gen_random_uuid()::text
  ) primary key
);
```

가이드라인:
- 단일 데이터베이스: `bigint identity` (순차, 8바이트, SQL 표준)
- 분산/노출된 ID: UUIDv7 (pg_uuidv7 필요) 또는 ULID (시간 순서, 단편화 없음)
- `serial`도 작동하지만 `identity`가 SQL 표준이며 새 애플리케이션에 권장됨
- 대규모 테이블의 기본 키로 랜덤 UUID (v4) 사용 피하기 (인덱스 단편화 유발)
[Identity Columns](https://www.postgresql.org/docs/current/sql-createtable.html#SQL-CREATETABLE-PARMS-GENERATED-IDENTITY)

---

### 4.5 호환성을 위한 소문자 식별자 사용

**영향도: MEDIUM (도구, ORM, AI 어시스턴트와의 대소문자 구분 버그 방지)**

PostgreSQL은 따옴표 없는 식별자를 소문자로 변환합니다. 따옴표로 묶인 대소문자 혼용 식별자는 항상 따옴표가 필요하며, 도구, ORM, AI 어시스턴트가 인식하지 못할 수 있습니다.

**잘못된 예 (대소문자 혼용 식별자):**

```sql
-- 따옴표로 묶인 식별자는 대소문자를 유지하지만 항상 따옴표 필요
CREATE TABLE "Users" (
  "userId" bigint PRIMARY KEY,
  "firstName" text,
  "lastName" text
);

-- 항상 따옴표를 사용해야 하며 그렇지 않으면 쿼리 실패
SELECT "firstName" FROM "Users" WHERE "userId" = 1;

-- 실패 - Users가 따옴표 없이 users가 됨
SELECT firstName FROM Users;
-- ERROR: relation "users" does not exist
```

**올바른 예 (소문자 snake_case):**

```sql
-- 따옴표 없는 소문자 식별자는 이식 가능하고 도구 친화적
CREATE TABLE users (
  user_id bigint PRIMARY KEY,
  first_name text,
  last_name text
);

-- 따옴표 없이 작동, 모든 도구가 인식
SELECT first_name FROM users WHERE user_id = 1;
-- ORM은 종종 따옴표로 묶인 camelCase 생성 - snake_case 사용하도록 설정
-- 다른 데이터베이스에서 마이그레이션은 원래 대소문자를 유지할 수 있음
-- 일부 GUI 도구는 기본적으로 식별자를 따옴표로 묶음 - 비활성화

-- 대소문자 혼용이 고정된 경우, 호환성 레이어로 뷰 생성
CREATE VIEW users AS SELECT "userId" AS user_id, "firstName" AS first_name FROM "Users";
```

대소문자 혼용 식별자의 일반적인 출처:

참고: https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS

---

## 5. 동시성 & 락킹

**영향도: MEDIUM-HIGH**

트랜잭션 관리, 격리 수준, 데드락 방지, 락 경합 패턴.

### 5.1 락 경합을 줄이기 위해 트랜잭션을 짧게 유지

**영향도: MEDIUM-HIGH (3-5배 처리량 개선, 데드락 감소)**

장시간 실행되는 트랜잭션은 다른 쿼리를 차단하는 락을 보유합니다. 트랜잭션을 가능한 짧게 유지하세요.

**잘못된 예 (외부 호출이 있는 긴 트랜잭션):**

```sql
begin;
select * from orders where id = 1 for update;  -- 락 획득

-- 애플리케이션이 결제 API에 HTTP 호출 (2-5초)
-- 이 행에 대한 다른 쿼리가 차단됨!

update orders set status = 'paid' where id = 1;
commit;  -- 전체 기간 동안 락 유지
```

**올바른 예 (최소한의 트랜잭션 범위):**

```sql
-- 트랜잭션 외부에서 데이터 유효성 검사 및 API 호출
-- 애플리케이션: response = await paymentAPI.charge(...)

-- 실제 업데이트에만 락 보유
begin;
update orders
set status = 'paid', payment_id = $1
where id = $2 and status = 'pending'
returning *;
commit;  -- 밀리초 동안만 락 유지
-- 30초 이상 실행되는 쿼리 중단
set statement_timeout = '30s';

-- 또는 세션별로
set local statement_timeout = '5s';
```

폭주 트랜잭션을 방지하기 위해 `statement_timeout` 사용:

참고: https://www.postgresql.org/docs/current/tutorial-transactions.html

---

### 5.2 일관된 락 순서로 데드락 방지

**영향도: MEDIUM-HIGH (데드락 오류 제거, 신뢰성 향상)**

데드락은 트랜잭션이 다른 순서로 리소스를 잠글 때 발생합니다. 항상 일관된 순서로 락을 획득하세요.

**잘못된 예 (일관되지 않은 락 순서):**

```sql
-- 트랜잭션 A                      -- 트랜잭션 B
begin;                              begin;
update accounts                     update accounts
set balance = balance - 100         set balance = balance - 50
where id = 1;                       where id = 2;  -- B가 행 2 잠금

update accounts                     update accounts
set balance = balance + 100         set balance = balance + 50
where id = 2;  -- A가 B를 대기     where id = 1;  -- B가 A를 대기

-- 데드락! 서로 대기 중
```

**올바른 예 (업데이트하기 전에 일관된 순서로 행 잠금):**

```sql
-- 업데이트하기 전에 ID 순서로 명시적으로 락 획득
begin;
select * from accounts where id in (1, 2) order by id for update;

-- 이제 어떤 순서로든 업데이트 수행 - 락은 이미 보유
update accounts set balance = balance - 100 where id = 1;
update accounts set balance = balance + 100 where id = 2;
commit;
-- 단일 문으로 모든 락을 원자적으로 획득
begin;
update accounts
set balance = balance + case id
  when 1 then -100
  when 2 then 100
end
where id in (1, 2);
commit;
-- 최근 데드락 확인
select * from pg_stat_database where deadlocks > 0;

-- 데드락 로깅 활성화
set log_lock_waits = on;
set deadlock_timeout = '1s';
```

대안: 원자적으로 업데이트하는 단일 문 사용:
로그에서 데드락 감지:
[Deadlocks](https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-DEADLOCKS)

---

### 5.3 애플리케이션 레벨 락킹을 위한 Advisory Lock 사용

**영향도: MEDIUM (행 레벨 락 오버헤드 없이 효율적인 조정)**

Advisory lock은 데이터베이스 행을 잠글 필요 없이 애플리케이션 레벨 조정을 제공합니다.

**잘못된 예 (락킹을 위한 더미 행 생성):**

```sql
-- 잠금을 위한 더미 행 생성
create table resource_locks (
  resource_name text primary key
);

insert into resource_locks values ('report_generator');

-- 행을 선택하여 잠금
select * from resource_locks where resource_name = 'report_generator' for update;
```

**올바른 예 (advisory lock):**

```sql
-- 세션 레벨 advisory lock (연결 해제 또는 unlock 시 해제)
select pg_advisory_lock(hashtext('report_generator'));
-- ... 독점 작업 수행 ...
select pg_advisory_unlock(hashtext('report_generator'));

-- 트랜잭션 레벨 락 (commit/rollback 시 해제)
begin;
select pg_advisory_xact_lock(hashtext('daily_report'));
-- ... 작업 수행 ...
commit;  -- 락 자동 해제
-- 대기하는 대신 즉시 true/false 반환
select pg_try_advisory_lock(hashtext('resource_name'));

-- 애플리케이션에서 사용
if (acquired) {
  -- 작업 수행
  select pg_advisory_unlock(hashtext('resource_name'));
} else {
  -- 건너뛰거나 나중에 재시도
}
```

논블로킹 작업을 위한 try-lock:

참고: https://www.postgresql.org/docs/current/explicit-locking.html#ADVISORY-LOCKS

---

### 5.4 논블로킹 큐 처리를 위한 SKIP LOCKED 사용

**영향도: MEDIUM-HIGH (워커 큐에서 10배 처리량)**

여러 워커가 큐를 처리할 때, SKIP LOCKED는 워커가 대기 없이 다른 행을 처리할 수 있게 합니다.

**잘못된 예 (워커끼리 서로 차단):**

```sql
-- 워커 1과 워커 2가 모두 다음 작업을 가져오려고 시도
begin;
select * from jobs where status = 'pending' order by created_at limit 1 for update;
-- 워커 2가 워커 1의 락 해제를 대기!
```

**올바른 예 (병렬 처리를 위한 SKIP LOCKED):**

```sql
-- 각 워커가 잠긴 행을 건너뛰고 다음 사용 가능한 행을 가져옴
begin;
select * from jobs
where status = 'pending'
order by created_at
limit 1
for update skip locked;

-- 워커 1이 작업 1을 가져오고, 워커 2가 작업 2를 가져옴 (대기 없음)

update jobs set status = 'processing' where id = $1;
commit;
-- 하나의 문으로 원자적 claim-and-update
update jobs
set status = 'processing', worker_id = $1, started_at = now()
where id = (
  select id from jobs
  where status = 'pending'
  order by created_at
  limit 1
  for update skip locked
)
returning *;
```

완전한 큐 패턴:

참고: https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE

---

## 6. 데이터 접근 패턴

**영향도: MEDIUM**

N+1 쿼리 제거, 배치 작업, 커서 기반 페이지네이션, 효율적인 데이터 가져오기.

### 6.1 대량 데이터를 위한 INSERT 문 배치 처리

**영향도: MEDIUM (10-50배 빠른 대량 삽입)**

개별 INSERT 문은 오버헤드가 큽니다. 단일 문에서 여러 행을 배치하거나 COPY를 사용하세요.

**잘못된 예 (개별 삽입):**

```sql
-- 각 삽입은 별도의 트랜잭션과 왕복
insert into events (user_id, action) values (1, 'click');
insert into events (user_id, action) values (1, 'view');
insert into events (user_id, action) values (2, 'click');
-- ... 1000개의 추가 개별 삽입

-- 1000 삽입 = 1000 왕복 = 느림
```

**올바른 예 (배치 삽입):**

```sql
-- 단일 문에 여러 행
insert into events (user_id, action) values
  (1, 'click'),
  (1, 'view'),
  (2, 'click'),
  -- ... 배치당 최대 ~1000행
  (999, 'view');

-- 1000행에 대해 한 번의 왕복
-- COPY는 대량 로드에 가장 빠름
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

대량 가져오기의 경우 COPY 사용:

참고: https://www.postgresql.org/docs/current/sql-copy.html

---

### 6.2 배치 로딩으로 N+1 쿼리 제거

**영향도: MEDIUM-HIGH (10-100배 적은 데이터베이스 왕복)**

N+1 쿼리는 루프에서 항목당 하나의 쿼리를 실행합니다. 배열 또는 JOIN을 사용하여 단일 쿼리로 배치하세요.

**잘못된 예 (N+1 쿼리):**

```sql
-- 첫 번째 쿼리: 모든 사용자 가져오기
select id from users where active = true;  -- 100개의 ID 반환

-- 그런 다음 N개의 쿼리, 사용자당 하나씩
select * from orders where user_id = 1;
select * from orders where user_id = 2;
select * from orders where user_id = 3;
-- ... 97개의 추가 쿼리!

-- 총: 101번의 데이터베이스 왕복
```

**올바른 예 (단일 배치 쿼리):**

```sql
-- ID를 수집하고 ANY로 한 번 쿼리
select * from orders where user_id = any(array[1, 2, 3, ...]);

-- 또는 루프 대신 JOIN 사용
select u.id, u.name, o.*
from users u
left join orders o on o.user_id = u.id
where u.active = true;

-- 총: 1번의 왕복
-- 애플리케이션 코드에서 루프하는 대신:
-- for user in users: db.query("SELECT * FROM orders WHERE user_id = $1", user.id)

-- 배열 파라미터 전달:
select * from orders where user_id = any($1::bigint[]);
-- 애플리케이션이 전달: [1, 2, 3, 4, 5, ...]
```

애플리케이션 패턴:

참고: https://supabase.com/docs/guides/database/query-optimization

---

### 6.3 OFFSET 대신 커서 기반 페이지네이션 사용

**영향도: MEDIUM-HIGH (페이지 깊이와 관계없이 일관된 O(1) 성능)**

OFFSET 기반 페이지네이션은 건너뛴 모든 행을 스캔하여, 더 깊은 페이지에서 느려집니다. 커서 페이지네이션은 O(1)입니다.

**잘못된 예 (OFFSET 페이지네이션):**

```sql
-- 페이지 1: 20행 스캔
select * from products order by id limit 20 offset 0;

-- 페이지 100: 1980행을 건너뛰기 위해 2000행 스캔
select * from products order by id limit 20 offset 1980;

-- 페이지 10000: 200,000행 스캔!
select * from products order by id limit 20 offset 199980;
```

**올바른 예 (커서/keyset 페이지네이션):**

```sql
-- 페이지 1: 처음 20개 가져오기
select * from products order by id limit 20;
-- 애플리케이션이 last_id = 20 저장

-- 페이지 2: 마지막 ID 다음부터 시작
select * from products where id > 20 order by id limit 20;
-- 인덱스 사용, 페이지 깊이와 관계없이 항상 빠름

-- 페이지 10000: 페이지 1과 동일한 속도
select * from products where id > 199980 order by id limit 20;
-- 커서는 모든 정렬 컬럼을 포함해야 함
select * from products
where (created_at, id) > ('2024-01-15 10:00:00', 12345)
order by created_at, id
limit 20;
```

다중 컬럼 정렬의 경우:

참고: https://supabase.com/docs/guides/database/pagination

---

### 6.4 Insert-or-Update 작업에 UPSERT 사용

**영향도: MEDIUM (원자적 작업, 경쟁 조건 제거)**

별도의 SELECT-then-INSERT/UPDATE 사용은 경쟁 조건을 생성합니다. 원자적 upsert를 위해 INSERT ... ON CONFLICT를 사용하세요.

**잘못된 예 (check-then-insert 경쟁 조건):**

```sql
-- 경쟁 조건: 두 요청이 동시에 확인
select * from settings where user_id = 123 and key = 'theme';
-- 둘 다 아무것도 찾지 못함

-- 둘 다 삽입 시도
insert into settings (user_id, key, value) values (123, 'theme', 'dark');
-- 하나는 성공, 하나는 중복 키 오류로 실패!
```

**올바른 예 (원자적 UPSERT):**

```sql
-- 단일 원자적 작업
insert into settings (user_id, key, value)
values (123, 'theme', 'dark')
on conflict (user_id, key)
do update set value = excluded.value, updated_at = now();

-- 삽입/업데이트된 행 반환
insert into settings (user_id, key, value)
values (123, 'theme', 'dark')
on conflict (user_id, key)
do update set value = excluded.value
returning *;
-- 존재하지 않는 경우에만 삽입 (업데이트 없음)
insert into page_views (page_id, user_id)
values (1, 123)
on conflict (page_id, user_id) do nothing;
```

Insert-or-ignore 패턴:

참고: https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT

---

## 7. 모니터링 & 진단

**영향도: LOW-MEDIUM**

pg_stat_statements, EXPLAIN ANALYZE, 메트릭 수집, 성능 진단 사용.

### 7.1 쿼리 분석을 위한 pg_stat_statements 활성화

**영향도: LOW-MEDIUM (상위 리소스 소비 쿼리 식별)**

pg_stat_statements는 모든 쿼리의 실행 통계를 추적하여, 느리고 빈번한 쿼리를 식별하는 데 도움을 줍니다.

**잘못된 예 (쿼리 패턴에 대한 가시성 없음):**

```sql
-- 데이터베이스가 느리지만, 어떤 쿼리가 문제인지?
-- pg_stat_statements 없이는 알 수 없음
```

**올바른 예 (pg_stat_statements 활성화 및 쿼리):**

```sql
-- 확장 기능 활성화
create extension if not exists pg_stat_statements;

-- 총 시간으로 가장 느린 쿼리 찾기
select
  calls,
  round(total_exec_time::numeric, 2) as total_time_ms,
  round(mean_exec_time::numeric, 2) as mean_time_ms,
  query
from pg_stat_statements
order by total_exec_time desc
limit 10;

-- 가장 빈번한 쿼리 찾기
select calls, query
from pg_stat_statements
order by calls desc
limit 10;

-- 최적화 후 통계 재설정
select pg_stat_statements_reset();
-- 평균 시간이 높은 쿼리 (최적화 후보)
select query, mean_exec_time, calls
from pg_stat_statements
where mean_exec_time > 100  -- > 100ms 평균
order by mean_exec_time desc;
```

모니터링할 주요 메트릭:

참고: https://supabase.com/docs/guides/database/extensions/pg_stat_statements

---

### 7.2 VACUUM 및 ANALYZE로 테이블 통계 유지

**영향도: MEDIUM (정확한 통계로 2-10배 더 나은 쿼리 플랜)**

오래된 통계는 쿼리 플래너가 잘못된 결정을 내리게 합니다. VACUUM은 공간을 회수하고, ANALYZE는 통계를 업데이트합니다.

**잘못된 예 (오래된 통계):**

```sql
-- 테이블에 100만 행이 있지만 통계는 1000행이라고 말함
-- 쿼리 플래너가 잘못된 전략 선택
explain select * from orders where status = 'pending';
-- 표시: Seq Scan (통계가 작은 테이블로 표시하기 때문)
-- 실제: Index Scan이 훨씬 빠름
```

**올바른 예 (새로운 통계 유지):**

```sql
-- 대량의 데이터 변경 후 수동으로 분석
analyze orders;

-- WHERE 절에 사용되는 특정 컬럼 분석
analyze orders (status, created_at);

-- 테이블이 마지막으로 분석된 시점 확인
select
  relname,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze
from pg_stat_user_tables
order by last_analyze nulls first;
-- 높은 churn 테이블의 빈도 증가
alter table orders set (
  autovacuum_vacuum_scale_factor = 0.05,     -- 5% dead tuple에서 Vacuum (기본값 20%)
  autovacuum_analyze_scale_factor = 0.02     -- 2% 변경에서 Analyze (기본값 10%)
);

-- autovacuum 상태 확인
select * from pg_stat_progress_vacuum;
```

사용량이 많은 테이블을 위한 Autovacuum 튜닝:

참고: https://supabase.com/docs/guides/database/database-size#vacuum-operations

---

### 7.3 느린 쿼리 진단을 위한 EXPLAIN ANALYZE 사용

**영향도: LOW-MEDIUM (쿼리 실행의 정확한 병목 지점 식별)**

EXPLAIN ANALYZE는 쿼리를 실행하고 실제 타이밍을 보여주어, 진정한 성능 병목 지점을 드러냅니다.

**잘못된 예 (성능 문제를 추측):**

```sql
-- 쿼리가 느리지만, 왜?
select * from orders where customer_id = 123 and status = 'pending';
-- "인덱스가 누락된 것이 틀림없어" - 하지만 어떤 것?
```

**올바른 예 (EXPLAIN ANALYZE 사용):**

```sql
explain (analyze, buffers, format text)
select * from orders where customer_id = 123 and status = 'pending';

-- 출력이 문제를 드러냄:
-- Seq Scan on orders (cost=0.00..25000.00 rows=50 width=100) (actual time=0.015..450.123 rows=50 loops=1)
--   Filter: ((customer_id = 123) AND (status = 'pending'::text))
--   Rows Removed by Filter: 999950
--   Buffers: shared hit=5000 read=15000
-- Planning Time: 0.150 ms
-- Execution Time: 450.500 ms
-- 대규모 테이블에서 Seq Scan = 누락된 인덱스
-- Rows Removed by Filter = 낮은 선택성 또는 누락된 인덱스
-- Buffers: read >> hit = 데이터가 캐시되지 않음, 더 많은 메모리 필요
-- 높은 loop의 Nested Loop = 다른 조인 전략 고려
-- Sort Method: external merge = work_mem 너무 낮음
```

찾아야 할 주요 사항:

참고: https://supabase.com/docs/guides/database/inspect

---

## 8. 고급 기능

**영향도: LOW**

전문 검색, JSONB 최적화, PostGIS, 확장 기능, 고급 Postgres 기능.

### 8.1 효율적인 쿼리를 위한 JSONB 컬럼 인덱싱

**영향도: MEDIUM (적절한 인덱싱으로 10-100배 빠른 JSONB 쿼리)**

인덱스 없는 JSONB 쿼리는 전체 테이블을 스캔합니다. containment 쿼리를 위해 GIN 인덱스를 사용하세요.

**잘못된 예 (JSONB에 인덱스 없음):**

```sql
create table products (
  id bigint primary key,
  attributes jsonb
);

-- 모든 쿼리에서 전체 테이블 스캔
select * from products where attributes @> '{"color": "red"}';
select * from products where attributes->>'brand' = 'Nike';
```

**올바른 예 (JSONB를 위한 GIN 인덱스):**

```sql
-- containment 연산자 (@>, ?, ?&, ?|)를 위한 GIN 인덱스
create index products_attrs_gin on products using gin (attributes);

-- 이제 containment 쿼리가 인덱스 사용
select * from products where attributes @> '{"color": "red"}';

-- 특정 키 조회를 위해 표현식 인덱스 사용
create index products_brand_idx on products ((attributes->>'brand'));
select * from products where attributes->>'brand' = 'Nike';
-- jsonb_ops (기본값): 모든 연산자 지원, 더 큰 인덱스
create index idx1 on products using gin (attributes);

-- jsonb_path_ops: @> 연산자만, 하지만 2-3배 작은 인덱스
create index idx2 on products using gin (attributes jsonb_path_ops);
```

올바른 연산자 클래스 선택:

참고: https://www.postgresql.org/docs/current/datatype-json.html#JSON-INDEXING

---

### 8.2 전문 검색을 위한 tsvector 사용

**영향도: MEDIUM (LIKE보다 100배 빠르며, 랭킹 지원)**

와일드카드가 있는 LIKE는 인덱스를 사용할 수 없습니다. tsvector를 사용한 전문 검색은 훨씬 빠릅니다.

**잘못된 예 (LIKE 패턴 매칭):**

```sql
-- 인덱스를 사용할 수 없고, 모든 행 스캔
select * from articles where content like '%postgresql%';

-- 대소문자 구분 없음은 더 나쁨
select * from articles where lower(content) like '%postgresql%';
```

**올바른 예 (tsvector를 사용한 전문 검색):**

```sql
-- tsvector 컬럼과 인덱스 추가
alter table articles add column search_vector tsvector
  generated always as (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,''))) stored;

create index articles_search_idx on articles using gin (search_vector);

-- 빠른 전문 검색
select * from articles
where search_vector @@ to_tsquery('english', 'postgresql & performance');

-- 랭킹과 함께
select *, ts_rank(search_vector, query) as rank
from articles, to_tsquery('english', 'postgresql') query
where search_vector @@ query
order by rank desc;
-- AND: 두 용어 모두 필요
to_tsquery('postgresql & performance')

-- OR: 둘 중 하나
to_tsquery('postgresql | mysql')

-- 접두사 매칭
to_tsquery('post:*')
```

여러 용어 검색:

참고: https://supabase.com/docs/guides/database/full-text-search

---

## 참고 자료

- https://www.postgresql.org/docs/current/
- https://supabase.com/docs
- https://wiki.postgresql.org/wiki/Performance_Optimization
- https://supabase.com/docs/guides/database/overview
- https://supabase.com/docs/guides/auth/row-level-security
