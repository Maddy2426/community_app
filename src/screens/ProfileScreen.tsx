import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header, Loader } from '@/components';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { useTheme } from '@/hooks/useTheme';
import ProfileHeaderActionsSection from '@/sections/profile/ProfileHeaderActionsSection';
import ProfilePostsListSection from '@/sections/profile/ProfilePostsListSection';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const posts = useAppSelector((state) => state.posts.posts);
  const isLoading = useAppSelector((state) => state.posts.isLoading);

  const userPosts = posts.filter((p) => p.authorId === user?.id);

  if (!user) return null;

  if (isLoading && userPosts.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Profile" rightAction={<ProfileHeaderActionsSection />} />
        <Loader />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Profile" rightAction={<ProfileHeaderActionsSection />} />
      <ProfilePostsListSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
