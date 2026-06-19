import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SavedPostsState } from '@/types';

const initialState: SavedPostsState = {
  savedPostIds: [],
};

const savedPostsSlice = createSlice({
  name: 'savedPosts',
  initialState,
  reducers: {
    setSavedPostIds: (state, action: PayloadAction<string[]>) => {
      state.savedPostIds = action.payload;
    },
    toggleSavePost: (state, action: PayloadAction<string>) => {
      const index = state.savedPostIds.indexOf(action.payload);
      if (index >= 0) {
        state.savedPostIds.splice(index, 1);
      } else {
        state.savedPostIds.push(action.payload);
      }
    },
    removeSavedPost: (state, action: PayloadAction<string>) => {
      state.savedPostIds = state.savedPostIds.filter((id) => id !== action.payload);
    },
  },
});

export const { setSavedPostIds, toggleSavePost, removeSavedPost } = savedPostsSlice.actions;
export default savedPostsSlice.reducer;
