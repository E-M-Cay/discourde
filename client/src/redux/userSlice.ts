import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    username: string;
    serverUsername?: string;
    token?: string;
    activeServer?: number;
    user_id?: number;
    activeChannel?: number;
    activeVocalChannel?: number;
    home: boolean;
}

const initialUserState: UserState = {
    token: localStorage.getItem('token')
        ? (localStorage.getItem('token') as string)
        : undefined,
    username: '',
    home: true,
};

export const userSlice = createSlice({
    initialState: initialUserState,
    name: 'user',
    reducers: {
        setIsHome: (state, action: PayloadAction<boolean>) => {
            state.home = action.payload;
        },
        setUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
        setServerUsername: (state, action: PayloadAction<string>) => {
            state.serverUsername = action.payload;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        setActiveServer: (state, action: PayloadAction<number>) => {
            state.activeServer = action.payload;
        },
        setUserId: (state, action: PayloadAction<number>) => {
            state.user_id = action.payload;
        },
        setActiveChannel: (state, action: PayloadAction<number>) => {
            state.activeChannel = action.payload;
        },
        setActiveVocalChannel: (state, action: PayloadAction<number>) => {
            state.activeVocalChannel = action.payload;
        },
    },
});

export const {
    setIsHome,
    setUsername,
    setToken,
    setActiveServer,
    setUserId,
    setActiveChannel,
    setServerUsername,
    setActiveVocalChannel,
} = userSlice.actions;

export default userSlice.reducer;
