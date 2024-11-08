import { useState, useEffect, useCallback } from 'react';

export const useTimer = () => {
    const [timeLeft, setTimeLeft] = useState(0);
    let intervalId: NodeJS.Timeout | null = null;

    const startTimer = useCallback((initialTime: number) => {
        setTimeLeft(initialTime);

        if (intervalId) {
            clearInterval(intervalId);
        }

        intervalId = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(intervalId!);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    }, []);

    useEffect(() => {
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []);

    return { timeLeft, startTimer };
};
