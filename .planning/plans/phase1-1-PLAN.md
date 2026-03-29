# Phase 1-1: Supabase Auth 인프라 + 소셜 로그인

## 개요
Supabase Auth 클라이언트 설정, Apple/Google 네이티브 로그인, 세션 관리를 구현한다.

## 태스크

<task type="auto">
  <name>Supabase 클라이언트 설정</name>
  <files>
    apps/admin/lib/supabase/client.ts (신규)
    apps/admin/package.json
  </files>
  <action>
    @supabase/supabase-js, expo-sqlite 설치.
    Supabase 클라이언트 초기화 (expo-sqlite/localStorage 스토리지, autoRefreshToken, detectSessionInUrl: false).
    AppState 리스너로 토큰 자동 갱신.
  </action>
  <verify>Supabase 클라이언트가 import 가능하고 세션 상태 조회 동작</verify>
  <done>supabase.auth.getSession() 호출 가능</done>
</task>

<task type="auto">
  <name>Apple Sign-In 구현 (iOS)</name>
  <files>
    apps/admin/lib/supabase/auth.ts (신규)
    apps/admin/app/signin.tsx
    apps/admin/package.json
    app.json
  </files>
  <action>
    expo-apple-authentication 설치.
    signInWithApple() 함수: Apple 네이티브 인증 → identityToken 획득 → supabase.auth.signInWithIdToken({ provider: 'apple', token }).
    최초 로그인 시 fullName 즉시 저장.
    signin.tsx에서 iOS일 때 Apple 버튼 렌더링.
  </action>
  <verify>iOS에서 Apple 로그인 → Supabase 세션 생성 확인</verify>
  <done>Apple 로그인 후 supabase.auth.getSession()에서 유저 정보 반환</done>
</task>

<task type="auto">
  <name>Google Sign-In 구현 (Android)</name>
  <files>
    apps/admin/lib/supabase/auth.ts
    apps/admin/app/signin.tsx
    apps/admin/package.json
    app.json
  </files>
  <action>
    @react-native-google-signin/google-signin 설치 + Expo config plugin 추가.
    signInWithGoogle() 함수: GoogleSignin.configure(webClientId) → signIn() → idToken 획득 → supabase.auth.signInWithIdToken({ provider: 'google', token }).
    signin.tsx에서 Android일 때 Google 버튼 렌더링.
  </action>
  <verify>Android에서 Google 로그인 → Supabase 세션 생성 확인</verify>
  <done>Google 로그인 후 supabase.auth.getSession()에서 유저 정보 반환</done>
</task>

<task type="auto">
  <name>세션 Provider 교체</name>
  <files>
    apps/admin/providers/session.tsx
    apps/admin/lib/apollo/client.ts
  </files>
  <action>
    기존 placeholder signIn/signOut을 Supabase Auth로 교체.
    supabase.auth.onAuthStateChange() 리스너로 세션 상태 추적.
    Apollo Client auth link: supabase.auth.getSession()에서 access_token 주입.
    signOut: supabase.auth.signOut() 호출.
  </action>
  <verify>로그인→앱 재시작→세션 유지 확인, 로그아웃→세션 제거 확인</verify>
  <done>Supabase 세션 기반으로 앱 인증 상태 관리 동작</done>
</task>
