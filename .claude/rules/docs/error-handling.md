---
paths:
  - "apps/**/*.{ts,tsx}"
  - "packages/**/*.{ts,tsx}"
---

# 에러 처리 — Result-as-data

hosspie 전반의 에러 처리 철학. 도메인별 구체 패턴은 `rules/{backend,front,publishing}/`에 있음.

## 핵심 원칙

**비즈니스 실패는 enum-typed `code` + 사용자 메시지로 표현, 진짜 예외만 throw.**

- 서버는 result variant 에 `code: ErrorCode` (enum) + `message: String` 을 담아 반환
- 클라이언트는 `code` enum 으로 분기 — **string 리터럴 (`__typename` 비교 등) 직접 분기 금지**
- `throw new Error('...')` / silent catch / wrap-and-rethrow **금지**

## 왜 (WHY)

- 무책임한 throw → 호출자는 어떤 에러가 가능한지 타입으로 알 수 없음 → 처리 누락 / silent failure
- string 리터럴 분기 → 타이포로 분기 누락, 리네임 시 깨짐. enum 은 컴파일 타임에 잡힘 + exhaustive 체크 가능
- generic 메시지("뭔가 잘못됐습니다") → 사용자가 다음 행동을 결정할 수 없음
- 비즈니스 실패와 진짜 예외를 같은 채널로 보내면 디버깅·로깅·알림이 모두 무뎌짐

## ErrorCode enum

API 가 SoT. NestJS GraphQL `registerEnumType` 으로 schema 에 등록되면 `pnpm codegen` 이 클라이언트 enum 을 `@hosspie/types` 에 자동 생성. 기존 `Gender`·`OnboardingStatus` enum 과 동일 흐름.

```ts
// apps/api/src/common/error-codes.ts
import { registerEnumType } from '@nestjs/graphql';

export enum ErrorCode {
  ROOM_ALREADY_EXISTS = 'ROOM_ALREADY_EXISTS',
  DUPLICATE_GUESTHOUSE_NAME = 'DUPLICATE_GUESTHOUSE_NAME',
  // 추가...
}

registerEnumType(ErrorCode, { name: 'ErrorCode' });
```

서버·클라이언트가 같은 enum 을 참조 — 한쪽에서 값이 바뀌면 양쪽 빌드가 같이 깨져 drift 방지.

## 서버 (apps/api)

각 에러는 `code: ErrorCode` 필드를 가진 ObjectType + GraphQL union variant:

```ts
@ObjectType()
export class RoomAlreadyExistsError {
  @Field(() => ErrorCode)
  code: ErrorCode = ErrorCode.ROOM_ALREADY_EXISTS;

  @Field() message: string;
}

export const CreateRoomResult = createUnionType({
  name: 'CreateRoomResult',
  types: () => [CreateRoomSuccess, RoomAlreadyExistsError] as const,
});
```

진짜 예외(자원 없음·인증 부재·외부 시스템 다운)만 NestJS `NotFoundException` 등 throw. 자세한 variant 패턴 — `rules/backend/api.md`.

## 클라이언트 (apps/admin)

`code` enum 으로 분기:

```ts
import { ErrorCode } from '@hosspie/types';

const result = await createRoom({ variables: { input } });
const data = result.data?.createRoom;

if (data?.__typename !== 'CreateRoomSuccess') {
  switch (data?.code) {
    case ErrorCode.ROOM_ALREADY_EXISTS:
      setError(data.message);
      return;
    // 새 ErrorCode 추가 시 exhaustive 체크로 컴파일러가 미처리 케이스 잡음
  }
}
```

비즈니스 흐름에서 try/catch 금지. 자세한 패턴 — `rules/front/code-style.md` + `rules/front/screen.md`.

## 안티패턴 (전 도메인 공통)

- `throw new Error('...')` — 타입 없는 generic throw
- `try { ... } catch (e) { throw new Error('...', { cause: e }) }` — wrap-and-rethrow
- `.catch(() => null)` 같은 silent swallow — 외부 라이브러리 boundary 외엔 금지
- `data.code === 'ROOM_ALREADY_EXISTS'` 같은 string 비교 — 반드시 `ErrorCode.ROOM_ALREADY_EXISTS` (enum import)
- "오류가 발생했습니다" 류 placeholder 메시지 — 무엇이 잘못됐고 다음에 무엇을 할지 명시
- 비즈니스 실패에 NestJS Exception 사용 (예: `throw new BadRequestException('이미 존재합니다')`)
