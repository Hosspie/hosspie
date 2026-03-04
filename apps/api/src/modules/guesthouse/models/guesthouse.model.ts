import { DinnerPartyType, OnboardingStatus } from '@hosspie/database';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

import { Room } from './room.model';

registerEnumType(DinnerPartyType, {
  name: 'DinnerPartyType',
  description: 'Type of dinner party offered',
});

registerEnumType(OnboardingStatus, {
  name: 'OnboardingStatus',
  description: 'Onboarding completion status',
});

@ObjectType()
export class Guesthouse {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  address: string;

  @Field()
  phone: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  website?: string;

  @Field(() => DinnerPartyType)
  dinnerPartyType: DinnerPartyType;

  @Field({ nullable: true })
  dinnerPartyDescription?: string;

  @Field(() => OnboardingStatus)
  onboardingStatus: OnboardingStatus;

  @Field(() => [Room])
  rooms: Room[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
