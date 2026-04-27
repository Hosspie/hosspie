# apps/admin

Hosspie의 Expo / React Native 모바일 앱 (게스트하우스 관리자용).

## 스택

- **Expo SDK 55** + **React Native 0.83** + **React 19.2**
- **expo-router 55** (파일 기반 라우팅)
- **Apollo Client** (서버 상태)
- **react-hook-form** (복잡한 멀티 스텝 폼)

## 라우팅

expo-router 기반.

- 보호된 라우트는 세션 가드와 함께 `Stack.Protected` 사용
- 멀티 스텝 플로우는 컨텍스트 공유를 위해 공유 레이아웃 사용 (예: `app/onboarding/_layout.tsx`)

## Provider 계층 (`app/_layout.tsx`)

```
ApolloProvider → SessionProvider → Stack
```

## 스타일링

- React Native StyleSheet + 디자인 토큰
- `packages/design-system/src/tokens/` 토큰 기반
- 다크 모드 전용 시맨틱 컬러

**스크린 컴포지션 규칙**: `@hosspie/design-system/organisms/*`만 import. atom 직접 import 금지.

```ts
// ✅
import { ButtonGroup } from '@hosspie/design-system/organisms/button-group';

// ❌
import { Button } from '@hosspie/design-system/components/button';
```

## 공통 서비스 정책

클라이언트 측 공통 로직(폼 유틸 등)은 `packages/services`에 두고 `@hosspie/services/...`로 import해서 사용. 새 utility 추가 시 admin에 직접 두지 말고 services로 추출 — 미래 client 앱에서도 재사용.

현재 services에 있는 것: 폼 유틸 (`<Field>` 컴포넌트, react-hook-form Controller 래퍼).

```ts
// 사용 예
import { Field } from '@hosspie/services/frontend/form';

<Field<FormData, 'fieldName'>
  name="fieldName"
  rules={{ required: '에러 메시지' }}
  render={({ field, fieldState }) => <TextInput {...field} />}
/>
```

## 상태 관리

| 종류 | 도구 |
|---|---|
| 서버 상태 | Apollo Client |
| 복잡한 멀티 스텝 폼 | react-hook-form (`FormProvider`로 레이아웃 감싸기) |
| 인증/세션 | React Context (`SessionProvider`) |

## GraphQL Operation 추가

```
1. apps/admin/lib/graphql/operations/{name}.graphql 작성
2. pnpm codegen 또는 codegen:watch
3. 생성된 hook ({name}.generated.ts) import 후 사용
```

## 경로 별칭

- `@/*` → 앱 루트
- 모노레포 패키지는 직접 import (`@hosspie/database`, `@hosspie/types`, `@hosspie/design-system/...`, `@hosspie/services/...`)

## 명령어

- `pnpm dev:admin` (Metro)
- `pnpm test` / `pnpm test:watch`
