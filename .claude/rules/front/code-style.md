---
paths:
  - "apps/admin/**/*.{ts,tsx}"
---

# 프론트엔드 코드 스타일

## TS 위생

- `type` 우선 (`interface` 지양), `any` 금지, `as` 최소화 (불가피하면 이유 주석)
- 같은 모듈에서 value + type 함께 import 시 inline `type` 수식어로 한 문장으로 합침: `import { foo, type Bar } from '...'`
- type만 import할 때는 `import type { X } from '...'` 단독 문장 허용
- 미사용 import·변수 즉시 삭제, 미사용 매개변수는 `_` 접두사
- `let` 지양 — `const` + early-return / `??` / ternary 로 우회
- `eslint-disable` 주석 금지 — ESLint 경고는 구조 리팩토링으로 해결
- `void` 연산자 금지 (타입 표기 `void` 는 허용). fire-and-forget 필요 시 내부에서 catch 처리하는 util 추출

## Import 순서

```ts
// 1. React
// 2. React Native
// 3. 외부 라이브러리
// 4. @hosspie/* / @/* (alias 폴더별 그룹, 그룹 사이 빈 줄)
// 5. 상대 경로
```

alias 폴더(`@/components`, `@/hooks` 등) 별로 그룹핑하고 그룹 사이 빈 줄 삽입. 그룹 내 알파벳순.

## 조건문

- **중첩 삼항 금지** (2단 이상). `resolve<X>` / `get<X>` 헬퍼 함수 + early-return if 체인으로 대체
- **switch 지양** — 값 매핑은 `Record<Key, Value>` lookup, action 라우팅은 early-return if 체인
- 의미 불명확 조건은 `const is<X> = ...`로 추출하되 **사용하는 if문 바로 위 한 줄에 선언** (상단에 모아두지 않음)

```ts
// ✅ 조건 변수 선언 → 바로 사용
const isProfileNotReady = isPending || !user;
if (isProfileNotReady) return <Loading />;
```

- boolean 변수/prop prefix: `is` / `has` / `can` / `should`

## 함수

- 함수 본문 무조건 중괄호: `const fn = () => { return x; };`
- `hooks/*` / `lib/*` / `utils/*` export 함수는 인자를 **항상 객체 구조분해**로 받음 (1개 primitive도 예외 없음). bare 이름(`value`, `v`, `item`) 금지 → `changedValue`, `selectedId` 등 의미 있는 이름

```ts
type UseGuesthouseStoreParams = { guesthouseId: string };
export const useGuesthouseStore = ({ guesthouseId }: UseGuesthouseStoreParams) => { ... };
```

- 파라미터 타입은 inline 금지, `type <FnName>Params`로 위에 선언

## 핸들러 명명

컴포넌트 본문 내부 named 함수는 **`handle<Event>` 만** 허용 (이벤트 prop / useEffect 바인딩 진입점). 재사용·유틸 성격의 로컬 named 함수(`clearX`, `goToX`, `openX`) **금지** — 인라인으로 직접 기술하거나 외부 util/hook으로 추출해 import 경유.

hook이 반환하는 함수 이름은 `handle*` prefix 금지 → 동사형(`openX`, `fetchX`) 사용.

## 에러 처리 (Result-as-data)

비즈니스 흐름 (mutation/query 결과·상태 변경·navigation) 에서 **try/catch 금지**. result의 에러 variant/필드를 명시적으로 분기.

```ts
// ✅ GraphQL union __typename 분기
const { data } = useCreateReservationMutation();
if (data?.createReservation.__typename === 'ValidationError') {
  setError(data.createReservation.message);
  return;
}
```

- **wrap-and-rethrow 금지**: `try { ... } catch (e) { throw new Error('...', { cause: e }) }` 패턴 안 씀
- try/catch 는 외부 라이브러리 boundary (`JSON.parse`, native module 등) 에 한함
- GraphQL 에러 variant 정의는 backend 담당 — union 스키마 확인 후 `__typename` 분기 사용

## JSDoc

`hooks/` / `components/` / `providers/` / `lib/` / `constants/` / `utils/` 의 **export + 다회 재사용 코드**는 한글 JSDoc + `@example` 필수. 단일 사용 helper, `app/` 스크린은 제외.

## TODO

```ts
// TODO(소유자, YYYY-MM-DD): 무엇을 왜 임시로 두는가 / 해제 조건 또는 이슈 링크
```
