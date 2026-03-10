#!/bin/bash

# 📚 타입 시스템 검증 스크립트
# 단일 타입 파일 원칙을 따르는지 확인합니다.

set -e

echo "🔍 타입 시스템 검증 중..."
echo ""

# 1. 직접 enum 정의 확인
echo "✅ 1. 직접 enum 정의 확인 중..."
ENUM_DEFS=$(grep -r "^export enum " apps/api/src apps/admin/app --include="*.ts" --include="*.tsx" 2>/dev/null || true)

if [ -n "$ENUM_DEFS" ]; then
  echo "❌ 발견된 직접 enum 정의:"
  echo "$ENUM_DEFS"
  exit 1
else
  echo "   ✓ 직접 enum 정의 없음"
fi

# 2. 중복 타입 정의 확인
echo ""
echo "✅ 2. 중복 타입 정의 확인 중..."
TYPE_DEFS=$(grep -r "^export type Gender\|^export type DinnerPartyType\|^export type OnboardingStatus" apps/api/src apps/admin/app --include="*.ts" --include="*.tsx" 2>/dev/null || true)

if [ -n "$TYPE_DEFS" ]; then
  echo "❌ 발견된 중복 타입 정의:"
  echo "$TYPE_DEFS"
  exit 1
else
  echo "   ✓ 중복 타입 정의 없음"
fi

# 3. @hosspie/database import 확인
echo ""
echo "✅ 3. @hosspie/database import 사용 확인 중..."
DB_IMPORTS_API=$(grep -r "@hosspie/database" apps/api/src --include="*.ts" 2>/dev/null | wc -l | tr -d ' ')
DB_IMPORTS_CLIENT=$(grep -r "@hosspie/database" apps/admin/app --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')

echo "   ✓ API: ${DB_IMPORTS_API}개 파일에서 @hosspie/database 사용"
echo "   ✓ Client: ${DB_IMPORTS_CLIENT}개 파일에서 @hosspie/database 사용 (0이어야 함)"

if [ "$DB_IMPORTS_CLIENT" -gt 0 ]; then
  echo "❌ 클라이언트에서 @hosspie/database를 직접 import하면 안됩니다!"
  grep -r "@hosspie/database" apps/admin/app --include="*.ts" --include="*.tsx" 2>/dev/null
  exit 1
fi

# 4. @hosspie/types import 확인
echo ""
echo "✅ 4. @hosspie/types import 사용 확인 중..."
TYPES_IMPORTS=$(grep -r "@hosspie/types" apps/admin/app --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')

echo "   ✓ Client: ${TYPES_IMPORTS}개 파일에서 @hosspie/types 사용"

# 5. TypeScript 타입 체크
echo ""
echo "✅ 5. TypeScript 타입 체크 중..."
pnpm --filter @hosspie/types tsc --noEmit
pnpm --filter @hosspie/admin tsc --noEmit
pnpm --filter @hosspie/api tsc --noEmit

echo ""
echo "✅ 모든 검증 통과!"
echo ""
echo "📊 요약:"
echo "   • 직접 enum 정의: 0개 ✅"
echo "   • 중복 타입 정의: 0개 ✅"
echo "   • API @hosspie/database 사용: ${DB_IMPORTS_API}개 ✅"
echo "   • Client @hosspie/database 사용: ${DB_IMPORTS_CLIENT}개 ✅"
echo "   • Client @hosspie/types 사용: ${TYPES_IMPORTS}개 ✅"
echo "   • TypeScript 타입 체크: 통과 ✅"
