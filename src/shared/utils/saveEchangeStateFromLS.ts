// utils/localStorageUtils.ts

import { TradingRoomState } from "../../entities/trading/slice/tradingSlice";

export const saveTradingRoomStateToLocalStorage = (lotId: string, state: TradingRoomState) => {
    try {
        localStorage.setItem(`tradingRoomState_${lotId}`, JSON.stringify(state));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};


export const loadTradingRoomStateFromLocalStorage = (lotId: string): TradingRoomState | null => {
    try {
        const savedState = localStorage.getItem(`tradingRoomState_${lotId}`);
        return savedState ? JSON.parse(savedState) : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
};

