import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { Loader } from '@/components';
import { useAuth, usePosts, useSavedPosts } from '@/hooks/useAppActions';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, loadUser } = useAuth();
  const { loadPosts } = usePosts();
  const { loadSavedPosts } = useSavedPosts();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
      loadSavedPosts();
    }
  }, [isAuthenticated, loadPosts, loadSavedPosts]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}
