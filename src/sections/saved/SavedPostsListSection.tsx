import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { PostCard, EmptyState, Loader } from '@/components';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { usePosts, useSavedPosts } from '@/hooks/useAppActions';
import { useTheme } from '@/hooks/useTheme';
import { Post } from '@/types';

export default function SavedPostsListSection() {
  const { colors } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.posts.isLoading);
  const { savedPosts, savedPostIds, toggleSave, loadSavedPosts } = useSavedPosts();
  const { likePost, sharePost, loadPosts } = usePosts();
  const [refreshing, setRefreshing] = useState(false);

  const isFetching = refreshing || isLoading;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPosts();
    await loadSavedPosts();
    setRefreshing(false);
  }, [loadPosts, loadSavedPosts]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard
        post={item}
        currentUserId={user?.id}
        isSaved={savedPostIds.includes(item.id)}
        onLike={likePost}
        onSave={toggleSave}
        onShare={sharePost}
      />
    ),
    [user?.id, savedPostIds, likePost, toggleSave, sharePost]
  );

  const emptyComponent = useMemo(
    () => (
      <EmptyState
        icon="bookmark-outline"
        title="No saved posts"
        message="Posts you save will appear here"
      />
    ),
    []
  );

  const ListFooter = useMemo(() => {
    if (isFetching && savedPosts.length > 0) {
      return <Loader fullScreen={false} size="small" />;
    }
    return null;
  }, [isFetching, savedPosts.length]);

  return (
    <FlashList
      style={styles.listContainer}
      data={savedPosts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={emptyComponent}
      ListFooterComponent={ListFooter}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      contentContainerStyle={savedPosts.length === 0 ? styles.emptyList : styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
  },
});
