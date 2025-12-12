import { Redirect, Stack } from 'expo-router';

export default function AuthenticatedLayout() {
  console.log('authenticated layout');
  const isOnboardingCompleted = false;

  if (!isOnboardingCompleted) {
    return <Redirect href="/onboarding/description" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
