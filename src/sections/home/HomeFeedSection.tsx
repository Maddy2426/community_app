import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { PostCard, Loader, EmptyState } from '@/components';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { usePosts, useSavedPosts } from '@/hooks/useAppActions';
import { useTheme } from '@/hooks/useTheme';
import { setSearchQuery } from '@/store/postsSlice';
import { Post } from '@/types';
import HomeSearchSection from '@/sections/home/HomeSearchSection';

export default function HomeFeedSection() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const { posts, isLoadingMore, hasMore, searchQuery } = useAppSelector((state) => state.posts);
  const { savedPostIds, loadSavedPosts, toggleSave } = useSavedPosts();
  const { loadPosts, likePost, sharePost, loadMorePosts } = usePosts();
  const [refreshing, setRefreshing] = useState(false);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const query = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.description.toLowerCase().includes(query) ||
        p.authorUsername.toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPosts();
    await loadSavedPosts();
    setRefreshing(false);
  }, [loadPosts, loadSavedPosts]);

  const handleSearch = useCallback(
    (text: string) => {
      dispatch(setSearchQuery(text));
    },
    [dispatch]
  );

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

  const handleEndReached = useCallback(() => {
    if (!searchQuery.trim() && hasMore && !isLoadingMore) {
      loadMorePosts();
    }
  }, [loadMorePosts, searchQuery, hasMore, isLoadingMore]);

  const ListHeader = useMemo(
    () => <HomeSearchSection searchQuery={searchQuery} onSearch={handleSearch} />,
    [searchQuery, handleSearch]
  );

  const ListFooter = useMemo(() => {
    if (isLoadingMore && hasMore && !searchQuery.trim()) {
      return <Loader fullScreen={false} size="small" />;
    }
    return null;
  }, [isLoadingMore, hasMore, searchQuery]);

  return (
    <FlashList
      style={styles.listContainer}
      data={filteredPosts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={ListFooter}
      ListEmptyComponent={
        <EmptyState
          icon="newspaper-outline"
          title="No posts found"
          message={searchQuery ? 'Try a different search term' : 'Be the first to create a post!'}
        />
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3}
      contentContainerStyle={filteredPosts.length === 0 ? styles.emptyList : styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  list: {
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
  },
});
