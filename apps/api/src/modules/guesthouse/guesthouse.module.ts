import { Module } from '@nestjs/common';

import { GuesthouseResolver } from './guesthouse.resolver';
import { GuesthouseService } from './guesthouse.service';

@Module({
  providers: [GuesthouseService, GuesthouseResolver],
  exports: [GuesthouseService],
})
export class GuesthouseModule {}
