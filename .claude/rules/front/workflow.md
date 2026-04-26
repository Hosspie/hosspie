---
paths:
  - "apps/admin/**/*.{ts,tsx}"
---

# 프론트엔드 개발 워크플로우

## GraphQL Operation 추가

```
1. apps/admin/lib/graphql/operations/{name}.graphql 작성
2. pnpm codegen:admin
3. 생성된 hook ({name}.generated.ts) import 후 사용
```

에러 variant가 있는 mutation/query는 backend에서 union type 스키마가 정의됐는지 확인 후 `__typename` 분기로 처리.

```ts
// ✅ union 분기 예시
const [createRoom] = useCreateRoomMutation();
const result = await createRoom({ variables: { input } });
if (result.data?.createRoom.__typename === 'RoomAlreadyExistsError') {
  setError(result.data.createRoom.message);
  return;
}
```

## 멀티 스텝 폼

`_layout.tsx` 에 `FormProvider` + `ProgressBar`. 각 step = `useFormContext` + `Field` + `FormField`. 마지막 step 에서 `handleSubmit` → mutation. 상태는 layout 보관.

```tsx
// _layout.tsx
export default function Layout() {
  const methods = useForm<OnboardingFormData>();
  return (
    <FormProvider {...methods}>
      <ProgressBar step={currentStep} total={3} />
      <Stack />
    </FormProvider>
  );
}

// step/index.tsx
export default function Index() {
  const { control } = useFormContext<OnboardingFormData>();
  return (
    <FormField label="게스트하우스 이름">
      <Field name="name" control={control} rules={{ required: '필수 입력' }}
        render={({ field }) => <TextInput {...field} />}
      />
    </FormField>
  );
}
```

## 성능

`React.memo` (리스트 아이템), `useCallback` (자식에 전달하는 핸들러), `useMemo` (비싼 계산). 긴 리스트는 `FlashList`. Hermes 사용 중. RN 성능 디버깅 상세는 `react-native-best-practices` 스킬 위임.
