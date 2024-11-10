import { createAction } from "@reduxjs/toolkit";
import { TradingRoomState } from "../slice/tradingSlice";

export const setTradingRoomState = createAction<TradingRoomState>('tradingRoom/setTradingRoomState');