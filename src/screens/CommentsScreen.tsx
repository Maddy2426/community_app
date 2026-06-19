import React, { useMemo } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header, EmptyState } from '@/components';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { useTheme } from '@/hooks/useTheme';
import CommentsListSection from '@/sections/comments/CommentsListSection';
import CommentsInputSection from '@/sections/comments/CommentsInputSection';

export default function CommentsScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const post = useAppSelector((state) => state.posts.posts.find((p) => p.id === postId));

  const comments = useMemo(() => post?.comments ?? [], [post?.comments]);

  if (!post || !postId) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Comments" showBack onBack={() => router.back()} />
        <EmptyState icon="alert-circle-outline" title="Post not found" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Comments"
        subtitle={`${comments.length} comments`}
        showBack
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={0}
      >
        <CommentsListSection postId={postId} comments={comments} />
        <CommentsInputSection postId={postId} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
});
