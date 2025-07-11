import { Redirect } from 'expo-router';

export default function AuthenticatedScreen() {
  const isOnboardingCompleted = true;

  if (!isOnboardingCompleted) {
    return <Redirect href="/(authenticated)/onboarding" />;
  }

  return <Redirect href="/(authenticated)" />;
}
