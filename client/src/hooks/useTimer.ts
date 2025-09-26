
import { useState, useEffect } from 'react';

const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const useTimer = (startTime: Date | null) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      setElapsedTime(new Date().getTime() - startTime.getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return formatTime(elapsedTime);
};
