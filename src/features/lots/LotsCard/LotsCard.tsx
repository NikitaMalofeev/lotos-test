import React, { useEffect, useState } from 'react';
import styles from './style.module.scss';
import { useTimer } from '../../../shared/hooks/useTimer';
import { Button, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../../../shared/helpers/dispatch';
import { deleteLotAsync, editLotStatus, updateLotStatusAsync } from '../../../entities/lots/slice/lotsSlice';
import { ILot } from '../../../entities/lots/model/lotsTypes';
import { useNavigate } from 'react-router-dom';
import { setLot } from '../../../entities/trading/slice/tradingSlice';
import { useAdminPermissions } from '../../../shared/hooks/useCheckPermissions';

interface LotsCardProps {
    lot: ILot;
    onEdit: (lot: ILot) => void;
}

export const LotsCard: React.FC<LotsCardProps> = ({ lot, onEdit }) => {
    const { name, term, payment, startDate, timeLeft: initialTimeLeft, status, id } = lot;
    const { timeLeft, startTimer, stopTimer } = useTimer(initialTimeLeft);
    const dispatch = useAppDispatch();
    const [isTimerRunning, setIsTimerRunning] = useState(status === 'active');
    const hasAdminPermission = useAdminPermissions();

    const navigate = useNavigate();

    const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if ((event.target as HTMLElement).closest('button')) {
            return;
        }

        if (status !== 'active') {
            message.error('Вы не можете войти в неактивную торговую комнату.');
        } else {
            dispatch(setLot(lot));
            navigate(`/trading-room/${lot.id}`);
        }
    };

    useEffect(() => {
        if (status === 'active' && initialTimeLeft > 0) {
            startTimer(initialTimeLeft);
            setIsTimerRunning(true);
        }
    }, [status, initialTimeLeft, startTimer]);

    const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        dispatch(deleteLotAsync(id));
    };

    const handleStartPause = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        if (status !== 'active') {
            dispatch(editLotStatus({ id, status: 'active' }));
            dispatch(updateLotStatusAsync({ id, status: 'active' }));
            startTimer(timeLeft || initialTimeLeft);
            setIsTimerRunning(true);
        } else {
            stopTimer();
            dispatch(editLotStatus({ id, status: 'paused' }));
            dispatch(updateLotStatusAsync({ id, status: 'paused' }));
            setIsTimerRunning(false);
        }
    };

    const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        onEdit(lot);
    };

    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
        return `${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    };

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.lotsCard} onClick={handleCardClick}>
            <div className={styles.lotsCard__name}>{name}</div>
            <div className={styles.lotsCard__details}>
                <span className={styles.lotsCard__term}>Срок: {term}</span>
                <span className={styles.lotsCard__payment}>Платеж: {payment} руб.</span>
                <span className={styles.lotsCard__date}>
                    Создан: {formatDate(startDate)}
                </span>
                <span className={styles.lotsCard__timer}>
                    Осталось времени: {formatTime(timeLeft)}
                </span>
                {hasAdminPermission && (
                    <Space className={styles.lotsCard__actions}>
                        <Button
                            icon={<EditOutlined />}
                            onClick={handleEdit}
                        />
                        <Button
                            icon={isTimerRunning ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                            onClick={handleStartPause}
                        />
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            onClick={handleDelete}
                        />
                    </Space>
                )}

            </div>
        </div>
    );
};
