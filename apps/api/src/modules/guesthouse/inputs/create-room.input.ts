import { Gender } from '@hosspie/database';
import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateRoomInput {
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(10)
  capacity: number;

  @Field(() => Gender)
  @IsEnum(Gender)
  gender: Gender;

  @Field()
  @IsBoolean()
  hasBathroom: boolean;
}
