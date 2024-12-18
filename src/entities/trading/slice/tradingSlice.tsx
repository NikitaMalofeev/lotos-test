import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { ILot } from '../../lots/model/lotsTypes';
import { ITradingMember } from '../../user/model/userTypes';

export const setTradingRoomState = createAction<TradingRoomState>('tradingRoom/setTradingRoomState');

export interface TradingRoomState {
    lot: ILot | null;
    users: ITradingMember[];
    currentUserIndex: number;
    timeLeft: number;
    inviteUserId: string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    exchangeDrawer: {
        userCreate: boolean;
        endLot: boolean;
    };
    finalOffer: {
        userId: string;
        payment: string;
    } | null;
}

const initialState: TradingRoomState = {
    lot: null,
    users: [],
    currentUserIndex: 0,
    timeLeft: 30,
    inviteUserId: '',
    status: 'idle',
    error: null,
    exchangeDrawer: {
        userCreate: false,
        endLot: false,
    },
    finalOffer: null,
};

const tradingRoomSlice = createSlice({
    name: 'tradingRoom',
    initialState,
    reducers: {
        setLot(state, action: PayloadAction<ILot>) {
            state.lot = action.payload;
            state.status = 'succeeded';
        },
        initializeUsers(state) {
            if (state.lot) {
                state.users = [
                    {
                        id: '1',
                        name: 'John Doe',
                        avatar: 'https://example.com/avatar1.jpg',
                        company: 'ООО Газпром',
                        role: 'user',
                        lot: { ...state.lot },
                    },
                    {
                        id: '2',
                        name: 'Jane Smith',
                        avatar: 'https://example.com/avatar2.jpg',
                        company: 'ОАО ГОРТЕХСТРОЙ',
                        role: 'user',
                        lot: { ...state.lot },
                    },
                ];
            }
        },
        addUser(state, action: PayloadAction<ITradingMember>) {
            const newUser = { ...action.payload, lot: action.payload.lot || {} };
            state.users.unshift(newUser);
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
            state.timeLeft = 30;
            if (state.lot) {
                state.lot.lastPrice = state.lot.payment
            }
        },
        updateUserPayment(state, action: PayloadAction<{ userId: string; payment: string }>) {
            state.users = state.users.map((user) =>
                user.id === action.payload.userId
                    ? { ...user, lot: { ...user.lot, payment: action.payload.payment } }
                    : user
            );
        },
        updateUserLot(state, action: PayloadAction<{ userId: string; lotData: Partial<ILot> }>) {
            const { userId, lotData } = action.payload;
            state.users = state.users.map((user) =>
                user.id === userId ? { ...user, lot: { ...user.lot, ...lotData } } : user
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
        setExchangeDrawer(state, action: PayloadAction<{ userCreate?: boolean; endLot?: boolean }>) {
            state.exchangeDrawer = { ...state.exchangeDrawer, ...action.payload };
        },
        setFinalOffer(state, action: PayloadAction<{ userId: string; payment: string }>) {
            state.finalOffer = action.payload;
        },
        setLotStatus(state, action: PayloadAction<'active' | 'paused' | 'cancelled'>) {
            if (state.lot) {
                state.lot.status = action.payload;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setTradingRoomState, (state, action) => {
            if (action.payload.users.length > 0) {
                state.lot = action.payload.lot;
                state.users = action.payload.users;
                state.status = action.payload.status;
                state.error = action.payload.error;
                state.currentUserIndex = action.payload.currentUserIndex;
                state.timeLeft = action.payload.timeLeft;
                state.inviteUserId = action.payload.inviteUserId;
                state.exchangeDrawer = action.payload.exchangeDrawer;
                state.finalOffer = action.payload.finalOffer;
            } else {
                state.users =
                    state.users.length === 0
                        ? [
                            {
                                id: '1',
                                name: 'John Doe',
                                avatar: 'https://example.com/avatar1.jpg',
                                company: 'ООО Газпром',
                                role: 'user',
                                lot: { ...state.lot },
                            },
                            {
                                id: '2',
                                name: 'Jane Smith',
                                avatar: 'https://example.com/avatar2.jpg',
                                company: 'ОАО ГОРТЕХСТРОЙ',
                                role: 'user',
                                lot: { ...state.lot },
                            },
                        ]
                        : state.users;
            }
        });
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
    updateUserLot,
    setExchangeDrawer,
    setFinalOffer,
    setLotStatus,
} = tradingRoomSlice.actions;

export default tradingRoomSlice.reducer;
