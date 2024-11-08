import { useState, useEffect, useCallback, useRef } from 'react';

export const useTimer = (initialValue: number = 0) => {
    const [timeLeft, setTimeLeft] = useState(initialValue);
    const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = useCallback((initialTime: number) => {
        setTimeLeft(initialTime);

        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
        }

        intervalIdRef.current = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(intervalIdRef.current!);
                    intervalIdRef.current = null;
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    }, []);

    const stopTimer = useCallback(() => {
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, []);

    return { timeLeft, startTimer, stopTimer };
};
