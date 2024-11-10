// middleware/tradingRoomMiddleware.ts

import { createListenerMiddleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { saveTradingRoomStateToLocalStorage } from '../../../shared/utils/saveEchangeStateFromLS';

const tradingRoomListenerMiddleware = createListenerMiddleware();

tradingRoomListenerMiddleware.startListening({
    predicate: (action, currentState, previousState) => {
        // Отслеживаем действия, изменяющие состояние tradingRoom
        return action.type.startsWith('tradingRoom/');
    },
    effect: (action, listenerApi) => {
        const state = listenerApi.getState() as RootState;
        const lotId = state.tradingRoom.lot?.id;
        if (lotId) {
            saveTradingRoomStateToLocalStorage(lotId, state.tradingRoom);
        }
    },
});

export default tradingRoomListenerMiddleware;
