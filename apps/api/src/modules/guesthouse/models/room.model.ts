import { Gender } from '@hosspie/database';
import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';

registerEnumType(Gender, {
  name: 'Gender',
  description: 'Gender restriction for room',
});

@ObjectType()
export class Room {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
  capacity: number;

  @Field(() => Gender)
  gender: Gender;

  @Field()
  hasBathroom: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
