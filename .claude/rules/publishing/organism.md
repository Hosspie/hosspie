---
paths:
  - "packages/design-system/src/organisms/**/*.{ts,tsx}"
---

# Organism 규칙

`packages/design-system/src/organisms/` 의 Atom 조합 컴포넌트 작성 규칙.

## import 제한 — Atom 만

RN 시각 컴포넌트 직접 사용 금지. 레이아웃 전용 `View` 만 예외.

```ts
// ✅ Atom import (절대경로 또는 상대경로)
import { Button } from '@hosspie/design-system/components/button';
import { TextInput } from '../../components/text-input';
import { View } from 'react-native'; // 레이아웃 전용만 OK

// ❌ RN 시각 컴포넌트 직접 사용 금지
import { Text, Pressable, Image } from 'react-native';
```

## Props 타입 명시

`<Name>Props` 타입을 반드시 선언.

```ts
type FormFieldProps = {
  label: string;
  errorMessage?: string;
};
```

## 파일 구조

```
organisms/{name}/
  index.ts   # 구현
```

## JSDoc

용도 한글 설명 + 사용 예시(`@example`) 필수.

```ts
/**
 * 폼 필드 — 레이블 + 입력 + 에러 메시지를 묶은 organism.
 * @example
 * React.createElement(FormField, { label: '게스트하우스 이름', errorMessage: error?.message })
 */
```
