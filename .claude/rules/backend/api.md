---
paths:
  - "apps/api/**/*.ts"
---

# Backend API 규칙

## Prisma SoT (단일 진실의 소스)

- enum / 모델은 Prisma 에서 정의. 수동 enum 정의·문자열 리터럴 비교 금지.
- API 에선 `@hosspie/database` 에서 enum / 모델 import.
- 클라이언트 타입은 `@hosspie/types` (codegen 산출물).

## GraphQL 정의

- 모델: `@ObjectType`. 입력 DTO: `@InputType`.

## 에러 variant 모델링 (Result-as-data 핵심)

성공/실패 variant 가 의미 있는 mutation/query 는 **union type** 으로 모델링. 에러 variant 는 반드시 `code: ErrorCode` (enum) + `message` 를 가진다 — 클라이언트가 enum 으로 분기.

```typescript
@ObjectType()
export class CreateGuesthouseSuccess {
  @Field(() => Guesthouse) guesthouse: Guesthouse;
}

@ObjectType()
export class DuplicateNameError {
  @Field(() => ErrorCode)
  code: ErrorCode = ErrorCode.DUPLICATE_GUESTHOUSE_NAME;

  @Field() message: string;
}

export const CreateGuesthouseResult = createUnionType({
  name: 'CreateGuesthouseResult',
  types: () => [CreateGuesthouseSuccess, DuplicateNameError] as const,
  resolveType: (value) => value.__typename,
});
```

- resolver 는 `Promise<typeof CreateGuesthouseResult>` 반환. 각 variant 는 `__typename` 명시 (서버 측 GraphQL 메타데이터).
- 클라이언트 분기는 `__typename` 이 아니라 `code` enum 으로 — `rules/docs/error-handling.md` 참조.
- `ErrorCode` enum 은 `apps/api/src/common/error-codes.ts` 에 정의. 새 에러 추가 시 enum 값 추가 후 `pnpm codegen` 으로 클라이언트 enum 자동 동기화.
- 단순 자원 조회 (찾으면 객체, 없으면 null) 는 nullable 반환으로 충분 — variant 불필요.

## API 엔드포인트 추가 절차

```
1. packages/database/prisma/schema.prisma 확인/수정
2. modules/{feature}/models/{Model}.model.ts (@ObjectType)
3. (필요 시) modules/{feature}/results/{Action}-result.ts (createUnionType — 에러 variant)
4. modules/{feature}/inputs/{Action}-{Model}.input.ts (@InputType)
5. modules/{feature}/{feature}.service.ts (Result variant 반환)
6. modules/{feature}/{feature}.resolver.ts
7. modules/{feature}/{feature}.module.ts 등록
8. pnpm codegen
```

## DB 스키마 변경 절차

```bash
pnpm db:push       # 개발 DB 반영
pnpm db:generate   # Prisma Client 재생성
# 새 enum 추가 시: API 모델에서 registerEnumType(Foo, { name: 'Foo' })
pnpm codegen       # GraphQL 타입 재생성
```
