import { configureStore } from '@reduxjs/toolkit';
import lotsReducer from '../../entities/lots/slice/lotsSlice';
import userReducer from '../../entities/user/slice/userSlice';

const store = configureStore({
    reducer: {
        lots: lotsReducer,
        user: userReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
