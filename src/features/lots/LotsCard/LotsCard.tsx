import React, { useEffect } from 'react';
import styles from './style.module.scss';
import { useTimer } from '../../../shared/hooks/useTimer';

interface LotsCardProps {
    name: string;
    term: string;
    payment: string;
    startDate: number;
    timeLeftForLot: number;
}

export const LotsCard: React.FC<LotsCardProps> = ({ name, term, payment, startDate, timeLeftForLot }) => {
    const { timeLeft, startTimer } = useTimer();

    useEffect(() => {
        startTimer(timeLeftForLot);
    }, [startTimer, timeLeftForLot]);

    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
        const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        return `${formattedDate} ${formattedTime}`;
    };

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.lotsCard}>
            <div className={styles.lotsCard__name}>{name}</div>
            <div className={styles.lotsCard__details}>
                <span className={styles.lotsCard__term}>Term: {term}</span>
                <span className={styles.lotsCard__payment}>Payment: {payment}</span>
                <span className={styles.lotsCard__date}>
                    Created At: {formatDate(startDate)}
                </span>
                <span className={styles.lotsCard__timer}>
                    Time Left: {formatTime(timeLeft)}
                </span>
            </div>
        </div>
    );
};
