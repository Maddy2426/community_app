import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CommunityMessage = {
  id: string;
  text?: string;
  authorId?: string;
  authorName?: string;
  uri?: string;
  fileName?: string;
  createdAt: string;
};

type CommunityState = {
  // messages keyed by authorId so they don't appear globally in Home
  messagesByAuthor: Record<string, CommunityMessage[]>;
  isLoading: boolean;
  error?: string | null;
};

const initialState: CommunityState = {
  messagesByAuthor: {},
  isLoading: false,
  error: null,
};

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
      if (!action.payload) state.error = null;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setMessagesForAuthor(
      state,
      action: PayloadAction<{ authorId: string; messages: CommunityMessage[] }>,
    ) {
      state.messagesByAuthor[action.payload.authorId] = action.payload.messages;
    },
    addMessageForAuthor(
      state,
      action: PayloadAction<{ authorId: string; message: CommunityMessage }>,
    ) {
      const { authorId, message } = action.payload;
      if (!state.messagesByAuthor[authorId])
        state.messagesByAuthor[authorId] = [];
      state.messagesByAuthor[authorId].push(message);
    },
    clearMessagesForAuthor(state, action: PayloadAction<{ authorId: string }>) {
      delete state.messagesByAuthor[action.payload.authorId];
    },
  },
});

export const {
  setLoading,
  setError,
  setMessagesForAuthor,
  addMessageForAuthor,
  clearMessagesForAuthor,
} = communitySlice.actions;

export const selectMessagesByAuthor = (state: any, authorId: string) =>
  state.community?.messagesByAuthor?.[authorId] ?? [];

export default communitySlice.reducer;
