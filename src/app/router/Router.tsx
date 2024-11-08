import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ExchangePage } from '../../pages/exchange';

const Router: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<ExchangePage />} />
        </Routes>
    );
};

export default Router;
