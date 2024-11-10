// userSlice.ts

import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../model/userTypes';

export interface UserState {
    user: IUser | null;
    users: IUser[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UserState = {
    user: null,
    users: [],
    status: 'idle',
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.status = 'succeeded';
            state.error = null;
        },
        setAllUsers: (state, action) => {
            state.users = action.payload;
        },
        setLoading: (state) => {
            state.status = 'loading';
            state.error = null;
        },
        setError: (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        },
    },
});

export const { setUser, setLoading, setError, setAllUsers } = userSlice.actions;
export default userSlice.reducer;
