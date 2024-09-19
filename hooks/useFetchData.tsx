import { ICompetition, ICompetitions, SnackbarStatus } from '@__types/game.type';
import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@__store/hooks';
import {
  addCompetitionFunc,
  deleteCompetitionFunc,
  editCompetitionFunc,
  setCompetitionList,
} from '@__store/slices/competitionsStateSlice';
import { snackbarActionFunc } from '@__store/slices/snackbarSlice';

interface UseFetchDataReturn {
  sendData: (newItem: ICompetition) => void;
  editData: (updatedItem: ICompetition) => void;
  deleteData: (itemId: string) => void;
  getData: () => void;
  isLoading: boolean;
}

const useFetchData = (): UseFetchDataReturn => {
  const ipAddress = useAppSelector((state) => state.webSocketSlice.ipAddress);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previousCompetitions, setPreviousCompetitions] = useState<ICompetition[]>([]);

  const getData = useCallback(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      fetch(`http://${ipAddress}:2020/questions`)
        .then((response) => response.json())
        .then((data: ICompetitions) => {
          
          if (data && data.competitions) {
            if (
              JSON.stringify(data.competitions) !== JSON.stringify(previousCompetitions)
            ) {
              setPreviousCompetitions(data.competitions);
              dispatch(setCompetitionList(data.competitions));
              dispatch(
                snackbarActionFunc({
                  message: 'Pytania zostały pobrane',
                  status: 'SUCCESS',
                })
              );
            }
          }
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          dispatch(
            snackbarActionFunc({
              message: `Error fetching data: ${error}`,
              status: 'ERROR',
            })
          );
        });
    }, 1000);
    return () => clearTimeout(timeout);
  }, [ipAddress, previousCompetitions]);

  const sendData = useCallback(
    (newItem: ICompetition) => {
      fetch(`http://${ipAddress}:2020/competitions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      })
        .then((response) => response.json())
        .then((data: { newCompetition: ICompetition }) => {
          if (data && data.newCompetition) {
            dispatch(addCompetitionFunc(data.newCompetition));
            dispatch(
              snackbarActionFunc({
                message: 'Pytanie zostało dodane',
                status: 'SUCCESS',
              })
            );
          } else {
            dispatch(
              snackbarActionFunc({
                message: `Invalid data format: ${data}`,
                status: 'ERROR',
              })
            );
          }
        })
        .catch((error) =>
          dispatch(
            snackbarActionFunc({
              message: `Error adding competition: ${error}`,
              status: 'ERROR',
            })
          )
        );
    },
    [ipAddress]
  );

  const editData = useCallback(
    (updatedCompetition: ICompetition) => {
      if (!('id' in updatedCompetition)) {
        dispatch(
          snackbarActionFunc({
            message: 'Nie ma takiego wydarzenia o podanym id',
            status: 'ERROR',
          })
        );
        return;
      }
      fetch(`http://${ipAddress}:2020/competitions/${updatedCompetition.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCompetition),
      })
        .then((response) => response.json())
        .then(
          (data: {
            newCompetitionData: ICompetition;
            message: string;
            status: SnackbarStatus;
          }) => {
            if (data && data.newCompetitionData) {
              dispatch(editCompetitionFunc(data.newCompetitionData));
              dispatch(
                snackbarActionFunc({
                  message: data.message,
                  status: data.status,
                })
              );
            } else {
              dispatch(
                snackbarActionFunc({
                  message: 'Invalid data format:',
                  status: data.status,
                })
              );
            }
          }
        )
        .catch((error) =>
          dispatch(
            snackbarActionFunc({
              message: `Error updating competition: ${error}`,
              status: 'ERROR',
            })
          )
        );
    },
    [ipAddress]
  );

  const deleteData = useCallback(
    (itemId: string) => {
      fetch(`http://${ipAddress}:2020/competitions/${itemId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data: { message: string; status: SnackbarStatus }) => {
          if (data && data.message === 'Competition deleted successfully') {
            dispatch(deleteCompetitionFunc(itemId));
            dispatch(
              snackbarActionFunc({
                message: data.message,
                status: data.status,
              })
            );
          } else {
            dispatch(
              snackbarActionFunc({
                message: `Unexpected delete response: ${data}`,
                status: 'ERROR',
              })
            );
          }
        })
        .catch((error) =>
          dispatch(
            snackbarActionFunc({
              message: `Error deleting competition: ${error}`,
              status: 'ERROR',
            })
          )
        );
    },
    [ipAddress]
  );

  return { sendData, editData, deleteData, getData, isLoading };
};

export default useFetchData;
