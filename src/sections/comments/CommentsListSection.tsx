import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, EmptyState } from '@/components';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { usePosts } from '@/hooks/useAppActions';
import { useTheme } from '@/hooks/useTheme';
import { Comment } from '@/types';
import { formatDateTime } from '@/utils/helpers';
import { BORDER_RADIUS } from '@/utils/theme';

interface CommentsListSectionProps {
  postId: string;
  comments: Comment[];
}

export default function CommentsListSection({ postId, comments }: CommentsListSectionProps) {
  const { colors } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const { removeComment } = usePosts();

  const handleDeleteComment = useCallback(
    (comment: Comment) => {
      Alert.alert('Delete Comment', 'Are you sure you want to delete this comment?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeComment(postId, comment.id),
        },
      ]);
    },
    [postId, removeComment]
  );

  const renderComment = useCallback(
    ({ item }: { item: Comment }) => {
      const isOwn = user?.id === item.authorId;
      return (
        <View style={[styles.commentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.commentHeader}>
            <Avatar name={item.authorUsername} uri={item.authorAvatar} size={36} />
            <View style={styles.commentMeta}>
              <Text style={[styles.commentAuthor, { color: colors.textPrimary }]}>
                {item.authorUsername}
              </Text>
              <Text style={[styles.commentTime, { color: colors.textMuted }]}>
                {formatDateTime(item.createdAt)}
              </Text>
            </View>
            {isOwn && (
              <TouchableOpacity onPress={() => handleDeleteComment(item)} hitSlop={8}>
                <Ionicons name="trash-outline" size={18} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={[styles.commentMessage, { color: colors.textPrimary }]}>{item.message}</Text>
        </View>
      );
    },
    [user?.id, colors, handleDeleteComment]
  );

  return (
    <FlashList
      style={styles.listContainer}
      data={comments}
      renderItem={renderComment}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <EmptyState
          icon="chatbubbles-outline"
          title="No comments yet"
          message="Be the first to comment!"
        />
      }
      contentContainerStyle={comments.length === 0 ? styles.emptyList : styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 8,
  },
  emptyList: {
    flexGrow: 1,
  },
  commentCard: {
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentMeta: {
    flex: 1,
    marginLeft: 10,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '700',
  },
  commentTime: {
    fontSize: 11,
    marginTop: 1,
  },
  commentMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 46,
  },
});
