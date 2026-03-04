// 📚 중앙 타입 패키지
// 모든 타입과 enum을 이 패키지에서 import하세요.
//
// 사용 예시:
//   import { Gender, DinnerPartyType, CreateRoomInput } from '@hosspie/types';

// GraphQL 타입 (자동 생성 - union type으로 타입으로만 사용)
export * from './generated/graphql';

// Prisma Enum 객체 (자동 생성 - 런타임 값으로 사용 가능)
// GraphQL의 union type과 이름이 같지만, enum 객체가 우선합니다.
export {
  Gender,
  DinnerPartyType,
  OnboardingStatus,
} from './generated/enums';
