import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  rooms: string[];
  username: string;
}

const initialUserState: UserState = {
  rooms: [],
  username: '',
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
  },
});

export const { joinRoomSuccess, setUsername } = userSlice.actions;

export default userSlice.reducer;
