export interface User {
  id: string;
  username: string;
  emailOrMobile: string;
  avatar?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorUsername: string;
  authorAvatar?: string;
  message: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorUsername: string;
  authorAvatar?: string;
  description: string;
  imageUri?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface PostsState {
  posts: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  searchQuery: string;
  hasMore: boolean;
  page: number;
}

export interface SavedPostsState {
  savedPostIds: string[];
}

export interface RootState {
  auth: AuthState;
  posts: PostsState;
  savedPosts: SavedPostsState;
}

export type ThemeMode = 'light' | 'dark';
