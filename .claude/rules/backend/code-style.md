---
paths:
  - "apps/api/**/*.ts"
---

# Backend 코드 스타일

## TS 위생

- `type` 우선. `any` 금지 — `unknown` + type guard 사용. `as` 최소화.
- `import type` 인라인: `import { type Foo, Bar } from '...'`
- 미사용 코드 즉시 삭제. 미사용 파라미터는 `_` 접두사.
- `let` 지양 — `const` + early-return / `??` / ternary 로 대체.
- `eslint-disable` 금지. `void` 연산자 금지.

## import 순서

```ts
// 1. NestJS / 외부 라이브러리
import { Injectable } from '@nestjs/common';
// 2. @hosspie/* 패키지
import { type Guesthouse } from '@hosspie/database';
// 3. @/* (src 내부 절대 경로)
import { PrismaService } from '@/modules/prisma/prisma.service';
// 4. 상대 경로
import { CreateGuesthouseInput } from './inputs/create-guesthouse.input';
```

그룹 사이 빈 줄 1줄.

## 함수 파라미터

인자 1개여도 객체 구조분해. 필드명은 의미 있게.

```ts
// ❌
async findRoom(guesthouseId: string, roomId: string)
// ✅
async findRoom({ guesthouseId, roomId }: { guesthouseId: string; roomId: string })
```

## 조건문

- 중첩 삼항 금지. `switch` 지양 — 값 매핑은 `Record`, 액션 분기는 early-return if 체인.
- 의미 불명확 조건은 `is<X>` 변수로 추출 후 if 바로 위 한 줄 선언.

```ts
const isOwner = guesthouse.userId === userId;
if (!isOwner) return { __typename: 'ForbiddenError', message: '권한이 없습니다.' };
```

## 에러 처리 (Result-as-data)

- service 메서드는 discriminated union 반환. 성공·검증 실패·정책 위반 variant 분리.
- NestJS Exception (`NotFoundException` / `UnauthorizedException` / `BadRequestException`) throw 는 **진짜 예외 한정** — 자원 없음, 인증 부재, 외부 시스템 통신 실패.
- **wrap-and-rethrow 금지**: try/catch 로 받아 `throw new Error('...', { cause })` 만 하는 패턴 사용 안 함.
- 외부 라이브러리 (Prisma, Supabase) boundary 예외 변환만 try/catch 허용.

```ts
// ❌ 비즈니스 실패를 throw
if (duplicate) throw new BadRequestException('이미 존재합니다.');

// ✅ Result variant 반환 — code 필드는 ErrorCode enum
if (duplicate) {
  return {
    __typename: 'DuplicateNameError',
    code: ErrorCode.DUPLICATE_GUESTHOUSE_NAME,
    message: '이미 사용 중인 이름입니다.',
  };
}
```

`ErrorCode` enum 은 `apps/api/src/common/error-codes.ts` 에서 정의·`registerEnumType` 으로 GraphQL 등록. 자세한 정책은 `rules/docs/error-handling.md`.

variant `message` 필드든 NestJS Exception 인자든 **한국어** (`'게스트하우스를 찾을 수 없습니다.'`).

## JSDoc

`service` / `resolver` public 메서드 — export 하면 한글 JSDoc + `@example` 권장. Result variant 의미를 `@example` 로 표시.

```ts
/**
 * 게스트하우스를 생성합니다.
 * @example
 * // 성공: { __typename: 'CreateGuesthouseSuccess', guesthouse: { id: '...', name: '...' } }
 * // 중복: { __typename: 'DuplicateNameError', code: ErrorCode.DUPLICATE_GUESTHOUSE_NAME, message: '이미 사용 중인 이름입니다.' }
 */
async createGuesthouse(...): Promise<typeof CreateGuesthouseResult> { ... }
```

DTO `@Field` 옵션은 한 줄 한국어 주석.

## TODO

```ts
// TODO(kmjnnhyk, 2026-04-26): 실제 인증 도입 시 userId 를 세션에서 추출 / #123
```
