# packages/design-system

Hosspie의 React Native UI 컴포넌트 + 디자인 토큰 패키지.

## 디렉토리 책임

| 디렉토리 | 책임 |
|---|---|
| `src/components/` | Atom 컴포넌트 (Button, Input, Text, Card) — 단일 UI 단위 |
| `src/organisms/` | Atom 조합 컴포넌트 (FormField, ButtonGroup, TextBlock) |
| `src/screens/` | 페이지 스토리 (Storybook용 스크린 설계도) |
| `src/tokens/` | 디자인 토큰 (colors, spacing, typography, radius, sizing, shadows) |
| `src/hooks/`, `src/providers/` | 디자인 시스템 전용 hook/provider |

## 핵심 규칙

- **외부 style 주입 금지**: atom은 `style` prop을 받지 않는다. 레이아웃 배치는 사용처(organism/screen)의 책임.
- **다크 모드 전용**: 컬러 토큰은 다크 모드 시맨틱 컬러만.
- **스크린 컴포지션**: 앱 스크린은 organisms만 import — atoms 직접 import 금지.

구체 작성 컨벤션(Atom·Organism·story 위치 등)은 `.claude/rules/publishing/`이 path 매칭으로 자동 로드.

## Storybook

- 실행: `pnpm --filter @hosspie/design-system storybook` (루트에서) — `:6006`
- 스토리 위치: `src/screens/<feature>/<ScreenName>.stories.tsx`
- MobileFrame 데코레이터 필수 (iPhone 프레임 시뮬레이션)

## 패키지 export

| import 경로 | 내용 |
|---|---|
| `@hosspie/design-system/components/<name>` | atom (디자인 시스템 내부 + 테스트용) |
| `@hosspie/design-system/organisms/<name>` | organism (앱 스크린에서 import) |
| `@hosspie/design-system/tokens` | 디자인 토큰 |
