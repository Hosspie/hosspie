# Phase 1-3: 회원가입 플로우 (역할 선택 + 분기)

## 개요
소셜 로그인 후 역할 선택 → 사장님은 온보딩, 스태프는 정보 입력 + 초대 코드 화면으로 분기하는 회원가입 플로우를 구현한다.

## 태스크

<task type="auto">
  <name>회원가입 API: User 생성 + 역할 설정</name>
  <files>
    apps/api/src/modules/user/user.module.ts (신규)
    apps/api/src/modules/user/user.resolver.ts (신규)
    apps/api/src/modules/user/user.service.ts (신규)
    apps/api/src/modules/user/inputs/ (신규)
    apps/api/src/modules/user/models/ (신규)
  </files>
  <action>
    User 모듈 생성.
    registerUser mutation: Supabase auth.users.id로 앱 User 생성 (role, name 포함).
    me query: 현재 로그인 유저 정보 반환 (없으면 null → 회원가입 필요 판단).
    사장님 등록 시: User 생성 → 기존 createOnboarding 플로우로 연결.
    스태프 등록 시: User 생성 (초대 코드 검증은 Phase 2).
  </action>
  <verify>registerUser 호출 → User 생성 확인, me 쿼리 → 유저 정보 반환</verify>
  <done>User CRUD API 동작, 역할 기반 생성 가능</done>
</task>

<task type="auto">
  <name>역할 선택 화면</name>
  <files>
    apps/admin/app/register/role-select.tsx (신규)
    apps/admin/app/register/_layout.tsx (신규)
  </files>
  <action>
    소셜 로그인 성공 후 me 쿼리 → User 없으면 역할 선택 화면으로 라우팅.
    "사장님" / "스태프" 선택 카드 UI.
    사장님 선택 → /onboarding (기존 플로우)으로 이동.
    스태프 선택 → /register/staff-info로 이동.
  </action>
  <verify>로그인 후 역할 선택 화면 표시, 각 선택에 따라 올바른 화면으로 이동</verify>
  <done>역할 선택 → 분기 라우팅 동작</done>
</task>

<task type="auto">
  <name>스태프 정보 입력 + 초대 코드 화면</name>
  <files>
    apps/admin/app/register/staff-info.tsx (신규)
    apps/admin/app/register/invite-code.tsx (신규)
  </files>
  <action>
    스태프 기본 정보 입력 화면 (이름, 연락처 등).
    초대 코드 입력 화면 (Phase 1에서는 UI만, 실제 검증은 Phase 2).
    registerUser mutation 호출하여 User 생성.
  </action>
  <verify>스태프 정보 입력 → 초대 코드 입력 → User 생성 확인</verify>
  <done>스태프 회원가입 플로우 UI 동작 (코드 검증은 Phase 2)</done>
</task>

<task type="auto">
  <name>라우팅 가드 업데이트</name>
  <files>
    apps/admin/app/_layout.tsx
    apps/admin/providers/session.tsx
  </files>
  <action>
    인증 상태를 3단계로 분리:
    1. 비로그인 → /signin
    2. 로그인했지만 User 미등록 → /register/role-select
    3. 로그인 + User 등록 완료 → /(authenticated)
    me 쿼리로 User 등록 여부 판단.
  </action>
  <verify>각 상태에서 올바른 화면으로 리다이렉트 확인</verify>
  <done>3단계 인증 가드 동작</done>
</task>
