import { DinnerPartyType } from '@hosspie/database';
import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsUrl,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  MinLength,
  MaxLength,
} from 'class-validator';

import { CreateRoomInput } from './create-room.input';

@InputType()
export class CreateGuesthouseInput {
  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @Field()
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  description: string;

  @Field()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  address: string;

  @Field()
  @IsString()
  @MinLength(9)
  @MaxLength(20)
  phone: string;

  @Field()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  @MaxLength(200)
  website?: string;

  @Field(() => DinnerPartyType)
  @IsEnum(DinnerPartyType)
  dinnerPartyType: DinnerPartyType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  dinnerPartyDescription?: string;

  @Field(() => [CreateRoomInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoomInput)
  rooms: CreateRoomInput[];
}
