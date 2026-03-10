# 타입 시스템 + GraphQL Codegen

## 타입 시스템

### 핵심 원칙

**Prisma Schema = 단일 진실의 소스 (SSOT)**

1. **단일 정의**: 모든 타입과 enum은 Prisma Schema에서만 정의
2. **자동 전파**: 정의된 타입은 자동으로 API와 Client에 전파
3. **Import만 허용**: 타입을 직접 정의하지 않고 항상 import
4. **중복 금지**: 같은 타입을 여러 곳에서 정의 절대 금지

### 타입 전파 플로우

```
Prisma Schema
  |
  v
NestJS 데코레이터 (@ObjectType, @Field) --> schema.gql (자동 생성)
  |
  v
GraphQL Code Generator
  |
  v
TypeScript 타입 (packages/types)
```

### Import 규칙

| 환경 | Enum | Model | GraphQL Input/Output |
|------|------|-------|---------------------|
| **API** | `@hosspie/database` | `@hosspie/database` | 직접 정의 |
| **Client** | `@hosspie/types` | `@hosspie/types` | `@hosspie/types` |

### 올바른 사용

```typescript
// API에서
import { Gender, DinnerPartyType } from '@hosspie/database';

await prisma.room.create({
  data: { gender: Gender.MALE }
});

// Client에서
import { Gender, CreateGuesthouseInput } from '@hosspie/types';

const formData: CreateGuesthouseInput = {
  dinnerPartyType: DinnerPartyType.POT_LUCK,
};

// Enum 값 비교
if (room.gender === Gender.MALE) { /* ... */ }
```

### 잘못된 사용

```typescript
// 문자열 리터럴 사용
if (room.gender === 'MALE') { /* ... */ }

// 수동 enum 정의
export enum Gender { MALE = 'MALE', FEMALE = 'FEMALE' }

// Client에서 @hosspie/database 직접 import
import { Gender } from '@hosspie/database';  // Client는 @hosspie/types 사용

// 폼 데이터 타입을 문자열로 재정의
interface FormData {
  dinnerPartyType: 'POT_LUCK' | 'HOST_SERVED';  // Enum을 문자열로 재정의 금지
}
```

### 폼 데이터 타입

```typescript
// @hosspie/types의 Input 타입 활용
import { CreateGuesthouseInput, DinnerPartyType, CreateRoomInput } from '@hosspie/types';

// 방법 1: Input 타입 직접 사용
type FormData = CreateGuesthouseInput;

// 방법 2: 필요한 필드만 조합
interface OnboardingFormData {
  name: string;
  dinnerPartyType: DinnerPartyType;     // Enum import
  rooms: CreateRoomInput[];             // Input 타입 import
}
```

### 제한적 예외

타입 직접 정의가 허용되는 경우:

1. **순수 UI 로컬 상태** - GraphQL과 무관한 UI 전용 상태
   ```typescript
   interface ModalState { isOpen: boolean; activeTab: number; }
   type ToastVariant = 'success' | 'error' | 'warning';
   ```

2. **로컬 헬퍼 타입** - 함수/컴포넌트 내부 임시 타입
   ```typescript
   type SortOrder = 'asc' | 'desc';
   type LoadingState = 'idle' | 'loading' | 'success' | 'error';
   ```

**원칙**: 데이터 모델 관련 타입은 반드시 스키마 먼저 정의 -> import.

### 새 타입 추가 워크플로우

```bash
# 1. Prisma Schema에 enum/모델 추가
#    packages/database/prisma/schema.prisma

# 2. DB 반영 + 클라이언트 생성
pnpm db:push
pnpm db:generate

# 3. API 모델에 Enum 등록
#    registerEnumType(NewEnum, { name: 'NewEnum' })

# 4. 타입 재생성
pnpm codegen
```

---

## GraphQL Codegen

### 자동 vs 수동

| 동작 | 자동/수동 | 조건 |
|------|----------|------|
| `schema.gql` 생성 | 자동 | API 서버 실행 시 |
| `schema.gql` 업데이트 | 자동 | `nest start --watch` 모드 |
| TypeScript 타입 생성 | **수동** | `pnpm codegen` 실행 필요 |
| Admin operations 타입/훅 | **수동** | `pnpm codegen:admin` 실행 필요 |

### GraphQL 스키마 변경 시

API 리졸버/모델을 수정한 경우:

1. API 서버가 watch 모드라면 `schema.gql` 자동 업데이트됨
2. **반드시** `pnpm codegen` 실행하여 TypeScript 타입 재생성

### GraphQL Operation 추가 시

1. `.graphql` 파일 작성 (`apps/admin/lib/graphql/operations/`)
2. `pnpm codegen:admin` 실행하여 타입 + 훅 생성
3. 생성된 훅 import 및 사용

### Watch 모드 설정

권장 터미널 구성:

```bash
# 터미널 1: API + Admin 서버
pnpm dev:all

# 터미널 2: GraphQL codegen watch
pnpm codegen:watch
```

자동화 효과:
- `.graphql` 파일 변경 -> 타입 + 훅 자동 생성
- `schema.gql` 변경 -> 공유 타입 자동 생성

### 생성된 훅 네이밍 규칙

Operation 이름을 PascalCase로 변환하여 자동 생성:

```typescript
// Query 훅
export function use{OperationName}Query(
  options?: QueryHookOptions<{OperationName}Query, {OperationName}QueryVariables>
)

// Mutation 훅
export function use{OperationName}Mutation(
  options?: MutationHookOptions<{OperationName}Mutation, {OperationName}MutationVariables>
)
```

예시:
- `query MyGuesthouse { ... }` -> `useMyGuesthouseQuery()`
- `mutation CreateOnboarding { ... }` -> `useCreateOnboardingMutation()`

---

## Codegen 설정 파일

```
packages/types/codegen.ts → 공유 타입 생성
apps/admin/codegen.ts → Admin operations 타입 + 훅 생성
apps/admin/codegen-plugins/apollo-hooks.js → 커스텀 Apollo 훅 플러그인
```

## 패키지 구조

```
packages/types/
├── scripts/generate-enums.js    # Prisma Schema → TS Enum 변환
├── src/
│   ├── index.ts                 # 통합 export
│   └── generated/
│       ├── graphql.ts           # GraphQL 타입 (자동 생성)
│       └── enums.ts             # Prisma Enum (자동 생성)
└── codegen.ts
```

## 트러블슈팅

1. **"schema.gql not found"**: API 서버 미실행 → `pnpm dev:api` 후 `pnpm codegen`
2. **"Module has no exported member"**: `pnpm db:generate` → `pnpm --filter @hosspie/types build`
3. **GraphQL 타입 미업데이트**: `schema.gql` 확인 → `pnpm codegen`
4. **"Cannot find module '@hosspie/types'"**: `pnpm --filter @hosspie/types build`
5. **Enum이 타입으로만 인식**: `pnpm db:generate` → `pnpm codegen:types` → `pnpm --filter @hosspie/types build`
6. **codegen:watch 미감지**: `apps/admin/codegen.ts`의 schema/documents 경로 확인
7. **GraphQL 스키마-타입 불일치**: `pnpm dev:api` → `pnpm codegen`
