// authenticateUserThunk.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { setAllUsers, setError, setLoading, setUser } from '../slice/userSlice';

export const authenticateUserThunk = createAsyncThunk(
    'user/authenticate',
    async ({ name, password }: { name: string, password: string }, { dispatch }) => {
        try {
            dispatch(setLoading());
            const response = await fetch('https://66df0bcfde4426916ee36061.mockapi.io/exchangeApi/users');
            const users = await response.json();

            const user = users.find((u: { name: string, password: string }) => u.name === name && u.password === password);
            dispatch(setAllUsers(users));
            if (user) {
                dispatch(setUser(user));
                return user;
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error: any) {
            dispatch(setError('Failed to authenticate'));
            throw error;
        }
    }
);
