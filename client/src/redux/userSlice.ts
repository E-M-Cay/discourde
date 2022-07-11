import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  rooms: string[];
  username: string;
  token: string;
}

const initialUserState: UserState = {
  rooms: [],
  username: '',
  token: '',
};

export const userSlice = createSlice({
  initialState: initialUserState,
  name: 'user',
  reducers: {
    joinRoomSuccess: (state, action: PayloadAction<string>) => {
      {
        state.rooms = [...state.rooms, action.payload];
      }
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
});

export const { joinRoomSuccess, setUsername } = userSlice.actions;

export default userSlice.reducer;
