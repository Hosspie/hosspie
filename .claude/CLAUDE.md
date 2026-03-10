# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

Hosspie는 게스트하우스 관리 시스템을 위한 pnpm 워크스페이스 모노레포입니다:

- **Admin App**: Expo/React Native 모바일 애플리케이션 (expo-router 사용)
- **API**: NestJS GraphQL API 서버
- **Database**: Prisma ORM + Supabase PostgreSQL

Node 버전: 20 (`.nvmrc` 참고)

## 빠른 시작

### 초기 설정 (프로젝트 클론 후 1회)

```bash
# 1. 환경 설정
nvm use
pnpm install

# 2. 환경 변수 복사
cp apps/api/.env.example apps/api/.env.development.local
cp apps/admin/.env.example apps/admin/.env.development.local

# 3. 데이터베이스 설정
pnpm supabase:start
pnpm db:push
pnpm db:seed

# 4. 개발 서버 시작 (Supabase 자동 시작 포함)
pnpm dev:all

# 5. GraphQL 타입 생성 (별도 터미널)
pnpm codegen
```

📚 **상세 가이드**: `backend-developer` 스킬 참조

### 일반 개발 시작

```bash
# API 서버만 시작 (Supabase 자동 시작 포함)
pnpm dev:api

# 또는 API + Admin 서버 모두 시작 (Supabase 자동 시작 포함)
pnpm dev:all
```

**자동화**: `dev:api`와 `dev:all` 명령어는 Supabase를 자동으로 시작합니다. Supabase가 이미 실행 중이면 빠르게 확인 후 넘어갑니다.

**권장 터미널 구성**:
1. `pnpm dev:all` - Supabase + API + Admin 서버 (자동)
2. `pnpm codegen:watch` - GraphQL operations 자동 재생성
3. `pnpm db:studio` - Prisma Studio (DB 확인용)

## 주요 명령어

### 데이터베이스
- `pnpm db:generate` - Prisma Client 생성
- `pnpm db:push` - 스키마 푸시 (개발)
- `pnpm db:migrate:dev` - 마이그레이션 생성 및 적용
- `pnpm db:studio` - Prisma Studio GUI

### GraphQL 코드 생성
- `pnpm codegen` - 전체 코드 생성
- `pnpm codegen:watch` - Watch 모드 (권장)

**자동화**: API 서버는 `schema.gql` 자동 생성, TypeScript 타입은 `codegen` 실행 필요

### 빌드 & 테스트
- `pnpm build` - 모든 앱과 패키지 빌드
- `pnpm test` - 테스트 실행
- `pnpm lint` - 린트

## 아키텍처

### 모노레포 구조

```
apps/
├── admin/          # Expo/React Native 앱 (Expo SDK 53, React Native 0.79)
└── api/            # NestJS GraphQL API (NestJS 11, Apollo Server)

packages/
├── database/       # Prisma 스키마와 클라이언트
├── types/          # GraphQL 스키마에서 생성된 공유 TypeScript 타입
├── design-system/  # React Native UI 컴포넌트 (RN StyleSheet + 디자인 토큰)
├── services/       # 공유 프론트엔드 서비스 (폼 유틸리티)
└── configs/        # 공유 ESLint, TypeScript 설정
```

### Admin 앱 아키텍처

**라우팅**: expo-router(v5)를 사용한 파일 기반 라우팅

- 보호된 라우트는 세션 가드와 함께 `Stack.Protected` 사용
- 멀티 스텝 플로우는 컨텍스트 공유를 위해 공유 레이아웃 사용 (예: onboarding)

**Provider 계층 구조** (루트 `app/_layout.tsx`):

```
ApolloProvider → SessionProvider → Stack (router)
```

**스타일링**: React Native StyleSheet + 디자인 토큰

- `packages/design-system/src/tokens/`의 디자인 토큰 기반 스타일링
- `StyleSheet.create()` + `React.createElement` 패턴
- 다크 모드 전용 시맨틱 컬러 토큰

**상태 관리**:

