# Phase 1 리서치: 인증 시스템

## 권장 아키텍처

네이티브 Sign-In + `signInWithIdToken()` 방식:

```
[Apple/Google 네이티브 SDK] → ID Token 획득
  ↓
supabase.auth.signInWithIdToken({ provider, token })
  ↓
Supabase가 사용자 생성/매칭 + JWT 세션 발급
  ↓
JWT를 Apollo Client auth link에 주입 → NestJS API 호출
  ↓
NestJS Guard에서 JWT 검증 → userId 추출
```

## 패키지

**Admin App:**
- `@supabase/supabase-js` — Supabase 클라이언트
- `expo-sqlite` — Supabase 세션 스토리지 (localStorage 폴리필)
- `expo-apple-authentication` — iOS Apple 로그인
- `@react-native-google-signin/google-signin` — Android Google 로그인

**API:**
- `@supabase/supabase-js` — JWT 검증용
- `jsonwebtoken` + `jwks-rsa` — JWKS 기반 JWT 검증

## 핵심 결정

| 항목 | 결정 |
|------|------|
| 세션 스토리지 | `expo-sqlite/localStorage` (SecureStore는 2KB 제한) |
| JWT 검증 | JWKS 엔드포인트 (ES256, 키 로테이션 자동) |
| 토큰 갱신 | AppState 리스너로 auto refresh |
| OAuth 방식 | expo-auth-session 아닌 네이티브 SDK (SDK 53 호환성) |

## 주의사항

- `@react-native-google-signin`은 Expo Go 불가 → Development Build 필수
- Apple은 최초 로그인 시에만 이름 제공 → 즉시 저장
- `GoogleSignin.configure()`에 Web Client ID 전달 (Android ID 아님)
- Supabase `detectSessionInUrl: false` 필수 (네이티브 앱)
