import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function useAsyncStorage(key: string) {
  const [storedValue, setStoredValue] = useState<string | null>(null);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          setStoredValue(value);
        }
      } catch (error) {
        console.error('Failed to load the data from storage');
      }
    };

    loadStoredData();
  }, [key]);

  const setValue = async (newValue: string) => {
    try {
      await AsyncStorage.setItem(key, newValue);
      setStoredValue(newValue);
    } catch (error) {
      console.error('Failed to save the data to storage');
    }
  };

  return { storedValue, setValue };
}

export default useAsyncStorage;
