import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ExchangePage } from '../../pages/exchange';
import TradingRoom from '../../features/trading/TradingRoom/TradingRoom';

const Router: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<ExchangePage />} />
            <Route path="/trading-room/:lotId" element={<TradingRoom />} />
        </Routes>
    );
};

export default Router;
