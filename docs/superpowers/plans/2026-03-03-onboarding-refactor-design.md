# 온보딩 리팩토링 설계

## 목표

1. Gluestack/NativeWind/Tamagui 의존성 전부 제거
2. Organism을 RN StyleSheet + atom 컴포넌트 기반으로 교체 작성
3. 온보딩 4단계 페이지 UI 개선
4. 각 페이지별 Storybook 스토리 생성

## Organism 교체 목록

| 현재 | 변경 후 | 내부 구성 |
|------|---------|----------|
| FormFieldOrganism | FormField | Text + Input + Radio + Card atoms |
| FormFieldsOrganism | FormFields (react-hook-form 통합) | FormField + Controller |
| Buttons | ButtonGroup | Button atom + HStack/VStack |
| TextContainer | TextBlock | Text atom + VStack |
| ProgressBar | ProgressBar | Progress atom + Text |
| CardsOrganism | CardList | Card atom + VStack |
| FabsOrganism | Fab | Pressable + Animated |
| BackgroundLayout | BackgroundLayout | SafeAreaView + View |
| ImageContainer | ImageContainer | Image atom |

## Organism 디렉토리 구조

```
organisms/
├── form-field/index.ts       # FormField (단독 사용)
├── form-fields/index.ts      # FormFields (react-hook-form 통합)
├── button-group/index.ts     # ButtonGroup
├── text-block/index.ts       # TextBlock
├── progress-bar/index.ts     # ProgressBar
├── card-list/index.ts        # CardList
├── fab/index.ts              # Fab
├── background-layout/index.ts # BackgroundLayout
└── image-container/index.ts  # ImageContainer
```

## Hook 교체

| 현재 | 변경 후 |
|------|---------|
| useModal (Gluestack Modal/Actionsheet) | Dialog + Sheet atoms 직접 사용 |
| useToast (Gluestack toast) | 간단한 RN Alert 또는 커스텀 Toast |

## 온보딩 페이지 구조

4단계 유지:
1. description - 게스트하우스 이름/설명
2. information - 주소/전화/이메일/웹사이트
3. dinner-party - 저녁 식사 타입 카드 선택
4. rooms - 방 목록 + Sheet로 방 추가

공통 레이아웃: KeyboardAvoidingView + ScrollView + SafeAreaView

## 의존성 제거

### apps/admin/package.json 제거 대상
- 23개 @gluestack-ui/* 패키지
- nativewind, react-native-css-interop
- tailwindcss, tailwind-merge, class-variance-authority, clsx
- prettier-plugin-tailwindcss

### 설정 파일 정리
- babel.config.js: nativewind preset 제거
- metro.config.js: withNativeWind 제거
- global.css 삭제
- nativewind-env.d.ts 삭제
- tsconfig.json: nativewind-env.d.ts 참조 제거

### packages/design-system
- Tamagui 의존성 제거 (tamagui, @tamagui/*)
- Tamagui config/provider 삭제
- Storybook config에서 Tamagui 관련 설정 제거
- Gluestack hooks(toast/modal) 삭제 또는 RN 기반 재작성

### apps/admin/app/_layout.tsx
- GluestackProvider 제거
