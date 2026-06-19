import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/authSlice';
import postsReducer from '@/store/postsSlice';
import savedPostsReducer from '@/store/savedPostsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    savedPosts: savedPostsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
