import { useState, useEffect } from 'react';

/**
 * useState that syncs to localStorage so data survives a page refresh.
 * Falls back to the initial value if storage is unavailable or the value
 * can't be parsed.
 */
export default function usePersistedState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore quota / serialization failures — state still works in-memory.
    }
  }, [key, value]);

  return [value, setValue];
}
