import { Stack } from 'expo-router';

import { AuthGate } from '@/navigation/AuthGate';

export function RootNavigator() {
  return (
    <AuthGate>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="comments/[postId]"
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </AuthGate>
  );
}
