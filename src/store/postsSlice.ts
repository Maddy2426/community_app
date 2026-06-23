import { Comment, Post, PostsState } from "@/types";
import { generateId } from "@/utils/helpers";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: PostsState = {
  posts: [],
  isLoading: false,
  isLoadingMore: false,
  error: null,
  searchQuery: "",
  hasMore: true,
  page: 1,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setLoadingMore: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMore = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addPost: (state, action: PayloadAction<any>) => {
      const p = action.payload;
      const post = {
        likes: [],
        comments: [],
        authorId: "unknown",
        authorUsername: "unknown",
        authorAvatar: undefined,
        ...p,
      };
      state.posts = state.posts ?? [];
      state.posts.unshift(post); // keep newest first
    },
    toggleLike: (
      state,
      action: PayloadAction<{ postId: string; userId: string }>,
    ) => {
      const post = state.posts.find((p) => p.id === action.payload.postId);
      if (post) {
        const index = post.likes.indexOf(action.payload.userId);
        if (index >= 0) {
          post.likes.splice(index, 1);
        } else {
          post.likes.push(action.payload.userId);
        }
      }
    },
    addComment: (
      state,
      action: PayloadAction<{
        postId: string;
        authorId: string;
        authorUsername: string;
        authorAvatar?: string;
        message: string;
      }>,
    ) => {
      const post = state.posts.find((p) => p.id === action.payload.postId);
      if (post) {
        const comment: Comment = {
          id: generateId(),
          postId: action.payload.postId,
          authorId: action.payload.authorId,
          authorUsername: action.payload.authorUsername,
          authorAvatar: action.payload.authorAvatar,
          message: action.payload.message,
          createdAt: new Date().toISOString(),
        };
        post.comments.push(comment);
      }
    },
    deleteComment: (
      state,
      action: PayloadAction<{ postId: string; commentId: string }>,
    ) => {
      const post = state.posts.find((p) => p.id === action.payload.postId);
      if (post) {
        post.comments = post.comments.filter(
          (c) => c.id !== action.payload.commentId,
        );
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    appendPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts.push(...action.payload);
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    resetPage: (state) => {
      state.page = 1;
    },
  },
});

export const {
  setPosts,
  setLoading,
  setLoadingMore,
  setError,
  addPost,
  toggleLike,
  addComment,
  deleteComment,
  setSearchQuery,
  appendPosts,
  setHasMore,
  incrementPage,
  resetPage,
} = postsSlice.actions;
export default postsSlice.reducer;
