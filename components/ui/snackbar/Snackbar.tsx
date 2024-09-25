import { colorBase } from '@__colors/colorBase';
import { resetSnackbar } from '@__store/slices/snackbarSlice';
import { ISnackbar } from '@__types/game.type';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Snackbar as PaperSnackbar } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { FullWindowOverlay } from 'react-native-screens';

interface SnackbarProps {
  snackbarAction: ISnackbar;
}

const Snackbar: React.FC<SnackbarProps> = ({ snackbarAction }) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const snackbarHideAfter = snackbarAction.snackbarHideAfter
    ? snackbarAction.snackbarHideAfter * 1000
    : 3000;

  useEffect(() => {
    if (snackbarAction.message) {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
        dispatch(resetSnackbar());
      }, snackbarHideAfter);

      return () => clearTimeout(timer);
    }
  }, [snackbarAction, dispatch, snackbarHideAfter]);

  const onDismissSnackBar = () => {
    setVisible(false);
    dispatch(resetSnackbar());
  };

  const getSnackbarStyle = () => {
    switch (snackbarAction.status) {
      case 'SUCCESS':
        return {
          backgroundColor: colorBase.successMain,
          borderColor: colorBase.successDark,
        };
      case 'EDIT':
        return {
          backgroundColor: colorBase.bluePastel,
          borderColor: colorBase.blueDark,
        };
      case 'ERROR':
        return {
          backgroundColor: colorBase.redDark,
          borderColor: colorBase.redLight,
        };
      default:
        return {
          backgroundColor: '#333',
          borderColor: '#333',
        };
    }
  };

  return (
    <FullWindowOverlay>
      <PaperSnackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={snackbarHideAfter * 1000}
        style={[styles.snackbar, getSnackbarStyle()]}
        action={{
          label: 'X',
          onPress: () => {
            onDismissSnackBar();
          },
        }}
      >
        <Text style={styles.snackbarText}>{snackbarAction.message}</Text>
      </PaperSnackbar>
    </FullWindowOverlay>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 8,
    zIndex: 10,
    borderWidth: 2,
    shadowColor: colorBase.backgroundDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  snackbarText: {
    fontSize: 18,
    letterSpacing: 1,
    fontWeight: '600',
    color: colorBase.whiteDefault,
  },
});

export default Snackbar;
