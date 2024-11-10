import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainPage } from '../../pages/MainPage/MainPage';
import { TradingRoomPage } from '../../pages/TradingRoomPage/TradingRoomPage';

const Router: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/trading-room/:lotId" element={<TradingRoomPage />} />
        </Routes>
    );
};

export default Router;
