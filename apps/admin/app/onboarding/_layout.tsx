import { BackgroundLayout } from '@hosspie/design-system/organisms/background-layout';
import { ProgressBar } from '@hosspie/design-system/organisms/progress-bar';
import { FormProvider } from '@hosspie/services/form';
import { DinnerPartyType, CreateRoomInput } from '@hosspie/types';
import { Stack, usePathname } from 'expo-router';
import React from 'react';

type OnboardingPath =
  | '/onboarding/description'
  | '/onboarding/information'
  | '/onboarding/dinner-party'
  | '/onboarding/rooms';

const ONBOARDING_PROGRESS_VALUE_MAP: Record<OnboardingPath, number> = {
  '/onboarding/description': 25,
  '/onboarding/information': 50,
  '/onboarding/dinner-party': 75,
  '/onboarding/rooms': 100,
};

export interface IOnboardingFormData {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  dinnerParty: { type: DinnerPartyType; description?: string };
  rooms: Record<string, CreateRoomInput>;
}

const OnboardingLayout = () => {
  const pathname = usePathname() as OnboardingPath;

  const progress = ONBOARDING_PROGRESS_VALUE_MAP[pathname];

  return (
    <BackgroundLayout>
      <FormProvider<IOnboardingFormData>>
        <ProgressBar value={progress} caption={pathname} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'black' } }} />
      </FormProvider>
    </BackgroundLayout>
  );
};

export default OnboardingLayout;
