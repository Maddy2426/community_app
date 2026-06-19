import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { PostCard, EmptyState, Loader } from '@/components';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { useSavedPosts, usePosts } from '@/hooks/useAppActions';
import { useTheme } from '@/hooks/useTheme';
import { Post } from '@/types';
import ProfileInfoSection from '@/sections/profile/ProfileInfoSection';
import { ProfilePostFilter } from '@/sections/profile/ProfilePostToggleSection';

export default function ProfilePostsListSection() {
  const { colors } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const posts = useAppSelector((state) => state.posts.posts);
  const isLoading = useAppSelector((state) => state.posts.isLoading);
  const { savedPosts, savedPostIds, toggleSave, loadSavedPosts } = useSavedPosts();
  const { likePost, sharePost, loadPosts } = usePosts();
  const [refreshing, setRefreshing] = useState(false);
  const [postFilter, setPostFilter] = useState<ProfilePostFilter>('text');

  const isFetching = refreshing || isLoading;

  const userPosts = useMemo(
    () =>
      posts
        .filter((p) => p.authorId === user?.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [posts, user?.id]
  );

  const textPosts = useMemo(() => userPosts.filter((post) => !post.imageUri), [userPosts]);
  const imagePosts = useMemo(() => userPosts.filter((post) => !!post.imageUri), [userPosts]);

  const filteredPosts = useMemo(
    () => (postFilter === 'text' ? textPosts : imagePosts),
    [postFilter, textPosts, imagePosts]
  );

  const stats = useMemo(
    () => ({
      totalPosts: userPosts.length,
      totalLikes: userPosts.reduce((sum, p) => sum + p.likes.length, 0),
      savedCount: savedPosts.length,
    }),
    [userPosts, savedPosts.length]
  );

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

  const ListHeader = useMemo(
    () => (
      <ProfileInfoSection
        postFilter={postFilter}
        textCount={textPosts.length}
        photoCount={imagePosts.length}
        onFilterChange={setPostFilter}
        stats={stats}
      />
    ),
    [postFilter, textPosts.length, imagePosts.length, stats]
  );

  const ListFooter = useMemo(() => {
    if (!isFetching || filteredPosts.length === 0) return null;
    return <Loader fullScreen={false} size="small" />;
  }, [isFetching, filteredPosts.length]);

  const emptyComponent = useMemo(
    () => (
      <EmptyState
        icon={postFilter === 'text' ? 'document-text-outline' : 'image-outline'}
        title={postFilter === 'text' ? 'No text posts' : 'No photo posts'}
        message={
          postFilter === 'text'
            ? 'Create a text-only post from the Create tab'
            : 'Create a post with a photo from the Create tab'
        }
      />
    ),
    [postFilter]
  );

  return (
    <FlashList
      style={styles.listContainer}
      data={filteredPosts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      extraData={postFilter}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={ListFooter}
      ListEmptyComponent={emptyComponent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 32,
  },
});
