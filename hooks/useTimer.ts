import { useEffect } from 'react';

export default function useTimer(
  timerRunning: boolean,
  timeLeft: number,
  setTimeLeft: (t: number) => void,
  onTimeEnd?: () => void
) {
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timerRunning && timeLeft === 0 && onTimeEnd) {
      onTimeEnd();
    }
  }, [timerRunning, timeLeft, setTimeLeft, onTimeEnd]);
}