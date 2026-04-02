# 구현 컨텍스트

## 전체 아키텍처 결정

### WebView 하이브리드 아키텍처
- Admin App의 화면은 WebView로 전달 (Vite + Tailwind CSS + Bridge)
- React Native는 네비게이션 쉘 + 네이티브 기능 (푸시 알림, SMS 등) 담당
- 화면 업데이트를 앱 빌드 없이 배포 가능

### 기존 구현물 활용
- 온보딩 플로우: React Native 네이티브 구현 유지 (이미 완성)
- 새 화면: WebView 하이브리드로 구현
- 디자인 시스템: Atom/Organism은 RN용, Web 화면은 Tailwind CSS

---

## Phase 1: 인증 시스템

### 인증 방식
- **Supabase Auth** 사용 (자체 JWT 아님)
- 이유: 소셜 로그인 내장, 세션 관리 자동, 빠른 구현

### 소셜 로그인
- **iOS**: Apple 로그인만
- **Android**: Google 로그인만
- 카카오/네이버는 제외 (플랫폼 네이티브 인증으로 단순화)

### 역할(Role) 관리
- User 모델에 `role` 필드 추가 (`OWNER` / `STAFF`)
- 역할 겹침 불가 (한 유저 = 한 역할)

### 회원가입 플로우
```
소셜 로그인 (Apple/Google)
  ↓
역할 선택 (사장님 / 스태프)
  ↓
[사장님] → 게스트하우스 정보 입력 (기존 온보딩 플로우)
[스태프] → 간단한 정보 입력 → 초대 코드 입력 → 게스트하우스 배정
```

### 기존 코드 활용
- `apps/admin/providers/session.tsx`: placeholder signIn()을 Supabase Auth로 교체
- `apps/admin/lib/apollo/client.ts`: Bearer 토큰 주입 이미 준비됨
- `apps/admin/app/signin.tsx`: 버튼 UI를 Apple/Google로 변경
- `apps/api/src/modules/guesthouse/guesthouse.resolver.ts`: temp-user-id 3곳 → Supabase JWT에서 추출

### Supabase Auth ↔ 앱 User 연결
- 소셜 로그인 시 Supabase `auth.users`에만 유저 생성
- 역할 선택 + 추가 정보 입력 완료 시 NestJS API에서 앱 `User` 테이블 생성
- Supabase auth.users.id를 앱 User.id로 사용하여 연결

### 회원가입 상세 플로우
```
1. 소셜 로그인 (Apple/Google) → Supabase auth.users 생성
2. 역할 선택 (사장님/스태프) → 바로 첫 화면
3-a. [사장님] → 게스트하우스 정보 입력 (온보딩) → API: User + Guesthouse 생성
3-b. [스태프] → 간단한 정보 입력 → 초대 코드 입력 (Phase 2) → API: User 생성 + 게스트하우스 배정
```

### 초대 코드
- Phase 1: 스태프 회원가입 시 초대 코드 입력 UI만 구현
- Phase 2: 초대 코드 생성, SMS 발송 구현

### DB 스키마 변경
- User 모델: `role` enum 추가 (OWNER, STAFF)
- User 모델: Supabase auth.users.id를 PK로 사용
- 소셜 로그인 관련 필드는 Supabase Auth가 관리하므로 별도 추가 불필요