- Apollo Client: 서버 상태 관리
- React Hook Form: 복잡한 멀티 스텝 폼
- Context API: 인증/세션

**경로 별칭**:

- `@/*`는 앱 루트에 매핑
- tsconfig paths를 통한 모노레포 패키지 직접 임포트

### API 아키텍처

**프레임워크**: NestJS with GraphQL Code-First 방식

**모듈 구조**:

```
src/modules/
├── prisma/        # 데이터베이스 서비스 (싱글톤 Prisma 클라이언트)
├── guesthouse/    # 비즈니스 로직
│   ├── *.resolver.ts    # GraphQL 리졸버
│   ├── *.service.ts     # 비즈니스 로직
│   ├── models/          # GraphQL 객체 타입
│   └── inputs/          # GraphQL 입력 DTO
└── health/        # 헬스 체크 엔드포인트
```

**주요 설정** (`src/main.ts`):

- class-validator를 사용한 전역 유효성 검사 파이프
- CORS 활성화
- 전역 API 접두사: `/api`
- 개발 환경에서 GraphQL Playground 활성화

**인증**: 현재 임시 사용자 ID 사용 중; 인증 구현은 TODO

📚 **상세 가이드**: `backend-developer` 스킬 참조

### 데이터베이스 (Prisma + Supabase)

**스키마 위치**: `packages/database/prisma/schema.prisma`

**데이터 모델**:

```
User (1:1) → Guesthouse (1:n) → Room
```

**연결**:

- 로컬 개발: Supabase CLI (`pnpm supabase:start`)
- Supabase 설정: `supabase/config.toml`
- PostgREST API는 비활성화 (NestJS GraphQL 사용)

**패키지 익스포트**:

- `@hosspie/database` - Prisma 클라이언트와 타입
- `@hosspie/database/client` - 싱글톤 Prisma 클라이언트 인스턴스

📚 **상세 가이드**: `backend-developer` 스킬 → `references/database.md`

### 타입 시스템

**핵심 원칙**: Prisma Schema를 단일 진실의 소스(Single Source of Truth)로 사용

**타입 플로우**:

```
Prisma Schema
  ↓
NestJS 데코레이터 → schema.gql (자동 생성)
  ↓
GraphQL Code Generator
  ↓
TypeScript 타입 (packages/types)
```

**패키지별 사용**:
- **API**: Enum/Model → `@hosspie/database`
- **Client**: 모든 타입 → `@hosspie/types`

📚 **상세 가이드**: `backend-developer` 스킬 → `references/type-system.md`

### 디자인 시스템

**위치**: `packages/design-system/src/`

**구조**:

- `components/` - Atom 컴포넌트 (Button, Input, Text, Card 등)
- `organisms/` - Atom 조합 컴포넌트 (FormField, ButtonGroup, TextBlock 등)
- `pages/` - Storybook 페이지 스토리 (Frontend Developer용 UI 설계도)
- `tokens/` - 디자인 토큰 (colors, spacing, typography, radius, sizing, shadows)

**스크린 컴포지션 규칙**: 앱 스크린에서는 organisms만 import. components(atoms) 직접 import 금지.

```typescript
// ✅ organisms만 import
import { ButtonGroup } from '@hosspie/design-system/organisms/button-group';
import { FormField } from '@hosspie/design-system/organisms/form-field';

// ❌ components(atoms) 직접 import 금지
import { Button } from '@hosspie/design-system/components/button';
```

📚 **상세 가이드**: `publisher` 스킬 (디자인 시스템), `frontend-developer` 스킬 (앱 구현)

### 멀티 스텝 폼 패턴

코드베이스는 멀티 스텝 폼을 위한 패턴을 사용합니다 (onboarding 플로우 참고):

1. **레이아웃 레벨** (`app/onboarding/_layout.tsx`):
   - react-hook-form의 `FormProvider`로 감싸기
   - 네비게이션 간 상태 유지
   - 라우트별 진행 상황 추적

2. **Field 래퍼** (`packages/services/frontend/src/form`):
   - `Controller`를 감싸는 타입 안전 `Field` 컴포넌트
   - 자동 에러 핸들링이 포함된 간소화된 API

