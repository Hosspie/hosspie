# Phase 1-2: NestJS 인증 가드 + 역할 시스템

## 개요
NestJS에서 Supabase JWT를 검증하는 Guard를 만들고, User 모델에 역할을 추가하여 사장님/스태프 접근 제어를 구현한다.

## 태스크

<task type="auto">
  <name>DB 스키마: User 역할 추가</name>
  <files>
    packages/database/prisma/schema.prisma
  </files>
  <action>
    UserRole enum 추가 (OWNER, STAFF).
    User 모델에 role 필드 추가.
    User.id를 Supabase auth.users.id와 동일하게 사용하도록 변경 (CUID → String).
    name 필드 추가 (소셜 로그인에서 가져온 이름).
    db:push로 스키마 반영.
  </action>
  <verify>Prisma Studio에서 User 테이블에 role, name 필드 확인</verify>
  <done>User 모델에 role(OWNER/STAFF), name 필드 존재</done>
</task>

<task type="auto">
  <name>Supabase JWT Guard 구현</name>
  <files>
    apps/api/src/common/guards/supabase-auth.guard.ts (신규)
    apps/api/src/common/decorators/current-user.decorator.ts (신규)
    apps/api/package.json
  </files>
  <action>
    jsonwebtoken, jwks-rsa 설치.
    SupabaseAuthGuard: Authorization 헤더에서 JWT 추출 → JWKS 엔드포인트로 검증 → request.user에 payload 저장.
    @CurrentUser() 데코레이터: request.user.sub (Supabase user ID) 반환.
    JWKS 캐시 설정 (10분).
  </action>
  <verify>유효한 JWT로 API 호출 → 성공, 잘못된 JWT → 401 에러</verify>
  <done>Guard가 JWT 검증하고 userId를 리졸버에 전달</done>
</task>

<task type="auto">
  <name>기존 리졸버 인증 적용</name>
  <files>
    apps/api/src/modules/guesthouse/guesthouse.resolver.ts
    apps/api/src/app.module.ts
  </files>
  <action>
    guesthouse.resolver.ts: temp-user-id 3곳을 @CurrentUser() 데코레이터로 교체.
    Guard를 글로벌 또는 리졸버 단위로 적용.
    인증 없이 접근 가능한 엔드포인트용 @Public() 데코레이터 추가 (health check 등).
  </action>
  <verify>로그인 후 myGuesthouse 쿼리 → 본인 데이터만 반환, 토큰 없이 → 401</verify>
  <done>모든 리졸버가 인증된 사용자 기반으로 동작</done>
</task>
