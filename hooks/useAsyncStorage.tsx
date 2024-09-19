import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '@__store/hooks';
import { snackbarActionFunc } from '@__store/slices/snackbarSlice';

function useAsyncStorage(key: string) {
  const [storedValue, setStoredValue] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          setStoredValue(value);
        }
      } catch (error) {
        dispatch(
          snackbarActionFunc({
            message: 'Failed to save the data to storage',
            status: 'ERROR',
          })
        );
      }
    };

    loadStoredData();
  }, [key]);

  const setValue = async (newValue: string) => {
    try {
      await AsyncStorage.setItem(key, newValue);
      setStoredValue(newValue);
    } catch (error) {
      dispatch(
        snackbarActionFunc({
          message: 'Failed to save the data to storage',
          status: 'ERROR',
        })
      );
    }
  };

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem(key);
      setStoredValue(null);
    } catch (error) {
      dispatch(
        snackbarActionFunc({
          message: 'Failed to save the data to storage',
          status: 'ERROR',
        })
      );
    }
  };

  return { storedValue, setValue, removeValue };
}

export default useAsyncStorage;
