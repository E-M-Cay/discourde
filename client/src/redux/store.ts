import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import peerReducer from './peerSlice';
import PeerMiddleware from './peerMiddleware';
const rootReducer = combineReducers({ userReducer, peerReducer });
export type RootState = ReturnType<typeof rootReducer>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(PeerMiddleware),
});
export type AppDispatch = typeof store.dispatch;
