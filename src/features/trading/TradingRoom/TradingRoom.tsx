// TradingRoom.tsx

import React, { useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Table, Button, Input, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../app/store/store';
import {
    setLot,
    initializeUsers,
    addUser,
    setInviteUserId,
    moveToNextUser,
    setTimeLeft,
    updateUserPayment,
} from '../../../entities/trading/slice/tradingSlice';

const TradingRoom = () => {
    const { lotId } = useParams<{ lotId: string }>();
    const location = useLocation();
    const dispatch = useDispatch();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const {
        lot,
        users,
        currentUserIndex,
        timeLeft,
        inviteUserId,
    } = useSelector((state: RootState) => state.tradingRoom);

    // Получение лота
    const lotFromStore = useSelector((state: RootState) =>
        state.lots.lots.find((l) => l.id === lotId)
    );

    useEffect(() => {
        if (lotFromStore) {
            dispatch(setLot(lotFromStore));
        }
    }, [lotFromStore, dispatch]);

    useEffect(() => {
        if (lot) {
            dispatch(initializeUsers());
        }
    }, [lot, dispatch]);

    // Получение userId из параметров URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userId = params.get('userId');

        // Добавляем пользователя, если есть userId в URL
        if (userId && lot) {
            const newUser = {
                id: userId,
                name: `User ${userId}`,
                avatar: 'https://example.com/avatar.jpg',
                company: 'Company C',
                role: 'Participant',
                lot: lot,
            };
            dispatch(addUser(newUser));
        }
    }, [location.search, dispatch, lot]);

    // Таймер для переключения хода
    useEffect(() => {
        if (lot?.status === 'active') {
            if (timerRef.current) clearInterval(timerRef.current);

            timerRef.current = setInterval(() => {
                if (timeLeft <= 1) {
                    dispatch(moveToNextUser());
                } else {
                    dispatch(setTimeLeft(timeLeft - 1));
                }
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [lot?.status, timeLeft, dispatch]);

    const handlePaymentChange = (userId: string, value: string) => {
        dispatch(updateUserPayment({ userId, payment: value }));
    };

    const inviteUser = () => {
        const link = `http://localhost:3000/trading-room/${lotId}?userId=${inviteUserId}`;

        navigator.clipboard.writeText(link)
            .then(() => {
                message.success('Ссылка скопирована в буфер обмена!');
                dispatch(setInviteUserId(''));
            })
            .catch(() => {
                message.error('Не удалось скопировать ссылку.');
            });
    };

    const columns = [
        {
            title: 'Параметры',
            dataIndex: 'parameter',
            key: 'parameter',
        },
        ...users.map((user) => ({
            title: user.name,
            dataIndex: user.id,
            key: user.id,
            render: (text: any, record: any) => {
                if (record.key === 'payment') {
                    if (users[currentUserIndex].id === user.id && lot?.status === 'active') {
                        return (
                            <Input
                                value={user.lot.payment}
                                onChange={(e) => handlePaymentChange(user.id, e.target.value)}
                            />
                        );
                    } else {
                        return user.lot.payment;
                    }
                } else {
                    return user.lot ? (user.lot as any)[record.key] : '';
                }
            },
        })),
    ];

    const data = [
        {
            key: 'name',
            parameter: 'Название',
            ...users.reduce((acc, user) => ({ ...acc, [user.id]: user.lot?.name }), {}),
        },
        {
            key: 'term',
            parameter: 'Срок',
            ...users.reduce((acc, user) => ({ ...acc, [user.id]: user.lot?.term }), {}),
        },
        {
            key: 'payment',
            parameter: 'Платеж',
            ...users.reduce((acc, user) => ({ ...acc, [user.id]: user.lot?.payment }), {}),
        },
    ];

    const skipTurn = () => {
        dispatch(moveToNextUser());
    };

    // Функция для форматирования времени (мм:сс)
    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    };

    // Идентификатор текущего пользователя (замените на реальный ID)
    const currentUserId = '1'; // Здесь нужно получить реальный ID текущего пользователя

    if (!lot || users.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Торговая комната для лота {lot.name}</h1>
            {lot.status === 'active' && (
                <div>
                    <p>Ход пользователя: {users[currentUserIndex].name}</p>
                    <p>Осталось времени: {formatTime(timeLeft)}</p>
                    <Button onClick={skipTurn}>Пропустить ход</Button>
                </div>
            )}
            <Table columns={columns} dataSource={data} pagination={false} />
            <Input
                placeholder="Введите ID пользователя для приглашения"
                value={inviteUserId}
                onChange={(e) => dispatch(setInviteUserId(e.target.value))}
                style={{ width: 200, marginRight: 10 }}
            />
            <Button onClick={inviteUser}>Пригласить пользователя</Button>
        </div>
    );
};

export default TradingRoom;
