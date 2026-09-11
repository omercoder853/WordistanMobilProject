// hooks/useTimer.js
import { useState, useEffect, useRef, useCallback } from 'react';

export default function useTimer( onTimeUp ) {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const remainingMsRef = useRef(0);
    const targetEndTimeRef = useRef(0);

    const onTimeUpRef = useRef(onTimeUp);
    onTimeUpRef.current = onTimeUp;

    useEffect(() => {
        if (!isRunning) return;
        targetEndTimeRef.current = Date.now() + remainingMsRef.current;

        const interval = setInterval(() => {
            const diff = targetEndTimeRef.current - Date.now();
            const currentRemainSec = Math.max(0, Math.ceil(diff / 1000));

            remainingMsRef.current = Math.max(0, diff);
            setTimeLeft(currentRemainSec);

            if (diff <= 0) {
                clearInterval(interval);
                setIsRunning(false);
                onTimeUpRef.current?.();
            }
        }, 250);

        return () => clearInterval(interval);
    }, [isRunning]);

    const start = useCallback(() => {
        if (remainingMsRef.current > 0) {
            setIsRunning(true);
        }
    }, []);

    const pause = useCallback(() => {
        setIsRunning(false);
        remainingMsRef.current = Math.max(0, targetEndTimeRef.current - Date.now());
    }, []);

    const set = useCallback((seconds) => {
        setIsRunning(false);
        remainingMsRef.current = seconds * 1000;
        setTimeLeft(seconds);
    }, []);

    const timer = { start, pause, set };

    return { timer, timeLeft, isRunning };
}