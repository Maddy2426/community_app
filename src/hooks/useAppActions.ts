import { useCallback } from 'react';
import { Alert, Share } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { loginSuccess, logout, setLoading } from '@/store/authSlice';
import {
  setPosts,
  setLoading as setPostsLoading,
  setLoadingMore,
  addPost,
  toggleLike,
  addComment,
  deleteComment,
  appendPosts,
  setHasMore,
  incrementPage,
  resetPage,
} from '@/store/postsSlice';
import { setSavedPostIds, toggleSavePost, removeSavedPost } from '@/store/savedPostsSlice';
import { RootState, store } from '@/store';
import { getInitialPosts, generateMockPosts, buildInitialFeed } from '@/services/mockDataService';
import { User, Post } from '@/types';
import { storageService } from '@/services/storageService';
import { generateId } from '@/utils/helpers';
import { MOCK_POSTS_PAGE_SIZE, FEED_POST_COUNT } from '@/utils/constants';

const getPostsFromStore = () => store.getState().posts.posts;

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const loadUser = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const user = await storageService.getUser();
      if (user) {
        dispatch(loginSuccess(user));
      } else {
        dispatch(setLoading(false));
      }
    } catch {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const login = useCallback(
    async (username: string, emailOrMobile: string) => {
      const user: User = {
        id: generateId(),
        username: username.trim(),
        emailOrMobile: emailOrMobile.trim(),
        createdAt: new Date().toISOString(),
      };
      await storageService.saveUser(user);
      dispatch(loginSuccess(user));
    },
    [dispatch]
  );

  const signOut = useCallback(async () => {
    await storageService.removeUser();
    dispatch(logout());
  }, [dispatch]);

  return { ...auth, loadUser, login, signOut };
};

export const usePosts = () => {
  const dispatch = useAppDispatch();
  const postsState = useAppSelector((state: RootState) => state.posts);
  const user = useAppSelector((state: RootState) => state.auth.user);

  const loadPosts = useCallback(async () => {
    dispatch(setPostsLoading(true));
    try {
      const feedVersion = await storageService.getFeedVersion();
      const saved = await storageService.getPosts();
      let posts: Post[];

      if (feedVersion !== '2') {
        posts = buildInitialFeed(saved);
        await storageService.savePosts(posts);
        await storageService.setFeedVersion('2');
      } else {
        posts = saved && saved.length > 0 ? saved : getInitialPosts();
        if (!saved || saved.length === 0) {
          await storageService.savePosts(posts);
        }
      }

      dispatch(setPosts(posts));
      dispatch(setHasMore(posts.length < FEED_POST_COUNT));
      dispatch(resetPage());
    } catch {
      dispatch(setPosts(getInitialPosts()));
      dispatch(setHasMore(true));
    } finally {
      dispatch(setPostsLoading(false));
    }
  }, [dispatch]);

  const persistPosts = useCallback(async (posts: Post[]) => {
    await storageService.savePosts(posts);
  }, []);

  const createPost = useCallback(
    async (description: string, imageUri?: string) => {
      if (!user) return;
      const post: Post = {
        id: generateId(),
        authorId: user.id,
        authorUsername: user.username,
        authorAvatar: user.avatar,
        description: description.trim(),
        imageUri,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      };
      dispatch(addPost(post));
      await storageService.savePosts(getPostsFromStore());
    },
    [dispatch, user]
  );

  const likePost = useCallback(
    async (postId: string) => {
      if (!user) return;
      dispatch(toggleLike({ postId, userId: user.id }));
      await storageService.savePosts(getPostsFromStore());
    },
    [dispatch, user]
  );

  const commentOnPost = useCallback(
    async (postId: string, message: string) => {
      if (!user) return;
      dispatch(
        addComment({
          postId,
          authorId: user.id,
          authorUsername: user.username,
          authorAvatar: user.avatar,
          message,
        })
      );
      await storageService.savePosts(getPostsFromStore());
    },
    [dispatch, user]
  );

  const removeComment = useCallback(
    async (postId: string, commentId: string) => {
      dispatch(deleteComment({ postId, commentId }));
      await storageService.savePosts(getPostsFromStore());
    },
    [dispatch]
  );

  const loadMorePosts = useCallback(async () => {
    if (!postsState.hasMore || postsState.isLoadingMore) return;

    const remaining = FEED_POST_COUNT - postsState.posts.length;
    if (remaining <= 0) {
      dispatch(setHasMore(false));
      return;
    }

    dispatch(setLoadingMore(true));
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const count = Math.min(MOCK_POSTS_PAGE_SIZE, remaining);
      const newPosts = generateMockPosts(count, postsState.posts.length);
      dispatch(appendPosts(newPosts));
      dispatch(incrementPage());
      const total = getPostsFromStore().length;
      dispatch(setHasMore(total < FEED_POST_COUNT));
      await storageService.savePosts(getPostsFromStore());
    } finally {
      dispatch(setLoadingMore(false));
    }
  }, [dispatch, postsState.hasMore, postsState.isLoadingMore, postsState.posts.length]);

  const sharePost = useCallback(async (post: Post) => {
    try {
      await Share.share({
        message: `${post.authorUsername}: ${post.description}`,
        title: 'Share Post',
      });
    } catch {
      Alert.alert('Share', 'Post shared successfully!');
    }
  }, []);

  return {
    ...postsState,
    loadPosts,
    createPost,
    likePost,
    commentOnPost,
    removeComment,
    loadMorePosts,
    sharePost,
    persistPosts,
  };
};

export const useSavedPosts = () => {
  const dispatch = useAppDispatch();
  const savedPostIds = useAppSelector((state) => state.savedPosts.savedPostIds);
  const posts = useAppSelector((state) => state.posts.posts);

  const loadSavedPosts = useCallback(async () => {
    const ids = await storageService.getSavedPostIds();
    if (ids) dispatch(setSavedPostIds(ids));
  }, [dispatch]);

  const toggleSave = useCallback(
    async (postId: string) => {
      dispatch(toggleSavePost(postId));
      const updated = savedPostIds.includes(postId)
        ? savedPostIds.filter((id) => id !== postId)
        : [...savedPostIds, postId];
      await storageService.saveSavedPostIds(updated);
    },
    [dispatch, savedPostIds]
  );

  const unsave = useCallback(
    async (postId: string) => {
      dispatch(removeSavedPost(postId));
      const updated = savedPostIds.filter((id) => id !== postId);
      await storageService.saveSavedPostIds(updated);
    },
    [dispatch, savedPostIds]
  );

  const savedPosts = posts.filter((p) => savedPostIds.includes(p.id));

  return { savedPostIds, savedPosts, loadSavedPosts, toggleSave, unsave };
};
