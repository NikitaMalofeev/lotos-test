// TradingRoom.tsx

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Table, Button, Input, message } from 'antd';
import { useSelector } from 'react-redux';
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
import AuthDrawer from '../../../features/user/AuthModal.tsx/AuthDrawer';
import { fetchLotsAsync } from '../../../entities/lots/slice/lotsSlice';
import { useAppDispatch } from '../../../shared/helpers/dispatch';
import { UserCreateLotDrawer } from '../UserCreateLotDrawer/UserCreateLotDrawer';

const TradingRoom = () => {
    const { lotId } = useParams<{ lotId: string }>();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [authVisible, setAuthVisible] = useState(false);
    const [userLotDrawerVisible, setUserLotDrawerVisible] = useState(false);

    const {
        lot,
        users,
        currentUserIndex,
        timeLeft,
        inviteUserId,
    } = useSelector((state: RootState) => state.tradingRoom);

    const user = useSelector((state: RootState) => state.user.user);

    // Управление видимостью AuthDrawer
    useEffect(() => {
        if (!user) {
            setAuthVisible(true);
        } else {
            setAuthVisible(false);
        }
    }, [user]);

    // Загрузка лотов
    useEffect(() => {
        dispatch(fetchLotsAsync());
    }, [dispatch]);

    // Получение лота из хранилища
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

    // Обработка userId из URL и добавление пользователя
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userIdParam = params.get('userId');

        if (userIdParam && lot && user) {
            if (user.id === userIdParam) {
                const userExists = users.some(u => u.id === user.id);
                if (!userExists) {
                    const newUser = {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar,
                        company: user.company,
                        role: user.role,
                        lot: {}
                    };
                    dispatch(addUser(newUser));
                    setUserLotDrawerVisible(true);
                }
            } else {
                message.error('Вы должны войти под приглашённым пользователем.');
            }
        }
    }, [location.search, dispatch, lot, user, users]);

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
            width: `${100 / (users.length + 1)}%`,
        },
        ...users.map((user) => ({
            title: user.name,
            dataIndex: user.id,
            key: user.id,
            width: `${100 / (users.length + 1)}%`,
            render: (text: any, record: any) => {
                if (record.key === 'payment') {
                    if (
                        user.id === currentUserId &&
                        users[currentUserIndex].id === currentUserId &&
                        lot?.status === 'active'
                    ) {
                        return (
                            <Input
                                value={user.lot.payment || ''}
                                onChange={(e) => handlePaymentChange(user.id, e.target.value)}
                                style={{ maxWidth: '200px' }}
                            />
                        );
                    } else {
                        return user.lot.payment || '';
                    }
                } else if (record.key === 'company') {
                    return user.company;
                } else {
                    return user.lot ? (user.lot as any)[record.key] || '' : '';
                }
            },
        })),
    ];


    const data = [
        {
            key: 'company',
            parameter: 'Компания',
            ...users.reduce((acc, user) => ({ ...acc, [user.id]: user.company }), {}),
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

    // Форматирование времени
    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    };

    // Идентификатор текущего пользователя
    const currentUserId = user ? user.id : null;

    if (!lot || users.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <AuthDrawer visible={authVisible} />
            {user && <UserCreateLotDrawer visible={userLotDrawerVisible} onClose={() => setUserLotDrawerVisible(false)} userId={user.id} />}
            <h1>Торговая комната для лота {lot.name}</h1>
            <Input
                placeholder="Введите ID пользователя для приглашения"
                value={inviteUserId}
                onChange={(e) => dispatch(setInviteUserId(e.target.value))}
                style={{ maxWidth: 200, marginRight: 10 }}
            />
            <Button onClick={inviteUser}>Пригласить пользователя</Button>
            {lot.status === 'active' && (
                <div>
                    <p>Ход пользователя: {users[currentUserIndex].name}</p>
                    <p>Осталось времени: {formatTime(timeLeft)}</p>
                    <div style={{ height: '50px' }}>
                        {users[currentUserIndex].id === currentUserId && (
                            <Button onClick={skipTurn}>Далее</Button>
                        )}
                    </div>

                </div>
            )}
            <Table columns={columns} dataSource={data} pagination={false} />
        </div>
    );
};

export default TradingRoom;
