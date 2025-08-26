import { useEffect, useState } from 'react';
import { UI_CONSTANTS } from '@/constants';

export function useDebounce<T>(value: T, delay: number = UI_CONSTANTS.DEBOUNCE_DELAY): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
