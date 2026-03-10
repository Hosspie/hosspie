import { InputType, PartialType } from '@nestjs/graphql';

import { CreateGuesthouseInput } from './create-guesthouse.input';

@InputType()
export class UpdateGuesthouseInput extends PartialType(CreateGuesthouseInput) {}
