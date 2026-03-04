# Postgres 규칙 작성 가이드라인

이 문서는 AI 에이전트 및 LLM과 잘 작동하는 효과적인 Postgres 모범 사례 규칙을 작성하기 위한 가이드라인을 제공합니다.

## 핵심 원칙

### 1. 구체적인 변환 패턴

정확한 SQL 재작성을 보여주세요. 철학적인 조언은 피하세요.

**좋음:** "`WHERE id IN (SELECT ...)` 대신 `WHERE id = ANY(ARRAY[...])`를 사용"
**나쁨:** "좋은 스키마 설계하기"

### 2. 에러 우선 구조

항상 문제가 있는 패턴을 먼저 보여주고, 그 다음 해결책을 보여주세요. 이는 에이전트가 안티 패턴을 인식하도록 훈련시킵니다.

```markdown
**잘못된 예 (순차 쿼리):** [나쁜 예제]

**올바른 예 (배치 쿼리):** [좋은 예제]
```

### 3. 정량화된 영향도

구체적인 메트릭을 포함하세요. 에이전트가 수정 사항의 우선순위를 정하는 데 도움이 됩니다.

**좋음:** "10배 빠른 쿼리", "50% 작은 인덱스", "N+1 제거"
**나쁨:** "더 빠름", "더 좋음", "더 효율적"

### 4. 자체 완결적인 예제

예제는 완전하고 실행 가능해야 합니다(또는 그에 가까워야 함). 컨텍스트가 필요한 경우 `CREATE TABLE`을 포함하세요.

```sql
-- 명확성을 위해 필요할 때 테이블 정의 포함
CREATE TABLE users (
  id bigint PRIMARY KEY,
  email text NOT NULL,
  deleted_at timestamptz
);

-- 이제 인덱스를 보여줌
CREATE INDEX users_active_email_idx ON users(email) WHERE deleted_at IS NULL;
```

### 5. 의미론적 네이밍

의미 있는 테이블/컬럼 이름을 사용하세요. 이름은 LLM에 의도를 전달합니다.

**좋음:** `users`, `email`, `created_at`, `is_active`
**나쁨:** `table1`, `col1`, `field`, `flag`

---

## 코드 예제 표준

### SQL 포맷팅

```sql
-- 소문자 키워드 사용, 명확한 포맷팅
CREATE INDEX CONCURRENTLY users_email_idx
  ON users(email)
  WHERE deleted_at IS NULL;

-- 압축되거나 모두 대문자로 작성하지 말 것
CREATE INDEX CONCURRENTLY USERS_EMAIL_IDX ON USERS(EMAIL) WHERE DELETED_AT IS NULL;
```

### 주석

- _무엇을_이 아닌 _왜_를 설명
- 성능 영향 강조
- 흔한 함정 지적

### 언어 태그

- `sql` - 표준 SQL 쿼리
- `plpgsql` - 저장 프로시저/함수
- `typescript` - 애플리케이션 코드 (필요시)
- `python` - 애플리케이션 코드 (필요시)

---

## 애플리케이션 코드를 포함해야 하는 경우

**기본: SQL만**

대부분의 규칙은 순수한 SQL 패턴에 집중해야 합니다. 이렇게 하면 예제를 이식 가능하게 유지할 수 있습니다.

**다음과 같은 경우 애플리케이션 코드 포함:**

- 커넥션 풀링 설정
- 애플리케이션 컨텍스트에서의 트랜잭션 관리
- ORM 안티 패턴 (Prisma/TypeORM에서의 N+1)
- Prepared statement 사용

**혼합 예제 포맷:**

````markdown
**잘못된 예 (애플리케이션에서 N+1):**

```typescript
for (const user of users) {
  const posts = await db.query("SELECT * FROM posts WHERE user_id = $1", [
    user.id,
  ]);
}
```
````

**올바른 예 (배치 쿼리):**

```typescript
const posts = await db.query("SELECT * FROM posts WHERE user_id = ANY($1)", [
  userIds,
]);
```

---

## 영향도 레벨 가이드라인

| 레벨 | 개선도 | 사용 시점 |
|-------|-------------|----------|
| **CRITICAL** | 10-100배 | 누락된 인덱스, 커넥션 고갈, 대규모 테이블의 순차 스캔 |
| **HIGH** | 5-20배 | 잘못된 인덱스 타입, 잘못된 파티셔닝, 누락된 커버링 인덱스 |
| **MEDIUM-HIGH** | 2-5배 | N+1 쿼리, 비효율적인 페이지네이션, RLS 최적화 |
| **MEDIUM** | 1.5-3배 | 중복 인덱스, 쿼리 플랜 불안정성 |
| **LOW-MEDIUM** | 1.2-2배 | VACUUM 튜닝, 설정 조정 |
| **LOW** | 점진적 | 고급 패턴, 엣지 케이스 |

---

## 참고 자료 표준

**주요 출처:**

- 공식 Postgres 문서
- Supabase 문서
- Postgres 위키
- 확립된 블로그 (2ndQuadrant, Crunchy Data)

**포맷:**

```markdown
참고:
[Postgres 인덱스](https://www.postgresql.org/docs/current/indexes.html)
```

---

## 검토 체크리스트

규칙 제출 전:

- [ ] 제목이 명확하고 행동 지향적임
- [ ] 영향도 레벨이 성능 향상과 일치함
- [ ] impactDescription에 정량화가 포함됨
- [ ] 설명이 간결함 (1-2문장)
- [ ] 최소 1개의 **잘못된 예** SQL 예제 있음
- [ ] 최소 1개의 **올바른 예** SQL 예제 있음
- [ ] SQL이 의미론적 네이밍 사용
- [ ] 주석이 _무엇을_이 아닌 _왜_를 설명
- [ ] 해당하는 경우 트레이드오프 언급
- [ ] 참고 링크 포함
- [ ] `npm run validate` 통과
- [ ] `npm run build`가 올바른 출력 생성