3. **사용법**:
   ```tsx
   <Field<FormDataType, 'fieldName'>
     name="fieldName"
     rules={{ required: '에러 메시지' }}
     render={({ field, fieldState }) => <YourComponent {...field} />}
   />
   ```

## 개발 워크플로우

### 데이터베이스 스키마 변경 시

```bash
pnpm db:push          # 스키마 DB 반영
pnpm db:generate      # Prisma Client 재생성
```

### GraphQL 스키마 변경 시

```bash
# 1. schema.gql 자동 업데이트 확인 (nest start --watch)
# 2. TypeScript 타입 재생성
pnpm codegen
```

### GraphQL Operation 추가 시

```bash
# 1. .graphql 파일 작성 (apps/admin/lib/graphql/operations/)
# 2. 타입과 훅 생성
pnpm codegen:admin
# 3. 생성된 훅 import 및 사용
```

## 중요한 컨벤션

### 코드 주석

- 한글 주석과 이모지 문서 참조:
  ```typescript
  // 📚 참고: https://docs.nestjs.com/providers
  ```

### 에러 메시지

- 사용자 대면 메시지는 한글로 작성
- GraphQL 에러는 NestJS `NotFoundException` 사용
- 프론트엔드 필드 유효성 검사는 react-hook-form rules 사용

### TypeScript

- Strict 모드 활성화
- 패키지 전체에 일관된 경로 별칭 설정
- `@hosspie/types` 패키지의 공유 타입 사용

### 인증 패턴

- 현재: 임시 하드코딩된 사용자 ID (`'temp-user-id'`)
- TODO: 세션 컨텍스트를 사용한 적절한 인증 구현
- Apollo Client는 SecureStore에서 토큰 주입을 위한 auth link 준비됨

### Turborepo 태스크 의존성

**자동 의존성 관리** (turbo.json 설정):

1. **API 개발 서버** (`@hosspie/api#dev`):
   - 의존성: `@hosspie/database#db:generate`, `@hosspie/database#build`
   - 동작: `pnpm dev:api` 실행 시 Supabase 자동 시작 → Prisma 클라이언트 생성 → NestJS 서버 시작

2. **빌드 태스크** (`build`):
   - 의존성: `^build` (모든 의존 패키지 빌드 먼저)
   - 동작: 하위 패키지부터 순차적으로 빌드

3. **데이터베이스 태스크** (`db:*`):
   - 캐시 비활성화 (`cache: false`)
   - 이유: 데이터베이스 상태는 항상 최신으로 반영되어야 함

**주의**: Turborepo는 태스크 의존성만 자동으로 처리하며, **초기 데이터베이스 스키마 적용(`db:push`)은 수동으로 실행**해야 합니다.

## 테스트

- **Admin**: jest-expo preset을 사용한 Jest
- **API**: ts-jest를 사용한 Jest
- 테스트 실행: `pnpm test` (루트) 또는 특정 앱에서 `pnpm test`
- Watch 모드: 앱 디렉토리에서 `pnpm test:watch`
- 커버리지: API 앱에서 `pnpm test:cov`

## 문서 작성 규칙

**모든 문서, 주석, 커밋 메시지는 한글로 작성합니다.**

- 코드 주석: 한글 사용
- README, CLAUDE.md 등 문서: 한글 사용
- Git 커밋 메시지: 한글 사용
- 에러 메시지: 한글 사용
- 변수명, 함수명: 영어 사용 (코드 자체는 영어)

## 스킬 가이드

작업 영역별 상세 가이드는 `.claude/skills/`의 스킬 문서를 참조:

| 스킬 | 담당 영역 |
|------|----------|
| `publisher` | 디자인 시스템 (components, organisms, pages, tokens, Storybook) |
| `frontend-developer` | 앱 구현 (스크린 컴포지션, GraphQL, 폼, 라우팅, 상태 관리) |
| `backend-developer` | API + DB (NestJS, Prisma, 타입 시스템, codegen, Supabase) |
