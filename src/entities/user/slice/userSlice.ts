import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUser } from '../model/userTypes';

export interface UserState {
    user: IUser | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UserState = {
    user: null,
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

export const { setUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
