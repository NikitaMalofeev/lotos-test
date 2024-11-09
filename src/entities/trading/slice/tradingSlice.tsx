// tradingRoomSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILot } from '../../lots/model/lotsTypes';
import { ITradingMember } from '../../user/model/userTypes';

interface TradingRoomState {
    lot: ILot | null;
    users: ITradingMember[];
    currentUserIndex: number;
    timeLeft: number; // in seconds
    inviteUserId: string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: TradingRoomState = {
    lot: null,
    users: [
        {
            id: '1',
            name: 'John Doe',
            avatar: 'https://example.com/avatar1.jpg',
            company: 'Company A',
            role: 'Buyer',
            lot: null as any, // Мы инициализируем позже
        },
        {
            id: '2',
            name: 'Jane Smith',
            avatar: 'https://example.com/avatar2.jpg',
            company: 'Company B',
            role: 'Seller',
            lot: null as any,
        },
    ],
    currentUserIndex: 0,
    timeLeft: 15, // 15 секунд
    inviteUserId: '',
    status: 'idle',
    error: null,
};

const tradingRoomSlice = createSlice({
    name: 'tradingRoom',
    initialState,
    reducers: {
        setLot(state, action: PayloadAction<ILot>) {
            state.lot = action.payload;
            // Обновляем lot у каждого пользователя
            state.users = state.users.map((user) => ({
                ...user,
                lot: action.payload,
            }));
            state.status = 'succeeded';
        },
        initializeUsers(state) {
            if (state.lot) {
                state.users = [
                    {
                        id: '1',
                        name: 'John Doe',
                        avatar: 'https://example.com/avatar1.jpg',
                        company: 'Company A',
                        role: 'Buyer',
                        lot: state.lot,
                    },
                    {
                        id: '2',
                        name: 'Jane Smith',
                        avatar: 'https://example.com/avatar2.jpg',
                        company: 'Company B',
                        role: 'Seller',
                        lot: state.lot,
                    },
                ];
            }
        },
        addUser(state, action: PayloadAction<ITradingMember>) {
            state.users.push(action.payload);
        },
        setCurrentUserIndex(state, action: PayloadAction<number>) {
            state.currentUserIndex = action.payload;
        },
        setTimeLeft(state, action: PayloadAction<number>) {
            state.timeLeft = action.payload;
        },
        setInviteUserId(state, action: PayloadAction<string>) {
            state.inviteUserId = action.payload;
        },
        moveToNextUser(state) {
            state.currentUserIndex = (state.currentUserIndex + 1) % state.users.length;
            state.timeLeft = 15; // Сбрасываем таймер на 15 секунд
        },
        updateUserPayment(state, action: PayloadAction<{ userId: string; payment: string }>) {
            state.users = state.users.map((user) =>
                user.id === action.payload.userId
                    ? { ...user, lot: { ...user.lot, payment: action.payload.payment } }
                    : user
            );
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.status = 'failed';
        },
        setLoading(state) {
            state.status = 'loading';
            state.error = null;
        },
    },
});

export const {
    setLot,
    initializeUsers,
    addUser,
    setCurrentUserIndex,
    setTimeLeft,
    setInviteUserId,
    moveToNextUser,
    updateUserPayment,
    setError,
    setLoading,
} = tradingRoomSlice.actions;

export default tradingRoomSlice.reducer;
