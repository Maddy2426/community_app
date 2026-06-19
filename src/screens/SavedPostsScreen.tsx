import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header, Loader } from '@/components';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { useSavedPosts } from '@/hooks/useAppActions';
import { useTheme } from '@/hooks/useTheme';
import SavedPostsListSection from '@/sections/saved/SavedPostsListSection';

export default function SavedPostsScreen() {
  const { colors } = useTheme();
  const isLoading = useAppSelector((state) => state.posts.isLoading);
  const { savedPosts } = useSavedPosts();

  if (isLoading && savedPosts.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Saved " subtitle="0 saved" />
        <Loader />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Saved " subtitle={`${savedPosts.length} saved`} />
      <SavedPostsListSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
