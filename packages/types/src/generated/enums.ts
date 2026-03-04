// 📚 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
// Prisma Schema에서 enum을 추출하여 TypeScript enum으로 변환합니다.
//
// 생성 명령어: pnpm codegen:types
// 원본: packages/database/prisma/schema.prisma

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  REGARDLESS = 'REGARDLESS',
}

export enum DinnerPartyType {
  POT_LUCK = 'POT_LUCK',
  HOST_SERVED = 'HOST_SERVED',
  CUSTOM = 'CUSTOM',
}

export enum OnboardingStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}
