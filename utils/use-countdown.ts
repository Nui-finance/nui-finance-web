import { useEffect, useMemo, useState } from 'react';

const getReturnValues = (countDown: number): string => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return `${days}d${hours}h${minutes}m${seconds}s`;
};

const useCountdown = (targetTimestamp: number): string => {
  const countDownDateInMs = useMemo(() => {
    if (targetTimestamp) {
      return new Date(targetTimestamp).getTime();
    } else {
      return 0;
    }
  }, [targetTimestamp]);

  const [countDown, setCountDown] = useState<number>(
    countDownDateInMs - new Date().getTime(),
  );
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDateInMs - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDateInMs]);

  // if targetTimestamp is undefined or on server side, return default value
  if (!targetTimestamp || !isMounted || isNaN(countDown)) {
    return '- - - - ';
  }

  // if already passed targetTimestamp, return 0, 0, 0, 0 to avoid negative value
  if (countDown < 0) {
    return '0d0h0m0s';
  }

  return getReturnValues(countDown);
};

export default useCountdown;
