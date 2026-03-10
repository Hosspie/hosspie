import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class OnboardingStatusResponse {
  @Field()
  isCompleted: boolean;
}
