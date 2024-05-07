import { useState } from "react";

export const useLocalStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });
  const setValue = (newValue) => {
    setStoredValue(prevValue => {
      const updatedValue = typeof newValue === 'function' ? newValue(prevValue) : newValue;
      try {
        window.localStorage.setItem(keyName, JSON.stringify(updatedValue));
      } catch (err) {
        console.log(err);
      }
      return updatedValue;
    });
  };
  return [storedValue, setValue];
};