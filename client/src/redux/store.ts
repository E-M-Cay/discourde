import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

const rootReducer = combineReducers({ userReducer });
export type RootState = ReturnType<typeof rootReducer>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});
export type AppDispatch = typeof store.dispatch;
