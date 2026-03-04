import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { GuesthouseService } from './guesthouse.service';
import { CreateGuesthouseInput, UpdateGuesthouseInput } from './inputs';
import { Guesthouse, OnboardingStatusResponse } from './models';

@Resolver(() => Guesthouse)
export class GuesthouseResolver {
  constructor(private readonly guesthouseService: GuesthouseService) {}

  @Mutation(() => Guesthouse, { name: 'createOnboarding' })
  async createOnboarding(@Args('input') input: CreateGuesthouseInput) {
    // TODO: Get userId from context after auth implementation
    const userId = 'temp-user-id';
    return this.guesthouseService.createOnboarding(userId, input);
  }

  @Query(() => OnboardingStatusResponse, { name: 'onboardingStatus' })
  async checkOnboardingStatus() {
    // TODO: Get userId from context after auth implementation
    const userId = 'temp-user-id';
    return this.guesthouseService.checkOnboardingStatus(userId);
  }

  @Query(() => Guesthouse, { name: 'myGuesthouse', nullable: true })
  async findMyGuesthouse() {
    // TODO: Get userId from context after auth implementation
    const userId = 'temp-user-id';
    return this.guesthouseService.findByUserId(userId);
  }

  @Query(() => Guesthouse, { name: 'guesthouse' })
  async findById(@Args('id', { type: () => ID }) id: string) {
    return this.guesthouseService.findById(id);
  }

  @Mutation(() => Guesthouse, { name: 'updateGuesthouse' })
  async update(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateGuesthouseInput
  ) {
    return this.guesthouseService.update(id, input);
  }
}
